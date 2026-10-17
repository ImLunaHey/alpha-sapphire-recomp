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

BEGIN func_004D2710
    push {r4, r5, r6, lr}
    mov r5, #0
    mov r6, r0
    mov r4, r5
.L143_count_loop:
    ldr r0, [r6, #12]
    mov r1, r4
    bl func_00153314
    cmp r0, #0
    addne r0, r5, #1
    andne r5, r0, #255
    add r0, r4, #1
    and r4, r0, #255
    cmp r4, #4
    bcc .L143_count_loop
    mov r0, r5
    pop {r4, r5, r6, pc}
END func_004D2710

BEGIN func_004D29EC
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0, #12]
    mov r5, #0
    bl func_0012FB6C
    ldr r0, [r4, #12]
    bl func_0012FB9C
    mov r6, r0
    ldr r0, [r4, #12]
    bl func_0012FBD0
    cmp r0, #0
    movne r5, #2
    bne .L143_state_done
    cmp r6, #0
    movne r5, #1
.L143_state_done:
    mov r0, r5
    pop {r4, r5, r6, pc}
END func_004D29EC

BEGIN func_004D2A30
    push {r4, lr}
    mov r4, r0
    ldr r0, [r0, #12]
    bl func_004D1330
    tst r0, #255
    beq .L143_predicate_false
    ldr r0, [r4, #12]
    bl func_004D1330
    tst r0, #15
    moveq r0, #1
    beq .L143_predicate_return
.L143_predicate_false:
    mov r0, #0
.L143_predicate_return:
    pop {r4, pc}
END func_004D2A30

BEGIN func_004D2B3C
    push {r4, lr}
    mov r4, r0
    ldr r0, [r0, #12]
    bl func_001532E0
    cmp r0, #676
    movne r0, #0
    bne .L143_special_return
    ldr r0, [r4, #12]
    bl func_004D1ED0
    and r0, r0, #255
.L143_special_return:
    pop {r4, pc}
END func_004D2B3C

BEGIN func_004D2E74
    push {r4, lr}
    ldr r0, [r0, #12]
    bl func_001532E0
    cmp r0, #0
    moveq r0, #1
    movne r0, #0
    pop {r4, pc}
END func_004D2E74

BEGIN func_004D3278
    push {r4, r5, r6, lr}
    mov r5, r0
    mov r6, r1
    mov r4, #0
.L143_find_loop:
    ldr r0, [r5, #12]
    and r1, r4, #255
    bl func_00153314
    cmp r0, r6
    nop
    bne .L143_find_next
    mov r0, #1
    pop {r4, r5, r6, pc}
.L143_find_next:
    add r4, r4, #1
    cmp r4, #4
    bcc .L143_find_loop
    mov r0, #0
    pop {r4, r5, r6, pc}
END func_004D3278

BEGIN func_004D32BC
    push {r4, lr}
    mov r4, r0
    ldr r0, [r0, #12]
    bl func_0016BC74
    cmp r0, #0
    beq .L143_ready_return
    ldr r0, [r4, #12]
    bl func_00153174
    cmp r0, #0
    moveq r0, #1
    movne r0, #0
.L143_ready_return:
    pop {r4, pc}
END func_004D32BC
