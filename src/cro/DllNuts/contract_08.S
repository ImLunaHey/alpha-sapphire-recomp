.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_00004D84, "ax", %progbits
.balign 4
.global func_00004D84
.type func_00004D84, %function
func_00004D84:
    push {r4, r5}
    ldr r4, [pc, #0x78]
    mov r2, #0
    vldr s3, [pc, #0x6C]
    mov r5, r2
.Lscan_00004D84:
    add r1, r2, r2, lsl #3
    add r1, r0, r1, lsl #2
    ldrb r3, [r1, #0x38]
    cmp r3, #1
    bne .Ladvance_00004D84
    vldr s0, [r1, #0x30]
    vldr s1, [r1, #0x2C]
    vldr s2, [r1, #0x34]
    vsub.f32 s0, s0, s3
    vmov r12, s0
    cmp r12, r4
    bls .Lupdate_00004D84
    add r3, r1, #0x20
    vldmia r3, {s0-s2}
    vstr s0, [r1, #0x2C]
    strb r5, [r1, #0x38]
    add r1, r1, #0x30
    vstmia r1, {s1-s2}
    b .Ladvance_00004D84
.Lupdate_00004D84:
    vstr s1, [r1, #0x2C]
    vstr s0, [r1, #0x30]
    vstr s2, [r1, #0x34]
.Ladvance_00004D84:
    add r2, r2, #1
    cmp r2, #0xA
    blt .Lscan_00004D84
    pop {r4, r5}
    bx lr
.size func_00004D84, . - func_00004D84
