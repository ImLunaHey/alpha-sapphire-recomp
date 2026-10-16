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

.global func_001603A0,func_0011B11C
.global service_completion_code_40,service_name_token_40
.global service_event_state_40,service_wait_pair_40

BEGIN func_0010EE40
push {r4,lr}
ldr r0,[r0]
svc #0x24
lsrs r1,r0,#31
mov r4,r0
blne func_001603A0
ldr r0,.Lpool_0010EE40
cmp r0,r4,lsl #22
movne r0,#1
moveq r0,#0
pop {r4,pc}
END func_0010EE40
.Lpool_0010EE40:
.word service_completion_code_40

BEGIN func_0010EEEC
push {r3,r4,r5,lr}
mov r1,sp
ldr r0,.Lpool_0010EEEC
bl func_0011B11C
lsrs r1,r0,#31
bne .Lreturn_0010EEEC
ldr r4,.Lpool_0010EEEC+4
mov r3,#0x10000000
mov r2,#1
mov r1,#0
ldr r0,[r4,#4]
svc #0x1f
lsrs r1,r0,#31
bne .Lreturn_0010EEEC
ldr r0,[sp]
str r0,[r4]
mov r0,#0
.Lreturn_0010EEEC:
pop {r3,r4,r5,pc}
END func_0010EEEC
.Lpool_0010EEEC:
.word service_name_token_40
.word service_event_state_40

BEGIN func_0013F2F0
ldr r1,[r0,#4]
cmp r1,#0
moveq r0,#0
bxeq lr
mov r2,#0
mov r3,r2
mov r0,r1
push {r4,lr}
svc #0x24
lsrs r1,r0,#31
mov r4,r0
blne func_001603A0
ldr r0,.Lpool_0013F2F0
cmp r0,r4,lsl #22
movne r0,#1
moveq r0,#0
eor r0,r0,#1
pop {r4,pc}
END func_0013F2F0
.Lpool_0013F2F0:
.word service_completion_code_40

BEGIN func_001781F0
push {r4,lr}
mov r4,r0
ldrb r0,[r0,#4]
cmp r0,#0
ldreq r0,[r4]
bne .Lreturn_001781F0
mvn r2,#0
mov r3,r2
svc #0x24
lsrs r1,r0,#31
blne func_001603A0
mov r0,#1
strb r0,[r4,#4]
.Lreturn_001781F0:
pop {r4,pc}
END func_001781F0

BEGIN func_002BEAAC
ldr r1,.Lpool_002BEAAC
add r0,r0,#0x2c00
add r0,r0,#0x2d8
push {r4,lr}
ldrd r2,[r1]
ldr r0,[r0]
svc #0x24
lsrs r1,r0,#31
mov r4,r0
blne func_001603A0
ldr r0,.Lpool_002BEAAC+4
cmp r0,r4,lsl #22
movne r0,#1
moveq r0,#0
pop {r4,pc}
END func_002BEAAC
.Lpool_002BEAAC:
.word service_wait_pair_40
.word service_completion_code_40

BEGIN func_003BB84C
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[r0,#116]
cmp r0,#0
cmpne r0,#4
ldrne r5,[r4,#120]
ldrne r0,[r5]
beq .Lreturn_003BB84C
mvn r2,#0
mov r3,r2
svc #0x24
lsrs r1,r0,#31
blne func_001603A0
mov r0,#1
strb r0,[r5,#4]
mov r0,#4
str r0,[r4,#116]
ldr r0,[r4,#116]
.Lreturn_003BB84C:
pop {r4,r5,r6,pc}
END func_003BB84C
