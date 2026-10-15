.syntax unified

.macro IPC_HANDLE_MAPPED_BYTE_IO name, command
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, lr}
    mov r5, r3
    mrc p15, 0, r4, c13, c0, 3
    ldr r3, .Lcommand\@
    str r3, [r4, #128]!
    str r2, [r4, #4]
    ldrb r3, [sp, #16]
    strb r3, [r4, #8]
    mov r3, #10
    orr r2, r3, r2, lsl #4
    str r1, [r4, #16]
    str r2, [r4, #12]
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldrb r0, [r4, #8]
    strb r0, [r5]
    ldr r0, [r4, #4]
.Lreturn\@:
    pop {r4, r5, r6, pc}
    .size \name, . - \name
.Lcommand\@:
    .word \command
    .global \command
.endm

.macro IPC_HANDLE_TWO_MAPPED name, command
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, lr}
    ldr r12, [sp, #16]
    mrc p15, 0, r4, c13, c0, 3
    ldr r5, .Lcommand\@
    str r5, [r4, #128]!
    add r6, r4, #4
    mov r5, #10
    stm r6, {r2, r12}
    orr r2, r5, r2, lsl #4
    str r1, [r4, #16]
    orr r1, r5, r12, lsl #4
    add r5, r4, #20
    str r2, [r4, #12]
    stm r5, {r1, r3}
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, r5, r6, pc}
    .size \name, . - \name
.Lcommand\@:
    .word \command
    .global \command
.endm

.macro IPC_HANDLE_BYTE_DESCRIPTOR name, command
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r0, r1, r2, r3, r4, lr}
    ldr r2, [sp, #24]
    mrc p15, 0, r4, c13, c0, 3
    ldr r12, .Lcommand\@
    str r12, [r4, #128]!
    add r12, r4, #16
    str r1, [r4, #4]
    ldrb r1, [sp, #8]
    strb r1, [r4, #8]
    mov r1, #12
    orr r1, r1, r2, lsl #4
    str r2, [r4, #12]
    stm r12, {r1, r3}
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    add sp, sp, #16
    pop {r4, pc}
    .size \name, . - \name
.Lcommand\@:
    .word \command
    .global \command
.endm

.macro IPC_GLOBAL_CONSTANT_32 name, command, handle
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r0, .Lcommand\@
    str r0, [r4, #128]!
    mov r0, #32
    str r0, [r4, #4]
    ldr r0, .Lhandle\@
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
    .size \name, . - \name
.Lcommand\@:
    .word \command
.Lhandle\@:
    .word \handle
    .global \command
    .global \handle
.endm

.macro IPC_HANDLE_NO_INPUT_OUTPUT name, command
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, lr}
    mov r5, r1
    mrc p15, 0, r4, c13, c0, 3
    ldr r1, .Lcommand\@
    str r1, [r4, #128]!
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldr r0, [r4, #8]
    str r0, [r5]
    ldr r0, [r4, #4]
.Lreturn\@:
    pop {r4, r5, r6, pc}
    .size \name, . - \name
.Lcommand\@:
    .word \command
    .global \command
.endm

.macro IPC_GLOBAL_HALFWORD name, command, handle
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r0, r4, r5, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r0, .Lcommand\@
    str r0, [r4, #128]!
    ldrh r0, [sp]
    strh r0, [r4, #4]
    ldr r0, .Lhandle\@
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r3, r4, r5, pc}
    .size \name, . - \name
.Lcommand\@:
    .word \command
.Lhandle\@:
    .word \handle
    .global \command
    .global \handle
.endm

.macro IPC_GLOBAL_STATIC_DESCRIPTOR_WORD name, command, handle
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r12, .Lcommand\@
    mov r3, #0
    str r12, [r4, #128]!
    add lr, r4, #4
    str r2, [r4, #12]
    stm lr, {r1, r3}
    orr r1, r3, r1, lsl #14
    str r0, [r4, #20]
    ldr r0, .Lhandle\@
    orr r1, r1, #2
    str r1, [r4, #16]
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
    .size \name, . - \name
.Lcommand\@:
    .word \command
.Lhandle\@:
    .word \handle
    .global \command
    .global \handle
.endm

.macro IPC_GLOBAL_SIX_STATIC_DESCRIPTOR name, command, handle
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r5, .Lcommand\@
    mov r12, #0
    str r5, [r4, #128]!
    add r6, r4, #4
    str r3, [r4, #16]
    stm r6, {r0, r2, r12}
    orr r0, r12, r2, lsl #14
    orr r0, r0, #2
    strd r0, [r4, #20]
    ldr r0, .Lhandle\@
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, r5, r6, pc}
    .size \name, . - \name
.Lcommand\@:
    .word \command
.Lhandle\@:
    .word \handle
    .global \command
    .global \handle
.endm

.macro IPC_GLOBAL_MAPPED_OUTPUT name, command, handle
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, lr}
    mov r5, r0
    mrc p15, 0, r4, c13, c0, 3
    ldr r0, .Lcommand\@
    add r4, r4, #128
    stm r4, {r0, r2}
    mov r0, #12
    orr r0, r0, r2, lsl #4
    strd r0, [r4, #8]
    ldr r0, .Lhandle\@
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldr r0, [r4, #8]
    str r0, [r5]
    ldr r0, [r4, #4]
.Lreturn\@:
    pop {r4, r5, r6, pc}
    .size \name, . - \name
.Lcommand\@:
    .word \command
.Lhandle\@:
    .word \handle
    .global \command
    .global \handle
.endm

.macro IPC_HANDLE_HALFWORD_MAPPED name, command
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r0, r1, r2, r3, r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r1, .Lcommand\@
    str r1, [r4, #128]!
    ldrh r1, [sp, #4]
    add r12, r4, #12
    strh r1, [r4, #4]
    mov r1, #10
    orr r1, r1, r3, lsl #4
    str r3, [r4, #8]
    stm r12, {r1, r2}
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    add sp, sp, #16
    pop {r4, pc}
    .size \name, . - \name
.Lcommand\@:
    .word \command
    .global \command
.endm

.macro IPC_HANDLE_MAPPED_BYTE_OUTPUT name, command
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, lr}
    mov r5, r3
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
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldrb r0, [r4, #8]
    strb r0, [r5]
    ldr r0, [r4, #4]
.Lreturn\@:
    pop {r4, r5, r6, pc}
    .size \name, . - \name
.Lcommand\@:
    .word \command
    .global \command
.endm

IPC_HANDLE_MAPPED_BYTE_IO func_002C8E54, ipc_command_func_002C8E54
IPC_HANDLE_MAPPED_BYTE_IO func_002CA6C0, ipc_command_func_002C8E54
IPC_HANDLE_TWO_MAPPED func_002C8FB0, ipc_command_func_002C8FB0
IPC_HANDLE_TWO_MAPPED func_002CA81C, ipc_command_func_002C8FB0
IPC_HANDLE_BYTE_DESCRIPTOR func_002C9260, ipc_command_func_002C9260
IPC_HANDLE_BYTE_DESCRIPTOR func_002CAACC, ipc_command_func_002C9260
IPC_GLOBAL_CONSTANT_32 func_0010986C, ipc_command_func_0010986C, ipc_handle_slot_delta
IPC_GLOBAL_CONSTANT_32 func_0015F350, ipc_command_func_0015F350, ipc_handle_slot_iota
IPC_GLOBAL_CONSTANT_32 func_001F15A0, ipc_command_func_001F15A0, ipc_handle_slot_iota
IPC_HANDLE_NO_INPUT_OUTPUT func_00160078, ipc_command_func_00160078
IPC_HANDLE_NO_INPUT_OUTPUT func_001F757C, ipc_command_func_001F757C
IPC_HANDLE_NO_INPUT_OUTPUT func_001F7800, ipc_command_func_001F7800
IPC_GLOBAL_HALFWORD func_002C62B0, ipc_command_func_002C62B0, ipc_handle_slot_gamma
IPC_GLOBAL_HALFWORD func_002C64F8, ipc_command_func_002C64F8, ipc_handle_slot_gamma
IPC_GLOBAL_HALFWORD func_002C6660, ipc_command_func_00109CB8, ipc_handle_slot_gamma
IPC_GLOBAL_STATIC_DESCRIPTOR_WORD func_00109C64, ipc_command_func_00109C64, ipc_handle_slot_alpha
IPC_GLOBAL_STATIC_DESCRIPTOR_WORD func_00133C68, ipc_command_func_00133C68, ipc_handle_slot_alpha
IPC_GLOBAL_SIX_STATIC_DESCRIPTOR func_00133E14, ipc_command_func_00133E14, ipc_handle_slot_alpha
IPC_GLOBAL_SIX_STATIC_DESCRIPTOR func_0016511C, ipc_command_func_0016511C, ipc_handle_slot_alpha
IPC_GLOBAL_MAPPED_OUTPUT func_001FF984, ipc_command_func_001FF984, ipc_handle_slot_eta
IPC_GLOBAL_MAPPED_OUTPUT func_0020004C, ipc_command_func_001FF984, ipc_handle_slot_theta
IPC_HANDLE_HALFWORD_MAPPED func_002C8F64, ipc_command_func_002C8F64
IPC_HANDLE_HALFWORD_MAPPED func_002CA7D0, ipc_command_func_002C8F64
IPC_HANDLE_MAPPED_BYTE_OUTPUT func_002C92E8, ipc_command_func_002C92E8
IPC_HANDLE_MAPPED_BYTE_OUTPUT func_002CAB54, ipc_command_func_002C92E8
