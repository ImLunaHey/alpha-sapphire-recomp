# Probe-verified duplicate ARM templates 77

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- `sourceSha256`: `0d04fff24df9616746e97e2af3e8aecec7606ed90696fc26c667b0129e332e1f`.
- Evidence: the evidence-gated function inventory, current objdiff report,
  repository-wide configured/owned/referenced-name exclusion, normalized
  complete-body grouping, bounded target control/data-flow and post-body
  inspection, branch resolution, physical literal equality comparison, and an
  independent GNU Arm Embedded 15.2 mnemonic-only assembly probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, target hashes, private strings or
  values, extracted assets, proprietary source, or implementation source.

Every exact function in the current report and every function already owned or
referenced by neutral configuration metadata was excluded. Runtime reservation
lists through batch 80 were also checked. The largest remaining normalized
pair was rejected because both inventory bodies end on link calls rather than
returns or tail transfers. The selected 25 ARM-state functions are pairwise
non-overlapping and comprise ten complete schedules, 912 executable bytes, and
228 instructions:

| Template | Functions | Bytes each | Total |
| --- | ---: | ---: | ---: |
| Update halfword if changed | 2 | 48 | 96 |
| Compare three-word pair | 2 | 48 | 96 |
| Test three-word pair | 2 | 48 | 96 |
| Dispatch optional record | 2 | 48 | 96 |
| Query presence identity | 3 | 32 | 96 |
| Call then forward | 6 | 16 | 96 |
| Read member 26 | 2 | 44 | 88 |
| Read member 27 | 2 | 44 | 88 |
| Initialize conditionally | 2 | 40 | 80 |
| Bounded index lookup | 2 | 40 | 80 |

Nine normalized classes contain exactly the selected members in the target
inventory. The query-presence class has five target members: two are already
owned by batch 22 and the three still-unmatched members form this batch's
cohort. No selected name occurs in any pre-existing configuration,
specification, or checked runtime reservation list, and all 25 selected ranges
are pairwise disjoint.

The schedules contain 47 symbolic direct transfers, two register-indirect tail
transfers, two conditional register returns, fourteen local branch sites, no
address references, and five literal slots belonging to three reused physical
identity classes. There are no register-indirect calls. All body sizes,
operands, local destinations, transfer classes, literal-load destinations,
function boundaries, post-body ownership, and pool identities were
independently assembled and compared. Only external direct-transfer
displacements and declared literal contents were normalized.

## Function map and boundaries

| Template | Functions | Variant parameters | Next globals (relative offset) |
| --- | --- | --- | --- |
| Update halfword if changed | `func_00175E24`, `func_003B09C4` | owned-slot identities A/B | `func_00175ED4` (+176), `func_003B0A64` (+160) |
| Compare three-word pair | `func_00195590`, `func_002FF1EC` | completion destinations | `func_001955C0`, `func_002FF21C` (+48 each) |
| Test three-word pair | `func_001955C0`, `func_002FF21C` | completion destinations | `func_001955F0`, `func_002FF24C` (+48 each) |
| Dispatch optional record | `func_00203690`, `func_002A2180` | record resolvers | `func_002036C0`, `func_002A21B0` (+48 each) |
| Query presence identity | `func_001D0FAC`, `func_001D0FD0`, `func_001D0FF4` | query destinations | `func_001D0FD0`, `func_001D0FF4`, `func_001D1018` (+36 each) |
| Call then forward | `func_002115A8`, `func_00211F44`, `func_002547C0`, `func_00298E38`, `func_003FB218`, `func_00433058` | prepare and tail destinations | `func_002115B8` (+16), `func_00211F54` (+16), `func_00254E5C` (+1692), `func_00298E48` (+16), `func_003FB228` (+16), `func_00433068` (+16) |
| Read member 26 | `func_00153054`, `func_004D2050` | member resolvers | `func_00153080` (+44), `func_004D20EC` (+156) |
| Read member 27 | `func_00153080`, `func_004D17BC` | member resolvers | `func_001530AC`, `func_004D17E8` (+44 each) |
| Initialize conditionally | `func_00200910`, `func_00200938` | none | `func_00200938`, `func_00200960` (+40 each) |
| Bounded index lookup | `func_003B6150`, `func_004D36DC` | none | `func_003B6178` (+40), `func_004D373C` (+96) |

Update-halfword owns +48..+51 and query-presence owns +32..+35. No
other function owns post-body material. Any bytes after those declared regions
and before the recorded next global are unowned. `DT77_END` must close each
function before its pool or any unowned gap.

