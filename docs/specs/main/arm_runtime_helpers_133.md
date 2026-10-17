# ARM runtime/helper batch 133 specification

Four unique, currently report-unmatched ARM functions with entries in [0x00500000, 0x00540000). The authoritative inventory has exactly 239 ARM functions in this range. Exclude every existing source and configuration owner, including runtime113/114. Private AS_EUR_REV2 target evidence and manifest-verified code.bin establish the instruction schedules, complete bodies, boundaries and literal identities. No ROM, extracted code, literal values or pointed-to assets belong to this lane.

Own exactly 448 body bytes (112 ARM instructions), 16 adjacent bytes, four zero-addend R_ARM_ABS32 relocations and four symbolic identities. There are 66 memory operations, four local conditional branches and seven register returns. There are no external calls, tails or indirect transfers.

## Boundaries

| Function | Body bytes | Adjacent bytes | Owned bytes | Next global | Next offset |
| --- | ---: | ---: | ---: | --- | ---: |
| func_0052BB30 | 100 | 4 | 104 | func_0052BBC8 | 152 |
| func_0053F5E0 | 116 | 4 | 120 | func_0053F688 | 168 |
| func_0053F688 | 116 | 4 | 120 | func_0053F700 | 120 |
| func_0053F7A8 | 116 | 4 | 120 | func_0053FAA4 | 764 |

Only the directly referenced contiguous literal slot belongs to each function. Gaps before the next global remain unowned. ARM PC-relative loads use instruction address plus eight. Each complete body occurs exactly once in the authoritative inventory.

## Behavior and instruction schedules

### func_0052BB30

Initialize a record from the object reached through argument 1 at offset 20. Install the existing opaque record descriptor at destination offset 4; clear offsets 8 and 12, then set byte 9 to 2. Load the source at offset 8 with writeback, store it at destination offset 0, and atomically increment its word at offset 4 using LDREX/STREX until success. Copy seven single-precision register words from the source block following that pointer to destination offset 8. Preserve r4 and the exact memory order; there is no added barrier.

| Offset | Instruction |
| ---: | --- |
| 0 | `push {r4}` |
| 4 | `ldr r1, [r1, #20]` |
| 8 | `mov r3, #0` |
| 12 | `ldr ip, [r1]` |
| 16 | `ldr r1, literal(+100, runtime_record_descriptor_107_c)` |
| 20 | `str r1, [r0, #4]` |
| 24 | `str r3, [r0, #8]` |
| 28 | `mov r1, #2` |
| 32 | `str r3, [r0, #12]` |
| 36 | `strb r1, [r0, #9]` |
| 40 | `ldr r3, [ip, #8]!` |
| 44 | `mov r1, #1` |
| 48 | `add r2, r3, #4` |
| 52 | `str r3, [r0]` |
| 56 | `ldrex r3, [r2]` |
| 60 | `add r3, r3, r1` |
| 64 | `strex r4, r3, [r2]` |
| 68 | `cmp r4, #0` |
| 72 | `bne .L133_func_0052BB30_56` |
| 76 | `add ip, ip, #8` |
| 80 | `add r0, r0, #8` |
| 84 | `vldmia ip, {s0-s6}` |
| 88 | `vstmia r0, {s0-s6}` |
| 92 | `pop {r4}` |
| 96 | `bx lr` |
### func_0053F5E0

Install the opaque descriptor at object offset 0. Starting at the head at offset 4, stop at the sentinel at offset 12. For each node, read its forward/backward links at offsets 20/24, conditionally repair neighboring links, clear the removed node links, update the object's head and tail when they equal the removed node, decrement the count at offset 16, and advance along the saved forward link. The empty path returns before saving r4/r5. Preserve all predicates and register effects.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r1, literal(+116, runtime_literal_133_1)` |
| 4 | `str r1, [r0]` |
| 8 | `ldr r1, [r0, #4]` |
| 12 | `ldr ip, [r0, #12]` |
| 16 | `cmp r1, ip` |
| 20 | `bxeq lr` |
| 24 | `push {r4, r5}` |
| 28 | `mov r4, #0` |
| 32 | `ldrd r2, [r1, #20]` |
| 36 | `cmp r3, #0` |
| 40 | `strne r2, [r3, #20]` |
| 44 | `cmp r2, #0` |
| 48 | `str r4, [r1, #24]` |
| 52 | `strne r3, [r2, #24]` |
| 56 | `str r4, [r1, #20]` |
| 60 | `ldr r5, [r0, #4]` |
| 64 | `cmp r5, r1` |
| 68 | `streq r2, [r0, #4]` |
| 72 | `ldr r5, [r0, #8]` |
| 76 | `cmp r5, r1` |
| 80 | `streq r3, [r0, #8]` |
| 84 | `ldr r1, [r0, #16]` |
| 88 | `cmp r2, ip` |
| 92 | `sub r1, r1, #1` |
| 96 | `str r1, [r0, #16]` |
| 100 | `mov r1, r2` |
| 104 | `bne .L133_func_0053F5E0_32` |
| 108 | `pop {r4, r5}` |
| 112 | `bx lr` |
### func_0053F688

