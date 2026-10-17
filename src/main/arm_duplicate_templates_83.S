.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.extern func_00168EC0
.extern func_00168E50
.extern func_0016BC84
.extern func_0016BD80
.extern func_00176EFC

.macro DT83_BEGIN name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
.endm

.macro DT83_END name
.size \name, . - \name
.endm

.macro DT83_SET_BYTE name, mode, accessor, field
DT83_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r1
    mov r5, r0
    bl func_00168EC0
    mov r1, #\mode
    mov r0, r5
    bl \accessor
    strb r4, [r0, #\field]
    mov r0, r5
    pop {r4, r5, r6, lr}
    b func_00168E50
DT83_END \name
.endm

.macro DT83_GET_BYTE_BODY accessor, field
    push {r4, r5, r6, lr}
    mov r5, r0
    bl func_00168EC0
    mov r1, #0
    mov r0, r5
    bl \accessor
    ldrb r4, [r0, #\field]
    mov r0, r5
    bl func_00168E50
    mov r0, r4
    pop {r4, r5, r6, pc}
.endm

.macro DT83_GET_BYTE name, field
DT83_BEGIN \name
    DT83_GET_BYTE_BODY func_0016BC84, \field
DT83_END \name
.endm

.macro DT83_NESTED_GET_BYTE name, accessor, field
DT83_BEGIN \name
    ldr r0, [r0, #12]
    mov r0, r0
    DT83_GET_BYTE_BODY \accessor, \field
DT83_END \name
.endm

DT83_SET_BYTE func_0014F25C, 1, func_0016BC84, 12
DT83_SET_BYTE func_0014F288, 1, func_0016BD80, 48
DT83_SET_BYTE func_0014F2B4, 0, func_0016BD80, 50
DT83_SET_BYTE func_0014F3F8, 0, func_0016BD80, 49
DT83_SET_BYTE func_0014FAF8, 0, func_0016BD80, 51
DT83_SET_BYTE func_003B2930, 1, func_0016BC84, 22
DT83_SET_BYTE func_003B2A44, 1, func_0016BC84, 25
DT83_SET_BYTE func_003B2A70, 1, func_0016BC84, 23
DT83_SET_BYTE func_003B2A9C, 1, func_0016BC84, 24
DT83_SET_BYTE func_003B3430, 1, func_00176EFC, 43
DT83_SET_BYTE func_003B3564, 1, func_00176EFC, 42
DT83_SET_BYTE func_003B3590, 1, func_00176EFC, 45
DT83_SET_BYTE func_003B35E8, 1, func_00176EFC, 46
DT83_SET_BYTE func_003B3684, 1, func_00176EFC, 44

DT83_GET_BYTE func_00152F08, 20
DT83_GET_BYTE func_00152F34, 25
DT83_GET_BYTE func_00152F60, 23
DT83_GET_BYTE func_00152F8C, 24
DT83_GET_BYTE func_004D1248, 34
DT83_GET_BYTE func_004D1330, 35
DT83_GET_BYTE func_004D1730, 12

DT83_NESTED_GET_BYTE func_004D1274, func_0016BD80, 44
DT83_NESTED_GET_BYTE func_004D1C18, func_0016BC84, 15
DT83_NESTED_GET_BYTE func_004D1C4C, func_0016BC84, 14
DT83_NESTED_GET_BYTE func_004D1CDC, func_00176EFC, 26
DT83_NESTED_GET_BYTE func_004D1DA4, func_0016BD80, 47
DT83_NESTED_GET_BYTE func_004D1F90, func_00176EFC, 42
DT83_NESTED_GET_BYTE func_004D2478, func_0016BD80, 51
