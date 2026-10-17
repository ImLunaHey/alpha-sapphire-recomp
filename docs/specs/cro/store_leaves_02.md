# CRO byte-store leaves 02

This batch applies one reviewed ARM leaf contract to 49 CRO units. Each
function stores its byte-valued second argument at offset 217 from the base
pointer and returns. Every leaf is eight bytes, has its own accepted public
boundary, and contains no relocation. DllPhotoSaver was credited previously;
the current wave adds the other 48 functions and 384 code bytes, bringing the
family to 49 functions and 392 bytes. The quarantined `DllGift`,
`DllHologramMail`, and `DllPssMessageWindow` claims are excluded and must remain
absent.

Validation requires a distinct clean-room C source for each unit, exact source
semantics, disjoint source ownership, the accepted inventory boundary, and one
correctly sized executable section per claim. Unclaimed CRO code and all CRO
data remain unmatched, and no participating unit is complete.

DllHologramMail is withdrawn from this family under CLEAN_ROOM because its
independent provenance is insufficient. Its source, ownership claim, and match
credit are removed; neutral inventory remains. This shared document supplies
no approved behavioral contract for that unit. It stays blocked and incomplete;
see [the analysis-only provenance audit](DllHologramMail_blocker.md).

DllPssMessageWindow is also withdrawn from this family under CLEAN_ROOM because
its independent provenance is insufficient. Its source, ownership claim, and
match credit are removed; neutral inventory remains. This shared document
supplies no approved behavioral contract for that unit. It stays blocked and
incomplete; see [the provenance blocker](DllPssMessageWindow_blocker.md).
