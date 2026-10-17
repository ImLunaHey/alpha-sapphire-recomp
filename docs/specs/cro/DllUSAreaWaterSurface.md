# DllUSAreaWaterSurface neutral specification

## Scope and provenance

This analysis-only specification covers `cro/DllUSAreaWaterSurface` in
`AS_EUR_REV2`. It was prepared on 2026-10-17 from the public CRO inventory and
report, loader-visible structure, and bounded behavioral observation of the
ignored external verification input. GNU Arm Embedded binutils 15.2.Rel1 was
used for structural inspection. Target provenance is governed by
`docs/PROVENANCE.md`.

No target bytes, disassembly, instruction schedule, extracted string, SDK
material, or implementation source is included. The facts below are intended
for an implementation role that has not inspected the target. Target
comparison may be used only as a blind pass/fail oracle.

## Public boundary

The public inventory identifies two ARM functions:

- `func_00000570`, at public module-text offset `0x570`, size 152 bytes;
- `func_00000610`, at public module-text offset `0x610`, size 248 bytes.

The module uses ARM state and VFP. Loader-visible structure establishes that it
has executable text, read-only and writable data, zero-initialized state,
external imports, internal references, a polymorphic object interface, and a
module initialization/control entry. Exact instruction, table, relocation,
and payload layouts are deliberately outside this specification.

## High-level object and interface behavior

The main object owns or references:

- a construction/context object;
- an optional immutable area descriptor;
- a helper/resource and an embedded member object;
- a render or water-surface object;
- two independently animated opacity values; and
- compact asynchronous state and context-derived selection state.

Construction initializes those members, selects an area descriptor from a
small fixed set using context state, and creates the helper when selection and
allocation succeed. Setup uses compact descriptor records to create resources,
places the surface from descriptor coordinates and context scale, initializes
both opacity channels, and attaches the surface to a context-owned companion.
Teardown detaches and releases owned resources while tolerating null members.

The periodic update synchronizes context state and moves each opacity toward
an enabled or disabled endpoint by a fixed step. The first channel uses the
module predicate; the second uses an external environment classification.
Changed values are applied to the surface. A small asynchronous state machine
starts and polls helper work, obtains context state after completion, and
reports completion only in its terminal state.

Module initialization establishes default opacity state. The loader-facing
control entry supports registration, lookup, and initialization-range queries.

## Accepted function contracts

### `func_00000570`

This function applies one opacity value to every element of a selected surface
channel. It queries the element count, obtains the current four-component value
for each element through the surface interface, replaces the opacity component,
and writes the value back. An empty surface performs no element calls.

The existing clean-room implementation is independently validated and is the
only matched function in this unit.

### `func_00000610`

This function returns a boolean deciding whether the primary surface channel
is enabled. It compares two context-derived byte values with fields in the
selected descriptor. Two descriptor modes use complementary equality tests.
A special descriptor category performs additional context queries that can
override or restrict the ordinary mode decision. Unsupported modes enter the
module's error path and return false.

This behavioral contract intentionally omits register choices, instruction
order, branch topology, literal placement, call-site layout, and encodings. A
fresh implementation role attempted several semantic implementations using a
blind equality oracle; none matched. No candidate was retained.

## Current status and blocker

The authoritative public report remains:

- 1 of 2 functions matched;
- 152 of 400 accepted code bytes matched;
- no data matched out of 480 reported data bytes; and
- `metadata.complete` is `false`.

Full clean-room completion is blocked by both of the following:

- read-only type-identification strings are target-derived and have no known
  clean public derivation, so their contents are intentionally omitted; and
- the approved high-level observations are insufficient to reproduce
  `func_00000610` or the remaining module byte-identically using a blind oracle.

Completion must remain false until all code, data, references, and remaining
unclassified material are independently reconstructed and the repository's
complete-unit gate passes.

## Quarantine record

Earlier revisions contained target-derived instruction and structural ledgers
that exceeded the clean-room specification boundary, together with an
implementation derived from that material. Explicit revert commits removed the
implementation and schedules without rewriting history. This revision also
removes the surviving exhaustive target accounting. None of the quarantined
material may be consulted or reused.
