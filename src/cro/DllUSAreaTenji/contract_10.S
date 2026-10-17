.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_0000007C, "ax", %progbits
.balign 4
.global func_0000007C
.type func_0000007C, %function
func_0000007C:
    push	{r4, r5, r6, r7, r8, r9, sl, lr}
    mov	r4, #0
    mov	r7, r0
    ldr	r0, [r0, #8]
    ldr	sl, [pc, #268]
    ldr	r0, [r0, #96]
    ldr	r0, [r0, #28]
    ldr	r0, [r0, #40]
    ldrh	r9, [r0, #12]
.Lfunc_0000007C_0024:
    add	r0, r4, r4, lsl #2
    add	r5, sl, r0, lsl #1
    ldrh	r0, [r5]
    cmp	r0, #536
    bcs .Lfunc_0000007C_0040
    cmp	r0, r9
    bne .Lfunc_0000007C_0114
.Lfunc_0000007C_0040:
    ldr	r1, [r7, #8]
    ldrb	r2, [r5, #6]
    mov	r6, r5
    ldr	r0, [r1, #96]
    ldr	r8, [r1, #368]
    cmp	r2, #0
    ldr	r0, [r0, #28]
    beq .Lfunc_0000007C_00b0
    ldrh	r1, [r6, #8]
    ldr	r0, [r0]
    add	r0, r0, #65536
    add	r0, r0, #12608
    bl . - 0xEC
    cmp	r0, #0
    nop
    beq .Lfunc_0000007C_0114
    ldrh	r2, [r6, #4]
    ldrh	r1, [r6, #2]
    mov	r0, r8
    bl . - 0x100
.Lfunc_0000007C_0090:
    movs	r6, r0
    beq .Lfunc_0000007C_0114
    ldrb	r0, [r5, #7]
    cmp	r0, #0
    beq .Lfunc_0000007C_00c4
    cmp	r0, #1
    bne .Lfunc_0000007C_0114
    b .Lfunc_0000007C_00f4
.Lfunc_0000007C_00b0:
    nop
    bl . - 0x120
    nop
    nop
    b .Lfunc_0000007C_0090
.Lfunc_0000007C_00c4:
    mov	r1, #0
    mov	r0, r6
    bl . - 0x130
    vmov	r0, s0
    cmp	r0, #1065353216
    bge .Lfunc_0000007C_0114
    mov	r1, #0
    mov	r0, r6
    bl . - 0x140
    nop
    nop
    b .Lfunc_0000007C_0114
.Lfunc_0000007C_00f4:
    mov	r0, r6
    bl . - 0x14C
    cmp	r0, #0
    nop
    beq .Lfunc_0000007C_0114
    mov	r1, #0
    mov	r0, r6
    bl . - 0x15C
.Lfunc_0000007C_0114:
    add	r4, r4, #1
    cmp	r4, #4
    bcc .Lfunc_0000007C_0024
    pop	{r4, r5, r6, r7, r8, r9, sl, pc}
.size func_0000007C, . - func_0000007C
