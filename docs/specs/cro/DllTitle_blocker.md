# DllTitle direct-reconstruction progress

- Unit: `cro/DllTitle`
- Target revision: `AS_EUR_REV2`
- Batches: small leaves 01 through 03
- Date: 2026-10-18

This document records the incremental direct-reconstruction batches for the
larger DllTitle unit. The three batches contribute 29 accepted functions and
1,592 code bytes. Together with the two existing claims, DllTitle now has 31 of
128 functions and 1,620 of 55,160 code bytes accepted. The unit remains
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
