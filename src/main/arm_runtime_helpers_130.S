.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00381CBC, "ax", %progbits
.balign 4
.global func_00381CBC
.type func_00381CBC, %function
func_00381CBC:
    add r3, r0, #4
    mov r1, #0
    mvn r2, #0
    stm r3, {r1, r2}
    str r1, [r0, #12]
    ldr r1, .L130_func_00381CBC_32
    str r1, [r0]
    bx lr
.L130_func_00381CBC_body_end:
.L130_func_00381CBC_32:
    .word runtime_literal_130_1
.size func_00381CBC, .L130_func_00381CBC_body_end - func_00381CBC

.section .text.func_003BAEFC, "ax", %progbits
.balign 4
.global func_003BAEFC
.type func_003BAEFC, %function
func_003BAEFC:
    ldr r2, .L130_func_003BAEFC_28
    mov r1, #0
    str r1, [r0, #4]
    str r1, [r0]
    strb r1, [r2]
    strb r1, [r0, #8]
    bx lr
.L130_func_003BAEFC_body_end:
.L130_func_003BAEFC_28:
    .word runtime_literal_130_2
.size func_003BAEFC, .L130_func_003BAEFC_body_end - func_003BAEFC
