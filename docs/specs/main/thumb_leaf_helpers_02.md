# Probe-verified Thumb leaf/helper batch 02

## Scope and provenance

This clean-room analysis specification covers twenty-four currently unmatched
Thumb-state functions totaling 848 executable bytes and 424 instructions for
revision `AS_EUR_REV2`. Evidence was limited to the current unmatched objdiff
report, neutral symbol and section inventories, recursive configuration
ownership auditing, bounded private-target control/data-flow inspection, and
an independent whole-body schedule comparison. No implementation source was
read while preparing this batch.

All 424 instructions are 16-bit Thumb instructions. The batch has no direct
call, direct external branch, relocation, owned adjacent data, private string,
or asset. Two small wrappers make one register-indirect call each and then
return. All other transfers are intra-function branches or returns. Twelve
literal-form loads in eight functions address unowned post-body locations;
their original entries are word-aligned and their exact aligned-PC semantics
are recorded below. The implementation must not emit or claim the addressed
post-body data.

## Structural and boundary inventory

Return sites and indirect-call sites are excluded from the local-branch count.
Memory-operation counts include loads, stores, stack operations, and multiple
loads. A next-global offset larger than the body size describes unowned space,
none of which belongs to this batch.

| Function | Bytes | Instructions | Local branches | Memory ops | Returns | Indirect calls | Next global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `func_00100048` | 42 | 21 | 5 | 6 | 1 | 0 | `func_00100074` (+44) |
| `func_001001E0` | 28 | 14 | 3 | 5 | 1 | 0 | `func_001001FC` (+28) |
| `func_00100218` | 116 | 58 | 12 | 10 | 3 | 0 | `func_00100294` (+124) |
| `func_001002B6` | 36 | 18 | 4 | 6 | 1 | 0 | `func_001002DC` (+38) |
| `func_0010048A` | 44 | 22 | 6 | 6 | 2 | 0 | `func_001004B8` (+46) |
| `func_001007A4` | 24 | 12 | 2 | 3 | 1 | 0 | `func_001007BC` (+24) |
| `func_0010092C` | 6 | 3 | 0 | 2 | 1 | 0 | `func_00100A5C` (+304) |
| `func_00100BCC` | 24 | 12 | 2 | 1 | 1 | 0 | `func_00100BE4` (+24) |
| `func_00102724` | 52 | 26 | 4 | 10 | 1 | 0 | `func_0010275C` (+56) |
| `func_00102AC4` | 46 | 23 | 2 | 8 | 1 | 0 | `func_00102B04` (+64) |
| `func_00102D8A` | 40 | 20 | 5 | 4 | 1 | 0 | `func_00102DB2` (+40) |
| `func_00102E08` | 40 | 20 | 4 | 6 | 2 | 0 | `func_00102E30` (+40) |
| `func_00102E4A` | 126 | 63 | 19 | 15 | 2 | 0 | `func_00102EC8` (+126) |
| `func_00102EF2` | 24 | 12 | 3 | 1 | 1 | 0 | `func_00102F0C` (+26) |
| `func_00103028` | 10 | 5 | 0 | 3 | 1 | 0 | `func_00103174` (+332) |
| `func_00103D58` | 10 | 5 | 0 | 4 | 1 | 1 | `func_00103D9E` (+70) |
| `func_00103D9E` | 10 | 5 | 0 | 4 | 1 | 1 | `func_00103E24` (+134) |
| `func_002FFB00` | 14 | 7 | 1 | 3 | 1 | 0 | `func_002FFB14` (+20) |
| `func_002FFBD4` | 10 | 5 | 0 | 3 | 1 | 0 | `func_002FFBE0` (+12) |
| `func_002FFC3C` | 32 | 16 | 4 | 5 | 3 | 0 | `func_002FFC68` (+44) |
| `func_00302B8C` | 48 | 24 | 5 | 7 | 1 | 0 | `func_00302C50` (+196) |
| `func_00302F64` | 40 | 20 | 4 | 3 | 4 | 0 | `func_00302F98` (+52) |
| `func_00303C04` | 12 | 6 | 0 | 4 | 1 | 0 | `func_00303C10` (+12) |
| `func_00303D84` | 14 | 7 | 0 | 5 | 1 | 0 | `func_00303D98` (+20) |

Totals: 848 body bytes, zero adjacent bytes, 424 instructions, 85 local
branches, 124 memory operations, 34 return sites, two register-indirect calls,
zero indirect tails, zero direct calls, and zero relocations.

