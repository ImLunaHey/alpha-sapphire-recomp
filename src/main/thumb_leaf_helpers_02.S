.syntax unified
.arch armv6k
.thumb

.section .text.func_00100048, "ax", %progbits
.p2align 1
.global func_00100048
.type func_00100048, %function
.thumb_func
func_00100048:
  push {r4, lr}
  movs r4, r0
  b.n .Lfunc_00100048_8
.Lfunc_00100048_6:
  .inst.n 0x1c80 @ adds r0, r0, #2
.Lfunc_00100048_8:
  ldrh r3, [r0, #0]
  cmp r3, #0
  bne.n .Lfunc_00100048_6
  b.n .Lfunc_00100048_18
.Lfunc_00100048_10:
  strh r3, [r0, #0]
  .inst.n 0x1e52 @ subs r2, r2, #1
  .inst.n 0x1c80 @ adds r0, r0, #2
  .inst.n 0x1c89 @ adds r1, r1, #2
.Lfunc_00100048_18:
  cmp r2, #0
  beq.n .Lfunc_00100048_22
  ldrh r3, [r1, #0]
  cmp r3, #0
  bne.n .Lfunc_00100048_10
.Lfunc_00100048_22:
  movs r1, #0
  strh r1, [r0, #0]
  movs r0, r4
  pop {r4, pc}
.size func_00100048, .-func_00100048

.section .text.func_001001E0, "ax", %progbits
.p2align 1
.global func_001001E0
.type func_001001E0, %function
.thumb_func
func_001001E0:
  push {r4, lr}
  movs r3, r0
  b.n .Lfunc_001001E0_14
.Lfunc_001001E0_6:
  ldrh r4, [r1, #0]
  strh r4, [r0, #0]
  ldrh r4, [r1, #0]
  .inst.n 0x1c80 @ adds r0, r0, #2
  cmp r4, #0
  beq.n .Lfunc_001001E0_14
  .inst.n 0x1c89 @ adds r1, r1, #2
.Lfunc_001001E0_14:
  .inst.n 0x1e52 @ subs r2, r2, #1
  bcs.n .Lfunc_001001E0_6
  movs r0, r3
  pop {r4, pc}
.size func_001001E0, .-func_001001E0

.section .text.func_00100218, "ax", %progbits
.p2align 1
.global func_00100218
.type func_00100218, %function
.thumb_func
func_00100218:
  movs r3, r0
  orrs r3, r1
  push {r4, lr}
  lsls r3, r3, #30
  bne.n .Lfunc_00100218_44
.Lfunc_00100218_a:
  cmp r2, #4
  bcc.n .Lfunc_00100218_44
  ldmia r0!, {r3}
  ldmia r1!, {r4}
  .inst.n 0x1f12 @ subs r2, r2, #4
  cmp r3, r4
  beq.n .Lfunc_00100218_a
  lsls r0, r3, #24
  lsls r1, r4, #24
  lsrs r0, r0, #24
  lsrs r1, r1, #24
  subs r0, r0, r1
  bne.n .Lfunc_00100218_42
  lsls r0, r3, #16
  lsls r1, r4, #16
  lsrs r0, r0, #16
  lsrs r1, r1, #16
  subs r0, r0, r1
  bne.n .Lfunc_00100218_42
  lsls r0, r3, #8
  lsls r1, r4, #8
  lsrs r0, r0, #8
  lsrs r1, r1, #8
  subs r0, r0, r1
  bne.n .Lfunc_00100218_42
  lsrs r0, r3, #24
  lsrs r1, r4, #24
  subs r0, r0, r1
.Lfunc_00100218_42:
  pop {r4, pc}
.Lfunc_00100218_44:
  cmp r2, #0
  beq.n .Lfunc_00100218_50
  lsls r3, r2, #31
  beq.n .Lfunc_00100218_54
  .inst.n 0x1c52 @ adds r2, r2, #1
  b.n .Lfunc_00100218_60
.Lfunc_00100218_50:
  movs r0, #0
  pop {r4, pc}
.Lfunc_00100218_54:
  ldrb r3, [r0, #0]
  ldrb r4, [r1, #0]
  .inst.n 0x1c40 @ adds r0, r0, #1
  .inst.n 0x1c49 @ adds r1, r1, #1
  subs r3, r3, r4
  bne.n .Lfunc_00100218_70
.Lfunc_00100218_60:
  ldrb r3, [r0, #0]
  ldrb r4, [r1, #0]
  .inst.n 0x1c40 @ adds r0, r0, #1
  .inst.n 0x1c49 @ adds r1, r1, #1
  subs r3, r3, r4
  bne.n .Lfunc_00100218_70
  .inst.n 0x1e92 @ subs r2, r2, #2
  bne.n .Lfunc_00100218_54
.Lfunc_00100218_70:
  movs r0, r3
  pop {r4, pc}
.size func_00100218, .-func_00100218

.section .text.func_001002B6, "ax", %progbits
.p2align 1
.global func_001002B6
.type func_001002B6, %function
.thumb_func
func_001002B6:
  push {r4, lr}
  subs r3, r0, #1
.Lfunc_001002B6_4:
  .inst.n 0x1c5b @ adds r3, r3, #1
  ldrb r4, [r3, #0]
  cmp r4, #0
  bne.n .Lfunc_001002B6_4
  b.n .Lfunc_001002B6_1a
.Lfunc_001002B6_e:
  ldrb r4, [r1, #0]
  .inst.n 0x1c49 @ adds r1, r1, #1
  strb r4, [r3, #0]
  .inst.n 0x1c5b @ adds r3, r3, #1
  cmp r4, #0
  beq.n .Lfunc_001002B6_22
.Lfunc_001002B6_1a:
  .inst.n 0x1e52 @ subs r2, r2, #1
  bcs.n .Lfunc_001002B6_e
  movs r1, #0
  strb r1, [r3, #0]
.Lfunc_001002B6_22:
  pop {r4, pc}
.size func_001002B6, .-func_001002B6

.section .text.func_0010048A, "ax", %progbits
.p2align 1
.global func_0010048A
.type func_0010048A, %function
.thumb_func
func_0010048A:
  push {r4, lr}
.Lfunc_0010048A_2:
  movs r2, #0
  b.n .Lfunc_0010048A_12
.Lfunc_0010048A_6:
  ldrh r4, [r0, r4]
  cmp r4, #0
  beq.n .Lfunc_0010048A_1c
  cmp r4, r3
  bne.n .Lfunc_0010048A_20
  .inst.n 0x1c52 @ adds r2, r2, #1
.Lfunc_0010048A_12:
  lsls r4, r2, #1
  ldrh r3, [r1, r4]
  cmp r3, #0
  bne.n .Lfunc_0010048A_6
  pop {r4, pc}
.Lfunc_0010048A_1c:
  movs r0, #0
.Lfunc_0010048A_1e:
  pop {r4, pc}
.Lfunc_0010048A_20:
  lsls r2, r2, #1
  ldrh r2, [r1, r2]
  cmp r2, #0
  beq.n .Lfunc_0010048A_1e
  .inst.n 0x1c80 @ adds r0, r0, #2
  b.n .Lfunc_0010048A_2
.size func_0010048A, .-func_0010048A

.section .text.func_001007A4, "ax", %progbits
.p2align 1
.global func_001007A4
.type func_001007A4, %function
.thumb_func
func_001007A4:
  subs r2, r0, #1
.Lfunc_001007A4_2:
  .inst.n 0x1c52 @ adds r2, r2, #1
  ldrb r3, [r2, #0]
  cmp r3, #0
  bne.n .Lfunc_001007A4_2
.Lfunc_001007A4_a:
  ldrb r3, [r1, #0]
  .inst.n 0x1c49 @ adds r1, r1, #1
  strb r3, [r2, #0]
  .inst.n 0x1c52 @ adds r2, r2, #1
  cmp r3, #0
  bne.n .Lfunc_001007A4_a
  bx lr
.size func_001007A4, .-func_001007A4

.section .text.func_0010092C, "ax", %progbits
.p2align 1
.global func_0010092C
.type func_0010092C, %function
.thumb_func
func_0010092C:
  ldr r1, [pc, #4]
  str r1, [r0, #0]
  bx lr
.size func_0010092C, .-func_0010092C

.section .text.func_00100BCC, "ax", %progbits
.p2align 1
.global func_00100BCC
.type func_00100BCC, %function
.thumb_func
func_00100BCC:
  lsls r3, r1, #24
  movs r2, #0
  lsrs r3, r3, #24
.Lfunc_00100BCC_6:
  ldrb r1, [r0, #0]
  .inst.n 0x1c40 @ adds r0, r0, #1
  cmp r1, r3
  bne.n .Lfunc_00100BCC_10
  subs r2, r0, #1
.Lfunc_00100BCC_10:
  cmp r1, #0
  bne.n .Lfunc_00100BCC_6
  movs r0, r2
  bx lr
.size func_00100BCC, .-func_00100BCC

.section .text.func_00102724, "ax", %progbits
.p2align 1
.global func_00102724
.type func_00102724, %function
.thumb_func
func_00102724:
  push {r4, r5}
  ldr r1, [pc, #48]
  ldr r4, [r1, #0]
  ldr r2, [r1, #4]
  ldr r3, [r4, #0]
  ldr r0, [r2, #0]
  adds r0, r0, r3
  str r0, [r2, #0]
  .inst.n 0x1d24 @ adds r4, r4, #4
  .inst.n 0x1d12 @ adds r2, r2, #4
  cmp r4, r1
  bcs.n .Lfunc_00102724_28
  cmp r2, r1
  bcs.n .Lfunc_00102724_2e
.Lfunc_00102724_1c:
  str r4, [r1, #0]
  str r2, [r1, #4]
  pop {r4, r5}
  lsls r0, r0, #1
  lsrs r0, r0, #1
  bx lr
.Lfunc_00102724_28:
  movs r4, r1
  subs r4, #220
  b.n .Lfunc_00102724_1c
.Lfunc_00102724_2e:
  movs r2, r1
  subs r2, #220
  b.n .Lfunc_00102724_1c
.size func_00102724, .-func_00102724

.section .text.func_00102AC4, "ax", %progbits
.p2align 1
.global func_00102AC4
.type func_00102AC4, %function
.thumb_func
func_00102AC4:
  ldr r2, [pc, #48]
  push {r4, r5, lr}
  movs r1, r2
  adds r1, #68
  movs r3, r1
  subs r3, #192
  str r3, [r1, #32]
  str r2, [r1, #28]
  ldr r4, [pc, #36]
  movs r1, #55
  b.n .Lfunc_00102AC4_24
.Lfunc_00102AC4_16:
  lsrs r2, r0, #16
  lsls r5, r1, #2
  adds r2, r2, r0
  str r2, [r3, r5]
  ldr r2, [pc, #28]
  muls r0, r2
  adds r0, r0, r4
.Lfunc_00102AC4_24:
  movs r2, r1
  .inst.n 0x1e49 @ subs r1, r1, #1
  cmp r2, #0
  bgt.n .Lfunc_00102AC4_16
  pop {r4, r5, pc}
.size func_00102AC4, .-func_00102AC4

.section .text.func_00102D8A, "ax", %progbits
.p2align 1
.global func_00102D8A
.type func_00102D8A, %function
.thumb_func
func_00102D8A:
  push {r4, r5, lr}
  movs r5, r0
.Lfunc_00102D8A_4:
  movs r2, r5
  movs r3, r1
.Lfunc_00102D8A_8:
  ldrb r0, [r2, #0]
  ldrb r4, [r3, #0]
  .inst.n 0x1c52 @ adds r2, r2, #1
  .inst.n 0x1c5b @ adds r3, r3, #1
  cmp r0, #0
  beq.n .Lfunc_00102D8A_18
  cmp r0, r4
  beq.n .Lfunc_00102D8A_8
.Lfunc_00102D8A_18:
  cmp r4, #0
  beq.n .Lfunc_00102D8A_24
  cmp r0, #0
  beq.n .Lfunc_00102D8A_26
  .inst.n 0x1c6d @ adds r5, r5, #1
  b.n .Lfunc_00102D8A_4
.Lfunc_00102D8A_24:
  movs r0, r5
.Lfunc_00102D8A_26:
  pop {r4, r5, pc}
.size func_00102D8A, .-func_00102D8A

.section .text.func_00102E08, "ax", %progbits
.p2align 1
.global func_00102E08
.type func_00102E08, %function
.thumb_func
func_00102E08:
  push {r4, lr}
  b.n .Lfunc_00102E08_a
.Lfunc_00102E08_4:
  .inst.n 0x1e52 @ subs r2, r2, #1
  .inst.n 0x1c80 @ adds r0, r0, #2
  .inst.n 0x1c89 @ adds r1, r1, #2
.Lfunc_00102E08_a:
  cmp r2, #0
  beq.n .Lfunc_00102E08_24
  ldrh r3, [r0, #0]
  cmp r3, #0
  beq.n .Lfunc_00102E08_1a
  ldrh r4, [r1, #0]
  cmp r3, r4
  beq.n .Lfunc_00102E08_4
.Lfunc_00102E08_1a:
  ldrh r1, [r1, #0]
  lsls r0, r3, #16
  lsrs r0, r0, #16
  subs r0, r0, r1
  pop {r4, pc}
.Lfunc_00102E08_24:
  movs r0, #0
  pop {r4, pc}
.size func_00102E08, .-func_00102E08

.section .text.func_00102E4A, "ax", %progbits
.p2align 1
.global func_00102E4A
.type func_00102E4A, %function
.thumb_func
func_00102E4A:
  push {r4, r5, r6, r7, lr}
  movs r5, #0
  cmp r0, #0
  bne.n .Lfunc_00102E4A_2e
  ldr r0, [r2, #0]
  cmp r0, #0
  beq.n .Lfunc_00102E4A_46
  b.n .Lfunc_00102E4A_2e
.Lfunc_00102E4A_10:
  movs r3, #0
  b.n .Lfunc_00102E4A_1a
.Lfunc_00102E4A_14:
  cmp r4, r6
  beq.n .Lfunc_00102E4A_24
  .inst.n 0x1c5b @ adds r3, r3, #1
.Lfunc_00102E4A_1a:
  lsls r4, r3, #1
  ldrh r4, [r1, r4]
  cmp r4, #0
  bne.n .Lfunc_00102E4A_14
  b.n .Lfunc_00102E4A_36
.Lfunc_00102E4A_24:
  lsls r3, r3, #1
  ldrh r3, [r1, r3]
  cmp r3, #0
  beq.n .Lfunc_00102E4A_36
  .inst.n 0x1c80 @ adds r0, r0, #2
.Lfunc_00102E4A_2e:
  ldrh r6, [r0, #0]
  cmp r6, #0
  bne.n .Lfunc_00102E4A_10
  b.n .Lfunc_00102E4A_42
.Lfunc_00102E4A_36:
  lsls r3, r6, #16
  lsrs r3, r3, #16
  beq.n .Lfunc_00102E4A_42
  movs r6, r0
.Lfunc_00102E4A_3e:
  movs r3, #0
  b.n .Lfunc_00102E4A_50
.Lfunc_00102E4A_42:
  movs r0, #0
  str r5, [r2, #0]
.Lfunc_00102E4A_46:
  pop {r4, r5, r6, r7, pc}
.Lfunc_00102E4A_48:
  ldrh r7, [r0, #0]
  cmp r4, r7
  beq.n .Lfunc_00102E4A_5a
  .inst.n 0x1c5b @ adds r3, r3, #1
.Lfunc_00102E4A_50:
  lsls r4, r3, #1
  ldrh r4, [r1, r4]
  cmp r4, #0
  bne.n .Lfunc_00102E4A_48
  b.n .Lfunc_00102E4A_70
.Lfunc_00102E4A_5a:
  lsls r3, r3, #1
  ldrh r3, [r1, r3]
  cmp r3, #0
  beq.n .Lfunc_00102E4A_70
  lsls r1, r7, #16
  lsrs r1, r1, #16
  beq.n .Lfunc_00102E4A_78
  strh r5, [r0, #0]
  .inst.n 0x1c80 @ adds r0, r0, #2
  str r0, [r2, #0]
  b.n .Lfunc_00102E4A_7a
.Lfunc_00102E4A_70:
  .inst.n 0x1c80 @ adds r0, r0, #2
  ldrh r3, [r0, #0]
  cmp r3, #0
  bne.n .Lfunc_00102E4A_3e
.Lfunc_00102E4A_78:
  str r5, [r2, #0]
.Lfunc_00102E4A_7a:
  movs r0, r6
  pop {r4, r5, r6, r7, pc}
.size func_00102E4A, .-func_00102E4A

.section .text.func_00102EF2, "ax", %progbits
.p2align 1
.global func_00102EF2
.type func_00102EF2, %function
.thumb_func
func_00102EF2:
  lsls r3, r1, #24
  lsrs r3, r3, #24
  cmp r2, #0
  beq.n .Lfunc_00102EF2_14
.Lfunc_00102EF2_8:
  ldrb r1, [r0, #0]
  cmp r3, r1
  beq.n .Lfunc_00102EF2_16
  .inst.n 0x1c40 @ adds r0, r0, #1
  .inst.n 0x1e52 @ subs r2, r2, #1
  bne.n .Lfunc_00102EF2_8
.Lfunc_00102EF2_14:
  movs r0, #0
.Lfunc_00102EF2_16:
  bx lr
.size func_00102EF2, .-func_00102EF2

.section .text.func_00103028, "ax", %progbits
.p2align 1
.global func_00103028
.type func_00103028, %function
.thumb_func
func_00103028:
  ldr r2, [pc, #8]
  ldr r1, [r0, #12]
  ands r1, r2
  str r1, [r0, #12]
  bx lr
.size func_00103028, .-func_00103028

.section .text.func_00103D58, "ax", %progbits
.p2align 1
.global func_00103D58
.type func_00103D58, %function
.thumb_func
func_00103D58:
  push {r4, lr}
  ldr r1, [r0, #0]
  ldr r1, [r1, #36]
  blx r1
  pop {r4, pc}
.size func_00103D58, .-func_00103D58

.section .text.func_00103D9E, "ax", %progbits
.p2align 1
.global func_00103D9E
.type func_00103D9E, %function
.thumb_func
func_00103D9E:
  push {r4, lr}
  ldr r1, [r0, #0]
  ldr r1, [r1, #36]
  blx r1
  pop {r4, pc}
.size func_00103D9E, .-func_00103D9E

.section .text.func_002FFB00, "ax", %progbits
.p2align 1
.global func_002FFB00
.type func_002FFB00, %function
.thumb_func
func_002FFB00:
  ldr r1, [pc, #12]
  cmp r0, r1
  beq.n .Lfunc_002FFB00_c
  ldr r1, [r0, #0]
  .inst.n 0x1c49 @ adds r1, r1, #1
  str r1, [r0, #0]
.Lfunc_002FFB00_c:
  bx lr
.size func_002FFB00, .-func_002FFB00

.section .text.func_002FFBD4, "ax", %progbits
.p2align 1
.global func_002FFBD4
.type func_002FFBD4, %function
.thumb_func
func_002FFBD4:
  ldr r2, [r1, #0]
  strb r0, [r2, #0]
  .inst.n 0x1c52 @ adds r2, r2, #1
  str r2, [r1, #0]
  bx lr
.size func_002FFBD4, .-func_002FFBD4

.section .text.func_002FFC3C, "ax", %progbits
.p2align 1
.global func_002FFC3C
.type func_002FFC3C, %function
.thumb_func
func_002FFC3C:
  push {r4, lr}
  b.n .Lfunc_002FFC3C_18
.Lfunc_002FFC3C_4:
  ldrh r4, [r0, #0]
  .inst.n 0x1c80 @ adds r0, r0, #2
  cmp r4, r3
  bne.n .Lfunc_002FFC3C_18
  cmp r2, #0
  beq.n .Lfunc_002FFC3C_14
  movs r0, #0
  pop {r4, pc}
.Lfunc_002FFC3C_14:
  movs r0, #1
  pop {r4, pc}
.Lfunc_002FFC3C_18:
  .inst.n 0x1e49 @ subs r1, r1, #1
  bcs.n .Lfunc_002FFC3C_4
  movs r0, r2
  pop {r4, pc}
.size func_002FFC3C, .-func_002FFC3C

.section .text.func_00302B8C, "ax", %progbits
.p2align 1
.global func_00302B8C
.type func_00302B8C, %function
.thumb_func
func_00302B8C:
  push {r4, lr}
  ldr r1, [pc, #44]
  movs r4, r0
  ldr r3, [r1, #0]
  ldr r2, [r1, #4]
  movs r0, #0
  b.n .Lfunc_00302B8C_10
.Lfunc_00302B8C_e:
  .inst.n 0x1c40 @ adds r0, r0, #1
.Lfunc_00302B8C_10:
  cmp r2, r0
  bls.n .Lfunc_00302B8C_22
  lsls r1, r0, #2
  adds r1, r3, r1
  ldr r1, [r1, #0]
  cmp r1, #0
  beq.n .Lfunc_00302B8C_22
  cmp r1, r4
  bne.n .Lfunc_00302B8C_e
.Lfunc_00302B8C_22:
  lsls r1, r0, #2
  adds r1, r3, r1
  ldr r1, [r1, #0]
  cmp r1, #0
  bne.n .Lfunc_00302B8C_2e
  movs r0, r2
.Lfunc_00302B8C_2e:
  pop {r4, pc}
.size func_00302B8C, .-func_00302B8C

.section .text.func_00302F64, "ax", %progbits
.p2align 1
.global func_00302F64
.type func_00302F64, %function
.thumb_func
func_00302F64:
  cmp r0, #0
  beq.n .Lfunc_00302F64_e
  ldr r1, [pc, #32]
  cmp r0, r1
  bne.n .Lfunc_00302F64_14
  movs r0, #0
  bx lr
.Lfunc_00302F64_e:
  movs r0, #0
  mvns r0, r0
  bx lr
.Lfunc_00302F64_14:
  ldr r1, [pc, #20]
  cmp r0, r1
  bne.n .Lfunc_00302F64_1e
  movs r0, #1
.Lfunc_00302F64_1c:
  bx lr
.Lfunc_00302F64_1e:
  ldr r1, [pc, #16]
  cmp r0, r1
  bne.n .Lfunc_00302F64_1c
  movs r0, #2
  bx lr
.size func_00302F64, .-func_00302F64

.section .text.func_00303C04, "ax", %progbits
.p2align 1
.global func_00303C04
.type func_00303C04, %function
.thumb_func
func_00303C04:
  ldr r1, [r1, #0]
  str r1, [r0, #0]
  ldr r2, [r1, #28]
  .inst.n 0x1c52 @ adds r2, r2, #1
  str r2, [r1, #28]
  bx lr
.size func_00303C04, .-func_00303C04

.section .text.func_00303D84, "ax", %progbits
.p2align 1
.global func_00303D84
.type func_00303D84, %function
.thumb_func
func_00303D84:
  str r2, [r0, #4]
  movs r2, #0
  str r2, [r0, #8]
  str r1, [r0, #12]
  ldr r1, [pc, #4]
  str r1, [r0, #0]
  bx lr
.size func_00303D84, .-func_00303D84
