.syntax unified
.arch armv6k
.fpu vfp
.arm

/*
 * Clean-room implementation of the public DllContestCommon contract.
 *
 * Calls use the module's six local import veneers.  The branch words are
 * resolved from the public section-relative addresses so the authored
 * function bodies do not acquire linker relocations that the target does not
 * have.  The undefined names below are deliberately neutral: the public spec
 * does not disclose the converted CRO's anonymous-import identities.
 */

.macro IMPORT_VENEER code, pool, number
.section .text.__cro_gap_000000\code, "ax", %progbits
.balign 4
    ldr pc, [pc, #-4]
.section .pool.__cro_pool_000000\pool, "a", %progbits
.balign 1
.global __cro_pool_000000\pool
.type __cro_pool_000000\pool, %object
__cro_pool_000000\pool:
    .word dll_contest_common_import_\number
.size __cro_pool_000000\pool, 4
.endm

IMPORT_VENEER 00, 04, 0
IMPORT_VENEER 08, 0c, 1
IMPORT_VENEER 10, 14, 2
IMPORT_VENEER 18, 1c, 3
IMPORT_VENEER 20, 24, 4
IMPORT_VENEER 28, 2c, 5

/* Emit a relocation-free ARM BL to a veneer at the supplied text address. */
.macro CALL_VENEER target, function_address, function_label
    .inst 0xeb000000 | (((\target - (\function_address + (. - \function_label)) - 8) >> 2) & 0x00ffffff)
.endm

.macro FUNCTION_BEGIN name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
.endm

.macro FUNCTION_END name, bytes
    .if (. - \name) != \bytes
        .error "DllContestCommon function differs from its public boundary"
    .endif
.size \name, . - \name
.endm

/* Build resources using the public exact register and frame schedule. */
FUNCTION_BEGIN func_00000030
    push {r4-r7, lr}
    mov r5, r0
    sub sp, sp, #28
    ldr r1, [r0]
    mov r0, #120
    CALL_VENEER 0x00, 0x30, func_00000030
    movs r4, r0
    beq .Lstore_builder
    ldr r0, [r5]
    ldr r1, [r0]
    ldr r1, [r1, #0x34]
    blx r1
    mov r1, r0
    mov r3, #1
    mov r2, #242
    mov r0, r4
    CALL_VENEER 0x08, 0x30, func_00000030
.Lstore_builder:
    mov r1, #0
    str r0, [r5, #4]
    CALL_VENEER 0x10, 0x30, func_00000030
    mov r4, r0
    ldr r0, [r5]
    ldr r1, [r0]
    ldr r1, [r1, #0x34]
    blx r1
    mov r1, r4
    CALL_VENEER 0x18, 0x30, func_00000030
    mov r4, r0
    ldr r0, [r5, #4]
    mov r2, r4
    mov r1, #0
    CALL_VENEER 0x20, 0x30, func_00000030
    str r4, [r5, #8]

    ldr r0, [r5, #4]
    mov r1, #1
    CALL_VENEER 0x10, 0x30, func_00000030
    mov r4, r0
    ldr r0, [r5]
    ldr r1, [r0]
    ldr r1, [r1, #0x34]
    blx r1
    mov r1, r4
    CALL_VENEER 0x18, 0x30, func_00000030
    mov r4, r0
    ldr r0, [r5, #4]
    mov r2, r4
    mov r1, #1
    CALL_VENEER 0x20, 0x30, func_00000030
    str r4, [r5, #0x0c]

    ldr r0, [r5, #4]
    mov r1, #2
    CALL_VENEER 0x10, 0x30, func_00000030
    mov r4, r0
    ldr r0, [r5]
    ldr r1, [r0]
    ldr r1, [r1, #0x34]
    blx r1
    mov r1, r4
    CALL_VENEER 0x18, 0x30, func_00000030
    str r0, [r5, #0x10]
    ldr r3, [r5, #4]
    mov r2, r0
    mov r1, #2
    mov r0, r3
    CALL_VENEER 0x20, 0x30, func_00000030

    ldr r0, [r5, #4]
    mov r1, #3
    CALL_VENEER 0x10, 0x30, func_00000030
    mov r4, r0
    ldr r0, [r5]
    ldr r1, [r0]
    ldr r1, [r1, #0x34]
    blx r1
    mov r1, r4
    CALL_VENEER 0x18, 0x30, func_00000030
    mov r4, r0
    ldr r0, [r5, #4]
    mov r2, r4
    mov r1, #3
    CALL_VENEER 0x20, 0x30, func_00000030
    str r4, [r5, #0x14]

    /* Copy five selector words together and the sixth separately. */
    .inst 0xe59f4000 | (0x208 - (0x30 + (. - func_00000030)) - 8)
    mov r7, sp
    ldmia r4, {r0-r3, ip}
    ldr r4, [r4, #20]
    str r4, [sp, #20]
    stmia sp, {r0-r3, ip}
    mov r4, #0
.Lsecond_loop:
    ldr r0, [r5, #4]
    ldr r1, [r7, r4, lsl #2]
    CALL_VENEER 0x10, 0x30, func_00000030
    mov r6, r0
    ldr r0, [r5]
    ldr r1, [r0]
    ldr r1, [r1, #0x34]
    blx r1
    mov r1, r6
    CALL_VENEER 0x18, 0x30, func_00000030
    mov r6, r0
    ldr r0, [r5, #4]
    ldr r1, [r7, r4, lsl #2]
    mov r2, r6
    CALL_VENEER 0x20, 0x30, func_00000030
    add r0, r5, r4, lsl #2
    add r4, r4, #1
    cmp r4, #6
    str r6, [r0, #0x18]
    bcc .Lsecond_loop

    ldr r0, [r5, #4]
    cmp r0, #0
    beq .Lbuild_done
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
    mov r0, #0
    str r0, [r5, #4]
.Lbuild_done:
    add sp, sp, #28
    pop {r4-r7, pc}
FUNCTION_END func_00000030, 0x1d8

.section .pool.__cro_pool_00000208, "a", %progbits
.balign 1
.global __cro_pool_00000208
.type __cro_pool_00000208, %object
__cro_pool_00000208:
.Lselector_table_address:
    .word dll_contest_common_selectors
.size __cro_pool_00000208, 4

/* Initialize all twelve words, then populate the ten owned resources. */
FUNCTION_BEGIN func_0000020C
    push {r4, lr}
    mov r4, r0
    mov r0, #0
    str r0, [r4, #4]
    str r1, [r4]
    str r0, [r4, #8]
    str r0, [r4, #0x18]
    str r0, [r4, #0x1c]
    str r0, [r4, #0x20]
    str r0, [r4, #0x24]
    str r0, [r4, #0x28]
    str r0, [r4, #0x2c]
    str r0, [r4, #0x0c]
    str r0, [r4, #0x10]
    str r0, [r4, #0x14]
    mov r0, r4
    /* func_00000030 begins at text address 0x30. */
    CALL_VENEER 0x30, 0x20c, func_0000020C
    mov r0, r4
    pop {r4, pc}
FUNCTION_END func_0000020C, 0x4c

/* Release in address order and retain the specified second-loop asymmetry. */
FUNCTION_BEGIN func_00000258
    push {r4-r6, lr}
    mov r5, r0
    ldr r0, [r0, #8]
    CALL_VENEER 0x28, 0x258, func_00000258
    mov r6, #0
    str r6, [r5, #8]
    ldr r0, [r5, #0x0c]
    CALL_VENEER 0x28, 0x258, func_00000258
    str r6, [r5, #0x0c]
    ldr r0, [r5, #0x10]
    CALL_VENEER 0x28, 0x258, func_00000258
    str r6, [r5, #0x10]
    ldr r0, [r5, #0x14]
    CALL_VENEER 0x28, 0x258, func_00000258
    mov r4, #0
    str r6, [r5, #0x14]
.Lrelease_second:
    add r0, r5, r4, lsl #2
    ldr r0, [r0, #0x18]
    CALL_VENEER 0x28, 0x258, func_00000258
    add r4, r4, #1
    cmp r4, #6
    mov r0, r5
    str r6, [r5, #0x14]
    bcc .Lrelease_second
    pop {r4-r6, pc}
FUNCTION_END func_00000258, 0x64

/*
 * The public CRO control entry is non-contiguous: this prelude dispatches
 * through the following pool, while the cases and diagnostic tail live in
 * the second gap.  Neither fragment is advertised as an STT_FUNC.
 */
.section .text.__cro_gap_000002bc, "ax", %progbits
.balign 4
.Lcontrol_entry:
    /* Load .data through the first word of the terminal pool at 0x344. */
    .inst 0xe59f2080
    cmp r1, #5
    push {r4, lr}
    ldrcc pc, [pc, r1, lsl #2]
    /* Unsupported operations continue at text address 0x328. */
    .inst 0xea000015
.if (. - .Lcontrol_entry) != 0x14
    .error "DllContestCommon control prelude differs from its public gap"
.endif

/* Public five-entry control jump table, expressed only as relocations. */
.section .pool.__cro_pool_000002d0, "a", %progbits
.balign 1
.global __cro_pool_000002d0
.type __cro_pool_000002d0, %object
__cro_pool_000002d0:
    .word .Lcontrol_case_base + 0x00
    .word .Lcontrol_case_base + 0x08
    .word .Lcontrol_case_base + 0x10
    .word .Lcontrol_case_base + 0x1c
    .word .Lcontrol_case_base + 0x2c
.size __cro_pool_000002d0, . - __cro_pool_000002d0

.section .text.__cro_gap_000002e4, "ax", %progbits
.balign 4
.Lcontrol_case_base:
    /* operation 0: absent exception-information node */
    .inst 0xe59f105c
    b .Lcontrol_store_word

    /* operation 1: save the loader-supplied CRO-end pointer */
    str r0, [r2]
    b .Lcontrol_success

    /* operation 2: report the saved CRO-end pointer */
    ldr r1, [r2]
.Lcontrol_store_word:
    str r1, [r0]
    b .Lcontrol_success

    /* operation 3: empty first initializer range (.text + 0x368) */
    .inst 0xe59f1044
    str r1, [r0]
    .inst 0xe59f1040
    b .Lcontrol_store_end

    /* operation 4: empty second initializer range (.rodata + 0x18) */
    .inst 0xe59f103c
    str r1, [r0]
    .inst 0xe59f1038
.Lcontrol_store_end:
    str r1, [r0, #4]
.Lcontrol_success:
    mov r0, #0
    pop {r4, pc}

    /* Fixed public toolchain diagnostic sequence for unsupported selectors. */
    .inst 0xe59f002c
    nop
    .inst 0xe59f0028
    msr CPSR_c, #0
    nop
    .inst 0xe59f0020
    pop {r4, pc}
.if (. - .Lcontrol_case_base) != 0x60
    .error "DllContestCommon control cases differ from their public gap"
.endif

/* Terminal control literals and their public relocation classes. */
.section .pool.__cro_pool_00000344, "a", %progbits
.balign 1
.global __cro_pool_00000344
.type __cro_pool_00000344, %object
__cro_pool_00000344:
    .word dll_contest_common_global
    .word 0
    .word .Lcontrol_pool_end
    .word .Lcontrol_pool_end
    .word dll_contest_common_selectors + 0x18
    .word dll_contest_common_selectors + 0x18
    .word 0x30000000
    .word 0x30000026
    .word 0xd8e12c21
.Lcontrol_pool_end:
.size __cro_pool_00000344, . - __cro_pool_00000344

/* The selectors are a link-unit contract, not an inferred lookup table. */
.section .rodata, "a", %progbits
.balign 4
.type dll_contest_common_selectors, %object
dll_contest_common_selectors:
    .word 5, 6, 7, 8, 9, 10
.size dll_contest_common_selectors, . - dll_contest_common_selectors

/* Sole writable module-global pointer used by the control entry. */
.section .data, "aw", %progbits
.balign 4
.type dll_contest_common_global, %object
dll_contest_common_global:
    .word 0
.size dll_contest_common_global, . - dll_contest_common_global
