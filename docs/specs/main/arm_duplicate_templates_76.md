# Probe-verified duplicate ARM templates 76

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- `sourceSha256`: `d568d2a03a058320bebc734eea3c72661ce049460571c9a74c064426e496df46`.
- Evidence: the evidence-gated function inventory, current objdiff report,
  repository-wide configured-function exclusion, normalized complete-body
  grouping, bounded target control/data-flow and post-body inspection,
  primary and secondary branch resolution, physical literal equality
  comparison, and an independent GNU Arm Embedded 15.2 mnemonic-only probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, target hashes, private strings or
  values, extracted assets, proprietary source, or implementation source.

Every exact function in the current report and every function already owned
by a configuration was excluded. Names used anywhere in existing neutral
configuration metadata were then excluded from the selected entry set. The
cohort was also checked against all runtime-76 through runtime-79 reservations
and is disjoint. The largest remaining normalized pair was rejected because
each inferred body ends on a link call instead of a return or tail-transfer
boundary. The final 25 ARM-state functions comprise eleven complete schedules,
1,356 executable bytes, and 339 instructions:

| Template | Functions | Bytes each | Total |
| --- | ---: | ---: | ---: |
| Configure result record | 2 | 84 | 168 |
| Guarded service action | 2 | 76 | 152 |
| Construct attached record | 2 | 76 | 152 |
| Route indexed request | 2 | 72 | 144 |
| Resolve embedded offset | 2 | 56 | 112 |
| Allocate zeroed record | 2 | 56 | 112 |
| Forward stacked arguments | 2 | 56 | 112 |
| Dispatch tail | 2 | 52 | 104 |
| Set ready flag | 2 | 52 | 104 |
| Construct tagged object | 5 | 20 | 100 |
| Format fixed record | 2 | 48 | 96 |

The schedules contain 43 symbolic direct transfers, six register-indirect
calls, sixteen local branch sites, two relocation-free post-body address
references, and fifteen literal slots belonging to thirteen physical identity
classes. There are no conditional register returns or indirect tails. All body
sizes, operands, local destinations, transfer classes, literal-load
destinations, function boundaries, post-body ownership, address targets, and
pool identities were independently assembled and compared. Only external
direct-transfer displacements and declared literal contents were normalized.

## Function map and boundaries

| Template | Functions | Variant parameters | Next globals (relative offset) |
| --- | --- | --- | --- |
| Configure result record | `func_00390DA0`, `func_00391130` | none | `func_00390DF4` (+84), `func_00391544` (+1044) |
| Guarded service action | `func_002C1D28`, `func_002C2CEC` | guard identities A/B | `func_002C1D80`, `func_002C2D44` (+88 each) |
| Construct attached record | `func_00368BB4`, `func_0036A2DC` | initializers `func_0019C148`, `func_0019C280` | `func_00368CE0` (+300), `func_0036A428` (+332) |
| Route indexed request | `func_0036286C`, `func_003628C8` | present tails secondary/`func_00419288` | `func_003628C8` (+92), `func_00362910` (+72) |
| Resolve embedded offset | `func_0016B0CC`, `func_004C1F88` | fallback identities A/B | `func_0016B108`, `func_004C1FC4` (+60 each) |
| Allocate zeroed record | `func_001CFE14`, `func_001CFEAC` | none | `func_001CFE4C`, `func_001CFEE4` (+56 each) |
| Forward stacked arguments | `func_003C550C`, `func_003C69D4` | forward destinations primary/secondary | `func_003C5850` (+836), `func_003C6F70` (+1436) |
| Dispatch tail | `func_0013F48C`, `func_004F2B94` | none | `func_0014040C` (+3968), `func_004F2BC8` (+52) |
| Set ready flag | `func_00146F24`, `func_002132B8` | none | `func_00146F58`, `func_002132EC` (+52 each) |
| Construct tagged object | `func_0011C348`, `func_00160A3C`, `func_002C7B30`, `func_00324C20`, `func_003345CC` | constructors and tag identities per function | `func_0011C368` (+32), `func_00160A64` (+40), `func_002C7B58` (+40), `func_00324E84` (+612), `func_003345F4` (+40) |
| Format fixed record | `func_00122F18`, `func_00123118` | formatters and descriptor identities A/B | `func_00122F4C`, `func_0012314C` (+52 each) |

The construct-attached schedule takes the address at body offset +76. The two
physical addresses are distinct. They are address-only identities: this batch
owns no bytes after either 76-byte body. Implement each with a same-section
expression so `adr` remains relocation-free; do not emit or copy the
referenced material.

