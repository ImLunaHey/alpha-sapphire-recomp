.syntax unified
.arch armv6k
.arm

.macro SERIALIZED_RESOURCE_OPERATION_WRAPPER name, operation
    .section .text.\name,"ax",%progbits
    .balign 4
    .global \name
    .type \name, %function
\name:
    push {r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, sl, fp, lr}
    sub sp, sp, #36
    mov r8, #0
    mov r4, r8
    ldrd sl, [sp, #92]
    ldr r5, .Ldt34_\@_pool
    cmp sl, #0
    add r0, r5, #16
    addeq sl, sp, #24
    moveq fp, #0
    mov r9, r0
    bl func_001602B8
    ldrb r0, [r5, #65]
    cmp r0, #0
    beq .Ldt34_\@_0048
    ldrb r0, [r5, #66]
    cmp r0, #0
    beq .Ldt34_\@_0060
.Ldt34_\@_0048:
    ldr r7, .Ldt34_\@_pool+4
    mov r0, r9
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt34_\@_0128
.Ldt34_\@_0060:
    ldr r0, [r5, #8]
    cmp r0, #0
    bne .Ldt34_\@_0098
    mov r0, r5
    bl func_0018C780
    lsrs r1, r0, #31
    nop {0}
    beq .Ldt34_\@_0098
    mov r7, r0
    mov r0, r9
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt34_\@_0128
.Ldt34_\@_0098:
    ldr r6, [r5, #8]
    add r1, r5, #8
    cmp r6, #0
    beq .Ldt34_\@_00dc
    ldr r2, [r6]
    mov r0, r6
    cmp r2, r0
    streq r8, [r1]
    beq .Ldt34_\@_00d4
    ldr r2, [r6, #4]
    str r2, [r1]
    ldm r0, {r1, r2}
    str r1, [r2]
    ldm r0, {r1, r2}
    str r2, [r1, #4]
.Ldt34_\@_00d4:
    str r8, [r0, #4]
    str r8, [r0]
.Ldt34_\@_00dc:
    ldr r0, [r5, #44]
    add r1, r5, #4
    sub r2, r0, #1
    str r2, [r5, #44]
    ldr r0, [r5, #4]
    cmp r0, #0
    beq .Ldt34_\@_01c0
    str r0, [r6, #4]
    ldr r2, [r0]
    str r6, [r2, #4]
    ldr r2, [r0]
    str r2, [r6]
    str r6, [r0]
.Ldt34_\@_0110:
    ldr r0, [r5, #36]
    mov r7, #0
    add r0, r0, #1
    str r0, [r5, #36]
    mov r0, r9
    bl func_00160380
.Ldt34_\@_0128:
    lsr r0, r7, #31
    cmp r0, #0
    moveq r4, r6
    beq .Ldt34_\@_0280
    cmp r4, #0
    beq .Ldt34_\@_0358
    add r0, r5, #16
    mov r6, r0
    bl func_001602B8
    ldrb r0, [r5, #65]
    cmp r0, #0
    beq .Ldt34_\@_01d0
    ldr r1, [r4]
    add r0, r5, #4
    cmp r1, r4
    streq r8, [r0]
    beq .Ldt34_\@_018c
    ldr r1, [r0]
    cmp r1, r4
    ldreq r1, [r1, #4]
    streq r1, [r0]
    ldrd r0, [r4]
    str r0, [r1]
    ldrd r0, [r4]
    str r1, [r0, #4]
.Ldt34_\@_018c:
    str r8, [r4, #4]
    str r8, [r4]
    ldr r0, [r5, #36]
    sub r0, r0, #1
    str r0, [r5, #36]
    ldr r0, [r4, #8]
    cmp r0, #0
    beq .Ldt34_\@_021c
    ldr r0, [r5, #8]
    add r1, r5, #8
    cmp r0, #0
    beq .Ldt34_\@_01e4
    b .Ldt34_\@_01f4
.Ldt34_\@_01c0:
    str r6, [r6, #4]
    str r6, [r6]
    str r6, [r1]
    b .Ldt34_\@_0110
.Ldt34_\@_01d0:
    mov r0, r6
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt34_\@_0358
.Ldt34_\@_01e4:
    str r4, [r4, #4]
    str r4, [r4]
    str r4, [r1]
    b .Ldt34_\@_020c
.Ldt34_\@_01f4:
    str r0, [r4, #4]
    ldr r1, [r0]
    str r4, [r1, #4]
    ldr r1, [r0]
    str r1, [r4]
    str r4, [r0]
.Ldt34_\@_020c:
    ldr r0, [r5, #44]
    add r0, r0, #1
    str r0, [r5, #44]
    b .Ldt34_\@_0260
.Ldt34_\@_021c:
    ldr r0, [r5, #12]
    add r1, r5, #12
    cmp r0, #0
    bne .Ldt34_\@_023c
.Ldt34_\@_022c:
    str r4, [r4, #4]
    str r4, [r4]
    str r4, [r1]
    b .Ldt34_\@_0254
.Ldt34_\@_023c:
    str r0, [r4, #4]
    ldr r1, [r0]
    str r4, [r1, #4]
    ldr r1, [r0]
    str r1, [r4]
    str r4, [r0]
.Ldt34_\@_0254:
    ldr r0, [r5, #40]
    add r0, r0, #1
    str r0, [r5, #40]
.Ldt34_\@_0260:
    add r0, r5, #28
    bl func_0017048C
    mov r0, r6
    nop {0}
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt34_\@_0358
.Ldt34_\@_0280:
    ldr r0, [r6, #8]
    ldr r2, [sp, #48]
    ldr r1, [sp, #88]
    str r0, [sp, #16]
    add r0, sp, #4
    str r2, [sp]
    stm r0, {r1, sl, fp}
    add r0, sp, #36
    ldm r0, {r1, r2, r3}
    add r0, sp, #16
    bl \operation
    lsrs r1, r0, #31
    nop {0}
    beq .Ldt34_\@_0364
    cmp r4, #0
    mov r7, r0
    beq .Ldt34_\@_0358
    add r0, r5, #16
    mov r6, r0
    bl func_001602B8
    ldrb r0, [r5, #65]
    cmp r0, #0
    beq .Ldt34_\@_01d0
    ldr r1, [r4]
    add r0, r5, #4
    cmp r1, r4
    streq r8, [r0]
    beq .Ldt34_\@_0310
    ldr r1, [r0]
    cmp r1, r4
    ldreq r1, [r1, #4]
    streq r1, [r0]
    ldrd r0, [r4]
    str r0, [r1]
    ldrd r0, [r4]
    str r1, [r0, #4]
.Ldt34_\@_0310:
    str r8, [r4, #4]
    str r8, [r4]
    ldr r0, [r5, #36]
    sub r0, r0, #1
    str r0, [r5, #36]
    ldr r0, [r4, #8]
    cmp r0, #0
    beq .Ldt34_\@_0344
    ldr r0, [r5, #8]
    add r1, r5, #8
    cmp r0, #0
    bne .Ldt34_\@_01f4
    b .Ldt34_\@_01e4
.Ldt34_\@_0344:
    ldr r0, [r5, #12]
    add r1, r5, #12
    cmp r0, #0
    bne .Ldt34_\@_023c
    b .Ldt34_\@_022c
.Ldt34_\@_0358:
    add sp, sp, #52
    mov r0, r7
    pop {r4, r5, r6, r7, r8, r9, sl, fp, pc}
.Ldt34_\@_0364:
    cmp r4, #0
    beq .Ldt34_\@_047c
    add r0, r5, #16
    mov r6, r0
    bl func_001602B8
    ldrb r0, [r5, #65]
    cmp r0, #0
    beq .Ldt34_\@_0410
    ldr r1, [r4]
    add r0, r5, #4
    cmp r1, r4
    streq r8, [r0]
    beq .Ldt34_\@_03b8
    ldr r1, [r0]
    cmp r1, r4
    ldreq r1, [r1, #4]
    streq r1, [r0]
    ldrd r0, [r4]
    str r0, [r1]
    ldrd r0, [r4]
    str r1, [r0, #4]
.Ldt34_\@_03b8:
    str r8, [r4, #4]
    str r8, [r4]
    ldr r0, [r5, #36]
    sub r0, r0, #1
    str r0, [r5, #36]
    ldr r0, [r4, #8]
    cmp r0, #0
    beq .Ldt34_\@_0434
    ldr r0, [r5, #8]
    add r1, r5, #8
    cmp r0, #0
    beq .Ldt34_\@_0424
    str r0, [r4, #4]
    ldr r1, [r0]
    str r4, [r1, #4]
    ldr r1, [r0]
    str r1, [r4]
    str r4, [r0]
.Ldt34_\@_0400:
    ldr r0, [r5, #44]
    add r0, r0, #1
    str r0, [r5, #44]
    b .Ldt34_\@_0468
.Ldt34_\@_0410:
    mov r0, r6
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt34_\@_047c
.Ldt34_\@_0424:
    str r4, [r4, #4]
    str r4, [r4]
    str r4, [r1]
    b .Ldt34_\@_0400
.Ldt34_\@_0434:
    ldr r0, [r5, #12]
    add r1, r5, #12
    cmp r0, #0
    beq .Ldt34_\@_0488
    str r0, [r4, #4]
    ldr r1, [r0]
    str r4, [r1, #4]
    ldr r1, [r0]
    str r1, [r4]
    str r4, [r0]
.Ldt34_\@_045c:
    ldr r0, [r5, #40]
    add r0, r0, #1
    str r0, [r5, #40]
.Ldt34_\@_0468:
    add r0, r5, #28
    bl func_0017048C
    mov r0, r6
    nop {0}
    bl func_00160380
.Ldt34_\@_047c:
    add sp, sp, #52
    mov r0, #0
    pop {r4, r5, r6, r7, r8, r9, sl, fp, pc}
.Ldt34_\@_0488:
    str r4, [r4, #4]
    str r4, [r4]
    str r4, [r1]
    b .Ldt34_\@_045c
    .size \name, .-\name
.Ldt34_\@_pool:
    .word resource_operation_state_34
    .word resource_unavailable_status_34
.endm

SERIALIZED_RESOURCE_OPERATION_WRAPPER func_002E25B0, func_002E3F10
SERIALIZED_RESOURCE_OPERATION_WRAPPER func_002E4960, func_002E422C
SERIALIZED_RESOURCE_OPERATION_WRAPPER func_002E52EC, func_002E435C

.section .note.GNU-stack,"",%progbits
