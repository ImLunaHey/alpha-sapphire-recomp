.syntax unified
.arm
.fpu vfp

.extern arm_duplicate_templates_18_container_vtable_0053F3CC
.extern arm_duplicate_templates_18_container_vtable_0053F474
.extern arm_duplicate_templates_18_fallback_float
.extern arm_duplicate_templates_18_type_002FFE58
.extern arm_duplicate_templates_18_type_00304914
.extern arm_duplicate_templates_18_type_00306ECC
.extern arm_duplicate_templates_18_owner_type_002FC7E0
.extern arm_duplicate_templates_18_owner_type_002FDEC4
.extern arm_duplicate_templates_18_owner_type_003085A0
.extern arm_duplicate_templates_18_owner_type_00309AE0

.macro BEGIN_FUNCTION name
    .section .text.\name, "ax", %progbits
    .balign 4
    .global \name
    .type \name, %function
\name:
.endm

.macro END_FUNCTION name
    .size \name, . - \name
.endm

.macro VTABLE_CHAIN_CLEAR name, identity
    BEGIN_FUNCTION \name
    ldr r1, 99f
    str r1, [r0]
    ldr r1, [r0, #4]
    ldr r12, [r0, #12]
    cmp r1, r12
    bxeq lr
    push {r4, r5}
    mov r4, #0
1:
    ldrd r2, [r1, #4]
    cmp r3, #0
    strne r2, [r3, #4]
    cmp r2, #0
    str r4, [r1, #8]
    strne r3, [r2, #8]
    str r4, [r1, #4]
    ldr r5, [r0, #4]
    cmp r5, r1
    streq r2, [r0, #4]
    ldr r5, [r0, #8]
    cmp r5, r1
    streq r3, [r0, #8]
    ldr r1, [r0, #16]
    cmp r2, r12
    sub r1, r1, #1
    str r1, [r0, #16]
    mov r1, r2
    bne 1b
    pop {r4, r5}
    bx lr
    END_FUNCTION \name
99:
    .word \identity
.endm

.macro BACKWARD_CLEAR_RECYCLE name
    BEGIN_FUNCTION \name
    push {r4, r5, r6, r7, r8, lr}
    mov r4, r0
    ldr r6, [r0, #16]
    ldr r5, [r6]
    cmp r5, r6
    beq 2f
1:
    ldr r7, [r4, #16]
    cmp r5, r7
    beq 3f
    ldr r3, [r5, #4]
    ldr r7, [r5]
    add r1, r5, #8
    str r7, [r3]
    ldm r5, {r0, r2}
    str r2, [r0, #4]
    ldr r0, [r4, #20]
    sub r0, r0, #1
    str r0, [r4, #20]
    ldr r0, [r5, #8]
    ldr r2, [r0]
    mov r0, r1
    blx r2
    ldr r0, [r4, #4]
    str r0, [r5]
    str r5, [r4, #4]
3:
    cmp r7, r6
    mov r5, r7
    bne 1b
2:
    pop {r4, r5, r6, r7, r8, pc}
    END_FUNCTION \name
.endm

.macro FOUR_BIT_FLOAT name
    BEGIN_FUNCTION \name
    push {r4, r5, r6, r7}
    add r6, r0, #4
    mov r12, #0
    ldr r4, [r6]
    mov r2, #3
    mov r0, r12
    mov r1, r12
    mov r3, #4
    mov r5, #1
1:
    tst r4, r5, lsl r1
    beq 2f
    cmp r1, r2
    add r0, r0, #1
    moveq r12, #1
2:
    subs r3, r3, #1
    add r1, r1, #1
    bne 1b
    cmp r12, #0
    beq 3f
    cmp r0, #0
    beq 3f
    add r0, r6, r0, lsl #2
    vldr s0, [r0]
    pop {r4, r5, r6, r7}
    bx lr
3:
    pop {r4, r5, r6, r7}
    vldr s0, 99f
    bx lr
    END_FUNCTION \name
99:
    .word arm_duplicate_templates_18_fallback_float
.endm

.macro ALLOCATED_OBJECT_16 name, identity
    BEGIN_FUNCTION \name
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0]
    mov r5, r1
    mov r2, #4
    mov r1, #16
    ldr r3, [r0, #8]
    mov r0, r4
    blx r3
    cmp r0, #0
    beq 1f
    mov r1, #0
    str r4, [r0, #4]
    strb r1, [r0, #8]
    ldr r1, 99f
    str r1, [r0]
    str r5, [r0, #12]
1:
    pop {r4, r5, r6, pc}
    END_FUNCTION \name
99:
    .word \identity
.endm

.macro RANGE_MEMBERSHIP name
    BEGIN_FUNCTION \name
    ldrb r2, [r0, #4]
    cmp r2, #2
    beq 1f
    cmp r2, #3
    bne 3f
    b 4f
1:
    ldrh r0, [r0, #6]
    cmp r0, r1
    bne 3f
2:
    mov r0, #1
    bx lr
3:
    mov r0, #0
    bx lr
4:
    add r2, r0, #8
    ldr r0, [r0, #12]
    cmp r0, r2
    beq 3b
5:
    ldrh r12, [r0, #8]
    add r3, r0, #8
    cmp r12, r1
    ldrhls r12, [r3, #2]
    cmpls r1, r12
    bls 2b
    ldr r0, [r0, #4]
    cmp r0, r2
    bne 5b
    b 3b
    END_FUNCTION \name
.endm

.macro ALLOCATED_OWNER_PAIR name, identity
    BEGIN_FUNCTION \name
    push {r4, lr}
    mov r4, r0
    ldr r0, [r0]
    mov r2, #4
    mov r1, #8
    ldr r3, [r0, #8]
    mov r0, r4
    blx r3
    cmp r0, #0
    beq 1f
    ldr r1, 99f
    stm r0, {r1, r4}
1:
    pop {r4, pc}
    END_FUNCTION \name
99:
    .word \identity
.endm

VTABLE_CHAIN_CLEAR func_0053F3CC, arm_duplicate_templates_18_container_vtable_0053F3CC
VTABLE_CHAIN_CLEAR func_0053F474, arm_duplicate_templates_18_container_vtable_0053F474

BACKWARD_CLEAR_RECYCLE func_0056E634
BACKWARD_CLEAR_RECYCLE func_0056EAA0

FOUR_BIT_FLOAT func_0016B184
FOUR_BIT_FLOAT func_004C2084

ALLOCATED_OBJECT_16 func_002FFE58, arm_duplicate_templates_18_type_002FFE58
ALLOCATED_OBJECT_16 func_00304914, arm_duplicate_templates_18_type_00304914
ALLOCATED_OBJECT_16 func_00306ECC, arm_duplicate_templates_18_type_00306ECC

RANGE_MEMBERSHIP func_0056D118
RANGE_MEMBERSHIP func_0056D184

ALLOCATED_OWNER_PAIR func_002FC7E0, arm_duplicate_templates_18_owner_type_002FC7E0
ALLOCATED_OWNER_PAIR func_002FDEC4, arm_duplicate_templates_18_owner_type_002FDEC4
ALLOCATED_OWNER_PAIR func_003085A0, arm_duplicate_templates_18_owner_type_003085A0
ALLOCATED_OWNER_PAIR func_00309AE0, arm_duplicate_templates_18_owner_type_00309AE0

.section .note.GNU-stack, "", %progbits
