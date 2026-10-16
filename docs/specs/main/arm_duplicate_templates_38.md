# Probe-verified duplicate ARM templates 38

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body symbolic duplicate grouping, bounded target
  disassembly and control/data-flow inspection, direct-call target resolution,
  post-body literal analysis, and an independent GNU Arm exact-schedule probe.
- Probe toolchain: GNU Arm assembler, objcopy, readelf, and objdump
  2.45.1.20251203.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, extracted assets, private absolute
  addresses, private data values, or proprietary source.

Every function already exact in the current report and every function named
by a tracked configuration or specification was excluded before grouping. The
provisional IPC batch 34 and runtime batch 37 selections were also excluded
and are disjoint from this batch. The three functions below are the
highest-yield remaining complete-body symbolic ARM duplicate group: three
828-byte bodies, totaling 2,484 executable bytes. The next remaining group
totals 2,304 executable bytes.

## Staged polymorphic aggregate teardown

These ARM-state functions share one complete 207-instruction schedule after
the direct call is represented by its symbolic code identity:

- `func_002EB58C`
- `func_002EC008`
- `func_002F9B78`

The function receives an object pointer in `r0`. It installs a per-expansion
dispatch identity, calls a shared direct helper, and conditionally releases
the object at offset 372 through the companion at offset 376. It then installs
three successive shared dispatch identities while releasing owned
polymorphic objects and pointer arrays at offsets 368, 304, 52, and 40. It
removes the containing object from an externally owned pointer vector reached
through offset 12, clears backlinks in the pointer range at offsets 24 through
28, releases the allocation represented at offsets 20 through 28, and returns
the original object pointer.

The exact instruction and register schedule, rather than this semantic
summary, is the implementation contract.

## Call, literal, equality, and relative ledgers

Each body makes one ARM-state link-setting call:

| Body offset | Relocation | Symbolic identity |
| ---: | --- | --- |
| +20 | `R_ARM_CALL` | `func_00312920` |

There are no other direct calls or external direct branches. The fifteen
register-indirect link-setting calls occur at body offsets:

```text
+76, +96, +136, +156, +228, +248, +296, +316,
+556, +576, +624, +644, +684, +704, +816
```

Four word-sized literal slots immediately follow each body. Their values are
represented only by semantic identities:

| Pool offset | Load site | Relocation | Semantic identity |
| ---: | ---: | --- | --- |
| +828 | +8 | `R_ARM_ABS32` | per-function derived dispatch identity |
| +832 | +100 | `R_ARM_ABS32` | shared dispatch identity 1 |
| +836 | +164 | `R_ARM_ABS32` | shared dispatch identity 2 |
| +840 | +328 | `R_ARM_ABS32` | shared dispatch identity 3 |

The per-function identities are:

```text
func_002EB58C_dispatch_identity
func_002EC008_dispatch_identity
func_002F9B78_dispatch_identity
```

The shared identities are:

```text
arm_duplicate_templates_38_shared_dispatch_identity_1
arm_duplicate_templates_38_shared_dispatch_identity_2
arm_duplicate_templates_38_shared_dispatch_identity_3
```

The three per-function identities are mutually distinct. Each shared identity
is equal across all three expansions. The three shared identities are
mutually distinct, and no per-function identity equals a shared identity.
Thus the twelve literal occurrences form six equality classes: three
singleton per-function classes and three three-occurrence shared classes.

After the direct-call field at +20 is normalized by symbolic target, all three
complete 828-byte bodies are equal. No other body field requires
normalization. The complete ordered local-label ledger is:

```text
+80, +100, +164, +200, +252, +264, +300, +324,
+352, +428, +436, +472, +500, +528, +580, +592,
+628, +652, +708, +748, +776, +820
```

All labels must be uniquely scoped per template expansion.

## Complete exact body schedule

The angle-bracketed operands name the post-body semantic literal slots from
the ledger above; they are not numeric values or raw encodings.

