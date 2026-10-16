# Probe-verified duplicate ARM templates 79

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- `sourceSha256`: `PENDING` until a separate implementer supplies the source.
- Probe tool: GNU assembler from Arm GNU Toolchain 15.2.Rel1, binutils
  2.45.1.20251203.
- Evidence: the current objdiff report, the evidence-gated symbol inventory,
  repository-wide configured/owned/referenced-name exclusion, normalized
  complete-body grouping, bounded target control/data-flow and post-body
  inspection, branch resolution, physical literal comparison, and an
  independent mnemonic-only assembly probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, target hashes, private strings or
  values, extracted assets, proprietary source, or implementation source.

Every exact function in the current report and every function name already
configured, owned, reserved, or referenced by existing configuration and
specification metadata was excluded. The largest remaining normalized pair
and a further 28-byte pair were rejected because their inventoried bodies end
on link calls. The selected 24 ARM-state functions are still unmatched,
pairwise non-overlapping, and form twelve two-member templates. They comprise
464 executable body bytes and 116 instructions:

| Template | Functions | Bytes each | Total |
| --- | ---: | ---: | ---: |
| Release global object | 2 | 36 | 72 |
| Optional flagged tail | 2 | 32 | 64 |
| Install tag then tail | 2 | 28 | 56 |
| Set identity then call | 2 | 24 | 48 |
| Load source then tail | 2 | 16 | 32 |
| Indexed address tail | 2 | 16 | 32 |
| Optional value tail | 2 | 16 | 32 |
| Load member then tail | 2 | 16 | 32 |
| Literal service tail | 2 | 12 | 24 |
| Call preserving r0 | 2 | 12 | 24 |
| Fixed-argument tail | 2 | 12 | 24 |
| Store identity tail | 2 | 12 | 24 |

The schedules contain 26 symbolic direct transfers: eight calls and eighteen
tail branches. They also contain six local branch sites and ten return sites.
There are no register-indirect calls, register-indirect tails, or conditional
returns. Sixteen literal slots belong to eleven identity classes. Two `adr`
sites address distinct post-body descriptors at +16 without owning those
bytes. Only external direct-transfer displacements, declared literal contents,
and the two declared address-reference immediates were normalized during the
independent target comparison.

## Function map and boundaries

| Template | Functions | Variant parameters | Next globals (relative offset) |
| --- | --- | --- | --- |
| Release global object | `func_002C27B0`, `func_002C2C48` | owned slots A/B | `func_002C27D8`, `func_002C2C70` (+40 each) |
| Optional flagged tail | `func_00171F38`, `func_00171F5C` | tail destinations | `func_00171F5C`, `func_00171F80` (+36 each) |
| Install tag then tail | `func_00206070`, `func_002B005C` | none | `func_002060AC` (+60), `func_002B007C` (+32) |
| Set identity then call | `func_0033A3C0`, `func_0033A3FC` | call destinations | `func_0033A3FC` (+60), `func_0033A418` (+28) |
| Load source then tail | `func_0014EB1C`, `func_0014EBB4` | tail destinations | `func_0014EB30`, `func_0014EBC8` (+20 each) |
| Indexed address tail | `func_00298E60`, `func_00298EA8` | distinct address-only descriptors | `func_00298E78` (+24), `func_00298EC4` (+28) |
| Optional value tail | `func_002C20AC`, `func_00520B18` | tail destinations | `func_002C20BC` (+16), `func_00520C7C` (+356) |
| Load member then tail | `func_004AC6FC`, `func_004B1E0C` | member identities A/B | `func_004AC710`, `func_004B1E20` (+20 each) |
| Literal service tail | `func_00164F44`, `func_00164F54` | tail destinations | `func_00164F54`, `func_00164F64` (+16 each) |
| Call preserving r0 | `func_001A3958`, `func_00300980` | call destinations | `func_001A3964`, `func_0030098C` (+12 each) |
| Fixed-argument tail | `func_004175B8`, `func_004175C4` | tail destinations | `func_004175C4`, `func_004175D0` (+12 each) |
| Store identity tail | `func_0032BD18`, `func_003B8038` | stored identities A/B and tail destinations | `func_0032BD58` (+64), `func_003BA9C0` (+10632) |

Every literal-owning function owns its one four-byte slot immediately after
the body; its `templateMaterialEndOffset` is therefore body size +3. No other
post-body bytes are owned. In particular, the indexed-address descriptors at
+16 are referenced but not owned. Any remaining bytes before a more distant
next global are unowned by this batch. `DT79_END` closes each function before
its literal slot, referenced descriptor, or unowned gap.

