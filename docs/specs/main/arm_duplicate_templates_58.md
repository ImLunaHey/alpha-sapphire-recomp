# Probe-verified duplicate ARM templates 58

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body symbolic duplicate grouping, bounded target
  control/data-flow inspection, direct-call resolution, post-body object
  boundary analysis, and an independent GNU Arm Embedded 15.2 mnemonic-only
  exact-body probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private identifier text, implementation source, or proprietary
  source.

Every function already exact in the current report and every function named
by a tracked implementation contract was excluded. The concurrent IPC batch
54 and runtime batch 58 reservations were also excluded. These two ARM-state
functions share one 320-byte schedule, totaling 640 executable bytes:

```text
func_00369FAC  func_0036A428
```

## Observable contract

The sole entry argument in `r0` is an owner-like record. The routine first
obtains a shared registry/context from `func_0012B95C`. It looks up three
opaque, NUL-terminated identifier objects through `func_0036F398`, passing
the registry/context, the identifier address, and one. The first lookup
deliberately inherits `r0` from the context call; the second and third restore
the saved context explicitly. Each returned handle is then submitted to
`func_0036F4D0` with the context and zero, in lookup order.

Next, the routine requests 64 bytes through `func_00123480`, using the owner's
offset-4 word as the allocation context. A null allocation selects zero as the
constructed pointer. Otherwise the expansion-specific constructor receives
the raw allocation. The exact inherited call-clobbered argument state is
preserved by the schedule and is not strengthened into an additional source
contract.

The routine stores the owner at constructed offset 28 and calls
`func_003AB384(owner, constructed)`. If the pointer at constructed offset 20
is null, it requests 12 bytes through the offset-16 entry of
`func_0012B95C`, passing the owner's offset-4 word. It writes the returned
pointer and capacity three to constructed offsets 20 and 24. Before each
element store it compares capacity against the required count. Capacity zero
before the first store, one or less before the second, or two or less before
the third calls `func_0011EF4C(0, 0, 0)`.

The array receives the second lookup handle at element zero, the third at
element one, and the first at element two. The constructed pointer is returned
in `r0`. A null constructed pointer and other invalid non-null pointers retain
the target's original faulting behavior.

The sole expansion parameter is:

| Function | Constructor at +144 |
| --- | --- |
| `func_00369FAC` | `func_0019C250` |
| `func_0036A428` | `func_0019C2A0` |

## Calls, labels, identifiers, and boundaries

Each function contains fourteen direct linked calls and no indirect call or
external tail branch:

| Offset | Relocation | Destination |
| ---: | --- | --- |
| +8 | `R_ARM_CALL` | `func_0012B95C` |
| +24, +44, +64 | `R_ARM_CALL` | `func_0036F398` |
| +84, +100, +116 | `R_ARM_CALL` | `func_0036F4D0` |
| +128 | `R_ARM_CALL` | `func_00123480` |
| +144 | `R_ARM_CALL` | expansion-specific constructor above |
| +164 | `R_ARM_CALL` | `func_003AB384` |
| +192 | `R_ARM_CALL` with addend +16 | `func_0012B95C` |
| +228, +264, +300 | `R_ARM_CALL` | `func_0011EF4C` |

Complete local branch destinations are +152, +204, +232, +268, and +304.
Apart from the fourteen calls, the body has no relocations.

Every function symbol ends at +320. Three local NUL-terminated identifier
objects begin at +320, +348, and +368, and are addressed by the `adr`
instructions at +20, +36, and +56 respectively. Their private text is neither
needed nor permitted in this contract; they are neutral opaque identities:

- identifier one is expansion-specific and pairwise distinct. It occupies 26
  bytes including its terminator for `func_00369FAC` and 27 bytes for
  `func_0036A428`; its reserved span is 28 bytes;
- identifier two occupies 19 bytes including its terminator, has a reserved
  span of 20 bytes, and is identical between expansions;
- identifier three occupies 23 bytes including its terminator, has a reserved
  span of 24 bytes, and is identical between expansions.

The trailing bytes in each reserved span are padding, not part of the
identifier. In both expansions, template-owned identifier content ends at
+391 and the final reserved span ends at +392. For `func_00369FAC`, the next
named global begins immediately at +392. For `func_0036A428`, unrelated
anonymous target material begins at +392 and occupies the neutral 96-byte span
before the next inventoried function at +488. That anonymous span is not owned
by this template and must not be copied into its implementation.

