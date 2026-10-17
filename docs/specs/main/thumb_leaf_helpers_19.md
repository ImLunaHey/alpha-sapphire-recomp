# Thumb leaf/helper batch 19

## Scope and provenance

This clean-room analyst handoff covers `func_001042A6` for revision
`AS_EUR_REV2`. A global search of the authoritative report, target symbol
metadata, and recursive public ownership metadata found five unmatched Thumb
primary entries no larger than 128 bytes. This 106-byte helper was selected as
the next bounded candidate because its complete owned interval is Thumb code,
has no PC-relative data access or literal pool, and has no identical peer.
Evidence was limited to ignored target/report/symbol artifacts and public
configuration ownership metadata. No implementation source was read or
authored.

The configuration's ordered semantic rows are the complete blind
implementation handoff. They contain no raw target bytes, opcode values,
disassembly transcript, proprietary string or asset, or canonical source. The
analyst leaves `sourceHash` null for the independent implementer and validator
to replace after a public source exists.

## Structural inventory and ABI

| Function | Body bytes | Instructions | Wide | Local branches | Memory ops | Returns | Direct calls | Indirect calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_001042A6` | 106 | 49 | 4 | 7 | 14 | 1 | 4 | 1 | `func_001047CC` (+0x526) |

The entry follows the 32-bit Arm procedure-call convention. It consumes the
incoming context in `r0`, preserves the incoming `r1` as a later callback
argument, and treats `r2` as a Boolean cleanup selector. It saves `r0` through
`r2`, `r4` through `r7`, and `lr`, then reserves another 16 stack bytes. `r6`
holds the context, `r7` the cleanup selector, `r4` a table/result pointer, and
`r5` a reverse-loop index. The sole return first advances the stack by 28 bytes
and then restores `r4` through `r7` and the program counter; together these
operations consume the complete 48-byte frame.

The callback path loads a two-word record from `r4 + (r5 << 3)`. Its first word
becomes argument `r2`, its second word is called indirectly, the preserved
incoming `r1` becomes argument `r0`, and the context becomes argument `r1`.
The loop decrements `r5` with carry semantics and repeats while the subtraction
does not borrow. There are no direct or indirect tails, legacy no-operations,
PC-relative data accesses, adjacent owned bytes, or interior data intervals.

## Calls and relocations

| Site | Destination | State | Entry-relative target | Effect |
| ---: | --- | --- | ---: | --- |
| +0x1a | `thumb_secondary_00303E38` | Thumb | +0x1ffb92 | call |
| +0x34 | `func_00144D28` | ARM | +0x40a82 | call with state switch |
| +0x44 | `thumb_secondary_00104324` | Thumb | +0x7e | call |
| +0x64 | `func_00303EC8` | Thumb | +0x1ffc22 | call |

Each four-byte direct call has exactly one `R_ARM_THM_CALL` relocation to a
distinct undefined, default-visible global function identity. The relocation
format is ELF REL and the instruction field carries implicit addend -4. No
other relocation is permitted. The two-byte callback call at +0x58 transfers
through `r3`, derives the destination state from bit zero, and has no
relocation or external symbol.

`func_00144D28` is the existing matched ARM primary owned by
`config/arm-runtime-helpers-71.json`. `func_00303EC8` is the existing matched
Thumb primary owned by `config/thumb-leaf-helpers-15.json`.
`thumb_secondary_00303E38` names the Thumb secondary four bytes after the end
of `func_00303D9C` and before `func_00303EC8`; it is already a public linkage
identity but owns no destination byte here. `thumb_secondary_00104324` names a
Thumb secondary 20 bytes after this body's end and before the next global; it
likewise transfers no destination ownership.

## Control flow and encoding constraints

The seven local branches are five conditional and two unconditional 16-bit
Thumb transfers:

| Site | Condition | Destination |
| ---: | --- | ---: |
| +0xc | equal | +0x48 |
| +0x12 | equal | +0x5a |
| +0x2a | equal | +0x3a |
| +0x38 | always | +0x5a |
| +0x5c | carry set | +0x4c |
| +0x60 | equal | +0x48 |
| +0x68 | always | +0x48 |

All local transfers are fully resolved and create no relocation. Every
flag-setting register copy is the two-byte low-register zero-shift form.
Stack-pointer copies remain non-flag-setting high-register forms. Flag-setting
additions and subtractions retain the exact immediate or register form named by
their semantic rows; equivalent assembler spellings are not interchangeable
when they choose a different encoding. Memory width, base, index, and
displacement are normative. The immediate direct transfer to the ARM primary
must preserve the Thumb-to-ARM state switch.

The complete function is continuously covered by Thumb mapping from offset
zero. Its executable section stops at +0x6a. The next global starts at +0x526,
so none of the 1,212 intervening bytes belongs to this batch.

## ELF contract and audit

The output is little-endian ELF32, type `ET_REL`, machine `EM_ARM`, ELF version
one, System V ABI, ABI version zero, with flags `0x05000000`. The selected
function occupies one allocatable executable `SHT_PROGBITS` section named
`.text.func_001042A6`, aligned to two bytes and sized exactly 106 bytes. Arm
attributes require CPU name `6K`, architecture v6K, ARM ISA use, Thumb-1 ISA
use, and VFPv2; ARMv7 attributes are forbidden.

The primary is a default-visible global `STT_FUNC`, has `st_other` zero, a
Thumb-tagged value of one, and size 106. Its section contains exactly one local
`STT_SECTION` symbol and one local default-visible `$t` mapping symbol at value
zero. The four callees are distinct undefined default-visible global
`STT_FUNC` symbols with zero value and size. Named and unnamed aliases are
forbidden. One `SHT_REL` section targets the executable section and contains
only the four ordered call relocations.

The authoritative report records the primary as unmatched, recursive public
configuration inspection found no current body owner, and exact target-section
comparison found no same-sized identical peer. Independent validation should
therefore check all 49 contiguous semantic rows, exact size/alignment/mapping,
seven local branches, fourteen memory operations, one return, four direct
calls, one indirect call, all symbol metadata, and exactly four relocations. It
must reject extra executable bytes, adjacent ownership, data mapping, aliases,
literal access, relocation, transfer, or duplicate-body claims.

Validation is bounded to 64 MiB of complete input, 16 MiB of aggregate
executable section data, 16,384 sections, 1,000,000 symbols across `SYMTAB` and
`DYNSYM`, and 1,000,000 relocations. Each limit must reject independently.
