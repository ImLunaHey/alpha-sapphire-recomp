.syntax unified
.arch armv6k
.fpu vfp
.arm

/*
 * Exact clean-room reconstruction of text [0x0bc, 0x0d0), from the neutral
 * DllTestPGL complete-unit specification.  This is a non-callable fragment of
 * the logical dispatcher: its jump table and remaining body are deliberately
 * not presented as separate functions.
 *
 * The equates retain the original intra-text relationships without embedding
 * any withheld scalar or export-name content.  The build includes this exact
 * gap section without claiming it as a standalone function; full dispatcher
 * ownership still awaits split-body schema support.
 */
.section .text.__cro_gap_000000bc, "ax", %progbits
.balign 4
dlltestpgl_dispatch_prefix:
.Ldispatcher_global_slot = dlltestpgl_dispatch_prefix + 0x88
.Ldispatcher_default = dlltestpgl_dispatch_prefix + 0x6c
    ldr     r2, [pc, #(.Ldispatcher_global_slot - . - 8)]
    cmp     r1, #5
    push    {r4, lr}
    ldrcc   pc, [pc, r1, lsl #2]
    b       .Ldispatcher_default
