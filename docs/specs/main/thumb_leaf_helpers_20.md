# Thumb leaf/helper batch 20

## Scope and provenance

This clean-room analyst handoff covers `func_00103A16` for revision
`AS_EUR_REV2`. A global search of the authoritative report, target symbol
metadata, and recursive public ownership metadata found four unmatched Thumb
primary entries no larger than 128 bytes. This 110-byte helper was selected as
the next bounded candidate because its owned interval is entirely Thumb code,
ends exactly at the next global entry, has no PC-relative data access or
literal pool, and has no identical peer. Evidence was limited to ignored
target/report/symbol artifacts and public configuration ownership metadata.
No implementation source was read or authored.

The configuration's ordered semantic rows are the complete blind
implementation handoff. They contain no raw target bytes, opcode values,
disassembly transcript, proprietary string or asset, or canonical source. The
analyst leaves `sourceHash` null for the independent implementer and validator
to replace after a public source exists.

## Structural inventory and ABI

| Function | Body bytes | Instructions | Wide | Local branches | Memory ops | Returns | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00103A16` | 110 | 49 | 6 | 6 | 9 | 1 | 6 | `func_00103A84` (+0x6e) |

The entry follows the 32-bit Arm procedure-call convention. It saves `r1`
through `r7` and `lr`, using the saved argument-register words as six bytes of
temporary output storage. The incoming `r1` is retained in `r5` until a later
container lookup has replaced that role, and incoming `r2` is retained in
`r7`. `r4` begins as the all-ones sentinel and later becomes a pointer to an
eight-byte record. `r6` retains the result of the first lookup. The only return
restores `r1` through `r7` and the program counter.

The first call receives the stack temporary in `r0`, a word loaded through the
incoming `r0` in `r1`, and the constant six in `r2`. A second lookup receives
the word at the original `r1` and the all-ones sentinel. If that lookup reports
the sentinel, the stack temporary is finalized and the function returns the
sentinel. Otherwise a container is obtained, searched as eight-byte records,
grown when empty, and updated through the final call. On the success path the
return value is the signed record index obtained by subtracting the container
base from the selected record pointer and shifting right by three.

There are no indirect transfers, direct tails, legacy no-operations,
PC-relative data accesses, adjacent owned bytes, or interior data intervals.

## Calls and relocations

| Site | Destination | State | Entry-relative target | Effect |
| ---: | --- | --- | ---: | --- |
| +0x10 | `func_00302FB6` | Thumb | +0x1ff5a0 | call |
| +0x18 | `thumb_secondary_001035C0` | Thumb | -0x456 | call |
| +0x22 | `func_00303110` | Thumb | +0x1ff6fa | call |
| +0x38 | `func_00104A50` | Thumb | +0x103a | call |
| +0x4a | `func_00302FEE` | Thumb | +0x1ff5d8 | call |
| +0x62 | `func_00303188` | Thumb | +0x1ff772 | call |

Each four-byte call has exactly one `R_ARM_THM_CALL` relocation to a distinct
undefined, default-visible global function identity. The relocation format is
ELF REL and the instruction field carries implicit addend -4. No other
relocation is permitted and none of the calls changes instruction state.

Five destinations are existing matched Thumb primaries: `func_00302FB6`,
`func_00303110`, `func_00104A50`, `func_00302FEE`, and `func_00303188` are
owned by public Thumb batches 13, 09, 10, 06, and 04 respectively.
`thumb_secondary_001035C0` is an unowned Thumb entry between
`func_00103568` and `func_001035E4`; it supplies linkage identity only and
transfers no destination bytes to this batch.

## Control flow and encoding constraints

The six local branches are three conditional and three unconditional 16-bit
Thumb transfers:

| Site | Condition | Destination |
| ---: | --- | ---: |
| +0x20 | equal | +0x48 |
| +0x32 | not equal | +0x52 |
| +0x46 | always | +0x5c |
| +0x56 | equal | +0x5c |
| +0x5a | always | +0x30 |
| +0x6c | always | +0x48 |

All local transfers are fully resolved and create no relocation. Low-register
copies and arithmetic operations preserve their flag-setting two-byte forms;
the two stack-pointer copies preserve the non-flag-setting high-register form.
The additions at +0x1e, +0x34, +0x54, and +0x5e retain their three-operand
three-bit forms. The pointer adjustments at +0x44 and +0x58 retain their
two-operand eight-bit forms. The final signed division by eight is encoded as
an arithmetic right shift.

The object is ELF32 little-endian `ET_REL` for `EM_ARM` with EABI5 flags. The
single owned executable section has alignment two, begins with one canonical
`$t` mapping symbol, exports one default-visible Thumb function whose symbol
value is one, and ends at byte 110. Attributes identify ARMv6K, Thumb-1, and
VFPv2. Exactly six undefined function symbols and six SHT_REL call
relocations are present; SHT_RELA, named aliases, unnamed aliases, dynamic
symbols, adjacent data, and extra executable sections are forbidden.

## Independent implementation checklist

- Implement only `src/main/thumb_leaf_helpers_20.S` from the ordered semantic
  rows in `config/thumb-leaf-helpers-20.json`.
- Use `.arch armv6k`, `.fpu vfpv2`, `.thumb`, and a two-byte-aligned dedicated
  executable section.
- Express all six external calls symbolically so the assembler emits the exact
  six `R_ARM_THM_CALL` relocations; do not embed target displacements.
- Define the unowned secondary destination as an undefined function symbol and
  do not copy any bytes from its surrounding target interval.
- Preserve the exact local branch destinations and narrow instruction forms.
- Do not emit raw data directives or claim any bytes outside the 110-byte body.
