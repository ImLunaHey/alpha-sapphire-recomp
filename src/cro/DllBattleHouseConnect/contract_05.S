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

FUNCTION_BEGIN func_000001F0
    mov r0, #13
    bx lr
FUNCTION_END func_000001F0

FUNCTION_BEGIN func_000003D8
    mov r0, #14
    bx lr
FUNCTION_END func_000003D8

FUNCTION_BEGIN func_00000588
    mov r0, #11
    bx lr
FUNCTION_END func_00000588

FUNCTION_BEGIN func_00000590
    mov r1, #15
    strb r1, [r0, #85]
    bx lr
FUNCTION_END func_00000590

FUNCTION_BEGIN func_0000059C
    push {r4-r6}
    cmp r2, #16
    mov r4, #0
    mov r3, #1
    beq .L059C_size_16
    cmp r2, #8
    bne .L059C_done
    ldr r2, [r1]
    ldr r1, [r1, #4]
    ldr ip, [r0, #192]
    ldr r5, [r0, #196]
    eor ip, ip, r2
    eor r5, r5, r1
    orrs ip, ip, r5
    beq .L059C_done
    ldr ip, [r0, #244]
    add ip, r0, ip, lsl #3
    str r2, [ip, #200]!
    str r1, [ip, #4]
    strb r3, [r0, #184]
    strb r4, [r0, #248]
.L059C_done:
    pop {r4-r6}
    bx lr
.L059C_size_16:
    ldmia r1, {r2, ip}
    ldr r6, [r0, #192]
    ldr r5, [r0, #196]
    eor r6, r6, r2
    eor r5, r5, ip
    orrs r5, r5, r6
    beq .L059C_done
    ldr r5, [r0, #64]
    ldrb r6, [r5, #32]
    cmp r6, #1
    bne .L059C_append
    ldrb r5, [r5, #20]
    cmp r5, #0
    ldr r5, [r1, #12]
    beq .L059C_mode_0
    cmp r5, #1
    beq .L059C_special
    b .L059C_append
.L059C_mode_0:
    cmp r5, #0
    beq .L059C_special
.L059C_append:
    ldr r5, [r0, #244]
    add r5, r0, r5, lsl #3
    add r5, r5, #200
    stm r5, {r2, ip}
    strb r3, [r0, #184]
    strb r4, [r0, #248]
    ldr r0, [r0, #64]
    ldrb r2, [r0, #32]
    cmp r2, #1
    ldrbeq r2, [r0, #20]
    cmpeq r2, #0
    ldreq r1, [r1, #8]
    streq r1, [r0, #28]
    bne .L059C_done
    pop {r4-r6}
    bx lr
.L059C_special:
    strb r3, [r0, #248]
    strb r3, [r0, #184]
    pop {r4-r6}
    bx lr
FUNCTION_END func_0000059C

FUNCTION_BEGIN func_00000698
    mov r0, #8
    bx lr
FUNCTION_END func_00000698

FUNCTION_BEGIN func_000006A4
    mov r0, #12
    bx lr
FUNCTION_END func_000006A4

FUNCTION_BEGIN func_000006AC
    ldrb r0, [r0, #185]
    cmp r0, #0
    movne r0, #15
    moveq r0, #9
    bx lr
FUNCTION_END func_000006AC

FUNCTION_BEGIN func_0000095C
    mov r0, #13
    bx lr
FUNCTION_END func_0000095C

FUNCTION_BEGIN func_00000964
    mov r1, #1
    strb r1, [r0, #185]
    bx lr
FUNCTION_END func_00000964

FUNCTION_BEGIN func_00000BB0
    ldr r0, [r0, #92]
    ldr r2, [r0]
    ldr r2, [r2, #16]
    bx r2
FUNCTION_END func_00000BB0

FUNCTION_BEGIN func_00000DD4
    mov r1, #1
    strb r1, [r0, #84]
    mov r0, #15
    bx lr
FUNCTION_END func_00000DD4

FUNCTION_BEGIN func_00000F54
    strb r1, [r0, #217]
    bx lr
FUNCTION_END func_00000F54

FUNCTION_BEGIN func_00000F5C
    mov r0, #0
    bx lr
FUNCTION_END func_00000F5C

FUNCTION_BEGIN func_00000F64
    push {r4-r6}
    cmp r2, #16
    sub r0, r0, #32
    mov r4, #0
    mov r3, #1
    beq .L0F64_size_16
    cmp r2, #8
    bne .L0F64_done
    ldr r2, [r1]
    ldr r1, [r1, #4]
    ldr ip, [r0, #192]
    ldr r5, [r0, #196]
    eor ip, ip, r2
    eor r5, r5, r1
    orrs ip, ip, r5
    beq .L0F64_done
    ldr ip, [r0, #244]
    add ip, r0, ip, lsl #3
    str r2, [ip, #200]!
    str r1, [ip, #4]
    strb r3, [r0, #184]
    strb r4, [r0, #248]
.L0F64_done:
    pop {r4-r6}
    bx lr
.L0F64_size_16:
    add r5, r0, #192
    ldmia r1, {r2, ip}
    ldmia r5, {r5, r6}
    eor r5, r5, r2
    eor r6, r6, ip
    orrs r5, r5, r6
    beq .L0F64_done
    ldr r5, [r0, #64]
    ldrb r6, [r5, #32]
    cmp r6, #1
    bne .L0F64_append
    ldrb r5, [r5, #20]
    cmp r5, #0
    ldr r5, [r1, #12]
    beq .L0F64_mode_0
    cmp r5, #1
    beq .L0F64_special
    b .L0F64_append
.L0F64_mode_0:
    cmp r5, #0
    beq .L0F64_special
.L0F64_append:
    ldr r5, [r0, #244]
    add r5, r0, r5, lsl #3
    add r5, r5, #200
    stm r5, {r2, ip}
    strb r3, [r0, #184]
    strb r4, [r0, #248]
    ldr r0, [r0, #64]
    ldrb r2, [r0, #32]
    cmp r2, #1
    ldrbeq r2, [r0, #20]
    cmpeq r2, #0
    ldreq r1, [r1, #8]
    streq r1, [r0, #28]
    bne .L0F64_done
    pop {r4-r6}
    bx lr
.L0F64_special:
    strb r3, [r0, #248]
    strb r3, [r0, #184]
    pop {r4-r6}
    bx lr
FUNCTION_END func_00000F64

FUNCTION_BEGIN func_0000106C
    mov r1, #1
    strb r1, [r0, #153]
    bx lr
FUNCTION_END func_0000106C

FUNCTION_BEGIN func_0000107C
    mov r1, #15
    strb r1, [r0, #49]
    bx lr
FUNCTION_END func_0000107C
