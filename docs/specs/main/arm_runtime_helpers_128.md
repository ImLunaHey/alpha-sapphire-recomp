# ARM runtime/helper batch 128 specification

This clean-room batch owns one byte-unique, currently unmatched ARM function in
the requested entry interval `[0x00300000, 0x00340000)`. Selection used the
neutral 10,440-function inventory, the ignored current objdiff report, recursive
source/config ownership checks, and bounded private executable inspection. No
ROM, extracted data, private literal value, or pointed-to asset is included.

| Function | Body bytes | Adjacent bytes | Owned bytes | Next global | Next offset |
| --- | ---: | ---: | ---: | --- | ---: |
| `func_0030F0A8` | 620 | 4 | 624 | `func_0030F318` | 624 |

The function evaluates several nested relative-pointer records, conditionally
clears status bits, and reports whether the tested structure remains valid. Its
exact schedule contains 155 ARM instructions, 27 memory operations, 20 local
conditional branches, and one register return. It has no call, external tail,
or indirect transfer. Conditional instructions and flag-setting `bics`
operations are part of the required schedule.

The PC-relative load at body offset 328 selects the immediately adjacent word at
offset 620. That word is represented by the new opaque identity
`runtime_literal_128_1`, with a zero addend and one `R_ARM_ABS32` relocation.
The private value and the object it denotes remain outside the repository.
Function symbol size excludes this word; executable section size includes it.

The neutral inventory's next global begins exactly after the owned word. A
whole-program direct-control-flow, PC-relative-data and aligned possible-pointer
scan found no interior or adjacent external target. One branch from
`func_0030F318` targets the selected primary entry. The complete 620-byte body
occurs once in the target function inventory.

## Validation contract

Require ELF32 little-endian EM_ARM ET_REL, EABI5 flags exactly `0x05000000`,
ARMv6K/Thumb-1/VFPv2 attributes, and exactly one nonempty executable owned
section. Require exact 620 body bytes, a zero relocation addend at 620, one ARM
mapping at zero, one data mapping at 620, one exact global function symbol, one
canonical section symbol, one undefined opaque identity, and one correctly
linked `R_ARM_ABS32` REL record. Reject foreign executable payload, extra global
or named-local symbols, RELA/DYNSYM, malformed bounds and duplicate ownership.
Empty unrelated executable sections are accepted.

Pin source, raw configuration, normalized contract, and this specification
independently. Bound complete inputs to 64 MiB, executable data to 16 MiB,
sections to 16,384, and aggregate symbols and relocations to 1,000,000 before
decoding. Self-tests mutate every body word and the adjacent addend; exercise
header, section, symbol, relocation, mapping and truncation failures; reject
resource-limit and foreign-payload fixtures; and accept a 12,000-section
composite.

Authoritative mode additionally requires the manifest-verified private
`code.bin`, target object, current report, and neutral inventory. It rechecks
exact inventory boundaries/mode, report-unmatched state, whole-body and owned
byte equality, uniqueness, literal identity resolution, recursive ownership,
and the whole-program inbound-reference audit. Synthetic fixtures never
establish authoritative correctness.

```sh
arm-none-eabi-as -o /tmp/arm-runtime-helpers-128.o src/main/arm_runtime_helpers_128.S
node scripts/validate-arm-runtime-helpers-128.mjs /tmp/arm-runtime-helpers-128.o
node scripts/validate-arm-runtime-helpers-128.mjs --self-test
node scripts/validate-arm-runtime-helpers-128.mjs --authoritative /tmp/arm-runtime-helpers-128.o /private/path/code.bin
git diff --check
```

Shared integration, build, progress and report files are outside this lane.
