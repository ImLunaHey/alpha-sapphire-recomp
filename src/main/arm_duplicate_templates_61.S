.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT61_RANGE_ERASE name, clear_helper, erase_helper
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, lr}
    sub     sp, sp, #12
    mov     r7, r0
    ldr     r0, [r1, #16]
    mov     r5, r1
    mov     r4, r2
    str     r0, [r7]
    ldr     r0, [r1, #16]
    ldr     r2, [r2]
    mov     r6, r3
    ldr     r1, [r0, #8]
    cmp     r2, r1
    ldreq   r1, [r6]
    cmpeq   r1, r0
    bne     .Ldt61_iter\@
    ldr     r1, [r5, #20]
    cmp     r1, #0
    beq     .Ldt61_iter\@
    ldr     r4, [r0, #4]
    cmp     r4, #0
    beq     .Ldt61_reset\@
.Ldt61_clear\@:
    ldr     r1, [r4, #12]
    mov     r0, r5
    bl      \clear_helper
    ldr     r1, [r5, #4]
    ldr     r2, [r4, #8]
    str     r1, [r4, #12]
    str     r4, [r5, #4]
    movs    r4, r2
    bne     .Ldt61_clear\@
.Ldt61_reset\@:
    ldr     r1, [r5, #16]
    mov     r0, #0
    str     r1, [r1, #8]
    ldr     r1, [r5, #16]
    str     r0, [r1, #4]
    ldr     r1, [r5, #16]
    str     r1, [r1, #12]
    str     r0, [r5, #20]
    ldr     r0, [r5, #16]
    str     r0, [r7]
.Ldt61_return\@:
    add     sp, sp, #12
    pop     {r4, r5, r6, r7, pc}
.Ldt61_iter\@:
    ldr     r0, [r6]
    ldr     r2, [r4]
    cmp     r2, r0
    beq     .Ldt61_return\@
    ldr     r0, [r2, #12]
    mov     r1, r2
    cmp     r0, #0
    beq     .Ldt61_parent\@
.Ldt61_left\@:
    str     r0, [r4]
    ldr     r0, [r0, #8]
    cmp     r0, #0
    bne     .Ldt61_left\@
    b       .Ldt61_erase\@
.Ldt61_parent\@:
    ldr     r0, [r2, #4]
    mov     r3, r1
    ldr     r1, [r0, #12]
    cmp     r3, r1
    bne     .Ldt61_final\@
.Ldt61_up\@:
    mov     r1, r0
    str     r0, [r4]
    ldr     r0, [r0, #4]
    ldr     r3, [r0, #12]
    cmp     r1, r3
    beq     .Ldt61_up\@
.Ldt61_final\@:
    ldr     r1, [r4]
    ldr     r1, [r1, #12]
    cmp     r1, r0
    strne   r0, [r4]
.Ldt61_erase\@:
    str     r2, [sp, #4]
    add     r2, sp, #4
    mov     r1, r5
    mov     r0, sp
    bl      \erase_helper
    ldr     r0, [sp]
    str     r0, [r7]
    b       .Ldt61_iter\@
.size \name, .-\name
.endm

DT61_RANGE_ERASE func_005530BC, func_005531F4, func_0014456C
DT61_RANGE_ERASE func_00558688, func_005588EC, func_00558028
