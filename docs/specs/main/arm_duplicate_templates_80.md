# Probe-verified duplicate ARM templates 80

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- `sourceSha256`:
  `f89a8f7770a7d3a1cc66502a1054ad14f438c5f009c698c8887005198a912fe1`.
- Probe tool: GNU assembler from Arm GNU Toolchain 15.2.Rel1, binutils
  2.45.1.20251203.
- Evidence: the current objdiff report, the evidence-gated symbol inventory,
  repository-wide configured/owned/referenced-name exclusion, normalized
  complete-body grouping, bounded target control/data-flow and post-body
  inspection, direct-transfer resolution, physical literal comparison, and an
  independent assembly probe.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, instruction encodings, target hashes, private strings or
  values, extracted assets, proprietary source, or implementation source.

Every exact function in the current report and every function name already
configured, owned, reserved, or referenced by existing metadata was excluded.
Two tempting 148-byte candidates, a 28-byte pair, and several short normalized
groups were rejected because their inventoried bodies terminate on link calls
instead of completing their control flow. The selected 25 ARM-state functions
are unmatched, pairwise non-overlapping, and complete. They form eight
templates comprising 460 executable body bytes and 115 instructions:

| Template | Functions | Bytes each | Total |
| --- | ---: | ---: | ---: |
| Record-stream writer | 2 | 128 | 256 |
| Literal-context tail | 5 | 8 | 40 |
| Load-member tail | 5 | 8 | 40 |
| Literal-argument tail | 2 | 12 | 24 |
| Call and return | 3 | 12 | 36 |
| Add-16 tail | 3 | 8 | 24 |
| Add-8 tail | 3 | 8 | 24 |
| Fixed-mode tail | 2 | 8 | 16 |

The schedules contain 29 symbolic direct transfers: nine calls and twenty
tail branches. Four additional branch sites are local, and five sites return.
There are seven owned literal slots in five new identity classes, so this
batch owns 488 bytes in total while contributing 460 function-code bytes.
Eight PC-relative references in the two large functions address post-body
material without owning it. There are no register-indirect calls or tails and
no conditional returns.

## Function map and boundaries

| Template | Functions | Next globals (relative offset) |
| --- | --- | --- |
| Record-stream writer | `func_00217434`, `func_002174D4` | `func_002174D4`, `func_00217574` (+160 each) |
| Literal-context tail | `func_0010CA9C`, `func_001261F0`, `func_00126484`, `func_00126490`, `func_00257034` | `func_0010CAA8`, `func_001261FC`, `func_00126490`, `func_0012649C`, `func_00257040` (+12 each) |
| Load-member tail | `func_0032EC68`, `func_003B54C8`, `func_003B54D0`, `func_004CEF50`, `func_004D2994` | `func_0032EC70` (+8), `func_003B54D0` (+8), `func_003B54D8` (+8), `func_004CEF98` (+72), `func_004D29EC` (+88) |
| Literal-argument tail | `func_0051BE28`, `func_0051BE38` | `func_0051BE38` (+16), `func_0051BFD8` (+416) |
| Call and return | `func_00163C30`, `func_002BB64C`, `func_002BBD60` | `func_00163C3C` (+12), `func_002BB658` (+12), `func_002BC23C` (+1244) |
| Add-16 tail | `func_0021A9B0`, `func_003B7EFC`, `func_003B7FE8` | `func_0021A9B8` (+8), `func_003B7FE8` (+236), `func_003B7FF0` (+8) |
| Add-8 tail | `func_00253BF4`, `func_004E6C6C`, `func_004E6C74` | `func_00253BFC`, `func_004E6C74`, `func_004E6C7C` (+8 each) |
| Fixed-mode tail | `func_0029F35C`, `func_0029F540` | `func_0029F368` (+12), `func_0029F57C` (+60) |

Each literal-context function owns the four-byte slot at +8, immediately
after its body, and each literal-argument function owns its slot at +12.
Their `templateMaterialEndOffset` values are 11 and 15 respectively. No other
post-body byte is owned. In particular, the record-stream writers reference
offsets +128, +136, +140, and +152, but `DT80_END` closes their functions at
+128 and their sections must not emit any of that referenced material.
Remaining gaps before distant next globals are also unowned.

