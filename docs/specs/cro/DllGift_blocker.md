# DllGift clean-room blocker

## Scope and provenance

This record covers `cro/DllGift` for Pokemon Alpha Sapphire
`AS_EUR_REV2`. The provenance audit was performed on 2026-10-17 against
repository revision `bc3611fd4b7cb8c9aa5f22137957c2b794dc3f70`.

The audit used Git 2.53.0, Node.js v24.21.0, and the repository's committed
clean-room policy, neutral symbol inventory, partition metadata, source
registry, public report, and history for this unit. It did not use a ROM,
extracted asset, target object, disassembly, private path, or proprietary
source. `ROM_PATH` and `DECOMP_PRIVATE` were unset, focused build/comparison
objects were absent, and `objdiff` was unavailable on `PATH`.

This is a provenance and publication record, not a behavioral specification.
No implementation was attempted.

## Quarantine finding

The public baseline report credited two of the unit's twelve inventoried
functions: 28 of 3,136 code bytes (0.8928572%) and no matched data.
The source registry described those functions as a twenty-byte record-clearing
leaf and an eight-byte byte-store leaf.

Both implementations and their semantic registry claims entered together in
bulk commit `7b14dec86f268f5fc974cfb4e36a8361fd31639f`, whose commit message contains
no unit-specific analysis provenance or approved specification reference. One
implementation was a hand-authored assembly instruction schedule. The other
was C source asserting a field offset and behavior. Repository history contains
no reviewed `DllGift` specification from a separate analysis role that could
authorize either implementation.

Because their provenance is unclear, the implementations and source-registry
claims are quarantined rather than rewritten. The neutral inventory and
partition remain structural accounting only; they do not establish behavior.
After quarantine, the unit claims zero matched functions, zero matched code,
and zero matched data, with `metadata.complete: false`. This deliberately
removes 2 functions and 28 bytes of provisional match credit.

## Stop condition

The committed evidence does not specify inputs, outputs, state transitions,
side effects, collaborator contracts, or error behavior for any `DllGift`
function. The module name, anonymous boundaries, and previous semantic labels
must not be used to infer those facts. There is therefore no approved
behavioral contract from which an independent implementation role can write
source.

Implementation remains blocked until a separate analysis contributor provides
a reviewed, provenance-bearing behavioral and interface specification. A
distinct implementation contributor must then work only from that
specification and use the pinned deterministic build.

Whole-unit publication additionally requires byte-identical object comparison
covering code, data, relocations, layout, and unknown residue, plus focused
validation and the aggregate publication gates. Those comparison inputs are
not available in this checkout, so no completion or object-identity claim is
made.
