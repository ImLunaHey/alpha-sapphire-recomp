# DllPssCharaMenu clean-room blocker

## Decision

`cro/DllPssCharaMenu` remains incomplete. The public repository does not
contain admissible unit-specific evidence from which an implementation contract
can be written. This quarantine therefore removes the unsupported source and
publication claim without supplying an implementation or claiming progress.

This is an evidence limitation. It is not a claim that the removed source was
copied from proprietary material.

## Analysis provenance

- **Intended target:** Pokémon Alpha Sapphire, Europe, Revision 2
  (`AS_EUR_REV2`). This identifies the intended verification target only; the
  analysis did not observe or verify a target image, extracted target content,
  or target object.
- **Public repository audit revision:**
  `8fc7123e3bf9a8aa2d79107e058096ce6003d104`.
- **Audit date:** 2026-10-18.
- **Tools:** Git 2.53.0; Node.js 24.21.0; npm 11.19.0; Nix 2.31.3; Arm GNU
  Toolchain 14.2.Rel1 (GCC 14.2.1 and GNU assembler 2.43.1.20241119).
- **Method:** the analysis role reviewed the public clean-room policy, public
  repository tree and history, source registry, build metadata, publication
  metadata, and existing public unit documentation. It looked only for a
  documented provenance trail and an approved target-neutral behavioral
  contract. It did not infer behavior from source shape or publication data.
- **Observation:** the public repository contained a source and publication
  claim for this unit, but the audited materials did not provide independently
  recorded behavior or a documented analysis-to-implementation handoff capable
  of supporting that claim under
  [the clean-room protocol](../../CLEAN_ROOM.md).

No ROM, extracted asset, target object, disassembly, instruction encoding,
private path, proprietary header, or proprietary content was copied into the
repository or included in the handoff.

## Role separation and handoff limitation

The analysis role was responsible for deciding whether admissible evidence
could support a target-neutral specification. Because the public audit found no
such evidence, it handed the target-blind implementation role only the blocker
decision and the prohibition on deriving behavior. It did not hand over a
signature, layout, control flow, state model, side effect, or implementation
hint. The implementation role did not consult target material and made no
behavioral implementation.

The later review and corrective passes were limited to checking clean-room
provenance, publication consistency, and scope. They did not add behavioral
claims. Consequently there is no approved implementation specification to
publish from this work.

## Publication and future work

The unit remains represented by its pre-existing public neutral metadata and
incomplete status, but no source or progress claim is made by this quarantine.
The central publication-integrity gate and the existing shared-family gate are
authoritative for repository-wide identities, derived publication accounting,
source ownership, and shared semantics. No bespoke unit validator or lifecycle
wiring is maintained here.

Future work requires independently recorded observations for the intended
target, a reviewed target-neutral behavioral contract with full provenance,
and a distinct target-blind implementer working only from that approved
contract. Publication must then pass the central and shared-family gates.
