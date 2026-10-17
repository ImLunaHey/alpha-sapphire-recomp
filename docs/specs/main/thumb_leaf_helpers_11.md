# Probe-verified Thumb leaf/helper batch 11

## Scope and provenance

This clean-room analysis specification covers thirteen currently unmatched Thumb-state functions totaling 4,482 executable bytes and 2,159 instructions for revision `AS_EUR_REV2`. Evidence was limited to the current unmatched objdiff report, the neutral symbol inventory, recursive public configuration ownership metadata, bounded private-target control/data-flow inspection, and an independent assembly round trip of the neutral schedules. No implementation source was read or authored while preparing this batch.

The selection is the next size-ordered safe closure after batch 10: every eligible singleton from 228 through 510 bytes, ending before the remaining 902-byte function. It excludes smaller veneers, every call to a secondary or interior entry, every external non-call branch, every function with addressed inline data, and `func_003026AC`, whose address-forming PC-relative operation crosses its global interval. The batch has 82 32-bit instructions, all direct calls, and 2,077 16-bit instructions. It contains 364 local branches, 629 memory operations, 18 return sites, 35 register-indirect calls, no indirect tails, 82 direct calls, and no direct external jump, owned adjacent data, private string, or asset.

`sourceSha256` is `a8886cecb37fd262602d1376141f6b2df74a88ad81853d15b1da93a50ec38517`.

## Structural and boundary inventory

Return and call sites are excluded from the local-branch count. Memory counts include loads, stores, stack operations, and multiple loads/stores. A next-global offset larger than the body size identifies material outside this batch; none of that material is owned here.

| Function | Bytes | Instructions | Wide | Local branches | Memory ops | Returns | Indirect calls | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_0010115A` | 228 | 112 | 2 | 22 | 39 | 1 | 6 | 2 | `func_0010123E` (+0xe4) |
| `func_00301E0C` | 240 | 116 | 4 | 23 | 29 | 3 | 0 | 4 | `func_00301F00` (+0xf4) |
| `func_003034CC` | 254 | 120 | 7 | 19 | 33 | 1 | 1 | 7 | `func_003035D4` (+0x108) |
| `func_00101040` | 282 | 140 | 1 | 27 | 47 | 1 | 7 | 1 | `func_0010115A` (+0x11a) |
| `func_00303954` | 300 | 140 | 10 | 25 | 24 | 1 | 0 | 10 | `func_00303A88` (+0x134) |
| `func_00103F08` | 310 | 143 | 12 | 26 | 19 | 1 | 0 | 12 | `func_0010405C` (+0x154) |
| `func_00100CD0` | 324 | 160 | 2 | 31 | 52 | 1 | 7 | 2 | `func_00100E14` (+0x144) |
| `func_001007BC` | 330 | 148 | 17 | 11 | 44 | 1 | 2 | 17 | `func_0010092C` (+0x170) |
| `func_00100E14` | 330 | 164 | 1 | 38 | 50 | 1 | 7 | 1 | `func_00100F5E` (+0x14a) |
| `func_00102590` | 372 | 176 | 10 | 24 | 48 | 1 | 0 | 10 | `func_00102724` (+0x194) |
| `func_0030291C` | 492 | 238 | 8 | 38 | 84 | 4 | 0 | 8 | `func_00302B8C` (+0x270) |
| `func_0010145C` | 510 | 248 | 7 | 37 | 70 | 1 | 0 | 7 | `func_00101934` (+0x4d8) |
| `func_00102B04` | 510 | 254 | 1 | 43 | 90 | 1 | 5 | 1 | `func_00102D02` (+0x1fe) |

Totals: 4,482 body bytes, zero adjacent bytes, 2,159 instructions, 82 wide instructions, 364 local branches, 629 memory operations, 18 return sites, 35 indirect calls, no indirect tails, and 82 direct calls.

`func_00301E0C` has three explicit return sites and `func_0030291C` has four; every other selected function has one. Seven functions contain register-indirect calls, completely enumerated in their `indirectCalls` arrays. These facts explain the eighteen returns and thirty-five indirect calls.

## Direct calls and relocation contract

All 82 direct-call sites are completely and redundantly recorded in the top-level `directCalls`, `relocations`, and per-function `directCalls` arrays. There are 65 Thumb-state `bl` sites and 17 ARM-state `blx` sites targeting 43 distinct exact neutral global entries. Every site is a 32-bit Thumb call and must carry exactly one `R_ARM_THM_CALL` relocation to the recorded symbol. Mnemonic and target mode are normative. There are no other required relocations.

No destination is a secondary or interior entry. Repeated destinations are intentional and remain distinct relocation sites. Offsets in the configuration are decimal JSON integers but represent byte offsets from the function entry; canonical records render them as lowercase hexadecimal.

## Local and indirect control flow

The 364 function-local transfers are completely represented in each function's `localTransfers` array. Every one uses the recorded 16-bit `.n` encoding and exact local target. The 35 register-indirect calls are completely represented by `indirectCalls`; no selected function has an indirect tail. Call, return, and indirect-call transfers are not counted as local branches.

## PC-relative semantics and ownership

The 32 entries below use Thumb's word-aligned PC base. Twenty-two are literal `ldr` accesses and ten are address-forming `adr` operations (disassembled as `add Rd, pc, #imm`). Every selected entry that uses PC-relative addressing is at address zero modulo four, which is normative for reproducing these encodings. Object sections still require only two-byte alignment; linked placement must preserve the recorded modulo-four invariant.

