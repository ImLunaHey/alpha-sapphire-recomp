# ARM runtime/helper batch 100 clean-room specification

## Scope

This batch covers seven currently unmatched ARM-state tail helpers for
`AS_EUR_REV2`. They contain 140 executable body bytes and own 28 bytes of
immediately adjacent literal data, for 168 bytes in seven 24-byte sections.
The bodies contain 35 fixed-width instructions, 17 memory operations, and
seven direct tail transfers. There are no calls, local branches, returns,
indirect transfers, strings, assets, function aliases, or duplicate bodies.

Evidence was limited to the current unmatched report, the neutral symbol
inventory, public configurations and specifications, and bounded inspection
of private target control flow and literal equality. No implementation source
was inspected. The completed clean-room source is pinned by `sourceHash` in
the configuration.

All offsets below are byte offsets from the named function entry. Every body
operation is four bytes wide, unconditional, and ARM-state. Unless an
operation explicitly says otherwise, it does not update condition flags.

## Boundaries and totals

| Function | Body bytes | Owned adjacent bytes | Instructions | Memory operations | Tail transfers | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `func_001159D8` | 20 | 4 | 5 | 3 | 1 | `func_001159F0` |
| `func_001159F0` | 20 | 4 | 5 | 3 | 1 | `func_00115A08` |
| `func_00115A08` | 20 | 4 | 5 | 3 | 1 | `func_00115A20` |
| `func_004AAA0C` | 20 | 4 | 5 | 2 | 1 | `func_004AAA24` |
| `func_004AAA24` | 20 | 4 | 5 | 2 | 1 | `func_004AAA3C` |
| `func_004AAAE4` | 20 | 4 | 5 | 2 | 1 | `func_004AAAFC` |
| `func_004AABC0` | 20 | 4 | 5 | 2 | 1 | `func_004AABD8` |

The memory count includes each PC-relative literal load and each ordinary word
load. Each function body ends at offset 20; its one reached adjacent word is
at offset 20 and extends the owned section through offset 24.

## Selector-dispatch family

`func_001159D8`, `func_001159F0`, and `func_00115A08` have the same schedule
except for selector values zero, one, and two respectively.

| Offset | Width | Required semantics |
| ---: | ---: | --- |
| 0 | 4 | Load the 32-bit PC-relative word at function offset 20 into `r0`. The word has symbolic identity `runtime_dispatch_root_97`. |
| 4 | 4 | Put the family selector in `r1` without updating flags. The values are 0, 1, and 2 in function order. |
| 8 | 4 | Load the word at address `r0 + 16` back into `r0`. |
| 12 | 4 | Load the word at address `r0 + 4` back into `r0`. |
| 16 | 4 | Tail-transfer directly to `runtime_dispatch_selector_tail_100`; do not update `lr`. |

The entry values of `r0` and `r1` are overwritten. At the transfer, `r0`
contains the twice-followed dispatch object and `r1` contains the selector.
No other general register is written by the body.

The transfer destination is one shared ARM secondary entry absent from the
neutral global inventory. Its identity is anchored at
`func_00111E70 + 68`; it lies 12 bytes before the next global,
`func_00111EC0`. This relation is identity metadata only and does not grant
this batch ownership of the destination bytes or permit an alias definition
there.

The adjacent words of all three functions resolve to exactly the established
`runtime_dispatch_root_97` identity from batch 97. This is a required reuse,
not a new look-alike symbol.

## Context-field family

`func_004AAA0C`, `func_004AAA24`, `func_004AAAE4`, and `func_004AABC0` have
the same schedule except for field displacements 28, 36, 52, and 44
respectively.

| Offset | Width | Required semantics |
| ---: | ---: | --- |
| 0 | 4 | Load the 32-bit PC-relative word at function offset 20 into `r1`. The word has symbolic identity `runtime_shared_context_root_100`. |
| 4 | 4 | Put zero in `r2` without updating flags. |
| 8 | 4 | Load the word at address `r1 + 356` back into `r1`. |
| 12 | 4 | Add the function's field displacement to `r1`, writing `r1` without updating flags. |
| 16 | 4 | Tail-transfer directly to the ARM global entry `func_004AA8A4`; do not update `lr`. |

