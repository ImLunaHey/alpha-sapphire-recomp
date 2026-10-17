# DllBag verification and completion blocker

## Scope and provenance

This verification-only handoff covers the genuine link unit `cro/DllBag` for
`AS_EUR_REV2`. The observations were recorded on 2026-10-17 from the public CRO
manifest, public neutral function inventory, public complete-text partition,
the current objdiff report, and aggregate metadata from the repository's
validated ignored target conversion.

No new game implementation was authored. The private target was used only for
structural validation and opaque pass/fail comparison of the already-reviewed
store leaf. This document contains no target bytes, disassembly, instruction
schedule, copied string or table, asset, SDK material, or private path.

## Verified progress

The manifest records a 106,496-byte CRO. Its 82,996-byte text segment has 65
accepted ARM functions totaling 20,152 bytes. The remaining text is classified
as 58,532 executable gap bytes, 4,220 pool bytes, and 92 bytes of unknown
residue. These categories cover the text segment exactly and do not turn gaps
or unknown material into synthetic functions.

The existing independently authored `func_00014254` implements the reviewed
byte-store leaf contract from `store_leaves_02.md`: store the byte-valued second
argument at offset 217 from the base pointer and return. The genuine report
matches this complete 8-byte function exactly. It is the unit's only current
match, so the code result is 1/65 functions and 8/20,152 accepted function
bytes. The authored object contains no relocations or other allocated payload.

The report's 7,724-byte data denominator consists of the 4,220 text-pool bytes,
3,424 read-only bytes, four writable initialized bytes, and 76 zero-initialized
bytes. None is reconstructed. The ignored structural target has 1,062
relocations in aggregate; the authored base has none. These counts describe
the remaining link surface without disclosing relocation entries or payload.

`metadata.complete` remains `false`. The unit-specific validator pins the
public contract and partition aggregates, the payload-free authored-object
boundary, the blind exact function comparison, the report totals, and the
fail-closed completion state.

## Concrete blockers

Whole-unit completion is blocked by missing independent clean-room handoffs:

1. The other 64 accepted functions, totaling 20,144 bytes, have no approved
   behavioral specifications from which a separate implementation role can
   write original source.
2. The 58,532 executable gap bytes lack accepted function boundaries. They
   cannot be claimed as a pseudo-function or silently absorbed into nearby
   functions.
3. The 92 unknown text bytes cannot be classified as code or data without new
   reviewable evidence.
4. All 7,724 report-accounted data bytes remain unmatched. Aggregate sizes do
   not lawfully specify their values, ownership, or source representation.
5. The target relocation aggregate has no corresponding authored relocation.
   Completion requires reviewed symbolic identities, ownership, and addend
   semantics, not a copied relocation table.

Opaque comparison can verify an independently completed reconstruction, but it
cannot supply these missing specifications. Until the inventory, behavioral
handoffs, data ownership, relocations, and remaining residue are independently
resolved, the unit must remain incomplete.
