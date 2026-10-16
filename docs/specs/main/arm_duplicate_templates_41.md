# Probe-verified duplicate ARM templates 41

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, complete-body symbolic duplicate comparison, bounded target
  disassembly and control/data-flow inspection, physical literal identity
  comparison, direct-call target resolution, and an independent GNU Arm
  exact-schedule probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, extracted assets, private absolute
  addresses, implementation source, private data values, or proprietary
  source.

Both functions remain unmatched in the current report and occur in no earlier
tracked specification or configuration. They form the previously identified
remaining complete-body duplicate pair: two 1,160-byte bodies, totaling 2,320
executable bytes.

## Serialized resource-operation register wrapper

These ARM-state functions share one complete 290-instruction schedule after
the fifteen direct calls are represented by symbolic identity:

```text
func_002E3518  func_002E4E5C
```

The body serializes access to a shared resource record. Observed record fields
are intrusive circular-list heads at offsets 4, 8, and 12; a synchronization
object at offset 16; a notification object at offset 28; list counters at
offsets 36, 40, and 44; and state bytes at offsets 65 and 66. List nodes have
forward/back links at offsets 0 and 4 and an operation payload at offset 8.

The wrapper enters synchronization, initializes shared state when necessary,
removes a node from the offset-8 list, and moves nodes among the three lists
while maintaining their counters. It forwards the entry registers to one of
two function-specific operations, with the saved entry `r3` and selected node
payload passed on the stack. Success and failure paths restore or requeue the
node as required, notify on the relevant list transitions, release
synchronization, and return the operation/status result. The exact schedule
below, rather than this summary, is the implementation contract.

## Call, literal, equality, and relative ledgers

Each body makes exactly fifteen ARM-state link-setting calls:

| Body offsets | Symbolic identity | Equality/role contract |
| --- | --- | --- |
| +36, +328, +700, +868 | `func_001602B8` | shared synchronization-entry identity |
| +72, +128, +292, +468, +624, +1028, +1128 | `func_00160380` | shared synchronization-exit identity |
| +104 | `func_0018C780` | shared-state initialization identity |
| +612, +1116 | `func_0017048C` | shared notification identity |
| +664 | function-specific operation | mapping below |

The operation mapping is:

| Wrapper | Operation identity at +664 |
| --- | --- |
| `func_002E3518` | `func_002E40B0` |
| `func_002E4E5C` | `func_002E42FC` |

Thus the batch has 30 `R_ARM_CALL` sites in six target-identity classes. The
four common identities are equal across expansions; the two operation
identities are unequal. There are no indirect calls, BLX sites, tail calls,
veneers, or external non-call branches.

Each expansion has two ordered word-sized post-body literal slots:

| Pool offset | Load site | Relocation | Symbolic identity |
| ---: | ---: | --- | --- |
| +1160 | +20 | `R_ARM_ABS32` | `resource_operation_state_41` |
| +1164 | +64 | `R_ARM_ABS32` | `resource_unavailable_status_41` |

The corresponding slots are equal across both expansions and form two
two-occurrence equality classes. The first identity is a writable shared-state
address. The second is an opaque status scalar whose private numeric value is
neither required nor permitted. The two identities are unequal. There are no
other PC-relative loads, embedded tables, post-body words, or alignment bytes.

After all fifteen direct-call fields are normalized by symbolic target, the
two complete 1,160-byte bodies are equal. No other body field requires
normalization. The complete ordered local-label ledger is:

```text
+64, +88, +144, +204, +216, +272, +296, +396,
+448, +464, +484, +500, +524, +540, +556, +572,
+596, +608, +640, +768, +820, +840, +852, +936,
+1008, +1024, +1044, +1060, +1100, +1112, +1132, +1144
```

All 32 labels must be uniquely scoped per template expansion.

## Complete exact body schedule

`operation` is the function-specific identity from the mapping above. The two
pool operands name semantic identities rather than private values. The
function size must end before the pool.