Entry `r0` is preserved for the callee. At the transfer, `r1` addresses the
selected field of the followed context object and `r2` is zero. The offset
order is intentionally 28, 36, 52, 44 when the functions are listed by
address; it must not be sorted or renumbered.

The four adjacent words are equal to one another and define the new opaque
identity `runtime_shared_context_root_100`. Private representation is not part
of this specification. Target equality checks show that this identity is
distinct from `runtime_dispatch_root_97` and from every established
PC-relative word identity recoverable from the public configurations.

## PC-relative access and relocation contract

Every function has exactly one PC-relative data access: the four-byte load at
offset 0 reaches its own adjacent word at offset 20. Every owned section must
therefore contain exactly these two relocations:

- a direct ARM tail-transfer relocation `R_ARM_JUMP24` at offset 16; and
- an absolute-word relocation `R_ARM_ABS32` at offset 20.

For the selector family, the jump symbol is
`runtime_dispatch_selector_tail_100` and the absolute symbol is
`runtime_dispatch_root_97`. For the context-field family, the jump symbol is
`func_004AA8A4` and the absolute symbol is
`runtime_shared_context_root_100`. The batch therefore requires exactly 14
relocations: seven of each kind. There are no body data relocations, calls, or
other external references.

The literal load must reach offset 20 through ARM PC-relative addressing from
offset 0. The implementer must not move the word to a shared pool even though
several words have equal identity; placement and independent relocation sites
are part of the contract.

## Symbol and identity rules

- Define exactly seven default-visible global ARM function symbols, each
  spanning offsets 0 through 20 of its own section.
- Define no function alias or nested entry in any owned section.
- Reuse `runtime_dispatch_root_97` as an undefined default-visible symbol.
- Introduce `runtime_shared_context_root_100` as one undefined,
  default-visible, four-byte-aligned data identity shared by four sections.
- Introduce `runtime_dispatch_selector_tail_100` as one undefined,
  default-visible, four-byte-aligned ARM code identity shared by three
  sections. It denotes the recorded secondary entry and is not an alias owned
  by this batch.
- Use the neutral inventory identity `func_004AA8A4` for all four context
  family transfers. Do not invent a replacement tail symbol.
- Keep the two literal identity classes distinct. No selected function body
  aliases another selected or unselected whole body.

## Implementation handoff and cautions

Use one executable PROGBITS section named `.text.<function>` per helper, with
four-byte alignment and exactly 24 owned bytes. The function symbol size is
20 bytes, excluding the adjacent word. Code mapping begins at offset zero;
data mapping begins at offset 20. No padding, extra pool entry, extra named
symbol, or additional owned byte is permitted.

The direct transfers are tails, not calls: they preserve the caller's link
register and have no local return site. In particular, do not synthesize a
save/restore sequence or replace a tail transfer with a call-and-return.
Preserve register allocation, operation order, immediate values, non-flagging
behavior, and the exact word displacements. Equivalent high-level behavior
with a different temporary register or reordered loads is not sufficient.

All seven report entries are complete unmatched 20-byte bodies. Their body
intervals and 24-byte owned intervals are pairwise disjoint, no selected name
is already owned by a public configuration, and every complete body has
multiplicity one across the 10,440-function neutral inventory. The adjacent
equality classes and both transfer destinations were independently checked
against the private target. Validation should reject wrong selector or field
values, a changed dereference displacement, flag-setting substitutions,
literal pooling, missing or extra relocations, branch/call confusion,
identity merging, aliases, incorrect mapping-symbol transitions, and any
section or symbol boundary drift.

Source SHA-256: `8c8af2588132472a5c074ce0f241293c093a562c79e0cdfec64ce4f44ca5400c`.
