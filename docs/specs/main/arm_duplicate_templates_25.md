# Probe-verified duplicate ARM templates 25

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body duplicate grouping, control/data-flow inspection,
  physical post-body literal-layout inspection, and independent GNU Arm
  mnemonic probes.
- Probe toolchain: GNU Arm assembler and objcopy 2.45.1.20251203 from GCC Arm
  Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, literal values, extracted assets,
  private numeric addresses, implementation source, or proprietary source.

Every function exact in the current report and every function named by a
manifest or specification through batch 24, including the concurrently staged
IPC and runtime work, was excluded before grouping. This bounded batch contains
seven complete-body groups: exactly 15 ARM-state functions and 300 code bytes.

There are ten physical post-body literal slots in nine equality classes. The
two typed-clear functions deliberately share one read-only identity; all other
slots are mutually distinct and are also distinct from every literal identity
already named by the earlier manifests. All literal slots described below are
four-byte objects at four-byte-aligned relative offsets.

## Halfword merge into a bit accumulator

These ARM-state functions are 20 bytes and identical:

- `func_001B0468`
- `func_001B6A68`
- `func_001BD068`

Load an unsigned halfword through `r1` and post-increment `r1` by two. Advance
the bit count in `r2` by 16, form `16 - r2` in `r9`, merge the halfword into
the accumulator in `r3` using that register-specified left shift, and return
through the explicit `pc` move. Preserve the arithmetic and register schedule;
in particular, the reverse subtraction observes the already incremented
`r2`.

```asm
ldrh r10, [r1], #2
add r2, r2, #16
rsb r9, r2, #16
orr r3, r3, r10, lsl r9
mov pc, lr
```

There are no calls, relocations, or literal slots.

## Conditional mutable-word clear

These ARM-state functions are 24 bytes and identical over their complete
bodies:

- `func_00153B54`
- `func_00154014`

Load the function's named mutable-state address, read its word, and compare the
word with zero. If it is nonzero, materialize zero in `r1` and write it back;
otherwise leave the word untouched. Return with `r0` still holding the
mutable-state address.

```asm
ldr r0, <mutable-state-identity>
ldr r1, [r0]
cmp r1, #0
movne r1, #0
strne r1, [r0]
bx lr
```

Each function has one data-segment, word-aligned address literal immediately
after its body at relative offset 24; the load begins at body offset 0. Name
the two distinct identities `duplicate_template_25_mutable_state_a` and
`duplicate_template_25_mutable_state_b`, respectively. There are no calls.

## Descriptor pair and byte-state initializer

These ARM-state functions are 24 bytes and identical over their bodies:

- `func_00411040`
- `func_00411270`

Load the function's read-only descriptor base in `r1`, materialize zero in
`r3`, clear the byte at destination offset 8, form descriptor base plus 32 in
`r2`, then store `r1` and `r2` together at destination offsets 0 and 4. Return
the original destination in `r0`.

```asm
ldr r1, <descriptor-base-identity>
mov r3, #0
strb r3, [r0, #8]
add r2, r1, #32
stm r0, {r1, r2}
bx lr
```

Each function has one read-only-segment, word-aligned descriptor literal
immediately after its body at relative offset 24; the load begins at body
offset 0. Name the distinct identities
`duplicate_template_25_descriptor_base_a` and
`duplicate_template_25_descriptor_base_b`, respectively. There are no calls.

## Shared-type two-word initializer

These ARM-state functions are 20 bytes and identical:

- `func_00240AD8`
- `func_0029F57C`

Install the shared named type identity at destination offset 0, materialize
zero in the same register, clear destination offset 4, and return the original
destination.

```asm
ldr r1, <shared-type-identity>
str r1, [r0]
mov r1, #0
str r1, [r0, #4]
bx lr
```

One read-only-segment, word-aligned literal immediately follows each body at
relative offset 20; each load begins at body offset 0. Both slots contain the
same identity, named `duplicate_template_25_shared_type`. This is the batch's
only repeated literal equality class. There are no calls.

## Unsigned inclusive-bound predicate

These ARM-state functions are 20 bytes and identical over their bodies:

- `func_002C2CD4`
- `func_002C2EB8`

Load the function's unsigned scalar bound, compare `r0` against it, return one
when `r0` is lower than or equal to the bound, and return zero when it is
higher. Preserve the unsigned `ls`/`hi` condition pair and the two conditional
moves.

```asm
ldr r1, <unsigned-bound-identity>
cmp r0, r1
movls r0, #1
movhi r0, #0
bx lr
```

