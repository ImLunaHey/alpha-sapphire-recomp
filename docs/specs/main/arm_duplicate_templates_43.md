# Probe-verified duplicate ARM templates 43

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
The concurrently selected runtime batch 43 functions were also excluded and
are disjoint from this batch. The two functions below are the highest-yield
remaining complete-body ARM duplicate group after direct calls are represented
symbolically: two 892-byte bodies, totaling 1,784 executable bytes.

## Pooled word-key red-black-tree node insertion

These ARM-state functions share one complete 223-instruction schedule:

```text
func_0018FC6C  func_00560E5C
```

The function receives an output pointer in `r0`, a tree/container in `r1`, an
insertion-selection flag in `r2`, a neighboring node in `r3`, and a fifth
argument on the stack describing the inserted payload. It obtains a 44-byte
node from the container's pooled blocks, growing the pool when necessary.
The new node's links and color byte are initialized. Its payload begins at
offset 16: the first word is copied directly and the remainder is initialized
by the function-specific helper. The container count at offset 20 is
incremented. When selection is required, the first payload word is compared
as an unsigned key to choose the insertion side. The node is linked beside the
neighboring node, and the standard mirrored red-black insertion repair rotates
and recolors the tree until the root is black. The created node is written
through the entry `r0` output pointer.

The exact instruction and register schedule, rather than this semantic
summary, is the implementation contract.

## Call, equality, and relative ledgers

Each body makes three ARM-state link-setting calls:

| Body offset | Relocation | Symbolic identity | Semantic role |
| ---: | --- | --- | --- |
| +116 | `R_ARM_CALL` | `func_00184990` | allocate a 12-byte pool descriptor |
| +132 | `R_ARM_CALL` | `func_00184990` | allocate storage for the node block |
| +216 | `R_ARM_CALL` | function-specific payload initializer | initialize/copy the payload remainder |

The payload-initializer mapping is:

| Insertion body | Payload initializer at +216 |
| --- | --- |
| `func_0018FC6C` | `func_0018E1E0` |
| `func_00560E5C` | `func_0029F668` |

Thus the batch has six `R_ARM_CALL` sites in three target-identity classes:
the allocator identity is shared by four sites, while each payload initializer
forms its own singleton class. There are no indirect calls, external non-call
branches, literal loads, post-body pool words, embedded tables, or alignment
bytes.

After the three direct-call fields are normalized by symbolic role, the two
complete 892-byte bodies are equal. No other body field requires
normalization. The complete ordered local-label ledger is:

```text
+112, +180, +220, +264, +296, +312, +332, +348, +388, +472, +480,
+580, +588, +620, +636, +720, +732, +832, +836, +840, +872
```

All labels must be uniquely scoped per template expansion.

## Complete exact body schedule

`payload_initializer` is the function-specific identity from the mapping
above.

