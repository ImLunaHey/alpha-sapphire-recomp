# DllPhotoSaverSecretBase provenance blocker

## Status

`cro/DllPhotoSaverSecretBase` remains incomplete for Pokémon Alpha Sapphire
`AS_EUR_REV2`. The independently authored eight-byte store leaf is the only
claimed exact function in this unit. No additional implementation or ByteMatch
credit is accepted by this document.

## Quarantine decision

A proposed 536-byte setup reconstruction was withdrawn on 2026-10-17 after
coordinator review found that its specification, assembly, and threshold
validator encoded target-derived physical implementation details. The function
was not byte-identical. This provenance does not satisfy the target-blind
implementation role required by [`docs/CLEAN_ROOM.md`](../../CLEAN_ROOM.md).

The derived specification, assembly, config claim, and threshold validation are
removed at the branch tip. The quarantined material must not be reused as an
implementation reference. Any future attempt requires a fresh implementer with
no exposure to that material, an independently approved behavioral contract,
and target comparison limited to opaque pass/fail.

## Remaining blocker

The unit lacks independently approved target-blind implementations for its
remaining code and all report-accounted data. Unclassified text, pools, and
unknown ranges also prevent whole-unit identity. `metadata.complete` must
remain `false`.

## Provenance

- Target revision: Pokémon Alpha Sapphire Europe revision 2
  (`AS_EUR_REV2`), title version 3120.
- Public unit identity and boundaries: checked-in CRO manifest and neutral
  symbol/partition metadata.
- Review date: 2026-10-17.
- Classification: corrective clean-room provenance record and blocker only;
  not an implementation specification.
