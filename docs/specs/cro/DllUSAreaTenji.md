# DllUSAreaTenji neutral specification

## Provenance and clean-room boundary

This is an analysis specification for the genuine `cro/DllUSAreaTenji` link
unit only. It does not contain target instructions, encoded instruction
directives, target strings, or copied target tables. An implementation author
may use the interfaces and behavior below, but must not inspect the target CRO,
target object, disassembly, or any private analysis notes.

- Target: `AS_EUR_REV2`, public CRO identity SHA-256
  `0be4a02266fe066248f74ffc0de5ef0dbcea7b9d4c83efd64161cb9064e363c8`,
  container size 12,288 bytes.
- Repository baseline: `4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`.
- Observation date: 2026-10-17.
- Evidence: the ignored, privately verified CRO was converted with
  `scripts/generate-cro-target-object.mjs`; the public inventory and partition
  were checked with `validate-cro-symbols.mjs` and
  `validate-cro-function-semantics.mjs`; section, symbol, and relocation facts
  were inspected with GNU `readelf` 2.46 and GNU ARM `objdump` 2.44. The
  repository's converter and validators are the authority for CRO semantics.

## Link-unit shape

The converted target is ELF32 little-endian ARM EABI5. All executable ranges
are ARM mode and four-byte aligned.

| Section | Size | Alignment | Requirement |
| --- | ---: | ---: | --- |
| `.text` | `0x2C0` | 4 | Exact range layout below |
| `.rodata` | `0xC4` | 4 | Read-only, 20 relocations |
| `.data` | `0x04` | 4 | One zero-initialized word |
| `.bss` | `0x10` | 4 | Four zero-initialized words |

The CRO header's overall BSS allocation field is `0x30`; the converted link
unit's actual BSS segment is `0x10`. The other two CRO segment slots are empty.
The module has one named text export at `0x210`, no indexed exports, ten
anonymous imports, ten import patches, and 32 internal relocation records.
Every relocation is `R_ARM_ABS32`; there are 22 in `.text` and 20 in
`.rodata`. There are no relocations in `.data` or `.bss`.

## Complete text partition

The following ranges cover every byte of `.text` exactly. `function` means an
accepted public entry satisfying the repository's target-aware semantic gate.
`gap` is decoded executable material that lacks an acceptable contiguous
function identity. `unknown` remains non-allocating and non-executable in the
split target. Pools contain literal words or relocated pointers.

| Range | Kind | Neutral identity or observation |
| --- | --- | --- |
| `0x000–0x004` | function | `func_00000000`, import veneer for I0 |
| `0x004–0x008` | pool | I0 relocation word |
| `0x008–0x00C` | function | `func_00000008`, import veneer for I1 |
| `0x00C–0x010` | pool | I1 relocation word |
| `0x010–0x014` | function | `func_00000010`, import veneer for I2 |
| `0x014–0x018` | pool | I2 relocation word |
| `0x018–0x01C` | function | `func_00000018`, import veneer for I3 |
| `0x01C–0x020` | pool | I3 relocation word |
| `0x020–0x024` | function | `func_00000020`, import veneer for I4 |
| `0x024–0x028` | pool | I4 relocation word |
| `0x028–0x02C` | function | `func_00000028`, import veneer for I5 |
| `0x02C–0x030` | pool | I5 relocation word |
| `0x030–0x034` | function | `func_00000030`, import veneer for I6 |
| `0x034–0x038` | pool | I6 relocation word |
| `0x038–0x03C` | function | `func_00000038`, import veneer for I7 |
| `0x03C–0x040` | pool | I7 relocation word |
| `0x040–0x07C` | gap | Small callback bodies; see behavior notes |
| `0x07C–0x1A0` | function | `func_0000007C`, 292 bytes |
| `0x1A0–0x1A4` | pool | `.rodata + 0x00` |
| `0x1A4–0x1C4` | gap | Conditional wrapper around `func_0000007C` |
| `0x1C4–0x1D8` | unknown | Routine-shaped triple-word initializer without independent entry evidence |
| `0x1D8–0x1DC` | pool | `.rodata + 0x8C` |
| `0x1DC–0x1E4` | gap | I7 tail veneer followed by a return stub |
| `0x1E4–0x204` | unknown | Routine-shaped BSS initializer without acceptable entry evidence |
| `0x204–0x210` | pool | Two floating literals and one `.bss + 0` pointer |
| `0x210–0x224` | gap | Exported control-entry prefix |
| `0x224–0x238` | pool | Five-entry internal jump table |
| `0x238–0x298` | gap | Exported control-entry case bodies |
| `0x298–0x2C0` | pool | Control literals and six relocated pointers |

