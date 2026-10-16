# Probe-verified duplicate ARM templates 28

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
public manifest or specification through batch 27 was excluded before
grouping. The concurrently staged batch-27 IPC selection was also excluded.
This bounded batch contains one complete-body group: exactly nine ARM-state
functions, each 1,632 bytes, totaling 14,688 code bytes.

The body is self-contained. It has no calls, external branches, literal-pool
slots, adjacent tables, data identities, or relocations. All branches in the
schedule below target labels inside the same body.

## Intrusive colored-tree erase and rebalance, register variant B

These ARM-state functions are identical over their complete bodies:

- `func_0014456C`
- `func_0018330C`
- `func_00551088`
- `func_0055266C`
- `func_00557610`
- `func_00558028`
- `func_00561C44`
- `func_00568484`
- `func_00568B20`

The function receives a writable result slot in `r0`, a tree/container record
in `r1`, and a pointer to the selected node pointer in `r2`. Each tree node
uses a one-byte state at offset 0 and word-sized parent, left-child, and
right-child links at offsets 4, 8, and 12. The container's sentinel/header
pointer is at offset 16 and its node count is at offset 20.

If the selected pointer is the sentinel, store that sentinel in the result
slot and return without changing the tree. Otherwise unlink the selected node,
preserve or transplant its in-order successor as required, update the
sentinel's root/extreme-node links, and repair the tree's one-byte coloring
invariant through rotations and recoloring. Link the detached node into the
container-maintained chain rooted at container offset 4, decrement the count,
store the original selected node in the result slot, and return.

