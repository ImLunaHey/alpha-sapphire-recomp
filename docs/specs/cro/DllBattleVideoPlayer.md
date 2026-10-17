# DllBattleVideoPlayer provenance blocker

## Status

`cro/DllBattleVideoPlayer` remains incomplete for Pokémon Alpha Sapphire
`AS_EUR_REV2`. The existing independently authored eight-byte store leaf is the
only claimed exact function in this unit. No additional implementation or
ByteMatch credit is accepted by this document.

## Quarantine decision

A proposed reconstruction for two additional functions was withdrawn on
2026-10-17 after coordinator review found that the implementation reused a
public assembly template whose register allocation and instruction choreography
had originally been derived from private-target analysis. Its validator also
encoded that choreography. Although comparison and CI passed, this provenance
does not satisfy the target-blind implementation role required by
[`docs/CLEAN_ROOM.md`](../../CLEAN_ROOM.md).

The implementation, validator, source claims, and report credit are removed at
the branch tip. The quarantined material must not be reused as an implementation
reference. Any future attempt requires a fresh implementer with no exposure to
that material, an independently approved behavioral contract, and target
comparison limited to opaque pass/fail.

## Remaining blocker

The unit lacks independently approved, target-blind reconstructions for the
remaining accepted functions and all report-accounted data. Unclassified text
also prevents whole-unit identity. `metadata.complete` must remain `false`.

## Provenance

- Target revision: Pokémon Alpha Sapphire Europe revision 2
  (`AS_EUR_REV2`), title version 3120.
- Public unit identity and boundaries: checked-in CRO manifest and neutral
  symbol/partition metadata.
- Review date: 2026-10-17.
- Classification: corrective clean-room provenance record and blocker only;
  not an implementation specification.
