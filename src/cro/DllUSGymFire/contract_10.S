.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00000DCC, "ax", %progbits
.balign 4
.global func_00000DCC
.type func_00000DCC, %function
func_00000DCC:
    cmp	r1, #0
    bxeq lr
    push	{r4, r5, r6, lr}
    mov	r5, r0
    ldr	r0, [r1]
    mov	r4, r1
    sub	sp, sp, #104
    ldr	r1, [r0]
    ldr	r2, [r1, #92]
    add	r1, pc, #180
    blx r2
    mov	r1, r0
    ldr	r0, [r4]
    ldr	r2, [r0]
    ldr	r2, [r2, #104]
    blx r2
    movs	r4, r0
    beq .Lfunc_00000DCC_00d8
    ldr	r0, [r5, #8]
    bl . - 0xE10
    vldr	s0, [r4, #28]
    vldr	s1, [pc, #140]
    ldr	r6, [r0, #12]
    ldr	r0, [r4, #12]!
    vadd.f32	s0, s0, s1
    ldr	r1, [r4, #32]
    mov	r2, #0
    str	r0, [sp, #4]
    strh	r2, [sp]
    vldr	s1, [pc, #116]
    add	r0, sp, #24
    mov	r3, sp
    vstr	s0, [sp, #8]
    vldr	s0, [pc, #96]
    str	r1, [sp, #12]
    vstr	s0, [sp, #20]
    vstmia	r0, {s0-s1}
    add	r0, sp, #32
    vstmia	r0, {s0-s1}
    vstr	s0, [sp, #40]
    ldr	r0, [r5, #8]
    ldr	r2, [r0, #268]
    add	r0, sp, #48
    ldr	r1, [r2, #124]
    bl . - 0xD9C
    add	r1, sp, #48
    mov	r0, r6
    bl . - 0xDA0
    mov	r0, r6
    bl . - 0xDA0
    mov	r0, r6
    bl . - 0xE18
    mov	r1, #1
    strb	r1, [r0, #670]
.Lfunc_00000DCC_00d8:
    add	sp, sp, #104
    pop	{r4, r5, r6, pc}
.size func_00000DCC, . - func_00000DCC
