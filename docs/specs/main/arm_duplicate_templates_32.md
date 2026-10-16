# Probe-verified duplicate ARM templates 32

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body duplicate grouping, bounded target disassembly and
  data-flow inspection, physical literal-slot comparison, and an independent
  GNU Arm mnemonic probe.
- Probe toolchain: GNU Arm assembler, objdump, objcopy, and readelf
  2.45.1.20251203 from GCC Arm Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, extracted assets, private absolute
  addresses, implementation source, or private data values.

Every function already exact in the current report and every function named
by a tracked config or specification through the concurrently present
duplicate-31, runtime-31, and IPC work was excluded before grouping. The two
functions below do not occur in any earlier config/spec and remain unmatched
in the current report. They form the highest-yield remaining complete-body ARM
duplicate group: two 1,276-byte bodies, totaling 2,552 executable bytes.

## In-place 64-point inverse fixed-point complex transform

These ARM-state functions are identical over their complete bodies:

- `func_001AB0F8`
- `func_001AD02C`

Each body is exactly 1,276 bytes (319 fixed-width ARM instructions). It accepts
in `r0` a writable interleaved array of signed 16-bit complex samples and
performs an in-place 64-point fixed-point transform. The body has no calls,
external branches, or relocations. Its ten branch targets are all body-local.
Labels in the schedule must therefore be uniquely scoped per expansion.

## Symbolic data-identity ledger

The body performs eight PC-relative loads from three word-aligned literal
slots outside its extent. Preserve the exact slot positions and load
displacements; the slots hold symbolic read-only-data identities, never
numeric constants in the implementation contract.

| Semantic identity | Slot relative to this body | Load instruction offsets |
| --- | ---: | --- |
| corresponding batch-31 Q15 coefficient identity | -12 bytes | +424, +1,052, +1,140, +1,188, +1,224 |
| corresponding batch-31 permutation/late-coefficient identity | -4 bytes | +832, +980 |
| `transform32_reverse_stage_coefficients` | +2,692 bytes | +696 |

The effective slot calculation uses the architectural ARM PC value of the
load instruction offset plus eight. In particular, the loads at +1,188 with
displacement -1,208 and at +1,224 with displacement -1,244 both resolve to
body offset -12. They therefore use the Q15 coefficient identity, not the
body-minus-4 permutation/late-coefficient identity.

For the first function, the first two identities are exactly
`transform31_first_q15_coefficients` and
`transform31_first_permutation_indices`; for the second, they are exactly
`transform31_second_q15_coefficients` and
`transform31_second_permutation_indices`. This is identity reuse, not merely
equal contents. The second identity is used first as a permutation-index base
and later as a coefficient base with an internal halfword displacement.

The third slot is exactly after the associated 1,416-byte batch-31 companion
body: after `func_001AB5F4` for the first expansion and after
`func_001AD528` for the second. Name its two distinct identities
`transform32_first_reverse_stage_coefficients` and
`transform32_second_reverse_stage_coefficients`.

Within each transform block all three identities are distinct, word-aligned,
and in read-only data. Corresponding identities across the two blocks are
also distinct. The second block is a uniform translation of the first at the
identity level: all three pairwise relative relationships and their ordering
are equal across blocks. The word at body offset -8 is not referenced by this
body and must not be folded into its identity ledger.

## Complete exact body schedule

