# Probe-verified duplicate ARM templates 37

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body symbolic duplicate grouping, bounded target
  disassembly and control/data-flow inspection, direct-call target resolution,
  and an independent GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, objdump, objcopy, and readelf
  2.45.1.20251203.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, extracted assets, private absolute
  addresses, implementation source, private data values, or proprietary
  source.

Every function already exact in the current report and every function named
by a tracked configuration or specification was excluded before grouping. The
provisional IPC batch 33 and runtime batch 36 selections were also excluded
and are disjoint from this batch. The three functions below are the
highest-yield remaining complete-body symbolic ARM duplicate group: three
892-byte bodies, totaling 2,676 executable bytes.

## Pooled word-pair colored-tree insertion

These ARM-state functions share one complete 223-instruction schedule after
the two direct calls in each body are represented by their common symbolic
identity:

- `func_00557CAC`
- `func_00558928`
- `func_00559478`

Each function receives a writable result slot in `r0`, a pooled tree/container
record in `r1`, an insertion-side selection value in `r2`, a parent or sentinel
node in `r3`, and a pointer to a two-word payload as the first stacked
argument. Nodes have a one-byte state at offset 0; parent, left, and right links
at offsets 4, 8, and 12; and copied payload words at offsets 16 and 20. The
unsigned word at offset 16 supplies the ordering key. The container has an
allocation-block chain at offset 0, a recycled-node chain at offset 4,
bump/end pointers at offsets 8 and 12, a sentinel/header pointer at offset 16,
and a node count at offset 20.

The function first takes a node from the recycled-node chain. If that chain is
empty and the current allocation block has room, it advances the bump pointer
by 24 bytes. Otherwise it grows the pool, using an initial capacity of 32 and
then the larger of the prior capacity plus 32 and the observed arithmetic
growth schedule. It allocates a 12-byte block header and a separate
`capacity * 24` node region, links the new block, and initializes the new bump
and end pointers. It clears the node state and links, copies the two payload
words, increments the node count, attaches the node on the selected side,
updates cached sentinel links when required, repairs the one-byte colored-tree
invariant through recoloring and rotations, forces the root state to one,
writes the inserted node through the result slot, and leaves the current root
node in `r0` at return.

The exact instruction and register schedule, rather than this semantic
summary, is the implementation contract.

## Call, data, equality, and relative ledgers

There are no PC-relative loads, literal-pool slots, adjacent data objects,
data relocations, embedded tables, external non-call branches, private scalar
identities, tail calls, BLX sites, veneers, or indirect calls. All 26 direct
branch instructions other than the two calls target body-local CFG labels.

Each body makes two ARM-state link-setting calls to the same already specified
symbolic code identity, `func_00184990`:

| Ordered call | Body offset | Relocation | Symbolic identity |
| --- | ---: | --- | --- |
| block-header allocation | +116 | `R_ARM_CALL` | `func_00184990` |
| node-region allocation | +132 | `R_ARM_CALL` | `func_00184990` |

The calls form one equality class with six occurrences. Since both sites
target the same code identity, the second site's architectural branch
displacement is exactly 16 bytes more negative than the first site's
displacement within every body. Function placement changes the encoded
displacements across expansions but not the identity, order, site offsets, or
within-body relative relationship. Implementations must use two symbolic `bl`
relocations rather than preserve or infer a numeric target.

After those two call fields are normalized by symbolic target, all three
complete 892-byte bodies are equal. No other field requires normalization.
The complete ordered local-label ledger is:

