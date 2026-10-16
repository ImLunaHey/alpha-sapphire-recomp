.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro function name
.section .text.\name, "ax", %progbits
.global \name
.type \name, %function
.balign 4
\name:
.endm

.macro endfunction name
.size \name, . - \name
.endm

function func_0019D73C
push	{r4, r5, r6, r7, r8, r9, sl, fp, ip, lr}
mov	ip, #0
mov	fp, #0
mov	sl, #0
ldr	r9, [r1]
ldr	r8, [r2]
umull	r5, r4, r9, r8
ldr	r7, [r1, #4]
ldr	r6, [r2]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0]
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1]
ldr	r8, [r2, #4]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r2]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #4]
mov	fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #4]
ldr	r8, [r2, #4]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1]
ldr	r6, [r2, #8]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
ldr	r8, [r2]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #8]
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r2, #4]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #4]
ldr	r8, [r2, #8]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1]
ldr	r6, [r2, #12]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #12]
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #4]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r2, #8]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #4]
ldr	r6, [r2, #12]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1]
ldr	r8, [r2, #16]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #16]
mov	fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2, #4]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #8]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r2, #12]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #4]
ldr	r6, [r2, #16]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1]
ldr	r8, [r2, #20]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #20]
mov	sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #4]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #8]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
ldr	r8, [r2, #12]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r2, #16]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #4]
ldr	r8, [r2, #20]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1]
ldr	r6, [r2, #24]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #24]
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2, #4]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #8]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #12]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
ldr	r8, [r2, #16]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r2, #20]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #4]
ldr	r8, [r2, #24]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1]
ldr	r6, [r2, #28]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2, #4]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #28]
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2, #8]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #12]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #16]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #12]
ldr	r8, [r2, #20]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r2, #24]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #4]
ldr	r8, [r2, #28]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #8]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
str	sl, [r0, #32]
mov	sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r2, #12]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2, #16]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2, #20]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #24]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r2, #28]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #12]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0, #36]	@ 0x24
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r2, #16]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r2, #20]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r2, #24]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r2, #28]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2, #16]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #40]	@ 0x28
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2, #20]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #24]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r2, #28]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r2, #20]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #44]	@ 0x2c
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r2, #24]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r2, #28]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #24]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0, #48]	@ 0x30
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r2, #28]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r2, #28]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #52]	@ 0x34
mov	fp, #0
umull	r4, r5, r7, r6
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #56]	@ 0x38
str	ip, [r0, #60]	@ 0x3c
pop	{r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
endfunction func_0019D73C

function func_0019DDC8
push	{r4, r5, r6, r7, r8, r9, sl, fp, ip, lr}
mov	ip, #0
mov	fp, #0
mov	sl, #0
ldr	r9, [r1]
umull	r5, r4, r9, r9
ldr	r7, [r1, #4]
ldr	r6, [r1]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0]
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
ldr	r8, [r1]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #4]
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #4]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #12]
ldr	r8, [r1]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #8]
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #8]
ldr	r6, [r1, #4]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r1]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #12]
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r1, #4]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #8]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r9
ldr	r7, [r1, #20]
ldr	r6, [r1]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #16]
mov	fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r1, #4]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
ldr	r6, [r1, #8]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r1]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #20]
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
ldr	r6, [r1, #4]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #16]
ldr	r8, [r1, #8]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #12]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #28]
ldr	r8, [r1]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #24]
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r1, #4]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r1, #8]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
ldr	r6, [r1, #12]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r1, #4]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #28]
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r1, #8]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r1, #12]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #16]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #28]
ldr	r8, [r1, #8]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #32]
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r1, #12]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #20]
ldr	r8, [r1, #16]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
ldr	r6, [r1, #12]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
str	ip, [r0, #36]	@ 0x24
mov	ip, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #24]
ldr	r8, [r1, #16]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #20]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #28]
ldr	r8, [r1, #16]
adds	fp, fp, r4
adcs	sl, sl, r5
adcs	ip, ip, #0
str	fp, [r0, #40]	@ 0x28
mov	fp, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
ldr	r6, [r1, #20]
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
adds	sl, sl, r5
adcs	ip, ip, r4
adcs	fp, fp, #0
umull	r4, r5, r7, r6
ldr	r9, [r1, #28]
ldr	r8, [r1, #20]
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #44]	@ 0x2c
mov	sl, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #24]
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
adds	ip, ip, r5
adcs	fp, fp, r4
adcs	sl, sl, #0
umull	r4, r5, r7, r7
ldr	r9, [r1, #28]
ldr	r8, [r1, #24]
adds	ip, ip, r4
adcs	fp, fp, r5
adcs	sl, sl, #0
str	ip, [r0, #48]	@ 0x30
mov	ip, #0
umull	r5, r4, r9, r8
ldr	r7, [r1, #28]
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
adds	fp, fp, r5
adcs	sl, sl, r4
adcs	ip, ip, #0
str	fp, [r0, #52]	@ 0x34
mov	fp, #0
umull	r4, r5, r7, r7
adds	sl, sl, r4
adcs	ip, ip, r5
adcs	fp, fp, #0
str	sl, [r0, #56]	@ 0x38
str	ip, [r0, #60]	@ 0x3c
pop	{r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
endfunction func_0019DDC8
