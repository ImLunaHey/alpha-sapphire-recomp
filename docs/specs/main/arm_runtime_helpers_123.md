# ARM runtime/helper batch 123

## Scope, provenance, and boundary

Target: AS_EUR_REV2. Analysis date: 2026-10-17. Evidence: ignored authoritative
ELF target and objdiff report, public symbol inventory, and recursive ownership
audit. GNU Arm binutils 2.44 supplied the analysis and independent assembler.
Private evidence is used only for analysis and authoritative comparison; no
ROM, extracted asset, SDK material, or target binary is included.

This batch supplies independently written assembly from the interface facts
below. Analysis and implementation were performed by the same agent; under
`docs/CLEAN_ROOM.md` this is clean-room-ready reverse engineering, not a
strict two-party clean-room contribution. No leaked source was consulted.

Own exactly these complete ARM functions in the requested half-open entry
range [0x001C0000, 0x00200000):

| Function | Body bytes | Adjacent bytes | Next global |
| --- | ---: | ---: | --- |
| `func_001CF630` | 24 | 0 | `func_001CF648` |
| `func_001CF648` | 12 | 0 | `func_001CF654` |

Total: two functions, 36 body bytes, zero adjacent bytes, nine ARM instructions,
four word loads, one local conditional branch, two indirect tail transfers,
one return, zero calls, zero PC-relative data accesses, and zero relocations.
Both entries are unmatched in the authoritative report. No current config or
source owns either interval. Each body is unique among target function bodies.
No aliases, secondary entries, or external symbolic identities are introduced.

## Behavioral specification

`func_001CF630` compares r0 against zero, updating condition flags. If zero,
branch to its return at offset 20. Otherwise load r2 from the word at r1 + 4,
then load r2 from the word at r2 + 20, and transfer control through r2 without
linking. The null case returns through lr. The local branch occupies offset 4;
the loads occupy offsets 8 and 12; the indirect tail occupies offset 16.
The null case must perform neither load.

`func_001CF648` loads ip (r12) from the word at r2 + 4, then loads ip from the
word at ip + 12, and transfers control through ip without linking. These
operations occupy offsets 0, 4, and 8. Preserve r0, r1, r2, lr, sp, and flags.

All instructions are four-byte ARM instructions. Preserve the specified
registers, widths, load ordering, branch condition, and tail-call semantics.
Neither helper changes the stack or lr. Do not infer the meaning of the table
slots or replace indirect transfers with direct calls.

## Object contract and validation

Emit ELF32 little-endian ARM ET_REL, EABI5 flags 0x05000000, ARMv6K with
Thumb-1 and VFPv2 attributes. Each function has an aligned-four executable
PROGBITS section named `.text.<function>`, exactly its body size. Each owned
section contains one canonical local section symbol, one local `$a` mapping
symbol at zero, and one default-visible global STT_FUNC at zero with exact size.
The only globals are the two owners. No adjacent data, other owned symbols,
foreign executable payload, dynamic symbols, or relocation sections are allowed.

The lane validator pins source, config, and specification; checks complete ELF
structure and exact instruction bytes; audits recursive source definitions and
config intervals; verifies ARM inventory boundaries and unmatched report entries;
and compares assembled bodies byte for byte with the authoritative target.
Authoritative evidence is mandatory for normal validation. Self-tests use only
synthetic ELF fixtures and do not claim authoritative validation.

Bound input to 64 MiB, aggregate executable bytes to 16 MiB, sections to 16,384,
aggregate SYMTAB/DYNSYM entries to 1,000,000, and relocations to 1,000,000.
Accept a valid synthetic composite with 12,000 unrelated empty executable
sections. Reject every single-bit body mutation, malformed symbols/sections,
wrong ARM attributes/flags, relocation sections, and hostile parser inputs.

Run standalone checks without editing shared build wiring:

```sh
arm-none-eabi-as -o /tmp/arm-runtime-helpers-123.o src/main/arm_runtime_helpers_123.S
node scripts/validate-arm-runtime-helpers-123.mjs --self-test
node scripts/validate-arm-runtime-helpers-123.mjs /tmp/arm-runtime-helpers-123.o
```

Normal validation defaults to the ignored AS_EUR_REV2 target and report; override
with `--reference <target-object>` and `--report <objdiff-report>` if necessary.
