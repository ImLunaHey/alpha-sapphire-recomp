.syntax unified
.arch armv6k
.thumb

/* Authored from the neutral schedules in config/thumb-leaf-helpers-09.json. */

.macro THUMB_FUNCTION name
  .section .text.\name, "ax", %progbits
  .balign 2
  .global \name
  .type \name, %function
  .thumb_func
\name:
.endm

THUMB_FUNCTION func_00302F28
  movs r2, r1
  movs r1, r0
  push {r4, lr}
  ldr r0, [pc, #8]
  bl func_0030274A
  pop {r4, pc}
.size func_00302F28, .-func_00302F28

THUMB_FUNCTION func_00304568
  movs r2, #32
  push {r4, lr}
  bl func_00303D84
  ldr r1, [pc, #4]
  str r1, [r0, #0]
  pop {r4, pc}
.size func_00304568, .-func_00304568

THUMB_FUNCTION func_00304594
  movs r2, #32
  push {r4, lr}
  bl func_00303D84
  ldr r1, [pc, #4]
  str r1, [r0, #0]
  pop {r4, pc}
.size func_00304594, .-func_00304594

THUMB_FUNCTION func_00100788
  push {r4, lr}
  bl func_0010092C
  ldr r1, [pc, #8]
  str r1, [r0, #0]
  movs r1, #0
  str r1, [r0, #4]
  pop {r4, pc}
.size func_00100788, .-func_00100788

THUMB_FUNCTION func_002FF89C
  push {r4, lr}
  movs r4, r0
  ldr r0, [r0, #0]
  ldr r1, [pc, #8]
  bl func_003009F4
  movs r0, r4
  pop {r4, pc}
.size func_002FF89C, .-func_002FF89C

THUMB_FUNCTION func_00305490
  ldr r1, [pc, #12]
  push {r4, lr}
  str r1, [r0, #0]
  adds r0, #44
  bl func_003036C0
  subs r0, #44
  pop {r4, pc}
.size func_00305490, .-func_00305490

THUMB_FUNCTION func_0030570C
  ldr r1, [pc, #12]
  push {r4, lr}
  str r1, [r0, #0]
  adds r0, #44
  bl func_003036C0
  subs r0, #44
  pop {r4, pc}
.size func_0030570C, .-func_0030570C

THUMB_FUNCTION func_001024D4
  push {r1, r2, r3, r4, r5, r6, r7, lr}
  movs r5, #0
  mov r7, sp
  ldr r6, [pc, #12]
  ldr r4, [sp, #32]
  stmia r7!, {r4, r5, r6}
  bl func_001024EC
  pop {r1, r2, r3, r4, r5, r6, r7, pc}
.size func_001024D4, .-func_001024D4

THUMB_FUNCTION func_00304898
  push {r3, lr}
  ldr r1, [pc, #16]
  str r1, [sp, #0]
  ldr r1, [pc, #16]
  movs r3, #32
  movs r2, #1
  bl func_00305A40
  pop {r3, pc}
.size func_00304898, .-func_00304898

THUMB_FUNCTION func_003054A4
  push {r3, lr}
  ldr r1, [pc, #16]
  str r1, [sp, #0]
  ldr r1, [pc, #16]
  movs r3, #32
  movs r2, #1
  bl func_00305A40
  pop {r3, pc}
.size func_003054A4, .-func_003054A4

THUMB_FUNCTION func_001040B4
  push {r4, lr}
  movs r4, r0
  ldr r0, [pc, #12]
  str r0, [r4, #0]
  movs r0, r4
  adds r0, #20
  bl func_002FF86C
  subs r0, #20
  pop {r4, pc}
.size func_001040B4, .-func_001040B4

THUMB_FUNCTION func_00104080
  push {r4, lr}
  movs r4, r0
  ldr r0, [pc, #16]
  str r0, [r4, #0]
  ldr r0, [r4, #4]
  blx func_002FF10C
  movs r0, r4
  nop @ (mov r8, r8)
  nop @ (mov r8, r8)
  pop {r4, pc}
.size func_00104080, .-func_00104080

THUMB_FUNCTION func_003054F6
  push {r4, lr}
  movs r4, r0
  movs r0, r1
  movs r1, r2
  movs r2, r3
  adds r0, #48
  bl func_003048EE
  movs r1, r0
  movs r0, r4
  bl func_0030490A
  pop {r4, pc}
.size func_003054F6, .-func_003054F6

THUMB_FUNCTION func_00303BBC
  push {r4, lr}
  movs r4, r0
  ldr r0, [pc, #28]
  str r0, [r4, #0]
  ldrb r0, [r4, #24]
  cmp r0, #0
  beq.n .L00303BBC_14
  ldr r0, [r4, #20]
  blx func_002FF10C
.L00303BBC_14:
  ldr r0, [r4, #44]
  blx func_002FF10C
  ldr r0, [r4, #48]
  blx func_002FF10C
  movs r0, r4
  pop {r4, pc}
.size func_00303BBC, .-func_00303BBC

THUMB_FUNCTION func_00303110
  ldr r0, [pc, #44]
  push {r4, lr}
  ldr r0, [r0, #0]
  lsls r0, r0, #31
  bne.n .L00303110_2a
  ldr r0, [pc, #36]
  bl func_00302F52
  cmp r0, #0
  beq.n .L00303110_2a
  ldr r0, [pc, #28]
  movs r1, #0
  str r1, [r0, #0]
  str r1, [r0, #4]
  ldr r2, [pc, #24]
  ldr r1, [pc, #28]
  blx func_00303D98
  ldr r0, [pc, #8]
  nop @ (mov r8, r8)
  nop @ (mov r8, r8)
.L00303110_2a:
  ldr r0, [pc, #8]
  pop {r4, pc}
.size func_00303110, .-func_00303110

THUMB_FUNCTION func_00103780
  movs r4, r1
  beq.n .L00103780_16
  movs r2, r1
  ldr r0, [pc, #68]
  add r1, pc, #48
  bl func_00302F3C
  movs r0, r4
  blx func_002FF10C
  b.n .L00103780_2c
.L00103780_16:
  cmp r0, #0
  beq.n .L00103780_30
  cmp r0, #1
  beq.n .L00103780_34
  cmp r0, #2
  beq.n .L00103780_38
  add r2, pc, #44
.L00103780_24:
  ldr r0, [pc, #36]
  add r1, pc, #20
  bl func_00302F3C
.L00103780_2c:
  blx func_002FED34
.L00103780_30:
  add r2, pc, #36
  b.n .L00103780_24
.L00103780_34:
  add r2, pc, #44
  b.n .L00103780_24
.L00103780_38:
  add r2, pc, #64
  b.n .L00103780_24
.size func_00103780, .-func_00103780

THUMB_FUNCTION func_003031BC
  push {r4, lr}
  ldr r4, [pc, #56]
  ldr r0, [r4, #16]
  cmp r0, #0
  bne.n .L003031BC_e
  bl func_002FFA6C
.L003031BC_e:
  ldr r0, [r4, #0]
  lsls r0, r0, #31
  bne.n .L003031BC_36
  ldr r0, [pc, #36]
  bl func_00302F52
  cmp r0, #0
  beq.n .L003031BC_36
  ldr r0, [pc, #28]
  ldr r1, [r4, #8]
  .inst.n 0x1d00 /* adds r0, r0, #4 */
  bl func_0030361C
  ldr r2, [pc, #20]
  ldr r1, [pc, #24]
  blx func_00303D98
  ldr r0, [pc, #8]
  nop @ (mov r8, r8)
  nop @ (mov r8, r8)
.L003031BC_36:
  ldr r0, [pc, #4]
  .inst.n 0x1d00 /* adds r0, r0, #4 */
  pop {r4, pc}
.size func_003031BC, .-func_003031BC

THUMB_FUNCTION func_002FFA6C
  push {r4, r5, r6, lr}
  ldr r6, [pc, #120]
  ldr r0, [r6, #16]
  cmp r0, #0
  bne.n .L002FFA6C_5c
  movs r0, #32
  bl func_002FFD20
  movs r4, r0
  movs r3, #2
  movs r2, #10
  add r1, pc, #104
  bl func_002FFD48
  movs r5, #0
  movs r4, #16
  str r0, [r6, #8]
  b.n .L002FFA6C_38
.L002FFA6C_24:
  ldr r0, [r6, #8]
  movs r1, r5
  bl func_00101CD0
  ldr r1, [r6, #8]
  ldr r1, [r1, #24]
  bl func_00101CD8
  .inst.n 0x1c6d /* adds r5, r5, #1 */
  lsls r4, r4, #1
.L002FFA6C_38:
  lsls r0, r4, #22
  lsrs r0, r0, #26
  bne.n .L002FFA6C_24
  movs r0, #32
  bl func_002FFD20
  movs r4, r0
  movs r3, #1
  movs r2, #10
  add r1, pc, #56
  bl func_002FFD48
  movs r1, #63
  lsls r1, r1, #4
  str r0, [r6, #12]
  str r1, [r0, #16]
  ldr r0, [r6, #8]
  str r0, [r6, #16]
.L002FFA6C_5c:
  pop {r4, r5, r6, pc}
.size func_002FFA6C, .-func_002FFA6C

THUMB_FUNCTION func_001024EC
  push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
  sub sp, #4
  movs r0, #1
  str r0, [sp, #0]
  ldr r6, [sp, #4]
  ldr r0, [sp, #8]
  ldr r1, [sp, #44]
  muls r6, r0
  cmp r6, #0
  bne.n .L001024EC_16
  movs r6, #1
.L001024EC_16:
  ldr r4, [sp, #12]
  adds r0, r6, r4
  cmp r1, #0
  beq.n .L001024EC_26
  blx r1
  cmp r0, #0
  beq.n .L001024EC_2e
  b.n .L001024EC_2a
.L001024EC_26:
  bl func_002FF094
.L001024EC_2a:
  adds r5, r0, r4
  b.n .L001024EC_30
.L001024EC_2e:
  movs r5, #0
.L001024EC_30:
  cmp r5, #0
  beq.n .L001024EC_64
  ldr r0, [sp, #12]
  cmp r0, #0
  beq.n .L001024EC_46
  movs r0, r5
  ldr r1, [sp, #8]
  subs r0, #64
  str r1, [r0, #56]
  ldr r1, [sp, #4]
  str r1, [r0, #60]
.L001024EC_46:
  ldr r0, [sp, #16]
  cmp r0, #0
  beq.n .L001024EC_64
  movs r4, #0
  movs r7, r5
  b.n .L001024EC_5e
.L001024EC_52:
  ldr r1, [sp, #16]
  movs r0, r7
  blx r1
  ldr r0, [sp, #8]
  .inst.n 0x1c64 /* adds r4, r4, #1 */
  adds r7, r7, r0
.L001024EC_5e:
  ldr r0, [sp, #4]
  cmp r4, r0
  blt.n .L001024EC_52
.L001024EC_64:
  movs r0, r5
  add sp, #20
  pop {r4, r5, r6, r7, pc}
.size func_001024EC, .-func_001024EC

THUMB_FUNCTION func_00102910
  push {r0, r1, r2, r4, r5, r6, r7, lr}
  movs r7, r1
  movs r6, #0
  ldr r4, [sp, #0]
.L00102910_8:
  ldrb r5, [r4, #0]
  .inst.n 0x1c64 /* adds r4, r4, #1 */
  cmp r5, #0
  beq.n .L00102910_1c
  blx func_002FEDF0
  ldr r0, [r0, #0]
  ldrb r0, [r0, r5]
  lsls r0, r0, #31
  bne.n .L00102910_8
.L00102910_1c:
  cmp r5, #43
  beq.n .L00102910_26
  cmp r5, #45
  beq.n .L00102910_56
  .inst.n 0x1e64 /* subs r4, r4, #1 */
.L00102910_26:
  ldr r2, [sp, #8]
  movs r1, r7
  movs r0, r4
  bl func_003011B0
  cmp r7, #0
  beq.n .L00102910_3e
  ldr r1, [r7, #0]
  cmp r1, r4
  bne.n .L00102910_3e
  ldr r1, [sp, #0]
  str r1, [r7, #0]
.L00102910_3e:
  lsls r1, r6, #21
  movs r4, #2
  cmp r1, #0
  bge.n .L00102910_5e
  negs r0, r0
  cmp r0, #0
  ble.n .L00102910_54
  blx func_002FED78
  str r4, [r0, #0]
  lsls r0, r4, #30
.L00102910_54:
  pop {r1, r2, r3, r4, r5, r6, r7, pc}
.L00102910_56:
  movs r0, #1
  lsls r0, r0, #10
  orrs r6, r0
  b.n .L00102910_26
.L00102910_5e:
  cmp r0, #0
  bge.n .L00102910_54
  blx func_002FED78
  str r4, [r0, #0]
  ldr r0, [pc, #0]
  pop {r1, r2, r3, r4, r5, r6, r7, pc}
.size func_00102910, .-func_00102910

THUMB_FUNCTION func_00102A56
  push {r0, r1, r2, r4, r5, r6, r7, lr}
  movs r6, r1
  movs r4, #0
  movs r1, #3
  movs r0, r4
  sub sp, #16
  nop @ (mov r8, r8)
  nop @ (mov r8, r8)
  movs r7, r0
.L00102A56_12:
  cmp r7, #0
  beq.n .L00102A56_1e
  ldr r1, [r7, #4]
  ldr r0, [r7, #0]
  str r1, [sp, #12]
  str r0, [sp, #8]
.L00102A56_1e:
  mov r0, sp
  ldrh r1, [r6, #0]
  movs r2, r7
  bl func_002FFBF8
  movs r5, r0
  .inst.n 0x1c40 /* adds r0, r0, #1 */
  beq.n .L00102A56_48
  ldr r0, [sp, #16]
  cmp r0, #0
  beq.n .L00102A56_5a
  ldr r0, [sp, #24]
  adds r1, r5, r4
  cmp r1, r0
  bls.n .L00102A56_4e
  cmp r7, #0
  beq.n .L00102A56_68
  ldr r1, [sp, #12]
  ldr r0, [sp, #8]
  stmia r7!, {r0, r1}
  b.n .L00102A56_68
.L00102A56_48:
  movs r0, r5
.L00102A56_4a:
  add sp, #28
  pop {r4, r5, r6, r7, pc}
.L00102A56_4e:
  ldr r0, [sp, #16]
  mov r1, sp
  movs r2, r5
  adds r0, r0, r4
  blx func_00300B28
.L00102A56_5a:
  ldrh r0, [r6, #0]
  adds r4, r4, r5
  cmp r0, #0
  beq.n .L00102A56_66
  .inst.n 0x1cb6 /* adds r6, r6, #2 */
  b.n .L00102A56_12
.L00102A56_66:
  .inst.n 0x1e64 /* subs r4, r4, #1 */
.L00102A56_68:
  movs r0, r4
  b.n .L00102A56_4a
.size func_00102A56, .-func_00102A56

THUMB_FUNCTION func_002FEC7C
  push {r0, r1, r2, r3, r4, r5, r6, r7, lr}
  movs r4, r1
  movs r7, r2
  movs r6, #0
  cmp r1, #0
  sub sp, #4
  bne.n .L002FEC7C_16
  movs r0, #0
  movs r7, #1
  add r4, pc, #92
  str r0, [sp, #4]
.L002FEC7C_16:
  ldr r0, [sp, #16]
  cmp r0, #0
  bne.n .L002FEC7C_66
  movs r1, #5
  nop @ (mov r8, r8)
  nop @ (mov r8, r8)
  str r0, [sp, #16]
  b.n .L002FEC7C_66
.L002FEC7C_26:
  ldrb r1, [r4, #0]
  mov r0, sp
  ldr r2, [sp, #16]
  .inst.n 0x1c64 /* adds r4, r4, #1 */
  bl func_002FED38
  movs r5, r0
  .inst.n 0x1c76 /* adds r6, r6, #1 */
  .inst.n 0x1c40 /* adds r0, r0, #1 */
  beq.n .L002FEC7C_5a
  .inst.n 0x1cad /* adds r5, r5, #2 */
  beq.n .L002FEC7C_66
  ldr r0, [sp, #4]
  cmp r0, #0
  beq.n .L002FEC7C_4c
  mov r0, sp
  ldrh r1, [r0, #0]
  ldr r0, [sp, #4]
  strh r1, [r0, #0]
.L002FEC7C_4c:
  mov r0, sp
  ldrh r0, [r0, #0]
  cmp r0, #0
  beq.n .L002FEC7C_56
  movs r0, r6
.L002FEC7C_56:
  add sp, #20
  pop {r4, r5, r6, r7, pc}
.L002FEC7C_5a:
  blx func_002FED78
  movs r1, #4
  str r1, [r0, #0]
  movs r0, r5
  b.n .L002FEC7C_56
.L002FEC7C_66:
  .inst.n 0x1e7f /* subs r7, r7, #1 */
  bcs.n .L002FEC7C_26
  movs r0, #1
  mvns r0, r0
  b.n .L002FEC7C_56
.size func_002FEC7C, .-func_002FEC7C

THUMB_FUNCTION func_001003FA
  push {r0, r1, r2, r4, r5, r6, r7, lr}
  sub sp, #8
  movs r7, r1
  ldr r4, [sp, #8]
  movs r6, #0
  blx func_002FED78
  str r0, [sp, #0]
  ldr r0, [r0, #0]
  str r0, [sp, #4]
.L001003FA_14:
  ldrh r5, [r4, #0]
  .inst.n 0x1ca4 /* adds r4, r4, #2 */
  cmp r5, #0
  beq.n .L001003FA_26
  movs r0, r5
  bl func_002FED84
  cmp r0, #0
  bne.n .L001003FA_14
.L001003FA_26:
  cmp r5, #43
  beq.n .L001003FA_30
  cmp r5, #45
  beq.n .L001003FA_68
  .inst.n 0x1ea4 /* subs r4, r4, #2 */
.L001003FA_30:
  ldr r0, [sp, #0]
  movs r1, #0
  str r1, [r0, #0]
  ldr r2, [sp, #16]
  movs r1, r7
  movs r0, r4
  bl func_00100500
  movs r1, r0
  cmp r7, #0
  beq.n .L001003FA_50
  ldr r0, [r7, #0]
  cmp r0, r4
  bne.n .L001003FA_50
  ldr r0, [sp, #8]
  str r0, [r7, #0]
.L001003FA_50:
  ldr r0, [sp, #0]
  ldr r0, [r0, #0]
  cmp r0, #2
  beq.n .L001003FA_70
  ldr r0, [sp, #0]
  ldr r2, [sp, #4]
  str r2, [r0, #0]
  lsls r0, r6, #21
  bpl.n .L001003FA_70
  negs r0, r1
.L001003FA_64:
  add sp, #20
  pop {r4, r5, r6, r7, pc}
.L001003FA_68:
  movs r0, #1
  lsls r0, r0, #10
  orrs r6, r0
  b.n .L001003FA_30
.L001003FA_70:
  movs r0, r1
  b.n .L001003FA_64
.size func_001003FA, .-func_001003FA

THUMB_FUNCTION func_00304CB0
  push {r4, r5, lr}
  movs r4, r0
  movs r5, r0
  ldr r0, [r0, #56]
  ldr r1, [r4, #60]
  sub sp, #84
  adds r5, #44
  str r0, [sp, #68]
  movs r0, r5
  str r1, [sp, #72]
  bl func_00304898
  bl func_003048B4
  cmp r0, #0
  bge.n .L00304CB0_68
  add r0, sp, #68
  bl func_003048BE
  cmp r0, #0
  bne.n .L00304CB0_68
  str r0, [sp, #76]
  movs r0, r5
  bl func_00304898
  add r5, sp, #76
  str r5, [sp, #0]
  ldr r5, [r0, #0]
  add r1, sp, #68
  ldr r5, [r5, #20]
  add r2, sp, #4
  add r3, sp, #68
  blx r5
  ldr r1, [sp, #76]
  add r2, sp, #4
  subs r5, r1, r2
  cmp r0, #2
  beq.n .L00304CB0_62
  cmp r0, #3
  beq.n .L00304CB0_68
  movs r0, r4
  movs r3, r5
  movs r2, #1
  adds r0, #48
  add r1, sp, #4
  bl func_003048D0
  cmp r0, #0
  beq.n .L00304CB0_6c
.L00304CB0_62:
  movs r0, #0
.L00304CB0_64:
  add sp, #84
  pop {r4, r5, pc}
.L00304CB0_68:
  movs r0, #1
  b.n .L00304CB0_64
.L00304CB0_6c:
  ldr r0, [r4, #52]
  adds r0, r0, r5
  str r0, [r4, #52]
  b.n .L00304CB0_68
.size func_00304CB0, .-func_00304CB0
