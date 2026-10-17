# DllHologramMail provenance quarantine

Analysis-only provenance audit dated **2026-10-17**, for `AS_EUR_REV2`, unit
`cro/DllHologramMail`, at public base
`d7a0c7eeff0bc6c4752e29ed2b9ff315d01b8bea`.

The independent analysis supplied for this corrective task found insufficient
provenance. The source, source-configuration claim, and match credit originated
in `7b14dec...`. The shared batch document lacked independent observations,
specification approval, and separated implementation provenance for this unit.
That document cannot establish an approved behavioral contract.

Under [CLEAN_ROOM](../../CLEAN_ROOM.md), the source and ownership claim are
removed and all unit, function, and section match/completion credit is
withdrawn. The suspect source is deleted without reproducing its contents.
This is a public-metadata/tooling correction, not a target implementation.

The neutral manifest, CSV, partition, and report inventory remain. The report
retains 44 accepted functions, 14,536 accepted code bytes, and 9,152 data bytes
as denominators, with metadata exactly `{"complete":false}` and no source
path. Neutral inventory does not establish behavior. **No behavioral contract
is approved. The unit stays blocked and incomplete.**

The withdrawal removes one credited function and eight credited code bytes.
On the rebased Gift-quarantine baseline, global credit becomes 4,257 functions
/ 416,740 bytes; the existing 3,719,620 code-byte denominator yields
11.203833% using objdiff's float32 convention. The 93 remaining credited CRO
units account for 279 functions / 15,016 bytes. The remaining shared family
has 50 functions / 400 bytes; that wave added 49 functions / 392 bytes.
Historical activity values are retained with a
withdrawal qualification.

Audit tooling: public **Git 2.53.0** and **Node v24.21.0** only. The origin
finding above is the supplied independent analysis conclusion; this corrective
implementation did not inspect discarded implementation history. Audited public
paths are:

- `docs/CLEAN_ROOM.md`
- `docs/specs/cro/store_leaves_02.md`
- `docs/specs/cro/DllHologramMail_blocker.md`
- `config/cro-sources.json`
- `progress/units/AS_EUR_REV2.cro.json`
- `symbols/cro/DllHologramMail.csv`
- `symbols/cro-partitions/DllHologramMail.json`
- `progress/reports/AS_EUR_REV2/report.json`
- `progress/project.json`
- `README.md`
- `docs/BYTEMATCH.md`
- `docs/CRO_UNITS.md`
- `docs/CRO_TARGET_OBJECTS.md`
- `package.json`
- `scripts/validate-cro-store-leaves.mjs`
- `scripts/validate-cro-dll-hologram-mail.mjs`
- `scripts/prepare-bytematch-report.mjs`
- `scripts/test-prepare-bytematch-report.mjs`
- `scripts/validate-public-cro-metadata.mjs`

`src/cro/DllHologramMail.c` is a deletion-only path; its contents were not
read for this correction. No environment secrets, private inputs, ignored
target/build artifacts, raw binaries, or disassembly support this audit.

Resumption requires new independently recorded observations with target,
date, tool/version, and public provenance; explicit specification review and
approval; and a separate implementation role working only from that approved
specification. Any future source ownership or match credit requires a new
reviewed provenance record and authorized independent verification. The
quarantine validator must be changed only as part of that reviewed resumption.
Neither this audit nor a successful public-state check authorizes implementation
or establishes completion.
