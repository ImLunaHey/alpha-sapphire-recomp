.syntax unified
.arch armv6k
.arm
.fpu vfpv2
.text

.section .text.func_00144BCC, "ax", %progbits
.global func_00144BCC
.type func_00144BCC, %function
func_00144BCC:
    add r1, r0, #8
    vldr s0, [r0, #4]
    ldm r1, {r1, r2}
    cmp r2, r1
    bge 1f
    vmov s2, r2
    vldr s1, [r0]
    vmov s3, r1
    vsub.f32 s0, s0, s1
    vcvt.f32.s32 s4, s2
    vcvt.f32.s32 s2, s3
    vmul.f32 s3, s0, s4
    vdiv.f32 s0, s3, s2
    vadd.f32 s0, s0, s1
1:
    bx lr
.size func_00144BCC, . - func_00144BCC

.section .text.func_00144CA8, "ax", %progbits
.global func_00144CA8
.type func_00144CA8, %function
func_00144CA8:
    cmp r1, r0
    bxeq lr
    vldmia r1!, {s0-s5}
    mov r2, r0
    vldmia r1, {s6-s11}
    vstmia r2!, {s0-s5}
    vstmia r2, {s6-s11}
    bx lr
.size func_00144CA8, . - func_00144CA8

.section .text.func_00144CC8, "ax", %progbits
.global func_00144CC8
.type func_00144CC8, %function
func_00144CC8:
    vldmia r1, {s0-s11}
    vldmia r2, {s12-s14}
    vmla.f32 s3, s0, s12
    vmla.f32 s7, s4, s12
    vmla.f32 s11, s8, s12
    vmla.f32 s3, s1, s13
    vmla.f32 s7, s5, s13
    vmla.f32 s11, s9, s13
    vmla.f32 s3, s2, s14
    vmla.f32 s7, s6, s14
    vmla.f32 s11, s10, s14
    vstr s3, [r0]
    vstr s7, [r0, #4]
    vstr s11, [r0, #8]
    bx lr
.size func_00144CC8, . - func_00144CC8

.section .text.func_0014CD7C, "ax", %progbits
.global func_0014CD7C
.type func_0014CD7C, %function
func_0014CD7C:
    vldr s1, [r1]
    vmul.f32 s1, s1, s0
    vstr s1, [r0]
    vldr s1, [r1, #4]
    vmul.f32 s1, s1, s0
    vstr s1, [r0, #4]
    vldr s1, [r1, #8]
    vmul.f32 s1, s1, s0
    vstr s1, [r0, #8]
    vldr s1, [r1, #12]
    vmul.f32 s0, s1, s0
    vstr s0, [r0, #12]
    bx lr
.size func_0014CD7C, . - func_0014CD7C

.section .text.func_001646A0, "ax", %progbits
.global func_001646A0
.type func_001646A0, %function
func_001646A0:
    cmp r1, #0
    cmpne r1, #4
    beq 4f
    cmp r1, #2
    beq 2f
    cmp r1, #3
    beq 3f
    vldr s0, [r0, #12]
    add r1, r0, #16
    vldmia r0, {s5-s7}
    vneg.f32 s0, s0
    vldmia r1, {s1-s4}
    vneg.f32 s5, s5
    vneg.f32 s7, s7
    vstr s0, [r0, #28]
    vneg.f32 s6, s6
    vstmia r0, {s1-s7}
4:
    bx lr
2:
    vldmia r0, {s0-s7}
    vneg.f32 s0, s0
    vneg.f32 s1, s1
    vneg.f32 s2, s2
    vneg.f32 s3, s3
    vneg.f32 s7, s7
    vneg.f32 s4, s4
    vneg.f32 s5, s5
    vneg.f32 s6, s6
    vstmia r0, {s0-s7}
    bx lr
3:
    add r1, r0, #16
    vldr s4, [r0, #28]
    vldr s3, [r0, #4]
    vldr s5, [r0]
    vneg.f32 s4, s4
    vldmia r1, {s0-s2}
    add r1, r0, #8
    vldmia r1, {s6-s7}
    vneg.f32 s0, s0
    vneg.f32 s2, s2
    vneg.f32 s1, s1
    vstr s3, [r0, #20]
    add r1, r0, #12
    vstmia r0, {s0-s2}
    vstmia r1, {s4-s5}
    add r1, r0, #24
    vstmia r1, {s6-s7}
    bx lr
.size func_001646A0, . - func_001646A0

.section .text.func_00174884, "ax", %progbits
.global func_00174884
.type func_00174884, %function
func_00174884:
    vmov r1, s0
    ands r0, r1, #0x80000000
    lsl r2, r1, #1
    movne r0, #0x800000
    lsr r3, r2, #24
    lsl r2, r1, #9
    bics r1, r1, #0x80000000
    lsr r2, r2, #9
    lsreq r2, r2, #7
    beq 1f
    subs r1, r3, #64
    lsr r2, r2, #7
    bmi 2f
    cmp r1, #127
    movgt r0, #0x7f0000
    bgt 2f
1:
    and r1, r1, #127
    orr r0, r0, r2
    orr r0, r0, r1, lsl #16
2:
    bx lr
.size func_00174884, . - func_00174884

.section .text.func_00176C88, "ax", %progbits
.global func_00176C88
.type func_00176C88, %function
func_00176C88:
    push {r4, r5}
    ldrb r4, [r0, #4]
    ldr r12, [sp, #8]
    vldr s0, [r0, #40]
    cmp r4, #1
    beq 1f
    cmp r4, #2
    bne 2f
    ldrb r4, [r0, #12]
    cmp r4, #1
    beq 1f
2:
    vstr s0, [r1]
    ldr r1, [r0, #44]
    str r1, [r2]
    ldr r1, [r0, #48]
    str r1, [r3]
    ldr r0, [r0, #52]
    str r0, [r12]
    pop {r4, r5}
    bx lr
1:
    vstr s0, [r2]
    ldr r2, [r0, #44]
    str r2, [r1]
    ldr r1, [r0, #48]
    str r1, [r12]
    ldr r0, [r0, #52]
    str r0, [r3]
    pop {r4, r5}
    bx lr
.size func_00176C88, . - func_00176C88

.section .text.func_00181DD0, "ax", %progbits
.global func_00181DD0
.type func_00181DD0, %function
func_00181DD0:
    ldrb r3, [r0, #12]
    cmp r3, #0
    beq 2f
    cmp r1, #0
    beq 1f
    cmp r1, #1
    bne 2f
    vmov s0, r2
    vldr s1, [r0, #112]
    vcvt.f32.s32 s0, s0
    vadd.f32 s0, s1, s0
    vstr s0, [r0, #112]
2:
    bx lr
1:
    ldr r1, [r0, #108]
    add r1, r1, r2
    str r1, [r0, #108]
    bx lr
.size func_00181DD0, . - func_00181DD0

.section .text.func_00182370, "ax", %progbits
.global func_00182370
.type func_00182370, %function
func_00182370:
    ldr r1, [r0, #16]
    ldr r2, [r0, #12]
    vldr s0, [r0, #8]
    cmp r1, r2
    bge 1f
    vmov s2, r1
    vldr s1, [r0, #4]
    vmov s3, r2
    vsub.f32 s0, s0, s1
    vcvt.f32.s32 s4, s2
    vcvt.f32.s32 s2, s3
    vmul.f32 s3, s0, s4
    vdiv.f32 s0, s3, s2
    vadd.f32 s0, s0, s1
1:
    bx lr
.size func_00182370, . - func_00182370

.section .text.func_00182C60, "ax", %progbits
.global func_00182C60
.type func_00182C60, %function
func_00182C60:
    ldr r2, [r0, #12]
    ldr r3, [r0, #8]
    vldr s1, [r0, #4]
    cmp r2, r3
    bge 1f
    vmov s3, r2
    vldr s2, [r0]
    vmov s4, r3
    vsub.f32 s1, s1, s2
    vcvt.f32.s32 s3, s3
    vcvt.f32.s32 s4, s4
    vmul.f32 s3, s1, s3
    vdiv.f32 s1, s3, s4
    vadd.f32 s1, s1, s2
1:
    mov r2, #0
    vstr s1, [r0]
    vstr s0, [r0, #4]
    add r0, r0, #8
    stm r0, {r1, r2}
    bx lr
.size func_00182C60, . - func_00182C60

.section .text.func_00195C40, "ax", %progbits
.global func_00195C40
.type func_00195C40, %function
func_00195C40:
    vldmia r1, {s0-s8}
    vldmia r2, {s9-s11}
    vmul.f32 s12, s0, s9
    vmul.f32 s13, s3, s9
    vmul.f32 s14, s6, s9
    vmla.f32 s12, s1, s10
    vmla.f32 s13, s4, s10
    vmla.f32 s14, s7, s10
    vmla.f32 s12, s2, s11
    vmla.f32 s13, s5, s11
    vmla.f32 s14, s8, s11
    vstmia r0, {s12-s14}
    bx lr
.size func_00195C40, . - func_00195C40

.section .text.func_00195D5C, "ax", %progbits
.global func_00195D5C
.type func_00195D5C, %function
func_00195D5C:
    vldmia r1, {s0-s11}
    vldmia r2, {s12-s14}
    vmul.f32 s0, s0, s12
    vmul.f32 s1, s1, s13
    vmul.f32 s2, s2, s14
    vmul.f32 s4, s4, s12
    vmul.f32 s5, s5, s13
    vmul.f32 s6, s6, s14
    vmul.f32 s8, s8, s12
    vmul.f32 s9, s9, s13
    vmul.f32 s10, s10, s14
    vstmia r0, {s0-s11}
    bx lr
.size func_00195D5C, . - func_00195D5C

.section .text.func_00195D90, "ax", %progbits
.global func_00195D90
.type func_00195D90, %function
func_00195D90:
    vldmia r2, {s0-s11}
    vldmia r1, {s12-s14}
    vmul.f32 s0, s0, s12
    vmul.f32 s1, s1, s12
    vmul.f32 s2, s2, s12
    vmul.f32 s3, s3, s12
    vmul.f32 s4, s4, s13
    vmul.f32 s5, s5, s13
    vmul.f32 s6, s6, s13
    vmul.f32 s7, s7, s13
    vmul.f32 s8, s8, s14
    vmul.f32 s9, s9, s14
    vmul.f32 s10, s10, s14
    vmul.f32 s11, s11, s14
    vstmia r0, {s0-s11}
    bx lr
.size func_00195D90, . - func_00195D90

.section .text.func_00196004, "ax", %progbits
.global func_00196004
.type func_00196004, %function
func_00196004:
    vldmia r1, {s0-s11}
    vldmia r2, {s12-s14}
    vmla.f32 s3, s0, s12
    vmla.f32 s7, s4, s12
    vmla.f32 s11, s8, s12
    vmla.f32 s3, s1, s13
    vmla.f32 s7, s5, s13
    vmla.f32 s11, s9, s13
    vmla.f32 s3, s2, s14
    vmla.f32 s7, s6, s14
    vmla.f32 s11, s10, s14
    vstmia r0, {s0-s11}
    bx lr
.size func_00196004, . - func_00196004

.section .text.func_00196074, "ax", %progbits
.global func_00196074
.type func_00196074, %function
func_00196074:
    vpush {d8-d9}
    vldmia r1, {s0-s15}
    vldmia r2, {s16-s18}
    vmla.f32 s3, s0, s16
    vmla.f32 s7, s4, s16
    vmla.f32 s11, s8, s16
    vmla.f32 s15, s12, s16
    vmla.f32 s3, s1, s17
    vmla.f32 s7, s5, s17
    vmla.f32 s11, s9, s17
    vmla.f32 s15, s13, s17
    vmla.f32 s3, s2, s18
    vmla.f32 s7, s6, s18
    vmla.f32 s11, s10, s18
    vmla.f32 s15, s14, s18
    vpop {d8-d9}
    vstr s3, [r0]
    vstr s7, [r0, #4]
    vstr s11, [r0, #8]
    vstr s15, [r0, #12]
    bx lr
.size func_00196074, . - func_00196074
