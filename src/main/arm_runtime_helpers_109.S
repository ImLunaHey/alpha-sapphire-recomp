.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00175D58, "ax", %progbits
.balign 4
.global func_00175D58
.type func_00175D58, %function
func_00175D58:
    add r0, r0, #4
    vstmia r0, {s0-s3}
    bx lr
.size func_00175D58, . - func_00175D58

.section .text.func_001767C0, "ax", %progbits
.balign 4
.global func_001767C0
.type func_001767C0, %function
func_001767C0:
    ldr r1, [r0, #44]
    add r0, r0, r1
    bx lr
.size func_001767C0, . - func_001767C0

.section .text.func_00187DA0, "ax", %progbits
.balign 4
.global func_00187DA0
.type func_00187DA0, %function
func_00187DA0:
    str r1, [r0, #28]
    add r1, r1, r2
    str r1, [r0, #32]
    bx lr
.size func_00187DA0, . - func_00187DA0

.section .text.func_00187DB0, "ax", %progbits
.balign 4
.global func_00187DB0
.type func_00187DB0, %function
func_00187DB0:
    mov r1, #0
    strb r1, [r0, #128]
    strb r1, [r0, #120]
    mov r2, #1
    str r1, [r0, #124]
    strb r2, [r0, #5]
    bx lr
.size func_00187DB0, . - func_00187DB0

.section .text.func_0018C008, "ax", %progbits
.balign 4
.global func_0018C008
.type func_0018C008, %function
func_0018C008:
    add r0, r0, r1, lsl #1
    ldrb r1, [r0, r2]
    cmp r1, #0
    moveq r1, #1
    strbeq r1, [r0, r2]
    movne r0, #0
    moveq r0, r1
    bx lr
.size func_0018C008, . - func_0018C008

.section .note.GNU-stack, "", %progbits
