.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00000570, "ax", %progbits
.balign 4
.global func_00000570
.type func_00000570, %function
func_00000570:
    push {r4-r7, lr}
    mov r5, r1
    mov r7, r2
    mov r0, r1
    vpush {d8-d9}
    vmov.f32 s17, s0
    sub sp, sp, #0x14
    bl . - 0x4FC
    subs r6, r0, #0
    vldrhi s16, [pc, #0x6C]
    vldrhi s18, [pc, #0x6C]
    mov r4, #0
    bls .Ldone_00000570
.Lnext_00000570:
    vstr s16, [sp]
    vstr s16, [sp, #4]
    vstr s16, [sp, #8]
    vstr s18, [sp, #0xC]
    ldr r0, [r5]
    mov r3, sp
    mov r2, r7
    mov r1, r4
    ldr r12, [r0, #0x54]
    mov r0, r5
    blx r12
    vstr s17, [sp, #0xC]
    ldr r0, [r5]
    mov r3, sp
    mov r2, r7
    mov r1, r4
    ldr r12, [r0, #0x50]
    mov r0, r5
    blx r12
    add r4, r4, #1
    cmp r4, r6
    bcc .Lnext_00000570
.Ldone_00000570:
    add sp, sp, #0x14
    vpop {d8-d9}
    pop {r4-r7, pc}
.size func_00000570, . - func_00000570
