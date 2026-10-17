# Neutral ARM service-helper specification 99

## Scope and provenance

- Target: `AS_EUR_REV2`, with provenance governed by `docs/PROVENANCE.md`.
- Analysis date: 2026-10-17.
- Clean-room role: analysis and semantic specification only.
- Evidence used: the authoritative unmatched-function report, neutral global-
  symbol inventory, recursive public ownership manifests, bounded private-
  target control-flow inspection, mode-aware direct-transfer resolution, and
  whole-text entry auditing.
- Excluded from this document: target bytes, instruction encodings,
  disassembly text, assembler source, private values, strings, assets, and
  target hashes.

This cohort contains the next suitably bounded unmatched ARM service helper
after IPC98. Its executable body is exactly 276 bytes, or 69 ordered four-byte
semantic slots. It ends exactly where `func_001854A0` begins, owns no adjacent
pool, and requires no code or data relocation.

The previously recorded 1,356-byte scheduler, 808-byte service routine, and
1,052-byte initializer remain excluded as larger cohorts. The next otherwise
suitable unmatched entry is `func_001854A0`.

A recursive ownership scan found no selected entry or interior already owned
as a public primary body, alias, secondary entry, literal code entry, or
material owner. The complete body occurs once in the 10,440-body inventory.
A mode-aware whole-text scan found ten ARM transfers from other bodies to the
selected primary entry, no Thumb transfer to it, and no transfer from outside
the body to an interior address. These incoming transfers confirm only the
global entry and create no additional ownership.

## Function and extent contract

| Function | Section | Body | Adjacent pool | Following global | Semantic contract |
|---|---|---:|---:|---|---|
| `func_0018538C` | `.text.func_0018538C` | 276 | 0 | `func_001854A0` at +276 | Advance a service object through its halfword state machine by invoking ordered dispatch-table operations and return the resulting state. |

The routine follows the ARM procedure-call standard. It saves `r4`, `r5`,
`r6`, and the return address, retains the entry object pointer in `r4`, and
uses `r5` for the requested state value two or four. The saved `r6` has no
semantic use in the body but is part of the required frame. The return value
in `r0` is the unsigned halfword state at object displacement 20. There is no
stack-local allocation, direct external call, external tail transfer,
literal load, or secondary entry.

## Required architecture and object metadata

The implementation must assemble for **ARMv6K**, not ARMv7 or ARMv7-A. Its
AEABI attributes are CPU name `6K`, architecture `v6K`, ARM ISA enabled,
Thumb-1 enabled, and VFPv2. No ARMv7-only instruction or attribute is allowed.

The implementation object is an ELF32 little-endian ARM `ET_REL` object using
System V ABI identification, ELF version one, ARM EABI version-five flags, a
zero entry point, no program-header table, and a canonical all-zero null
section. The sole owned section is `.text.func_0018538C`: `SHT_PROGBITS`,
allocatable and executable, address zero, alignment four, and size 276.

That section has exactly one canonical local `STT_SECTION` symbol, a local
default-visible `$a` mapping symbol at value zero, and the global
default-visible `STT_FUNC` owner `func_0018538C` at value zero and size 276.
It has no `$d` mapping symbol, named or unnamed alias, secondary owner, or
other defined symbol. It has no undefined symbol and no relocation section
targeting the owned section.

## Control-flow and dispatch contract

The body has exactly twelve local direct branches, all resolved within the
owned section, and one return at +272. It performs exactly eight indirect
linked calls through method pointers loaded from the object's dispatch table.
None of these calls emits a relocation.

| Call offset | Target load | Table displacement | Argument contract |
|---:|---:|---:|---|
| +20 | +12 into `r1` | 24 | `r0` is the retained object pointer. |
| +68 | +60 into `r1` | 36 | `r0` is the retained object pointer. |
| +100 | +92 into `r2` | 48 | `r0` is the retained object pointer; `r1` is the state value in `r5`. |
| +152 | +140 into `r2` | 48 | `r0` is the retained object pointer; `r1` is two. |
| +180 | +172 into `r2` | 20 | `r0` is the retained object pointer; `r1` is two. |
| +200 | +192 into `r1` | 32 | `r0` is the retained object pointer. |
| +232 | +224 into `r2` | 48 | `r0` is the retained object pointer; `r1` is four. |
| +260 | +252 into `r2` | 20 | `r0` is the retained object pointer; `r1` is four. |

