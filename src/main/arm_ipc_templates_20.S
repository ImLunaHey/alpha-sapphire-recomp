.syntax unified
.arch armv6k
.arm

.macro IPC_HANDLE_FOUR_WORD_OUTPUT name, command
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, lr}
    mov r5, r1
    ldr r1, [sp, #16]
    mrc p15, 0, r4, c13, c0, 3
    ldr r12, .Lcommand\@
    str r12, [r4, #128]!
    str r1, [r4, #12]
    mov r1, #32
    str r1, [r4, #16]
    strd r2, r3, [r4, #4]
    ldr r0, [r0]
    svc #0x32
    ands r1, r0, #0x80000000
    bmi .Ldone\@
    ldr r0, [r4, #8]
    str r0, [r5]
    ldr r0, [r4, #4]
.Ldone\@:
    pop {r4, r5, r6, pc}
    .size \name, .-\name
.Lcommand\@:
    .word \command
    .global \command
.endm

.macro IPC_HANDLE_MIXED_STACK name, command
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, lr}
    ldr r1, [sp, #8]
    mrc p15, 0, r4, c13, c0, 3
    ldr r12, .Lcommand\@
    str r12, [r4, #128]!
    str r1, [r4, #12]
    strd r2, r3, [r4, #4]
    ldrh r1, [sp, #12]
    strh r1, [r4, #16]
    ldrb r1, [sp, #16]
    strb r1, [r4, #20]
    ldr r0, [r0]
    svc #0x32
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
    .size \name, .-\name
.Lcommand\@:
    .word \command
    .global \command
.endm

.macro IPC_GLOBAL_BYTE name, command, handle
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    mov r0, r0
    push {r0, r4, r5, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r0, .Lcommand\@
    str r0, [r4, #128]!
    ldrb r0, [sp]
    strb r0, [r4, #4]
    ldr r0, .Lhandle\@
    ldr r0, [r0]
    svc #0x32
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r3, r4, r5, pc}
    .size \name, .-\name
.Lcommand\@:
    .word \command
.Lhandle\@:
    .word \handle
    .global \command
    .global \handle
.endm

.macro IPC_HANDLE_TWO_REG_STACK name, command
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, lr}
    ldr r1, [sp, #8]
    mrc p15, 0, r4, c13, c0, 3
    ldr r12, .Lcommand\@
    str r12, [r4, #128]!
    str r1, [r4, #12]
    strd r2, r3, [r4, #4]
    ldr r0, [r0]
    svc #0x32
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
    .size \name, .-\name
.Lcommand\@:
    .word \command
    .global \command
.endm

.macro IPC_HANDLE_WORD_32 name, command
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r2, .Lcommand\@
    str r2, [r4, #128]!
    str r1, [r4, #4]
    mov r1, #32
    str r1, [r4, #8]
    ldr r0, [r0]
    svc #0x32
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
    .size \name, .-\name
.Lcommand\@:
    .word \command
    .global \command
.endm

.macro IPC_HANDLE_BYTE_OUTPUT name, command
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
    svc #0x32
    ands r1, r0, #0x80000000
    bmi .Ldone\@
    ldrb r0, [r4, #8]
    strb r0, [r5]
    ldr r0, [r4, #4]
.Ldone\@:
    pop {r4, r5, r6, pc}
    .size \name, .-\name
.Lcommand\@:
    .word \command
    .global \command
.endm

.macro IPC_INLINE_31_OUTPUT name
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, r5, r6, lr}
    mov r5, r1
    mrc p15, 0, r4, c13, c0, 3
    mov r1, #0x1f0000
    str r1, [r4, #128]!
    ldr r0, [r0]
    svc #0x32
    ands r1, r0, #0x80000000
    bmi .Ldone\@
    ldr r0, [r4, #12]
    str r0, [r5]
    ldr r0, [r4, #4]
.Ldone\@:
    pop {r4, r5, r6, pc}
    .size \name, .-\name
.endm

.macro IPC_INLINE_GLOBAL_43 name, handle
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    mov r0, #0x2b0000
    str r0, [r4, #128]!
    ldr r0, .Lhandle\@
    ldr r0, [r0]
    svc #0x32
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
    .size \name, .-\name
.Lhandle\@:
    .word \handle
    .global \handle
.endm

.macro IPC_HANDLE_TWO_WORD_STM name, command
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r1, .Lcommand\@
    add r4, r4, #128
    stm r4, {r1, r2, r3}
    ldr r0, [r0]
    svc #0x32
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
    .size \name, .-\name
.Lcommand\@:
    .word \command
    .global \command
.endm

.macro IPC_INLINE_GLOBAL_2 name, handle
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    mov r0, #0x20000
    str r0, [r4, #128]!
    ldr r0, .Lhandle\@
    ldr r0, [r0]
    svc #0x32
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
    .size \name, .-\name
.Lhandle\@:
    .word \handle
    .global \handle
.endm

.macro IPC_HANDLE_LITERAL_NO_INPUT name, command
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
    ldr r0, [r0]
    svc #0x32
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
    .size \name, .-\name
.Lcommand\@:
    .word \command
    .global \command
.endm

.macro IPC_INLINE_14_NO_INPUT name
    .section .text.\name,"ax",%progbits
    .balign 4
    .arm
    .global \name
    .type \name, %function
\name:
    push {r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    mov r1, #0xe0000
    str r1, [r4, #128]!
    ldr r0, [r0]
    svc #0x32
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, pc}
    .size \name, .-\name
.endm

IPC_HANDLE_FOUR_WORD_OUTPUT func_002E41E0, ipc_command_func_002E41E0
IPC_HANDLE_FOUR_WORD_OUTPUT func_002E42B0, ipc_command_func_002E42B0
IPC_HANDLE_MIXED_STACK func_0011A020, ipc_command_func_0011A020
IPC_HANDLE_MIXED_STACK func_0011A1B8, ipc_command_func_0011A020
IPC_GLOBAL_BYTE func_00202D34, ipc_command_func_00202D34, ipc_handle_slot_zeta
IPC_GLOBAL_BYTE func_00202F00, ipc_command_func_00202F00, ipc_handle_slot_zeta
IPC_HANDLE_TWO_REG_STACK func_0011A068, ipc_command_func_0011A068
IPC_HANDLE_TWO_REG_STACK func_001F73BC, ipc_command_func_001F73BC
IPC_HANDLE_WORD_32 func_0012408C, ipc_command_func_0012408C
IPC_HANDLE_WORD_32 func_002CCF14, ipc_command_func_002CCF14
IPC_HANDLE_BYTE_OUTPUT func_001F70F4, ipc_command_func_001F70F4
IPC_HANDLE_BYTE_OUTPUT func_001F712C, ipc_command_func_001F712C
IPC_INLINE_31_OUTPUT func_002C92B4
IPC_INLINE_31_OUTPUT func_002CAB20
IPC_INLINE_GLOBAL_43 func_00133E64, ipc_handle_slot_alpha
IPC_INLINE_GLOBAL_43 func_002C6450, ipc_handle_slot_gamma
IPC_HANDLE_TWO_WORD_STM func_001F6ED4, ipc_command_func_001F6ED4
IPC_HANDLE_TWO_WORD_STM func_001F77D0, ipc_command_func_001F77D0
IPC_INLINE_GLOBAL_2 func_001FB448, ipc_handle_slot_epsilon
IPC_INLINE_GLOBAL_2 func_00202CC8, ipc_handle_slot_zeta
IPC_HANDLE_LITERAL_NO_INPUT func_001F76C0, ipc_command_func_001F76C0
IPC_HANDLE_LITERAL_NO_INPUT func_001F78BC, ipc_command_func_001F78BC
IPC_INLINE_14_NO_INPUT func_002C9004
IPC_INLINE_14_NO_INPUT func_002CA870
