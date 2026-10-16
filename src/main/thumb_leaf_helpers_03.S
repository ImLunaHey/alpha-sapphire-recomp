.syntax unified
.arch armv6k
.thumb

.extern func_002FEDF0
.type func_002FEDF0, %function
.extern func_00300750
.type func_00300750, %function
.extern func_00301D7C
.type func_00301D7C, %function
.extern func_002FFA44
.type func_002FFA44, %function

.section .text.func_00100096, "ax", %progbits
.p2align 1
.global func_00100096
.type func_00100096, %function
.thumb_func
func_00100096:
  push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
  movs r6, r1
  movs r4, r2
  sub sp, #4
.L_func_00100096_8:
  cmp r4, #0
  beq.n .L_func_00100096_36
  cmp r4, #1
  beq.n .L_func_00100096_2a
  ldr r0, [sp, #16]
  lsrs r5, r4, #1
  ldr r2, [sp, #40]
  muls r0, r5
  adds r7, r0, r6
  ldr r0, [sp, #4]
  movs r1, r7
  blx r2
  cmp r0, #0
  beq.n .L_func_00100096_40
  bge.n .L_func_00100096_44
  movs r4, r5
  b.n .L_func_00100096_8
.L_func_00100096_2a:
  ldr r2, [sp, #40]
  ldr r0, [sp, #4]
  movs r1, r6
  blx r2
  cmp r0, #0
  beq.n .L_func_00100096_3c
.L_func_00100096_36:
  movs r0, #0
.L_func_00100096_38:
  add sp, #20
  pop {r4, r5, r6, r7, pc}
.L_func_00100096_3c:
  movs r0, r6
  b.n .L_func_00100096_38
.L_func_00100096_40:
  movs r0, r7
  b.n .L_func_00100096_38
.L_func_00100096_44:
  ldr r0, [sp, #16]
  subs r4, r4, r5
  adds r6, r7, r0
  .inst.n 0x1e64 @ subs r4, r4, #1
  b.n .L_func_00100096_8
.size func_00100096, .-func_00100096

.section .text.func_0010018C, "ax", %progbits
.p2align 1
.global func_0010018C
.type func_0010018C, %function
.thumb_func
func_0010018C:
  push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
  sub sp, #4
  movs r4, r3
  movs r6, r1
  movs r7, r2
  cmp r1, #0
  beq.n .L_func_0010018C_1c
  ldr r5, [sp, #4]
  b.n .L_func_0010018C_18
.L_func_0010018C_12:
  movs r0, r5
  blx r6
  adds r5, r5, r7
.L_func_0010018C_18:
  .inst.n 0x1e64 @ subs r4, r4, #1
  bcs.n .L_func_0010018C_12
.L_func_0010018C_1c:
  ldr r0, [sp, #4]
  add sp, #20
  pop {r4, r5, r6, r7, pc}
.size func_0010018C, .-func_0010018C

.section .text.func_00100294, "ax", %progbits
.p2align 1
.global func_00100294
.type func_00100294, %function
.thumb_func
func_00100294:
  push {r3, r4, r5, r6, r7, lr}
  movs r5, r0
  movs r6, r1
  movs r7, r2
  cmp r3, #0
  beq.n .L_func_00100294_1c
  movs r0, r7
  muls r0, r3
  adds r4, r0, r5
.L_func_00100294_12:
  subs r4, r4, r7
  movs r0, r4
  blx r6
  cmp r5, r4
  bne.n .L_func_00100294_12
.L_func_00100294_1c:
  movs r0, r5
  subs r0, #8
  pop {r3, r4, r5, r6, r7, pc}
.size func_00100294, .-func_00100294

.section .text.func_001003CC, "ax", %progbits
.p2align 1
.global func_001003CC
.type func_001003CC, %function
.thumb_func
func_001003CC:
  movs r3, r0
.L_func_001003CC_2:
  ldrh r2, [r1, #0]
  .inst.n 0x1c89 @ adds r1, r1, #2
  strh r2, [r0, #0]
  .inst.n 0x1c80 @ adds r0, r0, #2
  cmp r2, #0
  bne.n .L_func_001003CC_2
  movs r0, r3
  bx lr
.size func_001003CC, .-func_001003CC

.section .text.func_001003E8, "ax", %progbits
.p2align 1
.global func_001003E8
.type func_001003E8, %function
.thumb_func
func_001003E8:
  movs r1, #0
  b.n .L_func_001003E8_8
.L_func_001003E8_4:
  .inst.n 0x1c49 @ adds r1, r1, #1
  .inst.n 0x1c80 @ adds r0, r0, #2
.L_func_001003E8_8:
  ldrh r2, [r0, #0]
  cmp r2, #0
  bne.n .L_func_001003E8_4
  movs r0, r1
  bx lr
.size func_001003E8, .-func_001003E8

.section .text.func_00102DEC, "ax", %progbits
.p2align 1
.global func_00102DEC
.type func_00102DEC, %function
.thumb_func
func_00102DEC:
  movs r3, r0
  b.n .L_func_00102DEC_6
.L_func_00102DEC_4:
  .inst.n 0x1c80 @ adds r0, r0, #2
.L_func_00102DEC_6:
  ldrh r2, [r0, #0]
  cmp r2, #0
  bne.n .L_func_00102DEC_4
.L_func_00102DEC_c:
  ldrh r2, [r1, #0]
  .inst.n 0x1c89 @ adds r1, r1, #2
  strh r2, [r0, #0]
  .inst.n 0x1c80 @ adds r0, r0, #2
  cmp r2, #0
  bne.n .L_func_00102DEC_c
  movs r0, r3
  bx lr
.size func_00102DEC, .-func_00102DEC

.section .text.func_00102F0C, "ax", %progbits
.p2align 1
.global func_00102F0C
.type func_00102F0C, %function
.thumb_func
func_00102F0C:
  push {r4, r5, r6, lr}
  .inst.n 0x4c06 @ ldr r4, [pc, #24]
  add r4, pc
  .inst.n 0x4d06 @ ldr r5, [pc, #24]
  add r5, pc
  b.n .L_func_00102F0C_14
.L_func_00102F0C_c:
  ldr r0, [r4, #0]
  adds r0, r0, r4
  blx r0
  .inst.n 0x1d24 @ adds r4, r4, #4
.L_func_00102F0C_14:
  cmp r4, r5
  bne.n .L_func_00102F0C_c
  pop {r4, r5, r6, pc}
.size func_00102F0C, .-func_00102F0C

.section .text.func_001048A0, "ax", %progbits
.p2align 1
.global func_001048A0
.type func_001048A0, %function
.thumb_func
func_001048A0:
  push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
  sub sp, #4
  movs r4, r3
  movs r6, r1
  movs r7, r2
  ldr r0, [sp, #40]
  cmp r0, #0
  beq.n .L_func_001048A0_24
  ldr r5, [sp, #4]
  b.n .L_func_001048A0_20
.L_func_001048A0_14:
  ldr r2, [sp, #40]
  movs r1, r6
  movs r0, r5
  blx r2
  adds r5, r5, r7
  adds r6, r6, r7
.L_func_001048A0_20:
  .inst.n 0x1e64 @ subs r4, r4, #1
  bcs.n .L_func_001048A0_14
.L_func_001048A0_24:
  ldr r0, [sp, #4]
  add sp, #20
  pop {r4, r5, r6, r7, pc}
.size func_001048A0, .-func_001048A0

.section .text.func_002FEE04, "ax", %progbits
.p2align 1
.global func_002FEE04
.type func_002FEE04, %function
.thumb_func
func_002FEE04:
  push {r4, r5, r6, lr}
  ldr r5, [r0, #24]
  movs r4, r0
  ldr r0, [r0, #0]
  lsls r1, r0, #27
  bpl.n .L_func_002FEE04_10
  movs r6, #48
  b.n .L_func_002FEE04_12
.L_func_002FEE04_10:
  movs r6, #32
.L_func_002FEE04_12:
  lsls r0, r0, #31
  beq.n .L_func_002FEE04_26
  pop {r4, r5, r6, pc}
.L_func_002FEE04_18:
  ldr r2, [r4, #4]
  ldr r1, [r4, #8]
  movs r0, r6
  blx r2
  ldr r0, [r4, #32]
  .inst.n 0x1c40 @ adds r0, r0, #1
  str r0, [r4, #32]
.L_func_002FEE04_26:
  .inst.n 0x1e6d @ subs r5, r5, #1
  bpl.n .L_func_002FEE04_18
  pop {r4, r5, r6, pc}
.size func_002FEE04, .-func_002FEE04

.section .text.func_002FEE30, "ax", %progbits
.p2align 1
.global func_002FEE30
.type func_002FEE30, %function
.thumb_func
func_002FEE30:
  push {r4, r5, r6, lr}
  ldr r5, [r0, #24]
  movs r4, r0
  ldr r0, [r0, #0]
  lsls r0, r0, #31
  bne.n .L_func_002FEE30_1c
  pop {r4, r5, r6, pc}
.L_func_002FEE30_e:
  ldr r2, [r4, #4]
  ldr r1, [r4, #8]
  movs r0, #32
  blx r2
  ldr r0, [r4, #32]
  .inst.n 0x1c40 @ adds r0, r0, #1
  str r0, [r4, #32]
.L_func_002FEE30_1c:
  .inst.n 0x1e6d @ subs r5, r5, #1
  bpl.n .L_func_002FEE30_e
  pop {r4, r5, r6, pc}
.size func_002FEE30, .-func_002FEE30

.section .text.func_002FF95C, "ax", %progbits
.p2align 1
.global func_002FF95C
.type func_002FF95C, %function
.thumb_func
func_002FF95C:
  ldr r1, [r1, #0]
  lsls r2, r1, #21
  bpl.n .L_func_002FF95C_c
  lsls r0, r0, #24
  asrs r0, r0, #24
.L_func_002FF95C_a:
  bx lr
.L_func_002FF95C_c:
  lsls r1, r1, #23
  bpl.n .L_func_002FF95C_a
  lsls r0, r0, #16
  asrs r0, r0, #16
  bx lr
.size func_002FF95C, .-func_002FF95C

.section .text.func_0030098C, "ax", %progbits
.p2align 1
.global func_0030098C
.type func_0030098C, %function
.thumb_func
func_0030098C:
  push {r4, lr}
  nop
  nop
  .inst.n 0x4901 @ ldr r1, [pc, #4]
  str r1, [r0, #0]
  pop {r4, pc}
.size func_0030098C, .-func_0030098C

.section .text.func_00302F52, "ax", %progbits
.p2align 1
.global func_00302F52
.type func_00302F52, %function
.thumb_func
func_00302F52:
  ldr r1, [r0, #0]
  cmp r1, #0
  beq.n .L_func_00302F52_a
  movs r0, #0
  bx lr
.L_func_00302F52_a:
  movs r1, #1
  str r1, [r0, #0]
  movs r0, r1
  bx lr
.size func_00302F52, .-func_00302F52

.section .text.func_00304784, "ax", %progbits
.p2align 1
.global func_00304784
.type func_00304784, %function
.thumb_func
func_00304784:
  movs r2, r0
  ldr r2, [r2, #0]
  movs r0, r1
  .inst.n 0x1d12 @ adds r2, r2, #4
  b.n .L_func_00304784_1c
.L_func_00304784_a:
  ldrb r1, [r2, #12]
  cmp r1, r0
  bls.n .L_func_00304784_14
  ldr r2, [r2, #0]
  b.n .L_func_00304784_1c
.L_func_00304784_14:
  ldrb r1, [r2, #13]
  cmp r1, r0
  bcs.n .L_func_00304784_22
  ldr r2, [r2, #4]
.L_func_00304784_1c:
  cmp r2, #0
  bne.n .L_func_00304784_a
  bx lr
.L_func_00304784_22:
  ldr r1, [r2, #8]
  cmp r1, #0
  beq.n .L_func_00304784_30
  ldrb r2, [r2, #12]
  subs r0, r0, r2
  ldrb r0, [r1, r0]
  bx lr
.L_func_00304784_30:
  ldrb r1, [r2, #14]
  adds r0, r1, r0
  lsls r0, r0, #24
  lsrs r0, r0, #24
  bx lr
.size func_00304784, .-func_00304784

.section .text.func_003048B4, "ax", %progbits
.p2align 1
.global func_003048B4
.type func_003048B4, %function
.thumb_func
func_003048B4:
  push {r4, lr}
  ldr r1, [r0, #0]
  ldr r1, [r1, #24]
  blx r1
  pop {r4, pc}
.size func_003048B4, .-func_003048B4

.section .text.func_00304C58, "ax", %progbits
.p2align 1
.global func_00304C58
.type func_00304C58, %function
.thumb_func
func_00304C58:
  push {r4, r5, r6, r7, lr}
  sub sp, #20
  add r4, sp, #40
  ldmia r4, {r4, r5, r6, r7}
  str r7, [sp, #12]
  mov r7, sp
  stmia r7!, {r4, r5, r6}
  ldr r4, [r0, #0]
  ldr r4, [r4, #12]
  blx r4
  add sp, #20
  pop {r4, r5, r6, r7, pc}
.size func_00304C58, .-func_00304C58

.section .text.func_00304DC6, "ax", %progbits
.p2align 1
.global func_00304DC6
.type func_00304DC6, %function
.thumb_func
func_00304DC6:
  push {r4, lr}
  ldr r1, [r0, #0]
  ldr r1, [r1, #28]
  blx r1
  pop {r4, pc}
.size func_00304DC6, .-func_00304DC6

.section .text.func_003054C0, "ax", %progbits
.p2align 1
.global func_003054C0
.type func_003054C0, %function
.thumb_func
func_003054C0:
  push {r4, lr}
  ldr r1, [r0, #0]
  ldr r1, [r1, #28]
  blx r1
  pop {r4, pc}
.size func_003054C0, .-func_003054C0

.section .text.func_003054DE, "ax", %progbits
.p2align 1
.global func_003054DE
.type func_003054DE, %function
.thumb_func
func_003054DE:
  push {r4, r5, r6, r7, lr}
  sub sp, #20
  add r4, sp, #40
  ldmia r4, {r4, r5, r6, r7}
  str r7, [sp, #12]
  mov r7, sp
  stmia r7!, {r4, r5, r6}
  ldr r4, [r0, #0]
  ldr r4, [r4, #12]
  blx r4
  add sp, #20
  pop {r4, r5, r6, r7, pc}
.size func_003054DE, .-func_003054DE

.section .text.func_003055E6, "ax", %progbits
.p2align 1
.global func_003055E6
.type func_003055E6, %function
.thumb_func
func_003055E6:
  push {r4, lr}
  ldr r1, [r0, #0]
  ldr r1, [r1, #24]
  blx r1
  pop {r4, pc}
.size func_003055E6, .-func_003055E6

.section .text.func_002FED38, "ax", %progbits
.p2align 1
.global func_002FED38
.type func_002FED38, %function
.thumb_func
func_002FED38:
  push {r4, r5, r6, lr}
  movs r5, r0
  movs r4, r1
  movs r6, r2
  blx func_002FEDF0
  ldr r3, [r0, #0]
  movs r0, #255
  adds r0, #2
  ldrb r0, [r0, r3]
  cmp r0, #1
  beq.n .L_func_002FED38_24
  ldrb r0, [r3, r4]
  cmp r0, #0
  beq.n .L_func_002FED38_3a
  movs r0, #1
  strh r4, [r5, #0]
  pop {r4, r5, r6, pc}
.L_func_002FED38_24:
  movs r0, #255
  adds r0, #4
  movs r2, r6
  ldr r0, [r0, r3]
  movs r1, r4
  adds r3, r3, r0
  adds r3, #255
  adds r3, #4
  movs r0, r5
  blx r3
  pop {r4, r5, r6, pc}
.L_func_002FED38_3a:
  movs r0, #0
  mvns r0, r0
  pop {r4, r5, r6, pc}
.size func_002FED38, .-func_002FED38

.section .text.func_00301DC8, "ax", %progbits
.p2align 1
.global func_00301DC8
.type func_00301DC8, %function
.thumb_func
func_00301DC8:
  push {r4, lr}
  movs r4, r0
  ldr r0, [r0, #12]
  movs r1, #32
  bics r0, r1
  str r0, [r4, #12]
  ldr r1, [r4, #40]
  ldr r0, [r4, #24]
  cmp r0, r1
  beq.n .L_func_00301DC8_32
  movs r0, r4
  bl func_00301D7C
  ldr r0, [r4, #12]
  movs r1, #3
  lsls r1, r1, #12
  bics r0, r1
  movs r1, #16
  orrs r0, r1
  str r0, [r4, #12]
  ldr r0, [r4, #40]
  str r0, [r4, #24]
  ldr r0, [r4, #16]
  str r0, [r4, #44]
  str r0, [r4, #4]
.L_func_00301DC8_32:
  .inst.n 0x4903 @ ldr r1, [pc, #12]
  ldr r0, [r4, #12]
  ands r0, r1
  str r0, [r4, #12]
  pop {r4, pc}
.size func_00301DC8, .-func_00301DC8

.section .text.func_003021CC, "ax", %progbits
.p2align 1
.global func_003021CC
.type func_003021CC, %function
.thumb_func
func_003021CC:
  push {r0, r1, r2, r3}
  movs r3, #0
  push {lr}
  sub sp, #36
  add r1, sp, #48
  str r1, [sp, #0]
  ldr r1, [sp, #44]
  str r3, [r1, #12]
  .inst.n 0x4b21 @ ldr r3, [pc, #132]
  add r3, pc
  .inst.n 0x4a21 @ ldr r2, [pc, #132]
  add r2, pc
  str r2, [sp, #28]
  movs r2, #4
  str r3, [sp, #24]
  str r2, [sp, #4]
  .inst.n 0x4a1f @ ldr r2, [pc, #124]
  str r2, [sp, #8]
  .inst.n 0x4a1f @ ldr r2, [pc, #124]
  add r2, pc
  mov r3, sp
  str r2, [sp, #32]
  movs r2, r0
  movs r0, #0
  blx func_00300750
  add sp, #36
  pop {r3}
  add sp, #16
  bx r3
.size func_003021CC, .-func_003021CC

.section .text.func_00100B8C, "ax", %progbits
.p2align 1
.global func_00100B8C
.type func_00100B8C, %function
.thumb_func
func_00100B8C:
  push {r0, r1, r2, r3}
  push {lr}
  sub sp, #52
  add r1, sp, #64
  str r0, [sp, #36]
  str r0, [sp, #44]
  movs r0, #0
  mvns r0, r0
  str r1, [sp, #0]
  str r0, [sp, #40]
  movs r0, #0
  str r0, [sp, #48]
  .inst.n 0x4807 @ ldr r0, [pc, #28]
  add r0, pc
  str r0, [sp, #24]
  .inst.n 0x4807 @ ldr r0, [pc, #28]
  add r0, pc
  mov r2, sp
  str r0, [sp, #28]
  ldr r1, [sp, #60]
  add r0, sp, #36
  bl func_002FFA44
  add sp, #52
  pop {r3}
  add sp, #16
  bx r3
.size func_00100B8C, .-func_00100B8C
