# Probe-verified duplicate ARM templates 27

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body duplicate grouping, control/data-flow inspection, and
  independent GNU Arm mnemonic probes.
- Probe toolchain: GNU Arm assembler and objcopy 2.45.1.20251203 from GCC Arm
  Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, extracted assets, private absolute
  addresses, implementation source, or proprietary source.

Every function exact in the current report and every function named by a
manifest or specification through batch 26 was excluded before grouping. The
concurrently staged batch-26 IPC and runtime selections were also excluded.
This bounded batch contains one complete-body group: exactly ten ARM-state
functions, each 1,628 bytes, totaling 16,280 code bytes.

The body is self-contained. It has no calls, external branches, literal-pool
slots, adjacent tables, data identities, or relocations. All branches in the
schedule below target labels inside the same body.

## Intrusive colored-tree erase and rebalance

These ARM-state functions are identical over their complete bodies:

- `func_00182CB0`
- `func_00189A24`
- `func_00192484`
- `func_00553230`
- `func_00559984`
- `func_0055A388`
- `func_0055EE44`
- `func_0056265C`
- `func_00564E30`
- `func_00567A70`

The function receives a writable result slot in `r0`, a tree/container
record in `r1`, and a pointer to the selected node pointer in `r2`. Each
tree node uses a one-byte state at offset 0 and word-sized parent, left-child,
and right-child links at offsets 4, 8, and 12. The container's sentinel/header
pointer is at offset 16 and its node count is at offset 20.

If the selected pointer is the sentinel, store that sentinel in the result
slot and return without changing the tree. Otherwise unlink the selected node,
preserve or transplant its in-order successor as required, update the
sentinel's root/extreme-node links, and repair the tree's one-byte coloring
invariant through rotations and recoloring. Link the detached node into the
container-maintained chain rooted at container offset 4, decrement the count,
store the original selected node in the result slot, and return.

The byte state uses zero and one as the two observed color/state values.
Null child pointers are represented by zero. The implementation must preserve
the exact register allocation, conditional execution, repeated loads, branch
shape, and physical instruction order below; semantically equivalent
high-level tree code is not expected to encode identically.

### Complete exact body schedule

Labels are body-local. When this template is emitted more than once, each
expansion must use macro-local or otherwise uniquely scoped labels.

