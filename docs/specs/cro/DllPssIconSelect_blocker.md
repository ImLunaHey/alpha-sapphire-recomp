# DllPssIconSelect clean-room blocker

## Scope and provenance

This public-evidence audit covers `cro/DllPssIconSelect` for the intended
Pokémon Alpha Sapphire target `AS_EUR_REV2`. The audit was performed on
2026-10-17 against public baseline commit
`e0620ab8a5ea7f465b6876463e0b49cf2ddb5505`, then reassessed after the central
publication-integrity gate merged. The target revision was not independently
verified.

The audit read `docs/CLEAN_ROOM.md` in full and consulted only tracked policy,
public manifests, neutral inventories and partitions, publication reports,
source-registration metadata, validation infrastructure, and Git metadata.
The tools were Node.js 24.21.0, npm 11.19.0, Git 2.53.0, ripgrep 15.2.0, and
GNU Bash 5.3.9. Existing implementation bodies were not used to infer
behavior.

No ROM, CRO, extracted asset, target object, proprietary or leaked source,
private configuration or path, disassembly, instruction schedule,
register/offset/relocation ledger, or target-derived implementation aid was
opened or used. Checked-in neutral boundary metadata was treated only as a
publication record, never as a behavioral specification.

## Repository state

The repository already contains an incomplete publication for this unit, but
the permitted evidence does not establish its behavior. This audit adds no
implementation, match credit, data reconstruction, or completion claim and
does not change existing source, configuration, reports, or project progress.

## Publication-integrity audit

An independent audit found that the original unit validator did not protect
unrelated publication identities or claims. The central publication-integrity
gate now owns those repository-wide checks, including evidence binding and
coordinated-mutation rejection. No unit validator or lifecycle wiring is
warranted: either would duplicate the central gate without establishing
behavior or earning credit.

## Missing behavioral evidence

The permitted evidence does not establish an independently approved
behavioral or interface contract. Inputs, outputs, lifecycle, ownership,
selection rules, state transitions, dependencies, confirmation and
cancellation behavior, persistence, and failure handling remain unknown. The
module name and existing publication claim cannot establish those facts.

## Blocker and exit criteria

Implementation remains blocked pending a separately reviewed analysis-role
handoff that states independently supported observable behavior and neutral
interface facts, including sources, observation method, date, tools, revision
qualification, and explicit unknowns. A distinct implementation contributor
may then write original target code using only that approved contract.

## Role separation and review disposition

The clean-room analyst role prepared this public-evidence record and did not
perform implementation work. A distinct coordinator-review role independently
reviewed the record for permitted evidence, provenance, and scope; it did not
supply behavioral facts or implementation guidance.

The reviewer disposition is **blocked**: there is no approved behavioral
handoff, no implementation is authorized from this record, and no new match
credit is supported. Any future implementer must remain separate from both the
analyst and reviewer roles and may work only from a later approved handoff.

Publication may claim additional match credit or completion only after the
repository's approved deterministic comparison and publication gates pass.
Until then, this document grants no new credit and must not be used as
behavioral evidence or match proof.

## Evidence consulted

- `docs/CLEAN_ROOM.md`, `CONTRIBUTING.md`, `docs/specs/README.md`,
  `docs/PROVENANCE.md`, `docs/CRO_UNITS.md`, `docs/CRO_TARGET_OBJECTS.md`, and
  `docs/CRO_TARGET_BATCH.md`.
- The tracked public CRO manifest, neutral function inventory and partition,
  checked-in objdiff report, project progress, and source registry.
- Existing hardened per-unit validators and blocker documents as validation
  and writing precedents, plus tracked Git status and commit metadata.
