.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_0000BED0, "ax", %progbits
.balign 4
.global func_0000BED0
.type func_0000BED0, %function
func_0000BED0:
    cmp r1, #0
    bxeq lr
    push {r4, r5, lr}
    mov r5, r0
    mov r4, r1
.Ltransfer_0000BED0:
    mov r0, r5
    ldr r1, [r4, #0xC]
    bl . - 0x1C
    ldr r1, [r5, #4]
    ldr r0, [r4, #8]
    str r1, [r4, #0xC]
    str r4, [r5, #4]
    movs r4, r0
    bne .Ltransfer_0000BED0
    pop {r4, r5, pc}
.size func_0000BED0, . - func_0000BED0
