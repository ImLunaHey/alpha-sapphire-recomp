# ARM runtime/helper batch 121

## Scope and evidence

Eight unique, report-unmatched, source-unowned ARM helpers with entries in
[0x00140000, 0x00180000). Selection checked every config ownership interval and
recursive source labels, aliases and C definitions. Private AS_EUR_REV2 code
passed the configured SHA-256; each complete body agrees with the authoritative
target ELF and occurs exactly once in the 10440-function inventory.

Own 672 body bytes (168 instructions), 56 adjacent literal bytes and
14 zero-addend R_ARM_ABS32 relocations. There are 85 memory operations,
4 local branches and 9 returns; no calls, external branches or indirect tails.
All literal contents remain private. Independent assembly and private relocation
resolution must reproduce every owned byte exactly.

## Boundaries

| Function | Body bytes | Adjacent bytes | Next global | Next offset |
| --- | ---: | ---: | --- | ---: |
| func_0014849C | 60 | 4 | func_001484DC | 64 |
| func_0014C76C | 92 | 4 | func_0014C7CC | 96 |
| func_0015290C | 52 | 8 | func_00152948 | 60 |
| func_00164798 | 116 | 12 | func_00164818 | 128 |
| func_00174B9C | 132 | 8 | func_00174C28 | 140 |
| func_001753F0 | 32 | 12 | func_0017541C | 44 |
| func_0017851C | 80 | 4 | func_00178570 | 84 |
| func_001797F4 | 108 | 4 | func_00179870 | 124 |

Own only the full body and its contiguous, directly referenced literal words.
Exclude every remaining gap before the next global. The static audit across
ARM/Thumb bodies found 57 external transfers to primary entries, zero foreign
interior branch/literal/ADR references, and zero aligned code-image pointer words
to owned interiors. Computed indirect destinations cannot be inferred.

## Exact schedules

All offsets are decimal bytes; every instruction is four bytes. Preserve register
assignments, memory widths, displacements, writeback, conditions, flags and VFP
rounding order. Local branches use the exact config destinations.

### func_0014849C

Normalize a three-component vector using the original single-precision square-root/division and rounding schedule. Preserve component ordering and writes.

| Offset | Instruction |
| ---: | --- |
| 0 | `vldmia r1!, {s3}` |
| 4 | `vldr s4, literal(+60, runtime_float_unit_38)` |
| 8 | `add r2, r0, #4` |
| 12 | `vldmia r1, {s0-s1}` |
| 16 | `vmul.f32 s2, s3, s3` |
| 20 | `vmla.f32 s2, s0, s0` |
| 24 | `vmla.f32 s2, s1, s1` |
| 28 | `vsqrt.f32 s5, s2` |
| 32 | `vdiv.f32 s2, s4, s5` |
| 36 | `vmul.f32 s3, s3, s2` |
| 40 | `vmul.f32 s1, s1, s2` |
| 44 | `vmul.f32 s0, s0, s2` |
| 48 | `vstr s3, [r0]` |
| 52 | `vstmia r2, {s0-s1}` |
| 56 | `bx lr` |

### func_0014C76C

Interpolate four single-precision components using one minus the input weight. Preserve the original multiply/accumulate schedule and alias-sensitive loads/stores.

