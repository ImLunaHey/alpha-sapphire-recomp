.syntax unified
.arch armv6k
.fpu vfp
.arm

.macro import_veneer address, pool_address, import
.section .text.func_\address, "ax", %progbits
.balign 4
.global func_\address
.type func_\address, %function
func_\address:
    ldr pc, [pc, #-4]
.size func_\address, . - func_\address

.section .pool.__cro_pool_\pool_address, "a", %progbits
.balign 4
    .word \import
.endm

import_veneer 00000000, 00000004, __cro_import_anon_m7c7374617469637c_s0_002fd48
import_veneer 00000008, 0000000c, __cro_import_anon_m446c6c4669656c64_s0_0087014
import_veneer 00000010, 00000014, __cro_import_anon_m7c7374617469637c_s0_02dc63c
import_veneer 00000018, 0000001c, __cro_import_anon_m446c6c4669656c64_s0_00d8e40
import_veneer 00000020, 00000024, __cro_import_anon_m446c6c4669656c64_s0_0015d34
import_veneer 00000028, 0000002c, __cro_import_anon_m446c6c4669656c64_s0_00d8eb0
import_veneer 00000030, 00000034, __cro_import_anon_m446c6c4669656c64_s0_00158d4
import_veneer 00000038, 0000003c, __cro_import_anon_m7c7374617469637c_s0_01ff8c0

.section .text.func_0000007C, "ax", %progbits
.balign 4
.global func_0000007C
.type func_0000007C, %function
func_0000007C:
    push	{r4, r5, r6, r7, r8, r9, sl, lr}
    mov	r4, #0
    mov	r7, r0
    ldr	r0, [r0, #8]
    ldr	sl, [pc, #268]
    ldr	r0, [r0, #96]
    ldr	r0, [r0, #28]
    ldr	r0, [r0, #40]
    ldrh	r9, [r0, #12]
.Lfunc_0000007C_0024:
    add	r0, r4, r4, lsl #2
    add	r5, sl, r0, lsl #1
    ldrh	r0, [r5]
    cmp	r0, #536
    bcs .Lfunc_0000007C_0040
    cmp	r0, r9
    bne .Lfunc_0000007C_0114
.Lfunc_0000007C_0040:
    ldr	r1, [r7, #8]
    ldrb	r2, [r5, #6]
    mov	r6, r5
    ldr	r0, [r1, #96]
    ldr	r8, [r1, #368]
    cmp	r2, #0
    ldr	r0, [r0, #28]
    beq .Lfunc_0000007C_00b0
    ldrh	r1, [r6, #8]
    ldr	r0, [r0]
    add	r0, r0, #65536
    add	r0, r0, #12608
    bl . - 0xEC
    cmp	r0, #0
    nop
    beq .Lfunc_0000007C_0114
    ldrh	r2, [r6, #4]
    ldrh	r1, [r6, #2]
    mov	r0, r8
    bl . - 0x100
.Lfunc_0000007C_0090:
    movs	r6, r0
    beq .Lfunc_0000007C_0114
    ldrb	r0, [r5, #7]
    cmp	r0, #0
    beq .Lfunc_0000007C_00c4
    cmp	r0, #1
    bne .Lfunc_0000007C_0114
    b .Lfunc_0000007C_00f4
.Lfunc_0000007C_00b0:
    nop
    bl . - 0x120
    nop
    nop
    b .Lfunc_0000007C_0090
.Lfunc_0000007C_00c4:
    mov	r1, #0
    mov	r0, r6
    bl . - 0x130
    vmov	r0, s0
    cmp	r0, #1065353216
    bge .Lfunc_0000007C_0114
    mov	r1, #0
    mov	r0, r6
    bl . - 0x140
    nop
    nop
    b .Lfunc_0000007C_0114
.Lfunc_0000007C_00f4:
    mov	r0, r6
    bl . - 0x14C
    cmp	r0, #0
    nop
    beq .Lfunc_0000007C_0114
    mov	r1, #0
    mov	r0, r6
    bl . - 0x15C
.Lfunc_0000007C_0114:
    add	r4, r4, #1
    cmp	r4, #4
    bcc .Lfunc_0000007C_0024
    pop	{r4, r5, r6, r7, r8, r9, sl, pc}
.size func_0000007C, . - func_0000007C
