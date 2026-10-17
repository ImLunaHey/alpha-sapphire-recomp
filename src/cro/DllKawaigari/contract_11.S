.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00000C78, "ax", %progbits
.balign 4
.global func_00000C78
.type func_00000C78, %function
func_00000C78:
    ldr r1, [pc, #4]
    mov r0, #0
    b . - 0xC78
.size func_00000C78, . - func_00000C78
