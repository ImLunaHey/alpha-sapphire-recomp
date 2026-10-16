.syntax unified
.arm

.section .text.func_002D03B4,"ax",%progbits
.balign 4
.global func_002D03B4
.type func_002D03B4, %function
func_002D03B4:
    push {r4-r9}
    cmp r3, #0
    ldrhne r12, [r1, #8]
    beq .Lfunc_002D03B4_success
.Lfunc_002D03B4_scan:
    ldrh r4, [r2, #2]
    cmp r4, r12
    bne .Lfunc_002D03B4_next_descriptor
    ldrb r3, [r1, #10]
    ldrb r12, [r2, #1]
    cmp r12, r3
    bne .Lfunc_002D03B4_fail
    ldrb r12, [r2]
    add r12, r12, r12, lsl #1
    add r5, r0, r12, lsl #2
    ldrb r12, [r5, #11]
    cmp r12, #0
    beq .Lfunc_002D03B4_matched_slot_free
.Lfunc_002D03B4_fail:
    pop {r4-r9}
    mov r0, #0
    bx lr
.Lfunc_002D03B4_matched_slot_free:
    ldr r4, [r1]
    cmp r4, #0
    beq .Lfunc_002D03B4_success
    cmp r3, #2
    beq .Lfunc_002D03B4_kind_two
    cmp r3, #5
    cmpne r3, #10
    bne .Lfunc_002D03B4_install
    b .Lfunc_002D03B4_scan_payload
.Lfunc_002D03B4_kind_two:
    ldr r3, [r1, #4]
    add r3, r3, r4
    ldrb r3, [r3, #-1]
    cmp r3, #0
    bne .Lfunc_002D03B4_success
    b .Lfunc_002D03B4_install
.Lfunc_002D03B4_scan_payload:
    cmp r4, #0
    ldrhi r12, [r1, #4]
    mov r3, #0
    bls .Lfunc_002D03B4_install
.Lfunc_002D03B4_payload_loop:
    add r6, r3, #4
    add r7, r3, #5
    add r8, r3, #6
    add r9, r3, #7
    ldrb r6, [r12, r6]
    ldrb r7, [r12, r7]
    ldrb r8, [r12, r8]
    ldrb r9, [r12, r9]
    orr r6, r6, r7
    orr r7, r8, r9
    orrs r6, r6, r7
    beq .Lfunc_002D03B4_success
    add r3, r3, #8
    cmp r4, r3
    bhi .Lfunc_002D03B4_payload_loop
.Lfunc_002D03B4_install:
    ldr r3, [r1, #4]
    ldr r1, [r1, #8]
    mov r12, #1
    str r1, [r5, #8]
    str r3, [r5, #4]
    str r4, [r5]
    ldrb r1, [r2]
    add r1, r1, r1, lsl #1
    add r0, r0, r1, lsl #2
    strb r12, [r0, #11]
    b .Lfunc_002D03B4_success
.Lfunc_002D03B4_next_descriptor:
    subs r3, r3, #1
    add r2, r2, #4
    bne .Lfunc_002D03B4_scan
.Lfunc_002D03B4_success:
    pop {r4-r9}
    mov r0, #1
    bx lr
.size func_002D03B4, .-func_002D03B4

.section .text.func_002DFED0,"ax",%progbits
.balign 4
.global func_002DFED0
.type func_002DFED0, %function
.global runtime_record_prepare_29
.type runtime_record_prepare_29, %function
func_002DFED0:
    push {r4-r6, lr}
    mov r4, r1
    mov r5, r0
    bl runtime_record_prepare_29
    ldr r0, [r5, #80]
    rev r0, r0
    str r0, [r4]
    ldr r0, [r5, #84]
    rev r0, r0
    str r0, [r4, #4]
    ldr r0, [r5, #88]
    rev r0, r0
    str r0, [r4, #8]
    ldr r0, [r5, #92]
    rev r0, r0
    str r0, [r4, #12]
    ldr r0, [r5, #96]
    rev r0, r0
    str r0, [r4, #16]
    pop {r4-r6, pc}
.size func_002DFED0, .-func_002DFED0

.section .note.GNU-stack,"",%progbits
