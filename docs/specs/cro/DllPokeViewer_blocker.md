# DllPokeViewer clean-room evidence blocker

`cro/DllPokeViewer` lacks independently observed behavioral evidence sufficient
for a clean-room implementation. This analysis-only record establishes the
available metadata and the missing evidence; it is not a behavioral contract
or an approval to implement.

## Provenance and method

- Review date: 2026-10-17.
- Repository revision: `3a94a87193fc163cce30c4ef40d571db579cbf3b`.
- Target revision: Pokémon Alpha Sapphire `AS_EUR_REV2` (Europe, revision 2),
  as declared in [repository provenance](../../PROVENANCE.md). This review did
  not independently verify or observe the target.
- Tools: Git 2.53.0, Node.js v24.21.0, and ripgrep 15.2.0.
- Method: read the [clean-room policy](../../CLEAN_ROOM.md) in full; confirm
  the reviewed files are tracked; inspect only the format and accepted-record
  count in this unit's committed inventory; search repository documentation
  for the module name. No target execution or comparison was performed.

No ROM, CRO binary, extracted asset, proprietary source, private path,
disassembly, instruction schedule, or address/offset/relocation ledger was
consulted. The observations below concern repository metadata, not target
behavior.

Repository-wide manifest, inventory, report, source-registry, and aggregate
integrity is owned by `scripts/validate-publication-integrity.mjs`. This record
does not duplicate that enforcement; its purpose is the unit-specific evidence
assessment and provenance needed to decide whether implementation is justified.

## Available evidence

The committed [symbol inventory](../../../symbols/cro/DllPokeViewer.csv)
contains no accepted function records and provides no behavioral evidence.
It establishes no callable interfaces or semantics and cannot prove
completeness or equivalence.

The documentation search found no existing DllPokeViewer behavioral contract
or observation record. The analogous
[DllPhotoViewer](DllPhotoViewer_blocker.md) and
[DllFieldEventContactEncount](DllFieldEventContactEncount_blocker.md) blocker
documents illustrate provenance and evidence-limit conventions only. Their
unit-specific claims supply no behavior for DllPokeViewer.

## Blocker and required evidence

The reviewed evidence specifies no inputs, outputs, valid initial states,
state transitions, side effects, lifecycle, collaborator interfaces, or error
behavior. Neither the module name nor an empty accepted-function inventory can
fill those gaps. No new implementation or match credit is justified by this
review, and no matching or completion result is claimed.

Further work requires independently obtained, reproducible external
observations attributable to this unit and the verified target revision.
A separate observation record must identify the observer, date, runtime or
public interface exercised, observation method, and tool versions. It must
describe initial conditions and stimuli, observable results and state effects,
relevant boundary/error cases, repeatability, and remaining uncertainties.
Any public documentation used must be linked and distinguished from direct
observations. Attribution must not rely on guessing behavior from the name.

That evidence must support a reviewed neutral behavioral and interface
specification before a distinct implementation contributor writes code from
it, as required by the [specification policy](../README.md). Match credit
would additionally require independent verification of the resulting
implementation; metadata counts alone cannot establish it.
