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

BEGIN func_004D1DD8
    push {r4, r5, r6, lr}
    mov r5, r0
    bl func_00168EC0
    mov r1, #1
    mov r0, r5
    bl func_00176EFC
    ldrb r0, [r0, #27]
    cmp r0, #0
    movne r4, #1
    moveq r4, #0
    mov r0, r5
    bl func_00168E50
    mov r0, r4
    pop {r4, r5, r6, pc}
END func_004D1DD8

BEGIN func_004D1ED0
    push {r4, r5, r6, lr}
    mov r5, r0
    bl func_00168EC0
    mov r1, #0
    mov r0, r5
    bl func_0016BC84
    ldr r4, [r0, #52]
    mov r0, r5
    bl func_00168E50
    mov r0, r4
    pop {r4, r5, r6, pc}
END func_004D1ED0

BEGIN func_004D20EC
    push {r4, r5, r6, lr}
    mov r5, r0
    bl func_00168EC0
    mov r1, #0
    mov r0, r5
    bl func_0016BC84
    ldr r4, [r0, #4]
    mov r0, r5
    bl func_00168E50
    mov r0, r4
    pop {r4, r5, r6, pc}
END func_004D20EC

BEGIN func_004D225C
    push {r4, r5, r6, lr}
    mov r5, r0
    ldr r0, [r0, #4]
    cmp r0, #0
    beq .L144_optional_return
    mov r0, r5
    bl func_00168EC0
    mov r1, #0
    mov r0, r5
    bl func_00176EFC
    ldrb r4, [r0, #54]
    mov r0, r5
    bl func_00168E50
    mov r0, r4
.L144_optional_return:
    pop {r4, r5, r6, pc}
END func_004D225C

BEGIN func_004D23EC
    push {r4, r5, r6, lr}
    mov r5, r0
    bl func_00168EC0
    mov r1, #0
    mov r0, r5
    bl func_0016BD00
    ldr r0, [r0, #52]
    and r0, r0, #1073741824
    mov r4, r0, lsr #30
    mov r0, r5
    bl func_00168E50
    mov r0, r4
    pop {r4, r5, r6, pc}
END func_004D23EC

BEGIN func_004D244C
    push {r4, r5, r6, lr}
    mov r5, r0
    bl func_00168EC0
    mov r1, #0
    mov r0, r5
    bl func_0016BC84
    ldrh r4, [r0, #2]
    mov r0, r5
    bl func_00168E50
    mov r0, r4
    pop {r4, r5, r6, pc}
END func_004D244C

BEGIN func_004D24AC
    push {r4, r5, r6, lr}
    mov r5, r0
    bl func_00168EC0
    mov r1, #0
    mov r0, r5
    bl func_0016BD80
    ldrb r0, [r0, #45]
    mov r4, r0, lsr #7
    mov r0, r5
    bl func_00168E50
    mov r0, r4
    pop {r4, r5, r6, pc}
END func_004D24AC
