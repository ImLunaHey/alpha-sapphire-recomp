.syntax unified
.arch armv6k
.thumb

/* Generated from the neutral schedules in config/thumb-leaf-helpers-05.json. */

.section .text.func_00100638, "ax", %progbits
.balign 2
.global func_00100638
.type func_00100638, %function
.thumb_func
func_00100638:
  push {r4, r5, r6, lr}
  movs r5, r0
  movs r4, r1
  cmp r2, #1
  beq.n .L_func_00100638_16
  ldr r0, [r5, #0]
  lsls r0, r0, #26
  bpl.n .L_func_00100638_12
  ldr r2, [r5, #28]
.L_func_00100638_12:
  movs r3, #0
  b.n .L_func_00100638_1c
.L_func_00100638_16:
  movs r3, #1
  b.n .L_func_00100638_28
.L_func_00100638_1a:
  .inst.n 0x1c5b /* adds r3, r3, #1 */
.L_func_00100638_1c:
  cmp r3, r2
  bcs.n .L_func_00100638_28
  lsls r0, r3, #1
  ldrh r0, [r4, r0]
  cmp r0, #0
  bne.n .L_func_00100638_1a
.L_func_00100638_28:
  ldr r0, [r5, #24]
  subs r0, r0, r3
  str r0, [r5, #24]
  ldr r0, [r5, #32]
  adds r0, r0, r3
  str r0, [r5, #32]
  lsls r0, r3, #1
  adds r6, r0, r4
  movs r0, r5
  bl func_002FEE04
  b.n .L_func_00100638_4a
.L_func_00100638_40:
  ldr r2, [r5, #4]
  ldrh r0, [r4, #0]
  ldr r1, [r5, #8]
  .inst.n 0x1ca4 /* adds r4, r4, #2 */
  blx r2
.L_func_00100638_4a:
  cmp r4, r6
  bcc.n .L_func_00100638_40
  movs r0, r5
  bl func_002FEE30
  pop {r4, r5, r6, pc}
.size func_00100638, .-func_00100638

.section .text.func_00100AD4, "ax", %progbits
.balign 2
.global func_00100AD4
.type func_00100AD4, %function
.thumb_func
func_00100AD4:
  push {r3, r4, r5, r6, r7, lr}
  movs r7, r1
  ldr r1, [r0, #0]
  lsls r1, r1, #20
  bpl.n .L_func_00100AD4_10
  ldr r4, [pc, #136]
  add r4, pc
  b.n .L_func_00100AD4_16
.L_func_00100AD4_10:
  ldr r4, [pc, #128]
  add r4, pc
  adds r4, #14
.L_func_00100AD4_16:
  movs r1, #0
  movs r5, r0
  adds r5, #36
  b.n .L_func_00100AD4_30
.L_func_00100AD4_1e:
  lsls r6, r2, #28
  lsrs r2, r2, #4
  lsrs r6, r6, #28
  ldrb r6, [r4, r6]
  strb r6, [r5, r1]
  lsls r6, r3, #28
  .inst.n 0x1c49 /* adds r1, r1, #1 */
  orrs r2, r6
  lsrs r3, r3, #4
.L_func_00100AD4_30:
  movs r6, r2
  orrs r6, r3
  bne.n .L_func_00100AD4_1e
  movs r2, r4
  ldr r4, [r0, #0]
  movs r3, #0
  lsls r4, r4, #28
  bpl.n .L_func_00100AD4_4c
  cmp r7, #112
  beq.n .L_func_00100AD4_52
  cmp r1, #0
  beq.n .L_func_00100AD4_4c
  adds r2, #17
  movs r3, #2
.L_func_00100AD4_4c:
  bl func_002FF988
  pop {r3, r4, r5, r6, r7, pc}
.L_func_00100AD4_52:
  adds r2, #16
  movs r3, #1
  b.n .L_func_00100AD4_4c
.size func_00100AD4, .-func_00100AD4

.section .text.func_0010133C, "ax", %progbits
.balign 2
.global func_0010133C
.type func_0010133C, %function
.thumb_func
func_0010133C:
  push {r4, r5, r6, lr}
  movs r5, r0
  movs r4, r1
  cmp r2, #1
  beq.n .L_func_0010133C_16
  ldr r0, [r5, #0]
  lsls r0, r0, #26
  bpl.n .L_func_0010133C_12
  ldr r2, [r5, #28]
.L_func_0010133C_12:
  movs r3, #0
  b.n .L_func_0010133C_1c
.L_func_0010133C_16:
  movs r3, #1
  b.n .L_func_0010133C_26
.L_func_0010133C_1a:
  .inst.n 0x1c5b /* adds r3, r3, #1 */
.L_func_0010133C_1c:
  cmp r3, r2
  bcs.n .L_func_0010133C_26
  ldrb r0, [r4, r3]
  cmp r0, #0
  bne.n .L_func_0010133C_1a
.L_func_0010133C_26:
  ldr r0, [r5, #24]
  adds r6, r4, r3
  subs r0, r0, r3
  str r0, [r5, #24]
  ldr r0, [r5, #32]
  adds r0, r0, r3
  str r0, [r5, #32]
  movs r0, r5
  bl func_002FEE04
  b.n .L_func_0010133C_46
.L_func_0010133C_3c:
  ldr r2, [r5, #4]
  ldrb r0, [r4, #0]
  ldr r1, [r5, #8]
  .inst.n 0x1c64 /* adds r4, r4, #1 */
  blx r2
.L_func_0010133C_46:
  cmp r4, r6
  bcc.n .L_func_0010133C_3c
  movs r0, r5
  bl func_002FEE30
  pop {r4, r5, r6, pc}
.size func_0010133C, .-func_0010133C

.section .text.func_00101CD8, "ax", %progbits
.balign 2
.global func_00101CD8
.type func_00101CD8, %function
.thumb_func
func_00101CD8:
  push {r3, r4, r5, lr}
  movs r4, r0
  movs r5, r1
  movs r0, r1
  blx func_002FF034
  cmp r0, #0
  beq.n .L_func_00101CD8_24
  ldr r1, [r4, #0]
  movs r3, r5
  subs r1, #12
  ldr r2, [r1, #8]
  str r0, [sp, #0]
  movs r1, #0
  movs r0, r4
  bl func_00300A48
  pop {r3, r4, r5, pc}
.L_func_00101CD8_24:
  ldr r0, [r4, #0]
  subs r0, #12
  ldr r1, [r0, #0]
  .inst.n 0x1c49 /* adds r1, r1, #1 */
  cmp r1, #1
  beq.n .L_func_00101CD8_3e
  movs r0, r4
  bl func_00300A00
  ldr r0, [pc, #20]
  str r0, [r4, #0]
.L_func_00101CD8_3a:
  movs r0, r4
  pop {r3, r4, r5, pc}
.L_func_00101CD8_3e:
  movs r1, #0
  str r1, [r0, #8]
  ldr r0, [r4, #0]
  mov r2, sp
  strb r1, [r2, #0]
  strb r1, [r0, #0]
  b.n .L_func_00101CD8_3a
.size func_00101CD8, .-func_00101CD8

.section .text.func_00103350, "ax", %progbits
.balign 2
.global func_00103350
.type func_00103350, %function
.thumb_func
func_00103350:
  push {r2, r3, r4, r5, r6, lr}
  movs r5, r0
  movs r4, r1
  cmp r2, #0
  bne.n .L_func_00103350_14
  movs r1, #6
  movs r0, #0
  nop
  nop
  movs r2, r0
.L_func_00103350_14:
  mov r0, sp
  movs r1, r4
  bl func_002FFBF8
  movs r4, r0
  .inst.n 0x1c40 /* adds r0, r0, #1 */
  beq.n .L_func_00103350_34
  cmp r5, #0
  beq.n .L_func_00103350_30
  mov r1, sp
  movs r2, r4
  movs r0, r5
  blx func_00300B28
.L_func_00103350_30:
  movs r0, r4
  pop {r2, r3, r4, r5, r6, pc}
.L_func_00103350_34:
  blx func_002FED78
  movs r1, #4
  str r1, [r0, #0]
  b.n .L_func_00103350_30
.size func_00103350, .-func_00103350

.section .text.func_001035E4, "ax", %progbits
.balign 2
.global func_001035E4
.type func_001035E4, %function
.thumb_func
func_001035E4:
  push {r4, r5, r6, lr}
  bl func_00302B8C
  ldr r5, [pc, #76]
  movs r4, r0
  ldr r0, [r5, #4]
  movs r1, #0
  mvns r1, r1
  cmp r0, r4
  bls.n .L_func_001035E4_50
  ldr r0, [r5, #0]
  lsls r1, r4, #2
  adds r0, r0, r1
  ldr r0, [r0, #0]
  blx func_002FF8C0
  ldr r0, [r5, #0]
  .inst.n 0x1c64 /* adds r4, r4, #1 */
  b.n .L_func_001035E4_2e
.L_func_001035E4_26:
  .inst.n 0x1f09 /* subs r1, r1, #4 */
  adds r1, r0, r1
  .inst.n 0x1c64 /* adds r4, r4, #1 */
  str r2, [r1, #0]
.L_func_001035E4_2e:
  lsls r1, r4, #2
  adds r2, r0, r1
  ldr r2, [r2, #0]
  cmp r2, #0
  beq.n .L_func_001035E4_3e
  ldr r3, [r5, #4]
  cmp r3, r4
  bhi.n .L_func_001035E4_26
.L_func_001035E4_3e:
  ldr r1, [r5, #4]
  cmp r1, r4
  bls.n .L_func_001035E4_4c
  lsls r1, r4, #2
  adds r0, r0, r1
  movs r1, #0
  str r1, [r0, #0]
.L_func_001035E4_4c:
  movs r0, #0
  pop {r4, r5, r6, pc}
.L_func_001035E4_50:
  movs r0, r1
  pop {r4, r5, r6, pc}
.size func_001035E4, .-func_001035E4

.section .text.func_00103A84, "ax", %progbits
.balign 2
.global func_00103A84
.type func_00103A84, %function
.thumb_func
func_00103A84:
  push {r4, r5, r6, lr}
  movs r5, r1
  bl func_00303110
  movs r4, r0
  ldr r0, [r0, #4]
  cmp r0, r5
  ble.n .L_func_00103A84_3a
  ldr r0, [r4, #0]
  lsls r5, r5, #3
  adds r0, r0, r5
  ldr r0, [r0, #0]
  adds r1, r0, #1
  beq.n .L_func_00103A84_3a
  bl func_001035E4
  ldr r0, [r4, #0]
  movs r1, #0
  adds r0, r0, r5
  mvns r1, r1
  str r1, [r0, #0]
  bl func_003031BC
  movs r1, r0
  ldr r0, [r4, #0]
  adds r0, r0, r5
  .inst.n 0x1d00 /* adds r0, r0, #4 */
  bl func_00303188
.L_func_00103A84_3a:
  pop {r4, r5, r6, pc}
.size func_00103A84, .-func_00103A84

.section .text.func_001054F4, "ax", %progbits
.balign 2
.global func_001054F4
.type func_001054F4, %function
.thumb_func
func_001054F4:
  push {r4, lr}
  movs r4, r0
  ldr r0, [pc, #28]
  str r0, [r4, #0]
  movs r0, r4
  bl func_00104DBA
  ldr r0, [r4, #16]
  lsls r0, r0, #31
  lsrs r0, r0, #31
  beq.n .L_func_001054F4_1c
  ldr r0, [r4, #8]
  blx func_002FF10C
.L_func_001054F4_1c:
  movs r0, r4
  bl func_00305490
  pop {r4, pc}
.size func_001054F4, .-func_001054F4

.section .text.func_00105DA4, "ax", %progbits
.balign 2
.global func_00105DA4
.type func_00105DA4, %function
.thumb_func
func_00105DA4:
  push {r4, lr}
  movs r4, r0
  ldr r0, [pc, #28]
  str r0, [r4, #0]
  movs r0, r4
  bl func_0010564A
  ldr r0, [r4, #16]
  lsls r0, r0, #31
  lsrs r0, r0, #31
  beq.n .L_func_00105DA4_1c
  ldr r0, [r4, #8]
  blx func_002FF10C
.L_func_00105DA4_1c:
  movs r0, r4
  bl func_0030570C
  pop {r4, pc}
.size func_00105DA4, .-func_00105DA4

.section .text.func_002FEFDC, "ax", %progbits
.balign 2
.global func_002FEFDC
.type func_002FEFDC, %function
.thumb_func
func_002FEFDC:
  push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
  sub sp, #4
  movs r6, r0
  movs r5, r1
  movs r7, r3
  cmp r1, #0
  beq.n .L_func_002FEFDC_12
  movs r4, r1
  b.n .L_func_002FEFDC_14
.L_func_002FEFDC_12:
  movs r4, #64
.L_func_002FEFDC_14:
  cmp r6, #0
  bne.n .L_func_002FEFDC_20
.L_func_002FEFDC_18:
  movs r0, r4
  bl func_002FF094
  movs r6, r0
.L_func_002FEFDC_20:
  ldr r2, [sp, #12]
  movs r3, r7
  movs r1, r4
  bl func_00100BE4
  cmp r0, #0
  bge.n .L_func_002FEFDC_34
  movs r0, #0
  strb r0, [r6, #0]
  b.n .L_func_002FEFDC_54
.L_func_002FEFDC_34:
  cmp r4, r0
  bge.n .L_func_002FEFDC_3c
  adds r4, r0, #1
  b.n .L_func_002FEFDC_42
.L_func_002FEFDC_3c:
  cmp r4, r0
  bne.n .L_func_002FEFDC_54
  lsls r4, r4, #1
.L_func_002FEFDC_42:
  cmp r5, #0
  beq.n .L_func_002FEFDC_4c
  movs r0, #0
.L_func_002FEFDC_48:
  add sp, #20
  pop {r4, r5, r6, r7, pc}
.L_func_002FEFDC_4c:
  movs r0, r6
  blx func_002FF10C
  b.n .L_func_002FEFDC_18
.L_func_002FEFDC_54:
  movs r0, r6
  b.n .L_func_002FEFDC_48
.size func_002FEFDC, .-func_002FEFDC

.section .text.func_002FF7F8, "ax", %progbits
.balign 2
.global func_002FF7F8
.type func_002FF7F8, %function
.thumb_func
func_002FF7F8:
  push {r4, r5, r6, lr}
  movs r5, r1
  movs r1, r2
  nop
  nop
  movs r6, r0
  movs r0, r5
  blx func_002FF034
  movs r4, r0
  beq.n .L_func_002FF7F8_24
  movs r3, r0
  movs r2, r3
  movs r1, #0
  movs r0, r6
  bl func_0010130A
  b.n .L_func_002FF7F8_26
.L_func_002FF7F8_24:
  ldr r0, [pc, #12]
.L_func_002FF7F8_26:
  movs r2, r4
  movs r1, r5
  str r0, [r6, #0]
  bl func_002FFAF4
  movs r0, r6
  pop {r4, r5, r6, pc}
.size func_002FF7F8, .-func_002FF7F8

.section .text.func_002FF830, "ax", %progbits
.balign 2
.global func_002FF830
.type func_002FF830, %function
.thumb_func
func_002FF830:
  push {r4, r5, r6, lr}
  movs r4, r0
  movs r5, r1
  nop
  nop
  ldr r0, [r5, #0]
  movs r1, r0
  subs r1, #12
  ldr r2, [r1, #0]
  .inst.n 0x1c52 /* adds r2, r2, #1 */
  beq.n .L_func_002FF830_20
  str r0, [r4, #0]
  subs r0, #12
  bl func_002FFB00
  b.n .L_func_002FF830_38
.L_func_002FF830_20:
  ldr r6, [r1, #8]
  movs r0, r4
  movs r2, r6
  movs r1, r6
  bl func_002FFB14
  adds r0, #12
  str r0, [r4, #0]
  ldr r1, [r5, #0]
  movs r2, r6
  bl func_002FFAF4
.L_func_002FF830_38:
  movs r0, r4
  pop {r4, r5, r6, pc}
.size func_002FF830, .-func_002FF830

.section .text.func_002FFD20, "ax", %progbits
.balign 2
.global func_002FFD20
.type func_002FFD20, %function
.thumb_func
func_002FFD20:
  push {r4, lr}
  movs r4, r0
  bne.n .L_func_002FFD20_18
  movs r4, #1
  b.n .L_func_002FFD20_18
.L_func_002FFD20_a:
  blx func_0019523C
  ldr r0, [r0, #0]
  cmp r0, #0
  bne.n .L_func_002FFD20_16
  ldr r0, [pc, #12]
.L_func_002FFD20_16:
  blx r0
.L_func_002FFD20_18:
  movs r0, r4
  blx func_002FECF8
  cmp r0, #0
  beq.n .L_func_002FFD20_a
  pop {r4, pc}
.size func_002FFD20, .-func_002FFD20

.section .text.func_003009B0, "ax", %progbits
.balign 2
.global func_003009B0
.type func_003009B0, %function
.thumb_func
func_003009B0:
  push {r3, r4, r5, lr}
  movs r4, r0
  ldr r0, [r1, #0]
  movs r5, r1
  movs r3, r0
  subs r0, #12
  ldr r1, [r0, #0]
  .inst.n 0x1c49 /* adds r1, r1, #1 */
  beq.n .L_func_003009B0_22
  bl func_002FFB00
  movs r0, r4
  bl func_00300A00
  ldr r0, [r5, #0]
  str r0, [r4, #0]
  b.n .L_func_003009B0_38
.L_func_003009B0_22:
  cmp r4, r5
  beq.n .L_func_003009B0_38
  ldr r1, [r4, #0]
  ldr r0, [r0, #8]
  subs r1, #12
  ldr r2, [r1, #8]
  str r0, [sp, #0]
  movs r1, #0
  movs r0, r4
  bl func_00300A48
.L_func_003009B0_38:
  movs r0, r4
  pop {r3, r4, r5, pc}
.size func_003009B0, .-func_003009B0

.section .text.func_00301D30, "ax", %progbits
.balign 2
.global func_00301D30
.type func_00301D30, %function
.thumb_func
func_00301D30:
  push {r0, r1, r2, r4, r5, r6, r7, lr}
  movs r6, r1
  movs r4, r2
  ldr r0, [pc, #204]
  ldr r5, [r2, #12]
  ldr r7, [r2, #20]
  tst r5, r0
  beq.n .L_func_00301D30_24
  ldr r1, [r4, #24]
  movs r0, r7
  blx func_003022C8
  cmp r0, #0
  blt.n .L_func_00301D30_40
  ldr r0, [pc, #180]
  mvns r0, r0
  ands r5, r0
  str r5, [r4, #12]
.L_func_00301D30_24:
  ldr r1, [sp, #0]
  movs r3, r5
  movs r2, r6
  movs r0, r7
  blx func_0050326C
  lsls r2, r0, #1
  ldr r1, [r4, #24]
  lsrs r2, r2, #1
  subs r2, r6, r2
  adds r1, r1, r2
  cmp r0, #0
  str r1, [r4, #24]
  beq.n .L_func_00301D30_4a
.L_func_00301D30_40:
  movs r0, r4
  bl func_00301D1C
  movs r0, #0
  mvns r0, r0
.L_func_00301D30_4a:
  pop {r1, r2, r3, r4, r5, r6, r7, pc}
.size func_00301D30, .-func_00301D30

.section .text.func_00301F68, "ax", %progbits
.balign 2
.global func_00301F68
.type func_00301F68, %function
.thumb_func
func_00301F68:
  push {r1, r2, r3, r4, r5, r6, r7, lr}
  movs r4, r0
  ldr r6, [r0, #20]
  ldr r0, [r0, #16]
  ldr r7, [pc, #60]
  str r0, [sp, #0]
  ldr r5, [r4, #12]
  movs r0, #0
  str r0, [sp, #4]
  lsls r0, r5, #30
  beq.n .L_func_00301F68_26
  movs r0, r4
  bl func_00301D7C
  movs r0, r6
  blx func_00503254
  cmp r0, #0
  bge.n .L_func_00301F68_2a
.L_func_00301F68_26:
  movs r0, r7
  pop {r1, r2, r3, r4, r5, r6, r7, pc}
.L_func_00301F68_2a:
  lsls r0, r5, #20
  bpl.n .L_func_00301F68_34
  ldr r0, [sp, #0]
  blx func_00302108
.L_func_00301F68_34:
  movs r1, #72
  movs r0, r4
  blx func_00301FBC
.size func_00301F68, .-func_00301F68

.section .text.func_00302208, "ax", %progbits
.balign 2
.global func_00302208
.type func_00302208, %function
.thumb_func
func_00302208:
  push {r4, r5, r6, lr}
  movs r6, r0
  sub sp, #24
  movs r0, #0
  mvns r0, r0
  str r0, [sp, #4]
  movs r0, #0
  movs r5, r2
  str r0, [sp, #16]
  movs r4, r1
  movs r2, r6
  add r0, sp, #16
  str r1, [sp, #0]
  str r1, [sp, #8]
  mov r1, sp
  bl func_003021CC
  movs r3, r0
  ldr r0, [sp, #16]
  adds r1, r4, r0
  cmp r5, #0
  beq.n .L_func_00302208_38
  cmp r0, #0
  beq.n .L_func_00302208_34
  movs r2, r1
  b.n .L_func_00302208_36
.L_func_00302208_34:
  movs r2, r4
.L_func_00302208_36:
  str r2, [r5, #0]
.L_func_00302208_38:
  cmp r0, #0
  beq.n .L_func_00302208_58
  cmp r3, #0
  ble.n .L_func_00302208_46
  ldr r0, [sp, #0]
  cmp r0, r1
  beq.n .L_func_00302208_58
.L_func_00302208_46:
  subs r0, r1, r4
  mov r1, sp
  str r0, [sp, #4]
  movs r2, r6
  add r0, sp, #16
  str r4, [sp, #0]
  str r4, [sp, #8]
  bl func_003021CC
.L_func_00302208_58:
  add sp, #24
  pop {r4, r5, r6, pc}
.size func_00302208, .-func_00302208

.section .text.func_00303008, "ax", %progbits
.balign 2
.global func_00303008
.type func_00303008, %function
.thumb_func
func_00303008:
  push {r3, r4, r5, r6, r7, lr}
  movs r5, r0
  movs r4, r2
  movs r6, r1
  movs r0, r1
  blx func_002FF034
  movs r7, r0
  blx func_002FF7EC
  ldr r1, [r0, #0]
  ldr r0, [r1, #0]
  cmp r0, #0
  beq.n .L_func_00303008_38
  adds r1, r1, r0
  cmp r4, #0
  beq.n .L_func_00303008_34
.L_func_00303008_22:
  ldrb r0, [r6, #0]
  .inst.n 0x1c76 /* adds r6, r6, #1 */
  cmp r0, #0
  beq.n .L_func_00303008_4c
  ldrb r0, [r1, r0]
  strb r0, [r5, #0]
  .inst.n 0x1c6d /* adds r5, r5, #1 */
  .inst.n 0x1e64 /* subs r4, r4, #1 */
  bne.n .L_func_00303008_22
.L_func_00303008_34:
  movs r0, r7
  pop {r3, r4, r5, r6, r7, pc}
.L_func_00303008_38:
  cmp r4, #0
  beq.n .L_func_00303008_34
  ldrb r0, [r6, #0]
  .inst.n 0x1c76 /* adds r6, r6, #1 */
  strb r0, [r5, #0]
  .inst.n 0x1c6d /* adds r5, r5, #1 */
  cmp r0, #0
  beq.n .L_func_00303008_34
  .inst.n 0x1e64 /* subs r4, r4, #1 */
  b.n .L_func_00303008_38
.L_func_00303008_4c:
  movs r0, #0
  strb r0, [r5, #0]
  b.n .L_func_00303008_34
.size func_00303008, .-func_00303008

.section .text.func_0030305C, "ax", %progbits
.balign 2
.global func_0030305C
.type func_0030305C, %function
.thumb_func
func_0030305C:
  push {r2, r3, r4, r5, r6, lr}
  movs r4, r2
  movs r6, r1
  movs r1, r3
  nop
  nop
  movs r5, r0
  movs r0, #14
  mvns r0, r0
  cmp r4, r0
  bls.n .L_func_0030305C_24
  str r0, [sp, #0]
  movs r3, r4
  movs r0, #8
  add r2, pc, #56
  add r1, pc, #56
  bl func_00300ABC
.L_func_0030305C_24:
  cmp r4, #0
  beq.n .L_func_0030305C_54
  movs r0, #32
  str r0, [sp, #4]
  mov r1, sp
  add r0, sp, #4
  str r4, [sp, #0]
  bl func_002FFE4A
  ldr r1, [r0, #0]
  movs r2, r4
  movs r0, r5
  bl func_002FFB14
.L_func_0030305C_40:
  adds r0, #12
  cmp r6, #0
  str r0, [r5, #0]
  beq.n .L_func_0030305C_50
  movs r2, r4
  movs r1, r6
  bl func_002FFAF4
.L_func_0030305C_50:
  movs r0, r5
  pop {r2, r3, r4, r5, r6, pc}
.L_func_0030305C_54:
  ldr r0, [pc, #4]
  b.n .L_func_0030305C_40
.size func_0030305C, .-func_0030305C

.section .text.func_003030BC, "ax", %progbits
.balign 2
.global func_003030BC
.type func_003030BC, %function
.thumb_func
func_003030BC:
  push {r3, r4, r5, r6, r7, lr}
  movs r4, r0
  movs r6, #0
  ldr r0, [r0, #0]
  mvns r6, r6
  subs r0, #12
  ldr r1, [r0, #0]
  .inst.n 0x1c49 /* adds r1, r1, #1 */
  cmp r1, #1
  bls.n .L_func_003030BC_3e
  ldr r1, [r0, #8]
  movs r5, r4
  movs r2, r1
  cmp r1, r6
  bls.n .L_func_003030BC_20
  movs r2, r6
.L_func_003030BC_20:
  movs r0, r4
  bl func_002FFB14
  ldr r1, [r5, #0]
  adds r0, #12
  movs r2, r1
  subs r2, #12
  ldr r2, [r2, #8]
  movs r7, r0
  bl func_002FFAF4
  movs r0, r5
  bl func_00300A00
  str r7, [r5, #0]
.L_func_003030BC_3e:
  ldr r0, [r4, #0]
  ldr r1, [pc, #12]
  subs r0, #12
  cmp r0, r1
  beq.n .L_func_003030BC_4a
  str r6, [r0, #0]
.L_func_003030BC_4a:
  ldr r0, [r4, #0]
  pop {r3, r4, r5, r6, r7, pc}
.size func_003030BC, .-func_003030BC

.section .text.func_003036C0, "ax", %progbits
.balign 2
.global func_003036C0
.type func_003036C0, %function
.thumb_func
func_003036C0:
  push {r4, lr}
  movs r4, r0
  ldr r0, [r0, #0]
  cmp r0, #0
  beq.n .L_func_003036C0_20
  ldr r1, [r0, #28]
  .inst.n 0x1e49 /* subs r1, r1, #1 */
  str r1, [r0, #28]
  bne.n .L_func_003036C0_20
  ldr r0, [r4, #0]
  cmp r0, #0
  beq.n .L_func_003036C0_20
  bl func_002FFE30
  blx func_002FF8C0
.L_func_003036C0_20:
  movs r0, r4
  pop {r4, pc}
.size func_003036C0, .-func_003036C0

.section .text.func_00304408, "ax", %progbits
.balign 2
.global func_00304408
.type func_00304408, %function
.thumb_func
func_00304408:
  push {r4, r5, r6, lr}
  movs r5, r0
  movs r4, r0
  ldr r0, [pc, #44]
  movs r2, #0
  str r0, [r4, #0]
  adds r5, #24
  movs r1, r2
  movs r0, r4
  bl func_001042A6
  ldr r0, [r4, #28]
  blx func_002FF10C
  ldr r0, [r4, #32]
  blx func_002FF10C
  ldr r0, [r4, #44]
  blx func_002FF10C
  movs r0, r5
  bl func_003036C0
  subs r0, #24
  pop {r4, r5, r6, pc}
.size func_00304408, .-func_00304408

.section .text.func_00304D24, "ax", %progbits
.balign 2
.global func_00304D24
.type func_00304D24, %function
.thumb_func
func_00304D24:
  push {r4, lr}
  movs r4, r0
  ldr r0, [r0, #0]
  bl func_00302F64
  cmp r0, #1
  beq.n .L_func_00304D24_10
  movs r0, #0
.L_func_00304D24_10:
  cmp r0, #0
  bne.n .L_func_00304D24_34
  ldr r0, [r4, #0]
  bl func_00302F64
  cmp r0, #1
  beq.n .L_func_00304D24_20
  movs r0, #0
.L_func_00304D24_20:
  cmp r0, #0
  bne.n .L_func_00304D24_34
  ldr r0, [r4, #0]
  bl func_00302F64
  cmp r0, #2
  beq.n .L_func_00304D24_38
  movs r0, #0
.L_func_00304D24_30:
  cmp r0, #0
  beq.n .L_func_00304D24_36
.L_func_00304D24_34:
  movs r0, #1
.L_func_00304D24_36:
  pop {r4, pc}
.L_func_00304D24_38:
  movs r0, #1
  b.n .L_func_00304D24_30
.size func_00304D24, .-func_00304D24

.section .text.func_003053E0, "ax", %progbits
.balign 2
.global func_003053E0
.type func_003053E0, %function
.thumb_func
func_003053E0:
  push {r4, r5, r6, lr}
  movs r4, r0
  movs r0, r1
  movs r1, r2
  muls r1, r3
  ldr r2, [r4, #0]
  bl func_001033C4
  movs r5, r0
  ldr r0, [r4, #0]
  bl func_0030232C
  cmp r0, #0
  bne.n .L_func_003053E0_22
  ldr r0, [r4, #0]
  bl func_00103028
.L_func_003053E0_22:
  movs r0, r5
  pop {r4, r5, r6, pc}
.size func_003053E0, .-func_003053E0

.section .note.GNU-stack, "", %progbits
