# DllFieldEventSkatePipe clean-room analysis

## Scope and provenance

This is an analysis-only handoff for `cro/DllFieldEventSkatePipe` from
`AS_EUR_REV2`. The target is the 16,384-byte CRO identified by SHA-256
`f3e4821db520afd3a5dd13c281a01a2d9cc70cd51d6dd37780c474f76a71f72f` in
the public inventory. Observations were made on 2026-10-17 from the public
inventory and partition, the current objdiff report, and a deterministic ELF
conversion of the ignored private target. The converter and semantic gate are
the repository tools described in `docs/CRO_TARGET_OBJECTS.md`; instruction
inspection used GNU Arm binutils 2.44 in ARMv6K/VFPv2 mode.

No implementation source for this unit was read or authored. In particular,
the existing `contract_06.S` was outside the analysis evidence set. No CRO,
target object, disassembly transcript, raw byte dump, string, table, asset,
SDK material, or private path is included here.

## Authoritative current accounting

The public inventory accepts two ARM functions. Their addresses below are
offsets in the original CRO `.text` segment; objdiff's synthetic addresses in
the split object are not source addresses.

| Function | Text offset | Bytes | Instructions | Current result |
| --- | ---: | ---: | ---: | --- |
| `func_000009EC` | `0x000009EC` | 216 | 54 | unmatched |
| `func_00000BD4` | `0x00000BD4` | 88 | 22 | exactly matched by contract 06 |

The complete 6,156-byte text partition is:

| Class | Ranges | Bytes |
| --- | ---: | ---: |
| accepted functions | 2 | 304 |
| executable gaps | 74 | 5,408 |
| literal/relocation pools | 73 | 388 |
| unknown residue | 3 | 56 |
| **total** | **152** | **6,156** |

The unknown intervals are `[0x0FBC,0x0FC4)`, `[0x12A8,0x12B0)`, and
`[0x1730,0x1758)`. They are deliberately non-allocating in the split target
and can neither earn match credit nor satisfy the complete-unit gate.

The target's other allocated sections are 568 bytes of `.rodata`, four bytes
of `.data`, and 16 bytes of `.bss`. Thus the current report's 976-byte data
denominator is exactly 388 pool + 568 read-only + 4 writable + 16 zero-fill
bytes. Its 304-byte code denominator is the two accepted function bodies; 88
bytes and one function match. `metadata.complete` is correctly `false`.

For bounded identity checks, the structural target section SHA-256 values are:

| Material | Bytes | SHA-256 |
| --- | ---: | --- |
| `.text` | 6,156 | `f21e0f28f3e71cd1a5fc4cef31698a3bdef2240982e3f6db3d796579a1256d47` |
| `.rodata` | 568 | `b943e114578a583d6fb860ed561e808a4062a4c1db1662e4542688426b7b7b4f` |
| `.data` | 4 | `df3f619804a92fdb4057192dc43dd748ea778adc52bc498ce80524c014b81119` |

These hashes are verification identities, not permission to copy or embed the
hashed target material.

## Relocation inventory

All 153 loader patches become `R_ARM_ABS32` relocations in the structural ELF.
There are no function-body relocation outputs.

| Output section | External | To `.text` | To `.rodata` | To `.data` | To `.bss` | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `.text` | 58 | 8 | 4 | 1 | 1 | 72 |
| `.rodata` | 8 | 54 | 19 | 0 | 0 | 81 |
| **total** | **66** | **62** | **23** | **1** | **1** | **153** |

Every `.text` relocation word lies in a public pool range. The first 440 text
bytes are 55 canonical four-byte ARM import veneers, each followed by its own
four-byte external relocation slot. Three further external text slots occur at
`0x09D8`, `0x09E8`, and `0x0B88`. The remaining 14 text relocations are
internal. The `.rodata` relocations describe structured pointer-bearing data,
but their surrounding scalar payload has not been assigned public semantics.

## `func_000009EC` interface and behavior

The unmatched accepted function is a 216-byte, four-byte-aligned ARM body with
SHA-256 `f483416ab94d9b828e9c847c98e2af72311fa8f7969a26b8ea9765b2c2848ba3`.
It owns no relocation. It reads one adjacent IEEE-754 binary32 literal at
text offset `0x0AC4`; the literal is positive zero, is not relocated, and is
outside the function body.

Inputs used by the body are:

- `r0`: opaque object pointer, preserved on every dispatch path;
- `r1`: selector;
- `r2`: writable byte pointer;
- `s0` and `s1`: binary32 values selected as described below.

Selectors outside zero through three return integer zero without storing.
For a recognized selector, an ordered value below or above zero stores one
byte and tail-transfers to `func_00000BD4` with the original `r0` and the event
code in `r1`:

| Selector | Compared value | Below zero: event / byte | Above zero: event / byte |
| ---: | --- | --- | --- |
| 0 | `s0` | 5 / 2 | 4 / 3 |
| 1 | `s0` | 7 / 2 | 6 / 3 |
| 2 | `s1` | 6 / 0 | 4 / 1 |
| 3 | `s1` | 7 / 0 | 5 / 1 |

Equality and unordered comparison, including NaN, take the no-store return
path. The comparison form is VFP `VCMPE.F32`, followed immediately by transfer
of FPSCR flags to APSR; preserving that exception/flag behavior is normative.
The tail transfer is a branch, not a call, so the selected path returns through
`func_00000BD4` rather than returning to this body.

## Exact neutral operation schedule

