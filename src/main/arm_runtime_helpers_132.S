.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0056AF60, "ax", %progbits
.balign 4
.global func_0056AF60
.type func_0056AF60, %function
func_0056AF60:
    add r1, r0, #12
    str r1, [r0, #4]
    mov r2, #32
    ldr r1, .L132_func_0056AF60_60
    str r2, [r0, #8]
    ldr r1, [r0, #4]
    mov r3, #0
    sub r1, r1, #1
    strb r3, [r2, r1]
    ldr r1, [r0, #4]
    ldr r2, .L132_func_0056AF60_64
    strb r3, [r1]
    ldr r1, .L132_func_0056AF60_68
    str r1, [r0]
    bx lr
.L132_func_0056AF60_body_end:
.L132_func_0056AF60_60:
    .word runtime_literal_132_1
.L132_func_0056AF60_64:
    .word runtime_literal_132_2
.L132_func_0056AF60_68:
    .word runtime_literal_132_3
.size func_0056AF60, .L132_func_0056AF60_body_end - func_0056AF60
