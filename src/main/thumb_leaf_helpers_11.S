/* Clean-room implementation generated solely from thumb-leaf-helpers-11.json. */
.syntax unified
.thumb

.section .text.func_0010115A, "ax", %progbits
.balign 2
.global func_0010115A
.type func_0010115A, %function
.thumb_func
func_0010115A:
  push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
  sub sp, #20
  movs r0, #0
  movs r4, r2
  str r0, [sp, #0]
  ldr r0, [r2, #4]
  str r0, [sp, #4]
  ldr r6, [r2, #8]
  movs r0, #0
  str r0, [sp, #8]
  str r0, [sp, #12]
  ldr r1, [r2, #24]
  movs r5, r0
  ldr r0, [sp, #24]
  blx r1
  movs r7, r0
  ldr r1, [sp, #64]
  ldr r0, [sp, #32]
  orrs r0, r1
  beq.n .L_func_0010115A_34
  b.n .L_func_0010115A_3e
.L_func_0010115A_2a:
  ldr r1, [r4, #24]
  ldr r0, [sp, #24]
  .inst.n 0x1c6d @ adds r5, r5, #1
  blx r1
  movs r7, r0
.L_func_0010115A_34:
  ldr r1, [r4, #32]
  movs r0, r7
  blx r1
  cmp r0, #0
  bne.n .L_func_0010115A_2a
.L_func_0010115A_3e:
  .inst.n 0x1c78 @ adds r0, r7, #1
  beq.n .L_func_0010115A_4a
  ldr r0, [sp, #4]
  lsls r0, r0, #31
  beq.n .L_func_0010115A_52
  b.n .L_func_0010115A_86
.L_func_0010115A_4a:
  movs r0, #0
  mvns r0, r0
.L_func_0010115A_4e:
  add sp, #36
  pop {r4, r5, r6, r7, pc}
.L_func_0010115A_52:
  ldr r0, [r4, #0]
  .inst.n 0x1d01 @ adds r1, r0, #4
  str r1, [r4, #0]
  ldr r0, [r0, #0]
  str r0, [sp, #0]
  b.n .L_func_0010115A_86
.L_func_0010115A_5e:
  ldr r0, [sp, #4]
  lsls r0, r0, #31
  bne.n .L_func_0010115A_7a
  lsls r1, r7, #16
  ldr r0, [sp, #0]
  lsrs r1, r1, #16
  add r2, sp, #8
  bl func_002FFBF8
  .inst.n 0x1c41 @ adds r1, r0, #1
  beq.n .L_func_0010115A_da
  ldr r1, [sp, #0]
  adds r0, r1, r0
  str r0, [sp, #0]
.L_func_0010115A_7a:
  ldr r1, [r4, #24]
  .inst.n 0x1e76 @ subs r6, r6, #1
  ldr r0, [sp, #24]
  .inst.n 0x1c6d @ adds r5, r5, #1
  blx r1
  movs r7, r0
.L_func_0010115A_86:
  cmp r6, #0
  ble.n .L_func_0010115A_b4
  .inst.n 0x1c78 @ adds r0, r7, #1
  beq.n .L_func_0010115A_b4
  ldr r0, [sp, #32]
  cmp r0, #0
  beq.n .L_func_0010115A_a4
  ldr r2, [sp, #60]
  ldr r1, [sp, #56]
  movs r3, r7
  bl func_002FFC3C
  cmp r0, #0
  bne.n .L_func_0010115A_5e
  b.n .L_func_0010115A_b4
.L_func_0010115A_a4:
  ldr r0, [sp, #64]
  cmp r0, #0
  bne.n .L_func_0010115A_5e
  ldr r1, [r4, #32]
  movs r0, r7
  blx r1
  cmp r0, #0
  beq.n .L_func_0010115A_5e
.L_func_0010115A_b4:
  ldr r1, [r4, #28]
  ldr r0, [sp, #24]
  blx r1
  ldr r0, [sp, #4]
  ldr r1, [sp, #64]
  lsls r0, r0, #31
  lsrs r0, r0, #31
  orrs r0, r1
  bne.n .L_func_0010115A_ca
  ldr r1, [sp, #0]
  strb r0, [r1, #0]
.L_func_0010115A_ca:
  ldr r0, [r4, #8]
  cmp r0, r6
  ble.n .L_func_0010115A_da
  ldr r0, [sp, #64]
  cmp r0, #0
  beq.n .L_func_0010115A_e0
  cmp r6, #0
  beq.n .L_func_0010115A_e0
.L_func_0010115A_da:
  movs r0, #1
  mvns r0, r0
  b.n .L_func_0010115A_4e
.L_func_0010115A_e0:
  movs r0, r5
  b.n .L_func_0010115A_4e
.size func_0010115A, .-func_0010115A

.section .text.func_00301E0C, "ax", %progbits
.balign 2
.global func_00301E0C
.type func_00301E0C, %function
.thumb_func
func_00301E0C:
  push {r3, r4, r5, r6, r7, lr}
  movs r4, r0
  ldr r7, [r0, #20]
  ldr r0, [r0, #12]
  movs r5, r1
  movs r6, r2
  lsls r0, r0, #30
  beq.n .L_func_00301E0C_72
  movs r0, r7
  blx func_00302274
  cmp r0, #0
  bne.n .L_func_00301E0C_72
  movs r2, r6
  movs r6, #16
  cmp r2, #0
  beq.n .L_func_00301E0C_6e
  cmp r2, #1
  beq.n .L_func_00301E0C_2c
  cmp r2, #2
  bne.n .L_func_00301E0C_72
  b.n .L_func_00301E0C_36
.L_func_00301E0C_2c:
  movs r0, r4
  bl func_0030227C
  adds r5, r0, r5
  b.n .L_func_00301E0C_6e
.L_func_00301E0C_36:
  movs r0, r7
  blx func_003022C0
  ldr r1, [r4, #12]
  orrs r1, r6
  cmp r0, #0
  str r1, [r4, #12]
  bge.n .L_func_00301E0C_50
  movs r0, r4
  bl func_00301D1C
  movs r0, #1
  pop {r3, r4, r5, r6, r7, pc}
.L_func_00301E0C_50:
  lsls r1, r1, #15
  bpl.n .L_func_00301E0C_6c
  ldr r2, [r4, #4]
  ldr r1, [r4, #44]
  cmp r1, r2
  bhi.n .L_func_00301E0C_5e
  movs r1, r2
.L_func_00301E0C_5e:
  ldr r2, [r4, #24]
  adds r1, r1, r2
  ldr r2, [r4, #16]
  subs r1, r1, r2
  cmp r1, r0
  ble.n .L_func_00301E0C_6c
  movs r0, r1
.L_func_00301E0C_6c:
  adds r5, r5, r0
.L_func_00301E0C_6e:
  cmp r5, #0
  bge.n .L_func_00301E0C_76
.L_func_00301E0C_72:
  movs r0, #2
  pop {r3, r4, r5, r6, r7, pc}
.L_func_00301E0C_76:
  ldr r1, [r4, #44]
  ldr r0, [r4, #4]
  ldr r2, [r4, #12]
  cmp r1, r0
  bcs.n .L_func_00301E0C_8e
  lsls r1, r2, #14
  str r0, [r4, #44]
  bpl.n .L_func_00301E0C_8e
  movs r1, #1
  lsls r1, r1, #17
  bics r2, r1
  orrs r2, r6
.L_func_00301E0C_8e:
  ldr r6, [r4, #24]
  cmp r6, r5
  bgt.n .L_func_00301E0C_b8
  ldr r1, [r4, #44]
  cmp r1, r0
  bls.n .L_func_00301E0C_9e
  movs r3, r1
  b.n .L_func_00301E0C_a0
.L_func_00301E0C_9e:
  movs r3, r0
.L_func_00301E0C_a0:
  adds r7, r3, r6
  ldr r3, [r4, #16]
  subs r7, r7, r3
  cmp r7, r5
  ble.n .L_func_00301E0C_b8
  cmp r1, r0
  bls.n .L_func_00301E0C_b2
  movs r7, r1
  b.n .L_func_00301E0C_b4
.L_func_00301E0C_b2:
  movs r7, r0
.L_func_00301E0C_b4:
  cmp r7, r3
  bne.n .L_func_00301E0C_c6
.L_func_00301E0C_b8:
  movs r0, #32
  orrs r2, r0
  movs r0, #0
  str r0, [r4, #8]
  str r5, [r4, #40]
  str r0, [r4, #0]
  b.n .L_func_00301E0C_e2
.L_func_00301E0C_c6:
  subs r5, r5, r6
  ldr r6, [r4, #28]
  subs r6, r5, r6
  cmp r1, r0
  str r6, [r4, #8]
  bls.n .L_func_00301E0C_d4
  movs r0, r1
.L_func_00301E0C_d4:
  subs r0, r0, r3
  subs r0, r5, r0
  str r0, [r4, #0]
  adds r0, r3, r5
  str r0, [r4, #4]
  movs r0, #32
  bics r2, r0
.L_func_00301E0C_e2:
  .inst.n 0x4803 @ ldr r0, [pc, #12]
  ands r2, r0
  movs r0, #0
  str r2, [r4, #12]
  adds r4, #64
  strb r0, [r4, #4]
  pop {r3, r4, r5, r6, r7, pc}
.size func_00301E0C, .-func_00301E0C

.section .text.func_003034CC, "ax", %progbits
.balign 2
.global func_003034CC
.type func_003034CC, %function
.thumb_func
func_003034CC:
  push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
  sub sp, #4
  movs r6, r0
  movs r5, r3
  ldr r0, [r0, #0]
  ldr r1, [r0, #20]
  tst r1, r5
  beq.n .L_func_003034CC_14
  movs r4, #0
  b.n .L_func_003034CC_22
.L_func_003034CC_14:
  ldr r1, [r0, #16]
  .inst.n 0x483a @ ldr r0, [pc, #232]
  tst r1, r5
  beq.n .L_func_003034CC_20
  ldr r4, [r0, #12]
  b.n .L_func_003034CC_22
.L_func_003034CC_20:
  ldr r4, [r0, #8]
.L_func_003034CC_22:
  cmp r4, #0
  beq.n .L_func_003034CC_4c
  ldr r0, [sp, #8]
  ldr r7, [r0, #0]
  ldr r0, [r4, #12]
  cmp r0, r7
  bhi.n .L_func_003034CC_40
  movs r0, #0
  str r0, [sp, #0]
  movs r0, r4
  .inst.n 0x1c79 @ adds r1, r7, #1
  adds r0, #8
  mov r2, sp
  bl func_003035D4
.L_func_003034CC_40:
  ldr r0, [r4, #8]
  lsls r1, r7, #2
  adds r0, r0, r1
  ldr r7, [r0, #0]
  cmp r7, #0
  bne.n .L_func_003034CC_ee
.L_func_003034CC_4c:
  ldr r0, [sp, #12]
  cmp r0, #0
  bne.n .L_func_003034CC_58
  movs r0, #4
  bl func_00300ABC
.L_func_003034CC_58:
  cmp r4, #0
  beq.n .L_func_003034CC_82
  ldr r0, [sp, #8]
  ldr r7, [r0, #0]
  ldr r0, [r4, #12]
  cmp r0, r7
  bhi.n .L_func_003034CC_76
  movs r0, #0
  str r0, [sp, #0]
  movs r0, r4
  .inst.n 0x1c79 @ adds r1, r7, #1
  adds r0, #8
  mov r2, sp
  bl func_003035D4
.L_func_003034CC_76:
  ldr r0, [r4, #8]
  lsls r1, r7, #2
  adds r0, r0, r1
  ldr r7, [r0, #0]
  cmp r7, #0
  bne.n .L_func_003034CC_ee
.L_func_003034CC_82:
  ldr r2, [r6, #0]
  movs r3, #0
  ldr r0, [r2, #20]
  .inst.n 0xa11e @ add r1, pc, #120
  tst r0, r5
  beq.n .L_func_003034CC_b0
  movs r3, #2
  movs r1, #16
  movs r0, #0
.L_func_003034CC_94:
  movs r7, r5
  tst r7, r1
  beq.n .L_func_003034CC_a4
  ldr r1, [r2, #0]
  lsls r0, r0, #2
  adds r0, r1, r0
  ldr r1, [r0, #0]
  b.n .L_func_003034CC_b8
.L_func_003034CC_a4:
  .inst.n 0x1c40 @ adds r0, r0, #1
  lsls r1, r1, #1
  cmp r0, #6
  bcc.n .L_func_003034CC_94
  .inst.n 0xa115 @ add r1, pc, #84
  b.n .L_func_003034CC_b8
.L_func_003034CC_b0:
  ldr r0, [r2, #16]
  tst r0, r5
  beq.n .L_func_003034CC_b8
  movs r3, #1
.L_func_003034CC_b8:
  movs r2, #0
  movs r0, r3
  ldr r3, [sp, #40]
  blx r3
  movs r7, r0
  cmp r4, #0
  beq.n .L_func_003034CC_ee
  ldr r0, [r6, #0]
  cmp r0, r4
  beq.n .L_func_003034CC_ee
  movs r1, r4
  mov r0, sp
  bl func_0030361C
  ldr r2, [sp, #8]
  movs r1, r7
  mov r0, sp
  bl func_00303640
  movs r0, #0
  str r0, [sp, #0]
  ldr r0, [r4, #28]
  .inst.n 0x1e40 @ subs r0, r0, #1
  str r0, [r4, #28]
  mov r0, sp
  bl func_003036C0
.L_func_003034CC_ee:
  ldr r2, [sp, #8]
  movs r1, r7
  movs r0, r6
  bl func_00303640
  movs r0, r7
  add sp, #20
  pop {r4, r5, r6, r7, pc}
.size func_003034CC, .-func_003034CC

.section .text.func_00101040, "ax", %progbits
.balign 2
.global func_00101040
.type func_00101040, %function
.thumb_func
func_00101040:
  push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
  sub sp, #28
  movs r7, #0
  movs r4, r2
  ldr r0, [r2, #4]
  movs r6, r7
  str r0, [sp, #4]
  ldr r0, [r2, #8]
  str r7, [sp, #8]
  str r7, [sp, #12]
  str r7, [sp, #16]
  str r0, [sp, #0]
  ldr r1, [r2, #24]
  ldr r0, [sp, #32]
  blx r1
  movs r5, r0
  ldr r1, [sp, #64]
  ldr r0, [sp, #40]
  orrs r0, r1
  beq.n .L_func_00101040_34
  b.n .L_func_00101040_3e
.L_func_00101040_2a:
  ldr r1, [r4, #24]
  ldr r0, [sp, #32]
  .inst.n 0x1c76 @ adds r6, r6, #1
  blx r1
  movs r5, r0
.L_func_00101040_34:
  ldr r1, [r4, #32]
  movs r0, r5
  blx r1
  cmp r0, #0
  bne.n .L_func_00101040_2a
.L_func_00101040_3e:
  .inst.n 0x1c68 @ adds r0, r5, #1
  beq.n .L_func_00101040_4a
  ldr r0, [sp, #4]
  lsls r0, r0, #31
  beq.n .L_func_00101040_52
  b.n .L_func_00101040_a2
.L_func_00101040_4a:
  movs r0, #0
  mvns r0, r0
.L_func_00101040_4e:
  add sp, #44
  pop {r4, r5, r6, r7, pc}
.L_func_00101040_52:
  ldr r0, [r4, #0]
  .inst.n 0x1d01 @ adds r1, r0, #4
  str r1, [r4, #0]
  ldr r7, [r0, #0]
  b.n .L_func_00101040_a2
.L_func_00101040_5c:
  lsls r1, r5, #24
  add r2, sp, #12
  lsrs r1, r1, #24
  add r0, sp, #20
  bl func_002FED38
  .inst.n 0x1c41 @ adds r1, r0, #1
  beq.n .L_func_00101040_7c
  .inst.n 0x1c80 @ adds r0, r0, #2
  beq.n .L_func_00101040_84
  movs r0, #0
  str r0, [sp, #8]
  ldr r0, [sp, #4]
  lsls r0, r0, #31
  beq.n .L_func_00101040_8a
  b.n .L_func_00101040_92
.L_func_00101040_7c:
  ldr r1, [r4, #28]
  ldr r0, [sp, #32]
  blx r1
  b.n .L_func_00101040_110
.L_func_00101040_84:
  movs r0, #1
  str r0, [sp, #8]
  b.n .L_func_00101040_98
.L_func_00101040_8a:
  mov r0, sp
  ldrh r0, [r0, #20]
  strh r0, [r7, #0]
  .inst.n 0x1cbf @ adds r7, r7, #2
.L_func_00101040_92:
  ldr r0, [sp, #0]
  .inst.n 0x1e40 @ subs r0, r0, #1
  str r0, [sp, #0]
.L_func_00101040_98:
  ldr r1, [r4, #24]
  ldr r0, [sp, #32]
  .inst.n 0x1c76 @ adds r6, r6, #1
  blx r1
  movs r5, r0
.L_func_00101040_a2:
  ldr r0, [sp, #0]
  cmp r0, #0
  ble.n .L_func_00101040_e2
  .inst.n 0x1c68 @ adds r0, r5, #1
  beq.n .L_func_00101040_e2
  ldr r0, [sp, #40]
  cmp r0, #0
  beq.n .L_func_00101040_d2
  asrs r0, r5, #31
  lsrs r0, r0, #27
  adds r0, r0, r5
  asrs r1, r0, #5
  lsrs r0, r0, #5
  lsls r2, r1, #2
  ldr r1, [sp, #40]
  lsls r0, r0, #5
  adds r1, r2, r1
  subs r2, r5, r0
  ldr r1, [r1, #0]
  movs r0, #1
  lsls r0, r2
  tst r1, r0
  bne.n .L_func_00101040_5c
  b.n .L_func_00101040_e2
.L_func_00101040_d2:
  ldr r0, [sp, #64]
  cmp r0, #0
  bne.n .L_func_00101040_5c
  ldr r1, [r4, #32]
  movs r0, r5
  blx r1
  cmp r0, #0
  beq.n .L_func_00101040_5c
.L_func_00101040_e2:
  ldr r1, [r4, #28]
  ldr r0, [sp, #32]
  blx r1
  ldr r0, [sp, #8]
  cmp r0, #0
  bne.n .L_func_00101040_110
  ldr r0, [sp, #4]
  ldr r1, [sp, #64]
  lsls r0, r0, #31
  lsrs r0, r0, #31
  orrs r0, r1
  bne.n .L_func_00101040_fc
  strh r0, [r7, #0]
.L_func_00101040_fc:
  ldr r1, [r4, #8]
  ldr r0, [sp, #0]
  cmp r1, r0
  ble.n .L_func_00101040_110
  ldr r0, [sp, #64]
  cmp r0, #0
  beq.n .L_func_00101040_116
  ldr r0, [sp, #0]
  cmp r0, #0
  beq.n .L_func_00101040_116
.L_func_00101040_110:
  movs r0, #1
  mvns r0, r0
  b.n .L_func_00101040_4e
.L_func_00101040_116:
  movs r0, r6
  b.n .L_func_00101040_4e
.size func_00101040, .-func_00101040

.section .text.func_00303954, "ax", %progbits
.balign 2
.global func_00303954
.type func_00303954, %function
.thumb_func
func_00303954:
  push {r3, r4, r5, r6, r7, lr}
  movs r4, r0
  movs r0, #32
  str r0, [r4, #4]
  movs r0, #0
  str r3, [r4, #12]
  .inst.n 0x4b47 @ ldr r3, [pc, #284]
  str r0, [r4, #8]
  str r3, [r4, #0]
  str r1, [r4, #20]
  cmp r1, #0
  strb r2, [r4, #24]
  bne.n .L_func_00303954_20
  .inst.n 0x4945 @ ldr r1, [pc, #276]
  str r1, [r4, #20]
  strb r0, [r4, #24]
.L_func_00303954_20:
  movs r5, #0
  movs r6, #255
.L_func_00303954_24:
  lsls r2, r5, #24
  lsrs r2, r2, #24
  movs r1, #16
  movs r0, r4
  bl func_00303304
  cmp r0, #0
  bne.n .L_func_00303954_48
  b.n .L_func_00303954_4e
.L_func_00303954_36:
  lsls r2, r6, #24
  lsrs r2, r2, #24
  movs r1, #16
  movs r0, r4
  bl func_00303304
  cmp r0, #0
  bne.n .L_func_00303954_54
  .inst.n 0x1e76 @ subs r6, r6, #1
.L_func_00303954_48:
  cmp r6, r5
  bhi.n .L_func_00303954_36
  b.n .L_func_00303954_54
.L_func_00303954_4e:
  .inst.n 0x1c6d @ adds r5, r5, #1
  cmp r5, r6
  bcc.n .L_func_00303954_24
.L_func_00303954_54:
  subs r0, r6, r5
  str r6, [r4, #32]
  .inst.n 0x1c40 @ adds r0, r0, #1
  str r5, [r4, #28]
  bl func_002FF094
  movs r7, r0
  str r0, [r4, #44]
  b.n .L_func_00303954_a0
.L_func_00303954_66:
  movs r0, r5
  subs r0, #97
  cmp r0, #25
  bhi.n .L_func_00303954_98
  lsls r2, r5, #24
  lsrs r2, r2, #24
  movs r1, #16
  movs r0, r4
  bl func_00303304
  cmp r0, #0
  beq.n .L_func_00303954_98
  movs r0, r5
  subs r0, #32
  lsls r2, r0, #24
  str r0, [sp, #0]
  lsrs r2, r2, #24
  movs r1, #8
  movs r0, r4
  bl func_00303304
  cmp r0, #0
  beq.n .L_func_00303954_98
  ldr r0, [sp, #0]
  b.n .L_func_00303954_9a
.L_func_00303954_98:
  movs r0, r5
.L_func_00303954_9a:
  strb r0, [r7, #0]
  .inst.n 0x1c7f @ adds r7, r7, #1
  .inst.n 0x1c6d @ adds r5, r5, #1
.L_func_00303954_a0:
  cmp r5, r6
  bls.n .L_func_00303954_66
  movs r5, #0
  movs r6, #255
.L_func_00303954_a8:
  lsls r2, r5, #24
  lsrs r2, r2, #24
  movs r1, #8
  movs r0, r4
  bl func_00303304
  cmp r0, #0
  bne.n .L_func_00303954_cc
  b.n .L_func_00303954_d2
.L_func_00303954_ba:
  lsls r2, r6, #24
  lsrs r2, r2, #24
  movs r1, #8
  movs r0, r4
  bl func_00303304
  cmp r0, #0
  bne.n .L_func_00303954_d8
  .inst.n 0x1e76 @ subs r6, r6, #1
.L_func_00303954_cc:
  cmp r6, r5
  bhi.n .L_func_00303954_ba
  b.n .L_func_00303954_d8
.L_func_00303954_d2:
  .inst.n 0x1c6d @ adds r5, r5, #1
  cmp r5, r6
  bcc.n .L_func_00303954_a8
.L_func_00303954_d8:
  subs r0, r6, r5
  str r6, [r4, #40]
  .inst.n 0x1c40 @ adds r0, r0, #1
  str r5, [r4, #36]
  bl func_002FF094
  movs r7, r0
  str r0, [r4, #48]
  b.n .L_func_00303954_124
.L_func_00303954_ea:
  movs r0, r5
  subs r0, #65
  cmp r0, #25
  bhi.n .L_func_00303954_11c
  lsls r2, r5, #24
  lsrs r2, r2, #24
  movs r1, #8
  movs r0, r4
  bl func_00303304
  cmp r0, #0
  beq.n .L_func_00303954_11c
  movs r0, r5
  adds r0, #32
  lsls r2, r0, #24
  str r0, [sp, #0]
  lsrs r2, r2, #24
  movs r1, #16
  movs r0, r4
  bl func_00303304
  cmp r0, #0
  beq.n .L_func_00303954_11c
  ldr r0, [sp, #0]
  b.n .L_func_00303954_11e
.L_func_00303954_11c:
  movs r0, r5
.L_func_00303954_11e:
  strb r0, [r7, #0]
  .inst.n 0x1c7f @ adds r7, r7, #1
  .inst.n 0x1c6d @ adds r5, r5, #1
.L_func_00303954_124:
  cmp r5, r6
  bls.n .L_func_00303954_ea
  movs r0, r4
  pop {r3, r4, r5, r6, r7, pc}
.size func_00303954, .-func_00303954

.section .text.func_00103F08, "ax", %progbits
.balign 2
.global func_00103F08
.type func_00103F08, %function
.thumb_func
func_00103F08:
  push {r1, r2, r3, r4, r5, r6, r7, lr}
  movs r5, r2
  movs r6, r0
  movs r4, r1
  movs r0, r1
  bl func_00103E3C
  movs r1, r0
  movs r3, r5
  movs r2, #0
  movs r0, r6
  bl func_00303954
  .inst.n 0x4947 @ ldr r1, [pc, #284]
  str r1, [r0, #0]
  movs r6, r0
  ldr r0, [r0, #20]
  .inst.n 0x4946 @ ldr r1, [pc, #280]
  cmp r0, r1
  beq.n .L_func_00103F08_11e
  movs r0, #1
  strb r0, [r6, #24]
  movs r2, #2
  movs r1, r4
  mov r0, sp
  bl func_00302FB6
  movs r4, #0
  movs r5, #255
.L_func_00103F08_3a:
  lsls r2, r4, #24
  lsrs r2, r2, #24
  movs r1, #16
  movs r0, r6
  bl func_00303304
  cmp r0, #0
  bne.n .L_func_00103F08_5e
  b.n .L_func_00103F08_64
.L_func_00103F08_4c:
  lsls r2, r5, #24
  lsrs r2, r2, #24
  movs r1, #16
  movs r0, r6
  bl func_00303304
  cmp r0, #0
  bne.n .L_func_00103F08_6a
  .inst.n 0x1e6d @ subs r5, r5, #1
.L_func_00103F08_5e:
  cmp r5, r4
  bhi.n .L_func_00103F08_4c
  b.n .L_func_00103F08_6a
.L_func_00103F08_64:
  .inst.n 0x1c64 @ adds r4, r4, #1
  cmp r4, r5
  bcc.n .L_func_00103F08_3a
.L_func_00103F08_6a:
  str r5, [r6, #32]
  str r4, [r6, #28]
  ldr r7, [r6, #44]
  b.n .L_func_00103F08_ac
.L_func_00103F08_72:
  movs r0, r4
  subs r0, #97
  cmp r0, #25
  bhi.n .L_func_00103F08_a4
  lsls r2, r4, #24
  lsrs r2, r2, #24
  movs r1, #16
  movs r0, r6
  bl func_00303304
  cmp r0, #0
  beq.n .L_func_00103F08_a4
  movs r0, r4
  subs r0, #32
  lsls r2, r0, #24
  str r0, [sp, #8]
  lsrs r2, r2, #24
  movs r1, #8
  movs r0, r6
  bl func_00303304
  cmp r0, #0
  beq.n .L_func_00103F08_a4
  ldr r0, [sp, #8]
  b.n .L_func_00103F08_a6
.L_func_00103F08_a4:
  movs r0, r4
.L_func_00103F08_a6:
  strb r0, [r7, #0]
  .inst.n 0x1c7f @ adds r7, r7, #1
  .inst.n 0x1c64 @ adds r4, r4, #1
.L_func_00103F08_ac:
  cmp r4, r5
  bls.n .L_func_00103F08_72
  movs r4, #0
  movs r5, #255
.L_func_00103F08_b4:
  lsls r2, r4, #24
  lsrs r2, r2, #24
  movs r1, #8
  movs r0, r6
  bl func_00303304
  cmp r0, #0
  bne.n .L_func_00103F08_d8
  b.n .L_func_00103F08_de
.L_func_00103F08_c6:
  lsls r2, r5, #24
  lsrs r2, r2, #24
  movs r1, #8
  movs r0, r6
  bl func_00303304
  cmp r0, #0
  bne.n .L_func_00103F08_e4
  .inst.n 0x1e6d @ subs r5, r5, #1
.L_func_00103F08_d8:
  cmp r5, r4
  bhi.n .L_func_00103F08_c6
  b.n .L_func_00103F08_e4
.L_func_00103F08_de:
  .inst.n 0x1c64 @ adds r4, r4, #1
  cmp r4, r5
  bcc.n .L_func_00103F08_b4
.L_func_00103F08_e4:
  str r5, [r6, #40]
  str r4, [r6, #36]
  ldr r7, [r6, #48]
  b.n .L_func_00103F08_128
.L_func_00103F08_ec:
  movs r0, r4
  subs r0, #65
  cmp r0, #25
  bhi.n .L_func_00103F08_120
  lsls r2, r4, #24
  lsrs r2, r2, #24
  movs r1, #8
  movs r0, r6
  bl func_00303304
  cmp r0, #0
  beq.n .L_func_00103F08_120
  movs r0, r4
  adds r0, #32
  lsls r2, r0, #24
  str r0, [sp, #8]
  lsrs r2, r2, #24
  movs r1, #16
  movs r0, r6
  bl func_00303304
  cmp r0, #0
  beq.n .L_func_00103F08_120
  ldr r0, [sp, #8]
  b.n .L_func_00103F08_122
.L_func_00103F08_11e:
  b.n .L_func_00103F08_132
.L_func_00103F08_120:
  movs r0, r4
.L_func_00103F08_122:
  strb r0, [r7, #0]
  .inst.n 0x1c7f @ adds r7, r7, #1
  .inst.n 0x1c64 @ adds r4, r4, #1
.L_func_00103F08_128:
  cmp r4, r5
  bls.n .L_func_00103F08_ec
  mov r0, sp
  bl func_00302FEE
.L_func_00103F08_132:
  movs r0, r6
  pop {r1, r2, r3, r4, r5, r6, r7, pc}
.size func_00103F08, .-func_00103F08

.section .text.func_00100CD0, "ax", %progbits
.balign 2
.global func_00100CD0
.type func_00100CD0, %function
.thumb_func
func_00100CD0:
  push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
  movs r5, #0
  movs r4, r3
  mvns r5, r5
  sub sp, #12
  movs r0, #0
  str r0, [sp, #0]
  str r0, [sp, #4]
  ldr r7, [r3, #8]
  ldr r6, [r3, #4]
.L_func_00100CD0_14:
  ldr r1, [r4, #24]
  ldr r0, [sp, #16]
  .inst.n 0x1c6d @ adds r5, r5, #1
  blx r1
  str r0, [sp, #8]
  ldr r1, [r4, #32]
  blx r1
  cmp r0, #0
  bne.n .L_func_00100CD0_14
  ldr r0, [sp, #8]
  .inst.n 0x1c40 @ adds r0, r0, #1
  beq.n .L_func_00100CD0_46
  movs r0, #3
  lsls r0, r0, #9
  bics r6, r0
  cmp r7, #0
  ble.n .L_func_00100CD0_6a
  lsls r0, r6, #25
  bpl.n .L_func_00100CD0_64
  ldr r0, [sp, #8]
  cmp r0, #43
  beq.n .L_func_00100CD0_54
  cmp r0, #45
  bne.n .L_func_00100CD0_64
  b.n .L_func_00100CD0_4e
.L_func_00100CD0_46:
  movs r0, #0
  mvns r0, r0
.L_func_00100CD0_4a:
  add sp, #28
  pop {r4, r5, r6, r7, pc}
.L_func_00100CD0_4e:
  movs r0, #1
  lsls r0, r0, #10
  orrs r6, r0
.L_func_00100CD0_54:
  ldr r1, [r4, #24]
  ldr r0, [sp, #16]
  .inst.n 0x1c6d @ adds r5, r5, #1
  blx r1
  .inst.n 0x1e7f @ subs r7, r7, #1
  cmp r7, #0
  str r0, [sp, #8]
  ble.n .L_func_00100CD0_6a
.L_func_00100CD0_64:
  ldr r0, [sp, #8]
  cmp r0, #48
  beq.n .L_func_00100CD0_72
.L_func_00100CD0_6a:
  ldr r0, [sp, #20]
  cmp r0, #0
  beq.n .L_func_00100CD0_bc
  b.n .L_func_00100CD0_ec
.L_func_00100CD0_72:
  movs r0, #1
  ldr r1, [r4, #24]
  lsls r0, r0, #9
  orrs r6, r0
  .inst.n 0x1e7f @ subs r7, r7, #1
  ldr r0, [sp, #16]
  .inst.n 0x1c6d @ adds r5, r5, #1
  blx r1
  cmp r7, #0
  str r0, [sp, #8]
  ble.n .L_func_00100CD0_90
  cmp r0, #120
  beq.n .L_func_00100CD0_98
  cmp r0, #88
  beq.n .L_func_00100CD0_98
.L_func_00100CD0_90:
  ldr r0, [sp, #20]
  cmp r0, #0
  beq.n .L_func_00100CD0_b8
  b.n .L_func_00100CD0_ec
.L_func_00100CD0_98:
  ldr r0, [sp, #20]
  cmp r0, #0
  beq.n .L_func_00100CD0_a2
  cmp r0, #16
  bne.n .L_func_00100CD0_ec
.L_func_00100CD0_a2:
  movs r0, #1
  ldr r1, [r4, #24]
  lsls r0, r0, #9
  bics r6, r0
  .inst.n 0x1e7f @ subs r7, r7, #1
  ldr r0, [sp, #16]
  .inst.n 0x1c6d @ adds r5, r5, #1
  blx r1
  str r0, [sp, #8]
  movs r0, #16
  b.n .L_func_00100CD0_be
.L_func_00100CD0_b8:
  movs r0, #8
  b.n .L_func_00100CD0_be
.L_func_00100CD0_bc:
  movs r0, #10
.L_func_00100CD0_be:
  str r0, [sp, #20]
  b.n .L_func_00100CD0_ec
.L_func_00100CD0_c2:
  ldr r2, [sp, #20]
  movs r0, #1
  ldr r1, [sp, #4]
  lsls r0, r0, #9
  orrs r6, r0
  ldr r0, [sp, #0]
  .inst.n 0x1e7f @ subs r7, r7, #1
  asrs r3, r2, #31
  blx func_002FFBE0
  ldr r2, [sp, #8]
  asrs r3, r2, #31
  adds r0, r0, r2
  adcs r1, r3
  str r1, [sp, #4]
  str r0, [sp, #0]
  ldr r1, [r4, #24]
  ldr r0, [sp, #16]
  .inst.n 0x1c6d @ adds r5, r5, #1
  blx r1
  str r0, [sp, #8]
.L_func_00100CD0_ec:
  cmp r7, #0
  ble.n .L_func_00100CD0_fe
  ldr r1, [sp, #20]
  ldr r0, [sp, #8]
  bl func_002FEDD0
  cmp r0, #0
  str r0, [sp, #8]
  bge.n .L_func_00100CD0_c2
.L_func_00100CD0_fe:
  ldr r1, [r4, #28]
  ldr r0, [sp, #16]
  blx r1
  lsls r0, r6, #22
  bmi.n .L_func_00100CD0_10e
  movs r0, #1
  mvns r0, r0
  b.n .L_func_00100CD0_4a
.L_func_00100CD0_10e:
  lsls r0, r6, #31
  bne.n .L_func_00100CD0_132
  lsls r0, r6, #25
  bpl.n .L_func_00100CD0_136
  ldr r1, [sp, #0]
  lsls r0, r6, #21
  bpl.n .L_func_00100CD0_126
  ldr r0, [sp, #4]
  movs r2, #0
  negs r1, r1
  sbcs r2, r0
  b.n .L_func_00100CD0_128
.L_func_00100CD0_126:
  ldr r2, [sp, #4]
.L_func_00100CD0_128:
  ldr r0, [r4, #0]
  .inst.n 0x1d03 @ adds r3, r0, #4
  str r3, [r4, #0]
  ldr r0, [r0, #0]
.L_func_00100CD0_130:
  stmia r0!, {r1, r2}
.L_func_00100CD0_132:
  movs r0, r5
  b.n .L_func_00100CD0_4a
.L_func_00100CD0_136:
  ldr r0, [r4, #0]
  .inst.n 0x1d01 @ adds r1, r0, #4
  str r1, [r4, #0]
  ldr r0, [r0, #0]
  ldr r2, [sp, #4]
  ldr r1, [sp, #0]
  b.n .L_func_00100CD0_130
.size func_00100CD0, .-func_00100CD0

.section .text.func_001007BC, "ax", %progbits
.balign 2
.global func_001007BC
.type func_001007BC, %function
.thumb_func
func_001007BC:
  push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
  sub sp, #44
  .inst.n 0x4e51 @ ldr r6, [pc, #324]
  ldr r0, [r6, #0]
  cmp r0, #0
  bne.n .L_func_001007BC_e4
  .inst.n 0xa050 @ add r0, pc, #320
  movs r0, #0
  .inst.n 0xbf00 @ nop @ (mov r8, r8)
  movs r5, r0
  bne.n .L_func_001007BC_1a
  movs r5, r6
  adds r5, #12
.L_func_001007BC_1a:
  movs r0, r5
  movs r1, #58
  bl func_00100BCC
  cmp r0, #0
  beq.n .L_func_001007BC_44
  movs r1, #0
  .inst.n 0x4a48 @ ldr r2, [pc, #288]
  strb r1, [r0, #0]
  .inst.n 0x1c40 @ adds r0, r0, #1
  .inst.n 0x1d12 @ adds r2, r2, #4
  .inst.n 0xa14a @ add r1, pc, #296
  bl func_00100B8C
  cmp r0, #1
  bne.n .L_func_001007BC_40
  ldr r0, [r6, #4]
  cmp r0, #0
  bgt.n .L_func_001007BC_44
.L_func_001007BC_40:
  movs r0, #1
  str r0, [r6, #4]
.L_func_001007BC_44:
  .inst.n 0x4946 @ ldr r1, [pc, #280]
  movs r0, #20
  str r1, [sp, #20]
  movs r0, r1
  .inst.n 0xbf00 @ nop @ (mov r8, r8)
  movs r7, r0
  beq.n .L_func_001007BC_90
  movs r1, #1
  lsls r1, r1, #9
  str r1, [r0, #4]
  movs r1, #0
  str r1, [r0, #8]
  str r1, [r0, #12]
  .inst.n 0x4941 @ ldr r1, [pc, #260]
  movs r0, r7
  adds r0, #16
  str r1, [r7, #0]
  str r0, [sp, #24]
  movs r4, r7
  add r0, sp, #36
  .inst.n 0xbf00 @ nop @ (mov r8, r8)
  .inst.n 0xbf00 @ nop @ (mov r8, r8)
  movs r2, r0
  .inst.n 0xa13d @ add r1, pc, #244
  add r0, sp, #16
  bl func_002FF7F8
  movs r1, r0
  ldr r0, [sp, #24]
  bl func_002FF830
  movs r4, r0
  subs r4, #16
  add r0, sp, #16
  bl func_002FF86C
  .inst.n 0x4837 @ ldr r0, [pc, #220]
  str r0, [r4, #0]
.L_func_001007BC_90:
  .inst.n 0x4c33 @ ldr r4, [pc, #204]
  add r0, sp, #32
  .inst.n 0xbf00 @ nop @ (mov r8, r8)
  .inst.n 0xbf00 @ nop @ (mov r8, r8)
  movs r2, r0
  movs r1, r5
  add r0, sp, #4
  bl func_002FF7F8
  movs r7, r0
  mov r0, sp
  bl func_002FF878
  movs r2, r0
  ldr r0, [r4, #0]
  movs r1, r7
  ldr r3, [r0, #12]
  movs r0, r4
  blx r3
  str r0, [r6, #8]
  ldr r4, [sp, #0]
  cmp r4, #0
  beq.n .L_func_001007BC_dc
  ldr r0, [r4, #28]
  .inst.n 0x1e40 @ subs r0, r0, #1
  str r0, [r4, #28]
  bne.n .L_func_001007BC_dc
  ldr r0, [r4, #24]
  blx func_002FF10C
  ldr r0, [r4, #8]
  blx func_002FF10C
  movs r0, r4
  bl func_002FF89C
  blx func_002FF8C0
.L_func_001007BC_dc:
  add r0, sp, #4
  bl func_002FF86C
  str r5, [r6, #0]
.L_func_001007BC_e4:
  ldr r4, [r6, #8]
  .inst.n 0x1c60 @ adds r0, r4, #1
  beq.n .L_func_001007BC_13c
  add r0, sp, #8
  str r0, [sp, #16]
  ldr r7, [r6, #4]
  .inst.n 0x4d1b @ ldr r5, [pc, #108]
  ldr r6, [sp, #52]
  add r0, sp, #28
  .inst.n 0xbf00 @ nop @ (mov r8, r8)
  .inst.n 0xbf00 @ nop @ (mov r8, r8)
  movs r2, r0
  .inst.n 0xa116 @ add r1, pc, #88
  add r0, sp, #12
  bl func_002FF7F8
  str r6, [sp, #0]
  str r0, [sp, #4]
  ldr r0, [r5, #0]
  movs r3, r7
  ldr r6, [r0, #16]
  movs r2, r4
  ldr r0, [sp, #16]
  movs r1, r5
  blx r6
  add r0, sp, #12
  bl func_002FF86C
  ldr r2, [sp, #8]
  movs r0, r2
  subs r0, #12
  ldr r0, [r0, #8]
  cmp r0, #0
  beq.n .L_func_001007BC_140
  ldr r3, [sp, #56]
  ldr r1, [sp, #48]
  ldr r0, [sp, #44]
  bl func_002FEFDC
  movs r4, r0
  add r0, sp, #8
  bl func_002FF86C
  movs r0, r4
.L_func_001007BC_13c:
  add sp, #60
  pop {r4, r5, r6, r7, pc}
.L_func_001007BC_140:
  add r0, sp, #8
  bl func_002FF86C
  movs r0, #0
  b.n .L_func_001007BC_13c
.size func_001007BC, .-func_001007BC

.section .text.func_00100E14, "ax", %progbits
.balign 2
.global func_00100E14
.type func_00100E14, %function
.thumb_func
func_00100E14:
  push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
  movs r7, #0
  movs r5, r3
  mvns r7, r7
  sub sp, #12
  ldr r4, [r3, #4]
  movs r0, #0
  str r0, [sp, #4]
  ldr r6, [r3, #8]
.L_func_00100E14_12:
  ldr r1, [r5, #24]
  ldr r0, [sp, #16]
  .inst.n 0x1c7f @ adds r7, r7, #1
  blx r1
  str r0, [sp, #0]
  ldr r1, [r5, #32]
  blx r1
  cmp r0, #0
  bne.n .L_func_00100E14_12
  ldr r0, [sp, #0]
  .inst.n 0x1c40 @ adds r0, r0, #1
  beq.n .L_func_00100E14_44
  movs r0, #3
  lsls r0, r0, #9
  bics r4, r0
  cmp r6, #0
  ble.n .L_func_00100E14_68
  lsls r0, r4, #25
  bpl.n .L_func_00100E14_62
  ldr r0, [sp, #0]
  cmp r0, #43
  beq.n .L_func_00100E14_52
  cmp r0, #45
  bne.n .L_func_00100E14_62
  b.n .L_func_00100E14_4c
.L_func_00100E14_44:
  movs r0, #0
  mvns r0, r0
.L_func_00100E14_48:
  add sp, #28
  pop {r4, r5, r6, r7, pc}
.L_func_00100E14_4c:
  movs r0, #1
  lsls r0, r0, #10
  orrs r4, r0
.L_func_00100E14_52:
  ldr r1, [r5, #24]
  ldr r0, [sp, #16]
  .inst.n 0x1c7f @ adds r7, r7, #1
  blx r1
  .inst.n 0x1e76 @ subs r6, r6, #1
  cmp r6, #0
  str r0, [sp, #0]
  ble.n .L_func_00100E14_68
.L_func_00100E14_62:
  ldr r0, [sp, #0]
  cmp r0, #48
  beq.n .L_func_00100E14_70
.L_func_00100E14_68:
  ldr r0, [sp, #20]
  cmp r0, #0
  beq.n .L_func_00100E14_ba
  b.n .L_func_00100E14_dc
.L_func_00100E14_70:
  movs r0, #1
  ldr r1, [r5, #24]
  lsls r0, r0, #9
  orrs r4, r0
  .inst.n 0x1e76 @ subs r6, r6, #1
  ldr r0, [sp, #16]
  .inst.n 0x1c7f @ adds r7, r7, #1
  blx r1
  cmp r6, #0
  str r0, [sp, #0]
  ble.n .L_func_00100E14_8e
  cmp r0, #120
  beq.n .L_func_00100E14_96
  cmp r0, #88
  beq.n .L_func_00100E14_96
.L_func_00100E14_8e:
  ldr r0, [sp, #20]
  cmp r0, #0
  beq.n .L_func_00100E14_b6
  b.n .L_func_00100E14_dc
.L_func_00100E14_96:
  ldr r0, [sp, #20]
  cmp r0, #0
  beq.n .L_func_00100E14_a0
  cmp r0, #16
  bne.n .L_func_00100E14_dc
.L_func_00100E14_a0:
  movs r0, #1
  ldr r1, [r5, #24]
  lsls r0, r0, #9
  bics r4, r0
  .inst.n 0x1e76 @ subs r6, r6, #1
  ldr r0, [sp, #16]
  .inst.n 0x1c7f @ adds r7, r7, #1
  blx r1
  str r0, [sp, #0]
  movs r0, #16
  b.n .L_func_00100E14_bc
.L_func_00100E14_b6:
  movs r0, #8
  b.n .L_func_00100E14_bc
.L_func_00100E14_ba:
  movs r0, #10
.L_func_00100E14_bc:
  str r0, [sp, #20]
  b.n .L_func_00100E14_dc
.L_func_00100E14_c0:
  movs r1, #1
  ldr r2, [sp, #20]
  lsls r1, r1, #9
  orrs r4, r1
  ldr r1, [sp, #4]
  .inst.n 0x1e76 @ subs r6, r6, #1
  muls r1, r2
  adds r0, r1, r0
  str r0, [sp, #4]
  ldr r1, [r5, #24]
  ldr r0, [sp, #16]
  .inst.n 0x1c7f @ adds r7, r7, #1
  blx r1
  str r0, [sp, #0]
.L_func_00100E14_dc:
  cmp r6, #0
  ble.n .L_func_00100E14_ec
  ldr r1, [sp, #20]
  ldr r0, [sp, #0]
  bl func_002FEDD0
  cmp r0, #0
  bge.n .L_func_00100E14_c0
.L_func_00100E14_ec:
  ldr r1, [r5, #28]
  ldr r0, [sp, #16]
  blx r1
  lsls r0, r4, #22
  bmi.n .L_func_00100E14_fc
  movs r0, #1
  mvns r0, r0
  b.n .L_func_00100E14_48
.L_func_00100E14_fc:
  lsls r0, r4, #31
  bne.n .L_func_00100E14_146
  lsls r0, r4, #25
  bpl.n .L_func_00100E14_128
  lsls r0, r4, #21
  ldr r0, [sp, #4]
  bpl.n .L_func_00100E14_10c
  negs r0, r0
.L_func_00100E14_10c:
  ldr r1, [r5, #0]
  .inst.n 0x1d0a @ adds r2, r1, #4
  str r2, [r5, #0]
  ldr r1, [r1, #0]
  lsls r2, r4, #20
  bpl.n .L_func_00100E14_11c
  strb r0, [r1, #0]
  b.n .L_func_00100E14_146
.L_func_00100E14_11c:
  lsls r2, r4, #28
  bpl.n .L_func_00100E14_124
  strh r0, [r1, #0]
  b.n .L_func_00100E14_146
.L_func_00100E14_124:
  str r0, [r1, #0]
  b.n .L_func_00100E14_146
.L_func_00100E14_128:
  ldr r0, [r5, #0]
  .inst.n 0x1d01 @ adds r1, r0, #4
  str r1, [r5, #0]
  ldr r0, [r0, #0]
  lsls r1, r4, #20
  bpl.n .L_func_00100E14_13a
  ldr r1, [sp, #4]
  strb r1, [r0, #0]
  b.n .L_func_00100E14_146
.L_func_00100E14_13a:
  lsls r1, r4, #28
  ldr r1, [sp, #4]
  bpl.n .L_func_00100E14_144
  strh r1, [r0, #0]
  b.n .L_func_00100E14_146
.L_func_00100E14_144:
  str r1, [r0, #0]
.L_func_00100E14_146:
  movs r0, r7
  b.n .L_func_00100E14_48
.size func_00100E14, .-func_00100E14

.section .text.func_00102590, "ax", %progbits
.balign 2
.global func_00102590
.type func_00102590, %function
.thumb_func
func_00102590:
  push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
  sub sp, #20
  movs r4, r1
  movs r5, r0
  ldr r0, [r0, #0]
  ldr r6, [sp, #56]
  subs r0, #12
  ldr r0, [r0, #8]
  cmp r0, r4
  bcc.n .L_func_00102590_1a
  ldr r1, [sp, #60]
  cmp r1, r6
  bls.n .L_func_00102590_3a
.L_func_00102590_1a:
  cmp r0, r6
  bls.n .L_func_00102590_22
  movs r1, r0
  b.n .L_func_00102590_24
.L_func_00102590_22:
  movs r1, r6
.L_func_00102590_24:
  cmp r0, r4
  bcs.n .L_func_00102590_2c
  movs r3, r4
  b.n .L_func_00102590_2e
.L_func_00102590_2c:
  ldr r3, [sp, #60]
.L_func_00102590_2e:
  str r1, [sp, #0]
  movs r0, #9
  .inst.n 0xa250 @ add r2, pc, #320
  .inst.n 0xa14f @ add r1, pc, #316
  bl func_00300ABC
.L_func_00102590_3a:
  ldr r0, [r5, #0]
  ldr r1, [sp, #28]
  subs r0, #12
  ldr r0, [r0, #8]
  subs r7, r0, r4
  cmp r1, r7
  bcs.n .L_func_00102590_4a
  movs r7, r1
.L_func_00102590_4a:
  ldr r1, [sp, #60]
  subs r6, r6, r1
  ldr r1, [sp, #64]
  cmp r1, r6
  bcs.n .L_func_00102590_56
  movs r6, r1
.L_func_00102590_56:
  subs r3, r0, r7
  movs r0, #14
  mvns r0, r0
  subs r0, r0, r6
  cmp r3, r0
  bls.n .L_func_00102590_6e
  str r0, [sp, #0]
  movs r0, #8
  .inst.n 0xa243 @ add r2, pc, #268
  .inst.n 0xa142 @ add r1, pc, #264
  bl func_00300ABC
.L_func_00102590_6e:
  ldr r0, [r5, #0]
  movs r1, r0
  subs r1, #12
  mov lr, r1
  ldr r1, [r1, #8]
  mov ip, r1
  subs r1, r1, r7
  adds r7, r1, r6
  beq.n .L_func_00102590_12a
  subs r1, r1, r4
  str r1, [sp, #8]
  ldr r2, [sp, #28]
  mov r1, lr
  ldr r1, [r1, #0]
  adds r2, r4, r2
  str r2, [sp, #12]
  ldr r3, [sp, #32]
  ldr r2, [sp, #60]
  .inst.n 0x1c49 @ adds r1, r1, #1
  adds r2, r3, r2
  cmp r1, #1
  str r2, [sp, #16]
  bhi.n .L_func_00102590_b4
  mov r1, lr
  ldr r1, [r1, #4]
  cmp r1, r7
  bcc.n .L_func_00102590_b4
  cmp r3, #0
  beq.n .L_func_00102590_136
  cmp r0, r3
  bhi.n .L_func_00102590_136
  mov r1, ip
  adds r2, r0, r1
  cmp r2, r3
  bls.n .L_func_00102590_136
.L_func_00102590_b4:
  mov r0, ip
  lsrs r1, r0, #1
  adds r1, r1, r0
  lsrs r2, r0, #3
  adds r1, r1, r2
  adds r0, #128
  cmp r0, r1
  bls.n .L_func_00102590_c6
  movs r1, r0
.L_func_00102590_c6:
  str r1, [sp, #0]
  ldr r2, [sp, #0]
  mov r1, sp
  cmp r2, r7
  add r0, sp, #4
  str r7, [sp, #4]
  bcc.n .L_func_00102590_d6
  movs r0, r1
.L_func_00102590_d6:
  ldr r1, [r0, #0]
  movs r2, r7
  movs r0, r5
  bl func_002FFB14
  movs r7, r0
  cmp r4, #0
  beq.n .L_func_00102590_f2
  movs r0, r7
  ldr r1, [r5, #0]
  adds r0, #12
  movs r2, r4
  bl func_002FFAF4
.L_func_00102590_f2:
  cmp r6, #0
  beq.n .L_func_00102590_104
  movs r0, r7
  adds r0, #12
  ldr r1, [sp, #16]
  adds r0, r0, r4
  movs r2, r6
  bl func_002FFAF4
.L_func_00102590_104:
  ldr r0, [sp, #8]
  cmp r0, #0
  beq.n .L_func_00102590_11e
  ldr r2, [r5, #0]
  ldr r1, [sp, #12]
  movs r0, r7
  adds r0, #12
  adds r0, r0, r4
  adds r1, r2, r1
  ldr r2, [sp, #8]
  adds r0, r0, r6
  bl func_002FFAF4
.L_func_00102590_11e:
  movs r0, r5
  bl func_00300A00
  adds r7, #12
  str r7, [r5, #0]
  b.n .L_func_00102590_16c
.L_func_00102590_12a:
  movs r0, r5
  bl func_00300A00
  .inst.n 0x4811 @ ldr r0, [pc, #68]
  str r0, [r5, #0]
  b.n .L_func_00102590_16c
.L_func_00102590_136:
  ldr r1, [sp, #8]
  cmp r1, #0
  beq.n .L_func_00102590_14a
  ldr r1, [sp, #12]
  adds r2, r4, r6
  adds r1, r0, r1
  adds r0, r0, r2
  ldr r2, [sp, #8]
  bl func_00301026
.L_func_00102590_14a:
  cmp r6, #0
  beq.n .L_func_00102590_15a
  ldr r0, [r5, #0]
  ldr r1, [sp, #16]
  adds r0, r0, r4
  movs r2, r6
  bl func_00301026
.L_func_00102590_15a:
  ldr r0, [r5, #0]
  mov r2, sp
  subs r0, #12
  str r7, [r0, #8]
  ldr r0, [r5, #0]
  adds r1, r7, r0
  movs r0, #0
  strb r0, [r2, #0]
  strb r0, [r1, #0]
.L_func_00102590_16c:
  ldr r0, [r5, #0]
  add sp, #36
  adds r0, r0, r4
  pop {r4, r5, r6, r7, pc}
.size func_00102590, .-func_00102590

.section .text.func_0030291C, "ax", %progbits
.balign 2
.global func_0030291C
.type func_0030291C, %function
.thumb_func
func_0030291C:
  push {r3, r4, r5, r6, r7, lr}
  movs r5, r0
  ldr r0, [r1, #12]
  movs r4, r1
  movs r1, #5
  lsls r1, r1, #19
  bics r0, r1
  movs r1, #1
  lsls r1, r1, #22
  orrs r0, r1
  str r0, [r4, #12]
  lsls r0, r0, #26
  bpl.n .L_func_0030291C_20
  movs r0, r4
  bl func_00301DC8
.L_func_0030291C_20:
  .inst.n 0x4972 @ ldr r1, [pc, #456]
  ldr r0, [r4, #12]
  ands r1, r0
  cmp r1, #2
  beq.n .L_func_0030291C_32
  movs r0, r4
  bl func_00301D1C
  b.n .L_func_0030291C_1b2
.L_func_0030291C_32:
  movs r1, #5
  movs r2, #1
  lsls r1, r1, #13
  ands r1, r0
  lsls r2, r2, #15
  cmp r1, r2
  bne.n .L_func_0030291C_60
  lsls r0, r0, #15
  bpl.n .L_func_0030291C_52
  ldr r1, [r4, #4]
  ldr r0, [r4, #44]
  cmp r0, r1
  bhi.n .L_func_0030291C_4e
  movs r0, r1
.L_func_0030291C_4e:
  str r0, [r4, #4]
  b.n .L_func_0030291C_60
.L_func_0030291C_52:
  ldr r0, [r4, #16]
  str r0, [r4, #44]
  str r0, [r4, #4]
  ldr r0, [r4, #20]
  blx func_003022C0
  str r0, [r4, #24]
.L_func_0030291C_60:
  ldr r1, [r4, #8]
  lsls r6, r5, #24
  movs r2, #0
  lsrs r6, r6, #24
  cmp r1, #0
  bge.n .L_func_0030291C_8a
  ldr r0, [r4, #12]
  lsls r3, r0, #22
  bmi.n .L_func_0030291C_8a
  mvns r1, r1
  str r1, [r4, #8]
  movs r1, #9
  str r2, [r4, #0]
  lsls r1, r1, #13
  orrs r0, r1
  str r0, [r4, #12]
  ldr r0, [r4, #4]
  .inst.n 0x1c41 @ adds r1, r0, #1
  str r1, [r4, #4]
  strb r6, [r0, #0]
  b.n .L_func_0030291C_1e8
.L_func_0030291C_8a:
  ldr r0, [r4, #12]
  movs r1, #1
  lsls r1, r1, #13
  orrs r0, r1
  str r0, [r4, #12]
  movs r0, #0
  str r0, [r4, #0]
  ldr r0, [r4, #16]
  cmp r0, #0
  bne.n .L_func_0030291C_106
  ldr r0, [r4, #20]
  blx func_00302274
  movs r5, r4
  adds r5, #36
  movs r7, #1
  cmp r0, #0
  beq.n .L_func_0030291C_de
  ldr r0, [r4, #12]
  lsls r0, r0, #22
  lsrs r0, r0, #30
  beq.n .L_func_0030291C_cc
  ldr r0, [r4, #28]
  blx func_002FECF8
  cmp r0, #0
  str r0, [r4, #16]
  beq.n .L_func_0030291C_cc
  ldr r1, [r4, #12]
  lsls r0, r7, #11
  orrs r1, r0
  str r1, [r4, #12]
  b.n .L_func_0030291C_102
.L_func_0030291C_cc:
  str r7, [r4, #28]
  str r5, [r4, #16]
  ldr r0, [r4, #12]
  movs r1, #3
  lsls r1, r1, #8
  bics r0, r1
  movs r1, #1
  lsls r1, r1, #10
  b.n .L_func_0030291C_fe
.L_func_0030291C_de:
  ldr r0, [r4, #28]
  blx func_002FECF8
  cmp r0, #0
  str r0, [r4, #16]
  beq.n .L_func_0030291C_cc
  ldr r0, [r4, #12]
  movs r1, #1
  lsls r1, r1, #11
  orrs r0, r1
  str r0, [r4, #12]
  lsls r1, r0, #22
  lsrs r1, r1, #30
  bne.n .L_func_0030291C_102
  movs r1, #255
  adds r1, #1
.L_func_0030291C_fe:
  orrs r0, r1
  str r0, [r4, #12]
.L_func_0030291C_102:
  ldr r0, [r4, #16]
  str r0, [r4, #4]
.L_func_0030291C_106:
  ldr r2, [r4, #12]
  .inst.n 0x4f39 @ ldr r7, [pc, #228]
  ldr r5, [r4, #16]
  lsls r0, r2, #23
  bpl.n .L_func_0030291C_150
  ldr r1, [r4, #4]
  ldr r0, [r4, #44]
  cmp r0, r1
  bhi.n .L_func_0030291C_11a
  movs r0, r1
.L_func_0030291C_11a:
  subs r1, r0, r5
  beq.n .L_func_0030291C_12a
  movs r2, r4
  movs r0, r5
  bl func_00301D30
  cmp r0, #0
  bne.n .L_func_0030291C_1b2
.L_func_0030291C_12a:
  ldr r0, [r4, #12]
  lsls r1, r0, #8
  bpl.n .L_func_0030291C_13a
  str r5, [r4, #44]
  movs r0, #0
  str r5, [r4, #4]
  str r0, [r4, #8]
  b.n .L_func_0030291C_1e2
.L_func_0030291C_13a:
  .inst.n 0x1c69 @ adds r1, r5, #1
  str r1, [r4, #44]
  str r1, [r4, #4]
  ldr r1, [r4, #28]
  orrs r0, r7
  .inst.n 0x1e49 @ subs r1, r1, #1
  str r1, [r4, #8]
  str r0, [r4, #12]
  movs r0, r6
  strb r6, [r5, #0]
  pop {r3, r4, r5, r6, r7, pc}
.L_func_0030291C_150:
  lsls r0, r2, #8
  bpl.n .L_func_0030291C_158
  ands r2, r7
  b.n .L_func_0030291C_16c
.L_func_0030291C_158:
  ldr r0, [r4, #4]
  .inst.n 0x1c41 @ adds r1, r0, #1
  str r1, [r4, #4]
  strb r6, [r0, #0]
  ldr r0, [r4, #12]
  orrs r0, r7
  cmp r6, #10
  str r0, [r4, #12]
  beq.n .L_func_0030291C_178
  movs r2, #0
.L_func_0030291C_16c:
  ldr r1, [r4, #44]
  ldr r0, [r4, #4]
  cmp r1, r0
  bls.n .L_func_0030291C_17c
  movs r3, r1
  b.n .L_func_0030291C_17e
.L_func_0030291C_178:
  movs r2, #1
  b.n .L_func_0030291C_16c
.L_func_0030291C_17c:
  movs r3, r0
.L_func_0030291C_17e:
  ldr r7, [r4, #12]
  subs r3, r3, r5
  lsls r7, r7, #21
  bmi.n .L_func_0030291C_190
  ldr r7, [r4, #28]
  cmp r7, r3
  ble.n .L_func_0030291C_190
  cmp r2, #0
  beq.n .L_func_0030291C_1ce
.L_func_0030291C_190:
  cmp r1, r0
  bhi.n .L_func_0030291C_196
  movs r1, r0
.L_func_0030291C_196:
  subs r7, r1, r0
  movs r0, #0
  str r5, [r4, #44]
  str r5, [r4, #4]
  cmp r3, #0
  str r0, [r4, #8]
  ble.n .L_func_0030291C_1b8
  movs r2, r4
  movs r1, r3
  movs r0, r5
  bl func_00301D30
  cmp r0, #0
  beq.n .L_func_0030291C_1b8
.L_func_0030291C_1b2:
  movs r0, #0
  mvns r0, r0
  pop {r3, r4, r5, r6, r7, pc}
.L_func_0030291C_1b8:
  cmp r7, #0
  beq.n .L_func_0030291C_1ce
  ldr r0, [r4, #24]
  str r5, [r4, #44]
  str r5, [r4, #4]
  subs r0, r0, r7
  str r0, [r4, #24]
  ldr r0, [r4, #12]
  movs r1, #16
  orrs r0, r1
  str r0, [r4, #12]
.L_func_0030291C_1ce:
  ldr r0, [r4, #12]
  lsls r0, r0, #8
  bpl.n .L_func_0030291C_1e8
  ldr r1, [r4, #4]
  ldr r0, [r4, #24]
  str r5, [r4, #44]
  subs r1, r1, r5
  adds r0, r0, r1
  str r5, [r4, #4]
  str r0, [r4, #24]
.L_func_0030291C_1e2:
  movs r0, #1
  mvns r0, r0
  pop {r3, r4, r5, r6, r7, pc}
.L_func_0030291C_1e8:
  movs r0, r6
  pop {r3, r4, r5, r6, r7, pc}
.size func_0030291C, .-func_0030291C

.section .text.func_0010145C, "ax", %progbits
.balign 2
.global func_0010145C
.type func_0010145C, %function
.thumb_func
func_0010145C:
  push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
  movs r6, r0
  sub sp, #44
  ldrb r0, [r1, #0]
  cmp r0, #255
  beq.n .L_func_0010145C_18
  .inst.n 0x1c49 @ adds r1, r1, #1
  cmp r0, #45
  beq.n .L_func_0010145C_1c
  movs r3, #0
.L_func_0010145C_14:
  movs r0, #0
  b.n .L_func_0010145C_2a
.L_func_0010145C_18:
  movs r0, #0
  b.n .L_func_0010145C_3a
.L_func_0010145C_1c:
  movs r3, #1
  b.n .L_func_0010145C_14
.L_func_0010145C_20:
  ldr r2, [sp, #0]
  movs r4, #10
  .inst.n 0x1c49 @ adds r1, r1, #1
  muls r2, r4
  adds r0, r0, r2
.L_func_0010145C_2a:
  str r0, [sp, #0]
  ldrb r0, [r1, #0]
  cmp r0, #255
  bne.n .L_func_0010145C_20
  cmp r3, #0
  beq.n .L_func_0010145C_3c
  ldr r0, [sp, #0]
  negs r0, r0
.L_func_0010145C_3a:
  str r0, [sp, #0]
.L_func_0010145C_3c:
  movs r5, #0
  str r5, [sp, #12]
  ldr r0, [sp, #52]
  movs r4, r5
  ldrb r0, [r0, #0]
  cmp r0, #45
  beq.n .L_func_0010145C_4e
  cmp r0, #43
  bne.n .L_func_0010145C_7c
.L_func_0010145C_4e:
  ldr r1, [sp, #52]
  .inst.n 0x1c49 @ adds r1, r1, #1
  cmp r0, #45
  str r1, [sp, #52]
  beq.n .L_func_0010145C_5e
  movs r0, #0
.L_func_0010145C_5a:
  str r0, [sp, #12]
  b.n .L_func_0010145C_7c
.L_func_0010145C_5e:
  movs r0, #1
  b.n .L_func_0010145C_5a
.L_func_0010145C_62:
  .inst.n 0x1c40 @ adds r0, r0, #1
  movs r2, #0
  str r2, [sp, #4]
  str r0, [sp, #52]
  movs r0, r5
  movs r1, r4
  movs r2, #10
  movs r3, #0
  blx func_002FFBE0
  ldr r4, [sp, #4]
  adds r5, r7, r0
  adcs r4, r1
.L_func_0010145C_7c:
  ldr r0, [sp, #52]
  ldrb r7, [r0, #0]
  cmp r7, #255
  bne.n .L_func_0010145C_62
  movs r1, #0
  movs r0, r1
  blx func_002FF110
  ldr r1, [sp, #12]
  cmp r1, #0
  beq.n .L_func_0010145C_98
  lsls r1, r0, #2
  adds r0, r0, r1
  lsrs r0, r0, #1
.L_func_0010145C_98:
  lsls r0, r0, #8
  lsrs r0, r0, #30
  cmp r0, #1
  str r0, [sp, #16]
  ble.n .L_func_0010145C_a8
  movs r0, #0
  mvns r0, r0
  str r0, [sp, #16]
.L_func_0010145C_a8:
  ldr r1, [sp, #56]
  ldr r0, [sp, #0]
  adds r7, r0, r1
  movs r0, r5
  orrs r0, r4
  bne.n .L_func_0010145C_c2
  ldr r0, [sp, #12]
  lsls r0, r0, #31
  str r0, [r6, #4]
  movs r0, #0
  str r0, [r6, #0]
.L_func_0010145C_be:
  add sp, #60
  pop {r4, r5, r6, r7, pc}
.L_func_0010145C_c2:
  .inst.n 0x48fa @ ldr r0, [pc, #1000]
  cmp r7, r0
  bge.n .L_func_0010145C_d4
  ldr r0, [sp, #12]
  lsls r0, r0, #31
  str r0, [r6, #4]
  movs r0, #0
  str r0, [r6, #0]
  b.n .L_func_0010145C_f0
.L_func_0010145C_d4:
  movs r0, #255
  adds r0, #245
  cmp r7, r0
  ble.n .L_func_0010145C_fa
  .inst.n 0x48f4 @ ldr r0, [pc, #976]
  add r0, pc
  ldr r1, [r0, #0]
  ldr r0, [r0, #4]
  str r1, [r6, #0]
  str r0, [r6, #4]
  ldr r1, [sp, #12]
  lsls r1, r1, #31
  orrs r0, r1
  str r0, [r6, #4]
.L_func_0010145C_f0:
  blx func_002FED78
  movs r1, #2
  str r1, [r0, #0]
  b.n .L_func_0010145C_be
.L_func_0010145C_fa:
  .inst.n 0x1e39 @ subs r1, r7, #0
  bge.n .L_func_0010145C_104
  ldr r0, [sp, #16]
  negs r2, r0
  b.n .L_func_0010145C_106
.L_func_0010145C_104:
  ldr r2, [sp, #16]
.L_func_0010145C_106:
  cmp r1, #0
  bge.n .L_func_0010145C_10c
  negs r1, r7
.L_func_0010145C_10c:
  add r0, sp, #32
  bl func_002FF118
  add r0, sp, #32
  add r3, sp, #20
  ldmia r0, {r0, r1, r2}
  stmia r3!, {r0, r1, r2}
  .inst.n 0x48e6 @ ldr r0, [pc, #920]
  str r0, [sp, #0]
  movs r0, #0
  movs r1, r0
  orrs r1, r4
  bne.n .L_func_0010145C_130
  .inst.n 0x49e3 @ ldr r1, [pc, #908]
  movs r4, r5
  movs r5, r0
  subs r1, #32
  str r1, [sp, #0]
.L_func_0010145C_130:
  lsrs r1, r4, #16
  lsls r1, r1, #16
  orrs r1, r0
  bne.n .L_func_0010145C_146
  lsrs r1, r5, #16
  lsls r4, r4, #16
  orrs r4, r1
  ldr r1, [sp, #0]
  lsls r5, r5, #16
  subs r1, #16
  str r1, [sp, #0]
.L_func_0010145C_146:
  lsrs r1, r4, #24
  lsls r1, r1, #24
  orrs r1, r0
  bne.n .L_func_0010145C_15c
  lsrs r1, r5, #24
  lsls r4, r4, #8
  orrs r4, r1
  ldr r1, [sp, #0]
  lsls r5, r5, #8
  subs r1, #8
  str r1, [sp, #0]
.L_func_0010145C_15c:
  lsrs r1, r4, #28
  lsls r1, r1, #28
  orrs r1, r0
  bne.n .L_func_0010145C_172
  lsrs r1, r5, #28
  lsls r4, r4, #4
  orrs r4, r1
  ldr r1, [sp, #0]
  lsls r5, r5, #4
  .inst.n 0x1f09 @ subs r1, r1, #4
  str r1, [sp, #0]
.L_func_0010145C_172:
  lsrs r1, r4, #30
  lsls r1, r1, #30
  orrs r1, r0
  bne.n .L_func_0010145C_188
  lsrs r1, r5, #30
  lsls r4, r4, #2
  orrs r4, r1
  ldr r1, [sp, #0]
  lsls r5, r5, #2
  .inst.n 0x1e89 @ subs r1, r1, #2
  str r1, [sp, #0]
.L_func_0010145C_188:
  lsrs r1, r4, #31
  lsls r1, r1, #31
  orrs r0, r1
  bne.n .L_func_0010145C_19a
  ldr r0, [sp, #0]
  adds r5, r5, r5
  adcs r4, r4
  .inst.n 0x1e40 @ subs r0, r0, #1
  str r0, [sp, #0]
.L_func_0010145C_19a:
  mov r0, sp
  ldr r2, [sp, #16]
  cmp r7, #0
  add r1, sp, #20
  str r5, [sp, #8]
  str r4, [sp, #4]
  ble.n .L_func_0010145C_1ae
  blx func_001955C0
  b.n .L_func_0010145C_1b2
.L_func_0010145C_1ae:
  blx func_00195590
.L_func_0010145C_1b2:
  movs r4, r0
  ldr r0, [sp, #12]
  movs r5, r1
  cmp r0, #0
  beq.n .L_func_0010145C_1c2
  movs r0, #1
  lsls r0, r0, #31
  eors r4, r0
.L_func_0010145C_1c2:
  .inst.n 0x4fbd @ ldr r7, [pc, #756]
  lsls r0, r4, #1
  lsrs r0, r0, #1
  orrs r0, r5
  beq.n .L_func_0010145C_1d4
  lsls r0, r4, #1
  lsrs r0, r0, #21
  cmp r0, r7
  bne.n .L_func_0010145C_1f8
.L_func_0010145C_1d4:
  blx func_002FED78
  movs r1, #2
  str r1, [r0, #0]
  lsls r0, r4, #1
  lsrs r0, r0, #21
  cmp r0, r7
  bne.n .L_func_0010145C_1f8
  .inst.n 0x48b5 @ ldr r0, [pc, #724]
  add r0, pc
  ldr r1, [r0, #0]
  ldr r0, [r0, #4]
  str r1, [r6, #0]
  lsrs r1, r4, #31
  lsls r1, r1, #31
  orrs r0, r1
  str r0, [r6, #4]
  b.n .L_func_0010145C_be
.L_func_0010145C_1f8:
  str r5, [r6, #0]
  str r4, [r6, #4]
  b.n .L_func_0010145C_be
.size func_0010145C, .-func_0010145C

.section .text.func_00102B04, "ax", %progbits
.balign 2
.global func_00102B04
.type func_00102B04, %function
.thumb_func
func_00102B04:
  push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
  movs r4, r1
  sub sp, #268
  movs r6, r2
  movs r1, #1
  str r1, [sp, #260]
  str r4, [sp, #128]
  str r0, [sp, #0]
.L_func_00102B04_10:
  mov r2, sp
  ldr r0, [sp, #260]
  .inst.n 0x1e41 @ subs r1, r0, #1
  str r1, [sp, #260]
  lsls r1, r0, #2
  .inst.n 0x1f09 @ subs r1, r1, #4
  lsls r0, r0, #2
  ldr r5, [r2, r1]
  .inst.n 0x1f00 @ subs r0, r0, #4
  add r1, sp, #128
  ldr r0, [r1, r0]
  str r0, [sp, #264]
.L_func_00102B04_28:
  asrs r0, r0, #1
  ldr r1, [sp, #264]
  muls r0, r6
  adds r4, r5, r0
  lsls r1, r1, #31
  bne.n .L_func_00102B04_36
  subs r0, r0, r6
.L_func_00102B04_36:
  ldr r2, [sp, #280]
  adds r7, r4, r0
  movs r1, r4
  movs r0, r5
  blx r2
  cmp r0, #0
  ble.n .L_func_00102B04_62
  movs r0, r6
  movs r1, r0
  orrs r1, r5
  lsls r1, r1, #30
  beq.n .L_func_00102B04_118
.L_func_00102B04_4e:
  ldrb r2, [r4, #0]
  ldrb r1, [r5, #0]
  strb r2, [r5, #0]
  strb r1, [r4, #0]
  .inst.n 0x1c6d @ adds r5, r5, #1
  .inst.n 0x1c64 @ adds r4, r4, #1
  .inst.n 0x1e40 @ subs r0, r0, #1
  bne.n .L_func_00102B04_4e
.L_func_00102B04_5e:
  subs r5, r5, r6
  subs r4, r4, r6
.L_func_00102B04_62:
  ldr r2, [sp, #280]
  movs r1, r7
  movs r0, r4
  blx r2
  cmp r0, #0
  ble.n .L_func_00102B04_b6
  ldr r2, [sp, #280]
  movs r1, r7
  movs r0, r5
  blx r2
  cmp r0, #0
  ble.n .L_func_00102B04_98
  movs r0, r6
  movs r1, r0
  orrs r1, r5
  lsls r1, r1, #30
  beq.n .L_func_00102B04_126
.L_func_00102B04_84:
  ldrb r2, [r7, #0]
  ldrb r1, [r5, #0]
  strb r2, [r5, #0]
  strb r1, [r7, #0]
  .inst.n 0x1c6d @ adds r5, r5, #1
  .inst.n 0x1c7f @ adds r7, r7, #1
  .inst.n 0x1e40 @ subs r0, r0, #1
  bne.n .L_func_00102B04_84
.L_func_00102B04_94:
  subs r5, r5, r6
  subs r7, r7, r6
.L_func_00102B04_98:
  movs r0, r6
  movs r1, r0
  orrs r1, r4
  lsls r1, r1, #30
  beq.n .L_func_00102B04_134
.L_func_00102B04_a2:
  ldrb r2, [r7, #0]
  ldrb r1, [r4, #0]
  strb r2, [r4, #0]
  strb r1, [r7, #0]
  .inst.n 0x1c64 @ adds r4, r4, #1
  .inst.n 0x1c7f @ adds r7, r7, #1
  .inst.n 0x1e40 @ subs r0, r0, #1
  bne.n .L_func_00102B04_a2
.L_func_00102B04_b2:
  subs r4, r4, r6
  subs r7, r7, r6
.L_func_00102B04_b6:
  movs r1, r6
  movs r2, r1
  orrs r2, r4
  subs r0, r7, r6
  lsls r2, r2, #30
  beq.n .L_func_00102B04_142
.L_func_00102B04_c2:
  ldrb r3, [r0, #0]
  ldrb r2, [r4, #0]
  strb r3, [r4, #0]
  strb r2, [r0, #0]
  .inst.n 0x1c64 @ adds r4, r4, #1
  .inst.n 0x1c40 @ adds r0, r0, #1
  .inst.n 0x1e49 @ subs r1, r1, #1
  bne.n .L_func_00102B04_c2
.L_func_00102B04_d2:
  subs r7, r0, r6
  movs r4, r5
  str r7, [sp, #256]
.L_func_00102B04_d8:
  ldr r2, [sp, #280]
  adds r4, r4, r6
  ldr r1, [sp, #256]
  movs r0, r4
  blx r2
  cmp r0, #0
  blt.n .L_func_00102B04_d8
.L_func_00102B04_e6:
  ldr r2, [sp, #280]
  subs r7, r7, r6
  ldr r1, [sp, #256]
  movs r0, r7
  blx r2
  cmp r0, #0
  bgt.n .L_func_00102B04_e6
  cmp r7, r4
  bls.n .L_func_00102B04_15e
  movs r0, r6
  movs r1, r0
  orrs r1, r4
  lsls r1, r1, #30
  beq.n .L_func_00102B04_150
.L_func_00102B04_102:
  ldrb r2, [r7, #0]
  ldrb r1, [r4, #0]
  strb r2, [r4, #0]
  strb r1, [r7, #0]
  .inst.n 0x1c64 @ adds r4, r4, #1
  .inst.n 0x1c7f @ adds r7, r7, #1
  .inst.n 0x1e40 @ subs r0, r0, #1
  bne.n .L_func_00102B04_102
.L_func_00102B04_112:
  subs r4, r4, r6
  subs r7, r7, r6
  b.n .L_func_00102B04_d8
.L_func_00102B04_118:
  ldr r2, [r4, #0]
  ldr r1, [r5, #0]
  .inst.n 0x1f00 @ subs r0, r0, #4
  stmia r5!, {r2}
  stmia r4!, {r1}
  bne.n .L_func_00102B04_118
  b.n .L_func_00102B04_5e
.L_func_00102B04_126:
  ldr r2, [r7, #0]
  ldr r1, [r5, #0]
  .inst.n 0x1f00 @ subs r0, r0, #4
  stmia r5!, {r2}
  stmia r7!, {r1}
  bne.n .L_func_00102B04_126
  b.n .L_func_00102B04_94
.L_func_00102B04_134:
  ldr r2, [r7, #0]
  ldr r1, [r4, #0]
  .inst.n 0x1f00 @ subs r0, r0, #4
  stmia r4!, {r2}
  stmia r7!, {r1}
  bne.n .L_func_00102B04_134
  b.n .L_func_00102B04_b2
.L_func_00102B04_142:
  ldr r3, [r0, #0]
  ldr r2, [r4, #0]
  .inst.n 0x1f09 @ subs r1, r1, #4
  stmia r4!, {r3}
  stmia r0!, {r2}
  bne.n .L_func_00102B04_142
  b.n .L_func_00102B04_d2
.L_func_00102B04_150:
  ldr r2, [r7, #0]
  ldr r1, [r4, #0]
  .inst.n 0x1f00 @ subs r0, r0, #4
  stmia r4!, {r2}
  stmia r7!, {r1}
  bne.n .L_func_00102B04_150
  b.n .L_func_00102B04_112
.L_func_00102B04_15e:
  movs r0, r6
  movs r1, r0
  orrs r1, r4
  lsls r1, r1, #30
  beq.n .L_func_00102B04_1ae
.L_func_00102B04_168:
  ldr r2, [sp, #256]
  ldrb r1, [r4, #0]
  ldrb r2, [r2, #0]
  strb r2, [r4, #0]
  ldr r2, [sp, #256]
  .inst.n 0x1c64 @ adds r4, r4, #1
  strb r1, [r2, #0]
  ldr r1, [sp, #256]
  .inst.n 0x1c49 @ adds r1, r1, #1
  .inst.n 0x1e40 @ subs r0, r0, #1
  str r1, [sp, #256]
  bne.n .L_func_00102B04_168
.L_func_00102B04_180:
  subs r4, r4, r6
  subs r0, r4, r5
  movs r1, r6
  blx func_0015EC10
  ldr r1, [sp, #264]
  .inst.n 0x1e40 @ subs r0, r0, #1
  subs r1, r1, r0
  .inst.n 0x1e49 @ subs r1, r1, #1
  cmp r0, r1
  ble.n .L_func_00102B04_1ce
  cmp r1, #10
  ble.n .L_func_00102B04_1c6
  mov r3, sp
  ldr r2, [sp, #260]
  lsls r2, r2, #2
  str r5, [r3, r2]
  add r3, sp, #128
  str r0, [r3, r2]
  ldr r0, [sp, #260]
  .inst.n 0x1c40 @ adds r0, r0, #1
  str r0, [sp, #260]
  b.n .L_func_00102B04_1ea
.L_func_00102B04_1ae:
  ldr r2, [sp, #256]
  ldr r1, [r4, #0]
  ldr r2, [r2, #0]
  stmia r4!, {r2}
  ldr r2, [sp, #256]
  str r1, [r2, #0]
  ldr r1, [sp, #256]
  .inst.n 0x1d09 @ adds r1, r1, #4
  .inst.n 0x1f00 @ subs r0, r0, #4
  str r1, [sp, #256]
  bne.n .L_func_00102B04_1ae
  b.n .L_func_00102B04_180
.L_func_00102B04_1c6:
  cmp r0, #10
  ble.n .L_func_00102B04_1f2
.L_func_00102B04_1ca:
  str r0, [sp, #264]
  b.n .L_func_00102B04_28
.L_func_00102B04_1ce:
  cmp r0, #10
  ble.n .L_func_00102B04_1e6
  mov r3, sp
  ldr r2, [sp, #260]
  lsls r2, r2, #2
  str r4, [r3, r2]
  add r3, sp, #128
  str r1, [r3, r2]
  ldr r1, [sp, #260]
  .inst.n 0x1c49 @ adds r1, r1, #1
  str r1, [sp, #260]
  b.n .L_func_00102B04_1ca
.L_func_00102B04_1e6:
  cmp r1, #10
  ble.n .L_func_00102B04_1f2
.L_func_00102B04_1ea:
  str r1, [sp, #264]
  ldr r0, [sp, #264]
  movs r5, r4
  b.n .L_func_00102B04_28
.L_func_00102B04_1f2:
  ldr r0, [sp, #260]
  cmp r0, #0
  beq.n .L_func_00102B04_1fa
  b.n .L_func_00102B04_10
.L_func_00102B04_1fa:
  add sp, #284
  pop {r4, r5, r6, r7, pc}
.size func_00102B04, .-func_00102B04
