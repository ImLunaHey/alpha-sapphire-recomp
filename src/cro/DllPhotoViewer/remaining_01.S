.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_00000F20, "ax", %progbits
.balign 4
.global func_00000F20
.type func_00000F20, %function
ASM_FUNC(func_00000F20)
func_00000F20:
    push {r4, r5, r6, r7, lr}
    mov r6, r2
    mov r3, #0
    sub sp, sp, #132
    mov r5, r1
    mov r2, r3
    bl . - 0xDE0
    mov r4, r0
    ldr r0, [pc, #556]
    mov r7, #0
    mov r2, #1
    str r0, [r4]
    str r5, [r4, #116]
    strb r7, [r4, #120]
    str r7, [r4, #128]
    strb r7, [r4, #132]
    strb r7, [r4, #133]
    strb r7, [r4, #134]
    strd r6, [r4, #136]
    str r7, [r4, #144]
    mov r1, r5
    mov r0, r4
    str r7, [r4, #148]
    bl . - 0xE1C
    ldr r3, [pc, #496]
    mov r1, r5
    mov r5, #91
    str r3, [sp, #8]
    mov r2, #2
    str r5, [sp, #16]
    mov r0, #9
    sub r5, r3, #60
    str r2, [sp, #12]
    str r0, [sp, #28]
    mov r12, #3
    mov r6, #1
    mov r3, r2
    stm sp, {r5, r12}
    mov r2, #0
    mov r0, r4
    strd r6, [sp, #20]
    bl . - 0xE5C
    mov r1, #0
    mov r0, r4
    bl . - 0x508
    bl . - 0xF64
    bl . - 0xE68
    ldr r2, [r4, #116]
    mov r1, r0
    sub r3, r5, #356
    stm sp, {r2, r7}
    ldr r0, [r4, #92]
    mov r2, #0
    bl . - 0xE7C
    mov r0, r4
    bl . - 0xE7C
    ldr r1, [r4, #116]
    sub r2, r5, #348
    add r3, sp, #4
    str r2, [sp]
    stm r3, {r1, r7}
    mov r3, #0
    ldr r12, [r4, #92]
    mov r1, r0
    mov r2, r3
    mov r0, r12
    bl . - 0xEA0
    mov r1, #1
    mov r0, r4
    bl . - 0xEA4
    mov r1, #1
    bl . - 0xEA4
    mov r1, #0
    mov r0, r4
    bl . - 0xEB8
    mov r1, #0
    bl . - 0xEB8
    mov r1, #1
    mov r0, r4
    bl . - 0xECC
    mov r1, #0
    bl . - 0xEC4
    mov r1, #0
    mov r0, r4
    bl . - 0xEE0
    mov r1, #0
    bl . - 0xED8
    mov r2, #0
    str r6, [sp]
    ldr r0, [r4, #92]
    mov r3, #1
    mov r1, r2
    bl . - 0xEE8
    vldr s0, [pc, #224]
    mov r5, #16
    vstr s0, [sp, #76]
    vstr s0, [sp, #80]
    vstr s0, [sp, #84]
    mvn r0, #0
    strb r6, [sp, #112]
    str r5, [sp, #100]
    strb r6, [sp, #104]
    str r0, [sp, #108]
    strb r6, [sp, #113]
    ldr r0, [r4, #116]
    ldr r0, [r0, #4]
    str r0, [sp, #88]
    ldr r0, [r4, #116]
    ldr r0, [r0, #8]
    str r0, [sp, #92]
    ldr r0, [r4, #116]
    ldr r0, [r0, #16]
    str r0, [sp, #96]
    mov r0, r4
    bl . - 0xF68
    str r0, [sp, #32]
    mov r0, r4
    bl . - 0xF44
    str r0, [sp, #36]
    ldr r0, [r4, #92]
    mov r1, #0
    bl . - 0xF4C
    vldmia r0, {s0-s7}
    add r2, sp, #40
    mov r3, #42
    mov r1, r4
    vstmia r2, {s0-s7}
    mov r2, #0
    ldr r0, [r0, #32]
    str r5, [sp, #100]
    str r0, [sp, #72]
    add r0, sp, #116
    bl . - 0xF70
    add r3, sp, #116
    ldm r3, {r0, r1, r2}
    add r3, sp, #76
    stm r3, {r0, r1, r2}
    strb r7, [sp, #104]
    ldr r0, [r4, #116]
    ldr r1, [r0, #4]
    mov r0, #128
    bl . - 0x114C
    cmp r0, #0
    addne r1, sp, #32
    blne . - 0xF98
    str r0, [r4, #128]
    add sp, sp, #132
    mov r0, r4
    pop {r4, r5, r6, r7, pc}
.size func_00000F20, . - func_00000F20
