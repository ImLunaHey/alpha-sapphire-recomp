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

BEGIN func_004E8E58
    push {r4, lr}
    mov r4, r0
    ldr r0, [r0]
    cmp r0, #0
    bne .L146_8E58_live
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
.L146_8E58_live:
    ldr r0, [r4]
    ldrb r0, [r0, #342]
    pop {r4, pc}
END func_004E8E58

BEGIN func_004E8E88
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0]
    mov r5, r1
    cmp r0, #0
    bne .L146_8E88_live
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
.L146_8E88_live:
    ldr r0, [r4]
    add r1, r0, #564
    mov r0, r5
    pop {r4, r5, r6, lr}
    b func_003A5C74
END func_004E8E88

BEGIN func_004E8F98
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0]
    mov r5, r1
    cmp r0, #0
    bne .L146_8F98_live
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
.L146_8F98_live:
    ldr r0, [r4]
    add r1, r0, #512
    mov r0, r5
    pop {r4, r5, r6, lr}
    add r1, r1, #26
    b func_003A5C74
END func_004E8F98

BEGIN func_004E9094
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0]
    mov r5, r1
    cmp r0, #0
    bne .L146_9094_live
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
.L146_9094_live:
    ldr r0, [r4]
    add r1, r0, #512
    mov r0, r5
    pop {r4, r5, r6, lr}
    add r1, r1, #154
    b func_003A5C74
END func_004E9094

BEGIN func_004E90D4
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0]
    mov r5, r1
    cmp r0, #0
    bne .L146_90D4_live
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
.L146_90D4_live:
    ldr r0, [r4]
    add r1, r0, #632
    mov r0, r5
    pop {r4, r5, r6, lr}
    b func_003A5C74
END func_004E90D4

BEGIN func_004E9178
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0]
    mov r5, r1
    cmp r0, #0
    bne .L146_9178_live
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
.L146_9178_live:
    ldr r0, [r4]
    add r1, r0, #700
    mov r0, r5
    pop {r4, r5, r6, lr}
    b func_003A5C74
END func_004E9178

BEGIN func_004E91B4
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0]
    mov r5, r1
    cmp r0, #0
    bne .L146_91B4_live
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
.L146_91B4_live:
    ldr r0, [r4]
    add r1, r0, #512
    mov r0, r5
    pop {r4, r5, r6, lr}
    add r1, r1, #222
    b func_003A5C74
END func_004E91B4

BEGIN func_004E91F4
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0]
    mov r5, r1
    cmp r0, #0
    bne .L146_91F4_live
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
.L146_91F4_live:
    ldr r0, [r4]
    add r1, r0, #512
    mov r0, r5
    pop {r4, r5, r6, lr}
    add r1, r1, #86
    b func_003A5C74
END func_004E91F4

BEGIN func_004E9234
    push {r4, lr}
    mov r4, r0
    ldr r0, [r0]
    cmp r0, #0
    bne .L146_9234_live
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
.L146_9234_live:
    ldr r0, [r4]
    ldrb r0, [r0, #343]
    and r0, r0, #1
    pop {r4, pc}
END func_004E9234
