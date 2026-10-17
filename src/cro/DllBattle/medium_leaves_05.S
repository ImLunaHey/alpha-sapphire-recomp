.syntax unified
.arch armv6k
.fpu vfp
.arm

.macro FUNCTION_BEGIN name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
.endm

.macro FUNCTION_END name
.size \name, . - \name
.endm

FUNCTION_BEGIN func_000596B4
    add r2, r2, r2, lsl #1
    add r0, r0, r2, lsl #2
    add r3, r0, #0x208
    vldr s4, [r0, #0x208]
    vldr s6, [r0, #0x220]
    vldr s3, [r0, #0x20C]
    vldr s1, [r0, #0x210]
    vldr s5, [r0, #0x224]
    vldr s2, [r0, #0x228]
    add r2, r0, #0x220
    vadd.f32 s4, s4, s6
    vadd.f32 s5, s3, s5
    vadd.f32 s6, s1, s2
    vldmia r3, {s1-s3}
    vldr s7, [r0, #0x228]
    add r0, r0, #0x238
    vldmia r2, {s8-s9}
    vadd.f32 s7, s3, s7
    vldr s3, [r0]
    vadd.f32 s1, s1, s8
    vadd.f32 s2, s2, s9
    vldr s8, [r0, #8]
    vldr s9, [r0, #4]
    vsub.f32 s3, s1, s3
    vsub.f32 s1, s7, s8
    vsub.f32 s2, s2, s9
    vmul.f32 s7, s3, s3
    vmla.f32 s7, s2, s2
    vmla.f32 s7, s1, s1
    vsqrt.f32 s8, s7
    vdiv.f32 s7, s0, s8
    vmul.f32 s0, s3, s7
    vmul.f32 s3, s1, s7
    vmul.f32 s2, s2, s7
    vsub.f32 s1, s4, s0
    vsub.f32 s0, s6, s3
    vsub.f32 s2, s5, s2
    vstr s0, [r1, #8]
    vstmia r1, {s1-s2}
    bx lr
FUNCTION_END func_000596B4

FUNCTION_BEGIN func_00071AF8
    mov r2, #0
.L71AF8_loop:
    add r3, r2, r2, lsl #1
    ldrb ip, [r0, r3]
    cmp ip, #0
    beq .L71AF8_second
    add ip, r3, r0
    ldrb ip, [ip, #2]
    cmp ip, r1
    bne .L71AF8_second
    and r0, r2, #0xFF
    bx lr
.L71AF8_second:
    add r3, r3, r0
    ldrb ip, [r3, #3]
    cmp ip, #0
    beq .L71AF8_next
    ldrb r3, [r3, #5]
    cmp r3, r1
    bne .L71AF8_next
    add r0, r2, #1
    and r0, r0, #0xFF
    bx lr
.L71AF8_next:
    add r2, r2, #2
    cmp r2, #10
    blo .L71AF8_loop
    mov r0, #10
    bx lr
FUNCTION_END func_00071AF8

FUNCTION_BEGIN func_00075D50
    cmp r2, #0
    push {r4}
    beq .L75D50_false
    and r3, r2, #1
    cmp r3, #0
    mov ip, #0
    bls .L75D50_pairs
.L75D50_first:
    add r4, r1, ip, lsl #1
    ldrh r4, [r4]
    cmp r4, r0
    beq .L75D50_true
    add ip, ip, #1
    cmp r3, ip
    bhi .L75D50_first
.L75D50_pairs:
    cmp r2, r3
    bls .L75D50_false
.L75D50_pair_loop:
    add ip, r1, r3, lsl #1
    ldrh r4, [ip]
    cmp r4, r0
    ldrhne ip, [ip, #2]
    cmpne ip, r0
    bne .L75D50_next
.L75D50_true:
    pop {r4}
    mov r0, #1
    bx lr
.L75D50_next:
    add r3, r3, #2
    cmp r2, r3
    bhi .L75D50_pair_loop
.L75D50_false:
    pop {r4}
    mov r0, #0
    bx lr
FUNCTION_END func_00075D50

FUNCTION_BEGIN func_0007C854
    push {r4}
    ldr r2, [r0]
    mov ip, #0x1F8
    mov r3, #8
    and r4, r2, #7
    cmp r4, #2
    and r1, ip, r1, lsl #3
    bne .L7C854_kind_four
    lsl ip, r2, #23
    cmp r3, ip, lsr #26
    bls .L7C854_kind_four
    bic r2, r2, #0x1F8
    orr r2, r2, r1
    str r2, [r0]
.L7C854_kind_four:
    and ip, r2, #7
    cmp ip, #4
    bne .L7C854_done
    lsl ip, r2, #23
    cmp r3, ip, lsr #26
    bls .L7C854_done
    bic r2, r2, #0x1F8
    orr r1, r1, r2
    str r1, [r0]
.L7C854_done:
    pop {r4}
    bx lr
FUNCTION_END func_0007C854
