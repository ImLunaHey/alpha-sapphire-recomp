# DllFieldEventSlopeSlip corrective provenance record

## Observation provenance

- Observation date: 2026-10-17.
- Public repository revision observed: `00a1046476528c03404541a55fc6a48a17770851`.
- Role: analysis-only documentation correction; no implementation was authored.
- Tool: Node.js v24.21.0 running the repository's
  `scripts/prepare-bytematch-report.mjs` at the revision above.
- Method: validate the checked-in public report against the checked-in public
  source manifest and CSV inventories, then compare the unit's public manifest,
  partition, and report entries for consistency.
- Private-target statement: this corrective observation did not access a ROM,
  CRO binary, extracted asset, private target object, target disassembly, or
  Nintendo SDK material. The removed specifications were not used as evidence.

## Public inputs

- `config/cro-sources.json`
- `symbols/cro/DllFieldEventSlopeSlip.csv`
- `symbols/cro-partitions/DllFieldEventSlopeSlip.json`
- `progress/reports/AS_EUR_REV2/report.json`

## Verified public facts

The public CSV and source manifest contain one function claim,
`func_00000308`, with size 344 bytes. The public report records that function as
a 344-byte exact code match and records `metadata.complete` as `false`. The
public partition retains one 40-byte unknown range. The report lists 460 total
data bytes; this record makes no data-match or fully-linked claim.

## Additive quarantine status

The current tree removes the two prohibited exhaustive specifications together
with their derived source and dedicated validator. Their unit-specific inventory
and build integration changes are also absent from the current tree. Git history
was not rewritten. This revision makes no new implementation claim.
