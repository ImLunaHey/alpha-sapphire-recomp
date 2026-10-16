# Probe-verified duplicate ARM templates 29

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body duplicate grouping, control/data-flow inspection, and
  independent GNU Arm mnemonic probes.
- Probe toolchain: GNU Arm assembler, objdump, and objcopy 2.45.1.20251203
  from GCC Arm Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, extracted assets, private absolute
  addresses, implementation source, or proprietary source.

Every function exact in the current report and every function named by a
public manifest or specification through batch 28 was excluded before
grouping. The concurrently selected IPC and runtime functions were also
excluded. This bounded batch contains one complete-body group: exactly
five ARM-state functions, each 1,884 bytes, totaling 9,420 code bytes.

## Intrusive colored-tree range erase with whole-tree fast path

These ARM-state functions are identical over their complete bodies:

- `func_0055F81C`
- `func_00562CF4`
- `func_00563808`
- `func_0056431C`
- `func_00565844`

Each body is exactly 1,884 bytes (471 fixed-width ARM instructions). The
function receives a writable result slot in `r0`, a tree/container record in
`r1`, a writable begin-iterator pointer in `r2`, and an end-iterator
pointer in `r3`. Tree nodes use a one-byte state at offset 0 and word-sized
parent, left-child, and right-child links at offsets 4, 8, and 12. The
container has a recycled-node chain at offset 4, a sentinel/header pointer at
offset 16, and a node count at offset 20.

The function erases the half-open node range beginning at the node stored
through `r2` and ending at the node stored through `r3`. It repeatedly
computes and writes the next in-order node, unlinks the prior node, repairs
the one-byte colored-tree invariant with rotations and recoloring, pushes the
detached node onto the container's recycled-node chain, decrements the count,
and updates the result slot. A whole-tree fast path recycles the current root
subtree, restores the sentinel links and zero count, and returns the
sentinel.

There are no literal-pool slots, adjacent data tables, or data relocations.
All branches except the single helper call target body-local labels.

### Audited helper-call identities

At body offset 84, each function calls its corresponding already specified
and exact batch-11 recursive subtree recycler. These five call identities are
distinct even though the helper bodies have a common shape:

| Caller | Symbolic helper identity |
| --- | --- |
| `func_0055F81C` | `func_0055FF78` |
| `func_00562CF4` | `func_00563450` |
| `func_00563808` | `func_00563F64` |
| `func_0056431C` | `func_00564A78` |
| `func_00565844` | `func_00565FA0` |

For each target layout the helper begins immediately after the 1,884-byte
caller body. The implementation must emit a symbolic `bl` relocation to the
listed identity; it must not replace the identity with a numeric displacement.
The target-object normalizer may resolve only these five audited symbolic
relocations.

### Complete exact body schedule

This schedule is a reusable macro body whose `recycle_helper` parameter is
the function-specific identity in the table above. Labels are body-local and
must be uniquely scoped for every expansion.

