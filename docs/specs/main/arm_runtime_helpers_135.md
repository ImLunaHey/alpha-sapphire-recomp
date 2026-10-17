# ARM runtime/helper batch 135 specification

One unique report-unmatched ARM function in the assigned entry window
`[0x00550000, 0x00560000)`. The neutral inventory, private AS_EUR_REV2 target
object and manifest-verified `code.bin` establish its 88-byte boundary and
instruction schedule. No ROM, extracted bytes, target instruction encodings,
private literal values, pointed-to assets, or proprietary implementation source
belong to this lane.

## Ownership and behavior

| Function | Body | Adjacent | Next global | Next offset |
| --- | ---: | ---: | --- | ---: |
| `func_005543FC` | 88 | 0 | `func_00554454` | 88 |

The function recursively disposes a non-null linked subtree. A null node returns
immediately. Otherwise it preserves `r4` through `r8` and the link register,
retains the context in `r6`, and iterates from the supplied node in `r4`.

For each node it recursively processes the child at offset 12, copies the
context word at offset 4 into the current node at offset 12, remembers the
current node, advances through the link at offset 8, obtains the payload at
node offset 24, and calls the shared payload-release entry. It then passes the
node subobject at offset 16 to the shared storage-destruction entry. The exact
compiler-emitted no-operation between argument setup and that call is retained.
Finally it writes the remembered node to context offset 4 and repeats while the
saved link is non-null.

## Exact schedule and transfers

| Offset | Instruction |
| ---: | --- |
| 0 | `cmp r1, #0` |
| 4 | `bxeq lr` |
| 8 | `push {r4, r5, r6, r7, r8, lr}` |
| 12 | `mov r6, r0` |
| 16 | `mov r4, r1` |
| 20 | `mov r0, r6` |
| 24 | `ldr r1, [r4, #12]` |
| 28 | `bl func_005543FC` |
| 32 | `ldr r1, [r6, #4]` |
| 36 | `mov r5, r4` |
| 40 | `add r7, r4, #16` |
| 44 | `ldr r4, [r4, #8]` |
| 48 | `str r1, [r5, #12]` |
| 52 | `ldr r0, [r7, #8]` |
| 56 | `bl func_00160F9C` |
| 60 | `mov r0, r7` |
| 64 | `nop` |
| 68 | `bl func_001862FC` |
| 72 | `cmp r4, #0` |
| 76 | `str r5, [r6, #4]` |
| 80 | `bne` to offset 20 |
| 84 | `pop {r4, r5, r6, r7, r8, pc}` |

Offsets 28, 56, and 68 carry zero-addend `R_ARM_CALL` relocations against
`func_005543FC`, `func_00160F9C`, and `func_001862FC`, respectively. The first
identity is the owned recursive entry; the other two are existing ARM entries.
There is one local conditional branch, eight memory operations, and two return
paths. The function owns no post-body data.

## Validation contract

Require ELF32 little-endian EM_ARM ET_REL, EABI5 flags exactly `0x05000000`,
ARMv6K/Thumb-1/VFPv2 attributes, one aligned executable PROGBITS section, the
exact 88-byte body, canonical function/section/ARM mapping symbols, and exactly
three REL call records with the declared slots, identities, types, and zero
addends. Reject RELA, DYNSYM, malformed metadata, extra globals or executable
payload, wrong ownership, truncation, and all bounded-input violations; permit
unrelated empty executable sections. Pin raw and normalized configuration,
source, and specification hashes independently.

Authoritative mode requires manifest-pinned private `code.bin`, the current
neutral inventory and report, and the private generated target object. It
checks the exact boundary and next global, byte-exact resolved calls, uniqueness
of the complete body, the assigned entry range, and absence of undeclared
branches or PC-relative references into the owned interior. Every invocation
also scans recursive source definitions and all configuration intervals for
overlap. Hostile self-tests mutate every instruction word and all relocation,
symbol, section, header, mapping and bounds classes, and accept a valid
12,000-section composite.

```sh
arm-none-eabi-as -o /tmp/arm-runtime-helpers-135.o src/main/arm_runtime_helpers_135.S
node scripts/validate-arm-runtime-helpers-135.mjs /tmp/arm-runtime-helpers-135.o
node scripts/validate-arm-runtime-helpers-135.mjs --self-test
node scripts/validate-arm-runtime-helpers-135.mjs --authoritative /tmp/arm-runtime-helpers-135.o /private/path/code.bin
git diff --check
```
