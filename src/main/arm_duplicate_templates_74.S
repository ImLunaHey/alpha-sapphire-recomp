.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT74_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT74_END name
.size \name, .-\name
.endm

.macro DT74_REGISTER_PAIR name
DT74_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    mov r5, r0
    mov r8, r1
    bl func_0012B95C
    mov r4, r0
    mov r2, #1
    adr r1, .Ldt74_register_first\@
    bl func_0036F398
    mov r6, r0
    mov r2, #1
    adr r1, .Ldt74_register_second\@
    mov r0, r4
    bl func_0036F398
    mov r7, r0
    mov r2, #0
    mov r1, r6
    mov r0, r4
    bl func_0036F4D0
    mov r2, #0
    mov r1, r7
    mov r0, r4
    bl func_0036F4D0
    ldr r1, [r5, #4]
    mov r0, #232
    bl func_00123480
    cmp r0, #0
    moveq r4, #0
    beq .Ldt74_register_attached\@
    bl func_0019C0A8
    mov r4, r0
.Ldt74_register_attached\@:
    mov r1, r4
    mov r0, r5
    str r5, [r4, #28]
    bl func_003AB384
    mov r1, r8
    mov r0, r4
    bl func_0019C0B0
    ldr r0, [r4, #20]
    mov r8, #2
    cmp r0, #0
    ldr r0, [r5, #4]
    bne .Ldt74_register_first_ready\@
    mov r1, #8
    bl arm_duplicate_templates_74_allocator_secondary
    add r1, r4, #20
    stm r1, {r0, r8}
.Ldt74_register_first_ready\@:
    ldr r0, [r4, #24]
    cmp r0, #0
    bhi .Ldt74_register_first_stored\@
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
.Ldt74_register_first_stored\@:
    ldr r0, [r4, #20]
    str r6, [r0]
    ldr r0, [r4, #24]
    cmp r0, #1
    bhi .Ldt74_register_second_stored\@
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
.Ldt74_register_second_stored\@:
    ldr r0, [r4, #20]
    str r7, [r0, #4]
    pop {r4, r5, r6, r7, r8, pc}
DT74_END \name
.set .Ldt74_register_first\@, \name + 260
.set .Ldt74_register_second\@, \name + 280
.endm

.macro DT74_GATED_PARSE name, finalizer, gate
DT74_BEGIN \name
    ldr r1, .Ldt74_gate\@
    ldrb r1, [r1]
    cmp r1, #0
    bxeq lr
    push {r4, r5, lr}
    sub sp, sp, #68
    mov r4, r0
    mov r1, r0
    mov r2, #128
    add r0, sp, #32
    bl func_001651F0
    add r1, sp, #32
    add r0, sp, #12
    bl func_001604D8
    subs r1, r0, #0
    mov r5, #0
    blt .Ldt74_parse_done\@
    ldr r0, [sp, #12]
    ldr r2, [r0, #20]
    cmp r2, #0
    beq .Ldt74_parse_done\@
    ldr r2, [r0, #16]
    add r2, r2, r0
    ldm r2, {r3, r12}
    add r2, r3, r0
    cmp r12, r1
    ble .Ldt74_parse_done\@
    ldr r1, [r2, r1, lsl #3]
    ldr r2, [r1, r0]!
    ldr r1, [r1, #4]
    adds r0, r0, r2
    beq .Ldt74_parse_done\@
    add r2, sp, #16
    add r1, r1, #1
    stm r2, {r0, r1, r4}
    mov r1, #0
    ldr r3, [r4, #204]
    cmp r3, #0
    ldrgt r12, [r4, #200]
    ble .Ldt74_parse_finalize\@
.Ldt74_parse_scan\@:
    add r0, r1, r1, lsl #1
    add r0, r12, r0, lsl #2
    ldrb r2, [r0, #8]
    cmp r2, #2
    beq .Ldt74_parse_found\@
    add r1, r1, #1
    cmp r3, r1
    bgt .Ldt74_parse_scan\@
.Ldt74_parse_finalize\@:
    mov r1, #16
    add r0, sp, #16
    str r5, [sp, #28]
    bl \finalizer
.Ldt74_parse_done\@:
    add sp, sp, #68
    pop {r4, r5, pc}
.Ldt74_parse_found\@:
    ldr r5, [r0]
    b .Ldt74_parse_finalize\@
DT74_END \name
.Ldt74_gate\@:
    .word \gate
.endm

.macro DT74_DISPATCH_OBJECT name, prepare, dispatch
DT74_BEGIN \name
    push {r4, r5, r6, r7, r8, r9, r10, lr}
    mov r6, r1
    mov r5, r0
    mov r1, #0
    mov r0, r6
    bl \prepare
    mov r4, r0
    ldr r0, [r6]
    mov r2, #4
    mov r1, #380
    ldr r3, [r0, #8]
    mov r0, r6
    blx r3
    cmp r0, #0
    mov r9, #0
    beq .Ldt74_dispatch_ready\@
    mov r7, r4
    mov r1, r6
    mov r8, r1
    mov r4, r9
    mov r3, r5
    mov r2, r7
    bl func_002F7B18
    ldr r1, .Ldt74_dispatch\@
    str r9, [r0, #328]
    str r1, [r0]
    str r7, [r0, #372]
    str r8, [r0, #376]
    str r9, [r0, #368]
.Ldt74_dispatch_ready\@:
    mov r5, r0
    ldr r0, [r0]
    mov r1, r6
    ldr r2, [r0, #36]
    mov r0, r5
    blx r2
    cmp r4, #0
    beq .Ldt74_dispatch_done\@
    ldr r1, [r4, #12]
    add r0, r4, #12
    cmp r1, #0
    addsne r1, r1, r0
    movne r0, r6
    beq .Ldt74_dispatch_release\@
    ldr r2, [r0]
    ldr r2, [r2, #12]
    blx r2
.Ldt74_dispatch_release\@:
    ldr r0, [r6]
    mov r1, r4
    ldr r2, [r0, #12]
    mov r0, r6
    blx r2
.Ldt74_dispatch_done\@:
    mov r0, r5
    pop {r4, r5, r6, r7, r8, r9, r10, pc}
DT74_END \name
.Ldt74_dispatch\@:
    .word \dispatch
.endm

.macro DT74_BUILD_SHARED name, initializer, descriptor
DT74_BEGIN \name
    push {r4, r5, r6, r7, r8, r9, r10, lr}
    mov r4, r0
    add r0, sp, #32
    mov r9, r1
    ldm r0, {r6, r8}
    mov r0, #0
    ldr r1, .Ldt74_shared_descriptor\@
    mov r5, r3
    str r0, [r4, #8]
    stm r4, {r1, r5}
    mov r10, r2
    strb r6, [r4, #12]
    str r0, [r4, #16]
    str r0, [r4, #20]
    str r0, [r4, #24]
    str r0, [r4, #28]
    ldr r0, [r3]
    mov r7, #120
    ldr r1, [r0, #28]
    mov r0, r5
    blx r1
    mov r2, r0
    mov r3, #1
    mov r1, r7
    mov r0, r5
    bl func_0012B9A0
    cmp r0, #0
    beq .Ldt74_shared_store\@
    mov r3, r8
    mov r2, r9
    mov r1, r5
    bl \initializer
.Ldt74_shared_store\@:
    str r0, [r4, #8]
    mov r3, r6
    mov r2, r5
    mov r1, r10
    mov r0, r4
    bl func_0012B64C
    mov r0, r4
    pop {r4, r5, r6, r7, r8, r9, r10, pc}
DT74_END \name
.Ldt74_shared_descriptor\@:
    .word \descriptor
.endm

.macro DT74_COPY_VECTOR name
DT74_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r1
    mov r1, #0
    str r1, [r0]
    str r1, [r0, #4]
    str r1, [r0, #8]
    mov r4, r0
    ldr r0, [r5, #4]
    ldr r1, [r5]
    mov r6, #32
    sub r0, r0, r1
    asr r0, r0, #2
    cmp r0, #32
    movcs r6, r0
    lsl r0, r6, #2
    bl func_00184990
    str r0, [r4]
    ldm r5, {r1, r2}
    cmp r1, r2
    beq .Ldt74_copy_complete\@
.Ldt74_copy_loop\@:
    cmp r0, #0
    ldrne r12, [r1]
    add r1, r1, #4
    strne r12, [r0]
    cmp r1, r2
    add r0, r0, #4
    bne .Ldt74_copy_loop\@
.Ldt74_copy_complete\@:
    ldr r0, [r5, #4]
    ldr r2, [r5]
    ldr r1, [r4]
    sub r0, r0, r2
    bic r0, r0, #3
    add r2, r1, r6, lsl #2
    add r0, r0, r1
    add r1, r4, #4
    stm r1, {r0, r2}
    mov r0, r4
    pop {r4, r5, r6, pc}
DT74_END \name
.endm

.macro DT74_RETRY name, operation, retry_base, accepted
DT74_BEGIN \name
    push {r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, lr}
    sub sp, sp, #4
    mov r4, #0
    mov r9, r0
    mov r10, r1
    ldr r6, .Ldt74_retry_base\@
    ldr r5, [sp, #56]
    ldr r7, .Ldt74_accepted\@
    mov r11, r2
    add r8, r6, #1020
.Ldt74_retry_loop\@:
    ldr r3, [sp, #16]
    mov r2, r11
    mov r1, r10
    mov r0, r9
    str r5, [sp]
    bl \operation
    ands r1, r0, #-2147483648
    mov r2, r0
    bpl .Ldt74_retry_nonnegative\@
    cmp r0, r7
    beq .Ldt74_retry_return\@
    and r1, r0, #261120
    cmp r1, #11264
    beq .Ldt74_retry_next\@
    cmp r0, r8
    beq .Ldt74_retry_base_result\@
    lsrs r0, r2, #31
    blne func_00146000
.Ldt74_retry_next\@:
    add r4, r4, #1
    cmp r4, #2
    blt .Ldt74_retry_loop\@
    b .Ldt74_retry_base_result\@
.Ldt74_retry_nonnegative\@:
    cmp r4, #2
    movlt r0, #0
    blt .Ldt74_retry_return\@
.Ldt74_retry_base_result\@:
    mov r0, r6
.Ldt74_retry_return\@:
    add sp, sp, #20
    pop {r4, r5, r6, r7, r8, r9, r10, r11, pc}
DT74_END \name
.Ldt74_retry_base\@:
    .word \retry_base
.Ldt74_accepted\@:
    .word \accepted
.endm

.macro DT74_COLLECT_STATE name, alternate
DT74_BEGIN \name
    push {r3, r4, r5, r6, r7, r8, r9, lr}
    mov r4, r0
    ldr r0, [r0, #12]
    bl func_0016BC74
    cmp r0, #0
    ldr r0, [r4, #12]
    beq .Ldt74_collect\@
    pop {r3, r4, r5, r6, r7, r8, r9, lr}
    b \alternate
.Ldt74_collect\@:
    nop
    bl func_001532E0
    mov r8, r0
    mov r0, r4
    bl arm_duplicate_templates_74_format_secondary
    mov r5, r0
    ldr r0, [r4, #12]
    bl func_0016BC44
    mov r6, r0
    ldr r0, [r4, #12]
    bl func_0016BC18
    mov r7, r0
    ldr r0, [r4, #12]
    bl func_001532A8
    mov r1, r0
    mov r0, r8
    bl func_0014EB30
    mov r0, #0
    nop
    bl func_0014EB08
    uxth r1, r7
    uxth r2, r0
    str r1, [sp]
    uxth r3, r6
    and r1, r5, #255
    mov r0, r8
    bl func_0016914C
    pop {r3, r4, r5, r6, r7, r8, r9, pc}
DT74_END \name
.endm

.macro DT74_LOOKUP_MEMBER name, lookup
DT74_BEGIN \name
    push {r3, r4, r5, r6, r7, lr}
    cmp r2, #2
    mov r4, r0
    mov r6, r1
    mov r5, r2
    bcc .Ldt74_member_index_ok\@
    mov r2, #0
    mov r1, r2
    mov r0, r2
    mov r0, r0
.Ldt74_member_index_ok\@:
    add r0, r4, r5, lsl #2
    add r0, r0, #32768
    add r0, r0, #5312
    ldr r1, [r0]
    mov r0, sp
    str r1, [r0]
    ldrb r0, [r4]
    cmp r0, #0
    beq .Ldt74_member_lookup\@
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
    mov r0, sp
    nop
    mov r0, r0
    mov r0, #0
    pop {r3, r4, r5, r6, r7, pc}
.Ldt74_member_lookup\@:
    mov r1, r6
    mov r0, sp
    bl \lookup
    mov r4, r0
    mov r0, sp
    mov r0, r0
    mov r0, r4
    pop {r3, r4, r5, r6, r7, pc}
DT74_END \name
.endm

.macro DT74_ROUTE_PAIR name
DT74_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    mov r5, r2
    mov r7, r3
    ldr r4, [r0, #4]!
    ldr r12, [r0, #24]!
    ldr r8, [r0, #12]
    ldr r6, [r12, r1, lsl #3]
    ldr r0, [r4]
    cmp r0, #0
    bne .Ldt74_route_ready\@
    mov r2, #0
    mov r1, r2
    mov r0, r2
    mov r0, r0
.Ldt74_route_ready\@:
    ldr r4, [r4]
    mov r1, r7
    mov r0, r8
    mov r2, r4
    bl func_00139448
    mov r0, r6
    mov r1, r5
    bl func_004C8ADC
    cmp r0, #0
    nop
    beq .Ldt74_route_fallback\@
    mov r1, r4
    pop {r4, r5, r6, r7, r8, lr}
    mvn r2, #0
    b func_00419288
.Ldt74_route_fallback\@:
    pop {r4, r5, r6, r7, r8, lr}
    mov r2, #0
    mov r1, r2
    mov r0, r2
    b arm_duplicate_templates_74_fallback_secondary
DT74_END \name
.endm

.macro DT74_APPLY_EFFECT name, apply, table
DT74_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    mov r5, r1
    mov r7, r3
    mov r3, r2
    mov r2, r1
    ldr r6, [sp, #24]
    mov r4, r0
    add r1, r0, #16
    bl func_001EA49C
    movs r3, r6
    bne .Ldt74_effect_apply\@
    cmp r5, #5
    blt .Ldt74_effect_table\@
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
.Ldt74_effect_table\@:
    ldr r1, .Ldt74_effect_table_slot\@
    add r0, r5, r5, lsl #1
    add r0, r1, r0, lsl #2
    ldr r3, [r0, #8]
.Ldt74_effect_apply\@:
    ldr r0, [r4]
    mov r2, r7
    add r1, r4, #16
    bl \apply
    strb r0, [r4, #14]
    nop
    bl arm_duplicate_templates_74_notification_secondary
    cmp r0, #0
    ldrne r0, [r4]
    ldrne r0, [r0, #1128]
    ldrb r0, [r4, #14]
    pop {r4, r5, r6, r7, r8, pc}
DT74_END \name
.Ldt74_effect_table_slot\@:
    .word \table
.endm

.macro DT74_INTRUSIVE_LITERAL name, vtable
DT74_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    mov r6, r0
    add r4, r6, #4
    ldr r0, .Ldt74_intrusive_vtable\@
    mov r7, #1
    str r0, [r6]
    mov r0, #0
    str r0, [r6, #4]
    str r0, [r6, #8]
    str r0, [r6, #12]
    str r0, [r6, #16]
    str r0, [r6, #20]
    str r0, [r6, #24]
    mov r0, #12
    bl func_00184990
    mov r5, r0
    mov r0, #12
    bl func_00184990
    str r0, [r5, #8]
    ldr r0, [r4]
    stm r5, {r0, r7}
    str r5, [r4]
    ldr r0, [r5, #8]
    add r1, r0, #12
    strd r0, [r4, #8]
    add r1, r0, #12
    str r0, [r4, #16]
    str r1, [r4, #8]
    str r0, [r0]
    ldr r0, [r4, #16]
    str r0, [r0, #4]
    mov r0, r6
    pop {r4, r5, r6, r7, r8, pc}
DT74_END \name
.Ldt74_intrusive_vtable\@:
    .word \vtable
.endm

.macro DT74_INTRUSIVE_PLAIN name
DT74_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r0, #0
    str r0, [r4]
    str r0, [r4, #4]
    str r0, [r4, #8]
    str r0, [r4, #12]
    str r0, [r4, #16]
    str r0, [r4, #20]
    mov r6, #1
    mov r0, #12
    bl func_00184990
    mov r5, r0
    mov r0, #12
    bl func_00184990
    str r0, [r5, #8]
    ldr r0, [r4]
    add r1, r4, #8
    stm r5, {r0, r6}
    str r5, [r4]
    ldr r0, [r5, #8]
    add r2, r0, #12
    stm r1, {r0, r2}
    ldr r0, [r4, #8]
    add r2, r0, #12
    str r0, [r4, #16]
    str r2, [r4, #8]
    str r0, [r0]
    ldr r0, [r4, #16]
    str r0, [r0, #4]
    mov r0, r4
    pop {r4, r5, r6, pc}
DT74_END \name
.endm

DT74_REGISTER_PAIR func_00367E7C
DT74_REGISTER_PAIR func_0036A6DC
DT74_GATED_PARSE func_00145EDC, func_0015EB64, arm_duplicate_templates_74_event_gate_identity
DT74_GATED_PARSE func_001FC9CC, func_00201270, arm_duplicate_templates_74_event_gate_identity
DT74_DISPATCH_OBJECT func_002EB92C, func_002EBAEC, func_002EC008_dispatch_identity
DT74_DISPATCH_OBJECT func_002F9494, func_002F9754, func_002F9B78_dispatch_identity
DT74_BUILD_SHARED func_0011E970, func_00128D08, arm_duplicate_templates_74_shared_descriptor_identity
DT74_BUILD_SHARED func_0011EA14, func_0011C94C, arm_duplicate_templates_74_shared_descriptor_identity
DT74_COPY_VECTOR func_002AD354
DT74_COPY_VECTOR func_002AD444
DT74_RETRY func_002DE2EC, func_002DEBBC, arm_duplicate_templates_71_retry_base_status_identity, service_query_accepted_status_31
DT74_RETRY func_002DE3F0, func_002DECC8, arm_duplicate_templates_71_retry_base_status_identity, service_query_accepted_status_31
DT74_COLLECT_STATE func_0015336C, func_00153254
DT74_COLLECT_STATE func_004D2D8C, func_00153174
DT74_LOOKUP_MEMBER func_003D9884, func_0012FB40
DT74_LOOKUP_MEMBER func_003D9BB8, func_0012FB08
DT74_ROUTE_PAIR func_00362910
DT74_ROUTE_PAIR func_00362998
DT74_APPLY_EFFECT func_001EA930, func_0036D6C8, arm_duplicate_templates_74_effect_table_identity
DT74_APPLY_EFFECT func_001EA9B8, func_0036D81C, arm_duplicate_templates_74_effect_table_identity
DT74_INTRUSIVE_LITERAL func_0020B2EC, arm_duplicate_templates_74_intrusive_vtable_a_identity
DT74_INTRUSIVE_LITERAL func_002702F4, arm_duplicate_templates_74_intrusive_vtable_b_identity
DT74_INTRUSIVE_PLAIN func_002A1C1C
DT74_INTRUSIVE_PLAIN func_002A1C9C
