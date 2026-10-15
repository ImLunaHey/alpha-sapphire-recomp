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

.macro IPC_HANDLE_MAPPED_THREE_OUTPUTS name, command
    FUNCTION_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    mov r5, r3
    ldrd r6, [sp, #28]
    mrc p15, 0, r4, c13, c0, 3
    ldr r3, .Lcommand_\@
    str r3, [r4, #128]!
    str r2, [r4, #4]
    ldrb r3, [sp, #24]
    strb r3, [r4, #8]
    mov r3, #10
    orr r2, r3, r2, lsl #4
    str r1, [r4, #16]
    str r2, [r4, #12]
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn_\@
    ldrb r0, [r4, #8]
    strb r0, [r5]
    ldr r0, [r4, #12]
    str r0, [r6]
    ldrb r0, [r4, #16]
    strb r0, [r7]
    ldr r0, [r4, #4]
.Lreturn_\@:
    pop {r4, r5, r6, r7, r8, pc}
    .size \name, . - \name
    .global \command
.Lcommand_\@:
    .word \command
.endm

.macro IPC_HANDLE_DESCRIPTOR_TWO_OUTPUTS name, command
    FUNCTION_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    add r4, sp, #32
    ldm r4, {r5, r6}
    add r4, sp, #24
    ldm r4, {r7, r12}
    mrc p15, 0, r4, c13, c0, 3
    ldr r8, .Lcommand_\@
    str r8, [r4, #128]!
    add lr, r4, #4
    stm lr, {r1, r2, r3, r12}
    mov r1, #12
    add lr, r4, #20
    orr r1, r1, r12, lsl #4
    stm lr, {r1, r7}
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn_\@
    ldr r0, [r4, #8]
    str r0, [r5]
    ldr r0, [r4, #12]
    str r0, [r6]
    ldr r0, [r4, #4]
.Lreturn_\@:
    pop {r4, r5, r6, r7, r8, pc}
    .size \name, . - \name
    .global \command
.Lcommand_\@:
    .word \command
.endm

.macro IPC_HANDLE_MAPPED_MIXED_OUTPUTS name, command
    FUNCTION_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    mov r5, r3
    ldrd r6, [sp, #24]
    mrc p15, 0, r4, c13, c0, 3
    ldr r3, .Lcommand_\@
    str r3, [r4, #128]!
    mov r3, #10
    str r2, [r4, #4]
    orr r2, r3, r2, lsl #4
    str r1, [r4, #12]
    str r2, [r4, #8]
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn_\@
    ldrb r0, [r4, #8]
    strb r0, [r5]
    ldr r0, [r4, #12]
    str r0, [r6]
    ldrb r0, [r4, #16]
    strb r0, [r7]
    ldr r0, [r4, #4]
.Lreturn_\@:
    pop {r4, r5, r6, r7, r8, pc}
    .size \name, . - \name
    .global \command
.Lcommand_\@:
    .word \command
.endm

.macro IPC_HANDLE_TWO_BYTES_ONE_OUTPUT name, command
    FUNCTION_BEGIN \name
    push {r0, r1, r2, r3, r4, r5, r6, lr}
    ldr r5, [sp, #32]
    mrc p15, 0, r4, c13, c0, 3
    ldr r3, .Lcommand_\@
    str r3, [r4, #128]!
    str r2, [r4, #4]
    ldrb r3, [sp, #12]
    strb r3, [r4, #8]
    ldrb r3, [sp, #36]
    strb r3, [r4, #12]
    mov r3, #10
    orr r2, r3, r2, lsl #4
    str r1, [r4, #20]
    str r2, [r4, #16]
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn_\@
    ldrb r0, [r4, #8]
    strb r0, [r5]
    ldr r0, [r4, #4]
.Lreturn_\@:
    add sp, sp, #16
    pop {r4, r5, r6, pc}
    .size \name, . - \name
    .global \command
.Lcommand_\@:
    .word \command
.endm

.macro IPC_HANDLE_STATIC_ONE_OUTPUT name, command
    FUNCTION_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r1
    ldr r1, [sp, #16]
    mrc p15, 0, r4, c13, c0, 3
    ldr r6, .Lcommand_\@
    mov r12, #0
    str r6, [r4, #128]!
    add lr, r4, #8
    str r2, [r4, #4]
    mov r2, #32
    stm lr, {r1, r2}
    orr r1, r12, r1, lsl #14
    add r12, r4, #20
    orr r1, r1, #2
    stm r12, {r1, r3}
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
.Lcommand_\@:
    .word \command
.endm

.macro IPC_GLOBAL_WORDS_BYTE_MAPPED name, command, handle
    FUNCTION_BEGIN \name
    push {r0, r1, r2, r3, r4, lr}
    ldr r2, [sp, #24]
    mrc p15, 0, r4, c13, c0, 3
    ldr r12, .Lcommand_\@
    str r12, [r4, #128]!
    add r12, r4, #20
    strd r0, [r4, #4]
    ldrb r0, [sp, #8]
    strb r0, [r4, #12]
    mov r0, #10
    orr r0, r0, r2, lsl #4
    str r2, [r4, #16]
    stm r12, {r0, r3}
    ldr r0, .Lhandle_slot_\@
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    add sp, sp, #16
    pop {r4, pc}
    .size \name, . - \name
    .global \command
    .global \handle
.Lcommand_\@:
    .word \command
.Lhandle_slot_\@:
    .word \handle
.endm

.macro IPC_GLOBAL_TWO_DESCRIPTORS name, command, handle
    FUNCTION_BEGIN \name
    push {r4, r5, r6, lr}
    ldr r12, [sp, #16]
    mrc p15, 0, r4, c13, c0, 3
    ldr r5, .Lcommand_\@
    str r5, [r4, #128]!
    add r6, r4, #4
    stm r6, {r1, r2, r12}
    mov r2, #10
    orr r2, r2, r12, lsl #4
    strd r2, [r4, #16]
    str r0, [r4, #28]
    ldr r0, .Lhandle_slot_\@
    mov r2, #12
    orr r1, r2, r1, lsl #4
    str r1, [r4, #24]
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, r5, r6, pc}
    .size \name, . - \name
    .global \command
    .global \handle
.Lcommand_\@:
    .word \command
.Lhandle_slot_\@:
    .word \handle
.endm

.macro IPC_HANDLE_HALFWORD_ONE_OUTPUT name, command
    FUNCTION_BEGIN \name
    push {r0, r1, r2, r3, r4, r5, r6, lr}
    ldr r5, [sp, #32]
    mrc p15, 0, r4, c13, c0, 3
    ldr r1, .Lcommand_\@
    str r1, [r4, #128]!
    ldrh r1, [sp, #4]
    add r6, r4, #12
    strh r1, [r4, #4]
    mov r1, #12
    orr r1, r1, r3, lsl #4
    str r3, [r4, #8]
    stm r6, {r1, r2}
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
.Lcommand_\@:
    .word \command
.endm

.macro IPC_GLOBAL_FIXED_MAPPED name, command, handle
    FUNCTION_BEGIN \name
    push {r4, r5, r6, lr}
    ldr r12, [sp, #16]
    mrc p15, 0, r4, c13, c0, 3
    ldr r5, .Lcommand_\@
    str r5, [r4, #128]!
    add r6, r4, #4
    stm r6, {r1, r2, r3, r12}
    mov r2, #32
    str r2, [r4, #20]
    str r0, [r4, #32]
    ldr r0, .Lhandle_slot_\@
    mov r2, #10
    orr r1, r2, r1, lsl #4
    str r1, [r4, #28]
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, r5, r6, pc}
    .size \name, . - \name
    .global \command
    .global \handle
.Lcommand_\@:
    .word \command
.Lhandle_slot_\@:
    .word \handle
.endm

IPC_HANDLE_MAPPED_THREE_OUTPUTS func_002C8EA8, ipc_command_func_002C8EA8
IPC_HANDLE_MAPPED_THREE_OUTPUTS func_002CA714, ipc_command_func_002C8EA8
IPC_HANDLE_DESCRIPTOR_TWO_OUTPUTS func_002C8D60, ipc_command_func_002C8D60
IPC_HANDLE_DESCRIPTOR_TWO_OUTPUTS func_002CA5CC, ipc_command_func_002C8D60
IPC_HANDLE_MAPPED_MIXED_OUTPUTS func_002C902C, ipc_command_func_002C902C
IPC_HANDLE_MAPPED_MIXED_OUTPUTS func_002CA898, ipc_command_func_002C902C
IPC_HANDLE_TWO_BYTES_ONE_OUTPUT func_002C908C, ipc_command_func_002C908C
IPC_HANDLE_TWO_BYTES_ONE_OUTPUT func_002CA8F8, ipc_command_func_002C908C
IPC_HANDLE_STATIC_ONE_OUTPUT func_002E40B0, ipc_command_func_002E40B0
IPC_HANDLE_STATIC_ONE_OUTPUT func_002E42FC, ipc_command_func_002E42FC
IPC_GLOBAL_WORDS_BYTE_MAPPED func_001FFA8C, ipc_command_func_001FFA8C, ipc_handle_slot_eta
IPC_GLOBAL_WORDS_BYTE_MAPPED func_00200154, ipc_command_func_001FFA8C, ipc_handle_slot_theta
IPC_GLOBAL_TWO_DESCRIPTORS func_001FFB30, ipc_command_func_001FFB30, ipc_handle_slot_eta
IPC_GLOBAL_TWO_DESCRIPTORS func_002001F8, ipc_command_func_001FFB30, ipc_handle_slot_theta
IPC_HANDLE_HALFWORD_ONE_OUTPUT func_002C9138, ipc_command_func_002C9138
IPC_HANDLE_HALFWORD_ONE_OUTPUT func_002CA9A4, ipc_command_func_002C9138
IPC_GLOBAL_FIXED_MAPPED func_001FF78C, ipc_command_func_001FF78C, ipc_handle_slot_eta
IPC_GLOBAL_FIXED_MAPPED func_001FFE54, ipc_command_func_001FF78C, ipc_handle_slot_theta
