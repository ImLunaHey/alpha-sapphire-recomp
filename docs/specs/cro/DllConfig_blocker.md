# DllConfig bounded status specification

## Scope and provenance

Analysis-only handoff for Pokémon Alpha Sapphire, target revision
`AS_EUR_REV2`, unit `cro/DllConfig`, dated **2026-10-17**. This document
records public structural evidence and the current verification blocker. It
does not add an implementation contract or authorize new match credit.

- Analysis role: an independent reviewer with no implementation task.
- Public baseline: commit `8181a61c6438e6751335e12b1f560b84906a7fe6`.
- Observation tools: Node.js **v24.21.0** and GNU Bash
  **5.3.9(1)-release**.
- Configured tool provenance: `objdiff` **3.8.2**, Ghidra **12.0.2**, GCC Arm
  Embedded **15.2.Rel1**, and `3dstool` commit
  `3771ae967d64092370b646db86aa626401c279e8`.
- Method: read the clean-room policy; parse only the unit's tracked neutral
  CSV, partition JSON, source-claim record, and public report record; compare
  names, sizes, counts, and status; check only whether the approved ignored
  inputs exist. No ignored or private file content was opened.

The analysis did not inspect a target object, disassembly, instruction
schedule, target byte sequence, relocation or symbol ledger, proprietary
string or asset, ROM/container data, or private artifact location. A prior
review attempt exceeded its assigned tracked-file read boundary and was
quarantined. None of its observations support this document or any
implementation.

## Public structural accounting

The neutral CSV, complete text partition, and public report each inventory 13
functions. Their names and declared sizes agree, and the CSV identities are
unique. The partition classifies its text extent into 13 accepted ARM
functions, 166 executable gaps, 177 pools, and two unknown ranges.

The public report's split sections reconcile with that partition: its `.text`
section represents the accepted functions plus executable gaps, `.pool`
represents the partition pools, and the unknown ranges remain outside match
credit. The report accounts for 3,840 accepted function bytes and 2,916 data
bytes. This is structural accounting, not a full-unit implementation claim.

The tracked source configuration claims one ARM source and one of the 13
accepted functions. The public report correspondingly credits one function
and 20 code bytes, reports approximately 0.52% matched accepted code, and sets
`metadata.complete` to `false`. The inventory, source claims, and report agree
on that partial status; replacing it with a completion claim would create a
publication mismatch.

## Behavioral evidence status

The allowed evidence provides no new approved behavioral observations for the
remaining 12 functions, executable gaps, pools, unknown ranges, or non-text
data. Structural identities and the module name do not establish semantics,
ABI details, data contents, relocation identities, or ownership. An
independent implementation role therefore has no sufficient specification for
additional work and must not infer one from the accounting metadata.

## Evidenced verification blocker

The ignored local environment file, the unit's converted target object, and a
locally generated report are absent. The bounded review did not inspect the
process environment or attempt to locate external inputs elsewhere.

Deterministic full-unit proof is therefore unavailable from the reviewed
artifacts. Preserve the one existing claim and `metadata.complete=false`; do
not modify the source manifest or checked-in report from this specification.

Completion requires a separately reviewed behavioral specification, an
independent implementation role that has not inspected target internals, and
authorized external verification inputs. The final gate must reproduce all 13
accepted functions, all remaining text ownership, pools, unknown
classification, relocation behavior, and every data section, then prove the
complete target and base objects identical. Focused objdiff success for a
subset is not full-unit proof.
