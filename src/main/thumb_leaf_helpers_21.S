.syntax unified
.arch armv6k
.fpu vfpv2
.thumb

.section .text.func_00300ABC, "ax", %progbits
.balign 2
.global func_00300ABC
.type func_00300ABC, %function
.thumb_func
func_00300ABC:
    push {r0, r1, r2, r3}
    push {r0, r1, r2, r3, r4, r5, r6, lr}
    ldr r5, [pc, #84]
    ldr r2, [r5, #0]
    cmp r2, #0
    beq .Lfinish
    ldr r0, [sp, #32]
    cmp r0, #3
    bgt .Lextended
    movs r1, #0
    blx r2
.Lfinish:
    pop {r0, r1, r2, r3, r4, r5, r6}
    pop {r3}
    add sp, #16
    bx r3
.Lextended:
    movs r0, #8
    add r6, sp, #36
    mov r1, sp
    movs r0, r1
    mov r8, r8
    cmp r0, #0
    beq .Lempty
    bl func_00100788
    movs r4, r0
    b .Lprepared
.Lempty:
    movs r4, #0
.Lprepared:
    ldr r1, [sp, #32]
    movs r2, r6
    movs r0, r4
    bl thumb_secondary_00100700
    ldr r0, [r4, #0]
    ldr r1, [r0, #8]
    movs r0, r4
    blx r1
    ldr r2, [r5, #0]
    movs r1, r0
    ldr r0, [sp, #32]
    blx r2
    ldr r0, [r4, #0]
    ldr r1, [r0, #0]
    movs r0, r4
    blx r1
    b .Lfinish
.size func_00300ABC, . - func_00300ABC

.global func_00100788
.type func_00100788, %function
.global thumb_secondary_00100700
.type thumb_secondary_00100700, %function
