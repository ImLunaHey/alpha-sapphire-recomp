.syntax unified
.arch armv6k
.fpu vfpv2
.thumb

.section .text.func_002FEE54, "ax", %progbits
.balign 2
.global func_002FEE54
.type func_002FEE54, %function
.thumb_func
func_002FEE54:
    push {r0, r1, r4, r5, r6, r7, lr}
    movs r4, r0
    movs r0, #0
    sub sp, #4
    b .Lcount
.Lloop:
    ldr r1, [r4, #12]
    movs r0, r4
    blx r1
    cmp r0, #0
    beq .Ldone_jump
    cmp r0, #37
    beq .Lpercent
    ldr r2, [r4, #4]
    ldr r1, [r4, #8]
    b .Ldispatch
.Lpercent:
    ldr r7, [pc, #356]
    movs r6, #0
    add r7, pc
.Lflag_loop:
    ldr r1, [r4, #12]
    movs r0, r4
    blx r1
    movs r5, r0
    cmp r0, #32
    blt .Lflags_done
    cmp r5, #49
    bcs .Lflags_done
    adds r0, r7, r5
    subs r0, #32
    ldrb r0, [r0, #0]
    cmp r0, #0
    beq .Lflags_done
    orrs r6, r0
    b .Lflag_loop
.Lflags_done:
    lsls r0, r6, #30
    bpl .Lflags_adjusted
    movs r0, #4
    bics r6, r0
.Lflags_adjusted:
    movs r0, #0
    str r0, [r4, #28]
    movs r7, r0
    str r0, [r4, #24]
.Lwidth_loop:
    cmp r5, #42
    beq .Lstar_width
    movs r0, r5
    bl func_002FFB94
    cmp r0, #0
    beq .Lwidth_done
    subs r5, #48
    lsls r0, r7, #2
    adds r0, r0, r4
    str r0, [sp, #0]
    str r5, [r0, #24]
    b .Ldigit_loop
.Lstar_width:
    ldr r0, [sp, #8]
    lsls r2, r7, #2
    adds r2, r2, r4
    ldmia r0!, {r1}
    str r1, [r2, #24]
    str r0, [sp, #8]
    ldr r1, [r4, #12]
    movs r0, r4
    blx r1
    movs r5, r0
    cmp r7, #1
    bne .Lprecision_check
    ldr r0, [r4, #28]
    cmp r0, #0
    bge .Lwidths_complete
    movs r0, #32
    bics r6, r0
    b .Lwidths_complete
.Laccumulate:
    ldr r0, [sp, #0]
    movs r1, #10
    ldr r0, [r0, #24]
    muls r0, r1
    ldr r1, [sp, #0]
    adds r0, r0, r5
    subs r0, #48
    str r0, [r1, #24]
.Ldigit_loop:
    ldr r1, [r4, #12]
    movs r0, r4
    blx r1
    movs r5, r0
    bl func_002FFB94
    cmp r0, #0
    bne .Laccumulate
.Lwidth_done:
    cmp r7, #1
    beq .Lwidths_complete
.Lprecision_check:
    cmp r5, #46
    bne .Lwidths_complete
    ldr r1, [r4, #12]
    movs r0, r4
    blx r1
    movs r5, r0
    movs r0, #32
    orrs r6, r0
    .inst.n 0x1c7f @ adds r7, r7, #1
    cmp r7, #2
    blt .Lwidth_loop
.Lwidths_complete:
    ldr r0, [r4, #24]
    cmp r0, #0
    bge .Lpositive_width
    negs r0, r0
    str r0, [r4, #24]
    movs r0, #1
    orrs r6, r0
.Lpositive_width:
    lsls r0, r6, #31
    beq .Lflags_final
    movs r0, #16
    bics r6, r0
.Lflags_final:
    cmp r5, #108
    beq .Llength_modifier
    cmp r5, #104
    beq .Llength_modifier
    cmp r5, #76
    beq .Lzero_flag
    cmp r5, #106
    beq .Lwide_flag
    cmp r5, #116
    beq .Lzero_flag
    cmp r5, #122
    beq .Lzero_flag
    b .Lcase_check
.Ldone_jump:
    b .Ldone
.Llength_modifier:
    ldr r1, [r4, #12]
    movs r7, r5
    movs r0, r4
    blx r1
    movs r5, r0
    cmp r0, r7
    bne .Llength_mismatch
    cmp r7, #108
    beq .Lwide_flag
    movs r0, #1
    lsls r0, r0, #10
.Lapply_length_flag:
    ldr r1, [r4, #12]
    orrs r6, r0
    movs r0, r4
    blx r1
    movs r5, r0
    b .Lcase_check
.Llength_mismatch:
    cmp r7, #108
    beq .Llong_flag
    movs r0, #255
    adds r0, #1
.Lset_length_flag:
    orrs r6, r0
.Lcase_check:
    cmp r5, #0
    beq .Ldone
    movs r0, r5
    subs r0, #65
    cmp r0, #25
    bhi .Lstore_flags
    movs r0, #1
    lsls r0, r0, #11
    orrs r6, r0
    adds r5, #32
.Lstore_flags:
    str r6, [r4, #0]
    ldr r2, [sp, #8]
    movs r1, r5
    movs r0, r4
    movs r6, r2
    blx arm_secondary_00106078
    cmp r0, #0
    beq .Ldispatch_ready
    cmp r0, #1
    beq .Ladvance_four
    .inst.n 0x1df6 @ adds r6, r6, #7
    lsrs r0, r6, #3
    lsls r0, r0, #3
    adds r0, #8
    str r0, [sp, #8]
    b .Lloop
.Llong_flag:
    movs r0, #64
    b .Lset_length_flag
.Lwide_flag:
    movs r0, #128
    b .Lapply_length_flag
.Lzero_flag:
    movs r0, #0
    b .Lapply_length_flag
.Ladvance_four:
    .inst.n 0x1d36 @ adds r6, r6, #4
    str r6, [sp, #8]
    b .Lloop
.Ldispatch_ready:
    ldr r2, [r4, #4]
    ldr r1, [r4, #8]
    movs r0, r5
.Ldispatch:
    blx r2
    ldr r0, [r4, #32]
    .inst.n 0x1c40 @ adds r0, r0, #1
.Lcount:
    str r0, [r4, #32]
    b .Lloop
.Ldone:
    ldr r0, [r4, #32]
    pop {r1, r2, r3, r4, r5, r6, r7, pc}
.size func_002FEE54, . - func_002FEE54

.global func_002FFB94
.type func_002FFB94, %function
.global arm_secondary_00106078
.type arm_secondary_00106078, %function
