.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.extern func_00139660
.extern func_0014E348
.extern func_00164060

.macro DT84_BEGIN name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
.endm

.macro DT84_END name
.size \name, . - \name
.endm

.macro DT84_A name, callee
DT84_BEGIN \name
    push {r4, lr}
    bl \callee
DT84_END \name
.endm

.macro DT84_B name, callee
DT84_BEGIN \name
    push {r4, lr}
    mov r4, r0
    bl \callee
DT84_END \name
.endm

.macro DT84_C name
DT84_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r0
    bl func_0014E348
DT84_END \name
.endm

.macro DT84_D name
DT84_BEGIN \name
    push {r4, lr}
    mov r4, r1
    bl func_00139660
DT84_END \name
.endm

.macro DT84_E name
DT84_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    bl func_0014E348
DT84_END \name
.endm

DT84_A func_0010BD44, func_00139660
DT84_A func_00125688, func_00164060
DT84_A func_0012C7DC, func_00139660
DT84_A func_001602A4, func_00164060
DT84_A func_00173C38, func_00164060
DT84_A func_004212F4, func_00139660
DT84_A func_00421314, func_00139660
DT84_A func_0045B758, func_0014E348
DT84_A func_0045BE20, func_0014E348
DT84_A func_0046049C, func_0014E348

DT84_B func_0015208C, func_0014E348
DT84_B func_00152140, func_0014E348
DT84_B func_00164198, func_00164060
DT84_B func_0016A3E8, func_0014E348
DT84_B func_0016A510, func_0014E348
DT84_B func_00173C10, func_00164060
DT84_B func_0043EFAC, func_0014E348
DT84_B func_0045BEA4, func_0014E348

DT84_C func_00151F74
DT84_C func_0015204C
DT84_C func_001520BC
DT84_C func_00152100
DT84_C func_0016A418

DT84_D func_0041B834
DT84_D func_004213CC
DT84_D func_00421494
DT84_D func_00421684

DT84_E func_00151FC0
DT84_E func_0045BC6C
DT84_E func_0045BE4C