```asm
    push {r4, r5, r6, r7, r8, r9}
    ldr ip, [r2]
    ldr r3, [r1, #16]
    cmp ip, r3
    streq r3, [r0]
    beq .Ldt27_0434
    ldr r3, [ip, #12]
    cmp r3, #0
    beq .Ldt27_0038
.Ldt27_0024:
    mov ip, r3
    ldr r3, [r3, #8]
    cmp r3, #0
    bne .Ldt27_0024
    b .Ldt27_0068
.Ldt27_0038:
    ldr r3, [ip, #4]
    ldr r5, [r3, #12]
    cmp ip, r5
    bne .Ldt27_005c
.Ldt27_0048:
    mov ip, r3
    ldr r3, [r3, #4]
    ldr r4, [r3, #12]
    cmp ip, r4
    beq .Ldt27_0048
.Ldt27_005c:
    ldr r4, [ip, #12]
    cmp r4, r3
    movne ip, r3
.Ldt27_0068:
    ldr r4, [r2]
    mov r7, #0
    mov r3, r4
    ldr r5, [r4, #8]
    ldr r2, [r4, #12]
    cmp r5, #0
    beq .Ldt27_00fc
    cmp r2, #0
    moveq r2, r5
    beq .Ldt27_00b4
    mov r3, r2
    ldr r2, [r2, #8]
    cmp r2, #0
    beq .Ldt27_00b0
.Ldt27_00a0:
    ldr r3, [r3, #8]
    ldr r2, [r3, #8]
    cmp r2, #0
    bne .Ldt27_00a0
.Ldt27_00b0:
    ldr r2, [r3, #12]
.Ldt27_00b4:
    cmp r3, r4
    beq .Ldt27_01c0
    str r3, [r5, #4]
    ldr r5, [r4, #8]
    str r5, [r3, #8]
    ldr r5, [r4, #12]
    cmp r5, r3
    beq .Ldt27_0168
    cmp r2, #0
    ldrne r5, [r3, #4]
    strne r5, [r2, #4]
    ldr r5, [r3, #4]
    str r2, [r5, #8]
    ldr r5, [r4, #12]
    str r5, [r3, #12]
    ldr r5, [r4, #12]
    str r3, [r5, #4]
    b .Ldt27_0170
.Ldt27_00fc:
    cmp r2, #0
    bne .Ldt27_00b4
    ldr r2, [r3, #4]
    ldr r4, [r1, #16]
    cmp r4, r2
    bne .Ldt27_012c
    str r2, [r4, #12]
    ldr r4, [r1, #16]
    str r2, [r4, #8]
    ldr r4, [r1, #16]
    str r7, [r4, #4]
    b .Ldt27_0280
.Ldt27_012c:
    ldr r4, [r2, #8]
    cmp r4, r3
    bne .Ldt27_0150
    str r7, [r2, #8]
    ldr r4, [r1, #16]
    ldr r5, [r4, #8]
    cmp r5, r3
    streq r2, [r4, #8]
    b .Ldt27_0280
.Ldt27_0150:
    str r7, [r2, #12]
    ldr r4, [r1, #16]
    ldr r6, [r4, #12]
    cmp r6, r3
    streq r2, [r4, #12]
    b .Ldt27_0280
.Ldt27_0168:
    cmp r2, #0
    strne r3, [r2, #4]
.Ldt27_0170:
    ldr r5, [r1, #16]
    ldr r6, [r5, #4]
    cmp r6, r4
    streq r3, [r5, #4]
    beq .Ldt27_0198
    ldr r5, [r4, #4]
    ldr r6, [r5, #8]
    cmp r6, r4
    streq r3, [r5, #8]
    strne r3, [r5, #12]
.Ldt27_0198:
    ldr r5, [r4, #4]
    cmp r2, #0
    moveq r2, r3
    str r5, [r3, #4]
    ldrb r6, [r4]
    ldrb r5, [r3]
    strb r6, [r3]
    mov r3, r4
    strb r5, [r4]
    b .Ldt27_0280
.Ldt27_01c0:
    ldr r5, [r3, #4]
    str r5, [r2, #4]
    ldr r5, [r1, #16]
    ldr r6, [r5, #4]
    cmp r6, r4
    streq r2, [r5, #4]
    beq .Ldt27_01f0
    ldr r5, [r4, #4]
    ldr r6, [r5, #8]
    cmp r6, r4
    streq r2, [r5, #8]
    strne r2, [r5, #12]
.Ldt27_01f0:
    ldr r6, [r1, #16]
    ldr r5, [r6, #8]
    cmp r5, r4
    bne .Ldt27_0238
    ldr r5, [r4, #12]
    cmp r5, #0
    ldreq r5, [r4, #4]
    streq r5, [r6, #8]
    beq .Ldt27_0238
    ldr r8, [r2, #8]
    mov r5, r2
    cmp r8, #0
    beq .Ldt27_0234
.Ldt27_0224:
    mov r5, r8
    ldr r8, [r8, #8]
    cmp r8, #0
    bne .Ldt27_0224
.Ldt27_0234:
    str r5, [r6, #8]
.Ldt27_0238:
    ldr r5, [r1, #16]
    ldr r6, [r5, #12]
    cmp r6, r4
    bne .Ldt27_0280
    ldr r6, [r4, #8]
    cmp r6, #0
    ldreq r4, [r4, #4]
    streq r4, [r5, #12]
    beq .Ldt27_0280
    ldr r6, [r2, #12]
    mov r4, r2
    cmp r6, #0
    beq .Ldt27_027c
.Ldt27_026c:
    mov r4, r6
    ldr r6, [r6, #12]
    cmp r6, #0
    bne .Ldt27_026c
.Ldt27_027c:
    str r4, [r5, #12]
.Ldt27_0280:
    ldr r4, [r1, #16]
    cmp r4, r2
    ldrbne r4, [r3]
    cmpne r4, #0
    movne r6, #1
    beq .Ldt27_0418
    b .Ldt27_03f8
.Ldt27_029c:
    ldr r5, [r2, #4]
    ldr r4, [r5, #8]
    cmp r4, r2
    bne .Ldt27_04ac
    ldr r4, [r5, #12]
    cmp r4, #0
    beq .Ldt27_03d0
    ldrb r5, [r4]
    cmp r5, #0
    beq .Ldt27_0360
.Ldt27_02c4:
    ldr r5, [r4, #8]
    cmp r5, #0
    ldrbne r8, [r5]
    cmpne r8, #1
    beq .Ldt27_03dc
.Ldt27_02d8:
    ldr r8, [r4, #12]
    cmp r8, #0
    ldrbne r8, [r8]
    cmpne r8, #1
    beq .Ldt27_043c
.Ldt27_02ec:
    ldr r5, [r2, #4]
    ldrb r5, [r5]
    strb r5, [r4]
    ldr r5, [r2, #4]
    strb r6, [r5]
    ldr r4, [r4, #12]
    cmp r4, #0
    strbne r6, [r4]
    ldr r4, [r2, #4]
    ldr r5, [r4, #12]
    ldr r7, [r5, #8]
    str r7, [r4, #12]
    ldr r7, [r5, #8]
    cmp r7, #0
    strne r4, [r7, #4]
    ldr r7, [r4, #4]
    str r7, [r5, #4]
    ldr r7, [r1, #16]
    ldr r8, [r7, #4]
    cmp r8, r4
    streq r5, [r7, #4]
    beq .Ldt27_0358
    ldr r7, [r4, #4]
    ldr r8, [r7, #8]
    cmp r8, r4
    streq r5, [r7, #8]
    strne r5, [r7, #12]
.Ldt27_0358:
    str r4, [r5, #8]
    b .Ldt27_0558
.Ldt27_0360:
    strb r6, [r4]
    ldr r4, [r2, #4]
    strb r7, [r4]
    ldr r4, [r2, #4]
    ldr r5, [r4, #12]
    ldr r8, [r5, #8]
    str r8, [r4, #12]
    ldr r8, [r5, #8]
    cmp r8, #0
    strne r4, [r8, #4]
    ldr r8, [r4, #4]
    str r8, [r5, #4]
    ldr r8, [r1, #16]
    ldr r9, [r8, #4]
    cmp r9, r4
    streq r5, [r8, #4]
    beq .Ldt27_03b8
    ldr r8, [r4, #4]
    ldr r9, [r8, #8]
    cmp r9, r4
    streq r5, [r8, #8]
    strne r5, [r8, #12]
.Ldt27_03b8:
    str r4, [r5, #8]
    str r5, [r4, #4]
    ldr r5, [r2, #4]
    ldr r4, [r5, #12]
    cmp r4, #0
    bne .Ldt27_02c4
.Ldt27_03d0:
    strb r7, [r2]
    mov r2, r5
    b .Ldt27_03f8
.Ldt27_03dc:
    ldr r8, [r4, #12]
    cmp r8, #0
    ldrbne r8, [r8]
    cmpne r8, #1
    bne .Ldt27_02d8
.Ldt27_03f0:
    strb r7, [r4]
    ldr r2, [r2, #4]
.Ldt27_03f8:
    ldr r4, [r1, #16]
    ldr r4, [r4, #4]
    cmp r4, r2
    beq .Ldt27_0414
    ldrb r4, [r2]
    cmp r4, #1
    beq .Ldt27_029c
.Ldt27_0414:
    strb r6, [r2]
.Ldt27_0418:
    ldr r2, [r1, #4]
    str r2, [r3, #12]
    str r3, [r1, #4]
    ldr r2, [r1, #20]
    sub r2, r2, #1
    str r2, [r1, #20]
    str ip, [r0]
.Ldt27_0434:
    pop {r4, r5, r6, r7, r8, r9}
    bx lr
.Ldt27_043c:
    cmp r5, #0
    strbne r6, [r5]
    strb r7, [r4]
    ldr r5, [r4, #8]
    ldr r7, [r5, #12]
    str r7, [r4, #8]
    ldr r7, [r5, #12]
    cmp r7, #0
    strne r4, [r7, #4]
    ldr r7, [r4, #4]
    str r7, [r5, #4]
    ldr r7, [r1, #16]
    ldr r8, [r7, #4]
    cmp r8, r4
    streq r5, [r7, #4]
    beq .Ldt27_0490
    ldr r7, [r4, #4]
    ldr r8, [r7, #12]
    cmp r8, r4
    streq r5, [r7, #12]
    strne r5, [r7, #8]
.Ldt27_0490:
    str r4, [r5, #12]
    str r5, [r4, #4]
    ldr r4, [r2, #4]
    ldr r4, [r4, #12]
    cmp r4, #0
    bne .Ldt27_02ec
    b .Ldt27_0414
.Ldt27_04ac:
    cmp r4, #0
    beq .Ldt27_03d0
    ldrb r5, [r4]
    cmp r5, #0
    beq .Ldt27_0560
.Ldt27_04c0:
    ldr r8, [r4, #12]
    cmp r8, #0
    ldrbne r5, [r8]
    cmpne r5, #1
    beq .Ldt27_05d4
.Ldt27_04d4:
    ldr r5, [r4, #8]
    cmp r5, #0
    ldrbne r5, [r5]
    cmpne r5, #1
    beq .Ldt27_05ec
.Ldt27_04e8:
    ldr r5, [r2, #4]
    ldrb r5, [r5]
    strb r5, [r4]
    ldr r5, [r2, #4]
    strb r6, [r5]
    ldr r4, [r4, #8]
    cmp r4, #0
    strbne r6, [r4]
    ldr r4, [r2, #4]
    ldr r5, [r4, #8]
    ldr r7, [r5, #12]
    str r7, [r4, #8]
    ldr r7, [r5, #12]
    cmp r7, #0
    strne r4, [r7, #4]
    ldr r7, [r4, #4]
    str r7, [r5, #4]
    ldr r7, [r1, #16]
    ldr r8, [r7, #4]
    cmp r8, r4
    streq r5, [r7, #4]
    beq .Ldt27_0554
    ldr r7, [r4, #4]
    ldr r8, [r7, #12]
    cmp r8, r4
    streq r5, [r7, #12]
    strne r5, [r7, #8]
.Ldt27_0554:
    str r4, [r5, #12]
.Ldt27_0558:
    str r5, [r4, #4]
    b .Ldt27_0414
.Ldt27_0560:
    strb r6, [r4]
    ldr r4, [r2, #4]
    strb r7, [r4]
    ldr r4, [r2, #4]
    ldr r5, [r4, #8]
    ldr r8, [r5, #12]
    str r8, [r4, #8]
    ldr r8, [r5, #12]
    cmp r8, #0
    strne r4, [r8, #4]
    ldr r8, [r4, #4]
    str r8, [r5, #4]
    ldr r8, [r1, #16]
    ldr r9, [r8, #4]
    cmp r9, r4
    streq r5, [r8, #4]
    beq .Ldt27_05b8
    ldr r8, [r4, #4]
    ldr r9, [r8, #12]
    cmp r9, r4
    streq r5, [r8, #12]
    strne r5, [r8, #8]
.Ldt27_05b8:
    str r4, [r5, #12]
    str r5, [r4, #4]
    ldr r5, [r2, #4]
    ldr r4, [r5, #8]
    cmp r4, #0
    beq .Ldt27_03d0
    b .Ldt27_04c0
.Ldt27_05d4:
    ldr r5, [r4, #8]
    cmp r5, #0
    ldrbne r5, [r5]
    cmpne r5, #1
    bne .Ldt27_04d4
    b .Ldt27_03f0
.Ldt27_05ec:
    cmp r8, #0
    strbne r6, [r8]
    strb r7, [r4]
    ldr r5, [r4, #12]
    ldr r7, [r5, #8]
    str r7, [r4, #12]
    ldr r7, [r5, #8]
    cmp r7, #0
    strne r4, [r7, #4]
    ldr r7, [r4, #4]
    str r7, [r5, #4]
    ldr r7, [r1, #16]
    ldr r8, [r7, #4]
    cmp r8, r4
    streq r5, [r7, #4]
    beq .Ldt27_0640
    ldr r7, [r4, #4]
    ldr r8, [r7, #8]
    cmp r8, r4
    streq r5, [r7, #8]
    strne r5, [r7, #12]
.Ldt27_0640:
    str r4, [r5, #8]
    str r5, [r4, #4]
    ldr r4, [r2, #4]
    ldr r4, [r4, #8]
    cmp r4, #0
    bne .Ldt27_04e8
    b .Ldt27_0414
```