## Ordered semantic slot schedule

Each row describes an ordered sequence of four-byte slots. Offsets are
inclusive and advance by four. Register identities, conditions, access
widths, displacements, constants, and branch destinations are interoperability
facts; the prose does not prescribe textual assembly or binary encoding.

### `func_0018538C`

| Offsets | Ordered semantic slots |
|---:|---|
| +0..+20 | Save `r4` through `r6` and the return address; retain entry `r0` in `r4`; read the dispatch-table pointer at object displacement zero; read its method at displacement 24 into `r1`; restore the object pointer to `r0`; perform the indirect linked call through `r1`. |
| +24..+56 | Read the unsigned halfword at object displacement 20 and compare it with four; branch to +272 when equal and to +116 on the signed-greater condition; compare it with one and branch to +132 when equal; compare it with two and branch to +272 when unequal. |
| +60..+84 | Read the dispatch table and its method at displacement 36 into `r1`; restore the object pointer to `r0`; perform the indirect linked call; compare the result with zero; conditionally set `r5` to four when nonzero; branch to +268 when zero. |
| +88..+112 | Read the dispatch table; copy `r5` to `r1`; read its method at displacement 48 into `r2`; restore the object pointer to `r0`; perform the indirect linked call; compare the result with zero; branch to +268 when zero and otherwise branch to +244. |
| +116..+128 | Compare the retained state with eight and branch to +272 when equal; compare it with 64 and branch to +272 when unequal. |
| +132..+160 | Read the dispatch table; set `r5` to two and copy it to `r1`; read the method at displacement 48 into `r2`; restore the object pointer to `r0`; perform the indirect linked call; compare the result with zero and branch to +188 when zero. |
| +164..+184 | Read the dispatch table; copy `r5` to `r1`; read the method at displacement 20 into `r2`; restore the object pointer to `r0`; perform the indirect linked call; store the low halfword of `r5` at object displacement 20. |
| +188..+212 | Read the dispatch table and its method at displacement 32 into `r1`; restore the object pointer to `r0`; perform the indirect linked call; compare the result with zero; conditionally set `r5` to four when nonzero; branch to +268 when zero. |
| +216..+240 | Read the dispatch table; copy `r5` to `r1`; read its method at displacement 48 into `r2`; restore the object pointer to `r0`; perform the indirect linked call; compare the result with zero and branch to +268 when zero. |
| +244..+272 | Read the dispatch table; copy `r5` to `r1`; read its method at displacement 20 into `r2`; restore the object pointer to `r0`; perform the indirect linked call; store the low halfword of `r5` at object displacement 20; load the resulting unsigned halfword state into `r0`; restore `r4` through `r6` and the program counter to return. |

The state routing is exact: states four and eight return after the initial
dispatch; values reaching the signed-greater-than-four arm return unless equal to 64; state
one and state 64 enter the state-two attempt; state two first attempts the
state-four path; all other input states return. Failed boolean operations
return the current state without performing subsequent transitions.

## Verification obligations

- Reconstruct one ARMv6K body of exactly 276 bytes in one executable section,
  with no adjacent pool byte.
- Preserve all 69 ordered executable slots, including the otherwise-unused
  saved `r6`, unsigned halfword state accesses, twelve local branches, eight
  indirect linked calls, conditional state assignments, and sole return.
- Emit no relocation targeting the owned section and no undefined symbol.
- Preserve the exact dispatch target-load registers, table displacements,
  argument registers, and call offsets stated above.
- Require ARMv6K/Thumb-1/VFPv2 AEABI attributes and reject ARMv7 attributes
  or ARMv7-only instructions.
- Keep cumulative adjacent-pool accounting at 898 slots and 473 classes.
- Do not claim or absorb any byte at or after `func_001854A0`; leave that
  function for the next bounded cohort.
- Bound validation to 64 MiB of complete input, 16 MiB of aggregate
  executable section data, 16,384 sections, 1,000,000 symbols, and 1,000,000
  relocations. Count both `SHT_SYMTAB` and `SHT_DYNSYM`, count both REL and
  RELA relocations, and test every cap independently.
