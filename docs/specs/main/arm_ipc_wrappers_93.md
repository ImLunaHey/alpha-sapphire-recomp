# Neutral ARM service-helper specification 93

## Scope and provenance

- Target: `AS_EUR_REV2`, with provenance governed by `docs/PROVENANCE.md`.
- Analysis date: 2026-10-17.
- Clean-room role: analysis and semantic specification only.
- Implementation source identity: SHA-256
  `bc1c58ceaedd7bfc24d83cfeee1f364b9cdb937ae256d43a2a4aaa1dad7c97f8`.
- Evidence used: the unmatched-function report, neutral global-symbol inventory,
  recursive public ownership manifests, bounded private-target control/data-flow
  inspection, mode-aware direct-transfer resolution, and whole-text entry audit.
- Excluded from this document: target bytes, encodings, disassembly text,
  assembler source, private values, strings, assets, and target hashes.

The cohort contains the next two suitably bounded unmatched ARM service helpers
after IPC92. Their bodies total 772 bytes, or 193 fixed-width semantic slots.
`func_00180F24`, although earlier by address, is deliberately not selected: its
1,356-byte multi-loop scheduler/dispatcher is not a bounded IPC-wrapper helper.
The next otherwise suitable unmatched helper, `func_00181890`, remains for a
later batch so that this cohort stays within the established wave size.

A recursive ownership scan found neither selected entry nor selected interior
already owned as a public primary body, alias, secondary entry, literal code
entry, or material owner. Each complete body occurs once in the 10,440-body
inventory. A mode-aware scan found no direct transfer from outside the cohort
to a selected entry or interior.

## Function and extent contract

| Function | Section | Body | Following global | Semantic contract |
|---|---|---:|---|---|
| `func_001814C4` | `.text.func_001814C4` | 364 | `func_00181630` at +364 | Validate an active service object and inputs, build one queued record per active lane, update completion state, and return success/failure. |
| `func_001816F8` | `.text.func_001816F8` | 408 | `func_00181890` at +408 | Install bounded service configuration, acquire per-lane records, copy four compact descriptors, unwind partial acquisition on failure, finalize the object, and mark it active. |

Both bodies end exactly at their following global. They own no adjacent word,
literal pool, padding, table, string, or unrelated helper. Consequently this
batch adds no physical pool slot and no equality class; cumulative totals stay
at 886 slots in 463 classes.

## Direct-transfer and return contract

Exactly six linked direct transfers require `R_ARM_CALL` relocations. Five
destinations are four-byte-aligned ARM primary entries. The remaining
destination, `service_object_finalize_secondary_93`, is an ARM secondary entry
at +324 from `func_00170340`, eight bytes before `func_0017048C`. All six
identity classes are pairwise distinct.

| Body | Offset | Relocation | Stable destination |
|---|---:|---|---|
| `func_001814C4` | +144 | `R_ARM_CALL` | `func_001878A8` |
| `func_001814C4` | +172 | `R_ARM_CALL` | `func_001870E4` |
| `func_001814C4` | +204 | `R_ARM_CALL` | `func_00187DCC` |
| `func_001816F8` | +208 | `R_ARM_CALL` | `func_00187FDC` |
| `func_001816F8` | +368 | `R_ARM_CALL` | `func_00187F9C` |
| `func_001816F8` | +392 | `R_ARM_CALL` | `service_object_finalize_secondary_93` |

`func_001814C4` also performs one register-indirect state-exchanging call at
+292 through `r1`; it has no relocation. Returns occur at +308 and +360 in
that body, and at +328 and +404 in `func_001816F8`. There is no Thumb direct
destination, direct tail transfer, or literal relocation.

## Structured semantic slot schedule

Each row is an ordered sequence of four-byte slots. Offsets in the first column
are inclusive and advance by four in the exact order described. Register names,
conditions, memory widths, displacements, stack locations, call identities,
and branch destinations are interoperability facts; the prose does not
prescribe assembler syntax or binary encoding.

### `func_001814C4`

