.syntax unified
.arch armv6k
.arm
.fpu vfpv2

.section .text.func_00372988, "ax", %progbits
.align 2
.global func_00372988
.type func_00372988, %function
func_00372988:
    vldmia sp, {s9-s11}
    ldr r12, [sp, #12]
    vldr s1, [sp, #16]
    vldr s2, [sp, #20]
    vldr s3, [sp, #24]
    vldr s4, [sp, #28]
    vldr s5, [sp, #32]
    vldr s6, [sp, #36]
    vldr s7, [sp, #40]
    vldr s8, [sp, #44]
    stm r0, {r1, r2}
    strb r3, [r0, #8]
    vstr s9, [r0, #12]
    vstr s10, [r0, #16]
    vstr s11, [r0, #20]
    vldmia r12, {s9-s12}
    vstr s0, [r0, #40]
    vstr s1, [r0, #44]
    vstr s2, [r0, #48]
    vstr s3, [r0, #52]
    vstr s4, [r0, #56]
    vstr s5, [r0, #60]
    vstr s6, [r0, #64]
    vstr s7, [r0, #68]
    vstr s8, [r0, #72]
    add r0, r0, #24
    vstmia r0, {s9-s12}
    bx lr
.size func_00372988, . - func_00372988

.section .text.func_0038A09C, "ax", %progbits
.align 2
.global func_0038A09C
.type func_0038A09C, %function
func_0038A09C:
    ldr r0, [r0, #80]
    cmp r0, #0
    beq 1f
    cmp r1, #4
    bcs 1f
    add r2, r1, r1, lsl #1
    mov r1, #1
    add r0, r0, r2, lsl #2
    str r1, [r0, #48]
    add r0, r0, #40
    vstmia r0, {s0-s1}
1:
    bx lr
.size func_0038A09C, . - func_0038A09C

.section .text.func_003A4DB0, "ax", %progbits
.align 2
.global func_003A4DB0
.type func_003A4DB0, %function
func_003A4DB0:
    ldrb r2, [r0, #1808]
    cmp r2, r1
    bls 1f
    ldr r0, [r0, #1800]
    add r1, r1, r1, lsl #5
    add r0, r0, r1, lsl #2
    vstr s0, [r0, #80]
1:
    bx lr
.size func_003A4DB0, . - func_003A4DB0

.section .text.func_003A4FC4, "ax", %progbits
.align 2
.global func_003A4FC4
.type func_003A4FC4, %function
func_003A4FC4:
    ldrb r2, [r0, #1808]
    cmp r2, r1
    bls 1f
    ldr r0, [r0, #1800]
    add r1, r1, r1, lsl #5
    add r0, r0, r1, lsl #2
    vstr s0, [r0, #76]
1:
    bx lr
.size func_003A4FC4, . - func_003A4FC4

.section .text.func_003A4FE4, "ax", %progbits
.align 2
.global func_003A4FE4
.type func_003A4FE4, %function
func_003A4FE4:
    ldrb r2, [r0, #1808]
    cmp r2, r1
    bls 1f
    ldr r0, [r0, #1800]
    add r1, r1, r1, lsl #5
    add r0, r0, r1, lsl #2
    vstr s0, [r0, #72]
1:
    bx lr
.size func_003A4FE4, . - func_003A4FE4

.section .text.func_003A7FEC, "ax", %progbits
.align 2
.global func_003A7FEC
.type func_003A7FEC, %function
func_003A7FEC:
    vldr s2, [r1, #12]
    vldr s8, [r2]
    vldr s5, [r2, #4]
    vldr s7, [r2, #8]
    vldr s3, [r2, #12]
    vmul.f32 s1, s2, s8
    vmul.f32 s10, s2, s5
    vmul.f32 s0, s2, s7
    vmul.f32 s2, s2, s3
    vldr s9, [r1]
    vldr s6, [r1, #4]
    vldr s4, [r1, #8]
    vmla.f32 s1, s9, s3
    vmla.f32 s10, s6, s3
    vmla.f32 s0, s4, s3
    vmls.f32 s2, s9, s8
    vmla.f32 s1, s6, s7
    vmla.f32 s10, s4, s8
    vmla.f32 s0, s9, s5
    vmls.f32 s2, s6, s5
    vmls.f32 s1, s4, s5
    vmls.f32 s10, s9, s7
    vmls.f32 s0, s6, s8
    vmls.f32 s2, s4, s7
    vstr s1, [r0]
    vstr s10, [r0, #4]
    vstr s0, [r0, #8]
    vstr s2, [r0, #12]
    bx lr
.size func_003A7FEC, . - func_003A7FEC

.section .text.func_003A8238, "ax", %progbits
.align 2
.global func_003A8238
.type func_003A8238, %function
func_003A8238:
    add r1, r0, #4
    vldmia r1, {s0-s1}
    add r1, r0, #20
    vldmia r1, {s2-s3}
    add r1, r0, #36
    vneg.f32 s0, s0
    vldmia r1, {s4-s5}
    vneg.f32 s2, s2
    vstr s1, [r0, #4]
    vstr s3, [r0, #20]
    vneg.f32 s4, s4
    vstr s5, [r0, #36]
    vstr s0, [r0, #8]
    vstr s2, [r0, #24]
    vstr s4, [r0, #40]
    bx lr
.size func_003A8238, . - func_003A8238

.section .text.func_003A8278, "ax", %progbits
.align 2
.global func_003A8278
.type func_003A8278, %function
func_003A8278:
    vldr s1, [r0, #8]
    vldr s3, [r0, #24]
    vldr s4, [r0, #40]
    vldr s0, [r0]
    vneg.f32 s1, s1
    vldr s2, [r0, #16]
    vldr s5, [r0, #32]
    vneg.f32 s3, s3
    vneg.f32 s4, s4
    vstr s0, [r0, #8]
    vstr s2, [r0, #24]
    vstr s5, [r0, #40]
    vstr s1, [r0]
    vstr s3, [r0, #16]
    vstr s4, [r0, #32]
    bx lr
.size func_003A8278, . - func_003A8278

.section .text.func_003A8400, "ax", %progbits
.align 2
.global func_003A8400
.type func_003A8400, %function
func_003A8400:
    add r1, r0, #4
    vldr s4, [r0, #40]
    vldr s5, [r0, #36]
    vldmia r1, {s0-s1}
    add r1, r0, #20
    vneg.f32 s4, s4
    vldmia r1, {s2-s3}
    vneg.f32 s1, s1
    vstr s0, [r0, #8]
    vstr s2, [r0, #24]
    vneg.f32 s3, s3
    vstr s1, [r0, #4]
    vstr s3, [r0, #20]
    add r0, r0, #36
    vstmia r0, {s4-s5}
    bx lr
.size func_003A8400, . - func_003A8400

.section .text.func_003A87D8, "ax", %progbits
.align 2
.global func_003A87D8
.type func_003A87D8, %function
func_003A87D8:
    vpush {d8-d10}
    vldr s0, [r1]
    vldr s6, [r2]
    vldr s8, [r2, #4]
    vldr s10, [r2, #8]
    vldr s1, [r1, #16]
    vldr s2, [r1, #32]
    vmul.f32 s18, s0, s6
    vmul.f32 s19, s0, s8
    vmul.f32 s20, s0, s10
    vmul.f32 s0, s1, s6
    vmul.f32 s21, s2, s6
    vmul.f32 s6, s1, s8
    vmul.f32 s1, s1, s10
    vmul.f32 s8, s2, s8
    vmul.f32 s2, s2, s10
    vldr s4, [r1, #20]
    vldr s7, [r2, #16]
    vldr s9, [r2, #20]
    vldr s11, [r2, #24]
    vldr s5, [r1, #36]
    vmla.f32 s0, s4, s7
    vmla.f32 s6, s4, s9
    vmla.f32 s1, s4, s11
    vldr s3, [r1, #4]
    vmla.f32 s21, s5, s7
    add r2, r2, #32
    vmla.f32 s8, s5, s9
    vmla.f32 s2, s5, s11
    vldmia r2, {s15-s17}
    vmla.f32 s20, s3, s11
    vldr s13, [r1, #24]
    vmla.f32 s18, s3, s7
    vmla.f32 s19, s3, s9
    vldr s14, [r1, #40]
    vmla.f32 s0, s13, s15
    vmla.f32 s6, s13, s16
    vmla.f32 s1, s13, s17
    vldr s12, [r1, #8]
    vmla.f32 s21, s14, s15
    vmla.f32 s8, s14, s16
    vmla.f32 s2, s14, s17
    vmla.f32 s20, s12, s17
    vmla.f32 s18, s12, s15
    vmla.f32 s19, s12, s16
    vstr s0, [r0, #16]
    vstr s6, [r0, #20]
    vstr s1, [r0, #24]
    vstr s21, [r0, #32]
    vstr s8, [r0, #36]
    vstr s2, [r0, #40]
    vstmia r0, {s18-s20}
    vpop {d8-d10}
    bx lr
.size func_003A87D8, . - func_003A87D8

.section .text.func_003A8908, "ax", %progbits
.align 2
.global func_003A8908
.type func_003A8908, %function
func_003A8908:
    vldmia r1, {s0-s3}
    add r2, r1, #16
    add r1, r1, #32
    vstmia r0, {s0-s3}
    vldmia r2, {s0-s3}
    add r2, r0, #16
    add r0, r0, #32
    vstmia r2, {s0-s3}
    vldmia r1, {s0-s3}
    vstmia r0, {s0-s3}
    bx lr
.size func_003A8908, . - func_003A8908

.section .text.func_003A8934, "ax", %progbits
.align 2
.global func_003A8934
.type func_003A8934, %function
func_003A8934:
    add r1, r0, #4
    vldr s4, [r0, #40]
    vldr s7, [r0, #36]
    vldmia r1, {s2-s3}
    add r1, r0, #20
    vldmia r1, {s5-s6}
    add r1, r0, #36
    vmul.f32 s8, s3, s0
    vmul.f32 s9, s3, s1
    vmul.f32 s3, s4, s0
    vmul.f32 s10, s6, s0
    vmul.f32 s6, s6, s1
    vmul.f32 s4, s4, s1
    vmla.f32 s8, s2, s1
    vmls.f32 s9, s2, s0
    vmla.f32 s3, s7, s1
    vmla.f32 s10, s5, s1
    vmls.f32 s6, s5, s0
    vmls.f32 s4, s7, s0
    vstr s10, [r0, #20]
    vstr s6, [r0, #24]
    add r0, r0, #4
    vstmia r1, {s3-s4}
    vstmia r0, {s8-s9}
    bx lr
.size func_003A8934, . - func_003A8934

.section .text.func_003A8998, "ax", %progbits
.align 2
.global func_003A8998
.type func_003A8998, %function
func_003A8998:
    vldr s2, [r0]
    vldr s4, [r0, #16]
    vldr s5, [r0, #32]
    vmul.f32 s8, s2, s0
    vmul.f32 s9, s2, s1
    vmul.f32 s10, s4, s0
    vmul.f32 s2, s5, s0
    vmul.f32 s4, s4, s1
    vmul.f32 s5, s5, s1
    vldr s3, [r0, #8]
    vldr s6, [r0, #24]
    vldr s7, [r0, #40]
    vmla.f32 s8, s3, s1
    vmls.f32 s9, s3, s0
    vmla.f32 s10, s6, s1
    vmla.f32 s2, s7, s1
    vmls.f32 s4, s6, s0
    vmls.f32 s5, s7, s0
    vstr s8, [r0, #8]
    vstr s10, [r0, #24]
    vstr s2, [r0, #40]
    vstr s9, [r0]
    vstr s4, [r0, #16]
    vstr s5, [r0, #32]
    bx lr
.size func_003A8998, . - func_003A8998

.section .text.func_003A89FC, "ax", %progbits
.align 2
.global func_003A89FC
.type func_003A89FC, %function
func_003A89FC:
    add r1, r0, #16
    vldmia r0, {s2-s3}
    vldr s4, [r0, #36]
    vldr s7, [r0, #32]
    vldmia r1, {s5-s6}
    vmul.f32 s8, s3, s0
    vmul.f32 s9, s3, s1
    vmul.f32 s3, s4, s0
    vmul.f32 s4, s4, s1
    vmul.f32 s10, s6, s0
    vmul.f32 s6, s6, s1
    add r1, r0, #32
    vmla.f32 s8, s2, s1
    vmls.f32 s9, s2, s0
    vmla.f32 s3, s7, s1
    vmls.f32 s4, s7, s0
    vmla.f32 s10, s5, s1
    vmls.f32 s6, s5, s0
    vstr s10, [r0, #16]
    vstr s6, [r0, #20]
    vstmia r1, {s3-s4}
    vstmia r0, {s8-s9}
    bx lr
.size func_003A89FC, . - func_003A89FC

.section .note.GNU-stack, "", %progbits
