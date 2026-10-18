# DllTitle direct-reconstruction progress

- Unit: `cro/DllTitle`
- Target revision: `AS_EUR_REV2`
- Batches: small leaves 01 through 10
- Date: 2026-10-18

This document records the incremental direct-reconstruction batches for the
larger DllTitle unit. The ten batches contribute 61 accepted functions and
7,080 code bytes. Together with the two existing claims, DllTitle now has 63 of
128 functions and 7,108 of 55,160 code bytes accepted. The unit remains
incomplete.

## Small leaves 01

| Function | Size | Neutral role |
|---|---:|---|
| `func_0000BF38` | 4 | Direct tail dispatch |
| `func_0000D434` | 40 | Output triple initialization |
| `func_0000D45C` | 24 | Byte/halfword record copy |
| `func_0000E258` | 32 | Ring-entry access |
| `func_0000E704` | 44 | Linked-record initialization |
| `func_0000EE88` | 52 | Capacity normalization |
| `func_000124F4` | 40 | Nested-state query |
| `func_0001BD60` | 44 | Record identity comparison |
| `func_0001C408` | 36 | Global pair store A |
| `func_0001C78C` | 20 | Global pair clear A |
| `func_0001C7A4` | 36 | Global pair store B |
| `func_0001C838` | 28 | Global pair clear B |
| `func_0001CBF8` | 20 | Global pair clear C |
| `func_0001CD0C` | 36 | Global pair store C |

## Small leaves 02

| Function | Size | Neutral role |
|---|---:|---|
| `func_0000E610` | 72 | Linked-sequence assignment |
| `func_0000E6B8` | 76 | List-head rotation |
| `func_0000E730` | 60 | Linked-container initialization |
| `func_0000F060` | 64 | Record-update dispatch |
| `func_0001230C` | 72 | Three-stage state dispatch |
| `func_00012360` | 60 | Secondary-state dispatch |
| `func_000123A0` | 60 | Primary-state dispatch |
| `func_0001251C` | 64 | Nested validation status A |
| `func_0001C73C` | 76 | Global-record allocation |
| `func_0001C880` | 60 | Global pair store D |
| `func_0001CE20` | 68 | Nested validation status B |

## Small leaves 03

| Function | Size | Neutral role |
|---|---:|---|
| `func_0000E658` | 96 | List-head rotation and counter increment |
| `func_0000EEBC` | 108 | Linked-container release |
| `func_000119C4` | 92 | Staged state dispatch |
| `func_00012488` | 108 | Nested validation loop |

## Small leaves 04

| Function | Size | Neutral role |
|---|---:|---|
| `func_0001157C` | 124 | Record-range release |
| `func_00012630` | 112 | Validated output query |
| `func_0001ABF0` | 120 | State-block initialization |
| `func_0001B640` | 132 | Tree left walk |
| `func_0001B6C4` | 132 | Tree right walk |

## Small leaves 05

| Function | Size | Neutral role |
|---|---:|---|
| `func_0000EDF4` | 148 | Counter rebalance |
| `func_0000F6E0` | 140 | Tree lookup and dispatch |
| `func_000105B8` | 136 | Record-range release pair |
| `func_000107E4` | 152 | Tree-traversal predicate |

## Small leaves 06

| Function | Size | Neutral role |
|---|---:|---|
| `func_0000E1B8` | 160 | Linked-chain release |
| `func_0000E340` | 160 | Tree-index access |
| `func_000129C8` | 160 | Multiword span adjustment |
| `func_00014CA8` | 160 | State-machine update |
| `func_000195D0` | 156 | Tree-traversal filter |

## Small leaves 07

| Function | Size | Neutral role |
|---|---:|---|
| `func_0000ED48` | 172 | Resource release and reset |
| `func_00010738` | 172 | Tree-entry activation |
| `func_000123E0` | 168 | Entry-collection release |
| `func_000155A4` | 168 | State-structure initialization |
| `func_0001AB40` | 172 | Resource attach and initialization |

## Small leaves 08

| Function | Size | Neutral role |
|---|---:|---|
| `func_000109B4` | 176 | Linked-record insertion |
| `func_00011FF8` | 176 | Render-entry configuration |
| `func_00012244` | 180 | Timed state transition |
| `func_00012F48` | 180 | Buffer-resource creation |
| `func_0001966C` | 196 | Tree-entry state reset |

## Small leaves 09

| Function | Size | Neutral role |
|---|---:|---|
| `func_0000E278` | 200 | Ring-entry advancement |
| `func_00011B84` | 200 | Indexed-resource replacement |
| `func_0001255C` | 212 | Validated-output extraction |
| `func_00012A68` | 208 | Polling state transition |
| `func_00012D6C` | 212 | Resource-state release |

## Small leaves 10

| Function | Size | Neutral role |
|---|---:|---|
| `func_0000DBF8` | 236 | Resource-pool initialization |
| `func_0000F76C` | 232 | Variable-length decoding |
| `func_00011044` | 236 | Ring-range copy |

## Acceptance method

Each function was reconstructed from the target instruction stream as a
symbolic ARM assembly implementation, built independently, and compared
byte-for-byte with the corresponding target section. The completion validator
records the exact SHA-256 digest and expected size for every function. The
source-marker tests also require each accepted symbol to remain explicitly
owned by the corresponding `src/cro/DllTitle/small_leaves_*.S` source.

This is an incremental progress record, not a declaration that DllTitle is
complete. Later batches must independently meet the same exact-byte and source
ownership checks before receiving publication credit.
