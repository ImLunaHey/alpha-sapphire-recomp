# Probe-verified duplicate ARM templates 70

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- `sourceSha256`: `7ab2a0899c01f015dfa9aefbf1088b3d1538cace4cbd1a9b2f7d6566ea754d57`.
- Evidence: the evidence-gated target function inventory, current objdiff
  report, a repository-wide configured-function exclusion, normalized
  complete-body grouping, bounded target control/data-flow and post-body
  inspection, primary/secondary branch resolution, literal-identity
  comparison, and an independent GNU Arm Embedded 15.2 mnemonic-only probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, private literal values, target hashes,
  extracted assets, proprietary source, or implementation source.

Every function already exact in the current report and every function named
by any configured batch through duplicate 69, runtime 70, and IPC 66 was
excluded. Candidate selection was restricted to unmatched ARM-state functions
at or above `0x00400000`. Twenty-four functions share twelve complete paired
schedules, totaling 1,584 executable bytes and 396 instructions:

```text
func_0053D290  func_0053ECFC    initialize composite state       132 bytes each
func_0040AB70  func_0040AF1C    preserve halfword around queries  80 bytes each
func_00557248  func_00561840    relink with advanced payload       76 bytes each
func_00554E4C  func_00555BE0    relink payload                     72 bytes each
func_0044D518  func_0044FD00    drive shared owner                 64 bytes each
func_004E504C  func_004E508C    rounded capacity, field 100        64 bytes each
func_004E6C7C  func_004E6CBC    rounded capacity, field 104        64 bytes each
func_004D12A8  func_004D1E10    map and forward                    60 bytes each
func_0056BC60  func_0056BCA0    initialize registered record       60 bytes each
func_0049E758  func_004A57D0    copy stack record                  48 bytes each
func_004B1108  func_004B1224    report zero payload                48 bytes each
func_004D2C18  func_004D3260    normalize byte predicate           24 bytes each
```

## Branch-identity contract

All 56 linked or tail transfers are ARM-to-ARM and four-byte aligned. Thirty-one
destinations are inventoried primary entries. One destination is an aligned
secondary entry without an independent function-start row:

| Secondary symbol | Structural relation | Sites |
| --- | --- | ---: |
| `shared_owner_tail_secondary_70` | `func_0044BD78 + 340`, 68 bytes before `func_0044BF10` | 2 |

The secondary begins at the VFP conversion/accumulation tail selected by both
shared-owner drivers. It is not interchangeable with either neighbouring
primary entry. The secondary and all primary classes are pairwise distinct.

The shared primary destinations and site counts are:

| Destination | Sites | Destination | Sites |
| --- | ---: | --- | ---: |
| `func_00179080` | 2 | `func_001625B4` | 2 |
| `func_001862A0` | 2 | `func_00301FBC` | 2 |
| `func_004160B0` | 2 | `func_004161AC` | 2 |
| `func_001862FC` | 2 | `func_0044C12C` | 2 |
| `func_0044BD78` | 2 | `func_0044BF10` | 2 |
| `func_004B2644` | 4 | `func_004B2674` | 4 |
| `func_00168EC0` | 2 | `func_003A5C74` | 2 |
| `func_00168E50` | 2 | `func_0014648C` | 2 |
| `func_00146464` | 2 | `func_00300B28` | 2 |
| `func_00178974` | 2 | `shared_owner_tail_secondary_70` | 2 |

The twelve singleton classes are the four template-relative self-call entries
(`func_00557248`, `func_00561840`, `func_00554E4C`, and `func_00555BE0`), plus
`func_0056E254`, `func_0018E370`, `func_0016BD80`, `func_00176EFC`,
`func_0012EC80`, `func_0012EF50`, `func_004D1330`, and `func_004D22DC`.
The self calls are symbolic calls to the current expansion, not local numeric
displacements in the source contract.

## Per-template behavior and boundaries

### Initialize composite state

`func_0053D290` and `func_0053ECFC` share a 132-byte schedule. They request
storage through `func_00179080`, install an expansion-specific dispatch
identity, clear five state words, set byte offset 116 to one, initialize the
subobject at offset 128 through `func_001625B4`, clear the pair at offsets 248
and 252, initialize the region at offset 256 through `func_001862A0`, clear
its offsets 8 through 24, and pass the region at offset 288 with size 352 to
`func_00301FBC`. The linked calls are at +12, +60, +92, and +128.

