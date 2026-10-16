.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT80_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT80_END name
.size \name,.-\name
.endm

.macro DT80_RECORD_STREAM_WRITER name
DT80_BEGIN \name
    push {r4, r5, r6, lr}
    mov r6, r1
    mov r4, r0
    mov r1, #32
    bl func_00217604
    ldrb r0, [r4, #528]
    add r5, r4, #512
    cmp r0, #0
    addeq r2, pc, #88
    beq .Ldt80_emit\@
    ldrb r0, [r5, #17]
    cmp r0, #0
    beq .Ldt80_select\@
    ldr r1, [pc, #76]
    ldr r0, [r4, #12]
    blx func_00102DEC
    ldr r0, [r4, #12]
    add r1, r0, #4
    str r1, [r4, #12]
.Ldt80_select\@:
    ldrb r0, [r5, #19]
    cmp r0, #0
    addne r2, pc, #48
    addeq r2, pc, #56
.Ldt80_emit\@:
    ldr r0, [r4, #12]
    mov r3, r6
    mov r1, #32
    blx func_00102868
    ldr r1, [r4, #12]
    add r0, r1, r0, lsl #1
    str r0, [r4, #12]
    mov r0, r4
    pop {r4, r5, r6, pc}
DT80_END \name
.endm

.macro DT80_LITERAL_CONTEXT_TAIL name, identity, destination
DT80_BEGIN \name
    ldr r0, [pc, #0]
    b \destination
DT80_END \name
    .word \identity
.endm

.macro DT80_LOAD_MEMBER_TAIL name, destination
DT80_BEGIN \name
    ldr r0, [r0, #12]
    b \destination
DT80_END \name
.endm

.macro DT80_LITERAL_ARGUMENT_TAIL name, identity
DT80_BEGIN \name
    mov r2, r1
    ldr r1, [pc, #0]
    b arm_duplicate_templates_80_secondary_001CF3AC
DT80_END \name
    .word \identity
.endm

.macro DT80_CALL_AND_RETURN name, destination
DT80_BEGIN \name
    push {r4, lr}
    bl \destination
    pop {r4, pc}
DT80_END \name
.endm

.macro DT80_OFFSET_16_TAIL name, destination
DT80_BEGIN \name
    add r0, r0, #16
    b \destination
DT80_END \name
.endm

.macro DT80_OFFSET_8_TAIL name, destination
DT80_BEGIN \name
    add r0, r0, #8
    b \destination
DT80_END \name
.endm

.macro DT80_FIXED_MODE_TAIL name
DT80_BEGIN \name
    mov r1, #3
    b func_0013335C
DT80_END \name
.endm

DT80_RECORD_STREAM_WRITER func_00217434
DT80_RECORD_STREAM_WRITER func_002174D4

DT80_LITERAL_CONTEXT_TAIL func_0010CA9C, arm_duplicate_templates_80_context_a_identity, func_00178238
DT80_LITERAL_CONTEXT_TAIL func_001261F0, arm_duplicate_templates_80_context_shared_identity, func_00132A14
DT80_LITERAL_CONTEXT_TAIL func_00126484, arm_duplicate_templates_80_context_shared_identity, func_001600B0
DT80_LITERAL_CONTEXT_TAIL func_00126490, arm_duplicate_templates_80_context_shared_identity, func_00124150
DT80_LITERAL_CONTEXT_TAIL func_00257034, arm_duplicate_templates_80_context_b_identity, func_00266AE8

DT80_LOAD_MEMBER_TAIL func_0032EC68, func_0032A71C
DT80_LOAD_MEMBER_TAIL func_003B54C8, arm_duplicate_templates_80_secondary_003B39F0
DT80_LOAD_MEMBER_TAIL func_003B54D0, func_0014F814
DT80_LOAD_MEMBER_TAIL func_004CEF50, func_00152EC4
DT80_LOAD_MEMBER_TAIL func_004D2994, func_003B3144

DT80_LITERAL_ARGUMENT_TAIL func_0051BE28, arm_duplicate_templates_80_argument_a_identity
DT80_LITERAL_ARGUMENT_TAIL func_0051BE38, arm_duplicate_templates_80_argument_b_identity

DT80_CALL_AND_RETURN func_00163C30, func_001788C8
DT80_CALL_AND_RETURN func_002BB64C, func_002C42C8
DT80_CALL_AND_RETURN func_002BBD60, func_002C3FD0

DT80_OFFSET_16_TAIL func_0021A9B0, func_0017F4A4
DT80_OFFSET_16_TAIL func_003B7EFC, func_001602B8
DT80_OFFSET_16_TAIL func_003B7FE8, func_00160380

DT80_OFFSET_8_TAIL func_00253BF4, func_00241090
DT80_OFFSET_8_TAIL func_004E6C6C, func_004B2644
DT80_OFFSET_8_TAIL func_004E6C74, func_004B2674

DT80_FIXED_MODE_TAIL func_0029F35C
DT80_FIXED_MODE_TAIL func_0029F540

.section .note.GNU-stack,"",%progbits
