.syntax unified
.arch armv6k
.arm
.fpu vfpv2
.text

.section .text.func_002DB148, "ax", %progbits
.global func_002DB148
.type func_002DB148, %function
func_002DB148:
    vldmia r1!, {s3}
    vldr s4, .L002DB148_zero
    vldmia r1, {s1-s2}
    vmul.f32 s0, s3, s3
    vmla.f32 s0, s1, s1
    vmla.f32 s0, s2, s2
    vcmp.f32 s0, s4
    vmrs APSR_nzcv, fpscr
    bne .L002DB148_normalize
    ldm r2, {r1, r3}
    ldr r2, [r2, #8]
    str r2, [r0, #8]
    stm r0, {r1, r3}
    bx lr
.L002DB148_normalize:
    vsqrt.f32 s5, s0
    vldr s4, .L002DB148_one
    vdiv.f32 s0, s4, s5
    vmul.f32 s3, s3, s0
    vmul.f32 s1, s1, s0
    vmul.f32 s0, s2, s0
    vstr s3, [r0]
    vstr s1, [r0, #4]
    vstr s0, [r0, #8]
    bx lr
.size func_002DB148, . - func_002DB148
.align 2
.L002DB148_zero:
    .float 0.0
.L002DB148_one:
    .float 1.0

.section .text.func_002DB244, "ax", %progbits
.global func_002DB244
.type func_002DB244, %function
func_002DB244:
    vdiv.f32 s6, s4, s5
    vldr s10, .L002DB244_two
    vldr s7, .L002DB244_three
    vldr s9, .L002DB244_one
    vsub.f32 s8, s0, s2
    vnmls.f32 s7, s6, s10
    vsub.f32 s2, s6, s9
    vmul.f32 s3, s6, s3
    vmul.f32 s5, s6, s6
    vmul.f32 s6, s8, s7
    vmul.f32 s1, s2, s1
    vmul.f32 s2, s4, s2
    vmla.f32 s0, s6, s5
    vadd.f32 s1, s1, s3
    vmla.f32 s0, s2, s1
    bx lr
.size func_002DB244, . - func_002DB244
.align 2
.L002DB244_two:
    .float 2.0
.L002DB244_three:
    .float 3.0
.L002DB244_one:
    .float 1.0

.section .text.func_002DB290, "ax", %progbits
.global func_002DB290
.type func_002DB290, %function
func_002DB290:
    vldr s8, [r1]
    vldr s9, [r1, #20]
    vldr s1, [r1, #40]
    vldr s10, .L002DB290_zero
    vadd.f32 s13, s8, s9
    vldr s11, .L002DB290_one
    vldr s0, .L002DB290_half
    vldr s2, [r1, #36]
    vldr s3, [r1, #24]
    vldr s4, [r1, #8]
    vldr s5, [r1, #32]
    vldr s6, [r1, #16]
    vldr s7, [r1, #4]
    vadd.f32 s12, s13, s1
    vcmpe.f32 s12, s10
    vmrs APSR_nzcv, fpscr
    ble .L002DB290_nonpositive
    vadd.f32 s1, s12, s11
    vsub.f32 s8, s2, s3
    vsub.f32 s4, s4, s5
    vsub.f32 s5, s6, s7
    vsqrt.f32 s2, s1
    vmul.f32 s3, s2, s0
    vdiv.f32 s1, s0, s2
    vstr s3, [r0, #12]
    vmul.f32 s0, s8, s1
    vmul.f32 s2, s4, s1
    vmul.f32 s1, s5, s1
    vstr s0, [r0]
    vstr s2, [r0, #4]
    vstr s1, [r0, #8]
    bx lr
.L002DB290_nonpositive:
    vcmpe.f32 s9, s8
    vmrs APSR_nzcv, fpscr
    ble .L002DB290_test_m00
    vcmpe.f32 s1, s9
    vmrs APSR_nzcv, fpscr
    bgt .L002DB290_m22_path
    vadd.f32 s1, s1, s8
    vsub.f32 s1, s9, s1
    vadd.f32 s8, s1, s11
    vsqrt.f32 s1, s8
    vmul.f32 s8, s1, s0
    vcmp.f32 s1, s10
    vmrs APSR_nzcv, fpscr
    beq .L002DB290_m11_scaled
    vdiv.f32 s9, s0, s1
    vmov.f32 s1, s9
.L002DB290_m11_scaled:
    vsub.f32 s0, s4, s5
    vadd.f32 s2, s3, s2
    vadd.f32 s3, s6, s7
    vstr s8, [r0, #4]
    vmul.f32 s0, s0, s1
    vmul.f32 s2, s2, s1
    vmul.f32 s1, s3, s1
    vstr s0, [r0, #12]
    vstr s2, [r0, #8]
    vstr s1, [r0]
    bx lr
.L002DB290_test_m00:
    vcmpe.f32 s1, s8
    vmrs APSR_nzcv, fpscr
    bgt .L002DB290_m22_path
    vadd.f32 s1, s9, s1
    vsub.f32 s1, s8, s1
    vadd.f32 s8, s1, s11
    vsqrt.f32 s1, s8
    vmul.f32 s8, s1, s0
    vcmp.f32 s1, s10
    vmrs APSR_nzcv, fpscr
    beq .L002DB290_m00_scaled
    vdiv.f32 s9, s0, s1
    vmov.f32 s1, s9
.L002DB290_m00_scaled:
    vsub.f32 s0, s2, s3
    vadd.f32 s3, s7, s6
    vadd.f32 s4, s4, s5
    vstr s8, [r0]
    add r1, r0, #4
    vmul.f32 s2, s0, s1
    vmul.f32 s0, s3, s1
    vmul.f32 s1, s4, s1
    vstmia r1, {s0-s2}
    bx lr
.L002DB290_m22_path:
    vsub.f32 s1, s1, s13
    vadd.f32 s8, s1, s11
    vsqrt.f32 s1, s8
    vmul.f32 s8, s1, s0
    vcmp.f32 s1, s10
    vmrs APSR_nzcv, fpscr
    beq .L002DB290_m22_scaled
    vdiv.f32 s9, s0, s1
    vmov.f32 s1, s9
.L002DB290_m22_scaled:
    vsub.f32 s0, s6, s7
    vadd.f32 s4, s5, s4
    vadd.f32 s3, s2, s3
    vstr s8, [r0, #8]
    vmul.f32 s0, s0, s1
    vmul.f32 s2, s4, s1
    vmul.f32 s1, s3, s1
    vstr s0, [r0, #12]
    vstr s2, [r0]
    vstr s1, [r0, #4]
    bx lr
.size func_002DB290, . - func_002DB290
.align 2
.L002DB290_zero:
    .float 0.0
.L002DB290_one:
    .float 1.0
.L002DB290_half:
    .float 0.5

.section .text.func_002DBE24, "ax", %progbits
.global func_002DBE24
.type func_002DBE24, %function
func_002DBE24:
    vldmia r2, {s7-s8}
    vldr s6, [r1]
    vldr s4, [r2, #8]
    vldr s3, [r1, #4]
    vldr s5, [r1, #8]
    vmul.f32 s2, s6, s8
    vmul.f32 s0, s3, s4
    vmul.f32 s1, s5, s7
    vmls.f32 s2, s3, s7
    vmls.f32 s0, s5, s8
    vmls.f32 s1, s6, s4
    vstmia r0, {s0-s2}
    bx lr
.size func_002DBE24, . - func_002DBE24

.macro two_float_setter name, field
.section .text.\name, "ax", %progbits
.global \name
.type \name, %function
\name:
    ldr r2, [r0]
    vldr s1, [r1]
    vldr s0, [r1, #4]
    add r3, r2, #\field
    vldr s2, [r2, #\field]
    vcmp.f32 s2, s1
    vmrs APSR_nzcv, fpscr
    vldreq s2, [r3, #4]
    vcmpeq.f32 s2, s0
    vmrseq APSR_nzcv, fpscr
    beq 1f
    add r2, r2, #\field
    mov r1, #1
    vstr s1, [r2]
    vstr s0, [r2, #4]
    ldr r0, [r0]
    strb r1, [r0, #36]
1:
    bx lr
.size \name, . - \name
.endm

two_float_setter func_0030FDF8, 28
two_float_setter func_0030FE40, 16

.section .text.func_00324BE0, "ax", %progbits
.global func_00324BE0
.type func_00324BE0, %function
func_00324BE0:
    push {r4}
    ldrb r4, [r0, #38]
    ldr r12, [r0, #1648]
    vldmia r2, {s3-s4}
    and r2, r4, #255
    vmov s0, r2
    vldmia r1, {s1-s2}
    add r1, r12, r4, lsl #4
    add r3, r2, #1
    vstmia r1, {s1-s4}
    add r2, r0, #1024
    vcvt.f32.u32 s0, s0
    vstr s0, [r2, #604]
    strb r3, [r0, #38]
    pop {r4}
    bx lr
.size func_00324BE0, . - func_00324BE0

.section .text.func_003979D4, "ax", %progbits
.global func_003979D4
.type func_003979D4, %function
func_003979D4:
    rsb r1, r1, r1, lsl #5
    ldr r0, [r0, #108]
    add r1, r1, r1, lsl #1
    add r0, r0, r1, lsl #2
    add r0, r0, #328
    ldr r1, [r0, #36]
    cmp r1, #0
    ldrne r1, [r1, r2, lsl #2]
    cmpne r1, #0
    beq .L003979D4_done
    mov r12, #1
    str r12, [r1]
    ldr r0, [r0, #36]
    vldmia r3, {s0-s3}
    ldr r0, [r0, r2, lsl #2]
    add r0, r0, #12
    vstmia r0, {s0-s3}
.L003979D4_done:
    bx lr
.size func_003979D4, . - func_003979D4

.section .text.func_0039B308, "ax", %progbits
.global func_0039B308
.type func_0039B308, %function
func_0039B308:
    push {r4, lr}
    sub sp, sp, #16
    mov r4, r0
    mov r0, sp
    vstmia r0, {s0-s2}
    ldm r0, {r1, r2}
    ldr r0, [r0, #8]
    str r0, [r4, #240]
    add r4, r4, #232
    stm r4, {r1, r2}
    add sp, sp, #16
    pop {r4, pc}
.size func_0039B308, . - func_0039B308
