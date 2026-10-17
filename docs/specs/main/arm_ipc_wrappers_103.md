# Neutral ARM service-container insertion specification 103

## Scope and provenance

- Target: `AS_EUR_REV2`; provenance follows `docs/PROVENANCE.md`.
- Analysis date: 2026-10-17.
- Clean-room role: semantic specification only.
- Evidence: authoritative unmatched inventory, recursive public ownership
  manifests, bounded private control-flow inspection, mode-aware transfer
  resolution, and whole-text entry auditing.
- Excluded: ROM bytes, encodings, disassembly text, proprietary pointer values,
  strings, media, assets, and target hashes.

Batch 103 accepts `func_00185AEC`. Its body occupies all 240 bytes through the
next global entry, so it owns no adjacent data or literal pool. A whole-ARM-text
branch scan found two incoming calls to the primary entry, three local branches
within the body, and no external branch into an interior slot.

The routine reserves a twelve-byte record from a reusable list or a growable
record arena, associates an input object with that record, inserts the record
before a list sentinel, updates ownership and count fields, invokes a container
callback, and reports success.

## Function and object contract

| Function | Body | Pool | Following global | Summary |
|---|---:|---:|---|---|
| `func_00185AEC` | 240 | 0 | `func_00185BDC` at +240 | Attach one object to a service container, growing record storage when required, then notify the container. |

The implementation is ARMv6K with ARM ISA, Thumb-1 availability, and VFPv2.
Its object is ELF32 little-endian ARM `ET_REL`, System V, ELF version one, ARM
EABI version-five, zero entry point, no program headers, and a canonical null
section. `.text.func_00185AEC` is its only nonempty executable section: flags
allocate plus execute, alignment four, size 240. Owned symbols are the section
symbol, `$a` at zero, and global `STT_FUNC` owner of size 240.

The routine preserves `r4` through `r10` and the return address. `r4` retains
the container, `r8` the input object, `r9` zero, `r7` the list sentinel, `r5`
the selected capacity, and `r6` a newly allocated arena descriptor. The sole
return is at +236 and yields one.

## Transfer contract

Two unconditional linked ARM transfers use `SHT_REL` `R_ARM_CALL` with
implicit addend zero. Both target the same allocator identity.

| Offset | Destination | Role |
|---:|---|---|
| +96 | `func_00184990` | Allocate a twelve-byte arena descriptor. |
| +112 | `func_00184990` | Allocate `capacity * 12` bytes of record storage. |

Three local conditional branches occur at +36 to +156, +48 to +148, and +64
to +92. They select a reusable record, reserve an existing arena slot, or grow
the arena. At +228, an indirect linked transfer through `r1` invokes dispatch
slot 56 from the container table loaded at +216; the receiver in `r0` is the
container retained in `r4`.

## Ordered semantic schedule

| Offsets | Ordered operations |
|---:|---|
| +0..+36 | Save registers, retain the inputs, load the list sentinel and reusable-record head, and unlink the first reusable record when present. |
| +40..+64 | Otherwise compare the active arena cursor and limit. If the arena is exhausted, choose capacity 32 for the first arena. |
| +68..+92 | For later arenas, choose the greater of the old capacity plus 32 and thirteen eighths of the old capacity. |
| +92..+144 | Allocate the descriptor and record array, chain the prior descriptor, publish the new arena, and set its cursor and limit. |
| +148..+160 | Reserve one twelve-byte record and advance the active cursor. |
| +160..+184 | Store the input object when the record address permits it, then splice the record immediately before the sentinel. |
| +188..+212 | Increment the container count, clear a prior ownership link when present, and publish this container as the object's owner. |
| +216..+236 | Load dispatch slot 56, invoke it with the container receiver, return one, and restore registers. |

## Verification obligations

- Reconstruct exactly 240 executable bytes and no adjacent pool.
- Preserve all 60 ordered instructions, three local branches, two direct calls,
  one indirect call, every access width and displacement, and the sole return.
- Emit exactly two `R_ARM_CALL` REL relocations with one shared destination
  identity and zero addends; emit no literal relocation.
- Prove every body word byte-identical against both authoritative object and raw
  code evidence after normalizing only the two declared call displacement fields.
- Enforce exact ELF metadata, complete named-symbol set, ARMv6K attributes,
  absence of foreign executable payloads, and pinned config/spec/source hashes.
- Reject schedule, relocation, symbol, attribute, authoritative-body, and
  resource-limit mutations.
- Cap complete input at 64 MiB, aggregate executable data at 16 MiB, sections
  at 16,384, symbols at 1,000,000, and REL plus RELA entries at 1,000,000,
  testing each independently.
- Do not claim any byte at or after `func_00185BDC` or reproduce any
  target-authored string or asset.
