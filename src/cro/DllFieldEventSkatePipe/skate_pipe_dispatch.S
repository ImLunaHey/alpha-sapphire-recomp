.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_000009EC, "ax", %progbits
.balign 4
.global func_000009EC
.type func_000009EC, %function
func_000009EC:
    vldr s2, [pc, #0xD0]
    cmp r1, #2
    mov r3, #0
    mov r12, #1
    beq .Lselector_2
    cmp r1, #3
    beq .Lselector_3
    cmp r1, #0
    mov r3, #2
    mov r12, #3
    beq .Lselector_0
    cmp r1, #1
    beq .Lselector_1
    b .Lreturn_zero

.Lselector_2:
    vcmpe.f32 s1, s2
    vmrs APSR_nzcv, fpscr
    bcs .Lselector_2_nonnegative
    mov r1, #6
    strb r3, [r2]
    b . + 0x19C
.Lselector_2_nonnegative:
    nop
    bgt .Lpositive_4
    b .Lreturn_zero

.Lselector_3:
    vcmpe.f32 s1, s2
    vmrs APSR_nzcv, fpscr
    bcc .Lnegative_7
    ble .Lreturn_zero
    mov r1, #5
    strb r12, [r2]
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
    ble .Lreturn_zero
.Lpositive_4:
    mov r1, #4
    strb r12, [r2]
    b . + 0x148

.Lselector_1:
    vcmpe.f32 s0, s2
    vmrs APSR_nzcv, fpscr
    bcs .Lselector_1_nonnegative
.Lnegative_7:
    mov r1, #7
    strb r3, [r2]
    b . + 0x130
.Lselector_1_nonnegative:
    nop
    ble .Lreturn_zero
    mov r1, #6
    strb r12, [r2]
    b . + 0x11C

.Lreturn_zero:
    mov r0, #0
    bx lr
.size func_000009EC, . - func_000009EC

.section .pool.__cro_pool_00000ac4, "a", %progbits
.balign 1
.global __cro_pool_00000ac4
.type __cro_pool_00000ac4, %object
__cro_pool_00000ac4:
$d:
    .float 0.0
.size __cro_pool_00000ac4, . - __cro_pool_00000ac4
