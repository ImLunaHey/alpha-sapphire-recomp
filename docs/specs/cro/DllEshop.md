# `cro/DllEshop` analysis status

## Provenance

- Role: independent target-aware analysis/specification; no implementation work was performed.
- Target revision: Pokémon Alpha Sapphire `AS_EUR_REV2`.
- Observation date: 2026-10-17.
- Tools: Node.js v24.21.0 for bounded inspection of checked-in JSON metadata; GNU objdump (GNU Binutils) 2.46 was available but was not run on a target because no ignored target input was configured.
- Public repository evidence: `progress/units/AS_EUR_REV2.cro.json`, `progress/reports/AS_EUR_REV2/report.json`, `docs/CLEAN_ROOM.md`, `docs/CRO_UNITS.md`, and `docs/CRO_TARGET_OBJECTS.md`.
- Independence statement: the prospective implementation was not read, and no semantic claim was inferred from the unit name. No leaked or proprietary source, SDK material, ROM/container content, target bytes, strings, assets, disassembly, relocation ledger, or private artifact path was consulted or reproduced.

## Method

The public unit inventory and aggregate report were filtered to the single logical unit `cro/DllEshop`. Inspection was limited to neutral, already-published sizes, counts, and publication status. The worktree was then checked for the presence of an ignored converted target object without printing or recording any private path or identity. No such target input was available, so target-aware control-flow, data-flow, call-effect, and state-transition observations could not be made.

This document therefore fails closed. Structural publication facts below are not behavioral evidence and must not be used to invent function semantics, names, signatures, constants, side effects, or dependencies.

## Publicly approved structural facts

- The checked-in inventory publishes `cro/DllEshop` as an independent 24,576-byte container boundary for `AS_EUR_REV2`.
- The aggregate report marks the unit incomplete.
- The report publishes five accepted neutral function boundaries covering 2,016 code bytes. One 8-byte function is currently exact; the remaining four functions and 2,008 code bytes are unmatched.
- The published section accounting is 8,932 bytes of text, 892 bytes of text pools, 1,116 bytes of read-only data, 4 bytes of writable data, and 76 bytes of BSS.
- These values describe partition and report accounting only. They neither establish behavior nor prove full-unit reconstruction.

## Semantic observations

None. A configured ignored target input was unavailable on 2026-10-17, so this analysis role has no independently observed behavioral contract to hand to an implementer.

## Blocker and acceptance condition

Implementation is blocked under the clean-room protocol. An independent target-aware analyst must inspect the exact `AS_EUR_REV2` unit using the repository's bounded semantic gate and record only high-level observable behavior: inputs, outputs, state changes, branch conditions, call effects expressed without proprietary identities, and failure behavior. The resulting revision must retain tool/version/date and role provenance while excluding disassembly, instruction schedules, exact target-derived symbol or relocation ledgers, target bytes or hashes, proprietary strings or assets, ROM/container data, and private artifact paths.

Until that evidence exists, the only defensible implementation action is no action; the public structural facts above are insufficient to specify any of the five functions.
