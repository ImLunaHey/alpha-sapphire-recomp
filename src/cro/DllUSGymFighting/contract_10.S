.syntax unified
.arch armv6k
.fpu vfp
.arm

/* Retained as the independently accepted contract-10 reference fragment. */
.section .text.func_000006FC, "ax", %progbits
.balign 4
.global func_000006FC
.type func_000006FC, %function
func_000006FC:
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0, #16]
    mov r5, r1
    sub sp, sp, #80
    vldr s0, [pc, #124]
    ldm r0, {r1, r2}
    ldr r0, [r0, #8]
    str r0, [sp, #8]
    add r0, r4, r5, lsl #2
    stm sp, {r1, r2}
    ldr r0, [r0, #292]
    ldr r1, [r0]
    ldr r2, [r1, #204]
    mov r1, #0
    blx r2
    strb r5, [sp, #1]
    ldr r0, [r4, #8]
    add r6, sp, #4
    add r5, sp, #8
    ldr r2, [r0, #268]
    add r0, sp, #16
    ldr r1, [r2, #124]
    bl . - 0x6E8
    ldr r0, [r4, #8]
    bl . - 0x6E8
    ldr r0, [r0, #12]
    add r1, sp, #16
    bl . - 0x6EC
    mov r2, r5
    mov r1, r6
    add r0, sp, #16
    bl . - 0x6F4
    ldr r0, [r4, #16]
    vldmia sp, {s0-s2}
    vstmia r0, {s0-s2}
    add sp, sp, #80
    pop {r4, r5, r6, pc}
.size func_000006FC, . - func_000006FC
