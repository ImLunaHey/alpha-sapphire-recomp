.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00185AEC, "ax", %progbits
.balign 4
.global func_00185AEC
.type func_00185AEC, %function
func_00185AEC:
    push    {r4-r10, lr}
    mov     r4, r0
    mov     r8, r1
    mov     r9, #0
    ldr     r7, [r0, #48]
    ldr     r0, [r0, #36]
    cmp     r0, #0
    ldrne   r1, [r0]
    strne   r1, [r4, #36]
    bne     .Lrecord_ready
    ldrd    r0, [r4, #40]
    cmp     r0, r1
    bne     .Lreserve_record
    ldr     r0, [r4, #32]
    cmp     r0, #0
    moveq   r5, #32
    beq     .Lallocate_storage
    ldr     r0, [r0, #4]
    add     r1, r0, r0, lsr #1
    add     r5, r1, r0, lsr #3
    add     r0, r0, #32
    cmp     r0, r5
    movhi   r5, r0
.Lallocate_storage:
    mov     r0, #12
    bl      func_00184990
    mov     r6, r0
    add     r0, r5, r5, lsl #1
    lsl     r0, r0, #2
    bl      func_00184990
    str     r0, [r6, #8]
    ldr     r0, [r4, #32]
    add     r1, r5, r5, lsl #1
    stm     r6, {r0, r5}
    str     r6, [r4, #32]
    ldr     r0, [r6, #8]
    add     r1, r0, r1, lsl #2
    strd    r0, [r4, #40]
.Lreserve_record:
    add     r1, r0, #12
    str     r1, [r4, #40]
.Lrecord_ready:
    adds    r1, r0, #8
    strne   r8, [r1]
    str     r7, [r0]
    ldr     r1, [r7, #4]
    str     r1, [r0, #4]
    ldr     r1, [r7, #4]
    str     r0, [r1]
    str     r0, [r7, #4]
    ldr     r0, [r4, #52]
    add     r0, r0, #1
    str     r0, [r4, #52]
    ldr     r0, [r8, #28]
    cmp     r0, #0
    strne   r9, [r8, #28]
    str     r4, [r8, #28]
    ldr     r0, [r4]
    ldr     r1, [r0, #56]
    mov     r0, r4
    blx     r1
    mov     r0, #1
    pop     {r4-r10, pc}
.size func_00185AEC, . - func_00185AEC

.section .note.GNU-stack, "", %progbits
