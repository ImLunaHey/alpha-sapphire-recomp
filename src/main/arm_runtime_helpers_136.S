.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0056DB94, "ax", %progbits
.balign 4
.global func_0056DB94
.type func_0056DB94, %function
func_0056DB94:
    push {r4, lr}
    mov r4, r0
    ldr r0, [r0, #60]
    cmp r0, #0
    beq .L136_func_0056DB94_32
    ldr r1, [r0]
    ldr r1, [r1, #36]
    blx r1
.L136_func_0056DB94_32:
    vmov s1, r0
    vldr s0, [r4, #84]
    vldr s2, [r4, #40]
    vcvt.f32.s32 s1, s1
    vmla.f32 s0, s1, s2
    pop {r4, pc}
.L136_func_0056DB94_body_end:
.size func_0056DB94, .L136_func_0056DB94_body_end - func_0056DB94

.section .text.func_0056E450, "ax", %progbits
.balign 4
.global func_0056E450
.type func_0056E450, %function
func_0056E450:
    push {r4, r5, r6, r7, r8, lr}
    mov r7, r0
    ldr r6, [r0, #16]
    ldr r4, [r6]
    cmp r4, r6
    addne r5, r1, #4
    beq .L136_func_0056E450_156
.L136_func_0056E450_28:
    add r0, r4, #8
    add r0, r0, #4
    ldr r2, [r5, #4]
    ldr r1, [r0, #4]
    mov r8, r4
    ldr r4, [r4]
    cmp r1, r2
    bne .L136_func_0056E450_148
    ldrh r0, [r0, #2]
    ldrh r1, [r5, #2]
    cmp r0, r1
    bne .L136_func_0056E450_148
    ldr r0, [r7, #16]
    cmp r8, r0
    beq .L136_func_0056E450_148
    ldrd r2, [r8]
    add r1, r8, #8
    str r2, [r3]
    ldm r8, {r0, r2}
    str r2, [r0, #4]
    ldr r0, [r7, #20]
    sub r0, r0, #1
    str r0, [r7, #20]
    ldr r0, [r8, #8]
    ldr r2, [r0]
    mov r0, r1
    blx r2
    ldr r0, [r7, #4]
    str r0, [r8]
    str r8, [r7, #4]
.L136_func_0056E450_148:
    cmp r4, r6
    bne .L136_func_0056E450_28
.L136_func_0056E450_156:
    pop {r4, r5, r6, r7, r8, pc}
.L136_func_0056E450_body_end:
.size func_0056E450, .L136_func_0056E450_body_end - func_0056E450
