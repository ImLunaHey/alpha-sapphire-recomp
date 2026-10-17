# `DllCommWait` clean-room status

## Scope and provenance

- Target revision: Pokemon Alpha Sapphire `AS_EUR_REV2`.
- Unit: `cro/DllCommWait`.
- Analysis role: target-aware analyst; no implementation work was performed.
- Observation date: 2026-10-17.
- Public baseline: `f22d1e5`.
- Tools used: Node.js 24.21.0 for bounded parsing of public JSON metadata and
  Git for repository-state inspection. The checked-in report identifies
  objdiff 3.8.2 as its authoritative comparison tool. No private-target
  analysis tool was run because neither the external verification input nor a
  generated target object was available in this worktree.

This status uses only the public neutral inventory, source-ownership metadata,
contract documentation, and tracked objdiff report. It contains no target
bytes, extracted content, disassembly, instruction schedule, binary-derived
string, exhaustive partition, relocation ledger, SDK material, or
implementation source.

## Public interface and ownership

The neutral inventory accepts three ARM functions. One 328-byte function is
owned by CRO contract 10 and is reported as an exact match. That contract
describes it at a high level as wait-scene setup and deliberately owns no
neighboring literals, padding, relocations, or data.

The other two accepted functions are currently unclaimed:

| Function | Public module-text offset | Size | Status |
| --- | ---: | ---: | --- |
| `func_00000334` | `0x0334` | 632 bytes | no approved behavior or implementation |
| `func_00000A2C` | `0x0A2C` | 400 bytes | no approved behavior or implementation |

No behavior beyond those neutral interface facts can be established from the
available clean-room evidence. In particular, the unit name alone is not
sufficient evidence for either function's arguments, return contract, object
layout, state transitions, side effects, or external-call semantics. A fresh
implementer must not infer those details from this status and may use target
comparison only as blind pass/fail feedback after an approved behavioral
specification exists.

## Module data

The tracked report exposes four non-code categories totaling 792 bytes: 52
bytes of zero-initialized state, 8 bytes of writable initialized data, 336
bytes categorized as pool material, and 396 bytes of read-only data. None is
claimed or matched. The public evidence does not establish the contents,
identities, types, references, or runtime meaning of any of these bytes, so no
data contract suitable for independent implementation is available.

## Completion status and evidenced blocker

The authoritative public report records 1 of 3 accepted functions and 328 of
1,360 accepted function-body bytes matched, with no matched data.
`metadata.complete` is correctly `false`.

Byte-identical whole-object completion is blocked in this checkout. The
repository's required private verification input is not configured, and the
ignored converted target object for this unit is absent. Consequently, the
two unclaimed functions and all module data cannot be behaviorally observed or
tested here. Even with the private oracle restored, completion would still
require approved high-level behavioral/data specifications, a fresh
implementer's independent reconstruction, and exact whole-object validation.
The unit must remain incomplete until all code, data, references, and other
allocated material are proven byte-identical by the fail-closed complete-unit
gate.
