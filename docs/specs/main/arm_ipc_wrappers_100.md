# Neutral ARM service-constructor specification 100

## Scope and provenance

- Target: `AS_EUR_REV2`, with provenance governed by `docs/PROVENANCE.md`.
- Analysis date: 2026-10-17.
- Clean-room role: analysis and semantic specification only.
- Evidence used: the authoritative unmatched-function report, neutral global-
  symbol inventory, recursive public ownership manifests, bounded private-
  target control-flow inspection, mode-aware direct-transfer resolution, and
  whole-text entry auditing.
- Excluded from this document: target bytes, instruction encodings,
  disassembly text, assembler source, private values, strings, assets, and
  target hashes.

This cohort contains the next suitably bounded unmatched ARM service
constructor after IPC99. Its executable body is exactly 268 bytes, or 67
ordered four-byte semantic slots. It owns the complete 32-byte adjacent
literal pool before `func_001855CC`, for a 300-byte section extent. Seven
direct linked transfers and eight absolute literal identities require
relocations.

The previously recorded 1,356-byte scheduler, 808-byte service routine, and
1,052-byte initializer remain excluded as larger cohorts. The next otherwise
suitable unmatched entry is `func_001855CC`.

A recursive ownership scan found no selected entry, interior, or pool slot
already owned as a public primary body, alias, secondary entry, literal code
entry, or material owner. The complete body occurs once in the 10,440-body
inventory. The selected entry has no interior incoming control-flow target.
Its seven literal classes newly introduce seven identities and reuse the
already-public `ipc_empty_text_63` identity once; the eight pool slots are
pairwise distinct.

## Function and extent contract

| Function | Section | Body | Adjacent pool | Following global | Semantic contract |
|---|---|---:|---:|---|---|
| `func_001854A0` | `.text.func_001854A0` | 268 | 32 | `func_001855CC` at +300 | Construct a service object, initialize two embedded channels, allocate and initialize a 112-byte auxiliary buffer, install two callback identities, seed it from a 56-byte template, configure a trailing subobject, and return the service object. |

The routine follows the ARM procedure-call standard. It saves `r4` through
`r10` and the return address, allocates sixteen stack-local bytes, retains the
entry options from `r1` and `r2` in `r5` and `r6`, uses `r8` as a persistent
zero, and derives the service-object base in `r4`. The original first option
is retained in `r7` after default normalization. `r9` and `r10` retain the two
callback identities. The return value in `r0` is the service-object pointer.

An entry first option equal to minus one is normalized to fifteen. An entry
second option equal to minus one is normalized to eight. Allocation failure
suppresses only the conditional Thumb initializer; the remaining ordered
stores and calls are preserved exactly and are not replaced by a new failure
branch.

## Required architecture and object metadata

The implementation must assemble for **ARMv6K**, not ARMv7 or ARMv7-A. Its
AEABI attributes are CPU name `6K`, architecture `v6K`, ARM ISA enabled,
Thumb-1 enabled, and VFPv2. No ARMv7-only instruction or attribute is
allowed.

The implementation object is an ELF32 little-endian ARM `ET_REL` object using
System V ABI identification, ELF version one, ARM EABI version-five flags, a
zero entry point, no program-header table, and a canonical all-zero null
section. The sole owned section is `.text.func_001854A0`: `SHT_PROGBITS`,
allocatable and executable, address zero, alignment four, and size 300.

That section has exactly one canonical local `STT_SECTION` symbol, a local
default-visible `$a` mapping symbol at value zero, a local default-visible
`$d` mapping symbol at value 268, and the global default-visible `STT_FUNC`
owner `func_001854A0` at value zero and size 268. It has no named or unnamed
alias, secondary owner, or other defined symbol.

## Direct-transfer contract

The body has no local direct branch, no indirect transfer, and one return at
+264. It performs exactly seven direct linked transfers. Each transfer emits
one `SHT_REL` `R_ARM_CALL` relocation with semantic addend zero.

| Offset | Condition/state | Destination | Argument contract |
|---:|---|---|---|
| +36 | unconditional ARM | `func_0018B220` | `r0` is entry object +16; `r1` is `0x20000000`. |
| +56 | unconditional ARM | `func_0018AAEC` | `r0` is the first initializer result +48; `r1` is `service_channel_descriptor_primary_100`; `r2` is zero; `r3` is `ipc_empty_text_63`. |
| +76 | unconditional ARM | `func_0018AAEC` | `r0` is the preceding initializer result +112; `r1` is `service_channel_descriptor_secondary_100`; `r2` is zero; `r3` is `ipc_empty_text_63`. |
| +124 | unconditional ARM | `func_00184990` | `r0` is 112, requesting the auxiliary allocation. |
| +136 | nonzero ARM-to-Thumb exchange | `service_buffer_initialize_secondary_100` | Executed only when the allocation result is nonzero; `r0` is that result and `r1` is 112. |
| +184 | unconditional ARM | `func_0018F654` | `r0` is the auxiliary pointer; `r1` is `service_buffer_template_100`; `r2` is 56. |
| +252 | unconditional ARM | `func_0018CE64` | `r0` is auxiliary pointer +56; `r1` is minus one; `r2` is eight; `r3` is the normalized first option; stack words +0, +4, +8, and +12 are the normalized second option, zero, the template identity, and 56. |

`func_0018B220` and `func_00184990` are already publicly owned primary
destination identities. Thumb-state `service_buffer_initialize_secondary_100`
is a new alias for offset six inside the already-public 56-byte owner
`func_00302FB6`; 50 bytes remain from that entry to `func_00302FEE`.
`func_0018AAEC`, `func_0018F654`, and `func_0018CE64` remain external unowned
primary identities; this cohort does not claim their bodies. The two calls to
`func_0018AAEC` share one relocation identity. All other destination classes
are singletons and pairwise distinct.

