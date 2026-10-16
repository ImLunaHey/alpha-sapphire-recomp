# Probe-verified duplicate ARM templates 78

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- `sourceSha256`: `64114244f870a317545d7afad8372d6e77f280c195684df0a6ef647b974f6882`.
- Probe tool: GNU assembler from Arm GNU Toolchain 15.2.Rel1, binutils
  2.45.1.20251203.
- Evidence: the current objdiff report, the evidence-gated symbol inventory,
  repository-wide configured/owned/referenced-name exclusion, normalized
  complete-body grouping, bounded target control-flow and boundary inspection,
  branch resolution, and an independent mnemonic-only assembly probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, target hashes, private strings or
  values, extracted assets, proprietary source, or implementation source.

Every exact function in the current report and every function name already
configured, owned, reserved, or referenced by existing configuration and
specification metadata was excluded. The selected 24 ARM-state functions are
still unmatched in the report, pairwise non-overlapping, and form twelve
normalized two-member templates. Candidates whose inventory bodies end on a
link call were rejected as incomplete. The batch comprises 648 executable
bytes and 162 instructions:

| Template | Functions | Bytes each | Total |
| --- | ---: | ---: | ---: |
| Query then notify | 2 | 36 | 72 |
| Any service ready | 2 | 36 | 72 |
| Forward four VFP words | 2 | 32 | 64 |
| Forward three core words | 2 | 32 | 64 |
| Forward four core words | 2 | 32 | 64 |
| Call while preserving argument | 2 | 20 | 40 |
| Query member byte | 2 | 20 | 40 |
| Read nested word | 2 | 28 | 56 |
| Invert embedded test | 2 | 28 | 56 |
| Optional member tail | 2 | 20 | 40 |
| Optional word tail | 2 | 20 | 40 |
| Call for stack result | 2 | 20 | 40 |

The schedules contain 28 symbolic direct transfers: 24 calls and four tail
branches. They also contain eight local branch sites and 24 return sites. The
four optional-tail schedules return with an unconditional `bx lr` on the
absent path and use a direct tail branch on the present path; therefore they
have no conditional-return instruction. There are no register-indirect calls,
register-indirect tails, address references, literal slots, or post-body owned
bytes. Only external direct-transfer displacements were normalized during the
independent target comparison.

## Function map and boundaries

| Template | Functions | Variant parameters | Next globals (relative offset) |
| --- | --- | --- | --- |
| Query then notify | `func_001122EC`, `func_0011ECB0` | notification destinations | `func_00112310`, `func_0011ECD4` (+36 each) |
| Any service ready | `func_0011ABA0`, `func_0043B6C4` | two test destinations | `func_0011AF1C` (+892), `func_0043B7E0` (+284) |
| Forward four VFP words | `func_001344CC`, `func_0017CAC4` | forwarding destinations | `func_001344EC` (+32), `func_0017CB20` (+92) |
| Forward three core words | `func_001426C0`, `func_00158424` | forwarding destinations | `func_001427B8` (+248), `func_00158444` (+32) |
| Forward four core words | `func_00158444`, `func_00158464` | forwarding destinations | `func_00158464`, `func_00158484` (+32 each) |
| Call while preserving argument | `func_00149B94`, `func_002056A8` | call destinations | `func_00149BA8` (+20), `func_00205870` (+456) |
| Query member byte | `func_004D2508`, `func_004D2EA4` | query destinations | `func_004D26FC` (+500), `func_004D31FC` (+856) |
| Read nested word | `func_00152EA8`, `func_004C0294` | resolver destinations | `func_00152EC4`, `func_004C02B0` (+28 each) |
| Invert embedded test | `func_00333BDC`, `func_003354C8` | none | `func_00333BF8`, `func_003354E4` (+28 each) |
| Optional member tail | `func_00150168`, `func_00169770` | secondary tail destinations | `func_0015017C`, `func_00169784` (+20 each) |
| Optional word tail | `func_00176670`, `func_0035629C` | primary tail destinations | `func_00176684` (+20), `func_003562DC` (+64) |
| Call for stack result | `func_002AEC04`, `func_002AEE08` | none | `func_002AEC48` (+68), `func_002AEE64` (+92) |

Each function owns exactly its declared body. Bytes between the body end and a
more distant next global are unowned by this batch. The consecutive
`func_00158424`/`func_00158444`/`func_00158464` ranges remain distinct function
sections despite sharing boundaries.

## Identity contracts

The 28 direct sites resolve to 25 pairwise-distinct destination classes. Three
primary classes are shared twice: `func_0011EC38`, `func_00124150`, and
`func_0052B610`. The remaining 22 classes are singletons. Exact site order and
the complete primary list are normative in
`config/arm-duplicate-templates-78.json`.

