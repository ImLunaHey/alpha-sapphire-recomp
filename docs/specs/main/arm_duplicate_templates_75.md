# Probe-verified duplicate ARM templates 75

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- `sourceSha256`: `34b5331b5b761e5b52b80f9f2647458910e4389c3e18a56ea867ef5b43dcdd9a`.
- Evidence: the evidence-gated function inventory, current objdiff report,
  repository-wide configured-function exclusion, normalized complete-body
  grouping, bounded target control/data-flow and post-body inspection,
  primary and secondary branch resolution, physical literal equality
  comparison, and an independent GNU Arm Embedded 15.2 mnemonic-only probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, target hashes, private strings or
  values, extracted assets, proprietary source, or implementation source.

Every exact function in the current report and every function already owned
by a configuration file was excluded. The final cohort was rechecked against
all 24 runtime-78 reservations and is disjoint. The two largest remaining
normalized candidates were rejected because their symbols end on a link call
rather than a return or tail-transfer boundary. The selected 24 ARM-state
functions therefore comprise eleven complete schedules, 2,432 executable
bytes, and 608 instructions:

| Template | Functions | Bytes each | Total |
| --- | ---: | ---: | ---: |
| Initialize pointer vector | 2 | 120 | 240 |
| Grow record arena | 2 | 120 | 240 |
| Register six fields | 2 | 120 | 240 |
| Visit matching member | 2 | 116 | 232 |
| Replace owned dispatch | 2 | 112 | 224 |
| Clear ready flag | 4 | 56 | 224 |
| Register five fields | 2 | 108 | 216 |
| Construct linked node | 2 | 104 | 208 |
| Format bounded pair | 2 | 104 | 208 |
| Submit render context | 2 | 104 | 208 |
| Guarded service exchange | 2 | 96 | 192 |

The schedules contain 76 symbolic direct external transfers, two
register-indirect calls, four conditional register returns, 42 local branch
sites, and 30 literal slots belonging to twenty physical identity classes.
All body sizes, operands, local destinations, transfer classes, literal-load
destinations, function boundaries, post-body ownership, and pool identities
were independently assembled and compared. Only external direct-transfer
displacements and declared literal contents were normalized.

## Function map and boundaries

| Template | Functions | Variant parameters | Next globals (relative offset) |
| --- | --- | --- | --- |
| Initialize pointer vector | `func_0011F1F0`, `func_0011F698` | constructors `func_0012BE2C`, `func_0012C310`; descriptor identities A/B | `func_0011F26C`, `func_0011F714` (+124 each) |
| Grow record arena | `func_0018D65C`, `func_0056EA28` | none | `func_0018D6D4`, `func_0056EAA0` (+120 each) |
| Register six fields | `func_002C9948`, `func_002C9C70` | writers `func_002CA48C`, `func_002CA3D4` | `func_002C99C4`, `func_002C9CEC` (+124 each) |
| Visit matching member | `func_00176E58`, `func_004D06AC` | visitors `func_0017D140`, `func_004D04F8` | `func_00176EFC` (+164), `func_004D0748` (+156) |
| Replace owned dispatch | `func_00250C50`, `func_00250F0C` | dispatch identities A/B | `func_00250F0C` (+700), `func_0025104C` (+320) |
| Clear ready flag | `func_00146530`, `func_001623E8`, `func_002132EC`, `func_00224D80` | none | `func_00146568`, `func_00162420`, `func_00213324` (+56 each); `func_00224FC0` (+576) |
| Register five fields | `func_002C9C00`, `func_002C9F50` | writers `func_002CA3D4`, `func_002CA48C` | `func_002C9C70`, `func_002C9FC0` (+112 each) |
| Construct linked node | `func_002960E0`, `func_0029A14C` | node identities A/B | `func_00296168` (+136), `func_0029A364` (+536) |
| Format bounded pair | `func_002CC620`, `func_002CC708` | formatters `func_002CCA90`, `func_002CCC14` | `func_002CC708` (+232), `func_002CC778` (+112) |
| Submit render context | `func_003A338C`, `func_003A3500` | resource/table/output identities A/B | `func_003A3404`, `func_003A3578` (+120 each) |
| Guarded service exchange | `func_002C3FD0`, `func_002C42C8` | exchanges `func_002C5640`, `func_002C5744` | `func_002C4040`, `func_002C4338` (+112 each) |

