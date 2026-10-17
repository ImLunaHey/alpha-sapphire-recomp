# Probe-verified duplicate ARM templates 30

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
public manifest or specification through the current batch-29 worktree was
excluded before grouping. The concurrently selected IPC batch-28 and runtime
batch-29 functions were also excluded. This bounded batch contains one
complete-body group: exactly five ARM-state functions, each 1,900 bytes,
totaling 9,500 code bytes.

## Intrusive colored-tree range erase with cached first node

These ARM-state functions are identical over their complete bodies:

- `func_0055AB74`
- `func_0055B688`
- `func_0055D8F8`
- `func_0055E69C`
- `func_00560330`

Each body is exactly 1,900 bytes (475 fixed-width ARM instructions). The
function receives a writable result slot in `r0`, a tree/container record in
`r1`, a writable begin-iterator pointer in `r2`, and an end-iterator
pointer in `r3`. Tree nodes use a one-byte state at offset 0 and word-sized
parent, left-child, and right-child links at offsets 4, 8, and 12. The
container has a recycled-node chain at offset 4, a sentinel/header pointer at
offset 16, and a node count at offset 20.

The function erases the half-open node range beginning at the node initially
stored through `r2` and ending at the node stored through `r3`. It caches
the initial begin node in `ip`, detects the whole-tree case from the
sentinel's left link and the end iterator, and otherwise advances the writable
begin iterator in in-order traversal before unlinking each old node. Removal
repairs the one-byte colored-tree invariant with rotations and recoloring,
pushes the detached node onto the container's recycled-node chain, decrements
the count, and writes the next node to the result slot. A whole-tree fast path
recycles the current root subtree, restores the sentinel links and zero count,
and returns the sentinel.

There are no literal-pool slots, adjacent data tables, or data relocations.
All branches except the single helper call target body-local labels.

### Audited helper-call identities

At body offset 84, each function calls its corresponding already specified
and exact batch-11 recursive subtree recycler:

| Caller | Symbolic helper identity |
| --- | --- |
| `func_0055AB74` | `func_0055B2E0` |
| `func_0055B688` | `func_0055BDF4` |
| `func_0055D8F8` | `func_0055E1BC` |
| `func_0055E69C` | `func_0055EE08` |
| `func_00560330` | `func_00560A9C` |

For each target layout the helper begins immediately after the 1,900-byte
caller body. The implementation must emit a symbolic `bl` relocation to the
listed identity; it must not replace that identity with a numeric
displacement. The target-object normalizer may resolve only these five audited
symbolic relocations.

### Complete exact body schedule

This schedule is a reusable macro body whose `recycle_helper` parameter is
the function-specific identity in the table above. Labels are body-local and
must be uniquely scoped for every expansion.

