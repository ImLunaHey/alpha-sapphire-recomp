# Probe-verified duplicate ARM templates 35

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body symbolic duplicate grouping, bounded target
  disassembly and control/data-flow inspection, direct-call target resolution,
  and an independent GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, objdump, objcopy, and readelf 2.46.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, extracted assets, private absolute
  addresses, implementation source, private data values, or proprietary
  source.

Every function already exact in the current report and every function named
by a tracked configuration or specification was excluded before grouping.
That exclusion explicitly includes duplicate batch 34, IPC batch 31, runtime
batch 33, and all functions selected by those batches. The four functions
below occur in no earlier config/spec and remain unmatched in the current
report. They are the highest-yield remaining complete-body symbolic ARM
duplicate family: four 876-byte bodies, totaling 3,504 executable bytes.

## Pooled compact-payload colored-tree insertion

These ARM-state functions share one complete 219-instruction schedule after
the two direct calls in each body are represented by their common symbolic
identity:

- `func_0017D780`
- `func_0055A01C`
- `func_0055B31C`
- `func_0055BE30`

Each function receives a writable result slot in `r0`, a pooled tree/container
record in `r1`, an insertion-selection value in `r2`, a parent/sentinel node
in `r3`, and a pointer to a four-byte payload as the first stacked argument.
Nodes have a one-byte state at offset 0; parent, left, and right links at
offsets 4, 8, and 12; and the copied payload word at offset 16. The container
has an allocation-block chain at offset 0, a recycled-node chain at offset 4,
bump/end pointers at offsets 8 and 12, a sentinel/header pointer at offset 16,
and a node count at offset 20.

The function first takes a node from the recycled-node chain. If that chain is
empty and the current allocation block has room, it advances the bump pointer
by 20 bytes. Otherwise it grows the pool, using an initial capacity of 32 and
then the larger of the prior capacity plus 32 and the observed arithmetic
growth schedule. It allocates a 12-byte block header and a separate
`capacity * 20` node region, links the new block, and initializes the new bump
and end pointers. It clears the node state and links, copies the four-byte
payload, increments the node count, attaches the node on the selected side,
updates cached sentinel links when required, repairs the one-byte colored-tree
invariant through recoloring and rotations, forces the root state to one,
writes the inserted node through the result slot, and leaves the current root
node in `r0` at return.

The exact instruction and register schedule, rather than this semantic
summary, is the implementation contract.

## Call, data, equality, and relative ledgers

There are no PC-relative loads, literal-pool slots, adjacent data objects,
data relocations, embedded tables, external non-call branches, private scalar
identities, tail calls, BLX sites, veneers, or indirect calls. All twenty
direct branch targets other than the two calls are body-local CFG labels.

Each body makes two ARM-state link-setting calls to the same already specified
symbolic code identity, `func_00184990`. The first call is at body offset +116
after placing 12 in `r0`; the second is at body offset +132 after placing the
computed node-region byte count in `r0`.

| Ordered call | Body offset | Symbolic identity | Equality/relative contract |
| --- | ---: | --- | --- |
| block-header allocation | +116 | `func_00184990` | same identity in all four bodies |
| node-region allocation | +132 | `func_00184990` | same identity as the first call; site is +16 bytes later |

The two calls give one equality class with eight occurrences. Because both
sites target the same code identity, the second site's architectural branch
displacement is exactly 16 bytes more negative than the first site's
displacement within every body. Function placement changes the encoded
displacements across expansions but not the identity, call order, site
offsets, or within-body relative relationship. Implementations must use two
symbolic `bl` relocations rather than preserve or infer a numeric target.

The complete ordered local-label ledger is:

```text
+112, +176, +248, +280, +296, +316, +332, +372, +456, +464,
+564, +572, +604, +624, +708, +716, +816, +820, +824, +856
```

All labels must be uniquely scoped per template expansion.

## Complete exact body schedule

