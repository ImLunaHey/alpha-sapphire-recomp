.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_002067AC, "ax", %progbits
.balign 4
.global func_002067AC
.type func_002067AC, %function
func_002067AC:
    ldr r1, .L124_func_002067AC_32
    mov r2, #0
    str r1, [r0]
    str r2, [r0, #4]
    mov r1, #2
    str r2, [r0, #8]
    strb r1, [r0, #5]
    bx lr
.L124_func_002067AC_body_end:
.L124_func_002067AC_32:
    .word runtime_literal_124_1
.size func_002067AC, .L124_func_002067AC_body_end - func_002067AC

.section .text.func_002354CC, "ax", %progbits
.balign 4
.global func_002354CC
.type func_002354CC, %function
func_002354CC:
    str r2, [r1, #116]
    ldr r1, .L124_func_002354CC_28
    mov r2, #111
    str r1, [r0], #4
    ldr r1, .L124_func_002354CC_32
    stm r0, {r1, r2}
    bx lr
.L124_func_002354CC_body_end:
.L124_func_002354CC_28:
    .word runtime_literal_124_2
.L124_func_002354CC_32:
    .word runtime_literal_124_3
.size func_002354CC, .L124_func_002354CC_body_end - func_002354CC

.section .text.func_002354F0, "ax", %progbits
.balign 4
.global func_002354F0
.type func_002354F0, %function
func_002354F0:
    str r2, [r1, #108]
    ldr r1, .L124_func_002354F0_28
    mov r2, #111
    str r1, [r0], #4
    ldr r1, .L124_func_002354F0_32
    stm r0, {r1, r2}
    bx lr
.L124_func_002354F0_body_end:
.L124_func_002354F0_28:
    .word runtime_literal_124_2
.L124_func_002354F0_32:
    .word runtime_literal_124_3
.size func_002354F0, .L124_func_002354F0_body_end - func_002354F0

.section .text.func_0023793C, "ax", %progbits
.balign 4
.global func_0023793C
.type func_0023793C, %function
func_0023793C:
    ldr r3, .L124_func_0023793C_32
    mov r2, #0
    str r3, [r0]
    strb r2, [r0, #8]
    str r2, [r0, #4]
    str r2, [r0, #12]
    strb r1, [r0, #16]
    bx lr
.L124_func_0023793C_body_end:
.L124_func_0023793C_32:
    .word runtime_literal_124_4
.size func_0023793C, .L124_func_0023793C_body_end - func_0023793C
