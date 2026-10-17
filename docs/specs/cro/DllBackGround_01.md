# DllBackGround clean-room batch 01

Analysis specification for `AS_EUR_REV2`, prepared 2026-10-17. Evidence was
limited to the public neutral `DllBackGround` inventory and partition, the
ignored authoritative target object, and bounded control/data-flow inspection
with GNU Arm binutils 2.44. No implementation source for the selected function
was read or authored during analysis. This records externally observable
behavior and ABI facts, not an instruction schedule.

## `func_00002030`

The public inventory identifies an ARM-state function at text offset `0x2030`
with size `0xF8`. It accepts an output pointer in `r0` and a pointer to four
single-precision components in `r1`; it has no return value.

For each input component, the function clamps the value to the inclusive range
`[0.0f, 1.0f]`, multiplies it by `255.0f`, adds `0.5f`, converts the result to
an unsigned integer, and stores the low byte. The four results are written in
input order to consecutive output bytes. Positive and negative infinities
therefore saturate to 255 and 0 respectively. Ordinary finite inputs are
rounded to the nearest representable byte, with half-way values rounded up.

The implementation may express this as a four-component loop or equivalent
straight-line C. It must remain freestanding ARM code under the repository's
pinned compiler flags. The function body has no calls or relocations. Its four
adjacent scalar constants are literal data owned by the compiler output rather
than additional executable instructions.

Validation must require the exact public symbol boundary, an exact 248-byte
objdiff match, no relocations in the function body, and no accidental credit
outside the claimed function. This batch does not claim the rest of
`DllBackGround`: eight accepted functions, all unclassified executable ranges,
literal pools, unknown residue, and non-code sections remain independently
unmatched until separately specified and implemented.

## Independent implementation gate

A complete scan of the ignored published CRO target objects found one exact
duplicate body, `DllDendouDemo`'s neutral `func_00001DEC`; it is also currently
unmatched and therefore supplies corroborating behavior, not reusable source.

The repository's current CRO C flags use the soft-float ABI without enabling
VFP code generation. An independently authored C probe of the contract emitted
a 324-byte helper-call implementation and received no exact objdiff credit. A
separate VFP/softfp compiler probe preserved the public calling convention and
reached 46.322582% fuzzy similarity, but emitted a 252-byte symbol and placed
the four constants inside the function section. The target owns the constants
as a separate adjacent 16-byte pool and has a 248-byte function boundary.

Consequently this function must not be added to `config/cro-sources.json` from
the probe. Exact implementation requires a separately assigned implementation
role working only from this specification, plus a unit-scoped build path that
can preserve the accepted function/pool boundary. Target inspection or an
opaque byte/instruction transcription is not an acceptable substitute.
