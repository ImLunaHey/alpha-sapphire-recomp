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

.global func_001603A0

BEGIN func_0010E86C
push {r4,lr}
mov r4,r0
ldrb r0,[r0]
cmp r0,#0
beq .Lreturn_0010E86C
svc #0x28
mov r3,#0
str r3,[r4,#20]
strd r0,[r4,#24]
add r4,r4,#8
stm r4,{r0,r1,r3}
.Lreturn_0010E86C:
pop {r4,pc}
END func_0010E86C

BEGIN func_001E70E0
push {r4,lr}
mov r4,r0
mov r0,#0
mov ip,#1
strb ip,[r4]
add ip,r4,#8
mov r1,r0
mov r2,r0
mov r3,r0
stm ip,{r0,r1,r2,r3}
svc #0x28
strd r0,[r4,#24]
pop {r4,pc}
END func_001E70E0

BEGIN func_001FBDEC
push {r4,r5,r6,lr}
ldr r1,[r0,#4]
ldr r5,[r0,#12]
cmp r1,#0
beq .Lreturn_saved_001FBDEC
mov r4,#0
add r6,r0,#4
str r4,[r0,#12]
mov r0,r1
svc #0x23
str r4,[r6]
.Lreturn_saved_001FBDEC:
mov r0,r5
pop {r4,r5,r6,pc}
END func_001FBDEC

BEGIN func_002BDCA4
push {r4,lr}
mov r4,r0
strb r1,[r0,#4]
svc #0x28
add r4,r4,#0x158
stm r4,{r0,r1}
pop {r4,pc}
END func_002BDCA4

BEGIN func_002C2B9C
push {r4,lr}
mov r4,r0
svc #0x28
strd r0,[r4]
pop {r4,pc}
END func_002C2B9C

BEGIN func_003BAF34
push {r4,lr}
ldr r0,[r0,#16]
svc #0x18
lsrs r1,r0,#31
beq .Lreturn_003BAF34
pop {r4,lr}
b func_001603A0
.Lreturn_003BAF34:
pop {r4,pc}
END func_003BAF34

BEGIN func_003BAFD4
mvn r2,#0
push {r4,lr}
ldr r0,[r0,#16]
mov r3,r2
svc #0x24
lsrs r1,r0,#31
beq .Lreturn_003BAFD4
pop {r4,lr}
b func_001603A0
.Lreturn_003BAFD4:
pop {r4,pc}
END func_003BAFD4

BEGIN func_003BAFFC
push {r4,lr}
ldr r0,[r0,#16]
svc #0x14
lsrs r1,r0,#31
beq .Lreturn_003BAFFC
pop {r4,lr}
b func_001603A0
.Lreturn_003BAFFC:
pop {r4,pc}
END func_003BAFFC

BEGIN func_003BCEB0
push {r4,lr}
mov r4,r0
svc #0x28
strd r0,[r4]
mov r0,r4
pop {r4,pc}
END func_003BCEB0
