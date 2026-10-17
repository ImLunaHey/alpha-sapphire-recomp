# ARM runtime/helper batch 116 specification

## Scope and evidence

Six unique, report-unmatched, source-unowned ARM leaf functions in the exact
entry range [0x004C0000, 0x00500000). The ignored AS_EUR_REV2 target object
and report reproduce the prior scan: 658 functions, all ARM, 354 unmatched.
Only ignored target evidence was used to derive instruction and literal facts.
The authoritative local code.bin independently agrees with every body byte.
Each full body occurs once among all 10,440 authoritative target functions.
Selection also checked recursive source labels, C definitions and assembly
aliases, plus all existing config ownership intervals, including untracked lanes.

Own 272 body bytes (68 instructions), 32 literal bytes,
21 memory operations (counting push/pop), six returns and eight ABS32 relocations.
There are no calls, local branches, tails or indirect transfers.

## Boundaries

| Function | Body | Owned | Next global | Next offset |
| --- | ---: | ---: | --- | ---: |
| func_004C01E8 | 28 | 32 | func_004C0208 | 32 |
| func_004C5898 | 56 | 68 | func_004C58DC | 68 |
| func_004C79A0 | 68 | 72 | func_004C7A54 | 180 |
| func_004E6B04 | 24 | 28 | func_004E6B20 | 28 |
| func_004EA690 | 24 | 28 | func_004EA6B8 | 40 |
| func_004EDAE0 | 72 | 76 | func_004EDB60 | 128 |

Own only each complete body and its contiguous, directly referenced literal words.
Every literal has a decoded PC-relative load in its owner. An audit of ARM and
Thumb direct branches, literals, ADRs, and aligned possible pointers finds only
primary-entry references and each owner's stated literal loads within these spans.
No interior entry, foreign literal reference, overlap or unreferenced word is owned.
The remaining gaps before subsequent globals are excluded. No authored strings,
assets, tables or ambiguous adjacent material are reproduced.

## Exact instruction schedules

Preserve instruction ordering, register assignments, condition codes, memory widths,
displacements, flag effects and single-precision VFP operations exactly. All body
operations are four bytes. Symbolic literal loads use the exact stated offsets.

### func_004C01E8

