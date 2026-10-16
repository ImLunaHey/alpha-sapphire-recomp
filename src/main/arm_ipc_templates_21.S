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

.macro IPC_FOUR_WORD_TWO_OUTPUTS_STATIC name, command
    FUNCTION_BEGIN \name
    push {r0-r12, lr}
    add r4, sp, #60
    ldm r4, {r5, r12}
    ldr r1, [sp, #68]
    ldr r6, [sp, #56]
    mrc p15, 0, r4, c13, c0, 3
    ldr r7, .Lcommand\@
    mov r11, #0
    str r7, [r4, #128]!
    add r7, r4, #8
    str r2, [r4, #4]
    ldr r2, [r6]
    stm r7, {r2, r5}
    add r7, r4, #16
    mov r2, #32
    stm r7, {r1, r2}
    mrc p15, 0, r2, c13, c0, 3
    add r5, r2, #384
    ldr r2, [r6]
    orr r1, r11, r1, lsl #14
    ldm r5, {r7, r8, r9, r10}
    orr r1, r1, #2
    orr r2, r11, r2, lsl #14
    add r11, r5, #8
    orr r2, r2, #2
    stm r11, {r1, r12}
    strd r2, [r5]
    ldr r0, [r0]
    svc #50
    stm r5, {r7, r8, r9, r10}
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldr r0, [sp, #4]
    ldr r1, [r4, #8]
    str r1, [r0]
    ldr r0, [r4, #12]
    str r0, [r6]
    ldr r0, [r4, #4]
.Lreturn\@:
    add sp, sp, #16
    pop {r4-r12, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.endm

.macro IPC_ELEVEN_WORD_TWO_STATIC name, command
    FUNCTION_BEGIN \name
    push {r0-r12, lr}
    add r4, sp, #64
    ldm r4, {r1, r10}
    add r4, sp, #72
    ldr r5, [sp, #60]
    ldm r4, {r6, r12}
    add r4, sp, #80
    ldr r9, [sp, #56]
    ldm r4, {r11, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r7, .Lcommand\@
    mov r8, #0
    str r7, [r4, #128]!
    add r7, r4, #20
    str r9, [r4, #12]
    str r1, [r4, #16]
    str r11, [r4, #28]
    strd r2, [r4, #4]
    mov r2, #2048
    stm r7, {r10, r12}
    orr r1, r2, r1, lsl #14
    add r7, r4, #36
    orr r1, r1, #2
    str lr, [r4, #32]
    stm r7, {r1, r5}
    orr r1, r8, r12, lsl #14
    add r7, r4, #44
    orr r1, r1, #2
    stm r7, {r1, r6}
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
    pop {r4-r12, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.endm

.macro IPC_STRUCTURED_MAPPED name, command
    FUNCTION_BEGIN \name
    push {r0-r12, lr}
    add r4, sp, #56
    ldm r4, {r0, r12}
    mrc p15, 0, r4, c13, c0, 3
    ldr r5, .Lcommand\@
    mov r2, #0
    str r5, [r4, #128]!
    str r3, [r4, #4]
    ldm r0, {r5, r6, r7, r8, r9, r10, r11, lr}
    str r5, [r4, #8]
    add r5, r4, #12
    stm r5, {r6, r7, r8, r9, r10, r11, lr}
    add r5, r0, #32
    add r9, r4, #56
    ldr r0, [r0, #48]
    ldm r5, {r5, r6, r7, r8}
    stm r9, {r0, r12}
    add r9, r4, #40
    stm r9, {r5, r6, r7, r8}
    ldrb r0, [sp, #64]
    strb r0, [r4, #64]
    str r1, [r4, #72]
    str r2, [r4, #68]
    ldr r0, [sp, #8]
    mov r1, #12
    orr r1, r1, r3, lsl #4
    str r0, [r4, #80]
    str r1, [r4, #76]
    ldr r0, [sp]
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    add sp, sp, #16
    pop {r4-r12, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.endm

.macro IPC_FOUR_MIXED_OUTPUTS_STATIC name, command
    FUNCTION_BEGIN \name
    push {r4-r10, lr}
    add r4, sp, #36
    mov r7, r3
    mov r5, r1
    mov r6, r2
    ldm r4, {r3, r12}
    ldr r1, [sp, #48]
    ldr r2, [sp, #44]
    ldr r8, [sp, #32]
    mrc p15, 0, r4, c13, c0, 3
    ldr r10, .Lcommand\@
    mov r9, #0
    str r10, [r4, #128]!
    str r1, [r4, #12]
    orr r1, r9, r1, lsl #14
    add r9, r4, #16
    orr r1, r1, #2
    stm r9, {r1, r2}
    add r9, r4, #4
    stm r9, {r3, r12}
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldr r0, [r4, #8]
    str r0, [r5]
    ldr r0, [r4, #12]
    str r0, [r6]
    ldr r0, [r4, #16]
    str r0, [r7]
    ldrb r0, [r4, #20]
    strb r0, [r8]
    ldr r0, [r4, #4]
.Lreturn\@:
    pop {r4-r10, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.endm

.macro IPC_SCALED_STATIC_BUFFER name, command
    FUNCTION_BEGIN \name
    push {r4-r8, lr}
    mov r6, r1
    ldr r5, [sp, #28]
    ldr r12, [sp, #24]
    mrc p15, 0, r4, c13, c0, 3
    add r4, r4, #128
    ldr r7, .Lcommand\@
    str r5, [r4, #8]
    mov r5, #32
    stm r4, {r7, r12}
    add r12, r12, r12, lsl #1
    str r5, [r4, #12]
    lsl r12, r12, #2
    mov r5, #10240
    orr r5, r5, r12, lsl #14
    orr r5, r5, #2
    str r2, [r4, #24]
    mov r1, #0
    str r5, [r4, #20]
    mrc p15, 0, r2, c13, c0, 3
    add r5, r2, #384
    orr r1, r1, r12, lsl #14
    ldm r5, {r7, r8}
    orr r1, r1, #2
    stm r5, {r1, r3}
    ldr r0, [r0]
    svc #50
    stm r5, {r7, r8}
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldr r0, [r4, #8]
    str r0, [r6]
    ldr r0, [r4, #4]
.Lreturn\@:
    pop {r4-r8, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.endm

.macro IPC_GLOBAL_STRUCT_MIXED name, command, handle
    FUNCTION_BEGIN \name
    push {r0-r4, lr}
    mrc p15, 0, r4, c13, c0, 3
    ldr r12, .Lcommand\@
    mov r3, #0
    str r12, [r4, #128]!
    str r1, [r4, #4]
    ldr r1, [r2]
    str r1, [r4, #8]
    ldr r1, [r2, #4]
    str r1, [r4, #12]
    ldr r1, [r2, #8]
    str r1, [r4, #16]
    ldr r1, [r2, #12]
    str r1, [r4, #20]
    ldr r1, [r2, #16]
    str r1, [r4, #24]
    ldrh r1, [r2, #20]
    strh r1, [r4, #28]
    ldrb r1, [sp, #12]
    strb r1, [r4, #32]
    ldrb r1, [sp, #24]
    strb r1, [r4, #36]
    str r0, [r4, #52]
    ldr r0, .Lhandle\@
    mov r1, #32
    str r1, [r4, #40]
    str r3, [r4, #48]
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    add sp, sp, #16
    pop {r4, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.Lhandle\@:
    .word \handle
.endm

.macro IPC_DUAL_STATIC_OUTPUT name, command
    FUNCTION_BEGIN \name
    push {r4-r8, lr}
    mov r5, r1
    ldr r1, [sp, #36]
    ldr r6, [sp, #32]
    ldr r7, [sp, #28]
    ldr r12, [sp, #24]
    mrc p15, 0, r4, c13, c0, 3
    ldr r8, .Lcommand\@
    str r8, [r4, #128]!
    add lr, r4, #4
    str r7, [r4, #12]
    stm lr, {r2, r12}
    add lr, r4, #16
    mov r2, #32
    stm lr, {r1, r2}
    mov r2, #2048
    orr r2, r2, r12, lsl #14
    orr r2, r2, #2
    strd r2, [r4, #28]
    mov r2, #1024
    orr r1, r2, r1, lsl #14
    add lr, r4, #36
    orr r1, r1, #2
    stm lr, {r1, r6}
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldr r0, [r4, #8]
    str r0, [r5]
    ldr r0, [r4, #4]
.Lreturn\@:
    pop {r4-r8, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.endm

.macro IPC_STATIC_MAPPED_OUTPUT name, command
    FUNCTION_BEGIN \name
    push {r4-r8, lr}
    mov r5, r1
    ldr r1, [sp, #36]
    ldr r6, [sp, #32]
    ldr r7, [sp, #28]
    ldr r12, [sp, #24]
    mrc p15, 0, r4, c13, c0, 3
    ldr r8, .Lcommand\@
    str r8, [r4, #128]!
    add lr, r4, #4
    str r7, [r4, #12]
    stm lr, {r2, r12}
    add lr, r4, #16
    mov r2, #32
    stm lr, {r1, r2}
    mov r2, #1024
    orr r1, r2, r1, lsl #14
    add lr, r4, #28
    orr r1, r1, #2
    stm lr, {r1, r6}
    mov r1, #10
    add lr, r4, #36
    orr r1, r1, r12, lsl #4
    stm lr, {r1, r3}
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    bmi .Lreturn\@
    ldr r0, [r4, #8]
    str r0, [r5]
    ldr r0, [r4, #4]
.Lreturn\@:
    pop {r4-r8, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.endm

.macro IPC_MAPPED_PRESERVED_STATIC name, command
    FUNCTION_BEGIN \name
    push {r4-r10, lr}
    mov r7, r1
    add r1, sp, #32
    ldm r1, {r5, r8}
    add r1, sp, #40
    ldm r1, {r6, r12}
    mrc p15, 0, r4, c13, c0, 3
    ldr r9, .Lcommand\@
    mov r1, #0
    str r9, [r4, #128]!
    add r10, r4, #4
    stm r10, {r2, r5, r8, r12}
    mov r2, #32
    str r2, [r4, #20]
    mov r2, #12
    orr r2, r2, r5, lsl #4
    strd r2, [r4, #28]
    mrc p15, 0, r2, c13, c0, 3
    add r5, r2, #384
    orr r1, r1, r12, lsl #14
    orr r1, r1, #2
    ldrd r8, [r5]
    stm r5, {r1, r6}
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    strd r8, [r5]
    bmi .Lreturn\@
    ldr r0, [r4, #8]
    str r0, [r7]
    ldr r0, [r4, #4]
.Lreturn\@:
    pop {r4-r10, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.endm

.macro IPC_GLOBAL_HELPER_STRUCTURE name, command, handle, helper
    FUNCTION_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r0
    mrc p15, 0, r4, c13, c0, 3
    ldr r0, .Lcommand\@
    add r4, r4, #128
    mov r6, #0
    strd r0, [r4]
    mov r1, r3
    ldr r3, [r2]
    add r0, r4, #20
    str r3, [r4, #8]
    ldr r3, [r2, #4]
    str r3, [r4, #12]
    ldrb r2, [r2, #8]
    strb r2, [r4, #16]
    bl \helper
    ldrb r0, [sp, #16]
    strb r0, [r4, #28]
    ldrb r0, [sp, #20]
    strb r0, [r4, #32]
    mov r0, #32
    str r0, [r4, #36]
    ldr r0, .Lhandle\@
    str r5, [r4, #48]
    str r6, [r4, #44]
    ldr r0, [r0]
    svc #50
    and r1, r0, #0x80000000
    cmp r1, #0
    ldrge r0, [r4, #4]
    pop {r4, r5, r6, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.Lhandle\@:
    .word \handle
.endm

.macro IPC_STATIC_TWO_OUTPUTS name, command
    FUNCTION_BEGIN \name
    push {r4-r10, lr}
    add r4, sp, #32
    mov r7, r1
    ldm r4, {r1, r6}
    mrc p15, 0, r4, c13, c0, 3
    ldr r5, .Lcommand\@
    mov r12, #0
    str r5, [r4, #128]!
    strd r2, [r4, #4]
    ldr r2, [r6]
    str r2, [r4, #12]
    mrc p15, 0, r2, c13, c0, 3
    add r5, r2, #384
    ldrd r8, [r5]
    ldr r2, [r6]
    str r1, [r5, #4]
    orr r2, r12, r2, lsl #14
    orr r2, r2, #2
    str r2, [r5]
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    strd r8, [r5]
    bmi .Lreturn\@
    ldr r0, [r4, #8]
    str r0, [r7]
    ldr r0, [r4, #12]
    str r0, [r6]
    ldr r0, [r4, #4]
.Lreturn\@:
    pop {r4-r10, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.endm

.macro IPC_MAPPED_STATIC_OUTPUT name, command
    FUNCTION_BEGIN \name
    push {r4-r10, lr}
    mov r7, r1
    add r1, sp, #32
    ldm r1, {r6, r12}
    mrc p15, 0, r4, c13, c0, 3
    ldr r5, .Lcommand\@
    mov r1, #0
    str r5, [r4, #128]!
    add r8, r4, #4
    mov r5, #3072
    stm r8, {r3, r12}
    orr r3, r5, r3, lsl #14
    orr r3, r3, #2
    str r2, [r4, #16]
    str r3, [r4, #12]
    mrc p15, 0, r2, c13, c0, 3
    add r5, r2, #384
    orr r1, r1, r12, lsl #14
    orr r1, r1, #2
    ldrd r8, [r5]
    stm r5, {r1, r6}
    ldr r0, [r0]
    svc #50
    ands r1, r0, #0x80000000
    strd r8, [r5]
    bmi .Lreturn\@
    ldr r0, [r4, #8]
    str r0, [r7]
    ldr r0, [r4, #4]
.Lreturn\@:
    pop {r4-r10, pc}
    FUNCTION_END \name
.Lcommand\@:
    .word \command
.endm

IPC_FOUR_WORD_TWO_OUTPUTS_STATIC func_002E3F94, ipc_command_func_001FFA8C
IPC_ELEVEN_WORD_TWO_STATIC func_001325A4, ipc_command_func_001325A4
IPC_STRUCTURED_MAPPED func_002C5B84, ipc_command_func_002C5B84
IPC_FOUR_MIXED_OUTPUTS_STATIC func_001F6F40, ipc_command_func_001F6F40
IPC_SCALED_STATIC_BUFFER func_002E4110, ipc_command_func_002E4110
IPC_GLOBAL_STRUCT_MIXED func_002E6BA0, ipc_command_func_002E6BA0, ipc_handle_slot_lambda
IPC_DUAL_STATIC_OUTPUT func_002E3F10, ipc_command_func_002E3F10
IPC_STATIC_MAPPED_OUTPUT func_002E422C, ipc_command_func_002E422C
IPC_MAPPED_PRESERVED_STATIC func_002E435C, ipc_command_func_002E435C
IPC_GLOBAL_HELPER_STRUCTURE func_002E6A88, ipc_command_func_002E6A88, ipc_handle_slot_lambda, func_0016C090
IPC_STATIC_TWO_OUTPUTS func_00174770, ipc_command_func_00174770
IPC_MAPPED_STATIC_OUTPUT func_00194D78, ipc_command_func_002C9190
