# Thumb leaf/helper batch 18

## Scope and provenance

This clean-room analyst handoff covers `func_0030274A` for revision
`AS_EUR_REV2`. A global search of the current report and target symbol metadata
found ten unmatched Thumb primary entries not owned by a public configuration.
This 100-byte entry was selected as the next bounded candidate because its
complete body contains only Thumb instructions, ends exactly at the next global
entry, and has no PC-relative data access, literal pool, adjacent ownership, or
duplicate-body dependency. Evidence was limited to the current unmatched
report, neutral global-symbol and mapping metadata, recursive public
configuration ownership metadata, and bounded private-target control-flow
inspection. No implementation source was read or authored.

The ordered semantic rows in the configuration are the complete blind
implementation handoff. They disclose no raw target bytes, opcode values,
disassembly transcript, proprietary string, asset, or canonical source. The
analyst handoff leaves `sourceHash` null; after independent implementation it
must be replaced by the SHA-256 of that public source and pinned by validation.

## Structural inventory and ABI

| Function | Body bytes | Instructions | Wide | Local branches | Memory ops | Returns | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_0030274A` | 100 | 47 | 3 | 10 | 9 | 3 | 3 | `func_003027AE` (+0x64) |

The entry follows the 32-bit Arm procedure-call convention. Incoming values
are consumed from `r0`, `r1`, and `r2`; the return value is in `r0`. The
function saves `r3` through `r7` together with `lr`, uses `r4` through `r7` as
preserved loop state, and returns through one of three identical stack-restoring
register lists. One word at stack offset zero preserves the incoming `r0`
across the nested loops. The nine memory operations are the initial stack save,
three stack-restoring returns, two byte loads, one stack-relative word store,
one register-offset word store, and one stack-relative word load.

There are no indirect calls, indirect tails, direct tails, PC-relative data
accesses, legacy no-operations, or adjacent owned bytes. The three direct calls
are the only wide instructions. The 100-byte body ends at +0x64, exactly where
the next global begins, so the implementation must emit no alignment residue or
destination bytes after the final local branch.

## Call and relocation identities

The four-byte call at +0x18 targets the unmatched Thumb primary
`func_003027AE`, whose entry is exactly +0x64 relative to the selected primary.
That identity is the next global and remains outside this batch; the reference
does not transfer ownership of any callee byte.

The four-byte call at +0x1e targets the existing public Thumb primary
`func_003026AC`, at signed entry-relative offset -0x9e. That complete primary is
owned by `config/thumb-leaf-helpers-14.json`; this batch references its linkage
identity only.

The four-byte call at +0x50 targets the existing matched ARM primary
`func_002FF7EC`, at signed entry-relative offset -0x2f5e. Its state is ARM, so
this transfer performs a Thumb-to-ARM state switch. Its public matched identity
is documented by `docs/specs/main/arm_opaque_address_returns_07.md`; no body or
addressed object from that batch is owned here.

Every call requires one `R_ARM_THM_CALL` relocation to its distinct undefined,
default-visible global function symbol. The relocation sections use ELF REL
form and each instruction field carries implicit addend -4. The relocations
occur exactly at +0x18, +0x1e, and +0x50. There are no other relocations.

## Neutral semantic handoff

The `semantics` array covers offsets zero through 99 contiguously. Every row
records its byte offset and width, neutral operation and architectural form,
register roles, immediate value, flag effect, memory displacement, exact local
destination, or external transfer identity as applicable.

The ten local branches are eight conditional and two unconditional 16-bit
Thumb transfers. Their sites and destinations are:

| Site | Condition | Destination |
| ---: | --- | ---: |
| +0x4 | equal | +0xa |
| +0x8 | equal | +0xe |
| +0x10 | equal | +0x1e |
| +0x16 | equal | +0x24 |
| +0x36 | unsigned higher | +0x3c |
| +0x3a | always | +0x3e |
| +0x46 | signed less | +0x30 |
| +0x4e | equal | +0x58 |
| +0x5c | signed less | +0x2c |
| +0x62 | always | +0x1e |

These transfers create no relocations. The branch to +0x1e is function-local
even though that destination is also a direct-call instruction.

All flag-setting register copies remain the two-byte low-register zero-shift
form. The variable logical shift at +0x4a uses `r0` as both value and result and
`r4` as the shift-count register. Immediate additions and subtractions preserve
the exact three-operand three-bit or two-operand eight-bit forms named by their
rows; GNU Arm assembly may otherwise canonicalize equivalent source text into
a byte-distinct encoding. The byte and word memory widths, base registers,
indices, and displacements are normative.

The complete body is continuously covered by Thumb code mapping from offset
zero. It contains no interior data mapping interval. If an encoding requires an
instruction-emission directive, it must retain `$t` mapping; a data-emission
directive that creates `$d` mapping is not equivalent.

## ELF and symbol contract

The object is little-endian ELF32, type `ET_REL`, machine `EM_ARM`, ELF version
one, System V ABI, ABI version zero, with flags `0x05000000`. The selected
function occupies one `SHT_PROGBITS` allocatable executable section named
`.text.func_0030274A`, aligned to two bytes and sized exactly 100 bytes.
Its architecture attributes are CPU name `6K`, CPU architecture `v6K`, ARM ISA
use, Thumb-1 ISA use, and VFPv2; ARMv7 attributes are forbidden.

The primary entry is a default-visible global `STT_FUNC` symbol with
`st_other` zero, Thumb-tagged value one, and size 100. Its section contains
exactly one local `STT_SECTION` symbol and one local default-visible
`STT_NOTYPE` `$t` mapping symbol at value zero.

The three callees appear as distinct undefined default-visible global
`STT_FUNC` symbols with `st_other` zero, `SHN_UNDEF`, value zero, and size
zero. Their Thumb or ARM destination state is fixed by the call contract rather
than by an undefined-symbol value. Named and unnamed aliases are forbidden.
The one canonical relocation section uses `SHT_REL`, targets the selected
executable section, and contains exactly the three recorded entries.

## Ownership and completeness audit

The current authoritative report records `func_0030274A` as unmatched.
Recursive inspection of every public configuration found no ownership of this
primary body. Its preceding global, `func_003026AC`, ends exactly at this entry,
and its next global, `func_003027AE`, starts exactly at the selected body end.
The two neighboring bodies are outside batch ownership. Exact whole-section
comparison across all 10,440 target functions found no identical peer, so
`duplicateBodyClasses` is empty.

Independent validation should verify all 47 contiguous semantic rows, exact
100-byte section size and two-byte alignment, continuous `$t` mapping, all
primary/section/external symbol metadata, nine memory operations, three
returns, ten local branches, three direct calls, and exactly the three call
relocations at +0x18, +0x1e, and +0x50. It should reject any extra relocation,
executable byte, mapping interval, alias, adjacent ownership, PC-relative data
access, legacy no-operation, indirect transfer, direct tail, or duplicate-body
claim. The final validator must also pin the completed source digest and the
complete normalized configuration contract.

Validation is bounded to 64 MiB of complete input, 16 MiB of aggregate
executable section data, 16,384 sections, 1,000,000 symbols across `SYMTAB`
and `DYNSYM`, and 1,000,000 relocations. Each limit must reject independently.
