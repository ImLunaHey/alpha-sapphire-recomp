.syntax unified
.arch armv6k
.arm

.global runtime_failure_raise_entry_31
.type runtime_failure_raise_entry_31, %function

.global func_002DE630
.type func_002DE630, %function
.global func_002DE678
.type func_002DE678, %function
.global func_002DE744
.type func_002DE744, %function
.global func_002DE78C
.type func_002DE78C, %function
.global func_002DE83C
.type func_002DE83C, %function
.global func_002DE8F0
.type func_002DE8F0, %function
.global func_002DE938
.type func_002DE938, %function
.global func_002DE980
.type func_002DE980, %function
.global func_002DEB2C
.type func_002DEB2C, %function
.global func_002DEB74
.type func_002DEB74, %function

.global runtime_retry_exhausted_status_33
.global service_query_accepted_status_31

.macro RETRY_WRAPPER function, operation
.section .text.\function, "ax", %progbits
.balign 4
.arm
.global \function
.type \function, %function
\function:
    push {r4, r5, r6, r7, r8, r9, r10, lr}
    mov r4, #0
    mov r8, r0
    mov r9, r1
    ldr r5, .Lpool_\function
    ldr r6, .Lpool_\function+4
    add r7, r5, #1020
.Lretry_\function:
    mov r1, r9
    mov r0, r8
    bl \operation
    ands r1, r0, #0x80000000
    mov r2, r0
    bpl .Lnonnegative_\function
    cmp r0, r6
    beq .Lreturn_\function
    and r1, r0, #0x3fc00
    cmp r1, #0x2c00
    beq .Lnext_\function
    cmp r0, r7
    beq .Lexhausted_\function
    lsrs r0, r2, #31
    blne runtime_failure_raise_entry_31
.Lnext_\function:
    add r4, r4, #1
    cmp r4, #2
    blt .Lretry_\function
    b .Lexhausted_\function
.Lnonnegative_\function:
    cmp r4, #2
    movlt r0, #0
    blt .Lreturn_\function
.Lexhausted_\function:
    mov r0, r5
.Lreturn_\function:
    pop {r4, r5, r6, r7, r8, r9, r10, pc}
.size \function, .-\function
.Lpool_\function:
    .word runtime_retry_exhausted_status_33
    .word service_query_accepted_status_31
.endm

RETRY_WRAPPER func_002DDAA4, func_002DE630
RETRY_WRAPPER func_002DDB28, func_002DE678
RETRY_WRAPPER func_002DDC20, func_002DE744
RETRY_WRAPPER func_002DDCA4, func_002DE78C
RETRY_WRAPPER func_002DDD94, func_002DE83C
RETRY_WRAPPER func_002DDFA8, func_002DE8F0
RETRY_WRAPPER func_002DE02C, func_002DE938
RETRY_WRAPPER func_002DE0B0, func_002DE980
RETRY_WRAPPER func_002DE1E4, func_002DEB2C
RETRY_WRAPPER func_002DE268, func_002DEB74
