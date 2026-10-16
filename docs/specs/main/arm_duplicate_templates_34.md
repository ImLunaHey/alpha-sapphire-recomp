# Probe-verified duplicate ARM templates 34

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body symbolic duplicate grouping, bounded target
  disassembly and control/data-flow inspection, physical literal identity
  comparison, direct-call target resolution, and an independent GNU Arm
  exact-schedule probe.
- Probe toolchain: GNU Arm assembler, objdump, objcopy, and readelf 2.46.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, extracted assets, private absolute
  addresses, implementation source, private data values, or proprietary
  source.

Every function already exact in the current report and every function named
by a tracked configuration or specification was excluded before grouping.
That exclusion explicitly includes duplicate batch 33, IPC batch 31, runtime
batch 33, and all functions selected by those batches. The three functions
below occur in no earlier config/spec and remain unmatched in the current
report. They are the highest-yield remaining complete-body symbolic ARM
duplicate family: three 1,176-byte bodies, totaling 3,528 executable bytes.

## Serialized resource-operation wrapper

These ARM-state functions share one complete 294-instruction schedule when
the operation call at body offset +680 is represented by its symbolic
function-specific identity:

- `func_002E25B0`
- `func_002E4960`
- `func_002E52EC`

The body uses one shared state record reached through its first post-body
literal. Observed record fields are intrusive circular-list heads at offsets
4, 8, and 12; a synchronization object at offset 16; a notification object at
offset 28; list counters at offsets 36, 40, and 44; and state bytes at offsets
65 and 66. List nodes have forward/back links at offsets 0 and 4 and a
selection word at offset 8.

The wrapper enters the synchronization object, checks or initializes shared
state, removes a work node from the offset-8 list, and temporarily moves nodes
between the three intrusive lists while maintaining the three counters. It
then forwards the saved entry registers and stacked arguments to one of three
already specified IPC operations. On every observed failure or success path
it restores or requeues the selected node as required, signals the offset-28
object when a list transition requires it, releases synchronization, and
returns the operation/status result. A null saved stacked pointer in `sl`
selects a zero-filled local two-word substitute. The exact instruction
schedule below, not this semantic summary, is the implementation contract.

All three bodies are ARM mode, 4-byte aligned, exactly 1,176 bytes, and have
32 body-local CFG labels. The two ordered post-body pool slots are outside the
function extent.

## Call, data, equality, and relative ledgers

There are exactly fifteen ARM-state direct calls per body, at the following
ordered offsets:

| Ordered offsets | Symbolic identity | Equality/role contract |
| --- | --- | --- |
| +44, +328, +716, +884 | `func_001602B8` | same synchronization-entry identity at all twelve sites |
| +80, +136, +292, +468, +624, +1044, +1144 | `func_00160380` | same synchronization-exit identity at all twenty-one sites |
| +112 | `func_0018C780` | same shared-state initialization identity in all three bodies |
| +612, +1132 | `func_0017048C` | same notification identity at all six sites |
| +680 | function-specific IPC operation below | three distinct identities, each already specified by IPC batch 21 |

The function-specific operation mapping is:

| Wrapper | Operation identity at +680 |
| --- | --- |
| `func_002E25B0` | `func_002E3F10` |
| `func_002E4960` | `func_002E422C` |
| `func_002E52EC` | `func_002E435C` |

Thus the batch has 45 `R_ARM_CALL` sites in seven target-identity classes.
The first four classes are common across expansions; the final three are
pairwise unequal. All targets are ARM mode and at least 4-byte aligned. There
are no tail calls, external non-call branches, BLX sites, interworking
veneers, or indirect calls.

Each expansion has two ordered `R_ARM_ABS32` post-body pool slots:

| Slot relative to body | Load site | Symbolic identity | Equality contract |
| ---: | ---: | --- | --- |
| +1,176 | +20 | `resource_operation_state_34` | exactly equal in all three expansions |
| +1,180 | +72 | `resource_unavailable_status_34` | exactly equal in all three expansions; unequal to the state identity |

