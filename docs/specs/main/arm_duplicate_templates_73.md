# Probe-verified duplicate ARM templates 73

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- `sourceSha256`: `ae4f23843ea55cab126b9c676b24322bc047d5cb4ff14113df28dd385cbcf798`.
- Evidence: the evidence-gated function inventory, current objdiff report,
  repository-wide configured-function exclusion, normalized complete-body
  grouping, bounded target control/data-flow and post-body inspection,
  primary and secondary branch resolution, physical literal equality
  comparison, and an independent GNU Arm Embedded 15.2 mnemonic-only probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, target hashes, private strings or
  values, extracted assets, proprietary source, or implementation source.

Every exact function in the current report and every function already owned
by a configuration file was excluded. This includes the pending IPC 69,
runtime 73, and runtime 74 batches. The 24 selected ARM-state functions
comprise eight normalized schedules and 1,800 executable bytes (450
instructions):

| Template | Functions | Bytes each | Total |
| --- | ---: | ---: | ---: |
| Initialize pointer vector | 3 | 120 | 360 |
| Lazy shared object | 3 | 84 | 252 |
| Guarded dispatch | 3 | 84 | 252 |
| Register literal-sized record | 3 | 76 | 228 |
| Register fixed 68-byte record | 3 | 76 | 228 |
| Select relative identity | 3 | 64 | 192 |
| Visit 24 entries | 3 | 52 | 156 |
| Set object flag | 3 | 44 | 132 |

The schedules contain 60 symbolic direct transfers, 21 literal slots, six
relocation-free post-body `adr` sites, no register-indirect transfers, and no
other relocations. All body sizes, operands, local destinations, transfer
classes, literal-load destinations, function boundaries, and post-body
boundaries were independently assembled and compared after normalizing only
external transfer displacements and declared literal contents.

## Template behavior and boundaries

### Initialize pointer vector

Each 120-byte expansion initializes a four-word container, allocates a pointer
vector through `func_0012344C`, and constructs one twelve-byte element per
requested entry. The zero-count exit is +112 and the loop begins at +68.
Calls occur at +48, +76, and conditionally at +88. A descriptor identity is
loaded at +12 from the sole post-body slot at +120; the three descriptor
identities are pairwise distinct.

| Function | Constructor | Descriptor | Next global | Offset |
| --- | --- | --- | --- | ---: |
| `func_0011F26C` | `func_0012BE70` | A | `func_0011F2E8` | 124 |
| `func_0011F2E8` | `func_0012BEAC` | B | `func_0011F364` | 124 |
| `func_0011F364` | `func_0012BEEC` | C | `func_0011F3E0` | 124 |

The body ends at +120, the owned literal occupies +120, and the next global
begins at +124 in every expansion.

### Lazy shared object

Each 84-byte expansion loads a persistent slot at +8, returns its existing
object at +80 when non-null, otherwise allocates 120 bytes through
`func_00123480`, conditionally initializes it through `func_00128D08`, stores
it in the persistent slot, and tail-branches to `func_001289EC` at +76. The
initializer continuation is +64. Each slot identity reuses an identity first
established by duplicate-template batch 19.

| Function | Reused slot identity | Next global | Offset |
| --- | --- | --- | ---: |
| `func_0011F0C4` | `arm_duplicate_templates_19_owned_object_slot_003B0994` | `func_0011F11C` | 88 |
| `func_0011F198` | `arm_duplicate_templates_19_owned_object_slot_003B0B80` | `func_0011F1F0` | 88 |
| `func_0011F3E0` | `arm_duplicate_templates_19_owned_object_slot_003B14C0` | `func_0011F438` | 88 |

The body ends at +84, the owned literal occupies +84, and the next global
begins at +88 in every expansion.

### Guarded dispatch

The 84-byte schedule preserves the second argument in `ip`, reads a shared
guard byte, and either loads a shared inactive-result identity or calls an
expansion-specific active dispatcher with a two-word stack record. The common
exit is +76. The guard slot at +84 reuses `service_guard_state_41`; the
inactive-result slot at +88 is one new identity shared by all three
expansions.

