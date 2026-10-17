# Neutral ARM composite service constructor specification 105

## Scope and provenance

- Target: `AS_EUR_REV2`; provenance follows `docs/PROVENANCE.md`.
- Analysis date: 2026-10-17; clean-room semantic specification only.
- Evidence: authoritative unmatched inventory, recursive public ownership and
  literal manifests, bounded private control/data-flow inspection, physical
  literal equality, transfer resolution, and whole-text entry auditing.
- Excluded: ROM bytes, encodings, disassembly text, proprietary pointer values,
  strings, media, assets, and target hashes.

Batch 105 accepts `func_00185C94`: a 404-byte body followed by its complete
16-byte pointer pool and the next global at +420. The four pool identities are
nonzero and pairwise distinct. One is physically identical to the previously
public `service_runtime_endpoint_vtable_85`; the other three are new. None is
text or authored asset material. The whole ARM-text audit found one external
call to the official entry and no entry to any interior or pool slot.

## Function contract

| Function | Body | Pool | Following global | Summary |
|---|---:|---:|---|---|
| `func_00185C94` | 404 | 16 | `func_00185E38` at +420 | Construct a composite owner, adapter, runtime endpoint, fixed-capacity record arena, and associated runtime handles. |

The object is ELF32 little-endian ARM `ET_REL`, System V, ARM EABI version
five, with ARMv6K, ARM ISA, Thumb-1 availability, and VFPv2 attributes.
`.text.func_00185C94` is the only nonempty executable section, alignment four,
size 420. `$a` is at zero, `$d` at 404, and the global function owner has size
404. The function saves `r4` through `r8`, reserves 48 stack bytes, and returns
through the sole site at +400.

## Transfer contract

Twelve linked transfers are present. Eleven unconditional sites use
`R_ARM_CALL`; the conditional site at +348 uses `R_ARM_JUMP24`.

| Offset(s) | Destination | Role |
|---:|---|---|
| +56, +68, +228, +240 | `func_00184990` | Allocate two temporary-list objects, an arena descriptor, and 1,408 bytes of record storage. |
| +136 | `func_0017ECB0` | Initialize the owner subobject. |
| +152 | `func_0018E1E0` | Bind the adapter to temporary list state. |
| +164 | `func_0018B220` | Initialize endpoint synchronization state with option one. |
| +340 | `func_0017E30C` | Acquire runtime context state into the stack record. |
| +348 | `func_001603A0` | Conditionally process the acquisition status when its high bit is set. |
| +368 | `func_0018D348` | Attach runtime context state to the endpoint. |
| +376 | `func_0018D6D4` | Bind temporary list state to that attachment. |
| +388 | `func_0018E370` | Finalize the temporary list state. |

There is no local branch, indirect call, or external tail transfer.

## Literal contract

| Pool offset | Load | Identity | Status |
|---:|---:|---|---|
| +404 | +12 | `service_owner_vtable_105` | New owner dispatch identity. |
| +408 | +140 | `service_adapter_vtable_105` | New adapter dispatch identity. |
| +412 | +168 | `service_runtime_endpoint_vtable_85` | Reused IPC85 endpoint identity. |
| +416 | +328 | `service_runtime_context_105` | New runtime-context identity. |

Each slot uses one `R_ARM_ABS32` relocation with zero addend. Accounting moves
from 917/490 to 921 physical slots in 493 identity classes.

## Ordered semantic schedule

| Offsets | Ordered operations |
|---:|---|
| +0..+52 | Save registers, reserve stack state, install the owner identity, zero the temporary list descriptor, and request its descriptor and 24-byte storage. |
| +56..+128 | Construct a one-element temporary arena and self-link its first record. |
| +132..+164 | Initialize the owner subobject, install the adapter identity, bind the temporary state, and initialize endpoint synchronization state. |
| +168..+220 | Install the reused endpoint identity and initial flags, clear endpoint-owned state, and retain its arena address. |
| +224..+276 | Allocate a 32-record descriptor and 1,408-byte area, publish its base and limit, and advance the cursor by one 44-byte record. |
| +280..+324 | Clear the first record's byte and word fields, publish it, and self-link its two link fields. |
| +328..+388 | Acquire runtime context, conditionally process status, attach it to the endpoint, bind temporary state, and finalize that state. |
| +392..+400 | Release stack storage and return the composite object base. |

## Verification obligations

- Reconstruct exactly 404 executable bytes and the complete 16-byte pool.
- Preserve 101 ordered instructions, twelve direct transfers, all field widths
  and displacements, both self-link pairs, stack ordering, and the sole return.
- Emit eleven `R_ARM_CALL`, one `R_ARM_JUMP24`, and four `R_ARM_ABS32` REL
  relocations with the declared identities and zero addends.
- Prove every body word against authoritative object and raw-code evidence,
  normalizing only declared transfer fields; require the authoritative target
  object to carry the same twelve ordered symbolic branch relocations so an
  objdiff match cannot be inferred from raw opcodes alone; verify all pool
  identities, pairwise inequality, and the IPC85 reuse equality.
- Enforce exact ELF/symbol/attribute identity, absence of foreign executable
  payloads, pinned inputs, and independent 64 MiB file, 16 MiB executable,
  16,384 section, 1,000,000 symbol, and 1,000,000 relocation limits.
- Hostile tests must reject instruction, pool, relocation, symbol, attribute,
  target-body, target-pool, and each resource-limit mutation.
- Do not claim bytes at or after `func_00185E38`, or include any target-authored
  string or asset.
