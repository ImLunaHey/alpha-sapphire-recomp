.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00000CD4, "ax", %progbits
.balign 4
.global func_00000CD4
.type func_00000CD4, %function
func_00000CD4:
    push {r4, lr}
    subs r4, r1, #0
    sub sp, sp, #0x40
    mov r2, r0
    bge .Lcopy_00000CD4
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl . - 0xC9C
    add sp, sp, #0x40
    mov r0, #1
    pop {r4, pc}
.Lcopy_00000CD4:
    ldr r1, [r2, #0x14]
    add r0, sp, #0x20
    mov r2, #0x20
    bl . - 0xCA0
    add r0, sp, #0x20
    vldmia r0, {s0-s7}
    vstmia sp, {s0-s7}
    ldrb r0, [sp, r4]
    add sp, sp, #0x40
    pop {r4, pc}
.size func_00000CD4, . - func_00000CD4
