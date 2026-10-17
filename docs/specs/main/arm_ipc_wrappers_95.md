# Neutral ARM service-helper specification 95

## Scope and provenance

- Target: `AS_EUR_REV2`, with provenance governed by `docs/PROVENANCE.md`.
- Analysis date: 2026-10-17.
- Clean-room role: analysis and semantic specification only.
- Evidence used: the authoritative unmatched-function report, neutral global-
  symbol inventory, recursive public ownership manifests, bounded private-
  target control/data-flow inspection, mode-aware direct-transfer resolution,
  and whole-text entry auditing.
- Excluded from this document: target bytes, instruction encodings,
  disassembly text, assembler source, private values, strings, assets, and
  target hashes.

This cohort contains the next suitably bounded unmatched ARM service helper
after IPC94. Its executable body is exactly 328 bytes, or 82 ordered four-byte
semantic slots. It owns no adjacent literal or other post-body material, so the
complete owned extent is also 328 bytes. `func_00180F24` remains excluded: its
1,356-byte multi-loop scheduler/dispatcher is outside this bounded cohort. The
next otherwise suitable unmatched entry is `func_00184744`.

A recursive ownership scan found no selected entry or interior already owned
as a public primary body, alias, secondary entry, literal code entry, or
material owner. The complete body occurs once in the 10,440-body inventory.
A mode-aware whole-text direct-transfer scan found no transfer from outside
the selected body to its primary entry or any interior address.
The 176 physical bytes between the body and the next global are deliberately
unowned here. An identity at the first such byte is already modeled by IPC84
as an external secondary entry; that relationship does not enlarge IPC95's
extent. No post-body byte is loaded or otherwise reached by this function.

## Function and extent contract

| Function | Section | Body | Following global | Semantic contract |
|---|---|---:|---|---|
| `func_00183E28` | `.text.func_00183E28` | 328 | `func_00184020` at +504 | Search a keyed tree for a halfword key, derive a neighboring insertion/result record when the exact key is absent, and return its payload pointer. |

The routine follows the ARM procedure-call standard. It saves `r4` through
`r7` and the return address, reserves 28 stack bytes, and returns in `r0` after
restoring the saved registers. Its only external direct transfer is a normal
linked ARM call. It has no indirect call, external tail transfer, literal
pool, or secondary entry.

## Transfer, return, and relocation contract

Exactly one direct transfer requires a symbolic relocation:

| Body | Offset | Relocation | Transfer relation | Stable destination |
|---|---:|---|---|---|
| `func_00183E28` | +280 | `R_ARM_CALL` | linked | `func_0018A0BC` |

`func_0018A0BC` is a four-byte-aligned ARM primary entry. The sole return is
at +324. The function contains fifteen local conditional/unconditional direct
branches, none of which receives a relocation. There are no literal
relocations and no other relocation in the owned extent.

IPC cumulative adjacent-pool accounting is unchanged from IPC94: 892 physical
slots in 469 value classes.

## Structured semantic slot schedule

Each row is an ordered sequence of four-byte slots. Offsets are inclusive and
advance by four in the exact order described. Register names, conditions,
memory widths, displacements, stack locations, and local destinations are
interoperability facts; the prose does not prescribe textual assembly or
binary encoding.

### `func_00183E28`

| Offsets | Ordered semantic slots |
|---:|---|
| +0..+24 | Save `r4` through `r7` and the return address; reserve 28 stack bytes; set `r6` to stack +16; load the caller's key halfword from `[r1]` into `r2`; set `r1` to zero; store zero at stack +20; store the key halfword at stack +16. |
| +28..+52 | Load the root-holder pointer from `[r0 + 16]` into `r3`; retain the original `r0` in `r1`; set `r4` to stack +8; retain the root-holder pointer in `r7`; load its root link from `[r3 + 4]` into `r2`; set `r0` to one; compare the root link with zero. |
| +56..+60 | If the root link is nonzero, load the key halfword at stack +16 into `r12`; if the root link is zero continue at +100. |
| +64..+96 | Load the node halfword at `[r2 + 16]` into `r0`; copy `r2` to `r3`; compare the requested key in `r12` with the node key; when lower load the link at node +8, otherwise load node +12; set `r0` to one when lower and zero otherwise; compare the selected link with zero; if nonzero repeat at +64. |
| +100..+124 | Load the byte at retained owner +24 into `r12`; set `r5` to one; compare that byte with zero; if nonzero continue at +272; compare the current direction flag in `r0` with zero; copy the current node pointer in `r3` to `r12`; if the direction flag is zero continue at +256. |
| +128..+148 | Load the root-holder's link at +8 into `r0`; compare the current node `r3` with it; if equal continue at +272; load the current node byte at +0 into `r0`; compare it with zero; if nonzero continue at +172. |
| +152..+168 | Load the current node's parent link at +4 into `r0`; load `[r0 + 4]` into `r12`; compare that value with the current node; if equal load the current node link at +12 into `r12`; if equal continue at +256. |
| +172..+184 | Load the current node link at +8 into `r12`; copy the current node to `r0`; compare the loaded link with zero; if zero continue at +220. |
| +188..+216 | Load `[r12 + 12]` into `r0`; compare it with zero; if zero continue at +256; copy `r0` to `r12`; load `[r0 + 12]` into `r0`; compare it with zero; while nonzero repeat from +200; then continue at +256. |
| +220..+232 | Load `[r0 + 4]` into `r12`; load `[r12 + 8]` into `r7`; compare the current node `r3` with `r7`; if unequal continue at +256. |
| +236..+252 | Copy `r12` to `r0`; load `[r12 + 4]` into `r12`; load `[r12 + 8]` into `r7`; compare `r0` with `r7`; while equal repeat from +236. |
| +256..+268 | Load the requested key halfword at stack +16 into `r7`; load the candidate node halfword at `[r12 + 16]` into `r0`; compare the candidate key with the requested key; if the candidate key is greater than or equal, continue at +300. |
| +272..+280 | Set `r0` to stack +4; store the address stack +16 at stack +0; linked transfer to `func_0018A0BC`. |
| +284..+296 | Load the result pointer from stack +4 into `r0`; store it at stack +8; store byte one at stack +12; continue at +312. |
| +300..+308 | Set `r0` to zero; store the candidate node pointer from `r12` at stack +8; store byte zero at stack +12. |
| +312..+324 | Load the chosen node pointer from stack +8 into `r0`; release the 28 stack bytes; add 20 to `r0` to form the payload pointer; restore `r4` through `r7` and return. |

## Verification obligations

- Reconstruct one ARM body of exactly 328 bytes and no adjacent owned bytes.
- Preserve all 82 ordered executable slots, including every condition-code
  dependency, halfword/byte access, local branch, and stack location.
- Emit exactly one `R_ARM_CALL` relocation at +280 to `func_0018A0BC`; emit no
  other relocation in the owned extent.
- Preserve the singleton ARM destination class and the sole return at +324.
- Keep cumulative pool accounting fixed at 892 slots and 469 classes.
- Do not claim or absorb `func_00180F24`, `func_00184020`, the 176 physical
  bytes between the selected body and that next global, or `func_00184744`.
