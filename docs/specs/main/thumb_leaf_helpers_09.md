# Probe-verified Thumb leaf/helper batch 09

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched Thumb-state functions totaling 1,190 executable bytes and 545 instructions for revision `AS_EUR_REV2`. Evidence was limited to the current unmatched objdiff report, the neutral symbol inventory, recursive public configuration ownership metadata, bounded private-target control/data-flow inspection, and an independent assembly round trip of the neutral schedules. No implementation source was read while preparing this batch.

The selection is the next size-ordered safe closure after batch 08. It excludes the smaller veneer, every call to a secondary or interior entry, every external non-call branch, and every function whose recorded body contains addressed inline data. The batch has 50 32-bit instructions, all direct calls, and 495 16-bit instructions. It contains 73 local branches, 188 memory operations, 24 return sites, 3 register-indirect calls, no indirect tails, 50 direct calls, and no direct external jump, owned adjacent data, private string, or asset.

`sourceSha256` is `34b044e28d460c7f446adebb93386649bd9c1e0ef2c55d63b2c8f0c269910b9e`, recorded after the isolated clean-room implementation was authored.

## Structural and boundary inventory

Return and call sites are excluded from the local-branch count. Memory counts include loads, stores, stack operations, and multiple loads/stores. A next-global offset larger than the body size identifies material outside this batch; none of that material is owned here.

