.syntax unified
.arm

/* Public CTR kernel service identifiers. */
.equ SVC_CONTROL_MEMORY,         0x01
.equ SVC_CREATE_THREAD,          0x08
.equ SVC_SLEEP_THREAD,           0x0A
.equ SVC_GET_THREAD_PRIORITY,    0x0B
.equ SVC_CREATE_MUTEX,           0x13
.equ SVC_CREATE_EVENT,           0x17
.equ SVC_CREATE_TIMER,           0x1A
.equ SVC_SET_TIMER,              0x1B
.equ SVC_CREATE_MEMORY_BLOCK,    0x1E
.equ SVC_CREATE_ADDRESS_ARBITER, 0x21
.equ SVC_ARBITRATE_ADDRESS,      0x22
.equ SVC_WAIT_SYNCHRONIZATION_N, 0x25
.equ SVC_GET_HANDLE_INFO,        0x29
.equ SVC_CONNECT_TO_PORT,        0x2D
.equ SVC_GET_PROCESS_ID,         0x35
.equ SVC_GET_THREAD_ID,          0x37
.equ SVC_GET_RESOURCE_LIMIT,     0x38
.equ SVC_BREAK,                  0x3C

.equ USER_BREAK_UNLOAD_RO,       4

.macro BEGIN_ARM_FUNCTION name
    .section .text.\name,"ax",%progbits
    .balign 4
    .global \name
    .type \name, %function
\name:
.endm

.macro END_ARM_FUNCTION name
    .size \name, .-\name
.endm

.macro SINGLE_OUTPUT name, service
    BEGIN_ARM_FUNCTION \name
    push {r0}
    svc \service
    ldr r2, [sp]
    str r1, [r2]
    add sp, sp, #4
    bx lr
    END_ARM_FUNCTION \name
.endm

SINGLE_OUTPUT func_00108808, SVC_GET_RESOURCE_LIMIT
SINGLE_OUTPUT func_0010E24C, SVC_CREATE_ADDRESS_ARBITER
SINGLE_OUTPUT func_00117830, SVC_CONNECT_TO_PORT
SINGLE_OUTPUT func_0011786C, SVC_CREATE_MUTEX
SINGLE_OUTPUT func_00123D48, SVC_GET_PROCESS_ID
SINGLE_OUTPUT func_00144D04, SVC_CREATE_EVENT
SINGLE_OUTPUT func_0017E30C, SVC_GET_THREAD_ID
SINGLE_OUTPUT func_0019BE80, SVC_CREATE_TIMER
SINGLE_OUTPUT func_0019BECC, SVC_GET_THREAD_PRIORITY

BEGIN_ARM_FUNCTION func_00117848
    push {r0, r4}
    ldr r0, [sp, #8]
    ldr r4, [sp, #12]
    svc SVC_CONTROL_MEMORY
    ldr r2, [sp]
    str r1, [r2]
    add sp, sp, #4
    pop {r4}
    bx lr
END_ARM_FUNCTION func_00117848

BEGIN_ARM_FUNCTION func_00117884
    push {r0, r4}
    ldr r0, [sp, #8]
    ldr r4, [sp, #12]
    svc SVC_CREATE_THREAD
    ldr r2, [sp]
    str r1, [r2]
    add sp, sp, #4
    pop {r4}
    bx lr
END_ARM_FUNCTION func_00117884

BEGIN_ARM_FUNCTION func_00123D60
    mov r0, #0
    mov r1, r0
    mov r0, r0
    svc SVC_SLEEP_THREAD
    bx lr
END_ARM_FUNCTION func_00123D60

BEGIN_ARM_FUNCTION func_00123D74
    push {r0, r4}
    ldr r0, [sp, #8]
    ldr r4, [sp, #12]
    svc SVC_WAIT_SYNCHRONIZATION_N
    ldr r2, [sp]
    str r1, [r2]
    add sp, sp, #4
    pop {r4}
    bx lr
END_ARM_FUNCTION func_00123D74

BEGIN_ARM_FUNCTION func_0015EB4C
    push {r4, r5}
    ldr r4, [sp, #8]
    ldr r5, [sp, #12]
    svc SVC_ARBITRATE_ADDRESS
    pop {r4, r5}
    bx lr
END_ARM_FUNCTION func_0015EB4C

BEGIN_ARM_FUNCTION func_0015EB64
    mov r2, r1
    mov r1, r0
    mov r0, #USER_BREAK_UNLOAD_RO
    mov r0, r0
    svc SVC_BREAK
    bx lr
END_ARM_FUNCTION func_0015EB64

BEGIN_ARM_FUNCTION func_00177EE4
    push {r0}
    ldr r0, [sp, #4]
    svc SVC_CREATE_MEMORY_BLOCK
    ldr r2, [sp]
    str r1, [r2]
    add sp, sp, #4
    bx lr
END_ARM_FUNCTION func_00177EE4

BEGIN_ARM_FUNCTION func_0019BEB0
    push {r0}
    svc SVC_GET_HANDLE_INFO
    ldr r3, [sp]
    str r1, [r3]
    str r2, [r3, #4]
    add sp, sp, #4
    bx lr
END_ARM_FUNCTION func_0019BEB0

BEGIN_ARM_FUNCTION func_0019BEE4
    str r4, [sp, #-4]!
    ldr r1, [sp, #4]
    ldr r4, [sp, #8]
    svc SVC_SET_TIMER
    ldr r4, [sp], #4
    bx lr
END_ARM_FUNCTION func_0019BEE4

/*
 * Each destination is deliberately supplied as a macro argument. The immediate
 * is the PC-relative delta to that named Thumb entry, including its state bit.
 */
.macro ARM_TO_THUMB name, destination, pc_delta
    BEGIN_ARM_FUNCTION \name
    add r12, pc, #\pc_delta
    bx r12
    END_ARM_FUNCTION \name
.endm

ARM_TO_THUMB func_001000E4, func_001000EC, 1
ARM_TO_THUMB func_001003E0, func_001003E8, 1
ARM_TO_THUMB func_00100B6C, func_00100B7E, 11
ARM_TO_THUMB func_003009EC, func_003009F4, 1

.macro ARM_RETURN_STUB name
    BEGIN_ARM_FUNCTION \name
    mov pc, lr
    END_ARM_FUNCTION \name
.endm

ARM_RETURN_STUB func_001B04B8
ARM_RETURN_STUB func_001B6AB8
ARM_RETURN_STUB func_001BD0B8

.section .note.GNU-stack,"",%progbits
