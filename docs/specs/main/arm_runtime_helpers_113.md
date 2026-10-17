# ARM runtime/helper batch 113 specification

## Scope and evidence

Own eight call-free ARM leaves with entries in [0x00500000, 0x00520000):
868 executable bytes, 217 four-byte instructions, 97 memory operations,
26 local branches, 14 register returns and 76 adjacent literal bytes.
The exact relocation set contains 19 R_ARM_ABS32 records with zero addends.
There are no calls, external branches, indirect tails, aliases or secondary entries.

Selection used only ignored private AS_EUR_REV2 code and its target ELF/report,
the neutral public inventory, and a recursive current source-definition scan.
Each entry was report-unmatched and source-unowned before this lane was written.
Each complete body is unique among all 10,440 inventoried functions, including
Thumb bodies. The target ELF body bytes equal the authoritative private code.
Independent assembly and private relocation resolution must reproduce all 944
owned bytes exactly; private addresses and literal contents stay outside this lane.

The static inbound audit decoded immediate ARM B/BL/BLX and Thumb conditional,
unconditional, BL and BLX transfers in every inventoried body. Its 24 external
transfers all reach aligned ARM primary entries; none reaches an interior or
literal slot. There are no secondary target ELF function symbols in the owned
sections and no aligned code-image pointer-like words targeting an interior.
Computed indirect destinations cannot be established by this static audit.

## Boundaries

| Function | Body | Adjacent | Next global | Next offset |
| --- | ---: | ---: | --- | ---: |
| `func_00509050` | 172 | 8 | `func_00509104` | 180 |
| `func_0050B290` | 52 | 4 | `func_0050BCB4` | 2596 |
| `func_0050BCBC` | 52 | 4 | `func_0050BCF4` | 56 |
| `func_0050BCF4` | 88 | 16 | `func_0050BEA0` | 428 |
| `func_0050D5DC` | 124 | 16 | `func_0050D668` | 140 |
| `func_0050D668` | 152 | 16 | `func_0050DC00` | 1432 |
| `func_0051BDE8` | 56 | 8 | `func_0051BE28` | 64 |
| `func_0051F8C8` | 172 | 4 | `func_0051FE98` | 1488 |

Only each body and its contiguous, referenced four-byte literal slots are owned.
All remaining post-pool material stays unowned, including large unnamed intervals.
All pool offsets are aligned and precede the next inventory global. The whole
private code digest equals the configured AS_EUR_REV2 target digest. A full
inventoried ARM/Thumb PC-relative load scan finds exactly 19 references to these
pools, all from their owning functions. Emit each
function size through its last ARM instruction, excluding the pool.

## Operation schedules

All offsets are decimal byte offsets. Each instruction is four bytes wide.
The pinned config enumerates every operand, condition, local destination, literal
identity and return. Preserve instruction order, flags, register lists, writeback
and exact encoding; no branch may be rewritten into predication or vice versa.

### func_00509050

Walk a linked structure, checking peer consistency, alignment, block positioning and length. Return the first status from one through five, or compare the accumulated length with the root totals and return six or zero. Preserve all six return sites and the flag-dependent paired instructions.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r0, literal(+172, runtime_chain_root_113)` |
| 4 | `mov r3, #0` |
| 8 | `ldr r0, [r0, #8]` |
| 12 | `cmp r0, #0` |
| 16 | `beq local(+140)` |
| 20 | `ldr r1, [r0, #20]` |
| 24 | `cmp r1, #0` |
| 28 | `ldrne r2, [r1, #16]` |
| 32 | `cmpne r2, r0` |
| 36 | `beq local(+48)` |
| 40 | `mov r0, #1` |
| 44 | `bx lr` |
| 48 | `ldr r2, [r0]` |
| 52 | `tst r2, #15` |
| 56 | `beq local(+68)` |
| 60 | `mov r0, #2` |
| 64 | `bx lr` |
| 68 | `add ip, r0, #16` |
| 72 | `cmp r2, ip` |
| 76 | `beq local(+88)` |
| 80 | `mov r0, #3` |
| 84 | `bx lr` |
| 88 | `ldr r0, [r0, #4]` |
| 92 | `tst r0, #15` |
| 96 | `beq local(+108)` |
| 100 | `mov r0, #4` |
| 104 | `bx lr` |
| 108 | `cmp r0, #8` |
| 112 | `bcs local(+124)` |
| 116 | `mov r0, #5` |
| 120 | `bx lr` |
| 124 | `add r2, r3, r0` |
| 128 | `movs r0, r1` |
| 132 | `add r3, r2, #16` |
| 136 | `bne local(+20)` |
| 140 | `ldr r0, literal(+176, runtime_chain_totals_113)` |
| 144 | `ldr r1, [r0, #12]` |
| 148 | `ldr r0, [r0, #20]` |
| 152 | `add r1, r1, r3` |
| 156 | `cmp r0, r1` |
| 160 | `movne r0, #6` |
| 164 | `moveq r0, #0` |
| 168 | `bx lr` |

