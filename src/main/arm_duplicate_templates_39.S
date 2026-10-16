.syntax unified
.arm

.macro TYPED_RECORD_CREATE_AND_REGISTER name, dispatch, diagnostic
    .section .text.\name, "ax", %progbits
    .align 2
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, lr}
    mov r4, r1
    mov r1, #1
    bl func_00178DFC
    ldr r1, [pc, #168]
    cmp r4, #0
    mov r5, r0
    str r1, [r0]
    beq .Ldt39_\@_00a8
    mov r1, r4
    strh r1, [r0, #32]
    mov r0, #68
    bl func_00184990 - 4
    cmp r0, #0
    moveq r6, #0
    beq .Ldt39_\@_004c
    mov r1, #0
    bl \name
    mov r6, r0
.Ldt39_\@_004c:
    nop
    bl func_00171FC0
    ldr r1, [pc, #104]
    cmp r0, #0
    addeq r0, r1, #4
    beq .Ldt39_\@_00b0
    ldr r1, [r1, #68]
    ldm r1, {r1, r2}
    sub r2, r2, r1
    cmp r0, r2, asr #2
    ldrcc r0, [r1, r0, lsl #2]
    bcc .Ldt39_\@_00b0
    ldr r0, [pc, #68]
    mov r3, #0
    mov r2, #-536870909
    mov r1, #73
    bl func_00178974
    mvn r0, #0
.Ldt39_\@_0094:
    ldr r0, [r0, #12]
.Ldt39_\@_0098:
    mov r2, r6
    mov r1, r4
    ldr r0, [r0, #12]
    bl func_0017933C
.Ldt39_\@_00a8:
    mov r0, r5
    pop {r4, r5, r6, pc}
.Ldt39_\@_00b0:
    ldr r0, [r0, #52]
    cmp r0, #0
    beq .Ldt39_\@_0098
    b .Ldt39_\@_0094
    .size \name, .-\name
    .word \dispatch
    .word arm_duplicate_templates_39_shared_registry_identity
    .word \diagnostic
.endm

TYPED_RECORD_CREATE_AND_REGISTER func_001628A0, func_001628A0_dispatch_identity, func_001628A0_diagnostic_descriptor_identity
TYPED_RECORD_CREATE_AND_REGISTER func_00163AA4, func_00163AA4_dispatch_identity, func_00163AA4_diagnostic_descriptor_identity
TYPED_RECORD_CREATE_AND_REGISTER func_00172534, func_00172534_dispatch_identity, arm_duplicate_templates_39_diagnostic_descriptor_pair_00172534
TYPED_RECORD_CREATE_AND_REGISTER func_00173064, func_00173064_dispatch_identity, arm_duplicate_templates_39_diagnostic_descriptor_pair_00172534
TYPED_RECORD_CREATE_AND_REGISTER func_00270F44, func_00270F44_dispatch_identity, func_00270F44_diagnostic_descriptor_identity
TYPED_RECORD_CREATE_AND_REGISTER func_00278924, func_00278924_dispatch_identity, func_00278924_diagnostic_descriptor_identity
TYPED_RECORD_CREATE_AND_REGISTER func_00287E00, func_00287E00_dispatch_identity, func_00287E00_diagnostic_descriptor_identity
TYPED_RECORD_CREATE_AND_REGISTER func_0028F9E0, func_0028F9E0_dispatch_identity, arm_duplicate_templates_39_diagnostic_descriptor_pair_0028F9E0
TYPED_RECORD_CREATE_AND_REGISTER func_002914EC, func_002914EC_dispatch_identity, arm_duplicate_templates_39_diagnostic_descriptor_pair_002914EC
TYPED_RECORD_CREATE_AND_REGISTER func_002948AC, func_002948AC_dispatch_identity, arm_duplicate_templates_39_diagnostic_descriptor_pair_0028F9E0
TYPED_RECORD_CREATE_AND_REGISTER func_0029DB3C, func_0029DB3C_dispatch_identity, func_0029DB3C_diagnostic_descriptor_identity
TYPED_RECORD_CREATE_AND_REGISTER func_0029FAC4, func_0029FAC4_dispatch_identity, arm_duplicate_templates_39_diagnostic_descriptor_pair_002914EC
