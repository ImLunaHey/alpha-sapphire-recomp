# DllTestMori clean-room evidence blocker

`cro/DllTestMori` lacks independently observed behavioral evidence sufficient
for a clean-room implementation. This public-evidence audit is not a
behavioral specification or approval to implement.

## Scope and provenance

- Review date: 2026-10-17.
- Repository baseline reviewed: `7c52f1651ca3f782fd48c7866491c82387660d12`.
- Target revision: Pokemon Alpha Sapphire `AS_EUR_REV2` (Europe, revision 2),
  as declared in [repository provenance](../../PROVENANCE.md). The target was
  not independently inspected or executed.
- Tools: Git 2.53.0, Node.js v24.21.0, npm 11.19.0, ripgrep 15.2.0,
  GitHub CLI 2.102.0, and GNU Bash 5.3.9.
- Method: read the [clean-room policy](../../CLEAN_ROOM.md) and
  [specification policy](../README.md) in full; review only tracked public
  repository documentation, publication metadata, and validation summaries;
  search public repository history, issues, and pull requests for a reviewed
  unit-specific specification or authored implementation.

No ROM, CRO binary, extracted asset, proprietary source, SDK material, private
target byte, target object, disassembly, generated target-derived
implementation aid, or private comparison output was inspected.

## Public observations

The publication registry includes `cro/DllTestMori`. The published
`AS_EUR_REV2` report assigns the unit zero matched-code and matched-function
credit, exposes no accepted function entry or authored source path, and marks
`metadata.complete` false. No unit-specific reviewed specification, authored
source directory, public issue, or public pull request is present.

These are aggregate repository-status facts. They do not establish behavior,
source-level identities, or whole-object equivalence.

## Blocker and required handoff

The implementation role has no admissible basis for writing source. Inferring
behavior from the module name or aggregate metadata would be guesswork and
would violate the required separation between analysis and implementation.
This audit makes no implementation, match, or completion claim. There is no
admissible implementation to compare with deterministic objdiff tooling.

Further work requires a distinct analysis contributor to produce a neutral,
reviewable behavioral specification for this unit and target revision. That
handoff must record the observer, date, tool versions, initial conditions,
stimuli, externally observable results, relevant boundary and error cases,
repeatability, and uncertainties. It must exclude target bytes, physical
instruction schedules, relocation-derived implementation details, and all
other implementation-directed target artifacts.

Only after independent review may a distinct implementation contributor write
original code from that specification. Any later matching or completion claim
must pass the repository's deterministic full-unit publication gates. Until
then the inventory, match credit, and incomplete status must remain unchanged.
