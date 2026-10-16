# Probe-verified duplicate ARM templates 63

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, normalized complete-body duplicate grouping, bounded target
  control/data-flow inspection, direct-transfer resolution, boundary
  inspection, and an independent GNU Arm Embedded 15.2 mnemonic-only probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private literal values, implementation source, or proprietary
  source.

Every function already exact in the current report and every function named by
an existing tracked implementation contract was excluded. The concurrent
duplicate, IPC, and runtime batch 62 reservations were also excluded. These two
ARM-state functions share one 300-byte schedule, totaling 600 executable bytes:

```text
func_0016F94C  func_005587C0
```

## Observable contract

The routine accepts a result-record pointer in `r0`, a tree-like container in
`r1`, and a pointer to a word key in `r2`. The result record contains a node
pointer at offset zero and a boolean byte at offset four. The container's
offset-16 word identifies a header node whose offset-4 word is the root; its
offset-8 word participates in the boundary test below. Ordinary nodes contain
a byte field at offset zero, a parent pointer at offset four, left and right
links at offsets eight and twelve, and an unsigned word key at offset sixteen.

Starting at the root, the routine performs an unsigned lower-bound-style tree
walk. A smaller input key follows the offset-eight link and records direction
one; an equal or larger key follows the offset-twelve link and records
direction zero. The final visited node is retained as an insertion parent.
The input key is loaded only when the root is non-null, matching the target's
conditional access behavior.

If the container byte at offset 24 is nonzero, the routine takes the insertion
path immediately. Otherwise, it derives a predecessor-like candidate from the
final node and direction. The exact traversal is normative: direction zero
uses the final node directly; direction one first checks the header's
offset-eight link, then uses the node byte and parent relationships to choose
between a direct related node, the rightmost descendant of the left subtree,
or an upward parent walk. The candidate's offset-16 key is compared unsigned
with the input key. A candidate key greater than or equal to the input key is
returned as an existing node; a smaller candidate causes insertion.

On insertion, the original key pointer is placed at stack offset zero and
stack offset four is passed in `r0` to the per-expansion insertion helper. The
helper inherits the live container, traversal node, and direction state in the
remaining argument registers. Its node result from stack offset four is stored
in the caller's result record, the result byte is set to one, and that node
pointer remains in `r0` on return. On the existing-node path, the selected
candidate is stored in the result record, the result byte is cleared, and
`r0` returns zero.

Null or malformed non-null result records, containers, headers, roots, nodes,
or key pointers retain the target's original conditional-access and faulting
behavior. The insertion helper's inherited register state and non-return
behavior are likewise preserved.

## Transfers, labels, and boundaries

Each expansion has exactly one linked call and no indirect call or external
tail branch:

| Function | Offset | Relocation | Destination | Role |
| --- | ---: | --- | --- | --- |
| `func_0016F94C` | +256 | `R_ARM_CALL` | `func_0015E4C4` | insert new node |
| `func_005587C0` | +256 | `R_ARM_CALL` | `func_00558928` | insert new node |

The complete set of local branch destinations is +44, +80, +152, +176, +196,
+212, +232, +248, and +280. Each function symbol ends at +300, with no owned
literal pool or trailing template material. In both cases the next inventoried
global starts immediately at +300.

## Complete exact schedule

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT63_BODY name, insertion_helper
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, lr}
    mov     r4, r0
    mov     r0, r2
    ldr     r3, [r1, #16]
    sub     sp, sp, #12
    mov     r6, #1
    mov     r7, r3
    ldr     r2, [r3, #4]
    cmp     r2, #0
    ldrne   r12, [r0]
    beq     .Ldt63_search_done\@
.Ldt63_search\@:
    ldr     r5, [r2, #16]
    mov     r3, r2
    cmp     r12, r5
    ldrcc   r2, [r3, #8]
    ldrcs   r2, [r3, #12]
    movcc   r6, #1
    movcs   r6, #0
    cmp     r2, #0
    bne     .Ldt63_search\@
.Ldt63_search_done\@:
    ldrb    r12, [r1, #24]
    mov     r5, #1
    cmp     r12, #0
    bne     .Ldt63_insert\@
    cmp     r6, #0
    mov     r12, r3
    beq     .Ldt63_compare_candidate\@
    ldr     r12, [r7, #8]
    cmp     r3, r12
    beq     .Ldt63_insert\@
    ldrb    r12, [r3]
    cmp     r12, #0
    bne     .Ldt63_predecessor_left\@
    ldr     r12, [r3, #4]
    ldr     r6, [r12, #4]
    cmp     r6, r3
    ldreq   r12, [r3, #12]
    beq     .Ldt63_compare_candidate\@
.Ldt63_predecessor_left\@:
    ldr     r12, [r3, #8]
    cmp     r12, #0
    beq     .Ldt63_predecessor_parent\@
    ldr     r6, [r12, #12]
    cmp     r6, #0
    beq     .Ldt63_compare_candidate\@
.Ldt63_predecessor_rightmost\@:
    mov     r12, r6
    ldr     r6, [r6, #12]
    cmp     r6, #0
    bne     .Ldt63_predecessor_rightmost\@
    b       .Ldt63_compare_candidate\@
.Ldt63_predecessor_parent\@:
    ldr     r12, [r3, #4]
    ldr     r7, [r12, #8]
    cmp     r3, r7
    bne     .Ldt63_compare_candidate\@
.Ldt63_predecessor_ascend\@:
    mov     r6, r12
    ldr     r12, [r12, #4]
    ldr     r7, [r12, #8]
    cmp     r6, r7
    beq     .Ldt63_predecessor_ascend\@
.Ldt63_compare_candidate\@:
    ldr     r7, [r0]
    ldr     r6, [r12, #16]
    cmp     r6, r7
    bcs     .Ldt63_existing\@
.Ldt63_insert\@:
    str     r0, [sp]
    add     r0, sp, #4
    bl      \insertion_helper
    ldr     r0, [sp, #4]
    str     r0, [r4]
    strb    r5, [r4, #4]
    add     sp, sp, #12
    pop     {r4, r5, r6, r7, pc}
.Ldt63_existing\@:
    mov     r0, #0
    str     r12, [r4]
    strb    r0, [r4, #4]
    add     sp, sp, #12
    pop     {r4, r5, r6, r7, pc}
.size \name, .-\name
.endm

DT63_BODY func_0016F94C, func_0015E4C4
DT63_BODY func_005587C0, func_00558928
```

Labels must be uniquely scoped per expansion.

## Independent exact-probe evidence

The complete schedule above was assembled independently with GNU Arm Embedded
15.2. Each 300-byte body matched its target body after only its single audited
external call field was normalized. Every local branch, prologue, epilogue,
comparison, conditional operation, memory operation, and result store matched
without normalization. The relocatable probe produced exactly the one expected
`R_ARM_CALL` relocation per expansion. Temporary probe and extracted material
were deleted after verification.

## Clean-room handoff

Implement only from this document and
`config/arm-duplicate-templates-63.json`. Keep each insertion helper symbolic.
A validator should check body sizes, instruction counts, exact ordered
relocations, complete local branch destinations, absence of literal ownership,
next-global boundaries, and complete target-body identity after external-call
normalization. Do not transcribe target encodings or private target material
into source, scripts, configuration, or documentation.
