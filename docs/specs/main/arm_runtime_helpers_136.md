# ARM runtime/helper batch 136 specification

Two unique, report-unmatched ARM functions with entries in `[0x00560000, 0x00578800)`. The neutral inventory and manifest-pinned private `AS_EUR_REV2` evidence establish their complete boundaries and instruction schedules. This lane owns only reconstructed assembly and metadata; no ROM bytes, literal values, or game assets are retained.

The batch owns exactly 216 body bytes (54 ARM instructions), no adjacent data, and no relocations or symbolic identities. It contains 28 memory operations, six local conditional branches, two indirect calls, and two stack returns.

## Boundaries

| Function | Body bytes | Adjacent bytes | Next global | Next offset |
| --- | ---: | ---: | --- | ---: |
| `func_0056DB94` | 56 | 0 | `func_0056DBCC` | 56 |
| `func_0056E450` | 160 | 0 | `func_0056E4F0` | 160 |

Both next globals begin immediately after the selected bodies. Each complete body occurs exactly once among authoritative function boundaries.

## Behavior and schedules

### `func_0056DB94`

Read the optional object at offset 60 and invoke virtual slot 36 when present. Convert its integer result to single precision, multiply it by the float at offset 40, accumulate into the float at offset 84, and return the result in `s0`. The null path converts the incoming zero in `r0`.

| Offset | Instruction |
| ---: | --- |
| 0 | `push {r4, lr}` |
| 4 | `mov r4, r0` |
| 8 | `ldr r0, [r0, #60]` |
| 12 | `cmp r0, #0` |
| 16 | `beq +32` |
| 20 | `ldr r1, [r0]` |
| 24 | `ldr r1, [r1, #36]` |
| 28 | `blx r1` |
| 32 | `vmov s1, r0` |
| 36 | `vldr s0, [r4, #84]` |
| 40 | `vldr s2, [r4, #40]` |
| 44 | `vcvt.f32.s32 s1, s1` |
| 48 | `vmla.f32 s0, s1, s2` |
| 52 | `pop {r4, pc}` |

### `func_0056E450`

Walk the intrusive list whose sentinel is stored at object offset 16. Compare each node's key fields against the search record. When both fields match and the node is not the sentinel, unlink it, decrement the count at offset 20, invoke the node payload's virtual destructor through its first slot, then move the node onto the object's free list at offset 4. Preserve the saved next-node pointer so iteration remains valid after removal.

| Offset | Instruction |
| ---: | --- |
| 0 | `push {r4, r5, r6, r7, r8, lr}` |
| 4 | `mov r7, r0` |
| 8 | `ldr r6, [r0, #16]` |
| 12 | `ldr r4, [r6]` |
| 16 | `cmp r4, r6` |
| 20 | `addne r5, r1, #4` |
| 24 | `beq +156` |
| 28 | `add r0, r4, #8` |
| 32 | `add r0, r0, #4` |
| 36 | `ldr r2, [r5, #4]` |
| 40 | `ldr r1, [r0, #4]` |
| 44 | `mov r8, r4` |
| 48 | `ldr r4, [r4]` |
| 52 | `cmp r1, r2` |
| 56 | `bne +148` |
| 60 | `ldrh r0, [r0, #2]` |
| 64 | `ldrh r1, [r5, #2]` |
| 68 | `cmp r0, r1` |
| 72 | `bne +148` |
| 76 | `ldr r0, [r7, #16]` |
| 80 | `cmp r8, r0` |
| 84 | `beq +148` |
| 88 | `ldrd r2, [r8]` |
| 92 | `add r1, r8, #8` |
| 96 | `str r2, [r3]` |
| 100 | `ldm r8, {r0, r2}` |
| 104 | `str r2, [r0, #4]` |
| 108 | `ldr r0, [r7, #20]` |
| 112 | `sub r0, r0, #1` |
| 116 | `str r0, [r7, #20]` |
| 120 | `ldr r0, [r8, #8]` |
| 124 | `ldr r2, [r0]` |
| 128 | `mov r0, r1` |
| 132 | `blx r2` |
| 136 | `ldr r0, [r7, #4]` |
| 140 | `str r0, [r8]` |
| 144 | `str r8, [r7, #4]` |
| 148 | `cmp r4, r6` |
| 152 | `bne +28` |
| 156 | `pop {r4, r5, r6, r7, r8, pc}` |

## Validation contract

Require ELF32 little-endian EM_ARM ET_REL, EABI5 flags exactly `0x05000000`, ARMv6K/Thumb-1/VFPv2 attributes, one aligned executable PROGBITS section per function, exact bytes and sizes, exact global function and ARM mapping-symbol sets, and no REL, RELA, DYNSYM, adjacent ownership, or foreign executable payload. Bound input to 64 MiB, aggregate executable data to 16 MiB, sections to 16,384, and aggregate symbols and relocations to 1,000,000 each before decoding.

Hostile self-tests mutate every owned byte and critical ELF metadata, exercise truncation and aggregate limits, reject relocation sections, and accept a 12,000-section composite. Every invocation pins the raw configuration, normalized contract, source, and specification and scans recursive sources plus all configuration intervals for duplicate ownership.

Authoritative mode requires manifest-pinned private `code.bin`, the exact 10,440-row neutral inventory, current report-unmatched rows, private target-object agreement, unique complete bodies, and exact next-global boundaries. Private evidence is read only for validation and is never emitted.

```sh
arm-none-eabi-as -o /tmp/arm-runtime-helpers-136.o src/main/arm_runtime_helpers_136.S
node scripts/validate-arm-runtime-helpers-136.mjs /tmp/arm-runtime-helpers-136.o
node scripts/validate-arm-runtime-helpers-136.mjs --self-test
node scripts/validate-arm-runtime-helpers-136.mjs --authoritative /tmp/arm-runtime-helpers-136.o /private/path/code.bin
git diff --check
```

Shared manifests, package scripts, target normalization, progress data, and generated reports are outside this lane.
