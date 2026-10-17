# DllPhotoViewer: link boundaries and comparison blocker, analysis 02

## Scope, provenance, and evidence limits

Second analysis-role review, supplemented by a third bounded verification,
for Pokémon Alpha Sapphire `AS_EUR_REV2`, unit `cro/DllPhotoViewer`.
The second review was dated 2026-10-17, at repository baseline
`4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`. Read this with
[analysis 01](DllPhotoViewer_analysis_01.md) and
[the clean-room protocol](../../CLEAN_ROOM.md). The earlier behavioral
contract and unresolved interfaces remain unchanged.

The second round inspected public unit metadata and the repository's converter,
splitter, builder, and comparison configuration, and performed an entirely
synthetic comparison experiment. Its report that the root ignored `.env.local`
was absent reflected an unsuccessful configuration lookup; it did not establish
that the explicitly authorized root-checkout file was absent.

The third bounded verification, also dated 2026-10-17, used that exact
user-authorized ignored file, confirmed its ignored status, and used only its
private-root setting to locate this module. No alternate configuration,
directory search, or other game unit was used. The input matched the public
manifest's 16,384-byte size and SHA-256
`3c5f3ff7ce2749738458edd72f63648c64587abc0cd67a27fede1572176386f2`.
The parser validated its four embedded hash regions. Conversion and splitting
were performed in memory and reproduced the authorized root checkout's existing
structural and split target objects exactly. No private output was written.

Third-round repository revision: `c465e82f6ab8051b8cb9c108a538b7912f266f17`.
Tools used for this verification: Node.js 24.21.0 and the repository CRO
parser/converter, splitter, and validators at that revision. Inspection was
limited to this module's identity, integrity, ELF section/symbol/relocation
metadata, and the two resource-relocation addends already specified below.
No executable payload was decoded or displayed; no target disassembly,
resource contents, original export names, proprietary headers, or other units
were inspected. Behavioral observations beyond these metadata checks remain
inherited from analysis 01; no runtime or hardware behavior was measured.

Tools used in the earlier synthetic experiment: Node.js 24.21.0;
public objdiff-cli 3.8.2 Linux x86-64 release;
Arm GNU Toolchain 15.2.Rel1 GCC 15.2.1 and GNU binutils 2.45.1.20251203.
The latter tools were used only for synthetic compilation and ELF inspection.
That experiment was not rerun in the third verification.
No implementation, configuration, validator, progress report, or tracked
comparison configuration was changed. No commit was made.

## What the split ELF actually names

The following facts follow deterministically from the public
[partition](../../../symbols/cro-partitions/DllPhotoViewer.json) and
[splitter](../../../scripts/split-cro-target-object.mjs), and the function,
adjacent-pool, and helper identities were confirmed in the actual split target
metadata during the third verification.

| Boundary | ELF identity and contract |
| --- | --- |
| Initializer | Global `STT_FUNC` named `func_00000F20`, value 0, size 596, in `.text.func_00000F20` |
| Existing leaf | Global `STT_FUNC` named `func_0000133C`, value 0, size 8, in `.text.func_0000133C` |
| Adjacent pool | Global `STT_OBJECT` named `__cro_pool_00001174`, value 0, size 12, in `.pool.__cro_pool_00001174` |
| Local helper alias `H_0AC8` | Entry offset 0 in `.text.__cro_gap_00000ac8`; this is an executable gap, not an accepted function |
| Opaque resources | The local `STT_SECTION` symbol for `.rodata`, plus the addends below |

Every emitted content section has a local `STT_SECTION` symbol with empty ELF
string-table name, value 0, and size 0. Tools commonly display its section
name. **A gap key such as `__cro_gap_00000ac8` is not an emitted global symbol.**
There is no emitted ELF symbol called `H_0AC8`. The public gap extent does not
establish the helper's function extent or contract. Declaring an external C
function with either alias does not bind it to the existing local section
symbol.

The following resource bindings are inherited from analysis 01. They require
no recovered resource names or contents:

| Analysis alias | Target binding |
| --- | --- |
| `dispatch_ref` | `.rodata` section symbol + `0x354` |
| `config_a` | `.rodata` section symbol + `0x174` |
| `config_b` | `.rodata` section symbol + `0x1B0` |
| `attach_a` | `.rodata` section symbol + `0x010` |
| `attach_b` | `.rodata` section symbol + `0x018` |

These five aliases are not five global target ELF symbols. Inventing external
objects with these names would introduce different link identities. The target
pool has `R_ARM_ABS32` outputs at pool-relative offsets 0 and 4, respectively
against `.rodata + 0x354` and `.rodata + 0x1B0`; both relocation identities
and addends were confirmed in the actual split target metadata.
The other three resource addresses are computed relative to the latter
reference. The pool is separate from the 596-byte function symbol; resource
contents and extents remain unspecified and unmatched.

