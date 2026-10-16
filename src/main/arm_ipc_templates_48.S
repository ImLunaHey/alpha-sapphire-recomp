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

.global func_001602B8,func_001608E4,func_00160380,func_00170A3C
.global func_0014967C,func_00174848,func_001342C8
.global service_queue_core_state_48,service_queue_submit_error_48
.global service_session_lock_48,service_session_state_48

BEGIN func_00165B84
push {r4,r5,r6,lr}
mov r5,r0
ldr r6,.Lpool_00165B84
add r4,r6,#88
mov r0,r4
bl func_001602B8
mov r1,r5
mov r0,r6
bl func_001608E4
mov r0,r4
pop {r4,r5,r6,lr}
b func_00160380
END func_00165B84
.Lpool_00165B84:
.word service_queue_core_state_48

BEGIN func_00165BB8
push {r4,r5,r6,r7,r8,r9,r10,r11,lr}
sub sp,sp,#12
mov r5,r1
mov r10,r0
mov r11,#0
ldr r7,.Lpool_00165BB8
mov r6,r2
mov r8,r11
add r4,r7,#88
mov r9,r11
mov r0,r4
bl func_001602B8
mov r3,r11
mov r2,r6
mov r1,r5
mov r0,r7
strd r8,[sp]
bl func_00170A3C
mov r5,r0
mov r0,r4
bl func_00160380
cmp r5,#0
str r5,[r10]
add sp,sp,#12
ldreq r0,.Lpool_00165BB8+4
movne r0,#0
pop {r4,r5,r6,r7,r8,r9,r10,r11,pc}
END func_00165BB8
.Lpool_00165BB8:
.word service_queue_core_state_48
.word service_queue_submit_error_48

BEGIN func_00165C2C
push {r4,r5,r6,r7,r8,r9,r10,lr}
mov r5,r0
sub sp,sp,#8
mov r10,#0
ldr r7,.Lpool_00165C2C
mov r6,r1
mov r8,r10
add r4,r7,#88
mov r9,r10
mov r0,r4
bl func_001602B8
mov r3,r10
mov r2,r6
mov r1,r5
mov r0,r7
strd r8,[sp]
bl func_00170A3C
mov r5,r0
mov r0,r4
bl func_00160380
add sp,sp,#8
mov r0,r5
pop {r4,r5,r6,r7,r8,r9,r10,pc}
END func_00165C2C
.Lpool_00165C2C:
.word service_queue_core_state_48

BEGIN func_00165C8C
push {r3,r4,r5,lr}
ldr r4,.Lpool_00165C8C
mov r0,r4
bl func_001602B8
ldr r0,.Lpool_00165C8C+4
ldr r0,[r0,#4]
cmp r0,#0
movne r5,#1
moveq r5,#0
mov r0,r4
bl func_00160380
cmp r5,#0
bne .Lquery_00165C8C
bl func_0014967C
cmp r0,#0
beq .Lreturn_00165C8C
.Lquery_00165C8C:
mov r0,sp
bl func_00174848
and r0,r0,#0x80000000
cmp r0,#0
ldrsbge r0,[sp]
movlt r0,#0
.Lreturn_00165C8C:
pop {r3,r4,r5,pc}
END func_00165C8C
.Lpool_00165C8C:
.word service_session_lock_48
.word service_session_state_48

BEGIN func_00165CF0
push {r4,r5,r6,lr}
ldr r4,.Lpool_00165CF0
mov r0,r4
bl func_001602B8
ldr r0,.Lpool_00165CF0+4
ldr r0,[r0,#4]
cmp r0,#0
movne r5,#1
moveq r5,#0
mov r0,r4
bl func_00160380
mov r0,r5
pop {r4,r5,r6,pc}
END func_00165CF0
.Lpool_00165CF0:
.word service_session_lock_48
.word service_session_state_48

BEGIN func_00165D30
push {r4,r5,lr}
sub sp,sp,#20
ldr r4,.Lpool_00165D30
mov r0,r4
bl func_001602B8
ldr r0,.Lpool_00165D30+4
ldr r0,[r0,#4]
cmp r0,#0
movne r5,#1
moveq r5,#0
mov r0,r4
bl func_00160380
cmp r5,#0
bne .Lquery_00165D30
bl func_0014967C
cmp r0,#0
beq .Lreturn_00165D30
.Lquery_00165D30:
mov r0,sp
bl func_001342C8
and r0,r0,#0x80000000
cmp r0,#0
ldrge r0,[sp]
movlt r0,#0
.Lreturn_00165D30:
add sp,sp,#20
pop {r4,r5,pc}
END func_00165D30
.Lpool_00165D30:
.word service_session_lock_48
.word service_session_state_48
