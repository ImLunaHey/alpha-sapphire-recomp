# Neutral ARM service-helper specification 97

## Scope and provenance

- Target: `AS_EUR_REV2`, with provenance governed by `docs/PROVENANCE.md`.
- Analysis date: 2026-10-17.
- Clean-room role: analysis and semantic specification only.
- Evidence used: the authoritative unmatched-function report, neutral global-
  symbol inventory, recursive public ownership manifests, bounded private-
  target control/data-flow inspection, mode-aware direct-transfer resolution,
  whole-text entry auditing, and adjacent-pool identity classification.
- Excluded from this document: target bytes, instruction encodings,
  disassembly text, assembler source, private pointer values, strings, assets,
  and target hashes.

This cohort contains the next suitably bounded unmatched ARM service helper
after IPC96. Its executable body is exactly 200 bytes, or 50 ordered four-byte
semantic slots. It owns both four-byte words in the immediately following
pool, so its complete owned extent is 208 bytes and ends exactly where
`func_00184AAC` begins. Both pool identities are new and pairwise distinct.

`func_00180F24` remains excluded because its 1,356-byte multi-loop
scheduler/dispatcher is outside this bounded wrapper cohort. The 808-byte
multi-path routine `func_00184AAC` is also left for a larger cohort. The next
otherwise suitable unmatched entry is `func_00184E10`.

A recursive ownership scan found no selected entry, interior, or adjacent word
already owned as a public primary body, alias, secondary entry, literal code
entry, or material owner. The complete body occurs once in the 10,440-body
inventory. A mode-aware whole-text scan found eleven ARM transfers from other
bodies to the selected primary entry, no Thumb transfer to it, and no transfer
from outside the selected body to an interior address. The incoming transfers
confirm the global entry and do not create additional ownership.

## Function and extent contract

| Function | Section | Body | Adjacent pool | Following global | Semantic contract |
|---|---|---:|---:|---|---|
| `func_001849DC` | `.text.func_001849DC` | 200 | 8 | `func_00184AAC` at +208 | Initialize a service object, allocate and optionally prepare a subordinate buffer, construct a five-byte opaque stack key, bind the resulting temporary descriptor to the object, and release the temporary descriptor. |

The routine follows the ARM procedure-call standard. It saves `r4`, `r5`, and
the return address, reserves 44 stack bytes, retains the object pointer in
`r4`, and returns that pointer in `r0` after releasing the frame. It has no
local branch, indirect call, external tail transfer, or secondary entry. One
of its five linked calls is conditional on an allocation result.

## Required architecture and object metadata

The implementation must assemble for **ARMv6K**, not ARMv7 or ARMv7-A. Its
AEABI attributes are CPU name `6K`, architecture `v6K`, ARM ISA enabled,
Thumb-1 enabled, and VFPv2. No ARMv7-only instruction or attribute is allowed.

The implementation object is an ELF32 little-endian ARM `ET_REL` object using
System V ABI identification, ELF version one, ARM EABI version-five flags, a
zero entry point, no program-header table, and a canonical all-zero null
section. The sole owned section is `.text.func_001849DC`: `SHT_PROGBITS`,
allocatable and executable, address zero, alignment four, and size 208.

That section has exactly one canonical local `STT_SECTION` symbol, a local
default-visible `$a` mapping symbol at value zero, a local default-visible
`$d` mapping symbol at value 200, and the global default-visible `STT_FUNC`
owner `func_001849DC` at value zero and size 200. It has no named or unnamed
alias, secondary owner, or other defined symbol. Every external call and
literal identity is a unique undefined global, default-visible `STT_NOTYPE`
symbol with zero value and size. Relocations use ELF `SHT_REL` form and the
exact site order and zero addends stated below.

## Transfer, return, and relocation contract

Exactly five linked direct transfers require `R_ARM_CALL` relocations with
addend zero. All destinations are distinct, four-byte-aligned ARM primary
entries. The call at +104 is conditional on the preceding comparison being
not equal; the other four calls are unconditional.

| Body offset | Relocation | Condition | Transfer relation | Stable destination |
|---:|---|---|---|---|
| +92 | `R_ARM_CALL`, addend 0 | always | linked | `func_00184990` |
| +104 | `R_ARM_CALL`, addend 0 | not equal | linked | `func_0018B220` |
| +164 | `R_ARM_CALL`, addend 0 | always | linked | `func_00185E38` |
| +176 | `R_ARM_CALL`, addend 0 | always | linked | `func_0018B348` |
| +184 | `R_ARM_CALL`, addend 0 | always | linked | `func_00185E9C` |

The sole return is at +196. There is no other code transfer or code
relocation in the selected extent.

