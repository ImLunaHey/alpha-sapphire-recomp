.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro FUNCTION_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
/* BEGIN_FUNCTION \name */
.endm

.macro FUNCTION_END name
/* END_FUNCTION \name */
.size \name,.-\name
.endm

FUNCTION_BEGIN func_004C75A8
ldrb r1,[r0,#28]
cmp r1,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r1,[r0,#29]
cmp r1,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
ldrsb r0,[r0,#10]
bx lr
FUNCTION_END func_004C75A8

FUNCTION_BEGIN func_004C75D0
ldrb r1,[r0,#28]
cmp r1,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r1,[r0,#29]
cmp r1,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
ldrsb r0,[r0,#9]
bx lr
FUNCTION_END func_004C75D0

FUNCTION_BEGIN func_004C7748
ldrb r1,[r0,#28]
cmp r1,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r1,[r0,#29]
cmp r1,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
ldrh r0,[r0]
bx lr
FUNCTION_END func_004C7748

FUNCTION_BEGIN func_004C7770
ldrb r1,[r0,#28]
cmp r1,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r1,[r0,#29]
cmp r1,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
ldrh r0,[r0,#2]
bx lr
FUNCTION_END func_004C7770

FUNCTION_BEGIN func_004C77F4
ldrb r1,[r0,#28]
cmp r1,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r1,[r0,#29]
cmp r1,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
ldrsb r0,[r0,#8]
bx lr
FUNCTION_END func_004C77F4

FUNCTION_BEGIN func_004C781C
ldrb r1,[r0,#28]
cmp r1,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r1,[r0,#29]
cmp r1,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
ldrh r1,[r0]
ldrh r0,[r0,#4]
sub r0,r1,r0
bx lr
FUNCTION_END func_004C781C

FUNCTION_BEGIN func_004C784C
ldrb r1,[r0,#28]
cmp r1,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r1,[r0,#29]
cmp r1,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
ldrh r1,[r0,#2]
ldrh r0,[r0,#6]
sub r0,r1,r0
bx lr
FUNCTION_END func_004C784C

FUNCTION_BEGIN func_004C7CF4
ldrb r2,[r0,#28]
cmp r2,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r2,[r0,#29]
cmp r2,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
ldr r0,[r0,#8]
ands r0,r0,r1
movne r0,#1
bx lr
FUNCTION_END func_004C7CF4

FUNCTION_BEGIN func_004C7D4C
ldrb r2,[r0,#28]
cmp r2,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r2,[r0,#29]
cmp r2,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
ldr r2,[r0,#12]
ldr r0,[r0,#20]
orr r0,r0,r2
ands r0,r0,r1
movne r0,#1
bx lr
FUNCTION_END func_004C7D4C

FUNCTION_BEGIN func_004C7E2C
ldrb r2,[r0,#28]
cmp r2,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r2,[r0,#29]
cmp r2,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
ldr r0,[r0,#12]
ands r0,r0,r1
movne r0,#1
bx lr
FUNCTION_END func_004C7E2C

FUNCTION_BEGIN func_004C7E5C
ldrb r2,[r0,#28]
cmp r2,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r2,[r0,#29]
cmp r2,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
ldr r2,[r0,#16]
str r2,[r1]
ldr r2,[r0,#20]
str r2,[r1,#4]
ldr r0,[r0,#24]
str r0,[r1,#8]
bx lr
FUNCTION_END func_004C7E5C

FUNCTION_BEGIN func_004C80D0
ldrb r2,[r0,#28]
cmp r2,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r2,[r0,#29]
cmp r2,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
cmp r1,#2
addlo r0,r0,r1,lsl #4
ldr r0,[r0,#4]
bx lr
FUNCTION_END func_004C80D0

FUNCTION_BEGIN func_004C8400
ldrb r3,[r0,#28]
cmp r3,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r3,[r0,#29]
cmp r3,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
cmp r2,#2
addlo r0,r0,r2,lsl #4
ldr r0,[r0]
ands r0,r0,r1
movne r0,#1
bx lr
FUNCTION_END func_004C8400

FUNCTION_BEGIN func_004C8438
ldrb r3,[r0,#28]
cmp r3,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r3,[r0,#29]
cmp r3,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
cmp r2,#2
addlo r0,r0,r2,lsl #4
ldr r2,[r0,#4]
ldr r0,[r0,#12]
orr r0,r0,r2
ands r0,r0,r1
movne r0,#1
bx lr
FUNCTION_END func_004C8438

FUNCTION_BEGIN func_004C84B0
ldrb r3,[r0,#28]
cmp r3,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r3,[r0,#29]
cmp r3,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
cmp r2,#2
addlo r0,r0,r2,lsl #4
ldr r0,[r0,#8]
ands r0,r0,r1
movne r0,#1
bx lr
FUNCTION_END func_004C84B0

FUNCTION_BEGIN func_004C84E8
ldrb r3,[r0,#28]
cmp r3,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r3,[r0,#29]
cmp r3,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
cmp r2,#2
addlo r0,r0,r2,lsl #4
ldr r0,[r0,#4]
ands r0,r0,r1
movne r0,#1
bx lr
FUNCTION_END func_004C84E8

FUNCTION_BEGIN func_004C8668
ldr r0,[r0,#376]
cmp r1,#3
mvnhs r0,#0
addlo r0,r0,r1,lsl #2
ldrlo r0,[r0,#40]
bx lr
FUNCTION_END func_004C8668

FUNCTION_BEGIN func_004C8768
ldrh r2,[r0,#4]
cmp r2,r1
bls 1f
ldr r0,[r0]
add r0,r0,r1,lsl #6
ldrb r1,[r0,#4]
cmp r1,#0
bne 2f
1:
mov r0,#0
2:
bx lr
FUNCTION_END func_004C8768

FUNCTION_BEGIN func_004C8DC0
ldr r0,[r0,#4]
ldr r2,[r0,#172]
cmp r2,r1
movls r0,#0
bls 1f
ldr r0,[r0,#168]
add r2,r1,r1,lsl #1
add r1,r2,r1,lsl #3
add r0,r0,r1,lsl #2
ldrsb r0,[r0]
1:
bx lr
FUNCTION_END func_004C8DC0

FUNCTION_BEGIN func_004C8EC0
ldr r0,[r0]
ldr r0,[r0,#16]
ldr r2,[r0,#4]
cmp r2,r1
ldrhi r0,[r0]
addhi r1,r1,r1,lsl #3
movls r0,#0
addhi r0,r0,r1,lsl #3
bx lr
FUNCTION_END func_004C8EC0

FUNCTION_BEGIN func_004C8FB4
ldr r0,[r0,#12]
add r1,r1,r1,lsl #1
ldr r0,[r0,#20]
ldr r0,[r0]
add r0,r0,r1,lsl #2
str r0,[r2,#4]
bx lr
FUNCTION_END func_004C8FB4

FUNCTION_BEGIN func_004C90B8
cmp r1,#0
blt 1f
ldr r0,[r0,#12]
ldr r2,[r0,#16]
cmp r2,r1
bls 1f
ldr r0,[r0,#12]
ldr r0,[r0,r1,lsl #2]
ldr r0,[r0]
bx lr
1:
mov r0,#0
bx lr
FUNCTION_END func_004C90B8
