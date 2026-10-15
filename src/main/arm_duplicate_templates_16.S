.syntax unified
.arm
.fpu vfp

.macro PACKED_DUAL_TRANSFORM name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    push {r4, r5, r6, r7, r8, r9, r10, r11, lr}
    cmp r3, #0
    sub sp, sp, #16
    mov r8, #0
    ble .Ldone_\@
.Louter_\@:
    ldr r5, .Lcoefficient_table_\@
    add r12, r0, r8, lsl #4
    add r4, r12, #120
    ldr r6, [r12], #4
    ldr r7, [r5]
    ldr r10, [r5]
    ldr lr, [r5]
    smulbb r11, r6, r7
    smultb r9, r6, r7
    ldr r6, [r4], #-4
    smulbb r7, r6, r7
    smultb r6, r6, r10
    ldr r10, [r12], #4
    smlabt r11, r10, lr, r11
    smlatt r9, r10, lr, r9
    ldr r10, [r4], #-4
    smlabt r7, r10, lr, r7
    str r7, [sp]
    ldr lr, [r5]
    ldr r7, [r12], #4
    vldr s0, [r4]
    smlatt lr, r10, lr, r6
    ldr r6, [r5, #4]
    smlabb r10, r7, r6, r11
    smlatb r11, r7, r6, r9
    vmov r9, s0
    ldr r7, [sp]
    smlabb r9, r9, r6, r7
    str r9, [sp]
    ldr r7, [r12], #4
    vmov r9, s0
    smlabt r10, r7, r6, r10
    smlatt r11, r7, r6, r11
    ldr r7, [r4, #-4]
    smlatb lr, r9, r6, lr
    ldr r9, [sp]
    smlatt lr, r7, r6, lr
    smlabt r9, r7, r6, r9
    ldr r6, [r5, #8]!
    ldr r7, [r12], #4
    smlabb r10, r7, r6, r10
    smlatb r7, r7, r6, r11
    str r7, [sp]
    ldr r7, [r4, #-8]
    smlabb r9, r7, r6, r9
    smlatb r7, r7, r6, lr
    str r7, [sp, #4]
    ldr lr, [r12], #4
    ldr r7, [sp]
    vldr s1, [r12]
    smlabt r11, lr, r6, r10
    smlatt r10, lr, r6, r7
    ldr r7, [r4, #-12]!
    smlabt lr, r7, r6, r9
    mov r9, r7
    ldr r7, [sp, #4]
    smlatt r6, r9, r6, r7
    vmov r7, s1
    vmov s0, r6
    ldr r6, [r5, #4]
    smlabb r7, r7, r6, r11
    str r7, [sp]
    vmov r7, s1
    smlatb r11, r7, r6, r10
    ldr r10, [r4, #-4]
    ldr r7, [sp]
    smlabb r9, r10, r6, lr
    vmov lr, s0
    str r9, [sp, #4]
    smlatb r9, r10, r6, lr
    str r9, [sp, #8]
    ldr r10, [r12, #4]
    ldr r9, [sp, #4]
    smlabt lr, r10, r6, r7
    smlatt r11, r10, r6, r11
    ldr r7, [r4, #-8]!
    smlabt r10, r7, r6, r9
    ldr r9, [sp, #8]
    smlatt r6, r7, r6, r9
    str r6, [sp, #12]
    ldr r9, [r12, #8]!
    ldr r6, [r5, #8]
    add r7, r12, #4
    str r6, [sp]
    smlabb lr, r9, r6, lr
    smlatb r6, r9, r6, r11
    str r6, [sp, #8]
    ldr r6, [sp]
    ldr r9, [r4, #-4]!
    sub r4, r4, #4
    smlabb r12, r9, r6, r10
    str r12, [sp, #4]
    ldr r12, [sp, #12]
    vldr s0, [r4]
    smlatb r11, r9, r6, r12
    ldr r12, [r7], #4
    ldr r9, [sp, #8]
    smlabt r10, r12, r6, lr
    smlatt lr, r12, r6, r9
    vmov r9, s0
    ldr r12, [sp, #4]
    smlabt r9, r9, r6, r12
    vmov r12, s0
    smlatt r11, r12, r6, r11
    ldr r12, [r5, #12]!
    ldr r6, [r7], #4
    smlatb lr, r6, r12, lr
    smlabb r10, r6, r12, r10
    str lr, [sp]
    ldr r6, [r4, #-4]
    smlatb lr, r6, r12, r11
    smlabb r9, r6, r12, r9
    str lr, [sp, #4]
    ldr r6, [r7], #4
    ldr lr, [sp]
    smlabt r10, r6, r12, r10
    smlatt r11, r6, r12, lr
    ldr r6, [r4, #-8]!
    ldr lr, [sp, #4]
    smlabt r9, r6, r12, r9
    smlatt r12, r6, r12, lr
    ldr lr, [r7]
    vmov s0, r12
    ldr r12, [r5, #4]
    str r12, [sp]
    smlabb r12, lr, r12, r10
    str r12, [sp, #4]
    ldr r12, [sp]
    smlatb r10, lr, r12, r11
    ldr lr, [r4, #-4]
    smlabb r11, lr, r12, r9
    vmov r9, s0
    smlatb r6, lr, r12, r9
    str r6, [sp, #8]
    ldr r9, [r7, #4]
    ldr r6, [sp, #4]
    ldr r5, [r5, #8]
    smlabt lr, r9, r12, r6
    smlatt r10, r9, r12, r10
    ldr r9, [r4, #-8]
    ldr r6, [sp, #8]
    ldr r4, [r4, #-12]
    smlabt r11, r9, r12, r11
    smlatt r6, r9, r12, r6
    ldr r12, [r7, #8]
    ldr r7, [r7, #12]
    smlatb r6, r4, r5, r6
    smlabb r9, r12, r5, lr
    smlatb r10, r12, r5, r10
    smlabb r12, r4, r5, r11
    smlabt r4, r7, r5, r9
    smlatt r5, r7, r5, r10
    add r9, r1, r8, lsl #1
    add r12, r12, r4
    add r7, r2, r8, lsl #1
    asr r12, r12, #15
    strh r12, [r9]
    add r12, r5, r6
    add r8, r8, #1
    asr r12, r12, #15
    cmp r3, r8
    strh r12, [r7]
    bgt .Louter_\@
.Ldone_\@:
    add sp, sp, #16
    pop {r4, r5, r6, r7, r8, r9, r10, r11, pc}
.Lbody_end_\@:
.size \name, .Lbody_end_\@ - \name
.Lcoefficient_table_\@:
    .word \name\()_coefficient_table
.endm

.macro ALLOCATED_OBJECT_INITIALIZER name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0]
    mov r5, r1
    mov r2, #4
    mov r1, #32
    ldr r3, [r0, #8]
    mov r0, r4
    blx r3
    cmp r0, #0
    beq .Lreturn_\@
    mov r1, #0
    str r4, [r0, #4]
    strb r1, [r0, #8]
    vldr s0, .Linitial_float_\@
    strb r1, [r0, #9]
    vstr s0, [r0, #12]
    ldr r1, .Ltype_identity_\@
    vstr s0, [r0, #16]
    vstr s0, [r0, #20]
    vstr s0, [r0, #24]
    str r1, [r0]
    str r5, [r0, #28]
.Lreturn_\@:
    pop {r4, r5, r6, pc}
.Lbody_end_\@:
.size \name, .Lbody_end_\@ - \name
.Linitial_float_\@:
    .word arm_duplicate_templates_16_initial_float
.Ltype_identity_\@:
    .word \name\()_type_identity
.endm

.macro TYPE_CHAIN_ATTACHMENT name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r0, #0
    cmp r1, #0
    str r0, [r4]
    ldrne r5, [r1]
    cmpne r5, #0
    ldrne r6, .Ltype_identity_\@
    beq .Lreturn_\@
.Linitial_type_\@:
    ldr r0, [r5]
    ldr r1, [r0]
    mov r0, r5
    blx r1
.Lcompare_\@:
    cmp r0, r6
    bne .Lnext_type_\@
    movs r0, r5
    beq .Lreturn_\@
    str r0, [r4]
    ldr r1, [r0]
    ldr r1, [r1, #24]
    blx r1
    cmp r0, #0
    beq .Lbackref_\@
    ldr r0, [r4]
    ldr r1, [r0]
    ldr r1, [r1, #28]
    blx r1
.Lbackref_\@:
    ldr r1, [r4]
    str r4, [r1, #276]
.Lreturn_\@:
    mov r0, r4
    pop {r4, r5, r6, pc}
.Lnext_type_\@:
    ldr r0, [r0]
    cmp r0, #0
    bne .Lcompare_\@
    b .Lreturn_\@
.Lbody_end_\@:
.size \name, .Lbody_end_\@ - \name
.Ltype_identity_\@:
    .word \name\()_type_identity
.endm

.macro PRIMARY_SECONDARY_LOOKUP name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    ldr r3, .Lempty_identity_\@
    push {r4, r5}
    cmp r1, r3
    beq .Lnull_\@
    ldr r12, .Lprimary_table_\@
    ldrh r12, [r12, r0]
    cmp r12, r1
    bne .Lscan_setup_\@
    cmp r2, #0
    movne r1, #1
    strne r1, [r2]
    pop {r4, r5}
    add r0, r0, #812
    bx lr
.Lscan_setup_\@:
    mov r12, #0
    add r0, r0, #1600
    mov r5, r12
.Lscan_\@:
    ldrh r4, [r0, #2]
    cmp r4, r3
    beq .Lnext_\@
    cmp r4, r1
    bne .Lnext_\@
    cmp r0, #0
    beq .Lnull_\@
    cmp r2, #0
    strne r5, [r2]
    pop {r4, r5}
    bx lr
.Lnext_\@:
    add r12, r12, #1
    cmp r12, #30
    add r0, r0, #992
    bcc .Lscan_\@
.Lnull_\@:
    pop {r4, r5}
    mov r0, #0
    bx lr
.Lbody_end_\@:
.size \name, .Lbody_end_\@ - \name
.Lempty_identity_\@:
    .word arm_duplicate_templates_16_empty_identity
.Lprimary_table_\@:
    .word arm_duplicate_templates_16_primary_table
.endm

.macro REPEATED_RECORD_INITIALIZER name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    cmp r1, #0
    push {r4, r5, r6}
    mov r5, #0
    movgt r0, #0
    ble .Lreturn_\@
.Lrecord_\@:
    mov r3, #43
    smulbb r12, r5, r3
    mov r3, #0
    add r4, r2, r12, lsl #2
    str r0, [r2, r12, lsl #2]
    str r0, [r4, #8]
    str r0, [r4, #12]
    str r0, [r4, #28]
    str r0, [r4, #16]
    str r0, [r4, #32]
    str r0, [r4, #20]
    str r0, [r4, #36]
    str r0, [r4, #24]
    str r0, [r4, #40]
    str r0, [r4, #4]
.Linner_\@:
    add r12, r4, r3, lsl #2
    add r6, r3, #1
    str r0, [r12, #44]
    str r0, [r12, #76]
    sxth r3, r6
    str r0, [r12, #108]
    cmp r3, #8
    str r0, [r12, #140]
    blt .Linner_\@
    add r3, r5, #1
    sxth r5, r3
    cmp r5, r1
    blt .Lrecord_\@
.Lreturn_\@:
    pop {r4, r5, r6}
    bx lr
.Lbody_end_\@:
.size \name, .Lbody_end_\@ - \name
.endm

PACKED_DUAL_TRANSFORM func_001A3B28
PACKED_DUAL_TRANSFORM func_001A42D4

ALLOCATED_OBJECT_INITIALIZER func_00305DFC
ALLOCATED_OBJECT_INITIALIZER func_003094A4
ALLOCATED_OBJECT_INITIALIZER func_0030A698

TYPE_CHAIN_ATTACHMENT func_0032B348
TYPE_CHAIN_ATTACHMENT func_0032DD34

PRIMARY_SECONDARY_LOOKUP func_0045A71C
PRIMARY_SECONDARY_LOOKUP func_004E7FF4

REPEATED_RECORD_INITIALIZER func_004934B8
REPEATED_RECORD_INITIALIZER func_00496F40

.section .note.GNU-stack, "", %progbits
