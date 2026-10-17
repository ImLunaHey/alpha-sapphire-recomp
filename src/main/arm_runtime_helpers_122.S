.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0019B4A8, "ax", %progbits
.balign 4
.global func_0019B4A8
.type func_0019B4A8, %function
func_0019B4A8:
    str lr, [sp, #-4]!
    bics r3, r1, #1
    addne r1, r1, #1
    lsl r3, r1, #2
    sub sp, sp, r3
    mov r1, sp
    str r3, [sp, #-4]!
    blx r2
    ldr r3, [sp], #4
    add sp, sp, r3
    ldr pc, [sp], #4
.size func_0019B4A8, . - func_0019B4A8

.section .text.func_0019BDE0, "ax", %progbits
.balign 4
.global func_0019BDE0
.type func_0019BDE0, %function
func_0019BDE0:
    ldr r2, [r0]
    ldr r3, .Lmultiplier_0
    ldr r1, .Lincrement_0
    mla r1, r2, r3, r1
    ldr r3, .Lmask_0
    str r1, [r0]
    and r2, r3, r1, lsr #16
    clz r0, r2
    and ip, r1, #0x80000000
    lsl r2, r2, r0
    rsb r1, r0, #142
    add r2, ip, r2, lsr #8
    add r2, r2, r1, lsl #23
    vmov s0, r2
    bx lr
.size func_0019BDE0, . - func_0019BDE0
.Lmultiplier_0:
    .word 214013
.Lincrement_0:
    .word 2531011
.Lmask_0:
    .word 32767

.section .text.func_0019BE28, "ax", %progbits
.balign 4
.global func_0019BE28
.type func_0019BE28, %function
func_0019BE28:
    ldr r2, [r0]
    ldr r3, .Lmultiplier_1
    ldr r1, .Lincrement_1
    mla r1, r2, r3, r1
    ldr r3, .Lmask_1
    str r1, [r0]
    and r2, r3, r1, lsr #16
    clz r0, r2
    and ip, r1, #0x80000000
    lsl r2, r2, r0
    rsb r1, r0, #141
    add r2, ip, r2, lsr #8
    add r2, r2, r1, lsl #23
    vmov s0, r2
    bx lr
.size func_0019BE28, . - func_0019BE28
.Lmultiplier_1:
    .word 214013
.Lincrement_1:
    .word 2531011
.Lmask_1:
    .word 32767

.section .note.GNU-stack, "", %progbits
