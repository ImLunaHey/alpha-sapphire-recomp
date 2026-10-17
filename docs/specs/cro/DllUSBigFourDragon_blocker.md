# DllUSBigFourDragon clean-room evidence blocker

`cro/DllUSBigFourDragon` has no admissible behavioral specification from which
an independent implementation can be written. This status-only,
implementation-side audit records that stop condition; it is not target-aware
analysis, a behavioral contract, or approval to implement.

## Provenance and method

- Review date: 2026-10-17.
- Repository revision: `fdccc1a07e8aa1360c7c1ec7a15852ebab00049a`.
- Target revision: Pokémon Alpha Sapphire `AS_EUR_REV2` (Europe, revision 2),
  as declared in [repository provenance](../../PROVENANCE.md). The target was
  not inspected or executed for this audit.
- Tools: Git 2.53.0, Node.js v24.21.0, npm 11.19.0, GitHub CLI 2.102.0,
  ripgrep 15.2.0, and Bash 5.3.9.
- Method: read the [clean-room policy](../../CLEAN_ROOM.md) and
  [specification policy](../README.md) in full; cross-check only the tracked
  unit manifest, neutral function inventory, complete text partition,
  publication manifest, aggregate report, authored-source registry, and
  repository history; then search the public repository's indexed files,
  issues, and pull requests for `DllUSBigFourDragon`.

No ROM, CRO binary, extracted asset, copyrighted binary, proprietary SDK or
source, private artifact or path, credential, target object, disassembly,
target bytes, instruction schedule, or private comparison result was inspected
or reproduced.

## Admissible evidence and status

- The [public unit manifest](../../../progress/units/AS_EUR_REV2.cro.json)
  identifies `cro/DllUSBigFourDragon` as a permanent 12,288-byte CRO unit for
  the declared target revision. This establishes identity and the link-unit
  boundary, not behavior.
- The [neutral symbol inventory](../../../symbols/cro/DllUSBigFourDragon.csv)
  records a 328-byte text extent but contains no accepted function row.
- The [complete text partition](../../../symbols/cro-partitions/DllUSBigFourDragon.json)
  contains no accepted function. It classifies 196 bytes as executable gaps,
  72 bytes as pools, and 60 bytes as unknown. Those structural categories do
  not specify callable interfaces, inputs, outputs, state changes, or error
  behavior.
- `config/cro-sources.json` has no entry for the unit. The checked-in objdiff
  report records zero matched code, zero matched functions, no source path,
  and `metadata.complete: false`; its aggregate section metadata reports 252
  data bytes and 196 uncredited text bytes.
- Public repository search found no issue or pull request containing the unit
  name. Indexed code results were limited to the same identification and
  structural-publication files described above.

These facts support stable publication of the unit and an honest zero-credit
baseline only. Neither the module name nor its structural partition is an
implementable behavioral contract.

## Blocker and required handoff

Writing source now would require inventing both an interface and behavior. It
would therefore be guesswork outside the approved specification boundary and
would violate the required separation between target-aware observation,
review, and target-blind implementation. This audit makes no implementation,
objdiff match, ByteMatch gain, full-link, or completion claim.

Further work requires a distinct analysis contributor to publish reproducible
external observations attributable to this unit and the verified target
revision. A neutral handoff must identify the observer, date, public interface
or runtime exercised, observation method, and tool versions; state initial
conditions and stimuli; describe outputs, state effects, relevant boundary and
failure cases, repeatability, and uncertainty; and distinguish public
documentation from direct observation. It must exclude target bytes, physical
instruction schedules, relocations, and other target-derived implementation
aids.

After independent clean-room review, a distinct target-blind implementation
contributor may write original code solely from that approved specification.
Any credit then requires the pinned build, focused semantic validation, and an
authoritative deterministic objdiff/report comparison. Until all of those
conditions are met, `cro/DllUSBigFourDragon` must remain unimplemented,
incomplete, and uncredited.
