.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00185C94, "ax", %progbits
.balign 4
.global func_00185C94
.type func_00185C94, %function
func_00185C94:
    push    {r4-r8, lr}
    sub     sp, sp, #48
    mov     r8, #0
    ldr     r1, .Lowner_vtable
    mov     r5, #1
    str     r1, [r0], #4
    mov     r6, r0
    str     r8, [sp, #8]
    mov     r0, #12
    str     r8, [sp, #12]
    str     r8, [sp, #16]
    str     r8, [sp, #20]
    str     r8, [sp, #24]
    str     r8, [sp, #28]
    bl      func_00184990
    mov     r4, r0
    mov     r0, #24
    bl      func_00184990
    str     r0, [r4, #8]
    ldr     r0, [sp, #8]
    add     r7, sp, #8
    stm     r4, {r0, r5}
    str     r4, [sp, #8]
    ldr     r0, [r4, #8]
    str     r0, [sp, #16]
    ldr     r1, [sp, #16]
    add     r0, r0, #24
    str     r0, [sp, #20]
    str     r0, [sp, #16]
    str     r1, [sp, #24]
    str     r1, [r1]
    ldr     r0, [sp, #24]
    str     r0, [r0, #4]
    mov     r0, r6
    bl      func_0017ECB0
    ldr     r1, .Ladapter_vtable
    str     r1, [r0], #12
    mov     r1, r7
    bl      func_0018E1E0
    mov     r1, #1
    add     r0, r0, #24
    bl      func_0018B220
    ldr     r2, .Lendpoint_vtable
    mov     r1, #2
    str     r2, [r0]
    strb    r1, [r0, #44]
    str     r8, [r0, #48]
    str     r8, [r0, #64]
    str     r8, [r0, #68]
    strb    r8, [r0, #72]
    strb    r0, [r0, #73]
    str     r8, [r0, #60]
    str     r8, [r0, #56]
    add     r4, r0, #48
    str     r8, [r0, #52]
    mov     r6, #32
    mov     r0, #12
    bl      func_00184990
    mov     r5, r0
    mov     r0, #1408
    bl      func_00184990
    str     r0, [r5, #8]
    ldr     r0, [r4]
    add     r1, r4, #8
    stm     r5, {r0, r6}
    str     r5, [r4]
    ldr     r0, [r5, #8]
    add     r2, r0, #1408
    stm     r1, {r0, r2}
    ldr     r0, [r4, #8]
    add     r2, r0, #44
    str     r2, [r4, #8]
    str     r8, [r0, #8]
    str     r8, [r0, #12]
    strb    r8, [r0]
    str     r0, [r4, #16]
    str     r8, [r0, #4]
    ldr     r0, [r4, #16]
    str     r0, [r0, #8]
    ldr     r0, [r4, #16]
    sub     r4, r4, #84
    str     r0, [r0, #12]
    ldr     r0, .Lruntime_context
    ldr     r1, [r0, #12]
    add     r0, sp, #32
    bl      func_0017E30C
    lsrs    r1, r0, #31
    blne    func_001603A0
    ldr     r0, [sp, #32]
    add     r1, sp, #40
    str     r0, [sp, #40]
    add     r0, r4, #84
    bl      func_0018D348
    mov     r1, r7
    bl      func_0018D6D4
    sub     r4, r4, #4
    add     r0, sp, #8
    bl      func_0018E370
    add     sp, sp, #48
    mov     r0, r4
    pop     {r4-r8, pc}
.size func_00185C94, . - func_00185C94

.Lowner_vtable:
    .word   service_owner_vtable_105
.Ladapter_vtable:
    .word   service_adapter_vtable_105
.Lendpoint_vtable:
    .word   service_runtime_endpoint_vtable_85
.Lruntime_context:
    .word   service_runtime_context_105

.section .note.GNU-stack, "", %progbits
