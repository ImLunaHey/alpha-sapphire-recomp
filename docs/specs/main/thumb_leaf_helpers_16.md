# Thumb leaf/helper batch 16

## Scope and provenance

This clean-room analyst handoff covers `func_0010046E`, `func_00102008`, and
`func_00102E30` for revision `AS_EUR_REV2`. They are globally unmatched Thumb
primary entries not owned by any public configuration. Their bodies total 12
bytes and contain five instructions. Evidence was limited to the current
unmatched report, neutral global-symbol and mapping metadata, recursive public
configuration ownership metadata, and bounded private-target control-flow
inspection. No implementation source was read or authored during analysis.

All three functions transfer to unnamed Thumb secondary entries. The neutral
names in the configuration preserve linkage identity only; they do not claim
or disclose any destination body. The completed public configuration pins the
independent implementation with its SHA-256 `sourceHash`.

## Structural inventory

| Function | Body bytes | Instructions | Wide | Memory ops | Returns | Direct calls | Direct tails | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_0010046E` | 2 | 1 | 0 | 0 | 0 | 0 | 1 | `func_0010048A` (+0x1c) |
| `func_00102008` | 8 | 3 | 1 | 2 | 1 | 1 | 0 | `func_00102046` (+0x3e) |
| `func_00102E30` | 2 | 1 | 0 | 0 | 0 | 0 | 1 | `func_00102E4A` (+0x1a) |

There are no local branches, indirect calls, indirect tails, PC-relative data
accesses, adjacent owned bytes, or legacy no-operations. The stack save and
stack-restoring return in `func_00102008` are the two memory operations. Exact
whole-body comparison against all 10,440 target functions found no identical
peer for any selected body, so `duplicateBodyClasses` is empty.

## Secondary-entry transfer identities

`func_0010046E` is a single 16-bit unconditional tail to
`thumb_secondary_00100474`, at +0x6 from its primary entry. Its body ends at
+0x2, so the destination begins four bytes into the unowned post-body interval.
The next global is at +0x1c. The transfer is fully resolved in the instruction
and has no relocation or external object symbol.

`func_00102E30` is a single 16-bit unconditional tail to
`thumb_secondary_00102E34`, at +0x4 from its primary entry. Its body ends at
+0x2, so the destination begins two bytes into the unowned post-body interval.
The next global is at +0x1a. This transfer likewise has no relocation or
external object symbol.

`func_00102008` saves its recorded register list, calls
`thumb_secondary_00300AA0`, and returns through its recorded stack restore.
The call destination is at signed entry-relative offset +0x1fea98. Relative to
this primary, the preceding global `func_00300A48` begins at +0x1fea40, has a
24-byte body ending at +0x1fea58, and the following global `func_00300ABC`
begins at +0x1feab4. The destination is therefore in unowned space 64 bytes
after the preceding body and 28 bytes before the following global.

The four-byte call at +0x2 remains in Thumb state and requires exactly one
`R_ARM_THM_CALL` relocation to an undefined global Thumb function identity.
The relocation uses ELF REL form and carries an implicit addend of -4 in the
instruction field. No state switch occurs. Neither this identity nor either
nearby tail destination transfers ownership of destination bytes to the batch.

## Neutral semantic handoff

The ordered `semantics` arrays cover every selected body contiguously. Each row
records byte offset, width, neutral operation and architectural form, register
roles, transfer kind, destination state, signed entry-relative target offset,
relocation status, and addend where applicable. This is the complete
implementation handoff and contains no raw target bytes, opcode values,
disassembly transcript, proprietary string, asset, or canonical source.

The two tail transfers must use the 16-bit Thumb unconditional-immediate form.
They are not function-local branches: each destination lies beyond the owned
body, and the implementation must encode the recorded target relation without
emitting bytes up to the target and without creating a relocation. The call is
the sole four-byte instruction. Its destination must remain the distinct
undefined Thumb secondary identity recorded in the configuration.

Every selected body is continuously covered by Thumb code mapping from offset
zero and contains no interior data mapping interval. Each input section has
two-byte alignment and ends exactly at the recorded function size. None of the
unowned interval before the next global may be emitted.

## ELF and symbol contract

The object is little-endian ELF32, type `ET_REL`, machine `EM_ARM`, ELF version
one, System V ABI, ABI version zero, with flags `0x05000000`. Each selected
function has its own `SHT_PROGBITS` allocatable executable section named
`.text.<function>`, aligned to two bytes and sized exactly to its body.

Each primary entry is a default-visible global `STT_FUNC` symbol with
`st_other` zero, Thumb-tagged value one, and the exact recorded body size. Each
section has one local `STT_SECTION` symbol and one local default-visible
`STT_NOTYPE` `$t` mapping symbol at value zero. The only emitted external
identity is `thumb_secondary_00300AA0`: it is an undefined default-visible
global `STT_FUNC` with `st_other` zero, `SHN_UNDEF`, value zero, and size zero;
its Thumb destination state is fixed by the transfer contract rather than an
undefined-symbol value.
The two non-relocated near-tail identities are semantic identities only and
must not appear in the object symbol table. Named and unnamed aliases are both
forbidden.

The one relocation section uses `SHT_REL`, targets the
`func_00102008` executable section, and contains exactly one entry at +0x2:
`R_ARM_THM_CALL` against `thumb_secondary_00300AA0`, with implicit addend -4.
There are no other relocations.

## Ownership and completeness checks

Recursive inspection of every public configuration found no ownership of the
three primary bodies or their secondary destinations. Existing mentions of
the primary names are call-target, next-global, or boundary metadata only.
The selected bodies do not overlap another global function.

Independent validation should verify all five contiguous semantic rows, exact
section sizes of 2, 8, and 2 bytes, two-byte alignments, continuous `$t`
mapping, the exact primary/section/external symbol metadata, two memory
operations, one return, one call, two external tails, and the sole relocation
at +0x2. It should reject any extra relocation, symbol alias, executable byte,
adjacent ownership, interior data mapping, local-branch classification,
legacy no-operation, or duplicate-body claim. After implementation, the
source digest must be written into `sourceHash` and treated as normative.
