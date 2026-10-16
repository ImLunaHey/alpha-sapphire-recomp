# Probe-verified duplicate ARM templates 39

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body symbolic duplicate grouping, bounded target
  disassembly and control/data-flow inspection, direct-call target resolution,
  post-body literal analysis, and an independent GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, objcopy, readelf, and objdump
  2.45.1.20251203.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, extracted assets, private absolute
  addresses, private data values, implementation source, or proprietary
  source.

Every function already exact in the current report and every function named
by a tracked configuration or specification was excluded before grouping.
The concurrently selected runtime batch 39 functions were also excluded and
are disjoint from this batch. The twelve functions below are the highest-yield
remaining complete-body symbolic ARM duplicate group: twelve 192-byte bodies,
totaling 2,304 executable bytes. The next remaining group totals 1,888
executable bytes.

## Typed record creation and registration

These ARM-state functions share one complete 48-instruction schedule after
the five external direct calls are represented by symbolic code identities:

```text
func_001628A0  func_00163AA4  func_00172534  func_00173064
func_00270F44  func_00278924  func_00287E00  func_0028F9E0
func_002914EC  func_002948AC  func_0029DB3C  func_0029FAC4
```

Entry `r0` is forwarded to a shared creation helper and entry `r1` supplies an
optional unsigned halfword parameter. The returned record is 68 bytes. The
function installs its per-expansion dispatch identity at offset 0 and, when
the optional parameter is nonzero, stores its low halfword at offset 32. It
then allocates and initializes an auxiliary object, obtains a registry index,
and resolves either the indexed registry entry or the registry fallback at
offset 4. An out-of-range index invokes the shared diagnostic helper with the
expansion's read-only diagnostic descriptor. Finally, the function obtains a
callable field at offset 12 through the selected registry record, passes the
optional parameter and auxiliary object to the shared registration helper,
and returns the created record. A null optional parameter skips allocation and
registration.

The exact instruction and register schedule, rather than this semantic
summary, is the implementation contract.

## Call, literal, equality, and relative ledgers

Each body makes six ARM-state link-setting calls. Five have shared external
targets, while the sixth calls the current expansion's own entry:

| Body offset | Relocation | Symbolic identity | Semantic note |
| ---: | --- | --- | --- |
| +12 | `R_ARM_CALL` | `func_00178DFC` | shared record creation helper |
| +48 | `R_ARM_CALL` with addend -4 | `func_00184990` | one-instruction entry pad immediately before the shared allocator |
| +68 | `R_ARM_CALL` | current expansion (`$self`) | initialize the auxiliary object through the same template |
| +80 | `R_ARM_CALL` | `func_00171FC0` | shared registry-index helper |
| +140 | `R_ARM_CALL` | `func_00178974` | shared diagnostic helper |
| +164 | `R_ARM_CALL` | `func_0017933C` | shared registration helper |

Each external call-site identity is equal across all twelve expansions,
producing five twelve-occurrence call equality classes. The body-local site
has the same relative displacement in every expansion but twelve distinct
semantic destinations, one current-entry identity per expansion. The
allocator call must retain its
symbolic -4 addend: it targets the inert one-instruction entry pad immediately
before `func_00184990`, then falls through into that function. The pad is a
code-location relationship, not a private numeric address or an additional
function body.

Three word-sized literal slots immediately follow each body:

| Pool offset | Load site | Relocation | Semantic role |
| ---: | ---: | --- | --- |
| +192 | +16 | `R_ARM_ABS32` | per-function derived dispatch identity |
| +196 | +84 | `R_ARM_ABS32` | shared mutable registry identity |
| +200 | +124 | `R_ARM_ABS32` | diagnostic descriptor identity |

The twelve dispatch identities are mutually distinct:

```text
func_001628A0_dispatch_identity
func_00163AA4_dispatch_identity
func_00172534_dispatch_identity
func_00173064_dispatch_identity
func_00270F44_dispatch_identity
func_00278924_dispatch_identity
func_00287E00_dispatch_identity
func_0028F9E0_dispatch_identity
func_002914EC_dispatch_identity
func_002948AC_dispatch_identity
func_0029DB3C_dispatch_identity
func_0029FAC4_dispatch_identity
```

All twelve registry slots share
`arm_duplicate_templates_39_shared_registry_identity`. The diagnostic slots
form nine equality classes. Three classes are shared pairs:

| Diagnostic identity | Expansions |
| --- | --- |
| `arm_duplicate_templates_39_diagnostic_descriptor_pair_00172534` | `func_00172534`, `func_00173064` |
| `arm_duplicate_templates_39_diagnostic_descriptor_pair_0028F9E0` | `func_0028F9E0`, `func_002948AC` |
| `arm_duplicate_templates_39_diagnostic_descriptor_pair_002914EC` | `func_002914EC`, `func_0029FAC4` |