Install the opaque descriptor at object offset 0. Starting at the head at offset 4, stop at the sentinel at offset 12. For each node, read its forward/backward links at offsets 12/16, conditionally repair neighboring links, clear the removed node links, update the object's head and tail when they equal the removed node, decrement the count at offset 16, and advance along the saved forward link. The empty path returns before saving r4/r5. Preserve all predicates and register effects.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r1, literal(+116, runtime_literal_133_2)` |
| 4 | `str r1, [r0]` |
| 8 | `ldr r1, [r0, #4]` |
| 12 | `ldr ip, [r0, #12]` |
| 16 | `cmp r1, ip` |
| 20 | `bxeq lr` |
| 24 | `push {r4, r5}` |
| 28 | `mov r4, #0` |
| 32 | `ldrd r2, [r1, #12]` |
| 36 | `cmp r3, #0` |
| 40 | `strne r2, [r3, #12]` |
| 44 | `cmp r2, #0` |
| 48 | `str r4, [r1, #16]` |
| 52 | `strne r3, [r2, #16]` |
| 56 | `str r4, [r1, #12]` |
| 60 | `ldr r5, [r0, #4]` |
| 64 | `cmp r5, r1` |
| 68 | `streq r2, [r0, #4]` |
| 72 | `ldr r5, [r0, #8]` |
| 76 | `cmp r5, r1` |
| 80 | `streq r3, [r0, #8]` |
| 84 | `ldr r1, [r0, #16]` |
| 88 | `cmp r2, ip` |
| 92 | `sub r1, r1, #1` |
| 96 | `str r1, [r0, #16]` |
| 100 | `mov r1, r2` |
| 104 | `bne .L133_func_0053F688_32` |
| 108 | `pop {r4, r5}` |
| 112 | `bx lr` |
### func_0053F7A8

Install the opaque descriptor at object offset 0. Starting at the head at offset 4, stop at the sentinel at offset 12. For each node, read its forward/backward links at offsets 28/32, conditionally repair neighboring links, clear the removed node links, update the object's head and tail when they equal the removed node, decrement the count at offset 16, and advance along the saved forward link. The empty path returns before saving r4/r5. Preserve all predicates and register effects.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r1, literal(+116, runtime_literal_133_3)` |
| 4 | `str r1, [r0]` |
| 8 | `ldr r1, [r0, #4]` |
| 12 | `ldr ip, [r0, #12]` |
| 16 | `cmp r1, ip` |
| 20 | `bxeq lr` |
| 24 | `push {r4, r5}` |
| 28 | `mov r4, #0` |
| 32 | `ldrd r2, [r1, #28]` |
| 36 | `cmp r3, #0` |
| 40 | `strne r2, [r3, #28]` |
| 44 | `cmp r2, #0` |
| 48 | `str r4, [r1, #32]` |
| 52 | `strne r3, [r2, #32]` |
| 56 | `str r4, [r1, #28]` |
| 60 | `ldr r5, [r0, #4]` |
| 64 | `cmp r5, r1` |
| 68 | `streq r2, [r0, #4]` |
| 72 | `ldr r5, [r0, #8]` |
| 76 | `cmp r5, r1` |
| 80 | `streq r3, [r0, #8]` |
| 84 | `ldr r1, [r0, #16]` |
| 88 | `cmp r2, ip` |
| 92 | `sub r1, r1, #1` |
| 96 | `str r1, [r0, #16]` |
| 100 | `mov r1, r2` |
| 104 | `bne .L133_func_0053F7A8_32` |
| 108 | `pop {r4, r5}` |
| 112 | `bx lr` |

## Relocations and identity

- func_0052BB30+100: R_ARM_ABS32 against runtime_record_descriptor_107_c, zero addend.
- func_0053F5E0+116: R_ARM_ABS32 against runtime_literal_133_1, zero addend.
- func_0053F688+116: R_ARM_ABS32 against runtime_literal_133_2, zero addend.
- func_0053F7A8+116: R_ARM_ABS32 against runtime_literal_133_3, zero addend.

Reuse runtime_record_descriptor_107_c, whose private value already has a source identity. The three new descriptor identities are distinct from one another and existing literal identities. Values remain private.

## Validation contract

Require ELF32 little-endian EM_ARM ET_REL, EABI5 flags exactly 0x05000000, ARMv6K/Thumb-1/VFPv2 attributes, one aligned executable PROGBITS section per function, exact bodies and owned sizes, exact function/undefined symbol sets, canonical section symbols, ARM mapping at zero and data mapping at body end. Require exactly one REL section per function and exact ABS32 slots, identities and zero addends. Reject RELA, DYNSYM, extra owned symbols, foreign executable payload and malformed metadata; allow unrelated empty executable sections. Independently pin source, raw config, normalized config and specification hashes.

Bound input to 64 MiB before reading, executable bytes to 16 MiB, sections to 16,384, aggregate symbols and relocations to 1,000,000 each before decoding. Hostile self-tests mutate every instruction and literal word, owned metadata, relocations, identities, symbols, mapping states, headers, bounds and truncations; accept a 12,000-section composite. Every invocation scans recursive source definitions, assembly aliases and all configuration intervals for ownership overlap.

Authoritative mode requires manifest-pinned private code.bin, exact current inventory and unmatched-report rows, complete private target object bodies, unique full bodies and next-global boundaries. Compare every assembled body byte; resolve literal slots only from private evidence and compare every owned byte. Enforce equal values sharing identities, including reuse of existing configuration identities. Reject aligned pointers and undeclared branches or literal accesses into owned interiors. Synthetic fixtures alone never establish authoritative correctness.

```sh
arm-none-eabi-as -o /tmp/arm-runtime-helpers-133.o src/main/arm_runtime_helpers_133.S
node scripts/validate-arm-runtime-helpers-133.mjs /tmp/arm-runtime-helpers-133.o
node scripts/validate-arm-runtime-helpers-133.mjs --self-test
node scripts/validate-arm-runtime-helpers-133.mjs --authoritative /tmp/arm-runtime-helpers-133.o /private/path/code.bin
git diff --check
```

Shared integration, progress, build and generator files are outside this lane.
