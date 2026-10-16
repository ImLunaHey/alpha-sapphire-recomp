.syntax unified
.arch armv6k
.fpu vfpv2
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

.global func_00184990,func_0010046E,func_00188A8C
.global ipc_empty_text_63,ipc_shared_owner_63

BEGIN func_0017E644
cmp r1,#0
ldreq r0,[r0]
ldrhne r0,[r0,#10]
addne r1,r1,#4
ldrne r0,[r0,r1]
bx lr
END func_0017E644

BEGIN func_0017F188
push {r3,r4,r5,r6,r7,lr}
mov r4,r0
mov r7,#0
str r7,[r0]
str r7,[r0,#16]
str r7,[r0,#20]
strb r7,[r0,#24]
strb r0,[r0,#25]
str r7,[r0,#12]
str r7,[r0,#8]
str r7,[r0,#4]
mov r6,#32
mov r0,#12
bl func_00184990
mov r5,r0
mov r0,#1024
bl func_00184990
str r0,[r5,#8]
ldr r0,[r4]
add r1,r4,#8
stm r5,{r0,r6}
str r5,[r4]
ldr r0,[r5,#8]
add r2,r0,#1024
stm r1,{r0,r2}
ldr r0,[r4,#8]
add r2,r0,#32
str r2,[r4,#8]
str r7,[r0,#8]
str r7,[r0,#12]
strb r7,[r0]
str r0,[r4,#16]
str r7,[r0,#4]
ldr r0,[r4,#16]
str r0,[r0,#8]
ldr r0,[r4,#16]
str r0,[r0,#12]
mov r0,r4
pop {r3,r4,r5,r6,r7,pc}
END func_0017F188

BEGIN func_0017F224
push {r3,r4,r5,r6,r7,lr}
mov r4,r0
mov r7,#0
str r7,[r0]
str r7,[r0,#16]
str r7,[r0,#20]
strb r7,[r0,#24]
strb r0,[r0,#25]
str r7,[r0,#12]
str r7,[r0,#8]
str r7,[r0,#4]
mov r6,#32
mov r0,#12
bl func_00184990
mov r5,r0
mov r0,#896
bl func_00184990
str r0,[r5,#8]
ldr r0,[r4]
add r1,r4,#8
stm r5,{r0,r6}
str r5,[r4]
ldr r0,[r5,#8]
add r2,r0,#896
stm r1,{r0,r2}
ldr r0,[r4,#8]
add r2,r0,#28
str r2,[r4,#8]
str r7,[r0,#8]
str r7,[r0,#12]
strb r7,[r0]
str r0,[r4,#16]
str r7,[r0,#4]
ldr r0,[r4,#16]
str r0,[r0,#8]
ldr r0,[r4,#16]
str r0,[r0,#12]
mov r0,r4
pop {r3,r4,r5,r6,r7,pc}
END func_0017F224

BEGIN func_0017F2C0
push {r3,r4,r5,r6,r7,lr}
mov r4,r0
mov r7,#0
str r7,[r0]
str r7,[r0,#16]
str r7,[r0,#20]
strb r7,[r0,#24]
strb r0,[r0,#25]
str r7,[r0,#12]
str r7,[r0,#8]
str r7,[r0,#4]
mov r6,#32
mov r0,#12
bl func_00184990
mov r5,r0
mov r0,#768
bl func_00184990
str r0,[r5,#8]
ldr r0,[r4]
add r1,r4,#8
stm r5,{r0,r6}
str r5,[r4]
ldr r0,[r5,#8]
add r2,r0,#768
stm r1,{r0,r2}
ldr r0,[r4,#8]
add r2,r0,#24
str r2,[r4,#8]
str r7,[r0,#8]
str r7,[r0,#12]
strb r7,[r0]
str r0,[r4,#16]
str r7,[r0,#4]
ldr r0,[r4,#16]
str r0,[r0,#8]
ldr r0,[r4,#16]
str r0,[r0,#12]
mov r0,r4
pop {r3,r4,r5,r6,r7,pc}
END func_0017F2C0

BEGIN func_0017F35C
push {r3,r4,r5,r6,r7,lr}
mov r4,r0
mov r7,#0
str r7,[r0]
str r7,[r0,#16]
str r7,[r0,#20]
strb r7,[r0,#24]
strb r0,[r0,#25]
str r7,[r0,#12]
str r7,[r0,#8]
str r7,[r0,#4]
mov r6,#32
mov r0,#12
bl func_00184990
mov r5,r0
mov r0,#768
bl func_00184990
str r0,[r5,#8]
ldr r0,[r4]
add r1,r4,#8
stm r5,{r0,r6}
str r5,[r4]
ldr r0,[r5,#8]
add r2,r0,#768
stm r1,{r0,r2}
ldr r0,[r4,#8]
add r2,r0,#24
str r2,[r4,#8]
str r7,[r0,#8]
str r7,[r0,#12]
strb r7,[r0]
str r0,[r4,#16]
str r7,[r0,#4]
ldr r0,[r4,#16]
str r0,[r0,#8]
ldr r0,[r4,#16]
str r0,[r0,#12]
mov r0,r4
pop {r3,r4,r5,r6,r7,pc}
END func_0017F35C

BEGIN func_0017F3F8
.Lcompare_63:
cmp r0,r1
push {r4,lr}
beq .Lsuccess_63
cmp r0,#0
beq .Lnull_left_63
cmp r1,#0
beq .Lnull_right_63
blx func_0010046E
cmp r0,#0
movne r0,#0
bne .Lreturn_63
.Lsuccess_63:
mov r0,#1
.Lreturn_63:
pop {r4,pc}
.Lnull_left_63:
ldr r0,.Lempty_text_63
pop {r4,lr}
b .Lcompare_63
.Lnull_right_63:
ldr r1,.Lempty_text_63
pop {r4,lr}
b .Lcompare_63
END func_0017F3F8
.Lempty_text_63:
.word ipc_empty_text_63

BEGIN func_00180E24
vstr s0,[r0,#40]
strb r1,[r0,#44]
bx lr
END func_00180E24

BEGIN func_00180E30
add r0,r0,r1,lsl #2
vstr s0,[r0,#56]
bx lr
END func_00180E30

BEGIN func_001819C0
ldr r2,.Lshared_owner_63_a
push {r4,lr}
ldrd r2,[r2,#32]
bl func_00188A8C
pop {r4,pc}
END func_001819C0
.Lshared_owner_63_a:
.word ipc_shared_owner_63

BEGIN func_00181A5C
ldr r2,.Lshared_owner_63_b
push {r4,lr}
ldrd r2,[r2,#24]
bl func_00188A8C
pop {r4,pc}
END func_00181A5C
.Lshared_owner_63_b:
.word ipc_shared_owner_63

BEGIN func_00181B40
add r0,r0,r1,lsl #1
strh r2,[r0,#208]
bx lr
END func_00181B40

BEGIN func_00181B4C
ldr r2,.Lshared_owner_63_c
push {r4,lr}
ldrd r2,[r2,#64]
bl func_00188A8C
pop {r4,pc}
END func_00181B4C
.Lshared_owner_63_c:
.word ipc_shared_owner_63
