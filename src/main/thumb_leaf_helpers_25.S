.syntax unified
.arch armv6k
.fpu vfpv2
.thumb

.section .text.func_00302452, "ax", %progbits
.balign 2
.global func_00302452
.type func_00302452, %function
.thumb_func
func_00302452:
    push {r1, r2, r3, r4, r5, r6, r7, lr}
    movs r4, r0
    movs r1, #1
    ldr r0, [r0, #12]
    lsls r1, r1, #22
    ldr r3, [pc, #472]
    orrs r0, r1
    str r0, [r4, #12]
    lsls r1, r0, #12
    bpl .L00302452_0036
    asrs r1, r3, #2
    bics r0, r1
    str r0, [r4, #12]
    lsls r1, r0, #26
    bmi .L00302452_002c
    ldr r2, [r4, #44]
    ldr r1, [r4, #4]
    cmp r2, r1
    bhi .L00302452_0028
    movs r2, r1
.L00302452_0028:
    subs r1, r2, r1
    str r1, [r4, #0]
.L00302452_002c:
    orrs r0, r3
    str r0, [r4, #12]
    adds r4, #32
    ldrb r0, [r4, #5]
    pop {r1, r2, r3, r4, r5, r6, r7, pc}
.L00302452_0036:
    bics r0, r3
    str r0, [r4, #12]
    lsls r0, r0, #26
    bpl .L00302452_0044
    movs r0, r4
    bl func_00301DC8
.L00302452_0044:
    ldr r1, [pc, #420]
    ldr r0, [r4, #12]
    ands r1, r0
    cmp r1, #1
    beq .L00302452_0056
.L00302452_004e:
    movs r0, r4
    bl func_00301D1C
    b .L00302452_01d6
.L00302452_0056:
    ldr r1, [r4, #0]
    movs r6, #0
    cmp r1, #0
    bge .L00302452_0076
    mvns r1, r1
    str r1, [r4, #0]
    movs r1, #1
    str r6, [r4, #8]
    lsls r1, r1, #12
    orrs r0, r1
    str r0, [r4, #12]
    ldr r0, [r4, #4]
    .inst.n 0x1c41
    str r1, [r4, #4]
    ldrb r0, [r0, #0]
    pop {r1, r2, r3, r4, r5, r6, r7, pc}
.L00302452_0076:
    ldr r1, [pc, #372]
    tst r0, r1
    beq .L00302452_0098
    movs r1, #5
    str r6, [r4, #0]
    lsls r1, r1, #12
    bics r0, r1
    movs r1, #64
    orrs r0, r1
    str r0, [r4, #12]
    ldr r1, [r4, #16]
    ldr r0, [r4, #4]
    subs r0, r0, r1
    ldr r1, [r4, #28]
    subs r0, r0, r1
    str r0, [r4, #8]
    b .L00302452_01d6
.L00302452_0098:
    ldr r1, [r4, #16]
    cmp r1, #0
    bne .L00302452_00ca
    lsls r0, r0, #15
    bmi .L00302452_00ca
    ldr r0, [r4, #28]
    blx func_002FECF8
    cmp r0, #0
    str r0, [r4, #16]
    beq .L00302452_00e0
    ldr r0, [r4, #12]
    movs r1, #1
    lsls r1, r1, #11
    orrs r0, r1
    str r0, [r4, #12]
    lsls r1, r0, #22
    lsrs r1, r1, #30
    bne .L00302452_00c6
    movs r1, #255
    adds r1, #1
.L00302452_00c2:
    orrs r0, r1
    str r0, [r4, #12]
.L00302452_00c6:
    ldr r0, [r4, #16]
    str r0, [r4, #4]
.L00302452_00ca:
    ldr r0, [r4, #20]
    str r0, [sp, #0]
    ldr r0, [r4, #12]
    lsls r1, r0, #27
    bpl .L00302452_010c
    lsls r0, r0, #15
    bpl .L00302452_00f8
    movs r0, r4
    bl func_00301D7C
    b .L00302452_010c
.L00302452_00e0:
    movs r0, r4
    adds r0, #36
    str r0, [r4, #16]
    movs r0, #1
    str r0, [r4, #28]
    ldr r0, [r4, #12]
    movs r1, #3
    lsls r1, r1, #8
    bics r0, r1
    movs r1, #1
    lsls r1, r1, #10
    b .L00302452_00c2
.L00302452_00f8:
    ldr r1, [r4, #16]
    ldr r0, [r4, #4]
    subs r0, r0, r1
    ldr r1, [r4, #24]
    adds r1, r0, r1
    ldr r0, [sp, #0]
    blx func_003022C8
    cmp r0, #0
    blt .L00302452_004e
.L00302452_010c:
    ldr r0, [r4, #12]
    lsls r0, r0, #15
    bpl .L00302452_0168
    ldr r1, [r4, #4]
    ldr r0, [r4, #44]
    cmp r0, r1
    bhi .L00302452_011c
    movs r0, r1
.L00302452_011c:
    ldr r1, [r4, #16]
    subs r5, r0, r1
    ldr r0, [r4, #28]
    subs r7, r0, r5
    beq .L00302452_015e
    ldr r0, [r4, #24]
    str r0, [sp, #4]
    movs r0, r4
    bl func_00301D7C
    ldr r0, [sp, #4]
    adds r1, r0, r5
    str r0, [r4, #24]
    ldr r0, [sp, #0]
    blx func_003022C8
    cmp r0, #0
    blt .L00302452_004e
    ldr r0, [r4, #12]
    movs r1, #1
    lsls r1, r1, #17
    orrs r0, r1
    str r0, [r4, #12]
    lsls r0, r0, #8
    bpl .L00302452_0154
    ldr r0, [r4, #24]
    adds r0, r0, r5
    str r0, [r4, #24]
.L00302452_0154:
    ldr r1, [r4, #28]
    ldr r0, [r4, #16]
    subs r1, r1, r7
    adds r5, r0, r1
    b .L00302452_017a
.L00302452_015e:
    movs r0, r4
    bl func_00301D7C
    ldr r7, [r4, #28]
    b .L00302452_0154
.L00302452_0168:
    ldr r5, [r4, #16]
    ldr r1, [r4, #4]
    ldr r0, [r4, #24]
    ldr r7, [r4, #28]
    subs r1, r1, r5
    str r5, [r4, #44]
    adds r0, r0, r1
    str r5, [r4, #4]
    str r0, [r4, #24]
.L00302452_017a:
    ldr r0, [r4, #12]
    movs r1, #16
    bics r0, r1
    str r0, [r4, #12]
    lsls r0, r0, #21
    lsrs r0, r0, #30
    beq .L00302452_018e
    movs r0, r4
    bl func_00103568
.L00302452_018e:
    ldr r0, [r4, #12]
    movs r1, #1
    str r6, [r4, #8]
    lsls r1, r1, #12
    orrs r0, r1
    str r0, [r4, #12]
    lsls r0, r0, #8
    bpl .L00302452_01aa
    ldr r0, [r4, #16]
    str r0, [r4, #44]
    str r0, [r4, #4]
    movs r0, #1
    mvns r0, r0
    pop {r1, r2, r3, r4, r5, r6, r7, pc}
.L00302452_01aa:
    movs r2, r4
    movs r1, r7
    movs r0, r5
    bl func_003023F0
    .inst.n 0x1c41
    beq .L00302452_01d6
    adds r1, r5, r0
    cmp r0, #0
    str r1, [r4, #44]
    beq .L00302452_01dc
    .inst.n 0x1e40
    str r0, [r4, #0]
    .inst.n 0x1c68
    str r0, [r4, #4]
    ldr r0, [r4, #12]
    movs r1, #1
    lsls r1, r1, #17
    orrs r0, r1
    str r0, [r4, #12]
    ldrb r0, [r5, #0]
    pop {r1, r2, r3, r4, r5, r6, r7, pc}
.L00302452_01d6:
    movs r0, #0
    mvns r0, r0
    pop {r1, r2, r3, r4, r5, r6, r7, pc}
.L00302452_01dc:
    movs r0, r4
    str r5, [r4, #4]
    bl func_0030242A
    b .L00302452_01d6
.size func_00302452, . - func_00302452

.type func_00301DC8, %function
.type func_00301D1C, %function
.type func_002FECF8, %function
.type func_00301D7C, %function
.type func_003022C8, %function
.type func_00103568, %function
.type func_003023F0, %function
.type func_0030242A, %function