| Offset | Instruction |
| ---: | --- |
| 0 | `vldr s1, literal(+92, runtime_float_unit_38)` |
| 4 | `vldr s2, [r1]` |
| 8 | `vldr s3, [r2]` |
| 12 | `vsub.f32 s1, s1, s0` |
| 16 | `vmul.f32 s2, s2, s1` |
| 20 | `vmla.f32 s2, s3, s0` |
| 24 | `vstr s2, [r0]` |
| 28 | `vldr s2, [r1, #4]` |
| 32 | `vldr s3, [r2, #4]` |
| 36 | `vmul.f32 s2, s2, s1` |
| 40 | `vmla.f32 s2, s3, s0` |
| 44 | `vstr s2, [r0, #4]` |
| 48 | `vldr s2, [r1, #8]` |
| 52 | `vldr s3, [r2, #8]` |
| 56 | `vmul.f32 s2, s2, s1` |
| 60 | `vmla.f32 s2, s3, s0` |
| 64 | `vstr s2, [r0, #8]` |
| 68 | `vldr s3, [r1, #12]` |
| 72 | `vldr s2, [r2, #12]` |
| 76 | `vmul.f32 s1, s3, s1` |
| 80 | `vmla.f32 s1, s2, s0` |
| 84 | `vstr s1, [r0, #12]` |
| 88 | `bx lr` |

### func_0015290C

Form four products from the two input components and two symbolic coefficients, preserving the original vector output order.

| Offset | Instruction |
| ---: | --- |
| 0 | `vldr s2, literal(+52, runtime_literal_121_1)` |
| 4 | `vldr s3, [r1, #24]` |
| 8 | `vldr s0, literal(+56, runtime_literal_121_2)` |
| 12 | `vldr s1, [r1, #28]` |
| 16 | `vmul.f32 s5, s3, s2` |
| 20 | `add r2, r0, #8` |
| 24 | `vmul.f32 s4, s1, s0` |
| 28 | `vmul.f32 s1, s1, s2` |
| 32 | `vmul.f32 s0, s3, s0` |
| 36 | `vstr s5, [r0]` |
| 40 | `vstr s4, [r0, #4]` |
| 44 | `vstmia r2, {s0-s1}` |
| 48 | `bx lr` |

### func_00164798

Advance a four-word bitwise state and derive its output using conditional symbolic masks. Preserve r4/r5 and all flag-dependent operations.

| Offset | Instruction |
| ---: | --- |
| 0 | `push {r4, r5}` |
| 4 | `ldr ip, [r0]` |
| 8 | `ldr r2, [r0, #8]` |
| 12 | `ldr r3, [r0, #4]` |
| 16 | `ldr r1, [r0, #12]` |
| 20 | `bic ip, ip, #-2147483648` |
| 24 | `eor r4, r3, r2` |
| 28 | `eor ip, ip, r4` |
| 32 | `eor r1, r1, r1, lsr #1` |
| 36 | `eor ip, ip, ip, lsl #1` |
| 40 | `eor r1, r1, ip` |
| 44 | `tst r1, #1` |
| 48 | `eor ip, ip, r1, lsl #10` |
| 52 | `beq local(+72)` |
| 56 | `ldr r5, literal(+116, runtime_literal_121_3)` |
| 60 | `ldr r4, literal(+120, runtime_literal_121_4)` |
| 64 | `eor r2, r2, r5` |
| 68 | `eor ip, ip, r4` |
| 72 | `str r3, [r0]` |
| 76 | `str r1, [r0, #12]` |
| 80 | `add r0, r0, #4` |
| 84 | `add r4, r3, ip, lsr #8` |
| 88 | `stm r0, {r2, ip}` |
| 92 | `tst r4, #1` |
| 96 | `eor r0, r1, r4` |
| 100 | `ldrne r1, literal(+124, runtime_literal_121_5)` |
| 104 | `pop {r4, r5}` |
| 108 | `eorne r0, r0, r1` |
| 112 | `bx lr` |

### func_00174B9C

Initialize linked fields, doubleword fields, scalar flags and floating fields at their exact displacements. Preserve the original r3 values used by paired stores.