Three singleton destinations are secondary ARM entries and must retain these
relations:

| Symbol | Owner relation | Next global | Bytes before next global |
| --- | --- | --- | ---: |
| `arm_duplicate_templates_78_secondary_0010FC60` | `func_0010FBCC` +148 | `func_0010FCE0` | 128 |
| `arm_duplicate_templates_78_secondary_00161478` | `func_00161460` +24 | `func_0016148C` | 20 |
| `arm_duplicate_templates_78_secondary_00171C4C` | `func_00171ABC` +400 | `func_00171C88` | 60 |

All primary and secondary branch destinations are four-byte aligned. The
secondary relations identify entry addresses only; this batch does not own the
destination bytes. There are no literal identities, so both the reused and new
identity sets are empty and the zero-site literal contract is normative.

## Complete normalized schedules

Equivalent uniquely scoped local-label names are allowed. Every external
identity must remain symbolic. Offsets, operands, local destinations,
relocation kinds, function sizes, and ownership boundaries are exact.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT78_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT78_END name
.size \name,.-\name
.endm

.macro DT78_QUERY_NOTIFY name, notify
DT78_BEGIN \name
    push {r4, r5, r6, lr}
    mov r4, r0
    bl func_0011EC38
    mov r5, r0
    mov r1, r0
    mov r0, r4
    bl \notify
    mov r0, r5
    pop {r4, r5, r6, pc}
DT78_END \name
.endm

.macro DT78_ANY_READY name, first, second
DT78_BEGIN \name
    push {r4, lr}
    bl \first
    cmp r0, #0
    bne .Ldt78_true\@
    bl \second
    cmp r0, #0
    beq .Ldt78_done\@
.Ldt78_true\@:
    mov r0, #1
.Ldt78_done\@:
    pop {r4, pc}
DT78_END \name
.endm

.macro DT78_FORWARD_VFP4 name, destination
DT78_BEGIN \name
    push {lr}
    sub sp, sp, #20
    add ip, sp, #24
    vldmia ip, {s0-s3}
    vstmia sp, {s0-s3}
    bl \destination
    add sp, sp, #20
    pop {pc}
DT78_END \name
.endm

.macro DT78_FORWARD_WORDS3 name, destination
DT78_BEGIN \name
    push {r4, r5, lr}
    sub sp, sp, #12
    add lr, sp, #24
    ldm lr, {r4, r5, ip}
    stm sp, {r4, r5, ip}
    bl \destination
    add sp, sp, #12
    pop {r4, r5, pc}
DT78_END \name
.endm

.macro DT78_FORWARD_WORDS4 name, destination
DT78_BEGIN \name
    push {r4, r5, r6, lr}
    sub sp, sp, #16
    add lr, sp, #32
    ldm lr, {r4, r5, r6, ip}
    stm sp, {r4, r5, r6, ip}
    bl \destination
    add sp, sp, #16
    pop {r4, r5, r6, pc}
DT78_END \name
.endm

.macro DT78_CALL_PRESERVE name, destination
DT78_BEGIN \name
    push {r4, lr}
    mov r4, r0
    bl \destination
    mov r0, r4
    pop {r4, pc}
DT78_END \name
.endm

