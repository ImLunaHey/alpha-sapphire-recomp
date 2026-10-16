# Probe-verified duplicate ARM templates 40

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body symbolic duplicate grouping, bounded target
  disassembly and control/data-flow inspection, direct-call target resolution,
  post-body literal analysis, and an independent GNU Arm exact-schedule probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, extracted assets, private absolute
  addresses, private data values, implementation source, or proprietary
  source.

Every function already exact in the current report and every function named
by a tracked configuration or specification was excluded before grouping.
The concurrently selected runtime batch 40 functions were also excluded and
are disjoint from this batch. The two functions below are the highest-yield
remaining complete-body symbolic ARM duplicate group: two 944-byte bodies,
totaling 1,888 executable bytes.

## Pooled red-black-tree node insertion

These ARM-state functions share one complete 236-instruction schedule after
the two direct calls are represented by their symbolic code identity:

```text
func_005522B8  func_00552D08
```

The function receives an output pointer in `r0`, a tree/container in `r1`, an
insertion-selection flag in `r2`, a neighboring node in `r3`, and a fifth
argument on the stack describing the inserted payload. It obtains a 28-byte
node from the container's pooled blocks, growing the pool when necessary.
The new node's links and color byte are initialized, and its embedded payload
at offset 16 receives the shared dispatch identity plus the halfword and word
fields from the fifth argument. The container count at offset 20 is
incremented, the node is linked on the selected side of the neighboring node,
and the standard mirrored red-black insertion repair rotates and recolors the
tree until the root is black. The created node is written through the entry
`r0` output pointer.

The exact instruction and register schedule, rather than this semantic
summary, is the implementation contract.

## Call, literal, equality, and relative ledgers

Each body makes two ARM-state link-setting calls:

| Body offset | Relocation | Symbolic identity | Semantic role |
| ---: | --- | --- | --- |
| +116 | `R_ARM_CALL` | `func_00184990` | allocate a 12-byte pool descriptor |
| +132 | `R_ARM_CALL` | `func_00184990` | allocate storage for the node block |

Both call sites form one four-occurrence call equality class across the two
expansions. There are no indirect calls or external non-call branches.

One word-sized literal slot immediately follows each body:

| Pool offset | Load site | Relocation | Semantic identity |
| ---: | ---: | --- | --- |
| +944 | +200 | `R_ARM_ABS32` | shared embedded-payload dispatch identity |

Both literal occurrences are equal and form one two-occurrence equality
class named
`arm_duplicate_templates_40_shared_node_payload_dispatch_identity`.
There are no other post-body words or alignment bytes.

After the two direct-call fields are normalized by symbolic target, the two
complete 944-byte bodies are equal. No other body field requires
normalization. The complete ordered local-label ledger is:

```text
+112, +176, +224, +280, +312, +328, +348, +364, +404, +488, +496,
+596, +608, +640, +660, +744, +752, +852, +860, +892, +912
```

All labels must be uniquely scoped per template expansion.

## Complete exact body schedule

