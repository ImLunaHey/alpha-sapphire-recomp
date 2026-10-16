# Probe-verified Thumb leaf/helper batch 03

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched
Thumb-state functions totaling 792 executable bytes and 392 instructions for
revision `AS_EUR_REV2`. Evidence was limited to the current unmatched objdiff
report, the neutral symbol inventory, public configuration ownership metadata,
bounded private-target control/data-flow inspection, and an independent
assembly round trip of the neutral schedules. No implementation source was
read while preparing this batch.

Twenty routines are relocation-free. Four routines contain one direct call
each, for exactly four `R_ARM_THM_CALL` relocations. The other call sites are
fifteen register-indirect `blx` instructions. There are no direct external
jumps, indirect tails, owned adjacent data, private strings, or assets.

Of the 392 instructions, 388 are 16-bit Thumb instructions. The only 32-bit
instructions are the four direct calls listed below. The batch contains 43
local branches, 148 memory operations, 32 return sites, fifteen indirect-call
sites, four direct-call sites, and ten PC-relative data loads.

## Structural and boundary inventory

Return and call sites are excluded from the local-branch count. Memory counts
include loads, stores, stack operations, and multiple loads/stores. A
next-global offset larger than the body size identifies material outside this
batch; none of that material is owned here.

| Function | Bytes | Instructions | Wide | Local branches | Memory ops | Returns | Indirect calls | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00100096` | 78 | 39 | 0 | 9 | 8 | 1 | 2 | 0 | `func_001000E4` (+78) |
| `func_0010018C` | 34 | 17 | 0 | 3 | 4 | 1 | 1 | 0 | `func_001001E0` (+84) |
| `func_00100294` | 34 | 17 | 0 | 2 | 2 | 1 | 1 | 0 | `func_001002B6` (+34) |
| `func_001003CC` | 18 | 9 | 0 | 1 | 2 | 1 | 0 | 0 | `func_001003E0` (+20) |
| `func_001003E8` | 18 | 9 | 0 | 2 | 1 | 1 | 0 | 0 | `func_001003FA` (+18) |
| `func_00102DEC` | 28 | 14 | 0 | 3 | 3 | 1 | 0 | 0 | `func_00102E08` (+28) |
| `func_00102F0C` | 26 | 13 | 0 | 2 | 5 | 1 | 1 | 0 | `func_00102F30` (+36) |
| `func_001048A0` | 42 | 21 | 0 | 3 | 6 | 1 | 1 | 0 | `func_00104A50` (+432) |
| `func_002FEE04` | 44 | 22 | 0 | 4 | 9 | 2 | 1 | 0 | `func_002FEE30` (+44) |
| `func_002FEE30` | 34 | 17 | 0 | 2 | 9 | 2 | 1 | 0 | `func_002FEE54` (+36) |
| `func_002FF95C` | 22 | 11 | 0 | 2 | 1 | 2 | 0 | 0 | `func_002FF972` (+22) |
| `func_0030098C` | 12 | 6 | 0 | 0 | 4 | 1 | 0 | 0 | `func_0030099C` (+16) |
| `func_00302F52` | 18 | 9 | 0 | 1 | 2 | 2 | 0 | 0 | `func_00302F64` (+18) |
| `func_00304784` | 58 | 29 | 0 | 6 | 9 | 3 | 0 | 0 | `func_003047C8` (+68) |
| `func_003048B4` | 10 | 5 | 0 | 0 | 4 | 1 | 1 | 0 | `func_003048BE` (+10) |
| `func_00304C58` | 24 | 12 | 0 | 0 | 7 | 1 | 1 | 0 | `func_00304C70` (+24) |
| `func_00304DC6` | 10 | 5 | 0 | 0 | 4 | 1 | 1 | 0 | `func_00304DD0` (+10) |
| `func_003054C0` | 10 | 5 | 0 | 0 | 4 | 1 | 1 | 0 | `func_003054CA` (+10) |
| `func_003054DE` | 24 | 12 | 0 | 0 | 7 | 1 | 1 | 0 | `func_003054F6` (+24) |
| `func_003055E6` | 10 | 5 | 0 | 0 | 4 | 1 | 1 | 0 | `func_003055F0` (+10) |
| `func_002FED38` | 64 | 31 | 1 | 2 | 9 | 3 | 1 | 1 | `func_002FED78` (+64) |
| `func_00301DC8` | 60 | 29 | 1 | 1 | 16 | 1 | 0 | 1 | `func_00301E0C` (+68) |
| `func_003021CC` | 60 | 29 | 1 | 0 | 15 | 1 | 0 | 1 | `func_00302208` (+60) |
| `func_00100B8C` | 54 | 26 | 1 | 0 | 13 | 1 | 0 | 1 | `func_00100BCC` (+64) |

Totals: 792 body bytes, zero adjacent bytes, 392 instructions, four wide
instructions, 43 local branches, 148 memory operations, 32 return sites,
fifteen register-indirect calls, four direct calls, and zero indirect tails.

## Direct calls and relocation contract

Offsets in this table are hexadecimal byte offsets from the function entry.
Every site is a 32-bit Thumb call and must carry exactly the stated relocation.
The mnemonic is normative because it records the target instruction set.

| Function | Offset | Mnemonic | Symbol | Target mode | Relocation |
| --- | ---: | --- | --- | --- | --- |
| `func_002FED38` | +0x08 | `blx` | `func_002FEDF0` | ARM | `R_ARM_THM_CALL` |
| `func_00301DC8` | +0x16 | `bl` | `func_00301D7C` | Thumb | `R_ARM_THM_CALL` |
| `func_003021CC` | +0x30 | `blx` | `func_00300750` | ARM | `R_ARM_THM_CALL` |
| `func_00100B8C` | +0x2a | `bl` | `func_002FFA44` | Thumb | `R_ARM_THM_CALL` |

There are no other relocations. The fifteen register-indirect calls remain
relocation-free. All direct targets are existing global entries and none is a
secondary or interior entry.

## PC-relative semantics and ownership

All ten loads use Thumb's word-aligned PC base. Every selected entry containing
such a load is congruent to zero modulo four in the target layout. The linked
placement must preserve that congruence even though ordinary batch sections
need only two-byte alignment. Offsets below are hexadecimal byte offsets.

| Function | Load offset | Target offset | Entry modulo 4 | Crossed function interval |
| --- | ---: | ---: | ---: | --- |
| `func_00102F0C` | +0x02 | +0x1c | 0 | none |
| `func_00102F0C` | +0x06 | +0x20 | 0 | none |
| `func_0030098C` | +0x06 | +0x0c | 0 | none |
| `func_00301DC8` | +0x32 | +0x40 | 0 | none |
| `func_003021CC` | +0x10 | +0x98 | 0 | `func_00302208` |
| `func_003021CC` | +0x14 | +0x9c | 0 | `func_00302208` |
| `func_003021CC` | +0x20 | +0xa0 | 0 | `func_00302208` |
| `func_003021CC` | +0x24 | +0xa4 | 0 | `func_00302208` |
| `func_00100B8C` | +0x18 | +0x38 | 0 | none |
| `func_00100B8C` | +0x1e | +0x3c | 0 | none |

Every target is unowned post-body material. The four loads in
`func_003021CC` cross the complete foreign interval of `func_00302208` and
reach unowned material immediately after it. This batch does not claim that
foreign function or any addressed word. No literal pool, literal identity, or
target-object data mapping is owned by this batch.

## Canonical schedules and hashes

The configuration is the complete neutral implementation handoff. Split each
function's `schedule` on `|`. Determine byte offsets cumulatively: ordinary
entries are two bytes and the offsets in `wideInstructionOffsets` are four
bytes. A local transfer uses `local:+target`, where the target is a lowercase
hexadecimal byte offset without a `0x` prefix. The control-transfer arrays
redundantly record every branch, return, indirect call, and direct call.

Canonical instruction records are
`function:hexOffset:mnemonic:operands`. Records are joined by LF with no
terminal newline.

- Full mnemonic/operand schedule: `97d309e139ed661acc0296331132f5cf07999c4a400ba493e052c1202913ba43`
- Local-transfer schedule: `0b3efb41b004def3d3bbdbdf37350c5353b48bd25148bdb8ee33fe3c9c99a1ab`
- Return schedule: `39768fb943dc7d83fccdff8e6046ae631d0ad2f1a5a204b392d043ed2594fce4`
- Indirect-call schedule: `cf6a29aa834d53ac4812f7676c462bff2be5a60d2384f1a429a1dde0dbd99e1f`
- Direct-call schedule: `e02213e0c20751c7293b26282d73f907890c6d5e40deb7b5b002fe9984d2be5b`

Instruction selection, flags behavior, operand order, call state transition,
branch width, order, mode, entry placement, and body boundary are normative.
Equivalent uniquely scoped local-label names are permitted.

GNU Arm assembly can silently canonicalize a three-operand same-register
`adds` or `subs` immediate into the byte-distinct two-operand form. Every
explicit three-operand same-register immediate entry requires the Thumb16
immediate-three-bit form; every two-operand entry requires the Thumb16
immediate-eight-bit form. An implementation may use a non-proprietary encoding
directive where the assembler cannot preserve that architectural distinction.

## Unmatched, ownership, and collision audit

All twenty-four selected report entries were unmatched at zero percent when
selected. Their names are pairwise distinct and their body intervals are
pairwise disjoint. No selected name is a previously implemented function.
Several appear in earlier configurations only as an external call target,
branch-identity dependency, or next-global boundary; those references do not
claim their bodies. The ownership audit distinguished those dependency and
boundary roles from actual `functions` members, aliases, and secondary-entry
ownership.

Whole-body comparison against all 10,440 target functions yields twenty-one
body classes. Eighteen selected bodies are singleton classes. The three exact
two-member classes are:

- `func_003048B4` and `func_003055E6`
- `func_00304C58` and `func_003054DE`
- `func_00304DC6` and `func_003054C0`

Every member of each collision class is selected, and there are no
unselected whole-body collisions.

## Independent validation and completeness contract

A generated probe assembled all schedules for ARMv6K Thumb mode. After masking
only the four relocation fields and the documented assembler-alias sites, all
remaining section bytes matched the bounded private target. The probe emitted
exactly four relocations, each `R_ARM_THM_CALL` at the configured offset and to
the configured symbol. Schedule sizes, instruction widths, totals, PC-relative
destinations, next-global boundaries, and all five canonical hashes were
independently recomputed.

The implementation must define exactly these twenty-four global Thumb
functions in individual `.text.<name>` sections. Every section must stop at
its recorded body size and contain the exact ordered schedule, local targets,
and call relocations. Sections require at least two-byte alignment; linked
placement for the PC-relative functions must preserve the recorded modulo-four
entry invariant.

The implementation must emit no trailing padding, pool word, string, asset,
unexpected external reference, extra relocation, direct external jump, or
adjacent data. Post-body PC-relative targets and the crossed foreign function
are outside batch ownership and must not be copied into the source or any
target-object data identity mapping.
