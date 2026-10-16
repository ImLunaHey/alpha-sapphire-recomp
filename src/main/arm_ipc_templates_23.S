.syntax unified
.arch armv6k
.arm

.macro IPC_BEGIN function
    .section .text.\function,"ax",%progbits
    .balign 4
    .arm
    .global \function
    .type \function,%function
\function:
.endm

.macro IPC_END_ONE function, command
    .size \function,.-\function
.Lc_\function:
    .word \command
.endm

.macro IPC_END_TWO function, command, handle
    .size \function,.-\function
.Lc_\function:
    .word \command
.Lh_\function:
    .word \handle
.endm

IPC_BEGIN func_002C9334
    push {r4,r5,r6,r7,r8,r9,r10,lr}
    add r4,sp,#52
    ldm r4,{r1,r5,r6}
    add r4,sp,#40
    ldr r9,[sp,#32]
    ldm r4,{r7,r8,r12}
    mrc p15,0,r4,c13,c0,3
    ldr r10,.Lc_func_002C9334
    str r10,[r4,#128]!
    add lr,r4,#4
    str r1,[r4,#24]
    stm lr,{r2,r3,r9}
    mov r2,#12
    add lr,r4,#28
    orr r1,r2,r1,lsl #4
    stm lr,{r1,r12}
    add lr,r4,#16
    stm lr,{r7,r8}
    ldr r0,[r0]
    svc #50
    ands r1,r0,#0x80000000
    bmi 1f
    ldr r0,[r4,#8]
    str r0,[r5]
    ldr r0,[r4,#12]
    str r0,[r6]
    ldr r0,[r4,#4]
1:  pop {r4,r5,r6,r7,r8,r9,r10,pc}
IPC_END_ONE func_002C9334, ipc_command_func_002C9334

IPC_BEGIN func_001F152C
    push {r0,r1,r2,r4,r5,r6,r7,r8,r9,lr}
    mov r6,r0
    mrc p15,0,r4,c13,c0,3
    ldr r2,.Lc_func_001F152C
    mov r3,#32
    mov r0,#0
    str r2,[r4,#128]!
    ldrh r2,[sp,#8]
    strh r2,[r4,#4]
    str r3,[r4,#8]
    mrc p15,0,r3,c13,c0,3
    add r5,r3,#384
    orr r0,r0,r2,lsl #14
    ldm r5,{r7,r8}
    orr r0,r0,#2
    strd r0,[r5]
    ldr r0,.Lh_func_001F152C
    ldr r0,[r0]
    svc #50
    stm r5,{r7,r8}
    ands r1,r0,#0x80000000
    bmi 1f
    ldrb r0,[r4,#8]
    strb r0,[r6]
    ldr r0,[r4,#4]
1:  add sp,sp,#12
    pop {r4,r5,r6,r7,r8,r9,pc}
IPC_END_TWO func_001F152C, ipc_command_func_002C9220, ipc_handle_slot_iota

IPC_BEGIN func_00133DA4
    push {r0,r1,r2,r3,r4,r5,r6,r7,r8,lr}
    mov r5,r1
    mov r6,r2
    ldr r8,[sp,#40]
    mov r7,r3
    mrc p15,0,r4,c13,c0,3
    ldr r0,.Lc_func_00133DA4
    str r0,[r4,#128]!
    ldrb r0,[sp]
    strb r0,[r4,#4]
    ldr r0,.Lh_func_00133DA4
    ldr r0,[r0]
    svc #50
    ands r1,r0,#0x80000000
    bmi 1f
    ldrb r0,[r4,#8]
    strb r0,[r5]
    ldr r0,[r4,#12]
    str r0,[r6]
    ldr r0,[r4,#16]
    str r0,[r7]
    ldr r0,[r4,#20]
    str r0,[r8]
    ldr r0,[r4,#4]
1:  add sp,sp,#16
    pop {r4,r5,r6,r7,r8,pc}
IPC_END_TWO func_00133DA4, ipc_command_func_002C6104, ipc_handle_slot_alpha

IPC_BEGIN func_001F7030
    push {r4,r5,r6,r7,r8,lr}
    add r4,sp,#32
    ldm r4,{r1,r6,r12}
    ldr r5,[sp,#28]
    ldr r7,[sp,#24]
    mrc p15,0,r4,c13,c0,3
    ldr r8,.Lc_func_001F7030
    str r8,[r4,#128]!
    add lr,r4,#4
    stm lr,{r2,r3,r7}
    add lr,r4,#16
    mov r2,#10
    stm lr,{r1,r12}
    add lr,r4,#24
    orr r1,r2,r1,lsl #4
    stm lr,{r1,r5}
    mov r1,#12
    add lr,r4,#32
    orr r1,r1,r12,lsl #4
    stm lr,{r1,r6}
    ldr r0,[r0]
    svc #50
    and r1,r0,#0x80000000
    cmp r1,#0
    ldrge r0,[r4,#4]
    pop {r4,r5,r6,r7,r8,pc}
IPC_END_ONE func_001F7030, ipc_command_func_001F7030

IPC_BEGIN func_001F73F4
    push {r4,r5,r6,r7,r8,lr}
    mov r6,r1
    mov r7,r2
    ldr r2,[sp,#24]
    mov r5,r3
    mrc p15,0,r4,c13,c0,3
    ldr r1,.Lc_func_001F73F4
    str r1,[r4,#128]!
    ldm r2,{r1,r3}
    add r8,r4,#4
    ldr r2,[r2,#8]
    str r2,[r4,#12]
    stm r8,{r1,r3}
    ldr r0,[r0]
    svc #50
    ands r1,r0,#0x80000000
    bmi 1f
    ldrd r0,[r4,#8]
    strd r0,[r6]
    add r1,r4,#16
    ldrd r0,[r1]
    strd r0,[r7]
    ldr r0,[r4,#24]
    str r0,[r5]
    ldr r0,[r4,#4]
1:  pop {r4,r5,r6,r7,r8,pc}
IPC_END_ONE func_001F73F4, ipc_command_func_001F73F4

IPC_BEGIN func_002C5548
    push {r4,r5,r6,r7,r8,r9,r10,lr}
    add r4,sp,#32
    ldm r4,{r5,r8,r9}
    mrc p15,0,r4,c13,c0,3
    ldr r6,.Lc_func_002C5548
    mov r12,#0
    str r6,[r4,#128]!
    add r7,r4,#4
    stm r7,{r1,r3,r5}
    mrc p15,0,r1,c13,c0,3
    add r5,r1,#384
    orr r1,r12,r3,lsl #16
    orr r1,r1,#2
    ldrd r6,[r5]
    stm r5,{r1,r2}
    ldr r0,[r0]
    svc #50
    ands r1,r0,#0x80000000
    strd r6,[r5]
    bmi 1f
    ldr r0,[r4,#8]
    str r0,[r8]
    ldrh r0,[r4,#12]
    strh r0,[r9]
    ldr r0,[r4,#4]
1:  pop {r4,r5,r6,r7,r8,r9,r10,pc}
IPC_END_ONE func_002C5548, ipc_command_func_002C5548

IPC_BEGIN func_002C59AC
    push {r4,r5,r6,r7,r8,lr}
    ldr r12,[sp,#24]
    mrc p15,0,r4,c13,c0,3
    ldr r5,.Lc_func_002C59AC
    str r5,[r4,#128]!
    ldr r5,.La_func_002C59AC
    str r2,[r4,#8]
    add r6,r4,#20
    sub r2,r5,#162816
    str r5,[r4,#4]
    strd r2,[r4,#12]
    add r2,r2,#1024
    stm r6,{r2,r12}
    mrc p15,0,r2,c13,c0,3
    add r5,r2,#384
    ldr r2,.Ld_func_002C59AC
    ldrd r6,[r5]
    str r1,[r5,#4]
    str r2,[r5]
    ldr r0,[r0]
    svc #50
    and r1,r0,#0x80000000
    cmp r1,#0
    strd r6,[r5]
    ldrge r0,[r4,#4]
    pop {r4,r5,r6,r7,r8,pc}
    .size func_002C59AC,.-func_002C59AC
.Lc_func_002C59AC:
    .word ipc_command_func_002C59AC
.La_func_002C59AC:
    .word ipc_aux_func_002C59AC_word1
.Ld_func_002C59AC:
    .word ipc_aux_func_002C59AC_static_descriptor

IPC_BEGIN func_002CCB34
    push {r4,r5,r6,r7,r8,lr}
    add r4,sp,#24
    ldm r4,{r6,r12}
    ldr r5,[sp,#32]
    mrc p15,0,r4,c13,c0,3
    ldr r7,.Lc_func_002CCB34
    str r7,[r4,#128]!
    add r8,r4,#4
    stm r8,{r1,r3,r12}
    mov r1,#3072
    orr r1,r1,r3,lsl #14
    add r8,r4,#16
    orr r1,r1,#2
    stm r8,{r1,r2}
    mov r1,#12
    add r8,r4,#24
    orr r1,r1,r12,lsl #4
    stm r8,{r1,r6}
    ldr r0,[r0]
    svc #50
    ands r1,r0,#0x80000000
    bmi 1f
    ldr r0,[r4,#8]
    str r0,[r5]
    ldr r0,[r4,#4]
1:  pop {r4,r5,r6,r7,r8,pc}
IPC_END_ONE func_002CCB34, ipc_command_func_002CCB34

.section .note.GNU-stack,"",%progbits
