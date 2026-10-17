.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00001AC0, "ax", %progbits
.balign 4
.global func_00001AC0
.type func_00001AC0, %function
func_00001AC0:
    ldr r2, [r1]
    add r3, r1, #0x14
    str r2, [r0]
    ldr r2, [r1, #4]
    str r2, [r0, #4]
    ldrb r2, [r1, #8]
    strb r2, [r0, #8]
    ldrh r2, [r1, #0xA]
    strh r2, [r0, #0xA]
    ldr r2, [r1, #0xC]
    str r2, [r0, #0xC]
    ldr r2, [r1, #0x10]
    str r2, [r0, #0x10]
    add r2, r0, #0x14
    vldmia r3, {s0-s2}
    vstmia r2, {s0-s2}
    ldr r1, [r1, #0x20]
    str r1, [r0, #0x20]
    bx lr
.size func_00001AC0, . - func_00001AC0

.section .text.func_00001B0C, "ax", %progbits
.balign 4
.global func_00001B0C
.type func_00001B0C, %function
func_00001B0C:
    push {r4}
    add ip, sp, #8
    ldr r4, [sp, #4]
    vldr s0, [sp, #0x14]
    vldmia ip, {s1-s2}
    ldr ip, [sp, #0x10]
    stmia r0, {r1, r2}
    add r1, r0, #0x14
    strb r3, [r0, #8]
    strh r4, [r0, #0xA]
    vstr s1, [r0, #0xC]
    vstr s2, [r0, #0x10]
    ldmia ip, {r2, r3, ip}
    stmia r1, {r2, r3, ip}
    vstr s0, [r0, #0x20]
    pop {r4}
    bx lr
.size func_00001B0C, . - func_00001B0C
