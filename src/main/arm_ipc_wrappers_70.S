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

.global func_00132C04,func_00178974,func_0018DCA8,func_00188878,func_0018B9B4
.global ipc_endpoint_primary_vtable_70,ipc_endpoint_secondary_vtable_70
.global ipc_endpoint_state_table_70,ipc_allocator_dispatch_owner_68
.global ipc_wait_error_code_70,ipc_wait_log_context_70
.global service_timing_scale_46,ipc_slot_error_context_70

BEGIN func_0018B220
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,.Lpool_0018B220_primary
ldr r2,.Lpool_0018B220_secondary
mov r6,#0
mov r5,r1
stm r4,{r0,r2,r6}
mvn r2,#0
str r2,[r4,#16]
add r0,r4,#8
str r6,[r4,#12]
bl func_00132C04
ldr r1,.Lpool_0018B220_state
str r1,[r4,#20]
add r1,r4,#28
strb r6,[r4,#24]
stm r1,{r5,r6}
str r5,[r4,#40]
str r6,[r4,#36]
ldr r0,.Lpool_0018B220_owner
ldrb r0,[r0,#4]
cmp r0,#0
bne .Ldisable_0018B220
ldr r0,[r4,#40]
cmp r0,#1073741824
movne r0,#1
bne .Lpublish_0018B220
.Ldisable_0018B220:
mov r0,#0
.Lpublish_0018B220:
strb r0,[r4,#44]
mov r0,r4
pop {r4,r5,r6,pc}
END func_0018B220
.Lpool_0018B220_primary:
.word ipc_endpoint_primary_vtable_70
.Lpool_0018B220_secondary:
.word ipc_endpoint_secondary_vtable_70
.Lpool_0018B220_state:
.word ipc_endpoint_state_table_70
.Lpool_0018B220_owner:
.word ipc_allocator_dispatch_owner_68

BEGIN func_0018B2AC
push {r4,r5,r6,lr}
cmp r1,#0
mov r4,r0
ldreq r0,.Lpool_0018B2AC_owner
ldreq r1,[r0,#104]
str r1,[r4,#24]
ldr r0,[r4,#12]
ldr r0,[r0]
cmp r0,#0
beq .Lstart_0018B2AC
ldr r1,.Lpool_0018B2AC_error
ldr r0,.Lpool_0018B2AC_context
mov r3,#0
mov r2,#-536870898
bl func_00178974
mov r0,#0
pop {r4,r5,r6,pc}
.Lstart_0018B2AC:
mov r1,#0
mov r0,#1
strb r1,[r4,#29]
strb r0,[r4,#28]
mov r0,r4
bl func_0018DCA8
ldrb r0,[r4,#29]
cmp r0,#0
ldreq r5,.Lpool_0018B2AC_scale
bne .Lsuccess_0018B2AC
.Lwait_0018B2AC:
mov r0,r5
mov r1,#0
bl func_00188878
ldrb r0,[r4,#29]
cmp r0,#0
beq .Lwait_0018B2AC
.Lsuccess_0018B2AC:
mov r0,#1
pop {r4,r5,r6,pc}
END func_0018B2AC
.Lpool_0018B2AC_owner:
.word ipc_allocator_dispatch_owner_68
.Lpool_0018B2AC_error:
.word ipc_wait_error_code_70
.Lpool_0018B2AC_context:
.word ipc_wait_log_context_70
.Lpool_0018B2AC_scale:
.word service_timing_scale_46

BEGIN func_0018B348
push {r4,lr}
mov r4,r0
ldr r0,[r1,#16]
ldr r2,[r1,#12]
sub r0,r0,r2
ldr r2,[r4,#32]
cmp r0,r2
ldrcs r2,[r4,#36]
cmpcs r2,r0
movcc r0,#0
bcc .Lreturn_0018B348
add r0,r4,#8
bl func_0018B9B4
ldr r0,[r4]
ldr r1,[r0,#28]
mov r0,r4
blx r1
mov r0,#1
.Lreturn_0018B348:
pop {r4,pc}
END func_0018B348

BEGIN func_0018B394
cmp r2,#14
push {r4,lr}
bcc .Linspect_0018B394
ldr r0,.Lpool_0018B394_context
mov r3,#0
mov r2,#-536870909
mov r1,#62
bl func_00178974
mov r0,#0
.Learly_return_0018B394:
pop {r4,pc}
.Linspect_0018B394:
add r0,r0,r2,lsl #2
ldr r2,[r0,#4]
cmp r2,#0
streq r1,[r0,#4]
moveq r0,#1
beq .Learly_return_0018B394
ldr r0,.Lpool_0018B394_context
mov r3,#0
mov r2,#-536870897
mov r1,#68
bl func_00178974
mov r0,#0
.Lreturn_0018B394:
pop {r4,pc}
END func_0018B394
.Lpool_0018B394_context:
.word ipc_slot_error_context_70
