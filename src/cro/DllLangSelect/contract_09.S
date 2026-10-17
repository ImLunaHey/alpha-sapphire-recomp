.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00000EB0, "ax", %progbits
.balign 4
.global func_00000EB0
.type func_00000EB0, %function
func_00000EB0:
    push {r4, r5, r6, r7, lr}
    cmp r1, #7
    mov r5, r0
    vldr s0, [pc, #0x94]
    vldr s1, [pc, #0x94]
    ldr r7, [pc, #0x94]
    mov r6, r1
    vpush {d8}
    sub sp, sp, #0xC
    vldr s16, [pc, #0x88]
    mov r4, r1
    vstmia sp, {s0-s1}
    vstr s0, [sp, #8]
    bcs .Lbackward_00000EB0
.Lforward_loop_00000EB0:
    ldr r2, [r7, r4, lsl #2]
    ldr r0, [r5, #4]
    mov r3, sp
    mov r1, #1
    bl . - 0xDE0
    vldr s0, [sp, #4]
    add r4, r4, #1
    cmp r4, #7
    vsub.f32 s0, s0, s16
    vstr s0, [sp, #4]
    bcc .Lforward_loop_00000EB0
.Lbackward_00000EB0:
    subs r4, r6, #1
    vldr s0, [pc, #0x48]
    vstr s0, [sp, #4]
    bmi .Ldone_00000EB0
.Lbackward_loop_00000EB0:
    ldr r2, [r7, r4, lsl #2]
    ldr r0, [r5, #4]
    mov r3, sp
    mov r1, #1
    bl . - 0xE1C
    vldr s0, [sp, #4]
    subs r4, r4, #1
    vadd.f32 s0, s0, s16
    vstr s0, [sp, #4]
    bpl .Lbackward_loop_00000EB0
.Ldone_00000EB0:
    add sp, sp, #0xC
    vpop {d8}
    pop {r4, r5, r6, r7, pc}
.size func_00000EB0, . - func_00000EB0
