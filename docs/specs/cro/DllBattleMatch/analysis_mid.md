# DllBattleMatch middle-range clean-room specification

## Provenance and scope

This high-level specification covers accepted ARM functions from module
offset `0x0000BC88` through `0x0000FEF8`, excluding the previously specified
`func_0000BE2C`. Observations were made on 2026-10-17 against Pokemon Alpha
Sapphire `AS_EUR_REV2` with the repository converter and GNU binutils. Private
inputs, instruction listings, target bytes, strings, and tables are excluded.

## Implemented behavior

- `func_0000DFCC` initializes a small arena-backed container. It clears the
  container state, allocates an arena descriptor and initial block, publishes
  the usable range, and creates an empty self-linked sentinel.
- `func_0000E710` and `func_0000EAFC` complete two analogous owned-resource
  states. Each requires two predicates to succeed, clears transient state,
  normalizes the owner's completion flag, finalizes the resource, and returns
  a boolean result.
- `func_0000E970` rate-limits a timer comparison. Every tenth invocation it
  samples elapsed time, compares the unsigned difference with a caller
  threshold, resets the counter, and returns the comparison result.
- `func_0000EED4` conditionally releases the object owned at context offset
  `0x84`. It preserves ownership when the release predicate fails and clears
  the slot after successful virtual destruction.
- `func_0000F21C` stores a mode, emits two related owner commands, and performs
  an additional transition for mode `0x15`.

These implementations use module-local call identities and emit no allocated
data or relocations.

## Deferred middle-range work

Unimplemented functions in this range cover list reconciliation, selection
validation, formatting, tree search/erase, and vector/container operations.
Some use adjacent constants or relocated read-only identities; the larger
tree and vector routines are also sensitive to exact library code generation.
Those bodies and their adjacent pools remain unclaimed.

The unit remains incomplete until the complete-object gate accounts for all
code, data, pools, relocations, and unknown residue.
