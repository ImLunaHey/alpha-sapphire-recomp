.syntax unified
.arch armv6k
.thumb

/* Authored from the neutral schedules in config/thumb-leaf-helpers-07.json. */

.macro THUMB_FUNCTION name
  .section .text.\name, "ax", %progbits
  .balign 2
  .global \name
  .type \name, %function
  .thumb_func
\name:
.endm

THUMB_FUNCTION func_00101CC8
  push {r4, lr}
  blx func_002FF8C0
  pop {r4, pc}
.size func_00101CC8, .-func_00101CC8

THUMB_FUNCTION func_001029F6
  push {r4, lr}
  bl func_00102F30
  pop {r4, pc}
.size func_001029F6, .-func_001029F6

THUMB_FUNCTION func_001029FE
  push {r4, lr}
  bl func_00102FAC
  pop {r4, pc}
.size func_001029FE, .-func_001029FE

THUMB_FUNCTION func_002FF094
  push {r4, lr}
  bl func_002FFD20
  pop {r4, pc}
.size func_002FF094, .-func_002FF094

THUMB_FUNCTION func_00303920
  push {r4, lr}
  bl func_00304408
  pop {r4, pc}
.size func_00303920, .-func_00303920

THUMB_FUNCTION func_00303BF0
  push {r4, lr}
  bl func_00304408
  pop {r4, pc}
.size func_00303BF0, .-func_00303BF0

THUMB_FUNCTION func_00100B74
  push {r4, lr}
  blx func_002FED78
  ldr r0, [r0, #0]
  pop {r4, pc}
.size func_00100B74, .-func_00100B74

THUMB_FUNCTION func_00102DD8
  push {r4, lr}
  lsls r2, r2, #1
  blx func_00300980
  pop {r4, pc}
.size func_00102DD8, .-func_00102DD8

THUMB_FUNCTION func_00304CA6
  adds r0, #48
  push {r4, lr}
  bl func_00302C50
  pop {r4, pc}
.size func_00304CA6, .-func_00304CA6

THUMB_FUNCTION func_0030551C
  adds r0, #48
  push {r4, lr}
  bl func_00302C50
  pop {r4, pc}
.size func_0030551C, .-func_0030551C

THUMB_FUNCTION func_00103174
  movs r1, r0
  push {r4, lr}
  movs r0, #12
  blx func_00302328
  pop {r4, pc}
.size func_00103174, .-func_00103174

THUMB_FUNCTION func_00103758
  .inst.n 0x1d00 /* adds r0, r0, #4 */
  push {r4, lr}
  bl func_002FF86C
  .inst.n 0x1f00 /* subs r0, r0, #4 */
  pop {r4, pc}
.size func_00103758, .-func_00103758

THUMB_FUNCTION func_00103E24
  push {r4, lr}
  bl func_00303914
  blx func_002FF8C0
  pop {r4, pc}
.size func_00103E24, .-func_00103E24

THUMB_FUNCTION func_00103E30
  push {r4, lr}
  bl func_00303928
  blx func_002FF8C0
  pop {r4, pc}
.size func_00103E30, .-func_00103E30

THUMB_FUNCTION func_0010405C
  push {r4, lr}
  bl func_00303BE4
  blx func_002FF8C0
  pop {r4, pc}
.size func_0010405C, .-func_0010405C

THUMB_FUNCTION func_00104068
  push {r4, lr}
  bl func_00303BF8
  blx func_002FF8C0
  pop {r4, pc}
.size func_00104068, .-func_00104068

THUMB_FUNCTION func_002FED84
  push {r4, lr}
  bl func_0010068E
  lsls r0, r0, #31
  lsrs r0, r0, #31
  pop {r4, pc}
.size func_002FED84, .-func_002FED84

THUMB_FUNCTION func_002FF86C
  push {r4, lr}
  movs r4, r0
  bl func_00300A00
  movs r0, r4
  pop {r4, pc}
.size func_002FF86C, .-func_002FF86C

THUMB_FUNCTION func_002FFAF4
  push {r4, lr}
  movs r4, r0
  blx func_00300B28
  movs r0, r4
  pop {r4, pc}
.size func_002FFAF4, .-func_002FFAF4

THUMB_FUNCTION func_003009F4
  push {r4, lr}
  bl func_001001FC
  blx func_002FF10C
  pop {r4, pc}
.size func_003009F4, .-func_003009F4

THUMB_FUNCTION func_00303914
  adds r0, #8
  push {r4, lr}
  bl func_00303920
  subs r0, #8
  pop {r4, pc}
.size func_00303914, .-func_00303914

THUMB_FUNCTION func_00303928
  .inst.n 0x1d00 /* adds r0, r0, #4 */
  push {r4, lr}
  bl func_00303920
  .inst.n 0x1f00 /* subs r0, r0, #4 */
  pop {r4, pc}
.size func_00303928, .-func_00303928

THUMB_FUNCTION func_00303BE4
  adds r0, #8
  push {r4, lr}
  bl func_00303BF0
  subs r0, #8
  pop {r4, pc}
.size func_00303BE4, .-func_00303BE4

THUMB_FUNCTION func_00303BF8
  .inst.n 0x1d00 /* adds r0, r0, #4 */
  push {r4, lr}
  bl func_00303BF0
  .inst.n 0x1f00 /* subs r0, r0, #4 */
  pop {r4, pc}
.size func_00303BF8, .-func_00303BF8
