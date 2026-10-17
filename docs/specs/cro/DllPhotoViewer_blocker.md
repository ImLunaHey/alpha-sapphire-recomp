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

The credited function is a small byte-field setter already covered by the
repository's shared CRO validation. The other accepted function performs
object setup through external services and module resources. Available neutral
evidence does not provide a reviewable clean-room contract for all of those
interfaces, dependencies, or the remaining code and data.

There is also a tooling boundary: calls in the verified target representation
and unresolved calls emitted by the current clean-room build are represented
differently. The existing strict comparison therefore cannot establish a
byte-identical match for a new high-level implementation merely from equivalent
observable behavior.

Further work requires independently reviewed interface contracts and a
deterministic link/comparison representation that preserves byte identity.
Until then, no additional implementation or progress credit is claimed.
