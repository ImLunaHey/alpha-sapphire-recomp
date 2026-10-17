# ARM runtime/helper batch 114 specification

## Scope and provenance

Analysis and independently authored reconstruction for AS_EUR_REV2, 2026-10-17, using existing ignored private target bytes, generated target ELF, local objdiff report, and the public neutral inventory. GNU Arm binutils 2.44 provides independent assembly and link verification. This work does not claim separated two-party clean-room provenance. No proprietary SDK, assets, text, or containers are included.

Own six source-unowned, report-unmatched-at-selection ARM primary bodies in [0x00520000, 0x00540000): 404 instruction bytes (101 instructions) and one four-byte scalar. Prefer the call-free signed-halfword saturating-add leaf; the other five small helpers have six exact direct calls. Other call-free candidates require additional pointer identities or less conservative boundaries and are deferred. No Thumb entry, alias, secondary entry, or indirect transfer is owned.

## Ownership

| Function | Body | Owned | Next global |
| --- | ---: | ---: | --- |
| `func_0052A400` | 32 | 32 | `func_0052A420` |
| `func_0052A5C4` | 136 | 140 | `func_0052A650` |
| `func_0052A6E0` | 44 | 44 | `func_0052A70C` |
| `func_0053FC40` | 28 | 28 | `func_0053FC5C` |
| `func_0053FCDC` | 92 | 92 | `func_0053FD38` |
| `func_0053FD38` | 72 | 72 | `func_0053FD88` |

The saturating-add scalar at offset 136 is exactly 32767 and ends at the next global. Its function size excludes this word; ARM code maps at zero and data maps at 136. Every other owned size equals its body size. Gaps, later secondary entries, and next globals remain outside ownership. All owned sections have alignment four.

## Exact observable schedules

All instructions are four-byte ARM instructions. Moves and arithmetic preserve flags unless explicitly stated. Comparisons update flags. Memory accesses are words unless explicitly halfword or multiple-register accesses. Stack save/restore uses full descending word slots in register order. Calls may clobber ABI volatile registers and flags; preserve the exact post-call schedule.

### `func_0052A400`

| Offset | Operation |
| ---: | --- |
| 0 | Save r4,r5,r6,lr on the full descending stack. |
| 4 | Copy r1 to r5. |
| 8 | Copy r2 to r6. |
| 12 | Copy r0 to r4. |
| 16 | Call ARM primary func_0052A420. |
| 20 | Store r5 at r4+96 and write that address back to r4. |
| 24 | Store r6 at r4+8. |
| 28 | Restore r4,r5,r6 and return through the stacked pc. |

### `func_0052A5C4`

| Offset | Operation |
| ---: | --- |
| 0 | Move 3 to r12. |
| 4 | Set r3 to r12+(r3 logically shifted right by 1). |
| 8 | Save r4,r5,r6 on the stack. |
| 12 | Clear low two bits of r3 into r12, updating flags. |
| 16 | If equal, branch to offset 128. |
| 20 | Set r12 to r0-2. |
| 24 | Set r0 to r2-2. |
| 28 | Load scalar 32767 from owned offset 136 into r2. |
| 32 | Logically shift r3 right by 2. |
| 36 | Set r4 to r3 shifted left by 1. |
| 40 | Set r3 to r1-2. |
| 44 | Set r5 to the bitwise complement of r2. |
| 48 | Load signed halfword at r12+2 into r1. |
| 52 | Load signed halfword at r3+2 into r6. |
| 56 | Add r6 to r1. |
| 60 | Compare signed r1 with 32768. |
| 64 | If greater or equal, copy r2 to r1. |
| 68 | If greater or equal, branch to offset 80. |
| 72 | Compare signed r1 with -32768 using CMN flags. |
| 76 | If less or equal, copy r5 to r1. |
| 80 | Store low halfword of r1 at r0+2. |
| 84 | Load signed halfword at r12+4 into r1 with base writeback. |
| 88 | Load signed halfword at r3+4 into r6 with base writeback. |
| 92 | Add r6 to r1. |
| 96 | Compare signed r1 with 32768. |
| 100 | If greater or equal, copy r2 to r1. |
| 104 | If greater or equal, branch to offset 116. |
| 108 | Compare signed r1 with -32768 using CMN flags. |
| 112 | If less or equal, copy r5 to r1. |
| 116 | Subtract 1 from r4, updating flags. |
| 120 | Store low halfword of r1 at r0+4 with base writeback. |
| 124 | If not equal, branch to offset 48. |
| 128 | Restore r4,r5,r6 from the stack. |
| 132 | Return through lr. |

### `func_0052A6E0`

| Offset | Operation |
| ---: | --- |
| 0 | Save r4,lr on the stack. |
| 4 | Copy r0 to r4. |
| 8 | Load word at r0+108 into r0. |
| 12 | Compare r0 with zero. |
| 16 | If equal, branch to offset 32. |
| 20 | Call ARM primary func_0014307C. |
| 24 | Move zero to r0. |
| 28 | Store r0 at r4+108. |
| 32 | Set r0 to all ones. |
| 36 | Store r0 at r4+104. |
| 40 | Restore r4 and return through the stacked pc. |

### `func_0053FC40`

| Offset | Operation |
| ---: | --- |
| 0 | Save r3,lr on the stack. |
| 4 | Load word at r1 into r12. |
| 8 | Copy r2 to r3. |
| 12 | Copy sp to r2. |
| 16 | Store r12 at sp. |
| 20 | Call ARM primary func_0053FB10. |
| 24 | Restore r3 and return through the stacked pc. |

### `func_0053FCDC`

