# Probe-verified Thumb leaf/helper batch 08

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched
Thumb-state functions totaling 422 executable bytes and 181 instructions for
revision `AS_EUR_REV2`. Evidence was limited to the current unmatched objdiff
report, the neutral symbol inventory, recursive public configuration ownership
metadata, bounded private-target control/data-flow inspection, and an
independent assembly round trip of the neutral schedules. No implementation
source was read while preparing this batch.

The selection takes the next compact eligible helpers after batch 07 while
excluding direct jump veneers, calls to unnamed interior entries, and bodies
that would require ownership of post-body literal material. Every body is
10--24 bytes, has at most two direct calls, and contains no owned literal word
or other embedded data. The batch has 30 32-bit instructions, all direct
calls, and 151 16-bit instructions. It contains 8 local branches, 70 memory
operations, 24 return sites, no register-indirect calls or tails, 30 direct
calls, and no direct external jump, owned adjacent data, private string, or
asset.

The configuration leaves `sourceSha256` null because no implementation source
exists in the analyst's clean-room role. The isolated implementer must replace
it with the SHA-256 of the completed source before integration or validation.

## Structural and boundary inventory

Return and call sites are excluded from the local-branch count. Memory counts
include loads, stores, stack operations, and multiple loads/stores. A
next-global offset larger than the body size identifies material outside this
batch; none of that material is owned here.