| Offsets | Ordered semantic slots |
|---:|---|
| +0..+20 | Save `r4` through `r11` and the return address; copy `r0` to `r5`; copy `r3` to `r10`; copy `r2` to `r11`; save VFP register `d8`; reserve 12 stack bytes. |
| +24..+36 | Load the byte at `[r0 + 80]`; load VFP scalar `s16` from caller stack +56; load VFP scalar `s17` from caller stack +68; compare the loaded byte with zero. |
| +40 | If the object byte is zero, continue at +300. |
| +44..+48 | Compare `r1` with zero; if equal, continue at +272. |
| +52..+56 | Compare `r10` with zero; if equal, continue at +224. |
| +60..+72 | Load the lane count at `[r5 + 252]`; set `r4` to zero; compare the count with zero; if it is not positive, continue at +224. |
| +76..+92 | Set `r0` to three times `r11`; store it at stack +4; load caller stack +60; subtract that value from `r10`; store the difference at stack +0. |
| +96..+116 | Set `r0` to five times `r4`; add eight times `r4` to `r0`; load `[r5 + 160]` into `r1`; set `r7` to `r5 + (r0 << 6)`; load caller stack +60 into `r2`; load `[r7 + 260]` into `r0`. |
| +120..+128 | Copy `r10` to `r9`; set `r8` to `r0 + r1 * r11`; compare `r2` with zero. |
| +132 | If `r2` is zero, continue at +156. |
| +136..+144 | Load the byte at `[r5 + 128]` into `r1`; copy `r2` to `r0`; linked transfer to `func_001878A8`. |
| +148..+152 | Load stack +0 into `r9`; add the returned `r0` to `r8`. |
| +156..+172 | Load stack +4 into `r0`; set `r6` to `r7 + (r0 << 3)`; add 312 to `r6`; copy `r6` to `r0`; linked transfer to `func_001870E4`. |
| +176..+192 | Store consecutive words `r8` and `r9` at `[r6]`; load caller stack +64 into `r0`; copy `r6` to `r1`; indexed-load `[r0 + (r4 << 2)]`; store that word at `[r6 + 8]`. |
| +196..+204 | Load caller stack +72 into `r2`; set `r0` to `r7 + 260`; linked transfer to `func_00187DCC`. |
| +208..+220 | Reload the lane count; increment `r4`; compare count with `r4`; if count is greater, continue at +96. |
| +224..+244 | Set `r0` to `r5 + (r11 << 3)`; add 6144 to `r0`; add 916 to `r0`; load caller stack +72 into `r1`; compare `r1` with zero; store `s16` and `s17` consecutively at `[r0]`. |
| +248..+252 | If `r1` is nonzero, set `r0` to one and store its low byte at `[r5 + 85]`. |
| +256..+268 | Load the byte at `[r5 + 81]`; compare it with zero; if equal, continue at +312; otherwise continue at +348. |
| +272..+292 | Set `r0` to one; store its low byte at `[r5 + 15]`; load `[r5]` into `r0`; load `[r0 + 20]` into `r1`; copy `r5` to `r0`; call through `r1` with state exchange. |
| +296..+308 | Set `r0` to zero; release the 12 stack bytes; restore VFP register `d8`; restore `r4` through `r11` and return. |
| +312..+324 | Load `[r5 + 92]`; subtract one and update flags; store the result back; if zero, continue at +340. |
| +328..+336 | Load the byte at `[r5 + 85]`; compare it with zero; if zero, continue at +348. |
| +340..+344 | Set `r0` to one; store its low byte at `[r5 + 81]`. |
| +348..+360 | Release the 12 stack bytes; set `r0` to one; restore VFP register `d8`; restore `r4` through `r11` and return. |

### `func_001816F8`

