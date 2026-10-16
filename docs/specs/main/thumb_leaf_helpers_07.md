# Probe-verified Thumb leaf/helper batch 07

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched Thumb-state functions totaling 256 executable bytes and 99 instructions for revision `AS_EUR_REV2`. Evidence was limited to the current unmatched objdiff report, the neutral symbol inventory, recursive public configuration ownership metadata, bounded private-target control/data-flow inspection, and an independent assembly round trip of the neutral schedules. No implementation source was read while preparing this batch.

The selection takes the next compact eligible helpers after batch 06 while closing every selected whole-body duplicate class. Every body is 8--12 bytes, has at most two direct calls, and contains no owned literal word or other embedded data. The batch has 29 32-bit instructions, all direct calls, and 70 16-bit instructions. It contains 0 local branches, 49 memory operations, 24 return sites, no register-indirect calls or tails, 29 direct calls, and no direct external jump, owned adjacent data, private string, or asset.

`sourceSha256` is `f0483219b86b9a8e4dbf9c1567e4fff8ef7577caf978e96ebcfabc023d84ac1f` for the isolated clean-room implementation.

## Structural and boundary inventory

Return and call sites are excluded from the local-branch count. Memory counts include loads, stores, stack operations, and multiple loads/stores. A next-global offset larger than the body size identifies material outside this batch; none of that material is owned here.

