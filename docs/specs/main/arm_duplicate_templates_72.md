# Probe-verified duplicate ARM templates 72

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- `sourceSha256`: `ce335c866ee6b54a87274c68a16e539402841a75a245d8b7fd81a63ebf60bf6a`.
- Evidence: the evidence-gated function inventory, current objdiff report,
  repository-wide configured-function exclusion, normalized complete-body
  grouping, bounded target control/data-flow and post-body inspection,
  primary branch resolution, and an independent GNU Arm Embedded 15.2
  mnemonic-only probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, target hashes, private strings or
  values, extracted assets, proprietary source, or implementation source.

Every exact function in the current report and every function already owned
by a configuration file was excluded. This also excludes the pending IPC 68
and runtime 72 batches. The 24 selected ARM-state functions comprise four
normalized schedules and 1,760 executable bytes (440 instructions):

| Template | Functions | Bytes each | Total |
| --- | ---: | ---: | ---: |
| Register 44-byte record | 8 | 76 | 608 |
| Register 40-byte record | 7 | 76 | 532 |
| Copy stack pair | 7 | 44 | 308 |
| Release embedded record | 2 | 156 | 312 |

The schedules contain 71 symbolic direct transfers, six register-indirect
calls, four register-indirect tail transfers, two conditional register
returns, fifteen relocation-free `adr` sites, and no literal pools or other
relocations. All body sizes, operands, local destinations, symbolic transfer
classes, address targets, function boundaries, and post-body boundaries were
independently assembled and compared after external-transfer normalization.

## Template behavior and boundaries

### Register record

The two register-record schedules differ only in the record-size operand at
+32: one uses 44 bytes and the other uses 40 bytes. Each preserves its two
arguments, takes the address of expansion-specific material immediately after
the 76-byte body, calls `func_0036F28C` at +20, allocates the record through
`func_00123480` at +36, conditionally calls its expansion-specific constructor
at +48, stores the owner at record offset 28 and the lookup result at record
offset 16, and tail-branches to `func_003AB384` at +72.

The post-body address target is exactly +76 in every expansion. It is an
address-only clean-room identity: the batch owns none of the referenced
material and records none of its private content. The fifteen target addresses
are pairwise distinct and produce no relocation. These functions have no
internal branch destination.

| Function | Record bytes | Constructor | Next global | Offset |
| --- | ---: | --- | --- | ---: |
| `func_00368314` | 44 | `func_0019C0E8` | `func_00368374` | 96 |
| `func_003687E4` | 44 | `func_0019C110` | `func_00368844` | 96 |
| `func_00368998` | 44 | `func_0019C120` | `func_00368A24` | 140 |
| `func_00368A24` | 44 | `func_0019C128` | `func_00368AEC` | 200 |
| `func_003697D8` | 44 | `func_0019C1C8` | `func_0036983C` | 100 |
| `func_0036A20C` | 44 | `func_0019C270` | `func_0036A274` | 104 |
| `func_0036AAC4` | 44 | `func_0019C2F8` | `func_0036AB30` | 108 |
| `func_0036AB30` | 44 | `func_0019C300` | `func_0036AB9C` | 108 |
| `func_00367AAC` | 40 | `func_0019C040` | `func_00367B08` | 92 |
| `func_00367B08` | 40 | `func_0019C048` | `func_00367B64` | 92 |
| `func_00368160` | 40 | `func_0019C0D0` | `func_003681C0` | 96 |
| `func_003692C0` | 40 | `func_0019C1A0` | `func_00369324` | 100 |
| `func_00369394` | 40 | `func_0019C1B0` | `func_00369550` | 444 |
| `func_0036A98C` | 40 | `func_0019C2E0` | `func_0036A9F8` | 108 |
| `func_0036A9F8` | 40 | `func_0019C2E8` | `func_0036AAC4` | 204 |

Unowned anonymous material starts at +76 in every row. The table's last
column gives the independently verified next-global offset.

### Copy stack pair

The seven 44-byte functions preserve the destination in `r4`, allocate eight
stack bytes, pass the original second argument in `r2`, the original first
argument in `r1`, and the stack address in `r0`, then call the
expansion-specific helper at +24. They load the resulting register pair from
the stack and store it to destination offset zero before returning. There are
no local branches, address references, indirect transfers, or literal slots.

| Function | Helper | Next global | Offset |
| --- | --- | --- | ---: |
| `func_003A5A64` | `func_004AA62C` | `func_003A5A90` | 44 |
| `func_003A5A90` | `func_004A9F64` | `func_003A5ABC` | 44 |
| `func_003A5ABC` | `func_004AA094` | `func_003A5AE8` | 44 |
| `func_003A5AE8` | `func_004AA154` | `func_003A5B14` | 44 |
| `func_003A5B14` | `func_004AA280` | `func_003A5B40` | 44 |
| `func_003A5B40` | `func_004AA554` | `func_003A5B6C` | 44 |
| `func_003A5B6C` | `func_004AA5C0` | `func_003A5C74` | 264 |

The first six next globals start at the body boundary. Unowned anonymous
material starts at +44 only after `func_003A5B6C`.

### Release embedded record

`func_002FF8C0` and `func_00302108` share a complete 156-byte schedule. A
null argument returns through `bxeq lr` at +4. Otherwise the function derives
an owner pointer 32 bytes before the input, calls `func_0012BB5C` at +20,
queries the record indirectly through `r1` at +44, and compares the result
with the word at the derived owner pointer. The unequal path reacquires the
owner at +64, updates indirectly through `r2` at +88, restores the saved
registers, and tail-transfers through `r1` at +108. The equal path starts at
+112, calls through `r1` at +124, prepares the alternative arguments, restores
the saved registers, and tail-transfers through `r2` at +152.

