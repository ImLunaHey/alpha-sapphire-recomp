.syntax unified
.arm

.macro duplicate_template_25_function_begin name
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
.endm

.macro duplicate_template_25_function_end name
    .size \name, .-\name
.endm

.macro halfword_merge name
    duplicate_template_25_function_begin \name
    ldrh r10, [r1], #2
    add r2, r2, #16
    rsb r9, r2, #16
    orr r3, r3, r10, lsl r9
    mov pc, lr
    duplicate_template_25_function_end \name
.endm

.macro conditional_mutable_word_clear name, identity
    duplicate_template_25_function_begin \name
    ldr r0, 1f
    ldr r1, [r0]
    cmp r1, #0
    movne r1, #0
    strne r1, [r0]
    bx lr
    duplicate_template_25_function_end \name
1:
    .word \identity
    .global \identity
.endm

.macro descriptor_pair_byte_state_initializer name, identity
    duplicate_template_25_function_begin \name
    ldr r1, 1f
    mov r3, #0
    strb r3, [r0, #8]
    add r2, r1, #32
    stm r0, {r1, r2}
    bx lr
    duplicate_template_25_function_end \name
1:
    .word \identity
    .global \identity
.endm

.macro shared_type_two_word_initializer name, identity
    duplicate_template_25_function_begin \name
    ldr r1, 1f
    str r1, [r0]
    mov r1, #0
    str r1, [r0, #4]
    bx lr
    duplicate_template_25_function_end \name
1:
    .word \identity
    .global \identity
.endm

.macro unsigned_inclusive_bound_predicate name, identity
    duplicate_template_25_function_begin \name
    ldr r1, 1f
    cmp r0, r1
    movls r0, #1
    movhi r0, #0
    bx lr
    duplicate_template_25_function_end \name
1:
    .word \identity
    .global \identity
.endm

.macro packed_selector_stride_pointer name
    duplicate_template_25_function_begin \name
    ldr r1, [r0, #52]
    ldr r0, [r0, #44]
    lsl r0, r0, #30
    add r0, r1, r0, lsr #25
    bx lr
    duplicate_template_25_function_end \name
.endm

.macro indirect_dispatch_tail_transfer name, identity
    duplicate_template_25_function_begin \name
    ldr r1, 1f
    ldr r1, [r1, #4]
    bx r1
    duplicate_template_25_function_end \name
1:
    .word \identity
    .global \identity
.endm

halfword_merge func_001B0468
halfword_merge func_001B6A68
halfword_merge func_001BD068

conditional_mutable_word_clear func_00153B54, duplicate_template_25_mutable_state_a
conditional_mutable_word_clear func_00154014, duplicate_template_25_mutable_state_b

descriptor_pair_byte_state_initializer func_00411040, duplicate_template_25_descriptor_base_a
descriptor_pair_byte_state_initializer func_00411270, duplicate_template_25_descriptor_base_b

shared_type_two_word_initializer func_00240AD8, duplicate_template_25_shared_type
shared_type_two_word_initializer func_0029F57C, duplicate_template_25_shared_type

unsigned_inclusive_bound_predicate func_002C2CD4, duplicate_template_25_unsigned_bound_a
unsigned_inclusive_bound_predicate func_002C2EB8, duplicate_template_25_unsigned_bound_b

packed_selector_stride_pointer func_003279C8
packed_selector_stride_pointer func_004BE69C

indirect_dispatch_tail_transfer func_001D1EB0, duplicate_template_25_dispatch_owner_a
indirect_dispatch_tail_transfer func_001E2C0C, duplicate_template_25_dispatch_owner_b
