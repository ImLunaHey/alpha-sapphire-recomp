.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_003A4E68, "ax", %progbits
.balign 4
.global func_003A4E68
.type func_003A4E68, %function
func_003A4E68:
    ldrb r2, [r0, #1628]
    cmp r2, r1
    ldrhi r0, [r0, #1624]
    movls r0, #0
    addhi r0, r0, r1, lsl #2
    bx lr
.size func_003A4E68, . - func_003A4E68

.section .text.func_00410B30, "ax", %progbits
.balign 4
.global func_00410B30
.type func_00410B30, %function
func_00410B30:
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    str r1, [r0, #8]
    mov r1, #8388608
    str r1, [r0, #12]
    bx lr
.size func_00410B30, . - func_00410B30

.section .text.func_004161AC, "ax", %progbits
.balign 4
.global func_004161AC
.type func_004161AC, %function
func_004161AC:
    mov r1, #0
    strb r1, [r0, #4]
    bx lr
.size func_004161AC, . - func_004161AC

.section .text.func_004BF8D0, "ax", %progbits
.balign 4
.global func_004BF8D0
.type func_004BF8D0, %function
func_004BF8D0:
    ldr r1, [r0, #36]
    add r0, r0, r1
    bx lr
.size func_004BF8D0, . - func_004BF8D0

.section .note.GNU-stack, "", %progbits
