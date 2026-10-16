# Probe-verified duplicate ARM templates 57

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body symbolic duplicate grouping, bounded target
  control/data-flow inspection, direct-call resolution, and an independent GNU
  Arm Embedded 15.2 mnemonic-only exact-body probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private literal values, implementation source, or proprietary
  source.

Every function already exact in the current report and every function named by
a tracked implementation contract was excluded. The concurrent IPC batch 53
and runtime batch 57 reservations were also excluded. These two ARM-state
functions share one 320-byte schedule, totaling 640 executable bytes:

```text
func_0018396C  func_0018F7A8
```

## Observable contract

The arguments are an output-word pointer in `r0`, an owner record in `r1`, a
current-node pointer slot in `r2`, and an end-node pointer slot in `r3`. The
owner fields at +4, +16, and +20 are respectively a free-list head, a tree
header pointer, and a tree element count. Tree nodes use parent, left, and
right links at +4, +8, and +12. On entry the routine writes the owner's tree
header to the output word.

When the current slot contains header +8, the end slot contains the header,
and the owner count is nonzero, the routine clears the entire tree. Starting
at header +4, it calls the expansion-specific clear helper on each node's +12
subtree, follows the node's +8 link, and prepends the node to the owner free
list through its +12 link. It then resets header +8 and +12 to the header,
clears header +4 and the owner count, writes the header to the output, and
returns. A failed boundary test or zero count selects the iterative path
instead.

The iterative path stops when the current slot equals the end slot. Otherwise
it computes the current node's in-order successor directly in the current
slot. A non-null +12 child is installed in the slot and followed down
successive +8 links. With no +12 child, it follows +4 parent links while the
node is their +12 child and applies the final parent test exactly as scheduled
below. It retains the current node in the second stack word, then calls the
expansion-specific erase helper with the first stack word as an output address,
the owner, and the second stack word as the current-node address. The helper's
first output word is copied to the caller's output, and iteration continues.

The expansion parameters are:

| Function | Clear helper at +92 | Erase helper at +304 |
| --- | --- | --- |
| `func_0018396C` | `func_0018A080` | `func_00189A24` |
| `func_0018F7A8` | `func_00192AE0` | `func_00192484` |

Invalid non-null pointers and malformed tree links retain the target's
original faulting or nonterminating behavior.

## Boundaries and calls

Each function is exactly 320 bytes and 80 ARM instructions. The next named
global starts at +320, so no post-body literal material belongs to either
function. There are two direct linked calls and no indirect call or external
tail branch:

| Offset | Relocation | Destination |
| ---: | --- | --- |
| +92 | `R_ARM_CALL` | expansion-specific clear helper above |
| +304 | `R_ARM_CALL` | expansion-specific erase helper above |

Ordinary local branch destinations are exactly +84, +120, +160, +168, +208,
+228, +248, +272, and +288.

## Complete exact schedule

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT57_ADVANCE name, clear_helper, erase_helper
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, lr}
    sub     sp, sp, #12
    mov     r7, r0
    ldr     r0, [r1, #16]
    mov     r5, r1
    mov     r4, r2
    str     r0, [r7]
    ldr     r0, [r1, #16]
    ldr     r2, [r2]
    mov     r6, r3
    ldr     r1, [r0, #8]
    cmp     r2, r1
    ldreq   r1, [r6]
    cmpeq   r1, r0
    bne     .Ldt57_iterate\@
    ldr     r1, [r5, #20]
    cmp     r1, #0
    beq     .Ldt57_iterate\@
    ldr     r4, [r0, #4]
    cmp     r4, #0
    beq     .Ldt57_reset\@
.Ldt57_clear_loop\@:
    ldr     r1, [r4, #12]
    mov     r0, r5
    bl      \clear_helper
    ldr     r0, [r5, #4]
    ldr     r2, [r4, #8]
    str     r0, [r4, #12]
    str     r4, [r5, #4]
    movs    r4, r2
    bne     .Ldt57_clear_loop\@
.Ldt57_reset\@:
    ldr     r1, [r5, #16]
    mov     r0, #0
    str     r1, [r1, #8]
    ldr     r1, [r5, #16]
    str     r0, [r1, #4]
    ldr     r1, [r5, #16]
    str     r1, [r1, #12]
    str     r0, [r5, #20]
    ldr     r0, [r5, #16]
    str     r0, [r7]
.Ldt57_return\@:
    add     sp, sp, #12
    pop     {r4, r5, r6, r7, pc}
.Ldt57_iterate\@:
    ldr     r0, [r6]
    ldr     r2, [r4]
    cmp     r2, r0
    beq     .Ldt57_return\@
    ldr     r1, [r2, #12]
    mov     r0, r2
    cmp     r1, #0
    movne   r0, r1
    strne   r1, [r4]
    beq     .Ldt57_climb\@
.Ldt57_descend\@:
    ldr     r0, [r0, #8]
    cmp     r0, #0
    strne   r0, [r4]
    bne     .Ldt57_descend\@
    b       .Ldt57_erase\@
.Ldt57_climb\@:
    mov     r1, r0
    ldr     r0, [r2, #4]
    ldr     r3, [r0, #12]
    cmp     r1, r3
    bne     .Ldt57_parent_test\@
.Ldt57_climb_loop\@:
    mov     r1, r0
    str     r0, [r4]
    ldr     r0, [r0, #4]
    ldr     r3, [r0, #12]
    cmp     r1, r3
    beq     .Ldt57_climb_loop\@
.Ldt57_parent_test\@:
    ldr     r1, [r4]
    ldr     r1, [r1, #12]
    cmp     r1, r0
    strne   r0, [r4]
.Ldt57_erase\@:
    str     r2, [sp, #4]
    add     r2, sp, #4
    mov     r1, r5
    mov     r0, sp
    bl      \erase_helper
    ldr     r0, [sp]
    str     r0, [r7]
    b       .Ldt57_iterate\@
.size \name, .-\name
.endm

DT57_ADVANCE func_0018396C, func_0018A080, func_00189A24
DT57_ADVANCE func_0018F7A8, func_00192AE0, func_00192484
```

Labels must be uniquely scoped per expansion.

## Clean-room handoff

Implement only from this document and
`config/arm-duplicate-templates-57.json`. Keep both direct destinations per
expansion symbolic. A validator should check body sizes, instruction counts,
all local branch destinations, both ordered direct call sites and relocations,
absence of literal material, and complete target-body identity after
direct-call normalization. Do not transcribe target encodings or private
values into source, scripts, configuration, or documentation.
