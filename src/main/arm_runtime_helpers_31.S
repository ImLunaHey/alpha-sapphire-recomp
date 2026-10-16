.syntax unified
.arm

.section .text.func_002DDA5C, "ax", %progbits
.balign 4
.global func_002DDA5C
.type func_002DDA5C, %function
func_002DDA5C:
    mov r2, r1
    mov r1, r0
    push {r3, lr}
    mov r0, sp
    bl runtime_pair_out_query_31
    lsrs r0, r0, #31
    blne runtime_failure_raise_entry_31
    ldr r0, [sp]
    pop {r3, pc}
.size func_002DDA5C, . - func_002DDA5C

.section .text.func_002DDBAC, "ax", %progbits
.balign 4
.global func_002DDBAC
.type func_002DDBAC, %function
func_002DDBAC:
    push {r4, lr}
    bl runtime_zero_arg_query_alpha_31
    lsrs r0, r0, #31
    beq .Lfunc_002DDBAC_success
    pop {r4, lr}
    b runtime_failure_raise_entry_31
.Lfunc_002DDBAC_success:
    pop {r4, pc}
.size func_002DDBAC, . - func_002DDBAC

.section .text.func_002DDBC8, "ax", %progbits
.balign 4
.global func_002DDBC8
.type func_002DDBC8, %function
func_002DDBC8:
    push {r4, lr}
    bl runtime_zero_arg_query_beta_31
    lsrs r0, r0, #31
    beq .Lfunc_002DDBC8_success
    pop {r4, lr}
    b runtime_failure_raise_entry_31
.Lfunc_002DDBC8_success:
    pop {r4, pc}
.size func_002DDBC8, . - func_002DDBC8

.section .text.func_002DE3CC, "ax", %progbits
.balign 4
.global func_002DE3CC
.type func_002DE3CC, %function
func_002DE3CC:
    push {r3, lr}
    ldr r12, [sp, #8]
    str r12, [sp]
    bl runtime_five_arg_query_31
    lsrs r0, r0, #31
    beq .Lfunc_002DE3CC_success
    pop {r3, lr}
    b runtime_failure_raise_entry_31
.Lfunc_002DE3CC_success:
    pop {r3, pc}
.size func_002DE3CC, . - func_002DE3CC

.section .text.func_002DEEEC, "ax", %progbits
.balign 4
.global func_002DEEEC
.type func_002DEEEC, %function
func_002DEEEC:
    mov r1, r0
    push {r3, lr}
    mov r0, sp
    bl runtime_signed_byte_query_31
    lsrs r0, r0, #31
    blne runtime_failure_raise_entry_31
    ldrsb r0, [sp]
    pop {r3, pc}
.size func_002DEEEC, . - func_002DEEEC

.global runtime_pair_out_query_31
.type runtime_pair_out_query_31, %function
.global runtime_zero_arg_query_alpha_31
.type runtime_zero_arg_query_alpha_31, %function
.global runtime_zero_arg_query_beta_31
.type runtime_zero_arg_query_beta_31, %function
.global runtime_five_arg_query_31
.type runtime_five_arg_query_31, %function
.global runtime_signed_byte_query_31
.type runtime_signed_byte_query_31, %function
.global runtime_failure_raise_entry_31
.type runtime_failure_raise_entry_31, %function
