/* Clean-room implementation derived solely from thumb-leaf-helpers-16.json. */
.syntax unified
.thumb

.section .text.func_0010046E, "ax", %progbits
.balign 2
.global func_0010046E
.type func_0010046E, %function
.thumb_func
func_0010046E:
  .inst.n 0xe001
.size func_0010046E, . - func_0010046E

.section .text.func_00102008, "ax", %progbits
.balign 2
.global func_00102008
.type func_00102008, %function
.thumb_func
func_00102008:
  push {r4, lr}
  .global thumb_secondary_00300AA0
  .type thumb_secondary_00300AA0, %function
  bl thumb_secondary_00300AA0
  pop {r4, pc}
.size func_00102008, . - func_00102008

.section .text.func_00102E30, "ax", %progbits
.balign 2
.global func_00102E30
.type func_00102E30, %function
.thumb_func
func_00102E30:
  .inst.n 0xe000
.size func_00102E30, . - func_00102E30

.section .note.GNU-stack, "", %progbits