## Symbolic relocation and identity ledger

There are no symbolic identities, post-body literals, tables, calls, or
relocations in this batch. The 49 labels in the schedule are internal
control-flow destinations only. Each emitted copy is four-byte aligned and
contains exactly 407 ARM instructions.

## Independent full-body probe result

The complete mnemonic schedule above was independently assembled in ARM state.
The resulting 1,628-byte body was compared byte for byte with every listed
function's complete declared body.

| Template | Functions | Bytes each | Aggregate | Calls | Literal/table slots | Full-body result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Intrusive colored-tree erase/rebalance | 10 | 1,628 | 16,280 | 0 | 0 | 10/10 exact |
| **Total** | **10** |  | **16,280** | **0** | **0** | **10/10 exact; 16,280/16,280 bytes** |

The current objdiff report lists all ten functions as unmatched. A complete
scan of the public config/spec inventory found none of the names, and the
concurrent batch-26 IPC/runtime selections contain none of them. Thus the
overlap with exact functions and prior or concurrent work is zero.

## Exact-schedule cautions

- Preserve ARM state, four-byte function alignment, all 407 mnemonics, and
  the exact register choices.
- Keep `ip` as the saved original selected node; it is written to the result
  only after mutation completes.
- Do not coalesce repeated container, parent, child, or byte-state loads.
  Several apparently redundant loads are part of the exact schedule.
- Preserve byte accesses for node state and word accesses for all links and
  the count.
- Preserve every condition suffix and its producing comparison. In
  particular, the schedule relies on adjacent conditional loads, compares,
  moves, and stores.
- Preserve the early epilogue in the middle of the physical body and the
  forward repair blocks placed after it.
- Preserve `push {r4, r5, r6, r7, r8, r9}` and the matching `pop`; LR is
  intentionally not stacked because the function makes no calls.
- Keep all branch targets local. No target generator normalization is
  permitted or required for this family.