The first identity is a writable shared-state address. The second is an opaque
status scalar; its private numeric value is neither required nor permitted.
The slots are distinct physical words in each expansion but carry the same
corresponding symbolic identities. No other PC-relative loads, embedded data,
or adjacent table identities occur.

The complete ordered local-label ledger is:

```text
+72, +96, +152, +212, +220, +272, +296, +396,
+448, +464, +484, +500, +524, +540, +556, +572,
+596, +608, +640, +784, +836, +856, +868,
+952, +1024, +1040, +1060, +1076, +1116, +1128, +1148, +1160
```

All 32 labels must be uniquely scoped per template expansion.

## Complete exact body schedule

`operation` is the function-specific identity from the mapping above.
`state_identity` and `status_identity` are the two common symbolic identities.
The `.size` directive must precede the pool so that the executable body
remains exactly 1,176 bytes.

```asm
    push {r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, sl, fp, lr}
    sub sp, sp, #36
    mov r8, #0
    mov r4, r8
    ldrd sl, [sp, #92]
    ldr r5, .Ldt34_pool
    cmp sl, #0
    add r0, r5, #16
    addeq sl, sp, #24
    moveq fp, #0
    mov r9, r0
    bl func_001602B8
    ldrb r0, [r5, #65]
    cmp r0, #0
    beq .Ldt34_0048
    ldrb r0, [r5, #66]
    cmp r0, #0
    beq .Ldt34_0060
.Ldt34_0048:
    ldr r7, .Ldt34_pool+4
    mov r0, r9
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt34_0128
.Ldt34_0060:
    ldr r0, [r5, #8]
    cmp r0, #0
    bne .Ldt34_0098
    mov r0, r5
    bl func_0018C780
    lsrs r1, r0, #31
    nop {0}
    beq .Ldt34_0098
    mov r7, r0
    mov r0, r9
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt34_0128
.Ldt34_0098:
    ldr r6, [r5, #8]
    add r1, r5, #8
    cmp r6, #0
    beq .Ldt34_00dc
    ldr r2, [r6]
    mov r0, r6
    cmp r2, r0
    streq r8, [r1]
    beq .Ldt34_00d4
    ldr r2, [r6, #4]
    str r2, [r1]
    ldm r0, {r1, r2}
    str r1, [r2]
    ldm r0, {r1, r2}
    str r2, [r1, #4]
.Ldt34_00d4:
    str r8, [r0, #4]
    str r8, [r0]
.Ldt34_00dc:
    ldr r0, [r5, #44]
    add r1, r5, #4
    sub r2, r0, #1
    str r2, [r5, #44]
    ldr r0, [r5, #4]
    cmp r0, #0
    beq .Ldt34_01c0
    str r0, [r6, #4]
    ldr r2, [r0]
    str r6, [r2, #4]
    ldr r2, [r0]
    str r2, [r6]
    str r6, [r0]
.Ldt34_0110:
    ldr r0, [r5, #36]
    mov r7, #0
    add r0, r0, #1
    str r0, [r5, #36]
    mov r0, r9
    bl func_00160380
.Ldt34_0128:
    lsr r0, r7, #31
    cmp r0, #0
    moveq r4, r6
    beq .Ldt34_0280
    cmp r4, #0
    beq .Ldt34_0358
    add r0, r5, #16
    mov r6, r0
    bl func_001602B8
    ldrb r0, [r5, #65]
    cmp r0, #0
    beq .Ldt34_01d0
    ldr r1, [r4]
    add r0, r5, #4
    cmp r1, r4
    streq r8, [r0]
    beq .Ldt34_018c
    ldr r1, [r0]
    cmp r1, r4
    ldreq r1, [r1, #4]
    streq r1, [r0]
    ldrd r0, [r4]
    str r0, [r1]
    ldrd r0, [r4]
    str r1, [r0, #4]
.Ldt34_018c:
    str r8, [r4, #4]
    str r8, [r4]
    ldr r0, [r5, #36]
    sub r0, r0, #1
    str r0, [r5, #36]
    ldr r0, [r4, #8]
    cmp r0, #0
    beq .Ldt34_021c
    ldr r0, [r5, #8]
    add r1, r5, #8
    cmp r0, #0
    beq .Ldt34_01e4
    b .Ldt34_01f4
.Ldt34_01c0:
    str r6, [r6, #4]
    str r6, [r6]
    str r6, [r1]
    b .Ldt34_0110
.Ldt34_01d0:
    mov r0, r6
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt34_0358
.Ldt34_01e4:
    str r4, [r4, #4]
    str r4, [r4]
    str r4, [r1]
    b .Ldt34_020c
.Ldt34_01f4:
    str r0, [r4, #4]
    ldr r1, [r0]
    str r4, [r1, #4]
    ldr r1, [r0]
    str r1, [r4]
    str r4, [r0]
.Ldt34_020c:
    ldr r0, [r5, #44]
    add r0, r0, #1
    str r0, [r5, #44]
    b .Ldt34_0260
.Ldt34_021c:
    ldr r0, [r5, #12]
    add r1, r5, #12
    cmp r0, #0
    bne .Ldt34_023c
.Ldt34_022c:
    str r4, [r4, #4]
    str r4, [r4]
    str r4, [r1]
    b .Ldt34_0254
.Ldt34_023c:
    str r0, [r4, #4]
    ldr r1, [r0]
    str r4, [r1, #4]
    ldr r1, [r0]
    str r1, [r4]
    str r4, [r0]
.Ldt34_0254:
    ldr r0, [r5, #40]
    add r0, r0, #1
    str r0, [r5, #40]
.Ldt34_0260:
    add r0, r5, #28
    bl func_0017048C
    mov r0, r6
    nop {0}
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt34_0358
.Ldt34_0280:
    ldr r0, [r6, #8]
    ldr r2, [sp, #48]
    ldr r1, [sp, #88]
    str r0, [sp, #16]
    add r0, sp, #4
    str r2, [sp]
    stm r0, {r1, sl, fp}
    add r0, sp, #36
    ldm r0, {r1, r2, r3}
    add r0, sp, #16
    bl operation
    lsrs r1, r0, #31
    nop {0}
    beq .Ldt34_0364
    cmp r4, #0
    mov r7, r0
    beq .Ldt34_0358
    add r0, r5, #16
    mov r6, r0
    bl func_001602B8
    ldrb r0, [r5, #65]
    cmp r0, #0
    beq .Ldt34_01d0
    ldr r1, [r4]
    add r0, r5, #4
    cmp r1, r4
    streq r8, [r0]
    beq .Ldt34_0310
    ldr r1, [r0]
    cmp r1, r4
    ldreq r1, [r1, #4]
    streq r1, [r0]
    ldrd r0, [r4]
    str r0, [r1]
    ldrd r0, [r4]
    str r1, [r0, #4]
.Ldt34_0310:
    str r8, [r4, #4]
    str r8, [r4]
    ldr r0, [r5, #36]
    sub r0, r0, #1
    str r0, [r5, #36]
    ldr r0, [r4, #8]
    cmp r0, #0
    beq .Ldt34_0344
    ldr r0, [r5, #8]
    add r1, r5, #8
    cmp r0, #0
    bne .Ldt34_01f4
    b .Ldt34_01e4
.Ldt34_0344:
    ldr r0, [r5, #12]
    add r1, r5, #12
    cmp r0, #0
    bne .Ldt34_023c
    b .Ldt34_022c
.Ldt34_0358:
    add sp, sp, #52
    mov r0, r7
    pop {r4, r5, r6, r7, r8, r9, sl, fp, pc}
.Ldt34_0364:
    cmp r4, #0
    beq .Ldt34_047c
    add r0, r5, #16
    mov r6, r0
    bl func_001602B8
    ldrb r0, [r5, #65]
    cmp r0, #0
    beq .Ldt34_0410
    ldr r1, [r4]
    add r0, r5, #4
    cmp r1, r4
    streq r8, [r0]
    beq .Ldt34_03b8
    ldr r1, [r0]
    cmp r1, r4
    ldreq r1, [r1, #4]
    streq r1, [r0]
    ldrd r0, [r4]
    str r0, [r1]
    ldrd r0, [r4]
    str r1, [r0, #4]
.Ldt34_03b8:
    str r8, [r4, #4]
    str r8, [r4]
    ldr r0, [r5, #36]
    sub r0, r0, #1
    str r0, [r5, #36]
    ldr r0, [r4, #8]
    cmp r0, #0
    beq .Ldt34_0434
    ldr r0, [r5, #8]
    add r1, r5, #8
    cmp r0, #0
    beq .Ldt34_0424
    str r0, [r4, #4]
    ldr r1, [r0]
    str r4, [r1, #4]
    ldr r1, [r0]
    str r1, [r4]
    str r4, [r0]
.Ldt34_0400:
    ldr r0, [r5, #44]
    add r0, r0, #1
    str r0, [r5, #44]
    b .Ldt34_0468
.Ldt34_0410:
    mov r0, r6
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt34_047c
.Ldt34_0424:
    str r4, [r4, #4]
    str r4, [r4]
    str r4, [r1]
    b .Ldt34_0400
.Ldt34_0434:
    ldr r0, [r5, #12]
    add r1, r5, #12
    cmp r0, #0
    beq .Ldt34_0488
    str r0, [r4, #4]
    ldr r1, [r0]
    str r4, [r1, #4]
    ldr r1, [r0]
    str r1, [r4]
    str r4, [r0]
.Ldt34_045c:
    ldr r0, [r5, #40]
    add r0, r0, #1
    str r0, [r5, #40]
.Ldt34_0468:
    add r0, r5, #28
    bl func_0017048C
    mov r0, r6
    nop {0}
    bl func_00160380
.Ldt34_047c:
    add sp, sp, #52
    mov r0, #0
    pop {r4, r5, r6, r7, r8, r9, sl, fp, pc}
.Ldt34_0488:
    str r4, [r4, #4]
    str r4, [r4]
    str r4, [r1]
    b .Ldt34_045c
    .size function_name, .-function_name
.Ldt34_pool:
    .word state_identity
    .word status_identity
```

