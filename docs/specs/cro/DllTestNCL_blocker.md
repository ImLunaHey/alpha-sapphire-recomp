# DllTestNCL clean-room evidence blocker

`cro/DllTestNCL` lacks independently observed behavioral evidence sufficient
for a clean-room implementation. This public-evidence audit is not a
behavioral specification or approval to implement.

## Scope and provenance

- Review date: 2026-10-17.
- Repository baseline reviewed and used as this change's parent:
  `33de800b35f2fbe34e799f97bc36a109023d88a2`.
- Target revision: Pokemon Alpha Sapphire `AS_EUR_REV2` (Europe, revision 2),
  as declared in [repository provenance](../../PROVENANCE.md). The target was
  not independently inspected or executed.
- Tools: Git 2.53.0, Node.js v24.21.0, npm 11.19.0, ripgrep 15.2.0, and GNU
  Bash 5.3.9.
- Method: read the [clean-room policy](../../CLEAN_ROOM.md) and
  [specification policy](../README.md) in full, then review only tracked public
  repository documentation, unit metadata, history, and authored-source
  registration for this unit.

No ROM, extracted asset, proprietary source, SDK material, private target
byte, target object, disassembly, generated target-derived implementation aid,
or private comparison output was inspected.

## Public observations

The tracked symbol inventory accepts no function boundary for this unit. Its
complete text partition classifies the text only as unmatched executable gaps
and pool material, with no accepted function or unknown residue. The published
objdiff report gives the unit no match credit, omits an authored source path,
and records `metadata.complete: false`. No unit-specific reviewed specification
or authored source is present.

These are aggregate structural facts from already tracked neutral metadata.
They do not establish behavior, source-level identities, or whole-object
equivalence.

## Blocker and required handoff

The implementation role has no admissible basis for writing source. Inferring
behavior from the module name or structural metadata would be guesswork and
would violate the required separation between analysis and implementation.
This audit makes no implementation, match, or completion claim. The local
`objdiff-cli` executable is also unavailable; more importantly, there is no
admissible implementation to compare.

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
