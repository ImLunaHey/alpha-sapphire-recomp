# DllTrainingAppManager implementation status

This directory contains a clean-room ARM implementation derived only from the
neutral specification in `docs/specs/cro/DllTrainingAppManager`.

Seven routines are integrated and byte-verified: the existing eight-byte
`func_00000BE4` contract and six supplemental leaves in `verified_leaves.S`.
Together they account for 52 executable bytes.  The supplemental validator
checks their public boundaries and SHA-256 range identities without requiring
a ROM, CRO, target object, or private report.

The remaining behavioral contracts are intentionally unclaimed.  The neutral
specification does not fix enough instruction-scheduling detail to assert their
published byte identities without further implementation work.  Non-code CRO
data is also not emitted because the public CRO base builder accepts executable
function sections only, and the complete rodata image is blocked on four RTTI
names that the clean-room handoff deliberately does not disclose.  No guessed
replacement strings or placeholder data are present here.