.macro DT78_QUERY_MEMBER_BYTE name, destination
DT78_BEGIN \name
    push {r4, lr}
    ldr r0, [r0, #12]
    bl \destination
    and r0, r0, #255
    pop {r4, pc}
DT78_END \name
.endm

.macro DT78_READ_NESTED_WORD name, destination
DT78_BEGIN \name
    ldr r0, [r0, #4]
    mov r0, r0
    push {r4, lr}
    ldr r0, [r0, #60]
    bl \destination
    ldr r0, [r0]
    pop {r4, pc}
DT78_END \name
.endm

.macro DT78_INVERT_TEST name
DT78_BEGIN \name
    add r0, r0, #12
    push {r4, lr}
    bl func_00124150
    cmp r0, #0
    movne r0, #0
    moveq r0, #1
    pop {r4, pc}
DT78_END \name
.endm

.macro DT78_OPTIONAL_MEMBER name, destination
DT78_BEGIN \name
    ldr r0, [r0, #312]
    cmp r0, #0
    beq .Ldt78_return\@
    b \destination
.Ldt78_return\@:
    bx lr
DT78_END \name
.endm

.macro DT78_OPTIONAL_WORD name, destination
DT78_BEGIN \name
    ldr r0, [r0, #4]
    cmp r0, #0
    beq .Ldt78_return\@
    b \destination
.Ldt78_return\@:
    bx lr
DT78_END \name
.endm

.macro DT78_STACK_RESULT name
DT78_BEGIN \name
    push {r3, lr}
    mov r1, sp
    bl func_0052B610
    ldr r0, [sp]
    pop {r3, pc}
DT78_END \name
.endm
```

The no-effect `mov r0, r0` in `DT78_READ_NESTED_WORD` is required; some GNU
disassembly views print the same instruction through a `nop` alias.

## Variant bindings, local labels, and relocations

| Functions | Macro binding | Local destinations | Ordered external relocations |
| --- | --- | --- | --- |
| `func_001122EC` | `DT78_QUERY_NOTIFY ..., arm_duplicate_templates_78_secondary_0010FC60` | none | +8 `R_ARM_CALL` `func_0011EC38`; +24 `R_ARM_CALL` secondary |
| `func_0011ECB0` | `DT78_QUERY_NOTIFY ..., func_00125D3C` | none | +8 `R_ARM_CALL` `func_0011EC38`; +24 `R_ARM_CALL` `func_00125D3C` |
| `func_0011ABA0` | `DT78_ANY_READY ..., func_0011A6B4, func_00125F70` | +12 `bne` to +28; +24 `beq` to +32 | +4/+16 `R_ARM_CALL` in binding order |
| `func_0043B6C4` | `DT78_ANY_READY ..., func_00200ABC, func_00200BA0` | +12 `bne` to +28; +24 `beq` to +32 | +4/+16 `R_ARM_CALL` in binding order |
| `func_001344CC`, `func_0017CAC4` | `DT78_FORWARD_VFP4` to `func_0012FFC8`, `func_0016092C` | none | +20 `R_ARM_CALL` per function |
| `func_001426C0`, `func_00158424` | `DT78_FORWARD_WORDS3` to `func_00148720`, `func_00164D2C` | none | +20 `R_ARM_CALL` per function |
| `func_00158444`, `func_00158464` | `DT78_FORWARD_WORDS4` to `func_00164914`, `func_00164A54` | none | +20 `R_ARM_CALL` per function |
| `func_00149B94`, `func_002056A8` | `DT78_CALL_PRESERVE` to `func_00165F58`, `func_00204B04` | none | +8 `R_ARM_CALL` per function |
| `func_004D2508`, `func_004D2EA4` | `DT78_QUERY_MEMBER_BYTE` to `func_00152F08`, `func_004D22DC` | none | +8 `R_ARM_CALL` per function |
| `func_00152EA8`, `func_004C0294` | `DT78_READ_NESTED_WORD` to `func_0016B220`, `func_004BF8D0` | none | +16 `R_ARM_CALL` per function |
| `func_00333BDC`, `func_003354C8` | `DT78_INVERT_TEST` | none | +8 `R_ARM_CALL` `func_00124150` per function |
| `func_00150168`, `func_00169770` | `DT78_OPTIONAL_MEMBER` to the +24/+400 secondary entries above | +8 `beq` to +16 | +12 `R_ARM_JUMP24` per function |
| `func_00176670`, `func_0035629C` | `DT78_OPTIONAL_WORD` to `func_001003E0`, `func_00371CF4` | +8 `beq` to +16 | +12 `R_ARM_JUMP24` per function |
| `func_002AEC04`, `func_002AEE08` | `DT78_STACK_RESULT` | none | +8 `R_ARM_CALL` `func_0052B610` per function |

## Canonical schedules and verification

Canonical records use function order from the configuration, increasing
instruction/relocation offsets, decimal offsets, LF termination, symbolic
external destinations, and `local:+N` operands for local branches. SHA-256
digests are:

| Schedule | Records | Digest |
| --- | ---: | --- |
| Instruction | 162 | `66d7c330dcdd11ec27012822ba03f61bfde073978d020bcc3b59306e0c53ccde` |
| Local transfer | 8 | `db3e7034c226f5288958a9570c19c56c5f5d68c168db3d94957df68221290ce2` |
| Relocation | 28 | `916322f1d5212fdd63ecf3d98056629caf946cd07404dfb28740c9ec5f25a3b7` |
| Literal identity | 0 | `01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b` |

The independent probe assembled all 24 sections with the specified sizes and
28 relocations. A section-by-section comparison against the target passed for
all 648 body bytes after normalizing only the 24 external call displacements
and four external tail displacements. Local branches, return forms, operands,
and all non-transfer instructions compared exactly. The current report audit
found all 24 functions unmatched; the repository-wide collision audit found
no selected name in pre-existing configuration, specification, or runtime
reservation metadata.

The clean implementation source now exists, and its measured SHA-256 is
recorded above and in the neutral config.
