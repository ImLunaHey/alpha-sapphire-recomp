.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro BEGIN_FUNCTION name
    .section .text.\name, "ax", %progbits
    .balign 4
    .global \name
    .type \name, %function
\name:
.endm

.macro END_FUNCTION name
    .size \name, .-\name
.endm

BEGIN_FUNCTION func_004E503C
    ldr r2,[r0,#32]!
    ldr r1,[r0,#4]
    mov r0,r2
    bx lr
END_FUNCTION func_004E503C

BEGIN_FUNCTION func_004E5400
    ldr r0,[r0,#48]
    and r0,r0,#3968
    lsr r0,r0,#7
    bx lr
END_FUNCTION func_004E5400

BEGIN_FUNCTION func_004E5CE4
    ldr r0,[r0]
    cmp r0,#0
    movne r0,#1
    bx lr
END_FUNCTION func_004E5CE4

BEGIN_FUNCTION func_004E5DA8
    ldr r0,[r0,#12]
    add r1,r1,r1,lsl #1
    add r0,r0,r1,lsl #2
    bx lr
END_FUNCTION func_004E5DA8

BEGIN_FUNCTION func_004E5EAC
    ldr r0,[r0,#4]
    and r0,r0,#28
    lsr r0,r0,#2
    bx lr
END_FUNCTION func_004E5EAC

BEGIN_FUNCTION func_004E6078
    add r0,r0,r1,lsl #2
    ldr r0,[r0,#16]
    bx lr
END_FUNCTION func_004E6078

BEGIN_FUNCTION func_004E60D8
    ldrd r0,[r0,#24]
    sub r0,r1,r0
    asr r0,r0,#3
    bx lr
END_FUNCTION func_004E60D8

BEGIN_FUNCTION func_004E65F0
    ldrh r0,[r0]
    bic r0,r0,#64512
    bx lr
END_FUNCTION func_004E65F0

BEGIN_FUNCTION func_004E6970
    ldr r0,[r0,#44]
    and r0,r0,#31457280
    lsr r0,r0,#21
    bx lr
END_FUNCTION func_004E6970

BEGIN_FUNCTION func_004E6AF8
    add r0,r0,r1,lsl #2
    ldr r0,[r0,#48]
    bx lr
END_FUNCTION func_004E6AF8

BEGIN_FUNCTION func_004E6B20
    ldrh r0,[r0]
    cmp r0,#900
    movcc r0,#1
    movcs r0,#0
    bx lr
END_FUNCTION func_004E6B20

BEGIN_FUNCTION func_004E6E80
    ldrb r1,[r0,#177]
    cmp r1,#0
    ldrne r0,[r0,#148]
    moveq r0,#0
    bx lr
END_FUNCTION func_004E6E80

BEGIN_FUNCTION func_004E7048
    ldrb r0,[r0,#195]
    cmp r0,#0
    moveq r0,#1
    movne r0,#0
    bx lr
END_FUNCTION func_004E7048

BEGIN_FUNCTION func_004E71E0
    ldrb r0,[r0,#195]
    cmp r0,#1
    movne r0,#0
    bx lr
END_FUNCTION func_004E71E0

BEGIN_FUNCTION func_004E71F0
    ldr r0,[r0,#92]
    and r0,r0,#2
    lsr r0,r0,#1
    bx lr
END_FUNCTION func_004E71F0

BEGIN_FUNCTION func_004E74B4
    ldr r0,[r0,#200]
    and r0,r0,#64
    lsr r0,r0,#6
    bx lr
END_FUNCTION func_004E74B4

BEGIN_FUNCTION func_004E76B0
    ldr r2,[r1,#86]
    str r2,[r0]
    ldrh r1,[r1,#90]
    strh r1,[r0,#4]
    bx lr
END_FUNCTION func_004E76B0

BEGIN_FUNCTION func_004E86B8
    add r0,r0,#768
    ldrh r0,[r0,#40]
    bx lr
END_FUNCTION func_004E86B8

BEGIN_FUNCTION func_004E8938
    add r0,r0,r1,lsl #2
    ldr r0,[r0,#36]
    bx lr
END_FUNCTION func_004E8938

BEGIN_FUNCTION func_004E8944
    add r0,r0,r1
    ldrb r0,[r0,#11]
    cmp r0,#0
    movne r0,#1
    bx lr
END_FUNCTION func_004E8944

BEGIN_FUNCTION func_004E8958
    add r0,r0,r1
    ldrb r0,[r0,#4]
    cmp r0,#1
    movne r0,#0
    bx lr
END_FUNCTION func_004E8958

BEGIN_FUNCTION func_004E9420
    ldr r0,[r0]
    cmp r0,#0
    moveq r0,#1
    movne r0,#0
    bx lr
END_FUNCTION func_004E9420

BEGIN_FUNCTION func_004E9C00
    ldr r0,[r0,#4]
    cmp r0,#0
    moveq r0,#1
    movne r0,#0
    bx lr
END_FUNCTION func_004E9C00

BEGIN_FUNCTION func_004E9CB0
    add r1,r1,r1,lsl #4
    add r0,r0,r1,lsl #1
    add r0,r0,#4
    bx lr
END_FUNCTION func_004E9CB0

BEGIN_FUNCTION func_004E9F48
    ldr r0,[r0,#52]
    and r0,r0,#2048
    lsr r0,r0,#11
    bx lr
END_FUNCTION func_004E9F48

BEGIN_FUNCTION func_004E9F68
    ldr r0,[r0,#52]
    and r0,r0,#1024
    lsr r0,r0,#10
    bx lr
END_FUNCTION func_004E9F68

BEGIN_FUNCTION func_004E9F88
    ldr r0,[r0,#52]
    and r0,r0,#67108864
    lsr r0,r0,#26
    bx lr
END_FUNCTION func_004E9F88

BEGIN_FUNCTION func_004EA52C
    add r0,r0,#256
    ldrh r0,[r0,#168]
    ands r0,r0,#2
    movne r0,#1
    bx lr
END_FUNCTION func_004EA52C

BEGIN_FUNCTION func_004EA56C
    add r0,r0,#256
    ldrh r0,[r0,#168]
    ands r0,r0,#1
    movne r0,#1
    bx lr
END_FUNCTION func_004EA56C

BEGIN_FUNCTION func_004EA5F4
    ldr r0,[r0,#48]
    cmp r0,#0
    movne r0,#1
    bx lr
END_FUNCTION func_004EA5F4
