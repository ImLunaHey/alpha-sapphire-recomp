# Probe-verified Thumb leaf/helper batch 06

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched Thumb-state functions totaling 698 executable bytes and 310 instructions for revision `AS_EUR_REV2`. Evidence was limited to the current unmatched objdiff report, the neutral symbol inventory, recursive public configuration ownership metadata, bounded private-target control/data-flow inspection, and an independent assembly round trip of the neutral schedules. No implementation source was read while preparing this batch.

The selection takes the next compact eligible helpers after batch 05. Every body is 26--34 bytes, has at most three direct calls, and contains no owned literal word or other embedded data. The batch has 39 32-bit instructions, all direct calls, and 271 16-bit instructions. It contains 16 local branches, 116 memory operations, 34 return sites, no register-indirect calls or tails, 39 direct calls, and no direct external jump, owned adjacent data, private string, or asset.

The authored source is pinned by SHA-256 `fd315ca23ceb6c1f7dfbd3dd096abc431ad5f1a56aaf3e8541fb1583378abe61` in the batch configuration.

## Structural and boundary inventory

Return and call sites are excluded from the local-branch count. Memory counts include loads, stores, stack operations, and multiple loads/stores. A next-global offset larger than the body size identifies material outside this batch; none of that material is owned here.

| Function | Bytes | Instructions | Wide | Local branches | Memory ops | Returns | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_002FED9A` | 32 | 15 | 1 | 0 | 8 | 1 | 1 | `func_002FEDC0` (+0x26) |
| `func_002FFBAE` | 32 | 15 | 1 | 0 | 8 | 1 | 1 | `func_002FFBD4` (+0x26) |
| `func_00103180` | 34 | 15 | 2 | 1 | 4 | 2 | 2 | `func_001031A8` (+0x28) |
| `func_00100078` | 30 | 14 | 1 | 1 | 2 | 1 | 1 | `func_00100096` (+0x1e) |
| `func_0010275C` | 30 | 14 | 1 | 2 | 5 | 2 | 1 | `func_0010277C` (+0x20) |
| `func_00103AC0` | 30 | 13 | 2 | 1 | 5 | 2 | 2 | `func_00103ADE` (+0x1e) |
| `func_002FF878` | 30 | 14 | 1 | 1 | 8 | 1 | 1 | `func_002FF89C` (+0x24) |
| `func_002FFA44` | 30 | 14 | 1 | 0 | 8 | 1 | 1 | `func_002FFA6C` (+0x28) |
| `func_00302F98` | 30 | 14 | 1 | 1 | 6 | 2 | 1 | `func_00302FB6` (+0x1e) |
| `func_0030361C` | 30 | 14 | 1 | 1 | 8 | 1 | 1 | `func_00303640` (+0x24) |
| `func_003048D0` | 30 | 14 | 1 | 1 | 4 | 2 | 1 | `func_003048EE` (+0x1e) |
| `func_00304D60` | 30 | 13 | 2 | 2 | 4 | 2 | 2 | `func_00304D7E` (+0x1e) |
| `func_00304DD0` | 30 | 14 | 1 | 1 | 5 | 2 | 1 | `func_00304DEE` (+0x1e) |
| `func_00304E3C` | 30 | 13 | 2 | 0 | 5 | 1 | 2 | `func_00304E9C` (+0x60) |
| `func_003055F0` | 30 | 14 | 1 | 1 | 5 | 2 | 1 | `func_0030560E` (+0x1e) |
| `func_00103764` | 28 | 11 | 3 | 0 | 2 | 1 | 3 | `func_00103780` (+0x1c) |
| `func_003048EE` | 28 | 12 | 2 | 1 | 5 | 2 | 2 | `func_0030490A` (+0x1c) |
| `func_00304C70` | 28 | 11 | 3 | 0 | 2 | 1 | 3 | `func_00304C8C` (+0x1c) |
| `func_001028F4` | 26 | 11 | 2 | 0 | 4 | 1 | 2 | `func_00102910` (+0x1c) |
| `func_001040CC` | 26 | 11 | 2 | 0 | 3 | 1 | 2 | `func_0010420C` (+0x140) |
| `func_002FFE30` | 26 | 10 | 3 | 0 | 3 | 1 | 3 | `func_002FFE4A` (+0x1a) |
| `func_003021A4` | 26 | 12 | 1 | 1 | 5 | 2 | 1 | `func_003021BE` (+0x1a) |
| `func_00302FEE` | 26 | 11 | 2 | 1 | 5 | 1 | 2 | `func_00303008` (+0x1a) |
| `func_00304C8C` | 26 | 11 | 2 | 0 | 2 | 1 | 2 | `func_00304CA6` (+0x1a) |

Totals: 698 body bytes, zero adjacent bytes, 310 instructions, 39 wide instructions, 16 local branches, 116 memory operations, 34 return sites, no indirect calls or tails, and 39 direct calls.

## Direct calls and relocation contract

Offsets are hexadecimal byte offsets from the function entry. Every site is a 32-bit Thumb call and carries exactly one `R_ARM_THM_CALL` relocation to the recorded symbol. Mnemonic is normative because it records the target state.

| Function | Offset | Mnemonic | Symbol | Target mode | Relocation |
| --- | ---: | --- | --- | --- | --- |
| `func_002FED9A` | +0x18 | `bl` | `func_002FEE54` | thumb | `R_ARM_THM_CALL` |
| `func_002FFBAE` | +0x18 | `bl` | `func_002FEE54` | thumb | `R_ARM_THM_CALL` |
| `func_00103180` | +0x8 | `bl` | `func_002FFBAE` | thumb | `R_ARM_THM_CALL` |
| `func_00103180` | +0x10 | `bl` | `func_0030232C` | thumb | `R_ARM_THM_CALL` |
| `func_00100078` | +0x18 | `bl` | `func_002FEC7C` | thumb | `R_ARM_THM_CALL` |
| `func_0010275C` | +0x4 | `blx` | `func_002FEDF0` | arm | `R_ARM_THM_CALL` |
| `func_00103AC0` | +0x4 | `bl` | `func_00303110` | thumb | `R_ARM_THM_CALL` |
| `func_00103AC0` | +0x18 | `bl` | `func_003031BC` | thumb | `R_ARM_THM_CALL` |
| `func_002FF878` | +0xc | `bl` | `func_002FFA6C` | thumb | `R_ARM_THM_CALL` |
| `func_002FFA44` | +0x18 | `bl` | `func_00101934` | thumb | `R_ARM_THM_CALL` |
| `func_00302F98` | +0x2 | `blx` | `func_002FEDF0` | arm | `R_ARM_THM_CALL` |
| `func_0030361C` | +0xe | `bl` | `func_002FFA6C` | thumb | `R_ARM_THM_CALL` |
| `func_003048D0` | +0xe | `bl` | `func_001034A0` | thumb | `R_ARM_THM_CALL` |
| `func_00304D60` | +0x4 | `bl` | `func_00302C50` | thumb | `R_ARM_THM_CALL` |
| `func_00304D60` | +0xe | `bl` | `func_00301F68` | thumb | `R_ARM_THM_CALL` |
| `func_00304DD0` | +0xe | `bl` | `func_00303934` | thumb | `R_ARM_THM_CALL` |
| `func_00304E3C` | +0x8 | `bl` | `func_00304766` | thumb | `R_ARM_THM_CALL` |
| `func_00304E3C` | +0x18 | `bl` | `func_00304766` | thumb | `R_ARM_THM_CALL` |
| `func_003055F0` | +0xe | `bl` | `func_00303944` | thumb | `R_ARM_THM_CALL` |
| `func_00103764` | +0x6 | `bl` | `func_002FF86C` | thumb | `R_ARM_THM_CALL` |
| `func_00103764` | +0x10 | `bl` | `func_002FF86C` | thumb | `R_ARM_THM_CALL` |
| `func_00103764` | +0x16 | `bl` | `func_00103758` | thumb | `R_ARM_THM_CALL` |
| `func_003048EE` | +0x6 | `bl` | `func_00301E0C` | thumb | `R_ARM_THM_CALL` |
| `func_003048EE` | +0x16 | `bl` | `func_0030227C` | thumb | `R_ARM_THM_CALL` |
| `func_00304C70` | +0x8 | `bl` | `func_00304766` | thumb | `R_ARM_THM_CALL` |
| `func_00304C70` | +0xe | `bl` | `func_00105FEA` | thumb | `R_ARM_THM_CALL` |
| `func_00304C70` | +0x16 | `bl` | `func_00304766` | thumb | `R_ARM_THM_CALL` |
| `func_001028F4` | +0x4 | `blx` | `func_002FED78` | arm | `R_ARM_THM_CALL` |
| `func_001028F4` | +0x12 | `bl` | `func_00102910` | thumb | `R_ARM_THM_CALL` |
| `func_001040CC` | +0xa | `bl` | `func_003031BC` | thumb | `R_ARM_THM_CALL` |
| `func_001040CC` | +0x12 | `bl` | `func_00303C04` | thumb | `R_ARM_THM_CALL` |
| `func_002FFE30` | +0x6 | `blx` | `func_002FF10C` | arm | `R_ARM_THM_CALL` |
| `func_002FFE30` | +0xe | `bl` | `func_00102046` | thumb | `R_ARM_THM_CALL` |
| `func_002FFE30` | +0x14 | `bl` | `func_002FF89C` | thumb | `R_ARM_THM_CALL` |
| `func_003021A4` | +0x4 | `blx` | `func_002FEDF0` | arm | `R_ARM_THM_CALL` |
| `func_00302FEE` | +0xc | `bl` | `func_00302F28` | thumb | `R_ARM_THM_CALL` |
| `func_00302FEE` | +0x12 | `blx` | `func_002FF10C` | arm | `R_ARM_THM_CALL` |
| `func_00304C8C` | +0xc | `bl` | `func_003048EE` | thumb | `R_ARM_THM_CALL` |
| `func_00304C8C` | +0x14 | `bl` | `func_0030490A` | thumb | `R_ARM_THM_CALL` |

There are no other relocations. Every target is an exact global entry rather than a secondary or interior entry. Repeated destinations are intentional and remain distinct relocation sites.

## PC-relative semantics and ownership

The seven entries below use Thumb's word-aligned PC base. The required entry residue is normative: two functions begin at address 2 modulo 4, while the remaining five accesses occur in functions beginning at address 0 modulo 4. Object sections still require only two-byte alignment; linked placement must preserve each recorded modulo-four invariant. Target offsets are hexadecimal.

| Function | Instruction offset | Form | Target offset | Entry modulo 4 | Crossed function intervals |
| --- | ---: | --- | ---: | ---: | --- |
| `func_002FED9A` | +0xa | `ldr` | +0x22 | 2 | none |
| `func_002FFBAE` | +0xa | `ldr` | +0x22 | 2 | none |
| `func_00103180` | +0x0 | `ldr` | +0x24 | 0 | none |
| `func_002FF878` | +0x4 | `ldr` | +0x20 | 0 | none |
| `func_002FFA44` | +0x8 | `ldr` | +0x20 | 0 | none |
| `func_002FFA44` | +0xe | `ldr` | +0x24 | 0 | none |
| `func_0030361C` | +0x6 | `ldr` | +0x20 | 0 | none |

Every destination is unowned post-body material lying before the recorded next global. No literal pool, addressed word, string, identity mapping, or target-object generator data entry is owned by this batch.

## Canonical schedules and hashes

The configuration is the complete neutral implementation handoff. Split each function's `schedule` on `|`. Determine byte offsets cumulatively: entries at `wideInstructionOffsets` are four bytes and all other entries are two. A local transfer uses `local:+target`, with a lowercase hexadecimal target and no `0x` prefix. The control arrays redundantly record every branch, return, indirect call, indirect tail, and direct call.

Canonical instruction records are `function:hexOffset:mnemonic:operands`. Records are joined by LF with no terminal newline.

- Full mnemonic/operand schedule: `0213e2434b96d7fbeb25b7762b1825c41d2669f302aa26f6d9571a15449e30dc`
- Local-transfer schedule: `9da75eaf1416127a8032e4a3c1d51e79cae22999f73f9cac4c00057e8ce42ce4`
- Return schedule: `a9c7794e88b850dd836c6d98e367cc1d23079d0fcc6c7bd7a7c285bfb99f2c9f`
- Indirect-call schedule: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Indirect-tail schedule: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Direct-call schedule: `2e9dde5a21dd81b8e22f3f2fbc0e4003694cb72ddd86f48e460f85dde6d16a0c`

Instruction selection, flags behavior, operand order, call state transition, branch width, order, mode, entry placement, and body boundary are normative. Equivalent uniquely scoped local-label names are permitted.

GNU Arm assembly can silently canonicalize a three-operand same-register `adds` or `subs` immediate into the byte-distinct two-operand form. Every explicit three-operand immediate entry requires the Thumb16 immediate-three-bit form; every two-operand immediate entry requires the Thumb16 immediate-eight-bit form. When the assembler cannot preserve that architectural distinction, use a Thumb instruction-emission directive such as `.inst.n`; a data-emission directive is not equivalent because it introduces `$d` mapping symbols inside an executable body. Every complete body in this batch must remain covered by Thumb code mapping (`$t`) with no interior `$d` interval. Section alignment must remain two bytes; raising it to four can introduce isolated-section padding.

## Unmatched, ownership, and collision audit

All twenty-four selected report entries were unmatched at zero percent when selected. Names are pairwise distinct and body intervals are pairwise disjoint. No selected name is a function member, alias, identity member, or secondary entry already owned by a public configuration. Earlier public appearances are only external call targets or next-global boundaries and therefore do not claim a selected body.

Exact whole-body comparison against all 10,440 target functions found every selected body to be a singleton class. There is no selected-to-selected or selected-to-unselected whole-body collision, so `duplicateBodyClasses` is empty.

## Independent validation and completeness contract

The analysis independently recomputed every body boundary, instruction width, call destination and target state, local destination, return, memory count, PC-relative destination, ownership exclusion, collision class, aggregate, and canonical hash. The call set consists of thirty-three Thumb `bl` sites and six ARM-state `blx` sites, all resolvable to exact neutral global symbols.

The implementation must define exactly these twenty-four global Thumb functions in individual `.text.<name>` sections. Each section stops at its recorded body size and contains the exact ordered schedule, local destinations, and call relocations. Sections require two-byte alignment; linked placement of PC-relative functions must preserve the recorded entry modulo four without isolated-section padding.

The implementation must emit no trailing alignment byte, pool word, addressed post-body material, string, asset, unexpected external reference, extra relocation, direct external jump, or adjacent data. Post-body PC targets are outside batch ownership and must not be copied into source or any target-object identity mapping. Validation must reject an interior `$d` mapping symbol in any selected executable body, even when the underlying bytes happen to match, because objdiff treats those bytes as data rather than Thumb instructions.

The validator must bound source/config reads to 64 MiB, object reads and total executable payload to 16 MiB, section count to 16,384, and symbol/relocation counts independently to 1,000,000. It must accept both isolated and large foreign composites, reject extra executable ownership or selected-name collisions, verify exact per-section alignment and Thumb mapping, and validate the seven PC-relative targets using each entry's recorded modulo-four residue.
