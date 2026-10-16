    .syntax unified
    .arm
    .text
    .align 2

    .macro pooled_u64_key_red_black_tree_node_insertion name
    .section .text.\name,"ax",%progbits
    .align 2
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
    bne .Ldt42_00a8\@
    ldr r0, [r4, #12]
    ldr r2, [r4, #8]
    cmp r2, r0
    addne r0, r2, #32
    strne r0, [r4, #8]
    bne .Ldt42_00a8\@
    ldr r0, [r4]
    cmp r0, #0
    moveq r6, #32
    beq .Ldt42_0070\@
    ldr r0, [r0, #4]
    add r1, r0, r0, lsr #1
    add r6, r1, r0, lsr #3
    add r0, r0, #32
    cmp r0, r6
    movhi r6, r0
.Ldt42_0070\@:
    mov r0, #12
    bl func_00184990
    mov r7, r0
    lsl r0, r6, #5
    bl func_00184990
    str r0, [r7, #8]
    ldr r0, [r4]
    stm r7, {r0, r6}
    str r7, [r4]
    ldr r2, [r7, #8]
    add r0, r2, r6, lsl #5
    str r0, [r4, #12]
    add r0, r2, #32
    str r0, [r4, #8]
.Ldt42_00a8\@:
    str fp, [r2, #4]
    str fp, [r2, #8]
    str fp, [r2, #12]
    adds r0, r2, #16
    strb fp, [r2]
    beq .Ldt42_00d0\@
    ldm r8, {r1, r3}
    stm r0, {r1, r3}
    ldr r1, [r8, #8]
    str r1, [r0, #8]
.Ldt42_00d0\@:
    ldrd r0, [r4, #16]
    add r1, r1, #1
    cmp r0, r5
    str r1, [r4, #20]
    beq .Ldt42_0104\@
    cmp sl, #0
    bne .Ldt42_0104\@
    add r1, r5, #16
    ldm r8, {r0, ip}
    ldm r1, {r1, r3}
    subs r0, r0, r1
    sbcs r0, ip, r3
    bcs .Ldt42_0134\@
.Ldt42_0104\@:
    str r2, [r5, #8]
    ldr r0, [r4, #16]
    cmp r0, r5
    bne .Ldt42_0124\@
    str r2, [r0, #4]
    ldr r0, [r4, #16]
    str r2, [r0, #12]
    b .Ldt42_0148\@
.Ldt42_0124\@:
    ldr r1, [r0, #8]
    cmp r1, r5
    streq r2, [r0, #8]
    b .Ldt42_0148\@
.Ldt42_0134\@:
    str r2, [r5, #12]
    ldr r0, [r4, #16]
    ldr r1, [r0, #12]
    cmp r1, r5
    streq r2, [r0, #12]
.Ldt42_0148\@:
    mov r0, r2
    mov ip, #1
    str r5, [r2, #4]
    b .Ldt42_0344\@
.Ldt42_0158\@:
    ldr r3, [r1, #4]
    ldr r5, [r3, #8]
    cmp r1, r5
    bne .Ldt42_0268\@
    ldr r3, [r3, #12]
    cmp r3, #0
    beq .Ldt42_0180\@
    ldrb lr, [r3]
    cmp lr, #0
    beq .Ldt42_0248\@
.Ldt42_0180\@:
    ldr r3, [r1, #12]
    cmp r3, r0
    bne .Ldt42_01dc\@
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
    beq .Ldt42_01d4\@
    ldr r1, [r0, #4]
    ldr r5, [r1, #8]
    cmp r5, r0
    streq r3, [r1, #8]
    strne r3, [r1, #12]
.Ldt42_01d4\@:
    str r0, [r3, #8]
    str r3, [r0, #4]
.Ldt42_01dc\@:
    ldr r1, [r0, #4]
    strb ip, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    ldr r3, [r1, #8]
    ldr lr, [r3, #12]
    str lr, [r1, #8]
    ldr lr, [r3, #12]
    cmp lr, #0
    strne r1, [lr, #4]
    ldr lr, [r1, #4]
    str lr, [r3, #4]
    ldr r5, [r4, #16]
    ldr lr, [r5, #4]
    cmp lr, r1
    streq r3, [r5, #4]
    beq .Ldt42_0240\@
    ldr r5, [r1, #4]
    ldr lr, [r5, #12]
    cmp lr, r1
    streq r3, [r5, #12]
    strne r3, [r5, #8]
.Ldt42_0240\@:
    str r1, [r3, #12]
    b .Ldt42_0340\@
.Ldt42_0248\@:
    strb ip, [r1]
    strb ip, [r3]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r0, [r0, #4]
    ldr r0, [r0, #4]
    b .Ldt42_0344\@
.Ldt42_0268\@:
    cmp r5, #0
    beq .Ldt42_027c\@
    ldrb r3, [r5]
    cmp r3, #0
    beq .Ldt42_0378\@
.Ldt42_027c\@:
    ldr r3, [r1, #8]
    cmp r3, r0
    bne .Ldt42_02d8\@
    mov r0, r1
    ldr r1, [r3, #12]
    str r1, [r0, #8]
    ldr r1, [r3, #12]
    cmp r1, #0
    strne r0, [r1, #4]
    ldr r1, [r0, #4]
    str r1, [r3, #4]
    ldr r1, [r4, #16]
    ldr lr, [r1, #4]
    cmp lr, r0
    streq r3, [r1, #4]
    beq .Ldt42_02d0\@
    ldr r1, [r0, #4]
    ldr r5, [r1, #12]
    cmp r5, r0
    streq r3, [r1, #12]
    strne r3, [r1, #8]
.Ldt42_02d0\@:
    str r0, [r3, #12]
    str r3, [r0, #4]
.Ldt42_02d8\@:
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
    ldr r5, [r3, #8]
    cmp r5, #0
    strne r1, [r5, #4]
    ldr lr, [r1, #4]
    str lr, [r3, #4]
    ldr r5, [r4, #16]
    ldr lr, [r5, #4]
    cmp lr, r1
    streq r3, [r5, #4]
    beq .Ldt42_033c\@
    ldr r5, [r1, #4]
    ldr lr, [r5, #8]
    cmp lr, r1
    streq r3, [r5, #8]
    strne r3, [r5, #12]
.Ldt42_033c\@:
    str r1, [r3, #8]
.Ldt42_0340\@:
    str r3, [r1, #4]
.Ldt42_0344\@:
    ldr r1, [r4, #16]
    ldr r1, [r1, #4]
    cmp r1, r0
    beq .Ldt42_0364\@
    ldr r1, [r0, #4]
    ldrb r3, [r1]
    cmp r3, #0
    beq .Ldt42_0158\@
.Ldt42_0364\@:
    ldr r0, [r4, #16]
    ldr r0, [r0, #4]
    strb ip, [r0]
    str r2, [r9]
    pop {r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
.Ldt42_0378\@:
    strb ip, [r1]
    strb ip, [r5]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r0, [r0, #4]
    ldr r0, [r0, #4]
    b .Ldt42_0344\@
    .size \name, . - \name
    .endm

    pooled_u64_key_red_black_tree_node_insertion func_0016F5B4
    pooled_u64_key_red_black_tree_node_insertion func_005538C8

    .section .note.GNU-stack,"",%progbits
