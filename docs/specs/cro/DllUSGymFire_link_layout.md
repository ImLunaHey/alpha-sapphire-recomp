# DllUSGymFire link and completion boundary

## Public accounting

The module's public text extent is 6,424 bytes. The current accepted source owns
59 functions and 492 instruction bytes. The public partition deliberately keeps
all other text as gaps, pools, or unknown ranges; it does not reinterpret those
ranges merely to improve the score.

The current comparison classifies 5,892 bytes as code and 1,056 bytes in the
data denominator:

- 460 bytes of text-resident pools;
- 576 bytes of read-only data;
- 4 bytes of initialized writable data;
- 16 bytes of BSS.

The partition retains 72 unknown text bytes. None of the 1,056 data bytes or 72
unknown bytes is claimed as matched by this implementation.

## Relocation boundary

The verified module contains 123 relocations: 93 associated with text and 30
with read-only data. The authored veneer family intentionally contributes only
52 neutral `R_ARM_ABS32` slots. Target-aware validation proves the logical
module offset, type, zero addend, and one-to-one normalized ordinal identity for
every slot. The proprietary external binding names and the remaining relocation
schedule are not published or reconstructed here.

## Artifact boundary

The repository compares an authored relocatable object with a normalized split
target object. Regenerating the split object from the verified structural input
produces equivalent owned payload/relocation semantics but not byte-identical
ELF metadata to the cached split object. Section ordering and string/header
layout therefore remain part of an unresolved normalization decision.

The repository's completion gate is intentionally stricter than a 100% score
for accepted functions: it requires whole target/base object identity and no
unknown sections. This unit satisfies neither condition, so
`metadata.complete` is genuinely false.

## Full-link blockers

A full clean-room link still requires concise, independently derivable
specifications for the unmatched behavior and approved constructions for the
opaque resource/data identities and exact foreign bindings. It also requires a
pinned normalized ELF target and resolution of full-module loader/header
metadata obligations. Hashes or exhaustive binary-derived schedules are
verification aids only and are not construction specifications.
