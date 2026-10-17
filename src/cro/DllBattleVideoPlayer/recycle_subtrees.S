/* Implementation authority: docs/specs/cro/DllBattleVideoPlayer.md.
 * Public symbolic reuse: src/main/arm_duplicate_recycle_subtrees_11.S.
 * Local entry labels keep recursion within each identity without relocations.
 */
.syntax unified
.arm

.macro recycle_subtree name
.section .text.\name, "ax", %progbits
.balign 4
.global \name
.type \name, %function
\name:
.Lentry_\name:
    cmp r1, #0
    bxeq lr
    push {r4, r5, lr}
    mov r5, r0
    mov r4, r1
.Lloop_\name:
    mov r0, r5
    ldr r1, [r4, #12]
    bl .Lentry_\name
    ldr r1, [r5, #4]
    ldr r0, [r4, #8]
    str r1, [r4, #12]
    str r4, [r5, #4]
    movs r4, r0
    bne .Lloop_\name
    pop {r4, r5, pc}
.size \name, . - \name
.endm

recycle_subtree func_0000DCEC
recycle_subtree func_0000E494