```text
+112, +176, +216, +264, +296, +312, +332, +348, +388, +472,
+480, +580, +588, +620, +640, +724, +732, +832, +836, +840,
+872
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
    bne .Ldt37_0b0
    ldr r0, [r4, #12]
    ldr r2, [r4, #8]
    cmp r2, r0
    addne r0, r2, #24
    strne r0, [r4, #8]
    bne .Ldt37_0b0
    ldr r0, [r4]
    cmp r0, #0
    moveq r6, #32
    beq .Ldt37_070
    ldr r0, [r0, #4]
    add r1, r0, r0, lsr #1
    add r6, r1, r0, lsr #3
    add r0, r0, #32
    cmp r0, r6
    movhi r6, r0
.Ldt37_070:
    mov r0, #12
    bl func_00184990
    mov r7, r0
    add r0, r6, r6, lsl #1
    lsl r0, r0, #3
    bl func_00184990
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
.Ldt37_0b0:
    str fp, [r2, #4]
    str fp, [r2, #8]
    str fp, [r2, #12]
    adds r0, r2, #16
    strb fp, [r2]
    beq .Ldt37_0d8
    ldr r1, [r8]
    str r1, [r0]
    ldr r1, [r8, #4]
    str r1, [r0, #4]
.Ldt37_0d8:
    ldr r0, [r4, #20]
    ldr r1, [r4, #16]
    add r0, r0, #1
    cmp r1, r5
    str r0, [r4, #20]
    beq .Ldt37_0108
    cmp sl, #0
    bne .Ldt37_0108
    ldr r0, [r8]
    ldr r1, [r5, #16]
    cmp r1, r0
    bls .Ldt37_0138
.Ldt37_0108:
    str r2, [r5, #8]
    ldr r0, [r4, #16]
    cmp r0, r5
    bne .Ldt37_0128
    str r2, [r0, #4]
    ldr r0, [r4, #16]
    str r2, [r0, #12]
    b .Ldt37_014c
.Ldt37_0128:
    ldr r1, [r0, #8]
    cmp r1, r5
    streq r2, [r0, #8]
    b .Ldt37_014c
.Ldt37_0138:
    str r2, [r5, #12]
    ldr r0, [r4, #16]
    ldr r1, [r0, #12]
    cmp r1, r5
    streq r2, [r0, #12]
.Ldt37_014c:
    mov r0, r2
    mov ip, #1
    str r5, [r2, #4]
    b .Ldt37_0348
.Ldt37_015c:
    ldr r5, [r1, #4]
    ldr r3, [r5, #8]
    cmp r1, r3
    bne .Ldt37_026c
    ldr r3, [r5, #12]
    cmp r3, #0
    beq .Ldt37_0184
    ldrb lr, [r3]
    cmp lr, #0
    beq .Ldt37_024c
.Ldt37_0184:
    ldr r3, [r1, #12]
    cmp r3, r0
    bne .Ldt37_01e0
    mov r0, r1
    ldr r1, [r3, #8]
    str r1, [r0, #12]
    ldr r1, [r3, #8]
    cmp r1, #0
    strne r0, [r1, #4]
    ldr r1, [r0, #4]
    str r1, [r3, #4]
    ldr r5, [r4, #16]
    ldr lr, [r5, #4]
    cmp lr, r0
    streq r3, [r5, #4]
    beq .Ldt37_01d8
    ldr r1, [r0, #4]
    ldr r5, [r1, #8]
    cmp r5, r0
    streq r3, [r1, #8]
    strne r3, [r1, #12]
.Ldt37_01d8:
    str r0, [r3, #8]
    str r3, [r0, #4]
.Ldt37_01e0:
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
    ldr r5, [r4, #16]
    ldr lr, [r5, #4]
    cmp lr, r1
    streq r3, [r5, #4]
    beq .Ldt37_0244
    ldr r5, [r1, #4]
    ldr lr, [r5, #12]
    cmp lr, r1
    streq r3, [r5, #12]
    strne r3, [r5, #8]
.Ldt37_0244:
    str r1, [r3, #12]
    b .Ldt37_0344
.Ldt37_024c:
    strb ip, [r1]
    strb ip, [r3]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r0, [r0, #4]
    ldr r0, [r0, #4]
    b .Ldt37_0348
.Ldt37_026c:
    cmp r3, #0
    beq .Ldt37_0280
    ldrb lr, [r3]
    cmp lr, #0
    beq .Ldt37_024c
.Ldt37_0280:
    ldr r3, [r1, #8]
    cmp r3, r0
    bne .Ldt37_02dc
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
    beq .Ldt37_02d4
    ldr r1, [r0, #4]
    ldr r5, [r1, #12]
    cmp r5, r0
    streq r3, [r1, #12]
    strne r3, [r1, #8]
.Ldt37_02d4:
    str r0, [r3, #12]
    str r3, [r0, #4]
.Ldt37_02dc:
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
    beq .Ldt37_0340
    ldr r5, [r1, #4]
    ldr lr, [r5, #8]
    cmp lr, r1
    streq r3, [r5, #8]
    strne r3, [r5, #12]
.Ldt37_0340:
    str r1, [r3, #8]
.Ldt37_0344:
    str r3, [r1, #4]
.Ldt37_0348:
    ldr r1, [r4, #16]
    ldr r1, [r1, #4]
    cmp r1, r0
    beq .Ldt37_0368
    ldr r1, [r0, #4]
    ldrb r3, [r1]
    cmp r3, #0
    beq .Ldt37_015c
.Ldt37_0368:
    ldr r0, [r4, #16]
    ldr r0, [r0, #4]
    strb ip, [r0]
    str r2, [r9]
    pop {r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
```

## Independent exact probe

The complete schedule above was assembled independently in unified ARM mode
for one expansion and compared with all three target bodies. The probe
established all of the following:

- the executable body is exactly 892 bytes and 223 ARM instructions;
- the object contains exactly two REL relocations;
- both are `R_ARM_CALL`, at body offsets 116 and 132;
- both relocations reference `func_00184990`;
- after normalizing only those two call fields, the probe body equals every
  target body completely;
- the three normalized target bodies are mutually equal;
- the schedule has 21 distinct macro-local labels and only the two listed
  `bl` instructions; and
- no raw instruction/data directives or embedded data objects are required.

The implementation validator should enforce the same section size,
instruction count, function order, call relocation ledger, macro-local label
count, normalized complete-body equality, and aggregate body-byte total.