Load a nested word and compare it unsigned with an opaque threshold; return one for lower-or-same and zero for higher.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r0, [r0]` |
| 4 | `ldr r1, literal(+28, runtime_literal_116_1)` |
| 8 | `ldr r0, [r0, #8]` |
| 12 | `cmp r0, r1` |
| 16 | `movls r0, #1` |
| 20 | `movhi r0, #0` |
| 24 | `bx lr` |

### func_004C5898

Preserve the single-precision curve evaluation schedule, its three coefficient identities, and the original multiply/add/subtract rounding order.

| Offset | Instruction |
| ---: | --- |
| 0 | `vmov.f32 s5, s0` |
| 4 | `vldr s9, literal(+56, runtime_curve_coefficient_c_46)` |
| 8 | `vadd.f32 s6, s2, s4` |
| 12 | `vmov.f32 s0, s1` |
| 16 | `vsub.f32 s1, s1, s3` |
| 20 | `vnmls.f32 s4, s2, s9` |
| 24 | `vldr s8, literal(+60, runtime_curve_coefficient_a_46)` |
| 28 | `vldr s7, literal(+64, runtime_curve_coefficient_b_46)` |
| 32 | `vmla.f32 s6, s1, s8` |
| 36 | `vmls.f32 s4, s1, s7` |
| 40 | `vmla.f32 s4, s6, s5` |
| 44 | `vmla.f32 s2, s5, s4` |
| 48 | `vmla.f32 s0, s5, s2` |
| 52 | `bx lr` |

### func_004C79A0

Compare s1 and s0 with the shared zero identity, transfer FPSCR flags to APSR at both original points, and combine their conditional classification bits. Preserve the unordered cases.

| Offset | Instruction |
| ---: | --- |
| 0 | `vldr s2, literal(+68, runtime_float_zero_38)` |
| 4 | `vcmpe.f32 s1, s2` |
| 8 | `vmrs APSR_nzcv, fpscr` |
| 12 | `vcmpe.f32 s0, s2` |
| 16 | `movgt r0, #4` |
| 20 | `movle r0, #0` |
| 24 | `movcc r1, #8` |
| 28 | `movcs r1, #0` |
| 32 | `vmrs APSR_nzcv, fpscr` |
| 36 | `orr r0, r0, r1` |
| 40 | `movcc r1, #1` |
| 44 | `movcs r1, #0` |
| 48 | `orr r0, r0, r1` |
| 52 | `movgt r1, #2` |
| 56 | `movle r1, #0` |
| 60 | `orr r0, r0, r1` |
| 64 | `bx lr` |

### func_004E6B04

Compare an unsigned halfword at offset two with the established threshold and return its lower-or-same predicate.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldrh r0, [r0, #2]` |
| 4 | `ldr r1, literal(+24, runtime_scalar_threshold_99)` |
| 8 | `cmp r0, r1` |
| 12 | `movls r0, #1` |
| 16 | `movhi r0, #0` |
| 20 | `bx lr` |

### func_004EA690

Compare the word at offset eight with an opaque equality identity and return the equality predicate.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r0, [r0, #8]` |
| 4 | `ldr r1, literal(+24, runtime_literal_116_2)` |
| 8 | `cmp r0, r1` |
| 12 | `moveq r0, #1` |
| 16 | `movne r0, #0` |
| 20 | `bx lr` |

### func_004EDAE0

Load two indexed halfwords, write both output words, restore r4/r5, and return zero if either value equals the established fill identity; otherwise return one. Preserve the conditional second comparison.

| Offset | Instruction |
| ---: | --- |
| 0 | `push {r4, r5}` |
| 4 | `ldr r5, [r0, #20]` |
| 8 | `mov r4, #2` |
| 12 | `ldr ip, literal(+72, runtime_halfword_fill_38)` |
| 16 | `add r5, r5, r1, lsl #2` |
| 20 | `add r1, r4, r1, lsl #2` |
| 24 | `ldrh r4, [r5]` |
| 28 | `str r4, [r2]` |
| 32 | `ldr r0, [r0, #20]` |
| 36 | `ldrh r0, [r0, r1]` |
| 40 | `str r0, [r3]` |
| 44 | `ldr r1, [r2]` |
| 48 | `pop {r4, r5}` |
| 52 | `cmp r1, ip` |
| 56 | `cmpne r0, ip` |
| 60 | `moveq r0, #0` |
| 64 | `movne r0, #1` |
| 68 | `bx lr` |

## Symbolic identity and ELF contract

Literal values stay private; source contains zero-addend ABS32 relocations.
The six reused identities are `runtime_curve_coefficient_c_46`, `runtime_curve_coefficient_a_46`, `runtime_curve_coefficient_b_46`, `runtime_float_zero_38`, `runtime_scalar_threshold_99`, `runtime_halfword_fill_38`.
The two new identities are distinct from each other and the established target
literal inventory. Preserve equality by symbol name without reproducing literal
contents, pointed-to data or inferred resource semantics.

Require ELF32 little-endian ARM ET_REL with flags exactly 0x05000000 and the
pinned ARMv6K, ARM ISA, Thumb-1 and VFPv2 attributes. Each unique owned section
is PROGBITS, flags exactly ALLOC|EXECINSTR, address zero, alignment four,
exact size, zero link/info/entry-size, one canonical local section symbol,
one local $a at zero, one local $d at body size, and one global default-visible
STT_FUNC at zero with exact body size. No aliases or extra owned symbols.
Undefined literal symbols must be unique global STT_NOTYPE with all other
fields zero. Global and named-local symbol sets are exact. Each owner has one
REL section, flags INFO_LINK, alignment four, entry-size eight, proper links,
and exactly its stated ABS32 slots and identities; order is immaterial.
Reject RELA, DYNSYM, any extra relocation section (including empty), foreign
nonempty executable payload, duplicate sections, altered instructions/addends,
wrong mapping states and malformed metadata. Extra empty executable sections
are accepted. Source, raw/normalized config and spec are independently hash-pinned.

Independently cap the complete file before reading at 64 MiB, executable bytes
at 16 MiB, sections at 16,384, aggregate SYMTAB/DYNSYM entries at 1,000,000
and aggregate REL/RELA records at 1,000,000 before expensive decoding.
The self-test accepts a composite with 12,000 unrelated empty executable sections
and rejects parser-level cap fixtures, every changed instruction and addend,
relocation identity/shape/metadata mutations, bad symbols/mapping/headers,
truncation and foreign payload.

## Standalone validation

Assemble with arm-none-eabi-as, then run:

```sh
node scripts/validate-arm-runtime-helpers-116.mjs <lane-object>
node scripts/validate-arm-runtime-helpers-116.mjs --self-test
git diff --check
```

No shared build, source integration, progress or objdiff files are lane-owned.
