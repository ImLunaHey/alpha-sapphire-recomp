# DllFatalErrorProc clean-room blocker

## Scope and provenance

This analysis and verification record covers the published link unit
`cro/DllFatalErrorProc` for Pokémon Alpha Sapphire revision `AS_EUR_REV2`.
Observations were recorded on 2026-10-17 against public repository revision
`a8f80286fb8870eef4ec0f646fa66fadcb9fc6eb`.

An independent analysis-role agent read the clean-room protocol and inspected
only version-controlled public inputs. It used Node.js 24.21.0 and Git 2.53.0
to parse and reconcile the neutral inventory, complete-text partition, public
unit manifest, source registry, and tracked objdiff report. The repository
pins objdiff 3.8.2, Ghidra 12.0.2, and Arm GNU Toolchain 15.2.Rel1; those tools
were not run against this unit during this public-only audit.

The method counted every public partition range, summed each class, checked
bounds, alignment, ordering, overlap, and complete text coverage, then
cross-checked the unit's report and source-registry entries. No target binary,
disassembly, ignored build output, private input, asset, or environment-secret
file was inspected. No target behavior was independently observed, no game
implementation was written, and this record does not authorize one.

This document contains no target bytes or hashes, disassembly, instruction
schedule, target-derived relocation or symbol ledger, proprietary string or
asset, ROM or container data, or private artifact path.

An independent verification-role review on 2026-10-17, against public
revision `f6034fcbd092eb50ddea804a68bcaa50d0aef772`, found that the first
validator accepted an arbitrary external report and proved only aggregate
partition accounting. The infrastructure implementation role reproduced
those failures using Node.js 24.21.0 and Git 2.53.0, without consulting a
target binary or private artifact. The corrected method requires every input
and parent directory to be canonical, non-symlink repository-owned paths;
retains duplicate-key rejection; and pins deterministic review digests of the
public inventory and the unit-specific manifest, partition, and report
records. Hostile fixtures cover external paths, symlinked files and parents,
manifest drift, and coordinated identity/range mutations. These are metadata
integrity checks only and do not add implementation or match credit.

## Public structural accounting

The public CSV contains zero accepted function records and declares a
1,776-byte text extent. The partition covers that extent exactly:

| Class | Ranges | Bytes |
| --- | ---: | ---: |
| accepted functions | 0 | 0 |
| executable ARM gaps | 43 | 1,504 |
| literal/data pools | 43 | 232 |
| unknown residue | 1 | 40 |

All 87 ranges are nonempty, ordered into zero-hole and zero-overlap coverage,
and bounded by the declared text size. Every ARM gap has four-byte-aligned
address and size. The empty CSV and partition function inventories agree.
These checks establish consistency of public metadata only; gaps must not be
promoted to functions, and the unknown range remains unresolved.

The unit appears exactly once in the public manifest and tracked report. It
has no source-registry claim and no published source path. The report accounts
for 1,504 text-gap bytes and 412 data bytes: 232 pool bytes, 160 read-only
bytes, four writable initialized bytes, and 16 zero-initialized bytes. It
publishes zero match credit and explicitly retains `complete: false`. The
zero accepted-code denominator does not mean the module has no executable
code; it means no function boundary has passed the repository's acceptance
gate.

## Stop condition

No reviewed, provenance-bearing behavioral specification exists for this
unit. Public names, sizes, and range classes do not specify observable inputs,
outputs, state changes, lifecycle, failure behavior, or collaborator
contracts. A separate implementation role therefore has no approved contract
from which to write original game source.

Deterministic full-unit proof is also unavailable. It would require all of the
following without weakening any gate:

1. Independently justified function boundaries and resolution of all 40
   unknown bytes without inventing functions or matched residue.
2. A separately authored implementation derived only from a reviewed
   behavioral specification, with explicit source and function claims.
3. A reproducible unit build and authoritative comparison covering every code,
   data, initialization, layout, and linkage requirement.
4. Byte-identical complete target and base objects, passing the focused unit
   checks and aggregate publication gates.

Until that evidence exists, `cro/DllFatalErrorProc` must retain zero credit and
incomplete status. This blocker is the required clean-room quarantine outcome,
not a claim of completion.
