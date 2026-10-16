# Probe-verified duplicate ARM templates 54

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body symbolic duplicate grouping, bounded target
  control/data-flow inspection, direct-call resolution, post-body literal
  equality analysis, and an independent GNU Arm Embedded 15.2 mnemonic-only
  exact-body probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private literal values, implementation source, or proprietary
  source.

Every function already exact in the current report and every function named
by a tracked implementation contract was excluded. The concurrent IPC batch
50 reservation was also excluded. These two ARM-state functions share one
352-byte schedule, totaling 704 executable bytes:

```text
func_0013BE38  func_0013C138
```

## Observable contract

Entry `r0` points to an owner record. If both state bytes at owner offsets +9
and +11 are nonzero, the routine returns zero immediately. Otherwise it sets
the byte at +9 to one and starts a worker through `func_00150110`, passing one
and the shared symbolic worker-interval scalar. The returned worker handle is
retained in `r8`, while the owner field at +896 is initially cleared.

The pointer at owner offset +28 identifies a two-word sequence descriptor.
Its first two words bound a sequence of 40-byte records. Each record is
visited in order and invoked through the first callable entry of its dispatch
table. When the range is nonempty, the descriptor's second word is adjusted by
the exact signed reciprocal-multiply schedule shown below. That arithmetic is
equivalent for valid in-range descriptor differences to subtracting the full
sequence span; exact 32-bit wrapping, signed-shift behavior, and memory access
order remain normative.

The routine then calls its expansion-specific operation with the owner field
at +36, the worker handle, and the descriptor pointer. A nonzero result enters
the success path: it stores the worker at owner offset +896, allocates a
20-byte registration record through the shared padded allocator entry,
initializes that record from two shared symbolic read-only identities, and
submits it to the worker through `func_0014648C` and `func_00146464`. Allocation
failure still returns one after storing the worker.

A zero operation result enters cleanup. A nonzero worker handle is invoked
through the callable at dispatch offset +4. The owner state byte at +9 and the
worker field at +896 are cleared, then the exact three-call cleanup sequence
is performed. The routine returns zero from cleanup and one from success.
Invalid non-null pointers retain the target's original faulting behavior.

The sole expansion parameter is:

| Function | Operation at +168 |
| --- | --- |
| `func_0013BE38` | `func_00146BD0` |
| `func_0013C138` | `func_00146CD8` |

## Boundaries, calls, and symbolic material

Each function has a 352-byte body containing 88 ARM instructions. Four
word-sized slots follow at +352, +356, +360, and +364; the next named global
begins at +368. The `.size` directive must precede the slots.

There are eight direct linked calls:

| Offset | Relocation | Destination |
| ---: | --- | --- |
| +48 | `R_ARM_CALL` | `func_00150110` |
| +168 | `R_ARM_CALL` | expansion-specific operation above |
| +192 | `R_ARM_CALL` with addend -4 | `func_00184990` |
| +252 | `R_ARM_CALL` | `func_0014648C` |
| +272 | `R_ARM_CALL` | `func_00146464` |
| +316 | `R_ARM_CALL` | `func_001505A4` |
| +328 | `R_ARM_CALL` | `func_00139650` |
| +340 | `R_ARM_CALL` | `func_00169564` |

The allocator addend denotes the inert one-instruction entry pad immediately
before the named allocator. There are also two dispatch-table indirect calls,
at +100 and +304. No external tail branch exists. Ordinary local branch
destinations are exactly +88, +156, +276, +280, +284, and +308.

The four post-body slots are loaded at +40, +116, +212, and +236,
respectively. In order, they denote a shared opaque worker-interval scalar, a
shared reciprocal scalar for division by 40, a shared read-only two-word
record seed, and a shared record dispatch identity. Corresponding slots are
equal between both expansions; the four different roles are distinct
equality classes. Their private values are deliberately not part of this
contract.

## Complete exact schedule

