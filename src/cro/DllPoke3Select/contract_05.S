.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00002694, "ax", %progbits
.balign 4
.global func_00002694
.type func_00002694, %function
func_00002694:
    vldmia r1, {s0-s2}
    mov ip, #0
    vstr s0, [r0, #4]
    vstr s1, [r0, #8]
    vstr s2, [r0, #0xC]
    vldmia r1, {s0-s2}
    vstr s0, [r0, #0x1C]
    vstr s1, [r0, #0x20]
    vstr s2, [r0, #0x24]
    vldmia r2, {s0-s2}
    vstr s0, [r0, #0x10]
    vstr s1, [r0, #0x14]
    vstr s2, [r0, #0x18]
    str r3, [r0, #0x2C]
    str ip, [r0, #0x28]
    strb ip, [r0, #0x30]
    bx lr
.size func_00002694, . - func_00002694
