# Thumb leaf/helper batch 17

## Scope and provenance

This clean-room analyst handoff covers `func_00103ADE` for revision
`AS_EUR_REV2`. A global search of the current report and target symbol metadata
found eleven unmatched Thumb primary entries not owned by a public
configuration; this 54-byte function is the smallest. It contains 25
instructions and is a compact two-call wrapper with fully bounded local
control flow. Evidence was limited to the current unmatched report, neutral
global-symbol and mapping metadata, recursive public configuration ownership
metadata, and bounded private-target control-flow inspection. No
implementation source was read or authored.

The ordered semantic rows in the configuration are the complete blind
implementation handoff. They disclose no raw target bytes, opcode values,
disassembly transcript, proprietary string, asset, or canonical source. The
`sourceHash` was intentionally null in the analyst handoff; the completed
configuration replaces it with the SHA-256 of the independently authored
implementation.

## Structural inventory

| Function | Body bytes | Instructions | Wide | Local branches | Memory ops | Returns | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00103ADE` | 54 | 25 | 2 | 3 | 6 | 1 | 2 | `func_00103D1C` (+0x23e) |

The six memory operations are the initial stack save, three word loads, one
stack-relative word store, and the stack-restoring return. There are no
indirect calls, indirect tails, direct tails, PC-relative data accesses,
legacy no-operations, or adjacent owned bytes. The two direct calls are the
only wide instructions.

The body ends at +0x36. The next global begins at +0x23e, leaving 520 bytes of
post-body material outside this batch. The implementation must not emit or
claim any part of that interval.

## Call and relocation identities

The first four-byte call is at +0x8 and targets the existing public Thumb
primary `func_00303110`, at signed entry-relative offset +0x1ff632. That callee
is already owned by `config/thumb-leaf-helpers-09.json`; this batch references
the identity but owns none of its body.

The second four-byte call is at +0x28 and targets the neutral Thumb identity
`thumb_secondary_001035A0`, at signed entry-relative offset -0x53e. The
secondary entry is unowned. Relative to the selected primary, the preceding
global `func_00103568` begins at -0x576 and its 46-byte body ends at -0x548;
the secondary entry lies ten bytes after that body end. The following global
`func_001035E4` begins at -0x4fa. These boundary relations are normative and
do not transfer any destination or gap bytes into this batch.

Each call remains in Thumb state and requires one `R_ARM_THM_CALL` relocation
to its distinct undefined default-visible global function symbol. Both
relocation sections use ELF REL form, and each instruction field carries the
implicit addend -4. The relocations occur exactly at +0x8 and +0x28. There are
no other relocations and no state switch.

## Neutral semantic handoff

The `semantics` array covers offsets zero through 53 contiguously. Every row
records its byte offset and width, neutral operation and architectural form,
register roles, immediate value, flag effect, memory displacement, local
destination, or external transfer identity as applicable.

The five flag-setting register copies use the two-byte low-register form,
encoded through the zero-distance logical-shift form; replacing one with a
non-flag-setting high-register copy is not equivalent. Conversely, the two
copies from the stack pointer use the two-byte high-register form and do not
set flags. The shift-by-three, three-register addition, immediate-three
addition, two immediate constants, loads, store, comparisons, and exact stack
register lists must preserve the forms and operands recorded in the rows.

The three local conditional branches occur at +0x10, +0x1c, and +0x30. Their
conditions and body-relative destinations are respectively signed less-than-
or-equal to +0x32, equal to +0x32, and not-equal to +0x34. They use two-byte
conditional-immediate forms and create no relocations. The complete body is
continuously covered by Thumb code mapping from offset zero and has no
interior data mapping interval.

## ELF and symbol contract

The object is little-endian ELF32, type `ET_REL`, machine `EM_ARM`, ELF version
one, System V ABI, ABI version zero, with flags `0x05000000`. The selected
function occupies one `SHT_PROGBITS` allocatable executable section named
`.text.func_00103ADE`, aligned to two bytes and sized exactly 54 bytes.

The primary entry is a default-visible global `STT_FUNC` symbol with
`st_other` zero, Thumb-tagged value one, and size 54. Its section contains
exactly one local `STT_SECTION` symbol and one local default-visible
`STT_NOTYPE` `$t` mapping symbol at value zero.

The two callees appear as distinct undefined default-visible global
`STT_FUNC` symbols with `st_other` zero, `SHN_UNDEF`, value zero, and size
zero. Their destination state is fixed by the call contract rather than an
undefined-symbol value. Named and unnamed aliases are forbidden. The two
relocations belong to one `SHT_REL` section targeting the executable section.

## Ownership and completeness audit

The current report records `func_00103ADE` as unmatched. Recursive inspection
of every public configuration found it only as the next-global boundary in
Thumb batch 06, never as owned executable content. Its body does not overlap
another global. Exact whole-body comparison against all 10,440 target
functions found no identical peer, so `duplicateBodyClasses` is empty.

Independent validation should verify all 25 contiguous semantic rows, exact
54-byte section size and two-byte alignment, continuous `$t` mapping, all
primary/section/external symbol metadata, six memory operations, one return,
three local branches, two calls, and exactly the two call relocations at +0x8
and +0x28. It should reject any extra relocation, executable byte, mapping
interval, alias, adjacent ownership, PC-relative data access, legacy
no-operation, indirect transfer, direct tail, or duplicate-body claim. The
final validator must also pin the completed source digest and the complete
normalized configuration contract.
