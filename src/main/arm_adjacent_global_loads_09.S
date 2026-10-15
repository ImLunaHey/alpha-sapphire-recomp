.syntax unified
.arch armv6k
.arm

.macro ARM_ADJACENT_GLOBAL_LOAD name, identity, read, displacement
    .section .text.\name,"ax",%progbits
    .balign 4
    .global \name
    .type \name, %function
\name:
    ldr r0, .Lidentity_\name
    \read r0, [r0, #\displacement]
    bx lr
    .size \name, .-\name
.Lidentity_\name:
    .word \identity
    .global \identity
.endm

ARM_ADJACENT_GLOBAL_LOAD func_001076EC, global_load_01, ldr, 16
ARM_ADJACENT_GLOBAL_LOAD func_0011D62C, global_load_01, ldr, 240
ARM_ADJACENT_GLOBAL_LOAD func_0010963C, global_load_02, ldr, 8
ARM_ADJACENT_GLOBAL_LOAD func_00145D44, global_load_02, ldr, 4
ARM_ADJACENT_GLOBAL_LOAD func_00145D54, global_load_02, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_001098A8, global_load_03, ldrsb, 0
ARM_ADJACENT_GLOBAL_LOAD func_0010FD8C, global_load_03, ldr, 24
ARM_ADJACENT_GLOBAL_LOAD func_0010FE6C, global_load_03, ldrb, 10
ARM_ADJACENT_GLOBAL_LOAD func_0010FF10, global_load_03, ldrsb, 9
ARM_ADJACENT_GLOBAL_LOAD func_0011009C, global_load_03, ldrb, 6
ARM_ADJACENT_GLOBAL_LOAD func_00110530, global_load_03, ldrsb, 1
ARM_ADJACENT_GLOBAL_LOAD func_0011A6B4, global_load_03, ldrsb, 13
ARM_ADJACENT_GLOBAL_LOAD func_0011B75C, global_load_03, ldrb, 5
ARM_ADJACENT_GLOBAL_LOAD func_00125F40, global_load_03, ldr, 16
ARM_ADJACENT_GLOBAL_LOAD func_00125F70, global_load_03, ldrb, 12
ARM_ADJACENT_GLOBAL_LOAD func_00125F94, global_load_03, ldrsb, 8
ARM_ADJACENT_GLOBAL_LOAD func_00125FB8, global_load_03, ldrb, 11
ARM_ADJACENT_GLOBAL_LOAD func_00125FDC, global_load_03, ldrsb, 7
ARM_ADJACENT_GLOBAL_LOAD func_00126000, global_load_03, ldr, 20
ARM_ADJACENT_GLOBAL_LOAD func_001261C0, global_load_03, ldrb, 3
ARM_ADJACENT_GLOBAL_LOAD func_0012649C, global_load_03, ldrb, 2
ARM_ADJACENT_GLOBAL_LOAD func_0010AB08, global_load_04, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_0010AB18, global_load_05, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_0010AB28, global_load_06, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_0010E068, global_load_07, ldr, 32
ARM_ADJACENT_GLOBAL_LOAD func_0010E088, global_load_07, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_0010E098, global_load_07, ldr, 80
ARM_ADJACENT_GLOBAL_LOAD func_00117594, global_load_07, ldr, 4
ARM_ADJACENT_GLOBAL_LOAD func_00122BE0, global_load_07, ldr, 84
ARM_ADJACENT_GLOBAL_LOAD func_0048AFBC, global_load_07, ldrsb, 118
ARM_ADJACENT_GLOBAL_LOAD func_0010FDE0, global_load_08, ldrsb, 2
ARM_ADJACENT_GLOBAL_LOAD func_00110A20, global_load_09, ldrsb, 1
ARM_ADJACENT_GLOBAL_LOAD func_0011204C, global_load_10, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_001152AC, global_load_11, ldrsb, 0
ARM_ADJACENT_GLOBAL_LOAD func_001182C0, global_load_12, ldr, 16
ARM_ADJACENT_GLOBAL_LOAD func_0011EB84, global_load_13, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_00125DB0, global_load_14, ldrsb, 0
ARM_ADJACENT_GLOBAL_LOAD func_00125EB0, global_load_14, ldrsb, 1
ARM_ADJACENT_GLOBAL_LOAD func_00164F64, global_load_14, ldr, 28
ARM_ADJACENT_GLOBAL_LOAD func_001744A0, global_load_14, ldrsb, 2
ARM_ADJACENT_GLOBAL_LOAD func_0012B8FC, global_load_15, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_0012B90C, global_load_16, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_0012B91C, global_load_17, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_0012B92C, global_load_18, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_0012B94C, global_load_19, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_0012B95C, global_load_20, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_00132ED8, global_load_21, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_0013395C, global_load_22, ldrsb, 0
ARM_ADJACENT_GLOBAL_LOAD func_00139650, global_load_23, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_00139660, global_load_24, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_0014A204, global_load_25, ldrsb, 1
ARM_ADJACENT_GLOBAL_LOAD func_0014B80C, global_load_26, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_0014E348, global_load_27, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_0014E358, global_load_28, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_001732BC, global_load_29, ldr, 388
ARM_ADJACENT_GLOBAL_LOAD func_002251F8, global_load_29, ldr, 184
ARM_ADJACENT_GLOBAL_LOAD func_00238094, global_load_29, ldr, 356
ARM_ADJACENT_GLOBAL_LOAD func_0026CF98, global_load_29, ldr, 336
ARM_ADJACENT_GLOBAL_LOAD func_0028D178, global_load_29, ldr, 164
ARM_ADJACENT_GLOBAL_LOAD func_00173ACC, global_load_30, ldr, 812
ARM_ADJACENT_GLOBAL_LOAD func_0017E4D8, global_load_31, ldrsb, 1
ARM_ADJACENT_GLOBAL_LOAD func_00190400, global_load_32, ldrsb, 4
ARM_ADJACENT_GLOBAL_LOAD func_001C86FC, global_load_33, ldrb, 0
ARM_ADJACENT_GLOBAL_LOAD func_001D25E0, global_load_34, ldrsb, 0
ARM_ADJACENT_GLOBAL_LOAD func_001F9E04, global_load_35, ldrsb, 0
ARM_ADJACENT_GLOBAL_LOAD func_001FA9EC, global_load_36, ldrb, 3
ARM_ADJACENT_GLOBAL_LOAD func_001FC264, global_load_37, ldrsb, 0
ARM_ADJACENT_GLOBAL_LOAD func_001FF190, global_load_38, ldrsb, 0
ARM_ADJACENT_GLOBAL_LOAD func_0028D244, global_load_39, ldrb, 10
ARM_ADJACENT_GLOBAL_LOAD func_002BC6E8, global_load_40, ldrsb, 1
ARM_ADJACENT_GLOBAL_LOAD func_002BC6F8, global_load_40, ldrsb, 0
ARM_ADJACENT_GLOBAL_LOAD func_002C2384, global_load_41, ldrsb, 1
ARM_ADJACENT_GLOBAL_LOAD func_002C2394, global_load_41, ldrsb, 0
ARM_ADJACENT_GLOBAL_LOAD func_003A7D68, global_load_42, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_003A7D98, global_load_43, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_003A7DB8, global_load_44, ldr, 0
ARM_ADJACENT_GLOBAL_LOAD func_004119C4, global_load_45, ldrsb, 2
ARM_ADJACENT_GLOBAL_LOAD func_00419058, global_load_46, ldrb, 1
ARM_ADJACENT_GLOBAL_LOAD func_0042D09C, global_load_47, ldrsb, 4