| Function | Bytes | Instructions | Wide | Local branches | Memory ops | Returns | Indirect calls | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00302F28` | 14 | 6 | 1 | 0 | 3 | 1 | 0 | 1 | `func_00302F3C` (+0x14) |
| `func_00304568` | 14 | 6 | 1 | 0 | 4 | 1 | 0 | 1 | `func_0030457C` (+0x14) |
| `func_00304594` | 14 | 6 | 1 | 0 | 4 | 1 | 0 | 1 | `func_003045A8` (+0x14) |
| `func_00100788` | 16 | 7 | 1 | 0 | 5 | 1 | 0 | 1 | `func_001007A4` (+0x1c) |
| `func_002FF89C` | 16 | 7 | 1 | 0 | 4 | 1 | 0 | 1 | `func_002FF8C0` (+0x24) |
| `func_00305490` | 16 | 7 | 1 | 0 | 4 | 1 | 0 | 1 | `func_003054A4` (+0x14) |
| `func_0030570C` | 16 | 7 | 1 | 0 | 4 | 1 | 0 | 1 | `func_00305720` (+0x14) |
| `func_001024D4` | 18 | 8 | 1 | 0 | 5 | 1 | 0 | 1 | `func_001024EC` (+0x18) |
| `func_00304898` | 18 | 8 | 1 | 0 | 5 | 1 | 0 | 1 | `func_003048B4` (+0x1c) |
| `func_003054A4` | 18 | 8 | 1 | 0 | 5 | 1 | 0 | 1 | `func_003054C0` (+0x1c) |
| `func_001040B4` | 20 | 9 | 1 | 0 | 4 | 1 | 0 | 1 | `func_001040CC` (+0x18) |
| `func_00104080` | 22 | 10 | 1 | 0 | 5 | 1 | 0 | 1 | `func_001040B4` (+0x34) |
| `func_003054F6` | 26 | 11 | 2 | 0 | 2 | 1 | 0 | 2 | `func_00305510` (+0x1a) |
| `func_00303BBC` | 36 | 15 | 3 | 1 | 8 | 1 | 0 | 3 | `func_00303BE4` (+0x28) |
| `func_00303110` | 46 | 21 | 2 | 2 | 12 | 1 | 0 | 2 | `func_00303150` (+0x40) |
| `func_00103780` | 60 | 26 | 4 | 8 | 2 | 0 | 0 | 4 | `func_00103A16` (+0x296) |
| `func_003031BC` | 60 | 26 | 4 | 3 | 12 | 1 | 0 | 4 | `func_003032D0` (+0x114) |
| `func_002FFA6C` | 94 | 41 | 6 | 3 | 12 | 1 | 0 | 6 | `func_002FFAF4` (+0x88) |
| `func_001024EC` | 106 | 52 | 1 | 10 | 16 | 1 | 2 | 1 | `func_00102590` (+0xa4) |
| `func_00102910` | 108 | 50 | 4 | 10 | 14 | 2 | 0 | 4 | `func_00102980` (+0x70) |
| `func_00102A56` | 108 | 52 | 2 | 9 | 14 | 1 | 0 | 2 | `func_00102AC4` (+0x6e) |
| `func_002FEC7C` | 112 | 54 | 2 | 10 | 13 | 1 | 0 | 2 | `func_002FECF8` (+0x7c) |
| `func_001003FA` | 116 | 55 | 3 | 10 | 18 | 1 | 0 | 3 | `func_0010046E` (+0x74) |
| `func_00304CB0` | 116 | 53 | 5 | 7 | 13 | 1 | 1 | 5 | `func_00304D24` (+0x74) |

Totals: 1,190 body bytes, zero adjacent bytes, 545 instructions, 50 wide instructions, 73 local branches, 188 memory operations, 24 return sites, 3 indirect calls, no indirect tails, and 50 direct calls.

`func_001024EC` has two register-indirect `blx r1` sites; `func_00304CB0` has one `blx r5` site. `func_00103780` has no explicit return site because all completed paths continue through its recorded control-flow graph; `func_00102910` has two return sites. These facts explain why the aggregate return count still equals the function count.

## Direct calls and relocation contract

Offsets are hexadecimal byte offsets from the function entry. Every site is a 32-bit Thumb call and must carry exactly one `R_ARM_THM_CALL` relocation to the recorded symbol. Mnemonic is normative because it records the target state.

| Function | Offset | Mnemonic | Symbol | Target mode | Relocation |
| --- | ---: | --- | --- | --- | --- |
| `func_00302F28` | +0x8 | `bl` | `func_0030274A` | thumb | `R_ARM_THM_CALL` |
| `func_00304568` | +0x4 | `bl` | `func_00303D84` | thumb | `R_ARM_THM_CALL` |
| `func_00304594` | +0x4 | `bl` | `func_00303D84` | thumb | `R_ARM_THM_CALL` |
| `func_00100788` | +0x2 | `bl` | `func_0010092C` | thumb | `R_ARM_THM_CALL` |
| `func_002FF89C` | +0x8 | `bl` | `func_003009F4` | thumb | `R_ARM_THM_CALL` |
| `func_00305490` | +0x8 | `bl` | `func_003036C0` | thumb | `R_ARM_THM_CALL` |
| `func_0030570C` | +0x8 | `bl` | `func_003036C0` | thumb | `R_ARM_THM_CALL` |
| `func_001024D4` | +0xc | `bl` | `func_001024EC` | thumb | `R_ARM_THM_CALL` |
| `func_00304898` | +0xc | `bl` | `func_00305A40` | thumb | `R_ARM_THM_CALL` |
| `func_003054A4` | +0xc | `bl` | `func_00305A40` | thumb | `R_ARM_THM_CALL` |
| `func_001040B4` | +0xc | `bl` | `func_002FF86C` | thumb | `R_ARM_THM_CALL` |
| `func_00104080` | +0xa | `blx` | `func_002FF10C` | arm | `R_ARM_THM_CALL` |
| `func_003054F6` | +0xc | `bl` | `func_003048EE` | thumb | `R_ARM_THM_CALL` |
| `func_003054F6` | +0x14 | `bl` | `func_0030490A` | thumb | `R_ARM_THM_CALL` |
| `func_00303BBC` | +0x10 | `blx` | `func_002FF10C` | arm | `R_ARM_THM_CALL` |
| `func_00303BBC` | +0x16 | `blx` | `func_002FF10C` | arm | `R_ARM_THM_CALL` |
| `func_00303BBC` | +0x1c | `blx` | `func_002FF10C` | arm | `R_ARM_THM_CALL` |
| `func_00303110` | +0xc | `bl` | `func_00302F52` | thumb | `R_ARM_THM_CALL` |
| `func_00303110` | +0x20 | `blx` | `func_00303D98` | arm | `R_ARM_THM_CALL` |
| `func_00103780` | +0xa | `bl` | `func_00302F3C` | thumb | `R_ARM_THM_CALL` |
| `func_00103780` | +0x10 | `blx` | `func_002FF10C` | arm | `R_ARM_THM_CALL` |
| `func_00103780` | +0x28 | `bl` | `func_00302F3C` | thumb | `R_ARM_THM_CALL` |
| `func_00103780` | +0x2c | `blx` | `func_002FED34` | arm | `R_ARM_THM_CALL` |
| `func_003031BC` | +0xa | `bl` | `func_002FFA6C` | thumb | `R_ARM_THM_CALL` |
| `func_003031BC` | +0x16 | `bl` | `func_00302F52` | thumb | `R_ARM_THM_CALL` |
| `func_003031BC` | +0x24 | `bl` | `func_0030361C` | thumb | `R_ARM_THM_CALL` |
| `func_003031BC` | +0x2c | `blx` | `func_00303D98` | arm | `R_ARM_THM_CALL` |
| `func_002FFA6C` | +0xc | `bl` | `func_002FFD20` | thumb | `R_ARM_THM_CALL` |
| `func_002FFA6C` | +0x18 | `bl` | `func_002FFD48` | thumb | `R_ARM_THM_CALL` |
| `func_002FFA6C` | +0x28 | `bl` | `func_00101CD0` | thumb | `R_ARM_THM_CALL` |
| `func_002FFA6C` | +0x30 | `bl` | `func_00101CD8` | thumb | `R_ARM_THM_CALL` |
| `func_002FFA6C` | +0x40 | `bl` | `func_002FFD20` | thumb | `R_ARM_THM_CALL` |
| `func_002FFA6C` | +0x4c | `bl` | `func_002FFD48` | thumb | `R_ARM_THM_CALL` |
| `func_001024EC` | +0x26 | `bl` | `func_002FF094` | thumb | `R_ARM_THM_CALL` |
| `func_00102910` | +0x10 | `blx` | `func_002FEDF0` | arm | `R_ARM_THM_CALL` |
| `func_00102910` | +0x2c | `bl` | `func_003011B0` | thumb | `R_ARM_THM_CALL` |
| `func_00102910` | +0x4c | `blx` | `func_002FED78` | arm | `R_ARM_THM_CALL` |
| `func_00102910` | +0x62 | `blx` | `func_002FED78` | arm | `R_ARM_THM_CALL` |
| `func_00102A56` | +0x24 | `bl` | `func_002FFBF8` | thumb | `R_ARM_THM_CALL` |
| `func_00102A56` | +0x56 | `blx` | `func_00300B28` | arm | `R_ARM_THM_CALL` |
| `func_002FEC7C` | +0x2e | `bl` | `func_002FED38` | thumb | `R_ARM_THM_CALL` |
| `func_002FEC7C` | +0x5a | `blx` | `func_002FED78` | arm | `R_ARM_THM_CALL` |
| `func_001003FA` | +0xa | `blx` | `func_002FED78` | arm | `R_ARM_THM_CALL` |
| `func_001003FA` | +0x1e | `bl` | `func_002FED84` | thumb | `R_ARM_THM_CALL` |
| `func_001003FA` | +0x3c | `bl` | `func_00100500` | thumb | `R_ARM_THM_CALL` |
| `func_00304CB0` | +0x14 | `bl` | `func_00304898` | thumb | `R_ARM_THM_CALL` |
| `func_00304CB0` | +0x18 | `bl` | `func_003048B4` | thumb | `R_ARM_THM_CALL` |
| `func_00304CB0` | +0x22 | `bl` | `func_003048BE` | thumb | `R_ARM_THM_CALL` |
| `func_00304CB0` | +0x2e | `bl` | `func_00304898` | thumb | `R_ARM_THM_CALL` |
| `func_00304CB0` | +0x5a | `bl` | `func_003048D0` | thumb | `R_ARM_THM_CALL` |

There are no other required relocations. All fifty destinations resolve to exact neutral global entries, not secondary or interior entries. The call set contains thirty-six Thumb `bl` sites and fourteen ARM-state `blx` sites. Repeated destinations are intentional and remain distinct relocation sites.

## Local and indirect control flow

The seventy-three function-local transfers are completely represented in each function's `localTransfers` array. Every one uses the recorded 16-bit `.n` encoding and exact local target. The three register-indirect calls are completely represented by `indirectCalls`; no selected function has an indirect tail. Call, return, and indirect-call transfers are not counted as local branches.

## PC-relative semantics and ownership

The forty-two entries below use Thumb's word-aligned PC base. Thirty-three are literal `ldr` accesses and nine are address-forming `adr` operations (disassembled as `add Rd, pc, #imm`). Every selected entry is at address zero modulo four, which is normative for reproducing these encodings. Object sections still require only two-byte alignment; linked placement must preserve the recorded modulo-four invariant. Target offsets are hexadecimal.