## Verified imported service bindings

Each `E_xxxx` in analysis 01 denotes a local veneer entry, not the imported
symbol itself. Its split code section is `.text.__cro_gap_` followed by the
entry offset as eight lowercase hexadecimal digits. Its pointer slot is in
`.pool.__cro_pool_` followed by entry-plus-four in the same format, at
pool-relative offset 0. These section identities are established by the
public partition. The third verification confirmed all 17 slots' relocation
identities in both the structural and split target objects.

For example, `E_0158` refers to the entry of
`.text.__cro_gap_00000158`. The separate slot in
`.pool.__cro_pool_0000015c` carries an `R_ARM_ABS32` relocation to the undefined
import. There is no global callable target symbol named `E_0158` or
`__cro_gap_00000158`.

The [public converter](../../../scripts/generate-cro-target-object.mjs)
defines each anonymous imported symbol as
`__cro_import_anon_m<M>_s0_<D>`, where `<M>` is the lowercase UTF-8 hexadecimal
encoding of its import-module identity and `<D>` is the segment-relative
destination, padded to seven lowercase hexadecimal digits. These placeholders
are notation, not literal ELF names. Each import is emitted as undefined
`STB_GLOBAL` / `STT_NOTYPE`, with value and size zero and default visibility;
the splitter preserves it.

The verified `<M>` component is `7c7374617469637c` for these 17 imports.
The following exact converter-generated anonymous ELF identities are published
only as the necessary linker interface. They contain no recovered service,
class, resource, or export names. The module component is retained in encoded
form; no source-level spelling or additional import manifest is supplied.

| Veneer alias | Exact undefined ELF symbol |
| --- | --- |
| `E_0008` | `__cro_import_anon_m7c7374617469637c_s0_0023480` |
| `E_0070` | `__cro_import_anon_m7c7374617469637c_s0_004e348` |
| `E_0158` | `__cro_import_anon_m7c7374617469637c_s0_023df9c` |
| `E_0160` | `__cro_import_anon_m7c7374617469637c_s0_023da5c` |
| `E_0168` | `__cro_import_anon_m7c7374617469637c_s0_023ddac` |
| `E_0170` | `__cro_import_anon_m7c7374617469637c_s0_000e088` |
| `E_0178` | `__cro_import_anon_m7c7374617469637c_s0_0262508` |
| `E_0180` | `__cro_import_anon_m7c7374617469637c_s0_03c4c04` |
| `E_0188` | `__cro_import_anon_m7c7374617469637c_s0_02619f0` |
| `E_0190` | `__cro_import_anon_m7c7374617469637c_s0_03c4bdc` |
| `E_0198` | `__cro_import_anon_m7c7374617469637c_s0_0271c10` |
| `E_01A0` | `__cro_import_anon_m7c7374617469637c_s0_0271bf8` |
| `E_01A8` | `__cro_import_anon_m7c7374617469637c_s0_02611d8` |
| `E_01B0` | `__cro_import_anon_m7c7374617469637c_s0_03c4bf0` |
| `E_01B8` | `__cro_import_anon_m7c7374617469637c_s0_02623d8` |
| `E_01C0` | `__cro_import_anon_m7c7374617469637c_s0_03c4b48` |
| `E_01C8` | `__cro_import_anon_m7c7374617469637c_s0_025c448` |

For each entry, the third verification confirmed one `R_ARM_ABS32` output at
offset 0 of the corresponding pointer-slot pool, targeting the exact undefined
`STB_GLOBAL` / `STT_NOTYPE` symbol with zero value/size and default visibility.
The splitter preserved the converter's identity exactly. This closes the
import-module/full-spelling evidence gap for these entries only.
These spellings identify the veneer's pointer-slot relocations, not relocations
on the initializer's calls.
Calling the ultimate import directly would also bypass the original local
veneer boundary.

The behavioral ABI stays as specified in analysis 01, including the unresolved
register/result dependency between `H_0AC8` and `E_0070`. This supplement adds
no callee prototype, helper implementation, resource definition, or ownership
claim.

## Resolved calls versus relocations

Analysis 01 reports no relocation output inside either accepted function.
The third verification independently confirmed zero relocation records for
both `.text.func_00000F20` (596 bytes) and `.text.func_0000133C` (8 bytes) in
the actual split object. All 186 emitted relocation records were type
`R_ARM_ABS32`, with the relevant import/resource outputs in separate pools.
As recorded in analysis 01, the initializer calls are already resolved transfers to local veneer/helper
entries in the original module's text address space. They are not ELF
`R_ARM_CALL` relocations to the anonymous imports.

