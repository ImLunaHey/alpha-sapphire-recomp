# DllTrialDownload clean-room evidence blocker

## Disposition and scope

**Documentation-only analysis; further implementation blocked.** This record
covers exactly `cro/DllTrialDownload`. It is not an approved behavioral
specification, implementation recipe, provenance clearance, or new match claim.
The inspected repository evidence supports no new neutral behavioral contract
beyond the already-recorded generic POD claim.

- Durable role record: analyst-only evidence assessment. This repository
  artifact does not identify a distinct independent reviewer or target-blind
  implementer, and it records no approval by either role. Review and any
  implementation assignment remain pending/unassigned.
- Observation date: **2026-10-17** (Europe/London).
- Repository branch: `unit/cro-dll-trial-download`.
- Immutable evidence-analysis snapshot:
  `72566e063d8082ddbb6a8fe8d50d986ebed47557`.
- Integration/publication base: `main` commit
  `74c70fba232439e80e0c7d90bfb57d0094b5ceb7`. The blocker is committed on top
  of that base and proposed by pull request 105. This later integration state
  does not retroactively change the snapshot on which the evidence analysis
  was performed.
- Declared target: Pokémon Alpha Sapphire, Europe revision 2,
  `AS_EUR_REV2`, as stated in `README.md`, `docs/PROVENANCE.md`, and
  `config/targets/AS_EUR_REV2.json`.
- Verification boundary: the branch and commit were checked with Git. The
  target revision, image identity, module identity, and historical match were
  **not independently verified**. Committed target identifiers and hashes are
  declarations from repository metadata, not observations made by this analyst.

`docs/CLEAN_ROOM.md` was read fully before any other task action. This review
uses no leaked source or proprietary SDK material. No target behavior was
observed, and no target-facing operation was performed.

## Evidence-analysis methods and tools

This section records the immutable evidence-analysis phase at
`72566e063d8082ddbb6a8fe8d50d986ebed47557`, not the later integration and
publication work. The method was local text inspection, filename discovery,
path-scoped Git history metadata, and selective parsing of committed public
accounting. Tools used in that phase were:

- Git **2.53.0**: `status --short --branch`, `rev-parse HEAD`,
  `branch --show-current`, `ls-files`, and `log` with commit identities,
  dates, subjects, and the initial bulk commit's message body. No historical
  source patch or historical artifact was opened.
- ripgrep **15.2.0**: `rg --files` for documentation/instruction-file discovery,
  exact-name `rg -n -F DllTrialDownload` searches in `README.md`, `docs/`,
  the source registry, and the public unit manifest; filename filtering for
  trial/download/POD and instruction-file names in tracked source, script, and
  specification paths.
- Node.js **v24.21.0**: inline `node:fs`/`JSON.parse` queries selecting the
  unit's manifest, source-registry, and report records, and summing the public
  partition's category counts and sizes. No repository script was executed
  during the evidence-analysis phase.
- GNU Bash **5.3.9(1)-release** and GNU coreutils **9.10** (`cat`, `sort`):
  shell orchestration, policy/document reads, and filename sorting.
- Codex harness `exec_command` and `apply_patch`: command transport and the
  documentation edit. Their interface build/version was not exposed and is
  not invented here. The analyst's initial document check used
  `git diff --no-index --check -- /dev/null docs/specs/cro/DllTrialDownload_blocker.md`
  and working-tree status to confirm document whitespace and change scope.

Applicable `AGENTS.md` paths in the checkout's ancestry and documentation tree
were checked; none was found. No external website, search result, or public
manual was consulted. This is a bounded repository-evidence conclusion, not a
claim that no lawful evidence can exist elsewhere. Tool pins read from
`config/tools.json` were metadata only; those target tools were not invoked.

## Inspected evidence

The following records were read or searched; their evidentiary limits matter:

- `docs/CLEAN_ROOM.md`, `docs/specs/README.md`, `CONTRIBUTING.md`, and
  `.github/pull_request_template.md`: role separation, reviewed-specification
  requirement, contribution provenance, and validation conventions.
- `README.md`, `docs/PROVENANCE.md`, `config/targets/AS_EUR_REV2.json`, and
  `config/tools.json`: declared target and tooling provenance only.
