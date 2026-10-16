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

.global func_00167B00,func_00144D28,func_00175D58,func_00175870
.global service_layout_fallback_secondary_55,func_00175978,func_0012B9A0
.global func_0017492C,func_0016B654,func_0016B6A4,func_0013E9CC
.global func_00157FBC,func_00157C04,func_0016E0C8
.global service_zero_scalar_51,ipc_unit_scalar_54,ipc_default_flags_54
.global ipc_render_context_54,ipc_layout_callback_context_55
.global ipc_layout_record_tag_55

BEGIN func_00167B90
push {r4,r5,r6,r7,lr}
sub sp,sp,#124
mov r4,r0
mov r6,r1
mov r5,r2
add r0,sp,#16
bl func_00167B00
cmp r5,#0
beq .Lloaded_00167B90
mov r2,#76
mov r1,r5
add r0,sp,#16
bl func_00144D28
.Lloaded_00167B90:
ldrb r0,[sp,#16]
vldr s4,.Lpool_00167B90
vldr s5,.Lpool_00167B90+4
strb r0,[r4,#4]
ldr r1,[sp,#32]
cmp r0,#1
str r1,[r4,#16]
ldr r1,[sp,#84]
str r1,[r4,#8]
ldr r1,[sp,#28]
str r1,[r4,#20]
add r1,r4,#36
beq .Lswapped_00167B90
cmp r0,#2
bne .Lnormal_00167B90
ldrb r0,[r4,#12]
cmp r0,#1
beq .Lswapped_00167B90
.Lnormal_00167B90:
add r0,sp,#20
vldmia r0,{s0-s1}
mov r0,r1
vcvt.f32.s32 s2,s0
vmov.f32 s0,s4
vcvt.f32.s32 s3,s1
vmov.f32 s1,s0
bl func_00175D58
.Llayout_ready_00167B90:
add r1,r1,#20
mov r5,#0
vstmia r1,{s4-s5}
ldr r0,[sp,#44]
cmp r0,#0
ldreq r0,[sp,#48]
cmpeq r0,#0
beq .Lfallback_00167B90
ldr r0,[sp,#32]
ldr r1,[sp,#44]
ldr r2,[sp,#48]
ldr r3,[sp,#88]
add r7,sp,#24
stm sp,{r0,r1,r2,r3}
mov r0,r6
ldm r7,{r1,r3}
ldr r2,[sp,#20]
bl func_00175870
.Lstore_00167B90:
str r0,[r4,#28]
str r5,[r4,#32]
add sp,sp,#124
pop {r4,r5,r6,r7,pc}
.Lswapped_00167B90:
add r0,sp,#20
vldmia r0,{s0-s1}
mov r0,r1
vcvt.f32.s32 s3,s0
vmov.f32 s0,s4
vcvt.f32.s32 s2,s1
vmov.f32 s1,s0
bl func_00175D58
nop
nop
b .Llayout_ready_00167B90
.Lfallback_00167B90:
ldr r2,.Lpool_00167B90+8
mov r1,#240
str r5,[sp,#104]
add r3,r1,#34816
str r5,[sp,#96]
strh r2,[sp,#104]
mov r0,#400
str r5,[sp,#100]
str r5,[sp,#116]
strh r3,[sp,#106]
mov r12,#131072
mov r7,#196608
strd r0,[sp,#96]
add r3,sp,#20
str r7,[sp,#112]
str r12,[sp,#108]
strb r5,[sp,#116]
ldm r3,{r1,r2}
add r0,sp,#96
str r1,[sp,#100]
ldr r1,[sp,#28]
str r2,[sp,#96]
strh r1,[sp,#104]
ldr r1,[sp,#32]
strh r1,[sp,#106]
ldr r1,[sp,#36]
str r1,[sp,#108]
ldr r1,[sp,#40]
str r1,[sp,#112]
mov r1,r6
bl service_layout_fallback_secondary_55
nop
nop
b .Lstore_00167B90
END func_00167B90
.Lpool_00167B90:
.word service_zero_scalar_51
.word ipc_unit_scalar_54
.word ipc_default_flags_54

BEGIN func_00167D44
push {r4,r5,r6,r7,r8,lr}
sub sp,sp,#80
mov r4,r0
ldr r5,[sp,#104]
mov r7,r1
mov r8,r2
mov r6,r3
add r0,sp,#4
bl func_00167B00
cmp r5,#0
beq .Lloaded_00167D44
mov r2,#76
mov r1,r5
add r0,sp,#4
bl func_00144D28
.Lloaded_00167D44:
ldrb r0,[sp,#4]
ldrb r1,[r4,#12]
vldr s4,.Lpool_00167D44
strb r0,[r4,#4]
ldr r2,[sp,#20]
cmp r1,#0
vldr s5,.Lpool_00167D44+4
str r2,[r4,#16]
ldr r1,[sp,#72]
str r1,[r4,#8]
ldr r1,[sp,#16]
str r1,[r4,#20]
moveq r1,#2
strbeq r1,[r4,#12]
cmp r0,#1
add r1,r4,#36
beq .Lswapped_00167D44
cmp r0,#2
bne .Lnormal_00167D44
ldrb r0,[r4,#12]
cmp r0,#1
beq .Lswapped_00167D44
.Lnormal_00167D44:
add r0,sp,#8
vldmia r0,{s0-s1}
mov r0,r1
vcvt.f32.s32 s2,s0
vmov.f32 s0,s4
vcvt.f32.s32 s3,s1
vmov.f32 s1,s0
bl func_00175D58
.Llayout_ready_00167D44:
add r1,r1,#20
mov r5,r6
vstmia r1,{s4-s5}
ldr r0,[sp,#20]
cmp r0,#0
beq .Lalternate_00167D44
ldr r0,[sp,#36]
ldr r3,[sp,#28]
mov r1,r6
str r0,[sp]
ldr r2,[sp,#20]
mov r0,r8
bl func_00175978
.Lobject_ready_00167D44:
str r0,[r4,#28]
ldr r6,[r7,#4]
mov r7,#4
ldr r0,[r6]
ldr r1,[r0,#28]
mov r0,r6
blx r1
mov r2,r0
mov r3,#1
mov r1,r7
mov r0,r6
bl func_0012B9A0
cmp r0,#0
str r0,[r4,#32]
ldreq r4,.Lpool_00167D44+8
strne r5,[r0]
bne .Lreturn_00167D44
.Lretry_00167D44:
ldr r1,[r4,#108]
cmp r1,#0
ldrne r0,.Lpool_00167D44+12
blxne r1
b .Lretry_00167D44
.Lswapped_00167D44:
add r0,sp,#8
vldmia r0,{s0-s1}
mov r0,r1
vcvt.f32.s32 s3,s0
vmov.f32 s0,s4
vcvt.f32.s32 s2,s1
vmov.f32 s1,s0
bl func_00175D58
nop
nop
b .Llayout_ready_00167D44
.Lalternate_00167D44:
mov r1,r6
mov r0,r8
bl func_0017492C
nop
nop
b .Lobject_ready_00167D44
.Lreturn_00167D44:
add sp,sp,#80
pop {r4,r5,r6,r7,r8,pc}
END func_00167D44
.Lpool_00167D44:
.word service_zero_scalar_51
.word ipc_unit_scalar_54
.word ipc_render_context_54
.word ipc_layout_callback_context_55

BEGIN func_00167EE0
push {r4,r5,r6,r7,r8,r9,lr}
mov r6,r0
cmp r1,#3
sub sp,sp,#12
ldr r0,[r0,#376]
mov r8,r2
mov r5,r3
bcs .Linvalid_00167EE0
add r1,r0,r1,lsl #2
ldr r0,[r0,#8]
ldr r1,[r1,#40]
ldrh r2,[r0,#4]
cmp r1,r2
bcs .Linvalid_00167EE0
ldr r0,[r0]
add r4,r0,r1,lsl #6
ldrb r0,[r4,#4]
cmp r0,#0
bne .Lvalidated_00167EE0
.Linvalid_00167EE0:
mov r4,#0
.Lvalidated_00167EE0:
cmp r5,#0
cmpne r4,#0
beq .Lreturn_00167EE0
mov r0,r4
bl func_0016B654
mov r9,r0
mov r0,r4
bl func_0016B6A4
mov r4,r0
ldr r0,[r6,#376]
mov r1,#4
bl func_0013E9CC
nop
nop
bl func_00157FBC
mul r0,r9,r4
ldr r2,[r8]
add r6,sp,#4
lsl r12,r0,#2
asr r0,r4,#31
add r2,r2,#12
add r0,r4,r0,lsr #29
asr r1,r0,#3
mov r0,r5
ldm r2,{r3,r5}
lsl r4,r1,#8
str r4,[sp]
mov r2,#0
rsb r1,r1,r5,lsr #3
lsl r1,r1,#8
stm r6,{r1,r12}
mov r1,r2
bl func_00157C04
.Lreturn_00167EE0:
add sp,sp,#12
pop {r4,r5,r6,r7,r8,r9,pc}
END func_00167EE0

BEGIN func_00167FF8
push {r4,r5,r6,r7,r8,lr}
mov r6,r0
cmp r1,#3
ldr r0,[r0,#376]
mov r7,r2
mov r5,#0
bcs .Lreturn_00167FF8
add r1,r0,r1,lsl #2
ldr r0,[r0,#8]
ldr r1,[r1,#40]
ldrh r2,[r0,#4]
cmp r1,r2
bcs .Lreturn_00167FF8
ldr r0,[r0]
add r4,r0,r1,lsl #6
ldrb r0,[r4,#4]
cmp r0,#0
cmpne r4,#0
beq .Lreturn_00167FF8
cmp r7,#0
beq .Lreturn_00167FF8
ldr r0,[r4,#28]
ldr r1,[r0]
ldr r1,[r1,#16]
blx r1
ldr r8,[r0,#20]
ldr r0,[r4,#20]
ldr r1,.Lpool_00167FF8
cmp r0,r1
sub r1,r0,r1
beq .Lscale_two_00167FF8
bgt .Labove_tag_00167FF8
sub r0,r0,#32768
subs r0,r0,#81
beq .Lscale_four_00167FF8
cmp r0,#5
bne .Lscale_ready_00167FF8
b .Lscale_two_00167FF8
.Labove_tag_00167FF8:
cmp r1,#1
beq .Lscale_four_00167FF8
sub r0,r1,#3328
subs r0,r0,#11
bne .Lscale_ready_00167FF8
b .Lscale_two_00167FF8
.Lscale_four_00167FF8:
mov r5,#4
b .Lscale_ready_00167FF8
.Lscale_two_00167FF8:
mov r5,#2
.Lscale_ready_00167FF8:
ldr r1,[r4,#8]
ldr r0,[r6,#376]
bl func_0013E9CC
cmp r0,#0
nop
beq .Lreturn_00167FF8
mov r0,r4
bl func_0016B654
mov r6,r0
mov r0,r4
bl func_0016B6A4
mul r0,r6,r0
mul r4,r0,r5
bl func_00157FBC
mov r2,r4
mov r1,r8
mov r0,r7
pop {r4,r5,r6,r7,r8,lr}
b func_0016E0C8
.Lreturn_00167FF8:
pop {r4,r5,r6,r7,r8,pc}
END func_00167FF8
.Lpool_00167FF8:
.word ipc_layout_record_tag_55
