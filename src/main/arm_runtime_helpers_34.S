.syntax unified
.arch armv6k
.arm

.section .text.func_002E173C, "ax", %progbits
.balign 4
.global func_002E173C
.type func_002E173C, %function
func_002E173C:
    mov r1, #0
    str r1, [r0, #8]
    str r1, [r0, #12]
    str r1, [r0, #16]
    str r1, [r0, #20]
    str r1, [r0, #24]
    str r1, [r0, #28]
    str r1, [r0, #32]
    str r1, [r0, #36]
    str r1, [r0, #40]
    str r1, [r0, #44]
    str r1, [r0, #48]
    str r1, [r0, #52]
    str r1, [r0]
    strb r1, [r0, #4]
    strb r1, [r0, #5]
    strb r1, [r0, #6]
    bx lr
.size func_002E173C, . - func_002E173C

.section .text.func_002F32AC, "ax", %progbits
.balign 4
.global func_002F32AC
.type func_002F32AC, %function
func_002F32AC:
    sub r0, r0, #5120
    subs r0, r0, #6
    mov r0, #1
    moveq r0, #4
    mul r0, r1, r0
    add r1, r2, #31
    bic r1, r1, #31
    add r0, r0, r1
    bx lr
.size func_002F32AC, . - func_002F32AC

.section .text.func_002F3950, "ax", %progbits
.balign 4
.global func_002F3950
.type func_002F3950, %function
func_002F3950:
    add r12, r2, #8
    sub r0, r0, #5120
    mul r1, r12, r1
    subs r0, r0, #6
    mov r0, #1
    moveq r0, #4
    add r2, r3, #31
    mul r0, r1, r0
    bic r1, r2, #31
    add r1, r1, r0
    add r1, r1, #31
    bic r1, r1, #31
    add r1, r1, r0
    add r0, r0, r1
    bx lr
.size func_002F3950, . - func_002F3950

.section .text.func_002F398C, "ax", %progbits
.balign 4
.global func_002F398C
.type func_002F398C, %function
func_002F398C:
    ldr r1, [r0, #4]
    mov r2, #32
    str r2, [r0, #4]
    ldr r3, [r0, #8]
    cmp r3, #32
    movcs r2, r3
    str r2, [r0, #8]
    ldr r2, [r0]
    str r1, [r0, #4]
    add r2, r2, #31
    bic r2, r2, #31
    add r2, r2, #2144
    str r2, [r0]
    ldr r2, [r0, #8]
    cmp r2, r1
    movcs r1, r2
    str r1, [r0, #8]
    bx lr
.size func_002F398C, . - func_002F398C

.section .text.func_002F78F0, "ax", %progbits
.balign 4
.global func_002F78F0
.type func_002F78F0, %function
func_002F78F0:
    mov r1, #0
    strb r1, [r0, #300]
    bx lr
.size func_002F78F0, . - func_002F78F0

.section .text.func_002FCE50, "ax", %progbits
.balign 4
.global func_002FCE50
.type func_002FCE50, %function
func_002FCE50:
    ldr r0, [r0, #8]
    ldr r1, [r0]
    ldr r1, [r1, #16]
    bx r1
.size func_002FCE50, . - func_002FCE50

.section .text.func_002FF7C0, "ax", %progbits
.balign 4
.global func_002FF7C0
.type func_002FF7C0, %function
func_002FF7C0:
    sub r1, r0, #10
    sub r0, r0, r0, lsr #2
    add r0, r0, r0, lsr #4
    add r0, r0, r0, lsr #8
    add r0, r0, r0, lsr #16
    lsr r0, r0, #3
    add r2, r0, r0, lsl #2
    subs r1, r1, r2, lsl #1
    addpl r0, r0, #1
    addmi r1, r1, #10
    bx lr
.size func_002FF7C0, . - func_002FF7C0

.section .text.func_002FFBE0, "ax", %progbits
.balign 4
.global func_002FFBE0
.type func_002FFBE0, %function
func_002FFBE0:
    stmfd sp!, {lr}
    mov lr, r0
    umull r0, r12, r2, lr
    mla r1, r2, r1, r12
    mla r1, r3, lr, r1
    ldmfd sp!, {pc}
.size func_002FFBE0, . - func_002FFBE0
