# DllFieldEventSkatePipe behavioral specification

## Scope and provenance

This analysis-only handoff covers the genuine link unit
`cro/DllFieldEventSkatePipe` for `AS_EUR_REV2`. The public unit inventory
identifies the 16,384-byte CRO by SHA-256
`f3e4821db520afd3a5dd13c281a01a2d9cc70cd51d6dd37780c474f76a71f72f`.
The observations were recorded on 2026-10-17 using the public function
inventory, public complete-text partition, current objdiff report, and the
repository's validated conversion of the ignored private target.

No implementation source or implementation history for this unit was read,
and no implementation was authored. This document contains no disassembly,
instruction schedule, encoding, target payload hash, copied string or table,
asset, SDK material, or private path.

## Public boundaries and current accounting

The public inventory accepts two ARM functions. Addresses are offsets within
the original `.text` segment.

| Function | Address | Size | Current report status |
| --- | ---: | ---: | --- |
| `func_000009EC` | `0x000009EC` | 216 bytes | unmatched |
| `func_00000BD4` | `0x00000BD4` | 88 bytes | matched in the current snapshot |

The 6,156-byte public text partition contains 304 accepted function bytes,
5,408 executable gap bytes, 388 pool bytes, and 56 bytes of unknown residue.
The non-text allocated sections contain 568 bytes of read-only data, four bytes
of writable data, and 16 bytes of zero-initialized data.

The structural target contains 153 absolute relocations: 72 have outputs in
text pools and 81 have outputs in read-only data. Sixty-six refer to external
identities and 87 refer to internal sections. These aggregate counts establish
the remaining link work; they do not disclose or specify target payload.

The current report credits one of two accepted functions and 88 of 304
accepted code bytes. Its 976-byte data denominator consists of the 388 pool
bytes plus the 588 read-only, writable, and zero-initialized bytes. It credits
no data and correctly records `metadata.complete: false`.

## Behavioral contract for `func_000009EC`

The function selects a skate-pipe transition from a direction-like selector
and the sign of one floating-point input.

### Inputs and observable effects

- `r0` carries an opaque object pointer. Successful dispatch preserves this
  identity when passing the request to the downstream handler.
- `r1` is the selector. Values zero through three are recognized.
- `r2` points to a writable output byte.
- VFP scalar `s0` is consulted for selectors zero and one.
- VFP scalar `s1` is consulted for selectors two and three.

The sign comparison is against the adjacent binary32 constant positive zero.
That constant belongs to a separate four-byte pool immediately following the
public function boundary; it is not part of the 216-byte function.

For a recognized selector and an ordered, nonzero input, the function writes the
listed byte and dispatches the listed event code to the downstream handler:

| Selector | Compared input | Negative: event / byte | Positive: event / byte |
| ---: | --- | --- | --- |
| 0 | `s0` | 5 / 2 | 4 / 3 |
| 1 | `s0` | 7 / 2 | 6 / 3 |
| 2 | `s1` | 6 / 0 | 4 / 1 |
| 3 | `s1` | 7 / 0 | 5 / 1 |

Positive and negative zero are equality cases. Equality and unordered
floating-point comparisons, including NaN, do not modify the output byte and
return zero. An unrecognized selector likewise does not modify the output byte
and returns zero.

Successful dispatch transfers control to `func_00000BD4` with the original
opaque object identity and selected event code. The observable return value is
therefore the downstream handler's return value; this function does not add a
second post-dispatch result transformation.

The specification intentionally does not prescribe instruction order,
register-allocation details beyond the input ABI, branch layout, padding, or
compiler strategy. An implementation must be original source derived from
this behavior, not a transcription of target instructions.

## Verification boundary

The private target may be used only as an opaque pass/fail comparison after an
independent implementation is complete. A mismatch must not be used to inspect
target instructions, encodings, byte differences, or control-flow layout and
iteratively steer the implementation. Behavioral tests should cover all four
selectors, negative and positive finite values, both signed zeros, NaN, an
out-of-range selector, output-byte preservation on non-dispatch paths, and
propagation of the downstream return value.

Matching `func_000009EC` would make both accepted public functions and all 304
accepted function bytes match. That result is code-only progress and is not a
complete link unit.

## Concrete blockers to completion

The following public accounting prevents a truthful complete-unit claim:

1. Only 304 of 6,156 text bytes have accepted function boundaries. The 5,408
   executable gap bytes cannot be claimed as a synthetic function, and the 56
   unknown bytes cannot be silently classified.
2. The 388 pool bytes and 572 bytes of read-only and writable initialized data
   have no approved high-level clean-room specification. Aggregate sizes and
   relocation counts are not sufficient to recreate their values lawfully.
3. Sixteen bytes of zero-initialized state are structurally known, but their
   ownership and semantics still need to be reconciled with the other data and
   relocation-bearing structures.
4. Relocation topology is accounted in aggregate, but source-level identities
   and addend semantics depend on classifying the remaining executable and
   data structures.

Accordingly, `metadata.complete` must remain `false` even if the two accepted
functions reach 100% code match. Completion requires a separately reviewed
expansion of the neutral function inventory and text partition, plus lawful
behavioral specifications for all initialized data and relocation-bearing
structures. Opaque target comparison can prove a finished reconstruction; it
cannot supply the missing clean-room specification.