## Literal-pool contract

The pool begins immediately after the body and contains exactly eight
four-byte slots. Every slot emits one `R_ARM_ABS32` relocation with addend
zero. Only `ipc_empty_text_63` is reused from a prior public cohort.

| Pool offset | Loading instruction offsets | Identity | Role |
|---:|---:|---|---|
| +268 | +16 | `service_manager_vtable_100` | Initial service-object table identity. |
| +272 | +40, +60 | `ipc_empty_text_63` | Shared empty descriptor passed to both embedded-channel initializers. |
| +276 | +44 | `service_channel_descriptor_primary_100` | First embedded-channel descriptor. |
| +280 | +64 | `service_channel_descriptor_secondary_100` | Second embedded-channel descriptor. |
| +284 | +92 | `service_instance_vtable_100` | Final service-instance table identity. |
| +288 | +140 | `service_buffer_first_callback_100` | Callback installed at auxiliary displacement 32 and 88. |
| +292 | +148 | `service_buffer_second_callback_100` | Callback installed at auxiliary displacement 36 and 92. |
| +296 | +160, +192 | `service_buffer_template_100` | 56-byte seed template and trailing-subobject argument. |

The pool contributes eight slots and seven new classes to the cumulative
accounting, raising it to 906 slots and 480 classes. No byte remains between
the pool and the following global.

## Ordered semantic slot schedule

Each row describes an ordered sequence of four-byte slots. Offsets are
inclusive and advance by four. Register identities, conditions, access
widths, displacements, constants, and branch destinations are interoperability
facts; the prose does not prescribe textual assembly or binary encoding.

### `func_001854A0`

| Offsets | Ordered semantic slots |
|---:|---|
| +0..+12 | Save `r4` through `r10` and the return address; retain entry `r1` in `r5`; subtract 16 from the stack pointer; set `r8` to zero. |
| +16..+36 | Load `service_manager_vtable_100` into `r1`; retain entry `r2` in `r6`; store `r1` and `r8` to entry object displacements zero and four; form `0x20000000` in `r1`; add 16 to the object in `r0`; call `func_0018B220`. |
| +40..+56 | Load `ipc_empty_text_63` into `r3` and `service_channel_descriptor_primary_100` into `r1`; set `r2` to zero; add 48 to `r0`; call `func_0018AAEC`. |
| +60..+76 | Reload `ipc_empty_text_63` into `r3` and load `service_channel_descriptor_secondary_100` into `r1`; set `r2` to zero; add 112 to `r0`; call `func_0018AAEC`. |
| +80..+108 | Store zero at negative displacement 168 from the returned pointer; derive `r4` as returned pointer minus 176; store zero at negative displacement 164; load `service_instance_vtable_100` into `r0`; compare `r5` with minus one and conditionally replace it with fifteen; compare `r6` with minus one; store the table identity at service displacement zero. |
| +112..+136 | Copy normalized `r5` to `r7`; conditionally replace `r6` with eight; set `r0` to 112 and call `func_00184990`; copy the allocation result to `r5` while setting condition flags; when nonzero set `r1` to 112 and conditionally exchange-linked-call Thumb `service_buffer_initialize_secondary_100`. |
| +140..+168 | Load `service_buffer_first_callback_100` into `r9`; store auxiliary pointer `r5` at service displacement 288; load `service_buffer_second_callback_100` into `r10`; store `r9` at auxiliary displacement 32; load the auxiliary pointer through service displacement 288; load `service_buffer_template_100` into `r1`; set `r2` to 56. |
| +172..+184 | Store `r10` at auxiliary displacement 36; reload the auxiliary pointer; store zero at displacement 40; reload the auxiliary pointer; call `func_0018F654`. |
| +188..+216 | Reload the auxiliary pointer; reload `service_buffer_template_100` into `r2`; set `r1` to 56; copy `r7` to `r3`; store `r9` at auxiliary displacement 88; reload the auxiliary pointer; store `r10` at displacement 92. |
| +220..+248 | Reload the auxiliary pointer; store zero at displacement 96; store `r1` at stack displacement 12; store `r2` at stack displacement eight; store `r6` and `r8` at stack displacements zero and four; reload the auxiliary pointer; set `r2` to eight; set `r1` to minus one; add 56 to `r0`. |
| +252..+264 | Call `func_0018CE64`; add 16 to the stack pointer; copy the service pointer in `r4` to return register `r0`; restore `r4` through `r10` and the program counter to return. |

## Verification obligations

- Reconstruct one ARMv6K body of exactly 268 bytes followed by exactly 32
  owned pool bytes in one 300-byte executable section.
- Preserve all 67 ordered executable slots, the sixteen-byte local frame,
  persistent zero register, minus-one option normalization, seven direct
  calls, conditional ARM-to-Thumb exchange, and sole return.
- Emit exactly seven `R_ARM_CALL` and eight `R_ARM_ABS32` relocations with the
  identities, sites, state, conditions, and addends stated above.
- Preserve the exact stack argument order and every word/halfword/byte access
  width and object, auxiliary-buffer, and stack displacement.
- Require ARMv6K/Thumb-1/VFPv2 AEABI attributes and reject ARMv7 attributes
  or ARMv7-only instructions.
- Keep cumulative adjacent-pool accounting at 906 slots and 480 classes.
- Do not claim or absorb any byte at or after `func_001855CC`; leave that
  function for the next bounded cohort.
- Bound validation to 64 MiB of complete input, 16 MiB of aggregate
  executable section data, 16,384 sections, 1,000,000 symbols, and 1,000,000
  relocations. Count both `SHT_SYMTAB` and `SHT_DYNSYM`, count both REL and
  RELA relocations, and test every cap independently.
