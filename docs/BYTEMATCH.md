# ByteMatch integration

ByteMatch tracks matching decompilation progress from `objdiff` reports. The public service expects a GitHub repository and successful workflow runs on its default branch.

## Planned contract

- Default branch: `main`
- Version identifier: `AS_EUR_REV2`
- Report path: `build/AS_EUR_REV2/report.json`
- Artifact name: `AS_EUR_REV2_report`
- Artifact pattern: `^(?<version>.+)_report$`
- Report generator: `objdiff-cli report generate -p . -o build/AS_EUR_REV2/report.json`

The workflow remains in setup mode until the target/build layout and `objdiff.json` can be generated honestly. It must never upload a fabricated zero-progress report.

## Registration checklist (later)

1. Push the repository with `main` set as its GitHub default branch.
2. Enable progress generation in `progress/project.json` only after a reproducible build and valid `objdiff.json` exist.
3. Confirm a successful `push` workflow on `main` uploads `AS_EUR_REV2_report`.
4. Sign in to ByteMatch with GitHub and add the repository from **Manage → Add project**.
5. Install the ByteMatch GitHub App for prompt artifact ingestion and pull-request comparison comments.
6. Set platform to Nintendo 3DS, the default version to `AS_EUR_REV2`, and the default branch to `main`.

ByteMatch polls successful default-branch push artifacts; pull-request artifacts are used for PR comparisons rather than history. Registration should wait until the first genuine report is ready.

Sources: [ByteMatch getting started](https://bytematch.dev/docs/getting-started) and [objdiff configuration](https://github.com/encounter/objdiff#configuration).

