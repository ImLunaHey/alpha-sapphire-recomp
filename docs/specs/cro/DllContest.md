# DllContest verification and completion blocker

## Scope and role provenance

This verification-only handoff covers the published unit `cro/DllContest` for
Pokémon Alpha Sapphire European revision 2 (`AS_EUR_REV2`). Observations were
recorded on 2026-10-17 from repository revision `8181a61` using Node.js
v24.21.0, npm 11.19.0, Git 2.53.0, and the repository's public metadata and
validation scripts.

The contribution role is status analysis and validation only. No new game
implementation or behavioral specification was authored. The two existing
leaves were inherited from revision `7b14dec` and are governed by the reviewed
public contracts in `store_leaves_02.md` and `pod_leaves_01.md`; this handoff
does not independently re-establish their implementation provenance.

Sources consulted were `docs/CLEAN_ROOM.md`, `docs/CRO_UNITS.md`,
`docs/CRO_TARGET_OBJECTS.md`, `config/cro-sources.json`, the public function
inventory and complete-text partition for this unit, the public CRO manifest,
and the checked-in progress report. A small Node.js script summarized the
public JSON aggregates. No private target, generated target object,
disassembly, proprietary asset, or private path was inspected.

## Public structural observations

The public manifest records a 106,496-byte CRO. Its 78,440-byte text segment
is completely classified by the public partition as 52 accepted ARM functions
totaling 14,080 bytes, 58,880 executable gap bytes, 3,560 pool bytes, and 1,920
unknown bytes. These are structural accounting categories; gaps and unknown
regions are not accepted functions.

The checked-in report credits the two previously reviewed leaves: one 8-byte
byte-store function and one 16-byte plain-data initializer. Together they
account for 2/52 functions and 24/14,080 accepted function bytes. The report
contains no partial function match and keeps `metadata.complete` false.

The report's 9,784-byte data denominator consists of 3,560 text-pool bytes,
4,900 read-only bytes, 912 writable initialized bytes, and 412 zero-initialized
bytes. None is reconstructed by the unit's authored sources. The configured
sources own only the two reviewed executable leaves and do not claim unit data.

These observations repeat checked-in public accounting; they are not a new
private-target comparison or a whole-unit completion claim.

## Evidenced verification blocker

This worktree has no `.env.local`, and `ROM_PATH` is not configured. The
supported gates therefore fail closed:

- `npm run check:environment` exits 1 and reports that `ROM_PATH` is not
  configured.
- `npm run target:verify` exits 1 because `ROM_PATH` does not identify a
  readable target.
- `build/AS_EUR_REV2/target/cro/DllContest.o` is absent.

Consequently, this handoff cannot repeat the checked-in report's opaque exact
comparisons or produce deterministic full-unit proof against the requested
revision.

## Remaining completion blockers

1. The other 50 accepted functions, totaling 14,056 bytes, lack approved
   behavioral specifications for an independent implementation role.
2. The 58,880 executable gap bytes lack accepted function boundaries and
   cannot be absorbed into synthetic functions.
3. The 1,920 unknown text bytes require independent classification.
4. All 9,784 report-accounted data bytes lack reviewed content and ownership
   specifications.
5. Relocation identities and dependency semantics remain unverified in this
   worktree; public size accounting cannot establish them.
6. Full completion still requires a lawful verified target, deterministic
   full-unit comparison, and passing aggregate publication gates.

A target-aware analyst must produce reviewable high-level behavioral and data
specifications without transferring target bytes, instruction schedules,
symbol or relocation ledgers, strings, or assets. A separate implementation
role may then author original code from those approved specifications. Until
all code, data, relocation, and residue obligations are resolved and verified,
`cro/DllContest` must remain incomplete.
