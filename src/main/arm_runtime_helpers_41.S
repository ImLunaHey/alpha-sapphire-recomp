.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_004C58DC, "ax", %progbits
.p2align 2
.global func_004C58DC
.type func_004C58DC, %function
func_004C58DC:
    push {r4,r5,r6,lr}
    mov r5,r0
    ldr r3,[r0,#12]
    cmp r3,#0
    beq 5f
    and r0,r3,#1
    cmp r0,#0
    ldrhi r4,[r5,#4]
    mov r12,#24
    mov r2,#0
    bls 2f
1:
    rsb r6,r2,r2,lsl #3
    add r6,r12,r6,lsl #2
    ldr r6,[r4,r6]
    cmp r6,r1
    bne 6f
    mov r0,r2
7:
    pop {r4,r5,r6,pc}
6:
    add r2,r2,#1
    cmp r0,r2
    bhi 1b
2:
    cmp r3,r0
    ldrhi r2,[r5,#4]
    movhi r6,#52
    bls 5f
3:
    rsb r4,r0,r0,lsl #3
    add r5,r12,r4,lsl #2
    ldr r5,[r2,r5]
    cmp r5,r1
    beq 7b
    add r4,r6,r4,lsl #2
    ldr r4,[r2,r4]
    cmp r4,r1
    bne 4f
    add r0,r0,#1
    pop {r4,r5,r6,pc}
4:
    add r0,r0,#2
    cmp r3,r0
    bhi 3b
5:
    mov r2,#0
    mov r1,r2
    mov r0,r2
    mov r0,r0
    mvn r0,#0
    pop {r4,r5,r6,pc}
.size func_004C58DC, .-func_004C58DC

.section .text.func_004D0014, "ax", %progbits
.p2align 2
.global func_004D0014
.type func_004D0014, %function
func_004D0014:
    vldr s1,[r1]
    vldr s2,[r0]
    vsub.f32 s1,s1,s2
    vabs.f32 s1,s1
    vcmpe.f32 s1,s0
    vmrs APSR_nzcv,fpscr
    bhi 1f
    vldr s1,[r1,#4]
    vldr s2,[r0,#4]
    vsub.f32 s1,s1,s2
    vabs.f32 s1,s1
    vcmpe.f32 s1,s0
    vmrs APSR_nzcv,fpscr
    bhi 1f
    vldr s1,[r1,#8]
    vldr s2,[r0,#8]
    vsub.f32 s1,s1,s2
    vabs.f32 s1,s1
    vcmpe.f32 s1,s0
    vmrs APSR_nzcv,fpscr
    bhi 1f
    vldr s1,[r1,#12]
    vldr s2,[r0,#12]
    vsub.f32 s1,s1,s2
    vabs.f32 s1,s1
    vcmpe.f32 s0,s1
    vmrs APSR_nzcv,fpscr
    movge r0,#1
    bge 2f
1:
    mov r0,#0
2:
    bx lr
.size func_004D0014, .-func_004D0014

.section .text.func_004D42C8, "ax", %progbits
.p2align 2
.global func_004D42C8
.type func_004D42C8, %function
func_004D42C8:
    push {r4,r5,r6}
    mov r5,r0
    mov r0,#0
    ldr r3,[r5,#120]
    ldr r12,[r5,#128]
    b 5f
1:
    ldr r4,[r3,#8]
    cmp r1,r4
    bhi 4f
    cmp r2,#0
    beq 6f
    cmp r0,#0
    beq 3f
    cmp r2,#1
    beq 2f
    cmp r2,#2
    beq 7f
    b 4f
6:
    pop {r4,r5,r6}
    mov r0,r3
    bx lr
2:
    ldr r6,[r0,#8]
    cmp r6,r4
    bls 4f
    b 3f
7:
    ldr r6,[r0,#8]
    cmp r6,r4
    bcs 4f
3:
    mov r0,r3
4:
    add r3,r3,r12
    ldr r3,[r3,#4]
5:
    ldr r6,[r5,#128]
    add r4,r5,#116
    sub r3,r3,r12
    sub r4,r4,r6
    cmp r3,r4
    bne 1b
    pop {r4,r5,r6}
    bx lr
.size func_004D42C8, .-func_004D42C8

.section .text.func_004E41C8, "ax", %progbits
.p2align 2
.global func_004E41C8
.type func_004E41C8, %function
func_004E41C8:
    ldr r0,[r0,#8]
    mov r3,#0
1:
    add r12,r0,r3,lsl #4
    ldr r12,[r12,#4]
    cmp r12,r2
    bne 2f
    cmp r3,#12
    beq 5f
    ldrb r2,[r0,r3,lsl #4]!
    cmp r2,#0
    movne r0,#3
    bne 4f
    b 3f
2:
    add r3,r3,#1
    cmp r3,#12
    blt 1b
    b 5f
3:
    ldrb r2,[r0,#1]
    cmp r2,#0
    movne r0,#2
    bne 4f
    ldrb r0,[r0,#2]
    cmp r0,#0
    movne r0,#1
4:
    cmp r0,r1
    movls r0,#1
    bls 6f
5:
    mov r0,#0
6:
    bx lr
.size func_004E41C8, .-func_004E41C8

.section .text.func_004E9FA8, "ax", %progbits
.p2align 2
.global func_004E9FA8
.type func_004E9FA8, %function
func_004E9FA8:
    cmp r1,#0
    push {r4,lr}
    beq 1f
    cmp r1,#1
    beq 2f
    cmp r1,#2
    beq 3f
    mov r2,#0
    mov r1,r2
    mov r0,r2
    mov r0,r0
    mov r0,#0
    pop {r4,pc}
1:
    ldr r0,[r0,#52]
    and r0,r0,#128
    lsr r0,r0,#7
    pop {r4,pc}
2:
    ldr r0,[r0,#52]
    and r0,r0,#64
    lsr r0,r0,#6
    pop {r4,pc}
3:
    ldr r0,[r0,#52]
    and r0,r0,#32
    lsr r0,r0,#5
    pop {r4,pc}
.size func_004E9FA8, .-func_004E9FA8

.section .text.func_004EAC54, "ax", %progbits
.p2align 2
.global func_004EAC54
.type func_004EAC54, %function
func_004EAC54:
    cmp r1,#0
    push {r4,lr}
    ldreq r0,[r0,#4]
    lsleq r0,r0,#23
    beq 1f
    cmp r1,#1
    ldreq r0,[r0,#4]
    lsleq r0,r0,#20
    beq 1f
    cmp r1,#2
    ldreq r0,[r0,#4]
    lsleq r0,r0,#17
    beq 1f
    cmp r1,#3
    ldreq r0,[r0,#4]
    lsleq r0,r0,#14
    beq 1f
    cmp r1,#4
    ldreq r0,[r0,#4]
    lsleq r0,r0,#11
    beq 1f
    cmp r1,#5
    ldreq r0,[r0,#4]
    lsleq r0,r0,#8
    beq 1f
    mov r2,#0
    mov r1,r2
    mov r0,r2
    mov r0,r0
    mov r0,#0
    pop {r4,pc}
1:
    lsr r0,r0,#29
    pop {r4,pc}
.size func_004EAC54, .-func_004EAC54

.section .text.func_004F4C90, "ax", %progbits
.p2align 2
.global func_004F4C90
.type func_004F4C90, %function
func_004F4C90:
    sub r1,r1,#1
    vmov.f64 d1,d0
    add r2,r0,r1,lsl #3
    vldr d0,[r2]
    bics r2,r1,#6
    beq 2f
1:
    vmov.f64 d3,d0
    sub r1,r1,#1
    add r2,r0,r1,lsl #3
    vldr d2,[r2]
    bics r2,r1,#6
    vmov.f64 d0,d2
    vmla.f64 d0,d3,d1
    bne 1b
2:
    cmp r1,#2
    beq 5f
    cmp r1,#4
    beq 4f
    cmp r1,#6
    bxne lr
    vldr d2,[r0,#40]
    vldr d3,[r0,#32]
    vmla.f64 d2,d0,d1
    vmov.f64 d0,d3
    vmla.f64 d0,d2,d1
4:
    vldr d2,[r0,#24]
    vldr d3,[r0,#16]
    vmla.f64 d2,d0,d1
    vmov.f64 d0,d3
    vmla.f64 d0,d2,d1
5:
    vldr d2,[r0,#8]
    vmov.f64 d3,d0
    vldr d0,[r0]
    vmla.f64 d2,d3,d1
    vmla.f64 d0,d2,d1
    bx lr
.size func_004F4C90, .-func_004F4C90

.section .text.func_00505F2C, "ax", %progbits
.p2align 2
.global func_00505F2C
.type func_00505F2C, %function
func_00505F2C:
    ldr r2,[r0,#32]
    ldr r12,[r0,#40]
    add r2,r2,#64
    cmp r2,r12
    movgt r0,#3
    bxgt lr
    ldr r2,[r0,#8]
    ldr r3,[r0]
    cmp r2,#0
    ldreq r2,[r3,#16]
    push {r4}
    ldr r4,[r0,#88]
    addeq r2,r2,r3
    sub r3,r12,#4
    add r12,r4,#1
    str r3,[r0,#40]
    str r12,[r0,#88]
    add r4,r0,#32
    str r1,[r2,r3]
    ldm r4,{r2,r4,r12}
    ldr r1,[r0,#44]
    ldr r3,[r0,#72]
    sub r2,r2,r4
    sub r1,r1,r12
    cmp r3,r1
    strcc r1,[r0,#72]
    ldr r1,[r0,#76]
    cmp r1,r2
    strcc r2,[r0,#76]
    pop {r4}
    mov r0,#0
    bx lr
.size func_00505F2C, .-func_00505F2C

.section .text.func_0052B610, "ax", %progbits
.p2align 2
.global func_0052B610
.type func_0052B610, %function
func_0052B610:
    push {r4}
    ldrd r2,[r0,#8]
    mov r12,#1
    ldr r4,[r2,#16]
    sub r4,r4,r3
    cmp r4,#4
    bcc 1f
    ldr r12,[r2,#12]
    ldr r2,[r2,#24]
    add r2,r2,r12
    add r2,r2,r3
    ldr r3,[r2]
    ldrb r2,[r2,#3]
    bic r3,r3,#0xff000000
    orr r2,r3,r2,lsl #24
    str r2,[r1]
    ldr r1,[r0,#12]
    add r1,r1,#4
    str r1,[r0,#12]
    pop {r4}
    mov r0,#1
    bx lr
1:
    mov r2,#0
    strb r12,[r0,#4]
    str r2,[r1]
    pop {r4}
    mov r0,r2
    bx lr
.size func_0052B610, .-func_0052B610

.section .text.func_0052B680, "ax", %progbits
.p2align 2
.global func_0052B680
.type func_0052B680, %function
func_0052B680:
    push {r4}
    ldrd r2,[r0,#8]
    mov r12,#1
    ldr r4,[r2,#16]
    sub r4,r4,r3
    cmp r4,#2
    bcc 1f
    ldr r12,[r2,#12]
    ldr r2,[r2,#24]
    add r2,r2,r12
    add r2,r2,r3
    ldrh r2,[r2]
    strh r2,[r1]
    ldr r1,[r0,#12]
    add r1,r1,#2
    str r1,[r0,#12]
    pop {r4}
    mov r0,#1
    bx lr
1:
    mov r2,#0
    strb r12,[r0,#4]
    strh r2,[r1]
    pop {r4}
    mov r0,r2
    bx lr
.size func_0052B680, .-func_0052B680

.section .text.func_0053F700, "ax", %progbits
.p2align 2
.global func_0053F700
.type func_0053F700, %function
func_0053F700:
    push {r4}
    ldr r3,[r2]
    ldr r12,[r2]
    ldr r3,[r3,#32]
    ldr r12,[r12,#28]
    cmp r3,#0
    str r12,[r0]
    strne r12,[r3,#28]
    ldr r4,[r2]
    mov r12,#0
    str r12,[r4,#32]
    ldr r4,[r0]
    cmp r4,#0
    strne r3,[r4,#32]
    ldr r4,[r2]
    str r12,[r4,#28]
    ldr r12,[r1,#4]
    ldr r4,[r2]
    cmp r12,r4
    ldreq r0,[r0]
    streq r0,[r1,#4]
    ldr r0,[r1,#8]
    ldr r2,[r2]
    cmp r0,r2
    streq r3,[r1,#8]
    ldr r0,[r1,#16]
    sub r0,r0,#1
    str r0,[r1,#16]
    pop {r4}
    bx lr
.size func_0053F700, .-func_0053F700

.section .text.func_0056B030, "ax", %progbits
.p2align 2
.global func_0056B030
.type func_0056B030, %function
func_0056B030:
    vldr s1,.Lblend_lower_endpoint_threshold_41
    vcmpe.f32 s0,s1
    vmrs APSR_nzcv,fpscr
    bhi 1f
    ldrd r2,[r1]
    ldr r1,[r1,#8]
    str r1,[r0,#8]
    strd r2,[r0]
    bx lr
1:
    vmov r3,s0
    cmp r3,#0x3f800000
    blt 2f
    ldm r2,{r1,r3}
    ldr r2,[r2,#8]
    str r2,[r0,#8]
    stm r0,{r1,r3}
    bx lr
2:
    vldr s3,[r2]
    vldr s6,[r1]
    vldr s2,[r2,#4]
    vldr s5,[r1,#4]
    vldr s1,[r2,#8]
    vldr s4,[r1,#8]
    vsub.f32 s3,s3,s6
    vsub.f32 s2,s2,s5
    vsub.f32 s1,s1,s4
    vmul.f32 s3,s3,s0
    vmul.f32 s2,s2,s0
    vmul.f32 s1,s1,s0
    vadd.f32 s0,s6,s3
    vadd.f32 s2,s5,s2
    vadd.f32 s1,s4,s1
    vstr s0,[r0]
    vstr s2,[r0,#4]
    vstr s1,[r0,#8]
    bx lr
.size func_0056B030, .-func_0056B030
.Lblend_lower_endpoint_threshold_41:
    .word blend_lower_endpoint_threshold_41

.section .text.func_0056E0BC, "ax", %progbits
.p2align 2
.global func_0056E0BC
.type func_0056E0BC, %function
func_0056E0BC:
    push {r4,r5,r6}
    ldr r3,[r1,#16]
    mov r4,r3
    ldr r1,[r3,#4]
    cmp r1,#0
    ldrne r5,[r2]
    beq 4f
1:
    ldr r6,[r1,#16]
    add r12,r1,#16
    cmp r6,r5
    bcc 3f
    bhi 2f
    ldr r12,[r12,#4]
    ldr r6,[r2,#4]
    cmp r12,r6
    bcc 3f
2:
    mov r3,r1
    ldr r1,[r1,#8]
    b 5f
3:
    ldr r1,[r1,#12]
5:
    cmp r1,#0
    bne 1b
4:
    cmp r3,r4
    beq 6f
    ldr r12,[r2]
    ldr r5,[r3,#16]
    add r1,r3,#16
    cmp r12,r5
    bcc 6f
    bhi 7f
    ldr r2,[r2,#4]
    ldr r1,[r1,#4]
    cmp r2,r1
    bcs 7f
6:
    str r4,[r0]
    pop {r4,r5,r6}
    bx lr
7:
    str r3,[r0]
    pop {r4,r5,r6}
    bx lr
.size func_0056E0BC, .-func_0056E0BC
