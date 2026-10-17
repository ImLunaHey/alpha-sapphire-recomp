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

BEGIN func_004D851C
    mov r1, #0
    push {r4, lr}
    bl func_004D83F4
    ldrh r0, [r0, #38]
    cmp r0, #10
    moveq r0, #1
    movne r0, #0
    pop {r4, pc}
END func_004D851C

BEGIN func_004D86C8
    mov r1, #0
    push {r4, lr}
    bl func_004D83F4
    ldr r0, [r0, #40]
    and r0, r0, #8192
    mov r0, r0, lsr #13
    pop {r4, pc}
END func_004D86C8

BEGIN func_004D86E4
    mov r1, #0
    push {r4, lr}
    bl func_004D83F4
    ldrh r0, [r0, #28]
    bic r0, r0, #64512
    pop {r4, pc}
END func_004D86E4

BEGIN func_004D8710
    mov r1, #0
    push {r4, lr}
    bl func_004D83F4
    ldrh r0, [r0, #30]
    and r0, r0, #64
    mov r0, r0, lsr #6
    pop {r4, pc}
END func_004D8710

BEGIN func_004D8748
    mov r1, #0
    push {r4, lr}
    bl func_004D83F4
    ldrh r0, [r0, #28]
    bic r0, r0, #64512
    add r0, r0, #1
    pop {r4, pc}
END func_004D8748

BEGIN func_004D8764
    mov r1, #0
    push {r4, lr}
    bl func_004D83F4
    ldrh r0, [r0, #32]
    and r0, r0, #1024
    mov r0, r0, lsr #10
    pop {r4, pc}
END func_004D8764

BEGIN func_004D87E8
    push {r4, r5, r6, lr}
    cmp r1, #2
    mov r5, r0
    mov r4, r1
    bcc .L141_selector_valid
    mov r2, #0
    mov r1, r2
    mov r0, r2
    mov r0, r0
.L141_selector_valid:
    mov r1, r4
    mov r0, r5
    bl func_004D83F4
    ldrh r0, [r0, #24]
    pop {r4, r5, r6, pc}
END func_004D87E8
