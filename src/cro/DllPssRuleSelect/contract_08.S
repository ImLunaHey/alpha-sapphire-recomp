.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00001484, "ax", %progbits
.balign 4
.global func_00001484
.type func_00001484, %function
func_00001484:
    ldr r3, [pc, #0x74]
    push {r4-r11}
    mov r12, #0
    ldr r4, [r3, r1, lsl #2]
    ldr r3, [pc, #0x68]
    cmp r4, #0
    ldrhi r11, [pc, #0x64]
    ldr r6, [r3, r1, lsl #2]
    bls .Ldone_00001484
.Lfill_00001484:
    rsb r3, r12, r12, lsl #3
    ldrb r1, [r6, r12]
    add r3, r0, r3, lsl #2
    add r12, r12, #1
    add r7, r1, #0x35
    add r5, r11, r1, lsl #3
    add r8, r1, #0x23
    vldr s0, [r5]
    add r9, r1, #0x11
    add r10, r1, #0x47
    vstr s0, [r3, #0x84]
    ldr r5, [r5, #4]
    add r1, r1, #0x59
    str r1, [r3, #0x9C]
    add r3, r3, #0x88
    cmp r4, r12
    stm r3, {r5, r7-r10}
    bhi .Lfill_00001484
.Ldone_00001484:
    str r4, [r2]
    pop {r4-r11}
    add r0, r0, #0x84
    bx lr
.size func_00001484, . - func_00001484
