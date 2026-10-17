.syntax unified
.thumb

.section .text.func_0010068E, "ax", %progbits
.balign 2
.global func_0010068E
.type func_0010068E, %function
.thumb_func
func_0010068E:
    push {r4, lr}
    movs r4, r0
    cmp r0, #255
    bls.n .L10068E_0c
    movs r0, #0
    pop {r4, pc}
.L10068E_0c:
    blx func_002FEDF0
    ldr r0, [r0, #0]
    movs r1, #152
    ldrb r0, [r0, r4]
    tst r0, r1
    beq.n .L10068E_24
    lsls r1, r0, #31
    bne.n .L10068E_24
    movs r1, #1
    lsls r1, r1, #10
    orrs r0, r1
.L10068E_24:
    movs r1, #33
    lsls r1, r1, #5
    tst r0, r1
    beq.n .L10068E_32
    movs r1, #1
    lsls r1, r1, #11
    orrs r0, r1
.L10068E_32:
    movs r1, #186
    tst r0, r1
    beq.n .L10068E_3e
    movs r1, #255
    adds r1, #1
    orrs r0, r1
.L10068E_3e:
    movs r1, #190
    tst r0, r1
    beq.n .L10068E_4a
    movs r1, #1
    lsls r1, r1, #9
    orrs r0, r1
.L10068E_4a:
    lsls r1, r0, #26
    bpl.n .L10068E_58
    lsls r1, r0, #24
    bmi.n .L10068E_58
    movs r1, #128
    orrs r0, r1
    b.n .L10068E_5c
.L10068E_58:
    movs r1, #32
    bics r0, r1
.L10068E_5c:
    lsls r1, r0, #31
    beq.n .L10068E_64
    lsls r1, r0, #25
    bpl.n .L10068E_68
.L10068E_64:
    cmp r4, #9
    bne.n .L10068E_0a
.L10068E_68:
    movs r1, #1
    lsls r1, r1, #12
    orrs r0, r1
    pop {r4, pc}
.L10068E_0a = func_0010068E + 0x0a
.size func_0010068E, . - func_0010068E

.section .text.func_00302FB6, "ax", %progbits
.balign 2
.global func_00302FB6
.type func_00302FB6, %function
.thumb_func
func_00302FB6:
    push {r3, r4, r5, r6, r7, lr}
    movs r4, r0
    movs r5, r1
    movs r6, r2
    movs r0, r2
    movs r1, #0
    str r2, [r4, #0]
    bl func_00302F28
    cmp r0, #0
    str r0, [r4, #4]
    beq.n .L302FB6_2c
    blx func_002FF034
    /* Thumb16 ADDS (immediate3): imm3=1, Rn=r0, Rd=r0. */
    .inst.n (0x1c00 | (1 << 6) | (0 << 3) | 0)
    bl func_002FF094
    ldr r1, [r4, #4]
    movs r7, r0
    blx func_002FF09C
    str r7, [r4, #4]
.L302FB6_2c:
    movs r1, r5
    movs r0, r6
    bl func_00302F28
    movs r0, r4
    pop {r3, r4, r5, r6, r7, pc}
.size func_00302FB6, . - func_00302FB6

.section .note.GNU-stack, "", %progbits
