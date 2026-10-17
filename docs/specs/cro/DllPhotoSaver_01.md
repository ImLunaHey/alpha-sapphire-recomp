# DllPhotoSaver clean-room specification

## Scope and provenance

This specification records concise observable behavior and the accepted public
boundary for `cro/DllPhotoSaver` in `AS_EUR_REV2`. Evidence came from the
privately held target and the repository's ignored structural verification
inputs, reviewed with the repository CRO tooling and the pinned GNU assembler
(GNU Binutils) 2.44 on 2026-10-17. No public source was needed for the behavior
below.

It does not publish disassembly, instruction schedules, literal values or
ordering, relocation sites or addends, proprietary tables, or SDK material.

## Accepted public boundary

The public inventory contains one accepted function: `func_00000000`, an
eight-byte ARM leaf with the ABI `void (uint8_t *base, uint8_t value)`. It
stores the low byte of `value` at `base + 217` and returns. It makes no calls
and owns no relocation.

The independently authored C implementation expresses only that behavior. Its
eight bytes match through authoritative objdiff. Everything outside this
boundary remains unclaimed by the public function inventory and cannot receive
function-match credit.

## High-level observations

Unclaimed unit behavior includes initialization of an internal configuration
object and an exported command interface that reads or updates unit state and
reports selected interval bounds. Unsupported commands return an error value.
These observations are intentionally insufficient to prescribe compiler
lowering, control flow, constants, pool layout, or relocation layout. A future
implementer must independently establish any additional behavior needed for an
implementation and may use target comparison only as a blind pass/fail oracle.

## Clean-room quarantine and blocker

An earlier revision contained target-derived per-instruction lowering tables,
literal-pool ordering, and a relocation ledger. The dependent assembly and
complete-object construction were rejected and removed. They must not be
reconstructed from discarded branch history or used as implementation
evidence.

The unit currently publishes one matched function, 8/8 accepted function
bytes, and zero matched data bytes. Unclaimed code, data, BSS, pools, and
relocations remain incomplete. `metadata.complete` must remain `false`.

The unit may be called complete only after fresh, independently authored code
and data pass the repository's whole-object, relocation, unknown-residue, and
complete-unit gates.
