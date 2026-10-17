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

1. Save two subject-derived scalar values, temporarily publish the subject's
   bytes at offsets 2190 and 2191 through opaque setters, and restore the saved
   values before selecting the result.
2. For each of four lanes, build two candidate temporaries. Query an opaque
   availability operation for each candidate and retain eight one-byte status
   values. A zero query result is normalized to status 2 unless a secondary
   subject query succeeds and its returned object passes a Boolean predicate.
3. Derive a mode from the subject plus the `direction` and `event` arguments.
   Modes 0 through 3 enter selection directly. Modes 4 through 7 first apply
   one of four pairs of lane predicates; the predicates depend on whether
   `state[312]` equals 6 and on the eight status bytes. An out-of-range mode
   invokes the unit's fail-fast veneer and returns 0 if control resumes.
4. Map the selected mode to two candidate indices using the same opaque mapping
   operation with deltas -2 and +2. A four-byte-per-lane selector chooses
   whether each mapped index addresses the first or second four-status group.
   If the first candidate status is zero, try the second. If both are zero,
   return 0 without committing a selection.
5. On selection, write the chosen index to `state[185]` and a one-byte group
   flag to `state[186]`. Copy one 44-byte descriptor into
   `state[196..239]`. The source descriptor stride is 44 bytes. This copy is
   value data, not permission to reproduce the target descriptor table.
6. Build two further opaque temporaries from the chosen descriptor and subject.
   Store a scalar result at `state + 240`; one branch uses the saved subject
   scalar and the other uses a floating-point query. Store the final mode byte
   at `state + 184`.
7. Unless `state[312]` is 5, prepare the four-byte command record at
   `state[296..299]` and submit it to the subject with Boolean argument 1.
   When `state[312]` is 7 the command halfword is 112 if the subject mode equals
   the selected mode, otherwise 115. For other values the command halfword is
   either 1 or 239 according to an opaque subject predicate and the same-mode
   comparison. Bytes 298 and 299 receive the selected mode and 1.
8. Return 1 after a committed selection. The other observed exits return 0:
   the early event/context rejection, invalid selection state if fail-fast
   returns, or exhaustion of both candidates.

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
