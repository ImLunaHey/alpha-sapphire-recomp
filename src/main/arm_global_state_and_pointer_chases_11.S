.syntax unified
.arch armv6k
.arm

.macro BEGIN name
    .section .text.\name,"ax",%progbits
    .balign 4
    .global \name
    .type \name, %function
\name:
.endm

.macro END name, identity
    .size \name, .-\name
.Lidentity_\name:
    .word \identity
    .global \identity
.endm

.macro STORE_ARG name, identity, op, offset
    BEGIN \name
    ldr r1, .Lidentity_\name
    \op r0, [r1, #\offset]
    bx lr
    END \name, \identity
.endm

.macro STORE_TWO_WB name, identity, first, second, pre, post
    BEGIN \name
    ldr r2, .Lidentity_\name
    str \first, [r2, #\pre]!
    str \second, [r2, #\post]
    bx lr
    END \name, \identity
.endm

.macro PAIRED_STORE name, identity, offset
    BEGIN \name
    ldr r2, .Lidentity_\name
    strd r0, r1, [r2, #\offset]
    bx lr
    END \name, \identity
.endm

.macro STORE_CONST name, identity, op, offset, value
    BEGIN \name
    ldr r1, .Lidentity_\name
    mov r0, #\value
    \op r0, [r1, #\offset]
    bx lr
    END \name, \identity
.endm

.macro STORE_NEG1 name, identity, offset
    BEGIN \name
    ldr r1, .Lidentity_\name
    mvn r0, #0
    str r0, [r1, #\offset]
    bx lr
    END \name, \identity
.endm

.macro LOAD_MASK name, identity, compare, compact=0
    BEGIN \name
    ldr r0, .Lidentity_\name
    ldr r0, [r0, #24]
    .if \compact
    tst r0, #7
    moveq r0, #1
    movne r0, #0
    .else
    and r0, r0, #7
    cmp r0, #\compare
    moveq r0, #1
    movne r0, #0
    .endif
    bx lr
    END \name, \identity
.endm

/* Direct stores. */
STORE_ARG func_00107170, global_state_01, strb, 0
STORE_TWO_WB func_001071D0, global_load_22, r0, r1, 44, 64
STORE_TWO_WB func_001071E4, global_load_22, r0, r1, 32, 64
STORE_TWO_WB func_002DD930, global_load_22, r0, r1, 20, 64
STORE_ARG func_001096BC, global_state_02, str, 0
STORE_ARG func_00109B54, global_state_03, str, 8
STORE_CONST func_00109B64, global_state_03, strb, 0, 1
STORE_ARG func_00109B84, global_state_03, strb, 1
STORE_ARG func_00109B94, global_state_03, str, 4
STORE_ARG func_0010A478, global_load_01, str, 76
STORE_TWO_WB func_0010A49C, global_load_01, r1, r0, 80, 4
STORE_ARG func_0010AB38, global_load_01, str, 24
STORE_ARG func_0010AC24, global_load_01, str, 108
STORE_ARG func_0010B468, global_load_46, strb, 1
STORE_CONST func_0010FCE0, global_load_14, strb, 1, 1
STORE_ARG func_0010FDBC, global_load_03, str, 24
STORE_CONST func_0010FF20, global_load_03, strb, 9, 1
STORE_ARG func_0010FF34, global_load_03, str, 20
STORE_CONST func_00110540, global_load_03, strb, 1, 1
STORE_ARG func_0011A694, global_load_03, strb, 12
STORE_ARG func_0011A6A4, global_load_03, strb, 11
STORE_ARG func_0011AB7C, global_load_03, strb, 13
STORE_ARG func_0011B76C, global_load_03, strb, 5
STORE_ARG func_0011B77C, global_load_03, strb, 6
STORE_ARG func_00125F50, global_load_03, str, 16
STORE_ARG func_00125F60, global_load_03, strb, 10
STORE_CONST func_00125F80, global_load_03, strb, 8, 1
STORE_CONST func_00125FA4, global_load_03, strb, 8, 0
STORE_CONST func_00125FC8, global_load_03, strb, 7, 1
STORE_CONST func_00125FEC, global_load_03, strb, 7, 0
STORE_CONST func_00126010, global_load_03, strb, 1, 0
STORE_ARG func_001261D0, global_load_03, strb, 4
STORE_ARG func_001261E0, global_load_03, strb, 3
STORE_CONST func_001263DC, global_load_03, strb, 3, 0
STORE_ARG func_001265B8, global_load_03, strb, 2
STORE_CONST func_001265C8, global_load_03, strb, 2, 0
STORE_ARG func_0010FFC4, global_state_04, str, 0
STORE_ARG func_00112914, global_state_05, str, 0
STORE_ARG func_00118334, global_state_06, str, 0
PAIRED_STORE func_0011B704, global_state_07, 4
STORE_ARG func_001242D0, global_state_08, strb, 0
STORE_CONST func_0013294C, global_state_09, str, 16, 1
STORE_NEG1 func_00132960, global_state_10, 32
STORE_NEG1 func_00132974, global_state_11, 68
STORE_NEG1 func_00132A00, global_state_12, 32
STORE_ARG func_00134924, global_state_13, str, 0
STORE_ARG func_00134958, global_state_13, str, 4
STORE_ARG func_00146768, global_load_29, strb, 1
STORE_ARG func_00206708, global_load_29, strb, 23
STORE_ARG func_002A0690, global_load_29, strb, 14
STORE_ARG func_001C3228, global_state_15, str, 0
STORE_CONST func_001C3D7C, global_load_33, strb, 0, 0
STORE_ARG func_001D2250, global_state_16, strb, 11
STORE_ARG func_001D2278, global_state_16, strb, 19
STORE_ARG func_001D2288, global_state_16, strb, 10
STORE_ARG func_001D2298, global_state_16, strb, 0
STORE_ARG func_001D2958, global_state_17, strh, 0
STORE_ARG func_001D2968, global_state_17, str, 16
STORE_ARG func_001FF180, global_state_18, str, 4
STORE_ARG func_002AC084, global_load_39, str, 56
STORE_ARG func_002AC094, global_load_39, str, 52
STORE_CONST func_002C21AC, global_state_19, strb, 1, 13
STORE_CONST func_0048AE48, global_load_07, strb, 117, 1

/* Ordered updates and multi-field writes. */
BEGIN func_0011C368
    ldr r1, .Lidentity_func_0011C368
    eor r0, r0, #255
    ldrb r2, [r1, #2]
    and r0, r0, r2
    strb r0, [r1, #2]
    bx lr
END func_0011C368, global_load_09

BEGIN func_00140C88
    ldr r1, .Lidentity_func_00140C88
    mov r2, #0
    ldr r0, [r1]
    str r2, [r1]
    bx lr
END func_00140C88, global_state_14

BEGIN func_001D2260
    ldr r1, .Lidentity_func_001D2260
    cmp r0, #0
    movne r0, #4
    strb r0, [r1, #15]
    bx lr
END func_001D2260, global_state_16

BEGIN func_002A9DF0
    ldr r1, .Lidentity_func_002A9DF0
    ldr r2, [r1, #64]
    str r0, [r1, #64]
    mov r0, r2
    bx lr
END func_002A9DF0, global_load_39

BEGIN func_0040ECA8
    ldr r1, .Lidentity_func_0040ECA8
    mov r0, #0
    str r0, [r1]
    add r1, r1, #4
    str r0, [r1]
    bx lr
END func_0040ECA8, opaque_39

.macro FLAGGED_STORE name, identity, value_offset, flag_offset
    BEGIN \name
    ldr r1, .Lidentity_\name
    mov r2, #1
    str r0, [r1, #\value_offset]
    strb r2, [r1, #\flag_offset]
    bx lr
    END \name, \identity
.endm
FLAGGED_STORE func_0040F3B8, global_state_20, 4, 0
FLAGGED_STORE func_0041107C, global_state_20, 12, 2
FLAGGED_STORE func_00411094, global_state_20, 8, 1

BEGIN func_0050D54C
    ldr r1, .Lidentity_func_0050D54C
    ldr r2, [r1]
    add r0, r0, r2
    str r0, [r1]
    bx lr
END func_0050D54C, global_load_26

.macro ZERO_TWO name, identity, off0, off1
    BEGIN \name
    ldr r0, .Lidentity_\name
    mov r1, #0
    str r1, [r0, #\off0]
    str r1, [r0, #\off1]
    bx lr
    END \name, \identity
.endm
ZERO_TWO func_005298E8, global_state_21, 0, 12
ZERO_TWO func_00529940, global_state_22, 4, 0

/* Pointer chases and derived values. */
BEGIN func_0010A488
    ldr r1, .Lidentity_func_0010A488
    ldr r1, [r1, #84]
    ldr r0, [r1, r0, lsl #2]
    bx lr
END func_0010A488, global_load_01

BEGIN func_0010E2B4
    ldr r0, .Lidentity_func_0010E2B4
    ldr r0, [r0]
    ldr r0, [r0, #4]
    bx lr
END func_0010E2B4, global_load_42

BEGIN func_0010EED4
    ldr r0, .Lidentity_func_0010EED4
    ldr r0, [r0]
    cmp r0, #0
    addne r0, r0, #128
    bx lr
END func_0010EED4, global_state_23

BEGIN func_0010EF3C
    ldr r0, .Lidentity_func_0010EF3C
    ldr r0, [r0]
    cmp r0, #0
    ldrne r0, [r0]
    moveq r0, #3
    bx lr
END func_0010EF3C, global_state_23

LOAD_MASK func_0010FD9C, global_load_03, 6
BEGIN func_0010FDCC
    ldr r0, .Lidentity_func_0010FDCC
    ldr r0, [r0, #24]
    and r0, r0, #7
    bx lr
END func_0010FDCC, global_load_03
LOAD_MASK func_00125F24, global_load_03, 0, 1
LOAD_MASK func_0013396C, global_load_03, 2

BEGIN func_00110A44
    ldr r1, .Lidentity_func_00110A44
    ldrb r1, [r1, #2]
    ands r0, r0, r1
    movne r0, #1
    bx lr
END func_00110A44, global_load_09

BEGIN func_001285D8
    ldr r0, .Lidentity_func_001285D8
    ldr r0, [r0]
    ldrb r0, [r0]
    bx lr
END func_001285D8, global_state_24

.macro PTR_ADD name, identity, ptr_offset, addend
    BEGIN \name
    ldr r0, .Lidentity_\name
    ldr r0, [r0, #\ptr_offset]
    add r0, r0, #\addend
    bx lr
    END \name, \identity
.endm
PTR_ADD func_0014718C, global_load_29, 356, 476
PTR_ADD func_001471A0, global_load_29, 356, 504

BEGIN func_0026BCD8
    ldr r0, .Lidentity_func_0026BCD8
    ldr r0, [r0, #464]
    cmp r0, #0
    ldrne r0, [r0, #8]
    bx lr
END func_0026BCD8, global_load_29

.macro CONDITIONAL_BYTE name, identity, byte_offset
    BEGIN \name
    ldr r1, .Lidentity_\name
    ldr r1, [r1, #336]
    cmp r1, #0
    ldrbeq r0, [r0, #\byte_offset]
    movne r0, #3
    bx lr
    END \name, \identity
.endm
CONDITIONAL_BYTE func_004AB9A8, global_load_29, 26
CONDITIONAL_BYTE func_004AB9C4, global_load_29, 27

BEGIN func_0014881C
    mov r0, r0
    ldr r0, .Lidentity_func_0014881C
    ldr r0, [r0, #28]
    ldrsb r0, [r0, #117]
    bx lr
END func_0014881C, global_load_14

BEGIN func_00148880
    mov r0, r0
    ldr r0, .Lidentity_func_00148880
    ldr r0, [r0, #12]
    bx lr
END func_00148880, global_load_14

BEGIN func_001F4098
    ldr r0, .Lidentity_func_001F4098
    ldr r0, [r0]
    cmp r0, #0
    movne r0, #1
    bx lr
END func_001F4098, global_state_25

BEGIN func_001FAB00
    mov r0, r0
    ldr r0, .Lidentity_func_001FAB00
    ldr r0, [r0, #12]
    ldrb r1, [r0, #8]
    cmp r1, #2
    ldrbeq r0, [r0, #10]
    movne r0, #0
    bx lr
END func_001FAB00, global_state_26

BEGIN func_001FACCC
    mov r0, r0
    ldr r0, .Lidentity_func_001FACCC
    ldr r0, [r0, #12]
    ldrb r0, [r0, #8]
    bx lr
END func_001FACCC, global_state_26

BEGIN func_002C2E74
    ldr r1, .Lidentity_func_002C2E74
    ldrh r1, [r1]
    cmp r0, r1
    movcc r0, #1
    movcs r0, #0
    bx lr
END func_002C2E74, global_state_27

BEGIN func_004F2DCC
    ldr r0, .Lidentity_func_004F2DCC
    ldr r0, [r0]
    ldr r0, [r0, #8]
    ldr r0, [r0, #12]
    bx lr
END func_004F2DCC, global_state_28

BEGIN func_00529900
    ldr r1, .Lidentity_func_00529900
    ldr r0, [r1, r0, lsl #2]
    bx lr
END func_00529900, global_state_29

.section .note.GNU-stack,"",%progbits
