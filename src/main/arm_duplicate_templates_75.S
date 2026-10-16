.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT75_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT75_END name
.size \name, .-\name
.endm

.macro DT75_POINTER_VECTOR name, constructor, descriptor
DT75_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    mov r5, r0
    mov r7, r1
    ldr r1, .Ldt75_vector_descriptor\@
    mov r0, #0
    str r0, [r5, #4]
    str r1, [r5]
    strb r0, [r5, #9]
    mov r6, r2
    lsl r0, r2, #2
    mov r1, r7
    strb r2, [r5, #8]
    bl func_0012344C
    cmp r6, #0
    mov r4, #0
    str r0, [r5, #4]
    bls .Ldt75_vector_done\@
.Ldt75_vector_loop\@:
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
    bcc .Ldt75_vector_loop\@
.Ldt75_vector_done\@:
    mov r0, r5
    pop {r4, r5, r6, r7, r8, pc}
DT75_END \name
.Ldt75_vector_descriptor\@:
    .word \descriptor
.endm

.macro DT75_GROW_ARENA name
DT75_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r0
    ldr r0, [r0]
    cmp r1, #0
    mov r4, #1
    bne .Ldt75_grow_ready\@
    cmp r0, #0
    moveq r4, #32
    beq .Ldt75_grow_ready\@
    ldr r0, [r0, #4]
    add r1, r0, r0, lsr #1
    add r4, r1, r0, lsr #3
    add r0, r0, #32
    cmp r0, r4
    movhi r4, r0
.Ldt75_grow_ready\@:
    mov r0, #12
    bl func_00184990
    mov r6, r0
    rsb r0, r4, r4, lsl #3
    lsl r0, r0, #4
    bl func_00184990
    str r0, [r6, #8]
    ldr r0, [r5]
    rsb r1, r4, r4, lsl #3
    stm r6, {r0, r4}
    str r6, [r5]
    ldr r0, [r6, #8]
    add r1, r0, r1, lsl #4
    strd r0, [r5, #8]
    pop {r4, r5, r6, pc}
DT75_END \name
.endm

.macro DT75_REGISTER_SIX name, writer
DT75_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r5, .Ldt75_six_registry\@
    mov r0, #0
    mov r2, #1
    mov r1, r4
    str r0, [r5]
    bl \writer
    mov r2, #1
    add r1, r4, #1
    mov r0, r2
    bl \writer
    mov r2, #4
    add r1, r4, #4
    mov r0, #2
    bl \writer
    mov r2, #4
    add r1, r4, #8
    mov r0, #3
    bl \writer
    mov r2, #4
    add r1, r4, #12
    mov r0, r2
    bl \writer
    mov r2, #1
    add r1, r4, #2
    mov r0, #5
    bl \writer
    ldr r0, [r5]
    pop {r4, r5, r6, pc}
DT75_END \name
.Ldt75_six_registry\@:
    .word arm_duplicate_templates_75_field_registry_identity
.endm

.macro DT75_VISIT_MATCH name, visitor
DT75_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    mov r5, r0
    mov r6, r1
    ldr r0, [r0, #8]
    mov r7, r2
    mov r4, #0
    cmp r0, #0
    bls .Ldt75_visit_miss\@
.Ldt75_visit_loop\@:
    ldr r0, [r5, #4]
    ldr r0, [r0, r4, lsl #2]
    ldrh r0, [r0, #4]
    cmp r0, r6
    nop
    bne .Ldt75_visit_next\@
    ldr r0, [r5, #4]
    mov r6, #1
    mov r1, r7
    ldr r0, [r0, r4, lsl #2]
    bl \visitor
    nop
    nop
    b .Ldt75_visit_done\@
.Ldt75_visit_next\@:
    ldr r0, [r5, #8]
    add r4, r4, #1
    cmp r0, r4
    bhi .Ldt75_visit_loop\@
.Ldt75_visit_miss\@:
    mov r6, #0
.Ldt75_visit_done\@:
    mov r0, r6
    pop {r4, r5, r6, r7, r8, pc}
DT75_END \name
.endm

.macro DT75_REPLACE_DISPATCH name, dispatch_identity
DT75_BEGIN \name
    cmp r1, #0
    bxne lr
    push {r3, r4, r5, lr}
    mov r4, r0
    mov r1, #1
    bl func_002A47F8
    mov r0, #1
    strb r0, [sp]
    mov r1, sp
    add r0, r4, #16
    bl func_0056DCE4
    ldr r4, [r0, #20]
    mov r0, #4
    bl arm_duplicate_templates_75_allocator_preentry
    cmp r0, #0
    moveq r5, #0
    beq .Ldt75_replace_allocated\@
    ldr r1, .Ldt75_replace_dispatch\@
    mov r5, r0
    str r1, [r0]
.Ldt75_replace_allocated\@:
    ldr r0, [r4, #28]
    cmp r0, #0
    beq .Ldt75_replace_store\@
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
.Ldt75_replace_store\@:
    str r5, [r4, #28]
    pop {r3, r4, r5, pc}
DT75_END \name
.Ldt75_replace_dispatch\@:
    .word \dispatch_identity
.endm

.macro DT75_CLEAR_READY name
DT75_BEGIN \name
    push {r4, lr}
    mov r4, r0
    bl func_00171448
    cmp r0, #0
    beq .Ldt75_clear_done\@
    add r1, r4, #16
    mov r0, r4
    mov r0, #1
    cmp r0, #0
    beq .Ldt75_clear_done\@
    mov r0, #0
    strb r0, [r4, #13]
    mov r0, #1
.Ldt75_clear_done\@:
    pop {r4, pc}
DT75_END \name
.endm

.macro DT75_REGISTER_FIVE name, writer
DT75_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r5, .Ldt75_five_registry\@
    mov r0, #0
    mov r2, #1
    mov r1, r4
    str r0, [r5]
    mov r0, #24
    bl \writer
    mov r2, #1
    add r1, r4, #1
    mov r0, #25
    bl \writer
    mov r2, #1
    add r1, r4, #2
    mov r0, #26
    bl \writer
    mov r2, #4
    add r1, r4, #4
    mov r0, #27
    bl \writer
    mov r2, #4
    add r1, r4, #8
    mov r0, #28
    bl \writer
    ldr r0, [r5]
    pop {r4, r5, r6, pc}
DT75_END \name
.Ldt75_five_registry\@:
    .word arm_duplicate_templates_75_field_registry_identity
.endm

.macro DT75_LINKED_NODE name, node_identity
DT75_BEGIN \name
.Ldt75_node_start\@:
    push {r4, r5, r6, lr}
    mov r4, r1
    mov r1, #1
    bl func_00178DFC
    ldr r1, .Ldt75_node_vtable\@
    cmp r4, #0
    mov r5, r0
    str r1, [r0]
    beq .Ldt75_node_done\@
    mov r0, #68
    strh r4, [r5, #32]
    bl arm_duplicate_templates_75_allocator_preentry
    cmp r0, #0
    moveq r6, #0
    beq .Ldt75_node_child_ready\@
    mov r1, #0
    bl .Ldt75_node_start\@
    mov r6, r0
.Ldt75_node_child_ready\@:
    nop
    bl func_00178A6C
    ldr r0, [r0, #12]
    mov r2, r6
    mov r1, r4
    bl func_0017933C
.Ldt75_node_done\@:
    mov r0, r5
    pop {r4, r5, r6, pc}
DT75_END \name
.Ldt75_node_vtable\@:
    .word \node_identity
.endm

.macro DT75_FORMAT_PAIR name, formatter
DT75_BEGIN \name
    cmp r1, #0
    cmpne r2, #0
    ldreq r0, .Ldt75_format_empty\@
    bxeq lr
    push {r4, r5, r6, r7, lr}
    mov r4, r0
    sub sp, sp, #12
    ldr r0, [r0, #4]
    mov r6, r1
    mov r5, r2
    cmp r0, #0
    ldrle r0, .Ldt75_format_nonpositive\@
    ble .Ldt75_format_done\@
    mov r0, r2
    bl func_002FF034
    add r7, r0, #1
    mov r0, r6
    bl func_002FF034
    add r3, r0, #1
    stm sp, {r5, r7}
    ldr r1, [r4, #4]
    mov r2, r6
    add r0, r4, #12
    bl \formatter
.Ldt75_format_done\@:
    add sp, sp, #12
    pop {r4, r5, r6, r7, pc}
DT75_END \name
.Ldt75_format_empty\@:
    .word arm_duplicate_templates_75_format_empty_result_identity
.Ldt75_format_nonpositive\@:
    .word service_nonpositive_result_42
.endm

.macro DT75_RENDER name, resource_identity, table_identity, output_identity
DT75_BEGIN \name
    push {r4, r5, r6, lr}
    cmp r2, #0
    ldr r6, .Ldt75_render_context\@
    mov r4, r0
    mov r5, r1
    beq .Ldt75_render_prepared\@
    ldr r0, [r6, #72]
    mov r1, #1
    bl func_0017C0E4
.Ldt75_render_prepared\@:
    ldr r0, .Ldt75_render_resource\@
    mov r2, #1
    mov r1, #16
    bl func_0016DFE8
    ldr r0, .Ldt75_render_table\@
    mov r2, #1
    mov r1, #48
    bl func_0016DFE8
    ldr r0, [r6, #72]
    mov r2, r5
    mov r1, r4
    bl func_0017C360
    pop {r4, r5, r6, lr}
    mov r2, #1
    ldr r0, .Ldt75_render_output\@
    mov r1, #48
    b func_0016DFE8
DT75_END \name
.Ldt75_render_context\@:
    .word ipc_render_context_54
.Ldt75_render_resource\@:
    .word \resource_identity
.Ldt75_render_table\@:
    .word \table_identity
.Ldt75_render_output\@:
    .word \output_identity
.endm

.macro DT75_SERVICE_EXCHANGE name, exchange
DT75_BEGIN \name
    push {r3, r4, r5, lr}
    ldr r4, .Ldt75_service_guard\@
    mov r0, r4
    bl func_001602B8
    ldr r0, .Ldt75_service_state\@
    ldrb r1, [r0, #1]
    cmp r1, #0
    ldreq r5, .Ldt75_service_inactive\@
    beq .Ldt75_service_done\@
    ldr r0, [r0, #12]
    str r0, [sp]
    mov r0, sp
    bl \exchange
    ldr r1, .Ldt75_service_sentinel\@
    mov r5, r0
    cmp r0, r1
    bne .Ldt75_service_done\@
    mov r1, pc
    lsrs r2, r5, #31
    blne func_00124FB0
.Ldt75_service_done\@:
    mov r0, r4
    bl func_00160380
    mov r0, r5
    pop {r3, r4, r5, pc}
DT75_END \name
.Ldt75_service_guard\@:
    .word arm_duplicate_templates_75_service_guard_identity
.Ldt75_service_state\@:
    .word service_state_block_31
.Ldt75_service_inactive\@:
    .word arm_duplicate_templates_75_service_inactive_result_identity
.Ldt75_service_sentinel\@:
    .word arm_duplicate_templates_75_service_sentinel_identity
.endm

DT75_POINTER_VECTOR func_0011F1F0, func_0012BE2C, arm_duplicate_templates_75_vector_descriptor_a_identity
DT75_POINTER_VECTOR func_0011F698, func_0012C310, arm_duplicate_templates_75_vector_descriptor_b_identity
DT75_GROW_ARENA func_0018D65C
DT75_GROW_ARENA func_0056EA28
DT75_REGISTER_SIX func_002C9948, func_002CA48C
DT75_REGISTER_SIX func_002C9C70, func_002CA3D4
DT75_VISIT_MATCH func_00176E58, func_0017D140
DT75_VISIT_MATCH func_004D06AC, func_004D04F8
DT75_REPLACE_DISPATCH func_00250C50, arm_duplicate_templates_75_dispatch_vtable_a_identity
DT75_REPLACE_DISPATCH func_00250F0C, arm_duplicate_templates_75_dispatch_vtable_b_identity
DT75_CLEAR_READY func_00146530
DT75_CLEAR_READY func_001623E8
DT75_CLEAR_READY func_002132EC
DT75_CLEAR_READY func_00224D80
DT75_REGISTER_FIVE func_002C9C00, func_002CA3D4
DT75_REGISTER_FIVE func_002C9F50, func_002CA48C
DT75_LINKED_NODE func_002960E0, arm_duplicate_templates_75_node_vtable_a_identity
DT75_LINKED_NODE func_0029A14C, arm_duplicate_templates_75_node_vtable_b_identity
DT75_FORMAT_PAIR func_002CC620, func_002CCA90
DT75_FORMAT_PAIR func_002CC708, func_002CCC14
DT75_RENDER func_003A338C, arm_duplicate_templates_75_render_resource_a_identity, arm_duplicate_templates_75_render_table_a_identity, arm_duplicate_templates_75_render_output_a_identity
DT75_RENDER func_003A3500, arm_duplicate_templates_75_render_resource_b_identity, arm_duplicate_templates_75_render_table_b_identity, arm_duplicate_templates_75_render_output_b_identity
DT75_SERVICE_EXCHANGE func_002C3FD0, func_002C5640
DT75_SERVICE_EXCHANGE func_002C42C8, func_002C5744
