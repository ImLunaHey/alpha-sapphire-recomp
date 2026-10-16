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

B func_001F736C
push {r0,r1,r2,r4,r5,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001F736C
str r1,[r4,#128]!
ldrb r1,[sp,#8]
strb r1,[r4,#4]
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001F736C
add r0,r4,#8
ldm r0,{r1,r2,r3}
ldr r0,[r4,#20]
str r0,[r5,#12]
stm r5,{r1,r2,r3}
ldr r0,[r4,#4]
.Lret_001F736C:
add sp,sp,#12
pop {r4,r5,pc}
EP1 func_001F736C,ipc_command_func_001F736C

B func_001F74B0
push {r4,r5,r6,r7,r8,lr}
mov r6,r2
mov r5,r1
ldr r2,[sp,#24]
mov r7,r3
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001F74B0
add r4,r4,#128
stm r4,{r1,r2}
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001F74B0
ldrb r0,[r4,#8]
strb r0,[r5]
ldrb r0,[r4,#12]
strb r0,[r6]
ldrd r0,[r4,#16]
strd r0,[r7]
ldr r0,[r4,#4]
.Lret_001F74B0:
pop {r4,r5,r6,r7,r8,pc}
EP1 func_001F74B0,ipc_command_func_001F74B0

B func_001F75B4
push {r4,r5,r6,lr}
add r4,sp,#16
mov r5,r1
ldm r4,{r1,ip}
mrc p15,0,r4,c13,c0,3
ldr r6,.Lpool_func_001F75B4
str r6,[r4,#128]!
add lr,r4,#12
stm lr,{r1,ip}
strd r2,[r4,#4]
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001F75B4
ldr r0,[r4,#12]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_001F75B4:
pop {r4,r5,r6,pc}
EP1 func_001F75B4,ipc_command_func_001F75B4

B func_001F7668
push {r4,r5,r6,lr}
add r4,sp,#16
mov r5,r1
ldm r4,{r1,ip}
mrc p15,0,r4,c13,c0,3
ldr r6,.Lpool_func_001F7668
str r6,[r4,#128]!
add lr,r4,#4
stm lr,{r2,r3,ip}
mov r2,#12
orr r2,r2,ip,lsl #4
str r1,[r4,#20]
str r2,[r4,#16]
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001F7668
ldr r0,[r4,#8]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_001F7668:
pop {r4,r5,r6,pc}
EP1 func_001F7668,ipc_command_func_001F7668

B func_001F774C
push {r4,r5,r6,lr}
add r4,sp,#16
mov r5,r1
ldm r4,{r1,ip}
mrc p15,0,r4,c13,c0,3
ldr r6,.Lpool_func_001F774C
str r6,[r4,#128]!
add lr,r4,#12
stm lr,{r1,ip}
strd r2,[r4,#4]
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001F774C
ldrd r0,[r4,#8]
strd r0,[r5]
ldr r0,[r4,#4]
.Lret_001F774C:
pop {r4,r5,r6,pc}
EP1 func_001F774C,ipc_command_func_001F774C

B func_001F7868
push {r4,r5,r6,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001F7868
add r4,r4,#128
mov ip,#12
stm r4,{r1,r3}
mov r1,#552
add r6,r4,#8
mul r1,r3,r1
orr r1,ip,r1,lsl #4
stm r6,{r1,r2}
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001F7868
ldr r0,[r4,#8]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_001F7868:
pop {r4,r5,r6,pc}
EP1 func_001F7868,ipc_command_func_001F7868

B func_001FB478
push {r0,r1,r2,r3,r4,r5,r6,r7,r8,r9,sl,lr}
add r4,sp,#48
ldm r4,{r0,r1,r5,r6,r7,r8,r9,ip}
mrc p15,0,r4,c13,c0,3
ldr sl,.Lpool_func_001FB478
str sl,[r4,#128]!
ldrb sl,[sp]
strb sl,[r4,#4]
add sl,r4,#16
stm sl,{r0,r1,r5,r6,r7,r8,r9,ip}
ldr r0,.Lpool_func_001FB478+4
strd r2,[r4,#8]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
add sp,sp,#16
pop {r4,r5,r6,r7,r8,r9,sl,pc}
EP2 func_001FB478,ipc_command_func_001FB478,ipc_handle_slot_epsilon

B func_001FB5B8
push {r4,r5,r6,r7,r8,lr}
add r4,sp,#24
ldm r4,{r5,r6}
mrc p15,0,r4,c13,c0,3
ldr r7,.Lpool_func_001FB5B8
mov ip,#0
str r7,[r4,#128]!
add r8,r4,#4
stm r8,{r1,r2,r3,r5,r6}
ldrb r1,[sp,#32]
strb r1,[r4,#24]
str r0,[r4,#32]
ldr r0,.Lpool_func_001FB5B8+4
str ip,[r4,#28]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,r5,r6,r7,r8,pc}
EP2 func_001FB5B8,ipc_command_func_001FB5B8,ipc_handle_slot_epsilon

B func_001FB6AC
push {r0,r1,r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_001FB6AC
str r0,[r4,#128]!
ldrb r0,[sp,#4]
strb r0,[r4,#4]
ldr r0,.Lpool_func_001FB6AC+4
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001FB6AC
ldr r0,[r4,#8]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_001FB6AC:
add sp,sp,#8
pop {r4,r5,r6,pc}
EP2 func_001FB6AC,ipc_command_func_002C576C,ipc_handle_slot_epsilon

B func_001FF934
push {r4,r5,r6,lr}
mov r5,r3
mrc p15,0,r4,c13,c0,3
ldr r3,.Lpool_func_001FF934
str r3,[r4,#128]!
add r6,r4,#4
stm r6,{r0,r1,r2}
mov r0,#32
str r0,[r4,#16]
ldr r0,.Lpool_func_001FF934+4
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001FF934
ldr r0,[r4,#8]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_001FF934:
pop {r4,r5,r6,pc}
EP2 func_001FF934,ipc_command_func_00132E48,ipc_handle_slot_eta

B func_00202DA8
push {r0,r1,r2,r3,r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_00202DA8
str r0,[r4,#128]!
ldrb r0,[sp]
strb r0,[r4,#4]
ldrb r0,[sp,#4]
strb r0,[r4,#8]
strd r2,[r4,#12]
ldrb r0,[sp,#24]
strb r0,[r4,#20]
ldr r0,.Lpool_func_00202DA8+4
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
add sp,sp,#16
pop {r4,pc}
EP2 func_00202DA8,ipc_command_func_00202DA8,ipc_handle_slot_zeta

B func_002C55EC
push {r4,r5,r6,lr}
mrc p15,0,r4,c13,c0,3
ldr r5,.Lpool_func_002C55EC
mov ip,#0
str r5,[r4,#128]!
ldr r5,.Lpool_func_002C55EC+4
add r6,r4,#4
str r1,[r4,#12]
stm r6,{r3,r5}
orr r1,ip,r3,lsl #14
add r5,r4,#16
orr r1,r1,#2
stm r5,{r1,r2}
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,r5,r6,pc}
EP2 func_002C55EC,ipc_command_func_002C55EC,ipc_aux_func_002C59AC_word1

B func_002C57CC
push {r0,r1,r2,r4,r5,r6,r7,r8,r9,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_002C57CC
str r1,[r4,#128]!
ldrh r1,[sp,#8]
strh r1,[r4,#4]
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002C57CC
add r0,r4,#8
ldm r0,{r1,r2,r3,r6,r7,r8,r9,ip}
stm r5,{r1,r2,r3,r6,r7,r8,r9,ip}
ldrd r0,[r4,#40]
strd r0,[r5,#32]
ldr r0,[r4,#4]
.Lret_002C57CC:
add sp,sp,#12
pop {r4,r5,r6,r7,r8,r9,pc}
EP1 func_002C57CC,ipc_command_func_002C6624

B func_002C5860
push {r4,r5,r6,r7,r8,r9,sl,lr}
mov r4,r1
mrc p15,0,r5,c13,c0,3
mov r1,#(11 << 16)
str r1,[r5,#128]!
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002C5860
add r0,r5,#8
ldm r0,{r1,r2,r3,r6,r7,r8,r9,ip}
stm r4,{r1,r2,r3,r6,r7,r8,r9,ip}
add r1,r5,#40
ldr r0,[r5,#52]
ldm r1,{r1,r2,r3}
str r0,[r4,#44]
add r4,r4,#32
stm r4,{r1,r2,r3}
ldr r0,[r5,#4]
.Lret_002C5860:
pop {r4,r5,r6,r7,r8,r9,sl,pc}
E func_002C5860

B func_002C5924
push {r0,r1,r2,r4,r5,lr}
mrc p15,0,r4,c13,c0,3
ldr r2,.Lpool_func_002C5924
str r2,[r4,#128]!
ldrh r2,[r1]
strh r2,[r4,#4]
ldrb r1,[r1,#2]
strb r1,[r4,#6]
ldrb r1,[sp,#8]
strb r1,[r4,#8]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
add sp,sp,#12
pop {r4,r5,pc}
EP1 func_002C5924,ipc_command_func_002DE78C

B func_002C5A54
push {r4,r5,r6,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_002C5A54
add r4,r4,#128
stm r4,{r1,r2,r3}
ldrb r1,[sp,#16]
strb r1,[r4,#12]
ldrh r1,[sp,#20]
strh r1,[r4,#16]
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002C5A54
ldr r0,[r4,#12]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_002C5A54:
pop {r4,r5,r6,pc}
EP1 func_002C5A54,ipc_command_func_002C5A54

B func_002C5B14
push {r4,r5,r6,lr}
mov r5,r2
mrc p15,0,r4,c13,c0,3
ldr r2,.Lpool_func_002C5B14
str r2,[r4,#128]!
str r1,[r4,#4]
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002C5B14
add r0,r4,#8
ldm r0,{r1,r2,r3}
ldr r0,[r4,#20]
str r0,[r5,#12]
stm r5,{r1,r2,r3}
ldr r0,[r4,#4]
.Lret_002C5B14:
pop {r4,r5,r6,pc}
EP1 func_002C5B14,ipc_command_func_00126A20

B func_002C94A8
push {r4,r5,r6,lr}
add r4,sp,#24
ldr r5,[sp,#16]
ldm r4,{r1,ip}
mrc p15,0,r4,c13,c0,3
ldr r6,.Lpool_func_002C94A8
str r6,[r4,#128]!
add lr,r4,#4
stm lr,{r2,r3,r5}
ldrb r2,[sp,#20]
strb r2,[r4,#16]
mov r2,#12
str ip,[r4,#20]
orr r2,r2,ip,lsl #4
str r1,[r4,#28]
str r2,[r4,#24]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,r5,r6,pc}
EP1 func_002C94A8,ipc_command_func_002C94A8

B func_002CCCA4
push {r0,r1,r2,r3,r4,r5,r6,lr}
ldr r5,[sp,#32]
mrc p15,0,r4,c13,c0,3
ldr r3,.Lpool_func_002CCCA4
str r3,[r4,#128]!
str r2,[r4,#4]
ldrb r3,[sp,#12]
strb r3,[r4,#8]
mov r3,#10
orr r2,r3,r2,lsl #4
str r1,[r4,#16]
str r2,[r4,#12]
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002CCCA4
ldr r0,[r4,#8]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_002CCCA4:
add sp,sp,#16
pop {r4,r5,r6,pc}
EP1 func_002CCCA4,ipc_command_func_00118594

B func_002DE588
push {r0,r1,r2,r4,r5,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_002DE588
str r0,[r4,#128]!
ldrh r0,[sp,#4]
strh r0,[r4,#4]
ldrh r0,[sp,#8]
strh r0,[r4,#8]
ldr r0,.Lpool_func_002DE588+4
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002DE588
ldr r0,[r4,#8]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_002DE588:
add sp,sp,#12
pop {r4,r5,pc}
EP2 func_002DE588,ipc_command_func_00126740,ipc_handle_slot_beta

B func_002DEA80
push {r0,r1,r2,r3,r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_002DEA80
str r0,[r4,#128]!
ldrb r0,[sp]
strb r0,[r4,#4]
str r1,[r4,#8]
ldrh r0,[sp,#8]
strh r0,[r4,#12]
ldrh r0,[sp,#12]
strh r0,[r4,#16]
ldr r0,.Lpool_func_002DEA80+4
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
add sp,sp,#16
pop {r4,pc}
EP2 func_002DEA80,ipc_command_func_002DEA80,ipc_handle_slot_beta

B func_002DEAD4
push {r0,r1,r2,r3,r4,lr}
mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_002DEAD4
str r0,[r4,#128]!
ldrb r0,[sp]
strb r0,[r4,#4]
ldrh r0,[sp,#4]
strh r0,[r4,#8]
ldrh r0,[sp,#8]
strh r0,[r4,#12]
ldrh r0,[sp,#12]
strh r0,[r4,#16]
ldr r0,.Lpool_func_002DEAD4+4
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
add sp,sp,#16
pop {r4,pc}
EP2 func_002DEAD4,ipc_command_func_002DEAD4,ipc_handle_slot_beta

B func_002DEDB0
push {r0,r1,r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
ldr r0,.Lpool_func_002DEDB0
str r0,[r4,#128]!
ldrb r0,[sp,#4]
strb r0,[r4,#4]
ldr r0,.Lpool_func_002DEDB0+4
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002DEDB0
ldrb r0,[r4,#8]
strb r0,[r5]
ldr r0,[r4,#4]
.Lret_002DEDB0:
add sp,sp,#8
pop {r4,r5,r6,pc}
EP2 func_002DEDB0,ipc_command_func_002C63E4,ipc_handle_slot_beta

B func_002E6918
push {r4,r5,r6,r7,r8,lr}
mrc p15,0,r5,c13,c0,3
mov r1,#(51 << 16)
str r1,[r5,#128]!
mrc p15,0,r1,c13,c0,3
add r4,r1,#384
ldr r1,.Lpool_func_002E6918
ldrd r6,[r4]
str r0,[r4,#4]
ldr r0,.Lpool_func_002E6918+4
str r1,[r4]
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
strd r6,[r4]
ldrge r0,[r5,#4]
pop {r4,r5,r6,r7,r8,pc}
EP2 func_002E6918,ipc_aux_func_001F16F8_static_descriptor,ipc_handle_slot_lambda

B func_002E6968
push {r4,r5,r6,lr}
mrc p15,0,r4,c13,c0,3
ldr r5,.Lpool_func_002E6968
mov ip,#0
str r5,[r4,#128]!
add r6,r4,#4
str r0,[r4,#12]
ldr r0,.Lpool_func_002E6968+4
strd r0,[r4,#16]
mov r1,#4096
stm r6,{r3,ip}
orr r0,r1,r3,lsl #15
add r6,r4,#24
orr r0,r0,#2
stm r6,{r0,r2}
ldr r0,.Lpool_func_002E6968+8
ldr r0,[r0]
svc #50
and r1,r0,#0x80000000
cmp r1,#0
ldrge r0,[r4,#4]
pop {r4,r5,r6,pc}
EP3 func_002E6968,ipc_command_func_002E6968,ipc_aux_func_002E6968_static_descriptor,ipc_handle_slot_lambda
