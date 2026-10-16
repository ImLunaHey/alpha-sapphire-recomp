.syntax unified
.arch armv6k
.arm

.macro begin_function name
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
.endm

.macro end_function name
    .size \name, .-\name
.endm

.macro embedded_invalid_zero_pair_initializer name
    begin_function \name
    add r0, r0, #8
    mvn r1, #0
    mov r2, #0
    stm r0, {r1, r2}
    bx lr
    end_function \name
.endm

.macro four_word_zero_initializer name
    begin_function \name
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    str r1, [r0, #8]
    str r1, [r0, #12]
    bx lr
    end_function \name
.endm

.macro cursor_word_read_optional_advance name
    begin_function \name
    cmp r2, #0
    ldr r2, [r0, #12]
    ldr r2, [r2]
    str r2, [r1]
    beq .Lreturn_\name
    ldr r1, [r0, #12]
    add r1, r1, #4
    str r1, [r0, #12]
.Lreturn_\name:
    bx lr
    end_function \name
.endm

.macro indexed_packed_nibble_lookup name
    begin_function \name
    rsb r2, r1, r1, lsl #5
    ldr r0, [r0, #108]
    add r2, r2, r2, lsl #1
    mov r1, #240
    add r1, r1, r2, lsl #2
    ldr r0, [r0, r1]
    lsl r0, r0, #8
    lsr r0, r0, #28
    bx lr
    end_function \name
.endm

.macro enabled_empty_circular_list_initializer name
    begin_function \name
    mov r2, #0
    mov r1, #1
    str r2, [r0]
    strb r1, [r0, #4]
    add r1, r0, #8
    str r1, [r0, #8]
    str r2, [r0, #16]
    str r1, [r0, #12]
    bx lr
    end_function \name
.endm

.macro member_presence_identity_selector name, helper, presence
    begin_function \name
    push {r4, lr}
    ldr r0, [r0, #4]
    mov r4, #0
    bl \helper
    cmp r0, #0
    ldrne r4, .Lpresence_\name
    mov r0, r4
    pop {r4, pc}
    end_function \name
.Lpresence_\name:
    .word \presence
.endm

embedded_invalid_zero_pair_initializer func_00375800
embedded_invalid_zero_pair_initializer func_0037A0C8
embedded_invalid_zero_pair_initializer func_00381CA8
embedded_invalid_zero_pair_initializer func_00382930

four_word_zero_initializer func_00174A74
four_word_zero_initializer func_0023C524
four_word_zero_initializer func_003345F4

cursor_word_read_optional_advance func_003C4BA4
cursor_word_read_optional_advance func_003C4BC8

indexed_packed_nibble_lookup func_004CDC18
indexed_packed_nibble_lookup func_004CDC3C

enabled_empty_circular_list_initializer func_0053FAEC
enabled_empty_circular_list_initializer func_0053FCB8

member_presence_identity_selector func_001D0F88, func_001C5008, duplicate_template_22_presence_identity
member_presence_identity_selector func_001D1018, func_001C5098, duplicate_template_22_presence_identity

.global func_001C5008
.global func_001C5098
.global duplicate_template_22_presence_identity
