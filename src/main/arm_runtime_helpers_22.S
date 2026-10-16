.syntax unified
.arm
.text
.align 2

.global func_002DAE74
.type func_002DAE74, %function
func_002DAE74:
    stmdb sp!, {r4-r9}
    mov r12, #0
    ldr r3, .Lmt_seed
    ldr r6, .Lmt_last_index
    str r3, [r0, #4]
    mov r3, #1
    mov r4, r6
.Lseed_loop:
    add r5, r0, r12, lsl #2
    ldr r7, .Lmt_seed_multiplier
    ldr r8, [r5, #4]
    subs r4, r4, #1
    add r12, r12, #1
    eor r8, r8, r8, lsr #30
    mla r7, r7, r8, r3
    add r3, r3, #1
    str r7, [r5, #8]
    bne .Lseed_loop
    mov r12, #0
    cmp r2, #624
    mov r3, r12
    str r12, [r0]
    movle r7, #624
    movgt r7, r2
    mov r12, #0
    cmp r7, #0
    mov r4, r12
    ble .Lmix2_begin
.Lmix1_loop:
    add r5, r0, #4
    add r8, r5, r3, lsl #2
    ldr r5, [r5, r3, lsl #2]
    ldr r9, .Lmt_key_multiplier
    ldr r8, [r8, #4]
    add r3, r3, #1
    eor r5, r5, r5, lsr #30
    cmp r3, r6
    mul r5, r5, r9
    add r9, r0, r3, lsl #2
    eor r5, r5, r8
    ldr r8, [r1, r12, lsl #2]
    add r5, r5, r12
    add r5, r5, r8
    str r5, [r9, #4]
    blt .Lmix1_no_i_wrap
    ldr r5, [r0, #2496]
    mov r3, #0
    str r5, [r0, #4]
.Lmix1_no_i_wrap:
    add r12, r12, #1
    cmp r12, r2
    movge r12, #0
    add r4, r4, #1
    cmp r4, r7
    blt .Lmix1_loop
.Lmix2_begin:
    mov r1, #0
.Lmix2_loop:
    add r2, r0, #4
    ldr r4, .Lmt_final_multiplier
    ldr r12, [r2, r3, lsl #2]
    add r5, r2, r3, lsl #2
    add r3, r3, #1
    ldr r2, [r5, #4]
    eor r12, r12, r12, lsr #30
    cmp r3, r6
    mul r12, r12, r4
    eor r2, r2, r12
    add r12, r0, r3, lsl #2
    sub r2, r2, r3
    str r2, [r12, #4]
    blt .Lmix2_no_i_wrap
    ldr r2, [r0, #2496]
    mov r3, #0
    str r2, [r0, #4]
.Lmix2_no_i_wrap:
    add r1, r1, #1
    cmp r1, r6
    blt .Lmix2_loop
    mov r1, #0x80000000
    str r1, [r0, #4]
    ldmia sp!, {r4-r9}
    bx lr
.Lfunc_002DAE74_end:
.size func_002DAE74, .Lfunc_002DAE74_end - func_002DAE74

.Lmt_seed:
    .word 19650218
.Lmt_last_index:
    .word 623
.Lmt_seed_multiplier:
    .word 1812433253
.Lmt_key_multiplier:
    .word 1664525
.Lmt_final_multiplier:
    .word 1566083941

.section .note.GNU-stack,"",%progbits