The symbols end at +132. Their dispatch slots are at +200 and their shared
component-config slots are at +204, read by the loads at +16 and +88. Bytes
+132 through +199 are unrelated anonymous material and are not owned by this
template. Template-owned material ends at +207. The next globals begin at
+224 and +1744, respectively.

### Preserve halfword around queries

`func_0040AB70` and `func_0040AF1C` share an 80-byte schedule. They preserve
the halfword at owner field 20, temporarily clear it, pass the owner's leading
two words and an eight-byte stack result to `func_004160B0`, restore the
halfword, retain result halfword six, call `func_004161AC` on the stack result,
then write the retained result halfword to the current owner's field 20.
Calls are at +36 and +60. Both symbols and their containing ranges end at +80.

### Relink list templates

All four relink functions return immediately when entry `r1` is null. A
non-null list retains the owner in `r6`, iterates nodes in `r4`, symbolically
calls its own entry at +28 with the node's offset-12 value, copies the owner's
offset-four value into the current node's offset 12, advances to the original
next pointer, applies its payload helper, installs the current node as the new
owner head, and loops to local offset +20 while another node remains.

The 76-byte variant adds four to the node's offset-16 payload pointer and calls
at +56: `func_00557248` uses `func_0056E254`, while `func_00561840` uses
`func_0018E370`. The 72-byte variant passes the unadvanced offset-16 pointer
and calls shared `func_001862FC` at +52. All four next globals begin exactly at
their body ends.

### Drive shared owner

`func_0044D518` and `func_0044FD00` share a 64-byte schedule and the established
`global_load_11` identity at +64. They load that identity's offset-four owner,
call `func_0044C12C` at +28 with zero, zero, and one control arguments, call
`func_0044BD78` at +40 with the retained entry value, call `func_0044BF10` at
+48, reload the owner, restore integer registers without `pc`, and tail-branch
at +60 to `shared_owner_tail_secondary_70`. Template material ends at +67.
The next globals begin at +96 and +68, respectively.

### Rounded capacity templates

The two offset-100 functions and the two offset-104 functions share the same
64-byte schedule apart from the field displacement. They inspect the selected
field, form the address of owner offset eight, and either tail-call the helper
when the field is zero or call it normally and round the returned capacity up
to a multiple of two raised to the selected field. The only local destination
is +56. `func_004E504C` and `func_004E6C7C` call and tail-branch to
`func_004B2644`; `func_004E508C` and `func_004E6CBC` use `func_004B2674`.
The linked call is at +24 and the tail branch is at +60. The first function in
each pair is immediately followed by its partner; unrelated anonymous material
begins at +64 after the second functions, whose next globals begin at +884 and
+112.

### Map and forward

`func_004D12A8` and `func_004D1E10` share a 60-byte schedule. The deliberate
+4 instruction is exactly `mov r0,r0`. They retain entry `r1` and the word at
entry `r0` offset 12, call `func_00168EC0` at +20, call their expansion-specific
mapper at +32 with a zero second argument, forward the mapper result and the
retained entry value through `func_003A5C74` at +44, then tail-branch to
`func_00168E50` at +56 with the retained offset-12 word. The mappers are
`func_0016BD80` and `func_00176EFC`. The first next global begins at +60;
unrelated anonymous material begins at +60 in the second and its next global
begins at +116.

### Initialize registered record

`func_0056BC60` and `func_0056BCA0` share a 60-byte schedule followed by an
expansion-specific record-type identity at +60. They retain the destination
and fifth incoming argument, store the identity plus the five incoming words
at the destination, call `func_0014648C` at +28 with control value two, and
call `func_00146464` at +48 with the destination, zero, and one. Both return
the destination. Their next globals begin at +64.

### Copy stack record

`func_0049E758` and `func_004A57D0` share a 48-byte schedule followed by an
expansion-specific descriptor identity at +48. They allocate a 64-byte stack
record, pass it and the descriptor to their initializer at +20, then call
`func_00300B28` at +36 to copy all 64 bytes to the retained destination. The
initializers are `func_0012EC80` and `func_0012EF50`. Template material ends at
+51. The first next global begins at +52; unrelated anonymous material begins
at +52 after the second and its next global begins at +156.

