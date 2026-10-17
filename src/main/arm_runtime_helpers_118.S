.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00442608, "ax", %progbits
.balign 4
.global func_00442608
.type func_00442608, %function
func_00442608:
    push {r4, r5, r6, lr}
    mov r4, r0
    ldrb r0, [r0, #4]
    cmp r0, #0
    beq .L118_func_00442608_58
    ldr r0, [r4, #12]
    mov r5, #0
    cmp r0, #0
    beq .L118_func_00442608_34
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    str r5, [r4, #12]
.L118_func_00442608_34:
    ldr r0, [r4, #32]
    cmp r0, #0
    beq .L118_func_00442608_50
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    str r5, [r4, #32]
.L118_func_00442608_50:
    strb r5, [r4, #4]
    strb r5, [r4, #5]
.L118_func_00442608_58:
    pop {r4, r5, r6, pc}
.L118_func_00442608_body_end:
.size func_00442608, .L118_func_00442608_body_end - func_00442608

.section .text.func_0046FB00, "ax", %progbits
.balign 4
.global func_0046FB00
.type func_0046FB00, %function
func_0046FB00:
    push {r4, r5, r6, r7, r8, lr}
    mov r5, r0
    mov r7, r2
    ldr r0, [r0, #464]
    add r6, r5, #768
    strb r1, [r5, #836]
    cmp r0, #0
    beq .L118_func_0046FB00_68
    ldr r2, [r0]
    ldr r2, [r2, #72]
    blx r2
    ldr r0, [r5, #464]
    cmp r7, #0
    beq .L118_func_0046FB00_50
    ldr r2, [r0]
    ldrsb r1, [r6, #68]
    ldr r2, [r2, #64]
    blx r2
    ldrb r0, [r6, #68]
    b .L118_func_0046FB00_64
.L118_func_0046FB00_50:
    ldr r1, [r0]
    ldr r2, [r1, #64]
    mov r1, #1
    blx r2
    mov r0, #1
.L118_func_0046FB00_64:
    strb r0, [r5, #839]
.L118_func_0046FB00_68:
    mov r4, #0
.L118_func_0046FB00_6c:
    add r0, r5, r4, lsl #2
    ldr r0, [r0, #1088]
    cmp r0, #0
    beq .L118_func_0046FB00_8c
    ldr r1, [r0]
    ldr r2, [r1, #72]
    ldrsb r1, [r6, #68]
    blx r2
.L118_func_0046FB00_8c:
    add r4, r4, #1
    cmp r4, #2
    blt .L118_func_0046FB00_6c
    ldr r0, [r5, #476]
    cmp r0, #0
    beq .L118_func_0046FB00_f0
    ldr r2, [r0]
    ldrsb r1, [r6, #68]
    ldrsb r3, [r6, #70]
    ldr r2, [r2, #72]
    and r1, r1, r3
    blx r2
    ldr r0, [r5, #476]
    cmp r7, #0
    beq .L118_func_0046FB00_dc
    ldr r2, [r0]
    ldrsb r1, [r6, #68]
    ldr r2, [r2, #64]
    pop {r4, r5, r6, r7, r8, lr}
    bx r2
.L118_func_0046FB00_dc:
    ldr r1, [r0]
    ldr r2, [r1, #64]
    pop {r4, r5, r6, r7, r8, lr}
    mov r1, #1
    bx r2
.L118_func_0046FB00_f0:
    pop {r4, r5, r6, r7, r8, pc}
.L118_func_0046FB00_body_end:
.size func_0046FB00, .L118_func_0046FB00_body_end - func_0046FB00

.section .text.func_0047CB2C, "ax", %progbits
.balign 4
.global func_0047CB2C
.type func_0047CB2C, %function
func_0047CB2C:
    push {r4, r5, r6, r7, r8, lr}
    mov r4, r0
    ldrsb r0, [r0, #11]
    cmp r0, #0
    movgt r0, #0
    bgt .L118_func_0047CB2C_68
    ldr r0, [r4, #16]
    mov r5, r1
    mov r6, #0
    ldr r7, [r0, r5, lsl #2]
    cmp r7, #0
    beq .L118_func_0047CB2C_6c
    ldr r0, [r7]
    ldr r1, [r0, #20]
    mov r0, r7
    blx r1
    movs r6, r0
    beq .L118_func_0047CB2C_64
    ldr r0, [r7]
    ldr r1, [r0, #4]
    mov r0, r7
    blx r1
    ldr r1, [r4, #16]
    mov r0, #0
    str r0, [r1, r5, lsl #2]
.L118_func_0047CB2C_64:
    mov r0, r6
.L118_func_0047CB2C_68:
    pop {r4, r5, r6, r7, r8, pc}
.L118_func_0047CB2C_6c:
    mov r2, #0
    mov r1, r2
    mov r0, r2
    mov r0, r0
    nop {0}
    nop {0}
    b .L118_func_0047CB2C_64
.L118_func_0047CB2C_body_end:
.size func_0047CB2C, .L118_func_0047CB2C_body_end - func_0047CB2C

.section .text.func_0047D6A4, "ax", %progbits
.balign 4
.global func_0047D6A4
.type func_0047D6A4, %function
func_0047D6A4:
    push {r4, r5, r6, r7, r8, lr}
    mov r4, r0
    mov r6, #0
    ldrsh r0, [r0, #8]
    cmp r0, #0
    movgt r7, #0
    ble .L118_func_0047D6A4_174
.L118_func_0047D6A4_1c:
    ldr r0, [r4, #16]
    ldr r0, [r0, r6, lsl #2]
    cmp r0, #0
    beq .L118_func_0047D6A4_164
    ldr r1, [r0]
    ldr r1, [r1, #28]
    blx r1
    ldr r0, [r4, #16]
    ldr r5, [r0, r6, lsl #2]
    cmp r5, #0
    beq .L118_func_0047D6A4_c8
    ldr r0, [r5]
    ldr r1, [r0, #24]
    mov r0, r5
    blx r1
    cmp r0, #0
    beq .L118_func_0047D6A4_d8
    ldr r0, [r5]
    ldr r1, [r0, #4]
    mov r0, r5
    blx r1
    ldr r1, [r4, #16]
    str r7, [r1, r6, lsl #2]
    ldrsb r0, [r4, #11]
    cmp r0, #0
    ble .L118_func_0047D6A4_164
    ldrsb r0, [r4, #10]
    mov r5, #0
    cmp r0, #0
    ble .L118_func_0047D6A4_164
.L118_func_0047D6A4_94:
    ldr r0, [r4, #24]
    ldr r0, [r0, r5, lsl #2]
    cmp r0, #0
    beq .L118_func_0047D6A4_b4
    ldr r1, [r0]
    ldr r2, [r1, #4]
    mov r1, r6
    blx r2
.L118_func_0047D6A4_b4:
    ldrsb r0, [r4, #10]
    add r5, r5, #1
    cmp r0, r5
    bgt .L118_func_0047D6A4_94
    b .L118_func_0047D6A4_164
.L118_func_0047D6A4_c8:
    mov r2, #0
    mov r1, r2
    mov r0, r2
    mov r0, r0
.L118_func_0047D6A4_d8:
    ldrsb r0, [r4, #11]
    cmp r0, #0
    ble .L118_func_0047D6A4_164
    ldr r0, [r4, #16]
    ldr r5, [r0, r6, lsl #2]
    cmp r5, #0
    beq .L118_func_0047D6A4_178
    ldr r0, [r5]
    ldr r1, [r0, #20]
    mov r0, r5
    blx r1
    cmp r0, #0
    beq .L118_func_0047D6A4_164
    ldr r0, [r5]
    ldr r1, [r0, #4]
    mov r0, r5
    blx r1
    ldr r1, [r4, #16]
    mov r5, #0
    str r7, [r1, r6, lsl #2]
    ldrsb r0, [r4, #10]
    cmp r0, #0
    ble .L118_func_0047D6A4_164
.L118_func_0047D6A4_134:
    ldr r0, [r4, #24]
    ldr r0, [r0, r5, lsl #2]
    cmp r0, #0
    beq .L118_func_0047D6A4_154
    ldr r1, [r0]
    ldr r2, [r1]
    mov r1, r6
    blx r2
.L118_func_0047D6A4_154:
    ldrsb r0, [r4, #10]
    add r5, r5, #1
    cmp r0, r5
    bgt .L118_func_0047D6A4_134
.L118_func_0047D6A4_164:
    ldrsh r0, [r4, #8]
    add r6, r6, #1
    cmp r0, r6
    bgt .L118_func_0047D6A4_1c
.L118_func_0047D6A4_174:
    pop {r4, r5, r6, r7, r8, pc}
.L118_func_0047D6A4_178:
    mov r2, #0
    mov r1, r2
    mov r0, r2
    mov r0, r0
    nop {0}
    nop {0}
    b .L118_func_0047D6A4_164
.L118_func_0047D6A4_body_end:
.size func_0047D6A4, .L118_func_0047D6A4_body_end - func_0047D6A4

.section .text.func_0047E0D8, "ax", %progbits
.balign 4
.global func_0047E0D8
.type func_0047E0D8, %function
func_0047E0D8:
    push {r4, r5, r6, lr}
    sub sp, sp, #8
    add ip, sp, #28
    mov r4, r0
    mov r6, r1
    ldr r1, [sp, #24]
    ldm ip, {r0, r5}
    str r1, [sp]
    str r0, [sp, #4]
    ldr r0, [r4]
    mov r1, r6
    ldr ip, [r0, #56]
    mov r0, r4
    blx ip
    cmp r0, #0
    beq .L118_func_0047E0D8_5c
    ldr r0, [r4]
    mov r1, r5
    ldr r2, [r0, #48]
    add sp, sp, #8
    mov r0, r4
    pop {r4, r5, r6, lr}
    bx r2
.L118_func_0047E0D8_5c:
    add sp, sp, #8
    pop {r4, r5, r6, pc}
.L118_func_0047E0D8_body_end:
.size func_0047E0D8, .L118_func_0047E0D8_body_end - func_0047E0D8

.section .note.GNU-stack, "", %progbits
