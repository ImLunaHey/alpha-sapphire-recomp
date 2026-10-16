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

.global func_00176AE8,func_00176A74,func_0017D058,func_0017CEC0
.global func_001766C4,func_00176700,func_001768FC,func_00176920
.global func_001769D8,func_001769A0,func_0017697C,func_001767C0
.global func_0017673C,func_001766A4,func_0017694C,func_001769CC
.global func_001767CC,func_001767F4

BEGIN func_0016AD04
ldr r0,[r0,#148]
cmp r0,#0
ldrbne r0,[r0,#34]
cmpne r0,#5
moveq r0,#0
movne r0,#1
bx lr
END func_0016AD04

BEGIN func_0016AD20
ldr r0,[r0,#156]
cmp r0,#0
ldrbne r0,[r0,#34]
cmpne r0,#5
moveq r0,#0
movne r0,#1
bx lr
END func_0016AD20

BEGIN func_0016AD3C
ldr r0,[r0,#44]
bics r0,r1,r0
moveq r0,#1
movne r0,#0
bx lr
END func_0016AD3C

BEGIN func_0016AD60
ldr r0,[r0,#8]
cmp r0,#0
ldrne r1,[r0,#16]
addne r0,r0,r1
bx lr
END func_0016AD60

BEGIN func_0016AD74
push {r0,r1,r2,r3,r4,r5,r6,r7,r8,r9,sl,fp,lr}
sub sp,sp,#12
mov r5,r0
add r0,r1,#12
mov r8,r3
mov fp,#0
str r0,[sp,#4]
ldr sl,[r1,#16]
add r0,r1,#16
cmp sl,r0
beq .Ldone_0016AD74
.Louter_0016AD74:
ldr r0,[sp,#20]
str r0,[sp]
ldr r0,[r5,#4]
ldr r7,[sl,#8]
cmp r0,#0
moveq r6,#0
beq .Louter_next_0016AD74
ldr r1,[r0,#16]
mov r6,#0
mov r4,r6
add r9,r0,r1
ldrh r0,[r0,#14]
cmp r0,#0
bls .Louter_next_0016AD74
.Linner_0016AD74:
ldr r0,[r9,r4,lsl #2]
ldr r1,[r5,#4]
add r1,r1,r0
ldrb r0,[r1,#21]
cmp r0,#0
beq .Lrecord_zero_0016AD74
ldr r0,[r7]
cmp r8,#0
beq .Lrecord_set_second_0016AD74
ldr ip,[r0,#56]
ldr r2,[sp]
mov r0,r7
blx ip
cmp r0,#0
beq .Linner_next_0016AD74
b .Lcount_0016AD74
.Lrecord_zero_0016AD74:
ldr r0,[r7]
cmp r8,#0
beq .Lrecord_clear_second_0016AD74
ldr ip,[r0,#48]
ldr r2,[sp]
mov r0,r7
blx ip
cmp r0,#0
beq .Linner_next_0016AD74
b .Lcount_0016AD74
.Lrecord_clear_second_0016AD74:
ldr ip,[r0,#44]
ldr r2,[sp]
mov r0,r7
blx ip
cmp r0,#0
bne .Lcount_0016AD74
b .Linner_next_0016AD74
.Lrecord_set_second_0016AD74:
ldr ip,[r0,#52]
ldr r2,[sp]
mov r0,r7
blx ip
cmp r0,#0
beq .Linner_next_0016AD74
.Lcount_0016AD74:
add r0,r6,#1
uxth r6,r0
.Linner_next_0016AD74:
ldr r0,[r5,#4]
add r1,r4,#1
uxth r4,r1
ldrh r0,[r0,#14]
cmp r0,r4
bhi .Linner_0016AD74
.Louter_next_0016AD74:
add r0,r6,fp
ldr sl,[sl]
uxth fp,r0
ldr r0,[sp,#4]
add r0,r0,#4
cmp sl,r0
bne .Louter_0016AD74
.Ldone_0016AD74:
add sp,sp,#28
mov r0,fp
pop {r4,r5,r6,r7,r8,r9,sl,fp,pc}
END func_0016AD74

BEGIN func_0016AEBC
ldr r0,[r0,#8]
cmp r0,#0
beq .Ldone_0016AEBC
ldrb r0,[r0,#24]
ands r0,r0,#1
movne r0,#1
.Ldone_0016AEBC:
bx lr
END func_0016AEBC

BEGIN func_0016AED8
push {r4,r5,r6,r7,r8,lr}
mov r4,r0
mov r6,r1
ldr r0,[r0,#4]
mov r7,r2
bl func_0016B378
mov r5,r0
ldr r0,[r4,#8]
cmp r0,#0
beq .Ldone_0016AED8
ldrb r3,[r0,#4]
mov r1,r6
mov r2,r7
cmp r3,#0
moveq r0,#0
beq .Lmerge_0016AED8
ldr r3,[r0]
ldr r3,[r3,#32]
blx r3
.Lmerge_0016AED8:
orr r5,r5,r0
.Ldone_0016AED8:
mov r0,r5
pop {r4,r5,r6,r7,r8,pc}
END func_0016AED8

BEGIN func_0016AF30
push {r4,r5,r6,r7,r8,lr}
mov r4,r0
mov r6,r1
ldr r0,[r0,#4]
mov r7,r2
bl func_00176AE8
mov r5,r0
ldr r0,[r4,#8]
cmp r0,#0
beq .Ldone_0016AF30
ldrb r3,[r0,#4]
mov r1,r6
mov r2,r7
cmp r3,#0
moveq r0,#0
beq .Lmerge_0016AF30
ldr r3,[r0]
ldr r3,[r3,#44]
blx r3
.Lmerge_0016AF30:
orr r5,r5,r0
.Ldone_0016AF30:
mov r0,r5
pop {r4,r5,r6,r7,r8,pc}
END func_0016AF30

BEGIN func_0016AF88
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[r0,#4]
mov r5,r1
mov r6,r2
mov r3,#0
bl func_00176A74
movs r1,r0
ldrne r0,[r4,#8]
cmpne r0,#0
moveq r0,r1
beq .Ldone_0016AF88
ldrb r3,[r0,#4]
mov r1,r5
mov r2,r6
cmp r3,#0
mov r3,#0
beq .Lsuccess_0016AF88
ldr ip,[r0]
ldr ip,[ip,#48]
blx ip
.Lsuccess_0016AF88:
mov r0,#1
.Ldone_0016AF88:
pop {r4,r5,r6,pc}
END func_0016AF88

BEGIN func_0016AFE4
push {r4,r5}
ldrh ip,[r0,#16]
add r3,r0,#20
mov r5,r0
mov r0,#0
cmp ip,#0
mov r2,#26624
mov r1,r0
ble .Lreturn_0016AFE4
.Lscan_0016AFE4:
add r4,r1,r1,lsl #1
add r4,r3,r4,lsl #2
ldrh r4,[r4]
cmp r4,r2
bne .Lnext_0016AFE4
add r1,r1,r1,lsl #1
adds r1,r3,r1,lsl #2
ldrne r1,[r1,#4]
cmpne r1,#0
addne r0,r1,r5
beq .Lreturn_0016AFE4
.Lreturn_0016AFE4:
pop {r4,r5}
bx lr
.Lnext_0016AFE4:
add r1,r1,#1
cmp ip,r1
bgt .Lscan_0016AFE4
pop {r4,r5}
bx lr
END func_0016AFE4

BEGIN func_0016B05C
ldr r2,[r0,#12]
add r0,r0,r2
ldr r2,[r0]
cmp r2,r1
bls .Lmiss_0016B05C
add r1,r0,r1,lsl #3
ldrh r2,[r1,#4]
cmp r2,#18688
ldreq r1,[r1,#8]
addeq r0,r0,r1
beq .Ldone_0016B05C
.Lmiss_0016B05C:
mov r0,#0
.Ldone_0016B05C:
bx lr
END func_0016B05C

BEGIN func_0016B108
push {r3,lr}
mov r2,#0
mov r1,sp
add r0,r0,#4
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
moveq r0,#64
andne r0,r0,#255
pop {r3,pc}
END func_0016B108

BEGIN func_0016B130
push {r3,lr}
mov r2,#2
mov r1,sp
add r0,r0,#4
bl func_0017D058
cmp r0,#0
beq .Ldone_0016B130
ldr r0,[sp]
lsl r0,r0,#16
lsr r0,r0,#24
.Ldone_0016B130:
pop {r3,pc}
END func_0016B130

BEGIN func_0016B15C
push {r3,lr}
mov r2,#2
mov r1,sp
add r0,r0,#4
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
moveq r0,#64
andne r0,r0,#255
pop {r3,pc}
END func_0016B15C

BEGIN func_0016B1F8
push {r3,lr}
mov r2,#1
mov r1,sp
add r0,r0,#4
bl func_0017D058
cmp r0,#0
ldrne r0,[sp]
moveq r0,#96
andne r0,r0,#255
pop {r3,pc}
END func_0016B1F8

BEGIN func_0016B220
ldr r1,[r0,#52]
add r0,r0,r1
bx lr
END func_0016B220

BEGIN func_0016B22C
ldrb r2,[r0,#12]
cmp r2,#0
beq .Lmiss_0016B22C
ldr r2,[r0,#4]
ldr r3,[r2]
cmp r3,r1
bhi .Lbounded_0016B22C
.Lmiss_0016B22C:
mov r0,#0
bx lr
.Lbounded_0016B22C:
ldr r3,[r0,#8]
cmp r3,#0
ldrne r0,[r3,r1,lsl #2]
bxne lr
add r1,r1,r1,lsl #1
push {r4,lr}
add r1,r2,r1,lsl #2
ldr r0,[r0]
ldr r4,[r1,#8]
bl func_0017CEC0
add r0,r0,#8
add r0,r0,r4
pop {r4,pc}
END func_0016B22C

BEGIN func_0016B2C0
push {r4,lr}
ldr r0,[r0,#60]
mov r4,r2
bl func_001766C4
cmp r0,#0
beq .Ldone_0016B2C0
ldr r0,[r0]
str r0,[r4]
mov r0,#1
.Ldone_0016B2C0:
pop {r4,pc}
END func_0016B2C0

BEGIN func_0016B2E8
push {r4,r5,r6,lr}
mov r4,r2
ldr r0,[r0,#60]
bl func_00176700
movs r5,r0
beq .Ldone_0016B2E8
ldr r0,[r5]
str r0,[r4]
ldr r0,[r5,#4]
str r0,[r4,#4]
ldrb r0,[r5,#8]
str r0,[r4,#16]
mov r0,r5
bl func_001768FC
strb r0,[r4,#20]
mov r0,r5
bl func_00176920
strb r0,[r4,#21]
mov r0,r5
bl func_001769D8
str r0,[r4,#12]
mov r0,r5
bl func_001769A0
str r0,[r4,#8]
mov r0,r5
bl func_0017697C
strb r0,[r4,#22]
mov r0,#1
.Ldone_0016B2E8:
pop {r4,r5,r6,pc}
END func_0016B2E8

BEGIN func_0016B35C
ldr r0,[r0,#4]
mov r0,r0
push {r4,lr}
ldr r0,[r0,#60]
bl func_001767C0
ldr r0,[r0]
pop {r4,pc}
END func_0016B35C

BEGIN func_0016B378
push {r4,lr}
ldr r0,[r0,#60]
mov r4,r2
bl func_0017673C
cmp r0,#0
beq .Ldone_0016B378
ldr r1,[r0]
str r1,[r4]
bl func_001766A4
str r0,[r4,#4]
mov r0,#1
.Ldone_0016B378:
pop {r4,pc}
END func_0016B378

BEGIN func_0016B3A8
push {r4,r5,r6,lr}
mov r4,r2
ldr r0,[r0,#60]
bl func_00176700
movs r5,r0
beq .Ldone_0016B3A8
bl func_0017694C
cmp r0,#3
movne r0,#0
bne .Ldone_0016B3A8
mov r0,r5
bl func_001769CC
mov r5,r0
ldr r0,[r0]
str r0,[r4]
ldr r0,[r5,#4]
str r0,[r4,#4]
mov r0,r5
bl func_001767CC
strb r0,[r4,#8]
mov r0,r5
bl func_001767F4
cmp r0,#0
movne r0,#1
strb r0,[r4,#9]
mov r0,#1
.Ldone_0016B3A8:
pop {r4,r5,r6,pc}
END func_0016B3A8
