.syntax unified
.arch armv6k
.arm

.macro IPC_BEGIN function
  .section .text.\function,"ax",%progbits
  .balign 4
  .arm
  .global \function
  .type \function, %function
\function:
.endm

.macro IPC_END_ONE function, command
  .size \function, .-\function
.Lcommand_\function:
  .word \command
.endm

.macro IPC_END_HANDLE function, handle
  .size \function, .-\function
.Lhandle_\function:
  .word \handle
.endm

IPC_BEGIN func_00164EE4
  push {r4,r5,r6,lr}
  ldr r12,[sp,#16]
  mrc p15,0,r4,c13,c0,3
  ldr r6,.Lcommand_func_00164EE4
  mov r5,#0
  str r6,[r4,#128]!
  add lr,r4,#4
  stm lr,{r1,r12}
  orr r1,r5,r12,lsl #14
  add r5,r4,#12
  orr r1,r1,#2
  stm r5,{r1,r2}
  mov r1,#1024
  orr r1,r1,r12,lsl #14
  add r5,r4,#20
  orr r1,r1,#2
  stm r5,{r1,r3}
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,r5,r6,pc}
IPC_END_ONE func_00164EE4, ipc_command_func_00164EE4

IPC_BEGIN func_001F6E74
  push {r4,r5,r6,r7,r8,lr}
  mov r5,r1
  ldr r1,[sp,#28]
  ldr r12,[sp,#24]
  mrc p15,0,r4,c13,c0,3
  ldr r7,.Lcommand_func_001F6E74
  mov r6,#0
  str r7,[r4,#128]!
  str r1,[r4,#12]
  orr r1,r6,r1,lsl #14
  add r6,r4,#16
  orr r1,r1,#2
  stm r6,{r1,r12}
  strd r2,[r4,#4]
  ldr r0,[r0]
  svc #50
  ands r1,r0,#0x80000000
  bmi 1f
  add r1,r4,#8
  ldrd r0,[r1]
  strd r0,[r5]
  ldr r0,[r4,#4]
1:
  pop {r4,r5,r6,r7,r8,pc}
IPC_END_ONE func_001F6E74, ipc_command_func_001F6E74

IPC_BEGIN func_001F76EC
  push {r4,r5,r6,r7,r8,lr}
  add r4,sp,#28
  mov r5,r1
  ldm r4,{r1,r6}
  ldr r12,[sp,#24]
  mrc p15,0,r4,c13,c0,3
  ldr r7,.Lcommand_func_001F76EC
  str r7,[r4,#128]!
  add r7,r4,#20
  str r1,[r4,#12]
  strd r2,[r4,#4]
  mov r2,#10
  orr r1,r2,r1,lsl #4
  str r6,[r4,#16]
  stm r7,{r1,r12}
  ldr r0,[r0]
  svc #50
  ands r1,r0,#0x80000000
  bmi 1f
  ldr r0,[r4,#8]
  str r0,[r5]
  ldr r0,[r4,#4]
1:
  pop {r4,r5,r6,r7,r8,pc}
IPC_END_ONE func_001F76EC, ipc_command_func_001F76EC

IPC_BEGIN func_001FB610
  push {r4,r5,r6,r7,r8,lr}
  mov r5,r0
  mov r6,r1
  mov r7,r2
  mov r8,r3
  mrc p15,0,r4,c13,c0,3
  mov r0,#(22 << 16)
  str r0,[r4,#128]!
  ldr r0,.Lhandle_func_001FB610
  ldr r0,[r0]
  svc #50
  ands r1,r0,#0x80000000
  bmi 1f
  ldr r0,[r4,#8]
  str r0,[r5]
  ldr r0,[r4,#12]
  str r0,[r6]
  ldr r0,[r4,#16]
  str r0,[r7]
  ldr r0,[r4,#20]
  str r0,[r8]
  ldr r0,[r4,#4]
1:
  pop {r4,r5,r6,r7,r8,pc}
IPC_END_HANDLE func_001FB610, ipc_handle_slot_epsilon

IPC_BEGIN func_002C5668
  push {r0,r1,r2,r3,r4,r5,r6,lr}
  ldr r2,[sp,#32]
  mrc p15,0,r4,c13,c0,3
  ldr r5,.Lcommand_func_002C5668
  mov r12,#0
  str r5,[r4,#128]!
  ldrb r5,[sp,#8]
  add r6,r4,#8
  strb r5,[r4,#4]
  ldr r5,.Lauxiliary_func_002C5668
  str r1,[r4,#16]
  orr r1,r12,r2,lsl #14
  stm r6,{r2,r5}
  add r5,r4,#20
  orr r1,r1,#2
  stm r5,{r1,r3}
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  add sp,sp,#16
  pop {r4,r5,r6,pc}
  .size func_002C5668, .-func_002C5668
.Lcommand_func_002C5668:
  .word ipc_command_func_0016511C
.Lauxiliary_func_002C5668:
  .word ipc_aux_func_002C59AC_word1

IPC_BEGIN func_002C576C
  push {r4,r5,r6,r7,r8,lr}
  mov r6,r2
  mrc p15,0,r5,c13,c0,3
  ldr r12,.Lcommand_func_002C576C
  mov r2,#0
  str r12,[r5,#128]!
  str r3,[r5,#4]
  mrc p15,0,r12,c13,c0,3
  add r4,r12,#384
  orr r2,r2,r3,lsl #14
  ldm r4,{r7,r8}
  orr r2,r2,#2
  str r2,[r12,#384]!
  str r1,[r12,#4]
  ldr r0,[r0]
  svc #50
  stm r4,{r7,r8}
  ands r1,r0,#0x80000000
  bmi 1f
  ldr r0,[r5,#8]
  str r0,[r6]
  ldr r0,[r5,#4]
1:
  pop {r4,r5,r6,r7,r8,pc}
IPC_END_ONE func_002C576C, ipc_command_func_002C576C

IPC_BEGIN func_001747EC
  push {r4,r5,r6,r7,r8,lr}
  mov r6,r1
  mrc p15,0,r5,c13,c0,3
  ldr r12,.Lcommand_func_001747EC
  mov r1,#0
  str r12,[r5,#128]!
  str r3,[r5,#4]
  mrc p15,0,r12,c13,c0,3
  add r4,r12,#384
  orr r1,r1,r3,lsl #14
  ldm r4,{r7,r8}
  orr r1,r1,#2
  stm r4,{r1,r2}
  ldr r0,[r0]
  svc #50
  stm r4,{r7,r8}
  ands r1,r0,#0x80000000
  bmi 1f
  ldr r0,[r5,#8]
  str r0,[r6]
  ldr r0,[r5,#4]
1:
  pop {r4,r5,r6,r7,r8,pc}
IPC_END_ONE func_001747EC, ipc_command_func_001747EC

IPC_BEGIN func_001F6D38
  push {r4,r5,r6,r7,r8,r9,r10,r11,r12,lr}
  add r4,sp,#40
  ldm r4,{r5,r6,r7,r8,r9,r12}
  mrc p15,0,r4,c13,c0,3
  ldr r10,.Lcommand_func_001F6D38
  mov r11,#0
  str r10,[r4,#128]!
  add lr,r4,#4
  add r10,r4,#36
  stm lr,{r1,r2,r3,r5,r7}
  orr r1,r11,r7,lsl #14
  orr r1,r1,#2
  str r8,[r4,#24]
  stm r10,{r1,r6}
  add r10,r4,#28
  stm r10,{r9,r12}
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
IPC_END_ONE func_001F6D38, ipc_command_func_001F6D38
