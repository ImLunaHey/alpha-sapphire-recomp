# Probe-verified ARM service helpers 92

## Scope and provenance

- Target: `AS_EUR_REV2`, independently verified in `docs/PROVENANCE.md`.
- Analysis date: 2026-10-17.
- Evidence: the authoritative unmatched-function report, neutral global-symbol
  inventory, recursive public ownership manifests, bounded private-target
  control/data-flow inspection, physical literal equality analysis,
  mode-aware direct-transfer resolution, and whole-text entry auditing.
- Clean-room role: analysis/specification only. No target bytes, instruction
  encodings, target-body hashes, private literal values, private strings,
  assets, canonical assembly, implementation, or proprietary source are
  present. The hashes below identify only the completed public implementation
  and its neutral semantic schedule.
- Implementation source SHA-256:
  `9d736edcb8d32b72b9b355b1af5d5ca014bb83c9181e5ec945311e618616e314`.
- Normalized semantic-schedule SHA-256:
  `76355b6ca8d079ae55d06299d2c562dbe38e3fc2e7368d3bef9d8f712ced6195`.

This batch covers the next four still-unmatched ARM service-state helpers after
IPC91. Their executable bodies total exactly 556 bytes (139 fixed-width ARM
instructions). A recursive repository-wide ownership scan found neither a
selected public entry nor any selected interior already owned as a configured
primary body, alias, secondary entry, literal code entry, or material owner.

Two bodies own their complete reached pools: eight bytes after
`func_00180C80` and twelve bytes after `func_00180E3C`. The intervening two
matched public helpers are not owned by this batch. No text-like material,
string, asset, jump table, padding, or unrelated unnamed helper is owned here.

## Function, extent, and semantic contract

| Function | Section | Body | Nearest following global | Contract |
|---|---|---:|---|---|
| `func_00180C80` | `.text.func_00180C80` | 152 | `func_00180D20` at +160 | Normalize one indexed state channel, lazily acquire its keyed record when absent, and copy an incoming record into that channel. |
| `func_00180D20` | `.text.func_00180D20` | 72 | `func_00180D68` at +72 | Copy a compact descriptor and six scalar fields into a service object, initialize its subordinate state, and mark both stages active. |
| `func_00180D68` | `.text.func_00180D68` | 188 | `func_00180E24` at +188 | Transition an existing service object, conditionally release its old subordinate state, copy replacement descriptor/payload fields, rebuild both stages, and mark the result active. |
| `func_00180E3C` | `.text.func_00180E3C` | 144 | `func_00180ED8` at +156 | Construct a service-state object, install its dispatch identity, initialize embedded state and scalar defaults, finalize the embedded object, and return the original object. |

All four authoritative report entries omit `fuzzy_match_percent`; their sizes
and ARM modes agree with the neutral inventory. Each complete selected body
has multiplicity one among all 10,440 inventoried global bodies. A mode-aware
whole-text audit found exactly three transfers from outside the cohort, all to
the official `func_00180E3C` entry, and none to any selected interior.

## Literal positional and equality contract

There are exactly five physical literal slots in four semantic identity
classes. Two classes reuse established public identities and two are new. The
symbolic identities and equality partition are normative; their private words
are not.

| Body | Slot | Load site(s) | Identity | Status |
|---|---:|---:|---|---|
| `func_00180C80` | +152 | +52 | `ipc_unit_scalar_54` | Reused from IPC54. |
| `func_00180C80` | +156 | +108 | `service_record_key_92` | New singleton class. |
| `func_00180E3C` | +144 | +8 | `service_object_dispatch_92` | New singleton class. |
| `func_00180E3C` | +148 | +52 | `ipc_unit_scalar_54` | Reused from IPC54 and equal to the first slot. |
| `func_00180E3C` | +152 | +64 | `service_zero_scalar_51` | Reused from IPC51. |

Private equality checks prove both unit-scalar slots belong to the established
`ipc_unit_scalar_54` class and the zero-scalar slot belongs to the established
`service_zero_scalar_51` class. The two new identities are mutually distinct
and distinct from the reused classes and every previously established class.
Starting from IPC91's 881 physical slots in 461 classes, this batch adds five
slots and two classes, yielding exact cumulative totals of 886 slots and 463
classes.

