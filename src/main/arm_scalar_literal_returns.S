.syntax unified
.arm
.fpu vfpv2

.section .text.func_0020B92C,"ax",%progbits
.balign 4
.global func_0020B92C
.type func_0020B92C, %function
func_0020B92C:
    ldr r0, .Lliteral_func_0020B92C
    bx lr
.size func_0020B92C, .-func_0020B92C
.Lliteral_func_0020B92C:
    .word 0x00030003

.section .text.func_0020B938,"ax",%progbits
.balign 4
.global func_0020B938
.type func_0020B938, %function
func_0020B938:
    ldr r0, .Lliteral_func_0020B938
    bx lr
.size func_0020B938, .-func_0020B938
.Lliteral_func_0020B938:
    .word 0x00080004

.section .text.func_002CD4CC,"ax",%progbits
.balign 4
.global func_002CD4CC
.type func_002CD4CC, %function
func_002CD4CC:
    ldr r0, .Lliteral_func_002CD4CC
    bx lr
.size func_002CD4CC, .-func_002CD4CC
.Lliteral_func_002CD4CC:
    .word 0x00002370

.section .text.func_0045CECC,"ax",%progbits
.balign 4
.global func_0045CECC
.type func_0045CECC, %function
func_0045CECC:
    ldr r0, .Lliteral_func_0045CECC
    bx lr
.size func_0045CECC, .-func_0045CECC
.Lliteral_func_0045CECC:
    .word 0x0000270F

.section .text.func_0010945C,"ax",%progbits
.balign 4
.global func_0010945C
.type func_0010945C, %function
func_0010945C:
    ldr r0, .Lliteral_func_0010945C
    mov r1, #0
    bx lr
.size func_0010945C, .-func_0010945C
.Lliteral_func_0010945C:
    .word 0x000011C5

.section .text.func_00188538,"ax",%progbits
.balign 4
.global func_00188538
.type func_00188538, %function
func_00188538:
    vldr s0, .Lliteral_func_00188538
    vmul.f32 s0, s0, s0
    bx lr
.size func_00188538, .-func_00188538
.Lliteral_func_00188538:
    .word 0x10000000

.section .text.func_00195AE0,"ax",%progbits
.balign 4
.global func_00195AE0
.type func_00195AE0, %function
func_00195AE0:
    vldr d0, .Lliteral_func_00195AE0
    vmul.f64 d0, d0, d0
    bx lr
.size func_00195AE0, .-func_00195AE0
.balign 8, 0
.Lliteral_func_00195AE0:
    .word 0x00000000
    .word 0x10000000

.section .note.GNU-stack,"",%progbits
