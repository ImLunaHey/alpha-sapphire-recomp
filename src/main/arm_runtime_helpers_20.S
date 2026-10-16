.syntax unified
.arch armv6k
.arm
.fpu vfpv2

.section .text.func_002DB434, "ax", %progbits
.align 2
.global func_002DB434
.type func_002DB434, %function
func_002DB434:
    vldmia r1, {s0-s1}
    cmp r2, #0
    vldr s3, [r1, #8]
    vldr s2, [r1, #12]
    vmul.f32 s5, s0, s0
    vldr s7, .L002DB434_two
    vldr s6, .L002DB434_one
    vmla.f32 s5, s1, s1
    vmla.f32 s5, s3, s3
    vmla.f32 s5, s2, s2
    vdiv.f32 s4, s7, s5
    vmul.f32 s5, s1, s4
    vmul.f32 s7, s0, s4
    vmul.f32 s4, s3, s4
    vmul.f32 s9, s1, s5
    vmul.f32 s8, s0, s7
    vmul.f32 s3, s3, s4
    vmul.f32 s10, s1, s4
    vmul.f32 s7, s2, s7
    vmul.f32 s1, s2, s5
    vmul.f32 s5, s0, s5
    vmul.f32 s2, s2, s4
    vmul.f32 s0, s0, s4
    vadd.f32 s11, s9, s3
    vadd.f32 s12, s8, s3
    vadd.f32 s9, s8, s9
    vsub.f32 s8, s10, s7
    vadd.f32 s7, s10, s7
    vsub.f32 s3, s5, s2
    vadd.f32 s2, s5, s2
    vadd.f32 s4, s0, s1
    vsub.f32 s5, s0, s1
    vsub.f32 s0, s6, s11
    vsub.f32 s10, s6, s12
    vsub.f32 s6, s6, s9
    beq .L002DB434_no_column_write
    vldr s1, .L002DB434_zero
    vstr s1, [r0, #12]
    vstr s1, [r0, #28]
    vstr s1, [r0, #44]
.L002DB434_no_column_write:
    vstr s0, [r0]
    vstr s2, [r0, #16]
    vstr s10, [r0, #20]
    vstr s8, [r0, #24]
    vstr s5, [r0, #32]
    vstr s7, [r0, #36]
    vstr s6, [r0, #40]
    add r1, r0, #4
    vstmia r1, {s3-s4}
    bx lr
.size func_002DB434, . - func_002DB434
.align 2
.L002DB434_two:
    .float 2.0
.L002DB434_one:
    .float 1.0
.L002DB434_zero:
    .float 0.0

.section .text.func_002DB508, "ax", %progbits
.align 2
.global func_002DB508
.type func_002DB508, %function
func_002DB508:
    vldr s6, .L002DB508_one
    vsub.f32 s11, s3, s2
    vadd.f32 s8, s3, s2
    vsub.f32 s13, s1, s0
    vadd.f32 s9, s1, s0
    vldr s1, .L002DB508_negative_one
    vsub.f32 s12, s5, s4
    vldr s10, .L002DB508_two
    vstr s1, [r0, #56]
    vmul.f32 s7, s5, s4
    vldr s0, .L002DB508_zero
    vmul.f32 s4, s4, s10
    vstr s0, [r0, #4]
    vstr s0, [r0, #12]
    vdiv.f32 s1, s6, s13
    vstr s0, [r0, #16]
    vstr s0, [r0, #28]
    vstr s0, [r0, #32]
    vstr s0, [r0, #36]
    vstr s0, [r0, #48]
    vstr s0, [r0, #52]
    vstr s0, [r0, #60]
    vdiv.f32 s3, s6, s11
    vmul.f32 s0, s8, s3
    vmul.f32 s3, s4, s3
    vdiv.f32 s2, s6, s12
    vmul.f32 s6, s4, s1
    vmul.f32 s1, s9, s1
    vmul.f32 s7, s7, s2
    vmul.f32 s2, s5, s2
    vstr s6, [r0]
    vstr s1, [r0, #8]
    vstr s3, [r0, #20]
    vstr s0, [r0, #24]
    vstr s2, [r0, #40]
    vstr s7, [r0, #44]
    bx lr
.size func_002DB508, . - func_002DB508
.align 2
.L002DB508_one:
    .float 1.0
.L002DB508_two:
    .float 2.0
.L002DB508_zero:
    .float 0.0
.L002DB508_negative_one:
    .float -1.0

.section .text.func_002DC604, "ax", %progbits
.align 2
.global func_002DC604
.type func_002DC604, %function
func_002DC604:
    vldr s0, .L002DC604_zero
    vstr s0, [r0, #80]
    vstr s0, [r0, #92]
    bx lr
.size func_002DC604, . - func_002DC604
.align 2
.L002DC604_zero:
    .float 0.0
