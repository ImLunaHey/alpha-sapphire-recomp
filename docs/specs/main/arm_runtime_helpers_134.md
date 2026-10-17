# ARM runtime/helper batch 134 specification

## Scope and evidence

This lane reconstructs four currently unmatched ARM functions whose entries lie
in `[0x00540000, 0x00550000)`. Evidence is limited to the public symbol
inventory and unmatched report plus bounded inspection of the ignored,
manifest-pinned AS_EUR_REV2 executable and generated target object. No ROM,
container, resource, string, asset, or opaque target value belongs to the lane.

The lane owns 420 executable body bytes (105 ARM instructions) and eight
adjacent scalar bytes. It has 33 memory operations, ten local conditional
branches, one recursive direct call, four register-indirect calls, and five
returns. The recursive call creates the only relocation: one `R_ARM_CALL`
against its own public function identity. There are no direct or indirect tails
and no symbolic data identities.

## Boundaries

| Function | Body | Adjacent | Owned | Next global | Offset |
| --- | ---: | ---: | ---: | --- | ---: |
| `func_005409C0` | 116 | 4 | 120 | `func_00540A38` | 120 |
| `func_00540A38` | 116 | 4 | 120 | `func_00540AB0` | 120 |
| `func_00540AB0` | 112 | 0 | 112 | `func_00540B20` | 112 |
| `func_0054F918` | 76 | 0 | 76 | `func_0054F964` | 76 |

The first two functions each own their directly loaded trailing scalar
`0x2aaaaaab`, the standard signed divide-by-six multiplier. Their function
symbols stop before this word and their sections switch from `$a` to `$d` at
offset 116. No gap or later material is owned. The other functions own only
their complete bodies.

## Behavioral schedules

`func_005409C0` and `func_00540A38` read a begin/end pair at object offsets
four and eight, derive a signed element count using the common multiplier, and
choose the next odd growth count. The former uses an arithmetic shift of one
after the high multiply while the latter uses three. Each stores the begin
pointer at object offset eight, then invokes virtual slot 12 when both the owner
and begin pointer are non-null. Both return the original object. Preserve the
exact predicates, register allocation, loop, literal placement, and stack shape.

`func_00540AB0` performs the corresponding power-of-two element-count path. It
derives the count with shifts rather than a literal, advances to the next odd
growth value, stores the begin pointer, conditionally invokes virtual slot 12,
and returns the object. Preserve the conditional shifts and the three local
branches exactly.

`func_0054F918` recursively walks the child at node offset 12, then repeatedly
processes siblings from offset eight. For each node it installs the current
owner link, invokes the callback reached through the word at node offset 16,
and stores the node as the owner's current value at offset four. The null input
returns before saving registers. Its call at offset 28 is an ARM-state recursive
`R_ARM_CALL`; the loop back-edge remains local.

## ELF and validation contract

Require ELF32 little-endian ARM `ET_REL`, EABI5 flags `0x05000000`, and exact
ARMv6K/Thumb-1/VFPv2 attributes. Each function has one aligned
`ALLOC|EXECINSTR` PROGBITS section, one canonical section symbol, one `$a`
mapping at zero, and one global default-visible `STT_FUNC` with the exact body
size. The two scalar owners additionally have one `$d` mapping at body end.
The global set is exactly the four functions. Require exactly one REL section,
for `func_0054F918`, containing the offset-28 `R_ARM_CALL` self-reference and
canonical `-8` branch addend. Reject RELA, extra relocations, aliases, foreign
nonempty executable payload, malformed metadata, or altered bytes; unrelated
empty executable sections are allowed.

Bound complete input to 64 MiB, aggregate executable bytes to 16 MiB, sections
to 16,384, and aggregate symbols and relocations to 1,000,000 each before
decoding. The hostile self-test mutates every owned word, section/symbol/mapping
metadata, the call relocation, headers and truncations, and accepts a
12,000-section composite.

Authoritative validation requires the manifest-pinned private `code.bin`, the
current 10,440-function report and neutral inventory, and the generated target
object. It resolves the self-call relocation before comparing every owned byte,
checks exact inventory and next-global boundaries, requires unique complete
bodies, verifies that all four report rows remain unmatched, audits recursive
source/config ownership, and rejects foreign static branches into owned
interiors. Private inputs remain ignored and no target-derived artifact is
written into the repository.

```sh
arm-none-eabi-as -march=armv6k -mfpu=vfpv2 -o /tmp/arm-runtime-helpers-134.o src/main/arm_runtime_helpers_134.S
node scripts/validate-arm-runtime-helpers-134.mjs /tmp/arm-runtime-helpers-134.o
node scripts/validate-arm-runtime-helpers-134.mjs --self-test
node scripts/validate-arm-runtime-helpers-134.mjs --authoritative /tmp/arm-runtime-helpers-134.o /private/path/code.bin
git diff --check
```

Shared manifests, generator integration, progress files, and report output are
outside this lane.
