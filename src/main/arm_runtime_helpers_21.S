.syntax unified
.arm
.text
.align 2

.global func_002D30F4
.type func_002D30F4, %function
func_002D30F4:
    ldrb r2, [r1, #74]
    add r1, r1, #8192
    add r1, r1, #4
    cmp r2, #0
    ldrbne r2, [r1, #23]
    cmpne r2, #0
    beq .L002D30F4_fail
    ldr r2, [r1, #12]
    ldr r1, [r1, #16]
    cmp r2, #1
    bls .L002D30F4_fail
    add r3, r1, r2
    ldrb r3, [r3, #-1]
    cmp r3, #0
    beq .L002D30F4_success
.L002D30F4_fail:
    mov r0, #0
    bx lr
.L002D30F4_success:
    sub r2, r2, #1
    stm r0, {r1, r2}
    mov r0, #1
    bx lr
.size func_002D30F4, . - func_002D30F4

.global func_002D3148
.type func_002D3148, %function
func_002D3148:
    add r3, r1, #8192
    cmp r2, #4
    add r3, r3, #4
    bcs .L002D3148_fail
    ldrb r12, [r1, #74]
    add r1, r2, #11
    cmp r12, #0
    beq .L002D3148_fail
    add r1, r1, r1, lsl #1
    add r2, r3, r1, lsl #2
    ldrb r12, [r2, #11]
    cmp r12, #0
    beq .L002D3148_fail
    ldr r2, [r2, #4]
    str r2, [r0]
    ldr r1, [r3, r1, lsl #2]
    cmp r1, #0
    str r1, [r0, #4]
    movne r0, #1
    bne .L002D3148_done
.L002D3148_fail:
    mov r0, #0
.L002D3148_done:
    bx lr
.size func_002D3148, . - func_002D3148

.global func_002DAFF8
.type func_002DAFF8, %function
func_002DAFF8:
    push {r4-r8}
    add r2, r0, #8
    ldr r4, [r0]
    ldm r2, {r2, r6, r12}
    ldr r3, [r0, #4]
    ldr r5, [r0, #20]
    umull r7, r8, r2, r4
    mla r4, r6, r4, r8
    mla r2, r2, r3, r4
    adds r3, r7, r12
    adc r2, r2, r5
    str r2, [r0, #4]
    str r3, [r0]
    mov r0, r2
    cmp r1, #0
    umullne r1, r0, r0, r1
    pop {r4-r8}
    bx lr
.size func_002DAFF8, . - func_002DAFF8

.section .note.GNU-stack,"",%progbits
