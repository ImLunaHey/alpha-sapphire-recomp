# DllField record update 01 — Blocked

## Verification outcome and quarantine

- Status: **BLOCKED**; failed exact-match implementation quarantined.
- Role: independent **VERIFICATION/quarantine**, scoped to `cro/DllField`.
- Target revision: `AS_EUR_REV2`; verification record date: 2026-10-17.
- Analysis baseline: `70e1ebe`. Implementation commits `a93455b` and
  `92117b4` were reversed without rewriting history in quarantine commit
  `e6e821563cd4823d7e104ec7b004d2a3e2a8ed72`.

The supplied independent authoritative verification passed target identity,
two deterministic full base builds (594 files identical), genuine report
generation (146 units and 14,840 functions), public behavioral validation
(4,352 cases and 14 rejection fixtures), `npm run check`, and ten
publication/report regression suites. These are the prior verification
results supplied with this quarantine assignment, not checks rerun here.

The candidate was not 100% exact. The genuine report remained at 4,261 exact
functions and 416,964 matched code bytes globally; `DllField` retained 28
exact functions and 464 matched code bytes with `complete: false`.
Publication gates correctly rejected claimed ownership of 29 functions and
488 code bytes against report credit of 28 functions and 464 code bytes.

Behavioral equivalence and the 24-byte body size were insufficient to prove
exactness. Matching would require target-derived scheduling or unjustified
accesses beyond the neutral contract, so clean-room implementation stops
here. No source, ownership configuration, or report credit is retained for
this candidate. The implementation and its validator were removed, and
`config/cro-sources.json` was restored exactly to the analysis-only state at
`70e1ebe`. Existing report credit is unchanged. Reopening requires an
independent behavioral specification that justifies any additional accesses
without prescribing target-derived scheduling, followed by independent
implementation and authoritative verification.

This quarantine used only repository metadata, public documentation, and
the supplied aggregate verification outcome. No target material was
inspected. Safe local tool versions: Node.js 24.21.0, npm 11.19.0,
Git 2.53.0, ripgrep 15.2.0, and GNU Bash 5.3.9.

Exact safe quarantine commands, run from the repository root:

```sh
node --version
npm --version
git --version
rg --version | head -n 1
bash --version | head -n 1
git revert -n 92117b4 a93455b
git diff --cached --stat
git diff --exit-code --cached 70e1ebe -- config/cro-sources.json
test ! -e src/cro/DllField/record_update_01.c && test ! -e scripts/validate-cro-dll-field-record-update-01.py
git diff --cached --check
npm run check:clean
git mv docs/specs/cro/DllField_record_update_01.md docs/specs/cro/DllField_record_update_01_blocker.md
npm run check:clean
```

`npm run check:clean` passed before each quarantine/documentation commit.
The original neutral analysis below is retained as historical evidence; its
behavioral approval does not authorize resuming this blocked implementation.

## Historical analysis approval and provenance

- Historical status: ANALYSIS-approved behavioral specification.
  Approval covers only the contract and preconditions below; it does not
  certify an implementation, an independent review, or a new exact match.
- Role: ANALYSIS, research sub-agent assignment; documentation only. A distinct
  IMPLEMENTATION contributor must author any implementation from this
  specification without consulting target material or analysis artifacts.
- Target: Pokémon Alpha Sapphire, European card revision 2, `AS_EUR_REV2`;
  published unit `cro/DllField` only.
- Observation date: 2026-10-17.
- Tools used: Node.js 24.21.0; Python 3.12.12 with Unicorn 2.1.3; GNU objdump
  2.45.1.20251203 from Arm GNU Toolchain 15.2.Rel1, explicitly in ARMv6K mode;
  Git 2.53.0; ripgrep 15.2.0; npm 11.19.0; GNU Bash 5.3.9.
- Public inputs: the [unit inventory](../../../progress/units/AS_EUR_REV2.cro.json),
  [function inventory](../../../symbols/cro/DllField.csv),
  [partition](../../../symbols/cro-partitions/DllField.json),
  [source ownership configuration](../../../config/cro-sources.json),
  [existing unit source](../../../src/cro/DllField.c), its configured companion
  sources, the existing DllField specification, and the
  [published report](../../../progress/reports/AS_EUR_REV2/report.json).
  Ghidra 12.0.2 is the documented historical inventory producer; it was not
  rerun for this contribution.

