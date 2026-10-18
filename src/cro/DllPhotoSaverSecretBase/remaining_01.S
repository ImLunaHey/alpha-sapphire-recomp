.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_00001D60, "ax", %progbits
.balign 4
.global func_00001D60
.type func_00001D60, %function
ASM_FUNC(func_00001D60)
func_00001D60:
    push {r4, r5, r6, r7, r8, r9, lr}
    mov r4, r0
    sub sp, sp, #36
    mov r5, r1
    ldr r9, [pc, #512]
    mov r6, r2
    mov r8, #0
    sub r0, r9, #12
    ldr r0, [r0]
    tst r0, #1
    bne .L0048
    sub r0, r9, #12
    bl . - 0x1B48
    cmp r0, #0
    beq .L0048
    sub r0, r9, #12
    str r8, [r9, #8]
    bl . - 0x1B54
.L0048:
    mov r0, #8
    str r0, [sp, #28]
    add r3, sp, #16
    mov r7, #1
    mov r2, #59
    str r9, [sp]
    stm r3, {r2, r7, r8}
    add ip, sp, #8
    ldr r1, [pc, #428]
    str r7, [sp, #4]
    mov r3, r7
    stm ip, {r1, r7}
    mov r2, r6
    mov r1, r5
    mov r0, r4
    bl . - 0x1B8C
    nop {0}
    nop {0}
    bl . - 0x1CA8
    ldr r0, [r0, #28]
    ldr r0, [r0]
    add r1, r0, #132096
    add r0, sp, #8
    bl . - 0x1B24
    add r0, sp, #8
    nop {0}
    bl . - 0x1B28
    mov r5, r0
    mov r0, r4
    bl . - 0x1D84
    mov r3, #6
    mov r2, r5
    mov r1, #5
    str r7, [sp]
    str r7, [sp, #4]
    bl . - 0x1B44
    mov r3, #12
    mov r2, #43
    mov r1, #0
    mov r0, r4
    bl . - 0x1B78
    add r0, r4, #120
    nop {0}
    bl . - 0x1B5C
    ldr r1, [pc, #288]
    mvn r2, #24
    smull r3, r1, r1, r0
    asr r3, r1, #5
    sub r1, r3, r1, asr #31
    mul r1, r1, r2
    add r5, r0, r1, lsl #2
    mov r0, r4
    bl . - 0x1DE0
    mov r6, #2
    mov r3, r6
    mov r2, r5
    mov r1, #0
    strd r6, [sp]
    bl . - 0x1BA0
    add r0, r4, #120
    nop {0}
    bl . - 0x1B9C
    mov r5, r0
    mov r0, r4
    bl . - 0x1E10
    mov r3, #2
    mov r2, r5
    mov r1, #1
    str r7, [sp, #4]
    str r8, [sp]
    bl . - 0x1BD0
    add r0, r4, #120
    nop {0}
    bl . - 0x1BC4
    mov r5, r0
    mov r0, r4
    bl . - 0x1E40
    mov r3, #2
    mov r2, r5
    mov r1, r3
    str r7, [sp, #4]
    str r8, [sp]
    bl . - 0x1C00
    add r0, r4, #120
    nop {0}
    bl . - 0x1BEC
    mov r5, r0
    mov r0, r4
    bl . - 0x1E70
    mov r3, #2
    mov r2, r5
    mov r1, #3
    str r7, [sp]
    str r7, [sp, #4]
    bl . - 0x1C30
    add r0, r4, #120
    nop {0}
    bl . - 0x1C14
    mov r5, r0
    mov r0, r4
    bl . - 0x1EA0
    mov r3, #2
    mov r2, r5
    mov r1, #4
    strd r6, [sp]
    bl . - 0x1C5C
    mov r3, #10
    mov r2, #49
    mov r1, #0
    mov r0, r4
    bl . - 0x1C90
    add r0, sp, #8
    nop {0}
    bl . - 0x1C4C
    add sp, sp, #36
    pop {r4, r5, r6, r7, r8, r9, pc}
.size func_00001D60, . - func_00001D60

