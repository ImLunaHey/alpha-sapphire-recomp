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

.global func_001862FC,func_00300B28,func_001602B8,func_00179E88
.global func_00160380,ipc_shared_control_owner_72

BEGIN func_0018D0F0
cmp r1,#0
bxeq lr
push {r4,r5,r6,r7,r8,lr}
mov r6,r0
mov r4,r1
.Lrecord_recurse_0018D0F0:
mov r0,r6
ldr r1,[r4,#12]
bl func_0018D0F0
ldr r0,[r6,#4]
mov r5,r4
add r7,r4,#16
ldr r4,[r4,#8]
str r0,[r5,#12]
add r0,r7,#8
bl func_001862FC
mov r0,r7
nop
bl func_001862FC
cmp r4,#0
str r5,[r6,#4]
bne .Lrecord_recurse_0018D0F0
pop {r4,r5,r6,r7,r8,pc}
END func_0018D0F0

BEGIN func_0018D148
cmp r1,#0
bxeq lr
push {r4,r5,r6,lr}
mov r6,r0
mov r4,r1
.Lrecord_recurse_0018D148:
mov r0,r6
ldr r1,[r4,#12]
bl func_0018D148
ldr r1,[r6,#4]
mov r5,r4
add r0,r4,#16
ldr r4,[r4,#8]
str r1,[r5,#12]
bl func_001862FC
cmp r4,#0
str r5,[r6,#4]
bne .Lrecord_recurse_0018D148
pop {r4,r5,r6,pc}
END func_0018D148

BEGIN func_0018E8C0
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[r0]
ldr r3,[r4,#12]
mov r5,r2
lsl r2,r2,#2
add r0,r0,r3,lsl #2
bl func_00300B28
ldr r0,[r4,#12]
ldr r1,[r4,#4]
add r0,r0,r5
cmp r0,r1
str r0,[r4,#12]
movge r0,#0
strge r0,[r4,#12]
pop {r4,r5,r6,pc}
END func_0018E8C0

/* The following-global interval has an explicit unowned 128-byte gap. */

BEGIN func_0018E980
push {r4,r5,r6,r7,r8,lr}
mov r5,r0
add r4,r0,#52
mov r6,r1
mov r7,r2
mov r0,r4
bl func_001602B8
add r0,r5,r6
cmp r7,#0
strb r7,[r0,#48]
beq .Ldisabled_0018E980
.Lpublish_0018E980:
mov r2,#1
.Lload_control_0018E980:
ldr r0,.Lshared_control_0018E980
mov r1,r6
bl func_00179E88
mov r0,r4
pop {r4,r5,r6,r7,r8,lr}
b func_00160380
.Ldisabled_0018E980:
add r0,r5,r6,lsl #2
ldr r0,[r0,#20]
cmp r0,#0
moveq r2,#0
bne .Lpublish_0018E980
b .Lload_control_0018E980
END func_0018E980
.Lshared_control_0018E980:
.word ipc_shared_control_owner_72

BEGIN func_0018EC4C
push {r4,r5,r6,lr}
mov r4,r0
add r0,r0,#112
mov r5,r0
bl func_001602B8
ldr r0,[r4,#48]
cmp r0,#0
movne r1,#3
beq .Lmembers_done_0018EC4C
.Lmember_loop_0018EC4C:
mov r2,r0
ldr r0,[r0,#20]
strb r1,[r2,#17]
cmp r0,#0
bne .Lmember_loop_0018EC4C
.Lmembers_done_0018EC4C:
mov r0,#0
str r0,[r4,#48]
strh r0,[r4,#52]
strh r0,[r4,#54]
mov r0,r5
bl func_00160380
ldrh r1,[r4,#108]
ldrh r0,[r4,#4]
orr r1,r1,#32768
add r0,r0,#1
strh r1,[r4,#108]
strh r0,[r4,#4]
pop {r4,r5,r6,pc}
END func_0018EC4C

BEGIN func_0018ECB8
ldr r0,[r0,#104]
mov r0,r0
ldrh r2,[r0,#30]
bic r2,r2,#16
orr r1,r2,r1,lsl #4
strh r1,[r0,#30]
bx lr
END func_0018ECB8

BEGIN func_0018ECD4
ldr r0,[r0,#104]
mov r0,r0
ldrh r2,[r0,#30]
bic r2,r2,#64
orr r1,r2,r1,lsl #6
strh r1,[r0,#30]
bx lr
END func_0018ECD4

/* The following-global interval has an explicit unowned 184-byte gap. */
