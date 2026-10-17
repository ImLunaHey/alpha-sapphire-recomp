# ARM runtime/helper batch 120

AS_EUR_REV2 analysis and original assembly implementation, 2026-10-17.
Evidence: private executable, authoritative generated target ELF, local objdiff
report, neutral inventory and recursive source/config ownership audit. GNU Arm
binutils 2.44 and Node.js 24.21.0. No proprietary source, SDK or extracted assets
are included. This is combined analysis/implementation under the repository's
clean-room-ready protocol, not a strict two-party clean-room contribution.

Four source-unowned and report-unmatched ARM leaves have entries in
[0x00100000, 0x00140000). They provide guarded state updates and initialization.
Own exactly 112 body bytes and 20 adjacent bytes: 28 ARM instructions, two local
branches, four returns, no calls or indirect transfers, and five R_ARM_ABS32
relocations with zero addends. Adjacent words are opaque symbolic addresses.

| Function | Body | Adjacent | Owned | Next global |
| --- | ---: | ---: | ---: | --- |
| func_00111E70 | 28 | 4 | 32 | func_00111EC0 |
| func_0011911C | 28 | 8 | 36 | func_00119140 |
| func_0012AC44 | 32 | 4 | 36 | func_0012ADD4 |
| func_0012B594 | 24 | 4 | 28 | func_0012B5B0 |

Only these intervals are owned; gaps before the next global are excluded.
The configuration records each instruction's offset, mnemonic, operands, local
branch destination and literal slot. All instruction widths are four bytes.

func_00111E70 compares r0 with zero and branches from +4 to the return at +24
when equal. Otherwise load the root address into r1 from the slot at +28,
load r1 from root+72, dereference r1, and store r0 at that object's offset 1648.
Return through lr. The input pointer is not dereferenced and remains in r0.

func_0011911C loads the primary identity into r2 from +28, sets r1 to 104,
and stores r2 at r0. Load the secondary identity into r2 from +32, store r1
at r0+8, then store r2 at r0+4, and return through lr. Preserve store order.

func_0012AC44 exchanges the two arguments using r2, leaving the value in r0
and the unsigned index in r1. Preserve the explicit self-move of r0 at +12.
Compare r1 with 28; only under carry-clear load r2 from the slot at +32 and
store r0 at r2 + (r1 << 2). Return through lr for every index, including
negative signed inputs interpreted as unsigned out-of-range values.

func_0012B594 compares r0 with zero and branches from +4 to +20 when equal.
Otherwise load the template address into r2 from +24, load the two words into
r1 and r2 without writeback, then store both through r0 without writeback.
Return through lr. Preserve the original destination pointer in r0.

Each literal has a distinct lane-local symbolic identity; no claim is made
about its underlying object type. Do not embed private literal values in source
or metadata. Independent assembly must reproduce each body and, after resolving
these five opaque identities from authoritative evidence, all adjacent bytes.
The target ELF must independently agree with every inventory body size, ARM
mapping and body byte. Report status and ownership must be rechecked at handoff.

Each complete body occurs once among the 10,440 inventoried bodies. A static
scan of inventoried ARM/Thumb direct transfers, core/VFP literal accesses and
address formation found 30 external direct references, all to function entries;
none targets an interior instruction or adjacent slot. An aligned word scan of
the private executable found no possible pointers into owned interiors. The
recursive source/config scan found no overlapping owner. These audits cannot
resolve dynamically computed addresses.

## Standalone validation

Assemble using arm-none-eabi-as, then run:

```
node scripts/validate-arm-runtime-helpers-120.mjs --self-test
node scripts/validate-arm-runtime-helpers-120.mjs /tmp/arm-runtime-helpers-120.o
node scripts/validate-arm-runtime-helpers-120.mjs --authoritative /tmp/arm-runtime-helpers-120.o <private-code.bin> <authoritative-target.o>
```

The validator pins source, raw and normalized configuration, and this spec.
Require ELF32 little-endian ARM ET_REL, EABI5, no entry point or program headers,
ARMv6K/Thumb-1/VFPv2 attributes, unique executable sections aligned to four,
exact body/owned sizes, canonical section symbols and ARM/data mappings, exact
global/undefined symbol sets and exact ABS32 slots, identities and zero addends.
Reject aliases, extra payloads/relocations, overlapping payloads, malformed
headers, altered bytes and ownership overlap. Caps: 64 MiB file, 16 MiB executable
bytes, 16,384 sections, one million aggregate symbols and relocations each.
Hostile fixtures exercise these caps, mutations, truncation, identity/slot
changes and metadata changes; accept a 12,000-empty-section composite.

Authoritative mode reads private inputs without copying them into the checkout.
It checks selected bodies against both independent inputs, resolves only the
specified literal slots and compares every owned byte. Static inbound-reference
and body-uniqueness audits are bounded evidence, not proof against dynamically
computed addresses. No shared build integration or progress reporting is changed.
