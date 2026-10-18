.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_000105B8, "ax", %progbits
.balign 4
.global func_000105B8
.type func_000105B8, %function
ASM_FUNC(func_000105B8)
func_000105B8:
    push {r4, r5, r6, r7, r8, lr}
    ldr r0, [r0, #4]
    add r5, r0, r1, lsl #4
    add r6, r0, r2, lsl #4
    cmp r5, r6
    movcc r7, #0
    bcs .L105b8_return
.L105b8_loop:
    mov r4, r5
    add r5, r5, #16
    ldr r0, [r4, #8]
    cmp r0, #0
    cmpne r0, r4
    bne .L105b8_unlink
    ldr r0, [r4, #4]
    cmp r0, #0
    beq .L105b8_next
    ldr r1, [r0]
    ldr r1, [r1]
    blx r1
    ldrd r0, [r4]
    ldr r2, [r0]
    ldr r2, [r2, #4]
    blx r2
    b .L105b8_next
.L105b8_unlink:
    ldr r1, [r4, #12]
    str r1, [r0, #12]
    ldrd r0, [r4, #8]
    str r0, [r1, #8]
    str r7, [r4, #8]
    str r7, [r4, #12]
.L105b8_next:
    cmp r5, r6
    str r7, [r4, #4]
    bcc .L105b8_loop
.L105b8_return:
    pop {r4, r5, r6, r7, r8, pc}
.size func_000105B8, . - func_000105B8

.section .text.func_0000F6E0, "ax", %progbits
.balign 4
.global func_0000F6E0
.type func_0000F6E0, %function
ASM_FUNC(func_0000F6E0)
func_0000F6E0:
    push {r4, r5, r6, r7, r8, lr}
    mov r6, r1
    mov r1, #0
    str r1, [r2]
    ldr r1, [r0, #4]
    mov r4, r2
    add r2, r0, #8
    cmp r1, r2
    add r7, r0, #8
    mov r5, r2
    beq .Lf6e0_found
.Lf6e0_search:
    ldr r12, [r1, #16]
    cmp r12, r6
    ldrcc r1, [r1, #4]
    movcs r2, r1
    ldrcs r1, [r1]
    cmp r1, r5
    bne .Lf6e0_search
.Lf6e0_found:
    cmp r2, r7
    ldrne r1, [r2, #16]
    cmpne r1, r6
    movhi r2, r7
    add r1, r0, #8
    cmp r2, r1
    moveq r0, #81
    beq .Lf6e0_return
    ldr r2, [r2, #24]
    ldr r0, [r0]
    mov r1, r3
    blx r2
    cmp r0, #0
    str r0, [r4]
    movne r0, #0
    moveq r0, #68
.Lf6e0_return:
    pop {r4, r5, r6, r7, r8, pc}
.size func_0000F6E0, . - func_0000F6E0

.section .text.func_0000EDF4, "ax", %progbits
.balign 4
.global func_0000EDF4
.type func_0000EDF4, %function
ASM_FUNC(func_0000EDF4)
func_0000EDF4:
    push {r4, lr}
    mov r4, r0
    ldr r0, [r0]
    ldr r1, [r0]
    ldrb r3, [r0, #12]
    ldrb r2, [r1, #12]
    sub r1, r3, #1
    cmp r2, r1
    blt .Ledf4_update
    ldr r2, [r0, #4]
    ldrb r2, [r2, #12]
    cmp r2, r1
    bge .Ledf4_return
.Ledf4_update:
    and r1, r1, #255
    strb r1, [r0, #12]
    ldr r0, [r4]
    ldr r0, [r0, #4]
    ldrb r2, [r0, #12]
    cmp r2, r1
    strbhi r1, [r0, #12]
    mov r0, r4
    bl . - 0x790
    ldr r0, [r4]
    add r0, r0, #4
    bl . - 0x79C
    ldr r0, [r4]
    ldr r0, [r0, #4]
    add r0, r0, #4
    bl . - 0x7AC
    mov r0, r4
    nop
    bl . - 0x818
    ldr r0, [r4]
    pop {r4, lr}
    add r0, r0, #4
    b . - 0x828
.Ledf4_return:
    pop {r4, pc}
.size func_0000EDF4, . - func_0000EDF4

.section .text.func_000107E4, "ax", %progbits
.balign 4
.global func_000107E4
.type func_000107E4, %function
ASM_FUNC(func_000107E4)
func_000107E4:
    push {r4, r5, r6, lr}
    add r5, r0, #5120
    add r5, r5, #28
    mov r6, #1
    ldr r0, [r5, #20]
    ldr r4, [r0, #8]
    cmp r4, r0
    beq .L107e4_return
.L107e4_loop:
    ldr r0, [r4, #24]
    ldr r0, [r0, #16]
    bl . + 0x6B4
    cmp r0, #0
    ldr r0, [r4, #12]
    moveq r6, #0
    cmp r0, #0
    beq .L107e4_parent
.L107e4_descend:
    mov r4, r0
    ldr r0, [r0, #8]
    cmp r0, #0
    bne .L107e4_descend
    b .L107e4_next
.L107e4_parent:
    ldr r0, [r4, #4]
    ldr r2, [r0, #12]
    cmp r4, r2
    bne .L107e4_check
.L107e4_ascend:
    mov r4, r0
    ldr r0, [r0, #4]
    ldr r1, [r0, #12]
    cmp r4, r1
    beq .L107e4_ascend
.L107e4_check:
    ldr r1, [r4, #12]
    cmp r1, r0
    movne r4, r0
.L107e4_next:
    ldr r0, [r5, #20]
    cmp r4, r0
    bne .L107e4_loop
.L107e4_return:
    mov r0, r6
    pop {r4, r5, r6, pc}
.size func_000107E4, . - func_000107E4
