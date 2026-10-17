.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_0006B434, "ax", %progbits
.balign 4
.global func_0006B434
.type func_0006B434, %function
func_0006B434:
    ldr r0, [r0, #0x5CC]
    cmp r0, #0
    beq .Lreturn_0006B434
    b . + 0x5898
.Lreturn_0006B434:
    bx lr
.size func_0006B434, . - func_0006B434
