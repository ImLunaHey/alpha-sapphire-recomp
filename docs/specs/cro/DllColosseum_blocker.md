# DllColosseum clean-room blocker

## Scope and provenance

This record covers `cro/DllColosseum` for Pokémon Alpha Sapphire
`AS_EUR_REV2`. Observations were recorded on 2026-10-17. Public boundaries
were produced with Ghidra 12.0.2. Target-aware review used Arm GNU Toolchain
15.2.Rel1 `objdump` (binutils 2.45.1.20251203) in ARM mode and GNU `readelf`
2.46. The authoritative comparison used objdiff-cli 3.8.2; report inspection
used Node.js 24.21.0.

This document records high-level behavior, interface facts, and the resulting
clean-room stop condition only. It contains no target bytes, binary strings,
disassembly, instruction schedule, proprietary identities, or private paths.

## Observations

The existing eight-byte ARM leaf `func_00005278` remains an authoritative exact
match. It stores its byte-valued second argument at record offset 217 and
returns.

The smallest practical unmatched candidate is the 104-byte ARM function
`func_00002E8C`. It accepts a mutable record and an opaque 32-bit value. A byte
at record offset 160 selects integer 3 for values 4, 5, and 6, and integer 2
otherwise. The function stores the opaque value at record offset 168, reads a
context pointer at record offset 92, and makes two ordered calls to distinct
external collaborators. The first receives the context, selector, value, and
zero. The second receives the context, selector, value, one, and one. Neither
result is subsequently consumed.

A fresh implementer used only that contract and blind comparison feedback.
Natural behavior-equivalent C forms produced 88- or 92-byte functions with the
pinned public compiler and flags. The authoritative comparison failed. Closing
the public 104-byte boundary would require unjustified observable accesses,
optimization barriers, or target-derived scheduling not supplied by the
behavioral contract, so the attempted implementation was quarantined rather
than committed.

All other accepted unmatched functions contain at least one collaborator or
import call. No call-free, relocation-free unmatched candidate exists in the
accepted inventory.

## Completion boundary

The unit retains one exact function and 24 unmatched accepted functions. It
also retains unmatched data and non-function residue. The complete-object gate
must therefore remain fail-closed with `complete: false` until independently
specified code, data, relocations, layout, and residue prove whole-object
identity.