The byte state uses zero and one as the two observed color/state values. Null
child pointers are represented by zero. The implementation must preserve the
exact register allocation, conditional execution, repeated loads, branch
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
    beq .Ldt28_0438
    ldr r3, [ip, #12]
    cmp r3, #0
    beq .Ldt28_0038
.Ldt28_0024:
    mov ip, r3
    ldr r3, [r3, #8]
    cmp r3, #0
    bne .Ldt28_0024
    b .Ldt28_0068
.Ldt28_0038:
    ldr r3, [ip, #4]
    ldr r5, [r3, #12]
    cmp ip, r5
    bne .Ldt28_005c
.Ldt28_0048:
    mov ip, r3
    ldr r3, [r3, #4]
    ldr r4, [r3, #12]
    cmp ip, r4
    beq .Ldt28_0048
.Ldt28_005c:
    ldr r4, [ip, #12]
    cmp r4, r3
    movne ip, r3
.Ldt28_0068:
    ldr r4, [r2]
    mov r6, #0
    mov r3, r4
    ldr r5, [r4, #8]
    ldr r2, [r4, #12]
    cmp r5, #0
    beq .Ldt28_00fc
    cmp r2, #0
    moveq r2, r5
    beq .Ldt28_00b4
    mov r3, r2
    ldr r2, [r2, #8]
    cmp r2, #0
    beq .Ldt28_00b0
.Ldt28_00a0:
    ldr r3, [r3, #8]
    ldr r2, [r3, #8]
    cmp r2, #0
    bne .Ldt28_00a0
.Ldt28_00b0:
    ldr r2, [r3, #12]
.Ldt28_00b4:
    cmp r3, r4
    beq .Ldt28_01c0
    str r3, [r5, #4]
    ldr r5, [r4, #8]
    str r5, [r3, #8]
    ldr r5, [r4, #12]
    cmp r5, r3
    beq .Ldt28_0168
    cmp r2, #0
    ldrne r5, [r3, #4]
    strne r5, [r2, #4]
    ldr r5, [r3, #4]
    str r2, [r5, #8]
    ldr r5, [r4, #12]
    str r5, [r3, #12]
    ldr r5, [r4, #12]
    str r3, [r5, #4]
    b .Ldt28_0170
.Ldt28_00fc:
    cmp r2, #0
    bne .Ldt28_00b4
    ldr r2, [r3, #4]
    ldr r4, [r1, #16]
    cmp r4, r2
    bne .Ldt28_012c
    str r2, [r4, #12]
    ldr r4, [r1, #16]
    str r2, [r4, #8]
    ldr r4, [r1, #16]
    str r6, [r4, #4]
    b .Ldt28_0280
.Ldt28_012c:
    ldr r4, [r2, #8]
    cmp r4, r3
    bne .Ldt28_0150
    str r6, [r2, #8]
    ldr r4, [r1, #16]
    ldr r5, [r4, #8]
    cmp r5, r3
    streq r2, [r4, #8]
    b .Ldt28_0280
.Ldt28_0150:
    str r6, [r2, #12]
    ldr r4, [r1, #16]
    ldr r7, [r4, #12]
    cmp r7, r3
    streq r2, [r4, #12]
    b .Ldt28_0280
.Ldt28_0168:
    cmp r2, #0
    strne r3, [r2, #4]
.Ldt28_0170:
    ldr r5, [r1, #16]
    ldr r7, [r5, #4]
    cmp r7, r4
    streq r3, [r5, #4]
    beq .Ldt28_0198
    ldr r5, [r4, #4]
    ldr r7, [r5, #8]
    cmp r7, r4
    streq r3, [r5, #8]
    strne r3, [r5, #12]
.Ldt28_0198:
    ldr r5, [r4, #4]
    cmp r2, #0
    moveq r2, r3
    str r5, [r3, #4]
    ldrb r7, [r4]
    ldrb r5, [r3]
    strb r7, [r3]
    mov r3, r4
    strb r5, [r4]
    b .Ldt28_0280
.Ldt28_01c0:
    ldr r5, [r3, #4]
    str r5, [r2, #4]
    ldr r5, [r1, #16]
    ldr r7, [r5, #4]
    cmp r7, r4
    streq r2, [r5, #4]
    beq .Ldt28_01f0
    ldr r5, [r4, #4]
    ldr r7, [r5, #8]
    cmp r7, r4
    streq r2, [r5, #8]
    strne r2, [r5, #12]
.Ldt28_01f0:
    ldr r8, [r1, #16]
    ldr r5, [r8, #8]
    cmp r5, r4
    bne .Ldt28_0238
    ldr r5, [r4, #12]
    cmp r5, #0
    ldreq r5, [r4, #4]
    streq r5, [r8, #8]
    beq .Ldt28_0238
    ldr r7, [r2, #8]
    mov r5, r2
    cmp r7, #0
    beq .Ldt28_0234
.Ldt28_0224:
    mov r5, r7
    ldr r7, [r7, #8]
    cmp r7, #0
    bne .Ldt28_0224
.Ldt28_0234:
    str r5, [r8, #8]
.Ldt28_0238:
    ldr r5, [r1, #16]
    ldr r7, [r5, #12]
    cmp r7, r4
    bne .Ldt28_0280
    ldr r7, [r4, #8]
    cmp r7, #0
    ldreq r4, [r4, #4]
    streq r4, [r5, #12]
    beq .Ldt28_0280
    ldr r7, [r2, #12]
    mov r4, r2
    cmp r7, #0
    beq .Ldt28_027c
.Ldt28_026c:
    mov r4, r7
    ldr r7, [r7, #12]
    cmp r7, #0
    bne .Ldt28_026c
.Ldt28_027c:
    str r4, [r5, #12]
.Ldt28_0280:
    ldr r4, [r1, #16]
    cmp r4, r2
    ldrbne r4, [r3]
    cmpne r4, #0
    movne r5, #1
    beq .Ldt28_041c
    b .Ldt28_03fc
.Ldt28_029c:
    ldr r7, [r2, #4]
    ldr r4, [r7, #8]
    cmp r4, r2
    bne .Ldt28_04b0
    ldr r4, [r7, #12]
    cmp r4, #0
    beq .Ldt28_03d4
    ldrb r7, [r4]
    cmp r7, #0
    beq .Ldt28_0364
.Ldt28_02c4:
    ldr r7, [r4, #8]
    cmp r7, #0
    ldrbne r8, [r7]
    cmpne r8, #1
    beq .Ldt28_03e0
.Ldt28_02d8:
    ldr r8, [r4, #12]
    cmp r8, #0
    ldrbne r8, [r8]
    cmpne r8, #1
    beq .Ldt28_0440
.Ldt28_02ec:
    ldr r6, [r2, #4]
    ldrb r6, [r6]
    strb r6, [r4]
    ldr r6, [r2, #4]
    strb r5, [r6]
    ldr r4, [r4, #12]
    cmp r4, #0
    strbne r5, [r4]
    ldr r6, [r2, #4]
    ldr r4, [r6, #12]
    ldr r7, [r4, #8]
    str r7, [r6, #12]
    ldr r7, [r4, #8]
    cmp r7, #0
    strne r6, [r7, #4]
    ldr r7, [r6, #4]
    str r7, [r4, #4]
    ldr r7, [r1, #16]
    ldr r8, [r7, #4]
    cmp r8, r6
    streq r4, [r7, #4]
    beq .Ldt28_0358
    ldr r7, [r6, #4]
    ldr r8, [r7, #8]
    cmp r8, r6
    streq r4, [r7, #8]
    strne r4, [r7, #12]
.Ldt28_0358:
    str r6, [r4, #8]
    str r4, [r6, #4]
    b .Ldt28_0418
.Ldt28_0364:
    strb r5, [r4]
    ldr r4, [r2, #4]
    strb r6, [r4]
    ldr r4, [r2, #4]
    ldr r7, [r4, #12]
    ldr r8, [r7, #8]
    str r8, [r4, #12]
    ldr r8, [r7, #8]
    cmp r8, #0
    strne r4, [r8, #4]
    ldr r8, [r4, #4]
    str r8, [r7, #4]
    ldr r8, [r1, #16]
    ldr r9, [r8, #4]
    cmp r9, r4
    streq r7, [r8, #4]
    beq .Ldt28_03bc
    ldr r8, [r4, #4]
    ldr r9, [r8, #8]
    cmp r9, r4
    streq r7, [r8, #8]
    strne r7, [r8, #12]
.Ldt28_03bc:
    str r4, [r7, #8]
    str r7, [r4, #4]
    ldr r7, [r2, #4]
    ldr r4, [r7, #12]
    cmp r4, #0
    bne .Ldt28_02c4
.Ldt28_03d4:
    strb r6, [r2]
    mov r2, r7
    b .Ldt28_03fc
.Ldt28_03e0:
    ldr r8, [r4, #12]
    cmp r8, #0
    ldrbne r8, [r8]
    cmpne r8, #1
    bne .Ldt28_02d8
.Ldt28_03f4:
    strb r6, [r4]
    ldr r2, [r2, #4]
.Ldt28_03fc:
    ldr r4, [r1, #16]
    ldr r4, [r4, #4]
    cmp r4, r2
    beq .Ldt28_0418
    ldrb r4, [r2]
    cmp r4, #1
    beq .Ldt28_029c
.Ldt28_0418:
    strb r5, [r2]
.Ldt28_041c:
    ldr r2, [r1, #4]
    str r2, [r3, #12]
    str r3, [r1, #4]
    ldr r2, [r1, #20]
    sub r2, r2, #1
    str r2, [r1, #20]
    str ip, [r0]
.Ldt28_0438:
    pop {r4, r5, r6, r7, r8, r9}
    bx lr
.Ldt28_0440:
    cmp r7, #0
    strbne r5, [r7]
    strb r6, [r4]
    ldr r6, [r4, #8]
    ldr r7, [r6, #12]
    str r7, [r4, #8]
    ldr r7, [r6, #12]
    cmp r7, #0
    strne r4, [r7, #4]
    ldr r7, [r4, #4]
    str r7, [r6, #4]
    ldr r7, [r1, #16]
    ldr r8, [r7, #4]
    cmp r8, r4
    streq r6, [r7, #4]
    beq .Ldt28_0494
    ldr r7, [r4, #4]
    ldr r8, [r7, #12]
    cmp r8, r4
    streq r6, [r7, #12]
    strne r6, [r7, #8]
.Ldt28_0494:
    str r4, [r6, #12]
    str r6, [r4, #4]
    ldr r4, [r2, #4]
    ldr r4, [r4, #12]
    cmp r4, #0
    bne .Ldt28_02ec
    b .Ldt28_0418
.Ldt28_04b0:
    cmp r4, #0
    beq .Ldt28_03d4
    ldrb r7, [r4]
    cmp r7, #0
    beq .Ldt28_0564
.Ldt28_04c4:
    ldr r7, [r4, #12]
    cmp r7, #0
    ldrbne r8, [r7]
    cmpne r8, #1
    beq .Ldt28_05d8
.Ldt28_04d8:
    ldr r8, [r4, #8]
    cmp r8, #0
    ldrbne r8, [r8]
    cmpne r8, #1
    beq .Ldt28_05f0
.Ldt28_04ec:
    ldr r6, [r2, #4]
    ldrb r6, [r6]
    strb r6, [r4]
    ldr r6, [r2, #4]
    strb r5, [r6]
    ldr r4, [r4, #8]
    cmp r4, #0
    strbne r5, [r4]
    ldr r4, [r2, #4]
    ldr r6, [r4, #8]
    ldr r7, [r6, #12]
    str r7, [r4, #8]
    ldr r7, [r6, #12]
    cmp r7, #0
    strne r4, [r7, #4]
    ldr r7, [r4, #4]
    str r7, [r6, #4]
    ldr r7, [r1, #16]
    ldr r8, [r7, #4]
    cmp r8, r4
    streq r6, [r7, #4]
    beq .Ldt28_0558
    ldr r7, [r4, #4]
    ldr r8, [r7, #12]
    cmp r8, r4
    streq r6, [r7, #12]
    strne r6, [r7, #8]
.Ldt28_0558:
    str r4, [r6, #12]
    str r6, [r4, #4]
    b .Ldt28_0418
.Ldt28_0564:
    strb r5, [r4]
    ldr r4, [r2, #4]
    strb r6, [r4]
    ldr r4, [r2, #4]
    ldr r7, [r4, #8]
    ldr r8, [r7, #12]
    str r8, [r4, #8]
    ldr r8, [r7, #12]
    cmp r8, #0
    strne r4, [r8, #4]
    ldr r8, [r4, #4]
    str r8, [r7, #4]
    ldr r8, [r1, #16]
    ldr r9, [r8, #4]
    cmp r9, r4
    streq r7, [r8, #4]
    beq .Ldt28_05bc
    ldr r8, [r4, #4]
    ldr r9, [r8, #12]
    cmp r9, r4
    streq r7, [r8, #12]
    strne r7, [r8, #8]
.Ldt28_05bc:
    str r4, [r7, #12]
    str r7, [r4, #4]
    ldr r7, [r2, #4]
    ldr r4, [r7, #8]
    cmp r4, #0
    beq .Ldt28_03d4
    b .Ldt28_04c4
.Ldt28_05d8:
    ldr r8, [r4, #8]
    cmp r8, #0
    ldrbne r8, [r8]
    cmpne r8, #1
    bne .Ldt28_04d8
    b .Ldt28_03f4
.Ldt28_05f0:
    cmp r7, #0
    strbne r5, [r7]
    strb r6, [r4]
    ldr r6, [r4, #12]
    ldr r7, [r6, #8]
    str r7, [r4, #12]
    ldr r7, [r6, #8]
    cmp r7, #0
    strne r4, [r7, #4]
    ldr r7, [r4, #4]
    str r7, [r6, #4]
    ldr r7, [r1, #16]
    ldr r8, [r7, #4]
    cmp r8, r4
    streq r6, [r7, #4]
    beq .Ldt28_0644
    ldr r7, [r4, #4]
    ldr r8, [r7, #8]
    cmp r8, r4
    streq r6, [r7, #8]
    strne r6, [r7, #12]
.Ldt28_0644:
    str r4, [r6, #8]
    str r6, [r4, #4]
    ldr r4, [r2, #4]
    ldr r4, [r4, #8]
    cmp r4, #0
    bne .Ldt28_04ec
    b .Ldt28_0418
```

## Symbolic relocation and identity ledger

There are no symbolic identities, post-body literals, tables, calls, or
relocations in this batch. The 48 labels in the schedule are internal
control-flow destinations only. Each emitted copy is four-byte aligned and
contains exactly 408 ARM instructions.

## Independent full-body probe result

The complete mnemonic schedule above was independently assembled in ARM state.
The resulting 1,632-byte body was compared byte for byte with every listed
function's complete declared body.

| Template | Functions | Bytes each | Aggregate | Calls | Literal/table slots | Full-body result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Intrusive colored-tree erase/rebalance, variant B | 9 | 1,632 | 14,688 | 0 | 0 | 9/9 exact |
| **Total** | **9** |  | **14,688** | **0** | **0** | **9/9 exact; 14,688/14,688 bytes** |

The current objdiff report lists all nine functions as unmatched. A complete
scan of the public config/spec inventory found none of the names, and the
concurrent batch-27 IPC selection contains none of them. Thus the overlap with
exact functions and prior or concurrent work is zero.

## Exact-schedule cautions

- Preserve ARM state, four-byte function alignment, all 408 mnemonics, and the
  exact register choices.
- Keep `ip` as the saved original selected node; it is written to the result
  only after mutation completes.
- Keep `r6` as the zero/state-zero register in the main path. This variant's
  register allocation differs from the similar batch-27 template and is not
  safely interchangeable with it.
- Do not coalesce repeated container, parent, child, or byte-state loads.
  Several apparently redundant loads are part of the exact schedule.
- Preserve byte accesses for node state and word accesses for all links and
  the count.
- Preserve every condition suffix and its producing comparison, especially
  adjacent conditional byte loads, compares, moves, and stores.
- Preserve the early epilogue in the middle of the physical body and the
  forward repair blocks placed after it.
- Preserve `push {r4, r5, r6, r7, r8, r9}` and the matching `pop`; LR is
  intentionally not stacked because the function makes no calls.
- Keep all branch targets local. No target-generator normalization is
  permitted or required for this family.