| Function | Active dispatcher | Next global | Offset |
| --- | --- | --- | ---: |
| `func_002E2554` | `func_002E3EA4` | `func_002E25B0` | 92 |
| `func_002E4904` | `func_002E41E0` | `func_002E4960` | 92 |
| `func_002E4E00` | `func_002E42B0` | `func_002E4E5C` | 92 |

The body ends at +84, the two owned literals occupy +84 and +88, and the next
global begins at +92.

### Register record

Both 76-byte record schedules preserve their two arguments, take the address
of expansion-specific material immediately after the body, call
`func_0036F28C` at +20, allocate through `func_00123480` at +36,
conditionally construct at +48, store the owner and lookup result, and
tail-branch to `func_003AB384` at +72. They differ only at +32: the first
schedule loads an expansion-specific extent identity from a post-body slot;
the second moves the immediate record size 68.

| Function | Extent source | Constructor | Literal offset | Next global | Offset |
| --- | --- | --- | ---: | --- | ---: |
| `func_00367B64` | extent A | `func_0019C050` | 92 | `func_00367BC4` | 96 |
| `func_00369B68` | extent B | `func_0019C208` | 100 | `func_00369BD0` | 104 |
| `func_0036ACA0` | extent C | `func_0019C320` | 108 | `func_0036AD3C` | 156 |
| `func_00369C84` | immediate 68 | `func_0019C218` | — | `func_00369CEC` | 104 |
| `func_0036A134` | immediate 68 | `func_0019C258` | — | `func_0036A20C` | 216 |
| `func_0036AB9C` | immediate 68 | `func_0019C308` | — | `func_0036AC34` | 152 |

The `adr` target is exactly +76 in all six functions. These are pairwise
distinct address-only clean-room identities: the batch owns none of the
referenced material and records none of its private content. In the first
three functions, only the declared extent slot at +92, +100, or +108 is owned
after the body; all intervening or following post-body material is unowned.

### Select relative identity

The 64-byte schedule rejects a null or empty second argument, otherwise loads
a primary relative-address identity, adds the architectural PC, and calls
`func_00302334`. A null result joins the fallback path at +52. The primary
and fallback identities occupy +64 and +68. All six identities are pairwise
distinct.

| Function | Identity pair | Next global | Offset |
| --- | --- | --- | ---: |
| `func_0016F3FC` | primary A / fallback A | `func_0016F454` | 88 |
| `func_00193C20` | primary B / fallback B | `func_00193C68` | 72 |
| `func_0052AEC4` | primary C / fallback C | `func_0052AF0C` | 72 |

The first expansion has sixteen bytes of unowned material after its two
literal slots. The other two next globals begin immediately after the slots.

### Visit 24 entries

The 52-byte schedule iterates 24 entries. Each iteration derives the entry
address from the base plus a fixed two-part displacement, follows two fields,
calls the expansion-specific visitor at +32, and loops to +12. The first and
third visitors are secondary entry identities; the second is a primary entry.

| Function | Visitor | Next global | Offset |
| --- | --- | --- | ---: |
| `func_00147838` | `visit_target_secondary_73_a` | `func_0014787C` | 68 |
| `func_0018E5C0` | `func_0018713C` | `func_0018E5F4` | 52 |
| `func_0018E76C` | `visit_target_secondary_73_c` | `func_0018E7A0` | 52 |

`visit_target_secondary_73_a` is 76 bytes after `func_001870E4`, twelve bytes
before `func_0018713C`. `visit_target_secondary_73_c` is 164 bytes after
`func_00190C20`, twenty bytes before `func_00190CD8`. The first selected
function is followed by sixteen bytes of unowned anonymous material; the other
two end at their next-global boundaries.

### Set object flag

The 44-byte schedule preserves its two arguments, calls `func_00168EC0` at
+12, selects an expansion-specific object member at +24, stores the saved byte
argument at member offset 26, and tail-branches to `func_00168E50` at +40.

| Function | Member selector | Next global | Offset |
| --- | --- | --- | ---: |
| `func_003B2BC0` | `func_0016BC84` | `func_003B2BEC` | 44 |
| `func_003B3084` | `func_00176EFC` | `func_003B30DC` | 88 |
| `func_003B3658` | `func_0016BD80` | `func_003B3684` | 44 |

