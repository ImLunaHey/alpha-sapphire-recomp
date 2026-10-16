# Probe-verified duplicate ARM templates 68

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, direct-transfer-normalized complete-body duplicate grouping, bounded
  target control/data-flow inspection, direct-transfer resolution, post-body
  identity and boundary inspection, and an independent GNU Arm Embedded 15.2
  mnemonic-only probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private literal values, target hashes, implementation source, or
  proprietary source.

Every function already exact in the current report and every function named by
an existing tracked implementation contract was excluded. Candidate selection
was restricted to unmatched ARM-state functions at or above `0x00400000`,
keeping this lane separate from concurrent low-address work. Seven functions
share three complete schedules, totaling 764 executable bytes:

```text
func_00498858  func_004997B8
func_004C8A2C  func_004C8A84  func_004C8ADC
func_0053BDE0  func_0053D934
```

## Reset-ten-slot-owner contract

`func_00498858` and `func_004997B8` share a 144-byte schedule. The routine
retains its owner argument in `r5` and first writes its per-expansion derived
dispatch identity to owner offset zero. When owner offset 68 is zero and owner
offset 16 is nonzero, it calls `func_001397B8` once for each of the ten words
at owner offsets 20 through 56, in ascending order. The loop is skipped when
either gating condition selects the clear path.

The routine then writes zero to owner offsets 68, 16, and 12. A second loop
also writes zero to all ten words at offsets 20 through 56, two words per
iteration in ascending order. Finally it installs the shared base dispatch
identity at owner offset zero and returns the original owner pointer.

Malformed owner or slot pointers, release-helper non-return behavior, and
ordinary helper call clobbers retain the target's machine-level behavior. The
complete set of local branch destinations is +44, +68, and +88. The linked
direct call is:

| Offset | Relocation | Destination | Role |
| ---: | --- | --- | --- |
| +52 | `R_ARM_CALL` | `func_001397B8` | release one populated slot |

Each symbol ends at +144. The instruction at +8 loads a distinct
per-expansion dispatch identity from +144. The instruction at +124 loads the
same shared base dispatch identity in both expansions from +148. The eight bytes
from +144 through +151 are therefore template-owned post-body material, and
the next inventoried global starts at +152. The `.size` boundary must precede
both aligned identity slots.

## Find-linked-object-by-identity contract

`func_004C8A2C`, `func_004C8A84`, and `func_004C8ADC` share an 84-byte
schedule. The routine loads its argument's offset-four pointer and passes that
pointer to `func_004C8F3C`. A null result returns zero immediately. Otherwise,
the result is retained as the candidate object, and the per-expansion type
identity is loaded.

The routine loads the candidate's leading dispatch pointer and indirectly
invokes its offset-eight entry with the candidate as `r0`. Beginning with the
indirect result, it compares the current pointer with the type identity. A
match returns the original candidate. A mismatch advances through the current
pointer's offset-zero link; reaching null returns zero, while a non-null link
continues the comparison loop. Notice that only the first operation is a
virtual call: later iterations follow offset-zero links directly.

Null or malformed non-null input, candidate, dispatch, returned-chain, or link
pointers preserve the target's conditional accesses and faulting behavior.
The one register-indirect linked transfer is at +48. The complete local branch
destinations are +52, +76, and +80. The linked direct call is:

| Offset | Relocation | Destination | Role |
| ---: | --- | --- | --- |
| +8 | `R_ARM_CALL` | `func_004C8F3C` | acquire the candidate chain head |

Each symbol ends at +84. The conditional load at +16 reads an aligned
per-expansion type identity at +84. The three identities are mutually
distinct, are distinct from every identity in the reset template, and do not
reuse an earlier configured duplicate-template identity. Template-owned
material ends at +87 and the next inventoried global starts at +88. The
`.size` boundary must precede the identity slot.

## Route-or-initialize-owner contract

