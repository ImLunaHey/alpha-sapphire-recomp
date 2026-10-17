# Neutral ARM service-helper specification 98

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
after IPC97. Its executable body is exactly 256 bytes, or 64 ordered four-byte
semantic slots. It owns all four words in the immediately following pool, so
its complete owned extent is 272 bytes and ends exactly where
`func_00184F20` begins. Two pool identities are reused, two are new, and all
four classes are pairwise distinct.

`func_00180F24` and `func_00184AAC` remain excluded for the reasons recorded
by IPC97. The 1,052-byte multi-path initializer `func_00184F20` is also left
for a larger cohort. The next otherwise suitable unmatched entry is
`func_0018538C`.

A recursive ownership scan found no selected entry, interior, or adjacent word
already owned as a public primary body, alias, secondary entry, literal code
entry, or material owner. The complete body occurs once in the 10,440-body
inventory. A mode-aware whole-text scan found five ARM transfers from other
bodies to the selected primary entry, no Thumb transfer to it, and no transfer
from outside the selected body to an interior address. The incoming transfers
confirm the global entry and do not create additional ownership.

## Function and extent contract

| Function | Section | Body | Adjacent pool | Following global | Semantic contract |
|---|---|---:|---:|---|---|
| `func_00184E10` | `.text.func_00184E10` | 256 | 16 | `func_00184F20` at +272 | Initialize a guarded service record, validate or locate its indexed registry entry, install record fields on success, report either of two contextual failures, release the guard when required, and return the record pointer. |

The routine follows the ARM procedure-call standard. It saves `r4` through
`r10` and the return address. It retains the record pointer in `r4`, the guard
identity in `r5`, a low-byte guard-state value in `r6`, the second argument in
`r7`, and the third argument in `r8`; `r9` and `r10` hold one and zero. It
returns the record pointer in `r0`. There is no stack-local allocation,
indirect call, external tail transfer, or secondary entry.

## Required architecture and object metadata

The implementation must assemble for **ARMv6K**, not ARMv7 or ARMv7-A. Its
AEABI attributes are CPU name `6K`, architecture `v6K`, ARM ISA enabled,
Thumb-1 enabled, and VFPv2. No ARMv7-only instruction or attribute is allowed.

The implementation object is an ELF32 little-endian ARM `ET_REL` object using
System V ABI identification, ELF version one, ARM EABI version-five flags, a
zero entry point, no program-header table, and a canonical all-zero null
section. The sole owned section is `.text.func_00184E10`: `SHT_PROGBITS`,
allocatable and executable, address zero, alignment four, and size 272.

That section has exactly one canonical local `STT_SECTION` symbol, a local
default-visible `$a` mapping symbol at value zero, a local default-visible `$d`
mapping symbol at value 256, and the global default-visible `STT_FUNC` owner
`func_00184E10` at value zero and size 256. It has no named or unnamed alias,
secondary owner, or other defined symbol. Every external call and literal
identity is a unique undefined global, default-visible `STT_NOTYPE` symbol
with zero value and size. Relocations use ELF `SHT_REL` form and the exact site
order and zero addends stated below.

## Transfer, return, and relocation contract

Exactly six linked direct transfers require `R_ARM_CALL` relocations with
addend zero. All destinations are four-byte-aligned ARM primary entries. Two
destination classes are each used twice; the other two are singletons. Every
call is unconditional.

| Body offset | Relocation | Transfer relation | Stable destination |
|---:|---|---|---|
| +44 | `R_ARM_CALL`, addend 0 | linked | `func_0017EA3C` |
| +108 | `R_ARM_CALL`, addend 0 | linked | `func_0018B394` |
| +128 | `R_ARM_CALL`, addend 0 | linked | `func_0018B394` |
| +192 | `R_ARM_CALL`, addend 0 | linked | `func_00178974` |
| +224 | `R_ARM_CALL`, addend 0 | linked | `func_00178974` |
| +244 | `R_ARM_CALL`, addend 0 | linked | `func_0017EA90` |

The sole return is at +252. The body contains ten local direct branches, all
resolved within the owned executable body, and no other code relocation.

## Adjacent pool and literal-identity contract

Five PC-relative word loads address the complete four-word adjacent pool.
Each pool word requires one `R_ARM_ABS32` relocation with addend zero to its
neutral identity. The final pool identity is loaded twice from the same slot.
All four identities are pairwise distinct; two reuse classes established by
earlier IPC batches and two establish new classes. Private values are
deliberately non-normative.

| Pool offset | Referencing slots | Relocation | Stable identity | Semantic role |
|---:|---:|---|---|---|
| +256 | +16 | `R_ARM_ABS32`, addend 0 | `service_record_vtable_98` | Dispatch-table identity stored at the record base. |
| +260 | +32 | `R_ARM_ABS32`, addend 0 | `service_record_lock_85` | Reused guard identity retained across the routine. |
| +264 | +48 | `R_ARM_ABS32`, addend 0 | `ipc_service_registry_owner_71` | Reused registry-owner identity used for the indexed lookup. |
| +268 | +176 and +208 | `R_ARM_ABS32`, addend 0 | `service_diagnostic_context_98` | Shared context supplied to both failure reports. |

