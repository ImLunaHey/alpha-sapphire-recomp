# DllBattlePartySelect analysis handoff

## Provenance and status

- Contribution: analysis only; blocked behavioral specification, not approved
  for implementation.
- Intended target: Pokémon Alpha Sapphire, European revision 2,
  `AS_EUR_REV2`, unit `cro/DllBattlePartySelect`.
- Analysis date: 2026-10-17.
- Tools actually used: Node.js v24.21.0, npm 11.19.0, Git 2.53.0;
  repository environment/verification scripts and public metadata at
  revision `953c980`. Node.js was used to summarize public JSON metadata.
- Sources: `docs/CLEAN_ROOM.md`, `docs/CRO_UNITS.md`,
  `docs/CRO_TARGET_OBJECTS.md`, `docs/CRO_TARGET_BATCH.md`,
  `symbols/cro/DllBattlePartySelect.csv`, the corresponding public partition,
  `progress/units/AS_EUR_REV2.cro.json`, and this unit's entry in
  `progress/reports/AS_EUR_REV2/report.json`.

No private target was inspected. The target revision above identifies the
requested and publicly inventoried revision; it is not a claim of successful
private-target verification. No implementation source was consulted or written.

## Evidenced access blocker

This worktree has no `.env.local`; neither `ROM_PATH` nor `DECOMP_PRIVATE` is
configured in the process environment. The supported checks produced:

- `npm run check:environment`: exit 1, `ROM_PATH is not configured.`
- `npm run target:verify`: exit 1,
  `ROM_PATH does not name a readable target file`.

The expected converted object,
`build/AS_EUR_REV2/target/cro/DllBattlePartySelect.o`, is absent. Thus neither
verified input nor the unit object needed for target-aware analysis is
available here. No extraction, conversion, disassembly, or runtime experiment
was performed; no target-analysis tool version or behavioral observation is
claimed.

## Function interfaces awaiting observation

The existing public inventory provides these provisional section-relative
boundaries, not behavioral contracts:

| Function | `.text` offset | Mode | Body size |
| --- | --- | --- | ---: |
| `func_0000038C` | `0x0000038C` | ARM | 656 bytes |
| `func_0000109C` | `0x0000109C` | ARM | 424 bytes |

For **each** function, argument meanings and calling convention details,
return semantics, input validity requirements, object layout, state changes,
control-flow decisions, external calls, and resource ownership remain
unobserved. Names, sizes, and module identity cannot establish those facts.
Neither function is ready for independent implementation from this handoff.

## Whole-unit blockers

The public partition accounts for 5,940 text bytes: 1,080 accepted function
bytes, 4,312 executable gap bytes, 508 pool bytes, and 40 unknown bytes.
These are aggregate coverage facts only; gaps are not additional accepted
functions, and pools are not specified data values.

The existing public report additionally records 1,092 read-only data bytes,
44 writable data bytes, and 16 BSS bytes. Its 1,660-byte data denominator
includes the pools. It records `complete: false`. These are historical public
accounting observations, not measurements repeated against a private target.

Behavior of both accepted functions and the remaining code, data contents and
ownership, relocation counts and dependencies, import/export interfaces, and
the classification of unknown residue still require analysis. No relocation
absence, data match, or unit completion can be inferred from these summaries.

## Required next evidence

A target-aware analyst must first configure lawful external inputs and pass
the repository environment and target-verification gates. Use the documented
unit conversion and inventory-validation tooling while retaining proprietary
inputs and generated objects outside Git. Then record high-level ABI and
behavioral observations for both entries, including meaningful boundary
cases and dependencies, with tool versions and observation dates. Resolve
remaining code/data/relocation/residue obligations before claiming whole-unit
completion. A separate implementation role must use a reviewed behavioral
specification; this blocked handoff supplies no substitute behavior.
