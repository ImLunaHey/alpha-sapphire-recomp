# DllFieldEventPlayer clean-room specification 01

## Provenance and scope

- Target: Pokemon Alpha Sapphire `AS_EUR_REV2`.
- Observation date: 2026-10-17.
- Repository baseline: `4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`.
- Tools: the repository CRO-to-ELF converter and semantic validator at that
  baseline, Ghidra 12.0.2 for the published conservative inventory, GNU ARM
  binutils 2.44 for independent instruction-boundary and relocation review,
  and Node.js 24.21.0 for structural summaries.
- Role: analysis/specification only. This document records neutral behavior
  observed from the external verification input. It is not an implementation
  and does not reproduce target instructions, strings, or data tables.

Addresses below are offsets in the module's executable segment.

## `func_000036D4`

- Boundary: `0x36D4..0x36DC` (8 bytes, 2 ARM instructions).
- Interface: `void func_000036D4(uint8_t *base, uint8_t value)`.
- Behavior: store the low eight bits of `value` at `base + 217`, then return.
- Linkage: no calls, pools, relocations, or stack use.
- Effects: exactly one byte write; no return value is specified.

This is the already reviewed `store-u8` contract and is independently
implementable as `base[217] = value`.

## `func_00002000`

- Boundary: `0x2000..0x27E0` (2,016 bytes, ARM).
- Interface model: a five-argument routine returning a Boolean-sized integer.
  The first four arguments arrive in `r0` through `r3`; the fifth is the first
  stack argument under AAPCS. For this specification they are called `state`,
  `subject`, `direction`, `event`, and `context` respectively. Register and
  stack placement follows Arm's public
  [AAPCS32 parameter-passing standard](https://github.com/ARM-software/abi-aa/blob/main/aapcs32/aapcs32.rst).
- Linkage: the function uses opaque collaborators. There are no relocation
  outputs or literal/data words inside the accepted body.

### Observable contract

The routine selects a directional event candidate using the supplied state,
subject, direction, event, and context. It returns 1 when a candidate is
committed and 0 when the request is rejected or no candidate is available.

A successful call updates the state's selection fields, copies a candidate
descriptor, stores a derived scalar, and may submit a command through the
subject. The descriptor contents and collaborator interfaces are not part of
this specification and must not be inferred or copied from the target.

## Remaining boundaries and completion status

`func_00002000` remains unimplemented because the observable contract does not
identify the opaque collaborator interfaces or candidate data needed for an
independent implementation. Those details must not be guessed. The unit also
contains unimplemented executable and data material, so `metadata.complete`
must remain false.
