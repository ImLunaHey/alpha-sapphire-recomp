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

.global func_0018C62C,ipc_refresh_secondary_72,func_001600B0
.global func_00132A14,ipc_registration_secondary_72,func_0018C6B4
.global func_00179DD0,func_00179FBC,func_0017E4D8,func_00186EB8
.global ipc_publish_secondary_72,func_0018E820,func_0018E5C0
.global func_0018E76C,func_0018E7A0,func_0018E54C,func_0018E5F4
.global func_001603A0,func_00190C20
.global ipc_state_flags_72,ipc_frame_payload_table_72
.global ipc_shared_control_owner_72,ipc_shutdown_service_owner_72
.global ipc_registration_handle_72,ipc_exchange_context_72
.global ipc_submission_owner_72,ipc_payload_stride_72

BEGIN func_0018C18C
push {r4,r5,r6,lr}
mov r5,#0
ldr r4,.Lpool_0018C18C_state
ldrb r0,[r4,#2]
cmp r0,#0
beq .Lstate_ready_0018C18C
ldr r2,.Lpool_0018C18C_payload
ldr r0,.Lpool_0018C18C_control
mov r3,#0
bl func_0018C62C
cmp r0,#0
moveq r0,#1
strbeq r0,[r4,#1]
beq .Lstate_ready_0018C18C
.Lrefresh_0018C18C:
ldr r0,.Lpool_0018C18C_control
bl ipc_refresh_secondary_72
strb r5,[r4,#5]
pop {r4,r5,r6,pc}
.Lstate_ready_0018C18C:
ldrb r0,[r4,#1]
cmp r0,#0
beq .Lregistration_0018C18C
ldr r0,.Lpool_0018C18C_shutdown
bl func_001600B0
ldr r0,.Lpool_0018C18C_shutdown
nop
bl func_00132A14
.Lregistration_0018C18C:
ldrb r0,[r4,#3]
cmp r0,#0
beq .Lfallback_0018C18C
pop {r4,r5,r6,lr}
mov r1,#0
ldr r0,.Lpool_0018C18C_handle
b ipc_registration_secondary_72
.Lfallback_0018C18C:
ldr r0,.Lpool_0018C18C_control
bl func_0018C6B4
nop
nop
b .Lrefresh_0018C18C
END func_0018C18C
.Lpool_0018C18C_state:
.word ipc_state_flags_72
.Lpool_0018C18C_payload:
.word ipc_frame_payload_table_72
.Lpool_0018C18C_control:
.word ipc_shared_control_owner_72
.Lpool_0018C18C_shutdown:
.word ipc_shutdown_service_owner_72
.Lpool_0018C18C_handle:
.word ipc_registration_handle_72

BEGIN func_0018C238
push {r4,r5,r6,lr}
mov r4,r1
ldrh r1,[r2,#2]
add r0,r0,r4
mov r5,r2
cmp r1,#0
movne r1,#1
strb r1,[r0,#4]
bl func_00179DD0
mov r2,r5
mov r1,r4
pop {r4,r5,r6,lr}
mov r0,r0
ldrh r3,[r2]
add ip,r1,r1,lsl #2
tst r3,#1
ldrhne r3,[r2,#2]
add r0,r0,ip,lsl #2
strhne r3,[r0,#2]
ldrh r3,[r2]
tst r3,#4
beq .Lword_fields_0018C238
ldrh r3,[r2,#6]
strh r3,[r0,#6]
ldrh r3,[r2,#12]
strh r3,[r0,#12]
ldrh r3,[r2,#14]
strh r3,[r0,#14]
ldrh r3,[r2,#16]
strh r3,[r0,#16]
ldrh r3,[r2,#18]
strh r3,[r0,#18]
.Lword_fields_0018C238:
ldrh r3,[r2]
tst r3,#2
ldrne r3,[r2,#8]
strne r3,[r0,#8]
ldr r0,.Lpool_0018C238_control
b func_00179FBC
END func_0018C238
.Lpool_0018C238_control:
.word ipc_shared_control_owner_72

BEGIN func_0018C3EC
push {r4,r5,r6,r7,r8,r9,sl,lr}
mov r4,r0
bl func_0017E4D8
cmp r0,#0
beq .Lreturn_0018C3EC
ldr r7,.Lpool_0018C3EC_exchange
ldr r8,.Lpool_0018C3EC_submission
bl func_00186EB8
add r5,r4,#4864
mov r9,r0
ldrh r0,[r5,#28]
ldr r1,.Lpool_0018C3EC_stride
add r0,r4,r0,lsl #3
ldr r6,[r1,r0]
add r0,r0,#4096
add r0,r0,#4
ldr sl,[r0,#752]
add r0,r1,#700
ldrb r0,[r0,r4]
cmp r0,#0
beq .Lpublish_primary_0018C3EC
mov r2,r6
mov r1,#0
mov r0,r7
bl ipc_publish_secondary_72
mov r2,sl
mov r1,#1
mov r0,r7
bl ipc_publish_secondary_72
.Lpublish_primary_0018C3EC:
mov r2,r6
mov r1,#0
mov r0,r7
bl func_0018E820
mov r2,sl
mov r1,#1
mov r0,r7
bl func_0018E820
mov r0,r8
nop
bl func_0018E5C0
mov r0,r8
nop
bl func_0018E76C
add r6,r4,#4096
mov r0,r7
ldr sl,[r6,#800]
bl func_0018E7A0
sub r7,sl,r0
mov r0,r9
bl func_0018E54C
sub r1,r7,r0
ldr r2,[r6,#804]
mov r0,r8
bl func_0018E5F4
ldrh r1,[r5,#30]
ldrh r0,[r5,#26]
add r1,r4,r1,lsl #2
add r1,r1,#4096
ldr r1,[r1,#152]
strh r0,[r1]
ldrh r0,[r5,#26]
add r0,r0,#1
strh r0,[r5,#26]
ldr r0,[r4,#4]
svc #24
lsrs r1,r0,#31
nop
blne func_001603A0
ldrh r0,[r5,#26]
and r0,r0,#1
strh r0,[r5,#30]
ldrb r0,[r5,#25]
add r0,r0,#1
strb r0,[r6,#793]
.Lreturn_0018C3EC:
pop {r4,r5,r6,r7,r8,r9,sl,pc}
END func_0018C3EC
.Lpool_0018C3EC_exchange:
.word ipc_exchange_context_72
.Lpool_0018C3EC_submission:
.word ipc_submission_owner_72
.Lpool_0018C3EC_stride:
.word ipc_payload_stride_72

BEGIN func_0018CA70
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[r0,r1,lsl #2]
mov r5,r2
mov r6,r3
mov r1,r2
bl func_00190C20
cmp r6,#0
strne r5,[r4,#28]
pop {r4,r5,r6,pc}
END func_0018CA70
