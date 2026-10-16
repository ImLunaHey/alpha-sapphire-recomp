# Probe-verified duplicate ARM templates 48

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated function inventory, current objdiff report,
  complete-body structural grouping, bounded private-target control/data-flow
  inspection, direct-call resolution, post-body object-boundary analysis, and
  an independent GNU Arm Embedded 15.2 exact-body probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private identifier text, implementation source, or proprietary
  source.

Functions already exact in the current report and functions named by an
existing tracked implementation contract were excluded. The concurrent
runtime-helper batch 48 reservation was also excluded. The three functions
below are the highest-yield remaining structural ARM duplicate family after
direct calls are represented symbolically: three 272-byte bodies, totalling
816 executable bytes.

```text
func_00368600  func_00368CE0  func_00369104
```

## Observable contract

Each routine accepts an owner-like object in `r0` and a constructor argument
in `r1`. It obtains a shared registry/context from `func_0012B95C`. It then
looks up two opaque, NUL-terminated identifier objects through
`func_0036F398`, passing the registry/context, the identifier address, and one.
The first lookup deliberately inherits `r0` from the preceding context call;
the second explicitly restores the saved context. The two returned handles
are retained in lookup order. Each handle is then submitted to
`func_0036F4D0` with that context and zero.

Next, an expansion-specific opaque identifier and zero are passed to
`func_0036F28C`; its result is retained. The routine requests 40 bytes through
`func_00123480`, using the owner's offset-4 word as the allocation context. A
null allocation selects zero as the constructed pointer. Otherwise the
expansion-specific constructor receives the raw allocation in `r0` and the
entry constructor argument in `r1`, and its result becomes the constructed
pointer.

The routine stores the owner at constructed offset 28 and the result from
`func_0036F28C` at offset 16, then calls `func_003AB384(owner, constructed)`.
If the pointer at constructed offset 20 is null, it requests eight bytes via
the offset-16 entry of `func_0012B95C`, passing the owner's offset-4 word and
eight, and writes the returned pointer plus capacity two to constructed
offsets 20 and 24. Before each element store it compares capacity against the
required element count. Capacity zero or less before the first store, or one
or less before the second, calls `func_0011EF4C(0, 0, 0)`. The two lookup
handles are written to elements zero and one in that order. The constructed
pointer is not returned explicitly; the final helper/store path determines
the incidental `r0` value.

The exact register, call, branch, and return schedule below is normative.
In particular, preserve the null-allocation conditional move and branch, the
stores through the constructed pointer after that join, the first inherited
`r0`, both capacity checks, and the offset-16 call entry.

## Calls, labels, identifiers, and boundaries

Each body has twelve direct calls and no indirect or tail calls:

| Offset | Identity |
| ---: | --- |
| +12 | `func_0012B95C` |
| +28, +48 | `func_0036F398` |
| +68, +84 | `func_0036F4D0` |
| +96 | `func_0036F28C` |
| +112 | `func_00123480` |
| +132 | expansion constructor |
| +156 | `func_003AB384` |
| +184 | `func_0012B95C` with addend +16 |
| +220, +256 | `func_0011EF4C` |

Expansion constructors are:

| Function | Constructor |
| --- | --- |
| `func_00368600` | `func_0019C0F8` |
| `func_00368CE0` | `func_0019C160` |
| `func_00369104` | `func_0019C190` |

Complete local branch-target offsets are `+140`, `+196`, `+224`, and `+260`.
Labels must be uniquely scoped per expansion. Apart from the twelve
`R_ARM_CALL` sites, the body has no relocations.

Every function symbol ends at +272. Three local NUL-terminated identifier
objects begin at +272, +296, and +320, and are addressed by the `adr`
instructions at +24, +40, and +88 respectively. Their private text is neither
needed nor permitted in this contract; they are neutral opaque identities:

- identifier one occupies 21 bytes including its terminator and is identical
  across all three expansions; its reserved span is 24 bytes;
- identifier two occupies 23 bytes including its terminator and is identical
  across all three expansions; its reserved span is 24 bytes;
