.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00000FA4, "ax", %progbits
.balign 4
.global func_00000FA4
.type func_00000FA4, %function
func_00000FA4:
    push {r4-r6, lr}
    mov r4, r0
    ldr r5, [r0, #0xCC]!
    add r0, r0, #8
    sub sp, sp, #0x10
    ldm r0, {r0, r6}
    mov r1, r5
    sub r0, r6, r0
    bl . - 0xF44
    ldr r1, [r4, #0xC8]
    ldr r2, [r4, #0xD0]
    vldr s0, [pc, #0x64]
    add r1, r1, #1
    add r0, r0, r2
    cmp r1, r5
    str r0, [r4, #0xD0]
    movlt r6, r0
    vmov.f32 s2, s0
    vmov.f32 s1, s0
    str r1, [r4, #0xC8]
    mov r0, sp
    str r6, [r4, #0xD0]
    vstmia r0, {s0-s2}
    vldr s0, [r4, #0xD0]
    vldr s1, [pc, #0x34]
    vcvt.f32.s32 s0, s0
    vmul.f32 s0, s0, s1
    vstr s0, [sp, #4]
    ldr r0, [r4, #0xDC]
    cmp r0, #0
    movne r1, sp
    blne . - 0xFE8
    ldr r0, [r4, #0xDC]
    ldr r1, [r0]
    ldr r1, [r1, #8]
    blx r1
    add sp, sp, #0x10
    pop {r4-r6, pc}
.size func_00000FA4, . - func_00000FA4
