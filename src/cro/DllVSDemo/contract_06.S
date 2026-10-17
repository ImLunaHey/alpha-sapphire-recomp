.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_000018A8, "ax", %progbits
.balign 4
.global func_000018A8
.type func_000018A8, %function
func_000018A8:
    push {lr}
    sub sp, sp, #0x14
    vldr s0, [pc, #0x30]
    vldr s1, [pc, #0x30]
    vstr s0, [sp]
    vstr s0, [sp, #4]
    add r2, sp, #8
    mov r1, sp
    mov r0, #0
    vstmia r2, {s0-s1}
    bl . - 0x1720
    mov r1, sp
    mov r0, #1
    bl . - 0x172C
    add sp, sp, #0x14
    pop {pc}
.size func_000018A8, . - func_000018A8
