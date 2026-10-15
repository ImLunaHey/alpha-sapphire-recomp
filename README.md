# Pokémon Alpha Sapphire matching decompilation

Clean-room, infrastructure-first matching decompilation project for Pokémon Alpha Sapphire (European revision 2). The repository is currently in the **setup** phase: it contains no game data and no reverse-engineered implementation.

## Current status

- Default branch: `main`
- Target: Europe, revision 2
- Decompilation: not started
- ByteMatch: reporting scaffolded, registration deferred until reports exist
- Proprietary input: configured locally and excluded from Git

## Before any reverse engineering

Read [the clean-room protocol](docs/CLEAN_ROOM.md). Contributors must use their own lawfully obtained copy of the game. Do not submit ROMs, extracted proprietary assets, leaked source, SDK files, keys, or credentials.

Copy `.env.example` to `.env.local` and set `ROM_PATH` to a file outside this repository. The environment check only verifies that it exists and remains outside the checkout:

```sh
npm run check:environment
npm run check:clean
```

No setup command copies, extracts, hashes, or analyzes the game image. Those steps remain deliberately disabled until the project owner authorizes the decompilation phase.

## Repository layout

```text
docs/           Policy, provenance, and integration notes
progress/       Public reporting metadata
scripts/        Safety and project automation
```

## Progress reporting

The eventual build will generate `build/AS_EUR_REV2/report.json` with `objdiff-cli`. CI will upload it as the `AS_EUR_REV2_report` artifact expected by ByteMatch. See [the ByteMatch integration notes](docs/BYTEMATCH.md).

This project is an independent preservation and research effort. Pokémon and related names are trademarks of their respective owners; no endorsement is implied.

