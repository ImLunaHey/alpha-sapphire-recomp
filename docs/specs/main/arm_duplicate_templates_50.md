# Probe-verified duplicate ARM templates 50

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated function inventory, current objdiff report,
  complete-body structural grouping, bounded private-target control/data-flow
  inspection, section relocation inspection, and an independent GNU Arm
  Embedded 15.2 mnemonic-only exact-body probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, extracted assets, private absolute
  addresses, private literal values, implementation source, or proprietary
  source.

Functions already exact in the current report and functions named by any
existing tracked implementation contract were excluded. The concurrent IPC
batch 46 reservation was also excluded. These five functions are byte-identical
ARM bodies of 1,628 bytes each, totalling 8,140 executable bytes:

```text
func_0054FD38  func_00550510  func_0055C19C  func_00566F04  func_005691BC
```

## Observable contract

This is an intrusive red-black-tree erase and rebalance primitive. Its three
arguments are an output iterator/pointer cell in `r0`, a tree/container in
`r1`, and an iterator-like cell in `r2` whose word selects the node to
erase. The node layout used by the routine is:

| Offset | Meaning |
| ---: | --- |
| +0 | one-byte color/state flag |
| +4 | parent link |
| +8 | left-child link |
| +12 | right-child link |

The container supplies its sentinel/header node at offset +16, its root-facing
link at +4, and its element count at +20. If the selected node is the sentinel,
the routine writes the sentinel to the output and returns without changing the
tree.

Otherwise it first computes the selected node's in-order successor. It then
performs the standard intrusive red-black-tree erase: choose the selected node
or its successor as the physical removal node, splice its sole child when
present, transplant links when the successor differs from the selected node,
preserve/swap the color state as required, and repair the container header's
root/leftmost/rightmost links. If a black node was physically removed, the
routine executes the complete sibling-based deletion fix-up, with symmetric
left-child and right-child cases and the usual recolor/near-child/far-child
rotations. Null child links are legal and deliberately tested before stores;
the header/sentinel comparisons and the exact faulting behavior of all other
pointer dereferences are normative.

On completion the routine restores the six saved registers, writes the
precomputed successor to the output cell, decrements the container's element
count by one, and returns. It makes no direct or indirect calls, has no literal
pool, and emits no relocations.

## Boundaries and template identity

Each symbol is ARM, exactly 1,628 bytes and 407 instructions. The next global
begins immediately at +1,628:

| Function | Next global |
| --- | --- |
| `func_0054FD38` | `func_00550394` |
| `func_00550510` | `func_00550B6C` |
| `func_0055C19C` | `func_0055C7F8` |
| `func_00566F04` | `func_00567560` |
| `func_005691BC` | `func_00569818` |

All 49 branch destinations are local to the body. No bytes after `.size` are
owned by this template. The complete schedule below is normative; macro-local
labels are required so all five expansions can coexist.

