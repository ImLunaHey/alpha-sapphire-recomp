# DllPssFavorite provenance quarantine

This implementation-side quarantine covers only `cro/DllPssFavorite` for
`AS_EUR_REV2`, based on public repository revision
`93666c030eb3c37f41a98666778ec7658ca4722c`. It follows the
[clean-room protocol](../../CLEAN_ROOM.md) and grants no behavioral or match
credit.

The public repository contains a shared byte-store batch note and a historical
source claim, but no unit-specific analysis record with independently observed
behavior, target revision, tool/version, date, uncertainty, specification
approval, and a distinct analyst-to-implementer handoff. The shared note and
neutral function boundary cannot establish that missing provenance. Repository
history establishes only that the claim existed; it is not behavioral evidence.

The unsupported source and its ownership entry are therefore quarantined by
deletion without replacement. The published report withdraws the sole matched
function and eight matched code bytes. The unit remains published with its
neutral manifest, inventory, partition, ten accepted function boundaries,
3,420 accepted code bytes, 1,684 data bytes, and `complete=false`, but it has
zero matched code, function, data, or completion credit. No behavior is inferred
for the removed claim or any other function.

Permitted inputs to this correction are the tracked public clean-room policy,
this blocker, `docs/specs/cro/store_leaves_02.md`, the source registry, manifest,
neutral CSV inventory, neutral partition, published report, project metadata,
package lifecycle, and validation scripts. Git, Node.js, npm, and ordinary
filesystem tools are used only to preserve and validate that public state. No
ROM/CRO/container content, extracted asset, proprietary or leaked source,
private path, disassembly, instruction schedule, target-derived implementation
aid, or target comparison is admitted.

The quarantine removes one function and eight bytes from the base totals,
leaving 4,257 matched functions and 416,740 matched code bytes globally. The
3,719,620-byte accepted-code denominator is unchanged. The aggregate matched
code percentage is 11.203833%, and the unit remains one of the exact 146
published report units (`main/code` plus all 145 manifest units).

Implementation may resume only after a separate analyst records a reviewable,
unit-specific, target-neutral behavioral specification with admissible
provenance and explicit uncertainties, and a distinct implementer works only
from that approved handoff. Any restored source ownership or match credit also
requires authorized independent verification. This blocker and its validator
are preservation controls, not implementation evidence.
