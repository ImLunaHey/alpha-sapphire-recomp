.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_000018B8, "ax", %progbits
.balign 4
.global func_000018B8
.type func_000018B8, %function
func_000018B8:
    push {r4-r6, lr}
    ldr r0, [r0, #0x18]
    bl . - 0x1850
    ldr r4, [pc, #0x6C]
    mov r1, #0
    mov r5, r1
    ldr r2, [r4]
    cmp r2, r0
    movne r1, #1
    beq .Lfound_000018B8
.Lscan_000018B8:
    add r2, r1, r1, lsl #2
    ldr r3, [r4, r2, lsl #2]
    cmp r3, r0
    beq .Lfound_000018B8
    add r2, r4, r2, lsl #2
    ldr r2, [r2, #0x14]
    cmp r2, r0
    bne .Ladvance_000018B8
    add r1, r1, #1
    b .Lfound_000018B8
.Ladvance_000018B8:
    add r1, r1, #2
    cmp r1, #9
    bcc .Lscan_000018B8
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl . - 0x18A8
    mov r1, r5
.Lfound_000018B8:
    add r0, r1, r1, lsl #2
    add r0, r4, r0, lsl #2
    ldr r0, [r0, #0xC]
    pop {r4-r6, pc}
.size func_000018B8, . - func_000018B8
