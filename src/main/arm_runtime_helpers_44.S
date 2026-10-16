.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro BEGIN_FUNCTION name
    .section .text.\name, "ax", %progbits
    .balign 4
    .global \name
    .type \name, %function
\name:
.endm

.macro END_FUNCTION name
    .size \name, .-\name
.endm

.global runtime_stack_output_call_44
.type runtime_stack_output_call_44, %function
.global runtime_conditional_transfer_44
.type runtime_conditional_transfer_44, %function
.global runtime_double_transform_44
.type runtime_double_transform_44, %function
.global runtime_flagged_tail_44
.type runtime_flagged_tail_44, %function
.global runtime_conditional_release_44
.type runtime_conditional_release_44, %function
.global runtime_zero_count_tail_44
.type runtime_zero_count_tail_44, %function
.global runtime_zero_pair_tail_44
.type runtime_zero_pair_tail_44, %function
.global opaque_runtime_root_slot_44_a
.global opaque_runtime_root_slot_44_b

BEGIN_FUNCTION func_004EAE00
    ldrb r0,[r0,#338]
    cmp r0,#0
    movne r0,#1
    bx lr
END_FUNCTION func_004EAE00

BEGIN_FUNCTION func_004EAE18
    ldr r0,[r0]
    add r0,r0,#3824
    mov r0,r0
    ldrh r0,[r0,#228]
    bx lr
END_FUNCTION func_004EAE18

BEGIN_FUNCTION func_004F2BC8
    push {r3,lr}
    mov r1,sp
    bl runtime_stack_output_call_44
    pop {r3,pc}
END_FUNCTION func_004F2BC8

BEGIN_FUNCTION func_004F2C20
    mov r1,#0
    str r1,[r0]
    strb r1,[r0,#4]
    bx lr
END_FUNCTION func_004F2C20

BEGIN_FUNCTION func_004F2C40
    and r1,r1,#255
    orr r1,r1,r1,lsl #8
    orr r1,r1,r1,lsl #16
    str r1,[r0]
    strb r1,[r0,#4]
    bx lr
END_FUNCTION func_004F2C40

BEGIN_FUNCTION func_004F2C58
    and r1,r1,#255
    orr r1,r1,r1,lsl #8
    orr r1,r1,r1,lsl #16
    str r1,[r0]
    str r1,[r0,#4]
    bx lr
END_FUNCTION func_004F2C58

BEGIN_FUNCTION func_004F2C70
    ldrb r12,[lr,#-1]
    cmp r3,r12
    ldrbcs r3,[lr,r12]
    ldrbcc r3,[lr,r3]
    add r12,lr,r3,lsl #1
    bx r12
END_FUNCTION func_004F2C70

BEGIN_FUNCTION func_004F4F34
    cmp r2,#0
    mov r3,r1
    beq 1f
    mov r1,r0
    mov r0,r3
    b runtime_conditional_transfer_44
1:
    bx lr
END_FUNCTION func_004F4F34

BEGIN_FUNCTION func_00502E20
    cmp r0,#32
    bcs 1f
    ldr r1,.Lfunc_00502E20_slot
    ldr r1,[r1]
    add r0,r1,r0,lsl #2
    ldr r0,[r0,#2088]
    cmp r0,#0
    ldrne r0,[r0]
    bne 2f
1:
    mov r0,#0
2:
    bx lr
END_FUNCTION func_00502E20
.Lfunc_00502E20_slot:
    .word opaque_runtime_root_slot_44_a

BEGIN_FUNCTION func_00506E0C
    vmov d0,r0,r1
    push {r4,lr}
    bl runtime_double_transform_44
    vmov r0,r1,d0
    pop {r4,pc}
END_FUNCTION func_00506E0C

BEGIN_FUNCTION func_00509D48
    vmov d0,r0,r1
    sub sp,sp,#8
    vmov r0,s1
    vstr d0,[sp]
    bic r0,r0,#0x80000000
    str r0,[sp,#4]
    vldr d0,[sp]
    add sp,sp,#8
    vmov r0,r1,d0
    bx lr
END_FUNCTION func_00509D48

BEGIN_FUNCTION func_0050A61C
    sub r1,r0,#32768
    ldr r0,.Lfunc_0050A61C_slot
    sub r1,r1,#1216
    ldr r0,[r0]
    str r1,[r0,#88]
    bx lr
END_FUNCTION func_0050A61C
.Lfunc_0050A61C_slot:
    .word opaque_runtime_root_slot_44_b

BEGIN_FUNCTION func_0050BCB4
    mov r1,#1
    b runtime_flagged_tail_44
END_FUNCTION func_0050BCB4

BEGIN_FUNCTION func_0050DC38
    cmp r0,#0
    bxeq lr
    push {r4-r6,lr}
    mov r5,#0
    mov r4,r0
    str r5,[r0]
    bl runtime_conditional_release_44
    str r5,[r4,#4]
    str r5,[r4,#8]
    pop {r4-r6,pc}
END_FUNCTION func_0050DC38

BEGIN_FUNCTION func_0050DC60
    ldr r1,[r0,#8]
    subs r1,r1,#1
    str r1,[r0,#8]
    bne 1f
    mov r1,#0
    str r1,[r0,#4]
    b runtime_zero_count_tail_44
1:
    bx lr
END_FUNCTION func_0050DC60

BEGIN_FUNCTION func_0050DD10
    ldr r1,[r0,#8]
    ldr r0,[r0,#12]
    add r0,r0,r1
    bx lr
END_FUNCTION func_0050DD10

BEGIN_FUNCTION func_0050DD20
    cmp r0,#0
    beq 1f
    mov r1,#0
    str r1,[r0]
    str r1,[r0,#4]
    str r1,[r0,#8]
    str r1,[r0,#12]
    strb r1,[r0,#16]
1:
    bx lr
END_FUNCTION func_0050DD20

BEGIN_FUNCTION func_0050DD44
    mov r0,#0
    mov r1,r0
    b runtime_zero_pair_tail_44
END_FUNCTION func_0050DD44