## Identity contracts

The seven literal sites form five physical classes. `context_shared` occurs in
`func_001261F0`, `func_00126484`, and `func_00126490`; the other two classes
for that template and both literal-argument classes occur once. All five are
new, mutually distinct, and physically distinct from every configured literal
class. Their values remain private and only the
neutral symbols in the configuration may appear in implementation source.

The 29 direct sites resolve to 24 distinct destination classes. Five classes
are shared twice: `func_00217604`, `func_00102DEC`, `func_00102868`, and
`func_0013335C`, plus `arm_duplicate_templates_80_secondary_001CF3AC`.
The remaining nineteen classes are singletons. The two `blx`
classes are inventoried Thumb entries; all other primary classes are ARM
entries. Two classes are secondary ARM entries: the first is a singleton and
the second is the shared two-site class. They must preserve these relations:

| Symbol | Owner relation | Next global | Bytes before next global |
| --- | --- | --- | ---: |
| `arm_duplicate_templates_80_secondary_003B39F0` | `func_003B39E4` +12 | `func_003B3A1C` | 44 |
| `arm_duplicate_templates_80_secondary_001CF3AC` | `func_001CF360` +76 | `func_001CF448` | 156 |

The eight post-body references resolve to eight distinct absolute addresses.
Their four relative offsets repeat in each record-stream writer, remain
relocation-free, and do not transfer ownership of the referenced bytes.
Exact ordered sites and identity classes are normative in
`config/arm-duplicate-templates-80.json`.

## Complete normalized schedules

Equivalent uniquely scoped local-label names are allowed. Every external
identity must remain symbolic. Offsets, operands, local destinations,
relocation kinds, function sizes, literal-load destinations, post-body
reference targets, and ownership boundaries are exact.

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm

.macro DT80_BEGIN name
.section .text.\name,"ax",%progbits
.balign 4
.global \name
.type \name,%function
\name:
.endm

.macro DT80_END name
.size \name,.-\name
.endm

