# DllPhotoSaverSecretBase clean-room analysis 01

## Provenance and scope

- Target: Pokémon Alpha Sapphire `AS_EUR_REV2`, unit
  `cro/DllPhotoSaverSecretBase`.
- Evidence: the externally supplied target object generated from the private
  verification input, the checked-in public CRO inventory and exact partition,
  and relocation-backed function-pointer references.
- Tools: GNU `arm-none-eabi-objdump` 2.44 and GNU
  `arm-none-eabi-readelf` 2.44. The checked-in inventory was produced by the
  repository's Ghidra-based CRO analysis pipeline.
- Observation date: 2026-10-17.
- Role: analysis/specification only. No implementation source was consulted or
  changed while deriving this specification.

No target bytes, disassembly, binary-derived strings, or target data tables are
reproduced here. Dependency names below are neutral labels assigned for this
specification.

## `func_00001D60`

### Interface and boundary

- ARM-state entry at text offset `0x1D60`, size `0x218` (536 bytes).
- The routine accepts three machine-word arguments. The first is a mutable
  object pointer; the second and third are forwarded unchanged to one setup
  dependency.
- No stable return value is observed. Treat the routine as returning `void`.
- The executable body ends before a three-word literal pool at `0x1F78`.

### Observable contract

1. A process-global guard word is tested. If its low bit is clear, the routine
   calls a guard-acquire dependency. When that dependency reports ownership,
   the routine clears a separate global word and calls the matching
   guard-complete dependency. If the guard is already set, or acquisition
   reports no ownership, this initialization is skipped.
2. A setup dependency is called with the original three arguments and a fixed
   stack descriptor. The descriptor identifies the guarded global state, a
   read-only descriptor, and the scalar values `1`, `59`, `0`, and `8` in the
   observed fields. The fourth register argument is `1`.
3. A context dependency returns an object. The routine follows the pointer at
   offset `28`, dereferences its first word, advances by `0x20400`, and uses the
   resulting address to construct a temporary helper object on the stack. A
   second dependency reads one scalar from that helper.
4. A primary-object accessor is called before every parameter write. Its
   result is passed to a six-argument parameter-write dependency. Six writes
   occur in this exact order:

   - slot `5`: the scalar read from the temporary helper, kind `6`, with both
     trailing flags set;
   - slot `0`: the signed remainder modulo `100` of getter 0, kind `2`, with
     trailing values `2` and `1`;
   - slot `1`: getter 1, kind `2`, with trailing values `0` and `1`;
   - slot `2`: getter 2, kind `2`, with trailing values `0` and `1`;
   - slot `3`: getter 3, kind `2`, with both trailing flags set;
   - slot `4`: getter 4, kind `2`, with trailing values `2` and `1`.

   All five getters receive the subobject at first-object offset `120`.
   Signed remainder uses truncation toward zero, so negative inputs retain the
   sign of the dividend.
5. Between the slot-5 and slot-0 writes, the first object is passed to a
   configuration dependency with scalar arguments `(0, 43, 12)`. After the
   slot-4 write it is passed to the same dependency with `(0, 49, 10)`.
6. The stack helper constructed in step 3 is destroyed before return.

The routine has no input-dependent branch after the global-guard sequence; all
six parameter writes and both configuration calls always occur.

### Compiler-relevant observations

- The body uses a 36-byte stack frame and preserves `r4` through `r9` plus
  `lr`.
- The first object, forwarded arguments, zero, and one remain live in callee-
  saved registers across most dependency calls.
- The signed remainder is compiled inline using a signed multiply by a magic
  reciprocal, arithmetic shifts, and a multiply/subtract equivalent to
  `value - trunc(value / 100) * 100`; there is no division-helper call.
- Two pairs of trailing stack arguments are emitted as doubleword stores.
- Nine legacy ARM hint encodings appear as scheduling padding around dependency
  calls. An implementation attempting an exact compiler match must preserve
  their placement rather than treating them as semantic operations.
- The body makes only direct ARM calls. Its two address-bearing literal words
  require relocations to one data object and one read-only object; the signed
  division reciprocal is an unrelocated literal.

## Relocation-backed tail entry points

The checked-in partition combines several genuine functions into gaps after
`func_00001D60`. Read-only-data relocations point independently at each entry
below, and each entry has a complete return path before the next entry or
literal pool. These are safe candidates for the next deterministic inventory
regeneration; they were not manually inserted into the public CSV or partition
in this analysis commit.

| Entry | Code size | Neutral behavior |
| --- | ---: | --- |
| `0x1F84` | 4 | Return-only no-op. |
| `0x1F88` | 60 | Destruction wrapper: updates two dispatch pointers, destroys an embedded subobject, runs three cleanup dependencies, then tail-calls a final release dependency. |
| `0x1FCC` | 56 | Alternate destruction wrapper with the same embedded-subobject and dispatch-pointer transitions. |
| `0x200C` | 4 | Return-only no-op. |
| `0x2010` | 4 | Return-only no-op. |
| `0x2014` | 52 | Sets a dispatch pointer, releases a nullable owned pointer at offset `20`, clears that field, then tail-calls a base cleanup dependency. |
| `0x204C` | 48 | Sets a dispatch pointer, releases and clears the nullable owned pointer at offset `20`, and returns the original object. |
| `0x2088` | 8 | Returns constant `1`. |
| `0x2090` | 4 | Return-only no-op. |
| `0x2094` | 4 | Return-only no-op. |
| `0x2098` | 4 | Return-only no-op. |
| `0x209C` | 4 | Return-only no-op. |
| `0x20A0` | 8 | Returns the word at input offset `48`. |
| `0x20A8` | 8 | Returns constant `1`. |
| `0x20B0` | 92 | Converts an interior pointer to its owner by subtracting `32`, allocates/configures a `0x200` by `0x100` resource, stores the resulting pointer at owner offset `96`, and tail-calls a finalizer with two zero arguments. |
| `0x2110` | 128 | Converts an interior pointer to its owner by subtracting `32`; returns false if a readiness dependency fails, returns true if the owned pointer at offset `96` is already null, otherwise temporarily replaces the word at offset `36`, performs a guarded release/update sequence, restores that word, clears offset `96`, and returns true. |

The module tail also contains an ARM routine at `0x2190` that initializes
module-global floating-point state and the exported CRO control routine at
`0x2244`. Those are module lifecycle/control material rather than ordinary
game-function inventory candidates. The lifecycle routine is referenced by the
control footer; its constants and destination table are intentionally not
reproduced in this specification.

## Inventory status

The authoritative public inventory still claims exactly two functions:
`func_00001D60` and the already implemented 8-byte
`func_00002080`. This specification makes `func_00001D60` implementable from
neutral facts and records evidence for splitting the tail gaps in a future
deterministic inventory pass. It does not claim that the unit is complete.
