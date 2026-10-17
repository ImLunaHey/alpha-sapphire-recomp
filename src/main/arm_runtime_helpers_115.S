.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00540704, "ax", %progbits
.balign 4
.global func_00540704
.type func_00540704, %function
func_00540704:
    vsub.f32 s2, s0, s1
    vldr s4, .Ltolerance_zero_115
    vldr s3, .Ltolerance_epsilon_115
    vcmpe.f32 s2, s4
    vmrs APSR_nzcv, fpscr
    vcmpe.f32 s0, s4
    vnegcc.f32 s2, s2
    vmrs APSR_nzcv, fpscr
    vnegcc.f32 s0, s0
    vmul.f32 s0, s0, s3
    vcmpe.f32 s0, s2
    vmrs APSR_nzcv, fpscr
    bge .Ltolerance_true_115
    vcmpe.f32 s1, s4
    vmrs APSR_nzcv, fpscr
    vnegcc.f32 s1, s1
    vmul.f32 s0, s1, s3
    vcmpe.f32 s0, s2
    vmrs APSR_nzcv, fpscr
    movlt r0, #0
    blt .Ltolerance_return_115
.Ltolerance_true_115:
    mov r0, #1
.Ltolerance_return_115:
    bx lr
.size func_00540704, . - func_00540704
.Ltolerance_epsilon_115:
    .float 0.00000011920928955078125
.Ltolerance_zero_115:
    .float 0.0

.section .text.func_00548C14, "ax", %progbits
.balign 4
.global func_00548C14
.type func_00548C14, %function
func_00548C14:
    vldr s1, [r0, #24]
    vldr s3, .Lrecord_scale_115
    ldr r2, [r0, #32]
    vdiv.f32 s2, s0, s1
    ldrh r3, [r2]
    vmul.f32 s1, s2, s3
    vcvt.s32.f32 s1, s1
    vmov r1, s1
    cmp r3, r1
    movhi r0, r2
    bxhi lr
    str r4, [sp, #-4]!
    ldrh r12, [r0, #14]
    mvn r3, #5
    add r4, r12, r12, lsl #1
    add r3, r3, r4, lsl #1
    add r3, r3, r2
    ldrh r4, [r3]
    cmp r1, r4
    movcs r0, r3
    bcs .Lrecord_return_115
    sub r3, r12, #1
    vmov s1, r3
    vldr s2, [r0, #28]
    vcvt.f32.s32 s1, s1
    vmul.f32 s0, s1, s0
    vmul.f32 s0, s2, s0
    vcvt.u32.f32 s0, s0
    vmov r0, s0
    add r0, r0, r0, lsl #1
    add r0, r2, r0, lsl #1
    ldrh r2, [r0]
    cmp r1, r2
    bcs .Lrecord_forward_115
.Lrecord_backward_115:
    ldrh r2, [r0, #-6]!
    cmp r2, r1
    bhi .Lrecord_backward_115
.Lrecord_return_115:
    ldr r4, [sp], #4
    bx lr
.Lrecord_forward_115:
    ldrh r2, [r0, #6]!
    cmp r2, r1
    bls .Lrecord_forward_115
    ldr r4, [sp], #4
    sub r0, r0, #6
    bx lr
.size func_00548C14, . - func_00548C14
.Lrecord_scale_115:
    .float 32.0

.section .text.func_00572B94, "ax", %progbits
.balign 4
.global func_00572B94
.type func_00572B94, %function
func_00572B94:
    push {r4, r5, r6, r7}
    ldr r2, [r0, #4]
    ldr r12, [r0]
    mov r5, r2
    cmp r12, r2
    beq .Lspan_return_115
    ldr r4, .Lspan_reciprocal_115
    mov r3, r12
    cmp r2, r3
    movls r1, #0
    bls .Lspan_quotient_115
    sub r1, r2, r3
    smull r6, r1, r4, r1
    asr r6, r1, #1
    sub r1, r6, r1, asr #31
    and r1, r1, #1
.Lspan_quotient_115:
    sub r6, r2, r3
    add r1, r1, #1
    smull r7, r6, r4, r6
    asr r7, r6, #1
    sub r6, r7, r6, asr #31
    add r6, r6, #1
    cmp r6, r1
    ble .Lspan_store_115
    sub r3, r2, r12
    smull r6, r3, r4, r3
    asr r6, r3, #1
    sub r3, r6, r3, asr #31
    add r3, r3, #1
.Lspan_loop_115:
    add r1, r1, #2
    cmp r3, r1
    bgt .Lspan_loop_115
.Lspan_store_115:
    sub r1, r2, r12
    smull r3, r1, r4, r1
    asr r3, r1, #1
    sub r1, r3, r1, asr #31
    sub r1, r1, r1, lsl #2
    add r1, r2, r1, lsl #2
    str r1, [r0, #4]
.Lspan_return_115:
    pop {r4, r5, r6, r7}
    bx lr
.size func_00572B94, . - func_00572B94
.Lspan_reciprocal_115:
    .word 0x2AAAAAAB

.section .note.GNU-stack, "", %progbits
