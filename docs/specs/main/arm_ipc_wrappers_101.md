# Neutral ARM service-aggregate constructor specification 101

## Scope and provenance

- Target: `AS_EUR_REV2`, with provenance governed by `docs/PROVENANCE.md`.
- Analysis date: 2026-10-17.
- Clean-room role: analysis and semantic specification only.
- Evidence used: the authoritative unmatched-function inventory, recursive
  public ownership manifests, bounded private-target control-flow inspection,
  mode-aware direct-transfer resolution, and whole-text entry auditing.
- Excluded: ROM bytes, instruction encodings, disassembly text, proprietary
  addresses and pointer values, strings, assets, and target hashes.

This cohort contains the next bounded unmatched ARM service constructor after
IPC100. Its body is 412 bytes, or 103 ordered four-byte semantic slots. It owns
the complete twelve-byte gap before `func_00185774`: two relocatable pointer
slots and one four-byte zero-terminated empty-text object. No selected entry,
interior byte, or adjacent-data byte is already owned by a public primary,
alias, secondary entry, literal-code entry, or material owner. The body occurs
once in the accepted 10,440-function inventory and has no interior incoming
control-flow target.

The constructor initializes a large aggregate service object, creates two
embedded ring-like records, initializes a later registry area, allocates a
twelve-byte descriptor and a 4,352-byte backing region, links both into a
32-byte-element container, and initializes the trailing text-bearing record.
The earlier 1,356-byte scheduler, 808-byte service routine, and 1,052-byte
initializer remain excluded as larger cohorts. The next otherwise suitable
unmatched entry is `func_00185774`.

## Function and extent contract

| Function | Body | Adjacent data | Following global | Contract |
|---|---:|---:|---|---|
| `func_001855CC` | 412 | 12 | `func_00185774` at +424 | Zero and construct the aggregate, initialize two embedded rings, construct its later registry and storage chain, and return through the constructor call sequence. |

The routine follows the ARM procedure-call standard. It saves `r3` through
`r9` and the return address. Register `r8` is persistent zero; `r4` and `r5`
walk embedded aggregate records; `r6` alternately retains the shared embedded
vtable and the twelve-byte allocation; `r7` retains the element size 32. The
sole return is the register-list restore at +408.

## Required architecture and object metadata

The implementation assembles for ARMv6K with ARM ISA, Thumb-1 availability,
and VFPv2 attributes. Its object is ELF32 little-endian ARM `ET_REL`, System V,
ELF version one, ARM EABI version-five, zero entry point, no program headers,
and a canonical null section.

The only nonempty executable section is `.text.func_001855CC`, an aligned
four-byte `SHT_PROGBITS` section with allocate and execute flags and size 424.
It owns one local section symbol, `$a` at zero, `$d` at 412, and global
`STT_FUNC` owner `func_001855CC` of size 412. It owns no alias or secondary
entry.

## Direct-transfer contract

The body has no local branch and no indirect call. It performs seven linked
ARM transfers, each represented by one `SHT_REL` `R_ARM_CALL` relocation with
implicit addend zero.

| Offset | Destination | Argument role |
|---:|---|---|
| +36 | `func_0018BD3C` | Initialize the first aggregate subobject at the entry object plus 28. |
| +80 | `func_0018D894` | Initialize the first embedded ring with option one. |
| +156 | `func_0018D894` | Initialize the second embedded ring with option zero. |
| +216 | `func_001787CC` | Initialize the later aggregate subobject at the current record plus 44. |
| +292 | `func_00184990` | Allocate the twelve-byte descriptor. |
| +304 | `func_00184990` | Allocate the 4,352-byte backing region. |
| +388 | `func_001862A0` | Initialize the trailing record from its empty local text. |

The two calls to `func_0018D894` share one identity and the two allocator calls
share `func_00184990`. The other three destinations are singleton identities.
`func_0018BD3C` and `func_00184990` are already-public primary identities;
the remaining destinations stay external and this batch does not claim them.

## Adjacent-data contract

| Offset | Users | Identity or data | Representation |
|---:|---:|---|---|
| +412 | +8 | `service_aggregate_vtable_101` | One `R_ARM_ABS32`, addend zero. |
| +416 | +88 | `service_ring_vtable_101` | One `R_ARM_ABS32`, addend zero. |
| +420 | +368 | Four zero bytes forming the local empty-text object | Direct PC-relative address; no relocation. |

The two pointer values are distinct and were not found in prior public literal
manifests. They raise cumulative relocatable-pool accounting from 906 slots and
480 classes to 908 slots and 482 classes. The local four-byte empty object does
not contribute a relocation slot or identity class.

## Ordered semantic schedule

| Offsets | Ordered operations |
|---:|---|
| +0..+36 | Save registers; establish persistent zero; install the aggregate vtable; zero words at displacements 4, 8, 12, 16, and 24; advance through the displacement-24 field and call `func_0018BD3C` on the following subobject. |
| +40..+80 | Zero six words at returned-object displacements 28 through 48; retain embedded-record addresses at +24 and +28; pass option one and initialize the first ring through `func_0018D894`. |
| +84..+120 | Load the first ring storage pointer and shared ring vtable; form its end at +160; establish start/end and self-linked first/last words; install the shared ring vtable. |
| +124..+156 | Advance to the second embedded record, zero its first six words, pass option zero, and call the same ring initializer. |
| +160..+216 | Establish the second ring start/end and self links; install the shared vtable; zero two words at its +28 record and the word at +36; initialize the following subobject through `func_001787CC`. |
| +220..+288 | Recover the aggregate base by subtracting 128; zero the byte at returned +96; zero the two-word area at +104; derive the record at aggregate +244; clear words at +240 through +264, bytes +268 and +269, and prepare element size 32 and allocation size 12. |
| +292..+320 | Allocate twelve bytes and retain the result; allocate 4,352 bytes; store the backing pointer in the descriptor; load the old record head, store it with element size 32 in the descriptor, and install the descriptor as the new head. |
| +324..+356 | Load the backing pointer; compute its end at +4,352 and store the start/end pair; replace the active end with start +136; zero backing words +8 and +12 and byte zero; retain the backing pointer in the record and zero backing word +4. |
| +364..+388 | Reload the backing pointer, form the address of the four-byte local empty text, make words +8 and +12 self-referential, form aggregate +272, and call `func_001862A0`. |
| +392..+408 | Recover the aggregate base by subtracting 272; clear a halfword at base +280 and a byte at +282; restore registers and return. |

## Verification obligations

- Reconstruct exactly 103 ARM instructions totaling 412 bytes and the complete
  twelve-byte adjacent-data extent.
- Preserve every access width, displacement, writeback, register-list transfer,
  constant, and ordered call.
- Emit exactly seven `R_ARM_CALL` and two `R_ARM_ABS32` relocations with the
  stated offsets, identities, and addends; the final four bytes remain literal
  zero data without a relocation.
- Prove every executable word byte-identical to the authoritative target after
  normalizing only the seven declared call displacement fields.
- Reject foreign executable payloads, metadata changes, schedule changes,
  relocation changes, identity splits, and target mutations.
- Bound validation to 64 MiB input, 16 MiB aggregate executable data, 16,384
  sections, 1,000,000 symbols, and 1,000,000 REL plus RELA relocations, testing
  every cap independently.
- Do not claim any byte at or after `func_00185774`.