```asm
    push {r4, r5, r6, r7, r8, r9, sl, lr}
    mov r6, r0
    mov r4, r1
    mov r7, #0
    ldr r0, [r1, #16]
    str r0, [r6]
    ldr r0, [r1, #16]
    ldr ip, [r2]
    ldr r1, [r0, #8]
    cmp ip, r1
    ldreq r1, [r3]
    cmpeq r1, r0
    bne .Ldt29_0098
    ldr r1, [r4, #20]
    cmp r1, #0
    beq .Ldt29_0098
    ldr r5, [r0, #4]
    cmp r5, #0
    beq .Ldt29_0070
.Ldt29_004c:
    ldr r1, [r5, #12]
    mov r0, r4
    bl \recycle_helper
    ldr r2, [r4, #4]
    ldr r1, [r5, #8]
    str r2, [r5, #12]
    str r5, [r4, #4]
    movs r5, r1
    bne .Ldt29_004c
.Ldt29_0070:
    ldr r0, [r4, #16]
    str r0, [r0, #8]
    ldr r0, [r4, #16]
    str r7, [r0, #4]
    ldr r0, [r4, #16]
    str r0, [r0, #12]
    str r7, [r4, #20]
    ldr r0, [r4, #16]
    str r0, [r6]
.Ldt29_0094:
    pop {r4, r5, r6, r7, r8, r9, sl, pc}
.Ldt29_0098:
    mov r8, #1
.Ldt29_009c:
    ldr r1, [r3]
    ldr r0, [r2]
    cmp r0, r1
    beq .Ldt29_0094
    ldr ip, [r0, #12]
    mov r1, r0
    cmp ip, #0
    movne r1, ip
    strne ip, [r2]
    beq .Ldt29_00d8
.Ldt29_00c4:
    ldr r1, [r1, #8]
    cmp r1, #0
    strne r1, [r2]
    bne .Ldt29_00c4
    b .Ldt29_0114
.Ldt29_00d8:
    ldr ip, [r0, #4]
    mov lr, r1
    ldr r1, [ip, #12]
    cmp lr, r1
    bne .Ldt29_0104
.Ldt29_00ec:
    mov r1, ip
    str ip, [r2]
    ldr ip, [ip, #4]
    ldr lr, [ip, #12]
    cmp r1, lr
    beq .Ldt29_00ec
.Ldt29_0104:
    ldr r1, [r2]
    ldr r1, [r1, #12]
    cmp r1, ip
    strne ip, [r2]
.Ldt29_0114:
    ldr ip, [r4, #16]
    mov r1, r0
    cmp r0, ip
    moveq r1, ip
    beq .Ldt29_0534
    ldr ip, [r0, #12]
    cmp ip, #0
    beq .Ldt29_0148
.Ldt29_0134:
    mov r1, ip
    ldr ip, [ip, #8]
    cmp ip, #0
    bne .Ldt29_0134
    b .Ldt29_0178
.Ldt29_0148:
    ldr ip, [r0, #4]
    ldr r5, [ip, #12]
    cmp r0, r5
    bne .Ldt29_016c
.Ldt29_0158:
    mov r1, ip
    ldr ip, [ip, #4]
    ldr lr, [ip, #12]
    cmp r1, lr
    beq .Ldt29_0158
.Ldt29_016c:
    ldr lr, [r1, #12]
    cmp lr, ip
    movne r1, ip
.Ldt29_0178:
    ldr lr, [r0, #8]
    ldr ip, [r0, #12]
    mov r5, r0
    cmp lr, #0
    beq .Ldt29_0204
    cmp ip, #0
    moveq ip, lr
    beq .Ldt29_01bc
    mov r0, ip
    ldr ip, [ip, #8]
    cmp ip, #0
    beq .Ldt29_01b8
.Ldt29_01a8:
    ldr r0, [r0, #8]
    ldr ip, [r0, #8]
    cmp ip, #0
    bne .Ldt29_01a8
.Ldt29_01b8:
    ldr ip, [r0, #12]
.Ldt29_01bc:
    cmp r0, r5
    beq .Ldt29_02c8
    str r0, [lr, #4]
    ldr lr, [r5, #8]
    str lr, [r0, #8]
    ldr lr, [r5, #12]
    cmp lr, r0
    beq .Ldt29_0270
    cmp ip, #0
    ldrne lr, [r0, #4]
    strne lr, [ip, #4]
    ldr lr, [r0, #4]
    str ip, [lr, #8]
    ldr lr, [r5, #12]
    str lr, [r0, #12]
    ldr lr, [r5, #12]
    str r0, [lr, #4]
    b .Ldt29_0278
.Ldt29_0204:
    cmp ip, #0
    bne .Ldt29_01bc
    ldr ip, [r0, #4]
    ldr lr, [r4, #16]
    cmp lr, ip
    bne .Ldt29_0234
    str ip, [lr, #12]
    ldr lr, [r4, #16]
    str ip, [lr, #8]
    ldr lr, [r4, #16]
    str r7, [lr, #4]
    b .Ldt29_0388
.Ldt29_0234:
    ldr r5, [ip, #8]
    cmp r5, r0
    bne .Ldt29_0258
    str r7, [ip, #8]
    ldr lr, [r4, #16]
    ldr r9, [lr, #8]
    cmp r9, r0
    streq ip, [lr, #8]
    b .Ldt29_0388
.Ldt29_0258:
    str r7, [ip, #12]
    ldr lr, [r4, #16]
    ldr r9, [lr, #12]
    cmp r9, r0
    streq ip, [lr, #12]
    b .Ldt29_0388
.Ldt29_0270:
    cmp ip, #0
    strne r0, [ip, #4]
.Ldt29_0278:
    ldr lr, [r4, #16]
    ldr r9, [lr, #4]
    cmp r9, r5
    streq r0, [lr, #4]
    beq .Ldt29_02a0
    ldr lr, [r5, #4]
    ldr r9, [lr, #8]
    cmp r9, r5
    streq r0, [lr, #8]
    strne r0, [lr, #12]
.Ldt29_02a0:
    ldr lr, [r5, #4]
    cmp ip, #0
    moveq ip, r0
    str lr, [r0, #4]
    ldrb r9, [r5]
    ldrb lr, [r0]
    strb r9, [r0]
    mov r0, r5
    strb lr, [r5]
    b .Ldt29_0388
.Ldt29_02c8:
    ldr lr, [r0, #4]
    str lr, [ip, #4]
    ldr lr, [r4, #16]
    ldr r9, [lr, #4]
    cmp r9, r5
    streq ip, [lr, #4]
    beq .Ldt29_02f8
    ldr lr, [r5, #4]
    ldr r9, [lr, #8]
    cmp r9, r5
    streq ip, [lr, #8]
    strne ip, [lr, #12]
.Ldt29_02f8:
    ldr r9, [r4, #16]
    ldr lr, [r9, #8]
    cmp lr, r5
    bne .Ldt29_0340
    ldr lr, [r5, #12]
    cmp lr, #0
    ldreq lr, [r5, #4]
    streq lr, [r9, #8]
    beq .Ldt29_0340
    ldr sl, [ip, #8]
    mov lr, ip
    cmp sl, #0
    beq .Ldt29_033c
.Ldt29_032c:
    mov lr, sl
    ldr sl, [sl, #8]
    cmp sl, #0
    bne .Ldt29_032c
.Ldt29_033c:
    str lr, [r9, #8]
.Ldt29_0340:
    ldr r9, [r4, #16]
    ldr lr, [r9, #12]
    cmp lr, r5
    bne .Ldt29_0388
    ldr lr, [r5, #8]
    cmp lr, #0
    ldreq lr, [r5, #4]
    streq lr, [r9, #12]
    beq .Ldt29_0388
    ldr r5, [ip, #12]
    mov lr, ip
    cmp r5, #0
    beq .Ldt29_0384
.Ldt29_0374:
    mov lr, r5
    ldr r5, [r5, #12]
    cmp r5, #0
    bne .Ldt29_0374
.Ldt29_0384:
    str lr, [r9, #12]
.Ldt29_0388:
    ldr lr, [r4, #16]
    cmp lr, ip
    ldrbne lr, [r0]
    cmpne lr, #0
    beq .Ldt29_051c
    b .Ldt29_04fc
.Ldt29_03a0:
    ldr r5, [ip, #4]
    ldr lr, [r5, #8]
    cmp lr, ip
    bne .Ldt29_05ac
    ldr lr, [r5, #12]
    cmp lr, #0
    beq .Ldt29_04d4
    ldrb r5, [lr]
    cmp r5, #0
    beq .Ldt29_0464
.Ldt29_03c8:
    ldr r5, [lr, #8]
    cmp r5, #0
    ldrbne r9, [r5]
    cmpne r9, #1
    beq .Ldt29_04e0
.Ldt29_03dc:
    ldr r9, [lr, #12]
    cmp r9, #0
    ldrbne r9, [r9]
    cmpne r9, #1
    beq .Ldt29_053c
.Ldt29_03f0:
    ldr r5, [ip, #4]
    ldrb r5, [r5]
    strb r5, [lr]
    ldr r5, [ip, #4]
    strb r8, [r5]
    ldr lr, [lr, #12]
    cmp lr, #0
    strbne r8, [lr]
    ldr lr, [ip, #4]
    ldr r5, [lr, #12]
    ldr r9, [r5, #8]
    str r9, [lr, #12]
    ldr r9, [r5, #8]
    cmp r9, #0
    strne lr, [r9, #4]
    ldr r9, [lr, #4]
    str r9, [r5, #4]
    ldr r9, [r4, #16]
    ldr sl, [r9, #4]
    cmp sl, lr
    streq r5, [r9, #4]
    beq .Ldt29_045c
    ldr r9, [lr, #4]
    ldr sl, [r9, #8]
    cmp sl, lr
    streq r5, [r9, #8]
    strne r5, [r9, #12]
.Ldt29_045c:
    str lr, [r5, #8]
    b .Ldt29_0658
.Ldt29_0464:
    strb r8, [lr]
    ldr lr, [ip, #4]
    strb r7, [lr]
    ldr lr, [ip, #4]
    ldr r5, [lr, #12]
    ldr r9, [r5, #8]
    str r9, [lr, #12]
    ldr r9, [r5, #8]
    cmp r9, #0
    strne lr, [r9, #4]
    ldr r9, [lr, #4]
    str r9, [r5, #4]
    ldr r9, [r4, #16]
    ldr sl, [r9, #4]
    cmp sl, lr
    streq r5, [r9, #4]
    beq .Ldt29_04bc
    ldr r9, [lr, #4]
    ldr sl, [r9, #8]
    cmp sl, lr
    streq r5, [r9, #8]
    strne r5, [r9, #12]
.Ldt29_04bc:
    str lr, [r5, #8]
    str r5, [lr, #4]
    ldr r5, [ip, #4]
    ldr lr, [r5, #12]
    cmp lr, #0
    bne .Ldt29_03c8
.Ldt29_04d4:
    strb r7, [ip]
    mov ip, r5
    b .Ldt29_04fc
.Ldt29_04e0:
    ldr r9, [lr, #12]
    cmp r9, #0
    ldrbne r9, [r9]
    cmpne r9, #1
    bne .Ldt29_03dc
.Ldt29_04f4:
    strb r7, [lr]
    ldr ip, [ip, #4]
.Ldt29_04fc:
    ldr lr, [r4, #16]
    ldr lr, [lr, #4]
    cmp lr, ip
    beq .Ldt29_0518
    ldrb lr, [ip]
    cmp lr, #1
    beq .Ldt29_03a0
.Ldt29_0518:
    strb r8, [ip]
.Ldt29_051c:
    ldr ip, [r4, #4]
    str ip, [r0, #12]
    str r0, [r4, #4]
    ldr r0, [r4, #20]
    sub r0, r0, #1
    str r0, [r4, #20]
.Ldt29_0534:
    str r1, [r6]
    b .Ldt29_009c
.Ldt29_053c:
    cmp r5, #0
    strbne r8, [r5]
    strb r7, [lr]
    ldr r5, [lr, #8]
    ldr r9, [r5, #12]
    str r9, [lr, #8]
    ldr r9, [r5, #12]
    cmp r9, #0
    strne lr, [r9, #4]
    ldr r9, [lr, #4]
    str r9, [r5, #4]
    ldr r9, [r4, #16]
    ldr sl, [r9, #4]
    cmp sl, lr
    streq r5, [r9, #4]
    beq .Ldt29_0590
    ldr r9, [lr, #4]
    ldr sl, [r9, #12]
    cmp sl, lr
    streq r5, [r9, #12]
    strne r5, [r9, #8]
.Ldt29_0590:
    str lr, [r5, #12]
    str r5, [lr, #4]
    ldr lr, [ip, #4]
    ldr lr, [lr, #12]
    cmp lr, #0
    bne .Ldt29_03f0
    b .Ldt29_0518
.Ldt29_05ac:
    cmp lr, #0
    beq .Ldt29_04d4
    ldrb r5, [lr]
    cmp r5, #0
    beq .Ldt29_0660
.Ldt29_05c0:
    ldr r5, [lr, #12]
    cmp r5, #0
    ldrbne r9, [r5]
    cmpne r9, #1
    beq .Ldt29_06d4
.Ldt29_05d4:
    ldr r9, [lr, #8]
    cmp r9, #0
    ldrbne r9, [r9]
    cmpne r9, #1
    beq .Ldt29_06ec
.Ldt29_05e8:
    ldr r5, [ip, #4]
    ldrb r5, [r5]
    strb r5, [lr]
    ldr r5, [ip, #4]
    strb r8, [r5]
    ldr lr, [lr, #8]
    cmp lr, #0
    strbne r8, [lr]
    ldr lr, [ip, #4]
    ldr r5, [lr, #8]
    ldr r9, [r5, #12]
    str r9, [lr, #8]
    ldr r9, [r5, #12]
    cmp r9, #0
    strne lr, [r9, #4]
    ldr r9, [lr, #4]
    str r9, [r5, #4]
    ldr r9, [r4, #16]
    ldr sl, [r9, #4]
    cmp sl, lr
    streq r5, [r9, #4]
    beq .Ldt29_0654
    ldr r9, [lr, #4]
    ldr sl, [r9, #12]
    cmp sl, lr
    streq r5, [r9, #12]
    strne r5, [r9, #8]
.Ldt29_0654:
    str lr, [r5, #12]
.Ldt29_0658:
    str r5, [lr, #4]
    b .Ldt29_0518
.Ldt29_0660:
    strb r8, [lr]
    ldr lr, [ip, #4]
    strb r7, [lr]
    ldr lr, [ip, #4]
    ldr r5, [lr, #8]
    ldr r9, [r5, #12]
    str r9, [lr, #8]
    ldr r9, [r5, #12]
    cmp r9, #0
    strne lr, [r9, #4]
    ldr r9, [lr, #4]
    str r9, [r5, #4]
    ldr r9, [r4, #16]
    ldr sl, [r9, #4]
    cmp sl, lr
    streq r5, [r9, #4]
    beq .Ldt29_06b8
    ldr r9, [lr, #4]
    ldr sl, [r9, #12]
    cmp sl, lr
    streq r5, [r9, #12]
    strne r5, [r9, #8]
.Ldt29_06b8:
    str lr, [r5, #12]
    str r5, [lr, #4]
    ldr r5, [ip, #4]
    ldr lr, [r5, #8]
    cmp lr, #0
    beq .Ldt29_04d4
    b .Ldt29_05c0
.Ldt29_06d4:
    ldr r9, [lr, #8]
    cmp r9, #0
    ldrbne r9, [r9]
    cmpne r9, #1
    bne .Ldt29_05d4
    b .Ldt29_04f4
.Ldt29_06ec:
    cmp r5, #0
    strbne r8, [r5]
    strb r7, [lr]
    ldr r5, [lr, #12]
    ldr r9, [r5, #8]
    str r9, [lr, #12]
    ldr r9, [r5, #8]
    cmp r9, #0
    strne lr, [r9, #4]
    ldr r9, [lr, #4]
    str r9, [r5, #4]
    ldr r9, [r4, #16]
    ldr sl, [r9, #4]
    cmp sl, lr
    streq r5, [r9, #4]
    beq .Ldt29_0740
    ldr r9, [lr, #4]
    ldr sl, [r9, #8]
    cmp sl, lr
    streq r5, [r9, #8]
    strne r5, [r9, #12]
.Ldt29_0740:
    str lr, [r5, #8]
    str r5, [lr, #4]
    ldr lr, [ip, #4]
    ldr lr, [lr, #8]
    cmp lr, #0
    bne .Ldt29_05e8
    b .Ldt29_0518
```

## Exact-probe result

The complete schedule was independently assembled in ARM state with the
helper label placed immediately after the body, matching the observed target
layout. The first 1,884 output bytes match each of the five complete target
bodies exactly: 5/5 functions, 471/471 instructions per function, and
9,420/9,420 code bytes for the group. The five target bodies are mutually
identical over their complete extents.

## Overlap audit and implementation cautions

- None of the five caller functions appears in a public manifest or
  specification through batch 28, and none is exact in the report used for
  selection.
- The five helper identities are intentionally reused from batch 11 and must
  not be reimplemented or counted as batch-29 functions.
- Preserve all repeated loads, conditional instructions, byte store widths,
  register choices, and physical instruction order. High-level equivalent
  tree code is unlikely to encode identically.
- Preserve the early whole-tree path and its helper call at body offset 84.
  The call is a symbolic cross-function relocation, not a local branch.
- Keep every rotation/recolor branch exactly as scheduled, including the
  long forward and backward branches. Adding veneers or splitting the body
  changes branch encodings.
- The schedule uses `sl` as the architectural alias for `r10`; either
  spelling is acceptable only if the emitted instruction is unchanged.