The accepted inventory is therefore nine functions and 324 function bytes
(46.02% conservative text coverage), five executable gaps totaling 216 bytes,
13 pools totaling 112 bytes, and two unknown ranges totaling 52 bytes. The
export at `0x210` is a real routine but contains its relocated jump table
inside its extent. The current partition schema cannot represent that as one
function without placing relocation output words inside a function, which the
semantic gate correctly rejects. The `0x1C4` and `0x1E4` bodies are retained
as unknown because decoded routine shape alone is not accepted entry evidence.

## Accepted function behavior

`func_00000000` through `func_00000038` are eight four-byte import veneers.
Each transfers control without changing arguments to the corresponding I0-I7
identity below.

`func_0000007C(context)` reads a current 16-bit area value through this
pointer chain: `context + 8`, then `+0x60`, `+0x1C`, `+0x28`, and finally
`+0x0C`. It iterates exactly four read-only records, each ten bytes wide:

- record `+0x00`, `+0x02`, `+0x04`, and `+0x08` are 16-bit fields;
- record `+0x06` and `+0x07` are byte fields;
- a record is eligible when its first field is at least 536, or equals the
  current area value;
- when byte `+0x06` is nonzero, I0 is called with the nested field object plus
  `0x13140` and field `+0x08`; processing stops for this record if I0 returns
  zero. Otherwise I1 is called with the object at `context[8] + 0x170` and the
  16-bit fields at `+0x02` and `+0x04`;
- when byte `+0x06` is zero, I2 supplies the object instead;
- a null supplied object skips the record;
- when byte `+0x07` is zero, I3 is called with `(object, 0)`. If its scalar
  result is strictly below `1.0f`, I4 is called with `(object, 0)`;
- when byte `+0x07` is one, I5 is called with the object and I6 is called with
  `(object, 0)` only if I5 returns nonzero;
- other byte `+0x07` values perform neither action.

The function returns no defined scalar result. It preserves the standard ARM
callee-saved registers used by its body.

## Unaccepted executable behavior

These facts enable an implementation without promoting ranges past the public
gate:

- `0x040`, `0x044`, `0x048`, `0x04C`, and `0x050` are immediate return stubs.
- `0x054`, `0x05C`, and `0x070` return zero; `0x064` immediately returns;
  `0x068` returns one. `0x078` is a no-op prefix that falls through to
  `func_0000007C`, and is also a relocated callback target.
- The `0x1A4` wrapper tests bit 3 of the word at second-argument `+0x48`, calls
  `func_0000007C(first_argument)` only when set, and always returns zero.
- The `0x1C4` body writes a relocated read-only pointer at output `+0`, and
  copies its second argument to output `+4` and `+8`, then returns.
- `0x1DC` tail-transfers to I7. `0x1E0` immediately returns.
- The `0x1E4` body initializes four consecutive BSS floats: two copies of
  `0.7f`, then two copies of `1.0f`.
- The exported `0x210` control entry accepts `(output, selector)`. Selectors
  zero through four dispatch through the five-entry pool. Case 0 stores zero
  to `output[0]`; case 1 stores `output` in the module data word; case 2 loads
  that word into `output[0]`; case 3 writes the `0x1E4` entry pointer and the
  one-past-text address to `output[0..1]`; case 4 writes the one-past-rodata
  address to both words. Successful cases return zero. The out-of-range path
  performs no stores and returns the final opaque diagnostic value
  `0xD8E12C21` after loading `0x30000000` and `0x30000026` in sequence.

## Import identities and observed ABI

The identities are the converter's reversible neutral names; no guessed SDK
or game symbol names are introduced.

