.syntax unified
.arch armv6k
.fpu vfpv2
.thumb

.section .text.func_00100134, "ax", %progbits
.balign 2
.global func_00100134
.type func_00100134, %function
.thumb_func
func_00100134:
    push {r4, r5, r6, lr}
    blx func_00153770
    ldr r4, [r0, #0]
    movs r5, r0
    cmp r4, #0
    bne.n .L00100134_return
    movs r0, #32
    blx func_002FECF8
    movs r4, r0
    beq.n .L00100134_fatal
    ldr r1, .L00100134_null_a
    str r4, [r5, #0]
    str r1, [r4, #4]
    movs r0, #0
    ldr r1, .L00100134_secondary
    str r0, [r4, #0]
    str r1, [r4, #8]
    strb r0, [r4, #12]
    ldr r1, .L00100134_hook
    str r0, [r4, #16]
    str r0, [r4, #20]
    cmp r1, #0
    str r0, [r4, #24]
    beq.n .L00100134_store_result
    bl func_001000EC
.L00100134_store_result:
    str r0, [r4, #28]
.L00100134_return:
    movs r0, r4
    pop {r4, r5, r6, pc}
.L00100134_fatal:
    blx func_002FED34
    movs r0, r0

.L00100134_null_a:
    .word 0
.L00100134_secondary:
    .word thumb_secondary_00100130 + 1
.L00100134_hook:
    .word 0

.arm
    add r12, pc, #1
    bx r12
.size func_00100134, . - func_00100134

.global func_00153770
.type func_00153770, %function
.global func_002FECF8
.type func_002FECF8, %function
.global func_001000EC
.type func_001000EC, %function
.global func_002FED34
.type func_002FED34, %function
.global thumb_secondary_00100130
