.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_000022D4, "ax", %progbits
.balign 4
.global func_000022D4
.type func_000022D4, %function
func_000022D4:
    vldr s0, [pc, #0x20]
    vstr s0, [r0]
    vstr s0, [r0, #4]
    vstr s0, [r0, #8]
    vstr s0, [r0, #0xC]
    vstr s0, [r0, #0x10]
    vstr s0, [r0, #0x14]
    vstr s0, [r0, #0x18]
    vstr s0, [r0, #0x1C]
    bx lr
.size func_000022D4, . - func_000022D4