Offsets are relative to `func_000009EC`. `tail` means the exact entry of
`func_00000BD4`. The three legacy no-operations are architecturally inert but
part of the required schedule. All rows are four-byte ARM instructions.

| Offset | Neutral operation |
| ---: | --- |
| `+0x00` | load binary32 `s2` from the adjacent literal at body `+0xD8` |
| `+0x04` | compare `r1` with 2 |
| `+0x08` | set `r3` to 0 |
| `+0x0C` | set `r12` to 1 |
| `+0x10` | if equal, branch to `+0x38` |
| `+0x14` | compare `r1` with 3 |
| `+0x18` | if equal, branch to `+0x5C` |
| `+0x1C` | compare `r1` with 0 |
| `+0x20` | set `r3` to 2 |
| `+0x24` | set `r12` to 3 |
| `+0x28` | if equal, branch to `+0x78` |
| `+0x2C` | compare `r1` with 1 |
| `+0x30` | if equal, branch to `+0xA4` |
| `+0x34` | branch to `+0xD0` |
| `+0x38` | compare `s1` with `s2` using `VCMPE.F32` |
| `+0x3C` | transfer FPSCR flags to APSR |
| `+0x40` | if carry set, branch to `+0x50` |
| `+0x44` | set `r1` to 6 |
| `+0x48` | store low byte of `r3` at `[r2]` |
| `+0x4C` | branch to `tail` |
| `+0x50` | legacy no-operation |
| `+0x54` | if signed greater-than, branch to `+0x98` |
| `+0x58` | branch to `+0xD0` |
| `+0x5C` | compare `s1` with `s2` using `VCMPE.F32` |
| `+0x60` | transfer FPSCR flags to APSR |
| `+0x64` | if carry clear, branch to `+0xB0` |
| `+0x68` | if signed less-than-or-equal, branch to `+0xD0` |
| `+0x6C` | set `r1` to 5 |
| `+0x70` | store low byte of `r12` at `[r2]` |
| `+0x74` | branch to `tail` |
| `+0x78` | compare `s0` with `s2` using `VCMPE.F32` |
| `+0x7C` | transfer FPSCR flags to APSR |
| `+0x80` | if carry set, branch to `+0x90` |
| `+0x84` | set `r1` to 5 |
| `+0x88` | store low byte of `r3` at `[r2]` |
| `+0x8C` | branch to `tail` |
| `+0x90` | legacy no-operation |
| `+0x94` | if signed less-than-or-equal, branch to `+0xD0` |
| `+0x98` | set `r1` to 4 |
| `+0x9C` | store low byte of `r12` at `[r2]` |
| `+0xA0` | branch to `tail` |
| `+0xA4` | compare `s0` with `s2` using `VCMPE.F32` |
| `+0xA8` | transfer FPSCR flags to APSR |
| `+0xAC` | if carry set, branch to `+0xBC` |
| `+0xB0` | set `r1` to 7 |
| `+0xB4` | store low byte of `r3` at `[r2]` |
| `+0xB8` | branch to `tail` |
| `+0xBC` | legacy no-operation |
| `+0xC0` | if signed less-than-or-equal, branch to `+0xD0` |
| `+0xC4` | set `r1` to 6 |
| `+0xC8` | store low byte of `r12` at `[r2]` |
| `+0xCC` | branch to `tail` |
| `+0xD0` | set `r0` to 0 |
| `+0xD4` | return through `lr` |

The body contains 14 local conditional/unconditional branches, six external
tail branches, one literal load, four VFP comparisons, four flag transfers,
four byte stores, one ordinary return, and no stack operation or call.
An isolated implementation should own exactly the 216-byte executable body;
the adjacent zero literal must be separately owned as a four-byte pool.

## Validation contract for the implementer

Validation should fail closed unless all 54 operations tile the body exactly,
all local destinations and six tail identities agree, the adjacent literal is
positive binary32 zero, and the linked body is byte-identical to the target.
The implementation must not acquire any other pool, gap, data, residue, export,
or relocation output. The six tail branches may require symbolic branch
relocations before the unit's relocatable link; the final comparison object
must resolve them to `func_00000BD4` and must not retain a function-body data
relocation.

This addition can raise the accepted-function result to two of two and the
accepted-code result to 304 of 304 bytes. It cannot make the link unit complete.

## Evidenced blockers to a complete link unit

Full reconstruction is presently blocked by evidence, not by code score:

1. The accepted inventory covers only 304 of 6,156 text bytes. The remaining
   5,408 executable gap bytes have no approved function boundaries, and 56
   bytes remain explicitly unknown. Treating gaps as a pseudo-function or
   silently allocating unknown residue would violate the publication gate.
2. None of the 568 `.rodata` bytes or four `.data` bytes has an approved
   clean-room semantic specification. Hashes and relocation topology prove
   identity and structure but are insufficient to independently recreate the
   scalar payload without copying target tables or strings.
3. The 153 relocation outputs are structurally accounted, but many point into
   the unclassified text and opaque read-only structures. Stable source-level
   ownership and addend semantics depend on resolving those classifications.
4. Even a 100% score for the two accepted functions leaves 388 pool bytes, 588
   other data/BSS bytes, 5,408 gap bytes, and 56 unknown bytes unimplemented.
   The repository's byte-identical target/base ELF gate must therefore keep
   `metadata.complete: false`.

The next lawful analysis step is a reviewed expansion of the neutral function
inventory and complete text partition, followed by semantic descriptions of
the pointer-bearing read-only structures and writable state. Until that
evidence exists, a separate implementer can safely implement
`func_000009EC`, but cannot honestly or deterministically complete this CRO.
