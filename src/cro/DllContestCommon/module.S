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
    .if (. - \name) > \bytes
        .error "DllContestCommon function exceeds its public boundary"
    .endif
    .rept (\bytes - (. - \name)) / 4
        nop
    .endr
.size \name, . - \name
.endm

/*
 * Build resources for selectors 0..3 and 5..10.
 * r4 = control object, r5 = transient builder, r6 = selector/cursor.
 */
FUNCTION_BEGIN func_00000030
    push {r4-r8, lr}
    sub sp, sp, #24
    mov r4, r0
    ldr r1, [r4]
    mov r0, #120
    CALL_VENEER 0x00, 0x30, func_00000030
    mov r5, r0
    str r5, [r4, #4]
    cmp r5, #0
    beq .Lfirst_selectors

    ldr r0, [r4]
    ldr r1, [r0]
    ldr r1, [r1, #0x34]
    blx r1
    mov r1, r0
    mov r0, r5
    mov r2, #242
    mov r3, #1
    CALL_VENEER 0x08, 0x30, func_00000030

.macro BUILD_FIXED selector, slot
    mov r0, r5
    mov r1, #\selector
    CALL_VENEER 0x10, 0x30, func_00000030
    mov r7, r0
    ldr r0, [r4]
    ldr r1, [r0]
    ldr r1, [r1, #0x34]
    blx r1
    mov r1, r7
    CALL_VENEER 0x18, 0x30, func_00000030
    mov r8, r0
    mov r0, r5
    mov r1, #\selector
    mov r2, r8
    CALL_VENEER 0x20, 0x30, func_00000030
    str r8, [r4, #\slot]
.endm

.Lfirst_selectors:
    BUILD_FIXED 0, 0x08
    BUILD_FIXED 1, 0x0c
    BUILD_FIXED 2, 0x10
    BUILD_FIXED 3, 0x14

    /* Copy the public six-word selector table to the local array. */
    /* Load the word at public text address 0x208 without a link relocation. */
    .inst 0xe59f0000 | (0x208 - (0x30 + (. - func_00000030)) - 8)
    ldmia r0!, {r1-r3, r6-r8}
    stmia sp, {r1-r3, r6-r8}
    mov r6, #0
.Lsecond_loop:
    ldr r7, [sp, r6, lsl #2]
    mov r0, r5
    mov r1, r7
    CALL_VENEER 0x10, 0x30, func_00000030
    mov r8, r0
    ldr r0, [r4]
    ldr r1, [r0]
    ldr r1, [r1, #0x34]
    blx r1
    mov r1, r8
    CALL_VENEER 0x18, 0x30, func_00000030
    mov r8, r0
    mov r0, r5
    mov r1, r7
    mov r2, r8
    CALL_VENEER 0x20, 0x30, func_00000030
    add r0, r4, r6, lsl #2
    str r8, [r0, #0x18]
    add r6, r6, #1
    cmp r6, #6
    blo .Lsecond_loop

    cmp r5, #0
    beq .Lbuild_done
    ldr r1, [r5]
    mov r0, r5
    ldr r1, [r1, #4]
    blx r1
    mov r0, #0
    str r0, [r4, #4]
.Lbuild_done:
    /* The normal path already set r0 to zero while clearing the builder. */
    add sp, sp, #24
    pop {r4-r8, pc}
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
    str r1, [r4]
    mov r1, #0
    str r1, [r4, #4]
    str r1, [r4, #8]
    str r1, [r4, #0x0c]
    str r1, [r4, #0x10]
    str r1, [r4, #0x14]
    str r1, [r4, #0x18]
    str r1, [r4, #0x1c]
    str r1, [r4, #0x20]
    str r1, [r4, #0x24]
    str r1, [r4, #0x28]
    str r1, [r4, #0x2c]
    mov r0, r4
    /* func_00000030 begins at text address 0x30. */
    CALL_VENEER 0x30, 0x20c, func_0000020C
    mov r0, r4
    pop {r4, pc}
FUNCTION_END func_0000020C, 0x4c

/* Release in address order and retain the specified second-loop asymmetry. */
FUNCTION_BEGIN func_00000258
    push {r4-r8, lr}
    mov r4, r0
    mov r7, #0
    ldr r0, [r4, #8]
    CALL_VENEER 0x28, 0x258, func_00000258
    str r7, [r4, #8]
    ldr r0, [r4, #0x0c]
    CALL_VENEER 0x28, 0x258, func_00000258
    str r7, [r4, #0x0c]
    ldr r0, [r4, #0x10]
    CALL_VENEER 0x28, 0x258, func_00000258
    str r7, [r4, #0x10]
    ldr r0, [r4, #0x14]
    CALL_VENEER 0x28, 0x258, func_00000258
    str r7, [r4, #0x14]

    add r5, r4, #0x18
    mov r6, #6
.Lrelease_second:
    ldr r0, [r5], #4
    CALL_VENEER 0x28, 0x258, func_00000258
    str r7, [r4, #0x14]
    subs r6, r6, #1
    bne .Lrelease_second
    mov r0, r4
    pop {r4-r8, pc}
FUNCTION_END func_00000258, 0x64

/* The selectors are a link-unit contract, not an inferred lookup table. */
.section .rodata, "a", %progbits
.balign 4
.type dll_contest_common_selectors, %object
dll_contest_common_selectors:
    .word 5, 6, 7, 8, 9, 10
.size dll_contest_common_selectors, . - dll_contest_common_selectors

/* Sole writable module-global pointer used by the supported control entry. */
.section .data, "aw", %progbits
.balign 4
.type dll_contest_common_global, %object
dll_contest_common_global:
    .word 0
.size dll_contest_common_global, . - dll_contest_common_global

/*
 * The non-contiguous module control entry is intentionally absent.  Its
 * selector >= 5 path has no semantic contract, so claiming the surrounding
 * gap would invent behavior and violate the fail-closed partition.
 */
