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

.global func_0018D65C,func_00184990,func_0018DB10
.global func_001003E8,func_001003CC,func_001888A8,func_00171324
.global ipc_dispatch_owner_vtable_71,ipc_text_owner_vtable_71
.global ipc_allocator_dispatch_owner_68,ipc_service_registry_owner_71

BEGIN func_0018BD3C
push {r4,lr}
mov r4,r0
mov r0,#0
str r0,[r4]
str r0,[r4,#4]
str r0,[r4,#8]
str r0,[r4,#12]
str r0,[r4,#16]
str r0,[r4,#20]
mov r1,#1
mov r0,r4
bl func_0018D65C
ldr r0,[r4,#8]
add r2,r0,#112
str r0,[r4,#16]
str r2,[r4,#8]
str r0,[r0]
ldr r0,[r4,#16]
str r0,[r0,#4]
mov r0,r4
pop {r4,pc}
END func_0018BD3C

BEGIN func_0018BD90
push {r3,r4,r5,r6,r7,r8,r9,lr}
mov r6,r0
mov r9,#0
ldr r0,.Lpool_0018BD90_vtable
str r0,[r6]
strb r9,[r6,#4]
mov r0,#60
strb r9,[r6,#5]
bl func_00184990
cmp r0,#0
moveq r7,#0
beq .Lfinal_allocation_0018BD90
str r9,[r0]
str r9,[r0,#8]
str r9,[r0,#12]
str r9,[r0,#16]
str r9,[r0,#28]
str r9,[r0,#32]
str r9,[r0,#36]
str r9,[r0,#40]
str r9,[r0,#44]
str r9,[r0,#48]
str r9,[r0,#52]
str r9,[r0,#56]
str r9,[r0,#4]
str r9,[r0,#20]
str r9,[r0,#24]
strb r9,[r0,#28]
strb r1,[r0,#29]
str r9,[r0,#16]
str r9,[r0,#12]
mov r7,r0
add r4,r0,#4
str r9,[r0,#8]
mov r8,#32
mov r0,#12
bl func_00184990
mov r5,r0
mov r0,#1664
bl func_00184990
str r0,[r5,#8]
ldr r0,[r4]
stm r5,{r0,r8}
str r5,[r4]
ldr r0,[r5,#8]
add r5,r7,#32
add r1,r0,#1664
strd r0,[r4,#8]
add r1,r0,#52
str r1,[r4,#8]
str r9,[r0,#8]
str r9,[r0,#12]
strb r9,[r0]
str r0,[r4,#16]
str r9,[r0,#4]
ldr r0,[r4,#16]
str r0,[r0,#8]
ldr r0,[r4,#16]
str r0,[r0,#12]
str r9,[r7,#32]
str r9,[r7,#48]
str r9,[r7,#52]
strb r9,[r7,#56]
strb r0,[r7,#57]
str r9,[r7,#44]
str r9,[r7,#40]
mov r0,#12
str r9,[r7,#36]
bl func_00184990
mov r4,r0
mov r0,#1664
bl func_00184990
str r0,[r4,#8]
ldr r0,[r5]
stm r4,{r0,r8}
str r4,[r5]
ldr r0,[r4,#8]
add r1,r0,#1664
strd r0,[r5,#8]
add r1,r0,#52
str r1,[r5,#8]
str r9,[r0,#8]
str r9,[r0,#12]
strb r9,[r0]
str r0,[r5,#16]
str r9,[r0,#4]
ldr r0,[r5,#16]
str r0,[r0,#8]
ldr r0,[r5,#16]
str r0,[r0,#12]
.Lfinal_allocation_0018BD90:
mov r0,#192
str r7,[r6,#8]
bl func_00184990
cmp r0,#0
nop
blne func_0018DB10
str r0,[r6,#12]
mov r0,r6
pop {r3,r4,r5,r6,r7,r8,r9,pc}
END func_0018BD90
.Lpool_0018BD90_vtable:
.word ipc_dispatch_owner_vtable_71

BEGIN func_0018BF64
push {r4,r5,r6,lr}
mov r4,r0
ldr r0,.Lpool_0018BF64_vtable
str r0,[r4]
ldr r6,[r1,#4]
cmp r6,#0
moveq r0,#0
streq r0,[r4,#4]
beq .Lreturn_0018BF64
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
.Lreturn_0018BF64:
mov r0,r4
pop {r4,r5,r6,pc}
END func_0018BF64
.Lpool_0018BF64_vtable:
.word ipc_text_owner_vtable_71

BEGIN func_0018BFC4
ldr r0,.Lpool_0018BFC4_allocator
push {r4,lr}
ldrb r1,[r0,#13]
cmp r1,#0
moveq r2,#0
beq .Llookup_0018BFC4
ldr r0,[r0,#148]
bl func_001888A8
ldr r2,[r0]
.Llookup_0018BFC4:
ldr r0,.Lpool_0018BFC4_registry
mov r1,#1
bl func_00171324
cmp r0,#0
ldrne r0,[r0,#12]
pop {r4,pc}
END func_0018BFC4
.Lpool_0018BFC4_allocator:
.word ipc_allocator_dispatch_owner_68
.Lpool_0018BFC4_registry:
.word ipc_service_registry_owner_71