| Offset | Operation |
| ---: | --- |
| 0 | Save r4,r5,r6,lr on the stack. |
| 4 | Set r6 to r0+8. |
| 8 | Load word at r0+16 into r0. |
| 12 | Copy r6 to r4. |
| 16 | Compare r0 with zero. |
| 20 | If equal, branch to offset 84. |
| 24 | Load word at r4+4 into r5. |
| 28 | Compare r5 with r4. |
| 32 | If equal, branch to offset 68. |
| 36 | Copy r5 to r1. |
| 40 | Load word at r5+4 into r5. |
| 44 | Load word at r4+8 into r0. |
| 48 | Move 1 to r2. |
| 52 | Call ARM primary func_002B807C. |
| 56 | Compare r5 with r4. |
| 60 | Execute ARM architectural hint NOP (not a register move). |
| 64 | If not equal, branch to offset 36. |
| 68 | Move zero to r0. |
| 72 | Store r0 at r4+8. |
| 76 | Store r4 at r4. |
| 80 | Store r4 at r4+4. |
| 84 | Set r0 to r6-8. |
| 88 | Restore r4,r5,r6 and return through the stacked pc. |

### `func_0053FD38`

| Offset | Operation |
| ---: | --- |
| 0 | Save r4,r5,r6,lr on the stack. |
| 4 | Copy r0 to r6. |
| 8 | Load word at r1+8 into r0. |
| 12 | Copy r1 to r5. |
| 16 | Move 2 to r1. |
| 20 | Call ARM primary func_002B80B0. |
| 24 | Copy r0 to r4 and update flags. |
| 28 | If equal, store r0 at r6. |
| 32 | If equal, branch to offset 68. |
| 36 | Set r0 to r4+8 and update flags. |
| 40 | If not equal, call ARM primary func_0053FCB8. |
| 44 | Load word at r5 into r0. |
| 48 | Store r0,r5 in ascending words at r4 without writeback. |
| 52 | Store r4 at r5. |
| 56 | Load word at r4 into r0. |
| 60 | Store r4 at r0+4. |
| 64 | Store r4 at r6. |
| 68 | Restore r4,r5,r6 and return through the stacked pc. |

## Relocations and identity

| Function | Offset | Type | Exact ARM primary symbol | Addend |
| --- | ---: | --- | --- | ---: |
| `func_0052A400` | 16 | R_ARM_CALL | `func_0052A420` | -8 |
| `func_0052A6E0` | 20 | R_ARM_CALL | `func_0014307C` | -8 |
| `func_0053FC40` | 20 | R_ARM_CALL | `func_0053FB10` | -8 |
| `func_0053FCDC` | 52 | R_ARM_CALL | `func_002B807C` | -8 |
| `func_0053FD38` | 20 | R_ARM_CALL | `func_002B80B0` | -8 |
| `func_0053FD38` | 40 | R_ARM_JUMP24 | `func_0053FCB8` | -8 |

The conditional call uses NE and R_ARM_JUMP24, preserving its condition and identity. Every other call is unconditional R_ARM_CALL. Require undefined default-visible global NOTYPE symbols with zero value and size, one per identity. Internal branches resolve locally without relocations. The literal load uses PC=instruction address+8 and addresses owned offset 136 with no relocation. No other PC-relative data, relocation, identity, or adjacent payload is accepted.

## Selection and inbound audit

The range contains 129 inventory entries and 93 ARM entries that were source-unowned and report-unmatched during selection. Recursive source definitions and config ownership were checked before writing. Each selected full body occurs exactly once among all 10,440 target functions. Private code.bin equals each authoritative target ELF body. Independent linked assembly must equal all 408 owned target bytes after placing the six call identities at their authoritative ARM entries.

The inventory-wide ARM/Thumb-1 direct-transfer scan found ten external calls to selected entries, all in ARM state, and zero targets in a body interior or the adjacent scalar. The config records the call sites. An additional scan of all aligned words in the private executable found no absolute references into any owned range. No extra target ELF mapping/function symbol occurs inside an owned body. Static direct-transfer evidence does not enumerate possible runtime indirect targets. Reject a conflicting source/config owner, non-matched report entry, duplicate body, interior inbound target, or state disagreement.

## Strict ELF validation

Require ELF32 little-endian ARM ET_REL, EABI5 flags exactly 0x05000000, canonical identification/header/null symbol, CPU 6K, v6K, ARM ISA, Thumb-1 ISA, and VFPv2 attributes. Each owned section is PROGBITS, flags exactly ALLOC|EXECINSTR, address zero, alignment four, exact size, zero link/info/entry size, one local canonical SECTION symbol, the stated local NOTYPE mapping symbols, and one default-visible global FUNC at zero with exact body size. Require exact globals, identities, and relocation tuples; reject aliases, extra owned symbols, RELA, DYNSYM, foreign nonempty executable sections, and extra nonempty allocated payload.

Independently cap complete inputs at 64 MiB, aggregate executable sizes at 16 MiB (including NOBITS), sections at 16,384, aggregate SYMTAB+DYNSYM entries at 1,000,000, and aggregate REL+RELA entries at 1,000,000. Count before parsing entries. Preflight file size before reading. Reject malformed offsets, entry sizes, symbol partitions, string references, relocation links, and section layouts.

Run the strict validator on the assembled lane and with --self-test. Hostile tests exercise all caps through the parser, code/data mutations, branch and relocation identities/types/addends/conditions, ARM/Thumb mapping, symbol/header/section metadata, extra payload, malformed tables, and a valid composite with 12,000 unrelated empty executable sections. Run --audit-private with the existing private code.bin to repeat evidence checks. Finish with git diff --check.