```asm
    push	{r4, r5, r6, r7, r8, r9, sl, lr}
    mov	r6, r0
    mov	r4, r1
    mov	r7, #0
    ldr	r0, [r1, #16]
    str	r0, [r6]
    ldr	r1, [r1, #16]
    ldr	ip, [r2]
    ldr	r0, [r1, #8]
    cmp	ip, r0
    ldreq	r0, [r3]
    cmpeq	r0, r1
    bne .Ldt30_0098
    ldr	r0, [r4, #20]
    cmp	r0, #0
    beq .Ldt30_0098
    ldr	r5, [r1, #4]
    cmp	r5, #0
    beq .Ldt30_0070
.Ldt30_004c:
    ldr	r1, [r5, #12]
    mov	r0, r4
    bl \recycle_helper
    ldr	r2, [r4, #4]
    ldr	r1, [r5, #8]
    str	r2, [r5, #12]
    str	r5, [r4, #4]
    movs	r5, r1
    bne .Ldt30_004c
.Ldt30_0070:
    ldr	r0, [r4, #16]
    str	r0, [r0, #8]
    ldr	r0, [r4, #16]
    str	r7, [r0, #4]
    ldr	r0, [r4, #16]
    str	r0, [r0, #12]
    str	r7, [r4, #20]
    ldr	r0, [r4, #16]
    str	r0, [r6]
.Ldt30_0094:
    pop	{r4, r5, r6, r7, r8, r9, sl, pc}
.Ldt30_0098:
    ldr	r1, [r3]
    mov	r0, ip
    cmp	ip, r1
    movne	r8, #1
    beq .Ldt30_0094
.Ldt30_00ac:
    ldr	ip, [r0, #12]
    mov	r1, r0
    cmp	ip, #0
    movne	r1, ip
    strne	ip, [r2]
    beq .Ldt30_00d8
.Ldt30_00c4:
    ldr	r1, [r1, #8]
    cmp	r1, #0
    strne	r1, [r2]
    bne .Ldt30_00c4
    b .Ldt30_0114
.Ldt30_00d8:
    ldr	ip, [r0, #4]
    mov	lr, r1
    ldr	r1, [ip, #12]
    cmp	lr, r1
    bne .Ldt30_0104
.Ldt30_00ec:
    mov	r1, ip
    str	ip, [r2]
    ldr	ip, [ip, #4]
    ldr	lr, [ip, #12]
    cmp	r1, lr
    beq .Ldt30_00ec
.Ldt30_0104:
    ldr	r1, [r2]
    ldr	r1, [r1, #12]
    cmp	r1, ip
    strne	ip, [r2]
.Ldt30_0114:
    ldr	ip, [r4, #16]
    mov	r1, r0
    cmp	r0, ip
    moveq	r1, ip
    beq .Ldt30_0534
    ldr	ip, [r0, #12]
    cmp	ip, #0
    beq .Ldt30_0148
.Ldt30_0134:
    mov	r1, ip
    ldr	ip, [ip, #8]
    cmp	ip, #0
    bne .Ldt30_0134
    b .Ldt30_0178
.Ldt30_0148:
    ldr	ip, [r0, #4]
    ldr	r5, [ip, #12]
    cmp	r0, r5
    bne .Ldt30_016c
.Ldt30_0158:
    mov	r1, ip
    ldr	ip, [ip, #4]
    ldr	lr, [ip, #12]
    cmp	r1, lr
    beq .Ldt30_0158
.Ldt30_016c:
    ldr	lr, [r1, #12]
    cmp	lr, ip
    movne	r1, ip
.Ldt30_0178:
    ldr	lr, [r0, #8]
    ldr	ip, [r0, #12]
    mov	r5, r0
    cmp	lr, #0
    beq .Ldt30_0204
    cmp	ip, #0
    moveq	ip, lr
    beq .Ldt30_01bc
    mov	r0, ip
    ldr	ip, [ip, #8]
    cmp	ip, #0
    beq .Ldt30_01b8
.Ldt30_01a8:
    ldr	r0, [r0, #8]
    ldr	ip, [r0, #8]
    cmp	ip, #0
    bne .Ldt30_01a8
.Ldt30_01b8:
    ldr	ip, [r0, #12]
.Ldt30_01bc:
    cmp	r0, r5
    beq .Ldt30_02c8
    str	r0, [lr, #4]
    ldr	lr, [r5, #8]
    str	lr, [r0, #8]
    ldr	lr, [r5, #12]
    cmp	lr, r0
    beq .Ldt30_0270
    cmp	ip, #0
    ldrne	lr, [r0, #4]
    strne	lr, [ip, #4]
    ldr	lr, [r0, #4]
    str	ip, [lr, #8]
    ldr	lr, [r5, #12]
    str	lr, [r0, #12]
    ldr	lr, [r5, #12]
    str	r0, [lr, #4]
    b .Ldt30_0278
.Ldt30_0204:
    cmp	ip, #0
    bne .Ldt30_01bc
    ldr	ip, [r0, #4]
    ldr	lr, [r4, #16]
    cmp	lr, ip
    bne .Ldt30_0234
    str	ip, [lr, #12]
    ldr	lr, [r4, #16]
    str	ip, [lr, #8]
    ldr	lr, [r4, #16]
    str	r7, [lr, #4]
    b .Ldt30_0388
.Ldt30_0234:
    ldr	r5, [ip, #8]
    cmp	r5, r0
    bne .Ldt30_0258
    str	r7, [ip, #8]
    ldr	lr, [r4, #16]
    ldr	r9, [lr, #8]
    cmp	r9, r0
    streq	ip, [lr, #8]
    b .Ldt30_0388
.Ldt30_0258:
    str	r7, [ip, #12]
    ldr	lr, [r4, #16]
    ldr	r9, [lr, #12]
    cmp	r9, r0
    streq	ip, [lr, #12]
    b .Ldt30_0388
.Ldt30_0270:
    cmp	ip, #0
    strne	r0, [ip, #4]
.Ldt30_0278:
    ldr	lr, [r4, #16]
    ldr	r9, [lr, #4]
    cmp	r9, r5
    streq	r0, [lr, #4]
    beq .Ldt30_02a0
    ldr	lr, [r5, #4]
    ldr	r9, [lr, #8]
    cmp	r9, r5
    streq	r0, [lr, #8]
    strne	r0, [lr, #12]
.Ldt30_02a0:
    ldr	lr, [r5, #4]
    cmp	ip, #0
    moveq	ip, r0
    str	lr, [r0, #4]
    ldrb	r9, [r5]
    ldrb	lr, [r0]
    strb	r9, [r0]
    mov	r0, r5
    strb	lr, [r5]
    b .Ldt30_0388
.Ldt30_02c8:
    ldr	lr, [r0, #4]
    str	lr, [ip, #4]
    ldr	lr, [r4, #16]
    ldr	r9, [lr, #4]
    cmp	r9, r5
    streq	ip, [lr, #4]
    beq .Ldt30_02f8
    ldr	lr, [r5, #4]
    ldr	r9, [lr, #8]
    cmp	r9, r5
    streq	ip, [lr, #8]
    strne	ip, [lr, #12]
.Ldt30_02f8:
    ldr	r9, [r4, #16]
    ldr	lr, [r9, #8]
    cmp	lr, r5
    bne .Ldt30_0340
    ldr	lr, [r5, #12]
    cmp	lr, #0
    ldreq	lr, [r5, #4]
    streq	lr, [r9, #8]
    beq .Ldt30_0340
    ldr	sl, [ip, #8]
    mov	lr, ip
    cmp	sl, #0
    beq .Ldt30_033c
.Ldt30_032c:
    mov	lr, sl
    ldr	sl, [sl, #8]
    cmp	sl, #0
    bne .Ldt30_032c
.Ldt30_033c:
    str	lr, [r9, #8]
.Ldt30_0340:
    ldr	r9, [r4, #16]
    ldr	lr, [r9, #12]
    cmp	lr, r5
    bne .Ldt30_0388
    ldr	lr, [r5, #8]
    cmp	lr, #0
    ldreq	lr, [r5, #4]
    streq	lr, [r9, #12]
    beq .Ldt30_0388
    ldr	r5, [ip, #12]
    mov	lr, ip
    cmp	r5, #0
    beq .Ldt30_0384
.Ldt30_0374:
    mov	lr, r5
    ldr	r5, [r5, #12]
    cmp	r5, #0
    bne .Ldt30_0374
.Ldt30_0384:
    str	lr, [r9, #12]
.Ldt30_0388:
    ldr	lr, [r4, #16]
    cmp	lr, ip
    ldrbne	lr, [r0]
    cmpne	lr, #0
    beq .Ldt30_051c
    b .Ldt30_04fc
.Ldt30_03a0:
    ldr	r5, [ip, #4]
    ldr	lr, [r5, #8]
    cmp	lr, ip
    bne .Ldt30_05bc
    ldr	lr, [r5, #12]
    cmp	lr, #0
    beq .Ldt30_04d4
    ldrb	r5, [lr]
    cmp	r5, #0
    beq .Ldt30_0464
.Ldt30_03c8:
    ldr	r5, [lr, #8]
    cmp	r5, #0
    ldrbne	r9, [r5]
    cmpne	r9, #1
    beq .Ldt30_04e0
.Ldt30_03dc:
    ldr	r9, [lr, #12]
    cmp	r9, #0
    ldrbne	r9, [r9]
    cmpne	r9, #1
    beq .Ldt30_054c
.Ldt30_03f0:
    ldr	r5, [ip, #4]
    ldrb	r5, [r5]
    strb	r5, [lr]
    ldr	r5, [ip, #4]
    strb	r8, [r5]
    ldr	lr, [lr, #12]
    cmp	lr, #0
    strbne	r8, [lr]
    ldr	lr, [ip, #4]
    ldr	r5, [lr, #12]
    ldr	r9, [r5, #8]
    str	r9, [lr, #12]
    ldr	r9, [r5, #8]
    cmp	r9, #0
    strne	lr, [r9, #4]
    ldr	r9, [lr, #4]
    str	r9, [r5, #4]
    ldr	r9, [r4, #16]
    ldr	sl, [r9, #4]
    cmp	sl, lr
    streq	r5, [r9, #4]
    beq .Ldt30_045c
    ldr	r9, [lr, #4]
    ldr	sl, [r9, #8]
    cmp	sl, lr
    streq	r5, [r9, #8]
    strne	r5, [r9, #12]
.Ldt30_045c:
    str	lr, [r5, #8]
    b .Ldt30_0668
.Ldt30_0464:
    strb	r8, [lr]
    ldr	lr, [ip, #4]
    strb	r7, [lr]
    ldr	lr, [ip, #4]
    ldr	r5, [lr, #12]
    ldr	r9, [r5, #8]
    str	r9, [lr, #12]
    ldr	r9, [r5, #8]
    cmp	r9, #0
    strne	lr, [r9, #4]
    ldr	r9, [lr, #4]
    str	r9, [r5, #4]
    ldr	r9, [r4, #16]
    ldr	sl, [r9, #4]
    cmp	sl, lr
    streq	r5, [r9, #4]
    beq .Ldt30_04bc
    ldr	r9, [lr, #4]
    ldr	sl, [r9, #8]
    cmp	sl, lr
    streq	r5, [r9, #8]
    strne	r5, [r9, #12]
.Ldt30_04bc:
    str	lr, [r5, #8]
    str	r5, [lr, #4]
    ldr	r5, [ip, #4]
    ldr	lr, [r5, #12]
    cmp	lr, #0
    bne .Ldt30_03c8
.Ldt30_04d4:
    strb	r7, [ip]
    mov	ip, r5
    b .Ldt30_04fc
.Ldt30_04e0:
    ldr	r9, [lr, #12]
    cmp	r9, #0
    ldrbne	r9, [r9]
    cmpne	r9, #1
    bne .Ldt30_03dc
.Ldt30_04f4:
    strb	r7, [lr]
    ldr	ip, [ip, #4]
.Ldt30_04fc:
    ldr	lr, [r4, #16]
    ldr	lr, [lr, #4]
    cmp	lr, ip
    beq .Ldt30_0518
    ldrb	lr, [ip]
    cmp	lr, #1
    beq .Ldt30_03a0
.Ldt30_0518:
    strb	r8, [ip]
.Ldt30_051c:
    ldr	ip, [r4, #4]
    str	ip, [r0, #12]
    str	r0, [r4, #4]
    ldr	r0, [r4, #20]
    sub	r0, r0, #1
    str	r0, [r4, #20]
.Ldt30_0534:
    str	r1, [r6]
    ldr	r0, [r2]
    ldr	r1, [r3]
    cmp	r0, r1
    bne .Ldt30_00ac
    pop	{r4, r5, r6, r7, r8, r9, sl, pc}
.Ldt30_054c:
    cmp	r5, #0
    strbne	r8, [r5]
    strb	r7, [lr]
    ldr	r5, [lr, #8]
    ldr	r9, [r5, #12]
    str	r9, [lr, #8]
    ldr	r9, [r5, #12]
    cmp	r9, #0
    strne	lr, [r9, #4]
    ldr	r9, [lr, #4]
    str	r9, [r5, #4]
    ldr	r9, [r4, #16]
    ldr	sl, [r9, #4]
    cmp	sl, lr
    streq	r5, [r9, #4]
    beq .Ldt30_05a0
    ldr	r9, [lr, #4]
    ldr	sl, [r9, #12]
    cmp	sl, lr
    streq	r5, [r9, #12]
    strne	r5, [r9, #8]
.Ldt30_05a0:
    str	lr, [r5, #12]
    str	r5, [lr, #4]
    ldr	lr, [ip, #4]
    ldr	lr, [lr, #12]
    cmp	lr, #0
    bne .Ldt30_03f0
    b .Ldt30_0518
.Ldt30_05bc:
    cmp	lr, #0
    beq .Ldt30_04d4
    ldrb	r5, [lr]
    cmp	r5, #0
    beq .Ldt30_0670
.Ldt30_05d0:
    ldr	r9, [lr, #12]
    cmp	r9, #0
    ldrbne	r5, [r9]
    cmpne	r5, #1
    beq .Ldt30_06e4
.Ldt30_05e4:
    ldr	r5, [lr, #8]
    cmp	r5, #0
    ldrbne	r5, [r5]
    cmpne	r5, #1
    beq .Ldt30_06fc
.Ldt30_05f8:
    ldr	r5, [ip, #4]
    ldrb	r5, [r5]
    strb	r5, [lr]
    ldr	r5, [ip, #4]
    strb	r8, [r5]
    ldr	lr, [lr, #8]
    cmp	lr, #0
    strbne	r8, [lr]
    ldr	lr, [ip, #4]
    ldr	r5, [lr, #8]
    ldr	r9, [r5, #12]
    str	r9, [lr, #8]
    ldr	r9, [r5, #12]
    cmp	r9, #0
    strne	lr, [r9, #4]
    ldr	r9, [lr, #4]
    str	r9, [r5, #4]
    ldr	r9, [r4, #16]
    ldr	sl, [r9, #4]
    cmp	sl, lr
    streq	r5, [r9, #4]
    beq .Ldt30_0664
    ldr	r9, [lr, #4]
    ldr	sl, [r9, #12]
    cmp	sl, lr
    streq	r5, [r9, #12]
    strne	r5, [r9, #8]
.Ldt30_0664:
    str	lr, [r5, #12]
.Ldt30_0668:
    str	r5, [lr, #4]
    b .Ldt30_0518
.Ldt30_0670:
    strb	r8, [lr]
    ldr	lr, [ip, #4]
    strb	r7, [lr]
    ldr	lr, [ip, #4]
    ldr	r5, [lr, #8]
    ldr	r9, [r5, #12]
    str	r9, [lr, #8]
    ldr	r9, [r5, #12]
    cmp	r9, #0
    strne	lr, [r9, #4]
    ldr	r9, [lr, #4]
    str	r9, [r5, #4]
    ldr	r9, [r4, #16]
    ldr	sl, [r9, #4]
    cmp	sl, lr
    streq	r5, [r9, #4]
    beq .Ldt30_06c8
    ldr	r9, [lr, #4]
    ldr	sl, [r9, #12]
    cmp	sl, lr
    streq	r5, [r9, #12]
    strne	r5, [r9, #8]
.Ldt30_06c8:
    str	lr, [r5, #12]
    str	r5, [lr, #4]
    ldr	r5, [ip, #4]
    ldr	lr, [r5, #8]
    cmp	lr, #0
    beq .Ldt30_04d4
    b .Ldt30_05d0
.Ldt30_06e4:
    ldr	r5, [lr, #8]
    cmp	r5, #0
    ldrbne	r5, [r5]
    cmpne	r5, #1
    bne .Ldt30_05e4
    b .Ldt30_04f4
.Ldt30_06fc:
    cmp	r9, #0
    strbne	r8, [r9]
    strb	r7, [lr]
    ldr	r9, [lr, #12]
    ldr	r5, [r9, #8]
    str	r5, [lr, #12]
    ldr	r5, [r9, #8]
    cmp	r5, #0
    strne	lr, [r5, #4]
    ldr	r5, [lr, #4]
    str	r5, [r9, #4]
    ldr	r5, [r4, #16]
    ldr	sl, [r5, #4]
    cmp	sl, lr
    streq	r9, [r5, #4]
    beq .Ldt30_0750
    ldr	r5, [lr, #4]
    ldr	sl, [r5, #8]
    cmp	sl, lr
    streq	r9, [r5, #8]
    strne	r9, [r5, #12]
.Ldt30_0750:
    str	lr, [r9, #8]
    str	r9, [lr, #4]
    ldr	lr, [ip, #4]
    ldr	lr, [lr, #8]
    cmp	lr, #0
    bne .Ldt30_05f8
    b .Ldt30_0518
```