| Function | Instruction offset | Form | Target offset | Entry modulo 4 | Ownership |
| --- | ---: | --- | ---: | ---: | --- |
| `func_00301E0C` | +0xe2 | `ldr` | +0xf0 | 0 | unowned-post-body |
| `func_003034CC` | +0x16 | `ldr` | +0x100 | 0 | unowned-post-body |
| `func_003034CC` | +0x88 | `adr` | +0x104 | 0 | unowned-post-body |
| `func_003034CC` | +0xac | `adr` | +0x104 | 0 | unowned-post-body |
| `func_00303954` | +0xc | `ldr` | +0x12c | 0 | unowned-post-body |
| `func_00303954` | +0x1a | `ldr` | +0x130 | 0 | unowned-post-body |
| `func_00103F08` | +0x1a | `ldr` | +0x138 | 0 | unowned-post-body |
| `func_00103F08` | +0x22 | `ldr` | +0x13c | 0 | unowned-post-body |
| `func_001007BC` | +0x4 | `ldr` | +0x14c | 0 | unowned-post-body |
| `func_001007BC` | +0xc | `adr` | +0x150 | 0 | unowned-post-body |
| `func_001007BC` | +0x28 | `ldr` | +0x14c | 0 | unowned-post-body |
| `func_001007BC` | +0x30 | `adr` | +0x15c | 0 | unowned-post-body |
| `func_001007BC` | +0x44 | `ldr` | +0x160 | 0 | unowned-post-body |
| `func_001007BC` | +0x5e | `ldr` | +0x164 | 0 | unowned-post-body |
| `func_001007BC` | +0x72 | `adr` | +0x168 | 0 | unowned-post-body |
| `func_001007BC` | +0x8c | `ldr` | +0x16c | 0 | unowned-post-body |
| `func_001007BC` | +0x90 | `ldr` | +0x160 | 0 | unowned-post-body |
| `func_001007BC` | +0xf0 | `ldr` | +0x160 | 0 | unowned-post-body |
| `func_001007BC` | +0xfc | `adr` | +0x158 | 0 | unowned-post-body |
| `func_00102590` | +0x32 | `adr` | +0x174 | 0 | unowned-post-body |
| `func_00102590` | +0x34 | `adr` | +0x174 | 0 | unowned-post-body |
| `func_00102590` | +0x66 | `adr` | +0x174 | 0 | unowned-post-body |
| `func_00102590` | +0x68 | `adr` | +0x174 | 0 | unowned-post-body |
| `func_00102590` | +0x130 | `ldr` | +0x178 | 0 | unowned-post-body |
| `func_0030291C` | +0x20 | `ldr` | +0x1ec | 0 | unowned-post-body |
| `func_0030291C` | +0x108 | `ldr` | +0x1f0 | 0 | unowned-post-body |
| `func_0010145C` | +0xc2 | `ldr` | +0x4ac | 0 | unowned-post-body |
| `func_0010145C` | +0xdc | `ldr` | +0x4b0 | 0 | unowned-post-body |
| `func_0010145C` | +0x11a | `ldr` | +0x4b4 | 0 | unowned-post-body |
| `func_0010145C` | +0x126 | `ldr` | +0x4b4 | 0 | unowned-post-body |
| `func_0010145C` | +0x1c2 | `ldr` | +0x4b8 | 0 | unowned-post-body |
| `func_0010145C` | +0x1e4 | `ldr` | +0x4bc | 0 | unowned-post-body |

Every destination is post-body material strictly before the recorded next global. No access crosses a function interval. No literal pool, addressed word, string, identity mapping, or target-object generator data entry is owned by this batch, and none may be copied into implementation source. Literal-plus-PC address construction remains fully represented by the ordered instruction schedule; only the accessed post-body literal word is part of the residue contract.

