.syntax unified
.arch armv6k
.arm
.fpu vfpv2
.text

.section .text.func_00195C78, "ax", %progbits
.global func_00195C78
.type func_00195C78, %function
func_00195C78:
    vpush {d8-d10}
    vldr s3, [r1, #12]
    vldr s7, [r1, #28]
    vldr s11, [r1, #44]
    vldmia r2!, {s12-s15}
    vldr s20, [r1]
    vldr s21, [r1, #16]
    vmul.f32 s0, s12, s20
    vmul.f32 s1, s13, s20
    vmul.f32 s2, s14, s20
    vmla.f32 s3, s15, s20
    vldr s20, [r1, #32]
    vmul.f32 s4, s12, s21
    vmul.f32 s5, s13, s21
    vmul.f32 s6, s14, s21
    vmla.f32 s7, s15, s21
    vldmia r2!, {s16-s19}
    vldr s21, [r1, #4]
    vmul.f32 s8, s12, s20
    vmul.f32 s9, s13, s20
    vmul.f32 s10, s14, s20
    vmla.f32 s11, s15, s20
    vldmia r2, {s12-s15}
    vldr s20, [r1, #20]
    vmla.f32 s0, s16, s21
    vmla.f32 s1, s17, s21
    vmla.f32 s2, s18, s21
    vmla.f32 s3, s19, s21
    vldr s21, [r1, #36]
    vmla.f32 s4, s16, s20
    vmla.f32 s5, s17, s20
    vmla.f32 s6, s18, s20
    vmla.f32 s7, s19, s20
    vldr s20, [r1, #8]
    vmla.f32 s8, s16, s21
    vmla.f32 s9, s17, s21
    vmla.f32 s10, s18, s21
    vmla.f32 s11, s19, s21
    vldr s21, [r1, #24]
    vmla.f32 s0, s12, s20
    vmla.f32 s1, s13, s20
    vmla.f32 s2, s14, s20
    vmla.f32 s3, s15, s20
    vldr s20, [r1, #40]
    vmla.f32 s4, s12, s21
    vmla.f32 s5, s13, s21
    vmla.f32 s6, s14, s21
    vmla.f32 s7, s15, s21
    vmla.f32 s8, s12, s20
    vmla.f32 s9, s13, s20
    vmla.f32 s10, s14, s20
    vmla.f32 s11, s15, s20
    vpop {d8-d10}
    mov r1, r0
    vstmia r1!, {s0-s3}
    vstmia r1, {s4-s11}
    bx lr
.size func_00195C78, . - func_00195C78

.section .text.func_0019B4D8, "ax", %progbits
.global func_0019B4D8
.type func_0019B4D8, %function
func_0019B4D8:
    vldmia r1, {s0-s11}
    vldmia r3, {s12-s14}
    vmla.f32 s3, s0, s12
    vmla.f32 s7, s4, s12
    vmla.f32 s11, s8, s12
    vmla.f32 s3, s1, s13
    vmla.f32 s7, s5, s13
    vmla.f32 s11, s9, s13
    vmla.f32 s3, s2, s14
    vldmia r2, {s12-s13}
    vmla.f32 s7, s6, s14
    vmla.f32 s11, s10, s14
    vmul.f32 s0, s0, s12
    vmul.f32 s1, s1, s13
    vmul.f32 s4, s4, s12
    vmul.f32 s5, s5, s13
    vmul.f32 s8, s8, s12
    vmul.f32 s9, s9, s13
    vstmia r0, {s0-s11}
    bx lr
.size func_0019B4D8, . - func_0019B4D8

.section .text.func_0019B528, "ax", %progbits
.global func_0019B528
.type func_0019B528, %function
func_0019B528:
    vldmia r1!, {s0-s11}
    str r2, [r0, #4]
    vstr s0, [r0, #16]
    vstr s1, [r0, #12]
    vstr s2, [r0, #8]
    vstr s3, [r0]
    vstr s4, [r0, #32]
    vstr s5, [r0, #28]
    vstr s6, [r0, #24]
    vstr s7, [r0, #20]
    vstr s8, [r0, #48]
    vstr s9, [r0, #44]
    vstr s10, [r0, #40]
    vstr s11, [r0, #36]
    bx lr
.size func_0019B528, . - func_0019B528

.section .text.func_0019B65C, "ax", %progbits
.global func_0019B65C
.type func_0019B65C, %function
func_0019B65C:
    vldmia r1!, {s0-s7}
    vstr s0, [r0, #12]
    vstr s1, [r0, #8]
    vstr s2, [r0, #4]
    vstr s3, [r0]
    vstr s4, [r0, #28]
    vstr s5, [r0, #24]
    vstr s6, [r0, #20]
    vstr s7, [r0, #16]
    bx lr
.size func_0019B65C, . - func_0019B65C

.section .text.func_0019B6B0, "ax", %progbits
.global func_0019B6B0
.type func_0019B6B0, %function
func_0019B6B0:
    vldmia r1!, {s0-s11}
    vstr s0, [r0, #12]
    vstr s1, [r0, #8]
    vstr s2, [r0, #4]
    vstr s3, [r0]
    vstr s4, [r0, #28]
    vstr s5, [r0, #24]
    vstr s6, [r0, #20]
    vstr s7, [r0, #16]
    vstr s8, [r0, #44]
    vstr s9, [r0, #40]
    vstr s10, [r0, #36]
    vstr s11, [r0, #32]
    bx lr
.size func_0019B6B0, . - func_0019B6B0

.section .text.func_0019B6E8, "ax", %progbits
.global func_0019B6E8
.type func_0019B6E8, %function
func_0019B6E8:
    vldmia r1!, {s0-s11}
    str r2, [r0, #4]
    vstr s0, [r0, #16]
    vstr s1, [r0, #12]
    vstr s2, [r0, #8]
    vstr s3, [r0]
    vstr s4, [r0, #32]
    vstr s5, [r0, #28]
    vstr s6, [r0, #24]
    vstr s7, [r0, #20]
    vstr s8, [r0, #48]
    vstr s9, [r0, #44]
    vstr s10, [r0, #40]
    vstr s11, [r0, #36]
    bx lr
.size func_0019B6E8, . - func_0019B6E8

.section .text.func_0019B76C, "ax", %progbits
.global func_0019B76C
.type func_0019B76C, %function
func_0019B76C:
    vldmia r1!, {s0-s15}
    str r2, [r0, #4]
    vstr s0, [r0, #16]
    vstr s1, [r0, #12]
    vstr s2, [r0, #8]
    vstr s3, [r0]
    vstr s4, [r0, #32]
    vstr s5, [r0, #28]
    vstr s6, [r0, #24]
    vstr s7, [r0, #20]
    vstr s8, [r0, #48]
    vstr s9, [r0, #44]
    vstr s10, [r0, #40]
    vstr s11, [r0, #36]
    vstr s12, [r0, #64]
    vstr s13, [r0, #60]
    vstr s14, [r0, #56]
    vstr s15, [r0, #52]
    bx lr
.size func_0019B76C, . - func_0019B76C

.section .text.func_0019BCC8, "ax", %progbits
.global func_0019BCC8
.type func_0019BCC8, %function
func_0019BCC8:
    vpush {d8-d11}
    add r2, r2, #3
    asr r2, r2, #2
    vldmia r1, {s20-s22}
    mov r3, r0
1:
    vldmia r0!, {s8-s11}
    vldmia r0!, {s12-s15}
    vadd.f32 s8, s8, s20
    vadd.f32 s9, s9, s21
    vadd.f32 s10, s10, s22
    vadd.f32 s11, s11, s20
    vldmia r0!, {s16-s19}
    vadd.f32 s12, s12, s21
    vadd.f32 s13, s13, s22
    vadd.f32 s14, s14, s20
    vadd.f32 s15, s15, s21
    vstmia r3!, {s8-s11}
    vadd.f32 s16, s16, s22
    vadd.f32 s17, s17, s20
    vadd.f32 s18, s18, s21
    vadd.f32 s19, s19, s22
    vstmia r3!, {s12-s19}
    subs r2, r2, #1
    bne 1b
    vpop {d8-d11}
    bx lr
.size func_0019BCC8, . - func_0019BCC8

.section .text.func_0019BD30, "ax", %progbits
.global func_0019BD30
.type func_0019BD30, %function
func_0019BD30:
    vpush {d8-d15}
    add r2, r2, #3
    asr r2, r2, #2
    mov r3, r0
1:
    vldmia r0!, {s8-s11}
    vldmia r1!, {s20-s23}
    vldmia r0!, {s12-s15}
    vmla.f32 s8, s20, s0
    vmla.f32 s9, s21, s0
    vmla.f32 s10, s22, s0
    vmla.f32 s11, s23, s0
    vldmia r1!, {s24-s27}
    vstmia r3!, {s8-s11}
    vmla.f32 s12, s24, s0
    vmla.f32 s13, s25, s0
    vldmia r0!, {s16-s19}
    vmla.f32 s14, s26, s0
    vmla.f32 s15, s27, s0
    vldmia r1!, {s28-s31}
    vstmia r3!, {s12-s15}
    vmla.f32 s16, s28, s0
    vmla.f32 s17, s29, s0
    vmla.f32 s18, s30, s0
    vmla.f32 s19, s31, s0
    vstmia r3!, {s16-s19}
    subs r2, r2, #1
    bne 1b
    vpop {d8-d15}
    bx lr
.size func_0019BD30, . - func_0019BD30

.section .text.func_0019BDA4, "ax", %progbits
.global func_0019BDA4
.type func_0019BDA4, %function
func_0019BDA4:
    add r2, r2, #7
    asr r2, r2, #3
1:
    vldmia r1!, {s8-s15}
    vadd.f32 s8, s8, s0
    vadd.f32 s9, s9, s0
    vadd.f32 s10, s10, s0
    vadd.f32 s11, s11, s0
    vadd.f32 s12, s12, s0
    vadd.f32 s13, s13, s0
    vadd.f32 s14, s14, s0
    vadd.f32 s15, s15, s0
    vstmia r0!, {s8-s15}
    subs r2, r2, #1
    bne 1b
    bx lr
.size func_0019BDA4, . - func_0019BDA4

.section .text.func_001E1CA8, "ax", %progbits
.global func_001E1CA8
.type func_001E1CA8, %function
func_001E1CA8:
    vsub.f32 s0, s0, s2
    vsub.f32 s1, s1, s3
    vabs.f32 s0, s0
    vabs.f32 s2, s1
    vmul.f32 s1, s0, s0
    vmla.f32 s1, s2, s2
    vsqrt.f32 s0, s1
    bx lr
.size func_001E1CA8, . - func_001E1CA8

.section .text.func_001F9544, "ax", %progbits
.global func_001F9544
.type func_001F9544, %function
func_001F9544:
    vmov r0, s0
    bics r1, r0, #0x80000000
    beq 1f
    lsl r1, r0, #1
    lsr r1, r1, #24
    sub r1, r1, #64
    cmp r1, #0
    lsrlt r0, r0, #31
    lsllt r0, r0, #23
    blt 2f
1:
    lsl r2, r0, #9
    lsr r0, r0, #31
    lsr r2, r2, #16
    orr r1, r2, r1, lsl #16
    orr r0, r1, r0, lsl #23
2:
    bx lr
.size func_001F9544, . - func_001F9544

.section .note.GNU-stack, "", %progbits
