.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_0000545C, "ax", %progbits
.balign 4
.global func_0000545C
.type func_0000545C, %function
func_0000545C:
    push {r3-r5, lr}
    mov r4, r0
    ldr r0, [pc, #0x34]
    mov r3, #0
    add r5, r0, r1, lsl #3
    ldr r1, [r4, #0x10]
    ldrb r2, [r5, #4]
    add r0, r4, #4
    bl . - 0x5364
    mov r0, #1
    str r0, [sp]
    ldrb r2, [r5, #4]
    ldr r1, [r4, #0x10]
    mov r3, #0
    add r0, r4, #4
    bl . - 0x5440
    pop {r3-r5, pc}
.size func_0000545C, . - func_0000545C
