.syntax unified
.arm
.fpu vfpv2

.extern func_00174DD0
.extern func_0018C888
.extern func_00302F52
.extern func_0016DFE8
.extern service_request_sequence_94
.extern service_callback_registry_guard_94
.extern service_callback_registry_sentinel_94
.extern service_callback_registry_anchor_94
.extern service_geometry_defaults_94
.extern service_packed_coordinate_bias_94

.section .text.func_00181890, "ax", %progbits
.balign 4
.global func_00181890
.type func_00181890, %function
/* BEGIN func_00181890 */
func_00181890:
    ldrb r12, [r0, #80]
    cmp r12, #0
    cmpne r1, #0
    moveq r0, #0
    bxeq lr
    push {r4-r6, lr}
    mov r12, #0
    str r1, [r0, #96]
    ldr r4, .Lrequest_sequence_94
    strb r2, [r0, #120]
    str r3, [r0, #124]
    mov r5, #1
    strb r12, [r0, #86]
    strb r5, [r0, #12]
    ldrh r2, [r4]
    add r3, r0, #7168
    add r6, r0, #128
    add r5, r2, #1
    strh r2, [r3, #148]
    strh r5, [r4]
    str r0, [r1, #16]
    str r6, [r1, #24]
    ldrb r2, [r0, #232]
    mov r4, r1
    strb r2, [r1, #28]
    ldr r2, [r0, #252]
    str r2, [r1, #32]
    ldrb r2, [r0, #233]
    strb r2, [r1, #36]
    ldr r2, [r0, #236]
    str r2, [r1, #40]
    ldr r2, [r0, #240]
    str r2, [r1, #44]
    ldrh r2, [r3, #148]
    strh r2, [r1, #56]
    ldr r2, [r0, #244]
    str r2, [r1, #48]
    ldrb r2, [r0, #248]
    strb r2, [r1, #52]
    ldrb r2, [r0, #249]
    strb r2, [r1, #53]
    ldrb r2, [r0, #250]
    strb r2, [r1, #54]
    ldr r0, [r1, #20]
    str r0, [r1]
    str r12, [r4, #88]
    str r4, [r4, #132]
    str r4, [r4, #128]
    bl func_00174DD0
    mov r2, #1
    add r1, r4, #104
    bl func_0018C888
    mov r0, #1
.Lreturn_181890:
    pop {r4-r6, pc}
.size func_00181890, .-func_00181890
/* END func_00181890 */
.Lrequest_sequence_94:
    .word service_request_sequence_94

.section .text.func_00181FD4, "ax", %progbits
.balign 4
.global func_00181FD4
.type func_00181FD4, %function
/* BEGIN func_00181FD4 */
func_00181FD4:
    push {r4-r10, lr}
    mov r7, r1
    add r8, r1, r2
    ldr r10, .Lregistry_guard_94
    ldr r6, .Lregistry_sentinel_94
    mov r9, #0
    ldr r0, [r10]
    tst r0, #1
    bne .Lregistry_first_ready_94
    mov r0, r10
    blx func_00302F52
    cmp r0, #0
    beq .Lregistry_first_ready_94
    sub r0, r6, #4
    str r6, [r0, #4]
    str r6, [r0, #8]
    str r9, [r0]
    mov r0, r10
    nop
.Lregistry_first_ready_94:
    ldr r0, .Lregistry_anchor_94
    ldr r4, [r0, #4]
    ldr r0, [r10]
    tst r0, #1
    bne .Lregistry_walk_test_94
    ldr r0, .Lregistry_guard_94
    blx func_00302F52
    cmp r0, #0
    nop
    beq .Lregistry_walk_test_94
    ldr r0, .Lregistry_anchor_94
    str r6, [r0, #4]
    str r6, [r0, #8]
    str r9, [r0]
    ldr r0, .Lregistry_guard_94
    nop
.Lregistry_walk_test_94:
    ldr r0, .Lregistry_sentinel_94
    cmp r4, r0
    beq .Lreturn_181fd4
.Lregistry_invoke_94:
    sub r1, r4, #4
    mov r0, r4
    ldmia r1, {r1, r4}
    sub r0, r0, #4
    mov r2, r8
    ldr r3, [r1, #8]
    mov r1, r7
    blx r3
    ldr r0, [r10]
    mov r5, r4
    tst r0, #1
    bne .Lregistry_next_test_94
    ldr r0, .Lregistry_guard_94
    blx func_00302F52
    cmp r0, #0
    nop
    beq .Lregistry_next_test_94
    ldr r0, .Lregistry_anchor_94
    str r6, [r0, #4]
    str r6, [r0, #8]
    str r9, [r0]
    ldr r0, .Lregistry_guard_94
    nop
.Lregistry_next_test_94:
    ldr r0, .Lregistry_sentinel_94
    cmp r5, r0
    bne .Lregistry_invoke_94
.Lreturn_181fd4:
    pop {r4-r10, pc}
.size func_00181FD4, .-func_00181FD4
/* END func_00181FD4 */
.Lregistry_guard_94:
    .word service_callback_registry_guard_94
.Lregistry_sentinel_94:
    .word service_callback_registry_sentinel_94
.Lregistry_anchor_94:
    .word service_callback_registry_anchor_94

.section .text.func_001821A0, "ax", %progbits
.balign 4
.global func_001821A0
.type func_001821A0, %function
/* BEGIN func_001821A0 */
func_001821A0:
    push {r4-r7, lr}
    sub sp, sp, #20
    ldr r2, [r0]
    ldr r12, .Lgeometry_defaults_94
    ldr r3, .Lcoordinate_bias_94
    add r2, r2, #3328
    ldrb r4, [r2, #72]
    cmp r4, #0
    beq .Lgeometry_defaults_path_94
    ldrh r4, [r1]
    ldrh r5, [r2, #64]
    ldrh r6, [r2, #66]
    ldrh r7, [r2, #68]
    vldr s2, [r12, #600]
    ldrh r1, [r1, #2]
    add r12, r12, #588
    ldrh r2, [r2, #70]
    sub r4, r4, r5
    vldmia r12, {s0-s1}
    sub r1, r1, r6
    sub r4, r4, r7
    vstr s2, [sp, #12]
    sub r1, r1, r2
    uxth r2, r4
    vstmia sp, {s0-s1}
    ldr r0, [r0]
    orr r12, r2, r1, lsl #16
    str r12, [sp, #8]
    sub r2, r2, #1
    add r0, r0, #3328
    ldrh r12, [r0, #70]
    ldrh r0, [r0, #68]
    add r1, r1, r12
    add r0, r0, r2
    add r1, r3, r1, lsl #16
    orr r0, r0, r1
    str r0, [sp, #12]
    mov r2, #1
    mov r1, #16
    mov r0, sp
    bl func_0016DFE8
    add sp, sp, #20
.Lreturn_1821a0_active:
    pop {r4-r7, pc}
.Lgeometry_defaults_path_94:
    add r12, r12, #604
    ldmia r12, {r0, r2, r4, r12}
    stmia sp, {r0, r2, r4, r12}
    mov r2, #1
    ldrh r0, [r1]
    ldrh r1, [r1, #2]
    sub r0, r0, #1
    add r1, r3, r1, lsl #16
    orr r0, r0, r1
    str r0, [sp, #12]
    mov r1, #16
    mov r0, sp
    bl func_0016DFE8
    add sp, sp, #20
.Lreturn_1821a0_default:
    pop {r4-r7, pc}
.size func_001821A0, .-func_001821A0
/* END func_001821A0 */
.Lgeometry_defaults_94:
    .word service_geometry_defaults_94
.Lcoordinate_bias_94:
    .word service_packed_coordinate_bias_94

.section .note.GNU-stack, "", %progbits
