.syntax unified
.arch armv6k
.fpu vfp
.arm

#define ASM_FUNC(name)

.section .text.func_00000544, "ax", %progbits
.balign 4
.global func_00000544
.type func_00000544, %function
ASM_FUNC(func_00000544)
func_00000544:
    push {r4, r5, r6, lr}
    mov r6, #0
    str r6, [r0, #4]
    mov r4, r0
    str r6, [r0, #8]
    ldr r0, [pc, #304]
    add r5, r4, #44
    str r0, [r4]
    add r0, r4, #20
    stm r0, {r1, r2, r6}
    strb r6, [r4, #32]
    strb r6, [r4, #33]
    str r6, [r4, #36]
    str r6, [r4, #40]
    ldr r0, [pc, #272]
    stm r5, {r3, r6}
    bl . - 0x574
    cmp r0, #0
    beq .L00a8
    mov r5, r4
    bl . - 0x564
    ldr r1, [pc, #248]
    str r1, [r0]
    str r5, [r0, #3244]
    strb r6, [r0, #3288]
    str r6, [r0, #3292]
    str r6, [r0, #3296]
    str r6, [r0, #3300]
    str r6, [r0, #3304]
    str r6, [r0, #3308]
    str r6, [r0, #3316]
    str r6, [r0, #3248]
    str r6, [r0, #3252]
    str r6, [r0, #3256]
    str r6, [r0, #3260]
    str r6, [r0, #3264]
    str r6, [r0, #3268]
    str r6, [r0, #3272]
    str r6, [r0, #3276]
    str r6, [r0, #3280]
    str r6, [r0, #3284]
    str r6, [r0, #3312]
.L00a8:
    str r0, [r4, #28]
    ldr r1, [r4, #44]
    str r1, [r0, #3316]
    ldr r0, [r4, #28]
    add r1, r4, #20
    ldm r1, {r1, r2}
    ldr r3, [r0]
    ldr r3, [r3, #40]
    blx r3
    ldr r1, [r4, #20]
    mov r0, #36
    bl . - 0x608
    cmp r0, #0
    nop {0}
    beq .L0108
    str r6, [r0]
    str r6, [r0, #4]
    str r6, [r0, #8]
    str r6, [r0, #12]
    str r6, [r0, #16]
    str r6, [r0, #20]
    str r6, [r0, #24]
    str r6, [r0, #28]
    strb r6, [r0, #32]
.L0108:
    str r0, [r4, #36]
    ldr r1, [r4, #20]
    mov r5, r4
    mov r0, #16
    bl . - 0x64C
    cmp r0, #0
    nop {0}
    beq .L013c
    ldr r1, [pc, #40]
    str r6, [r0, #4]
    str r1, [r0]
    str r6, [r0, #8]
    strb r6, [r0, #12]
.L013c:
    str r0, [r5, #16]
    str r5, [r0, #4]
    mov r0, r4
    pop {r4, r5, r6, pc}
.size func_00000544, . - func_00000544

