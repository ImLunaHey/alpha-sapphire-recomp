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

.global func_0012B9A0,func_00176CFC,func_0016DFE8,func_0014E240
.global ipc_scene_type_token_56,ipc_alpha_scale_56
.global arm_duplicate_templates_17_scale_b,ipc_allocator_descriptor_a_56
.global service_zero_scalar_51,ipc_request_record_tag_56
.global ipc_allocator_descriptor_b_56,ipc_allocator_descriptor_c_56
.global ipc_request_record_tag_alt_56

BEGIN func_00168130
push {r4,r5,r6,r7,r8,lr}
mov r4,r0
mov r5,r1
ldr r0,[r0,#200]
mov r6,r2
cmp r0,#0
bne .Lreturn_00168130
ldr r0,[r4,#188]
ldr r0,[r0,#8]
ldr r0,[r0]
lsl r7,r0,#2
ldr r0,[r5]
ldr r1,[r0,#28]
mov r0,r5
blx r1
mov r2,r0
mov r3,#1
mov r1,r7
mov r0,r5
bl func_0012B9A0
str r0,[r4,#200]
ldr r0,[r4,#188]
cmp r6,#0
mov r8,#4
ldr r1,[r0,#8]
ldr r0,[r4,#16]
ldr r6,[r1]
ldr r7,[r0,#16]
beq .Lalternate_00168130
cmp r6,#0
mov r5,#0
bls .Lreturn_00168130
.Ldirect_loop_00168130:
ldr r1,[r4,#188]
ldr r0,[r4,#16]
ldr r1,[r1,#8]
ldr r2,[r1]
cmp r2,r5
addhi r2,r8,r5,lsl #5
addhi r1,r1,r2
ldr r2,[r0]
movls r1,#0
ldr r2,[r2,#12]
blx r2
mov r1,r0
ldr r0,[r4,#200]
str r1,[r0,r5,lsl #2]
add r5,r5,#1
cmp r5,r6
bcc .Ldirect_loop_00168130
.Lreturn_00168130:
pop {r4,r5,r6,r7,r8,pc}
.Lalternate_00168130:
cmp r6,#0
mov r5,#0
bls .Lreturn_00168130
.Lalternate_loop_00168130:
ldr r1,[r4,#188]
mov r0,r7
ldr r1,[r1,#8]
ldr r2,[r1]
cmp r2,r5
addhi r2,r8,r5,lsl #5
addhi r1,r1,r2
ldr r2,[r0]
movls r1,#0
ldr r3,[r2,#48]
mov r2,#1
blx r3
ldr r1,[r4,#200]
str r0,[r1,r5,lsl #2]
add r5,r5,#1
cmp r5,r6
bcc .Lalternate_loop_00168130
pop {r4,r5,r6,r7,r8,pc}
END func_00168130

BEGIN func_0016824C
push {r4,r5,r6,r7,r8,lr}
mov r6,#0
vpush {d8}
vmov.f32 s16,s0
ldr r4,[r0,#20]
mov r0,r4
bl func_00176CFC
cmp r0,#0
ble .Lreturn_0016824C
ldr r0,[r4]
ldr r1,[r0,#36]
mov r0,r4
blx r1
ldr r5,.Lpool_0016824C
movs r4,r0
mov r7,#0
beq .Lnot_found_0016824C
ldr r0,[r4]
ldr r1,[r0,#8]
mov r0,r4
blx r1
.Lsearch_0016824C:
cmp r0,r5
beq .Lfound_0016824C
ldr r0,[r0]
cmp r0,#0
bne .Lsearch_0016824C
.Lnot_found_0016824C:
mov r4,r7
.Lfound_0016824C:
vldr s1,.Lpool_0016824C+4
vldr s0,.Lpool_0016824C+8
ldr r0,[r4,#356]
vmla.f32 s0,s16,s1
ldr r0,[r0,r6,lsl #2]
ldr r1,[r0,#76]
add r0,r1,#648
vcvt.u32.f32 s0,s0
ldr r2,[r1,#648]
cmp r2,#0
addne r0,r0,r2
moveq r0,r7
ldr r2,[r0,#212]
vmov r3,s0
bic r2,r2,#65280
lsl r3,r3,#24
orr r2,r2,r3,lsr #16
str r2,[r0,#212]
str r7,[r1,#716]
.Lreturn_0016824C:
vpop {d8}
pop {r4,r5,r6,r7,r8,pc}
END func_0016824C
.Lpool_0016824C:
.word ipc_scene_type_token_56
.word ipc_alpha_scale_56
.word arm_duplicate_templates_17_scale_b

BEGIN func_00168478
push {r4,r5,r6,r7,lr}
mov r4,r2
mov r5,r3
ldr r0,.Lpool_00168478
mov r2,#1
vpush {d8}
sub sp,sp,#76
mov r1,#8
ldr r6,[sp,#104]
bl func_0016DFE8
ldr r7,.Lpool_00168478+8
vldr s16,.Lpool_00168478+4
mov r2,#1
str r7,[sp,#4]
vstr s16,[sp,#68]
ldr r0,[r4]
mov r1,#72
str r0,[sp,#16]
ldr r0,[r4,#4]
str r0,[sp,#12]
ldr r0,[r4,#8]
str r0,[sp,#8]
ldr r0,[r4,#12]
str r0,[sp]
ldr r0,[r4,#16]
str r0,[sp,#32]
ldr r0,[r4,#20]
str r0,[sp,#28]
ldr r0,[r4,#24]
str r0,[sp,#24]
ldr r0,[r4,#28]
str r0,[sp,#20]
ldr r0,[r4,#32]
str r0,[sp,#48]
ldr r0,[r4,#36]
str r0,[sp,#44]
ldr r0,[r4,#40]
str r0,[sp,#40]
ldr r0,[r4,#44]
str r0,[sp,#36]
ldr r0,[r4,#48]
str r0,[sp,#64]
ldr r0,[r4,#52]
str r0,[sp,#60]
ldr r0,[r4,#56]
str r0,[sp,#56]
ldr r0,[r4,#60]
str r0,[sp,#52]
mov r0,sp
bl func_0016DFE8
ldr r0,.Lpool_00168478+12
mov r2,#1
mov r1,#8
bl func_0016DFE8
str r7,[sp,#4]
vstr s16,[sp,#68]
ldr r0,[r5]
mov r2,#1
mov r1,#72
str r0,[sp,#16]
ldr r0,[r5,#4]
str r0,[sp,#12]
ldr r0,[r5,#8]
str r0,[sp,#8]
ldr r0,[r5,#12]
str r0,[sp]
ldr r0,[r5,#16]
str r0,[sp,#32]
ldr r0,[r5,#20]
str r0,[sp,#28]
ldr r0,[r5,#24]
str r0,[sp,#24]
ldr r0,[r5,#28]
str r0,[sp,#20]
ldr r0,[r5,#32]
str r0,[sp,#48]
ldr r0,[r5,#36]
str r0,[sp,#44]
ldr r0,[r5,#40]
str r0,[sp,#40]
ldr r0,[r5,#44]
str r0,[sp,#36]
ldr r0,[r5,#48]
str r0,[sp,#64]
ldr r0,[r5,#52]
str r0,[sp,#60]
ldr r0,[r5,#56]
str r0,[sp,#56]
ldr r0,[r5,#60]
str r0,[sp,#52]
mov r0,sp
bl func_0016DFE8
cmp r6,#0
beq .Lreturn_00168478
ldr r0,.Lpool_00168478+16
mov r2,#1
mov r1,#8
bl func_0016DFE8
ldr r0,.Lpool_00168478+20
add r6,r6,#76
str r0,[sp,#4]
vstr s16,[sp,#20]
ldm r6,{r0,r1,r2,r3}
str r0,[sp,#16]
str r2,[sp,#8]
str r1,[sp,#12]
mov r2,#1
mov r1,#24
mov r0,sp
str r3,[sp]
bl func_0016DFE8
.Lreturn_00168478:
add sp,sp,#76
vpop {d8}
pop {r4,r5,r6,r7,pc}
END func_00168478
.Lpool_00168478:
.word ipc_allocator_descriptor_a_56
.word service_zero_scalar_51
.word ipc_request_record_tag_56
.word ipc_allocator_descriptor_b_56
.word ipc_allocator_descriptor_c_56
.word ipc_request_record_tag_alt_56

BEGIN func_00168658
push {r4,lr}
mov r4,r0
ldrsb r0,[r0,#12]
cmp r0,#0
moveq r0,#0
beq .Lreturn_00168658
ldrh r2,[r4,#8]
ldrh r0,[r4,#10]
ldr r3,[r4,#4]
ldr r1,[r1,#4]
sub r2,r2,r0
add r0,r3,r0,lsl #1
bl func_0014E240
ldrh r1,[r4,#10]
add r0,r0,r1
uxth r0,r0
strh r0,[r4,#10]
.Lreturn_00168658:
pop {r4,pc}
END func_00168658
