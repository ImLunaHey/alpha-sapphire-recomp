.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00001840, "ax", %progbits
.balign 4
.global func_00001840
.type func_00001840, %function
func_00001840:
    push {r3, r4, r5, r6, r7, lr}
    mov r5, r1
    ldr r4, [r0, #0x28]
    ldrsh r1, [r0, #0x16]
    ldr r0, [r0, #0x10]
    bl . - 0x181C
    add r1, r5, r5, lsl #3
    ldr r2, [r4]
    add r5, r0, r1, lsl #3
    mov r6, r5
    mov r1, r6
    mov r0, r2
    bl . - 0x650
    ldrh r0, [r5]
    ldr r5, [r4]
    cmp r0, #0
    beq .Lempty_00001840
    mov r1, r6
    mov r0, r5
    bl . + 0x60
.Lfinish_00001840:
    ldr r0, [r4]
    mov r2, #0xAA
    str r2, [sp]
    mov r1, #0x82
    ldr r0, [r0, #0xB4]
    add r3, r1, #0x8C
    mov r2, #0x1E
    bl . - 0x1714
    pop {r3, r4, r5, r6, r7, pc}
.Lempty_00001840:
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl . - 0x1798
    ldr r5, [r5, #0x8C]
    mov r6, #0
    ldr r0, [r5, #0x24]
    cmp r0, #0
    beq .Lclear_00001840
    mov r2, #1
    mov r1, r6
    bl . - 0x1738
.Lclear_00001840:
    strb r6, [r5, #0x28]
    b .Lfinish_00001840
.size func_00001840, . - func_00001840
