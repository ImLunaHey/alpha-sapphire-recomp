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

.global func_0017D058,func_0017CEF4

BEGIN func_00176684
ldr r0,[r0]
ldrsb r1,[r1]
mov r2,#1
add r0,r2,r0,asr #31
cmp r0,r1
moveq r0,#1
movne r0,#0
bx lr
END func_00176684

BEGIN func_001766A4
push {r3,lr}
mov r2,#1
mov r1,sp
add r0,r0,#4
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
pop {r3,pc}
END func_001766A4

BEGIN func_001766C4
mov r2,#3
cmp r2,r1,lsr #24
bne .Lfalse_001766C4
ldr r2,[r0,#20]
bic r1,r1,#0xff000000
add r0,r0,r2
ldr r2,[r0]
cmp r2,r1
bhi .Lentry_001766C4
.Lfalse_001766C4:
mov r0,#0
bx lr
.Lentry_001766C4:
add r1,r0,r1,lsl #3
ldr r1,[r1,#8]
add r0,r0,r1
bx lr
END func_001766C4

BEGIN func_00176700
mov r2,#1
cmp r2,r1,lsr #24
bne .Lfalse_00176700
ldr r2,[r0,#4]
bic r1,r1,#0xff000000
add r0,r0,r2
ldr r2,[r0]
cmp r2,r1
bhi .Lentry_00176700
.Lfalse_00176700:
mov r0,#0
bx lr
.Lentry_00176700:
add r1,r0,r1,lsl #3
ldr r1,[r1,#8]
add r0,r0,r1
bx lr
END func_00176700

BEGIN func_0017673C
mov r2,#4
cmp r2,r1,lsr #24
bne .Lfalse_0017673C
ldr r2,[r0,#44]
bic r1,r1,#0xff000000
add r0,r0,r2
ldr r2,[r0]
cmp r2,r1
bhi .Lentry_0017673C
.Lfalse_0017673C:
mov r0,#0
bx lr
.Lentry_0017673C:
add r1,r0,r1,lsl #3
ldr r1,[r1,#8]
add r0,r0,r1
bx lr
END func_0017673C

BEGIN func_00176778
mov r2,#2
cmp r2,r1,lsr #24
bne .Lfalse_00176778
ldr r2,[r0,#12]
bic r1,r1,#0xff000000
add r0,r0,r2
ldr r2,[r0]
cmp r2,r1
bhi .Lentry_00176778
.Lfalse_00176778:
mov r0,#0
bx lr
.Lentry_00176778:
add r1,r0,r1,lsl #3
ldr r1,[r1,#8]
add r0,r0,r1
bx lr
END func_00176778

BEGIN func_001767CC
push {r3,lr}
mov r2,#0
mov r1,sp
add r0,r0,#8
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
moveq r0,#64
andne r0,r0,#255
pop {r3,pc}
END func_001767CC

BEGIN func_001767F4
push {r3,lr}
mov r2,#0
mov r1,sp
add r0,r0,#8
bl func_0017D058
cmp r0,#0
beq .Ldone_001767F4
ldr r0,[sp]
lsl r0,r0,#16
lsr r0,r0,#24
.Ldone_001767F4:
pop {r3,pc}
END func_001767F4

BEGIN func_00176820
ldr r2,[r0,#4]
add r0,r0,r2
mvn r2,#0
ldr r3,[r0]
cmp r3,#0
ldrne r3,[r0,#4]
streq r2,[r1]
strne r3,[r1]
ldr r3,[r0]
cmp r3,#1
ldrhi r3,[r0,#8]
strls r2,[r1,#4]
strhi r3,[r1,#4]
ldr r3,[r0]
cmp r3,#2
ldrhi r3,[r0,#12]
strls r2,[r1,#8]
strhi r3,[r1,#8]
ldr r3,[r0]
cmp r3,#3
ldrhi r0,[r0,#16]
strls r2,[r1,#12]
strhi r0,[r1,#12]
bx lr
END func_00176820

BEGIN func_00176880
push {r3,lr}
mov r2,#0
mov r1,sp
add r0,r0,#12
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
pop {r3,pc}
END func_00176880

BEGIN func_001768A0
push {r3,lr}
mov r2,#1
mov r1,sp
add r0,r0,#12
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
moveq r0,#64
andne r0,r0,#255
pop {r3,pc}
END func_001768A0

BEGIN func_001768C8
push {r3,lr}
mov r2,#1
mov r1,sp
add r0,r0,#12
bl func_0017D058
cmp r0,#0
beq .Lfallback_001768C8
ldr r0,[sp]
lsl r0,r0,#16
lsrs r0,r0,#24
beq .Ldone_001768C8
.Lfallback_001768C8:
mov r0,#1
.Ldone_001768C8:
pop {r3,pc}
END func_001768C8

BEGIN func_001768FC
push {r3,lr}
mov r2,#1
mov r1,sp
add r0,r0,#20
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
andne r0,r0,#255
pop {r3,pc}
END func_001768FC

BEGIN func_00176920
push {r3,lr}
mov r2,#1
mov r1,sp
add r0,r0,#20
bl func_0017D058
cmp r0,#0
beq .Ldone_00176920
ldr r0,[sp]
lsl r0,r0,#16
lsr r0,r0,#24
.Ldone_00176920:
pop {r3,pc}
END func_00176920

BEGIN func_0017694C
ldrh r0,[r0,#12]
sub r0,r0,#0x2200
subs r0,r0,#1
moveq r0,#2
beq .Ldone_0017694C
cmp r0,#1
moveq r0,#3
beq .Ldone_0017694C
cmp r0,#2
movne r0,#0
moveq r0,#1
.Ldone_0017694C:
bx lr
END func_0017694C

BEGIN func_0017697C
push {r3,lr}
mov r2,#17
mov r1,sp
add r0,r0,#20
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
andne r0,r0,#1
pop {r3,pc}
END func_0017697C

BEGIN func_001769A0
push {r3,lr}
mov r2,#2
mov r1,sp
add r0,r0,#20
bl func_0017D058
cmp r0,#0
beq .Ldone_001769A0
ldr r0,[sp]
lsl r0,r0,#16
lsr r0,r0,#24
.Ldone_001769A0:
pop {r3,pc}
END func_001769A0

BEGIN func_001769D8
push {r3,lr}
mov r2,#2
mov r1,sp
add r0,r0,#20
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
moveq r0,#64
andne r0,r0,#255
pop {r3,pc}
END func_001769D8

BEGIN func_00176A0C
ldrb r2,[r0,#12]
cmp r2,#0
moveq r0,#0
beq .Ldone_00176A0C
ldr r0,[r0,#4]
add r1,r1,r1,lsl #1
mov r2,#12
add r1,r2,r1,lsl #2
ldr r0,[r0,r1]
.Ldone_00176A0C:
bx lr
END func_00176A0C

BEGIN func_00176A34
push {r4,r5,r6,lr}
mov r4,r0
ldrb r0,[r0,#12]
mov r5,r1
cmp r0,#0
beq .Ldone_00176A34
ldr r0,[r4]
bl func_0017CEF4
mov r1,r0
ldr r0,[r4,#4]
add r2,r5,r5,lsl #1
add r0,r0,r2,lsl #2
ldr r0,[r0,#8]
add r0,r0,r1
add r0,r0,#8
.Ldone_00176A34:
pop {r4,r5,r6,pc}
END func_00176A34
