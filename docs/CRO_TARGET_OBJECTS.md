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
version 5. It contains `.text`, `.rodata`, `.data`, and NOBITS `.bss` sections.
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
terminal instruction, and mode-correct alignment. Unknown text gaps remain
unowned.

The exporter address-sorts its output and rejects internal overlap. The
independent validator checks the public 145-unit manifest, exact deterministic
format, neutral naming, nonempty bodies, strict ordering, nonoverlap,
alignment, and bounds against the converted ELF `.text` section:

```sh
node scripts/validate-cro-symbols.mjs --self-test
node scripts/validate-cro-symbols.mjs symbols/cro/DllTitle.csv \
  build/AS_EUR_REV2/target/cro/DllTitle.o
```