Angle-bracketed operands identify symbolic post-body slots rather than
numeric literals.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT54_WORKER name, operation
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, r9, r10, r11, r12, lr}
    mov     r5, r0
    ldrb    r0, [r0, #9]
    cmp     r0, #0
    ldrbne  r0, [r5, #11]
    cmpne   r0, #0
    moveq   r0, #1
    strbeq  r0, [r5, #9]
    movne   r0, #0
    bne     .Ldt54_return\@
    ldr     r1, .Ldt54_interval\@
    mov     r0, #1
    bl      func_00150110
    mov     r11, #0
    str     r11, [r5, #896]
    ldr     r7, [r5, #28]
    mov     r8, r0
    ldm     r7, {r9, r10}
    cmp     r9, r10
    movne   r4, r9
    movne   r6, r10
    beq     .Ldt54_after_walk\@
.Ldt54_walk\@:
    ldr     r1, [r4]
    mov     r0, r4
    ldr     r1, [r1]
    blx     r1
    add     r4, r4, #40
    cmp     r4, r6
    bne     .Ldt54_walk\@
    ldr     r0, .Ldt54_divide_by_40\@
    sub     r2, r10, r9
    ldr     r1, [r7, #4]
    smull   r2, r0, r0, r2
    asr     r2, r0, #4
    sub     r0, r2, r0, asr #31
    rsb     r0, r0, #0
    add     r0, r0, r0, lsl #2
    add     r0, r1, r0, lsl #3
    str     r0, [r7, #4]
.Ldt54_after_walk\@:
    ldr     r0, [r5, #36]
    ldr     r2, [r5, #28]
    mov     r1, r8
    bl      \operation
    cmp     r0, #0
    nop
    beq     .Ldt54_cleanup\@
    mov     r0, #20
    str     r8, [r5, #896]
    bl      func_00184990 - 4
    cmp     r0, #0
    nop
    beq     .Ldt54_success_return\@
    mov     r4, r0
    ldr     r0, .Ldt54_record_seed\@
    ldm     r0, {r1, r2}
    add     r0, r4, #8
    str     r5, [r4, #4]
    stm     r0, {r1, r2}
    mov     r0, r8
    ldr     r1, .Ldt54_record_dispatch\@
    str     r1, [r4]
    mov     r1, #2
    str     r8, [r4, #16]
    bl      func_0014648C
    mov     r3, #1
    mov     r2, #0
    mov     r1, r4
    mov     r0, r8
    bl      func_00146464
.Ldt54_success_return\@:
    mov     r0, #1
.Ldt54_return\@:
    pop     {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
.Ldt54_cleanup\@:
    cmp     r8, #0
    beq     .Ldt54_clear\@
    ldr     r0, [r8]
    ldr     r1, [r0, #4]
    mov     r0, r8
    blx     r1
.Ldt54_clear\@:
    strb    r11, [r5, #9]
    str     r11, [r5, #896]
    bl      func_001505A4
    mov     r4, r0
    nop
    bl      func_00139650
    mov     r1, r4
    nop
    bl      func_00169564
    mov     r0, #0
    pop     {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
.size \name, .-\name
.Ldt54_interval\@:
    .word arm_duplicate_templates_54_worker_interval_identity
.Ldt54_divide_by_40\@:
    .word arm_duplicate_templates_54_divide_by_40_identity
.Ldt54_record_seed\@:
    .word arm_duplicate_templates_54_record_seed_identity
.Ldt54_record_dispatch\@:
    .word arm_duplicate_templates_54_record_dispatch_identity
.endm

DT54_WORKER func_0013BE38, func_00146BD0
DT54_WORKER func_0013C138, func_00146CD8
```

The explicit no-ops at +176, +200, +324, and +336 are required. Labels must
be uniquely scoped per expansion.

## Clean-room handoff

Implement only from this document and
`config/arm-duplicate-templates-54.json`. Keep all external destinations and
four post-body values symbolic. A validator should check body sizes,
instruction counts, local branch destinations, all direct and indirect call
sites, the allocator addend, pool load/slot offsets, slot equality classes,
the position of `.size`, and complete target-body identity after direct-call
normalization. Do not transcribe target encodings or private literal values
into source, scripts, configuration, or documentation.