## Direct-transfer and entry contract

There are exactly fifteen symbolic linked direct transfers, each represented
by `R_ARM_CALL`. Nine destinations are four-byte-aligned ARM primary entries.
Three destinations are distinct four-byte-aligned ARM secondary entries:

- `service_index_secondary_91` retains IPC91's established relation at +92
  relative to bounding global `func_00187078`, 16 bytes before
  `func_001870E4`.
- `service_record_acquire_secondary_92` is at +12 relative to bounding global
  `func_00179DD0`, 172 bytes before `func_00179E88`.
- `service_subobject_init_secondary_92` is at +44 relative to bounding global
  `func_0017A8A8`, 20 bytes before `func_0017A8E8`.

There is no Thumb destination, external tail, or register-indirect call. The
bodies contain four local direct branches and four return instructions.

| Body | Offset | Relocation | Destination |
|---|---:|---|---|
| `func_00180C80` | +48 | `R_ARM_CALL` | `func_00187DEC` |
| `func_00180C80` | +68 | `R_ARM_CALL` | `func_00182C60` |
| `func_00180C80` | +84 | `R_ARM_CALL` | `service_index_secondary_91` |
| `func_00180C80` | +120 | `R_ARM_CALL` | `service_record_acquire_secondary_92` |
| `func_00180C80` | +136 | `R_ARM_CALL` | `func_0017A8E8` |
| `func_00180D20` | +52 | `R_ARM_CALL` | `func_0017541C` |
| `func_00180D20` | +60 | `R_ARM_CALL` | `service_subobject_init_secondary_92` |
| `func_00180D68` | +52 | `R_ARM_CALL` | `func_0017541C` |
| `func_00180D68` | +60 | `R_ARM_CALL` | `func_0018CCF4` |
| `func_00180D68` | +140 | `R_ARM_CALL` | `func_001882A4` |
| `func_00180D68` | +152 | `R_ARM_CALL` | `func_001882F8` |
| `func_00180D68` | +164 | `R_ARM_CALL` | `func_0017541C` |
| `func_00180D68` | +176 | `R_ARM_CALL` | `service_subobject_init_secondary_92` |
| `func_00180E3C` | +36 | `R_ARM_CALL` | `func_00145D10` |
| `func_00180E3C` | +132 | `R_ARM_CALL` | `func_0017048C` |

## Neutral instruction-level schedules

Each row describes the state transition performed at one four-byte instruction
offset. Register names, field displacements, conditions, transfer destinations,
and literal identities are interoperability facts. The rows intentionally do
not prescribe assembly syntax or an instruction encoding.

### `func_00180C80`

| Offset | Neutral operation |
|---:|---|
| +0 | Save `r4` through `r8` and the return address. |
| +4 | Copy `r1` to `r4`. |
| +8 | Copy `r0` to `r5`. |
| +12 | Set `r6` to `r0 + (r4 << 4)`. |
| +16 | Set `r0` to `r6 + 20`. |
| +20 | Save VFP register `d8`. |
| +24 | Copy `r2` to `r7`. |
| +28 | Load consecutive words at `[r0 + 8]` into `r0` and `r1`. |
| +32 | Compare `r1` with `r0` using the signed relation. |
| +36 | If `r1 >= r0`, continue at +52. |
| +40 | Copy `r4` to `r1`. |
| +44 | Copy `r5` to `r0`. |
| +48 | Linked transfer to `func_00187DEC`. |
| +52 | Load VFP scalar `s16` from the +152 `ipc_unit_scalar_54` slot. |
| +56 | Set `r0` to `r6 + 20`. |
| +60 | Set `r1` to zero. |
| +64 | Copy scalar `s16` to `s0`. |
| +68 | Linked transfer to `func_00182C60`. |
| +72 | Copy scalar `s16` to `s0`. |
| +76 | Sign-extend the low byte of `r4` into `r0`. |
| +80 | Copy `r0` to `r6`. |
| +84 | Linked transfer to `service_index_secondary_91`. |
| +88 | Set `r0` to `r4 + (r4 << 1)`. |
| +92 | Add `r0 << 2` to `r5`. |
| +96 | Add 84 to `r5`, write the updated address back to `r5`, and load its word into `r0`. |
| +100 | Compare `r0` with zero. |
| +104 | If nonzero, continue at +124. |
| +108 | Load `r1` from the +156 `service_record_key_92` slot. |
| +112 | Copy `r4` to `r2`. |
| +116 | Copy `r6` to `r0`. |
| +120 | Linked transfer to `service_record_acquire_secondary_92`. |
| +124 | Copy `r5` to `r0`. |
| +128 | Set `r1` to `r5 + 4`. |
| +132 | Set `r2` to `r7 + 4`. |
| +136 | Linked transfer to `func_0017A8E8`. |
| +140 | Restore VFP register `d8`. |
| +144 | Set `r0` to one. |
| +148 | Restore `r4` through `r8` and return through the saved program counter. |

