.syntax unified
.arch armv6k
.thumb

.extern func_00101CC8
.type func_00101CC8, %function
.extern func_002FED9A
.type func_002FED9A, %function
.extern func_002FEDC0
.type func_002FEDC0, %function
.extern func_002FF094
.type func_002FF094, %function
.extern func_002FF7F8
.type func_002FF7F8, %function
.extern func_002FF988
.type func_002FF988, %function
.extern func_002FFA44
.type func_002FFA44, %function
.extern func_002FFB14
.type func_002FFB14, %function
.extern func_002FFBAE
.type func_002FFBAE, %function
.extern func_002FFBD4
.type func_002FFBD4, %function
.extern func_002FFE30
.type func_002FFE30, %function
.extern func_002FFE4A
.type func_002FFE4A, %function
.extern func_00301D1C
.type func_00301D1C, %function
.extern func_00301D30
.type func_00301D30, %function
.extern func_00301D7C
.type func_00301D7C, %function
.extern func_00301E0C
.type func_00301E0C, %function
.extern func_00301F00
.type func_00301F00, %function
.extern func_003021A4
.type func_003021A4, %function
.extern func_003021BE
.type func_003021BE, %function
.extern func_003034CC
.type func_003034CC, %function
.extern func_002FED78
.extern func_002FEDF0
.extern func_002FF10C
.extern func_002FF7EC
.extern func_002FF8C0
.extern func_00302334
.extern func_00503264