### func_0050B290

Compute a 24-byte indexed record, clear its byte flag at displacement 1133 when set, then OR 64 into the root word. The equal branch skips all writes.

| Offset | Instruction |
| ---: | --- |
| 0 | `add r1, r0, r0, lsl #1` |
| 4 | `ldr r0, literal(+52, duplicate_template_25_mutable_state_a)` |
| 8 | `ldr r0, [r0]` |
| 12 | `add r1, r0, r1, lsl #3` |
| 16 | `ldrb r2, [r1, #1133]` |
| 20 | `cmp r2, #0` |
| 24 | `beq local(+48)` |
| 28 | `mov r2, #0` |
| 32 | `strb r2, [r1, #1133]` |
| 36 | `ldr r1, [r0]` |
| 40 | `orr r1, r1, #64` |
| 44 | `str r1, [r0]` |
| 48 | `bx lr` |

### func_0050BCBC

Compute the same indexed record, set its byte flag at displacement 1133 when clear, then OR 64 into the root word. The not-equal branch skips all writes.

| Offset | Instruction |
| ---: | --- |
| 0 | `add r1, r0, r0, lsl #1` |
| 4 | `ldr r0, literal(+52, duplicate_template_25_mutable_state_a)` |
| 8 | `ldr r0, [r0]` |
| 12 | `add r1, r0, r1, lsl #3` |
| 16 | `ldrb r2, [r1, #1133]` |
| 20 | `cmp r2, #0` |
| 24 | `bne local(+48)` |
| 28 | `mov r2, #1` |
| 32 | `strb r2, [r1, #1133]` |
| 36 | `ldr r1, [r0]` |
| 40 | `orr r1, r1, #64` |
| 44 | `str r1, [r0]` |
| 48 | `bx lr` |

### func_0050BCF4

Attempt two eight-byte command emissions against the same limit. Each attempt rereads both cursors, uses an unsigned comparison, writes the exact two-register pair without writeback, then advances only the output cursor. Preserve r4 and r5.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r2, literal(+88, global_load_26)` |
| 4 | `ldr ip, literal(+92, runtime_command_limit_113)` |
| 8 | `push {r4, r5}` |
| 12 | `mov r3, #1` |
| 16 | `ldr r1, [r2]` |
| 20 | `ldr r0, [ip]` |
| 24 | `cmp r1, r0` |
| 28 | `bcs local(+48)` |
| 32 | `ldr r4, literal(+96, runtime_command_marker_113_a)` |
| 36 | `add r5, r1, #8` |
| 40 | `stm r1, {r3, r4}` |
| 44 | `str r5, [r2]` |
| 48 | `ldr r0, [ip]` |
| 52 | `ldr r1, [r2]` |
| 56 | `cmp r1, r0` |
| 60 | `bcs local(+80)` |
| 64 | `ldr ip, literal(+100, runtime_command_marker_113_b)` |
| 68 | `add r4, r1, #8` |
| 72 | `stm r1, {r3, ip}` |
| 76 | `str r4, [r2]` |
| 80 | `pop {r4, r5}` |
| 84 | `bx lr` |

### func_0050D5DC

Calculate the current span, optionally emit a zero/marker pair when the span has mask 8 set and the cursor is below the limit, then set the context byte and save the resulting span and record field. Preserve r4 and r5.

| Offset | Instruction |
| ---: | --- |
| 0 | `ldr r3, literal(+124, runtime_global_context_root_99)` |
| 4 | `push {r4, r5}` |
| 8 | `ldr r1, literal(+128, global_load_26)` |
| 12 | `ldr ip, [r3, #156]` |
| 16 | `ldr r0, [r1]` |
| 20 | `ldr r2, [ip, #4]` |
| 24 | `sub r2, r0, r2` |
| 28 | `tst r2, #8` |
| 32 | `str r2, [ip, #12]` |
| 36 | `beq local(+80)` |
| 40 | `ldr r2, literal(+132, runtime_command_limit_113)` |
| 44 | `ldr r2, [r2]` |
| 48 | `cmp r2, r0` |
| 52 | `bls local(+80)` |
| 56 | `ldr r4, literal(+136, runtime_command_marker_113_c)` |
| 60 | `mov ip, #0` |
| 64 | `add r5, r0, #8` |
| 68 | `str r4, [r0, #4]` |
| 72 | `str ip, [r0]` |
| 76 | `str r5, [r1]` |
| 80 | `mov r0, #1` |
| 84 | `strb r0, [r3, #19]` |
| 88 | `ldr r0, [r3, #156]` |
| 92 | `ldr r1, [r1]` |
| 96 | `ldr r2, [r0, #4]` |
| 100 | `sub r1, r1, r2` |
| 104 | `str r1, [r3, #360]` |
| 108 | `ldr r0, [r0, #32]` |
| 112 | `str r0, [r3, #364]` |
| 116 | `pop {r4, r5}` |
| 120 | `bx lr` |

