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

.macro IPC_END_ENTRY function
  .size \function,.-\function
.endm

.macro IPC_END_HANDLE function,handle
  .size \function,.-\function
.Lhandle_\function:
  .word \handle
  .global \handle
.endm

IPC_BEGIN func_00125E28
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r1,#(23 << 16)
  str r1,[r4,#128]!
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_ENTRY func_00125E28

IPC_BEGIN func_001644DC
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r1,#(57 << 16)
  str r1,[r4,#128]!
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_ENTRY func_001644DC

IPC_BEGIN func_00174748
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r1,#(25 << 16)
  str r1,[r4,#128]!
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_ENTRY func_00174748

IPC_BEGIN func_0017A618
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r1,#(12 << 16)
  str r1,[r4,#128]!
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_ENTRY func_0017A618

IPC_BEGIN func_0017A640
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r1,#(20 << 16)
  str r1,[r4,#128]!
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_ENTRY func_0017A640

IPC_BEGIN func_002C5640
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r1,#(8 << 16)
  str r1,[r4,#128]!
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_ENTRY func_002C5640

IPC_BEGIN func_002C5744
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r1,#(10 << 16)
  str r1,[r4,#128]!
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_ENTRY func_002C5744

IPC_BEGIN func_001FB3DC
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r0,#(9 << 16)
  str r0,[r4,#128]!
  ldr r0,.Lhandle_func_001FB3DC
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_HANDLE func_001FB3DC,ipc_handle_slot_epsilon

IPC_BEGIN func_001FB550
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r0,#(3 << 16)
  str r0,[r4,#128]!
  ldr r0,.Lhandle_func_001FB550
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_HANDLE func_001FB550,ipc_handle_slot_epsilon

IPC_BEGIN func_00202894
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r0,#(17 << 16)
  str r0,[r4,#128]!
  ldr r0,.Lhandle_func_00202894
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_HANDLE func_00202894,ipc_handle_slot_mu

IPC_BEGIN func_002028C4
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r0,#(18 << 16)
  str r0,[r4,#128]!
  ldr r0,.Lhandle_func_002028C4
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_HANDLE func_002028C4,ipc_handle_slot_mu

IPC_BEGIN func_00202D78
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r0,#(5 << 16)
  str r0,[r4,#128]!
  ldr r0,.Lhandle_func_00202D78
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_HANDLE func_00202D78,ipc_handle_slot_zeta

IPC_BEGIN func_002C6348
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r0,#(44 << 16)
  str r0,[r4,#128]!
  ldr r0,.Lhandle_func_002C6348
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_HANDLE func_002C6348,ipc_handle_slot_gamma

IPC_BEGIN func_002C63B4
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r0,#(39 << 16)
  str r0,[r4,#128]!
  ldr r0,.Lhandle_func_002C63B4
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_HANDLE func_002C63B4,ipc_handle_slot_gamma

IPC_BEGIN func_002C6420
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r0,#(38 << 16)
  str r0,[r4,#128]!
  ldr r0,.Lhandle_func_002C6420
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_HANDLE func_002C6420,ipc_handle_slot_gamma

IPC_BEGIN func_002DE8C0
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r0,#(58 << 16)
  str r0,[r4,#128]!
  ldr r0,.Lhandle_func_002DE8C0
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_HANDLE func_002DE8C0,ipc_handle_slot_beta

IPC_BEGIN func_002DE9C8
  push {r4,lr}
  mrc p15,0,r4,c13,c0,3
  mov r0,#(57 << 16)
  str r0,[r4,#128]!
  ldr r0,.Lhandle_func_002DE9C8
  ldr r0,[r0]
  svc #50
  and r1,r0,#0x80000000
  cmp r1,#0
  ldrge r0,[r4,#4]
  pop {r4,pc}
IPC_END_HANDLE func_002DE9C8,ipc_handle_slot_beta