## Identity contracts

The sixteen literal sites form eleven physical classes. The two optional-flag
slots reuse `ipc_allocator_dispatch_owner_68`, and the two literal-service
slots reuse `service_lifecycle_object_43`; equality with their configured
sites was physically verified. The other nine classes are new, pairwise
distinct, and distinct from every configured literal class. The record tag,
constructor tag, and source context are each shared by their two template
members. Both release slots, both member keys, and both stored identities are
pairwise distinct.

The 26 direct sites resolve to nineteen pairwise-distinct destination classes.
Seven primary classes occur twice: `func_002C20AC`, `func_001602B8`,
`func_00160380`, `func_001862FC`, `func_00160A64`, `func_0018BF20`, and
`func_0017F3F8`. The remaining twelve classes are singletons. One singleton is
a secondary ARM entry and must retain this relation:

| Symbol | Owner relation | Next global | Bytes before next global |
| --- | --- | --- | ---: |
| `arm_duplicate_templates_79_secondary_0041729C` | `func_0041728C` +16 | `func_0041735C` | 192 |

All direct destinations are four-byte aligned. The secondary relation names
an entry address only; this batch does not own its bytes. Exact ordered sites,
literal classes, address-reference sites, and ownership boundaries are
normative in `config/arm-duplicate-templates-79.json`.

## Complete normalized schedules

Equivalent uniquely scoped local-label names are allowed. Every external
identity must remain symbolic. Offsets, operands, local destinations,
relocation kinds, function sizes, literal-load destinations, address-reference
targets, and ownership boundaries are exact.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT79_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT79_END name
.size \name,.-\name
.endm

.macro DT79_RELEASE_GLOBAL name, slot
DT79_BEGIN \name
    push {r4, lr}
    ldr r4, .Ldt79_release_slot\@
    ldr r0, [r4]
    cmp r0, #0
    beq .Ldt79_release_done\@
    bl func_002C20AC
    mov r0, #0
    str r0, [r4]
.Ldt79_release_done\@:
    pop {r4, pc}
DT79_END \name
.Ldt79_release_slot\@:
    .word \slot
.endm

