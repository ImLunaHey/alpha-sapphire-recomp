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

.global func_00190D00,func_002FEDF0,func_0018ECF0
.global func_001602B8,func_00160380,func_0017E4D8
.global ipc_character_range_bias_a_77,ipc_character_range_bias_b_77
.global ipc_controller_selector_offset_77,ipc_controller_slot_offset_77

BEGIN func_0018EE20
mov r3,r0
movs r0,r1
mov r1,r2
cmpne r1,#0
push {r4,lr}
beq .Linvalid_0018EE20
cmp r3,#2
mvnne r0,#4
bne .Lresult_0018EE20
bl func_00190D00
cmp r0,#0
beq .Linvalid_0018EE20
ldrsb r4,[r0]
bl func_002FEDF0
ldr r0,[r0]
ldrb r0,[r0,r4]
tst r0,#56
moveq r0,#1
beq .Lresult_0018EE20
.Linvalid_0018EE20:
mov r0,#0
.Lresult_0018EE20:
pop {r4,pc}
END func_0018EE20

BEGIN func_00190084
cmp r0,#32
addls r0,r0,#32
bls .Lnormalized_00190084
ldr r1,.Lrange_bias_a_00190084
add r1,r1,r0
cmp r1,#39
addls r0,r1,#24
bls .Lnormalized_00190084
ldr r1,.Lrange_bias_b_00190084
add r0,r0,r1
cmp r0,#64
mvnhi r0,#0
.Lnormalized_00190084:
bx lr
END func_00190084
.Lrange_bias_a_00190084:
.word ipc_character_range_bias_a_77
.Lrange_bias_b_00190084:
.word ipc_character_range_bias_b_77

BEGIN func_00190348
push {r4,r5,r6,r7,r8,lr}
mov r4,r0
mov r6,r1
ldr r0,[r1]
ldr r1,[r4]
mov r7,#1
tst r1,r7,lsl r0
beq .Lremove_done_00190348
ldrb r0,[r6,#4]
cmp r0,#1
beq .Lguard_00190348
mov r1,#1
mov r0,r6
bl func_0018ECF0
.Lguard_00190348:
add r0,r4,#16
mov r5,r0
bl func_001602B8
ldrd r0,r1,[r6,#36]
orrs r2,r0,r1
beq .Lempty_links_00190348
cmp r1,#0
beq .Lrepair_previous_00190348
cmp r0,#0
str r0,[r1,#36]
streq r1,[r4,#4]
.Lrepair_previous_00190348:
cmp r0,#0
beq .Lclear_occupancy_00190348
ldr r1,[r6,#40]
cmp r1,#0
str r1,[r0,#40]
streq r0,[r4,#8]
.Lclear_occupancy_00190348:
ldr r1,[r6]
ldr r0,[r4]
bic r0,r0,r7,lsl r1
str r0,[r4]
ldrh r0,[r4,#12]
sub r0,r0,#1
strh r0,[r4,#12]
mov r0,r5
pop {r4,r5,r6,r7,r8,lr}
b func_00160380
.Lempty_links_00190348:
mov r0,#0
str r0,[r4,#4]
str r0,[r4,#8]
b .Lclear_occupancy_00190348
.Lremove_done_00190348:
pop {r4,r5,r6,r7,r8,pc}
END func_00190348

BEGIN func_00190410
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
bl func_0017E4D8
cmp r0,#0
beq .Lcontroller_update_done_00190410
ldr r0,.Lselector_offset_00190410
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r5,lsl #2
add r0,r0,#4096
ldr r1,[r0,#176]
mov r0,#1
ldrh r2,[r1,#160]
bic r2,r2,#255
strh r2,[r1,#160]
ldr r2,[r1]
orr r2,r2,#65536
str r2,[r1]
.Lcontroller_update_done_00190410:
pop {r4,r5,r6,pc}
END func_00190410
.Lselector_offset_00190410:
.word ipc_controller_selector_offset_77

BEGIN func_0019046C
push {r4,lr}
mov r4,r0
bl func_0017E4D8
cmp r0,#0
mvneq r0,#0
beq .Lcontroller_query_done_0019046C
ldr r0,.Lslot_offset_0019046C
ldrh r0,[r0,r4]
add r0,r4,r0,lsl #2
add r0,r0,#4096
ldr r0,[r0,#168]
ldrh r0,[r0,#2]
.Lcontroller_query_done_0019046C:
pop {r4,pc}
END func_0019046C
.Lslot_offset_0019046C:
.word ipc_controller_slot_offset_77
