# Probe-verified Thumb leaf/helper batch 05

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched
Thumb-state functions totaling 1,566 executable bytes and 715
instructions for revision `AS_EUR_REV2`. Evidence was limited to the current
unmatched objdiff report, the neutral symbol inventory, recursive public
configuration ownership metadata, bounded private-target control/data-flow
inspection, and an independent assembly round trip of the neutral schedules.
No implementation source was read while preparing this batch.

The selection maximizes bounded yield among the remaining compact candidates
whose direct destinations are exact global function entries, whose bodies
contain no owned literal word or other embedded data, and which have at most
five direct calls and three immediate-form PC-relative accesses. Every body is
36--92 bytes. The batch has 68 32-bit instructions, all direct calls, and
647 16-bit instructions. It contains 100 local branches, 197
memory operations, 26 return sites, 3 register-indirect calls, 68
direct calls, and no indirect tail, direct external jump, owned adjacent data,
private string, or asset.

`sourceSha256` records the digest of the separately authored implementation
source. The canonical schedule and control hashes below are complete analysis
outputs.

## Structural and boundary inventory

Return and call sites are excluded from the local-branch count. Memory counts
include loads, stores, stack operations, and multiple loads/stores. A
next-global offset larger than the body size identifies material outside this
batch; none of that material is owned here.

