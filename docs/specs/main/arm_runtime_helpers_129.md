# ARM runtime/helper batch 129 specification

Two unique, complete, currently report-unmatched ARM functions with entries in
[0x00340000, 0x00380000). Private AS_EUR_REV2 evidence establishes instruction
schedules, boundaries and opaque identities. Private evidence is used only for
analysis and authoritative validation. No ROM, code.bin, extracted literal values
or pointed-to assets belong to this batch.

Own 60 body bytes (15 ARM instructions), 12 adjacent literal bytes and three
zero-addend R_ARM_ABS32 relocations. There are 11 memory instructions and two
register returns. There are zero local branches, calls, direct tails or indirect
transfers. The STM counts as one memory instruction and writes two words.

| Function | Body bytes | Adjacent bytes | Owned bytes | Next global | Next offset |
| --- | ---: | ---: | ---: | --- | ---: |
| func_00361064 | 36 | 4 | 40 | func_003610B0 | 76 |
| func_0036F240 | 24 | 8 | 32 | func_0036F260 | 32 |

Only directly referenced contiguous literal words are owned. The 36-byte gap
following the first owner's literal remains excluded. Function symbol sizes
exclude literals; section sizes include them. ARM literal loads use PC plus eight.

## func_00361064

Initialize an object through r0. Store an opaque identity at offset zero, clear
words at offsets 4, 8, 12 and 16, and clear the byte at offset 20. Preserve r0.
The order of stores is part of the contract.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r2, literal(+36, runtime_literal_129_1)` |
| 4 | `mov r1, #0` |
| 8 | `str r1, [r0, #4]` |
| 12 | `str r2, [r0]` |
| 16 | `str r1, [r0, #8]` |
| 20 | `str r1, [r0, #12]` |
| 24 | `str r1, [r0, #16]` |
| 28 | `strb r1, [r0, #20]` |
| 32 | `bx lr` |

## func_0036F240

Initialize three words through r0. Store an opaque identity and zero with a
non-writeback STMIA, then store a second opaque word at offset eight. Preserve r0.
The two adjacent identities and the first function's identity are distinct.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r1, literal(+24, runtime_literal_129_2)` |
| 4 | `mov r2, #0` |
| 8 | `stmia r0, {r1, r2}` |
| 12 | `ldr r2, literal(+28, runtime_literal_129_3)` |
| 16 | `str r2, [r0, #8]` |
| 20 | `bx lr` |

## Validation contract

Pin raw configuration, normalized configuration, source and specification
independently. On every invocation reject overlapping config intervals and
recursive source definitions, including assembly aliases. Require ELF32
little-endian EM_ARM ET_REL, exact EABI5 flags 0x05000000, ARMv6K/Thumb-1/VFPv2
attributes, aligned executable PROGBITS sections, exact instruction encodings,
function sizes, ARM/data mappings, section symbols, undefined identities and
ABS32 relocations. Reject foreign executable payload, extra symbols, RELA,
DYNSYM, malformed bounds and duplicate ownership. Empty unrelated executable
sections are accepted.

Bound files to 64 MiB before reading, executable bytes to 16 MiB, sections to
16,384, and aggregate symbols and relocations to 1,000,000 each before decoding.
Accept a composite containing 12,000 unrelated empty executable sections.
Self-tests mutate every instruction and literal word, ELF headers, section,
symbol and relocation metadata, mapping states, identities, truncations and
resource limits. Synthetic fixtures do not establish authoritative correctness.

Authoritative mode requires manifest-verified private code.bin, private target
object agreement, exact ARM inventory rows, unique complete bodies, next-global
boundaries and current unmatched report entries. Compare every body byte,
privately resolve three distinct symbolic words and compare all 72 owned bytes.
Reject aligned interior pointers and unexpected ARM branch or PC-relative data
references. Exactly three expected PC-relative literal loads are required.

```sh
arm-none-eabi-as -o /tmp/arm-runtime-helpers-129.o src/main/arm_runtime_helpers_129.S
node scripts/validate-arm-runtime-helpers-129.mjs /tmp/arm-runtime-helpers-129.o
node scripts/validate-arm-runtime-helpers-129.mjs --self-test
node scripts/validate-arm-runtime-helpers-129.mjs --authoritative /tmp/arm-runtime-helpers-129.o /private/path/code.bin
git diff --check
```

Shared integration, progress and build files are outside this batch's ownership.
