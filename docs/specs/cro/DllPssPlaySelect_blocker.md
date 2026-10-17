# DllPssPlaySelect analysis/specification blocker

**Blocked: this document is not an approved behavioral specification and does
not authorize implementation or match credit.** A documentation-only blocker
is useful here because public feature documentation exists, but an admissible
connection to this unit and its interface has not been established.

## Scope and provenance

- Role: analysis/specification only for `cro/DllPssPlaySelect`.
- Date: 2026-10-17.
- Repository baseline: `0f5478258fc8300da50b94eafa9ac8a9aca0e02a` (a Git
  revision, not a target fingerprint).
- Target context: Pokémon Alpha Sapphire, Europe, revision 2,
  `AS_EUR_REV2`, as already stated in the repository README and
  [target provenance](../../PROVENANCE.md). This audit did not independently
  verify the target or establish revision-specific behavior.
- Tools: Git 2.53.0, ripgrep 15.2.0, shell text inspection, and web
  search/open of public Nintendo documentation. No game execution or target
  comparison was performed.

The complete [clean-room protocol](../../CLEAN_ROOM.md) was read before unit
work. Repository evidence reviewed comprised `README.md`, `CONTRIBUTING.md`,
`docs/specs/README.md`, `docs/PROVENANCE.md`, `docs/CRO_UNITS.md`,
`docs/CRO_TARGET_OBJECTS.md`, `docs/CRO_TARGET_BATCH.md`, and
`docs/BYTEMATCH.md`; tracked specification filenames; searches for the unit
identifier and PSS documentation; and relevant Git history. Existing blocker
notes supplied documentation conventions only. Their structural figures and
other target-derived facts are not evidence for this unit's behavior.

The existing `src/cro/DllPssPlaySelect.c` was inspected solely as a provenance
audit. Its history identifies its introduction in commit
`7b14dec86f268f5fc974cfb4e36a8361fd31639f`, whose message states a multi-unit
matching claim. The audit found no reviewed neutral specification connecting
that fragment to independently documented behavior. Its declaration and body
are not admitted as interface or behavioral evidence and are deliberately not
reproduced here. This document neither validates nor renews historical claims,
and makes no determination that the existing source was copied.

No ROM, CRO, extracted asset, proprietary SDK/source, disassembly, target
bytes, ignored verification input, or private artifact path was accessed.
No behavior was inferred from module/function names, structural metadata,
fingerprints, neighboring implementations, or similarity. The analyst has
seen legacy implementation content and must remain in the analysis role;
the implementation participant should receive only reviewed neutral material.

## Public documentation and its limits

Public sources consulted on 2026-10-17:

