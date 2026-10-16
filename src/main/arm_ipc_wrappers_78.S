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

.global func_00192C4C,func_001602B8,func_00160380,func_00192BF8
.global func_00188184,func_001935F4,service_record_enable_secondary_78
.global ipc_shared_control_owner_72

BEGIN func_00190A7C
push {r4,lr}
mov r4,r0
ldrh r0,[r0,#108]
tst r0,#32768
beq .Lnotify_done_00190A7C
ldr r0,[r4]
ldrsh r2,[r4,#4]
and r1,r0,#255
ldr r0,.Lshared_owner_00190A7C
bl func_00192C4C
ldrh r0,[r4,#108]
bic r0,r0,#32768
strh r0,[r4,#108]
.Lnotify_done_00190A7C:
pop {r4,pc}
END func_00190A7C
.Lshared_owner_00190A7C:
.word ipc_shared_control_owner_72

BEGIN func_00190AB8
add r0,r0,r1,lsl #2
add r0,r0,#5120
add r0,r0,#476
mov r1,r2
ldr r0,[r0]
ldr r0,[r0,#104]
mov r0,r0
push {r4,r5,r6,r7,r8,r9,lr}
mov r4,r0
mov r6,r1
sub sp,sp,#20
ldrsh r0,[r1,#2]
ldrsh r1,[r4,#4]
cmp r0,r1
bne .Lpacket_done_00190AB8
ldr r0,[r6,#4]
ror r0,r0,#16
str r0,[r4,#8]
ldrh r0,[r6]
tst r0,#65280
beq .Lpacket_done_00190AB8
add r5,r4,#112
ldrh r7,[r6,#8]
ldrh r8,[r6,#10]
mov r0,r5
bl func_001602B8
ldr r2,[r4,#48]
cmp r2,#0
beq .Lempty_pending_00190AB8
ldrh r3,[r4,#52]
add r0,r4,#52
mov ip,sp
cmp r3,#0
mov r1,#0
beq .Lfinish_pending_00190AB8
.Lscan_pending_00190AB8:
ldrh r3,[r2,#18]
cmp r3,r7
bne .Lunlink_pending_00190AB8
mov r3,#2
strb r3,[r2,#17]
b .Lfinish_pending_00190AB8
.Lempty_pending_00190AB8:
mov r0,r5
bl func_00160380
nop
nop
b .Lpacket_done_00190AB8
.Lunlink_pending_00190AB8:
ldrh r3,[r0]
cmp r7,#0
sub r3,r3,#1
sxth r9,r3
strh r9,[r0]
str r2,[ip,r1,lsl #2]
add r1,r1,#1
beq .Lmatch_terminal_00190AB8
.Ladvance_default_00190AB8:
mov r3,#0
.Ladvance_pending_00190AB8:
ldr r2,[r2,#20]
cmp r3,#0
bne .Lfinish_pending_00190AB8
b .Lcheck_pending_count_00190AB8
.Lmatch_terminal_00190AB8:
ldrh r3,[r2,#18]
cmp r3,r8
cmpne r8,#0
moveq r3,#1
beq .Ladvance_pending_00190AB8
b .Ladvance_default_00190AB8
.Lcheck_pending_count_00190AB8:
cmp r9,#0
bne .Lscan_pending_00190AB8
.Lfinish_pending_00190AB8:
cmp r7,#0
mov r3,#0
strheq r3,[r0]
mcr p15,0,r3,c7,c10,5
cmp r1,#0
mov r0,#0
movgt r3,#3
ble .Lpublish_pending_00190AB8
.Lmark_pending_00190AB8:
ldr r7,[ip,r0,lsl #2]
add r0,r0,#1
cmp r1,r0
strb r3,[r7,#17]
bgt .Lmark_pending_00190AB8
.Lpublish_pending_00190AB8:
mov r0,r5
str r2,[r4,#48]
bl func_00160380
.Lpacket_done_00190AB8:
ldrh r0,[r6]
and r0,r0,#255
cmp r0,#1
movne r0,#0
strb r0,[r4,#12]
add sp,sp,#20
pop {r4,r5,r6,r7,r8,r9,pc}
END func_00190AB8

BEGIN func_00190CD8
push {r4,lr}
mov r4,r0
ldr r0,[r0]
and r1,r0,#255
ldr r0,.Lshared_owner_00190CD8
bl func_00192BF8
mov r0,#1
strb r0,[r4,#12]
pop {r4,pc}
END func_00190CD8
.Lshared_owner_00190CD8:
.word ipc_shared_control_owner_72

BEGIN func_00190FCC
push {r4,r5,r6,lr}
mov r5,r0
str r1,[r0,#64]
bl func_00188184
mov r1,r5
bl func_001935F4
ldr r0,[r5,#64]
cmp r0,#1
bne .Lconfigure_done_00190FCC
ldr r0,[r5,#8]
mov r4,#0
cmp r0,#0
ble .Lconfigure_done_00190FCC
.Lconfigure_each_00190FCC:
ldr r0,[r5,r4,lsl #2]
cmp r0,#0
movne r1,#1
blne service_record_enable_secondary_78
ldr r0,[r5,#8]
add r4,r4,#1
cmp r0,r4
bgt .Lconfigure_each_00190FCC
.Lconfigure_done_00190FCC:
pop {r4,r5,r6,pc}
END func_00190FCC

BEGIN func_00191080
vstr s0,[r0,#332]
strb r1,[r0,#310]
bx lr
END func_00191080
