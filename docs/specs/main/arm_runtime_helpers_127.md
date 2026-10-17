# ARM runtime/helper batch 127 specification

Three unique, report-unmatched ARM functions with entries in
`[0x002C0000, 0x00300000)`. Private AS_EUR_REV2 evidence establishes their
boundaries, schedules, branch identities and current unmatched state. This
specification contains no ROM data, extracted bytes, literal values, proprietary
source or SDK material.

The batch owns 464 body bytes (116 instructions), no adjacent data, and three
`R_ARM_CALL` relocations. It has 57 memory-transfer instructions when stack and
multiple-register transfers are counted, three direct calls and three stack
returns. It has no local branches, direct tails, indirect transfers or
PC-relative data accesses.

| Function | Body bytes | Next global | Next offset | Direct call |
| --- | ---: | --- | ---: | --- |
| `func_002C0C68` | 108 | `func_002C0CD4` | 108 | `func_001950F8` at +28 |
| `func_002E0130` | 116 | `func_002E01B0` | 128 | `func_001744C4` at +12 |
| `func_002F30B0` | 240 | `func_002F31A0` | 240 | `func_00184020` at +72 |

The twelve-byte gap after `func_002E0130` is not referenced by this function and
is deliberately excluded from ownership.

## Behavioral schedules

### `func_002C0C68`

Preserve the input base and destination across a call that initializes the
destination prefix from a word reached through the input base. Then copy the two
bytes of a halfword from input offset `0x293e` to destination bytes six and
seven in little-endian order. Copy input byte `0x2a8d` to destination byte
eight, clear destination bytes nine through fifteen, and return through the
saved link register. The call target is the ARM entry `func_001950F8`.

The instruction sequence must retain the two staged constant additions used to
form each large input displacement, load the source halfword twice, and perform
the seven trailing clears as individual byte stores.

### `func_002E0130`

Preserve the input record and output pointer, then call the ARM entry
`func_001744C4` with the record. Load eight consecutive words from record
offsets 80 through 108. Reverse the byte order of every word independently and
store the results to output offsets zero through 28. Return through the saved
link register. Loads, reversals and stores remain interleaved in ascending
offset order.

### `func_002F30B0`

Preserve six registers. Read the two caller-stack arguments at entry offsets 24
and 28. Select an allocation multiplier of four only when the third register
argument equals `0x1406`, otherwise one. Round the allocator cursor upward to a
32-byte boundary, reserve `multiplier * fourth_argument` bytes, and call the ARM
entry `func_00184020` with the aligned allocation address.

Use the record index at owner offset 52 to address an 84-byte logical record
whose physical base is `owner + index * 28`. Store the second argument, third
argument, low byte of the fourth argument, a zero flag, aligned allocation
pointer, and three zero words at record offsets 56 through 80. Increment the
owner's record index and return `owner + new_index * 28 + 28`. Preserve the
observed repeated index loads and address calculations rather than folding them.

## Identity, relocation and ownership contract

The three call targets are distinct, 4-byte-aligned ARM inventory entries. Each
call site uses one `R_ARM_CALL` relocation with the canonical ARM branch addend.
There are no literal pools or data relocations. Function symbol sizes and owned
section sizes are identical.

Every batch entry must have exactly one complete `$a` inventory row and one
current report entry below 100 percent. Its complete resolved body must be
unique in the verified executable and agree independently with the generated
private target object. No other source definition or configuration interval may
overlap any owned byte.

## Validation contract

Require ELF32 little-endian `EM_ARM` `ET_REL`, exact EABI5 flags, ARMv6K with
Thumb-1 and VFPv2 attributes, aligned executable `PROGBITS` sections, exact
instruction addends, function and section symbols, `$a` mappings, undefined call
identities, and one exact `R_ARM_CALL` record per function. Reject aliases,
foreign executable payload, extra globals, `RELA`, `DYNSYM`, malformed bounds,
wrong mapping state, changed branch identity, and overlapping ownership.

Bound files to 64 MiB before reads, aggregate executable bytes to 16 MiB,
sections to 16,384, and aggregate symbols and relocations to 1,000,000 each
before decoding. Self-tests mutate every instruction word and exercise ELF
headers, sections, symbols, relocations, truncation, parser caps, ownership and a
12,000-section composite. Synthetic fixtures do not establish authoritative
correctness.

Authoritative validation requires the manifest-verified private `code.bin`, the
private target object, exact inventory rows, current unmatched report entries,
unique complete bodies and byte-exact resolution of every call. It also scans
all ARM inventory bodies to reject unexpected branches or PC-relative references
into an owned interior.

```sh
arm-none-eabi-as -march=armv6k -mfpu=vfpv2 -o /tmp/arm-runtime-helpers-127.o src/main/arm_runtime_helpers_127.S
node scripts/validate-arm-runtime-helpers-127.mjs /tmp/arm-runtime-helpers-127.o
node scripts/validate-arm-runtime-helpers-127.mjs --self-test
node scripts/validate-arm-runtime-helpers-127.mjs --authoritative /tmp/arm-runtime-helpers-127.o /private/path/code.bin
git diff --check
```

Shared integration, build and progress files are outside this batch's ownership.
