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

.global func_00124880,func_00124FB0
.global func_001602B8,func_00160380,func_001F4A1C
.global service_seed_halfword_33,service_request_kind_33
.global service_lock_object_33
.global service_operation_object_33
.global service_result_object_33

BEGIN func_002009A4
push {r3,r4,r5,lr}
mov r4,r0
ldr r0,.Lpool_002009A4
ldr r2,.Lpool_002009A4+4
mov r1,#2
ldrh r0,[r0]
strh r0,[sp]
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrb r0,[sp]
strb r0,[r4]
ldrb r0,[sp,#1]
strb r0,[r4,#1]
pop {r3,r4,r5,pc}
END func_002009A4
.Lpool_002009A4:
.word service_seed_halfword_33
.word service_request_kind_33

BEGIN func_002009F0
push {r4,r5,lr}
sub sp,sp,#28
mov r4,r0
mov r2,#0xa0000
mov r1,#28
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldm sp,{r0,r1,r2,r3,r5,r12}
stm r4,{r0,r1,r2,r3,r5,r12}
add sp,sp,#28
pop {r4,r5,pc}
END func_002009F0

BEGIN func_00200A28
push {r3,r4,r5,lr}
mov r2,#0xd0000
mov r1,#4
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldr r0,.Lpool_00200A28
bl func_001602B8
ldr r0,.Lpool_00200A28+4
bl func_001F4A1C
ands r0,r0,#0x80000000
bpl .Lsuccess_00200A28
ldr r0,.Lpool_00200A28
bl func_00160380
mov r0,#0
pop {r3,r4,r5,pc}
.Lsuccess_00200A28:
ldr r0,.Lpool_00200A28+8
ldrb r4,[r0,#44]
ldrb r5,[r0,#45]
ldr r0,.Lpool_00200A28
bl func_00160380
ldrh r1,[sp]
orr r0,r4,r5,lsl #8
cmp r1,r0
movcs r0,#1
movcc r0,#0
pop {r3,r4,r5,pc}
END func_00200A28
.Lpool_00200A28:
.word service_lock_object_33
.word service_operation_object_33
.word service_result_object_33

BEGIN func_00200ABC
push {lr}
sub sp,sp,#196
mov r2,#0xc0000
mov r1,#192
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldr r0,[sp]
add sp,sp,#196
and r0,r0,#32
lsr r0,r0,#5
pop {pc}
END func_00200ABC

BEGIN func_00200B2C
push {lr}
sub sp,sp,#12
mov r0,#0
mov r1,r0
strd r0,[sp]
mov r2,#0x90000
mov r1,#8
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrd r0,[sp]
add sp,sp,#12
pop {pc}
END func_00200B2C

BEGIN func_00200B68
push {lr}
sub sp,sp,#196
mov r2,#0xc0000
mov r1,#192
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldr r0,[sp]
add sp,sp,#196
and r0,r0,#64
lsr r0,r0,#6
pop {pc}
END func_00200B68

BEGIN func_00200BA0
push {lr}
sub sp,sp,#196
mov r2,#0xc0000
mov r1,#192
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldr r0,[sp]
add sp,sp,#196
and r0,r0,#16
lsr r0,r0,#4
pop {pc}
END func_00200BA0

BEGIN func_00200BD8
push {lr}
sub sp,sp,#196
mov r2,#0xc0000
mov r1,#192
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldr r0,[sp]
add sp,sp,#196
and r0,r0,#8
lsr r0,r0,#3
pop {pc}
END func_00200BD8
