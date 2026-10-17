.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_000019DC, "ax", %progbits
.balign 4
.global func_000019DC
.type func_000019DC, %function
func_000019DC:
    push {r4-r12, lr}
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
    bge .Lscaled_000019DC
    adds r0, r0, r12
    adc r1, r1, lr
.Lscaled_000019DC:
    ldr r2, [sp, #0x28]
    bl . - 0x185C
    ldr r2, [r11, #4]
    lsr r2, r2, #31
    adds r0, r0, r2
    adc r1, r1, #0
    pop {r4-r12, pc}
.size func_000019DC, . - func_000019DC
