.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro function name
    .section .text.\name,"ax",%progbits
    .balign 4
    .global \name
    .type \name,%function
\name:
.endm

.macro endfunction name
    .size \name,.-\name
.endm

function func_004D4430
    push {r4,r5,r6,r7}
    mov r6,r0
    mov r0,#0
    ldr r12,[r6,#124]
    cmp r12,#0
    movle r12,#0
    ble 1f
    ldr r12,[r6,#116]
    cmp r12,#0
    ldrne r4,[r6,#128]
    subne r12,r12,r4
    beq 7f
1:  cmp r12,#0
    subne r7,r2,#1
    beq 7f
2:  ldr r4,[r12,#8]
    cmp r4,r1
    bcc 8f
    ldr r5,[r12,#12]
    add r5,r5,#16
    adds r2,r5,r12
    sub r5,r4,r1
    adds r2,r2,r5
    bic r5,r2,r7
    subs r2,r2,r5
    add r2,r2,r1
    cmp r2,r4
    bhi 8f
    cmp r3,#0
    beq 6f
    cmp r0,#0
    beq 5f
    cmp r3,#1
    beq 3f
    cmp r3,#2
    beq 4f
    b 8f
6:  mov r0,r12
7:  pop {r4,r5,r6,r7}
    bx lr
3:  ldr r2,[r0,#8]
    cmp r2,r4
    bls 8f
    b 5f
4:  ldr r2,[r0,#8]
    cmp r2,r4
    bcs 8f
5:  mov r0,r12
8:  ldr r4,[r6,#128]
    add r2,r6,#116
    ldr r12,[r4,r12]
    cmp r12,r2
    subsne r12,r12,r4
    bne 2b
    pop {r4,r5,r6,r7}
    bx lr
endfunction func_004D4430

function func_004D4D68
    push {r4,r5,r6}
    cmp r2,#0
    ldr r4,[sp,#12]
    mov r12,#0
    strne r12,[r2]
    cmp r3,#0
    strne r12,[r3]
    cmp r4,#0
    strne r12,[r4]
    mov r12,#0
1:  add r5,r0,r12,lsl #4
    ldr r6,[r5,#2064]
    cmp r6,#0
    beq 6f
    ldr r6,[r5,#2068]
    cmp r6,r1
    bne 7f
    ldr r5,[r5,#2072]
    cmp r5,#0
    beq 2f
    cmp r5,#1
    beq 4f
    b 7f
2:  cmp r2,#0
    beq 3f
    add r1,r0,r12,lsl #4
    ldr r1,[r1,#2076]
    str r1,[r2]
3:  cmp r4,#0
    beq 5f
9:  add r0,r0,r12,lsl #4
    ldr r0,[r0,#2064]
    str r0,[r4]
    b 5f
4:  cmp r3,#0
    beq 8f
    add r1,r0,r12,lsl #4
    ldr r1,[r1,#2076]
    str r1,[r3]
8:  cmp r4,#0
    bne 9b
5:  pop {r4,r5,r6}
    mov r0,#1
    bx lr
6:  ldr r6,[r5,#2072]
    cmp r6,#5
    ldreq r5,[r5,#2068]
    cmpeq r5,r1
    bne 7f
    pop {r4,r5,r6}
    mov r0,#2
    bx lr
7:  add r12,r12,#1
    cmp r12,#32
    bcc 1b
    pop {r4,r5,r6}
    mov r0,#0
    bx lr
endfunction func_004D4D68

function func_00506E20
    push {r4,r5,r6,r7,r8,r9,r10,r11,lr}
    cmp r0,#0
    mov lr,#0
    beq 4f
1:  ldr r12,[r0,#48]
    mov r5,#0
    mov r4,r5
    cmp r12,#0
    mov r6,r5
    beq 3f
2:  ldrb r7,[r12,#38]
    ldr r8,[r12,#24]
    ldr r10,[r12,#20]
    tst r7,#16
    ldrbeq r9,[r12,#37]
    ldr r11,[r12]
    addeq r8,r8,r9
    ldrb r9,[r12,#37]
    add r4,r4,r8
    ldr r8,[r2]
    add r10,r10,r9
    add r9,r9,r11
    cmp r8,#0
    add r5,r5,r10
    add r6,r6,r9
    ble 5f
    tst r7,#32
    beq 5f
    cmp r3,#1
    sub r4,r4,r8
    bne 5f
    bic r7,r7,#160
    orr r7,r7,#16
    strb r7,[r12,#38]
5:  ldr r12,[r12,#44]
    cmp r12,#0
    bne 2b
3:  ldrb r12,[r0,#36]
    tst r12,#2
    bne 6f
    ldr r12,[r0]
    cmp r12,r6
    bcs 6f
    mov lr,#12
    b 4f
6:  str r4,[r0,#24]
    sub r12,r1,r4
    str r5,[r0,#20]
    str r12,[r0,#4]
    ldr r0,[r0,#40]
    cmp r0,#0
    bne 1b
4:  mov r0,lr
    pop {r4,r5,r6,r7,r8,r9,r10,r11,pc}
endfunction func_00506E20

function func_00513494
    push {r4,r5,r6,r7}
    cmp r2,#0
    mov r3,#0
    ble 2f
1:  ldr r12,[r1,r3,lsl #2]
    mvn r12,r12
    adds r12,r12,#1
    str r12,[r0,r3,lsl #2]
    bne 2f
    add r3,r3,#1
    cmp r3,r2
    blt 1b
2:  add r5,r3,#4
    sub r3,r2,r5
    add r3,r3,#3
    asr r12,r3,#31
    add r3,r3,r12,lsr #30
    bic r6,r3,#3
    cmp r6,#0
    ble 4f
    add r3,r1,r5,lsl #2
    add r12,r0,r5,lsl #2
    sub r3,r3,#16
    sub r12,r12,#16
    asr r4,r6,#1
3:  ldr r7,[r3,#4]
    subs r4,r4,#1
    mvn r7,r7
    str r7,[r12,#4]
    ldr r7,[r3,#8]!
    mvn r7,r7
    str r7,[r12,#8]!
    bne 3b
    add r5,r5,r6
4:  sub r3,r5,#3
    sub r2,r2,r3
    cmp r2,#0
    ble 7f
    add r1,r1,r3,lsl #2
    add r3,r0,r3,lsl #2
    sub r0,r1,#4
    tst r2,#1
    sub r1,r3,#4
    beq 5f
    ldr r3,[r0,#4]!
    mvn r3,r3
    str r3,[r1,#4]!
5:  asrs r2,r2,#1
    beq 7f
6:  ldr r3,[r0,#4]
    subs r2,r2,#1
    mvn r3,r3
    str r3,[r1,#4]
    ldr r3,[r0,#8]!
    mvn r3,r3
    str r3,[r1,#8]!
    bne 6b
7:  pop {r4,r5,r6,r7}
    bx lr
endfunction func_00513494

function func_0052D8D4
    push {r4,r5,r6,r7,r8}
    ldr r6,[r0,#4]
    ldr r4,[r0,#8]
    mov r2,r6
    sub r3,r4,r2
    asr r3,r3,#3
    cmp r3,#0
    ldrhgt r7,[r1]
    ble 2f
1:  add r12,r3,r3,lsr #31
    asr r12,r12,#1
    add r5,r2,r12,lsl #3
    ldrh r8,[r5]
    cmp r8,r7
    subcc r3,r3,r12
    subcc r3,r3,#1
    addcc r2,r5,#8
    movcs r3,r12
    cmp r3,#0
    bgt 1b
2:  cmp r4,r2
    beq 3f
    ldrh r1,[r1]
    ldrh r3,[r2]
    cmp r3,r1
    movhi r2,r4
3:  cmp r4,r2
    moveq r0,#0
    beq 9f
    cmp r6,r4
    beq 8f
    add r1,r2,#8
    cmp r4,r1
    beq 7f
    sub r3,r4,r1
    asr r12,r3,#3
    cmp r12,#0
    ble 7f
    lsls r12,r3,#28
    sub r1,r1,#8
    sub r2,r2,#8
    bpl 5f
    add r1,r1,#8
    add r2,r2,#8
    ldm r1,{r4,r12}
    stm r2,{r4,r12}
5:  asrs r3,r3,#4
    beq 7f
6:  ldrd r4,r5,[r1,#8]
    mov r12,r2
    add r1,r1,#16
    strd r4,r5,[r12,#8]
    ldm r1,{r4,r12}
    add r2,r2,#16
    subs r3,r3,#1
    stm r2,{r4,r12}
    bne 6b
7:  ldr r1,[r0,#8]
    sub r1,r1,#8
    str r1,[r0,#8]
8:  mov r0,#1
9:  pop {r4,r5,r6,r7,r8}
    bx lr
endfunction func_0052D8D4
