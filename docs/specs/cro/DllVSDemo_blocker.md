# DllVSDemo: clean-room evidence blocker

Date: 2026-10-18

Role: ANALYST; documentation only

Review status: PENDING/UNASSIGNED. No distinct reviewer identity or durable
review record was found in the reviewed commit, Git notes, or associated public
pull requests. This document does not claim independent reviewer approval.

Unit: `cro/DllVSDemo`

Target identity: `AS_EUR_REV2` (European Pokemon Alpha Sapphire, revision 2),
as identified by repository metadata; no target image was inspected.

Repository baseline: `90b150fc03ef247e5d0b114a87000c0fbf291fbe`

## Decision and scope

**NO-GO for additional implementation from the evidence reviewed.** The public
repository does not contain an approved, provenance-bearing, unit-specific
behavioral specification for the five uncredited functions or the unit data.
This is a stop record, not an implementation specification, approval of
existing source, or reason to infer behavior from structural metadata.

The checked-in report already credits `func_000018A8`: one 64-byte function.
This audit neither withdraws nor independently revalidates that contract-06
claim. It adds no source, accepted boundary, matched byte, matched function,
data credit, or completed-unit credit.

## Provenance and allowed evidence

This audit used only tracked public repository material, public repository
history, and public GitHub metadata. Tools were Git 2.53.0, Node.js v24.21.0,
npm 11.19.0, GitHub CLI 2.102.0, ripgrep 15.2.0, and GNU Bash 5.3.9. The
ignored `.env.local` file was absent, and `ROM_PATH` and `DECOMP_PRIVATE` were
unset. No target observation or target-analysis tool was used.

- `docs/CLEAN_ROOM.md` and `docs/specs/README.md` define the role-separation,
  provenance, review, and implementation-handoff requirements.
- `docs/PROVENANCE.md`, `docs/CRO_UNITS.md`, and
  `config/publication-units.json` establish the declared revision and the
  distinction between a genuine published link unit and decompilation credit.
- `progress/units/AS_EUR_REV2.cro.json` records a 24,576-byte container
  identity. Container size and identity do not establish program behavior.
- `symbols/cro/DllVSDemo.csv` records six provisional ARM function boundaries
  totaling 1,096 bytes. The names are location-based and convey no callable
  interface or behavior.
- `symbols/cro-partitions/DllVSDemo.json` partitions the 11,168-byte text
  range into accepted functions, gaps, pools, and unknown ranges. Those are
  structural accounting categories, not implementation requirements.
- `config/cro-sources.json`, `config/cro-contract-06-proposal.json`,
  `src/cro/DllVSDemo/contract_06.S`, and
  `scripts/validate-cro-contract-06.mjs` register and validate the existing
  64-byte claim. The public implementation and validator were inspected only
  to delimit existing ownership; they were not treated as independent
  behavioral evidence or as a recipe for further source.
- `docs/specs/cro/contract_06.md` is a batch-level status record. It describes
  the credited function only as placement, reports an exact private
  comparison, and says the batch was independently specified, but it records
  no DllVSDemo observer, observation date or method, target-independent
  interface, input domains, state model, examples, boundary behavior, or
  separate review approval.
- `progress/reports/AS_EUR_REV2/report.json` supplies the published accounting
  baseline below. It is comparison output, not evidence of application
  behavior.

The contract-06 source and documentation entered public history in commit
`bbd52f570df47d7877863726d353d17cb87a6d7c`. That commit has no Git note and
GitHub reports no associated public pull request. Exact-name searches found no
other public issue, pull request, or tracked DllVSDemo specification.

## Published baseline and evidence gap

The checked-in report records 1,096 accepted code bytes across six functions:
64 matched bytes and one matched function, or 5.839416% code and 16.666668%
functions. It records 2,300 data bytes without matched-data credit, marks the
unit `complete: false`, and assigns source ownership to
`src/cro/DllVSDemo`. Project-wide accounting remains authoritative in the
machine-generated report and is intentionally not duplicated here.

These figures preserve honest publication accounting, but they do not specify
parameter or result types, valid inputs, object ownership or layout, lifecycle
state, observable side effects, dependencies, error behavior, or completion
conditions. The module name, provisional boundaries, neighboring layout,
assembly body, validator instruction schedule, and short semantic label cannot
fill those gaps under the clean-room policy. Exact matching can validate an
authorized implementation; it cannot retroactively supply its behavioral
contract or provenance.

Implementing any of the five remaining functions, claiming unit data, or
claiming a fully linked unit from this evidence would therefore require
guessing or crossing the assigned evidence boundary. Work must stop at the
existing incomplete baseline until the required independent handoff exists.

## Explicit exclusions

No ROM, CRO binary, extracted asset, target object, target byte, disassembly,
decompiler output, private comparison output, analysis database, proprietary
SDK material, leaked or copied implementation, credential, generated target
content, or private artifact path was inspected. No extraction, target build,
local target report, objdiff comparison, or reverse-engineering tool was run.
No existing implementation, validator, manifest, inventory, partition,
progress report, or shared contract is changed by this audit.

## Evidence required to unblock

A distinct analysis contributor must publish a neutral, reproducible,
unit-specific behavioral specification attributable to the verified target
revision. It must identify the observer, date, lawful evidence or observation
method and tool versions; define the callable interface and owned state; state
initial conditions and stimuli; record externally observable results,
side effects, relevant boundary and failure cases, repeatability, and remaining
uncertainty; and exclude target bytes, instruction schedules, relocations, and
other target-derived implementation aids.

After independent clean-room review, a separate target-blind implementer may
write original code using only that approved specification and public platform
documentation. Any new credit then requires focused semantic checks, the
pinned build, and an authoritative deterministic objdiff/report comparison.
Until then, retain the current incomplete publication state and authorize no
additional implementation or completion claim for `cro/DllVSDemo`.
