.syntax unified
.arm

.section .text.func_002D0318, "ax", %progbits
.align 2
.global func_002D0318
.type func_002D0318, %function
func_002D0318:
    mov r2, r1
    ldrb r1, [r0, #4]
    cmp r1, #0
    beq .Lfunc_002D0318_fail_early
    ldr r1, [r0]
    ldrb r0, [r1, #68]
    cmp r0, #0
    beq .Lfunc_002D0318_owner_ok
.Lfunc_002D0318_fail_early:
    mov r0, #0
    bx lr
.Lfunc_002D0318_owner_ok:
    mov r0, r2
    mov r0, r0
    ldrb r2, [r1, #74]
    add r1, r1, #8192
    add r1, r1, #4
    cmp r2, #0
    ldrbne r2, [r1, #35]
    cmpne r2, #0
    beq .Lfunc_002D0318_fail
    ldr r2, [r1, #24]
    cmp r2, #20
    beq .Lfunc_002D0318_copy
.Lfunc_002D0318_fail:
    mov r0, #0
    bx lr
.Lfunc_002D0318_copy:
    ldr r2, [r1, #28]
    mov r1, #0
    ldr r3, [r2]
    str r3, [r0]
    ldr r3, [r2, #4]
    str r3, [r0, #4]
    ldr r3, [r2, #8]
    str r3, [r0, #8]
    ldr r3, [r2, #12]
    str r3, [r0, #12]
    ldr r2, [r2, #16]
    str r2, [r0, #16]
    strb r1, [r0, #19]
    mov r0, #20
    bx lr
.size func_002D0318, . - func_002D0318

.section .text.func_002DCC60, "ax", %progbits
.align 2
.global func_002DCC60
.type func_002DCC60, %function
func_002DCC60:
    ldr r3, [r0, #16]
    cmp r3, #0
    ldrheq r3, [r0, #32]
    beq .Lfunc_002DCC60_compute
    cmp r3, #3
    mvncs r0, #0
    movcc r0, #0
    bx lr
.Lfunc_002DCC60_compute:
    push {r4, r5}
    ldrh r4, [r0, #34]
    mov r5, #83
    mov r12, #5
    add r12, r12, r3, lsl #1
    mul r4, r4, r5
    mov r3, #3
    bic r12, r12, #3
    cmp r1, #0
    add r3, r3, r4, lsl #1
    bic r3, r3, #3
    add r3, r3, r12
    addne r3, r3, #68
    ldr r0, [r0, #28]
    cmp r2, #0
    addne r3, r3, #41984
    addne r3, r3, #108
    tst r0, #1
    mov r1, r12
    addne r1, r12, #68
    tst r0, #2
    addne r1, r1, #41984
    addne r1, r1, #108
    cmp r3, r1
    movcs r1, r3
    add r0, r1, #3840
    add r0, r0, #255
    pop {r4, r5}
    lsr r0, r0, #12
    lsl r0, r0, #12
    bx lr
.size func_002DCC60, . - func_002DCC60

.section .note.GNU-stack, "", %progbits
