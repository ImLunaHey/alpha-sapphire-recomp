.syntax unified
.arm
.fpu vfpv3

.section .text.func_00180C80, "ax", %progbits
.balign 4
.global func_00180C80
.type func_00180C80, %function
func_00180C80:
    push {r4-r8, lr}
    mov r4, r1
    mov r5, r0
    add r6, r0, r4, lsl #4
    add r0, r6, #20
    vpush {d8}
    mov r7, r2
    ldrd r0, r1, [r0, #8]
    cmp r1, r0
    bge .L00180C80_normalized
    mov r1, r4
    mov r0, r5
    bl func_00187DEC
.L00180C80_normalized:
    vldr s16, .L00180C80_unit
    add r0, r6, #20
    mov r1, #0
    vmov s0, s16
    bl func_00182C60
    vmov s0, s16
    sxtb r0, r4
    mov r6, r0
    bl service_index_secondary_91
    add r0, r4, r4, lsl #1
    add r5, r5, r0, lsl #2
    ldr r0, [r5, #84]!
    cmp r0, #0
    bne .L00180C80_have_record
    ldr r1, .L00180C80_key
    mov r2, r4
    mov r0, r6
    bl service_record_acquire_secondary_92
.L00180C80_have_record:
    mov r0, r5
    add r1, r5, #4
    add r2, r7, #4
    bl func_0017A8E8
    vpop {d8}
    mov r0, #1
    pop {r4-r8, pc}
.size func_00180C80, .-func_00180C80
.L00180C80_unit:
    .word ipc_unit_scalar_54
.L00180C80_key:
    .word service_record_key_92

.section .text.func_00180D20, "ax", %progbits
.balign 4
.global func_00180D20
.type func_00180D20, %function
func_00180D20:
    push {r4-r6, lr}
    mov r4, r0
    ldr r0, [r1]
    mov r5, #1
    str r0, [r4, #108]
    ldrb r0, [r1, #4]
    strb r0, [r4, #112]
    ldr r0, [r1, #8]
    str r0, [r4, #116]
    add r0, r4, #172
    vldmia r2, {s0-s5}
    vstmia r0, {s0-s5}
    strb r5, [r4, #160]
    bl func_0017541C
    add r1, r4, #80
    bl service_subobject_init_secondary_92
    strb r5, [r4, #162]
    pop {r4-r6, pc}
.size func_00180D20, .-func_00180D20

.section .text.func_00180D68, "ax", %progbits
.balign 4
.global func_00180D68
.type func_00180D68, %function
func_00180D68:
    push {r4-r8, lr}
    mov r4, r0
    mov r5, r1
    ldrb r0, [r0, #12]
    mov r6, r2
    mov r7, #1
    cmp r0, #0
    beq .L00180D68_replace
    ldrb r0, [r4, #162]
    mov r8, #0
    strb r7, [r4, #15]
    cmp r0, #0
    beq .L00180D68_clear_stage
    bl func_0017541C
    add r1, r4, #80
    bl func_0018CCF4
    strb r8, [r4, #162]
.L00180D68_clear_stage:
    ldrb r0, [r4, #13]
    cmp r0, #0
    strbne r8, [r4, #13]
.L00180D68_replace:
    ldr r0, [r5]
    str r0, [r4, #108]
    ldrb r0, [r5, #4]
    strb r0, [r4, #112]
    ldr r0, [r5, #8]
    str r0, [r4, #116]
    ldr r0, [r6]
    str r0, [r4, #100]
    ldr r0, [r6, #4]
    str r0, [r4, #104]
    ldrb r1, [r6, #8]
    mov r0, #3
    strb r1, [r4, #95]
    strb r0, [r4, #160]
    strb r7, [r4, #12]
    bl func_001882A4
    add r1, r4, #68
    nop
    bl func_001882F8
    nop
    nop
    bl func_0017541C
    add r1, r4, #80
    nop
    bl service_subobject_init_secondary_92
    strb r7, [r4, #162]
    pop {r4-r8, pc}
.size func_00180D68, .-func_00180D68

.section .text.func_00180E3C, "ax", %progbits
.balign 4
.global func_00180E3C
.type func_00180E3C, %function
func_00180E3C:
    push {r4-r6, lr}
    mov r4, r0
    ldr r0, .L00180E3C_dispatch
    mov r5, #0
    mov r1, #1
    str r0, [r4]
    add r0, r4, #4
    str r5, [r4, #4]
    str r5, [r4, #8]
    bl func_00145D10
    strb r5, [r4, #12]
    strb r5, [r4, #13]
    strb r5, [r4, #14]
    vldr s1, .L00180E3C_unit
    strb r5, [r4, #15]
    strb r5, [r4, #16]
    vldr s0, .L00180E3C_zero
    vstr s1, [r4, #20]
    vstr s1, [r4, #24]
    vstr s0, [r4, #28]
    vstr s0, [r4, #32]
    add r0, r4, #20
    vstr s0, [r4, #36]
    mov r1, #255
    strb r5, [r4, #46]
    strb r1, [r0, #24]
    vstr s0, [r4, #40]
    vstr s0, [r4, #48]
    strb r5, [r4, #52]
    strb r5, [r4, #53]
    vstr s0, [r4, #56]
    vstr s0, [r4, #60]
    add r0, r4, #4
    bl func_0017048C
    mov r0, r4
    pop {r4-r6, pc}
.size func_00180E3C, .-func_00180E3C
.L00180E3C_dispatch:
    .word service_object_dispatch_92
.L00180E3C_unit:
    .word ipc_unit_scalar_54
.L00180E3C_zero:
    .word service_zero_scalar_51

.section .note.GNU-stack, "", %progbits
