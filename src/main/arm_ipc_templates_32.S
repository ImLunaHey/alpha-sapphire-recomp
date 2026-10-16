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

.macro EP3 f,p0,p1,p2
 .size \f,.-\f
.Lpool_\f:
 .word \p0
 .word \p1
 .word \p2
.endm

.global ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32
.global func_001FFCB8,func_001FF5F0,func_001FFD74,func_001FF6AC
.global func_001FFDE4,func_001FF71C,func_001FFE54,func_001FF78C
.global func_001FFEAC,func_001FF7E4,func_001FFF40,func_001FF878
.global func_0020004C,func_001FF984,func_0020010C,func_001FFA44
.global func_00200154,func_001FFA8C,func_002001B0,func_001FFAE8
.global func_002001F8,func_001FFB30

BEGIN func_001FF27C
push {r4,r5,r6,lr}
sub sp,sp,#16
ldr r6,.Lpool_func_001FF27C
ldr r12,[sp,#32]
ldrd r4,[sp,#36]
ldr r6,[r6]
cmp r6,#0
beq .Lsecondary_001FF27C
str r12,[sp]
strd r4,[sp,#4]
bl func_001FFCB8
.Lreturn_001FF27C:
add sp,sp,#16
pop {r4,r5,r6,pc}
.Lsecondary_001FF27C:
ldr r6,.Lpool_func_001FF27C+4
ldr r6,[r6]
cmp r6,#0
ldreq r0,.Lpool_func_001FF27C+8
beq .Lreturn_001FF27C
str r12,[sp]
strd r4,[sp,#4]
bl func_001FF5F0
add sp,sp,#16
pop {r4,r5,r6,pc}
EP3 func_001FF27C,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_001FF320
push {r4,r5,lr}
sub sp,sp,#12
ldr r5,.Lpool_func_001FF320
ldr r4,[sp,#28]
ldr r12,[sp,#24]
ldr r5,[r5]
cmp r5,#0
beq .Lsecondary_001FF320
str r4,[sp,#4]
str r12,[sp]
bl func_001FFD74
.Lreturn_001FF320:
add sp,sp,#12
pop {r4,r5,pc}
.Lsecondary_001FF320:
ldr r5,.Lpool_func_001FF320+4
ldr r5,[r5]
cmp r5,#0
ldreq r0,.Lpool_func_001FF320+8
beq .Lreturn_001FF320
str r4,[sp,#4]
str r12,[sp]
bl func_001FF6AC
add sp,sp,#12
pop {r4,r5,pc}
EP3 func_001FF320,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_001FF388
push {r4,r5,lr}
sub sp,sp,#12
ldr r5,.Lpool_func_001FF388
ldr r4,[sp,#28]
ldr r12,[sp,#24]
ldr r5,[r5]
cmp r5,#0
beq .Lsecondary_001FF388
str r4,[sp,#4]
str r12,[sp]
bl func_001FFDE4
.Lreturn_001FF388:
add sp,sp,#12
pop {r4,r5,pc}
.Lsecondary_001FF388:
ldr r5,.Lpool_func_001FF388+4
ldr r5,[r5]
cmp r5,#0
ldreq r0,.Lpool_func_001FF388+8
beq .Lreturn_001FF388
str r4,[sp,#4]
str r12,[sp]
bl func_001FF71C
add sp,sp,#12
pop {r4,r5,pc}
EP3 func_001FF388,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_001FF3F0
push {r3,r4,r5,lr}
ldr r4,.Lpool_func_001FF3F0
ldr r12,[sp,#16]
ldr r4,[r4]
cmp r4,#0
beq .Lsecondary_001FF3F0
str r12,[sp]
bl func_001FFE54
pop {r3,r4,r5,pc}
.Lsecondary_001FF3F0:
ldr r4,.Lpool_func_001FF3F0+4
ldr r4,[r4]
cmp r4,#0
ldreq r0,.Lpool_func_001FF3F0+8
strne r12,[sp]
blne func_001FF78C
pop {r3,r4,r5,pc}
EP3 func_001FF3F0,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_001FF460
push {r4,r5,r6,r7,lr}
sub sp,sp,#20
add r7,sp,#44
ldr r12,[sp,#40]
ldm r7,{r4,r5,r6}
ldr r7,.Lpool_func_001FF460
ldr r7,[r7]
cmp r7,#0
beq .Lsecondary_001FF460
add r7,sp,#4
str r12,[sp]
stm r7,{r4,r5,r6}
bl func_001FFEAC
.Lreturn_001FF460:
add sp,sp,#20
pop {r4,r5,r6,r7,pc}
.Lsecondary_001FF460:
ldr r7,.Lpool_func_001FF460+4
ldr r7,[r7]
cmp r7,#0
ldreq r0,.Lpool_func_001FF460+8
beq .Lreturn_001FF460
add r7,sp,#4
str r12,[sp]
stm r7,{r4,r5,r6}
bl func_001FF7E4
add sp,sp,#20
pop {r4,r5,r6,r7,pc}
EP3 func_001FF460,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_001FF54C
push {r4,r5,r6,lr}
sub sp,sp,#16
ldr r6,.Lpool_func_001FF54C
ldr r12,[sp,#32]
ldrd r4,[sp,#36]
ldr r6,[r6]
cmp r6,#0
beq .Lsecondary_001FF54C
str r12,[sp]
strd r4,[sp,#4]
bl func_001FFF40
.Lreturn_001FF54C:
add sp,sp,#16
pop {r4,r5,r6,pc}
.Lsecondary_001FF54C:
ldr r6,.Lpool_func_001FF54C+4
ldr r6,[r6]
cmp r6,#0
ldreq r0,.Lpool_func_001FF54C+8
beq .Lreturn_001FF54C
str r12,[sp]
strd r4,[sp,#4]
bl func_001FF878
add sp,sp,#16
pop {r4,r5,r6,pc}
EP3 func_001FF54C,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_001FFBC8
ldr r3,.Lpool_func_001FFBC8
ldr r3,[r3]
cmp r3,#0
beq .Lsecondary_001FFBC8
b func_0020004C
.Lsecondary_001FFBC8:
ldr r3,.Lpool_func_001FFBC8+4
ldr r3,[r3]
cmp r3,#0
ldreq r0,.Lpool_func_001FFBC8+8
beq .Lreturn_001FFBC8
b func_001FF984
.Lreturn_001FFBC8:
bx lr
EP3 func_001FFBC8,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_001FFC7C
ldr r2,.Lpool_func_001FFC7C
ldr r2,[r2]
cmp r2,#0
beq .Lsecondary_001FFC7C
b func_0020010C
.Lsecondary_001FFC7C:
ldr r2,.Lpool_func_001FFC7C+4
ldr r2,[r2]
cmp r2,#0
ldreq r0,.Lpool_func_001FFC7C+8
beq .Lreturn_001FFC7C
b func_001FFA44
.Lreturn_001FFC7C:
bx lr
EP3 func_001FFC7C,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_00200254
push {r3,r4,r5,lr}
ldr r4,.Lpool_func_00200254
ldr r12,[sp,#16]
ldr r4,[r4]
cmp r4,#0
beq .Lsecondary_00200254
str r12,[sp]
bl func_00200154
pop {r3,r4,r5,pc}
.Lsecondary_00200254:
ldr r4,.Lpool_func_00200254+4
ldr r4,[r4]
cmp r4,#0
ldreq r0,.Lpool_func_00200254+8
strne r12,[sp]
blne func_001FFA8C
pop {r3,r4,r5,pc}
EP3 func_00200254,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_002002A0
ldr r12,.Lpool_func_002002A0
ldr r12,[r12]
cmp r12,#0
beq .Lsecondary_002002A0
b func_002001B0
.Lsecondary_002002A0:
ldr r12,.Lpool_func_002002A0+4
ldr r12,[r12]
cmp r12,#0
ldreq r0,.Lpool_func_002002A0+8
beq .Lreturn_002002A0
b func_001FFAE8
.Lreturn_002002A0:
bx lr
EP3 func_002002A0,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32

BEGIN func_002002DC
push {r3,r4,r5,lr}
ldr r4,.Lpool_func_002002DC
ldr r12,[sp,#16]
ldr r4,[r4]
cmp r4,#0
beq .Lsecondary_002002DC
str r12,[sp]
bl func_002001F8
pop {r3,r4,r5,pc}
.Lsecondary_002002DC:
ldr r4,.Lpool_func_002002DC+4
ldr r4,[r4]
cmp r4,#0
ldreq r0,.Lpool_func_002002DC+8
strne r12,[sp]
blne func_001FFB30
pop {r3,r4,r5,pc}
EP3 func_002002DC,ipc_handle_slot_theta,ipc_handle_slot_eta,ipc_unavailable_status_32