| Offsets | Ordered semantic slots |
|---:|---|
| +0..+16 | Save `r4` through `r10` and the return address; set `r6` to caller stack +36; copy `r0` to `r4`; set `r7` to caller stack +52; load two words from `[r6]` into `r0` and `r12`. |
| +20..+44 | Compare `r2` with eight; load two words from `[r7]` into `r6` and `r8`; set `r7` to eight; load caller stack +32 into `r5`; load caller stack +48 into `r9`; load VFP scalar `s1` from caller stack +44; if `r2` is above eight, replace it with eight. |
| +48..+72 | Store `r2` at `[r4 + 252]`; store the low bytes of `r0` and `r12` at +232 and +233; store `s1` at +236; store `r9` at +240; store incoming `s0` at +244; store the low byte of `r6` at +248. |
| +76..+100 | Load byte `[r8]`; compare `r3` with zero; store the byte at `[r4 + 249]`; load byte `[r8 + 1]`; set `r8` to one; store the byte at `[r4 + 250]`; set `r0` to zero. |
| +104 | If `r3` is zero, continue at +156. |
| +108..+112 | Test bit zero of `r3`; if clear, continue at +144. |
| +116..+120 | Compare `r0` with four; if `r0` is at least four, continue at +156. |
| +124..+140 | Set `r2` to nine times `r0`; set `r2` to `r4 + (r2 << 2)`; add 6144 to `r2`; add 772 to `r2`; store low byte one at `[r2]`. |
| +144..+152 | Shift `r3` right one bit and update flags; increment `r0`; if the shifted value is nonzero, continue at +108. |
| +156..+180 | Compare `r0` with four; set `r2` to four; if `r0` is above four, replace it with four; compare `r0` with zero; store `r0` at `[r4 + 256]`; if zero, set `r0` to two; if zero, continue at +328. |
| +184..+200 | Store `r1` at `[r4 + 100]`; load the lane count from `[r4 + 252]`; set `r6` to zero; compare count with zero; if it is not positive, continue at +256. |
| +204..+208 | Load `[r4 + 100]` into `r0`; linked transfer to `func_00187FDC`. |
| +212..+220 | Compare returned `r0` with zero; preserve architectural state in one scheduling slot; if zero, continue at +332. |
| +224..+240 | Set `r1` to five times `r6`; set `r2` to thirteen times `r6`; increment `r6`; set `r1` to `r4 + (r2 << 6)`; store the acquired `r0` at `[r1 + 260]`. |
| +244..+252 | Reload the lane count; compare it with `r6`; if count is greater, continue at +204. |
| +256..+284 | Set `r0` to zero; set `r1` to five times `r0`; add eight times `r0` to `r1`; set `r2` to `r5 + r1`; set `r1` to `r4 + r1`; load `[r2]` into `r3`; increment `r0`; compare `r0` with four. |
| +288..+312 | Add 180 to `r1`, write the updated address back, and store `r3` there; load source +4 into `r3`; store `r3` at destination +4; load source +8 into `r3`; store `r3` at destination +8; load the byte at source +12 into `r2`; store its low byte at destination +12. |
| +316 | If `r0` is below four, continue at +260. |
| +320..+328 | Set `r0` to zero; store low byte one at `[r4 + 80]`; restore saved registers and return. |
| +332..+344 | Set `r9` to zero; compare `r6` with zero; copy zero to `r5`; if `r6` is not positive, continue at +388. |
| +348..+368 | Set `r0` to five times `r5`; add eight times `r5` to `r0`; set `r7` to `r4 + (r0 << 6)`; load `[r4 + 100]` into `r0`; load `[r7 + 260]` into `r1`; linked transfer to `func_00187F9C`. |
| +372..+384 | Increment `r5`; compare `r6` with `r5`; clear `[r7 + 260]`; if `r6` is greater, continue at +348. |
| +388..+392 | Copy `r4` to `r0`; linked transfer to `service_object_finalize_secondary_93`. |
| +396..+404 | Set `r0` to one; store low byte one at `[r4 + 16]`; restore saved registers and return. |

## Verification obligations

- Reconstruct two ARM bodies of exactly 364 and 408 bytes, with no owned
  adjacent bytes and no literal pool.
- Preserve all 193 ordered four-byte semantic slots, including the explicit
  state-preserving slot at `func_001816F8` +216.
- Emit exactly six `R_ARM_CALL` relocations at the configured offsets and no
  other relocation in either owned extent.
- Preserve the one register-indirect state-exchanging call and all four return
  sites without turning them into direct relocation-bearing transfers.
- Preserve the secondary-entry relation at `func_00170340` +324 and keep all
  six direct destination identities pairwise distinct.
- Do not claim or absorb `func_00180F24`, `func_00181890`, or any intervening
  already-matched global.
