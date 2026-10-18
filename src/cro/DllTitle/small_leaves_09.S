.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_0000E278, "ax", %progbits
.balign 4
.global func_0000E278
.type func_0000E278, %function
ASM_FUNC(func_0000E278)
func_0000E278:
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0, #56]
    cmp r0, #0
    beq .Le278_return
    ldr r1, [r4, #60]
    ldr r0, [r4, #48]
    add r1, r0, r1, lsl #4
    add r0, r4, #28
    bl . + 0x2FD8
    cmp r0, #0
    beq .Le278_return
    ldr r1, [r4, #60]
    ldr r0, [r4, #48]
    ldr r2, [r4, #20]
    ldr r3, [r4, #12]
    add r0, r0, r1, lsl #4
    add r6, r1, #1
    ldr r0, [r0, #4]
    ldr r0, [r0, #12]
    add r2, r2, r0
    cmp r3, r2
    subls r2, r2, r3
    ldr r3, [r4, #16]
    sub r0, r3, r0
    add r3, r4, #16
    add r4, r4, #44
    stm r3, {r0, r2}
    mov r0, r4
    ldr r5, [r4, #8]
    cmp r6, r5
    movls r2, r6
    bls .Le278_insert
    mov r2, r5
    bl . + 0x327C
    sub r2, r6, r5
    mov r1, #0
    mov r0, r4
.Le278_insert:
    bl . + 0x326C
    ldr r0, [r4, #16]
    ldr r1, [r4, #8]
    add r0, r0, #1
    cmp r0, r1
    subcs r0, r0, r1
    ldr r1, [r4, #12]
    str r0, [r4, #16]
    sub r0, r1, #1
    str r0, [r4, #12]
    mov r0, #1
.Le278_return:
    pop {r4, r5, r6, pc}
.size func_0000E278, . - func_0000E278

.section .text.func_00011B84, "ax", %progbits
.balign 4
.global func_00011B84
.type func_00011B84, %function
ASM_FUNC(func_00011B84)
func_00011B84:
    push {r4, r5, r6, r7, r8, lr}
    mov r4, r0
    cmn r2, #1
    ldrge r0, [r4, #752]
    mov r5, r2
    cmpge r0, r5
    movle r0, #0
    ble .L11b84_return
    add r6, r4, r1, lsl #2
    mov r7, r6
    ldr r0, [r6, #1140]!
    cmp r0, r5
    beq .L11b84_replace
    cmp r0, #0
    blt .L11b84_replace
    add r1, r4, r0, lsl #2
    ldr r0, [r4, #448]
    ldr r2, [r1, #756]
    ldr r1, [r4, #20]
    ldr r3, [r0]
    ldr r3, [r3, #4]
    blx r3
    ldr r2, [r6]
    mov r1, #0
    mvn r0, #0
    add r2, r4, r2, lsl #2
    str r1, [r2, #756]
    str r0, [r6]
.L11b84_replace:
    cmp r5, #0
    blt .L11b84_success
    add r0, r5, r5, lsl #2
    add r3, r4, r5, lsl #2
    add r2, r4, r0, lsl #3
    ldr r0, [r4, #448]
    ldr r1, [r4, #20]
    add r3, r3, #756
    add r2, r2, #788
    ldr r12, [r0]
    ldr r12, [r12]
    blx r12
    cmp r0, #0
    strne r5, [r7, #1140]
    beq .L11b84_failure
.L11b84_success:
    mov r0, #1
.L11b84_return:
    pop {r4, r5, r6, r7, r8, pc}
.L11b84_failure:
    ldr r1, [r4, #1368]
    mov r0, #0
    orr r1, r1, #2048
    str r1, [r4, #1368]
    pop {r4, r5, r6, r7, r8, pc}
.size func_00011B84, . - func_00011B84

.section .text.func_00012A68, "ax", %progbits
.balign 4
.global func_00012A68
.type func_00012A68, %function
ASM_FUNC(func_00012A68)
func_00012A68:
    push {r4, r5, r6, lr}
    mov r5, r0
    add r4, r0, #344
.L12a68_poll:
    mov r0, r4
    bl . - 0x3D8
    cmp r0, #0
    nop
    beq .L12a68_stop
    ldr r0, [r4, #88]
    ldr r1, [r4, #92]
    subs r0, r0, r1
    beq .L12a68_wait
    ldr r0, [r4, #88]
    ldr r1, [r4, #92]
    sub r12, r0, r1
    ldr r0, [r4, #88]
    ldr r2, [r4, #92]
    mov r1, #0
    sub r2, r0, r2
    cmp r2, #0
    mov r0, r1
    bls .L12a68_counted
.L12a68_count:
    ldr r3, [r4, #92]
    add r3, r3, r0
    and r3, r3, #3
    add r6, r3, r3, lsl #2
    add r3, r4, r6, lsl #2
    ldrb r3, [r3, #24]
    add r0, r0, #1
    cmp r3, #1
    addeq r1, r1, #1
    cmp r0, r2
    bcc .L12a68_count
.L12a68_counted:
    cmp r12, r1
    bne .L12a68_wait
    mov r0, #1
    pop {r4, r5, r6, pc}
.L12a68_stop:
    mov r0, #7
    str r0, [r5, #12]
    mov r0, #0
    pop {r4, r5, r6, pc}
.L12a68_wait:
    ldr r0, [pc, #36]
    mvn r2, #0
    mov r3, r2
    ldr r0, [r0]
    bl . - 0x12A8C
    lsrs r1, r0, #31
    nop
    blne . - 0x12B10
    nop
    nop
    b .L12a68_poll
.size func_00012A68, . - func_00012A68

.section .text.func_0001255C, "ax", %progbits
.balign 4
.global func_0001255C
.type func_0001255C, %function
ASM_FUNC(func_0001255C)
func_0001255C:
    cmp r0, #0
    moveq r0, #1
    bxeq lr
    push {r4, r5, r6, r7, r8, r9, r10, lr}
    mov r7, r2
    mov r8, r3
    ldrd r4, r5, [sp, #32]
    ldr r0, [r0, #4]
    bl . - 0x423C
    ldr r9, [r0, #16]
    mov r10, #0
    cmp r9, #0
    ldrne r0, [r9, #56]
    cmpne r0, #0
    beq .L1255c_missing
    mov r0, r9
    bl . - 0x4344
    movs r6, r0
    beq .L1255c_invalid
    ldrb r0, [r6, #17]
    cmp r0, #0
    beq .L1255c_query
    mov r0, r9
    bl . - 0x4340
.L1255c_invalid:
    str r10, [r7]
    mvn r0, #0
    str r10, [r8]
    mov r1, r0
    str r10, [r4]
    strd r0, r1, [r5]
    mov r0, #20
.L1255c_pop_error:
    pop {r4, r5, r6, r7, r8, r9, r10, pc}
.L1255c_missing:
    str r10, [r7]
    mvn r0, #0
    str r10, [r8]
    mov r1, r0
    str r10, [r4]
    strd r0, r1, [r5]
    mov r0, #14
    pop {r4, r5, r6, r7, r8, r9, r10, pc}
.L1255c_query:
    mov r2, r8
    mov r1, r7
    mov r0, r9
    bl . + 0x91F0
    cmp r0, #0
    moveq r0, #9
    beq .L1255c_pop_error
    ldrb r0, [r6, #16]
    str r0, [r4]
    ldrd r0, r1, [r6]
    strd r0, r1, [r5]
    mov r0, #0
    pop {r4, r5, r6, r7, r8, r9, r10, pc}
.size func_0001255C, . - func_0001255C

.section .text.func_00012D6C, "ax", %progbits
.balign 4
.global func_00012D6C
.type func_00012D6C, %function
ASM_FUNC(func_00012D6C)
func_00012D6C:
    push {r4, r5, r6, r7, r8, lr}
    mov r4, r0
    mov r6, #0
    ldr r0, [r0, #12]
    cmn r0, #1
    beq .L12d6c_clear
    bl . - 0x248
    mov r0, #0
    mov r1, r0
    strb r6, [r4, #36]
    strd r0, r1, [r4, #24]
    strb r6, [r4, #37]
    str r6, [r4, #32]
    ldr r5, [r4, #12]
    cmn r5, #1
    beq .L12d6c_clear
    cmp r5, #0
    blt .L12d6c_release
    ldr r7, [pc, #132]
    ldr r0, [r7, #48]
    cmp r5, r0
    bcs .L12d6c_release
    ldr r0, [pc, #120]
    bl . - 0x12DC8
    ldr r1, [r7, #12]
    rsb r0, r5, r5, lsl #3
    add r5, r1, r0, lsl #4
    ldr r0, [r5]
    cmp r0, #0
    beq .L12d6c_secondary
    bl . - 0x12D3C
    str r6, [r5]
.L12d6c_secondary:
    ldr r1, [r5, #4]
    cmp r1, #0
    beq .L12d6c_unlock
    ldr r0, [r7, #8]
    ldr r2, [r0]
    ldr r2, [r2, #12]
    blx r2
    str r6, [r5, #4]
.L12d6c_unlock:
    ldr r0, [pc, #48]
    bl . - 0x12E08
.L12d6c_release:
    mvn r0, #0
    str r0, [r4, #12]
    ldr r0, [r4, #4]
    ldr r1, [r4, #16]
    ldr r2, [r0]
    ldr r2, [r2, #12]
    blx r2
    str r6, [r4, #16]
.L12d6c_clear:
    str r6, [r4, #4]
    str r6, [r4, #8]
    pop {r4, r5, r6, r7, r8, pc}
.size func_00012D6C, . - func_00012D6C
