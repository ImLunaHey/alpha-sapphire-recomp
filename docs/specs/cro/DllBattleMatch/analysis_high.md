# DllBattleMatch upper-range clean-room specification

## Provenance and scope

This high-level specification covers the six accepted ARM functions from
module offset `0x00011EA8` through `0x0001BDFC`. Observations were made on
2026-10-17 against Pokemon Alpha Sapphire `AS_EUR_REV2` using the repository's
deterministic CRO converter and GNU binutils 2.44. Private inputs, target
bytes, disassembly, strings, and tables are not included.

## Implemented behavior

### `func_00011EA8`

Processes three mutually exclusive context states. Two states validate an
owned resource with a pair of predicates, clear its transient completion
state, normalize an owner flag, and finalize the resource. The middle state
delegates to the related handler at `0x0000E710`. Predicate failures return
false; completed or diagnostically invalid states return true.

The implementation uses module-local calls and requires no literal pool,
allocated data, or relocation.

## Deferred upper-range work

The remaining accepted functions perform notification selection, work-object
population, resource-driven operations, object initialization, and balanced
tree insertion. Several depend on adjacent scalar or relocated read-only
identities. Those functions, their pools, and their relocation ownership are
not claimed here.

This specification does not claim unit completion. All remaining functions,
text gaps, data sections, relocations, and unknown ranges must pass the
complete-unit gate first.
