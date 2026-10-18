.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_0000E730, "ax", %progbits
.balign 4
.global func_0000E730
.type func_0000E730, %function
ASM_FUNC(func_0000E730)
func_0000E730:
    push {r4, r5, r6}
    add r3, r0, #4
    add r2, r0, #4
    str r3, [r0]
    str r2, [r0, #4]
    str r2, [r0, #8]
    mov r12, #0
    str r2, [r0, #12]
    strb r12, [r0, #16]
    str r3, [r0, #20]
    str r1, [r0, #32]
    str r3, [r0, #24]
    str r12, [r0, #28]
    pop {r4, r5, r6}
    bx lr
.size func_0000E730, . - func_0000E730

.section .text.func_00012360, "ax", %progbits
.balign 4
.global func_00012360
.type func_00012360, %function
ASM_FUNC(func_00012360)
func_00012360:
    push {r4, r5, r6, lr}
    ldr r5, [pc, #48]
    ldr r1, [r5, #4]
    cmp r1, #0
    cmpne r0, #0
    beq .L12360_return
    mov r4, r0
    ldr r0, [r0, #16]
    cmp r0, #0
    blxne r1
    ldr r1, [r5, #4]
    mov r0, r4
    pop {r4, r5, r6, lr}
    bx r1
.L12360_return:
    pop {r4, r5, r6, pc}
.size func_00012360, . - func_00012360

.section .text.func_000123A0, "ax", %progbits
.balign 4
.global func_000123A0
.type func_000123A0, %function
ASM_FUNC(func_000123A0)
func_000123A0:
    push {r4, r5, r6, lr}
    ldr r5, [pc, #48]
    ldr r1, [r5, #4]
    cmp r1, #0
    cmpne r0, #0
    beq .L123a0_return
    mov r4, r0
    ldr r0, [r0, #4]
    cmp r0, #0
    blxne r1
    ldr r1, [r5, #4]
    mov r0, r4
    pop {r4, r5, r6, lr}
    bx r1
.L123a0_return:
    pop {r4, r5, r6, pc}
.size func_000123A0, . - func_000123A0

.section .text.func_0001C880, "ax", %progbits
.balign 4
.global func_0001C880
.type func_0001C880, %function
ASM_FUNC(func_0001C880)
func_0001C880:
    push {r4, r5, lr}
    mov r4, r0
    mov r5, r1
    ldr r1, [pc, #40]
    sub sp, sp, #12
    mov r0, #0
    bl . - 0x1C1D0
    add r2, sp, #8
    add r1, sp, #4
    mov r0, sp
    bl . - 0xF474
    ldr r0, [pc, #12]
    strd r4, [r0]
    add sp, sp, #12
    pop {r4, r5, pc}
.size func_0001C880, . - func_0001C880

.section .text.func_0000F060, "ax", %progbits
.balign 4
.global func_0000F060
.type func_0000F060, %function
ASM_FUNC(func_0000F060)
func_0000F060:
    push {r4, r5, r6, lr}
    mov r5, r2
    ldr r0, [r1]
    mov r4, r1
    mov r1, r5
    ldr r2, [r0, #24]
    mov r0, r4
    blx r2
    ldr r0, [r4]
    ldr r1, [r0, #16]
    mov r0, r4
    blx r1
    cmp r0, #0
    ldrne r0, [r5, #20]
    strne r0, [r4, #20]
    pop {r4, r5, r6, pc}
.size func_0000F060, . - func_0000F060

.section .text.func_0001251C, "ax", %progbits
.balign 4
.global func_0001251C
.type func_0001251C, %function
ASM_FUNC(func_0001251C)
func_0001251C:
    cmp r0, #0
    moveq r0, #1
    bxeq lr
    push {r4, lr}
    ldr r0, [r0, #4]
    bl . - 0x41F0
    cmp r0, #0
    ldrne r0, [r0, #16]
    cmpne r0, #0
    moveq r0, #14
    beq .L1251c_return
    bl . - 0x42D0
    cmp r0, #0
    moveq r0, #20
    movne r0, #0
.L1251c_return:
    pop {r4, pc}
.size func_0001251C, . - func_0001251C

.section .text.func_0001CE20, "ax", %progbits
.balign 4
.global func_0001CE20
.type func_0001CE20, %function
ASM_FUNC(func_0001CE20)
func_0001CE20:
    cmp r0, #0
    moveq r0, #1
    bxeq lr
    push {r4, lr}
    mov r4, r0
    ldr r0, [r0, #4]
    mov r3, #0
    bl . - 0x224C
    cmp r0, #0
    moveq r0, #19
    beq .L1ce20_return
    ldr r0, [r4, #4]
    bl . - 0x3880
    cmp r0, #0
    moveq r0, #9
    movne r0, #0
.L1ce20_return:
    pop {r4, pc}
.size func_0001CE20, . - func_0001CE20

.section .text.func_0000E610, "ax", %progbits
.balign 4
.global func_0000E610
.type func_0000E610, %function
ASM_FUNC(func_0000E610)
func_0000E610:
    push {r4, r5, r6, lr}
    mov r5, r0
    add r0, r0, #4
    cmp r1, r0
    mov r4, r1
    beq .Le610_return
    ldr r1, [r4]
    mov r0, r5
    bl . - 0x20
    ldr r1, [r4, #4]
    mov r0, r5
    bl . - 0x2C
    ldr r2, [r5, #32]
    mov r1, r4
    mov r0, r5
    pop {r4, r5, r6, lr}
    bx r2
.Le610_return:
    pop {r4, r5, r6, pc}
.size func_0000E610, . - func_0000E610

.section .text.func_0001230C, "ax", %progbits
.balign 4
.global func_0001230C
.type func_0001230C, %function
ASM_FUNC(func_0001230C)
func_0001230C:
    push {r4, r5, r6, lr}
    ldr r5, [pc, #60]
    ldr r1, [r5, #4]
    cmp r1, #0
    cmpne r0, #0
    beq .L1230c_return
    mov r4, r0
    ldr r0, [r0, #4]
    cmp r0, #0
    blxne r1
    ldr r1, [r5, #4]
    ldr r0, [r4]
    blx r1
    ldr r1, [r5, #4]
    mov r0, r4
    pop {r4, r5, r6, lr}
    bx r1
.L1230c_return:
    pop {r4, r5, r6, pc}
.size func_0001230C, . - func_0001230C

.section .text.func_0000E6B8, "ax", %progbits
.balign 4
.global func_0000E6B8
.type func_0000E6B8, %function
ASM_FUNC(func_0000E6B8)
func_0000E6B8:
    ldr r2, [r0]
    ldr r1, [r2]
    ldrb r3, [r2, #12]
    ldrb r12, [r1, #12]
    cmp r12, r3
    bne .Le6b8_return
    ldr r3, [r1, #4]
    vldr s0, [r2, #8]
    str r3, [r2]
    ldr r2, [r0]
    str r2, [r1, #4]
    str r1, [r0]
    ldr r2, [r1, #4]
    vstr s0, [r1, #8]
    ldr r0, [r0]
    str r0, [r2, #8]
    ldr r0, [r2]
    str r2, [r0, #8]
.Le6b8_return:
    bx lr
.size func_0000E6B8, . - func_0000E6B8

.section .text.func_0001C73C, "ax", %progbits
.balign 4
.global func_0001C73C
.type func_0001C73C, %function
ASM_FUNC(func_0001C73C)
func_0001C73C:
    push {r4, lr}
    mov r4, r0
    ldr r0, [pc, #60]
    ldr r1, [r0]
    cmp r1, #0
    ldrne r0, [r0, #4]
    cmpne r0, #0
    moveq r0, #0
    beq .L1c73c_return
    mov r0, #8
    blx r1
    cmp r0, #0
    beq .L1c73c_return
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    str r0, [r4]
    mov r0, #1
.L1c73c_return:
    pop {r4, pc}
.size func_0001C73C, . - func_0001C73C