The [clean-room protocol](../../CLEAN_ROOM.md) was read in full. No leaked
source, proprietary SDK headers, or prior private implementation probes were
used. Private verification inputs were read only and remained outside Git.
The observations below describe isolated execution of the target operation
with independently constructed synthetic inputs, not gameplay or hardware
execution.

## Candidate selection and method

The selected public identity is `func_0002CBF8`, an accepted 24-byte ARM
function that is absent from current source ownership and has no match credit
in the published report. It is the first self-contained candidate when
unowned accepted functions are ordered by size and then public identity.
The twelve smaller candidates are 20-byte functions: three delegate outside
their bodies, one makes a call, and eight use PC-relative data. Those
dependencies are outside this contract.

The private CRO's size and identity were checked against the public
`AS_EUR_REV2` unit inventory without publishing the identity value. The
repository's CRO validator and converter ran in memory, including header
integrity checks, and reproduced the existing structural target exactly.
The public partition bounds the selected body. An ARMv6K decoder review
confirmed complete instruction coverage, no calls or external control flow,
no PC-relative data access, and no relocation output inside that body.

An in-memory split reproduced the selected executable section's payload in
the existing generated split object. The complete generated split file did
not reproduce byte for byte; its differences were confined to section/symbol
metadata, with executable section payloads agreeing. It was therefore not
used as evidence of whole-object identity. Behavioral execution used only
the verified structural target's bounded body.

## Neutral behavioral contract

This operation updates four fields of a caller-supplied record. Its inputs
are a record pointer followed by four unsigned 32-bit values, referred to
here as A, B, C, and D. The ordinary entry interface supplies the pointer and
A, B, C through the first four argument registers and D through the incoming
stack argument word. These are neutral input roles, not recovered source
types or game-specific meanings.

The record must be writable, aligned for 32-bit fields, and extend through
byte offset 43. Its storage must be disjoint from the incoming stack argument
storage. Offsets below are byte offsets from the record's start.

- The 32-bit field at offset 28 receives A unchanged.
- The byte at offset 36 receives the low eight bits of B.
- The byte at offset 37 receives the low eight bits of C.
- The 32-bit field at offset 40 receives D unchanged.

Every other record byte retains its entry value, including padding between
the fields. The operation returns with the same record pointer in the result
register. None of A, B, C, or D is dereferenced. No record field's prior value
affects the result. There is no collaborator call, allocation, global-state
dependency, or stack write in this bounded operation.

This contract gives final values and access extents; it prescribes no
instruction ordering, register allocation, source spelling, or compiler
schedule. It makes no claim about invalid pointers, overlapping record and
argument storage, concurrent access, or a higher-level purpose for the fields.

## Independent observations and handoff checks

Unicorn executed the bounded body against synthetic record and stack pages
in 4,352 cases. These comprised all 4,096 combinations of four inputs drawn
from zero, one, byte/sign boundaries, the first value above a byte, the high
32-bit sign bit, and the maximum unsigned word, plus 256 deterministic random
cases seeded with the observation date.

The checks varied record location, aligned position, initial contents, and
incoming condition flags. Every case confirmed the four final field values,
unchanged padding and surrounding guards, the same returned record pointer,
unchanged stack contents and stack pointer, and preserved callee-saved
registers. Data-access monitoring observed only the incoming word for D and
the four specified field writes. All execution stayed within the accepted
body until return; no external code or game environment was supplied.

A fresh implementer should independently check these same final-state
properties, especially truncation of nonzero upper bits in B and C and
preservation of padding. A separate verifier must establish any future exact
match against revision-verified private inputs. Behavioral observations and
the public body size alone do not establish compiler identity or byte identity.

## Incomplete accounting and stop conditions

The published snapshot credits 28 of 1,090 accepted functions and 464 of
357,060 accepted code bytes. The remaining 1,062 accepted functions account
for 356,596 unmatched code bytes. This candidate remains among them; this
documentation adds no function or byte credit. Matched data remains zero of
168,356 bytes, and another 626,604 text bytes remain partitioned as gaps,
pools, or unknown residue outside accepted function bodies.

Keep `metadata.complete: false`. No report, source, configuration, or
partition changes are authorized by this specification. Whole-object
completion still requires proof covering code, data, relocations, layout,
and residue. Fail closed if target revision, provenance, boundaries, or the
specified access extents cannot be reproduced; do not fill missing evidence
with guessed behavior or target-derived implementation scheduling.
