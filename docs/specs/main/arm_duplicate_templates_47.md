# Probe-verified duplicate ARM templates 47

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated function inventory, current objdiff report,
  complete-body structural grouping, bounded private-target control/data-flow
  inspection, direct-call resolution, physical post-body slot comparison, and
  an independent GNU Arm Embedded 15.2 exact-schedule probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private literal values, implementation source, or proprietary
  source.

Functions already exact in the current report and functions named by an
existing tracked implementation contract were excluded. The concurrent
runtime-helper batch 47 reservation was also excluded. The two functions below
are the highest-yield remaining structural ARM duplicate family after local
branches and direct calls are represented symbolically: two 524-byte bodies,
totalling 1,048 executable bytes.

```text
func_0053A57C  func_0053A794
```

## Observable contract

Each function accepts an output record in `r0`, a service-like object in
`r1`, a context record in `r2`, an opaque word in `r3`, another opaque
word at entry stack offset zero, and two single-precision payload words at
entry stack offsets four and eight. The stack payload pair is preserved in
`s16-s17`. The output is a three-word record.

The routine first validates the context and the service/context pairing. A
failed context validation reports the shared invalid-context status identity
to the output and returns. A failed pairing creates a temporary three-word
record tagged with the shared incompatible-service status identity, forwards
that record to the context helper, reports the same status to the output, and
returns.

On the success path, virtual slot 252 of the service supplies a candidate
pointer. A non-null pointer at context offset 116 overrides that candidate with
its offset-12 word. The routine requests 1,040 bytes through the one-instruction
pre-entry of `func_00184990`; a non-null allocation is passed to the
expansion-specific constructor. The constructed object's virtual slot 52 then
receives a stack-built argument record containing the service's offset-16
address, its offset-96 word and signed offset-100 byte, its offset-92 address,
the context's offset-68 word, the selected candidate, the entry opaque values,
and the preserved pair in `s16-s17`. The returned three-word record is copied
to a stable local slot before the temporary identity object is cleaned up.

If `func_001524C8` accepts that record, the routine optionally obtains an
offset-12 pointer from `func_0017F0D8`, calls `func_00173A64` with that
pointer, the constructed object, and zero, and reports the shared result-status
identity to the output. Otherwise it forwards the three-word record to the
context helper, atomically decrements the constructed object's offset-4
reference count, performs the exact offset-8 one-shot disposal guard when the
new count is zero, calls virtual slot 4 when disposal is claimed, and copies
the three-word record to the output.

The exact register, stack, conditional-execution, atomic, VFP, and return
schedule below is normative. In particular, preserve the inert `nop` after
the record predicate and all four separately spelled epilogues.

## Calls, slots, equality, and boundaries

There are fifteen direct calls and three indirect calls in each body. Direct-call
offsets and identities are:

| Offset | Identity |
| ---: | --- |
| +44 | `func_00170DA4` |
| +64 | `func_0056D0B8` |
| +112 | `func_00184990` with addend -4 |
| +128 | expansion constructor |
| +144 | expansion argument-identity builder |
| +236 | expansion argument-identity cleanup |
| +248 | `func_001524C8` |
| +264 | `func_0017F0D8` |
| +288 | `func_00173A64` |
| +308, +340, +372, +400 | `func_001734DC` |
| +384, +428 | `func_00170E24` |

The indirect call at +88 uses service virtual slot 252. The indirect call at
+212 uses constructed-object virtual slot 52. The indirect call at +496 uses
constructed-object virtual slot 4. Thus the complete count is fifteen direct
and three indirect calls; none is a tail call.

Expansion mappings are:

| Function | Constructor | Builder | Cleanup |
| --- | --- | --- | --- |
| `func_0053A57C` | `func_0053D290` | `func_002AD354` | `func_002AD3EC` |
| `func_0053A794` | `func_0053ECFC` | `func_002AD444` | `func_002AD4DC` |

Each function symbol ends at +524. Three aligned word slots immediately follow
at +524, +528, and +532, loaded at +292, +324, and +356 respectively. They are
the result-status, invalid-context-status, and incompatible-service-status
identities in that order. The three identities are pairwise distinct, and each
identity is equal across both expansions. There are no other literal slots.
For `func_0053A57C`, the next global function begins at +536. For
`func_0053A794`, unrelated anonymous target material begins at +536 and the
next global function is later; neither must be emitted by this template.

Complete local branch-target offsets are `+136`, `+324`, `+356`,
`+416`, `+444`, and `+500`. Labels must be uniquely scoped per expansion.
There are no relocations other than the fifteen `R_ARM_CALL` sites and three
post-body `R_ARM_ABS32` slots specified above.

## Complete exact schedule