| Function | Bytes | Instructions | Wide | Local branches | Memory ops | Returns | Indirect calls | Direct calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00100638` | 86 | 41 | 2 | 8 | 12 | 1 | 1 | 2 | `func_0010068E` (+0x56) |
| `func_00100AD4` | 88 | 43 | 1 | 8 | 8 | 1 | 0 | 1 | `func_00100B6C` (+0x98) |
| `func_0010133C` | 82 | 39 | 2 | 8 | 12 | 1 | 1 | 2 | `func_001013A0` (+0x64) |
| `func_00101CD8` | 76 | 35 | 3 | 3 | 14 | 2 | 0 | 3 | `func_00102008` (+0x330) |
| `func_00103350` | 62 | 28 | 3 | 4 | 3 | 1 | 0 | 3 | `func_0010338E` (+0x3e) |
| `func_001035E4` | 84 | 40 | 2 | 5 | 13 | 2 | 0 | 2 | `func_00103758` (+0x174) |
| `func_00103A84` | 60 | 26 | 4 | 2 | 8 | 1 | 0 | 4 | `func_00103AC0` (+0x3c) |
| `func_001054F4` | 36 | 15 | 3 | 1 | 6 | 1 | 0 | 3 | `func_0010564A` (+0x156) |
| `func_00105DA4` | 36 | 15 | 3 | 1 | 6 | 1 | 0 | 3 | `func_00105DCC` (+0x28) |
| `func_002FEFDC` | 88 | 41 | 3 | 11 | 4 | 1 | 0 | 3 | `func_002FF034` (+0x58) |
| `func_002FF7F8` | 52 | 23 | 3 | 2 | 4 | 1 | 0 | 3 | `func_002FF830` (+0x38) |
| `func_002FF830` | 60 | 27 | 3 | 2 | 8 | 1 | 0 | 3 | `func_002FF86C` (+0x3c) |
| `func_002FFD20` | 36 | 16 | 2 | 4 | 4 | 1 | 1 | 2 | `func_002FFD48` (+0x28) |
| `func_003009B0` | 60 | 27 | 3 | 3 | 10 | 1 | 0 | 3 | `func_003009EC` (+0x3c) |
| `func_00301D30` | 76 | 35 | 3 | 3 | 11 | 1 | 0 | 3 | `func_00301D7C` (+0x4c) |
| `func_00301F68` | 60 | 26 | 4 | 3 | 9 | 1 | 0 | 4 | `func_00301FBC` (+0x54) |
| `func_00302208` | 92 | 44 | 2 | 6 | 12 | 1 | 0 | 2 | `func_00302274` (+0x6c) |
| `func_00303008` | 82 | 39 | 2 | 8 | 10 | 1 | 0 | 2 | `func_0030305C` (+0x54) |
| `func_0030305C` | 88 | 40 | 4 | 4 | 8 | 1 | 0 | 4 | `func_003030BC` (+0x60) |
| `func_003030BC` | 78 | 36 | 3 | 3 | 12 | 1 | 0 | 3 | `func_00303110` (+0x54) |
| `func_003036C0` | 36 | 16 | 2 | 3 | 6 | 1 | 0 | 2 | `func_003036E4` (+0x24) |
| `func_00304408` | 50 | 20 | 5 | 0 | 7 | 1 | 0 | 5 | `func_00304440` (+0x38) |
| `func_00304D24` | 60 | 27 | 3 | 7 | 5 | 1 | 0 | 3 | `func_00304D60` (+0x3c) |
| `func_003053E0` | 38 | 16 | 3 | 1 | 5 | 1 | 0 | 3 | `func_00305406` (+0x26) |

Totals: 1,566 body bytes, zero adjacent bytes, 715 instructions,
68 wide instructions, 100 local branches, 197 memory operations, 26 return
sites, 3 register-indirect calls, 68 direct calls, and zero indirect tails.
The indirect calls are `func_00100638` +0x48 (`blx r2`),
`func_0010133C` +0x44 (`blx r2`), and `func_002FFD20` +0x16
(`blx r0`); all are relocation-free.

## Direct calls and relocation contract

Offsets are hexadecimal byte offsets from the function entry. Every site is a
32-bit Thumb call and carries exactly one `R_ARM_THM_CALL` relocation to the
recorded symbol. Mnemonic is normative because it records the target state.

| Function | Offset | Mnemonic | Symbol | Target mode | Relocation |
| --- | ---: | --- | --- | --- | --- |
| `func_00100638` | +0x3a | `bl` | `func_002FEE04` | thumb | `R_ARM_THM_CALL` |
| `func_00100638` | +0x50 | `bl` | `func_002FEE30` | thumb | `R_ARM_THM_CALL` |
| `func_00100AD4` | +0x4c | `bl` | `func_002FF988` | thumb | `R_ARM_THM_CALL` |
| `func_0010133C` | +0x36 | `bl` | `func_002FEE04` | thumb | `R_ARM_THM_CALL` |
| `func_0010133C` | +0x4c | `bl` | `func_002FEE30` | thumb | `R_ARM_THM_CALL` |
| `func_00101CD8` | +0x8 | `blx` | `func_002FF034` | arm | `R_ARM_THM_CALL` |
| `func_00101CD8` | +0x1e | `bl` | `func_00300A48` | thumb | `R_ARM_THM_CALL` |
| `func_00101CD8` | +0x32 | `bl` | `func_00300A00` | thumb | `R_ARM_THM_CALL` |
| `func_00103350` | +0x18 | `bl` | `func_002FFBF8` | thumb | `R_ARM_THM_CALL` |
| `func_00103350` | +0x2c | `blx` | `func_00300B28` | arm | `R_ARM_THM_CALL` |
| `func_00103350` | +0x34 | `blx` | `func_002FED78` | arm | `R_ARM_THM_CALL` |
| `func_001035E4` | +0x2 | `bl` | `func_00302B8C` | thumb | `R_ARM_THM_CALL` |
| `func_001035E4` | +0x1c | `blx` | `func_002FF8C0` | arm | `R_ARM_THM_CALL` |
| `func_00103A84` | +0x4 | `bl` | `func_00303110` | thumb | `R_ARM_THM_CALL` |
| `func_00103A84` | +0x1c | `bl` | `func_001035E4` | thumb | `R_ARM_THM_CALL` |
| `func_00103A84` | +0x2a | `bl` | `func_003031BC` | thumb | `R_ARM_THM_CALL` |
| `func_00103A84` | +0x36 | `bl` | `func_00303188` | thumb | `R_ARM_THM_CALL` |
| `func_001054F4` | +0xa | `bl` | `func_00104DBA` | thumb | `R_ARM_THM_CALL` |
| `func_001054F4` | +0x18 | `blx` | `func_002FF10C` | arm | `R_ARM_THM_CALL` |
| `func_001054F4` | +0x1e | `bl` | `func_00305490` | thumb | `R_ARM_THM_CALL` |
| `func_00105DA4` | +0xa | `bl` | `func_0010564A` | thumb | `R_ARM_THM_CALL` |
| `func_00105DA4` | +0x18 | `blx` | `func_002FF10C` | arm | `R_ARM_THM_CALL` |
| `func_00105DA4` | +0x1e | `bl` | `func_0030570C` | thumb | `R_ARM_THM_CALL` |
| `func_002FEFDC` | +0x1a | `bl` | `func_002FF094` | thumb | `R_ARM_THM_CALL` |
| `func_002FEFDC` | +0x26 | `bl` | `func_00100BE4` | thumb | `R_ARM_THM_CALL` |
| `func_002FEFDC` | +0x4e | `blx` | `func_002FF10C` | arm | `R_ARM_THM_CALL` |
| `func_002FF7F8` | +0xe | `blx` | `func_002FF034` | arm | `R_ARM_THM_CALL` |
| `func_002FF7F8` | +0x1e | `bl` | `func_0010130A` | thumb | `R_ARM_THM_CALL` |
| `func_002FF7F8` | +0x2c | `bl` | `func_002FFAF4` | thumb | `R_ARM_THM_CALL` |
| `func_002FF830` | +0x1a | `bl` | `func_002FFB00` | thumb | `R_ARM_THM_CALL` |
| `func_002FF830` | +0x28 | `bl` | `func_002FFB14` | thumb | `R_ARM_THM_CALL` |
| `func_002FF830` | +0x34 | `bl` | `func_002FFAF4` | thumb | `R_ARM_THM_CALL` |
| `func_002FFD20` | +0xa | `blx` | `func_0019523C` | arm | `R_ARM_THM_CALL` |
| `func_002FFD20` | +0x1a | `blx` | `func_002FECF8` | arm | `R_ARM_THM_CALL` |
| `func_003009B0` | +0x12 | `bl` | `func_002FFB00` | thumb | `R_ARM_THM_CALL` |
| `func_003009B0` | +0x18 | `bl` | `func_00300A00` | thumb | `R_ARM_THM_CALL` |
| `func_003009B0` | +0x34 | `bl` | `func_00300A48` | thumb | `R_ARM_THM_CALL` |
| `func_00301D30` | +0x14 | `blx` | `func_003022C8` | arm | `R_ARM_THM_CALL` |
| `func_00301D30` | +0x2c | `blx` | `func_0050326C` | arm | `R_ARM_THM_CALL` |
| `func_00301D30` | +0x42 | `bl` | `func_00301D1C` | thumb | `R_ARM_THM_CALL` |
| `func_00301F68` | +0x18 | `bl` | `func_00301D7C` | thumb | `R_ARM_THM_CALL` |
| `func_00301F68` | +0x1e | `blx` | `func_00503254` | arm | `R_ARM_THM_CALL` |
| `func_00301F68` | +0x30 | `blx` | `func_00302108` | arm | `R_ARM_THM_CALL` |
| `func_00301F68` | +0x38 | `blx` | `func_00301FBC` | arm | `R_ARM_THM_CALL` |
| `func_00302208` | +0x1e | `bl` | `func_003021CC` | thumb | `R_ARM_THM_CALL` |
| `func_00302208` | +0x54 | `bl` | `func_003021CC` | thumb | `R_ARM_THM_CALL` |
| `func_00303008` | +0xa | `blx` | `func_002FF034` | arm | `R_ARM_THM_CALL` |
| `func_00303008` | +0x10 | `blx` | `func_002FF7EC` | arm | `R_ARM_THM_CALL` |
| `func_0030305C` | +0x20 | `bl` | `func_00300ABC` | thumb | `R_ARM_THM_CALL` |
| `func_0030305C` | +0x32 | `bl` | `func_002FFE4A` | thumb | `R_ARM_THM_CALL` |
| `func_0030305C` | +0x3c | `bl` | `func_002FFB14` | thumb | `R_ARM_THM_CALL` |
| `func_0030305C` | +0x4c | `bl` | `func_002FFAF4` | thumb | `R_ARM_THM_CALL` |
| `func_003030BC` | +0x22 | `bl` | `func_002FFB14` | thumb | `R_ARM_THM_CALL` |
| `func_003030BC` | +0x32 | `bl` | `func_002FFAF4` | thumb | `R_ARM_THM_CALL` |
| `func_003030BC` | +0x38 | `bl` | `func_00300A00` | thumb | `R_ARM_THM_CALL` |
| `func_003036C0` | +0x18 | `bl` | `func_002FFE30` | thumb | `R_ARM_THM_CALL` |
| `func_003036C0` | +0x1c | `blx` | `func_002FF8C0` | arm | `R_ARM_THM_CALL` |
| `func_00304408` | +0x12 | `bl` | `func_001042A6` | thumb | `R_ARM_THM_CALL` |
| `func_00304408` | +0x18 | `blx` | `func_002FF10C` | arm | `R_ARM_THM_CALL` |
| `func_00304408` | +0x1e | `blx` | `func_002FF10C` | arm | `R_ARM_THM_CALL` |
| `func_00304408` | +0x24 | `blx` | `func_002FF10C` | arm | `R_ARM_THM_CALL` |
| `func_00304408` | +0x2a | `bl` | `func_003036C0` | thumb | `R_ARM_THM_CALL` |
| `func_00304D24` | +0x6 | `bl` | `func_00302F64` | thumb | `R_ARM_THM_CALL` |
| `func_00304D24` | +0x16 | `bl` | `func_00302F64` | thumb | `R_ARM_THM_CALL` |
| `func_00304D24` | +0x26 | `bl` | `func_00302F64` | thumb | `R_ARM_THM_CALL` |
| `func_003053E0` | +0xc | `bl` | `func_001033C4` | thumb | `R_ARM_THM_CALL` |
| `func_003053E0` | +0x14 | `bl` | `func_0030232C` | thumb | `R_ARM_THM_CALL` |
| `func_003053E0` | +0x1e | `bl` | `func_00103028` | thumb | `R_ARM_THM_CALL` |

There are no other relocations. Every target is an exact global entry rather
than a secondary or interior entry. Repeated destinations are intentional and
remain distinct relocation sites.

## PC-relative semantics and ownership

The sixteen entries below use Thumb's word-aligned PC base. Every affected
function begins at an address congruent to zero modulo four in the target
layout. Object sections still require only two-byte alignment; linked placement
must separately preserve the recorded modulo-four invariant. Target offsets
are hexadecimal.

| Function | Instruction offset | Form | Target offset | Entry modulo 4 | Crossed function intervals |
| --- | ---: | --- | ---: | ---: | --- |
| `func_00100AD4` | +0xa | `ldr` | +0x94 | 0 | none |
| `func_00100AD4` | +0x10 | `ldr` | +0x94 | 0 | none |
| `func_00101CD8` | +0x36 | `ldr` | +0x4c | 0 | none |
| `func_001035E4` | +0x6 | `ldr` | +0x54 | 0 | none |
| `func_001054F4` | +0x4 | `ldr` | +0x24 | 0 | none |
| `func_00105DA4` | +0x4 | `ldr` | +0x24 | 0 | none |
| `func_002FF7F8` | +0x24 | `ldr` | +0x34 | 0 | none |
| `func_002FFD20` | +0x14 | `ldr` | +0x24 | 0 | none |
| `func_00301D30` | +0x6 | `ldr` | +0xd4 | 0 | `func_00301D7C`, `func_00301DC8` |
| `func_00301D30` | +0x1c | `ldr` | +0xd4 | 0 | `func_00301D7C`, `func_00301DC8` |
| `func_00301F68` | +0x8 | `ldr` | +0x48 | 0 | none |
| `func_0030305C` | +0x1c | `add` | +0x58 | 0 | none |
| `func_0030305C` | +0x1e | `add` | +0x58 | 0 | none |
| `func_0030305C` | +0x54 | `ldr` | +0x5c | 0 | none |
| `func_003030BC` | +0x40 | `ldr` | +0x50 | 0 | none |
| `func_00304408` | +0x6 | `ldr` | +0x34 | 0 | none |

Every destination is unowned post-body material. The two loads in
`func_00301D30` cross the complete foreign intervals of `func_00301D7C`
and `func_00301DC8`; this batch claims neither function nor the addressed
location. All other targets lie after their body without crossing a complete
foreign function interval. No literal pool, addressed word, string, identity
mapping, or target-object generator data entry is owned by this batch.

## Canonical schedules and hashes

The configuration is the complete neutral implementation handoff. Split each
function's `schedule` on `|`. Determine byte offsets cumulatively: entries
at `wideInstructionOffsets` are four bytes and all other entries are two.
A local transfer uses `local:+target`, with a lowercase hexadecimal target
and no `0x` prefix. The control arrays redundantly record every branch,
return, indirect call, indirect tail, and direct call.

Canonical instruction records are
`function:hexOffset:mnemonic:operands`. Records are joined by LF with no
terminal newline.

- Full mnemonic/operand schedule: `8fe010ee1e579724b8806414cc8ca003f559bc291ba0f4328de85572b61f535a`
- Local-transfer schedule: `db12ce8697452ff7a75e144b84a523306e993d9027402ea78f6b9f755a0d8712`
- Return schedule: `27c99adc1800be8a10c33008b82f335370a550183f5cec2615386056fd9830ce`
- Indirect-call schedule: `55430d8b4e4755594b3173af48ca017dee7abaf9a668c425113f0f417b00830f`
- Indirect-tail schedule: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- Direct-call schedule: `60a37866d58fd4be6cc46f54eb03cb25bfc17a6fc1815961e8b17da569304c92`

Instruction selection, flags behavior, operand order, call state transition,
branch width, order, mode, entry placement, and body boundary are normative.
Equivalent uniquely scoped local-label names are permitted.

GNU Arm assembly can silently canonicalize a three-operand same-register
`adds` or `subs` immediate into the byte-distinct two-operand form. Every
explicit three-operand immediate entry requires the Thumb16 immediate-three-bit
form; every two-operand immediate entry requires the Thumb16 immediate-eight-bit
form. When the assembler cannot preserve that architectural distinction, use a
Thumb instruction-emission directive such as `.inst.n`; a data-emission
directive is not equivalent because it introduces `$d` mapping symbols inside
an executable body. Every complete body in this batch must remain covered by
Thumb code mapping (`$t`) with no interior `$d` interval. Section alignment must
remain two bytes; raising it to four can introduce isolated-section padding.

## Unmatched, ownership, and collision audit

All twenty-four selected report entries were unmatched at zero percent when
selected. Names are pairwise distinct and body intervals are pairwise disjoint.
No selected name is a function member, alias, identity member, or secondary
entry already owned by a public configuration. Earlier public appearances are
only external call targets, next-global boundaries, or crossed foreign
intervals and therefore do not claim a selected body.

Exact whole-body comparison against all 10,440 target functions found all
selected bodies to be singleton classes. There is no selected-to-selected or
selected-to-unselected whole-body collision, so `duplicateBodyClasses` is
empty.

## Independent validation and completeness contract

A generated probe assembled all schedules for ARMv6K Thumb mode. It forced the
architecturally specified immediate-three-bit form only at explicit
three-operand same-register add/sub sites. After masking only the sixty-eight
direct-call relocation fields, every remaining byte in all twenty-four bodies
matched the bounded private target. The probe emitted exactly sixty-eight
`R_ARM_THM_CALL` relocations at the configured offsets and to the configured
symbols. Schedule sizes, instruction widths, totals, all sixteen PC-relative
destinations, next-global boundaries, ownership exclusions, collision classes,
and all six canonical hashes were independently recomputed.

The implementation must define exactly these twenty-four global Thumb
functions in individual `.text.<name>` sections. Each section stops at its
recorded body size and contains the exact ordered schedule, local destinations,
and call relocations. Sections require two-byte alignment; linked placement of
PC-relative functions must preserve entry modulo four without isolated-section
padding.

The implementation must emit no trailing alignment byte, pool word, addressed
post-body material, string, asset, unexpected external reference, extra
relocation, direct external jump, or adjacent data. Post-body PC targets and
crossed foreign functions are outside batch ownership and must not be copied
into source or any target-object identity mapping. Validation must also reject
an interior `$d` mapping symbol in any selected executable body, even when the
underlying bytes happen to match, because objdiff treats those bytes as data
rather than Thumb instructions.
