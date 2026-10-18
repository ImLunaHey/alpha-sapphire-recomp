.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_000009EC, "ax", %progbits
.balign 4
.global func_000009EC
.type func_000009EC, %function
ASM_FUNC(func_000009EC)
func_000009EC:
    vldr s2, [pc, #0xD0]
    cmp r1, #2
    mov r3, #0
    mov ip, #1
    beq .Lselector_2
    cmp r1, #3
    beq .Lselector_3
    cmp r1, #0
    mov r3, #2
    mov ip, #3
    beq .Lselector_0
    cmp r1, #1
    beq .Lselector_1
    b .Lno_dispatch

.Lselector_2:
    vcmpe.f32 s1, s2
    vmrs APSR_nzcv, fpscr
    bcs .Lselector_2_nonnegative
    mov r1, #6
    strb r3, [r2]
    b . + 0x19C
.Lselector_2_nonnegative:
    nop
    bgt .Lselector_2_positive
    b .Lno_dispatch

.Lselector_3:
    vcmpe.f32 s1, s2
    vmrs APSR_nzcv, fpscr
    bcc .Lselector_3_negative
    ble .Lno_dispatch
    mov r1, #5
    strb ip, [r2]
    b . + 0x174

.Lselector_0:
    vcmpe.f32 s0, s2
    vmrs APSR_nzcv, fpscr
    bcs .Lselector_0_nonnegative
    mov r1, #5
    strb r3, [r2]
    b . + 0x15C
.Lselector_0_nonnegative:
    nop
    ble .Lno_dispatch
.Lselector_2_positive:
    mov r1, #4
    strb ip, [r2]
    b . + 0x148

.Lselector_1:
    vcmpe.f32 s0, s2
    vmrs APSR_nzcv, fpscr
    bcs .Lselector_1_nonnegative
.Lselector_3_negative:
    mov r1, #7
    strb r3, [r2]
    b . + 0x130
.Lselector_1_nonnegative:
    nop
    ble .Lno_dispatch
    mov r1, #6
    strb ip, [r2]
    b . + 0x11C

.Lno_dispatch:
    mov r0, #0
    bx lr
.size func_000009EC, . - func_000009EC
