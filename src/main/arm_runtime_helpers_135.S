.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.section .text.func_005543FC, "ax", %progbits
.balign 4
.global func_005543FC
.type func_005543FC, %function
func_005543FC:
    cmp r1, #0
    bxeq lr
    push {r4, r5, r6, r7, r8, lr}
    mov r6, r0
    mov r4, r1
.L135_func_005543FC_loop:
    mov r0, r6
    ldr r1, [r4, #12]
    bl func_005543FC
    ldr r1, [r6, #4]
    mov r5, r4
    add r7, r4, #16
    ldr r4, [r4, #8]
    str r1, [r5, #12]
    ldr r0, [r7, #8]
    bl func_00160F9C
    mov r0, r7
    nop
    bl func_001862FC
    cmp r4, #0
    str r5, [r6, #4]
    bne .L135_func_005543FC_loop
    pop {r4, r5, r6, r7, r8, pc}
.L135_func_005543FC_body_end:
.size func_005543FC, .L135_func_005543FC_body_end - func_005543FC
