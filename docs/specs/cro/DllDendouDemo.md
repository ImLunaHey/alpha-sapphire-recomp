# `DllDendouDemo` clean-room status

## Scope and provenance

- Target revision: Pokemon Alpha Sapphire `AS_EUR_REV2`.
- Unit: `cro/DllDendouDemo`.
- Role: public-evidence analysis and verification only. No implementation was
  written or changed during this review.
- Observation date: 2026-10-17.
- Public baseline: `3bbd158`.
- Tools: Node.js 24.21.0 for bounded parsing of public JSON metadata and Git
  2.53.0 for repository-state inspection. The repository pins objdiff 3.8.2
  as the authoritative comparison tool, but no private target or generated
  target object was available in this worktree.

This review used only the public neutral inventory, complete-text partition,
source-ownership configuration, contract documentation, and checked-in objdiff
report. It contains no target bytes or hashes, disassembly, instruction
schedule, relocation ledger, extracted content, proprietary string or asset,
SDK material, ROM/container data, or private artifact path.

The existing implementation predates this review and belongs to the separate
implementation role recorded by CRO contract 06. This status does not extend
that implementation or derive new code from it.

## Public interface and ownership

The neutral inventory accepts 21 ARM functions totaling 7,684 bytes. CRO
contract 06 owns one 40-byte function and describes its public behavior at a
high level as filling eight consecutive single-precision fields with one
constant value. The checked-in report credits that complete function exactly.

The other 20 accepted functions total 7,644 bytes and have no approved
behavioral specification or owned implementation in this unit. The partition
also records 6,188 executable gap bytes and 36 bytes of unknown text residue.
Those ranges cannot be promoted to functions or absorbed into neighboring
ownership without new reviewable evidence.

No additional calling convention, object layout, state transition, side
effect, or external-call behavior can be inferred from the unit name, neutral
boundaries, or aggregate sizes. Target comparison may serve only as blind
pass/fail feedback after an independent analysis handoff has specified such
behavior.

## Module data

The public report accounts for 2,644 data bytes: 340 bytes of zero-initialized
state, 44 bytes of writable initialized data, 1,356 bytes categorized as pool
material, and 904 bytes of read-only data. None is matched. Public evidence
does not establish the payload values, symbolic identities, reference
topology, types, ownership, or runtime meaning needed for an independent
implementation.

## Completion status and blockers

The authoritative checked-in report records 1 of 21 functions and 40 of 7,684
accepted function-body bytes matched, with no matched data.
`metadata.complete` is correctly `false`.

Whole-unit completion remains blocked by all of the following:

1. Twenty accepted functions lack approved behavioral specifications and
   independent implementations.
2. The executable gaps and unknown residue lack sufficient classification and
   ownership evidence.
3. All report-accounted data remains unspecified and unmatched.
4. The external verification input and ignored target object are unavailable
   here, so authoritative focused comparison and the deterministic full-unit
   gate cannot run.

Restoring the private oracle would address only the final verification input;
it would not supply the missing clean-room specifications. The unit must stay
incomplete until independently authored code and data cover the entire link
unit and the aggregate publication gates prove exact whole-unit identity.
