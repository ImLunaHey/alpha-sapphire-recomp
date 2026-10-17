# DllBattleMatch lower-range clean-room specification

## Provenance and scope

This high-level specification records independently observed behavior for the
accepted ARM functions between module offsets `0x0000131C` and `0x00007C6C`.
The observations were made on 2026-10-17 against Pokemon Alpha Sapphire
`AS_EUR_REV2`, using the repository's deterministic CRO converter, Ghidra
12.0.2, and GNU binutils 2.44. Private inputs, target bytes, disassembly,
strings, and tables are not reproduced here.

## Implemented behavior

### `func_00002324`

Creates a match-related object only when the context does not already own one.
It derives a small request from the opaque second argument, passes the
context's owner fields and request to the module-local creation service,
attaches a short descriptor derived from the context's associated resource,
then advances the context to mode `0x16` and records successful creation.

The routine uses only stack-local scalar records and module-local call veneers.
It does not require a literal pool, data section, or relocation.

### `func_000075D0`

Queries a rooted battle resource and selects one of two state transitions. A
successful query records result kind `2` and candidate `5`; failure invokes a
module-local fallback and records result kind `3` and candidate `11`. An
existing candidate is preserved. The routine then marks the context active,
configures its associated resource, and sets state `13`.

The routine does not require a literal pool, data section, or relocation.

## Deferred lower-range work

The other accepted functions in this range include constructors, resource
controllers, serializers, and allocation-heavy setup paths. Several consume
adjacent relocated identities or scalar constants whose ownership must be
modeled separately before implementation. None of those functions or their
adjacent data is claimed by this specification.

The complete-unit gate must remain false until all accepted functions, text
gaps, pools, data, relocations, and unknown ranges are accounted for.
