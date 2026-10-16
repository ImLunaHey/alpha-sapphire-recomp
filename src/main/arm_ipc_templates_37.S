.syntax unified
.arch armv6k
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

.global func_001260B4,func_00133CBC,func_00124BA4,func_00126414
.global func_00118AE4,func_00124FB0,func_001240C4,func_001F73F4
.global func_001FB610,func_001FB670,func_001F4188

BEGIN func_001260E8
push {r4,r5,r6,r7,lr}
sub sp,sp,#12
mov r4,r0
mov r5,r1
mov r6,r2
mov r7,r3
bl func_001260B4
add ip,sp,#4
mov r3,r7
mov r2,r6
mov r1,r5
mov r0,r4
str ip,[sp]
bl func_00133CBC
mov r1,pc
lsrs r2,r0,#31
blne func_00124BA4
bl func_00126414
ldrsb r0,[sp,#4]
add sp,sp,#12
pop {r4,r5,r6,r7,pc}
END func_001260E8

BEGIN func_00170868
push {r4,lr}
bl func_00118AE4
ands r1,r0,#0x80000000
bpl .Lreturn_00170868
mov r1,pc
lsrs r2,r0,#31
beq .Lreturn_00170868
pop {r4,lr}
b func_00124FB0
.Lreturn_00170868:
pop {r4,pc}
END func_00170868

BEGIN func_001F48EC
push {r4,r5,r6,lr}
sub sp,sp,#24
mov r5,r1
mov r1,#0
mov r4,r0
strh r1,[sp,#6]
mov r0,#0x48000
strb r1,[sp,#4]
mov r6,r2
strb r1,[sp,#5]
str r0,[sp,#12]
str r3,[sp,#8]
bl func_001240C4
str r0,[sp,#16]
add r0,sp,#4
str r0,[sp]
mov r3,r6
mov r2,r5
mov r1,r4
add r0,sp,#16
bl func_001F73F4
add sp,sp,#24
pop {r4,r5,r6,pc}
END func_001F48EC

BEGIN func_001FAF1C
mov r0,r0
push {r4,r5,r6,r7,lr}
sub sp,sp,#20
mov r4,r0
mov r5,r1
mov r6,r2
mov r7,r3
add r3,sp,#12
add r2,sp,#4
add r1,sp,#8
mov r0,sp
bl func_001FB610
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
cmp r4,#0
ldrne r0,[sp]
strne r0,[r4]
cmp r5,#0
ldrne r0,[sp,#8]
strne r0,[r5]
cmp r6,#0
ldrne r0,[sp,#4]
strne r0,[r6]
cmp r7,#0
ldrne r0,[sp,#12]
strne r0,[r7]
add sp,sp,#20
pop {r4,r5,r6,r7,pc}
END func_001FAF1C

BEGIN func_001FAF90
mov r0,r0
push {r3,r4,r5,lr}
mov r4,r0
mov r5,#0
mov r0,sp
str r5,[sp]
bl func_001FB670
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldr r0,[r4]
cmp r0,#0
beq .Linstall_001FAF90
svc #0x23
str r5,[r4]
.Linstall_001FAF90:
ldr r0,[sp]
str r0,[r4]
pop {r3,r4,r5,pc}
END func_001FAF90

BEGIN func_0036C428
cmp r3,#0
mov r0,r2
movne r2,#1
moveq r2,#0
push {r4,lr}
bl func_001F4188
and r1,r0,#0x80000000
cmp r1,#0
movge r0,#0
bge .Lreturn_0036C428
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
mov r0,#6
.Lreturn_0036C428:
pop {r4,pc}
END func_0036C428

BEGIN func_004E61F4
push {r4,r5,r6,lr}
mov r4,r1
ldr r1,[r0]
mov r5,r2
mov r6,r3
ldr r1,[r1,#16]
blx r1
cmp r0,#0
beq .Lreturn_004E61F4
mov r3,#0xf0000001
mov r2,r6
mov r1,r5
mov r0,r4
bl func_001F48EC
and r1,r0,#0x80000000
cmp r1,#0
movge r0,#1
bge .Lreturn_004E61F4
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
mov r0,#0
.Lreturn_004E61F4:
pop {r4,r5,r6,pc}
END func_004E61F4
