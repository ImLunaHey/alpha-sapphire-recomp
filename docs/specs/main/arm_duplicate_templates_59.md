# Probe-verified duplicate ARM templates 59

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
a tracked implementation contract was excluded. The concurrent IPC batch 55
and runtime batch 59 reservations were also excluded. These two ARM-state
functions share one 320-byte schedule, totaling 640 executable bytes:

```text
func_0040EA28  func_0040EB68
```

## Observable contract

The arguments are retained as an opaque caller value in `r0` and an opaque
record in `r1`. The routine reserves a 200-byte stack frame. It derives two
handles from the record through `func_004E5E08` and `func_004E5DDC`, retaining
the first in `r5` and the second in `r4`. It calls `func_00410B30`, sets bit
zero in the second handle's offset-12 word, derives a value from the first
handle through `func_004E688C`, and passes that value by stack address to
`func_00410B4C` with the second handle.

The doubleword at first-handle offset 20 is copied to second-handle offset
zero. The result of `func_00410484()` is supplied with the original caller
value and first handle to `func_00410EAC`, which constructs an opaque
stack-resident object beginning at stack offset 16. The routine queries that
object through `func_00410E50`. A nonzero result skips directly to destruction
of the object.

On a zero query result, the routine clears stack words at offsets 160 and 12,
reads object words at offsets 24 and 20, and passes their values plus addresses
of those two cleared words to `func_00413574`. A zero result skips the nested
operation while retaining any pointer written at stack offset 160 for the
optional release below.

On a nonzero result, it constructs an opaque 80-byte stack object at offset 80
through the offset-28 entry of `func_00417514`, passing the first handle and
two one-valued arguments. It reacquires the result of `func_00410484`, then
calls `func_0040F228` with an output object at stack offset 164, the original
caller value, the object at stack offset 80, that acquired value, one, and the
values written at stack offsets 160 and 12. It submits the output object to
`func_0040F1A4`. The following address formation and no-op are observable parts
of the exact schedule even though they do not change C-visible state.

If the pointer at stack offset 160 is non-null, the routine calls
`func_0040AC94`, follows two offset-zero links and then an offset-four function
slot, and calls that function indirectly with the pointer as `r1`. Finally it
destroys the object at stack offset 16 through `func_0040F458`, releases its
stack frame, and returns. Invalid non-null pointers and invalid indirect-call
slots retain the target's original faulting behavior.

## Boundaries, calls, and control flow

Each function is exactly 320 bytes and 80 ARM instructions. The next named
global starts at +320 in both cases, so neither function owns post-body literal
material. There are fifteen direct linked calls and one register-indirect
linked call:

| Offset | Relocation | Destination | Role |
| ---: | --- | --- | --- |
| +20 | `R_ARM_CALL` | `func_004E5E08` | derive first handle |
| +32 | `R_ARM_CALL` | `func_004E5DDC` | derive second handle |
| +40 | `R_ARM_CALL` | `func_00410B30` | pre-operation notification |
| +60 | `R_ARM_CALL` | `func_004E688C` | derive submitted value |
| +76 | `R_ARM_CALL` | `func_00410B4C` | submit value by address |
| +88 | `R_ARM_CALL` | `func_00410484` | acquire shared value |
| +116 | `R_ARM_CALL` | `func_00410EAC` | construct outer stack object |
| +124 | `R_ARM_CALL` | `func_00410E50` | query outer stack object |
| +180 | `R_ARM_CALL` | `func_00413574` | prepare optional operation |
| +208 | `R_ARM_CALL`, addend +28 | `func_00417514` | construct inner stack object |
| +212 | `R_ARM_CALL` | `func_00410484` | reacquire shared value |
| +248 | `R_ARM_CALL` | `func_0040F228` | construct output stack object |
| +256 | `R_ARM_CALL` | `func_0040F1A4` | submit output stack object |
| +280 | `R_ARM_CALL` | `func_0040AC94` | acquire indirect dispatcher |
| +300 | none | register `r2` | indirect release operation |
| +308 | `R_ARM_CALL` | `func_0040F458` | destroy outer stack object |

The complete ordinary local branch destinations are +268 and +304. There are
no literal-pool slots or other relocations.

## Complete exact schedule

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT59_BODY name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, lr}
    mov     r6, r0
    sub     sp, sp, #200
    mov     r4, r1
    mov     r0, r1
    bl      func_004E5E08
    mov     r5, r0
    mov     r0, r4
    bl      func_004E5DDC
    mov     r4, r0
    bl      func_00410B30
    ldr     r0, [r4, #12]
    orr     r0, r0, #1
    str     r0, [r4, #12]
    mov     r0, r5
    bl      func_004E688C
    str     r0, [sp, #8]
    add     r1, sp, #8
    mov     r0, r4
    bl      func_00410B4C
    ldrd    r0, [r5, #20]
    strd    r0, [r4]
    bl      func_00410484
    mov     r4, #0
    mov     r1, r0
    mov     r3, r5
    mov     r2, r6
    add     r0, sp, #16
    str     r4, [sp]
    bl      func_00410EAC
    add     r0, sp, #16
    bl      func_00410E50
    cmp     r0, #0
    bne     .Ldt59_done\@
    add     r0, sp, #16
    str     r4, [sp, #160]
    str     r4, [sp, #12]
    ldr     r0, [r0, #24]
    mov     r4, r0
    add     r0, sp, #16
    ldr     r0, [r0, #20]
    mov     r2, r0
    mov     r3, r4
    add     r1, sp, #12
    add     r0, sp, #160
    bl      func_00413574
    cmp     r0, #0
    beq     .Ldt59_release_optional\@
    mov     r3, #1
    mov     r2, r3
    mov     r1, r5
    add     r0, sp, #80
    bl      func_00417514 + 28
    bl      func_00410484
    ldr     r3, [sp, #160]
    ldr     r12, [sp, #12]
    mov     r2, #1
    mov     r1, r0
    stm     sp, {r2, r3, r12}
    add     r3, sp, #80
    mov     r2, r6
    add     r0, sp, #164
    bl      func_0040F228
    add     r0, sp, #164
    bl      func_0040F1A4
    add     r0, sp, #164
    mov     r0, r0
.Ldt59_release_optional\@:
    ldr     r0, [sp, #160]
    cmp     r0, #0
    beq     .Ldt59_done\@
    bl      func_0040AC94
    ldr     r0, [r0]
    ldr     r1, [sp, #160]
    ldr     r2, [r0]
    ldr     r2, [r2, #4]
    blx     r2
.Ldt59_done\@:
    add     r0, sp, #16
    bl      func_0040F458
    add     sp, sp, #200
    pop     {r4, r5, r6, pc}
.size \name, .-\name
.endm

DT59_BODY func_0040EA28
DT59_BODY func_0040EB68
```

Labels must be uniquely scoped per expansion.

## Independent exact-probe evidence

The complete schedule above was assembled independently with GNU Arm Embedded
15.2. Its full 320-byte body matched each target body after only the fifteen
audited direct-call instruction fields were normalized. The local branches,
register-indirect call, no-op, prologue, epilogue, and all non-call
instructions matched without normalization. The temporary probe and extracted
probe material were deleted after verification.

## Clean-room handoff

Implement only from this document and
`config/arm-duplicate-templates-59.json`. Keep all fifteen direct destinations
symbolic, including the offset-28 call addend. A validator should check body
sizes, instruction counts, the complete local branch destinations, ordered
direct calls and relocations, the register-indirect call site, absence of
literal material, next-global boundaries, and complete target-body identity
after direct-call normalization. Do not transcribe target encodings or private
values into source, scripts, configuration, or documentation.
