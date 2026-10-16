# Probe-verified Thumb leaf/helper batch 04

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched
Thumb-state functions totaling 1,340 executable bytes and 631
instructions for revision `AS_EUR_REV2`. Evidence was limited to the current
unmatched objdiff report, the neutral symbol inventory, recursive public
configuration ownership metadata, bounded private-target control/data-flow
inspection, and an independent assembly round trip of the neutral schedules.
No implementation source was read while preparing this batch.

The selection maximizes bounded yield among compact candidates: every body is
38--76 bytes, every routine has at most two direct calls and two literal or
ADR-style PC-relative accesses, and every direct destination is an exact global
function entry. The batch has 39 32-bit instructions, all direct calls, and
592 16-bit instructions. It contains 69 local branches, 201 memory
operations, 33 return sites, one register-indirect call, 39 direct calls,
and no indirect tail, direct external jump, owned adjacent data, private
string, or asset.

## Structural and boundary inventory

Return and call sites are excluded from the local-branch count. Memory counts
include loads, stores, stack operations, and multiple loads/stores. A
next-global offset larger than the body size identifies material outside this
batch; none of that material is owned here. Register `r3` returns are unwind
epilogues whose return address was restored by an earlier `pop`, not indirect
tail calls.

| Function | Bytes | Instructions | Wide | Local branches | Memory ops | Returns | Indirect calls | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_001004B8` | 68 | 32 | 2 | 3 | 8 | 2 | 0 | 2 | `func_00100500` (+72) |
| `func_00100A5C` | 68 | 33 | 1 | 4 | 6 | 1 | 0 | 1 | `func_00100AA0` (+68) |
| `func_00100BE4` | 50 | 23 | 2 | 2 | 5 | 1 | 0 | 2 | `func_00100C24` (+64) |
| `func_0010130A` | 50 | 23 | 2 | 1 | 4 | 1 | 0 | 2 | `func_0010133C` (+50) |
| `func_0010277C` | 54 | 25 | 2 | 2 | 8 | 1 | 0 | 2 | `func_001027B8` (+60) |
| `func_001027B8` | 50 | 23 | 2 | 2 | 5 | 1 | 0 | 2 | `func_001027F0` (+56) |
| `func_001027F0` | 40 | 18 | 2 | 0 | 7 | 1 | 0 | 2 | `func_00102824` (+52) |
| `func_00102824` | 54 | 25 | 2 | 2 | 8 | 1 | 0 | 2 | `func_00102868` (+68) |
| `func_00102868` | 72 | 34 | 2 | 4 | 10 | 1 | 0 | 2 | `func_001028B4` (+76) |
| `func_001028B4` | 54 | 26 | 1 | 0 | 13 | 1 | 0 | 1 | `func_001028F4` (+64) |
| `func_00102DB2` | 38 | 17 | 2 | 3 | 5 | 1 | 0 | 2 | `func_00102DD8` (+38) |
| `func_00102EC8` | 42 | 19 | 2 | 3 | 7 | 1 | 0 | 2 | `func_00102EF2` (+42) |
| `func_0010338E` | 54 | 25 | 2 | 3 | 9 | 2 | 0 | 2 | `func_001033C4` (+54) |
| `func_00103568` | 46 | 22 | 1 | 5 | 7 | 1 | 0 | 1 | `func_001035E4` (+124) |
| `func_00103D1C` | 46 | 22 | 1 | 2 | 6 | 1 | 0 | 1 | `func_00103D58` (+60) |
| `func_002FFBF8` | 68 | 33 | 1 | 3 | 9 | 3 | 1 | 1 | `func_002FFC3C` (+68) |
| `func_00300A00` | 66 | 32 | 1 | 4 | 10 | 1 | 0 | 1 | `func_00300A48` (+72) |
| `func_00301D7C` | 76 | 37 | 1 | 4 | 13 | 2 | 0 | 1 | `func_00301DC8` (+76) |
| `func_00301F00` | 54 | 25 | 2 | 3 | 8 | 2 | 0 | 2 | `func_00301F68` (+104) |
| `func_0030227C` | 66 | 32 | 1 | 6 | 12 | 3 | 0 | 1 | `func_003022C0` (+68) |
| `func_003023F0` | 58 | 27 | 2 | 2 | 7 | 2 | 0 | 2 | `func_0030242A` (+58) |
| `func_00303188` | 52 | 24 | 2 | 3 | 12 | 1 | 0 | 2 | `func_003031BC` (+52) |
| `func_003035D4` | 72 | 34 | 2 | 5 | 13 | 1 | 0 | 2 | `func_0030361C` (+72) |
| `func_00305A40` | 42 | 20 | 1 | 3 | 9 | 1 | 0 | 1 | `func_00305A90` (+80) |

Totals: 1,340 body bytes, zero adjacent bytes, 631 instructions,
39 wide instructions, 69 local branches, 201 memory operations, 33 return
sites, one register-indirect call, 39 direct calls, and zero indirect tails.
The sole indirect call is `func_002FFBF8` +0x3a, `blx r3`, and is
relocation-free.

## Direct calls and relocation contract

Offsets are hexadecimal byte offsets from the function entry. Every site is a
32-bit Thumb call and carries exactly one `R_ARM_THM_CALL` relocation to the
recorded symbol. Mnemonic is normative because it records the target state.

| Function | Offset | Mnemonic | Symbol | Target mode | Relocation |
| --- | ---: | --- | --- | --- | --- |
| `func_001004B8` | +0x1e | `bl` | `func_002FED9A` | thumb | `R_ARM_THM_CALL` |
| `func_001004B8` | +0x32 | `bl` | `func_002FEDC0` | thumb | `R_ARM_THM_CALL` |
| `func_00100A5C` | +0x3e | `bl` | `func_002FF988` | thumb | `R_ARM_THM_CALL` |
| `func_00100BE4` | +0x1c | `bl` | `func_002FFBAE` | thumb | `R_ARM_THM_CALL` |
| `func_00100BE4` | +0x2a | `bl` | `func_002FFBD4` | thumb | `R_ARM_THM_CALL` |
| `func_0010130A` | +0x1e | `bl` | `func_002FFE4A` | thumb | `R_ARM_THM_CALL` |
| `func_0010130A` | +0x28 | `bl` | `func_002FFB14` | thumb | `R_ARM_THM_CALL` |
| `func_0010277C` | +0x1a | `bl` | `func_002FFBAE` | thumb | `R_ARM_THM_CALL` |
| `func_0010277C` | +0x28 | `bl` | `func_002FFBD4` | thumb | `R_ARM_THM_CALL` |
| `func_001027B8` | +0x1c | `bl` | `func_002FFBAE` | thumb | `R_ARM_THM_CALL` |
| `func_001027B8` | +0x2a | `bl` | `func_002FFBD4` | thumb | `R_ARM_THM_CALL` |
| `func_001027F0` | +0x10 | `bl` | `func_002FFBAE` | thumb | `R_ARM_THM_CALL` |
| `func_001027F0` | +0x1a | `bl` | `func_002FFBD4` | thumb | `R_ARM_THM_CALL` |
| `func_00102824` | +0x1a | `bl` | `func_002FFBAE` | thumb | `R_ARM_THM_CALL` |
| `func_00102824` | +0x28 | `bl` | `func_002FFBD4` | thumb | `R_ARM_THM_CALL` |
| `func_00102868` | +0x1c | `bl` | `func_002FED9A` | thumb | `R_ARM_THM_CALL` |
| `func_00102868` | +0x30 | `bl` | `func_002FEDC0` | thumb | `R_ARM_THM_CALL` |
| `func_001028B4` | +0x2a | `bl` | `func_002FFA44` | thumb | `R_ARM_THM_CALL` |
| `func_00102DB2` | +0xe | `bl` | `func_003021A4` | thumb | `R_ARM_THM_CALL` |
| `func_00102DB2` | +0x16 | `bl` | `func_003021A4` | thumb | `R_ARM_THM_CALL` |
| `func_00102EC8` | +0x10 | `bl` | `func_003021BE` | thumb | `R_ARM_THM_CALL` |
| `func_00102EC8` | +0x1a | `bl` | `func_003021BE` | thumb | `R_ARM_THM_CALL` |
| `func_0010338E` | +0x6 | `blx` | `func_002FF7EC` | arm | `R_ARM_THM_CALL` |
| `func_0010338E` | +0x30 | `blx` | `func_00302334` | arm | `R_ARM_THM_CALL` |
| `func_00103568` | +0x1e | `bl` | `func_00301F00` | thumb | `R_ARM_THM_CALL` |
| `func_00103D1C` | +0x1c | `bl` | `func_002FF7F8` | thumb | `R_ARM_THM_CALL` |
| `func_002FFBF8` | +0x8 | `blx` | `func_002FEDF0` | arm | `R_ARM_THM_CALL` |
| `func_00300A00` | +0x3c | `bl` | `func_00101CC8` | thumb | `R_ARM_THM_CALL` |
| `func_00301D7C` | +0x28 | `bl` | `func_00301D30` | thumb | `R_ARM_THM_CALL` |
| `func_00301F00` | +0x1e | `bl` | `func_00301D7C` | thumb | `R_ARM_THM_CALL` |
| `func_00301F00` | +0x2a | `bl` | `func_00301E0C` | thumb | `R_ARM_THM_CALL` |
| `func_0030227C` | +0x12 | `blx` | `func_002FED78` | arm | `R_ARM_THM_CALL` |
| `func_003023F0` | +0x10 | `blx` | `func_00503264` | arm | `R_ARM_THM_CALL` |
| `func_003023F0` | +0x30 | `bl` | `func_00301D1C` | thumb | `R_ARM_THM_CALL` |
| `func_00303188` | +0x24 | `bl` | `func_002FFE30` | thumb | `R_ARM_THM_CALL` |
| `func_00303188` | +0x28 | `blx` | `func_002FF8C0` | arm | `R_ARM_THM_CALL` |
| `func_003035D4` | +0x8 | `bl` | `func_002FF094` | thumb | `R_ARM_THM_CALL` |
| `func_003035D4` | +0x3c | `blx` | `func_002FF10C` | arm | `R_ARM_THM_CALL` |
| `func_00305A40` | +0x24 | `bl` | `func_003034CC` | thumb | `R_ARM_THM_CALL` |

There are no other relocations. Every target is an exact global entry rather
than a secondary or interior entry. Repeated destinations are intentional and
remain distinct relocation sites.

## PC-relative semantics and ownership

The sixteen entries below use Thumb's word-aligned PC base. Every affected
function begins at an address congruent to zero modulo four in the target
layout. The object sections still require only two-byte alignment so an odd
halfword body is not padded; linked placement must separately preserve the
recorded modulo-four invariant. Target offsets are hexadecimal.

| Function | Instruction offset | Form | Target offset | Entry modulo 4 | Crossed function interval |
| --- | ---: | --- | ---: | ---: | --- |
| `func_001004B8` | +0x14 | `ldr` | +0x44 | 0 | none |
| `func_00100A5C` | +0x26 | `add` | +0x68 | 0 | `func_00100AA0` |
| `func_00100A5C` | +0x38 | `add` | +0x6c | 0 | `func_00100AA0` |
| `func_00100BE4` | +0x12 | `ldr` | +0x34 | 0 | none |
| `func_0010277C` | +0x10 | `ldr` | +0x38 | 0 | none |
| `func_001027B8` | +0x12 | `ldr` | +0x34 | 0 | none |
| `func_001027F0` | +0x4 | `ldr` | +0x28 | 0 | none |
| `func_00102824` | +0x10 | `ldr` | +0x38 | 0 | none |
| `func_00102868` | +0x12 | `ldr` | +0x48 | 0 | none |
| `func_001028B4` | +0x18 | `ldr` | +0x38 | 0 | none |
| `func_001028B4` | +0x1e | `ldr` | +0x3c | 0 | none |
| `func_00103568` | +0x2 | `ldr` | +0x30 | 0 | none |
| `func_00103568` | +0x4 | `ldr` | +0x34 | 0 | none |
| `func_00103D1C` | +0x2a | `add` | +0x30 | 0 | none |
| `func_00300A00` | +0x6 | `ldr` | +0x44 | 0 | none |
| `func_00300A00` | +0x14 | `ldr` | +0x44 | 0 | none |

Every destination is unowned post-body material. The two ADR-style accesses
in `func_00100A5C` cross the complete foreign interval of
`func_00100AA0`; this batch claims neither that function nor either addressed
location. All other targets lie after their body without crossing a complete
foreign function interval. No literal pool, addressed word, string, identity
mapping, or target-object generator data entry is owned by this batch.

## Canonical schedules and hashes

The configuration is the complete neutral implementation handoff. Split each
function's `schedule` on `|`. Determine byte offsets cumulatively: entries
at `wideInstructionOffsets` are four bytes and all other entries are two.
A local transfer uses `local:+target`, with a lowercase hexadecimal target
and no `0x` prefix. The control arrays redundantly record every branch,
return, indirect call, indirect tail, and direct call.

Canonical instruction records are
`function:hexOffset:mnemonic:operands`. Records are joined by LF with no
terminal newline.

- Full mnemonic/operand schedule: `d0d77e01e7d994fc3afe11842ba4af59216383d7141c3584dc3bd9fac1c42cc9`
- Local-transfer schedule: `fb828806647019ecddb16a6111f08e2bc0986bbf0f6582d5709560f5543b0578`
- Return schedule: `dba950a23f70c736eccfabfdd34cf8a2459802e9ceb2ab00aaa97c24303f4418`
- Indirect-call schedule: `434fde4c9142388799f3351db4f4bf2d7404f7565b4b5b7ffbc1fd0cd2093557`
- Indirect-tail schedule: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Direct-call schedule: `28de823330298eb5809edcc6fab90a8d0cf721956efeb1250146cdb3096a90ac`

Instruction selection, flags behavior, operand order, call state transition,
branch width, order, mode, entry placement, and body boundary are normative.
Equivalent uniquely scoped local-label names are permitted.

GNU Arm assembly can silently canonicalize a three-operand same-register
`adds` or `subs` immediate into the byte-distinct two-operand form. Every
explicit three-operand immediate entry requires the Thumb16 immediate-three-bit
form; every two-operand immediate entry requires the Thumb16 immediate-eight-bit
form. A non-proprietary encoding directive may be used when the assembler
cannot preserve that architectural distinction. Section alignment must remain
two bytes even for PC-relative functions; raising it to four pads bodies whose
length is two modulo four.

## Unmatched, ownership, and collision audit

All twenty-four selected report entries were unmatched at zero percent when
selected. Names are pairwise distinct and body intervals are pairwise disjoint.
No selected name is a function member, alias, identity member, or secondary
entry already owned by a public configuration. Earlier appearances are only
external call targets or next-global boundaries and therefore do not claim the
selected body.

Exact whole-body comparison against all 10,440 target functions found all
selected bodies to be singleton classes. There is no selected-to-selected or
selected-to-unselected whole-body collision, so `duplicateBodyClasses` is
empty.

## Independent validation and completeness contract

A generated probe assembled all schedules for ARMv6K Thumb mode. It forced the
architecturally specified immediate-three-bit form at the twenty-three explicit
three-operand add/sub sites. After masking only the thirty-nine direct-call
relocation fields, every remaining byte matched the bounded private target.
The probe emitted exactly thirty-nine `R_ARM_THM_CALL` relocations at the
configured offsets and to the configured symbols. Schedule sizes, instruction
widths, totals, all sixteen PC-relative destinations, next-global boundaries,
ownership exclusions, and all six canonical hashes were independently
recomputed.

The implementation must define exactly these twenty-four global Thumb
functions in individual `.text.<name>` sections. Each section stops at its
recorded body size and contains the exact ordered schedule, local destinations,
and call relocations. Sections require two-byte alignment; linked placement of
PC-relative functions must preserve entry modulo four without isolated-section
padding.

The implementation must emit no trailing alignment byte, pool word, addressed
post-body material, string, asset, unexpected external reference, extra
relocation, direct external jump, or adjacent data. The post-body PC targets
and crossed foreign function are outside batch ownership and must not be copied
into source or any target-object identity mapping.
