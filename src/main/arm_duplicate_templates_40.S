.syntax unified
.arm

.macro POOLED_RED_BLACK_TREE_NODE_INSERT name
    .section .text.\name, "ax", %progbits
    .balign 4
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, r7, r8, r9, sl, fp, ip, lr}
    mov r4, r1
    mov r5, r3
    mov sl, r2
    mov r9, r0
    ldr r2, [r1, #4]
    ldr r8, [sp, #40]
    mov fp, #0
    cmp r2, #0
    ldrne r0, [r2, #12]
    strne r0, [r4, #4]
    bne .Ldt40_\@_00b0
    ldr r0, [r4, #12]
    ldr r2, [r4, #8]
    cmp r2, r0
    addne r0, r2, #28
    strne r0, [r4, #8]
    bne .Ldt40_\@_00b0
    ldr r0, [r4]
    cmp r0, #0
    moveq r6, #32
    beq .Ldt40_\@_0070
    ldr r0, [r0, #4]
    add r1, r0, r0, lsr #1
    add r6, r1, r0, lsr #3
    add r0, r0, #32
    cmp r0, r6
    movhi r6, r0
.Ldt40_\@_0070:
    mov r0, #12
    bl func_00184990
    mov r7, r0
    rsb r0, r6, r6, lsl #3
    lsl r0, r0, #2
    bl func_00184990
    str r0, [r7, #8]
    ldr r1, [r4]
    rsb r0, r6, r6, lsl #3
    stm r7, {r1, r6}
    str r7, [r4]
    ldr r2, [r7, #8]
    add r0, r2, r0, lsl #2
    str r0, [r4, #12]
    add r0, r2, #28
    str r0, [r4, #8]
.Ldt40_\@_00b0:
    str fp, [r2, #4]
    str fp, [r2, #8]
    str fp, [r2, #12]
    adds r0, r2, #16
    strb fp, [r2]
    beq .Ldt40_\@_00e0
    ldr r1, .Ldt40_\@_03b0
    str r1, [r0]
    ldrh r1, [r8, #4]
    strh r1, [r0, #4]
    ldr r1, [r8, #8]
    str r1, [r0, #8]
.Ldt40_\@_00e0:
    ldr r0, [r4, #20]
    ldr r1, [r4, #16]
    add r0, r0, #1
    cmp r1, r5
    str r0, [r4, #20]
    beq .Ldt40_\@_0118
    cmp sl, #0
    bne .Ldt40_\@_0118
    ldrh r0, [r5, #20]
    ldrh r1, [r8, #4]
    sub r0, r0, r1
    sxth r0, r0
    cmp r0, #0
    ble .Ldt40_\@_0148
.Ldt40_\@_0118:
    str r2, [r5, #8]
    ldr r0, [r4, #16]
    cmp r0, r5
    bne .Ldt40_\@_0138
    str r2, [r0, #4]
    ldr r0, [r4, #16]
    str r2, [r0, #12]
    b .Ldt40_\@_015c
.Ldt40_\@_0138:
    ldr r1, [r0, #8]
    cmp r1, r5
    streq r2, [r0, #8]
    b .Ldt40_\@_015c
.Ldt40_\@_0148:
    str r2, [r5, #12]
    ldr r0, [r4, #16]
    ldr r1, [r0, #12]
    cmp r1, r5
    streq r2, [r0, #12]
.Ldt40_\@_015c:
    mov r0, r2
    mov ip, #1
    str r5, [r2, #4]
    b .Ldt40_\@_035c
.Ldt40_\@_016c:
    ldr r3, [r1, #4]
    ldr r5, [r3, #8]
    cmp r1, r5
    bne .Ldt40_\@_0280
    ldr r3, [r3, #12]
    cmp r3, #0
    beq .Ldt40_\@_0194
    ldrb lr, [r3]
    cmp lr, #0
    beq .Ldt40_\@_0260
.Ldt40_\@_0194:
    ldr r3, [r1, #12]
    cmp r3, r0
    bne .Ldt40_\@_01f0
    mov r0, r1
    ldr r1, [r3, #8]
    str r1, [r0, #12]
    ldr r1, [r3, #8]
    cmp r1, #0
    strne r0, [r1, #4]
    ldr r1, [r0, #4]
    str r1, [r3, #4]
    ldr r1, [r4, #16]
    ldr r5, [r1, #4]
    cmp r5, r0
    streq r3, [r1, #4]
    beq .Ldt40_\@_01e8
    ldr r1, [r0, #4]
    ldr r5, [r1, #8]
    cmp r5, r0
    streq r3, [r1, #8]
    strne r3, [r1, #12]
.Ldt40_\@_01e8:
    str r0, [r3, #8]
    str r3, [r0, #4]
.Ldt40_\@_01f0:
    ldr r1, [r0, #4]
    strb ip, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r1, [r0, #4]
    ldr r3, [r1, #4]
    ldr r1, [r3, #8]
    ldr lr, [r1, #12]
    str lr, [r3, #8]
    ldr lr, [r1, #12]
    cmp lr, #0
    strne r3, [lr, #4]
    ldr lr, [r3, #4]
    str lr, [r1, #4]
    ldr r5, [r4, #16]
    ldr lr, [r5, #4]
    cmp lr, r3
    streq r1, [r5, #4]
    beq .Ldt40_\@_0254
    ldr r5, [r3, #4]
    ldr lr, [r5, #12]
    cmp lr, r3
    streq r1, [r5, #12]
    strne r1, [r5, #8]
.Ldt40_\@_0254:
    str r3, [r1, #12]
    str r1, [r3, #4]
    b .Ldt40_\@_035c
.Ldt40_\@_0260:
    strb ip, [r1]
    strb ip, [r3]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r0, [r0, #4]
    ldr r0, [r0, #4]
    b .Ldt40_\@_035c
.Ldt40_\@_0280:
    cmp r5, #0
    beq .Ldt40_\@_0294
    ldrb r3, [r5]
    cmp r3, #0
    beq .Ldt40_\@_0390
.Ldt40_\@_0294:
    ldr r3, [r1, #8]
    cmp r3, r0
    bne .Ldt40_\@_02f0
    mov r0, r1
    ldr r1, [r3, #12]
    str r1, [r0, #8]
    ldr r1, [r3, #12]
    cmp r1, #0
    strne r0, [r1, #4]
    ldr r1, [r0, #4]
    str r1, [r3, #4]
    ldr r1, [r4, #16]
    ldr r5, [r1, #4]
    cmp r5, r0
    streq r3, [r1, #4]
    beq .Ldt40_\@_02e8
    ldr r1, [r0, #4]
    ldr r5, [r1, #12]
    cmp r5, r0
    streq r3, [r1, #12]
    strne r3, [r1, #8]
.Ldt40_\@_02e8:
    str r0, [r3, #12]
    str r3, [r0, #4]
.Ldt40_\@_02f0:
    ldr r1, [r0, #4]
    strb ip, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    ldr r3, [r1, #12]
    ldr lr, [r3, #8]
    str lr, [r1, #12]
    ldr lr, [r3, #8]
    cmp lr, #0
    strne r1, [lr, #4]
    ldr lr, [r1, #4]
    str lr, [r3, #4]
    ldr r5, [r4, #16]
    ldr lr, [r5, #4]
    cmp lr, r1
    streq r3, [r5, #4]
    beq .Ldt40_\@_0354
    ldr r5, [r1, #4]
    ldr lr, [r5, #8]
    cmp lr, r1
    streq r3, [r5, #8]
    strne r3, [r5, #12]
.Ldt40_\@_0354:
    str r1, [r3, #8]
    str r3, [r1, #4]
.Ldt40_\@_035c:
    ldr r1, [r4, #16]
    ldr r1, [r1, #4]
    cmp r1, r0
    beq .Ldt40_\@_037c
    ldr r1, [r0, #4]
    ldrb r3, [r1]
    cmp r3, #0
    beq .Ldt40_\@_016c
.Ldt40_\@_037c:
    ldr r0, [r4, #16]
    ldr r0, [r0, #4]
    strb ip, [r0]
    str r2, [r9]
    pop {r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
.Ldt40_\@_0390:
    strb ip, [r1]
    strb ip, [r5]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r0, [r0, #4]
    ldr r0, [r0, #4]
    b .Ldt40_\@_035c
    .size \name, .-\name
.Ldt40_\@_03b0:
    .word arm_duplicate_templates_40_shared_node_payload_dispatch_identity
.endm

POOLED_RED_BLACK_TREE_NODE_INSERT func_005522B8
POOLED_RED_BLACK_TREE_NODE_INSERT func_00552D08
