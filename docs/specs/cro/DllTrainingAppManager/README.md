# DllTrainingAppManager clean-room analysis specification

## Scope and provenance

This is an analysis-only specification for `AS_EUR_REV2` module
`cro/DllTrainingAppManager`. It does not contain implementation source, raw
disassembly, encoded instructions, target binaries, extracted assets, or
Nintendo SDK material.

- Target revision: `AS_EUR_REV2`
- Public module identity: 12,288-byte CRO, SHA-256
  `2efd1771347678bb17047496c8480ae6695faa27f05803d6aa0ed0ff84ef7117`
- Repository baseline inspected: `4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`
- Observation date: 2026-10-17
- Evidence: the lawfully supplied external CRO and the repository-generated
  structural/split target object, both outside the checkout
- Tools: repository CRO parser/splitter; GNU Arm objdump 2.45.1 from Arm GNU
  Toolchain 15.2.Rel1; GNU readelf; independent byte-range and relocation
  parsing scripts

The observations below are neutral interface, layout, control-flow, and
behavior facts intended for a separate implementation author who has no
access to the target or its disassembly.

## Complete section accounting

| Section | Size | Alignment | Meaning |
| --- | ---: | ---: | --- |
| `.text` | `0xD58` (3,416) | 4 | 3,024 executable bytes and 392 bytes of import slots, jump tables, literals, and address pools |
| `.rodata` | `0x104` (260) | 4 | RTTI descriptors/names plus four dispatch/vtable-like records |
| `.data` | `0x4` | 4 | one zero-initialized mutable pointer-sized slot |
| `.bss` | `0x4C` (76) | 4 | two float-parameter blocks, initialized at runtime |

Pre-relocation SHA-256 values are:

| Section | SHA-256 |
| --- | --- |
| `.text` | `70c334e0f746536ea35e8d27fa4c08786684b0ab9f7c2eb9fe8712815bfb043e` |
| `.rodata` | `ce1b5237d4b7fb4ce8ff5964f018f4585e354121666ed8f9571dfb1f53ccaff1` |
| `.data` | `df3f619804a92fdb4057192dc43dd748ea778adc52bc498ce80524c014b81119` |
| 76 zero BSS bytes | `f2c0d5456a983ecd12e314fcfa19879179fc8424343baeb1325457472ae85601` |

All code is ARM state. There is no Thumb code. The unit has 61 logical
functions: 40 four-byte anonymous-import trampolines and 21 local routines.
There are two named exports, targeting `0xCA8` and `0xBE4`; their binary names
are deliberately not reproduced here.

The target contains 47 anonymous import identities, 51 import patch records,
and 64 internal relocations. `relocations-and-data.md` accounts for all 115
relocation records and all non-code bytes.

## Previously unknown ranges

Every range listed as `unknown` in the baseline partition is now classified:

| Range | Classification |
| --- | --- |
| `0x0C0..0x0C3` | anonymous-import trampoline; its address pool is `0x0C4..0x0C7` |
| `0x55C..0x577` | completion-query/tail-dispatch function |
| `0xBF4..0xC6F` | BSS float-table initializer |
| `0xC7C..0xC9B` | scalar floating-point literal pool plus one BSS relocation slot |
| `0xCA0..0xCA7` | final two floating-point literals for the initializer |

There is no semantically unknown target residue after this analysis. The
public CSV/partition was not rewritten because its current schema cannot
represent a single logical function split by an embedded jump table without
misstating a function boundary. The exact fragment map in `inventory.md` is
the authoritative handoff for a unit-specific linker/validator.

## Clean-room completion assessment

The executable behavior, layout, pools, data, BSS, and relocations are fully
characterized. A byte-identical implementation of the code and numeric data
appears feasible in readable ARM assembly.

A genuine clean-room full link is nevertheless blocked by 113 bytes of four
target-derived RTTI name strings at `.rodata+0x28..0x98`. The request forbids
copying binary strings, and those spellings are not available from an allowed
public source. This specification records only their spans and hashes. The
three bytes at `0x99..0x9B` are a non-string sentinel. Until an independently
derived, legally permissible source supplies those four names, the unit must
remain `metadata.complete: false`, even if all 3,416 code bytes and the other
151 rodata/data bytes match.