The sole local destination is +112. Both functions are followed immediately
by their next globals at +156: `func_002FF95C` and `func_003021A4`,
respectively.

## Direct-transfer identity contract

All 71 direct transfers are ARM-state and four-byte aligned. The shared
classes are:

| Destination | Sites | Role |
| --- | ---: | --- |
| `func_0036F28C` | 15 | registry lookup |
| `func_00123480` | 15 | record allocation |
| `func_003AB384` | 15 | attachment tail |
| `func_0012BB5C` | 4 | owner acquisition |

The fifteen constructors and seven stack-pair helpers are singleton classes.
All 26 destination classes are pairwise distinct. The calls at +20 and +36
in each register-record function, every stack-pair helper call, and both
owner-acquisition sites are `bl`/`R_ARM_CALL`. Each conditional constructor
site is `blne`/`R_ARM_JUMP24`; each attachment tail is
`b`/`R_ARM_JUMP24`.

## Complete normalized schedules

Equivalent uniquely scoped local-label names are allowed. The source must
assemble to these exact fixed schedules, function sizes, local destinations,
ordered relocations, and address targets. `DT72_END` closes each function at
the body boundary; the register-record end label is also the relocation-free
`adr` target and owns no following data.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT72_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT72_END name
.size \name, .-\name
.endm

.macro DT72_REGISTER name, record_bytes, constructor
DT72_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    mov r5, r1
    adr r0, .Ldt72_post_body_identity\@
    mov r1, #0
    bl func_0036F28C
    mov r6, r0
    ldr r1, [r4, #4]
    mov r0, #\record_bytes
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
.Ldt72_post_body_identity\@:
DT72_END \name
.endm

.macro DT72_COPY name, helper
DT72_BEGIN \name
    push {r4, lr}
    mov r2, r1
    sub sp, sp, #8
    mov r4, r0
    mov r1, r0
    mov r0, sp
    bl \helper
    ldrd r0, [sp]
    strd r0, [r4]
    add sp, sp, #8
    pop {r4, pc}
DT72_END \name
.endm

.macro DT72_RELEASE name
DT72_BEGIN \name
    cmp r0, #0
    bxeq lr
    push {r4, r5, r6, lr}
    mov r4, r0
    ldr r0, [r0, #-32]
    bl func_0012BB5C
    mov r5, r0
    ldr r0, [r0]
    sub r6, r4, #32
    ldr r1, [r0, #32]
    mov r0, r5
    blx r1
    mov r1, r0
    ldr r0, [r6]
    cmp r1, r0
    beq .Ldt72_equal\@
    bl func_0012BB5C
    ldr r2, [r0]
    ldrh r1, [r4, #-28]
    mov r5, r0
    ldr r2, [r2, #92]
    sub r1, r4, r1
    blx r2
    ldr r0, [r5]
    ldr r1, [r0, #76]
    mov r0, r5
    pop {r4, r5, r6, lr}
    bx r1
.Ldt72_equal\@:
    ldr r0, [r5]
    ldr r1, [r0, #76]
    mov r0, r5
    blx r1
    ldrh r0, [r4, #-28]
    sub r1, r4, r0
    ldr r0, [r5]
    ldr r2, [r0, #92]
    mov r0, r5
    pop {r4, r5, r6, lr}
    bx r2
DT72_END \name
.endm

DT72_REGISTER func_00368314, 44, func_0019C0E8
DT72_REGISTER func_003687E4, 44, func_0019C110
DT72_REGISTER func_00368998, 44, func_0019C120
DT72_REGISTER func_00368A24, 44, func_0019C128
DT72_REGISTER func_003697D8, 44, func_0019C1C8
DT72_REGISTER func_0036A20C, 44, func_0019C270
DT72_REGISTER func_0036AAC4, 44, func_0019C2F8
DT72_REGISTER func_0036AB30, 44, func_0019C300

DT72_REGISTER func_00367AAC, 40, func_0019C040
DT72_REGISTER func_00367B08, 40, func_0019C048
DT72_REGISTER func_00368160, 40, func_0019C0D0
DT72_REGISTER func_003692C0, 40, func_0019C1A0
DT72_REGISTER func_00369394, 40, func_0019C1B0
DT72_REGISTER func_0036A98C, 40, func_0019C2E0
DT72_REGISTER func_0036A9F8, 40, func_0019C2E8

DT72_COPY func_003A5A64, func_004AA62C
DT72_COPY func_003A5A90, func_004A9F64
DT72_COPY func_003A5ABC, func_004AA094
DT72_COPY func_003A5AE8, func_004AA154
DT72_COPY func_003A5B14, func_004AA280
DT72_COPY func_003A5B40, func_004AA554
DT72_COPY func_003A5B6C, func_004AA5C0

DT72_RELEASE func_002FF8C0
DT72_RELEASE func_00302108
```

## Clean-room handoff

Implement only from this document and
`config/arm-duplicate-templates-72.json`. Keep every direct destination
symbolic and preserve the `R_ARM_CALL` versus `R_ARM_JUMP24` distinctions.
The fifteen `adr` sites must resolve locally to exactly +76 without a
relocation; do not provide or transcribe the referenced private material.
A validator should check all section sizes, function symbol sizes,
instruction schedules and operands, local destinations, ordered direct and
indirect transfers, branch classes, address targets, absence of literal
pools, `.size` placement, and every next-global/anonymous-material boundary.
No target bytes, encodings, private strings or private values may enter the
implementation, validator, configuration, or documentation.
