# Probe-verified duplicate ARM templates 33

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, symbolic complete-body grouping, bounded target disassembly and
  control/data-flow inspection, direct-call target resolution, and an
  independent GNU Arm mnemonic probe.
- Probe toolchain: GNU Arm assembler, objdump, objcopy, and readelf
  2.45.1.20251203 from GCC Arm Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, extracted assets, private absolute
  addresses, implementation source, private data values, or proprietary
  source.

Every function already exact in the current report and every function named
by a tracked configuration or specification was excluded before grouping.
That exclusion explicitly includes duplicate batch 32, IPC batch 30, runtime
batch 32, and all of their named callees/data identities. None of the nine
functions below occurs in any earlier config/spec, and all nine remain
unmatched in the current report. They are the highest-yield remaining
complete-body ARM template family: nine 892-byte bodies, totaling 8,028
executable bytes.

## Pooled intrusive colored-tree insertion

These ARM-state functions share one complete 223-instruction schedule after
the two direct calls in each body are represented by their common symbolic
identity:

- `func_0015E4C4`
- `func_0017DAEC`
- `func_0017DE68`
- `func_005622E0`
- `func_0056348C`
- `func_00563FA0`
- `func_00564AB4`
- `func_005654C8`
- `func_00565FDC`

Each function receives a writable result slot in `r0`, a pooled tree/container
record in `r1`, an insertion-selection value in `r2`, a parent/sentinel node
in `r3`, and a pointer to an eight-byte payload as the first stacked argument.
Nodes have a one-byte state at offset 0; parent, left, and right links at
offsets 4, 8, and 12; and the copied payload at offset 16. The container has
an allocation-block chain at offset 0, a recycled-node chain at offset 4,
bump/end pointers at offsets 8 and 12, a sentinel/header pointer at offset 16,
and a node count at offset 20.

The function first takes a node from the recycled-node chain. If that chain is
empty and the current allocation block has room, it advances the bump pointer
by 24 bytes. Otherwise it grows the pool, using an initial capacity of 32 and
then the larger of the prior capacity plus 32 and the observed arithmetic
growth schedule. It allocates a 12-byte block header and a separate
`capacity * 24` node region, links the new block, and initializes the new bump
and end pointers. It clears the node's state and three links, copies the
eight-byte payload, increments the node count, attaches the node on the
selected side, updates cached sentinel links when required, repairs the
one-byte colored-tree invariant through recoloring and rotations, forces the
root state to one, writes the inserted node through the result slot, and
leaves the current root node in `r0` at return.

The exact instruction and register schedule, rather than this semantic
summary, is the implementation contract.

## Call, data, equality, and relative ledgers

There are no PC-relative loads, literal-pool slots, adjacent data objects,
data relocations, embedded tables, external non-call branches, or private
scalar identities. All 20 direct branch targets other than the two calls are
body-local CFG labels.

Each body makes two ARM-state link-setting calls to the same already named
symbolic code identity, `func_00184990`. This identity is called
`duplicate_template_33_node_allocator` in the schedule. The first call is at
body offset +116 after placing 12 in `r0`; the second is at body offset +132
after placing the computed node-region byte count in `r0`. Thus:

| Ordered call | Body offset | Symbolic identity | Equality/relative contract |
| --- | ---: | --- | --- |
| block-header allocation | +116 | `func_00184990` | same identity in all nine bodies |
| node-region allocation | +132 | `func_00184990` | same identity as the first call; site is +16 bytes later |

The two calls give one equality class with 18 occurrences. Because both sites
target the same code identity, the second site's architectural branch
displacement is exactly 16 bytes more negative than the first site's
displacement within every body. Across the nine bodies, function placement
changes the encoded displacement but not the identity, call order, site
offsets, or within-body relative relationship. Implementations must use two
symbolic `bl` relocations rather than preserve or infer any numeric target.

The complete ordered local-label ledger is:

```text
+112, +176, +216, +260, +292, +308, +328, +344, +384, +468,
+476, +576, +588, +620, +640, +724, +732, +832, +840, +872
```

