# Probe-verified duplicate ARM templates 81

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- `sourceSha256`: `21e70ee8653f1b1f311b8c5c9071504a0ef6020e03e1bf6f91d40f62121d2931`.
- Probe tool: GNU assembler from Arm GNU Toolchain 15.2.Rel1, binutils
  2.45.1.20251203.
- Evidence: the current objdiff report, the evidence-gated symbol inventory,
  repository-wide ownership exclusion, normalized complete-body grouping, bounded
  target control/data-flow and post-body inspection, branch resolution, physical
  literal comparison, and an independent assembly probe.
- Clean-room role: analysis/specification only. This document contains no target
  bytes, instruction encodings, target hashes, private strings or values,
  extracted assets, proprietary source, or implementation source.

Every exact function in the current report and every function name already owned
by existing configuration was excluded. Residual normalized groups whose
inventoried bodies end on link calls were rejected as incomplete. The selected
24 ARM-state functions are unmatched, pairwise non-overlapping, and complete.
They form twelve two-member templates comprising 1,288 executable body bytes
and 322 instructions:

| Template | Functions | Bytes each | Total |
| --- | ---: | ---: | ---: |
| Grow sequence | 2 | 88 | 176 |
| Reset polymorphic record | 2 | 80 | 160 |
| Guarded active tail | 2 | 80 | 160 |
| Initialize guarded state | 2 | 72 | 144 |
| Scaled random value | 2 | 64 | 128 |
| Acquire thread counter | 2 | 56 | 112 |
| Indirect submit tail | 2 | 52 | 104 |
| Locked state query | 2 | 52 | 104 |
| Prepare/set-byte tail | 2 | 44 | 88 |
| Optional fallback tail | 2 | 36 | 72 |
| Literal receiver tail | 2 | 12 | 24 |
| Add-four tail | 2 | 8 | 16 |

The schedules contain 36 symbolic direct transfers: 24 calls and 12 tail
branches. They also contain 32 local branches, four register-indirect calls,
two register-indirect tails, and eighteen returns. Twenty-two owned literal
slots in eighteen physical identity classes add 88 bytes, so this batch owns
1,376 bytes total. Twenty-eight PC-relative load sites reach those slots.

## Function map and boundaries

| Template | Functions | Next globals (relative offset) |
| --- | --- | --- |
| Grow sequence | `func_002AD3EC`, `func_002AD4DC` | `func_002AD444` (+88), `func_002AD534` (+88) |
| Reset polymorphic record | `func_00163ED0`, `func_00173304` | `func_00163F38` (+104), `func_0017335C` (+88) |
| Guarded active tail | `func_0017EA3C`, `func_0017EA90` | `func_0017EA90` (+84), `func_0017EAE4` (+84) |
| Initialize guarded state | `func_001360FC`, `func_0017541C` | `func_001361B0` (+180), `func_00175474` (+88) |
| Scaled random value | `func_00112310`, `func_00175D64` | `func_00112354` (+68), `func_00175E24` (+192) |
| Acquire thread counter | `func_001602B8`, `func_0050DC00` | `func_00160380` (+200), `func_0050DC38` (+56) |
| Indirect submit tail | `func_0012344C`, `func_00123480` | `func_00123480` (+52), `func_001234B4` (+52) |
| Locked state query | `func_0014967C`, `func_0016FF00` | `func_0014983C` (+448), `func_0016FF3C` (+60) |
| Prepare/set-byte tail | `func_003B2BEC`, `func_003B32A0` | `func_003B2C44` (+88), `func_003B32CC` (+44) |
| Optional fallback tail | `func_00160A64`, `func_00160F9C` | `func_00160A88` (+36), `func_00160FC0` (+36) |
| Literal receiver tail | `func_00178228`, `func_0018EC24` | `func_00178238` (+16), `func_0018EC4C` (+40) |
| Add-four tail | `func_0021A9B8`, `func_00328DFC` | `func_0021A9C0` (+8), `func_00328E04` (+8) |

