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

.global func_00146000,func_002DD944,func_001602B8,func_00160380
.global func_00125E50,func_002FF034,service_open_31
.global func_0015EC10,service_scale_dispatch_secondary_46,func_00529BDC
.global service_group_state_46,service_handle_array_46,service_finalize_context_46
.global service_owned_handle_46,service_handle_replacement_46
.global service_shared_ref_state_46,service_ref_failure_marker_46
.global service_initialized_byte_35,service_lifecycle_object_43
.global service_creation_context_46,service_session_object_35
.global service_replacement_source_43,service_state_slot_35
.global service_timing_scale_46,service_record_vtable_46
.global service_debug_state_46,service_debug_enable_46
.global service_ref_lock_46,service_ref_state_46,service_ref_busy_marker_46
.global ipc_handle_slot_delta,service_ref_replacement_46

BEGIN func_00201668
push {r4,r5,r6,lr}
ldr r6,.Lpool_00201668
ldr r0,[r6,#8]
cmp r0,#0
beq .Lfinish_00201668
ldr r0,[r6,#12]
cmp r0,#0
blne func_00146000
ldr r5,.Lpool_00201668+4
mov r4,#0
.Lclose_loop_00201668:
ldr r0,[r5,r4,lsl #2]
cmp r0,#0
blne func_00146000
add r4,r4,#1
cmp r4,#8
blt .Lclose_loop_00201668
ldr r0,.Lpool_00201668+8
bl func_002DD944
ldr r0,.Lpool_00201668+12
ldr r0,[r0]
svc #0x23
ldr r0,.Lpool_00201668+16
mov r1,#0
ldr r0,[r0,#4]
str r1,[r6,#8]!
str r0,[r6,#12]
.Lfinish_00201668:
pop {r4,r5,r6,pc}
END func_00201668
.Lpool_00201668:
.word service_group_state_46
.word service_handle_array_46
.word service_finalize_context_46
.word service_owned_handle_46
.word service_handle_replacement_46

BEGIN func_002C36DC
push {r4,r5,r6,lr}
ldr r5,.Lpool_002C36DC
add r4,r5,#4
mov r0,r4
bl func_001602B8
ldr r0,[r5,#16]
mov r6,#0
cmp r0,#0
bgt .Ldecrement_002C36DC
ldr r5,.Lpool_002C36DC+4
mov r0,r4
bl func_00160380
mov r0,r5
pop {r4,r5,r6,pc}
.Ldecrement_002C36DC:
sub r0,r0,#1
cmp r0,#1
str r0,[r5,#16]
bge .Lsuccess_002C36DC
ldr r0,[r5,#20]!
cmp r0,#0
beq .Lsuccess_002C36DC
svc #0x23
str r6,[r5]
.Lsuccess_002C36DC:
mov r5,#0
mov r0,r4
bl func_00160380
mov r0,r5
pop {r4,r5,r6,pc}
END func_002C36DC
.Lpool_002C36DC:
.word service_shared_ref_state_46
.word service_ref_failure_marker_46

BEGIN func_0010FCF4
push {r4,r5,r6,lr}
ldr r4,.Lpool_0010FCF4
ldrb r0,[r4]
cmp r0,#0
beq .Linitialize_0010FCF4
add r0,r4,#20
pop {r4,r5,r6,lr}
mov r1,#1
b func_00125E50
.Linitialize_0010FCF4:
ldr r0,.Lpool_0010FCF4+4
bl func_001602B8
ldr r0,[r4,#4]
mov r5,r0
bl func_002FF034
mov r2,r0
ldr r0,.Lpool_0010FCF4+8
mov r3,#0
mov r1,r5
bl service_open_31
ldr r0,[r4,#16]
mov r1,#1
str r0,[r4,#20]
ldr r0,.Lpool_0010FCF4+12
bl func_00125E50
ldr r0,[r4,#16]
nop {0}
svc #0x23
ldr r0,.Lpool_0010FCF4+16
ldr r0,[r0,#4]
str r0,[r4,#20]
pop {r4,r5,r6,lr}
ldr r0,.Lpool_0010FCF4+4
b func_00160380
END func_0010FCF4
.Lpool_0010FCF4:
.word service_initialized_byte_35
.word service_lifecycle_object_43
.word service_creation_context_46
.word service_session_object_35
.word service_replacement_source_43

BEGIN func_0015FFE8
push {r4,r5,r6,lr}
cmp r0,#0
ldr r5,.Lpool_0015FFE8
movne r6,#100
moveq r6,#380
mov r4,#0
ldrb r0,[r5]
cmp r0,#0
beq .Lfinish_0015FFE8
ldrb r0,[r5,#1]
cmp r0,#0
beq .Lcalculate_0015FFE8
svc #0x28
tst r0,#16
beq .Lcalculate_0015FFE8
and r0,r0,#15
add r1,r0,#1
mov r0,r6
bl func_0015EC10
mov r4,r0
.Lcalculate_0015FFE8:
ldr r0,[r5,#24]
add r0,r0,r4
lsl r1,r0,#16
lsrs r1,r1,#16
beq .Lfinish_0015FFE8
ldr ip,.Lpool_0015FFE8+4
mov r2,#0
mov r3,r2
umull r0,r4,r1,ip
mla r2,r2,ip,r4
pop {r4,r5,r6,lr}
mla r1,r1,r3,r2
b service_scale_dispatch_secondary_46
.Lfinish_0015FFE8:
pop {r4,r5,r6,pc}
END func_0015FFE8
.Lpool_0015FFE8:
.word service_state_slot_35
.word service_timing_scale_46

BEGIN func_001D2314
push {r4,r5,r6,r7,lr}
movs r4,r1
sub sp,sp,#12
mov r6,r0
mov r5,r2
beq .Lsuccess_001D2314
ldr r0,[r4]
ldr r1,.Lpool_001D2314
cmp r0,r1
movne r0,#0
bne .Lreturn_001D2314
ldr r7,.Lpool_001D2314+4
ldr r0,.Lpool_001D2314+8
ldrsb r1,[r7]
ldrb r0,[r0,#21]
rsb r1,r1,#0
tst r0,r1
beq .Lsuccess_001D2314
svc #0x28
ldrb r2,[r4,#4]
and r3,r2,#240
cmp r3,#64
bne .Lsuccess_001D2314
ldr r2,[r7,#4]
add r2,r2,#1
str r2,[r7,#4]
strd r0,[sp]
mov r2,r5
mov r1,r4
mov r0,r6
bl func_00529BDC
.Lsuccess_001D2314:
mov r0,#1
.Lreturn_001D2314:
add sp,sp,#12
pop {r4,r5,r6,r7,pc}
END func_001D2314
.Lpool_001D2314:
.word service_record_vtable_46
.word service_debug_state_46
.word service_debug_enable_46

BEGIN func_002C3404
ldr r0,.Lpool_002C3404
push {r4,r5,r6,lr}
mov r4,r0
bl func_001602B8
ldr r5,.Lpool_002C3404+4
ldr r0,[r5,#4]
cmp r0,#1
ble .Lclose_002C3404
sub r0,r0,#1
str r0,[r5,#4]
ldr r5,.Lpool_002C3404+8
b .Lunlock_002C3404
.Lclose_002C3404:
ldr r6,.Lpool_002C3404+12
ldr r0,[r6]
svc #0x23
ands r1,r0,#0x80000000
nop {0}
bmi .Lresult_002C3404
ldr r1,[r5,#4]
sub r1,r1,#1
str r1,[r5,#4]
.Lresult_002C3404:
mov r5,r0
lsrs r0,r0,#31
blne func_00146000
ands r0,r5,#0x80000000
nop {0}
bmi .Lunlock_002C3404
ldr r0,.Lpool_002C3404+16
ldr r0,[r0]
str r0,[r6]
.Lunlock_002C3404:
mov r0,r4
bl func_00160380
mov r0,r5
pop {r4,r5,r6,pc}
END func_002C3404
.Lpool_002C3404:
.word service_ref_lock_46
.word service_ref_state_46
.word service_ref_busy_marker_46
.word ipc_handle_slot_delta
.word service_ref_replacement_46
