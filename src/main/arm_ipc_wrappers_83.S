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

.global ipc_controller_record_vtable_83
.global ipc_default_flags_54
.global ipc_layout_record_tag_55
.global ipc_controller_variant_tag_83
.global ipc_controller_fallback_tag_83
.global ipc_controller_state_vtable_83
.global ipc_unit_scalar_54
.global service_zero_scalar_51

BEGIN func_0017A8A8
mov r2,r0
ldm r1,{r0,r3}
mov r12,#0
str r3,[r0,#4]
str r0,[r3]
ldr r3,[r2]
sub r3,r3,#1
str r3,[r2]
str r12,[r1]
str r12,[r1,#4]
bx lr
END func_0017A8A8

BEGIN func_0017A8E8
ldr r3,[r1,#4]
stm r2,{r1,r3}
str r2,[r1,#4]
str r2,[r3]
ldr r1,[r0]
add r1,r1,#1
str r1,[r0]
mov r0,r2
bx lr
END func_0017A8E8

BEGIN func_0017AA68
push {r4}
str r1,[r0,#4]
ldr r1,.Lrecord_vtable_0017AA68
add r12,r0,#44
str r1,[r0]
mov r1,#0
str r1,[r0,#8]
strb r1,[r0,#36]
str r1,[r0,#28]
str r1,[r0,#32]
str r1,[r0,#40]
vldmia r2,{s0-s5}
vstmia r12,{s0-s5}
str r3,[r0,#68]
ldr r2,[r3,#24]
str r2,[r0,#12]
ldr r2,[r3,#28]
str r2,[r0,#16]
ldr r2,[r3,#52]
cmp r2,#0
ldreq r4,.Ldefault_flags_0017AA68
beq .Lselect_done_0017AA68
cmp r2,#2
ldreq r4,.Llayout_tag_0017AA68
beq .Lselect_done_0017AA68
cmp r2,#3
ldreq r4,.Lvariant_tag_0017AA68
beq .Lselect_done_0017AA68
cmp r2,#4
ldreq r4,.Lfallback_tag_0017AA68
.Lselect_done_0017AA68:
str r1,[r0,#24]
str r4,[r0,#20]
ldr r2,[r3]
cmp r2,#0x20000009
beq .Lcase_20000009_0017AA68
sub r2,r2,#16
subs r2,r2,#0x20000001
beq .Lcase_base_0017AA68
cmp r2,#16
bne .Lreturn_0017AA68
ldr r2,[r3,#56]!
cmp r2,#0
addne r2,r2,r3
moveq r2,r1
ldr r3,[r2,#24]
cmp r3,#0
bne .Luse_r3_0017AA68
b .Ltry_nested_0017AA68
.Lcase_base_0017AA68:
ldr r2,[r3,#56]!
cmp r2,#0
addne r2,r2,r3
moveq r2,r1
ldr r3,[r2,#24]
cmp r3,#0
beq .Ltry_nested_base_0017AA68
.Luse_r3_0017AA68:
mov r1,r3
b .Lstore_0017AA68
.Ltry_nested_base_0017AA68:
ldr r3,[r2,#12]!
cmp r3,#0
beq .Lstore_0017AA68
.Ladd_nested_0017AA68:
add r1,r3,r2
b .Lstore_0017AA68
.Lcase_20000009_0017AA68:
ldr r2,[r3,#56]!
cmp r2,#0
addne r2,r2,r3
moveq r2,r1
ldr r3,[r2,#24]
cmp r3,#0
bne .Luse_r3_0017AA68
ldr r3,[r2,#12]!
cmp r3,#0
bne .Ladd_nested_0017AA68
b .Lstore_0017AA68
.Ltry_nested_0017AA68:
ldr r3,[r2,#12]!
cmp r3,#0
bne .Ladd_nested_0017AA68
.Lstore_0017AA68:
str r1,[r0,#28]
.Lreturn_0017AA68:
pop {r4}
bx lr
END func_0017AA68
.Lrecord_vtable_0017AA68:
.word ipc_controller_record_vtable_83
.Ldefault_flags_0017AA68:
.word ipc_default_flags_54
.Llayout_tag_0017AA68:
.word ipc_layout_record_tag_55
.Lvariant_tag_0017AA68:
.word ipc_controller_variant_tag_83
.Lfallback_tag_0017AA68:
.word ipc_controller_fallback_tag_83

BEGIN func_0017ABB8
ldr r1,.Lstate_vtable_0017ABB8
vldr s1,.Lunit_0017ABB8
vldr s0,.Lzero_0017ABB8
str r1,[r0]
vstr s1,[r0,#48]
vstr s1,[r0,#52]
vstr s0,[r0,#56]
vstr s0,[r0,#60]
vstr s0,[r0,#64]
vstr s0,[r0,#68]
mov r1,#0
vstr s0,[r0,#72]
str r1,[r0,#76]
str r1,[r0,#80]
str r1,[r0,#84]
vstr s1,[r0,#88]
vstr s1,[r0,#92]
vstr s0,[r0,#96]
vstr s0,[r0,#100]
vstr s0,[r0,#104]
str r1,[r0,#108]
str r1,[r0,#112]
vstr s0,[r0,#116]
vstr s0,[r0,#120]
str r1,[r0,#124]
str r1,[r0,#128]
vstr s0,[r0,#132]
vstr s0,[r0,#136]
str r1,[r0,#140]
str r1,[r0,#144]
strb r1,[r0,#155]
vstr s0,[r0,#180]
vstr s0,[r0,#184]
str r1,[r0,#188]
str r1,[r0,#192]
str r1,[r0,#232]
str r1,[r0,#236]
str r1,[r0,#240]
str r1,[r0,#244]
str r1,[r0,#248]
str r1,[r0,#252]
str r1,[r0,#256]
str r1,[r0,#260]
str r1,[r0,#264]
str r1,[r0,#268]
str r1,[r0,#272]
bx lr
END func_0017ABB8
.Lstate_vtable_0017ABB8:
.word ipc_controller_state_vtable_83
.Lunit_0017ABB8:
.word ipc_unit_scalar_54
.Lzero_0017ABB8:
.word service_zero_scalar_51
