.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00003644, "ax", %progbits
.balign 4
.global func_00003644
.type func_00003644, %function
func_00003644:
    push	{r4, r5, r6, lr}
    mov	r4, r0
    ldr	r0, [r0, #72]
    mov	r5, r1
    bl . - 0x3354
    cmp	r0, #0
    beq .Lfunc_00003644_0034
    mov	r2, #0
    mov	r1, r2
    mov	r0, r2
    bl . - 0x3544
    mov	r0, #0
    pop	{r4, r5, r6, pc}
.Lfunc_00003644_0034:
    mov	r1, #1
    mov	r0, r5
    bl . - 0x33A0
    mov	r5, r0
    ldr	r0, [r4, #72]
    bl . - 0x329C
    cmp	r0, #0
    nop
    beq .Lfunc_00003644_0168
    mov	r2, #1
    mov	r1, #512
    mov	r0, r5
    bl . - 0x33B8
    ldr	r6, [pc, #256]
    cmp	r0, #0
    beq .Lfunc_00003644_00d4
    ldr	r0, [r4, #72]
    bl . - 0x339C
    ldr	r5, [r0, #4]
    ldr	r0, [r4, #72]
    bl . - 0x32D0
    cmp	r0, #0
    ldrb	r0, [r5, #24]
    beq .Lfunc_00003644_00b4
    mov	r1, #5
    bl . - 0x32DC
    mov	r1, r0
    mov	r0, r5
    bl . - 0x3308
    nop
    nop
    b .Lfunc_00003644_0144
.Lfunc_00003644_00b4:
    mov	r1, #3
    bl . - 0x32FC
    mov	r1, r0
    mov	r0, r5
    bl . - 0x3328
    nop
    nop
    b .Lfunc_00003644_0144
.Lfunc_00003644_00d4:
    mov	r2, #1
    mov	r1, #256
    mov	r0, r5
    bl . - 0x3434
    cmp	r0, #0
    nop
    beq .Lfunc_00003644_0168
    ldr	r0, [r4, #72]
    bl . - 0x3418
    ldr	r5, [r0, #4]
    ldr	r0, [r4, #72]
    bl . - 0x334C
    cmp	r0, #0
    ldrb	r0, [r5, #24]
    beq .Lfunc_00003644_0130
    mov	r1, #4
    bl . - 0x3358
    mov	r1, r0
    mov	r0, r5
    bl . - 0x3384
    nop
    nop
    b .Lfunc_00003644_0144
.Lfunc_00003644_0130:
    mov	r1, #2
    bl . - 0x3378
    mov	r1, r0
    mov	r0, r5
    bl . - 0x33A4
.Lfunc_00003644_0144:
    ldr	r0, [r4, #72]
    bl . - 0x344C
    mov	r3, #0
    mvn	r2, #0
    mov	r1, r3
    mov	r0, r6
    bl . - 0x3770
    mov	r0, #1
    pop	{r4, r5, r6, pc}
.Lfunc_00003644_0168:
    mov	r0, #0
    pop	{r4, r5, r6, pc}
.size func_00003644, . - func_00003644
