.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00001FB0, "ax", %progbits
.balign 4
.global func_00001FB0
.type func_00001FB0, %function
func_00001FB0:
    cmn r0, #0x18
    push {r4, lr}
    beq .Lmissing_00001FB0
    add r0, r0, r1, lsl #2
    ldr r4, [r0, #0x18]
    cmp r4, #0
    beq .Lmissing_00001FB0
    ldr r0, [r4]
    mov r1, #0
    ldr r2, [r0, #0xF4]
    mov r0, r4
    blx r2
    cmp r0, #0
    beq .Lreturn_00001FB0
    ldr r0, [r4]
    mov r1, #0
    vldr s0, [pc, #0x18]
    ldr r2, [r0, #0xD4]
    mov r0, r4
    blx r2
    mov r0, #1
.Lreturn_00001FB0:
    pop {r4, pc}
.Lmissing_00001FB0:
    mov r0, #0
    pop {r4, pc}
.size func_00001FB0, . - func_00001FB0
