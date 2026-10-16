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

.global func_00175D64,service_cache_lookup_secondary_57,func_00144D28
.global func_0016BADC,func_0015EC10
.global ipc_bit_prefix_masks_57,ipc_render_context_54
.global ipc_layout_callback_context_55,ipc_bit_suffix_masks_57
.global ipc_runtime_callback_table_57,ipc_runtime_owner_slot_57
.global ipc_record_table_descriptor_57,ipc_record_upper_bound_57

BEGIN func_001686A0
push {r4,r5,r6,r7,r8,lr}
add r12,r1,r2
ldr r3,[r0]
cmp r12,r3
bhi .Lfail_001686A0
asr r3,r1,#31
ldr r5,.Lpool_001686A0
add r3,r1,r3,lsr #29
bic r12,r3,#7
sub r6,r1,r12
ldr r4,.Lpool_001686A0+4
rsb r1,r6,#8
cmp r1,r2
asr r12,r3,#3
bcc .Lsplit_001686A0
cmp r2,#9
bcc .Lprefix_ready_001686A0
.Lprefix_wait_001686A0:
ldr r1,[r4,#108]
cmp r1,#0
ldrne r0,.Lpool_001686A0+8
blxne r1
b .Lprefix_wait_001686A0
.Lprefix_ready_001686A0:
ldrb r1,[r5,r2]
mov r7,#0
mov r3,r7
lsr r1,r1,r6
b .Ltest_first_001686A0
.Lsplit_001686A0:
cmp r1,#9
bcc .Lsuffix_ready_001686A0
.Lsuffix_wait_001686A0:
ldr r1,[r4,#108]
cmp r1,#0
ldrne r0,.Lpool_001686A0+8
blxne r1
b .Lsuffix_wait_001686A0
.Lsuffix_ready_001686A0:
ldr r3,.Lpool_001686A0+12
sub r2,r2,r1
lsr r7,r2,#3
ldrb r1,[r3,r1]
and r3,r2,#7
.Ltest_first_001686A0:
ldr r6,[r0,#12]
ldrb r2,[r6,r12]
tst r2,r1
beq .Lwrite_first_001686A0
.Lfail_001686A0:
mov r0,#0
pop {r4,r5,r6,r7,r8,pc}
.Lwrite_first_001686A0:
orr r1,r1,r2
sub r2,r7,#1
strb r1,[r6,r12]
cmn r2,#1
add r1,r12,#1
movne r6,#255
beq .Ltail_bits_001686A0
.Lfill_001686A0:
ldr r12,[r0,#12]
subs r2,r2,#1
strb r6,[r12,r1]
add r1,r1,#1
bcs .Lfill_001686A0
.Ltail_bits_001686A0:
cmp r3,#0
beq .Lsuccess_001686A0
ldr r0,[r0,#12]
ldrb r3,[r5,r3]
ldrb r2,[r0,r1]
tst r2,r3
orreq r2,r2,r3
strbeq r2,[r0,r1]
beq .Lsuccess_001686A0
.Ltail_wait_001686A0:
ldr r1,[r4,#108]
cmp r1,#0
ldrne r0,.Lpool_001686A0+8
blxne r1
b .Ltail_wait_001686A0
.Lsuccess_001686A0:
mov r0,#1
pop {r4,r5,r6,r7,r8,pc}
END func_001686A0
.Lpool_001686A0:
.word ipc_bit_prefix_masks_57
.word ipc_render_context_54
.word ipc_layout_callback_context_55
.word ipc_bit_suffix_masks_57

BEGIN func_001687D4
ldr r2,.Lpool_001687D4
ldr r2,[r2]
ldr r2,[r2,#116]
cmp r2,#0
beq .Lfallback_001687D4
bx r2
.Lfallback_001687D4:
mov r1,r0
ldr r0,.Lpool_001687D4+4
ldr r0,[r0]
b func_00175D64
END func_001687D4
.Lpool_001687D4:
.word ipc_runtime_callback_table_57
.word ipc_runtime_owner_slot_57

BEGIN func_00168804
ldr r0,.Lpool_00168804
ldr r0,[r0]
ldr r0,[r0,#112]
cmp r0,#0
beq .Lfallback_00168804
bx r0
.Lfallback_00168804:
ldr r0,.Lpool_00168804+4
ldr r0,[r0]
b service_cache_lookup_secondary_57
END func_00168804
.Lpool_00168804:
.word ipc_runtime_callback_table_57
.word ipc_runtime_owner_slot_57

BEGIN func_00168844
push {r4,r5,r6,r7,lr}
mov r6,r0
mov r5,r2
ldr r0,.Lpool_00168844
sub r2,r1,#512
subs r2,r2,#210
mov r4,r1
ldr r7,[r0,#4]
subne r1,r4,#512
subsne r1,r1,#211
sub sp,sp,#84
beq .Lzero_00168844
ldr r1,.Lpool_00168844+4
cmp r4,r1
bls .Lin_range_00168844
.Lzero_00168844:
mov r0,#0
b .Lcopy_00168844
.Lin_range_00168844:
cmp r5,#0
beq .Luse_index_00168844
add r0,r4,r4,lsl #2
mov r2,#80
add r1,r7,r0,lsl #4
mov r0,sp
bl func_00144D28
ldrh r0,[sp,#28]
cmp r0,#0
ldrbne r2,[sp,#32]
cmpne r2,r5
subhi r1,r5,#1
addhi r0,r0,r1
bhi .Lcopy_00168844
.Luse_index_00168844:
mov r0,r4
.Lcopy_00168844:
mov r2,#80
add r1,r0,r0,lsl #2
ldr r0,[r6,#8]
add r1,r7,r1,lsl #4
bl func_00144D28
strh r4,[r6,#4]
strb r5,[r6,#6]
add sp,sp,#84
pop {r4,r5,r6,r7,pc}
END func_00168844
.Lpool_00168844:
.word ipc_record_table_descriptor_57
.word ipc_record_upper_bound_57

BEGIN func_00168958
push {r4,r5,r6,r7,r8,lr}
mov r5,r0
mov r8,r1
mov r0,r1
ldrh r0,[r0]
mov r6,r0
mov r0,r8
ldrb r0,[r0,#2]
mov r7,r0
ldr r0,[r5,#8]
mov r4,#0
cmp r0,#0
bls .Lappend_00168958
.Lsearch_00168958:
ldr r0,[r5,#4]
ldr r0,[r0,r4,lsl #2]
ldrh r0,[r0]
cmp r0,r6
nop
bne .Lnext_00168958
ldr r0,[r5,#4]
ldr r0,[r0,r4,lsl #2]
ldrb r0,[r0,#2]
cmp r0,r7
nop
beq .Lreturn_00168958
.Lnext_00168958:
ldr r0,[r5,#8]
add r4,r4,#1
cmp r0,r4
bhi .Lsearch_00168958
.Lappend_00168958:
ldr r0,[r5,#4]
ldr r1,[r5,#12]
ldr r1,[r0,r1,lsl #2]
mov r0,r8
bl func_0016BADC
ldr r0,[r5,#12]
ldr r1,[r5,#8]
add r0,r0,#1
bl func_0015EC10
str r1,[r5,#12]
.Lreturn_00168958:
pop {r4,r5,r6,r7,r8,pc}
END func_00168958