Guarded-service owns +76..+87, resolve-offset owns +56..+59,
construct-tagged owns +20..+23, and fixed-format owns +48..+51. All other
functions own no post-body bytes. Any gap after the declared material and
before the recorded next global is unowned. `DT76_END` must close the function
before every pool and every unowned gap.

## Identity contracts

The fifteen literal slots form thirteen new physical classes. The inactive
and failure status identities are each shared by the two guarded-service
functions. Every guard, fallback, tag, and format-descriptor identity is a
singleton. The thirteen new classes are pairwise distinct and physically
unequal to every configured literal identity. No prior literal class is
reused.

Four direct destinations are secondary entries:

| Symbol | Owner relation | Boundary relation |
| --- | --- | --- |
| `arm_duplicate_templates_76_route_secondary` | `func_00419288` +92 | 984 bytes before `func_004196BC` |
| `arm_duplicate_templates_74_fallback_secondary` | `func_0014E904` +352 | 4 bytes before `func_0014EA68` |
| `arm_duplicate_templates_76_ready_secondary` | `func_00179080` +88 | 96 bytes before `func_00179138` |
| `arm_duplicate_templates_76_forward_secondary` | `func_003C6088` +1236 | 1144 bytes before `func_003C69D4` |

The fallback entry intentionally reuses the already established batch-74
symbol. All direct destinations are ARM-state, four-byte aligned, and
pairwise distinct across the primary and secondary identity sets. Exact
ordered site counts are normative in
`config/arm-duplicate-templates-76.json`.

## Complete normalized schedules

Equivalent uniquely scoped local-label names are allowed. The implementation
must assemble to these instruction schedules, body sizes, local destinations,
ordered relocations, literal-load destinations, address targets, and ownership
boundaries. Every external identity remains symbolic.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT76_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT76_END name
.size \name, .-\name
.endm

