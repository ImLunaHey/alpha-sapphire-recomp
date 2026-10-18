.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_000119C4, "ax", %progbits
.balign 4
.global func_000119C4
.type func_000119C4, %function
ASM_FUNC(func_000119C4)
func_000119C4:
    push {r4, r5, r6, lr}
    ldr r5, [pc, #80]
    ldr r1, [r5, #8]
    cmp r1, #0
    moveq r0, #18
    beq .L119c4_return
    cmp r0, #0
    moveq r0, #1
    beq .L119c4_return
    mov r4, r0
    ldr r0, [r0, #4]
    bl . - 0x3610
    ldr r1, [r5, #8]
    ldr r0, [r4, #4]
    blx r1
    ldr r1, [r5, #8]
    ldr r0, [r4]
    blx r1
    ldr r1, [r5, #8]
    mov r0, r4
    blx r1
    mov r0, #0
.L119c4_return:
    pop {r4, r5, r6, pc}
.size func_000119C4, . - func_000119C4

.section .text.func_0000E658, "ax", %progbits
.balign 4
.global func_0000E658
.type func_0000E658, %function
ASM_FUNC(func_0000E658)
func_0000E658:
    ldr r2, [r0]
    ldr r1, [r2, #4]
    ldrb r3, [r2, #12]
    ldr r12, [r1, #4]
    ldrb r12, [r12, #12]
    cmp r12, r3
    bne .Le658_return
    ldr r3, [r1]
    vldr s0, [r2, #8]
    str r3, [r2, #4]
    ldr r2, [r0]
    str r2, [r1]
    str r1, [r0]
    ldr r2, [r1]
    vstr s0, [r1, #8]
    ldr r1, [r0]
    str r1, [r2, #8]
    ldr r1, [r2, #4]
    str r2, [r1, #8]
    ldr r0, [r0]
    ldrb r1, [r0, #12]
    add r1, r1, #1
    strb r1, [r0, #12]
.Le658_return:
    bx lr
.size func_0000E658, . - func_0000E658

.section .text.func_0000EEBC, "ax", %progbits
.balign 4
.global func_0000EEBC
.type func_0000EEBC, %function
ASM_FUNC(func_0000EEBC)
func_0000EEBC:
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0, #8]
    mov r5, #0
    cmp r0, #0
    cmpne r0, r4
    bne .Leebc_unlink
    ldr r0, [r4, #4]
    cmp r0, #0
    beq .Leebc_finish
    ldr r1, [r0]
    ldr r1, [r1]
    blx r1
    ldrd r0, [r4]
    ldr r2, [r0]
    ldr r2, [r2, #4]
    blx r2
    b .Leebc_finish
.Leebc_unlink:
    ldr r1, [r4, #12]
    str r1, [r0, #12]
    ldrd r0, [r4, #8]
    str r0, [r1, #8]
    str r5, [r4, #8]
    str r5, [r4, #12]
.Leebc_finish:
    mov r0, r4
    str r5, [r4, #4]
    pop {r4, r5, r6, pc}
.size func_0000EEBC, . - func_0000EEBC

.section .text.func_00012488, "ax", %progbits
.balign 4
.global func_00012488
.type func_00012488, %function
ASM_FUNC(func_00012488)
func_00012488:
    cmp r0, #0
    moveq r0, #1
    bxeq lr
    push {r4, r5, r6, lr}
    ldr r0, [r0, #4]
    bl . - 0x415C
    cmp r0, #0
    ldrne r6, [r0, #16]
    cmpne r6, #0
    moveq r0, #14
    beq .L12488_return
    ldr r5, [r6, #56]
    mov r4, #0
    cmp r5, #0
    ble .L12488_success
.L12488_loop:
    mov r0, r6
    bl . - 0x4250
    cmp r0, #0
    nop
    beq .L12488_fail
    add r4, r4, #1
    cmp r5, r4
    bgt .L12488_loop
.L12488_success:
    mov r0, #0
.L12488_return:
    pop {r4, r5, r6, pc}
.L12488_fail:
    mov r0, #20
    pop {r4, r5, r6, pc}
.size func_00012488, . - func_00012488
