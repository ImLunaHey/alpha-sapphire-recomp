# Neutral ARM service-state constructor specification 102

## Scope and provenance

- Target: `AS_EUR_REV2`; provenance follows `docs/PROVENANCE.md`.
- Analysis date: 2026-10-17.
- Clean-room role: semantic specification only.
- Evidence: authoritative unmatched inventory, recursive public ownership
  manifests, bounded private control-flow and adjacent-data inspection,
  mode-aware transfer resolution, and whole-text entry auditing.
- Excluded: ROM bytes, encodings, disassembly text, proprietary pointer values,
  strings, media, assets, and target hashes.

`func_00185774` is intentionally withheld: reproducing its complete adjacent
extent would require a target-authored UTF-16 diagnostic string. Batch 102
therefore accepts the next defensible candidate, `func_0018592C`. Its body is
420 bytes (105 ordered ARM slots) and its complete 28-byte adjacent pool ends
at `func_00185AEC`. The pool has seven pairwise-distinct identities not found
in prior public literal manifests. A whole-ARM-text branch scan found one
incoming call to the primary entry, seven local branches from within the body,
and no incoming target to an interior slot.

The routine constructs a collection service containing a two-element pointer
area, an optional singleton record, two state-generator objects backed by
624-word sequences, and an optional 56-byte context record. Allocation failure
paths and ordered stores are part of the contract.

## Function and object contract

| Function | Body | Pool | Following global | Summary |
|---|---:|---:|---|---|
| `func_0018592C` | 420 | 28 | `func_00185AEC` at +448 | Initialize the collection object, allocate and seed its nested state generators, install an optional context record, and return the collection base. |

The implementation is ARMv6K with ARM ISA, Thumb-1 availability, and VFPv2.
Its object is ELF32 little-endian ARM `ET_REL`, System V, ELF version one, ARM
EABI version-five, zero entry point, no program headers, and a canonical null
section. `.text.func_0018592C` is its only nonempty executable section: flags
allocate plus execute, alignment four, size 448. Owned symbols are the section
symbol, `$a` at zero, `$d` at 420, and global `STT_FUNC` owner of size 420.

The routine saves `r4` through `r8` and the return address. `r8` is persistent
zero, `r6` begins as the two-element count and becomes the optional second
generator pointer, `r7` holds element size 32 and later one, `r5` retains the
collection base, and `r4` walks nested records. The sole return is at +416.

## Transfer contract

Six unconditional linked ARM transfers each use `SHT_REL` `R_ARM_CALL` with
implicit addend zero.

| Offset | Destination | Role |
|---:|---|---|
| +48 | `func_00184990` | Allocate 128 bytes for the initial 32-word pointer area. |
| +112 | `func_00184990` | Allocate the optional four-byte singleton record. |
| +148 | `func_00184990` | Allocate the first 2,560-byte state generator. |
| +256 | `func_0018B220` | Initialize the first generator's trailing synchronization object with option one. |
| +272 | `func_00186404` | Construct the second generator from the first generator's trailing state. |
| +344 | `func_00184990` | Allocate the optional 56-byte context record. |

The allocator identity is shared at four sites. The other two destinations are
distinct singletons. `func_00184990` and `func_0018B220` are already-public
primary entries; `func_00186404` remains an external primary identity.

Seven local branches occur at +60 to +84, +80 to +64, +124 to +136, +160 to
+332, +240 to +196, +328 to +288, and +356 to +408. They implement two
allocation guards, two 624-iteration unsigned loops, one two-element loop, and
the optional singleton/context guards. There is no indirect transfer.

## Literal-pool contract

| Pool offset | Load sites | Identity | Role |
|---:|---:|---|---|
| +420 | +12 | `service_collection_vtable_102` | Collection vtable. |
| +424 | +128 | `service_singleton_vtable_102` | Optional singleton identity. |
| +428 | +164 | `service_prng_vtable_102` | First state-generator vtable. |
| +432 | +176 | `service_prng_terminal_102` | Terminal state identity stored at generator displacement 2504. |
| +436 | +200, +292 | `service_prng_multiplier_102` | Shared recurrence multiplier for both 624-word sequences. |
| +440 | +360 | `service_context_vtable_102` | Optional context-record vtable. |
| +444 | +364 | `service_context_descriptor_102` | Context descriptor installed at displacement four. |

Every slot uses one `R_ARM_ABS32` relocation with addend zero. All seven
classes are new, raising cumulative accounting from 908/482 to 915 pool slots
and 489 classes.

## Ordered semantic schedule

| Offsets | Ordered operations |
|---:|---|
| +0..+48 | Save registers; establish count two, zero, and element size 32; install the collection identity; zero its first three post-table words; allocate 128 bytes. |
| +52..+84 | Store the allocation; when count is nonzero iterate twice, conditionally clearing each word when the allocation is nonnull; derive begin at allocation +8 and end at allocation +128. |
| +88..+140 | Allocate four bytes; on success install the singleton identity; store its pointer through the collection's begin pointer. |
| +144..+192 | Allocate 2,560 bytes; on success install the first generator identity, terminal identity, one-based counter, and zero companion word. |
| +196..+240 | Repeatedly load the preceding state word, multiply by the shared multiplier, store the next word, increment the counter, and continue unsigned while below 624. |
| +244..+272 | Address the first generator's trailing object, initialize it with option one, recover both generator bases, call `func_00186404`, and store its result. |
| +276..+328 | Reset the second counter to one and run the same multiply/store recurrence until 624 words are present. |
| +332..+356 | Store the optional second-generator base through the collection; allocate 56 bytes for the context record and branch around construction on failure. |
| +360..+404 | Install context vtable and descriptor, zero its companion word and two pairs at displacements 32 and 40, then store the optional record in the collection. |
| +408..+416 | Return the collection base retained in `r5` and restore registers. |

## Verification obligations

- Reconstruct exactly 420 executable bytes plus the complete 28-byte pool.
- Preserve 105 ordered instructions, seven local branches, six calls, the two
  guarded allocations, both 624-iteration recurrence loops, every access width
  and displacement, and the sole return.
- Emit exactly six `R_ARM_CALL` and seven `R_ARM_ABS32` REL relocations with
  the declared identities and zero addends.
- Prove all body words byte-identical against the authoritative target after
  normalizing only the six declared call displacement fields; separately
  verify the seven authoritative pool values are nonzero and pairwise distinct.
- Enforce exact ELF metadata, complete named-symbol set, ARMv6K attributes,
  absence of foreign executable payloads, and pinned config/spec/source hashes.
- Reject schedule, pool, relocation, symbol, attribute, target-body, target-
  pool, and resource-limit mutations.
- Cap complete input at 64 MiB, aggregate executable data at 16 MiB, sections
  at 16,384, symbols at 1,000,000, and REL plus RELA entries at 1,000,000,
  testing each independently.
- Do not claim `func_00185774`, its string-bearing extent, or any byte at or
  after `func_00185AEC`.
