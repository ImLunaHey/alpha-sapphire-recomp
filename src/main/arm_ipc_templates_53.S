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

.global func_00173ACC,func_00177E8C,func_00188184
.global func_00176C20,func_00302F52,func_0015EC10
.global ipc_time_magic_a_53,ipc_time_magic_b_53,ipc_time_magic_c_53
.global ipc_time_scale_53,service_zero_scalar_51,ipc_time_limit_53
.global ipc_statistics_guard_53,ipc_statistics_state_53

BEGIN func_00167608
push {r4,r5,r6,r7,r8,r9,r10,r11,r12,lr}
mov r4,r0
add r6,r0,#256
mov r5,r1
vpush {d8}
ldrb r0,[r0,#502]
cmp r0,#1
bne .Lreturn_00167608
ldrd r0,[r5]
ldrd r2,[r4]
adds r0,r0,r2
adc r1,r1,r3
strd r0,[r4]
ldr r0,[r4,#8]
add r0,r0,#1
str r0,[r4,#8]
bl func_00173ACC
ldr r1,[r4,#12]
add r0,r0,r1
str r0,[r4,#12]
ldrb r0,[r6,#180]
cmp r0,#1
bne .Lreturn_00167608
ldr r2,[r5]
ldr r1,.Lpool_00167608
ldr r0,[r5,#4]
mov r3,#3
mov r12,#0
umull r8,r7,r2,r1
umull r8,r9,r0,r3
adds r5,r12,r7
adc r7,r8,r12
umull lr,r8,r0,r1
asr r6,r0,#31
ldr r9,.Lpool_00167608+8
mla r1,r6,r1,r8
mla r1,r0,r12,r1
ldr r12,.Lpool_00167608+4
umlal lr,r1,r3,r2
mov r3,#0
adds r0,lr,r5
adc r1,r1,r7
umull r8,r7,r0,r12
umull r8,r11,r1,r12
mla r7,r3,r12,r7
asr r2,r1,#31
mov lr,r3
mla r12,r2,r12,r11
mla r7,r0,lr,r7
mla lr,r1,r3,r12
adds r12,r8,r7
umull r6,r7,r0,r9
adc lr,lr,r3
mov r10,r3
mov r5,r3
mla r3,r3,r9,r7
adds r12,r12,r6
mla r0,r0,r10,r3
umull r3,r7,r1,r9
adc r0,r0,r5
mla r2,r2,r9,r7
asr r12,r0,#31
mla r7,r1,r10,r2
adds r0,r0,lr
adc r2,r12,lr,asr #31
adds r0,r0,r3
adc r2,r2,r7
lsr r3,r1,#31
lsr lr,r0,#7
orr r0,lr,r2,lsl #25
adds r0,r0,r3
asr r1,r2,#7
adc r1,r1,#0
bl func_00177E8C
vmov s0,r0
vldr s1,.Lpool_00167608+12
add r0,r4,#16
vmul.f32 s16,s0,s1
vldr s1,.Lpool_00167608+16
vmov.f32 s0,s16
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
bcc .Lcount_outlier_00167608
ldr r2,.Lpool_00167608+20
vmov r1,s16
cmp r1,r2
ble .Lupdate_histogram_00167608
.Lcount_outlier_00167608:
ldr r1,[r0,#416]
add r1,r1,#1
str r1,[r0,#416]
.Lupdate_histogram_00167608:
vmov.f32 s1,s16
vldr s0,[r0]
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
vmov.f32 s1,s16
vmovcc.f32 s0,s16
vcvt.s32.f32 s1,s1
vstr s0,[r0]
vmov r1,s1
cmp r1,#101
bge .Lupdate_totals_00167608
add r1,r0,r1,lsl #2
ldr r2,[r1,#8]
add r2,r2,#1
str r2,[r1,#8]
.Lupdate_totals_00167608:
ldr r1,[r0,#412]
vmov.f32 s0,s16
add r1,r1,#1
str r1,[r0,#412]
vldr s1,[r0,#4]
vadd.f32 s0,s1,s0
vstr s0,[r0,#4]
ldr r0,[r4,#504]
cmp r0,#0
beq .Lclear_pending_00167608
ldr r1,[r4,#516]
ldr r2,[r4,#512]
cmp r2,r1
ble .Lclear_pending_00167608
add r5,r0,r1,lsl #3
bl func_00188184
nop
nop
bl func_00176C20
strb r0,[r5,#4]
ldr r0,[r4,#508]
strb r0,[r5,#5]
vstr s16,[r5]
ldr r0,[r4,#516]
add r0,r0,#1
str r0,[r4,#516]
.Lclear_pending_00167608:
mov r0,#0
str r0,[r4,#508]
.Lreturn_00167608:
vpop {d8}
pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
END func_00167608
.Lpool_00167608:
.word ipc_time_magic_a_53
.word ipc_time_magic_b_53
.word ipc_time_magic_c_53
.word ipc_time_scale_53
.word service_zero_scalar_51
.word ipc_time_limit_53

BEGIN func_0016783C
ldr r0,.Lpool_0016783C
push {r4,lr}
ldr r0,[r0]
tst r0,#1
bne .Lfinish_0016783C
ldr r0,.Lpool_0016783C
blx func_00302F52
cmp r0,#0
beq .Lfinish_0016783C
ldr r1,.Lpool_0016783C+4
mov r2,#0
ldr r0,.Lpool_0016783C
add r3,r1,#8
str r2,[r1]
strd r2,[r1,#4]
str r3,[r1,#12]
strb r2,[r1,#16]
str r2,[r1,#20]
mov r0,r0
.Lfinish_0016783C:
ldr r0,.Lpool_0016783C+4
pop {r4,pc}
END func_0016783C
.Lpool_0016783C:
.word ipc_statistics_guard_53
.word ipc_statistics_state_53

BEGIN func_001678A4
push {r4,r5,r6,lr}
mov r5,r0
add r0,r1,#3
bic r4,r0,#3
add r0,r3,#3
bic r6,r0,#3
sub r0,r4,r1
sub r0,r2,r0
mov r1,r6
bl func_0015EC10
subs r1,r0,#0
mov r0,#0
bls .Lreturn_001678A4
.Lloop_001678A4:
ldr r2,[r5]
add r0,r0,#1
cmp r1,r0
str r2,[r4]
str r4,[r5]
add r4,r4,r6
bhi .Lloop_001678A4
.Lreturn_001678A4:
mov r0,r1
pop {r4,r5,r6,pc}
END func_001678A4
