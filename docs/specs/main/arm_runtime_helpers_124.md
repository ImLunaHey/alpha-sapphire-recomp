# ARM runtime/helper batch 124 specification

Four unique, report-unmatched ARM functions with entries in [0x00200000, 0x00240000).
The inventory contains 513 ARM functions in this range. Selection excludes existing
source definitions and config ownership intervals. Private AS_EUR_REV2 target evidence
and manifest-verified code.bin establish the instruction schedules and literal identities.
Each selected complete body occurs exactly once in the authoritative function inventory.
No extracted assets, literal values or pointed-to data belong to this lane.

Own exactly 120 body bytes (30 instructions), 24 adjacent literal bytes and six
zero-addend R_ARM_ABS32 relocations. There are 21 memory operations and four
returns, with no branches, calls, tails or indirect transfers.

## Boundaries

| Function | Body bytes | Adjacent bytes | Owned bytes | Next global | Next offset |
| --- | ---: | ---: | ---: | --- | ---: |
| func_002067AC | 32 | 4 | 36 | func_002067EC | 64 |
| func_002354CC | 28 | 8 | 36 | func_002354F0 | 36 |
| func_002354F0 | 28 | 8 | 36 | func_00235514 | 36 |
| func_0023793C | 32 | 4 | 36 | func_00237B84 | 584 |

Only the contiguous literal slots directly loaded by each owner are adjacent ownership.
Gaps before the next global remain excluded. All loads use ARM PC = instruction + 8.
Preserve register assignments, memory widths, ordering and writeback exactly.

## func_002067AC

Initialize the leading opaque identity, clear two words, then set the byte at offset five to two. Preserve the overlapping word/byte writes.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r1, literal(+32, runtime_literal_124_1)` |
| 4 | `mov r2, #0` |
| 8 | `str r1, [r0]` |
| 12 | `str r2, [r0, #4]` |
| 16 | `mov r1, #2` |
| 20 | `str r2, [r0, #8]` |
| 24 | `strb r1, [r0, #5]` |
| 28 | `bx lr` |

## func_002354CC

Store the incoming word at object offset 116, then emit a three-word descriptor with two opaque identities and immediate 111. Preserve r0 post-increment.

| Offset | Instruction |
| ---: | --- |
| 0 | `str r2, [r1, #116]` |
| 4 | `ldr r1, literal(+28, runtime_literal_124_2)` |
| 8 | `mov r2, #111` |
| 12 | `str r1, [r0], #4` |
| 16 | `ldr r1, literal(+32, runtime_literal_124_3)` |
| 20 | `stm r0, {r1, r2}` |
| 24 | `bx lr` |

## func_002354F0

Store the incoming word at object offset 108, then emit the descriptor. This distinct function differs in the initial destination displacement.

| Offset | Instruction |
| ---: | --- |
| 0 | `str r2, [r1, #108]` |
| 4 | `ldr r1, literal(+28, runtime_literal_124_2)` |
| 8 | `mov r2, #111` |
| 12 | `str r1, [r0], #4` |
| 16 | `ldr r1, literal(+32, runtime_literal_124_3)` |
| 20 | `stm r0, {r1, r2}` |
| 24 | `bx lr` |

## func_0023793C

Initialize the leading opaque identity, clear the byte and words at offsets eight, four and twelve in order, and store the input byte at offset sixteen.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r3, literal(+32, runtime_literal_124_4)` |
| 4 | `mov r2, #0` |
| 8 | `str r3, [r0]` |
| 12 | `strb r2, [r0, #8]` |
| 16 | `str r2, [r0, #4]` |
| 20 | `str r2, [r0, #12]` |
| 24 | `strb r1, [r0, #16]` |
| 28 | `bx lr` |

## Relocations and identity

| Function | Offset | Kind | Identity |
| --- | ---: | --- | --- |
| func_002067AC | 32 | R_ARM_ABS32 | runtime_literal_124_1 |
| func_002354CC | 28 | R_ARM_ABS32 | runtime_literal_124_2 |
| func_002354CC | 32 | R_ARM_ABS32 | runtime_literal_124_3 |
| func_002354F0 | 28 | R_ARM_ABS32 | runtime_literal_124_2 |
| func_002354F0 | 32 | R_ARM_ABS32 | runtime_literal_124_3 |
| func_0023793C | 32 | R_ARM_ABS32 | runtime_literal_124_4 |

Equal private literal values share one symbolic identity, reusing existing identities
where available. Values stay private. Literal addends in the relocatable object are zero.

## Validation contract

Require ELF32 little-endian EM_ARM ET_REL, EABI5 flags exactly 0x05000000,
ARMv6K/Thumb-1/VFPv2 attributes, and one aligned executable PROGBITS section per
function with exact body and owned sizes. Require the exact global function and
undefined identity sets, canonical section symbols, ARM mapping at zero, data
mapping at body end, and no extra owned symbols. Each function has exactly one
REL section with exact ABS32 slots, identities and zero addends. Reject RELA,
DYNSYM, duplicate ownership, foreign executable payload and malformed metadata.
Accept unrelated empty executable sections. Independently pin source, raw config,
normalized config and specification hashes.

Bound input to 64 MiB before reading, executable bytes to 16 MiB, sections to
16,384 and aggregate symbols/relocations to 1,000,000 each before decoding.
Self-tests mutate every instruction and literal word, ELF metadata, relocations,
symbols, mapping states, headers, bounds and truncations; accept a 12,000-section
composite. Ownership checks scan recursive source definitions, assembly aliases
and all configuration intervals on every invocation.

Authoritative mode requires the manifest-pinned private code.bin. Compare every
assembled body byte with the original address, resolve ABS32 slots only from
private literal evidence, enforce identity equality, and compare every owned byte.
It also checks the private target object bodies and current unmatched report.
A synthetic fixture alone never establishes authoritative correctness.

Assemble and validate without shared integration:

```sh
arm-none-eabi-as -o /tmp/arm-runtime-helpers-124.o src/main/arm_runtime_helpers_124.S
node scripts/validate-arm-runtime-helpers-124.mjs /tmp/arm-runtime-helpers-124.o
node scripts/validate-arm-runtime-helpers-124.mjs --self-test
node scripts/validate-arm-runtime-helpers-124.mjs --authoritative /tmp/arm-runtime-helpers-124.o /private/path/code.bin
git diff --check
```

No shared integration, build, generator or progress files are lane-owned.
