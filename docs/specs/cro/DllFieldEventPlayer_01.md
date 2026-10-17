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

The authoritative public identities are the two ARM functions in
`symbols/cro/DllFieldEventPlayer.csv`. Addresses below are offsets in the CRO
`.text` segment.

## Link-unit accounting

The structural unit has these segment sizes:

| Segment | Bytes | Notes |
| --- | ---: | --- |
| `.text` | 14,440 | exact public partition coverage |
| `.rodata` | 1,112 | allocated, unmatched |
| `.data` | 8 | allocated writable, unmatched |
| `.bss` | 428 | zero-initialized, unmatched |

The public text partition is exhaustive: 2 accepted functions occupy 2,024
bytes, 113 executable gaps occupy 11,580 bytes, 105 pools occupy 708 bytes,
and 9 fail-closed unknown ranges occupy 128 bytes. Their classification must
not be guessed during implementation.

There are 285 `R_ARM_ABS32` loader relocations: 117 import relocations and 168
internal relocations. By output segment, `.text` owns 145 relocations and
`.rodata` owns 140; `.data` owns none. Text relocations are contained in the
published pools, which are link infrastructure rather than accepted function
bodies. The read-only and writable payloads have not been reconstructed and
must remain unmatched.

The current report's 13,604-byte `.text` measure is the sum of accepted
function and executable-gap bytes. Its separate 708-byte `.pool` measure and
the 128 fail-closed bytes together reconcile exactly to the structural 14,440
text bytes. No residue is silently omitted from the partition.

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
  `subject`, `direction`, `event`, and `context` respectively.
- Linkage: the function uses opaque collaborators. There are no relocation
  outputs or literal/data words inside the accepted body.

### Observable contract

The routine selects a directional event candidate using the supplied state,
subject, direction, event, and context. It returns 1 when a candidate is
committed and 0 when the request is rejected or no candidate is available.

A successful call updates the state's selected mode, candidate index and group,
copies a 44-byte candidate descriptor, stores a derived scalar, and may submit
a four-byte command record through the subject. These effects are confined to
state offsets 184 through 186, 196 through 240, and 296 through 299; opaque
collaborators may have additional effects through their own arguments. The
descriptor contents and collaborator interfaces are not part of this
specification and must not be inferred or copied from the target.

## Remaining boundaries and completion status

Structural observation shows additional relocation-backed entry points in the
executable gaps. They are not accepted public functions: several bodies mix
code with relocated pools, and other candidates lack a presently accepted,
entry-rooted extent. Their bytes therefore remain gaps, pools, or unknown
residue exactly as the authoritative partition requires.

This is a concrete completion blocker, not permission to turn gaps into a
pseudo-function. Completing the unit requires a reviewed representation for
those mixed code/pool bodies, neutral contracts for every newly accepted
boundary, independent implementations, all 1,120 initialized `.rodata` and
`.data` bytes, all 708 pool bytes, 428 BSS bytes, and their 285 relocations;
removal of all nine unknown ranges;
and passage of the repository complete-unit gate. Until then
`metadata.complete` must remain false even if both currently accepted
functions match.
