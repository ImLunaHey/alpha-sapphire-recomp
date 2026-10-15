.syntax unified
.arm
.fpu vfpv2
.text

.section .text.func_00124A2C, "ax", %progbits
.global func_00124A2C
.type func_00124A2C, %function
func_00124A2C:
push {r4, lr}
mrc p15, 0, r4, c13, c0, 3
mov r1, #0x120000
str r1, [r4, #128]!
ldr r0, [r0]
svc #0x32
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r4, pc}
.size func_00124A2C, . - func_00124A2C

.section .text.func_001330E8, "ax", %progbits
.global func_001330E8
.type func_001330E8, %function
func_001330E8:
push {r0, r1, r2}
ldrd r0, [sp]
cmp r0, r1
beq 2f
1:
add r1, r0, #4
str r1, [sp]
str r2, [r0]
ldrd r0, [sp]
cmp r0, r1
bne 1b
2:
add sp, sp, #12
bx lr
.size func_001330E8, . - func_001330E8

.section .text.func_0011CB70, "ax", %progbits
.global func_0011CB70
.type func_0011CB70, %function
func_0011CB70:
push {r4, r5}
cmp r1, #0
ldr r12, [sp, #8]
ldrd r4, [sp, #12]
beq 1f
vldmia r1, {s0-s3}
vstr s0, [r0, #20]
vstr s1, [r0, #24]
vstr s2, [r0, #28]
vstr s3, [r0, #32]
2:
add r1, r0, #36
vldmia r2, {s0-s3}
cmp r5, #0
mov r2, #1
vstmia r1, {s0-s3}
addne r1, r0, #52
vstmiane r1, {s0-s3}
mov r1, #0
strb r1, [r0, #70]
strb r2, [r0, #72]
str r1, [r0, #16]
str r3, [r0, #12]
strb r12, [r0, #69]
strb r4, [r0]
pop {r4, r5}
bx lr
1:
add r1, r0, #52
vldmia r1, {s0-s3}
add r1, r0, #20
vstmia r1, {s0-s3}
b 2b
.size func_0011CB70, . - func_0011CB70

.section .text.func_00127528, "ax", %progbits
.global func_00127528
.type func_00127528, %function
func_00127528:
vldr s3, [r1]
vldr s8, [r1, #12]
vldr s7, [r1, #16]
vldr s6, [r1, #28]
vmul.f32 s3, s3, s8
vldr s4, [r1, #32]
vldr s5, [r1, #44]
add r2, r0, #52
vldr s2, [r0, #48]
vldmia r2, {s0-s1}
add r2, r1, #24
vmla.f32 s3, s7, s6
vnmla.f32 s3, s4, s5
vstr s3, [r0, #48]
vldr s4, [r1, #4]
vldr s9, [r1, #12]
vldr s7, [r1, #20]
vldr s8, [r1, #28]
vmul.f32 s4, s4, s9
vldr s5, [r1, #36]
vldr s6, [r1, #44]
vmla.f32 s4, s7, s8
vnmla.f32 s4, s5, s6
vstr s4, [r0, #52]
vldr s4, [r1, #8]
vldr s9, [r1, #12]
vldmia r2, {s7-s8}
vmul.f32 s4, s4, s9
add r2, r1, #40
vldmia r2, {s5-s6}
vmla.f32 s4, s7, s8
vnmla.f32 s4, s5, s6
vstr s4, [r0, #56]
ldrb r2, [r0, #96]
cmp r2, #0
beq 1f
vldmia r1, {s0-s7}
add r1, r1, #32
add r3, r0, #32
mov r2, #0
vstmia r0, {s0-s7}
vldmia r1, {s0-s3}
vstmia r3, {s0-s3}
strb r2, [r0, #96]
bx lr
1:
vldmia r1, {s4-s11}
vsub.f32 s2, s3, s2
add r1, r1, #32
add r2, r0, #32
vstmia r0, {s4-s11}
vldmia r1, {s4-s7}
vstr s2, [r0, #60]
vstmia r2, {s4-s7}
vldr s2, [r0, #52]
vsub.f32 s0, s2, s0
vstr s0, [r0, #64]
vldr s0, [r0, #56]
vsub.f32 s0, s0, s1
vstr s0, [r0, #68]
bx lr
.size func_00127528, . - func_00127528

.macro FIELD_SETTER name, offset, bit
.section .text.\name, "ax", %progbits
.global \name
.type \name, %function
\name:
vldr s1, [r0, #\offset]
vcmp.f32 s1, s0
vmrs APSR_nzcv, fpscr
beq 1f
ldrh r1, [r0, #32]
vstr s0, [r0, #\offset]
orr r1, r1, #\bit
strh r1, [r0, #32]
1:
bx lr
.size \name, . - \name
.endm

FIELD_SETTER func_00180658, 56, 16
FIELD_SETTER func_001806C0, 52, 8
FIELD_SETTER func_0018074C, 48, 8
FIELD_SETTER func_00180838, 40, 4

.macro ARRAY_SETTER name, displacement
.section .text.\name, "ax", %progbits
.global \name
.type \name, %function
\name:
mov r2, #0
b 2f
1:
tst r1, #1
beq 3f
add r3, r2, r2, lsl #3
add r3, r0, r3, lsl #2
add r3, r3, #0x1800
vstr s0, [r3, #\displacement]
3:
add r2, r2, #1
lsr r1, r1, #1
2:
ldr r3, [r0, #256]
cmp r3, r2
bls 4f
cmp r1, #0
bne 1b
4:
bx lr
.size \name, . - \name
.endm

ARRAY_SETTER func_00181484, 800
ARRAY_SETTER func_00181630, 796
ARRAY_SETTER func_00181670, 804