The other six diagnostic identities are singletons, named for their owning
functions: `func_001628A0_diagnostic_descriptor_identity`,
`func_00163AA4_diagnostic_descriptor_identity`,
`func_00270F44_diagnostic_descriptor_identity`,
`func_00278924_diagnostic_descriptor_identity`,
`func_00287E00_diagnostic_descriptor_identity`, and
`func_0029DB3C_diagnostic_descriptor_identity`.

All identities in different equality classes are unequal. Thus the 36 pool
occurrences form exactly 22 equality classes: twelve singleton dispatch
classes, one twelve-occurrence registry class, three two-occurrence diagnostic
classes, and six singleton diagnostic classes.

After the five direct-call fields are normalized by symbolic target and
addend, all twelve complete 192-byte bodies are equal. No other body field
requires normalization. There are no indirect calls, external non-call
branches, adjacent tables, or other post-body words. The complete ordered
local-label ledger is:

```text
+76, +148, +152, +168, +176
```

All labels must be uniquely scoped per template expansion.

## Complete exact body schedule

The angle-bracketed operands name the post-body semantic literal slots from
the ledger above; they are not numeric values or raw encodings.

```asm
    push {r4, r5, r6, lr}
    mov r4, r1
    mov r1, #1
    bl func_00178DFC
    ldr r1, <derived_dispatch_identity>
    cmp r4, #0
    mov r5, r0
    str r1, [r0]
    beq .Ldt39_00a8
    mov r1, r4
    strh r1, [r0, #32]
    mov r0, #68
    bl func_00184990 - 4
    cmp r0, #0
    moveq r6, #0
    beq .Ldt39_004c
    mov r1, #0
    bl func_001628A0
    mov r6, r0
.Ldt39_004c:
    nop
    bl func_00171FC0
    ldr r1, <shared_registry_identity>
    cmp r0, #0
    addeq r0, r1, #4
    beq .Ldt39_00b0
    ldr r1, [r1, #68]
    ldm r1, {r1, r2}
    sub r2, r2, r1
    cmp r0, r2, asr #2
    ldrcc r0, [r1, r0, lsl #2]
    bcc .Ldt39_00b0
    ldr r0, <diagnostic_descriptor_identity>
    mov r3, #0
    mov r2, #-536870909
    mov r1, #73
    bl func_00178974
    mvn r0, #0
.Ldt39_0094:
    ldr r0, [r0, #12]
.Ldt39_0098:
    mov r2, r6
    mov r1, r4
    ldr r0, [r0, #12]
    bl func_0017933C
.Ldt39_00a8:
    mov r0, r5
    pop {r4, r5, r6, pc}
.Ldt39_00b0:
    ldr r0, [r0, #52]
    cmp r0, #0
    beq .Ldt39_0098
    b .Ldt39_0094
```

The self-named call shown at body offset +68 is template-relative: every
expansion calls its own entry symbol at that site. In other words, substitute
the current expansion's function name for `func_001628A0`. Because this call
targets the current body, its encoded displacement is equal in all twelve
expansions and it does not require cross-body symbolic normalization. It is
nevertheless a link-setting call and must remain at the stated offset.

Immediately after the 192-byte body, emit the three symbolic words in slot
order. No alignment padding occurs between body and pool.

## Probe result

A neutral GNU Arm probe expanded the schedule for all twelve function names,
using undefined symbols for the 22 data identities and the five shared
external call identities. For the allocator entry pad, the probe emitted an
`R_ARM_CALL` relocation against `func_00184990` with addend -4. At the
template-relative call at +68, each expansion emitted an `R_ARM_CALL`
relocation against its own defined function symbol.

The probe established all of the following:

- ARM mode and four-byte alignment for every expansion;
- 192 body bytes and 48 instructions per expansion;
- call relocations at +12, +48, +68, +80, +140, and +164, with the +68
  relocation targeting the current expansion;
- literal loads at +16, +84, and +124 reaching the ordered slots at +192,
  +196, and +200;
- five uniquely scoped local labels with the exact ordered offsets above;
- byte equality of every non-call body field against all twelve bounded target
  bodies, exact resolution of the template-relative call, and equality of the
  target bodies after symbolic normalization of the five external call
  fields; and
- exactly 36 `R_ARM_ABS32` pool relocations in the specified 22 equality
  classes.

## Coverage and implementation constraints

The current objdiff report identifies all twelve bodies as unmatched. A full
repository configuration/specification scan excludes every prior tracked
batch, and a reciprocal selection exchange confirms zero overlap with runtime
batch 39 (`func_00337AB8`, `func_003AACD8`, `func_003C8BC4`,
`func_004AAFAC`, `func_004AB108`, and `func_004C2430`).

Implementation must preserve the exact schedule, register choices, condition
codes, label offsets, template-relative call, external symbolic call targets
and allocator addend, pool order, literal-use displacements, and all 22 data
equality classes. It must not encode private data values or replace symbolic
relocations with numeric addresses.
