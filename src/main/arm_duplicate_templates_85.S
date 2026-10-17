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

BEGIN func_001512AC
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r6, r1
    add r5, r0, #8
    mov r1, #104
    mov r0, r5
    bl func_00301FBC
END func_001512AC

BEGIN func_003E6C30
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0, #628]
    sub sp, sp, #24
    mov r3, #1
    mov r2, #99
    mov r1, #0
    bl func_003617D8
    ldr r0, [r4, #628]
    mov r3, #1
    mov r2, #68
    mov r1, #0
    bl func_003617D8
    ldr r0, [r4, #628]
    mov r3, #1
    mov r2, #70
    mov r1, #0
    bl func_003617D8
    ldr r0, [r4, #628]
    mov r3, #1
    mov r2, #72
    mov r1, #0
    bl func_003617D8
    add r6, r4, #604
    str r6, [sp]
    ldr r0, [r4, #628]
    mov r3, #17
    mov r2, #68
    mov r1, #0
    bl func_00362998
    ldr r0, [r4, #28]
    ldr r1, [r4, #24]
    add r1, r1, r0
    add r0, r4, #40
    bl func_0034679C
    uxth r5, r0
    bl func_0014E348
END func_003E6C30

BEGIN func_003E7354
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0, #628]
    sub sp, sp, #24
    mov r3, #1
    mov r2, #99
    mov r1, #0
    bl func_003617D8
    ldr r0, [r4, #628]
    mov r3, #1
    mov r2, #68
    mov r1, #0
    bl func_003617D8
    ldr r0, [r4, #628]
    mov r3, #1
    mov r2, #70
    mov r1, #0
    bl func_003617D8
    ldr r0, [r4, #628]
    mov r3, #1
    mov r2, #72
    mov r1, #0
    bl func_003617D8
    add r6, r4, #604
    str r6, [sp]
    ldr r0, [r4, #628]
    mov r3, #17
    mov r2, #68
    mov r1, #0
    bl func_00362998
    ldr r0, [r4, #28]
    ldr r1, [r4, #24]
    add r1, r1, r0
    add r0, r4, #40
    bl func_0034679C
    uxth r5, r0
    bl func_0014E348
END func_003E7354

BEGIN func_0043ED88
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r6, r1
    add r5, r0, #8
    mov r1, #104
    mov r0, r5
    bl func_00301FBC
END func_0043ED88
