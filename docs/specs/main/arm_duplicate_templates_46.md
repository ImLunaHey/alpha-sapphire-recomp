# Probe-verified duplicate ARM templates 46

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body symbolic duplicate grouping, bounded target
  disassembly and control/data-flow inspection, direct-call target resolution,
  physical post-body literal comparison, boundary analysis, and an independent
  GNU Arm exact-schedule probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, extracted assets, private absolute
  addresses, private literal values, implementation source, or proprietary
  source.

Every function already exact in the current report and every function named
by a tracked configuration or specification was excluded before grouping.
The concurrently selected runtime batch 46 functions were also excluded and
are disjoint from this batch. The two functions below are the highest-yield
remaining complete-body ARM duplicate group after direct calls are represented
symbolically: two 508-byte bodies, totaling 1,016 executable bytes.

## Conditional object resolution and pointer append

These ARM-state functions share one complete 127-instruction body schedule:

```text
func_002EBDF8  func_002F9968
```

Entry `r0` is an optional owner record, `r1` is an optional candidate object,
`r2` is an opaque value forwarded during object construction, and `r3` is a
provider object. The function retains the candidate only when its leading flag
word contains every bit named by the expansion-specific required-flags
identity; otherwise it substitutes null. It asks the provider, through virtual
slot 8, for a 380-byte allocation aligned to four. When that result is nonzero,
it calls the shared construction helper with the allocation, provider,
filtered candidate, and opaque value, then initializes the constructed
object's expansion-specific dispatch identity and three null fields. The
schedule subsequently invokes virtual slot 36 on the resulting object with
the provider; the target contract therefore assumes the provider allocation
does not return null on a continuing execution path.

When the optional owner is present, the function rejects an already-linked or
equivalent object. Otherwise it appends the resolved object to a pointer array
whose begin and end pointers are at owner offsets 24 and 28 and whose packed
capacity word is at offset 32. If the array is full, it requests a replacement
allocation through virtual slot 8 of the allocator object at owner offset 20,
copies the old pointer sequence, releases the old allocation through allocator
virtual slot 12, and updates the begin, end, and packed capacity fields. A
successful owner update also stores the owner's offset-16 link into the
resolved object's offset-12 field. The exact instruction and register schedule
below, rather than this semantic summary, is the implementation contract.

## Call, literal, equality, boundary, and CFG ledgers

Each body has two direct ARM-state link-setting calls:

| Body offset | Relocation | Symbolic identity | Semantic role |
| ---: | --- | --- | --- |
| +96 | `R_ARM_CALL` | `func_002F7B18` | construct the object in provider-supplied storage |
| +192 | `R_ARM_CALL` | `func_004B9B50` | test object equivalence or linkage |

The four direct-call sites across the two expansions form two two-occurrence
target-identity classes. The symbol contract is deliberately asymmetric across
objects:

| Identity | Calling implementation object | Generated target object |
| --- | --- | --- |
| `func_002F7B18` | global, undefined, zero-sized `NOTYPE` symbol in `UND` | global, defined, 868-byte `FUNC` symbol in executable section `.text.func_002F7B18` |
| `func_004B9B50` | global, undefined, zero-sized `NOTYPE` symbol in `UND` | global, defined, 32-byte `FUNC` symbol in executable section `.text.func_004B9B50` |

Thus target validation must not require either callee identity to be undefined
in the generated target object. Conversely, neither callee body belongs to
this batch: the two template caller sections reference the identities through
the four relocations in the ledger and do not define them locally. Both target
callee sections are four-byte aligned ARM executable `PROGBITS` sections.

Each body also has four non-relocated indirect calls:

| Body offset | Target derivation | Semantic role |
| ---: | --- | --- |
| +68 | provider dispatch word, virtual slot 8 | allocate 380 bytes aligned to four |
| +148 | resolved-object dispatch word, virtual slot 36 | finalize or bind the object |
| +320 | allocator dispatch word, virtual slot 8 | allocate a replacement pointer array |
| +424 | allocator dispatch word, virtual slot 12 | release the old pointer array |

There are no other direct or indirect calls, tail calls, veneers, or external
non-call branches in either body.

Two ordered word-sized literal slots immediately follow each body:

