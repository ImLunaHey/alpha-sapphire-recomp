.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_001855CC, "ax", %progbits
.balign 4
.global func_001855CC
.type func_001855CC, %function
func_001855CC:
    push    {r3-r9, lr}
    mov     r8, #0
    ldr     r1, [pc, #396]
    stmia   r0, {r1, r8}
    str     r8, [r0, #8]
    str     r8, [r0, #12]
    str     r8, [r0, #16]
    str     r8, [r0, #24]!
    add     r0, r0, #4
    bl      func_0018BD3C
    str     r8, [r0, #28]
    str     r8, [r0, #32]
    str     r8, [r0, #36]
    str     r8, [r0, #40]
    str     r8, [r0, #44]
    add     r5, r0, #24
    add     r4, r0, #28
    str     r8, [r0, #48]
    mov     r1, #1
    mov     r0, r4
    bl      func_0018D894
    ldr     r0, [r4, #8]
    ldr     r6, [pc, #320]
    mov     r1, #1
    add     r2, r0, #160
    str     r0, [r4, #16]
    str     r2, [r4, #8]
    str     r0, [r0]
    ldr     r0, [r4, #16]
    str     r0, [r0, #4]
    str     r6, [r5]
    add     r5, r4, #24
    str     r8, [r4, #28]!
    mov     r0, r4
    str     r8, [r4, #4]
    str     r8, [r4, #8]
    str     r8, [r4, #12]
    str     r8, [r4, #16]
    str     r8, [r4, #20]
    bl      func_0018D894
    ldr     r0, [r4, #8]
    mov     r1, #0
    add     r3, r4, #28
    add     r2, r0, #160
    str     r0, [r4, #16]
    str     r2, [r4, #8]
    str     r0, [r0]
    ldr     r0, [r4, #16]
    mov     r2, r1
    str     r0, [r0, #4]
    str     r6, [r5]
    stmia   r3, {r1, r2}
    add     r0, r4, #44
    str     r8, [r4, #36]
    bl      func_001787CC
    sub     r5, r0, #128
    strb    r8, [r0, #96]
    mov     r1, #0
    add     r0, r0, #104
    mov     r2, r1
    stmia   r0, {r1, r2}
    add     r4, r5, #244
    str     r8, [r5, #240]
    str     r8, [r5, #244]
    str     r8, [r5, #260]
    str     r8, [r5, #264]
    strb    r8, [r5, #268]
    strb    r0, [r5, #269]
    str     r8, [r5, #256]
    str     r8, [r5, #252]
    mov     r7, #32
    mov     r0, #12
    str     r8, [r5, #248]
    bl      func_00184990
    mov     r6, r0
    mov     r0, #4352
    bl      func_00184990
    str     r0, [r6, #8]
    ldr     r0, [r4]
    stmia   r6, {r0, r7}
    str     r6, [r4]
    ldr     r0, [r6, #8]
    add     r1, r0, #4352
    strd    r0, [r4, #8]
    add     r1, r0, #136
    str     r1, [r4, #8]
    str     r8, [r0, #8]
    str     r8, [r0, #12]
    strb    r8, [r0]
    str     r0, [r4, #16]
    str     r8, [r0, #4]
    ldr     r0, [r4, #16]
    adr     r1, .Lservice_empty_text_101
    str     r0, [r0, #8]
    ldr     r0, [r4, #16]
    str     r0, [r0, #12]
    add     r0, r5, #272
    bl      func_001862A0
    sub     r0, r0, #272
    mov     r1, #280
    strh    r8, [r1, r0]
    strb    r8, [r0, #282]
    pop     {r3-r9, pc}
.size func_001855CC, . - func_001855CC

    .word   service_aggregate_vtable_101
    .word   service_ring_vtable_101
.Lservice_empty_text_101:
    .word   0

.section .note.GNU-stack, "", %progbits