- identifier three is pairwise distinct across the expansions. It occupies 20
  bytes including its terminator for `func_00368600`, and 22 bytes for each of
  the other two functions.

The first two objects' trailing bytes through the next four-byte boundary are
padding, not part of the identifier. The third object's terminator is the end
of template-owned material. For `func_00368600`, the next global function
begins at +340. For `func_00368CE0`, it begins at +344. For
`func_00369104`, unrelated anonymous target material begins at +344 and the
next global function begins at +444; neither is part of this template.

## Complete exact body schedule

The labels after `.size` denote the three neutral identifier objects described
above. Their content must come from an approved clean-room identifier provider;
the private target text must not be copied into implementation source.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT48_BODY name, ctor
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push {r4, r5, r6, r7, r8, lr}
    mov r5, r0
    mov r4, r1
    bl func_0012B95C
    mov r8, r0
    mov r2, #1
    adr r1, .Ldt48_id1\@
    bl func_0036F398
    mov r6, r0
    mov r2, #1
    adr r1, .Ldt48_id2\@
    mov r0, r8
    bl func_0036F398
    mov r7, r0
    mov r2, #0
    mov r1, r6
    mov r0, r8
    bl func_0036F4D0
    mov r2, #0
    mov r1, r7
    mov r0, r8
    bl func_0036F4D0
    adr r0, .Ldt48_id3\@
    mov r1, #0
    bl func_0036F28C
    mov r8, r0
    ldr r1, [r5, #4]
    mov r0, #40
    bl func_00123480
    cmp r0, #0
    moveq r4, #0
    beq .Ldt48_constructed\@
    mov r1, r4
    bl \ctor
    mov r4, r0
.Ldt48_constructed\@:
    mov r1, r4
    str r5, [r4, #28]
    mov r0, r5
    str r8, [r4, #16]
    bl func_003AB384
    ldr r0, [r4, #20]
    mov r8, #2
    cmp r0, #0
    ldr r0, [r5, #4]
    bne .Ldt48_have_storage\@
    mov r1, #8
    bl func_0012B95C+16
    add r1, r4, #20
    stm r1, {r0, r8}
.Ldt48_have_storage\@:
    ldr r0, [r4, #24]
    cmp r0, #0
    bhi .Ldt48_store_first\@
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
.Ldt48_store_first\@:
    ldr r0, [r4, #20]
    str r6, [r0]
    ldr r0, [r4, #24]
    cmp r0, #1
    bhi .Ldt48_store_second\@
    mov r2, #0
    mov r1, r2
    mov r0, r2
    bl func_0011EF4C
.Ldt48_store_second\@:
    ldr r0, [r4, #20]
    str r7, [r0, #4]
    pop {r4, r5, r6, r7, r8, pc}
.size \name, .-\name
.Ldt48_id1\@:
    /* neutral shared identifier one: 21 bytes, then pad to 24 */
.Ldt48_id2\@:
    /* neutral shared identifier two: 23 bytes, then pad to 24 */
.Ldt48_id3\@:
    /* neutral expansion-specific identifier; see placement table */
.endm
```

Instantiate the body with the constructor mapping above. The independent probe
used neutral same-length placeholders at the three labels, linked each section
at its inventory address, and matched all three 272-byte executable bodies
exactly. Each relocatable expansion contained exactly twelve `R_ARM_CALL`
relocations. Probe-only files were deleted after validation.

## Acceptance checklist

- All three symbols are ARM, 272 bytes, and 68 instructions.
- Their combined executable contribution is 816 bytes.
- The four internal branch targets and twelve call offsets match this contract.
- The constructor is the only call identity that varies by expansion.
- The offset-16 `func_0012B95C` entry retains its relocation addend.
- The three `adr` targets are +272, +296, and +320 with no relocations.
- Identifier lengths, padding, sharing, and pairwise distinction match the
  placement contract without embedding private target text.
- `.size` ends before identifier one, and unrelated trailing material is not
  claimed by the template.

