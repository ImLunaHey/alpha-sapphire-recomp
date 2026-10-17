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
`.text` segment. Opaque calls are identified only by their neutral veneer
offset so that an implementer does not need private symbol information.

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
and 9 fail-closed unknown ranges occupy 128 bytes. The unknown ranges are
`0x02B8+0x14`, `0x066C+0x0C`, `0x096C+0x0C`, `0x0C38+0x0C`,
`0x0D04+0x0C`, `0x105C+0x08`, `0x1128+0x18`, `0x27FC+0x10`, and
`0x3498+0x0C`. Their classification must not be guessed during
implementation.

There are 285 `R_ARM_ABS32` loader relocations: 117 import relocations and 168
internal relocations. By output segment, `.text` owns 145 relocations and
`.rodata` owns 140; `.data` owns none. The text relocations are completely
contained in the published pools. The first 696 text bytes are 87 canonical
four-byte import veneers alternating with their four-byte relocation words.
Two additional text import relocation words occur in later pools. These
veneer/gap and pool bytes are link infrastructure, not owned by either
accepted function.

The read-only segment contains fourteen repeated 32-byte polymorphic dispatch
records. Each has six internal text references and one internal read-only-data
reference. A separate group of fourteen linkage records contributes 28 import
references and fourteen read-only-data self-references. The remaining
read-only payload has not been semantically reconstructed and must remain
unmatched. This describes only record shape and relocation ownership; no
target values or strings are part of this specification.

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

- Boundary: `0x2000..0x27E0` (2,016 bytes, 504 ARM instructions).
- Interface model: a five-argument routine returning a Boolean-sized integer.
  The first four arguments arrive in `r0` through `r3`; the fifth is the first
  stack argument under AAPCS. For this specification they are called `state`,
  `subject`, `direction`, `event`, and `context` respectively.
- Linkage: 54 direct calls through 30 distinct neutral local/import veneers.
  There are no relocation outputs or literal/data words inside the function.
  Its seven-word literal pool begins at `0x27E0` and is outside the boundary.
- Stack: the routine reserves 744 bytes in total, including saved registers.
  It constructs nine opaque 56-byte temporaries with the same initializer,
  using `context`, `context + 124`, and disjoint local storage.

The complete implementable neutral schedule is
`config/cro-dll-field-event-player-01.json`. It records all 504 ordered ARM
operations as mnemonic/operand facts without instruction encodings, all 90
basic blocks and their successor offsets, every stack-slot role, all 54 call
sites and 30 abstract veneer contracts, and the seven post-body pool identities
and relocation addends. The schedule hashes are
`a1199f664aff9da18ec15521205e54bde5d7c32481df33d59493f28843c76240`
for operations and
`da33bec8fe3543289de3f96c3cb9cbc1034d27e2b50c972c0fa6fc127df021d8`
for control flow. `scripts/validate-cro-dll-field-event-player-01.mjs` pins
these facts fail-closed and cross-checks the public boundary. The manifest
contains no raw opcode, target byte, private symbol, or copied data-table
payload.

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

### Additional exact observations

- The descriptor destination comprises eight consecutive words followed by
  two more words and a final word at offset 40, for 44 bytes total.
- State writes made by this routine are confined to offsets 184, 185, 186,
  196 through 240, and 296 through 299. Opaque callees may have additional
  effects through their pointer arguments.
- The routine checks one early normalized event value against 4103. On equality
  it performs two context-dependent Boolean queries and returns 0 only when
  the second predicate is false.
- The four-lane loops are unsigned-count loops with exactly four iterations;
  lane selectors and statuses are byte-sized.
- Floating-point data is moved and copied, but no target floating constants or
  descriptor contents are required by this behavioral contract.

## Remaining boundaries and completion status

Private structural observation shows additional relocation-backed entry
points in the executable gaps, including fourteen dispatch families and two
module-control entries after `func_000036D4`. They are not accepted public
functions: several bodies embed relocated jump tables or literal pools, and
the conservative exporter/gate cannot represent such bodies as one owned
function without placing relocation words inside a function. Other short
entry candidates lack a presently accepted, entry-rooted extent. Their bytes
therefore remain gaps, pools, or unknown residue exactly as the authoritative
partition requires.

This is a concrete completion blocker, not permission to turn gaps into a
pseudo-function. Completing the unit requires a reviewed representation for
those mixed code/pool bodies, neutral contracts for every newly accepted
boundary, independent implementations, all 1,120 initialized `.rodata` and
`.data` bytes, all 708 pool bytes, 428 BSS bytes, and their 285 relocations;
removal of all nine unknown ranges;
and passage of the repository complete-unit gate. Until then
`metadata.complete` must remain false even if both currently accepted
functions match.
