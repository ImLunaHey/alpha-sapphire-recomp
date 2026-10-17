/* Independently implemented from docs/specs/cro/DllFieldEventPlayer_01.md. */
.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00002000, "ax", %progbits
.balign 4
.global func_00002000
.type func_00002000, %function
func_00002000:
    push	{r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, lr}
    sub	sp, sp, #692
    mov	r4, r2
    mov	r5, r0
    mov	r7, r3
    add	r0, sp, #72
    ldr	r9, [sp, #744]
    mov	r2, r9
    ldr	r1, [r9, #124]
    bl	. - 0x1F84
    ldr	r1, [r9, #124]
    mov	r2, r9
    add	r0, sp, #520
    bl	. - 0x1F94
    ldr	r1, [r9, #124]
    mov	r2, r9
    add	r0, sp, #136
    bl	. - 0x1FA4
    ldr	r1, [r9, #124]
    mov	r2, r9
    add	r0, sp, #16
    bl	. - 0x1FB4
    ldr	r1, [r9, #124]
    mov	r2, r9
    add	r0, sp, #192
    bl	. - 0x1FC4
    ldr	r1, [r9, #124]
    mov	r2, r9
    add	r0, sp, #576
    bl	. - 0x1FD4
    ldr	r1, [r9, #124]
    mov	r2, r9
    add	r0, sp, #632
    bl	. - 0x1FE4
    ldr	r1, [r9, #124]
    mov	r2, r9
    add	r0, sp, #464
    bl	. - 0x1FF4
    ldr	r1, [r9, #124]
    mov	r2, r9
    add	r0, sp, #408
    bl	. - 0x2004
    ldr	r0, [sp, #696]
    bl	. - 0x1F34
    mov	r6, r0
    ldr	r0, [sp, #696]
    add	r1, sp, #72
    bl	. - 0x1FC4
    add	r1, r5, #140
    add	r0, sp, #72
    bl	. - 0x1EA0
    mov	r0, r4
    bl	. - 0x1F70
    mov	r4, r0
    mov	r0, r7
    bl	. - 0x1FBC
    mov	r1, r4
    bl	. - 0x1F7C
    sub	r1, r0, #4096
    subs	r1, r1, #7
    bne	.L2108
.L20F4:
    ldr	r0, [sp, #696]
    bl	. - 0x1EC8
    bl	. - 0x1EC4
    cmp	r0, #0
    beq	.L25A0
.L2108:
    ldr	r0, [pc, #1744]
    ldr	r0, [r0]
    tst	r0, #1
    bne	.L214C
.L2118:
    ldr	r0, [pc, #1728]
    bl	. - 0x1EDC
    cmp	r0, #0
    nop	{0}
    beq	.L214C
.L212C:
    ldr	r1, [pc, #1712]
    ldr	r0, [pc, #1712]
    mov	r3, #8
    mov	r2, #44
    bl	. - 0x1EF4
    ldr	r0, [pc, #1688]
    nop	{0}
    bl	. - 0x1EF8
.L214C:
    ldr	r0, [sp, #696]
    bl	. - 0x1FB0
    str	r0, [sp, #256]
    ldr	r0, [sp, #696]
    bl	. - 0x1FB4
    str	r0, [sp, #260]
    ldr	r0, [sp, #696]
    ldrb	r1, [r0, #2190]
    bl	. - 0x1F7C
    ldr	r0, [sp, #696]
    ldrb	r1, [r0, #2191]
    bl	. - 0x1F80
    ldr	r10, [pc, #1636]
    mov	r4, #0
    add	r11, sp, #8
.L2188:
    ldr	r0, [pc, #1628]
    and	r1, r4, #255
    add	r2, sp, #16
    ldr	r3, [r0, r4, lsl #2]
    ldr	r0, [sp, #696]
    bl	. - 0x20F4
    mov	r7, #0
    ldr	r0, [sp, #696]
    and	r2, r4, #255
    mov	r3, #1
    add	r1, sp, #16
    str	r7, [sp]
    bl	. - 0x1F60
    strb	r0, [r11, r4]
    add	r0, r4, r4, lsl #1
    add	r0, r0, r4, lsl #3
    add	r8, r10, r0, lsl #2
    mov	r1, r8
    add	r0, sp, #16
    bl	. - 0x1FAC
    ldrb	r0, [r11, r4]
    cmp	r0, #0
    bne	.L221C
.L21E4:
    ldr	r0, [sp, #696]
    add	r2, sp, #128
    add	r1, sp, #16
    bl	. - 0x20F0
    cmp	r0, #0
    nop	{0}
    beq	.L2214
.L2200:
    ldr	r0, [sp, #128]
    bl	. - 0x1FCC
    cmp	r0, #0
    nop	{0}
    bne	.L221C
.L2214:
    mov	r0, #2
    strb	r0, [r11, r4]
.L221C:
    ldr	r0, [pc, #1484]
    add	r0, r0, r4, lsl #1
    ldrb	r2, [r0, #1]
    ldrb	r1, [r0]
    add	r0, sp, #16
    bl	. - 0x1FD0
    ldr	r0, [sp, #696]
    and	r2, r4, #255
    mov	r3, #1
    add	r1, sp, #16
    str	r7, [sp]
    bl	. - 0x1FF0
    add	r7, r11, r4
    add	r1, r8, #176
    strb	r0, [r7, #4]
    add	r0, sp, #16
    bl	. - 0x2034
    ldrb	r0, [r7, #4]
    cmp	r0, #0
    bne	.L22A4
.L226C:
    ldr	r0, [sp, #696]
    add	r2, sp, #128
    add	r1, sp, #16
    bl	. - 0x2178
    cmp	r0, #0
    nop	{0}
    beq	.L229C
.L2288:
    ldr	r0, [sp, #128]
    bl	. - 0x2054
    cmp	r0, #0
    nop	{0}
    bne	.L22A4
.L229C:
    mov	r0, #2
    strb	r0, [r7, #4]
.L22A4:
    add	r4, r4, #1
    cmp	r4, #4
    bcc	.L2188
.L22B0:
    ldr	r0, [sp, #256]
    and	r1, r0, #255
    ldr	r0, [sp, #696]
    bl	. - 0x20CC
    ldr	r0, [sp, #260]
    and	r1, r0, #255
    ldr	r0, [sp, #696]
    bl	. - 0x20D4
    ldrb	r0, [r5, #312]
    ldr	r8, [pc, #1304]
    cmp	r0, #6
    moveq	r4, #1
    movne	r4, #0
    cmp	r6, #4
    bcc	.L253C
.L22EC:
    beq	.L2324
.L22F0:
    cmp	r6, #5
    beq	.L23A8
.L22F8:
    cmp	r6, #6
    beq	.L242C
.L2300:
    cmp	r6, #7
    beq	.L24B4
.L2308:
    mov	r2, #0
    mov	r1, r2
    mov	r0, r2
    bl	. - 0x22E4
    nop	{0}
    nop	{0}
    b	.L259C
.L2324:
    ldrb	r0, [r8, r4, lsl #2]
    cmp	r0, #0
    beq	.L2348
.L2330:
    ldrb	r0, [sp, #14]
    cmp	r0, #0
    ldrbne	r0, [sp, #15]
    cmpne	r0, #0
    bne	.L2364
.L2344:
    b	.L2360
.L2348:
    ldrb	r0, [sp, #10]
    cmp	r0, #0
    beq	.L2360
.L2354:
    ldrb	r0, [sp, #11]
    cmp	r0, #0
    bne	.L2364
.L2360:
    mov	r6, #0
.L2364:
    add	r0, r8, r4, lsl #2
    ldrb	r0, [r0, #2]
    cmp	r0, #0
    beq	.L238C
.L2374:
    ldrb	r0, [sp, #12]
    cmp	r0, #0
    ldrbne	r0, [sp, #13]
    cmpne	r0, #0
    beq	.L24AC
.L2388:
    b	.L2534
.L238C:
    ldrb	r0, [sp, #8]
    cmp	r0, #0
    beq	.L24AC
.L2398:
    ldrb	r0, [sp, #9]
    cmp	r0, #0
    beq	.L24AC
.L23A4:
    b	.L2534
.L23A8:
    ldrb	r0, [r8, r4, lsl #2]
    cmp	r0, #0
    beq	.L23CC
.L23B4:
    ldrb	r0, [sp, #14]
    cmp	r0, #0
    ldrbne	r0, [sp, #15]
    cmpne	r0, #0
    bne	.L23E8
.L23C8:
    b	.L23E4
.L23CC:
    ldrb	r0, [sp, #10]
    cmp	r0, #0
    beq	.L23E4
.L23D8:
    ldrb	r0, [sp, #11]
    cmp	r0, #0
    bne	.L23E8
.L23E4:
    mov	r6, #0
.L23E8:
    add	r0, r8, r4, lsl #2
    ldrb	r0, [r0, #3]
    cmp	r0, #0
    beq	.L2410
.L23F8:
    ldrb	r0, [sp, #12]
    cmp	r0, #0
    ldrbne	r0, [sp, #13]
    cmpne	r0, #0
    beq	.L25A8
.L240C:
    b	.L2534
.L2410:
    ldrb	r0, [sp, #8]
    cmp	r0, #0
    beq	.L25A8
.L241C:
    ldrb	r0, [sp, #9]
    cmp	r0, #0
    beq	.L25A8
.L2428:
    b	.L2534
.L242C:
    add	r0, r8, r4, lsl #2
    ldrb	r1, [r0, #1]
    cmp	r1, #0
    beq	.L2454
.L243C:
    ldrb	r1, [sp, #14]
    cmp	r1, #0
    ldrbne	r1, [sp, #15]
    cmpne	r1, #0
    bne	.L2470
.L2450:
    b	.L246C
.L2454:
    ldrb	r1, [sp, #10]
    cmp	r1, #0
    beq	.L246C
.L2460:
    ldrb	r1, [sp, #11]
    cmp	r1, #0
    bne	.L2470
.L246C:
    mov	r6, #1
.L2470:
    ldrb	r0, [r0, #2]
    cmp	r0, #0
    beq	.L2494
.L247C:
    ldrb	r0, [sp, #12]
    cmp	r0, #0
    ldrbne	r0, [sp, #13]
    cmpne	r0, #0
    beq	.L24AC
.L2490:
    b	.L2534
.L2494:
    ldrb	r0, [sp, #8]
    cmp	r0, #0
    beq	.L24AC
.L24A0:
    ldrb	r0, [sp, #9]
    cmp	r0, #0
    bne	.L2534
.L24AC:
    mov	r6, #2
    b	.L253C
.L24B4:
    add	r0, r8, r4, lsl #2
    ldrb	r1, [r0, #1]
    cmp	r1, #0
    beq	.L24DC
.L24C4:
    ldrb	r1, [sp, #14]
    cmp	r1, #0
    ldrbne	r1, [sp, #15]
    cmpne	r1, #0
    bne	.L24F8
.L24D8:
    b	.L24F4
.L24DC:
    ldrb	r1, [sp, #10]
    cmp	r1, #0
    beq	.L24F4
.L24E8:
    ldrb	r1, [sp, #11]
    cmp	r1, #0
    bne	.L24F8
.L24F4:
    mov	r6, #1
.L24F8:
    ldrb	r0, [r0, #3]
    cmp	r0, #0
    beq	.L251C
.L2504:
    ldrb	r0, [sp, #12]
    cmp	r0, #0
    ldrbne	r0, [sp, #13]
    cmpne	r0, #0
    beq	.L25A8
.L2518:
    b	.L2534
.L251C:
    ldrb	r0, [sp, #8]
    cmp	r0, #0
    beq	.L25A8
.L2528:
    ldrb	r0, [sp, #9]
    cmp	r0, #0
    beq	.L25A8
.L2534:
    cmp	r6, #4
    bcs	.L259C
.L253C:
    mvn	r1, #1
    mov	r0, r6
    bl	. - 0x22DC
    mov	r7, r0
    mov	r1, #2
    mov	r0, r6
    bl	. - 0x22EC
    mov	r1, r0
    add	r0, r8, r4, lsl #2
    mov	r8, #1
    ldrb	r0, [r0, r6]
    cmp	r0, #0
    addne	r2, r7, #4
    andne	r2, r2, #255
    moveq	r2, r7
    addne	r0, r1, #4
    ldrb	r3, [r11, r2]
    andne	r0, r0, #255
    moveq	r0, r1
    cmp	r3, #0
    beq	.L25B0
.L2590:
    ldrb	r2, [r11, r0]
    cmp	r2, #0
    beq	.L25EC
.L259C:
    mov	r0, #0
.L25A0:
    add	sp, sp, #708
    pop	{r4, r5, r6, r7, r8, r9, r10, r11, pc}
.L25A8:
    mov	r6, #3
    b	.L253C
.L25B0:
    add	r0, r2, r2, lsl #1
    add	r0, r0, r2, lsl #3
    strb	r7, [r5, #185]
    add	r0, r10, r0, lsl #2
    add	lr, r5, #196
    ldm	r0, {r1, r2, r3, r4, r7, r10, r11, r12}
    stm	lr, {r1, r2, r3, r4, r7, r10, r11, r12}
    add	r1, r0, #32
    ldr	r0, [r0, #40]
    ldm	r1, {r1, r2}
    str	r0, [r5, #236]
    add	r0, r5, #228
    stm	r0, {r1, r2}
    strb	r8, [r5, #186]
    b	.L2620
.L25EC:
    add	r2, r0, r0, lsl #1
    add	r0, r2, r0, lsl #3
    strb	r1, [r5, #185]
    add	r0, r10, r0, lsl #2
    add	r2, r5, #196
    vldmia	r0, {s0-s7}
    mov	r1, #0
    vstmia	r2, {s0-s7}
    ldrd	r2, [r0, #32]
    ldr	r0, [r0, #40]
    str	r0, [r5, #236]
    strd	r2, [r5, #228]
    strb	r1, [r5, #186]
.L2620:
    ldr	r1, [r9, #124]
    mov	r2, r9
    add	r0, sp, #296
    bl	. - 0x2564
    ldr	r1, [r9, #124]
    mov	r2, r9
    add	r0, sp, #352
    bl	. - 0x2574
    mov	r2, #1
    add	r1, r5, #196
    add	r0, sp, #72
    bl	. - 0x23DC
    add	r1, sp, #296
    add	r0, sp, #72
    bl	. - 0x23E0
    ldr	r0, [sp, #696]
    add	r2, sp, #352
    add	r1, sp, #296
    bl	. - 0x2588
    cmp	r0, #0
    nop	{0}
    beq	.L2690
.L2678:
    add	r1, sp, #248
    add	r0, sp, #352
    bl	. - 0x2400
    ldr	r0, [sp, #256]
    str	r0, [r5, #240]
    b	.L269C
.L2690:
    ldr	r0, [sp, #696]
    bl	. - 0x25C4
    vstr	s0, [r5, #240]
.L269C:
    strb	r6, [r5, #184]
    ldrb	r0, [r5, #312]
    cmp	r0, #5
    beq	.L27D4
.L26AC:
    cmp	r0, #7
    ldr	r0, [sp, #696]
    add	r4, r5, #256
    beq	.L271C
.L26BC:
    bl	. - 0x2544
    mov	r1, r0
    ldrb	r0, [r5, #184]
    mov	r6, #239
    cmp	r1, r0
    bne	.L27B8
.L26D4:
    ldr	r0, [pc, #284]
    vldr	s0, [r0]
    ldr	r0, [sp, #696]
    bl	. - 0x2570
    cmp	r0, #0
    nop	{0}
    beq	.L278C
.L26F0:
    strh	r8, [r4, #40]
    ldrb	r0, [r5, #184]
    mov	r2, #1
    add	r1, r5, #296
    strb	r0, [r5, #298]
    strb	r8, [r5, #299]
    ldr	r0, [sp, #696]
    bl	. - 0x25D4
    nop	{0}
    nop	{0}
    b	.L27D4
.L271C:
    nop	{0}
    bl	. - 0x25A8
    mov	r1, r0
    ldrb	r0, [r5, #184]
    cmp	r1, r0
    bne	.L2760
.L2734:
    mov	r1, #112
    strh	r1, [r4, #40]
    strb	r0, [r5, #298]
    strb	r8, [r5, #299]
    ldr	r0, [sp, #696]
    mov	r2, #1
    add	r1, r5, #296
    bl	. - 0x2618
    nop	{0}
    nop	{0}
    b	.L27D4
.L2760:
    mov	r1, #115
    strh	r1, [r4, #40]
    strb	r0, [r5, #298]
    strb	r8, [r5, #299]
    ldr	r0, [sp, #696]
    mov	r2, #1
    add	r1, r5, #296
    bl	. - 0x2644
    nop	{0}
    nop	{0}
    b	.L27D4
.L278C:
    strh	r6, [r4, #40]
    ldrb	r0, [r5, #184]
    mov	r2, #1
    add	r1, r5, #296
    strb	r0, [r5, #298]
    strb	r8, [r5, #299]
    ldr	r0, [sp, #696]
    bl	. - 0x2670
    nop	{0}
    nop	{0}
    b	.L27D4
.L27B8:
    strh	r6, [r4, #40]
    strb	r0, [r5, #298]
    strb	r8, [r5, #299]
    ldr	r0, [sp, #696]
    mov	r2, #1
    add	r1, r5, #296
    bl	. - 0x2698
.L27D4:
    add	sp, sp, #708
    mov	r0, #1
    pop	{r4, r5, r6, r7, r8, r9, r10, r11, pc}
.size func_00002000, . - func_00002000
