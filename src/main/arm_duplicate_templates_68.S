.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT68_RESET name, derived_identity, base_identity
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, lr}
    mov     r5, r0
    ldr     r0, .Ldt68_reset_derived\@
    str     r0, [r5]
    ldr     r0, [r5, #68]
    cmp     r0, #0
    bne     .Ldt68_reset_clear\@
    ldr     r0, [r5, #16]
    cmp     r0, #0
    movne   r4, #0
    beq     .Ldt68_reset_clear\@
.Ldt68_reset_release_loop\@:
    add     r0, r5, r4, lsl #2
    ldr     r0, [r0, #20]
    bl      func_001397B8
    add     r4, r4, #1
    cmp     r4, #10
    blt     .Ldt68_reset_release_loop\@
.Ldt68_reset_clear\@:
    mov     r0, #0
    str     r0, [r5, #68]
    mov     r2, r0
    mov     r1, r0
    str     r0, [r5, #16]
.Ldt68_reset_pair_loop\@:
    add     r12, r5, r2, lsl #2
    add     r2, r2, #1
    add     r1, r1, #2
    add     r3, r5, r2, lsl #2
    str     r0, [r12, #20]
    cmp     r1, #10
    add     r2, r2, #1
    str     r0, [r3, #20]
    blt     .Ldt68_reset_pair_loop\@
    ldr     r1, .Ldt68_reset_base\@
    str     r0, [r5, #12]
    mov     r0, r5
    str     r1, [r5]
    pop     {r4, r5, r6, pc}
.size \name, .-\name
.Ldt68_reset_derived\@:
    .word \derived_identity
.Ldt68_reset_base\@:
    .word \base_identity
.endm

.macro DT68_FIND name, type_identity
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, lr}
    ldr     r0, [r0, #4]
    bl      func_004C8F3C
    cmp     r0, #0
    ldrne   r5, .Ldt68_find_identity\@
    mov     r6, #0
    movne   r4, r0
    moveq   r0, r6
    beq     .Ldt68_find_return\@
    ldr     r0, [r4]
    ldr     r1, [r0, #8]
    mov     r0, r4
    blx     r1
.Ldt68_find_compare\@:
    cmp     r0, r5
    beq     .Ldt68_find_found\@
    ldr     r0, [r0]
    cmp     r0, #0
    bne     .Ldt68_find_compare\@
    mov     r4, r6
.Ldt68_find_found\@:
    mov     r0, r4
.Ldt68_find_return\@:
    pop     {r4, r5, r6, pc}
.size \name, .-\name
.Ldt68_find_identity\@:
    .word \type_identity
.endm

.macro DT68_ROUTE name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, lr}
    mov     r5, r0
    mov     r4, r1
    bl      func_0017F0D8
    ldr     r1, [r5, #104]
    ldr     r0, [r0, #16]
    bl      func_00172044
    movs    r6, r0
    beq     .Ldt68_route_missing\@
    mov     r0, r4
    bl      func_001524C8
    ldmia   r4, {r1, r2, r3}
    cmp     r0, #0
    mov     r0, r6
    beq     .Ldt68_route_secondary\@
    bl      func_00205A98
    b       .Ldt68_route_finish\@
.Ldt68_route_secondary\@:
    nop
    bl      func_00170E24
    nop
    nop
    b       .Ldt68_route_finish\@
.Ldt68_route_missing\@:
    mov     r1, #4
    add     r0, r5, #128
    bl      func_00160BA8
.Ldt68_route_finish\@:
    mov     r0, r5
    pop     {r4, r5, r6, lr}
    b       func_0029F40C
.size \name, .-\name
.endm

DT68_RESET func_00498858, arm_duplicate_templates_68_reset_derived_00498858_identity, arm_duplicate_templates_68_reset_shared_base_identity
DT68_RESET func_004997B8, arm_duplicate_templates_68_reset_derived_004997B8_identity, arm_duplicate_templates_68_reset_shared_base_identity
DT68_FIND func_004C8A2C, arm_duplicate_templates_68_find_004C8A2C_identity
DT68_FIND func_004C8A84, arm_duplicate_templates_68_find_004C8A84_identity
DT68_FIND func_004C8ADC, arm_duplicate_templates_68_find_004C8ADC_identity
DT68_ROUTE func_0053BDE0
DT68_ROUTE func_0053D934
