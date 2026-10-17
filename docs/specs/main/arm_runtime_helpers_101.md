# ARM runtime/helper batch 101 clean-room specification

## Scope

This batch covers the complete currently unmatched cohort of five 12-byte
ARM-state helpers that load an immediately adjacent data identity, perform one
word dereference, and transfer control without a local return. The batch owns
60 executable body bytes and 20 adjacent data bytes, for 80 bytes in five
16-byte sections. It contains 15 fixed-width instructions, ten memory
operations, two direct tail transfers, and three indirect tail transfers.
There are no calls, local branches, returns, aliases, duplicate bodies,
strings, or assets.

Evidence was limited to the current unmatched report, the neutral symbol
inventory, public configurations and specifications, and bounded private
target inspection of control flow, data-segment membership, and identity
equality. No implementation source was inspected. Independent implementation
set the configuration's normative `sourceHash` after the handoff.

All offsets below are byte offsets from the named function entry. Every body
operation is four bytes wide, unconditional, ARM-state, and non-flag-setting.

## Boundaries and totals

| Function | Body bytes | Owned adjacent bytes | Instructions | Memory operations | Transfer | Next global |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| `func_001D1DC8` | 12 | 4 | 3 | 2 | indirect through `r1` | `func_001D1DD8` |
| `func_001D1EEC` | 12 | 4 | 3 | 2 | indirect through `r3` | `func_001D1EFC` |
| `func_001D4248` | 12 | 4 | 3 | 2 | indirect through `r1` | `func_001D4258` |
| `func_00416324` | 12 | 4 | 3 | 2 | direct tail to `func_004E60D8` | `func_00416394` |
| `func_0044F520` | 12 | 4 | 3 | 2 | direct tail to `func_0010D1DC` | `func_0044F6A4` |

The memory count includes each PC-relative word load and each following word
load. Every function body ends at offset 12. Its reached adjacent word begins
at offset 12 and extends the owned section through offset 16. Intervening bytes
between an owned section and a later `nextGlobal` are not owned by this batch.

## Required operation schedules

### Shared indirect-dispatch-root pair

`func_001D1DC8` and `func_001D1EEC` use the same adjacent identity,
`runtime_indirect_dispatch_root_101`, but select different words and working
registers.

| Function | Offset | Width | Required semantics |
| --- | ---: | ---: | --- |
| `func_001D1DC8` | 0 | 4 | Load the PC-relative word at function offset 12 into `r1`. |
|  | 4 | 4 | Load the word at address `r1 + 12` back into `r1`. |
|  | 8 | 4 | Tail-transfer indirectly through `r1`; do not update `lr`. |
| `func_001D1EEC` | 0 | 4 | Load the PC-relative word at function offset 12 into `r3`. |
|  | 4 | 4 | Load the word at address `r3 + 8` back into `r3`. |
|  | 8 | 4 | Tail-transfer indirectly through `r3`; do not update `lr`. |

The two adjacent words are equal and must resolve through the same new opaque
identity. Register choice and displacement are part of the exact schedule;
the two bodies are not duplicates.

### Singleton indirect-dispatch slot

`func_001D4248` has this schedule:

| Offset | Width | Required semantics |
| ---: | ---: | --- |
| 0 | 4 | Load the PC-relative word at function offset 12 into `r1`; the word has identity `runtime_indirect_dispatch_slot_101`. |
| 4 | 4 | Load the word at address `r1 + 0` back into `r1`. |
| 8 | 4 | Tail-transfer indirectly through `r1`; do not update `lr`. |

Its adjacent identity is distinct from the shared pair and from every
established adjacent identity included in the public configuration audit.

### Direct-tail helpers

`func_00416324` has this schedule:

| Offset | Width | Required semantics |
| ---: | ---: | --- |
| 0 | 4 | Load the PC-relative word at function offset 12 into `r0`; the word has identity `runtime_dispatch_object_root_101`. |
| 4 | 4 | Load the word at address `r0 + 0` back into `r0`. |
| 8 | 4 | Tail-transfer directly to the ARM global entry `func_004E60D8`; do not update `lr`. |

`func_0044F520` has this schedule:

| Offset | Width | Required semantics |
| ---: | ---: | --- |
| 0 | 4 | Load the PC-relative word at function offset 12 into `r0`; reuse the established identity `runtime_dispatch_root_97`. |
| 4 | 4 | Load the word at address `r0 + 16` back into `r0`. |
| 8 | 4 | Tail-transfer directly to the ARM global entry `func_0010D1DC`; do not update `lr`. |

