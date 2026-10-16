.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT72_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT72_END name
.size \name, .-\name
.endm

.macro DT72_REGISTER name, record_bytes, constructor
DT72_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r5, r1
    adr r0, .Ldt72_post_body_identity\@
    mov r1, #0
    bl func_0036F28C
    mov r6, r0
    ldr r1, [r4, #4]
    mov r0, #\record_bytes
    bl func_00123480
    cmp r0, #0
    movne r1, r5
    blne \constructor
    str r4, [r0, #28]
    mov r1, r0
    str r6, [r0, #16]
    mov r0, r4
    pop {r4, r5, r6, lr}
    b func_003AB384
.Ldt72_post_body_identity\@:
DT72_END \name
.endm

.macro DT72_COPY name, helper
DT72_BEGIN \name
    push {r4, lr}
    mov r2, r1
    sub sp, sp, #8
    mov r4, r0
    mov r1, r0
    mov r0, sp
    bl \helper
    ldrd r0, [sp]
    strd r0, [r4]
    add sp, sp, #8
    pop {r4, pc}
DT72_END \name
.endm

.macro DT72_RELEASE name
DT72_BEGIN \name
    cmp r0, #0
    bxeq lr
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0, #-32]
    bl func_0012BB5C
    mov r5, r0
    ldr r0, [r0]
    sub r6, r4, #32
    ldr r1, [r0, #32]
    mov r0, r5
    blx r1
    mov r1, r0
    ldr r0, [r6]
    cmp r1, r0
    beq .Ldt72_equal\@
    bl func_0012BB5C
    ldr r2, [r0]
    ldrh r1, [r4, #-28]
    mov r5, r0
    ldr r2, [r2, #92]
    sub r1, r4, r1
    blx r2
    ldr r0, [r5]
    ldr r1, [r0, #76]
    mov r0, r5
    pop {r4, r5, r6, lr}
    bx r1
.Ldt72_equal\@:
    ldr r0, [r5]
    ldr r1, [r0, #76]
    mov r0, r5
    blx r1
    ldrh r0, [r4, #-28]
    sub r1, r4, r0
    ldr r0, [r5]
    ldr r2, [r0, #92]
    mov r0, r5
    pop {r4, r5, r6, lr}
    bx r2
DT72_END \name
.endm

DT72_REGISTER func_00368314, 44, func_0019C0E8
DT72_REGISTER func_003687E4, 44, func_0019C110
DT72_REGISTER func_00368998, 44, func_0019C120
DT72_REGISTER func_00368A24, 44, func_0019C128
DT72_REGISTER func_003697D8, 44, func_0019C1C8
DT72_REGISTER func_0036A20C, 44, func_0019C270
DT72_REGISTER func_0036AAC4, 44, func_0019C2F8
DT72_REGISTER func_0036AB30, 44, func_0019C300

DT72_REGISTER func_00367AAC, 40, func_0019C040
DT72_REGISTER func_00367B08, 40, func_0019C048
DT72_REGISTER func_00368160, 40, func_0019C0D0
DT72_REGISTER func_003692C0, 40, func_0019C1A0
DT72_REGISTER func_00369394, 40, func_0019C1B0
DT72_REGISTER func_0036A98C, 40, func_0019C2E0
DT72_REGISTER func_0036A9F8, 40, func_0019C2E8

DT72_COPY func_003A5A64, func_004AA62C
DT72_COPY func_003A5A90, func_004A9F64
DT72_COPY func_003A5ABC, func_004AA094
DT72_COPY func_003A5AE8, func_004AA154
DT72_COPY func_003A5B14, func_004AA280
DT72_COPY func_003A5B40, func_004AA554
DT72_COPY func_003A5B6C, func_004AA5C0

DT72_RELEASE func_002FF8C0
DT72_RELEASE func_00302108
