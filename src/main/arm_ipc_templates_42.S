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

.global func_00108808,func_001603A0,func_001103FC
.global func_003BD0B8,func_002CCD5C
.global service_resource_state_42,service_wait_handle_42
.global service_cleanup_vtable_42_a,service_cleanup_vtable_42_b
.global service_nonpositive_result_42,service_dispatch_state_42
.global service_unavailable_result_42,service_cleanup_vtable_42_c

BEGIN func_0010703C
push {lr}
sub sp,sp,#20
mov r0,#0
str r0,[sp,#8]
ldr r0,.Lpool_0010703C
ldr r1,[r0,#8]
str r1,[sp,#12]
ldr r1,[r0]
add r0,sp,#8
bl func_00108808
ldr r1,[sp,#8]
mov r3,#1
add r2,sp,#12
mov r0,sp
svc #0x3a
ldr r0,[sp,#8]
svc #0x23
ldr r0,[sp]
add sp,sp,#20
pop {pc}
END func_0010703C
.Lpool_0010703C:
.word service_resource_state_42

BEGIN func_001260B4
ldr r0,.Lpool_001260B4
push {r4,lr}
ldr r0,[r0]
cmp r0,#0
beq .Lfinish_001260B4
mvn r2,#0
mov r3,r2
svc #0x24
lsrs r1,r0,#31
blne func_001603A0
.Lfinish_001260B4:
pop {r4,lr}
b func_001103FC
END func_001260B4
.Lpool_001260B4:
.word service_wait_handle_42

BEGIN func_003BAF98
push {r4,r5,r6,lr}
mov r5,r0
ldr r0,.Lpool_003BAF98
add r4,r5,#16
str r0,[r5]
ldr r0,[r5,#16]
cmp r0,#0
beq .Ltail_003BAF98
svc #0x23
mov r0,#0
str r0,[r4]
.Ltail_003BAF98:
mov r0,r5
pop {r4,r5,r6,lr}
b func_003BD0B8
END func_003BAF98
.Lpool_003BAF98:
.word service_cleanup_vtable_42_a

BEGIN func_002BC658
ldr r1,.Lpool_002BC658
push {r4,r5,r6,lr}
mov r6,#0
str r1,[r0]
str r6,[r0,#40]
add r0,r0,#4096
add r0,r0,#324
mov r0,r0
sub r0,r0,#4096
sub r0,r0,#168
mov r0,r0
sub r5,r0,#156
sub r4,r0,#72
ldr r0,[r0,#-72]
cmp r0,#0
beq .Lfinish_002BC658
svc #0x23
str r6,[r4]
.Lfinish_002BC658:
mov r0,r5
pop {r4,r5,r6,pc}
END func_002BC658
.Lpool_002BC658:
.word service_cleanup_vtable_42_b

BEGIN func_002CC8D0
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,[r0,#4]
mov r5,#0
cmp r0,#0
ldrle r0,.Lpool_002CC8D0
ble .Lreturn_002CC8D0
ldr r0,[r4,#8]
svc #0x23
ldr r0,.Lpool_002CC8D0+4
ldrb r1,[r0,#4]
cmp r1,#0
ldreq r0,.Lpool_002CC8D0+8
addne r0,r0,#44
streq r5,[r4,#4]
beq .Lreturn_002CC8D0
ldr r1,[r4,#4]
bl func_002CCD5C
str r5,[r4,#4]
.Lreturn_002CC8D0:
pop {r4,r5,r6,pc}
END func_002CC8D0
.Lpool_002CC8D0:
.word service_nonpositive_result_42
.word service_dispatch_state_42
.word service_unavailable_result_42

BEGIN func_002CC9F8
push {r4,r5,r6,lr}
mov r4,r0
ldr r1,[r0,#4]
ldr r0,.Lpool_002CC9F8
cmp r1,#0
str r0,[r4]
ble .Lfinish_002CC9F8
ldr r0,[r4,#8]
svc #0x23
ldr r0,.Lpool_002CC9F8+4
mov r5,#0
ldrb r1,[r0,#4]
cmp r1,#0
addne r0,r0,#44
streq r5,[r4,#4]
beq .Lfinish_002CC9F8
ldr r1,[r4,#4]
bl func_002CCD5C
str r5,[r4,#4]
.Lfinish_002CC9F8:
mov r0,r4
pop {r4,r5,r6,pc}
END func_002CC9F8
.Lpool_002CC9F8:
.word service_cleanup_vtable_42_c
.word service_dispatch_state_42
