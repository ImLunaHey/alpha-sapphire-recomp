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

BEGIN func_00566B14
    cmp r1, #0
    bxeq lr
    push {r4, r5, r6, lr}
    mov r6, r0
    mov r4, r1
.L142_func_00566B14_loop:
    mov r0, r6
    ldr r1, [r4, #12]
    bl func_00566B14
    ldr r1, [r6, #4]
    add r0, r4, #16
    mov r5, r4
    ldr r4, [r4, #8]
    add r0, r0, #16
    str r1, [r5, #12]
    bl func_0020542C
    cmp r4, #0
    str r5, [r6, #4]
    bne .L142_func_00566B14_loop
    pop {r4, r5, r6, pc}
END func_00566B14

BEGIN func_0056D0B8
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0]
    mov r5, r1
    ldr r1, [r0, #256]
    mov r0, r4
    blx r1
    cmp r0, #0
    moveq r0, #1
    beq .L142_func_0056D0B8_return
    ldr r0, [r5, #116]
    cmp r0, #0
    ldreq r0, [r4, #8]
    cmp r0, #0
    beq .L142_func_0056D0B8_return
    mov r1, #115
    bl func_001765F4
    movs r1, r0
    beq .L142_func_0056D0B8_return
    ldr r2, [r1, #120]
    mov r0, r5
    bl func_00170F08
    mov r0, #1
.L142_func_0056D0B8_return:
    pop {r4, r5, r6, pc}
END func_0056D0B8

BEGIN func_0056E1D8
    push {r4, r5, r6, r7, r8, lr}
    mov r4, r0
    mov r7, r1
    ldr r6, [r0, #4]!
    mov r1, #0
    ldr r5, [r0, #12]
    cmp r6, #0
    ldrne r1, [r6]
    strne r1, [r4, #4]
    bne .L142_func_0056E1D8_have_node
    add r0, r4, #8
    ldm r0, {r0, r2}
    cmp r0, r2
    moveq r0, r4
    bleq func_0018D65C
    ldr r6, [r4, #8]
    add r1, r6, #112
    str r1, [r4, #8]
.L142_func_0056E1D8_have_node:
    adds r0, r6, #8
    movne r1, r7
    blne func_00205374
    str r5, [r6]
    ldr r0, [r5, #4]
    str r0, [r6, #4]
    ldr r0, [r5, #4]
    str r6, [r0]
    str r6, [r5, #4]
    ldr r0, [r4, #20]
    add r0, r0, #1
    str r0, [r4, #20]
    pop {r4, r5, r6, r7, r8, pc}
END func_0056E1D8

BEGIN func_0056E5C4
    push {r4, r5, r6, lr}
    mov r5, r0
    ldr r0, [r0]
    cmp r1, #0
    mov r4, #1
    bne .L142_func_0056E5C4_allocate
    cmp r0, #0
    moveq r4, #32
    beq .L142_func_0056E5C4_allocate
    ldr r0, [r0, #4]
    add r1, r0, r0, lsr #1
    add r4, r1, r0, lsr #3
    add r0, r0, #32
    cmp r0, r4
    movhi r4, r0
.L142_func_0056E5C4_allocate:
    mov r0, #12
    bl func_00184990
    mov r6, r0
    lsl r0, r4, #4
    bl func_00184990
    str r0, [r6, #8]
    ldr r0, [r5]
    stm r6, {r0, r4}
    str r6, [r5]
    ldr r0, [r6, #8]
    add r1, r0, r4, lsl #4
    strd r0, [r5, #8]
    pop {r4, r5, r6, pc}
END func_0056E5C4

BEGIN func_0056FA6C
    push {r4, lr}
    mov r4, r0
    ldr r2, [r0]
    ldr r1, [r4, #4]
    ldr r0, [r0, #4]
    mov r3, #1
    sub r1, r1, r2
    cmp r0, r2
    lslhi r0, r1, #28
    add r1, r3, r1, asr #3
    lsrhi r0, r0, #31
    movls r0, #0
    add r0, r0, #1
    cmp r1, r0
    ble .L142_func_0056FA6C_release
.L142_func_0056FA6C_stride:
    add r0, r0, #2
    cmp r1, r0
    bgt .L142_func_0056FA6C_stride
.L142_func_0056FA6C_release:
    cmp r2, #0
    beq .L142_func_0056FA6C_return
    ldr r1, [r2, #-8]
    sub r0, r2, #8
    cmp r1, #0
    beq .L142_func_0056FA6C_fallback
    blx r1
    b .L142_func_0056FA6C_return
.L142_func_0056FA6C_fallback:
    nop
    bl func_00302108
.L142_func_0056FA6C_return:
    mov r0, r4
    pop {r4, pc}
END func_0056FA6C

BEGIN func_0057145C
    push {r4, r5, r6, lr}
    mov r6, r0
    ldrd r4, [r6]
    cmp r4, r5
    beq .L142_func_0057145C_release
.L142_func_0057145C_loop:
    ldr r1, [r4]
    mov r0, r4
    ldr r1, [r1]
    blx r1
    add r4, r4, #40
    cmp r4, r5
    bne .L142_func_0057145C_loop
.L142_func_0057145C_release:
    ldr r0, [r6]
    bl func_00160F9C
    mov r0, r6
    pop {r4, r5, r6, pc}
END func_0057145C

BEGIN func_005753F4
    push {r4, lr}
    ldr r1, [r0]
    mov r4, r0
    ldr r0, [r0, #4]
    sub r0, r0, r1
    asr r2, r0, #3
    cmp r2, #0
    ble .L142_func_005753F4_release
    asrs r0, r0, #4
    beq .L142_func_005753F4_release
.L142_func_005753F4_delay:
    subs r0, r0, #1
    bne .L142_func_005753F4_delay
.L142_func_005753F4_release:
    mov r0, r1
    bl func_00160F9C
    mov r0, r4
    pop {r4, pc}
END func_005753F4
