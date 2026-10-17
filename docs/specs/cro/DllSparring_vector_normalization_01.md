# DllSparring vector normalization

## Scope and provenance

This analysis-role handoff specifies only the accepted, currently unmatched
`func_0000DD90` in `cro/DllSparring`. It is a new behavioral specification for
independent review and implementation; it grants no match or completion credit.

- Target revision: Pokemon Alpha Sapphire `AS_EUR_REV2`.
- Observation date: 2026-10-17.
- Tools: Node.js 24.21.0, Python 3.12.12, Unicorn 2.1.3, and Capstone 5.0.7,
  together with the checked-out repository CRO parser and converter.
- Method: the privately supplied module agreed with the intended revision's
  public manifest, and a fresh conversion in memory agreed with the analyzed
  verification object. Public inventories confirmed the accepted symbol and
  absence of an existing source claim. Standalone CPU emulation then exercised
  synthetic vectors and storage arrangements. These were function-level
  observations, not gameplay or physical-console observations.

Private verification inputs remained outside Git. No proprietary source or SDK
material was consulted. The specification retains only behavioral and interface
facts, without a target representation or compiler-lowering prescription.

## Interface

The function takes a destination vector followed by a source vector. Each vector
is an ordinary array of three single-precision floating-point components in
component order. Source storage must be readable, destination storage writable,
and both suitably aligned for platform floating-point access. The function
returns the destination pointer.

The scalar and pointer terminology follows the public
[Arm Procedure Call Standard](https://github.com/ARM-software/abi-aa/blob/main/aapcs32/aapcs32.rst).
The game-specific vector operation and argument roles were established by the
private observations, rather than inferred from that standard or the module
name.

## Observable behavior

For an ordinary finite, nonzero source vector `v`, the destination is the
Euclidean unit vector in the same direction: `v / ||v||`. Component order and
component signs are preserved, subject to single-precision rounding. For
example, `(3, 4, 0)` produces approximately `(0.6, 0.8, 0)`, and `(0, 0, -2)`
produces `(0, 0, -1)`.

The operation uses the source values present on entry. Disjoint storage, exact
in-place operation, and aligned partial overlap produce the same result.
Storage outside the destination vector remains unchanged. Consequently,
disjoint source storage is preserved.

The numerical observations use round-to-nearest arithmetic with floating-point
exception traps disabled and gradual underflow enabled. In this environment:

- A zero vector produces three NaNs; it is not replaced by a fallback direction.
- A NaN source component propagates NaN to every destination component.
- With infinite source components, those components produce NaNs and finite
  components produce signed zeros following their source signs.
- Extremely large finite vectors can produce signed zeros when the numerical
  squared length overflows.
- When the numerical squared length underflows to zero, nonzero source
  components can produce signed infinities and zero components can produce NaNs.

NaN payloads, NaN signs, exception-status flags, and behavior under other
floating-point modes are unspecified by this handoff. Invalid storage is
outside the interface contract.

## Observation coverage and limits

Synthetic probes covered coordinate-axis vectors, mixed signs, unequal
components, zero components, ordinary random vectors, and vectors scaled over
a wide range of finite magnitudes. For the ordinary finite probes, each result
component differed from the real-valued normalization reference by less than
one part per million in absolute value, and the resulting length differed
from one by less than one part per million. This is observed numerical
coverage, not an exhaustive error bound for all floating-point inputs.

The probes also checked destination-pointer return, unchanged surrounding
storage, disjoint-source preservation, exact and partial overlap, NaNs,
infinities, signed zeros, and representative underflow and overflow cases.
No independent implementation or objdiff comparison was performed. The other
DllSparring functions and existing contract_05 materials are outside this
handoff.

## Implementation status

A separate target-blind role implemented this contract in portable C. Fresh
private comparison found that implementation non-identical, so it was removed
without a source claim or progress credit. The behavioral evidence does not
determine the target's compiler lowering, and using target-derived instruction
details to tune a replacement would violate the clean-room boundary. Further
implementation therefore remains blocked pending new admissible evidence or an
independently authored implementation that can be verified without oracle-led
tuning.
