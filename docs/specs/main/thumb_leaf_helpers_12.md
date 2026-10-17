# Probe-verified Thumb leaf/helper batch 12

## Scope and provenance

This clean-room analysis specification covers the next safe unmatched Thumb-state function, `func_00101934`. Its body is 902 executable bytes containing 444 instructions. Evidence was limited to the current unmatched objdiff report, neutral target symbol and mapping metadata, recursive public configuration ownership metadata, bounded private-target control/data-flow inspection, and independent semantic assembly probes. No implementation source was read or authored while preparing this batch.

Batch 11 deliberately stopped before this singleton. The remaining smaller Thumb entries are not silently absorbed here: they include veneers or boundary fragments, calls or transfers involving secondary/interior entries, and a PC-relative address-forming case that crosses its global interval. This function is the next size-ordered safe closure because every non-return branch remains inside its body, every direct call names an exact global entry, and all three PC-relative loads reach post-body residue strictly before the next global.

The body has seven 32-bit direct calls and 437 16-bit instructions. It contains 117 local branches, 101 memory operations, one return site, 21 register-indirect calls, no register-indirect tail, seven direct calls, no direct external jump, no owned adjacent data, and no legacy `nop`. The legacy-nop inventory is therefore explicitly empty and normative; an implementation must not introduce a padding or compatibility `nop` into the body.

The completed implementation has source SHA-256 `221074eff8b2cf0f82baff9aa621189f3eab4578fafc32b09db5911124d3fad5`. Validation must reject the former all-zero handoff sentinel, a malformed digest, or a source mismatch.

## Structural and boundary inventory

Return and call sites are excluded from the local-branch count. Memory counts include loads, stores, stack operations, and multiple loads/stores.