.macro DT79_OPTIONAL_FLAGGED name, destination
DT79_BEGIN \name
    ldr r1, .Ldt79_flag_owner\@
    add r0, r0, #4
    ldrb r1, [r1, #4]
    cmp r1, #0
    bne .Ldt79_flag_return\@
    add r0, r0, #4
    b \destination
.Ldt79_flag_return\@:
    bx lr
DT79_END \name
.Ldt79_flag_owner\@:
    .word ipc_allocator_dispatch_owner_68
.endm

.macro DT79_INSTALL_TAG name
DT79_BEGIN \name
    ldr r1, .Ldt79_record_tag\@
    push {r4, lr}
    str r1, [r0], #36
    bl func_001862FC
    pop {r4, lr}
    sub r0, r0, #36
    b func_00160A64
DT79_END \name
.Ldt79_record_tag\@:
    .word arm_duplicate_templates_79_record_tag_identity
.endm

.macro DT79_SET_IDENTITY name, destination
DT79_BEGIN \name
    ldr r1, .Ldt79_constructor_tag\@
    push {r4, lr}
    str r1, [r0], #8
    bl \destination
    sub r0, r0, #8
    pop {r4, pc}
DT79_END \name
.Ldt79_constructor_tag\@:
    .word arm_duplicate_templates_79_constructor_tag_identity
.endm

.macro DT79_LOAD_SOURCE name, destination
DT79_BEGIN \name
    mov r1, r0
    ldr r0, .Ldt79_source_context\@
    ldr r0, [r0, #36]
    b \destination
DT79_END \name
.Ldt79_source_context\@:
    .word arm_duplicate_templates_79_source_context_identity
.endm

.macro DT79_INDEXED_ADDRESS name
DT79_BEGIN \name
    ldr r0, [r0, #4]
    add r0, r0, r1, lsl #3
    adr r1, .Ldt79_index_descriptor\@
    b func_0018BF20
DT79_END \name
.Ldt79_index_descriptor\@:
.endm

.macro DT79_OPTIONAL_VALUE name, destination
DT79_BEGIN \name
    cmp r0, #0
    beq .Ldt79_value_return\@
    b \destination
.Ldt79_value_return\@:
    bx lr
DT79_END \name
.endm

.macro DT79_LOAD_MEMBER name, identity
DT79_BEGIN \name
    mov r0, r1
    ldr r1, .Ldt79_member_identity\@
    ldr r0, [r0, #4]
    b func_0017F3F8
DT79_END \name
.Ldt79_member_identity\@:
    .word \identity
.endm

.macro DT79_LITERAL_SERVICE name, destination
DT79_BEGIN \name
    mov r0, r0
    ldr r0, .Ldt79_service_object\@
    b \destination
DT79_END \name
.Ldt79_service_object\@:
    .word service_lifecycle_object_43
.endm

.macro DT79_CALL_PRESERVE_R0 name, destination
DT79_BEGIN \name
    push {r0, lr}
    bl \destination
    pop {r0, pc}
DT79_END \name
.endm

.macro DT79_FIXED_ARGUMENT name, destination
DT79_BEGIN \name
    mov r2, r1
    mov r1, #4
    b \destination
DT79_END \name
.endm

.macro DT79_STORE_IDENTITY name, identity, destination
DT79_BEGIN \name
    ldr r1, .Ldt79_stored_identity\@
    str r1, [r0]
    b \destination
DT79_END \name
.Ldt79_stored_identity\@:
    .word \identity
.endm

DT79_RELEASE_GLOBAL func_002C27B0, arm_duplicate_templates_79_release_slot_a_identity
DT79_RELEASE_GLOBAL func_002C2C48, arm_duplicate_templates_79_release_slot_b_identity
DT79_OPTIONAL_FLAGGED func_00171F38, func_001602B8
DT79_OPTIONAL_FLAGGED func_00171F5C, func_00160380
DT79_INSTALL_TAG func_00206070
DT79_INSTALL_TAG func_002B005C
DT79_SET_IDENTITY func_0033A3C0, func_001787CC
DT79_SET_IDENTITY func_0033A3FC, func_00205C3C
DT79_LOAD_SOURCE func_0014EB1C, func_0016BB14
DT79_LOAD_SOURCE func_0014EBB4, func_0016BB50
DT79_INDEXED_ADDRESS func_00298E60
DT79_INDEXED_ADDRESS func_00298EA8
DT79_OPTIONAL_VALUE func_002C20AC, func_003B7EC0
DT79_OPTIONAL_VALUE func_00520B18, func_001D1DC8
DT79_LOAD_MEMBER func_004AC6FC, arm_duplicate_templates_79_member_key_a_identity
DT79_LOAD_MEMBER func_004B1E0C, arm_duplicate_templates_79_member_key_b_identity
DT79_LITERAL_SERVICE func_00164F44, func_001602B8
DT79_LITERAL_SERVICE func_00164F54, func_00160380
DT79_CALL_PRESERVE_R0 func_001A3958, func_00301034
DT79_CALL_PRESERVE_R0 func_00300980, func_00300B28
DT79_FIXED_ARGUMENT func_004175B8, func_004171D0
DT79_FIXED_ARGUMENT func_004175C4, arm_duplicate_templates_79_secondary_0041729C
DT79_STORE_IDENTITY func_0032BD18, arm_duplicate_templates_79_stored_identity_a, func_0032ADB0
DT79_STORE_IDENTITY func_003B8038, arm_duplicate_templates_79_stored_identity_b, func_003BD0B8
```

## Relocations and canonical schedules

The required relocation stream has 42 entries in function order: eight
`R_ARM_CALL`, eighteen `R_ARM_JUMP24`, and sixteen `R_ARM_ABS32`. Local
branches and both `adr` sites are relocation-free. Canonical SHA-256 hashes
over LF-joined normalized schedule lines are recorded in the neutral config;
the source hash intentionally remains `PENDING`.

## Independent verification and exclusions

The mnemonic-only schedules above were assembled independently with GNU `as`.
Each body was compared to the corresponding target range after normalizing
only declared external branch fields, literal contents, and address-reference
immediates. Body lengths, instruction counts, local destinations, relocation
kinds and order, literal load destinations, and owned post-body slots all
matched. A second repository-wide scan confirmed that none of the 24 selected
names occurs in an earlier configuration or specification and that none is an
exact report match. A full normalized-inventory audit confirmed the selected
cohorts and the stated rejections; all selected ranges and owned slots are
pairwise disjoint.
