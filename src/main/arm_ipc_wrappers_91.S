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

.global func_0017A8A8
.global func_00188308
.global func_00188324
.global func_00182C60
.global func_00187DEC
.global service_index_secondary_91
.global func_001867D0
.global func_001868EC
.global func_00186860
.global func_00186A54
.global service_peer_secondary_91
.global func_00186AAC
.global service_zero_scalar_51
.global ipc_unit_scalar_54
.global service_stride_reciprocal_91

BEGIN func_00180968
push {r4,r5,r6,lr}
mov r5,r0
mov r4,r1
add r0,r0,#4
add r1,r1,#428
bl func_0017A8A8
cmp r4,#0
beq .Lreturn_00180968
mov r0,r4
bl func_00188308
mov r1,r4
mov r0,r5
pop {r4,r5,r6,lr}
b func_00188324
.Lreturn_00180968:
pop {r4,r5,r6,pc}
END func_00180968

BEGIN func_001809A4
push {r4,lr}
cmp r2,#0
vpush {d8}
add r4,r0,r1,lsl #4
vldr s16,.Lzero_001809A4
beq .Lnull_001809A4
ldr r0,.Lreciprocal_001809A4
add r1,r2,#4
vmov.f32 s0,s16
umull r1,r0,r0,r1
lsr r1,r0,#2
add r0,r4,#20
bl func_00182C60
.Lreturn_001809A4:
vpop {d8}
pop {r4,pc}
.Lnull_001809A4:
nop
bl func_00187DEC
add r0,r4,#20
ldrd r0,[r0,#8]
cmp r1,r0
blt .Lreturn_001809A4
vmov.f32 s0,s16
add r0,r4,#20
mov r1,#0
bl func_00182C60
vpop {d8}
pop {r4,pc}
END func_001809A4
.Lzero_001809A4:
.word service_zero_scalar_51
.Lreciprocal_001809A4:
.word service_stride_reciprocal_91

BEGIN func_00180A18
push {r4,r5,r6,r7,r8,lr}
mov r6,r1
mov ip,r0
add r5,r0,r6,lsl #4
vpush {d8}
mov r7,r2
ldrb r0,[r5,#660]
mov r8,r3
add r4,r5,#656
cmp r0,#0
movne r0,#0
bne .Lreturn_00180A18
add r0,r5,#20
ldrd r0,[r0,#8]
cmp r1,r0
bge .Lready_00180A18
mov r1,r6
mov r0,ip
bl func_00187DEC
.Lready_00180A18:
vldr s16,.Lunit_00180A18
add r0,r5,#20
mov r1,#0
vmov.f32 s0,s16
bl func_00182C60
vmov.f32 s0,s16
sxtb r0,r6
mov r5,r0
bl service_index_secondary_91
mov r1,r5
mov r0,r7
bl func_001867D0
cmp r0,#0
nop
beq .Lreturn_00180A18
mov r1,r8
mov r0,r7
bl func_001868EC
cmp r0,#0
nop
beq .Lreturn_00180A18
mov r1,#1
mov r0,r7
bl func_00186860
cmp r0,#0
nop
beq .Lreturn_00180A18
mov r0,#1
str r7,[r4]
strb r0,[r4,#4]
.Lreturn_00180A18:
vpop {d8}
pop {r4,r5,r6,r7,r8,pc}
END func_00180A18
.Lunit_00180A18:
.word ipc_unit_scalar_54

BEGIN func_00180AE8
push {r4,r5,r6,r7,r8,lr}
mov r6,r1
mov ip,r0
add r5,r0,r6,lsl #4
vpush {d8}
mov r7,r2
ldrb r0,[r5,#668]
mov r8,r3
add r4,r5,#664
cmp r0,#0
movne r0,#0
bne .Lreturn_00180AE8
add r0,r5,#20
ldrd r0,[r0,#8]
cmp r1,r0
bge .Lready_00180AE8
mov r1,r6
mov r0,ip
bl func_00187DEC
.Lready_00180AE8:
vldr s16,.Lunit_00180AE8
add r0,r5,#20
mov r1,#0
vmov.f32 s0,s16
bl func_00182C60
vmov.f32 s0,s16
sxtb r0,r6
mov r5,r0
bl service_index_secondary_91
mov r1,r5
mov r0,r7
bl func_00186A54
cmp r0,#0
nop
beq .Lreturn_00180AE8
mov r1,r8
mov r0,r7
bl service_peer_secondary_91
cmp r0,#0
nop
beq .Lreturn_00180AE8
mov r1,#1
mov r0,r7
bl func_00186AAC
cmp r0,#0
nop
beq .Lreturn_00180AE8
mov r0,#1
str r7,[r4]
strb r0,[r4,#4]
.Lreturn_00180AE8:
vpop {d8}
pop {r4,r5,r6,r7,r8,pc}
END func_00180AE8
.Lunit_00180AE8:
.word ipc_unit_scalar_54
