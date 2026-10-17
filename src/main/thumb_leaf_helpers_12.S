.syntax unified
.thumb

.section .text.func_00101934, "ax", %progbits
.p2align 1
.global func_00101934
.type func_00101934, %function
.thumb_func
func_00101934:
    push {r0, r1, r4, r5, r6, r7, lr}
    sub sp, #60
    movs r0, #0
    str r0, [sp, #48]
    movs r0, #1
    str r0, [sp, #56]
    movs r4, r1
    movs r6, #0
    movs r0, r1
    adds r0, #12
    str r0, [sp, #12]
.L_00101934_16:
    ldr r2, [r4, #20]
    ldr r0, [sp, #12]
    movs r1, #1
    blx r2
    movs r5, r0
    beq.n .L_00101934_80
    cmp r5, #37
    beq.n .L_00101934_82
    ldr r1, [r4, #32]
    blx r1
    cmp r0, #0
    beq.n .L_00101934_60
.L_00101934_2e:
    ldr r2, [r4, #20]
    ldr r0, [sp, #12]
    movs r1, #1
    blx r2
    ldr r1, [r4, #32]
    blx r1
    cmp r0, #0
    bne.n .L_00101934_2e
    ldr r2, [r4, #20]
    subs r1, r0, #1
    ldr r0, [sp, #12]
    blx r2
    b.n .L_00101934_4a
.L_00101934_48:
    .inst.n 0x1c76 @ adds r6, r6, #1
.L_00101934_4a:
    ldr r1, [r4, #24]
    ldr r0, [sp, #60]
    blx r1
    ldr r1, [r4, #32]
    blx r1
    cmp r0, #0
    bne.n .L_00101934_48
    ldr r1, [r4, #28]
    ldr r0, [sp, #60]
    blx r1
    b.n .L_00101934_16
.L_00101934_60:
    ldr r1, [r4, #24]
    ldr r0, [sp, #60]
    blx r1
    movs r7, r0
    cmp r0, r5
    bne.n .L_00101934_70
.L_00101934_6c:
    .inst.n 0x1c76 @ adds r6, r6, #1
    b.n .L_00101934_16
.L_00101934_70:
    ldr r1, [r4, #28]
    ldr r0, [sp, #60]
    blx r1
    .inst.n 0x1c7f @ adds r7, r7, #1
    bne.n .L_00101934_80
.L_00101934_7a:
    ldr r0, [sp, #48]
    cmp r0, #0
    beq.n .L_00101934_170
.L_00101934_80:
    b.n .L_00101934_370
.L_00101934_82:
    ldr r2, [r4, #20]
    movs r7, #0
    movs r5, r7
    ldr r0, [sp, #12]
    movs r1, r7
    blx r2
    cmp r0, #42
    bne.n .L_00101934_ac
    ldr r2, [r4, #20]
    ldr r0, [sp, #12]
    movs r1, #1
    blx r2
    movs r5, #1
    b.n .L_00101934_ac
.L_00101934_9e:
    movs r1, #10
    muls r7, r1
    adds r7, r7, r0
    subs r7, #48
    bmi.n .L_00101934_80
    movs r0, #16
    orrs r5, r0
.L_00101934_ac:
    ldr r2, [r4, #20]
    ldr r0, [sp, #12]
    movs r1, #1
    blx r2
    movs r1, r0
    subs r1, #48
    cmp r1, #10
    bcs.n .L_00101934_c4
    .inst.n 0x49b2 @ ldr r1, [pc, #712]
    cmp r7, r1
    bgt.n .L_00101934_80
    b.n .L_00101934_9e
.L_00101934_c4:
    lsls r1, r5, #27
    bmi.n .L_00101934_ca
    .inst.n 0x4fb0 @ ldr r7, [pc, #704]
.L_00101934_ca:
    cmp r0, #108
    beq.n .L_00101934_e4
    cmp r0, #76
    beq.n .L_00101934_f4
    cmp r0, #104
    beq.n .L_00101934_120
    cmp r0, #106
    beq.n .L_00101934_138
    cmp r0, #116
    beq.n .L_00101934_f8
    cmp r0, #122
    beq.n .L_00101934_f8
    b.n .L_00101934_100
.L_00101934_e4:
    ldr r2, [r4, #20]
    ldr r0, [sp, #12]
    movs r1, #1
    blx r2
    cmp r0, #108
    beq.n .L_00101934_138
    movs r1, #4
    b.n .L_00101934_12e
.L_00101934_f4:
    movs r0, #32
.L_00101934_f6:
    orrs r5, r0
.L_00101934_f8:
    ldr r2, [r4, #20]
    ldr r0, [sp, #12]
    movs r1, #1
    blx r2
.L_00101934_100:
    str r7, [r4, #8]
    cmp r0, #101
    str r5, [r4, #4]
    beq.n .L_00101934_1ac
    bgt.n .L_00101934_158
    cmp r0, #88
    beq.n .L_00101934_182
    bgt.n .L_00101934_146
    cmp r0, #69
    beq.n .L_00101934_1ac
    bgt.n .L_00101934_13c
    cmp r0, #37
    beq.n .L_00101934_184
    cmp r0, #65
.L_00101934_11c:
    bne.n .L_00101934_80
    b.n .L_00101934_1ac
.L_00101934_120:
    ldr r2, [r4, #20]
    ldr r0, [sp, #12]
    movs r1, #1
    blx r2
    cmp r0, #104
    beq.n .L_00101934_132
    movs r1, #8
.L_00101934_12e:
    orrs r5, r1
    b.n .L_00101934_100
.L_00101934_132:
    movs r0, #1
    lsls r0, r0, #11
    b.n .L_00101934_f6
.L_00101934_138:
    movs r0, #2
    b.n .L_00101934_f6
.L_00101934_13c:
    cmp r0, #70
    beq.n .L_00101934_1ac
    cmp r0, #71
    bne.n .L_00101934_80
    b.n .L_00101934_1ac
.L_00101934_146:
    cmp r0, #91
    beq.n .L_00101934_22c
    cmp r0, #97
    beq.n .L_00101934_1ac
    cmp r0, #99
    beq.n .L_00101934_22c
    cmp r0, #100
    bne.n .L_00101934_80
    b.n .L_00101934_21e
.L_00101934_158:
    cmp r0, #111
    beq.n .L_00101934_1fc
    bgt.n .L_00101934_172
    cmp r0, #102
    beq.n .L_00101934_1ac
    cmp r0, #103
    beq.n .L_00101934_1ac
    cmp r0, #105
    beq.n .L_00101934_1bc
    cmp r0, #110
    bne.n .L_00101934_80
    b.n .L_00101934_1d4
.L_00101934_170:
    b.n .L_00101934_368
.L_00101934_172:
    cmp r0, #112
    beq.n .L_00101934_214
    cmp r0, #115
    beq.n .L_00101934_25a
    cmp r0, #117
    beq.n .L_00101934_21e
    cmp r0, #120
    bne.n .L_00101934_11c
.L_00101934_182:
    b.n .L_00101934_22e
.L_00101934_184:
    ldr r1, [r4, #24]
    ldr r0, [sp, #60]
    blx r1
    movs r5, r0
    cmp r0, #37
    bne.n .L_00101934_192
    b.n .L_00101934_6c
.L_00101934_192:
    ldr r1, [r4, #28]
    ldr r0, [sp, #60]
    blx r1
    .inst.n 0x1c6d @ adds r5, r5, #1
    bne.n .L_00101934_19e
    b.n .L_00101934_7a
.L_00101934_19e:
    b.n .L_00101934_370
.L_00101934_1a0:
    movs r3, r4
    movs r2, #10
    b.n .L_00101934_23e
.L_00101934_1a6:
    movs r3, r4
    movs r2, #10
    b.n .L_00101934_24e
.L_00101934_1ac:
    movs r0, #1
    mov r2, sp
    ldr r1, [sp, #60]
    movs r3, r4
    mvns r0, r0
    blx func_00300750
    b.n .L_00101934_35a
.L_00101934_1bc:
    movs r0, r5
    movs r1, #64
    orrs r0, r1
    str r0, [r4, #4]
    lsls r0, r5, #30
    bpl.n .L_00101934_1ce
    movs r3, r4
    movs r2, #0
    b.n .L_00101934_23e
.L_00101934_1ce:
    movs r3, r4
    movs r2, #0
    b.n .L_00101934_24e
.L_00101934_1d4:
    ldr r0, [r4, #0]
    adds r1, r0, #4
    str r1, [r4, #0]
    ldr r0, [r0, #0]
    lsls r1, r5, #20
    bpl.n .L_00101934_1e4
    strb r6, [r0, #0]
    b.n .L_00101934_16
.L_00101934_1e4:
    lsls r1, r5, #28
    bpl.n .L_00101934_1ec
    strh r6, [r0, #0]
    b.n .L_00101934_16
.L_00101934_1ec:
    lsls r1, r5, #30
    bpl.n .L_00101934_1f8
    asrs r1, r6, #31
    str r6, [r0, #0]
    str r1, [r0, #4]
    b.n .L_00101934_16
.L_00101934_1f8:
    str r6, [r0, #0]
    b.n .L_00101934_16
.L_00101934_1fc:
    movs r0, r5
    movs r1, #64
    orrs r0, r1
    str r0, [r4, #4]
    lsls r0, r5, #30
    bpl.n .L_00101934_20e
    movs r3, r4
    movs r2, #8
    b.n .L_00101934_23e
.L_00101934_20e:
    movs r3, r4
    movs r2, #8
    b.n .L_00101934_24e
.L_00101934_214:
    .inst.n 0x495e @ ldr r1, [pc, #376]
    movs r0, r5
    ands r0, r1
    str r0, [r4, #4]
    b.n .L_00101934_24a
.L_00101934_21e:
    movs r0, r5
    movs r1, #64
    orrs r0, r1
    str r0, [r4, #4]
    lsls r0, r5, #30
    bpl.n .L_00101934_1a6
    b.n .L_00101934_1a0
.L_00101934_22c:
    b.n .L_00101934_25a
.L_00101934_22e:
    movs r0, r5
    movs r1, #64
    orrs r0, r1
    str r0, [r4, #4]
    lsls r0, r5, #30
    bpl.n .L_00101934_24a
    movs r3, r4
    movs r2, #16
.L_00101934_23e:
    movs r0, #1
    ldr r1, [sp, #60]
    mvns r0, r0
    bl func_00100CD0
    b.n .L_00101934_35a
.L_00101934_24a:
    movs r3, r4
    movs r2, #16
.L_00101934_24e:
    movs r0, #1
    ldr r1, [sp, #60]
    mvns r0, r0
    bl func_00100E14
    b.n .L_00101934_35a
.L_00101934_25a:
    movs r1, #0
    movs r3, r1
    cmp r0, #99
    str r1, [sp, #4]
    str r1, [sp, #0]
    str r1, [sp, #8]
    str r1, [sp, #52]
    beq.n .L_00101934_270
    cmp r0, #91
    beq.n .L_00101934_27e
    b.n .L_00101934_2d8
.L_00101934_270:
    lsls r0, r5, #27
    bmi.n .L_00101934_278
    movs r0, #1
    str r0, [r4, #8]
.L_00101934_278:
    movs r0, #1
    str r0, [sp, #0]
    b.n .L_00101934_2d8
.L_00101934_27e:
    ldr r2, [r4, #20]
    ldr r0, [sp, #12]
    movs r1, #1
    blx r2
    cmp r0, #94
    bne.n .L_00101934_296
    movs r0, #1
    str r0, [sp, #4]
    ldr r2, [r4, #20]
    movs r1, r0
    ldr r0, [sp, #12]
    blx r2
.L_00101934_296:
    ldr r1, [r4, #16]
    cmp r1, #0
    beq.n .L_00101934_2fe
    ldr r1, [r4, #12]
    .inst.n 0x1e89 @ subs r1, r1, #2
    str r1, [sp, #52]
.L_00101934_2a2:
    cmp r0, #0
    beq.n .L_00101934_370
    ldr r1, [r4, #16]
    cmp r1, #0
    beq.n .L_00101934_30e
    ldr r0, [sp, #8]
    .inst.n 0x1c40 @ adds r0, r0, #1
    str r0, [sp, #8]
.L_00101934_2b2:
    ldr r2, [r4, #20]
    ldr r0, [sp, #12]
    movs r1, #1
    blx r2
    cmp r0, #93
    bne.n .L_00101934_2a2
    ldr r0, [sp, #4]
    cmp r0, #0
    beq.n .L_00101934_2d6
    movs r0, #0
    add r3, sp, #16
.L_00101934_2c8:
    lsls r1, r0, #2
    .inst.n 0x1c40 @ adds r0, r0, #1
    ldr r2, [r3, r1]
    mvns r2, r2
    cmp r0, #8
    str r2, [r3, r1]
    blt.n .L_00101934_2c8
.L_00101934_2d6:
    add r3, sp, #16
.L_00101934_2d8:
    ldr r0, [r4, #16]
    cmp r0, #0
    ldr r0, [r4, #4]
    beq.n .L_00101934_32e
    lsls r0, r0, #29
    cmp r0, #0
    ldr r2, [sp, #8]
    ldr r0, [sp, #0]
    ldr r3, [sp, #52]
    str r2, [sp, #0]
    str r0, [sp, #8]
    bge.n .L_00101934_34e
    movs r0, #1
    ldr r1, [sp, #60]
    movs r2, r4
    mvns r0, r0
    bl func_0010123E
    b.n .L_00101934_35a
.L_00101934_2fe:
    movs r3, #0
    add r2, sp, #16
.L_00101934_302:
    lsls r7, r1, #2
    .inst.n 0x1c49 @ adds r1, r1, #1
    cmp r1, #8
    str r3, [r2, r7]
    blt.n .L_00101934_302
    b.n .L_00101934_2a2
.L_00101934_30e:
    asrs r1, r0, #31
    lsrs r1, r1, #27
    adds r1, r1, r0
    asrs r2, r1, #5
    lsrs r1, r1, #5
    lsls r3, r2, #2
    add r2, sp, #16
    adds r2, r3, r2
    lsls r1, r1, #5
    subs r1, r0, r1
    ldr r3, [r2, #0]
    movs r0, #1
    lsls r0, r1
    orrs r3, r0
    str r3, [r2, #0]
    b.n .L_00101934_2b2
.L_00101934_32e:
    lsls r0, r0, #29
    bpl.n .L_00101934_340
    movs r0, #1
    ldr r1, [sp, #60]
    movs r2, r4
    mvns r0, r0
    bl func_00101040
    b.n .L_00101934_35a
.L_00101934_340:
    movs r0, #1
    ldr r1, [sp, #60]
    movs r2, r4
    mvns r0, r0
    bl func_00100F5E
    b.n .L_00101934_35a
.L_00101934_34e:
    movs r0, #1
    ldr r1, [sp, #60]
    movs r2, r4
    mvns r0, r0
    bl func_0010115A
.L_00101934_35a:
    cmp r0, #0
    bge.n .L_00101934_374
    .inst.n 0x1c40 @ adds r0, r0, #1
    bne.n .L_00101934_370
    ldr r0, [sp, #56]
    cmp r0, #0
    beq.n .L_00101934_370
.L_00101934_368:
    movs r0, #0
    mvns r0, r0
.L_00101934_36c:
    add sp, #68
    pop {r4, r5, r6, r7, pc}
.L_00101934_370:
    ldr r0, [sp, #48]
    b.n .L_00101934_36c
.L_00101934_374:
    lsls r1, r5, #31
    bne.n .L_00101934_37e
    ldr r1, [sp, #48]
    .inst.n 0x1c49 @ adds r1, r1, #1
    str r1, [sp, #48]
.L_00101934_37e:
    adds r6, r6, r0
    movs r0, #0
    str r0, [sp, #56]
    b.n .L_00101934_16
.size func_00101934, . - func_00101934

.section .note.GNU-stack, "", %progbits
