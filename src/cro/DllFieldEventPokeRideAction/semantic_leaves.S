.syntax unified
.arch armv6k
.arm

.macro FUNCTION_BEGIN name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
.endm

.macro FUNCTION_END name
.size \name, . - \name
.endm

FUNCTION_BEGIN func_00000394
    add r0, r0, #0x24
    stmia r0, {r1, r2}
    bx lr
FUNCTION_END func_00000394

FUNCTION_BEGIN func_000003A0
    mov r0, #1
    bx lr
FUNCTION_END func_000003A0
