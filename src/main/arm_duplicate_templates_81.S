.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro FUNCTION_BEGIN name
    .section .text.\name, "ax", %progbits
    .align 2
    .global \name
    .type \name, %function
\name:
.endm

.macro FUNCTION_END name
    .size \name, . - \name
.endm

.macro GROW_SEQUENCE name, resize
    FUNCTION_BEGIN \name
    push {r4, lr}
    ldr r1, [r0, #4]
    ldr r2, [r0]
    mov r4, r0
    mov r3, #1
    cmp r1, r2
    sub r1, r1, r2
    lslhi r0, r1, #29
    add ip, r3, r1, asr #2
    lsrhi r0, r0, #31
    movls r0, #0
    add r0, r0, #1
    cmp ip, r0
    addgt r1, r3, r1, asr #2
    ble 2f
1:  add r0, r0, #2
    cmp r1, r0
    bgt 1b
2:  mov r0, r2
    bl \resize
    mov r0, r4
    pop {r4, pc}
    FUNCTION_END \name
.endm

.macro RESET_RECORD name, fallback, first_type
    FUNCTION_BEGIN \name
    push {r4, lr}
    mov r4, r0
    ldr r0, 3f
    str r0, [r4]
    ldr r0, [r4, #12]
    cmp r0, #0
    beq 2f
    ldr r1, [r0, #-8]!
    cmp r1, #0
    beq 1f
    blx r1
    b 2f
1:  nop
    bl \fallback
2:  ldr r0, 4f
    str r0, [r4]
    mov r0, #0
    str r0, [r4, #4]
    mov r0, r4
    pop {r4, pc}
    FUNCTION_END \name
3:  .word \first_type
4:  .word duplicate_template_25_shared_type
.endm

.macro GUARDED_ACTIVE name, tail
    FUNCTION_BEGIN \name
    ldrb r1, [r0, #44]
    ldr r2, 3f
    cmp r1, #2
    beq 1f
    ldrb r1, [r0, #44]
    cmp r1, #1
    bne 2f
    ldr r1, [r0, #40]
    cmp r1, #0
    beq 2f
    ldr r3, [r2, #84]
    bics r1, r1, r3
    bne 2f
1:  ldrb r1, [r2, #4]
    add r0, r0, #4
    cmp r1, #0
    bne 2f
    add r0, r0, #4
    b \tail
2:  bx lr
    FUNCTION_END \name
3:  .word ipc_allocator_dispatch_owner_68
.endm

.macro INITIALIZE_GUARDED name, probe, initialize, state, context, fallback
    FUNCTION_BEGIN \name
    ldr r0, 2f
    push {r4, lr}
    ldr r0, [r0]
    tst r0, #1
    bne 1f
    ldr r0, 2f
    blx \probe
    cmp r0, #0
    beq 1f
    ldr r0, 3f
    bl \initialize
    ldr r2, 4f
    ldr r1, 5f
    mov r0, r0
    ldr r0, 2f
    mov r0, r0
1:  ldr r0, 3f
    pop {r4, pc}
    FUNCTION_END \name
2:  .word \state
3:  .word \context
4:  .word ipc_fixed_extent_52
5:  .word \fallback
.endm

.macro SCALED_RANDOM name, random
    FUNCTION_BEGIN \name
    push {r4, lr}
    mov r4, r1
    ldr r1, 2f
    cmp r4, r1
    bcs 1f
    bl \random
    uxth r1, r4
    umull r1, r0, r0, r1
    pop {r4, pc}
1:  nop
    bl \random
    mov r1, r4
    nop
    bl func_0015EC10
    mov r0, r1
    pop {r4, pc}
    FUNCTION_END \name
2:  .word arm_duplicate_templates_81_scale_limit_identity
.endm

.macro ACQUIRE_COUNTER name
    FUNCTION_BEGIN \name
    push {r4, lr}
    mov r4, r0
    mrc p15, 0, r0, c13, c0, 3
    ldr r1, [r4, #4]
    cmp r0, r1
    beq 1f
    mov r0, r4
    bl func_001183E4
    mrc p15, 0, r0, c13, c0, 3
    str r0, [r4, #4]
1:  ldr r0, [r4, #8]
    add r0, r0, #1
    str r0, [r4, #8]
    pop {r4, pc}
    FUNCTION_END \name
.endm

.macro SUBMIT_TAIL name
    FUNCTION_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r0
    ldr r0, [r1]
    mov r4, r1
    ldr r1, [r0, #28]
    mov r0, r4
    blx r1
    mov r2, r0
    mov r1, r5
    mov r0, r4
    pop {r4, r5, r6, lr}
    mov r3, #1
    b func_0012B9A0
    FUNCTION_END \name
.endm

.macro LOCKED_QUERY name, lock_identity, query_identity
    FUNCTION_BEGIN \name
    push {r4, r5, r6, lr}
    ldr r4, 1f
    mov r0, r4
    bl func_001602B8
    ldr r0, 2f
    ldr r0, [r0]
    cmp r0, #0
    movne r5, #1
    moveq r5, #0
    mov r0, r4
    bl func_00160380
    mov r0, r5
    pop {r4, r5, r6, pc}
    FUNCTION_END \name
1:  .word \lock_identity
2:  .word \query_identity
.endm

.macro PREPARE_BYTE name, select
    FUNCTION_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r1
    mov r5, r0
    bl func_00168EC0
    mov r1, #1
    mov r0, r5
    bl \select
    strb r4, [r0, #27]
    mov r0, r5
    pop {r4, r5, r6, lr}
    b func_00168E50
    FUNCTION_END \name
.endm

.macro OPTIONAL_FALLBACK name
    FUNCTION_BEGIN \name
    cmp r0, #0
    beq 2f
    ldr r1, [r0, #-8]!
    cmp r1, #0
    beq 1f
    bx r1
1:  nop
    b func_00302108
2:  bx lr
    FUNCTION_END \name
.endm

.macro RECEIVER_TAIL name, target, identity
    FUNCTION_BEGIN \name
    mov r1, r0
    ldr r0, 1f
    b \target
    FUNCTION_END \name
1:  .word \identity
.endm

.macro ADD_FOUR_TAIL name, target
    FUNCTION_BEGIN \name
    add r0, r0, #4
    b \target
    FUNCTION_END \name
.endm

GROW_SEQUENCE func_002AD3EC, func_00160F9C
GROW_SEQUENCE func_002AD4DC, func_00160F9C
RESET_RECORD func_00163ED0, func_00302108, arm_duplicate_templates_81_record_type_a_identity
RESET_RECORD func_00173304, func_00302108, arm_duplicate_templates_81_record_type_b_identity
GUARDED_ACTIVE func_0017EA3C, func_001602B8
GUARDED_ACTIVE func_0017EA90, func_00160380
INITIALIZE_GUARDED func_001360FC, func_00302F52, func_00136240, ipc_guard_state_52, arm_duplicate_templates_81_guard_context_a_identity, ipc_fallback_entry_52
INITIALIZE_GUARDED func_0017541C, func_00302F52, func_001364B0, arm_duplicate_templates_81_guard_state_b_identity, arm_duplicate_templates_81_guard_context_b_identity, arm_duplicate_templates_81_fallback_b_identity
SCALED_RANDOM func_00112310, func_0011A204
SCALED_RANDOM func_00175D64, func_00164798
ACQUIRE_COUNTER func_001602B8
ACQUIRE_COUNTER func_0050DC00
SUBMIT_TAIL func_0012344C
SUBMIT_TAIL func_00123480
LOCKED_QUERY func_0014967C, service_session_lock_48, arm_duplicate_templates_81_query_state_a_identity
LOCKED_QUERY func_0016FF00, arm_duplicate_templates_81_session_lock_b_identity, arm_duplicate_templates_81_query_state_b_identity
PREPARE_BYTE func_003B2BEC, func_0016BC84
PREPARE_BYTE func_003B32A0, func_00176EFC
OPTIONAL_FALLBACK func_00160A64
OPTIONAL_FALLBACK func_00160F9C
RECEIVER_TAIL func_00178228, func_0017E324, service_unlink_context_44
RECEIVER_TAIL func_0018EC24, func_00190348, ipc_submission_owner_72
ADD_FOUR_TAIL func_0021A9B8, func_0017F4A4
ADD_FOUR_TAIL func_00328DFC, func_00329E20

.section .note.GNU-stack, "", %progbits