Every declared pool begins immediately after its function body. Pointer-vector
and six-field pools own one word; replace-dispatch, five-field, and linked-node
pools own one word; bounded-format pools own two words; render and service
pools own four words. Functions without a declared pool own no post-body
bytes. Any gap after the declared material and before the recorded next global
is unowned. `DT75_END` must close the function before every pool and every
unowned gap.

## Identity contracts

The 30 physical slots form twenty classes. Three reuse already configured
identities:

| Identity | Sites | Contract |
| --- | ---: | --- |
| `service_nonpositive_result_42` | 2 | reused nonpositive-result identity |
| `ipc_render_context_54` | 2 | reused render-context identity |
| `service_state_block_31` | 2 | reused service-state identity |

The field-registry identity is shared by all four register-field functions.
The format empty-result identity is shared by both format functions. The
service guard, inactive-result, and sentinel identities are each shared by the
two service functions. Every other new identity is a singleton per variant.
The seventeen new classes are pairwise distinct and physically unequal to
every configured literal identity.

One direct destination is a secondary entry:

| Symbol | Owner relation | Boundary relation |
| --- | --- | --- |
| `arm_duplicate_templates_75_allocator_preentry` | `func_00184744` +584 | 4 bytes before `func_00184990` |

It is the established allocation pre-entry used by both replace-dispatch and
both linked-node functions. All direct destinations are ARM-state,
four-byte-aligned, and pairwise distinct across the primary and secondary
identity sets. Exact site counts and ownership relations are normative in
`config/arm-duplicate-templates-75.json`.

## Complete normalized schedules

Equivalent uniquely scoped local-label names are allowed. The implementation
must assemble to these instruction schedules, body sizes, local destinations,
ordered relocations, literal-load destinations, and ownership boundaries.
The schedules intentionally leave every external identity symbolic.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT75_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT75_END name
.size \name, .-\name
.endm