## Canonical schedules and hashes

The configuration is the complete neutral implementation handoff. Split each function's `schedule` on `|`. Determine byte offsets cumulatively: entries at `wideInstructionOffsets` are four bytes and all other entries are two. A local transfer uses `local:+target`, with a lowercase hexadecimal target and no `0x` prefix. The control arrays redundantly record every branch, return, indirect call, indirect tail, and direct call.

Canonical instruction records are `function:hexOffset:mnemonic:operands`. Records are joined by LF with no terminal newline.

- Full mnemonic/operand schedule: `08dbc8255c9d1c3192f9fe6b5d55f9369852d7fbb3c76e09500c33547c67a47a`
- Local-transfer schedule: `8025e56ff8c599dcaeaba019691e0aec205242e2d133ee63b14ac684acd4eb01`
- Return schedule: `df75d8bccabf5c2174325a6da4c22219982d6bd8cfdd3119b04bccbb5645d59e`
- Indirect-call schedule: `77457eb605946ed0e7f1b0d7d46c8783ee2c82602c28b11c8830192b3677a498`
- Indirect-tail schedule: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Direct-call schedule: `ea713478cd71e718e3bb8f9dab3ac0c7cccc4315f5b8cb6d3fa40d312dd13fe8`

Instruction selection, flags behavior, operand order, call state transition, branch width, order, mode, entry placement, and body boundary are normative. Equivalent uniquely scoped local-label names are permitted.

GNU Arm assembly can silently canonicalize a three-operand `adds` or `subs` immediate into a byte-distinct two-operand form. Every explicit three-operand immediate entry requires the Thumb16 immediate-three-bit form; every two-operand immediate entry requires the Thumb16 immediate-eight-bit form. When the assembler cannot preserve an architectural distinction, use a Thumb instruction-emission directive such as `.inst.n`; a data-emission directive is not equivalent because it introduces `$d` mapping symbols inside an executable body. Every complete body must remain covered by Thumb code mapping (`$t`) with no interior `$d` interval. Section alignment must remain two bytes; raising it to four can introduce isolated-section padding.

## Unmatched, ownership, and collision audit

All thirteen selected report entries were unmatched at zero percent when selected, and their report sizes sum to 4,482 bytes. Names are pairwise distinct and body intervals are pairwise disjoint. Recursive inspection of every public configuration found no selected name as a function member, alias, identity member, or secondary entry already owned by another batch. Earlier public appearances are only external call targets or next-global boundaries and therefore do not claim a selected body.

Exact whole-body comparison against all 10,440 target functions found every selected body to be a singleton class. There is no selected-to-selected or selected-to-unselected whole-body collision, so `duplicateBodyClasses` is empty and already closed.

## Independent validation and completeness contract

The analysis independently recomputed every body boundary, instruction width, direct-call destination and target state, local destination, return, indirect call, memory count, PC-relative destination, ownership exclusion, collision class, aggregate, and canonical hash directly from bounded target and symbol evidence. A fresh GNU Arm assembly of the neutral schedules reproduced every non-call byte in all thirteen bodies, emitted exactly 82 `R_ARM_THM_CALL` relocations at the recorded sites, preserved each section's exact size and two-byte alignment, and kept every body under continuous `$t` mapping. Symbolic call sites were checked by decoded destination, mnemonic, relocation kind, and target mode rather than by retaining target call encodings.

The implementation must define exactly these thirteen global Thumb functions in individual `.text.<name>` sections. Each section stops at its recorded body size and contains the exact ordered schedule, local transfers, indirect calls, and direct-call relocations. Sections require two-byte alignment; linked placement of every PC-relative function must preserve entry address zero modulo four without isolated-section padding.

The implementation must emit no trailing alignment byte, pool word, addressed post-body material, string, asset, unexpected external reference, extra relocation, direct external jump, or adjacent data. Post-body PC targets remain outside batch ownership and must not be copied into source or a target-object identity mapping. Validation must reject an interior `$d` mapping symbol in any selected executable body even when the underlying bytes happen to match, because objdiff treats those bytes as data rather than Thumb instructions.

The validator must bound source/config reads to 64 MiB, object reads and total executable payload to 16 MiB, section count to 16,384, and symbol/relocation counts independently to 1,000,000. Its self-test must exercise a valid executable composite with at least 12,000 sections. It must accept both isolated and large foreign composites, reject extra executable ownership or selected-name collisions, verify exact per-section size/alignment and continuous Thumb mapping, confirm all thirty-two PC-relative entries and their unowned residue contract, enforce the empty duplicate-class inventory, and require `sourceSha256` to be a lowercase 64-digit SHA-256 before source validation can pass.
