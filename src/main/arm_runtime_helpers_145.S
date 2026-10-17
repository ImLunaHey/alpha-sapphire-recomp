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

BEGIN func_004D04F8
    push {r4, r5, r6, lr}
    mov r5, r1
    ldr r1, [r0, #8]
    mov r4, r0
    ldr r0, [r5, #8]
    mov r2, #48
    bl func_00300B28
    ldrh r0, [r4, #4]
    strh r0, [r5, #4]
    pop {r4, r5, r6, pc}
END func_004D04F8

BEGIN func_004D14FC
    push {r4, r5, r6, lr}
    mov r5, r0
    bl func_00168EC0
    mov r1, #0
    mov r0, r5
    bl func_0016BC84
    ldr r4, [r0, #16]
    mov r0, r5
    bl func_00168E50
    mov r0, r4
    pop {r4, r5, r6, pc}
END func_004D14FC

BEGIN func_004D17FC
    push {r4, r5, r6, lr}
    mov r4, r1
    mov r5, r0
    bl func_00168EC0
    mov r1, #0
    mov r0, r5
    bl func_0016BD80
    mov r1, r4
    bl func_003A747C
    mov r4, r0
    mov r0, r5
    bl func_00168E50
    mov r0, r4
    pop {r4, r5, r6, pc}
END func_004D17FC

BEGIN func_004D183C
    push {r4, r5, r6, lr}
    mov r5, r0
    bl func_00168EC0
    mov r1, #0
    mov r0, r5
    bl func_00176EFC
    ldrb r0, [r0, #27]
    mov r1, #0
    cmp r0, #0
    mov r0, r5
    beq .L145_fallback
    bl func_00176EFC
    ldrb r4, [r0, #42]
    b .L145_selected
.L145_fallback:
    nop
    bl func_0016BD80
    ldrb r4, [r0, #26]
.L145_selected:
    mov r0, r5
    bl func_00168E50
    mov r0, r4
    pop {r4, r5, r6, pc}
END func_004D183C

BEGIN func_004D19F8
    ldr r0, [r0, #12]
    mov r0, r0
    push {r4, r5, r6, lr}
    cmp r1, #4
    mov r4, r1
    mov r5, r0
    bcc .L145_index_valid
    mov r2, #0
    mov r1, r2
    mov r0, r2
    mov r0, r0
    mov r0, #0
    pop {r4, r5, r6, pc}
.L145_index_valid:
    nop
    bl func_00168EC0
    mov r1, #0
    mov r0, r5
    bl func_0016BD00
    add r0, r0, r4, lsl #1
    ldrh r4, [r0, #42]
    mov r0, r5
    bl func_00168E50
    mov r0, r4
    pop {r4, r5, r6, pc}
END func_004D19F8

BEGIN func_004D26FC
    push {r4, lr}
    ldr r0, [r0, #12]
    bl func_004D24AC
    and r0, r0, #255
    pop {r4, pc}
END func_004D26FC