| Pool offset | Load site | Relocation | Semantic role |
| ---: | ---: | --- | --- |
| +508 | +28 | `R_ARM_ABS32` | expansion-specific required-flags identity |
| +512 | +108 | `R_ARM_ABS32` | expansion-specific constructed-object dispatch identity |

All four literal occurrences are pairwise unequal: neither required-flags
identity equals the other, neither dispatch identity equals the other, and no
required-flags identity equals a dispatch identity. Their private values are
not part of this specification. There are no other PC-relative loads or
embedded tables in either body. Each function symbol ends at +508, its
two-word pool occupies +508 through +515, and unrelated anonymous executable
code begins at +516. The next global function begins at +528; that following
code is outside this template and must not be emitted by it.

After the two direct-call instruction fields are normalized by symbolic target,
the complete 508-byte bodies are equal. The pool is outside the function-size
boundary and is governed by the slot and equality contracts above. The
complete ordered local-label ledger is:

```text
+44, +48, +128, +208, +356, +400, +428, +456, +480, +492, +500
```

All labels must be uniquely scoped per template expansion. The complete basic
block successor schedule is:

| Block start | Inclusive end | Successors |
| ---: | ---: | --- |
| +0 | +20 | +24, +44 |
| +24 | +40 | +44, +48 |
| +44 | +44 | +48 |
| +48 | +80 | +84, +128 |
| +84 | +124 | +128 |
| +128 | +156 | +160, +492 |
| +160 | +180 | +184, +208 |
| +184 | +188 | +192, +492 |
| +192 | +204 | +208, +492 |
| +208 | +216 | +220, +492 |
| +220 | +244 | +248, +456 |
| +248 | +268 | +272, +456 |
| +272 | +280 | +284, +500 |
| +284 | +296 | +300, +500 |
| +300 | +328 | +332, +500 |
| +332 | +352 | +356, +400 |
| +356 | +380 | +356, +384 |
| +384 | +396 | +400 |
| +400 | +408 | +412, +428 |
| +412 | +424 | +428 |
| +428 | +452 | +456 |
| +456 | +476 | +480 |
| +480 | +488 | +492 |
| +492 | +496 | return |
| +500 | +504 | +480 |

The calls at +68, +96, +148, +192, +320, and +424 return to their following
instructions and do not add inter-block successors.

## Complete exact body schedule

`required_flags` and `object_dispatch` name the expansion-specific identities
from the mapping below. The `.size` boundary must precede the pool.