| Slot | Neutral identity | Observed use |
| --- | --- | --- |
| I0 | `__cro_import_anon_m7c7374617469637c_s0_002fd48` | `(pointer, u16) -> boolean-like` |
| I1 | `__cro_import_anon_m446c6c4669656c64_s0_0087014` | `(manager, u16, u16) -> pointer` |
| I2 | `__cro_import_anon_m7c7374617469637c_s0_02dc63c` | supplies a pointer; other incoming registers are not constrained by this unit |
| I3 | `__cro_import_anon_m446c6c4669656c64_s0_00d8e40` | `(pointer, 0) -> scalar return in VFP `s0` |
| I4 | `__cro_import_anon_m446c6c4669656c64_s0_0015d34` | `(pointer, 0)` |
| I5 | `__cro_import_anon_m446c6c4669656c64_s0_00d8eb0` | `(pointer) -> boolean-like` |
| I6 | `__cro_import_anon_m446c6c4669656c64_s0_00158d4` | `(pointer, 0)` |
| I7 | `__cro_import_anon_m7c7374617469637c_s0_01ff8c0` | tail target; no local ABI evidence |
| I8 | `__cro_import_anon_m7c7374617469637c_s1_005a458` | read-only descriptor pointer only |
| I9 | `__cro_import_anon_m7c7374617469637c_s1_005a468` | read-only descriptor pointer only |

## Exact relocation contract

All addends are unsigned 32-bit ELF REL addends. The eight veneer pools at
`0x004, 0x00C, 0x014, 0x01C, 0x024, 0x02C, 0x034, 0x03C` target I0 through I7
respectively, each with addend zero.

The remaining `.text` relocations are:

| Output | Target + addend |
| ---: | --- |
| `0x1A0` | `.rodata + 0x00` |
| `0x1D8` | `.rodata + 0x8C` |
| `0x20C` | `.bss + 0x00` |
| `0x224, 0x228, 0x22C, 0x230, 0x234` | `.text + 0x238, 0x240, 0x248, 0x254, 0x264` respectively |
| `0x298` | `.data + 0x00` |
| `0x2A0` | `.text + 0x2BC` |
| `0x2A4` | `.text + 0x2C0` (one past text) |
| `0x2A8, 0x2AC` | `.rodata + 0xC4` (one past rodata) |
| `0x2BC` | `.text + 0x1E4` |

The `.rodata` relocations are:

| Output | Target + addend |
| ---: | --- |
| `0x28` | I8 + 0 |
| `0x2C` | `.rodata + 0x3C` |
| `0x30` | I9 + 0 |
| `0x34` | `.rodata + 0x5A` |
| `0x38` | `.rodata + 0x28` |
| `0x88` | `.rodata + 0x30` |
| `0x8C, 0x90` | `.text + 0x1E0, 0x1DC` respectively |
| `0x94, 0x98, 0x9C, 0xA0, 0xA4, 0xA8, 0xAC` | `.text + 0x68, 0x78, 0x44, 0x40, 0x4C, 0x64, 0x48` respectively |
| `0xB0, 0xB4, 0xB8, 0xBC, 0xC0` | `.text + 0x5C, 0x70, 0x1A4, 0x54, 0x50` respectively |

## Read-only data and completion blocker

The `0xC4` read-only section has this neutral organization:

- `0x00–0x28`: four ten-byte behavior records consumed by
  `func_0000007C`;
- `0x28–0x3C`: a five-word relocated descriptor structure;
- `0x3C–0x81`: two NUL-terminated type-identity strings;
- `0x81–0x88`: sentinel and alignment bytes;
- `0x88–0xC4`: a 15-word relocated callback table.

The exact 40-byte behavior table, the two target strings, and the nonrelocated
sentinel bytes have no independent public provenance in the repository.
Clean-room policy forbids copying them from the binary into source or this
specification. This is a concrete blocker to a byte-identical complete unit:
even if every executable range and relocation is independently reimplemented,
the base object cannot equal the target object until those bytes are derived
from an admissible independent source or a reviewed policy-compliant generator.

The current module must therefore remain `metadata.complete: false`. In
addition, the `0x210` embedded jump table and the two unknown ranges must be
accounted for by any eventual stronger complete-unit validator; 100% score on
the nine accepted functions is not completion.
