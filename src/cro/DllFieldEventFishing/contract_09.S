.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00001058, "ax", %progbits
.balign 4
.global func_00001058
.type func_00001058, %function
func_00001058:
    push {r4, r5, r6, r7, r8, r9, lr}
    mov r4, #0
    mov r5, r0
    mov r6, r1
    mov r7, r2
    vpush {d8}
    sub sp, sp, #0xC
    vldr s16, [pc, #0x9C]
    mov r8, r4
    mvn r9, #0
.Lloop_00001058:
    str r8, [sp, #8]
    stm sp, {r4, r9}
    ldr r0, [r5, #0xC4]
    mov r3, #0
    mov r2, r3
    ldr r1, [r0]
    ldr r12, [r1, #0x108]
    mov r1, r3
    blx r12
    str r8, [sp, #8]
    stm sp, {r4, r9}
    ldr r0, [r5, #0xC4]
    add r1, r6, r4
    add r2, r5, r1, lsl #2
    ldr r3, [r0]
    ldr r1, [r5, #0x5C]
    ldr r2, [r2, #0x64]
    ldr r12, [r3, #0x108]
    mov r3, #0
    blx r12
    ldr r0, [r5, #0xC4]
    vmov.f32 s0, s16
    ldr r1, [r0]
    ldr r2, [r1, #0xD4]
    mov r1, r4
    blx r2
    ldr r0, [r5, #0xC4]
    mov r2, r4
    ldr r1, [r0]
    ldr r3, [r1, #0x100]
    mov r1, r7
    blx r3
    add r4, r4, #1
    cmp r4, #4
    blt .Lloop_00001058
    add sp, sp, #0xC
    vpop {d8}
    pop {r4, r5, r6, r7, r8, r9, pc}
.size func_00001058, . - func_00001058
