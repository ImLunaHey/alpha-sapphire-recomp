.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_000109B4, "ax", %progbits
.balign 4
.global func_000109B4
.type func_000109B4, %function
ASM_FUNC(func_000109B4)
func_000109B4:
    push {r4, r5, r6, r7, lr}
    add r5, r0, #4
    mov r4, r0
    str r5, [r1]
    mov r0, #1
    str r5, [r1, #4]
    strb r0, [r1, #12]
    ldr r0, [r4, #20]
    cmp r0, r5
    ldrne r0, [r0]
    cmpne r0, r1
    streq r1, [r4, #20]
    ldr r0, [r4, #24]
    cmp r0, r5
    ldrne r0, [r0, #4]
    cmpne r0, r1
    streq r1, [r4, #24]
    ldr r0, [r4, #28]
    add r0, r0, #1
    str r0, [r4, #28]
    ldr r6, [r1, #8]
    cmp r6, r5
    beq .L109b4_finish
.L109b4_loop:
    ldr r0, [r6]
    cmp r0, r1
    moveq r7, r6
    addne r7, r6, #4
    mov r0, r7
    bl . - 0x236C
    mov r0, r7
    nop
    bl . - 0x23D8
    mov r1, r6
    ldr r6, [r6, #8]
    cmp r6, r5
    bne .L109b4_loop
.L109b4_finish:
    mov r0, r4
    bl . - 0x2390
    mov r0, r4
    nop
    bl . - 0x23FC
    ldr r0, [r4]
    str r0, [r4, #12]
    pop {r4, r5, r6, r7, pc}
.size func_000109B4, . - func_000109B4

.section .text.func_00011FF8, "ax", %progbits
.balign 4
.global func_00011FF8
.type func_00011FF8, %function
ASM_FUNC(func_00011FF8)
func_00011FF8:
    cmp r0, #0
    bxlt lr
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r5, [pc, #152]
    vpush {d8}
    ldr r0, [r5, #48]
    cmp r4, r0
    bcs .L11ff8_return
    ldr r0, [pc, #136]
    bl . - 0x12020
    ldr r0, [r5, #12]
    rsb r1, r4, r4, lsl #3
    add r4, r0, r1, lsl #4
    bl . - 0x11E90
    strd r0, r1, [r4, #104]
    ldr r0, [r4]
    ldr r1, [r4, #64]
    bl . - 0x11E98
    ldr r0, [r4]
    mov r1, #1
    bl . - 0x11E9C
    ldr r0, [r4]
    add r1, r4, #8
    bl . - 0x11EA0
    ldr r0, [r4]
    ldr r1, [r4, #60]
    bl . - 0x11EA4
    vldr s16, [pc, #64]
    ldr r0, [r4]
    vmov.f32 s0, s16
    bl . - 0x11EAC
    vmov.f32 s0, s16
    ldr r0, [r4]
    bl . - 0x11EB0
    ldr r0, [r4]
    mov r1, #0
    bl . - 0x12004
    vpop {d8}
    ldr r0, [pc, #16]
    pop {r4, r5, r6, lr}
    b . - 0x12094
.L11ff8_return:
    vpop {d8}
    pop {r4, r5, r6, pc}
.size func_00011FF8, . - func_00011FF8

.section .text.func_00012244, "ax", %progbits
.balign 4
.global func_00012244
.type func_00012244, %function
ASM_FUNC(func_00012244)
func_00012244:
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0, #12]
    sub sp, sp, #16
    cmp r0, #6
    moveq r0, #1
    beq .L12244_return
    ldr r0, [r4, #12]
    cmp r0, #3
    movne r0, #0
    bne .L12244_return
    bl . - 0x120D0
    ldr r2, [pc, #124]
    asr r5, r1, #31
    mov r3, #0
    umull r12, r6, r1, r2
    mla r5, r5, r2, r6
    mla r3, r1, r3, r5
    mov r5, #3
    umlal r12, r3, r5, r0
    umull r2, r0, r0, r2
    umull r1, r5, r1, r5
    mov r2, #0
    adds r0, r0, r2
    adc r1, r1, r2
    adds r0, r0, r12
    adc r1, r1, r3
    strd r0, r1, [sp, #8]
    mov r1, #7
    ldr r2, [pc, #60]
    ldr r3, [pc, #60]
    add r0, sp, #8
    str r1, [sp]
    bl . + 0x700
    add r2, r4, #336
    mov r5, #6
    stm r2, {r0, r1}
    mov r0, r4
    bl . - 0x122DC
    str r5, [r4, #12]
    mov r0, r4
    bl . - 0x122E0
    mov r0, #1
.L12244_return:
    add sp, sp, #16
    pop {r4, r5, r6, pc}
.size func_00012244, . - func_00012244

.section .text.func_00012F48, "ax", %progbits
.balign 4
.global func_00012F48
.type func_00012F48, %function
ASM_FUNC(func_00012F48)
func_00012F48:
    push {r4, r5, r6, lr}
    mov r4, r0
    movs r0, r1
    mov r5, r2
    cmpne r5, #0
    addne r1, r4, #4
    ldr r6, [sp, #16]
    stmne r1, {r0, r5}
    moveq r0, #0
    beq .L12f48_return
    add r1, r5, #8
    ldm r1, {r1, r2}
    mul r1, r1, r2
    mul r1, r1, r3
    lsl r1, r1, #1
    str r1, [r4, #20]
    ldr r2, [r0]
    ldr r3, [r2, #8]
    mov r2, #32
    blx r3
    cmp r0, #0
    str r0, [r4, #16]
    beq .L12f48_return
    ldrd r0, r1, [r5, #8]
    mov r2, r6
    bl . - 0x54E0
    cmn r0, #1
    mov r5, #0
    str r0, [r4, #12]
    beq .L12f48_release
    mov r1, #0
    str r1, [r4, #24]!
    add r4, r4, #4
    mov r0, r1
    stm r4, {r0, r5}
    mov r0, #1
.L12f48_return:
    pop {r4, r5, r6, pc}
.L12f48_release:
    ldr r0, [r4, #4]
    ldr r1, [r4, #16]
    ldr r2, [r0]
    ldr r2, [r2, #12]
    blx r2
    mov r0, #0
    str r5, [r4, #16]
    pop {r4, r5, r6, pc}
.size func_00012F48, . - func_00012F48

.section .text.func_0001966C, "ax", %progbits
.balign 4
.global func_0001966C
.type func_0001966C, %function
ASM_FUNC(func_0001966C)
func_0001966C:
    push {r4, r5, r6, lr}
    add r5, r0, #5120
    add r5, r5, #28
    sub sp, sp, #8
    ldr r0, [r5, #20]
    mov r6, #0
    ldr r4, [r0, #8]
.L1966c_loop:
    ldr r0, [r5, #20]
    mov r1, r4
    cmp r4, r0
    beq .L1966c_return
    ldr r0, [r1, #12]
    cmp r0, #0
    beq .L1966c_parent
.L1966c_descend:
    mov r4, r0
    ldr r0, [r0, #8]
    cmp r0, #0
    bne .L1966c_descend
    b .L1966c_entry
.L1966c_parent:
    ldr r0, [r4, #4]
    ldr r3, [r0, #12]
    cmp r1, r3
    bne .L1966c_check
.L1966c_ascend:
    mov r4, r0
    ldr r0, [r0, #4]
    ldr r2, [r0, #12]
    cmp r4, r2
    beq .L1966c_ascend
.L1966c_check:
    ldr r2, [r4, #12]
    cmp r2, r0
    movne r4, r0
.L1966c_entry:
    ldr r0, [r1, #24]
    ldr r0, [r0, #16]
    ldrb r2, [r0, #104]
    cmp r2, #0
    ldreq r2, [r0, #56]
    cmpeq r2, #0
    strbne r6, [r0, #104]
    bne .L1966c_loop
    str r1, [sp]
    mov r2, sp
    mov r1, r5
    add r0, sp, #4
    bl . - 0x9EC4
    nop
    nop
    b .L1966c_loop
.L1966c_return:
    add sp, sp, #8
    pop {r4, r5, r6, pc}
.size func_0001966C, . - func_0001966C
