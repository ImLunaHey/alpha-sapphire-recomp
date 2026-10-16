# Probe-verified duplicate ARM templates 45

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body symbolic duplicate grouping, bounded target
  disassembly and control/data-flow inspection, direct-call target resolution,
  physical post-body literal comparison, boundary analysis, and an independent
  decoded-schedule and control-flow audit.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, extracted assets, private absolute
  addresses, private literal values, implementation source, or proprietary
  source.

Every function already exact in the current report and every function named
by a tracked configuration or specification was excluded before grouping.
The concurrently selected runtime batch 45 functions were also excluded and
are disjoint from this batch. The two functions below are the highest-yield
remaining complete-body ARM duplicate group after direct calls are represented
symbolically: two 580-byte bodies, totaling 1,160 executable bytes.

## Polymorphic-record vector insertion

These ARM-state functions share one complete 145-instruction body schedule:

```text
func_0056FDB0  func_00570000
```

The entry registers are a vector control record in `r0`, an insertion position
in `r1`, and a source record in `r2`. The vector control record holds begin,
end, and capacity pointers at offsets 0, 4, and 8. Each element occupies 24
bytes and consists of a primary dispatch word, two payload words at offsets 8
and 12, a secondary dispatch word at offset 16, and one further payload word
at offset 20.

When spare capacity exists, the function advances the end pointer by one
record, shifts the suffix backward-safe by 24 bytes, and copies the source
payload into the insertion slot while installing the expansion-specific
dispatch identities. When reallocation is required, it chooses a new element
capacity as the greater of 32 plus the old size and the old size plus one half
plus one eighth of the old size. It allocates `capacity * 24` bytes, copies the
prefix, inserted record, and suffix into the new region, invokes the primary
virtual destructor on every old record, releases the old allocation, and
updates all three vector pointers. Pointer differences are converted to signed
element counts by the shared arithmetic literal. The exact instruction and
register schedule below, rather than this semantic summary, is the
implementation contract.

## Call, literal, equality, boundary, and CFG ledgers

Each body has two direct ARM-state link-setting calls:

| Body offset | Relocation | Symbolic identity | Semantic role |
| ---: | --- | --- | --- |
| +224 | `R_ARM_CALL` | `func_00184990` | allocate the replacement record region |
| +544 | `R_ARM_CALL` | `func_00160F9C` | release the old record region |

The four direct-call sites across the two expansions form two two-occurrence
target-identity classes. Each body also has one non-relocated indirect call at
+524: the target is loaded from the first word of the dispatch object stored
at the old record's offset 0 and invoked with the old record address in `r0`.
There are no other direct or indirect calls, tail calls, veneers, or external
non-call branches.

Three ordered word-sized literal slots immediately follow each body:

| Pool offset | Load site | Relocation | Semantic role |
| ---: | ---: | --- | --- |
| +580 | +24 | `R_ARM_ABS32` | signed division-by-24 arithmetic identity |
| +584 | +28 | `R_ARM_ABS32` | expansion-specific primary dispatch identity |
| +588 | +36 | `R_ARM_ABS32` | expansion-specific secondary dispatch identity |

The +580 slots are equal across the two expansions and form one two-occurrence
equality class. The four dispatch occurrences are pairwise unequal: each
expansion has its own primary identity and its own secondary identity, and no
primary identity equals a secondary identity. Their private values are not
part of this specification. There are no other PC-relative loads, embedded
tables, post-body words, or alignment bytes. Each function symbol ends at
+580; its three-word pool occupies +580 through +591, and the next function
begins at +592.

After the two direct-call instruction fields are normalized by symbolic target,
the complete 580-byte bodies are equal. The pool is outside the function-size
boundary and is governed by the slot and equality contracts above. The
complete ordered local-label ledger is:

```text
+132, +144, +176, +196, +244, +292, +308,
+376, +420, +468, +484, +512, +540
```

