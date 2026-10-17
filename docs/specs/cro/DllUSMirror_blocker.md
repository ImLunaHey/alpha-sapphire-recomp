# DllUSMirror clean-room evidence blocker

`cro/DllUSMirror` has no approved, independently attributable behavioral
handoff from which a target-blind implementation can be written. This
public-evidence audit is an analysis result only; it is not a behavioral
specification, implementation work, or approval to implement.

## Scope and provenance

- Review date: 2026-10-17.
- Repository baseline: `55f3122f3e8ff83698a40805c4046e52545fb830`.
- Target revision: Pokemon Alpha Sapphire `AS_EUR_REV2` (Europe, revision 2),
  as declared in [repository provenance](../../PROVENANCE.md). The target was
  not inspected or executed during this review.
- Tools: Git 2.53.0, Node.js v24.21.0, npm 11.19.0, ripgrep 15.2.0, GitHub CLI
  2.102.0, and GNU Bash 5.3.9. The pinned local `objdiff-cli` executable was
  absent.
- Method: read the [clean-room policy](../../CLEAN_ROOM.md) and
  [specification policy](../README.md) in full, then inspect only tracked
  public repository documentation, neutral unit metadata, history, authored
  source registration, and the published objdiff report. The public GitHub
  code index and this repository's public issue and pull-request index were
  queried only for the unit identifier.

No ROM, CRO binary, extracted asset, proprietary or leaked source, SDK
material, private target path, target object, target byte, disassembly,
analysis database, private report, or other target-derived implementation aid
was consulted or reproduced. Nothing in this audit was copied from
proprietary source.

## Public-search boundary

At `2026-10-17T23:56:27+01:00`, GitHub reported the following complete code
index results:

- [`"DllUSMirror" "Alpha Sapphire"`](https://github.com/search?q=%22DllUSMirror%22+%22Alpha+Sapphire%22&type=code):
  zero results;
- [`"DllUSMirror.cro" pokemon`](https://github.com/search?q=%22DllUSMirror.cro%22+pokemon&type=code):
  one result; and
- [`"DllUSMirror"`](https://github.com/search?q=%22DllUSMirror%22&type=code):
  19 results across seven repositories, including this repository.

Some result paths described recovered or matching source and ROM identity
material. Because the index metadata does not establish lawful provenance,
independent observation, target-revision applicability, or clean-room role
separation, none of those files was opened or used. The search therefore
supplies no admissible behavior or implementation evidence. This repository's
public issue and pull-request search returned no result for `DllUSMirror`.
GitHub index completeness does not prove that no suitable public evidence
exists elsewhere.

## Admissible observations

- The [public CRO manifest](../../../progress/units/AS_EUR_REV2.cro.json)
  identifies `cro/DllUSMirror` as a permanent 12,288-byte unit with SHA-256
  identity
  `4a566b7f46ef498fe772f04a82d43301642dde3240a5582024a5c5690ce84c7f`.
  These are identity and unit-boundary facts, not behavioral evidence.
- The [neutral symbol inventory](../../../symbols/cro/DllUSMirror.csv) records
  a 784-byte text extent and accepts no function boundary. Its
  [complete text partition](../../../symbols/cro-partitions/DllUSMirror.json)
  accounts for 596 bytes as executable gaps, 104 bytes as pool material, and
  84 bytes as unknown residue.
- `config/cro-sources.json` contains no authored-source or function claim for
  this unit. No approved unit-specific behavioral specification or
  implementation is tracked.
- The published report, SHA-256
  `fa8b3f300eaba7ba1f49c9e5e61b4803ea8ed30b36f551853111a4d50373c0b1`,
  assigns zero matched code and function credit, exposes no source path, and
  records `metadata.complete` as `false`. Its unit sections contain 596 text
  bytes, 104 pool bytes, 152 read-only-data bytes, 4 data bytes, and 16 BSS
  bytes.
- The same report records an aggregate 416,672 of 3,719,620 code bytes and
  4,255 of 14,840 functions matched across 146 units. This audit changes none
  of those values.

The module name, identity, text layout, and published accounting do not
establish callable interfaces, valid inputs, outputs, state transitions, side
effects, dependencies, ownership and lifetime rules, failure behavior, data
semantics, or source-level function identities.

## Blocker and required handoff

Writing source from the module name, structural partition, or unreviewed
third-party search results would be guesswork and would violate the required
separation between target-aware observation and target-blind implementation.
There is therefore no supportable source change or honest ByteMatch gain for
this unit in the admitted evidence set. It must remain at zero matched code
bytes, zero matched functions, and `metadata.complete: false`.

Further work requires a distinct analysis contributor to produce a neutral,
reviewable, unit-specific behavioral specification for the declared target
revision. The handoff must identify the observer, observation date, tools and
versions, permitted observation method or public sources, initial conditions,
stimuli, externally observable results, relevant boundary and failure cases,
repeatability, and unresolved uncertainties. It must exclude target bytes,
physical instruction schedules, disassembly, relocation-derived
implementation guidance, and proprietary material.

Only after independent review may a separate target-blind implementation
contributor write original code solely from that approved specification. Any
later match or complete-unit claim must be demonstrated by the repository's
deterministic build, focused semantic checks, authoritative objdiff
comparison, and publication-integrity gates. Until then, the neutral inventory
and published accounting must not change.