| Function | Instruction offset | Form | Target offset | Entry modulo 4 | Ownership |
| --- | ---: | --- | ---: | ---: | --- |
| `func_00302F28` | +0x6 | `ldr` | +0x10 | 0 | unowned-post-body |
| `func_00304568` | +0x8 | `ldr` | +0x10 | 0 | unowned-post-body |
| `func_00304594` | +0x8 | `ldr` | +0x10 | 0 | unowned-post-body |
| `func_00100788` | +0x6 | `ldr` | +0x10 | 0 | unowned-post-body |
| `func_002FF89C` | +0x6 | `ldr` | +0x10 | 0 | unowned-post-body |
| `func_00305490` | +0x0 | `ldr` | +0x10 | 0 | unowned-post-body |
| `func_0030570C` | +0x0 | `ldr` | +0x10 | 0 | unowned-post-body |
| `func_001024D4` | +0x6 | `ldr` | +0x14 | 0 | unowned-post-body |
| `func_00304898` | +0x2 | `ldr` | +0x14 | 0 | unowned-post-body |
| `func_00304898` | +0x6 | `ldr` | +0x18 | 0 | unowned-post-body |
| `func_003054A4` | +0x2 | `ldr` | +0x14 | 0 | unowned-post-body |
| `func_003054A4` | +0x6 | `ldr` | +0x18 | 0 | unowned-post-body |
| `func_001040B4` | +0x4 | `ldr` | +0x14 | 0 | unowned-post-body |
| `func_00104080` | +0x4 | `ldr` | +0x18 | 0 | unowned-post-body |
| `func_00303BBC` | +0x4 | `ldr` | +0x24 | 0 | unowned-post-body |
| `func_00303110` | +0x0 | `ldr` | +0x30 | 0 | unowned-post-body |
| `func_00303110` | +0xa | `ldr` | +0x30 | 0 | unowned-post-body |
| `func_00303110` | +0x14 | `ldr` | +0x34 | 0 | unowned-post-body |
| `func_00303110` | +0x1c | `ldr` | +0x38 | 0 | unowned-post-body |
| `func_00303110` | +0x1e | `ldr` | +0x3c | 0 | unowned-post-body |
| `func_00303110` | +0x24 | `ldr` | +0x30 | 0 | unowned-post-body |
| `func_00303110` | +0x2a | `ldr` | +0x34 | 0 | unowned-post-body |
| `func_00103780` | +0x6 | `ldr` | +0x4c | 0 | unowned-post-body |
| `func_00103780` | +0x8 | `adr` | +0x3c | 0 | unowned-post-body |
| `func_00103780` | +0x22 | `adr` | +0x50 | 0 | unowned-post-body |
| `func_00103780` | +0x24 | `ldr` | +0x4c | 0 | unowned-post-body |
| `func_00103780` | +0x26 | `adr` | +0x3c | 0 | unowned-post-body |
| `func_00103780` | +0x30 | `adr` | +0x58 | 0 | unowned-post-body |
| `func_00103780` | +0x34 | `adr` | +0x64 | 0 | unowned-post-body |
| `func_00103780` | +0x38 | `adr` | +0x7c | 0 | unowned-post-body |
| `func_003031BC` | +0x2 | `ldr` | +0x3c | 0 | unowned-post-body |
| `func_003031BC` | +0x14 | `ldr` | +0x3c | 0 | unowned-post-body |
| `func_003031BC` | +0x1e | `ldr` | +0x3c | 0 | unowned-post-body |
| `func_003031BC` | +0x28 | `ldr` | +0x40 | 0 | unowned-post-body |
| `func_003031BC` | +0x2a | `ldr` | +0x44 | 0 | unowned-post-body |
| `func_003031BC` | +0x30 | `ldr` | +0x3c | 0 | unowned-post-body |
| `func_003031BC` | +0x36 | `ldr` | +0x3c | 0 | unowned-post-body |
| `func_002FFA6C` | +0x2 | `ldr` | +0x7c | 0 | unowned-post-body |
| `func_002FFA6C` | +0x16 | `adr` | +0x80 | 0 | unowned-post-body |
| `func_002FFA6C` | +0x4a | `adr` | +0x84 | 0 | unowned-post-body |
| `func_00102910` | +0x68 | `ldr` | +0x6c | 0 | unowned-post-body |
| `func_002FEC7C` | +0x12 | `adr` | +0x70 | 0 | unowned-post-body |