`func_0053BDE0` and `func_0053D934` share a 112-byte schedule. The routine
retains the owner from `r0` and the route record from `r1`. It calls
`func_0017F0D8` with the original owner, loads offset 16 from the returned
context, and passes that pointer together with owner offset 104 to
`func_00172044`.

When the lookup result is non-null, the routine calls `func_001524C8` with the
route record. It then loads the first three words of that record into `r1`
through `r3`, restores the lookup result to `r0`, and dispatches according to
the selector result. A nonzero selector result calls `func_00205A98`. A zero
selector result executes an explicit no-op, calls `func_00170E24`, and then
executes two further explicit no-ops. Both paths join without normalizing any
helper result.

When the lookup result is null, the routine calls `func_00160BA8` with owner
plus 128 in `r0` and four in `r1`. All paths restore the owner to `r0`, restore
saved registers, and tail-branch to `func_0029F40C`.

Malformed owner, context, or route-record pointers retain the target's
original faulting behavior. Helper failure, non-return behavior, and normal
call clobbers are not strengthened into a higher-level contract. The complete
set of local branch destinations is +68, +88, and +100. The ordered linked
direct transfers are:

| Offset | Relocation | Destination | Role |
| ---: | --- | --- | --- |
| +12 | `R_ARM_CALL` | `func_0017F0D8` | acquire context |
| +24 | `R_ARM_CALL` | `func_00172044` | look up route |
| +40 | `R_ARM_CALL` | `func_001524C8` | select route kind |
| +60 | `R_ARM_CALL` | `func_00205A98` | dispatch primary route |
| +72 | `R_ARM_CALL` | `func_00170E24` | dispatch secondary route |
| +96 | `R_ARM_CALL` | `func_00160BA8` | initialize fallback state |
| +108 | `R_ARM_JUMP24` | `func_0029F40C` | finalize owner |

Each symbol ends at +112 and owns no literal pool or trailing material.
Unrelated anonymous target material begins immediately at +112. The next
inventoried globals begin at +5296 and +5064 for `func_0053BDE0` and
`func_0053D934`, respectively. That anonymous material is not owned by this
template and must not be copied or synthesized.