The angle-bracketed operand names the post-body semantic literal slot from
the ledger above; it is not a numeric value or raw encoding.

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
    bne .Ldt40_00b0
    ldr r0, [r4, #12]
    ldr r2, [r4, #8]
    cmp r2, r0
    addne r0, r2, #28
    strne r0, [r4, #8]
    bne .Ldt40_00b0
    ldr r0, [r4]
    cmp r0, #0
    moveq r6, #32
    beq .Ldt40_0070
    ldr r0, [r0, #4]
    add r1, r0, r0, lsr #1
    add r6, r1, r0, lsr #3
    add r0, r0, #32
    cmp r0, r6
    movhi r6, r0
.Ldt40_0070:
    mov r0, #12
    bl func_00184990
    mov r7, r0
    rsb r0, r6, r6, lsl #3
    lsl r0, r0, #2
    bl func_00184990
    str r0, [r7, #8]
    ldr r1, [r4]
    rsb r0, r6, r6, lsl #3
    stm r7, {r1, r6}
    str r7, [r4]
    ldr r2, [r7, #8]
    add r0, r2, r0, lsl #2
    str r0, [r4, #12]
    add r0, r2, #28
    str r0, [r4, #8]
.Ldt40_00b0:
    str fp, [r2, #4]
    str fp, [r2, #8]
    str fp, [r2, #12]
    adds r0, r2, #16
    strb fp, [r2]
    beq .Ldt40_00e0
    ldr r1, <shared_node_payload_dispatch_identity>
    str r1, [r0]
    ldrh r1, [r8, #4]
    strh r1, [r0, #4]
    ldr r1, [r8, #8]
    str r1, [r0, #8]
.Ldt40_00e0:
    ldr r0, [r4, #20]
    ldr r1, [r4, #16]
    add r0, r0, #1
    cmp r1, r5
    str r0, [r4, #20]
    beq .Ldt40_0118
    cmp sl, #0
    bne .Ldt40_0118
    ldrh r0, [r5, #20]
    ldrh r1, [r8, #4]
    sub r0, r0, r1
    sxth r0, r0
    cmp r0, #0
    ble .Ldt40_0148
.Ldt40_0118:
    str r2, [r5, #8]
    ldr r0, [r4, #16]
    cmp r0, r5
    bne .Ldt40_0138
    str r2, [r0, #4]
    ldr r0, [r4, #16]
    str r2, [r0, #12]
    b .Ldt40_015c
.Ldt40_0138:
    ldr r1, [r0, #8]
    cmp r1, r5
    streq r2, [r0, #8]
    b .Ldt40_015c
.Ldt40_0148:
    str r2, [r5, #12]
    ldr r0, [r4, #16]
    ldr r1, [r0, #12]
    cmp r1, r5
    streq r2, [r0, #12]
.Ldt40_015c:
    mov r0, r2
    mov ip, #1
    str r5, [r2, #4]
    b .Ldt40_035c
.Ldt40_016c:
    ldr r3, [r1, #4]
    ldr r5, [r3, #8]
    cmp r1, r5
    bne .Ldt40_0280
    ldr r3, [r3, #12]
    cmp r3, #0
    beq .Ldt40_0194
    ldrb lr, [r3]
    cmp lr, #0
    beq .Ldt40_0260
.Ldt40_0194:
    ldr r3, [r1, #12]
    cmp r3, r0
    bne .Ldt40_01f0
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
    beq .Ldt40_01e8
    ldr r1, [r0, #4]
    ldr r5, [r1, #8]
    cmp r5, r0
    streq r3, [r1, #8]
    strne r3, [r1, #12]
.Ldt40_01e8:
    str r0, [r3, #8]
    str r3, [r0, #4]
.Ldt40_01f0:
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
    beq .Ldt40_0254
    ldr r5, [r3, #4]
    ldr lr, [r5, #12]
    cmp lr, r3
    streq r1, [r5, #12]
    strne r1, [r5, #8]
.Ldt40_0254:
    str r3, [r1, #12]
    str r1, [r3, #4]
    b .Ldt40_035c
.Ldt40_0260:
    strb ip, [r1]
    strb ip, [r3]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r0, [r0, #4]
    ldr r0, [r0, #4]
    b .Ldt40_035c
.Ldt40_0280:
    cmp r5, #0
    beq .Ldt40_0294
    ldrb r3, [r5]
    cmp r3, #0
    beq .Ldt40_0390
.Ldt40_0294:
    ldr r3, [r1, #8]
    cmp r3, r0
    bne .Ldt40_02f0
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
    beq .Ldt40_02e8
    ldr r1, [r0, #4]
    ldr r5, [r1, #12]
    cmp r5, r0
    streq r3, [r1, #12]
    strne r3, [r1, #8]
.Ldt40_02e8:
    str r0, [r3, #12]
    str r3, [r0, #4]
.Ldt40_02f0:
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
    beq .Ldt40_0354
    ldr r5, [r1, #4]
    ldr lr, [r5, #8]
    cmp lr, r1
    streq r3, [r5, #8]
    strne r3, [r5, #12]
.Ldt40_0354:
    str r1, [r3, #8]
    str r3, [r1, #4]
.Ldt40_035c:
    ldr r1, [r4, #16]
    ldr r1, [r1, #4]
    cmp r1, r0
    beq .Ldt40_037c
    ldr r1, [r0, #4]
    ldrb r3, [r1]
    cmp r3, #0
    beq .Ldt40_016c
.Ldt40_037c:
    ldr r0, [r4, #16]
    ldr r0, [r0, #4]
    strb ip, [r0]
    str r2, [r9]
    pop {r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
.Ldt40_0390:
    strb ip, [r1]
    strb ip, [r5]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r0, [r0, #4]
    ldr r0, [r0, #4]
    b .Ldt40_035c
```

Immediately after the 944-byte body, emit the symbolic dispatch-identity word.
No alignment padding occurs between body and pool.

## Probe result

A neutral GNU Arm probe expanded the schedule for both function names, using
an undefined symbol for the shared data identity and the shared external call
identity. It established all of the following:

- ARM mode and four-byte alignment for both expansions;
- 944 body bytes and 236 instructions per expansion;
- `R_ARM_CALL` relocations at +116 and +132, both targeting
  `func_00184990`;
- the literal load at +200 reaching the symbolic word at +944;
- 21 uniquely scoped local labels at the exact ordered offsets above;
- byte equality of every non-call body field against both bounded target
  bodies and equality of the target bodies after symbolic normalization of
  the two call fields; and
- exactly two `R_ARM_ABS32` pool relocations in one equality class.

## Coverage and implementation constraints

The current objdiff report identifies both bodies as unmatched. A full
repository configuration/specification scan excludes every prior tracked
batch, and the selected functions do not overlap the concurrent runtime batch
40 selection.

Implementation must preserve the exact schedule, register choices, condition
codes, label offsets, symbolic call targets, pool order, literal-use
displacement, and shared data equality class. It must not encode private data
values or replace symbolic relocations with numeric addresses.
