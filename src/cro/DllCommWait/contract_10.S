.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00000808, "ax", %progbits
.balign 4
.global func_00000808
.type func_00000808, %function
func_00000808:
    push	{r4, r5, r6, r7, lr}
    mov	r5, r0
    mov	r4, r1
    ldr	r0, [pc, #316]
    ldr	r6, [pc, #304]
    vpush	{d8}
    sub	sp, sp, #100
    ldr	r0, [r0]
    vldr	s16, [pc, #292]
    tst	r0, #1
    bne .Lfunc_00000808_0070
    ldr	r0, [pc, #284]
    bl . - 0x7B0
    cmp	r0, #0
    beq .Lfunc_00000808_0070
    vmov.f32	s0, s16
    add	r0, r6, #0
    vldr	s1, [pc, #264]
    vstmia	r0, {s0-s1}
    vstr	s0, [r0, #8]
    vldr	s1, [pc, #256]
    ldr	r0, [pc, #244]
    vstr	s1, [r6, #12]
    vstr	s1, [r6, #16]
    vstr	s0, [r6, #20]
    vstr	s0, [r6, #24]
    vstr	s0, [r6, #28]
    bl . - 0x7E4
.Lfunc_00000808_0070:
    vstr	s16, [sp, #44]
    vstr	s16, [sp, #48]
    vstr	s16, [sp, #52]
    mov	r0, #1
    strb	r0, [sp, #80]
    mov	r7, #16
    mvn	r1, #0
    strb	r0, [sp, #72]
    strb	r0, [sp, #81]
    mov	r2, r0
    str	r7, [sp, #68]
    str	r1, [sp, #76]
    ldr	r1, [r5, #92]
    mov	r3, #11
    add	r0, sp, #84
    bl . - 0x81C
    ldr	r0, [r5, #116]
    cmp	r0, #0
    bne .Lfunc_00000808_013c
    ldr	r0, [r4, #4]
    str	r0, [sp, #56]
    ldr	r0, [r4, #8]
    str	r0, [sp, #60]
    ldr	r0, [r4, #16]
    str	r0, [sp, #64]
    mov	r0, r5
    bl . - 0x840
    str	r0, [sp]
    mov	r0, r5
    bl . - 0x844
    str	r0, [sp, #4]
    add	r1, sp, #8
    vldmia	r6, {s0-s7}
    add	ip, sp, #84
    mov	r0, #0
    vstmia	r1, {s0-s7}
    ldr	r1, [r6, #32]
    str	r7, [sp, #68]
    str	r1, [sp, #40]
    ldm	ip, {r1, r2, r3}
    add	ip, sp, #44
    stm	ip, {r1, r2, r3}
    strb	r0, [sp, #72]
    strb	r0, [sp, #80]
    ldr	r1, [r4, #4]
    mov	r0, #128
    bl . - 0x910
    cmp	r0, #0
    movne	r1, sp
    blne . - 0x88C
    str	r0, [r5, #116]
.Lfunc_00000808_013c:
    add	sp, sp, #100
    vpop	{d8}
    pop	{r4, r5, r6, r7, pc}
.size func_00000808, . - func_00000808
