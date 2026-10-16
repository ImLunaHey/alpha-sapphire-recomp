.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0031DC98, "ax", %progbits
.balign 4
.global func_0031DC98
.type func_0031DC98, %function
func_0031DC98:
    cmp r2, #0
    ldrne r12, .Lruntime_halfword_fill_38
    stm r0, {r1, r2}
    movne r1, #0
    beq 2f
1:
    ldr r3, [r0]
    subs r2, r2, #1
    add r3, r3, r1, lsl #1
    add r1, r1, #1
    strh r12, [r3]
    bne 1b
2:
    bx lr
.size func_0031DC98, . - func_0031DC98
.Lruntime_halfword_fill_38:
    .word runtime_halfword_fill_38
.global runtime_halfword_fill_38

.section .text.func_0031E680, "ax", %progbits
.balign 4
.global func_0031E680
.type func_0031E680, %function
func_0031E680:
    push {r4}
    cmp r2, #0
    stm r0, {r1, r2}
    mov r1, #0
    movhi r12, #0
    bls 2f
1:
    ldr r4, [r0]
    mov r3, r1
    add r1, r1, #1
    cmp r1, r2
    str r12, [r4, r3, lsl #2]
    bcc 1b
2:
    pop {r4}
    bx lr
.size func_0031E680, . - func_0031E680

.section .text.func_0031E6B8, "ax", %progbits
.balign 4
.global func_0031E6B8
.type func_0031E6B8, %function
func_0031E6B8:
    push {r0, r1, r2, r3}
    ldr r12, [sp, #8]
    cmp r12, #0
    moveq r2, #0
    beq 1f
    ldr r2, [r1]
    add r2, r2, r3
    sub r3, r3, #1
    sub r2, r2, #1
    bic r2, r2, r3
    add r3, r2, r12
    str r3, [r1]
1:
    stm r0, {r2, r12}
    add sp, sp, #16
    bx lr
.size func_0031E6B8, . - func_0031E6B8

.section .text.func_0031E6F8, "ax", %progbits
.balign 4
.global func_0031E6F8
.type func_0031E6F8, %function
func_0031E6F8:
    vldr s0, [r1, #4]
    vldr s3, [r1, #20]
    vldr s2, .Lruntime_float_zero_38_a
    vmul.f32 s1, s0, s0
    vldr s4, .Lruntime_float_unit_38_a
    vmla.f32 s1, s3, s3
    vcmp.f32 s1, s2
    vmrs APSR_nzcv, fpscr
    vmoveq.f32 s0, s2
    vmoveq.f32 s1, s4
    beq 1f
    vsqrt.f32 s5, s1
    vdiv.f32 s1, s4, s5
    vmul.f32 s0, s0, s1
    vmul.f32 s1, s3, s1
1:
    add r1, r0, #20
    vstr s1, [r0]
    vstr s0, [r0, #4]
    vstr s4, [r0, #40]
    vstr s2, [r0, #8]
    vneg.f32 s0, s0
    vstmia r1, {s1-s2}
    vstr s2, [r0, #32]
    vstr s2, [r0, #36]
    vstr s0, [r0, #16]
    bx lr
.size func_0031E6F8, . - func_0031E6F8
.Lruntime_float_zero_38_a:
    .word runtime_float_zero_38
.Lruntime_float_unit_38_a:
    .word runtime_float_unit_38

.section .text.func_0031EE40, "ax", %progbits
.balign 4
.global func_0031EE40
.type func_0031EE40, %function
func_0031EE40:
    vldr s3, [r2, #4]
    vldr s1, [r1]
    add r3, r1, #4
    vldr s0, [r2, #20]
    vmul.f32 s1, s1, s3
    vldmia r3, {s4-s5}
    add r1, r1, #16
    vldr s2, [r2, #36]
    vmla.f32 s1, s4, s0
    vmla.f32 s1, s5, s2
    vldmia r1, {s4-s6}
    vmul.f32 s3, s4, s3
    vldr s4, .Lruntime_float_unit_38_b
    vmla.f32 s3, s5, s0
    vmul.f32 s0, s1, s1
    vmla.f32 s3, s6, s2
    vldr s2, .Lruntime_float_zero_38_b
    vmla.f32 s0, s3, s3
    vcmp.f32 s0, s2
    vmrs APSR_nzcv, fpscr
    vmoveq.f32 s1, s2
    vmoveq.f32 s0, s4
    beq 1f
    vsqrt.f32 s5, s0
    vdiv.f32 s0, s4, s5
    vmul.f32 s1, s1, s0
    vmul.f32 s0, s3, s0
1:
    vstr s0, [r0]
    vstr s0, [r0, #20]
    vstr s1, [r0, #4]
    vneg.f32 s0, s1
    vstr s4, [r0, #40]
    vstr s2, [r0, #8]
    vstr s2, [r0, #24]
    vstr s2, [r0, #32]
    vstr s2, [r0, #36]
    vstr s0, [r0, #16]
    bx lr
.size func_0031EE40, . - func_0031EE40
.Lruntime_float_zero_38_b:
    .word runtime_float_zero_38
.Lruntime_float_unit_38_b:
    .word runtime_float_unit_38

.section .text.func_0031F044, "ax", %progbits
.balign 4
.global func_0031F044
.type func_0031F044, %function
func_0031F044:
    vldmia r1!, {s3}
    vldr s4, .Lruntime_float_zero_38_c
    vldmia r1, {s1-s2}
    vmul.f32 s0, s3, s3
    vmla.f32 s0, s1, s1
    vmla.f32 s0, s2, s2
    vcmp.f32 s0, s4
    vmrs APSR_nzcv, fpscr
    moveq r0, #0
    beq 1f
    vsqrt.f32 s5, s0
    vldr s4, .Lruntime_float_unit_38_c
    vdiv.f32 s0, s4, s5
    vmul.f32 s3, s3, s0
    vmul.f32 s1, s1, s0
    vmul.f32 s0, s2, s0
    vstr s3, [r0]
    vstr s1, [r0, #4]
    vstr s0, [r0, #8]
    mov r0, #1
1:
    bx lr
.size func_0031F044, . - func_0031F044
.Lruntime_float_zero_38_c:
    .word runtime_float_zero_38
.Lruntime_float_unit_38_c:
    .word runtime_float_unit_38

.global runtime_float_zero_38
.global runtime_float_unit_38
