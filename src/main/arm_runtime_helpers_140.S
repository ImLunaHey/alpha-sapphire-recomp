.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro BEGIN name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
.endm

.macro END name
.size \name, . - \name
.endm

BEGIN func_004BEE80
    push {r3, lr}
    mov r2, #2
    mov r1, sp
    bl func_0017D058
    cmp r0, #0
    ldrne r0, [sp]
    andne r0, r0, #255
    moveq r0, #64
    pop {r3, pc}
END func_004BEE80

BEGIN func_004BEFC8
    push {r3, lr}
    mov r2, #2
    mov r1, sp
    bl func_0017D058
    cmp r0, #0
    beq .L140_func_004BEFC8_return
    ldr r0, [sp]
    mov r0, r0, lsl #16
    mov r0, r0, lsr #24
.L140_func_004BEFC8_return:
    pop {r3, pc}
END func_004BEFC8

BEGIN func_004BEFF0
    push {r3, lr}
    mov r2, #2
    mov r1, sp
    bl func_0017D058
    cmp r0, #0
    beq .L140_func_004BEFF0_return
    ldr r0, [sp]
    mov r0, r0, lsl #8
    mov r0, r0, lsr #24
.L140_func_004BEFF0_return:
    pop {r3, pc}
END func_004BEFF0

BEGIN func_004BF018
    push {r3, lr}
    mov r2, #0
    mov r1, sp
    bl func_0017D058
    cmp r0, #0
    beq .L140_func_004BF018_return
    ldr r0, [sp]
    mov r0, r0, asr #8
    sxtb r0, r0
.L140_func_004BF018_return:
    pop {r3, pc}
END func_004BF018

BEGIN func_004BF040
    push {r3, lr}
    mov r2, #0
    mov r1, sp
    bl func_0017D058
    cmp r0, #0
    ldrne r0, [sp]
    andne r0, r0, #255
    moveq r0, #64
    pop {r3, pc}
END func_004BF040

BEGIN func_004BFA4C
    push {r3, lr}
    mov r2, #2
    mov r1, sp
    add r0, r0, #24
    bl func_0017D058
    cmp r0, #0
    ldrne r0, [sp]
    pop {r3, pc}
END func_004BFA4C

BEGIN func_004BFA6C
    push {r3, lr}
    mov r2, #1
    mov r1, sp
    add r0, r0, #24
    bl func_0017D058
    cmp r0, #0
    ldrne r0, [sp]
    pop {r3, pc}
END func_004BFA6C

BEGIN func_004BFA8C
    push {r3, lr}
    mov r2, #0
    mov r1, sp
    add r0, r0, #24
    bl func_0017D058
    cmp r0, #0
    ldrne r0, [sp]
    andne r0, r0, #255
    moveq r0, #1
    pop {r3, pc}
END func_004BFA8C

BEGIN func_004BFAD0
    push {r3, lr}
    mov r2, #0
    mov r1, sp
    add r0, r0, #24
    bl func_0017D058
    cmp r0, #0
    beq .L140_func_004BFAD0_return
    ldr r0, [sp]
    mov r0, r0, lsl #16
    mov r0, r0, lsr #24
    cmp r0, #1
    movne r0, #0
.L140_func_004BFAD0_return:
    pop {r3, pc}
END func_004BFAD0

BEGIN func_004BFB28
    push {r3, r4, r5, lr}
    mov r4, r0
    mov r2, #8
    mov r1, sp
    add r0, r0, #20
    bl func_0017D058
    cmp r0, #0
    ldrne r0, [sp]
    addne r0, r4, r0
    pop {r3, r4, r5, pc}
END func_004BFB28

BEGIN func_004C1F5C
    push {r3, lr}
    mov r2, #4
    mov r1, sp
    add r0, r0, #4
    bl func_0017D058
    cmp r0, #0
    beq .L140_func_004C1F5C_return
    ldr r0, [sp]
    mov r0, r0, lsl #16
    mov r0, r0, lsr #24
.L140_func_004C1F5C_return:
    pop {r3, pc}
END func_004C1F5C

BEGIN func_004C1FC4
    push {r3, lr}
    mov r2, #0
    mov r1, sp
    add r0, r0, #4
    bl func_0017D058
    cmp r0, #0
    ldrne r0, [sp]
    andne r0, r0, #255
    moveq r0, #60
    pop {r3, pc}
END func_004C1FC4

BEGIN func_004C1FEC
    push {r3, lr}
    mov r2, #4
    mov r1, sp
    add r0, r0, #4
    bl func_0017D058
    cmp r0, #0
    beq .L140_func_004C1FEC_return
    ldr r0, [sp]
    ands r0, r0, #255
    movne r0, #1
.L140_func_004C1FEC_return:
    pop {r3, pc}
END func_004C1FEC

BEGIN func_004C2030
    push {r3, lr}
    mov r2, #4
    mov r1, sp
    add r0, r0, #4
    bl func_0017D058
    cmp r0, #0
    beq .L140_func_004C2030_return
    ldr r0, [sp]
    mov r0, r0, lsl #8
    mov r0, r0, lsr #24
.L140_func_004C2030_return:
    pop {r3, pc}
END func_004C2030

BEGIN func_004C205C
    push {r3, lr}
    mov r2, #2
    mov r1, sp
    add r0, r0, #4
    bl func_0017D058
    cmp r0, #0
    ldrne r0, [sp]
    andne r0, r0, #255
    moveq r0, #64
    pop {r3, pc}
END func_004C205C

BEGIN func_004C20F8
    push {r3, lr}
    mov r2, #1
    mov r1, sp
    add r0, r0, #4
    bl func_0017D058
    cmp r0, #0
    ldrne r0, [sp]
    andne r0, r0, #255
    moveq r0, #127
    pop {r3, pc}
END func_004C20F8
