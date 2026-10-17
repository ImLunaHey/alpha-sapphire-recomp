.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00000308, "ax", %progbits
.balign 4
.global func_00000308
.type func_00000308, %function
func_00000308:
    push	{r4, r5, r6, lr}
    mov	r4, r0
    ldr	r0, [r0, #28]
    bl . - 0x2CC
    cmp	r0, #0
    beq .Lfunc_00000308_0150
    ldr	r0, [r4, #28]
    bl . - 0x2D4
    cmp	r0, #0
    beq .Lfunc_00000308_0150
    ldr	r0, [r4, #28]
    bl . - 0x32C
    mov	r5, r0
    bl . - 0x2E4
    ldr	r6, [pc, #280]
    cmp	r0, #0
    bne .Lfunc_00000308_0054
    mov	r0, r5
    bl . - 0x2B8
    cmp	r0, #9
    beq .Lfunc_00000308_0068
.Lfunc_00000308_0054:
    ldr	r0, [r4, #52]
    mov	r5, #1
    cmp	r0, #0
    bne .Lfunc_00000308_00cc
    b .Lfunc_00000308_0084
.Lfunc_00000308_0068:
    mvn	r2, #0
    mov	r1, #0
    mov	r0, r6
    bl . - 0x364
    nop
    nop
    b .Lfunc_00000308_0148
.Lfunc_00000308_0084:
    ldr	r0, [r4, #40]
    bl . - 0x2F0
    cmp	r0, #0
    nop
    beq .Lfunc_00000308_00cc
    mov	r0, #239
    strh	r0, [r4, #32]
    ldrb	r0, [r4, #36]
    bl . - 0x304
    strb	r0, [r4, #34]
    strb	r5, [r4, #35]
    ldr	r0, [r4, #28]
    mov	r2, #1
    add	r1, r4, #32
    bl . - 0x354
    str	r5, [r4, #52]
    nop
    b .Lfunc_00000308_0150
.Lfunc_00000308_00cc:
    ldr	r0, [r4, #44]
    cmp	r0, #0
    bgt .Lfunc_00000308_00ec
    mov	r3, #0
    mvn	r2, #0
    mov	r1, r3
    mov	r0, r6
    bl . - 0x388
.Lfunc_00000308_00ec:
    ldrh	r1, [r4, #50]
    ldrb	r0, [r4, #36]
    mov	r2, #1
    strh	r1, [r4, #32]
    strb	r5, [r4, #35]
    strb	r0, [r4, #34]
    ldr	r0, [r4, #28]
    add	r1, r4, #32
    bl . - 0x3A4
    ldr	r0, [r4, #44]
    mov	r2, #4
    mov	r1, #14
    add	r0, r0, #1
    str	r0, [r4, #44]
    ldr	r0, [r4, #28]
    bl . - 0x3B8
    ldr	r0, [r4, #44]
    cmp	r0, #40
    ble .Lfunc_00000308_0150
    mov	r2, #0
    mov	r1, r2
    mov	r0, r2
    bl . - 0x3CC
.Lfunc_00000308_0148:
    mov	r0, #1
    pop	{r4, r5, r6, pc}
.Lfunc_00000308_0150:
    mov	r0, #0
    pop	{r4, r5, r6, pc}
.size func_00000308, . - func_00000308
