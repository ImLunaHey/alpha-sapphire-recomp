.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text
.align 2

.global func_004C90E8
.type func_004C90E8, %function
func_004C90E8:
    ldr r0,[r0,#12]
    ldr r0,[r0,#20]
    cmp r0,#0
    ldrhne r0,[r0,#4]
    bx lr
.size func_004C90E8, .-func_004C90E8

.global func_004C9640
.type func_004C9640, %function
func_004C9640:
    ldr r0,[r0,#64]
    cmp r0,#0
    beq 1f
    ldr r0,[r0,#48]
    ldr r0,[r0,#24]
    ldr r0,[r0,r1,lsl #2]
    cmp r0,#0
    ldrne r0,[r0,#40]
    bne 2f
1:  mov r0,#0
2:  bx lr
.size func_004C9640, .-func_004C9640

.global func_004C96B4
.type func_004C96B4, %function
func_004C96B4:
    ldr r0,[r0,#64]
    cmp r0,#0
    ldrne r0,[r0,#48]
    ldrhne r0,[r0,#40]
    bx lr
.size func_004C96B4, .-func_004C96B4

.global func_004C96CC
.type func_004C96CC, %function
func_004C96CC:
    cmp r1,#0
    blt 1f
    ldr r0,[r0,#64]
    cmp r0,#0
    beq 1f
    ldr r0,[r0,#48]
    ldr r0,[r0,#108]
    ldr r0,[r0,r1,lsl #2]
    cmp r0,#0
    ldrne r0,[r0,#16]
    bne 2f
1:  mov r0,#0
2:  bx lr
.size func_004C96CC, .-func_004C96CC

.global func_004C9700
.type func_004C9700, %function
func_004C9700:
    ldr r0,[r0,#64]
    cmp r0,#0
    ldrne r0,[r0,#48]
    ldrhne r0,[r0,#112]
    bx lr
.size func_004C9700, .-func_004C9700

.global func_004C9714
.type func_004C9714, %function
func_004C9714:
    ldr r0,[r0,#64]
    cmp r0,#0
    ldrne r0,[r0,#48]
    ldrhne r0,[r0,#100]
    bx lr
.size func_004C9714, .-func_004C9714

.global func_004C9728
.type func_004C9728, %function
func_004C9728:
    cmp r1,#0
    blt 1f
    ldr r0,[r0,#64]
    cmp r0,#0
    beq 1f
    ldr r0,[r0,#48]
    ldr r0,[r0,#120]
    ldr r0,[r0,r1,lsl #2]
    cmp r0,#0
    ldrne r0,[r0,#16]
    bne 2f
1:  mov r0,#0
2:  bx lr
.size func_004C9728, .-func_004C9728

.global func_004C975C
.type func_004C975C, %function
func_004C975C:
    ldr r0,[r0,#64]
    cmp r0,#0
    ldrne r0,[r0,#48]
    ldrhne r0,[r0,#124]
    bx lr
.size func_004C975C, .-func_004C975C

.global func_004C9770
.type func_004C9770, %function
func_004C9770:
    ldr r0,[r0,#4]
    cmp r0,#0
    ldrsbne r0,[r0,#4]
    mvneq r0,#1
    bx lr
.size func_004C9770, .-func_004C9770

.global func_004C9784
.type func_004C9784, %function
func_004C9784:
    ldr r0,[r0,#4]
    cmp r0,#0
    beq 1f
    cmp r1,#0
    ldrhge r2,[r0,#6]
    cmpge r2,r1
    ble 1f
    ldrb r2,[r0,#4]
    cmp r2,#0
    beq 2f
1:  mov r0,#0
    bx lr
2:  ldr r0,[r0,#8]
    ldr r0,[r0,r1,lsl #2]
    bx lr
.size func_004C9784, .-func_004C9784

.global func_004CCB20
.type func_004CCB20, %function
func_004CCB20:
    mov r1,r0
    ldrb r0,[r0,#29]
    cmp r0,#5
    mvn r0,#0
    bne 1f
    ldr r1,[r1,#32]
    cmp r1,#0
    ldrne r0,[r1,#44]
    sxtbne r0,r0
1:  bx lr
.size func_004CCB20, .-func_004CCB20

.global func_004CCE90
.type func_004CCE90, %function
func_004CCE90:
    cmp r1,#0
    blt 1f
    ldr r2,[r0,#40]
    mov r0,#0
    cmp r2,#0
    ldrhne r0,[r2,#56]
    cmp r0,r1
    ble 1f
    add r3,r1,r1,lsl #1
    ldr r0,[r2,#52]
    add r1,r3,r1,lsl #3
    mov r2,#40
    add r1,r2,r1,lsl #2
    ldr r0,[r0,r1]
    bx lr
1:  mov r0,#0
    bx lr
.size func_004CCE90, .-func_004CCE90

.global func_004CCF64
.type func_004CCF64, %function
func_004CCF64:
    ldr r1,[r0,#40]
    mov r0,#0
    cmp r1,#0
    ldrhne r0,[r1,#56]
    bx lr
.size func_004CCF64, .-func_004CCF64

.global func_004CD004
.type func_004CD004, %function
func_004CD004:
    ldr r0,[r0,#40]
    add r1,r1,r1,lsl #1
    ldr r0,[r0,#148]
    ldr r0,[r0]
    add r0,r0,r1,lsl #2
    str r0,[r2,#4]
    bx lr
.size func_004CD004, .-func_004CD004

.global func_004CD070
.type func_004CD070, %function
func_004CD070:
    ldr r0,[r0,#40]
    add ip,r1,r1,lsl #1
    add r1,ip,r1,lsl #3
    ldr r0,[r0,#52]
    ldr r0,[r0,r1,lsl #2]
    add r1,r2,r2,lsl #1
    ldr r0,[r0,#268]
    ldr r0,[r0]
    add r0,r0,r1,lsl #2
    str r0,[r3,#4]
    bx lr
.size func_004CD070, .-func_004CD070

.global func_004CDB58
.type func_004CDB58, %function
func_004CDB58:
    ldr ip,[r0,#128]
    lsl r3,r2,#3
    mov r0,#1
    add r1,ip,r1,lsl #4
    ldr ip,[r1]
    lsr r3,ip,r3
    and r3,r3,#255
    cmp r3,#1
    addeq r0,r1,r2,lsl #2
    ldreq r0,[r0,#4]
    beq 3f
    cmp r3,#2
    beq 2f
    cmp r3,#3
    bne 1f
    add r0,r1,r2,lsl #2
    ldr r0,[r0,#4]
    ldrb r0,[r0,#13]
1:  bx lr
2:  add r0,r1,r2,lsl #2
    ldr r0,[r0,#4]
    ldr r0,[r0,#12]
3:  ldrb r0,[r0,#25]
    bx lr
.size func_004CDB58, .-func_004CDB58

.global func_004CDBB8
.type func_004CDBB8, %function
func_004CDBB8:
    ldr ip,[r0,#128]
    lsl r3,r2,#3
    mov r0,#0
    add r1,ip,r1,lsl #4
    ldr ip,[r1]
    lsr r3,ip,r3
    and r3,r3,#255
    cmp r3,#1
    addeq r0,r1,r2,lsl #2
    ldreq r0,[r0,#4]
    beq 3f
    cmp r3,#2
    beq 2f
    cmp r3,#3
    bne 1f
    add r0,r1,r2,lsl #2
    ldr r0,[r0,#4]
    ldrb r0,[r0,#12]
1:  bx lr
2:  add r0,r1,r2,lsl #2
    ldr r0,[r0,#4]
    ldr r0,[r0,#12]
3:  ldrb r0,[r0,#24]
    bx lr
.size func_004CDBB8, .-func_004CDBB8

.global func_004CDE94
.type func_004CDE94, %function
func_004CDE94:
    mov r1,r0
    push {r4,r5}
    ldr r1,[r1,#136]
    mov r0,#0
    add r1,r1,#4
    ldm r1,{r2,r5}
    cmp r2,r5
    beq 3f
1:  ldr ip,[r2]
    mov r1,#0
    ldr r3,[ip,#548]
    cmp r3,#0
    ldrhi ip,[ip,#556]
    bls 2f
4:  ldr r4,[ip,r1,lsl #2]
    add r1,r1,#1
    cmp r3,r1
    ldr r4,[r4,#76]
    ldr r4,[r4,#204]
    add r0,r0,r4
    bhi 4b
2:  add r2,r2,#4
    cmp r2,r5
    bne 1b
3:  pop {r4,r5}
    bx lr
.size func_004CDE94, .-func_004CDE94

.global func_004CE6CC
.type func_004CE6CC, %function
func_004CE6CC:
    ldrb r2,[r0,#4]
    cmp r2,#1
    movne r0,#0
    bne 1f
    ldr r0,[r0,#8]
    cmp r0,#0
    beq 2f
    ldr r2,[r0]
    tst r2,#0x20000000
    moveq r0,#0
2:  mov r2,#16
    add r1,r2,r1,lsl #2
    ldr r0,[r0,r1]
1:  bx lr
.size func_004CE6CC, .-func_004CE6CC

.global func_004CEF2C
.type func_004CEF2C, %function
func_004CEF2C:
    ldrb r2,[r0,#1628]
    cmp r2,r1
    movls r0,#0
    bls 1f
    ldr r0,[r0,#1624]
    ldr r0,[r0,r1,lsl #2]
    cmp r0,#0
    movne r0,#1
1:  bx lr
.size func_004CEF2C, .-func_004CEF2C

.global func_004CF200
.type func_004CF200, %function
func_004CF200:
    ldrb r3,[r0,#35]
    str r3,[r1]
    ldrb r0,[r0,#42]
    str r0,[r2]
    bx lr
.size func_004CF200, .-func_004CF200

.global func_004CF6C8
.type func_004CF6C8, %function
func_004CF6C8:
    vldmia r2,{s0-s2}
    add r3,r0,#16
    vldr s3,[r0]
    vldr s4,[r0,#16]
    vmul.f32 s3,s3,s0
    vmla.f32 s3,s4,s1
    vldr s4,[r0,#32]
    vmla.f32 s3,s4,s2
    vstr s3,[r1]
    vldr s3,[r0,#4]
    vldr s4,[r0,#20]
    vmul.f32 s3,s3,s0
    vmla.f32 s3,s4,s1
    vldr s4,[r0,#36]
    vmla.f32 s3,s4,s2
    vstr s3,[r1,#4]
    vldr s3,[r0,#8]
    vmul.f32 s0,s3,s0
    vldr s3,[r3,#8]
    vmla.f32 s0,s3,s1
    vldr s1,[r0,#40]
    vmla.f32 s0,s1,s2
    vstr s0,[r1,#8]
    bx lr
.size func_004CF6C8, .-func_004CF6C8

.global func_004CFDF0
.type func_004CFDF0, %function
func_004CFDF0:
    vldmia r2,{s0-s2}
    vldr s3,[r0]
    vldr s4,[r0,#4]
    vmul.f32 s3,s3,s0
    vmla.f32 s3,s4,s1
    vldr s4,[r0,#8]
    vmla.f32 s3,s4,s2
    vstr s3,[r1]
    vldr s3,[r0,#16]
    vldr s4,[r0,#20]
    vmul.f32 s3,s3,s0
    vmla.f32 s3,s4,s1
    vldr s4,[r0,#24]
    add r0,r0,#32
    vmla.f32 s3,s4,s2
    vstr s3,[r1,#4]
    vldr s3,[r0]
    vmul.f32 s0,s3,s0
    vldr s3,[r0,#4]
    vmla.f32 s0,s3,s1
    vldr s1,[r0,#8]
    vmla.f32 s0,s1,s2
    vstr s0,[r1,#8]
    bx lr
.size func_004CFDF0, .-func_004CFDF0
