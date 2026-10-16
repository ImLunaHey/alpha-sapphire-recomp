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

.global func_0017E4D8,func_001950F8
.global ipc_controller_selector_offset_77
.global ipc_controller_scale_magic_80

BEGIN func_00194854
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
bl func_0017E4D8
cmp r0,#0
beq .Lloc_19489C
ldr r0,.Lselector_offset_00194854
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r5,lsl #2
add r0,r0,#4096
ldr r0,[r0,#176]
ldr r1,[r0]
orr r1,r1,#16
str r1,[r0]
mov r0,#1
.Lloc_19489C:
pop {r4,r5,r6,pc}
END func_00194854
.Lselector_offset_00194854:
.word ipc_controller_selector_offset_77

BEGIN func_001948A4
push {r4,r5,r6,r7,r8,r9,sl,lr}
mov r6,r0
mov r8,r1
mov r5,r2
mov r7,r3
bl func_0017E4D8
cmp r0,#0
beq .Lloc_1949CC
ldm r5,{r2,r4}
ldrh r1,[r5,#18]
add r0,r2,#-335544320
cmp r0,#134217728
bcs .Lloc_1949C8
ldr r0,.Lselector_offset_001948A4
mov ip,r2
ldrh r0,[r0,r6]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r6,r0,lsl #5
add r0,r0,r8,lsl #2
add r0,r0,#4096
ldr r6,[r0,#176]
ldr r0,[r6,#180]
uxth r0,r0
tst r0,#12
bne .Lloc_194920
and r3,r0,#3
cmp r3,#1
addeq ip,r2,r4
cmp r3,#2
addeq ip,ip,r4,lsl #1
.Lloc_194920:
lsl r3,r0,#28
mov r8,#1
cmp r8,r3,lsr #30
bne .Lloc_194944
and r9,r0,#3
cmp r9,#1
addeq ip,ip,r4,lsl #1
cmp r9,#2
addeq ip,ip,r4,lsl #2
.Lloc_194944:
mov r9,#2
cmp r9,r3,lsr #30
andeq r0,r0,#3
cmpeq r0,#1
bne .Lloc_194974
ldr r9,.Lscale_magic_001948A4
add r0,r4,#13
mov r3,#0
smlal r3,r0,r9,r0
asr r3,r0,#3
sub r0,r3,r0,asr #31
add ip,ip,r0,lsl #3
.Lloc_194974:
cmp ip,#335544320
bls .Lloc_1949C8
cmp ip,#469762048
bhi .Lloc_1949C8
add r0,r2,#201326592
add r3,r7,r7,lsl #2
add r9,r6,#4
ror r2,r4,#16
add r4,r9,r3,lsl #2
add r3,r4,#72
ror r0,r0,#16
strh r1,[r4,#88]
stm r3,{r0,r2}
ldr r1,[r5,#8]
cmp r1,#0
beq .Lloc_1949D0
add r0,r4,#80
bl func_001950F8
strb r8,[r4,#86]
nop
b .Lloc_1949DC
.Lloc_1949C8:
mov r0,#0
.Lloc_1949CC:
pop {r4,r5,r6,r7,r8,r9,sl,pc}
.Lloc_1949D0:
ldrh r0,[r4,#86]
bic r0,r0,#255
strh r0,[r4,#86]
.Lloc_1949DC:
ldrh r0,[r9,#70]
orr r0,r0,r8,lsl r7
strh r0,[r9,#70]
ldrb r0,[r5,#16]
strb r0,[r4,#87]
ldr r0,[r6]
orr r0,r0,#524288
str r0,[r6]
mov r0,#1
pop {r4,r5,r6,r7,r8,r9,sl,pc}
END func_001948A4
.Lselector_offset_001948A4:
.word ipc_controller_selector_offset_77
.Lscale_magic_001948A4:
.word ipc_controller_scale_magic_80

BEGIN func_00194A0C
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
mov r6,r2
bl func_0017E4D8
cmp r0,#0
beq .Lloc_194AAC
add r1,r4,#4864
ldrh r2,[r6,#18]
ldrh r0,[r1,#26]
ldrh r1,[r1,#28]
and r0,r0,#1
add r1,r1,r1,lsl #1
add r0,r0,r0,lsl #1
add r1,r4,r1,lsl #5
add r1,r1,r5,lsl #2
add r1,r1,#4096
add r0,r4,r0,lsl #5
ldr r1,[r1,#368]
add r0,r0,r5,lsl #2
add r0,r0,#4096
ldrh r1,[r1,#8]
ldr r0,[r0,#176]
cmp r1,r2
bne .Lloc_194AA8
strh r2,[r0,#190]
ldrsb ip,[r6,#16]
ldrh r2,[r0,#188]
mov r3,#2
and r3,r3,ip,lsl #1
bic r2,r2,#2
orr r2,r2,r3
strh r2,[r0,#188]
ldr r2,[r6,#4]
ror r2,r2,#16
str r2,[r0,#176]
ldr r1,[r0]
orr r1,r1,#8
str r1,[r0]
.Lloc_194AA8:
mov r0,#1
.Lloc_194AAC:
pop {r4,r5,r6,pc}
END func_00194A0C

BEGIN func_00194AB0
push {r0,r1,r2,r3,r4,r5,r6,r7,r8,r9,sl,lr}
mov r4,r2
mov r6,r0
mov r7,r1
bl func_0017E4D8
cmp r0,#0
beq .Lloc_194C34
ldr r5,[r4]
ldr r2,[r4,#4]
ldrh r8,[r4,#18]
add r0,r5,#-335544320
cmp r0,#134217728
bcs .Lloc_194C30
ldr r0,[sp,#12]
mov r3,r5
uxth ip,r0
tst ip,#12
bne .Lloc_194B0C
and r0,ip,#3
cmp r0,#1
addeq r3,r5,r2
cmp r0,#2
addeq r3,r3,r2,lsl #1
.Lloc_194B0C:
lsl r0,ip,#28
mov r1,#1
cmp r1,r0,lsr #30
bne .Lloc_194B30
and r1,ip,#3
cmp r1,#1
addeq r3,r3,r2,lsl #1
cmp r1,#2
addeq r3,r3,r2,lsl #2
.Lloc_194B30:
mov r1,#2
cmp r1,r0,lsr #30
andeq r0,ip,#3
cmpeq r0,#1
mov lr,#0
bne .Lloc_194B64
ldr r9,.Lscale_magic_00194AB0
add r0,r2,#13
mov ip,lr
smlal ip,r0,r9,r0
asr ip,r0,#3
sub r0,ip,r0,asr #31
add r3,r3,r0,lsl #3
.Lloc_194B64:
cmp r3,#335544320
bls .Lloc_194C30
cmp r3,#469762048
bhi .Lloc_194C30
ldr r3,.Lselector_offset_00194AB0
add r0,r5,#201326592
ror r2,r2,#16
ldrh r3,[r3,r6]
and r3,r3,#1
add r3,r3,r3,lsl #1
add r3,r6,r3,lsl #5
add r3,r3,r7,lsl #2
add r3,r3,#4096
ldr r5,[r3,#176]
ror r3,r0,#16
add r0,r5,#172
strh r8,[r5,#190]
str r2,[r5,#176]
str r3,[r5,#172]
ldrh r2,[sp,#12]
strh r2,[r5,#180]
ldrsb r3,[r4,#16]
ldrh r2,[r5,#188]
and r3,r1,r3,lsl #1
bic r2,r2,#2
orr r2,r2,r3
strh r2,[r5,#188]
ldrh r2,[sp,#12]
lsl r2,r2,#28
cmp r1,r2,lsr #30
bne .Lloc_194C48
ldr r1,[r4,#8]
cmp r1,#0
beq .Lloc_194C3C
sub r1,r1,#2
add r3,r0,#10
ldrh r2,[r1,#2]!
mov ip,#1
strh r2,[r0,#10]
.Lloc_194C00:
ldrh r2,[r1,#2]
subs ip,ip,#1
strh r2,[r3,#2]
ldrh r2,[r1,#4]!
strh r2,[r3,#4]!
bne .Lloc_194C00
ldr r1,[r4,#8]
cmp r1,#0
ldrhne r1,[r0,#16]
orrne r1,r1,#1
bne .Lloc_194C44
b .Lloc_194C3C
.Lloc_194C30:
mov r0,#0
.Lloc_194C34:
add sp,sp,#16
pop {r4,r5,r6,r7,r8,r9,sl,pc}
.Lloc_194C3C:
ldrh r1,[r0,#16]
bic r1,r1,#1
.Lloc_194C44:
strh r1,[r0,#16]
.Lloc_194C48:
ldr r0,[r5]
orr r0,r0,#1073741824
orr r0,r0,#2097152
str r0,[r5],#164
mov r0,#1
str lr,[r5]
add sp,sp,#16
pop {r4,r5,r6,r7,r8,r9,sl,pc}
END func_00194AB0
.Lscale_magic_00194AB0:
.word ipc_controller_scale_magic_80
.Lselector_offset_00194AB0:
.word ipc_controller_selector_offset_77
