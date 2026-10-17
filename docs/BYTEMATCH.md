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

## Current verified progress

The 146 published units contain 4,042 exactly matched functions and 399,072
matched code bytes, or 10.728838% overall. `main/code` contributes 3,895
functions and 397,056 bytes. The CROs contribute 147 functions and 2,016
code bytes across 57 units; their matched-data total is zero. The other 88
CRO units currently receive no credit. Every CRO remains incomplete.

The latest verified wave added 50 main functions and 748 code bytes: duplicate
template batch 84 contributes 30 functions, 320 bytes, 80 ARM instructions,
and 30 `R_ARM_CALL` relocations; Thumb leaf/helper batch 27 contributes one
88-byte mixed Thumb/data/ARM function; and tail-adapter batch 138 contributes
19 functions, 340 bytes, 85 ARM instructions, and 18 `R_ARM_JUMP24`
relocations. The same wave added 146 CRO functions and 2,008 code bytes: 51
new byte-store leaves join the prior DllPhotoSaver leaf for 52 total, 29 POD
leaves contribute 548 bytes across 14 units, DllBattle contributes 45 leaf
accessors and 708 bytes, and DllField contributes 21 leaf accessors and 344
bytes.

## Executable units

The checked-in report publishes all 146 known executable link boundaries:
`main/code` and all 145 manifest-listed `cro/DllName` modules. The CRO report
units expose only validated neutral metadata and split-object structure.
Reviewed clean-room function sections now earn code credit in 57 CROs; all
unclaimed code, all CRO data, and all 88 zero-credit CROs remain unmatched.
Every CRO remains incomplete and no CRO receives completed-unit credit.

`main/code` represents the single linked `.code` executable in ExeFS. It must
not be split into arbitrary address ranges: the stripped image does not retain
original object-file boundaries.

The RomFS contains separately loadable CRO modules. Each CRO is a genuine unit
boundary and uses the stable name `cro/DllName`. Local target conversion and
clean-room builds place comparison objects at:

```text
build/AS_EUR_REV2/target/cro-split/DllName.o
build/AS_EUR_REV2/base/cro-split/DllName.o
```

Run `node scripts/generate-objdiff-config.mjs` to regenerate the ignored
`objdiff.json`. Local report generation does this automatically. A CRO is
included only when it belongs to the validated 145-entry public CRO manifest
and both paths are ignored regular ELF32 little-endian ARM relocatable objects.
The target must contain nonempty executable code, but it need not contain an
accepted function boundary. The base may be a valid empty or entirely
unmatched skeleton so a genuine unit can appear as not started; no placeholder
function is synthesized. Forty-four CROs currently have no independently
accepted function boundaries and therefore report zero functions, while still
appearing as genuine incomplete link units. Malformed, unpaired, symlinked,
unignored, or unknown objects are excluded with a warning. Units are sorted by
module name.

Run `node scripts/test-generate-objdiff-config.mjs` for the ROM-free gating and
ELF-parser regression suite.

Authored CRO credit is fail-closed. `config/cro-sources.json` lists every
reviewed source and claimed function; report preparation requires each claim
to match its public CSV boundary and receive exactly 100% objdiff credit. It
rejects credit on unclaimed functions, non-text sections, or CRO data.

The generator is deliberately conservative about `metadata.complete`. It is
`true` only when the complete target and base ELF objects are byte-identical;
all other pairs remain incomplete even if their current code score is 100%.
This prevents a partial function inventory or a code-only match from being
reported as a fully linked module.

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

