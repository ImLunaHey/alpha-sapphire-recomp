# ARM runtime/helper batch 119 specification

## Scope and evidence

This batch owns four previously unmatched ARM functions whose entries lie in
`[0x00480000, 0x004C0000)`. The ignored AS_EUR_REV2 target object and local
`code.bin` were used only as private clean-room evidence. No target bytes,
literal values, game assets, or extracted files are committed.

The selected routines own 288 executable body bytes (72 ARM instructions), no
adjacent bytes, 16 memory operations, nine local branches, five calls, one tail
transfer, and six return paths. All six external transfers are represented by
ELF relocations rather than fixed target-relative encodings.

## Boundaries

| Function | Body | Owned | Next global | Next offset |
| --- | ---: | ---: | --- | ---: |
| `func_004A9DA4` | 20 | 20 | `func_004A9DB8` | 20 |
| `func_004A9DF4` | 44 | 44 | `func_004A9E20` | 44 |
| `func_004B22CC` | 112 | 112 | `func_004B233C` | 112 |
| `func_004B233C` | 112 | 112 | `func_004B23AC` | 112 |

All four ownership intervals end exactly at the next target global. A recursive
source-label and config-interval audit excludes existing owners and interior
entries. No post-body material is claimed.

## Behavioural schedules

`func_004A9DA4` rearranges its first two arguments, fixes the byte count at
112, and tail-transfers to the established ARM copy identity
`func_00300B28`.

`func_004A9DF4` preserves the first argument, returns immediately when its
second argument is zero, otherwise asks the established Thumb comparison
identity `func_00100218` to compare eight bytes and canonicalizes the result to
one for equal and zero for unequal. Its prologue deliberately precedes the
zero-path branch, and the exact flag-setting `movs` is retained.

`func_004B22CC` and `func_004B233C` are related structured comparison helpers.
Each first compares six bytes, then compares two words and one byte at its
specific field offsets, and finally compares 20 bytes beginning at offset 43.
They return two on an early field mismatch, preserve zero from an equal final
comparison, and canonicalize a nonzero final result to one. Register choices,
condition codes, field offsets, branch destinations, and both distinct layouts
are preserved exactly.

## Relocation and ISA contract

| Owner | Offset | Kind | Instruction | Identity | Target ISA |
| --- | ---: | --- | --- | --- | --- |
| `func_004A9DA4` | 16 | `R_ARM_JUMP24` | `b` | `func_00300B28` | ARM |
| `func_004A9DF4` | 24 | `R_ARM_CALL` | `blx` | `func_00100218` | Thumb |
| `func_004B22CC` | 16, 88 | `R_ARM_CALL` | `blx` | `func_00100218` | Thumb |
| `func_004B233C` | 16, 88 | `R_ARM_CALL` | `blx` | `func_00100218` | Thumb |

The object must be ELF32 little-endian ARM ET_REL, EABI5, with ARMv6K,
Thumb-1, and VFPv2 attributes. Every owned section is a unique aligned
ALLOC|EXECINSTR PROGBITS section with one global STT_FUNC owner and an ARM `$a`
mapping symbol. Undefined external identities are exact global STT_NOTYPE
symbols. REL metadata, relocation slots/types/identities, instruction words,
function sizes, and the complete global symbol set are exact; RELA, DYNSYM,
foreign executable payload, duplicate owners, malformed metadata, and changed
instructions are rejected.

The validator caps the complete object at 64 MiB, executable material at 16
MiB, sections at 16,384, symbols and relocations at 1,000,000, and scans all
other source/config files for overlap. Its standalone self-test assembles the
canonical source, accepts a 12,000-empty-section composite, and rejects mutated
instruction, relocation, symbol, section, mapping, header, truncation, foreign
payload, and parser-limit fixtures.

## Standalone validation

```sh
node scripts/validate-arm-runtime-helpers-119.mjs --self-test
node scripts/validate-arm-runtime-helpers-119.mjs /path/to/arm_runtime_helpers_119.o
git diff --check
```

Shared build, source integration, progress, and objdiff files are not owned by
this lane.