Only `func_003B3084` has post-body anonymous material: 44 unowned bytes before
its next global.

## Identity contracts

All 60 direct transfers are ARM-state and four-byte aligned. Shared classes
are `func_0012344C` (3 sites), `func_00123480` (12), `func_00128D08` (3),
`func_001289EC` (3), `func_0036F28C` (6), `func_003AB384` (6),
`func_00302334` (3), `func_00168EC0` (3), and `func_00168E50` (3). Every
other destination is a singleton class. All primary and secondary classes are
pairwise distinct.

Physical comparison of all 21 literal slots established these relations:

- the three vector descriptors are distinct new identities;
- the three persistent object slots reuse their batch-19 identities;
- all three guard slots reuse `service_guard_state_41`;
- all three inactive-result slots share one new identity;
- the three record extents are distinct new identities; and
- all six relative-address identities are distinct and new.

No other configured literal identity has the same physical value as any new
identity above.

## Complete normalized schedules

Equivalent uniquely scoped local-label names are allowed. The source must
assemble to these fixed instruction schedules, sizes, local destinations,
ordered relocations, address targets, and literal-load destinations.
`DT73_END` closes each function at its body boundary; material emitted after
that marker is not part of the function size.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT73_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT73_END name
.size \name, .-\name
.endm

.macro DT73_VECTOR name, constructor, descriptor
DT73_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    mov r5, r0
    mov r7, r1
    ldr r1, .Ldt73_vector_descriptor\@
    mov r0, #0
    str r0, [r5, #4]
    str r1, [r5]
    str r0, [r5, #12]
    mov r6, r2
    lsl r0, r2, #2
    mov r1, r7
    str r2, [r5, #8]
    bl func_0012344C
    cmp r6, #0
    mov r4, #0
    str r0, [r5, #4]
    bls .Ldt73_vector_done\@
.Ldt73_vector_loop\@:
    mov r1, r7
    mov r0, #12
    bl func_00123480
    cmp r0, #0
    movne r1, r7
    blne \constructor
    ldr r1, [r5, #4]
    str r0, [r1, r4, lsl #2]
    add r4, r4, #1
    cmp r4, r6
    bcc .Ldt73_vector_loop\@
.Ldt73_vector_done\@:
    mov r0, r5
    pop {r4, r5, r6, r7, r8, pc}
DT73_END \name
.Ldt73_vector_descriptor\@:
    .word \descriptor
.endm

.macro DT73_LAZY name, slot
DT73_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r0
    ldr r6, .Ldt73_lazy_slot\@
    mov r4, r1
    ldr r0, [r6]
    cmp r0, #0
    bne .Ldt73_lazy_done\@
    mov r1, r5
    mov r0, #120
    bl func_00123480
    cmp r0, #0
    beq .Ldt73_lazy_store\@
    mov r3, #1
    mov r2, r4
    mov r1, r5
    bl func_00128D08
.Ldt73_lazy_store\@:
    mov r1, r5
    str r0, [r6]
    pop {r4, r5, r6, lr}
    b func_001289EC
.Ldt73_lazy_done\@:
    pop {r4, r5, r6, pc}
DT73_END \name
.Ldt73_lazy_slot\@:
    .word \slot
.endm

.macro DT73_GUARDED name, dispatcher
DT73_BEGIN \name
    mov ip, r1
    ldr r1, .Ldt73_guard\@
    push {r4, lr}
    mov r4, r2
    sub sp, sp, #8
    ldrb r2, [r1]
    cmp r2, #0
    ldreq r0, .Ldt73_inactive\@
    beq .Ldt73_guarded_done\@
    ldr r1, [r1, #4]
    str r3, [sp]
    mov r3, r4
    str r1, [sp, #4]
    mov r1, r0
    mov r2, ip
    add r0, sp, #4
    bl \dispatcher
    lsrs r1, r0, #31
    moveq r0, #0
.Ldt73_guarded_done\@:
    add sp, sp, #8
    pop {r4, pc}
DT73_END \name
.Ldt73_guard\@:
    .word service_guard_state_41
.Ldt73_inactive\@:
    .word arm_duplicate_templates_73_inactive_result_identity
.endm

.macro DT73_REGISTER_LITERAL name, constructor, extent, extent_offset
DT73_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r5, r1
    adr r0, .Ldt73_post_body\@
    mov r1, #0
    bl func_0036F28C
    mov r6, r0
    ldr r1, [r4, #4]
    ldr r0, .Ldt73_extent\@
    bl func_00123480
    cmp r0, #0
    movne r1, r5
    blne \constructor
    str r4, [r0, #28]
    mov r1, r0
    str r6, [r0, #16]
    mov r0, r4
    pop {r4, r5, r6, lr}
    b func_003AB384
.Ldt73_post_body\@:
DT73_END \name
    .space \extent_offset - 76
.Ldt73_extent\@:
    .word \extent
.endm

.macro DT73_REGISTER_FIXED name, constructor
DT73_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r5, r1
    adr r0, .Ldt73_post_body\@
    mov r1, #0
    bl func_0036F28C
    mov r6, r0
    ldr r1, [r4, #4]
    mov r0, #68
    bl func_00123480
    cmp r0, #0
    movne r1, r5
    blne \constructor
    str r4, [r0, #28]
    mov r1, r0
    str r6, [r0, #16]
    mov r0, r4
    pop {r4, r5, r6, lr}
    b func_003AB384
.Ldt73_post_body\@:
DT73_END \name
.endm

.macro DT73_SELECT name, primary, fallback
DT73_BEGIN \name
    push {r4, lr}
    cmp r1, #0
    beq .Ldt73_select_fallback\@
    ldrb r0, [r1]
    cmp r0, #0
    beq .Ldt73_select_fallback\@
    ldr r0, .Ldt73_primary\@
    add r0, pc, r0
    bl func_00302334
    cmp r0, #0
    beq .Ldt73_select_fallback\@
    movs r0, #0
    pop {r4, pc}
.Ldt73_select_fallback\@:
    ldr r0, .Ldt73_fallback\@
    add r0, pc, r0
    pop {r4, pc}
DT73_END \name
.Ldt73_primary\@:
    .word \primary
.Ldt73_fallback\@:
    .word \fallback
.endm

.macro DT73_VISIT name, visitor
DT73_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r0
    mov r4, #0
.Ldt73_visit_loop\@:
    add r0, r5, r4, lsl #2
    add r0, r0, #5120
    add r0, r0, #476
    ldr r0, [r0]
    ldr r0, [r0, #104]
    bl \visitor
    add r4, r4, #1
    cmp r4, #24
    blt .Ldt73_visit_loop\@
    pop {r4, r5, r6, pc}
DT73_END \name
.endm

.macro DT73_FLAG name, selector
DT73_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r1
    mov r5, r0
    bl func_00168EC0
    mov r1, #1
    mov r0, r5
    bl \selector
    strb r4, [r0, #26]
    mov r0, r5
    pop {r4, r5, r6, lr}
    b func_00168E50
DT73_END \name
.endm
```

The 24 invocations are exactly the function rows in the tables and config,
using their declared constructor, dispatcher, visitor, selector, literal
identity, and literal-offset operands. Secondary visitor symbols must preserve
the ownership relations above.

## Independent probe result

GNU Arm Embedded 15.2 assembled one representative of every schedule, all
condition-code variants, both secondary-transfer forms, all three literal
displacements of the literal-sized record schedule, and every declared
post-body layout. The probe verified:

- 450 executable ARM instructions and 1,800 executable bytes across the 24
  configured function bodies;
- every local destination and the exact fixed operand schedule shown above;
- 60 ordered direct-transfer sites with the declared call/jump relocation
  kinds and symbolic identity classes;
- every literal load resolves to its declared slot, including +92, +100, and
  +108 record-extent placements;
- six `adr` sites resolve to body offset +76 without relocations;
- all function-size markers stop at the body boundary; and
- after normalizing only configured external transfers and declared literal
  contents, every selected target body equals its independently assembled
  schedule.
