# DllPhotoViewer clean-room blocker

`cro/DllPhotoViewer` remains an incomplete link unit. The public report credits
one of its two accepted functions: 8 of 604 accepted code bytes, with no data
credit. `metadata.complete` must remain false.

## Scope and provenance

- Target revision: Pokémon Alpha Sapphire `AS_EUR_REV2`.
- Checked-in evidence: `symbols/cro/DllPhotoViewer.csv` and
  `progress/reports/AS_EUR_REV2/report.json`, as recorded at repository commit
  `11fd5dba4e818135af7d676aa6038738452be0f9`.
- Repository tooling: `scripts/prepare-bytematch-report.mjs` with
  `objdiff-cli v3.8.2`, the version pinned by `scripts/install-tools.sh`.
- Observation date: 2026-10-17.
- Classification: analysis-only status documentation based on the public
  inventory and report; no proprietary source, SDK material, target
  disassembly, extracted asset, or private verification path is included.

The remaining 596-byte accepted function lacks an approved, reviewable
clean-room contract in the cited checked-in evidence. The named checked-in
reporting tooling measures the existing comparison result; it does not supply
such a contract.

Further work requires an independently reviewed clean-room contract for that
function and complete accounting for the unit's data. Until then, no additional
implementation or progress credit is claimed.
