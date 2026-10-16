.syntax unified
.arm

.macro SERIALIZED_RESOURCE_OPERATION_REGISTER_WRAPPER name, operation
    .section .text.\name, "ax", %progbits
    .align 2
    .global \name
    .type \name, %function
\name:
    push {r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, sl, fp, lr}
    sub sp, sp, #12
    mov r8, #0
    mov sl, r3
    mov fp, r0
    ldr r5, .Ldt41_\@_pool
    mov r4, r8
    add r0, r5, #16
    mov r9, r0
    bl func_001602B8
    ldrb r0, [r5, #65]
    cmp r0, #0
    beq .Ldt41_\@_0040
    ldrb r0, [r5, #66]
    cmp r0, #0
    beq .Ldt41_\@_0058
.Ldt41_\@_0040:
    ldr r7, .Ldt41_\@_pool+4
    mov r0, r9
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt41_\@_0128
.Ldt41_\@_0058:
    ldr r0, [r5, #8]
    cmp r0, #0
    bne .Ldt41_\@_0090
    mov r0, r5
    bl func_0018C780
    lsrs r1, r0, #31
    nop {0}
    beq .Ldt41_\@_0090
    mov r7, r0
    mov r0, r9
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt41_\@_0128
.Ldt41_\@_0090:
    ldr r1, [r5, #8]
    add r0, r5, #8
    movs r6, r1
    moveq r0, #0
    beq .Ldt41_\@_00d8
    ldr r2, [r6]
    cmp r2, r6
    streq r8, [r0]
    beq .Ldt41_\@_00cc
    ldr r1, [r1, #4]
    str r1, [r0]
    ldrd r0, [r6]
    str r0, [r1]
    ldrd r0, [r6]
    str r1, [r0, #4]
.Ldt41_\@_00cc:
    str r8, [r6, #4]
    mov r0, r6
    str r8, [r6]
.Ldt41_\@_00d8:
    ldr r1, [r5, #44]
    add r2, r5, #4
    mov r6, r0
    sub r3, r1, #1
    str r3, [r5, #44]
    ldr r1, [r5, #4]
    cmp r1, #0
    beq .Ldt41_\@_01c0
    str r1, [r0, #4]
    ldr r2, [r1]
    str r0, [r2, #4]
    ldr r2, [r1]
    str r2, [r0]
    str r0, [r1]
.Ldt41_\@_0110:
    ldr r0, [r5, #36]
    mov r7, #0
    add r0, r0, #1
    str r0, [r5, #36]
    mov r0, r9
    bl func_00160380
.Ldt41_\@_0128:
    lsr r0, r7, #31
    cmp r0, #0
    moveq r4, r6
    beq .Ldt41_\@_0280
    cmp r4, #0
    beq .Ldt41_\@_0348
    add r0, r5, #16
    mov r6, r0
    bl func_001602B8
    ldrb r0, [r5, #65]
    cmp r0, #0
    beq .Ldt41_\@_01d0
    ldr r1, [r4]
    add r0, r5, #4
    cmp r1, r4
    streq r8, [r0]
    beq .Ldt41_\@_018c
    ldr r1, [r0]
    cmp r1, r4
    ldreq r1, [r1, #4]
    streq r1, [r0]
    ldrd r0, [r4]
    str r0, [r1]
    ldrd r0, [r4]
    str r1, [r0, #4]
.Ldt41_\@_018c:
    str r8, [r4, #4]
    str r8, [r4]
    ldr r0, [r5, #36]
    sub r0, r0, #1
    str r0, [r5, #36]
    ldr r0, [r4, #8]
    cmp r0, #0
    beq .Ldt41_\@_021c
    ldr r0, [r5, #8]
    add r1, r5, #8
    cmp r0, #0
    beq .Ldt41_\@_01e4
    b .Ldt41_\@_01f4
.Ldt41_\@_01c0:
    str r0, [r0, #4]
    str r0, [r0]
    str r0, [r2]
    b .Ldt41_\@_0110
.Ldt41_\@_01d0:
    mov r0, r6
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt41_\@_0348
.Ldt41_\@_01e4:
    str r4, [r4, #4]
    str r4, [r4]
    str r4, [r1]
    b .Ldt41_\@_020c
.Ldt41_\@_01f4:
    str r0, [r4, #4]
    ldr r1, [r0]
    str r4, [r1, #4]
    ldr r1, [r0]
    str r1, [r4]
    str r4, [r0]
.Ldt41_\@_020c:
    ldr r0, [r5, #44]
    add r0, r0, #1
    str r0, [r5, #44]
    b .Ldt41_\@_0260
.Ldt41_\@_021c:
    ldr r0, [r5, #12]
    add r1, r5, #12
    cmp r0, #0
    bne .Ldt41_\@_023c
.Ldt41_\@_022c:
    str r4, [r4, #4]
    str r4, [r4]
    str r4, [r1]
    b .Ldt41_\@_0254
.Ldt41_\@_023c:
    str r0, [r4, #4]
    ldr r1, [r0]
    str r4, [r1, #4]
    ldr r1, [r0]
    str r1, [r4]
    str r4, [r0]
.Ldt41_\@_0254:
    ldr r0, [r5, #40]
    add r0, r0, #1
    str r0, [r5, #40]
.Ldt41_\@_0260:
    add r0, r5, #28
    bl func_0017048C
    mov r0, r6
    nop {0}
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt41_\@_0348
.Ldt41_\@_0280:
    ldr r0, [r6, #8]
    str sl, [sp]
    mov r1, fp
    str r0, [sp, #4]
    ldrd r2, [sp, #16]
    add r0, sp, #4
    bl \operation
    lsrs r1, r0, #31
    nop {0}
    beq .Ldt41_\@_0354
    cmp r4, #0
    mov r7, r0
    beq .Ldt41_\@_0348
    add r0, r5, #16
    mov r6, r0
    bl func_001602B8
    ldrb r0, [r5, #65]
    cmp r0, #0
    beq .Ldt41_\@_01d0
    ldr r1, [r4]
    add r0, r5, #4
    cmp r1, r4
    streq r8, [r0]
    beq .Ldt41_\@_0300
    ldr r1, [r0]
    cmp r1, r4
    ldreq r1, [r1, #4]
    streq r1, [r0]
    ldrd r0, [r4]
    str r0, [r1]
    ldrd r0, [r4]
    str r1, [r0, #4]
.Ldt41_\@_0300:
    str r8, [r4, #4]
    str r8, [r4]
    ldr r0, [r5, #36]
    sub r0, r0, #1
    str r0, [r5, #36]
    ldr r0, [r4, #8]
    cmp r0, #0
    beq .Ldt41_\@_0334
    ldr r0, [r5, #8]
    add r1, r5, #8
    cmp r0, #0
    bne .Ldt41_\@_01f4
    b .Ldt41_\@_01e4
.Ldt41_\@_0334:
    ldr r0, [r5, #12]
    add r1, r5, #12
    cmp r0, #0
    bne .Ldt41_\@_023c
    b .Ldt41_\@_022c
.Ldt41_\@_0348:
    add sp, sp, #28
    mov r0, r7
    pop {r4, r5, r6, r7, r8, r9, sl, fp, pc}
.Ldt41_\@_0354:
    cmp r4, #0
    beq .Ldt41_\@_046c
    add r6, r5, #16
    mov r0, r6
    bl func_001602B8
    ldrb r0, [r5, #65]
    cmp r0, #0
    beq .Ldt41_\@_0400
    ldr r1, [r4]
    add r0, r5, #4
    cmp r1, r4
    streq r8, [r0]
    beq .Ldt41_\@_03a8
    ldr r1, [r0]
    cmp r1, r4
    ldreq r1, [r1, #4]
    streq r1, [r0]
    ldrd r0, [r4]
    str r0, [r1]
    ldrd r0, [r4]
    str r1, [r0, #4]
.Ldt41_\@_03a8:
    str r8, [r4, #4]
    str r8, [r4]
    ldr r0, [r5, #36]
    sub r0, r0, #1
    str r0, [r5, #36]
    ldr r0, [r4, #8]
    cmp r0, #0
    beq .Ldt41_\@_0424
    ldr r0, [r5, #8]
    add r1, r5, #8
    cmp r0, #0
    beq .Ldt41_\@_0414
    str r0, [r4, #4]
    ldr r1, [r0]
    str r4, [r1, #4]
    ldr r1, [r0]
    str r1, [r4]
    str r4, [r0]
.Ldt41_\@_03f0:
    ldr r0, [r5, #44]
    add r0, r0, #1
    str r0, [r5, #44]
    b .Ldt41_\@_0458
.Ldt41_\@_0400:
    mov r0, r6
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt41_\@_046c
.Ldt41_\@_0414:
    str r4, [r4, #4]
    str r4, [r4]
    str r4, [r1]
    b .Ldt41_\@_03f0
.Ldt41_\@_0424:
    ldr r0, [r5, #12]
    add r1, r5, #12
    cmp r0, #0
    beq .Ldt41_\@_0478
    str r0, [r4, #4]
    ldr r1, [r0]
    str r4, [r1, #4]
    ldr r1, [r0]
    str r1, [r4]
    str r4, [r0]
.Ldt41_\@_044c:
    ldr r0, [r5, #40]
    add r0, r0, #1
    str r0, [r5, #40]
.Ldt41_\@_0458:
    add r0, r5, #28
    bl func_0017048C
    mov r0, r6
    nop {0}
    bl func_00160380
.Ldt41_\@_046c:
    add sp, sp, #28
    mov r0, #0
    pop {r4, r5, r6, r7, r8, r9, sl, fp, pc}
.Ldt41_\@_0478:
    str r4, [r4, #4]
    str r4, [r4]
    str r4, [r1]
    b .Ldt41_\@_044c
    .size \name, . - \name
.Ldt41_\@_pool:
    .word resource_operation_state_41
    .word resource_unavailable_status_41
.endm

SERIALIZED_RESOURCE_OPERATION_REGISTER_WRAPPER func_002E3518, func_002E40B0
SERIALIZED_RESOURCE_OPERATION_REGISTER_WRAPPER func_002E4E5C, func_002E42FC

.section .note.GNU-stack, "", %progbits
