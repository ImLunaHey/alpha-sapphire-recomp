.syntax unified
.arch armv6k
.arm

.macro FUNCTION_BEGIN name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
.endm

.macro FUNCTION_END name
.size \name, . - \name
.endm

FUNCTION_BEGIN func_0001E140
    add r3, r0, #0x1000
    ldrb r2, [r3, #0x91]
    cmp r2, #10
    bhs .Lappend_done
    add r0, r0, #0x1000
    add ip, r2, #1
    add r0, r0, #0x94
    strb ip, [r3, #0x91]
    strb r1, [r2, r0]
.Lappend_done:
    bx lr
FUNCTION_END func_0001E140

FUNCTION_BEGIN func_0003F34C
    ldrd r2, r3, [r1]
    ldr r0, [r0, #0x2B0]
    ldr r1, [r1, #8]
    str r1, [r0, #0x1EC]
    add r0, r0, #0x1E4
    stm r0, {r2, r3}
    bx lr
FUNCTION_END func_0003F34C

FUNCTION_BEGIN func_0005C2D8
    and r1, r1, #0xFF
    orr r1, r1, r1, lsl #8
    orr r1, r1, r1, lsl #16
    str r1, [r0]
    str r1, [r0, #4]
    bx lr
FUNCTION_END func_0005C2D8

FUNCTION_BEGIN func_00075BFC
    and r1, r1, #0xFF
    orr r1, r1, r1, lsl #8
    orr r1, r1, r1, lsl #16
    str r1, [r0]
    strh r1, [r0, #4]
    bx lr
FUNCTION_END func_00075BFC

FUNCTION_BEGIN func_0007C1D8
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    str r1, [r0, #8]
    str r1, [r0, #12]
    str r1, [r0, #16]
    str r1, [r0, #20]
    strb r1, [r0, #24]
    bx lr
FUNCTION_END func_0007C1D8

FUNCTION_BEGIN func_000CEDEC
    mov r1, #0
    strb r1, [r0, #24]
    strb r1, [r0, #25]
    str r1, [r0]
    str r1, [r0, #4]
    str r1, [r0, #8]
    str r1, [r0, #12]
    str r1, [r0, #16]
    str r1, [r0, #20]
    bx lr
FUNCTION_END func_000CEDEC

FUNCTION_BEGIN func_000D3268
    ldr r2, [r1]
    str r2, [r0]
    ldrh r3, [r1, #4]
    strh r3, [r0, #4]
    ldrb ip, [r1, #6]
    strb ip, [r0, #6]
    bx lr
FUNCTION_END func_000D3268

FUNCTION_BEGIN func_000D3284
    and r1, r1, #0xFF
    orr r1, r1, r1, lsl #8
    orr r1, r1, r1, lsl #16
    str r1, [r0]
    str r1, [r0, #4]
    strh r1, [r0, #8]
    bx lr
FUNCTION_END func_000D3284

FUNCTION_BEGIN func_000D32A0
    and r1, r1, #0xFF
    orr r1, r1, r1, lsl #8
    orr r1, r1, r1, lsl #16
    str r1, [r0]
    strb r1, [r0, #4]
    bx lr
FUNCTION_END func_000D32A0