.macro DT75_POINTER_VECTOR name, constructor, descriptor
DT75_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    mov r5, r0
    mov r7, r1
    ldr r1, .Ldt75_vector_descriptor\@
    mov r0, #0
    str r0, [r5, #4]
    str r1, [r5]
    strb r0, [r5, #9]
    mov r6, r2
    lsl r0, r2, #2
    mov r1, r7
    strb r2, [r5, #8]
    bl func_0012344C
    cmp r6, #0
    mov r4, #0
    str r0, [r5, #4]
    bls .Ldt75_vector_done\@
.Ldt75_vector_loop\@:
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
    bcc .Ldt75_vector_loop\@
.Ldt75_vector_done\@:
    mov r0, r5
    pop {r4, r5, r6, r7, r8, pc}
DT75_END \name
.Ldt75_vector_descriptor\@:
    .word \descriptor
.endm

.macro DT75_GROW_ARENA name
DT75_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r0
    ldr r0, [r0]
    cmp r1, #0
    mov r4, #1
    bne .Ldt75_grow_ready\@
    cmp r0, #0
    moveq r4, #32
    beq .Ldt75_grow_ready\@
    ldr r0, [r0, #4]
    add r1, r0, r0, lsr #1
    add r4, r1, r0, lsr #3
    add r0, r0, #32
    cmp r0, r4
    movhi r4, r0
.Ldt75_grow_ready\@:
    mov r0, #12
    bl func_00184990
    mov r6, r0
    rsb r0, r4, r4, lsl #3
    lsl r0, r0, #4
    bl func_00184990
    str r0, [r6, #8]
    ldr r0, [r5]
    rsb r1, r4, r4, lsl #3
    stm r6, {r0, r4}
    str r6, [r5]
    ldr r0, [r6, #8]
    add r1, r0, r1, lsl #4
    strd r0, [r5, #8]
    pop {r4, r5, r6, pc}
DT75_END \name
.endm

.macro DT75_REGISTER_SIX name, writer
DT75_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r5, .Ldt75_six_registry\@
    mov r0, #0
    mov r2, #1
    mov r1, r4
    str r0, [r5]
    bl \writer
    mov r2, #1
    add r1, r4, #1
    mov r0, r2
    bl \writer
    mov r2, #4
    add r1, r4, #4
    mov r0, #2
    bl \writer
    mov r2, #4
    add r1, r4, #8
    mov r0, #3
    bl \writer
    mov r2, #4
    add r1, r4, #12
    mov r0, r2
    bl \writer
    mov r2, #1
    add r1, r4, #2
    mov r0, #5
    bl \writer
    ldr r0, [r5]
    pop {r4, r5, r6, pc}
DT75_END \name
.Ldt75_six_registry\@:
    .word arm_duplicate_templates_75_field_registry_identity
.endm

.macro DT75_VISIT_MATCH name, visitor
DT75_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    mov r5, r0
    mov r6, r1
    ldr r0, [r0, #8]
    mov r7, r2
    mov r4, #0
    cmp r0, #0
    bls .Ldt75_visit_miss\@
.Ldt75_visit_loop\@:
    ldr r0, [r5, #4]
    ldr r0, [r0, r4, lsl #2]
    ldrh r0, [r0, #4]
    cmp r0, r6
    nop
    bne .Ldt75_visit_next\@
    ldr r0, [r5, #4]
    mov r6, #1
    mov r1, r7
    ldr r0, [r0, r4, lsl #2]
    bl \visitor
    nop
    nop
    b .Ldt75_visit_done\@
.Ldt75_visit_next\@:
    ldr r0, [r5, #8]
    add r4, r4, #1
    cmp r0, r4
    bhi .Ldt75_visit_loop\@
.Ldt75_visit_miss\@:
    mov r6, #0
.Ldt75_visit_done\@:
    mov r0, r6
    pop {r4, r5, r6, r7, r8, pc}
DT75_END \name
.endm

.macro DT75_REPLACE_DISPATCH name, dispatch_identity
DT75_BEGIN \name
    cmp r1, #0
    bxne lr
    push {r3, r4, r5, lr}
    mov r4, r0
    mov r1, #1
    bl func_002A47F8
    mov r0, #1
    strb r0, [sp]
    mov r1, sp
    add r0, r4, #16
    bl func_0056DCE4
    ldr r4, [r0, #20]
    mov r0, #4
    bl arm_duplicate_templates_75_allocator_preentry
    cmp r0, #0
    moveq r5, #0
    beq .Ldt75_replace_allocated\@
    ldr r1, .Ldt75_replace_dispatch\@
    mov r5, r0
    str r1, [r0]
.Ldt75_replace_allocated\@:
    ldr r0, [r4, #28]
    cmp r0, #0
    beq .Ldt75_replace_store\@
    ldr r1, [r0]
    ldr r1, [r1, #4]
    blx r1
.Ldt75_replace_store\@:
    str r5, [r4, #28]
    pop {r3, r4, r5, pc}
DT75_END \name
.Ldt75_replace_dispatch\@:
    .word \dispatch_identity
.endm

.macro DT75_CLEAR_READY name
DT75_BEGIN \name
    push {r4, lr}
    mov r4, r0
    bl func_00171448
    cmp r0, #0
    beq .Ldt75_clear_done\@
    add r1, r4, #16
    mov r0, r4
    mov r0, #1
    cmp r0, #0
    beq .Ldt75_clear_done\@
    mov r0, #0
    strb r0, [r4, #13]
    mov r0, #1
.Ldt75_clear_done\@:
    pop {r4, pc}
DT75_END \name
.endm

.macro DT75_REGISTER_FIVE name, writer
DT75_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r5, .Ldt75_five_registry\@
    mov r0, #0
    mov r2, #1
    mov r1, r4
    str r0, [r5]
    mov r0, #24
    bl \writer
    mov r2, #1
    add r1, r4, #1
    mov r0, #25
    bl \writer
    mov r2, #1
    add r1, r4, #2
    mov r0, #26
    bl \writer
    mov r2, #4
    add r1, r4, #4
    mov r0, #27
    bl \writer
    mov r2, #4
    add r1, r4, #8
    mov r0, #28
    bl \writer
    ldr r0, [r5]
    pop {r4, r5, r6, pc}
DT75_END \name
.Ldt75_five_registry\@:
    .word arm_duplicate_templates_75_field_registry_identity
.endm

.macro DT75_LINKED_NODE name, node_identity
DT75_BEGIN \name
.Ldt75_node_start\@:
    push {r4, r5, r6, lr}
    mov r4, r1
    mov r1, #1
    bl func_00178DFC
    ldr r1, .Ldt75_node_vtable\@
    cmp r4, #0
    mov r5, r0
    str r1, [r0]
    beq .Ldt75_node_done\@
    mov r0, #68
    strh r4, [r5, #32]
    bl arm_duplicate_templates_75_allocator_preentry
    cmp r0, #0
    moveq r6, #0
    beq .Ldt75_node_child_ready\@
    mov r1, #0
    bl .Ldt75_node_start\@
    mov r6, r0
.Ldt75_node_child_ready\@:
    nop
    bl func_00178A6C
    ldr r0, [r0, #12]
    mov r2, r6
    mov r1, r4
    bl func_0017933C
.Ldt75_node_done\@:
    mov r0, r5
    pop {r4, r5, r6, pc}
DT75_END \name
.Ldt75_node_vtable\@:
    .word \node_identity
.endm

.macro DT75_FORMAT_PAIR name, formatter
DT75_BEGIN \name
    cmp r1, #0
    cmpne r2, #0
    ldreq r0, .Ldt75_format_empty\@
    bxeq lr
    push {r4, r5, r6, r7, lr}
    mov r4, r0
    sub sp, sp, #12
    ldr r0, [r0, #4]
    mov r6, r1
    mov r5, r2
    cmp r0, #0
    ldrle r0, .Ldt75_format_nonpositive\@
    ble .Ldt75_format_done\@
    mov r0, r2
    bl func_002FF034
    add r7, r0, #1
    mov r0, r6
    bl func_002FF034
    add r3, r0, #1
    stm sp, {r5, r7}
    ldr r1, [r4, #4]
    mov r2, r6
    add r0, r4, #12
    bl \formatter
.Ldt75_format_done\@:
    add sp, sp, #12
    pop {r4, r5, r6, r7, pc}
DT75_END \name
.Ldt75_format_empty\@:
    .word arm_duplicate_templates_75_format_empty_result_identity
.Ldt75_format_nonpositive\@:
    .word service_nonpositive_result_42
.endm

.macro DT75_RENDER name, resource_identity, table_identity, output_identity
DT75_BEGIN \name
    push {r4, r5, r6, lr}
    cmp r2, #0
    ldr r6, .Ldt75_render_context\@
    mov r4, r0
    mov r5, r1
    beq .Ldt75_render_prepared\@
    ldr r0, [r6, #72]
    mov r1, #1
    bl func_0017C0E4
.Ldt75_render_prepared\@:
    ldr r0, .Ldt75_render_resource\@
    mov r2, #1
    mov r1, #16
    bl func_0016DFE8
    ldr r0, .Ldt75_render_table\@
    mov r2, #1
    mov r1, #48
    bl func_0016DFE8
    ldr r0, [r6, #72]
    mov r2, r5
    mov r1, r4
    bl func_0017C360
    pop {r4, r5, r6, lr}
    mov r2, #1
    ldr r0, .Ldt75_render_output\@
    mov r1, #48
    b func_0016DFE8
DT75_END \name
.Ldt75_render_context\@:
    .word ipc_render_context_54
.Ldt75_render_resource\@:
    .word \resource_identity
.Ldt75_render_table\@:
    .word \table_identity
.Ldt75_render_output\@:
    .word \output_identity
.endm

.macro DT75_SERVICE_EXCHANGE name, exchange
DT75_BEGIN \name
    push {r3, r4, r5, lr}
    ldr r4, .Ldt75_service_guard\@
    mov r0, r4
    bl func_001602B8
    ldr r0, .Ldt75_service_state\@
    ldrb r1, [r0, #1]
    cmp r1, #0
    ldreq r5, .Ldt75_service_inactive\@
    beq .Ldt75_service_done\@
    ldr r0, [r0, #12]
    str r0, [sp]
    mov r0, sp
    bl \exchange
    ldr r1, .Ldt75_service_sentinel\@
    mov r5, r0
    cmp r0, r1
    bne .Ldt75_service_done\@
    mov r1, pc
    lsrs r2, r5, #31
    blne func_00124FB0
.Ldt75_service_done\@:
    mov r0, r4
    bl func_00160380
    mov r0, r5
    pop {r3, r4, r5, pc}
DT75_END \name
.Ldt75_service_guard\@:
    .word arm_duplicate_templates_75_service_guard_identity
.Ldt75_service_state\@:
    .word service_state_block_31
.Ldt75_service_inactive\@:
    .word arm_duplicate_templates_75_service_inactive_result_identity
.Ldt75_service_sentinel\@:
    .word arm_duplicate_templates_75_service_sentinel_identity
.endm

DT75_POINTER_VECTOR func_0011F1F0, func_0012BE2C, arm_duplicate_templates_75_vector_descriptor_a_identity
DT75_POINTER_VECTOR func_0011F698, func_0012C310, arm_duplicate_templates_75_vector_descriptor_b_identity
DT75_GROW_ARENA func_0018D65C
DT75_GROW_ARENA func_0056EA28
DT75_REGISTER_SIX func_002C9948, func_002CA48C
DT75_REGISTER_SIX func_002C9C70, func_002CA3D4
DT75_VISIT_MATCH func_00176E58, func_0017D140
DT75_VISIT_MATCH func_004D06AC, func_004D04F8
DT75_REPLACE_DISPATCH func_00250C50, arm_duplicate_templates_75_dispatch_vtable_a_identity
DT75_REPLACE_DISPATCH func_00250F0C, arm_duplicate_templates_75_dispatch_vtable_b_identity
DT75_CLEAR_READY func_00146530
DT75_CLEAR_READY func_001623E8
DT75_CLEAR_READY func_002132EC
DT75_CLEAR_READY func_00224D80
DT75_REGISTER_FIVE func_002C9C00, func_002CA3D4
DT75_REGISTER_FIVE func_002C9F50, func_002CA48C
DT75_LINKED_NODE func_002960E0, arm_duplicate_templates_75_node_vtable_a_identity
DT75_LINKED_NODE func_0029A14C, arm_duplicate_templates_75_node_vtable_b_identity
DT75_FORMAT_PAIR func_002CC620, func_002CCA90
DT75_FORMAT_PAIR func_002CC708, func_002CCC14
DT75_RENDER func_003A338C, arm_duplicate_templates_75_render_resource_a_identity, arm_duplicate_templates_75_render_table_a_identity, arm_duplicate_templates_75_render_output_a_identity
DT75_RENDER func_003A3500, arm_duplicate_templates_75_render_resource_b_identity, arm_duplicate_templates_75_render_table_b_identity, arm_duplicate_templates_75_render_output_b_identity
DT75_SERVICE_EXCHANGE func_002C3FD0, func_002C5640
DT75_SERVICE_EXCHANGE func_002C42C8, func_002C5744
```

## Implementation and verification contract

The implementation must use one allocatable executable section per function,
four-byte alignment, global function symbols with exact body sizes, and pool
words outside `.size`. It must preserve all local branch destinations, the two
`blx r1` sites, both `bxne lr` sites, both `bxeq lr` sites, both recursive
local links, and the ordered 76 branch plus 30 absolute-word relocations.

The validator must independently assemble the implementation, require 24
functions and 2,432 body bytes, verify the eleven template counts, inspect
only the declared function sections with a 16 MiB command-output buffer,
check the secondary-entry relation, validate all pool ownership boundaries,
and compare each normalized body and owned pool against the target evidence.
The cohort is pinned to the source digest above and is accepted only when that
digest and the complete validator contract both pass.