```asm
    push {r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, sl, fp, lr}
    sub sp, sp, #12
    mov r8, #0
    mov sl, r3
    mov fp, r0
    ldr r5, .Ldt41_pool
    mov r4, r8
    add r0, r5, #16
    mov r9, r0
    bl func_001602B8
    ldrb r0, [r5, #65]
    cmp r0, #0
    beq .Ldt41_0040
    ldrb r0, [r5, #66]
    cmp r0, #0
    beq .Ldt41_0058
.Ldt41_0040:
    ldr r7, .Ldt41_pool+4
    mov r0, r9
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt41_0128
.Ldt41_0058:
    ldr r0, [r5, #8]
    cmp r0, #0
    bne .Ldt41_0090
    mov r0, r5
    bl func_0018C780
    lsrs r1, r0, #31
    nop {0}
    beq .Ldt41_0090
    mov r7, r0
    mov r0, r9
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt41_0128
.Ldt41_0090:
    ldr r1, [r5, #8]
    add r0, r5, #8
    movs r6, r1
    moveq r0, #0
    beq .Ldt41_00d8
    ldr r2, [r6]
    cmp r2, r6
    streq r8, [r0]
    beq .Ldt41_00cc
    ldr r1, [r1, #4]
    str r1, [r0]
    ldrd r0, [r6]
    str r0, [r1]
    ldrd r0, [r6]
    str r1, [r0, #4]
.Ldt41_00cc:
    str r8, [r6, #4]
    mov r0, r6
    str r8, [r6]
.Ldt41_00d8:
    ldr r1, [r5, #44]
    add r2, r5, #4
    mov r6, r0
    sub r3, r1, #1
    str r3, [r5, #44]
    ldr r1, [r5, #4]
    cmp r1, #0
    beq .Ldt41_01c0
    str r1, [r0, #4]
    ldr r2, [r1]
    str r0, [r2, #4]
    ldr r2, [r1]
    str r2, [r0]
    str r0, [r1]
.Ldt41_0110:
    ldr r0, [r5, #36]
    mov r7, #0
    add r0, r0, #1
    str r0, [r5, #36]
    mov r0, r9
    bl func_00160380
.Ldt41_0128:
    lsr r0, r7, #31
    cmp r0, #0
    moveq r4, r6
    beq .Ldt41_0280
    cmp r4, #0
    beq .Ldt41_0348
    add r0, r5, #16
    mov r6, r0
    bl func_001602B8
    ldrb r0, [r5, #65]
    cmp r0, #0
    beq .Ldt41_01d0
    ldr r1, [r4]
    add r0, r5, #4
    cmp r1, r4
    streq r8, [r0]
    beq .Ldt41_018c
    ldr r1, [r0]
    cmp r1, r4
    ldreq r1, [r1, #4]
    streq r1, [r0]
    ldrd r0, [r4]
    str r0, [r1]
    ldrd r0, [r4]
    str r1, [r0, #4]
.Ldt41_018c:
    str r8, [r4, #4]
    str r8, [r4]
    ldr r0, [r5, #36]
    sub r0, r0, #1
    str r0, [r5, #36]
    ldr r0, [r4, #8]
    cmp r0, #0
    beq .Ldt41_021c
    ldr r0, [r5, #8]
    add r1, r5, #8
    cmp r0, #0
    beq .Ldt41_01e4
    b .Ldt41_01f4
.Ldt41_01c0:
    str r0, [r0, #4]
    str r0, [r0]
    str r0, [r2]
    b .Ldt41_0110
.Ldt41_01d0:
    mov r0, r6
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt41_0348
.Ldt41_01e4:
    str r4, [r4, #4]
    str r4, [r4]
    str r4, [r1]
    b .Ldt41_020c
.Ldt41_01f4:
    str r0, [r4, #4]
    ldr r1, [r0]
    str r4, [r1, #4]
    ldr r1, [r0]
    str r1, [r4]
    str r4, [r0]
.Ldt41_020c:
    ldr r0, [r5, #44]
    add r0, r0, #1
    str r0, [r5, #44]
    b .Ldt41_0260
.Ldt41_021c:
    ldr r0, [r5, #12]
    add r1, r5, #12
    cmp r0, #0
    bne .Ldt41_023c
.Ldt41_022c:
    str r4, [r4, #4]
    str r4, [r4]
    str r4, [r1]
    b .Ldt41_0254
.Ldt41_023c:
    str r0, [r4, #4]
    ldr r1, [r0]
    str r4, [r1, #4]
    ldr r1, [r0]
    str r1, [r4]
    str r4, [r0]
.Ldt41_0254:
    ldr r0, [r5, #40]
    add r0, r0, #1
    str r0, [r5, #40]
.Ldt41_0260:
    add r0, r5, #28
    bl func_0017048C
    mov r0, r6
    nop {0}
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt41_0348
.Ldt41_0280:
    ldr r0, [r6, #8]
    str sl, [sp]
    mov r1, fp
    str r0, [sp, #4]
    ldrd r2, [sp, #16]
    add r0, sp, #4
    bl operation
    lsrs r1, r0, #31
    nop {0}
    beq .Ldt41_0354
    cmp r4, #0
    mov r7, r0
    beq .Ldt41_0348
    add r0, r5, #16
    mov r6, r0
    bl func_001602B8
    ldrb r0, [r5, #65]
    cmp r0, #0
    beq .Ldt41_01d0
    ldr r1, [r4]
    add r0, r5, #4
    cmp r1, r4
    streq r8, [r0]
    beq .Ldt41_0300
    ldr r1, [r0]
    cmp r1, r4
    ldreq r1, [r1, #4]
    streq r1, [r0]
    ldrd r0, [r4]
    str r0, [r1]
    ldrd r0, [r4]
    str r1, [r0, #4]
.Ldt41_0300:
    str r8, [r4, #4]
    str r8, [r4]
    ldr r0, [r5, #36]
    sub r0, r0, #1
    str r0, [r5, #36]
    ldr r0, [r4, #8]
    cmp r0, #0
    beq .Ldt41_0334
    ldr r0, [r5, #8]
    add r1, r5, #8
    cmp r0, #0
    bne .Ldt41_01f4
    b .Ldt41_01e4
.Ldt41_0334:
    ldr r0, [r5, #12]
    add r1, r5, #12
    cmp r0, #0
    bne .Ldt41_023c
    b .Ldt41_022c
.Ldt41_0348:
    add sp, sp, #28
    mov r0, r7
    pop {r4, r5, r6, r7, r8, r9, sl, fp, pc}
.Ldt41_0354:
    cmp r4, #0
    beq .Ldt41_046c
    add r6, r5, #16
    mov r0, r6
    bl func_001602B8
    ldrb r0, [r5, #65]
    cmp r0, #0
    beq .Ldt41_0400
    ldr r1, [r4]
    add r0, r5, #4
    cmp r1, r4
    streq r8, [r0]
    beq .Ldt41_03a8
    ldr r1, [r0]
    cmp r1, r4
    ldreq r1, [r1, #4]
    streq r1, [r0]
    ldrd r0, [r4]
    str r0, [r1]
    ldrd r0, [r4]
    str r1, [r0, #4]
.Ldt41_03a8:
    str r8, [r4, #4]
    str r8, [r4]
    ldr r0, [r5, #36]
    sub r0, r0, #1
    str r0, [r5, #36]
    ldr r0, [r4, #8]
    cmp r0, #0
    beq .Ldt41_0424
    ldr r0, [r5, #8]
    add r1, r5, #8
    cmp r0, #0
    beq .Ldt41_0414
    str r0, [r4, #4]
    ldr r1, [r0]
    str r4, [r1, #4]
    ldr r1, [r0]
    str r1, [r4]
    str r4, [r0]
.Ldt41_03f0:
    ldr r0, [r5, #44]
    add r0, r0, #1
    str r0, [r5, #44]
    b .Ldt41_0458
.Ldt41_0400:
    mov r0, r6
    bl func_00160380
    nop {0}
    nop {0}
    b .Ldt41_046c
.Ldt41_0414:
    str r4, [r4, #4]
    str r4, [r4]
    str r4, [r1]
    b .Ldt41_03f0
.Ldt41_0424:
    ldr r0, [r5, #12]
    add r1, r5, #12
    cmp r0, #0
    beq .Ldt41_0478
    str r0, [r4, #4]
    ldr r1, [r0]
    str r4, [r1, #4]
    ldr r1, [r0]
    str r1, [r4]
    str r4, [r0]
.Ldt41_044c:
    ldr r0, [r5, #40]
    add r0, r0, #1
    str r0, [r5, #40]
.Ldt41_0458:
    add r0, r5, #28
    bl func_0017048C
    mov r0, r6
    nop {0}
    bl func_00160380
.Ldt41_046c:
    add sp, sp, #28
    mov r0, #0
    pop {r4, r5, r6, r7, r8, r9, sl, fp, pc}
.Ldt41_0478:
    str r4, [r4, #4]
    str r4, [r4]
    str r4, [r1]
    b .Ldt41_044c
```

Immediately after the body, emit the two symbolic pool words in the stated
order. No padding occurs between body and pool.

## Probe result

A neutral GNU Arm probe expanded this schedule twice with macro-local labels,
the operation mapping above, and undefined symbols for the two literal
identities. It established 4-byte ARM alignment, 1,160-byte function sizes,
290 instructions and 32 local labels per expansion, fifteen `R_ARM_CALL`
relocations at the contracted offsets, two `R_ARM_ABS32` pool relocations,
and two 1,168-byte section extents. After normalizing the call fields, each
probe body matched the corresponding target body and the two probe bodies
were mutually equal.

## Acceptance criteria

- Both named functions are global ARM functions with 1,160-byte extents.
- Their aggregate executable coverage is exactly 2,320 bytes and 580
  instructions.
- Each expansion implements the exact schedule, label ledger, call order, and
  operation mapping above.
- Each expansion emits exactly the two ordered symbolic pool slots outside its
  function extent, with the stated load-site and equality contracts.
- No raw encoding directive, copied target byte sequence, private literal
  value, or additional code/data object is used.
