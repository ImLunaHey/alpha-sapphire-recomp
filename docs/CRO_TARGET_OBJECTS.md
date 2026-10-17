# CRO target objects

Pokémon Alpha Sapphire loads independent `CRO0` modules from RomFS. Each CRO
is a real linker unit: it has separate text, read-only data, writable data and
BSS segments, exports, imports, and loader relocations. The public project may
therefore represent each module as its own objdiff/ByteMatch unit, but the CRO
itself and every ELF containing its bytes remain ignored private artifacts.

## Private workflow

`scripts/extract-cro-modules.mjs` selectively copies the CROs and signed-module
support files to `$DECOMP_PRIVATE/cro-modules`. It does not extract unrelated
RomFS assets. Convert one module with:

```sh
node scripts/generate-cro-target-object.mjs \
  "$DECOMP_PRIVATE/cro-modules/DllTitle.cro" \
  build/AS_EUR_REV2/target/cro/DllTitle.o
```

The converter requires its CRO input to resolve outside the repository. An
output inside the repository must be ignored by Git; `build/` is the intended
location. It writes through a mode-0600 temporary file and atomically renames
the completed object.

The resulting file is deterministic ELF32 little-endian `ET_REL` for ARM EABI
version 5. It contains `.text`, `.rodata`, `.data`, and NOBITS `.bss` sections,
plus a non-allocating `.cro.module` identity marker used by later validation.
Those sections come from the CRO segment table, not from an invented contiguous
image. Empty reserved segments remain honest empty ELF sections.

## Relocations

The cartridge's modules store unresolved pointer words as zero. Their type-2
CRO patch records contain the addend and identify either an internal segment or
an imported symbol. The converter writes the addend into the ELF REL slot and
emits `R_ARM_ABS32`:

- internal patches target the appropriate local ELF section symbol;
- named imports retain their link name;
- indexed imports use
  `__cro_import_indexed_m<module-utf8-hex>_i<export-index>`;
- anonymous imports use
  `__cro_import_anon_m<module-utf8-hex>_s<segment>_<offset>`.

The hexadecimal encoding is reversible and collision-free. It avoids guesses
about an anonymous import's eventual reconstructed source name. A later public
alias manifest may replace these neutral identities once cross-module names are
proven.

Patch lists are walked from every named, indexed, and anonymous import until
their canonical end marker. The converter rejects overlapping lists, orphaned
records, duplicate output words, misaligned or out-of-range outputs, nonzero
reserved bytes, and already-resolved slots. Internal addends are preserved as
32-bit wrapping values: negative and one-past-segment addends are valid linker
arithmetic and are not mistaken for malformed file offsets.

The current converter deliberately fails on relocation types other than type
2 or on nonempty auxiliary relocation tables. The AS_EUR_REV2 audit converted
all 145 extracted CROs successfully under this rule; unsupported future inputs
must extend the format implementation and tests instead of silently dropping
relocations.

## Validation and clean-room boundary

Before conversion, the parser checks:

- the `CRO0` header, declared size, bounded table counts and byte ranges;
- all four header SHA-256 coverage regions;
- nonoverlapping metadata tables and canonical reserved segment slots;
- text/rodata placement in the hashed code blob and data placement in the
  hashed data blob;
- UTF-8 string-table bounds and NUL termination;
- export targets, import subtables, patch ownership, and relocation outputs.

Run the synthetic validator with:

```sh
node --check scripts/generate-cro-target-object.mjs
node --check scripts/validate-cro-target-object.mjs
node scripts/validate-cro-target-object.mjs --self-test
```

The test constructs a non-proprietary CRO fixture in memory. It checks all four
ELF segments, named/indexed exports, named/indexed/anonymous imports, internal
and external `R_ARM_ABS32` entries, exact addends and symbol classes, byte-exact
segment recovery after reversing REL slots, deterministic output, and hostile
mutations. No fixture or generated object is written to the repository.

## Complete partition and split objects

