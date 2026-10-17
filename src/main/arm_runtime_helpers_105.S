.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00109434, "ax", %progbits
.balign 4
.global func_00109434
.type func_00109434, %function
func_00109434:
    ldr r3, [pc, #28]
    mov r2, #0
    str r2, [r0, #4]
    str r3, [r0]
    str r2, [r0, #8]
    str r2, [r0, #16]
    str r1, [r0, #12]
    str r2, [r0, #20]
    bx lr
.Lfunc_00109434_body_end:
    .word runtime_record_descriptor_105_a
.size func_00109434, .Lfunc_00109434_body_end - func_00109434

.section .text.func_0010ABF8, "ax", %progbits
.balign 4
.global func_0010ABF8
.type func_0010ABF8, %function
func_0010ABF8:
    ldr r3, [pc, #32]
    mov r2, #0
    str r2, [r0, #16]
    str r3, [r0]
    strb r2, [r0, #8]
    strb r2, [r0, #9]
    strb r2, [r0, #10]
    str r1, [r0, #4]
    str r2, [r0, #12]
    bx lr
.Lfunc_0010ABF8_body_end:
    .word runtime_record_descriptor_105_b
.size func_0010ABF8, .Lfunc_0010ABF8_body_end - func_0010ABF8

.section .text.func_001135C8, "ax", %progbits
.balign 4
.global func_001135C8
.type func_001135C8, %function
func_001135C8:
    str r1, [r0, #12]
    ldr r1, [pc, #20]
    mov r2, #33
    mov r3, #171
    str r1, [r0, #8]
    str r2, [r0, #4]
    str r3, [r0]
    bx lr
.Lfunc_001135C8_body_end:
    .word runtime_record_descriptor_105_c
.size func_001135C8, .Lfunc_001135C8_body_end - func_001135C8

.section .text.func_00114FD0, "ax", %progbits
.balign 4
.global func_00114FD0
.type func_00114FD0, %function
func_00114FD0:
    ldr r2, [pc, #24]
    mov r1, #0
    strb r1, [r0, #4]
    str r1, [r0, #40]
    str r2, [r0]
    str r1, [r0, #44]
    strb r1, [r0, #48]
    bx lr
.Lfunc_00114FD0_body_end:
    .word runtime_record_descriptor_105_d
.size func_00114FD0, .Lfunc_00114FD0_body_end - func_00114FD0

.section .text.func_00135F04, "ax", %progbits
.balign 4
.global func_00135F04
.type func_00135F04, %function
func_00135F04:
    ldr r2, [pc, #24]
    mov r1, #0
    mov r3, #520
    str r1, [r0, #4]
    str r2, [r0]
    strh r1, [r3, r0]
    strb r1, [r0, #522]
    bx lr
.Lfunc_00135F04_body_end:
    .word runtime_record_descriptor_105_e
.size func_00135F04, .Lfunc_00135F04_body_end - func_00135F04

.section .note.GNU-stack, "", %progbits
