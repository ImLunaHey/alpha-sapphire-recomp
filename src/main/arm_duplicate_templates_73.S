.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT73_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT73_END name
.size \name, .-\name
.endm

.macro DT73_VECTOR name, constructor, descriptor
DT73_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    mov r5, r0
    mov r7, r1
    ldr r1, .Ldt73_vector_descriptor\@
    mov r0, #0
    str r0, [r5, #4]
    str r1, [r5]
    str r0, [r5, #12]
    mov r6, r2
    lsl r0, r2, #2
    mov r1, r7
    str r2, [r5, #8]
    bl func_0012344C
    cmp r6, #0
    mov r4, #0
    str r0, [r5, #4]
    bls .Ldt73_vector_done\@
.Ldt73_vector_loop\@:
    mov r1, r7
    mov r0, #12
    bl func_00123480
    cmp r0, #0
    movne r1, r7
    blne \constructor
    ldr r1, [r5, #4]
    str r0, [r1, r4, lsl #2]
    add r4, r4, #1
    cmp r4, r6
    bcc .Ldt73_vector_loop\@
.Ldt73_vector_done\@:
    mov r0, r5
    pop {r4, r5, r6, r7, r8, pc}
DT73_END \name
.Ldt73_vector_descriptor\@:
    .word \descriptor
.endm

.macro DT73_LAZY name, slot
DT73_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r0
    ldr r6, .Ldt73_lazy_slot\@
    mov r4, r1
    ldr r0, [r6]
    cmp r0, #0
    bne .Ldt73_lazy_done\@
    mov r1, r5
    mov r0, #120
    bl func_00123480
    cmp r0, #0
    beq .Ldt73_lazy_store\@
    mov r3, #1
    mov r2, r4
    mov r1, r5
    bl func_00128D08
.Ldt73_lazy_store\@:
    mov r1, r5
    str r0, [r6]
    pop {r4, r5, r6, lr}
    b func_001289EC
.Ldt73_lazy_done\@:
    pop {r4, r5, r6, pc}
DT73_END \name
.Ldt73_lazy_slot\@:
    .word \slot
.endm

.macro DT73_GUARDED name, dispatcher
DT73_BEGIN \name
    mov ip, r1
    ldr r1, .Ldt73_guard\@
    push {r4, lr}
    mov r4, r2
    sub sp, sp, #8
    ldrb r2, [r1]
    cmp r2, #0
    ldreq r0, .Ldt73_inactive\@
    beq .Ldt73_guarded_done\@
    ldr r1, [r1, #4]
    str r3, [sp]
    mov r3, r4
    str r1, [sp, #4]
    mov r1, r0
    mov r2, ip
    add r0, sp, #4
    bl \dispatcher
    lsrs r1, r0, #31
    moveq r0, #0
.Ldt73_guarded_done\@:
    add sp, sp, #8
    pop {r4, pc}
DT73_END \name
.Ldt73_guard\@:
    .word service_guard_state_41
.Ldt73_inactive\@:
    .word arm_duplicate_templates_73_inactive_result_identity
.endm

.macro DT73_REGISTER_LITERAL name, constructor, extent, extent_offset
DT73_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r5, r1
    adr r0, .Ldt73_post_body\@
    mov r1, #0
    bl func_0036F28C
    mov r6, r0
    ldr r1, [r4, #4]
    ldr r0, .Ldt73_extent\@
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
.Ldt73_post_body\@:
DT73_END \name
    .space \extent_offset - 76
.Ldt73_extent\@:
    .word \extent
.endm

.macro DT73_REGISTER_FIXED name, constructor
DT73_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r5, r1
    adr r0, .Ldt73_post_body\@
    mov r1, #0
    bl func_0036F28C
    mov r6, r0
    ldr r1, [r4, #4]
    mov r0, #68
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
.Ldt73_post_body\@:
DT73_END \name
.endm

.macro DT73_SELECT name, primary, fallback
DT73_BEGIN \name
    push {r4, lr}
    cmp r1, #0
    beq .Ldt73_select_fallback\@
    ldrb r0, [r1]
    cmp r0, #0
    beq .Ldt73_select_fallback\@
    ldr r0, .Ldt73_primary\@
    add r0, pc, r0
    bl func_00302334
    cmp r0, #0
    beq .Ldt73_select_fallback\@
    movs r0, #0
    pop {r4, pc}
.Ldt73_select_fallback\@:
    ldr r0, .Ldt73_fallback\@
    add r0, pc, r0
    pop {r4, pc}
DT73_END \name
.Ldt73_primary\@:
    .word \primary
.Ldt73_fallback\@:
    .word \fallback
.endm

.macro DT73_VISIT name, visitor
DT73_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r0
    mov r4, #0
.Ldt73_visit_loop\@:
    add r0, r5, r4, lsl #2
    add r0, r0, #5120
    add r0, r0, #476
    ldr r0, [r0]
    ldr r0, [r0, #104]
    bl \visitor
    add r4, r4, #1
    cmp r4, #24
    blt .Ldt73_visit_loop\@
    pop {r4, r5, r6, pc}
DT73_END \name
.endm

.macro DT73_FLAG name, selector
DT73_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r1
    mov r5, r0
    bl func_00168EC0
    mov r1, #1
    mov r0, r5
    bl \selector
    strb r4, [r0, #26]
    mov r0, r5
    pop {r4, r5, r6, lr}
    b func_00168E50
DT73_END \name
.endm

DT73_VECTOR func_0011F26C, func_0012BE70, arm_duplicate_templates_73_vector_descriptor_a_identity
DT73_VECTOR func_0011F2E8, func_0012BEAC, arm_duplicate_templates_73_vector_descriptor_b_identity
DT73_VECTOR func_0011F364, func_0012BEEC, arm_duplicate_templates_73_vector_descriptor_c_identity

DT73_LAZY func_0011F0C4, arm_duplicate_templates_19_owned_object_slot_003B0994
DT73_LAZY func_0011F198, arm_duplicate_templates_19_owned_object_slot_003B0B80
DT73_LAZY func_0011F3E0, arm_duplicate_templates_19_owned_object_slot_003B14C0

DT73_GUARDED func_002E2554, func_002E3EA4
DT73_GUARDED func_002E4904, func_002E41E0
DT73_GUARDED func_002E4E00, func_002E42B0

DT73_REGISTER_LITERAL func_00367B64, func_0019C050, arm_duplicate_templates_73_record_extent_a_identity, 92
DT73_REGISTER_LITERAL func_00369B68, func_0019C208, arm_duplicate_templates_73_record_extent_b_identity, 100
DT73_REGISTER_LITERAL func_0036ACA0, func_0019C320, arm_duplicate_templates_73_record_extent_c_identity, 108

DT73_REGISTER_FIXED func_00369C84, func_0019C218
DT73_REGISTER_FIXED func_0036A134, func_0019C258
DT73_REGISTER_FIXED func_0036AB9C, func_0019C308

DT73_SELECT func_0016F3FC, arm_duplicate_templates_73_relative_primary_a_identity, arm_duplicate_templates_73_relative_fallback_a_identity
DT73_SELECT func_00193C20, arm_duplicate_templates_73_relative_primary_b_identity, arm_duplicate_templates_73_relative_fallback_b_identity
DT73_SELECT func_0052AEC4, arm_duplicate_templates_73_relative_primary_c_identity, arm_duplicate_templates_73_relative_fallback_c_identity

DT73_VISIT func_00147838, visit_target_secondary_73_a
DT73_VISIT func_0018E5C0, func_0018713C
DT73_VISIT func_0018E76C, visit_target_secondary_73_c

DT73_FLAG func_003B2BC0, func_0016BC84
DT73_FLAG func_003B3084, func_00176EFC
DT73_FLAG func_003B3658, func_0016BD80
