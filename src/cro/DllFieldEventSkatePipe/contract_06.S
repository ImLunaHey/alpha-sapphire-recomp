.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00000BD4, "ax", %progbits
.balign 4
.global func_00000BD4
.type func_00000BD4, %function
func_00000BD4:
    push {r4, r5, lr}
    mov r4, r0
    ldr r0, [r0, #0x18]
    sub sp, sp, #0x3C
    mov r5, r1
    ldr r2, [r0, #0x10C]
    mov r0, sp
    ldr r1, [r2, #0x7C]
    bl . - 0xBE4
    ldr r0, [r4, #0x20]
    mov r3, #1
    mov r2, sp
    mov r1, r5
    bl . - 0xBC8
    ldr r0, [r4, #0x20]
    add r2, sp, #0x38
    mov r1, sp
    bl . - 0xBB0
    ldr r0, [sp, #0x38]
    bl . - 0xB98
    add sp, sp, #0x3C
    pop {r4, r5, pc}
.size func_00000BD4, . - func_00000BD4
