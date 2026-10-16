.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT55_RANGE_ERASE name, clear_helper, erase_helper
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, lr}
    mov     r6, r0
    sub     sp, sp, #12
    ldr     r0, [r1, #16]
    mov     r5, r1
    mov     r4, r2
    str     r0, [r6]
    ldr     r0, [r1, #16]
    ldr     r2, [r2]
    mov     r7, r3
    ldr     r1, [r0, #8]
    cmp     r2, r1
    ldreq   r1, [r7]
    cmpeq   r1, r0
    bne     .Ldt55_iterate\@
    ldr     r1, [r5, #20]
    cmp     r1, #0
    beq     .Ldt55_iterate\@
    ldr     r4, [r0, #4]
    cmp     r4, #0
    beq     .Ldt55_reset\@
.Ldt55_clear_loop\@:
    ldr     r1, [r4, #12]
    mov     r0, r5
    bl      \clear_helper
    ldr     r2, [r5, #4]
    ldr     r1, [r4, #8]
    str     r2, [r4, #12]
    str     r4, [r5, #4]
    movs    r4, r1
    bne     .Ldt55_clear_loop\@
.Ldt55_reset\@:
    ldr     r1, [r5, #16]
    mov     r0, #0
    str     r1, [r1, #8]
    ldr     r1, [r5, #16]
    str     r0, [r1, #4]
    ldr     r1, [r5, #16]
    str     r1, [r1, #12]
    str     r0, [r5, #20]
    ldr     r0, [r5, #16]
    str     r0, [r6]
.Ldt55_return\@:
    add     sp, sp, #12
    pop     {r4, r5, r6, r7, pc}
.Ldt55_iterate\@:
    ldr     r0, [r4]
    ldr     r1, [r7]
    cmp     r0, r1
    beq     .Ldt55_return\@
.Ldt55_each\@:
    ldr     r1, [r0, #12]
    mov     r3, r0
    cmp     r1, #0
    movne   r0, r1
    strne   r1, [r4]
    beq     .Ldt55_climb\@
.Ldt55_descend\@:
    ldr     r0, [r0, #8]
    cmp     r0, #0
    strne   r0, [r4]
    bne     .Ldt55_descend\@
    b       .Ldt55_erase\@
.Ldt55_climb\@:
    mov     r1, r0
    ldr     r0, [r0, #4]
    ldr     r2, [r0, #12]
    cmp     r1, r2
    bne     .Ldt55_check_parent\@
.Ldt55_climb_loop\@:
    mov     r1, r0
    str     r0, [r4]
    ldr     r0, [r0, #4]
    ldr     r2, [r0, #12]
    cmp     r1, r2
    beq     .Ldt55_climb_loop\@
.Ldt55_check_parent\@:
    ldr     r1, [r4]
    ldr     r1, [r1, #12]
    cmp     r1, r0
    strne   r0, [r4]
.Ldt55_erase\@:
    add     r2, sp, #4
    mov     r1, r5
    mov     r0, sp
    str     r3, [sp, #4]
    bl      \erase_helper
    ldr     r0, [sp]
    str     r0, [r6]
    ldr     r0, [r4]
    ldr     r1, [r7]
    cmp     r0, r1
    bne     .Ldt55_each\@
    add     sp, sp, #12
    pop     {r4, r5, r6, r7, pc}
.size \name, .-\name
.endm

DT55_RANGE_ERASE func_005597F4, func_00559948, func_00182CB0
DT55_RANGE_ERASE func_0055A9E4, func_0055AB38, func_0055A388