## Complete exact schedules

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT68_RESET name, derived_identity, base_identity
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, lr}
    mov     r5, r0
    ldr     r0, .Ldt68_reset_derived\@
    str     r0, [r5]
    ldr     r0, [r5, #68]
    cmp     r0, #0
    bne     .Ldt68_reset_clear\@
    ldr     r0, [r5, #16]
    cmp     r0, #0
    movne   r4, #0
    beq     .Ldt68_reset_clear\@
.Ldt68_reset_release_loop\@:
    add     r0, r5, r4, lsl #2
    ldr     r0, [r0, #20]
    bl      func_001397B8
    add     r4, r4, #1
    cmp     r4, #10
    blt     .Ldt68_reset_release_loop\@
.Ldt68_reset_clear\@:
    mov     r0, #0
    str     r0, [r5, #68]
    mov     r2, r0
    mov     r1, r0
    str     r0, [r5, #16]
.Ldt68_reset_pair_loop\@:
    add     r12, r5, r2, lsl #2
    add     r2, r2, #1
    add     r1, r1, #2
    add     r3, r5, r2, lsl #2
    str     r0, [r12, #20]
    cmp     r1, #10
    add     r2, r2, #1
    str     r0, [r3, #20]
    blt     .Ldt68_reset_pair_loop\@
    ldr     r1, .Ldt68_reset_base\@
    str     r0, [r5, #12]
    mov     r0, r5
    str     r1, [r5]
    pop     {r4, r5, r6, pc}
.size \name, .-\name
.Ldt68_reset_derived\@:
    .word \derived_identity
.Ldt68_reset_base\@:
    .word \base_identity
.endm

.macro DT68_FIND name, type_identity
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, lr}
    ldr     r0, [r0, #4]
    bl      func_004C8F3C
    cmp     r0, #0
    ldrne   r5, .Ldt68_find_identity\@
    mov     r6, #0
    movne   r4, r0
    moveq   r0, r6
    beq     .Ldt68_find_return\@
    ldr     r0, [r4]
    ldr     r1, [r0, #8]
    mov     r0, r4
    blx     r1
.Ldt68_find_compare\@:
    cmp     r0, r5
    beq     .Ldt68_find_found\@
    ldr     r0, [r0]
    cmp     r0, #0
    bne     .Ldt68_find_compare\@
    mov     r4, r6
.Ldt68_find_found\@:
    mov     r0, r4
.Ldt68_find_return\@:
    pop     {r4, r5, r6, pc}
.size \name, .-\name
.Ldt68_find_identity\@:
    .word \type_identity
.endm

.macro DT68_ROUTE name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push    {r4, r5, r6, lr}
    mov     r5, r0
    mov     r4, r1
    bl      func_0017F0D8
    ldr     r1, [r5, #104]
    ldr     r0, [r0, #16]
    bl      func_00172044
    movs    r6, r0
    beq     .Ldt68_route_missing\@
    mov     r0, r4
    bl      func_001524C8
    ldmia   r4, {r1, r2, r3}
    cmp     r0, #0
    mov     r0, r6
    beq     .Ldt68_route_secondary\@
    bl      func_00205A98
    b       .Ldt68_route_finish\@
.Ldt68_route_secondary\@:
    nop
    bl      func_00170E24
    nop
    nop
    b       .Ldt68_route_finish\@
.Ldt68_route_missing\@:
    mov     r1, #4
    add     r0, r5, #128
    bl      func_00160BA8
.Ldt68_route_finish\@:
    mov     r0, r5
    pop     {r4, r5, r6, lr}
    b       func_0029F40C
.size \name, .-\name
.endm

DT68_RESET func_00498858, arm_duplicate_templates_68_reset_derived_00498858_identity, arm_duplicate_templates_68_reset_shared_base_identity
DT68_RESET func_004997B8, arm_duplicate_templates_68_reset_derived_004997B8_identity, arm_duplicate_templates_68_reset_shared_base_identity
DT68_FIND func_004C8A2C, arm_duplicate_templates_68_find_004C8A2C_identity
DT68_FIND func_004C8A84, arm_duplicate_templates_68_find_004C8A84_identity
DT68_FIND func_004C8ADC, arm_duplicate_templates_68_find_004C8ADC_identity
DT68_ROUTE func_0053BDE0
DT68_ROUTE func_0053D934
```

Every macro-local label must be unique per expansion. The symbolic identities
must remain unresolved relocation targets in the implementation object; no
private literal value belongs in source or configuration.

## Independent exact-probe evidence

GNU Arm Embedded 15.2 independently assembled all seven mnemonic schedules.
Every complete body matched its target body after normalization of only the
audited direct-transfer instruction fields. All local branches, conditional
operations, memory operations, indirect transfer, explicit no-ops, prologues,
and epilogues matched without normalization. The probe emitted the expected
ordered `R_ARM_CALL`, `R_ARM_JUMP24`, and `R_ARM_ABS32` relocations. Bounded
target inspection confirmed the documented identity equality classes and
function/material/global boundaries. Temporary probes and extracted material
were deleted after verification.

## Clean-room handoff

Implement only from this document and
`config/arm-duplicate-templates-68.json`. Keep every direct transfer and pool
identity symbolic. After implementation, pin the source SHA-256 in the
manifest. A validator should check body and section sizes, instruction counts,
ordered relocations, complete local branch destinations, literal-load targets,
identity-sharing and distinctness relationships, anonymous-material and
next-global boundaries, and complete target-body identity after
direct-transfer normalization. Do not transcribe target encodings or private
target material into source, scripts, configuration, or documentation.
