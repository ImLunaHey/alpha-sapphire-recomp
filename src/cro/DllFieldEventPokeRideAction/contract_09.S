.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00000494, "ax", %progbits
.balign 4
.global func_00000494
.type func_00000494, %function
func_00000494:
    push {r4, r5, r6, r7, r8, lr}
    mov r5, r0
    mov r4, r1
    mov r7, r2
    vpush {d8}
    mov r6, #0
    ldrb r0, [r0, #0x2D]
    cmp r0, #0
    moveq r0, #1
    beq .Lreturn_00000494
    vldr s1, [r5, #0x35C]
    vldr s0, [pc, #0xFC]
    vldr s16, [pc, #0xFC]
    vcmpe.f32 s1, s0
    vmrs APSR_nzcv, fpscr
    ble .Lcheck_running_00000494
    vsub.f32 s1, s1, s16
    vstr s1, [r5, #0x35C]
    vcmpe.f32 s1, s0
    vmrs APSR_nzcv, fpscr
    bhi .Lcheck_running_00000494
    ldr r0, [r5, #0x1C]
    mov r3, #0
    mov r2, r3
    add r1, r5, #0x284
    ldr r0, [r0, #0x34]
    bl . - 0x454
    mov r0, #1
    strb r0, [r5, #0x2E]
    mov r1, r7
    mov r0, r4
    bl . - 0x460
    mov r3, #0
    ldr r0, [pc, #0xAC]
    mvn r2, #0
    mov r1, r3
    bl . - 0x46C
.Lcheck_running_00000494:
    ldrb r0, [r5, #0x2E]
    cmp r0, #0
    movne r6, #1
    movne r4, #0
    beq .Lresult_00000494
.Lpoll_loop_00000494:
    add r0, r5, r4
    ldrb r0, [r0, #0x27C]
    cmp r0, #0
    beq .Lnext_00000494
    mov r1, r4
    add r0, r5, #0x284
    bl . - 0x494
    cmp r0, #0
    nop
    bne .Lnext_00000494
    vldr s0, [r5, #0x358]
    mov r1, r4
    add r0, r5, #0x284
    bl . - 0x510
    mov r6, #0
.Lnext_00000494:
    add r4, r4, #1
    cmp r4, #5
    bcc .Lpoll_loop_00000494
    vldr s0, [r5, #0x358]
    cmp r6, #0
    vadd.f32 s0, s0, s16
    vstr s0, [r5, #0x358]
    ldrbne r0, [r5, #0x2E]
    cmpne r0, #0
    beq .Lresult_00000494
    ldr r0, [r5, #0x1C]
    add r1, r5, #0x284
    ldr r0, [r0, #0x34]
    bl . - 0x534
    mov r0, #0
    strb r0, [r5, #0x2E]
.Lresult_00000494:
    mov r0, r6
.Lreturn_00000494:
    vpop {d8}
    pop {r4, r5, r6, r7, r8, pc}
.size func_00000494, . - func_00000494
