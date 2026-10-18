.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00001C84, "ax", %progbits
.balign 4
.global func_00001C84
.type func_00001C84, %function
func_00001C84:
    push	{r4, r5, r6, r7, r8, lr}
    mov	r4, r0
    ldr	r0, [r0, #244]
    cmp	r0, #0
    beq . + 0x34
    bl . - 0x1AA8
    cmp	r0, #0
    ldr	r0, [r4, #244]
    beq . + 0x10
    bl . - 0x1AB0
    mov	r0, #0
    pop	{r4, r5, r6, r7, r8, pc}
    nop
    bl . - 0x1AB8
    ldr	r0, [r4, #244]
    nop
    bl . - 0x1ABC
    ldr	r0, [r4, #248]
    mov	r7, #0
    cmp	r0, #0
    beq . + 0xC
    bl . - 0x1CD8
    str	r7, [r4, #248]
    ldr	r0, [r4, #252]
    cmp	r0, #0
    beq . + 0xC
    bl . - 0x1CEC
    str	r7, [r4, #252]
    ldr	r0, [r4, #256]
    cmp	r0, #0
    beq . + 0xC
    bl . - 0x1D00
    str	r7, [r4, #256]
    ldr	r0, [r4, #244]
    cmp	r0, #0
    beq . + 0x14
    ldr	r1, [r0]
    ldr	r1, [r1, #16]
    blx r1
    str	r7, [r4, #244]
    ldr	r0, [r4, #312]
    cmp	r0, #0
    subne	r0, r0, #1
    strne	r0, [r4, #312]
    bne . - 0x88
    bl . - 0x1B28
    mov	r0, #13
    nop
    bl . - 0x1B2C
    mov	r1, #8192
    nop
    bl . - 0x1B30
    ldr	r0, [r4, #264]
    cmp	r0, #0
    beq . + 0x44
    bl . - 0x1CA8
    ldr	r0, [r0, #28]
    mov	r5, #0
    ldr	r0, [r0]
    add	r6, r0, #126976
    ldr	r0, [r4, #264]
    add	r6, r6, #3552
    cmp	r0, #0
    bls . + 0x1C
    mov	r0, r6
    bl . - 0x1B60
    ldr	r0, [r4, #264]
    add	r5, r5, #1
    cmp	r0, r5
    bhi . - 0x14
    str	r7, [r4, #264]
    ldr	r0, [r4, #300]
    cmp	r0, #0
    beq . + 0x4C
    bl . - 0x1CF4
    ldr	r0, [r0, #28]
    mov	r1, #65
    ldr	r0, [r0]
    add	r5, r0, #116736
    add	r5, r5, #212
    mov	r0, r5
    bl . - 0x1C40
    ldr	r1, [r4, #300]
    sub	r2, r0, r1
    mov	r1, #65
    mov	r0, r5
    bl . - 0x1C44
    ldr	r2, [r4, #300]
    mov	r1, #63
    mov	r0, r5
    bl . - 0x1C5C
    str	r7, [r4, #300]
    ldr	r0, [r4, #276]
    bl . - 0x1BC8
    nop
    nop
    bl . - 0x1D4C
    ldr	r0, [r0, #28]
    ldr	r0, [r0]
    add	r0, r0, #126976
    add	r0, r0, #3552
    bl . - 0x1BE0
    mov	r0, #1
    pop	{r4, r5, r6, r7, r8, pc}
.size func_00001C84, . - func_00001C84

.section .text.func_00002120, "ax", %progbits
.balign 4
.global func_00002120
.type func_00002120, %function
func_00002120:
    push	{r4, r5, r6, lr}
    mov	r4, r0
    bl . - 0x1E68
    ldr	r0, [r4, #128]
    cmp	r0, #0
    blne . - 0x2094
    ldr	r0, [r4, #132]
    mvn	r5, #0
    cmp	r0, #0
    beq . + 0xC
    bl . - 0x1E80
    mov	r5, r0
    ldrb	r0, [r4, #136]
    cmp	r0, #0
    beq . + 0x18
    ldr	r0, [r4, #92]
    bl . - 0x1E90
    cmp	r0, #0
    moveq	r0, #0
    strbeq	r0, [r4, #136]
    mov	r0, r4
    bl . + 0x13F0
    ldr	r0, [r4, #92]
    nop
    bl . - 0x20F0
    ldrb	r0, [r4, #153]
    cmp	r0, #0
    bne . + 0x20
    mov	r0, #1
    mov	r3, #1
    strb	r0, [r4, #153]
    ldr	r0, [r4, #92]
    mov	r2, #82
    mov	r1, r3
    bl . - 0x1F20
    mov	r0, r5
    pop	{r4, r5, r6, pc}
.size func_00002120, . - func_00002120

.section .text.func_00003564, "ax", %progbits
.balign 4
.global func_00003564
.type func_00003564, %function
func_00003564:
    push	{r4, r5, r6, r7, r8, r9, sl, fp, lr}
    mov	r4, r0
    sub	sp, sp, #76
    ldrb	r0, [r0, #137]
    cmp	r0, #0
    beq . + 0x130
    ldrb	r0, [r4, #136]
    cmp	r0, #0
    bne . + 0x124
    mov	fp, #0
    mov	r3, #131
    mov	r2, #1
    mov	r1, r4
    add	r0, sp, #40
    strb	fp, [r4, #137]
    bl . - 0x3228
    mov	r3, #131
    mov	r2, #1
    mov	r1, r4
    add	r0, sp, #56
    bl . - 0x3234
    vldr	s0, [sp, #64]
    vldr	s2, [sp, #56]
    vldr	s1, [pc, #232]
    vsub.f32	s0, s0, s2
    vcmpe.f32	s0, s1
    vmrs	APSR_nzcv, fpscr
    vldr	s2, [pc, #220]
    vldr	s3, [sp, #40]
    vneglt.f32	s0, s0
    vmla.f32	s3, s0, s2
    vcvt.s32.f32	s0, s3
    vldr	s3, [sp, #60]
    vmov	r0, s0
    vldr	s0, [sp, #68]
    vsub.f32	s0, s0, s3
    sxth r5, r0
    vcmpe.f32	s0, s1
    vmrs	APSR_nzcv, fpscr
    vldr	s1, [sp, #44]
    vneglt.f32	s0, s0
    vmls.f32	s1, s0, s2
    vcvt.s32.f32	s0, s1
    vmov	r0, s0
    sxth r6, r0
    bl . - 0x3560
    bl . - 0x3294
    mov	r8, r0
    ldr	r0, [r4, #116]
    mov	r2, #1
    ldr	r1, [r0, #4]
    mov	r0, #12
    bl . - 0x32A4
    movs	sl, r0
    beq . + 0x68
    ldr	r0, [r4, #92]
    mov	r1, #1
    bl . - 0x32B0
    mov	r7, r0
    mov	r0, r4
    bl . - 0x32B4
    mov	r9, r0
    mov	r0, r4
    bl . - 0x32B8
    add	r2, sp, #24
    mov	r1, #1
    stm	r2, {r6, fp}
    mov	r3, r8
    str	fp, [sp, #32]
    str	fp, [sp, #36]
    stm	sp, {r0, r9}
    add	r0, sp, #16
    stm	r0, {r1, r5}
    add	r0, sp, #8
    stm	r0, {r7, fp}
    ldr	r0, [r4, #116]
    add	r0, r0, #4
    ldm	r0, {r1, r2}
    mov	r0, sl
    bl . - 0x32F0
    str	r0, [r4, #132]
    add	sp, sp, #76
    pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.size func_00003564, . - func_00003564

.section .text.func_00003714, "ax", %progbits
.balign 4
.global func_00003714
.type func_00003714, %function
func_00003714:
    push	{r4, r5, r6, r7, r8, lr}
    mov	r3, #0
    sub	sp, sp, #128
    mov	r5, r1
    mov	r2, r3
    bl . - 0x3350
    mov	r4, r0
    ldr	r0, [pc, #592]
    mov	r6, #0
    str	r0, [r4]
    str	r5, [r4, #116]
    strb	r6, [r4, #120]
    str	r6, [r4, #128]
    str	r6, [r4, #132]
    strb	r6, [r4, #136]
    strb	r6, [r4, #137]
    bl . - 0x369C
    ldr	r0, [r0, #28]
    ldr	r0, [r0]
    add	r0, r0, #126976
    add	r0, r0, #3552
    ldr	r1, [r0]
    ldr	r1, [r1, #12]
    blx r1
    str	r0, [r4, #140]
    strb	r6, [r4, #144]
    strb	r6, [r4, #145]
    str	r6, [r4, #148]
    mov	r1, #0
    add	r3, r4, #160
    strb	r6, [r4, #152]
    mov	r2, r1
    strb	r6, [r4, #153]
    stm	r3, {r1, r2}
    mov	r2, #1
    mov	r1, r5
    mov	r0, r4
    bl . - 0x33C8
    ldr	ip, [pc, #472]
    mov	r3, #125
    mov	r2, #8
    str	r3, [sp, #16]
    mov	r7, #1
    mov	r3, #2
    str	r2, [sp, #28]
    mov	r8, #4
    sub	r2, ip, #80
    str	r3, [sp, #12]
    str	r6, [sp, #24]
    str	r7, [sp, #20]
    stm	sp, {r2, r8, ip}
    mov	r0, r4
    mov	r1, r5
    mov	r2, #0
    bl . - 0x3404
    bl . - 0x3738
    bl . - 0x346C
    mov	r1, r0
    ldr	r0, [r4, #116]
    ldr	r3, [pc, #392]
    mov	r2, #1
    stm	sp, {r0, r7}
    ldr	r0, [r4, #92]
    bl . - 0x3420
    mov	r0, r4
    bl . - 0x3470
    ldr	r2, [pc, #368]
    mov	r1, r0
    ldr	r0, [r4, #116]
    add	r3, sp, #4
    str	r2, [sp]
    stm	r3, {r0, r6}
    mov	r3, #1
    ldr	r0, [r4, #92]
    mov	r2, r3
    bl . - 0x3448
    ldr	r2, [pc, #332]
    ldr	r0, [r4, #92]
    mov	r3, #5
    mov	r1, #1
    bl . - 0x3454
    mov	r1, #1
    mov	r0, r4
    bl . - 0x3458
    mov	r1, #11
    mov	r2, r0
    str	r1, [sp]
    ldr	r3, [pc, #292]
    mov	r1, r5
    mov	r0, r4
    bl . - 0x346C
    vldr	s0, [pc, #280]
    mov	r5, #16
    vstr	s0, [sp, #76]
    vstr	s0, [sp, #80]
    vstr	s0, [sp, #84]
    mvn	r0, #0
    strb	r7, [sp, #112]
    str	r5, [sp, #100]
    strb	r7, [sp, #104]
    str	r0, [sp, #108]
    strb	r7, [sp, #113]
    ldr	r0, [r4, #116]
    ldr	r0, [r0, #4]
    str	r0, [sp, #88]
    ldr	r0, [r4, #116]
    ldr	r0, [r0, #8]
    str	r0, [sp, #92]
    ldr	r0, [r4, #116]
    ldr	r0, [r0, #16]
    str	r0, [sp, #96]
    mov	r0, r4
    bl . - 0x352C
    str	r0, [sp, #32]
    mov	r0, r4
    bl . - 0x3540
    str	r0, [sp, #36]
    ldr	r0, [r4, #92]
    mov	r1, #1
    bl . - 0x3558
    vldmia	r0, {s0-s7}
    add	r2, sp, #40
    mov	r3, #129
    mov	r1, r4
    vstmia	r2, {s0-s7}
    mov	r2, #1
    ldr	r0, [r0, #32]
    str	r5, [sp, #100]
    str	r0, [sp, #72]
    add	r0, sp, #116
    bl . - 0x35A4
    add	r3, sp, #116
    ldm	r3, {r0, r1, r2}
    add	r3, sp, #76
    stm	r3, {r0, r1, r2}
    strb	r6, [sp, #104]
    ldr	r0, [r4, #116]
    ldr	r1, [r0, #4]
    mov	r0, #128
    bl . - 0x3910
    cmp	r0, #0
    addne	r1, sp, #32
    blne . - 0x3534
    str	r0, [r4, #128]
    bl . - 0x389C
    ldr	r0, [r0, #28]
    ldr	r0, [r0]
    add	r0, r0, #73728
    add	r0, r0, #2464
    bl . - 0x3888
    strd r0, [r4, #0xA0]
    mov	r1, #1
    mov	r0, r4
    bl . - 0x3558
    add	sp, sp, #128
    mov	r0, r4
    pop	{r4, r5, r6, r7, r8, pc}
.size func_00003714, . - func_00003714

.section .note.GNU-stack, "", %progbits

