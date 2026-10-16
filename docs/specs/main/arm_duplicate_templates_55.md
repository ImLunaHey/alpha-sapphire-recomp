# Probe-verified duplicate ARM templates 55

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body symbolic duplicate grouping, bounded target
  control-flow inspection, direct-call resolution, and an independent GNU Arm
  Embedded 15.2 mnemonic-only exact-body probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private literal values, implementation source, or proprietary
  source.

Every function already exact in the current report and every function named
by a tracked implementation contract was excluded. The concurrent IPC batch
51 and runtime batch 55 reservations were also excluded. These two ARM-state
functions share one 340-byte schedule, totaling 680 executable bytes:

```text
func_005597F4  func_0055A9E4
```

## Observable contract

The routine consumes four pointer arguments: an output iterator address in
`r0`, a tree-like owner in `r1`, and addresses of the beginning and ending
iterators in `r2` and `r3`. The owner field at +16 points to a header node.
Node links reside at +4, +8, and +12, while the owner count is at +20 and an
owner free-list head is at +4. The output is initialized to the header.

When the beginning is the header's +8 link, the ending is the header itself,
and the owner count is nonzero, the complete-range path clears the tree. It
walks from the header's +4 link down successive +8 links. For every visited
node it first invokes the expansion-specific clear helper on that node's +12
subtree, then prepends the node to the owner free list through its +12 link.
After the walk, it resets header +8 and +12 to the header, header +4 to zero,
and the owner count to zero. The output remains the header.

All other ranges use the iterative path. Before erasing the current node, the
routine computes its in-order successor: a non-null +12 child is followed by
repeated +8 links; otherwise the routine climbs +4 parents while coming from
their +12 links and applies the final parent test exactly as scheduled below.
The current node is retained in a stack temporary while the computed successor
is kept through the caller's beginning iterator address. The expansion-specific
erase helper receives the stack result address, owner, address of the current
stack temporary, and current node. Its returned iterator is copied to the
caller's output. Iteration stops when the beginning iterator equals the ending
iterator. Invalid pointers and malformed trees retain the target's original
faulting or nonterminating behavior.

The two expansion parameters are:

| Function | Clear helper at +92 | Erase helper at +304 |
| --- | --- | --- |
| `func_005597F4` | `func_00559948` | `func_00182CB0` |
| `func_0055A9E4` | `func_0055AB38` | `func_0055A388` |

## Boundaries and calls

Each function is exactly 340 bytes and 85 ARM instructions. No post-body
literal slot belongs to either function; the next named global starts at +340.
There are two direct linked calls and no indirect call or external tail branch:

| Offset | Relocation | Destination |
| ---: | --- | --- |
| +92 | `R_ARM_CALL` | expansion-specific clear helper above |
| +304 | `R_ARM_CALL` | expansion-specific erase helper above |

Ordinary local branch destinations are exactly +84, +120, +160, +168, +184,
+208, +228, +248, +272, and +288.

## Complete exact schedule

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT55_RANGE_ERASE name, clear_helper, erase_helper
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, lr}
    mov     r6, r0
    sub     sp, sp, #12
    ldr     r0, [r1, #16]
    mov     r5, r1
    mov     r4, r2
    str     r0, [r6]
    ldr     r0, [r1, #16]
    ldr     r2, [r2]
    mov     r7, r3
    ldr     r1, [r0, #8]
    cmp     r2, r1
    ldreq   r1, [r7]
    cmpeq   r1, r0
    bne     .Ldt55_iterate\@
    ldr     r1, [r5, #20]
    cmp     r1, #0
    beq     .Ldt55_iterate\@
    ldr     r4, [r0, #4]
    cmp     r4, #0
    beq     .Ldt55_reset\@
.Ldt55_clear_loop\@:
    ldr     r1, [r4, #12]
    mov     r0, r5
    bl      \clear_helper
    ldr     r2, [r5, #4]
    ldr     r1, [r4, #8]
    str     r2, [r4, #12]
    str     r4, [r5, #4]
    movs    r4, r1
    bne     .Ldt55_clear_loop\@
.Ldt55_reset\@:
    ldr     r1, [r5, #16]
    mov     r0, #0
    str     r1, [r1, #8]
    ldr     r1, [r5, #16]
    str     r0, [r1, #4]
    ldr     r1, [r5, #16]
    str     r1, [r1, #12]
    str     r0, [r5, #20]
    ldr     r0, [r5, #16]
    str     r0, [r6]
.Ldt55_return\@:
    add     sp, sp, #12
    pop     {r4, r5, r6, r7, pc}
.Ldt55_iterate\@:
    ldr     r0, [r4]
    ldr     r1, [r7]
    cmp     r0, r1
    beq     .Ldt55_return\@
.Ldt55_each\@:
    ldr     r1, [r0, #12]
    mov     r3, r0
    cmp     r1, #0
    movne   r0, r1
    strne   r1, [r4]
    beq     .Ldt55_climb\@
.Ldt55_descend\@:
    ldr     r0, [r0, #8]
    cmp     r0, #0
    strne   r0, [r4]
    bne     .Ldt55_descend\@
    b       .Ldt55_erase\@
.Ldt55_climb\@:
    mov     r1, r0
    ldr     r0, [r0, #4]
    ldr     r2, [r0, #12]
    cmp     r1, r2
    bne     .Ldt55_check_parent\@
.Ldt55_climb_loop\@:
    mov     r1, r0
    str     r0, [r4]
    ldr     r0, [r0, #4]
    ldr     r2, [r0, #12]
    cmp     r1, r2
    beq     .Ldt55_climb_loop\@
.Ldt55_check_parent\@:
    ldr     r1, [r4]
    ldr     r1, [r1, #12]
    cmp     r1, r0
    strne   r0, [r4]
.Ldt55_erase\@:
    add     r2, sp, #4
    mov     r1, r5
    mov     r0, sp
    str     r3, [sp, #4]
    bl      \erase_helper
    ldr     r0, [sp]
    str     r0, [r6]
    ldr     r0, [r4]
    ldr     r1, [r7]
    cmp     r0, r1
    bne     .Ldt55_each\@
    add     sp, sp, #12
    pop     {r4, r5, r6, r7, pc}
.size \name, .-\name
.endm

DT55_RANGE_ERASE func_005597F4, func_00559948, func_00182CB0
DT55_RANGE_ERASE func_0055A9E4, func_0055AB38, func_0055A388
```

Labels must be uniquely scoped per expansion. The second iteration branch goes
to +184, after the end comparison, rather than back to +168.

## Clean-room handoff

Implement only from this document and
`config/arm-duplicate-templates-55.json`. Keep both expansion-specific direct
destinations symbolic. A validator should check body sizes, instruction counts,
all local branch destinations, both direct call sites and relocations, absence
of literal material, and complete target-body identity after direct-call
normalization. Do not transcribe target encodings or private values into source,
scripts, configuration, or documentation.
