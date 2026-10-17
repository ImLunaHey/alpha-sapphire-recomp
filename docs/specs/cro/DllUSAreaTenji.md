# DllUSAreaTenji import-veneer specification

## Provenance and role separation

This neutral analysis specification covers eight generic ARM import veneers in
the genuine `cro/DllUSAreaTenji` link unit. It contains no target instructions,
disassembly, strings, or target-derived tables.

- Target revision: `AS_EUR_REV2`.
- Repository baseline: `4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`.
- Observation date: 2026-10-17.
- Analysis used the repository's private CRO conversion and semantic-validation
  tools with GNU ARM binutils. The implementation role received only the
  high-level ABI and relocation facts below and did not inspect the target CRO,
  target object, or disassembly.

The public CSV and partition remain authoritative for accepted function
coverage. These veneers stay unaccepted executable gaps until the coordinator
can publish a matching aggregate report; they therefore add no ByteMatch
function credit in this change.

## Veneer contract

Each veneer is a four-byte ARM indirect tail transfer followed by a separate
four-byte literal pool. It preserves all incoming arguments and transfers
control to one undefined neutral import through one `R_ARM_ABS32` relocation
with addend zero.

| Code boundary | Pool boundary | Neutral import identity |
| ---: | ---: | --- |
| `0x000` | `0x004` | `__cro_import_anon_m7c7374617469637c_s0_002fd48` |
| `0x008` | `0x00C` | `__cro_import_anon_m446c6c4669656c64_s0_0087014` |
| `0x010` | `0x014` | `__cro_import_anon_m7c7374617469637c_s0_02dc63c` |
| `0x018` | `0x01C` | `__cro_import_anon_m446c6c4669656c64_s0_00d8e40` |
| `0x020` | `0x024` | `__cro_import_anon_m446c6c4669656c64_s0_0015d34` |
| `0x028` | `0x02C` | `__cro_import_anon_m446c6c4669656c64_s0_00d8eb0` |
| `0x030` | `0x034` | `__cro_import_anon_m446c6c4669656c64_s0_00158d4` |
| `0x038` | `0x03C` | `__cro_import_anon_m7c7374617469637c_s0_01ff8c0` |

The implementation uses readable assembly and symbolic imports. It must not
encode target instruction words or copy neighboring target bytes.

The earlier veneer source was quarantined in commit `bb63849`. The replacement
was authored in a no-history implementation role that read only
`docs/CLEAN_ROOM.md` and the 54-line version of this contract, with no access to
the earlier implementation, repository history, target material, reports, or
validators. Target verification was restricted to a separate blind pass/fail
role; it supplied no implementation details.

## Completion status

The only accepted public function remains `func_0000007C` at `0x07C`, size
292 bytes, as specified by `docs/specs/cro/contract_10.md`. The unit is not
complete. Its unaccepted executable ranges, read-only data, writable data,
BSS, and remaining relocations are not reconstructed by this veneer contract.

Private analysis also found read-only behavior records, type-identity strings,
and sentinel/alignment bytes without admissible independent provenance. The
clean-room rules prohibit copying those bytes into source or documentation.
They are a concrete blocker to byte-identical completion, so
`metadata.complete` must remain false.