## PC-relative semantics and ownership

Every entry in this table uses Thumb's word-aligned PC base. Each original
entry address is divisible by four, so the implementation section must preserve
four-byte entry alignment even though ordinary batch functions require only
two-byte alignment. Every target is at or beyond the function body end and
before the recorded next global symbol; it is unowned and must not be emitted.

| Function | Load offset | Target offset |
| --- | ---: | ---: |
| `func_0010092C` | 0 | +8 |
| `func_00102724` | +2 | +52 |
| `func_00102AC4` | 0 | +52 |
| `func_00102AC4` | +16 | +56 |
| `func_00102AC4` | +30 | +60 |
| `func_00103028` | 0 | +12 |
| `func_002FFB00` | 0 | +16 |
| `func_00302B8C` | +2 | +48 |
| `func_00302F64` | +4 | +40 |
| `func_00302F64` | +20 | +44 |
| `func_00302F64` | +30 | +48 |
| `func_00303D84` | +8 | +16 |

The remaining sixteen functions have no PC-relative access. No literal pool,
identity mapping, or target-object generator entry is owned by this batch.

## Canonical schedules and hashes

The configuration is the complete neutral implementation handoff. Split each
function's `schedule` on `|`; because every instruction is 16-bit, an entry's
byte offset is its zero-based index multiplied by two. A local transfer uses
`local:+target`, where the target is a lowercase hexadecimal byte offset with
no `0x` prefix. `localTransfers`, `returns`, and `indirectCalls` redundantly
record every control-transfer site and make validation independent of label
names.

Canonical instruction records are
`function:offset:mnemonic:operands`. Canonical local-transfer records use
`function:offset:mnemonic:local:+target`. Records are joined by LF with no
terminal newline.

- Full mnemonic/operand schedule: `abd72f1234e258b151068554ddc955af1c76f67f428305066c8c43076ceb5b66`
- Local-transfer schedule: `ef5c453892c3762a2249c47c5be8d17ba04c10bf2638a94e5048a7382f6ed4a9`
- Return schedule: `aa4d6a6e63012a8b236fe4b3734f2edd0db23399408421be781cf4c5edb74fed`
- Indirect-call schedule: `29832c4bfe4a76ba17f7684de79e023a137ff6b9b17c5108726c719903b16f96`

Instruction selection, flags behavior, operand order, branch width, order,
mode, entry alignment, and section boundary are normative. Equivalent uniquely
scoped local-label names are permitted.

Operand count is also an encoding constraint. GNU Arm assembly may silently
canonicalize `adds/subs Rd, Rd, #imm` to the semantically equivalent but
byte-distinct two-operand immediate form. Every explicit three-operand
same-register add/sub in the schedule requires the Thumb16 immediate-three-bit
form; every two-operand add/sub requires the immediate-eight-bit form. This
distinction is architectural metadata, not an optional spelling choice.

## Unmatched, uniqueness, and collision audit

All twenty-four selected report entries were unmatched at zero percent when
selected. Their names are pairwise distinct, their symbol intervals are
pairwise disjoint, and none was present in any pre-existing public
configuration, including `thumb-leaf-helpers-01` and
`arm-thumb-runtime-helpers-12`. Recursive ownership inspection covered names,
aliases, identity members, branches, secondary entries, and next-global
annotations. No selected interval overlaps a previously configured interval.

Whole-body comparison against all 10,440 target functions yields twenty-three
body classes. Twenty-two are singleton classes. The only duplicate class is
`func_00103D58` with `func_00103D9E`; both selected members are explicitly
recorded in the configuration, and there are no other selected-body
collisions.

## Completeness contract

The implementation must define exactly these twenty-four global Thumb
functions in individual `.text.<name>` sections and stop every section at its
recorded body size. It must emit the exact ordered instruction schedule and
local destinations from the configuration. All emitted object sections retain
two-byte section alignment and contain no trailing alignment padding. The eight
functions listed in the PC-relative table require word-aligned placement at
their recorded target addresses; that placement invariant must be checked
against the symbol inventory rather than implemented by padding their isolated
sections.

The implementation must emit no padding byte, pool word, string, asset,
external symbol reference, relocation, direct call, or direct external branch.
The two `blx` sites are register-indirect calls and must remain relocation-free.
Post-body PC-relative targets are explicitly outside batch ownership and must
not be copied into the source or target-object identity configuration.
