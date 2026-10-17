# Neutral ARM service-helper specification 96

## Scope and provenance

- Target: `AS_EUR_REV2`, with provenance governed by `docs/PROVENANCE.md`.
- Analysis date: 2026-10-17.
- Clean-room role: analysis and semantic specification only.
- Evidence used: the authoritative unmatched-function report, neutral global-
  symbol inventory, recursive public ownership manifests, bounded private-
  target control/data-flow inspection, mode-aware direct-transfer resolution,
  and whole-text entry auditing.
- Excluded from this document: target bytes, instruction encodings,
  disassembly text, assembler source, private values, strings, assets, and
  target hashes.

This cohort contains the next suitably bounded unmatched ARM service helper
after IPC95. Its executable body is exactly 568 bytes, or 142 ordered
four-byte semantic slots. It owns no adjacent literal or other post-body
material, so its complete owned extent is also 568 bytes. `func_00180F24`
remains excluded because its 1,356-byte multi-loop scheduler/dispatcher is
outside the bounded wrapper cohort. The next otherwise suitable unmatched
entry is `func_001849DC`.

A recursive ownership scan found no selected entry or interior already owned
as a public primary body, alias, secondary entry, literal code entry, or
material owner. The complete body occurs once in the 10,440-body inventory.
A mode-aware whole-text direct-transfer scan found no transfer from outside
the selected body to its primary entry or any interior address.

The 20 physical bytes between the body and `func_00184990` remain unowned by
IPC96. Four relocation-free PC-relative operations refer to the first sixteen
of those bytes. The last four bytes begin the established ARM secondary entry
`arm_duplicate_templates_75_allocator_preentry`, already modeled by duplicate
template batch 75 at owner offset +584. Neither the references nor that
existing secondary-entry relationship enlarges IPC96's extent.

## Function and extent contract

| Function | Section | Body | Following global | Semantic contract |
|---|---|---:|---|---|
| `func_00184744` | `.text.func_00184744` | 568 | `func_00184990` at +588 | Parse a halfword-delimited service description, dispatch one of several object-update paths, finalize temporary parse state, and return success or failure. |

The routine follows the ARM procedure-call standard. It saves `r4` through
`r11` and the return address, reserves 52 stack bytes, and returns zero or one
in `r0` after restoring the frame. It has no indirect call, external tail
transfer, owned literal pool, or selected secondary entry.

## Object metadata contract

The implementation object is an ELF32 little-endian ARM `ET_REL` object using
System V ABI identification, ELF version one, ARM EABI version-five flags, a
zero entry point, no program-header table, and a canonical all-zero null
section. The sole owned section is `.text.func_00184744`: `SHT_PROGBITS`,
allocatable and executable, address zero, alignment four, and size 568.

That section has exactly one canonical local `STT_SECTION` symbol, one local
default-visible `$a` mapping symbol at value zero, and one global default-
visible `STT_FUNC` owner `func_00184744` at value zero and size 568. It has no
`$d` mapping, named or unnamed alias, secondary owner, or other defined
symbol. Every external direct destination is a unique undefined global,
default-visible `STT_NOTYPE` symbol with zero value and size; its required ARM
or Thumb state is fixed by the branch-identity contract below. Relocations use
ELF `SHT_REL` form and the exact site order and zero addends listed below.

## Transfer, return, and relocation contract

Exactly 21 linked direct transfers require `R_ARM_CALL` relocations with
addend zero. Ten distinct primary-entry identities are involved. The four
two-byte-aligned destinations are Thumb primary entries, so all seven calls to
them exchange state; the remaining fourteen calls target six four-byte-
aligned ARM primary entries.

