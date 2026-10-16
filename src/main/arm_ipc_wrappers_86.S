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
.global func_0017F0D8
.global func_001720A4
.global func_0018A438
.global func_00178604
.global func_00302108
.global func_00172044
.global func_00160BA8
.global func_001888A8
.global func_00171324
.global func_001602B8
.global func_0017EAE4
.global func_00160380
.global func_00184990
.global func_00185F88
.global service_linked_node_vtable_86
.global ipc_allocator_dispatch_owner_68
.global service_query_flags_86
.global service_query_context_86
.global ipc_service_registry_owner_71
.global service_runtime_singleton_86

BEGIN func_0017ECB0
push {r4,r5,r6,r7,r8,lr}
mov r5,r0
mov r1,#0
ldr r0,.Lnode_vtable_0017ECB0
strd r0,[r5]
ldr r0,.Lallocator_owner_0017ECB0
str r1,[r5,#8]
ldr r4,[r0,#360]
ldrb r0,[r0,#6]
cmp r0,#0
beq .Ldone_0017ECB0
bic r2,r2,#255
add r6,r4,#24
orr r7,r2,#1
mov r0,r6
bl func_0017EA3C
ldr r0,[r4,#8]
ldr r1,[r4,#16]
cmp r0,r1
beq .Linsert_empty_0017ECB0
ldr r1,[r4,#12]
str r5,[r1,#4]
ldr r1,[r4,#12]
str r1,[r5,#8]
str r5,[r4,#12]
b .Linsert_done_0017ECB0
.Linsert_empty_0017ECB0:
str r5,[r4,#8]
str r5,[r4,#12]
.Linsert_done_0017ECB0:
ldr r0,[r4,#20]
add r0,r0,#1
str r0,[r4,#20]
sxtb r0,r7
cmp r0,#0
movne r0,r6
blne func_0017EA90
.Ldone_0017ECB0:
mov r0,r5
pop {r4,r5,r6,r7,r8,pc}
END func_0017ECB0
.Lnode_vtable_0017ECB0:
.word service_linked_node_vtable_86
.Lallocator_owner_0017ECB0:
.word ipc_allocator_dispatch_owner_68

BEGIN func_0017ED4C
push {r4,r5,r6,r7,r8,r9,r10,r11,lr}
sub sp,sp,#36
mov r8,#0
mov r5,r0
mov r6,r1
str r8,[sp,#20]
str r8,[sp,#24]
str r8,[sp,#28]
ldr r0,[r0,#48]
ldr r9,.Lquery_flags_0017ED4C
ldr r10,.Lquery_context_0017ED4C
mov r7,r2
ldr r4,[r0,#8]
mov r11,#111
.Lscan_0017ED4C:
ldr r0,[r5,#48]
cmp r4,r0
beq .Lscan_exhausted_0017ED4C
ldr r0,[r4,#20]
ldrb r1,[r0,#16]
cmp r1,#1
beq .Lcheck_key_0017ED4C
b .Ladvance_tree_0017ED4C
.Lscan_exhausted_0017ED4C:
ldr r0,[sp,#24]
ldr r4,[sp,#20]
cmp r0,r4
bne .Lprocess_match_0017ED4C
b .Lcleanup_0017ED4C
.Lcheck_key_0017ED4C:
ldr r1,[r0,#72]
cmp r1,r6
beq .Lcandidate_0017ED4C
cmp r7,#0
beq .Ladvance_tree_0017ED4C
ldr r0,[r0,#76]
cmp r0,r7
bne .Ladvance_tree_0017ED4C
.Lcandidate_0017ED4C:
str r8,[sp,#8]
str r8,[sp,#12]
str r8,[sp,#16]
bl func_0017F0D8
ldr r1,[r4,#20]
ldr r0,[r0,#16]
add r2,sp,#8
ldr r1,[r1,#68]
bl func_001720A4
ldr r1,[sp,#24]
ldrd r2,[sp,#8]
add r0,sp,#20
bl func_0018A438
ldr r0,[r4,#12]
mov r1,r4
cmp r0,#0
beq .Lsuccessor_up_0017ED4C
.Lsuccessor_right_0017ED4C:
mov r4,r0
ldr r0,[r0,#8]
cmp r0,#0
bne .Lsuccessor_right_0017ED4C
b .Ldispatch_0017ED4C
.Lsuccessor_up_0017ED4C:
ldr r0,[r4,#4]
ldr r3,[r0,#12]
cmp r1,r3
bne .Lsuccessor_ready_0017ED4C
.Lsuccessor_climb_0017ED4C:
mov r4,r0
ldr r0,[r0,#4]
ldr r2,[r0,#12]
cmp r4,r2
beq .Lsuccessor_climb_0017ED4C
.Lsuccessor_ready_0017ED4C:
ldr r2,[r4,#12]
cmp r2,r0
movne r4,r0
.Ldispatch_0017ED4C:
ldr r0,[r1,#20]
mov r1,#1
str r1,[sp,#4]
mov r2,r9
mov r3,r10
mov r1,#3
str r11,[sp]
bl func_00178604
ldr r0,[sp,#8]
cmp r0,#0
beq .Lscan_0017ED4C
ldr r1,[r0,#-8]!
cmp r1,#0
beq .Lmissing_cleanup_0017ED4C
blx r1
b .Lscan_0017ED4C
.Lmissing_cleanup_0017ED4C:
nop
bl func_00302108
nop
nop
b .Lscan_0017ED4C
.Ladvance_tree_0017ED4C:
ldr r0,[r4,#12]
cmp r0,#0
beq .Ladvance_up_0017ED4C
.Ladvance_right_0017ED4C:
mov r4,r0
ldr r0,[r0,#8]
cmp r0,#0
bne .Ladvance_right_0017ED4C
b .Lscan_0017ED4C
.Ladvance_up_0017ED4C:
ldr r0,[r4,#4]
ldr r2,[r0,#12]
cmp r4,r2
bne .Ladvance_ready_0017ED4C
.Ladvance_climb_0017ED4C:
mov r4,r0
ldr r0,[r0,#4]
ldr r1,[r0,#12]
cmp r4,r1
beq .Ladvance_climb_0017ED4C
.Ladvance_ready_0017ED4C:
ldr r1,[r4,#12]
cmp r1,r0
movne r4,r0
b .Lscan_0017ED4C
.Lprocess_match_0017ED4C:
nop
bl func_0017F0D8
ldr r1,[r4]
ldr r0,[r0,#16]
bl func_00172044
cmp r0,#0
movne r1,#4
blne func_00160BA8
ldr r0,[sp,#24]
add r4,r4,#4
cmp r0,r4
bne .Lprocess_match_0017ED4C
.Lcleanup_0017ED4C:
ldr r0,[sp,#20]
cmp r0,#0
beq .Lreturn_0017ED4C
ldr r1,[r0,#-8]!
cmp r1,#0
beq .Lmissing_final_cleanup_0017ED4C
blx r1
.Lreturn_0017ED4C:
add sp,sp,#36
pop {r4,r5,r6,r7,r8,r9,r10,r11,pc}
.Lmissing_final_cleanup_0017ED4C:
nop
bl func_00302108
add sp,sp,#36
pop {r4,r5,r6,r7,r8,r9,r10,r11,pc}
END func_0017ED4C
.Lquery_flags_0017ED4C:
.word service_query_flags_86
.Lquery_context_0017ED4C:
.word service_query_context_86

BEGIN func_0017F0D8
ldr r0,.Lallocator_owner_0017F0D8
push {r4,lr}
ldrb r1,[r0,#13]
cmp r1,#0
moveq r2,#0
beq .Llookup_0017F0D8
ldr r0,[r0,#148]
bl func_001888A8
ldr r2,[r0]
.Llookup_0017F0D8:
ldr r0,.Lregistry_owner_0017F0D8
mov r1,#3
bl func_00171324
cmp r0,#0
ldrne r0,[r0,#12]
pop {r4,pc}
END func_0017F0D8
.Lallocator_owner_0017F0D8:
.word ipc_allocator_dispatch_owner_68
.Lregistry_owner_0017F0D8:
.word ipc_service_registry_owner_71

BEGIN func_0017F11C
ldr r0,.Lruntime_singleton_0017F11C
push {r4,lr}
bl func_001602B8
bl func_0017EAE4
bl func_0017F0D8
cmp r0,#0
beq .Lallocate_0017F11C
bl func_0017F0D8
mov r1,#1
add r0,r0,#4
.Latomic_retry_0017F11C:
ldrex r2,[r0]
add r2,r2,r1
strex r3,r2,[r0]
cmp r3,#0
bne .Latomic_retry_0017F11C
.Lpublish_0017F11C:
ldr r0,.Lruntime_singleton_0017F11C
pop {r4,lr}
b func_00160380
.Lallocate_0017F11C:
mov r0,#128
bl func_00184990
cmp r0,#0
nop
blne func_00185F88
nop
nop
b .Lpublish_0017F11C
END func_0017F11C
.Lruntime_singleton_0017F11C:
.word service_runtime_singleton_86
