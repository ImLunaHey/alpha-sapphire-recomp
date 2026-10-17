.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00000E44, "ax", %progbits
.balign 4
.global func_00000E44
.type func_00000E44, %function
func_00000E44:
    push    {r3, r4, r5, r6, r7, lr}
    mov     r5, r1
    mov     r4, r0
    mov     r2, #0
    mov     r1, #16
    mov     r0, r5
    bl      . - 0xCDC
    cmp     r0, #0
    mov     r7, #1
    beq     .Ltest_category_20

    ldr     r0, [r4, #164]
    cmp     r0, #0
    beq     .Ltest_category_4
    ldr     r1, [r0]
    ldr     r2, [r1]
    ldr     r1, [r4, #168]
    blx     r2
    ldr     r1, [r4, #168]
    str     r7, [sp]
    ldr     r0, [r4, #92]
    add     r2, r1, #7
    mov     r3, #1
    mov     r1, #0
    bl      . - 0xC70
    b       .Lreturn_zero

.Ltest_category_20:
    mov     r2, #0
    mov     r1, #32
    mov     r0, r5
    bl      . - 0xD34
    cmp     r0, #0
    nop
    beq     .Ltest_category_4
    ldr     r0, [r4, #164]
    cmp     r0, #0
    beq     .Ltest_category_4
    ldr     r1, [r0]
    ldr     r1, [r1, #4]
    blx     r1

.Lreturn_zero:
    mov     r0, #0

.Lpop_result:
    pop     {r3, r4, r5, r6, r7, pc}

.Ltest_category_4:
    mov     r2, #0
    mov     r1, #4
    mov     r0, r5
    bl      . - 0xD50
    cmp     r0, #0
    nop
    beq     .Ltest_category_8
    ldr     r0, [r4, #168]
    cmp     r0, #0
    beq     .Lreturn_zero
    ldr     r0, [r4, #164]
    cmp     r0, #0
    beq     .Ldecrement_selection
    ldr     r1, [r0]
    ldr     r1, [r1, #8]
    blx     r1

.Ldecrement_selection:
    ldr     r0, [r4, #168]
    mov     r5, #0
    sub     r6, r0, #1
    str     r6, [r4, #168]

.Lclear_after_decrement:
    mov     r3, #0
    ldr     r0, [r4, #92]
    mov     r2, r5
    mov     r1, r3
    bl      . - 0xD4C
    add     r5, r5, #1
    cmp     r5, #3
    ble     .Lclear_after_decrement
    b       .Lenable_selection

.Ltest_category_8:
    mov     r2, #0
    mov     r1, #8
    mov     r0, r5
    bl      . - 0xDBC
    cmp     r0, #0
    moveq   r0, #1
    beq     .Lpop_result
    ldrb    r0, [r4, #172]
    ldr     r1, [r4, #168]
    cmp     r0, #1
    moveq   r0, #3
    movne   r0, #2
    cmp     r0, r1
    bls     .Lreturn_zero
    ldr     r0, [r4, #164]
    cmp     r0, #0
    beq     .Lincrement_selection
    ldr     r1, [r0]
    ldr     r1, [r1, #8]
    blx     r1

.Lincrement_selection:
    ldr     r0, [r4, #168]
    mov     r5, #0
    add     r6, r0, #1
    str     r6, [r4, #168]

.Lclear_after_increment:
    mov     r3, #0
    ldr     r0, [r4, #92]
    mov     r2, r5
    mov     r1, r3
    bl      . - 0xDD4
    add     r5, r5, #1
    cmp     r5, #3
    ble     .Lclear_after_increment

.Lenable_selection:
    str     r7, [sp]
    ldr     r0, [r4, #92]
    mov     r3, #1
    mov     r2, r6
    mov     r1, #0
    bl      . - 0xDE8
    nop
    nop
    b       .Lreturn_zero
.size func_00000E44, . - func_00000E44
