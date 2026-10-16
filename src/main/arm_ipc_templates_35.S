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

.global func_001240C4,func_001182D0,func_00118C94,func_0012408C
.global func_00125584,func_00146000,func_001260B4,func_001266B4
.global func_00126414,func_00126000,func_001266FC,func_00124BA4
.global func_00145FC0,func_00124FB0,func_00125E50,func_00133ECC
.global func_00124838,func_002028C4,func_002030EC,func_002C6660
.global service_state_slot_35,service_request_kind_35
.global service_initialized_byte_35,service_session_object_35

BEGIN func_0010EC28
push {r3,r4,r5,lr}
mov r4,r0
bl func_001240C4
str r0,[sp]
mov r1,r4
mov r0,sp
bl func_001182D0
pop {r3,r4,r5,pc}
END func_0010EC28

BEGIN func_0010F1F4
mov r0,r0
push {r3,lr}
mov r0,#0
strb r0,[sp]
mov r0,sp
bl func_00118C94
ldrb r0,[sp]
pop {r3,pc}
END func_0010F1F4

BEGIN func_00118294
ldr r1,.Lpool_00118294
push {r3,lr}
str r0,[r1,#16]
str r0,[sp]
ldr r1,.Lpool_00118294+4
mov r0,sp
bl func_0012408C
mov r0,#0
pop {r3,pc}
END func_00118294
.Lpool_00118294:
.word service_state_slot_35
.word service_request_kind_35

BEGIN func_00118578
push {r4,lr}
bl func_00125584
lsrs r0,r0,#31
beq .Lreturn_00118578
pop {r4,lr}
b func_00146000
.Lreturn_00118578:
pop {r4,pc}
END func_00118578

BEGIN func_0011B11C
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
bl func_001260B4
mov r1,r5
mov r0,r4
bl func_001266B4
mov r4,r0
bl func_00126414
mov r0,r4
pop {r4,r5,r6,pc}
END func_0011B11C

BEGIN func_0011B818
push {r4,lr}
mov r4,r0
bl func_001260B4
bl func_00126000
mov r1,r4
bl func_001266FC
mov r1,pc
lsrs r2,r0,#31
blne func_00124BA4
pop {r4,lr}
b func_00126414
END func_0011B818

BEGIN func_0012437C
push {r3,lr}
mov r0,sp
bl func_00145FC0
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrsb r0,[sp]
pop {r3,pc}
END func_0012437C

BEGIN func_00125DC0
mov r0,r0
ldr r0,.Lpool_00125DC0
ldrb r0,[r0]
cmp r0,#0
beq .Lreturn_00125DC0
ldr r0,.Lpool_00125DC0+4
mov r1,#0
b func_00125E50
.Lreturn_00125DC0:
bx lr
END func_00125DC0
.Lpool_00125DC0:
.word service_initialized_byte_35
.word service_session_object_35

BEGIN func_001265DC
push {r4,lr}
bl func_001260B4
bl func_00126000
bl func_00133ECC
mov r1,pc
lsrs r2,r0,#31
blne func_00124BA4
pop {r4,lr}
b func_00126414
END func_001265DC

BEGIN func_00178238
push {lr}
sub sp,sp,#12
mov r1,sp
bl func_00124838
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrd r0,[sp]
add sp,sp,#12
pop {pc}
END func_00178238

BEGIN func_0020282C
push {r4,lr}
mov r4,r0
bl func_002028C4
mov r0,r4
pop {r4,pc}
END func_0020282C

BEGIN func_00203050
push {r3,r4,r5,lr}
mov r4,r0
mov r0,sp
bl func_002030EC
lsrs r1,r0,#31
bne .Lreturn_00203050
ldr r0,[sp]
strb r0,[r4]
mov r0,#0
.Lreturn_00203050:
pop {r3,r4,r5,pc}
END func_00203050

BEGIN func_002C669C
push {r4,lr}
bl func_002C6660
lsrs r0,r0,#31
beq .Lreturn_002C669C
pop {r4,lr}
b func_00146000
.Lreturn_002C669C:
pop {r4,pc}
END func_002C669C
