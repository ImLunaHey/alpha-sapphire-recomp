.syntax unified
.arch armv6k
.arm

.macro B f
 .section .text.\f,"ax",%progbits
 .balign 4
 .arm
 .global \f
 .type \f,%function
\f:
.endm

.macro EP1 f,p
 .size \f,.-\f
.Lpool_\f:
 .word \p
.endm

.macro EP2 f,p0,p1
 .size \f,.-\f
.Lpool_\f:
 .word \p0
 .word \p1
.endm

B func_00118300
push {r4,lr}
mrc p15,0,r4,c13,c0,3
ldr ip,.Lpool_func_00118300
str ip,[r4,#128]!
add lr,r4,#4
stm lr,{r1,r2,r3}
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP1 func_00118300,ipc_command_func_00118300

B func_001190E0
mov r0,r0
push {r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001190E0
str r1,[r4,#128]!
str r0,[r4,#4]
ldr r0,.Lpool_func_001190E0+4
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP2 func_001190E0,ipc_command_func_001190E0,ipc_handle_slot_xi

B func_00125E50
push {r0,r1,r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_00125E50
str r1,[r4,#128]!
ldrb r1,[sp,#4]
strb r1,[r4,#4]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
add sp,sp,#8
pop {r4,pc}
EP1 func_00125E50,ipc_command_func_00126808

B func_00126600
push {r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r2,.Lpool_func_00126600
str r2,[r4,#128]!
strd r0,[r4,#4]
ldr r0,.Lpool_func_00126600+4
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP2 func_00126600,ipc_command_func_00126600,ipc_handle_slot_alpha

B func_001266FC
push {r0,r1,r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001266FC
str r1,[r4,#128]!
str r0,[r4,#4]
ldrb r0,[sp,#4]
strb r0,[r4,#8]
ldr r0,.Lpool_func_001266FC+4
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
add sp,sp,#8
pop {r4,pc}
EP2 func_001266FC,ipc_command_func_001266FC,ipc_handle_slot_alpha

B func_001338B8
push {r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001338B8
add r4,r4,#128
stm r4,{r1,r2,r3}
mov r1,#32
str r1,[r4,#12]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP1 func_001338B8,ipc_command_func_001338B8

B func_00145FC0
mov r0,r0
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(4 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_00145FC0
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_00145FC0
ldrb r0,[r4,#8]
strb r0,[r5]
ldr r0,[r4,#4]
.Lret_00145FC0:
pop {r4,r5,r6,pc}
EP1 func_00145FC0,ipc_handle_slot_nu

B func_00160844
push {r4,r5,r6,lr}
mrc p15,0,r4,c13,c0,3
ldr r5,.Lpool_func_00160844
mov ip,#0
str r5,[r4,#128]!
add r6,r4,#4
str r1,[r4,#16]
stm r6,{r2,r3,ip}
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,r5,r6,pc}
EP1 func_00160844,ipc_command_func_00160844

B func_001709BC
push {r4,r5,r6,lr}
mov r5,r2
mrc p15,0,r4,c13,c0,3
ldr r2,.Lpool_func_001709BC
str r2,[r4,#128]!
str r1,[r4,#4]
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001709BC
ldr r0,[r4,#8]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_001709BC:
pop {r4,r5,r6,pc}
EP1 func_001709BC,ipc_command_func_001709BC

B func_00170C80
mov r0,r0
push {r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_00170C80
str r0,[r4,#128]!
mov r0,#32
str r0,[r4,#4]
ldr r0,.Lpool_func_00170C80+4
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP2 func_00170C80,ipc_command_func_00170C80,ipc_handle_slot_xi

B func_001F6F04
push {r4,r5,r6,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001F6F04
add r4,r4,#128
stm r4,{r1,r2,r3}
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001F6F04
ldrd r0,[r4,#8]
strd r0,[r5]
ldr r0,[r4,#4]
.Lret_001F6F04:
pop {r4,r5,r6,pc}
EP1 func_001F6F04,ipc_command_func_001F6F04

B func_001F72F4
push {r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r2,.Lpool_func_001F72F4
str r2,[r4,#128]!
ldrd r2,[r1]
ldr r1,[r1,#8]
str r1,[r4,#12]
strd r2,[r4,#4]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP1 func_001F72F4,ipc_command_func_001F72F4

B func_001F7330
push {r4,r5,r6,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001F7330
add r4,r4,#128
stm r4,{r1,r2,r3}
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001F7330
ldr r0,[r4,#8]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_001F7330:
pop {r4,r5,r6,pc}
EP1 func_001F7330,ipc_command_func_001F7330

B func_00202DFC
push {r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r3,.Lpool_func_00202DFC
mov r2,#0
str r3,[r4,#128]!
add ip,r4,#4
str r0,[r4,#12]
ldr r0,.Lpool_func_00202DFC+4
stm ip,{r1,r2}
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP2 func_00202DFC,ipc_command_func_00202DFC,ipc_handle_slot_zeta

B func_00202EC0
mov r0,r0
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(9 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_00202EC0
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_00202EC0
ldrb r0,[r4,#8]
strb r0,[r5]
ldr r0,[r4,#4]
.Lret_00202EC0:
pop {r4,r5,r6,pc}
EP1 func_00202EC0,ipc_handle_slot_zeta

B func_00203128
mov r0,r0
push {r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_00203128
str r1,[r4,#128]!
str r0,[r4,#4]
mov r0,#32
str r0,[r4,#8]
ldr r0,.Lpool_func_00203128+4
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP2 func_00203128,ipc_command_func_00202DFC,ipc_handle_slot_xi

B func_0020316C
mov r0,r0
push {r4,lr}
mrc p15,0,r4,c13,c0,3
mov r0,#(23 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_0020316C
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP1 func_0020316C,ipc_handle_slot_xi

B func_002C35DC
push {r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_002C35DC
str r1,[r4,#128]!
mov r1,#32
str r1,[r4,#4]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP1 func_002C35DC,ipc_command_func_0010986C

B func_002C55B4
push {r0,r1,r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_002C55B4
str r1,[r4,#128]!
ldrh r1,[sp,#4]
strh r1,[r4,#4]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
add sp,sp,#8
pop {r4,pc}
EP1 func_002C55B4,ipc_command_func_002C6104

B func_002C581C
push {r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r3,.Lpool_func_002C581C
str r3,[r4,#128]!
mov r3,#4096
str r2,[r4,#4]
orr r2,r3,r2,lsl #14
orr r2,r2,#2
str r1,[r4,#12]
str r2,[r4,#8]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP1 func_002C581C,ipc_command_func_002C581C

B func_002C596C
push {r0,r1,r2,r4,r5,lr}
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_002C596C
str r1,[r4,#128]!
ldrh r1,[sp,#4]
strh r1,[r4,#4]
ldrb r1,[sp,#8]
strb r1,[r4,#8]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
add sp,sp,#12
pop {r4,r5,pc}
EP1 func_002C596C,ipc_command_func_002C596C

B func_002CCFD0
push {r4,lr}
mrc p15,0,r4,c13,c0,3
ldr ip,.Lpool_func_002CCFD0
str ip,[r4,#128]!
add lr,r4,#4
stm lr,{r1,r3}
mov r1,#10
add lr,r4,#12
orr r1,r1,r3,lsl #4
stm lr,{r1,r2}
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP1 func_002CCFD0,ipc_command_func_002C8E54

B func_002DD9FC
push {r4,r5,r6,lr}
mov r5,r2
mrc p15,0,r4,c13,c0,3
ldr r2,.Lpool_func_002DD9FC
str r2,[r4,#128]!
strd r0,[r4,#4]
ldr r0,.Lpool_func_002DD9FC+4
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002DD9FC
ldrh r0,[r4,#8]
strh r0,[r5]
ldr r0,[r4,#4]
.Lret_002DD9FC:
pop {r4,r5,r6,pc}
EP2 func_002DD9FC,ipc_command_func_002DD9FC,ipc_handle_slot_alpha

B func_002E419C
push {r4,r5,r6,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_002E419C
add r4,r4,#128
stm r4,{r1,r2}
mov r1,#32
str r1,[r4,#8]
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002E419C
ldr r0,[r4,#8]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_002E419C:
pop {r4,r5,r6,pc}
EP1 func_002E419C,ipc_command_func_002E419C

B func_002E43E0
push {r4,r5,r6,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_002E43E0
add r4,r4,#128
stm r4,{r1,r2,r3}
mov r1,#32
str r1,[r4,#12]
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002E43E0
ldr r0,[r4,#8]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_002E43E0:
pop {r4,r5,r6,pc}
EP1 func_002E43E0,ipc_command_func_002C90EC

B func_002E68D4
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_002E68D4
add r4,r4,#128
strd r0,[r4]
ldr r0,.Lpool_func_002E68D4+4
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002E68D4
ldr r0,[r4,#8]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_002E68D4:
pop {r4,r5,r6,pc}
EP2 func_002E68D4,ipc_command_func_002E68D4,ipc_handle_slot_lambda

B func_002E6B0C
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_002E6B0C
add r4,r4,#128
strd r0,[r4]
ldr r0,.Lpool_func_002E6B0C+4
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002E6B0C
ldrd r0,[r4,#8]
strd r0,[r5]
ldr r0,[r4,#4]
.Lret_002E6B0C:
pop {r4,r5,r6,pc}
EP2 func_002E6B0C,ipc_command_func_002E6B0C,ipc_handle_slot_lambda
