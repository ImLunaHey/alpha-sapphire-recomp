.syntax unified
.arm

.extern arm_duplicate_templates_19_object_vtable_00170CC0
.extern arm_duplicate_templates_19_object_vtable_002AFCCC
.extern arm_duplicate_templates_19_type_002FC244
.extern arm_duplicate_templates_19_type_00302C5C
.extern arm_duplicate_templates_19_type_00305720
.extern arm_duplicate_templates_19_byte_window_state
.extern arm_duplicate_templates_19_active_entry_base_1
.extern arm_duplicate_templates_19_active_entry_base_2
.extern arm_duplicate_templates_19_active_entry_base_3
.extern arm_duplicate_templates_19_active_entry_base_4
.extern arm_duplicate_templates_19_owned_object_slot_003B0994
.extern arm_duplicate_templates_19_owned_object_slot_003B0B80
.extern arm_duplicate_templates_19_owned_object_slot_003B14C0
.extern arm_duplicate_templates_19_lcg_multiplier

.macro BEGIN_FUNCTION name
    .section .text.\name, "ax", %progbits
    .balign 4
    .global \name
    .type \name, %function
\name:
.endm

.macro END_FUNCTION name
    .size \name, .-\name
.endm

.macro ATOMIC_MEMBER_RELEASE name, identity
    BEGIN_FUNCTION \name
    push {r4, lr}
    mov r4, r0
    ldr r0, 99f
    mvn r2, #0
    str r0, [r4]
    ldr r0, [r4, #8]
    add r3, r0, #4
1:
    ldrex r1, [r3]
    add r1, r1, r2
    strex r12, r1, [r3]
    cmp r12, #0
    bne 1b
    cmp r1, #0
    ldrbeq r1, [r0, #8]
    cmpeq r1, #0
    moveq r1, #1
    strbeq r1, [r0, #8]
    bne 2f
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
2:
    mov r0, #0
    str r0, [r4, #8]
    mov r0, r4
    pop {r4, pc}
    END_FUNCTION \name
99:
    .word \identity
.endm

.macro ALLOCATED_TYPED_PAIR name, identity
    BEGIN_FUNCTION \name
    push {r4, lr}
    ldr r0, [r1]
    mov r4, r1
    mov r2, #4
    mov r1, #8
    ldr r3, [r0, #8]
    mov r0, r4
    blx r3
    cmp r0, #0
    beq 1f
    ldr r1, 99f
    stm r0, {r1, r4}
1:
    pop {r4, pc}
    END_FUNCTION \name
99:
    .word \identity
.endm

.macro BYTE_WINDOW_PREDICATE name, identity
    BEGIN_FUNCTION \name
    ldrb r1, [r0, #14]
    cmp r1, #0
    bne 2f
    ldr r1, 99f
    ldrb r2, [r1, #24]
    cmp r2, #0
    beq 1f
    ldrb r1, [r1, #25]
    ldrb r0, [r0, #15]
    sub r0, r1, r0
    sxtb r0, r0
    cmp r0, #2
    ble 2f
1:
    mov r0, #0
    bx lr
2:
    mov r0, #1
    bx lr
    END_FUNCTION \name
99:
    .word \identity
.endm

.macro ACTIVE_ENTRY_COUNT name, base1, base2, base3, base4
    BEGIN_FUNCTION \name
    ldr r1, 96f
    mov r0, #0
    ldr r1, [r1, #24]
    cmp r1, #0
    ldr r1, 97f
    movne r0, #1
    ldr r1, [r1, #52]
    cmp r1, #0
    ldr r1, 98f
    addne r0, r0, #1
    ldr r1, [r1, #80]
    cmp r1, #0
    ldr r1, 99f
    addne r0, r0, #1
    ldr r1, [r1, #108]
    cmp r1, #0
    addne r0, r0, #1
    bx lr
    END_FUNCTION \name
96:
    .word \base1
97:
    .word \base2
98:
    .word \base3
99:
    .word \base4
.endm

.macro OWNED_OBJECT_RELEASE name, identity
    BEGIN_FUNCTION \name
    push {r4, lr}
    ldr r4, 99f
    ldr r0, [r4]
    cmp r0, #0
    beq 1f
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    mov r0, #0
    str r0, [r4]
1:
    pop {r4, pc}
    END_FUNCTION \name
99:
    .word \identity
.endm

.macro HALFWORD_STREAM_XOR name, multiplier
    BEGIN_FUNCTION \name
    mov r3, #0
    cmp r3, r1, lsr #1
    bxcs lr
    push {r4, r5}
1:
    ldr r12, 99f
    mul r2, r2, r12
    add r12, r0, r3, lsl #1
    add r3, r3, #1
    ldrh r5, [r12]
    add r2, r2, #0x6000
    add r2, r2, #0x73
    cmp r3, r1, lsr #1
    eor r4, r5, r2, lsr #16
    strh r4, [r12]
    bcc 1b
    pop {r4, r5}
    bx lr
    END_FUNCTION \name
99:
    .word \multiplier
.endm

ATOMIC_MEMBER_RELEASE func_00170CC0, arm_duplicate_templates_19_object_vtable_00170CC0
ATOMIC_MEMBER_RELEASE func_002AFCCC, arm_duplicate_templates_19_object_vtable_002AFCCC

ALLOCATED_TYPED_PAIR func_002FC244, arm_duplicate_templates_19_type_002FC244
ALLOCATED_TYPED_PAIR func_00302C5C, arm_duplicate_templates_19_type_00302C5C
ALLOCATED_TYPED_PAIR func_00305720, arm_duplicate_templates_19_type_00305720

BYTE_WINDOW_PREDICATE func_00179D28, arm_duplicate_templates_19_byte_window_state
BYTE_WINDOW_PREDICATE func_00179D70, arm_duplicate_templates_19_byte_window_state

ACTIVE_ENTRY_COUNT func_0042875C, arm_duplicate_templates_19_active_entry_base_1, arm_duplicate_templates_19_active_entry_base_2, arm_duplicate_templates_19_active_entry_base_3, arm_duplicate_templates_19_active_entry_base_4
ACTIVE_ENTRY_COUNT func_0042CAA0, arm_duplicate_templates_19_active_entry_base_1, arm_duplicate_templates_19_active_entry_base_2, arm_duplicate_templates_19_active_entry_base_3, arm_duplicate_templates_19_active_entry_base_4

OWNED_OBJECT_RELEASE func_003B0994, arm_duplicate_templates_19_owned_object_slot_003B0994
OWNED_OBJECT_RELEASE func_003B0B80, arm_duplicate_templates_19_owned_object_slot_003B0B80
OWNED_OBJECT_RELEASE func_003B14C0, arm_duplicate_templates_19_owned_object_slot_003B14C0

HALFWORD_STREAM_XOR func_00168AC8, arm_duplicate_templates_19_lcg_multiplier
HALFWORD_STREAM_XOR func_00175F68, arm_duplicate_templates_19_lcg_multiplier
