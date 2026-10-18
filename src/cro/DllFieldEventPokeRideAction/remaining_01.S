.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_00000158, "ax", %progbits
.balign 4
.global func_00000158
.type func_00000158, %function
ASM_FUNC(func_00000158)
func_00000158:
    push {r4, r5, r6, r7, r8, r9, sl, fp, lr}
    mov r4, r0
    mov r6, r2
    vpush {d8}
    sub sp, sp, #52
    ldrb r0, [r0, #44]
    cmp r0, #0
    moveq r0, #1
    beq .L0220
    ldr r0, [r4, #32]
    add r1, r4, #64
    bl . - 0x184
    cmp r0, #0
    beq .L0220
    ldr r1, [r4, #64]
    add r0, r4, #68
    bl . - 0x190
    ldr r8, [pc, #480]
    mov r5, #0
    mov sl, r5
    mov r7, #1
.L0054:
    ldr r1, [r8, r5, lsl #2]
    add r0, r4, #68
    bl . - 0x1A4
    add r2, r4, r5, lsl #6
    add ip, r2, #72
    mov r2, r0
    str r7, [sp, #4]
    str sl, [sp]
    ldr r1, [r4, #60]
    mov r3, #0
    mov r0, ip
    bl . - 0x1C0
    cmp r0, #0
    nop {0}
    bne .L00a0
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl . - 0x1D4
.L00a0:
    add r5, r5, #1
    cmp r5, #6
    bcc .L0054
    add r1, sp, #20
    mov r0, #4
    strb sl, [sp, #8]
    str sl, [sp, #12]
    str sl, [sp, #16]
    stm r1, {r0, sl}
    mov r0, #5
    add r1, sp, #8
    str sl, [sp, #28]
    str sl, [sp, #40]
    str sl, [sp, #44]
    str sl, [sp, #32]
    str r7, [sp, #48]
    str r0, [sp, #36]
    str r1, [sp, #4]
    str sl, [sp]
    ldr r1, [r4, #60]
    add r3, r4, #72
    add r0, r4, #644
    mov r2, r1
    bl . - 0x22C
    mov r1, r6
    add r0, r4, #644
    bl . - 0x230
    vldr s16, [pc, #284]
    vldr s17, [pc, #284]
    mov r5, #0
    mvn fp, #0
.L011c:
    add r6, r5, #1
    add r9, r4, r5
    add r7, r4, r6, lsl #6
    add r0, r7, #72
    strb sl, [r9, #636]
    bl . - 0x250
    cmp r0, #0
    movgt r1, #1
    bgt .L0168
    add r0, r7, #72
    bl . - 0x25C
    cmp r0, #0
    movgt r1, #2
    bgt .L0168
    add r0, r7, #72
    bl . - 0x268
    cmp r0, #0
    movgt r1, #3
    ble .L0200
.L0168:
    add r0, r5, r5, lsl #3
    mov r2, #0
    add r8, r4, r0, lsl #2
    add r0, r7, #72
    add r3, r8, #456
    bl . - 0x284
    str sl, [sp, #8]
    stm sp, {r5, fp}
    ldr r1, [r4, #60]
    add r2, r8, #456
    mov r3, #0
    add r0, r4, #644
    bl . - 0x298
    vmov.f32 s0, s16
    mov r1, r5
    add r0, r4, #644
    bl . - 0x2A0
    vmov.f32 s0, s16
    mov r1, r5
    add r0, r4, #644
    bl . - 0x2A8
    cmp r6, #5
    movne r0, #1
    strbne r0, [r9, #636]
    bne .L0200
    ldr r0, [r4, #36]
    ldr r0, [r0, #12]
    ldr r0, [r0, #2596]
    cmp r0, #0
    beq .L0200
    bl . - 0x2C8
    sub r1, r0, #4096
    subs r1, r1, #7
    bne .L0200
    vmov.f32 s0, s17
    mov r1, r5
    add r0, r4, #644
    bl . - 0x2F4
.L0200:
    add r5, r5, #1
    cmp r5, #5
    bcc .L011c
    vstr s16, [r4, #856]
    vldr s0, [pc, #32]
    mov r0, #1
    vstr s0, [r4, #860]
    strb r0, [r4, #45]
.L0220:
    add sp, sp, #52
    vpop {d8}
    pop {r4, r5, r6, r7, r8, r9, sl, fp, pc}
.size func_00000158, . - func_00000158

