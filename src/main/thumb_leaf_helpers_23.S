.syntax unified
.arch armv6k
.fpu vfpv2
.thumb

.section .text.func_003027AE, "ax", %progbits
.balign 2
.global func_003027AE
.type func_003027AE, %function
.thumb_func
func_003027AE:
    push {r3, r4, r5, r6, r7, lr}
    movs r6, r0
    movs r4, r1
    movs r5, r2
    lsls r0, r1, #30
    bpl .Lsecond
    ldr r0, [pc, #140]
    movs r1, r2
    add r0, pc
    blx func_0016F3FC
    movs r7, r0
    beq .Lreturn
    blx func_002FF7EC
    .inst.n 0x1c7f @ adds r7, r7, #1
    str r7, [r0, #4]
.Lsecond:
    lsls r0, r4, #31
    beq .Lthird
    ldr r0, [pc, #112]
    movs r1, r5
    add r0, pc
    subs r0, #26
    blx func_0052AEC4
    movs r7, r0
    beq .Lreturn
    blx func_002FF7EC
    str r7, [r0, #0]
.Lthird:
    lsls r0, r4, #29
    bpl .Lfourth
    ldr r0, [pc, #88]
    movs r1, r5
    add r0, pc
    subs r0, #52
    mov r8, r8
    mov r8, r8
    movs r7, r0
    beq .Lreturn
    blx func_002FF7EC
    str r7, [r0, #8]
.Lfourth:
    lsls r0, r4, #28
    bpl .Lfifth
    ldr r0, [pc, #60]
    movs r1, r5
    add r0, pc
    subs r0, #78
    blx func_00193C20
    movs r7, r0
    beq .Lreturn
    blx func_002FF7EC
    str r7, [r0, #12]
.Lfifth:
    lsls r0, r4, #27
    bpl .Lapply
    ldr r0, [pc, #36]
    movs r1, r5
    add r0, pc
    subs r0, #104
    mov r8, r8
    mov r8, r8
    movs r5, r0
    beq .Lreturn
    blx func_002FF7EC
    str r5, [r0, #16]
.Lapply:
    movs r1, r4
    movs r0, r6
    bl func_003026AC
.Lreturn:
    pop {r3, r4, r5, r6, r7, pc}
.size func_003027AE, . - func_003027AE

.global func_0016F3FC
.type func_0016F3FC, %function
.global func_002FF7EC
.type func_002FF7EC, %function
.global func_0052AEC4
.type func_0052AEC4, %function
.global func_00193C20
.type func_00193C20, %function
.global func_003026AC
.type func_003026AC, %function
