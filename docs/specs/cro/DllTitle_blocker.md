# DllTitle direct-reconstruction progress

- Unit: `cro/DllTitle`
- Target revision: `AS_EUR_REV2`
- Batch: small leaves 01
- Date: 2026-10-18

This document records the first incremental direct-reconstruction batch for the
larger DllTitle unit. The batch contributes 14 accepted functions and 456 code
bytes. Together with the two existing claims, DllTitle now has 16 of 128
functions and 484 of 55,160 code bytes accepted. The unit remains incomplete.

## Accepted functions

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

## Acceptance method

Each function was reconstructed from the target instruction stream as a
symbolic ARM assembly implementation, built independently, and compared
byte-for-byte with the corresponding target section. The completion validator
records the exact SHA-256 digest and expected size for every function. The
source-marker tests also require each accepted symbol to remain explicitly
owned by `src/cro/DllTitle/small_leaves_01.S`.

This is an incremental progress record, not a declaration that DllTitle is
complete. Later batches must independently meet the same exact-byte and source
ownership checks before receiving publication credit.
