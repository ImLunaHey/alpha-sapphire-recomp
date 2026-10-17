# ByteMatch integration

ByteMatch tracks matching decompilation progress from `objdiff` reports. The public service expects a GitHub repository and successful workflow runs on its default branch.

## Published contract

- Default branch: `main`
- Version identifier: `AS_EUR_REV2`
- Tracked metadata snapshot: `progress/reports/AS_EUR_REV2/report.json`
- Workflow report path: `build/AS_EUR_REV2/report.json`
- Artifact name: `AS_EUR_REV2_report`
- Artifact pattern: `^(?<version>.+)_report$`
- Report generator: `objdiff-cli report generate -p . -o build/AS_EUR_REV2/report.json`

The tracked snapshot is a genuine `objdiff-cli` report generated locally from the verified target and clean-room base objects. It contains names, sizes, addresses, and match measures only; target objects, ROM bytes, extracted assets, and local paths remain ignored. CI validates the snapshot against `progress/project.json`, rebuilds all clean-room base objects, and uploads the report without requiring proprietary inputs.

After a locally verified decompilation update, refresh the snapshot with:

```sh
npm run report:local
npm run report:update
```

`npm run report:update` refuses reports whose totals disagree with the public progress metadata or whose function inventory contains unexpected metadata.

## Registration checklist

1. Push the repository with `main` set as its GitHub default branch.
2. Confirm a successful `push` workflow on `main` uploads `AS_EUR_REV2_report`.
3. Sign in to ByteMatch with GitHub and add the repository from **Manage → Add project**.
4. Install the ByteMatch GitHub App for prompt artifact ingestion and pull-request comparison comments.
5. Set platform to Nintendo 3DS, the default version to `AS_EUR_REV2`, and the default branch to `main`.

ByteMatch records successful default-branch push artifacts; pull-request artifacts are used for PR comparisons rather than history.

Sources: [ByteMatch getting started](https://bytematch.dev/docs/getting-started) and [objdiff configuration](https://github.com/encounter/objdiff#configuration).

