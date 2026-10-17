# Thumb leaf/helper batch 15

## Scope and provenance

This clean-room analyst handoff covers `func_00303EC8` for revision
`AS_EUR_REV2`. It is the only Thumb primary entry that remains unmatched in the
current report and unowned by a public configuration. Its body is 14 bytes and
contains six instructions. Evidence was limited to the current unmatched
report, neutral global-symbol and mapping metadata, recursive public
configuration ownership metadata, and bounded private-target control-flow
inspection. No implementation source was read or authored.

This helper was deferred from earlier batches because its only call reaches an
unnamed Thumb secondary entry outside every public function body. The
configuration assigns that destination the neutral identity
`thumb_secondary_00303E38`; the name preserves linkage identity only and does
not claim or disclose the destination body. Independent implementation set
`sourceHash` to
`5b63305b27568b6c687f1d812599fbf5044636a0e0223d944fd86a8bf3d605b6`.

## Structural inventory

| Function | Body bytes | Instructions | Wide | Local branches | Memory ops | Returns | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00303EC8` | 14 | 6 | 1 | 0 | 2 | 1 | 1 | `func_00303ED8` (+0x10) |

The body ends at +0xe. The two bytes before the next global are unowned and are
not addressed by this function. The initial stack save and final
stack-restoring return are the two memory operations. There are no local
branches, indirect calls, indirect tails, PC-relative data accesses, direct
external jumps, adjacent owned bytes, or legacy no-operations.

## Direct call and secondary-entry identity

The four-byte direct call at +0x8 targets the exact external identity
`thumb_secondary_00303E38`, remains in Thumb state, and requires one
`R_ARM_THM_CALL` relocation. There are no other relocations.

The target is at signed offset -0x90 from the selected function entry. It lies
in unowned space immediately after the preceding ARM global body:
`func_00303D9C` begins at -0x12c, has size 0x98, and ends at -0x94. The
secondary entry is therefore four bytes after that body end and before the
selected global entry. This relation is normative. Neither the preceding ARM
body nor any bytes at or around the secondary destination belong to this
batch.

An implementation should reference the neutral secondary identity as an
external Thumb function symbol. It must not substitute the preceding ARM
global, infer ownership of the gap, copy destination material, or change the
call into an interworking transfer. Final linkage must resolve the external
identity at the recorded relation.

## Neutral semantic handoff

The ordered `semantics` array in the configuration covers offsets zero through
13 contiguously. Each row records byte offset, encoded width, a neutral
operation and architectural form, register roles, immediate values, flag
effects, or transfer identity. It is the complete implementation handoff and
contains no raw target bytes, opcode values, disassembly transcript, or
assembler schedule.

The operation at +0x2 is specifically the 16-bit immediate-five-bit logical
left shift by zero and sets flags; a copy spelling with equivalent visible
register values is not encoding-equivalent. The constant operation at +0x4 is
the 16-bit immediate-eight-bit flag-setting form. The stack-pointer copy at
+0x6 is the 16-bit high-register form and does not set flags. The call is the
only four-byte instruction. The stack save, direct call, and stack-restoring
return preserve the exact register and transfer identities recorded in the
rows.

The complete body must remain continuously covered by Thumb code mapping from
offset zero, with no interior data mapping interval. The section has two-byte
input alignment and must stop at 14 bytes without absorbing the two-byte gap
before the next global.

## Ownership and collision audit

The current report records `func_00303EC8` as unmatched with size 14. Recursive
inspection of every public configuration found no ownership of this primary
entry or of the secondary call destination. The selected body does not overlap
another global function.

Exact whole-body comparison across all 10,440 target functions found no
identical peer, so `duplicateBodyClasses` is empty. The secondary target is an
external identity, not an alias or identity member owned by this batch.

## Completeness checks for the implementer

Independent validation should verify the six contiguous semantic rows, exact
14-byte section size, two-byte section alignment, continuous Thumb mapping,
two memory operations, one return, and the single call relocation at +0x8. It
should reject any additional relocation, executable ownership, selected-name
collision, adjacent emitted bytes, interior data mapping, legacy
no-operation, or duplicate-body claim.

Validation must also confirm that the call resolves to a Thumb secondary entry
at -0x90, that the preceding global/body boundary relation remains exactly as
recorded, and that the secondary destination remains outside batch ownership.
The source hash is normative and must match the independently authored source
byte for byte.
