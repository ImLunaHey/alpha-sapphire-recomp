.syntax unified
.arm

.extern arm_duplicate_templates_20_type_00115044
.extern arm_duplicate_templates_20_type_001150C8

.macro BEGIN_FUNCTION name
    .section .text.\name, "ax", %progbits
    .align 2
    .arm
    .global \name
    .type \name, %function
\name:
.endm

.macro END_FUNCTION name
    .size \name, . - \name
.endm

.macro TWO_WORD_ZERO name
    BEGIN_FUNCTION \name
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    bx lr
    END_FUNCTION \name
.endm

.macro TYPED_SENTINEL name, identity
    BEGIN_FUNCTION \name
    ldr r1, 99f
    mov r2, #0
    add r3, r0, #32
    str r1, [r0]
    add r1, r0, #28
    strd r2, [r1]
    str r2, [r0, #4]
    str r3, [r0, #36]
    str r2, [r0, #8]
    str r2, [r0, #12]
    str r2, [r0, #16]
    str r2, [r0, #20]
    strb r2, [r0, #24]
    bx lr
    END_FUNCTION \name
99:
    .word \identity
.endm

.macro BIASED_HALFWORD_ADDRESS name
    BEGIN_FUNCTION \name
    push {r4, r5, r6, lr}
    mov r5, r0
    sub r0, r1, #0x4000
    cmp r0, #0x178
    mov r4, r1
    blt 1f
    mov r2, #0
    mov r1, r2
    mov r0, r2
    mov r0, r0
1:
    add r0, r5, r4, lsl #1
    sub r0, r0, #0x7c00
    sub r0, r0, #0x3fc
    pop {r4, r5, r6, pc}
    END_FUNCTION \name
.endm

.macro FOUR_WORD_BYTE_SWAP name
    BEGIN_FUNCTION \name
    ldr r1, [r0]
    rev r1, r1
    str r1, [r0]
    ldr r1, [r0, #4]
    rev r1, r1
    str r1, [r0, #4]
    ldr r1, [r0, #8]
    rev r1, r1
    str r1, [r0, #8]
    ldr r1, [r0, #12]
    rev r1, r1
    str r1, [r0, #12]
    bx lr
    END_FUNCTION \name
.endm

.macro OPTIONAL_BACKLINK_DETACH name
    BEGIN_FUNCTION \name
    ldr r1, [r0]
    cmp r1, #0
    beq 2f
    ldr r3, [r1, #276]
    mov r2, #0
    cmp r3, r0
    bne 1f
    str r2, [r1, #276]
    ldr r1, [r0]
    cmp r1, #0
    beq 2f
1:
    str r2, [r0]
2:
    bx lr
    END_FUNCTION \name
.endm

.macro NULLABLE_VTABLE_TAIL name
    BEGIN_FUNCTION \name
    cmp r0, #0
    beq 1f
    ldr r1, [r0]
    ldr r1, [r1, #4]
    bx r1
1:
    bx lr
    END_FUNCTION \name
.endm

TWO_WORD_ZERO func_001135B8
TWO_WORD_ZERO func_0017B42C
TWO_WORD_ZERO func_002B4A88
TWO_WORD_ZERO func_0032F8DC
TWO_WORD_ZERO func_0040ABC0
TWO_WORD_ZERO func_0040AF6C
TWO_WORD_ZERO func_00410D14

TYPED_SENTINEL func_00115044, arm_duplicate_templates_20_type_00115044
TYPED_SENTINEL func_001150C8, arm_duplicate_templates_20_type_001150C8

BIASED_HALFWORD_ADDRESS func_0011FA90
BIASED_HALFWORD_ADDRESS func_0012FDD8

FOUR_WORD_BYTE_SWAP func_0023C4BC
FOUR_WORD_BYTE_SWAP func_0023C4F0

OPTIONAL_BACKLINK_DETACH func_0032B314
OPTIONAL_BACKLINK_DETACH func_0032DD00

NULLABLE_VTABLE_TAIL func_001F5C0C
NULLABLE_VTABLE_TAIL func_003B72A4
NULLABLE_VTABLE_TAIL func_003B73B8
NULLABLE_VTABLE_TAIL func_0049990C

.section .note.GNU-stack, "", %progbits
