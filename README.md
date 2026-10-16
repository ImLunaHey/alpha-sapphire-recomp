# Pokémon Alpha Sapphire matching decompilation

Clean-room-ready matching decompilation project for Pokémon Alpha Sapphire (European revision 2). A conservative executable function inventory is available; the repository contains no game data.

## Current status

- Default branch: `main`
- Target: Europe, revision 2
- Decompilation: 10,440 evidence-gated function bodies inventoried; 2,262 clean-room functions matched
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

The analysis database, generated assembly, target ELF, `objdiff.json`, and report remain ignored local outputs. The committed CSV contains only conservative address, size, and instruction-mode metadata; every boundary remains provisional until confirmed during matching.

## Repository layout

```text
docs/           Policy, provenance, and integration notes
progress/       Public reporting metadata
scripts/        Safety and project automation
symbols/        Neutral, provisional function-boundary metadata
tools/          Original analysis scripts (no game data)
```

The target identifies CTR SDK 7.1.1.200 and strongly indicates an ARMCC 4.1-family compiler. See [the toolchain fingerprint](docs/TOOLCHAIN.md) for the provisional compiler matrix and acceptance rule.

## Progress reporting

The eventual build will generate `build/AS_EUR_REV2/report.json` with `objdiff-cli`. CI will upload it as the `AS_EUR_REV2_report` artifact expected by ByteMatch. See [the ByteMatch integration notes](docs/BYTEMATCH.md).

This project is an independent preservation and research effort. Pokémon and related names are trademarks of their respective owners; no endorsement is implied.

