# Probe-verified duplicate ARM templates 44

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body symbolic duplicate grouping, bounded target
  disassembly and control/data-flow inspection, direct-call target resolution,
  post-body boundary analysis, and an independent GNU Arm exact-schedule
  probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, extracted assets, private absolute
  addresses, private data values, implementation source, or proprietary
  source.

Every function already exact in the current report and every function named
by a tracked configuration or specification was excluded before grouping.
The concurrently selected runtime batch 44 functions were also excluded and
are disjoint from this batch. The two functions below are the highest-yield
remaining complete-body ARM duplicate group after direct calls are represented
symbolically: two 636-byte bodies, totaling 1,272 executable bytes.

## Adaptive arithmetic-decoder symbol update

These ARM-state functions share one complete 159-instruction schedule:

```text
func_0016FF88  func_001F3884
```

The function receives an input-byte pointer in `r0`, an adaptive model in
`r1`, the arithmetic-decoder state in `r2`, and a pointer for the consumed-byte
count in `r3`. The model holds a frequency array at offset 0, a cumulative
frequency array at offset 4, the total frequency at offset 8, and the base-two
alphabet-size exponent byte at offset 12. The decoder state holds its lower
bound, range, and code value at offsets 0, 4, and 8.

The function divides the current range by the model total and then divides the
unsigned code-minus-lower-bound distance by that quotient. It performs an
upper-bound search in the cumulative array, backs up over any entries greater
than the quotient, and returns the resulting halfword symbol index. It narrows
the arithmetic interval using the selected cumulative value and frequency,
increments that frequency and the model total, and increments later cumulative
entries. When the total reaches the rescale threshold, it halves frequencies
greater than one and rebuilds cumulative values and the total. Finally, while
the range remains below the normalization threshold, it shifts all three
decoder words by one byte, appends an input byte to the code value, records the
number of consumed bytes through the entry `r3` pointer, and returns the symbol.

All arithmetic comparisons in the symbol search and normalization tests are
unsigned except for the explicitly signed `r8 <= 0` test controlling the
cumulative-update loop. The exact instruction and register schedule below,
rather than this semantic summary, is the implementation contract.

## Call, equality, boundary, and CFG ledgers

Each body makes two ARM-state link-setting calls:

| Body offset | Relocation | Symbolic identity | Semantic role |
| ---: | --- | --- | --- |
| +56 | `R_ARM_CALL` | `func_0015EC10` | unsigned range divided by model total |
| +72 | `R_ARM_CALL` | `func_0015EC10` | unsigned distance divided by range quotient |

All four call sites across the two expansions form one target-identity class.
After those two call fields are normalized, the complete 636-byte bodies are
equal. There are no indirect calls, external non-call branches, literal loads,
post-body pool words, embedded tables, or alignment bytes.

The complete ordered local-label ledger is:

```text
+100, +132, +144, +160, +320, +328, +396, +468, +544, +560, +616
```

All labels must be uniquely scoped per template expansion. The complete basic
block successor schedule is below; fallthrough offsets that are not branch
destinations are included to make the CFG self-contained.

| Block start | Inclusive end | Successors |
| ---: | ---: | --- |
| +0 | +96 | +100, +132 |
| +100 | +128 | +100, +132 |
| +132 | +140 | +144, +160 |
| +144 | +156 | +144, +160 |
| +160 | +252 | +256, +396 |
| +256 | +272 | +276, +396 |
| +276 | +292 | +296, +320 |
| +296 | +316 | +320 |
| +320 | +324 | +328, +396 |
| +328 | +392 | +328, +396 |
| +396 | +404 | +408, +544 |
| +408 | +464 | +468, +544 |
| +468 | +540 | +468, +544 |
| +544 | +556 | +560, +616 |
| +560 | +612 | +560, +616 |
| +616 | +632 | return |

## Complete exact body schedule

