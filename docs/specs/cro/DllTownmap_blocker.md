# DllTownmap: evidence and implementation blocker

## Status and scope

**Disposition: documentation-only analysis; implementation blocked.** This is
an evidence-gap specification for `cro/DllTownmap`, not an approved behavioral
contract. The defensible change is this record. The evidence reviewed does not
justify changing implementation, adding a target-behavior test oracle, or
claiming matching or completion credit.

- Role: analyst only; no implementation or source edits.
- Observation date: 2026-10-17.
- Repository branch: `unit/cro-dll-townmap`.
- Repository baseline: `4f0ffaabc9d9da88b52910ba507cff17fe5d2351`.
- Declared target: Alpha Sapphire, Europe revision 2, as stated in
  `README.md`. No target revision or binary identity was independently verified.
- Method: local text inspection, filename discovery, and Git history metadata.
  Git 2.53.0, ripgrep 15.2.0, and Node.js v24.21.0 were used for repository
  queries; no target observation, execution, extraction, compilation, or
  comparison was performed.

## Allowed evidence and provenance

`docs/CLEAN_ROOM.md` was read fully before other task actions. Evidence used
here consists of repository policy, ordinary source text as a description of
the current checkout, build-command configuration, and path-scoped history
metadata. Source presence and matching claims are not independent proof of
behavior or lawful implementation provenance.

The exact existing files inspected, including partial reads and searches, were:

- `docs/CLEAN_ROOM.md`: full protocol and role separation.
- `src/cro/DllTownmap.c`: full current source, for checkout facts only.
- `README.md`: declared project/target identity and workflow conventions.
- `CONTRIBUTING.md`: contribution and validation conventions.
- `docs/specs/README.md`: reviewed-specification requirement.
- `docs/CRO_UNITS.md`: unit naming and distinction between publication and
  completion; numerical progress claims were not used as evidence.
- `docs/specs/cro/DllTestPGL_clean_room_status.md`: status-document convention
  and its warning against reusing quarantined analysis; its implementation and
  validation claims were not adopted as DllTownmap evidence.
- `package.json`: script configuration, including clean-check lifecycle hooks
  and a search for a Townmap-specific command.
- `config/sources.json`: searched only for the `DllTownmap` identifier.
- `.github/pull_request_template.md`: provenance and validation requirements.

Git history inspection was limited to subjects, dates, and commit identities;
no historical implementation diff or target-derived attachment was opened.
Filename listings were also used to discover local instructions and
Townmap-named source/specification/validation files. No applicable `AGENTS.md`
was found. No external public documentation was consulted or relied upon.
This review makes no claim that a public behavioral specification cannot exist.

## Observable and repository facts

1. The current `src/cro/DllTownmap.c` includes `<stdint.h>` and defines one
   function, `void func_0000C1E4(uint8_t *base, uint8_t value)`. Its body contains
   one assignment through a fixed byte subscript of `base`. There is no
   in-file explanation of the object's meaning, caller obligations, or the
   provenance of that subscript. These are observations of repository text,
   not observations of the target. The numeric symbol spelling is not treated
   as a verified target address.
2. Path-scoped source history reports one change:
   `7b14dec86f268f5fc974cfb4e36a8361fd31639f`, dated 2026-10-17, with subject
   `feat: match 196-function multi-unit wave`. That subject supplies no reviewed
   behavioral contract or independently recorded observation for this unit.
   It neither establishes nor disproves lawful provenance.
3. Filename discovery in `src/cro`, `docs/specs/cro`, and `scripts` found only
   `src/cro/DllTownmap.c` under the Townmap spellings searched. `package.json`
   contains no Townmap-specific script reference, and `config/sources.json`
   contains no `DllTownmap` reference. This does not establish whether generic
   tooling discovers the unit or whether some differently named test covers it.
4. Repository policy requires implementation from a reviewed specification
   with separate analyst/implementer roles. Unit publication is not evidence
   of implementation correctness or module completion.
5. `check:clean` has both pre- and post-lifecycle scripts and invokes numerous
   validators. It cannot be assumed to be a unit-only documentation check.
   No repository validation suite was run in this restricted analysis.

No target behavior was independently observed. No approved DllTownmap
behavioral requirement was established by the evidence inspected.

## Requirements

- Keep this contribution confined to this specification. Do not alter source,
  build metadata, tests, unit partitions, reporting, or credit from this record.
- Do not promote the current byte store, its subscript, its parameter types,
  or its symbol spelling into a target requirement solely because they occur
  in source. Do not infer town-map UI behavior from the module's name.
- Before implementation, obtain a separately reviewed neutral contract with
  lawful provenance. It must establish the relevant interface, valid object
  extent and lifetime, input domain, observable effects and unaffected state,
  return behavior, and any actual error or boundary behavior. Unknown cases
  must remain explicit rather than receive invented defaults.
- Record the evidence's origin, date, tools/versions, and target revision if
  applicable, without embedding target bytes, instruction sequences, or
  implementation recipes. Assign a distinct implementer after review.
- Resolve the existing source's provenance before relying on it as accepted
  clean-room implementation. Apply the protocol's stop/quarantine procedure
  if review establishes unclear or suspect contribution provenance; this
  specification neither clears that source nor removes it.

## Assumptions and limits

The unit label identifies only the requested review scope. No map selection,
navigation, rendering, resource ownership, data layout, bounds checks, null
handling, ABI details, or module completeness is assumed. The existing source
could be internally consistent while still lacking a justified target contract.
A test that merely repeats its assignment would check that source against
itself and would not close the evidence gap. This analysis does not certify
the source's authorship or make an allegation of prohibited copying.

## Acceptance checks

For this documentation contribution:

- Only `docs/specs/cro/DllTownmap_blocker.md` changes; a documentation-only
  commit or pull request is permitted. Source, test, build, report, metadata,
  and credit changes remain prohibited.
- Review confirms the separation of repository observations, requirements,
  assumptions, and unresolved evidence. No behavioral or matching claim is
  added, and no private material is reproduced.
- Check the new document for whitespace errors and verify the working-tree
  change scope. No target access is needed for either check.

For a future implementation proposal, acceptance remains blocked until an
independent reviewer approves the missing contract and its provenance. Tests
must derive expected results from that approved evidence and use synthetic
fixtures where possible; passing tests of the present source alone is
insufficient. Null or short-buffer tests require an actual specified contract.
No target-facing acceptance check is authorized or performed by this task.
The protocol's required pre-commit check was run and passed for this committed
documentation contribution. It does not establish target behavior or authorize
target-facing validation.

## Blockers and reviewer disposition

The reviewed evidence supplies no independently established DllTownmap
behavioral contract, no reviewed justification for the current object access,
and no unit-specific provenance chain from observation to implementation.
General platform or C documentation could explain a byte store but would not
establish its intended role in this module. A repository history matching claim
does not fill those gaps.

**Recommendation:** accept this as a documentation-only blocker record; keep
implementation and target-behavior test changes blocked pending evidence and
separate review. Do not award new credit or alter existing credit on the basis
of this analysis. Provenance review of any existing credit is a separate task.

Deliberately not consulted: ROMs or `ROM_PATH` values; extracted assets or
modules; generated target objects; `progress/` or report contents; private
target bytes; disassembly; Ghidra output or scripts; proprietary SDK material;
leaked material; symbol/contract tables or other target-derived implementation
aids. No extraction, bytematch, objdiff, target build, environment check, or
target-dependent validator was run.
