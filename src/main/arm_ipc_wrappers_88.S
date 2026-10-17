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

.global func_00188548
.global func_00188644
.global func_001824D4
.global func_00188728
.global service_record_domain_88
.global service_record_attribute_88
.global service_record_fallback_domain_88
.global service_zero_scalar_51
.global service_state_initial_limit_88
.global service_curve_lower_threshold_88
.global ipc_unit_scalar_54
.global service_curve_upper_threshold_88
.global service_curve_index_scale_88
.global service_curve_halfword_table_88
.global service_exponent_period_limit_88
.global service_exponent_signed_reciprocal_88
.global ipc_upper_clamp_74
.global arm_duplicate_templates_17_scale_b
.global service_exponent_coarse_table_88
.global service_exponent_fine_table_88
.global service_angle_upper_limit_88
.global service_angle_lower_limit_88
.global service_angle_index_scale_88
.global service_angle_lookup_table_88

BEGIN func_001801CC
cmp r1,#0
mov r3,r1
str r1,[r0]
beq .Lempty_001801CC
add r2,r0,#24
add r1,r0,#20
mov r0,r3
b .Lquery_001801CC
.Lempty_001801CC:
bx lr
.Lquery_001801CC:
push {r4,r5,r6,r7,r8,r9,lr}
mov r5,r1
mov r1,r0
sub sp,sp,#12
ldr r7,.Ldomain_001801CC
mov r4,r2
mov r0,r7
bl func_00188548
ldr r8,.Lattribute_001801CC
cmp r5,#0
sub r9,r7,#111
orr r6,r7,r7,asr #15
beq .Lsecond_001801CC
mov r3,sp
mov r2,r9
sub r1,r6,#97
mov r0,r7
bl func_00188644
ldr r1,[sp]
mov r0,r6
bl func_001824D4
add r2,sp,#4
mov r1,r8
mov r0,r6
bl func_00188728
ldr r0,[sp,#4]
str r0,[r5]
.Lsecond_001801CC:
cmp r4,#0
beq .Ldone_001801CC
ldr r2,.Lfallback_domain_001801CC
mov r3,sp
mov r1,#36096
mov r0,r7
bl func_00188644
ldr r0,[sp]
cmp r0,#0
beq .Lstore_second_001801CC
add r3,sp,#4
mov r2,r9
mov r1,#36096
mov r0,r7
bl func_00188644
ldr r1,[sp,#4]
mov r0,r6
bl func_001824D4
add r2,sp,#8
mov r1,r8
mov r0,r6
bl func_00188728
ldr r0,[sp,#8]
.Lstore_second_001801CC:
str r0,[r4]
.Ldone_001801CC:
add sp,sp,#12
pop {r4,r5,r6,r7,r8,r9,pc}
END func_001801CC
.Ldomain_001801CC:
.word service_record_domain_88
.Lattribute_001801CC:
.word service_record_attribute_88
.Lfallback_domain_001801CC:
.word service_record_fallback_domain_88

BEGIN func_001803E0
vldr s0,.Lzero_001803E0
vldr s1,.Linitial_limit_001803E0
mov r1,#0
vstmia r0,{s0-s1}
mov r2,#1
str r1,[r0,#8]
strb r2,[r0,#12]
strb r1,[r0,#13]
strb r1,[r0,#14]
bx lr
END func_001803E0
.Lzero_001803E0:
.word service_zero_scalar_51
.Linitial_limit_001803E0:
.word service_state_initial_limit_88

BEGIN func_0018043C
vldr s1,.Lunit_0018043C
vldr s2,.Lzero_0018043C
ldr r1,.Llower_bits_0018043C
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
vmovgt.f32 s0,s1
bgt .Lupper_endpoint_0018043C
vmov.f32 s1,s0
vcmpe.f32 s1,s2
vmrs APSR_nzcv,fpscr
bcc .Llower_endpoint_0018043C
vmov r0,s0
cmp r0,r1
bge .Lupper_endpoint_0018043C
.Llower_endpoint_0018043C:
mov r0,#80
.Llower_return_0018043C:
bx lr
.Lupper_endpoint_0018043C:
ldr r1,.Lupper_bits_0018043C
vmov r0,s0
cmp r1,r0
movle r0,#16000
ble .Llower_return_0018043C
ldr r1,.Lcurve_table_0018043C
vldr s1,.Llower_scalar_0018043C
vldr s2,.Lindex_scale_0018043C
vsub.f32 s0,s0,s1
vmul.f32 s0,s0,s2
vcvt.s32.f32 s0,s0
vmov r0,s0
add r0,r1,r0,lsl #1
ldrh r0,[r0]
.Lreturn_0018043C:
bx lr
END func_0018043C
.Llower_bits_0018043C:
.word service_curve_lower_threshold_88
.Lunit_0018043C:
.word ipc_unit_scalar_54
.Lzero_0018043C:
.word service_zero_scalar_51
.Lupper_bits_0018043C:
.word service_curve_upper_threshold_88
.Llower_scalar_0018043C:
.word service_curve_lower_threshold_88
.Lindex_scale_0018043C:
.word service_curve_index_scale_88
.Lcurve_table_0018043C:
.word service_curve_halfword_table_88

BEGIN func_001804D4
ldr r3,.Lperiod_limit_001804D4
ldr r2,.Lsigned_reciprocal_001804D4
mov r1,#0
sub r3,r3,r0
cmp r3,#3072
blt .Lreduce_negative_001804D4
smull r3,r1,r2,r3
asr r3,r1,#9
sub r1,r3,r1,asr #31
add r3,r1,r1,lsl #1
rsb r1,r1,#0
add r0,r0,r3,lsl #10
.Lreduce_negative_001804D4:
rsb r3,r0,#0
smull r12,r3,r2,r3
asr r12,r3,#9
sub r3,r12,r3,asr #31
rsb r3,r3,#0
cmp r3,#0
ble .Lsplit_fraction_001804D4
smull r3,r2,r2,r0
asr r3,r2,#9
sub r2,r3,r2,asr #31
add r1,r1,r2
sub r3,r2,r2,lsl #2
add r0,r0,r3,lsl #10
.Lsplit_fraction_001804D4:
vldr s0,.Lunit_001804D4
asr r2,r0,#31
cmp r1,#0
add r2,r0,r2,lsr #24
asr r2,r2,#8
rsb r3,r2,#0
add r3,r0,r3,lsl #8
ble .Lnegative_power_001804D4
tst r1,#1
vldr s1,.Ldouble_001804D4
vmovne.f32 s0,s1
asrs r0,r1,#1
beq .Lclear_power_001804D4
.Lpositive_loop_001804D4:
subs r0,r0,#1
vmul.f32 s0,s0,s1
vmul.f32 s0,s0,s1
bne .Lpositive_loop_001804D4
.Lclear_power_001804D4:
sub r1,r1,r1
.Lnegative_power_001804D4:
rsb r0,r1,#0
vldr s1,.Lhalf_001804D4
cmp r0,#0
ble .Lcoarse_lookup_001804D4
tst r1,#1
vmulne.f32 s0,s0,s1
asrs r0,r0,#1
beq .Lcoarse_lookup_001804D4
.Lnegative_loop_001804D4:
subs r0,r0,#1
vmul.f32 s0,s0,s1
vmul.f32 s0,s0,s1
bne .Lnegative_loop_001804D4
.Lcoarse_lookup_001804D4:
cmp r2,#0
beq .Lfine_lookup_001804D4
ldr r0,.Lcoarse_table_001804D4
add r0,r0,r2,lsl #2
vldr s1,[r0]
vmul.f32 s0,s1,s0
.Lfine_lookup_001804D4:
cmp r3,#0
beq .Lreturn_001804D4
ldr r0,.Lfine_table_001804D4
add r0,r0,r3,lsl #2
vldr s1,[r0]
vmul.f32 s0,s1,s0
.Lreturn_001804D4:
bx lr
END func_001804D4
.Lperiod_limit_001804D4:
.word service_exponent_period_limit_88
.Lsigned_reciprocal_001804D4:
.word service_exponent_signed_reciprocal_88
.Lunit_001804D4:
.word ipc_unit_scalar_54
.Ldouble_001804D4:
.word ipc_upper_clamp_74
.Lhalf_001804D4:
.word arm_duplicate_templates_17_scale_b
.Lcoarse_table_001804D4:
.word service_exponent_coarse_table_88
.Lfine_table_001804D4:
.word service_exponent_fine_table_88

BEGIN func_00180600
vldr s2,.Lupper_00180600
vldr s1,.Llower_00180600
vcmpe.f32 s0,s2
vmrs APSR_nzcv,fpscr
vmovgt.f32 s0,s2
bgt .Lquantize_00180600
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
vmovcc.f32 s0,s1
.Lquantize_00180600:
vldr s1,.Lscale_00180600
ldr r1,.Ltable_00180600
vmul.f32 s0,s0,s1
vcvt.s32.f32 s0,s0
vmov r0,s0
add r0,r0,#904
add r0,r1,r0,lsl #2
vldr s0,[r0]
bx lr
END func_00180600
.Lupper_00180600:
.word service_angle_upper_limit_88
.Llower_00180600:
.word service_angle_lower_limit_88
.Lscale_00180600:
.word service_angle_index_scale_88
.Ltable_00180600:
.word service_angle_lookup_table_88
