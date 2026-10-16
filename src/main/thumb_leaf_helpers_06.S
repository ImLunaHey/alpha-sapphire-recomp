.syntax unified
.arch armv6k
.thumb

/* Authored from the neutral schedules in config/thumb-leaf-helpers-06.json. */

.section .text.func_002FED9A, "ax", %progbits
.balign 2
.global func_002FED9A
.type func_002FED9A, %function
.thumb_func
func_002FED9A:
  push {lr}
  sub sp, #60
  str r1, [sp, #8]
  movs r1, #1
  str r1, [sp, #20]
  ldr r1, [pc, #20]
  str r3, [sp, #4]
  add r1, pc
  str r1, [sp, #12]
  movs r1, r2
  str r0, [sp, #16]
  mov r0, sp
  bl func_002FEE54
  add sp, #60
  pop {pc}
.size func_002FED9A, .-func_002FED9A

.section .text.func_002FFBAE, "ax", %progbits
.balign 2
.global func_002FFBAE
.type func_002FFBAE, %function
.thumb_func
func_002FFBAE:
  push {lr}
  sub sp, #60
  str r1, [sp, #8]
  movs r1, #0
  str r1, [sp, #20]
  ldr r1, [pc, #20]
  str r3, [sp, #4]
  add r1, pc
  str r1, [sp, #12]
  movs r1, r2
  str r0, [sp, #16]
  mov r0, sp
  bl func_002FEE54
  add sp, #60
  pop {pc}
.size func_002FFBAE, .-func_002FFBAE

.section .text.func_00103180, "ax", %progbits
.balign 2
.global func_00103180
.type func_00103180, %function
.thumb_func
func_00103180:
  ldr r3, [pc, #32]
  push {r4, r5, r6, lr}
  movs r4, r1
  add r3, pc
  bl func_002FFBAE
  movs r5, r0
  movs r0, r4
  bl func_0030232C
  cmp r0, #0
  beq.n .L_func_00103180_1e
  movs r0, #0
  mvns r0, r0
  pop {r4, r5, r6, pc}
.L_func_00103180_1e:
  movs r0, r5
  pop {r4, r5, r6, pc}
.size func_00103180, .-func_00103180

.section .text.func_00100078, "ax", %progbits
.balign 2
.global func_00100078
.type func_00100078, %function
.thumb_func
func_00100078:
  push {r4, r5, r6, lr}
  movs r4, r0
  movs r5, r1
  movs r0, r2
  bne.n .L_func_00100078_10
  movs r1, #4
  nop @ (mov r8, r8)
  nop @ (mov r8, r8)
.L_func_00100078_10:
  movs r3, r0
  movs r2, r5
  movs r1, r4
  movs r0, #0
  bl func_002FEC7C
  pop {r4, r5, r6, pc}
.size func_00100078, .-func_00100078

.section .text.func_0010275C, "ax", %progbits
.balign 2
.global func_0010275C
.type func_0010275C, %function
.thumb_func
func_0010275C:
  push {r4, lr}
  movs r4, r0
  blx func_002FEDF0
  ldr r0, [r0, #0]
  ldrb r0, [r0, r4]
  lsls r0, r0, #28
  bpl.n .L_func_0010275C_1a
  cmp r4, #223
  beq.n .L_func_0010275C_1a
  movs r0, r4
  subs r0, #32
  pop {r4, pc}
.L_func_0010275C_1a:
  movs r0, r4
  pop {r4, pc}
.size func_0010275C, .-func_0010275C

.section .text.func_00103AC0, "ax", %progbits
.balign 2
.global func_00103AC0
.type func_00103AC0, %function
.thumb_func
func_00103AC0:
  push {r4, lr}
  movs r4, r1
  bl func_00303110
  ldr r1, [r0, #4]
  cmp r1, r4
  ble.n .L_func_00103AC0_18
  ldr r0, [r0, #0]
  lsls r1, r4, #3
  adds r0, r0, r1
  .inst.n 0x1d00 /* adds r0, r0, #4 */
  pop {r4, pc}
.L_func_00103AC0_18:
  bl func_003031BC
  pop {r4, pc}
.size func_00103AC0, .-func_00103AC0

.section .text.func_002FF878, "ax", %progbits
.balign 2
.global func_002FF878
.type func_002FF878, %function
.thumb_func
func_002FF878:
  push {r4, r5, r6, lr}
  movs r5, r0
  ldr r4, [pc, #24]
  ldr r0, [r4, #0]
  cmp r0, #0
  bne.n .L_func_002FF878_10
  bl func_002FFA6C
.L_func_002FF878_10:
  ldr r1, [r4, #0]
  str r1, [r5, #0]
  ldr r0, [r1, #28]
  .inst.n 0x1c40 /* adds r0, r0, #1 */
  str r0, [r1, #28]
  movs r0, r5
  pop {r4, r5, r6, pc}
.size func_002FF878, .-func_002FF878

.section .text.func_002FFA44, "ax", %progbits
.balign 2
.global func_002FFA44
.type func_002FFA44, %function
.thumb_func
func_002FFA44:
  movs r3, r1
  push {r4, lr}
  movs r1, r2
  str r3, [r2, #12]
  ldr r2, [pc, #20]
  add r2, pc
  str r2, [r1, #20]
  ldr r2, [pc, #20]
  add r2, pc
  str r2, [r1, #32]
  movs r2, #0
  str r2, [r1, #16]
  bl func_00101934
  pop {r4, pc}
.size func_002FFA44, .-func_002FFA44

.section .text.func_00302F98, "ax", %progbits
.balign 2
.global func_00302F98
.type func_00302F98, %function
.thumb_func
func_00302F98:
  push {r4, lr}
  blx func_002FEDF0
  ldr r0, [r0, #0]
  movs r1, #255
  adds r1, #2
  ldrb r1, [r1, r0]
  cmp r1, #1
  beq.n .L_func_00302F98_16
  movs r0, #1
  pop {r4, pc}
.L_func_00302F98_16:
  adds r0, #255
  adds r0, #4
  ldr r0, [r0, #8]
  pop {r4, pc}
.size func_00302F98, .-func_00302F98

.section .text.func_0030361C, "ax", %progbits
.balign 2
.global func_0030361C
.type func_0030361C, %function
.thumb_func
func_0030361C:
  push {r4, lr}
  movs r4, r0
  str r1, [r0, #0]
  ldr r0, [pc, #24]
  ldr r0, [r0, #16]
  cmp r0, #0
  bne.n .L_func_0030361C_12
  bl func_002FFA6C
.L_func_0030361C_12:
  ldr r1, [r4, #0]
  ldr r0, [r1, #28]
  .inst.n 0x1c40 /* adds r0, r0, #1 */
  str r0, [r1, #28]
  movs r0, r4
  pop {r4, pc}
.size func_0030361C, .-func_0030361C

.section .text.func_003048D0, "ax", %progbits
.balign 2
.global func_003048D0
.type func_003048D0, %function
.thumb_func
func_003048D0:
  push {r4, r5, r6, lr}
  movs r5, r1
  movs r4, r3
  ldr r3, [r0, #0]
  movs r1, r2
  movs r2, r4
  movs r0, r5
  bl func_001034A0
  cmp r0, r4
  bne.n .L_func_003048D0_1a
  movs r0, #1
  pop {r4, r5, r6, pc}
.L_func_003048D0_1a:
  movs r0, #0
  pop {r4, r5, r6, pc}
.size func_003048D0, .-func_003048D0

.section .text.func_00304D60, "ax", %progbits
.balign 2
.global func_00304D60
.type func_00304D60, %function
.thumb_func
func_00304D60:
  push {r4, lr}
  movs r4, r0
  bl func_00302C50
  cmp r0, #0
  beq.n .L_func_00304D60_1a
  ldr r0, [r4, #0]
  bl func_00301F68
  cmp r0, #0
  beq.n .L_func_00304D60_1a
  movs r0, #0
  pop {r4, pc}
.L_func_00304D60_1a:
  movs r0, #1
  pop {r4, pc}
.size func_00304D60, .-func_00304D60

.section .text.func_00304DD0, "ax", %progbits
.balign 2
.global func_00304DD0
.type func_00304DD0, %function
.thumb_func
func_00304DD0:
  push {r3, r4, r5, lr}
  movs r4, r0
  movs r0, #0
  mvns r0, r0
  str r0, [sp, #0]
  movs r1, r4
  mov r0, sp
  bl func_00303934
  cmp r0, #0
  beq.n .L_func_00304DD0_1a
  movs r0, #0
  pop {r3, r4, r5, pc}
.L_func_00304DD0_1a:
  ldr r0, [r4, #0]
  pop {r3, r4, r5, pc}
.size func_00304DD0, .-func_00304DD0

.section .text.func_00304E3C, "ax", %progbits
.balign 2
.global func_00304E3C
.type func_00304E3C, %function
.thumb_func
func_00304E3C:
  push {r1, r2, r3, r4, r5, lr}
  movs r4, r0
  movs r5, r2
  mov r0, sp
  bl func_00304766
  ldr r1, [r0, #0]
  ldr r2, [r5, #0]
  subs r1, r1, r2
  str r1, [r0, #0]
  movs r1, r0
  movs r0, r4
  bl func_00304766
  pop {r1, r2, r3, r4, r5, pc}
.size func_00304E3C, .-func_00304E3C

.section .text.func_003055F0, "ax", %progbits
.balign 2
.global func_003055F0
.type func_003055F0, %function
.thumb_func
func_003055F0:
  push {r3, r4, r5, lr}
  movs r4, r0
  movs r0, #0
  mvns r0, r0
  str r0, [sp, #0]
  movs r1, r4
  mov r0, sp
  bl func_00303944
  cmp r0, #0
  beq.n .L_func_003055F0_1a
  movs r0, #0
  pop {r3, r4, r5, pc}
.L_func_003055F0_1a:
  ldr r0, [r4, #0]
  pop {r3, r4, r5, pc}
.size func_003055F0, .-func_003055F0

.section .text.func_00103764, "ax", %progbits
.balign 2
.global func_00103764
.type func_00103764, %function
.thumb_func
func_00103764:
  push {r4, lr}
  movs r4, r0
  adds r0, #12
  bl func_002FF86C
  movs r4, r0
  subs r4, #12
  .inst.n 0x1f00 /* subs r0, r0, #4 */
  bl func_002FF86C
  subs r0, #8
  bl func_00103758
  pop {r4, pc}
.size func_00103764, .-func_00103764

.section .text.func_003048EE, "ax", %progbits
.balign 2
.global func_003048EE
.type func_003048EE, %function
.thumb_func
func_003048EE:
  push {r4, lr}
  movs r4, r0
  ldr r0, [r0, #0]
  bl func_00301E0C
  cmp r0, #0
  beq.n .L_func_003048EE_14
  movs r0, #0
  mvns r0, r0
  pop {r4, pc}
.L_func_003048EE_14:
  ldr r0, [r4, #0]
  bl func_0030227C
  pop {r4, pc}
.size func_003048EE, .-func_003048EE

.section .text.func_00304C70, "ax", %progbits
.balign 2
.global func_00304C70
.type func_00304C70, %function
.thumb_func
func_00304C70:
  push {r1, r2, r3, r4, r5, lr}
  movs r4, r0
  movs r5, r2
  mov r0, sp
  bl func_00304766
  movs r1, r5
  bl func_00105FEA
  movs r1, r0
  movs r0, r4
  bl func_00304766
  pop {r1, r2, r3, r4, r5, pc}
.size func_00304C70, .-func_00304C70

.section .text.func_001028F4, "ax", %progbits
.balign 2
.global func_001028F4
.type func_001028F4, %function
.thumb_func
func_001028F4:
  push {r4, r5, r6, lr}
  movs r6, r0
  blx func_002FED78
  ldr r4, [r0, #0]
  movs r5, r0
  movs r2, #10
  movs r1, #0
  movs r0, r6
  bl func_00102910
  str r4, [r5, #0]
  pop {r4, r5, r6, pc}
.size func_001028F4, .-func_001028F4

.section .text.func_001040CC, "ax", %progbits
.balign 2
.global func_001040CC
.type func_001040CC, %function
.thumb_func
func_001040CC:
  push {r4, lr}
  movs r4, r0
  movs r0, #0
  mvns r0, r0
  str r0, [r4, #0]
  bl func_003031BC
  movs r1, r0
  .inst.n 0x1d20 /* adds r0, r4, #4 */
  bl func_00303C04
  .inst.n 0x1f00 /* subs r0, r0, #4 */
  pop {r4, pc}
.size func_001040CC, .-func_001040CC

.section .text.func_002FFE30, "ax", %progbits
.balign 2
.global func_002FFE30
.type func_002FFE30, %function
.thumb_func
func_002FFE30:
  push {r4, lr}
  movs r4, r0
  ldr r0, [r0, #24]
  blx func_002FF10C
  movs r0, r4
  adds r0, #8
  bl func_00102046
  subs r0, #8
  bl func_002FF89C
  pop {r4, pc}
.size func_002FFE30, .-func_002FFE30

.section .text.func_003021A4, "ax", %progbits
.balign 2
.global func_003021A4
.type func_003021A4, %function
.thumb_func
func_003021A4:
  push {r4, lr}
  movs r4, r0
  blx func_002FEDF0
  ldr r0, [r0, #0]
  ldrb r0, [r0, r4]
  lsls r0, r0, #27
  bpl.n .L_func_003021A4_16
  movs r0, r4
  adds r0, #32
  pop {r4, pc}
.L_func_003021A4_16:
  movs r0, r4
  pop {r4, pc}
.size func_003021A4, .-func_003021A4

.section .text.func_00302FEE, "ax", %progbits
.balign 2
.global func_00302FEE
.type func_00302FEE, %function
.thumb_func
func_00302FEE:
  push {r4, lr}
  ldr r1, [r0, #4]
  movs r4, r0
  cmp r1, #0
  beq.n .L_func_00302FEE_16
  ldr r0, [r4, #0]
  bl func_00302F28
  ldr r0, [r4, #4]
  blx func_002FF10C
.L_func_00302FEE_16:
  movs r0, r4
  pop {r4, pc}
.size func_00302FEE, .-func_00302FEE

.section .text.func_00304C8C, "ax", %progbits
.balign 2
.global func_00304C8C
.type func_00304C8C, %function
.thumb_func
func_00304C8C:
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
.size func_00304C8C, .-func_00304C8C
