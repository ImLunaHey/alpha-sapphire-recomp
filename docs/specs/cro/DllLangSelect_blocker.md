# DllLangSelect publication blocker

## Scope and provenance

This analysis-only public-evidence audit covers `cro/DllLangSelect` for the
intended Pokémon Alpha Sapphire target `AS_EUR_REV2`. It was prepared on
2026-10-17 from repository base
`734779d6819e24ba882999e1dc108d72095a1340`. The target revision was not
independently verified.

The analysis role read `docs/CLEAN_ROOM.md` in full and consulted only tracked
policy, build/publication metadata, aggregate report fields, documentation
precedents, and Git commit metadata and statistics. The audit used Node.js
24.21.0, npm 11.19.0, Git 2.53.0, ripgrep 15.2.0, and Bash 5.3.9. It did not
inspect historical source patches.

No ROM, extracted asset, target object, proprietary or leaked source, private
configuration, disassembly, target-derived instruction schedule,
register/offset/relocation ledger, or target-derived implementation aid was
opened or used. In particular, the analysis role did not open the unit
assembly, function CSV, partition contents, shared contract-09 contents,
proposal contents, or contract-09 validator contents.

## Public metadata baseline

Tracked publication metadata records one ARM source claim and one claimed
function for this unit. The published report records seven accepted functions,
2,244 total code bytes, one matched function, 168 matched code bytes, and 1,456
data bytes. It marks the unit incomplete. These values are a frozen publication
baseline for this blocker; they are not newly verified target facts and do not
certify the existing claim's provenance.

No new implementation, match credit, data reconstruction, or completion claim
follows from this document. This contribution leaves the existing source,
inventories, partitions, report, and project progress unchanged.

## Missing behavioral evidence

The permitted evidence does not establish an independently approved behavioral
or interface contract. Inputs, return values, lifecycle, state transitions,
ownership, dependencies, language identifiers, confirmation and cancellation
behavior, persistence, and error handling remain unknown. The module name and
existing match claim cannot supply those facts.

## Blocker and exit criteria

Implementation remains blocked pending a reviewed analysis-role handoff that
states independently supported observable behavior and neutral interface facts,
including sources, observation method, date, tools, revision qualification,
and explicit unknowns. A distinct implementation role may then write original
source using only that approved contract.

Publication may claim additional match credit or completion only after the
repository's deterministic comparison proves the relevant base and target
objects byte-identical and all aggregate report gates pass. Until those
conditions are met, this note must not be treated as behavior evidence or match
proof.

## Evidence consulted

- `docs/CLEAN_ROOM.md`, `CONTRIBUTING.md`, `docs/specs/README.md`,
  `docs/PROVENANCE.md`, `docs/CRO_UNITS.md`, `docs/CRO_TARGET_OBJECTS.md`, and
  `docs/CRO_TARGET_BATCH.md`.
- Selected fields from `config/cro-sources.json`, the public unit manifest,
  `progress/project.json`, and the aggregate published report.
- Public build and validation infrastructure, including the no-ROM check,
  public-metadata validation, CRO base build, report preparation, and objdiff
  configuration gates.
- Existing blocker documents as writing precedents, plus tracked-path, status,
  and commit metadata/statistics from Git.