```asm
    push {r4, r5, r6, r7, r8, r9, sl, fp, ip, lr}
    cmp r1, #0
    mov r4, r0
    mov r7, r2
    mov r5, r3
    beq .Ldt46_002c
    ldr r0, [r1]
    ldr r2, .Ldt46_pool
    bics r0, r2, r0
    moveq r6, r1
    beq .Ldt46_0030
.Ldt46_002c:
    mov r6, #0
.Ldt46_0030:
    ldr r0, [r5]
    mov r2, #4
    mov r1, #380
    ldr r3, [r0, #8]
    mov r0, r5
    blx r3
    cmp r0, #0
    mov sl, #0
    beq .Ldt46_0080
    mov r1, r5
    mov r3, r7
    mov r2, r6
    bl func_002F7B18
    mov r1, #0
    str r1, [r0, #328]
    ldr r1, .Ldt46_pool+4
    str r1, [r0]
    str sl, [r0, #368]
    str sl, [r0, #372]
    str sl, [r0, #376]
.Ldt46_0080:
    mov r8, r0
    ldr r0, [r0]
    mov r1, r5
    ldr r2, [r0, #36]
    mov r0, r8
    blx r2
    cmp r4, #0
    beq .Ldt46_01ec
    ldr r0, [r4, #12]
    mov r1, r8
    mov r5, r8
    cmp r0, #0
    mov r6, #1
    beq .Ldt46_00d0
    cmp r0, r1
    beq .Ldt46_01ec
    bl func_004B9B50
    cmp r0, #0
    nop
    bne .Ldt46_01ec
.Ldt46_00d0:
    ldr r0, [r5, #12]
    cmp r0, #0
    bne .Ldt46_01ec
    ldr r2, [r4, #24]
    ldrd r0, [r4, #28]
    mov fp, #1
    sub r2, r0, r2
    bic r0, r1, #-1073741824
    cmp r0, r2, asr #2
    bgt .Ldt46_01c8
    cmp r0, #0
    lslne r7, r0, #1
    moveq r7, #1
    bic r0, r1, #-1073741824
    cmp r0, r7
    bge .Ldt46_01c8
    ldr r0, [r4, #20]
    cmp r0, #0
    beq .Ldt46_01f4
    and r0, r1, #-1073741824
    cmp r0, #1073741824
    mov fp, r6
    bne .Ldt46_01f4
    ldr r0, [r4, #20]
    lsl r1, r7, #2
    ldr r2, [r0]
    ldr r3, [r2, #8]
    mov r2, #32
    blx r3
    movs r6, r0
    beq .Ldt46_01f4
    add r0, r4, #24
    mov r9, #0
    ldm r0, {r0, r2}
    cmp r0, r2
    movne r1, r6
    beq .Ldt46_0190
.Ldt46_0164:
    cmp r1, #0
    ldrne ip, [r0]
    add r0, r0, #4
    strne ip, [r1]
    cmp r0, r2
    add r1, r1, #4
    bne .Ldt46_0164
    ldr r0, [r4, #28]
    ldr r1, [r4, #24]
    sub r0, r0, r1
    asr r9, r0, #2
.Ldt46_0190:
    ldr r1, [r4, #24]
    cmp r1, #0
    beq .Ldt46_01ac
    ldr r0, [r4, #20]
    ldr r2, [r0]
    ldr r2, [r2, #12]
    blx r2
.Ldt46_01ac:
    add r0, r6, r9, lsl #2
    str r0, [r4, #28]
    str r6, [r4, #24]
    ldr r0, [r4, #32]
    and r0, r0, #-1073741824
    orr r0, r0, r7
    str r0, [r4, #32]
.Ldt46_01c8:
    ldr r0, [r4, #28]
    cmp r0, #0
    strne r5, [r0]
    ldr r0, [r4, #28]
    add r0, r0, #4
    str r0, [r4, #28]
.Ldt46_01e0:
    cmp fp, #0
    ldrne r0, [r4, #16]
    strne r0, [r5, #12]
.Ldt46_01ec:
    mov r0, r8
    pop {r4, r5, r6, r7, r8, r9, sl, fp, ip, pc}
.Ldt46_01f4:
    mov fp, sl
    b .Ldt46_01e0
```

Close the function size immediately after the final branch, then emit
`required_flags` and `object_dispatch` as the two ordered word slots described
in the literal ledger. `.Ldt46_pool` denotes the first of those slots for both
PC-relative loads in the body schedule.

## Expansion mapping

| Function | `required_flags` identity | `object_dispatch` identity |
| --- | --- | --- |
| `func_002EBDF8` | `func_002EBDF8_required_flags_identity` | `func_002EBDF8_object_dispatch_identity` |
| `func_002F9968` | `func_002F9968_required_flags_identity` | `func_002F9968_object_dispatch_identity` |

The four symbols in this table are intentionally opaque undefined identities
for implementation purposes. Their names encode only occurrence and semantic
role, not private values.

## Acceptance contract

An implementation is conforming only when all of the following hold:

1. Both symbols are ARM-state global functions with size 508 and expand the
   exact 127-instruction schedule above.
2. Each expansion has direct-call relocations at +96 and +192 to the symbolic
   identities in the call ledger, with no other direct-branch relocation. The
   calling implementation object carries the two identities as undefined,
   zero-sized global `NOTYPE` symbols, while generated-target validation
   requires their defined global `FUNC` symbols and dedicated executable
   sections described above.
3. Each expansion has exactly the four approved register-indirect calls at
   +68, +148, +320, and +424.
4. Each function boundary precedes an eight-byte pool with `R_ARM_ABS32`
   relocations at +508 and +512 to its mapped opaque identities.
5. The four pool identities obey the pairwise-inequality contract, and no
   private literal value is embedded in source or tracked metadata.
6. Direct-call-normalized bodies are equal, and direct-call-and-slot-normalized
   body-plus-pool extents are equal.
7. Labels and branches reproduce the local-label and CFG ledgers exactly; the
   unrelated code beginning at +516 is not part of an expansion.

