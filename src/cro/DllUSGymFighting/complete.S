.syntax unified
.arch armv6k
.fpu vfp
.arm

/* Neutral unit implementation for DllUSGymFighting. */
.section .text.DllUSGymFighting, "ax", %progbits
.balign 4
text_start:
text_00000000:
    ldr	pc, [pc, #-4]
text_00000004:
    .4byte __cro_import_anon_m7c7374617469637c_s0_034fa84
text_00000008:
    ldr	pc, [pc, #-4]
text_0000000C:
    .4byte __cro_import_anon_m7c7374617469637c_s0_034c708
text_00000010:
    ldr	pc, [pc, #-4]
text_00000014:
    .4byte __cro_import_anon_m7c7374617469637c_s0_00e8294
text_00000018:
    ldr	pc, [pc, #-4]
text_0000001C:
    .4byte __cro_import_anon_m7c7374617469637c_s0_01ff8c0
text_00000020:
    ldr	pc, [pc, #-4]
text_00000024:
    .4byte __cro_import_anon_m7c7374617469637c_s0_001fa90
text_00000028:
    ldr	pc, [pc, #-4]
text_0000002C:
    .4byte __cro_import_anon_m446c6c4669656c64_s0_00e5b70
text_00000030:
    ldr	pc, [pc, #-4]
text_00000034:
    .4byte __cro_import_anon_m7c7374617469637c_s0_0291544
text_00000038:
    ldr	pc, [pc, #-4]
text_0000003C:
    .4byte __cro_import_anon_m7c7374617469637c_s0_0272748
text_00000040:
    ldr	pc, [pc, #-4]
text_00000044:
    .4byte __cro_import_anon_m7c7374617469637c_s0_0352ee0
text_00000048:
    ldr	pc, [pc, #-4]
text_0000004C:
    .4byte __cro_import_anon_m7c7374617469637c_s0_03529f8
text_00000050:
    ldr	pc, [pc, #-4]
text_00000054:
    .4byte __cro_import_anon_m7c7374617469637c_s0_0352160
text_00000058:
    ldr	pc, [pc, #-4]
text_0000005C:
    .4byte __cro_import_anon_m7c7374617469637c_s0_0352328
text_00000060:
    ldr	pc, [pc, #-4]
text_00000064:
    .4byte __cro_import_anon_m7c7374617469637c_s0_028b374
text_00000068:
    ldr	pc, [pc, #-4]
text_0000006C:
    .4byte __cro_import_anon_m7c7374617469637c_s0_028b69c
text_00000070:
    ldr	pc, [pc, #-4]
text_00000074:
    .4byte __cro_import_anon_m446c6c4669656c64_s0_008f4c4
text_00000078:
    ldr	pc, [pc, #-4]
text_0000007C:
    .4byte __cro_import_anon_m446c6c4669656c64_s0_00e5ba0
text_00000080:
    ldr	pc, [pc, #-4]
text_00000084:
    .4byte __cro_import_anon_m7c7374617469637c_s0_03dbdec
text_00000088:
    ldr	pc, [pc, #-4]
text_0000008C:
    .4byte __cro_import_anon_m446c6c4669656c64_s0_008a5b0
text_00000090:
    ldr	pc, [pc, #-4]
text_00000094:
    .4byte __cro_import_anon_m7c7374617469637c_s0_0352e54
text_00000098:
    ldr	pc, [pc, #-4]
text_0000009C:
    .4byte __cro_import_anon_m7c7374617469637c_s0_03525b4
text_000000A0:
    ldr	pc, [pc, #-4]
text_000000A4:
    .4byte __cro_import_anon_m7c7374617469637c_s0_035bb70
text_000000A8:
    ldr	pc, [pc, #-4]
text_000000AC:
    .4byte __cro_import_anon_m7c7374617469637c_s0_035baf8
text_000000B0:
    ldr	pc, [pc, #-4]
text_000000B4:
    .4byte __cro_import_anon_m7c7374617469637c_s0_000018d
text_000000B8:
    ldr	pc, [pc, #-4]
text_000000BC:
    .4byte __cro_import_anon_m7c7374617469637c_s0_0023480
text_000000C0:
    ldr	pc, [pc, #-4]
text_000000C4:
    .4byte __cro_import_anon_m7c7374617469637c_s0_0352e74
text_000000C8:
    ldr	pc, [pc, #-4]
text_000000CC:
    .4byte __cro_import_anon_m7c7374617469637c_s0_0000295
text_000000D0:
.global func_000000D0
.type func_000000D0, %function
func_000000D0:
    push	{r4, r5, r6, lr}
text_000000D4:
    mov	r4, r0
text_000000D8:
    ldr	r0, [r1, #416]
text_000000DC:
    mov	r5, r2
text_000000E0:
    mov	r1, r2
text_000000E4:
    str	r0, [r4, #24]
text_000000E8:
    bl	text_000006FC
text_000000EC:
    strb	r5, [r4, #28]
text_000000F0:
    pop	{r4, r5, r6, lr}
text_000000F4:
    mov	r3, #0
text_000000F8:
    ldr	r0, [pc, #8]
text_000000FC:
    mvn	r2, #0
text_00000100:
    mov	r1, r3
text_00000104:
    b	text_00000000
.size func_000000D0, . - func_000000D0

text_00000108:
    .4byte 0
text_0000010C:
.global func_0000010C
.type func_0000010C, %function
func_0000010C:
    mov	r0, #1
text_00000110:
    bx	lr
.size func_0000010C, . - func_0000010C

text_00000114:
.global func_00000114
.type func_00000114, %function
func_00000114:
    bx	lr
.size func_00000114, . - func_00000114

text_00000118:
.global func_00000118
.type func_00000118, %function
func_00000118:
    mov	r1, #0
text_0000011C:
    str	r1, [r0, #32]
text_00000120:
    bx	lr
.size func_00000118, . - func_00000118

text_00000124:
.global func_00000124
.type func_00000124, %function
func_00000124:
    push	{r4, r5, r6, r7, r8, lr}
text_00000128:
    mov	r4, r0
text_0000012C:
    mov	r7, #0
text_00000130:
    ldr	r5, [pc, #272]
text_00000134:
    vpush	{d8}
text_00000138:
    ldr	r0, [r0, #32]
text_0000013C:
    cmp	r0, #0
text_00000140:
    beq	text_00000150
text_00000144:
    cmp	r0, #1
text_00000148:
    bne	text_0000023C
text_0000014C:
    b	text_000001EC
text_00000150:
    ldr	r0, [pc, #244]
text_00000154:
    mvn	r1, #0
text_00000158:
    bl	text_00000008
text_0000015C:
    cmp	r0, #0
text_00000160:
    nop
text_00000164:
    bne	text_0000023C
text_00000168:
    mov	r3, #0
text_0000016C:
    mvn	r2, #0
text_00000170:
    mov	r1, r3
text_00000174:
    mov	r0, r5
text_00000178:
    bl	text_00000000
text_0000017C:
    ldr	r5, [r4, #24]
text_00000180:
    ldrb	r1, [r4, #28]
text_00000184:
    vldr	s0, [pc, #196]
text_00000188:
    ldr	r0, [r5, #16]
text_0000018C:
    ldr	r8, [r0], #4
text_00000190:
    vldmia	r0, {s16-s17}
text_00000194:
    add	r0, r5, r1, lsl #2
text_00000198:
    mov	r1, #0
text_0000019C:
    ldr	r6, [r0, #276]
text_000001A0:
    ldr	r0, [r6]
text_000001A4:
    ldr	r2, [r0, #204]
text_000001A8:
    mov	r0, r6
text_000001AC:
    blx	r2
text_000001B0:
    ldr	r0, [r6]
text_000001B4:
    mov	r1, #0
text_000001B8:
    vldr	s0, [pc, #148]
text_000001BC:
    ldr	r2, [r0, #212]
text_000001C0:
    mov	r0, r6
text_000001C4:
    blx	r2
text_000001C8:
    bic	r1, r8, #255
text_000001CC:
    orr	r0, r1, #2
text_000001D0:
    ldr	r1, [r5, #16]
text_000001D4:
    str	r0, [r1], #4
text_000001D8:
    vstmia	r1, {s16-s17}
text_000001DC:
    ldr	r0, [r4, #32]
text_000001E0:
    add	r0, r0, #1
text_000001E4:
    str	r0, [r4, #32]
text_000001E8:
    b	text_0000023C
text_000001EC:
    mvn	r1, #0
text_000001F0:
    mov	r0, r5
text_000001F4:
    bl	text_00000008
text_000001F8:
    cmp	r0, #0
text_000001FC:
    nop
text_00000200:
    bne	text_0000023C
text_00000204:
    ldr	r1, [r4, #24]
text_00000208:
    ldr	r0, [r1, #16]
text_0000020C:
    ldr	r0, [r0]
text_00000210:
    and	r0, r0, #65280
text_00000214:
    add	r0, r1, r0, lsr #6
text_00000218:
    ldr	r0, [r0, #276]
text_0000021C:
    ldr	r1, [r0]
text_00000220:
    ldr	r2, [r1, #208]
text_00000224:
    mov	r1, #0
text_00000228:
    blx	r2
text_0000022C:
    ldr	r1, [pc, #36]
text_00000230:
    vmov	r0, s0
text_00000234:
    cmp	r0, r1
text_00000238:
    movge	r7, #1
text_0000023C:
    vpop	{d8}
text_00000240:
    mov	r0, r7
text_00000244:
    pop	{r4, r5, r6, r7, r8, pc}
.size func_00000124, . - func_00000124

text_00000248:
    .4byte 0
text_0000024C:
    .4byte 0
text_00000250:
    .4byte 0x00000000
text_00000254:
    .4byte 0x3f800000
text_00000258:
    .4byte 0x40a00000
text_0000025C:
.global func_0000025C
.type func_0000025C, %function
func_0000025C:
    push	{r4, lr}
text_00000260:
    bl	text_00000010
text_00000264:
    pop	{r4, lr}
text_00000268:
    b	text_00000018
.size func_0000025C, . - func_0000025C

text_0000026C:
.global func_0000026C
.type func_0000026C, %function
func_0000026C:
    b	text_00000010
.size func_0000026C, . - func_0000026C

text_00000270:
.global func_00000270
.type func_00000270, %function
func_00000270:
    bx	lr
.size func_00000270, . - func_00000270

text_00000274:
.global func_00000274
.type func_00000274, %function
func_00000274:
    bx	lr
.size func_00000274, . - func_00000274

text_00000278:
.global func_00000278
.type func_00000278, %function
func_00000278:
    mov	r0, #0
text_0000027C:
    bx	lr
.size func_00000278, . - func_00000278

text_00000280:
.global func_00000280
.type func_00000280, %function
func_00000280:
    mov	r0, #0
text_00000284:
    bx	lr
.size func_00000280, . - func_00000280

text_00000288:
.global func_00000288
.type func_00000288, %function
func_00000288:
    mov	r0, #0
text_0000028C:
    bx	lr
.size func_00000288, . - func_00000288

text_00000290:
.global func_00000290
.type func_00000290, %function
func_00000290:
    bx	lr
.size func_00000290, . - func_00000290

text_00000294:
.global func_00000294
.type func_00000294, %function
func_00000294:
    mov	r0, #0
text_00000298:
    bx	lr
.size func_00000294, . - func_00000294

text_0000029C:
.global func_0000029C
.type func_0000029C, %function
func_0000029C:
    bx	lr
.size func_0000029C, . - func_0000029C

text_000002A0:
.global func_000002A0
.type func_000002A0, %function
func_000002A0:
    push	{r4, r5, r6, r7, r8, lr}
text_000002A4:
    mov	r6, r0
text_000002A8:
    mov	r8, #3
text_000002AC:
    vpush	{d8-d9}
text_000002B0:
    ldr	r0, [r0, #16]
text_000002B4:
    ldr	r7, [r0], #4
text_000002B8:
    vldmia	r0, {s16-s17}
text_000002BC:
    ands	r1, r7, #255
text_000002C0:
    mov	r0, #1
text_000002C4:
    beq	text_000002E8
text_000002C8:
    cmp	r1, #1
text_000002CC:
    beq	text_00000310
text_000002D0:
    cmp	r1, #2
text_000002D4:
    bne	text_00000308
text_000002D8:
    vpop	{d8-d9}
text_000002DC:
    mov	r0, r6
text_000002E0:
    pop	{r4, r5, r6, r7, r8, lr}
text_000002E4:
    b	text_00000798
text_000002E8:
    ldrb	r1, [r6, #308]
text_000002EC:
    cmp	r1, #4
text_000002F0:
    bne	text_00000308
text_000002F4:
    bic	r1, r7, #255
text_000002F8:
    orr	r0, r0, r1
text_000002FC:
    ldr	r1, [r6, #16]
text_00000300:
    str	r0, [r1], #4
text_00000304:
    vstmia	r1, {s16-s17}
text_00000308:
    vpop	{d8-d9}
text_0000030C:
    pop	{r4, r5, r6, r7, r8, pc}
text_00000310:
    ldr	r0, [r6, #8]
text_00000314:
    ldr	r1, [pc, #136]
text_00000318:
    ldr	r0, [r0, #96]
text_0000031C:
    ldr	r0, [r0, #28]
text_00000320:
    ldr	r0, [r0]
text_00000324:
    add	r0, r0, #65536
text_00000328:
    add	r0, r0, #12608
text_0000032C:
    bl	text_00000020
text_00000330:
    ldrh	r0, [r0]
text_00000334:
    cmp	r0, #0
text_00000338:
    beq	text_00000308
text_0000033C:
    mov	r4, #0
text_00000340:
    vldr	s18, [pc, #96]
text_00000344:
    vldr	s19, [pc, #96]
text_00000348:
    add	r5, r6, r4, lsl #2
text_0000034C:
    vmov.f32	s0, s18
text_00000350:
    ldr	r0, [r5, #292]
text_00000354:
    ldr	r1, [r0]
text_00000358:
    ldr	r2, [r1, #204]
text_0000035C:
    mov	r1, #0
text_00000360:
    blx	r2
text_00000364:
    ldr	r0, [r5, #276]
text_00000368:
    vmov.f32	s0, s19
text_0000036C:
    ldr	r1, [r0]
text_00000370:
    ldr	r2, [r1, #204]
text_00000374:
    mov	r1, #0
text_00000378:
    blx	r2
text_0000037C:
    add	r4, r4, #1
text_00000380:
    cmp	r4, #4
text_00000384:
    bcc	text_00000348
text_00000388:
    bic	r0, r7, #255
text_0000038C:
    orr	r1, r0, r8
text_00000390:
    ldr	r0, [r6, #16]
text_00000394:
    str	r1, [r0], #4
text_00000398:
    vstmia	r0, {s16-s17}
text_0000039C:
    vpop	{d8-d9}
text_000003A0:
    pop	{r4, r5, r6, r7, r8, pc}
.size func_000002A0, . - func_000002A0

text_000003A4:
    .4byte 0
text_000003A8:
    .4byte 0x3f800000
text_000003AC:
    .4byte 0x40a00000
text_000003B0:
.global func_000003B0
.type func_000003B0, %function
func_000003B0:
    push	{r4, r5, r6, r7, r8, lr}
text_000003B4:
    mov	r5, r0
text_000003B8:
    ldr	r0, [r0, #8]
text_000003BC:
    bl	text_00000028
text_000003C0:
    ldr	r7, [r0, #52]
text_000003C4:
    mov	r4, #0
text_000003C8:
    add	r6, r5, r4, lsl #2
text_000003CC:
    mov	r0, r7
text_000003D0:
    ldr	r1, [r6, #272]
text_000003D4:
    bl	text_00000030
text_000003D8:
    ldr	r0, [r6, #272]
text_000003DC:
    cmp	r0, #0
text_000003E0:
    beq	text_000003F0
text_000003E4:
    ldr	r1, [r0]
text_000003E8:
    ldr	r1, [r1, #4]
text_000003EC:
    blx	r1
text_000003F0:
    add	r4, r4, #1
text_000003F4:
    cmp	r4, #9
text_000003F8:
    blt	text_000003C8
text_000003FC:
    mov	r4, #0
text_00000400:
    rsb	r0, r4, r4, lsl #3
text_00000404:
    add	r0, r5, r0, lsl #2
text_00000408:
    add	r0, r0, #20
text_0000040C:
    bl	text_00000038
text_00000410:
    add	r4, r4, #1
text_00000414:
    cmp	r4, #9
text_00000418:
    blt	text_00000400
text_0000041C:
    ldr	r0, [r5, #12]
text_00000420:
    cmp	r0, #0
text_00000424:
    beq	text_00000438
text_00000428:
    bl	text_00000040
text_0000042C:
    nop
text_00000430:
    nop
text_00000434:
    bl	text_00000018
text_00000438:
    mov	r0, #0
text_0000043C:
    str	r0, [r5, #12]
text_00000440:
    pop	{r4, r5, r6, r7, r8, pc}
.size func_000003B0, . - func_000003B0

text_00000444:
.global func_00000444
.type func_00000444, %function
func_00000444:
    push	{r4, r5, r6, r7, r8, r9, sl, fp, lr}
text_00000448:
    mov	r4, r0
text_0000044C:
    vpush	{d8}
text_00000450:
    sub	sp, sp, #36
text_00000454:
    ldr	r0, [r0, #8]
text_00000458:
    bl	text_00000028
text_0000045C:
    mov	r1, r0
text_00000460:
    ldr	r0, [r4, #8]
text_00000464:
    ldr	r1, [r1, #52]
text_00000468:
    mvn	r3, #0
text_0000046C:
    str	r1, [sp, #12]
text_00000470:
    ldr	r1, [r0, #36]
text_00000474:
    str	r1, [sp]
text_00000478:
    ldr	r2, [r0, #44]
text_0000047C:
    ldr	r0, [r4, #12]
text_00000480:
    mov	r1, #0
text_00000484:
    bl	text_00000048
text_00000488:
    ldr	r6, [pc, #592]
text_0000048C:
    mov	r5, #0
text_00000490:
    rsb	r0, r5, r5, lsl #3
text_00000494:
    add	r0, r4, r0, lsl #2
text_00000498:
    add	r1, r0, #20
text_0000049C:
    ldr	r0, [r4, #8]
text_000004A0:
    str	r1, [sp]
text_000004A4:
    ldr	ip, [r4, #12]
text_000004A8:
    ldr	r3, [r6, r5, lsl #2]
text_000004AC:
    ldr	r2, [r0, #36]!
text_000004B0:
    ldr	r1, [r0, #8]
text_000004B4:
    mov	r0, ip
text_000004B8:
    bl	text_00000050
text_000004BC:
    add	r5, r5, #1
text_000004C0:
    cmp	r5, #9
text_000004C4:
    bcc	text_00000490
text_000004C8:
    mov	r5, #0
text_000004CC:
    vldr	s16, [pc, #528]
text_000004D0:
    mov	r9, r5
text_000004D4:
    add	fp, sp, #16
text_000004D8:
    mov	sl, #1
text_000004DC:
    mov	r8, #4
text_000004E0:
    strd	r8, [sp, #24]
text_000004E4:
    str	r9, [sp, #20]
text_000004E8:
    str	sl, [sp, #16]
text_000004EC:
    ldr	r0, [r4, #8]
text_000004F0:
    add	r7, r4, r5, lsl #2
text_000004F4:
    ldr	r1, [pc, #492]
text_000004F8:
    add	r2, r7, #272
text_000004FC:
    add	r3, r5, r5, lsl #1
text_00000500:
    stm	sp, {r2, r9, fp}
text_00000504:
    add	r6, r1, r3, lsl #2
text_00000508:
    ldr	r2, [r0, #36]!
text_0000050C:
    ldr	r3, [r6]
text_00000510:
    ldr	r1, [r0, #8]
text_00000514:
    ldr	r0, [r4, #12]
text_00000518:
    bl	text_00000058
text_0000051C:
    ldr	r7, [r7, #272]
text_00000520:
    ldr	r0, [sp, #12]
text_00000524:
    mov	r2, #0
text_00000528:
    mov	r1, r7
text_0000052C:
    bl	text_00000060
text_00000530:
    ldr	r0, [sp, #12]
text_00000534:
    mov	r2, #0
text_00000538:
    mov	r1, r7
text_0000053C:
    bl	text_00000068
text_00000540:
    ldr	r1, [r4, #8]
text_00000544:
    add	r3, sp, #4
text_00000548:
    mvn	r2, #0
text_0000054C:
    str	r9, [sp]
text_00000550:
    stm	r3, {r2, r9}
text_00000554:
    mov	r0, r7
text_00000558:
    ldr	r2, [r6, #4]
text_0000055C:
    ldr	r3, [r7]
text_00000560:
    ldr	r1, [r1, #44]
text_00000564:
    rsb	r2, r2, r2, lsl #3
text_00000568:
    ldr	ip, [r3, #264]
text_0000056C:
    add	r2, r4, r2, lsl #2
text_00000570:
    add	r2, r2, #20
text_00000574:
    mov	r3, #0
text_00000578:
    blx	ip
text_0000057C:
    ldr	r0, [r7]
text_00000580:
    ldrb	r1, [r6, #8]
text_00000584:
    mov	r2, #0
text_00000588:
    ldr	r3, [r0, #256]
text_0000058C:
    mov	r0, r7
text_00000590:
    blx	r3
text_00000594:
    ldrb	r0, [r6, #9]
text_00000598:
    cmp	r0, #0
text_0000059C:
    bne	text_000005B8
text_000005A0:
    ldr	r0, [r7]
text_000005A4:
    vmov.f32	s0, s16
text_000005A8:
    mov	r1, #0
text_000005AC:
    ldr	r2, [r0, #212]
text_000005B0:
    mov	r0, r7
text_000005B4:
    blx	r2
text_000005B8:
    add	r5, r5, #1
text_000005BC:
    cmp	r5, #9
text_000005C0:
    bcc	text_000004E0
text_000005C4:
    ldr	r0, [r4, #8]
text_000005C8:
    ldr	r1, [pc, #284]
text_000005CC:
    ldr	r0, [r0, #96]
text_000005D0:
    ldr	r0, [r0, #28]
text_000005D4:
    ldr	r0, [r0]
text_000005D8:
    add	r6, r0, #65536
text_000005DC:
    add	r6, r6, #12608
text_000005E0:
    mov	r0, r6
text_000005E4:
    bl	text_00000020
text_000005E8:
    ldrh	r5, [r0]
text_000005EC:
    ldr	r1, [pc, #252]
text_000005F0:
    mov	r0, r6
text_000005F4:
    bl	text_00000020
text_000005F8:
    ldrh	r7, [r0]
text_000005FC:
    cmp	r5, #0
text_00000600:
    vldr	s16, [pc, #236]
text_00000604:
    vldr	s17, [pc, #236]
text_00000608:
    movne	r5, #0
text_0000060C:
    beq	text_00000654
text_00000610:
    add	r6, r4, r5, lsl #2
text_00000614:
    vmov.f32	s0, s16
text_00000618:
    ldr	r0, [r6, #292]
text_0000061C:
    ldr	r1, [r0]
text_00000620:
    ldr	r2, [r1, #204]
text_00000624:
    mov	r1, #0
text_00000628:
    blx	r2
text_0000062C:
    ldr	r0, [r6, #276]
text_00000630:
    vmov.f32	s0, s17
text_00000634:
    ldr	r1, [r0]
text_00000638:
    ldr	r2, [r1, #204]
text_0000063C:
    mov	r1, #0
text_00000640:
    blx	r2
text_00000644:
    add	r5, r5, #1
text_00000648:
    cmp	r5, #4
text_0000064C:
    bcc	text_00000610
text_00000650:
    b	text_00000698
text_00000654:
    ldr	r0, [r4, #16]
text_00000658:
    ldr	r5, [r0]
text_0000065C:
    and	r0, r5, #255
text_00000660:
    cmp	r0, #2
text_00000664:
    bne	text_00000698
text_00000668:
    lsl	r0, r5, #16
text_0000066C:
    lsr	r1, r0, #24
text_00000670:
    mov	r0, r4
text_00000674:
    bl	text_000006FC
text_00000678:
    and	r0, r5, #65280
text_0000067C:
    vmov.f32	s0, s17
text_00000680:
    add	r0, r4, r0, lsr #6
text_00000684:
    ldr	r0, [r0, #276]
text_00000688:
    ldr	r1, [r0]
text_0000068C:
    ldr	r2, [r1, #204]
text_00000690:
    mov	r1, #0
text_00000694:
    blx	r2
text_00000698:
    cmp	r7, #0
text_0000069C:
    beq	text_000006D0
text_000006A0:
    ldr	r0, [r4, #304]
text_000006A4:
    vmov.f32	s0, s16
text_000006A8:
    ldr	r1, [r0]
text_000006AC:
    ldr	r2, [r1, #204]
text_000006B0:
    mov	r1, #0
text_000006B4:
    blx	r2
text_000006B8:
    ldr	r0, [r4, #288]
text_000006BC:
    vmov.f32	s0, s17
text_000006C0:
    ldr	r1, [r0]
text_000006C4:
    ldr	r2, [r1, #204]
text_000006C8:
    mov	r1, #0
text_000006CC:
    blx	r2
text_000006D0:
    strb	r8, [r4, #308]
text_000006D4:
    add	sp, sp, #36
text_000006D8:
    vpop	{d8}
text_000006DC:
    pop	{r4, r5, r6, r7, r8, r9, sl, fp, pc}
.size func_00000444, . - func_00000444

text_000006E0:
    .4byte rodata_000000A4
text_000006E4:
    .4byte 0x00000000
text_000006E8:
    .4byte rodata_00000000
text_000006EC:
    .4byte 0
text_000006F0:
    .4byte 0
text_000006F4:
    .4byte 0x3f800000
text_000006F8:
    .4byte 0x40a00000
text_000006FC:
.global func_000006FC
.type func_000006FC, %function
func_000006FC:
    push	{r4, r5, r6, lr}
text_00000700:
    mov	r4, r0
text_00000704:
    ldr	r0, [r0, #16]
text_00000708:
    mov	r5, r1
text_0000070C:
    sub	sp, sp, #80
text_00000710:
    vldr	s0, [pc, #124]
text_00000714:
    ldm	r0, {r1, r2}
text_00000718:
    ldr	r0, [r0, #8]
text_0000071C:
    str	r0, [sp, #8]
text_00000720:
    add	r0, r4, r5, lsl #2
text_00000724:
    stm	sp, {r1, r2}
text_00000728:
    ldr	r0, [r0, #292]
text_0000072C:
    ldr	r1, [r0]
text_00000730:
    ldr	r2, [r1, #204]
text_00000734:
    mov	r1, #0
text_00000738:
    blx	r2
text_0000073C:
    strb	r5, [sp, #1]
text_00000740:
    ldr	r0, [r4, #8]
text_00000744:
    add	r6, sp, #4
text_00000748:
    add	r5, sp, #8
text_0000074C:
    ldr	r2, [r0, #268]
text_00000750:
    add	r0, sp, #16
text_00000754:
    ldr	r1, [r2, #124]
text_00000758:
    bl	text_00000070
text_0000075C:
    ldr	r0, [r4, #8]
text_00000760:
    bl	text_00000078
text_00000764:
    ldr	r0, [r0, #12]
text_00000768:
    add	r1, sp, #16
text_0000076C:
    bl	text_00000080
text_00000770:
    mov	r2, r5
text_00000774:
    mov	r1, r6
text_00000778:
    add	r0, sp, #16
text_0000077C:
    bl	text_00000088
text_00000780:
    ldr	r0, [r4, #16]
text_00000784:
    vldmia	sp, {s0-s2}
text_00000788:
    vstmia	r0, {s0-s2}
text_0000078C:
    add	sp, sp, #80
text_00000790:
    pop	{r4, r5, r6, pc}
.size func_000006FC, . - func_000006FC

text_00000794:
    .4byte 0x3f800000
text_00000798:
.global func_00000798
.type func_00000798, %function
func_00000798:
    push	{r4, r5, r6, r7, r8, r9, lr}
text_0000079C:
    mov	r4, r0
text_000007A0:
    mov	r9, #0
text_000007A4:
    mov	r1, r9
text_000007A8:
    vpush	{d8-d9}
text_000007AC:
    sub	sp, sp, #68
text_000007B0:
    ldr	r0, [r0, #16]
text_000007B4:
    ldm	r0, {r5, r7, r8}
text_000007B8:
    and	r0, r5, #65280
text_000007BC:
    add	r0, r4, r0, lsr #6
text_000007C0:
    ldr	r6, [r0, #276]
text_000007C4:
    ldr	r0, [r6]
text_000007C8:
    ldr	r2, [r0, #208]
text_000007CC:
    mov	r0, r6
text_000007D0:
    blx	r2
text_000007D4:
    ldr	r1, [pc, #308]
text_000007D8:
    vmov	r0, s0
text_000007DC:
    vldr	s18, [pc, #304]
text_000007E0:
    cmp	r0, r1
text_000007E4:
    ble	text_00000818
text_000007E8:
    ldr	r0, [r6]
text_000007EC:
    mov	r1, #0
text_000007F0:
    vldr	s0, [pc, #288]
text_000007F4:
    ldr	r2, [r0, #204]
text_000007F8:
    mov	r0, r6
text_000007FC:
    blx	r2
text_00000800:
    ldr	r0, [r6]
text_00000804:
    vmov.f32	s0, s18
text_00000808:
    mov	r1, #0
text_0000080C:
    ldr	r2, [r0, #212]
text_00000810:
    mov	r0, r6
text_00000814:
    blx	r2
text_00000818:
    str	r9, [sp, #56]
text_0000081C:
    str	r9, [sp, #60]
text_00000820:
    ldr	r0, [r4, #8]
text_00000824:
    add	r9, sp, #56
text_00000828:
    add	r6, sp, #60
text_0000082C:
    ldr	r2, [r0, #268]
text_00000830:
    mov	r0, sp
text_00000834:
    ldr	r1, [r2, #124]
text_00000838:
    bl	text_00000070
text_0000083C:
    ldr	r0, [r4, #8]
text_00000840:
    nop
text_00000844:
    bl	text_00000078
text_00000848:
    ldr	r0, [r0, #12]
text_0000084C:
    mov	r1, sp
text_00000850:
    bl	text_00000080
text_00000854:
    mov	r2, r6
text_00000858:
    mov	r1, r9
text_0000085C:
    mov	r0, sp
text_00000860:
    bl	text_00000088
text_00000864:
    ldr	r0, [sp, #56]
text_00000868:
    cmp	r7, r0
text_0000086C:
    ldreq	r0, [sp, #60]
text_00000870:
    cmpeq	r8, r0
text_00000874:
    beq	text_000008E8
text_00000878:
    lsl	r0, r5, #16
text_0000087C:
    mov	r9, #1
text_00000880:
    lsr	r0, r0, #24
text_00000884:
    cmp	r0, #3
text_00000888:
    beq	text_000008F4
text_0000088C:
    ldr	r1, [r4, #16]
text_00000890:
    add	r0, r4, r0, lsl #2
text_00000894:
    vmov.f32	s0, s18
text_00000898:
    ldr	r0, [r0, #292]
text_0000089C:
    ldr	r6, [r1], #4
text_000008A0:
    vldmia	r1, {s16-s17}
text_000008A4:
    ldr	r1, [r0]
text_000008A8:
    ldr	r2, [r1, #204]
text_000008AC:
    mov	r1, #0
text_000008B0:
    blx	r2
text_000008B4:
    ldr	r1, [r4, #16]
text_000008B8:
    bic	r0, r6, #255
text_000008BC:
    orr	r0, r0, r9
text_000008C0:
    vldr	s0, [pc, #84]
text_000008C4:
    str	r0, [r1], #4
text_000008C8:
    and	r0, r5, #65280
text_000008CC:
    vstmia	r1, {s16-s17}
text_000008D0:
    add	r0, r4, r0, lsr #6
text_000008D4:
    ldr	r0, [r0, #276]
text_000008D8:
    ldr	r1, [r0]
text_000008DC:
    ldr	r2, [r1, #212]
text_000008E0:
    mov	r1, #0
text_000008E4:
    blx	r2
text_000008E8:
    add	sp, sp, #68
text_000008EC:
    vpop	{d8-d9}
text_000008F0:
    pop	{r4, r5, r6, r7, r8, r9, pc}
text_000008F4:
    ldr	r1, [r4, #16]
text_000008F8:
    bic	r0, r5, #255
text_000008FC:
    orr	r0, r0, r9
text_00000900:
    stm	r1, {r0, r7, r8}
text_00000904:
    add	sp, sp, #68
text_00000908:
    vpop	{d8-d9}
text_0000090C:
    pop	{r4, r5, r6, r7, r8, r9, pc}
.size func_00000798, . - func_00000798

text_00000910:
    .4byte 0x40a00000
text_00000914:
    .4byte 0x00000000
text_00000918:
    .4byte 0x40a00000
text_0000091C:
    .4byte 0x3f800000
text_00000920:
.global func_00000920
.type func_00000920, %function
func_00000920:
    push	{r4, r5, r6, r7, r8, lr}
text_00000924:
    mov	r4, r0
text_00000928:
    mov	r6, #0
text_0000092C:
    ldrb	r0, [r0, #308]
text_00000930:
    cmp	r0, #0
text_00000934:
    beq	text_00000954
text_00000938:
    cmp	r0, #1
text_0000093C:
    beq	text_00000970
text_00000940:
    cmp	r0, #2
text_00000944:
    beq	text_00000998
text_00000948:
    cmp	r0, #3
text_0000094C:
    moveq	r6, #1
text_00000950:
    b	text_00000990
text_00000954:
    ldr	r0, [r4, #12]
text_00000958:
    ldr	r1, [pc, #180]
text_0000095C:
    mov	r2, #0
text_00000960:
    bl	text_00000090
text_00000964:
    nop
text_00000968:
    nop
text_0000096C:
    b	text_00000984
text_00000970:
    ldr	r0, [r4, #12]
text_00000974:
    bl	text_00000098
text_00000978:
    cmp	r0, #0
text_0000097C:
    nop
text_00000980:
    beq	text_00000990
text_00000984:
    ldrb	r0, [r4, #308]
text_00000988:
    add	r0, r0, #1
text_0000098C:
    strb	r0, [r4, #308]
text_00000990:
    mov	r0, r6
text_00000994:
    pop	{r4, r5, r6, r7, r8, pc}
text_00000998:
    ldr	r0, [r4, #8]
text_0000099C:
    mov	r2, #0
text_000009A0:
    ldr	r0, [r0, #96]
text_000009A4:
    ldr	r5, [r0, #28]
text_000009A8:
    ldr	r0, [r5]
text_000009AC:
    add	r0, r0, #4096
text_000009B0:
    add	r0, r0, #748
text_000009B4:
    ldr	r1, [r0, #4]
text_000009B8:
    cmp	r1, #0
text_000009BC:
    movne	r7, #0
text_000009C0:
    moveq	r7, #1
text_000009C4:
    bne	text_000009D8
text_000009C8:
    bl	text_000000A0
text_000009CC:
    nop
text_000009D0:
    nop
text_000009D4:
    b	text_000009E0
text_000009D8:
    mov	r1, r2
text_000009DC:
    bl	text_000000A8
text_000009E0:
    ldr	r0, [r5]
text_000009E4:
    add	r0, r0, #4096
text_000009E8:
    add	r0, r0, #748
text_000009EC:
    ldr	r1, [r0, #4]
text_000009F0:
    bl	text_000000A0
text_000009F4:
    cmp	r7, #0
text_000009F8:
    str	r0, [r4, #16]
text_000009FC:
    bne	text_00000984
text_00000A00:
    mov	r1, #0
text_00000A04:
    str	r1, [r0]
text_00000A08:
    str	r1, [r0, #4]
text_00000A0C:
    str	r1, [r0, #8]
text_00000A10:
    b	text_00000984
.size func_00000920, . - func_00000920

text_00000A14:
    .4byte 0
text_00000A18:
.global func_00000A18
.type func_00000A18, %function
func_00000A18:
    ldr	r2, [pc, #124]
text_00000A1C:
    push	{r4, r5, r6, lr}
text_00000A20:
    sub	sp, sp, #8
text_00000A24:
    str	r1, [r0, #4]
text_00000A28:
    str	r2, [r0]
text_00000A2C:
    str	r1, [r0, #8]
text_00000A30:
    ldr	r1, [pc, #104]
text_00000A34:
    mov	r3, #9
text_00000A38:
    mov	r2, #28
text_00000A3C:
    add	r0, r0, #20
text_00000A40:
    bl	text_000000B0
text_00000A44:
    sub	r4, r0, #20
text_00000A48:
    mov	r0, #0
text_00000A4C:
    strb	r0, [r4, #308]
text_00000A50:
    ldr	r0, [r4, #8]
text_00000A54:
    ldr	r6, [r0, #4]!
text_00000A58:
    ldr	r5, [r0, #12]
text_00000A5C:
    mov	r1, r6
text_00000A60:
    mov	r0, #64
text_00000A64:
    bl	text_000000B8
text_00000A68:
    cmp	r0, #0
text_00000A6C:
    beq	text_00000A8C
text_00000A70:
    ldr	r1, [pc, #44]
text_00000A74:
    mov	r2, #8
text_00000A78:
    mov	r3, #18
text_00000A7C:
    stm	sp, {r1, r2}
text_00000A80:
    mov	r2, r5
text_00000A84:
    mov	r1, r6
text_00000A88:
    bl	text_000000C0
text_00000A8C:
    str	r0, [r4, #12]
text_00000A90:
    add	sp, sp, #8
text_00000A94:
    mov	r0, r4
text_00000A98:
    pop	{r4, r5, r6, pc}
.size func_00000A18, . - func_00000A18

text_00000A9C:
    .4byte rodata_00000174
text_00000AA0:
    .4byte __cro_import_anon_m7c7374617469637c_s0_0281b00
text_00000AA4:
    .4byte rodata_0000006C
text_00000AA8:
.global func_00000AA8
.type func_00000AA8, %function
func_00000AA8:
    ldr	r1, [pc, #36]
text_00000AAC:
    push	{r4, lr}
text_00000AB0:
    mov	r4, r0
text_00000AB4:
    str	r1, [r0], #20
text_00000AB8:
    ldr	r1, [pc, #24]
text_00000ABC:
    mov	r3, #9
text_00000AC0:
    mov	r2, #28
text_00000AC4:
    bl	text_000000C8
text_00000AC8:
    mov	r0, r4
text_00000ACC:
    pop	{r4, lr}
text_00000AD0:
    b	text_00000018
.size func_00000AA8, . - func_00000AA8

text_00000AD4:
    .4byte rodata_00000174
text_00000AD8:
    .4byte __cro_import_anon_m7c7374617469637c_s0_0281b94
text_00000ADC:
.global func_00000ADC
.type func_00000ADC, %function
func_00000ADC:
    push	{r4, lr}
text_00000AE0:
    mov	r4, r0
text_00000AE4:
    ldr	r0, [pc, #28]
text_00000AE8:
    ldr	r1, [pc, #28]
text_00000AEC:
    mov	r3, #9
text_00000AF0:
    str	r0, [r4]
text_00000AF4:
    mov	r2, #28
text_00000AF8:
    add	r0, r4, #20
text_00000AFC:
    bl	text_000000C8
text_00000B00:
    mov	r0, r4
text_00000B04:
    pop	{r4, pc}
.size func_00000ADC, . - func_00000ADC

text_00000B08:
    .4byte rodata_00000174
text_00000B0C:
    .4byte __cro_import_anon_m7c7374617469637c_s0_0281b94
text_00000B10:
.global func_00000B10
.type func_00000B10, %function
func_00000B10:
    ldr	r0, [pc, #32]
text_00000B14:
    vldr	s1, [pc, #20]
text_00000B18:
    vldr	s0, [pc, #20]
text_00000B1C:
    vstr	s1, [r0]
text_00000B20:
    vstr	s1, [r0, #4]
text_00000B24:
    vstr	s0, [r0, #8]
text_00000B28:
    vstr	s0, [r0, #12]
text_00000B2C:
    bx	lr
.size func_00000B10, . - func_00000B10

text_00000B30:
    .4byte 0x3f333333
text_00000B34:
    .4byte 0x3f800000
text_00000B38:
    .4byte bss_00000000
text_00000B3C:
.global func_00000B3C
.type func_00000B3C, %function
func_00000B3C:
.global nnroControlObject_
.type nnroControlObject_, %function
nnroControlObject_:
    ldr	r2, [pc, #128]
text_00000B40:
    cmp	r1, #5
text_00000B44:
    push	{r4, lr}
text_00000B48:
    ldrcc	pc, [pc, r1, lsl #2]
text_00000B4C:
    b	text_00000BA8
text_00000B50:
    .4byte func_00000B3C + 0x28
text_00000B54:
    .4byte func_00000B3C + 0x30
text_00000B58:
    .4byte func_00000B3C + 0x38
text_00000B5C:
    .4byte func_00000B3C + 0x44
text_00000B60:
    .4byte func_00000B3C + 0x54
text_00000B64:
    ldr	r1, [pc, #92]
text_00000B68:
    b	text_00000B78
text_00000B6C:
    str	r0, [r2]
text_00000B70:
    b	text_00000BA0
text_00000B74:
    ldr	r1, [r2]
text_00000B78:
    str	r1, [r0]
text_00000B7C:
    b	text_00000BA0
text_00000B80:
    ldr	r1, [pc, #68]
text_00000B84:
    str	r1, [r0]
text_00000B88:
    ldr	r1, [pc, #64]
text_00000B8C:
    b	text_00000B9C
text_00000B90:
    ldr	r1, [pc, #60]
text_00000B94:
    str	r1, [r0]
text_00000B98:
    ldr	r1, [pc, #56]
text_00000B9C:
    str	r1, [r0, #4]
text_00000BA0:
    mov	r0, #0
text_00000BA4:
    pop	{r4, pc}
text_00000BA8:
    ldr	r0, [pc, #44]
text_00000BAC:
    mov	r0, r0
text_00000BB0:
    ldr	r0, [pc, #40]
text_00000BB4:
    nop
text_00000BB8:
    mov	r0, r0
text_00000BBC:
    ldr	r0, [pc, #32]
text_00000BC0:
    pop	{r4, pc}
.size func_00000B3C, . - func_00000B3C

.size nnroControlObject_, . - nnroControlObject_

text_00000BC4:
    .4byte data_00000000
text_00000BC8:
    .4byte 0
text_00000BCC:
    .4byte text_00000BE8
text_00000BD0:
    .4byte text_end
text_00000BD4:
    .4byte rodata_end
text_00000BD8:
    .4byte rodata_end
text_00000BDC:
    .4byte 0
text_00000BE0:
    .4byte 0
text_00000BE4:
    .4byte 0
text_00000BE8:
    .4byte text_00000B10
text_end:

/* The 296 prohibited/opaque payload bytes are intentionally zero-filled. */
.section .rodata.DllUSGymFighting, "a", %progbits
.balign 4
rodata_start:
rodata_00000000:
.space 0x6c
rodata_0000006C:
.space 0x38
rodata_000000A4:
.space 0x24
rodata_000000C8:
.4byte __cro_import_anon_m7c7374617469637c_s1_005a468 + 8
.4byte rodata_000000E8
.4byte __cro_import_anon_m7c7374617469637c_s1_0045df8
rodata_000000D4:
.4byte __cro_import_anon_m7c7374617469637c_s1_005a458 + 8
.4byte rodata_00000103
rodata_000000DC:
.4byte __cro_import_anon_m7c7374617469637c_s1_005a468 + 8
.4byte rodata_00000121
.4byte rodata_000000D4
rodata_000000E8:
.space 0x1b
rodata_00000103:
.space 0x1e
rodata_00000121:
.space 0x27
.space 8
.4byte rodata_000000C8
.4byte func_0000025C
.4byte func_00000118
.4byte func_0000010C
.4byte func_00000114
.4byte func_00000124
.4byte func_00000118
.space 4
.4byte rodata_000000DC
rodata_00000174:
.4byte func_00000ADC
.4byte func_00000AA8
.4byte func_00000920
.4byte func_000003B0
.4byte func_0000025C
.4byte func_0000025C
.4byte func_0000025C
.4byte func_0000025C
.4byte func_000003B0
.4byte func_0000025C
.4byte func_0000025C
.4byte func_0000025C
.4byte func_0000025C
.4byte func_0000025C
rodata_end:

.section .data.DllUSGymFighting, "aw", %progbits
.balign 4
data_00000000:
.space 4

.section .bss.DllUSGymFighting, "aw", %nobits
.balign 4
bss_00000000:
.space 16

.section .note.GNU-stack, "", %progbits