| Function | Bytes | Instructions | Wide | Local branches | Memory ops | Returns | Indirect calls | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00101934` | 902 | 444 | 7 | 117 | 101 | 1 | 21 | 7 | `func_00101CC8` (+0x394) |

The function body ends at +0x386. The fourteen bytes from +0x386 through +0x393 are post-body residue, not adjacent data owned by this batch. The first two residue bytes precede three word-aligned literal destinations at +0x388, +0x38c, and +0x390. None of this residue may be copied into the implementation section or represented as batch-owned target-generator data.

## Direct calls and relocation contract

All seven direct-call sites are completely and redundantly recorded in the top-level `directCalls`, `relocations`, and per-function `directCalls` arrays.

| Offset | Mnemonic | Exact target | Target state | Relocation |
| ---: | --- | --- | --- | --- |
| +0x1b6 | `blx` | `func_00300750` | ARM | `R_ARM_THM_CALL` |
| +0x244 | `bl` | `func_00100CD0` | Thumb | `R_ARM_THM_CALL` |
| +0x254 | `bl` | `func_00100E14` | Thumb | `R_ARM_THM_CALL` |
| +0x2f8 | `bl` | `func_0010123E` | Thumb | `R_ARM_THM_CALL` |
| +0x33a | `bl` | `func_00101040` | Thumb | `R_ARM_THM_CALL` |
| +0x348 | `bl` | `func_00100F5E` | Thumb | `R_ARM_THM_CALL` |
| +0x356 | `bl` | `func_0010115A` | Thumb | `R_ARM_THM_CALL` |

Every site is a 32-bit Thumb call and must carry exactly one `R_ARM_THM_CALL` relocation to the recorded symbol. Mnemonic and target mode are normative. There are no other required relocations and no destination is a secondary or interior entry.

## Local and indirect control flow

The 117 function-local transfers are completely represented in `localTransfers`. Every one uses the recorded 16-bit `.n` encoding and exact local target. The 21 register-indirect calls are completely represented by `indirectCalls`. There is no indirect tail. Call, return, and register-indirect call transfers are not counted as local branches.

The sole return is the `pop` at +0x36e. No earlier error path exits the function directly; all such paths join the recorded local epilogue flow.

## PC-relative semantics and ownership

The three entries below use Thumb's word-aligned PC base. The function entry is address zero modulo four, which is normative for reproducing these encodings. Object sections still require only two-byte alignment; linked placement must preserve the recorded modulo-four invariant without raising isolated-section alignment and introducing padding.

| Function | Instruction offset | Form | Target offset | Entry modulo 4 | Ownership |
| --- | ---: | --- | ---: | ---: | --- |
| `func_00101934` | +0xbc | `ldr` | +0x388 | 0 | unowned-post-body |
| `func_00101934` | +0xc8 | `ldr` | +0x38c | 0 | unowned-post-body |
| `func_00101934` | +0x214 | `ldr` | +0x390 | 0 | unowned-post-body |

Every destination is after the +0x386 body boundary and strictly before `func_00101CC8` at +0x394. No access crosses the next-global boundary. The accessed words remain private residue: their values, identities, and storage are deliberately absent from this handoff. The implementation must retain the exact source-stable Thumb16 PC-relative forms and placement contract without emitting a literal pool, copying the residue, replacing the loads with data directives, or creating an interior `$d` mapping interval.

## Canonical schedules and hashes

The configuration is the complete neutral implementation handoff. Split `schedule` on `|`. Determine byte offsets cumulatively: entries at `wideInstructionOffsets` are four bytes and all other entries are two. A local transfer uses `local:+target`, with a lowercase hexadecimal target and no `0x` prefix. The control arrays redundantly record every branch, return, indirect call, indirect tail, and direct call.

Canonical instruction records are `function:hexOffset:mnemonic:operands`. Records are joined by LF with no terminal newline.

- Full mnemonic/operand schedule: `f1005021444e2546f9a2d0d8263c24ba6ce20811657befae0c97512740d3a391`
- Local-transfer schedule: `ebeff65c61d36a51bbef5ee60bc9e6ef63ee54ddacc63ea61a2e7f905deb37f9`
- Return schedule: `47f857baab06fb68355ef2bafab5ca3aaf06a8b382c8d563154f6813a9c9036f`
- Indirect-call schedule: `a13f7db9477fcf9729ec3ae250881db619fce5ec7b3ab026498be6d102b25f62`
- Indirect-tail schedule: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Direct-call schedule: `1ae95d8b47ba4de8cefffdfefbad3875a9c80ee9f67e3c66f822a4b755987734`

Instruction selection, flags behavior, operand order, call state transition, branch width, order, mode, entry placement, and body boundary are normative. Equivalent uniquely scoped local-label names are permitted.

GNU Arm assembly can silently canonicalize a three-operand `adds` or `subs` immediate into a byte-distinct two-operand form when the destination and first source register coincide. Every explicit three-operand immediate schedule entry requires the Thumb16 immediate-three-bit form; every two-operand immediate entry requires the Thumb16 immediate-eight-bit form. When the assembler cannot preserve this architectural distinction, use a Thumb instruction-emission directive such as `.inst.n`; a data-emission directive is not equivalent because it introduces `$d` mapping symbols inside an executable body. The three PC-relative loads must remain semantic instructions with their exact immediate forms. The empty `legacyNopOffsets` array must remain empty.

## Unmatched, ownership, and collision audit

The selected report entry was unmatched at zero percent when selected, with reported size 902 bytes. Recursive inspection of every public configuration found no ownership of `func_00101934` as a function member, alias, identity member, or secondary entry. Earlier public appearances are only an external call target and a next-global boundary; neither claims this body.

Exact whole-body comparison against all 10,440 target functions found this body to be a singleton class. There is no selected-to-unselected whole-body collision, so `duplicateBodyClasses` is empty and already closed.

## Independent validation and completeness contract

The analysis independently recomputed the body boundary, instruction widths, direct-call destinations and target states, local destinations, return, indirect calls, memory count, PC-relative destinations, ownership exclusions, collision class, aggregates, and canonical hashes directly from bounded target and symbol evidence.

A fresh relocatable GNU Arm assembly of the neutral schedule reproduced every non-call byte, emitted exactly seven `R_ARM_THM_CALL` relocations at the recorded sites, preserved the exact 902-byte section size and two-byte input alignment, and kept the body under continuous `$t` mapping. A separate exact-placement semantic probe laid out all seven exact call destinations at their recorded relative addresses, preserved the function's address-zero-modulo-four placement, disabled the optional ARM1176 BLX erratum veneer, and reproduced all 902 body bytes. This independently verifies both the cross-state `blx` and the six Thumb `bl` calls without retaining call encodings in the public handoff.

The implementation must define exactly this one global Thumb function in `.text.func_00101934`, stop the section at 902 bytes, and emit no trailing alignment byte, literal pool, addressed residue, string, asset, unexpected external reference, extra relocation, direct external jump, or adjacent data. Validation must reject any interior `$d` mapping symbol, including one introduced by a data-emission directive whose underlying bytes happen to match.

The validator must bound source/config reads to 64 MiB, object reads and total executable payload to 16 MiB, section count to 16,384, and symbol and relocation counts independently to 1,000,000. Its `--self-test` must exercise a valid executable foreign composite with at least 12,000 sections. It must accept both isolated and large foreign composites, reject extra executable ownership or selected-name collisions, verify exact per-section size and two-byte alignment, require continuous Thumb mapping, enforce the empty legacy-nop and duplicate-class inventories, confirm all three PC-relative entries and their unowned-residue contract, and require a non-sentinel lowercase 64-digit `sourceSha256` before source validation can pass.