| Function | Bytes | Instructions | Wide | Local branches | Memory ops | Returns | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00101CC8` | 8 | 3 | 1 | 0 | 2 | 1 | 1 | `func_00101CD0` (+0x8) |
| `func_001029F6` | 8 | 3 | 1 | 0 | 2 | 1 | 1 | `func_001029FE` (+0x8) |
| `func_001029FE` | 8 | 3 | 1 | 0 | 2 | 1 | 1 | `func_00102A56` (+0x58) |
| `func_002FF094` | 8 | 3 | 1 | 0 | 2 | 1 | 1 | `func_002FF09C` (+0x8) |
| `func_00303920` | 8 | 3 | 1 | 0 | 2 | 1 | 1 | `func_00303928` (+0x8) |
| `func_00303BF0` | 8 | 3 | 1 | 0 | 2 | 1 | 1 | `func_00303BF8` (+0x8) |
| `func_00100B74` | 10 | 4 | 1 | 0 | 3 | 1 | 1 | `func_00100B7E` (+0xa) |
| `func_00102DD8` | 10 | 4 | 1 | 0 | 2 | 1 | 1 | `func_00102DE2` (+0xa) |
| `func_00304CA6` | 10 | 4 | 1 | 0 | 2 | 1 | 1 | `func_00304CB0` (+0xa) |
| `func_0030551C` | 10 | 4 | 1 | 0 | 2 | 1 | 1 | `func_00305526` (+0xa) |
| `func_00103174` | 12 | 5 | 1 | 0 | 2 | 1 | 1 | `func_00103180` (+0xc) |
| `func_00103758` | 12 | 5 | 1 | 0 | 2 | 1 | 1 | `func_00103764` (+0xc) |
| `func_00103E24` | 12 | 4 | 2 | 0 | 2 | 1 | 2 | `func_00103E30` (+0xc) |
| `func_00103E30` | 12 | 4 | 2 | 0 | 2 | 1 | 2 | `func_00103E3C` (+0xc) |
| `func_0010405C` | 12 | 4 | 2 | 0 | 2 | 1 | 2 | `func_00104068` (+0xc) |
| `func_00104068` | 12 | 4 | 2 | 0 | 2 | 1 | 2 | `func_00104080` (+0x18) |
| `func_002FED84` | 12 | 5 | 1 | 0 | 2 | 1 | 1 | `func_002FED9A` (+0x16) |
| `func_002FF86C` | 12 | 5 | 1 | 0 | 2 | 1 | 1 | `func_002FF878` (+0xc) |
| `func_002FFAF4` | 12 | 5 | 1 | 0 | 2 | 1 | 1 | `func_002FFB00` (+0xc) |
| `func_003009F4` | 12 | 4 | 2 | 0 | 2 | 1 | 2 | `func_00300A00` (+0xc) |
| `func_00303914` | 12 | 5 | 1 | 0 | 2 | 1 | 1 | `func_00303920` (+0xc) |
| `func_00303928` | 12 | 5 | 1 | 0 | 2 | 1 | 1 | `func_00303934` (+0xc) |
| `func_00303BE4` | 12 | 5 | 1 | 0 | 2 | 1 | 1 | `func_00303BF0` (+0xc) |
| `func_00303BF8` | 12 | 5 | 1 | 0 | 2 | 1 | 1 | `func_00303C04` (+0xc) |

Totals: 256 body bytes, zero adjacent bytes, 99 instructions, 29 wide instructions, 0 local branches, 49 memory operations, 24 return sites, no indirect calls or tails, and 29 direct calls.

## Direct calls and relocation contract

Offsets are hexadecimal byte offsets from the function entry. Every site is a 32-bit Thumb call and carries exactly one `R_ARM_THM_CALL` relocation to the recorded symbol. Mnemonic is normative because it records the target state.

| Function | Offset | Mnemonic | Symbol | Target mode | Relocation |
| --- | ---: | --- | --- | --- | --- |
| `func_00101CC8` | +0x2 | `blx` | `func_002FF8C0` | arm | `R_ARM_THM_CALL` |
| `func_001029F6` | +0x2 | `bl` | `func_00102F30` | thumb | `R_ARM_THM_CALL` |
| `func_001029FE` | +0x2 | `bl` | `func_00102FAC` | thumb | `R_ARM_THM_CALL` |
| `func_002FF094` | +0x2 | `bl` | `func_002FFD20` | thumb | `R_ARM_THM_CALL` |
| `func_00303920` | +0x2 | `bl` | `func_00304408` | thumb | `R_ARM_THM_CALL` |
| `func_00303BF0` | +0x2 | `bl` | `func_00304408` | thumb | `R_ARM_THM_CALL` |
| `func_00100B74` | +0x2 | `blx` | `func_002FED78` | arm | `R_ARM_THM_CALL` |
| `func_00102DD8` | +0x4 | `blx` | `func_00300980` | arm | `R_ARM_THM_CALL` |
| `func_00304CA6` | +0x4 | `bl` | `func_00302C50` | thumb | `R_ARM_THM_CALL` |
| `func_0030551C` | +0x4 | `bl` | `func_00302C50` | thumb | `R_ARM_THM_CALL` |
| `func_00103174` | +0x6 | `blx` | `func_00302328` | arm | `R_ARM_THM_CALL` |
| `func_00103758` | +0x4 | `bl` | `func_002FF86C` | thumb | `R_ARM_THM_CALL` |
| `func_00103E24` | +0x2 | `bl` | `func_00303914` | thumb | `R_ARM_THM_CALL` |
| `func_00103E24` | +0x6 | `blx` | `func_002FF8C0` | arm | `R_ARM_THM_CALL` |
| `func_00103E30` | +0x2 | `bl` | `func_00303928` | thumb | `R_ARM_THM_CALL` |
| `func_00103E30` | +0x6 | `blx` | `func_002FF8C0` | arm | `R_ARM_THM_CALL` |
| `func_0010405C` | +0x2 | `bl` | `func_00303BE4` | thumb | `R_ARM_THM_CALL` |
| `func_0010405C` | +0x6 | `blx` | `func_002FF8C0` | arm | `R_ARM_THM_CALL` |
| `func_00104068` | +0x2 | `bl` | `func_00303BF8` | thumb | `R_ARM_THM_CALL` |
| `func_00104068` | +0x6 | `blx` | `func_002FF8C0` | arm | `R_ARM_THM_CALL` |
| `func_002FED84` | +0x2 | `bl` | `func_0010068E` | thumb | `R_ARM_THM_CALL` |
| `func_002FF86C` | +0x4 | `bl` | `func_00300A00` | thumb | `R_ARM_THM_CALL` |
| `func_002FFAF4` | +0x4 | `blx` | `func_00300B28` | arm | `R_ARM_THM_CALL` |
| `func_003009F4` | +0x2 | `bl` | `func_001001FC` | thumb | `R_ARM_THM_CALL` |
| `func_003009F4` | +0x6 | `blx` | `func_002FF10C` | arm | `R_ARM_THM_CALL` |
| `func_00303914` | +0x4 | `bl` | `func_00303920` | thumb | `R_ARM_THM_CALL` |
| `func_00303928` | +0x4 | `bl` | `func_00303920` | thumb | `R_ARM_THM_CALL` |
| `func_00303BE4` | +0x4 | `bl` | `func_00303BF0` | thumb | `R_ARM_THM_CALL` |
| `func_00303BF8` | +0x4 | `bl` | `func_00303BF0` | thumb | `R_ARM_THM_CALL` |

There are no other relocations. Every target is an exact global entry rather than a secondary or interior entry. Repeated destinations are intentional and remain distinct relocation sites.

## PC-relative semantics and ownership

The batch contains no PC-relative data access. Its ownership/residue inventory is therefore empty: no entry-modulo-four placement constraint exists beyond the required two-byte section alignment, and no literal pool, addressed post-body word, string, identity mapping, or target-object generator data entry is owned by this batch.

## Canonical schedules and hashes

The configuration is the complete neutral implementation handoff. Split each function's `schedule` on `|`. Determine byte offsets cumulatively: entries at `wideInstructionOffsets` are four bytes and all other entries are two. A local transfer uses `local:+target`, with a lowercase hexadecimal target and no `0x` prefix. The control arrays redundantly record every branch, return, indirect call, indirect tail, and direct call.

Canonical instruction records are `function:hexOffset:mnemonic:operands`. Records are joined by LF with no terminal newline.

- Full mnemonic/operand schedule: `97ccea5a7a84d4bc96272fa2a27ce93f152ed08358bcc15a2d47d425c2f9c92d`
- Local-transfer schedule: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Return schedule: `c6a80e70963908bacce0913d85ca0d743fecdd5767deb9b826ab64a578ae1f20`
- Indirect-call schedule: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Indirect-tail schedule: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Direct-call schedule: `b4c7ede9b9ddfe74c11891a5824d835018c99d95ec24bc1de8eb040da483ddcc`

Instruction selection, flags behavior, operand order, call state transition, branch width, order, mode, entry placement, and body boundary are normative. Equivalent uniquely scoped local-label names are permitted.

GNU Arm assembly can silently canonicalize a three-operand same-register `adds` or `subs` immediate into the byte-distinct two-operand form. Every explicit three-operand immediate entry requires the Thumb16 immediate-three-bit form; every two-operand immediate entry requires the Thumb16 immediate-eight-bit form. When the assembler cannot preserve that architectural distinction, use a Thumb instruction-emission directive such as `.inst.n`; a data-emission directive is not equivalent because it introduces `$d` mapping symbols inside an executable body. Every complete body in this batch must remain covered by Thumb code mapping (`$t`) with no interior `$d` interval. Section alignment must remain two bytes; raising it to four can introduce isolated-section padding.

## Unmatched, ownership, and collision audit

All twenty-four selected report entries were unmatched at zero percent when selected. Names are pairwise distinct and body intervals are pairwise disjoint. No selected name is a function member, alias, identity member, or secondary entry already owned by a public configuration. Earlier public appearances are only external call targets or next-global boundaries and therefore do not claim a selected body.

Exact whole-body comparison against all 10,440 target functions found two closed duplicate classes: `func_00303914` with `func_00303BE4`, and `func_00303928` with `func_00303BF8`. All four members are selected. Every other selected body is a singleton, and there is no selected-to-unselected whole-body collision.

## Independent validation and completeness contract

The analysis independently recomputed every body boundary, instruction width, call destination and target state, return, memory count, ownership exclusion, collision class, aggregate, and canonical hash. The call set consists of nineteen Thumb `bl` sites and ten ARM-state `blx` sites, all resolvable to exact neutral global symbols.

The implementation must define exactly these twenty-four global Thumb functions in individual `.text.<name>` sections. Each section stops at its recorded body size and contains the exact ordered schedule and call relocations. Sections require two-byte alignment and must not acquire isolated-section padding.

The implementation must emit no trailing alignment byte, pool word, addressed post-body material, string, asset, unexpected external reference, extra relocation, direct external jump, or adjacent data. Post-body PC targets are outside batch ownership and must not be copied into source or any target-object identity mapping. Validation must reject an interior `$d` mapping symbol in any selected executable body, even when the underlying bytes happen to match, because objdiff treats those bytes as data rather than Thumb instructions.

The validator must bound source/config reads to 64 MiB, object reads and total executable payload to 16 MiB, section count to 16,384, and symbol/relocation counts independently to 1,000,000. It must accept both isolated and large foreign composites, reject extra executable ownership or selected-name collisions, verify exact per-section alignment and continuous Thumb mapping, confirm the PC-relative inventory remains empty, and enforce both complete duplicate-body classes.