```asm
    push {r4, r5, r6, r7, r8, r9, sl, fp, ip, lr}
    mov r4, r1
    mov r5, r3
    mov r9, r0
    mov fp, r2
    ldr r6, [r1, #4]
    ldr r8, [sp, #40]
    mov sl, #0
    cmp r6, #0
    ldrne r0, [r6, #12]
    strne r0, [r4, #4]
    bne .Ldt43_00b4
    ldr r0, [r4, #12]
    ldr r6, [r4, #8]
    cmp r6, r0
    addne r0, r6, #44
    strne r0, [r4, #8]
    bne .Ldt43_00b4
    ldr r0, [r4]
    cmp r0, #0
    moveq r6, #32
    beq .Ldt43_0070
    ldr r0, [r0, #4]
    add r1, r0, r0, lsr #1
    add r6, r1, r0, lsr #3
    add r0, r0, #32
    cmp r0, r6
    movhi r6, r0
.Ldt43_0070:
    mov r0, #12
    bl func_00184990
    mov r7, r0
    mov r0, #44
    mul r0, r6, r0
    bl func_00184990
    str r0, [r7, #8]
    ldr r0, [r4]
    add r1, r6, r6, lsl #1
    add r1, r1, r6, lsl #3
    stm r7, {r0, r6}
    str r7, [r4]
    ldr r6, [r7, #8]
    add r0, r6, r1, lsl #2
    str r0, [r4, #12]
    add r0, r6, #44
    str r0, [r4, #8]
.Ldt43_00b4:
    str sl, [r6, #4]
    str sl, [r6, #8]
    str sl, [r6, #12]
    adds r0, r6, #16
    strb sl, [r6]
    beq .Ldt43_00dc
    ldr r2, [r8]
    add r1, r8, #4
    str r2, [r0], #4
    bl payload_initializer
.Ldt43_00dc:
    ldrd r0, [r4, #16]
    add r1, r1, #1
    cmp r0, r5
    str r1, [r4, #20]
    beq .Ldt43_0108
    cmp fp, #0
    bne .Ldt43_0108
    ldr r0, [r8]
    ldr r1, [r5, #16]
    cmp r1, r0
    bls .Ldt43_0138
.Ldt43_0108:
    str r6, [r5, #8]
    ldr r0, [r4, #16]
    cmp r0, r5
    bne .Ldt43_0128
    str r6, [r0, #4]
    ldr r0, [r4, #16]
    str r6, [r0, #12]
    b .Ldt43_014c
.Ldt43_0128:
    ldr r1, [r0, #8]
    cmp r1, r5
    streq r6, [r0, #8]
    b .Ldt43_014c
.Ldt43_0138:
    str r6, [r5, #12]
    ldr r0, [r4, #16]
    ldr r1, [r0, #12]
    cmp r1, r5
    streq r6, [r0, #12]
.Ldt43_014c:
    mov r0, r6
    mov r2, #1
    str r5, [r6, #4]
    b .Ldt43_0348
.Ldt43_015c:
    ldr ip, [r1, #4]
    ldr r3, [ip, #8]
    cmp r1, r3
    bne .Ldt43_026c
    ldr r3, [ip, #12]
    cmp r3, #0
    beq .Ldt43_0184
    ldrb ip, [r3]
    cmp ip, #0
    beq .Ldt43_024c
.Ldt43_0184:
    ldr r3, [r1, #12]
    cmp r3, r0
    bne .Ldt43_01e0
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
    beq .Ldt43_01d8
    ldr r1, [r0, #4]
    ldr r5, [r1, #8]
    cmp r5, r0
    streq r3, [r1, #8]
    strne r3, [r1, #12]
.Ldt43_01d8:
    str r0, [r3, #8]
    str r3, [r0, #4]
.Ldt43_01e0:
    ldr r1, [r0, #4]
    strb r2, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb sl, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    ldr r3, [r1, #8]
    ldr ip, [r3, #12]
    str ip, [r1, #8]
    ldr ip, [r3, #12]
    cmp ip, #0
    strne r1, [ip, #4]
    ldr ip, [r1, #4]
    str ip, [r3, #4]
    ldr ip, [r4, #16]
    ldr r5, [ip, #4]
    cmp r5, r1
    streq r3, [ip, #4]
    beq .Ldt43_0244
    ldr ip, [r1, #4]
    ldr r5, [ip, #12]
    cmp r5, r1
    streq r3, [ip, #12]
    strne r3, [ip, #8]
.Ldt43_0244:
    str r1, [r3, #12]
    b .Ldt43_0344
.Ldt43_024c:
    strb r2, [r1]
    strb r2, [r3]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb sl, [r1]
    ldr r0, [r0, #4]
    ldr r0, [r0, #4]
    b .Ldt43_0348
.Ldt43_026c:
    cmp r3, #0
    beq .Ldt43_0280
    ldrb ip, [r3]
    cmp ip, #0
    beq .Ldt43_024c
.Ldt43_0280:
    ldr r3, [r1, #8]
    cmp r3, r0
    bne .Ldt43_02dc
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
    beq .Ldt43_02d4
    ldr r1, [r0, #4]
    ldr r5, [r1, #12]
    cmp r5, r0
    streq r3, [r1, #12]
    strne r3, [r1, #8]
.Ldt43_02d4:
    str r0, [r3, #12]
    str r3, [r0, #4]
.Ldt43_02dc:
    ldr r1, [r0, #4]
    strb r2, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    strb sl, [r1]
    ldr r1, [r0, #4]
    ldr r1, [r1, #4]
    ldr r3, [r1, #12]
    ldr ip, [r3, #8]
    str ip, [r1, #12]
    ldr ip, [r3, #8]
    cmp ip, #0
    strne r1, [ip, #4]
    ldr ip, [r1, #4]
    str ip, [r3, #4]
    ldr ip, [r4, #16]
    ldr r5, [ip, #4]
    cmp r5, r1
    streq r3, [ip, #4]
    beq .Ldt43_0340
    ldr ip, [r1, #4]
    ldr r5, [ip, #8]
    cmp r5, r1
    streq r3, [ip, #8]
    strne r3, [ip, #12]
.Ldt43_0340:
    str r1, [r3, #8]
.Ldt43_0344:
    str r3, [r1, #4]
.Ldt43_0348:
    ldr r1, [r4, #16]
    ldr r1, [r1, #4]
    cmp r1, r0
    beq .Ldt43_0368
    ldr r1, [r0, #4]
    ldrb r3, [r1]
    cmp r3, #0
    beq .Ldt43_015c
.Ldt43_0368:
    ldr r0, [r4, #16]
    ldr r0, [r0, #4]
    strb r2, [r0]
    str r6, [r9]
    pop {r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
```

## Boundary and implementation contract

- Emit each function in ARM state with 4-byte alignment and an exact
  892-byte function extent.
- Give every local label expansion-private scope.
- Emit the three calls at exactly the listed offsets and preserve their
  symbolic identity/equality classes.
- Emit no post-body literals, tables, padding, or adjacent words for either
  function.
- Preserve the exact register choices, conditions, addressing modes, and
  instruction order shown above. Equivalent source-level red-black-tree logic
  is insufficient if it changes the machine schedule.

## Validation summary

The current objdiff report identifies both functions as unmatched. A complete
repository scan finds neither function in an earlier tracked specification or
configuration, and this batch is disjoint from the concurrent runtime batch
43 selection.

A neutral GNU Arm probe instantiated the schedule twice with expansion-local
labels and symbolic call operands. For both expansions, all 892 body bytes
match the independently verified target after each direct call is linked to
its specified target identity. The probe also confirms 223 ARM instructions,
21 local branch destinations, three `R_ARM_CALL` relocations, no literal or
data relocations, and no bytes after either function body.
