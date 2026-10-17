# DllUSContestVenue clean-room evidence blocker

`cro/DllUSContestVenue` lacks independently observed behavioral evidence
sufficient for a clean-room implementation. This public-evidence audit is an
analysis result only; it is not a behavioral specification or approval to
implement.

## Scope and provenance

- Review date: 2026-10-17.
- Repository baseline reviewed: `1cf1ac2bdfa1c63ffe2bfc96be918d2a76acb977`,
  the then-current local `main` revision.
- Target revision: Pokemon Alpha Sapphire `AS_EUR_REV2` (Europe, revision 2),
  as declared in [repository provenance](../../PROVENANCE.md). The target was
  not independently inspected or executed.
- Tools: Git 2.53.0, Node.js v24.21.0, npm 11.19.0, ripgrep 15.2.0, GitHub CLI
  2.102.0, and GNU Bash 5.3.9. A pinned local `objdiff-cli` executable was not
  present.
- Method: read the [clean-room policy](../../CLEAN_ROOM.md) and
  [specification policy](../README.md) in full; inspect only tracked public
  documentation, neutral unit metadata, repository history, source
  registration, and the published objdiff report; and search the public
  repository's issues and pull requests for a reviewed unit-specific handoff.

No ROM, CRO binary, extracted asset, proprietary source, SDK material, private
target byte or object, disassembly, generated target-derived implementation
aid, private comparison output, or credential was inspected. Nothing in this
audit was copied from proprietary source.

## Admissible observations

- The public CRO manifest identifies a 12,288-byte module with SHA-256 identity
  `f54ba3f32e9ea7d71ceb6f0f8c7af50f387a6f75525cff2d26f4feb9c21b2d19`.
  These are identity facts, not behavioral evidence.
- The tracked symbol CSV declares a 2,024-byte text image and accepts no
  function boundary. Partition metadata accounts for it as 1,824 executable
  gap bytes, 160 pool bytes, and 40 unknown bytes.
- `config/cro-sources.json` contains no authored source or function claim for
  this unit. No unit-specific reviewed specification, authored source,
  repository-history implementation, public issue, or public pull request was
  found.
- The published objdiff snapshot records 1,824 text bytes, 160 pool bytes, 248
  read-only-data bytes, 4 data bytes, and 16 BSS bytes. It assigns zero matched
  code and function credit, exposes no source path, and records
  `metadata.complete` as `false`.
- At the reviewed baseline, the project report records 416,672 of 3,719,620
  code bytes matched, 4,255 of 14,840 functions matched, and zero complete
  units. This audit changes none of those values.

The inventory layout and published report are aggregate structural evidence.
They do not establish callable interfaces, valid inputs, outputs, state
transitions, side effects, dependencies, ownership rules, error behavior, or
source-level function identities.

## Blocker and required handoff

Writing code from the module name, gap layout, pool placement, neighboring
contest units, or aggregate report metadata would be guesswork and would
violate the required separation between analysis and implementation. There is
therefore no supportable source change or honest ByteMatch claim for this unit
in the current evidence set. The unit must remain at zero matched code bytes,
zero matched functions, and `metadata.complete: false`.

Further work requires a distinct analysis contributor to produce a neutral,
reviewable behavioral specification for this unit and target revision. The
handoff must record the observer, date, tool versions, initial conditions,
stimuli, externally observable results, relevant boundary and failure cases,
repeatability, and unresolved uncertainties. It must exclude target bytes,
physical instruction schedules, disassembly, relocation-derived
implementation guidance, and proprietary material.

Only after independent review may a separate implementation contributor write
original code from that specification. Any later match or full-link claim must
be demonstrated by the repository's deterministic objdiff publication gates.
Until then, the neutral inventory and published accounting must not change.
