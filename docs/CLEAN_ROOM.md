# Clean-room protocol

## Boundary

This repository may contain only independently written source, build metadata, public documentation, and facts necessary for interoperability. It must not contain or redistribute the game image, extracted game assets, Nintendo SDK material, leaked source code, encryption keys, credentials, or other third-party proprietary files.

The target game image is an external verification input. It stays outside the checkout and is referenced only through the ignored `ROM_PATH` setting. Generated extraction and build directories are ignored.

## Roles and evidence

A strict clean-room contribution separates two activities:

1. **Analysis** records externally observable behavior and neutral interface facts in a written specification. It must include provenance: target revision, tool/version, observations, and date.
2. **Implementation** writes original code from an approved specification without consulting disassembly, leaked code, or proprietary SDK headers.

One person doing both is reverse engineering, but is not a strict two-party clean-room implementation. Such work must not be labelled clean-room. Until distinct reviewers/implementers are assigned, this repository describes its *process* as clean-room-ready and its current code status as infrastructure-only.

Specifications belong under `docs/specs/`; implementation provenance belongs in the pull request or commit message. Facts derived from public platform documentation must link to their source. Never paste disassembly or large binary-derived tables into issues or specifications.

## Contribution checklist

- Confirm the work was not copied from leaked or proprietary source.
- Identify whether the contribution is analysis, specification, or implementation.
- Record public sources and independently observed behavior.
- Keep target binaries and extracted assets outside Git.
- Run `npm run check:clean` before every commit.
- Review generated reports for paths or strings that could disclose local/private data.

## Stop conditions

Stop and quarantine a contribution if its provenance is unclear, if it resembles leaked source, or if it introduces proprietary files. Do not rewrite or “clean up” suspect material in place; remove it from the working tree and document the incident without reproducing the content.

