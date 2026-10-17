# DllPssAssistPower analysis blocker

## Scope and provenance

- Role: analysis/specification only, scoped to `cro/DllPssAssistPower`.
- Date: 2026-10-17.
- Repository baseline: `0d717b2323492917066f8d1b87596618ed5de196`.
- Target: Pokémon Alpha Sapphire, Europe, `AS_EUR_REV2`, card revision 2,
  title version 3120, product code `CTR-P-ECLA`, title ID
  `000400000011C500`. These are existing repository metadata, not newly
  verified target observations.
- Tools used: Git 2.53.0, Node.js v24.21.0, npm 11.19.0, ripgrep 15.2.0,
  GNU Bash 5.3.9(1)-release; repository safety check via `npm run check:clean`.

The audit read the complete [clean-room protocol](../../CLEAN_ROOM.md),
`docs/specs/README.md`, `CONTRIBUTING.md`, `docs/PROVENANCE.md`,
`docs/CRO_UNITS.md`, `docs/CRO_TARGET_OBJECTS.md`, and `docs/TOOLCHAIN.md`.
Target identity came from `config/targets/AS_EUR_REV2.json`; unit identity
came from `progress/units/AS_EUR_REV2.cro.json`. Only neutral registry
structure/counts and report measures/completion status were selected from
`config/cro-sources.json` and `progress/reports/AS_EUR_REV2/report.json`.
Tracked filenames, relevant commit subjects, and the headings of
`docs/specs/cro/contract_09.md` were inspected. Existing blocker/quarantine
notes for DllGameSync, DllGift, and DllContestOhirome supplied documentation
conventions only. Package scripts and the safety/pre-commit scripts were
examined to identify the required check.

No external public source was consulted and no target behavior was observed.
No ROM, CRO, extracted asset, ignored target input, private path, disassembly,
instruction schedule, register/offset/relocation ledger, proprietary source,
or target-derived implementation aid was inspected or used as research
evidence. Legacy implementation contents and contract details were not read
or used to reconstruct behavior.

## Permitted findings and limits

The public manifest identifies the permanent unit as `cro/DllPssAssistPower`,
with container size 28,672 bytes and SHA-256
`070e8dd5bd31da10232e8d261d860c3089a3dcc609d59ce74ad1ed07e2ba5921`.
This establishes identity, not a callable interface or behavioral contract.

The registry contains one source entry and one function claim for this unit;
the tracked source filename is `src/cro/DllPssAssistPower/contract_09.S`.
The baseline report records one matched function out of eight and 240 matched
code bytes out of 3,468, with `metadata.complete=false`. These are historical
publication claims, not independently validated results of this analysis.
The source, its semantics, and the provenance of that credit were not
adjudicated here; no quarantine finding is asserted from filename alone.

The evidence admitted to this audit supplies no independently observed
function inputs, outputs, side effects, state transitions, dependency
contracts, ownership/lifetime rules, or failure behavior. The module name and
structural metadata cannot establish those facts. No testable behavioral
specification can therefore be authored from this evidence.

## Handoff boundary

**Blocked: an implementer may not proceed from this document.** A separate
reviewed neutral specification must first establish interface facts and
testable behavior, with permitted observation/public-source provenance and
the applicable target revision. A distinct implementation contributor may
then work from that specification.

This analysis grants **zero match credit**, supplies no implementation or
validator, and makes no new or renewed claim for the historical match.
Existing source and aggregate reports are unchanged; the unit remains
incomplete. This document is a scoped evidence blocker, not an approved
behavioral specification.