## Complete exact schedule

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT50_ERASE name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name, %function
\name:
    push	{r4, r5, r6, r7, r8, r9}
    ldr	ip, [r2]
    ldr	r3, [r1, #16]
    cmp	ip, r3
    streq	r3, [r0]
    beq	.Ldt50_434\@
    ldr	r3, [ip, #12]
    cmp	r3, #0
    beq	.Ldt50_38\@
.Ldt50_24\@:
    mov	ip, r3
    ldr	r3, [r3, #8]
    cmp	r3, #0
    bne	.Ldt50_24\@
    b	.Ldt50_68\@
.Ldt50_38\@:
    ldr	r3, [ip, #4]
    ldr	r5, [r3, #12]
    cmp	ip, r5
    bne	.Ldt50_5c\@
.Ldt50_48\@:
    mov	ip, r3
    ldr	r3, [r3, #4]
    ldr	r4, [r3, #12]
    cmp	ip, r4
    beq	.Ldt50_48\@
.Ldt50_5c\@:
    ldr	r4, [ip, #12]
    cmp	r4, r3
    movne	ip, r3
.Ldt50_68\@:
    ldr	r4, [r2]
    mov	r7, #0
    mov	r3, r4
    ldr	r5, [r4, #8]
    ldr	r2, [r4, #12]
    cmp	r5, #0
    beq	.Ldt50_fc\@
    cmp	r2, #0
    moveq	r2, r5
    beq	.Ldt50_b4\@
    mov	r3, r2
    ldr	r2, [r2, #8]
    cmp	r2, #0
    beq	.Ldt50_b0\@
.Ldt50_a0\@:
    ldr	r3, [r3, #8]
    ldr	r2, [r3, #8]
    cmp	r2, #0
    bne	.Ldt50_a0\@
.Ldt50_b0\@:
    ldr	r2, [r3, #12]
.Ldt50_b4\@:
    cmp	r3, r4
    beq	.Ldt50_1c0\@
    str	r3, [r5, #4]
    ldr	r5, [r4, #8]
    str	r5, [r3, #8]
    ldr	r5, [r4, #12]
    cmp	r5, r3
    beq	.Ldt50_168\@
    cmp	r2, #0
    ldrne	r5, [r3, #4]
    strne	r5, [r2, #4]
    ldr	r5, [r3, #4]
    str	r2, [r5, #8]
    ldr	r5, [r4, #12]
    str	r5, [r3, #12]
    ldr	r5, [r4, #12]
    str	r3, [r5, #4]
    b	.Ldt50_170\@
.Ldt50_fc\@:
    cmp	r2, #0
    bne	.Ldt50_b4\@
    ldr	r2, [r3, #4]
    ldr	r4, [r1, #16]
    cmp	r4, r2
    bne	.Ldt50_12c\@
    str	r2, [r4, #12]
    ldr	r4, [r1, #16]
    str	r2, [r4, #8]
    ldr	r4, [r1, #16]
    str	r7, [r4, #4]
    b	.Ldt50_280\@
.Ldt50_12c\@:
    ldr	r4, [r2, #8]
    cmp	r4, r3
    bne	.Ldt50_150\@
    str	r7, [r2, #8]
    ldr	r4, [r1, #16]
    ldr	r5, [r4, #8]
    cmp	r5, r3
    streq	r2, [r4, #8]
    b	.Ldt50_280\@
.Ldt50_150\@:
    str	r7, [r2, #12]
    ldr	r4, [r1, #16]
    ldr	r6, [r4, #12]
    cmp	r6, r3
    streq	r2, [r4, #12]
    b	.Ldt50_280\@
.Ldt50_168\@:
    cmp	r2, #0
    strne	r3, [r2, #4]
.Ldt50_170\@:
    ldr	r5, [r1, #16]
    ldr	r6, [r5, #4]
    cmp	r6, r4
    streq	r3, [r5, #4]
    beq	.Ldt50_198\@
    ldr	r5, [r4, #4]
    ldr	r6, [r5, #8]
    cmp	r6, r4
    streq	r3, [r5, #8]
    strne	r3, [r5, #12]
.Ldt50_198\@:
    ldr	r5, [r4, #4]
    cmp	r2, #0
    moveq	r2, r3
    str	r5, [r3, #4]
    ldrb	r6, [r4]
    ldrb	r5, [r3]
    strb	r6, [r3]
    mov	r3, r4
    strb	r5, [r4]
    b	.Ldt50_280\@
.Ldt50_1c0\@:
    ldr	r5, [r3, #4]
    str	r5, [r2, #4]
    ldr	r5, [r1, #16]
    ldr	r6, [r5, #4]
    cmp	r6, r4
    streq	r2, [r5, #4]
    beq	.Ldt50_1f0\@
    ldr	r5, [r4, #4]
    ldr	r6, [r5, #8]
    cmp	r6, r4
    streq	r2, [r5, #8]
    strne	r2, [r5, #12]
.Ldt50_1f0\@:
    ldr	r6, [r1, #16]
    ldr	r5, [r6, #8]
    cmp	r5, r4
    bne	.Ldt50_238\@
    ldr	r5, [r4, #12]
    cmp	r5, #0
    ldreq	r5, [r4, #4]
    streq	r5, [r6, #8]
    beq	.Ldt50_238\@
    ldr	r8, [r2, #8]
    mov	r5, r2
    cmp	r8, #0
    beq	.Ldt50_234\@
.Ldt50_224\@:
    mov	r5, r8
    ldr	r8, [r8, #8]
    cmp	r8, #0
    bne	.Ldt50_224\@
.Ldt50_234\@:
    str	r5, [r6, #8]
.Ldt50_238\@:
    ldr	r5, [r1, #16]
    ldr	r6, [r5, #12]
    cmp	r6, r4
    bne	.Ldt50_280\@
    ldr	r6, [r4, #8]
    cmp	r6, #0
    ldreq	r4, [r4, #4]
    streq	r4, [r5, #12]
    beq	.Ldt50_280\@
    ldr	r6, [r2, #12]
    mov	r4, r2
    cmp	r6, #0
    beq	.Ldt50_27c\@
.Ldt50_26c\@:
    mov	r4, r6
    ldr	r6, [r6, #12]
    cmp	r6, #0
    bne	.Ldt50_26c\@
.Ldt50_27c\@:
    str	r4, [r5, #12]
.Ldt50_280\@:
    ldr	r4, [r1, #16]
    cmp	r4, r2
    ldrbne	r4, [r3]
    cmpne	r4, #0
    movne	r6, #1
    beq	.Ldt50_418\@
    b	.Ldt50_3f8\@
.Ldt50_29c\@:
    ldr	r5, [r2, #4]
    ldr	r4, [r5, #8]
    cmp	r4, r2
    bne	.Ldt50_4ac\@
    ldr	r4, [r5, #12]
    cmp	r4, #0
    beq	.Ldt50_3d0\@
    ldrb	r5, [r4]
    cmp	r5, #0
    beq	.Ldt50_360\@
.Ldt50_2c4\@:
    ldr	r5, [r4, #8]
    cmp	r5, #0
    ldrbne	r8, [r5]
    cmpne	r8, #1
    beq	.Ldt50_3dc\@
.Ldt50_2d8\@:
    ldr	r8, [r4, #12]
    cmp	r8, #0
    ldrbne	r8, [r8]
    cmpne	r8, #1
    beq	.Ldt50_43c\@
.Ldt50_2ec\@:
    ldr	r5, [r2, #4]
    ldrb	r5, [r5]
    strb	r5, [r4]
    ldr	r5, [r2, #4]
    strb	r6, [r5]
    ldr	r4, [r4, #12]
    cmp	r4, #0
    strbne	r6, [r4]
    ldr	r4, [r2, #4]
    ldr	r5, [r4, #12]
    ldr	r7, [r5, #8]
    str	r7, [r4, #12]
    ldr	r7, [r5, #8]
    cmp	r7, #0
    strne	r4, [r7, #4]
    ldr	r7, [r4, #4]
    str	r7, [r5, #4]
    ldr	r7, [r1, #16]
    ldr	r8, [r7, #4]
    cmp	r8, r4
    streq	r5, [r7, #4]
    beq	.Ldt50_358\@
    ldr	r7, [r4, #4]
    ldr	r8, [r7, #8]
    cmp	r8, r4
    streq	r5, [r7, #8]
    strne	r5, [r7, #12]
.Ldt50_358\@:
    str	r4, [r5, #8]
    b	.Ldt50_558\@
.Ldt50_360\@:
    strb	r6, [r4]
    ldr	r4, [r2, #4]
    strb	r7, [r4]
    ldr	r4, [r2, #4]
    ldr	r5, [r4, #12]
    ldr	r8, [r5, #8]
    str	r8, [r4, #12]
    ldr	r8, [r5, #8]
    cmp	r8, #0
    strne	r4, [r8, #4]
    ldr	r8, [r4, #4]
    str	r8, [r5, #4]
    ldr	r8, [r1, #16]
    ldr	r9, [r8, #4]
    cmp	r9, r4
    streq	r5, [r8, #4]
    beq	.Ldt50_3b8\@
    ldr	r8, [r4, #4]
    ldr	r9, [r8, #8]
    cmp	r9, r4
    streq	r5, [r8, #8]
    strne	r5, [r8, #12]
.Ldt50_3b8\@:
    str	r4, [r5, #8]
    str	r5, [r4, #4]
    ldr	r5, [r2, #4]
    ldr	r4, [r5, #12]
    cmp	r4, #0
    bne	.Ldt50_2c4\@
.Ldt50_3d0\@:
    strb	r7, [r2]
    mov	r2, r5
    b	.Ldt50_3f8\@
.Ldt50_3dc\@:
    ldr	r8, [r4, #12]
    cmp	r8, #0
    ldrbne	r8, [r8]
    cmpne	r8, #1
    bne	.Ldt50_2d8\@
.Ldt50_3f0\@:
    strb	r7, [r4]
    ldr	r2, [r2, #4]
.Ldt50_3f8\@:
    ldr	r4, [r1, #16]
    ldr	r4, [r4, #4]
    cmp	r4, r2
    beq	.Ldt50_414\@
    ldrb	r4, [r2]
    cmp	r4, #1
    beq	.Ldt50_29c\@
.Ldt50_414\@:
    strb	r6, [r2]
.Ldt50_418\@:
    ldr	r2, [r1, #4]
    str	r2, [r3, #12]
    str	r3, [r1, #4]
    ldr	r2, [r1, #20]
    sub	r2, r2, #1
    str	r2, [r1, #20]
    str	ip, [r0]
.Ldt50_434\@:
    pop	{r4, r5, r6, r7, r8, r9}
    bx	lr
.Ldt50_43c\@:
    cmp	r5, #0
    strbne	r6, [r5]
    strb	r7, [r4]
    ldr	r5, [r4, #8]
    ldr	r7, [r5, #12]
    str	r7, [r4, #8]
    ldr	r7, [r5, #12]
    cmp	r7, #0
    strne	r4, [r7, #4]
    ldr	r7, [r4, #4]
    str	r7, [r5, #4]
    ldr	r7, [r1, #16]
    ldr	r8, [r7, #4]
    cmp	r8, r4
    streq	r5, [r7, #4]
    beq	.Ldt50_490\@
    ldr	r7, [r4, #4]
    ldr	r8, [r7, #12]
    cmp	r8, r4
    streq	r5, [r7, #12]
    strne	r5, [r7, #8]
.Ldt50_490\@:
    str	r4, [r5, #12]
    str	r5, [r4, #4]
    ldr	r4, [r2, #4]
    ldr	r4, [r4, #12]
    cmp	r4, #0
    bne	.Ldt50_2ec\@
    b	.Ldt50_414\@
.Ldt50_4ac\@:
    cmp	r4, #0
    beq	.Ldt50_3d0\@
    ldrb	r5, [r4]
    cmp	r5, #0
    beq	.Ldt50_560\@
.Ldt50_4c0\@:
    ldr	r8, [r4, #12]
    cmp	r8, #0
    ldrbne	r5, [r8]
    cmpne	r5, #1
    beq	.Ldt50_5d4\@
.Ldt50_4d4\@:
    ldr	r5, [r4, #8]
    cmp	r5, #0
    ldrbne	r5, [r5]
    cmpne	r5, #1
    beq	.Ldt50_5ec\@
.Ldt50_4e8\@:
    ldr	r5, [r2, #4]
    ldrb	r5, [r5]
    strb	r5, [r4]
    ldr	r5, [r2, #4]
    strb	r6, [r5]
    ldr	r4, [r4, #8]
    cmp	r4, #0
    strbne	r6, [r4]
    ldr	r4, [r2, #4]
    ldr	r5, [r4, #8]
    ldr	r7, [r5, #12]
    str	r7, [r4, #8]
    ldr	r7, [r5, #12]
    cmp	r7, #0
    strne	r4, [r7, #4]
    ldr	r7, [r4, #4]
    str	r7, [r5, #4]
    ldr	r7, [r1, #16]
    ldr	r8, [r7, #4]
    cmp	r8, r4
    streq	r5, [r7, #4]
    beq	.Ldt50_554\@
    ldr	r7, [r4, #4]
    ldr	r8, [r7, #12]
    cmp	r8, r4
    streq	r5, [r7, #12]
    strne	r5, [r7, #8]
.Ldt50_554\@:
    str	r4, [r5, #12]
.Ldt50_558\@:
    str	r5, [r4, #4]
    b	.Ldt50_414\@
.Ldt50_560\@:
    strb	r6, [r4]
    ldr	r4, [r2, #4]
    strb	r7, [r4]
    ldr	r4, [r2, #4]
    ldr	r5, [r4, #8]
    ldr	r8, [r5, #12]
    str	r8, [r4, #8]
    ldr	r8, [r5, #12]
    cmp	r8, #0
    strne	r4, [r8, #4]
    ldr	r8, [r4, #4]
    str	r8, [r5, #4]
    ldr	r8, [r1, #16]
    ldr	r9, [r8, #4]
    cmp	r9, r4
    streq	r5, [r8, #4]
    beq	.Ldt50_5b8\@
    ldr	r8, [r4, #4]
    ldr	r9, [r8, #12]
    cmp	r9, r4
    streq	r5, [r8, #12]
    strne	r5, [r8, #8]
.Ldt50_5b8\@:
    str	r4, [r5, #12]
    str	r5, [r4, #4]
    ldr	r5, [r2, #4]
    ldr	r4, [r5, #8]
    cmp	r4, #0
    beq	.Ldt50_3d0\@
    b	.Ldt50_4c0\@
.Ldt50_5d4\@:
    ldr	r5, [r4, #8]
    cmp	r5, #0
    ldrbne	r5, [r5]
    cmpne	r5, #1
    bne	.Ldt50_4d4\@
    b	.Ldt50_3f0\@
.Ldt50_5ec\@:
    cmp	r8, #0
    strbne	r6, [r8]
    strb	r7, [r4]
    ldr	r5, [r4, #12]
    ldr	r7, [r5, #8]
    str	r7, [r4, #12]
    ldr	r7, [r5, #8]
    cmp	r7, #0
    strne	r4, [r7, #4]
    ldr	r7, [r4, #4]
    str	r7, [r5, #4]
    ldr	r7, [r1, #16]
    ldr	r8, [r7, #4]
    cmp	r8, r4
    streq	r5, [r7, #4]
    beq	.Ldt50_640\@
    ldr	r7, [r4, #4]
    ldr	r8, [r7, #8]
    cmp	r8, r4
    streq	r5, [r7, #8]
    strne	r5, [r7, #12]
.Ldt50_640\@:
    str	r4, [r5, #8]
    str	r5, [r4, #4]
    ldr	r4, [r2, #4]
    ldr	r4, [r4, #8]
    cmp	r4, #0
    bne	.Ldt50_4e8\@
    b	.Ldt50_414\@
.size \name, .-\name
.endm

DT50_ERASE func_0054FD38
DT50_ERASE func_00550510
DT50_ERASE func_0055C19C
DT50_ERASE func_00566F04
DT50_ERASE func_005691BC
```

A standalone expansion of this mnemonic schedule assembled to 1,628 bytes,
contained no relocations, and matched the complete target body exactly. Direct
raw-section comparison also established that all five target bodies are
identical. Probe-only source, object, and binary files were deleted after
validation.

## Acceptance checklist

- All five symbols are ARM, 1,628 bytes, and 407 instructions.
- Their combined executable contribution is 8,140 bytes.
- The exact save set is `{r4, r5, r6, r7, r8, r9}`; the routine allocates no
  stack frame beyond that push.
- All 49 local branch destinations remain macro-local and exact.
- There are no calls, tail branches, literal slots, post-body data, or
  relocations.
- Every next global begins exactly at the end of its corresponding body.
