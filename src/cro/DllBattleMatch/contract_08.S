.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_0000BE2C, "ax", %progbits
.balign 4
.global func_0000BE2C
.type func_0000BE2C, %function
func_0000BE2C:
.Lentry_0000BE2C:
    cmp r1, #0
    bxeq lr
    push {r4, r5, lr}
    mov r5, r0
    mov r4, r1
.Lnext_0000BE2C:
    mov r0, r5
    ldr r1, [r4, #0xC]
    bl .Lentry_0000BE2C
    ldr r1, [r5, #4]
    ldr r0, [r4, #8]
    str r1, [r4, #0xC]
    str r4, [r5, #4]
    movs r4, r0
    bne .Lnext_0000BE2C
    pop {r4, r5, pc}
.size func_0000BE2C, . - func_0000BE2C
