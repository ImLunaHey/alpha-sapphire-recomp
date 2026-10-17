# DllUSGymFlight: clean-room evidence blocker

Date: 2026-10-17

Role: ANALYST; documentation only

Review status: PENDING/UNASSIGNED. No distinct reviewer identity or durable
review record is present in this commit, the reviewed contract commit, Git
notes, or an associated public pull request. This document does not claim
independent reviewer approval.

Unit: `cro/DllUSGymFlight`

Target identity: `AS_EUR_REV2` (European Pokemon Alpha Sapphire, revision 2),
as identified by repository metadata; no target image was inspected.

Repository baseline: `55f3122f3e8ff83698a40805c4046e52545fb830`

## Decision and scope

**NO-GO for a new independent implementation from the evidence reviewed.**
No new implementable behavioral contract is established for this unit. This
is a status document, not an implementation specification or approval of
existing source. It neither withdraws nor revalidates contract 08.

The existing published report credits `func_00000FA4`: one function and 152
matched code bytes. The unit remains incomplete, with no matched data or
completed-unit credit. This audit changes none of that accounting and makes no
new ByteMatch claim.

## Provenance and allowed evidence

The audit used only repository-authored policy, public documentation, neutral
metadata, and public repository history at the baseline above. Tools were Git
2.53.0, Node.js v24.21.0, npm 11.19.0, GitHub CLI 2.102.0, ripgrep 15.2.0, and
GNU Bash 5.3.9. No target observation or target-analysis tool was used; there
is no independently observed runtime behavior to report.

- `docs/CLEAN_ROOM.md` and `docs/specs/README.md`: role separation,
  provenance, review, exclusion, and specification requirements.
- `README.md`, `docs/PROVENANCE.md`, and `docs/CRO_UNITS.md`: declared target
  identity and the limitations of neutral inventories and publication data.
- `progress/units/AS_EUR_REV2.cro.json`: a 49,152-byte published CRO identity.
  Size and identity do not establish behavior.
- `symbols/cro/DllUSGymFlight.csv`: nine provisional ARM function entries
  totaling 3,728 bytes, with synthetic location-based names and no callable
  interface or behavioral observations.
- `symbols/cro-partitions/DllUSGymFlight.json`: a complete structural text
  partition. Gaps, pools, and unknown ranges are accounting categories, not
  implementation requirements.
- `config/cro-sources.json` and `config/cro-contract-08-proposal.json`: source
  ownership metadata for the existing 152-byte contract-08 claim. Existing
  implementation source was not opened.
- `docs/specs/cro/contract_08.md`: a shared batch-level status document that
  labels this function as interpolation and records exact-match accounting.
  It does not give this unit a signature, input domains, state model,
  observable examples, or unit-specific acceptance criteria. Its matching
  claim was not independently checked or used to infer behavior.
- `progress/reports/AS_EUR_REV2/report.json`: the checked-in objdiff snapshot,
  used only to record the published baseline below.

A filename and content search of tracked public documentation found no other
unit-specific specification. Public issue and pull-request search found no
`DllUSGymFlight` review or handoff. The contract-08 integration commit has no
Git note and no associated public pull request in the reviewed repository.

## Published baseline and missing interface

The checked-in report records 3,728 accepted code bytes across nine functions,
of which 152 bytes and one function are matched. It reports 28,028 data bytes,
no matched-data percentage, `metadata.complete: false`, and source ownership
at `src/cro/DllUSGymFlight`. The project aggregate records 416,672 of 3,719,620
code bytes and 4,255 of 14,840 functions matched, with no complete-unit count.

These are publication and comparison facts, not behavioral evidence. They do
not specify parameter or result types, object ownership or layout, valid input
domains, interpolation state or rounding rules, memory effects, external
dependencies, error behavior, or completion conditions. The module name and a
short semantic label cannot select those facts. Nor can the layouts of nearby
functions or pools be used as an implementation contract.

Consequently, an implementer cannot extend this unit or independently recreate
the credited function without guessing or consulting evidence excluded from
this assignment. Implementation must stop at the existing published baseline
under this audit's evidence boundary. This conclusion concerns the evidence
reviewed here, not whether lawful evidence could be produced later.

## Explicit exclusions

No ROM, CRO binary, extracted asset, target object, target byte, disassembly,
decompiler output, proprietary SDK material, leaked source, private artifact,
credential, generated target content, or private comparison output was
inspected. No implementation under `src/cro/DllUSGymFlight` was opened. No
extraction, target build, local report generation, objdiff, or reverse-
engineering tool was run. The contract validator and its instruction schedule
were not treated as behavioral evidence. No implementation, validator, build
configuration, inventory, partition, progress report, or shared specification
is changed by this document.

## Evidence required to unblock

Further implementation requires a distinct analysis contributor to publish a
neutral, reproducible behavioral specification attributable to this unit and
the verified target revision. It must record the observer, date, source or
tool versions, initial conditions, stimuli, externally observable results,
relevant boundary and failure cases, repeatability, and unresolved uncertainty.
It must define enough interface and state ownership for behavior-based tests
without exposing target bytes, physical instruction schedules, relocations,
or other target-derived implementation aids.

After independent clean-room review, a separate target-blind implementer may
write original code solely from that approved specification. Any additional
credit then requires the pinned build, focused semantic checks, and an
authoritative deterministic objdiff/report comparison. Until that handoff is
complete, retain the existing incomplete publication state and authorize no
new implementation from inventory, layout, naming, or contract-08 match data.
