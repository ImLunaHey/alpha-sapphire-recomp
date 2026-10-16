.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT70_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT70_END name
.size \name, .-\name
.endm

.macro DT70_COMPOSITE name, dispatch
DT70_BEGIN \name
    push {r3, r4, r5, lr}
    mov r2, sp
    mov r1, #2
    bl func_00179080
    ldr r2, .Ldt70_dispatch_\@
    mov r5, #0
    mov r1, #1
    str r2, [r0]
    str r5, [r0, #104]
    str r5, [r0, #108]
    str r5, [r0, #112]
    strb r1, [r0, #116]
    str r5, [r0, #120]
    mov r1, r5
    add r0, r0, #128
    bl func_001625B4
    sub r0, r0, #128
    add r3, r0, #248
    mov r1, #0
    mov r2, r1
    stm r3, {r1, r2}
    add r0, r0, #256
    ldr r1, .Ldt70_config_\@
    bl func_001862A0
    str r5, [r0, #8]
    sub r4, r0, #256
    str r5, [r0, #12]
    str r5, [r0, #16]!
    mov r1, #352
    str r5, [r0, #4]
    str r5, [r0, #8]
    add r0, r4, #288
    bl func_00301FBC
DT70_END \name
    .org 200
.Ldt70_dispatch_\@:
    .word \dispatch
.Ldt70_config_\@:
    .word arm_duplicate_templates_70_component_config_identity
.endm

.macro DT70_PRESERVE name
DT70_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    sub sp, sp, #8
    ldr r5, [r4]
    mov r0, #0
    ldrh r6, [r5, #20]
    strh r0, [r5, #20]
    ldm r4, {r1, r2}
    mov r0, sp
    bl func_004160B0
    mov r0, sp
    strh r6, [r5, #20]
    ldrh r0, [r0, #6]
    mov r5, r0
    mov r0, sp
    bl func_004161AC
    ldr r1, [r4]
    strh r5, [r1, #20]
    add sp, sp, #8
    pop {r4, r5, r6, pc}
DT70_END \name
.endm

.macro DT70_RELINK_ADV name, advance
DT70_BEGIN \name
    cmp r1, #0
    bxeq lr
    push {r4, r5, r6, lr}
    mov r6, r0
    mov r4, r1
.Ldt70_relink_adv_loop_\@:
    mov r0, r6
    ldr r1, [r4, #12]
    bl \name
    ldr r1, [r6, #4]
    add r0, r4, #16
    mov r5, r4
    ldr r4, [r4, #8]
    add r0, r0, #4
    str r1, [r5, #12]
    bl \advance
    cmp r4, #0
    str r5, [r6, #4]
    bne .Ldt70_relink_adv_loop_\@
    pop {r4, r5, r6, pc}
DT70_END \name
.endm

.macro DT70_RELINK name
DT70_BEGIN \name
    cmp r1, #0
    bxeq lr
    push {r4, r5, r6, lr}
    mov r6, r0
    mov r4, r1
.Ldt70_relink_loop_\@:
    mov r0, r6
    ldr r1, [r4, #12]
    bl \name
    ldr r1, [r6, #4]
    mov r5, r4
    add r0, r4, #16
    ldr r4, [r4, #8]
    str r1, [r5, #12]
    bl func_001862FC
    cmp r4, #0
    str r5, [r6, #4]
    bne .Ldt70_relink_loop_\@
    pop {r4, r5, r6, pc}
DT70_END \name
.endm

.macro DT70_DRIVE name
DT70_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r5, .Ldt70_owner_\@
    mov r2, #0
    mov r3, #1
    mov r1, r2
    ldr r0, [r5, #4]
    bl func_0044C12C
    ldr r0, [r5, #4]
    mov r1, r4
    bl func_0044BD78
    ldr r0, [r5, #4]
    bl func_0044BF10
    ldr r0, [r5, #4]
    pop {r4, r5, r6, lr}
    b shared_owner_tail_secondary_70
DT70_END \name
.Ldt70_owner_\@:
    .word global_load_11
.endm

.macro DT70_ROUND name, field, helper
DT70_BEGIN \name
    push {r4, lr}
    mov r4, r0
    ldr r0, [r0, #\field]
    cmp r0, #0
    add r0, r4, #8
    beq .Ldt70_round_tail_\@
    bl \helper
    mov r1, r0
    ldr r0, [r4, #\field]
    mov r2, #1
    add r1, r1, r2, lsl r0
    sub r1, r1, #1
    mov r0, r1, lsr r0
    pop {r4, pc}
.Ldt70_round_tail_\@:
    pop {r4, lr}
    b \helper
DT70_END \name
.endm

.macro DT70_MAP name, mapper
DT70_BEGIN \name
    ldr r0, [r0, #12]
    mov r0, r0
    push {r4, r5, r6, lr}
    mov r4, r1
    mov r5, r0
    bl func_00168EC0
    mov r1, #0
    mov r0, r5
    bl \mapper
    mov r1, r0
    mov r0, r4
    bl func_003A5C74
    mov r0, r5
    pop {r4, r5, r6, lr}
    b func_00168E50
DT70_END \name
.endm

.macro DT70_REGISTER name, identity
DT70_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, .Ldt70_record_\@
    ldr r5, [sp, #16]
    stm r4, {r0, r1, r2, r3, r5}
    mov r1, #2
    mov r0, r5
    bl func_0014648C
    mov r3, #1
    mov r2, #0
    mov r1, r4
    mov r0, r5
    bl func_00146464
    mov r0, r4
    pop {r4, r5, r6, pc}
DT70_END \name
.Ldt70_record_\@:
    .word \identity
.endm

.macro DT70_COPY name, init, descriptor
DT70_BEGIN \name
    push {r4, lr}
    sub sp, sp, #64
    mov r4, r0
    ldr r1, .Ldt70_descriptor_\@
    mov r0, sp
    bl \init
    mov r2, #64
    mov r1, sp
    mov r0, r4
    bl func_00300B28
    add sp, sp, #64
    pop {r4, pc}
DT70_END \name
.Ldt70_descriptor_\@:
    .word \descriptor
.endm

.macro DT70_REPORT name
DT70_BEGIN \name
    push {r4, lr}
    ldr r0, [r0, #88]
    mov r1, r0, lsl #10
    movs r1, r1, lsr #10
    bne .Ldt70_report_done_\@
    ldr r2, .Ldt70_diag_context_\@
    ldr r0, .Ldt70_diag_message_\@
    mov r3, #0
    mov r1, #216
    bl func_00178974
    mov r0, #0
.Ldt70_report_done_\@:
    pop {r4, pc}
DT70_END \name
.Ldt70_diag_context_\@:
    .word arm_duplicate_templates_70_diagnostic_context_identity
.Ldt70_diag_message_\@:
    .word arm_duplicate_templates_70_diagnostic_message_identity
.endm

.macro DT70_NORMALIZE name, helper
DT70_BEGIN \name
    push {r4, lr}
    ldr r0, [r0, #12]
    bl \helper
    ands r0, r0, #255
    movne r0, #1
    pop {r4, pc}
DT70_END \name
.endm

DT70_COMPOSITE func_0053D290, arm_duplicate_templates_70_composite_dispatch_a_identity
DT70_COMPOSITE func_0053ECFC, arm_duplicate_templates_70_composite_dispatch_b_identity
DT70_PRESERVE func_0040AB70
DT70_PRESERVE func_0040AF1C
DT70_RELINK_ADV func_00557248, func_0056E254
DT70_RELINK_ADV func_00561840, func_0018E370
DT70_RELINK func_00554E4C
DT70_RELINK func_00555BE0
DT70_DRIVE func_0044D518
DT70_DRIVE func_0044FD00
DT70_ROUND func_004E504C, 100, func_004B2644
DT70_ROUND func_004E508C, 100, func_004B2674
DT70_ROUND func_004E6C7C, 104, func_004B2644
DT70_ROUND func_004E6CBC, 104, func_004B2674
DT70_MAP func_004D12A8, func_0016BD80
DT70_MAP func_004D1E10, func_00176EFC
DT70_REGISTER func_0056BC60, arm_duplicate_templates_70_registered_record_a_identity
DT70_REGISTER func_0056BCA0, arm_duplicate_templates_70_registered_record_b_identity
DT70_COPY func_0049E758, func_0012EC80, arm_duplicate_templates_70_stack_descriptor_a_identity
DT70_COPY func_004A57D0, func_0012EF50, arm_duplicate_templates_70_stack_descriptor_b_identity
DT70_REPORT func_004B1108
DT70_REPORT func_004B1224
DT70_NORMALIZE func_004D2C18, func_004D1330
DT70_NORMALIZE func_004D3260, func_004D22DC
