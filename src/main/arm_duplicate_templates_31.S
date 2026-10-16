.syntax unified
.arch armv6k
.arm

.macro FIXED_POINT_COMPLEX_TRANSFORM_64 name, coefficients, permutation
    .section .text.\name,"ax",%progbits
    .balign 4
    .word \coefficients
    .word 0
    .word \permutation
    .space 1276
    .global \coefficients
    .global \permutation
    .global \name
    .type \name, %function
\name:
    push	{r4, r5, r6, r7, r8, r9, sl, fp, lr}
    mov	r6, #0
    sub	sp, sp, #80
    mov	r7, r6
    mov	r8, r6
    ldrsh	r2, [r0]
    ldrsh	r1, [r0, #2]
    mov	lr, r6
    add	r3, r2, r1
    sub	r2, r2, r1
    asr	r1, r3, #1
    asr	r2, r2, #1
    strh	r2, [r0, #2]
    strh	r1, [r0]
.Ldt31_\@_0038:
    ldr	r1, [pc, #-1344]
    add	r3, r0, r6, lsl #1
    add	ip, r0, r7, lsl #1
    add	r4, r1, r8, lsl #1
    ldrsh	r1, [r3, #60]
    ldrsh	r5, [ip, #68]
    ldrsh	r2, [r3, #62]
    ldrsh	sl, [r4, #30]
    add	r9, r1, r5
    sub	r1, r1, r5
    lsl	r9, r9, #14
    str	r9, [sp, #36]
    ldrsh	r5, [ip, #70]
    asr	r1, r1, #1
    add	lr, lr, #1
    sub	r9, r2, r5
    add	r2, r2, r5
    ldr	r5, [pc, #-1420]
    lsl	fp, r9, #14
    str	fp, [sp, #8]
    add	r9, r5, sl, lsl #1
    rsb	r2, r2, #0
    ldrsh	r5, [r9]
    ldrh	r9, [r9, #2]
    asr	r2, r2, #1
    cmp	lr, #15
    mul	sl, r5, r2
    smulbb	fp, r9, r1
    ldr	r9, [sp, #36]
    sub	r6, r6, #2
    mla	r9, r5, r2, r9
    add	r7, r7, #2
    sub	r8, r8, #1
    sub	fp, r9, fp
    ldr	r9, [sp, #36]
    sub	r9, r9, sl
    str	r9, [sp, #32]
    asr	r9, fp, #15
    strh	r9, [r3, #60]
    ldrsh	fp, [r4, #30]
    ldr	r9, [pc, #-1512]
    smulbb	sl, r5, r1
    add	r9, r9, fp, lsl #1
    ldr	fp, [sp, #8]
    ldrh	r9, [r9, #2]
    sub	sl, fp, sl
    smlabb	r5, r5, r1, fp
    ldr	fp, [sp, #32]
    smlabb	r1, r9, r1, fp
    asr	r1, r1, #15
    strh	r1, [ip, #68]
    ldrsh	r9, [r4, #30]
    ldr	r1, [pc, #-1560]
    add	r1, r1, r9, lsl #1
    ldrsh	r1, [r1, #2]
    mla	r1, r1, r2, r5
    asr	r1, r1, #15
    strh	r1, [r3, #62]
    ldrsh	r3, [r4, #30]
    ldr	r1, [pc, #-1588]
    add	r1, r1, r3, lsl #1
    ldrsh	r1, [r1, #2]
    mul	r1, r1, r2
    sub	r1, r1, sl
    asr	r1, r1, #15
    strh	r1, [ip, #70]
    blt .Ldt31_\@_0038
    ldrh	r3, [r0, #66]
    mov	r2, #32
    add	r1, r0, #128
    rsb	r3, r3, #0
    strh	r3, [r0, #66]
.Ldt31_\@_0158:
    ldrsh	r3, [r1, #-2]
    ldrsh	ip, [r1, #-4]
    subs	r2, r2, #1
    asr	r3, r3, #1
    asr	ip, ip, #1
    strh	r3, [r1, #-2]
    strh	ip, [r1, #-4]!
    bne .Ldt31_\@_0158
    mov	r3, #16
    add	r1, r0, #2
.Ldt31_\@_0180:
    subs	r3, r3, #1
    ldrsh	r2, [r1]
    ldrsh	r6, [r1, #64]
    ldrsh	r5, [r1, #-2]
    ldrsh	ip, [r1, #62]
    add	r4, r2, r6
    sub	r6, r2, r6
    sub	r2, r5, ip
    add	ip, ip, r5
    asr	r4, r4, #1
    asr	ip, ip, #1
    asr	r7, r2, #1
    strh	ip, [r1, #-2]
    strh	r4, [r1]
    asr	r2, r6, #1
    strh	r7, [r1, #62]
    strh	r2, [r1, #64]
    add	r1, r1, #4
    bne .Ldt31_\@_0180
    mov	r2, #0
    mov	r3, r2
.Ldt31_\@_01d4:
    add	r1, r0, r2, lsl #1
    add	r3, r3, #1
    ldrsh	ip, [r1, #2]
    ldrsh	r4, [r1, #34]
    ldrsh	r8, [r1, #96]
    ldrsh	r5, [r1]
    ldrsh	r6, [r1, #32]
    add	sl, ip, r4
    ldrsh	r7, [r1, #98]
    sub	fp, r5, r6
    ldrsh	r9, [r1, #66]
    asr	sl, sl, #1
    strh	sl, [r1, #2]
    asr	sl, fp, #1
    rsb	r8, r8, r8, lsl #15
    add	r8, r8, #16384
    strh	sl, [r1, #32]
    ldrsh	sl, [r1, #64]
    sub	r7, r7, r7, lsl #15
    asr	r8, r8, #15
    add	r7, r7, #16384
    add	fp, r9, r8
    add	r5, r5, r6
    sub	ip, ip, r4
    asr	r7, r7, #15
    asr	fp, fp, #1
    sub	r4, sl, r7
    add	r6, sl, r7
    asr	r5, r5, #1
    strh	fp, [r1, #66]
    asr	ip, ip, #1
    asr	r7, r6, #1
    strh	r5, [r1]
    sub	r8, r9, r8
    strh	ip, [r1, #34]
    asr	r4, r4, #1
    strh	r7, [r1, #64]
    asr	r6, r8, #1
    strh	r4, [r1, #96]
    cmp	r3, #8
    add	r2, r2, #2
    strh	r6, [r1, #98]
    blt .Ldt31_\@_01d4
    mov	r1, #8
    str	r1, [sp, #28]
    mov	r1, #2
    str	r1, [sp, #60]
    mov	r1, #32
.Ldt31_\@_0294:
    ldr	r2, [sp, #28]
    asr	r1, r1, #1
    asr	r2, r2, #1
    str	r2, [sp, #28]
    ldr	r2, [sp, #60]
    ldr	r3, [sp, #28]
    lsl	ip, r2, #1
    ldr	r2, [sp, #28]
    cmp	r3, #0
    sxth	r3, ip
    sub	r2, r2, #1
    strd	r2, [sp, #56]
    mov	r2, #0
    str	r2, [sp, #16]
    subgt	r2, r3, #1
    strgt	r2, [sp, #48]
    ble .Ldt31_\@_0448
.Ldt31_\@_02d8:
    ldr	r3, [sp, #16]
    ldr	r2, [sp, #28]
    add	r2, r2, r3
    str	r2, [sp, #4]
    add	r6, r0, r2, lsl #2
    add	r5, r0, r3, lsl #2
    ldrsh	r8, [r6]
    ldrsh	r7, [r5]
    ldrsh	r9, [r5, #2]
    ldrsh	sl, [r6, #2]
    add	lr, r7, r8
    sub	fp, r7, r8
    ldr	r2, [sp, #48]
    add	r8, r9, sl
    sub	sl, r9, sl
    cmp	r2, #0
    asr	r7, lr, #1
    mov	r2, #0
    asr	r8, r8, #1
    strh	r7, [r5]
    asr	r9, fp, #1
    strh	r8, [r5, #2]
    asr	sl, sl, #1
    strh	r9, [r6]
    mov	ip, r2
    mov	r3, r2
    mov	r4, r2
    strh	sl, [r6, #2]
    ble .Ldt31_\@_042c
    ldr	r5, [sp, #16]
    add	r5, r1, r5, lsl #1
    str	r5, [sp, #36]
    ldr	r5, [sp, #4]
    add	r5, r1, r5, lsl #1
    str	r5, [sp, #40]
.Ldt31_\@_0364:
    ldr	r5, [sp, #40]
    ldr	sl, [sp, #48]
    ldr	lr, [pc, #-2172]
    add	r6, r5, r2
    add	r4, r4, #1
    add	r6, r0, r6, lsl #1
    cmp	r4, sl
    ldrh	fp, [r6]
    add	sl, lr, ip, lsl #1
    ldr	r5, [sp, #36]
    str	fp, [sp, #4]
    ldrh	lr, [sl, #4]
    ldrh	r7, [r6, #2]
    ldrh	sl, [sl, #6]
    add	r5, r5, r2
    smulbb	fp, fp, lr
    smulbb	lr, r7, lr
    smulbb	r7, r7, sl
    add	r5, r0, r5, lsl #1
    ldr	r6, [sp, #36]
    sub	r7, fp, r7
    ldr	fp, [sp, #4]
    ldrsh	r8, [r5, #2]
    ldrsh	r5, [r5]
    add	r7, r7, #16384
    smlabb	fp, fp, sl, lr
    asr	r7, r7, #15
    sub	lr, r5, r7
    add	fp, fp, #16384
    add	r5, r5, r7
    asr	r7, fp, #15
    ldr	r9, [sp, #40]
    asr	fp, lr, #1
    add	r6, r6, r3
    add	lr, r8, r7
    add	r9, r9, r3
    add	r6, r0, r6, lsl #1
    sub	r7, r8, r7
    asr	r5, r5, #1
    add	r9, r0, r9, lsl #1
    asr	r8, lr, #1
    strh	r5, [r6]
    strh	r8, [r6, #2]
    asr	r7, r7, #1
    strh	fp, [r9]
    add	r2, r2, r1
    add	r3, r3, r1
    add	ip, ip, #2
    strh	r7, [r9, #2]
    blt .Ldt31_\@_0364
.Ldt31_\@_042c:
    ldr	r2, [sp, #16]
    ldr	r3, [sp, #28]
    add	r2, r2, #1
    sxth	r2, r2
    cmp	r3, r2
    str	r2, [sp, #16]
    bgt .Ldt31_\@_02d8
.Ldt31_\@_0448:
    ldr	r2, [sp, #56]
    sub	r2, r2, #1
    sxth	r2, r2
    cmp	r2, #0
    bne .Ldt31_\@_0294
    ldrh	r6, [r0]
    ldrh	r5, [r0, #4]
    ldrh	r1, [r0, #2]
    ldrh	r7, [r0, #6]
    add	r4, r6, r5
    sub	r5, r6, r5
    add	r6, r1, r7
    strh	r4, [r0]
    ldr	fp, [pc, #-2444]
    mov	r2, #0
    strh	r6, [r0, #2]
    sub	r1, r1, r7
    strh	r5, [r0, #4]
    mov	r3, r2
    mov	ip, r2
    strh	r1, [r0, #6]
.Ldt31_\@_049c:
    add	r1, r0, r2, lsl #1
    add	r6, fp, r3, lsl #1
    ldrh	r4, [r1, #14]
    ldrh	r7, [r6, #4]
    ldrh	r5, [r1, #12]
    ldrh	r6, [r6, #6]
    add	ip, ip, #1
    smulbb	sl, r4, r7
    smulbb	r8, r5, r7
    smulbb	r9, r4, r6
    ldrh	r4, [r1, #8]
    ldrh	r7, [r1, #10]
    sub	r8, r8, r9
    add	r8, r8, #16384
    smlabb	r9, r5, r6, sl
    asr	r6, r8, #15
    sub	r5, r4, r6
    add	r6, r6, r4
    add	r4, r9, #16384
    strh	r6, [r1, #8]
    asr	r8, r4, #15
    add	r4, r7, r8
    strh	r4, [r1, #10]
    sub	r7, r7, r8
    strh	r5, [r1, #12]
    cmp	ip, #15
    add	r2, r2, #4
    add	r3, r3, #2
    strh	r7, [r1, #14]
    blt .Ldt31_\@_049c
    ldr	r2, [pc, #-2588]
    mov	r1, r0
    mov	r3, #0
    mov	r4, #32
.Ldt31_\@_0524:
    ldrsh	r5, [r2]
    ldrsh	r6, [r1]
    ldrsh	r7, [r1, #2]
    add	ip, r0, r5, lsl #1
    cmp	r3, r5, asr #1
    ldrsh	r5, [ip]
    ldrsh	ip, [ip, #2]
    bgt .Ldt31_\@_0564
    strh	r5, [r1]
    strh	ip, [r1, #2]
    ldrsh	ip, [r2]
    add	ip, r0, ip, lsl #1
    strh	r6, [ip]
    ldrsh	ip, [r2]
    add	ip, r0, ip, lsl #1
    strh	r7, [ip, #2]
.Ldt31_\@_0564:
    sub	ip, r4, #1
    add	r1, r1, #4
    sxth	r4, ip
    cmp	r4, #0
    add	r2, r2, #2
    add	r3, r3, #1
    bne .Ldt31_\@_0524
    add	sp, sp, #80
    pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
    .size \name, .-\name
.endm

FIXED_POINT_COMPLEX_TRANSFORM_64 func_001AB5F4, transform31_first_q15_coefficients, transform31_first_permutation_indices
FIXED_POINT_COMPLEX_TRANSFORM_64 func_001AD528, transform31_second_q15_coefficients, transform31_second_permutation_indices
