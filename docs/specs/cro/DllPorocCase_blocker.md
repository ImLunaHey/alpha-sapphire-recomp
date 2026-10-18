# DllPorocCase clean-room blocker

## Scope and provenance

This record covers `cro/DllPorocCase` for Pokemon Alpha Sapphire
`AS_EUR_REV2`. The provenance audit was performed on 2026-10-17 against local
`main` revision `c1c12671a37662260a3fc3d4c545471a9a748dfc` after reading
`docs/CLEAN_ROOM.md` in full.

The quarantine state and findings were revalidated after rebasing this
corrective unit onto exact `main` revision
`764841c00812bed4d342a6240eb6b571e7ebbad8`; the ScreenEffect,
FatalErrorProc, NumberInput, and LangSelect clean-room gates were preserved.

The audit used the repository toolchain and only the repository's
committed clean-room policy, neutral symbol inventory, partition metadata,
source registry, public report, and Git history. `ROM_PATH` and
`DECOMP_PRIVATE` were unset and `objdiff` was unavailable on `PATH`. No ROM,
CRO, extracted asset, target object, disassembly, proprietary source or
header, private path, copied instruction schedule, register/offset/relocation
ledger, or target-derived implementation aid was used.

This is a provenance and publication record, not a behavioral specification.
No replacement implementation was attempted.

## Quarantine finding

The public baseline report credited a small set of implementations without
adequate unit-specific provenance. Those implementations, their source-registry
claims, and the shared batch documents that describe them entered together in bulk commit
`7b14dec86f268f5fc974cfb4e36a8361fd31639f`.

Repository history contains no independently attributed, unit-specific
analysis artifact, approved neutral behavioral specification, isolated
implementer handoff, or implementation-role attestation for these functions.
The shared batch documents do not record function-specific observations,
inputs, outputs, side effects, preconditions, edge cases, analyst identity,
tool version, or observation date. Byte identity and short semantic labels do
not establish strict two-party clean-room provenance.

Because provenance is insufficient, the affected implementations and their
source-registry claims are quarantined rather than rewritten. The neutral CSV
inventory, partition, and public unit manifest remain structural accounting
only; they do not establish behavior. After quarantine the unit must publish
no match credit or authored source path and must remain explicitly incomplete.

The shared batch documents and validators may be updated only as necessary to
remove `DllPorocCase` from their aggregates. Those updates must not pin or
otherwise freeze unrelated units' legitimate future progress.

## Stop condition

Implementation remains blocked until a separate analysis contributor provides
a reviewed, provenance-bearing neutral behavioral and interface specification
derived without prohibited material. A distinct implementer who has not seen
target internals may then write original source solely from that specification.

Promotion additionally requires a deterministic build, authoritative
byte-identical objdiff/report evidence, and review through the repository's
central publication-integrity gate together with the applicable shared
contract gate. Those gates remain responsible for fail-closed repository
inputs, publication identities, and coordinated credit accounting; this unit
does not duplicate that logic.

Those prerequisites are not present, so no replacement source, match credit,
or completion claim is justified.
