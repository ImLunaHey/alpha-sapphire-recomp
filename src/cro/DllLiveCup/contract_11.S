.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00005758, "ax", %progbits
.balign 4
.global func_00005758
.type func_00005758, %function
func_00005758:
    ldr r2, [pc, #0x34]
    mov r1, #0
    push {r4, lr}
    str r1, [r0, #4]
    str r2, [r0]
    str r1, [r0, #0x10]
    str r1, [r0, #0x14]
    str r1, [r0, #0x34]
    strb r1, [r0, #0x38]
    strb r1, [r0, #0x39]
    strb r1, [r0, #0x3A]
    add r0, r0, #0x40
    bl . - 0x5370
    sub r0, r0, #0x40
    pop {r4, pc}
.size func_00005758, . - func_00005758
