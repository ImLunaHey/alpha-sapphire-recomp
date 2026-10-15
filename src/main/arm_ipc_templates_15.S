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

.macro IPC_HANDLE_POINTER_ONE name, command
    FUNCTION_BEGIN \name
    push {r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r2, .Lcommand_\@
    str r2, [r4, #128]!
    str r1, [r4, #4]
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
    .size \name, . - \name
    .global \command
.Lcommand_\@:
    .word \command
.endm

.macro IPC_THIRTEEN_DESCRIPTOR name, command
    FUNCTION_BEGIN \name
    push {r4, r5, r6, r7, r8, r9, r10, r11, r12, lr}
    add r4, sp, #44
    ldm r4, {r5, r12}
    add r4, sp, #68
    ldr r10, [sp, #40]
    ldm r4, {r6, lr}
    add r4, sp, #56
    ldm r4, {r7, r8, r11}
    mrc p15, 0, r4, c13, c0, 3
    ldr r9, .Lcommand_\@
    str r9, [r4, #128]!
    str r1, [r4, #4]
    str r10, [r4, #16]
    str r12, [r4, #20]
    str r7, [r4, #24]
    mov r1, #1024
    str r8, [r4, #28]
    orr r1, r1, r12, lsl #14
    str r11, [r4, #32]
    orr r1, r1, #2
    str lr, [r4, #36]
    str r1, [r4, #40]
    mov r1, #2048
    orr r1, r1, lr, lsl #14
    orr r1, r1, #2
    str r5, [r4, #44]
    str r1, [r4, #48]
    str r6, [r4, #52]
    strd r2, [r4, #8]
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
    .size \name, . - \name
    .global \command
.Lcommand_\@:
    .word \command
.endm

.macro IPC_MIXED_STATIC_MAPPED name, command
    FUNCTION_BEGIN \name
    push {r4, r5, r6, lr}
    add r4, sp, #16
    ldm r4, {r5, r12}
    mrc p15, 0, r4, c13, c0, 3
    ldr r6, .Lcommand_\@
    str r6, [r4, #128]!
    add lr, r4, #4
    stm lr, {r1, r3, r12}
    mov r1, #3072
    orr r1, r1, r3, lsl #14
    add lr, r4, #16
    orr r1, r1, #2
    stm lr, {r1, r2}
    mov r1, #10
    add lr, r4, #24
    orr r1, r1, r12, lsl #4
    stm lr, {r1, r5}
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, r5, r6, pc}
    .size \name, . - \name
    .global \command
.Lcommand_\@:
    .word \command
.endm

.macro IPC_GLOBAL_ONE_OUTPUT_AUX name, command, auxiliary, handle
    FUNCTION_BEGIN \name
    push {r0, r1, r2, r3, r4, r5, r6, r7, r8, lr}
    add r4, sp, #48
    ldm r4, {r1, r6}
    add r4, sp, #40
    ldm r4, {r5, r12}
    mrc p15, 0, r4, c13, c0, 3
    ldr r7, .Lcommand_\@
    str r7, [r4, #128]!
    add r7, r4, #20
    str r0, [r4, #4]
    ldrb r0, [sp, #4]
    strb r0, [r4, #8]
    mov r0, #10
    str r3, [r4, #12]
    orr r0, r0, r3, lsl #4
    str r1, [r4, #16]
    stm r7, {r0, r2}
    add r7, r4, #28
    ldr r0, .Lauxiliary_\@
    stm r7, {r0, r6}
    mov r0, #12
    add r7, r4, #36
    orr r0, r0, r1, lsl #4
    stm r7, {r0, r12}
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
    pop {r4, r5, r6, r7, r8, pc}
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

.macro IPC_GLOBAL_TEMP_TLS name, command, handle
    FUNCTION_BEGIN \name
    push {r4, r5, r6, r7, r8, r9, r10, r11, r12, lr}
    mov r8, r0
    mov r9, r2
    add r2, sp, #40
    ldm r2, {r0, r10, r11}
    mrc p15, 0, r4, c13, c0, 3
    ldr r12, .Lcommand_\@
    mov r2, #0
    str r12, [r4, #128]!
    str r1, [r4, #4]
    str r0, [r4, #8]
    mrc p15, 0, r1, c13, c0, 3
    add r5, r1, #384
    orr r0, r2, r0, lsl #14
    orr r0, r0, #2
    ldrd r6, [r5]
    stm r5, {r0, r3}
    ldr r0, .Lhandle_slot_\@
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    strd r6, [r5]
    bmi .Lreturn_\@
    ldr r0, [r4, #8]
    str r0, [r8]
    ldr r0, [r4, #12]
    str r0, [r9]
    ldr r0, [r4, #16]
    str r0, [r10]
    ldr r0, [r4, #24]
    str r0, [r11]
    ldr r0, [r4, #4]
.Lreturn_\@:
    pop {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
    .size \name, . - \name
    .global \command
    .global \handle
.Lcommand_\@:
    .word \command
.Lhandle_slot_\@:
    .word \handle
.endm

.macro IPC_GLOBAL_BYTE_HALFWORDS name, command, handle
    FUNCTION_BEGIN \name
    push {r0, r1, r2, r3, r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r0, .Lcommand_\@
    str r0, [r4, #128]!
    ldrb r0, [sp]
    strb r0, [r4, #4]
    ldrh r0, [sp, #4]
    strh r0, [r4, #8]
    ldrh r0, [sp, #8]
    strh r0, [r4, #12]
    ldrh r0, [sp, #12]
    strh r0, [r4, #16]
    ldrh r0, [sp, #24]
    strh r0, [r4, #20]
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

.macro IPC_GLOBAL_MAPPED_BUFFER name, command, handle
    FUNCTION_BEGIN \name
    push {r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r2, .Lcommand_\@
    str r2, [r4, #128]!
    mov r2, #10
    str r1, [r4, #4]
    str r0, [r4, #12]
    ldr r0, .Lhandle_slot_\@
    orr r1, r2, r1, lsl #4
    str r1, [r4, #8]
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
    .size \name, . - \name
    .global \command
    .global \handle
.Lcommand_\@:
    .word \command
.Lhandle_slot_\@:
    .word \handle
.endm

IPC_HANDLE_POINTER_ONE func_001182D0, ipc_command_func_001182D0
IPC_HANDLE_POINTER_ONE func_00119F88, ipc_command_func_00119F88
IPC_HANDLE_POINTER_ONE func_0011A120, ipc_command_func_00119F88
IPC_HANDLE_POINTER_ONE func_001F7600, ipc_command_func_001F7600
IPC_HANDLE_POINTER_ONE func_001F7838, ipc_command_func_001F7838
IPC_HANDLE_POINTER_ONE func_002CCBE4, ipc_command_func_002CCBE4
IPC_HANDLE_POINTER_ONE func_002CCD5C, ipc_command_func_002C63E4

IPC_THIRTEEN_DESCRIPTOR func_001F6DE4, ipc_command_func_001F6DE4
IPC_THIRTEEN_DESCRIPTOR func_001F7208, ipc_command_func_001F7208

IPC_MIXED_STATIC_MAPPED func_002CCA90, ipc_command_func_002CCA90
IPC_MIXED_STATIC_MAPPED func_002CCC14, ipc_command_func_002CCC14
IPC_MIXED_STATIC_MAPPED func_002CCCFC, ipc_command_func_002CCCFC

IPC_GLOBAL_ONE_OUTPUT_AUX func_001FF7E4, ipc_command_func_001FF7E4, ipc_aux_literal_class_15, ipc_handle_slot_eta
IPC_GLOBAL_ONE_OUTPUT_AUX func_001FFEAC, ipc_command_func_001FF7E4, ipc_aux_literal_class_15, ipc_handle_slot_theta

IPC_GLOBAL_TEMP_TLS func_00126740, ipc_command_func_00126740, ipc_handle_slot_alpha
IPC_GLOBAL_TEMP_TLS func_00133D18, ipc_command_func_002DE6C0, ipc_handle_slot_alpha

IPC_GLOBAL_BYTE_HALFWORDS func_002DEBBC, ipc_command_func_002DEBBC, ipc_handle_slot_beta
IPC_GLOBAL_BYTE_HALFWORDS func_002DEC68, ipc_command_func_002DEC68, ipc_handle_slot_beta
IPC_GLOBAL_BYTE_HALFWORDS func_002DECC8, ipc_command_func_002DECC8, ipc_handle_slot_beta

IPC_GLOBAL_MAPPED_BUFFER func_001FB4CC, ipc_command_func_001FB4CC, ipc_handle_slot_epsilon
IPC_GLOBAL_MAPPED_BUFFER func_001FFA44, ipc_command_func_001FFA44, ipc_handle_slot_eta
IPC_GLOBAL_MAPPED_BUFFER func_0020010C, ipc_command_func_001FFA44, ipc_handle_slot_theta
IPC_GLOBAL_MAPPED_BUFFER func_00202E40, ipc_command_func_00202E40, ipc_handle_slot_zeta

.section .note.GNU-stack, "", %progbits
