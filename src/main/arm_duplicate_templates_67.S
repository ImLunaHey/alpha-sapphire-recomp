.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT67_CLEAR name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, lr}
    mov     r4, r0
    ldr     r6, [r0, #16]
    cmp     r6, #0
    beq     .Lclear_return\@
    ldr     r5, [r6]
    cmp     r5, r6
    beq     .Lclear_relink\@
.Lclear_entry_loop\@:
    ldr     r7, [r4, #16]
    cmp     r5, r7
    beq     .Lclear_next\@
    ldr     r2, [r5, #4]
    ldr     r7, [r5]
    add     r0, r5, #8
    str     r7, [r2]
    ldmia   r5, {r1, r2}
    str     r2, [r1, #4]
    ldr     r1, [r4, #20]
    sub     r1, r1, #1
    str     r1, [r4, #20]
    ldr     r1, [r5, #8]
    ldr     r1, [r1]
    blx     r1
    ldr     r0, [r4, #4]
    str     r0, [r5]
    str     r5, [r4, #4]
.Lclear_next\@:
    cmp     r7, r6
    mov     r5, r7
    bne     .Lclear_entry_loop\@
.Lclear_relink\@:
    ldr     r0, [r4, #16]
    ldr     r1, [r4, #4]
    str     r1, [r0]
    str     r0, [r4, #4]
    ldr     r0, [r4]
    cmp     r0, #0
    beq     .Lclear_zero\@
.Lclear_block_loop\@:
    mov     r5, r0
    ldr     r0, [r0]
    str     r0, [r4]
    ldr     r0, [r5, #8]
    bl      func_00160F9C
    mov     r0, r5
    nop
    bl      func_00160F9C
    ldr     r0, [r4]
    cmp     r0, #0
    bne     .Lclear_block_loop\@
.Lclear_zero\@:
    mov     r0, #0
    str     r0, [r4, #4]
    str     r0, [r4, #8]
    str     r0, [r4, #12]
.Lclear_return\@:
    mov     r0, r4
    pop     {r4, r5, r6, r7, r8, pc}
.size \name, .-\name
.endm

.macro DT67_RELEASE name, grow
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, lr}
    mov     r4, r0
    ldr     r1, [r0, #20]
    ldr     r5, [r0, #16]
    add     r0, r0, #4
    ldmia   r0, {r0, r2}
    sub     r1, r1, r5
    sub     r2, r2, r1, asr #2
    cmp     r2, r0, lsl #1
    bcc     .Lrelease_return\@
    asrs    r2, r1, #2
    bne     .Lrelease_grow\@
    ldr     r2, [r4, #12]
    cmp     r2, r0
    bhi     .Lrelease_grow\@
    cmp     r5, #0
    beq     .Lrelease_return\@
    mov     r0, #0
.Lrelease_count\@:
    cmp     r0, r1, asr #2
    bcs     .Lrelease_destroy\@
.Lrelease_count_loop\@:
    add     r0, r0, #1
    cmp     r0, r1, asr #2
    bcc     .Lrelease_count_loop\@
.Lrelease_destroy\@:
    nop
    bl      func_0040AC94
    ldr     r0, [r0]
    ldr     r1, [r0]
    ldr     r2, [r1, #4]
    mov     r1, r5
    blx     r2
    mov     r0, #0
    str     r0, [r4, #20]
    str     r0, [r4, #16]
    str     r0, [r4, #8]
.Lrelease_return\@:
    pop     {r4, r5, r6, pc}
.Lrelease_grow\@:
    asr     r1, r1, #2
    mov     r0, r4
    bl      \grow
    pop     {r4, r5, r6, pc}
.size \name, .-\name
.endm

DT67_CLEAR func_0056E4F0
DT67_CLEAR func_0056E6A8
DT67_RELEASE func_0056B390, func_0056B42C
DT67_RELEASE func_0056B550, func_0056B5EC
