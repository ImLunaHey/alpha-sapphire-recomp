.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT60_BODY name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, r9, r10, r11, r12, lr}
    mov     r4, r0
    mov     r8, r1
    mov     r5, r2
    mov     r6, #63
    ldr     r10, [pc, #420]
    lsl     r9, r1, #15
    mvn     r11, r10
.Ldt60_loop\@:
    ldrsh   r0, [r4, #12]
    ldr     r1, [r4, #8]
    add     r2, r4, r0, lsl #1
    ldrsh   r0, [r2, #48]
    lsl     r0, r0, #7
    qsub    r0, r1, r0
    str     r0, [r4, #8]
    ldrh    r0, [r5]
    strh    r0, [r2, #16]
    ldrsh   r0, [r5]
    ldrsh   r1, [r4, #12]
    cmp     r0, #0
    rsblt   r0, r0, #0
    add     r1, r4, r1, lsl #1
    sxth    r0, r0
    strh    r0, [r1, #48]
    ldr     r1, [r4, #8]
    ldrh    r2, [r4, #12]
    lsl     r0, r0, #7
    qadd    r0, r1, r0
    add     r1, r2, #1
    str     r0, [r4, #8]
    asr     r0, r0, #11
    and     r7, r1, #15
    sxth    r12, r0
    strh    r7, [r4, #12]
    ldrsh   r0, [r4, #14]
    sub     r1, r12, r0
    cmp     r1, #0
    ldrgt   r0, [r4]
    strgt   r0, [r4, #4]
    ldrle   r0, [r4, #4]
    strle   r0, [r4]
    asr     r2, r0, #2
    qsub    r2, r0, r2
    lsl     r0, r12, #14
    qadd    r2, r2, r0
    cmp     r1, #0
    str     r2, [r4]
    ldr     r0, [r4, #4]
    asr     r3, r0, #13
    qsub    r3, r0, r3
    lsl     r0, r12, #3
    qadd    r0, r3, r0
    str     r0, [r4, #4]
    asrgt   r0, r2, #16
    asrle   r0, r0, #16
    strh    r0, [r4, #14]
    sxth    r1, r0
    subs    r0, r8, r1
    bmi     .Ldt60_scaled\@
    add     r0, r4, r7, lsl #1
    ldrh    r0, [r0, #16]
    strh    r0, [r5], #2
    b       .Ldt60_next\@
.Ldt60_scaled\@:
    mov     r0, r9
    bl      func_00300754
    add     r1, r4, r7, lsl #1
    ldrh    r1, [r1, #16]
    smulbb  r0, r1, r0
    asr     r0, r0, #15
    cmp     r0, #32768
    movge   r0, r10
    bge     .Ldt60_store\@
    cmn     r0, #32768
    movlt   r0, r11
.Ldt60_store\@:
    strh    r0, [r5], #2
.Ldt60_next\@:
    sub     r0, r6, #1
    sxth    r6, r0
    cmp     r6, #0
    bge     .Ldt60_loop\@
    pop     {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
.size \name, .-\name
.endm

DT60_BODY func_001A3964
DT60_BODY func_001A4110