IPC cumulative adjacent-pool accounting advances from 894 physical slots in
471 value classes to 898 slots in 473 classes. No byte remains between the
owned extent and `func_00184F20`.

## Structured semantic slot schedule

Each row is an ordered sequence of four-byte slots. Offsets are inclusive and
advance by four in the exact order described. Register names, conditions,
memory widths, displacements, addressing modes, immediate values, destination
identities, and state transitions are interoperability facts; the prose does
not prescribe textual assembly or binary encoding.

### `func_00184E10`

| Offsets | Ordered semantic slots |
|---:|---|
| +0..+44 | Save `r4` through `r10` and the return address; retain entry `r0` in `r4` and entry `r1` in `r7`; set `r9` to one; load `service_record_vtable_98` from pool +256 into `r0`; clear the low eight bits of `r1`; retain entry `r2` in `r8`; store the vtable identity at `[r4]`; load `service_record_lock_85` from pool +260 into `r0`; set `r6` to the cleared `r1` combined with one; retain the guard identity in `r5`; linked call to `func_0017EA3C`. |
| +48..+72 | Load `ipc_service_registry_owner_71` from pool +264 into `r3`; set `r10` to zero; compare `r8` with zero; copy `r4` to `r1` and `r7` to `r2`; store low-byte zero at `[r4 + 16]`; when `r8` is zero branch to +124. |
| +76..+104 | Load the registry range descriptor from `[r3 + 68]`; load its begin word into `r3` and end word into `r12`; subtract the begin from the end in `r12`; compare `r8` unsigned with the arithmetic-right-shift-by-two span; branch to +208 when `r8` is greater than or equal; otherwise load `r0` from the begin pointer indexed by `r8` shifted left two, compare it with zero, and branch to +176 when zero. |
| +108..+140 | Linked call to `func_0018B394`; compare its result with zero and branch to +144 when nonzero, otherwise branch to +208; at the zero-index path set `r0` to `r3 + 4`, linked call to `func_0018B394`, compare its result with zero, preserve one architectural no-operation slot, and branch to +228 when zero. |
| +144..+172 | Store `r7` at `[r4 + 8]`, store `r8` at `[r4 + 4]`, and store low-byte one at `[r4 + 16]`; sign-extend the low byte of `r6` into `r0`; compare it with zero; store word zero at `[r4 + 12]`; branch to +248 when equal and otherwise branch to +240. |
| +176..+204 | Load `service_diagnostic_context_98` from pool +268 into `r0`; set `r3` to zero, `r2` to signed value -536870904, and `r1` to 158; linked call to `func_00178974`; preserve two ordered architectural no-operation slots; branch to +228. |
| +208..+224 | Load `service_diagnostic_context_98` from pool +268 into `r0`; set `r3` to zero, `r2` to signed value -536870909, and `r1` to 165; linked call to `func_00178974`. |
| +228..+252 | Sign-extend the low byte of `r6` into `r0`; compare it with zero and branch to +248 when equal; otherwise copy the retained guard identity from `r5` to `r0` and linked call to `func_0017EA90`; copy the retained record pointer from `r4` to `r0`; restore `r4` through `r10` and the program counter to return. |

## Verification obligations

- Reconstruct one ARMv6K body of exactly 256 bytes plus exactly sixteen
  adjacent pool bytes in one 272-byte executable section.
- Preserve all 64 ordered executable slots, including the eight-register save
  and restore, byte-width record-state stores, two-register range load,
  shifted index operations, signed-byte guard tests, ten local branches, two
  ordered no-operation slots, both diagnostic paths, and return behavior.
- Emit exactly six `R_ARM_CALL` relocations and four `R_ARM_ABS32`
  relocations, all at the configured sites, in site order, with addend zero;
  emit no other relocation in the owned extent.
- Preserve four pairwise-distinct ARM destination classes, both repeated-call
  classes, four pairwise-distinct literal classes, both reused literal
  identities, the `$a`/`$d` mapping boundary at +256, and the sole return at
  +252.
- Require ARMv6K/Thumb-1/VFPv2 AEABI attributes and reject ARMv7 attributes
  or ARMv7-only instructions.
- Keep cumulative pool accounting at 898 slots and 473 classes.
- Do not claim or absorb `func_00180F24`, `func_00184AAC`, `func_00184F20`,
  or any byte at or after `func_00184F20`; leave `func_0018538C` for the next
  bounded cohort.
- Bound validation to 64 MiB of complete input, 16 MiB of aggregate
  executable section data, 16,384 sections, 1,000,000 symbols, and 1,000,000
  relocations. Count both `SHT_SYMTAB` and `SHT_DYNSYM`, count both REL and
  RELA relocations, and test every cap independently.
