.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_0000BF38, "ax", %progbits
.balign 4
.global func_0000BF38
.type func_0000BF38, %function
ASM_FUNC(func_0000BF38)
func_0000BF38:
    b . + 0xA0C
.size func_0000BF38, . - func_0000BF38

.section .text.func_0001C78C, "ax", %progbits
.balign 4
.global func_0001C78C
.type func_0001C78C, %function
ASM_FUNC(func_0001C78C)
func_0001C78C:
    ldr r0, [pc, #12]
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    bx lr
.size func_0001C78C, . - func_0001C78C

.section .text.func_0001CBF8, "ax", %progbits
.balign 4
.global func_0001CBF8
.type func_0001CBF8, %function
ASM_FUNC(func_0001CBF8)
func_0001CBF8:
    ldr r0, [pc, #12]
    mov r1, #0
    str r1, [r0, #4]
    str r1, [r0, #8]
    bx lr
.size func_0001CBF8, . - func_0001CBF8

.section .text.func_0000D45C, "ax", %progbits
.balign 4
.global func_0000D45C
.type func_0000D45C, %function
ASM_FUNC(func_0000D45C)
func_0000D45C:
    ldrb r2, [r1]
    str r2, [r0, #4]
    ldrh r1, [r1, #2]
    sxth r1, r1
    str r1, [r0]
    bx lr
.size func_0000D45C, . - func_0000D45C

.section .text.func_0001C838, "ax", %progbits
.balign 4
.global func_0001C838
.type func_0001C838, %function
ASM_FUNC(func_0001C838)
func_0001C838:
    push {r4, lr}
    mov r0, #0
    ldr r0, [pc, #12]
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    pop {r4, pc}
.size func_0001C838, . - func_0001C838

.section .text.func_0000E258, "ax", %progbits
.balign 4
.global func_0000E258
.type func_0000E258, %function
ASM_FUNC(func_0000E258)
func_0000E258:
    ldr r1, [r0, #60]
    ldr r2, [r0, #52]
    ldr r0, [r0, #48]
    cmp r1, r2
    subhs r1, r1, r2
    add r0, r0, r1, lsl #4
    ldr r0, [r0, #4]
    bx lr
.size func_0000E258, . - func_0000E258

.section .text.func_0001C408, "ax", %progbits
.balign 4
.global func_0001C408
.type func_0001C408, %function
ASM_FUNC(func_0001C408)
func_0001C408:
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r5, r1
    ldr r1, [pc, #16]
    mov r0, #0
    bl . - 0x1BD54
    ldr r0, [pc, #8]
    strd r4, [r0]
    pop {r4, r5, r6, pc}
.size func_0001C408, . - func_0001C408

.section .text.func_0001C7A4, "ax", %progbits
.balign 4
.global func_0001C7A4
.type func_0001C7A4, %function
ASM_FUNC(func_0001C7A4)
func_0001C7A4:
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r5, r1
    ldr r1, [pc, #16]
    mov r0, #0
    bl . - 0x1C0F0
    ldr r0, [pc, #8]
    strd r4, [r0]
    pop {r4, r5, r6, pc}
.size func_0001C7A4, . - func_0001C7A4

.section .text.func_0001CD0C, "ax", %progbits
.balign 4
.global func_0001CD0C
.type func_0001CD0C, %function
ASM_FUNC(func_0001CD0C)
func_0001CD0C:
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r5, r1
    ldr r1, [pc, #16]
    mov r0, #0
    bl . - 0x1C658
    ldr r0, [pc, #8]
    strd r4, [r0, #4]
    pop {r4, r5, r6, pc}
.size func_0001CD0C, . - func_0001CD0C

.section .text.func_0000D434, "ax", %progbits
.balign 4
.global func_0000D434
.type func_0000D434, %function
ASM_FUNC(func_0000D434)
func_0000D434:
    push {r4}
    mov r4, #1
    str r4, [r0]
    mov r12, #2
    mov r3, #0
    str r12, [r1]
    str r3, [r2]
    pop {r4}
    mov r0, r3
    bx lr
.size func_0000D434, . - func_0000D434

.section .text.func_000124F4, "ax", %progbits
.balign 4
.global func_000124F4
.type func_000124F4, %function
ASM_FUNC(func_000124F4)
func_000124F4:
    cmp r0, #0
    moveq r0, #1
    beq .L124f4_return
    ldr r0, [r0, #4]
    add r0, r0, #5120
    add r0, r0, #28
    ldr r0, [r0, #24]
    str r0, [r1]
    mov r0, #0
.L124f4_return:
    bx lr
.size func_000124F4, . - func_000124F4

.section .text.func_0000E704, "ax", %progbits
.balign 4
.global func_0000E704
.type func_0000E704, %function
ASM_FUNC(func_0000E704)
func_0000E704:
    push {r4, lr}
    ldr r1, [r0]
    mov r4, r0
    bl . - 0x100
    add r0, r4, #4
    str r0, [r4, #12]
    mov r1, #0
    str r0, [r4]
    strd r0, [r4, #24]
    str r0, [r4, #20]
    pop {r4, pc}
.size func_0000E704, . - func_0000E704

.section .text.func_0001BD60, "ax", %progbits
.balign 4
.global func_0001BD60
.type func_0001BD60, %function
ASM_FUNC(func_0001BD60)
func_0001BD60:
    mov r0, r1
    mov r1, r2
    ldr r2, [r0, #4]
    ldr r3, [r1, #4]
    cmp r2, r3
    movne r0, #0
    bne .L1bd60_return
    ldr r2, [r0]
    ldr r2, [r2, #20]
    bx r2
.L1bd60_return:
    bx lr
.size func_0001BD60, . - func_0001BD60

.section .text.func_0000EE88, "ax", %progbits
.balign 4
.global func_0000EE88
.type func_0000EE88, %function
ASM_FUNC(func_0000EE88)
func_0000EE88:
    cmp r1, #8
    movlo r0, #16
    blo .Lee88_return
    cmp r1, #1024
    addhs r0, r1, #768
    addhs r0, r0, #255
    lsrhs r0, r0, #10
    lslhs r0, r0, #10
    bhs .Lee88_return
    cmp r1, r0, lsl #1
    lsllo r0, r0, #1
    movhs r0, r1
.Lee88_return:
    bx lr
.size func_0000EE88, . - func_0000EE88