### Probe and overlap audit

The complete mnemonic schedule above was independently assembled in ARM mode
with `-march=armv6k -mcpu=mpcore`. Its 1,900-byte body matched all five
selected target bodies byte-for-byte. The probe has no relocations because its
temporary helper label was placed at the audited post-body location; repository
source must instead preserve the symbolic helper identity.

A second complete-body comparison established that all five target bodies are
identical. Before this implementation, none was exact in the objdiff report or
appeared in an existing public manifest or specification, and none overlapped
the concurrently reserved IPC batch-28 or runtime batch-29 selections. All
five are now exact. The five helper bodies are already exact batch-11 functions
and are not members of this batch.

## Implementation contract and cautions

- Emit each listed function as ARM state, 4-byte aligned, and exactly 1,900
  bytes long.
- Preserve the literal instruction order, register choices, conditions, and
  byte-versus-word access widths in the schedule.
- Keep the initial begin node cached in `ip`; the non-whole-tree entry sets
  `r8` only on the `movne` path, while equality returns through the existing
  fast-path pop.
- Preserve the explicit post-removal reloads of `[r2]` and `[r3]`, compare,
  conditional back edge, and pop sequence at offsets 1336 through 1352.
- Do not symmetrize the late left/right repair cases: the `r5`/`r9`
  allocation and the child offsets intentionally differ in the final repair
  blocks.
- Keep the helper call symbolic and restricted to the caller/helper pairs
  above. No literal pool or synthetic padding is permitted.
- A validator should enforce the function set, ARM mode, exact size, absence
  of literal/data slots, exactly one call at offset 84, and the five audited
  helper identities.
