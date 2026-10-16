.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT57_ADVANCE name, clear_helper, erase_helper
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
    bne     .Ldt57_iterate\@
    ldr     r1, [r5, #20]
    cmp     r1, #0
    beq     .Ldt57_iterate\@
    ldr     r4, [r0, #4]
    cmp     r4, #0
    beq     .Ldt57_reset\@
.Ldt57_clear_loop\@:
    ldr     r1, [r4, #12]
    mov     r0, r5
    bl      \clear_helper
    ldr     r0, [r5, #4]
    ldr     r2, [r4, #8]
    str     r0, [r4, #12]
    str     r4, [r5, #4]
    movs    r4, r2
    bne     .Ldt57_clear_loop\@
.Ldt57_reset\@:
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
.Ldt57_return\@:
    add     sp, sp, #12
    pop     {r4, r5, r6, r7, pc}
.Ldt57_iterate\@:
    ldr     r0, [r6]
    ldr     r2, [r4]
    cmp     r2, r0
    beq     .Ldt57_return\@
    ldr     r1, [r2, #12]
    mov     r0, r2
    cmp     r1, #0
    movne   r0, r1
    strne   r1, [r4]
    beq     .Ldt57_climb\@
.Ldt57_descend\@:
    ldr     r0, [r0, #8]
    cmp     r0, #0
    strne   r0, [r4]
    bne     .Ldt57_descend\@
    b       .Ldt57_erase\@
.Ldt57_climb\@:
    mov     r1, r0
    ldr     r0, [r2, #4]
    ldr     r3, [r0, #12]
    cmp     r1, r3
    bne     .Ldt57_parent_test\@
.Ldt57_climb_loop\@:
    mov     r1, r0
    str     r0, [r4]
    ldr     r0, [r0, #4]
    ldr     r3, [r0, #12]
    cmp     r1, r3
    beq     .Ldt57_climb_loop\@
.Ldt57_parent_test\@:
    ldr     r1, [r4]
    ldr     r1, [r1, #12]
    cmp     r1, r0
    strne   r0, [r4]
.Ldt57_erase\@:
    str     r2, [sp, #4]
    add     r2, sp, #4
    mov     r1, r5
    mov     r0, sp
    bl      \erase_helper
    ldr     r0, [sp]
    str     r0, [r7]
    b       .Ldt57_iterate\@
.size \name, .-\name
.endm

DT57_ADVANCE func_0018396C, func_0018A080, func_00189A24
DT57_ADVANCE func_0018F7A8, func_00192AE0, func_00192484