### `func_00180D20`

| Offset | Neutral operation |
|---:|---|
| +0 | Save `r4` through `r6` and the return address. |
| +4 | Copy `r0` to `r4`. |
| +8 | Load the word at `[r1]` into `r0`. |
| +12 | Set `r5` to one. |
| +16 | Store `r0` at `[r4 + 108]`. |
| +20 | Load the byte at `[r1 + 4]` into `r0`. |
| +24 | Store the low byte of `r0` at `[r4 + 112]`. |
| +28 | Load the word at `[r1 + 8]` into `r0`. |
| +32 | Store `r0` at `[r4 + 116]`. |
| +36 | Set `r0` to `r4 + 172`. |
| +40 | Load six consecutive VFP scalars from the address in `r2` into `s0` through `s5`, without base writeback. |
| +44 | Store `s0` through `s5` consecutively at the address in `r0`, without base writeback. |
| +48 | Store the low byte of `r5` at `[r4 + 160]`. |
| +52 | Linked transfer to `func_0017541C`. |
| +56 | Set `r1` to `r4 + 80`. |
| +60 | Linked transfer to `service_subobject_init_secondary_92`. |
| +64 | Store the low byte of `r5` at `[r4 + 162]`. |
| +68 | Restore `r4` through `r6` and return through the saved program counter. |

### `func_00180D68`

| Offset | Neutral operation |
|---:|---|
| +0 | Save `r4` through `r8` and the return address. |
| +4 | Copy `r0` to `r4`. |
| +8 | Copy `r1` to `r5`. |
| +12 | Load the byte at `[r0 + 12]` into `r0`. |
| +16 | Copy `r2` to `r6`. |
| +20 | Set `r7` to one. |
| +24 | Compare `r0` with zero. |
| +28 | If equal, continue at +80. |
| +32 | Load the byte at `[r4 + 162]` into `r0`. |
| +36 | Set `r8` to zero. |
| +40 | Store the low byte of `r7` at `[r4 + 15]`. |
| +44 | Compare `r0` with zero. |
| +48 | If equal, continue at +68. |
| +52 | Linked transfer to `func_0017541C`. |
| +56 | Set `r1` to `r4 + 80`. |
| +60 | Linked transfer to `func_0018CCF4`. |
| +64 | Store the low byte of `r8` at `[r4 + 162]`. |
| +68 | Load the byte at `[r4 + 13]` into `r0`. |
| +72 | Compare `r0` with zero. |
| +76 | Only when `r0` is nonzero, store the low byte of `r8` at `[r4 + 13]`. |
| +80 | Load the word at `[r5]` into `r0`. |
| +84 | Store `r0` at `[r4 + 108]`. |
| +88 | Load the byte at `[r5 + 4]` into `r0`. |
| +92 | Store the low byte of `r0` at `[r4 + 112]`. |
| +96 | Load the word at `[r5 + 8]` into `r0`. |
| +100 | Store `r0` at `[r4 + 116]`. |
| +104 | Load the word at `[r6]` into `r0`. |
| +108 | Store `r0` at `[r4 + 100]`. |
| +112 | Load the word at `[r6 + 4]` into `r0`. |
| +116 | Store `r0` at `[r4 + 104]`. |
| +120 | Load the byte at `[r6 + 8]` into `r1`. |
| +124 | Set `r0` to three. |
| +128 | Store the low byte of `r1` at `[r4 + 95]`. |
| +132 | Store the low byte of `r0` at `[r4 + 160]`. |
| +136 | Store the low byte of `r7` at `[r4 + 12]`. |
| +140 | Linked transfer to `func_001882A4`. |
| +144 | Set `r1` to `r4 + 68`. |
| +148 | Preserve all architectural state; this is an explicit scheduling slot. |
| +152 | Linked transfer to `func_001882F8`. |
| +156 | Preserve all architectural state; this is an explicit scheduling slot. |
| +160 | Preserve all architectural state; this is an explicit scheduling slot. |
| +164 | Linked transfer to `func_0017541C`. |
| +168 | Set `r1` to `r4 + 80`. |
| +172 | Preserve all architectural state; this is an explicit scheduling slot. |
| +176 | Linked transfer to `service_subobject_init_secondary_92`. |
| +180 | Store the low byte of `r7` at `[r4 + 162]`. |
| +184 | Restore `r4` through `r8` and return through the saved program counter. |

