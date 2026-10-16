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

.global func_001240C4,func_001F72F4,func_00146000,func_001FB6AC
.global func_00124FB0,func_001FB6F8,func_001FB4CC
.global service_result_normalization_39,lazy_service_cell_39
.global service_default_word_39,service_fallback_state_39
.global service_filtered_status_39,required_handle_error_39

BEGIN func_001F461C
push {lr}
sub sp,sp,#20
mov r3,#0
mov r2,#1
strh r3,[sp,#2]
strb r2,[sp]
strb r3,[sp,#1]
strd r0,[sp,#4]
bl func_001240C4
str r0,[sp,#12]
mov r1,sp
add r0,sp,#12
bl func_001F72F4
and r1,r0,#0x3fc00
lsr r1,r1,#10
cmp r1,#17
bne .Lnormalize_001F461C
lsl r1,r0,#22
lsr r1,r1,#22
cmp r1,#220
blt .Lnormalize_001F461C
cmp r1,#229
ldrle r0,.Lpool_001F461C
.Lnormalize_001F461C:
add sp,sp,#20
lsrs r1,r0,#31
moveq r0,#0
pop {pc}
END func_001F461C
.Lpool_001F461C:
.word service_result_normalization_39

BEGIN func_001F78E8
push {r4,lr}
ldr r4,.Lpool_001F78E8
ldr r0,[r4]
cmp r0,#0
bleq func_00146000
ldr r0,[r4]
pop {r4,pc}
END func_001F78E8
.Lpool_001F78E8:
.word lazy_service_cell_39

BEGIN func_001FAFD8
mov r0,r0
ldr r1,.Lpool_001FAFD8
push {r3,lr}
cmp r0,#0
str r1,[sp]
beq .Lfallback_001FAFD8
mov r1,r0
mov r0,sp
bl func_001FB6AC
mov r1,pc
lsrs r2,r0,#31
blne func_00124FB0
ldr r0,[sp]
pop {r3,pc}
.Lfallback_001FAFD8:
ldr r0,.Lpool_001FAFD8+4
ldr r0,[r0,#12]
ldr r0,[r0]
str r0,[sp]
pop {r3,pc}
END func_001FAFD8
.Lpool_001FAFD8:
.word service_default_word_39
.word service_fallback_state_39

BEGIN func_001FB388
cmp r1,#252
push {r4,lr}
bhi .Llarge_001FB388
bl func_001FB6F8
b .Lstatus_001FB388
.Llarge_001FB388:
nop
bl func_001FB4CC
.Lstatus_001FB388:
lsrs r1,r0,#31
mov r4,r0
beq .Lreturn_001FB388
tst r0,#0x80000000
lsr r1,r0,#27
subne r1,r1,#32
cmn r1,#7
ldrne r1,.Lpool_001FB388
cmpne r0,r1
movne r1,pc
blne func_00124FB0
.Lreturn_001FB388:
mov r0,r4
pop {r4,pc}
END func_001FB388
.Lpool_001FB388:
.word service_filtered_status_39

BEGIN func_004A7960
push {r4,lr}
mov r4,r0
ldr r0,[r0,#4]
cmp r0,#0
ldreq r0,.Lpool_004A7960
moveq r1,pc
bleq func_00124FB0
ldr r0,[r4,#4]
pop {r4,pc}
END func_004A7960
.Lpool_004A7960:
.word required_handle_error_39

BEGIN func_004A79A8
push {r4,lr}
mov r4,r0
ldr r0,[r0,#4]
cmp r0,#0
ldreq r0,.Lpool_004A79A8
moveq r1,pc
bleq func_00124FB0
ldr r0,[r4,#4]
pop {r4,pc}
END func_004A79A8
.Lpool_004A79A8:
.word required_handle_error_39