Every destination is post-body material strictly before the recorded next global. No access crosses a function interval. No literal pool, addressed word, string, identity mapping, or target-object generator data entry is owned by this batch, and none may be copied into implementation source.

## Canonical schedules and hashes

The configuration is the complete neutral implementation handoff. Split each function's `schedule` on `|`. Determine byte offsets cumulatively: entries at `wideInstructionOffsets` are four bytes and all other entries are two. A local transfer uses `local:+target`, with a lowercase hexadecimal target and no `0x` prefix. The control arrays redundantly record every branch, return, indirect call, indirect tail, and direct call.

Canonical instruction records are `function:hexOffset:mnemonic:operands`. Records are joined by LF with no terminal newline.

- Full mnemonic/operand schedule: `1fef3630200eac5d8d7818b23de3ba3e6f3998935f85f1dde2c3644a5f52c69a`
- Local-transfer schedule: `d86fb13cc8ea13ea79739dfec5f0808330d4c00687646607baf01c332b673f92`
- Return schedule: `643dc713f175c7d21826f05529cc3c988fdaba729b127d4b425fecd8196eceed`
- Indirect-call schedule: `d50d6e845ab97df3a2b3d35172c4d40cffba2e1c89b984c438879c09d9f58f2c`
- Indirect-tail schedule: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Direct-call schedule: `bd7177a5395cbbee8be526f0267f6a0fb1ae1293b6ea12b96f1f1eb32a664f95`

