.syntax unified
.arch armv6k
.fpu vfpv2
.thumb

.section .text.func_00103A16, "ax", %progbits
.balign 2
.global func_00103A16
.type func_00103A16, %function
.thumb_func
func_00103A16:
    push {r1, r2, r3, r4, r5, r6, r7, lr}
    movs r5, r1
    movs r7, r2
    ldr r1, [r0, #0]
    movs r4, #0
    mvns r4, r4
    movs r2, #6
    mov r0, sp
    bl func_00302FB6
    ldr r0, [r5, #0]
    movs r1, r4
    bl thumb_secondary_001035C0
    movs r6, r0
    adds r0, r0, #1
    beq .Lfinish
    bl func_00303110
    ldr r1, [r0, #4]
    ldr r4, [r0, #0]
    movs r5, r0
    lsls r0, r1, #3
    adds r0, r4, r0
.Lsearch:
    cmp r0, r4
    bne .Lfound
    adds r1, r1, #1
    movs r0, r5
    bl func_00104A50
    ldr r1, [r5, #4]
    ldr r0, [r5, #0]
    lsls r1, r1, #3
    adds r4, r0, r1
    subs r4, #8
    b .Lupdate
.Lfinish:
    mov r0, sp
    bl func_00302FEE
    movs r0, r4
    pop {r1, r2, r3, r4, r5, r6, r7, pc}
.Lfound:
    ldr r2, [r4, #0]
    adds r2, r2, #1
    beq .Lupdate
    adds r4, #8
    b .Lsearch
.Lupdate:
    movs r1, r7
    adds r0, r4, #4
    str r6, [r4, #0]
    bl func_00303188
    ldr r0, [r5, #0]
    subs r0, r4, r0
    asrs r4, r0, #3
    b .Lfinish
.size func_00103A16, . - func_00103A16

.global func_00302FB6
.type func_00302FB6, %function
.global thumb_secondary_001035C0
.type thumb_secondary_001035C0, %function
.global func_00303110
.type func_00303110, %function
.global func_00104A50
.type func_00104A50, %function
.global func_00302FEE
.type func_00302FEE, %function
.global func_00303188
.type func_00303188, %function
