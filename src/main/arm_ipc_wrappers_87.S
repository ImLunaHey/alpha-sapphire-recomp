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

.global func_00302108
.global func_001003E8
.global func_00184990
.global func_001003CC
.global func_00186EB8
.global func_0018C238
.global func_00186EC4
.global func_0018C2D4
.global service_flag_apply_secondary_87
.global func_0017E4D8
.global arm_duplicate_templates_19_byte_window_state
.global ipc_controller_selector_offset_77

BEGIN func_0017F4A4
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
ldr r0,[r0,#4]
ldr r1,[r1,#4]
cmp r0,r1
beq .Lreturn_0017F4A4
cmp r0,#0
subsne r0,r0,#4
beq .Lrelease_done_0017F4A4
ldr r1,[r0,#-8]!
cmp r1,#0
beq .Lmissing_release_0017F4A4
blx r1
b .Lrelease_done_0017F4A4
.Lmissing_release_0017F4A4:
nop
bl func_00302108
.Lrelease_done_0017F4A4:
ldr r6,[r5,#4]
cmp r6,#0
moveq r0,#0
streq r0,[r4,#4]
beq .Lreturn_0017F4A4
mov r0,r6
blx func_001003E8
add r5,r0,#1
mov r0,#4
add r0,r0,r5,lsl #1
bl func_00184990
mov r1,r0
add r0,r0,#4
str r5,[r1]
mov r1,r6
str r0,[r4,#4]
blx func_001003CC
.Lreturn_0017F4A4:
mov r0,r4
pop {r4,r5,r6,pc}
END func_0017F4A4

BEGIN func_0017FB04
push {r4,r5,r6,r7,lr}
mov r5,r0
sub sp,sp,#20
ldrb r0,[r0,#12]
cmp r0,#0
beq .Lreturn_0017FB04
ldrsb r0,[r5,#13]
mov r4,r5
cmp r0,#0
cmpne r0,#1
bne .Lclear_0017FB04
cmp r0,#0
cmpne r0,#1
mov r6,#0
bne .Lfinalize_0017FB04
ldr r0,[r4]
cmp r0,#0
ldrne r0,[r4,#8]
cmpne r0,#0
beq .Lfinalize_0017FB04
mov r0,#1
strh r6,[sp,#2]
strh r0,[sp]
ldrsb r7,[r4,#13]
bl func_00186EB8
mov r2,sp
mov r1,r7
bl func_0018C238
bics r0,r6,r0
strbeq r6,[r4,#14]
ldrb r0,[r4,#14]
cmp r0,#0
bne .Lfinalize_0017FB04
ldr r0,.Lwindow_state_0017FB04
ldrb r1,[r0,#25]
strb r1,[r4,#15]
.Lfinalize_0017FB04:
ldrsb r6,[r4,#13]
bl func_00186EB8
mov r2,r6
mov r1,#0
bl func_00186EC4
mov r0,#255
strb r0,[r4,#13]
.Lclear_0017FB04:
mov r0,#0
str r0,[r5]
str r0,[r5,#4]
str r0,[r5,#8]
strb r0,[r5,#12]
.Lreturn_0017FB04:
add sp,sp,#20
pop {r4,r5,r6,r7,pc}
END func_0017FB04
.Lwindow_state_0017FB04:
.word arm_duplicate_templates_19_byte_window_state

BEGIN func_0017FBE4
push {r4,r5,r6,r7,lr}
mov r5,r0
sub sp,sp,#52
ldrb r0,[r0,#12]
cmp r0,#0
beq .Lreturn_0017FBE4
ldrsb r0,[r5,#13]
mov r4,r5
cmp r0,#0
cmpne r0,#1
bne .Lclear_0017FBE4
cmp r0,#0
cmpne r0,#1
mov r6,#0
bne .Lfinalize_0017FBE4
ldr r0,[r4]
cmp r0,#0
ldrne r0,[r4,#8]
cmpne r0,#0
beq .Lfinalize_0017FBE4
mov r0,#1
strh r6,[sp,#2]
strh r0,[sp]
ldrsb r7,[r4,#13]
bl func_00186EB8
mov r2,sp
mov r1,r7
bl func_0018C2D4
bics r0,r6,r0
strbeq r6,[r4,#14]
ldrb r0,[r4,#14]
cmp r0,#0
bne .Lfinalize_0017FBE4
ldr r0,.Lwindow_state_0017FBE4
ldrb r1,[r0,#25]
strb r1,[r4,#15]
.Lfinalize_0017FBE4:
ldrsb r6,[r4,#13]
bl func_00186EB8
mov r2,r6
mov r1,#1
bl func_00186EC4
mov r0,#255
strb r0,[r4,#13]
.Lclear_0017FBE4:
mov r0,#0
str r0,[r5]
str r0,[r5,#4]
str r0,[r5,#8]
strb r0,[r5,#12]
.Lreturn_0017FBE4:
add sp,sp,#52
pop {r4,r5,r6,r7,pc}
END func_0017FBE4
.Lwindow_state_0017FBE4:
.word arm_duplicate_templates_19_byte_window_state

BEGIN func_0017FEEC
cmp r1,#0
ldrb r1,[r0,#7]
orrne r1,r1,#2
biceq r1,r1,#2
strb r1,[r0,#7]
ldr r0,[r0,#104]
and r1,r1,#255
b service_flag_apply_secondary_87
END func_0017FEEC

BEGIN func_0017FFB8
push {r4,r5,r6,lr}
mov r5,r0
mov r6,r1
mov r4,r2
bl func_0017E4D8
cmp r0,#0
beq .Lreturn_0017FFB8
ldr r0,.Lselector_offset_0017FFB8
mov r3,#4
ldrh r0,[r0,r5]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r5,r0,lsl #5
add r0,r0,r6,lsl #2
add r0,r0,#4096
ldr r12,[r0,#176]
sub r0,r4,#2
add r2,r12,#4
add r1,r12,#2
.Lcopy_first_0017FFB8:
ldrh r14,[r0,#2]
subs r3,r3,#1
strh r14,[r1,#2]
ldrh r14,[r0,#4]!
strh r14,[r1,#4]!
bne .Lcopy_first_0017FFB8
add r0,r4,#14
add r1,r2,#14
mov r3,#4
.Lcopy_second_0017FFB8:
ldrh r14,[r0,#2]
subs r3,r3,#1
strh r14,[r1,#2]
ldrh r14,[r0,#4]!
strh r14,[r1,#4]!
bne .Lcopy_second_0017FFB8
add r1,r2,#30
add r0,r4,#30
mov r2,#4
.Lcopy_third_0017FFB8:
ldrh r3,[r0,#2]
subs r2,r2,#1
strh r3,[r1,#2]
ldrh r3,[r0,#4]!
strh r3,[r1,#4]!
bne .Lcopy_third_0017FFB8
ldr r0,[r12]
orr r0,r0,#234881024
str r0,[r12]
mov r0,#1
.Lreturn_0017FFB8:
pop {r4,r5,r6,pc}
END func_0017FFB8
.Lselector_offset_0017FFB8:
.word ipc_controller_selector_offset_77
