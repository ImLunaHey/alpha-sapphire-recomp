.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00184E10, "ax", %progbits
.balign 4
.global func_00184E10
.type func_00184E10, %function
func_00184E10:
    push    {r4-r10, lr}
    mov     r4, r0
    mov     r7, r1
    mov     r9, #1
    ldr     r0, [pc, #232]
    bic     r1, r1, #255
    mov     r8, r2
    str     r0, [r4]
    ldr     r0, [pc, #220]
    orr     r6, r1, #1
    mov     r5, r0
    bl      func_0017EA3C
    ldr     r3, [pc, #208]
    mov     r10, #0
    cmp     r8, #0
    mov     r1, r4
    mov     r2, r7
    strb    r10, [r4, #16]
    beq     .Lzero_index
    ldr     r3, [r3, #68]
    ldmia   r3, {r3, r12}
    sub     r12, r12, r3
    cmp     r8, r12, asr #2
    bhs     .Lrange_failure
    ldr     r0, [r3, r8, lsl #2]
    cmp     r0, #0
    beq     .Lentry_failure
    bl      func_0018B394
    cmp     r0, #0
    bne     .Linstall
    b       .Lrange_failure
.Lzero_index:
    add     r0, r3, #4
    bl      func_0018B394
    cmp     r0, #0
    nop
    beq     .Lrelease
.Linstall:
    str     r7, [r4, #8]
    str     r8, [r4, #4]
    strb    r9, [r4, #16]
    sxtb    r0, r6
    cmp     r0, #0
    str     r10, [r4, #12]
    beq     .Lreturn
    b       .Lunlock
.Lentry_failure:
    ldr     r0, [pc, #84]
    mov     r3, #0
    mov     r2, #-536870904
    mov     r1, #158
    bl      func_00178974
    nop
    nop
    b       .Lrelease
.Lrange_failure:
    ldr     r0, [pc, #52]
    mov     r3, #0
    mov     r2, #-536870909
    mov     r1, #165
    bl      func_00178974
.Lrelease:
    sxtb    r0, r6
    cmp     r0, #0
    beq     .Lreturn
.Lunlock:
    mov     r0, r5
    bl      func_0017EA90
.Lreturn:
    mov     r0, r4
    pop     {r4-r10, pc}
.size func_00184E10, . - func_00184E10

    .word   service_record_vtable_98
    .word   service_record_lock_85
    .word   ipc_service_registry_owner_71
    .word   service_diagnostic_context_98

.section .note.GNU-stack, "", %progbits
