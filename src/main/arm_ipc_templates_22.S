.syntax unified
.arch armv6k
.arm

.macro FUNCTION_BEGIN name
    .section .text.\name, "ax", %progbits
    .balign 4
    .global \name
    .type \name, %function
\name:
.endm

.macro FUNCTION_END name
    .size \name, . - \name
.endm

.macro IPC_GLOBAL_TWELVE_WORD name, command, handle
    FUNCTION_BEGIN \name
    push {r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, lr}
    add r4, sp, #56
    ldm r4, {r5, r6, r7, r8, r9, r10}
    add r4, sp, #84
    ldm r4, {r11, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r12, .Lcommand\@
    mov r0, #0
    str r12, [r4, #128]!
    add r12, r4, #40
    str r5, [r4, #12]
    str r10, [r4, #32]
    strd r2, [r4, #4]
    strd r6, [r4, #16]
    strd r8, [r4, #24]
    ldrb r2, [sp, #80]
    strb r2, [r4, #36]
    strd r0, [r4, #48]
    ldr r0, .Lhandle\@
    stm r12, {r11, lr}
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldr r0, [sp]
    ldr r1, [r4, #8]
    str r1, [r0]
    ldr r0, [r4, #4]
.Lreturn\@:
    add sp, sp, #16
    pop {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.Lhandle\@:
    .word \handle
.endm

.macro IPC_INLINE_GLOBAL_SIX_OUTPUTS name, handle
    FUNCTION_BEGIN \name
    push {r4, r5, r6, r7, r8, r9, r10, lr}
    mov r5, r0
    add r0, sp, #32
    mov r6, r1
    ldm r0, {r9, r10}
    mov r7, r2
    mov r8, r3
    mrc p15, 0, r4, c13, c0, 3
    mov r0, #(10 << 16)
    str r0, [r4, #128]!
    ldr r0, .Lhandle\@
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldr r0, [r4, #12]
    str r0, [r5]
    ldr r0, [r4, #16]
    str r0, [r6]
    ldr r0, [r4, #20]
    str r0, [r7]
    ldr r0, [r4, #24]
    str r0, [r8]
    ldr r0, [r4, #28]
    str r0, [r9]
    ldr r0, [r4, #32]
    str r0, [r10]
    ldr r0, [r4, #4]
.Lreturn\@:
    pop {r4, r5, r6, r7, r8, r9, r10, pc}
    FUNCTION_END \name
.Lhandle\@:
    .word \handle
.endm

.macro IPC_GLOBAL_MAPPED_STATIC name, command, handle
    FUNCTION_BEGIN \name
    push {r4, r5, r6, r7, r8, r9, r10, lr}
    ldr r6, [sp, #36]
    ldr r12, [sp, #32]
    mrc p15, 0, r4, c13, c0, 3
    ldr r5, .Lcommand\@
    mov r9, #0
    str r5, [r4, #128]!
    add r7, r4, #4
    stm r7, {r0, r2, r12}
    mov r0, #1024
    orr r0, r0, r2, lsl #14
    orr r0, r0, #2
    strd r0, [r4, #16]
    mrc p15, 0, r0, c13, c0, 3
    add r5, r0, #384
    orr r0, r9, r12, lsl #14
    ldm r5, {r7, r8}
    orr r0, r0, #2
    stm r5, {r0, r3}
    ldr r0, .Lhandle\@
    ldr r0, [r0]
    svc #50
    stm r5, {r7, r8}
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldr r0, [r4, #8]
    str r0, [r6]
    ldr r0, [r4, #4]
.Lreturn\@:
    pop {r4, r5, r6, r7, r8, r9, r10, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.Lhandle\@:
    .word \handle
.endm

.macro IPC_STRUCTURED_MAPPED name, command
    FUNCTION_BEGIN \name
    push {r4, r5, r6, r7, r8, r9, r10, r11, r12, lr}
    ldr r12, [sp, #40]
    mrc p15, 0, r4, c13, c0, 3
    ldr r5, .Lcommand\@
    str r5, [r4, #128]!
    str r2, [r4, #4]
    ldm r3, {r5, r6, r7, r8, r9, r10, r11, lr}
    str r5, [r4, #8]
    add r5, r4, #12
    stm r5, {r6, r7, r8, r9, r10, r11, lr}
    add r5, r3, #32
    add r9, r4, #56
    ldr r3, [r3, #48]
    ldm r5, {r5, r6, r7, r8}
    stm r9, {r3, r12}
    add r9, r4, #40
    stm r9, {r5, r6, r7, r8}
    ldrb r3, [sp, #44]
    strb r3, [r4, #64]
    mov r3, #12
    orr r2, r3, r2, lsl #4
    str r1, [r4, #72]
    str r2, [r4, #68]
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.endm

.macro IPC_TWO_DESCRIPTOR_PAIRS name, command
    FUNCTION_BEGIN \name
    push {r4, r5, r6, r7, r8, r9, r10, lr}
    add r4, sp, #32
    mov r6, r1
    ldm r4, {r1, r5, r7, r8, r12}
    mrc p15, 0, r4, c13, c0, 3
    ldr r9, .Lcommand\@
    str r9, [r4, #128]!
    add r10, r4, #8
    str r2, [r4, #4]
    mov r2, #32
    str r2, [r4, #24]
    mov r2, #12288
    stm r10, {r1, r5, r8, r12}
    orr r2, r2, r1, lsl #14
    orr r2, r2, #2
    strd r2, [r4, #32]
    mov r2, #13312
    orr r2, r2, r12, lsl #14
    add r10, r4, #40
    orr r2, r2, #2
    stm r10, {r2, r7}
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldr r0, [r4, #8]
    str r0, [r6]
    ldr r0, [r4, #4]
.Lreturn\@:
    pop {r4, r5, r6, r7, r8, r9, r10, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.endm

.macro IPC_MIXED_STATIC name, command
    FUNCTION_BEGIN \name
    push {r4, r5, r6, r7, r8, r9, r10, r11, r12, lr}
    add r4, sp, #40
    mov r5, r1
    ldm r4, {r1, r6, r7, r12}
    add r4, sp, #56
    ldm r4, {r3, r8, r9}
    mrc p15, 0, r4, c13, c0, 3
    ldr r10, .Lcommand\@
    mov r11, #0
    str r10, [r4, #128]!
    add lr, r4, #8
    str r2, [r4, #4]
    stm lr, {r1, r6, r7}
    add lr, r4, #20
    orr r1, r11, r3, lsl #14
    stm lr, {r3, r8}
    add r10, r4, #32
    orr r1, r1, #2
    str r9, [r4, #28]
    stm r10, {r1, r12}
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldr r0, [r4, #12]
    str r0, [r5]
    ldr r0, [r4, #4]
.Lreturn\@:
    pop {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.endm

.macro IPC_STRUCTURE_HALFWORD name, command
    FUNCTION_BEGIN \name
    push {r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, lr}
    ldr r1, [sp, #56]
    mrc p15, 0, r4, c13, c0, 3
    ldr r5, .Lcommand\@
    mov r12, #0
    str r5, [r4, #128]!
    add lr, r4, #8
    str r3, [r4, #4]
    ldm r1, {r3, r5, r6, r7, r8, r9, r10, r11}
    stm lr, {r3, r5, r6, r7, r8, r9, r10, r11}
    ldr r3, [r1, #36]
    ldr r1, [r1, #32]
    str r1, [r4, #40]
    str r3, [r4, #44]
    ldrh r1, [sp, #60]
    strh r1, [r4, #48]
    str r2, [r4, #56]
    str r12, [r4, #52]
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldr r1, [sp, #4]
    ldr r0, [r4, #12]
    str r0, [r1]
    ldr r0, [r4, #4]
.Lreturn\@:
    add sp, sp, #16
    pop {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.endm

.macro IPC_SCALED_STATIC name, command
    FUNCTION_BEGIN \name
    push {r0, r1, r2, r3, r4, r5, r6, lr}
    add r4, sp, #32
    ldm r4, {r2, r3, r12}
    mrc p15, 0, r4, c13, c0, 3
    ldr r5, .Lcommand\@
    str r5, [r4, #128]!
    add r5, r4, #16
    str r1, [r4, #4]
    ldrh r1, [sp, #8]
    strh r1, [r4, #8]
    ldrb r1, [sp, #12]
    strb r1, [r4, #12]
    stm r5, {r3, r12}
    add r5, r4, #28
    ldrb r1, [sp, #44]
    strb r1, [r4, #24]
    lsl r1, r3, #2
    mov r3, #5120
    orr r1, r3, r1, lsl #14
    orr r1, r1, #2
    stm r5, {r1, r2}
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    add sp, sp, #16
    pop {r4, r5, r6, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.endm

IPC_GLOBAL_TWELVE_WORD func_001FC668, ipc_command_func_001FC668, ipc_handle_slot_kappa
IPC_INLINE_GLOBAL_SIX_OUTPUTS func_00125018, ipc_handle_slot_mu
IPC_GLOBAL_MAPPED_STATIC func_00126638, ipc_command_func_00126638, ipc_handle_slot_alpha
IPC_STRUCTURED_MAPPED func_002C56CC, ipc_command_func_002C56CC
IPC_TWO_DESCRIPTOR_PAIRS func_002E4038, ipc_command_func_002E4038
IPC_MIXED_STATIC func_001F7508, ipc_command_func_001F7508
IPC_STRUCTURE_HALFWORD func_002C58B0, ipc_command_func_002C58B0
IPC_SCALED_STATIC func_002C5AA0, ipc_command_func_002C5AA0
