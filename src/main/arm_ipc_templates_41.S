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

.global func_00124BA4,func_00146000,func_00150874
.global func_001602B8,func_00160380,func_001603A0
.global func_00145550,func_00174748,func_0017080C
.global ipc_handle_slot_alpha
.global service_absent_result_41_a,service_handle_replacement_41_a
.global service_absent_result_41_b,service_handle_replacement_41_b
.global service_guard_state_41,service_owned_handle_41
.global service_finalize_token_41,service_cleanup_vtable_41

BEGIN func_0010FF44
push {r4,lr}
ldr r4,.Lpool_0010FF44
ldr r0,[r4]
cmp r0,#0
ldreq r0,.Lpool_0010FF44+4
beq .Lfinish_0010FF44
svc #0x23
ldr r1,.Lpool_0010FF44+8
ldr r1,[r1]
str r1,[r4]
.Lfinish_0010FF44:
mov r4,r0
mov r1,pc
lsrs r2,r0,#31
blne func_00124BA4
mov r0,r4
pop {r4,pc}
END func_0010FF44
.Lpool_0010FF44:
.word ipc_handle_slot_alpha
.word service_absent_result_41_a
.word service_handle_replacement_41_a

BEGIN func_00132EE8
push {r4,r5,r6,lr}
mov r5,r0
ldr r0,[r0]
cmp r0,#0
ldreq r4,.Lpool_00132EE8
beq .Lfinish_00132EE8
svc #0x23
mov r4,r0
lsrs r0,r0,#31
blne func_00146000
ldr r0,.Lpool_00132EE8+4
ldr r0,[r0]
str r0,[r5]
.Lfinish_00132EE8:
mov r0,r4
pop {r4,r5,r6,pc}
END func_00132EE8
.Lpool_00132EE8:
.word service_absent_result_41_b
.word service_handle_replacement_41_b

BEGIN func_0013ADA8
push {r4,r5,r6,lr}
mov r4,r0
add r5,r0,#536
mov r0,r5
bl func_001602B8
ldr r0,[r4,#516]
svc #0x19
lsrs r1,r0,#31
blne func_001603A0
ldrb r0,[r4,#528]
cmp r0,#0
beq .Lclear_return_0013ADA8
mov r0,#0
strb r0,[r4,#528]
mov r0,r5
bl func_00160380
pop {r4,r5,r6,lr}
b func_00145550
.Lclear_return_0013ADA8:
mov r4,#0
mov r0,r5
bl func_00160380
mov r0,r4
pop {r4,r5,r6,pc}
END func_0013ADA8

BEGIN func_0013B0A8
push {r4,r5,r6,lr}
mov r4,r0
bl func_00150874
ldr r0,[r4,#8]
mov r6,#0
add r5,r4,#8
cmp r0,#0
beq .Lskip_handle_0013B0A8
svc #0x23
str r6,[r5]
.Lskip_handle_0013B0A8:
ldr r0,[r4,#24]
cmp r0,#0
beq .Lclear_state_0013B0A8
ldr r1,[r0]
ldr r1,[r1,#4]
blx r1
str r6,[r4,#24]
.Lclear_state_0013B0A8:
str r6,[r4,#28]
str r6,[r4,#32]
pop {r4,r5,r6,pc}
END func_0013B0A8

BEGIN func_00165A60
ldr r0,.Lpool_00165A60
push {r3,r4,r5,lr}
mov r5,#0
strb r5,[r0]
ldr r0,[r0,#4]
str r0,[sp]
mov r0,sp
bl func_00174748
ldr r4,.Lpool_00165A60+4
ldr r0,[r4]
cmp r0,#0
beq .Lskip_close_00165A60
svc #0x23
str r5,[r4]
.Lskip_close_00165A60:
ldr r0,.Lpool_00165A60+8
bl func_0017080C
pop {r3,r4,r5,pc}
END func_00165A60
.Lpool_00165A60:
.word service_guard_state_41
.word service_owned_handle_41
.word service_finalize_token_41

BEGIN func_001FBE68
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,.Lpool_001FBE68
str r0,[r4]
ldr r0,[r4,#4]
cmp r0,#0
beq .Lfinish_001FBE68
mov r6,#0
str r6,[r4,#12]
ldr r0,[r4,#4]
add r5,r4,#4
svc #0x23
str r6,[r5]
.Lfinish_001FBE68:
mov r0,r4
pop {r4,r5,r6,pc}
END func_001FBE68
.Lpool_001FBE68:
.word service_cleanup_vtable_41