.section .text.func_001004B8, "ax", %progbits
.balign 2
.global func_001004B8
.type func_001004B8, %function
.thumb_func
func_001004B8:
    push {r2, r3, r4, r5, r6, lr}
    movs r5, r2
    movs r4, r1
    movs r2, r3
    cmp r1, #0
    str r0, [sp, #0]
    beq.n .Lfunc_001004B8_14
    lsls r1, r4, #1
    adds r0, r1, r0
    .inst.n 0x1e80 @ subs r0, r0, #2 (Thumb16 imm3)
.Lfunc_001004B8_14:
    ldr r3, [pc, #44]
    add r3, pc
    mov r1, sp
    str r0, [sp, #4]
    movs r0, r5
    bl func_002FED9A
    movs r5, r0
    cmp r4, #0
    beq.n .Lfunc_001004B8_36
    mov r1, sp
    ldr r0, [sp, #4]
    .inst.n 0x1c80 @ adds r0, r0, #2 (Thumb16 imm3)
    str r0, [sp, #4]
    movs r0, #0
    bl func_002FEDC0
.Lfunc_001004B8_36:
    cmp r5, r4
    bcc.n .Lfunc_001004B8_40
    movs r0, #0
    mvns r0, r0
    pop {r2, r3, r4, r5, r6, pc}
.Lfunc_001004B8_40:
    movs r0, r5
    pop {r2, r3, r4, r5, r6, pc}
.size func_001004B8, . - func_001004B8

.section .text.func_00100A5C, "ax", %progbits
.balign 2
.global func_00100A5C
.type func_00100A5C, %function
.thumb_func
func_00100A5C:
    push {r4, r5, r6, lr}
    movs r1, #0
    movs r4, r0
    adds r4, #36
    b.n .Lfunc_00100A5C_1c
.Lfunc_00100A5C_a:
    lsls r5, r2, #29
    lsrs r2, r2, #3
    lsrs r5, r5, #29
    adds r5, #48
    strb r5, [r4, r1]
    lsls r5, r3, #29
    .inst.n 0x1c49 @ adds r1, r1, #1 (Thumb16 imm3)
    orrs r2, r5
    lsrs r3, r3, #3
.Lfunc_00100A5C_1c:
    movs r5, r2
    orrs r5, r3
    bne.n .Lfunc_00100A5C_a
    ldr r4, [r0, #0]
    movs r3, #0
    add r2, pc, #64
    lsls r5, r4, #28
    bpl.n .Lfunc_00100A5C_3e
    movs r5, #32
    ands r4, r5
    orrs r4, r1
    beq.n .Lfunc_00100A5C_3e
    ldr r4, [r0, #28]
    movs r3, #1
    add r2, pc, #48
    .inst.n 0x1e64 @ subs r4, r4, #1 (Thumb16 imm3)
    str r4, [r0, #28]
.Lfunc_00100A5C_3e:
    bl func_002FF988
    pop {r4, r5, r6, pc}
.size func_00100A5C, . - func_00100A5C

.section .text.func_00100BE4, "ax", %progbits
.balign 2
.global func_00100BE4
.type func_00100BE4, %function
.thumb_func
func_00100BE4:
    push {r2, r3, r4, r5, r6, lr}
    movs r5, r2
    movs r4, r1
    movs r2, r3
    cmp r1, #0
    str r0, [sp, #0]
    beq.n .Lfunc_00100BE4_12
    adds r0, r0, r4
    .inst.n 0x1e40 @ subs r0, r0, #1 (Thumb16 imm3)
.Lfunc_00100BE4_12:
    ldr r3, [pc, #32]
    add r3, pc
    mov r1, sp
    str r0, [sp, #4]
    movs r0, r5
    bl func_002FFBAE
    movs r5, r0
    cmp r4, #0
    beq.n .Lfunc_00100BE4_2e
    mov r1, sp
    movs r0, #0
    bl func_002FFBD4
.Lfunc_00100BE4_2e:
    movs r0, r5
    pop {r2, r3, r4, r5, r6, pc}
.size func_00100BE4, . - func_00100BE4

.section .text.func_0010130A, "ax", %progbits
.balign 2
.global func_0010130A
.type func_0010130A, %function
.thumb_func
func_0010130A:
    push {r0, r1, r2, r3, r4, r5, r6, lr}
    lsrs r2, r1, #3
    sub sp, #8
    movs r6, r0
    lsrs r0, r1, #1
    adds r0, r0, r1
    movs r5, r3
    adds r4, r0, r2
    adds r1, #32
    cmp r1, r4
    bls.n .Lfunc_0010130A_18
    movs r4, r1
.Lfunc_0010130A_18:
    add r1, sp, #16
    mov r0, sp
    str r4, [sp, #0]
    bl func_002FFE4A
    ldr r1, [r0, #0]
    movs r2, r5
    movs r0, r6
    bl func_002FFB14
    adds r0, #12
    add sp, #24
    pop {r4, r5, r6, pc}
.size func_0010130A, . - func_0010130A

.section .text.func_0010277C, "ax", %progbits
.balign 2
.global func_0010277C
.type func_0010277C, %function
.thumb_func
func_0010277C:
    push {r0, r1, r2, r3}
    push {r2, r3, r4, r5, r6, lr}
    movs r4, r1
    add r2, sp, #36
    str r0, [sp, #0]
    beq.n .Lfunc_0010277C_10
    adds r0, r0, r4
    .inst.n 0x1e40 @ subs r0, r0, #1 (Thumb16 imm3)
.Lfunc_0010277C_10:
    ldr r3, [pc, #36]
    add r3, pc
    mov r1, sp
    str r0, [sp, #4]
    ldr r0, [sp, #32]
    bl func_002FFBAE
    movs r5, r0
    cmp r4, #0
    beq.n .Lfunc_0010277C_2c
    mov r1, sp
    movs r0, #0
    bl func_002FFBD4
.Lfunc_0010277C_2c:
    movs r0, r5
    pop {r2, r3, r4, r5, r6}
    pop {r3}
    add sp, #16
    bx r3
.size func_0010277C, . - func_0010277C

.section .text.func_001027B8, "ax", %progbits
.balign 2
.global func_001027B8
.type func_001027B8, %function
.thumb_func
func_001027B8:
    push {r2, r3, r4, r5, r6, lr}
    movs r5, r2
    movs r4, r1
    movs r2, r3
    cmp r1, #0
    str r0, [sp, #0]
    beq.n .Lfunc_001027B8_12
    adds r0, r0, r4
    .inst.n 0x1e40 @ subs r0, r0, #1 (Thumb16 imm3)
.Lfunc_001027B8_12:
    ldr r3, [pc, #32]
    add r3, pc
    mov r1, sp
    str r0, [sp, #4]
    movs r0, r5
    bl func_002FFBAE
    movs r5, r0
    cmp r4, #0
    beq.n .Lfunc_001027B8_2e
    mov r1, sp
    movs r0, #0
    bl func_002FFBD4
.Lfunc_001027B8_2e:
    movs r0, r5
    pop {r2, r3, r4, r5, r6, pc}
.size func_001027B8, . - func_001027B8

.section .text.func_001027F0, "ax", %progbits
.balign 2
.global func_001027F0
.type func_001027F0, %function
.thumb_func
func_001027F0:
    push {r0, r1, r2, r3}
    push {r2, r3, r4, lr}
    ldr r3, [pc, #32]
    add r2, sp, #24
    add r3, pc
    mov r1, sp
    str r0, [sp, #0]
    ldr r0, [sp, #20]
    bl func_002FFBAE
    movs r4, r0
    mov r1, sp
    movs r0, #0
    bl func_002FFBD4
    movs r0, r4
    pop {r2, r3, r4}
    pop {r3}
    add sp, #16
    bx r3
.size func_001027F0, . - func_001027F0

.section .text.func_00102824, "ax", %progbits
.balign 2
.global func_00102824
.type func_00102824, %function
.thumb_func
func_00102824:
    push {r0, r1, r2, r3}
    push {r2, r3, r4, r5, r6, lr}
    movs r4, r1
    add r2, sp, #36
    str r0, [sp, #0]
    beq.n .Lfunc_00102824_10
    adds r0, r0, r4
    .inst.n 0x1e40 @ subs r0, r0, #1 (Thumb16 imm3)
.Lfunc_00102824_10:
    ldr r3, [pc, #36]
    add r3, pc
    mov r1, sp
    str r0, [sp, #4]
    ldr r0, [sp, #32]
    bl func_002FFBAE
    movs r5, r0
    cmp r4, #0
    beq.n .Lfunc_00102824_2c
    mov r1, sp
    movs r0, #0
    bl func_002FFBD4
.Lfunc_00102824_2c:
    movs r0, r5
    pop {r2, r3, r4, r5, r6}
    pop {r3}
    add sp, #16
    bx r3
.size func_00102824, . - func_00102824

.section .text.func_00102868, "ax", %progbits
.balign 2
.global func_00102868
.type func_00102868, %function
.thumb_func
func_00102868:
    push {r0, r1, r2, r3}
    push {r2, r3, r4, r5, r6, lr}
    movs r4, r1
    add r2, sp, #36
    str r0, [sp, #0]
    beq.n .Lfunc_00102868_12
    lsls r1, r4, #1
    adds r0, r1, r0
    .inst.n 0x1e80 @ subs r0, r0, #2 (Thumb16 imm3)
.Lfunc_00102868_12:
    ldr r3, [pc, #52]
    add r3, pc
    mov r1, sp
    str r0, [sp, #4]
    ldr r0, [sp, #32]
    bl func_002FED9A
    movs r5, r0
    cmp r4, #0
    beq.n .Lfunc_00102868_34
    mov r1, sp
    ldr r0, [sp, #4]
    .inst.n 0x1c80 @ adds r0, r0, #2 (Thumb16 imm3)
    str r0, [sp, #4]
    movs r0, #0
    bl func_002FEDC0
.Lfunc_00102868_34:
    cmp r5, r4
    bcc.n .Lfunc_00102868_44
    movs r0, #0
    mvns r0, r0
.Lfunc_00102868_3c:
    pop {r2, r3, r4, r5, r6}
    pop {r3}
    add sp, #16
    bx r3
.Lfunc_00102868_44:
    movs r0, r5
    b.n .Lfunc_00102868_3c
.size func_00102868, . - func_00102868

.section .text.func_001028B4, "ax", %progbits
.balign 2
.global func_001028B4
.type func_001028B4, %function
.thumb_func
func_001028B4:
    push {r0, r1, r2, r3}
    push {lr}
    sub sp, #52
    add r1, sp, #64
    str r0, [sp, #36]
    str r0, [sp, #44]
    movs r0, #0
    mvns r0, r0
    str r1, [sp, #0]
    str r0, [sp, #40]
    movs r0, #0
    str r0, [sp, #48]
    ldr r0, [pc, #28]
    add r0, pc
    str r0, [sp, #24]
    ldr r0, [pc, #28]
    add r0, pc
    mov r2, sp
    str r0, [sp, #28]
    ldr r1, [sp, #60]
    add r0, sp, #36
    bl func_002FFA44
    add sp, #52
    pop {r3}
    add sp, #16
    bx r3
.size func_001028B4, . - func_001028B4

.section .text.func_00102DB2, "ax", %progbits
.balign 2
.global func_00102DB2
.type func_00102DB2, %function
.thumb_func
func_00102DB2:
    push {r3, r4, r5, r6, r7, lr}
    movs r5, r0
    movs r6, r1
    movs r4, #0
    b.n .Lfunc_00102DB2_c
.Lfunc_00102DB2_a:
    .inst.n 0x1c64 @ adds r4, r4, #1 (Thumb16 imm3)
.Lfunc_00102DB2_c:
    ldrb r0, [r5, r4]
    bl func_003021A4
    movs r7, r0
    ldrb r0, [r6, r4]
    bl func_003021A4
    subs r0, r7, r0
    bne.n .Lfunc_00102DB2_24
    ldrb r1, [r5, r4]
    cmp r1, #0
    bne.n .Lfunc_00102DB2_a
.Lfunc_00102DB2_24:
    pop {r3, r4, r5, r6, r7, pc}
.size func_00102DB2, . - func_00102DB2

.section .text.func_00102EC8, "ax", %progbits
.balign 2
.global func_00102EC8
.type func_00102EC8, %function
.thumb_func
func_00102EC8:
    push {r3, r4, r5, r6, r7, lr}
    movs r6, r0
    movs r5, #0
    str r1, [sp, #0]
    b.n .Lfunc_00102EC8_c
.Lfunc_00102EC8_a:
    .inst.n 0x1c6d @ adds r5, r5, #1 (Thumb16 imm3)
.Lfunc_00102EC8_c:
    lsls r4, r5, #1
    ldrh r0, [r6, r4]
    bl func_003021BE
    movs r7, r0
    ldr r0, [sp, #0]
    ldrh r0, [r0, r4]
    bl func_003021BE
    subs r0, r7, r0
    bne.n .Lfunc_00102EC8_28
    ldrh r1, [r6, r4]
    cmp r1, #0
    bne.n .Lfunc_00102EC8_a
.Lfunc_00102EC8_28:
    pop {r3, r4, r5, r6, r7, pc}
.size func_00102EC8, . - func_00102EC8

.section .text.func_0010338E, "ax", %progbits
.balign 2
.global func_0010338E
.type func_0010338E, %function
.thumb_func
func_0010338E:
    push {r4, r5, r6, lr}
    movs r4, r0
    movs r5, r1
    blx func_002FF7EC
    ldr r1, [r0, #0]
    ldr r0, [r1, #0]
    cmp r0, #0
    beq.n .Lfunc_0010338E_2c
    adds r1, r1, r0
.Lfunc_0010338E_14:
    ldrb r0, [r4, #0]
    ldrb r3, [r5, #0]
    .inst.n 0x1c64 @ adds r4, r4, #1 (Thumb16 imm3)
    .inst.n 0x1c6d @ adds r5, r5, #1 (Thumb16 imm3)
    ldrb r2, [r1, r0]
    ldrb r3, [r1, r3]
    cmp r0, #0
    beq.n .Lfunc_0010338E_28
    cmp r2, r3
    beq.n .Lfunc_0010338E_14
.Lfunc_0010338E_28:
    subs r0, r2, r3
    pop {r4, r5, r6, pc}
.Lfunc_0010338E_2c:
    movs r1, r5
    movs r0, r4
    blx func_00302334
    pop {r4, r5, r6, pc}
.size func_0010338E, . - func_0010338E

.section .text.func_00103568, "ax", %progbits
.balign 2
.global func_00103568
.type func_00103568, %function
.thumb_func
func_00103568:
    push {r4, r5, r6, lr}
    ldr r4, [pc, #44]
    ldr r6, [pc, #44]
    movs r5, r0
    b.n .Lfunc_00103568_28
.Lfunc_00103568_a:
    ldr r0, [r4, #76]
    lsls r0, r0, #31
    beq.n .Lfunc_00103568_22
    cmp r4, r5
    beq.n .Lfunc_00103568_22
    ldr r0, [r4, #12]
    movs r1, r6
    bics r1, r0
    bne.n .Lfunc_00103568_22
    movs r0, r4
    bl func_00301F00
.Lfunc_00103568_22:
    ldr r0, [r4, #76]
    lsrs r4, r0, #1
    lsls r4, r4, #1
.Lfunc_00103568_28:
    cmp r4, #0
    bne.n .Lfunc_00103568_a
    pop {r4, r5, r6, pc}
.size func_00103568, . - func_00103568

.section .text.func_00103D1C, "ax", %progbits
.balign 2
.global func_00103D1C
.type func_00103D1C, %function
.thumb_func
func_00103D1C:
    push {r2, r3, r4, r5, r6, lr}
    movs r4, r1
    movs r5, r0
    ldr r0, [r1, #0]
    ldr r0, [r0, #24]
    cmp r0, #0
    beq.n .Lfunc_00103D1C_22
    mov r0, sp
    nop
    nop
    movs r2, r0
    ldr r0, [r4, #0]
    ldr r1, [r0, #24]
.Lfunc_00103D1C_1a:
    movs r0, r5
    bl func_002FF7F8
    pop {r2, r3, r4, r5, r6, pc}
.Lfunc_00103D1C_22:
    add r0, sp, #4
    nop
    nop
    movs r2, r0
    add r1, pc, #4
    b.n .Lfunc_00103D1C_1a
.size func_00103D1C, . - func_00103D1C

.section .text.func_002FFBF8, "ax", %progbits
.balign 2
.global func_002FFBF8
.type func_002FFBF8, %function
.thumb_func
func_002FFBF8:
    push {r4, r5, r6, lr}
    movs r5, r0
    movs r4, r1
    movs r6, r2
    blx func_002FEDF0
    ldr r3, [r0, #0]
    movs r0, #255
    adds r0, #2
    ldrb r0, [r0, r3]
    cmp r0, #1
    beq.n .Lfunc_002FFBF8_28
    cmp r4, #255
    bhi.n .Lfunc_002FFBF8_3e
    ldrb r0, [r3, r4]
    cmp r0, #0
    beq.n .Lfunc_002FFBF8_3e
    movs r0, #1
    strb r4, [r5, #0]
    pop {r4, r5, r6, pc}
.Lfunc_002FFBF8_28:
    movs r0, #255
    adds r0, #8
    movs r2, r6
    ldr r0, [r0, r3]
    movs r1, r4
    adds r3, r3, r0
    adds r3, #255
    adds r3, #8
    movs r0, r5
    blx r3
    pop {r4, r5, r6, pc}
.Lfunc_002FFBF8_3e:
    movs r0, #0
    mvns r0, r0
    pop {r4, r5, r6, pc}
.size func_002FFBF8, . - func_002FFBF8

.section .text.func_00300A00, "ax", %progbits
.balign 2
.global func_00300A00
.type func_00300A00, %function
.thumb_func
func_00300A00:
    push {r3, r4, r5, lr}
    movs r4, r0
    ldr r2, [r0, #0]
    ldr r0, [pc, #60]
    cmp r2, r0
    beq.n .Lfunc_00300A00_40
    subs r2, #12
    ldr r0, [r2, #0]
    .inst.n 0x1c41 @ adds r1, r0, #1 (Thumb16 imm3)
    beq.n .Lfunc_00300A00_24
    ldr r1, [pc, #44]
    subs r1, #12
    cmp r2, r1
    beq.n .Lfunc_00300A00_40
    .inst.n 0x1e40 @ subs r0, r0, #1 (Thumb16 imm3)
    str r0, [r2, #0]
    .inst.n 0x1c40 @ adds r0, r0, #1 (Thumb16 imm3)
    bne.n .Lfunc_00300A00_40
.Lfunc_00300A00_24:
    ldr r0, [r4, #0]
    movs r1, r4
    subs r0, #12
    ldr r5, [r0, #4]
    mov r0, sp
    adds r5, #14
    nop
    nop
    ldr r0, [r4, #0]
    movs r1, r5
    subs r0, #12
    movs r2, #0
    bl func_00101CC8
.Lfunc_00300A00_40:
    pop {r3, r4, r5, pc}
.size func_00300A00, . - func_00300A00

.section .text.func_00301D7C, "ax", %progbits
.balign 2
.global func_00301D7C
.type func_00301D7C, %function
.thumb_func
func_00301D7C:
    push {r4, r5, r6, lr}
    movs r4, r0
    ldr r5, [r0, #16]
    ldr r0, [r0, #44]
    ldr r1, [r4, #4]
    cmp r0, r1
    bhi.n .Lfunc_00301D7C_10
    movs r0, r1
.Lfunc_00301D7C_10:
    ldr r1, [r4, #12]
    movs r2, #5
    lsls r2, r2, #19
    bics r1, r2
    str r1, [r4, #12]
    lsls r1, r1, #15
    bpl.n .Lfunc_00301D7C_48
    cmp r0, r5
    beq.n .Lfunc_00301D7C_36
    subs r1, r0, r5
    movs r2, r4
    movs r0, r5
    bl func_00301D30
    cmp r0, #0
    beq.n .Lfunc_00301D7C_36
    movs r0, #0
    mvns r0, r0
    pop {r4, r5, r6, pc}
.Lfunc_00301D7C_36:
    str r5, [r4, #44]
    movs r0, #0
    str r5, [r4, #4]
    str r0, [r4, #8]
    ldr r0, [r4, #12]
    movs r1, #1
    lsls r1, r1, #16
    bics r0, r1
    str r0, [r4, #12]
.Lfunc_00301D7C_48:
    movs r0, #0
    pop {r4, r5, r6, pc}
.size func_00301D7C, . - func_00301D7C

.section .text.func_00301F00, "ax", %progbits
.balign 2
.global func_00301F00
.type func_00301F00, %function
.thumb_func
func_00301F00:
    push {r4, r5, r6, lr}
    movs r4, r0
    ldr r0, [r0, #12]
    lsls r1, r0, #30
    beq.n .Lfunc_00301F00_32
    lsls r0, r0, #26
    bpl.n .Lfunc_00301F00_12
    ldr r5, [r4, #40]
    b.n .Lfunc_00301F00_1c
.Lfunc_00301F00_12:
    ldr r1, [r4, #24]
    ldr r0, [r4, #4]
    adds r0, r0, r1
    ldr r1, [r4, #16]
    subs r5, r0, r1
.Lfunc_00301F00_1c:
    movs r0, r4
    bl func_00301D7C
    movs r6, r0
    movs r2, #0
    movs r1, r5
    movs r0, r4
    bl func_00301E0C
    movs r0, r6
    pop {r4, r5, r6, pc}
.Lfunc_00301F00_32:
    movs r0, #0
    pop {r4, r5, r6, pc}
.size func_00301F00, . - func_00301F00

.section .text.func_0030227C, "ax", %progbits
.balign 2
.global func_0030227C
.type func_0030227C, %function
.thumb_func
func_0030227C:
    push {r4, lr}
    ldr r2, [r0, #12]
    movs r1, r0
    lsls r0, r2, #30
    beq.n .Lfunc_0030227C_12
    lsls r0, r2, #26
    bpl.n .Lfunc_0030227C_1e
    ldr r0, [r1, #40]
    b.n .Lfunc_0030227C_28
.Lfunc_0030227C_12:
    blx func_002FED78
    movs r1, #1
    str r1, [r0, #0]
    .inst.n 0x1e88 @ subs r0, r1, #2 (Thumb16 imm3)
    pop {r4, pc}
.Lfunc_0030227C_1e:
    ldr r3, [r1, #24]
    ldr r0, [r1, #4]
    adds r0, r0, r3
    ldr r3, [r1, #16]
    subs r0, r0, r3
.Lfunc_0030227C_28:
    adds r1, #64
    ldrb r3, [r1, #4]
    cmp r3, #0
    beq.n .Lfunc_0030227C_36
    ldrb r1, [r1, #5]
    subs r0, r0, r1
.Lfunc_0030227C_34:
    pop {r4, pc}
.Lfunc_0030227C_36:
    lsls r1, r2, #12
    bpl.n .Lfunc_0030227C_34
    cmp r0, #0
    ble.n .Lfunc_0030227C_34
    .inst.n 0x1e40 @ subs r0, r0, #1 (Thumb16 imm3)
    pop {r4, pc}
.size func_0030227C, . - func_0030227C

.section .text.func_003023F0, "ax", %progbits
.balign 2
.global func_003023F0
.type func_003023F0, %function
.thumb_func
func_003023F0:
    push {r4, r5, r6, lr}
    movs r6, r0
    ldr r3, [r2, #12]
    ldr r0, [r2, #20]
    movs r4, r2
    movs r5, r1
    movs r2, r1
    movs r1, r6
    blx func_00503264
    cmp r0, #0
    bge.n .Lfunc_003023F0_2a
    .inst.n 0x1c41 @ adds r1, r0, #1 (Thumb16 imm3)
    beq.n .Lfunc_003023F0_2e
    ldr r1, [r4, #12]
    movs r2, #1
    lsls r0, r0, #1
    lsls r2, r2, #14
    orrs r1, r2
    lsrs r0, r0, #1
    str r1, [r4, #12]
.Lfunc_003023F0_2a:
    subs r0, r5, r0
    pop {r4, r5, r6, pc}
.Lfunc_003023F0_2e:
    movs r0, r4
    bl func_00301D1C
    movs r0, #0
    mvns r0, r0
    pop {r4, r5, r6, pc}
.size func_003023F0, . - func_003023F0

.section .text.func_00303188, "ax", %progbits
.balign 2
.global func_00303188
.type func_00303188, %function
.thumb_func
func_00303188:
    push {r4, r5, r6, lr}
    movs r5, r1
    ldr r1, [r0, #0]
    movs r4, r0
    ldr r0, [r5, #0]
    cmp r1, r0
    beq.n .Lfunc_00303188_30
    ldr r1, [r0, #28]
    .inst.n 0x1c49 @ adds r1, r1, #1 (Thumb16 imm3)
    str r1, [r0, #28]
    ldr r0, [r4, #0]
    ldr r1, [r0, #28]
    .inst.n 0x1e49 @ subs r1, r1, #1 (Thumb16 imm3)
    str r1, [r0, #28]
    bne.n .Lfunc_00303188_2c
    ldr r0, [r4, #0]
    cmp r0, #0
    beq.n .Lfunc_00303188_2c
    bl func_002FFE30
    blx func_002FF8C0
.Lfunc_00303188_2c:
    ldr r0, [r5, #0]
    str r0, [r4, #0]
.Lfunc_00303188_30:
    movs r0, r4
    pop {r4, r5, r6, pc}
.size func_00303188, . - func_00303188

.section .text.func_003035D4, "ax", %progbits
.balign 2
.global func_003035D4
.type func_003035D4, %function
.thumb_func
func_003035D4:
    push {r0, r1, r2, r4, r5, r6, r7, lr}
    movs r4, r0
    movs r5, r1
    lsls r0, r1, #2
    bl func_002FF094
    ldr r2, [r4, #4]
    movs r6, r0
    cmp r2, r5
    bcc.n .Lfunc_003035D4_16
    movs r2, r5
.Lfunc_003035D4_16:
    movs r1, r6
    ldr r0, [r4, #0]
    lsls r3, r2, #2
    b.n .Lfunc_003035D4_22
.Lfunc_003035D4_1e:
    ldmia r0!, {r7}
    stmia r1!, {r7}
.Lfunc_003035D4_22:
    ldr r7, [r4, #0]
    adds r7, r7, r3
    cmp r7, r0
    bne.n .Lfunc_003035D4_1e
    b.n .Lfunc_003035D4_36
.Lfunc_003035D4_2c:
    ldr r0, [sp, #8]
    lsls r1, r2, #2
    ldr r0, [r0, #0]
    .inst.n 0x1c52 @ adds r2, r2, #1 (Thumb16 imm3)
    str r0, [r6, r1]
.Lfunc_003035D4_36:
    cmp r2, r5
    bcc.n .Lfunc_003035D4_2c
    ldr r0, [r4, #0]
    blx func_002FF10C
    str r6, [r4, #0]
    movs r0, r6
    str r5, [r4, #4]
    pop {r1, r2, r3, r4, r5, r6, r7, pc}
.size func_003035D4, . - func_003035D4

.section .text.func_00305A40, "ax", %progbits
.balign 2
.global func_00305A40
.type func_00305A40, %function
.thumb_func
func_00305A40:
    push {r3, r4, r5, r6, r7, lr}
    movs r5, r0
    ldr r4, [r0, #0]
    ldr r0, [r1, #0]
    ldr r7, [r4, #12]
    ldr r6, [sp, #24]
    cmp r7, r0
    bls.n .Lfunc_00305A40_1a
    ldr r4, [r4, #8]
    lsls r0, r0, #2
    adds r0, r4, r0
    ldr r0, [r0, #0]
    b.n .Lfunc_00305A40_1c
.Lfunc_00305A40_1a:
    movs r0, #0
.Lfunc_00305A40_1c:
    cmp r0, #0
    bne.n .Lfunc_00305A40_28
    movs r0, r5
    str r6, [sp, #0]
    bl func_003034CC
.Lfunc_00305A40_28:
    pop {r3, r4, r5, r6, r7, pc}
.size func_00305A40, . - func_00305A40
