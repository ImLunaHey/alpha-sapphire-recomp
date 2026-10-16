.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT56_OWNER_CLEAR name, clear_helper, erase_helper
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, lr}
    mov     r5, r0
    ldr     r0, [r0, #16]
    sub     sp, sp, #8
    movs    r6, r0
    beq     .Ldt56_exit\@
    ldr     r1, [r5, #20]
    ldr     r4, [r0, #8]
    cmp     r1, #0
    beq     .Ldt56_iterate\@
    ldr     r4, [r0, #4]
    mov     r6, r5
    cmp     r4, #0
    beq     .Ldt56_reset\@
.Ldt56_clear_loop\@:
    ldr     r1, [r4, #12]
    mov     r0, r6
    bl      \clear_helper
    ldr     r1, [r6, #4]
    ldr     r0, [r4, #8]
    str     r1, [r4, #12]
    str     r4, [r6, #4]
    movs    r4, r0
    bne     .Ldt56_clear_loop\@
.Ldt56_reset\@:
    ldr     r1, [r5, #16]
    mov     r0, #0
    str     r1, [r1, #8]
    ldr     r1, [r5, #16]
    str     r0, [r1, #4]
    ldr     r1, [r5, #16]
    str     r1, [r1, #12]
    str     r0, [r5, #20]
    b       .Ldt56_after_tree\@
.Ldt56_iterate\@:
    cmp     r4, r6
    mov     r1, r4
    beq     .Ldt56_after_tree\@
    ldr     r0, [r4, #12]
    cmp     r0, #0
    beq     .Ldt56_climb\@
.Ldt56_descend\@:
    mov     r4, r0
    ldr     r0, [r0, #8]
    cmp     r0, #0
    bne     .Ldt56_descend\@
    b       .Ldt56_erase\@
.Ldt56_climb\@:
    ldr     r0, [r4, #4]
    ldr     r3, [r0, #12]
    cmp     r1, r3
    bne     .Ldt56_check_parent\@
.Ldt56_climb_loop\@:
    mov     r4, r0
    ldr     r0, [r0, #4]
    ldr     r2, [r0, #12]
    cmp     r4, r2
    beq     .Ldt56_climb_loop\@
.Ldt56_check_parent\@:
    ldr     r2, [r4, #12]
    cmp     r2, r0
    movne   r4, r0
.Ldt56_erase\@:
    str     r1, [sp]
    mov     r2, sp
    mov     r1, r5
    add     r0, sp, #4
    bl      \erase_helper
    nop
    nop
    b       .Ldt56_iterate\@
.Ldt56_after_tree\@:
    ldr     r0, [r5, #16]
    ldr     r1, [r5, #4]
    str     r1, [r0, #12]
    str     r0, [r5, #4]
    ldr     r0, [r5]
    cmp     r0, #0
    beq     .Ldt56_exit\@
.Ldt56_release_loop\@:
    mov     r4, r0
    ldr     r0, [r0]
    str     r0, [r5]
    ldr     r0, [r4, #8]
    bl      func_00160F9C
    mov     r0, r4
    nop
    bl      func_00160F9C
    ldr     r0, [r5]
    cmp     r0, #0
    bne     .Ldt56_release_loop\@
.Ldt56_exit\@:
    add     sp, sp, #8
    mov     r0, r5
    pop     {r4, r5, r6, pc}
.size \name, .-\name
.endm

DT56_OWNER_CLEAR func_002A0B88, func_00568AE4, func_00568484
DT56_OWNER_CLEAR func_002A0CD8, func_00569180, func_00568B20
