.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT49_BODY name, helper
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push {r4, r5, r6, r7, r8, r9, sl, fp, lr}
    sub sp, sp, #100
    subs r6, r3, #0
    mov r4, r0
    mov r8, r1
    ldr r9, [sp, #136]
    mov r7, r2
    blt .Ldt49_reject\@
    ldr r0, .Ldt49_slot\@
    mov r5, #0
    ldr r1, [r0]
    ldr r0, [r4, #32]
    ldr r1, [r1, #60]
    cmp r0, #20
    bhs .Ldt49_oob\@
    add r0, r1, r0, lsl #2
    ldr r0, [r0, #4]
    cmp r0, #0
    ldrne r5, [r0, #32]
    b .Ldt49_dispatch\@
.Ldt49_oob\@:
    mov r2, #0
    mov r1, r2
    mov r0, r2
    mov r0, r0
.Ldt49_dispatch\@:
    ldr r0, [r5]
    ldr r1, [r0, #28]
    mov r0, r5
    blx r1
    mov r1, #43
    add r2, sp, #78
    smulbb r3, r7, r1
    add r1, sp, #94
    add ip, sp, #76
    add sl, sp, #36
    add r4, r4, r3, lsl #2
    add r3, sp, #92
    ldr r7, [r4, #120]
    str r1, [sp, #60]
    str r3, [sp, #52]
    add r1, sp, #90
    add r3, sp, #72
    str r2, [sp, #56]
    str ip, [sp, #48]
    str r1, [sp, #44]
    str r3, [sp, #32]
    add r2, sp, #88
    add ip, sp, #74
    stm sl, {r2, ip}
    add r1, sp, #86
    add r2, sp, #70
    str r1, [sp, #28]
    str r2, [sp, #24]
    add r3, sp, #84
    add r2, sp, #66
    add lr, sp, #12
    str r3, [sp, #20]
    str r2, [sp, #8]
    add ip, sp, #68
    add r1, sp, #82
    stm lr, {r1, ip}
    add fp, sp, #80
    add sl, sp, #64
    add r3, sp, #96
    mov r2, r9
    mov r1, r6
    strd sl, [sp]
    bl \helper
    ldrsh r0, [sp, #96]
    mov r4, #0
    cmp r0, #0
    ble .Ldt49_done\@
    mov r0, #91
    smulbb r0, r8, r0
    add r5, r5, r0, lsl #2
.Ldt49_loop\@:
    add r0, r5, r4, lsl #2
    add r1, sl, r4, lsl #1
    ldr r3, [r0, #148]
    add r0, fp, r4, lsl #1
    ldrsh r1, [r1]
    ldrsh r2, [r0]
    mov r0, r7
    bl func_00398FC0
    ldrsh r0, [sp, #96]
    add r1, r4, #1
    sxth r4, r1
    cmp r4, r0
    blt .Ldt49_loop\@
.Ldt49_done\@:
    add sp, sp, #100
    pop {r4, r5, r6, r7, r8, r9, sl, fp, pc}
.Ldt49_reject\@:
    add sp, sp, #100
    mov r2, #0
    pop {r4, r5, r6, r7, r8, r9, sl, fp, lr}
    mov r1, r2
    mov r0, r2
    b func_0014EA68-4
.size \name, .-\name
.Ldt49_slot\@:
    .word duplicate49_shared_registry_identity
.endm

DT49_BODY func_00493D18, func_0049866C
DT49_BODY func_004977B4, func_004995CC