The converter emits only the supported CRO type-2 pointer relocations as
`R_ARM_ABS32`. The splitter copies each body's payload into its own section and
rebases only existing relocation records and their addends. It neither
synthesizes call relocations nor rewrites resolved transfers or PC-relative
literal references. Thus the initializer's split section still has zero
relocations, while the relevant pointer relocations remain in separate pools.
Original module-relative transfer encodings do not become symbolic references
merely because their destinations now occupy other ELF sections.

The [current builder](../../../scripts/build-cro-base.mjs) compiles C using
function/data sections and combines authored objects using `ld -r`, followed
by bookkeeping-section removal. It supplies no module-layout linker script,
bindings for these gaps/resources, or call-relocation resolution stage.
An unresolved external-call relocation therefore remains in its output.
Putting an adjacent C literal pool in the function's section also does not
reproduce the target's separately named pool section automatically.

## Evidenced comparison blocker

The repository pins objdiff 3.8.2 and its generated comparison configuration
does not override function-relocation comparison. The upstream
[configuration schema](https://github.com/encounter/objdiff/blob/v3.8.2/objdiff-core/config-schema.json)
defaults `functionRelocDiffs` to `name_address`.
[Its comparison code](https://github.com/encounter/objdiff/blob/v3.8.2/objdiff-core/src/diff/code.rs)
distinguishes a resolved branch operand from a relocation operand under that
setting. The
[ARM implementation](https://github.com/encounter/objdiff/blob/v3.8.2/objdiff-core/src/arch/arm.rs)
renders supported call relocations symbolically. Knowing the imported name
does not remove that representational difference.

A non-proprietary, 16-byte C probe with one external service call was compiled
with the builder's ARM C settings, combined with `ld -r`, and stripped of the
same bookkeeping sections. Its candidate retained one `R_ARM_CALL`. A second
synthetic object was made by removing only that relocation section; independent
section extraction confirmed identical executable payloads. No target-derived
code was used. One-shot objdiff 3.8.2 results were:

- Unchanged candidate compared with itself: **100%**.
- Relocation-free synthetic target compared with the candidate, defaults:
  **98.75%**.
- The same pair with `functionRelocDiffs=none`: **100%**.

This isolates the relocation mismatch from compiler code generation. The
relaxed result is a diagnostic control, not an authorized change to the
repository's comparison gate. It also shows why a reported score must not be
treated as proof of byte-for-byte identity or correct link behavior.

**Blocker:** a compiler-generated initializer section that retains external
call relocations cannot obtain an exact function match against this
relocation-free target body under the current split/build/default-objdiff
conventions, even if its behavior, service names, and other instructions match.
This conclusion combines the target metadata independently reconfirmed in the
third verification with the earlier synthetic toolchain/comparison experiment;
it is not a new target comparison result. Verified import spellings do not
change the target body's zero-relocation representation.
It does not prove that every possible independently authored implementation is
impossible, nor identify the original compiler. A future reviewed layout/link
stage or different canonical representation could address the discrepancy;
neither exists in the inspected workflow, and neither was added here.

Section names alone do not solve resolved calls, the separated literal pool,
or the helper/resource contracts. Keep the initializer uncredited until the
binding evidence, comparison representation, and independent implementation
have each passed their own review. Existing leaf credit and all unclaimed
coverage remain as described in analysis 01.

## Checks and handoff

- Public partition parsing confirmed all 17 veneer code/slot section identities,
  the local helper's containing gap, the initializer, and the adjacent pool.
- The repository split-object synthetic self-test passed, including relocation
  rebasing, payload-free bases, and its 14 hostile cases.
- The synthetic relocation experiment above passed its unchanged-object and
  identical-payload controls. It did not exercise the game or certify the
  initializer's machine-code match.
- Third verification: the authorized ignored configuration was present; the
  module matched the public manifest's size/hash, passed CRO integrity parsing,
  and reproduced the existing structural and split objects exactly in memory.
- Third verification: both function sections had zero relocations; all 17
  anonymous import-slot bindings, the helper's local section identity, and the
  adjacent pool's two resource relocations/addends were confirmed.
- Third-round checks passed: `bash scripts/check-no-rom.sh`, direct execution
  of `node scripts/validate-cro-photo-viewer-01.mjs`, converter and splitter
  synthetic self-tests (20 and 14 hostile cases respectively), and syntax
  checks for the converter, splitter, and unit validator. The unit validator
  retained 8/604 accepted code bytes, 0/1,456 data bytes, and incomplete status.
- `git diff --check` passed. A separate review of this untracked supplement
  confirmed 17 unique neutral import identities, no private paths or setting
  assignments, no raw code blocks, and no trailing whitespace. The tracked-file
  safety scanner alone does not cover an untracked document.
- Only this supplemental specification was edited. The naming objection is
  closed for the listed imports; the comparison blocker and unresolved
  behavioral/helper/resource contracts remain. No new implementation or match
  credit is approved.
