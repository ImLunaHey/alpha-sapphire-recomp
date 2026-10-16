.syntax unified
.arch armv6k
.arm

.section .text.arm_runtime_helpers_23,"ax",%progbits
.balign 4

.global func_002DACF0
.type func_002DACF0, %function
func_002DACF0:
    push    {r4-r6}
    mov     r4, #0
    ldr     r12, [sp, #12]
    str     r4, [r0]
    str     r4, [r0, #4]
    cmp     r12, #0
    str     r4, [r0, #8]
    ldrh    r12, [r1]
    rev16eq r12, r12
    strh    r12, [r0, #8]
    ldrh    r12, [r1, #2]
    rev16eq r12, r12
    beq     .Lfirst_swap
    ldr     r4, [r1, #4]
    ldrb    r5, [r1, #7]
    bic     r4, r4, #0xff000000
    orr     r5, r4, r5, lsl #24
    b       .Lfirst_done
.Lfirst_swap:
    ldr     r5, [r1, #4]
    ldrb    r4, [r1, #7]
    rev     r5, r5
    bic     r5, r5, #0xff
    orr     r5, r5, r4
.Lfirst_done:
    nop
    beq     .Lsecond_swap
    ldr     r4, [r1, #8]
    ldrb    r6, [r1, #11]
    bic     r4, r4, #0xff000000
    orr     r4, r4, r6, lsl #24
    b       .Lsecond_done
.Lsecond_swap:
    ldr     r6, [r1, #8]
    ldrb    r4, [r1, #11]
    rev     r6, r6
    bic     r6, r6, #0xff
    orr     r4, r4, r6
.Lsecond_done:
    cmp     r12, #11
    bcs     .Lfailure
    cmp     r5, #65536
    strb    r12, [r0, #10]
    bcs     .Lfailure

    ldr     r6, .Lshift_width_table
    ldrb    r12, [r6, r12]
    lsl     r12, r5, r12
    cmp     r12, #4
    addls   r1, r1, #8
    str     r12, [r0]
    bls     .Lsuccess

    sub     r1, r3, r2
    cmp     r1, r4
    bls     .Lfailure
    cmp     r12, r1
    bhi     .Lfailure
    add     r3, r12, r4
    cmp     r3, r1
    addls   r1, r2, r4
    bhi     .Lfailure

.Lsuccess:
    str     r1, [r0, #4]
    pop     {r4-r6}
    mov     r0, #1
    bx      lr
.Lfailure:
    pop     {r4-r6}
    mov     r0, #0
    bx      lr
.size func_002DACF0, .-func_002DACF0

.Lshift_width_table:
    .word runtime_shift_width_table_23
.global runtime_shift_width_table_23

.section .note.GNU-stack,"",%progbits
