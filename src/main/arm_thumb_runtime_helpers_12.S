.syntax unified
.arch armv6k
.cpu mpcore
.fpu vfpv2
.arm

.section .text.func_001235B4, "ax", %progbits
.balign 4
.global func_001235B4
.type func_001235B4, %function
func_001235B4:
vpush {d8-d12}
vldmia r2!, {s16-s23}
vldr s24, [r1]
vldr s25, [r1, #16]
vmul.f32 s0, s24, s16
vmul.f32 s1, s24, s17
vmul.f32 s2, s24, s18
vmul.f32 s3, s24, s19
vldr s24, [r1, #32]
vmul.f32 s4, s25, s16
vmul.f32 s5, s25, s17
vmul.f32 s6, s25, s18
vmul.f32 s7, s25, s19
vldr s25, [r1, #48]
vmul.f32 s8, s24, s16
vmul.f32 s9, s24, s17
vmul.f32 s10, s24, s18
vmul.f32 s11, s24, s19
vldr s24, [r1, #4]
vmul.f32 s12, s25, s16
vmul.f32 s13, s25, s17
vmul.f32 s14, s25, s18
vmul.f32 s15, s25, s19
vldr s25, [r1, #20]
vldmia r2!, {s16-s19}
vmla.f32 s0, s24, s20
vmla.f32 s1, s24, s21
vmla.f32 s2, s24, s22
vmla.f32 s3, s24, s23
vldr s24, [r1, #36]
vmla.f32 s4, s25, s20
vmla.f32 s5, s25, s21
vmla.f32 s6, s25, s22
vmla.f32 s7, s25, s23
vldr s25, [r1, #52]
vmla.f32 s8, s24, s20
vmla.f32 s9, s24, s21
vmla.f32 s10, s24, s22
vmla.f32 s11, s24, s23
vldr s24, [r1, #8]
vmla.f32 s12, s25, s20
vmla.f32 s13, s25, s21
vmla.f32 s14, s25, s22
vmla.f32 s15, s25, s23
vldr s25, [r1, #24]
vldmia r2, {s20-s23}
vmla.f32 s0, s24, s16
vmla.f32 s1, s24, s17
vmla.f32 s2, s24, s18
vmla.f32 s3, s24, s19
vldr s24, [r1, #40]
vmla.f32 s4, s25, s16
vmla.f32 s5, s25, s17
vmla.f32 s6, s25, s18
vmla.f32 s7, s25, s19
vldr s25, [r1, #56]
vmla.f32 s8, s24, s16
vmla.f32 s9, s24, s17
vmla.f32 s10, s24, s18
vmla.f32 s11, s24, s19
vldr s24, [r1, #12]
vmla.f32 s12, s25, s16
vmla.f32 s13, s25, s17
vmla.f32 s14, s25, s18
vmla.f32 s15, s25, s19
vldr s25, [r1, #28]
vmla.f32 s0, s24, s20
vmla.f32 s1, s24, s21
vmla.f32 s2, s24, s22
vmla.f32 s3, s24, s23
vldr s24, [r1, #44]
vmla.f32 s4, s25, s20
vmla.f32 s5, s25, s21
vmla.f32 s6, s25, s22
vmla.f32 s7, s25, s23
vldr s25, [r1, #60]
vmla.f32 s8, s24, s20
vmla.f32 s9, s24, s21
vmla.f32 s10, s24, s22
vmla.f32 s11, s24, s23
vmla.f32 s12, s25, s20
vmla.f32 s13, s25, s21
vmla.f32 s14, s25, s22
vmla.f32 s15, s25, s23
vpop {d8-d12}
vstmia r0, {s0-s15}
bx lr
.size func_001235B4, . - func_001235B4

.section .text.func_00123C78, "ax", %progbits
.balign 4
.global func_00123C78
.type func_00123C78, %function
func_00123C78:
push {r4, r5, r9, r10, r11}
.rept 9
ldm r1!, {r2, r3, r4, r5}
pld [r1, #64]
ldm r1!, {r9, r10, r11, r12}
stm r0!, {r2, r3, r4, r5}
stm r0!, {r9, r10, r11, r12}
.endr
ldm r1!, {r2, r3, r4, r5}
ldm r1!, {r11, r12}
stm r0!, {r2, r3, r4, r5}
stm r0!, {r11, r12}
pop {r4, r5, r9, r10, r11}
bx lr
.size func_00123C78, . - func_00123C78

.section .text.func_001277B4, "ax", %progbits
.balign 4
.global func_001277B4
.type func_001277B4, %function
func_001277B4:
ldr r3, [r0]
ldr r3, [r3, #12]
bx r3
.size func_001277B4, . - func_001277B4

.section .text.func_0012C174, "ax", %progbits
.balign 4
.global func_0012C174
.type func_0012C174, %function
func_0012C174:
mov r12, #1
strb r12, [r0, #12]
mov r3, #0
str r1, [r0, #8]
strb r3, [r0, #13]
str r2, [r0, #4]
bx lr
.size func_0012C174, . - func_0012C174

.section .text.func_0012C7EC, "ax", %progbits
.balign 4
.global func_0012C7EC
.type func_0012C7EC, %function
func_0012C7EC:
ldrb r1, [r0, #74]
cmp r1, #0
ldrsbeq r0, [r0, #68]
movne r0, #0
bx lr
.size func_0012C7EC, . - func_0012C7EC

.section .text.func_0012FAF4, "ax", %progbits
.balign 4
.global func_0012FAF4
.type func_0012FAF4, %function
func_0012FAF4:
ldr r1, [r0]
mov r0, #0
cmp r1, #0
ldrhne r0, [r1, #2]
bx lr
.size func_0012FAF4, . - func_0012FAF4

.section .text.func_0012FB40, "ax", %progbits
.balign 4
.global func_0012FB40
.type func_0012FB40, %function
func_0012FB40:
ldr r2, [r0]
mov r0, #0
cmp r2, #0
ldrhne r3, [r2, #2]
cmpne r3, r1
bls 1f
mov r0, #4
add r0, r0, r1, lsl #2
ldr r0, [r2, r0]
add r0, r0, r2
1:
bx lr
.size func_0012FB40, . - func_0012FB40

.section .text.func_0012FE10, "ax", %progbits
.balign 4
.global func_0012FE10
.type func_0012FE10, %function
func_0012FE10:
ldr r0, [r0, #4]
and r0, r0, #0x20000
lsr r0, r0, #17
bx lr
.size func_0012FE10, . - func_0012FE10

.section .text.func_0012FE20, "ax", %progbits
.balign 4
.global func_0012FE20
.type func_0012FE20, %function
func_0012FE20:
mov r1, #0
str r1, [r0]
str r1, [r0, #4]
bx lr
.size func_0012FE20, . - func_0012FE20

.section .text.func_0012FE3C, "ax", %progbits
.balign 4
.global func_0012FE3C
.type func_0012FE3C, %function
func_0012FE3C:
ldr r2, [r1]
ldr r3, [r1, #4]
str r2, [r0]
str r3, [r0, #4]
bx lr
.size func_0012FE3C, . - func_0012FE3C

.section .text.func_00132230, "ax", %progbits
.balign 4
.global func_00132230
.type func_00132230, %function
func_00132230:
mov r1, r0
ldr r0, [r0]
ldrb r2, [r1, #3]
bic r0, r0, #0xff000000
orr r0, r0, r2, lsl #24
lsrs r0, r0, #8
bne 1f
ldr r0, [r1, #4]
ldrb r1, [r1, #7]
bic r0, r0, #0xff000000
orr r0, r0, r1, lsl #24
1:
bx lr
.size func_00132230, . - func_00132230

.thumb

.section .text.func_00105DCC, "ax", %progbits
.balign 4
.global func_00105DCC
.type func_00105DCC, %function
.thumb_func
func_00105DCC:
ldr r2, [r0, #16]
cmp r1, #0
beq 1f
movs r1, #1
orrs r2, r1
str r2, [r0, #16]
bx lr
1:
lsrs r1, r2, #1
lsls r1, r1, #1
str r1, [r0, #16]
bx lr
.size func_00105DCC, . - func_00105DCC

.section .text.func_00105DE2, "ax", %progbits
.balign 4
.global func_00105DE2
.type func_00105DE2, %function
.thumb_func
func_00105DE2:
ldr r2, [r0, #16]
movs r3, #4
cmp r1, #0
beq 1f
orrs r2, r3
b 2f
1:
bics r2, r3
2:
str r2, [r0, #16]
bx lr
.size func_00105DE2, . - func_00105DE2

.section .text.func_00105ED8, "ax", %progbits
.balign 4
.global func_00105ED8
.type func_00105ED8, %function
.thumb_func
func_00105ED8:
ldr r2, [r0, #16]
cmp r1, #0
beq 1f
movs r1, #1
orrs r2, r1
str r2, [r0, #16]
bx lr
1:
lsrs r1, r2, #1
lsls r1, r1, #1
str r1, [r0, #16]
bx lr
.size func_00105ED8, . - func_00105ED8

.section .text.func_00105EEE, "ax", %progbits
.balign 4
.global func_00105EEE
.type func_00105EEE, %function
.thumb_func
func_00105EEE:
ldr r2, [r0, #16]
movs r3, #4
cmp r1, #0
beq 1f
orrs r2, r3
b 2f
1:
bics r2, r3
2:
str r2, [r0, #16]
bx lr
.size func_00105EEE, . - func_00105EEE

.section .text.func_00105FEA, "ax", %progbits
.balign 4
.global func_00105FEA
.type func_00105FEA, %function
.thumb_func
func_00105FEA:
ldr r2, [r0]
adds r1, r2, r1
str r1, [r0]
bx lr
.size func_00105FEA, . - func_00105FEA
