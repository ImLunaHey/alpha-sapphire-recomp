# DllSangoIntro: behavioral evidence blocker

Status: blocked; analysis/review only. This document does not approve an implementation or establish full-link progress.

## Provenance and scope

Supplied earlier-audit statements: the earlier review records inspection on 2026-10-17 at repository revision `958a071f78d3bb0c66d07de554f109f80805020f`. Git 2.53.0 is the only documented exact tool version for that audit; other tool versions are undocumented. “Repository text/JSON inspection” describes an inspection method, not a tool/version. The fresh review below does not infer or retroactively supply missing earlier-audit tool versions. The policy sources are [CLEAN_ROOM.md](../../CLEAN_ROOM.md) and the [specification requirements](../README.md). That review describes its admissible evidence as committed unit source, source-history metadata, documentation reference searches, and source-publication registration. It reports no observed or verified target revision and no target execution observations.

The preceding documentation-only review on 2026-10-17 is reported as limited to this blocker, CLEAN_ROOM.md, docs/specs/README.md, and [PROVENANCE.md](../../PROVENANCE.md), but it did not preserve an exact tool/version record. It is therefore superseded by, and not relied upon in place of, the fresh independent review below. PROVENANCE.md declares the project target as `AS_EUR_REV2` and records earlier target inspection. That declaration does not establish observed behavior for DllSangoIntro.

Earlier review limitation: inspection of the publication entry accidentally exposed restricted function metadata embedded in that entry. Those details are excluded from this document and its reasoning. That earlier review must not be represented as an unexposed clean-room handoff; any later implementation specification requires an independently unexposed reviewer.

### Fresh independent documentation-only review: tool/version record

This fresh independent review on 2026-10-17 resolves only the documentation tool/version gap. Its file access is limited to docs/CLEAN_ROOM.md, docs/specs/README.md, docs/PROVENANCE.md, and this blocker; only this blocker is edited. The supplied earlier-audit statements and the superseded documentation-only review are not independently reverified.

The following version commands were run before reading the four documents. These are the exact version-identifying output lines observed in this environment (license and other non-version text omitted):

```text
$ sed --version
sed (GNU sed) 4.9

$ bash --version
GNU bash, version 5.3.9(1)-release (x86_64-pc-linux-gnu)

$ node --version
v24.21.0
```

GNU sed reads the four authorized documents and the edited blocker; Node.js edits this blocker; GNU Bash launches the commands. These are the command-line tools used by this fresh review. Git and ripgrep are not used. These measured versions apply only to this fresh documentation-only review, not to either preceding review.

This operative documentation-only review adds no behavioral evidence, target-derived details, or implementation approval. The earlier audit remains quarantined as described above.

## Evidence and decision

The following findings are carried forward from the earlier review; they are not new observations from the documentation-only review.

- [The committed source](../../../src/cro/DllSangoIntro.c) contains a narrow low-level operation, without a provenance-bearing explanation of its role in the unit. Existing code is not independent evidence that its behavior is correct or sufficient.
- Source history traces its introduction to commit `7b14dec`, together with the publication registration. The commit message makes a batch matching claim but supplies no unit-specific behavioral observations or public contract. The reviewed source history contains no subsequent unit change establishing such a contract.
- [The publication configuration](../../../config/cro-sources.json) registers `src/cro/DllSangoIntro.c` under `DllSangoIntro`. This establishes source registration only; it does not establish a complete unit implementation or successful full link.
- Committed documentation searches found no explicit `DllSangoIntro` reference. No independently documented unit contract was identified in the reviewed evidence. General language or platform contracts cannot establish this unit's application behavior.

Admissible evidence does not support a genuine new implementation step or a claim of full-link progress. Stop implementation work pending a reviewed behavioral specification. Do not infer behavior from the unit name, existing low-level source choices, matching claims, or publication metadata.

## Required evidence and implementer boundary

A future specification needs independently sourced descriptions of the unit's externally observable responsibilities, inputs and outputs, lifecycle, side effects, dependencies, and completion or failure behavior. Record public-document provenance, or independently collected observations with the target revision, observation method and tool version, conditions, and date. Any interface facts necessary for linking also need admissible provenance.

A strictly target-blind implementer may rely on the repository's clean-room policy and the fact that this unit and source path are registered. This blocker supplies no approved functional contract, memory layout, ABI prescription, or implementation recipe. Keep implementation and publication changes pending that evidence and independent review.
