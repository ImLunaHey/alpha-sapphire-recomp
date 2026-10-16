.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_004A8D18, "ax", %progbits
.balign 4
.global func_004A8D18
.type func_004A8D18, %function
func_004A8D18:
    push {r4,r5,r6}
    mov r6,#320
    ldrb r3,[r0,#11]
    ldrb r4,[r0,#10]
    ldrb r5,[r0]
    ldrb r12,[r0,#12]
    lsl r3,r3,#10
    orr r4,r3,r4,lsl #20
    add r3,r6,r5,lsl #4
    orr r12,r12,r4
    orr r3,r3,#0x80000000
    str r12,[r1],#4
    orr r3,r3,#0x3f0000
    str r3,[r1],#4
    ldrb r3,[r0,#14]
    ldrb r12,[r0,#13]
    ldrb r4,[r0,#15]
    mov r2,#0
    lsl r3,r3,#10
    orr r3,r3,r12,lsl #20
    orr r3,r3,r4
    str r3,[r1],#4
    ldrb r3,[r0,#5]
    ldrb r12,[r0,#4]
    ldrb r4,[r0,#6]
    lsl r3,r3,#10
    orr r3,r3,r12,lsl #20
    orr r3,r3,r4
    str r3,[r1],#4
    ldrb r3,[r0,#8]
    ldrb r12,[r0,#7]
    ldrb r0,[r0,#9]
    lsl r3,r3,#10
    orr r3,r3,r12,lsl #20
    orr r0,r0,r3
    stmia r1!,{r0,r2}
    mov r0,r1
    pop {r4,r5,r6}
    bx lr
.size func_004A8D18, .-func_004A8D18

.section .text.func_004B71D0, "ax", %progbits
.balign 4
.global func_004B71D0
.type func_004B71D0, %function
func_004B71D0:
    vmov r0,s0
    add r3,r0,#0x40000000
    adds r3,r3,#0x800000
    beq 3f
    vldr s1,[r2,#12]
    vldr s2,[r2,#28]
    vldr s3,[r2,#44]
    ldr r2,[r1,#60]
    mov r0,#4
    bics r0,r0,r2
    beq 2f
    vmul.f32 s1,s1,s0
    vmul.f32 s2,s2,s0
    vmul.f32 s3,s3,s0
    vldr s5,[r1,#12]
    vldr s4,[r1,#28]
    vldr s6,[r1,#44]
    orr r0,r2,#0x800
    vadd.f32 s1,s5,s1
    vadd.f32 s0,s4,s2
    vadd.f32 s2,s6,s3
    vstr s1,[r1,#12]
    vstr s0,[r1,#28]
    vstr s2,[r1,#44]
1:
    str r0,[r1,#60]
3:
    bx lr
2:
    vmul.f32 s4,s1,s0
    vmul.f32 s1,s2,s0
    vmul.f32 s0,s3,s0
    bic r0,r2,#4
    orr r0,r0,#0x800
    vstr s4,[r1,#12]
    vstr s1,[r1,#28]
    vstr s0,[r1,#44]
    b 1b
.size func_004B71D0, .-func_004B71D0

.section .text.func_004B725C, "ax", %progbits
.balign 4
.global func_004B725C
.type func_004B725C, %function
func_004B725C:
    vmov r0,s0
    add r3,r0,#0x40000000
    adds r3,r3,#0x800000
    beq 3f
    ldr r3,[r1,#60]
    mov r0,#16
    bics r0,r0,r3
    beq 2f
    vldr s1,[r1]
    vldr s2,[r2]
    vmla.f32 s1,s2,s0
    vstr s1,[r1]
    vldr s1,[r1,#4]
    vldr s2,[r2,#4]
    vmla.f32 s1,s2,s0
    vstr s1,[r1,#4]
    vldr s1,[r1,#8]
    vldr s2,[r2,#8]
    vmla.f32 s1,s2,s0
    vstr s1,[r1,#8]
    vldr s1,[r1,#16]
    vldr s2,[r2,#16]
    vmla.f32 s1,s2,s0
    vstr s1,[r1,#16]
    vldr s1,[r1,#20]
    vldr s2,[r2,#20]
    vmla.f32 s1,s2,s0
    vstr s1,[r1,#20]
    vldr s2,[r2,#24]
    vldr s1,[r1,#24]
    vmla.f32 s1,s2,s0
    vstr s1,[r1,#24]
1:
    bic r0,r3,#16
    orr r0,r0,#0x800
    str r0,[r1,#60]
3:
    bx lr
2:
    vldr s1,[r2]
    vmul.f32 s1,s1,s0
    vstr s1,[r1]
    vldr s1,[r2,#4]
    vmul.f32 s1,s1,s0
    vstr s1,[r1,#4]
    vldr s1,[r2,#8]
    vmul.f32 s1,s1,s0
    vstr s1,[r1,#8]
    vldr s1,[r2,#16]
    vmul.f32 s1,s1,s0
    vstr s1,[r1,#16]
    vldr s1,[r2,#20]
    vmul.f32 s1,s1,s0
    vstr s1,[r1,#20]
    vldr s1,[r2,#24]
    vmul.f32 s0,s1,s0
    vstr s0,[r1,#24]
    b 1b
.size func_004B725C, .-func_004B725C

.section .text.func_004B7614, "ax", %progbits
.balign 4
.global func_004B7614
.type func_004B7614, %function
func_004B7614:
    vmov r0,s0
    add r3,r0,#0x40000000
    adds r3,r3,#0x800000
    beq 3f
    ldr r12,[r1,#60]
    mov r3,#8
    add r0,r1,#48
    bics r3,r3,r12
    beq 2f
    vldr s2,[r2,#48]
    vldr s1,[r2,#52]
    vldr s3,[r2,#56]
    vmul.f32 s2,s2,s0
    vmul.f32 s1,s1,s0
    vmul.f32 s0,s3,s0
    vldr s3,[r0]
    vadd.f32 s2,s3,s2
    vstr s2,[r0]
    vldr s2,[r0,#4]
    vadd.f32 s1,s2,s1
    vstr s1,[r0,#4]
    vldr s1,[r0,#8]
    vadd.f32 s0,s1,s0
1:
    vstr s0,[r0,#8]
    ldr r0,[r1,#60]
    bic r0,r0,#8
    orr r0,r0,#0x800
    str r0,[r1,#60]
3:
    bx lr
2:
    vldr s1,[r2,#48]
    vmul.f32 s1,s1,s0
    vstr s1,[r0]
    vldr s1,[r2,#52]
    vmul.f32 s1,s1,s0
    vstr s1,[r0,#4]
    vldr s1,[r2,#56]
    vmul.f32 s0,s1,s0
    b 1b
.size func_004B7614, .-func_004B7614

.section .text.func_004C3E9C, "ax", %progbits
.balign 4
.global func_004C3E9C
.type func_004C3E9C, %function
func_004C3E9C:
    ldr r0,[r0]
    ldr r0,[r0,#20]
    cmp r0,#0
    beq 1f
    cmp r0,#1
    beq 3f
    cmp r0,#2
    bne 6f
    b 4f
1:
    vldr s1,[r1,#16]
    vldr s0,[r2]
    add r0,r1,#16
    vcmp.f32 s1,s0
    vmrs APSR_nzcv,fpscr
    bne 2f
    vldr s1,[r0,#4]
    vldr s2,[r2,#4]
    vcmp.f32 s1,s2
    vmrs APSR_nzcv,fpscr
    beq 6f
2:
    vldr s1,[r2,#4]
    add r0,r1,#16
    mov r2,#1
    vstmia r0,{s0-s1}
    strb r2,[r1,#36]
    b 6f
3:
    vldr s0,[r2]
    vldr s1,[r1,#24]
    vcmp.f32 s1,s0
    vmrs APSR_nzcv,fpscr
    beq 6f
    vstr s0,[r1,#24]
    mov r2,#1
    strb r2,[r1,#36]
    b 6f
4:
    vldr s1,[r1,#28]
    vldr s0,[r2]
    add r0,r1,#28
    vcmp.f32 s1,s0
    vmrs APSR_nzcv,fpscr
    bne 5f
    vldr s1,[r0,#4]
    vldr s2,[r2,#4]
    vcmp.f32 s1,s2
    vmrs APSR_nzcv,fpscr
    beq 6f
5:
    vldr s1,[r2,#4]
    add r0,r1,#28
    mov r2,#1
    vstmia r0,{s0-s1}
    strb r2,[r1,#36]
6:
    mov r0,#1
    strb r0,[r1,#36]
    bx lr
.size func_004C3E9C, .-func_004C3E9C

.section .text.func_004D5B8C, "ax", %progbits
.balign 4
.global func_004D5B8C
.type func_004D5B8C, %function
func_004D5B8C:
    push {r4,r5,r6,r7,r8,r9,r10,r11,r12,lr}
    mov r5,r0
    mov r8,r1
    mov r10,r2
    mov r9,#0
    ldr r0,[r0,#4]
    cmp r0,#0
    movhi r11,#4
    bls 5f
1:
    ldr r1,[r5,#8]
    add r0,r9,r9,lsl #2
    add r6,r11,r0,lsl #2
    ldr r0,[r1,r6]
    cmp r0,#0
    beq 4f
    ldr r1,[r0]
    cmp r1,r10
    bne 4f
    ldrsh r0,[r0,#10]
    mov r4,#0
    cmp r0,#0
    bls 4f
2:
    ldr r0,[r5,#8]
    mov r7,#0
    ldr r0,[r0,r6]
    ldr r1,[r0,#24]
    ldrsh r2,[r0,#10]
    add r1,r1,r0
    cmp r2,r4
    ldrhi r1,[r1,r4,lsl #2]
    addhi r7,r1,r0
    bhi 3f
    mov r2,#0
    mov r1,r2
    mov r0,r2
    mov r0,r0
3:
    ldr r1,[r7]
    mov r0,r7
    cmp r1,r8
    beq 6f
    ldr r0,[r5,#8]
    add r4,r4,#1
    ldr r0,[r0,r6]
    ldrsh r0,[r0,#10]
    cmp r0,r4
    bhi 2b
4:
    ldr r0,[r5,#4]
    add r9,r9,#1
    cmp r0,r9
    bhi 1b
5:
    mov r0,#0
6:
    pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
.size func_004D5B8C, .-func_004D5B8C

.section .text.func_004D6E90, "ax", %progbits
.balign 4
.global func_004D6E90
.type func_004D6E90, %function
func_004D6E90:
    push {r4,r5,r6,r7,r8,r9,r10,r11,r12,lr}
    mov r5,r0
    mov r8,r1
    mov r10,r2
    mov r9,#0
    ldr r0,[r0,#4]
    cmp r0,#0
    movhi r11,#4
    bls 5f
1:
    ldr r1,[r5,#8]
    add r0,r9,r9,lsl #2
    add r6,r11,r0,lsl #2
    ldr r0,[r1,r6]
    cmp r0,#0
    beq 4f
    ldr r1,[r0]
    cmp r1,r10
    bne 4f
    ldrsh r0,[r0,#14]
    mov r4,#0
    cmp r0,#0
    bls 4f
2:
    ldr r0,[r5,#8]
    mov r7,#0
    ldr r0,[r0,r6]
    ldr r1,[r0,#32]
    ldrsh r2,[r0,#14]
    add r1,r1,r0
    cmp r2,r4
    ldrhi r1,[r1,r4,lsl #2]
    addhi r7,r1,r0
    bhi 3f
    mov r2,#0
    mov r1,r2
    mov r0,r2
    mov r0,r0
3:
    ldr r1,[r7]
    mov r0,r7
    cmp r1,r8
    beq 6f
    ldr r0,[r5,#8]
    add r4,r4,#1
    ldr r0,[r0,r6]
    ldrsh r0,[r0,#14]
    cmp r0,r4
    bhi 2b
4:
    ldr r0,[r5,#4]
    add r9,r9,#1
    cmp r0,r9
    bhi 1b
5:
    mov r0,#0
6:
    pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
.size func_004D6E90, .-func_004D6E90

.section .note.GNU-stack, "", %progbits
