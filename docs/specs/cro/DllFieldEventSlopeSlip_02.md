# DllFieldEventSlopeSlip clean-room specification 02

## Scope and provenance

This analysis-only appendix covers the three shortest unclaimed constructors
in `cro/DllFieldEventSlopeSlip` for Pokémon Alpha Sapphire `AS_EUR_REV2`. It
refines the constructor summary in `DllFieldEventSlopeSlip_01.md`; the neutral
import names and context terminology are inherited from that specification.

The observations were recorded on 2026-10-17 from the manifest-approved
external module, converted with the repository's deterministic CRO-to-ELF
converter at commit `4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`. GNU Arm
objdump 2.44 established instruction coverage and control flow. SHA-256 was
computed independently over each exact target range and cross-checked against
the corresponding range in the split structural object. No implementation
source, raw instructions, target bytes, private import names, or private paths
are reproduced here.

## Exact inventory

All three routines are contiguous ARM code with four-byte alignment. They
contain no literal/data pool, relocation output, internal branch, secondary
entry, padding, or bytes belonging to an adjacent routine.

| Function | Address | Size | Instructions | Target SHA-256 |
| --- | ---: | ---: | ---: | --- |
| `func_000000D0` | `0x00D0` | 64 | 16 | `9ee7417f9d69d41667a54f74b84ae971d26f5b74dba604e7bc585de4675e77a0` |
| `func_000002DC` | `0x02DC` | 44 | 11 | `f605307ded830ed4419e354ce5fb97dac9f56d447d86d177b15065d01a43dec7` |
| `func_000006D0` | `0x06D0` | 64 | 16 | `085ba1259f8462696ad303379ec691e364966c4e9091cdb894d25bbcd2233bfd` |

The aggregate is 172 bytes and 43 instructions. Calls to `I00`, `I01`, and
`I02` are direct module-relative calls to the already specified import
veneers, so the constructor sections themselves require no ELF relocation.

## Common interface

Each routine accepts three arguments in ABI order:

1. a writable context pointer;
2. an owner pointer;
3. an integer direction, of which only the low byte is stored.

`I00(owner)` returns an owner-derived object. The actor pointer is loaded from
offset `+0x0C` of that result. There are no null checks before this load. Where
used, `I01(actor)` is called for its side effect and its return value is not
otherwise consumed. `I02()` is normalized to exactly zero or one.

## `func_000000D0`

This is the Family A constructor. Its externally observable operation order is:

1. Store `owner` at `context + 0x18`.
2. Call `derived = I00(owner)`.
3. Store `derived` at `context + 0x28`.
4. Load `actor = *(derived + 0x0C)` and store it at `context + 0x1C`.
5. Store the low byte of `direction` at `context + 0x24`.
6. Call `I01(actor)`.
7. Call `predicate = I02()` and normalize it to `predicate != 0`.
8. Store the normalized byte at `context + 0x30` and return the same zero-or-one
   value.

The calls occur strictly in the order `I00`, `I01`, `I02`. No other context
field is accessed.

## `func_000002DC`

This is the Family B constructor. Its externally observable operation order is:

1. Store `owner` at `context + 0x18`.
2. Call `derived = I00(owner)`.
3. Store `derived` at `context + 0x28`.
4. Load `actor = *(derived + 0x0C)` and store it at `context + 0x1C`.
5. Store the low byte of `direction` at `context + 0x24`.
6. Return `actor`.

`I00` is the only call. This routine does not access the counter, cached action,
mode byte, or special-action state and does not call `I01` or `I02`.

## `func_000006D0`

This is the Family C constructor. It performs the Family A operation with the
Family C field offsets:

1. Store `owner` at `context + 0x1C`.
2. Call `derived = I00(owner)`.
3. Store `derived` at `context + 0x2C`.
4. Load `actor = *(derived + 0x0C)` and store it at `context + 0x20`.
5. Store the low byte of `direction` at `context + 0x28`.
6. Call `I01(actor)`.
7. Call `predicate = I02()` and normalize it to `predicate != 0`.
8. Store the normalized byte at `context + 0x34` and return the same zero-or-one
   value.

The calls occur strictly in the order `I00`, `I01`, `I02`. The phase at
`context + 0x18` and the tick counter at `context + 0x30` are not accessed.

## Future fail-closed validation

After a separate implementation exists, extend the unit validator to require
one `AX`/`PROGBITS` section and one global ARM function symbol at each exact
boundary above, the three target hashes, zero relocations in those sections,
and no adjacent allocated bytes attributed to this batch. The public inventory
and partition should be updated only after the independent semantic boundary
gate accepts all three ranges.
