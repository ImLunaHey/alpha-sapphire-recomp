.syntax unified
.arch armv6k
.arm

.macro IPC_GLOBAL_ONE_WORD function, command, handle
.section .text.\function,"ax",%progbits
.balign 4
.arm
.global \function
.type \function, %function
\function:
    push {r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r1, .Lcommand\@
    str r1, [r4, #128]!
    str r0, [r4, #4]
    ldr r0, .Lhandle\@
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
.size \function, . - \function
.Lcommand\@:
    .word \command
.Lhandle\@:
    .word \handle
.global \command
.global \handle
.endm

.macro IPC_GLOBAL_SIX_MIXED function, command, handle
.section .text.\function,"ax",%progbits
.balign 4
.arm
.global \function
.type \function, %function
\function:
    push {r0, r1, r2, r3, r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr ip, .Lcommand\@
    mov r3, #0
    str ip, [r4, #128]!
    add lr, r4, #4
    stm lr, {r1, r2}
    ldrh r1, [sp, #12]
    strh r1, [r4, #12]
    ldrh r1, [sp, #24]
    strh r1, [r4, #16]
    str r0, [r4, #24]
    ldr r0, .Lhandle\@
    str r3, [r4, #20]
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    add sp, sp, #16
    pop {r4, pc}
.size \function, . - \function
.Lcommand\@:
    .word \command
.Lhandle\@:
    .word \handle
.global \command
.global \handle
.endm

.macro IPC_HANDLE_WORD_BYTE function, command
.section .text.\function,"ax",%progbits
.balign 4
.arm
.global \function
.type \function, %function
\function:
    push {r0, r1, r2, r3, r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r3, .Lcommand\@
    str r3, [r4, #128]!
    str r2, [r4, #4]
    ldrb r3, [sp, #12]
    strb r3, [r4, #8]
    mov r3, #10
    orr r2, r3, r2, lsl #4
    str r1, [r4, #16]
    str r2, [r4, #12]
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    add sp, sp, #16
    pop {r4, pc}
.size \function, . - \function
.Lcommand\@:
    .word \command
.global \command
.endm

.macro IPC_HANDLE_WORD function, command
.section .text.\function,"ax",%progbits
.balign 4
.arm
.global \function
.type \function, %function
\function:
    push {r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r3, .Lcommand\@
    str r3, [r4, #128]!
    mov r3, #10
    str r2, [r4, #4]
    orr r2, r3, r2, lsl #4
    str r1, [r4, #12]
    str r2, [r4, #8]
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
.size \function, . - \function
.Lcommand\@:
    .word \command
.global \command
.endm

.macro IPC_HANDLE_WORD_TWO_BYTES function, command
.section .text.\function,"ax",%progbits
.balign 4
.arm
.global \function
.type \function, %function
\function:
    push {r0, r1, r2, r3, r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r3, .Lcommand\@
    str r3, [r4, #128]!
    str r2, [r4, #4]
    ldrb r3, [sp, #12]
    strb r3, [r4, #8]
    ldrb r3, [sp, #24]
    strb r3, [r4, #12]
    mov r3, #10
    orr r2, r3, r2, lsl #4
    str r1, [r4, #20]
    str r2, [r4, #16]
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    add sp, sp, #16
    pop {r4, pc}
.size \function, . - \function
.Lcommand\@:
    .word \command
.global \command
.endm

IPC_GLOBAL_ONE_WORD func_00109CF4, ipc_command_func_002C63E4, ipc_handle_slot_alpha
IPC_GLOBAL_ONE_WORD func_0010F864, ipc_command_func_0010F864, ipc_handle_slot_delta
IPC_GLOBAL_ONE_WORD func_0011B9B8, ipc_command_func_0011B9B8, ipc_handle_slot_alpha
IPC_GLOBAL_ONE_WORD func_00133E94, ipc_command_func_00133E94, ipc_handle_slot_alpha
IPC_GLOBAL_ONE_WORD func_00133ECC, ipc_command_func_00133ECC, ipc_handle_slot_alpha
IPC_GLOBAL_ONE_WORD func_001651B8, ipc_command_func_001651B8, ipc_handle_slot_alpha
IPC_GLOBAL_ONE_WORD func_001FB580, ipc_command_func_00133E94, ipc_handle_slot_epsilon
IPC_GLOBAL_ONE_WORD func_00202E88, ipc_command_func_00202E88, ipc_handle_slot_zeta

IPC_GLOBAL_SIX_MIXED func_002C6140, ipc_command_func_002C6140, ipc_handle_slot_gamma
IPC_GLOBAL_SIX_MIXED func_002C619C, ipc_command_func_002C619C, ipc_handle_slot_gamma
IPC_GLOBAL_SIX_MIXED func_002C61F8, ipc_command_func_002C61F8, ipc_handle_slot_gamma
IPC_GLOBAL_SIX_MIXED func_002C6254, ipc_command_func_002C6254, ipc_handle_slot_gamma
IPC_GLOBAL_SIX_MIXED func_002C62EC, ipc_command_func_002C62EC, ipc_handle_slot_gamma

IPC_HANDLE_WORD_BYTE func_002C8DC4, ipc_command_func_002C8DC4
IPC_HANDLE_WORD_BYTE func_002C90EC, ipc_command_func_002C90EC
IPC_HANDLE_WORD_BYTE func_002C9190, ipc_command_func_002C9190
IPC_HANDLE_WORD_BYTE func_002CA630, ipc_command_func_002C8DC4
IPC_HANDLE_WORD_BYTE func_002CA958, ipc_command_func_002C90EC
IPC_HANDLE_WORD_BYTE func_002CA9FC, ipc_command_func_002C9190

IPC_HANDLE_WORD func_002C8D20, ipc_command_func_002C8D20
IPC_HANDLE_WORD func_002C9220, ipc_command_func_002C9220
IPC_HANDLE_WORD func_002C93A8, ipc_command_func_002C93A8
IPC_HANDLE_WORD func_002CA58C, ipc_command_func_002C8D20
IPC_HANDLE_WORD func_002CAA8C, ipc_command_func_002C9220
IPC_HANDLE_WORD func_002CABA0, ipc_command_func_002C93A8

IPC_HANDLE_WORD_TWO_BYTES func_002C8F10, ipc_command_func_002C8F10
IPC_HANDLE_WORD_TWO_BYTES func_002C93E8, ipc_command_func_002C93E8
IPC_HANDLE_WORD_TWO_BYTES func_002CA77C, ipc_command_func_002C8F10
IPC_HANDLE_WORD_TWO_BYTES func_002CABE0, ipc_command_func_002C93E8
