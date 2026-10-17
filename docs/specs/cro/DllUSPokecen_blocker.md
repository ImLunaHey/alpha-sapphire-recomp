# DllUSPokecen clean-room evidence blocker

`cro/DllUSPokecen` has no independently observed behavioral evidence from
which an implementation can be written. This public-evidence audit is an
analysis-side result only; it is not a behavioral specification, an
implementation handoff, or a new equivalence review.

## Scope and provenance

- Review date: 2026-10-18.
- Public repository baseline:
  `294985cc40908afba5c0dc034a5e0722a97cc1b7`.
- Target revision: Pokemon Alpha Sapphire `AS_EUR_REV2` (Europe, revision 2),
  as declared in [repository provenance](../../PROVENANCE.md). This audit did
  not independently inspect, execute, or compare the target.
- Role: Luna, acting only as the analysis-side public-evidence auditor for this
  blocker. No implementation was authored or modified.
- Tools: Git 2.53.0, Node.js v24.21.0, npm 11.19.0, ripgrep 15.2.0, and GNU
  Bash 5.3.9. No `objdiff-cli` executable was available in this worktree.
- Method: read the [clean-room protocol](../../CLEAN_ROOM.md) and
  [specification policy](../README.md) in full, then inspect only tracked
  public documentation, neutral unit metadata, history, source registration,
  and the committed publication report for this unit.

No ROM, extracted CRO, proprietary or leaked source, SDK material, private
target byte, generated target object, disassembly, analysis database, private
comparison output, or other target-derived implementation aid was inspected.
Nothing in this audit was copied from proprietary source.

## Public evidence and publication status

- The public CRO manifest identifies a 12,288-byte module with SHA-256
  identity `1c5370996699a7b24a7e0630932f89a482bb4dfb030ac120a90ae6539a4a05c4`.
  These are identity facts, not behavioral evidence.
- The tracked symbol CSV has a text size of 2,644 bytes and accepts no function
  boundary. Its partition metadata classifies those bytes as 2,212 bytes of
  executable gaps, 280 bytes of pool material, and 152 unknown bytes.
- `config/cro-sources.json` contains no authored-source or function claim for
  this unit, and no unit-specific reviewed behavioral specification or
  implementation is tracked.
- The committed ByteMatch snapshot gives the unit zero-percent code and
  function credit and records `metadata.complete` as `false`. Its section
  totals are 2,212 text bytes, 280 pool bytes, 204 read-only-data bytes, four
  data bytes, and 16 BSS bytes.
- The reviewed public report has SHA-256
  `fa8b3f300eaba7ba1f49c9e5e61b4803ea8ed30b36f551853111a4d50373c0b1`.
  It records 416,672 of 3,719,620 project code bytes matched and 4,255 of
  14,840 functions matched. This audit changes none of those values and does
  not claim a locally regenerated objdiff comparison.

The inventory layout and published report are aggregate structural and
accounting evidence. They do not establish callable interfaces, parameter
meanings, valid initial states, observable results, state transitions, side
effects, collaborators, ownership or lifetime rules, failure behavior, data
semantics, source-level function identities, or complete-link ownership. The
152 unknown bytes also prevent complete structural classification of the
tracked text layout.

## Decision and required handoff

Writing code from the module name, gap layout, pool placement, or neighboring
units would be guesswork and would violate the required separation between
analysis and implementation. The admitted evidence therefore authorizes no
source change, function boundary, match credit, data claim, or completion
claim. The unit must remain at zero published credit with
`metadata.complete: false`.

Further implementation requires a distinct analysis contributor to produce an
independently attributable neutral behavioral specification. It must identify
the observer, target revision, observation date, tools and versions, initial
conditions, stimuli, externally observable results, relevant boundary and
failure cases, repeatability, and unresolved uncertainties. It must exclude
target bytes, physical instruction schedules, disassembly, relocation-derived
implementation guidance, and proprietary material.

Only after independent review may a different, target-blind contributor write
original code from that specification. Any later equivalence or completion
claim must use the repository's authorized deterministic verification path and
must preserve the unit's incomplete status until every applicable publication
gate is satisfied.
