.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_00012630, "ax", %progbits
.balign 4
.global func_00012630
.type func_00012630, %function
ASM_FUNC(func_00012630)
func_00012630:
    push {r4, r5, r6, lr}
    cmp r0, #0
    mov r6, #0
    mov r4, r2
    moveq r0, #1
    streq r6, [r2]
    beq .L12630_return
    ldr r0, [r0, #4]
    bl . - 0x4310
    ldr r5, [r0, #16]
    cmp r5, #0
    ldrne r0, [r5, #56]
    cmpne r0, #0
    beq .L12630_invalid
    mov r0, r5
    bl . - 0x4414
    cmp r0, #0
    beq .L12630_invalid
    ldrb r0, [r0, #17]
    cmp r0, #0
    beq .L12630_success
.L12630_invalid:
    mov r0, #14
    str r6, [r4]
.L12630_return:
    pop {r4, r5, r6, pc}
.L12630_success:
    ldr r0, [r5, #56]
    str r0, [r4]
    mov r0, #0
    pop {r4, r5, r6, pc}
.size func_00012630, . - func_00012630

.section .text.func_0001ABF0, "ax", %progbits
.balign 4
.global func_0001ABF0
.type func_0001ABF0, %function
ASM_FUNC(func_0001ABF0)
func_0001ABF0:
    push {r4, r5, r6, r7, r8, lr}
    mov r4, r0
    add r0, r0, #5120
    add r0, r0, #120
    ldr r0, [r0]
    ldr r1, [r0]
    ldr r1, [r1, #32]
    blx r1
    cmp r0, #0
    beq .L1abf0_return
    mov r1, #0
    mov r2, r1
    mov r3, r1
    mov r12, r1
    stm r4, {r1, r2, r3, r12}
    mov r5, #65536
    mov r0, r1
    mov r6, #5248
    mov r7, #64
    orr r1, r6, r5, asr #14
    add r2, r4, #5120
    str r7, [r6, r4]
    str r5, [r1, r4]
    add r2, r2, #143
    add r4, r4, #5120
    add r4, r4, #145
    strb r0, [r2]
    strb r0, [r4]
    mov r0, #1
.L1abf0_return:
    pop {r4, r5, r6, r7, r8, pc}
.size func_0001ABF0, . - func_0001ABF0

.section .text.func_0001157C, "ax", %progbits
.balign 4
.global func_0001157C
.type func_0001157C, %function
ASM_FUNC(func_0001157C)
func_0001157C:
    push {r4, r5, r6, r7, r8, lr}
    ldr r0, [r0, #4]
    add r5, r0, r1, lsl #4
    add r6, r0, r2, lsl #4
    cmp r5, r6
    movcc r7, #0
    bcs .L1157c_return
.L1157c_loop:
    mov r4, r5
    add r5, r5, #16
    ldr r0, [r4, #8]
    cmp r0, #0
    cmpne r0, r4
    bne .L1157c_unlink
    ldr r1, [r4, #4]
    cmp r1, #0
    beq .L1157c_next
    ldr r0, [r4]
    ldr r2, [r0]
    ldr r2, [r2, #4]
    blx r2
    b .L1157c_next
.L1157c_unlink:
    ldr r1, [r4, #12]
    str r1, [r0, #12]
    ldrd r0, [r4, #8]
    str r0, [r1, #8]
    str r7, [r4, #8]
    str r7, [r4, #12]
.L1157c_next:
    cmp r5, r6
    str r7, [r4, #4]
    bcc .L1157c_loop
.L1157c_return:
    pop {r4, r5, r6, r7, r8, pc}
.size func_0001157C, . - func_0001157C

.section .text.func_0001B640, "ax", %progbits
.balign 4
.global func_0001B640
.type func_0001B640, %function
ASM_FUNC(func_0001B640)
func_0001B640:
    ldr r1, [r0, #4]
    ldr r2, [r1]
    cmp r1, r2
    beq .L1b640_root
    ldr r3, [r2]
    mov r0, r1
    cmp r2, r3
    beq .L1b640_return
.L1b640_left:
    ldr r0, [r0]
    ldr r1, [r0]
    ldr r2, [r1]
    cmp r1, r2
    bne .L1b640_left
.L1b640_return:
    bx lr
.L1b640_root:
    cmp r1, r0
    bne .L1b640_parent
    mov r1, r0
    ldr r0, [r0, #8]
    ldr r2, [r0]
    cmp r2, r1
    beq .L1b640_return
.L1b640_chain:
    mov r0, r2
    ldr r2, [r2]
    cmp r2, r1
    bne .L1b640_chain
    bx lr
.L1b640_parent:
    mov r1, r0
    ldr r0, [r0, #8]
    ldr r2, [r0]
    cmp r2, r0
    cmpne r2, r1
    bne .L1b640_parent
    bx lr
.size func_0001B640, . - func_0001B640

.section .text.func_0001B6C4, "ax", %progbits
.balign 4
.global func_0001B6C4
.type func_0001B6C4, %function
ASM_FUNC(func_0001B6C4)
func_0001B6C4:
    ldr r1, [r0]
    ldr r2, [r1, #4]
    cmp r1, r2
    beq .L1b6c4_root
    ldr r3, [r2, #4]
    mov r0, r1
    cmp r2, r3
    beq .L1b6c4_return
.L1b6c4_right:
    ldr r0, [r0, #4]
    ldr r1, [r0, #4]
    ldr r2, [r1, #4]
    cmp r1, r2
    bne .L1b6c4_right
.L1b6c4_return:
    bx lr
.L1b6c4_root:
    cmp r1, r0
    bne .L1b6c4_parent
    mov r1, r0
    ldr r0, [r0, #8]
    ldr r2, [r0, #4]
    cmp r2, r1
    beq .L1b6c4_return
.L1b6c4_chain:
    mov r0, r2
    ldr r2, [r2, #4]
    cmp r2, r1
    bne .L1b6c4_chain
    bx lr
.L1b6c4_parent:
    mov r1, r0
    ldr r0, [r0, #8]
    ldr r2, [r0, #4]
    cmp r2, r0
    cmpne r2, r1
    bne .L1b6c4_parent
    bx lr
.size func_0001B6C4, . - func_0001B6C4