- `docs/CRO_UNITS.md`, `docs/BYTEMATCH.md`, `docs/CRO_TARGET_OBJECTS.md`, and
  `docs/CRO_TARGET_BATCH.md`: public workflow and the distinction between
  structural publication, partial matching, and completion. Commands in those
  documents were not executed; their historical target observations were not
  adopted as fresh observations.
- `docs/specs/cro/pod_leaves_01.md`: the existing shared generic POD behavior
  note, which claims reviewed record-initialization/copy forms across a batch.
  It supplies no new unit-specific observation record for this task.
- `config/cro-sources.json`: only the DllTrialDownload record was selected for
  claim accounting. `progress/units/AS_EUR_REV2.cro.json` and
  `progress/reports/AS_EUR_REV2/report.json`: only the unit's public identity,
  sizes, totals, function-credit fields, and completion/source-path metadata
  were selected. These are published claims, not independent behavioral proof.
- `symbols/cro-partitions/DllTrialDownload.json`: aggregate category counts
  and sizes only. No instruction, relocation, or semantic ledger was consulted.
- Existing blocker conventions in `DllTownmap_blocker.md`,
  `DllPuzzle_blocker.md`, `DllSangoZukan_blocker.md`,
  `DllSangoStaffroll_blocker.md`, `DllGameSync_blocker.md`,
  `DllGift_blocker.md`, and `DllHologramMail_blocker.md` under this directory.
  Their findings about other units are not evidence about this unit.

Filename discovery and Git metadata identify the existing claimed source as
`src/cro/DllTrialDownload/pod_leaves.S`. **Its contents were deliberately not
opened.** Source presence is a checkout fact, not independent behavior evidence.
No validator implementation or symbol CSV was opened. Documentation searches
found no DllTrialDownload-specific behavioral handoff at the stated baseline.

## Existing claim and public status

The source registry already claims one ARM function, `func_00006F28`, of
20 bytes, with semantic label `pod-zero-two-words-halfword`, owned by the
existing POD source. The synthetic name and semantic label are reported only
to identify the existing claim; neither is a newly verified address, ABI,
object layout, or behavior requirement.

The shared POD note describes generic small-record initialization/copy
behavior. Its batch-level assertions do not independently establish this
unit's object identity, valid extent and lifetime, callers, input domain,
observable effects, or error behavior. This audit neither expands that note
nor independently confirms its original analysis or review provenance.

The tracked report records one matched function out of 20 and 20 matched code
bytes out of 8,380 accepted function bytes: 5% of functions and approximately
0.2386635% of code. It records 3,252 data bytes without matched-data credit and
keeps `metadata.complete=false`. These are statements about the public
snapshot, not a fresh comparison or proof of full-unit coverage.

For context, the public partition accounts for 28,696 text bytes as 20 accepted
functions totaling 8,380 bytes, 217 gaps totaling 18,828 bytes, 229 pools
totaling 1,312 bytes, and five unknown ranges totaling 176 bytes. These sums
are structural bookkeeping; they do not authorize behavior for any range.
The manifest's 45,056-byte container extent is not a decompiled-code total.

Path-scoped Git metadata shows the claimed source and original shared POD note
entering in `7b14dec86f268f5fc974cfb4e36a8361fd31639f`, dated 2026-10-17,
with subject `feat: match 196-function multi-unit wave`. The note later changed
in `7a2d74405ae4c48c7d569443e88cd09cb9c54a21` for the DllGift quarantine.
The initial commit message and inspected documents supply no additional
unit-specific observation-to-reviewed-contract handoff. This is an evidence
limit, not an allegation of prohibited copying.

This contribution preserves all existing source, ownership, reporting, and
credit without endorsing or renewing them. It awards no new credit and makes
no match, full-link, completion, or clean-room implementation certification.

## Missing evidence and required future handoff

There is no independently established additional contract in the reviewed
material. Module naming, generic POD forms, anonymous boundaries, aggregate
sizes, and historical matching cannot establish downloading behavior or any
other module responsibility. No such responsibility is assumed here.

Before further implementation, a separately authorized analyst must supply
lawful, unit-attributable evidence and a neutral specification covering:

- The actual interfaces and attributable observations, valid input domains,
  output/return behavior, and object extent, ownership, and lifetime rules.