## Identity contracts

The two update-halfword slots reuse the distinct batch-19 owned-object-slot
identities already reused by batch 73. The three query-presence slots all reuse
`duplicate_template_22_presence_identity`. Physical equality was checked at
each site. There are no new literal identities.

All 25 direct-destination identity classes are primary ARM entries; there are
no secondary entries in this batch. Every destination is four-byte aligned.
Exact ordered site counts and the pairwise-distinct class contract are normative in
`config/arm-duplicate-templates-77.json`.

## Complete normalized schedules

Equivalent uniquely scoped local-label names are allowed. The implementation
must assemble to these instruction schedules, body sizes, local destinations,
ordered relocations, literal-load destinations, conditional-return sites, and
ownership boundaries. Every external identity remains symbolic.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT77_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT77_END name
.size \name, .-\name
.endm

.macro DT77_UPDATE_HALFWORD name, slot
DT77_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    ldrh r0, [r0, #4]
    mov r5, r1
    cmp r0, r5
    beq .Ldt77_update_done\@
    ldr r0, .Ldt77_update_slot\@
    ldr r2, [r4, #8]
    ldr r0, [r0]
    bl func_00128CBC
    strh r5, [r4, #4]
.Ldt77_update_done\@:
    pop {r4, r5, r6, pc}
DT77_END \name
.Ldt77_update_slot\@:
    .word \slot
.endm

.macro DT77_COMPARE_PAIR name, complete
DT77_BEGIN \name
    push {r6, r7, r11, lr}
    mov r11, r2
    push {r4, r5}
    ldm r1, {r3, r4, r5}
    ldm r0, {r0, r1, r2}
    bics r12, r1, r0, lsl #1
    bicsmi r12, r4, r3, lsl #1
    bpl .Ldt77_compare_done\@
    bl func_00195248
    bl \complete
.Ldt77_compare_done\@:
    pop {r4, r5, r6, r7}
    pop {r11, pc}
DT77_END \name
.endm

.macro DT77_TEST_PAIR name, complete
DT77_BEGIN \name
    push {r6, r7, r11, lr}
    mov r11, r2
    push {r4, r5}
    ldm r1, {r3, r4, r5}
    ldm r0, {r0, r1, r2}
    tst r0, #0x40000000
    tsteq r3, #0x40000000
    bne .Ldt77_test_done\@
    bl func_001955F0
    bl \complete
.Ldt77_test_done\@:
    pop {r4, r5, r6, r7}
    pop {r11, pc}
DT77_END \name
.endm

.macro DT77_DISPATCH_OPTIONAL name, resolver
DT77_BEGIN \name
    push {r4, lr}
    bl \resolver
    cmp r0, #0
    beq .Ldt77_dispatch_return\@
    ldr r1, [r0, #-8]!
    cmp r1, #0
    beq .Ldt77_dispatch_fallback\@
    pop {r4, lr}
    bx r1
.Ldt77_dispatch_fallback\@:
    pop {r4, lr}
    b func_00302108
.Ldt77_dispatch_return\@:
    pop {r4, pc}
DT77_END \name
.endm

.macro DT77_QUERY_PRESENCE name, query
DT77_BEGIN \name
    push {r4, lr}
    ldr r0, [r0, #4]
    mov r4, #0
    bl \query
    cmp r0, #0
    ldrne r4, .Ldt77_presence\@
    mov r0, r4
    pop {r4, pc}
DT77_END \name
.Ldt77_presence\@:
    .word duplicate_template_22_presence_identity
.endm

.macro DT77_CALL_FORWARD name, prepare, destination
DT77_BEGIN \name
    push {r4, lr}
    bl \prepare
    pop {r4, lr}
    b \destination
DT77_END \name
.endm

.macro DT77_READ_MEMBER name, resolver, member
DT77_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r0
    bl func_00168EC0
    mov r1, #0
    mov r0, r5
    bl \resolver
    ldrb r4, [r0, #\member]
    mov r0, r5
    bl func_00168E50
    mov r0, r4
    pop {r4, r5, r6, pc}
DT77_END \name
.endm

.macro DT77_INITIALIZE_CONDITIONALLY name
DT77_BEGIN \name
    push {r4, lr}
    cmp r1, #0
    mov r4, r0
    beq .Ldt77_initialize_absent\@
    bl func_0012FE3C
    b .Ldt77_initialize_done\@
.Ldt77_initialize_absent\@:
    nop
    bl func_0012FE20
.Ldt77_initialize_done\@:
    mov r0, r4
    pop {r4, pc}
DT77_END \name
.endm

.macro DT77_BOUNDED_LOOKUP name
DT77_BEGIN \name
    cmp r1, #6
    ldrcc r0, [r0, r1, lsl #2]
    bxcc lr
    mov r2, #0
    mov r1, r2
    mov r0, r2
    push {r4, lr}
    bl func_0011EF4C
    mov r0, #0
    pop {r4, pc}
DT77_END \name
.endm

DT77_UPDATE_HALFWORD func_00175E24, arm_duplicate_templates_19_owned_object_slot_003B0B80
DT77_UPDATE_HALFWORD func_003B09C4, arm_duplicate_templates_19_owned_object_slot_003B0994
DT77_COMPARE_PAIR func_00195590, func_00195854
DT77_COMPARE_PAIR func_002FF1EC, func_00195160
DT77_TEST_PAIR func_001955C0, func_00195854
DT77_TEST_PAIR func_002FF21C, func_00195160
DT77_DISPATCH_OPTIONAL func_00203690, func_00170CC0
DT77_DISPATCH_OPTIONAL func_002A2180, func_00173304
DT77_QUERY_PRESENCE func_001D0FAC, func_001C5038
DT77_QUERY_PRESENCE func_001D0FD0, func_001C5068
DT77_QUERY_PRESENCE func_001D0FF4, func_001C50C8
DT77_CALL_FORWARD func_002115A8, func_002115B8, func_00160A64
DT77_CALL_FORWARD func_00211F44, func_00173304, func_00160A64
DT77_CALL_FORWARD func_002547C0, func_0024F928, func_00160A64
DT77_CALL_FORWARD func_00298E38, func_0027B858, func_00160A64
DT77_CALL_FORWARD func_003FB218, func_003AB234, func_002FF8C0
DT77_CALL_FORWARD func_00433058, func_00433068, func_002FF8C0
DT77_READ_MEMBER func_00153054, func_0016BC84, 26
DT77_READ_MEMBER func_004D2050, func_0016BD80, 26
DT77_READ_MEMBER func_00153080, func_0016BC84, 27
DT77_READ_MEMBER func_004D17BC, func_0016BD80, 27
DT77_INITIALIZE_CONDITIONALLY func_00200910
DT77_INITIALIZE_CONDITIONALLY func_00200938
DT77_BOUNDED_LOOKUP func_003B6150
DT77_BOUNDED_LOOKUP func_004D36DC
```

## Relocation and canonical-hash contract

Each declared direct transfer emits its ordered `R_ARM_CALL` or
`R_ARM_JUMP24` relocation. Each literal word emits one `R_ARM_ABS32`
relocation to its declared identity. Local branches, conditional returns, and
register-indirect tails emit no relocations. Thus the batch has 52 ordered
relocations: 47 direct and five absolute literal relocations.

Canonical schedules use function order from the JSON. Instruction records are
`name:offset:mnemonic:operands`; external branch operands become their symbol,
literal-load operands become `literal:<identity-key>`, and local branch
operands become `local:+<decimal-offset>`. Local-transfer records are
`name:offset:mnemonic:decimal-target`. Relocation records are
`name:offset:kind:mnemonic:symbol`. Literal-identity records are
`name:loadOffset:slotOffset:identity-key`. Records are joined with LF and end
with one LF. Their SHA-256 values are:

- instruction schedule: `226fd8c1934e613d672965d62664caf30f653c701c21882d360e2e64f5fbc340`
- local-transfer schedule: `e4091ca96542632f2f2fb10237befa532ee1d794a452356d73c0c4077b62766a`
- relocation schedule: `d9d3521d1808588eba20dc423550b5cb62061f221570021ecbc9e225170eda04`
- literal-identity schedule: `0b9d0df40ff8a05e49f173304262aadaa75a384abdefb16aaa337ee0bb1a437a`

## Verification obligations

An implementation reviewer must verify all 25 global `FUNC` symbols, one
function per executable section, exact symbol sizes, the 912-byte/228-
instruction aggregate, the 47 direct transfers, two indirect tails, two
conditional returns, fourteen local branch sites, five literal slots, all
ordered relocations, and the three reused physical literal classes. The two
pool-bearing templates must keep the pool outside the function symbol while
inside the owned section material. Exact target comparison may normalize only
the declared external direct-transfer fields and literal words.
