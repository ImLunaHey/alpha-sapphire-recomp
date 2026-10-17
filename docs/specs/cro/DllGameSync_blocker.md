# DllGameSync clean-room publication blocker

## Scope and provenance

This implementation-side public-evidence audit covers Pokémon Alpha Sapphire
revision `AS_EUR_REV2`, unit `cro/DllGameSync`, and was recorded on
**2026-10-17** from repository revision
`bc3611fd4b7cb8c9aa5f22137957c2b794dc3f70`.

- Role: implementation-side audit only. No target-aware analysis or new
  implementation was performed, and this note is not a behavioral
  specification.
- Observation tools: Node.js **24.21.0**, npm **11.19.0**, Git **2.53.0**,
  ripgrep **15.2.0**, GNU Bash **5.3.9(1)-release**, and GNU sed **4.9**.
- Configured project tools: objdiff **3.8.2**, Ghidra **12.0.2**, GCC Arm
  Embedded **15.2.Rel1**, and `3dstool` commit
  `3771ae967d64092370b646db86aa626401c279e8`.
- Method: read the clean-room policy; parse only the tracked unit manifest,
  neutral function CSV, complete text partition, source-claim registry,
  approved store-leaf specification, public report record, and tool-provenance
  metadata; reconcile public counts and status; and test only whether the
  standard ignored local verification inputs exist. No ignored or private
  artifact content was opened.

This audit did not inspect a target object, disassembly, instruction schedule,
target bytes, relocation or symbol ledger, proprietary string or asset,
ROM/container data, or private artifact location. It used no leaked or
proprietary source.

## Public structural accounting

The neutral CSV and complete text partition agree on five accepted ARM
functions totaling 1,532 bytes. The partition also classifies 170 executable
gaps totaling 12,380 bytes, 172 pools totaling 956 bytes, and ten unknown
ranges totaling 1,108 bytes. Together those categories account for the full
15,976-byte text extent. These boundaries and categories are neutral
structural metadata, not behavioral specifications.

The source registry claims one eight-byte function, `func_00003AA4`, from the
unit's sole ARM C source. The approved store-leaf specification defines that
function's behavior. The public objdiff report credits it as an exact match,
so the published snapshot records one of five accepted functions and 8 of
1,532 accepted code bytes matched: 20% of functions and approximately
0.5221932% of code.

The report's `.text` section accounts for the 13,912 accepted-function and
executable-gap bytes, while `.pool` accounts for 956 bytes. It additionally
publishes 76 BSS bytes, eight writable-data bytes, and 1,512 read-only-data
bytes, for 2,552 reported data bytes. No data match is credited. The report
keeps `metadata.complete` false and identifies the existing source path. The
inventory, partition, source registry, specification, and report therefore
agree on a valid but incomplete one-function implementation.

## Blocker and completion boundary

No independently approved behavioral specification covers the remaining four
accepted functions, executable gaps, pools, unknown ranges, or non-text data.
Their names, sizes, addresses, and aggregate section totals do not establish
inputs, outputs, state transitions, side effects, collaborator interfaces,
data contents, relocation identity, or ownership. An implementation role must
not infer those facts or extend the existing store-leaf contract to them.

The standard local environment file, converted unit target, paired base
object, generated objdiff configuration, and local generated report are
absent. The repository environment check confirms that `ROM_PATH` is not
configured. Focused target-aware validation and deterministic full-unit
objdiff proof therefore cannot run in this checkout.

Further implementation requires a separate analysis contributor to supply a
reviewed, provenance-bearing behavioral and interface contract, followed by a
distinct implementation contributor using only that handoff. Completion may
be claimed only after the full target and base objects are byte-identical and
the aggregate publication gates pass. Until then, preserve the existing
eight-byte match, make no additional source claim, and keep
`metadata.complete=false`; a structural partition or partial function match is
not whole-unit proof.
