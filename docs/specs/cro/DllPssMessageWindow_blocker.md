# DllPssMessageWindow provenance blocker

Audit date: 2026-10-17.

This implementation-role withdrawal record covers `cro/DllPssMessageWindow`
and applies the provenance requirements in `docs/CLEAN_ROOM.md`. The intended
repository target is `AS_EUR_REV2` (Pokémon Alpha Sapphire, European revision
2). That identifier records the project's intended comparison target; it does
not claim that the auditor, reviewer, or target-blind implementer possessed or
accessed the target.

## Public baseline

The audit began from the requested public repository baseline
`d35ca78d30e12985bcdd12105d8391d6a7e42543` and is currently reconciled with
public `main` at `5696432c6d5a2c815b50470ec3c32b7c49d20d18`.
`config/cro-sources.json` contains no source ownership entry for this unit.
The tracked report at `progress/reports/AS_EUR_REV2/report.json` retains its
neutral inventory, omits source metadata, grants no match credit, and marks the
unit incomplete. This is the exact public publication state; this prose does
not reproduce target-derived identities, sizes, addresses, layout, or hashes.

## Roles and method

- The analysis role (`analysis-r1`) inspected only public repository history,
  documentation, configuration, and tracked publication metadata. It found no
  independently authored unit-specific behavioral observations suitable for a
  clean-room handoff.
- The specification-review role (`specification-r1`) independently checked the
  proposed evidence against `docs/CLEAN_ROOM.md`. It approved no behavioral or
  interface specification and supplied no target-derived facts.
- The target-blind implementation role (Luna) used only those public findings
  to remove the unsupported source and ownership claim, preserve neutral
  inventory, and regenerate public accounting. It did not consult a target,
  disassembly, extracted artifact, copied bytes, or proprietary source.
- A separate read-only review role checked the resulting diff, role separation,
  public accounting, repository boundary, and validation results. It did not
  implement the change or supply behavioral facts.

The audit used Git 2.53.0, Node.js 24.21.0, npm 11.19.0, and Nix 2.31.3. The
deterministic public build used Arm GNU Toolchain 14.2.Rel1 and GNU Binutils
2.44. Repository validation used the checked-in build, store-family,
publication-integrity, report-preparation, and no-ROM scripts. These tools were
used against public source and generated base objects only; no private target
comparison was run.

The available public evidence lacks unit-specific strict two-party provenance:
a reviewed behavioral and interface specification from a separate analysis
contributor, followed by an independent implementation handoff. This is a
provenance gap and makes no allegation of copying. The source and its ownership
entry are withdrawn without reproducing their implementation content here.

The public report withdraws the provisional match credit. The neutral inventory
is retained, and the unit remains blocked and explicitly incomplete. No new
implementation, full-link, or fresh authoritative target-comparison claim is
made. No private verification input was accessed.

Future work requires a separate analysis contributor to provide a reviewed,
unit-specific specification recording target revision, observation date,
tools and versions, evidence provenance, and approved behavioral and interface
facts. The specification must define inputs, outputs, state changes, side
effects, collaborator contracts, and error behavior without embedding
proprietary content. Neutral inventory boundaries alone do not authorize an
implementation.

A distinct implementation contributor must receive that approved specification
and write original source solely from the handoff, recording both roles and
the specification reference. Any restored credit requires the pinned
deterministic build and focused and aggregate publication gates. Whole-unit
or full-link claims additionally require authorized authoritative comparison
covering the complete unit and any unknown residue. Those comparison inputs
are unavailable for this withdrawal; implementation remains blocked
pending the evidence and handoff.