Both direct destinations are primary ARM entries in the neutral inventory.
The first adjacent identity is new and distinct from all established adjacent
identities. The second is an exact reuse of `runtime_dispatch_root_97`, which
batch 100 also reuses. The older public token `global_load_11` has the same
private identity; this batch deliberately uses the canonical runtime identity
and does not introduce an alias definition.

## PC-relative access and relocation contract

Every function has exactly one PC-relative data access: the word load at
offset 0 reaches its own adjacent word at offset 12. Each section therefore
has one `R_ARM_ABS32` relocation at offset 12. The two direct-tail sections
also have one `R_ARM_JUMP24` relocation at offset 8. The complete relocation
count is seven: five absolute-word relocations and two direct-tail
relocations.

| Function | Offset | Type | Symbol |
| --- | ---: | --- | --- |
| `func_001D1DC8` | 12 | `R_ARM_ABS32` | `runtime_indirect_dispatch_root_101` |
| `func_001D1EEC` | 12 | `R_ARM_ABS32` | `runtime_indirect_dispatch_root_101` |
| `func_001D4248` | 12 | `R_ARM_ABS32` | `runtime_indirect_dispatch_slot_101` |
| `func_00416324` | 8 | `R_ARM_JUMP24` | `func_004E60D8` |
| `func_00416324` | 12 | `R_ARM_ABS32` | `runtime_dispatch_object_root_101` |
| `func_0044F520` | 8 | `R_ARM_JUMP24` | `func_0010D1DC` |
| `func_0044F520` | 12 | `R_ARM_ABS32` | `runtime_dispatch_root_97` |

The literal load must reach offset 12 through ARM PC-relative addressing from
offset 0. Equal words remain independent relocation sites in their respective
sections and must not be moved to a shared pool.

## Symbol and identity rules

- Define exactly five default-visible global ARM function symbols, each
  spanning offsets 0 through 12 of its own section.
- Define no function alias, secondary entry, or nested symbol in an owned
  section.
- Introduce `runtime_indirect_dispatch_root_101` as one undefined,
  default-visible, four-byte-aligned initialized-data identity shared by two
  sections.
- Introduce `runtime_indirect_dispatch_slot_101` and
  `runtime_dispatch_object_root_101` as distinct undefined, default-visible,
  four-byte-aligned initialized-data identities.
- Reuse `runtime_dispatch_root_97`; do not mint a batch-local replacement or
  use the historical `global_load_11` spelling at this relocation site.
- Use the neutral inventory identities `func_0010D1DC` and `func_004E60D8`
  for the two direct tails.
- No selected whole body aliases or duplicates another selected or unselected
  inventory body.

## Coverage audit and cautions

All five names are present as complete unmatched 12-byte ARM bodies in the
current report. Their body intervals and 16-byte owned intervals are pairwise
disjoint. No selected name is owned by an existing public configuration.
`func_001D1DC8` is referenced as a transfer destination by an existing public
configuration, but that reference does not own its body. Every selected body
has multiplicity one across the 10,440-function neutral inventory.

The adjacent identity audit covered established PC-relative and adjacent-word
sites in the public configurations. The two words for
`runtime_indirect_dispatch_root_101` are equal; the other two new identities
are singletons; all three new identity classes are mutually distinct and do
not collide with established identities. All five reached words identify
aligned initialized-data locations. The `func_0044F520` word is the required
reuse described above.

Two unmatched returning routines with a superficially similar three-operation
shape are intentionally outside this batch. The earlier adjacent-global-load
audit classifies their neighboring words as non-relocatable scalar values.
They must not be pulled into this relocation-based family.

Use one executable PROGBITS section named `.text.<function>` per helper, with
four-byte alignment and exactly 16 owned bytes. The function symbol size is
12 bytes, excluding the adjacent word. Code mapping begins at offset zero and
data mapping begins at offset 12. Preserve the operation order, working
registers, dereference displacements, transfer kind, and absence of flag
updates. The final operations are tails, not calls or returns; no transfer may
update the link register. Validation should reject pooling, missing or extra
relocations, an identity merge or split, an invented alias, branch/call
confusion, a changed register or displacement, incorrect mapping transitions,
and any section or symbol boundary drift.

Source SHA-256: `1f46f249531554b9c00b67c3e3a5ff649938250f7e262d16fd731a7c065fa9e5`.
