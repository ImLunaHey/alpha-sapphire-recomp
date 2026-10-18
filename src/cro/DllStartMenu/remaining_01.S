.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_00000E44, "ax", %progbits
.balign 4
.global func_00000E44
.type func_00000E44, %function
ASM_FUNC(func_00000E44)
func_00000E44:
    push {r3, r4, r5, r6, r7, lr}
    mov r5, r1
    mov r4, r0
    mov r2, #0
    mov r1, #16
    mov r0, r5
    bl . - 0xCE4
    cmp r0, #0
    mov r7, #1
    beq .L0064
    ldr r0, [r4, #164]
    cmp r0, #0
    beq .L00a0
    ldr r1, [r0]
    ldr r2, [r1]
    ldr r1, [r4, #168]
    blx r2
    ldr r1, [r4, #168]
    str r7, [sp]
    ldr r0, [r4, #92]
    add r2, r1, #7
    mov r3, #1
    mov r1, #0
    bl . - 0xC68
    b .L0098
.L0064:
    mov r2, #0
    mov r1, #32
    mov r0, r5
    bl . - 0xD3C
    cmp r0, #0
    nop {0}
    beq .L00a0
    ldr r0, [r4, #164]
    cmp r0, #0
    beq .L00a0
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
.L0098:
    mov r0, #0
.L009c:
    pop {r3, r4, r5, r6, r7, pc}
.L00a0:
    mov r2, #0
    mov r1, #4
    mov r0, r5
    bl . - 0xCB0
    cmp r0, #0
    nop {0}
    beq .L0114
    ldr r0, [r4, #168]
    cmp r0, #0
    beq .L0098
    ldr r0, [r4, #164]
    cmp r0, #0
    beq .L00e0
    ldr r1, [r0]
    ldr r1, [r1, #8]
    blx r1
.L00e0:
    ldr r0, [r4, #168]
    mov r5, #0
    sub r6, r0, #1
    str r6, [r4, #168]
.L00f0:
    mov r3, #0
    ldr r0, [r4, #92]
    mov r2, r5
    mov r1, r3
    bl . - 0xCFC
    add r5, r5, #1
    cmp r5, #3
    ble .L00f0
    b .L0194
.L0114:
    mov r2, #0
    mov r1, #8
    mov r0, r5
    bl . - 0xD24
    cmp r0, #0
    moveq r0, #1
    beq .L009c
    ldrb r0, [r4, #172]
    ldr r1, [r4, #168]
    cmp r0, #1
    moveq r0, #3
    movne r0, #2
    cmp r0, r1
    bls .L0098
    ldr r0, [r4, #164]
    cmp r0, #0
    beq .L0164
    ldr r1, [r0]
    ldr r1, [r1, #8]
    blx r1
.L0164:
    ldr r0, [r4, #168]
    mov r5, #0
    add r6, r0, #1
    str r6, [r4, #168]
.L0174:
    mov r3, #0
    ldr r0, [r4, #92]
    mov r2, r5
    mov r1, r3
    bl . - 0xD80
    add r5, r5, #1
    cmp r5, #3
    ble .L0174
.L0194:
    str r7, [sp]
    ldr r0, [r4, #92]
    mov r3, #1
    mov r2, r6
    mov r1, #0
    bl . - 0xDB4
    nop {0}
    nop {0}
    b .L0098
.size func_00000E44, . - func_00000E44

