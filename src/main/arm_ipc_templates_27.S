.syntax unified
.arch armv6k
.arm

.global ipc_handle_slot_delta
.global ipc_handle_slot_nu
.global ipc_handle_slot_beta
.global ipc_handle_slot_lambda
.global ipc_command_func_001F7630
.global ipc_command_func_001F7800
.global ipc_handle_slot_epsilon
.global ipc_handle_slot_zeta
.global ipc_handle_slot_xi
.global ipc_handle_slot_gamma

.macro B f
 .section .text.\f,"ax",%progbits
 .balign 4
 .arm
 .global \f
 .type \f,%function
\f:
.endm

.macro E f
 .size \f,.-\f
.endm

.macro EP f,p
 .size \f,.-\f
.Lpool_\f:
 .word \p
.endm

B func_0010F828
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(2 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_0010F828
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_0010F828
ldr r0,[r4,#12]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_0010F828:
pop {r4,r5,r6,pc}
EP func_0010F828,ipc_handle_slot_delta

B func_00118C94
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(2 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_00118C94
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_00118C94
ldrb r0,[r4,#8]
strb r0,[r5]
ldr r0,[r4,#4]
.Lret_00118C94:
pop {r4,r5,r6,pc}
EP func_00118C94,ipc_handle_slot_nu

B func_00119F20
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(11 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_00119F20
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_00119F20
ldr r0,[r4,#8]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_00119F20:
pop {r4,r5,r6,pc}
EP func_00119F20,ipc_handle_slot_delta

B func_0012696C
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(60 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_0012696C
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_0012696C
ldrb r0,[r4,#8]
strb r0,[r5]
ldr r0,[r4,#4]
.Lret_0012696C:
pop {r4,r5,r6,pc}
EP func_0012696C,ipc_handle_slot_beta

B func_001269E4
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(59 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_001269E4
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001269E4
ldrb r0,[r4,#8]
strb r0,[r5]
ldr r0,[r4,#4]
.Lret_001269E4:
pop {r4,r5,r6,pc}
EP func_001269E4,ipc_handle_slot_beta

B func_00174848
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(1 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_00174848
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_00174848
ldrb r0,[r4,#8]
strb r0,[r5]
ldr r0,[r4,#4]
.Lret_00174848:
pop {r4,r5,r6,pc}
EP func_00174848,ipc_handle_slot_lambda

B func_001F7630
push {r4,r5,r6,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001F7630
str r1,[r4,#128]!
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001F7630
ldr r0,[r4,#12]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_001F7630:
pop {r4,r5,r6,pc}
EP func_001F7630,ipc_command_func_001F7630

B func_001F7798
push {r4,r5,r6,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
ldr r1,.Lpool_func_001F7798
str r1,[r4,#128]!
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001F7798
ldrd r0,[r4,#8]
strd r0,[r5]
ldr r0,[r4,#4]
.Lret_001F7798:
pop {r4,r5,r6,pc}
EP func_001F7798,ipc_command_func_001F7800

B func_001FB40C
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(11 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_001FB40C
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001FB40C
ldr r0,[r4,#12]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_001FB40C:
pop {r4,r5,r6,pc}
EP func_001FB40C,ipc_handle_slot_epsilon

B func_001FB514
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(10 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_001FB514
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001FB514
ldr r0,[r4,#12]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_001FB514:
pop {r4,r5,r6,pc}
EP func_001FB514,ipc_handle_slot_epsilon

B func_001FB670
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(12 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_001FB670
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_001FB670
ldr r0,[r4,#12]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_001FB670:
pop {r4,r5,r6,pc}
EP func_001FB670,ipc_handle_slot_epsilon

B func_00202CF8
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(6 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_00202CF8
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_00202CF8
ldrb r0,[r4,#8]
strb r0,[r5]
ldr r0,[r4,#4]
.Lret_00202CF8:
pop {r4,r5,r6,pc}
EP func_00202CF8,ipc_handle_slot_zeta

B func_002030EC
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(3 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_002030EC
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002030EC
ldr r0,[r4,#8]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_002030EC:
pop {r4,r5,r6,pc}
EP func_002030EC,ipc_handle_slot_xi

B func_002C5514
push {r4,r5,r6,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
mov r1,#(26 << 16)
str r1,[r4,#128]!
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002C5514
ldrb r0,[r4,#8]
strb r0,[r5]
ldr r0,[r4,#4]
.Lret_002C5514:
pop {r4,r5,r6,pc}
E func_002C5514

B func_002C5A20
push {r4,r5,r6,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
mov r1,#(35 << 16)
str r1,[r4,#128]!
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002C5A20
ldrh r0,[r4,#8]
strh r0,[r5]
ldr r0,[r4,#4]
.Lret_002C5A20:
pop {r4,r5,r6,pc}
E func_002C5A20

B func_002C6480
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(40 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_002C6480
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002C6480
ldrb r0,[r4,#8]
strb r0,[r5]
ldr r0,[r4,#4]
.Lret_002C6480:
pop {r4,r5,r6,pc}
EP func_002C6480,ipc_handle_slot_gamma

B func_002C6534
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(15 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_002C6534
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002C6534
ldr r0,[r4,#12]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_002C6534:
pop {r4,r5,r6,pc}
EP func_002C6534,ipc_handle_slot_gamma

B func_002C6570
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(25 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_002C6570
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002C6570
ldrb r0,[r4,#8]
strb r0,[r5]
ldr r0,[r4,#4]
.Lret_002C6570:
pop {r4,r5,r6,pc}
EP func_002C6570,ipc_handle_slot_gamma

B func_002C65AC
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(20 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_002C65AC
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002C65AC
ldrb r0,[r4,#8]
strb r0,[r5]
ldr r0,[r4,#4]
.Lret_002C65AC:
pop {r4,r5,r6,pc}
EP func_002C65AC,ipc_handle_slot_gamma

B func_002DED74
push {r4,r5,r6,lr}
mov r5,r0
mrc p15,0,r4,c13,c0,3
mov r0,#(54 << 16)
str r0,[r4,#128]!
ldr r0,.Lpool_func_002DED74
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002DED74
ldrb r0,[r4,#8]
strb r0,[r5]
ldr r0,[r4,#4]
.Lret_002DED74:
pop {r4,r5,r6,pc}
EP func_002DED74,ipc_handle_slot_beta

B func_002E24B4
push {r4,r5,r6,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
mov r1,#(6 << 16)
str r1,[r4,#128]!
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002E24B4
ldr r0,[r4,#8]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_002E24B4:
pop {r4,r5,r6,pc}
E func_002E24B4

B func_002E4424
push {r4,r5,r6,lr}
mov r5,r1
mrc p15,0,r4,c13,c0,3
mov r1,#(22 << 16)
str r1,[r4,#128]!
ldr r0,[r0]
svc #50
ands r1,r0,#0x80000000
bmi .Lret_002E4424
ldr r0,[r4,#8]
str r0,[r5]
ldr r0,[r4,#4]
.Lret_002E4424:
pop {r4,r5,r6,pc}
E func_002E4424
