.syntax unified
.arch armv6k
.arm

.section .text.func_002DAC28,"ax",%progbits
.balign 4
.global func_002DAC28
.type func_002DAC28, %function
func_002DAC28:
    mov r1, #1
    str r4, [sp, #-4]!
    str r1, [r0, #2720]
    add r1, r0, #2048
    add r1, r1, #724
    mov r12, #45056
    ldr r3, .Lruntime_descriptor_25
    strh r12, [r1, #8]
    mov r2, #4
    mov r4, #7
    strb r4, [r0, #2782]
    strd r2, r3, [r1]
    add r1, r0, #2784
    orr r12, r12, r2, asr #2
    add r0, r0, #2048
    strh r12, [r1, #8]
    add r0, r0, #660
    strb r2, [r1, #10]
    str r0, [r1, #4]
    str r2, [r1]
    ldr r4, [sp], #4
    bx lr
.size func_002DAC28, .-func_002DAC28
.Lruntime_descriptor_25:
    .word runtime_descriptor_25
.global runtime_descriptor_25

.section .text.func_002DAFBC,"ax",%progbits
.balign 4
.global func_002DAFBC
.type func_002DAFBC, %function
func_002DAFBC:
    ldr r1, .Lprng_constant_a_25
    push {r4, r5}
    ldr r12, .Lprng_constant_b_25
    ldr r5, .Lprng_constant_c_25
    str r1, [r0, #8]
    mov r4, #0
    str r12, [r0, #12]
    str r4, [r0, #20]
    str r5, [r0, #16]
    strd r2, r3, [r0]
    pop {r4, r5}
    bx lr
.size func_002DAFBC, .-func_002DAFBC
.Lprng_constant_a_25:
    .word 1812433253
.Lprng_constant_b_25:
    .word 1566083941
.Lprng_constant_c_25:
    .word runtime_prng_parameter_c_25
.global runtime_prng_parameter_c_25

.section .text.func_002DB1B0,"ax",%progbits
.balign 4
.fpu vfpv2
.global func_002DB1B0
.type func_002DB1B0, %function
func_002DB1B0:
    vldr s1, .Linterp_scale_25
    ldr r1, .Linterp_table_25
    vmul.f32 s1, s0, s1
    vcvt.u32.f32 s0, s1
    vmov r0, s0
    uxth r0, r0
    vmov s0, r0
    add r0, r1, r0, lsl #3
    vldr s2, [r0, #4]
    vcvt.f32.u32 s0, s0
    vsub.f32 s1, s1, s0
    vldr s0, [r0]
    vmla.f32 s0, s1, s2
    bx lr
.size func_002DB1B0, .-func_002DB1B0
.Linterp_scale_25:
    .float 32.0
.Linterp_table_25:
    .word runtime_interpolation_table_25
.global runtime_interpolation_table_25

.section .note.GNU-stack,"",%progbits
