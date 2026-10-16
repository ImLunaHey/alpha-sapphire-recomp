.syntax unified
.arm

.macro pooled_word_key_red_black_tree_node_insertion name, payload_initializer
    .section .text.\name, "ax", %progbits
    .balign 4
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, r7, r8, r9, sl, fp, ip, lr}
    mov r4, r1
    mov r5, r3
    mov r9, r0
    mov fp, r2
    ldr r6, [r1, #4]
    ldr r8, [sp, #40]
    mov sl, #0
    cmp r6, #0
    ldrne r0, [r6, #12]
    strne r0, [r4, #4]
    bne .Ldt43_00b4\@
    ldr r0, [r4, #12]
    ldr r6, [r4, #8]
    cmp r6, r0
    addne r0, r6, #44
    strne r0, [r4, #8]
    bne .Ldt43_00b4\@
    ldr r0, [r4]
    cmp r0, #0
    moveq r6, #32
    beq .Ldt43_0070\@
    ldr r0, [r0, #4]
    add r1, r0, r0, lsr #1
    add r6, r1, r0, lsr #3
    add r0, r0, #32
    cmp r0, r6
    movhi r6, r0
.Ldt43_0070\@:
    mov r0, #12
    bl func_00184990
    mov r7, r0
    mov r0, #44
    mul r0, r6, r0
    bl func_00184990
    str r0, [r7, #8]
    ldr r0, [r4]
    add r1, r6, r6, lsl #1
    add r1, r1, r6, lsl #3
    stm r7, {r0, r6}
    str r7, [r4]
    ldr r6, [r7, #8]
    add r0, r6, r1, lsl #2
    str r0, [r4, #12]
    add r0, r6, #44
    str r0, [r4, #8]
.Ldt43_00b4\@:
    str sl, [r6, #4]
    str sl, [r6, #8]
    str sl, [r6, #12]
    adds r0, r6, #16
    strb sl, [r6]
    beq .Ldt43_00dc\@
    ldr r2, [r8]
    add r1, r8, #4
    str r2, [r0], #4
    bl \payload_initializer
.Ldt43_00dc\@:
    ldrd r0, [r4, #16]
    add r1, r1, #1
    cmp r0, r5
    str r1, [r4, #20]
    beq .Ldt43_0108\@
    cmp fp, #0
    bne .Ldt43_0108\@
    ldr r0, [r8]
    ldr r1, [r5, #16]
    cmp r1, r0
    bls .Ldt43_0138\@
.Ldt43_0108\@:
    str r6, [r5, #8]
    ldr r0, [r4, #16]
    cmp r0, r5
    bne .Ldt43_0128\@
    str r6, [r0, #4]
    ldr r0, [r4, #16]
    str r6, [r0, #12]
    b .Ldt43_014c\@
.Ldt43_0128\@:
    ldr r1, [r0, #8]
    cmp r1, r5
    streq r6, [r0, #8]
    b .Ldt43_014c\@
.Ldt43_0138\@:
    str r6, [r5, #12]
    ldr r0, [r4, #16]
    ldr r1, [r0, #12]
    cmp r1, r5
    streq r6, [r0, #12]
.Ldt43_014c\@:
    mov r0, r6
    mov r2, #1
    str r5, [r6, #4]
    b .Ldt43_0348\@
.Ldt43_015c\@:
    ldr ip, [r1, #4]
    ldr r3, [ip, #8]
    cmp r1, r3
    bne .Ldt43_026c\@
    ldr r3, [ip, #12]
    cmp r3, #0
    beq .Ldt43_0184\@
    ldrb ip, [r3]
    cmp ip, #0
    beq .Ldt43_024c\@
.Ldt43_0184\@:
    ldr r3, [r1, #12]
    cmp r3, r0
    bne .Ldt43_01e0\@
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
    beq .Ldt43_01d8\@
    ldr r1, [r0, #4]
    ldr r5, [r1, #8]
    cmp r5, r0
    streq r3, [r1, #8]
    strne r3, [r1, #12]
.Ldt43_01d8\@:
    str r0, [r3, #8]
    str r3, [r0, #4]
.Ldt43_01e0\@:
    ldr r1, [r0, #4]
    strb r2, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb sl, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    ldr r3, [r1, #8]
    ldr ip, [r3, #12]
    str ip, [r1, #8]
    ldr ip, [r3, #12]
    cmp ip, #0
    strne r1, [ip, #4]
    ldr ip, [r1, #4]
    str ip, [r3, #4]
    ldr ip, [r4, #16]
    ldr r5, [ip, #4]
    cmp r5, r1
    streq r3, [ip, #4]
    beq .Ldt43_0244\@
    ldr ip, [r1, #4]
    ldr r5, [ip, #12]
    cmp r5, r1
    streq r3, [ip, #12]
    strne r3, [ip, #8]
.Ldt43_0244\@:
    str r1, [r3, #12]
    b .Ldt43_0344\@
.Ldt43_024c\@:
    strb r2, [r1]
    strb r2, [r3]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb sl, [r1]
    ldr r0, [r0, #4]
    ldr r0, [r0, #4]
    b .Ldt43_0348\@
.Ldt43_026c\@:
    cmp r3, #0
    beq .Ldt43_0280\@
    ldrb ip, [r3]
    cmp ip, #0
    beq .Ldt43_024c\@
.Ldt43_0280\@:
    ldr r3, [r1, #8]
    cmp r3, r0
    bne .Ldt43_02dc\@
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
    beq .Ldt43_02d4\@
    ldr r1, [r0, #4]
    ldr r5, [r1, #12]
    cmp r5, r0
    streq r3, [r1, #12]
    strne r3, [r1, #8]
.Ldt43_02d4\@:
    str r0, [r3, #12]
    str r3, [r0, #4]
.Ldt43_02dc\@:
    ldr r1, [r0, #4]
    strb r2, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb sl, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    ldr r3, [r1, #12]
    ldr ip, [r3, #8]
    str ip, [r1, #12]
    ldr ip, [r3, #8]
    cmp ip, #0
    strne r1, [ip, #4]
    ldr ip, [r1, #4]
    str ip, [r3, #4]
    ldr ip, [r4, #16]
    ldr r5, [ip, #4]
    cmp r5, r1
    streq r3, [ip, #4]
    beq .Ldt43_0340\@
    ldr ip, [r1, #4]
    ldr r5, [ip, #8]
    cmp r5, r1
    streq r3, [ip, #8]
    strne r3, [ip, #12]
.Ldt43_0340\@:
    str r1, [r3, #8]
.Ldt43_0344\@:
    str r3, [r1, #4]
.Ldt43_0348\@:
    ldr r1, [r4, #16]
    ldr r1, [r1, #4]
    cmp r1, r0
    beq .Ldt43_0368\@
    ldr r1, [r0, #4]
    ldrb r3, [r1]
    cmp r3, #0
    beq .Ldt43_015c\@
.Ldt43_0368\@:
    ldr r0, [r4, #16]
    ldr r0, [r0, #4]
    strb r2, [r0]
    str r6, [r9]
    pop {r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
    .size \name, . - \name
.endm

    pooled_word_key_red_black_tree_node_insertion func_0018FC6C, func_0018E1E0
    pooled_word_key_red_black_tree_node_insertion func_00560E5C, func_0029F668

.section .note.GNU-stack, "", %progbits