| Body offset(s) | Sites | Relocation | Transfer relation | Stable destination |
|---:|---:|---|---|---|
| +36, +104, +148 | 3 | `R_ARM_CALL`, addend 0 | linked, state-exchanging | `func_0010048A` |
| +60 | 1 | `R_ARM_CALL`, addend 0 | linked, state-exchanging | `func_001003E8` |
| +200, +216, +392, +408 | 4 | `R_ARM_CALL`, addend 0 | linked | `func_001862A0` |
| +228, +420, +464, +528 | 4 | `R_ARM_CALL`, addend 0 | linked | `func_0018CD7C` |
| +244, +436 | 2 | `R_ARM_CALL`, addend 0 | linked | `func_0018D190` |
| +252 | 1 | `R_ARM_CALL`, addend 0 | linked | `func_0017F4A4` |
| +268, +276 | 2 | `R_ARM_CALL`, addend 0 | linked | `func_001862FC` |
| +340, +364 | 2 | `R_ARM_CALL`, addend 0 | linked, state-exchanging | `func_0010046E` |
| +480 | 1 | `R_ARM_CALL`, addend 0 | linked | `func_0018A7B4` |
| +512 | 1 | `R_ARM_CALL`, addend 0 | linked, state-exchanging | `func_001003FA` |

Returns occur at +328 and +564. All other direct transfers are local branches
within the body and receive no relocation. There is no other relocation in
the selected extent.

## Cross-boundary reference contract

The following PC-relative targets are interoperability facts. Their bytes are
not owned, emitted, copied, or disclosed by IPC96. Each target is distinct,
all four operations are relocation-free, and implementation must preserve the
exact encoded body-relative relationship.

| Referencing slot | Operation | Target offset | Neutral identity | Semantic role |
|---:|---|---:|---|---|
| +28 | form address | +568 | `service_inline_match_key_96` | Address of the first opaque comparison key used by the parse loop. |
| +92 | load word | +572 | `service_match_key_pointer_96` | Pointer identity for the repeated delimiter/key comparison. |
| +332 | load word | +576 | `service_parse_class_a_pointer_96` | Pointer identity for the first classification probe. |
| +356 | load word | +580 | `service_parse_class_b_pointer_96` | Pointer identity for the second classification probe. |

The reference identities name locations or pointer classes only; they are not
owned literal identities and do not change IPC cumulative pool accounting.
That accounting remains 892 physical slots in 469 classes.

## Structured semantic slot schedule

Each row is an ordered sequence of four-byte slots. Offsets are inclusive and
advance by four in the exact order described. Register names, conditions,
memory widths, displacements, stack locations, local destinations, transfer
identities, and state transitions are interoperability facts; the prose does
not prescribe textual assembly or binary encoding.

### `func_00184744`

