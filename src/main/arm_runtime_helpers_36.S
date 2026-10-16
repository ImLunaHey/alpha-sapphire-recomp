.syntax unified
.arch armv6k
.arm

.section .text.func_002F39D4, "ax", %progbits
.global func_002F39D4
.type func_002F39D4, %function
func_002F39D4:
    lsl r2, r1, #1
    ldr r1, [r0, #4]
    mov r3, #0
    add r2, r2, #16
    cmp r1, #32
    rsbcc r3, r1, #32
    add r3, r3, #31
    bic r3, r3, #31
    add r3, r3, r2
    add r3, r3, #31
    bic r3, r3, #31
    add r3, r3, r2
    mov r2, #32
    str r2, [r0, #4]
    ldr r12, [r0, #8]
    cmp r12, #32
    movcs r2, r12
    str r2, [r0, #8]
    ldr r2, [r0]
    str r1, [r0, #4]
    add r2, r2, #31
    bic r2, r2, #31
    add r2, r2, r3
    str r2, [r0]
    ldr r2, [r0, #8]
    cmp r2, r1
    movcs r1, r2
    str r1, [r0, #8]
    bx lr
.size func_002F39D4, . - func_002F39D4

.section .text.func_002F3ED8, "ax", %progbits
.global func_002F3ED8
.type func_002F3ED8, %function
func_002F3ED8:
    mov r3, #1
    bics r3, r3, r1
    mvn r2, #0
    mov r3, #2
    streq r2, [r0]
    bics r3, r3, r1
    mov r3, #4
    streq r2, [r0, #4]
    bics r3, r3, r1
    mov r3, #8
    streq r2, [r0, #8]
    bics r3, r3, r1
    mov r3, #16
    streq r2, [r0, #12]
    bics r3, r3, r1
    mov r3, #32
    streq r2, [r0, #16]
    bics r3, r3, r1
    mov r3, #128
    streq r2, [r0, #20]
    bics r3, r3, r1
    mov r3, #256
    streq r2, [r0, #24]
    bics r3, r3, r1
    mov r3, #512
    streq r2, [r0, #28]
    bics r3, r3, r1
    mov r3, #2048
    streq r2, [r0, #32]
    bics r3, r3, r1
    mov r3, #1024
    streq r2, [r0, #36]
    bics r1, r3, r1
    streq r2, [r0, #40]
    bx lr
.size func_002F3ED8, . - func_002F3ED8

.section .text.func_002F9230, "ax", %progbits
.global func_002F9230
.type func_002F9230, %function
func_002F9230:
    str r1, [r0, #8]
    ldr r0, [r1, #12]
    str r0, [r1, #16]
    ldr r0, [r1, #28]
    str r0, [r1, #32]
    ldr r0, [r1, #44]
    str r0, [r1, #48]
    ldr r0, [r1, #60]
    str r0, [r1, #64]
    ldr r0, [r1, #108]
    str r0, [r1, #112]
    ldr r0, [r1, #124]
    str r0, [r1, #128]
    ldr r0, [r1, #140]
    str r0, [r1, #144]
    ldr r0, [r1, #156]
    str r0, [r1, #160]
    ldr r0, [r1, #172]
    str r0, [r1, #176]
    ldr r0, [r1, #76]
    str r0, [r1, #80]
    ldr r0, [r1, #92]
    str r0, [r1, #96]
    ldr r0, [r1, #188]
    str r0, [r1, #192]
    ldr r0, [r1, #204]
    str r0, [r1, #208]
    ldr r0, [r1, #220]
    str r0, [r1, #224]
    ldr r0, [r1, #236]
    str r0, [r1, #240]
    bx lr
.size func_002F9230, . - func_002F9230

.section .text.func_002FF24C, "ax", %progbits
.global func_002FF24C
.type func_002FF24C, %function
func_002FF24C:
    push {r4, r5, lr}
    subs r2, r0, #10
    lsr lr, r0, #2
    sbcs r3, r1, #0
    orr lr, lr, r1, lsl #30
    subs r0, r0, lr
    sbc r1, r1, r1, lsr #2
    lsr lr, r0, #4
    orr lr, lr, r1, lsl #28
    adds r0, r0, lr
    adc r1, r1, r1, lsr #4
    lsr lr, r0, #8
    orr lr, lr, r1, lsl #24
    adds r0, r0, lr
    adc r1, r1, r1, lsr #8
    lsr lr, r0, #16
    orr lr, lr, r1, lsl #16
    adds r0, r0, lr
    adc r1, r1, r1, lsr #16
    adds r0, r0, r1
    adc r1, r1, #0
    lsr r0, r0, #3
    orr r0, r0, r1, lsl #29
    lsr r1, r1, #3
    adds r5, r0, r0, lsl #2
    lsl r4, r1, #2
    orr r4, r4, r0, lsr #30
    adc r4, r4, r1
    adds r5, r5, r5
    adc r4, r4, r4
    subs r2, r2, r5
    sbcs r3, r3, r4
    mov r3, #0
    addmi r2, r2, #10
    popmi {r4, r5, pc}
    adds r0, r0, #1
    adc r1, r1, #0
    pop {r4, r5, pc}
.size func_002FF24C, . - func_002FF24C

.section .text.func_0030F584, "ax", %progbits
.global func_0030F584
.type func_0030F584, %function
func_0030F584:
    push {r4}
    ldr r1, [r0]
    mov r12, #0
    mov r3, r12
    ldr r0, [r0]
    ldr r2, [r1, #4]!
    cmp r2, #0
    addne r2, r2, r1
    moveq r2, r3
    ldr r0, [r0, #8]
    ldr r4, [r2, #8]
    add r1, r2, #8
    and r0, r0, #255
    cmp r4, #0
    addne r1, r1, r4
    moveq r1, r3
    cmp r1, #0
    cmpne r0, #1
    cmpne r0, #0
    beq 1f
    ldr r0, [r1]
    cmp r0, #0x20000004
    bne 2f
    ldr r0, [r1, #28]!
    cmp r0, #0
    addne r3, r0, r1
    mov r1, r3
2:
    ldr r0, [r1, #40]
    sub r12, r0, #1
1:
    add r0, r2, #16
    lsl r2, r12, #28
    ldr r1, [r0, #24]
    bic r1, r1, #0xf0000
    orr r1, r1, r2, lsr #12
    str r1, [r0, #24]
    pop {r4}
    bx lr
.size func_0030F584, . - func_0030F584

.section .note.GNU-stack, "", %progbits
