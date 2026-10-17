.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00361064, "ax", %progbits
.balign 4
.global func_00361064
.type func_00361064, %function
func_00361064:
    ldr r2, .L129_func_00361064_36
    mov r1, #0
    str r1, [r0, #4]
    str r2, [r0]
    str r1, [r0, #8]
    str r1, [r0, #12]
    str r1, [r0, #16]
    strb r1, [r0, #20]
    bx lr
.L129_func_00361064_body_end:
.L129_func_00361064_36:
    .word runtime_literal_129_1
.size func_00361064, .L129_func_00361064_body_end - func_00361064

.section .text.func_0036F240, "ax", %progbits
.balign 4
.global func_0036F240
.type func_0036F240, %function
func_0036F240:
    ldr r1, .L129_func_0036F240_24
    mov r2, #0
    stmia r0, {r1, r2}
    ldr r2, .L129_func_0036F240_28
    str r2, [r0, #8]
    bx lr
.L129_func_0036F240_body_end:
.L129_func_0036F240_24:
    .word runtime_literal_129_2
.L129_func_0036F240_28:
    .word runtime_literal_129_3
.size func_0036F240, .L129_func_0036F240_body_end - func_0036F240
