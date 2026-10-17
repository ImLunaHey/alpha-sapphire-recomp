# ARM runtime helpers 125

## Scope and provenance

Revision: AS_EUR_REV2. Observation date: 2026-10-17. Evidence: the ignored
authoritative target ELF, verified private code input, local objdiff report,
public neutral symbol inventory, and recursive source/configuration ownership
audit. Tools: GNU Arm assembler and objdump from the 15.2.rel1 toolchain;
Node.js for independent byte and ELF validation.

This batch is clean-room-ready reverse engineering with independent assembly
from the neutral operation contract. Analysis and implementation were performed
by one agent; this is not a strict two-party clean-room claim. No proprietary
source, SDK headers, extracted assets, or private addresses are incorporated.

The entry range is [0x00240000, 0x00280000). All three functions were unmatched
in the local report and absent from other public source/configuration owners.
The exact operation schedule, register assignments, conditions, and literal
positions are recorded in config/arm-runtime-helpers-125.json.

## Ownership and behavior

- `func_0024FB80`: 144 body bytes, four adjacent bytes, 36 instructions.
  The next global is `func_0024FC14`, exactly 148 bytes after entry.
- `func_0026CFA8`: 28 body bytes, four adjacent bytes, seven instructions.
  The next global is `func_0026CFC8`, exactly 32 bytes after entry.
- `func_0026CFC8`: 32 body bytes, four adjacent bytes, eight instructions.
  The next global is `func_0026D504`; only the first 36 bytes are owned.

Totals: 204 executable body bytes, 12 adjacent literal bytes, 51 instructions,
29 memory instructions (including literal loads, push, and pop), three local
branches, three register returns, and three relocations. There are no calls,
external tails, indirect dispatches, aliases, or secondary entries.

`func_0024FB80` saves r4/r5. It obtains the outer list head from r0+20,
loads its first node into r3, clears r5, and obtains a context through the
shared root at displacement 356. The outer loop compares r3 against a freshly
loaded list head and exits when equal. Otherwise it obtains a counter object
through context+512, loads the word at offset four, adds two, and stores it.
It reloads the counter object, adds two again to the retained r4 value, and
stores that value. Preserve both additions and stores separately.

It then takes a nested list head from node+36 and follows its first word until
the nested sentinel is reached. The inner loop compares at offset 72, performs
a conditional non-equal word load at 76, and branches back at 80. It reloads
the counter object, compares r4 unsigned against two, and stores either r4-2
or zero. It reloads the counter object again, loads its current count, and
performs a second independent saturating subtraction by two. Finally it
advances r3 through its first word and branches to offset 24. Exit restores
r4/r5 and returns through lr. Local transfers are 32→136 (equal), 80→72
(not equal), and 132→24 (always). No arithmetic addition/subtraction updates
flags; each conditional operation uses the preceding comparison.

`func_0026CFA8` reads the shared root's word at displacement 336. When zero,
it stores the incoming r0 there and returns one. Otherwise it returns zero
without a store. The comparison flags govern the store and both result moves.
The incoming value is not checked for null.

`func_0026CFC8` reads the same word. When nonzero, it clears that word and
returns one. Otherwise it returns zero without a store. The clear value and
result moves preserve the comparison flags. This pair is ordinary conditional
memory access, with no atomic instruction or locking guarantee.

## Literal identities and ELF contract

Each function has one adjacent word at its body end. All three words reuse
`global_load_29`, with zero addend and `R_ARM_ABS32`. Literal loads occur at
offsets 16, zero, and zero respectively. The identity equality is independently
checked against the existing `func_0026CF98` adjacent literal in private code;
its value is never published. No new identity is introduced.

Emit ELF32 little-endian ARM ET_REL, EABI5 flags exactly 0x05000000, CPU 6K,
architecture v6K, ARM/Thumb-1 ISA use, and VFPv2. Each function owns one
four-byte-aligned `.text.<function>` PROGBITS section with flags exactly AX,
zero address/link/info/entry-size, and exact body-plus-literal size. Each has
exactly a canonical local section symbol, local ARM mapping at zero, local
data mapping at body end, and a default-visible global ARM function at zero
whose size excludes the literal. The only other global is the undefined,
default-visible, zero-valued NOTYPE `global_load_29`. Each owned section has
one canonical REL section containing its single ABS32 record.

## Validation

The lane validator pins configuration, specification, independent source, and
assembled instruction words. It rejects any change to bytes, conditions,
registers, widths, displacements, instruction order, mapping/function metadata,
identity, relocation slot/type/addend, or executable section ownership. Input
limits are 64 MiB total, 16 MiB aggregate executable data, 16,384 sections,
1,000,000 aggregate SYMTAB/DYNSYM entries, and 1,000,000 aggregate REL/RELA
records. Hostile tests exercise real parser inputs for all caps, instruction
mutations, malformed metadata, relocation mutations, truncation, overlapping
payloads, and a valid composite with 12,000 empty foreign executable sections.

Run `node scripts/validate-arm-runtime-helpers-125.mjs --self-test` and pass
the independently assembled object as the sole argument for standalone checks.
For authoritative checks pass `--authoritative <object> <target-ELF>
<private-code-input>`. This verifies the private code against the public target
manifest, compares every body byte to both authoritative inputs, verifies all
adjacent identity words against the established anchor, and resolves each
independent relocation before comparing the complete 216 owned bytes.
Ownership is audited against the neutral inventory, other configurations,
recursive public sources, and the unmatched report whenever the validator runs.

The four lane files intentionally do not register this source in shared build
or generator metadata. Integration is outside this batch's ownership.
