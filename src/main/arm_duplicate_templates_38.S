.syntax unified

.macro STAGED_POLYMORPHIC_AGGREGATE_TEARDOWN name, derived, shared1, shared2, shared3
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r3, r4, r5, r6, r7, r8, r9, sl, fp, lr}
    mov r4, r0
    ldr r0, .Ldt38_\@_derived
    str r0, [r4]
    mov r0, r4
    bl func_00312920
    ldr r6, [r4, #372]!
    mov sl, #0
    cmp r6, #0
    beq .Ldt38_\@_0064
    ldr r1, [r6, #12]
    ldr r5, [r4, #4]
    add r0, r6, #12
    cmp r1, #0
    addsne r1, r1, r0
    beq .Ldt38_\@_0050
    ldr r0, [r5]
    ldr r2, [r0, #12]
    mov r0, r5
    blx r2
.Ldt38_\@_0050:
    ldr r0, [r5]
    mov r1, r6
    ldr r2, [r0, #12]
    mov r0, r5
    blx r2
.Ldt38_\@_0064:
    ldr r0, .Ldt38_\@_shared1
    sub r8, r4, #372
    str r0, [r4, #-372]
    ldr r4, [r4, #-4]
    cmp r4, #0
    beq .Ldt38_\@_00a4
    ldr r0, [r4]
    ldr r1, [r0]
    mov r0, r4
    blx r1
    ldr r0, [r4, #4]
    ldr r1, [r0]
    ldr r2, [r1, #12]
    mov r1, r4
    blx r2
    str sl, [r8, #368]
.Ldt38_\@_00a4:
    ldr r0, .Ldt38_\@_shared2
    str r0, [r8]
    ldr r9, [r8, #304]
    cmp r9, #0
    beq .Ldt38_\@_0144
    add r4, r9, #8
    ldm r4, {r4, r7}
    cmp r4, r7
    beq .Ldt38_\@_0108
.Ldt38_\@_00c8:
    ldr r5, [r4]
    ldr r6, [r5, #4]
    cmp r6, #0
    beq .Ldt38_\@_00fc
    ldr r0, [r5]
    ldr r1, [r0, #4]
    mov r0, r5
    blx r1
    ldr r0, [r6]
    mov r1, r5
    ldr r2, [r0, #12]
    mov r0, r6
    blx r2
.Ldt38_\@_00fc:
    add r4, r4, #4
    cmp r4, r7
    bne .Ldt38_\@_00c8
.Ldt38_\@_0108:
    ldr r1, [r9, #8]
    str r1, [r9, #12]
    ldr r0, [r9, #4]
    cmp r0, #0
    cmpne r1, #0
    beq .Ldt38_\@_012c
    ldr r2, [r0]
    ldr r2, [r2, #12]
    blx r2
.Ldt38_\@_012c:
    ldr r0, [r9]
    ldr r1, [r0]
    ldr r2, [r1, #12]
    mov r1, r9
    blx r2
    str sl, [r8, #304]
.Ldt38_\@_0144:
    ldr r3, [r8, #12]
    ldr r0, .Ldt38_\@_shared3
    cmp r3, #0
    addne r1, r3, #24
    str r0, [r8]
    ldmne r1, {r1, r2}
    beq .Ldt38_\@_01f4
.Ldt38_\@_0160:
    cmp r1, r2
    ldrne ip, [r1]
    cmpne ip, r8
    addne r1, r1, #4
    bne .Ldt38_\@_0160
    cmp r1, r2
    mov r0, r1
    beq .Ldt38_\@_01d8
    add r1, r0, #4
    sub r2, r2, r1
    asr ip, r2, #2
    cmp ip, #0
    ble .Ldt38_\@_01d8
    lsls ip, r2, #29
    bpl .Ldt38_\@_01ac
    ldr ip, [r1]
    add r1, r1, #4
    cmp ip, r8
    strne ip, [r0], #4
.Ldt38_\@_01ac:
    asrs r2, r2, #3
    beq .Ldt38_\@_01d8
.Ldt38_\@_01b4:
    ldr ip, [r1]
    cmp ip, r8
    strne ip, [r0], #4
    ldr ip, [r1, #4]!
    add r1, r1, #4
    cmp ip, r8
    strne ip, [r0], #4
    subs r2, r2, #1
    bne .Ldt38_\@_01b4
.Ldt38_\@_01d8:
    ldr r1, [r3, #28]
    str r0, [r3, #28]
    cmp r1, r0
    movne r1, #1
    moveq r1, #0
    cmp r1, #0
    strne sl, [r8, #12]
.Ldt38_\@_01f4:
    ldr r9, [r8, #52]
    cmp r9, #0
    beq .Ldt38_\@_028c
    add r4, r9, #8
    ldm r4, {r4, r7}
    cmp r4, r7
    beq .Ldt38_\@_0250
.Ldt38_\@_0210:
    ldr r5, [r4]
    ldr r6, [r5, #4]
    cmp r6, #0
    beq .Ldt38_\@_0244
    ldr r0, [r5]
    ldr r1, [r0, #4]
    mov r0, r5
    blx r1
    ldr r0, [r6]
    mov r1, r5
    ldr r2, [r0, #12]
    mov r0, r6
    blx r2
.Ldt38_\@_0244:
    add r4, r4, #4
    cmp r4, r7
    bne .Ldt38_\@_0210
.Ldt38_\@_0250:
    ldr r1, [r9, #8]
    str r1, [r9, #12]
    ldr r0, [r9, #4]
    cmp r0, #0
    cmpne r1, #0
    beq .Ldt38_\@_0274
    ldr r2, [r0]
    ldr r2, [r2, #12]
    blx r2
.Ldt38_\@_0274:
    ldr r0, [r9]
    ldr r1, [r0]
    ldr r2, [r1, #12]
    mov r1, r9
    blx r2
    str sl, [r8, #52]
.Ldt38_\@_028c:
    ldr r4, [r8, #40]!
    cmp r4, #0
    ldrbne r0, [r8, #4]
    cmpne r0, #0
    beq .Ldt38_\@_02c4
    ldr r0, [r4]
    ldr r1, [r0]
    mov r0, r4
    blx r1
    ldr r0, [r4, #4]
    ldr r1, [r0]
    ldr r2, [r1, #12]
    mov r1, r4
    blx r2
.Ldt38_\@_02c4:
    sub r0, r8, #16
    mov r2, #1
    ldm r0, {r0, r3}
    sub ip, r8, #24
    mov r1, r2
    sub r3, r3, r0
    add r4, r2, r3, asr #2
    cmp r4, #1
    addgt r3, r2, r3, asr #2
    ble .Ldt38_\@_0308
.Ldt38_\@_02ec:
    ldr r2, [r0]
    add r1, r1, #1
    add r0, r0, #4
    cmp r2, #0
    strne sl, [r2, #12]
    cmp r3, r1
    bgt .Ldt38_\@_02ec
.Ldt38_\@_0308:
    ldr r0, [ip, #8]
    add r4, ip, #4
    str r0, [ip, #12]
    ldr r0, [ip, #4]
    cmp r0, #0
    ldrne r1, [r4, #4]
    cmpne r1, #0
    beq .Ldt38_\@_0334
    ldr r2, [r0]
    ldr r2, [r2, #12]
    blx r2
.Ldt38_\@_0334:
    sub r0, r4, #20
    pop {r3, r4, r5, r6, r7, r8, r9, sl, fp, pc}
    .size \name, .-\name
.Ldt38_\@_derived:
    .word \derived
.Ldt38_\@_shared1:
    .word \shared1
.Ldt38_\@_shared2:
    .word \shared2
.Ldt38_\@_shared3:
    .word \shared3
    .global \derived
    .global \shared1
    .global \shared2
    .global \shared3
.endm

STAGED_POLYMORPHIC_AGGREGATE_TEARDOWN func_002EB58C, func_002EB58C_dispatch_identity, arm_duplicate_templates_38_shared_dispatch_identity_1, arm_duplicate_templates_38_shared_dispatch_identity_2, arm_duplicate_templates_38_shared_dispatch_identity_3
STAGED_POLYMORPHIC_AGGREGATE_TEARDOWN func_002EC008, func_002EC008_dispatch_identity, arm_duplicate_templates_38_shared_dispatch_identity_1, arm_duplicate_templates_38_shared_dispatch_identity_2, arm_duplicate_templates_38_shared_dispatch_identity_3
STAGED_POLYMORPHIC_AGGREGATE_TEARDOWN func_002F9B78, func_002F9B78_dispatch_identity, arm_duplicate_templates_38_shared_dispatch_identity_1, arm_duplicate_templates_38_shared_dispatch_identity_2, arm_duplicate_templates_38_shared_dispatch_identity_3
