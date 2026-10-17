# ARM runtime/helper batch 132 specification

One unique, report-unmatched ARM function with an entry in [0x00540000, 0x00580000).
The inventory contains 304 ARM functions in this range. Selection excludes existing
source definitions and config ownership intervals. Private AS_EUR_REV2 target evidence
and manifest-verified code.bin establish the instruction schedules and literal identities.
Each selected complete body occurs exactly once in the authoritative function inventory.
No extracted assets, literal values or pointed-to data belong to this lane.

Own exactly 60 body bytes (15 instructions), 12 adjacent literal bytes and three
zero-addend R_ARM_ABS32 relocations. There are 10 memory operations and one
return, with no branches, calls, tails or indirect transfers.

## Boundaries

| Function | Body bytes | Adjacent bytes | Owned bytes | Next global | Next offset |
| --- | ---: | ---: | ---: | --- | ---: |
| func_0056AF60 | 60 | 12 | 72 | func_0056AFC8 | 104 |

Only the contiguous literal slots directly loaded by each owner are adjacent ownership.
Gaps before the next global remain excluded. All loads use ARM PC = instruction + 8.
Preserve register assignments, memory widths, ordering and writeback exactly.

## func_0056AF60

Initialize an inline byte buffer at object offset 12. Store its pointer at offset 4 and capacity 32 at offset 8, clear the final capacity byte and the first byte, and install the opaque identity at offset 0. Preserve both otherwise overwritten literal loads and their register effects.

| Offset | Instruction |
| ---: | --- |
| 0 | `add r1, r0, #12` |
| 4 | `str r1, [r0, #4]` |
| 8 | `mov r2, #32` |
| 12 | `ldr r1, literal(+60, runtime_literal_132_1)` |
| 16 | `str r2, [r0, #8]` |
| 20 | `ldr r1, [r0, #4]` |
| 24 | `mov r3, #0` |
| 28 | `sub r1, r1, #1` |
| 32 | `strb r3, [r2, r1]` |
| 36 | `ldr r1, [r0, #4]` |
| 40 | `ldr r2, literal(+64, runtime_literal_132_2)` |
| 44 | `strb r3, [r1]` |
| 48 | `ldr r1, literal(+68, runtime_literal_132_3)` |
| 52 | `str r1, [r0]` |
| 56 | `bx lr` |

## Relocations and identity

| Function | Offset | Kind | Identity |
| --- | ---: | --- | --- |
| func_0056AF60 | 60 | R_ARM_ABS32 | runtime_literal_132_1 |
| func_0056AF60 | 64 | R_ARM_ABS32 | runtime_literal_132_2 |
| func_0056AF60 | 68 | R_ARM_ABS32 | runtime_literal_132_3 |

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
arm-none-eabi-as -o /tmp/arm-runtime-helpers-132.o src/main/arm_runtime_helpers_132.S
node scripts/validate-arm-runtime-helpers-132.mjs /tmp/arm-runtime-helpers-132.o
node scripts/validate-arm-runtime-helpers-132.mjs --self-test
node scripts/validate-arm-runtime-helpers-132.mjs --authoritative /tmp/arm-runtime-helpers-132.o /private/path/code.bin
git diff --check
```

No shared integration, build, generator or progress files are lane-owned.
