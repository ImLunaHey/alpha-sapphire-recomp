# Probe-verified duplicate ARM templates 42

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
The concurrently selected runtime batch 42 functions were also excluded and
are disjoint from this batch. The two functions below are the highest-yield
remaining complete-body ARM duplicate group after direct calls are represented
symbolically: two 920-byte bodies, totaling 1,840 executable bytes.

## Pooled unsigned-64-key red-black-tree node insertion

These ARM-state functions share one complete 230-instruction schedule:

```text
func_0016F5B4  func_005538C8
```

The function receives an output pointer in `r0`, a tree/container in `r1`, an
insertion-selection flag in `r2`, a neighboring node in `r3`, and a fifth
argument on the stack describing the inserted payload. It obtains a 32-byte
node from the container's pooled blocks, growing the pool when necessary.
The new node's links and color byte are initialized, and the three-word
payload supplied by the fifth argument is copied to offset 16. The container
count at offset 20 is incremented. When selection is required, the first two
payload words form an unsigned 64-bit key used to choose the insertion side.
The node is linked beside the neighboring node, and the standard mirrored
red-black insertion repair rotates and recolors the tree until the root is
black. The created node is written through the entry `r0` output pointer.

The exact instruction and register schedule, rather than this semantic
summary, is the implementation contract.

## Call, equality, and relative ledgers

Each body makes two ARM-state link-setting calls:

| Body offset | Relocation | Symbolic identity | Semantic role |
| ---: | --- | --- | --- |
| +116 | `R_ARM_CALL` | `func_00184990` | allocate a 12-byte pool descriptor |
| +128 | `R_ARM_CALL` | `func_00184990` | allocate storage for the node block |

Both call sites form one four-occurrence call equality class across the two
expansions. There are no indirect calls, external non-call branches, literal
loads, post-body pool words, embedded tables, or alignment bytes.

In the authoritative target object, `func_00184990` is a global function
defined in its own executable section in that same object. Each of the four
sites nevertheless has an `R_ARM_CALL` relocation whose symbol identity is
`func_00184990`. Defined target-object visibility and retention of the call
relocation are therefore simultaneous requirements; the callee must not be
classified as undefined when validating the authoritative target object.

After the two direct-call fields are normalized by symbolic target, the two
complete 920-byte bodies are equal. No other body field requires
normalization. The complete ordered local-label ledger is:

```text
+112, +168, +208, +260, +292, +308, +328, +344, +384, +468, +476,
+576, +584, +616, +636, +720, +728, +828, +832, +836, +868, +888
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
    bne .Ldt42_00a8
    ldr r0, [r4, #12]
    ldr r2, [r4, #8]
    cmp r2, r0
    addne r0, r2, #32
    strne r0, [r4, #8]
    bne .Ldt42_00a8
    ldr r0, [r4]
    cmp r0, #0
    moveq r6, #32
    beq .Ldt42_0070
    ldr r0, [r0, #4]
    add r1, r0, r0, lsr #1
    add r6, r1, r0, lsr #3
    add r0, r0, #32
    cmp r0, r6
    movhi r6, r0
.Ldt42_0070:
    mov r0, #12
    bl func_00184990
    mov r7, r0
    lsl r0, r6, #5
    bl func_00184990
    str r0, [r7, #8]
    ldr r0, [r4]
    stm r7, {r0, r6}
    str r7, [r4]
    ldr r2, [r7, #8]
    add r0, r2, r6, lsl #5
    str r0, [r4, #12]
    add r0, r2, #32
    str r0, [r4, #8]
.Ldt42_00a8:
    str fp, [r2, #4]
    str fp, [r2, #8]
    str fp, [r2, #12]
    adds r0, r2, #16
    strb fp, [r2]
    beq .Ldt42_00d0
    ldm r8, {r1, r3}
    stm r0, {r1, r3}
    ldr r1, [r8, #8]
    str r1, [r0, #8]
.Ldt42_00d0:
    ldrd r0, [r4, #16]
    add r1, r1, #1
    cmp r0, r5
    str r1, [r4, #20]
    beq .Ldt42_0104
    cmp sl, #0
    bne .Ldt42_0104
    add r1, r5, #16
    ldm r8, {r0, ip}
    ldm r1, {r1, r3}
    subs r0, r0, r1
    sbcs r0, ip, r3
    bcs .Ldt42_0134
.Ldt42_0104:
    str r2, [r5, #8]
    ldr r0, [r4, #16]
    cmp r0, r5
    bne .Ldt42_0124
    str r2, [r0, #4]
    ldr r0, [r4, #16]
    str r2, [r0, #12]
    b .Ldt42_0148
.Ldt42_0124:
    ldr r1, [r0, #8]
    cmp r1, r5
    streq r2, [r0, #8]
    b .Ldt42_0148
.Ldt42_0134:
    str r2, [r5, #12]
    ldr r0, [r4, #16]
    ldr r1, [r0, #12]
    cmp r1, r5
    streq r2, [r0, #12]
.Ldt42_0148:
    mov r0, r2
    mov ip, #1
    str r5, [r2, #4]
    b .Ldt42_0344
.Ldt42_0158:
    ldr r3, [r1, #4]
    ldr r5, [r3, #8]
    cmp r1, r5
    bne .Ldt42_0268
    ldr r3, [r3, #12]
    cmp r3, #0
    beq .Ldt42_0180
    ldrb lr, [r3]
    cmp lr, #0
    beq .Ldt42_0248
.Ldt42_0180:
    ldr r3, [r1, #12]
    cmp r3, r0
    bne .Ldt42_01dc
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
    beq .Ldt42_01d4
    ldr r1, [r0, #4]
    ldr r5, [r1, #8]
    cmp r5, r0
    streq r3, [r1, #8]
    strne r3, [r1, #12]
.Ldt42_01d4:
    str r0, [r3, #8]
    str r3, [r0, #4]
.Ldt42_01dc:
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
    beq .Ldt42_0240
    ldr r5, [r1, #4]
    ldr lr, [r5, #12]
    cmp lr, r1
    streq r3, [r5, #12]
    strne r3, [r5, #8]
.Ldt42_0240:
    str r1, [r3, #12]
    b .Ldt42_0340
.Ldt42_0248:
    strb ip, [r1]
    strb ip, [r3]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r0, [r0, #4]
    ldr r0, [r0, #4]
    b .Ldt42_0344
.Ldt42_0268:
    cmp r5, #0
    beq .Ldt42_027c
    ldrb r3, [r5]
    cmp r3, #0
    beq .Ldt42_0378
.Ldt42_027c:
    ldr r3, [r1, #8]
    cmp r3, r0
    bne .Ldt42_02d8
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
    beq .Ldt42_02d0
    ldr r1, [r0, #4]
    ldr r5, [r1, #12]
    cmp r5, r0
    streq r3, [r1, #12]
    strne r3, [r1, #8]
.Ldt42_02d0:
    str r0, [r3, #12]
    str r3, [r0, #4]
.Ldt42_02d8:
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
    ldr r5, [r3, #8]
    cmp r5, #0
    strne r1, [r5, #4]
    ldr lr, [r1, #4]
    str lr, [r3, #4]
    ldr r5, [r4, #16]
    ldr lr, [r5, #4]
    cmp lr, r1
    streq r3, [r5, #4]
    beq .Ldt42_033c
    ldr r5, [r1, #4]
    ldr lr, [r5, #8]
    cmp lr, r1
    streq r3, [r5, #8]
    strne r3, [r5, #12]
.Ldt42_033c:
    str r1, [r3, #8]
.Ldt42_0340:
    str r3, [r1, #4]
.Ldt42_0344:
    ldr r1, [r4, #16]
    ldr r1, [r1, #4]
    cmp r1, r0
    beq .Ldt42_0364
    ldr r1, [r0, #4]
    ldrb r3, [r1]
    cmp r3, #0
    beq .Ldt42_0158
.Ldt42_0364:
    ldr r0, [r4, #16]
    ldr r0, [r0, #4]
    strb ip, [r0]
    str r2, [r9]
    pop {r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
.Ldt42_0378:
    strb ip, [r1]
    strb ip, [r5]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb fp, [r1]
    ldr r0, [r0, #4]
    ldr r0, [r0, #4]
    b .Ldt42_0344
```

The body ends immediately after the final branch. No pool or padding follows
either expansion.

## Probe result

A neutral GNU Arm probe expanded the complete schedule for both function
names. Because the deliberately minimal probe does not reproduce unrelated
target sections, it declared the allocator as undefined solely to preserve
symbolic call relocations in the probe object. This probe-local declaration
is not a target visibility requirement. The probe established ARM mode and
four-byte alignment, 920-byte body size, 230 instructions, the exact 22-label
control-flow graph, two `R_ARM_CALL` relocations per expansion at offsets
+116 and +128, and no data relocations. After resolving both calls to their
shared symbolic identity, each complete probe body matched its target body.

## Acceptance criteria

- Emit both global function symbols in the order listed above.
- Expand exactly one 920-byte ARM body per function with the stated schedule.
- Scope all 22 local labels independently per expansion.
- Emit exactly the two call relocations in the call ledger and no others.
- In the authoritative target object, resolve those relocations to the global,
  object-defined `func_00184990`; do not require an undefined callee there.
- Emit no literal pool, embedded table, or post-body padding.
- Preserve the four-occurrence equality class for the allocator identity.
- Match 1,840 target `.text` bytes across the two functions.
