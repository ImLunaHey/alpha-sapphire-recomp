.syntax unified
.arch armv6k
.fpu vfpv2
.thumb

.section .text.func_002FFB14, "ax", %progbits
.balign 2
.global func_002FFB14
.type func_002FFB14, %function
.thumb_func
func_002FFB14:
    push {r3, r4, r5, r6, r7, lr}
    movs r0, #14
    movs r4, r1
    movs r7, r2
    mvns r0, r0
    cmp r1, r0
    bls .Lfirst_ready
    movs r3, r1
    str r0, [sp, #0]
    movs r0, #8
    add r2, pc, #96
    add r1, pc, #96
    bl func_00300ABC
.Lfirst_ready:
    cmp r7, r4
    bls .Lbounds_ready
    movs r3, r7
    movs r0, #8
    add r2, pc, #80
    add r1, pc, #80
    str r4, [sp, #0]
    bl func_00300ABC
.Lbounds_ready:
    cmp r4, #0
    beq .Lempty
    movs r0, r4
    adds r0, #14
    movs r1, #0
    bl thumb_secondary_00102024
    movs r5, r0
    movs r1, r0
    movs r0, #12
    movs r0, r1
    mov r8, r8
    movs r6, #0
    cmp r0, #0
    beq .Lheader_ready
    str r6, [r0, #0]
    str r6, [r0, #4]
    str r6, [r0, #8]
.Lheader_ready:
    movs r0, r5
    adds r0, #12
    str r7, [r5, #8]
    adds r1, r0, r7
    str r6, [r5, #0]
    mov r0, sp
    str r4, [r5, #4]
    strb r6, [r0, #0]
    movs r0, #1
    movs r0, r1
    mov r8, r8
    cmp r0, #0
    beq .Lreturn
    strb r6, [r0, #0]
.Lreturn:
    movs r0, r5
    pop {r3, r4, r5, r6, r7, pc}
.Lempty:
    ldr r0, [pc, #8]
    pop {r3, r4, r5, r6, r7, pc}
.size func_002FFB14, . - func_002FFB14

.global func_00300ABC
.type func_00300ABC, %function
.global thumb_secondary_00102024
.type thumb_secondary_00102024, %function
