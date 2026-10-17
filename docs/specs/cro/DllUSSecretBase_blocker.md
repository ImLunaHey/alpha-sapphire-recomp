# DllUSSecretBase clean-room evidence blocker

## Scope and provenance

This implementation-side public-evidence audit covers only
`cro/DllUSSecretBase` for Pokemon Alpha Sapphire revision `AS_EUR_REV2`. It
was performed on 2026-10-18 against repository baseline
`1aa2a44b0c71c612cbd5277bc1aa5699f35f50c5`.

The audit used Git 2.53.0, Node.js v24.21.0, npm 11.19.0, ripgrep 15.2.0,
and GNU Bash 5.3.9. It reviewed only tracked repository policy, specification
metadata, neutral symbol and partition inventories, authored-source
registration, sanitized report accounting, and public Git history for this
unit. `ROM_PATH` and `DECOMP_PRIVATE` were unset, and no `objdiff` executable
was available on `PATH`.

No ROM or container content, extracted asset, target binary or object,
disassembly, proprietary or leaked source, SDK material, private path, target
byte, relocation ledger, instruction schedule, or other target-derived
implementation aid was inspected. No implementation was authored or changed.
This record is not a behavioral specification and does not authorize one.

## Published status

The tracked report publishes this unit as incomplete and currently credits
one of 37 accepted functions: `func_000079B4`, comprising 20 of 12,928 code
bytes (0.15470298%). It credits no data from the unit's 13,404 data bytes and
records `metadata.complete: false`.

That bounded source claim is registered under the shared
[POD-leaf contract](pod_leaves_01.md). The contract, implementation, validator,
and report credit entered together in bulk commit
`7b14dec86f268f5fc974cfb4e36a8361fd31639f`. The commit and shared contract do
not contain a unit-specific, independently attributable analysis handoff for
the remaining scope. This audit therefore preserves the already-published
claim without independently renewing its provenance or treating it as
evidence for neighboring behavior.

The neutral inventory identifies boundaries and the partition accounts for
text layout, but neither supplies inputs, outputs, state transitions, side
effects, collaborator contracts, error behavior, data contents, or a complete
link contract. The unit name and the semantic label of the accepted leaf also
cannot establish those facts for another function.

## Stop condition

No approved public specification authorizes implementation of the remaining
36 functions, 12,908 code bytes, or any unit data. Writing code, behavioral
tests, or semantic claims from the structural metadata, adjacent source, or
the module name would be guesswork and would violate the role separation in
[`docs/CLEAN_ROOM.md`](../../CLEAN_ROOM.md). No additional implementation,
match credit, full-link claim, or completion claim is made.

Further work requires a distinct target-aware analysis contributor to produce
a neutral, provenance-bearing behavioral and interface specification for a
bounded part of this unit. The handoff must record the analyst, target
revision, observation date and tools, initial conditions, stimuli, externally
observable results, boundary and error cases, repeatability, and unresolved
uncertainties. It must exclude target bytes, physical instruction schedules,
relocation-derived implementation details, proprietary material, and copied
source.

After independent review, a distinct target-blind implementation contributor
may write original code using only that approved handoff. Any later match or
completion claim must pass the repository's deterministic source-ownership,
object-comparison, report-accounting, no-ROM, and complete-unit gates. Until
then, this unit remains blocked and explicitly incomplete.