### func_0050D668

Clear the context byte, perform the related optional command emission, then write four separate output results derived from saved context and current record fields. Preserve r4 through r9, including the base writeback at offset 124.

| Offset | Instruction |
| ---: | --- |
| 0 | `push {r4, r5, r6, r7, r8, r9}` |
| 4 | `mov r7, #0` |
| 8 | `ldr ip, literal(+152, runtime_global_context_root_99)` |
| 12 | `ldr r4, literal(+156, global_load_26)` |
| 16 | `strb r7, [ip, #19]` |
| 20 | `ldr r6, [ip, #156]` |
| 24 | `ldr r5, [r4]` |
| 28 | `ldr r8, [r6, #4]` |
| 32 | `sub r8, r5, r8` |
| 36 | `tst r8, #8` |
| 40 | `str r8, [r6, #12]` |
| 44 | `beq local(+80)` |
| 48 | `ldr r6, literal(+160, runtime_command_limit_113)` |
| 52 | `ldr r6, [r6]` |
| 56 | `cmp r6, r5` |
| 60 | `bls local(+80)` |
| 64 | `ldr r8, literal(+164, runtime_command_marker_113_c)` |
| 68 | `add r9, r5, #8` |
| 72 | `stm r5, {r7, r8}` |
| 76 | `str r9, [r4]` |
| 80 | `ldr r5, [ip, #360]` |
| 84 | `str r5, [r0]` |
| 88 | `ldr r0, [ip, #156]` |
| 92 | `ldr r4, [r4]` |
| 96 | `ldr r5, [ip, #360]` |
| 100 | `ldr r0, [r0, #4]` |
| 104 | `sub r0, r4, r0` |
| 108 | `sub r0, r0, r5` |
| 112 | `str r0, [r1]` |
| 116 | `ldr r0, [ip, #364]` |
| 120 | `str r0, [r2]` |
| 124 | `ldr r0, [ip, #156]!` |
| 128 | `ldr r1, [ip, #208]` |
| 132 | `ldr r0, [r0, #32]` |
| 136 | `sub r0, r0, r1` |
| 140 | `str r0, [r3]` |
| 144 | `pop {r4, r5, r6, r7, r8, r9}` |
| 148 | `bx lr` |

### func_0051BDE8

Use an unsigned bounded range check to select an indexed table result. Outside the range, return the shared result identity for a nonzero input or zero for zero input. Preserve both local branches and the conditional literal load.

| Offset | Instruction |
| ---: | --- |
| 0 | `sub r1, r0, #9984` |
| 4 | `sub r1, r1, #17` |
| 8 | `cmp r1, #41` |
| 12 | `mov r1, #0` |
| 16 | `bhi local(+40)` |
| 20 | `ldr r1, literal(+56, runtime_indexed_result_table_113)` |
| 24 | `add r0, r1, r0, lsl #2` |
| 28 | `sub r0, r0, #40960` |
| 32 | `ldr r1, [r0, #956]` |
| 36 | `b local(+48)` |
| 40 | `cmp r0, #0` |
| 44 | `ldrne r1, literal(+60, duplicate52_shared_result_identity)` |
| 48 | `mov r0, r1` |
| 52 | `bx lr` |

### func_0051F8C8

Search 20-byte records until a field equals minus one. Match two key fields and either test mask containment or exact equality according to the supplied mask form. On success store the record address and return zero; otherwise return the opaque miss identity. Preserve both restore/return paths and r4 through r8.