Instruction selection, flags behavior, operand order, call state transition, branch width, order, mode, entry placement, and body boundary are normative. Equivalent uniquely scoped local-label names are permitted.

GNU Arm assembly can silently canonicalize a three-operand `adds` or `subs` immediate into a byte-distinct two-operand form. Every explicit three-operand immediate entry requires the Thumb16 immediate-three-bit form; every two-operand immediate entry requires the Thumb16 immediate-eight-bit form. When the assembler cannot preserve an architectural distinction, use a Thumb instruction-emission directive such as `.inst.n`; a data-emission directive is not equivalent because it introduces `$d` mapping symbols inside an executable body. Every complete body must remain covered by Thumb code mapping (`$t`) with no interior `$d` interval. Section alignment must remain two bytes; raising it to four can introduce isolated-section padding.

## Unmatched, ownership, and collision audit

All twenty-four selected report entries were unmatched at zero percent when selected, and their report sizes sum to 1,190 bytes. Names are pairwise distinct and body intervals are pairwise disjoint. Recursive inspection of every public configuration found no selected name as a function member, alias, identity member, or secondary entry already owned by another batch. Earlier public appearances are only external call targets or next-global boundaries and therefore do not claim a selected body.

Exact whole-body comparison against all 10,440 target functions found every selected body to be a singleton class. There is no selected-to-selected or selected-to-unselected whole-body collision, so `duplicateBodyClasses` is empty and already closed.

## Independent validation and completeness contract

The analysis independently recomputed every body boundary, instruction width, direct-call destination and target state, local destination, return, indirect call, memory count, PC-relative destination, ownership exclusion, collision class, aggregate, and canonical hash. A fresh GNU Arm assembly of the neutral schedules reproduced every non-call byte in all twenty-four bodies, emitted exactly fifty `R_ARM_THM_CALL` relocations at the recorded sites, and kept every body under continuous `$t` mapping. Symbolic call sites were checked by decoded destination, mnemonic, relocation kind, and target mode rather than by retaining target call encodings.

The implementation must define exactly these twenty-four global Thumb functions in individual `.text.<name>` sections. Each section stops at its recorded body size and contains the exact ordered schedule, local transfers, indirect calls, and direct-call relocations. Sections require two-byte alignment; linked placement of every PC-relative function must preserve entry address zero modulo four without isolated-section padding.

The implementation must emit no trailing alignment byte, pool word, addressed post-body material, string, asset, unexpected external reference, extra relocation, direct external jump, or adjacent data. Post-body PC targets remain outside batch ownership and must not be copied into source or a target-object identity mapping. Validation must reject an interior `$d` mapping symbol in any selected executable body even when the underlying bytes happen to match, because objdiff treats those bytes as data rather than Thumb instructions.

The validator must bound source/config reads to 64 MiB, object reads and total executable payload to 16 MiB, section count to 16,384, and symbol/relocation counts independently to 1,000,000. It must accept both isolated and large foreign composites, reject extra executable ownership or selected-name collisions, verify exact per-section size/alignment and continuous Thumb mapping, confirm all forty-two PC-relative entries and their unowned residue contract, enforce the empty duplicate-class inventory, and require `sourceSha256` to be a lowercase 64-digit SHA-256 before source validation can pass.
