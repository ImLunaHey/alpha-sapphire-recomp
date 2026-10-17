.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.global func_0014E348
.global func_00178A6C
.global func_00301FBC
.global func_003918E8

.section .text.func_00136740,"ax",%progbits
.balign 4
.global func_00136740
.type func_00136740, %function
func_00136740:
.Lfunc_00136740_0:
	ldr	r0, [pc, #56]
.Lfunc_00136740_4:
	mov	r1, #512
.Lfunc_00136740_8:
	push	{r4, lr}
.Lfunc_00136740_c:
	bl	func_00301FBC
.size func_00136740, .-func_00136740

.section .text.func_00176610,"ax",%progbits
.balign 4
.global func_00176610
.type func_00176610, %function
func_00176610:
.Lfunc_00176610_0:
	push	{r4, lr}
.Lfunc_00176610_4:
	bl	func_00178A6C
.Lfunc_00176610_8:
	ldr	r0, [r0, #12]
.Lfunc_00176610_c:
	pop	{r4, pc}
.size func_00176610, .-func_00176610

.section .text.func_001D6C74,"ax",%progbits
.balign 4
.global func_001D6C74
.type func_001D6C74, %function
func_001D6C74:
.Lfunc_001D6C74_0:
	push	{r4, lr}
.Lfunc_001D6C74_4:
	mov	r4, r0
.Lfunc_001D6C74_8:
	mov	r1, #536
.Lfunc_001D6C74_c:
	bl	func_00301FBC
.size func_001D6C74, .-func_001D6C74

.section .text.func_001F02C4,"ax",%progbits
.balign 4
.global func_001F02C4
.type func_001F02C4, %function
func_001F02C4:
.Lfunc_001F02C4_0:
	push	{r4, lr}
.Lfunc_001F02C4_4:
	mov	r4, r0
.Lfunc_001F02C4_8:
	mov	r1, #120
.Lfunc_001F02C4_c:
	bl	func_00301FBC
.size func_001F02C4, .-func_001F02C4

.section .text.func_0038CD1C,"ax",%progbits
.balign 4
.global func_0038CD1C
.type func_0038CD1C, %function
func_0038CD1C:
.Lfunc_0038CD1C_0:
	push	{r4, lr}
.Lfunc_0038CD1C_4:
	bl	func_003918E8
.Lfunc_0038CD1C_8:
	mov	r0, #1
.Lfunc_0038CD1C_c:
	pop	{r4, pc}
.size func_0038CD1C, .-func_0038CD1C

.section .text.func_003A38A4,"ax",%progbits
.balign 4
.global func_003A38A4
.type func_003A38A4, %function
func_003A38A4:
.Lfunc_003A38A4_0:
	push	{r4, r5, r6, lr}
.Lfunc_003A38A4_4:
	mov	r4, r0
.Lfunc_003A38A4_8:
	mov	r1, #9216
.Lfunc_003A38A4_c:
	bl	func_00301FBC
.size func_003A38A4, .-func_003A38A4

.section .text.func_0040ECC4,"ax",%progbits
.balign 4
.global func_0040ECC4
.type func_0040ECC4, %function
func_0040ECC4:
.Lfunc_0040ECC4_0:
	push	{r4, lr}
.Lfunc_0040ECC4_4:
	mov	r4, r0
.Lfunc_0040ECC4_8:
	mov	r1, #80
.Lfunc_0040ECC4_c:
	bl	func_00301FBC
.size func_0040ECC4, .-func_0040ECC4

.section .text.func_00410BD0,"ax",%progbits
.balign 4
.global func_00410BD0
.type func_00410BD0, %function
func_00410BD0:
.Lfunc_00410BD0_0:
	push	{r4, lr}
.Lfunc_00410BD0_4:
	mov	r4, r0
.Lfunc_00410BD0_8:
	mov	r1, #108
.Lfunc_00410BD0_c:
	bl	func_00301FBC
.size func_00410BD0, .-func_00410BD0

.section .text.func_0043D504,"ax",%progbits
.balign 4
.global func_0043D504
.type func_0043D504, %function
func_0043D504:
.Lfunc_0043D504_0:
	push	{r4, r5, r6, lr}
.Lfunc_0043D504_4:
	sub	sp, sp, #16
.Lfunc_0043D504_8:
	mov	r4, r0
.Lfunc_0043D504_c:
	bl	func_0014E348
.size func_0043D504, .-func_0043D504

.section .text.func_00441C68,"ax",%progbits
.balign 4
.global func_00441C68
.type func_00441C68, %function
func_00441C68:
.Lfunc_00441C68_0:
	push	{r4, r5, r6, lr}
.Lfunc_00441C68_4:
	mov	r4, r0
.Lfunc_00441C68_8:
	mov	r5, r1
.Lfunc_00441C68_c:
	bl	func_0014E348
.size func_00441C68, .-func_00441C68

.section .text.func_0045BECC,"ax",%progbits
.balign 4
.global func_0045BECC
.type func_0045BECC, %function
func_0045BECC:
.Lfunc_0045BECC_0:
	push	{r4, r5, r6, r7, lr}
.Lfunc_0045BECC_4:
	sub	sp, sp, #1024
.Lfunc_0045BECC_8:
	sub	sp, sp, #580
.Lfunc_0045BECC_c:
	bl	func_0014E348
.size func_0045BECC, .-func_0045BECC

.section .text.func_0052A420,"ax",%progbits
.balign 4
.global func_0052A420
.type func_0052A420, %function
func_0052A420:
.Lfunc_0052A420_0:
	push	{r4, lr}
.Lfunc_0052A420_4:
	mov	r4, r0
.Lfunc_0052A420_8:
	mov	r1, #88
.Lfunc_0052A420_c:
	bl	func_00301FBC
.size func_0052A420, .-func_0052A420
