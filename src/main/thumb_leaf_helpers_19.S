.syntax unified
.arch armv6k
.fpu vfpv2
.thumb

.section .text.func_001042A6, "ax", %progbits
.balign 2
.global func_001042A6
.type func_001042A6, %function
.thumb_func
func_001042A6:
    push {r0, r1, r2, r4, r5, r6, r7, lr}
    sub sp, #16
    movs r6, r0
    ldr r4, [r0, #44]
    movs r7, r2
    cmp r4, #0
    beq .Lreturn
    ldr r5, [r6, #48]
    cmp r7, #0
    beq .Ldecrement
    lsls r2, r5, #3
    movs r1, #0
    mov r0, sp
    bl thumb_secondary_00303E38
    ldr r0, [sp, #4]
    ldr r1, [sp, #0]
    lsrs r0, r0, #3
    movs r4, r1
    str r1, [sp, #8]
    str r0, [sp, #12]
    beq .Lalternate
    ldr r0, [r6, #48]
    ldr r1, [r6, #44]
    lsls r2, r0, #3
    movs r0, r4
    bl func_00144D28
    b .Ldecrement
.Lalternate:
    ldr r1, [r6, #16]
    movs r0, #1
    orrs r1, r0
    subs r2, r0, #2
    movs r0, r6
    bl thumb_secondary_00104324
.Lreturn:
    add sp, #28
    pop {r4, r5, r6, r7, pc}
.Lcallback:
    lsls r0, r5, #3
    ldr r2, [r4, r0]
    adds r0, r0, r4
    ldr r3, [r0, #4]
    ldr r0, [sp, #20]
    movs r1, r6
    blx r3
.Ldecrement:
    subs r5, r5, #1
    bcs .Lcallback
    cmp r7, #0
    beq .Lreturn
    movs r0, r4
    bl func_00303EC8
    b .Lreturn
.size func_001042A6, . - func_001042A6

.global thumb_secondary_00303E38
.type thumb_secondary_00303E38, %function
.global func_00144D28
.type func_00144D28, %function
.global thumb_secondary_00104324
.type thumb_secondary_00104324, %function
.global func_00303EC8
.type func_00303EC8, %function
