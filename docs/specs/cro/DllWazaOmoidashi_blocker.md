# DllWazaOmoidashi clean-room evidence blocker

## Disposition and scope

**Analysis-only documentation; new implementation is blocked.** This record
covers exactly `cro/DllWazaOmoidashi`. It is not a behavioral specification,
implementation recipe, provenance approval, or new ByteMatch claim. The
existing generic store-leaf claim is preserved without endorsement or
expansion.

- Audit date: 2026-10-18, Europe/London (BST, UTC+01:00).
- Original evidence-analysis snapshot: commit
  `58781162e3b485c0f758dfec1ae5fa1522d109dd` on the pre-bound branch
  `unit/cro-dll-waza-omoidashi`.
- Current integration and publication baseline: `origin/main` commit
  `cf338761d457114eb5883886816e0bf57f216d7e`, after the independently
  verified DllPssFavorite, DllUSPassage, DllPoke3Select, and DllTrainerCase
  provenance quarantines and their cumulative blocker records, including the
  docs-only DllVSDemo, DllZkUtil, and DllPssIconSelect evidence blockers. This
  later baseline does not retroactively change the evidence available during
  the original audit.
- Contribution role: public-evidence analyst only. No distinct target observer,
  specification reviewer, target-blind implementer, or final independent
  reviewer is identified or assigned by this record.
- Declared target: Pokemon Alpha Sapphire `AS_EUR_REV2` (Europe, revision 2),
  as stated by repository metadata. The image and revision were not inspected
  or independently verified for this audit.

The repository's clean-room and specification policies require a reviewed,
provenance-bearing behavioral handoff before implementation. No such handoff
for this unit was found, so implementation stopped at the evidence gate.

## Method and admissible evidence

The audit began by reading `docs/CLEAN_ROOM.md` in full. It then used only
tracked public repository material, path-scoped Git metadata, and public
GitHub issue and pull-request search results. No applicable `AGENTS.md` was
present. The relevant tools were Git 2.53.0, Node.js v24.21.0, GNU Bash
5.3.9(1)-release, ripgrep 15.2.0, and GitHub CLI 2.102.0.

The reviewed public records were:

- `docs/CLEAN_ROOM.md`, `docs/specs/README.md`, `CONTRIBUTING.md`, and the pull
  request template for role, provenance, and validation requirements;
- `README.md`, `docs/PROVENANCE.md`, `docs/BYTEMATCH.md`, and public target/tool
  metadata for declared project context only;
- the exact-name documentation search, which found no unit-specific analysis,
  specification, or review record for `DllWazaOmoidashi`;
- `docs/specs/cro/store_leaves_02.md`, which describes a generic store-leaf
  family but does not name this unit, identify its observer, document a
  unit-specific observation method, or record independent approval;
- the unit's public manifest, source-registry record, neutral function and
  partition inventories, and checked-in report entry, used only to describe
  already-published identity, boundaries, and accounting; and
- path-scoped Git history and exact-name searches of the public repository's
  issues and pull requests. No issue or pull request naming this unit was found
  on the audit date.

The existing source file was identified by tracked path only; its contents
were deliberately not opened or used as evidence. The target image, extracted
assets, target binaries or objects, disassembly, decompiler output, analysis
database, proprietary SDK material, leaked or copied implementation, private
report, and private-derived implementation aid were not accessed. No target
execution, extraction, target build, target verification, semantic reverse
engineering, or fresh objdiff comparison was performed.

## Existing published status

The public registry already associates one eight-byte ARM function,
`func_00005228`, with a generic `store-u8` semantic label and an existing
source path. The tracked report credits that one function out of 19 accepted
functions and 8 of 7,884 accepted function bytes. It records 5,212 data bytes
without matched-data credit and keeps `metadata.complete` false. These are
historical publication claims, not observations or new proof from this audit.

The neutral partition accounts for 22,896 text bytes: 19 accepted functions
totalling 7,884 bytes, 228 gaps totalling 13,328 bytes, 237 pools totalling
1,372 bytes, and four unknown ranges totalling 312 bytes. The public manifest
records a 36,864-byte container extent. These structural facts do not establish
an ABI, object layout, valid input domain, externally observable behavior,
failure behavior, relocation intent, data contents, or ownership of any
unclaimed range.

Path-scoped Git metadata shows the existing source and generic store-leaf note
entering in commit `7b14dec86f268f5fc974cfb4e36a8361fd31639f`, dated 2026-10-17,
with subject `feat: match 196-function multi-unit wave`. Its commit message and
the reviewed documentation do not provide a separately attributable
unit-specific observation, review, and implementation handoff. This is an
evidence limitation, not an allegation that the existing source was copied or
that lawful evidence cannot exist elsewhere.

This audit changes no source, source ownership, inventory, partition, report,
or progress accounting. At the rebased publication baseline, the repository
records 4,249 matched functions and 415,920 of 3,719,620 matched code bytes
(11.181787490844727%), with 2,121,692 data bytes and 146 published units. The
DllPssFavorite, DllUSPassage, DllPoke3Select, and DllTrainerCase withdrawals
account for the accounting change from the original audit snapshot; the later
DllVSDemo, DllZkUtil, and DllPssIconSelect blockers are documentation only, and
the `DllWazaOmoidashi` record remains unchanged. No full-link or completion
claim is made for this unit or any other unit.

## Required handoff to unblock work

A distinct analysis contributor must provide a durable, unit-specific neutral
behavioral and interface specification with lawful provenance. It must record
the observer, date, verified target revision, tools and versions, reproducible
initial conditions and stimuli, inputs, outputs, observable state effects,
boundary and failure cases, repeatability, and explicit uncertainties. Public
sources must be linked and distinguished from direct observations. The handoff
must exclude target bytes, instruction schedules, private-derived layouts,
binary tables, and implementation details.

That specification must receive attributable independent review before a
separate target-blind implementer writes original code solely from the approved
contract. Any later match, source-ownership, or completion change must then pass
the repository's focused validators, deterministic base build, authoritative
objdiff/report gates, publication-integrity checks, and no-ROM boundary checks.
Until those conditions are met, no additional `DllWazaOmoidashi` implementation
is authorized.
