# ARM runtime/helper batch 130 specification

Two unique, currently report-unmatched ARM functions with entries in
[0x00380000, 0x003C0000), selected from 635 ARM inventory entries. Private
AS_EUR_REV2 evidence establishes schedules, boundaries and opaque identities.
No ROM, extracted bytes, literal values or pointed-to assets belong to this batch.

Own 60 body bytes (15 instructions), eight adjacent literal bytes and two
zero-addend R_ARM_ABS32 relocations. There are nine memory instructions and two
returns; no local branches, calls, external tails or indirect transfers.

| Function | Body bytes | Adjacent bytes | Owned bytes | Next global | Next offset |
| --- | ---: | ---: | ---: | --- | ---: |
| func_00381CBC | 32 | 4 | 36 | func_00381DA4 | 232 |
| func_003BAEFC | 28 | 4 | 32 | func_003BAF34 | 56 |

Only the contiguous directly loaded literal belongs to each function. Gaps before
next globals remain excluded. ARM literal loads use instruction address plus eight.

## func_00381CBC

Initialize an object: write zero at offsets four and twelve, all ones at offset
eight, and an opaque identity at offset zero. Preserve r0 and the paired store's
register order; no flags are changed.

| Offset | Instruction |
| ---: | --- |
| 0 | `add r3, r0, #4` |
| 4 | `mov r1, #0` |
| 8 | `mvn r2, #0` |
| 12 | `stm r3, {r1, r2}` |
| 16 | `str r1, [r0, #12]` |
| 20 | `ldr r1, literal(+32, runtime_literal_130_1)` |
| 24 | `str r1, [r0]` |
| 28 | `bx lr` |

## func_003BAEFC

Clear the object's words at offsets four and zero, then clear a byte through an
opaque global identity, then clear the object's byte at offset eight. Preserve
this access order, r0, and flags.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r2, literal(+28, runtime_literal_130_2)` |
| 4 | `mov r1, #0` |
| 8 | `str r1, [r0, #4]` |
| 12 | `str r1, [r0]` |
| 16 | `strb r1, [r2]` |
| 20 | `strb r1, [r0, #8]` |
| 24 | `bx lr` |

## Identity and ownership

The +32 and +28 slots reference distinct undefined opaque symbols
runtime_literal_130_1 and runtime_literal_130_2 with zero addends. Private equality
checks establish distinct identities; their values stay private. Function symbol
sizes exclude literals; executable section sizes include them. Recursive source
definitions, assembly aliases and config intervals must have no overlapping owner
on every validator invocation.

## Validation contract

Require ELF32 little-endian EM_ARM ET_REL, exact EABI5 flags 0x05000000,
ARMv6K/Thumb-1/VFPv2 attributes, aligned executable PROGBITS sections, exact
instruction encodings, function sizes, ARM/data mappings, section symbols,
undefined identities and ABS32 relocations. Reject foreign executable payload,
extra symbols, RELA, DYNSYM, malformed bounds and duplicate ownership. Empty
unrelated executable sections are accepted. Pin source, raw configuration,
normalized contract and specification independently.

Bound files to 64 MiB before reads, executable bytes to 16 MiB, sections to 16,384,
and aggregate symbols and relocations to 1,000,000 each before decoding.
Self-tests mutate every instruction/literal word and exercise ELF headers,
section/symbol/relocation metadata, mapping states, identities, truncations and
parser limits. Accept a 12,000-section composite.

Authoritative validation requires manifest-verified private code.bin, private
target object agreement, exact ARM inventory rows, unique complete bodies and
current unmatched report entries. Compare every body byte, privately resolve the
two symbolic words and compare all 68 owned bytes. Reject aligned interior
pointers and unexpected ARM branch or PC-relative data references. Synthetic
fixtures do not establish authoritative correctness.

```sh
arm-none-eabi-as -o /tmp/arm-runtime-helpers-130.o src/main/arm_runtime_helpers_130.S
node scripts/validate-arm-runtime-helpers-130.mjs /tmp/arm-runtime-helpers-130.o
node scripts/validate-arm-runtime-helpers-130.mjs --self-test
node scripts/validate-arm-runtime-helpers-130.mjs --authoritative /tmp/arm-runtime-helpers-130.o /private/path/code.bin
git diff --check
```

Shared integration, progress and build files are outside this batch's ownership.
