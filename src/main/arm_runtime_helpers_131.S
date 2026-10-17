.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_003CBD50, "ax", %progbits
.balign 4
.global func_003CBD50
.type func_003CBD50, %function
func_003CBD50:
    cmp r0, #85
    ldrcc r1, .L131_func_003CBD50_24
    addcc r0, r0, r0, lsl #2
    movcs r0, #0
    addcc r0, r1, r0, lsl #2
    bx lr
.L131_func_003CBD50_body_end:
.L131_func_003CBD50_24:
    .word runtime_literal_131_1
.size func_003CBD50, .L131_func_003CBD50_body_end - func_003CBD50

.section .text.func_003DB99C, "ax", %progbits
.balign 4
.global func_003DB99C
.type func_003DB99C, %function
func_003DB99C:
    ldr r2, .L131_func_003DB99C_24
    mov r1, #0
    str r1, [r0, #36]
    str r2, [r0, #32]
    str r1, [r0, #40]
    bx lr
.L131_func_003DB99C_body_end:
.L131_func_003DB99C_24:
    .word runtime_literal_131_2
.size func_003DB99C, .L131_func_003DB99C_body_end - func_003DB99C
