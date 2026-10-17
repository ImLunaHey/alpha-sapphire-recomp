.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_001849DC, "ax", %progbits
.balign 4
.global func_001849DC
.type func_001849DC, %function
func_001849DC:
    push    {r4, r5, lr}
    sub     sp, sp, #44
    mov     r4, r0
    mov     r1, #0
    str     r1, [r0, #4]!
    mov     r2, #5
    str     r1, [r0, #8]
    mov     r3, #64
    add     r0, r0, #4
    mov     r12, #1
    str     r12, [r0, #4]
    ldr     r12, [pc, #148]
    strb    r1, [r0, #8]
    str     r1, [r0, #12]
    str     r12, [r0]
    str     r1, [r0, #16]
    str     r1, [r0, #20]
    ldr     r1, [pc, #128]
    mov     r0, #1
    str     r1, [r4]
    strd    r2, r3, [r4, #32]
    strb    r0, [r4, #554]
    mov     r0, #48
    bl      func_00184990
    cmp     r0, #0
    movne   r1, #536870912
    .inst   0x1bfffffe
    .reloc  . - 4, R_ARM_CALL, func_0018B220
    str     r0, [r4, #556]
    mov     r1, #67
    strb    r1, [sp]
    mov     r2, #68
    strb    r2, [sp, #1]
    mov     r3, #38
    mov     r12, #77
    mov     r5, #76
    strb    r3, [sp, #2]
    add     r0, sp, #8
    mov     r2, #5
    mov     r1, sp
    strb    r12, [sp, #3]
    strb    r5, [sp, #4]
    bl      func_00185E38
    add     r1, sp, #8
    mov     r0, r4
    bl      func_0018B348
    add     r0, sp, #8
    bl      func_00185E9C
    add     sp, sp, #44
    mov     r0, r4
    pop     {r4, r5, pc}
.size func_001849DC, . - func_001849DC

    .word   service_object_descriptor_97
    .word   service_object_vtable_97

.section .note.GNU-stack, "", %progbits
