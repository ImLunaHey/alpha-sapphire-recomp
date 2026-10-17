# ARM runtime/helper batch 131 specification

Two unique, report-unmatched ARM functions with entries in [0x003C0000, 0x00400000).
The inventory contains 290 ARM functions in this range. Selection excludes existing
source definitions and config ownership intervals. Private AS_EUR_REV2 target evidence
and manifest-verified code.bin establish the instruction schedules and literal identities.
Each selected complete body occurs exactly once in the authoritative function inventory.
No extracted assets, literal values or pointed-to data belong to this lane.

Own exactly 48 body bytes (12 instructions), eight adjacent literal bytes and two
zero-addend R_ARM_ABS32 relocations. There are 5 memory operations and two
returns, with no branches, calls, tails or indirect transfers.

## Boundaries

| Function | Body bytes | Adjacent bytes | Owned bytes | Next global | Next offset |
| --- | ---: | ---: | ---: | --- | ---: |
| func_003CBD50 | 24 | 4 | 28 | func_003CC434 | 1764 |
| func_003DB99C | 24 | 4 | 28 | func_003DBE54 | 1208 |

Only the contiguous literal slots directly loaded by each owner are adjacent ownership.
Gaps before the next global remain excluded. All loads use ARM PC = instruction + 8.
Preserve register assignments, memory widths, ordering and writeback exactly.

## func_003CBD50

Interpret r0 as an unsigned index. For indices below 85, return the opaque table base plus index times 20. Otherwise return zero. Preserve the comparison flags across both conditional additions and the conditional move; an out-of-range index must not load the table base.

| Offset | Instruction |
| ---: | --- |
| 0 | `cmp r0, #85` |
| 4 | `ldrcc r1, literal(+24, runtime_literal_131_1)` |
| 8 | `addcc r0, r0, r0, lsl #2` |
| 12 | `movcs r0, #0` |
| 16 | `addcc r0, r1, r0, lsl #2` |
| 20 | `bx lr` |

## func_003DB99C

Clear words at object offsets 36 and 40 and install an opaque identity at offset 32. Preserve the write order 36, 32, 40.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r2, literal(+24, runtime_literal_131_2)` |
| 4 | `mov r1, #0` |
| 8 | `str r1, [r0, #36]` |
| 12 | `str r2, [r0, #32]` |
| 16 | `str r1, [r0, #40]` |
| 20 | `bx lr` |

## Relocations and identity

| Function | Offset | Kind | Identity |
| --- | ---: | --- | --- |
| func_003CBD50 | 24 | R_ARM_ABS32 | runtime_literal_131_1 |
| func_003DB99C | 24 | R_ARM_ABS32 | runtime_literal_131_2 |

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
arm-none-eabi-as -o /tmp/arm-runtime-helpers-131.o src/main/arm_runtime_helpers_131.S
node scripts/validate-arm-runtime-helpers-131.mjs /tmp/arm-runtime-helpers-131.o
node scripts/validate-arm-runtime-helpers-131.mjs --self-test
node scripts/validate-arm-runtime-helpers-131.mjs --authoritative /tmp/arm-runtime-helpers-131.o /private/path/code.bin
git diff --check
```

No shared integration, build, generator or progress files are lane-owned.
