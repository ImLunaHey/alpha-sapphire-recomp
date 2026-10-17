/* Clean-room implementation derived solely from thumb-leaf-helpers-17.json. */
.syntax unified
.thumb

.section .text.func_00103ADE, "ax", %progbits
.balign 2
.global func_00103ADE
.type func_00103ADE, %function
.thumb_func
func_00103ADE:
  push {r3, r4, r5, r6, r7, lr}
  lsls r4, r2, #0
  lsls r6, r1, #0
  lsls r5, r3, #0
  .global func_00303110
  .type func_00303110, %function
  bl func_00303110
  ldr r1, [r0, #4]
  cmp r1, r6
  ble .Lzero
  ldr r0, [r0, #0]
  lsls r1, r6, #3
  adds r0, r0, r1
  ldr r0, [r0, #0]
  adds r1, r0, #1
  beq .Lzero
  movs r1, #0
  str r1, [sp, #0]
  lsls r2, r5, #0
  lsls r1, r4, #0
  mov r3, sp
  .global thumb_secondary_001035A0
  .type thumb_secondary_001035A0, %function
  bl thumb_secondary_001035A0
  mov r1, sp
  cmp r0, r1
  bne .Lreturn
.Lzero:
  movs r0, #0
.Lreturn:
  pop {r3, r4, r5, r6, r7, pc}
.size func_00103ADE, . - func_00103ADE

.section .note.GNU-stack, "", %progbits
