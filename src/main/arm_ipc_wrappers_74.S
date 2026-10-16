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

.global func_00179DD0,func_0017A110,func_00188184,func_0018F344
.global func_0018EC24,func_0017A8A8,service_factory_secondary_74
.global ipc_shared_control_owner_72,ipc_unit_scalar_54
.global arm_duplicate_templates_17_scale_b,service_zero_scalar_51
.global ipc_negative_unit_bound_74,ipc_sample_mode_owner_74
.global ipc_primary_sample_table_74,ipc_secondary_sample_table_74
.global ipc_sample_stride_74,ipc_upper_clamp_74
.global ipc_multi_factory_secondary_74,ipc_single_factory_secondary_74

BEGIN func_0018C2D4
push {r4,r5,r6,lr}
mov r4,r1
ldrh r1,[r2,#2]
add r0,r0,r4
mov r5,r2
cmp r1,#0
movne r1,#1
strb r1,[r0,#6]
bl func_00179DD0
mov r2,r5
mov r1,r4
pop {r4,r5,r6,lr}
mov r0,r0
ldrh r3,[r2]
add r12,r1,r1,lsl #2
add r12,r12,r1,lsl #3
tst r3,#1
ldrhne r3,[r2,#2]
add r0,r0,r12,lsl #2
strhne r3,[r0,#42]
ldrh r3,[r2]
tst r3,#4
beq .Lflags_two_0018C2D4
ldrh r3,[r2,#6]
strh r3,[r0,#46]
ldrh r3,[r2,#28]
strh r3,[r0,#68]
ldrh r3,[r2,#30]
strh r3,[r0,#70]
ldrh r3,[r2,#32]
strh r3,[r0,#72]
ldrh r3,[r2,#34]
strh r3,[r0,#74]
ldrh r3,[r2,#36]
strh r3,[r0,#76]
ldrh r3,[r2,#38]
strh r3,[r0,#78]
ldrh r3,[r2,#40]
strh r3,[r0,#80]
ldrh r3,[r2,#42]
strh r3,[r0,#82]
ldrh r3,[r2,#44]
strh r3,[r0,#84]
ldrh r3,[r2,#46]
strh r3,[r0,#86]
ldrh r3,[r2,#48]
strh r3,[r0,#88]
ldrh r3,[r2,#50]
strh r3,[r0,#90]
.Lflags_two_0018C2D4:
ldrh r3,[r2]
tst r3,#2
beq .Lpublish_0018C2D4
ldr r3,[r2,#8]
str r3,[r0,#48]
ldr r3,[r2,#12]
str r3,[r0,#52]
ldr r3,[r2,#16]
str r3,[r0,#56]
ldr r3,[r2,#20]
str r3,[r0,#60]
ldr r3,[r2,#24]
str r3,[r0,#64]
.Lpublish_0018C2D4:
ldr r0,.Lshared_control_0018C2D4
b func_0017A110
END func_0018C2D4
.Lshared_control_0018C2D4:
.word ipc_shared_control_owner_72

BEGIN func_0018C8E0
vldr s1,.Lunit_0018C8E0
vldr s2,.Lnegative_unit_0018C8E0
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
vmovgt.f32 s0,s1
bgt .Linput_clamped_0018C8E0
vcmpe.f32 s0,s2
vmrs APSR_nzcv,fpscr
vmovcc.f32 s0,s2
.Linput_clamped_0018C8E0:
vldr s3,.Lhalf_0018C8E0
ldrb r1,[r0,#3]
cmp r1,#0
vadd.f32 s0,s0,s1
ldrb r1,[r0]
vmul.f32 s0,s0,s3
bne .Ltable_ready_0018C8E0
ldr r2,.Lmode_owner_0018C8E0
ldrb r2,[r2,#1]
cmp r2,#2
ldreq r2,.Lprimary_table_0018C8E0
beq .Ltable_selected_0018C8E0
.Ltable_ready_0018C8E0:
ldr r2,.Lsecondary_table_0018C8E0
.Ltable_selected_0018C8E0:
vldr s4,.Lstride_0018C8E0
vldr s2,.Lzero_0018C8E0
vmla.f32 s3,s0,s4
ldr r1,[r2,r1,lsl #2]
ldrb r2,[r0,#1]
cmp r2,#0
vcvt.s32.f32 s0,s3
vmov r2,s0
add r2,r1,r2,lsl #2
vldr s0,[r2]
beq .Lbound_mode_0018C8E0
vldr s4,[r1,#512]
vdiv.f32 s3,s0,s4
vmov.f32 s0,s3
.Lbound_mode_0018C8E0:
ldrb r0,[r0,#2]
cmp r0,#0
beq .Lalternate_bound_0018C8E0
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
bgt .Lreturn_unit_0018C8E0
vcmpe.f32 s0,s2
vmrs APSR_nzcv,fpscr
bcs .Lreturn_0018C8E0
b .Lreturn_zero_0018C8E0
.Lalternate_bound_0018C8E0:
vldr s1,.Lupper_0018C8E0
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
ble .Lalternate_lower_0018C8E0
.Lreturn_unit_0018C8E0:
vmov.f32 s0,s1
.Lreturn_0018C8E0:
bx lr
.Lalternate_lower_0018C8E0:
vcmpe.f32 s0,s2
vmrs APSR_nzcv,fpscr
bcs .Lreturn_0018C8E0
.Lreturn_zero_0018C8E0:
vmov.f32 s0,s2
bx lr
END func_0018C8E0
.Lunit_0018C8E0:
.word ipc_unit_scalar_54
.Lnegative_unit_0018C8E0:
.word ipc_negative_unit_bound_74
.Lhalf_0018C8E0:
.word arm_duplicate_templates_17_scale_b
.Lmode_owner_0018C8E0:
.word ipc_sample_mode_owner_74
.Lprimary_table_0018C8E0:
.word ipc_primary_sample_table_74
.Lsecondary_table_0018C8E0:
.word ipc_secondary_sample_table_74
.Lstride_0018C8E0:
.word ipc_sample_stride_74
.Lzero_0018C8E0:
.word service_zero_scalar_51
.Lupper_0018C8E0:
.word ipc_upper_clamp_74

BEGIN func_0018C9E8
vldr s2,.Lupper_0018C9E8
vldr s1,.Lzero_0018C9E8
vcmpe.f32 s0,s2
vmrs APSR_nzcv,fpscr
vmovgt.f32 s0,s2
bgt .Linput_clamped_0018C9E8
vmov.f32 s3,s1
vcmpe.f32 s0,s3
vmrs APSR_nzcv,fpscr
vmovcc.f32 s0,s1
.Linput_clamped_0018C9E8:
vldr s3,.Lhalf_0018C9E8
vldr s4,.Lstride_0018C9E8
ldrb r0,[r0]
ldr r1,.Lsample_table_0018C9E8
vmul.f32 s0,s0,s3
ldr r0,[r1,r0,lsl #2]
vmla.f32 s3,s0,s4
vcvt.s32.f32 s0,s3
vmov r1,s0
add r0,r0,r1,lsl #2
vldr s0,[r0]
vcmpe.f32 s0,s2
vmrs APSR_nzcv,fpscr
vmovgt.f32 s0,s2
bgt .Lreturn_0018C9E8
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
vmovcc.f32 s0,s1
.Lreturn_0018C9E8:
bx lr
END func_0018C9E8
.Lupper_0018C9E8:
.word ipc_upper_clamp_74
.Lzero_0018C9E8:
.word service_zero_scalar_51
.Lhalf_0018C9E8:
.word arm_duplicate_templates_17_scale_b
.Lstride_0018C9E8:
.word ipc_sample_stride_74
.Lsample_table_0018C9E8:
.word ipc_secondary_sample_table_74

BEGIN func_0018CB5C
push {r4,r5,r6,r7,r8,r9,r10,r11,r12,lr}
cmp r1,#2
mov r4,r0
mov r8,r3
movgt r7,#2
vpush {d8}
vldr s16,[sp,#48]
bgt .Lcount_ready_0018CB5C
cmp r1,#1
movlt r7,#1
movge r7,r1
.Lcount_ready_0018CB5C:
mov r11,#1
mov r10,#0
strb r11,[r4,#26]
usat r9,#15,r2
str r10,[r4,#8]
cmp r7,#1
strb r10,[r4,#27]
beq .Lsingle_0018CB5C
cmp r7,#0
mov r6,#0
ble .Lpost_allocate_0018CB5C
.Lmulti_loop_0018CB5C:
ldr r1,.Lmulti_factory_0018CB5C
mov r2,r4
mov r0,r9
bl service_factory_secondary_74
movs r5,r0
nop
beq .Lretry_0018CB5C
b .Lstore_member_0018CB5C
.Lsingle_0018CB5C:
mov r2,r0
ldr r1,.Lsingle_factory_0018CB5C
mov r0,r9
bl service_factory_secondary_74
cmp r0,#0
strne r0,[r4]
strne r11,[r4,#8]
beq .Lfailure_return_0018CB5C
b .Linitialize_0018CB5C
.Lretry_0018CB5C:
nop
bl func_00188184
mov r1,r9
nop
bl func_0018F344
cmp r0,#0
nop
bne .Lmulti_loop_0018CB5C
strb r11,[r4,#27]
.Lstore_member_0018CB5C:
str r5,[r4,r6,lsl #2]
ldr r0,[r4,#8]
add r6,r6,#1
cmp r6,r7
add r0,r0,#1
str r0,[r4,#8]
blt .Lmulti_loop_0018CB5C
.Lpost_allocate_0018CB5C:
ldrb r0,[r4,#27]
cmp r0,#0
beq .Linitialize_0018CB5C
ldr r0,[r4,#8]
mov r5,#0
cmp r0,#0
ble .Lcleanup_done_0018CB5C
.Lcleanup_loop_0018CB5C:
ldr r0,[r4,r5,lsl #2]
cmp r0,#0
blne func_0018EC24
ldr r0,[r4,#8]
add r5,r5,#1
cmp r0,r5
bgt .Lcleanup_loop_0018CB5C
.Lcleanup_done_0018CB5C:
mov r0,#0
.Lfailure_return_0018CB5C:
vpop {d8}
pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
.Linitialize_0018CB5C:
strb r10,[r4,#26]
strh r10,[r4,#32]
strb r10,[r4,#23]
strb r10,[r4,#24]
vldr s0,.Lunit_0018CB5C
strb r10,[r4,#22]
str r10,[r4,#28]
vstr s0,[r4,#36]
vldr s1,.Lzero_0018CB5C
vstr s0,[r4,#56]
strb r10,[r4,#34]
vstr s1,[r4,#60]
vstr s1,[r4,#48]
vstr s1,[r4,#52]
vstr s0,[r4,#68]
str r8,[r4,#12]
vstr s16,[r4,#16]
vstr s1,[r4,#72]
vstr s1,[r4,#76]
vstr s0,[r4,#40]
strb r10,[r4,#44]
strb r10,[r4,#45]
strb r11,[r4,#20]
mov r0,#1
vpop {d8}
pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
END func_0018CB5C
.Lmulti_factory_0018CB5C:
.word ipc_multi_factory_secondary_74
.Lsingle_factory_0018CB5C:
.word ipc_single_factory_secondary_74
.Lunit_0018CB5C:
.word ipc_unit_scalar_54
.Lzero_0018CB5C:
.word service_zero_scalar_51

BEGIN func_0018CCF4
add r0,r0,#476
add r1,r1,#4
b func_0017A8A8
END func_0018CCF4
