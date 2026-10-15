# ARM simple-shape probe findings, batch 7

## Provenance and scope

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-15.
- Evidence: the repository's evidence-gated function inventory and private
  local control-flow/data-flow analysis of the target executable.
- Probe toolchain: GCC Arm Embedded 15.2.Rel1, using the repository's current
  ARMv6K ARM-mode build flags.

This document contains behavior and neutral interface facts only. It does not
contain target bytes, instruction listings, proprietary symbols, assets, or SDK
material.

The scan excluded every function already named by an existing specification
and every function reserved by the concurrently active batch-5 and batch-6
analyses. It then considered, in order, short byte-constant stores,
base-plus-field accessors, word-constant stores, two-level reads, masked and
shifted reads, and two-word constant stores.

## Result

No new exact GCC match was accepted from this bounded scan.

There were 136 otherwise-unclaimed routines in the requested short-shape
classes. Sixty-eight had already been expressed as portable fixed-width C by a
prior scratch-probe sweep; recompiling and independently comparing those
routines found no exact match among the still-unclaimed names. Twelve further
argument-relative routines were expressed and probed in this batch, also with
no exact match. The remaining 56 routines depend on unnamed absolute global
objects reached through nearby address constants. They were screened out: a
portable behavior contract cannot identify those objects yet, and introducing
their private addresses would violate the clean-room boundary.

The argument-relative probes covered these neutral behaviors:

- a 32-bit field read followed by base-pointer addition;
- a pointer-sized field read followed by a second word, byte, or indexed-word
  read;
- storing zero or one to one byte or 32-bit field;
- storing zero to two 32-bit fields in source order; and
- extracting a single bit or contiguous unsigned bit range from a 32-bit
  field.

Alternate portable formulations were also tested for the representative
pointer-chase, base-plus-field, constant-store, and masked-read cases. These
included fixed-width structure fields, byte-addressed fields, volatile source
or destination accesses, explicit temporaries, compound literals, and
equivalent pointer-index expressions. None produced a complete exact match.

## Mismatch characterization

The remaining differences are compiler code-generation choices, not unresolved
behavior:

- GCC consistently chose a different temporary register for constant stores,
  pointer chasing, and base-plus-field calculations.
- GCC canonicalized masked-and-shifted expressions into the opposite, but
  behaviorally equivalent, operation order.
- In one commutative pointer-plus-index case, GCC reversed the two addition
  operands.
- Portable references to the unnamed global-object cases require an address
  materialization and relocation owned by the compiled function, while the
  current evidence-gated target boundary does not include the adjacent address
  constant as part of the function.

These findings must not be counted as matched functions or matched code bytes.
They are retained to prevent repeated low-yield probing and to direct the next
pass toward the original ARM compiler or toward independently established
global-data identities and boundaries.

## Acceptance rule used

A candidate was accepted only if its complete generated function body matched
the corresponding target function exactly. Behavioral equivalence, matching
size, or a near match with different register selection was rejected. No inline
assembly, fixed-register extension, compiler pragma, embedded target data, or
private address was used to manufacture a match.