```asm
    push {r4, r5, r6, r7, r8, r9, sl, fp, ip, lr}
    mov r4, r1
    mov r5, r3
    mov sl, r2
    mov r9, r0
    ldr r2, [r1, #4]
    ldr r8, [sp, #40]
    mov fp, #0
    cmp r2, #0
    ldrne r0, [r2, #12]
    strne r0, [r4, #4]
    bne .Ldt35_00b0
    ldr r0, [r4, #12]
    ldr r2, [r4, #8]
    cmp r2, r0
    addne r0, r2, #20
    strne r0, [r4, #8]
    bne .Ldt35_00b0
    ldr r0, [r4]
    cmp r0, #0
    moveq r6, #32
    beq .Ldt35_0070
    ldr r0, [r0, #4]
    add r1, r0, r0, lsr #1
    add r6, r1, r0, lsr #3
    add r0, r0, #32
    cmp r0, r6
    movhi r6, r0
.Ldt35_0070:
    mov r0, #12
    bl func_00184990
    mov r7, r0
    add r0, r6, r6, lsl #2
    lsl r0, r0, #2
    bl func_00184990
    str r0, [r7, #8]
    ldr r0, [r4]
    add r1, r6, r6, lsl #2
    stm r7, {r0, r6}
    str r7, [r4]
    ldr r2, [r7, #8]
    add r0, r2, r1, lsl #2
    str r0, [r4, #12]
    add r0, r2, #20
    str r0, [r4, #8]
.Ldt35_00b0:
    str fp, [r2, #4]
    str fp, [r2, #8]
    str fp, [r2, #12]
    adds r0, r2, #16
    strb fp, [r2]
    ldrne r1, [r8]
    strne r1, [r0]
    ldrd r0, [r4, #16]
    add r1, r1, #1
    cmp r0, r5
    str r1, [r4, #20]
    beq .Ldt35_00f8
    cmp sl, #0
    bne .Ldt35_00f8
    ldr r0, [r8]
    ldr r1, [r5, #16]
    cmp r1, r0
    bls .Ldt35_0128
.Ldt35_00f8:
    str r2, [r5, #8]
    ldr r0, [r4, #16]
    cmp r0, r5
    bne .Ldt35_0118
    str r2, [r0, #4]
    ldr r0, [r4, #16]
    str r2, [r0, #12]
    b .Ldt35_013c
.Ldt35_0118:
    ldr r1, [r0, #8]
    cmp r1, r5
    streq r2, [r0, #8]
    b .Ldt35_013c
.Ldt35_0128:
    str r2, [r5, #12]
    ldr r0, [r4, #16]
    ldr r1, [r0, #12]
    cmp r1, r5
    streq r2, [r0, #12]
.Ldt35_013c:
    mov r0, r2
    mov ip, #1
    str r5, [r2, #4]
    b .Ldt35_0338
.Ldt35_014c:
    ldr lr, [r1, #4]
    ldr r3, [lr, #8]
    cmp r1, r3
    bne .Ldt35_025c
    ldr r3, [lr, #12]
    cmp r3, #0
    beq .Ldt35_0174
    ldrb lr, [r3]
    cmp lr, #0
    beq .Ldt35_023c
.Ldt35_0174:
    ldr r3, [r1, #12]
    cmp r3, r0
    bne .Ldt35_01d0
    mov r0, r1
    ldr r1, [r3, #8]
    str r1, [r0, #12]
    ldr r1, [r3, #8]
    cmp r1, #0
    strne r0, [r1, #4]
    ldr r1, [r0, #4]
    str r1, [r3, #4]
    ldr r1, [r4, #16]
    ldr r5, [r1, #4]
    cmp r5, r0
    streq r3, [r1, #4]
    beq .Ldt35_01c8
    ldr r1, [r0, #4]
    ldr r5, [r1, #8]
    cmp r5, r0
    streq r3, [r1, #8]
    strne r3, [r1, #12]
.Ldt35_01c8:
    str r0, [r3, #8]
    str r3, [r0, #4]
.Ldt35_01d0:
    ldr r1, [r0, #4]
    strb ip, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    ldr r3, [r1, #8]
    ldr lr, [r3, #12]
    str lr, [r1, #8]
    ldr lr, [r3, #12]
    cmp lr, #0
    strne r1, [lr, #4]
    ldr lr, [r1, #4]
    str lr, [r3, #4]
    ldr lr, [r4, #16]
    ldr r5, [lr, #4]
    cmp r5, r1
    streq r3, [lr, #4]
    beq .Ldt35_0234
    ldr lr, [r1, #4]
    ldr r5, [lr, #12]
    cmp r5, r1
    streq r3, [lr, #12]
    strne r3, [lr, #8]
.Ldt35_0234:
    str r1, [r3, #12]
    b .Ldt35_0334
.Ldt35_023c:
    strb ip, [r1]
    strb ip, [r3]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r0, [r0, #4]
    ldr r0, [r0, #4]
    b .Ldt35_0338
.Ldt35_025c:
    cmp r3, #0
    beq .Ldt35_0270
    ldrb lr, [r3]
    cmp lr, #0
    beq .Ldt35_023c
.Ldt35_0270:
    ldr r3, [r1, #8]
    cmp r3, r0
    bne .Ldt35_02cc
    mov r0, r1
    ldr r1, [r3, #12]
    str r1, [r0, #8]
    ldr r1, [r3, #12]
    cmp r1, #0
    strne r0, [r1, #4]
    ldr r1, [r0, #4]
    str r1, [r3, #4]
    ldr r1, [r4, #16]
    ldr lr, [r1, #4]
    cmp lr, r0
    streq r3, [r1, #4]
    beq .Ldt35_02c4
    ldr r1, [r0, #4]
    ldr r5, [r1, #12]
    cmp r5, r0
    streq r3, [r1, #12]
    strne r3, [r1, #8]
.Ldt35_02c4:
    str r0, [r3, #12]
    str r3, [r0, #4]
.Ldt35_02cc:
    ldr r1, [r0, #4]
    strb ip, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    ldr r3, [r1, #12]
    ldr lr, [r3, #8]
    str lr, [r1, #12]
    ldr lr, [r3, #8]
    cmp lr, #0
    strne r1, [lr, #4]
    ldr lr, [r1, #4]
    str lr, [r3, #4]
    ldr lr, [r4, #16]
    ldr r5, [lr, #4]
    cmp r5, r1
    streq r3, [lr, #4]
    beq .Ldt35_0330
    ldr lr, [r1, #4]
    ldr r5, [lr, #8]
    cmp r5, r1
    streq r3, [lr, #8]
    strne r3, [lr, #12]
.Ldt35_0330:
    str r1, [r3, #8]
.Ldt35_0334:
    str r3, [r1, #4]
.Ldt35_0338:
    ldr r1, [r4, #16]
    ldr r1, [r1, #4]
    cmp r1, r0
    beq .Ldt35_0358
    ldr r1, [r0, #4]
    ldrb r3, [r1]
    cmp r3, #0
    beq .Ldt35_014c
.Ldt35_0358:
    ldr r0, [r4, #16]
    ldr r0, [r0, #4]
    strb ip, [r0]
    str r2, [r9]
    pop {r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
```

## Independent exact-probe evidence

The schedule above was independently assembled in ARMv6K ARM state with the
two allocator sites left as `R_ARM_CALL` relocations. The probe produced
exactly 219 fixed-width instructions and an 876-byte body, with exactly two
relocations at ordered body offsets +116 and +132, both naming the same
undefined ARM code identity. There were no other relocations or emitted data
objects.

For each of the four target bodies, the two call instructions were normalized
only by resolving those audited relocations to `func_00184990`; every other
instruction was compared directly. All 219 instructions and all 876 body
bytes then matched each target function exactly. Pairwise target comparison
also found that the two call instruction fields are the only physical body
differences among the four functions. The final result is 4/4 exact bodies,
876/876 exact instructions, and 3,504/3,504 executable bytes.

Implementation must preserve ARM state, the full register schedule, the
stacked payload argument, both allocator calls and their shared identity,
pool-growth arithmetic, memory-access widths and order, conditional
instructions, unsigned comparisons, all twenty local CFG targets, rotations
and recoloring, final result store, and the exact pop-based return.
