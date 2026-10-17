.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00002C0C, "ax", %progbits
.balign 4
.global func_00002C0C
.type func_00002C0C, %function
func_00002C0C:
    push {lr}
    sub sp, sp, #0xC
    vldr s1, [pc, #0x24]
    add r1, sp, #4
    vstr s1, [sp]
    mov r3, sp
    vstmia r1, {s0-s1}
    mov r2, #0x55
    ldr r0, [r0, #4]
    mov r1, #1
    bl . - 0x2984
    add sp, sp, #0xC
    pop {pc}
.size func_00002C0C, . - func_00002C0C
