# Neutral ARM service-container constructor specification 104

## Scope and provenance

- Target: `AS_EUR_REV2`; provenance follows `docs/PROVENANCE.md`.
- Analysis date: 2026-10-17.
- Clean-room role: semantic specification only.
- Evidence: authoritative unmatched inventory, recursive public ownership and
  literal manifests, bounded private control/data-flow inspection, mode-aware
  transfer resolution, physical literal equality, and whole-text entry audit.
- Excluded: ROM bytes, encodings, disassembly text, proprietary pointer values,
  strings, media, assets, and target hashes.

Batch 104 accepts `func_00185BDC`. Its 176-byte body is followed by the complete
eight-byte literal pool and then the next global at +184. The first pool class
is physically identical to the public `service_node_vtable_85` identity; the
second is a new, distinct class. No slot contains text or authored content. A
whole-ARM-text scan found two incoming calls to the official entry and no
direct transfer into an interior slot or pool word.

The routine initializes an embedded node, changes the outer object's dispatch
identity, clears container state, and creates a one-record arena whose record
is linked to itself as an empty sentinel.

## Function and object contract

| Function | Body | Pool | Following global | Summary |
|---|---:|---:|---|---|
| `func_00185BDC` | 176 | 8 | `func_00185C94` at +184 | Initialize the embedded node and an empty one-record service container. |

The implementation is ARMv6K with ARM ISA, Thumb-1 availability, and VFPv2.
Its object is ELF32 little-endian ARM `ET_REL`, System V, ELF version one, ARM
EABI version-five, zero entry point, no program headers, and a canonical null
section. `.text.func_00185BDC` is its only nonempty executable section: flags
allocate plus execute, alignment four, size 184. Owned symbols are the section
symbol, `$a` at zero, `$d` at 176, and global `STT_FUNC` owner of size 176.

The routine preserves `r4` through `r8` and the return address. `r6` retains
the outer object, `r4` addresses its arena state, `r5` is initially zero and
later the arena descriptor, and `r7` retains one. The sole return at +172
restores registers and returns the outer object in `r0`.

## Transfer contract

Three unconditional linked ARM transfers use `SHT_REL` `R_ARM_CALL` with
implicit addend zero.

| Offset | Destination | Role |
|---:|---|---|
| +32 | `func_0018BF64` | Initialize the embedded node with option one. |
| +100 | `func_00184990` | Allocate a twelve-byte arena descriptor. |
| +112 | `func_00184990` | Allocate one twelve-byte record. |

The allocator identity is shared by the final two sites; the embedded-node
initializer is a distinct public primary entry. There is no local branch,
indirect call, or external tail transfer.

## Literal-pool contract

| Pool offset | Load site | Identity | Role |
|---:|---:|---|---|
| +176 | +20 | `service_node_vtable_85` | Reused dispatch identity installed before embedded-node initialization. |
| +180 | +56 | `service_container_vtable_104` | New outer-container dispatch identity. |

Both slots use `R_ARM_ABS32` with zero addend. They are nonzero and physically
distinct in the authoritative target. One reused plus one new class raises
cumulative accounting from 915/489 to 917 physical slots in 490 classes.

## Ordered semantic schedule

| Offsets | Ordered operations |
|---:|---|
| +0..+32 | Save registers, clear then set the option field to one, install the reused node identity, clear a byte flag, advance to the embedded subobject, and initialize it. |
| +36..+68 | Set the embedded halfword option, clear two embedded words, recover the outer base, install the outer identity, and retain the arena-state address. |
| +72..+96 | Clear all six words of arena and count state while preparing a twelve-byte allocation size. |
| +100..+116 | Allocate one descriptor and one record, then store the record pointer in the descriptor. |
| +120..+144 | Chain the descriptor, publish it, and set the arena base, cursor, and limit for the single record. |
| +144..+164 | Publish the cursor and initialize both link words of the record to its own address. |
| +168..+172 | Return the retained outer-object base and restore registers. |

## Verification obligations

- Reconstruct exactly 176 executable bytes plus the complete eight-byte pool.
- Preserve all 44 instructions, three direct calls, every access width and
  displacement, both self-links, and the sole return.
- Emit exactly three `R_ARM_CALL` and two `R_ARM_ABS32` REL relocations with
  the declared identities and zero addends.
- Prove every body word byte-identical against both authoritative object and
  raw code evidence after normalizing only the three call displacement fields;
  separately verify both authoritative pool identities and their inequality.
- Enforce exact ELF metadata, complete named-symbol set, ARMv6K attributes,
  absence of foreign executable payloads, and pinned config/spec/source hashes.
- Reject schedule, pool, relocation, symbol, attribute, target-body,
  target-pool, and resource-limit mutations.
- Cap complete input at 64 MiB, aggregate executable data at 16 MiB, sections
  at 16,384, symbols at 1,000,000, and REL plus RELA entries at 1,000,000,
  testing each independently.
- Do not claim any byte at or after `func_00185C94`, or reproduce any
  target-authored string or asset.
