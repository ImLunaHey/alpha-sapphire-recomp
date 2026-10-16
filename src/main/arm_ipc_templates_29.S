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

.macro E f
 .size \f,.-\f
.endm

.macro EP1 f,p0
 .size \f,.-\f
.Lpool_\f:
 .word \p0
.endm

.macro EP2 f,p0,p1
 .size \f,.-\f
.Lpool_\f:
 .word \p0
 .word \p1
.endm

.macro EP3 f,p0,p1,p2
 .size \f,.-\f
.Lpool_\f:
 .word \p0
 .word \p1
 .word \p2
.endm

B func_00110264
push {r4,r5,r6,lr}
mov r5,r2
mov r6,r3
mrc p15,0,r4,c13,c0,3
ldr r2,.Lpool_func_00110264
str r2,[r4,#128]!
strd r0,[r4,#4]
ldr r0,.Lpool_func_00110264+4
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_00110264
ldr r0,[r4,#12]
str r0,[r5]
ldr r0,[r4,#16]
str r0,[r6]
ldr r0,[r4,#4]
.Lret_00110264:
pop {r4,r5,r6,pc}
EP2 func_00110264,ipc_command_func_00110264,ipc_handle_slot_alpha

B func_001102B4
push {r4,r5,r6,r7,r8,lr}
mov r5,r0
mov r6,r2
mov r7,r3
mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_001102B4
add r4,r4,#128
strd r0,[r4]
ldr r0,.Lpool_func_001102B4+4
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001102B4
ldr r0,[r4,#8]
str r0,[r6]
ldr r0,[r4,#12]
str r0,[r7]
ldr r0,[r4,#20]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_001102B4:
pop {r4,r5,r6,r7,r8,pc}
EP2 func_001102B4,ipc_command_func_002C6378,ipc_handle_slot_alpha

B func_00110374
push {r0,r1,r2,r3,r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_00110374
str r0,[r4,#128]!
ldrb r0,[sp]
strb r0,[r4,#4]
strd r2,[r4,#8]
ldrb r0,[sp,#24]
strb r0,[r4,#16]
ldr r0,.Lpool_func_00110374+4
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
add sp,sp,#16
pop {r4,pc}
EP2 func_00110374,ipc_command_func_00110374,ipc_handle_slot_alpha

B func_00118594
push {r4,lr}
mrc p15,0,r4,c13,c0,3
ldr ip,.Lpool_func_00118594
mov r3,#0
str ip,[r4,#128]!
add lr,r4,#4
str r0,[r4,#16]
ldr r0,.Lpool_func_00118594+4
stm lr,{r1,r2,r3}
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP2 func_00118594,ipc_command_func_00118594,ipc_handle_slot_kappa

B func_0011BA30
push {r4,r5,r6,r7,r8,lr}
mrc p15,0,r5,c13,c0,3
mov r1,#(8 << 16)
str r1,[r5,#128]!
mrc p15,0,r1,c13,c0,3
add r4,r1,#384
ldr r1,.Lpool_func_0011BA30
ldrd r6,[r4]
str r0,[r4,#4]
ldr r0,.Lpool_func_0011BA30+4
str r1,[r4]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
strd r6,[r4]
ldrge r0,[r5,#4]
pop {r4,r5,r6,r7,r8,pc}
EP2 func_0011BA30,ipc_aux_func_0011BA30_tls_descriptor,ipc_handle_slot_lambda

B func_00124838
mov r0,r0
push {r4,r5,r6,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_00124838
str r1,[r4,#128]!
str r0,[r4,#4]
ldr r0,.Lpool_func_00124838+4
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_00124838
ldrd r0,[r4,#8]
strd r0,[r5]
ldr r0,[r4,#4]
.Lret_00124838:
pop {r4,r5,r6,pc}
EP2 func_00124838,ipc_command_func_002C63E4,ipc_handle_slot_nu

B func_00124880
mov r0,r0
push {r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r3,.Lpool_func_00124880
str r3,[r4,#128]!
add ip,r4,#4
stm ip,{r1,r2}
mov r2,#12
str r0,[r4,#16]
ldr r0,.Lpool_func_00124880+4
orr r1,r2,r1,lsl #4
str r1,[r4,#12]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP2 func_00124880,ipc_command_func_001338B8,ipc_handle_slot_nu

B func_00124FE0
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(1 << 16 | 32 << 6)
str r0,[r4,#128]!
add r0,r4,#4
mov r2,#128
bl func_00144D28
ldr r0,[r5]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,r5,r6,pc}
E func_00124FE0

B func_00125584
push {r4,lr}
mrc p15,0,r4,c13,c0,3
ldr ip,.Lpool_func_00125584
str ip,[r4,#128]!
add lr,r4,#4
stm lr,{r1,r2,r3}
mov r2,#12
str r0,[r4,#20]
ldr r0,.Lpool_func_00125584+4
orr r1,r2,r1,lsl #5
str r1,[r4,#16]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP2 func_00125584,ipc_command_func_002C8F10,ipc_handle_slot_omicron

B func_001266B4
push {r4,r5,r6,lr}
mov r5,r0
mov r6,r1
mrc p15,0,r4,c13,c0,3
mov r0,#(68 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_001266B4
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001266B4
ldr r0,[r4,#8]
str r0,[r6]
ldr r0,[r4,#16]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_001266B4:
pop {r4,r5,r6,pc}
EP1 func_001266B4,ipc_handle_slot_alpha

B func_00133918
push {r0,r1,r2,r4,r5,lr}
mrc p15,0,r4,c13,c0,3
ldr r3,.Lpool_func_00133918
mov r2,#0
str r3,[r4,#128]!
ldrb r3,[sp,#8]
strb r3,[r4,#4]
str r1,[r4,#12]
str r2,[r4,#8]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
add sp,sp,#12
pop {r4,r5,pc}
EP1 func_00133918,ipc_command_func_00133918

B func_00133C10
push {r4,r5,r6,r7,r8,lr}
add r4,sp,#24
ldm r4,{r5,ip}
mrc p15,0,r4,c13,c0,3
ldr r7,.Lpool_func_00133C10
mov r6,#0
str r7,[r4,#128]!
add r8,r4,#4
stm r8,{r0,r1,r2,r5,r6,ip}
orr r0,r6,r5,lsl #14
add r6,r4,#28
orr r0,r0,#2
stm r6,{r0,r3}
ldr r0,.Lpool_func_00133C10+4
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,r5,r6,r7,r8,pc}
EP2 func_00133C10,ipc_command_func_00133C10,ipc_handle_slot_alpha

B func_00133CBC
push {r0,r1,r2,r3,r4,r5,r6,lr}
ldr r5,[sp,#32]
mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_00133CBC
str r0,[r4,#128]!
ldrb r0,[sp]
strb r0,[r4,#4]
str r1,[r4,#8]
ldrb r0,[sp,#8]
strb r0,[r4,#12]
ldr r0,.Lpool_func_00133CBC+4
str r3,[r4,#16]
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_00133CBC
ldrb r0,[r4,#8]
strb r0,[r5]
ldr r0,[r4,#4]
.Lret_00133CBC:
add sp,sp,#16
pop {r4,r5,r6,pc}
EP2 func_00133CBC,ipc_command_func_00133CBC,ipc_handle_slot_alpha

B func_001342C8
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(5 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_001342C8
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001342C8
add r0,r4,#8
ldm r0,{r1,r2,r3}
ldr r0,[r4,#20]
str r0,[r5,#12]
stm r5,{r1,r2,r3}
ldr r0,[r4,#4]
.Lret_001342C8:
pop {r4,r5,r6,pc}
EP1 func_001342C8,ipc_handle_slot_lambda

B func_0015F308
push {r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r2,.Lpool_func_0015F308
mov r1,#0
str r2,[r4,#128]!
mov r2,#32
str r0,[r4,#16]
ldr r0,.Lpool_func_0015F308+4
str r1,[r4,#12]
str r2,[r4,#4]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP2 func_0015F308,ipc_command_func_0015F308,ipc_handle_slot_iota

B func_0016FF3C
push {r4,r5,r6,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_0016FF3C
str r1,[r4,#128]!
str r0,[r4,#4]
mov r0,#32
str r0,[r4,#8]
ldr r0,.Lpool_func_0016FF3C+4
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_0016FF3C
ldrb r0,[r4,#8]
strb r0,[r5]
ldr r0,[r4,#4]
.Lret_0016FF3C:
pop {r4,r5,r6,pc}
EP2 func_0016FF3C,ipc_command_func_0016FF3C,ipc_handle_slot_iota

B func_00174400
push {r4,r5,r6,r7,r8,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
mov r1,#(24 << 16)
str r1,[r4,#128]!
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_00174400
add r0,r4,#8
add r6,r4,#24
ldm r0,{r1,r2,r3,ip}
ldr r0,[r4,#36]
ldm r6,{r6,r7,r8}
str r0,[r5,#28]
stm r5,{r1,r2,r3,ip}
add r5,r5,#16
stm r5,{r6,r7,r8}
ldr r0,[r4,#4]
.Lret_00174400:
pop {r4,r5,r6,r7,r8,pc}
E func_00174400

B func_00174450
push {r4,r5,r6,lr}
mov r5,r3
ldr r6,[sp,#16]
mrc p15,0,r4,c13,c0,3
ldr ip,.Lpool_func_00174450
mov r3,#0
str ip,[r4,#128]!
str r1,[r4,#12]
strd r2,[r4,#4]
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_00174450
ldr r0,[r4,#8]
str r0,[r6]
ldr r0,[r4,#16]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_00174450:
pop {r4,r5,r6,pc}
EP1 func_00174450,ipc_command_func_00174450

B func_001F1474
push {r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r3,.Lpool_func_001F1474
mov r2,#0
str r3,[r4,#128]!
mov r3,#32
str r1,[r4,#16]
str r2,[r4,#12]
str r3,[r4,#4]
str r0,[r4,#24]
ldr r1,.Lpool_func_001F1474+4
ldr r0,.Lpool_func_001F1474+8
str r1,[r4,#20]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,pc}
EP3 func_001F1474,ipc_command_func_001F1474,ipc_aux_func_001F1474_static_descriptor,ipc_handle_slot_iota

B func_001F14CC
push {r4,r5,r6,r7,r8,lr}
mrc p15,0,r4,c13,c0,3
ldr r3,.Lpool_func_001F14CC
str r3,[r4,#128]!
str r2,[r4,#4]
ldr r2,.Lpool_func_001F14CC+4
str r0,[r4,#12]
str r2,[r4,#8]
mrc p15,0,r0,c13,c0,3
add r5,r0,#384
ldrd r6,[r5]
str r2,[r0,#384]!
str r1,[r0,#4]
ldr r0,.Lpool_func_001F14CC+8
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
strd r6,[r5]
ldrge r0,[r4,#4]
pop {r4,r5,r6,r7,r8,pc}
EP3 func_001F14CC,ipc_command_func_001F14CC,ipc_aux_func_001F16F8_static_descriptor,ipc_handle_slot_iota

B func_001F15DC
push {r4,r5,r6,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001F15DC
str r1,[r4,#128]!
ldr r1,.Lpool_func_001F15DC+4
str r0,[r4,#8]
ldr r0,.Lpool_func_001F15DC+8
str r1,[r4,#4]
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001F15DC
ldrb r0,[r4,#8]
strb r0,[r5]
ldr r0,[r4,#4]
.Lret_001F15DC:
pop {r4,r5,r6,pc}
EP3 func_001F15DC,ipc_command_func_001F15DC,ipc_aux_func_001F1474_static_descriptor,ipc_handle_slot_iota

B func_001F709C
push {r4,r5,r6,r7,r8,r9,sl,fp,ip,lr}
add r4,sp,#40
ldm r4,{r5,r6,r7,r8,r9,ip}
mrc p15,0,r4,c13,c0,3
ldr sl,.Lpool_func_001F709C
mov fp,#0
str sl,[r4,#128]!
add lr,r4,#4
add sl,r4,#40
stm lr,{r1,r2,r5,r6,r7,r8,r9,ip}
ldrb r1,[sp,#64]
strb r1,[r4,#36]
orr r1,fp,r5,lsl #14
orr r1,r1,#2
stm sl,{r1,r3}
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,r5,r6,r7,r8,r9,sl,fp,ip,pc}
EP1 func_001F709C,ipc_command_func_001F709C

B func_001F7164
push {r4,r5,r6,r7,r8,r9,sl,lr}
add r4,sp,#32
ldm r4,{r5,r6,r7,ip}
mrc p15,0,r4,c13,c0,3
ldr r9,.Lpool_func_001F7164
mov r8,#0
str r9,[r4,#128]!
add sl,r4,#4
stm sl,{r1,r2,r3,r5,r7}
orr r1,r8,r7,lsl #14
add r8,r4,#28
orr r1,r1,#2
str ip,[r4,#24]
stm r8,{r1,r6}
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,r5,r6,r7,r8,r9,sl,pc}
EP1 func_001F7164,ipc_command_func_001F7164

B func_001F7298
push {r4,r5,r6,r7,r8,r9,sl,lr}
add r4,sp,#32
ldm r4,{r5,r6,r7,ip}
mrc p15,0,r4,c13,c0,3
ldr r8,.Lpool_func_001F7298
str r8,[r4,#128]!
ldrd r8,[r1]
ldr r1,[r1,#8]
add sl,r4,#20
str r1,[r4,#12]
stm sl,{r2,r3,r5,r6,ip}
mov r1,#10
add sl,r4,#40
orr r1,r1,ip,lsl #4
stm sl,{r1,r7}
strd r8,[r4,#4]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,r5,r6,r7,r8,r9,sl,pc}
EP1 func_001F7298,ipc_command_func_001F7298
