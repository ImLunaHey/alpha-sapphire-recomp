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

.global func_001260B4,func_001103C0,func_00126414
.global func_001182C0,func_00118300,func_00146000
.global func_001240C4,func_00160078,func_00164F74,func_00164EE4
.global func_0016516C,func_001F70F4,func_001F712C,func_00124FB0

BEGIN func_00109C40
push {r4,lr}
mov r4,r0
bl func_001260B4
mov r0,r4
bl func_001103C0
mov r4,r0
bl func_00126414
mov r0,r4
pop {r4,pc}
END func_00109C40

BEGIN func_0010EC48
push {r3,r4,r5,lr}
mov r5,r0
mov r4,r1
bl func_001182C0
str r0,[sp]
mov r2,r5
mov r3,r4
mov r1,#4096
mov r0,sp
bl func_00118300
lsrs r0,r0,#31
blne func_00146000
pop {r3,r4,r5,pc}
END func_0010EC48

BEGIN func_001456E4
push {r3,r4,r5,lr}
mov r4,r0
bl func_001240C4
str r0,[sp]
mov r1,r4
mov r0,sp
bl func_00160078
pop {r3,r4,r5,pc}
END func_001456E4

BEGIN func_001487E8
mov r0,r0
push {r3,r4,r5,r6,r7,lr}
mov r5,r0
mov r6,r1
mov r7,r2
mov r4,r3
bl func_00164F74
mov r3,r7
mov r2,r6
mov r1,r5
str r4,[sp]
bl func_00164EE4
pop {r3,r4,r5,r6,r7,pc}
END func_001487E8

BEGIN func_00148E3C
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
bl func_001260B4
mov r1,r5
mov r0,r4
bl func_0016516C
mov r4,r0
bl func_00126414
mov r0,r4
pop {r4,r5,r6,pc}
END func_00148E3C

BEGIN func_001F4204
push {lr}
sub sp,sp,#12
bl func_001240C4
str r0,[sp]
add r1,sp,#4
mov r0,sp
bl func_001F70F4
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrsb r0,[sp,#4]
add sp,sp,#12
pop {pc}
END func_001F4204

BEGIN func_001F4238
mov r0,r0
push {lr}
sub sp,sp,#12
bl func_001240C4
str r0,[sp]
add r1,sp,#4
mov r0,sp
bl func_001F712C
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrsb r0,[sp,#4]
add sp,sp,#12
pop {pc}
END func_001F4238
