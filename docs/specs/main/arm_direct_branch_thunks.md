# ARM direct-branch tail thunks

## Scope and clean-room classification

This specification audits all 27 direct-branch members of the four-byte ARM
inventory class. It covers 26 new implementation candidates. The remaining
member, `func_0050DDA0`, is repeated in the mapping for completeness but is
already specified separately by `arm_linker_veneers.md` and must not be emitted
twice.

Every covered symbol has the same externally observable behavior:

- accept and forward the incoming register arguments without modification;
- preserve the link register, all other non-program-counter registers, and the
  condition flags;
- perform no memory access itself; and
- tail-transfer unconditionally to the mapped destination.

The destination therefore returns directly to the thunk's original caller if
it follows the ordinary ARM procedure-call convention. The thunk itself has no
independent return path.

All 27 immediate transfers begin in ARM state and land on an ARM-aligned code
entry. There are no direct Thumb destinations and no state change in the thunk
instruction itself. Two destinations are ARM interworking bridges which then
transfer to Thumb state; those indirect state changes are called out below.

## Destination mapping

Names beginning with `observed_` are specification-local labels for executable
entry points which the conservative function inventory intentionally did not
promote to functions. They do not assert a source-level function boundary and
must not be added to the neutral inventory without separate boundary evidence.

| Thunk | Destination label | Transfer classification |
| --- | --- | --- |
| `func_00102384` | `observed_thumb_bridge_for_func_00102384` | ARM to ARM bridge, then Thumb |
| `func_00142620` | `observed_arm_entry_for_func_00142620` | ARM to ARM |
| `func_001584F0` | `observed_arm_svc_entry_for_func_001584F0` | ARM to ARM |
| `func_0015EC0C` | `observed_arm_return_entry_for_func_0015EC0C` | ARM to ARM |
| `func_00177750` | `observed_arm_entry_for_func_00177750` | ARM to ARM |
| `func_001AE400` | `observed_arm_entry_for_func_001AE400` | ARM to ARM |
| `func_001B4A00` | `observed_arm_entry_for_func_001B4A00` | ARM to ARM |
| `func_001BB000` | `observed_arm_entry_for_func_001BB000` | ARM to ARM |
| `func_002046B0` | `func_00184990` | ARM to ARM |
| `func_00214984` | `func_00160A64` | ARM to ARM |
| `func_00233D10` | `func_002412A4` | ARM to ARM |
| `func_002580AC` | `func_00184990` | ARM to ARM |
| `func_002782AC` | `func_00160A64` | ARM to ARM |
| `func_002AD63C` | `func_0024F928` | ARM to ARM |
| `func_002C23C8` | `func_001602B8` | ARM to ARM |
| `func_002C2454` | `func_00160380` | ARM to ARM |
| `func_002C7B58` | `observed_arm_return_entry_for_func_002C7B58` | ARM to ARM |
| `func_002E012C` | `func_0017454C` | ARM to ARM |
| `func_002FED34` | `func_00146000` | ARM to ARM |
| `func_002FF10C` | `func_002FF8C0` | ARM to ARM |
| `func_00300750` | `observed_thumb_import_bridge_for_func_00300750` | ARM to ARM bridge, then Thumb |
| `func_00390D9C` | `func_00391820` | ARM to ARM |
| `func_00391A5C` | `func_00391C28` | ARM to ARM |
| `func_00391B10` | `func_00391C28` | ARM to ARM |
| `func_003B7E98` | `func_003BBAE4` | ARM to ARM |
| `func_004F2BD8` | `func_002FECF8` | ARM to ARM |
| `func_0050DDA0` | `func_00146000` | ARM to ARM; already specified elsewhere |

The repeated destinations are intentional: two pairs share inventoried ARM
implementations, and `func_002FED34` shares its destination with the separately
specified `func_0050DDA0`.

## Relocatable implementation design

For each of the 26 new symbols, use an executable ARM section aligned to four
bytes, expose one global function symbol, and express the tail transfer against
the destination symbol rather than embedding a resolved instruction word. For
inventoried destinations, use the existing `func_` symbol directly. For an
`observed_` destination, keep its placement in ignored, target-derived build
metadata; the committed assembly should contain only the symbolic relationship
recorded above.

The unlinked assembly object must carry an `R_ARM_JUMP24` relocation for the
destination. A final placement-aware link can resolve that relocation for exact
comparison. Destination placement must be derived mechanically from the
verified private image or neutral inventory; do not copy resolved branch words
into source.

## Probe result

An ignored representative probe used `func_002046B0` and its inventoried
destination `func_00184990`. The hand-authored assembly contained a symbolic
tail transfer. GNU assembler produced one `R_ARM_JUMP24` relocation against the
destination, confirming that no resolved target word was embedded in the
source.

The current generated target object contains resolved instructions rather than
branch relocations. Comparing the unlinked probe directly against it therefore
gave a 40% fuzzy score, not an exact match. An ignored placement-aware final
link resolved the same symbolic relocation; objdiff then reported the complete
four-byte function as 100% matched, with one matched function and four matched
code bytes. This establishes the implementation shape and also records the
required build-system link step.

## Provenance

- Target: `AS_EUR_REV2`, verified code SHA-256
  `b7f9ce60361f3709ed0ce879658afe10a712f7db060640fa72bba826301b7c16`.
- Neutral inventory: `symbols/code.bin.csv`, SHA-256
  `4b7bcc35a838a2d4fe1c0cdbac2ccbe36b4df1ac24b91f1f8660693967c8c2fe`.
- Analysis date: 2026-10-15.
- Analysis tools: GNU Arm objdump and assembler 2.45.1.20251203 from Arm GNU
  Toolchain 15.2.Rel1; objdiff-cli 3.8.2.
- Method: enumerate all four-byte ARM inventory entries, independently classify
  terminal control transfers, resolve their immediate destinations against the
  neutral inventory, and validate non-inventoried destinations as ARM code
  entries in the private target. No leaked source, proprietary SDK header, ROM,
  extracted asset, instruction dump, or target byte is included here.
