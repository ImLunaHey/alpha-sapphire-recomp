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

.global func_001644DC,func_0017080C,func_001602B8,func_001603A0
.global func_00160380,func_00174314,func_00178228,func_00124BA4
.global service_dispatch_state_42,service_unavailable_result_42
.global service_lifecycle_object_43,service_initialized_byte_35
.global service_replacement_source_43,service_thread_completion_counts_43
.global ipc_handle_slot_alpha,service_absent_result_41_a
.global service_handle_replacement_41_a,service_wait_handle_42

BEGIN func_00148344
push {r4,r5,r6,lr}
mov r5,#0
ldr r4,.Lpool_00148344
ldrb r0,[r4,#4]
cmp r0,#0
ldreq r0,.Lpool_00148344+4
beq .Lfinish_00148344
add r0,r4,#44
bl func_001644DC
ldr r0,[r4,#40]
add r6,r4,#40
cmp r0,#0
beq .Lskip_handle_00148344
svc #0x23
str r5,[r6]
.Lskip_handle_00148344:
ldr r0,[r4,#28]
cmp r0,#0
addne r0,r4,#8
blne func_0017080C
mov r0,r5
strb r5,[r4,#4]
.Lfinish_00148344:
pop {r4,r5,r6,pc}
END func_00148344
.Lpool_00148344:
.word service_dispatch_state_42
.word service_unavailable_result_42

BEGIN func_0010FB40
push {r4,r5,r6,lr}
mov r5,r0
add r4,r0,#8
mov r0,r4
bl func_001602B8
ldrb r0,[r5,#4]
cmp r0,#0
bne .Lunlock_0010FB40
ldr r0,[r5,#20]
mov r1,#1
strb r1,[r5,#4]
cmp r0,#0
beq .Lunlock_0010FB40
ldr r0,[r0]
cmp r0,#0
beq .Lunlock_0010FB40
svc #0x18
lsrs r1,r0,#31
blne func_001603A0
.Lunlock_0010FB40:
mov r0,r4
bl func_00160380
mov r0,#0
pop {r4,r5,r6,pc}
END func_0010FB40

BEGIN func_00164F80
mov r0,r0
ldr r0,.Lpool_00164F80
push {r4,lr}
bl func_001602B8
ldr r4,.Lpool_00164F80+4
ldrb r0,[r4]
cmp r0,#0
beq .Ltail_00164F80
ldr r0,[r4,#28]
bl func_00174314
ldr r0,[r4,#16]
svc #0x23
ldr r0,.Lpool_00164F80+8
ldr r0,[r0,#4]
str r0,[r4,#20]
mov r0,#0
strb r0,[r4]
ldr r0,.Lpool_00164F80
pop {r4,lr}
b func_00160380
.Ltail_00164F80:
ldr r0,.Lpool_00164F80
pop {r4,lr}
b func_00160380
END func_00164F80
.Lpool_00164F80:
.word service_lifecycle_object_43
.word service_initialized_byte_35
.word service_replacement_source_43

BEGIN func_0017080C
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[r0,#20]
cmp r0,#0
beq .Lfinish_0017080C
ldr r1,[r4,#8]
mov r5,#0
cmp r1,#0
beq .Lclose_0017080C
ldrb r2,[r4,#24]
cmp r2,#0
streq r5,[r4,#8]
streq r5,[r4,#12]
beq .Lclose_0017080C
svc #0x20
mov r0,r4
bl func_00178228
.Lclose_0017080C:
ldr r0,[r4,#20]!
cmp r0,#0
beq .Lfinish_0017080C
svc #0x23
str r5,[r4]
.Lfinish_0017080C:
pop {r4,r5,r6,pc}
END func_0017080C

BEGIN func_0018C6B4
push {r4,r5,r6,lr}
mov r5,r0
add r4,r0,#8
mov r0,r4
bl func_001602B8
mvn r2,#0
ldr r0,[r5]
mov r3,r2
svc #0x24
lsrs r1,r0,#31
blne func_001603A0
ldr r0,[r5]
svc #0x19
lsrs r1,r0,#31
blne func_001603A0
ldr r0,.Lpool_0018C6B4
mov r1,r0
ldrb r0,[r0,r5]
add r0,r0,#1
strb r0,[r1,r5]
mov r0,r4
pop {r4,r5,r6,lr}
b func_00160380
END func_0018C6B4
.Lpool_0018C6B4:
.word service_thread_completion_counts_43

BEGIN func_00126414
push {r4,lr}
ldr r4,.Lpool_00126414
ldr r0,[r4]
cmp r0,#0
ldreq r0,.Lpool_00126414+4
beq .Lreport_first_00126414
svc #0x23
ldr r1,.Lpool_00126414+8
ldr r1,[r1]
str r1,[r4]
.Lreport_first_00126414:
mov r1,pc
lsrs r2,r0,#31
blne func_00124BA4
ldr r0,.Lpool_00126414+12
ldr r0,[r0]
cmp r0,#0
beq .Lfinish_00126414
svc #0x14
lsrs r1,r0,#31
nop
beq .Lfinish_00126414
pop {r4,lr}
b func_001603A0
.Lfinish_00126414:
pop {r4,pc}
END func_00126414
.Lpool_00126414:
.word ipc_handle_slot_alpha
.word service_absent_result_41_a
.word service_handle_replacement_41_a
.word service_wait_handle_42
