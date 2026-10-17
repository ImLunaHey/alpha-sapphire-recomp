.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_002A0924, "ax", %progbits
.balign 4
.global func_002A0924
.type func_002A0924, %function
func_002A0924:
    ldr r1, .L126_func_002A0924_28
    cmp r0, #0
    moveq r2, #0
    movne r2, #1
    strb r2, [r1, #3]
    strb r0, [r1, #10]
    bx lr
.L126_func_002A0924_body_end:
.L126_func_002A0924_28:
    .word runtime_literal_126_1
.size func_002A0924, .L126_func_002A0924_body_end - func_002A0924

.section .text.func_002AF780, "ax", %progbits
.balign 4
.global func_002AF780
.type func_002AF780, %function
func_002AF780:
    ldr r1, .L126_func_002AF780_32
    ldr r1, [r1, #100]
    cmp r1, #0
    beq .L126_func_002AF780_28
    ldr r2, [r1, r0, lsl #2]
    add r2, r2, #1
    str r2, [r1, r0, lsl #2]
.L126_func_002AF780_28:
    bx lr
.L126_func_002AF780_body_end:
.L126_func_002AF780_32:
    .word runtime_shared_context_root_100
.size func_002AF780, .L126_func_002AF780_body_end - func_002AF780
