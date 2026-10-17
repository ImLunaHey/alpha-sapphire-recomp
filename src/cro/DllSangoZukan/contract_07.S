.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00001788, "ax", %progbits
.balign 4
.global func_00001788
.type func_00001788, %function
func_00001788:
    cmp r0, #0x2CC
    cmpeq r1, #0
    movne r0, #0
    moveq r0, #1
    bx lr
.size func_00001788, . - func_00001788

.section .text.func_00011AE0, "ax", %progbits
.balign 4
.global func_00011AE0
.type func_00011AE0, %function
func_00011AE0:
    cmp r1, #0
    ldreq r1, [r0, #0x2C]
    str r1, [r0, #0x28]
    bx lr
.size func_00011AE0, . - func_00011AE0

.section .text.func_00015D40, "ax", %progbits
.balign 4
.global func_00015D40
.type func_00015D40, %function
func_00015D40:
    add r0, r0, r1, lsl #2
    ldr r0, [r0, #0x5C]
    bx lr
.size func_00015D40, . - func_00015D40

.section .text.func_00018CB8, "ax", %progbits
.balign 4
.global func_00018CB8
.type func_00018CB8, %function
func_00018CB8:
    ldr r0, [r0, #0x20]
    ldr r0, [r0, #0xC]
    bx lr
.size func_00018CB8, . - func_00018CB8

.section .text.func_0002A718, "ax", %progbits
.balign 4
.global func_0002A718
.type func_0002A718, %function
func_0002A718:
    ldr r0, [r0, #0x70]
    cmp r0, #0
    moveq r0, #1
    movne r0, #0
    bx lr
.size func_0002A718, . - func_0002A718

.section .text.func_0002A72C, "ax", %progbits
.balign 4
.global func_0002A72C
.type func_0002A72C, %function
func_0002A72C:
    ldr r0, [r0, #0x70]
    cmp r0, #4
    moveq r0, #1
    movne r0, #0
    bx lr
.size func_0002A72C, . - func_0002A72C
