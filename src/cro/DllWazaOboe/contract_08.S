.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_000035D8, "ax", %progbits
.balign 4
.global func_000035D8
.type func_000035D8, %function
func_000035D8:
    push {r4-r6, lr}
    mov r4, r0
    sub sp, sp, #0x10
    mov r0, r1
    mov r5, r2
    mov r6, r3
    bl . - 0x3098
    mov r1, r5
    bl . - 0x3098
    mvn r1, #0
    cmp r0, #1
    str r1, [sp, #4]
    str r1, [sp, #8]
    beq .Lpositive_000035D8
    cmn r0, #1
    beq .Lnegative_000035D8
    b .Ldispatch_000035D8
.Lpositive_000035D8:
    ldr r0, [pc, #0x48]
    ldr r1, [r0]
    str r1, [sp, #4]
    ldr r0, [r0]
    str r0, [sp, #8]
    b .Ldispatch_000035D8
.Lnegative_000035D8:
    ldr r0, [pc, #0x34]
    ldr r1, [r0]
    str r1, [sp, #4]
    ldr r0, [r0]
    str r0, [sp, #8]
.Ldispatch_000035D8:
    add r0, sp, #8
    str r0, [sp]
    ldr r1, [r4, #0x24]
    add r3, sp, #4
    mov r2, r6
    add r0, r4, #0x1C
    bl . - 0x30F8
    add sp, sp, #0x10
    pop {r4-r6, pc}
.size func_000035D8, . - func_000035D8
