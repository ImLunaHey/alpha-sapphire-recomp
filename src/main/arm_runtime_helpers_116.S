.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_004C01E8, "ax", %progbits
.balign 4
.global func_004C01E8
.type func_004C01E8, %function
func_004C01E8:
    ldr r0, [r0]
    ldr r1, .L116_func_004C01E8_28
    ldr r0, [r0, #8]
    cmp r0, r1
    movls r0, #1
    movhi r0, #0
    bx lr
.L116_func_004C01E8_body_end:
.L116_func_004C01E8_28:
    .word runtime_literal_116_1
.size func_004C01E8, .L116_func_004C01E8_body_end - func_004C01E8

.section .text.func_004C5898, "ax", %progbits
.balign 4
.global func_004C5898
.type func_004C5898, %function
func_004C5898:
    vmov.f32 s5, s0
    vldr s9, .L116_func_004C5898_56
    vadd.f32 s6, s2, s4
    vmov.f32 s0, s1
    vsub.f32 s1, s1, s3
    vnmls.f32 s4, s2, s9
    vldr s8, .L116_func_004C5898_60
    vldr s7, .L116_func_004C5898_64
    vmla.f32 s6, s1, s8
    vmls.f32 s4, s1, s7
    vmla.f32 s4, s6, s5
    vmla.f32 s2, s5, s4
    vmla.f32 s0, s5, s2
    bx lr
.L116_func_004C5898_body_end:
.L116_func_004C5898_56:
    .word runtime_curve_coefficient_c_46
.L116_func_004C5898_60:
    .word runtime_curve_coefficient_a_46
.L116_func_004C5898_64:
    .word runtime_curve_coefficient_b_46
.size func_004C5898, .L116_func_004C5898_body_end - func_004C5898

.section .text.func_004C79A0, "ax", %progbits
.balign 4
.global func_004C79A0
.type func_004C79A0, %function
func_004C79A0:
    vldr s2, .L116_func_004C79A0_68
    vcmpe.f32 s1, s2
    vmrs APSR_nzcv, fpscr
    vcmpe.f32 s0, s2
    movgt r0, #4
    movle r0, #0
    movcc r1, #8
    movcs r1, #0
    vmrs APSR_nzcv, fpscr
    orr r0, r0, r1
    movcc r1, #1
    movcs r1, #0
    orr r0, r0, r1
    movgt r1, #2
    movle r1, #0
    orr r0, r0, r1
    bx lr
.L116_func_004C79A0_body_end:
.L116_func_004C79A0_68:
    .word runtime_float_zero_38
.size func_004C79A0, .L116_func_004C79A0_body_end - func_004C79A0

.section .text.func_004E6B04, "ax", %progbits
.balign 4
.global func_004E6B04
.type func_004E6B04, %function
func_004E6B04:
    ldrh r0, [r0, #2]
    ldr r1, .L116_func_004E6B04_24
    cmp r0, r1
    movls r0, #1
    movhi r0, #0
    bx lr
.L116_func_004E6B04_body_end:
.L116_func_004E6B04_24:
    .word runtime_scalar_threshold_99
.size func_004E6B04, .L116_func_004E6B04_body_end - func_004E6B04

.section .text.func_004EA690, "ax", %progbits
.balign 4
.global func_004EA690
.type func_004EA690, %function
func_004EA690:
    ldr r0, [r0, #8]
    ldr r1, .L116_func_004EA690_24
    cmp r0, r1
    moveq r0, #1
    movne r0, #0
    bx lr
.L116_func_004EA690_body_end:
.L116_func_004EA690_24:
    .word runtime_literal_116_2
.size func_004EA690, .L116_func_004EA690_body_end - func_004EA690

.section .text.func_004EDAE0, "ax", %progbits
.balign 4
.global func_004EDAE0
.type func_004EDAE0, %function
func_004EDAE0:
    push {r4, r5}
    ldr r5, [r0, #20]
    mov r4, #2
    ldr ip, .L116_func_004EDAE0_72
    add r5, r5, r1, lsl #2
    add r1, r4, r1, lsl #2
    ldrh r4, [r5]
    str r4, [r2]
    ldr r0, [r0, #20]
    ldrh r0, [r0, r1]
    str r0, [r3]
    ldr r1, [r2]
    pop {r4, r5}
    cmp r1, ip
    cmpne r0, ip
    moveq r0, #0
    movne r0, #1
    bx lr
.L116_func_004EDAE0_body_end:
.L116_func_004EDAE0_72:
    .word runtime_halfword_fill_38
.size func_004EDAE0, .L116_func_004EDAE0_body_end - func_004EDAE0

.section .note.GNU-stack, "", %progbits