| Offset | Instruction |
| ---: | --- |
| 0 | `add r1, r0, #4` |
| 4 | `mov r2, #0` |
| 8 | `str r1, [r0, #4]` |
| 12 | `str r2, [r0]` |
| 16 | `str r1, [r0, #8]` |
| 20 | `add r3, r0, #16` |
| 24 | `strd r2, [r0, #12]` |
| 28 | `add r1, r0, #24` |
| 32 | `str r3, [r0, #20]` |
| 36 | `add r3, r0, #28` |
| 40 | `strd r2, [r1]` |
| 44 | `add r1, r0, #36` |
| 48 | `str r3, [r0, #32]` |
| 52 | `add r3, r0, #40` |
| 56 | `strd r2, [r1]` |
| 60 | `str r3, [r0, #44]` |
| 64 | `mvn r3, #-2147483648` |
| 68 | `str r2, [r0, #56]` |
| 72 | `mov ip, #1` |
| 76 | `vldr s1, literal(+136, runtime_float_unit_38)` |
| 80 | `str r3, [r0, #52]` |
| 84 | `vldr s0, literal(+132, runtime_float_zero_38)` |
| 88 | `str ip, [r0, #48]` |
| 92 | `vstr s1, [r0, #60]` |
| 96 | `mvn r1, #0` |
| 100 | `vstr s0, [r0, #64]` |
| 104 | `str r1, [r0, #68]` |
| 108 | `vstr s0, [r0, #72]` |
| 112 | `vstr s0, [r0, #76]` |
| 116 | `strb r2, [r0, #88]` |
| 120 | `vstr s0, [r0, #80]` |
| 124 | `vstr s0, [r0, #84]` |
| 128 | `bx lr` |

### func_001753F0

Advance shared scalar state through multiply/accumulate and return its upper halfword. Preserve all three distinct symbolic identities.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r1, literal(+32, runtime_literal_121_6)` |
| 4 | `ldr r3, literal(+36, runtime_literal_121_7)` |
| 8 | `ldr r2, literal(+40, runtime_literal_121_8)` |
| 12 | `ldr r0, [r1]` |
| 16 | `mla r2, r0, r3, r2` |
| 20 | `str r2, [r1]` |
| 24 | `lsr r0, r2, #16` |
| 28 | `bx lr` |

### func_0017851C

Apply signed reciprocal-multiply divisibility checks and low-bit tests; return the original predicate at both return sites.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r1, literal(+80, runtime_literal_121_9)` |
| 4 | `mvn r2, #24` |
| 8 | `smull r3, r1, r1, r0` |
| 12 | `asr r3, r1, #7` |
| 16 | `sub r3, r3, r1, asr #31` |
| 20 | `mul r2, r3, r2` |
| 24 | `adds r2, r0, r2, lsl #4` |
| 28 | `beq local(+72)` |
| 32 | `asr r3, r1, #5` |
| 36 | `mvn r2, #24` |
| 40 | `sub r1, r3, r1, asr #31` |
| 44 | `mul r1, r1, r2` |
| 48 | `adds r1, r0, r1, lsl #2` |
| 52 | `beq local(+64)` |
| 56 | `tst r0, #3` |
| 60 | `beq local(+72)` |
| 64 | `mov r0, #0` |
| 68 | `bx lr` |
| 72 | `mov r0, #1` |
| 76 | `bx lr` |

### func_001797F4

Initialize a record from two input bytes, its symbolic descriptor, zeroed fields and enabled flags. Preserve repeated writes and paired stores.

| Offset | Instruction |
| ---: | --- |
| 0 | `mov r3, #0` |
| 4 | `str r3, [r0, #4]` |
| 8 | `mov ip, #1` |
| 12 | `str ip, [r0, #4]` |
| 16 | `ldr ip, literal(+108, runtime_literal_121_10)` |
| 20 | `strb r3, [r0, #8]` |
| 24 | `str r3, [r0, #12]` |
| 28 | `str ip, [r0]` |
| 32 | `str r3, [r0, #16]` |
| 36 | `str r3, [r0, #28]` |
| 40 | `strb r1, [r0, #32]` |
| 44 | `ldrb r1, [r2]` |
| 48 | `mov r2, r3` |
| 52 | `mov ip, r3` |
| 56 | `strb r1, [r0, #33]` |
| 60 | `add r1, r0, #48` |
| 64 | `stm r1, {r2, ip}` |
| 68 | `mov r1, #1` |
| 72 | `strb r3, [r0, #34]` |
| 76 | `str r3, [r0, #36]` |
| 80 | `str r3, [r0, #40]` |
| 84 | `str r3, [r0, #24]` |
| 88 | `strb r3, [r0, #57]` |
| 92 | `strb r3, [r0, #58]` |
| 96 | `strb r3, [r0, #20]` |
| 100 | `strb r1, [r0, #56]` |
| 104 | `bx lr` |

