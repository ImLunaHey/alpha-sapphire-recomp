# Thumb leaf/helper batch 14

## Scope and provenance

This clean-room handoff covers `func_003026AC` for revision `AS_EUR_REV2`. The function remains unmatched in the current report and is not owned by any public configuration. Its 158-byte Thumb body contains 73 instructions. Evidence was limited to the unmatched report, neutral symbol and mapping metadata, recursive public configuration ownership metadata, and bounded private-target control/data-flow inspection. No implementation source was read or authored.

This is the useful exception left deliberately deferred by earlier Thumb batches: one PC-relative address-forming operation reaches an opaque location beyond the function's own global interval. The target contents are not part of this handoff. The configuration records only the architectural identity and placement relationship needed to preserve the operation.

`sourceHash` records the SHA-256 digest of the independently authored public source:
`6e10b61b3acb577fe1a4ea22b38149e606a0b570bb0ce12711d2ec2e4f6955ac`.

## Structural inventory

| Function | Body bytes | Instructions | Wide | Local branches | Memory ops | Returns | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_003026AC` | 158 | 73 | 6 | 17 | 15 | 4 | 6 | `func_0030274A` (+0x9e) |

The body ends exactly at the next global entry. It owns no adjacent bytes, literal pool, string, asset, padding, alias, or secondary entry. The six wide instructions are direct calls; every other instruction is two bytes. There are no indirect calls, indirect tails, external non-call transfers, or legacy no-operations.

Memory counts include the initial stack save, four stack-restoring returns, ordinary loads, and byte stores. Return and call sites are excluded from the local-branch count.

## Direct-call and relocation contract

Six four-byte direct calls occur at offsets +0x14, +0x48, +0x50, +0x58, +0x60, and +0x68. Every call targets the exact ARM-state global entry `func_002FF7EC`, switches instruction state, and carries one `R_ARM_THM_CALL` relocation. The top-level call and relocation inventories redundantly record all six sites. No other relocation is required or permitted.

## Local control flow and returns

The 17 local transfers are completely represented by structured semantic rows. Each row gives its exact two-byte form, condition, and destination offset. All destinations remain inside the 158-byte body. Four stack-restoring returns occur at +0x46, +0x7e, +0x82, and +0x9c.

## Cross-interval PC-relative identity

The address-forming operation at +0x80 uses a word-aligned PC base and identifies target offset +0x198 from the selected entry. Correct interpretation requires the function entry to be zero modulo four. The operation has no relocation.

The opaque target is named `opaque_cross_interval_00302844` solely to preserve identity. It is not a public symbol and conveys no content. Reaching it crosses the global entries `func_0030274A` at +0x9e and `func_003027AE` at +0x102; the next later global is `func_003028B8` at +0x20c. The target lies outside every byte owned by this batch. An implementation must preserve the exact PC-relative relationship without copying, naming, decoding, or emitting the target material.

This cross-interval relationship is the principal caution for integration. An isolated object can validate the instruction form and its relative target arithmetic, but final placement must also preserve the recorded entry modulo four and opaque target identity. The operation must remain executable Thumb code and must not be replaced by a data directive or a relocation-bearing literal load.

## Neutral semantic handoff

The configuration is the complete implementation handoff. Its ordered `semantics` array covers offsets zero through 157 contiguously. Each row records byte offset, width, neutral operation, architectural form, registers, immediates, flag effects, memory width, or transfer identity as applicable. It contains no raw target bytes, opcode values, disassembly transcript, or assembler schedule.

Instruction form is normative where the architecture has distinct encodings with the same apparent arithmetic result. The rows at +0xe, +0x88, +0x8a, and +0x90 use the three-operand immediate-three-bit addition form. The additions and subtraction explicitly marked `twoOperandImmediate8` use that distinct immediate-eight-bit form. Every local branch uses its recorded 16-bit form. Every direct call uses its recorded four-byte form and relocation.

The complete body must remain continuously covered by Thumb code mapping beginning at body offset zero, with no interior data mapping interval. Section input alignment is two bytes, while linked placement must satisfy the separately recorded entry-modulo-four constraint. No trailing alignment, pool, residue, or opaque target material belongs in the function section.

## Ownership and collision audit

The current report records `func_003026AC` as unmatched with size 158. Recursive inspection of public configurations found no ownership of this entry. Exact whole-body comparison across the neutral target function inventory found no identical peer, so `duplicateBodyClasses` is empty.

The selected interval does not overlap another selected body and stops at the next global. References to `func_002FF7EC` are calls only; the cross-interval identity is an unowned address relationship only. Neither expands batch ownership.

## Completeness checks for the implementer

An independent validator should verify all aggregate counts, contiguous row coverage, exact section size, two-byte section alignment, Thumb mapping continuity, the 17 local destinations, four returns, six call relocations, absence of any additional relocation, and the empty legacy-no-operation and duplicate-class inventories. It should separately verify the +0x80 PC-relative arithmetic, required entry modulo four, the two crossed global identities, and the prohibition on owning or emitting the opaque target bytes.

Source validation treats `sourceHash: null` as an unfinished analyst handoff rather than a matching digest. This implementation populates the field with the independently authored source digest; build integration remains a separate change.