All labels must be uniquely scoped per template expansion. The complete basic
block successor schedule is:

| Block start | Inclusive end | Successors |
| ---: | ---: | --- |
| +0 | +76 | +80, +196 |
| +80 | +92 | +96, +132 |
| +96 | +128 | +132 |
| +132 | +140 | +144, +176 |
| +144 | +172 | +144, +176 |
| +176 | +192 | return |
| +196 | +240 | +244, +308 |
| +244 | +248 | +252, +292 |
| +252 | +304 | +244, +308 |
| +308 | +336 | +340, +376 |
| +340 | +372 | +376 |
| +376 | +416 | +420, +484 |
| +420 | +424 | +428, +468 |
| +428 | +480 | +420, +484 |
| +484 | +508 | +512, +540 |
| +512 | +536 | +512, +540 |
| +540 | +576 | return |

The calls at +224, +524, and +544 return to their following instructions and
do not add inter-block successors.

## Complete exact body schedule

`primary_dispatch` and `secondary_dispatch` name the expansion-specific
identities from the mapping below. `divide_by_24` names the shared arithmetic
identity. The `.size` boundary must precede the pool.

```asm
    push {r4, r5, r6, r7, r8, r9, sl, fp, ip, lr}
    mov r5, r0
    mov r7, r1
    mov r9, r2
    ldr r0, [r0, #8]
    ldr r1, [r5]
    ldr fp, .Ldt45_pool
    ldr r6, .Ldt45_pool+4
    sub r0, r0, r1
    ldr r4, .Ldt45_pool+8
    smull r2, r0, fp, r0
    asr r2, r0, #2
    sub r2, r2, r0, asr #31
    ldr r0, [r5, #4]
    sub r1, r0, r1
    smull r3, r1, fp, r1
    asr r3, r1, #2
    sub r1, r3, r1, asr #31
    cmp r2, r1
    bls .Ldt45_00c4
    add r1, r0, #24
    cmp r0, #0
    str r1, [r5, #4]
    beq .Ldt45_0084
    sub r1, r0, #16
    add r5, r0, #8
    ldm r1, {r1, r3}
    add r2, r0, #16
    stm r5, {r1, r3}
    sub r1, r0, #8
    ldm r1, {r1, r3}
    stm r2, {r1, r3}
    str r4, [r0]
.Ldt45_0084:
    sub r1, r0, #24
    cmp r7, r1
    beq .Ldt45_00b0
.Ldt45_0090:
    sub r1, r1, #24
    sub r0, r0, #24
    ldrd r2, r3, [r1, #8]
    cmp r7, r1
    strd r2, r3, [r0, #8]
    ldrd r2, r3, [r1, #16]
    strd r2, r3, [r0, #16]
    bne .Ldt45_0090
.Ldt45_00b0:
    ldrd r0, r1, [r9, #8]
    strd r0, r1, [r7, #8]
    ldrd r0, r1, [r9, #16]
    strd r0, r1, [r7, #16]
    pop {r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
.Ldt45_00c4:
    add r0, r1, r1, lsr #1
    add sl, r0, r1, lsr #3
    add r0, r1, #32
    cmp sl, r0
    movlo sl, r0
    add r0, sl, sl, lsl #1
    lsl r0, r0, #3
    bl func_00184990
    ldr r2, [r5]
    mov r8, r0
    cmp r2, r7
    beq .Ldt45_0134
.Ldt45_00f4:
    cmp r0, #0
    beq .Ldt45_0124
    add r3, r2, #8
    str r6, [r0]
    add r1, r0, #16
    vldmia r3, {s0, s1}
    add r3, r0, #8
    vstmia r3, {s0, s1}
    add r3, r2, #16
    ldm r3, {r3, ip}
    stm r1, {r3, ip}
    str r4, [r0]
.Ldt45_0124:
    add r2, r2, #24
    cmp r2, r7
    add r0, r0, #24
    bne .Ldt45_00f4
.Ldt45_0134:
    ldr r0, [r5]
    sub r0, r7, r0
    smull r1, r0, fp, r0
    asr r1, r0, #2
    sub r0, r1, r0, asr #31
    add r0, r0, r0, lsl #1
    adds r0, r8, r0, lsl #3
    beq .Ldt45_0178
    add r1, r9, #8
    str r6, [r0]
    ldm r1, {r1, r2}
    add r3, r0, #8
    add r9, r9, #16
    stm r3, {r1, r2}
    ldm r9, {r1, r2}
    str r4, [r0], #16
    stm r0, {r1, r2}
.Ldt45_0178:
    ldr r0, [r5]
    ldr r2, [r5, #4]
    sub r0, r7, r0
    cmp r7, r2
    smull r1, r0, fp, r0
    asr r1, r0, #2
    sub r0, r1, r0, asr #31
    add r0, r0, r0, lsl #1
    add r0, r8, r0, lsl #3
    add r1, r0, #24
    beq .Ldt45_01e4
.Ldt45_01a4:
    movs r0, r1
    beq .Ldt45_01d4
    add r3, r7, #8
    str r6, [r0]
    ldm r3, {r3, ip}
    add r9, r0, #8
    stm r9, {r3, ip}
    add r3, r7, #16
    add r9, r0, #16
    ldm r3, {r3, ip}
    stm r9, {r3, ip}
    str r4, [r1]
.Ldt45_01d4:
    add r7, r7, #24
    cmp r7, r2
    add r1, r0, #24
    bne .Ldt45_01a4
.Ldt45_01e4:
    ldm r5, {r4, r6}
    sub r0, r6, r4
    cmp r4, r6
    smull r1, r0, fp, r0
    asr r1, r0, #2
    sub r7, r1, r0, asr #31
    beq .Ldt45_021c
.Ldt45_0200:
    ldr r0, [r4]
    ldr r1, [r0]
    mov r0, r4
    blx r1
    add r4, r4, #24
    cmp r4, r6
    bne .Ldt45_0200
.Ldt45_021c:
    ldr r0, [r5]
    bl func_00160F9C
    add r0, r7, r7, lsl #1
    add r1, sl, sl, lsl #1
    add r0, r8, r0, lsl #3
    add r1, r8, r1, lsl #3
    add r0, r0, #24
    str r8, [r5]
    strd r0, r1, [r5, #4]
    pop {r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
```

