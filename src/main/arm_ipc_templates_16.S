.syntax unified
.arm

.macro FUNCTION_BEGIN name
    .section .text.\name, "ax", %progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
.endm

.macro IPC_GLOBAL_TWO_DESCRIPTORS_OUTPUT name, command, handle
    FUNCTION_BEGIN \name
    push {r0, r1, r2, r3, r4, r5, r6, lr}
    add r4, sp, #32
    ldm r4, {r5, r12}
    ldr r1, [sp, #40]
    mrc p15, 0, r4, c13, c0, 3
    ldr r6, .Lcommand_\@
    str r6, [r4, #128]!
    add r6, r4, #20
    str r0, [r4, #4]
    ldrb r0, [sp, #4]
    strb r0, [r4, #8]
    mov r0, #10
    str r3, [r4, #12]
    orr r0, r0, r3, lsl #4
    str r1, [r4, #16]
    stm r6, {r0, r2}
    mov r0, #12
    add r6, r4, #28
    orr r0, r0, r1, lsl #4
    stm r6, {r0, r12}
    ldr r0, .Lhandle_slot_\@
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn_\@
    ldr r0, [r4, #8]
    str r0, [r5]
    ldr r0, [r4, #4]
.Lreturn_\@:
    add sp, sp, #16
    pop {r4, r5, r6, pc}
    .size \name, . - \name
    .global \command
    .global \handle
.Lcommand_\@:
    .word \command
.Lhandle_slot_\@:
    .word \handle
.endm

.macro IPC_GLOBAL_AUX_THREE_DESCRIPTORS name, command, auxiliary, handle
    FUNCTION_BEGIN \name
    push {r0, r1, r2, r3, r4, r5, r6, lr}
    add r4, sp, #32
    ldm r4, {r1, r5, r12}
    mrc p15, 0, r4, c13, c0, 3
    ldr r6, .Lcommand_\@
    str r6, [r4, #128]!
    add r6, r4, #12
    str r0, [r4, #4]
    ldrb r0, [sp, #4]
    strb r0, [r4, #8]
    mov r0, #10
    stm r6, {r3, r5}
    orr r0, r0, r5, lsl #4
    strd r0, [r4, #20]
    ldr r0, .Lauxiliary_\@
    add r6, r4, #28
    stm r6, {r0, r12}
    mov r0, #14
    add r6, r4, #36
    orr r0, r0, r3, lsl #4
    stm r6, {r0, r2}
    ldr r0, .Lhandle_slot_\@
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    add sp, sp, #16
    pop {r4, r5, r6, pc}
    .size \name, . - \name
    .global \command
    .global \auxiliary
    .global \handle
.Lcommand_\@:
    .word \command
.Lauxiliary_\@:
    .word \auxiliary
.Lhandle_slot_\@:
    .word \handle
.endm

.macro IPC_HANDLE_STATIC_DESCRIPTOR name, command
    FUNCTION_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    add r4, sp, #24
    ldm r4, {r5, r7, r12}
    mrc p15, 0, r4, c13, c0, 3
    ldr r8, .Lcommand_\@
    mov r6, #0
    str r8, [r4, #128]!
    add lr, r4, #4
    stm lr, {r1, r2, r3, r5, r12}
    orr r1, r6, r12, lsl #14
    add r6, r4, #24
    orr r1, r1, #2
    stm r6, {r1, r7}
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, r5, r6, r7, r8, pc}
    .size \name, . - \name
    .global \command
.Lcommand_\@:
    .word \command
.endm

.macro IPC_GLOBAL_THREE_BYTES name, command, handle
    FUNCTION_BEGIN \name
    push {r0, r1, r2, r4, r5, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r0, .Lcommand_\@
    str r0, [r4, #128]!
    ldrb r0, [sp]
    strb r0, [r4, #4]
    ldrb r0, [sp, #4]
    strb r0, [r4, #8]
    ldrb r0, [sp, #8]
    strb r0, [r4, #12]
    ldr r0, .Lhandle_slot_\@
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    add sp, sp, #12
    pop {r4, r5, pc}
    .size \name, . - \name
    .global \command
    .global \handle
.Lcommand_\@:
    .word \command
.Lhandle_slot_\@:
    .word \handle
.endm

.macro IPC_GLOBAL_TWO_MAPPED name, command, handle
    FUNCTION_BEGIN \name
    push {r0, r1, r2, r3, r4, r5, r6, lr}
    add r4, sp, #32
    ldm r4, {r1, r12}
    mrc p15, 0, r4, c13, c0, 3
    ldr r5, .Lcommand_\@
    str r5, [r4, #128]!
    add r5, r4, #12
    str r0, [r4, #4]
    ldrb r0, [sp, #4]
    strb r0, [r4, #8]
    mov r0, #10
    stm r5, {r3, r12}
    orr r0, r0, r12, lsl #4
    strd r0, [r4, #20]
    mov r0, #14
    add r5, r4, #28
    orr r0, r0, r3, lsl #4
    stm r5, {r0, r2}
    ldr r0, .Lhandle_slot_\@
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    add sp, sp, #16
    pop {r4, r5, r6, pc}
    .size \name, . - \name
    .global \command
    .global \handle
.Lcommand_\@:
    .word \command
.Lhandle_slot_\@:
    .word \handle
.endm

.macro IPC_GLOBAL_FIXED_OUTPUT name, command, handle
    FUNCTION_BEGIN \name
    push {r4, r5, r6, lr}
    add r4, sp, #16
    mov r5, r2
    ldm r4, {r2, r12}
    mrc p15, 0, r4, c13, c0, 3
    ldr r6, .Lcommand_\@
    str r6, [r4, #128]!
    add lr, r4, #12
    stm lr, {r2, r12}
    mov r2, #32
    add lr, r4, #4
    str r2, [r4, #20]
    stm lr, {r1, r3}
    mov r2, #12
    str r0, [r4, #32]
    ldr r0, .Lhandle_slot_\@
    orr r1, r2, r1, lsl #4
    str r1, [r4, #28]
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn_\@
    ldr r0, [r4, #8]
    str r0, [r5]
    ldr r0, [r4, #4]
.Lreturn_\@:
    pop {r4, r5, r6, pc}
    .size \name, . - \name
    .global \command
    .global \handle
.Lcommand_\@:
    .word \command
.Lhandle_slot_\@:
    .word \handle
.endm

.macro IPC_HANDLE_TWO_HALFWORD_OUTPUTS name, command
    FUNCTION_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    ldr r5, [sp, #24]
    ldr r6, [sp, #36]
    ldr r12, [sp, #32]
    mrc p15, 0, r4, c13, c0, 3
    ldr r7, .Lcommand_\@
    str r7, [r4, #128]!
    add r8, r4, #4
    add r7, r4, #20
    stm r8, {r1, r3}
    ldrh r1, [sp, #28]
    strh r1, [r4, #12]
    str r12, [r4, #16]
    mov r12, #12
    orr r1, r12, r3, lsl #6
    stm r7, {r1, r2}
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn_\@
    ldrh r0, [r4, #8]
    strh r0, [r5]
    ldrh r0, [r4, #12]
    strh r0, [r6]
    ldr r0, [r4, #4]
.Lreturn_\@:
    pop {r4, r5, r6, r7, r8, pc}
    .size \name, . - \name
    .global \command
.Lcommand_\@:
    .word \command
.endm

IPC_GLOBAL_TWO_DESCRIPTORS_OUTPUT func_001FF5F0, ipc_command_func_001FF5F0, ipc_handle_slot_eta
IPC_GLOBAL_TWO_DESCRIPTORS_OUTPUT func_001FFCB8, ipc_command_func_001FF5F0, ipc_handle_slot_theta

IPC_GLOBAL_AUX_THREE_DESCRIPTORS func_001FF878, ipc_command_func_001FF878, ipc_aux_literal_class_15, ipc_handle_slot_eta
IPC_GLOBAL_AUX_THREE_DESCRIPTORS func_001FFF40, ipc_command_func_001FF878, ipc_aux_literal_class_15, ipc_handle_slot_theta

IPC_HANDLE_STATIC_DESCRIPTOR func_001F6D94, ipc_command_func_001F6D94
IPC_HANDLE_STATIC_DESCRIPTOR func_001F71B8, ipc_command_func_001F71B8
IPC_HANDLE_STATIC_DESCRIPTOR func_001F7460, ipc_command_func_001F7460

IPC_GLOBAL_THREE_BYTES func_002DEDFC, ipc_command_func_002DEDFC, ipc_handle_slot_beta
IPC_GLOBAL_THREE_BYTES func_002DEE4C, ipc_command_func_002DEE4C, ipc_handle_slot_beta
IPC_GLOBAL_THREE_BYTES func_002DEE9C, ipc_command_func_002DEE9C, ipc_handle_slot_beta

IPC_GLOBAL_TWO_MAPPED func_001FF6AC, ipc_command_func_001FF6AC, ipc_handle_slot_eta
IPC_GLOBAL_TWO_MAPPED func_001FFD74, ipc_command_func_001FF6AC, ipc_handle_slot_theta

IPC_GLOBAL_FIXED_OUTPUT func_001FF71C, ipc_command_func_001FF71C, ipc_handle_slot_eta
IPC_GLOBAL_FIXED_OUTPUT func_001FFDE4, ipc_command_func_001FF71C, ipc_handle_slot_theta

IPC_HANDLE_TWO_HALFWORD_OUTPUTS func_002C943C, ipc_command_func_002C619C
IPC_HANDLE_TWO_HALFWORD_OUTPUTS func_002CAC34, ipc_command_func_002C619C

.section .note.GNU-stack, "", %progbits
