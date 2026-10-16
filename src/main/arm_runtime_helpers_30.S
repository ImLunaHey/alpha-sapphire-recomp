.syntax unified
.arch armv6k
.arm
.text

.global runtime_variadic_forward_alpha_30
.type runtime_variadic_forward_alpha_30, %function
.global runtime_variadic_forward_beta_30
.type runtime_variadic_forward_beta_30, %function
.global runtime_nonzero_dispatch_30
.type runtime_nonzero_dispatch_30, %function
.global runtime_stack_record_forward_30
.type runtime_stack_record_forward_30, %function

.section .text.func_002E6E14, "ax", %progbits
.balign 4
.global func_002E6E14
.type func_002E6E14, %function
func_002E6E14:
    mvn r1, #0
    str r1, [r0]
    bx lr
.size func_002E6E14, .-func_002E6E14

.section .text.func_002E6E40, "ax", %progbits
.balign 4
.global func_002E6E40
.type func_002E6E40, %function
func_002E6E40:
    mov r12, r2
    push {r0-r3}
    add r12, r12, #1
    push {r4, lr}
    cmp r1, r12
    ldr r2, [sp, #20]
    add r3, sp, #24
    movhi r1, r12
    blx runtime_variadic_forward_alpha_30
    pop {r4}
    ldr pc, [sp], #20
.size func_002E6E40, .-func_002E6E40

.section .text.func_002E6E8C, "ax", %progbits
.balign 4
.global func_002E6E8C
.type func_002E6E8C, %function
func_002E6E8C:
    push {r0-r3}
    mov r12, r2
    add r12, r12, #1
    push {r4, lr}
    cmp r1, r12
    ldr r2, [sp, #20]
    add r3, sp, #24
    movhi r1, r12
    blx runtime_variadic_forward_beta_30
    pop {r4}
    ldr pc, [sp], #20
.size func_002E6E8C, .-func_002E6E8C

.section .text.func_002E9A1C, "ax", %progbits
.balign 4
.global func_002E9A1C
.type func_002E9A1C, %function
func_002E9A1C:
    mov r0, r1
    mov r0, r0
    ldr r0, [r0, #76]
    cmp r0, #0
    beq .Lreturn_zero_002E9A1C
    b runtime_nonzero_dispatch_30
.Lreturn_zero_002E9A1C:
    bx lr
.size func_002E9A1C, .-func_002E9A1C

.section .text.func_002EDAEC, "ax", %progbits
.balign 4
.global func_002EDAEC
.type func_002EDAEC, %function
func_002EDAEC:
    push {lr}
    sub sp, sp, #20
    add r12, sp, #4
    mov r3, #0
    stm r12, {r1-r3}
    mov r2, r3
    str r3, [sp, #16]
    ldr r1, [r0]
    str r1, [sp]
    mov r1, r3
    bl runtime_stack_record_forward_30
    add sp, sp, #20
    pop {pc}
.size func_002EDAEC, .-func_002EDAEC
