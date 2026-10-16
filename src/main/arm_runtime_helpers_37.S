.syntax unified
.arch armv6k
.arm

.section .text.func_00312F30, "ax", %progbits
.global func_00312F30
.type func_00312F30, %function
func_00312F30:
    add r2, r1, #368
    ldm r2, {r2, r3}
    cmp r2, r3
    strdne r2, [r0]
    bne 1f
    ldr r1, [r1, #8]
    add r2, r1, #184
    ldr r3, [r1, #184]
    ldr r1, [r1, #180]
    cmp r3, #0
    addne r2, r2, r3
    moveq r2, #0
    add r1, r2, r1, lsl #2
    str r2, [r0]
    str r1, [r0, #4]
1:
    bx lr
.size func_00312F30, . - func_00312F30

.section .text.func_00312F70, "ax", %progbits
.global func_00312F70
.type func_00312F70, %function
func_00312F70:
    ldrsh r3, [r1, #38]
    cmp r3, #0
    bge 2f
    ldrb r0, [r1, #36]
    cmp r0, #0
    beq 1f
3:
    mov r0, #1
1:
    bx lr
2:
    add r2, r0, #380
    ldm r2, {r2, r12}
    cmp r2, r12
    addne r0, r2, r3, lsl #3
    bne 4f
    ldr r2, [r0, #8]
    mov r0, #0
    ldr r12, [r2, #208]!
    cmp r12, #0
    addne r2, r2, r12
    moveq r2, r0
    cmp r2, #0
    moveq r0, #0
    beq 4f
    add r2, r2, r3, lsl #4
    ldr r3, [r2, #40]!
    cmp r3, #0
    addne r0, r3, r2
4:
    ldrb r0, [r0, #4]
    cmp r0, #0
    ldrbne r0, [r1, #36]
    cmpne r0, #0
    moveq r0, #0
    bne 3b
    bx lr
.size func_00312F70, . - func_00312F70

.section .text.func_003158B4, "ax", %progbits
.global func_003158B4
.type func_003158B4, %function
func_003158B4:
    mov r2, #1
    strb r2, [r0]
    mov r3, #4
    strb r2, [r0, #1]
    add r12, r0, #8
    str r3, [r0, #4]
    mov r1, #8
    stm r12, {r1, r2}
    mov r3, #0
    str r3, [r0, #16]
    strb r2, [r0, #20]
    str r3, [r0, #24]
    strb r2, [r0, #28]
    bx lr
.size func_003158B4, . - func_003158B4

.section .text.func_0031C05C, "ax", %progbits
.global func_0031C05C
.type func_0031C05C, %function
func_0031C05C:
    push {r4}
    ldr r12, [r1, #16]!
    ldr r4, [r0]
    ldr r3, [r1, #8]
    ldr r1, [r0, #4]
    cmp r2, #0
    add r4, r4, r1
    sub r1, r1, #1
    sub r4, r4, #1
    bic r1, r4, r1
    add r3, r1, r3, lsl #2
    lsl r1, r12, #2
    ldr r12, [r0, #4]
    add r3, r3, r12
    sub r12, r12, #1
    sub r3, r3, #1
    bic r3, r3, r12
    ldr r12, [r0, #4]
    add r3, r3, r1
    add r3, r3, r12
    sub r12, r12, #1
    sub r3, r3, #1
    bic r3, r3, r12
    ldr r12, [r0, #4]
    add r3, r3, r1
    add r3, r3, r12
    sub r12, r12, #1
    sub r3, r3, #1
    bic r3, r3, r12
    add r3, r3, r1
    str r3, [r0]
    beq 1f
    ldr r2, [r0, #4]
    add r3, r3, r2
    sub r2, r2, #1
    sub r3, r3, #1
    bic r2, r3, r2
    add r1, r1, r2
    str r1, [r0]
1:
    pop {r4}
    bx lr
.size func_0031C05C, . - func_0031C05C

.section .text.func_0031D8D0, "ax", %progbits
.global func_0031D8D0
.type func_0031D8D0, %function
func_0031D8D0:
    push {r4, r5}
    ldrb r1, [r0, #10]
    mov r2, #0
    cmp r1, #0
    ldrh r1, [r0, #2]
    beq 1f
    ldrh r2, [r0, #6]
    mov r3, #208
    add r2, r2, #15
    bic r2, r2, #15
    mla r2, r3, r1, r2
    lsl r2, r2, #1
    add r2, r2, r1, lsl #2
    lsl r2, r2, #1
    add r2, r2, r1, lsl #8
    add r2, r2, #100
1:
    ldrh r12, [r0]
    ldrh r4, [r0, #4]
    mov r3, #108
    add r12, r12, #1
    ldrb r0, [r0, #8]
    mul r12, r12, r3
    rsb r5, r1, r1, lsl #4
    add r1, r5, r1, lsl #6
    add r3, r4, r4, lsl #1
    add r3, r3, r4, lsl #6
    cmp r0, #0
    add r1, r12, r1, lsl #3
    add r0, r1, r3, lsl #3
    add r0, r0, r2
    pop {r4, r5}
    addne r0, r0, #464
    bx lr
.size func_0031D8D0, . - func_0031D8D0

.section .note.GNU-stack, "", %progbits
