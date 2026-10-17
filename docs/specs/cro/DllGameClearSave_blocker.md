# DllGameClearSave clean-room blocker

## Scope and provenance

This status record covers `cro/DllGameClearSave` for Pokémon Alpha Sapphire
`AS_EUR_REV2`. It was prepared on 2026-10-17 from the public repository snapshot
at commit `bc3611fd4b7cb8c9aa5f22137957c2b794dc3f70` after reading
`docs/CLEAN_ROOM.md` in full.

This contribution is an implementation-role provenance audit. It uses only the
checked-in neutral function inventory, text partition, source registry, report,
contract documentation, and repository history. No ROM, extracted asset,
private target object, disassembly, proprietary source or header, private path,
instruction schedule, register/offset ledger, or target-derived comparison
output was consulted or reproduced.

## Public observations

The neutral inventory publishes three ARM function boundaries in a 3,360-byte
text region. The checked-in report at the audited revision credits one 188-byte
function, reports 188 of 680 inventoried function bytes matched, and marks the
unit incomplete. These figures describe the prior published snapshot; they are
not fresh target observations and do not establish behavior.

The former `func_000006DC` source was a mnemonic-by-mnemonic assembly body with
fixed PC-relative calls. Its contract recorded byte comparison against a private
reference and pinned the emitted bytes, but it did not provide a distinct-role,
independently implementable behavioral specification for the function's inputs,
outputs, state transitions, or external interfaces. Rebuilding that schedule
would therefore preserve target-derived implementation material rather than
produce an independent implementation.

## Fail-closed status

The former source and its manifest claim are quarantined. No replacement is
authored, no match or completion credit is claimed, and `complete` must remain
false. The public inventory and partition remain neutral boundary metadata only.

Further implementation requires a separate analysis role to publish a reviewed
behavioral specification that is sufficient without disassembly, instruction
order, registers, fixed branch displacements, or other target-derived coding
aids. A distinct implementation role may then write original source solely from
that specification. Promotion also requires a deterministic build, focused
semantic validation, and authoritative byte-identical objdiff/report evidence.