## Overlap audit

- Duplicate batch 33's nine insertion functions, its allocator identity, and
  its no-data contract are disjoint from this batch.
- IPC batch 31's sixteen wrapper functions and all fifteen of its IPC
  operation identities are disjoint from this batch. Physical comparison also
  proves both batch-34 pool identities unequal to every one of IPC batch 31's
  five literal identity classes.
- The three +680 callees deliberately reuse the already specified IPC batch
  21 identities listed above; they are dependencies, not claimed functions.
- `func_001602B8` and `func_00160380` are the destinations of already
  specified direct branch thunks. Their identities are reused here, not
  claimed by this batch.
- No selected runtime-batch-33 function occurs in this family. A repository-
  wide scan of tracked configs/specs found none of the three wrapper names.

## Exact-probe evidence

The complete schedule was independently assembled three times for ARMv6K,
once for each operation identity. Every probe function had an executable size
of 1,176 bytes (294 fixed-width instructions). In every expansion the two pool
slots occurred at +1,176 and +1,180 in the required order. Readelf reported
exactly fifteen `R_ARM_CALL` relocations and two `R_ARM_ABS32` relocations per
expansion, with the offsets, order, and identity classes specified above.

After normalizing only the fifteen audited call sites per body, every
executable byte of every probe matched the bounded target extraction: 3,528
of 3,528 bytes, with no residual mismatch. The two pool relocations per
expansion were checked separately. Direct decoding independently confirmed
all 42 decoded branch instructions not represented by calls target the listed
body-local CFG labels. Physical target-word comparison confirmed the two
across-expansion literal equality classes and their inequality to each other
and to all IPC-batch-31 literal classes, without recording their values.

The current report classifies all three functions as zero-percent matched
before implementation.
