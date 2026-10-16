.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT65_BODY name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, lr}
    mov     r4, r0
    ldr     r2, [r0, #16]
    cmp     r2, #0
    ldrne   r0, [r2]
    beq     .Ldt65_return\@
.Ldt65_unlink_test\@:
    cmp     r0, r2
    beq     .Ldt65_relink_sentinel\@
    ldr     r3, [r4, #16]
    mov     r1, r0
    cmp     r0, r3
    moveq   r0, r3
    beq     .Ldt65_unlink_test\@
    ldmia   r1, {r0, r3}
    ldr     r12, [r1]
    str     r12, [r3]
    ldmia   r1, {r3, r12}
    str     r12, [r3, #4]
    ldr     r3, [r4, #20]
    sub     r3, r3, #1
    str     r3, [r4, #20]
    ldr     r3, [r4, #4]
    str     r3, [r1]
    str     r1, [r4, #4]
    b       .Ldt65_unlink_test\@
.Ldt65_relink_sentinel\@:
    ldr     r0, [r4, #16]
    ldr     r1, [r4, #4]
    str     r1, [r0]
    str     r0, [r4, #4]
    ldr     r0, [r4]
    cmp     r0, #0
    beq     .Ldt65_clear_fields\@
.Ldt65_destroy_loop\@:
    mov     r5, r0
    ldr     r0, [r0]
    str     r0, [r4]
    ldr     r0, [r5, #8]
    cmp     r0, #0
    beq     .Ldt65_destroy_primary_done\@
    ldr     r1, [r0, #-8]!
    cmp     r1, #0
    beq     .Ldt65_destroy_primary_fallback\@
    blx     r1
    b       .Ldt65_destroy_primary_done\@
.Ldt65_destroy_primary_fallback\@:
    nop
    bl      func_00302108
.Ldt65_destroy_primary_done\@:
    cmp     r5, #0
    beq     .Ldt65_destroy_node_done\@
    ldr     r1, [r5, #-8]
    sub     r0, r5, #8
    cmp     r1, #0
    beq     .Ldt65_destroy_node_fallback\@
    blx     r1
    b       .Ldt65_destroy_node_done\@
.Ldt65_destroy_node_fallback\@:
    nop
    bl      func_00302108
.Ldt65_destroy_node_done\@:
    ldr     r0, [r4]
    cmp     r0, #0
    bne     .Ldt65_destroy_loop\@
.Ldt65_clear_fields\@:
    mov     r0, #0
    str     r0, [r4, #4]
    str     r0, [r4, #8]
    str     r0, [r4, #12]
.Ldt65_return\@:
    mov     r0, r4
    pop     {r4, r5, r6, pc}
.size \name, .-\name
.endm

DT65_BODY func_0056EF44
DT65_BODY func_0056F044
