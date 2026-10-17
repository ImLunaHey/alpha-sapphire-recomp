# Probe-verified Thumb leaf/helper batch 10

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched Thumb-state functions totaling 3,998 executable bytes and 1,907 instructions for revision `AS_EUR_REV2`. Evidence was limited to the current unmatched objdiff report, the neutral symbol inventory, recursive public configuration ownership metadata, and bounded private-target control/data-flow inspection. No implementation source was read or authored while preparing this batch.

The selection is the next size-ordered safe closure after batch 09. It excludes every smaller veneer, every call to a secondary or interior entry, every external non-call branch, every function with addressed inline data, and the otherwise size-eligible `func_003026AC`, whose address-forming PC-relative operation crosses its global interval. The batch has 92 32-bit instructions, all direct calls, and 1,815 16-bit instructions. It contains 310 local branches, 576 memory operations, 25 return sites, 25 register-indirect calls, no indirect tails, 92 direct calls, and no direct external jump, owned adjacent data, private string, or asset.

`sourceSha256` is `bef1e8cb95a1470c18e97fbe10fb3f472b92d89be9f6abe97c7bd87cb8c42ab5`, the lowercase SHA-256 of the completed source.

## Structural and boundary inventory

Return and call sites are excluded from the local-branch count. Memory counts include loads, stores, stack operations, and multiple loads/stores. A next-global offset larger than the body size identifies material outside this batch; none of that material is owned here.

| Function | Bytes | Instructions | Wide | Local branches | Memory ops | Returns | Indirect calls | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00305526` | 116 | 53 | 5 | 7 | 13 | 1 | 1 | 5 | `func_0030559A` (+0x74) |
| `func_00102980` | 118 | 56 | 3 | 10 | 20 | 1 | 0 | 3 | `func_001029F6` (+0x76) |
| `func_00104A50` | 120 | 54 | 6 | 5 | 22 | 1 | 0 | 6 | `func_00104DBA` (+0x36a) |
| `func_002FF324` | 120 | 58 | 2 | 11 | 16 | 1 | 2 | 2 | `func_002FF3AE` (+0x8a) |
| `func_00102FAC` | 122 | 58 | 3 | 10 | 18 | 1 | 0 | 3 | `func_00103028` (+0x7c) |
| `func_00303640` | 122 | 58 | 3 | 5 | 26 | 1 | 2 | 3 | `func_003036C0` (+0x80) |
| `func_00102F30` | 124 | 59 | 3 | 10 | 20 | 1 | 0 | 3 | `func_00102FAC` (+0x7c) |
| `func_00102D02` | 136 | 67 | 1 | 17 | 14 | 1 | 1 | 1 | `func_00102D8A` (+0x88) |
| `func_001005A8` | 140 | 66 | 4 | 9 | 23 | 1 | 1 | 4 | `func_00100638` (+0x90) |
| `func_00104DBA` | 148 | 66 | 8 | 8 | 15 | 1 | 1 | 8 | `func_001054F4` (+0x73a) |
| `func_0010564A` | 148 | 66 | 8 | 8 | 15 | 1 | 1 | 8 | `func_00105DA4` (+0x75a) |
| `func_00100500` | 168 | 82 | 2 | 19 | 18 | 1 | 0 | 2 | `func_001005A8` (+0xa8) |
| `func_003011B0` | 168 | 82 | 2 | 19 | 18 | 1 | 0 | 2 | `func_00301D1C` (+0xb6c) |
| `func_002FF988` | 176 | 85 | 3 | 14 | 29 | 1 | 3 | 3 | `func_002FFA44` (+0xbc) |
| `func_001013A0` | 182 | 87 | 4 | 13 | 31 | 1 | 1 | 4 | `func_0010145C` (+0xbc) |
| `func_00103E3C` | 186 | 87 | 6 | 14 | 7 | 2 | 0 | 6 | `func_00103F08` (+0xcc) |
| `func_001034A0` | 200 | 97 | 3 | 19 | 33 | 1 | 0 | 3 | `func_00103568` (+0xc8) |
| `func_0010123E` | 204 | 101 | 1 | 21 | 41 | 1 | 6 | 1 | `func_0010130A` (+0xcc) |
| `func_002FF118` | 206 | 98 | 5 | 11 | 24 | 1 | 0 | 5 | `func_002FF1EC` (+0xd4) |
| `func_001031A8` | 212 | 103 | 3 | 19 | 27 | 1 | 0 | 3 | `func_0010327C` (+0xd4) |
| `func_0010327C` | 212 | 103 | 3 | 19 | 27 | 1 | 0 | 3 | `func_00103350` (+0xd4) |
| `func_001033C4` | 220 | 106 | 4 | 11 | 43 | 1 | 0 | 4 | `func_001034A0` (+0xdc) |
| `func_002FFD48` | 224 | 102 | 10 | 10 | 38 | 1 | 0 | 10 | `func_002FFE30` (+0xe8) |
| `func_00100F5E` | 226 | 113 | 0 | 21 | 38 | 1 | 6 | 0 | `func_00101040` (+0xe2) |

Totals: 3,998 body bytes, zero adjacent bytes, 1,907 instructions, 92 wide instructions, 310 local branches, 576 memory operations, 25 return sites, 25 indirect calls, no indirect tails, and 92 direct calls.

`func_00103E3C` has two explicit return sites; every other function has one. Eleven functions contain register-indirect calls, completely enumerated in their `indirectCalls` arrays. These facts explain why the aggregate return count is one greater than the function count.

## Direct calls and relocation contract

All 92 direct-call sites are completely and redundantly recorded in the top-level `directCalls`, `relocations`, and per-function `directCalls` arrays. There are 69 Thumb-state `bl` sites and 23 ARM-state `blx` sites targeting 53 distinct exact neutral global entries. Every site is a 32-bit Thumb call and must carry exactly one `R_ARM_THM_CALL` relocation to the recorded symbol. Mnemonic and target mode are normative. There are no other required relocations.

No destination is a secondary or interior entry. Repeated destinations are intentional and remain distinct relocation sites. Offsets in the configuration are decimal JSON integers but represent byte offsets from the function entry; canonical records render them as lowercase hexadecimal.

## Local and indirect control flow

The 310 function-local transfers are completely represented in each function's `localTransfers` array. Every one uses the recorded 16-bit `.n` encoding and exact local target. The 25 register-indirect calls are completely represented by `indirectCalls`; no selected function has an indirect tail. Call, return, and indirect-call transfers are not counted as local branches.

## PC-relative semantics and ownership

The 22 entries below use Thumb's word-aligned PC base. Sixteen are literal `ldr` accesses and six are address-forming `adr` operations (disassembled as `add Rd, pc, #imm`). Every selected entry is at address zero modulo four, which is normative for reproducing these encodings. Object sections still require only two-byte alignment; linked placement must preserve the recorded modulo-four invariant.

