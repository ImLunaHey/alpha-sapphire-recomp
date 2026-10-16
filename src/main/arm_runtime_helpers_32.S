.syntax unified
.arch armv6k
.arm
.text

.global runtime_guard_enter_32
.type runtime_guard_enter_32, %function
.global runtime_guarded_operation_32
.type runtime_guarded_operation_32, %function
.global runtime_guard_leave_32
.type runtime_guard_leave_32, %function
.global runtime_aligned_word_forward_32
.type runtime_aligned_word_forward_32, %function
.global runtime_zero_arg_query_gamma_32
.type runtime_zero_arg_query_gamma_32, %function
.global runtime_resource_acquire_alpha_32
.type runtime_resource_acquire_alpha_32, %function
.global runtime_resource_acquire_beta_32
.type runtime_resource_acquire_beta_32, %function
.global runtime_sequence_begin_32
.type runtime_sequence_begin_32, %function
.global runtime_sequence_apply_32
.type runtime_sequence_apply_32, %function
.global runtime_sequence_finish_32
.type runtime_sequence_finish_32, %function
.global runtime_failure_raise_entry_31
.type runtime_failure_raise_entry_31, %function

.section .text.func_002DD8FC, "ax", %progbits
.balign 4
.global func_002DD8FC
.type func_002DD8FC, %function
func_002DD8FC:
    push {r3, r4, r5, lr}
    mov r5, sp
    mov r4, #276
    bl runtime_guard_enter_32
    mov r2, r5
    mov r1, #17
    mov r0, r4
    bl runtime_guarded_operation_32
    mov r4, r0
    bl runtime_guard_leave_32
    asr r0, r4, #31
    add r0, r0, #1
    pop {r3, r4, r5, pc}
.size func_002DD8FC, .-func_002DD8FC

.section .text.func_002DD9C4, "ax", %progbits
.balign 4
.global func_002DD9C4
.type func_002DD9C4, %function
func_002DD9C4:
    push {r4, lr}
    sub sp, sp, #16
    add lr, sp, #24
    mov r4, r2
    ldm lr, {r2, r12}
    add lr, sp, #8
    str r3, [sp]
    mov r3, r4
    stm lr, {r2, r12}
    mov r2, r1
    mov r1, #5
    bl runtime_aligned_word_forward_32
    add sp, sp, #16
    pop {r4, pc}
.size func_002DD9C4, .-func_002DD9C4

.section .text.func_002DDE18, "ax", %progbits
.balign 4
.global func_002DDE18
.type func_002DDE18, %function
func_002DDE18:
    push {r4, lr}
    bl runtime_zero_arg_query_gamma_32
    lsrs r0, r0, #31
    beq .Lreturn_success_002DDE18
    pop {r4, lr}
    b runtime_failure_raise_entry_31
.Lreturn_success_002DDE18:
    pop {r4, pc}
.size func_002DDE18, .-func_002DDE18

.section .text.func_002DE38C, "ax", %progbits
.balign 4
.global func_002DE38C
.type func_002DE38C, %function
func_002DE38C:
    push {r3, r4, r5, lr}
    mov r4, r0
    mov r5, #0
    mov r0, sp
    str r5, [sp]
    bl runtime_resource_acquire_alpha_32
    lsrs r0, r0, #31
    blne runtime_failure_raise_entry_31
    ldr r0, [r4]
    cmp r0, #0
    beq .Linstall_002DE38C
    svc #35
    str r5, [r4]
.Linstall_002DE38C:
    ldr r0, [sp]
    str r0, [r4]
    pop {r3, r4, r5, pc}
.size func_002DE38C, .-func_002DE38C

.section .text.func_002DE490, "ax", %progbits
.balign 4
.global func_002DE490
.type func_002DE490, %function
func_002DE490:
    push {r3, r4, r5, lr}
    mov r4, r0
    mov r5, #0
    mov r0, sp
    str r5, [sp]
    bl runtime_resource_acquire_beta_32
    lsrs r0, r0, #31
    blne runtime_failure_raise_entry_31
    ldr r0, [r4]
    cmp r0, #0
    beq .Linstall_002DE490
    svc #35
    str r5, [r4]
.Linstall_002DE490:
    ldr r0, [sp]
    str r0, [r4]
    pop {r3, r4, r5, pc}
.size func_002DE490, .-func_002DE490

.section .text.func_002E0B9C, "ax", %progbits
.balign 4
.global func_002E0B9C
.type func_002E0B9C, %function
func_002E0B9C:
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r5, r1
    bl runtime_sequence_begin_32
    lsrs r0, r0, #31
    blne runtime_failure_raise_entry_31
    mov r1, r5
    mov r0, r4
    bl runtime_sequence_apply_32
    lsrs r0, r0, #31
    blne runtime_failure_raise_entry_31
    bl runtime_sequence_finish_32
    lsrs r0, r0, #31
    beq .Lreturn_success_002E0B9C
    pop {r4, r5, r6, lr}
    b runtime_failure_raise_entry_31
.Lreturn_success_002E0B9C:
    pop {r4, r5, r6, pc}
.size func_002E0B9C, .-func_002E0B9C
