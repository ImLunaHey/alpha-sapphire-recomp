# Neutral ARM service-helper specification 94

## Scope and provenance

- Target: `AS_EUR_REV2`, with provenance governed by `docs/PROVENANCE.md`.
- Analysis date: 2026-10-17.
- Clean-room role: analysis and semantic specification only.
- Implementation source identity: `sourceHash: 2758855600930c169c71d865467df566e1271b6885da54b51787ea455e41c4ac`.
- Evidence used: the unmatched-function report, neutral global-symbol inventory,
  recursive public ownership manifests, bounded private-target control/data-flow
  inspection, mode-aware direct-transfer resolution, and whole-text entry audit.
- Excluded from this document: target bytes, encodings, disassembly text,
  assembler source, private values, strings, assets, and target hashes.

The cohort contains the next three suitably bounded unmatched ARM service
helpers after IPC93. Their executable bodies total 708 bytes, or 177 ordered
four-byte semantic slots. The bodies own six adjacent literal words (24 bytes),
so their complete extents total 732 bytes. `func_00180F24` remains excluded: its
1,356-byte multi-loop scheduler/dispatcher is outside the bounded wrapper
cohort. Every global between the selected entries is already matched; the next
otherwise suitable unmatched entry is `func_00183E28`.

A recursive ownership scan found no selected entry, selected interior, or
selected adjacent word already owned as a public primary body, alias, secondary
entry, literal code entry, or material owner. Each complete body occurs once in
the 10,440-body inventory. A mode-aware whole-text scan found three external
linked transfers to the primary entry `func_001821A0` and no external transfer
to an interior selected address. Entry references do not enlarge any owned
extent.

## Function and extent contract

| Function | Section | Body | Following global | Semantic contract |
|---|---|---:|---|---|
| `func_00181890` | `.text.func_00181890` | 216 | `func_0018196C` at +220 | Validate an active owner and record, install record linkage and copied descriptor fields, allocate a sequence value, publish the record, and return success. |
| `func_00181FD4` | `.text.func_00181FD4` | 260 | `func_001820E4` at +272 | Lazily establish a guarded callback registry, walk its circular links, and invoke each callback for a caller-supplied half-open interval. |
| `func_001821A0` | `.text.func_001821A0` | 232 | `func_00182290` at +240 | Build a sixteen-byte geometry request from active state or defaults, pack two halfword coordinates, and submit one request. |

The first body owns one adjacent word, the second owns three, and the third
owns two. All six literal identities are new and pairwise distinct. IPC
cumulative accounting advances from 886 physical slots in 463 value classes to
892 slots in 469 classes.

## Transfer, return, and relocation contract

Exactly seven linked direct transfers require `R_ARM_CALL` relocations. Four
distinct primary-entry identities are involved. `func_00302F52` is a
two-byte-aligned Thumb primary entry and each transfer to it exchanges state;
the other three destinations are four-byte-aligned ARM primary entries.

| Body | Offset | Relocation | Transfer relation | Stable destination |
|---|---:|---|---|---|
| `func_00181890` | +192 | `R_ARM_CALL` | linked | `func_00174DD0` |
| `func_00181890` | +204 | `R_ARM_CALL` | linked | `func_0018C888` |
| `func_00181FD4` | +40 | `R_ARM_CALL` | linked, state-exchanging | `func_00302F52` |
| `func_00181FD4` | +100 | `R_ARM_CALL` | linked, state-exchanging | `func_00302F52` |
| `func_00181FD4` | +204 | `R_ARM_CALL` | linked, state-exchanging | `func_00302F52` |
| `func_001821A0` | +160 | `R_ARM_CALL` | linked | `func_0016DFE8` |
| `func_001821A0` | +220 | `R_ARM_CALL` | linked | `func_0016DFE8` |

`func_00181FD4` additionally performs one register-indirect state-exchanging
call at +180 through `r3`; it has no relocation. Returns occur at +16 and +212
in `func_00181890`, at +256 in `func_00181FD4`, and at +168 and +228 in
`func_001821A0`. The +16 return is conditional. There is no direct tail
transfer and no secondary-entry destination.

## Adjacent literal contract

Each adjacent word has one `R_ARM_ABS32` relocation to the stable identity
shown below. No private value is part of this specification.