| Function | Instruction offset | Form | Target offset | Entry modulo 4 | Ownership |
| --- | ---: | --- | ---: | ---: | --- |
| `func_00104A50` | +0x10 | `ldr` | +0x78 | 0 | unowned-post-body |
| `func_00104A50` | +0x12 | `ldr` | +0x7c | 0 | unowned-post-body |
| `func_00104A50` | +0x5e | `ldr` | +0x78 | 0 | unowned-post-body |
| `func_002FF324` | +0x1a | `adr` | +0x78 | 0 | unowned-post-body |
| `func_002FF324` | +0x1e | `adr` | +0x7c | 0 | unowned-post-body |
| `func_002FF324` | +0x26 | `adr` | +0x80 | 0 | unowned-post-body |
| `func_002FF324` | +0x2a | `adr` | +0x84 | 0 | unowned-post-body |
| `func_00303640` | +0x14 | `ldr` | +0x7c | 0 | unowned-post-body |
| `func_001005A8` | +0x6 | `ldr` | +0x8c | 0 | unowned-post-body |
| `func_001005A8` | +0x4e | `ldr` | +0x8c | 0 | unowned-post-body |
| `func_001013A0` | +0x6 | `ldr` | +0xb8 | 0 | unowned-post-body |
| `func_001013A0` | +0x62 | `ldr` | +0xb8 | 0 | unowned-post-body |
| `func_00103E3C` | +0x2 | `adr` | +0xbc | 0 | unowned-post-body |
| `func_00103E3C` | +0x10 | `adr` | +0xc0 | 0 | unowned-post-body |
| `func_00103E3C` | +0xb2 | `ldr` | +0xc8 | 0 | unowned-post-body |
| `func_002FF118` | +0x6 | `ldr` | +0xd0 | 0 | unowned-post-body |
| `func_002FF118` | +0x18 | `ldr` | +0xd0 | 0 | unowned-post-body |
| `func_002FF118` | +0x52 | `ldr` | +0xd0 | 0 | unowned-post-body |
| `func_002FF118` | +0x70 | `ldr` | +0xd0 | 0 | unowned-post-body |
| `func_002FFD48` | +0x78 | `ldr` | +0xe0 | 0 | unowned-post-body |
| `func_002FFD48` | +0x7a | `ldr` | +0xe4 | 0 | unowned-post-body |
| `func_002FFD48` | +0xc6 | `ldr` | +0xe0 | 0 | unowned-post-body |

