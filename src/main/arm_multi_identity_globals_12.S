.syntax unified
.arch armv6k
.arm

.macro BEGIN name
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
.endm

.macro END2 name, identity0, identity1
    .size \name, .-\name
    .word \identity0
.Lslot1_\name:
    .word \identity1
    .global \identity0
    .global \identity1
.endm

BEGIN func_0021712C
    ldr r3, .Lslot0_func_0021712C
    ldr ip, .Lslot1_func_0021712C
    str r3, [r0]
    ldmia ip, {r3, ip}
    str r1, [r0, #12]
    str r2, [r0, #16]
    stmib r0, {r3, ip}
    bx lr
.Lslot0_func_0021712C:
END2 func_0021712C, multi_identity_01, multi_identity_02

BEGIN func_00237758
    ldr r1, .Lslot0_func_00237758
    ldr r2, .Lslot1_func_00237758
    stmia r0, {r1, r2}
    bx lr
.Lslot0_func_00237758:
END2 func_00237758, multi_identity_03, multi_identity_04

BEGIN func_0026E970
    ldr r2, .Lslot0_func_0026E970
    str r2, [r0, #4]
    ldr r2, .Lslot1_func_0026E970
    str r2, [r0, #8]
    bx lr
.Lslot0_func_0026E970:
END2 func_0026E970, multi_identity_03, multi_identity_04

BEGIN func_002A2490
    ldr r1, .Lslot0_func_002A2490
    ldr r2, .Lslot1_func_002A2490
    str r1, [r0]
    str r2, [r0, #8]
    bx lr
.Lslot0_func_002A2490:
END2 func_002A2490, multi_identity_05, multi_identity_06

BEGIN func_002C2244
    ldr r0, .Lslot0_func_002C2244
    ldrb r1, [r0, #1]
    ldr r0, .Lslot1_func_002C2244
    ldr r0, [r0, r1, lsl #2]
    bx lr
.Lslot0_func_002C2244:
END2 func_002C2244, global_state_19, multi_identity_12

BEGIN func_0032DCD0
    ldr r2, .Lslot1_func_0032DCD0
    ldr r1, .Lslot0_func_0032DCD0
    str r2, [r0, #140]
    ldr r2, .Lslot2_func_0032DCD0
    str r1, [r0]
    str r2, [r0, #64]
    bx lr
.Lslot0_func_0032DCD0:
    .size func_0032DCD0, .-func_0032DCD0
    .word multi_identity_07
.Lslot1_func_0032DCD0:
    .word multi_identity_08
.Lslot2_func_0032DCD0:
    .word multi_identity_09
    .global multi_identity_07
    .global multi_identity_08
    .global multi_identity_09

BEGIN func_003D4668
    ldr r2, .Lslot0_func_003D4668
    mov r1, #0
    str r1, [r0, #36]
    ldr r1, .Lslot1_func_003D4668
    str r2, [r0, #28]!
    str r1, [r0, #4]
    bx lr
.Lslot0_func_003D4668:
END2 func_003D4668, multi_identity_10, multi_identity_11

BEGIN func_004191B0
    cmp r0, #8
    ldreq r0, .Lslot0_func_004191B0
    ldr r1, .Lslot1_func_004191B0
    ldrbeq r0, [r0, #1]
    ldr r0, [r1, r0, lsl #2]
    bx lr
.Lslot0_func_004191B0:
END2 func_004191B0, global_load_46, multi_identity_13

BEGIN func_0041CE10
    ldr r1, .Lslot0_func_0041CE10
    ldr r2, .Lslot1_func_0041CE10
    str r1, [r0]
    mov r1, #0
    str r2, [r0, #284]
    strb r1, [r0, #280]
    str r1, [r0, #228]
    bx lr
.Lslot0_func_0041CE10:
END2 func_0041CE10, multi_identity_14, multi_identity_15

.section .note.GNU-stack,"",%progbits
