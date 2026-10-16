.syntax unified
.arch armv6k
.arm
.fpu vfpv2
.text

.section .text.func_00195DD0, "ax", %progbits
.align 2
.global func_00195DD0
.type func_00195DD0, %function
func_00195DD0:
    vldmia r1, {s0-s2}
    add r1, r1, #16
    vldmia r1, {s3-s5}
    add r1, r1, #16
    vldmia r1, {s6-s8}
    vmul.f32 s10, s0, s4
    vmul.f32 s11, s1, s5
    vmul.f32 s12, s2, s3
    vmul.f32 s13, s6, s4
    vmul.f32 s14, s3, s1
    vmul.f32 s15, s0, s7
    vmul.f32 s10, s10, s8
    vmul.f32 s11, s11, s6
    vmul.f32 s12, s12, s7
    vmls.f32 s10, s13, s2
    vmls.f32 s11, s14, s8
    vmls.f32 s12, s15, s5
    vadd.f32 s10, s10, s11
    vldr s15, .L00195DD0_one
    vadd.f32 s10, s10, s12
    vmov r2, s10
    cmp r2, #0x80000000
    cmpne r2, #0
    moveq r0, #0
    bxeq lr
    vpush {d8-d12}
    vdiv.f32 s15, s15, s10
    vmul.f32 s16, s4, s8
    vmul.f32 s17, s1, s8
    vmul.f32 s18, s1, s5
    vmul.f32 s19, s3, s8
    vmul.f32 s20, s0, s8
    vmul.f32 s21, s0, s5
    vmul.f32 s22, s3, s7
    vmul.f32 s23, s0, s7
    vmul.f32 s24, s0, s4
    vmls.f32 s16, s7, s5
    vmls.f32 s17, s7, s2
    vmls.f32 s18, s4, s2
    vmls.f32 s19, s6, s5
    vmls.f32 s20, s6, s2
    vmls.f32 s21, s3, s2
    vmls.f32 s22, s6, s4
    vmls.f32 s23, s6, s1
    vmls.f32 s24, s3, s1
    vmul.f32 s0, s16, s15
    vnmul.f32 s1, s17, s15
    vmul.f32 s2, s18, s15
    vnmul.f32 s4, s19, s15
    vmul.f32 s5, s20, s15
    vnmul.f32 s6, s21, s15
    vmul.f32 s8, s22, s15
    vldr s12, [r1, #-20]
    vnmul.f32 s9, s23, s15
    vmul.f32 s10, s24, s15
    vnmul.f32 s3, s0, s12
    vldr s13, [r1, #-4]
    vnmul.f32 s7, s4, s12
    vnmul.f32 s11, s8, s12
    vmls.f32 s3, s1, s13
    vldr s14, [r1, #12]
    vmls.f32 s7, s5, s13
    vmls.f32 s11, s9, s13
    vmls.f32 s3, s2, s14
    vmls.f32 s7, s6, s14
    vmls.f32 s11, s10, s14
    vpop {d8-d12}
    vstmia r0, {s0-s11}
    mov r0, #1
    bx lr
.size func_00195DD0, . - func_00195DD0
.align 2
.L00195DD0_one:
    .float 1.0

.section .text.func_00195EEC, "ax", %progbits
.align 2
.global func_00195EEC
.type func_00195EEC, %function
func_00195EEC:
    vldmia r1, {s0-s2}
    add r1, r1, #16
    vldmia r1, {s3-s5}
    add r1, r1, #16
    vldmia r1, {s6-s8}
    vmul.f32 s10, s0, s4
    vmul.f32 s11, s1, s5
    vmul.f32 s12, s2, s3
    vmul.f32 s13, s6, s4
    vmul.f32 s14, s3, s1
    vmul.f32 s15, s0, s7
    vmul.f32 s10, s10, s8
    vmul.f32 s11, s11, s6
    vmul.f32 s12, s12, s7
    vmls.f32 s10, s13, s2
    vmls.f32 s11, s14, s8
    vmls.f32 s12, s15, s5
    vadd.f32 s10, s10, s11
    vldr s15, .L00195EEC_one
    vadd.f32 s10, s10, s12
    vmov r2, s10
    cmp r2, #0x80000000
    cmpne r2, #0
    moveq r0, #0
    bxeq lr
    vpush {d8-d12}
    vdiv.f32 s15, s15, s10
    vmul.f32 s16, s4, s8
    vmul.f32 s17, s3, s8
    vmul.f32 s18, s3, s7
    vmul.f32 s19, s1, s8
    vmul.f32 s20, s0, s8
    vmul.f32 s21, s0, s7
    vmul.f32 s22, s1, s5
    vmul.f32 s23, s0, s5
    vmul.f32 s24, s0, s4
    vmls.f32 s16, s7, s5
    vmls.f32 s17, s6, s5
    vmls.f32 s18, s6, s4
    vmls.f32 s19, s7, s2
    vmls.f32 s20, s6, s2
    vmls.f32 s21, s6, s1
    vmls.f32 s22, s4, s2
    vmls.f32 s23, s3, s2
    vmls.f32 s24, s3, s1
    vmul.f32 s0, s16, s15
    vnmul.f32 s1, s17, s15
    vmul.f32 s2, s18, s15
    vnmul.f32 s4, s19, s15
    vmul.f32 s5, s20, s15
    vnmul.f32 s6, s21, s15
    vmul.f32 s8, s22, s15
    vnmul.f32 s9, s23, s15
    vmul.f32 s10, s24, s15
    vldr s3, .L00195EEC_zero
    vldr s7, .L00195EEC_zero
    vldr s11, .L00195EEC_zero
    vpop {d8-d12}
    vstmia r0, {s0-s11}
    mov r0, #1
    bx lr
.size func_00195EEC, . - func_00195EEC
.align 2
.L00195EEC_one:
    .float 1.0
.L00195EEC_zero:
    .float 0.0

.section .text.func_00196038, "ax", %progbits
.align 2
.global func_00196038
.type func_00196038, %function
func_00196038:
    vldr s0, [r1]
    vldr s1, [r1, #16]
    vldr s2, [r1, #32]
    vldr s3, .L00196038_zero
    vldr s4, [r1, #4]
    vldr s5, [r1, #20]
    vldr s6, [r1, #36]
    vldr s7, .L00196038_zero
    vldr s8, [r1, #8]
    vldr s9, [r1, #24]
    vldr s10, [r1, #40]
    vldr s11, .L00196038_zero
    vstmia r0, {s0-s11}
    bx lr
.size func_00196038, . - func_00196038
.align 2
.L00196038_zero:
    .float 0.0

.section .note.GNU-stack, "", %progbits
