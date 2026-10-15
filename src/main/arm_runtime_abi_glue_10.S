.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_001235A8, "ax", %progbits
.balign 4
.global func_001235A8
.type func_001235A8, %function
func_001235A8:
    mov r0, #0x03000000
    vmsr fpscr, r0
    bx lr
.size func_001235A8, . - func_001235A8

.section .text.func_00123768, "ax", %progbits
.balign 4
.global func_00123768
.type func_00123768, %function
func_00123768:
    ldr lr, [r0, #52]
    add r1, r0, #56
    ldm r1, {r2, r3}
    stmdb lr!, {r2, r3}
    ldm r0, {r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12}
    mov sp, lr
    pop {lr, pc}
.size func_00123768, . - func_00123768

.section .text.func_001237BC, "ax", %progbits
.balign 4
.global func_001237BC
.type func_001237BC, %function
func_001237BC:
    push {r4, r5, r9, r10, r11}
    ldm r1!, {r2, r3, r4, r5}
    ldm r1!, {r11, r12}
    stm r0!, {r2, r3, r4, r5}
    stm r0!, {r11, r12}
    pop {r4, r5, r9, r10, r11}
    bx lr
.size func_001237BC, . - func_001237BC

.section .text.func_001237D8, "ax", %progbits
.balign 4
.global func_001237D8
.type func_001237D8, %function
func_001237D8:
    push {r4, r5, r9, r10, r11}
    ldm r1!, {r2, r3, r4, r5}
    pld [r1, #64]
    ldm r1!, {r9, r10, r11, r12}
    stm r0!, {r2, r3, r4, r5}
    stm r0!, {r9, r10, r11, r12}
    pop {r4, r5, r9, r10, r11}
    bx lr
.size func_001237D8, . - func_001237D8

.section .text.func_00123858, "ax", %progbits
.balign 4
.global func_00123858
.type func_00123858, %function
func_00123858:
    push {r4, r5, r9, r10, r11}
    ldm r1!, {r2, r3, r4, r5}
    pld [r1, #64]
    ldm r1!, {r9, r10, r11, r12}
    stm r0!, {r2, r3, r4, r5}
    stm r0!, {r9, r10, r11, r12}
    ldm r1!, {r2, r3, r4, r5}
    ldm r1!, {r11, r12}
    stm r0!, {r2, r3, r4, r5}
    stm r0!, {r11, r12}
    pop {r4, r5, r9, r10, r11}
    bx lr
.size func_00123858, . - func_00123858

.section .text.func_00123888, "ax", %progbits
.balign 4
.global func_00123888
.type func_00123888, %function
func_00123888:
    push {r4, r5, r9, r10, r11}
    ldm r1!, {r2, r3, r4, r5}
    pld [r1, #64]
    ldm r1!, {r9, r10, r11, r12}
    stm r0!, {r2, r3, r4, r5}
    stm r0!, {r9, r10, r11, r12}
    ldm r1!, {r2, r3, r4, r5}
    pld [r1, #64]
    ldm r1!, {r9, r10, r11, r12}
    stm r0!, {r2, r3, r4, r5}
    stm r0!, {r9, r10, r11, r12}
    pop {r4, r5, r9, r10, r11}
    bx lr
.size func_00123888, . - func_00123888

.section .text.func_00123D98, "ax", %progbits
.balign 4
.global func_00123D98
.type func_00123D98, %function
func_00123D98:
    subs r3, r2, #32
    bpl 1f
    rsb r3, r2, #32
    lsr r0, r0, r2
    orr r0, r0, r1, lsl r3
    asr r1, r1, r2
    bx lr
1:
    asr r0, r1, r3
    asr r1, r1, #31
    bx lr
.size func_00123D98, . - func_00123D98

.section .text.func_00123E68, "ax", %progbits
.balign 4
.global func_00123E68
.type func_00123E68, %function
func_00123E68:
    ldr r0, [sp, #8]
    ldr r1, [sp, #4]
    add r0, r0, r0, lsl #1
    lsl r1, r1, #5
    add r0, r1, r0, lsl #3
    bx lr
.size func_00123E68, . - func_00123E68

.section .text.func_00124150, "ax", %progbits
.balign 4
.global func_00124150
.type func_00124150, %function
func_00124150:
    push {r4, r5}
    ldr r1, [r0]
    cmp r1, #1
    movne r2, #0
    mvnne r1, #0
    beq 3f
1:
    ldrex r3, [r0]
    cmp r3, r2
    bne 2f
    strex r5, r1, [r0]
    cmp r5, #0
    bne 1b
    b 4f
2:
    clrex
4:
    cmp r3, #0
    movne r0, #0
    bne 5f
3:
    mov r0, #1
5:
    pop {r4, r5}
    bx lr
.size func_00124150, . - func_00124150

.section .text.func_001241A0, "ax", %progbits
.balign 4
.global func_001241A0
.type func_001241A0, %function
func_001241A0:
    mov r1, #1
1:
    ldrex r2, [r0]
    strex r12, r1, [r0]
    cmp r12, #0
    bne 1b
    bx lr
.size func_001241A0, . - func_001241A0

.section .text.func_001241B8, "ax", %progbits
.balign 4
.global func_001241B8
.type func_001241B8, %function
func_001241B8:
1:
    ldrex r1, [r0]
    cmp r1, #0
    ble 2f
    rsb r1, r1, #0
    strex r3, r1, [r0]
    cmp r3, #0
    bne 1b
    mov r0, #1
    bx lr
2:
    clrex
    mov r0, #0
    bx lr
.size func_001241B8, . - func_001241B8

.section .note.GNU-stack, "", %progbits
