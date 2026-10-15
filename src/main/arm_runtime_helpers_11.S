.syntax unified
.arm

.section .text.func_0012339C, "ax", %progbits
.align 2
.global func_0012339C
.type func_0012339C, %function
func_0012339C:
    cmp r1, #2
    bhs 1f
    rsb r2, r1, r1, lsl #3
    add r1, r2, r1, lsl #4
    add r0, r0, r1, lsl #3
1:
    bx lr
.size func_0012339C, . - func_0012339C

.section .text.func_00123F14, "ax", %progbits
.align 2
.global func_00123F14
.type func_00123F14, %function
func_00123F14:
    cmp r0, #0
    beq 1f
    ldr r1, [r0]
    ldr r1, [r1, #48]
    bx r1
1:
    bx lr
.size func_00123F14, . - func_00123F14

.section .text.func_00125DEC, "ax", %progbits
.align 2
.global func_00125DEC
.type func_00125DEC, %function
func_00125DEC:
    ldr r2, [r0, #4]
    cmp r2, #0
    beq 2f
1:
    ldr r3, [r0, #4]
    cmp r1, #0
    ldrex r2, [r3]
    lsr r12, r2, #24
    orrne r12, r12, #1
    biceq r12, r12, #1
    bic r2, r2, #0xff000000
    orr r2, r2, r12, lsl #24
    strex r12, r2, [r3]
    cmp r12, #0
    bne 1b
2:
    bx lr
.size func_00125DEC, . - func_00125DEC

.section .text.func_00126A64, "ax", %progbits
.align 2
.global func_00126A64
.type func_00126A64, %function
func_00126A64:
    cmp r2, #0
    push {r4}
    beq 1f
    cmp r2, #1
    beq 2f
    cmp r2, #2
    ldreq r2, [r0]
    bne 2f
1:
    str r2, [r0, #4]
2:
    cmp r1, #0
    beq 4f
    ldr r3, [r0, #4]
    mov r2, #0
    add r3, r3, r1
    ldr r1, [r0]
    subs r4, r1, r3
    sbcs r12, r2, r2
    blt 3f
    cmp r2, #0
    movlt r1, #0
    movge r1, r3
3:
    str r1, [r0, #4]
4:
    pop {r4}
    bx lr
.size func_00126A64, . - func_00126A64

.section .text.func_00126AC4, "ax", %progbits
.align 2
.global func_00126AC4
.type func_00126AC4, %function
func_00126AC4:
    cmp r1, #0
    push {r4}
    beq 2f
    ldr r3, [r0, #4]
    mov r2, #0
    add r1, r1, r3
    ldr r3, [r0]
    subs r4, r3, r1
    sbcs r12, r2, r2
    movlt r1, r3
    blt 1f
    cmp r2, #0
    movlt r1, #0
1:
    str r1, [r0, #4]
2:
    ldr r0, [r0, #4]
    pop {r4}
    bx lr
.size func_00126AC4, . - func_00126AC4

.section .text.func_00131940, "ax", %progbits
.align 2
.global func_00131940
.type func_00131940, %function
func_00131940:
    push {r4, r5, r6}
    umull r4, r6, r1, r2
    asr r5, r1, #31
    mov r12, #0
    mla r5, r5, r2, r6
    mla r12, r1, r12, r5
    umlal r4, r12, r3, r0
    umull r2, r0, r0, r2
    umull r1, r2, r1, r3
    mov r2, #0
    adds r0, r0, r2
    adc r1, r1, r2
    adds r0, r0, r4
    pop {r4, r5, r6}
    adc r1, r1, r12
    bx lr
.size func_00131940, . - func_00131940