`scripts/split-cro-target-object.mjs` is the conservative second stage. It
accepts the ignored structural object plus a neutral JSON partition and emits:

- an ignored target object with one section per known function, explicit
  unmatched code gap, or literal/data pool, plus isolated
  non-allocating sections for objectively unknown residue; and
- an ignored clean-room base skeleton with the same section and symbol
  identities represented by payload-free NOBITS sections, a zero-sized BSS,
  and no target relocations.

The base is only a compilation/layout skeleton. It contains no target code or
data payload to receive accidental zero-byte or fuzzy-match credit. Real
clean-room source replaces these placeholders module by module. The progress
target materializes the structural BSS zero-initialization as zero-filled
PROGBITS so its full size remains in the data denominator; the empty base has
no BSS payload, avoiding objdiff's automatic same-size NOBITS credit.

The partition schema is deliberately separate from a functions-only discovery
CSV. It must classify every byte in `.text`; the splitter rejects overlaps and
implicit holes rather than guessing whether unknown bytes are ARM, Thumb, or a
pool:

```json
{
  "format": 1,
  "module": "DllTitle",
  "textSize": 48,
  "functions": [
    { "name": "func_00000000", "address": 0, "size": 24, "mode": "arm" }
  ],
  "gaps": [
    { "address": 24, "size": 8, "mode": "arm" }
  ],
  "pools": [
    { "address": 32, "size": 4 }
  ],
  "unknown": [
    { "address": 36, "size": 12 }
  ]
}
```

Function names must be unique ELF identifiers and may not use the reserved
`__cro_` prefix. Only accepted functions receive `STT_FUNC` identities; gaps
remain executable sections with mapping symbols but are not functions. Pools
receive neutral object identities. The tool assigns deterministic internal
names to gaps and pools. ARM
code is four-byte aligned and Thumb code is two-byte aligned. Pools and unknown
residue are byte-granular so proven odd-sized strings/data are never rounded or
silently claimed. All ranges must be nonempty, nonoverlapping, within
`textSize`, and form an exact partition from zero through the end of `.text`.
The inventory module and text size must agree with the structural object.

Use `unknown` instead of guessing when bytes cannot objectively be classified
as code or a pool. The target retains those bytes in `.cro.unknown.*` sections
with no allocation/execution flags and no global function or object symbol;
the base has a payload-free NOBITS section of the same logical extent.
Consequently unknown residue remains
visible and byte-accounted but cannot contribute a matched function or make a
unit complete. A relocation output cannot remain unknown because the
relocation itself is objective evidence for a word-sized pool entry.

Run the split only after that complete classification exists:

```sh
node scripts/split-cro-target-object.mjs \
  build/AS_EUR_REV2/target/cro/DllTitle.o \
  symbols/cro-partitions/DllTitle.json \
  build/AS_EUR_REV2/target/cro-split/DllTitle.o \
  build/AS_EUR_REV2/base/cro-split/DllTitle.o

node --check scripts/split-cro-target-object.mjs
node --check scripts/validate-split-cro-target-object.mjs
node scripts/validate-split-cro-target-object.mjs --self-test
```

Relocation output offsets are moved into their containing split sections. A
relocation is rejected if its four-byte output word crosses a partition
boundary. References to the original `.text` section are rebased to the
appropriate function, gap, or pool identity, including the low Thumb bit and
wrapping negative/one-past addends. `.rodata`, `.data`, and deterministic
undefined imports retain neutral structural identities. Original defined
globals are rewritten to neutral inventory or section identities so authored
target export names cannot become duplicate functions or leak into reports.

The synthetic test constructs the CRO and complete inventory in memory. It
checks deterministic target/base generation, byte-exact text reconstruction
after relocation rebasing, ARM and Thumb values/sizes, explicit gap and pool
coverage, isolated unknown residue, zero base payloads, and hostile malformed
inventories and ELFs.

## Target-aware semantic gate

The structural CSV validator proves canonical metadata and nonoverlap, but it
does not prove that every accepted byte is an instruction. Before publishing a
partition, run the independent target-aware gate:

