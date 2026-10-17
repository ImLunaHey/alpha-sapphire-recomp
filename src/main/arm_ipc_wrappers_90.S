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

.global service_state_apply_secondary_90
.global func_0018C714
.global service_zero_scalar_51

BEGIN func_00180770
push {r4,r5,r6,lr}
sub sp,sp,#48
vldr s0,.Lzero_00180770
mov r5,r0
vstr s0,[sp,#32]
vstr s0,[sp,#16]
vstr s0,[sp]
vstr s0,[sp,#36]
vstr s0,[sp,#20]
vstr s0,[sp,#4]
vstr s0,[sp,#40]
vstr s0,[sp,#24]
vstr s0,[sp,#8]
vstr s0,[sp,#44]
vstr s0,[sp,#28]
vstr s0,[sp,#12]
mov r0,#0
str r0,[sp]
str r0,[sp,#4]
str r0,[sp,#8]
str r0,[sp,#12]
str r0,[sp,#16]
str r0,[sp,#20]
str r0,[sp,#24]
str r0,[sp,#28]
str r0,[sp,#32]
str r0,[sp,#36]
str r0,[sp,#40]
str r0,[sp,#44]
ldr r0,[r5,#8]
mov r4,#0
cmp r0,#0
ble .Ldone_00180770
.Lloop_00180770:
ldr r6,[r5,r4,lsl #2]
cmp r6,#0
beq .Lnext_00180770
mov r2,sp
mov r1,r4
mov r0,r5
bl service_state_apply_secondary_90
mov r1,sp
mov r0,r6
bl func_0018C714
.Lnext_00180770:
ldr r0,[r5,#8]
add r4,r4,#1
cmp r0,r4
bgt .Lloop_00180770
.Ldone_00180770:
add sp,sp,#48
pop {r4,r5,r6,pc}
END func_00180770
.Lzero_00180770:
.word service_zero_scalar_51

BEGIN func_0018085C
vldr s1,.Lzero_0018085C
add r1,r0,r1,lsl #2
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
vmovcc.f32 s0,s1
vldr s1,[r1,#72]
vcmp.f32 s1,s0
vmrs APSR_nzcv,fpscr
beq .Lreturn_0018085C
vstr s0,[r1,#72]
ldrh r1,[r0,#32]
orr r1,r1,#8
strh r1,[r0,#32]
.Lreturn_0018085C:
bx lr
END func_0018085C
.Lzero_0018085C:
.word service_zero_scalar_51

BEGIN func_00180898
vldr s1,.Lzero_00180898
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
vmovcc.f32 s0,s1
vldr s1,[r0,#36]
vcmp.f32 s1,s0
vmrs APSR_nzcv,fpscr
beq .Lreturn_00180898
ldrh r1,[r0,#32]
vstr s0,[r0,#36]
orr r1,r1,#64
strh r1,[r0,#32]
.Lreturn_00180898:
bx lr
END func_00180898
.Lzero_00180898:
.word service_zero_scalar_51
