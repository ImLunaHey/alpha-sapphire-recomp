.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_001947D8, "ax", %progbits
.balign 4
.global func_001947D8
.type func_001947D8, %function
func_001947D8:
    vmov s0, r0
    vcvt.u32.f32 s2, s0
    vmov r0, s2
    bx lr
.size func_001947D8, . - func_001947D8

.section .text.func_00205870, "ax", %progbits
.balign 4
.global func_00205870
.type func_00205870, %function
func_00205870:
    mov r1, #0
    strb r1, [r0, #529]
    bx lr
.size func_00205870, . - func_00205870

.section .text.func_0031001C, "ax", %progbits
.balign 4
.global func_0031001C
.type func_0031001C, %function
func_0031001C:
    mov r1, #0
    str r1, [r0, #12]
    bx lr
.size func_0031001C, . - func_0031001C

.section .text.func_0032EC70, "ax", %progbits
.balign 4
.global func_0032EC70
.type func_0032EC70, %function
func_0032EC70:
    ldr r0, [r0, #8]
    cmp r0, #0
    movne r0, #1
    bx lr
.size func_0032EC70, . - func_0032EC70

.section .text.func_003AB384, "ax", %progbits
.balign 4
.global func_003AB384
.type func_003AB384, %function
func_003AB384:
    mov r3, #1
    strb r3, [r0, #8]
    mov r2, #0
    str r1, [r0, #12]
    strb r2, [r0, #10]
    mov r0, r1
    bx lr
.size func_003AB384, . - func_003AB384

.section .note.GNU-stack, "", %progbits
