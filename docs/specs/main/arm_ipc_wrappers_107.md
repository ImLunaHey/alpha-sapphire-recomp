# ARM service handle-lifecycle wrapper 107

Target: `AS_EUR_REV2`. Analysis date: 2026-10-17. Evidence is limited to the
existing ignored private executable, authoritative target object, local objdiff
report, neutral inventory, and public source/ownership manifests. This lane
combines analysis with implementation and is reverse engineering under the
repository's clean-room-ready process; it does not claim separate clean-room
roles. No SDK, leaked source, target-authored strings, assets, proprietary
pointer values, target hashes, or raw instruction tables are included.

## Accepted extent and selection

`func_003AC2A0` is an ARM handle-lifecycle service wrapper in the assigned
half-open entry range `[0x00300000,0x00400000)`. Its authoritative body is
332 bytes, or 83 instructions. The sole four-byte adjacent slot begins at
+332; the next inventory global is `func_003AC3F0` at +336. A PC-relative load
at +8 reaches precisely that slot. All 336 bytes are accounted for, with no
alignment gap, authored material, or ambiguous adjacent data. The dispatch
identity's target data is evidence only and is not owned or copied by this
lane. No claim of a synchronous IPC send is made.

Selection independently excludes both source-owned entries and report entries
with any nonzero match percentage. Among unmatched supervisor-call candidates,
this routine has a complete single-slot extent and bounded control flow.
`func_003AD098` is excluded because its two referenced adjacent words do not
account for the entire 564-byte gap to the next inventory global.
`func_003C5344` is a floating-point processing routine rather than a service
wrapper. This batch deliberately accepts one defensible extent.

## Ordered behavior

The incoming r0 points to a service object. Save r4-r6 and lr, retain that
object in r4, load its dispatch identity, initialize r5 to zero, and install
the identity at object offset zero. Each handle step below loads its handle,
compares it with zero, skips the supervisor call and store when zero, otherwise
performs supervisor operation 35 with that handle in r0 and clears the slot.
The routine does not condition clearing on the returned status.

| Instruction offsets | Ordered effect |
|---:|---|
| +0..+20 | Establish saved state, zero, first handle address, and dispatch identity. |
| +24..+40 | Process handle at object +48. |
| +44..+64 | Process handle at object +52. |
| +68..+88 | Process handle at object +56. |
| +92..+112 | Process handle at object +60. |
| +116..+136 | Process handle at object +64. |
| +140..+160 | Process handle at object +68. |
| +164..+184 | Process handle at object +72. |
| +188..+196 | Store all-one bits at object +96 and advance r4 to object +72. |
| +200..+216 | Pre-decrement r4 by four and process object +68. |
| +220..+236 | Pre-decrement and process object +64. |
| +240..+256 | Pre-decrement and process object +60. |
| +260..+276 | Pre-decrement and process object +56. |
| +280..+296 | Pre-decrement and process object +52. |
| +300..+316 | Pre-decrement and process object +48. |
| +320..+328 | Recover the original object in r0, restore saved state and lr, tail-transfer to `func_003A7EE8`. |

There are thirteen equal-condition local branches at +32, +56, +80, +104,
+128, +152, +176, +208, +228, +248, +268, +288, and +308. Each targets its
own offset plus twelve. The thirteen supervisor-call sites are +36, +60,
+84, +108, +132, +156, +180, +212, +232, +252, +272, +292, and +312. All
are unconditional operation 35. There is no indirect call or local return;
the tail helper receives the caller's restored return address.

## Relocation and identity contract

Emit exactly two REL records, each with logical addend zero:

| Offset | Type | Identity |
|---:|---|---|
| +328 | `R_ARM_JUMP24` | `func_003A7EE8`, an aligned ARM primary inventory entry. |
| +332 | `R_ARM_ABS32` | `service_handle_owner_dispatch_107`, a new opaque dispatch-data identity. |

The pool word is nonzero, four-byte aligned, inside the private image, and
outside inventoried executable bodies. Its first dispatch slot holds the
accepted routine's exact ARM entry. This independent structural witness
rejects arbitrary pool substitutions. Its value differs from every physical
literal slot recorded by other public function manifests. The lane introduces
one physical pool slot and one new class; it has no secondary entry or shared
branch identity. The zero-addend branch placeholder and data word are checked
before private relocation. The validator links both records and compares all
336 owned bytes exactly with the private image. The authoritative target
object's entire 332-byte body must separately equal that image body, including
all branch fields. No instruction bits are ignored during acceptance.

## Object contract

Require ELF32 little-endian ARM `ET_REL`, System V, version one, exactly EABI5,
zero entry, and no program headers. `.text.func_003AC2A0` is PROGBITS with
exactly ALLOC|EXECINSTR flags, zero address, alignment four, size 336. The only
nonempty allocated/executable payload belongs to this lane. Its exact symbol
set comprises one canonical local section symbol, `$a` at zero, `$d` at +332,
and the global ARM function at zero with body size 332. The two undefined
identities are canonical global NOTYPE symbols with zero value/size and
default visibility. No extra alias, owned symbol, or relocation is permitted.
Attributes require ARMv6K, ARM ISA, Thumb-1 availability, and VFPv2.

Composite objects may contain unrelated empty PROGBITS/NOBITS sections and
at most one canonical local section symbol per such section. Required metadata
and its optional canonical attributes section symbol remain valid. Nonempty
foreign code/data, extra string/symbol/relocation/attribute tables, malformed
indexes or widths, overlapping payloads/headers, duplicate section names,
misalignment, unexpected flags, and noncanonical state/symbols are rejected.

## Ownership, inbound auditing, and validation

Repeat recursive source-definition and manifest-extent checks, including
unintegrated lane manifests. Require exactly one exactly matched report entry with
body size 332. Compare every same-size ARM inventory body after normalizing
only direct-transfer displacement fields; no duplicate is accepted. Scan
inventoried ARM B/BL/BLX and Thumb B/conditional B/BL/BLX transfers. Only the
thirteen declared local branches may target the interior; external transfers
may target the official ARM entry only. Audit PC-relative loads/address
formation for exclusive use of the adjacent slot. Scan all aligned private
image words for pointers into the body or pool, allowing only the official
entry with ARM state. The observed audit has zero external direct entries,
one aligned entry pointer, and zero duplicates/interior entries. These bounded
static audits cannot prove the absence of computed addresses.

Standalone `--self-test` uses only synthetic public fixtures. Authoritative
validation requires `--target` and `--code-bin`. `--object` selects an existing object; otherwise the
validator assembles the pinned source in a temporary directory. `--inventory`
and `--report` optionally override the existing local evidence paths. No
shared build, progress, objdiff, package, or integration file is edited.

Before expanding ELF tables, enforce independent limits of 64 MiB per file,
16 MiB aggregate executable bytes, 16,384 sections, 1,000,000 aggregate
symbols, and 1,000,000 combined REL/RELA entries. Bound file reads before
allocation and tool execution by timeout/output limits. Hostile self-tests
exercise each cap through the parser, including aggregate SYMTAB/DYNSYM and
REL/RELA cases. A valid fixture with 12,000 unrelated empty executable
sections and their section symbols must pass exact private evidence checks.

Hostile tests also cover every body word, pool and branch addends, relocation
kind/identity/site/duplication/metadata, source/config/specification pins,
function and mapping state, symbol metadata, foreign payload, malformed ELF,
changed target body/pool/witness/destination, ownership overlap, missing or
non-exact reports, duplicates, interior direct/pointer/literal targets,
and decoder fixtures for both instruction sets. Run the validator with
`--self-test`, then `git diff --check`.