These correspond respectively to the labels named `_0070`, `_00b0`, `_00d8`,
`_0104`, `_0124`, `_0134`, `_0148`, `_0158`, `_0180`, `_01d4`, `_01dc`,
`_0240`, `_024c`, `_026c`, `_0280`, `_02d4`, `_02dc`, `_0340`, `_0348`, and
`_0368` below. All labels must be uniquely scoped per template expansion.

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
    bne .Ldt33_00b0
    ldr r0, [r4, #12]
    ldr r2, [r4, #8]
    cmp r2, r0
    addne r0, r2, #24
    strne r0, [r4, #8]
    bne .Ldt33_00b0
    ldr r0, [r4]
    cmp r0, #0
    moveq r6, #32
    beq .Ldt33_0070
    ldr r0, [r0, #4]
    add r1, r0, r0, lsr #1
    add r6, r1, r0, lsr #3
    add r0, r0, #32
    cmp r0, r6
    movhi r6, r0
.Ldt33_0070:
    mov r0, #12
    bl duplicate_template_33_node_allocator
    mov r7, r0
    add r0, r6, r6, lsl #1
    lsl r0, r0, #3
    bl duplicate_template_33_node_allocator
    str r0, [r7, #8]
    ldr r0, [r4]
    add r1, r6, r6, lsl #1
    stm r7, {r0, r6}
    str r7, [r4]
    ldr r2, [r7, #8]
    add r0, r2, r1, lsl #3
    str r0, [r4, #12]
    add r0, r2, #24
    str r0, [r4, #8]
.Ldt33_00b0:
    str fp, [r2, #4]
    str fp, [r2, #8]
    str fp, [r2, #12]
    adds r0, r2, #16
    strb fp, [r2]
    beq .Ldt33_00d8
    ldr r1, [r8]
    str r1, [r0]
    ldr r1, [r8, #4]
    str r1, [r0, #4]
.Ldt33_00d8:
    ldrd r0, [r4, #16]
    add r1, r1, #1
    cmp r0, r5
    str r1, [r4, #20]
    beq .Ldt33_0104
    cmp sl, #0
    bne .Ldt33_0104
    ldr r0, [r8]
    ldr r1, [r5, #16]
    cmp r1, r0
    bls .Ldt33_0134
.Ldt33_0104:
    str r2, [r5, #8]
    ldr r0, [r4, #16]
    cmp r0, r5
    bne .Ldt33_0124
    str r2, [r0, #4]
    ldr r0, [r4, #16]
    str r2, [r0, #12]
    b .Ldt33_0148
.Ldt33_0124:
    ldr r1, [r0, #8]
    cmp r1, r5
    streq r2, [r0, #8]
    b .Ldt33_0148
.Ldt33_0134:
    str r2, [r5, #12]
    ldr r0, [r4, #16]
    ldr r1, [r0, #12]
    cmp r1, r5
    streq r2, [r0, #12]
.Ldt33_0148:
    mov r0, r2
    mov ip, #1
    str r5, [r2, #4]
    b .Ldt33_0348
.Ldt33_0158:
    ldr r5, [r1, #4]
    ldr r3, [r5, #8]
    cmp r1, r3
    bne .Ldt33_026c
    ldr r3, [r5, #12]
    cmp r3, #0
    beq .Ldt33_0180
    ldrb lr, [r3]
    cmp lr, #0
    beq .Ldt33_024c
.Ldt33_0180:
    ldr r3, [r1, #12]
    cmp r3, r0
    bne .Ldt33_01dc
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
    beq .Ldt33_01d4
    ldr r1, [r0, #4]
    ldr r5, [r1, #8]
    cmp r5, r0
    streq r3, [r1, #8]
    strne r3, [r1, #12]
.Ldt33_01d4:
    str r0, [r3, #8]
    str r3, [r0, #4]
.Ldt33_01dc:
    ldr r1, [r0, #4]
    strb ip, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r1, [r0, #4]
    ldr r3, [r1, #4]
    ldr r1, [r3, #8]
    ldr lr, [r1, #12]
    str lr, [r3, #8]
    ldr lr, [r1, #12]
    cmp lr, #0
    strne r3, [lr, #4]
    ldr lr, [r3, #4]
    str lr, [r1, #4]
    ldr r5, [r4, #16]
    ldr lr, [r5, #4]
    cmp lr, r3
    streq r1, [r5, #4]
    beq .Ldt33_0240
    ldr r5, [r3, #4]
    ldr lr, [r5, #12]
    cmp lr, r3
    streq r1, [r5, #12]
    strne r1, [r5, #8]
.Ldt33_0240:
    str r3, [r1, #12]
    str r1, [r3, #4]
    b .Ldt33_0348
.Ldt33_024c:
    strb ip, [r1]
    strb ip, [r3]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r0, [r0, #4]
    ldr r0, [r0, #4]
    b .Ldt33_0348
.Ldt33_026c:
    cmp r3, #0
    beq .Ldt33_0280
    ldrb lr, [r3]
    cmp lr, #0
    beq .Ldt33_024c
.Ldt33_0280:
    ldr r3, [r1, #8]
    cmp r3, r0
    bne .Ldt33_02dc
    mov r0, r1
    ldr r1, [r3, #12]
    str r1, [r0, #8]
    ldr r1, [r3, #12]
    cmp r1, #0
    strne r0, [r1, #4]
    ldr r1, [r0, #4]
    str r1, [r3, #4]
    ldr r1, [r4, #16]
    ldr r5, [r1, #4]
    cmp r5, r0
    streq r3, [r1, #4]
    beq .Ldt33_02d4
    ldr r1, [r0, #4]
    ldr r5, [r1, #12]
    cmp r5, r0
    streq r3, [r1, #12]
    strne r3, [r1, #8]
.Ldt33_02d4:
    str r0, [r3, #12]
    str r3, [r0, #4]
.Ldt33_02dc:
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
    ldr r5, [r4, #16]
    ldr lr, [r5, #4]
    cmp lr, r1
    streq r3, [r5, #4]
    beq .Ldt33_0340
    ldr r5, [r1, #4]
    ldr lr, [r5, #8]
    cmp lr, r1
    streq r3, [r5, #8]
    strne r3, [r5, #12]
.Ldt33_0340:
    str r1, [r3, #8]
    str r3, [r1, #4]
.Ldt33_0348:
    ldr r1, [r4, #16]
    ldr r1, [r1, #4]
    cmp r1, r0
    beq .Ldt33_0368
    ldr r1, [r0, #4]
    ldrb r3, [r1]
    cmp r3, #0
    beq .Ldt33_0158
.Ldt33_0368:
    ldr r0, [r4, #16]
    ldr r0, [r0, #4]
    strb ip, [r0]
    str r2, [r9]
    pop {r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
```

## Independent exact-probe evidence

The schedule above was independently assembled in ARMv6K ARM state with the
two allocator sites left as `R_ARM_CALL` relocations. The probe produced
exactly 223 fixed-width instructions and an 892-byte body, with exactly two
relocations at ordered body offsets +116 and +132, both naming the same
undefined ARM code identity. There were no other relocations or emitted data
objects.

For each of the nine target bodies, the two call instructions were normalized
only by resolving those audited relocations to `func_00184990`; every other
instruction was compared directly. All 223 instructions and all 892 body
bytes then matched each target function exactly. Pairwise target comparison
also found that the two call instruction fields are the only physical body
differences among the nine functions. The final result is 9/9 exact bodies,
2,007/2,007 exact instructions, and 8,028/8,028 executable bytes.

Implementation must preserve ARM state, the full register schedule, the
stacked payload argument, both allocator calls and their shared identity,
pool-growth arithmetic, memory-access widths and order, conditional
instructions, unsigned comparison, all 20 local CFG targets, rotations and
recoloring, final result store, and the exact pop-based return.