The per-expansion slot mapping is:

| Expansion | `divide_by_24` | `primary_dispatch` | `secondary_dispatch` |
| --- | --- | --- | --- |
| `func_0056FDB0` | shared arithmetic identity | `func_0056FDB0_primary_dispatch_identity` | `func_0056FDB0_secondary_dispatch_identity` |
| `func_00570000` | shared arithmetic identity | `func_00570000_primary_dispatch_identity` | `func_00570000_secondary_dispatch_identity` |

## Implementation and validation contract

- Emit each function in its own four-byte-aligned ARM executable section.
- Emit exactly 145 ARM instructions and 580 function bytes per expansion.
- Preserve the register allocation, condition codes, addressing modes,
  writeback forms, paired transfers, VFP transfers, and instruction order.
- Emit the two direct calls at +224 and +544 with the identities above, plus
  the non-relocated `blx r1` at +524.
- Place exactly three word-sized pool slots after `.size`, at +580, +584, and
  +588, with loads at +24, +28, and +36 respectively.
- Preserve the stated literal equality and inequality classes; do not encode
  or publish private literal values.
- Emit no embedded data, additional post-body words, or padding between the
  third pool slot and the following function.

Private validation verified both 580-byte function extents and both 592-byte
body-plus-pool extents, checked the 13 local branch destinations and the
complete CFG, resolved all four direct calls, verified both indirect calls,
checked all six literal uses and all pool equality classes, and compared the
complete decoded body schedules after symbolic call normalization. No private
probe artifacts remain.
