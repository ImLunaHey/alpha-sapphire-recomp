# Thumb leaf/helper batch 21

## Scope and provenance

This clean-room analyst handoff covers `func_00300ABC` for revision
`AS_EUR_REV2`. A global search of the authoritative report, target symbol
metadata, and recursive public ownership metadata found three unmatched Thumb
primary entries no larger than 128 bytes. This 90-byte helper was selected as
the next bounded candidate because its complete owned interval is Thumb code,
has no identical peer, and references rather than owns its one post-body
literal word. Evidence was limited to ignored target/report/symbol artifacts
and public configuration ownership metadata. No implementation source was
read or authored.

The configuration's ordered semantic rows are the complete blind
implementation handoff. They contain no raw target bytes, opcode values,
disassembly transcript, proprietary string or asset, private literal value, or
canonical source. The analyst leaves `sourceHash` null for the independent
implementer and validator to replace after a public source exists.

## Structural inventory and ABI

| Function | Body bytes | Instructions | Wide | Local branches | Memory ops | Returns | Direct calls | Indirect calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00300ABC` | 90 | 43 | 2 | 5 | 10 | 1 | 2 | 4 | `func_00300B28` (+0x6c) |

The entry follows the 32-bit Arm procedure-call convention and presents a
four-word variadic-style argument save area. It first saves `r0` through `r3`,
then saves `r0` through `r6` and `lr`. The callback pointer loaded through the
external word is retained in `r2`, the external-word address base in `r5`, a
stack-argument cursor in `r6`, and a temporary helper object in `r4`.

If the external callback is present and the stacked selector is no greater
than three, the helper invokes it with a zero second argument and immediately
uses the common epilogue. Larger selectors take the object-assisted path: a
temporary helper is conditionally created, initialized from the stacked
selector and argument cursor, dispatched twice through its method table, and
passed to the external callback between those method calls. The common
epilogue restores the saved registers, discards the original 16-byte argument
save area, and returns through `r3`.

There are no direct or indirect tails and no adjacent owned bytes. The one
legacy no-operation at +0x26 is a high-register self-copy and is
encoding-significant.

## Calls, relocations, and external identities

| Site | Destination | State | Entry-relative target | Effect |
| ---: | --- | --- | ---: | --- |
| +0x2c | `func_00100788` | Thumb | -0x200334 | call |
| +0x3c | `thumb_secondary_00100700` | Thumb | -0x2003bc | call |

Each four-byte direct call has exactly one `R_ARM_THM_CALL` relocation to a
distinct undefined, default-visible global function identity. The relocation
format is ELF REL and the instruction field carries implicit addend -4. Neither
call changes instruction state and no other relocation is permitted.

`func_00100788` is an existing matched Thumb primary owned by
`config/thumb-leaf-helpers-09.json`. `thumb_secondary_00100700` names an
unowned Thumb entry two bytes after the end of `func_0010068E` and before
`func_00100788`; it supplies linkage identity only and transfers no destination
bytes to this batch.

The four two-byte indirect calls occur at +0x14 through `r2`, +0x46 through
`r1`, +0x4e through `r2`, and +0x56 through `r1`. Each derives destination
state from bit zero and has no relocation or external symbol.

## PC-relative access and ownership

The word load at +0x4 uses a PC displacement of 84 and addresses body-relative
offset +0x5c. The selected entry has address modulo four equal to zero. The
referenced word starts two bytes after the 90-byte body and is outside this
batch; its value is deliberately opaque and is neither recorded nor
transferred. The next global entry begins at +0x6c, so the complete 18-byte gap
between body end and that global remains unowned.

An implementation must express the already-resolved PC-relative load without
emitting the referenced word, a literal-pool entry, relocation, or adjacent
padding into the owned executable section. The complete body remains under
Thumb code mapping, with no interior data interval.

## Control flow and encoding constraints

The five local branches are three conditional and two unconditional 16-bit
Thumb transfers:

| Site | Condition | Destination |
| ---: | --- | ---: |
| +0xa | equal | +0x16 |
| +0x10 | signed greater | +0x1e |
| +0x2a | equal | +0x34 |
| +0x32 | always | +0x36 |
| +0x58 | always | +0x16 |

All local transfers are fully resolved and create no relocation. Low-register
copies retain their flag-setting two-byte forms; stack-pointer copies and
adjustments retain their non-flag-setting two-byte forms. Stack word loads use
the recorded SP-relative offsets. The no-operation at +0x26 must remain the
legacy high-register self-copy rather than another architectural no-op.

The object is ELF32 little-endian `ET_REL` for `EM_ARM` with EABI5 flags. The
single owned executable section has alignment two, begins with one canonical
`$t` mapping symbol, exports one default-visible Thumb function whose symbol
value is one, and ends at byte 90. Attributes identify ARMv6K, Thumb-1, and
VFPv2; ARMv7 attributes are forbidden. Exactly two undefined function symbols
and two SHT_REL call relocations are present. SHT_RELA, named aliases, unnamed
aliases, dynamic symbols, adjacent data, and extra executable sections are
forbidden.

## Ownership and completeness audit

The authoritative report records `func_00300ABC` as unmatched. Recursive
inspection of every public configuration found no current owner, and exact
whole-body comparison across all 10,440 inventoried functions found no
identical peer. The preceding global `func_00300A48` is already public and ends
well before this entry; the following ARM global `func_00300B28` begins 108
bytes after this entry. Neither neighboring interval nor the post-body literal
word belongs to this batch.

Independent validation should verify all 43 contiguous semantic rows, exact
90-byte section size, continuous `$t` mapping, entry modulo-four requirement,
five local branches, ten explicit loads, one return, two direct calls, four
indirect calls, the legacy no-operation, symbol metadata, and exactly two call
relocations. It must reject extra executable bytes, adjacent ownership, data
mapping, aliases, literal ownership, relocation, transfer, or duplicate-body
claims.

Validation is bounded to 64 MiB of complete input, 16 MiB of aggregate
executable section data, 16,384 sections, 1,000,000 symbols across `SYMTAB`
and `DYNSYM`, and 1,000,000 relocations. Each limit must reject independently.

## Independent implementation checklist

- Implement only `src/main/thumb_leaf_helpers_21.S` from the ordered semantic
  rows in `config/thumb-leaf-helpers-21.json`.
- Use `.arch armv6k`, `.fpu vfpv2`, `.thumb`, and a two-byte-aligned dedicated
  executable section while preserving entry address modulo four equal to zero.
- Express both external calls symbolically so the assembler emits the exact
  two `R_ARM_THM_CALL` relocations; do not embed target displacements.
- Define the unowned secondary destination as an undefined function symbol and
  do not copy bytes from its surrounding target interval.
- Encode the PC-relative word load to body-relative +0x5c without defining or
  owning the referenced word.
- Preserve the exact local destinations, narrow forms, indirect target
  registers, and legacy no-operation.
- Do not emit raw data directives or claim any byte outside the 90-byte body.
