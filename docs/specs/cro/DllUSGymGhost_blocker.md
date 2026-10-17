# DllUSGymGhost publication blocker

`cro/DllUSGymGhost` is not a published ByteMatch unit for `AS_EUR_REV2`.
This documentation-only, implementation-side audit records an assignment
mismatch; it is not target-aware analysis, a behavioral specification, or
approval to add a unit.

## Provenance and method

- Review date: 2026-10-17.
- Repository revision: `0921db350e33eef75e25f07def3c9538950f0179`.
- Declared target: Pokemon Alpha Sapphire `AS_EUR_REV2` (Europe, revision 2),
  as recorded in [repository provenance](../../PROVENANCE.md). The target was
  not inspected or executed for this audit.
- Tools: Git 2.53.0, Node.js v24.21.0, npm 11.19.0, GitHub CLI 2.102.0,
  ripgrep 15.2.0, and GNU Bash 5.3.9.
- Method: read the [clean-room policy](../../CLEAN_ROOM.md),
  [specification policy](../README.md), and
  [CRO publication rules](../../CRO_UNITS.md); then query only tracked public
  unit metadata, the checked-in aggregate report, source registration,
  repository paths and history, and public repository issues and pull
  requests for the exact unit name.

No ROM, CRO binary, extracted asset, target object, disassembly, target byte,
private comparison result or path, proprietary SDK or source, credential, or
other private artifact was inspected or reproduced.

## Published evidence

- The public CRO manifest declares exactly 145 units. Its `DllUSGym` entries
  are `DllUSGymElec`, `DllUSGymEsper`, `DllUSGymFighting`, `DllUSGymFire`,
  `DllUSGymFlight`, and `DllUSGymWater`; it has no `DllUSGymGhost` entry.
- The checked-in objdiff report publishes the same six gym units and no
  `cro/DllUSGymGhost` unit. The report contains 146 total units only because
  `main/code` is published alongside the 145 manifest-listed CROs.
- No `DllUSGymGhost` symbol inventory, text partition, authored-source entry,
  source directory, tracked history, public issue, or public pull request was
  found.
- The aggregate report remains at 416,672 matched code bytes, 4,255 matched
  functions, and zero complete units. This audit changes none of those values.

These public facts establish that the requested name is outside the validated
unit set. They provide no evidence that a module was omitted, no alias to one
of the six published gym units, and no behavioral facts from which code could
be implemented.

## Stop condition and handoff

Do not create a source skeleton, inventory, partition, manifest entry, objdiff
unit, or progress credit for `cro/DllUSGymGhost`. Doing so would invent a link
boundary and bypass the exact manifest/report publication gates.

Further work requires a corrected assignment naming an existing published
unit. If a distinct target-aware inventory contributor instead establishes a
previously unknown CRO, that contributor must follow the repository's private
extraction and public-manifest process and provide an independently reviewable
handoff without exposing proprietary material. Only after the resulting unit
is published and a separate analyst supplies an approved behavioral
specification may a target-blind implementer write original source for it.
