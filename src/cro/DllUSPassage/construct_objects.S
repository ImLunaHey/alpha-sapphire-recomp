/* Independent implementation from the neutral AS_EUR_REV2 schedules:
 * docs/specs/cro/DllUSPassage_AS_EUR_REV2.md and
 * docs/specs/cro/DllUSPassage_func_000013BC.md.
 * Veneers and adjacent literals are external segment-relative dependencies;
 * this section owns only the 204 ARM instructions, never their pools.
 */
.syntax unified
.arch armv6k
.fpu vfp
.arm

.section .text.func_000013BC, "ax", %progbits
.balign 4
.global func_000013BC
.type func_000013BC, %function

.macro PASSAGE_SITE offset
    .if (. - func_000013BC) != (\offset - 0x13bc)
        .error "neutral schedule offset differs"
    .endif
.endm
.macro PASSAGE_IMPORT offset, condition=
    bl\condition . + (\offset - 0x13bc - (. - func_000013BC))
.endm
.macro PASSAGE_LITERAL reg, offset
    ldr \reg, [pc, #(\offset - 0x13bc - (. - func_000013BC) - 8)]
.endm

func_000013BC:
    push {r4-r11, lr}
    vpush {d8}
    PASSAGE_SITE 0x13c4
    PASSAGE_LITERAL r4, 0x16ec
    sub sp, sp, #164
    mov r5, r0
    ldr r0, [r5, #8]
    ldr r1, [r0, #0x24]
    str r1, [sp, #0x0c]
    ldr r1, [r0, #0x2c]
    str r1, [sp, #0x24]
    ldr r1, [r0, #4]
    add r0, sp, #0x10
    str r4, [r0]
    str r4, [r0, #4]
    str r1, [sp, #0x90]
    str r4, [r0, #8]
    mov r0, #64
    PASSAGE_SITE 0x1400
    PASSAGE_IMPORT 0x0bc
    cmp r0, #0
    mov r9, #1
    mov r11, #0
    PASSAGE_SITE 0x1410
    beq .Lfixed_wrapper
    mov r1, r11
    mov r2, r11
    mov r3, r11
    stmia sp, {r9, r11}
    PASSAGE_SITE 0x1424
    PASSAGE_IMPORT 0x0fc
.Lfixed_wrapper:
    PASSAGE_SITE 0x1428
    str r0, [r5, #0xac]
    str r11, [sp]
    ldr r1, [sp, #0x0c]
    str r11, [sp, #4]
    ldr r2, [r5, #0xb4]
    add r3, sp, #0x10
    PASSAGE_SITE 0x1440
    PASSAGE_IMPORT 0x104
    cmp r0, #0
    nop
    PASSAGE_SITE 0x144c
    bne .Lfixed_secondary
    mov r0, r11
    mov r1, r11
    mov r2, r11
    PASSAGE_SITE 0x145c
    PASSAGE_IMPORT 0x10c
.Lfixed_secondary:
    PASSAGE_SITE 0x1460
    ldr r1, [sp, #0x90]
    mov r0, #36
    PASSAGE_SITE 0x1468
    PASSAGE_IMPORT 0x0bc
    cmp r0, #0
    nop
    PASSAGE_SITE 0x1474
    PASSAGE_IMPORT 0x114, ne
    mov r3, r0
    str r0, [r5, #0xb0]
    ldr r0, [r5, #0xac]
    mov r1, #2
    mov r2, r11
    mov r6, r11
    PASSAGE_SITE 0x1490
    PASSAGE_IMPORT 0x11c
    ldr r0, [r5, #8]
    mov r7, r11
    ldr r0, [r0, #0x60]
    ldr r0, [r0, #0x1c]
    ldr r0, [r0, #0x14]
    str r0, [sp, #0x88]
    PASSAGE_SITE 0x14ac
    PASSAGE_IMPORT 0x124
    cmp r0, #0
    PASSAGE_SITE 0x14b4
    vldrhi s16, [pc, #(0x16f0 - 0x13bc - (. - func_000013BC) - 8)]
    mov r8, r0
    PASSAGE_SITE 0x14bc
    bls .Lreturn

.Lscan:
    PASSAGE_SITE 0x14c0
    ldr r0, [sp, #0x88]
    mov r1, r6
    PASSAGE_SITE 0x14c8
    PASSAGE_IMPORT 0x12c
    mov r1, #2
    nop
    PASSAGE_SITE 0x14d4
    PASSAGE_IMPORT 0x134
    cmp r0, #0
    nop
    PASSAGE_SITE 0x14e0
    bne .Lnext
    PASSAGE_LITERAL r4, 0x16ec
    mov r9, #1
    str r4, [sp, #0x98]
    str r4, [sp, #0x9c]
    ldr r1, [sp, #0x90]
    str r4, [sp, #0xa0]
    mov r0, #64
    PASSAGE_SITE 0x1500
    PASSAGE_IMPORT 0x0bc
    cmp r0, #0
    nop
    PASSAGE_SITE 0x150c
    beq .Lentry_wrapper
    mov r1, r11
    mov r2, r11
    mov r3, r11
    str r9, [sp]
    str r11, [sp, #4]
    PASSAGE_SITE 0x1524
    PASSAGE_IMPORT 0x0fc
.Lentry_wrapper:
    PASSAGE_SITE 0x1528
    add r4, r5, r7, lsl #2
    str r0, [r4, #0x44]
    str r11, [sp]
    ldr r1, [sp, #0x0c]
    str r9, [sp, #4]
    ldr r2, [r4, #0x5c]
    add r3, sp, #0x98
    PASSAGE_SITE 0x1544
    PASSAGE_IMPORT 0x104

    /* D has one initialized byte, ten initialized words, and three
     * deliberately untouched padding bytes. Paired stores preserve order. */
    strb r11, [sp, #0x28]
    str r11, [sp, #0x2c]
    str r11, [sp, #0x30]
    mov r2, #4
    mov r3, r11
    add r0, sp, #0x34
    stmia r0, {r2, r3}
    str r11, [sp, #0x3c]
    str r11, [sp, #0x40]
    str r9, [sp, #0x50]
    str r9, [sp, #0x44]
    ldr r1, [sp, #0x90]
    mov r0, #200
    str r11, [sp, #0x48]
    str r11, [sp, #0x4c]
    PASSAGE_SITE 0x1584
    PASSAGE_IMPORT 0x0bc
    cmp r0, #0
    nop
    PASSAGE_SITE 0x1590
    PASSAGE_IMPORT 0x13c, ne
    str r0, [r4, #0x2c]
    add r12, sp, #0x28
    stmia sp, {r11, r12}
    ldr r0, [r4, #0x2c]
    ldr r1, [sp, #0x0c]
    ldr r2, [sp, #0x24]
    ldr r3, [r4, #0x44]
    ldr r12, [r0]
    ldr r12, [r12, #0x2c]
    PASSAGE_SITE 0x15b8
    blx r12
    ldr r0, [r4, #0x2c]
    mov r1, r11
    ldr r2, [r0]
    ldr r2, [r2, #0x1c]
    PASSAGE_SITE 0x15cc
    blx r2
    ldr r0, [r4, #0x2c]
    mvn r2, #0
    mov r3, r11
    str r11, [sp]
    add r1, sp, #4
    stmia r1, {r2, r3}
    ldr r1, [sp, #0x0c]
    ldr r2, [r5, #0xb0]
    ldr r12, [r0]
    ldr r12, [r12, #0x34]
    PASSAGE_SITE 0x15f8
    blx r12
    ldr r0, [r4, #0x2c]
    mov r1, r11
    vmov.f32 s0, s16
    ldr r2, [r0]
    ldr r2, [r2, #0x38]
    PASSAGE_SITE 0x1610
    blx r2
    ldr r0, [r4, #0x2c]
    mov r1, r11
    vmov.f32 s0, s16
    ldr r2, [r0]
    ldr r2, [r2, #0x40]
    PASSAGE_SITE 0x1628
    blx r2

    ldr r0, [r5, #0x24]
    PASSAGE_SITE 0x1630
    PASSAGE_LITERAL r1, 0x16f4
    add r10, sp, #0x14
    ldr r1, [r1, r7, lsl #2]
    ldr r2, [r0]
    ldr r2, [r2, #0x5c]
    PASSAGE_SITE 0x1644
    blx r2
    movs r9, r0
    PASSAGE_SITE 0x164c
    bmi .Lplace
    ldr r0, [r5, #0x24]
    mov r1, r10
    PASSAGE_SITE 0x1658
    PASSAGE_IMPORT 0x144
    ldr r0, [r5, #0x24]
    mov r1, r9
    add r2, sp, #0x58
    ldr r3, [r0]
    ldr r3, [r3, #0x64]
    PASSAGE_SITE 0x1670
    blx r3
    vldr s2, [sp, #0x64]
    vldr s3, [sp, #0x14]
    vldr s0, [sp, #0x74]
    vldr s1, [sp, #0x84]
    vadd.f32 s2, s3, s2
    vstr s2, [sp, #0x14]
    vldr s2, [sp, #0x18]
    vadd.f32 s0, s2, s0
    vstr s0, [sp, #0x18]
    vldr s0, [sp, #0x1c]
    vadd.f32 s0, s0, s1
    vstr s0, [sp, #0x1c]
.Lplace:
    PASSAGE_SITE 0x16a4
    ldr r0, [r4, #0x2c]
    mov r1, r10
    PASSAGE_SITE 0x16ac
    PASSAGE_IMPORT 0x14c
    ldr r0, [r5, #8]
    nop
    PASSAGE_SITE 0x16b8
    PASSAGE_IMPORT 0x024
    ldr r0, [r0, #0x34]
    ldr r1, [r4, #0x2c]
    mov r2, r11
    mov r3, r11
    PASSAGE_SITE 0x16cc
    PASSAGE_IMPORT 0x154
    add r7, r7, #1
.Lnext:
    PASSAGE_SITE 0x16d4
    add r6, r6, #1
    cmp r6, r8
    PASSAGE_SITE 0x16dc
    blo .Lscan
.Lreturn:
    PASSAGE_SITE 0x16e0
    add sp, sp, #164
    vpop {d8}
    pop {r4-r11, pc}
    PASSAGE_SITE 0x16ec
.size func_000013BC, . - func_000013BC