Each function has one four-byte scalar literal immediately after its body at
relative offset 20; the load begins at body offset 0. The two scalar values are
distinct and are not address identities. Name them
`duplicate_template_25_unsigned_bound_a` and
`duplicate_template_25_unsigned_bound_b`, respectively. There are no calls.

## Packed selector to 32-byte-stride pointer

These ARM-state functions are 20 bytes and identical:

- `func_003279C8`
- `func_004BE69C`

Treat `r0` as a record base. Load the base pointer from offset 52, load a packed
selector word from offset 44 into `r0`, shift it left by 30, and add its logical
right shift by 25 to the loaded base pointer. Equivalently, the returned
address is the pointer at offset 52 plus the low two selector bits multiplied
by 32, but implementation must preserve the literal instruction schedule.

```asm
ldr r1, [r0, #52]
ldr r0, [r0, #44]
lsl r0, r0, #30
add r0, r1, r0, lsr #25
bx lr
```

There are no calls, relocations, or literal slots.

## Indirect dispatch tail transfer

These ARM-state functions are 12 bytes and identical over their bodies:

- `func_001D1EB0`
- `func_001E2C0C`

Load the function's named dispatch-owner address, load the word at owner offset
4, and branch to that loaded address without setting the link register. This is
an indirect tail transfer rather than a link-setting call.

```asm
ldr r1, <dispatch-owner-identity>
ldr r1, [r1, #4]
bx r1
```

Each function has one data-segment, word-aligned address literal immediately
after its body at relative offset 12; the load begins at body offset 0. Name
the distinct identities `duplicate_template_25_dispatch_owner_a` and
`duplicate_template_25_dispatch_owner_b`, respectively. There are no direct
calls or direct branch relocations; only the named address literal is emitted.

## Literal equality and relocation ledger

| Identity | Occurrences | Class | Placement and use |
| --- | ---: | --- | --- |
| `duplicate_template_25_mutable_state_a` | 1 | data address | `func_00153B54 + 24`; loaded at body offset 0 |
| `duplicate_template_25_mutable_state_b` | 1 | data address | `func_00154014 + 24`; loaded at body offset 0 |
| `duplicate_template_25_descriptor_base_a` | 1 | read-only address | `func_00411040 + 24`; loaded at body offset 0 |
| `duplicate_template_25_descriptor_base_b` | 1 | read-only address | `func_00411270 + 24`; loaded at body offset 0 |
| `duplicate_template_25_shared_type` | 2 | shared read-only address | both typed-clear bodies + 20; loaded at body offset 0 |
| `duplicate_template_25_unsigned_bound_a` | 1 | unsigned scalar | `func_002C2CD4 + 20`; loaded at body offset 0 |
| `duplicate_template_25_unsigned_bound_b` | 1 | unsigned scalar | `func_002C2EB8 + 20`; loaded at body offset 0 |
| `duplicate_template_25_dispatch_owner_a` | 1 | data address | `func_001D1EB0 + 12`; loaded at body offset 0 |
| `duplicate_template_25_dispatch_owner_b` | 1 | data address | `func_001E2C0C + 12`; loaded at body offset 0 |

The address identities are symbolic relocations. No implementation should
encode a private target address or either scalar bound directly. The target
generator may normalize only these audited named identities.

## Independent full-body probe result

The seven literal mnemonic templates above were independently assembled in ARM
state. Every listed function's complete declared body was compared byte for
byte with the corresponding private executable body. Post-body literal values
were excluded from body comparison and audited independently by physical slot,
segment/scalar class, alignment, and equality class.

| Template | Functions | Bytes each | Aggregate | Full-body result |
| --- | ---: | ---: | ---: | --- |
| Halfword merge | 3 | 20 | 60 | 3/3 exact |
| Conditional mutable-word clear | 2 | 24 | 48 | 2/2 exact |
| Descriptor pair initializer | 2 | 24 | 48 | 2/2 exact |
| Shared-type two-word initializer | 2 | 20 | 40 | 2/2 exact |
| Unsigned inclusive-bound predicate | 2 | 20 | 40 | 2/2 exact |
| Packed-selector pointer | 2 | 20 | 40 | 2/2 exact |
| Indirect dispatch tail transfer | 2 | 12 | 24 | 2/2 exact |
| **Total** | **15** |  | **300** | **15/15 exact** |

Implementation must preserve ARM state; every mnemonic and register choice;
post-indexing; arithmetic order; condition flags and unsigned conditions; byte
versus word store widths; paired-store order; the explicit `mov pc, lr`
return; indirect non-linking transfer; and post-body literal placement and
identity equality. The overlap audit found zero functions shared with any
exact report entry or any manifest/specification through batch 24.
