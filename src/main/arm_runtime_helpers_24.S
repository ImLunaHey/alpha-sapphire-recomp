.syntax unified
.arm

.section .text.func_002DC7A0,"ax",%progbits
.balign 4
.global func_002DC7A0
.type func_002DC7A0, %function
func_002DC7A0:
    push {r4-r8}
    sub sp, sp, #1040
    mov r8, sp
    ldr r5, .Lcrc32_polynomial_24
    mov r6, #0
    add r7, sp, #4
.Ltable_outer_24:
    mov r3, r6
    mov r4, #4
.Ltable_inner_24:
    tst r3, #1
    eorne r12, r5, r3, lsr #1
    lsreq r12, r3, #1
    tst r12, #1
    eorne r3, r5, r12, lsr #1
    lsreq r3, r12, #1
    subs r4, r4, #1
    bne .Ltable_inner_24
    str r3, [r7, r6, lsl #2]
    add r6, r6, #1
    cmp r6, #256
    bcc .Ltable_outer_24
    cmp r1, #0
    mov r3, r7
    str r2, [sp]
    beq .Lfinish_24
    tst r1, #1
    sub r0, r0, #1
    beq .Leven_pairs_24
    ldrb r12, [r0, #1]!
    eor r12, r12, r2
    and r12, r12, #255
    ldr r12, [r3, r12, lsl #2]
    eor r2, r12, r2, lsr #8
.Leven_pairs_24:
    lsrs r1, r1, #1
    beq .Lfinish_24
.Lpair_loop_24:
    ldrb r12, [r0, #1]
    subs r1, r1, #1
    eor r4, r12, r2
    and r4, r4, #255
    ldrb r12, [r0, #2]!
    ldr r4, [r3, r4, lsl #2]
    eor r2, r4, r2, lsr #8
    eor r12, r12, r2
    and r12, r12, #255
    ldr r12, [r3, r12, lsl #2]
    eor r2, r12, r2, lsr #8
    bne .Lpair_loop_24
.Lfinish_24:
    str r2, [sp]
    add sp, sp, #1040
    mvn r0, r2
    pop {r4-r8}
    bx lr
.size func_002DC7A0, .-func_002DC7A0

.balign 4
.Lcrc32_polynomial_24:
    .word 0xEDB88320

.section .note.GNU-stack,"",%progbits
