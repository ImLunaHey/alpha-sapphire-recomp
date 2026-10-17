# DllBattleVideoSave bounded specification

## Scope and provenance

Analysis-only handoff for Pokémon Alpha Sapphire, target revision
`AS_EUR_REV2`, unit `cro/DllBattleVideoSave`, dated **2026-10-17**.
This specification records public repository evidence and an evidenced
target-analysis blocker. No new target behavior was observed, no implementation
source was consulted, and no implementation or build integration was changed.
The contribution follows [the clean-room protocol](../../CLEAN_ROOM.md).

Exact tooling attempted at repository revision
`17969730924004f6dfe31be781a7a239f214ffe0`:

- `node scripts/verify-target.mjs`, using Node.js **v24.21.0**.
- `bash scripts/analyze-cro-target.sh DllBattleVideoSave`, using GNU Bash
  **5.3.9(1)-release**. The wrapper stopped before starting Ghidra or any
  target decoding; no analysis-engine version was observed in this session.

The repository revision identifies the exact versions of these unversioned
scripts. Public evidence consulted comprises the unit's neutral function
inventory, its entry in `config/cro-sources.json`, the existing
[reviewed byte-store contract](store_leaves_02.md), and its entry in the
checked-in `AS_EUR_REV2` progress report. These are inherited facts, not fresh
target verification.

## Permitted interface contract

The existing reviewed contract identifies `func_00001D60` as a byte setter.
It accepts a writable byte-addressable base pointer and a byte-valued argument,
stores that value at byte offset **217** from the base, and returns without a
specified result. The caller must provide storage covering that byte. This
contract specifies no meaning for the field, validation policy, ownership
transfer, or persistence operation.

The public report records eight accepted functions, with one function and
eight code bytes matched; it records no matched data. This establishes partial
coverage only. The module name alone does not establish a battle-video save
workflow, file format, user-visible behavior, or error protocol.

## Evidenced blocker and remaining scope

The ignored local configuration and process environment provide neither
`ROM_PATH` nor `DECOMP_PRIVATE`. The unit's ignored converted and split target
objects are absent. The approved verification command exited with status 1:
`ROM_PATH does not name a readable target file`. The approved analysis wrapper
also exited with status 1: `DECOMP_PRIVATE: Set DECOMP_PRIVATE in .env.local`.
No external target was opened or searched for elsewhere.

Further behavioral analysis requires the authorized external input configured
through the ignored settings, successful revision verification, and approved
conversion/analysis tooling. Until then, lifecycle, saving operations,
dependencies, remaining functions, and initialized data have no newly
established contract here. An independent implementation must not infer them
from the unit name or progress accounting.

Preserve `metadata.complete=false`. The existing byte setter and public
structural evidence do not justify completion. This document contains no
target payload, disassembly, instruction schedule, extracted strings or
tables, exhaustive layout, or private location.
