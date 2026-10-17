# DllUSGymWater clean-room evidence blocker

`cro/DllUSGymWater` is a published ByteMatch unit, but the reviewed public
evidence does not provide a behavioral specification from which a separate
implementer can write original code. This documentation-only,
implementation-side audit records that stop condition. It is not target-aware
analysis, a behavioral contract, or approval to implement.

## Provenance and method

- Review date: 2026-10-17, Europe/London (BST, UTC+01:00).
- Repository baseline: `55f3122f3e8ff83698a40805c4046e52545fb830`.
- Declared target: Pokemon Alpha Sapphire `AS_EUR_REV2` (Europe, revision 2),
  as recorded in [repository provenance](../../PROVENANCE.md). The target was
  not inspected or executed for this audit.
- Tools: Git 2.53.0, Node.js v24.21.0, npm 11.19.0, GitHub CLI 2.102.0,
  ripgrep 15.2.0, and GNU Bash 5.3.9.
- Method: read the [clean-room policy](../../CLEAN_ROOM.md),
  [specification policy](../README.md), and
  [CRO publication rules](../../CRO_UNITS.md); then inspect only tracked public
  unit metadata, neutral inventories, source registration, the checked-in
  aggregate report, repository paths and history, and public repository issues
  and pull requests for the exact unit name.

No ROM, CRO binary, extracted asset, private target byte or object,
disassembly, decompiler output, analysis database, private comparison output
or path, proprietary SDK or source, leaked source, credential, or other private
artifact was inspected or reproduced. Nothing in this audit was copied from
proprietary source.

## Published evidence and limits

- The public CRO manifest identifies `cro/DllUSGymWater` as a 20,480-byte unit
  for the declared target. This establishes identity and a link boundary, not
  behavior.
- The neutral symbol inventory records three provisional ARM function
  boundaries: `func_00001784` (240 bytes), `func_00001878` (724 bytes), and
  `func_0000204C` (320 bytes). The complete text partition records structural
  gaps, pools, and unknown regions. Neither file supplies semantic names,
  declarations, instructions, or behavioral contracts.
- `config/cro-sources.json` has no entry for this unit, and there is no tracked
  `src/cro/DllUSGymWater` directory. No unit-specific reviewed specification,
  authored source, implementation history, public issue, or public pull request
  was found.
- The checked-in objdiff report publishes all three provisional functions but
  no source path or match credit and marks the unit `complete: false`. It
  accounts for 1,284 accepted code bytes and 1,620 data bytes while leaving the
  unit incomplete.
- At the audited baseline, the aggregate report records 416,672 of 3,719,620
  matched code bytes, 4,255 of 14,840 matched functions, 146 published units,
  and zero complete units. This audit changes none of those values.

These facts are sufficient to preserve deterministic publication and an honest
unimplemented baseline. They do not establish callable interfaces, parameter
or result types, valid inputs, ownership or object layout, state transitions,
memory effects, dependencies, error behavior, or termination rules. The module
name, provisional boundaries, and structural partition cannot supply those
missing semantics. Evidence from similarly named gym or water units cannot be
transferred to this distinct link unit.

## Stop condition and required handoff

Writing source now would require inventing both interfaces and behavior. Do not
add a source skeleton, source registration, validator, match credit, or
completion claim for this unit from the evidence reviewed here.

Further implementation requires a distinct analysis contributor to produce a
provenance-bearing, unit-specific record of lawful external observations for
this target revision. A neutral handoff must identify the observer, date,
public interface or runtime exercised, observation method and tool versions;
state initial conditions and stimuli; describe outputs, state effects,
boundary and failure cases, repeatability, and uncertainties; and exclude
target bytes, physical instruction schedules, relocations, and other
target-derived implementation guidance.

After independent review, a distinct target-blind implementer may write
original code solely from the approved specification. Any later credit must be
demonstrated by focused semantic validation and the repository's deterministic
objdiff/report publication gates. Until that handoff exists,
`cro/DllUSGymWater` remains published, unimplemented, incomplete, and
uncredited.
