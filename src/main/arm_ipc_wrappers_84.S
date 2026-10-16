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

.global fp_exception_secondary_84
.global func_001602B8
.global func_00160380
.global func_00117884
.global func_00170548
.global func_0017E644
.global ipc_nan_result_84
.global ipc_character_range_bias_a_77
.global ipc_character_range_bias_b_77
.global service_allocator_context_84
.global service_unlink_context_44

BEGIN func_0017E1E4
mov r12,#-16777216
bics r3,r12,r1,lsl #1
bicsne r2,r12,r0,lsl #1
beq .Lspecial_0017E1E4
mov r12,#16711680
tst r0,#-2147483648
and r3,r12,r1,lsr #7
orrne r3,r3,#5
ands r2,r12,r0,lsr #7
tstne r3,r12
beq .Lnan_0017E1E4
mov r12,#-2147483648
orr r0,r12,r0,lsl #8
orr r1,r12,r1,lsl #8
sub r3,r3,#65536
.Lcompare_0017E1E4:
cmp r2,r3
ble .Laligned_0017E1E4
cmp r0,#-2147483648
bic r3,r3,#2
bcc .Lshift_0017E1E4
subs r0,r0,r1
orr r3,r3,#2
rsblt r0,r0,#0
eorlt r3,r3,#1
.Lshift_0017E1E4:
lsl r0,r0,#1
sub r2,r2,#65536
b .Lcompare_0017E1E4
.Laligned_0017E1E4:
asr r12,r2,#16
cmp r12,r3,asr #16
blt .Lnormalize_0017E1E4
cmp r0,r1
bcc .Lnormalize_0017E1E4
beq .Lequal_0017E1E4
.Lsubtract_0017E1E4:
sub r0,r0,r1,lsl #1
rsb r0,r0,#0
eor r3,r3,#1
.Lnormalize_0017E1E4:
lsls r0,r0,#1
bcs .Lpack_check_0017E1E4
bmi .Lnegative_0017E1E4
beq .Lzero_0017E1E4
clz r12,r0
add r12,r12,#1
lsl r0,r0,r12
sub r2,r2,r12,lsl #16
.Lunderflow_0017E1E4:
rsbs r12,r2,#0
blt .Lpack_0017E1E4
mov r0,#0
bx lr
.Lzero_0017E1E4:
lsl r0,r3,#29
and r0,r0,#-2147483648
bx lr
.Lequal_0017E1E4:
tst r3,#2
beq .Lnormalize_0017E1E4
b .Lsubtract_0017E1E4
.Lnegative_0017E1E4:
subs r2,r2,#65536
lsl r0,r0,#1
ble .Lunderflow_0017E1E4
.Lpack_check_0017E1E4:
cmp r2,#0
ble .Lunderflow_0017E1E4
.Lpack_0017E1E4:
lsl r2,r2,#7
orr r0,r2,r0,lsr #9
orr r0,r0,r3,lsl #31
bx lr
.Lspecial_0017E1E4:
push {r4,lr}
bl fp_exception_secondary_84
cdpcc p15,15,c15,c15,c13,7
.Lnan_0017E1E4:
tst r12,r1,lsr #7
beq .Lload_nan_0017E1E4
bics r12,r0,#-2147483648
movne r0,#0
bx lr
.Lload_nan_0017E1E4:
ldr r0,.Lnan_value_0017E1E4
bx lr
END func_0017E1E4
.Lnan_value_0017E1E4:
.word ipc_nan_result_84

BEGIN func_0017E324
push {r4,r5,r6,lr}
mov r6,r0
add r0,r0,#12
mov r4,r1
mov r5,r0
bl func_001602B8
ldr r1,[r4]
mov r0,#0
cmp r1,r4
streq r0,[r6,#8]
beq .Lclear_0017E324
ldr r1,[r6,#8]
cmp r1,r4
ldreq r1,[r1,#4]
streq r1,[r6,#8]
ldm r4,{r1,r2}
str r1,[r2]
ldm r4,{r1,r2}
str r2,[r1,#4]
.Lclear_0017E324:
str r0,[r4,#4]
str r0,[r4]
str r0,[r4,#8]
str r0,[r4,#12]
mov r0,r5
pop {r4,r5,r6,lr}
b func_00160380
END func_0017E324

BEGIN func_0017E38C
push {r4,r5,r6,r7,r8,r9,r10,lr}
sub sp,sp,#16
mov r8,r1
add r4,sp,#52
ldr r1,[sp,#60]
ldr r6,[sp,#48]
ldm r4,{r5,r10}
cmp r1,#0
ldr r1,[r8]
mov r4,r0
mov r0,r6
mov r9,r2
sub r0,r0,r1
ldr r2,[r8,#4]
bic r7,r0,#7
moveq r6,#0
mov r1,r7
mov r0,r3
blx r2
ldr r0,[r8,#8]
sub r1,r7,#20
bic r2,r1,#7
add r1,r2,#4
str r0,[r2]
ldr r0,[r8,#12]
str r6,[r2,#16]
str r7,[r2,#12]
stm r1,{r0,r9}
cmp r5,#32
mov r6,#0
addls r0,r5,#32
str r6,[sp,#8]
bls .Lsize_ready_0017E38C
ldr r0,.Lbias_a_0017E38C
add r0,r0,r5
cmp r0,#39
addls r0,r0,#24
bls .Lsize_ready_0017E38C
ldr r0,.Lbias_b_0017E38C
add r0,r0,r5
cmp r0,#64
mvnhi r0,#0
.Lsize_ready_0017E38C:
stm sp,{r0,r10}
ldr r1,.Lallocator_context_0017E38C
mov r3,r2
add r0,sp,#8
bl func_00117884
lsrs r1,r0,#31
nop
bne .Lreturn_0017E38C
ldr r0,[sp,#8]
str r0,[r4]
strb r6,[r4,#4]
mov r0,r6
strb r6,[r4,#5]
.Lreturn_0017E38C:
add sp,sp,#16
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_0017E38C
.Lbias_a_0017E38C:
.word ipc_character_range_bias_a_77
.Lbias_b_0017E38C:
.word ipc_character_range_bias_b_77
.Lallocator_context_0017E38C:
.word service_allocator_context_84

BEGIN func_0017E47C
mov r12,r0
mov r2,r1
ldr r0,.Lunlink_context_0017E47C
mov r3,#4096
mov r1,r12
b func_00170548
END func_0017E47C
.Lunlink_context_0017E47C:
.word service_unlink_context_44

BEGIN func_0017E524
push {r4,r5,r6,lr}
mov r6,r0
mov r5,r1
mov r4,#0
.Literate_0017E524:
mov r1,r4
mov r0,r6
bl func_0017E644
movs r4,r0
nop
beq .Lreturn_0017E524
ldr r0,[r4,#24]
cmp r0,r5
bhi .Literate_0017E524
ldr r0,[r4,#28]
cmp r5,r0
bcs .Literate_0017E524
mov r1,r5
add r0,r4,#12
bl func_0017E524
cmp r0,#0
moveq r0,r4
.Lreturn_0017E524:
pop {r4,r5,r6,pc}
END func_0017E524
