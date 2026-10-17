.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_002C0C68, "ax", %progbits
.balign 4
.global func_002C0C68
.type func_002C0C68, %function
func_002C0C68:
    push {r4, r5, r6, lr}
    mov r5, r0
    add r0, r0, #0x2800
    add r0, r0, #0x144
    mov r4, r1
    ldr r1, [r0]
    mov r0, r4
    bl func_001950F8
    add r1, r5, #0x2900
    add r5, r5, #0x2a00
    ldrh r2, [r1, #62]
    add r5, r5, #141
    mov r0, #0
    strb r2, [r4, #6]
    ldrh r1, [r1, #62]
    lsr r1, r1, #8
    strb r1, [r4, #7]
    ldrb r1, [r5]
    strb r1, [r4, #8]
    strb r0, [r4, #9]
    strb r0, [r4, #10]
    strb r0, [r4, #11]
    strb r0, [r4, #12]
    strb r0, [r4, #13]
    strb r0, [r4, #14]
    strb r0, [r4, #15]
    pop {r4, r5, r6, pc}
.size func_002C0C68, . - func_002C0C68

.section .text.func_002E0130, "ax", %progbits
.balign 4
.global func_002E0130
.type func_002E0130, %function
func_002E0130:
    push {r4, r5, r6, lr}
    mov r4, r1
    mov r5, r0
    bl func_001744C4
    ldr r0, [r5, #80]
    rev r0, r0
    str r0, [r4]
    ldr r0, [r5, #84]
    rev r0, r0
    str r0, [r4, #4]
    ldr r0, [r5, #88]
    rev r0, r0
    str r0, [r4, #8]
    ldr r0, [r5, #92]
    rev r0, r0
    str r0, [r4, #12]
    ldr r0, [r5, #96]
    rev r0, r0
    str r0, [r4, #16]
    ldr r0, [r5, #100]
    rev r0, r0
    str r0, [r4, #20]
    ldr r0, [r5, #104]
    rev r0, r0
    str r0, [r4, #24]
    ldr r0, [r5, #108]
    rev r0, r0
    str r0, [r4, #28]
    pop {r4, r5, r6, pc}
.size func_002E0130, . - func_002E0130

.section .text.func_002F30B0, "ax", %progbits
.balign 4
.global func_002F30B0
.type func_002F30B0, %function
func_002F30B0:
    push {r4, r5, r6, r7, r8, lr}
    mov r4, r3
    mov r7, r0
    add r0, sp, #24
    mov r8, r1
    ldm r0, {r1, r3}
    sub r0, r2, #0x1400
    subs r0, r0, #6
    mov r0, #1
    moveq r0, #4
    mov r5, r2
    mul r2, r4, r0
    ldr r0, [r3]
    add r0, r0, #31
    bic r6, r0, #31
    add r0, r6, r2
    str r0, [r3]
    mov r0, r6
    bl func_00184020
    ldr r3, [r7, #52]
    mov r0, #0
    mov r2, r0
    rsb r3, r3, r3, lsl #3
    add r3, r7, r3, lsl #2
    str r8, [r3, #56]
    ldr r3, [r7, #52]
    rsb r3, r3, r3, lsl #3
    add r3, r7, r3, lsl #2
    str r5, [r3, #60]
    ldr r3, [r7, #52]
    rsb r3, r3, r3, lsl #3
    add r3, r7, r3, lsl #2
    strb r4, [r3, #64]
    ldr r3, [r7, #52]
    rsb r3, r3, r3, lsl #3
    add r3, r7, r3, lsl #2
    strb r0, [r3, #65]
    ldr r1, [r7, #52]
    rsb r1, r1, r1, lsl #3
    add r1, r7, r1, lsl #2
    str r6, [r1, #68]
    ldr r1, [r7, #52]
    rsb r1, r1, r1, lsl #3
    add r1, r7, r1, lsl #2
    str r2, [r1, #72]
    ldr r1, [r7, #52]
    rsb r1, r1, r1, lsl #3
    add r1, r7, r1, lsl #2
    str r0, [r1, #76]
    ldr r1, [r7, #52]
    rsb r1, r1, r1, lsl #3
    add r1, r7, r1, lsl #2
    str r0, [r1, #80]
    ldr r0, [r7, #52]
    add r0, r0, #1
    str r0, [r7, #52]
    rsb r1, r0, r0, lsl #3
    add r0, r7, r1, lsl #2
    add r0, r0, #28
    pop {r4, r5, r6, r7, r8, pc}
.size func_002F30B0, . - func_002F30B0

.section .note.GNU-stack, "", %progbits
