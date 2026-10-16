.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro BEGIN f
 .section .text.\f,"ax",%progbits
 .balign 4
 .arm
 .global \f
 .type \f,%function
\f:
.endm
.macro END f
 .size \f,.-\f
.endm

.global func_0017E4D8
.global ipc_controller_selector_offset_77
.global ipc_controller_peer_selector_offset_81
.global ipc_controller_record_table_offset_81

BEGIN func_00179E88
push {r4,r5,r6,lr}
mov r5,r0
mov r4,r1
mov r6,r2
bl func_0017E4D8
cmp r0,#0
beq .Lloc_179EEC
ldr r0,.Lpeer_selector_00179E88
cmp r4,#0
ldrh r0,[r0,r5]
add r0,r5,r0,lsl #2
add r0,r0,#4096
ldr r0,[r0,#160]
add r1,r0,#4
add r1,r1,r4,lsl #1
strh r6,[r1,#36]
ldreq r1,[r0]
orreq r1,r1,#256
beq .Lloc_179EE4
cmp r4,#1
ldreq r1,[r0]
orreq r1,r1,#512
bne .Lloc_179EE8
.Lloc_179EE4:
str r1,[r0]
.Lloc_179EE8:
mov r0,#1
.Lloc_179EEC:
pop {r4,r5,r6,pc}
END func_00179E88
.Lpeer_selector_00179E88:
.word ipc_controller_peer_selector_offset_81

BEGIN func_00179EF4
push {r4,r5,r6,r7,r8,lr}
mov r4,r0
mov r5,r1
mov r6,r2
mov r7,r3
bl func_0017E4D8
cmp r0,#0
beq .Lloc_179F54
ldr r0,.Lselector_00179EF4
cmp r6,#0
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r5,lsl #2
add r0,r0,#4096
ldr r0,[r0,#176]
add r1,r0,#4
strb r6,[r0,#56]
strbeq r7,[r1,#53]
ldr r1,[r0]
orr r1,r1,#131072
str r1,[r0]
mov r0,#1
.Lloc_179F54:
pop {r4,r5,r6,r7,r8,pc}
END func_00179EF4
.Lselector_00179EF4:
.word ipc_controller_selector_offset_77

BEGIN func_00179F5C
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
vpush {d8}
vmov.f32 s16,s0
bl func_0017E4D8
cmp r0,#0
beq .Lloc_179FB0
ldr r0,.Lselector_00179F5C
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r5,lsl #2
add r0,r0,#4096
ldr r0,[r0,#176]
vstr s16,[r0,#52]
ldr r1,[r0]
orr r1,r1,#262144
str r1,[r0]
mov r0,#1
.Lloc_179FB0:
vpop {d8}
pop {r4,r5,r6,pc}
END func_00179F5C
.Lselector_00179F5C:
.word ipc_controller_selector_offset_77

BEGIN func_00179FBC
push {r4,r5,r6,lr}
mov r6,r0
mov r5,r1
mov r4,r2
bl func_0017E4D8
cmp r0,#0
beq .Lloc_17A098
ldr r0,.Lpeer_selector_00179FBC
ldrh r1,[r4]
add r2,r5,r5,lsl #2
ldrh r0,[r0,r6]
tst r1,#1
add r0,r6,r0,lsl #2
add r0,r0,#4096
ldr r0,[r0,#160]
add r3,r0,#4
beq .Lloc_17A00C
ldrh r1,[r4,#2]
add ip,r3,r2,lsl #2
strh r1,[ip,#42]
.Lloc_17A00C:
ldrh r1,[r4]
tst r1,#4
beq .Lloc_17A044
ldrh r1,[r4,#6]
add ip,r3,r2,lsl #2
strh r1,[ip,#46]
ldrh r1,[r4,#12]
strh r1,[ip,#52]
ldrh r1,[r4,#14]
strh r1,[ip,#54]
ldrh r1,[r4,#16]
strh r1,[ip,#56]
ldrh r1,[r4,#18]
strh r1,[ip,#58]
.Lloc_17A044:
ldrh r1,[r4]
tst r1,#2
beq .Lloc_17A05C
ldr r1,[r4,#8]
add ip,r3,r2,lsl #2
str r1,[ip,#48]
.Lloc_17A05C:
add r1,r3,r2,lsl #2
ldrh r2,[r4]
ldrh r3,[r1,#40]
cmp r5,#0
orr r2,r2,r3
strh r2,[r1,#40]
ldreq r1,[r0]
orreq r1,r1,#1024
beq .Lloc_17A090
cmp r5,#1
ldreq r1,[r0]
orreq r1,r1,#2048
bne .Lloc_17A094
.Lloc_17A090:
str r1,[r0]
.Lloc_17A094:
mov r0,#1
.Lloc_17A098:
pop {r4,r5,r6,pc}
END func_00179FBC
.Lpeer_selector_00179FBC:
.word ipc_controller_peer_selector_offset_81

BEGIN func_0017A0A0
push {r4,r5,r6,lr}
mov r5,r0
mov r4,r1
vpush {d8}
vmov.f32 s16,s0
bl func_0017E4D8
cmp r0,#0
beq .Lloc_17A104
ldr r0,.Lpeer_selector_0017A0A0
cmp r4,#0
ldrh r0,[r0,r5]
add r0,r5,r0,lsl #2
add r0,r0,#4096
ldr r0,[r0,#160]
add r1,r0,#4
add r1,r1,r4,lsl #2
vstr s16,[r1,#4]
ldreq r1,[r0]
orreq r1,r1,#16777216
beq .Lloc_17A100
cmp r4,#1
ldreq r1,[r0]
orreq r1,r1,#33554432
bne .Lloc_17A104
.Lloc_17A100:
str r1,[r0]
.Lloc_17A104:
vpop {d8}
pop {r4,r5,r6,pc}
END func_0017A0A0
.Lpeer_selector_0017A0A0:
.word ipc_controller_peer_selector_offset_81

BEGIN func_0017A110
push {r4,r5,r6,lr}
mov r6,r0
mov r5,r1
mov r4,r2
bl func_0017E4D8
cmp r0,#0
beq .Lloc_17A250
ldr r0,.Lpeer_selector_0017A110
ldrh r2,[r4]
add r1,r5,r5,lsl #2
add ip,r1,r5,lsl #3
ldrh r0,[r0,r6]
tst r2,#1
ldr r2,.Lrecord_table_0017A110
add r3,r6,r0,lsl #2
ldr r2,[r2,r3]
add r3,r2,#4
beq .Lloc_17A164
ldrh r0,[r4,#2]
add r1,r3,ip,lsl #2
strh r0,[r1,#82]
.Lloc_17A164:
ldrh r0,[r4]
tst r0,#4
beq .Lloc_17A1DC
ldrh r1,[r4,#6]
add r0,r3,ip,lsl #2
strh r1,[r0,#86]
ldrh r1,[r4,#28]
strh r1,[r0,#108]
ldrh r1,[r4,#30]
strh r1,[r0,#110]
ldrh r1,[r4,#32]
strh r1,[r0,#112]
ldrh r1,[r4,#34]
strh r1,[r0,#114]
ldrh r1,[r4,#36]
strh r1,[r0,#116]
ldrh r1,[r4,#38]
strh r1,[r0,#118]
ldrh r1,[r4,#40]
strh r1,[r0,#120]
ldrh r1,[r4,#42]
strh r1,[r0,#122]
ldrh r1,[r4,#44]
strh r1,[r0,#124]
ldrh r1,[r4,#46]
strh r1,[r0,#126]
ldrh r1,[r4,#48]
strh r1,[r0,#128]
ldrh r1,[r4,#50]
strh r1,[r0,#130]
.Lloc_17A1DC:
ldrh r0,[r4]
tst r0,#2
beq .Lloc_17A214
ldr r1,[r4,#8]
add r0,r3,ip,lsl #2
str r1,[r0,#88]
ldr r1,[r4,#12]
str r1,[r0,#92]
ldr r1,[r4,#16]
str r1,[r0,#96]
ldr r1,[r4,#20]
str r1,[r0,#100]
ldr r1,[r4,#24]
str r1,[r0,#104]
.Lloc_17A214:
add r0,r3,ip,lsl #2
ldrh r1,[r4]
ldrh r3,[r0,#80]
cmp r5,#0
orr r1,r1,r3
strh r1,[r0,#80]
ldreq r0,[r2]
orreq r0,r0,#4096
beq .Lloc_17A248
cmp r5,#1
ldreq r0,[r2]
orreq r0,r0,#8192
bne .Lloc_17A24C
.Lloc_17A248:
str r0,[r2]
.Lloc_17A24C:
mov r0,#1
.Lloc_17A250:
pop {r4,r5,r6,pc}
END func_0017A110
.Lpeer_selector_0017A110:
.word ipc_controller_peer_selector_offset_81
.Lrecord_table_0017A110:
.word ipc_controller_record_table_offset_81

BEGIN func_0017A25C
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
mov r6,r2
bl func_0017E4D8
cmp r0,#0
beq .Lloc_17A2AC
ldr r0,.Lselector_0017A25C
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r5,lsl #2
add r0,r0,#4096
ldr r0,[r0,#176]
strh r6,[r0,#58]
ldr r1,[r0]
orr r1,r1,#4194304
str r1,[r0]
mov r0,#1
.Lloc_17A2AC:
pop {r4,r5,r6,pc}
END func_0017A25C
.Lselector_0017A25C:
.word ipc_controller_selector_offset_77

BEGIN func_0017A2B4
push {r4,r5,r6,r7,r8,lr}
mov r4,r0
mov r5,r1
mov r6,r2
mov r7,r3
bl func_0017E4D8
cmp r0,#0
beq .Lloc_17A30C
ldr r0,.Lselector_0017A2B4
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r5,lsl #2
add r0,r0,#4096
ldr r0,[r0,#176]
strh r6,[r0,#60]
strh r7,[r0,#62]
ldr r1,[r0]
orr r1,r1,#8388608
str r1,[r0]
mov r0,#1
.Lloc_17A30C:
pop {r4,r5,r6,r7,r8,pc}
END func_0017A2B4
.Lselector_0017A2B4:
.word ipc_controller_selector_offset_77
