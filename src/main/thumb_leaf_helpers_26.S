.syntax unified
.arch armv6k
.fpu vfpv2
.thumb

.section .text.func_002FF3AE, "ax", %progbits
.balign 2
.global func_002FF3AE
.type func_002FF3AE, %function
.thumb_func
func_002FF3AE:
    push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
    movs r4, r1
    sub sp, #60
    movs r6, r3
    ldmia r2!, {r0, r1}
    str r0, [sp, #32]
    str r1, [sp, #36]
    lsls r7, r1, #1
    lsrs r5, r7, #21
    bne .L002FF3AE_0016
    .inst.n 0x1e6d
.L002FF3AE_0016:
    movs r1, #0
    movs r0, r1
    blx func_002FF110
    movs r1, #3
    ldr r2, [sp, #36]
    lsls r1, r1, #22
    ands r0, r1
    cmp r2, #0
    bge .L002FF3AE_0032
    lsls r2, r0, #2
    adds r0, r0, r2
    lsrs r0, r0, #1
    ands r0, r1
.L002FF3AE_0032:
    lsrs r0, r0, #22
    cmp r0, #1
    str r0, [sp, #40]
    ble .L002FF3AE_0040
    movs r0, #0
    mvns r0, r0
    str r0, [sp, #40]
.L002FF3AE_0040:
    ldr r0, [sp, #32]
    orrs r7, r0
    beq .L002FF3AE_0062
    ldr r0, [pc, #956]
    ldr r1, [pc, #960]
    adds r0, r5, r0
    muls r0, r1
    asrs r7, r0, #16
.L002FF3AE_0050:
    ldr r0, [sp, #96]
    cmp r0, #0
    beq .L002FF3AE_0092
    negs r5, r6
.L002FF3AE_0058:
    .inst.n 0x1e29
    ble .L002FF3AE_0098
    ldr r0, [sp, #40]
    negs r2, r0
    b .L002FF3AE_009a
.L002FF3AE_0062:
    ldr r0, [sp, #96]
    cmp r0, #1
    beq .L002FF3AE_006e
    movs r0, #0
    movs r1, #48
    b .L002FF3AE_0078
.L002FF3AE_006e:
    movs r0, #0
    mvns r2, r6
    b .L002FF3AE_0080
.L002FF3AE_0074:
    strb r1, [r4, r0]
    .inst.n 0x1c40
.L002FF3AE_0078:
    cmp r0, r6
    blt .L002FF3AE_0074
    movs r0, r6
    movs r2, #0
.L002FF3AE_0080:
    ldr r3, [sp, #96]
    movs r1, #0
    strb r1, [r4, r0]
    ldr r1, [sp, #60]
    str r3, [r1, #8]
    str r2, [r1, #0]
    str r0, [r1, #4]
.L002FF3AE_008e:
    add sp, #76
    pop {r4, r5, r6, r7, pc}
.L002FF3AE_0092:
    subs r5, r7, r6
    .inst.n 0x1c6d
    b .L002FF3AE_0058
.L002FF3AE_0098:
    ldr r2, [sp, #40]
.L002FF3AE_009a:
    cmp r1, #0
    bge .L002FF3AE_00a0
    negs r1, r5
.L002FF3AE_00a0:
    add r0, sp, #44
    bl func_002FF118
    add r0, sp, #44
    add r3, sp, #12
    ldmia r0, {r0, r1, r2}
    stmia r3!, {r0, r1, r2}
    ldr r1, [sp, #32]
    ldr r0, [sp, #36]
    blx arm_secondary_001947E8
    str r1, [sp, #4]
    movs r1, r0
    ldr r0, [pc, #848]
    str r2, [sp, #8]
    adds r1, r1, r0
    cmp r5, #0
    str r1, [sp, #0]
    ble .L002FF3AE_00dc
    ldr r1, [pc, #836]
    ldr r0, [sp, #12]
    ldr r2, [sp, #40]
    negs r1, r1
    adds r0, r0, r1
    add r1, sp, #12
    str r0, [sp, #12]
    mov r0, sp
    blx func_002FF1EC
    b .L002FF3AE_00ec
.L002FF3AE_00dc:
    ldr r1, [sp, #12]
    ldr r2, [sp, #40]
    adds r0, r1, r0
    add r1, sp, #12
    str r0, [sp, #12]
    mov r0, sp
    blx func_002FF21C
.L002FF3AE_00ec:
    str r0, [sp, #0]
    lsls r0, r0, #16
    str r2, [sp, #8]
    str r1, [sp, #4]
    beq .L002FF3AE_00fe
    movs r0, #0
    mvns r0, r0
    lsrs r1, r0, #1
    b .L002FF3AE_0100
.L002FF3AE_00fe:
    movs r0, r2
.L002FF3AE_0100:
    ldr r2, [sp, #96]
    cmp r2, #0
    beq .L002FF3AE_010e
    movs r2, #0
    movs r5, r2
    str r2, [sp, #0]
    b .L002FF3AE_014c
.L002FF3AE_010e:
    .inst.n 0x1e75
    bmi .L002FF3AE_011e
.L002FF3AE_0112:
    blx func_002FF24C
    adds r2, #48
    strb r2, [r4, r5]
    .inst.n 0x1e6d
    bpl .L002FF3AE_0112
.L002FF3AE_011e:
    movs r2, #1
    orrs r0, r1
    str r6, [sp, #28]
    beq .L002FF3AE_012c
    movs r2, #0
    .inst.n 0x1c7f
    b .L002FF3AE_0136
.L002FF3AE_012c:
    ldrb r0, [r4, #0]
    cmp r0, #48
    bne .L002FF3AE_0136
    movs r2, #0
    .inst.n 0x1e7f
.L002FF3AE_0136:
    cmp r2, #0
    str r7, [sp, #24]
    beq .L002FF3AE_0050
    b .L002FF3AE_017c
.L002FF3AE_013e:
    cmp r5, #17
    bge .L002FF3AE_0152
    blx func_002FF24C
    adds r2, #48
    strb r2, [r4, r5]
    .inst.n 0x1c6d
.L002FF3AE_014c:
    movs r2, r0
    orrs r2, r1
    bne .L002FF3AE_013e
.L002FF3AE_0152:
    orrs r0, r1
    bne .L002FF3AE_0176
    movs r1, #0
    .inst.n 0x1e68
    b .L002FF3AE_0168
.L002FF3AE_015c:
    ldrb r3, [r4, r0]
    ldrb r2, [r4, r1]
    strb r3, [r4, r1]
    .inst.n 0x1c49
    strb r2, [r4, r0]
    .inst.n 0x1e40
.L002FF3AE_0168:
    cmp r1, r0
    blt .L002FF3AE_015c
    subs r0, r5, r6
    .inst.n 0x1e40
    str r5, [sp, #28]
    str r0, [sp, #24]
    b .L002FF3AE_017c
.L002FF3AE_0176:
    ldr r0, [sp, #0]
    cmp r0, #0
    beq .L002FF3AE_0192
.L002FF3AE_017c:
    ldr r2, [sp, #28]
    ldr r1, [sp, #96]
    movs r0, #0
    strb r0, [r4, r2]
    ldr r0, [sp, #60]
    ldr r3, [sp, #28]
    ldr r2, [sp, #24]
    str r3, [r0, #4]
    str r2, [r0, #0]
    str r1, [r0, #8]
    b .L002FF3AE_008e
.L002FF3AE_0192:
    movs r6, #17
    movs r0, #0
    str r0, [sp, #96]
    b .L002FF3AE_0050
.size func_002FF3AE, . - func_002FF3AE

.type func_002FF110, %function
.type func_002FF118, %function
.type arm_secondary_001947E8, %function
.type func_002FF1EC, %function
.type func_002FF21C, %function
.type func_002FF24C, %function