| Offsets | Ordered semantic slots |
|---:|---|
| +0..+28 | Save `r4` through `r11` and the return address; set `r6` to zero; reserve 52 stack bytes; retain entry `r0`, `r1`, and `r2` in `r8`, `r5`, and `r9`; copy zero to `r10`; form in `r1` the relocation-free address of `service_inline_match_key_96` at +568. |
| +32..+48 | Copy `r5` to `r0`; linked state-exchanging call to `func_0010048A`; copy the result to `r4` while setting flags; preserve architectural state for one scheduling slot; if nonzero continue at +76. |
| +52..+72 | Set `r6` to one; copy `r5` to `r0`; linked state-exchanging call to `func_001003E8`; set `r4` to `r5 + (r0 << 1)`; compare `r5` with `r4`; if equal continue at +320. |
| +76..+92 | Compare `r5` with `r4`; if unequal copy `r5` to `r7` and store low-halfword zero at `[r4]`; if equal continue at +556; otherwise load `service_match_key_pointer_96` from the unowned word at +572 into `r11`. |
| +96..+116 | Copy `r5` and `r11` to `r0` and `r1`; linked state-exchanging call to `func_0010048A`; copy the result to `r5` while setting flags; when nonzero compare `r7` with `r5`; if either comparison is equal continue at +164. |
| +120..+136 | Set `r0` to `r5 + 2`; save it at stack +12; load the halfword at `[r5 + 2]`; compare it with zero; if zero continue at +164. |
| +140..+160 | Reload stack +12 into `r0`; copy `r11` to `r1`; linked state-exchanging call to `func_0010048A`; compare the result with zero; preserve architectural state for one scheduling slot; if zero continue at +172. |
| +164..+168 | Copy zero from `r10` to `r11`; continue at +288. |
| +172..+184 | Compare retained entry `r9` with zero; set `r11` to one; store low-halfword zero at `[r5]`; if `r9` is zero continue at +332. |
| +188..+220 | Copy `r7` to `r1`; set `r0` to stack +32; save `r8` at stack +16; call `func_001862A0`; retain its result in `r7`; load stack +12 into `r1`; set `r0` to stack +40; call `func_001862A0`; save its result at stack +12. |
| +224..+252 | Load stack +16 into `r0`; call `func_0018CD7C`; reload stack +16 into `r0`; copy `r7` to `r1`; add 68 to `r0`; call `func_0018D190`; load stack +12 into `r1`; call `func_0017F4A4`. |
| +256..+284 | Load stack +16 into `r0`; store low-byte zero from `r10` at `[r0 + 101]`; set `r0` to stack +40 and call `func_001862FC`; set `r0` to stack +32 and call `func_001862FC`; set `r0` to 61 and store its low halfword at `[r5]`. |
| +288..+316 | Compare `r6` with zero; when equal set `r0` to 59 and store its low halfword at `[r4]`; compare `r11` with zero and if zero continue at +556; compare `r6` with zero; set `r5` to `r4 + 2`; when `r6` is zero repeat from +28. |
| +320..+328 | Release the 52 stack bytes; set `r0` to one; restore `r4` through `r11` and return. |
| +332..+352 | Load `service_parse_class_a_pointer_96` from the unowned word at +576 into `r1`; copy `r7` to `r0`; linked state-exchanging call to `func_0010046E`; compare the result with zero; preserve architectural state for one scheduling slot; if zero continue at +452. |
| +356..+376 | Load `service_parse_class_b_pointer_96` from the unowned word at +580 into `r1`; copy `r7` to `r0`; linked state-exchanging call to `func_0010046E`; compare the result with zero; preserve architectural state for one scheduling slot; if zero continue at +496. |
| +380..+412 | Copy `r7` to `r1`; set `r0` to stack +32; save `r8` at stack +16; call `func_001862A0`; save its result at stack +0; load stack +12 into `r1`; set `r0` to stack +40; call `func_001862A0`; retain its result in `r7`. |
| +416..+448 | Load stack +16 into `r0`; call `func_0018CD7C`; reload stack +16 into `r0`; load stack +0 into `r1`; add 40 to `r0`; call `func_0018D190`; copy `r7` to `r1`; preserve architectural state for one scheduling slot; continue at +252. |
| +452..+492 | Load stack +12 into `r11`; copy `r8` to `r7` and `r0`; call `func_0018CD7C`; store low-byte zero at `[r7 + 101]`; load `[r7 + 4]` into `r0`; copy `r11` to `r1`; call `func_0018A7B4`; retain the result in `r11`; preserve architectural state for one scheduling slot; continue at +280. |
| +496..+520 | Load stack +12 into `r0`; copy `r8` to `r7`; set `r2` to 10 and `r1` to zero; linked state-exchanging call to `func_001003FA`; zero-extend the low halfword of the result; save it at stack +12. |
| +524..+552 | Copy `r7` to `r0`; call `func_0018CD7C`; load stack +12 into `r0`; load `[r7 + 4]` into `r1`; reverse the two bytes in each low halfword position of `r0`; store the low halfword at `[r1 + 6]`; store low-byte zero at `[r7 + 101]`; continue at +280. |
| +556..+564 | Release the 52 stack bytes; set `r0` to zero; restore `r4` through `r11` and return. |

## Verification obligations

- Reconstruct one ARM body of exactly 568 bytes and no adjacent owned bytes.
- Preserve all 142 ordered executable slots, including all six explicitly
  state-preserving scheduling slots, condition-code dependencies, halfword and
  byte accesses, local destinations, and stack locations.
- Emit exactly 21 `R_ARM_CALL` relocations with addend zero at the configured
  sites and emit no other relocation in the owned extent.
- Preserve seven state-exchanging calls to the four Thumb identities, fourteen
  ARM calls, ten pairwise-distinct destination classes, and both returns.
- Preserve all four relocation-free PC-relative target offsets without owning
  or emitting the referenced post-body bytes.
- Keep cumulative pool accounting fixed at 892 slots and 469 classes.
- Do not claim or absorb `func_00180F24`, any of the 20 post-body bytes,
  `arm_duplicate_templates_75_allocator_preentry`, `func_00184990`, or
  `func_001849DC`.
