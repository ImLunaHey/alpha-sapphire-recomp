.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_00337AB8, "ax", %progbits
.balign 4
.global func_00337AB8
.type func_00337AB8, %function
func_00337AB8:
    ldr r1,[r0]
    mov r12,#0
    ldr r1,[r1,#24]
    cmp r1,#0
    bxle lr
    push {r4,r5}
    mov r4,#0
    1:
    ldr r1,[r0]
    ldr r2,[r1,#28]!
    cmp r2,#0
    addne r1,r1,r2
    moveq r1,r4
    cmp r1,#0
    beq 4f
    add r1,r1,r12,lsl #4
    ldr r2,[r1,#40]!
    cmp r2,#0
    moveq r1,r4
    addne r1,r1,r2
    4:
    ldr r2,[r1,#8]
    cmp r2,#7
    bne 3f
    ldr r2,[r1,#16]
    mov r3,#0
    cmp r2,#0
    ble 3f
    2:
    ldr r5,[r1,#20]
    add r2,r1,#20
    cmp r5,#0
    addne r2,r2,r5
    moveq r2,r4
    ldr r5,[r2,r3,lsl #2]!
    add r3,r3,#1
    cmp r5,#0
    addne r2,r2,r5
    moveq r2,r4
    str r4,[r2,#28]
    ldr r2,[r1,#16]
    cmp r2,r3
    bgt 2b
    3:
    ldr r1,[r0]
    add r12,r12,#1
    ldr r1,[r1,#24]
    cmp r1,r12
    bgt 1b
    pop {r4,r5}
    bx lr
.size func_00337AB8, .-func_00337AB8

.section .text.func_003AACD8, "ax", %progbits
.balign 4
.global func_003AACD8
.type func_003AACD8, %function
func_003AACD8:
    cmp r2,#0
    ble 5f
    vldmia r1,{s0-s2}
    add r3,r0,#12
    cmp r2,#1
    vstmia r3,{s0-s2}
    mov r3,#1
    vstmia r0,{s0-s2}
    ble 5f
    1:
    add r12,r3,r3,lsl #1
    vldr s1,[r0,#12]
    add r12,r1,r12,lsl #2
    vldr s0,[r12]
    vcmpe.f32 s1,s0
    vmrs APSR_nzcv,fpscr
    vstrlo s0,[r0,#12]
    blo 2f
    vldr s1,[r0]
    vcmpe.f32 s1,s0
    vmrs APSR_nzcv,fpscr
    vmovle.f32 s0,s1
    vstr s0,[r0]
    2:
    vldr s1,[r0,#16]
    vldr s0,[r12,#4]
    vcmpe.f32 s1,s0
    vmrs APSR_nzcv,fpscr
    vstrlo s0,[r0,#16]
    blo 3f
    vldr s1,[r0,#4]
    vcmpe.f32 s1,s0
    vmrs APSR_nzcv,fpscr
    vmovle.f32 s0,s1
    vstr s0,[r0,#4]
    3:
    vldr s1,[r0,#20]
    vldr s0,[r12,#8]
    vcmpe.f32 s1,s0
    vmrs APSR_nzcv,fpscr
    vstrlo s0,[r0,#20]
    blo 4f
    vldr s1,[r0,#8]
    vcmpe.f32 s1,s0
    vmrs APSR_nzcv,fpscr
    vmovle.f32 s0,s1
    vstr s0,[r0,#8]
    4:
    add r3,r3,#1
    cmp r3,r2
    blt 1b
    5:
    bx lr
.size func_003AACD8, .-func_003AACD8

.section .text.func_003C8BC4, "ax", %progbits
.balign 4
.global func_003C8BC4
.type func_003C8BC4, %function
func_003C8BC4:
    push {r4,r5,r6}
    add r12,r0,#2048
    ldr r6,[r0,#2060]
    ldr r4,[sp,#16]
    ldr r5,[sp,#12]
    add r12,r12,#12
    vldmia r1,{s0-s3}
    add r1,r0,r6,lsl #4
    add r1,r1,#12
    vstmia r1,{s0-s3}
    ldr r1,[r0,#2060]
    vldmia r2,{s0-s2}
    add r1,r1,r1,lsl #1
    add r1,r0,r1,lsl #2
    add r1,r1,#524
    vstmia r1,{s0-s2}
    ldr r2,[r0,#2060]
    ldr r1,[r3,#4]
    vldr s0,[r3]
    vldr s1,[r3,#8]
    add r2,r2,r2,lsl #1
    add r2,r0,r2,lsl #2
    vstr s0,[r2,#908]
    str r1,[r2,#912]
    vstr s1,[r2,#916]
    ldr r3,[r12]
    ldm r5,{r1,r2,r5}
    add r3,r3,r3,lsl #1
    add r3,r0,r3,lsl #2
    add r6,r3,#1296
    str r1,[r3,#1292]
    stm r6,{r2,r5}
    ldr r5,[r12]
    ldm r4,{r1,r2,r3}
    add r4,r5,r5,lsl #1
    add r0,r0,r4,lsl #2
    add r4,r0,#1680
    str r1,[r0,#1676]
    stm r4,{r2,r3}
    ldr r0,[r12]
    add r0,r0,#1
    mov r1,r0,asr #31
    add r1,r0,r1,lsr #27
    bic r1,r1,#31
    sub r0,r0,r1
    str r0,[r12]
    pop {r4,r5,r6}
    bx lr
.size func_003C8BC4, .-func_003C8BC4

.section .text.func_004AAFAC, "ax", %progbits
.balign 4
.global func_004AAFAC
.type func_004AAFAC, %function
func_004AAFAC:
    push {r4,r5,r6}
    ldr r3,[r0,#24]
    ldr r4,[r1]
    mov r12,r3
    ldr r2,[r3,#4]
    cmp r2,#0
    beq 2f
    1:
    ldr r6,[r2,#16]
    cmp r6,r4
    movhs r3,r2
    ldrhs r2,[r2,#8]
    ldrlo r2,[r2,#12]
    cmp r2,#0
    bne 1b
    2:
    cmp r3,r12
    beq 3f
    ldr r2,[r3,#16]
    cmp r2,r4
    bls 4f
    3:
    mov r3,r12
    4:
    cmp r3,r12
    bne 9f
    ldr r2,[r0,#92]
    mov r3,r2
    ldr r1,[r2,#4]
    cmp r1,#0
    movne r12,r4
    beq 5f
    4:
    ldr r5,[r1,#16]
    cmp r5,r12
    movhs r2,r1
    ldrhs r1,[r1,#8]
    ldrlo r1,[r1,#12]
    cmp r1,#0
    bne 4b
    5:
    cmp r2,r3
    beq 6f
    ldr r1,[r2,#16]
    cmp r1,r4
    bls 7f
    6:
    mov r2,r3
    7:
    cmp r2,r3
    moveq r0,#0
    beq 10f
    9:
    mov r0,#1
    10:
    pop {r4,r5,r6}
    bx lr
.size func_004AAFAC, .-func_004AAFAC

.section .text.func_004AB108, "ax", %progbits
.balign 4
.global func_004AB108
.type func_004AB108, %function
func_004AB108:
    push {r4,r5,r6,r7,r8,r9}
    mov r8,#0
    ldr r4,[r0,#20]
    mov r5,r4
    ldr r3,[r4,#4]
    cmp r3,#0
    beq 2f
    ldr r7,[r1,#8]
    ldrh r6,[r1,#6]
    1:
    ldrh r12,[r3,#22]
    ldr r9,[r3,#24]
    subs r12,r12,r6
    sbcs r12,r9,r7
    ldrlt r3,[r3,#12]
    movge r5,r3
    ldrge r3,[r3,#8]
    cmp r3,#0
    bne 1b
    2:
    cmp r5,r4
    beq 3f
    ldr r12,[r1,#8]
    ldrh r6,[r1,#6]
    ldrh r1,[r5,#22]
    ldr r3,[r5,#24]
    subs r1,r6,r1
    sbcs r1,r12,r3
    movge r4,r5
    3:
    ldr r1,[r0,#20]
    cmp r4,r1
    beq 4f
    ldr r1,[r0,#32]
    add r0,r4,#48
    add r5,r4,#64
    str r1,[r4,#80]
    add r1,r4,#52
    ldr r0,[r0,#28]
    ldm r1,{r1,r3,r12}
    add r7,r2,#4
    ldm r5,{r4,r5,r6}
    mov r8,#1
    str r0,[r2,#28]
    add r2,r2,#16
    stm r7,{r1,r3,r12}
    stm r2,{r4,r5,r6}
    4:
    mov r0,r8
    pop {r4,r5,r6,r7,r8,r9}
    bx lr
.size func_004AB108, .-func_004AB108

.section .text.func_004C2430, "ax", %progbits
.balign 4
.global func_004C2430
.type func_004C2430, %function
func_004C2430:
    push {r4,r5,r6,r7,r8}
    cmp r3,#0
    mov r4,#1
    ldr r6,[sp,#20]
    ldr r0,[r1,#4]
    ldr r5,[r2,#4]
    add r7,r1,#8
    add r12,r2,#8
    ble 4f
    sub r2,r12,#4
    tst r3,#1
    sub r12,r7,#4
    beq 2f
    bic r4,r5,r0
    tst r4,#1
    beq 1f
    ldr r4,[r2,#4]
    orr r0,r0,#1
    str r4,[r12,#4]
    1:
    mov r4,#2
    add r2,r2,#4
    add r12,r12,#4
    2:
    movs r3,r3,asr #1
    beq 4f
    6:
    bic r7,r5,r0
    tst r7,r4
    beq 3f
    ldr r7,[r2,#4]
    orr r0,r0,r4
    str r7,[r12,#4]
    3:
    bic r7,r5,r0
    mov r4,r4,lsl #1
    tst r7,r4
    beq 5f
    ldr r7,[r2,#8]
    orr r0,r0,r4
    str r7,[r12,#8]
    5:
    subs r3,r3,#1
    mov r4,r4,lsl #1
    add r2,r2,#8
    add r12,r12,#8
    bne 6b
    4:
    bics r2,r6,r0
    str r0,[r1,#4]
    pop {r4,r5,r6,r7,r8}
    moveq r0,#1
    movne r0,#0
    bx lr
.size func_004C2430, .-func_004C2430

.section .note.GNU-stack, "", %progbits
