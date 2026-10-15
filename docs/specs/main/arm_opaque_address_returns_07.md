# ARM opaque address returns 07

## Provenance

- Target: `AS_EUR_REV2`
- Evidence source: independently observed behavior from the verified private target
- Analysis tools: GNU Arm Embedded `15.2.Rel1` disassembly and compilation, objdiff CLI `2.5.0`
- Analysis date: 2026-10-15
- Analyst role: behavior/specification only; no implementation source was consulted

## Common contract

Each function takes no arguments, returns the address of one process-global opaque
storage object, and has no observable side effect. The pointee's type, size, and
ownership are intentionally unspecified. Callers may compare or retain the returned
address but must not infer a representation from this specification.

The 42 storage identities below are all distinct from one another. Each identity is
local to this specification; the labels do not encode a target address.

| Function | Returned opaque storage identity |
| --- | --- |
| `func_00109B78` | `opaque_01` |
| `func_0010EE70` | `opaque_02` |
| `func_0010F278` | `opaque_03` |
| `func_0010F284` | `opaque_04` |
| `func_0010F290` | `opaque_05` |
| `func_00124248` | `opaque_06` |
| `func_00164F74` | `opaque_07` |
| `func_00179DD0` | `opaque_08` |
| `func_00186EB8` | `opaque_09` |
| `func_0019523C` | `opaque_10` |
| `func_001C3E0C` | `opaque_11` |
| `func_001C3E18` | `opaque_12` |
| `func_001C4624` | `opaque_13` |
| `func_001C4630` | `opaque_14` |
| `func_001C463C` | `opaque_15` |
| `func_001C4D94` | `opaque_16` |
| `func_001C4DA0` | `opaque_17` |
| `func_001C4DAC` | `opaque_18` |
| `func_001C4DB8` | `opaque_19` |
| `func_001C4DC4` | `opaque_20` |
| `func_001C4DD0` | `opaque_21` |
| `func_001C4EAC` | `opaque_22` |
| `func_001C4EB8` | `opaque_23` |
| `func_001C4EC4` | `opaque_24` |
| `func_001C4ED0` | `opaque_25` |
| `func_001C4EDC` | `opaque_26` |
| `func_001CA790` | `opaque_27` |
| `func_001CA7B4` | `opaque_28` |
| `func_001CE5AC` | `opaque_29` |
| `func_001CE5F0` | `opaque_30` |
| `func_001CF654` | `opaque_31` |
| `func_00201EDC` | `opaque_32` |
| `func_0020B92C` | `opaque_33` |
| `func_0020B938` | `opaque_34` |
| `func_002B0D50` | `opaque_35` |
| `func_002CD4CC` | `opaque_36` |
| `func_002FED78` | `opaque_37` |
| `func_002FF7EC` | `opaque_38` |
| `func_0040AC94` | `opaque_39` |
| `func_00410484` | `opaque_40` |
| `func_0045CECC` | `opaque_41` |
| `func_004C4030` | `opaque_42` |

## Match-validation requirement

The implementation may declare each storage identity as a neutral unresolved external;
it must not encode an absolute target address. A representative three-function C
probe generated the intended instructions and `R_ARM_ABS32` literal relocations.

The current generated target object omits literal-pool words and their relocations, so
those C probes score 50% even though their executable instructions agree. A neutral
target-object probe that emitted the adjacent literal word as an unresolved external
and included it in the function symbol extent matched all three representatives at
100%. Production validation therefore requires the target generator to reconstruct
neutral literal relocations from the private input at build time. Neither the target
literal value nor any target-derived byte belongs in Git.
