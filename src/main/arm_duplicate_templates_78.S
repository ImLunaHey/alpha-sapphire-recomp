.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT78_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT78_END name
.size \name,.-\name
.endm

.macro DT78_QUERY_NOTIFY name, notify
DT78_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    bl func_0011EC38
    mov r5, r0
    mov r1, r0
    mov r0, r4
    bl \notify
    mov r0, r5
    pop {r4, r5, r6, pc}
DT78_END \name
.endm

.macro DT78_ANY_READY name, first, second
DT78_BEGIN \name
    push {r4, lr}
    bl \first
    cmp r0, #0
    bne .Ldt78_true\@
    bl \second
    cmp r0, #0
    beq .Ldt78_done\@
.Ldt78_true\@:
    mov r0, #1
.Ldt78_done\@:
    pop {r4, pc}
DT78_END \name
.endm

.macro DT78_FORWARD_VFP4 name, destination
DT78_BEGIN \name
    push {lr}
    sub sp, sp, #20
    add ip, sp, #24
    vldmia ip, {s0-s3}
    vstmia sp, {s0-s3}
    bl \destination
    add sp, sp, #20
    pop {pc}
DT78_END \name
.endm

.macro DT78_FORWARD_WORDS3 name, destination
DT78_BEGIN \name
    push {r4, r5, lr}
    sub sp, sp, #12
    add lr, sp, #24
    ldm lr, {r4, r5, ip}
    stm sp, {r4, r5, ip}
    bl \destination
    add sp, sp, #12
    pop {r4, r5, pc}
DT78_END \name
.endm

.macro DT78_FORWARD_WORDS4 name, destination
DT78_BEGIN \name
    push {r4, r5, r6, lr}
    sub sp, sp, #16
    add lr, sp, #32
    ldm lr, {r4, r5, r6, ip}
    stm sp, {r4, r5, r6, ip}
    bl \destination
    add sp, sp, #16
    pop {r4, r5, r6, pc}
DT78_END \name
.endm

.macro DT78_CALL_PRESERVE name, destination
DT78_BEGIN \name
    push {r4, lr}
    mov r4, r0
    bl \destination
    mov r0, r4
    pop {r4, pc}
DT78_END \name
.endm

.macro DT78_QUERY_MEMBER_BYTE name, destination
DT78_BEGIN \name
    push {r4, lr}
    ldr r0, [r0, #12]
    bl \destination
    and r0, r0, #255
    pop {r4, pc}
DT78_END \name
.endm

.macro DT78_READ_NESTED_WORD name, destination
DT78_BEGIN \name
    ldr r0, [r0, #4]
    mov r0, r0
    push {r4, lr}
    ldr r0, [r0, #60]
    bl \destination
    ldr r0, [r0]
    pop {r4, pc}
DT78_END \name
.endm

.macro DT78_INVERT_TEST name
DT78_BEGIN \name
    add r0, r0, #12
    push {r4, lr}
    bl func_00124150
    cmp r0, #0
    movne r0, #0
    moveq r0, #1
    pop {r4, pc}
DT78_END \name
.endm

.macro DT78_OPTIONAL_MEMBER name, destination
DT78_BEGIN \name
    ldr r0, [r0, #312]
    cmp r0, #0
    beq .Ldt78_return\@
    b \destination
.Ldt78_return\@:
    bx lr
DT78_END \name
.endm

.macro DT78_OPTIONAL_WORD name, destination
DT78_BEGIN \name
    ldr r0, [r0, #4]
    cmp r0, #0
    beq .Ldt78_return\@
    b \destination
.Ldt78_return\@:
    bx lr
DT78_END \name
.endm

.macro DT78_STACK_RESULT name
DT78_BEGIN \name
    push {r3, lr}
    mov r1, sp
    bl func_0052B610
    ldr r0, [sp]
    pop {r3, pc}
DT78_END \name
.endm

DT78_QUERY_NOTIFY func_001122EC, arm_duplicate_templates_78_secondary_0010FC60
DT78_QUERY_NOTIFY func_0011ECB0, func_00125D3C
DT78_ANY_READY func_0011ABA0, func_0011A6B4, func_00125F70
DT78_ANY_READY func_0043B6C4, func_00200ABC, func_00200BA0
DT78_FORWARD_VFP4 func_001344CC, func_0012FFC8
DT78_FORWARD_VFP4 func_0017CAC4, func_0016092C
DT78_FORWARD_WORDS3 func_001426C0, func_00148720
DT78_FORWARD_WORDS3 func_00158424, func_00164D2C
DT78_FORWARD_WORDS4 func_00158444, func_00164914
DT78_FORWARD_WORDS4 func_00158464, func_00164A54
DT78_CALL_PRESERVE func_00149B94, func_00165F58
DT78_CALL_PRESERVE func_002056A8, func_00204B04
DT78_QUERY_MEMBER_BYTE func_004D2508, func_00152F08
DT78_QUERY_MEMBER_BYTE func_004D2EA4, func_004D22DC
DT78_READ_NESTED_WORD func_00152EA8, func_0016B220
DT78_READ_NESTED_WORD func_004C0294, func_004BF8D0
DT78_INVERT_TEST func_00333BDC
DT78_INVERT_TEST func_003354C8
DT78_OPTIONAL_MEMBER func_00150168, arm_duplicate_templates_78_secondary_00161478
DT78_OPTIONAL_MEMBER func_00169770, arm_duplicate_templates_78_secondary_00171C4C
DT78_OPTIONAL_WORD func_00176670, func_001003E0
DT78_OPTIONAL_WORD func_0035629C, func_00371CF4
DT78_STACK_RESULT func_002AEC04
DT78_STACK_RESULT func_002AEE08
