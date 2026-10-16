.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT53_BLOCK name, helper, unit, far_input, final_step, rewind
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r10, r12, lr}
    bl      \helper
    push    {r0, r1, r2, r3}
    sub     lr, r11, #\unit
    ldm     lr, {r0, r1, r2, r3}
    add     lr, r11, #\far_input
    ldrb    r4, [lr, #-1]
    lsr     r10, r3, #24
    add     r5, r4, r10
    add     r5, r5, #1
    asr     r5, r5, #1
    add     r5, r5, r6, lsl #1
    sub     r6, r5, r4
    add     r6, r6, #1
    lsl     r4, r4, #3
    sub     sp, sp, #128
    mov     lr, sp
    add     r4, r4, r6, asr #1
    mov     r8, #255
    and     r7, r8, r0
    sub     r8, r4, r7, lsl #3
    add     r8, r8, #1
    lsl     r7, r7, #6
    add     r4, r4, r6, asr #1
    mov     r12, #255
    and     r9, r12, r0, lsr #8
    sub     r12, r4, r9, lsl #3
    add     r12, r12, #1
    lsl     r9, r9, #6
    stmia   lr!, {r7, r8, r9, r12}
    add     r4, r4, r6, asr #1
    mov     r8, #255
    and     r7, r8, r0, lsr #16
    sub     r8, r4, r7, lsl #3
    add     r8, r8, #1
    lsl     r7, r7, #6
    add     r4, r4, r6, asr #1
    mov     r12, #255
    and     r9, r12, r0, lsr #24
    sub     r12, r4, r9, lsl #3
    add     r12, r12, #1
    lsl     r9, r9, #6
    stmia   lr!, {r7, r8, r9, r12}
    add     r4, r4, r6, asr #1
    mov     r8, #255
    and     r7, r8, r1
    sub     r8, r4, r7, lsl #3
    add     r8, r8, #1
    lsl     r7, r7, #6
    add     r4, r4, r6, asr #1
    mov     r12, #255
    and     r9, r12, r1, lsr #8
    sub     r12, r4, r9, lsl #3
    add     r12, r12, #1
    lsl     r9, r9, #6
    stmia   lr!, {r7, r8, r9, r12}
    add     r4, r4, r6, asr #1
    mov     r8, #255
    and     r7, r8, r1, lsr #16
    sub     r8, r4, r7, lsl #3
    add     r8, r8, #1
    lsl     r7, r7, #6
    add     r4, r4, r6, asr #1
    mov     r12, #255
    and     r9, r12, r1, lsr #24
    sub     r12, r4, r9, lsl #3
    add     r12, r12, #1
    lsl     r9, r9, #6
    stmia   lr!, {r7, r8, r9, r12}
    add     r4, r4, r6, asr #1
    mov     r8, #255
    and     r7, r8, r2
    sub     r8, r4, r7, lsl #3
    add     r8, r8, #1
    lsl     r7, r7, #6
    add     r4, r4, r6, asr #1
    mov     r12, #255
    and     r9, r12, r2, lsr #8
    sub     r12, r4, r9, lsl #3
    add     r12, r12, #1
    lsl     r9, r9, #6
    stmia   lr!, {r7, r8, r9, r12}
    add     r4, r4, r6, asr #1
    mov     r8, #255
    and     r7, r8, r2, lsr #16
    sub     r8, r4, r7, lsl #3
    add     r8, r8, #1
    lsl     r7, r7, #6
    add     r4, r4, r6, asr #1
    mov     r12, #255
    and     r9, r12, r2, lsr #24
    sub     r12, r4, r9, lsl #3
    add     r12, r12, #1
    lsl     r9, r9, #6
    stmia   lr!, {r7, r8, r9, r12}
    add     r4, r4, r6, asr #1
    mov     r8, #255
    and     r7, r8, r3
    sub     r8, r4, r7, lsl #3
    add     r8, r8, #1
    lsl     r7, r7, #6
    add     r4, r4, r6, asr #1
    mov     r12, #255
    and     r9, r12, r3, lsr #8
    sub     r12, r4, r9, lsl #3
    add     r12, r12, #1
    lsl     r9, r9, #6
    stmia   lr!, {r7, r8, r9, r12}
    add     r4, r4, r6, asr #1
    mov     r8, #255
    and     r7, r8, r3, lsr #16
    sub     r8, r4, r7, lsl #3
    add     r8, r8, #1
    lsl     r7, r7, #6
    add     r4, r4, r6, asr #1
    mov     r12, #255
    and     r9, r12, r3, lsr #24
    sub     r12, r4, r9, lsl #3
    add     r12, r12, #1
    lsl     r9, r9, #6
    stmia   lr!, {r7, r8, r9, r12}
    sub     r9, r5, r10
    add     r9, r9, #1
    lsl     r10, r10, #3
    mov     lr, #16
.Ldt53_loop\@:
    add     r10, r10, r9, asr #1
    ldrb    r8, [r11, #-1]
    sub     r7, r10, r8, lsl #3
    add     r7, r7, #1
    lsl     r8, r8, #6
    add     r12, sp, #0
    ldm     r12, {r0, r1, r2, r3, r4, r5, r6, r12}
    add     r0, r0, r1, asr #1
    add     r2, r2, r3, asr #1
    add     r4, r4, r5, asr #1
    add     r6, r6, r12, asr #1
    str     r0, [sp]
    str     r2, [sp, #8]
    str     r4, [sp, #16]
    str     r6, [sp, #24]
    add     r8, r8, r7, asr #1
    add     r5, r0, r8
    add     r5, r5, #64
    asr     r5, r5, #7
    add     r8, r8, r7, asr #1
    add     r12, r2, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #8
    add     r8, r8, r7, asr #1
    add     r12, r4, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #16
    add     r8, r8, r7, asr #1
    add     r12, r6, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #24
    str     r5, [r11], #4
    add     r12, sp, #32
    ldm     r12, {r0, r1, r2, r3, r4, r5, r6, r12}
    add     r0, r0, r1, asr #1
    add     r2, r2, r3, asr #1
    add     r4, r4, r5, asr #1
    add     r6, r6, r12, asr #1
    str     r0, [sp, #32]
    str     r2, [sp, #40]
    str     r4, [sp, #48]
    str     r6, [sp, #56]
    add     r8, r8, r7, asr #1
    add     r5, r0, r8
    add     r5, r5, #64
    asr     r5, r5, #7
    add     r8, r8, r7, asr #1
    add     r12, r2, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #8
    add     r8, r8, r7, asr #1
    add     r12, r4, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #16
    add     r8, r8, r7, asr #1
    add     r12, r6, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #24
    str     r5, [r11], #4
    add     r12, sp, #64
    ldm     r12, {r0, r1, r2, r3, r4, r5, r6, r12}
    add     r0, r0, r1, asr #1
    add     r2, r2, r3, asr #1
    add     r4, r4, r5, asr #1
    add     r6, r6, r12, asr #1
    str     r0, [sp, #64]
    str     r2, [sp, #72]
    str     r4, [sp, #80]
    str     r6, [sp, #88]
    add     r8, r8, r7, asr #1
    add     r5, r0, r8
    add     r5, r5, #64
    asr     r5, r5, #7
    add     r8, r8, r7, asr #1
    add     r12, r2, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #8
    add     r8, r8, r7, asr #1
    add     r12, r4, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #16
    add     r8, r8, r7, asr #1
    add     r12, r6, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #24
    str     r5, [r11], #4
    add     r12, sp, #96
    ldm     r12, {r0, r1, r2, r3, r4, r5, r6, r12}
    add     r0, r0, r1, asr #1
    add     r2, r2, r3, asr #1
    add     r4, r4, r5, asr #1
    add     r6, r6, r12, asr #1
    str     r0, [sp, #96]
    str     r2, [sp, #104]
    str     r4, [sp, #112]
    str     r6, [sp, #120]
    add     r8, r8, r7, asr #1
    add     r5, r0, r8
    add     r5, r5, #64
    asr     r5, r5, #7
    add     r8, r8, r7, asr #1
    add     r12, r2, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #8
    add     r8, r8, r7, asr #1
    add     r12, r4, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #16
    add     r8, r8, r7, asr #1
    add     r12, r6, r8
    add     r12, r12, #64
    asr     r12, r12, #7
    orr     r5, r5, r12, lsl #24
    str     r5, [r11], #\final_step
    subs    lr, lr, #1
    bne     .Ldt53_loop\@
    add     sp, sp, #128
    sub     r11, r11, #\rewind
    pop     {r0, r1, r2, r3, r4, r10, r12, pc}
.size \name, .-\name
.endm

DT53_BLOCK func_001B04BC, func_001B047C, 1024, 15360, 1012, 16384
DT53_BLOCK func_001B6ABC, func_001B6A7C, 256, 3840, 244, 4096
DT53_BLOCK func_001BD0BC, func_001BD07C, 512, 7680, 500, 8192