| Offset | Instruction |
| ---: | --- |
| 0 | `push {r4, r5, r6, r7, r8}` |
| 4 | `add r0, r0, #8` |
| 8 | `cmp r1, #0` |
| 12 | `ldm r0, {r5, r6, ip}` |
| 16 | `ldr r0, literal(+172, runtime_lookup_miss_113)` |
| 20 | `beq local(+132)` |
| 24 | `ldr r4, [r1, #4]` |
| 28 | `mov r3, #0` |
| 32 | `cmn r4, #1` |
| 36 | `beq local(+132)` |
| 40 | `and r4, ip, #1` |
| 44 | `sub r4, r4, #1` |
| 48 | `and r7, r4, ip` |
| 52 | `add r4, r3, r3, lsl #2` |
| 56 | `ldr r8, [r1, r4, lsl #2]` |
| 60 | `cmp r8, r5` |
| 64 | `bne local(+140)` |
| 68 | `add r4, r1, r4, lsl #2` |
| 72 | `ldr r8, [r4, #4]` |
| 76 | `cmp r8, r6` |
| 80 | `bne local(+140)` |
| 84 | `ldr r4, [r4, #8]` |
| 88 | `cmp r7, #0` |
| 92 | `beq local(+108)` |
| 96 | `bics r4, ip, r4` |
| 100 | `bne local(+140)` |
| 104 | `b local(+116)` |
| 108 | `cmp r4, ip` |
| 112 | `bne local(+140)` |
| 116 | `add r3, r3, r3, lsl #2` |
| 120 | `mov r0, #0` |
| 124 | `add r1, r1, r3, lsl #2` |
| 128 | `str r1, [r2]` |
| 132 | `pop {r4, r5, r6, r7, r8}` |
| 136 | `bx lr` |
| 140 | `add r3, r3, #1` |
| 144 | `add r4, r3, r3, lsl #2` |
| 148 | `add r4, r1, r4, lsl #2` |
| 152 | `ldr r4, [r4, #4]` |
| 156 | `cmn r4, #1` |
| 160 | `bne local(+52)` |
| 164 | `pop {r4, r5, r6, r7, r8}` |
| 168 | `bx lr` |

## Symbolic literal identity

Repeated symbols mean target word equality, including cross-function reuse.
The four established identities are `duplicate_template_25_mutable_state_a`, `global_load_26`, `runtime_global_context_root_99`, `duplicate52_shared_result_identity`.
The eight new identities are pairwise distinct and differ from every established
literal identity found in the current target relocation inventory. No numeric
private literal contents belong in source, config, spec or validator.

| Function | Offset | Identity |
| --- | ---: | --- |
| `func_00509050` | 172 | `runtime_chain_root_113` |
| `func_00509050` | 176 | `runtime_chain_totals_113` |
| `func_0050B290` | 52 | `duplicate_template_25_mutable_state_a` |
| `func_0050BCBC` | 52 | `duplicate_template_25_mutable_state_a` |
| `func_0050BCF4` | 88 | `global_load_26` |
| `func_0050BCF4` | 92 | `runtime_command_limit_113` |
| `func_0050BCF4` | 96 | `runtime_command_marker_113_a` |
| `func_0050BCF4` | 100 | `runtime_command_marker_113_b` |
| `func_0050D5DC` | 124 | `runtime_global_context_root_99` |
| `func_0050D5DC` | 128 | `global_load_26` |
| `func_0050D5DC` | 132 | `runtime_command_limit_113` |
| `func_0050D5DC` | 136 | `runtime_command_marker_113_c` |
| `func_0050D668` | 152 | `runtime_global_context_root_99` |
| `func_0050D668` | 156 | `global_load_26` |
| `func_0050D668` | 160 | `runtime_command_limit_113` |
| `func_0050D668` | 164 | `runtime_command_marker_113_c` |
| `func_0051BDE8` | 56 | `runtime_indexed_result_table_113` |
| `func_0051BDE8` | 60 | `duplicate52_shared_result_identity` |
| `func_0051F8C8` | 172 | `runtime_lookup_miss_113` |

## ELF and validation contract

Produce a standalone ELF32 little-endian ARM ET_REL object with EABI5 flags
exactly 0x05000000 and the pinned ARMv6K, ARM ISA, Thumb-1 and VFPv2 attributes.
Each unique .text.<function> section is PROGBITS, flags exactly ALLOC|EXECINSTR,
alignment four, address zero and exact owned size. It contains exactly one local
canonical section symbol, one local $a at zero, one local $d at body size, and
one global default-visible STT_FUNC at zero with the exact body size. No extra
owned symbol or mapping transition is allowed. Literal identities are unique
global undefined STT_NOTYPE symbols with zero value, size and other.

Require one exact REL section per owned function: alignment four, flags INFO_LINK,
entry size eight, correct SYMTAB link/owned-section info, and exactly the pinned
ABS32 records. Reject RELA, DYNSYM, extra relocation sections, split identities,
changed addends, missing/duplicate slots, foreign nonempty executable payload,
malformed ELF metadata and symbols. Extra empty executable sections are allowed.
The config, source and spec are independently hash-pinned by the validator.

Independently cap complete input before reading at 64 MiB, executable bytes at
16 MiB, sections at 16,384, aggregate SYMTAB plus DYNSYM entries at 1,000,000,
and aggregate REL plus RELA records at 1,000,000. Enforce these limits before
expensive symbol/relocation decoding. Hostile self-tests must exercise parser
paths for every limit, every instruction and literal addend, mapping state,
function/section/identity metadata, relocation shape/identity, ELF headers,
truncated input and foreign payload. Accept a fixture containing 12,000 unrelated
empty executable sections. Run git diff --check after creating the four files.