Functions with literal slots own only the contiguous declared words immediately
after their executable bodies. Their `templateMaterialEndOffset` ends at the
last slot. Any remaining gap before a later global is unowned. Functions with
no slots own only their executable body.

## Identity contracts

The 22 literal slots form eighteen physical classes. Eight reuse previously
configured neutral identities: `duplicate_template_25_shared_type`,
`ipc_allocator_dispatch_owner_68`, `ipc_guard_state_52`,
`ipc_fixed_extent_52`, `ipc_fallback_entry_52`, `service_session_lock_48`,
`service_unlink_context_44`, and `ipc_submission_owner_72`. Physical equality
with the prior sites was verified. The ten new classes are pairwise distinct
and distinct from every configured literal class. `scale_limit` is the sole
new class shared across functions. The complete slot-to-class and load-to-slot
maps are normative in the configuration.

The 36 direct sites resolve to twenty pairwise-distinct destination classes.
The only Thumb destination is `func_00302F52`; all others are ARM entries.
There are no secondary-entry destinations. Ordered counts and singleton/shared
classification are normative in the configuration.

## Complete normalized schedules

Equivalent uniquely scoped local-label names are allowed. Every external
identity must remain symbolic. Offsets, operands, local destinations,
relocation kinds, function sizes, literal-load destinations, and ownership
boundaries are exact.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

