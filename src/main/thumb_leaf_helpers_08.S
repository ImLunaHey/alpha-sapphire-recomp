.syntax unified
.arch armv6k
.thumb

/* Authored from the neutral schedules in config/thumb-leaf-helpers-08.json. */

.macro THUMB_FUNCTION name
  .section .text.\name, "ax", %progbits
  .balign 2
  .global \name
  .type \name, %function
  .thumb_func
\name:
.endm

THUMB_FUNCTION func_00102DE2
  push {r4, lr}
  lsls r2, r2, #1
  blx func_001A3958
  pop {r4, pc}
.size func_00102DE2, .-func_00102DE2

THUMB_FUNCTION func_00100B7E
  push {r4, lr}
  movs r4, r0
  blx func_002FED78
  str r4, [r0, #0]
  pop {r4, pc}
.size func_00100B7E, .-func_00100B7E

THUMB_FUNCTION func_00301026
  push {r4, lr}
  movs r4, r0
  blx func_00301034
  movs r0, r4
  pop {r4, pc}
.size func_00301026, .-func_00301026

THUMB_FUNCTION func_003021BE
  push {r4, lr}
  cmp r0, #127
  bhi.n .L003021BE_return
  bl func_003021A4
.L003021BE_return:
  pop {r4, pc}
.size func_003021BE, .-func_003021BE

THUMB_FUNCTION func_00304DA8
  push {r4, lr}
  bl func_00304774
  movs r1, #1
  eors r0, r1
  pop {r4, pc}
.size func_00304DA8, .-func_00304DA8

THUMB_FUNCTION func_00305510
  push {r4, lr}
  movs r4, r0
  bl func_00102DE2
  movs r0, r4
  pop {r4, pc}
.size func_00305510, .-func_00305510

THUMB_FUNCTION func_00102046
  push {r4, lr}
  movs r4, r0
  ldr r0, [r0, #0]
  blx func_002FF10C
  movs r0, r4
  pop {r4, pc}
.size func_00102046, .-func_00102046

THUMB_FUNCTION func_001047CC
  push {r4, lr}
  movs r4, r0
  adds r0, #16
  bl func_002FF86C
  subs r0, #16
  pop {r4, pc}
.size func_001047CC, .-func_001047CC

THUMB_FUNCTION func_001047E6
  push {r4, lr}
  movs r4, r0
  adds r0, #16
  bl func_00103764
  subs r0, #16
  pop {r4, pc}
.size func_001047E6, .-func_001047E6

THUMB_FUNCTION func_0030559A
  push {r4, lr}
  movs r4, r0
  lsls r2, r2, #1
  blx func_00300B28
  movs r0, r4
  pop {r4, pc}
.size func_0030559A, .-func_0030559A

THUMB_FUNCTION func_001000EC
  movs r0, #136
  push {r4, lr}
  blx func_002FECF8
  cmp r0, #0
  beq.n .L001000EC_return
  movs r1, #0
  strb r1, [r0, #0]
.L001000EC_return:
  pop {r4, pc}
.size func_001000EC, .-func_001000EC

THUMB_FUNCTION func_001001FC
  cmp r0, #0
  push {r4, lr}
  beq.n .L001001FC_return
  movs r2, r0
  subs r2, #8
  ldmia r2, {r2, r3}
  bl func_00100294
.L001001FC_return:
  pop {r4, pc}
.size func_001001FC, .-func_001001FC

THUMB_FUNCTION func_00304754
  push {r4, lr}
  movs r4, r0
  ldmia r1!, {r0}
  str r0, [r4, #0]
  .inst.n 0x1d20 /* adds r0, r4, #4 */
  bl func_00303188
  movs r0, r4
  pop {r4, pc}
.size func_00304754, .-func_00304754

THUMB_FUNCTION func_0030099C
  push {r3, r4, r5, lr}
  movs r4, r0
  str r3, [sp, #0]
  movs r0, r1
  movs r3, r2
  movs r2, #8
  movs r1, r4
  bl func_001024D4
  pop {r3, r4, r5, pc}
.size func_0030099C, .-func_0030099C

THUMB_FUNCTION func_00304960
  push {r0, r1, lr}
  movs r0, #0
  sub sp, #4
  mvns r0, r0
  str r0, [sp, #0]
  mov r1, sp
  add r0, sp, #8
  bl func_00303934
  pop {r1, r2, r3, pc}
.size func_00304960, .-func_00304960

THUMB_FUNCTION func_003054CA
  push {r0, r1, lr}
  movs r0, #0
  sub sp, #4
  mvns r0, r0
  str r0, [sp, #0]
  mov r1, sp
  add r0, sp, #8
  bl func_00303944
  pop {r1, r2, r3, pc}
.size func_003054CA, .-func_003054CA

THUMB_FUNCTION func_00100C24
  push {r4, lr}
  ldr r3, [r0, #20]
  cmp r3, #0
  beq.n .L00100C24_alternate
  bl func_001005A8
  b.n .L00100C24_done
.L00100C24_alternate:
  bl func_0010133C
.L00100C24_done:
  movs r0, #1
  pop {r4, pc}
.size func_00100C24, .-func_00100C24

THUMB_FUNCTION func_00100C5C
  push {r4, lr}
  ldr r3, [r0, #20]
  cmp r3, #0
  beq.n .L00100C5C_alternate
  bl func_00100638
  b.n .L00100C5C_done
.L00100C5C_alternate:
  bl func_001013A0
.L00100C5C_done:
  movs r0, #1
  pop {r4, pc}
.size func_00100C5C, .-func_00100C5C

THUMB_FUNCTION func_00302F3C
  push {r0, r1, r2, r3}
  movs r1, r0
  push {r4, lr}
  add r2, sp, #16
  ldr r0, [sp, #12]
  bl func_00103180
  pop {r4}
  pop {r3}
  add sp, #16
  bx r3
.size func_00302F3C, .-func_00302F3C

THUMB_FUNCTION func_00304550
  push {r4, r5, r6, lr}
  movs r4, r2
  movs r0, #16
  bl func_002FFD20
  movs r5, r0
  movs r1, #0
  bl func_00304568
  str r4, [r0, #12]
  pop {r4, r5, r6, pc}
.size func_00304550, .-func_00304550

THUMB_FUNCTION func_0030457C
  push {r4, r5, r6, lr}
  movs r4, r2
  movs r0, #16
  bl func_002FFD20
  movs r5, r0
  movs r1, #0
  bl func_00304594
  str r4, [r0, #12]
  pop {r4, r5, r6, pc}
.size func_0030457C, .-func_0030457C

THUMB_FUNCTION func_00100AA0
  push {r4, lr}
  movs r4, r0
  ldr r0, [r2, #0]
  movs r1, r4
  bl func_002FF972
  movs r2, r0
  movs r3, #0
  movs r0, r4
  bl func_00100A5C
  pop {r4, pc}
.size func_00100AA0, .-func_00100AA0

THUMB_FUNCTION func_00300A48
  push {r1, r2, r3, r4, r5, lr}
  movs r5, r0
  ldr r4, [sp, #24]
  movs r0, #0
  str r0, [sp, #4]
  movs r0, r5
  str r4, [sp, #0]
  str r4, [sp, #8]
  bl func_00102590
  movs r0, r5
  pop {r1, r2, r3, r4, r5, pc}
.size func_00300A48, .-func_00300A48

THUMB_FUNCTION func_003034A8
  push {r4, lr}
  movs r4, r0
  bl func_003034C0
  cmp r0, #0
  beq.n .L003034A8_return
  bl func_0010420C
  lsls r1, r4, #24
  lsrs r1, r1, #23
  ldrh r0, [r0, r1]
.L003034A8_return:
  pop {r4, pc}
.size func_003034A8, .-func_003034A8
