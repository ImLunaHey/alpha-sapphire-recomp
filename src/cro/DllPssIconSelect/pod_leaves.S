.syntax unified
.arch armv6k
.arm

.section .text.func_00002E44, "ax", %progbits
.balign 4
.global func_00002E44
.type func_00002E44, %function
func_00002E44:
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    bx lr
.size func_00002E44, . - func_00002E44