## Adjacent pool and literal-identity contract

Two PC-relative word loads address the complete adjacent pool. Each pool word
requires an `R_ARM_ABS32` relocation with addend zero to its neutral identity.
The two identities are pairwise distinct and neither reuses any previously
owned IPC literal class. Their private values are deliberately non-normative.

| Pool offset | Referencing slot | Relocation | Stable identity | Semantic role |
|---:|---:|---|---|---|
| +200 | +44 | `R_ARM_ABS32`, addend 0 | `service_object_descriptor_97` | Descriptor identity stored into the object's secondary type slot. |
| +204 | +68 | `R_ARM_ABS32`, addend 0 | `service_object_vtable_97` | Primary dispatch-table identity stored at the object base. |

IPC cumulative adjacent-pool accounting advances from 892 physical slots in
469 value classes to 894 slots in 471 classes. No byte remains between the
owned extent and `func_00184AAC`.

## Structured semantic slot schedule

Each row is an ordered sequence of four-byte slots. Offsets are inclusive and
advance by four in the exact order described. Register names, conditions,
memory widths, displacements, stack locations, destination identities, and
state transitions are interoperability facts; the prose does not prescribe
textual assembly or binary encoding. The five opaque key-byte immediates are
listed numerically without interpreting or reproducing them as a string.

### `func_001849DC`

| Offsets | Ordered semantic slots |
|---:|---|
| +0..+44 | Save `r4`, `r5`, and the return address; reserve 44 stack bytes; retain entry `r0` in `r4`; set `r1` to zero; store word zero at `[r0 + 4]` while updating `r0` to that address; set `r2` to 5; store word zero at `[r0 + 8]`; set `r3` to 64; add 4 to `r0`; set `r12` to one; store word one at `[r0 + 4]`; load `service_object_descriptor_97` from pool offset +200 into `r12`. |
| +48..+80 | Store low-byte zero at `[r0 + 8]`; store word zero at `[r0 + 12]`; store the descriptor identity from `r12` at `[r0]`; store word zero at `[r0 + 16]` and `[r0 + 20]`; load `service_object_vtable_97` from pool offset +204 into `r1`; set `r0` to one; store the vtable identity at `[r4]`; store the register pair `r2`, `r3` at `[r4 + 32]` and `[r4 + 36]`. |
| +84..+108 | Store low-byte one at `[r4 + 554]`; set `r0` to 48; linked call to `func_00184990`; compare the result with zero; when nonzero set `r1` to 536870912 and conditionally call `func_0018B220`; store the resulting `r0` at `[r4 + 556]`. |
| +112..+160 | Set `r1` to 67 and store its low byte at stack +0; set `r2` to 68 and store its low byte at stack +1; set `r3` to 38; set `r12` to 77; set `r5` to 76; store the low byte of `r3` at stack +2; set `r0` to stack +8; set `r2` to 5; copy the stack pointer to `r1`; store the low bytes of `r12` and `r5` at stack +3 and stack +4. |
| +164..+184 | Linked call to `func_00185E38`; set `r1` to stack +8; copy the retained object pointer to `r0`; linked call to `func_0018B348`; set `r0` to stack +8; linked call to `func_00185E9C`. |
| +188..+196 | Release the 44 stack bytes; copy the retained object pointer to `r0`; restore `r4`, `r5`, and the program counter to return. |

## Verification obligations

- Reconstruct one ARMv6K body of exactly 200 bytes plus exactly eight adjacent
  pool bytes in one 208-byte executable section.
- Preserve all 50 ordered executable slots, including the pre-indexed store,
  doubleword register-pair store, byte widths, displacements, immediate values,
  conditional call, stack-key construction, and return-value behavior.
- Emit exactly five `R_ARM_CALL` relocations and two `R_ARM_ABS32` relocations,
  all at the configured sites, in site order, with addend zero; emit no other
  relocation in the owned extent.
- Preserve five pairwise-distinct ARM destination classes, two pairwise-
  distinct new literal classes, the `$a`/`$d` mapping boundary at +200, and the
  sole return at +196.
- Require ARMv6K/Thumb-1/VFPv2 AEABI attributes and reject ARMv7 attributes or
  ARMv7-only instructions.
- Keep cumulative pool accounting at 894 slots and 471 classes.
- Do not claim or absorb `func_00180F24`, `func_00184AAC`, or any byte at or
  after `func_00184AAC`; leave `func_00184E10` for the next bounded cohort.
- Bound validation to 64 MiB of complete input, 16 MiB of aggregate executable
  section data, 16,384 sections, 1,000,000 symbols, and 1,000,000 relocations,
  with each limit tested independently.
