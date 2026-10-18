.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_00000DC0, "ax", %progbits
.balign 4
.global func_00000DC0
.type func_00000DC0, %function
ASM_FUNC(func_00000DC0)
func_00000DC0:
    push {r4, r5, lr}
    mov r4, r0
    sub sp, sp, #12
    mov r0, #238
    bl . - 0xC50
    mov r5, r0
    mov r0, #237
    bl . - 0xC5C
    mov r12, #393216
    mov r3, #154
    mov r2, #65536
    stm sp, {r2, r3, r12}
    mov r1, r0
    mov r3, #153
    mov r2, r5
    add r0, r4, #12
    bl . - 0xC78
    ldr r1, [r4, #16]
    mov r0, #136
    bl . - 0xDEC
    movs r12, r0
    beq .Ldc0_store
    ldr r0, [r4, #36]
    ldr r1, [r0, #8]
    str r1, [sp]
    ldrd r2, [r0]
    add r1, r4, #12
    mov r0, r12
    bl . + 0x794
.Ldc0_store:
    str r0, [r4, #8]
    str r4, [r0, #124]
    ldr r0, [r4, #44]
    add r1, r4, #4
    bl . - 0xCB4
    ldr r0, [r4, #8]
    ldr r1, [r0]
    ldr r1, [r1, #32]
    blx r1
    mov r0, #1
    bl . - 0xCC4
    mov r0, #1
    strb r0, [r4, #40]
    add sp, sp, #12
    pop {r4, r5, pc}
.size func_00000DC0, . - func_00000DC0

.section .text.func_000015C4, "ax", %progbits
.balign 4
.global func_000015C4
.type func_000015C4, %function
ASM_FUNC(func_000015C4)
func_000015C4:
    push {r4, r5, r6, r7, r8, r9, lr}
    sub sp, sp, #36
    mov r8, r2
    mov r7, r3
    ldr r2, [r1, #16]
    ldr r6, [sp, #64]
    mov r4, r1
    mov r3, r2
    bl . - 0x13FC
    mov r5, r0
    ldr r0, [pc, #464]
    mov r9, #0
    add r1, r0, #68
    str r0, [r5]
    str r1, [r5, #116]
    str r9, [r5, #124]
    bl . - 0x1414
    ldr r0, [r0, #28]
    ldr r0, [r0]
    add r0, r0, #73728
    add r0, r0, #2464
    str r0, [r5, #128]
    bl . - 0x142C
    ldr r0, [r0, #28]
    mov r2, #0
    mov r1, r4
    ldr r0, [r0]
    add r0, r0, #84992
    add r0, r0, #872
    str r0, [r5, #132]
    mov r0, r5
    bl . - 0x1448
    ldr r3, [pc, #380]
    cmp r7, #0
    cmpne r6, #0
    mov r1, r4
    mov r2, r8
    mov r0, #1
    sub r12, r3, #20
    beq .L15c4_default
    add r8, sp, #24
    str r6, [sp, #20]
    str r12, [sp]
    stm r8, {r0, r9}
    add r8, sp, #4
    stm r8, {r0, r3}
    add r8, sp, #12
    mov r3, #1
    stm r8, {r0, r7}
    mov r0, r5
    bl . - 0x148C
.L15c4_post_setup:
    mov r0, r5
    bl . - 0xBA4
    ldr r3, [pc, #300]
    mov r2, #10
    mov r1, #0
    mov r0, r5
    bl . - 0x14F8
    ldr r3, [pc, #284]
    mov r2, #23
    mov r1, #0
    mov r0, r5
    bl . - 0x150C
    mov r3, #0
    mov r2, #60
    mov r1, r3
    mov r0, r5
    bl . - 0x1520
    mov r3, #1
    mov r2, #69
    mov r1, #0
    mov r0, r5
    bl . - 0x1534
    mov r3, #2
    mov r2, #78
    mov r1, #0
    mov r0, r5
    bl . - 0x1548
    ldr r3, [pc, #208]
    mov r2, #31
    mov r1, #0
    mov r0, r5
    bl . - 0x155C
    mov r1, #0
    mov r0, r5
    bl . - 0x15C0
    mov r1, #10
    mov r2, r0
    str r1, [sp]
    ldr r3, [pc, #168]
    mov r1, r4
    mov r0, r5
    bl . - 0x152C
    ldr r7, [pc, #152]
    mov r4, #0
    add r6, r7, #280
.L15c4_loop:
    rsb r0, r4, r4, lsl #3
    ldr r2, [r6, r4, lsl #2]
    ldr r1, [r7, r0, lsl #2]
    ldr r0, [r5, #16]
    bl . - 0x1544
    add r4, r4, #1
    cmp r4, #10
    bcc .L15c4_loop
    mov r0, r5
    bl . - 0x8F8
    add r1, r5, #116
    mov r0, r5
    bl . - 0x155C
    add sp, sp, #36
    mov r0, r5
    pop {r4, r5, r6, r7, r8, r9, pc}
.L15c4_default:
    mov r6, #8
    add r8, sp, #20
    str r6, [sp, #28]
    str r12, [sp]
    stm r8, {r0, r9}
    add r8, sp, #4
    mov r7, #70
    stm r8, {r0, r3}
    add r8, sp, #12
    mov r3, #1
    stm r8, {r0, r7}
    mov r0, r5
    bl . - 0x1594
    nop {0}
    nop {0}
    b .L15c4_post_setup
.size func_000015C4, . - func_000015C4
