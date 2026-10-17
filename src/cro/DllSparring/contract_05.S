.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_0000CE58, "ax", %progbits
.balign 4
.global func_0000CE58
.type func_0000CE58, %function
func_0000CE58:
    push {r4-r8}
    add r1, r1, r1, lsl #3
    mov r6, #0x10
    ldr r5, [r0]
    ldr ip, [sp, #0x14]
    vmov s0, r3
    add r8, r5, r1, lsl #2
    mov r4, #4
    strb ip, [r8]
    add ip, r6, r1, lsl #2
    ldr r6, [r0]
    add r4, r4, r1, lsl #2
    vcvt.f32.u32 s1, s0
    mov r7, #0xC
    str r2, [r6, r4]
    ldr r2, [r0]
    vmov s0, r3
    add r5, r7, r1, lsl #2
    mov r7, #0x14
    str r3, [r2, r5]
    ldr r2, [r0]
    add r1, r7, r1, lsl #2
    vcvt.f32.u32 s0, s0
    add r2, r2, ip
    vstr s1, [r2]
    ldr r0, [r0]
    add r0, r0, r1
    vstr s0, [r0]
    pop {r4-r8}
    bx lr
.size func_0000CE58, . - func_0000CE58
