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

.global func_0017541C,service_link_secondary_64,func_00188A8C
.global ipc_shared_owner_63,ipc_halfword_owner_64

BEGIN func_0018196C
push {r4,r5,r6,lr}
mov r4,r0
ldm r1,{r0,r3}
add r5,r4,#360
ldr r1,[r1,#8]
str r1,[r4,#368]
stm r5,{r0,r3}
add r0,r4,#380
mov r5,#1
vldmia r2,{s0-s7}
add r2,r2,#32
vstmia r0,{s0-s7}
add r0,r4,#412
vldmia r2,{s0-s4}
vstmia r0,{s0-s4}
strb r5,[r4,#356]
bl func_0017541C
add r1,r4,#80
bl service_link_secondary_64
strb r5,[r4,#358]
pop {r4,r5,r6,pc}
END func_0018196C

BEGIN func_001819D8
push {r4,r5,r6,r7,r8,r9,r10,lr}
mov r6,r0
mov r4,r1
mov r9,r2
ldr r0,.Lpool_001819D8
mov r5,#0
ldr r7,[r0,#4]
ldr r8,[r0]
.Lloop_001819D8:
cmp r4,#0
beq .Lreturn_001819D8
tst r4,#1
beq .Lnext_001819D8
cmp r5,#15
bgt .Lnext_001819D8
add r0,r6,r5,lsl #2
ldr r0,[r0,#144]
cmp r0,#0
beq .Lnext_001819D8
add r2,r0,r7,asr #1
tst r7,#1
ldrne r0,[r2]
moveq r0,r8
mov r1,r9
ldrne r0,[r0,r8]
mov r3,r0
mov r0,r2
blx r3
.Lnext_001819D8:
add r5,r5,#1
cmp r5,#16
lsr r4,r4,#1
blt .Lloop_001819D8
.Lreturn_001819D8:
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_001819D8
.Lpool_001819D8:
.word ipc_shared_owner_63

BEGIN func_00181A74
cmp r1,#15
addle r0,r0,r1,lsl #2
movgt r0,#0
ldrle r0,[r0,#144]
bx lr
END func_00181A74

BEGIN func_00181A88
ldr r2,.Lpool_00181A88
push {r4,lr}
ldrd r2,[r2,#16]
bl func_00188A8C
pop {r4,pc}
END func_00181A88
.Lpool_00181A88:
.word ipc_shared_owner_63

BEGIN func_00181AA0
ldr r2,.Lpool_00181AA0
push {r4,lr}
ldrd r2,[r2,#48]
bl func_00188A8C
pop {r4,pc}
END func_00181AA0
.Lpool_00181AA0:
.word ipc_shared_owner_63

BEGIN func_00181AB8
push {r4,r5,r6,r7,r8,r9,r10,lr}
mov r6,r0
mov r4,r1
mov r10,r2
ldr r0,.Lpool_00181AB8
mov r9,r3
mov r5,#0
ldr r8,[r0,#8]!
ldr r7,[r0,#4]
.Lloop_00181AB8:
cmp r4,#0
beq .Lreturn_00181AB8
tst r4,#1
beq .Lnext_00181AB8
cmp r5,#15
bgt .Lnext_00181AB8
add r0,r6,r5,lsl #2
ldr r0,[r0,#144]
cmp r0,#0
beq .Lnext_00181AB8
add r0,r0,r7,asr #1
tst r7,#1
ldrne r1,[r0]
moveq r1,r8
mov r2,r9
ldrne r1,[r1,r8]
mov r3,r1
mov r1,r10
blx r3
.Lnext_00181AB8:
add r5,r5,#1
cmp r5,#16
lsr r4,r4,#1
blt .Lloop_00181AB8
.Lreturn_00181AB8:
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_00181AB8
.Lpool_00181AB8:
.word ipc_shared_owner_63

BEGIN func_00181B64
ldr r2,.Lpool_00181B64
add r0,r2,r0,lsl #1
strh r1,[r0]
bx lr
END func_00181B64
.Lpool_00181B64:
.word ipc_halfword_owner_64

BEGIN func_00181B78
push {r4,r5,r6,r7,r8,r9,r10,lr}
mov r4,r1
mov r9,r2
add r1,r2,r9,lsl #1
add r1,r0,r1,lsl #2
ldrb r1,[r1,#316]
cmp r1,#0
moveq r0,#0
beq .Lreturn_00181B78
mov r6,r0
ldr r0,.Lpool_00181B78
mov r5,#0
ldr r8,[r0,#72]!
ldr r7,[r0,#4]
.Lloop_00181B78:
cmp r4,#0
beq .Lsuccess_00181B78
tst r4,#1
beq .Lnext_00181B78
cmp r5,#15
bgt .Lnext_00181B78
add r0,r6,r5,lsl #2
ldr r0,[r0,#144]
cmp r0,#0
beq .Lnext_00181B78
add r0,r0,r7,asr #1
tst r7,#1
ldrne r1,[r0]
moveq r1,r8
ldrne r1,[r1,r8]
mov r2,r1
mov r1,r9
blx r2
.Lnext_00181B78:
add r5,r5,#1
cmp r5,#16
lsr r4,r4,#1
blt .Lloop_00181B78
.Lsuccess_00181B78:
mov r0,#1
.Lreturn_00181B78:
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_00181B78
.Lpool_00181B78:
.word ipc_shared_owner_63

BEGIN func_00181C14
push {r4,r5,r6,r7,r8,r9,r10,lr}
mov r6,r0
mov r4,r1
mov r9,r2
ldr r0,.Lpool_00181C14
mov r5,#0
ldr r8,[r0,#80]!
ldr r7,[r0,#4]
.Lloop_00181C14:
cmp r4,#0
beq .Lreturn_00181C14
tst r4,#1
beq .Lnext_00181C14
cmp r5,#15
bgt .Lnext_00181C14
add r0,r6,r5,lsl #2
ldr r0,[r0,#144]
cmp r0,#0
beq .Lnext_00181C14
add r2,r0,r7,asr #1
tst r7,#1
ldrne r0,[r2]
moveq r0,r8
mov r1,r9
ldrne r0,[r0,r8]
mov r3,r0
mov r0,r2
blx r3
.Lnext_00181C14:
add r5,r5,#1
cmp r5,#16
lsr r4,r4,#1
blt .Lloop_00181C14
.Lreturn_00181C14:
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_00181C14
.Lpool_00181C14:
.word ipc_shared_owner_63

BEGIN func_00181C98
ldr r2,.Lpool_00181C98
push {r4,lr}
ldrd r2,[r2,#40]
bl func_00188A8C
pop {r4,pc}
END func_00181C98
.Lpool_00181C98:
.word ipc_shared_owner_63

BEGIN func_00181CB0
push {r4,r5,r6,r7,r8,r9,r10,lr}
mov r6,r0
mov r4,r1
mov r9,r2
ldr r0,.Lpool_00181CB0
mov r5,#0
vpush {d8}
vmov.f32 s16,s0
ldr r8,[r0,#56]!
ldr r7,[r0,#4]
.Lloop_00181CB0:
cmp r4,#0
beq .Lrestore_00181CB0
tst r4,#1
beq .Lnext_00181CB0
cmp r5,#15
bgt .Lnext_00181CB0
add r0,r6,r5,lsl #2
ldr r0,[r0,#144]
cmp r0,#0
beq .Lnext_00181CB0
add r0,r0,r7,asr #1
tst r7,#1
ldrne r1,[r0]
moveq r1,r8
vmov.f32 s0,s16
ldrne r1,[r1,r8]
mov r2,r1
mov r1,r9
blx r2
.Lnext_00181CB0:
add r5,r5,#1
cmp r5,#16
lsr r4,r4,#1
blt .Lloop_00181CB0
.Lrestore_00181CB0:
vpop {d8}
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_00181CB0
.Lpool_00181CB0:
.word ipc_shared_owner_63

BEGIN func_00181D40
push {r4,r5,r6,r7,r8,r9,r10,lr}
mov r6,r0
mov r4,r1
mov r9,r2
ldr r0,.Lpool_00181D40
mov r5,#0
ldr r8,[r0,#88]!
ldr r7,[r0,#4]
.Lloop_00181D40:
cmp r4,#0
beq .Lreturn_00181D40
tst r4,#1
beq .Lnext_00181D40
cmp r5,#15
bgt .Lnext_00181D40
add r0,r6,r5,lsl #2
ldr r0,[r0,#144]
cmp r0,#0
beq .Lnext_00181D40
add r2,r0,r7,asr #1
tst r7,#1
ldrne r0,[r2]
moveq r0,r8
mov r1,r9
ldrne r0,[r0,r8]
mov r3,r0
mov r0,r2
blx r3
.Lnext_00181D40:
add r5,r5,#1
cmp r5,#16
lsr r4,r4,#1
blt .Lloop_00181D40
.Lreturn_00181D40:
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_00181D40
.Lpool_00181D40:
.word ipc_shared_owner_63

BEGIN func_00181DC4
add r0,r0,#136
stm r0,{r1,r2}
bx lr
END func_00181DC4
