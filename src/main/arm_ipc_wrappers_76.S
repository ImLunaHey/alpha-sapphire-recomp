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

.global func_00184990,func_00302108,func_001888A8,func_00190888
.global ipc_record_vtable_76,ipc_allocator_dispatch_owner_68
.global ipc_service_record_table_76,ipc_u32_float_limit_76
.global ipc_dimension_scale_76

BEGIN func_0018E080
ldr r1,.Lrecord_vtable_0018E080
push {r4,r5,r6,lr}
sub sp,sp,#8
str r1,[r0],#4
mov r4,r0
mov r2,#0
str r2,[r0,#4]!
mov r1,#16
str r2,[r0,#4]
str r2,[r0,#8]
str r1,[sp]
ldr r0,[r4,#4]
ldr r2,[r4,#12]
sub r2,r2,r0
cmp r1,r2,asr #3
bls .Lcontainer_done_0018E080
ldr r2,[r4,#8]
ldr r3,[sp]
mov r1,sp
sub r0,r2,r0
asr r0,r0,#3
add r2,r0,r0,lsr #1
add r2,r2,r0,lsr #3
add r0,r0,#32
cmp r0,r2
movhi r2,r0
cmp r3,r2
add r0,sp,#4
movlo r1,r0
str r2,[sp,#4]
ldr r6,[r1]
lsl r0,r6,#3
bl func_00184990
add r3,r4,#4
mov r5,r0
ldm r3,{r1,r3}
cmp r1,r3
beq .Lcopy_done_0018E080
.Lcopy_loop_0018E080:
cmp r0,#0
beq .Lcopy_advance_0018E080
ldrb r12,[r1]
strb r12,[r0]
ldr r12,[r1,#4]
str r12,[r0,#4]
.Lcopy_advance_0018E080:
add r1,r1,#8
cmp r1,r3
add r0,r0,#8
bne .Lcopy_loop_0018E080
.Lcopy_done_0018E080:
ldr r0,[r4,#8]
ldr r1,[r4,#4]
cmp r0,r1
movls r3,#0
bls .Lrelease_count_0018E080
sub r2,r0,r1
lsl r2,r2,#28
lsr r3,r2,#31
.Lrelease_count_0018E080:
sub r12,r0,r1
mov r2,#1
add r0,r3,#1
add r3,r2,r12,asr #3
cmp r3,r0
addgt r2,r2,r12,asr #3
ble .Lrelease_ready_0018E080
.Lrelease_adjust_0018E080:
add r0,r0,#2
cmp r2,r0
bgt .Lrelease_adjust_0018E080
.Lrelease_ready_0018E080:
cmp r1,#0
beq .Lpublish_store_0018E080
ldr r2,[r1,#-8]!
mov r0,r1
cmp r2,#0
beq .Ldefault_release_0018E080
blx r2
b .Lpublish_store_0018E080
.Ldefault_release_0018E080:
nop
bl func_00302108
.Lpublish_store_0018E080:
ldr r0,[r4,#8]
ldr r1,[r4,#4]
str r5,[r4,#4]
sub r0,r0,r1
bic r0,r0,#7
add r1,r5,r6,lsl #3
add r0,r0,r5
strd r0,r1,[r4,#8]
.Lcontainer_done_0018E080:
add sp,sp,#8
sub r0,r4,#4
pop {r4,r5,r6,pc}
END func_0018E080
.Lrecord_vtable_0018E080:
.word ipc_record_vtable_76

BEGIN func_0018E480
ldr r1,.Lallocator_owner_0018E480
rsb r2,r0,r0,lsl #3
push {r4,lr}
ldr r3,.Lrecord_table_0018E480
ldrb r0,[r1,#13]
add r4,r3,r2,lsl #6
cmp r0,#0
beq .Lfallback_record_0018E480
ldr r0,[r1,#148]
bl func_001888A8
ldr r0,[r0]
cmp r0,#0
beq .Lfallback_record_0018E480
add r0,r0,r0,lsl #3
ldr r1,[r4,#8]
add r0,r0,r0,lsl #1
add r0,r1,r0,lsl #3
pop {r4,pc}
.Lfallback_record_0018E480:
add r0,r4,#16
pop {r4,pc}
END func_0018E480
.Lallocator_owner_0018E480:
.word ipc_allocator_dispatch_owner_68
.Lrecord_table_0018E480:
.word ipc_service_record_table_76

BEGIN func_0018EAD8
push {r4,r5,r6,lr}
mov r4,r0
ldr r1,[r0,#12]
ldr r0,[r0,#4]
ldr lr,.Lu32_float_limit_a_0018EAD8
vldr s0,.Lu32_float_limit_b_0018EAD8
vmov s1,r0
vldr s2,.Ldimension_scale_0018EAD8
add r2,r4,#48
ldm r2,{r2,r3,r12}
vcvt.f32.u32 s1,s1
vmov r5,s1
cmp r5,lr
vmovgt s1,r0
add r5,r4,#240
stm r5,{r0,r1,r2,r3,r12}
lsl r2,r2,#2
lsl r3,r3,#2
vcvtgt.f32.u32 s1,s1
vmovle.f32 s1,s0
vmul.f32 s1,s1,s2
vcvt.u32.f32 s1,s1
vmov r0,s1
vmov s1,r1
add r0,r0,r0,lsl #2
lsl r0,r0,#7
vcvt.f32.u32 s1,s1
vmov r5,s1
cmp r5,lr
vmovgt s0,r1
ldr r5,[r4,#40]
lsl lr,r12,#2
add r12,r5,#31
bic r12,r12,#31
vcvtgt.f32.u32 s0,s0
str r12,[r4,#60]
add r12,r12,r0
str r12,[r4,#76]
vmul.f32 s0,s0,s2
vcvt.u32.f32 s0,s0
vmov r1,s0
add r1,r1,r1,lsl #2
lsl r1,r1,#7
add r12,r12,r1
str r12,[r4,#92]
add r12,r12,r2
str r12,[r4,#96]
add r12,r12,r3
str r12,[r4,#124]
add r12,r12,lr
add r0,r0,r12
str r12,[r4,#64]
str r0,[r4,#80]
add r0,r0,r1
str r0,[r4,#100]
add r0,r0,r2
str r0,[r4,#104]
add r0,r0,r3
str r0,[r4,#128]
mov r0,r4
bl func_00190888
mov r0,#1
strb r0,[r4,#260]
pop {r4,r5,r6,pc}
END func_0018EAD8
.Lu32_float_limit_a_0018EAD8:
.word ipc_u32_float_limit_76
.Lu32_float_limit_b_0018EAD8:
.word ipc_u32_float_limit_76
.Ldimension_scale_0018EAD8:
.word ipc_dimension_scale_76

BEGIN func_0018F43C
push {r4,r5,r6,lr}
movs r4,r0
ldrne r0,[r4,#28]
cmpne r0,#0
beq .Linvalid_record_0018F43C
ldr r5,[r0,#4]
cmp r5,#42
cmpne r5,#69
beq .Lvalid_kind_0018F43C
cmp r5,#73
cmpne r5,#91
beq .Lvalid_kind_0018F43C
cmp r5,#103
cmpne r5,#113
subne r1,r5,#512
subsne r1,r1,#154
beq .Lvalid_kind_0018F43C
.Linvalid_record_0018F43C:
mvn r0,#1
pop {r4,r5,r6,pc}
.Lvalid_kind_0018F43C:
ldr r1,[r0,#8]
cmp r1,#0
beq .Lcallback_44_0018F43C
ldr r2,[r4,#36]
ldr r0,[r4,#40]
blx r2
.Lcallback_44_0018F43C:
ldr r0,[r4,#28]
ldr r1,[r0,#68]
cmp r1,#0
beq .Lcallback_40_0018F43C
ldr r2,[r4,#36]
ldr r0,[r4,#40]
blx r2
.Lcallback_40_0018F43C:
ldr r0,[r4,#28]
ldr r1,[r0,#64]
cmp r1,#0
beq .Lcallback_38_0018F43C
ldr r2,[r4,#36]
ldr r0,[r4,#40]
blx r2
.Lcallback_38_0018F43C:
ldr r0,[r4,#28]
ldr r1,[r0,#56]
cmp r1,#0
beq .Lrelease_record_0018F43C
ldr r2,[r4,#36]
ldr r0,[r4,#40]
blx r2
.Lrelease_record_0018F43C:
ldr r2,[r4,#36]
ldr r0,[r4,#40]
ldr r1,[r4,#28]
blx r2
mov r0,#0
cmp r5,#113
str r0,[r4,#28]
mvneq r0,#2
movne r0,#0
pop {r4,r5,r6,pc}
END func_0018F43C