## Relocations and identity

| Function | Offset | Type | Symbol |
| --- | ---: | --- | --- |
| func_0014849C | 60 | R_ARM_ABS32 | runtime_float_unit_38 |
| func_0014C76C | 92 | R_ARM_ABS32 | runtime_float_unit_38 |
| func_0015290C | 52 | R_ARM_ABS32 | runtime_literal_121_1 |
| func_0015290C | 56 | R_ARM_ABS32 | runtime_literal_121_2 |
| func_00164798 | 116 | R_ARM_ABS32 | runtime_literal_121_3 |
| func_00164798 | 120 | R_ARM_ABS32 | runtime_literal_121_4 |
| func_00164798 | 124 | R_ARM_ABS32 | runtime_literal_121_5 |
| func_00174B9C | 132 | R_ARM_ABS32 | runtime_float_zero_38 |
| func_00174B9C | 136 | R_ARM_ABS32 | runtime_float_unit_38 |
| func_001753F0 | 32 | R_ARM_ABS32 | runtime_literal_121_6 |
| func_001753F0 | 36 | R_ARM_ABS32 | runtime_literal_121_7 |
| func_001753F0 | 40 | R_ARM_ABS32 | runtime_literal_121_8 |
| func_0017851C | 80 | R_ARM_ABS32 | runtime_literal_121_9 |
| func_001797F4 | 108 | R_ARM_ABS32 | runtime_literal_121_10 |

Equal private words reuse established symbolic identities wherever available.
New identities are pairwise distinct and differ from established literal words
observed through the current config relocation inventory. No literal values,
pointed-to contents, assets or numeric external data addresses are reproduced.

## ELF and validation contract

Require ELF32 little-endian ARM ET_REL, flags exactly 0x05000000, ARMv6K,
ARM/Thumb-1/VFPv2 attributes. Each owned section is unique PROGBITS with flags
ALLOC|EXECINSTR, address zero, alignment four and exact owned size. Require one
canonical section symbol, one local $a at zero, one local $d at body size, and
one default-visible global STT_FUNC at zero with exact body size. Require the
exact global and local symbol sets, unique undefined global STT_NOTYPE literal
identities and one exact REL section per function. Relocation slots and identities
are exact, all addends zero. Reject RELA, DYNSYM, extra relocations, foreign
nonempty executable payload, altered instructions, symbols and malformed metadata.
Empty foreign executable sections are accepted. Hash-pin source, raw config,
normalized config and spec independently. Detect competing source/config owners.

Cap complete input before reading at 64 MiB, executable data at 16 MiB, sections
at 16,384, aggregate SYMTAB/DYNSYM symbols and REL/RELA records independently
at 1,000,000 before expensive decoding. Hostile self-tests mutate every owned
word, relocation and symbol metadata, mappings, ELF headers, parser caps and
truncation; accept a composite containing 12,000 empty executable sections.

## Standalone checks

```sh
arm-none-eabi-as -o /tmp/arm-runtime-helpers-121.o src/main/arm_runtime_helpers_121.S
node scripts/validate-arm-runtime-helpers-121.mjs /tmp/arm-runtime-helpers-121.o
node scripts/validate-arm-runtime-helpers-121.mjs --self-test
git diff --check
```

Only the four batch files are lane-owned; no shared integration or progress edits.