```asm
    push {r3, r4, r5, r6, r7, r8, r9, sl, fp, lr}
    mov r4, r0
    ldr r0, <derived_dispatch_identity>
    str r0, [r4]
    mov r0, r4
    bl func_00312920
    ldr r6, [r4, #372]!
    mov sl, #0
    cmp r6, #0
    beq .Ldt38_0064
    ldr r1, [r6, #12]
    ldr r5, [r4, #4]
    add r0, r6, #12
    cmp r1, #0
    addsne r1, r1, r0
    beq .Ldt38_0050
    ldr r0, [r5]
    ldr r2, [r0, #12]
    mov r0, r5
    blx r2
.Ldt38_0050:
    ldr r0, [r5]
    mov r1, r6
    ldr r2, [r0, #12]
    mov r0, r5
    blx r2
.Ldt38_0064:
    ldr r0, <shared_dispatch_identity_1>
    sub r8, r4, #372
    str r0, [r4, #-372]
    ldr r4, [r4, #-4]
    cmp r4, #0
    beq .Ldt38_00a4
    ldr r0, [r4]
    ldr r1, [r0]
    mov r0, r4
    blx r1
    ldr r0, [r4, #4]
    ldr r1, [r0]
    ldr r2, [r1, #12]
    mov r1, r4
    blx r2
    str sl, [r8, #368]
.Ldt38_00a4:
    ldr r0, <shared_dispatch_identity_2>
    str r0, [r8]
    ldr r9, [r8, #304]
    cmp r9, #0
    beq .Ldt38_0144
    add r4, r9, #8
    ldm r4, {r4, r7}
    cmp r4, r7
    beq .Ldt38_0108
.Ldt38_00c8:
    ldr r5, [r4]
    ldr r6, [r5, #4]
    cmp r6, #0
    beq .Ldt38_00fc
    ldr r0, [r5]
    ldr r1, [r0, #4]
    mov r0, r5
    blx r1
    ldr r0, [r6]
    mov r1, r5
    ldr r2, [r0, #12]
    mov r0, r6
    blx r2
.Ldt38_00fc:
    add r4, r4, #4
    cmp r4, r7
    bne .Ldt38_00c8
.Ldt38_0108:
    ldr r1, [r9, #8]
    str r1, [r9, #12]
    ldr r0, [r9, #4]
    cmp r0, #0
    cmpne r1, #0
    beq .Ldt38_012c
    ldr r2, [r0]
    ldr r2, [r2, #12]
    blx r2
.Ldt38_012c:
    ldr r0, [r9]
    ldr r1, [r0]
    ldr r2, [r1, #12]
    mov r1, r9
    blx r2
    str sl, [r8, #304]
.Ldt38_0144:
    ldr r3, [r8, #12]
    ldr r0, <shared_dispatch_identity_3>
    cmp r3, #0
    addne r1, r3, #24
    str r0, [r8]
    ldmne r1, {r1, r2}
    beq .Ldt38_01f4
.Ldt38_0160:
    cmp r1, r2
    ldrne ip, [r1]
    cmpne ip, r8
    addne r1, r1, #4
    bne .Ldt38_0160
    cmp r1, r2
    mov r0, r1
    beq .Ldt38_01d8
    add r1, r0, #4
    sub r2, r2, r1
    asr ip, r2, #2
    cmp ip, #0
    ble .Ldt38_01d8
    lsls ip, r2, #29
    bpl .Ldt38_01ac
    ldr ip, [r1]
    add r1, r1, #4
    cmp ip, r8
    strne ip, [r0], #4
.Ldt38_01ac:
    asrs r2, r2, #3
    beq .Ldt38_01d8
.Ldt38_01b4:
    ldr ip, [r1]
    cmp ip, r8
    strne ip, [r0], #4
    ldr ip, [r1, #4]!
    add r1, r1, #4
    cmp ip, r8
    strne ip, [r0], #4
    subs r2, r2, #1
    bne .Ldt38_01b4
.Ldt38_01d8:
    ldr r1, [r3, #28]
    str r0, [r3, #28]
    cmp r1, r0
    movne r1, #1
    moveq r1, #0
    cmp r1, #0
    strne sl, [r8, #12]
.Ldt38_01f4:
    ldr r9, [r8, #52]
    cmp r9, #0
    beq .Ldt38_028c
    add r4, r9, #8
    ldm r4, {r4, r7}
    cmp r4, r7
    beq .Ldt38_0250
.Ldt38_0210:
    ldr r5, [r4]
    ldr r6, [r5, #4]
    cmp r6, #0
    beq .Ldt38_0244
    ldr r0, [r5]
    ldr r1, [r0, #4]
    mov r0, r5
    blx r1
    ldr r0, [r6]
    mov r1, r5
    ldr r2, [r0, #12]
    mov r0, r6
    blx r2
.Ldt38_0244:
    add r4, r4, #4
    cmp r4, r7
    bne .Ldt38_0210
.Ldt38_0250:
    ldr r1, [r9, #8]
    str r1, [r9, #12]
    ldr r0, [r9, #4]
    cmp r0, #0
    cmpne r1, #0
    beq .Ldt38_0274
    ldr r2, [r0]
    ldr r2, [r2, #12]
    blx r2
.Ldt38_0274:
    ldr r0, [r9]
    ldr r1, [r0]
    ldr r2, [r1, #12]
    mov r1, r9
    blx r2
    str sl, [r8, #52]
.Ldt38_028c:
    ldr r4, [r8, #40]!
    cmp r4, #0
    ldrbne r0, [r8, #4]
    cmpne r0, #0
    beq .Ldt38_02c4
    ldr r0, [r4]
    ldr r1, [r0]
    mov r0, r4
    blx r1
    ldr r0, [r4, #4]
    ldr r1, [r0]
    ldr r2, [r1, #12]
    mov r1, r4
    blx r2
.Ldt38_02c4:
    sub r0, r8, #16
    mov r2, #1
    ldm r0, {r0, r3}
    sub ip, r8, #24
    mov r1, r2
    sub r3, r3, r0
    add r4, r2, r3, asr #2
    cmp r4, #1
    addgt r3, r2, r3, asr #2
    ble .Ldt38_0308
.Ldt38_02ec:
    ldr r2, [r0]
    add r1, r1, #1
    add r0, r0, #4
    cmp r2, #0
    strne sl, [r2, #12]
    cmp r3, r1
    bgt .Ldt38_02ec
.Ldt38_0308:
    ldr r0, [ip, #8]
    add r4, ip, #4
    str r0, [ip, #12]
    ldr r0, [ip, #4]
    cmp r0, #0
    ldrne r1, [r4, #4]
    cmpne r1, #0
    beq .Ldt38_0334
    ldr r2, [r0]
    ldr r2, [r2, #12]
    blx r2
.Ldt38_0334:
    sub r0, r4, #20
    pop {r3, r4, r5, r6, r7, r8, r9, sl, fp, pc}
```

## Probe evidence

A neutral symbolic ARM probe assembled the complete 207-instruction schedule
with four zero-valued placeholders placed only in the documented post-body
literal slots. The direct helper remained undefined so the object retained
one `R_ARM_CALL` relocation at body offset +20. The probe body was 828 bytes.

After normalizing only that call field, the probe matched all three complete
target bodies exactly, and the three normalized target bodies were mutually
equal. Independent inspection reproduced the four PC-relative loads and their
pool offsets +828, +832, +836, and +840; established the six literal equality
classes stated above; confirmed the 22 body-local labels and fifteen indirect
calls; and confirmed non-overlap with all tracked and provisional selections.
No private literal value or target encoding is retained in this specification.

No clean-room implementation is included in this analysis document.
