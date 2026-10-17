# ARM runtime/helper batch 122 specification

## Scope and provenance

Revision AS_EUR_REV2; observation date 2026-10-17. Selection uses the public
symbol inventory, recursive source and config ownership scan, ignored objdiff
report (10,440 functions), authoritative target ELF, and external private code
image. GNU Arm binutils 2.45.1.20251203 supplies
independent assembly. Private evidence is used only for analysis and validation;
no image, extracted asset, or SDK source is included.

This contribution records analysis and original implementation in one lane.
It is clean-room-ready reverse engineering, not a claim of strict two-party
clean-room separation under docs/CLEAN_ROOM.md. Implementation follows the
neutral operation schedules below; no proprietary source or headers are used.

## Ownership and boundaries

- func_0019B4A8: 44 body bytes, 11 ARM instructions; next global func_0019B4D8.
  The four bytes after the body are excluded.
- func_0019BDE0: 60 body bytes, 15 ARM instructions, 12 literal bytes;
  next global func_0019BE28 at owned offset 72.
- func_0019BE28: 60 body bytes, 15 ARM instructions, 12 literal bytes;
  next global func_0019BE80. The sixteen bytes after owned offset 72 are excluded.

Totals: three functions, 164 body bytes, 24 adjacent bytes, 188 owned bytes,
41 instructions, 14 memory operations (including stack operations and six
literal loads), one indirect linked interworking call, three returns, and zero
relocations. All entries are four-byte aligned ARM within [0x00180000,0x001C0000).
No alias, secondary entry, direct external transfer, or symbolic identity is owned.
The authoritative report lists all three as unmatched; no existing source or
config claims these entries or intersects their owned intervals.

## Neutral operation schedules

### func_0019B4A8

- Offset 0: Save lr on the stack (predecrement four bytes).
- Offset 4: Set r3 to r1 with bit zero cleared, updating NZCV as ARM BICS immediate.
- Offset 8: If nonzero, increment r1 by one without changing flags.
- Offset 12: Set r3 to r1 shifted left two bits.
- Offset 16: Subtract r3 from sp.
- Offset 20: Pass sp in r1.
- Offset 24: Save r3 on the stack (predecrement four bytes).
- Offset 28: Call the ARM/Thumb address in r2 with link.
- Offset 32: Restore r3 with postincrement four bytes.
- Offset 36: Add r3 to sp.
- Offset 40: Return by restoring pc with postincrement four bytes.

### func_0019BDE0

- Offset 0: Load the state word at r0 into r2.
- Offset 4: Load multiplier from the local literal at offset 60 into r3.
- Offset 8: Load increment from the local literal at offset 64 into r1.
- Offset 12: Set r1 to the low 32 bits of r2 times r3 plus r1.
- Offset 16: Load mask from the local literal at offset 68 into r3.
- Offset 20: Store the updated state r1 at r0.
- Offset 24: Set r2 to r3 AND (r1 logically shifted right sixteen bits).
- Offset 28: Set r0 to the leading-zero count of r2 (32 for zero).
- Offset 32: Set ip to r1 AND 0x80000000.
- Offset 36: Set r2 to r2 logically shifted left by the register shift in r0.
- Offset 40: Set r1 to 142 minus r0.
- Offset 44: Set r2 to ip plus (r2 logically shifted right eight bits).
- Offset 48: Add r1 shifted left twenty-three bits to r2.
- Offset 52: Copy r2 bits into single-precision VFP register s0.
- Offset 56: Return through lr.

### func_0019BE28

- Offset 0: Load the state word at r0 into r2.
- Offset 4: Load multiplier from the local literal at offset 60 into r3.
- Offset 8: Load increment from the local literal at offset 64 into r1.
- Offset 12: Set r1 to the low 32 bits of r2 times r3 plus r1.
- Offset 16: Load mask from the local literal at offset 68 into r3.
- Offset 20: Store the updated state r1 at r0.
- Offset 24: Set r2 to r3 AND (r1 logically shifted right sixteen bits).
- Offset 28: Set r0 to the leading-zero count of r2 (32 for zero).
- Offset 32: Set ip to r1 AND 0x80000000.
- Offset 36: Set r2 to r2 logically shifted left by the register shift in r0.
- Offset 40: Set r1 to 141 minus r0.
- Offset 44: Set r2 to ip plus (r2 logically shifted right eight bits).
- Offset 48: Add r1 shifted left twenty-three bits to r2.
- Offset 52: Copy r2 bits into single-precision VFP register s0.
- Offset 56: Return through lr.

For each PRNG helper, adjacent words at offsets 60, 64, and 68 are respectively
214013, 2531011, and 32767. These are numeric algorithm constants, not pointers.
The PRNG state wraps modulo 2^32; bit operations and the exact construction of
s0 apply even when the selected state bits are zero. No floating-point arithmetic
or conversion occurs. The two helpers differ only in the constant at offset 40.

The callback helper preserves the peculiar BICS predicate: r1 becomes r1+1 only
when clearing its low bit yields nonzero. It does not implement conventional
rounding for every input. Register shifts and stack arithmetic use ARM 32-bit
semantics. r0 and r2 reach the callback unchanged, r1 points to temporary storage,
and the saved allocation size is below that storage. Stack restoration depends
on the callback obeying its stack contract. No bounds checks are added.

## ELF and validation contract

Emit ELF32 little-endian ET_REL, EM_ARM, EABI5 flags exactly 0x05000000,
ARMv6K/Thumb-1/VFPv2 attributes. Each function owns one executable allocated
PROGBITS section aligned to four, a canonical local section symbol, local $a
at zero, and a default-visible global STT_FUNC at zero whose size excludes
literals. PRNG sections also contain one local $d at offset 60. There are no
other owned symbols, undefined globals, relocations, or foreign executable bytes.

The standalone validator pins config, specification, assembly, every instruction
and literal, section/symbol/mapping metadata, attributes, global set and relocation
absence. It rejects malformed ELF, truncated ranges, instruction/literal mutation,
extra symbols and foreign executable payload. Independent limits are 64 MiB file,
16 MiB executable bytes, 16,384 sections, one million symbols and relocations.
Self-tests exercise each cap, hostile mutations, and a valid composite containing
12,000 unrelated empty executable sections. Ownership is checked against other
config intervals and source definitions on every invocation.

Validation commands (the private input remains external):

~~~sh
arm-none-eabi-as -o /tmp/arm-runtime-helpers-122.o src/main/arm_runtime_helpers_122.S
node scripts/validate-arm-runtime-helpers-122.mjs --self-test
node scripts/validate-arm-runtime-helpers-122.mjs /tmp/arm-runtime-helpers-122.o --authoritative "$DECOMP_PRIVATE/code.bin" build/AS_EUR_REV2/target/code.o build/AS_EUR_REV2/report.json
~~~

Authoritative mode requires the private image, target ELF and report. It compares
all owned bytes against the image and every body against the target ELF, verifies
public ARM boundaries and unmatched report status, and rejects missing evidence.
Object-only validation is structural and pinned-byte validation; it does not claim
a fresh authoritative comparison.
