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

.global func_0017E4D8
.global func_0017FFB8
.global controller_query_secondary_82
.global func_00302F52
.global ipc_controller_selector_offset_77
.global ipc_shared_control_owner_72
.global ipc_controller_matrix_guard_82
.global ipc_unit_scalar_54
.global service_zero_scalar_51
.global ipc_controller_matrix_state_82
.global ipc_controller_extended_matrix_guard_82
.global ipc_controller_extended_matrix_state_82

BEGIN func_0017A314
push {r4,r5,r6,r7,r8,r9,r10,lr}
mov r4,r0
add r0,sp,#32
mov r10,r1
ldm r0,{r7,r8,r9}
mov r5,r2
mov r6,r3
bl func_0017E4D8
cmp r0,#0
beq .Lloc_17A380
ldr r0,.Lselector_0017A314
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r10,lsl #2
add r0,r0,#4096
ldr r1,[r0,#176]
strh r9,[r1,#64]
strh r8,[r1,#66]
strh r7,[r1,#68]
strh r6,[r1,#70]
strh r5,[r1,#72]
ldr r0,[r1]
orr r0,r0,#16777216
str r0,[r1]
mov r0,#1
.Lloc_17A380:
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_0017A314
.Lselector_0017A314:
.word ipc_controller_selector_offset_77

BEGIN func_0017A388
push {r4,r5,r6,r7,lr}
add r1,r0,#56
add r4,r0,#72
ldm r1,{r1,r2,r3,r12}
sub sp,sp,#52
add lr,sp,#32
ldm r4,{r4,r5,r6,r7}
stm sp,{r1,r2,r3,r12}
add r1,sp,#16
vmov s2,r4
stm r1,{r4,r5,r6,r7}
add r1,r0,#88
vmov s6,r5
ldm r1,{r1,r2,r3,r12}
vmov s3,r6
vmov s11,r7
vmov s4,r1
vmov s7,r2
stm lr,{r1,r2,r3,r12}
vmov s9,r3
vmov s12,r12
vldr s0,[r0,#104]
vldr s1,[sp]
vldr s5,[sp,#4]
vmul.f32 s2,s2,s0
vmul.f32 s1,s1,s0
vmul.f32 s4,s4,s0
vldr s8,[sp,#8]
vmul.f32 s5,s5,s0
vmul.f32 s6,s6,s0
vmul.f32 s7,s7,s0
vldr s10,[sp,#12]
vmul.f32 s8,s8,s0
vmul.f32 s3,s3,s0
vmul.f32 s9,s9,s0
vmul.f32 s10,s10,s0
vstr s1,[sp]
vmul.f32 s11,s11,s0
vstr s2,[sp,#16]
vmul.f32 s0,s12,s0
vstr s4,[sp,#32]
vstr s5,[sp,#4]
vstr s6,[sp,#20]
vstr s7,[sp,#36]
vstr s8,[sp,#8]
vstr s3,[sp,#24]
vstr s9,[sp,#40]
vstr s10,[sp,#12]
vstr s11,[sp,#28]
vstr s0,[sp,#44]
ldr r0,[r0]
mov r2,sp
and r1,r0,#255
ldr r0,.Lshared_owner_0017A388
bl func_0017FFB8
add sp,sp,#52
pop {r4,r5,r6,r7,pc}
END func_0017A388
.Lshared_owner_0017A388:
.word ipc_shared_control_owner_72

BEGIN func_0017A470
push {r3,r4,r5,lr}
mov r4,r0
mov r0,#0
mov r3,r0
str r0,[sp]
mov r0,sp
bl controller_query_secondary_82
mov r1,r0
and r0,r0,#0x80000000
cmp r0,#0
ldrge r0,[sp]
strge r0,[r4]
mov r0,r1
pop {r3,r4,r5,pc}
END func_0017A470

BEGIN func_0017A4A8
ldr r0,.Lmatrix_guard_0017A4A8
push {r4,lr}
ldr r0,[r0]
tst r0,#1
bne .Lloc_17A510
ldr r0,.Lmatrix_guard_0017A4A8
blx func_00302F52
cmp r0,#0
beq .Lloc_17A510
ldr r0,.Lmatrix_state_0017A4A8
vldr s1,.Lunit_0017A4A8
vldr s0,.Lzero_0017A4A8
add r1,r0,#16
vstr s1,[r0]
vstr s0,[r0,#4]
vstr s0,[r0,#8]
vstr s0,[r0,#12]
vstmia r1,{s0-s1}
add r1,r0,#36
vstr s0,[r0,#24]
vstr s0,[r0,#28]
vstr s0,[r0,#32]
vstmia r1,{s0-s1}
vstr s0,[r0,#44]
ldr r0,.Lmatrix_guard_0017A4A8
mov r0,r0
.Lloc_17A510:
ldr r0,.Lmatrix_state_0017A4A8
pop {r4,pc}
END func_0017A4A8
.Lmatrix_guard_0017A4A8:
.word ipc_controller_matrix_guard_82
.Lunit_0017A4A8:
.word ipc_unit_scalar_54
.Lzero_0017A4A8:
.word service_zero_scalar_51
.Lmatrix_state_0017A4A8:
.word ipc_controller_matrix_state_82

BEGIN func_0017A528
ldr r0,.Lmatrix_guard_0017A528
push {r4,lr}
ldr r0,[r0]
tst r0,#1
bne .Lloc_17A5A0
ldr r0,.Lmatrix_guard_0017A528
blx func_00302F52
cmp r0,#0
beq .Lloc_17A5A0
ldr r0,.Lmatrix_state_0017A528
vldr s1,.Lunit_0017A528
vldr s0,.Lzero_0017A528
add r1,r0,#16
vstr s1,[r0]
vstr s0,[r0,#4]
vstr s0,[r0,#8]
vstr s0,[r0,#12]
vstmia r1,{s0-s1}
add r1,r0,#36
vstr s0,[r0,#24]
vstr s0,[r0,#28]
vstr s0,[r0,#32]
vstmia r1,{s0-s1}
vstr s0,[r0,#44]
vstr s0,[r0,#48]
vstr s0,[r0,#52]
add r0,r0,#56
vstmia r0,{s0-s1}
ldr r0,.Lmatrix_guard_0017A528
mov r0,r0
.Lloc_17A5A0:
ldr r0,.Lmatrix_state_0017A528
pop {r4,pc}
END func_0017A528
.Lmatrix_guard_0017A528:
.word ipc_controller_extended_matrix_guard_82
.Lunit_0017A528:
.word ipc_unit_scalar_54
.Lzero_0017A528:
.word service_zero_scalar_51
.Lmatrix_state_0017A528:
.word ipc_controller_extended_matrix_state_82
