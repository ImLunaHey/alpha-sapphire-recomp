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

.macro E f
 .size \f,.-\f
.endm

.macro EP1 f,p0
 .size \f,.-\f
.Lpool_\f:
 .word \p0
.endm

.macro EP2 f,p0,p1
 .size \f,.-\f
.Lpool_\f:
 .word \p0
 .word \p1
.endm

.global service_shutdown_prepare_31,service_shutdown_secondary_31
.global service_shutdown_finish_31,service_startup_31,service_request_size_31
.global service_open_31,runtime_failure_raise_entry_31
.global service_state_block_31,service_session_handle_31
.global service_initialized_byte_31,service_open_accepted_status_31
.global service_query_accepted_status_31
.global func_002C6104,func_002C6254,func_002C62B0,func_002C62EC
.global func_002C6378,func_002C63B4,func_002C63E4,func_002C6420
.global func_002C6450,func_002C6480,func_002C64BC,func_002C64F8
.global func_002C6534,func_002C65E8,func_002C6624

BEGIN func_002C5C4C
ldr r0,.Lpool_func_002C5C4C
ldrb r0,[r0,#1]
cmp r0,#0
bxeq lr
push {r4,lr}
bl service_shutdown_prepare_31
bl service_shutdown_secondary_31
pop {r4,lr}
b service_shutdown_finish_31
EP1 func_002C5C4C,service_state_block_31

BEGIN func_002C5C74
push {r4,lr}
bl func_002C6104
lsrs r0,r0,#31
beq .Lret_002C5C74
pop {r4,lr}
b runtime_failure_raise_entry_31
.Lret_002C5C74:
pop {r4,pc}
E func_002C5C74

BEGIN func_002C5D80
mov ip,r0
ldr r0,.Lpool_func_002C5D80
push {r3,lr}
ldr r0,[r0]
str r3,[sp]
mov r3,r2
mov r2,r1
mov r1,ip
bl func_002C6254
lsrs r0,r0,#31
beq .Lret_002C5D80
pop {r3,lr}
b runtime_failure_raise_entry_31
.Lret_002C5D80:
pop {r3,pc}
EP1 func_002C5D80,service_session_handle_31

BEGIN func_002C5DBC
push {r4,lr}
bl func_002C62B0
lsrs r0,r0,#31
beq .Lret_002C5DBC
pop {r4,lr}
b runtime_failure_raise_entry_31
.Lret_002C5DBC:
pop {r4,pc}
E func_002C5DBC

BEGIN func_002C5DD8
mov ip,r0
ldr r0,.Lpool_func_002C5DD8
push {r3,lr}
ldr r0,[r0]
str r3,[sp]
mov r3,r2
mov r2,r1
mov r1,ip
bl func_002C62EC
lsrs r0,r0,#31
beq .Lret_002C5DD8
pop {r3,lr}
b runtime_failure_raise_entry_31
.Lret_002C5DD8:
pop {r3,pc}
EP1 func_002C5DD8,service_session_handle_31

BEGIN func_002C5E14
push {r4,r5,r6,lr}
mov r5,r0
ldr r4,.Lpool_func_002C5E14
mov r6,r1
ldrb r0,[r4]
cmp r0,#0
movne r0,#1
bne .Lreturn_002C5E14
bl service_startup_31
lsrs r0,r0,#31
blne runtime_failure_raise_entry_31
mov r0,r6
bl service_request_size_31
mov r2,r0
mov r3,#1
mov r1,r6
mov r0,r5
bl service_open_31
ands r1,r0,#0x80000000
bpl .Lrequest_002C5E14
ldr r1,.Lpool_func_002C5E14+4
cmp r0,r1
beq .Lzero_002C5E14
lsrs r0,r0,#31
blne runtime_failure_raise_entry_31
.Lrequest_002C5E14:
nop
bl func_002C6450
ands r0,r0,#0x80000000
nop
bpl .Lmark_002C5E14
ldr r0,[r5]
svc #35
lsrs r0,r0,#31
nop
blne runtime_failure_raise_entry_31
.Lzero_002C5E14:
mov r0,#0
.Lreturn_002C5E14:
pop {r4,r5,r6,pc}
.Lmark_002C5E14:
mov r0,#1
strb r0,[r4]
pop {r4,r5,r6,pc}
EP2 func_002C5E14,service_initialized_byte_31,service_open_accepted_status_31

BEGIN func_002C5EBC
push {r4,lr}
bl func_002C6378
lsrs r0,r0,#31
beq .Lret_002C5EBC
pop {r4,lr}
b runtime_failure_raise_entry_31
.Lret_002C5EBC:
pop {r4,pc}
E func_002C5EBC

BEGIN func_002C5ED8
push {r4,lr}
bl func_002C63B4
lsrs r0,r0,#31
beq .Lret_002C5ED8
pop {r4,lr}
b runtime_failure_raise_entry_31
.Lret_002C5ED8:
pop {r4,pc}
E func_002C5ED8

BEGIN func_002C5EF4
push {r4,lr}
bl func_002C63E4
lsrs r0,r0,#31
beq .Lret_002C5EF4
pop {r4,lr}
b runtime_failure_raise_entry_31
.Lret_002C5EF4:
pop {r4,pc}
E func_002C5EF4

BEGIN func_002C5F10
push {r4,lr}
bl func_002C6420
ldr r1,.Lpool_func_002C5F10
cmp r0,r1
beq .Lret_002C5F10
lsrs r0,r0,#31
blne runtime_failure_raise_entry_31
mov r0,#0
.Lret_002C5F10:
pop {r4,pc}
EP1 func_002C5F10,service_query_accepted_status_31

BEGIN func_002C5F38
push {r3,lr}
mov r0,sp
bl func_002C6480
lsrs r0,r0,#31
blne runtime_failure_raise_entry_31
ldrsb r0,[sp]
pop {r3,pc}
E func_002C5F38

BEGIN func_002C5F54
push {r4,lr}
bl func_002C64BC
lsrs r0,r0,#31
beq .Lret_002C5F54
pop {r4,lr}
b runtime_failure_raise_entry_31
.Lret_002C5F54:
pop {r4,pc}
E func_002C5F54

BEGIN func_002C5F70
push {r4,lr}
bl func_002C64F8
lsrs r0,r0,#31
beq .Lret_002C5F70
pop {r4,lr}
b runtime_failure_raise_entry_31
.Lret_002C5F70:
pop {r4,pc}
E func_002C5F70

BEGIN func_002C601C
push {r3,r4,r5,lr}
mov r4,r0
mov r5,#0
mov r0,sp
str r5,[sp]
bl func_002C6534
lsrs r0,r0,#31
blne runtime_failure_raise_entry_31
ldr r0,[r4]
cmp r0,#0
beq .Linstall_002C601C
svc #35
str r5,[r4]
.Linstall_002C601C:
ldr r0,[sp]
str r0,[r4]
pop {r3,r4,r5,pc}
E func_002C601C

BEGIN func_002C60CC
push {r4,lr}
bl func_002C65E8
lsrs r0,r0,#31
beq .Lret_002C60CC
pop {r4,lr}
b runtime_failure_raise_entry_31
.Lret_002C60CC:
pop {r4,pc}
E func_002C60CC

BEGIN func_002C60E8
push {r4,lr}
bl func_002C6624
lsrs r0,r0,#31
beq .Lret_002C60E8
pop {r4,lr}
b runtime_failure_raise_entry_31
.Lret_002C60E8:
pop {r4,pc}
E func_002C60E8
