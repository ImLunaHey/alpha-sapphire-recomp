.syntax unified
.arch armv6k
.fpu vfpv2
.thumb

.global thumb_secondary_00303E38
.type thumb_secondary_00303E38, %function

.section .text.func_00303EC8, "ax", %progbits
.balign 2
.global func_00303EC8
.type func_00303EC8, %function
.thumb_func
func_00303EC8:
  push {r2, r3, r4, lr}
  lsls r1, r0, #0
  movs r2, #0
  mov r0, sp
  bl thumb_secondary_00303E38
  pop {r2, r3, r4, pc}
.size func_00303EC8, . - func_00303EC8

.section .note.GNU-stack, "", %progbits