.macro DT80_RECORD_STREAM_WRITER name
DT80_BEGIN \name
    push {r4, r5, r6, lr}
    mov r6, r1
    mov r4, r0
    mov r1, #32
    bl func_00217604
    ldrb r0, [r4, #528]
    add r5, r4, #512
    cmp r0, #0
    addeq r2, pc, #88
    beq .Ldt80_emit\@
    ldrb r0, [r5, #17]
    cmp r0, #0
    beq .Ldt80_select\@
    ldr r1, [pc, #76]
    ldr r0, [r4, #12]
    blx func_00102DEC
    ldr r0, [r4, #12]
    add r1, r0, #4
    str r1, [r4, #12]
.Ldt80_select\@:
    ldrb r0, [r5, #19]
    cmp r0, #0
    addne r2, pc, #48
    addeq r2, pc, #56
.Ldt80_emit\@:
    ldr r0, [r4, #12]
    mov r3, r6
    mov r1, #32
    blx func_00102868
    ldr r1, [r4, #12]
    add r0, r1, r0, lsl #1
    str r0, [r4, #12]
    mov r0, r4
    pop {r4, r5, r6, pc}
DT80_END \name
.endm

.macro DT80_LITERAL_CONTEXT_TAIL name, identity, destination
DT80_BEGIN \name
    ldr r0, [pc, #0]
    b \destination
DT80_END \name
    .word \identity
.endm

.macro DT80_LOAD_MEMBER_TAIL name, destination
DT80_BEGIN \name
    ldr r0, [r0, #12]
    b \destination
DT80_END \name
.endm

.macro DT80_LITERAL_ARGUMENT_TAIL name, identity
DT80_BEGIN \name
    mov r2, r1
    ldr r1, [pc, #0]
    b arm_duplicate_templates_80_secondary_001CF3AC
DT80_END \name
    .word \identity
.endm

.macro DT80_CALL_AND_RETURN name, destination
DT80_BEGIN \name
    push {r4, lr}
    bl \destination
    pop {r4, pc}
DT80_END \name
.endm

.macro DT80_OFFSET_16_TAIL name, destination
DT80_BEGIN \name
    add r0, r0, #16
    b \destination
DT80_END \name
.endm

.macro DT80_OFFSET_8_TAIL name, destination
DT80_BEGIN \name
    add r0, r0, #8
    b \destination
DT80_END \name
.endm

.macro DT80_FIXED_MODE_TAIL name
DT80_BEGIN \name
    mov r1, #3
    b func_0013335C
DT80_END \name
.endm
```

The immediate PC-relative forms in `DT80_RECORD_STREAM_WRITER` are deliberate.
They describe only neutral relative reach and must not be rewritten to own,
copy, name, or expose the referenced target material.

## Variant bindings, local labels, and relocations

| Functions | Binding | Local destinations | Ordered external relocations |
| --- | --- | --- | --- |
| `func_00217434`, `func_002174D4` | `DT80_RECORD_STREAM_WRITER` | +36 `beq` to +92; +48 `beq` to +76 | +16 `R_ARM_CALL` `func_00217604`; +60 `R_ARM_CALL` `func_00102DEC` (`blx`); +104 `R_ARM_CALL` `func_00102868` (`blx`) per function |
| `func_0010CA9C` | context A; `func_00178238` | none | +4 `R_ARM_JUMP24` tail; +8 `R_ARM_ABS32` context A |
| `func_001261F0` | shared context; `func_00132A14` | none | +4 tail; +8 shared context |
| `func_00126484` | shared context; `func_001600B0` | none | +4 tail; +8 shared context |
| `func_00126490` | shared context; `func_00124150` | none | +4 tail; +8 shared context |
| `func_00257034` | context B; `func_00266AE8` | none | +4 tail; +8 context B |
| `func_0032EC68`, `func_003B54C8`, `func_003B54D0`, `func_004CEF50`, `func_004D2994` | destinations in configuration order | none | +4 `R_ARM_JUMP24` per function |
| `func_0051BE28`, `func_0051BE38` | argument identities A/B; shared secondary tail | none | +8 `R_ARM_JUMP24` tail; +12 `R_ARM_ABS32` argument identity per function |
| `func_00163C30`, `func_002BB64C`, `func_002BBD60` | destinations in configuration order | none | +4 `R_ARM_CALL` per function |
| `func_0021A9B0`, `func_003B7EFC`, `func_003B7FE8` | destinations in configuration order | none | +4 `R_ARM_JUMP24` per function |
| `func_00253BF4`, `func_004E6C6C`, `func_004E6C74` | destinations in configuration order | none | +4 `R_ARM_JUMP24` per function |
| `func_0029F35C`, `func_0029F540` | shared `func_0013335C` | none | +4 `R_ARM_JUMP24` per function |

## Canonical schedules and verification

Canonical records use function order from the configuration, increasing
instruction/relocation offsets, decimal offsets, LF termination, symbolic
external destinations, and `local:+N` operands for local branches. The exact
record formats are declared in the configuration. SHA-256 digests are:

| Schedule | Records | Digest |
| --- | ---: | --- |
| Instruction | 115 | `fc5ff4f02cb7c90bf40274316fd901105b18a4ae0231be6cd21f7dc7e28a5f28` |
| Local transfer | 4 | `a529a666c61ec1deb5541a741f022348c78b35f65ec4cb28497c02475608413a` |
| Relocation | 36 | `8e123b1d94e63fa1a8640efb3a0071a2e409eab64a125b9c8c56a0a08051efe8` |
| Literal identity | 7 | `1b3e5ba1d1c7e0985da09fa0fe68ec0fcd0cd3929e5c587b1c03a60cf8acc591` |

The independent probe assembled all 25 body schedules with the stated sizes.
A section-by-section comparison against the private target passed for all 460
body bytes after normalizing only the 29 declared external direct-transfer
instruction words. Local branches, return forms, post-body reference
immediates, operands, and every other instruction compared exactly. Physical
inspection separately verified the seven literal sites, their five equality
classes, and their non-collision with all configured literal classes. The
current report audit found all 25 functions unmatched, and the repository-wide
collision audit found no selected name in earlier configuration,
specification, or runtime reservation metadata.