### `func_00180E3C`

| Offset | Neutral operation |
|---:|---|
| +0 | Save `r4` through `r6` and the return address. |
| +4 | Copy `r0` to `r4`. |
| +8 | Load `r0` from the +144 `service_object_dispatch_92` slot. |
| +12 | Set `r5` to zero. |
| +16 | Set `r1` to one. |
| +20 | Store `r0` at `[r4]`. |
| +24 | Set `r0` to `r4 + 4`. |
| +28 | Store `r5` at `[r4 + 4]`. |
| +32 | Store `r5` at `[r4 + 8]`. |
| +36 | Linked transfer to `func_00145D10`. |
| +40 | Store the low byte of `r5` at `[r4 + 12]`. |
| +44 | Store the low byte of `r5` at `[r4 + 13]`. |
| +48 | Store the low byte of `r5` at `[r4 + 14]`. |
| +52 | Load VFP scalar `s1` from the +148 `ipc_unit_scalar_54` slot. |
| +56 | Store the low byte of `r5` at `[r4 + 15]`. |
| +60 | Store the low byte of `r5` at `[r4 + 16]`. |
| +64 | Load VFP scalar `s0` from the +152 `service_zero_scalar_51` slot. |
| +68 | Store `s1` at `[r4 + 20]`. |
| +72 | Store `s1` at `[r4 + 24]`. |
| +76 | Store `s0` at `[r4 + 28]`. |
| +80 | Store `s0` at `[r4 + 32]`. |
| +84 | Set `r0` to `r4 + 20`. |
| +88 | Store `s0` at `[r4 + 36]`. |
| +92 | Set `r1` to 255. |
| +96 | Store the low byte of `r5` at `[r4 + 46]`. |
| +100 | Store the low byte of `r1` at `[r0 + 24]`. |
| +104 | Store `s0` at `[r4 + 40]`. |
| +108 | Store `s0` at `[r4 + 48]`. |
| +112 | Store the low byte of `r5` at `[r4 + 52]`. |
| +116 | Store the low byte of `r5` at `[r4 + 53]`. |
| +120 | Store `s0` at `[r4 + 56]`. |
| +124 | Store `s0` at `[r4 + 60]`. |
| +128 | Set `r0` to `r4 + 4`. |
| +132 | Linked transfer to `func_0017048C`. |
| +136 | Copy `r4` to `r0`. |
| +140 | Restore `r4` through `r6` and return through the saved program counter. |

## Verification obligations

- Independently reconstruct four ARM functions with executable sizes 152, 72,
  188, and 144 bytes; exclude all five adjacent slots from function sizes.
- Emit exactly fifteen `R_ARM_CALL` relocations and five `R_ARM_ABS32`
  relocations at the configured offsets, with no other relocation in an owned
  extent.
- Preserve the three secondary-entry relations and keep all twelve direct-call
  identity classes pairwise distinct except for the two explicitly shared
  classes.
- Preserve all four local branches, four return instructions, explicit
  state-preserving scheduling slots, and the two six-scalar VFP transfers.
- Emit exactly five adjacent slots in the stated four-class equality
  partition; resolve them symbolically rather than embedding private values.
- Verify every independently authored owned byte against the private target at
  the configured virtual address before integration.
