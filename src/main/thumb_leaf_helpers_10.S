.syntax unified
.thumb

.section .text.func_00305526, "ax", %progbits
.balign 2
.global func_00305526
.type func_00305526, %function
.thumb_func
func_00305526:
    push {r4, r5, lr}
    movs r4, r0
    movs r5, r0
    ldr r0, [r0, #56]
    ldr r1, [r4, #60]
    sub sp, #84
    adds r5, #44
    str r0, [sp, #68]
    movs r0, r5
    str r1, [sp, #72]
    bl func_003054A4
    bl func_003054C0
    cmp r0, #0
    bge.n .Lfunc_00305526_68
    add r0, sp, #68
    bl func_003048BE
    cmp r0, #0
    bne.n .Lfunc_00305526_68
    str r0, [sp, #76]
    movs r0, r5
    bl func_003054A4
    add r5, sp, #76
    str r5, [sp, #0]
    ldr r5, [r0, #0]
    add r1, sp, #68
    ldr r5, [r5, #20]
    add r2, sp, #4
    add r3, sp, #68
    blx r5
    ldr r1, [sp, #76]
    add r2, sp, #4
    subs r5, r1, r2
    cmp r0, #2
    beq.n .Lfunc_00305526_62
    cmp r0, #3
    beq.n .Lfunc_00305526_68
    movs r0, r4
    movs r3, r5
    movs r2, #1
    adds r0, #48
    add r1, sp, #4
    bl func_003048D0
    cmp r0, #0
    beq.n .Lfunc_00305526_6c
.Lfunc_00305526_62:
    movs r0, #0
.Lfunc_00305526_64:
    add sp, #84
    pop {r4, r5, pc}
.Lfunc_00305526_68:
    movs r0, #1
    b.n .Lfunc_00305526_64
.Lfunc_00305526_6c:
    ldr r0, [r4, #52]
    adds r0, r0, r5
    str r0, [r4, #52]
    b.n .Lfunc_00305526_68
.size func_00305526, .-func_00305526

.section .text.func_00102980, "ax", %progbits
.balign 2
.global func_00102980
.type func_00102980, %function
.thumb_func
func_00102980:
    push {r0, r1, r2, r4, r5, r6, r7, lr}
    sub sp, #8
    movs r7, r1
    ldr r4, [sp, #8]
    movs r6, #0
    blx func_002FED78
    str r0, [sp, #0]
    ldr r0, [r0, #0]
    str r0, [sp, #4]
.Lfunc_00102980_14:
    ldrb r5, [r4, #0]
    .inst.n 0x1c64 @ adds r4, r4, #1
    cmp r5, #0
    beq.n .Lfunc_00102980_28
    blx func_002FEDF0
    ldr r0, [r0, #0]
    ldrb r0, [r0, r5]
    lsls r0, r0, #31
    bne.n .Lfunc_00102980_14
.Lfunc_00102980_28:
    cmp r5, #43
    beq.n .Lfunc_00102980_32
    cmp r5, #45
    beq.n .Lfunc_00102980_6a
    .inst.n 0x1e64 @ subs r4, r4, #1
.Lfunc_00102980_32:
    ldr r0, [sp, #0]
    movs r1, #0
    str r1, [r0, #0]
    ldr r2, [sp, #16]
    movs r1, r7
    movs r0, r4
    bl func_003011B0
    movs r1, r0
    cmp r7, #0
    beq.n .Lfunc_00102980_52
    ldr r0, [r7, #0]
    cmp r0, r4
    bne.n .Lfunc_00102980_52
    ldr r0, [sp, #8]
    str r0, [r7, #0]
.Lfunc_00102980_52:
    ldr r0, [sp, #0]
    ldr r0, [r0, #0]
    cmp r0, #2
    beq.n .Lfunc_00102980_72
    ldr r0, [sp, #0]
    ldr r2, [sp, #4]
    str r2, [r0, #0]
    lsls r0, r6, #21
    bpl.n .Lfunc_00102980_72
    negs r0, r1
.Lfunc_00102980_66:
    add sp, #20
    pop {r4, r5, r6, r7, pc}
.Lfunc_00102980_6a:
    movs r0, #1
    lsls r0, r0, #10
    orrs r6, r0
    b.n .Lfunc_00102980_32
.Lfunc_00102980_72:
    movs r0, r1
    b.n .Lfunc_00102980_66
.size func_00102980, .-func_00102980

.section .text.func_00104A50, "ax", %progbits
.balign 2
.global func_00104A50
.type func_00104A50, %function
.thumb_func
func_00104A50:
    push {r4, r5, r6, r7, lr}
    movs r5, r0
    sub sp, #28
    movs r7, r1
    mov r0, sp
    bl func_001040CC
    str r0, [sp, #16]
    ldr r3, [pc, #100]
    ldr r2, [pc, #104]
    movs r1, r7
    movs r0, #8
    bl func_0030099C
    str r0, [sp, #8]
    ldr r4, [r5, #4]
    cmp r4, r7
    bcc.n .Lfunc_00104A50_26
    movs r4, r7
.Lfunc_00104A50_26:
    ldr r6, [r5, #0]
    str r0, [sp, #12]
    lsls r0, r4, #3
    str r0, [sp, #20]
    b.n .Lfunc_00104A50_40
.Lfunc_00104A50_30:
    ldr r0, [sp, #12]
    movs r1, r6
    bl func_00304754
    ldr r0, [sp, #12]
    adds r6, #8
    adds r0, #8
    str r0, [sp, #12]
.Lfunc_00104A50_40:
    ldr r1, [r5, #0]
    ldr r0, [sp, #20]
    adds r0, r1, r0
    cmp r0, r6
    bne.n .Lfunc_00104A50_30
    b.n .Lfunc_00104A50_5a
.Lfunc_00104A50_4c:
    ldr r0, [sp, #8]
    lsls r1, r4, #3
    adds r0, r1, r0
    ldr r1, [sp, #16]
    .inst.n 0x1c64 @ adds r4, r4, #1
    bl func_00304754
.Lfunc_00104A50_5a:
    cmp r4, r7
    bcc.n .Lfunc_00104A50_4c
    ldr r1, [pc, #24]
    ldr r0, [r5, #0]
    bl func_003009F4
    str r7, [r5, #4]
    ldr r4, [sp, #8]
    add r0, sp, #4
    str r4, [r5, #0]
    bl func_003036C0
    movs r0, r4
    add sp, #28
    pop {r4, r5, r6, r7, pc}
.size func_00104A50, .-func_00104A50

.section .text.func_002FF324, "ax", %progbits
.balign 2
.global func_002FF324
.type func_002FF324, %function
.thumb_func
func_002FF324:
    push {r3, r4, r5, r6, r7, lr}
    movs r4, r0
    ldr r0, [r0, #0]
    movs r7, r3
    movs r3, #1
    movs r1, r0
    lsls r3, r3, #11
    movs r6, #3
    ands r0, r3
    cmp r2, #7
    blt.n .Lfunc_002FF324_22
    cmp r0, #0
    beq.n .Lfunc_002FF324_1e
    add r5, pc, #92
    b.n .Lfunc_002FF324_2c
.Lfunc_002FF324_1e:
    add r5, pc, #92
    b.n .Lfunc_002FF324_2c
.Lfunc_002FF324_22:
    cmp r0, #0
    beq.n .Lfunc_002FF324_2a
    add r5, pc, #88
    b.n .Lfunc_002FF324_2c
.Lfunc_002FF324_2a:
    add r5, pc, #88
.Lfunc_002FF324_2c:
    movs r0, #16
    bics r1, r0
    str r1, [r4, #0]
    ldr r0, [r4, #24]
    .inst.n 0x1ec0 @ subs r0, r0, #3
    cmp r7, #0
    str r0, [r4, #24]
    beq.n .Lfunc_002FF324_40
    .inst.n 0x1e40 @ subs r0, r0, #1
    str r0, [r4, #24]
.Lfunc_002FF324_40:
    movs r0, r4
    bl func_002FEE04
    cmp r7, #0
    beq.n .Lfunc_002FF324_5e
    ldr r2, [r4, #4]
    ldr r1, [r4, #8]
    movs r0, r7
    blx r2
    ldr r0, [r4, #32]
    .inst.n 0x1c40 @ adds r0, r0, #1
    str r0, [r4, #32]
.Lfunc_002FF324_58:
    .inst.n 0x1cc0 @ adds r0, r0, #3
    str r0, [r4, #32]
    b.n .Lfunc_002FF324_6c
.Lfunc_002FF324_5e:
    ldr r0, [r4, #32]
    b.n .Lfunc_002FF324_58
.Lfunc_002FF324_62:
    ldr r2, [r4, #4]
    ldrb r0, [r5, #0]
    ldr r1, [r4, #8]
    .inst.n 0x1c6d @ adds r5, r5, #1
    blx r2
.Lfunc_002FF324_6c:
    .inst.n 0x1e76 @ subs r6, r6, #1
    bcs.n .Lfunc_002FF324_62
    movs r0, r4
    bl func_002FEE30
    pop {r3, r4, r5, r6, r7, pc}
.size func_002FF324, .-func_002FF324

.section .text.func_00102FAC, "ax", %progbits
.balign 2
.global func_00102FAC
.type func_00102FAC, %function
.thumb_func
func_00102FAC:
    push {r0, r1, r2, r4, r5, r6, r7, lr}
    sub sp, #8
    movs r7, r1
    ldr r4, [sp, #8]
    movs r6, #0
    blx func_002FED78
    str r0, [sp, #0]
    ldr r0, [r0, #0]
    str r0, [sp, #4]
.Lfunc_00102FAC_14:
    ldrh r5, [r4, #0]
    .inst.n 0x1ca4 @ adds r4, r4, #2
    cmp r5, #0
    beq.n .Lfunc_00102FAC_26
    movs r0, r5
    bl func_002FED84
    cmp r0, #0
    bne.n .Lfunc_00102FAC_14
.Lfunc_00102FAC_26:
    cmp r5, #43
    beq.n .Lfunc_00102FAC_30
    cmp r5, #45
    beq.n .Lfunc_00102FAC_6e
    .inst.n 0x1ea4 @ subs r4, r4, #2
.Lfunc_00102FAC_30:
    ldr r0, [sp, #0]
    movs r1, #0
    str r1, [r0, #0]
    ldr r2, [sp, #16]
    movs r1, r7
    movs r0, r4
    bl func_0010327C
    movs r2, r0
    cmp r7, #0
    beq.n .Lfunc_00102FAC_50
    ldr r0, [r7, #0]
    cmp r0, r4
    bne.n .Lfunc_00102FAC_50
    ldr r0, [sp, #8]
    str r0, [r7, #0]
.Lfunc_00102FAC_50:
    ldr r0, [sp, #0]
    ldr r0, [r0, #0]
    cmp r0, #2
    beq.n .Lfunc_00102FAC_76
    ldr r0, [sp, #0]
    ldr r3, [sp, #4]
    str r3, [r0, #0]
    lsls r0, r6, #21
    bpl.n .Lfunc_00102FAC_76
    movs r3, #0
    negs r0, r2
    sbcs r3, r1
    movs r1, r3
.Lfunc_00102FAC_6a:
    add sp, #20
    pop {r4, r5, r6, r7, pc}
.Lfunc_00102FAC_6e:
    movs r0, #1
    lsls r0, r0, #10
    orrs r6, r0
    b.n .Lfunc_00102FAC_30
.Lfunc_00102FAC_76:
    movs r0, r2
    b.n .Lfunc_00102FAC_6a
.size func_00102FAC, .-func_00102FAC

.section .text.func_00303640, "ax", %progbits
.balign 2
.global func_00303640
.type func_00303640, %function
.thumb_func
func_00303640:
    push {r3, r4, r5, r6, r7, lr}
    movs r5, r0
    movs r4, r1
    ldr r0, [r1, #8]
    movs r6, r2
    lsls r0, r0, #31
    bne.n .Lfunc_00303640_30
    ldr r0, [r6, #0]
    cmp r0, #0
    bne.n .Lfunc_00303640_1e
    ldr r1, [pc, #100]
    ldr r0, [r1, #0]
    .inst.n 0x1c40 @ adds r0, r0, #1
    str r0, [r1, #0]
    str r0, [r6, #0]
.Lfunc_00303640_1e:
    ldr r0, [r4, #0]
    movs r1, r5
    ldr r2, [r0, #8]
    movs r0, r4
    blx r2
    ldr r0, [r4, #8]
    movs r1, #1
    orrs r0, r1
    str r0, [r4, #8]
.Lfunc_00303640_30:
    ldr r0, [r5, #0]
    ldr r6, [r6, #0]
    adds r0, #8
    ldr r1, [r0, #4]
    cmp r1, r6
    bhi.n .Lfunc_00303640_48
    movs r1, #0
    str r1, [sp, #0]
    .inst.n 0x1c71 @ adds r1, r6, #1
    mov r2, sp
    bl func_003035D4
.Lfunc_00303640_48:
    ldr r0, [r5, #0]
    movs r1, r6
    adds r0, #8
    bl func_0030390C
    ldr r0, [r0, #0]
    cmp r0, #0
    beq.n .Lfunc_00303640_66
    ldr r1, [r0, #12]
    .inst.n 0x1e49 @ subs r1, r1, #1
    str r1, [r0, #12]
    bne.n .Lfunc_00303640_66
    ldr r1, [r0, #0]
    ldr r1, [r1, #4]
    blx r1
.Lfunc_00303640_66:
    ldr r0, [r4, #12]
    movs r1, r6
    .inst.n 0x1c40 @ adds r0, r0, #1
    str r0, [r4, #12]
    ldr r0, [r5, #0]
    adds r0, #8
    bl func_0030390C
    str r4, [r0, #0]
    pop {r3, r4, r5, r6, r7, pc}
.size func_00303640, .-func_00303640

.section .text.func_00102F30, "ax", %progbits
.balign 2
.global func_00102F30
.type func_00102F30, %function
.thumb_func
func_00102F30:
    push {r0, r1, r2, r4, r5, r6, r7, lr}
    sub sp, #8
    movs r7, r1
    ldr r4, [sp, #8]
    movs r6, #0
    blx func_002FED78
    str r0, [sp, #0]
    ldr r0, [r0, #0]
    str r0, [sp, #4]
.Lfunc_00102F30_14:
    ldrb r5, [r4, #0]
    .inst.n 0x1c64 @ adds r4, r4, #1
    cmp r5, #0
    beq.n .Lfunc_00102F30_28
    blx func_002FEDF0
    ldr r0, [r0, #0]
    ldrb r0, [r0, r5]
    lsls r0, r0, #31
    bne.n .Lfunc_00102F30_14
.Lfunc_00102F30_28:
    cmp r5, #43
    beq.n .Lfunc_00102F30_32
    cmp r5, #45
    beq.n .Lfunc_00102F30_70
    .inst.n 0x1e64 @ subs r4, r4, #1
.Lfunc_00102F30_32:
    ldr r0, [sp, #0]
    movs r1, #0
    str r1, [r0, #0]
    ldr r2, [sp, #16]
    movs r1, r7
    movs r0, r4
    bl func_001031A8
    movs r2, r0
    cmp r7, #0
    beq.n .Lfunc_00102F30_52
    ldr r0, [r7, #0]
    cmp r0, r4
    bne.n .Lfunc_00102F30_52
    ldr r0, [sp, #8]
    str r0, [r7, #0]
.Lfunc_00102F30_52:
    ldr r0, [sp, #0]
    ldr r0, [r0, #0]
    cmp r0, #2
    beq.n .Lfunc_00102F30_78
    ldr r0, [sp, #0]
    ldr r3, [sp, #4]
    str r3, [r0, #0]
    lsls r0, r6, #21
    bpl.n .Lfunc_00102F30_78
    movs r3, #0
    negs r0, r2
    sbcs r3, r1
    movs r1, r3
.Lfunc_00102F30_6c:
    add sp, #20
    pop {r4, r5, r6, r7, pc}
.Lfunc_00102F30_70:
    movs r0, #1
    lsls r0, r0, #10
    orrs r6, r0
    b.n .Lfunc_00102F30_32
.Lfunc_00102F30_78:
    movs r0, r2
    b.n .Lfunc_00102F30_6c
.size func_00102F30, .-func_00102F30

.section .text.func_00102D02, "ax", %progbits
.balign 2
.global func_00102D02
.type func_00102D02, %function
.thumb_func
func_00102D02:
    push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
    movs r7, r0
    movs r6, r1
    movs r4, r2
    sub sp, #4
    beq.n .Lfunc_00102D02_84
    cmp r6, #0
    beq.n .Lfunc_00102D02_84
    cmp r6, #10
    bls.n .Lfunc_00102D02_1a
    ldr r3, [sp, #16]
    bl func_00102B04
.Lfunc_00102D02_1a:
    .inst.n 0x1e76 @ subs r6, r6, #1
    movs r5, r7
    muls r6, r4
    adds r0, r6, r5
    str r0, [sp, #0]
    b.n .Lfunc_00102D02_7e
.Lfunc_00102D02_26:
    movs r6, r5
    adds r5, r5, r4
    b.n .Lfunc_00102D02_2e
.Lfunc_00102D02_2c:
    subs r6, r6, r4
.Lfunc_00102D02_2e:
    cmp r6, r7
    bcc.n .Lfunc_00102D02_3e
    ldr r2, [sp, #16]
    movs r1, r5
    movs r0, r6
    blx r2
    cmp r0, #0
    bgt.n .Lfunc_00102D02_2c
.Lfunc_00102D02_3e:
    movs r0, r4
    orrs r0, r5
    adds r1, r6, r4
    lsls r0, r0, #30
    beq.n .Lfunc_00102D02_60
    movs r0, #0
    b.n .Lfunc_00102D02_7a
.Lfunc_00102D02_4c:
    adds r2, r5, r0
    ldr r3, [r2, #0]
    b.n .Lfunc_00102D02_56
.Lfunc_00102D02_52:
    ldr r6, [r2, #0]
    str r6, [r2, r4]
.Lfunc_00102D02_56:
    subs r2, r2, r4
    cmp r2, r1
    bcs.n .Lfunc_00102D02_52
    .inst.n 0x1d00 @ adds r0, r0, #4
    str r3, [r2, r4]
.Lfunc_00102D02_60:
    cmp r0, r4
    bcs.n .Lfunc_00102D02_7e
    b.n .Lfunc_00102D02_4c
.Lfunc_00102D02_66:
    adds r2, r5, r0
    ldrb r3, [r2, #0]
    b.n .Lfunc_00102D02_70
.Lfunc_00102D02_6c:
    ldrb r6, [r2, #0]
    strb r6, [r2, r4]
.Lfunc_00102D02_70:
    subs r2, r2, r4
    cmp r2, r1
    bcs.n .Lfunc_00102D02_6c
    .inst.n 0x1c40 @ adds r0, r0, #1
    strb r3, [r2, r4]
.Lfunc_00102D02_7a:
    cmp r0, r4
    bcc.n .Lfunc_00102D02_66
.Lfunc_00102D02_7e:
    ldr r0, [sp, #0]
    cmp r5, r0
    bcc.n .Lfunc_00102D02_26
.Lfunc_00102D02_84:
    add sp, #20
    pop {r4, r5, r6, r7, pc}
.size func_00102D02, .-func_00102D02

.section .text.func_001005A8, "ax", %progbits
.balign 2
.global func_001005A8
.type func_001005A8, %function
.thumb_func
func_001005A8:
    push {r0, r1, r2, r4, r5, r6, r7, lr}
    movs r4, r0
    movs r7, r1
    ldr r1, [pc, #132]
    sub sp, #16
    add r1, pc
    movs r6, #0
    ldmia r1, {r0, r1}
    movs r5, r6
    str r0, [sp, #0]
    str r1, [sp, #4]
    b.n .Lfunc_001005A8_2a
.Lfunc_001005A8_18:
    ldrb r1, [r7, r5]
    mov r2, sp
    add r0, sp, #8
    bl func_002FED38
    cmp r0, #1
    bne.n .Lfunc_001005A8_28
    .inst.n 0x1c76 @ adds r6, r6, #1
.Lfunc_001005A8_28:
    .inst.n 0x1c6d @ adds r5, r5, #1
.Lfunc_001005A8_2a:
    ldr r0, [r4, #0]
    lsls r0, r0, #26
    bpl.n .Lfunc_001005A8_36
    ldr r0, [r4, #28]
    cmp r0, r6
    ble.n .Lfunc_001005A8_42
.Lfunc_001005A8_36:
    ldr r0, [sp, #24]
    cmp r5, r0
    blt.n .Lfunc_001005A8_18
    ldrb r0, [r7, r5]
    cmp r0, #0
    bne.n .Lfunc_001005A8_18
.Lfunc_001005A8_42:
    ldr r0, [r4, #24]
    subs r0, r0, r6
    str r0, [r4, #24]
    movs r0, r4
    bl func_002FEE04
    ldr r1, [pc, #60]
    add r1, pc
    subs r1, #70
    movs r6, #0
    ldmia r1, {r0, r1}
    str r0, [sp, #0]
    str r1, [sp, #4]
    b.n .Lfunc_001005A8_7e
.Lfunc_001005A8_5e:
    ldrb r1, [r7, r6]
    mov r2, sp
    add r0, sp, #8
    bl func_002FED38
    cmp r0, #1
    bne.n .Lfunc_001005A8_7c
    mov r0, sp
    ldr r2, [r4, #4]
    ldrh r0, [r0, #8]
    ldr r1, [r4, #8]
    blx r2
    ldr r0, [r4, #32]
    .inst.n 0x1c40 @ adds r0, r0, #1
    str r0, [r4, #32]
.Lfunc_001005A8_7c:
    .inst.n 0x1c76 @ adds r6, r6, #1
.Lfunc_001005A8_7e:
    cmp r6, r5
    blt.n .Lfunc_001005A8_5e
    movs r0, r4
    bl func_002FEE30
    add sp, #28
    pop {r4, r5, r6, r7, pc}
.size func_001005A8, .-func_001005A8

.section .text.func_00104DBA, "ax", %progbits
.balign 2
.global func_00104DBA
.type func_00104DBA, %function
.thumb_func
func_00104DBA:
    push {r0, r1, r2, r3, r4, r5, r6, lr}
    movs r4, r0
    bl func_00304CA6
    cmp r0, #0
    beq.n .Lfunc_00104DBA_30
    ldr r1, [r4, #36]
    ldr r0, [r4, #32]
    movs r6, #0
    mvns r6, r6
    cmp r1, r0
    beq.n .Lfunc_00104DBA_34
    ldr r0, [r4, #0]
    movs r1, r6
    ldr r2, [r0, #40]
    movs r0, r4
    blx r2
    movs r1, r0
    movs r0, r4
    bl func_00304960
    cmp r0, #0
    beq.n .Lfunc_00104DBA_34
    movs r0, #0
.Lfunc_00104DBA_30:
    add sp, #16
    pop {r4, r5, r6, pc}
.Lfunc_00104DBA_34:
    ldr r0, [r4, #16]
    movs r5, r4
    lsls r0, r0, #30
    lsrs r0, r0, #31
    adds r5, #48
    cmp r0, #0
    beq.n .Lfunc_00104DBA_4c
    movs r0, r4
    bl func_00304CB0
    cmp r0, #0
    beq.n .Lfunc_00104DBA_30
.Lfunc_00104DBA_4c:
    movs r1, r6
    mov r0, sp
    bl func_0030490A
    movs r1, r0
    movs r0, r4
    adds r0, #64
    bl func_00304974
    movs r1, r0
    movs r0, r4
    adds r0, #52
    bl func_00304974
    movs r0, #0
    str r0, [r4, #20]
    str r0, [r4, #24]
    str r0, [r4, #28]
    str r0, [r4, #36]
    str r0, [r4, #32]
    str r0, [r4, #40]
    movs r0, r5
    bl func_00304D24
    cmp r0, #0
    bne.n .Lfunc_00104DBA_8a
    movs r0, r5
    bl func_00304D60
    cmp r0, #0
    beq.n .Lfunc_00104DBA_30
.Lfunc_00104DBA_8a:
    movs r0, #0
    str r0, [sp, #12]
    str r0, [r5, #0]
    movs r0, r4
    b.n .Lfunc_00104DBA_30
.size func_00104DBA, .-func_00104DBA

.section .text.func_0010564A, "ax", %progbits
.balign 2
.global func_0010564A
.type func_0010564A, %function
.thumb_func
func_0010564A:
    push {r0, r1, r2, r3, r4, r5, r6, lr}
    movs r4, r0
    bl func_0030551C
    cmp r0, #0
    beq.n .Lfunc_0010564A_30
    ldr r1, [r4, #36]
    ldr r0, [r4, #32]
    movs r6, #0
    mvns r6, r6
    cmp r1, r0
    beq.n .Lfunc_0010564A_34
    ldr r0, [r4, #0]
    movs r1, r6
    ldr r2, [r0, #40]
    movs r0, r4
    blx r2
    movs r1, r0
    movs r0, r4
    bl func_003054CA
    cmp r0, #0
    beq.n .Lfunc_0010564A_34
    movs r0, #0
.Lfunc_0010564A_30:
    add sp, #16
    pop {r4, r5, r6, pc}
.Lfunc_0010564A_34:
    ldr r0, [r4, #16]
    movs r5, r4
    lsls r0, r0, #30
    lsrs r0, r0, #31
    adds r5, #48
    cmp r0, #0
    beq.n .Lfunc_0010564A_4c
    movs r0, r4
    bl func_00305526
    cmp r0, #0
    beq.n .Lfunc_0010564A_30
.Lfunc_0010564A_4c:
    movs r1, r6
    mov r0, sp
    bl func_0030490A
    movs r1, r0
    movs r0, r4
    adds r0, #64
    bl func_00304974
    movs r1, r0
    movs r0, r4
    adds r0, #52
    bl func_00304974
    movs r0, #0
    str r0, [r4, #20]
    str r0, [r4, #24]
    str r0, [r4, #28]
    str r0, [r4, #36]
    str r0, [r4, #32]
    str r0, [r4, #40]
    movs r0, r5
    bl func_00304D24
    cmp r0, #0
    bne.n .Lfunc_0010564A_8a
    movs r0, r5
    bl func_00304D60
    cmp r0, #0
    beq.n .Lfunc_0010564A_30
.Lfunc_0010564A_8a:
    movs r0, #0
    str r0, [sp, #12]
    str r0, [r5, #0]
    movs r0, r4
    b.n .Lfunc_0010564A_30
.size func_0010564A, .-func_0010564A

.section .text.func_00100500, "ax", %progbits
.balign 2
.global func_00100500
.type func_00100500, %function
.thumb_func
func_00100500:
    push {r0, r1, r2, r4, r5, r6, r7, lr}
    sub sp, #8
    movs r7, #0
    ldr r4, [sp, #8]
    movs r5, r2
    ldrh r0, [r4, #0]
    .inst.n 0x1ca4 @ adds r4, r4, #2
    str r7, [sp, #4]
    cmp r0, #48
    beq.n .Lfunc_00100500_1a
    cmp r5, #0
    beq.n .Lfunc_00100500_44
    b.n .Lfunc_00100500_46
.Lfunc_00100500_1a:
    ldrh r0, [r4, #0]
    movs r7, #1
    .inst.n 0x1ca4 @ adds r4, r4, #2
    cmp r0, #120
    beq.n .Lfunc_00100500_2e
    cmp r0, #88
    beq.n .Lfunc_00100500_2e
    cmp r5, #0
    beq.n .Lfunc_00100500_40
    b.n .Lfunc_00100500_46
.Lfunc_00100500_2e:
    cmp r5, #0
    beq.n .Lfunc_00100500_36
    cmp r5, #16
    bne.n .Lfunc_00100500_46
.Lfunc_00100500_36:
    ldrh r0, [r4, #0]
    movs r7, #0
    movs r5, #16
    .inst.n 0x1ca4 @ adds r4, r4, #2
    b.n .Lfunc_00100500_46
.Lfunc_00100500_40:
    movs r5, #8
    b.n .Lfunc_00100500_46
.Lfunc_00100500_44:
    movs r5, #10
.Lfunc_00100500_46:
    movs r6, #0
    str r6, [sp, #0]
    b.n .Lfunc_00100500_70
.Lfunc_00100500_4c:
    ldr r1, [sp, #0]
    movs r7, #1
    muls r1, r5
    adds r0, r1, r0
    movs r1, r5
    lsrs r2, r0, #16
    muls r1, r6
    lsls r0, r0, #16
    lsrs r0, r0, #16
    str r0, [sp, #0]
    adds r6, r1, r2
    lsls r0, r7, #16
    cmp r6, r0
    bcc.n .Lfunc_00100500_6c
    movs r0, #1
    str r0, [sp, #4]
.Lfunc_00100500_6c:
    ldrh r0, [r4, #0]
    .inst.n 0x1ca4 @ adds r4, r4, #2
.Lfunc_00100500_70:
    movs r1, r5
    bl func_002FEDD0
    cmp r0, #0
    bge.n .Lfunc_00100500_4c
    ldr r0, [sp, #12]
    cmp r0, #0
    beq.n .Lfunc_00100500_8c
    cmp r7, #0
    beq.n .Lfunc_00100500_88
    .inst.n 0x1ea4 @ subs r4, r4, #2
    b.n .Lfunc_00100500_8a
.Lfunc_00100500_88:
    ldr r4, [sp, #8]
.Lfunc_00100500_8a:
    str r4, [r0, #0]
.Lfunc_00100500_8c:
    ldr r0, [sp, #4]
    cmp r0, #0
    beq.n .Lfunc_00100500_a0
    blx func_002FED78
    movs r1, #2
    str r1, [r0, #0]
    .inst.n 0x1ec8 @ subs r0, r1, #3
.Lfunc_00100500_9c:
    add sp, #20
    pop {r4, r5, r6, r7, pc}
.Lfunc_00100500_a0:
    ldr r1, [sp, #0]
    lsls r0, r6, #16
    orrs r0, r1
    b.n .Lfunc_00100500_9c
.size func_00100500, .-func_00100500

.section .text.func_003011B0, "ax", %progbits
.balign 2
.global func_003011B0
.type func_003011B0, %function
.thumb_func
func_003011B0:
    push {r0, r1, r2, r4, r5, r6, r7, lr}
    sub sp, #8
    movs r7, #0
    ldr r4, [sp, #8]
    movs r5, r2
    ldrb r0, [r4, #0]
    .inst.n 0x1c64 @ adds r4, r4, #1
    str r7, [sp, #4]
    cmp r0, #48
    beq.n .Lfunc_003011B0_1a
    cmp r5, #0
    beq.n .Lfunc_003011B0_44
    b.n .Lfunc_003011B0_46
.Lfunc_003011B0_1a:
    ldrb r0, [r4, #0]
    movs r7, #1
    .inst.n 0x1c64 @ adds r4, r4, #1
    cmp r0, #120
    beq.n .Lfunc_003011B0_2e
    cmp r0, #88
    beq.n .Lfunc_003011B0_2e
    cmp r5, #0
    beq.n .Lfunc_003011B0_40
    b.n .Lfunc_003011B0_46
.Lfunc_003011B0_2e:
    cmp r5, #0
    beq.n .Lfunc_003011B0_36
    cmp r5, #16
    bne.n .Lfunc_003011B0_46
.Lfunc_003011B0_36:
    ldrb r0, [r4, #0]
    movs r7, #0
    movs r5, #16
    .inst.n 0x1c64 @ adds r4, r4, #1
    b.n .Lfunc_003011B0_46
.Lfunc_003011B0_40:
    movs r5, #8
    b.n .Lfunc_003011B0_46
.Lfunc_003011B0_44:
    movs r5, #10
.Lfunc_003011B0_46:
    movs r6, #0
    str r6, [sp, #0]
    b.n .Lfunc_003011B0_70
.Lfunc_003011B0_4c:
    ldr r1, [sp, #0]
    movs r7, #1
    muls r1, r5
    adds r0, r1, r0
    movs r1, r5
    lsrs r2, r0, #16
    muls r1, r6
    lsls r0, r0, #16
    lsrs r0, r0, #16
    str r0, [sp, #0]
    adds r6, r1, r2
    lsls r0, r7, #16
    cmp r6, r0
    bcc.n .Lfunc_003011B0_6c
    movs r0, #1
    str r0, [sp, #4]
.Lfunc_003011B0_6c:
    ldrb r0, [r4, #0]
    .inst.n 0x1c64 @ adds r4, r4, #1
.Lfunc_003011B0_70:
    movs r1, r5
    bl func_002FEDD0
    cmp r0, #0
    bge.n .Lfunc_003011B0_4c
    ldr r0, [sp, #12]
    cmp r0, #0
    beq.n .Lfunc_003011B0_8c
    cmp r7, #0
    beq.n .Lfunc_003011B0_88
    .inst.n 0x1e64 @ subs r4, r4, #1
    b.n .Lfunc_003011B0_8a
.Lfunc_003011B0_88:
    ldr r4, [sp, #8]
.Lfunc_003011B0_8a:
    str r4, [r0, #0]
.Lfunc_003011B0_8c:
    ldr r0, [sp, #4]
    cmp r0, #0
    beq.n .Lfunc_003011B0_a0
    blx func_002FED78
    movs r1, #2
    str r1, [r0, #0]
    .inst.n 0x1ec8 @ subs r0, r1, #3
.Lfunc_003011B0_9c:
    add sp, #20
    pop {r4, r5, r6, r7, pc}
.Lfunc_003011B0_a0:
    ldr r1, [sp, #0]
    lsls r0, r6, #16
    orrs r0, r1
    b.n .Lfunc_003011B0_9c
.size func_003011B0, .-func_003011B0

.section .text.func_002FF988, "ax", %progbits
.balign 2
.global func_002FF988
.type func_002FF988, %function
.thumb_func
func_002FF988:
    push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
    movs r4, r0
    sub sp, #4
    adds r0, #36
    movs r5, r1
    str r0, [sp, #0]
    ldr r1, [r4, #0]
    lsls r0, r1, #26
    bpl.n .Lfunc_002FF988_1c
    movs r2, #16
    ldr r0, [r4, #28]
    bics r1, r2
    str r1, [r4, #0]
    b.n .Lfunc_002FF988_1e
.Lfunc_002FF988_1c:
    movs r0, #1
.Lfunc_002FF988_1e:
    cmp r0, r5
    ble.n .Lfunc_002FF988_26
    subs r7, r0, r5
    b.n .Lfunc_002FF988_28
.Lfunc_002FF988_26:
    movs r7, #0
.Lfunc_002FF988_28:
    ldr r0, [sp, #16]
    ldr r1, [r4, #24]
    adds r2, r7, r5
    adds r0, r2, r0
    subs r0, r1, r0
    str r0, [r4, #24]
    ldr r0, [r4, #0]
    lsls r0, r0, #27
    bmi.n .Lfunc_002FF988_40
    movs r0, r4
    bl func_002FEE04
.Lfunc_002FF988_40:
    movs r6, #0
    b.n .Lfunc_002FF988_56
.Lfunc_002FF988_44:
    ldr r0, [sp, #12]
    ldr r2, [r4, #4]
    ldr r1, [r4, #8]
    ldrb r0, [r0, r6]
    blx r2
    ldr r0, [r4, #32]
    .inst.n 0x1c40 @ adds r0, r0, #1
    .inst.n 0x1c76 @ adds r6, r6, #1
    str r0, [r4, #32]
.Lfunc_002FF988_56:
    ldr r0, [sp, #16]
    cmp r6, r0
    blt.n .Lfunc_002FF988_44
    ldr r0, [r4, #0]
    lsls r0, r0, #27
    bpl.n .Lfunc_002FF988_78
    movs r0, r4
    bl func_002FEE04
    b.n .Lfunc_002FF988_78
.Lfunc_002FF988_6a:
    ldr r2, [r4, #4]
    ldr r1, [r4, #8]
    movs r0, #48
    blx r2
    ldr r0, [r4, #32]
    .inst.n 0x1c40 @ adds r0, r0, #1
    str r0, [r4, #32]
.Lfunc_002FF988_78:
    movs r0, r7
    .inst.n 0x1e7f @ subs r7, r7, #1
    cmp r0, #0
    bgt.n .Lfunc_002FF988_6a
    b.n .Lfunc_002FF988_92
.Lfunc_002FF988_82:
    ldr r0, [sp, #0]
    ldr r2, [r4, #4]
    ldr r1, [r4, #8]
    ldrb r0, [r0, r5]
    blx r2
    ldr r0, [r4, #32]
    .inst.n 0x1c40 @ adds r0, r0, #1
    str r0, [r4, #32]
.Lfunc_002FF988_92:
    movs r0, r5
    .inst.n 0x1e6d @ subs r5, r5, #1
    cmp r0, #0
    bgt.n .Lfunc_002FF988_82
    movs r0, r4
    bl func_002FEE30
    ldr r0, [r4, #0]
    lsls r0, r0, #24
    bpl.n .Lfunc_002FF988_ac
    movs r0, #2
.Lfunc_002FF988_a8:
    add sp, #20
    pop {r4, r5, r6, r7, pc}
.Lfunc_002FF988_ac:
    movs r0, #1
    b.n .Lfunc_002FF988_a8
.size func_002FF988, .-func_002FF988

.section .text.func_001013A0, "ax", %progbits
.balign 2
.global func_001013A0
.type func_001013A0, %function
.thumb_func
func_001013A0:
    push {r0, r1, r2, r4, r5, r6, r7, lr}
    movs r4, r0
    movs r5, r2
    ldr r1, [pc, #176]
    sub sp, #24
    add r1, pc
    movs r7, #0
    ldmia r1, {r0, r1}
    movs r6, r7
    str r0, [sp, #0]
    str r1, [sp, #4]
    b.n .Lfunc_001013A0_3c
.Lfunc_001013A0_18:
    ldr r0, [sp, #28]
    mov r2, sp
    lsls r1, r6, #1
    ldrh r1, [r0, r1]
    add r0, sp, #8
    bl func_002FFBF8
    .inst.n 0x1c41 @ adds r1, r0, #1
    beq.n .Lfunc_001013A0_3a
    ldr r1, [r4, #0]
    lsls r1, r1, #26
    bpl.n .Lfunc_001013A0_38
    ldr r2, [r4, #28]
    adds r1, r7, r0
    cmp r1, r2
    bhi.n .Lfunc_001013A0_56
.Lfunc_001013A0_38:
    adds r7, r7, r0
.Lfunc_001013A0_3a:
    .inst.n 0x1c76 @ adds r6, r6, #1
.Lfunc_001013A0_3c:
    ldr r0, [r4, #0]
    lsls r0, r0, #26
    bpl.n .Lfunc_001013A0_48
    ldr r0, [r4, #28]
    cmp r0, r7
    ble.n .Lfunc_001013A0_56
.Lfunc_001013A0_48:
    cmp r6, r5
    blt.n .Lfunc_001013A0_18
    ldr r0, [sp, #28]
    lsls r1, r6, #1
    ldrh r0, [r0, r1]
    cmp r0, #0
    bne.n .Lfunc_001013A0_18
.Lfunc_001013A0_56:
    ldr r0, [r4, #24]
    subs r0, r0, r7
    str r0, [r4, #24]
    movs r0, r4
    bl func_002FEE04
    ldr r1, [pc, #84]
    add r1, pc
    subs r1, #90
    ldmia r1, {r0, r1}
    str r0, [sp, #0]
    movs r0, #0
    str r1, [sp, #4]
    b.n .Lfunc_001013A0_a0
.Lfunc_001013A0_72:
    lsls r1, r0, #1
    mov r2, sp
    ldr r0, [sp, #28]
    ldrh r1, [r0, r1]
    add r0, sp, #8
    bl func_002FFBF8
    str r0, [sp, #20]
    .inst.n 0x1c40 @ adds r0, r0, #1
    beq.n .Lfunc_001013A0_9c
    movs r5, #0
    b.n .Lfunc_001013A0_96
.Lfunc_001013A0_8a:
    ldr r2, [r4, #4]
    add r0, sp, #8
    ldr r1, [r4, #8]
    ldrb r0, [r0, r5]
    blx r2
    .inst.n 0x1c6d @ adds r5, r5, #1
.Lfunc_001013A0_96:
    ldr r0, [sp, #20]
    cmp r5, r0
    bcc.n .Lfunc_001013A0_8a
.Lfunc_001013A0_9c:
    ldr r0, [sp, #16]
    .inst.n 0x1c40 @ adds r0, r0, #1
.Lfunc_001013A0_a0:
    cmp r0, r6
    str r0, [sp, #16]
    blt.n .Lfunc_001013A0_72
    ldr r0, [r4, #32]
    adds r0, r0, r7
    str r0, [r4, #32]
    movs r0, r4
    bl func_002FEE30
    add sp, #36
    pop {r4, r5, r6, r7, pc}
.size func_001013A0, .-func_001013A0

.section .text.func_00103E3C, "ax", %progbits
.balign 2
.global func_00103E3C
.type func_00103E3C, %function
.thumb_func
func_00103E3C:
    push {r1, r2, r3, r4, r5, r6, r7, lr}
    add r1, pc, #184
    movs r4, r0
    blx func_00302334
    cmp r0, #0
    beq.n .Lfunc_00103E3C_b2
    movs r0, r4
    add r1, pc, #172
    blx func_00302334
    cmp r0, #0
    beq.n .Lfunc_00103E3C_b2
    movs r0, #1
    lsls r0, r0, #9
    bl func_002FF094
    movs r7, r0
    movs r2, #2
    movs r1, r4
    mov r0, sp
    bl func_00302FB6
    movs r4, #0
    movs r6, #16
    movs r5, #64
    blx func_002FEDF0
    movs r3, r0
.Lfunc_00103E3C_3a:
    ldr r0, [r3, #0]
    movs r1, #0
    ldrb r0, [r0, r4]
    lsls r2, r0, #31
    lsrs r2, r2, #31
    beq.n .Lfunc_00103E3C_48
    movs r1, #1
.Lfunc_00103E3C_48:
    movs r2, #62
    tst r0, r2
    beq.n .Lfunc_00103E3C_52
    movs r2, #2
    orrs r1, r2
.Lfunc_00103E3C_52:
    movs r2, r0
    tst r2, r5
    beq.n .Lfunc_00103E3C_5c
    movs r2, #4
    orrs r1, r2
.Lfunc_00103E3C_5c:
    movs r2, r0
    tst r2, r6
    beq.n .Lfunc_00103E3C_66
    movs r2, #8
    orrs r1, r2
.Lfunc_00103E3C_66:
    movs r2, #8
    tst r0, r2
    beq.n .Lfunc_00103E3C_6e
    orrs r1, r6
.Lfunc_00103E3C_6e:
    movs r2, #152
    tst r0, r2
    beq.n .Lfunc_00103E3C_78
    movs r2, #32
    orrs r1, r2
.Lfunc_00103E3C_78:
    cmp r0, #32
    beq.n .Lfunc_00103E3C_b6
    movs r2, #0
.Lfunc_00103E3C_7e:
    cmp r2, #0
    beq.n .Lfunc_00103E3C_84
    orrs r1, r5
.Lfunc_00103E3C_84:
    movs r2, #2
    tst r0, r2
    beq.n .Lfunc_00103E3C_8e
    movs r2, #128
    orrs r1, r2
.Lfunc_00103E3C_8e:
    lsls r2, r0, #2
    eors r2, r0
    movs r0, #128
    tst r2, r0
    beq.n .Lfunc_00103E3C_9c
    lsls r0, r0, #1
    orrs r1, r0
.Lfunc_00103E3C_9c:
    lsls r0, r4, #1
    .inst.n 0x1c64 @ adds r4, r4, #1
    strh r1, [r7, r0]
    .inst.n 0x1fe0 @ subs r0, r4, #7
    subs r0, #249
    bne.n .Lfunc_00103E3C_3a
    mov r0, sp
    bl func_00302FEE
    movs r0, r7
    pop {r1, r2, r3, r4, r5, r6, r7, pc}
.Lfunc_00103E3C_b2:
    ldr r0, [pc, #20]
    pop {r1, r2, r3, r4, r5, r6, r7, pc}
.Lfunc_00103E3C_b6:
    movs r2, #1
    b.n .Lfunc_00103E3C_7e
.size func_00103E3C, .-func_00103E3C

.section .text.func_001034A0, "ax", %progbits
.balign 2
.global func_001034A0
.type func_001034A0, %function
.thumb_func
func_001034A0:
    push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
    sub sp, #12
    movs r4, r3
    ldr r5, [sp, #20]
    str r0, [sp, #0]
    muls r5, r1
    cmp r1, #0
    beq.n .Lfunc_001034A0_58
    ldr r7, [r4, #8]
    movs r0, #0
    b.n .Lfunc_001034A0_9a
.Lfunc_001034A0_16:
    cmp r7, #0
    bgt.n .Lfunc_001034A0_9e
    ldr r0, [r4, #28]
    cmp r0, r5
    bge.n .Lfunc_001034A0_5e
    ldr r1, [sp, #4]
    cmp r1, #0
    beq.n .Lfunc_001034A0_5e
    ldr r0, [sp, #0]
    movs r2, r4
    movs r1, r5
    bl func_00301D30
    cmp r0, #0
    beq.n .Lfunc_001034A0_38
    str r7, [r4, #8]
    b.n .Lfunc_001034A0_94
.Lfunc_001034A0_38:
    ldr r0, [r4, #12]
    lsls r1, r0, #21
    lsrs r1, r1, #30
    beq.n .Lfunc_001034A0_44
    movs r0, #0
    b.n .Lfunc_001034A0_56
.Lfunc_001034A0_44:
    ldr r2, [r4, #16]
    ldr r1, [r4, #4]
    subs r1, r1, r2
    ldr r2, [r4, #28]
    subs r1, r2, r1
    lsls r0, r0, #15
    str r1, [r4, #8]
    bmi.n .Lfunc_001034A0_58
    negs r0, r1
.Lfunc_001034A0_56:
    str r0, [r4, #8]
.Lfunc_001034A0_58:
    ldr r0, [sp, #20]
.Lfunc_001034A0_5a:
    add sp, #28
    pop {r4, r5, r6, r7, pc}
.Lfunc_001034A0_5e:
    cmp r0, r5
    bge.n .Lfunc_001034A0_6c
    ldr r0, [r4, #12]
    movs r1, #1
    lsls r1, r1, #23
    orrs r0, r1
    str r0, [r4, #12]
.Lfunc_001034A0_6c:
    ldr r0, [sp, #0]
    movs r1, r4
    ldrb r0, [r0, #0]
    bl func_0030291C
    ldr r2, [r4, #12]
    movs r1, #1
    lsls r1, r1, #23
    bics r2, r1
    .inst.n 0x1c41 @ adds r1, r0, #1
    str r2, [r4, #12]
    beq.n .Lfunc_001034A0_94
    ldr r7, [r4, #8]
    cmp r0, #0
    blt.n .Lfunc_001034A0_98
    ldr r0, [sp, #0]
    .inst.n 0x1c40 @ adds r0, r0, #1
    .inst.n 0x1e6d @ subs r5, r5, #1
    str r0, [sp, #0]
    b.n .Lfunc_001034A0_c0
.Lfunc_001034A0_94:
    movs r0, #0
    b.n .Lfunc_001034A0_5a
.Lfunc_001034A0_98:
    movs r0, #1
.Lfunc_001034A0_9a:
    str r0, [sp, #4]
    b.n .Lfunc_001034A0_c0
.Lfunc_001034A0_9e:
    movs r6, r7
    cmp r7, r5
    ble.n .Lfunc_001034A0_a6
    movs r6, r5
.Lfunc_001034A0_a6:
    ldr r0, [r4, #4]
    ldr r1, [sp, #0]
    movs r2, r6
    blx func_00300B28
    ldr r0, [r4, #4]
    subs r7, r7, r6
    adds r0, r0, r6
    str r0, [r4, #4]
    ldr r0, [sp, #0]
    adds r0, r0, r6
    subs r5, r5, r6
    str r0, [sp, #0]
.Lfunc_001034A0_c0:
    cmp r5, #0
    bgt.n .Lfunc_001034A0_16
    str r7, [r4, #8]
    b.n .Lfunc_001034A0_58
.size func_001034A0, .-func_001034A0

.section .text.func_0010123E, "ax", %progbits
.balign 2
.global func_0010123E
.type func_0010123E, %function
.thumb_func
func_0010123E:
    push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
    sub sp, #12
    movs r4, r2
    movs r6, #0
    ldr r0, [r2, #4]
    movs r5, r6
    str r0, [sp, #4]
    ldr r1, [r2, #24]
    ldr r7, [r2, #8]
    ldr r0, [sp, #16]
    blx r1
    str r0, [sp, #0]
    ldr r1, [sp, #56]
    ldr r0, [sp, #24]
    orrs r0, r1
    beq.n .Lfunc_0010123E_2c
    b.n .Lfunc_0010123E_36
.Lfunc_0010123E_22:
    ldr r1, [r4, #24]
    ldr r0, [sp, #16]
    .inst.n 0x1c6d @ adds r5, r5, #1
    blx r1
    str r0, [sp, #0]
.Lfunc_0010123E_2c:
    ldr r1, [r4, #32]
    ldr r0, [sp, #0]
    blx r1
    cmp r0, #0
    bne.n .Lfunc_0010123E_22
.Lfunc_0010123E_36:
    ldr r0, [sp, #0]
    .inst.n 0x1c40 @ adds r0, r0, #1
    beq.n .Lfunc_0010123E_44
    ldr r0, [sp, #4]
    lsls r0, r0, #31
    beq.n .Lfunc_0010123E_4c
    b.n .Lfunc_0010123E_6e
.Lfunc_0010123E_44:
    movs r0, #0
    mvns r0, r0
.Lfunc_0010123E_48:
    add sp, #28
    pop {r4, r5, r6, r7, pc}
.Lfunc_0010123E_4c:
    ldr r0, [r4, #0]
    .inst.n 0x1d01 @ adds r1, r0, #4
    str r1, [r4, #0]
    ldr r6, [r0, #0]
    b.n .Lfunc_0010123E_6e
.Lfunc_0010123E_56:
    ldr r0, [sp, #4]
    lsls r0, r0, #31
    bne.n .Lfunc_0010123E_62
    ldr r0, [sp, #0]
    strh r0, [r6, #0]
    .inst.n 0x1cb6 @ adds r6, r6, #2
.Lfunc_0010123E_62:
    ldr r1, [r4, #24]
    .inst.n 0x1e7f @ subs r7, r7, #1
    ldr r0, [sp, #16]
    .inst.n 0x1c6d @ adds r5, r5, #1
    blx r1
    str r0, [sp, #0]
.Lfunc_0010123E_6e:
    cmp r7, #0
    ble.n .Lfunc_0010123E_9e
    ldr r0, [sp, #0]
    .inst.n 0x1c40 @ adds r0, r0, #1
    beq.n .Lfunc_0010123E_9e
    ldr r0, [sp, #24]
    cmp r0, #0
    beq.n .Lfunc_0010123E_8e
    ldr r3, [sp, #0]
    ldr r2, [sp, #52]
    ldr r1, [sp, #48]
    bl func_002FFC3C
    cmp r0, #0
    bne.n .Lfunc_0010123E_56
    b.n .Lfunc_0010123E_9e
.Lfunc_0010123E_8e:
    ldr r0, [sp, #56]
    cmp r0, #0
    bne.n .Lfunc_0010123E_56
    ldr r1, [r4, #32]
    ldr r0, [sp, #0]
    blx r1
    cmp r0, #0
    beq.n .Lfunc_0010123E_56
.Lfunc_0010123E_9e:
    ldr r1, [r4, #28]
    ldr r0, [sp, #16]
    blx r1
    ldr r0, [sp, #4]
    ldr r1, [sp, #56]
    lsls r0, r0, #31
    lsrs r0, r0, #31
    orrs r0, r1
    bne.n .Lfunc_0010123E_b2
    strh r0, [r6, #0]
.Lfunc_0010123E_b2:
    ldr r0, [r4, #8]
    cmp r0, r7
    ble.n .Lfunc_0010123E_c2
    ldr r0, [sp, #56]
    cmp r0, #0
    beq.n .Lfunc_0010123E_c8
    cmp r7, #0
    beq.n .Lfunc_0010123E_c8
.Lfunc_0010123E_c2:
    movs r0, #1
    mvns r0, r0
    b.n .Lfunc_0010123E_48
.Lfunc_0010123E_c8:
    movs r0, r5
    b.n .Lfunc_0010123E_48
.size func_0010123E, .-func_0010123E

.section .text.func_002FF118, "ax", %progbits
.balign 2
.global func_002FF118
.type func_002FF118, %function
.thumb_func
func_002FF118:
    push {r0, r1, r2, r4, r5, r6, r7, lr}
    movs r6, r2
    sub sp, #40
    ldr r0, [pc, #200]
    add r0, pc
    mov r4, sp
    movs r3, r0
    adds r3, #124
    ldr r0, [r0, #124]
    ldr r2, [r3, #4]
    ldr r3, [r3, #8]
    stmia r4!, {r0, r2, r3}
    ldr r3, [pc, #180]
    add r3, pc
    adds r3, #110
    adds r3, #8
    add r4, sp, #12
    ldmia r3, {r0, r2, r3}
    stmia r4!, {r0, r2, r3}
    movs r0, #55
    lsls r0, r0, #7
    adds r0, r1, r0
    movs r1, #55
    adds r0, #27
    blx func_00300754
    movs r5, r0
    subs r5, #128
    movs r4, r1
    subs r4, #27
    bpl.n .Lfunc_002FF118_44
    negs r4, r4
    movs r0, #1
    b.n .Lfunc_002FF118_46
.Lfunc_002FF118_44:
    movs r0, #0
.Lfunc_002FF118_46:
    movs r7, #0
    str r0, [sp, #36]
    b.n .Lfunc_002FF118_6c
.Lfunc_002FF118_4c:
    lsls r0, r4, #31
    beq.n .Lfunc_002FF118_68
    movs r0, #12
    ldr r1, [pc, #124]
    muls r0, r7
    add r1, pc
    subs r1, #78
    adds r1, r0, r1
    mov r0, sp
    movs r2, r6
    blx func_002FF21C
    mov r3, sp
    stmia r3!, {r0, r1, r2}
.Lfunc_002FF118_68:
    asrs r4, r4, #1
    .inst.n 0x1c7f @ adds r7, r7, #1
.Lfunc_002FF118_6c:
    cmp r4, #0
    bne.n .Lfunc_002FF118_4c
    ldr r7, [pc, #92]
    add r7, pc
    subs r7, #46
    b.n .Lfunc_002FF118_a6
.Lfunc_002FF118_78:
    lsls r0, r5, #31
    beq.n .Lfunc_002FF118_a2
    lsls r0, r4, #4
    adds r0, r0, r7
    movs r1, r0
    ldmia r1, {r1, r2, r3}
    str r1, [sp, #24]
    str r3, [sp, #32]
    str r2, [sp, #28]
    ldr r0, [r0, #12]
    cmn r0, r6
    bne.n .Lfunc_002FF118_94
    adds r0, r3, r6
    str r0, [sp, #32]
.Lfunc_002FF118_94:
    movs r2, r6
    add r1, sp, #24
    add r0, sp, #12
    blx func_002FF21C
    add r3, sp, #12
    stmia r3!, {r0, r1, r2}
.Lfunc_002FF118_a2:
    asrs r5, r5, #1
    .inst.n 0x1c64 @ adds r4, r4, #1
.Lfunc_002FF118_a6:
    cmp r5, #0
    bne.n .Lfunc_002FF118_78
    ldr r0, [sp, #36]
    cmp r0, #0
    beq.n .Lfunc_002FF118_bc
    mov r1, sp
    movs r2, r6
    add r0, sp, #12
    blx func_002FF1EC
    b.n .Lfunc_002FF118_c6
.Lfunc_002FF118_bc:
    movs r2, r6
    mov r1, sp
    add r0, sp, #12
    blx func_002FF21C
.Lfunc_002FF118_c6:
    ldr r3, [sp, #40]
    stmia r3!, {r0, r1, r2}
    add sp, #52
    pop {r4, r5, r6, r7, pc}
.size func_002FF118, .-func_002FF118

.section .text.func_001031A8, "ax", %progbits
.balign 2
.global func_001031A8
.type func_001031A8, %function
.thumb_func
func_001031A8:
    push {r0, r1, r2, r4, r5, r6, r7, lr}
    sub sp, #16
    movs r1, #0
    ldr r4, [sp, #16]
    movs r5, r2
    ldrb r0, [r4, #0]
    .inst.n 0x1c64 @ adds r4, r4, #1
    str r1, [sp, #4]
    cmp r0, #48
    str r1, [sp, #8]
    beq.n .Lfunc_001031A8_1c
    cmp r5, #0
    beq.n .Lfunc_001031A8_4a
    b.n .Lfunc_001031A8_4c
.Lfunc_001031A8_1c:
    movs r0, #1
    str r0, [sp, #4]
    ldrb r0, [r4, #0]
    .inst.n 0x1c64 @ adds r4, r4, #1
    cmp r0, #120
    beq.n .Lfunc_001031A8_32
    cmp r0, #88
    beq.n .Lfunc_001031A8_32
    cmp r5, #0
    beq.n .Lfunc_001031A8_46
    b.n .Lfunc_001031A8_4c
.Lfunc_001031A8_32:
    cmp r5, #0
    beq.n .Lfunc_001031A8_3a
    cmp r5, #16
    bne.n .Lfunc_001031A8_4c
.Lfunc_001031A8_3a:
    movs r0, #0
    str r0, [sp, #4]
    ldrb r0, [r4, #0]
    movs r5, #16
    .inst.n 0x1c64 @ adds r4, r4, #1
    b.n .Lfunc_001031A8_4c
.Lfunc_001031A8_46:
    movs r5, #8
    b.n .Lfunc_001031A8_4c
.Lfunc_001031A8_4a:
    movs r5, #10
.Lfunc_001031A8_4c:
    movs r7, #0
    movs r6, r7
    str r7, [sp, #0]
    b.n .Lfunc_001031A8_90
.Lfunc_001031A8_54:
    movs r1, #1
    str r1, [sp, #4]
    ldr r1, [sp, #0]
    movs r3, r6
    muls r1, r5
    adds r2, r1, r0
    str r2, [sp, #0]
    movs r0, r5
    asrs r1, r5, #31
    movs r2, r7
    blx func_002FFBE0
    ldr r2, [sp, #0]
    movs r3, #0
    lsrs r2, r2, #16
    adds r7, r0, r2
    ldr r2, [sp, #0]
    adcs r1, r3
    movs r6, r1
    lsls r0, r2, #16
    lsrs r0, r0, #16
    str r0, [sp, #0]
    movs r0, #1
    lsls r0, r0, #16
    cmp r1, r0
    bcc.n .Lfunc_001031A8_8c
    movs r0, #1
    str r0, [sp, #8]
.Lfunc_001031A8_8c:
    ldrb r0, [r4, #0]
    .inst.n 0x1c64 @ adds r4, r4, #1
.Lfunc_001031A8_90:
    movs r1, r5
    bl func_002FEDD0
    cmp r0, #0
    bge.n .Lfunc_001031A8_54
    ldr r0, [sp, #20]
    cmp r0, #0
    beq.n .Lfunc_001031A8_b0
    ldr r0, [sp, #4]
    cmp r0, #0
    beq.n .Lfunc_001031A8_aa
    .inst.n 0x1e64 @ subs r4, r4, #1
    b.n .Lfunc_001031A8_ac
.Lfunc_001031A8_aa:
    ldr r4, [sp, #16]
.Lfunc_001031A8_ac:
    ldr r0, [sp, #20]
    str r4, [r0, #0]
.Lfunc_001031A8_b0:
    ldr r0, [sp, #8]
    cmp r0, #0
    beq.n .Lfunc_001031A8_c6
    blx func_002FED78
    movs r1, #2
    str r1, [r0, #0]
    .inst.n 0x1ec8 @ subs r0, r1, #3
    movs r1, r0
.Lfunc_001031A8_c2:
    add sp, #28
    pop {r4, r5, r6, r7, pc}
.Lfunc_001031A8_c6:
    ldr r2, [sp, #0]
    lsrs r0, r7, #16
    lsls r1, r6, #16
    orrs r1, r0
    lsls r0, r7, #16
    orrs r0, r2
    b.n .Lfunc_001031A8_c2
.size func_001031A8, .-func_001031A8

.section .text.func_0010327C, "ax", %progbits
.balign 2
.global func_0010327C
.type func_0010327C, %function
.thumb_func
func_0010327C:
    push {r0, r1, r2, r4, r5, r6, r7, lr}
    sub sp, #16
    movs r1, #0
    ldr r4, [sp, #16]
    movs r5, r2
    ldrh r0, [r4, #0]
    .inst.n 0x1ca4 @ adds r4, r4, #2
    str r1, [sp, #4]
    cmp r0, #48
    str r1, [sp, #8]
    beq.n .Lfunc_0010327C_1c
    cmp r5, #0
    beq.n .Lfunc_0010327C_4a
    b.n .Lfunc_0010327C_4c
.Lfunc_0010327C_1c:
    movs r0, #1
    str r0, [sp, #4]
    ldrh r0, [r4, #0]
    .inst.n 0x1ca4 @ adds r4, r4, #2
    cmp r0, #120
    beq.n .Lfunc_0010327C_32
    cmp r0, #88
    beq.n .Lfunc_0010327C_32
    cmp r5, #0
    beq.n .Lfunc_0010327C_46
    b.n .Lfunc_0010327C_4c
.Lfunc_0010327C_32:
    cmp r5, #0
    beq.n .Lfunc_0010327C_3a
    cmp r5, #16
    bne.n .Lfunc_0010327C_4c
.Lfunc_0010327C_3a:
    movs r0, #0
    str r0, [sp, #4]
    ldrh r0, [r4, #0]
    movs r5, #16
    .inst.n 0x1ca4 @ adds r4, r4, #2
    b.n .Lfunc_0010327C_4c
.Lfunc_0010327C_46:
    movs r5, #8
    b.n .Lfunc_0010327C_4c
.Lfunc_0010327C_4a:
    movs r5, #10
.Lfunc_0010327C_4c:
    movs r7, #0
    movs r6, r7
    str r7, [sp, #0]
    b.n .Lfunc_0010327C_90
.Lfunc_0010327C_54:
    movs r1, #1
    str r1, [sp, #4]
    ldr r1, [sp, #0]
    movs r3, r6
    muls r1, r5
    adds r2, r1, r0
    str r2, [sp, #0]
    movs r0, r5
    asrs r1, r5, #31
    movs r2, r7
    blx func_002FFBE0
    ldr r2, [sp, #0]
    movs r3, #0
    lsrs r2, r2, #16
    adds r7, r0, r2
    ldr r2, [sp, #0]
    adcs r1, r3
    movs r6, r1
    lsls r0, r2, #16
    lsrs r0, r0, #16
    str r0, [sp, #0]
    movs r0, #1
    lsls r0, r0, #16
    cmp r1, r0
    bcc.n .Lfunc_0010327C_8c
    movs r0, #1
    str r0, [sp, #8]
.Lfunc_0010327C_8c:
    ldrh r0, [r4, #0]
    .inst.n 0x1ca4 @ adds r4, r4, #2
.Lfunc_0010327C_90:
    movs r1, r5
    bl func_002FEDD0
    cmp r0, #0
    bge.n .Lfunc_0010327C_54
    ldr r0, [sp, #20]
    cmp r0, #0
    beq.n .Lfunc_0010327C_b0
    ldr r0, [sp, #4]
    cmp r0, #0
    beq.n .Lfunc_0010327C_aa
    .inst.n 0x1ea4 @ subs r4, r4, #2
    b.n .Lfunc_0010327C_ac
.Lfunc_0010327C_aa:
    ldr r4, [sp, #16]
.Lfunc_0010327C_ac:
    ldr r0, [sp, #20]
    str r4, [r0, #0]
.Lfunc_0010327C_b0:
    ldr r0, [sp, #8]
    cmp r0, #0
    beq.n .Lfunc_0010327C_c6
    blx func_002FED78
    movs r1, #2
    str r1, [r0, #0]
    .inst.n 0x1ec8 @ subs r0, r1, #3
    movs r1, r0
.Lfunc_0010327C_c2:
    add sp, #28
    pop {r4, r5, r6, r7, pc}
.Lfunc_0010327C_c6:
    ldr r2, [sp, #0]
    lsrs r0, r7, #16
    lsls r1, r6, #16
    orrs r1, r0
    lsls r0, r7, #16
    orrs r0, r2
    b.n .Lfunc_0010327C_c2
.size func_0010327C, .-func_0010327C

.section .text.func_001033C4, "ax", %progbits
.balign 2
.global func_001033C4
.type func_001033C4, %function
.thumb_func
func_001033C4:
    push {r0, r1, r2, r4, r5, r6, r7, lr}
    movs r5, r0
    sub sp, #8
    movs r0, #0
    str r0, [sp, #0]
    ldr r7, [r2, #0]
    movs r4, r2
    cmp r7, #0
    bgt.n .Lfunc_001033C4_42
    ldr r1, [r4, #28]
    ldr r0, [sp, #12]
    movs r6, #1
    lsls r6, r6, #23
    cmp r1, r0
    bcs.n .Lfunc_001033C4_24
    ldr r0, [r4, #12]
    orrs r0, r6
    str r0, [r4, #12]
.Lfunc_001033C4_24:
    movs r0, r2
    bl func_00302452
    ldr r1, [r4, #12]
    bics r1, r6
    .inst.n 0x1c82 @ adds r2, r0, #2
    str r1, [r4, #12]
    beq.n .Lfunc_001033C4_6e
    .inst.n 0x1c41 @ adds r1, r0, #1
    beq.n .Lfunc_001033C4_d8
    ldr r7, [r4, #0]
    strb r0, [r5, #0]
    .inst.n 0x1c6d @ adds r5, r5, #1
    movs r0, #1
    str r0, [sp, #0]
.Lfunc_001033C4_42:
    ldr r1, [sp, #0]
    ldr r0, [sp, #12]
    movs r6, r7
    subs r0, r0, r1
    cmp r0, r6
    bcs.n .Lfunc_001033C4_50
    movs r6, r0
.Lfunc_001033C4_50:
    ldr r1, [r4, #4]
    movs r2, r6
    movs r0, r5
    blx func_00300B28
    ldr r1, [r4, #4]
    subs r0, r7, r6
    adds r1, r1, r6
    str r1, [r4, #4]
    ldr r1, [sp, #0]
    str r0, [r4, #0]
    adds r1, r1, r6
    movs r0, r1
.Lfunc_001033C4_6a:
    add sp, #20
    pop {r4, r5, r6, r7, pc}
.Lfunc_001033C4_6e:
    lsls r0, r1, #26
    bpl.n .Lfunc_001033C4_76
    ldr r6, [r4, #40]
    b.n .Lfunc_001033C4_80
.Lfunc_001033C4_76:
    ldr r1, [r4, #24]
    ldr r0, [r4, #4]
    adds r0, r0, r1
    ldr r1, [r4, #16]
    subs r6, r0, r1
.Lfunc_001033C4_80:
    ldr r1, [sp, #12]
    movs r2, r4
    movs r0, r5
    bl func_003023F0
    cmp r0, #0
    ble.n .Lfunc_001033C4_b8
    adds r5, r5, r0
    str r0, [sp, #0]
    adds r0, r6, r0
    .inst.n 0x1e40 @ subs r0, r0, #1
    str r0, [r4, #24]
    movs r0, r5
    subs r0, #32
    ldr r1, [r4, #16]
    ldrb r0, [r0, #31]
    movs r7, #0
    strb r0, [r1, #0]
    ldr r0, [r4, #16]
    movs r1, #1
    .inst.n 0x1c40 @ adds r0, r0, #1
    str r0, [r4, #44]
    str r0, [r4, #4]
    ldr r0, [r4, #12]
    lsls r1, r1, #17
    orrs r0, r1
    str r0, [r4, #12]
    b.n .Lfunc_001033C4_42
.Lfunc_001033C4_b8:
    movs r0, r4
    bl func_0030242A
    str r6, [r4, #24]
    ldr r0, [r4, #16]
    str r0, [r4, #4]
    str r0, [r4, #44]
    ldr r1, [r4, #12]
    movs r0, #1
    lsls r0, r0, #17
    bics r1, r0
    str r1, [r4, #12]
    ldr r0, [r4, #28]
    negs r0, r0
    str r0, [r4, #8]
    b.n .Lfunc_001033C4_42
.Lfunc_001033C4_d8:
    movs r0, #0
    b.n .Lfunc_001033C4_6a
.size func_001033C4, .-func_001033C4

.section .text.func_002FFD48, "ax", %progbits
.balign 2
.global func_002FFD48
.type func_002FFD48, %function
.thumb_func
func_002FFD48:
    push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
    sub sp, #28
    movs r4, r2
    movs r7, r0
    movs r0, #0
    movs r5, r7
    adds r5, #8
    movs r6, r0
    str r0, [r7, #0]
    cmp r2, #0
    str r0, [r7, #4]
    beq.n .Lfunc_002FFD48_20
    lsls r0, r4, #2
    bl func_002FF094
    b.n .Lfunc_002FFD48_22
.Lfunc_002FFD48_20:
    movs r0, #0
.Lfunc_002FFD48_22:
    str r4, [r5, #4]
    str r0, [r5, #0]
    b.n .Lfunc_002FFD48_34
.Lfunc_002FFD48_28:
    movs r0, r4
    ldr r1, [r5, #0]
    .inst.n 0x1e64 @ subs r4, r4, #1
    lsls r0, r0, #2
    .inst.n 0x1f00 @ subs r0, r0, #4
    str r6, [r1, r0]
.Lfunc_002FFD48_34:
    cmp r4, #0
    bne.n .Lfunc_002FFD48_28
    movs r0, #0
    str r0, [r5, #8]
    str r0, [r5, #12]
    str r0, [r5, #16]
    ldr r0, [sp, #40]
    str r0, [r5, #20]
    ldr r0, [sp, #32]
    movs r4, r5
    subs r4, #8
    cmp r0, #0
    beq.n .Lfunc_002FFD48_64
    blx func_002FF034
    .inst.n 0x1c45 @ adds r5, r0, #1
    movs r0, r5
    bl func_002FF094
    ldr r1, [sp, #32]
    movs r2, r5
    blx func_00300980
    str r0, [r4, #24]
.Lfunc_002FFD48_64:
    movs r0, #6
    str r0, [sp, #0]
    add r0, sp, #20
    nop @ (mov r8, r8)
    nop @ (mov r8, r8)
    movs r1, r0
    add r0, sp, #8
    bl func_0030098C
    str r0, [sp, #12]
    ldr r3, [pc, #100]
    ldr r2, [pc, #104]
    ldr r1, [sp, #0]
    movs r0, #4
    bl func_0030099C
    ldr r5, [r4, #4]
    movs r7, r0
    cmp r5, #6
    bcc.n .Lfunc_002FFD48_8e
    ldr r5, [sp, #0]
.Lfunc_002FFD48_8e:
    ldr r6, [r4, #0]
    lsls r0, r5, #2
    str r7, [sp, #4]
    str r0, [sp, #16]
    b.n .Lfunc_002FFD48_a8
.Lfunc_002FFD48_98:
    ldr r0, [sp, #4]
    movs r1, r6
    bl func_003009B0
    ldr r0, [sp, #4]
    .inst.n 0x1d36 @ adds r6, r6, #4
    .inst.n 0x1d00 @ adds r0, r0, #4
    str r0, [sp, #4]
.Lfunc_002FFD48_a8:
    ldr r1, [r4, #0]
    ldr r0, [sp, #16]
    adds r0, r1, r0
    cmp r0, r6
    bne.n .Lfunc_002FFD48_98
    b.n .Lfunc_002FFD48_c0
.Lfunc_002FFD48_b4:
    lsls r0, r5, #2
    ldr r1, [sp, #12]
    adds r0, r0, r7
    .inst.n 0x1c6d @ adds r5, r5, #1
    bl func_003009B0
.Lfunc_002FFD48_c0:
    ldr r0, [sp, #0]
    cmp r5, r0
    bcc.n .Lfunc_002FFD48_b4
    ldr r1, [pc, #24]
    ldr r0, [r4, #0]
    bl func_003009F4
    ldr r0, [sp, #0]
    str r7, [r4, #0]
    str r0, [r4, #4]
    add r0, sp, #8
    bl func_002FF86C
    movs r0, r4
    add sp, #44
    pop {r4, r5, r6, r7, pc}
.size func_002FFD48, .-func_002FFD48

.section .text.func_00100F5E, "ax", %progbits
.balign 2
.global func_00100F5E
.type func_00100F5E, %function
.thumb_func
func_00100F5E:
    push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
    sub sp, #12
    movs r4, r2
    movs r7, #0
    ldr r0, [r2, #4]
    movs r6, r7
    str r0, [sp, #4]
    ldr r0, [r2, #8]
    str r0, [sp, #0]
    ldr r1, [r2, #24]
    ldr r0, [sp, #16]
    blx r1
    movs r5, r0
    ldr r1, [sp, #48]
    ldr r0, [sp, #24]
    orrs r0, r1
    beq.n .Lfunc_00100F5E_2e
    b.n .Lfunc_00100F5E_38
.Lfunc_00100F5E_24:
    ldr r1, [r4, #24]
    ldr r0, [sp, #16]
    .inst.n 0x1c76 @ adds r6, r6, #1
    blx r1
    movs r5, r0
.Lfunc_00100F5E_2e:
    ldr r1, [r4, #32]
    movs r0, r5
    blx r1
    cmp r0, #0
    bne.n .Lfunc_00100F5E_24
.Lfunc_00100F5E_38:
    .inst.n 0x1c68 @ adds r0, r5, #1
    beq.n .Lfunc_00100F5E_44
    ldr r0, [sp, #4]
    lsls r0, r0, #31
    beq.n .Lfunc_00100F5E_4c
    b.n .Lfunc_00100F5E_70
.Lfunc_00100F5E_44:
    movs r0, #0
    mvns r0, r0
.Lfunc_00100F5E_48:
    add sp, #28
    pop {r4, r5, r6, r7, pc}
.Lfunc_00100F5E_4c:
    ldr r0, [r4, #0]
    .inst.n 0x1d01 @ adds r1, r0, #4
    str r1, [r4, #0]
    ldr r7, [r0, #0]
    b.n .Lfunc_00100F5E_70
.Lfunc_00100F5E_56:
    ldr r0, [sp, #4]
    lsls r0, r0, #31
    bne.n .Lfunc_00100F5E_60
    strb r5, [r7, #0]
    .inst.n 0x1c7f @ adds r7, r7, #1
.Lfunc_00100F5E_60:
    ldr r0, [sp, #0]
    .inst.n 0x1e40 @ subs r0, r0, #1
    str r0, [sp, #0]
    ldr r1, [r4, #24]
    ldr r0, [sp, #16]
    .inst.n 0x1c76 @ adds r6, r6, #1
    blx r1
    movs r5, r0
.Lfunc_00100F5E_70:
    ldr r0, [sp, #0]
    cmp r0, #0
    ble.n .Lfunc_00100F5E_b0
    .inst.n 0x1c68 @ adds r0, r5, #1
    beq.n .Lfunc_00100F5E_b0
    ldr r0, [sp, #24]
    cmp r0, #0
    beq.n .Lfunc_00100F5E_a0
    asrs r0, r5, #31
    lsrs r0, r0, #27
    adds r0, r0, r5
    asrs r1, r0, #5
    lsrs r0, r0, #5
    lsls r2, r1, #2
    ldr r1, [sp, #24]
    lsls r0, r0, #5
    adds r1, r2, r1
    subs r2, r5, r0
    ldr r1, [r1, #0]
    movs r0, #1
    lsls r0, r2
    tst r1, r0
    bne.n .Lfunc_00100F5E_56
    b.n .Lfunc_00100F5E_b0
.Lfunc_00100F5E_a0:
    ldr r0, [sp, #48]
    cmp r0, #0
    bne.n .Lfunc_00100F5E_56
    ldr r1, [r4, #32]
    movs r0, r5
    blx r1
    cmp r0, #0
    beq.n .Lfunc_00100F5E_56
.Lfunc_00100F5E_b0:
    ldr r1, [r4, #28]
    ldr r0, [sp, #16]
    blx r1
    ldr r0, [sp, #4]
    ldr r1, [sp, #48]
    lsls r0, r0, #31
    lsrs r0, r0, #31
    orrs r0, r1
    bne.n .Lfunc_00100F5E_c4
    strb r0, [r7, #0]
.Lfunc_00100F5E_c4:
    ldr r1, [r4, #8]
    ldr r0, [sp, #0]
    cmp r1, r0
    ble.n .Lfunc_00100F5E_d8
    ldr r0, [sp, #48]
    cmp r0, #0
    beq.n .Lfunc_00100F5E_de
    ldr r0, [sp, #0]
    cmp r0, #0
    beq.n .Lfunc_00100F5E_de
.Lfunc_00100F5E_d8:
    movs r0, #1
    mvns r0, r0
    b.n .Lfunc_00100F5E_48
.Lfunc_00100F5E_de:
    movs r0, r6
    b.n .Lfunc_00100F5E_48
.size func_00100F5E, .-func_00100F5E
