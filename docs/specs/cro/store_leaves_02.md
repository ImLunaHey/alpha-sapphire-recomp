# CRO byte-store leaves 02

This batch applies one reviewed ARM leaf contract to 51 CRO units. Each
function stores its byte-valued second argument at offset 217 from the base
pointer and returns. Every leaf is eight bytes, has its own accepted public
boundary, and contains no relocation. DllPhotoSaver was credited previously;
the current wave adds the other 50 functions and 400 code bytes, bringing the
family to 51 functions and 408 bytes. The quarantined `DllGift` claim is
excluded and must remain absent.

Validation requires a distinct clean-room C source for each unit, exact source
semantics, disjoint source ownership, the accepted inventory boundary, and one
correctly sized executable section per claim. Unclaimed CRO code and all CRO
data remain unmatched, and no participating unit is complete.
