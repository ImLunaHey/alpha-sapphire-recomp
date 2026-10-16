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

.global func_00193C68,func_0017E4D8
.global ipc_controller_selector_offset_77
.global ipc_popcount_pair_mask_79,ipc_popcount_lane_mask_79
.global ipc_popcount_nibble_mask_79

BEGIN func_0019125C
add r0,r0,r1,lsl #2
vldr s0,[r0,#56]
bx lr
END func_0019125C

BEGIN func_001919DC
push {r0,r1,r2,r3}
push {r4,lr}
add r3,sp,#20
ldr r2,[sp,#16]
bl func_00193C68
pop {r4}
ldr pc,[sp],#20
END func_001919DC

BEGIN func_00192BF8
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
bl func_0017E4D8
cmp r0,#0
beq .Lpublish_done_00192BF8
ldr r0,.Lselector_offset_00192BF8
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r5,lsl #2
add r0,r0,#4096
ldr r1,[r0,#176]
mov r0,#1
strb r0,[r1,#160]
ldr r2,[r1]
orr r2,r2,#65536
str r2,[r1]
.Lpublish_done_00192BF8:
pop {r4,r5,r6,pc}
END func_00192BF8
.Lselector_offset_00192BF8:
.word ipc_controller_selector_offset_77

BEGIN func_00192C4C
push {r4,r5,r6,lr}
mov r4,r0
mov r5,r1
mov r6,r2
bl func_0017E4D8
cmp r0,#0
beq .Lnotify_done_00192C4C
ldr r0,.Lselector_offset_00192C4C
ldrh r0,[r0,r4]
and r0,r0,#1
add r0,r0,r0,lsl #1
add r0,r4,r0,lsl #5
add r0,r0,r5,lsl #2
add r0,r0,#4096
ldr r0,[r0,#176]
strh r6,[r0,#162]
ldr r1,[r0]
orr r1,r1,#268435456
str r1,[r0]
mov r0,#1
.Lnotify_done_00192C4C:
pop {r4,r5,r6,pc}
END func_00192C4C
.Lselector_offset_00192C4C:
.word ipc_controller_selector_offset_77

BEGIN func_00192EA4
ldr r2,.Lpair_mask_00192EA4
ldr r1,.Llane_mask_00192EA4
and r2,r2,r0,lsr #1
sub r0,r0,r2
and r2,r0,r1
and r0,r1,r0,lsr #2
ldr r1,.Lnibble_mask_00192EA4
add r0,r0,r2
add r0,r0,r0,lsr #4
and r0,r0,r1
add r0,r0,r0,lsr #8
add r0,r0,r0,lsr #16
and r0,r0,#63
bx lr
END func_00192EA4
.Lpair_mask_00192EA4:
.word ipc_popcount_pair_mask_79
.Llane_mask_00192EA4:
.word ipc_popcount_lane_mask_79
.Lnibble_mask_00192EA4:
.word ipc_popcount_nibble_mask_79
