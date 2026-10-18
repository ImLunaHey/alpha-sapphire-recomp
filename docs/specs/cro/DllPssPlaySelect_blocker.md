# DllPssPlaySelect direct-reverse-engineering completion

## Scope and behavior

This contribution implements the two remaining accepted ARM functions in
`cro/DllPssPlaySelect`:

| Function | Address | Size | Role |
| --- | ---: | ---: | --- |
| `func_00000658` | `0x0658` | 172 | start and attach the selection controller |
| `func_000008A0` | `0x08A0` | 428 | construct and configure the selection object |

Together with the existing eight-byte leaf, these functions complete the
unit's public accepted-function inventory: three functions and 608 accepted
code bytes.

The first routine creates two resource identifiers, initializes controller
state, allocates a child object, calls its startup callback, enables the
controller, and records its active flag. The second routine initializes the
child object, selects one of two resource-setup paths from its arguments,
configures six indexed entries, applies mode-specific state, finalizes the
embedded object, and returns it. Call order, repeated helper evaluation, and
the six-entry loop remain explicit in the symbolic assembly.

The bounded instruction bodies own no relocation words and match exactly:

- `func_00000658`: SHA-256
  `b1d34449591e33210719f631f93e6e5726611232cb51288c00805cb25f31acf3`
- `func_000008A0`: SHA-256
  `789a39ce9fa442a38401b8c3b0d76ccc604dc02166ced6f66a29fd0752f9c5ab`

## Provenance and limits

- Target: Pokémon Alpha Sapphire `AS_EUR_REV2`.
- Evidence: the public function inventory and partition, plus direct private
  inspection of the independently extracted target object.
- Tools: repository CRO converter/splitter, GNU Arm Embedded 14.2.Rel1, GNU
  binutils 2.44, and objdiff-cli 3.8.2.
- Observation date: 2026-10-18.
- Classification: direct reverse engineering. No leaked source, proprietary
  SDK material, copied byte tables, extracted assets, or target bytes are
  committed.

This completes only the accepted-function denominator. Executable gaps,
literal pools, read-only and writable data, BSS, relocations, and CRO container
metadata remain unowned, so `metadata.complete` must remain `false`.
