.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_0000F76C, "ax", %progbits
.balign 4
.global func_0000F76C
.type func_0000F76C, %function
ASM_FUNC(func_0000F76C)
func_0000F76C:
    push {r4, r5}
    ldr r4, [r2]
    cmp r4, r3
    beq .Lf76c_fail
    ldrb r12, [r0], #1
    add r4, r4, #1
    str r4, [r2]
    tst r12, #128
    streq r12, [r1]
    beq .Lf76c_success
    cmp r4, r3
    beq .Lf76c_fail
    lsl r12, r12, #25
    lsr r12, r12, #18
    str r12, [r1]
    ldr r4, [r2]
    ldrb r12, [r0], #1
    add r4, r4, #1
    tst r12, #128
    str r4, [r2]
    beq .Lf76c_finish
    cmp r4, r3
    beq .Lf76c_fail
    ldr r4, [r1]
    and r12, r12, #127
    orr r12, r12, r4
    lsl r12, r12, #7
    str r12, [r1]
    ldr r4, [r2]
    ldrb r12, [r0], #1
    add r4, r4, #1
    tst r12, #128
    str r4, [r2]
    beq .Lf76c_finish
    cmp r4, r3
    bne .Lf76c_fourth
.Lf76c_fail:
    pop {r4, r5}
    mov r0, #0
    bx lr
.Lf76c_success:
    pop {r4, r5}
    mov r0, #1
    bx lr
.Lf76c_finish:
    ldr r0, [r1]
    orr r0, r0, r12
    str r0, [r1]
    b .Lf76c_success
.Lf76c_fourth:
    ldr r3, [r1]
    and r12, r12, #127
    orr r3, r3, r12
    lsl r3, r3, #7
    str r3, [r1]
    ldrb r0, [r0]
    orr r0, r0, r3
    str r0, [r1]
    ldr r0, [r2]
    add r0, r0, #1
    str r0, [r2]
    b .Lf76c_success
.size func_0000F76C, . - func_0000F76C

.section .text.func_0000DBF8, "ax", %progbits
.balign 4
.global func_0000DBF8
.type func_0000DBF8, %function
ASM_FUNC(func_0000DBF8)
func_0000DBF8:
    push {r4, r5, lr}
    sub sp, sp, #36
    ldr r4, [pc, #220]
    strb r2, [r4, #4]
    ldr r2, [r4, #8]
    cmp r2, #0
    movne r0, #0
    bne .Ldbf8_return
    str r1, [r4, #48]
    str r0, [r4, #8]
    ldr r2, [r0]
    rsb r1, r1, r1, lsl #3
    lsl r1, r1, #4
    ldr r3, [r2, #8]
    mov r2, #4
    blx r3
    cmp r0, #0
    mov r5, #0
    str r0, [r4, #12]
    beq .Ldbf8_fail
    ldr r1, [r4, #48]
    rsb r1, r1, r1, lsl #3
    lsl r1, r1, #4
    bl . - 0xDC14
    str r5, [r4, #52]
    str r5, [r4, #56]
    ldr r0, [pc, #128]
    bl . - 0xDC1C
    ldrb r0, [r4, #4]
    cmp r0, #0
    beq .Ldbf8_success
    ldr r4, [pc, #120]
    add lr, sp, #12
    mov r12, #4
    str r4, [sp, #20]
    ldr r4, [pc, #108]
    mvn r3, #1
    mov r1, #4096
    str r4, [sp, #24]
    ldr r4, [pc, #96]
    ldr r0, [pc, #76]
    ldr r2, [pc, #76]
    str r4, [sp, #28]
    stm lr, {r5, r12}
    str r3, [sp, #8]
    stm sp, {r1, r12}
    add r3, sp, #12
    add r1, sp, #16
    bl . - 0xDC68
    lsrs r1, r0, #31
    blne . - 0xDCA8
.Ldbf8_success:
    mov r0, #1
.Ldbf8_return:
    add sp, sp, #36
    pop {r4, r5, pc}
.Ldbf8_fail:
    str r5, [r4, #8]
    str r5, [r4, #48]
    add sp, sp, #36
    mov r0, #0
    pop {r4, r5, pc}
.size func_0000DBF8, . - func_0000DBF8

.section .text.func_00011044, "ax", %progbits
.balign 4
.global func_00011044
.type func_00011044, %function
ASM_FUNC(func_00011044)
func_00011044:
    push {r3, r4, r5, r6, r7, r8, r9, r10, r11, lr}
    mov r5, r2
    movs r2, r3
    mov r9, r0
    mov r4, r1
    ldr r3, [sp, #40]
    beq .L11044_return
    ldr r0, [r9, #8]
    add r1, r4, r2
    cmp r1, r0
    bhi .L11044_wrap
    add r12, r5, r2
    cmp r12, r0
    bhi .L11044_wrap
    ldr r1, [r9, #4]
    add r0, r1, r4
    add r1, r1, r5
    pop {r3, r4, r5, r6, r7, r8, r9, r10, r11, lr}
    b . - 0x10FA4
.L11044_wrap:
    cmp r1, r0
    subhi r6, r0, r4
    subls r6, r0, r5
    add r7, r4, r6
    cmp r7, r0
    add r8, r5, r6
    subcs r7, r7, r0
    cmp r8, r0
    subcs r8, r8, r0
    cmp r3, #0
    sub r10, r2, r6
    beq .L11044_reverse
    mov r11, #1
    mov r3, r6
    mov r2, r5
    mov r1, r4
    mov r0, r9
    str r11, [sp]
    bl . - 0x94
    mov r3, r10
    mov r2, r8
    mov r1, r7
    mov r0, r9
    str r11, [sp]
    bl . - 0xAC
.L11044_return:
    pop {r3, r4, r5, r6, r7, r8, r9, r10, r11, pc}
.L11044_reverse:
    mov r11, #0
    mov r3, r10
    mov r2, r8
    mov r1, r7
    mov r0, r9
    str r11, [sp]
    bl . - 0xCC
    mov r3, r6
    mov r2, r5
    mov r1, r4
    mov r0, r9
    str r11, [sp]
    bl . - 0xE4
    pop {r3, r4, r5, r6, r7, r8, r9, r10, r11, pc}
.size func_00011044, . - func_00011044
