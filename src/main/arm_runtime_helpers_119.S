.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_004A9DA4, "ax", %progbits
.balign 4
.global func_004A9DA4
.type func_004A9DA4, %function
func_004A9DA4:
    mov r3, r1
    mov r1, r0
    mov r2, #112
    mov r0, r3
    b func_00300B28
.size func_004A9DA4, . - func_004A9DA4

.section .text.func_004A9DF4, "ax", %progbits
.balign 4
.global func_004A9DF4
.type func_004A9DF4, %function
func_004A9DF4:
    mov r3, r0
    movs r0, r1
    push {r4, lr}
    beq .L119_004A9DF4_return
    mov r2, #8
    mov r1, r3
    blx func_00100218
    cmp r0, #0
    moveq r0, #1
    movne r0, #0
.L119_004A9DF4_return:
    pop {r4, pc}
.size func_004A9DF4, . - func_004A9DF4

.section .text.func_004B22CC, "ax", %progbits
.balign 4
.global func_004B22CC
.type func_004B22CC, %function
func_004B22CC:
    push {r4, r5, r6, lr}
    mov r5, r2
    mov r4, r0
    mov r2, #6
    blx func_00100218
    cmp r0, #0
    bne .L119_004B22CC_different
    ldr r0, [r4, #24]
    ldr r1, [r5, #12]
    cmp r0, r1
    bne .L119_004B22CC_different
    ldr r0, [r4, #16]
    ldr r1, [r5, #4]
    cmp r0, r1
    bne .L119_004B22CC_different
    ldrb r0, [r4, #20]
    ldrb r1, [r5, #8]
    cmp r0, r1
    bne .L119_004B22CC_different
    mov r2, #20
    add r1, r5, #31
    add r0, r4, #43
    blx func_00100218
    cmp r0, #0
    movne r0, #1
    pop {r4, r5, r6, pc}
.L119_004B22CC_different:
    mov r0, #2
    pop {r4, r5, r6, pc}
.size func_004B22CC, . - func_004B22CC

.section .text.func_004B233C, "ax", %progbits
.balign 4
.global func_004B233C
.type func_004B233C, %function
func_004B233C:
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r5, r1
    mov r2, #6
    blx func_00100218
    cmp r0, #0
    bne .L119_004B233C_different
    ldr r0, [r4, #24]
    ldr r1, [r5, #24]
    cmp r0, r1
    bne .L119_004B233C_different
    ldr r0, [r4, #16]
    ldr r1, [r5, #16]
    cmp r0, r1
    bne .L119_004B233C_different
    ldrb r0, [r4, #20]
    ldrb r1, [r5, #20]
    cmp r0, r1
    bne .L119_004B233C_different
    mov r2, #20
    add r1, r5, #43
    add r0, r4, #43
    blx func_00100218
    cmp r0, #0
    movne r0, #1
    pop {r4, r5, r6, pc}
.L119_004B233C_different:
    mov r0, #2
    pop {r4, r5, r6, pc}
.size func_004B233C, . - func_004B233C

.section .note.GNU-stack, "", %progbits
