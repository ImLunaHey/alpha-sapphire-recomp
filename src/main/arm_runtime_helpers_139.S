.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0010B994, "ax", %progbits
.balign 4
.global func_0010B994
.type func_0010B994, %function
func_0010B994:
    ldr r0, [r0, #8]
    cmp r0, #0
    moveq r0, #1
    beq .L139_0010B994_return
    ldr r1, [r0]
    ldr r1, [r1, #16]
    bx r1
.L139_0010B994_return:
    bx lr
.size func_0010B994, . - func_0010B994

.section .text.func_0011ECE4, "ax", %progbits
.balign 4
.global func_0011ECE4
.type func_0011ECE4, %function
func_0011ECE4:
    ldrb r1, [r0, #10]
    cmp r1, #0
    beq .L139_0011ECE4_return
    ldr r1, [r0, #16]
    ldr r2, [r1, #12]
    ldr r1, [r2]
    ldr r3, [r1, #16]
    mov r1, r0
    mov r0, r2
    bx r3
.L139_0011ECE4_return:
    bx lr
.size func_0011ECE4, . - func_0011ECE4

.section .text.func_0013335C, "ax", %progbits
.balign 4
.global func_0013335C
.type func_0013335C, %function
func_0013335C:
    strb r1, [r0, #34]
    cmp r1, #5
    bne .L139_0013335C_return
    ldr r2, [r0, #24]
    cmp r2, #0
    beq .L139_0013335C_return
    add r1, r0, #28
    bx r2
.L139_0013335C_return:
    bx lr
.size func_0013335C, . - func_0013335C

.section .text.func_0018F3E0, "ax", %progbits
.balign 4
.global func_0018F3E0
.type func_0018F3E0, %function
func_0018F3E0:
    cmp r0, #0
    beq .L139_0018F3E0_return
    mov r1, #0
    str r1, [r0, #412]
    str r1, [r0, #416]
.L139_0018F3E0_return:
    bx lr
.size func_0018F3E0, . - func_0018F3E0

.section .text.func_0021A9C0, "ax", %progbits
.balign 4
.global func_0021A9C0
.type func_0021A9C0, %function
func_0021A9C0:
    ldrh r1, [r0]
    ldrb r2, [r0, #2]
    rev16 r1, r1
    orr r0, r1, r2, lsl #16
    bx lr
.size func_0021A9C0, . - func_0021A9C0

.section .text.func_002A59CC, "ax", %progbits
.balign 4
.global func_002A59CC
.type func_002A59CC, %function
func_002A59CC:
    cmp r1, #0
    beq .L139_002A59CC_return
    str r1, [r0, #52]
    ldr r0, [r1, #4]
    ldr r2, [r0]
    ldr r2, [r2, #44]
    bx r2
.L139_002A59CC_return:
    bx lr
.size func_002A59CC, . - func_002A59CC

.section .text.func_002AE09C, "ax", %progbits
.balign 4
.global func_002AE09C
.type func_002AE09C, %function
func_002AE09C:
    mov r1, r0
    ldr r0, [r0, #4]
    ldr r2, [r0]
    ldr r2, [r2, #44]
    bx r2
.size func_002AE09C, . - func_002AE09C

.section .text.func_002AE0B0, "ax", %progbits
.balign 4
.global func_002AE0B0
.type func_002AE0B0, %function
func_002AE0B0:
    mov r1, r0
    ldr r0, [r0, #4]
    ldr r2, [r0]
    ldr r2, [r2, #80]
    bx r2
.size func_002AE0B0, . - func_002AE0B0

.section .text.func_003118EC, "ax", %progbits
.balign 4
.global func_003118EC
.type func_003118EC, %function
func_003118EC:
    push {r4, r5, r6, lr}
    mov r4, r1
    mov r5, r0
    add r0, r5, #8
    ldr r1, [r0]
    mov r2, #0
    cmp r1, #0
    addne r2, r0, r1
    cmp r2, #0
    beq .L139_003118EC_final
    ldr r1, [r0]
    mov r2, #0
    cmp r1, #0
    addne r1, r0, r1
    ldr r0, [r4]
    ldr r3, [r0, #12]
    mov r0, r4
    blx r3
.L139_003118EC_final:
    ldr r0, [r4]
    ldr r3, [r0, #12]
    mov r0, r4
    mov r1, r5
    pop {r4, r5, r6, lr}
    bx r3
.size func_003118EC, . - func_003118EC

.section .text.func_00313BB8, "ax", %progbits
.balign 4
.global func_00313BB8
.type func_00313BB8, %function
func_00313BB8:
    cmp r2, r3
    bxeq lr
    push {r4, r5, r6, lr}
    mov r5, r1
    mov r4, r2
    ldr r1, [r4]
    cmp r1, #0
    addne r1, r4, r1
    ldr r2, [r5]
    mov r0, r5
    ldr r2, [r2, #12]
    blx r2
    ldr r0, [r5]
    mov r1, r4
    ldr r2, [r0, #12]
    mov r0, r5
    pop {r4, r5, r6, lr}
    bx r2
.size func_00313BB8, . - func_00313BB8

.section .text.func_0033D5DC, "ax", %progbits
.balign 4
.global func_0033D5DC
.type func_0033D5DC, %function
func_0033D5DC:
    mov r1, #1
    strb r1, [r0, #106]
    ldr r1, [r0]
    ldr r1, [r1, #32]
    bx r1
.size func_0033D5DC, . - func_0033D5DC

.section .text.func_003AAF90, "ax", %progbits
.balign 4
.global func_003AAF90
.type func_003AAF90, %function
func_003AAF90:
    ldr r1, [r0, #72]
    cmp r1, #0
    mvneq r0, #2
    beq .L139_003AAF90_return
    ldr r1, [r0, #136]
    cmp r1, #0
    beq .L139_003AAF90_tail
    sub r1, r1, #1
    str r1, [r0, #136]
    mvn r0, #0
.L139_003AAF90_return:
    bx lr
.L139_003AAF90_tail:
    ldr r1, [r0]
    ldr r1, [r1, #16]
    bx r1
.size func_003AAF90, . - func_003AAF90

.section .text.func_003BB634, "ax", %progbits
.balign 4
.global func_003BB634
.type func_003BB634, %function
func_003BB634:
    push {r4, lr}
    mov r4, r0
    ldr r1, [r0]
    ldr r1, [r1, #24]
    mov r0, r4
    blx r1
    ldr r1, [r4]
    ldr r1, [r1, #28]
    mov r0, r4
    pop {r4, lr}
    bx r1
.size func_003BB634, . - func_003BB634

.section .text.func_004BCB04, "ax", %progbits
.balign 4
.global func_004BCB04
.type func_004BCB04, %function
func_004BCB04:
    push {r4, lr}
    mov r4, r0
    ldr r1, [r0]
    ldr r1, [r1, #36]
    mov r0, r4
    blx r1
    cmp r0, #0
    beq .L139_004BCB04_return
    mov r1, #0
    ldr r2, [r4]
    ldr r2, [r2, #40]
    mov r0, r4
    pop {r4, lr}
    bx r2
.L139_004BCB04_return:
    pop {r4, pc}
.size func_004BCB04, . - func_004BCB04

.section .text.func_004BEBB0, "ax", %progbits
.balign 4
.global func_004BEBB0
.type func_004BEBB0, %function
func_004BEBB0:
    ldr r2, [r0]
    ldr r2, [r2, #20]
    bx r2
.size func_004BEBB0, . - func_004BEBB0

.section .text.func_004BFE6C, "ax", %progbits
.balign 4
.global func_004BFE6C
.type func_004BFE6C, %function
func_004BFE6C:
    ldr r0, [r0, #4]
    cmp r0, #0
    beq .L139_004BFE6C_return
    ldr r2, [r0]
    ldr r2, [r2, #8]
    bx r2
.L139_004BFE6C_return:
    bx lr
.size func_004BFE6C, . - func_004BFE6C

.section .text.func_004C8814, "ax", %progbits
.balign 4
.global func_004C8814
.type func_004C8814, %function
func_004C8814:
    ldr r0, [r0, #4]
    ldr r2, [r0, #16]
    ldr r2, [r2, #16]
    ldr r3, [r0, #188]
    ldr r3, [r3, #8]
    ldr ip, [r3]
    cmp ip, r1
    bls .L139_004C8814_zero
    add r3, r3, #4
    ldr ip, [r2]
    adds r1, r3, r1, lsl #5
    beq .L139_004C8814_zero
    ldr r3, [ip, #52]
    mov r0, r2
    mov r2, #1
    bx r3
.L139_004C8814_zero:
    mov r0, #0
    bx lr
.size func_004C8814, . - func_004C8814

.section .text.func_004C8DEC, "ax", %progbits
.balign 4
.global func_004C8DEC
.type func_004C8DEC, %function
func_004C8DEC:
    ldr r3, [r1, #12]
    ldr r1, [r1, #20]
    add r2, r3, r2, lsl #6
    ldr r3, [r1]
    ldr r3, [r3, #16]
    bx r3
.size func_004C8DEC, . - func_004C8DEC
