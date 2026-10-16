.syntax unified

.macro IPC_GLOBAL_STATIC_DESCRIPTOR name, command, handle
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r3, .Lcommand\@
    mov r2, #0
    str r3, [r4, #128]!
    str r1, [r4, #4]
    str r0, [r4, #12]
    ldr r0, .Lhandle\@
    orr r1, r2, r1, lsl #14
    orr r1, r1, #2
    str r1, [r4, #8]
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

.macro IPC_GLOBAL_BYTE_WORD_OUTPUT name, command, handle
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r0, r1, r4, r5, r6, lr}
    mov r5, r0
    mrc p15, 0, r4, c13, c0, 3
    ldr r0, .Lcommand\@
    str r0, [r4, #128]!
    ldrb r0, [sp, #4]
    strb r0, [r4, #4]
    ldr r0, .Lhandle\@
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldr r0, [r4, #12]
    str r0, [r5]
    ldr r0, [r4, #4]
.Lreturn\@:
    add sp, sp, #8
    pop {r4, r5, r6, pc}
    .size \name, . - \name
.Lcommand\@:
    .word \command
.Lhandle\@:
    .word \handle
    .global \command
    .global \handle
.endm

.macro IPC_INLINE_MIXED_OUTPUT name
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, lr}
    mov r5, r1
    mov r6, r2
    mrc p15, 0, r4, c13, c0, 3
    mov r1, #(48 << 16)
    str r1, [r4, #128]!
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldr r0, [r4, #8]
    str r0, [r5]
    ldrh r0, [r4, #12]
    strh r0, [r6]
    ldr r0, [r4, #4]
.Lreturn\@:
    pop {r4, r5, r6, pc}
    .size \name, . - \name
.endm

.macro IPC_HANDLE_FIXED_32 name, command
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
    str r2, [r4, #4]
    mov r2, #32
    str r1, [r4, #20]
    str r2, [r4, #8]
    str r3, [r4, #16]
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
    .size \name, . - \name
.Lcommand\@:
    .word \command
    .global \command
.endm

.macro IPC_GLOBAL_MAPPED_BUFFER name, command, handle
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r12, .Lcommand\@
    str r12, [r4, #128]!
    add lr, r4, #4
    stm lr, {r0, r2, r3}
    mov r0, #10
    orr r0, r0, r2, lsl #4
    strd r0, [r4, #16]
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

.macro IPC_HANDLE_BYTE_OUTPUT name, command
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r0, r1, r2, r4, r5, lr}
    mov r5, r1
    mrc p15, 0, r4, c13, c0, 3
    ldr r1, .Lcommand\@
    str r1, [r4, #128]!
    ldrb r1, [sp, #8]
    strb r1, [r4, #4]
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldr r0, [r4, #8]
    str r0, [r5]
    ldr r0, [r4, #4]
.Lreturn\@:
    add sp, sp, #12
    pop {r4, r5, pc}
    .size \name, . - \name
.Lcommand\@:
    .word \command
    .global \command
.endm

.macro IPC_HANDLE_HALFWORD_ZERO_WORD name, command
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r0, r1, r2, r4, r5, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r3, .Lcommand\@
    mov r1, #0
    str r3, [r4, #128]!
    ldrh r3, [sp, #4]
    strh r3, [r4, #4]
    add r3, r4, #8
    stm r3, {r1, r2}
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    add sp, sp, #12
    pop {r4, r5, pc}
    .size \name, . - \name
.Lcommand\@:
    .word \command
    .global \command
.endm

.macro IPC_INLINE_NO_INPUT name
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    mov r1, #(3 << 16)
    str r1, [r4, #128]!
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
    .size \name, . - \name
.endm

.macro IPC_GLOBAL_WORD_BYTE_OUTPUT name, command, handle
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
    str r0, [r4, #4]
    ldr r0, .Lhandle\@
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
.Lhandle\@:
    .word \handle
    .global \command
    .global \handle
.endm

.macro IPC_GLOBAL_FIVE_WORD name, command, handle
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
    str r0, [r4, #20]
    ldr r0, .Lhandle\@
    stm r6, {r1, r2, r3, r12}
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

.macro IPC_GLOBAL_WORD_32 name, command, handle
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r1, .Lcommand\@
    str r1, [r4, #128]!
    str r0, [r4, #4]
    mov r0, #32
    str r0, [r4, #8]
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

IPC_GLOBAL_STATIC_DESCRIPTOR func_0016516C, ipc_command_func_0016516C, ipc_handle_slot_alpha
IPC_GLOBAL_STATIC_DESCRIPTOR func_001FB6F8, ipc_command_func_001FB6F8, ipc_handle_slot_epsilon
IPC_GLOBAL_BYTE_WORD_OUTPUT func_002DEC1C, ipc_command_func_002C6104, ipc_handle_slot_beta
IPC_GLOBAL_BYTE_WORD_OUTPUT func_002DED28, ipc_command_func_002DED28, ipc_handle_slot_beta
IPC_INLINE_MIXED_OUTPUT func_00119FE0
IPC_INLINE_MIXED_OUTPUT func_0011A178
IPC_HANDLE_FIXED_32 func_00173EE4, ipc_command_func_00173EE4
IPC_HANDLE_FIXED_32 func_00174704, ipc_command_func_00173EE4
IPC_GLOBAL_MAPPED_BUFFER func_001FFAE8, ipc_command_func_001FFAE8, ipc_handle_slot_eta
IPC_GLOBAL_MAPPED_BUFFER func_002001B0, ipc_command_func_001FFAE8, ipc_handle_slot_theta
IPC_HANDLE_BYTE_OUTPUT func_002C8E10, ipc_command_func_002C8E10
IPC_HANDLE_BYTE_OUTPUT func_002CA67C, ipc_command_func_002C8E10
IPC_HANDLE_HALFWORD_ZERO_WORD func_002C91DC, ipc_command_func_002C91DC
IPC_HANDLE_HALFWORD_ZERO_WORD func_002CAA48, ipc_command_func_002C91DC
IPC_INLINE_NO_INPUT func_00119FB8
IPC_INLINE_NO_INPUT func_0011A150
IPC_INLINE_NO_INPUT func_002C5B5C
IPC_GLOBAL_WORD_BYTE_OUTPUT func_00126808, ipc_command_func_00126808, ipc_handle_slot_alpha
IPC_GLOBAL_WORD_BYTE_OUTPUT func_00133BCC, ipc_command_func_0010F864, ipc_handle_slot_alpha
IPC_GLOBAL_FIVE_WORD func_00132E48, ipc_command_func_00132E48, ipc_handle_slot_kappa
IPC_GLOBAL_FIVE_WORD func_00145DF8, ipc_command_func_00145DF8, ipc_handle_slot_kappa
IPC_GLOBAL_WORD_32 func_0011BAE8, ipc_command_func_0011BAE8, ipc_handle_slot_lambda
IPC_GLOBAL_WORD_32 func_001F162C, ipc_command_func_0016516C, ipc_handle_slot_iota