- Observable state transitions, affected and unaffected state, dependencies,
  persistence or other side effects, and lifecycle/timing where evidenced.
- Supported boundary, cancellation, and failure behavior; unresolved cases
  must remain explicit instead of acquiring invented defaults.
- Any required data semantics and coverage limits, distinguishing observations
  from assumptions and explaining their attribution to this unit and revision.
- Evidence origin, lawful provenance, observation date and conditions, target
  declaration versus actual verification, exact methods/tools/versions, and
  independent review and approval of the resulting contract.

A distinct target-blind implementer may then write original source from the
approved handoff. It must contain no target bytes, instruction schedules,
register/offset/relocation recipes, proprietary content, or copied source.
Existing source cannot substitute for that handoff. This analyst remains
analyst-only. If later review establishes suspect or unclear provenance, apply
the clean-room stop/quarantine procedure in a separately authorized scope;
this blocker neither clears nor rewrites existing material.

## Publication status, validation, and exclusions

This blocker is committed and proposed in pull request 105. The contribution
changes only `docs/specs/cro/DllTrialDownload_blocker.md`; source, tests,
configuration, public reports, and match credit are unchanged. Its scoped
Conventional Commit title is `docs(cro): document DllTrialDownload blocker`.
The commit is authored and committed by `luna <luna@wvvw.me>`.

The following ROM-free integration checks were performed successfully on
2026-10-17. The full build and validation run preceded the final rebase by one
documentation-only `main` commits; those commits added only other units'
blocker documents and changed no source, configuration, tooling, or validation
input.
After rebasing onto the integration/publication base above, the clean/no-ROM
boundary suite and diff/scope checks were rerun successfully:

- The repository-pinned Nix toolchain built the clean-room base with
  `npm run base:build`. Two complete builds produced identical SHA-256 values:
  `05e44991d497e984a6ea9a60cf238853d57f7520a446e943f1a1e195fce057bf`
  for the ignored `DllTrialDownload.o` base object and
  `06df651299142290902928ce6e5dd0c14001c0ebc1df696ad9e4c1a99567f215`
  for the ignored aggregate `code.o` base object.
- `npm run check` passed with the pinned GNU Arm toolchain and binutils on
  `PATH`. This includes the repository no-ROM check, publication-integrity
  checks, source and boundary validators, and hostile synthetic fixtures.
- `scripts/validate-cro-pod-leaves.mjs` checked the built base object set with
  the pinned `arm-none-eabi-readelf` and `arm-none-eabi-objdump`: 28 existing
  POD leaves, 528 bytes, and 132 instructions passed. This preserves the
  pre-existing shared claim and creates no new DllTrialDownload credit.
- `scripts/test-prepare-bytematch-report.mjs` and `npm run report` passed using
  the checked-in public report and freshly built clean-room base objects. They
  did not perform a private target comparison or update the tracked report.
- `git diff --check`, one-file change-scope inspection, clean working-tree
  status, commit identity inspection, and main-ancestry checks passed.

These integration checks validate repository consistency and deterministic
base output only. They are not independent behavioral evidence, a target
comparison, reviewer approval, or authorization to implement more of the unit.
Fresh CI and report artifacts are required for the exact amended PR head;
earlier-head CI results do not satisfy that publication gate.

A future implementation requires independent approval of the missing neutral
contract and provenance before coding. Tests must derive their expected
behavior from that evidence, preferably with synthetic fixtures, rather than
mirror existing source. Whole-unit completion additionally requires separately
authorized verification of complete target/base object identity and the
repository's publication gates, covering code, data, relocations, layout, and
unknown residue. No such check is performed or authorized by this record.

Deliberately excluded: `ROM_PATH` values or configuration inspection; ROMs and
containers; extracted CROs or assets; private paths and target bytes; generated
target objects; disassembly; Ghidra databases, output, or analysis scripts;
proprietary SDK or leaked material; raw instruction schedules and other
target-derived implementation aids. No environment/availability probe,
extraction, target execution, private objdiff/bytematch comparison, or
target-facing validator was run. Compilation produced only ignored clean-room
base objects used by the ROM-free checks recorded above. The conclusion remains
**blocked pending evidence**, with independent review and implementation roles
unassigned, the existing generic POD claim unchanged, and the unit incomplete.
