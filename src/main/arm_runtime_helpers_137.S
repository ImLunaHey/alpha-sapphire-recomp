.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_004B2644, "ax", %progbits
.balign 4
.global func_004B2644
.type func_004B2644, %function
func_004B2644:
    ldrb r1, [r0, #4]
    cmp r1, #0
    beq .L137_func_004B2644_zero
    ldr r0, [r0]
    ldrb r1, [r0, #68]
    cmp r1, #0
    ldrheq r0, [r0, #24]
    beq .L137_func_004B2644_return
.L137_func_004B2644_zero:
    mov r0, #0
.L137_func_004B2644_return:
    bx lr
.size func_004B2644, . - func_004B2644

.section .text.func_004B2674, "ax", %progbits
.balign 4
.global func_004B2674
.type func_004B2674, %function
func_004B2674:
    ldrb r1, [r0, #4]
    cmp r1, #0
    beq .L137_func_004B2674_zero
    ldr r0, [r0]
    ldrb r1, [r0, #68]
    cmp r1, #0
    ldrheq r0, [r0, #26]
    beq .L137_func_004B2674_return
.L137_func_004B2674_zero:
    mov r0, #0
.L137_func_004B2674_return:
    bx lr
.size func_004B2674, . - func_004B2674
