# ARM service-registry member assignment wrapper 106

Target: AS_EUR_REV2. Analysis date: 2026-10-17. Evidence consists solely of
the existing ignored private code image, authoritative target object, local
comparison report, neutral function inventory, and public source manifests.
This contribution combines analysis and implementation; it is reverse
engineering under the repository's clean-room-ready process, not a claim of
independent two-party clean-room implementation. No SDK, leaked source,
authored strings, assets, target pointer values, or target hashes are included.

The compact batch contains only `func_002AC050`, an ARM service-registry
wrapper within the assigned half-open entry range `[0x00200000,0x00300000)`.
It uses the same registry lookup and owned-member assignment interfaces
documented by IPC71, IPC86, and IPC87. No claim of a kernel IPC syscall is made.

The body is 48 bytes (twelve ARM instructions), followed by exactly one
four-byte literal reached by the load at +16. The following inventory global
is `func_002AC084` at +52. The pool is the previously established
`ipc_service_registry_owner_71` identity, physically equal to the IPC71 slot
at `func_0018BFC4` +64. It is an opaque relocation identity, never an embedded
target address. The lane adds one physical pool slot and no new identity.
There is no alignment gap, string, local branch, indirect transfer, or
unclaimed adjacent data in the owned extent.

The ordered semantic schedule is:

| Offset | Operation |
|---:|---|
| +0 | Save r4 and lr. |
| +4 | Retain the incoming source owner in r4. |
| +8 | Call the current service-registry index resolver `func_00171FC0`. |
| +12 | Pass the returned index in r2. |
| +16 | Load the opaque registry owner into r0 from the sole adjacent slot. |
| +20 | Select registry member four in r1. |
| +24 | Call the registry lookup `func_00171324`. |
| +28 | Load the selected object's member pointer at byte offset 48. |
| +32 | Pass the retained source owner in r1. |
| +36 | Restore r4 and the original lr. |
| +40 | Address the destination's owned member at byte offset 24. |
| +44 | Tail-transfer to deep-copy assignment helper `func_0017F4A4`. |

The three destinations are distinct aligned ARM primary entries, not Thumb
entries or secondary aliases. The exact relocation multiset is two
`R_ARM_CALL` at +8/+24, one `R_ARM_JUMP24` at +44, and one `R_ARM_ABS32` at
+48. All addends are zero. Restoring lr before the tail transfer preserves
the caller's return path and the deep-copy helper's result.

The standalone object must be ELF32 little-endian ARM ET_REL, EABI5, System
V, version one, with zero entry and no program headers. The only nonempty
allocated section is `.text.func_002AC050`, executable, four-byte aligned,
52 bytes. Its complete owned symbol set is a local section symbol, ARM
mapping `$a` at zero, data mapping `$d` at 48, and the global function at
zero with size 48. There are precisely four canonical undefined symbols for
the relocation identities, and ARMv6K/Thumb-1/VFPv2 attributes.

Acceptance requires the existing report entry to be an exact match, no other
source definition or manifest ownership overlap, exact inventory boundaries,
and authoritative object/body agreement. The validator links every symbolic
relocation against private evidence, then requires full byte equality for all
52 owned bytes against the private image; no displacement field is ignored.
The target object's complete body must independently equal those image bytes.

Duplicate auditing compares all ARM inventory bodies of the same size after
normalizing direct-transfer displacement fields; no duplicate is accepted.
Inbound auditing decodes direct ARM B/BL/BLX and Thumb B/conditional B/BL/BLX
throughout inventoried executable bodies and rejects any transfer into an
interior instruction or pool slot. An aligned whole-image pointer audit also
rejects interior targets. These are bounded static audits; they cannot prove
absence of dynamically computed entry addresses. Entry inbound counts are
reported rather than required to be nonzero, since registry dispatch may be
indirect. The function owns no bytes at or beyond the following global.

Standalone `--self-test` uses only synthetic public fixtures. Authoritative
validation requires private `--target` and `--code-bin` evidence. It caps files at 64 MiB, executable bytes
at 16 MiB, sections at 16,384, symbols at 1,000,000, and combined REL/RELA
entries at 1,000,000 before expanding tables. It rejects malformed ELF,
incorrect state/symbols/relocations, foreign payloads, changed pinned inputs,
target or pool mismatches, competing ownership, partially matched report entries,
duplicates, and hostile interior inbound targets. Each cap has an independent
self-test. Run the validator with `--self-test`, then `git diff --check`.
