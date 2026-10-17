# Probe-verified Thumb leaf/helper batch 13

## Scope and provenance

This clean-room analysis specification covers the next two safe unmatched Thumb-state functions, `func_0010068E` and `func_00302FB6`, for revision `AS_EUR_REV2`. Their bodies total 168 executable bytes and contain 78 instructions. Evidence was limited to the current unmatched objdiff report, neutral target symbol and mapping metadata, recursive public configuration ownership metadata, bounded private-target control/data-flow inspection, and an independent semantic assembly probe. No implementation source was read or authored while preparing this batch.

These are the remaining size-ordered helpers whose complete control-flow and relocation closure uses only exact global entries and whose bodies own no inline or adjacent material. Other remaining Thumb entries are deliberately excluded: they are external jump veneers, call a secondary or interior entry, contain addressed inline material, or form a PC-relative address across their global interval. The two selected bodies have six 32-bit direct calls and 72 16-bit instructions. They contain 13 local branches, 11 memory operations, three returns, no register-indirect calls or tails, six direct calls, no direct external jump, no PC-relative access, no owned adjacent data, and no legacy `nop`.

`sourceSha256` is populated with the lowercase SHA-256 of the completed public implementation source: `449880432b7f5a54853c37ad0d19fd9bb6bca8a948f390306ffe0abf505bfe59`.

## Structural and boundary inventory

Return and call sites are excluded from the local-branch count. Memory counts include loads, stores, stack operations, and multiple loads/stores.