| Owner | Word offset | Referencing slots | Stable identity | Semantic role |
|---|---:|---|---|---|
| `func_00181890` | +216 | +32 | `service_request_sequence_94` | Address of the halfword sequence source updated when a record is installed. |
| `func_00181FD4` | +260 | +12, +96, +132, +200, +236 | `service_callback_registry_guard_94` | Address of the registry's lazy-initialization guard. |
| `func_00181FD4` | +264 | +16, +140, +244 | `service_callback_registry_sentinel_94` | Stable circular-list sentinel identity. |
| `func_00181FD4` | +268 | +76, +116, +220 | `service_callback_registry_anchor_94` | Address of the registry anchor record. |
| `func_001821A0` | +232 | +12 | `service_geometry_defaults_94` | Base identity for geometry scalar and default-record loads. |
| `func_001821A0` | +236 | +16 | `service_packed_coordinate_bias_94` | Bias used to form the packed coordinate word. |

## Structured semantic slot schedule

Each row is an ordered sequence of four-byte slots. Offsets are inclusive and
advance by four in the exact order described. Register names, conditions,
memory widths, displacements, stack locations, transfer identities, and local
destinations are interoperability facts; the prose does not prescribe textual
assembly or binary encoding.

### `func_00181890`

| Offsets | Ordered semantic slots |
|---:|---|
| +0..+16 | Load the byte at `[r0 + 80]` into `r12`; compare it with zero; if nonzero compare `r1` with zero; if either comparison fails set `r0` to zero; under that same failure condition return through the incoming return address. |
| +20..+52 | Save `r4` through `r6` and the return address; set `r12` to zero; store `r1` at `[r0 + 96]`; load `service_request_sequence_94` into `r4`; store the low byte of `r2` at `[r0 + 120]`; store `r3` at `[r0 + 124]`; set `r5` to one; store low-byte zero at `[r0 + 86]`; store low-byte one at `[r0 + 12]`. |
| +56..+76 | Load the halfword at `[r4]` into `r2`; set `r3` to `r0 + 7168`; set `r6` to `r0 + 128`; set `r5` to `r2 + 1`; store the original halfword at `[r3 + 148]`; store the incremented low halfword at `[r4]`. |
| +80..+108 | Store `r0` and `r6` at record offsets 16 and 24; load the owner byte at +232; retain the record pointer in `r4`; store that byte at record +28; copy the owner word at +252 to record +32; copy the owner byte at +233 to record +36. |
| +112..+140 | Copy owner words +236 and +240 to record +40 and +44; reload the allocated halfword from `[r3 + 148]` and store it at record +56; copy owner word +244 to record +48. |
| +144..+168 | Copy owner bytes +248, +249, and +250 to record bytes +52, +53, and +54; load record word +20 into `r0`; store it at record +0. |
| +172..+188 | Store zero at record +88; store the record's own address at record +132 and record +128. |
| +192..+204 | Linked transfer to `func_00174DD0`; set `r2` to one; set `r1` to record +104; linked transfer to `func_0018C888`. |
| +208..+212 | Set `r0` to one; restore `r4` through `r6` and return. |

### `func_00181FD4`

| Offsets | Ordered semantic slots |
|---:|---|
| +0..+20 | Save `r4` through `r10` and the return address; retain `r1` in `r7`; set `r8` to `r1 + r2`; load the guard identity into `r10`; load the sentinel identity into `r6`; set `r9` to zero. |
| +24..+32 | Load `[r10]`; test bit zero; if it is set continue at +76. |
| +36..+48 | Copy `r10` to `r0`; linked state-exchanging transfer to `func_00302F52`; compare the result with zero; if zero continue at +76. |
| +52..+72 | Set `r0` to `r6 - 4`; store `r6` at `[r0 + 4]` and `[r0 + 8]`; store zero at `[r0]`; copy `r10` to `r0`; preserve `r0` unchanged for one scheduling slot. |
| +76..+92 | Load the anchor identity into `r0`; load `[r0 + 4]` into `r4`; load `[r10]`; test bit zero; if it is set continue at +140. |
| +96..+112 | Reload the guard identity into `r0`; linked state-exchanging transfer to `func_00302F52`; compare the result with zero; preserve architectural state for one scheduling slot; if the result is zero continue at +140. |
| +116..+136 | Reload the anchor identity into `r0`; store `r6` at `[r0 + 4]` and `[r0 + 8]`; store zero at `[r0]`; reload the guard identity into `r0`; preserve `r0` unchanged for one scheduling slot. |
| +140..+148 | Reload the sentinel identity into `r0`; compare `r4` with it; if equal continue at +256. |
| +152..+180 | Set `r1` to `r4 - 4`; copy `r4` to `r0`; load consecutive words from `[r1]` into `r1` and `r4`; subtract four from `r0`; copy the retained interval end to `r2`; load `[r1 + 8]` into `r3`; copy the retained interval start to `r1`; call through `r3` with state exchange. |
| +184..+196 | Load `[r10]` into `r0`; copy `r4` to `r5`; test bit zero of `r0`; if set continue at +244. |
| +200..+216 | Reload the guard identity into `r0`; linked state-exchanging transfer to `func_00302F52`; compare the result with zero; preserve architectural state for one scheduling slot; if the result is zero continue at +244. |
| +220..+240 | Reload the anchor identity into `r0`; store `r6` at `[r0 + 4]` and `[r0 + 8]`; store zero at `[r0]`; reload the guard identity into `r0`; preserve `r0` unchanged for one scheduling slot. |
| +244..+256 | Reload the sentinel identity into `r0`; compare `r5` with it; if unequal continue at +152; otherwise restore `r4` through `r10` and return. |