Every destination is post-body material strictly before the recorded next global. No access crosses a function interval. No literal pool, addressed word, string, identity mapping, or target-object generator data entry is owned by this batch, and none may be copied into implementation source. Literal-plus-PC address construction remains fully represented by the ordered instruction schedule; only the accessed post-body literal word is part of the residue contract.

## Canonical schedules and hashes

The configuration is the complete neutral implementation handoff. Split each function's `schedule` on `|`. Determine byte offsets cumulatively: entries at `wideInstructionOffsets` are four bytes and all other entries are two. A local transfer uses `local:+target`, with a lowercase hexadecimal target and no `0x` prefix. The control arrays redundantly record every branch, return, indirect call, indirect tail, and direct call.

Canonical instruction records are `function:hexOffset:mnemonic:operands`. Records are joined by LF with no terminal newline.

- Full mnemonic/operand schedule: `a2e9a236ba240da9c0542681d690f14d750b90db118e01d81f5d330fa21302cd`
- Local-transfer schedule: `0bffc3d38c1c7d6360c3f6d2acd79f72ee4a126d4db409045e5e27a369ee652a`
- Return schedule: `4c766e2bcb354c463e78be4605cce232139f276c738a31fabdc87d633259128e`
- Indirect-call schedule: `686924e17f0ceb83275486f812360a848be8274c37acfc58a14292cecf989c9a`
- Indirect-tail schedule: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Direct-call schedule: `77086a9ac1dbb3044982132063a750478ea691cd34ddb9f7f4b687d2b95d183d`

Instruction selection, flags behavior, operand order, call state transition, branch width, order, mode, entry placement, and body boundary are normative. Equivalent uniquely scoped local-label names are permitted.

GNU Arm assembly can silently canonicalize a three-operand `adds` or `subs` immediate into a byte-distinct two-operand form. Every explicit three-operand immediate entry requires the Thumb16 immediate-three-bit form; every two-operand immediate entry requires the Thumb16 immediate-eight-bit form. When the assembler cannot preserve an architectural distinction, use a Thumb instruction-emission directive such as `.inst.n`; a data-emission directive is not equivalent because it introduces `$d` mapping symbols inside an executable body. Every complete body must remain covered by Thumb code mapping (`$t`) with no interior `$d` interval. Section alignment must remain two bytes; raising it to four can introduce isolated-section padding.

## Unmatched, ownership, and collision audit

All twenty-four selected report entries were unmatched at zero percent when selected, and their report sizes sum to 3,998 bytes. Names are pairwise distinct and body intervals are pairwise disjoint. Recursive inspection of every public configuration found no selected name as a function member, alias, identity member, or secondary entry already owned by another batch. Earlier public appearances are only external call targets or next-global boundaries and therefore do not claim a selected body.

Exact whole-body comparison against all 10,440 target functions found every selected body to be a singleton class. There is no selected-to-selected or selected-to-unselected whole-body collision, so `duplicateBodyClasses` is empty and already closed. Similar-looking parser pairs differ in load width and pointer stride; similarly structured wrapper pairs call different exact globals and are not duplicate classes.

## Independent validation and completeness contract

The analysis independently recomputed every body boundary, instruction width, direct-call destination and target state, local destination, return, indirect call, memory count, PC-relative destination, ownership exclusion, collision class, aggregate, and canonical hash directly from bounded target and symbol evidence. Symbolic call sites were checked by decoded destination, mnemonic, target mode, and exact neutral entry rather than by retaining target call encodings.

The implementation must define exactly these twenty-four global Thumb functions in individual `.text.<name>` sections. Each section stops at its recorded body size and contains the exact ordered schedule, local transfers, indirect calls, and direct-call relocations. Sections require two-byte alignment; linked placement of every PC-relative function must preserve entry address zero modulo four without isolated-section padding.

The implementation must emit no trailing alignment byte, pool word, addressed post-body material, string, asset, unexpected external reference, extra relocation, direct external jump, or adjacent data. Post-body PC targets remain outside batch ownership and must not be copied into source or a target-object identity mapping. Validation must reject an interior `$d` mapping symbol in any selected executable body even when the underlying bytes happen to match, because objdiff treats those bytes as data rather than Thumb instructions.

The validator must bound source/config reads to 64 MiB, object reads and total executable payload to 16 MiB, section count to 16,384, and symbol/relocation counts independently to 1,000,000. It must accept both isolated and large foreign composites, reject extra executable ownership or selected-name collisions, verify exact per-section size/alignment and continuous Thumb mapping, confirm all 22 PC-relative entries and their unowned residue contract, enforce the empty duplicate-class inventory, and require `sourceSha256` to be a lowercase 64-digit SHA-256 before source validation can pass.
