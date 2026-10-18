.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_00000334, "ax", %progbits
.balign 4
.global func_00000334
.type func_00000334, %function
ASM_FUNC(func_00000334)
func_00000334:
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0, #40]
    cmp r0, #0
    subgt r0, r0, #1
    strgt r0, [r4, #40]
    ldrb r0, [r4, #37]
    cmp r0, #0
    bne .L334_finish
    ldr r0, [r4, #32]
    mov r5, #1
    ldr r0, [r0]
    ldrb r0, [r0]
    cmp r0, #1
    cmpne r0, #3
    beq .L334_case13
    cmp r0, #2
    beq .L334_case2
    ldr r1, [pc, #552]
    cmp r0, #4
    mov r6, #0
    beq .L334_case4
    cmp r0, #5
    beq .L334_case5
    cmp r0, #6
    beq .L334_case6
    cmp r0, #7
    beq .L334_case7
    cmp r0, #8
    mov r6, #3
    beq .L334_case8
    cmp r0, #9
    beq .L334_case9
    cmp r0, #10
    beq .L334_case10
    b .L334_finish
.L334_case13:
    ldr r0, [r4, #4]
    ldr r1, [r0, #116]
    cmp r1, #0
    strbne r5, [r0, #120]
    mov r0, #0
    str r0, [r4, #40]
    strb r5, [r4, #37]
    ldr r0, [r4, #4]
    mov r1, #0
    bl . - 0x3A0
    nop {0}
    nop {0}
    b .L334_finish
.L334_case2:
    mov r3, #1
    ldr r0, [r4, #4]
    mov r2, #9
    mov r1, r3
    bl . - 0x3B8
    mov r0, #180
    str r0, [r4, #40]
    strb r5, [r4, #37]
    ldr r0, [r4, #4]
    mov r1, #0
    bl . - 0x3D8
    nop {0}
    nop {0}
    b .L334_finish
.L334_case4:
    ldr r3, [r1]
    ldr r0, [r4, #4]
    mov r2, #9
    mov r1, #1
    bl . - 0x3F0
    ldr r0, [r4, #32]
    ldr r0, [r0]
    strb r6, [r0]
    b .L334_finish
.L334_case5:
    ldr r3, [r1, #4]
    ldr r0, [r4, #4]
    mov r2, #9
    mov r1, #1
    bl . - 0x414
    ldr r0, [r4, #32]
    ldr r0, [r0]
    strb r6, [r0]
    b .L334_finish
.L334_case6:
    ldr r3, [r1, #8]
    ldr r0, [r4, #4]
    mov r2, #9
    mov r1, #1
    bl . - 0x438
    ldr r0, [r4, #32]
    ldr r0, [r0]
    strb r6, [r0]
    b .L334_finish
.L334_case7:
    ldr r3, [r1, #12]
    ldr r0, [r4, #4]
    mov r2, #9
    mov r1, #1
    bl . - 0x45C
    ldr r0, [r4, #32]
    ldr r0, [r0]
    strb r6, [r0]
    b .L334_finish
.L334_case8:
    ldr r3, [r1, #16]
    ldr r0, [r4, #4]
    mov r2, #9
    mov r1, #1
    bl . - 0x480
    ldr r0, [r4, #32]
    mov r1, #0
    ldr r0, [r0]
    strb r6, [r0]
    mov r0, #180
    str r0, [r4, #40]
    strb r5, [r4, #37]
    ldr r0, [r4, #4]
    bl . - 0x4AC
    nop {0}
    nop {0}
    b .L334_finish
.L334_case9:
    ldr r3, [r1, #20]
    ldr r0, [r4, #4]
    mov r2, #9
    mov r1, #1
    bl . - 0x4C4
    ldr r0, [r4, #32]
    mov r1, #0
    ldr r0, [r0]
    strb r6, [r0]
    mov r0, #180
    str r0, [r4, #40]
    strb r5, [r4, #37]
    ldr r0, [r4, #4]
    bl . - 0x4F0
    nop {0}
    nop {0}
    b .L334_finish
.L334_case10:
    ldr r3, [r1, #24]
    ldr r0, [r4, #4]
    mov r2, #9
    mov r1, #1
    bl . - 0x508
    ldr r0, [r4, #32]
    mov r1, #0
    ldr r0, [r0]
    strb r6, [r0]
    mov r0, #180
    str r0, [r4, #40]
    strb r5, [r4, #37]
    ldr r0, [r4, #4]
    bl . - 0x534
.L334_finish:
    ldr r0, [r4, #40]
    cmp r0, #0
    bne .L334_return
    mov r3, #0
    mov r2, #8
    mov r1, r3
    mov r0, #2
    bl . - 0x544
    mov r0, #2
    strb r0, [r4, #36]
.L334_return:
    pop {r4, r5, r6, pc}
.size func_00000334, . - func_00000334

.section .text.func_00000A2C, "ax", %progbits
.balign 4
.global func_00000A2C
.type func_00000A2C, %function
ASM_FUNC(func_00000A2C)
func_00000A2C:
    push {r4, r5, r6, r7, r8, r9, r10, r11, lr}
    sub sp, sp, #36
    mov r8, r2
    mov r7, r3
    mov r5, r1
    ldr r2, [r1, #16]
    ldr r6, [sp, #72]
    mov r3, r2
    bl . - 0x964
    mov r4, r0
    ldr r0, [pc, #352]
    mov r9, #0
    mov r2, r9
    str r0, [r4]
    str r9, [r4, #116]
    strb r9, [r4, #120]
    mov r1, r5
    mov r0, r4
    str r5, [r4, #124]
    bl . - 0x988
    ldr r10, [pc, #316]
    mov r2, #8
    mov r3, #142
    mov r12, #2
    str r10, [sp, #8]
    mov r11, #1
    sub lr, r10, #20
    str r3, [sp, #16]
    str r9, [sp, #20]
    str r2, [sp, #28]
    str r9, [sp, #24]
    mov r0, r4
    mov r1, r5
    mov r3, r12
    mov r2, #0
    str r12, [sp, #12]
    str r11, [sp, #4]
    str lr, [sp]
    bl . - 0x9CC
    cmp r7, #0
    beq .La2c_after_optional
    mov r1, #26
    add r0, r4, #128
    bl . - 0x9D8
    mov r2, #26
    mov r1, r7
    add r0, r4, #128
    bl . - 0x9E0
    mov r3, #1
    ldr r0, [r4, #92]
    mov r2, #14
    mov r1, r3
    bl . - 0x9EC
    cmp r6, #0
    cmpne r6, #1
    ldr r2, [r5, #4]
    movne r6, #2
    add r1, r4, #128
    add r0, sp, #8
    bl . - 0xA00
    str r9, [sp]
    ldr r0, [r4, #92]
    mov r3, r6
    add r2, sp, #8
    mov r1, #0
    bl . - 0xA10
    mov r3, #10
    mov r2, #12
    mov r1, #1
    mov r0, r4
    bl . - 0xAF4
    add r0, sp, #8
    bl . - 0xA24
.La2c_after_optional:
    mov r3, #6
    mov r2, #25
    mov r1, #0
    mov r0, r4
    bl . - 0xB10
    ldr r0, [r4, #92]
    cmp r8, #0
    beq .La2c_disabled
    mov r3, #0
    mov r2, #25
    mov r1, r3
    bl . - 0xA6C
.La2c_finalize:
    mov r3, #0
    mov r2, #9
    mov r1, #1
    mov r0, r4
    bl . - 0xB40
    add sp, sp, #36
    mov r0, r4
    pop {r4, r5, r6, r7, r8, r9, r10, r11, pc}
.La2c_disabled:
    mov r3, #1
    mov r2, #25
    mov r1, #0
    bl . - 0xA9C
    nop {0}
    nop {0}
    b .La2c_finalize
.size func_00000A2C, . - func_00000A2C
