.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_000195D0, "ax", %progbits
.balign 4
.global func_000195D0
.type func_000195D0, %function
ASM_FUNC(func_000195D0)
func_000195D0:
    push {r4, r5, r6, lr}
    add r5, r0, #5120
    add r5, r5, #28
    mov r6, #1
    ldr r0, [r5, #20]
    ldr r4, [r0, #8]
    cmp r4, r0
    beq .L195d0_return
.L195d0_loop:
    ldr r0, [r4, #24]
    mov r1, #1
    ldr r0, [r0, #16]
    bl . - 0xCAC
    cmp r0, #0
    ldr r0, [r4, #12]
    moveq r6, #0
    cmp r0, #0
    beq .L195d0_parent
.L195d0_descend:
    mov r4, r0
    ldr r0, [r0, #8]
    cmp r0, #0
    bne .L195d0_descend
    b .L195d0_next
.L195d0_parent:
    ldr r0, [r4, #4]
    ldr r2, [r0, #12]
    cmp r4, r2
    bne .L195d0_check
.L195d0_ascend:
    mov r4, r0
    ldr r0, [r0, #4]
    ldr r1, [r0, #12]
    cmp r4, r1
    beq .L195d0_ascend
.L195d0_check:
    ldr r1, [r4, #12]
    cmp r1, r0
    movne r4, r0
.L195d0_next:
    ldr r0, [r5, #20]
    cmp r4, r0
    bne .L195d0_loop
.L195d0_return:
    mov r0, r6
    pop {r4, r5, r6, pc}
.size func_000195D0, . - func_000195D0

.section .text.func_0000E1B8, "ax", %progbits
.balign 4
.global func_0000E1B8
.type func_0000E1B8, %function
ASM_FUNC(func_0000E1B8)
func_0000E1B8:
    cmp r1, #0
    bxeq lr
    push {r4, r5, r6, r7, r8, lr}
    mov r4, r1
    mov r6, r0
    mov r8, #0
.Le1b8_loop:
    ldr r1, [r4, #12]
    bl . - 0x1C
    ldr r0, [r6, #8]
    ldr r7, [r4, #8]
    mov r5, r4
    str r0, [r4, #12]!
    add r4, r4, #8
    ldr r0, [r4, #8]
    cmp r0, #0
    cmpne r0, r4
    bne .Le1b8_unlink
    ldr r0, [r4, #4]
    cmp r0, #0
    beq .Le1b8_clear
    ldr r1, [r0]
    ldr r1, [r1]
    blx r1
    ldrd r0, [r4]
    ldr r2, [r0]
    ldr r2, [r2, #4]
    blx r2
    b .Le1b8_clear
.Le1b8_unlink:
    ldr r1, [r4, #12]
    str r1, [r0, #12]
    ldrd r0, [r4, #8]
    str r0, [r1, #8]
    str r8, [r4, #8]
    str r8, [r4, #12]
.Le1b8_clear:
    str r8, [r4, #4]
    movs r4, r7
    mov r0, r6
    str r5, [r6, #8]
    bne .Le1b8_loop
    pop {r4, r5, r6, r7, r8, pc}
.size func_0000E1B8, . - func_0000E1B8

.section .text.func_0000E340, "ax", %progbits
.balign 4
.global func_0000E340
.type func_0000E340, %function
ASM_FUNC(func_0000E340)
func_0000E340:
    add r12, r0, #5120
    add r12, r12, #28
    push {r4, r5}
    ldr r2, [r12, #20]
    mov r3, #0
    ldr r0, [r2, #8]
    cmp r0, r2
    beq .Le340_none
.Le340_loop:
    cmp r1, r3
    bne .Le340_next
    ldr r0, [r0, #24]
    pop {r4, r5}
    bx lr
.Le340_next:
    ldr r2, [r0, #12]
    cmp r2, #0
    beq .Le340_parent
.Le340_descend:
    mov r0, r2
    ldr r2, [r2, #8]
    cmp r2, #0
    bne .Le340_descend
    b .Le340_advance
.Le340_parent:
    ldr r2, [r0, #4]
    ldr r5, [r2, #12]
    cmp r0, r5
    bne .Le340_check
.Le340_ascend:
    mov r0, r2
    ldr r2, [r2, #4]
    ldr r4, [r2, #12]
    cmp r0, r4
    beq .Le340_ascend
.Le340_check:
    ldr r4, [r0, #12]
    cmp r4, r2
    movne r0, r2
.Le340_advance:
    ldr r2, [r12, #20]
    add r3, r3, #1
    cmp r0, r2
    bne .Le340_loop
.Le340_none:
    pop {r4, r5}
    mov r0, #0
    bx lr
.size func_0000E340, . - func_0000E340

.section .text.func_000129C8, "ax", %progbits
.balign 4
.global func_000129C8
.type func_000129C8, %function
ASM_FUNC(func_000129C8)
func_000129C8:
    push {r4, r5, r6, r7, r8, r9, r10, r11, r12, lr}
    mov r4, #0
    mov r6, r4
    mov r7, r4
    mov r11, r0
    ldm r0, {r12, lr}
    asr r5, r3, #31
    umull r10, r9, r12, r2
    asr r1, lr, #31
    mla r0, r4, r2, r9
    umull r9, r10, lr, r2
    mla r0, r12, r6, r0
    mla r2, r1, r2, r10
    adds r9, r9, r0
    mla r2, lr, r4, r2
    adc r0, r2, r4
    umull r2, r6, r12, r3
    mla r4, r4, r3, r6
    umull r6, r8, lr, r3
    mla r4, r12, r5, r4
    mla r1, r1, r3, r8
    adds r2, r2, r9
    mla r1, lr, r5, r1
    asr r5, r0, #31
    adc r2, r4, r7
    adds r0, r0, r2
    adc r2, r5, r2, asr #31
    adds r0, r0, r6
    adc r1, r1, r2
    cmp r3, #0
    bge .L129c8_divide
    adds r0, r0, r12
    adc r1, r1, lr
.L129c8_divide:
    ldr r2, [sp, #40]
    bl . - 0x127E8
    ldr r2, [r11, #4]
    lsr r2, r2, #31
    adds r0, r0, r2
    adc r1, r1, #0
    pop {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
.size func_000129C8, . - func_000129C8

.section .text.func_00014CA8, "ax", %progbits
.balign 4
.global func_00014CA8
.type func_00014CA8, %function
ASM_FUNC(func_00014CA8)
func_00014CA8:
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0, #12]
    cmp r0, #7
    beq .L14ca8_return
    ldr r0, [r4, #24]
    ldr r0, [r0]
    bl . + 0x815C
    tst r0, #255
    beq .L14ca8_stage_four
    mov r5, #7
    mov r0, r4
    bl . - 0x14CD8
    str r5, [r4, #12]
    mov r0, r4
    bl . - 0x14CDC
    ldr r0, [r4, #12]
    pop {r4, r5, r6, pc}
.L14ca8_stage_four:
    mov r0, r4
    bl . - 0x2914
    mov r5, #4
    mov r0, r4
    bl . - 0x14D00
    str r5, [r4, #12]
    mov r0, r4
    bl . - 0x14D04
    add r0, r4, #32
    nop
    bl . - 0x14BC0
    ldr r0, [r4, #12]
    cmp r0, #4
    bne .L14ca8_return
.L14ca8_wait:
    ldr r0, [pc, #24]
    mov r1, #0
    bl . - 0x14CD0
    ldr r0, [r4, #12]
    cmp r0, #4
    beq .L14ca8_wait
.L14ca8_return:
    ldr r0, [r4, #12]
    pop {r4, r5, r6, pc}
.size func_00014CA8, . - func_00014CA8