### Report zero payload

`func_004B1108` and `func_004B1224` share a 48-byte schedule followed by two
shared identity words. They isolate the low 22 bits of owner field 88. A
nonzero result returns it unchanged. Zero loads the shared diagnostic context
and message identities, calls `func_00178974` at +36 with control values 216
and zero, then returns zero. The only local destination is +44. The context and
message slots are +48 and +52, read at +20 and +24. Template material ends at
+55. The first function is followed by unrelated anonymous material and its
next global at +284; the second next global begins at +56.

### Normalize byte predicate

`func_004D2C18` and `func_004D3260` share a 24-byte schedule. They pass the
word at owner offset 12 to their helper at +8, retain the result's low byte,
and normalize any nonzero low byte to one. The helpers are `func_004D1330` and
`func_004D22DC`. The first is followed by unrelated anonymous material and its
next global at +92; the second next global begins at +24.

## Literal identities

There are fourteen owned pool slots in ten equality classes:

| Identity | Slots | Classification |
| --- | ---: | --- |
| `arm_duplicate_templates_70_composite_dispatch_a_identity` | 1 | new dispatch identity |
| `arm_duplicate_templates_70_composite_dispatch_b_identity` | 1 | new dispatch identity |
| `arm_duplicate_templates_70_component_config_identity` | 2 | new shared component-config identity |
| `global_load_11` | 2 | reused initialized-global identity |
| `arm_duplicate_templates_70_registered_record_a_identity` | 1 | new record-type identity |
| `arm_duplicate_templates_70_registered_record_b_identity` | 1 | new record-type identity |
| `arm_duplicate_templates_70_stack_descriptor_a_identity` | 1 | new descriptor identity |
| `arm_duplicate_templates_70_stack_descriptor_b_identity` | 1 | new descriptor identity |
| `arm_duplicate_templates_70_diagnostic_context_identity` | 2 | new diagnostic-context identity |
| `arm_duplicate_templates_70_diagnostic_message_identity` | 2 | new diagnostic-message identity |

All ten classes are pairwise distinct. `global_load_11` deliberately reuses
the identity already established by the adjacent-global-load contract. Each
of the other nine classes is distinct from every previously configured
literal identity. No private value is part of this contract.

## Complete exact schedules

The implementation may use equivalent uniquely scoped local-label spellings,
but must assemble to these schedules, body sizes, relocations, and pool
positions. `DT70_BEGIN` places every expansion in its own function section;
`DT70_END` closes the function symbol before any owned pool word.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT70_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT70_END name
.size \name, .-\name
.endm

