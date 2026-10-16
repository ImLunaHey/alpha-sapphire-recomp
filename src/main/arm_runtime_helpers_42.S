.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_004E3D8C, "ax", %progbits
.align 2
.global func_004E3D8C
.type func_004E3D8C, %function
func_004E3D8C:
    ldr r2,[r0,#8]
    mov r1,#2
    bics r1,r1,r2
    bne 1f
    ldr r2,[r0,#2584]
    cmp r2,#0
    beq 1f
    ldr r1,[r2]
    ldr r3,[r1,#32]
    add r1,r0,#2048
    add r1,r1,#364
    mov r0,r2
    bx r3
1:
    mov r0,#0
    bx lr
.size func_004E3D8C, .-func_004E3D8C

.section .text.func_004E4168, "ax", %progbits
.align 2
.global func_004E4168
.type func_004E4168, %function
func_004E4168:
    ldr r0,[r0,#4]
    ldr r0,[r0,#16]
    ldrb r2,[r0,#31]
    cmp r2,#1
    ldrheq r2,[r0]
    cmpeq r2,r1
    beq 1f
    ldrb r2,[r0,#63]
    cmp r2,#1
    ldrheq r2,[r0,#32]
    cmpeq r2,r1
    addeq r0,r0,#32
    bne 2f
1:
    cmp r0,#0
    ldrsbne r0,[r0,#30]
    bne 3f
2:
    mov r0,#0
3:
    bx lr
.size func_004E4168, .-func_004E4168

.section .text.func_004E5DDC, "ax", %progbits
.align 2
.global func_004E5DDC
.type func_004E5DDC, %function
func_004E5DDC:
    ldr r1,[r0,#4]
    ldr r2,[r1,#52]
    cmp r2,#0
    moveq r0,#0
    beq 1f
    ldr r1,[r1,#64]
    ldr r0,[r0,#8]
    ldrh r2,[r1,#22]
    add r1,r1,r2
    add r0,r1,r0,lsl #4
1:
    bx lr
.size func_004E5DDC, .-func_004E5DDC

.section .text.func_004E5E08, "ax", %progbits
.align 2
.global func_004E5E08
.type func_004E5E08, %function
func_004E5E08:
    ldr r1,[r0,#4]
    ldr r0,[r0,#8]
    ldr r1,[r1,#44]
    add r2,r0,r0,lsl #1
    add r0,r2,r0,lsl #4
    ldrh r3,[r1,#22]
    add r1,r1,r3
    add r0,r1,r0,lsl #3
    bx lr
.size func_004E5E08, .-func_004E5E08

.section .text.func_004E60F4, "ax", %progbits
.align 2
.global func_004E60F4
.type func_004E60F4, %function
func_004E60F4:
    mov r3,r0
    mov r12,#1
    lsl r0,r12,r1
    and r1,r0,#255
    add r0,r2,#1
    push {r4}
1:
    cmp r0,#0
    ldrge r2,[r3,#8]
    cmpge r2,r0
    ble 2f
    ldr r2,[r3,#4]
    add r4,r0,r0,lsl #3
    add r2,r2,r4,lsl #2
    ldr r2,[r2,#28]
    and r2,r2,#7
    tst r1,r12,lsl r2
    addeq r0,r0,#1
    beq 1b
    pop {r4}
    bx lr
2:
    pop {r4}
    mvn r0,#0
    bx lr
.size func_004E60F4, .-func_004E60F4

.section .text.func_004E65FC, "ax", %progbits
.align 2
.global func_004E65FC
.type func_004E65FC, %function
func_004E65FC:
    ldrh r1,[r0]
    bics r1,r1,#64512
    beq 1f
    sub r1,r1,#1
    cmp r1,#1000
    bcs 2f
    ldrh r1,[r0,#2]
    ldrh r2,[r0,#6]
    cmp r2,r1
    bcc 2f
    ldrh r1,[r0,#4]
    ldrh r0,[r0,#8]
    cmp r1,r0
    bls 1f
2:
    mov r0,#0
    bx lr
1:
    mov r0,#1
    bx lr
.size func_004E65FC, .-func_004E65FC

.section .text.func_004E6644, "ax", %progbits
.align 2
.global func_004E6644
.type func_004E6644, %function
func_004E6644:
    ldrb r1,[r0,#4]
    cmp r1,#0
    beq 1f
    add r1,r0,#32
    ldm r1,{r1,r2}
    cmp r2,r1
    bgt 1f
    ldr r1,[r0,#28]
    ldr r2,[r0,#24]
    cmp r1,r2
    bge 1f
    ldr r0,[r0,#20]
    add r2,r1,r1,lsl #2
    add r1,r2,r1,lsl #6
    adds r0,r0,r1,lsl #3
    ldrbne r0,[r0,#540]
    cmpne r0,#0
    movne r0,#1
    bne 2f
1:
    mov r0,#0
2:
    bx lr
.size func_004E6644, .-func_004E6644

.section .text.func_004E6698, "ax", %progbits
.align 2
.global func_004E6698
.type func_004E6698, %function
func_004E6698:
    ldrb r1,[r0,#4]
    cmp r1,#0
    beq 1f
    add r1,r0,#32
    ldm r1,{r1,r2}
    cmp r2,r1
    bgt 1f
    ldr r1,[r0,#28]
    ldr r2,[r0,#24]
    cmp r1,r2
    bge 1f
    ldr r0,[r0,#20]
    add r2,r1,r1,lsl #2
    add r1,r2,r1,lsl #6
    adds r0,r0,r1,lsl #3
    beq 1f
    ldrb r0,[r0,#540]
    cmp r0,#0
    moveq r0,#1
    beq 2f
1:
    mov r0,#0
2:
    bx lr
.size func_004E6698, .-func_004E6698

.section .text.func_004E66F0, "ax", %progbits
.align 2
.global func_004E66F0
.type func_004E66F0, %function
func_004E66F0:
    ldrb r1,[r0,#4]
    cmp r1,#0
    beq 1f
    add r1,r0,#32
    ldm r1,{r1,r2}
    cmp r2,r1
    bgt 1f
    ldr r1,[r0,#28]
    ldr r2,[r0,#24]
    cmp r1,r2
    bge 1f
    ldr r0,[r0,#20]
    add r2,r1,r1,lsl #2
    add r1,r2,r1,lsl #6
    add r0,r0,r1,lsl #3
    bx lr
1:
    mov r0,#0
    bx lr
.size func_004E66F0, .-func_004E66F0

.section .text.func_004E6738, "ax", %progbits
.align 2
.global func_004E6738
.type func_004E6738, %function
func_004E6738:
    add r12,r0,#4
    mov r3,#8
    mov r0,#0
    push {r4}
1:
    ldrsb r2,[r12,r0]
    cmp r2,#0
    beq 2f
    sub r4,r2,#97
    cmp r4,#25
    subls r2,r2,#32
    add r4,r1,r0,lsl #1
    add r0,r0,#1
    sxtb r2,r2
    cmp r0,r3
    strh r2,[r4]
    blt 1b
2:
    add r1,r1,r0,lsl #1
    mov r2,#0
    strh r2,[r1]
    pop {r4}
    bx lr
.size func_004E6738, .-func_004E6738

.section .text.func_004E678C, "ax", %progbits
.align 2
.global func_004E678C
.type func_004E678C, %function
func_004E678C:
    mov r2,#0
1:
    ldrsb r1,[r0]
    cmp r1,#0
    beq 3f
    sub r3,r1,#48
    cmp r3,#9
    subhi r3,r1,#65
    cmphi r3,#25
    subhi r3,r1,#97
    cmphi r3,#25
    bls 2f
    cmp r1,#95
    beq 2f
    mov r0,#0
    bx lr
2:
    add r2,r2,#1
    cmp r2,#4
    add r0,r0,#1
    blt 1b
3:
    mov r0,#1
    bx lr
.size func_004E678C, .-func_004E678C

.section .text.func_004E690C, "ax", %progbits
.align 2
.global func_004E690C
.type func_004E690C, %function
func_004E690C:
    add r12,r0,#12
    mov r3,#8
    mov r0,#0
    push {r4}
1:
    ldrsb r2,[r12,r0]
    cmp r2,#0
    beq 2f
    sub r4,r2,#97
    cmp r4,#25
    subls r2,r2,#32
    add r4,r1,r0,lsl #1
    add r0,r0,#1
    sxtb r2,r2
    cmp r0,r3
    strh r2,[r4]
    blt 1b
2:
    add r1,r1,r0,lsl #1
    mov r2,#0
    strh r2,[r1]
    pop {r4}
    bx lr
.size func_004E690C, .-func_004E690C

.section .text.func_004E69D4, "ax", %progbits
.align 2
.global func_004E69D4
.type func_004E69D4, %function
func_004E69D4:
    mov r3,r0
    mov r12,#4
    mov r0,#0
    push {r4}
1:
    ldrsb r2,[r3,r0]
    cmp r2,#0
    beq 2f
    sub r4,r2,#97
    cmp r4,#25
    subls r2,r2,#32
    add r4,r1,r0,lsl #1
    add r0,r0,#1
    sxtb r2,r2
    cmp r0,r12
    strh r2,[r4]
    blt 1b
2:
    add r1,r1,r0,lsl #1
    mov r2,#0
    strh r2,[r1]
    pop {r4}
    bx lr
.size func_004E69D4, .-func_004E69D4

.section .text.func_004E6B34, "ax", %progbits
.align 2
.global func_004E6B34
.type func_004E6B34, %function
func_004E6B34:
    ldrh r2,[r0]
    ldrh r3,[r1]
    cmp r2,r3
    bne 1f
    ldrh r0,[r0,#2]
    ldrh r1,[r1,#2]
    cmp r0,r1
    moveq r0,#1
    beq 2f
1:
    mov r0,#0
2:
    bx lr
.size func_004E6B34, .-func_004E6B34

.section .text.func_004E6B60, "ax", %progbits
.align 2
.global func_004E6B60
.type func_004E6B60, %function
func_004E6B60:
    ldrh r2,[r0]
    ldrh r3,[r1]
    cmp r2,r3
    bne 1f
    ldrh r0,[r0,#2]
    ldrh r1,[r1,#2]
    cmp r0,r1
    moveq r0,#1
    beq 2f
1:
    mov r0,#0
2:
    eor r0,r0,#1
    bx lr
.size func_004E6B60, .-func_004E6B60

.section .text.func_004E6D2C, "ax", %progbits
.align 2
.global func_004E6D2C
.type func_004E6D2C, %function
func_004E6D2C:
    ldrb r1,[r0,#5]
    cmp r1,#0
    bne 1f
    ldrb r0,[r0,#4]
    cmp r0,#0
    movne r0,#1
    bne 2f
1:
    mov r0,#0
2:
    bx lr
.size func_004E6D2C, .-func_004E6D2C

.section .text.func_004E6D68, "ax", %progbits
.align 2
.global func_004E6D68
.type func_004E6D68, %function
func_004E6D68:
    ldr r1,[r0,#44]
    cmp r1,#0
    ldrne r1,[r1,#8]
    cmpne r1,#0
    beq 1f
    ldr r1,[r1,#12]
    ldr r0,[r0,#32]
    cmp r1,r0
    moveq r0,#1
    beq 2f
1:
    mov r0,#0
2:
    bx lr
.size func_004E6D68, .-func_004E6D68

.section .text.func_004E6FB4, "ax", %progbits
.align 2
.global func_004E6FB4
.type func_004E6FB4, %function
func_004E6FB4:
    ldrb r1,[r0,#90]
    cmp r1,#26
    cmpne r1,#27
    ldreq r0,[r0,#92]
    lsleq r0,r0,#11
    ldrne r0,[r0,#80]
    lslne r0,r0,#16
    lsr r0,r0,#24
    bx lr
.size func_004E6FB4, .-func_004E6FB4

.section .text.func_004E6FE4, "ax", %progbits
.align 2
.global func_004E6FE4
.type func_004E6FE4, %function
func_004E6FE4:
    ldr r0,[r0,#80]
    and r1,r0,#268435456
    lsrs r1,r1,#28
    bne 1f
    and r0,r0,#134217728
    lsrs r0,r0,#27
    moveq r0,#1
    beq 2f
1:
    mov r0,#0
2:
    bx lr
.size func_004E6FE4, .-func_004E6FE4

.section .text.func_004E7064, "ax", %progbits
.align 2
.global func_004E7064
.type func_004E7064, %function
func_004E7064:
    ldrb r2,[r0,#195]
    ldrb r1,[r0,#90]
    cmp r2,#0
    cmpne r2,#3
    bne 1f
    cmp r1,#26
    cmpne r1,#27
    ldreq r2,[r0,#92]
    lsleq r2,r2,#19
    lsreq r2,r2,#24
    ldrne r2,[r0,#80]
    andne r2,r2,#255
    cmp r2,#240
    moveq r0,r2
    beq 2f
1:
    cmp r1,#26
    cmpne r1,#27
    ldreq r0,[r0,#92]
    lsleq r0,r0,#11
    ldrne r0,[r0,#80]
    lslne r0,r0,#16
    lsr r0,r0,#24
2:
    bx lr
.size func_004E7064, .-func_004E7064

.section .text.func_004E7124, "ax", %progbits
.align 2
.global func_004E7124
.type func_004E7124, %function
func_004E7124:
    ldrb r2,[r0,#191]
    cmp r2,#108
    movne r0,#0
    bne 1f
    add r2,r0,#152
    vldmia r2,{s0-s7}
    vstmia r1,{s0-s7}
    ldr r2,[r0,#188]
    ldr r0,[r0,#184]
    str r0,[r1,#32]
    mov r0,#1
    str r2,[r1,#36]
1:
    bx lr
.size func_004E7124, .-func_004E7124

.section .text.func_004E7700, "ax", %progbits
.align 2
.global func_004E7700
.type func_004E7700, %function
func_004E7700:
    add r1,r1,r1,lsl #1
    add r0,r0,r1,lsl #2
    ldr r0,[r0,#3296]
    cmp r0,#0
    moveq r0,#1
    movne r0,#0
    bx lr
.size func_004E7700, .-func_004E7700

.section .text.func_004E771C, "ax", %progbits
.align 2
.global func_004E771C
.type func_004E771C, %function
func_004E771C:
    ldr r1,[r0,#3296]
    cmp r1,#0
    bne 1f
    ldr r1,[r0,#3308]
    cmp r1,#0
    ldreq r0,[r0,#3320]
    cmpeq r0,#0
    moveq r0,#1
    beq 2f
1:
    mov r0,#0
2:
    bx lr
.size func_004E771C, .-func_004E771C

.section .text.func_004E7BB8, "ax", %progbits
.align 2
.global func_004E7BB8
.type func_004E7BB8, %function
func_004E7BB8:
    push {r4,lr}
    mov r4,r0
    ldr r0,[r0,#140]
    cmp r0,#0
    beq 1f
    ldrb r0,[r0,#24]
    cmp r0,#6
    beq 2f
1:
    mov r2,#0
    mov r1,r2
    mov r0,r2
    mov r0,r0
2:
    ldr r0,[r4,#28]
    cmp r0,#0
    ldrhne r0,[r0,#74]
    subne r0,r0,#2
    bne 3f
    mov r2,#0
    mov r1,r2
    mov r0,r2
    mov r0,r0
    mvn r0,#0
3:
    pop {r4,pc}
.size func_004E7BB8, .-func_004E7BB8

.section .text.func_004EC724, "ax", %progbits
.align 2
.global func_004EC724
.type func_004EC724, %function
func_004EC724:
    push {r4}
    mov r4,r0
    cmp r1,#0
    mov r0,#0
    ldreq r0,[r4,#8]
    ldr r12,[sp,#4]
    ldreq r1,[r0,#4]
    beq 1f
    cmp r1,#1
    ldreq r0,[r4,#8]
    ldreq r1,[r0,#8]
    bne 2f
1:
    add r0,r0,r1
    ldr r1,[r0,r2,lsl #2]
    add r2,r0,r2,lsl #2
    add r1,r1,r0
    str r1,[r3]
    ldr r1,[r2,#4]
    add r0,r0,r1
    str r0,[r12]
    ldr r1,[r3]
    sub r0,r0,r1
2:
    pop {r4}
    bx lr
.size func_004EC724, .-func_004EC724

.section .text.func_0056DCE4, "ax", %progbits
.align 2
.global func_0056DCE4
.type func_0056DCE4, %function
func_0056DCE4:
    push {r4}
    ldr r2,[r0,#16]
    mov r3,r2
    ldr r0,[r2,#4]
    cmp r0,#0
    ldrbne r4,[r1]
    beq 2f
1:
    ldrb r12,[r0,#16]
    cmp r12,r4
    movcs r3,r0
    ldrcs r0,[r0,#8]
    ldrcc r0,[r0,#12]
    cmp r0,#0
    bne 1b
2:
    cmp r3,r2
    mov r0,r3
    beq 3f
    ldrb r1,[r1]
    ldrb r3,[r0,#16]
    cmp r3,r1
    bls 4f
3:
    mov r0,r2
4:
    pop {r4}
    bx lr
.size func_0056DCE4, .-func_0056DCE4
