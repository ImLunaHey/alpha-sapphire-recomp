# ARM runtime/helper batch 126 specification

Two unique, currently report-unmatched ARM functions with entries in
[0x00280000, 0x002C0000), selected from 529 ARM inventory entries. Private
AS_EUR_REV2 evidence establishes schedules, boundaries and opaque identities.
No ROM, extracted bytes, literal values or pointed-to assets belong to this batch.

Own 60 body bytes (15 instructions), eight adjacent literal bytes and two
zero-addend R_ARM_ABS32 relocations. There are seven memory operations, one local
conditional branch and two returns; no calls, external tails or indirect transfers.

| Function | Body bytes | Adjacent bytes | Owned bytes | Next global | Next offset |
| --- | ---: | ---: | ---: | --- | ---: |
| func_002A0924 | 28 | 4 | 32 | func_002A09B4 | 144 |
| func_002AF780 | 32 | 4 | 36 | func_002AF7B0 | 48 |

Only the contiguous directly loaded literal belongs to each function. Gaps before
next globals remain excluded. ARM literal loads use instruction address plus eight.

## func_002A0924

Write input truthiness to byte three and the input's low byte to byte ten of an
opaque global object. Conditional moves must preserve flags from the comparison.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r1, literal(+28, runtime_literal_126_1)` |
| 4 | `cmp r0, #0` |
| 8 | `moveq r2, #0` |
| 12 | `movne r2, #1` |
| 16 | `strb r2, [r1, #3]` |
| 20 | `strb r0, [r1, #10]` |
| 24 | `bx lr` |

## func_002AF780

Read the shared context root's word at offset 100. If nonzero, increment the
indexed word with 32-bit wraparound. A null table returns without accessing it.
Preserve the unscaled input index and the instruction order.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r1, literal(+32, runtime_shared_context_root_100)` |
| 4 | `ldr r1, [r1, #100]` |
| 8 | `cmp r1, #0` |
| 12 | `beq local(+28)` |
| 16 | `ldr r2, [r1, r0, lsl #2]` |
| 20 | `add r2, r2, #1` |
| 24 | `str r2, [r1, r0, lsl #2]` |
| 28 | `bx lr` |

## Identity and ownership

The first function's +28 slot references runtime_literal_126_1; the second's +32
slot reuses runtime_shared_context_root_100. Both are undefined symbolic words
with zero addends. Private equality establishes the reused identity; values stay
private. Function symbol sizes exclude literals; executable section sizes include
them. Recursive source definitions, assembly aliases and config intervals must
have no overlapping owner on every validator invocation.

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
arm-none-eabi-as -o /tmp/arm-runtime-helpers-126.o src/main/arm_runtime_helpers_126.S
node scripts/validate-arm-runtime-helpers-126.mjs /tmp/arm-runtime-helpers-126.o
node scripts/validate-arm-runtime-helpers-126.mjs --self-test
node scripts/validate-arm-runtime-helpers-126.mjs --authoritative /tmp/arm-runtime-helpers-126.o /private/path/code.bin
git diff --check
```

Shared integration, progress and build files are outside this batch's ownership.
