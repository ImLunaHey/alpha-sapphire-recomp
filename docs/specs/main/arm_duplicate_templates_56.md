# Probe-verified duplicate ARM templates 56

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
a tracked implementation contract was excluded. The concurrent IPC batch 52
and runtime batch 56 reservations were also excluded. These two ARM-state
functions share one 336-byte schedule, totaling 672 executable bytes:

```text
func_002A0B88  func_002A0CD8
```

## Observable contract

The sole argument in `r0` is an owner record, which is also the return value.
The owner fields at +0 and +4 are list heads, the field at +16 points to a
tree header, and the word at +20 is the tree element count. Tree nodes use
parent, left, and right links at +4, +8, and +12 respectively.

When the header is non-null and the count is nonzero, the routine clears the
whole tree. It walks from header +4 down successive +8 links. For every node it
first invokes the expansion-specific clear helper on the node's +12 subtree,
then prepends the node to the owner free list through its +12 link. It resets
header +8 and +12 to the header, header +4 to zero, and the owner count to zero.

When the header is non-null but the count is zero, the routine instead walks
from header +8 until reaching the header sentinel. Before erasing the current
node it computes the in-order successor: a non-null +12 child is followed down
successive +8 links; otherwise it climbs +4 parent links while arriving from
their +12 links and applies the final parent test exactly as scheduled below.
The current node is retained in the first stack word. The expansion-specific
erase helper receives the second stack word as an output address, the owner,
and the first stack word as the current-node address. Two explicit no-ops
follow that call.

After either tree path, the header is prepended to the owner +4 free list.
Finally, every record in the owner +0 list is removed from its leading next
link. The common cleanup routine is called first on record +8, then on the
record itself, with one explicit no-op before the second call. A null header
skips directly to this list cleanup. Invalid non-null pointers and malformed
cycles retain the target's original faulting or nonterminating behavior.

The expansion parameters are:

| Function | Clear helper at +64 | Erase helper at +236 |
| --- | --- | --- |
| `func_002A0B88` | `func_00568AE4` | `func_00568484` |
| `func_002A0CD8` | `func_00569180` | `func_00568B20` |

## Boundaries and calls

Each function is exactly 336 bytes and 84 ARM instructions. The next named
global starts at +336, so no post-body literal material belongs to either
function. There are four direct linked calls and no indirect call or external
tail branch:

| Offset | Relocation | Destination |
| ---: | --- | --- |
| +64 | `R_ARM_CALL` | expansion-specific clear helper above |
| +236 | `R_ARM_CALL` | expansion-specific erase helper above |
| +296 | `R_ARM_CALL` | `func_00160F9C` |
| +308 | `R_ARM_CALL` | `func_00160F9C` |

Ordinary local branch destinations are exactly +56, +92, +128, +152, +172,
+188, +208, +220, +252, +280, and +324.

## Complete exact schedule

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT56_OWNER_CLEAR name, clear_helper, erase_helper
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, lr}
    mov     r5, r0
    ldr     r0, [r0, #16]
    sub     sp, sp, #8
    movs    r6, r0
    beq     .Ldt56_exit\@
    ldr     r1, [r5, #20]
    ldr     r4, [r0, #8]
    cmp     r1, #0
    beq     .Ldt56_iterate\@
    ldr     r4, [r0, #4]
    mov     r6, r5
    cmp     r4, #0
    beq     .Ldt56_reset\@
.Ldt56_clear_loop\@:
    ldr     r1, [r4, #12]
    mov     r0, r6
    bl      \clear_helper
    ldr     r1, [r6, #4]
    ldr     r0, [r4, #8]
    str     r1, [r4, #12]
    str     r4, [r6, #4]
    movs    r4, r0
    bne     .Ldt56_clear_loop\@
.Ldt56_reset\@:
    ldr     r1, [r5, #16]
    mov     r0, #0
    str     r1, [r1, #8]
    ldr     r1, [r5, #16]
    str     r0, [r1, #4]
    ldr     r1, [r5, #16]
    str     r1, [r1, #12]
    str     r0, [r5, #20]
    b       .Ldt56_after_tree\@
.Ldt56_iterate\@:
    cmp     r4, r6
    mov     r1, r4
    beq     .Ldt56_after_tree\@
    ldr     r0, [r4, #12]
    cmp     r0, #0
    beq     .Ldt56_climb\@
.Ldt56_descend\@:
    mov     r4, r0
    ldr     r0, [r0, #8]
    cmp     r0, #0
    bne     .Ldt56_descend\@
    b       .Ldt56_erase\@
.Ldt56_climb\@:
    ldr     r0, [r4, #4]
    ldr     r3, [r0, #12]
    cmp     r1, r3
    bne     .Ldt56_check_parent\@
.Ldt56_climb_loop\@:
    mov     r4, r0
    ldr     r0, [r0, #4]
    ldr     r2, [r0, #12]
    cmp     r4, r2
    beq     .Ldt56_climb_loop\@
.Ldt56_check_parent\@:
    ldr     r2, [r4, #12]
    cmp     r2, r0
    movne   r4, r0
.Ldt56_erase\@:
    str     r1, [sp]
    mov     r2, sp
    mov     r1, r5
    add     r0, sp, #4
    bl      \erase_helper
    nop
    nop
    b       .Ldt56_iterate\@
.Ldt56_after_tree\@:
    ldr     r0, [r5, #16]
    ldr     r1, [r5, #4]
    str     r1, [r0, #12]
    str     r0, [r5, #4]
    ldr     r0, [r5]
    cmp     r0, #0
    beq     .Ldt56_exit\@
.Ldt56_release_loop\@:
    mov     r4, r0
    ldr     r0, [r0]
    str     r0, [r5]
    ldr     r0, [r4, #8]
    bl      func_00160F9C
    mov     r0, r4
    nop
    bl      func_00160F9C
    ldr     r0, [r5]
    cmp     r0, #0
    bne     .Ldt56_release_loop\@
.Ldt56_exit\@:
    add     sp, sp, #8
    mov     r0, r5
    pop     {r4, r5, r6, pc}
.size \name, .-\name
.endm

DT56_OWNER_CLEAR func_002A0B88, func_00568AE4, func_00568484
DT56_OWNER_CLEAR func_002A0CD8, func_00569180, func_00568B20
```

Labels must be uniquely scoped per expansion. The two no-ops after the erase
call and the no-op between the common cleanup calls are required.

## Clean-room handoff

Implement only from this document and
`config/arm-duplicate-templates-56.json`. Keep all four direct destinations
symbolic. A validator should check body sizes, instruction counts, all local
branch destinations, all four ordered direct call sites and relocations,
absence of literal material, and complete target-body identity after direct-call
normalization. Do not transcribe target encodings or private values into source,
scripts, configuration, or documentation.
