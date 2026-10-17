.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00108CB0, "ax", %progbits
.balign 4
.global func_00108CB0
.type func_00108CB0, %function
func_00108CB0:
    ldr r2, [r0]
    str r2, [r1, #4]
    str r1, [r0]
    bx lr
.size func_00108CB0, . - func_00108CB0

.section .text.func_0011ECD4, "ax", %progbits
.balign 4
.global func_0011ECD4
.type func_0011ECD4, %function
func_0011ECD4:
    ldr r0, [r0, #16]
    cmp r0, #0
    strbne r1, [r0]
    bx lr
.size func_0011ECD4, . - func_0011ECD4

.section .text.func_0014648C, "ax", %progbits
.balign 4
.global func_0014648C
.type func_0014648C, %function
func_0014648C:
    ldr r2, [r0, #12]
    orr r1, r1, r2
    str r1, [r0, #12]
    bx lr
.size func_0014648C, . - func_0014648C

.section .text.func_00161460, "ax", %progbits
.balign 4
.global func_00161460
.type func_00161460, %function
func_00161460:
    str r1, [r0, #4]
    ldr r1, [r2]
    mov r3, #1
    str r1, [r0, #8]
    strb r3, [r0, #12]
    bx lr
.size func_00161460, . - func_00161460

.section .text.func_0016C090, "ax", %progbits
.balign 4
.global func_0016C090
.type func_0016C090, %function
func_0016C090:
    ldr r2, [r1]
    str r2, [r0]
    ldrb r3, [r1, #4]
    strb r3, [r0, #4]
    bx lr
.size func_0016C090, . - func_0016C090

.section .note.GNU-stack, "", %progbits
