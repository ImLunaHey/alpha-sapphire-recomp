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

.global func_00118C2C,service_publish_operation_34
.global func_00124880,func_00124FB0,func_00145FC0
.global service_seed_byte_34,service_request_kind_alpha_34
.global service_guard_state_34,service_request_kind_beta_34
.global service_request_kind_gamma_34,service_request_kind_delta_34

BEGIN func_00109738
mov r2,#0xb0000
mov r1,#4
push {r4,lr}
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
beq .Lreturn_00109738
pop {r4,lr}
b func_00124FB0
.Lreturn_00109738:
pop {r4,pc}
END func_00109738

BEGIN func_0010EFD8
ldr r0,.Lpool_0010EFD8
push {r3,lr}
ldr r2,.Lpool_0010EFD8+4
mov r1,#1
ldrb r0,[r0]
strb r0,[sp]
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrb r0,[sp]
pop {r3,pc}
END func_0010EFD8
.Lpool_0010EFD8:
.word service_seed_byte_34
.word service_request_kind_alpha_34

BEGIN func_0010F014
ldr r0,.Lpool_0010F014
ldrb r0,[r0,#20]
tst r0,#1
movne r0,#0
bxne lr
push {lr}
sub sp,sp,#12
add r0,sp,#4
bl func_00118C2C
ands r1,r0,#0x80000000
bpl .Lacquired_0010F014
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
.Lacquired_0010F014:
mov r0,sp
mov r2,#0x130000
mov r1,#4
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrb r0,[sp,#4]
nop
bl service_publish_operation_34
ldrb r0,[sp,#1]
add sp,sp,#12
ands r0,r0,#1
movne r0,#1
pop {pc}
END func_0010F014
.Lpool_0010F014:
.word service_guard_state_34

BEGIN func_0010F158
push {r3,lr}
ldr r2,.Lpool_0010F158
mov r1,#1
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrb r0,[sp]
pop {r3,pc}
END func_0010F158
.Lpool_0010F158:
.word service_request_kind_beta_34

BEGIN func_0010F184
ldr r0,.Lpool_0010F184
ldrb r0,[r0,#20]
tst r0,#1
movne r0,#0
bxne lr
push {lr}
sub sp,sp,#12
add r0,sp,#4
bl func_00118C2C
ands r1,r0,#0x80000000
bpl .Lacquired_0010F184
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
.Lacquired_0010F184:
mov r0,sp
mov r2,#0x130000
mov r1,#4
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrb r0,[sp,#4]
nop
bl service_publish_operation_34
ldrb r0,[sp,#2]
add sp,sp,#12
pop {pc}
END func_0010F184
.Lpool_0010F184:
.word service_guard_state_34

BEGIN func_0011863C
push {r4,lr}
mov r4,r0
sub sp,sp,#8
mov r0,#0
mov r1,r0
strd r0,[sp]
ldr r2,.Lpool_0011863C
mov r1,#8
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrd r0,[sp]
strd r0,[r4]
add sp,sp,#8
pop {r4,pc}
END func_0011863C
.Lpool_0011863C:
.word service_request_kind_gamma_34

BEGIN func_0012439C
push {lr}
sub sp,sp,#220
ldr r2,.Lpool_0012439C
mov r1,#20
add r0,sp,#192
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
mov r2,#0xc0000
mov r1,#192
mov r0,sp
bl func_00124880
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrb r0,[sp,#192]
cmp r0,#0
beq .Lclass_zero_0012439C
add r0,sp,#212
bl func_00145FC0
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldrb r0,[sp,#212]
cmp r0,#0
beq .Lclass_zero_0012439C
ldr r0,[sp]
tst r0,#1
ldrbne r0,[sp,#193]
add sp,sp,#220
cmpne r0,#0
moveq r0,#2
movne r0,#1
pop {pc}
.Lclass_zero_0012439C:
add sp,sp,#220
mov r0,#0
pop {pc}
END func_0012439C
.Lpool_0012439C:
.word service_request_kind_delta_34