### `func_001821A0`

| Offsets | Ordered semantic slots |
|---:|---|
| +0..+16 | Save `r4` through `r7` and the return address; reserve 20 stack bytes; load `[r0]` into `r2`; load `service_geometry_defaults_94` into `r12`; load `service_packed_coordinate_bias_94` into `r3`. |
| +20..+32 | Add 3328 to `r2`; load byte `[r2 + 72]` into `r4`; compare it with zero; if zero continue at +172. |
| +36..+64 | Load the input halfword at `[r1]` into `r4`; load state halfwords +64, +66, and +68 into `r5`, `r6`, and `r7`; load a VFP scalar from defaults +600 into `s2`; load input halfword +2 into `r1`; set `r12` to defaults +588; load state halfword +70 into `r2`. |
| +68..+100 | Subtract `r5` from `r4`; load consecutive VFP scalars from `[r12]` into `s0` and `s1`; subtract `r6` from `r1`; subtract `r7` from `r4`; store `s2` at stack +12; subtract state halfword `r2` from `r1`; zero-extend the low halfword of `r4` into `r2`; store `s0` and `s1` consecutively at stack +0. |
| +104..+124 | Reload `[r0]` into `r0`; combine `r2` with `r1` shifted left 16 into `r12`; store it at stack +8; subtract one from `r2`; add 3328 to `r0`; load state halfword +70 into `r12`. |
| +128..+144 | Load state halfword +68 into `r0`; add `r12` to `r1`; add `r2` to `r0`; add `(r1 << 16)` to `r3` and place the result in `r1`; combine `r0` and `r1`. |
| +148..+168 | Store the combined word at stack +12; set `r2` to one; set `r1` to 16; copy the stack pointer to `r0`; linked transfer to `func_0016DFE8`; release the 20 stack bytes; restore saved registers and return. |
| +172..+184 | Set `r12` to defaults +604; load four consecutive words from `[r12]` into `r0`, `r2`, `r4`, and `r12`; store those four words consecutively at stack +0; set `r2` to one. |
| +188..+208 | Load input halfwords +0 and +2 into `r0` and `r1`; subtract one from `r0`; add `(r1 << 16)` to the retained bias in `r3` and place the result in `r1`; combine `r0` and `r1`; store the result at stack +12. |
| +212..+228 | Set `r1` to 16; copy the stack pointer to `r0`; linked transfer to `func_0016DFE8`; release the 20 stack bytes; restore saved registers and return. |

## Verification obligations

- Reconstruct three ARM bodies of exactly 216, 260, and 232 bytes and six
  adjacent words at the configured offsets, for an exact 732-byte owned total.
- Preserve all 177 ordered executable slots, including the five explicitly
  state-preserving scheduling slots in `func_00181FD4`.
- Emit exactly seven `R_ARM_CALL` relocations and six adjacent `R_ARM_ABS32`
  relocations; emit no other relocation in the owned extents.
- Preserve the three state-exchanging direct transfers, the one register-
  indirect state-exchanging call, and all five return sites.
- Preserve two shared direct-destination classes, two singleton classes, and
  six new pairwise-distinct literal identities.
- Do not claim or absorb `func_00180F24`, `func_00183E28`, any intervening
  already-matched global, or any bytes beyond the configured adjacent words.
