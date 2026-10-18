.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_00000610, "ax", %progbits
.balign 4
.global func_00000610
.type func_00000610, %function
ASM_FUNC(func_00000610)
func_00000610:
    push {r4-r8, lr}
    mov r4, r0
    ldr r0, [r0, #0x40]
    ldr r1, [r4, #0x10]
    ldr r0, [r0]
    ldrb r1, [r1]
    and r5, r0, #0xFF
    lsl r2, r0, #8
    cmp r1, #0x20
    lsr r6, r2, #24
    bne .Lcheck_mode

    ldr r0, [r4, #8]
    ldr r0, [r0, #0x60]
    ldr r0, [r0, #0x1C]
    ldr r0, [r0]
    add r0, r0, #0xEF0
    bl . - 0x5B8
    mov r7, r0

    ldr r0, [r4, #8]
    ldr r1, [pc, #0xA4]
    ldr r0, [r0, #0x60]
    ldr r0, [r0, #0x1C]
    ldr r0, [r0]
    add r0, r0, #0x10000
    add r0, r0, #0x3140
    bl . - 0x5D4
    ldrh r1, [r0]
    cmp r7, #0x11
    beq .Lcheck_mode
    cmp r1, #2
    bne .Ltrue

.Lcheck_mode:
    ldr r0, [r4, #0x10]
    ldrh r1, [r0, #0x1C]
    cmp r1, #0
    beq .Lmode_zero
    cmp r1, #1
    beq .Lmode_one
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl . - 0x678
.Lfalse:
    mov r0, #0
    pop {r4-r8, pc}

.Lmode_zero:
    ldrh r1, [r0, #0x18]
    cmp r1, r5
    bne .Lfalse
    ldrh r0, [r0, #0x1A]
    cmp r0, #9
    beq .Ltrue
    cmp r0, r6
    beq .Ltrue
    b .Lfalse

.Lmode_one:
    ldrh r1, [r0, #0x18]
    cmp r1, r5
    beq .Lfalse
    ldrh r0, [r0, #0x1A]
    cmp r0, #9
    beq .Ltrue
    cmp r0, r6
    beq .Lfalse

.Ltrue:
    mov r0, #1
    pop {r4-r8, pc}
.size func_00000610, . - func_00000610
