.syntax unified
.arch armv6k
.fpu vfpv2
.thumb

.global func_002FF7EC
.type func_002FF7EC, %function

.section .text.func_003026AC, "ax", %progbits
.balign 2
.global func_003026AC
.type func_003026AC, %function
.thumb_func
func_003026AC:
  push {r4, r5, r6, lr}
  movs r6, r0
  negs r2, r1
  movs r0, r1
  bics r0, r2
  beq.n .L_func_003026AC_2c
  movs r0, #42
  adds r4, r6, #1
  movs r5, #0
  strb r0, [r6, #0]
  blx func_002FF7EC
  movs r3, r0
.L_func_003026AC_1a:
  lsls r1, r5, #2
  movs r0, #0
  ldr r2, [r3, r1]
.L_func_003026AC_20:
  lsrs r1, r2, #28
  lsls r2, r2, #4
  cmp r1, #9
  bls.n .L_func_003026AC_84
  adds r1, #87
  b.n .L_func_003026AC_86
.L_func_003026AC_2c:
  cmp r1, #4
  beq.n .L_func_003026AC_58
  bgt.n .L_func_003026AC_3c
  cmp r1, #1
  beq.n .L_func_003026AC_48
  cmp r1, #2
  bne.n .L_func_003026AC_44
  b.n .L_func_003026AC_50
.L_func_003026AC_3c:
  cmp r1, #8
  beq.n .L_func_003026AC_60
  cmp r1, #16
  beq.n .L_func_003026AC_68
.L_func_003026AC_44:
  movs r0, #0
  pop {r4, r5, r6, pc}
.L_func_003026AC_48:
  blx func_002FF7EC
  ldr r0, [r0, #0]
  b.n .L_func_003026AC_6e
.L_func_003026AC_50:
  blx func_002FF7EC
  ldr r0, [r0, #4]
  b.n .L_func_003026AC_6e
.L_func_003026AC_58:
  blx func_002FF7EC
  ldr r0, [r0, #8]
  b.n .L_func_003026AC_6e
.L_func_003026AC_60:
  blx func_002FF7EC
  ldr r0, [r0, #12]
  b.n .L_func_003026AC_6e
.L_func_003026AC_68:
  blx func_002FF7EC
  ldr r0, [r0, #16]
.L_func_003026AC_6e:
  cmp r0, #0
  beq.n .L_func_003026AC_80
  lsrs r0, r0, #2
  lsls r0, r0, #2
  movs r1, r0
  subs r1, #64
  ldr r1, [r1, #60]
  adds r0, r1, r0
  pop {r4, r5, r6, pc}
.L_func_003026AC_80:
  .inst.n 0xa045
  pop {r4, r5, r6, pc}
.L_func_003026AC_84:
  adds r1, #48
.L_func_003026AC_86:
  strb r1, [r4, #0]
  .inst.n 0x1c64
  .inst.n 0x1c40
  cmp r0, #8
  blt.n .L_func_003026AC_20
  .inst.n 0x1c6d
  cmp r5, #5
  blt.n .L_func_003026AC_1a
  movs r0, #0
  strb r0, [r4, #0]
  movs r0, r6
  pop {r4, r5, r6, pc}
.size func_003026AC, . - func_003026AC

.section .note.GNU-stack, "", %progbits