@ Grow sequence (88 bytes; two variants)
    push {r4, lr}
    ldr r1, [r0, #4]
    ldr r2, [r0]
    mov r4, r0
    mov r3, #1
    cmp r1, r2
    sub r1, r1, r2
    lslhi r0, r1, #29
    add ip, r3, r1, asr #2
    lsrhi r0, r0, #31
    movls r0, #0
    add r0, r0, #1
    cmp ip, r0
    addgt r1, r3, r1, asr #2
    ble local:+72
    add r0, r0, #2
    cmp r1, r0
    bgt local:+60
    mov r0, r2
    bl {resize}
    mov r0, r4
    pop {r4, pc}

@ Reset polymorphic record (80 bytes; two variants)
    push {r4, lr}
    mov r4, r0
    ldr r0, [pc, #64]
    str r0, [r4]
    ldr r0, [r4, #12]
    cmp r0, #0
    beq local:+56
    ldr r1, [r0, #-8]!
    cmp r1, #0
    beq local:+48
    blx r1
    b local:+56
    nop {0}
    bl {fallback}
    ldr r0, [pc, #20]
    str r0, [r4]
    mov r0, #0
    str r0, [r4, #4]
    mov r0, r4
    pop {r4, pc}

@ Guarded active tail (80 bytes; two variants)
    ldrb r1, [r0, #44]
    ldr r2, [pc, #68]
    cmp r1, #2
    beq local:+52
    ldrb r1, [r0, #44]
    cmp r1, #1
    bne local:+76
    ldr r1, [r0, #40]
    cmp r1, #0
    beq local:+76
    ldr r3, [r2, #84]
    bics r1, r1, r3
    bne local:+76
    ldrb r1, [r2, #4]
    add r0, r0, #4
    cmp r1, #0
    bne local:+76
    add r0, r0, #4
    b {active_tail}
    bx lr

@ Initialize guarded state (72 bytes; two variants)
    ldr r0, [pc, #64]
    push {r4, lr}
    ldr r0, [r0]
    tst r0, #1
    bne local:+64
    ldr r0, [pc, #44]
    blx {probe}
    cmp r0, #0
    beq local:+64
    ldr r0, [pc, #32]
    bl {initialize}
    ldr r2, [pc, #28]
    ldr r1, [pc, #28]
    mov r0, r0
    ldr r0, [pc, #8]
    mov r0, r0
    ldr r0, [pc, #4]
    pop {r4, pc}

@ Scaled random value (64 bytes; two variants)
    push {r4, lr}
    mov r4, r1
    ldr r1, [pc, #48]
    cmp r4, r1
    bcs local:+36
    bl {random}
    uxth r1, r4
    umull r1, r0, r0, r1
    pop {r4, pc}
    nop {0}
    bl {random}
    mov r1, r4
    nop {0}
    bl {wide_scale}
    mov r0, r1
    pop {r4, pc}

@ Acquire thread counter (56 bytes; two variants)
    push {r4, lr}
    mov r4, r0
    mrc p15, 0, r0, c13, c0, 3
    ldr r1, [r4, #4]
    cmp r0, r1
    beq local:+40
    mov r0, r4
    bl {refresh}
    mrc p15, 0, r0, c13, c0, 3
    str r0, [r4, #4]
    ldr r0, [r4, #8]
    add r0, r0, #1
    str r0, [r4, #8]
    pop {r4, pc}

@ Indirect submit tail (52 bytes; two variants)
    push {r4, r5, r6, lr}
    mov r5, r0
    ldr r0, [r1]
    mov r4, r1
    ldr r1, [r0, #28]
    mov r0, r4
    blx r1
    mov r2, r0
    mov r1, r5
    mov r0, r4
    pop {r4, r5, r6, lr}
    mov r3, #1
    b {submit_tail}

@ Locked state query (52 bytes; two variants)
    push {r4, r5, r6, lr}
    ldr r4, [pc, #40]
    mov r0, r4
    bl {lock}
    ldr r0, [pc, #32]
    ldr r0, [r0]
    cmp r0, #0
    movne r5, #1
    moveq r5, #0
    mov r0, r4
    bl {unlock}
    mov r0, r5
    pop {r4, r5, r6, pc}

@ Prepare/set-byte tail (44 bytes; two variants)
    push {r4, r5, r6, lr}
    mov r4, r1
    mov r5, r0
    bl {prepare}
    mov r1, #1
    mov r0, r5
    bl {select}
    strb r4, [r0, #27]
    mov r0, r5
    pop {r4, r5, r6, lr}
    b {finish_tail}

@ Optional fallback tail (36 bytes; two variants)
    cmp r0, #0
    beq local:+32
    ldr r1, [r0, #-8]!
    cmp r1, #0
    beq local:+24
    bx r1
    nop {0}
    b {fallback_tail}
    bx lr

@ Literal receiver tail (12 bytes; two variants)
    mov r1, r0
    ldr r0, [pc]
    b {tail}

@ Add-four tail (8 bytes; two variants)
    add r0, r0, #4
    b {tail}

```

Place labels at every `local:+N` destination and replace each `{role}` with the
per-function symbol declared in `directTransfers`. Emit each function in its
own `.text.<name>` section, set `.size` at the executable-body boundary, and
then emit its declared literal slots in offset order. Multi-use slots expose
all exact referring instruction offsets through `loadOffsets`; `loadOffset` is
the first site for compatibility.

## Canonical schedules and verification

Canonical records use function order from the configuration, increasing
instruction/relocation offsets, decimal offsets, LF termination, symbolic
external destinations, and `local:+N` operands for local branches. Literal
identity records contain one record per load site, including every `loadOffsets`
entry for a shared slot. SHA-256 digests are:

| Schedule | Records | Digest |
| --- | ---: | --- |
| Instruction | 322 | `1876f02eca23de3d1cc7bf48a117846dca687d1a3939329998033ffe2a7b2435` |
| Local transfer | 32 | `ca94e41457db1eecf3b5161e8608ba56142c359485f39c0e7e1e3cbcf1f8b00b` |
| Relocation | 58 | `bdc28619dcf7db2a422209c1a4848fbe8f2e123cb19904787616ccc6c27da22f` |
| Literal identity | 28 | `223168708e62c18a32b45d513d1182d80fe706ef18afd84a2cf26ecd5a94074c` |

The independent probe assembled all 24 complete body schedules and declared
literal slots. Section-by-section comparison against the private target passed
for all 1,288 body bytes after normalizing only the 36 declared external
direct-transfer words. Local branches, register-indirect transfers, returns,
literal-load reaches, operands, and every other instruction compared exactly.
Physical inspection separately verified all slot equality classes and reused
identities. The current report audit found all 24 functions unmatched, and the
ownership audit found no selected function already owned by prior configuration.