```sh
node scripts/validate-cro-function-semantics.mjs \
  symbols/cro/DllTitle.csv \
  build/AS_EUR_REV2/target/cro/DllTitle.o \
  symbols/cro-partitions/DllTitle.json

node scripts/test-cro-function-semantics.mjs
```

The gate independently parses `.text`, `.symtab`, and `.rel.text`, then uses
GNU ARM objdump 2.44 to require exact, gap-free instruction tiling of every CSV
body in its declared ARM or Thumb mode. Undefined instructions, partial wide
instructions, and relocation output words inside functions are rejected. Every
text relocation word must instead fit wholly in a declared pool which cannot
overlap a function.

Four-byte bodies are fail-closed. ARM permits only `bx lr`, `mov pc, lr`, an
unconditional in-range aligned `b`, or the exact `ldr pc, [pc, #-4]` import
veneer. Thumb permits canonical `bx lr`, unconditional `b`/`b.w`, or the exact
four-byte `ldr.w pc, [pc]` veneer. Each veneer must have an undefined
`R_ARM_ABS32` import slot exactly at entry plus four, wholly covered by a pool.
Unknown or nonterminal one-instruction shapes are not accepted.

## Not yet a progress unit

CRO exports identify entry points but do not provide function extents. The
converter therefore emits exported text symbols with `STT_FUNC` and size zero.
That is intentionally insufficient for the repository's objdiff-unit gate.
Do not register a structural CRO object in `objdiff.json`, mark it complete, or
turn its entire `.text` section into a pseudo-function.

A CRO becomes a progress unit only after a separate, reviewable neutral
inventory proves nonzero ARM/Thumb function boundaries and preserves every
unclassified text gap as unmatched coverage. At that point a second stage may
split the structural `.text` and remap its relocations into per-function target
sections. Until that evidence exists, the structural object is a validated
input to analysis, not a ByteMatch denominator.

## Conservative function inventory

Run Ghidra 12.0.2 headlessly over one ignored converted target object with:

```sh
bash scripts/analyze-cro-target.sh DllTitle
```

The resulting `symbols/cro/DllTitle.csv` contains only the public unit name,
`.text` size, section-relative synthetic function names, ARM/Thumb mode, and
body sizes. Original export names, strings, bytes, imports, and private paths
are not emitted. A body is accepted only with known instruction mode, one
contiguous entry-rooted range, call or exported-entry evidence, an in-range
terminal instruction, exact contiguous Ghidra instruction coverage in one
known mode, no relocation output in the body, no flow reference from outside
the body into its interior, and mode-correct alignment. Internal branches are
permitted. Unknown text gaps remain unowned.

The exporter address-sorts its output and rejects internal overlap. The
independent validator checks the public 145-unit manifest, exact deterministic
format, neutral naming, nonempty bodies, strict ordering, nonoverlap,
alignment, and bounds against the converted ELF `.text` section:

```sh
node scripts/validate-cro-symbols.mjs --self-test
node scripts/validate-cro-symbols.mjs symbols/cro/DllTitle.csv \
  build/AS_EUR_REV2/target/cro/DllTitle.o
```

Generate every manifest-listed inventory with bounded parallelism:

```sh
node scripts/generate-cro-symbols.mjs --jobs 4
node scripts/generate-cro-symbols.mjs --jobs 4 --check
```

The batch driver requires the manifest and converted-target sets to contain the
same 145 modules. Every worker uses an isolated temporary Ghidra project and
staging directory under `DECOMP_PRIVATE`; every CSV passes the independent
validator and the target-aware semantic gate. Ghidra flow and listing evidence
selects candidates; the independent semantic gate separately decodes target
bytes and verifies short veneers/tails and relocation-owned pools. It does not
treat arbitrary undecoded bytes as code or data.

Publication happens only after the complete set succeeds. One rollback-safe
transaction replaces the CSVs, JSON partitions, ignored target split objects,
and ignored base split objects. `--check` regenerates all four artifact sets
and compares every byte without modifying them.
