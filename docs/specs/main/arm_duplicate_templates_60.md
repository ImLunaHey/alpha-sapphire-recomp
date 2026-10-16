# Probe-verified duplicate ARM templates 60

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body symbolic duplicate grouping, bounded target
  control/data-flow inspection, direct-call resolution, external-word
  inspection, and an independent GNU Arm Embedded 15.2 mnemonic-only
  exact-body probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private literal values, implementation source, or proprietary
  source.

Every function already exact in the current report and every function named by
a tracked implementation contract was excluded. The concurrent IPC batch 56
and runtime batch 60 reservations were also excluded. These two ARM-state
functions share one 320-byte schedule, totaling 640 executable bytes:

```text
func_001A3964  func_001A4110
```

## Observable contract

The routine accepts a mutable state record in `r0`, a signed threshold-like
value in `r1`, and a writable sequence of 64 signed halfword samples in `r2`.
It processes the sequence from its first element through its sixty-fourth
element while maintaining a sixteen-element history ring in the state record.

For each sample, the routine reads the signed ring index at state offset 12.
It removes the old history magnitude at offset 48 plus twice that index from
the saturating word accumulator at offset 8, stores the current input sample
at offset 16 plus twice that index, computes the sample's signed absolute value
with the target's narrowing behavior, and stores that magnitude into the
offset-48 history. The magnitude shifted left seven is saturating-added to the
accumulator. The ring index advances modulo sixteen.

The accumulator arithmetic-shifted right eleven and narrowed to a signed
halfword is the current envelope. Compare it with the prior signed envelope at
offset 14. When the envelope rises, copy state word zero to state word four;
otherwise copy state word four to state word zero. Word zero is then updated
by saturating-adding the envelope shifted left fourteen to three quarters of
its previous value, where the three-quarter operation is spelled as a
saturating subtraction from its arithmetic quarter. Word four is updated in
the same form with an arithmetic thirteenth, leaving 8191/8192 of its previous
value, and the envelope shifted left three. Select the high signed halfword of
updated word zero on a rise or word four otherwise, and store its low halfword
as the new prior envelope at offset 14.

If the entry threshold is at least that selected envelope, replace the current
output with the unsigned halfword in the newly advanced history slot. If it is
lower, call `func_00300754` with the threshold shifted left fifteen, signed
halfword-multiply the result by that history value, arithmetic-shift the
product right fifteen, clamp it to the signed-halfword range, and store its low
halfword. The clamp obtains the upper bound through the external word read
described below and obtains the lower bound by complementing it. The input and
output cursors are the same sequence cursor and advance by two bytes after
each output. Invalid pointers retain the target's original faulting behavior.

The absolute-value sequence intentionally preserves the signed narrowing edge
case: the most-negative signed halfword remains negative after negate and
narrow. All `qadd` and `qsub` operations, condition-code dependencies, signed
halfword narrows, and post-increment stores in the exact schedule below are
observable.

## Boundaries, transfers, and external word

Each function is exactly 320 bytes and 80 ARM instructions. The next named
global begins at +320. There is one direct linked call and no indirect call or
external tail branch:

| Offset | Relocation | Destination | Role |
| ---: | --- | --- | --- |
| +256 | `R_ARM_CALL` | `func_00300754` | derive threshold scale |

The complete ordinary local branch destinations are +32, +252, +296, and
+300.

The load at +20 addresses a word at +448 from the function entry. That word is
outside the function extent, after the complete 128-byte function that begins
at +320, and is not owned or emitted by this template. It supplies the
signed-halfword upper bound. The corresponding external words have the same
semantic value for both expansions. The load is a fixed PC-relative access,
not a relocation, and there are no owned literal slots or other relocations.

