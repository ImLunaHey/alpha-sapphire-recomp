.syntax unified
.arch armv6k
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

.global func_00146000,func_00174DD0,service_mark_ready_secondary_44
.global func_001603A0,func_001781F0,func_0017E324
.global func_001602B8,func_00160380,func_002DE7D4,func_001397B8
.global service_reference_state_44,ipc_handle_slot_nu
.global service_handle_replacement_41_b,service_unlink_context_44
.global service_completion_code_40,service_thread_completion_counts_43
.global service_acquisition_input_44,service_cleanup_vtable_44

BEGIN func_00160594
mov r0,r0
ldr r0,.Lpool_00160594
ldr r1,[r0,#4]
cmp r1,#0
subgt r1,r1,#1
strgt r1,[r0,#4]
cmp r1,#0
bxne lr
ldrb r1,[r0]
cmp r1,#0
bxeq lr
push {r4,lr}
mov r1,#0
ldr r4,.Lpool_00160594+4
strb r1,[r0]
ldr r0,[r4]
cmp r0,#0
beq .Lfinish_00160594
svc #0x23
lsrs r0,r0,#31
blne func_00146000
ldr r0,.Lpool_00160594+8
ldr r0,[r0]
str r0,[r4]
.Lfinish_00160594:
pop {r4,pc}
END func_00160594
.Lpool_00160594:
.word service_reference_state_44
.word ipc_handle_slot_nu
.word service_handle_replacement_41_b

BEGIN func_00166FE4
push {r4,r5,r6,lr}
mov r4,r0
ldrb r0,[r0,#21]
cmp r0,#0
beq .Lfinish_00166FE4
mov r6,#1
strb r6,[r4,#20]
bl func_00174DD0
bl service_mark_ready_secondary_44
mvn r2,#0
ldr r0,[r4]
mov r5,#0
mov r3,r2
svc #0x24
lsrs r1,r0,#31
blne func_001603A0
mov r0,r4
strb r6,[r4,#4]
bl func_001781F0
ldr r0,[r4]
cmp r0,#0
beq .Lclear_00166FE4
svc #0x23
str r5,[r4]
.Lclear_00166FE4:
mvn r0,#0
str r0,[r4,#16]
strb r5,[r4,#21]
.Lfinish_00166FE4:
pop {r4,r5,r6,pc}
END func_00166FE4

BEGIN func_001780E8
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[r0,#20]
cmp r0,#0
beq .Lfinish_001780E8
ldr r1,[r4,#8]
mov r5,#0
cmp r1,#0
beq .Lclose_001780E8
ldrb r2,[r4,#24]
cmp r2,#0
streq r5,[r4,#8]
streq r5,[r4,#12]
beq .Lclose_001780E8
svc #0x20
lsrs r1,r0,#31
blne func_001603A0
ldr r0,.Lpool_001780E8
mov r1,r4
bl func_0017E324
.Lclose_001780E8:
ldr r0,[r4,#20]!
cmp r0,#0
beq .Lfinish_001780E8
svc #0x23
str r5,[r4]
.Lfinish_001780E8:
pop {r4,r5,r6,pc}
END func_001780E8
.Lpool_001780E8:
.word service_unlink_context_44

BEGIN func_0018C62C
push {r4,r5,r6,r7,r8,lr}
mov r6,r0
add r7,r0,#8
mov r4,r2
mov r5,r3
mov r0,r7
bl func_001602B8
ldr r0,[r6]
mov r2,r4
mov r3,r5
svc #0x24
lsrs r1,r0,#31
mov r4,r0
blne func_001603A0
ldr r0,.Lpool_0018C62C
cmp r0,r4,lsl #22
movne r4,#1
moveq r4,#0
beq .Lunlock_0018C62C
ldr r0,[r6]
svc #0x19
lsrs r1,r0,#31
blne func_001603A0
ldr r0,.Lpool_0018C62C+4
mov r1,r0
ldrb r0,[r0,r6]
add r0,r0,#1
strb r0,[r1,r6]
.Lunlock_0018C62C:
mov r0,r7
bl func_00160380
mov r0,r4
pop {r4,r5,r6,r7,r8,pc}
END func_0018C62C
.Lpool_0018C62C:
.word service_completion_code_40
.word service_thread_completion_counts_43

BEGIN func_002DDD28
push {r4,r5,lr}
mov r12,r1
ldr r1,.Lpool_002DDD28
sub sp,sp,#12
mov r5,#0
str r5,[sp,#8]
ldr r1,[r1]
mov r4,r0
ldr r0,[sp,#24]
str r3,[sp]
mov r3,r2
str r0,[sp,#4]
mov r2,r12
add r0,sp,#8
bl func_002DE7D4
lsrs r0,r0,#31
blne func_00146000
ldr r0,[r4]
cmp r0,#0
beq .Lreplace_002DDD28
svc #0x23
str r5,[r4]
.Lreplace_002DDD28:
ldr r0,[sp,#8]
str r0,[r4]
add sp,sp,#12
pop {r4,r5,pc}
END func_002DDD28
.Lpool_002DDD28:
.word service_acquisition_input_44

BEGIN func_0042D5E0
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,.Lpool_0042D5E0
str r0,[r4]
ldr r0,[r4,#88]
bl func_001397B8
mov r5,#0
str r5,[r4,#88]
ldr r0,[r4,#100]!
cmp r0,#0
beq .Lsecond_0042D5E0
svc #0x23
str r5,[r4]
.Lsecond_0042D5E0:
ldr r0,[r4,#-4]!
cmp r0,#0
beq .Lthird_0042D5E0
svc #0x23
str r5,[r4]
.Lthird_0042D5E0:
ldr r0,[r4,#-4]!
cmp r0,#0
beq .Lreturn_0042D5E0
svc #0x23
str r5,[r4]
.Lreturn_0042D5E0:
sub r0,r4,#92
pop {r4,r5,r6,pc}
END func_0042D5E0
.Lpool_0042D5E0:
.word service_cleanup_vtable_44
