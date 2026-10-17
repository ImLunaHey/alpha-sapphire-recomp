.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_000014D4, "ax", %progbits
.balign 4
.global func_000014D4
.type func_000014D4, %function
func_000014D4:
    push	{r4, r5, r6, r7, r8, r9, lr}
    mov	r6, r3
    mov	r7, r2
    mov	r3, #0
    sub	sp, sp, #36
    mov	r4, r1
    mov	r2, r3
    bl . - 0x1290
    mov	r5, r0
    ldr	r0, [pc, #372]
    mov	r9, #0
    vldr	s0, [pc, #372]
    add	r1, r0, #72
    str	r0, [r5]
    str	r1, [r5, #116]
    ldr	r1, [pc, #352]
    add	r0, r5, #124
    mov	r8, #1
    str	r1, [r5, #124]
    strb	r9, [r5, #128]
    strb	r9, [r5, #129]
    mov	r1, #255
    strb	r9, [r5, #130]
    strb	r1, [r5, #131]
    strb	r9, [r5, #132]
    strb	r9, [r5, #133]
    strb	r9, [r5, #134]
    strb	r1, [r5, #135]
    mvn	r1, #0
    str	r1, [r5, #136]
    str	r1, [r0, #16]
    vstr	s0, [r0, #24]
    strb	r9, [r0, #28]
    str	r9, [r0, #32]
    strb	r6, [r5, #172]
    str	r9, [r5, #176]
    str	r7, [r5, #184]
    str	r9, [r5, #180]
    mov	r2, r8
    mov	r1, r4
    mov	r0, r5
    str	r9, [r5, #168]
    bl . - 0x1314
    ldr	r3, [pc, #248]
    mov	r2, #8
    add	lr, sp, #4
    sub	ip, r3, #60
    str	r2, [sp, #28]
    mov	r0, #2
    str	ip, [sp]
    stm	lr, {r0, r3}
    mov	r1, r4
    add	lr, sp, #12
    mov	r4, #38
    mov	r3, r0
    stm	lr, {r0, r4, r8, r9}
    mov	r2, #0
    mov	r0, r5
    bl . - 0x134C
    ldr	r2, [pc, #188]
    ldr	r0, [r5, #92]
    mov	r3, #1
    mov	r1, #0
    bl . - 0x1358
    mov	r3, #1
    str	r8, [sp]
    ldr	r0, [r5, #92]
    mov	r2, #0
    mov	r1, r3
    bl . - 0x13B0
    str	r8, [sp]
    ldr	r0, [r5, #92]
    mov	r3, #1
    mov	r2, #5
    mov	r1, #0
    bl . - 0x13C8
    str	r8, [sp]
    ldr	r0, [r5, #92]
    mov	r3, #1
    mov	r2, #6
    mov	r1, #0
    bl . - 0x13E0
    ldr	r6, [r5, #168]
    mov	r4, #0
.Lfunc_000014D4_0150:
    mov	r3, #0
    ldr	r0, [r5, #92]
    mov	r2, r4
    mov	r1, r3
    bl . - 0x13EC
    add	r4, r4, #1
    cmp	r4, #3
    ble .Lfunc_000014D4_0150
    str	r8, [sp]
    ldr	r0, [r5, #92]
    mov	r3, #1
    mov	r2, r6
    mov	r1, #0
    bl . - 0x1420
    add	r1, r5, #116
    mov	r0, r5
    bl . - 0x13E4
    add	sp, sp, #36
    mov	r0, r5
    pop	{r4, r5, r6, r7, r8, r9, pc}
.size func_000014D4, . - func_000014D4
