# DllFieldDemo clean-room blocker

## Scope and provenance

This analysis-only status record covers Pokemon Alpha Sapphire target revision
`AS_EUR_REV2`, unit `cro/DllFieldDemo`, on 2026-10-17. The author acted only as
a public-evidence auditor: no target-aware behavioral analysis was performed
and no implementation was written or changed.

The audit used Git 2.53.0, Node.js v24.21.0, and GNU Bash 5.3.9 at repository
revision `437467165002e653491660a830890772afdcba47`. The repository's report
workflow pins objdiff-cli 3.8.2, but no comparison was run because the required
external input is not configured.

The method was limited to reading the clean-room policy, the tracked neutral
CSV and complete text partition, the source-claim registry, the existing
public behavioral contract, and the sanitized progress report. It then ran
the ROM-free source-contract, public-metadata, manifest, and symbol-inventory
validators and checked whether the approved external input was configured.
No target object, disassembly, instruction schedule, target byte sequence,
relocation or symbol ledger, proprietary string or asset, ROM/container data,
or private artifact location was inspected.

## Public structural accounting

The neutral CSV and complete text partition agree on 11 accepted ARM functions
covering 4,328 bytes. The rest of the 8,504-byte text region is classified as
3,296 bytes of executable gaps, 804 bytes of pools, and 76 bytes of unknown
material. Those classifications cover the text region without overlap or a
hole; they are structural interoperability evidence, not behavioral contracts.

The source registry claims one eight-byte function under the reviewed byte-
store contract in `store_leaves_02.md`. The sanitized report agrees: it credits
one function and eight accepted code bytes, credits no data, and keeps
`metadata.complete` false. The report also accounts for all 11 accepted
function boundaries and the tracked text, pool, read-only data, writable data,
and zero-initialized data section sizes. No inventory/report mismatch was
observed.

## Stop condition

The remaining ten accepted functions, executable gaps, pools, unknown text,
and non-text data have no approved behavioral or ownership specification in
the reviewed public evidence. Their behavior, ABI details, data contents, and
relocation identities cannot be inferred from structural metadata or the unit
name. A separate analysis contributor must first provide reviewed behavioral
contracts, after which an independent implementation contributor may work only
from those contracts.

The external target is not configured, so this checkout cannot verify the
revision or run focused deterministic object comparison. Whole-unit
publication additionally requires exact proof for all code, data, relocations,
layout, and residual material, followed by the aggregate publication gates.
Until that evidence exists, preserve the existing one-function claim and keep
`metadata.complete` false.
