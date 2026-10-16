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

.global service_record_tag_62
.global func_0017D058,func_00144D28,func_00300B28

BEGIN func_0017CEC0
ldr r1,.Lpool_0017CEC0
ldrh r2,[r0,#20]
cmp r2,r1
addeq r1,r0,#20
beq .Lfound_0017CEC0
ldrh r2,[r0,#32]
cmp r2,r1
addeq r1,r0,#32
movne r1,#0
.Lfound_0017CEC0:
ldr r1,[r1,#4]
add r0,r0,r1
bx lr
END func_0017CEC0
.Lpool_0017CEC0:
.word service_record_tag_62

BEGIN func_0017CEF4
ldr r1,.Lpool_0017CEF4
ldrh r2,[r0,#20]
cmp r2,r1
addeq r0,r0,#20
beq .Lfound_0017CEF4
ldrh r2,[r0,#32]
cmp r2,r1
addeq r0,r0,#32
movne r0,#0
.Lfound_0017CEF4:
ldr r0,[r0,#4]
bx lr
END func_0017CEF4
.Lpool_0017CEF4:
.word service_record_tag_62

BEGIN func_0017CF24
ldrh r1,[r0,#20]
cmp r1,#26624
addeq r0,r0,#20
beq .Lfound_0017CF24
ldrh r1,[r0,#32]
cmp r1,#26624
addeq r0,r0,#32
movne r0,#0
.Lfound_0017CF24:
ldr r0,[r0,#4]
bx lr
END func_0017CF24

BEGIN func_0017CF4C
ldr r2,[r0,#52]
bic r1,r1,#0xff000000
add r0,r0,r2
ldr r2,[r0]
cmp r2,r1
movls r0,#0
bls .Ldone_0017CF4C
add r1,r0,r1,lsl #3
ldr r1,[r1,#8]
add r0,r0,r1
.Ldone_0017CF4C:
bx lr
END func_0017CF4C

BEGIN func_0017CF78
mov r2,#5
cmp r2,r1,lsr #24
bne .Lfalse_0017CF78
ldr r2,[r0,#28]
bic r1,r1,#0xff000000
add r0,r0,r2
ldr r2,[r0]
cmp r2,r1
bhi .Lentry_0017CF78
.Lfalse_0017CF78:
mov r0,#0
bx lr
.Lentry_0017CF78:
add r1,r0,r1,lsl #3
ldr r1,[r1,#8]
add r0,r0,r1
bx lr
END func_0017CF78

BEGIN func_0017CFC0
push {r3,lr}
mov r2,#1
mov r1,sp
add r0,r0,#8
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
pop {r3,pc}
END func_0017CFC0

BEGIN func_0017CFE0
ldrh r1,[r0]
cmp r1,#0
subne r1,r1,#8192
subsne r1,r1,#524
beq .Lfalse_0017CFE0
cmp r1,#1
ldreq r1,[r0,#4]
addeq r0,r0,r1
beq .Ldone_0017CFE0
.Lfalse_0017CFE0:
mov r0,#0
.Ldone_0017CFE0:
bx lr
END func_0017CFE0

BEGIN func_0017D00C
ldrh r0,[r0]
cmp r0,#0
beq .Lfallback_0017D00C
sub r0,r0,#8192
subs r0,r0,#524
cmpne r0,#1
beq .Ldone_0017D00C
.Lfallback_0017D00C:
mov r0,#2
.Ldone_0017D00C:
bx lr
END func_0017D00C

BEGIN func_0017D030
ldrh r1,[r0]
cmp r1,#0
beq .Lfalse_0017D030
sub r1,r1,#8192
subs r1,r1,#524
ldreq r1,[r0,#4]
addeq r0,r0,r1
beq .Ldone_0017D030
.Lfalse_0017D030:
mov r0,#0
.Ldone_0017D030:
bx lr
END func_0017D030

BEGIN func_0017D058
push {r4,r5,r6,r7,r8}
mov r5,#0
cmn r2,#1
mov r3,r5
mov ip,r5
moveq r3,ip
beq .Lselected_0017D058
ldr r6,[r0]
mov ip,#0
add r4,r2,#1
mov r7,#1
.Lscan_0017D058:
tst r6,r7,lsl ip
beq .Lnext_0017D058
cmp ip,r2
add r3,r3,#1
moveq r5,#1
.Lnext_0017D058:
subs r4,r4,#1
add ip,ip,#1
bne .Lscan_0017D058
cmp r5,#0
beq .Lfalse_0017D058
.Lselected_0017D058:
cmp r3,#0
beq .Lfalse_0017D058
ldr r0,[r0,r3,lsl #2]
str r0,[r1]
pop {r4,r5,r6,r7,r8}
mov r0,#1
bx lr
.Lfalse_0017D058:
pop {r4,r5,r6,r7,r8}
mov r0,#0
bx lr
END func_0017D058

BEGIN func_0017D0D4
push {r4,r5}
ldrh ip,[r0,#16]
add r3,r0,#20
mov r5,r0
mov r0,#0
cmp ip,#0
mov r2,#22528
mov r1,r0
ble .Lreturn_0017D0D4
.Lloop_0017D0D4:
add r4,r1,r1,lsl #1
add r4,r3,r4,lsl #2
ldrh r4,[r4]
cmp r4,r2
bne .Lnext_0017D0D4
add r1,r1,r1,lsl #1
adds r1,r3,r1,lsl #2
ldrne r1,[r1,#4]
cmpne r1,#0
addne r0,r1,r5
beq .Lreturn_0017D0D4
.Lreturn_0017D0D4:
pop {r4,r5}
bx lr
.Lnext_0017D0D4:
add r1,r1,#1
cmp ip,r1
bgt .Lloop_0017D0D4
pop {r4,r5}
bx lr
END func_0017D0D4

BEGIN func_0017D140
ldr r2,[r0,#8]
ldr r3,[r1,#8]
ldr ip,[r2]
str ip,[r3]
ldr ip,[r2,#4]
str ip,[r3,#4]
ldr ip,[r2,#8]
str ip,[r3,#8]
ldr ip,[r2,#12]
str ip,[r3,#12]
ldr ip,[r2,#16]
str ip,[r3,#16]
ldr r2,[r2,#20]
str r2,[r3,#20]
ldrh r0,[r0,#4]
strh r0,[r1,#4]
bx lr
END func_0017D140

BEGIN func_0017D184
push {r4,r5,r6,lr}
mov r5,r1
mov r4,r0
add r1,r0,#8
mov r2,#404
add r0,r5,#8
bl func_00144D28
ldr r0,[r4,#4]
str r0,[r5,#4]
pop {r4,r5,r6,pc}
END func_0017D184

BEGIN func_0017D1AC
push {r4,r5,r6,lr}
mov r5,r1
ldr r1,[r0,#8]
mov r4,r0
ldr r0,[r5,#8]
mov r2,#36
bl func_00300B28
ldrh r0,[r4,#4]
strh r0,[r5,#4]
pop {r4,r5,r6,pc}
END func_0017D1AC

BEGIN func_0017D720
push {r4}
ldrd r2,[r0,#8]
mov ip,#1
ldr r4,[r2,#16]
sub r4,r4,r3
cmp r4,#1
bcc .Lempty_0017D720
ldr ip,[r2,#12]
ldr r2,[r2,#24]
add r2,r2,ip
ldrb r2,[r2,r3]
strb r2,[r1]
ldr r1,[r0,#12]
add r1,r1,#1
str r1,[r0,#12]
pop {r4}
mov r0,#1
bx lr
.Lempty_0017D720:
mov r2,#0
strb ip,[r0,#4]
strb r2,[r1]
pop {r4}
mov r0,r2
bx lr
END func_0017D720
