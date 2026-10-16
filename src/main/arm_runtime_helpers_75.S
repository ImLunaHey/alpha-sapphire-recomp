.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00111AFC,"ax",%progbits
.balign 4
.global func_00111AFC
.type func_00111AFC, %function
func_00111AFC:
	ldr r0, [r0, #4]
	ldr r2, [r0, #172]
	cmp r2, r1
	bls 1f
	ldr r0, [r0, #168]
	add r2, r1, r1, lsl #1
	add r1, r2, r1, lsl #3
	ldrb r2, [r0, r1, lsl #2]
	cmp r2, #0
	beq 1f
	mov r2, #8
	add r1, r2, r1, lsl #2
	ldr r0, [r0, r1]
	vstr s0, [r0, #16]
1:	bx lr
.size func_00111AFC, .-func_00111AFC

.section .text.func_001E400C,"ax",%progbits
.balign 4
.global func_001E400C
.type func_001E400C, %function
func_001E400C:
	push {r4, lr}
	mov r4, r0
	str r1, [r0, #2808]
	ldrb r0, [r0, #2104]
	cmp r0, #0
	bne 1f
	cmp r1, #19
	ble 1f
	mov r2, #0
	mov r1, r2
	mov r0, r2
	mov r0, r0
	mov r0, #0
	str r0, [r4, #2808]
1:	pop {r4, pc}
.size func_001E400C, .-func_001E400C

.section .text.func_001F968C,"ax",%progbits
.balign 4
.global func_001F968C
.type func_001F968C, %function
func_001F968C:
	ldr r2, [r0, #12]
	str r1, [r0]
	cmp r2, #0
	beq 1f
	ldr r3, [r0, #8]
	sub r1, r1, r3
	lsr r1, r1, #3
	str r1, [r2]
1:	ldr r1, [r0]
	mov r2, #0
	str r1, [r0, #4]
	str r2, [r0, #12]
	str r1, [r0, #8]!
	str r2, [r0, #8]
	bx lr
.size func_001F968C, .-func_001F968C

.section .text.func_00242368,"ax",%progbits
.balign 4
.global func_00242368
.type func_00242368, %function
func_00242368:
	ldr r3, [r0, #32]
	ldr ip, [r0, #28]
	ldr r2, [r0, #20]
	add r3, r3, #1
	add ip, ip, r1
	str r3, [r0, #32]
	str ip, [r0, #28]
	ldr r3, [r0, #24]
	cmp r2, r1
	movcs r2, r1
	cmp r3, r1
	movcs r1, r3
	str r2, [r0, #20]
	str r1, [r0, #24]
	bx lr
.size func_00242368, .-func_00242368

.section .text.func_0024DC94,"ax",%progbits
.balign 4
.global func_0024DC94
.type func_0024DC94, %function
func_0024DC94:
	ldr r2, [r0, #44]
	ldr r1, [r2, #4]
	cmp r1, r2
	beq 1f
	ldrd r2, [r1]
	str r2, [r3]
	ldrd r2, [r1]
	str r3, [r2, #4]
	ldr r2, [r0, #48]
	sub r2, r2, #1
	str r2, [r0, #48]
	ldr r2, [r0, #32]
	str r2, [r1]
	str r1, [r0, #32]
1:	bx lr
.size func_0024DC94, .-func_0024DC94

.section .text.func_0032A71C,"ax",%progbits
.balign 4
.global func_0032A71C
.type func_0032A71C, %function
func_0032A71C:
	ldr r2, [r0]
	cmp r2, #0
	beq 1f
	ldr r3, [r2, #8]
	mov r1, #0
	cmp r3, r0
	streq r1, [r2, #8]
	ldr r2, [r0]
	ldr r3, [r2, #12]
	cmp r3, r0
	streq r1, [r2, #12]
	ldr r2, [r0]
	cmp r2, #0
	strne r1, [r0]
1:	bx lr
.size func_0032A71C, .-func_0032A71C

.section .text.func_0032BB4C,"ax",%progbits
.balign 4
.global func_0032BB4C
.type func_0032BB4C, %function
func_0032BB4C:
	ldr r1, [r0]
	cmp r1, #0
	beq 2f
	add r1, r1, #8192
	add r1, r1, #2528
	mov r2, #0
	ldr r3, [r1]
	cmp r3, r0
	bne 1f
	str r2, [r1]
	ldr r1, [r0]
	cmp r1, #0
	beq 2f
1:	str r2, [r0]
2:	bx lr
.size func_0032BB4C, .-func_0032BB4C

.section .text.func_00353D58,"ax",%progbits
.balign 4
.global func_00353D58
.type func_00353D58, %function
func_00353D58:
	ldr r2, [r0, #272]
	add r3, r0, #272
	cmp r2, r3
	beq 2f
1:	ldr r3, [r2, #-20]
	cmp r3, r1
	bne 3f
	sub r0, r2, #24
	bx lr
3:	ldr r2, [r2]
	add r3, r0, #272
	cmp r2, r3
	bne 1b
2:	mov r0, #0
	bx lr
.size func_00353D58, .-func_00353D58

.section .text.func_00397720,"ax",%progbits
.balign 4
.global func_00397720
.type func_00397720, %function
func_00397720:
	ldr r2, [r0, #324]
	cmp r2, #0
	beq 2f
1:	mov r3, r2
	ldr r2, [r2, #4]
	cmp r2, #0
	bne 1b
	cmp r3, #0
	strne r1, [r3, #4]
	bne 3f
2:	str r1, [r0, #324]
3:	mov r2, #0
	mov r0, #1
	str r2, [r1, #4]
	bx lr
.size func_00397720, .-func_00397720

.section .text.func_00397A1C,"ax",%progbits
.balign 4
.global func_00397A1C
.type func_00397A1C, %function
func_00397A1C:
	ldr r2, [r0, #328]
	cmp r2, #0
	beq 2f
1:	mov r3, r2
	ldr r2, [r2, #4]
	cmp r2, #0
	bne 1b
	cmp r3, #0
	strne r1, [r3, #4]
	bne 3f
2:	str r1, [r0, #328]
3:	mov r2, #0
	mov r0, #1
	str r2, [r1, #4]
	bx lr
.size func_00397A1C, .-func_00397A1C

.section .text.func_00398B94,"ax",%progbits
.balign 4
.global func_00398B94
.type func_00398B94, %function
func_00398B94:
	rsb r1, r1, r1, lsl #5
	ldr r0, [r0, #108]
	add ip, r1, r1, lsl #1
	mov r3, #3584
	add r0, r0, ip, lsl #2
	and r1, r3, r2, lsl #9
	ldr r2, [r0, #240]
	bic r2, r2, #3584
	orr r1, r1, r2
	orr r1, r1, #2
	str r1, [r0, #240]
	ldr r1, [r0, #244]
	orr r1, r1, #1
	str r1, [r0, #244]
	bx lr
.size func_00398B94, .-func_00398B94

.section .text.func_00398BD0,"ax",%progbits
.balign 4
.global func_00398BD0
.type func_00398BD0, %function
func_00398BD0:
	rsb r1, r1, r1, lsl #5
	push {r4}
	ldr r0, [r0, #108]
	add r4, r1, r1, lsl #1
	mov ip, #384
	add r0, r0, r4, lsl #2
	add r0, r0, r2, lsl #3
	and r1, ip, r3, lsl #7
	ldr r2, [r0, #248]
	bic r2, r2, #384
	orr r1, r1, r2
	orr r1, r1, #2
	str r1, [r0, #248]
	pop {r4}
	bx lr
.size func_00398BD0, .-func_00398BD0

.section .text.func_00398C0C,"ax",%progbits
.balign 4
.global func_00398C0C
.type func_00398C0C, %function
func_00398C0C:
	rsb r1, r1, r1, lsl #5
	push {r4}
	ldr r0, [r0, #108]
	add r4, r1, r1, lsl #1
	mov ip, #1536
	add r0, r0, r4, lsl #2
	add r0, r0, r2, lsl #3
	and r1, ip, r3, lsl #9
	ldr r2, [r0, #248]
	bic r2, r2, #1536
	orr r1, r1, r2
	orr r1, r1, #2
	str r1, [r0, #248]
	pop {r4}
	bx lr
.size func_00398C0C, .-func_00398C0C

.section .text.func_003993F8,"ax",%progbits
.balign 4
.global func_003993F8
.type func_003993F8, %function
func_003993F8:
	rsb r1, r1, r1, lsl #5
	push {r4}
	ldr r0, [r0, #108]
	add r4, r1, r1, lsl #1
	mov ip, #2048
	add r0, r0, r4, lsl #2
	add r0, r0, r2, lsl #3
	and r1, ip, r3, lsl #11
	ldr r2, [r0, #248]
	bic r2, r2, #2048
	orr r1, r1, r2
	orr r1, r1, #4
	str r1, [r0, #248]
	pop {r4}
	bx lr
.size func_003993F8, .-func_003993F8

.section .text.func_00399434,"ax",%progbits
.balign 4
.global func_00399434
.type func_00399434, %function
func_00399434:
	rsb r1, r1, r1, lsl #5
	push {r4}
	ldr r0, [r0, #108]
	add r4, r1, r1, lsl #1
	mov ip, #114688
	add r0, r0, r4, lsl #2
	add r0, r0, r2, lsl #3
	and r1, ip, r3, lsl #14
	ldr r2, [r0, #248]
	bic r2, r2, #114688
	orr r1, r1, r2
	orr r1, r1, #4
	str r1, [r0, #248]
	pop {r4}
	bx lr
.size func_00399434, .-func_00399434

.section .text.func_0039954C,"ax",%progbits
.balign 4
.global func_0039954C
.type func_0039954C, %function
func_0039954C:
	rsb r1, r1, r1, lsl #5
	ldr r0, [r0, #108]
	add ip, r1, r1, lsl #1
	mov r3, #983040
	add r0, r0, ip, lsl #2
	and r1, r3, r2, lsl #16
	ldr r2, [r0, #240]
	bic r2, r2, #983040
	orr r1, r1, r2
	orr r1, r1, #2
	str r1, [r0, #240]
	ldr r1, [r0, #244]
	orr r1, r1, #1
	str r1, [r0, #244]
	bx lr
.size func_0039954C, .-func_0039954C

.section .text.func_00399A44,"ax",%progbits
.balign 4
.global func_00399A44
.type func_00399A44, %function
func_00399A44:
	rsb r1, r1, r1, lsl #5
	ldr r0, [r0, #108]
	add ip, r1, r1, lsl #1
	mov r3, #251658240
	add r0, r0, ip, lsl #2
	and r1, r3, r2, lsl #24
	ldr r2, [r0, #240]
	bic r2, r2, #251658240
	orr r1, r1, r2
	orr r1, r1, #2
	str r1, [r0, #240]
	ldr r1, [r0, #244]
	orr r1, r1, #1
	str r1, [r0, #244]
	bx lr
.size func_00399A44, .-func_00399A44

.section .text.func_003B7190,"ax",%progbits
.balign 4
.global func_003B7190
.type func_003B7190, %function
func_003B7190:
	sub r1, r0, #328
	cmp r1, #97
	subhi r1, r0, #512
	subhi r1, r1, #106
	cmphi r1, #2
	subhi r1, r0, #512
	subhi r1, r1, #178
	cmphi r1, #4
	bls 1f
	sub r1, r0, #512
	subs r1, r1, #225
	movne r0, #0
	bne 2f
1:	mov r0, #1
2:	bx lr
.size func_003B7190, .-func_003B7190

.section .text.func_003BB4D4,"ax",%progbits
.balign 4
.global func_003BB4D4
.type func_003BB4D4, %function
func_003BB4D4:
	push {r4}
	ldm r0, {r1, ip}
	ldr r2, [r0, #12]
	ldr r3, [r0, #8]
	eor r1, r1, r1, lsl #11
	eor r4, r2, r2, lsr #19
	eor r1, r1, r1, lsr #8
	eor r1, r1, r4
	str r1, [r0, #12]
	str r2, [r0, #8]
	str r3, [r0, #4]
	str ip, [r0]
	pop {r4}
	mov r0, r1
	bx lr
.size func_003BB4D4, .-func_003BB4D4

.section .text.func_00410B4C,"ax",%progbits
.balign 4
.global func_00410B4C
.type func_00410B4C, %function
func_00410B4C:
	ldr r2, [r0, #12]
	ldrh r3, [r1]
	mvn ip, #129024
	bic r2, r2, #1792
	bic r2, r2, #254
	and r3, ip, r3, lsl #1
	orr r2, r2, r3
	str r2, [r0, #12]
	ldrh r1, [r1, #2]
	mov r3, #260096
	bic r2, r2, #260096
	and r1, r3, r1, lsl #11
	orr r1, r1, r2
	str r1, [r0, #12]
	bx lr
.size func_00410B4C, .-func_00410B4C

.section .text.func_00417674,"ax",%progbits
.balign 4
.global func_00417674
.type func_00417674, %function
func_00417674:
	ldrh r1, [r0, #2]
	add r1, r1, #1
	uxth r1, r1
	cmp r1, #99
	strh r1, [r0, #2]
	bls 1f
	ldrh r2, [r0]
	mov r1, #0
	strh r1, [r0, #2]
	add r2, r2, #1
	uxth r2, r2
	cmp r2, #900
	strh r2, [r0]
	strhcs r1, [r0]
1:	bx lr
.size func_00417674, .-func_00417674

.section .text.func_00437DEC,"ax",%progbits
.balign 4
.global func_00437DEC
.type func_00437DEC, %function
func_00437DEC:
	push {r4, lr}
	mov r4, r0
	ldr r0, [r0, #24]
	cmp r0, #0
	bne 1f
	mov r2, #0
	mov r1, r2
	mov r0, r2
	mov r0, r0
	ldr r0, [r4, #24]
	cmp r0, #0
	beq 2f
1:	ldr r0, [r4, #24]
	ldr r0, [r0, #128]
2:	pop {r4, pc}
.size func_00437DEC, .-func_00437DEC

.section .text.func_0046C5C0,"ax",%progbits
.balign 4
.global func_0046C5C0
.type func_0046C5C0, %function
func_0046C5C0:
	mov r1, #0
	strb r1, [r0, #101]
	ldr r1, [r0, #64]
	add r2, r0, #64
	cmp r1, r2
	movne ip, #1
	beq 2f
1:	ldrb r2, [r1, #1072]
	ldr r1, [r1]
	cmp r2, #0
	add r2, r0, #64
	strbne ip, [r0, #101]
	cmp r1, r2
	bne 1b
2:	bx lr
.size func_0046C5C0, .-func_0046C5C0

.section .text.func_004A9DB8,"ax",%progbits
.balign 4
.global func_004A9DB8
.type func_004A9DB8, %function
func_004A9DB8:
	mov r1, #0
1:	ldrb r2, [r0, r1]
	cmp r2, #0
	bne 2f
	add r2, r0, r1
	ldrb r2, [r2, #1]
	cmp r2, #0
	beq 3f
2:	mov r0, #0
	bx lr
3:	add r1, r1, #2
	cmp r1, #8
	blt 1b
	mov r0, #1
	bx lr
.size func_004A9DB8, .-func_004A9DB8
