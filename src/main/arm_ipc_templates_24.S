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

IPC_BEGIN func_002E3EA4
    push {r4,r5,r6,r7,r8,lr}
    mov r6,r1
    ldr r1,[sp,#24]
    mrc p15,0,r4,c13,c0,3
    ldr r5,.Lc_func_002E3EA4
    mov r12,#0
    str r5,[r4,#128]!
    add r7,r4,#8
    str r2,[r4,#4]
    mov r2,#32
    stm r7,{r1,r2}
    mrc p15,0,r2,c13,c0,3
    add r5,r2,#384
    orr r1,r12,r1,lsl #14
    ldm r5,{r7,r8}
    orr r1,r1,#2
    stm r5,{r1,r3}
    ldr r0,[r0]
    svc #50
    stm r5,{r7,r8}
    ands r1,r0,#0x80000000
    bmi 1f
    ldr r0,[r4,#8]
    str r0,[r6]
    ldr r0,[r4,#4]
1:
    pop {r4,r5,r6,r7,r8,pc}
IPC_END_ONE func_002E3EA4,ipc_command_func_002E3EA4

IPC_BEGIN func_00170954
    push {r4,r5,r6,r7,r8,lr}
    ldr r7,[sp,#28]
    mrc p15,0,r4,c13,c0,3
    ldr r5,.Lc_func_00170954
    mov r12,#0
    str r5,[r4,#128]!
    add r6,r4,#4
    stm r6,{r1,r2}
    ldrh r1,[sp,#24]
    strh r1,[r4,#12]
    mrc p15,0,r2,c13,c0,3
    add r5,r2,#384
    orr r1,r12,r1,lsl #14
    ldm r5,{r6,r8}
    orr r1,r1,#2
    stm r5,{r1,r3}
    ldr r0,[r0]
    svc #50
    stm r5,{r6,r8}
    ands r1,r0,#0x80000000
    bmi 1f
    ldrh r0,[r4,#8]
    strh r0,[r7]
    ldr r0,[r4,#4]
1:
    pop {r4,r5,r6,r7,r8,pc}
IPC_END_ONE func_00170954,ipc_command_func_00170954

IPC_BEGIN func_001F16F8
    push {r0,r1,r2,r3,r4,r5,r6,r7,r8,lr}
    mrc p15,0,r4,c13,c0,3
    ldr r2,.Lc_func_001F16F8
    str r2,[r4,#128]!
    ldrb r2,[sp,#8]
    strb r2,[r4,#4]
    ldrb r2,[sp,#12]
    strb r2,[r4,#8]
    ldr r2,.La_func_001F16F8
    str r0,[r4,#16]
    str r2,[r4,#12]
    mrc p15,0,r0,c13,c0,3
    add r5,r0,#384
    ldrd r6,[r5]
    str r2,[r0,#384]!
    str r1,[r0,#4]
    ldr r0,.Lh_func_001F16F8
    ldr r0,[r0]
    svc #50
    and r1,r0,#0x80000000
    cmp r1,#0
    strd r6,[r5]
    ldrge r0,[r4,#4]
    add sp,sp,#16
    pop {r4,r5,r6,r7,r8,pc}
    .size func_001F16F8,.-func_001F16F8
.Lc_func_001F16F8:
    .word ipc_command_func_001F16F8
.La_func_001F16F8:
    .word ipc_aux_func_001F16F8_static_descriptor
.Lh_func_001F16F8:
    .word ipc_handle_slot_iota

IPC_BEGIN func_002E3E3C
    push {r4,r5,r6,r7,r8,lr}
    add r4,sp,#24
    mov r5,r1
    ldm r4,{r1,r6,r12}
    mrc p15,0,r4,c13,c0,3
    ldr r7,.Lc_func_002E3E3C
    str r7,[r4,#128]!
    add r8,r4,#12
    strd r2,[r4,#4]
    mov r2,#32
    str r2,[r4,#20]
    mov r2,#9216
    stm r8,{r1,r12}
    orr r2,r2,r12,lsl #14
    add r8,r4,#28
    orr r2,r2,#2
    stm r8,{r2,r6}
    ldr r0,[r0]
    svc #50
    ands r1,r0,#0x80000000
    bmi 1f
    ldr r0,[r4,#8]
    str r0,[r5]
    ldr r0,[r4,#4]
1:
    pop {r4,r5,r6,r7,r8,pc}
IPC_END_ONE func_002E3E3C,ipc_command_func_001FF71C

IPC_BEGIN func_001F6FCC
    push {r4,r5,r6,r7,r8,lr}
    add r4,sp,#24
    mov r5,r1
    ldm r4,{r7,r12}
    ldr r1,[sp,#32]
    mrc p15,0,r4,c13,c0,3
    ldr r8,.Lc_func_001F6FCC
    mov r6,#0
    str r8,[r4,#128]!
    str r1,[r4,#16]
    orr r1,r6,r1,lsl #14
    add r6,r4,#20
    orr r1,r1,#2
    stm r6,{r1,r12}
    add r6,r4,#4
    stm r6,{r2,r3,r7}
    ldr r0,[r0]
    svc #50
    ands r1,r0,#0x80000000
    bmi 1f
    ldr r0,[r4,#12]
    str r0,[r5]
    ldr r0,[r4,#4]
1:
    pop {r4,r5,r6,r7,r8,pc}
IPC_END_ONE func_001F6FCC,ipc_command_func_001F6FCC

IPC_BEGIN func_002DE7D4
    push {r0,r1,r2,r3,r4,r5,r6,lr}
    mov r5,r0
    ldr r3,[sp,#32]
    mrc p15,0,r4,c13,c0,3
    ldr r12,.Lc_func_002DE7D4
    mov r0,#0
    str r12,[r4,#128]!
    str r2,[r4,#4]
    ldrb r2,[sp,#12]
    strb r2,[r4,#8]
    str r3,[r4,#12]
    ldrh r2,[sp,#36]
    strh r2,[r4,#16]
    strd r0,[r4,#20]
    ldr r0,.Lh_func_002DE7D4
    ldr r0,[r0]
    svc #50
    ands r1,r0,#0x80000000
    bmi 1f
    ldr r0,[r4,#12]
    str r0,[r5]
    ldr r0,[r4,#4]
1:
    add sp,sp,#16
    pop {r4,r5,r6,pc}
IPC_END_TWO func_002DE7D4,ipc_command_func_002DE7D4,ipc_handle_slot_beta

IPC_BEGIN func_00110310
    push {r4,r5,r6,lr}
    mrc p15,0,r4,c13,c0,3
    ldr r5,.Lc_func_00110310
    mov r12,#0
    str r5,[r4,#128]!
    add r6,r4,#4
    stm r6,{r1,r3}
    orr r1,r12,r1,lsl #14
    str r0,[r4,#16]
    mov r0,#2048
    orr r1,r1,#2
    orr r0,r0,r3,lsl #14
    add r6,r4,#20
    orr r0,r0,#2
    str r1,[r4,#12]
    stm r6,{r0,r2}
    ldr r0,.Lh_func_00110310
    ldr r0,[r0]
    svc #50
    and r1,r0,#0x80000000
    cmp r1,#0
    ldrge r0,[r4,#4]
    pop {r4,r5,r6,pc}
IPC_END_TWO func_00110310,ipc_command_func_00110310,ipc_handle_slot_alpha

IPC_BEGIN func_00132FE0
    push {r0,r1,r2,r3,r4,r5,r6,lr}
    ldr r5,[sp,#36]
    mrc p15,0,r4,c13,c0,3
    ldr r3,.Lc_func_00132FE0
    str r3,[r4,#128]!
    str r2,[r4,#4]
    ldrh r3,[sp,#12]
    strh r3,[r4,#8]
    ldrh r3,[sp,#32]
    strh r3,[r4,#12]
    mov r3,#10
    orr r2,r3,r2,lsl #4
    str r1,[r4,#20]
    str r2,[r4,#16]
    ldr r0,[r0]
    svc #50
    ands r1,r0,#0x80000000
    bmi 1f
    ldrb r0,[r4,#8]
    strb r0,[r5]
    ldr r0,[r4,#4]
1:
    add sp,sp,#16
    pop {r4,r5,r6,pc}
IPC_END_ONE func_00132FE0,ipc_command_func_00132FE0