## Complete exact schedule

The labels after `.size` denote the neutral identifier objects described
above. Their contents must come from an approved clean-room identifier
provider; private target text must not be copied into implementation source.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT58_BODY name, ctor, id1_bytes
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, r7, r8, r9, r10, lr}
    mov     r5, r0
    bl      func_0012B95C
    mov     r4, r0
    mov     r2, #1
    adr     r1, .Ldt58_id1\@
    bl      func_0036F398
    mov     r7, r0
    mov     r2, #1
    adr     r1, .Ldt58_id2\@
    mov     r0, r4
    bl      func_0036F398
    mov     r6, r0
    mov     r2, #1
    adr     r1, .Ldt58_id3\@
    mov     r0, r4
    bl      func_0036F398
    mov     r8, r0
    mov     r2, #0
    mov     r1, r7
    mov     r0, r4
    bl      func_0036F4D0
    mov     r2, #0
    mov     r1, r6
    mov     r0, r4
    bl      func_0036F4D0
    mov     r2, #0
    mov     r1, r8
    mov     r0, r4
    bl      func_0036F4D0
    ldr     r1, [r5, #4]
    mov     r0, #64
    bl      func_00123480
    cmp     r0, #0
    moveq   r4, #0
    beq     .Ldt58_constructed\@
    bl      \ctor
    mov     r4, r0
.Ldt58_constructed\@:
    mov     r1, r4
    mov     r0, r5
    str     r5, [r4, #28]
    bl      func_003AB384
    ldr     r0, [r4, #20]
    mov     r9, #3
    cmp     r0, #0
    ldr     r0, [r5, #4]
    bne     .Ldt58_have_storage\@
    mov     r1, #12
    bl      func_0012B95C + 16
    add     r1, r4, #20
    stm     r1, {r0, r9}
.Ldt58_have_storage\@:
    ldr     r0, [r4, #24]
    cmp     r0, #0
    bhi     .Ldt58_store_first\@
    mov     r2, #0
    mov     r1, r2
    mov     r0, r2
    bl      func_0011EF4C
.Ldt58_store_first\@:
    ldr     r0, [r4, #20]
    str     r6, [r0]
    ldr     r0, [r4, #24]
    cmp     r0, #1
    bhi     .Ldt58_store_second\@
    mov     r2, #0
    mov     r1, r2
    mov     r0, r2
    bl      func_0011EF4C
.Ldt58_store_second\@:
    ldr     r0, [r4, #20]
    str     r8, [r0, #4]
    ldr     r0, [r4, #24]
    cmp     r0, #2
    bhi     .Ldt58_store_third\@
    mov     r2, #0
    mov     r1, r2
    mov     r0, r2
    bl      func_0011EF4C
.Ldt58_store_third\@:
    ldr     r0, [r4, #20]
    str     r7, [r0, #8]
    mov     r0, r4
    pop     {r4, r5, r6, r7, r8, r9, r10, pc}
.size \name, .-\name
.Ldt58_id1\@:
    /* neutral expansion identifier one; see placement table */
.Ldt58_id2\@:
    /* neutral shared identifier two: 19 bytes, then pad to 20 */
.Ldt58_id3\@:
    /* neutral shared identifier three: 23 bytes, then pad to 24 */
.endm

DT58_BODY func_00369FAC, func_0019C250, 26
DT58_BODY func_0036A428, func_0019C2A0, 27
```

Labels must be uniquely scoped per expansion. The `id1_bytes` macro argument
records placement metadata; the neutral provider owns the corresponding
bytes and padding.

## Clean-room handoff

Implement only from this document and
`config/arm-duplicate-templates-58.json`. Keep all fourteen direct
destinations symbolic, including the offset-16 call addend. A validator should
check body sizes, instruction counts, complete local branch destinations,
ordered call sites and relocations, all three `adr` targets, identifier
lengths/padding/equality classes, `.size` placement, next-global boundaries,
the second expansion's unrelated anonymous-material boundary, and complete
target-body identity after direct-call normalization. Do not
transcribe target encodings, private identifier text, or private values into
source, scripts, configuration, or documentation.