```asm
    push {r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, sl, fp, lr}
    sub sp, sp, #4
    mov r4, r1
    mov r6, r0
    mov r5, r2
    mov r9, #1
    ldrb r1, [r1, #12]
    ldr r0, [r2, #8]
    ldr r7, [r2]
    ldr r2, [r2, #4]
    lsl sl, r9, r1
    sub fp, r0, r7
    ldr r1, [r4, #8]
    mov r0, r2
    bl func_0015EC10
    mov r8, r0
    mov r1, r8
    mov r0, fp
    bl func_0015EC10
    ldr r2, [r4, #4]
    mov r3, r0
    sub r0, sl, #1
    cmp r0, #0
    mov r1, #0
    bls .Ldt44_0084
.Ldt44_0064:
    add ip, r1, r0
    lsr ip, ip, #1
    ldr sl, [r2, ip, lsl #2]
    cmp sl, r3
    movhi r0, ip
    addls r1, ip, #1
    cmp r1, r0
    blo .Ldt44_0064
.Ldt44_0084:
    ldr r0, [r2, r1, lsl #2]
    cmp r0, r3
    bls .Ldt44_00a0
.Ldt44_0090:
    sub r1, r1, #1
    ldr r0, [r2, r1, lsl #2]
    cmp r0, r3
    bhi .Ldt44_0090
.Ldt44_00a0:
    uxth r0, r1
    str r0, [sp]
    ldr r0, [r2, r0, lsl #2]
    mov r3, #0
    mla r0, r0, r8, r7
    str r0, [r5]
    ldr r1, [r4]
    ldr r0, [sp]
    ldr r0, [r1, r0, lsl #2]
    mul r0, r0, r8
    str r0, [r5, #4]
    ldr r0, [sp]
    ldr r1, [r4]
    ldrb ip, [r4, #12]
    add r2, r0, #1
    ldr r7, [r1, r0, lsl #2]
    lsl ip, r9, ip
    add r7, r7, #1
    str r7, [r1, r0, lsl #2]
    ldr r1, [r4, #8]
    cmp r2, ip
    add r1, r1, #1
    str r1, [r4, #8]
    bhs .Ldt44_018c
    sub r1, ip, r0
    sub r8, r1, #1
    cmp r8, #0
    mov r7, #0
    ble .Ldt44_018c
    sub r1, r1, #2
    bic r1, r9, r1
    cmp r1, #1
    mov r2, #4
    bne .Ldt44_0140
    ldr r9, [r4, #4]
    add sl, r2, r0, lsl #2
    ldr r7, [r9, sl]
    add fp, r7, #1
    mov r7, #1
    str fp, [r9, sl]
.Ldt44_0140:
    cmp r8, r1
    bls .Ldt44_018c
.Ldt44_0148:
    ldr r9, [r4, #4]
    add sl, r0, r7
    add r7, r7, #1
    add sl, r2, sl, lsl #2
    add lr, r0, r7
    ldr fp, [r9, sl]
    add r1, r1, #2
    cmp r8, r1
    add fp, fp, #1
    str fp, [r9, sl]
    ldr r9, [r4, #4]
    add sl, r2, lr, lsl #2
    add r7, r7, #1
    ldr fp, [r9, sl]
    add fp, fp, #1
    str fp, [r9, sl]
    bhi .Ldt44_0148
.Ldt44_018c:
    ldr r0, [r4, #8]
    cmp r0, #65536
    blo .Ldt44_0220
    ldr r0, [r4]
    ldr r1, [r0]
    cmp r1, #1
    lsrhi r1, r1, #1
    strhi r1, [r0]
    ldr r2, [r4, #4]
    mov r1, #0
    cmp ip, #1
    mov r0, #1
    str r1, [r2]
    ldr r1, [r4]
    mvnhi r7, #3
    ldr r1, [r1]
    str r1, [r4, #8]
    bls .Ldt44_0220
.Ldt44_01d4:
    ldr r2, [r4]
    ldr r1, [r2, r0, lsl #2]
    cmp r1, #1
    lsrhi r1, r1, #1
    strhi r1, [r2, r0, lsl #2]
    ldm r4, {r2, r8}
    add r1, r7, r0, lsl #2
    ldr r9, [r8, r1]
    ldr r1, [r2, r1]
    add r1, r1, r9
    str r1, [r8, r0, lsl #2]
    ldr r2, [r4]
    ldr r1, [r4, #8]
    ldr r2, [r2, r0, lsl #2]
    add r0, r0, #1
    cmp r0, ip
    add r1, r1, r2
    str r1, [r4, #8]
    blo .Ldt44_01d4
.Ldt44_0220:
    ldr r0, [r5, #4]
    cmp r0, #16777216
    ldrlo r0, [r5, #8]
    bhs .Ldt44_0268
.Ldt44_0230:
    ldr r1, [r5, #4]
    ldr ip, [r5]
    lsl r0, r0, #8
    str r0, [r5, #8]
    ldrb r2, [r6, r3]
    lsl r1, r1, #8
    str r1, [r5, #4]
    add r0, r0, r2
    lsl ip, ip, #8
    str r0, [r5, #8]
    cmp r1, #16777216
    add r3, r3, #1
    str ip, [r5]
    blo .Ldt44_0230
.Ldt44_0268:
    ldr r0, [sp, #16]
    str r3, [r0]
    ldr r0, [sp]
    add sp, sp, #20
    pop {r4, r5, r6, r7, r8, r9, sl, fp, pc}
```

## Probe result

GNU Arm Embedded 15.2 assembled the schedule above as a 636-byte ARM body
with exactly two `R_ARM_CALL` relocations at +56 and +72, both naming
`func_0015EC10`. With those link-set fields normalized, the probe matched both
complete target bodies. The two target bodies also matched each other under
the same normalization. The probe confirmed 159 instructions, the eleven
ordered local branch destinations, and the absence of literal-pool or trailing
data slots.
