# Contributing

Read [the clean-room protocol](docs/CLEAN_ROOM.md) before contributing. Keep analysis/specification and implementation roles separate when a contribution is described as clean-room work, and make provenance reviewable in every pull request.

## Local checks

```sh
npm run check:environment
npm run check
```

Install the pinned `objdiff-cli` build with `npm run tools:install`. Report generation remains disabled until the repository has a verified target/build layout and `progress/project.json` explicitly enables it.

Use focused commits. Do not commit generated build output or private inputs. The project uses `main` as its default branch.
