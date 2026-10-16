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

.global func_0017EA3C
.global func_0017EA90
.global func_00184990
.global func_0018B220
.global func_0016148C
.global func_001888A8
.global func_00184E10
.global func_0018BF64
.global service_free_block_tag_85
.global service_allocated_block_tag_85
.global service_bootstrap_lock_85
.global service_bootstrap_marker_85
.global ipc_allocator_dispatch_owner_68
.global service_runtime_record_vtable_85
.global service_runtime_record_ops_85
.global service_runtime_endpoint_vtable_85
.global service_record_lock_85
.global service_adapter_vtable_85
.global service_node_vtable_85

BEGIN func_0017E65C
push {r4,r5,r6,r7,r8,r9,r10,r11}
add r5,r1,#16
sub r6,r2,#16
ldr r4,[r1,#4]
ldrh r12,[r1,#2]
ldr r7,[sp,#32]
add r8,r4,r5
add r5,r2,r3
lsl r12,r12,#17
ldr r3,[r1,#8]
sub r4,r1,r12,lsr #25
ldr r1,[r1,#12]
cmp r3,#0
ldr r9,.Lfree_tag_0017E65C
strne r1,[r3,#12]
streq r1,[r0]
cmp r1,#0
strne r3,[r1,#8]
sub r10,r6,r4
streq r3,[r0,#4]
cmp r10,#20
mov r12,r6
mov r1,#0
bcc .Lfirst_unsplit_0017E65C
cmp r7,#0
ldrbeq r11,[r0,#20]
cmpeq r11,#0
beq .Lfirst_unsplit_0017E65C
strh r9,[r4]
strh r1,[r4,#2]
str r1,[r4,#12]
sub r10,r10,#16
str r3,[r4,#8]
cmp r3,#0
str r10,[r4,#4]
ldrne r10,[r3,#12]
ldreq r10,[r0]
strne r4,[r3,#12]
streq r4,[r0]
cmp r10,#0
str r10,[r4,#12]
strne r4,[r10,#8]
mov r3,r4
streq r4,[r0,#4]
b .Lfirst_ready_0017E65C
.Lfirst_unsplit_0017E65C:
mov r6,r4
.Lfirst_ready_0017E65C:
sub r4,r8,r5
cmp r4,#20
bcc .Lsecond_unsplit_0017E65C
cmp r7,#1
ldrbeq r10,[r0,#20]
cmpeq r10,#0
beq .Lsecond_unsplit_0017E65C
strh r9,[r5]
strh r1,[r5,#2]
str r1,[r5,#12]
sub r4,r4,#16
str r3,[r5,#8]
cmp r3,#0
str r4,[r5,#4]
ldrne r4,[r3,#12]
ldreq r4,[r0]
strne r5,[r3,#12]
streq r5,[r0]
cmp r4,#0
str r4,[r5,#12]
strne r5,[r4,#8]
streq r5,[r0,#4]
b .Lsecond_ready_0017E65C
.Lsecond_unsplit_0017E65C:
mov r5,r8
.Lsecond_ready_0017E65C:
ldr r3,[r0,#-4]
sub r4,r5,r6
and r3,r3,#1
cmp r3,#0
movne r8,#0
cmpne r4,#3
bls .Lclear_done_0017E65C
lsl r9,r4,#29
sub r3,r6,#4
cmp r9,#0
strlt r8,[r3,#4]!
lsrs r4,r4,#3
beq .Lclear_done_0017E65C
.Lclear_loop_0017E65C:
str r8,[r3,#4]
subs r4,r4,#1
str r8,[r3,#8]!
bne .Lclear_loop_0017E65C
.Lclear_done_0017E65C:
ldr r3,.Lallocated_tag_0017E65C
sub r4,r5,r12
sub r4,r4,#16
strh r3,[r12]
str r1,[r12,#8]
str r4,[r12,#4]
sub r3,r12,r6
str r1,[r12,#12]
orr r1,r1,r7,lsl #15
and r3,r3,#127
bic r1,r1,#32512
orr r1,r1,r3,lsl #8
strh r1,[r12,#2]
ldrh r3,[r0,#16]
bic r1,r1,#255
and r3,r3,#255
orr r1,r1,r3
strh r1,[r12,#2]
ldr r1,[r0,#12]
cmp r1,#0
str r1,[r12,#8]
ldrne r3,[r1,#12]
ldreq r3,[r0,#8]
strne r12,[r1,#12]
streq r12,[r0,#8]
cmp r3,#0
str r3,[r12,#12]
strne r12,[r3,#8]
streq r12,[r0,#12]
pop {r4,r5,r6,r7,r8,r9,r10,r11}
mov r0,r2
bx lr
END func_0017E65C
.Lfree_tag_0017E65C:
.word service_free_block_tag_85
.Lallocated_tag_0017E65C:
.word service_allocated_block_tag_85

BEGIN func_0017EAE4
ldr r0,.Lbootstrap_lock_0017EAE4
push {r4,r5,r6,r7,r8,lr}
bic r1,r1,#255
mov r7,#1
mov r4,r0
orr r5,r1,r7
bl func_0017EA3C
ldr r1,.Lbootstrap_marker_0017EAE4
mov r0,#0
mov r0,r0
ldr r6,.Lallocator_owner_0017EAE4
mov r8,#0
ldr r1,[r6,#356]
cmp r1,#0
movne r0,#1
addne r1,r1,#4
beq .Lallocate_record_0017EAE4
.Latomic_retry_0017EAE4:
ldrex r2,[r1]
add r2,r2,r0
strex r3,r2,[r1]
cmp r3,#0
bne .Latomic_retry_0017EAE4
.Lleave_0017EAE4:
sxtb r0,r5
cmp r0,#0
movne r0,r4
blne func_0017EA90
pop {r4,r5,r6,r7,r8,pc}
.Lallocate_record_0017EAE4:
mov r0,#72
bl func_00184990
cmp r0,#0
nop
beq .Lpublish_record_0017EAE4
ldr r1,.Lrecord_vtable_0017EAE4
mov r2,r0
mov r3,#0
str r1,[r0],#4
ldr r1,.Lrecord_ops_0017EAE4
stm r0,{r1,r3}
mov r1,#1
str r3,[r0,#8]
str r3,[r0,#12]
str r8,[r0,#16]
add r0,r2,#24
bl func_0018B220
ldr r2,.Lendpoint_vtable_0017EAE4
mov r1,#2
str r2,[r0]
strb r1,[r0,#44]
sub r0,r0,#24
strb r7,[r6,#6]
.Lpublish_record_0017EAE4:
str r0,[r6,#360]
mov r0,#576
bl func_00184990
cmp r0,#0
nop
blne func_0016148C
str r0,[r6,#356]
nop
b .Lleave_0017EAE4
END func_0017EAE4
.Lbootstrap_lock_0017EAE4:
.word service_bootstrap_lock_85
.Lbootstrap_marker_0017EAE4:
.word service_bootstrap_marker_85
.Lallocator_owner_0017EAE4:
.word ipc_allocator_dispatch_owner_68
.Lrecord_vtable_0017EAE4:
.word service_runtime_record_vtable_85
.Lrecord_ops_0017EAE4:
.word service_runtime_record_ops_85
.Lendpoint_vtable_0017EAE4:
.word service_runtime_endpoint_vtable_85

BEGIN func_0017EBE8
push {r4,r5,r6,r7,r8,lr}
bic r2,r0,#255
mov r7,r0
ldr r0,.Lrecord_lock_0017EBE8
mov r6,r1
orr r5,r2,#1
mov r4,r0
bl func_0017EA3C
sxtb r0,r5
cmp r0,#0
movne r0,r4
str r6,[r7,#12]
blne func_0017EA90
pop {r4,r5,r6,r7,r8,pc}
END func_0017EBE8
.Lrecord_lock_0017EBE8:
.word service_record_lock_85

BEGIN func_0017EC24
push {r4,r5,r6,lr}
mov r5,r0
ldr r0,.Lallocator_owner_0017EC24
mov r4,r1
ldrb r1,[r0,#13]
cmp r1,#0
moveq r2,#0
beq .Lowner_ready_0017EC24
ldr r0,[r0,#148]
bl func_001888A8
ldr r2,[r0]
.Lowner_ready_0017EC24:
mov r1,r4
mov r0,r5
bl func_00184E10
ldr r1,.Ladapter_vtable_0017EC24
str r1,[r0]
pop {r4,r5,r6,pc}
END func_0017EC24
.Lallocator_owner_0017EC24:
.word ipc_allocator_dispatch_owner_68
.Ladapter_vtable_0017EC24:
.word service_adapter_vtable_85

BEGIN func_0017EC70
push {r4,lr}
mov r4,#0
str r4,[r0,#4]
mov r2,#1
str r2,[r0,#4]
ldr r2,.Lnode_vtable_0017EC70
strb r4,[r0,#8]
str r2,[r0],#12
bl func_0018BF64
sub r0,r0,#12
mov r1,#1
strh r1,[r0,#20]
str r4,[r0,#24]
str r4,[r0,#28]
pop {r4,pc}
END func_0017EC70
.Lnode_vtable_0017EC70:
.word service_node_vtable_85
