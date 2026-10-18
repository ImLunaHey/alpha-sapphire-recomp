# DllCommWait direct-reverse-engineering completion

## Scope and behavior

This contribution implements the two remaining accepted ARM functions in
`cro/DllCommWait`:

| Function | Address | Size | Role |
| --- | ---: | ---: | --- |
| `func_00000334` | `0x0334` | 632 | update the communication-wait state machine |
| `func_00000A2C` | `0x0A2C` | 400 | construct and configure the wait-scene object |

Together with the existing 328-byte scene-setup routine, these functions
complete the unit's public accepted-function inventory: three functions and
1,360 accepted code bytes.

The update routine decrements the active delay, dispatches ten communication
states, updates the scene object and shared state, schedules follow-up delays,
and advances the terminal state when the delay expires. The construction
routine initializes the scene object, prepares its resource parameters,
optionally copies and displays communication text, configures state-dependent
elements, and returns the object. The state dispatch and conditional setup
remain explicit in the symbolic assembly.

The bounded instruction bodies own no relocation or literal-pool words and
match exactly:

- `func_00000334`: SHA-256
  `e6701242b94aeb773cdf464f4930d60a89c14bae7bde2978ad230726b204cf33`
- `func_00000A2C`: SHA-256
  `9dca229e26563324af4925eedfdf23fcac494330ba60562daf595cc6dd77acbd`

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
