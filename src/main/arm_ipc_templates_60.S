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

.global func_00176778,func_00176700,func_0017694C,func_00176A00
.global func_00176880,func_001768A0,func_001768C8,func_00176820
.global func_001767B4,func_0016BADC,func_00168EC0,func_0016BC84
.global func_00168E50,func_0016BD00

BEGIN func_0016B414
push {r4,lr}
ldr r0,[r0,#60]
mov r4,r2
bl func_00176778
cmp r0,#0
beq .Ldone_0016B414
ldr r1,[r0]
str r1,[r4]
ldr r1,[r0,#4]
str r1,[r4,#4]
ldr r1,[r0,#12]
add r0,r0,r1
str r0,[r4,#8]
mov r0,#1
.Ldone_0016B414:
pop {r4,pc}
END func_0016B414

BEGIN func_0016B450
push {r4,r5,r6,lr}
mov r4,r2
ldr r0,[r0,#60]
bl func_00176700
movs r5,r0
beq .Ldone_0016B450
bl func_0017694C
cmp r0,#1
movne r0,#0
bne .Ldone_0016B450
mov r0,r5
bl func_00176A00
mov r5,r0
bl func_00176880
str r0,[r4]
ldr r0,[r5,#8]
str r0,[r4,#20]
mov r0,r5
bl func_001768A0
strb r0,[r4,#24]
mov r0,r5
bl func_001768C8
strb r0,[r4,#25]
add r1,r4,#4
mov r0,r5
bl func_00176820
mov r0,#1
.Ldone_0016B450:
pop {r4,r5,r6,pc}
END func_0016B450

BEGIN func_0016B4C0
push {r4,lr}
ldr r0,[r0,#60]
mov r4,r1
bl func_001767B4
cmp r0,#0
beq .Ldone_0016B4C0
ldrh r1,[r0]
str r1,[r4]
ldrh r1,[r0,#2]
str r1,[r4,#4]
ldrh r1,[r0,#4]
str r1,[r4,#8]
ldrh r1,[r0,#6]
str r1,[r4,#12]
ldrh r1,[r0,#8]
str r1,[r4,#16]
ldrh r1,[r0,#10]
str r1,[r4,#20]
ldrh r0,[r0,#12]
str r0,[r4,#24]
mov r0,#1
.Ldone_0016B4C0:
pop {r4,pc}
END func_0016B4C0

BEGIN func_0016B580
push {r4,r5}
ldrh ip,[r0,#16]
add r3,r0,#20
mov r5,r0
mov r0,#0
cmp ip,#0
mov r2,#30720
mov r1,r0
ble .Lreturn_0016B580
.Lscan_0016B580:
add r4,r1,r1,lsl #1
add r4,r3,r4,lsl #2
ldrh r4,[r4]
cmp r4,r2
bne .Lnext_0016B580
add r1,r1,r1,lsl #1
adds r1,r3,r1,lsl #2
ldrne r1,[r1,#4]
cmpne r1,#0
addne r0,r1,r5
beq .Lreturn_0016B580
.Lreturn_0016B580:
pop {r4,r5}
bx lr
.Lnext_0016B580:
add r1,r1,#1
cmp ip,r1
bgt .Lscan_0016B580
pop {r4,r5}
bx lr
END func_0016B580

BEGIN func_0016B6F4
ldr r0,[r0,#4]
ldr r2,[r0,#172]
cmp r2,r1
bls .Lfalse_0016B6F4
ldr r0,[r0,#168]
add r2,r1,r1,lsl #1
add r1,r2,r1,lsl #3
ldrb r2,[r0,r1,lsl #2]
cmp r2,#0
beq .Lfalse_0016B6F4
mov r2,#3
add r1,r2,r1,lsl #2
ldrb r0,[r0,r1]
cmp r0,#0
movne r0,#1
bne .Ldone_0016B6F4
.Lfalse_0016B6F4:
mov r0,#0
.Ldone_0016B6F4:
bx lr
END func_0016B6F4

BEGIN func_0016B73C
ldr r0,[r0,#76]
cmp r0,#0
ldrne r0,[r0,#16]
cmpne r0,#0
ldrne r0,[r0,#36]
beq .Ldone_0016B73C
.Ldone_0016B73C:
bx lr
END func_0016B73C

BEGIN func_0016BB14
push {r4,lr}
mov r4,r0
ldrb r0,[r0,#8]
cmp r0,r1
bhi .Lload_0016BB14
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
mov r1,#0
.Lload_0016BB14:
ldr r0,[r4,#4]
mov r2,#2
add r1,r2,r1,lsl #2
ldrh r0,[r0,r1]
pop {r4,pc}
END func_0016BB14

BEGIN func_0016BB50
push {r4,lr}
mov r4,r0
ldrb r0,[r0,#8]
cmp r0,r1
bhi .Lload_0016BB50
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
mov r1,#0
.Lload_0016BB50:
ldr r0,[r4,#4]
add r0,r0,r1,lsl #2
ldrh r0,[r0]
pop {r4,pc}
END func_0016BB50

BEGIN func_0016BB88
push {r4,r5,r6,r7,r8,lr}
mov r5,r0
mov r8,r3
ldr r0,[r0,#8]
mov r6,r1
mov r7,r2
cmp r0,#0
mov r4,#0
bls .Lfalse_0016BB88
.Lscan_0016BB88:
ldr r0,[r5,#4]
ldr r0,[r0,r4,lsl #2]
ldrh r0,[r0]
cmp r0,r6
nop
bne .Lnext_0016BB88
ldr r0,[r5,#4]
ldr r0,[r0,r4,lsl #2]
ldrb r0,[r0,#2]
cmp r0,r7
nop
bne .Lnext_0016BB88
ldr r0,[r5,#4]
mov r6,#1
mov r1,r8
ldr r0,[r0,r4,lsl #2]
bl func_0016BADC
nop
nop
b .Ldone_0016BB88
.Lnext_0016BB88:
ldr r0,[r5,#8]
add r4,r4,#1
cmp r0,r4
bhi .Lscan_0016BB88
.Lfalse_0016BB88:
mov r6,#0
.Ldone_0016BB88:
mov r0,r6
pop {r4,r5,r6,r7,r8,pc}
END func_0016BB88

BEGIN func_0016BC18
push {r4,r5,r6,lr}
mov r5,r0
bl func_00168EC0
mov r1,#0
mov r0,r5
bl func_0016BC84
ldrb r4,[r0,#22]
mov r0,r5
bl func_00168E50
mov r0,r4
pop {r4,r5,r6,pc}
END func_0016BC18

BEGIN func_0016BC44
push {r4,r5,r6,lr}
mov r5,r0
bl func_00168EC0
mov r1,#0
mov r0,r5
bl func_0016BD00
ldr r0,[r0,#52]
and r4,r0,#31
mov r0,r5
bl func_00168E50
mov r0,r4
pop {r4,r5,r6,pc}
END func_0016BC44

BEGIN func_0016BE00
ldr r2,[r1,#76]
vldr s0,[r1,#72]
ldr r1,[r1,#68]
stm r0,{r1,r3}
vstr s0,[r0,#8]
str r2,[r0,#12]
bx lr
END func_0016BE00

BEGIN func_0016BE1C
add r0,r0,#68
ldr ip,[r1]
ldm r0,{r0,r2,r3}
cmp r0,ip
bne .Lcompare_pair_0016BE1C
cmp r0,#0
beq .Lcompare_pair_0016BE1C
.Ltrue_0016BE1C:
mov r0,#1
bx lr
.Lcompare_pair_0016BE1C:
ldr ip,[r1,#8]!
ldr r0,[r1,#4]
eor r1,r2,ip
eor r0,r0,r3
orrs r0,r0,r1
bne .Lfalse_0016BE1C
orrs r0,r2,r3
bne .Ltrue_0016BE1C
.Lfalse_0016BE1C:
mov r0,#0
bx lr
END func_0016BE1C
