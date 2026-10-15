.syntax unified
.arm

.macro IPC_ONE name, command, handle
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    push {r0, r4, r5, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r0, .Lcommand_\name
    str r0, [r4, #128]!
    ldrb r0, [sp]
    strb r0, [r4, #4]
    ldr r0, .Lhandle_slot_\name
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r3, r4, r5, pc}
.size \name, . - \name
.Lcommand_\name:
    .word \command
.Lhandle_slot_\name:
    .word \handle
.global \command
.global \handle
.endm

.macro IPC_TWO name, command, handle
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    push {r0, r1, r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r0, .Lcommand_\name
    str r0, [r4, #128]!
    ldrb r0, [sp]
    strb r0, [r4, #4]
    ldrb r0, [sp, #4]
    strb r0, [r4, #8]
    ldr r0, .Lhandle_slot_\name
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    add sp, sp, #8
    pop {r4, pc}
.size \name, . - \name
.Lcommand_\name:
    .word \command
.Lhandle_slot_\name:
    .word \handle
.global \command
.global \handle
.endm

.macro TABLE_STATE name, selector_shift, selector_variant, source16, base16, source64, base64
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
    cmp r4, #12
    movlt r4, #12
    cmp r4, #52
    movgt r4, #52
    str r4, [r0, #72]
    sub r5, pc, #136
    ldrb r6, [r5, r4]
    add r6, r6, #8
    sub r5, pc, #94
    ldrb r5, [r5, r4]
    sub r4, pc, #268
    add r4, r4, r5, lsl #4
    sub r7, pc, #180
    add r8, r0, #376
    mov r9, #16
.Lloop16_\name:
    ldrb r10, [r4], #1
    ldrb r11, [r7], #1
    orr r11, r11, r10, lsl r6
    str r11, [r8], #4
    subs r9, r9, #1
    bne .Lloop16_\name
    sub r6, r6, #2
    sub r4, pc, #764
    add r4, r4, r5, lsl #6
    sub r7, pc, #388
    add r8, r0, #120
    mov r9, #64
.Lloop64_\name:
    ldrb r10, [r4], #1
    ldrb r11, [r7], #1
    orr r11, r11, r10, lsl r6
    str r11, [r8], #4
    subs r9, r9, #1
    bne .Lloop64_\name
    add r4, r0, #80
    mov r5, #9
    strb r5, [r4, #1]
    strb r5, [r4, #2]
    strb r5, [r4, #3]
    strb r5, [r4, #4]
    strb r5, [r4, #8]
    strb r5, [r4, #16]
    strb r5, [r4, #24]
    strb r5, [r4, #32]
    mov pc, lr
.size \name, . - \name
.global \selector_shift
.global \selector_variant
.global \source16
.global \base16
.global \source64
.global \base64
.endm

IPC_ONE func_00109CB8, ipc_command_func_00109CB8, ipc_handle_slot_alpha
IPC_ONE func_001103C0, ipc_command_func_001103C0, ipc_handle_slot_alpha
IPC_ONE func_001267CC, ipc_command_func_001267CC, ipc_handle_slot_alpha
IPC_ONE func_001269A8, ipc_command_func_001269A8, ipc_handle_slot_beta
IPC_ONE func_00126A20, ipc_command_func_00126A20, ipc_handle_slot_beta
IPC_ONE func_002C6104, ipc_command_func_002C6104, ipc_handle_slot_gamma
IPC_ONE func_002C6378, ipc_command_func_002C6378, ipc_handle_slot_gamma
IPC_ONE func_002C63E4, ipc_command_func_002C63E4, ipc_handle_slot_gamma
IPC_ONE func_002C64BC, ipc_command_func_002C64BC, ipc_handle_slot_gamma
IPC_ONE func_002C65E8, ipc_command_func_002C65E8, ipc_handle_slot_gamma
IPC_ONE func_002C6624, ipc_command_func_002C6624, ipc_handle_slot_gamma
IPC_ONE func_002DE708, ipc_command_func_002DE708, ipc_handle_slot_beta
IPC_ONE func_002DE884, ipc_command_func_002C6378, ipc_handle_slot_beta
IPC_ONE func_002DEA44, ipc_command_func_002DEA44, ipc_handle_slot_beta
IPC_TWO func_002DE630, ipc_command_func_002DE630, ipc_handle_slot_beta
IPC_TWO func_002DE678, ipc_command_func_002DE678, ipc_handle_slot_beta
IPC_TWO func_002DE6C0, ipc_command_func_002DE6C0, ipc_handle_slot_beta
IPC_TWO func_002DE744, ipc_command_func_002DE744, ipc_handle_slot_beta
IPC_TWO func_002DE78C, ipc_command_func_002DE78C, ipc_handle_slot_beta
IPC_TWO func_002DE83C, ipc_command_func_002DE83C, ipc_handle_slot_beta
IPC_TWO func_002DE8F0, ipc_command_func_002DE8F0, ipc_handle_slot_beta
IPC_TWO func_002DE938, ipc_command_func_002DE938, ipc_handle_slot_beta
IPC_TWO func_002DE980, ipc_command_func_002DE980, ipc_handle_slot_beta
IPC_TWO func_002DEB2C, ipc_command_func_002DEB2C, ipc_handle_slot_beta
IPC_TWO func_002DEB74, ipc_command_func_002DEB74, ipc_handle_slot_beta
TABLE_STATE func_001B2D70, table_func_001B2D70_selector_shift, table_func_001B2D70_selector_variant, table_func_001B2D70_source16, table_func_001B2D70_base16, table_func_001B2D70_source64, table_func_001B2D70_base64
TABLE_STATE func_001B9370, table_func_001B9370_selector_shift, table_func_001B9370_selector_variant, table_func_001B9370_source16, table_func_001B9370_base16, table_func_001B9370_source64, table_func_001B9370_base64
TABLE_STATE func_001BF970, table_func_001BF970_selector_shift, table_func_001BF970_selector_variant, table_func_001BF970_source16, table_func_001BF970_base16, table_func_001BF970_source64, table_func_001BF970_base64