.macro DT76_CONFIGURE_RESULT name
DT76_BEGIN \name
    push {r4, r5, r6, r7, r8, lr}
    mov r6, r0
    mov r4, r1
    ldr r5, [r1]
    mov r7, #8
    ldr r0, [r5]
    ldr r1, [r0, #28]
    mov r0, r5
    blx r1
    mov r2, r0
    mov r3, #1
    mov r1, r7
    mov r0, r5
    bl func_0012B9A0
    cmp r0, #0
    beq .Ldt76_configure_done\@
    ldrsh r2, [r4, #4]
    ldr r1, [r4]
    bl func_003A7DD8
.Ldt76_configure_done\@:
    str r0, [r6, #12]
    pop {r4, r5, r6, r7, r8, pc}
DT76_END \name
.endm

.macro DT76_GUARDED_SERVICE name, guard
DT76_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, #0
    ldr r4, .Ldt76_service_guard\@
    ldrb r0, [r4]
    cmp r0, #0
    ldreq r0, .Ldt76_service_inactive\@
    beq .Ldt76_service_done\@
    ldrb r0, [r4, #1]
    cmp r0, #0
    ldreq r0, .Ldt76_service_failure\@
    beq .Ldt76_service_done\@
    bl func_002C2244
    ldr r1, [r0]
    ldr r1, [r1, #20]
    blx r1
    bl func_002C21AC
    mov r0, r5
    strb r5, [r4, #1]
.Ldt76_service_done\@:
    pop {r4, r5, r6, pc}
DT76_END \name
.Ldt76_service_guard\@:
    .word \guard
.Ldt76_service_inactive\@:
    .word arm_duplicate_templates_76_service_inactive_identity
.Ldt76_service_failure\@:
    .word arm_duplicate_templates_76_service_failure_identity
.endm

.macro DT76_ATTACHED_RECORD name, initializer
DT76_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r5, r1
    adr r0, .Ldt76_attached_post_body\@
    mov r1, #0
    bl func_0036F28C
    mov r6, r0
    ldr r1, [r4, #4]
    mov r0, #56
    bl func_00123480
    cmp r0, #0
    movne r1, r5
    blne \initializer
    str r4, [r0, #28]
    mov r1, r0
    str r6, [r0, #16]
    mov r0, r4
    pop {r4, r5, r6, lr}
    b func_003AB384
DT76_END \name
.set .Ldt76_attached_post_body\@, \name + 76
.endm

.macro DT76_ROUTE_INDEXED name, present_tail
DT76_BEGIN \name
    push {r4, lr}
    ldr r0, [r0, #28]
    mov ip, r1
    mov r1, r2
    ldr r0, [r0, ip, lsl #3]
    mov r4, r3
    bl func_004C8ADC
    cmp r0, #0
    beq .Ldt76_route_missing\@
    mov r1, r4
    pop {r4, lr}
    mvn r2, #0
    b \present_tail
.Ldt76_route_missing\@:
    mov r2, #0
    pop {r4, lr}
    mov r1, r2
    mov r0, r2
    b arm_duplicate_templates_74_fallback_secondary
DT76_END \name
.endm

.macro DT76_RESOLVE_OFFSET name, fallback
DT76_BEGIN \name
    push {r3, r4, r5, lr}
    mov r4, r0
    mov r2, #9
    mov r1, sp
    add r0, r0, #4
    bl func_0017D058
    cmp r0, #0
    ldreq r0, .Ldt76_offset_fallback\@
    beq .Ldt76_offset_done\@
    ldr r0, [sp]
    add r0, r0, r4
    ldr r1, [r0, #4]
    add r0, r0, r1
.Ldt76_offset_done\@:
    pop {r3, r4, r5, pc}
DT76_END \name
.Ldt76_offset_fallback\@:
    .word \fallback
.endm

.macro DT76_ALLOCATE_ZEROED name
DT76_BEGIN \name
    mov r0, #24
    push {r4, lr}
    bl func_001D1EB0
    cmp r0, #0
    beq .Ldt76_allocate_done\@
    mov r2, #0
    str r2, [r0]
    str r2, [r0, #4]
    str r2, [r0, #8]
    mov r1, #1
    str r2, [r0, #12]
    str r1, [r0, #20]
    str r2, [r0, #16]
.Ldt76_allocate_done\@:
    pop {r4, pc}
DT76_END \name
.endm

.macro DT76_FORWARD_STACKED name, destination
DT76_BEGIN \name
    push {r4, lr}
    sub sp, sp, #8
    mov r4, r1
    ldr r1, [sp, #16]
    str r3, [sp]
    mov r3, r2
    str r1, [sp, #4]
    ldr ip, [r0]
    mov r1, r0
    mov r2, r4
    mov r0, ip
    bl \destination
    add sp, sp, #8
    pop {r4, pc}
DT76_END \name
.endm

.macro DT76_DISPATCH_TAIL name
DT76_BEGIN \name
    push {r4, r5, r6, lr}
    mov r5, r0
    ldr r0, [r1]
    mov r4, r1
    ldr r1, [r0, #28]
    mov r0, r4
    blx r1
    rsb r2, r0, #0
    mov r1, r5
    mov r0, r4
    pop {r4, r5, r6, lr}
    mov r3, #1
    b func_0012B9A0
DT76_END \name
.endm

.macro DT76_SET_READY name
DT76_BEGIN \name
    push {r4, lr}
    mov r4, r0
    bl func_001611D0
    cmp r0, #0
    beq .Ldt76_ready_done\@
    add r1, r4, #16
    mov r0, r4
    bl arm_duplicate_templates_76_ready_secondary
    cmp r0, #0
    beq .Ldt76_ready_done\@
    mov r0, #1
    strb r0, [r4, #13]
.Ldt76_ready_done\@:
    pop {r4, pc}
DT76_END \name
.endm

.macro DT76_TAGGED_OBJECT name, constructor, tag
DT76_BEGIN \name
    push {r4, lr}
    bl \constructor
    ldr r1, .Ldt76_tag\@
    str r1, [r0]
    pop {r4, pc}
DT76_END \name
.Ldt76_tag\@:
    .word \tag
.endm

.macro DT76_FORMAT_FIXED name, formatter, descriptor
DT76_BEGIN \name
    push {r4, lr}
    sub sp, sp, #64
    mov r4, r0
    ldr r1, .Ldt76_format_descriptor\@
    mov r0, sp
    bl \formatter
    mov r2, #64
    mov r1, sp
    mov r0, r4
    bl func_00300B28
    add sp, sp, #64
    pop {r4, pc}
DT76_END \name
.Ldt76_format_descriptor\@:
    .word \descriptor
.endm

DT76_CONFIGURE_RESULT func_00390DA0
DT76_CONFIGURE_RESULT func_00391130
DT76_GUARDED_SERVICE func_002C1D28, arm_duplicate_templates_76_service_guard_a_identity
DT76_GUARDED_SERVICE func_002C2CEC, arm_duplicate_templates_76_service_guard_b_identity
DT76_ATTACHED_RECORD func_00368BB4, func_0019C148
DT76_ATTACHED_RECORD func_0036A2DC, func_0019C280
DT76_ROUTE_INDEXED func_0036286C, arm_duplicate_templates_76_route_secondary
DT76_ROUTE_INDEXED func_003628C8, func_00419288
DT76_RESOLVE_OFFSET func_0016B0CC, arm_duplicate_templates_76_offset_fallback_a_identity
DT76_RESOLVE_OFFSET func_004C1F88, arm_duplicate_templates_76_offset_fallback_b_identity
DT76_ALLOCATE_ZEROED func_001CFE14
DT76_ALLOCATE_ZEROED func_001CFEAC
DT76_FORWARD_STACKED func_003C550C, func_003C5344
DT76_FORWARD_STACKED func_003C69D4, arm_duplicate_templates_76_forward_secondary
DT76_DISPATCH_TAIL func_0013F48C
DT76_DISPATCH_TAIL func_004F2B94
DT76_SET_READY func_00146F24
DT76_SET_READY func_002132B8
DT76_TAGGED_OBJECT func_0011C348, func_0011C274, arm_duplicate_templates_76_tag_0011C348_identity
DT76_TAGGED_OBJECT func_00160A3C, func_00171DBC, arm_duplicate_templates_76_tag_00160A3C_identity
DT76_TAGGED_OBJECT func_002C7B30, func_002C67C4, arm_duplicate_templates_76_tag_002C7B30_identity
DT76_TAGGED_OBJECT func_00324C20, func_001284C0, arm_duplicate_templates_76_tag_00324C20_identity
DT76_TAGGED_OBJECT func_003345CC, func_003336EC, arm_duplicate_templates_76_tag_003345CC_identity
DT76_FORMAT_FIXED func_00122F18, func_0012EC80, arm_duplicate_templates_76_format_descriptor_a_identity
DT76_FORMAT_FIXED func_00123118, func_0012EF50, arm_duplicate_templates_76_format_descriptor_b_identity
```

## Canonical schedule hashes

All hashes use SHA-256, UTF-8, LF-separated records, and a final LF. Functions
are ordered as in the configuration; instruction and event records are ordered
by increasing offset within each function. Decimal offsets are used.

- Instruction records are
  `function:offset:mnemonic:operands`. External direct operands are their
  configured symbols; local targets are `local:+offset`; literal operands are
  `literal:identity-key`; address-only operands are `address:+offset`; every
  other operand uses GNU objdump's whitespace-normalized operand text with
  comments removed. The 339-record digest is
  `5a40bbfdb3d54fe574839b8cf60ac92b6af44beb6d734835b96d7c724c8d1327`.
- Local-transfer records are
  `function:site-offset:mnemonic:target-offset`. The 16-record digest is
  `9904fa4f95116aa472433cd839f299f1e0432834cbc1e28ee6d55a3a77a3d647`.
- Relocation records are `function:site-offset:kind:mnemonic:symbol`. Direct
  transfers use their ARM relocation kind and branch mnemonic; pool words use
  their slot offset, `R_ARM_ABS32`, and `.word`. The relocation-free address
  events are intentionally absent. The 58-record digest is
  `f9e9f3e38001328b5cdc273653e7b87f487340a19055c702ce92501cc0f0053b`.
- Literal-identity records are
  `function:load-offset:slot-offset:identity-key`. The 15-record digest is
  `23e1a9a41cc5468f28d65665bf1fd7373479b6ea7bac4212a7e753a78687e5b0`.

## Implementation and verification contract

The implementation must use one allocatable executable section per function,
four-byte alignment, global function symbols with exact body sizes, and pool
words outside `.size`. It must preserve every fixed operand and local target,
the six `blx r1` sites, all 43 ordered direct branch relocations, all fifteen
absolute-word relocations, and both relocation-free `adr` sites. It must not
claim or reproduce bytes at the address-only targets or in any unowned gap.

The validator must independently assemble the implementation, require 25
functions and 1,356 body bytes, verify all eleven template counts, validate the
four secondary-entry relations, compare the four canonical digests, inspect
only declared function sections with a 16 MiB command-output buffer, validate
pool ownership boundaries, and compare each normalized body and owned pool
against target evidence. The source digest is
`d568d2a03a058320bebc734eea3c72661ce049460571c9a74c064426e496df46`;
acceptance requires replacing it with that file's SHA-256 and satisfying the
complete validator contract.