.macro DT70_COMPOSITE name, dispatch
DT70_BEGIN \name
    push {r3, r4, r5, lr}
    mov r2, sp
    mov r1, #2
    bl func_00179080
    ldr r2, .Ldt70_dispatch_\@
    mov r5, #0
    mov r1, #1
    str r2, [r0]
    str r5, [r0, #104]
    str r5, [r0, #108]
    str r5, [r0, #112]
    strb r1, [r0, #116]
    str r5, [r0, #120]
    mov r1, r5
    add r0, r0, #128
    bl func_001625B4
    sub r0, r0, #128
    add r3, r0, #248
    mov r1, #0
    mov r2, r1
    stm r3, {r1, r2}
    add r0, r0, #256
    ldr r1, .Ldt70_config_\@
    bl func_001862A0
    str r5, [r0, #8]
    sub r4, r0, #256
    str r5, [r0, #12]
    str r5, [r0, #16]!
    mov r1, #352
    str r5, [r0, #4]
    str r5, [r0, #8]
    add r0, r4, #288
    bl func_00301FBC
DT70_END \name
    .org 200
.Ldt70_dispatch_\@:
    .word \dispatch
.Ldt70_config_\@:
    .word arm_duplicate_templates_70_component_config_identity
.endm

.macro DT70_PRESERVE name
DT70_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    sub sp, sp, #8
    ldr r5, [r4]
    mov r0, #0
    ldrh r6, [r5, #20]
    strh r0, [r5, #20]
    ldm r4, {r1, r2}
    mov r0, sp
    bl func_004160B0
    mov r0, sp
    strh r6, [r5, #20]
    ldrh r0, [r0, #6]
    mov r5, r0
    mov r0, sp
    bl func_004161AC
    ldr r1, [r4]
    strh r5, [r1, #20]
    add sp, sp, #8
    pop {r4, r5, r6, pc}
DT70_END \name
.endm

.macro DT70_RELINK_ADV name, advance
DT70_BEGIN \name
    cmp r1, #0
    bxeq lr
    push {r4, r5, r6, lr}
    mov r6, r0
    mov r4, r1
.Ldt70_relink_adv_loop_\@:
    mov r0, r6
    ldr r1, [r4, #12]
    bl \name
    ldr r1, [r6, #4]
    add r0, r4, #16
    mov r5, r4
    ldr r4, [r4, #8]
    add r0, r0, #4
    str r1, [r5, #12]
    bl \advance
    cmp r4, #0
    str r5, [r6, #4]
    bne .Ldt70_relink_adv_loop_\@
    pop {r4, r5, r6, pc}
DT70_END \name
.endm

.macro DT70_RELINK name
DT70_BEGIN \name
    cmp r1, #0
    bxeq lr
    push {r4, r5, r6, lr}
    mov r6, r0
    mov r4, r1
.Ldt70_relink_loop_\@:
    mov r0, r6
    ldr r1, [r4, #12]
    bl \name
    ldr r1, [r6, #4]
    mov r5, r4
    add r0, r4, #16
    ldr r4, [r4, #8]
    str r1, [r5, #12]
    bl func_001862FC
    cmp r4, #0
    str r5, [r6, #4]
    bne .Ldt70_relink_loop_\@
    pop {r4, r5, r6, pc}
DT70_END \name
.endm

.macro DT70_DRIVE name
DT70_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r5, .Ldt70_owner_\@
    mov r2, #0
    mov r3, #1
    mov r1, r2
    ldr r0, [r5, #4]
    bl func_0044C12C
    ldr r0, [r5, #4]
    mov r1, r4
    bl func_0044BD78
    ldr r0, [r5, #4]
    bl func_0044BF10
    ldr r0, [r5, #4]
    pop {r4, r5, r6, lr}
    b shared_owner_tail_secondary_70
DT70_END \name
.Ldt70_owner_\@:
    .word global_load_11
.endm

.macro DT70_ROUND name, field, helper
DT70_BEGIN \name
    push {r4, lr}
    mov r4, r0
    ldr r0, [r0, #\field]
    cmp r0, #0
    add r0, r4, #8
    beq .Ldt70_round_tail_\@
    bl \helper
    mov r1, r0
    ldr r0, [r4, #\field]
    mov r2, #1
    add r1, r1, r2, lsl r0
    sub r1, r1, #1
    mov r0, r1, lsr r0
    pop {r4, pc}
.Ldt70_round_tail_\@:
    pop {r4, lr}
    b \helper
DT70_END \name
.endm

.macro DT70_MAP name, mapper
DT70_BEGIN \name
    ldr r0, [r0, #12]
    mov r0, r0
    push {r4, r5, r6, lr}
    mov r4, r1
    mov r5, r0
    bl func_00168EC0
    mov r1, #0
    mov r0, r5
    bl \mapper
    mov r1, r0
    mov r0, r4
    bl func_003A5C74
    mov r0, r5
    pop {r4, r5, r6, lr}
    b func_00168E50
DT70_END \name
.endm

.macro DT70_REGISTER name, identity
DT70_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, .Ldt70_record_\@
    ldr r5, [sp, #16]
    stm r4, {r0, r1, r2, r3, r5}
    mov r1, #2
    mov r0, r5
    bl func_0014648C
    mov r3, #1
    mov r2, #0
    mov r1, r4
    mov r0, r5
    bl func_00146464
    mov r0, r4
    pop {r4, r5, r6, pc}
DT70_END \name
.Ldt70_record_\@:
    .word \identity
.endm

.macro DT70_COPY name, init, descriptor
DT70_BEGIN \name
    push {r4, lr}
    sub sp, sp, #64
    mov r4, r0
    ldr r1, .Ldt70_descriptor_\@
    mov r0, sp
    bl \init
    mov r2, #64
    mov r1, sp
    mov r0, r4
    bl func_00300B28
    add sp, sp, #64
    pop {r4, pc}
DT70_END \name
.Ldt70_descriptor_\@:
    .word \descriptor
.endm

.macro DT70_REPORT name
DT70_BEGIN \name
    push {r4, lr}
    ldr r0, [r0, #88]
    mov r1, r0, lsl #10
    movs r1, r1, lsr #10
    bne .Ldt70_report_done_\@
    ldr r2, .Ldt70_diag_context_\@
    ldr r0, .Ldt70_diag_message_\@
    mov r3, #0
    mov r1, #216
    bl func_00178974
    mov r0, #0
.Ldt70_report_done_\@:
    pop {r4, pc}
DT70_END \name
.Ldt70_diag_context_\@:
    .word arm_duplicate_templates_70_diagnostic_context_identity
.Ldt70_diag_message_\@:
    .word arm_duplicate_templates_70_diagnostic_message_identity
.endm

.macro DT70_NORMALIZE name, helper
DT70_BEGIN \name
    push {r4, lr}
    ldr r0, [r0, #12]
    bl \helper
    ands r0, r0, #255
    movne r0, #1
    pop {r4, pc}
DT70_END \name
.endm

DT70_COMPOSITE func_0053D290, arm_duplicate_templates_70_composite_dispatch_a_identity
DT70_COMPOSITE func_0053ECFC, arm_duplicate_templates_70_composite_dispatch_b_identity
DT70_PRESERVE func_0040AB70
DT70_PRESERVE func_0040AF1C
DT70_RELINK_ADV func_00557248, func_0056E254
DT70_RELINK_ADV func_00561840, func_0018E370
DT70_RELINK func_00554E4C
DT70_RELINK func_00555BE0
DT70_DRIVE func_0044D518
DT70_DRIVE func_0044FD00
DT70_ROUND func_004E504C, 100, func_004B2644
DT70_ROUND func_004E508C, 100, func_004B2674
DT70_ROUND func_004E6C7C, 104, func_004B2644
DT70_ROUND func_004E6CBC, 104, func_004B2674
DT70_MAP func_004D12A8, func_0016BD80
DT70_MAP func_004D1E10, func_00176EFC
DT70_REGISTER func_0056BC60, arm_duplicate_templates_70_registered_record_a_identity
DT70_REGISTER func_0056BCA0, arm_duplicate_templates_70_registered_record_b_identity
DT70_COPY func_0049E758, func_0012EC80, arm_duplicate_templates_70_stack_descriptor_a_identity
DT70_COPY func_004A57D0, func_0012EF50, arm_duplicate_templates_70_stack_descriptor_b_identity
DT70_REPORT func_004B1108
DT70_REPORT func_004B1224
DT70_NORMALIZE func_004D2C18, func_004D1330
DT70_NORMALIZE func_004D3260, func_004D22DC
```

## Probe result and implementation constraints

The neutral probe expanded all 24 schedules with undefined symbols for every
external transfer and literal identity. It established:

- ARM mode and four-byte alignment for every expansion;
- exact body sizes totaling 1,584 bytes and 396 instructions;
- exact equality of every non-symbolic body field against every bounded target
  body, including all ten local destinations;
- 56 direct-transfer relocations at exactly the configured offsets and with
  the configured `R_ARM_CALL` or `R_ARM_JUMP24` kinds;
- fourteen `R_ARM_ABS32` pool relocations in exactly ten equality classes;
- exact PC-relative reach from every literal load to its configured pool slot;
- no body, owned slot, or configured anonymous boundary overlaps another
  inventoried global; and
- exact primary destinations, template-relative self destinations, and the
  secondary-entry structural relation.

Implementation must preserve the exact schedules, register choices, condition
codes, local-label offsets, symbolic transfer identities, pool positions,
literal-use displacements, and identity equality classes. The +132 through
+199 gaps in the composite sections are placement gaps only: they must not be
filled with target-derived anonymous material. No private value may be encoded
or substituted for a symbolic identity.