Use this common preamble and macro. The `.size` boundary deliberately
precedes the three slots.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT47_BODY name, ctor, builder, cleanup, slot_a, slot_b, slot_c
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push	{r4, r5, r6, r7, r8, r9, sl, lr}
    mov	r4, r1
    mov	r6, r2
    mov	r9, r0
    mov	r8, r3
    vpush	{d8}
    sub	sp, sp, #72
    add	r0, sp, #116
    ldr	sl, [sp, #112]
    vldmia	r0, {s16-s17}
    mov	r0, r2
    bl func_00170DA4
    cmp	r0, #0
    beq	.Ldt47_0144\@
    mov	r1, r6
    mov	r0, r4
    bl func_0056D0B8
    cmp	r0, #0
    beq	.Ldt47_0164\@
    ldr	r0, [r4]
    ldr	r1, [r0, #252]
    mov	r0, r4
    blx	r1
    mov	r7, r0
    ldr	r0, [r6, #116]
    cmp	r0, #0
    ldrne	r7, [r0, #12]
    mov	r0, #1040
    bl func_00184990-4
    cmp	r0, #0
    moveq	r5, #0
    beq	.Ldt47_0088\@
    bl \ctor
    mov	r5, r0
.Ldt47_0088\@:
    mov	r1, sl
    add	r0, sp, #56
    bl \builder
    str	r0, [sp, #20]
    add	r0, sp, #24
    str	r8, [sp, #16]
    add	r2, r4, #16
    vstmia	r0, {s16-s17}
    add	r3, sp, #4
    ldrsb	r1, [r4, #100]
    ldr	r0, [r4, #96]
    str	r2, [sp]
    stm	r3, {r0, r1, r7}
    add	r3, r4, #92
    ldr	r0, [r5]
    ldr	r2, [r6, #68]
    mov	r1, r5
    ldr	ip, [r0, #52]
    add	r0, sp, #32
    blx	ip
    add	r3, sp, #32
    ldm	r3, {r0, r1, r2}
    add	r3, sp, #44
    stm	r3, {r0, r1, r2}
    add	r0, sp, #56
    bl \cleanup
    mov	r4, #0
    add	r0, sp, #44
    bl func_001524C8
    cmp	r0, #0
    nop	{0}
    beq	.Ldt47_01a0\@
    bl func_0017F0D8
    cmp	r0, #0
    ldrne	r4, [r0, #12]
    mov	r2, #0
    mov	r1, r5
    mov	r0, r4
    bl func_00173A64
    ldr r0, .Ldt47_slot_a\@
    add	r1, sp, #68
    str	r0, [sp, #68]
    mov	r0, r9
    bl func_001734DC
    add	sp, sp, #72
    vpop	{d8}
    pop	{r4, r5, r6, r7, r8, r9, sl, pc}
.Ldt47_0144\@:
    ldr r0, .Ldt47_slot_b\@
    mov	r1, sp
    str	r0, [sp]
    mov	r0, r9
    bl func_001734DC
    add	sp, sp, #72
    vpop	{d8}
    pop	{r4, r5, r6, r7, r8, r9, sl, pc}
.Ldt47_0164\@:
    ldr r4, .Ldt47_slot_c\@
    mov	r1, sp
    add	r0, sp, #4
    str	r4, [sp]
    bl func_001734DC
    ldm	r0, {r1, r2, r3}
    mov	r0, r6
    bl func_00170E24
    mov	r1, sp
    mov	r0, r9
    str	r4, [sp]
    bl func_001734DC
    add	sp, sp, #72
    vpop	{d8}
    pop	{r4, r5, r6, r7, r8, r9, sl, pc}
.Ldt47_01a0\@:
    add	r4, sp, #44
    mov	r0, r6
    ldm	r4, {r1, r2, r3}
    bl func_00170E24
    mov	r0, r5
    mvn	r2, #0
    add	r3, r5, #4
.Ldt47_01bc\@:
    ldrex	r1, [r3]
    add	r1, r1, r2
    strex	ip, r1, [r3]
    cmp	ip, #0
    bne	.Ldt47_01bc\@
    cmp	r1, #0
    ldrbeq	r1, [r0, #8]
    cmpeq	r1, #0
    moveq	r1, #1
    strbeq	r1, [r0, #8]
    bne	.Ldt47_01f4\@
    ldr	r1, [r0]
    ldr	r1, [r1, #4]
    blx	r1
.Ldt47_01f4\@:
    add	r3, sp, #44
    ldm	r3, {r0, r1, r2}
    stm	r9, {r0, r1, r2}
    add	sp, sp, #72
    vpop	{d8}
    pop	{r4, r5, r6, r7, r8, r9, sl, pc}
.size \name, .-\name
.Ldt47_slot_a\@:
    .word \slot_a
.Ldt47_slot_b\@:
    .word \slot_b
.Ldt47_slot_c\@:
    .word \slot_c
.endm
```

Instantiate the macro as follows:

```asm
DT47_BODY func_0053A57C, func_0053D290, func_002AD354, func_002AD3EC, \
    duplicate47_result_status_identity, \
    duplicate47_invalid_context_status_identity, \
    duplicate47_incompatible_service_status_identity

DT47_BODY func_0053A794, func_0053ECFC, func_002AD444, func_002AD4DC, \
    duplicate47_result_status_identity, \
    duplicate47_invalid_context_status_identity, \
    duplicate47_incompatible_service_status_identity
```

## Verification

GNU Arm Embedded 15.2 assembled both expansions for ARMv6K/VFPv2. Private
comparison confirmed all 464 non-call bytes of each 524-byte body exactly;
the remaining sixty body bytes are the fifteen direct-call fields and were
validated by symbolic target resolution at the offsets above. The probe
objects carried exactly fifteen `R_ARM_CALL` and three `R_ARM_ABS32`
relocations per expansion, both function symbols had size 524, and physical
target inspection confirmed the slot placement and cross-expansion equality
contract. No probe artifact is part of this specification.

