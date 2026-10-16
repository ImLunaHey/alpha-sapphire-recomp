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

function func_004D17E8
    ldr r0,[r0,#8]
    ldrh r0,[r0,#4]
    and r0,r0,#4
    lsr r0,r0,#2
    bx lr
endfunction func_004D17E8

function func_004D373C
    ldrb r0,[r0,#24]
    cmp r0,#6
    moveq r0,#1
    movne r0,#0
    bx lr
endfunction func_004D373C

function func_004D4364
    push {r4,r5,r6,r7,r8,r9}
    mov r7,r0
    mov r0,#0
    ldr r5,[r7,#128]
    ldr r12,[r7,#120]
    sub r8,r2,#1
    sub r12,r12,r5
    b 8f
1:  ldr r9,[r12,#8]
    cmp r9,r1
    blo 7f
    ldr r6,[r12,#12]
    add r6,r6,#16
    adds r4,r6,r12
    add r6,r4,r2
    sub r6,r6,#1
    bic r6,r6,r8
    subs r4,r6,r4
    add r4,r4,r1
    cmp r4,r9
    bhi 7f
    cmp r3,#0
    beq 6f
    cmp r0,#0
    beq 5f
    cmp r3,#1
    beq 3f
    cmp r3,#2
    beq 4f
    b 7f
6:  pop {r4,r5,r6,r7,r8,r9}
    mov r0,r12
    bx lr
3:  ldr r4,[r0,#8]
    cmp r4,r9
    bls 7f
    b 5f
4:  ldr r4,[r0,#8]
    cmp r4,r9
    bhs 7f
5:  mov r0,r12
7:  add r12,r12,r5
    ldr r12,[r12,#4]
    sub r12,r12,r5
8:  ldr r4,[r7,#128]
    add r6,r7,#116
    sub r4,r6,r4
    cmp r12,r4
    bne 1b
    pop {r4,r5,r6,r7,r8,r9}
    bx lr
endfunction func_004D4364

function func_004D84E0
    ldrh r0,[r0,#12]
    cmp r0,#221
    beq 2f
    bgt 1f
    cmp r0,#219
    cmpne r0,#220
    beq 2f
3:  mov r0,#0
    bx lr
1:  cmp r0,#222
    subne r0,r0,#256
    subsne r0,r0,#142
    bne 3b
2:  mov r0,#1
    bx lr
endfunction func_004D84E0

function func_004D8D18
    ldr r2,[r0,#20]
    cmp r2,#0
    moveq r0,#0
    bxeq lr
    push {r4,lr}
    ldrh r0,[r0,#6]
    cmp r0,r1
    addhi r0,r1,r1,lsl #1
    addhi r0,r2,r0,lsl #3
    bhi 1f
    mov r2,#0
    mov r1,r2
    mov r0,r2
    mov r0,r0
    mov r0,#0
1:  pop {r4,pc}
endfunction func_004D8D18

function func_004D9360
    ldrb r2,[r0,#2584]
    cmp r2,r1
    moveq r0,#0
    bxeq lr
    ldrb r2,[r0,#2585]
    cmp r2,r1
    moveq r0,#1
    bxeq lr
    ldrb r2,[r0,#2586]
    cmp r2,r1
    moveq r0,#2
    bxeq lr
    push {r4,lr}
    ldrb r0,[r0,#2587]
    cmp r0,r1
    moveq r0,#3
    beq 1f
    mov r2,#0
    mov r1,r2
    mov r0,r2
    mov r0,r0
    mov r0,#0
1:  pop {r4,pc}
endfunction func_004D9360

function func_004DC490
    ldr r0,[r0,#8]
    bics r0,r1,r0
    moveq r0,#1
    movne r0,#0
    bx lr
endfunction func_004DC490

function func_004E87F8
    push {r4,lr}
    cmp r1,#32
    mov r4,#0
    bhs 1f
    add r1,r1,r1,lsl #5
    add r0,r0,r1,lsl #3
    ldr r0,[r0,#4]
    tst r0,#1
    movne r4,#1
    b 2f
1:  mov r2,#0
    mov r1,r2
    mov r0,r2
    mov r0,r0
2:  mov r0,r4
    pop {r4,pc}
endfunction func_004E87F8

function func_004E89F0
    mov r1,#0
1:  add r2,r0,r1,lsl #1
    add r2,r2,#1024
    ldrh r3,[r2,#4]
    lsls r12,r3,#17
    beq 2f
    tst r3,#32768
    beq 4f
2:  ldrh r2,[r2,#6]
    lsls r3,r2,#17
    beq 3f
    tst r2,#32768
    beq 4f
3:  add r1,r1,#2
    cmp r1,#32
    blo 1b
    mov r0,#0
    bx lr
4:  mov r0,#1
    bx lr
endfunction func_004E89F0

function func_004EC2D0
    push {r4,r5,r6,r7,r8,r9,r10,r11,r12,lr}
    mov r4,#1
    mov r5,r0
    mov r7,r1
    mov r8,r2
    mov r11,r4
    mov r10,#0
    add r9,r4,#720
1:  ldr r0,[r5,#28]
    cmp r4,r0,lsr #1
    blo 2f
    mov r2,#0
    mov r1,r2
    mov r0,r2
    mov r0,r0
    mov r6,#0
    nop
    b 3f
2:  ldr r1,[r5,#24]
    add r0,r1,r4,lsl #1
    ldrh r6,[r0]
3:  ldr r1,[r5,#28]
    cmp r4,r1,lsr #1
    blo 5f
    mov r2,#0
    mov r1,r2
    mov r0,r2
    mov r0,r0
4:  mov r0,r10
6:  cmp r6,r7
    cmpeq r8,r0
    bne 7f
    mov r0,r4
    pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
5:  ldr r1,[r5,#24]
    add r0,r1,r4,lsl #1
    ldrh r0,[r0]
    cmp r0,#0
    movne r0,r11
    bne 6b
    b 4b
7:  add r4,r4,#1
    cmp r4,r9
    ble 1b
    mov r2,#0
    mov r1,r2
    mov r0,r2
    mov r0,r0
    mov r0,#0
    pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
endfunction func_004EC2D0

function func_004EC398
    push {r4,lr}
    ldr r2,[r0,#28]
    cmp r1,r2,lsr #1
    blo 1f
    mov r2,#0
    mov r1,r2
    mov r0,r2
    mov r0,r0
2:  mov r0,#0
    pop {r4,pc}
1:  ldr r0,[r0,#24]
    add r0,r0,r1,lsl #1
    ldrh r0,[r0]
    cmp r0,#0
    movne r0,#1
    beq 2b
    pop {r4,pc}
endfunction func_004EC398

function func_004EDA64
    push {r4,lr}
    ldr r2,[r0,#8]
    cmp r1,r2,lsr #1
    blo 1f
    mov r2,#0
    mov r1,r2
    mov r0,r2
    mov r0,r0
    mov r0,#0
    pop {r4,pc}
1:  ldr r0,[r0,#4]
    add r0,r0,r1,lsl #1
    ldrh r0,[r0]
    pop {r4,pc}
endfunction func_004EDA64

function func_00505AB4
    ldr r3,[r0,#8]
    ldr r12,[r0]
    cmp r3,#0
    ldreq r3,[r12,#16]
    addeq r3,r3,r12
    ldr r12,[r0,#32]
    cmp r12,r1
    bgt 1f
    ldr r12,[r0,#40]
    cmp r12,r1
    bgt 2f
1:  cmp r1,#0
    ldrge r0,[r0,#44]
    cmpge r0,r1
    bgt 3f
2:  mov r0,#0
    str r0,[r2]
    mov r0,#5
    bx lr
3:  add r0,r3,r1
    str r0,[r2]
    mov r0,#0
    bx lr
endfunction func_00505AB4

function func_0053FF04
    and r1,r0,#261120
    lsr r1,r1,#10
    cmp r1,#17
    bne 1f
    lsl r0,r0,#22
    lsr r0,r0,#22
    cmp r0,#100
    blt 1f
    cmp r0,#179
    movle r0,#1
    ble 2f
1:  mov r0,#0
2:  bx lr
endfunction func_0053FF04

function func_0054E91C
    ldr r2,[r1]
    str r2,[r0]
    ldr r2,[r1,#4]
    str r2,[r0,#4]
    ldr r2,[r1,#8]
    str r2,[r0,#8]
    ldr r3,[r1,#16]
    str r3,[r0,#16]
    ldr r3,[r1,#20]
    str r3,[r0,#20]
    ldr r2,[r1,#24]
    str r2,[r0,#24]
    ldr r2,[r1,#32]
    str r2,[r0,#32]
    ldr r2,[r1,#36]
    str r2,[r0,#36]
    ldr r1,[r1,#40]
    str r1,[r0,#40]
    bx lr
endfunction func_0054E91C

.section .note.GNU-stack,"",%progbits