## Complete exact schedule

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT60_BODY name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, r9, r10, r11, r12, lr}
    mov     r4, r0
    mov     r8, r1
    mov     r5, r2
    mov     r6, #63
    ldr     r10, [pc, #420]
    lsl     r9, r1, #15
    mvn     r11, r10
.Ldt60_loop\@:
    ldrsh   r0, [r4, #12]
    ldr     r1, [r4, #8]
    add     r2, r4, r0, lsl #1
    ldrsh   r0, [r2, #48]
    lsl     r0, r0, #7
    qsub    r0, r1, r0
    str     r0, [r4, #8]
    ldrh    r0, [r5]
    strh    r0, [r2, #16]
    ldrsh   r0, [r5]
    ldrsh   r1, [r4, #12]
    cmp     r0, #0
    rsblt   r0, r0, #0
    add     r1, r4, r1, lsl #1
    sxth    r0, r0
    strh    r0, [r1, #48]
    ldr     r1, [r4, #8]
    ldrh    r2, [r4, #12]
    lsl     r0, r0, #7
    qadd    r0, r1, r0
    add     r1, r2, #1
    str     r0, [r4, #8]
    asr     r0, r0, #11
    and     r7, r1, #15
    sxth    r12, r0
    strh    r7, [r4, #12]
    ldrsh   r0, [r4, #14]
    sub     r1, r12, r0
    cmp     r1, #0
    ldrgt   r0, [r4]
    strgt   r0, [r4, #4]
    ldrle   r0, [r4, #4]
    strle   r0, [r4]
    asr     r2, r0, #2
    qsub    r2, r0, r2
    lsl     r0, r12, #14
    qadd    r2, r2, r0
    cmp     r1, #0
    str     r2, [r4]
    ldr     r0, [r4, #4]
    asr     r3, r0, #13
    qsub    r3, r0, r3
    lsl     r0, r12, #3
    qadd    r0, r3, r0
    str     r0, [r4, #4]
    asrgt   r0, r2, #16
    asrle   r0, r0, #16
    strh    r0, [r4, #14]
    sxth    r1, r0
    subs    r0, r8, r1
    bmi     .Ldt60_scaled\@
    add     r0, r4, r7, lsl #1
    ldrh    r0, [r0, #16]
    strh    r0, [r5], #2
    b       .Ldt60_next\@
.Ldt60_scaled\@:
    mov     r0, r9
    bl      func_00300754
    add     r1, r4, r7, lsl #1
    ldrh    r1, [r1, #16]
    smulbb  r0, r1, r0
    asr     r0, r0, #15
    cmp     r0, #32768
    movge   r0, r10
    bge     .Ldt60_store\@
    cmn     r0, #32768
    movlt   r0, r11
.Ldt60_store\@:
    strh    r0, [r5], #2
.Ldt60_next\@:
    sub     r0, r6, #1
    sxth    r6, r0
    cmp     r6, #0
    bge     .Ldt60_loop\@
    pop     {r4, r5, r6, r7, r8, r9, r10, r11, r12, pc}
.size \name, .-\name
.endm

DT60_BODY func_001A3964
DT60_BODY func_001A4110
```

Labels must be uniquely scoped per expansion.

## Independent exact-probe evidence

The complete schedule above was assembled independently with GNU Arm Embedded
15.2. Its full 320-byte body matched each target body after only the audited
direct-call instruction field at +256 was normalized. The fixed external-word
load, all local branches, saturating arithmetic, conditional operations,
prologue, epilogue, and every other instruction matched without normalization.
The two target bodies also matched one another under the same direct-call
normalization. Temporary probe and extracted probe material were deleted after
verification.

## Clean-room handoff

Implement only from this document and
`config/arm-duplicate-templates-60.json`. Keep the direct destination symbolic.
Do not emit or claim ownership of the external word at +448; preserve the
fixed PC-relative load schedule. A validator should check body sizes,
instruction counts, next-global boundaries, the complete local branch set,
the direct call and relocation, the external-word load displacement and
semantic role, absence of owned literals, and complete target-body identity
after direct-call normalization. Do not transcribe target encodings or private
values into source, scripts, configuration, or documentation.
