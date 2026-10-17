# DllZkUtil clean-room evidence blocker

`cro/DllZkUtil` has no independently observed behavioral evidence sufficient
for a clean-room implementation. This public-evidence audit is not a behavior
specification and does not authorize implementation.

## Scope and provenance

- Review date: 2026-10-18.
- Audited repository baseline:
  `0c49ca31affc2143ff568f04b2e82f50fd83f9d8`, the current `origin/main`
  revision when this unit audit began.
- Target revision: Pokemon Alpha Sapphire `AS_EUR_REV2` (Europe, revision 2),
  as declared in [repository provenance](../../PROVENANCE.md). The target was
  not inspected or executed for this audit.
- Contributor role: Luna, performing an implementation-side admissibility
  review and documenting the resulting blocker. No implementation or target
  analysis was performed.
- Tools: Git 2.53.0, Node.js v24.21.0, npm 11.19.0, ripgrep 15.2.0, and GNU
  Bash 5.3.9.
- Review method: read the [clean-room policy](../../CLEAN_ROOM.md) and
  [specification policy](../README.md) in full, then inspect only tracked,
  repository-public documentation, neutral unit metadata, sanitized report
  accounting, authored-source registration, and public Git history for this
  unit.

`ROM_PATH` and `DECOMP_PRIVATE` were unset. No ROM, extracted asset, target
binary or object, disassembly, decompiler output, proprietary or leaked source,
SDK material, private report, target byte, relocation ledger, instruction
schedule, or other target-derived implementation aid was inspected. No target
extraction, execution, analysis, build, or comparison command was run.

## Published status

The neutral symbol inventory accepts no function boundary. The complete text
partition accounts for 220 bytes as three unclaimed ARM gaps totalling 148
bytes and three non-code pools totalling 72 bytes, with no unknown residue.
These boundaries and classifications are structural facts; they do not
establish any input, output, state transition, side effect, collaborator
contract, error behavior, data content, or source-level identity.

The checked-in report publishes `cro/DllZkUtil` with zero matched code, zero
matched functions, no authored source path, and `metadata.complete: false`.
It accounts for 148 code bytes and 92 data bytes: 72 pool bytes, 4 writable
data bytes, 16 zero-initialized bytes, and no read-only data bytes. The source
registry contains no claim for this unit. The publication manifest contains
the unit exactly once.

Project-wide accounting remains authoritative in the machine-generated report
and is intentionally not duplicated here. This audit makes no ByteMatch,
linkability, or completion claim.

## Stop condition and required handoff

The implementation role has no admissible behavioral contract for even the
smallest function in this unit. Inferring behavior from the module name,
unclaimed layout, pool placement, adjacent implementations, or aggregate
report metadata would be guesswork outside the role separation required by
[`docs/CLEAN_ROOM.md`](../../CLEAN_ROOM.md). Implementation therefore stops
with the inventory, source ownership, match credit, and incomplete status
unchanged.

Further work requires a distinct target-aware analysis contributor to produce
a neutral, provenance-bearing behavioral and interface specification for a
bounded part of `DllZkUtil`. The handoff must record the analyst, target
revision, observation date and tools, initial conditions, stimuli, externally
observable results, relevant boundary and failure cases, repeatability, and
unresolved uncertainties. It must exclude target bytes, physical instruction
schedules, relocation-derived implementation details, proprietary material,
and copied source.

Only after independent review may a distinct target-blind implementation
contributor write original code from that approved handoff. Any later match or
completion claim must pass the repository's deterministic source-ownership,
object-comparison, report-accounting, no-ROM, and complete-unit gates. Until
then, `cro/DllZkUtil` remains blocked and explicitly incomplete.
