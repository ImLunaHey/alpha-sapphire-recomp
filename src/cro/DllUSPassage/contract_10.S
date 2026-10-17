.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_000019F4, "ax", %progbits
.balign 4
.global func_000019F4
.type func_000019F4, %function
func_000019F4:
    push	{r4, r5, r6, r7, r8, r9, sl, fp, lr}
    mov	r5, r0
    sub	sp, sp, #68
    mov	r9, #0
    ldr	r0, [r0, #8]
    ldr	r1, [r0, #96]
    ldr	r4, [r0, #4]
    ldr	r8, [r0, #16]
    ldr	r1, [r1, #28]
    ldr	r1, [r1, #20]
    str	r1, [sp, #8]
    strb	r9, [r5, #40]
    ldr	r0, [r0, #96]
    bl . - 0x18CC
    mov	r1, #104
    str	r0, [sp, #16]
    bl . - 0x18C0
    cmp	r0, #0
    mov	sl, #1
    bne .Lfunc_000019F4_0068
    strb	sl, [r5, #40]
    ldr	r0, [sp, #16]
    mov	r3, #0
    mov	r2, #104
    mov	r1, r4
    bl . - 0x18DC
.Lfunc_000019F4_0068:
    str	r9, [r5, #92]
    str	r9, [r5, #96]
    str	r9, [r5, #100]
    str	r9, [r5, #104]
    str	r9, [r5, #108]
    str	r9, [r5, #112]
    ldr	r0, [r5, #24]
    mov	r7, #0
    mov	fp, #104
    cmp	r0, #0
    mov	r4, r7
    bls .Lfunc_000019F4_0168
.Lfunc_000019F4_0098:
    ldr	r0, [sp, #8]
    mov	r1, r4
    bl . - 0x1968
    mov	r6, r0
    mov	r1, #2
    bl . - 0x196C
    cmp	r0, #0
    nop
    bne .Lfunc_000019F4_0158
    mov	r1, #8
    mov	r0, r6
    bl . - 0x1934
    add	r6, r5, r7, lsl #2
    sub	r1, r0, #1
    str	r1, [r6, #140]
    mov	r0, #16
    strb	r0, [sp, #24]
    str	r9, [sp, #32]
    strb	r9, [sp, #36]
    str	r9, [sp, #40]
    str	r9, [sp, #48]
    str	r9, [sp, #44]
    str	r9, [sp, #52]
    str	r9, [sp, #56]
    str	r9, [sp, #60]
    str	fp, [sp, #28]
    ldr	r0, [r6, #140]
    str	r0, [sp, #32]
    ldr	r0, [r8]
    ldr	r1, [r0, #52]
    mov	r0, r8
    blx r1
    str	r0, [sp, #40]
    ldr	r0, [r8]
    ldr	r1, [r0, #52]
    mov	r0, r8
    blx r1
    add	r3, sp, #52
    str	r0, [sp, #48]
    add	r1, r6, #92
    add	r2, r6, #116
    mov	r0, #128
    stm	r3, {r0, r1, r2}
    add	r1, sp, #24
    strb	sl, [sp, #36]
    ldr	r0, [sp, #16]
    bl . - 0x19B8
    add	r7, r7, #1
.Lfunc_000019F4_0158:
    ldr	r0, [r5, #24]
    add	r4, r4, #1
    cmp	r0, r4
    bhi .Lfunc_000019F4_0098
.Lfunc_000019F4_0168:
    mov	r0, #16
    strb	r0, [sp, #24]
    mov	r0, #26
    strb	r9, [sp, #36]
    str	r9, [sp, #40]
    str	r9, [sp, #48]
    str	r9, [sp, #52]
    str	r9, [sp, #44]
    str	r9, [sp, #56]
    str	r0, [sp, #32]
    str	r9, [sp, #60]
    str	fp, [sp, #28]
    ldr	r0, [r8]
    ldr	r1, [r0, #52]
    mov	r0, r8
    blx r1
    str	r0, [sp, #40]
    ldr	r0, [r8]
    ldr	r1, [r0, #52]
    mov	r0, r8
    blx r1
    add	r4, sp, #48
    mov	r1, #128
    add	r2, r5, #180
    add	r3, r5, #184
    stm	r4, {r0, r1, r2, r3}
    add	r1, sp, #24
    strb	sl, [sp, #36]
    ldr	r0, [sp, #16]
    bl . - 0x1A44
    add	sp, sp, #68
    pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.size func_000019F4, . - func_000019F4
