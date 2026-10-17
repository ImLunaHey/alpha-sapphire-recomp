# ARM runtime/helper batch 118 specification

## Scope and evidence

This lane reconstructs five report-unmatched ARM functions whose entries lie in
`[0x00440000, 0x00480000)`. Analysis used only the ignored AS_EUR_REV2 target
object, the locally owned private `code.bin`, the neutral symbol inventory, and
the local objdiff report. No target container, resource, authored string, table,
or asset is part of the lane.

The lane owns 976 executable bytes (244 ARM instructions), no adjacent bytes,
and no relocations. It contains 104 memory operations, 32 local branches,
17 register-indirect calls, three register-indirect tails, and five returns.
There are no direct calls, direct tails, PC-relative data accesses, or symbolic
data identities.

## Boundaries

| Function | Body/owned | SHA-256 | Next global | Offset |
| --- | ---: | --- | --- | ---: |
| `func_00442608` | 92 | `f044725c398d305f2021571bff2f1fb7651d9ee9f3d0544c742e6c6518a0d584` | `func_00442864` | 604 |
| `func_0046FB00` | 244 | `628643d3564adbd20385daaa2454c5c84ce89cf135730d80b3047193eee97ef5` | `func_0046FBF4` | 244 |
| `func_0047CB2C` | 136 | `ee997ed7be2b3939fd84c30079bb3303cd2087c9f5720387f5c39d2482b1cca2` | `func_0047CBB4` | 136 |
| `func_0047D6A4` | 404 | `6a5a9eb6e325850e277c58f4bead8ee8b6a56e13e15eda18ee42ddeb08a76506` | `func_0047D8F4` | 592 |
| `func_0047E0D8` | 100 | `bd258c9af64de4a316238ae6c48323e603172349b281d1b70faa11139a16bf72` | `func_0047E1C4` | 236 |

Own exactly each complete function body and nothing in the gaps before later
globals. Recursive source-definition checks and every existing config ownership
interval must remain disjoint from these five ranges. Each complete body must
occur exactly once among the authoritative target functions.

## Behavioral schedule

- `func_00442608` conditionally releases two interface-owned fields, clears the
  corresponding words, and clears two state bytes. Preserve both null checks,
  virtual slot four dispatches, and the shared epilogue.
- `func_0046FB00` updates a byte state, conditionally invokes interface slots,
  walks two indexed entries, combines two signed byte flags, and performs two
  register-indirect tail transfers. Preserve all offsets and loop conditions.
- `func_0047CB2C` resolves one indexed interface entry, queries it, conditionally
  releases it, clears the owner slot, and preserves the padded fallback path.
- `func_0047D6A4` walks the signed-halfword-sized outer collection and its signed
  byte-sized inner collections. Preserve all virtual dispatch slots, both padded
  fallback paths, the exact nested-loop structure, and the six-register return.
- `func_0047E0D8` forwards stacked arguments through virtual slot 56 and, on a
  nonzero result, tail-transfers through virtual slot 48 with the saved argument.

Instruction order, register allocation, conditions, addressing modes, padding
instructions, stack shape, and indirect transfer forms are byte-exact. Local
labels are implementation names only; no semantic names or proprietary symbols
are inferred.

## ELF and validator contract

Require ELF32 little-endian ARM ET_REL with EABI5 flags `0x05000000` and pinned
ARMv6K/ARM/Thumb-1/VFPv2 attributes. Each owned function has one unique
ALLOC|EXECINSTR PROGBITS section aligned to four, one canonical section symbol,
one `$a` mapping symbol at zero, and one global default-visible STT_FUNC at zero
whose size equals the full body. The global set is exactly the five functions.

Reject any REL or RELA section, extra named/unnamed owned symbol, duplicate owned
section, Thumb mapping, altered instruction, malformed header/table metadata,
or foreign nonempty executable payload. Unrelated empty executable sections are
accepted. Cap the complete file at 64 MiB, executable bytes at 16 MiB, sections
at 16,384, aggregate symbol entries at 1,000,000, and aggregate relocation
records at 1,000,000 before expensive decoding.

The self-test accepts a 12,000-section composite and rejects byte mutations in
every owned body, hostile ELF/symbol/section/relocation metadata, truncations,
foreign payload, and all parser caps. The private audit compares every body with
`code.bin`, confirms the neutral inventory boundaries, requires each full body
to be unique across all 10,440 target functions, and repeats overlap checks.

## Standalone validation

```sh
node scripts/validate-arm-runtime-helpers-118.mjs --self-test
node scripts/validate-arm-runtime-helpers-118.mjs <lane-object>
node scripts/validate-arm-runtime-helpers-118.mjs --audit-private /path/to/code.bin
git diff --check
```

Shared build, source integration, progress, generated target, and objdiff files
are intentionally outside this lane's ownership.
