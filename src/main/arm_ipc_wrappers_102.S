.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0018592C, "ax", %progbits
.balign 4
.global func_0018592C
.type func_0018592C, %function
func_0018592C:
    push    {r4-r8, lr}
    mov     r6, #2
    mov     r8, #0
    ldr     r1, [pc, #400]
    mov     r5, r8
    mov     r7, #32
    str     r1, [r0], #4
    mov     r4, r0
    str     r8, [r0]
    str     r8, [r0, #4]
    str     r8, [r0, #8]
    mov     r0, #128
    bl      func_00184990
    movs    r1, r6
    str     r0, [r4]
    beq     .Lfirst_array_done
.Lfirst_array_loop:
    cmp     r0, #0
    strne   r5, [r0]
    subs    r1, r1, #1
    add     r0, r0, #4
    bne     .Lfirst_array_loop
.Lfirst_array_done:
    ldr     r0, [r4]
    sub     r5, r4, #4
    add     r1, r0, r6, lsl #2
    add     r0, r0, r7, lsl #2
    str     r0, [r4, #8]
    mov     r0, #4
    str     r1, [r4, #4]
    bl      func_00184990
    cmp     r0, #0
    nop
    beq     .Lsingleton_done
    ldr     r1, [pc, #288]
    str     r1, [r0]
.Lsingleton_done:
    ldr     r1, [r5, #4]
    str     r0, [r1]
    mov     r0, #2560
    bl      func_00184990
    cmp     r0, #0
    moveq   r6, #0
    beq     .Lfirst_prng_done
    ldr     r1, [pc, #256]
    mov     r7, #1
    str     r1, [r0], #4
    ldr     r1, [pc, #248]
    str     r1, [r0, #2504]
    add     r1, r0, #2496
    str     r7, [r0]
    stmia   r1, {r7, r8}
.Lfirst_prng_loop:
    ldr     r2, [r0, #2496]
    ldr     r12, [pc, #228]
    add     r3, r0, r2, lsl #2
    ldr     r3, [r3, #-4]
    mul     r12, r3, r12
    mov     r3, r0
    str     r12, [r0, r2, lsl #2]
    ldr     r2, [r1]
    add     r2, r2, #1
    cmp     r2, #624
    str     r2, [r1]
    bcc     .Lfirst_prng_loop
    add     r0, r3, #2048
    mov     r1, #1
    add     r0, r0, #460
    bl      func_0018B220
    sub     r4, r0, #2048
    sub     r6, r0, #2512
    sub     r4, r4, #460
    bl      func_00186404
    str     r0, [r4]
    add     r0, r4, #2496
    str     r7, [r4, #2496]
.Lsecond_prng_loop:
    ldr     r1, [r4, #2496]
    ldr     r2, [pc, #136]
    add     r3, r4, r1, lsl #2
    ldr     r3, [r3, #-4]
    mul     r2, r3, r2
    str     r2, [r4, r1, lsl #2]
    ldr     r1, [r0]
    add     r1, r1, #1
    cmp     r1, #624
    str     r1, [r0]
    bcc     .Lsecond_prng_loop
.Lfirst_prng_done:
    ldr     r0, [r5, #4]
    str     r6, [r0, #4]
    mov     r0, #56
    bl      func_00184990
    cmp     r0, #0
    nop
    beq     .Lcontext_done
    ldr     r1, [pc, #72]
    ldr     r2, [pc, #72]
    mov     r3, #0
    str     r1, [r0]
    add     r1, r0, #4
    mov     r12, r3
    stmia   r1, {r2, r8}
    add     r2, r0, #40
    add     r1, r0, #32
    stmia   r2, {r3, r12}
    mov     r2, r3
    strd    r2, [r1, #16]
.Lcontext_done:
    str     r0, [r5, #16]
    mov     r0, r5
    pop     {r4-r8, pc}
.size func_0018592C, . - func_0018592C

    .word   service_collection_vtable_102
    .word   service_singleton_vtable_102
    .word   service_prng_vtable_102
    .word   service_prng_terminal_102
    .word   service_prng_multiplier_102
    .word   service_context_vtable_102
    .word   service_context_descriptor_102

.section .note.GNU-stack, "", %progbits
