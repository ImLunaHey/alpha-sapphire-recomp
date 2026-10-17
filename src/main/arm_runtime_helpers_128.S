.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0030F0A8, "ax", %progbits
.balign 4
.global func_0030F0A8
.type func_0030F0A8, %function
func_0030F0A8:
    push {r4, r5, r6, r7, r8, r9, sl}
    mov r2, r0
    mov r5, #0
    mov r6, #2
    ldr r3, [r2]
    ldr r2, [r2]
    mov r0, #1
    add r3, r3, #16
    ldr ip, [r2, #40]!
    cmp ip, #0
    addne r2, r2, ip
    ldr ip, [r3]
    moveq r2, r5
    bics r4, r6, ip
    bne .L128_88
    ldr r7, [r2, #12]
    add r4, r2, #12
    cmp r7, #0
    addne r4, r4, r7
    moveq r4, r5
    cmp r4, #0
    beq .L128_80
    cmp r7, #0
    add r4, r2, #12
    moveq r4, r5
    addne r4, r4, r7
    ldr r7, [r4, #8]!
    cmp r7, #0
    addne r4, r4, r7
    moveq r4, r5
    cmp r4, #0
    bne .L128_88
.L128_80:
    bic ip, ip, #2
    mov r0, #0
.L128_88:
    mov r7, #4
    bics r4, r7, ip
    bne .L128_E0
    ldr r8, [r2, #16]
    add r4, r2, #16
    cmp r8, #0
    addne r4, r4, r8
    moveq r4, r5
    cmp r4, #0
    beq .L128_D8
    cmp r8, #0
    add r4, r2, #16
    moveq r4, r5
    addne r4, r4, r8
    ldr r8, [r4, #8]!
    cmp r8, #0
    addne r4, r4, r8
    moveq r4, r5
    cmp r4, #0
    bne .L128_E0
.L128_D8:
    bic ip, ip, #4
    mov r0, #0
.L128_E0:
    ldr r4, [r3, #8]
    tst r4, #255
    beq .L128_138
    ldr r8, [r2, #20]
    add r4, r2, #20
    cmp r8, #0
    addne r4, r4, r8
    moveq r4, r5
    cmp r4, #0
    beq .L128_130
    cmp r8, #0
    add r4, r2, #20
    moveq r4, r5
    addne r4, r4, r8
    ldr r8, [r4, #8]!
    cmp r8, #0
    addne r4, r4, r8
    moveq r4, r5
    cmp r4, #0
    bne .L128_138
.L128_130:
    mov r0, #0
    str r5, [r3, #8]
.L128_138:
    mov r4, #32
    bics r4, r4, ip
    bne .L128_254
    ldr r4, [r3, #4]
    ldr r9, .L128_26C
    mov r8, #0
    and r4, r4, #255
    ldrb r9, [r9, r4]
    mov r4, #1
    bics r4, r4, r9
    bne .L128_1A8
    ldr r4, [r2]
    cmp r4, #0
    addne r4, r4, r2
    moveq r4, r5
    cmp r4, #0
    beq .L128_1A4
    ldr r4, [r2]
    cmp r4, #0
    moveq r4, r5
    addne r4, r4, r2
    ldr sl, [r4, #8]!
    cmp sl, #0
    addne r4, r4, sl
    moveq r4, r5
    cmp r4, #0
    bne .L128_1A8
.L128_1A4:
    mov r8, #1
.L128_1A8:
    bics r4, r6, r9
    bne .L128_1F8
    ldr r6, [r2, #4]
    add r4, r2, #4
    cmp r6, #0
    addne r4, r4, r6
    moveq r4, r5
    cmp r4, #0
    beq .L128_1F4
    cmp r6, #0
    add r4, r2, #4
    moveq r4, r5
    addne r4, r4, r6
    ldr r6, [r4, #8]!
    cmp r6, #0
    addne r4, r4, r6
    moveq r4, r5
    cmp r4, #0
    bne .L128_1F8
.L128_1F4:
    mov r8, #1
.L128_1F8:
    bics r4, r7, r9
    bne .L128_244
    ldr r6, [r2, #8]
    add r4, r2, #8
    cmp r6, #0
    addne r4, r4, r6
    moveq r4, r5
    cmp r4, #0
    beq .L128_24C
    cmp r6, #0
    add r2, r2, #8
    moveq r2, r5
    addne r2, r2, r6
    ldr r4, [r2, #8]!
    cmp r4, #0
    addne r2, r2, r4
    moveq r2, r5
    cmp r2, #0
    beq .L128_24C
.L128_244:
    cmp r8, #0
    beq .L128_254
.L128_24C:
    bic ip, ip, #32
    mov r0, #0
.L128_254:
    ldr r2, [r3]
    cmp r2, ip
    strne ip, [r3]
    strne r5, [r1, #700]
    pop {r4, r5, r6, r7, r8, r9, sl}
    bx lr
.L128_body_end:
.L128_26C:
    .word runtime_literal_128_1
.size func_0030F0A8, .L128_body_end - func_0030F0A8