| Function | Bytes | Instructions | Wide | Local branches | Memory ops | Returns | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_0010068E` | 112 | 55 | 1 | 12 | 5 | 2 | 1 | `func_00100788` (+0xfa) |
| `func_00302FB6` | 56 | 23 | 5 | 1 | 6 | 1 | 5 | `func_00302FEE` (+0x38) |

Totals: 168 body bytes, zero adjacent bytes, 78 instructions, six wide instructions, 13 local branches, 11 memory operations, three return sites, no indirect calls or tails, and six direct calls.

`func_0010068E` ends at +0x70. The 138 bytes from +0x70 through +0xf9 before its next global are unowned residue and are not addressed by the selected body. `func_00302FB6` ends exactly at its next global. Neither function owns a literal, identity word, string, asset, padding byte, or other adjacent material.

## Direct calls and relocation contract

All six direct-call sites are completely and redundantly recorded in the top-level `directCalls`, `relocations`, and per-function `directCalls` arrays.

| Function | Offset | Transfer | Exact target | Target state | State switch | Relocation |
| --- | ---: | --- | --- | --- | --- | --- |
| `func_0010068E` | +0xc | Direct call | `func_002FEDF0` | ARM | Yes | `R_ARM_THM_CALL` |
| `func_00302FB6` | +0xe | Direct call | `func_00302F28` | Thumb | No | `R_ARM_THM_CALL` |
| `func_00302FB6` | +0x18 | Direct call | `func_002FF034` | ARM | Yes | `R_ARM_THM_CALL` |
| `func_00302FB6` | +0x1e | Direct call | `func_002FF094` | Thumb | No | `R_ARM_THM_CALL` |
| `func_00302FB6` | +0x26 | Direct call | `func_002FF09C` | ARM | Yes | `R_ARM_THM_CALL` |
| `func_00302FB6` | +0x30 | Direct call | `func_00302F28` | Thumb | No | `R_ARM_THM_CALL` |

Every site is a four-byte Thumb direct call and must carry exactly one `R_ARM_THM_CALL` relocation to the recorded symbol. Destination state and whether the transfer switches state are normative. Every destination is an exact neutral global entry; no destination is a secondary or interior entry. There are no other required relocations.

## Local control flow and returns

The 13 function-local transfers are completely represented by semantic rows carrying transfer kind, condition, destination offset, and width. Every one uses the recorded two-byte form and exact local target. `func_0010068E` has an early return at +0xa and a final return at +0x6e; its branch at +0x66 intentionally joins the early-return instruction. `func_00302FB6` has one conditional join and one final return. There are no indirect calls, indirect tails, or direct external jumps.

## PC-relative semantics, identities, and ownership

`pcRelativeDataAccesses` is normatively empty. Neither body reads a literal through the PC, forms a PC-relative address, or depends on entry modulo four beyond normal two-byte Thumb alignment. `duplicateBodyClasses` is also empty: neither selected body has an identical whole-body peer among the 10,440 target functions. There are no identity classes, aliases, or secondary entries owned by this batch.

The implementation must not absorb the unowned gap following `func_0010068E`. It must not add a literal pool, alignment byte, identity word, or data mapping interval to either section.

## Canonical semantic rows and hashes

The configuration is the complete neutral implementation handoff. Each function contains an ordered `semantics` array. Every row records its byte offset and width, a neutral operation and architectural form, and structured operands such as register roles, immediate values, flag effects, transfer condition, destination offset, destination symbol, destination state, and state-switch behavior. Offsets must be contiguous and the rows must cover the exact body size.

Canonical instruction records combine the function name, lowercase hexadecimal offset, and the compact JSON serialization of `width`, `operation`, `form`, and `operands`, in that key order. Transfer hashes use the compact JSON serialization of `operands`. Records are joined by LF with no terminal newline.

- Full semantic schedule: `9640a2c1a6259df7fa9e1a9580a8b5dfdebd1eb908121e5f3ebf1fa52d8e81ba`
- Local-transfer schedule: `e6f90ff1fa0d6de9a7a593115a588da6b21ac3d45d80ccde227bbfd9d4abd84c`
- Return schedule: `1e3496e11f1bd642a6c5ae0394afd4fd576a44831c1f41b7ad465a4e90386b2f`
- Indirect-call schedule: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Indirect-tail schedule: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Direct-call schedule: `b2d7dc52a616630386245e066ae4ffa9aef065cdb38dcb161a0aaeb1e4570d1c`

Instruction selection, flags behavior, operand order, call state transition, branch width, order, mode, and body boundary are normative. Equivalent uniquely scoped local-label names are permitted.

The flag-setting addition at `func_00302FB6` +0x1c has destination register 0, left input register 0, and immediate value 1. It requires the two-byte three-operand immediate-three-bit architectural form. The generator and validator derive its encoding from those operand fields so that an assembler cannot canonicalize it to the distinct two-operand immediate-eight-bit form. The flag-setting addition at `func_0010068E` +0x3a instead uses the recorded two-operand immediate-eight-bit form with register 1 and immediate value 1.

## Unmatched, ownership, and collision audit

Both selected report entries were unmatched at zero percent when selected, with reported sizes of 112 and 56 bytes. Their names are distinct and their intervals do not overlap. Recursive inspection of every public configuration found neither name as an owned function member, alias, identity member, or secondary entry. Earlier public appearances are only call targets or next-global annotations and do not claim either body.

Exact whole-body comparison against all 10,440 target functions found both bodies to be singleton classes. There is no selected-to-selected or selected-to-unselected collision, so `duplicateBodyClasses` is empty and already closed.

## Independent validation and completeness contract

The analysis independently recomputed both body boundaries, all instruction widths, exact direct-call destinations and target states, local destinations, returns, memory counts, ownership exclusions, collision classes, aggregates, and canonical hashes directly from bounded target and symbol evidence.

A fresh relocatable object reconstructed from the neutral rows reproduced every non-call byte in both bodies, emitted exactly the six recorded `R_ARM_THM_CALL` relocations, preserved exact section sizes of 112 and 56 bytes with two-byte alignment, and kept each body under continuous Thumb code mapping. The exceptional three-operand addition was derived from its structured operand semantics, as documented above. Calls were independently checked by decoded destination, state-switch behavior, exact global symbol, and target state rather than by retaining target call encodings in the public handoff.

The implementation must define exactly these two global Thumb functions in `.text.func_0010068E` and `.text.func_00302FB6`. Each section stops at its recorded body size and emits no trailing alignment, residue, literal pool, addressed data, string, asset, unexpected external reference, or extra relocation.

The validator must bound source/config reads to 64 MiB, object reads and total executable payload to 16 MiB, section count to 16,384, and symbol and relocation counts independently to 1,000,000. Its `--self-test` must exercise a valid executable foreign composite with at least 12,000 sections. It must accept isolated and large foreign composites, reject extra executable ownership or selected-name collisions, verify exact per-section size and two-byte alignment, require continuous Thumb mapping, enforce the empty PC-relative, legacy-nop, and duplicate-class inventories, verify all 13 local transfers and six relocations, and require a non-sentinel lowercase 64-digit `sourceSha256` before source validation can pass.