```asm
    push	{r4, r5, r6, r7, r8, r9, sl, fp, lr}
    mov	r2, #0
    sub	sp, sp, #24
    mov	r3, r2
.Ldt32_0010:
    add	r1, r0, r2, lsl #1
    add	r3, r3, #1
    ldrsh	r5, [r1, #28]
    ldrsh	sl, [r1, #92]
    ldrsh	fp, [r1, #60]
    ldrsh	lr, [r1, #124]
    add	ip, r5, sl
    sub	r5, r5, sl
    add	r4, fp, lr
    add	sl, ip, r4
    ldrsh	r6, [r1, #62]
    ldrsh	r7, [r1, #126]
    sub	ip, ip, r4
    ldrsh	r9, [r1, #30]
    ldrsh	r8, [r1, #94]
    asr	sl, sl, #3
    strh	sl, [r1, #28]
    sub	r4, r6, r7
    sub	sl, fp, lr
    asr	ip, ip, #3
    strh	ip, [r1, #60]
    sub	ip, r9, r8
    add	fp, r5, r4
    add	r6, r6, r7
    sub	r5, r5, r4
    add	r4, r9, r8
    sub	r7, ip, sl
    add	ip, ip, sl
    add	r9, r4, r6
    asr	sl, fp, #3
    asr	r8, r5, #3
    sub	r4, r4, r6
    strh	sl, [r1, #92]
    asr	r5, r9, #3
    strh	r8, [r1, #124]
    asr	r4, r4, #3
    strh	r5, [r1, #30]
    asr	r6, r7, #3
    strh	r4, [r1, #62]
    asr	ip, ip, #3
    strh	r6, [r1, #94]
    cmp	r3, #8
    sub	r2, r2, #2
    strh	ip, [r1, #126]
    blt	.Ldt32_0010
    mov	r1, #8
    str	r1, [sp, #4]
    mov	r1, #2
    str	r1, [sp, #8]
    mov	r1, #32
.Ldt32_00d8:
    ldr	r2, [sp, #4]
    asr	r1, r1, #1
    asr	r2, r2, #1
    str	r2, [sp, #4]
    ldr	r2, [sp, #8]
    lsl	ip, r2, #1
    ldr	r2, [sp, #4]
    sub	r3, r2, #1
    cmp	r2, #0
    str	r2, [sp]
    sxth	r2, ip
    str	r2, [sp, #8]
    str	r3, [sp, #16]
    ble	.Ldt32_0284
    smulbb	r3, r1, r2
    sub	r6, r2, #1
    sub	r2, r3, r1
    str	r2, [sp, #12]
.Ldt32_0120:
    ldr	r2, [sp, #4]
    ldr	r3, [sp]
    cmp	r6, #0
    add	fp, r2, r3
    add	ip, r0, r3, lsl #2
    add	r7, r0, fp, lsl #2
    ldrsh	r9, [ip, #-4]
    ldrsh	r8, [r7, #-4]
    mov	r2, #0
    mov	r4, r2
    add	sl, r9, r8
    sub	r8, r9, r8
    asr	r9, sl, #1
    asr	r8, r8, #1
    strh	r8, [r7, #-4]
    strh	r9, [ip, #-4]
    ldrsh	r8, [ip, #-2]
    ldrsh	r9, [r7, #-2]
    mov	r3, r2
    mov	r5, r2
    add	sl, r8, r9
    sub	r8, r8, r9
    asr	r9, sl, #1
    asr	r8, r8, #1
    strh	r8, [r7, #-2]
    strh	r9, [ip, #-2]
    ble	.Ldt32_026c
    ldr	r7, [sp]
    ldr	ip, [sp, #12]
    add	ip, ip, r7, lsl #1
    str	ip, [sp, #20]
    ldr	ip, [sp, #12]
    add	r9, ip, fp, lsl #1
.Ldt32_01a4:
    ldr	ip, [sp, #8]
    ldr	r7, [pc, #-444]
    add	r5, r5, #1
    cmp	r5, r6
    add	r8, r4, ip, lsl #1
    add	ip, r9, r2
    add	r8, r7, r8, lsl #1
    add	r7, r0, ip, lsl #1
    ldrh	sl, [r8, #-4]
    ldrh	ip, [r7, #-4]
    ldrh	r7, [r7, #-2]
    ldrh	r8, [r8, #-2]
    sub	r4, r4, #2
    smulbb	fp, ip, sl
    smulbb	sl, r7, sl
    smulbb	ip, ip, r8
    smlabb	r7, r7, r8, fp
    sub	r8, sl, ip
    ldr	ip, [sp, #20]
    add	r7, r7, #16384
    add	sl, r9, r3
    add	ip, ip, r2
    asr	r7, r7, #15
    add	ip, r0, ip, lsl #1
    add	sl, r0, sl, lsl #1
    ldrsh	fp, [ip, #-4]
    add	r8, r8, #16384
    sub	r2, r2, r1
    sub	fp, fp, r7
    asr	r8, r8, #15
    asr	fp, fp, #1
    strh	fp, [sl, #-4]
    ldr	fp, [sp]
    add	lr, r3, fp, lsl #1
    ldrsh	fp, [ip, #-4]
    mla	lr, r1, r6, lr
    add	r7, r7, fp
    sub	r3, r3, r1
    asr	fp, r7, #1
    add	r7, r0, lr, lsl #1
    strh	fp, [r7, #-4]
    ldrsh	fp, [ip, #-2]
    sub	fp, fp, r8
    asr	fp, fp, #1
    strh	fp, [sl, #-2]
    ldrsh	ip, [ip, #-2]
    add	ip, ip, r8
    asr	ip, ip, #1
    strh	ip, [r7, #-2]
    blt	.Ldt32_01a4
.Ldt32_026c:
    ldr	r2, [sp]
    sub	r2, r2, #1
    sxth	r2, r2
    cmp	r2, #0
    str	r2, [sp]
    bgt	.Ldt32_0120
.Ldt32_0284:
    ldr	r2, [sp, #16]
    sub	r2, r2, #1
    sxth	r2, r2
    cmp	r2, #0
    bne	.Ldt32_00d8
    ldrh	r4, [r0]
    ldrh	r7, [r0, #4]
    ldrh	r5, [r0, #2]
    ldrh	r6, [r0, #6]
    add	ip, r4, r7
    sub	r7, r4, r7
    add	r4, r5, r6
    strh	r7, [r0, #4]
    ldr	r2, [pc, #1988]
    sub	r5, r5, r6
    strh	ip, [r0]
    strh	r5, [r0, #6]
    mov	r3, #15
    add	r1, r0, #124
    strh	r4, [r0, #2]
.Ldt32_02d4:
    ldrh	r4, [r1]
    ldrh	r5, [r2]
    ldrh	r6, [r1, #2]
    ldrh	r7, [r2, #2]
    ldrh	ip, [r1, #-4]
    smulbb	r8, r4, r5
    smulbb	r5, r6, r5
    subs	r3, r3, #1
    smlabb	r8, r6, r7, r8
    smulbb	r6, r4, r7
    sub	r2, r2, #4
    add	r4, r8, #16384
    sub	r6, r5, r6
    asr	r4, r4, #15
    sub	r5, ip, r4
    add	r4, r4, ip
    strh	r5, [r1]
    strh	r4, [r1, #-4]
    ldrh	r4, [r1, #-2]
    add	ip, r6, #16384
    asr	ip, ip, #15
    sub	r5, r4, ip
    add	ip, ip, r4
    strh	r5, [r1, #2]
    strh	ip, [r1, #-2]
    sub	r1, r1, #8
    bne	.Ldt32_02d4
    ldr	r2, [pc, #-844]
    mov	r1, r0
    mov	r3, #0
    mov	ip, #32
.Ldt32_0350:
    ldrsh	r5, [r2]
    ldrsh	r7, [r1]
    ldrsh	r6, [r1, #2]
    add	r4, r0, r5, lsl #1
    cmp	r3, r5, asr #1
    ldrsh	r5, [r4]
    ldrsh	r4, [r4, #2]
    bgt	.Ldt32_0390
    strh	r5, [r1]
    strh	r4, [r1, #2]
    ldrsh	r4, [r2]
    add	r4, r0, r4, lsl #1
    strh	r7, [r4]
    ldrsh	r4, [r2]
    add	r4, r0, r4, lsl #1
    strh	r6, [r4, #2]
.Ldt32_0390:
    sub	ip, ip, #1
    add	r1, r1, #4
    sxth	ip, ip
    cmp	ip, #0
    add	r2, r2, #2
    add	r3, r3, #1
    bne	.Ldt32_0350
    ldrh	r3, [r0]
    ldrh	r2, [r0, #2]
    mov	r6, #0
    mov	lr, r6
    add	r1, r3, r2
    sub	r2, r3, r2
    strh	r1, [r0]
    mov	r7, r6
    mov	r8, r6
    strh	r2, [r0, #2]
.Ldt32_03d4:
    ldr	r1, [pc, #-992]
    add	r3, r0, r6, lsl #1
    add	ip, r0, lr, lsl #1
    ldrsh	r2, [r3, #60]
    ldrsh	r5, [ip, #68]
    add	r4, r1, r7, lsl #1
    add	r8, r8, #1
    sub	r1, r2, r5
    add	r2, r2, r5
    ldrsh	sl, [r4, #30]
    ldrsh	r5, [r3, #62]
    lsl	r9, r2, #14
    str	r9, [sp, #4]
    ldrsh	r9, [ip, #70]
    asr	r1, r1, #1
    cmp	r8, #15
    add	r2, r5, r9
    sub	r5, r9, r5
    ldr	r9, [pc, #-1072]
    asr	r2, r2, #1
    sub	r6, r6, #2
    add	sl, r9, sl, lsl #1
    lsl	r9, r5, #14
    str	r9, [sp]
    ldrh	r9, [sl, #2]
    ldrh	r5, [sl]
    add	lr, lr, #2
    sub	r7, r7, #1
    smulbb	fp, r9, r1
    ldr	r9, [sp, #4]
    smulbb	sl, r5, r2
    smlabb	r9, r5, r2, r9
    sub	fp, r9, fp
    ldr	r9, [sp, #4]
    sub	r9, r9, sl
    str	r9, [sp, #4]
    ldr	r9, [sp]
    asr	sl, fp, #15
    strh	sl, [r3, #60]
    ldrsh	fp, [r4, #30]
    ldr	sl, [pc, #-1160]
    smlabb	r9, r5, r1, r9
    smulbb	r5, r5, r1
    add	sl, sl, fp, lsl #1
    ldr	fp, [sp]
    ldrh	sl, [sl, #2]
    sub	r5, fp, r5
    ldr	fp, [sp, #4]
    smlabb	r1, sl, r1, fp
    asr	r1, r1, #15
    strh	r1, [ip, #68]
    ldrsh	sl, [r4, #30]
    ldr	r1, [pc, #-1208]
    add	r1, r1, sl, lsl #1
    ldrh	r1, [r1, #2]
    smulbb	r1, r1, r2
    add	r1, r1, r9
    rsb	r1, r1, #0
    asr	r1, r1, #15
    strh	r1, [r3, #62]
    ldrsh	r3, [r4, #30]
    ldr	r1, [pc, #-1244]
    add	r1, r1, r3, lsl #1
    ldrh	r1, [r1, #2]
    smulbb	r1, r1, r2
    sub	r1, r5, r1
    asr	r1, r1, #15
    strh	r1, [ip, #70]
    blt	.Ldt32_03d4
    ldrh	r1, [r0, #66]
    rsb	r1, r1, #0
    strh	r1, [r0, #66]
    add	sp, sp, #24
    pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
```

## Control-flow and exact-probe evidence

The local branch ledger, in instruction order, is:

| Branch instruction offset | Condition | Destination label offset |
| ---: | --- | ---: |
| +192 | `lt` | +16 |
| +268 | `le` | +644 |
| +392 | `le` | +620 |
| +616 | `lt` | +420 |
| +640 | `gt` | +288 |
| +660 | `ne` | +216 |
| +828 | `ne` | +724 |
| +876 | `gt` | +912 |
| +936 | `ne` | +848 |
| +1,252 | `lt` | +980 |

The complete displayed mnemonic schedule was assembled independently for
ARMv6K. The resulting `.text` was exactly 1,276 bytes, had no relocation
entries, and matched the complete target body byte-for-byte. The target-side
complete-body grouping separately established that the second function is
identical to the first over all 1,276 bytes, so the same exact probe covers
both expansions and all 2,552 bytes in this batch.
