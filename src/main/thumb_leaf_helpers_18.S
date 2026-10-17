.syntax unified
.arch armv6k
.fpu vfpv2
.thumb

.section .text.func_0030274A, "ax", %progbits
.balign 2
.global func_0030274A
.type func_0030274A, %function
.thumb_func
func_0030274A:
    push {r3, r4, r5, r6, r7, lr}
    cmp r1, #0
    beq .Lreturn_zero
    lsrs r3, r1, #5
    beq .Lcheck_input
.Lreturn_zero:
    movs r0, #0
    pop {r3, r4, r5, r6, r7, pc}
.Lcheck_input:
    cmp r2, #0
    beq .Lcall_previous
    ldrb r3, [r2, #0]
    cmp r3, #42
    beq .Ldecode
    bl func_003027AE
    pop {r3, r4, r5, r6, r7, pc}
.Lcall_previous:
    bl func_003026AC
    pop {r3, r4, r5, r6, r7, pc}
.Ldecode:
    movs r7, r1
    adds r5, r2, #1
    movs r4, #0
    str r0, [sp, #0]
.Louter:
    movs r6, #0
    movs r1, r6
.Lhex_loop:
    ldrb r0, [r5, #0]
    .inst.n 0x1c6d  @ adds r5, r5, #1 (three-operand immediate3)
    cmp r0, #57
    bhi .Lhex_alpha
    subs r0, r0, #48
    b .Lhex_merge
.Lhex_alpha:
    subs r0, r0, #87
.Lhex_merge:
    lsls r6, r6, #4
    orrs r6, r0
    .inst.n 0x1c49  @ adds r1, r1, #1 (three-operand immediate3)
    cmp r1, #8
    blt .Lhex_loop
    movs r0, #1
    lsls r0, r0, r4
    tst r0, r7
    beq .Lnext
    bl func_002FF7EC
    lsls r1, r4, #2
    str r6, [r0, r1]
.Lnext:
    .inst.n 0x1c64  @ adds r4, r4, #1 (three-operand immediate3)
    cmp r4, #5
    blt .Louter
    ldr r0, [sp, #0]
    movs r1, r7
    b .Lcall_previous
.size func_0030274A, . - func_0030274A

.global func_003027AE
.type func_003027AE, %function
.global func_003026AC
.type func_003026AC, %function
.global func_002FF7EC
.type func_002FF7EC, %function
