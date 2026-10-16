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

.global func_001602B8,func_00132A14,func_0017A8E8,func_0016F454
.global func_00160380,func_0018EC24,func_00188184,func_0018F3B4
.global func_0018ECF0,func_0018EFAC,func_0018F3F8,func_0018F3E0
.global func_0017E858

BEGIN func_0018C888
push {r4,r5,r6,r7,r8,lr}
mov r5,r0
add r6,r0,#44
mov r4,r1
mov r7,r2
mov r0,r6
bl func_001602B8
add r0,r4,#12
bl func_00132A14
mov r0,#1
strb r0,[r4,#20]
add r0,r7,r7,lsl #1
add r2,r4,#4
add r0,r5,r0,lsl #2
add r1,r0,#4
bl func_0017A8E8
mov r1,#0
add r0,r5,#56
bl func_0016F454
mov r0,r6
pop {r4,r5,r6,r7,r8,lr}
b func_00160380
END func_0018C888

BEGIN func_0018CA98
push {r4,r5,r6,lr}
mov r5,r0
ldrb r0,[r0,#20]
cmp r0,#0
beq .Lreturn_0018CA98
ldr r0,[r5,#8]
mov r6,#0
mov r4,r6
cmp r0,#0
ble .Lcleared_0018CA98
.Lrelease_loop_0018CA98:
ldr r0,[r5,r4,lsl #2]
cmp r0,#0
beq .Lrelease_next_0018CA98
bl func_0018EC24
str r6,[r5,r4,lsl #2]
.Lrelease_next_0018CA98:
ldr r0,[r5,#8]
add r4,r4,#1
cmp r0,r4
bgt .Lrelease_loop_0018CA98
.Lcleared_0018CA98:
str r6,[r5,#8]
bl func_00188184
mov r1,r5
nop
bl func_0018F3B4
strb r6,[r5,#20]
.Lreturn_0018CA98:
pop {r4,r5,r6,pc}
END func_0018CA98

BEGIN func_0018CB00
push {r4,r5,r6,lr}
mov r5,r0
ldrb r0,[r0,#22]
mov r6,#0
cmp r0,#0
beq .Lflags_0018CB00
ldr r0,[r5,#8]
mov r4,#0
cmp r0,#0
ble .Ldisable_0018CB00
.Ldisable_loop_0018CB00:
ldr r0,[r5,r4,lsl #2]
cmp r0,#0
movne r1,#1
blne func_0018ECF0
ldr r0,[r5,#8]
add r4,r4,#1
cmp r0,r4
bgt .Ldisable_loop_0018CB00
.Ldisable_0018CB00:
strb r6,[r5,#22]
.Lflags_0018CB00:
strb r6,[r5,#24]
strb r6,[r5,#23]
strb r6,[r5,#21]
pop {r4,r5,r6,pc}
END func_0018CB00

BEGIN func_0018CD00
push {r4,r5,r6,lr}
mov r5,r0
bl func_0018EFAC
ldr r4,[r5,#304]
cmp r4,#0
beq .Ldestroy_loop_0018CD00
.Lnotify_loop_0018CD00:
ldrb r0,[r4,#305]
cmp r0,#0
movne r0,r4
blne func_0018F3F8
ldr r4,[r4,#424]
cmp r4,#0
bne .Lnotify_loop_0018CD00
.Ldestroy_loop_0018CD00:
ldr r4,[r5,#304]
cmp r4,#0
beq .Lclear_0018CD00
.Ldestroy_next_0018CD00:
mov r0,r4
bl func_0018F3E0
ldr r4,[r4,#424]
cmp r4,#0
bne .Ldestroy_next_0018CD00
.Lclear_0018CD00:
mov r0,#0
str r0,[r5,#304]
strb r0,[r5,#5]
pop {r4,r5,r6,pc}
END func_0018CD00

BEGIN func_0018CD64
mov r1,r0
ldr r0,[r0]
cmp r0,#0
ldrne r2,[r0]
strne r2,[r1]
bx lr
END func_0018CD64

BEGIN func_0018CD7C
ldrb r1,[r0,#100]
cmp r1,#0
bne .Lreturn_0018CD7C
b func_0017E858
.Lreturn_0018CD7C:
bx lr
END func_0018CD7C
