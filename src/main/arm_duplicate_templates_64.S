.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT64_BODY name, descriptor_helper, completion_helper, shared_identity, descriptor_identity
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, lr}
    mov     r4, r0
    mov     r6, r1
    ldr     r8, .Ldt64_shared\@
    sub     sp, sp, #64
    mov     r7, r2
    mov     r5, r3
    ldr     r0, [r8]
    mov     r1, r3
    cmp     r0, #0
    beq     .Ldt64_descriptor\@
    mov     r2, #1
    str     r2, [r4, #28]
    ldr     r0, [r0, #60]
    bl      func_0049F360
    cmp     r0, #0
    str     r0, [r4, #32]
    bge     .Ldt64_descriptor\@
    mov     r2, #0
    mov     r1, r2
    mov     r0, r2
    bl      func_0011EF4C
.Ldt64_descriptor\@:
    ldrsh   r0, [r5, #4]
    cmn     r0, #1
    beq     .Ldt64_direct_copy\@
    ldr     r1, .Ldt64_descriptor_identity\@
    add     r1, r1, r0, lsl #4
    mov     r0, sp
    bl      \descriptor_helper
    mov     r1, sp
    mov     r2, #64
    add     r0, r4, #36
    bl      func_00300B28
    nop
    nop
    b       .Ldt64_dispatch\@
.Ldt64_direct_copy\@:
    ldr     r1, [r5, #8]
    mov     r2, #64
    add     r0, r4, #36
    bl      func_00300B28
.Ldt64_dispatch\@:
    ldr     r1, [r8]
    ldr     r0, [r4, #32]
    mov     r5, #0
    ldr     r1, [r1, #60]
    cmp     r0, #20
    bcs     .Ldt64_invalid_index\@
    add     r0, r1, r0, lsl #2
    ldr     r0, [r0, #4]
    cmp     r0, #0
    ldrne   r5, [r0, #32]
    b       .Ldt64_indirect\@
.Ldt64_invalid_index\@:
    mov     r2, #0
    mov     r1, r2
    mov     r0, r2
    mov     r0, r0
.Ldt64_indirect\@:
    ldr     r0, [r5]
    ldr     r1, [r0, #20]
    mov     r0, r5
    blx     r1
    cmp     r0, #0
    blt     .Ldt64_fallback\@
    add     r5, r5, #12
    mov     r0, r4
    ldmia   r5, {r1, r2}
    add     sp, sp, #64
    pop     {r4, r5, r6, r7, r8, lr}
    b       \completion_helper
.Ldt64_fallback\@:
    add     sp, sp, #64
    mov     r2, r7
    mov     r1, r6
    mov     r0, r4
    pop     {r4, r5, r6, r7, r8, lr}
    b       \completion_helper
.size \name, .-\name
.Ldt64_shared\@:
    .word   \shared_identity
.Ldt64_descriptor_identity\@:
    .word   \descriptor_identity
.endm

DT64_BODY func_00492E68, func_0012EC80, func_004930B4, duplicate64_shared_state_identity, duplicate64_descriptor_table_a_identity
DT64_BODY func_004968F0, func_0012EF50, func_00496B3C, duplicate64_shared_state_identity, duplicate64_descriptor_table_b_identity
