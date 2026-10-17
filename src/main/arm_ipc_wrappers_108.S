.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro BEGIN name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
.endm

.macro END name
.size \name, . - \name
.endm

BEGIN func_0012684C
    push {r4, r5, r6, r7, r8, r9, r10, lr}
    sub sp, sp, #32
    mov r4, r1
    mov r9, r0
    add r0, sp, #64
    mov r6, r2
    ldm r0, {r7, r8}
    mov r5, r3
    bl func_001260B4
    cmp r9, #0
    addeq r9, sp, #16
    cmp r4, #0
    addeq r4, sp, #20
    mov r10, r4
    movs r4, r6
    cmpne r5, #0
    addeq r4, sp, #24
    moveq r5, #0
    cmp r7, #0
    addeq r7, sp, #28
    cmp r8, #0
    mov r0, #0
    addeq r8, sp, #12
    str r0, [sp, #12]
    bl func_00126000
    mov r1, r0
    mov r3, r4
    mov r2, r10
    mov r0, r9
    stm sp, {r5, r7, r8}
    bl func_00133D18
    mov r4, r0
    ldr r0, [sp, #12]
    cmp r0, #0
    svcne #35
    bl func_00126414
    add sp, sp, #32
    mov r0, r4
    pop {r4, r5, r6, r7, r8, r9, r10, pc}
END func_0012684C

BEGIN func_0042F9EC
    push {r4, r5, r6, r7, lr}
    mov r4, r0
    sub sp, sp, #28
    ldr r5, [r0, #48]
    add r6, r5, #536
    mov r0, r6
    bl func_001602B8
    ldr r0, [r5, #516]
    svc #25
    lsrs r1, r0, #31
    blne func_001603A0
    ldrb r0, [r5, #528]
    mov r7, #0
    cmp r0, #0
    beq .L108_func_0042F9EC_empty
    mov r0, r6
    strb r7, [r5, #528]
    bl func_00160380
    bl func_00145550
    mov r5, r0
.L108_func_0042F9EC_test_first:
    ands r0, r5, #-2147483648
    str r5, [sp, #16]
    bpl .L108_func_0042F9EC_second
    add r5, r4, #52
    add r6, sp, #16
    mov r0, r5
    bl func_001602B8
    ldr r0, [r4, #44]
    cmp r0, #0
    beq .L108_func_0042F9EC_unlock
.L108_func_0042F9EC_dispatch:
    mov r0, sp
    str r7, [sp]
    bl func_0010EB54
    ldr r0, [r4, #44]
    ldr r2, [sp]
    ldr r1, [r0]
    ldr r3, [r1, #12]
    mov r1, r6
    blx r3
    b .L108_func_0042F9EC_unlock
.L108_func_0042F9EC_empty:
    mov r5, #0
    mov r0, r6
    bl func_00160380
    nop
    nop
    b .L108_func_0042F9EC_test_first
.L108_func_0042F9EC_second:
    ldr r5, [r4, #48]
    add r6, r5, #536
    mov r0, r6
    bl func_001602B8
    mov r0, r6
    str r7, [r5, #532]
    bl func_00160380
    nop
    nop
    bl func_00145614
    and r1, r0, #-2147483648
    cmp r1, #0
    movge r0, #0
    str r0, [sp, #20]
    ands r0, r0, #-2147483648
    bpl .L108_func_0042F9EC_notify
    add r5, r4, #52
    add r6, sp, #20
    mov r0, r5
    bl func_001602B8
    ldr r0, [r4, #44]
    cmp r0, #0
    beq .L108_func_0042F9EC_unlock
    b .L108_func_0042F9EC_dispatch
.L108_func_0042F9EC_notify:
    add r5, r4, #52
    mov r0, r5
    bl func_001602B8
    ldr r0, [r4, #44]
    cmp r0, #0
    beq .L108_func_0042F9EC_unlock
    ldr r1, [r0]
    ldr r1, [r1, #8]
    blx r1
.L108_func_0042F9EC_unlock:
    mov r0, r5
    bl func_00160380
    add sp, sp, #28
    pop {r4, r5, r6, r7, pc}
END func_0042F9EC
