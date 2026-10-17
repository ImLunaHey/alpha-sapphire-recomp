.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_0014849C, "ax", %progbits
.balign 4
.global func_0014849C
.type func_0014849C, %function
func_0014849C:
    vldmia r1!, {s3}
    vldr s4, .L121_func_0014849C_60
    add r2, r0, #4
    vldmia r1, {s0-s1}
    vmul.f32 s2, s3, s3
    vmla.f32 s2, s0, s0
    vmla.f32 s2, s1, s1
    vsqrt.f32 s5, s2
    vdiv.f32 s2, s4, s5
    vmul.f32 s3, s3, s2
    vmul.f32 s1, s1, s2
    vmul.f32 s0, s0, s2
    vstr s3, [r0]
    vstmia r2, {s0-s1}
    bx lr
.L121_func_0014849C_body_end:
.L121_func_0014849C_60:
    .word runtime_float_unit_38
.size func_0014849C, .L121_func_0014849C_body_end - func_0014849C

.section .text.func_0014C76C, "ax", %progbits
.balign 4
.global func_0014C76C
.type func_0014C76C, %function
func_0014C76C:
    vldr s1, .L121_func_0014C76C_92
    vldr s2, [r1]
    vldr s3, [r2]
    vsub.f32 s1, s1, s0
    vmul.f32 s2, s2, s1
    vmla.f32 s2, s3, s0
    vstr s2, [r0]
    vldr s2, [r1, #4]
    vldr s3, [r2, #4]
    vmul.f32 s2, s2, s1
    vmla.f32 s2, s3, s0
    vstr s2, [r0, #4]
    vldr s2, [r1, #8]
    vldr s3, [r2, #8]
    vmul.f32 s2, s2, s1
    vmla.f32 s2, s3, s0
    vstr s2, [r0, #8]
    vldr s3, [r1, #12]
    vldr s2, [r2, #12]
    vmul.f32 s1, s3, s1
    vmla.f32 s1, s2, s0
    vstr s1, [r0, #12]
    bx lr
.L121_func_0014C76C_body_end:
.L121_func_0014C76C_92:
    .word runtime_float_unit_38
.size func_0014C76C, .L121_func_0014C76C_body_end - func_0014C76C

.section .text.func_0015290C, "ax", %progbits
.balign 4
.global func_0015290C
.type func_0015290C, %function
func_0015290C:
    vldr s2, .L121_func_0015290C_52
    vldr s3, [r1, #24]
    vldr s0, .L121_func_0015290C_56
    vldr s1, [r1, #28]
    vmul.f32 s5, s3, s2
    add r2, r0, #8
    vmul.f32 s4, s1, s0
    vmul.f32 s1, s1, s2
    vmul.f32 s0, s3, s0
    vstr s5, [r0]
    vstr s4, [r0, #4]
    vstmia r2, {s0-s1}
    bx lr
.L121_func_0015290C_body_end:
.L121_func_0015290C_52:
    .word runtime_literal_121_1
.L121_func_0015290C_56:
    .word runtime_literal_121_2
.size func_0015290C, .L121_func_0015290C_body_end - func_0015290C

.section .text.func_00164798, "ax", %progbits
.balign 4
.global func_00164798
.type func_00164798, %function
func_00164798:
    push {r4, r5}
    ldr ip, [r0]
    ldr r2, [r0, #8]
    ldr r3, [r0, #4]
    ldr r1, [r0, #12]
    bic ip, ip, #-2147483648
    eor r4, r3, r2
    eor ip, ip, r4
    eor r1, r1, r1, lsr #1
    eor ip, ip, ip, lsl #1
    eor r1, r1, ip
    tst r1, #1
    eor ip, ip, r1, lsl #10
    beq .L121_func_00164798_72
    ldr r5, .L121_func_00164798_116
    ldr r4, .L121_func_00164798_120
    eor r2, r2, r5
    eor ip, ip, r4
.L121_func_00164798_72:
    str r3, [r0]
    str r1, [r0, #12]
    add r0, r0, #4
    add r4, r3, ip, lsr #8
    stm r0, {r2, ip}
    tst r4, #1
    eor r0, r1, r4
    ldrne r1, .L121_func_00164798_124
    pop {r4, r5}
    eorne r0, r0, r1
    bx lr
.L121_func_00164798_body_end:
.L121_func_00164798_116:
    .word runtime_literal_121_3
.L121_func_00164798_120:
    .word runtime_literal_121_4
.L121_func_00164798_124:
    .word runtime_literal_121_5
.size func_00164798, .L121_func_00164798_body_end - func_00164798

.section .text.func_00174B9C, "ax", %progbits
.balign 4
.global func_00174B9C
.type func_00174B9C, %function
func_00174B9C:
    add r1, r0, #4
    mov r2, #0
    str r1, [r0, #4]
    str r2, [r0]
    str r1, [r0, #8]
    add r3, r0, #16
    strd r2, [r0, #12]
    add r1, r0, #24
    str r3, [r0, #20]
    add r3, r0, #28
    strd r2, [r1]
    add r1, r0, #36
    str r3, [r0, #32]
    add r3, r0, #40
    strd r2, [r1]
    str r3, [r0, #44]
    mvn r3, #-2147483648
    str r2, [r0, #56]
    mov ip, #1
    vldr s1, .L121_func_00174B9C_136
    str r3, [r0, #52]
    vldr s0, .L121_func_00174B9C_132
    str ip, [r0, #48]
    vstr s1, [r0, #60]
    mvn r1, #0
    vstr s0, [r0, #64]
    str r1, [r0, #68]
    vstr s0, [r0, #72]
    vstr s0, [r0, #76]
    strb r2, [r0, #88]
    vstr s0, [r0, #80]
    vstr s0, [r0, #84]
    bx lr
.L121_func_00174B9C_body_end:
.L121_func_00174B9C_132:
    .word runtime_float_zero_38
.L121_func_00174B9C_136:
    .word runtime_float_unit_38
.size func_00174B9C, .L121_func_00174B9C_body_end - func_00174B9C

.section .text.func_001753F0, "ax", %progbits
.balign 4
.global func_001753F0
.type func_001753F0, %function
func_001753F0:
    ldr r1, .L121_func_001753F0_32
    ldr r3, .L121_func_001753F0_36
    ldr r2, .L121_func_001753F0_40
    ldr r0, [r1]
    mla r2, r0, r3, r2
    str r2, [r1]
    lsr r0, r2, #16
    bx lr
.L121_func_001753F0_body_end:
.L121_func_001753F0_32:
    .word runtime_literal_121_6
.L121_func_001753F0_36:
    .word runtime_literal_121_7
.L121_func_001753F0_40:
    .word runtime_literal_121_8
.size func_001753F0, .L121_func_001753F0_body_end - func_001753F0

.section .text.func_0017851C, "ax", %progbits
.balign 4
.global func_0017851C
.type func_0017851C, %function
func_0017851C:
    ldr r1, .L121_func_0017851C_80
    mvn r2, #24
    smull r3, r1, r1, r0
    asr r3, r1, #7
    sub r3, r3, r1, asr #31
    mul r2, r3, r2
    adds r2, r0, r2, lsl #4
    beq .L121_func_0017851C_72
    asr r3, r1, #5
    mvn r2, #24
    sub r1, r3, r1, asr #31
    mul r1, r1, r2
    adds r1, r0, r1, lsl #2
    beq .L121_func_0017851C_64
    tst r0, #3
    beq .L121_func_0017851C_72
.L121_func_0017851C_64:
    mov r0, #0
    bx lr
.L121_func_0017851C_72:
    mov r0, #1
    bx lr
.L121_func_0017851C_body_end:
.L121_func_0017851C_80:
    .word runtime_literal_121_9
.size func_0017851C, .L121_func_0017851C_body_end - func_0017851C

.section .text.func_001797F4, "ax", %progbits
.balign 4
.global func_001797F4
.type func_001797F4, %function
func_001797F4:
    mov r3, #0
    str r3, [r0, #4]
    mov ip, #1
    str ip, [r0, #4]
    ldr ip, .L121_func_001797F4_108
    strb r3, [r0, #8]
    str r3, [r0, #12]
    str ip, [r0]
    str r3, [r0, #16]
    str r3, [r0, #28]
    strb r1, [r0, #32]
    ldrb r1, [r2]
    mov r2, r3
    mov ip, r3
    strb r1, [r0, #33]
    add r1, r0, #48
    stm r1, {r2, ip}
    mov r1, #1
    strb r3, [r0, #34]
    str r3, [r0, #36]
    str r3, [r0, #40]
    str r3, [r0, #24]
    strb r3, [r0, #57]
    strb r3, [r0, #58]
    strb r3, [r0, #20]
    strb r1, [r0, #56]
    bx lr
.L121_func_001797F4_body_end:
.L121_func_001797F4_108:
    .word runtime_literal_121_10
.size func_001797F4, .L121_func_001797F4_body_end - func_001797F4

.section .note.GNU-stack, "", %progbits