| Function | Bytes | Instructions | Wide | Local branches | Memory ops | Returns | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00102DE2` | 10 | 4 | 1 | 0 | 2 | 1 | 1 | `func_00102DEC` (+0xa) |
| `func_00100B7E` | 12 | 5 | 1 | 0 | 3 | 1 | 1 | `func_00100B8C` (+0xe) |
| `func_00301026` | 12 | 5 | 1 | 0 | 2 | 1 | 1 | `func_00301034` (+0xe) |
| `func_003021BE` | 12 | 5 | 1 | 1 | 2 | 1 | 1 | `func_003021CC` (+0xe) |
| `func_00304DA8` | 12 | 5 | 1 | 0 | 2 | 1 | 1 | `func_00304DB4` (+0xc) |
| `func_00305510` | 12 | 5 | 1 | 0 | 2 | 1 | 1 | `func_0030551C` (+0xc) |
| `func_00102046` | 14 | 6 | 1 | 0 | 3 | 1 | 1 | `func_00102384` (+0x33e) |
| `func_001047CC` | 14 | 6 | 1 | 0 | 2 | 1 | 1 | `func_001047E6` (+0x1a) |
| `func_001047E6` | 14 | 6 | 1 | 0 | 2 | 1 | 1 | `func_001048A0` (+0xba) |
| `func_0030559A` | 14 | 6 | 1 | 0 | 2 | 1 | 1 | `func_003055A8` (+0xe) |
| `func_001000EC` | 18 | 8 | 1 | 1 | 3 | 1 | 1 | `func_00100134` (+0x48) |
| `func_001001FC` | 18 | 8 | 1 | 1 | 3 | 1 | 1 | `func_00100218` (+0x1c) |
| `func_00304754` | 18 | 8 | 1 | 0 | 4 | 1 | 1 | `func_00304766` (+0x12) |
| `func_0030099C` | 20 | 9 | 1 | 0 | 3 | 1 | 1 | `func_003009B0` (+0x14) |
| `func_00304960` | 20 | 9 | 1 | 0 | 3 | 1 | 1 | `func_00304974` (+0x14) |
| `func_003054CA` | 20 | 9 | 1 | 0 | 3 | 1 | 1 | `func_003054DE` (+0x14) |
| `func_00100C24` | 22 | 9 | 2 | 2 | 3 | 1 | 2 | `func_00100C5C` (+0x38) |
| `func_00100C5C` | 22 | 9 | 2 | 2 | 3 | 1 | 2 | `func_00100CD0` (+0x74) |
| `func_00302F3C` | 22 | 10 | 1 | 0 | 5 | 1 | 1 | `func_00302F52` (+0x16) |
| `func_00304550` | 22 | 9 | 2 | 0 | 3 | 1 | 2 | `func_00304568` (+0x18) |
| `func_0030457C` | 22 | 9 | 2 | 0 | 3 | 1 | 2 | `func_00304594` (+0x18) |
| `func_00100AA0` | 24 | 10 | 2 | 0 | 3 | 1 | 2 | `func_00100AD4` (+0x34) |
| `func_00300A48` | 24 | 11 | 1 | 0 | 6 | 1 | 1 | `func_00300ABC` (+0x74) |
| `func_003034A8` | 24 | 10 | 2 | 1 | 3 | 1 | 2 | `func_003034C0` (+0x18) |

Totals: 422 body bytes, zero adjacent bytes, 181 instructions, 30 wide
instructions, 8 local branches, 70 memory operations, 24 return sites, no
indirect calls or tails, and 30 direct calls. Six local branches are
conditional and two are unconditional. Twenty-three returns restore `pc`
from the stack; `func_00302F3C` restores its saved return address into `r3`
and returns with `bx r3`.

## Direct calls and relocation contract

Offsets are hexadecimal byte offsets from the function entry. Every site is a
32-bit Thumb call and carries exactly one `R_ARM_THM_CALL` relocation to the
recorded symbol. Mnemonic is normative because it records the target state.

| Function | Offset | Mnemonic | Symbol | Target mode | Relocation |
| --- | ---: | --- | --- | --- | --- |
| `func_00102DE2` | +0x4 | `blx` | `func_001A3958` | arm | `R_ARM_THM_CALL` |
| `func_00100B7E` | +0x4 | `blx` | `func_002FED78` | arm | `R_ARM_THM_CALL` |
| `func_00301026` | +0x4 | `blx` | `func_00301034` | arm | `R_ARM_THM_CALL` |
| `func_003021BE` | +0x6 | `bl` | `func_003021A4` | thumb | `R_ARM_THM_CALL` |
| `func_00304DA8` | +0x2 | `bl` | `func_00304774` | thumb | `R_ARM_THM_CALL` |
| `func_00305510` | +0x4 | `bl` | `func_00102DE2` | thumb | `R_ARM_THM_CALL` |
| `func_00102046` | +0x6 | `blx` | `func_002FF10C` | arm | `R_ARM_THM_CALL` |
| `func_001047CC` | +0x6 | `bl` | `func_002FF86C` | thumb | `R_ARM_THM_CALL` |
| `func_001047E6` | +0x6 | `bl` | `func_00103764` | thumb | `R_ARM_THM_CALL` |
| `func_0030559A` | +0x6 | `blx` | `func_00300B28` | arm | `R_ARM_THM_CALL` |
| `func_001000EC` | +0x4 | `blx` | `func_002FECF8` | arm | `R_ARM_THM_CALL` |
| `func_001001FC` | +0xc | `bl` | `func_00100294` | thumb | `R_ARM_THM_CALL` |
| `func_00304754` | +0xa | `bl` | `func_00303188` | thumb | `R_ARM_THM_CALL` |
| `func_0030099C` | +0xe | `bl` | `func_001024D4` | thumb | `R_ARM_THM_CALL` |
| `func_00304960` | +0xe | `bl` | `func_00303934` | thumb | `R_ARM_THM_CALL` |
| `func_003054CA` | +0xe | `bl` | `func_00303944` | thumb | `R_ARM_THM_CALL` |
| `func_00100C24` | +0x8 | `bl` | `func_001005A8` | thumb | `R_ARM_THM_CALL` |
| `func_00100C24` | +0xe | `bl` | `func_0010133C` | thumb | `R_ARM_THM_CALL` |
| `func_00100C5C` | +0x8 | `bl` | `func_00100638` | thumb | `R_ARM_THM_CALL` |
| `func_00100C5C` | +0xe | `bl` | `func_001013A0` | thumb | `R_ARM_THM_CALL` |
| `func_00302F3C` | +0xa | `bl` | `func_00103180` | thumb | `R_ARM_THM_CALL` |
| `func_00304550` | +0x6 | `bl` | `func_002FFD20` | thumb | `R_ARM_THM_CALL` |
| `func_00304550` | +0xe | `bl` | `func_00304568` | thumb | `R_ARM_THM_CALL` |
| `func_0030457C` | +0x6 | `bl` | `func_002FFD20` | thumb | `R_ARM_THM_CALL` |
| `func_0030457C` | +0xe | `bl` | `func_00304594` | thumb | `R_ARM_THM_CALL` |
| `func_00100AA0` | +0x8 | `bl` | `func_002FF972` | thumb | `R_ARM_THM_CALL` |
| `func_00100AA0` | +0x12 | `bl` | `func_00100A5C` | thumb | `R_ARM_THM_CALL` |
| `func_00300A48` | +0x10 | `bl` | `func_00102590` | thumb | `R_ARM_THM_CALL` |
| `func_003034A8` | +0x4 | `bl` | `func_003034C0` | thumb | `R_ARM_THM_CALL` |
| `func_003034A8` | +0xc | `bl` | `func_0010420C` | thumb | `R_ARM_THM_CALL` |

There are no other relocations. All thirty targets are exact global entries,
not secondary or interior entries. The call set consists of twenty-four Thumb
`bl` sites and six ARM-state `blx` sites. Repeated destinations are
intentional and remain distinct relocation sites.

## Local control flow

The eight local transfers are completely represented in each function's
`localTransfers` array. `func_003021BE`, `func_001000EC`, `func_001001FC`, and
`func_003034A8` each contain one conditional forward branch.
`func_00100C24` and `func_00100C5C` each contain a conditional branch around
one call and an unconditional branch around the alternate call. Every transfer
is the recorded 16-bit `.n` encoding; call and return transfers are not counted
as local branches.

## PC-relative semantics and ownership

The batch contains no PC-relative data access. Its ownership/residue inventory
is therefore empty: no entry-modulo-four placement constraint exists beyond
the required two-byte section alignment, and no literal pool, addressed
post-body word, string, identity mapping, or target-object generator data entry
is owned by this batch.

## Canonical schedules and hashes

The configuration is the complete neutral implementation handoff. Split each
function's `schedule` on `|`. Determine byte offsets cumulatively: entries at
`wideInstructionOffsets` are four bytes and all other entries are two. A local
transfer uses `local:+target`, with a lowercase hexadecimal target and no `0x`
prefix. The control arrays redundantly record every branch, return, indirect
call, indirect tail, and direct call.

Canonical instruction records are
`function:hexOffset:mnemonic:operands`. Records are joined by LF with no
terminal newline.

- Full mnemonic/operand schedule: `d8ce556cde91d6a51968266435592f30ac566f468f7d746562ef9062b92b93a6`
- Local-transfer schedule: `8365653f126ee48a7eece5c84120a67d841bd9b34a32fda3779292d991b69d6f`
- Return schedule: `9443de99b5c68ad974a8408fab4a7285adf2683dcc10dda74b45fe7f5d5b984d`
- Indirect-call schedule: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Indirect-tail schedule: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Direct-call schedule: `782213ce7d36883470678f849047a3d07cce6652afc9fe4caf61b23836a096a6`

Instruction selection, flags behavior, operand order, call state transition,
branch width, order, mode, entry placement, and body boundary are normative.
Equivalent uniquely scoped local-label names are permitted.

GNU Arm assembly can silently canonicalize a three-operand `adds` or `subs`
immediate into a byte-distinct two-operand form. Every explicit three-operand
immediate entry requires the Thumb16 immediate-three-bit form; every
two-operand immediate entry requires the Thumb16 immediate-eight-bit form.
When the assembler cannot preserve an architectural distinction, use a Thumb
instruction-emission directive such as `.inst.n`; a data-emission directive is
not equivalent because it introduces `$d` mapping symbols inside an executable
body. Every complete body must remain covered by Thumb code mapping (`$t`)
with no interior `$d` interval. Section alignment must remain two bytes;
raising it to four can introduce isolated-section padding.

## Unmatched, ownership, and collision audit

All twenty-four selected report entries were unmatched at zero percent when
selected. Their report sizes sum to 422 bytes. Names are pairwise distinct and
body intervals are pairwise disjoint. No selected name is a function member,
alias, identity member, or secondary entry already owned by a public
configuration. Earlier public appearances are only external call targets or
next-global boundaries and therefore do not claim a selected body.

Exact whole-body comparison against all 10,440 target functions found all
twenty-four selected bodies to be singletons. There is no selected-to-selected
or selected-to-unselected whole-body collision, so `duplicateBodyClasses` is
empty and already closed.

## Independent validation and completeness contract

The analysis independently recomputed every body boundary, instruction width,
call destination and target state, local branch target, return, memory count,
ownership exclusion, collision class, aggregate, and canonical hash. A fresh
GNU Arm assembly of the neutral schedules reproduced every non-call byte in all
twenty-four bodies, emitted exactly thirty `R_ARM_THM_CALL` relocations, and
kept every body under continuous `$t` mapping. Symbolic call sites were checked
by decoded destination, mnemonic, relocation kind, and target mode rather than
by retaining ROM call encodings.

The implementation must define exactly these twenty-four global Thumb
functions in individual `.text.<name>` sections. Each section stops at its
recorded body size and contains the exact ordered schedule, local transfers,
and call relocations. Sections require two-byte alignment and must not acquire
isolated-section padding.

The implementation must emit no trailing alignment byte, pool word, addressed
post-body material, string, asset, unexpected external reference, extra
relocation, direct external jump, or adjacent data. Post-body material remains
outside batch ownership and must not be copied into source or a target-object
identity mapping. Validation must reject an interior `$d` mapping symbol in
any selected executable body, even when underlying bytes happen to match,
because objdiff treats those bytes as data rather than Thumb instructions.

The validator must bound source/config reads to 64 MiB, object reads and total
executable payload to 16 MiB, section count to 16,384, and symbol/relocation
counts independently to 1,000,000. It must accept both isolated and large
foreign composites, reject extra executable ownership or selected-name
collisions, verify exact per-section alignment and continuous Thumb mapping,
confirm the PC-relative inventory remains empty, enforce the empty duplicate
class inventory, and require `sourceSha256` to be a lowercase 64-digit SHA-256
before source validation can pass.
