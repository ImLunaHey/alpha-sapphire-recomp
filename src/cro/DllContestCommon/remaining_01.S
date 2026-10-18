.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_00000030, "ax", %progbits
.balign 4
.global func_00000030
.type func_00000030, %function
ASM_FUNC(func_00000030)
func_00000030:
    push {r4, r5, r6, r7, lr}
    mov r5, r0
    sub sp, sp, #28
    ldr r1, [r0]
    mov r0, #120
    bl . - 0x44
    movs r4, r0
    beq .L0044
    ldr r0, [r5]
    ldr r1, [r0]
    ldr r1, [r1, #52]
    blx r1
    mov r1, r0
    mov r3, #1
    mov r2, #242
    mov r0, r4
    bl . - 0x68
.L0044:
    mov r1, #0
    str r0, [r5, #4]
    bl . - 0x6C
    mov r4, r0
    ldr r0, [r5]
    ldr r1, [r0]
    ldr r1, [r1, #52]
    blx r1
    mov r1, r4
    bl . - 0x80
    mov r4, r0
    ldr r0, [r5, #4]
    mov r2, r4
    mov r1, #0
    bl . - 0x8C
    str r4, [r5, #8]
    ldr r0, [r5, #4]
    mov r1, #1
    bl . - 0xAC
    mov r4, r0
    ldr r0, [r5]
    ldr r1, [r0]
    ldr r1, [r1, #52]
    blx r1
    mov r1, r4
    bl . - 0xC0
    mov r4, r0
    ldr r0, [r5, #4]
    mov r2, r4
    mov r1, #1
    bl . - 0xCC
    str r4, [r5, #12]
    ldr r0, [r5, #4]
    mov r1, #2
    bl . - 0xEC
    mov r4, r0
    ldr r0, [r5]
    ldr r1, [r0]
    ldr r1, [r1, #52]
    blx r1
    mov r1, r4
    bl . - 0x100
    str r0, [r5, #16]
    ldr r3, [r5, #4]
    mov r2, r0
    mov r1, #2
    mov r0, r3
    bl . - 0x110
    ldr r0, [r5, #4]
    mov r1, #3
    bl . - 0x12C
    mov r4, r0
    ldr r0, [r5]
    ldr r1, [r0]
    ldr r1, [r1, #52]
    blx r1
    mov r1, r4
    bl . - 0x140
    mov r4, r0
    ldr r0, [r5, #4]
    mov r2, r4
    mov r1, #3
    bl . - 0x14C
    str r4, [r5, #20]
    ldr r4, [pc, #140]
    mov r7, sp
    ldm r4, {r0, r1, r2, r3, ip}
    ldr r4, [r4, #20]
    str r4, [sp, #20]
    stm sp, {r0, r1, r2, r3, ip}
    mov r4, #0
.L0160:
    ldr r0, [r5, #4]
    ldr r1, [r7, r4, lsl #2]
    bl . - 0x188
    mov r6, r0
    ldr r0, [r5]
    ldr r1, [r0]
    ldr r1, [r1, #52]
    blx r1
    mov r1, r6
    bl . - 0x19C
    mov r6, r0
    ldr r0, [r5, #4]
    ldr r1, [r7, r4, lsl #2]
    mov r2, r6
    bl . - 0x1A8
    add r0, r5, r4, lsl #2
    add r4, r4, #1
    cmp r4, #6
    str r6, [r0, #24]
    bcc .L0160
    ldr r0, [r5, #4]
    cmp r0, #0
    beq .L01d0
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    mov r0, #0
    str r0, [r5, #4]
.L01d0:
    add sp, sp, #28
    pop {r4, r5, r6, r7, pc}
.size func_00000030, . - func_00000030

