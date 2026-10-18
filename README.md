# Pokémon Alpha Sapphire matching decompilation

Clean-room-ready matching decompilation project for Pokémon Alpha Sapphire (European revision 2). A conservative executable function inventory is available; the repository contains no game data.

## Current status

- Default branch: `main`
- Target: Europe, revision 2
- Decompilation: evidence-gated inventories and reviewed clean-room implementations are published; unsupported DllGift, DllHologramMail, DllPssMessageWindow, and DllPCMenu credit is withdrawn
- ByteMatch: genuine local report available; registration deferred until reproducible CI reporting exists
- Proprietary input: configured locally and excluded from Git

## Before any reverse engineering

Read [the clean-room protocol](docs/CLEAN_ROOM.md). Contributors must use their own lawfully obtained copy of the game. Do not submit ROMs, extracted proprietary assets, leaked source, SDK files, keys, or credentials.

Copy `.env.example` to `.env.local` and set `ROM_PATH` to a file outside this repository. The environment check only verifies that it exists and remains outside the checkout:

```sh
npm run check:environment
npm run check:clean
```

Extraction writes only to `DECOMP_PRIVATE`, which must be outside the checkout. Install the local extraction tool, verify the owned target, and extract its executable data with:

```sh
npm run tools:install-3ds
npm run target:verify
npm run target:extract
npm run target:analyze
npm run target:build
npm run report:local
```

### Pre-extracted inputs

A dump made from an installable title rather than the cartridge image has a different container and ExHeader, but the same executable and modules. Such contributors can leave `ROM_PATH` unset and place their own decrypted inputs directly in `DECOMP_PRIVATE`:

```text
$DECOMP_PRIVATE/code.bin             decompressed ExeFS .code
$DECOMP_PRIVATE/cro-modules/Dll*.cro the 145 root RomFS modules
```

`target:verify` then checks `code.bin` against `config/targets/AS_EUR_REV2.json` and every CRO against `progress/units/AS_EUR_REV2.cro.json`, rejecting missing, extra, or mismatched files. The container and ExHeader are not checked in this mode, and `tools:install-3ds` and `target:extract` are not needed:

```sh
npm run check:environment
npm run target:verify
npm run target:build
npm run report:local
```

The analysis database, generated assembly, target ELF, `objdiff.json`, and report remain ignored local outputs. The committed CSV contains only conservative address, size, and instruction-mode metadata; every boundary remains provisional until confirmed during matching.

## Testing

`npm run check` uses Turbo to build the clean-room objects and then runs both object and repository validators as real Vitest tests across four worker processes by default. `npm run ci` extends that graph through the CRO tooling tests and validated ByteMatch report. Main and CRO compilation use bounded worker queues, and Turbo caches their declared outputs in `.turbo/cache`; set `BASE_BUILD_CONCURRENCY` or `REPOSITORY_CHECK_CONCURRENCY` to tune either pool. Focused `validate:*` scripts remain available for individual checks, while `npm run check:legacy` preserves the serial source-validator manifest.

## Repository layout

```text
docs/           Policy, provenance, and integration notes
progress/       Public reporting metadata
scripts/        Safety and project automation
symbols/        Neutral, provisional function-boundary metadata
tools/          Original analysis scripts (no game data)
```

The target identifies CTR SDK 7.1.1.200 and strongly indicates an ARMCC 4.1-family compiler. See [the toolchain fingerprint](docs/TOOLCHAIN.md) for the provisional compiler matrix and acceptance rule.

For the shortest path from matching functions to executing repository-built
code, see the [first loadable CRO milestone](docs/LOADABLE_CRO_MILESTONE.md).

## Progress reporting

The eventual build will generate `build/AS_EUR_REV2/report.json` with `objdiff-cli`. CI will upload it as the `AS_EUR_REV2_report` artifact expected by ByteMatch. See [the ByteMatch integration notes](docs/BYTEMATCH.md).

This project is an independent preservation and research effort. Pokémon and related names are trademarks of their respective owners; no endorsement is implied.

