# DllPssConfig direct-reverse-engineering completion

## Scope and behavior

This contribution implements the two remaining accepted ARM functions in
`cro/DllPssConfig`:

| Function | Address | Size | Role |
| --- | ---: | ---: | --- |
| `func_00000DC0` | `0x0DC0` | 176 | start and attach the configuration controller |
| `func_000015C4` | `0x15C4` | 512 | construct and configure the configuration object |

Together with the existing eight-byte byte setter, these routines complete the
unit's public accepted-function inventory: three functions and 696 accepted
code bytes.

The first routine prepares two resource identifiers, initializes controller
state, allocates a child object, attaches it to the controller, registers a
callback, starts the child, and records the active state. The second constructs
the child object, obtains and stores two related runtime objects, selects one of
two setup paths from its arguments, configures ten indexed entries, finalizes
the embedded object, and returns it. Call order and the ten-entry loop remain
explicit in the symbolic assembly.

The bounded instruction bodies own no relocation or literal-pool words and
match exactly:

- `func_00000DC0`: SHA-256
  `b239f3d94e287cafea19c90e739f0594aa78c769dd9ad01729bb3c474c794fa5`
- `func_000015C4`: SHA-256
  `979c4430fb0559268f4e5f6579134c749c55ea2ef33aa5e1e27c83f34ae7bb8c`

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