1. [Nintendo UK: Pokémon Alpha Sapphire](https://www.nintendo.com/en-gb/Games/Nintendo-3DS-games/Pokemon-Alpha-Sapphire-894321.html).
   The publisher describes battling through the Player Search System and
   battling/trading through local or online communication. These are general
   product features, not a module contract or a statement of present service
   availability.
2. [Nintendo: Alpha Sapphire electronic manual, Dutch](https://www.nintendo.com/eu/media/downloads/games_8/emanuals/nintendo_3ds_2/pok_mon_alpha_sapphire/ElectronicManual_Nintendo3DS_PokemonAlphaSapphire_NL.pdf),
   sections 15 and 16, using public search-index excerpts in the original
   analysis. Review did not independently reproduce those excerpts; their
   substantive claims are not needed for this conclusion.
3. [Nintendo: Alpha Sapphire electronic manual, English](https://www.nintendo.com/eu/media/downloads/games_8/emanuals/nintendo_3ds_2/pok_mon_alpha_sapphire/ElectronicManual_Nintendo3DS_PokemonAlphaSapphire_EN.pdf),
   reached through the UK product page's Manual link. Its extracted text was
   not legible in the web reader; no substantive behavior claim here relies
   on that extraction or on an uninspected screenshot.
4. [Nintendo-hosted Alpha Sapphire English manual](https://csassets.nintendo.com/noaext/image/private/t_KA_PDF/manual-3DS-pokemon-alpha-sapphire-version-en?_a=DATAg1AAZAA0),
   independently opened during review. Its readable text in section 15
   (PDF page 29) describes selecting a displayed player to see ways of playing
   together. Section 16 (PDF page 32) describes opening the PSS menu and lists
   return, next-screen, and feature-icon controls. This is public user-facing
   documentation, not an observation of the scoped unit or evidence specific
   to European revision 2. The URL is a publicly accessible Nintendo document,
   not a local/private verification artifact.

Exact-name public searches for `DllPssPlaySelect`, including documentation,
interface, and specification variants, produced no attributable unit
contract. Repository documentation searches and unit-specific specification
history likewise yielded no approved handoff. These are bounded search
results, not proof that no public evidence could ever exist. Search results
for community guides and other games were not used as implementation evidence.

The admitted Nintendo documentation supports high-level PSS interactions. It
does not name this unit or assign any of those interactions to it. A name
resemblance cannot bridge that gap. General container/build documentation
also cannot establish application semantics. None of the admitted evidence
supplies a unit entry interface, input/output domains, side effects, state
transitions, ownership/lifetime rules, dependency contracts, or
failure/cancellation behavior. There were no independent runtime observations
in this audit.

## Independent review and limits

Review on 2026-10-17 read the complete clean-room protocol first, verified the
repository baseline and source-introduction commit metadata, and searched
Markdown documentation by the exact unit identifier and by PSS terminology.
The exact identifier occurred only in this blocker; no existing specification
handoff was located. Other PSS references were not treated as evidence for this
unit. The reviewer did not inspect legacy implementation contents or historical
implementation diffs. Repository inventory and report accounting establish
scope or progress only and do not supply behavioral requirements.

Review independently repeated exact-name public searches and followed the
product page's English Manual link. The additional readable Nintendo manual
above closes the text-access gap for the high-level feature descriptions; it
does not close the unit-attribution or interface gap. These checks support a
current evidence blocker, not a claim that every possible safe public or
observational avenue has been exhausted. Further attributable public evidence
or authorized independent observations could support a new analysis and
separate specification review. No such unit-specific evidence is supplied by
this change, and no target execution or comparison was performed in review.

Decision: approve this document as a bounded evidence blocker only. No
behavioral specification is approved for an implementation participant.

## Requirements for a future implementation handoff

Implementation remains blocked until a separately reviewed neutral
specification establishes all of the following from admissible evidence:

1. An independently supported relationship between the scoped unit and the
   externally observable behavior being specified. Public feature descriptions
   alone do not establish that relationship.
2. The interface needed by a caller, including inputs, outputs, valid states,
   ownership and lifetime, and dependency assumptions, expressed as reviewed
   neutral interface facts without target bytes, disassembly, or instruction
   reconstruction.
3. Testable normal behavior and applicable boundary, cancellation, and failure
   behavior, distinguishing directly supported facts from unresolved questions.
   Unobserved cases must remain unspecified rather than be guessed.
4. Provenance for each requirement: attributable public documentation or
   authorized independent observations, with the applicable revision,
   conditions, observation tool/version, and date. The public manuals have
   not been established as revision-2-specific evidence.

A distinct implementation participant may then write original code using only
the approved specification. Do not supply that participant with legacy source,
historical implementation diffs, or this analyst's low-level source observations.
Inventories and target-derived ledgers cannot substitute for behavioral
evidence. Any subsequent target verification must remain separate from
implementation and must not expose target bytes, disassembly, private
artifacts, or unreviewed target-derived facts to the implementation participant.
New admissible neutral observations require analysis and specification review
before they can enter an implementation handoff.

This change supplies only an evidence blocker. It changes no implementation,
build metadata, validation scripts, generated objects, or publication claims,
and does not assert completion of the unit. No commit is part of this audit.
