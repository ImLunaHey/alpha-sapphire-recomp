# DllUSAreaWaterSurface neutral specification

## Scope and provenance

This is an analysis-only specification for `cro/DllUSAreaWaterSurface` in
`AS_EUR_REV2`. It was prepared on 2026-10-17 from the repository's public CRO
inventory and partition, the generated private structural ELF, its loader
relocations, and independent ARM control-flow inspection. The structural ELF
was produced by the repository converter from the ignored, external module.
GNU Arm Embedded binutils 15.2.Rel1 (`objdump`/`readelf` 2.44) was used for
inspection. Target provenance is governed by `docs/PROVENANCE.md`.

No target bytes, disassembly, extracted assets, SDK material, or target-derived
strings are reproduced here. Hashes below identify evidence without embedding
it. This document is intended for a separate implementer who has not inspected
the target.

## Clean-room quarantine note

An earlier revision of this document contained target-derived instruction
schedules that exceeded the clean-room specification boundary. Those schedules
and the implementation derived from them were removed by explicit revert
commits without rewriting history. They must not be consulted or reused. This
cleaned specification retains only high-level behavior, interface facts, and
structural metadata; implementation may use target comparison solely as a
blind pass/fail oracle.

The private generated structural object has SHA-256
`7fc600c91ca859a9ad8ba2afde825072f966b20e01437e167fba7bc97eed07d0`.
Its allocatable segment facts are:

| Segment | Size | Alignment | SHA-256 where materialized |
| --- | ---: | ---: | --- |
| `.text` | `0xA4C` (2,636) | 4 | `e15480d5451d2e9ca4cfce69d9cad648549de891e74f021846f2fa0e722d8741` |
| `.rodata` | `0xEC` (236) | 4 | `deee453ca8e53581d689d02837d2f1e8719f3af7fe94619156d47cecf6c465af` |
| `.data` | 4 | 4 | `df3f619804a92fdb4057192dc43dd748ea778adc52bc498ce80524c014b81119` |
| `.bss` | 16 | 4 | NOBITS |

All observed code is ARM state with VFP. The current accepted public inventory
contains only `func_00000570` (`0x570`, 152 bytes) and `func_00000610`
(`0x610`, 248 bytes). The current report therefore credits one of two accepted
functions: 152/400 accepted code bytes and 1/2 functions. Its
`metadata.complete` is correctly false. The evidence below accounts for the
rest of the module but does not silently promote inferred boundaries into the
accepted inventory.

## Object model and interfaces

The main object is at least `0x44` bytes. Observed fields use the following
neutral names:

| Offset | Width | Meaning |
| ---: | ---: | --- |
| `0x00` | 4 | vtable pointer |
| `0x04`, `0x08` | 4 each | the construction context (stored twice) |
| `0x0C` | 4 | owned helper/resource handle |
| `0x10` | 4 | selected immutable area descriptor, or null |
| `0x14` | 1 | count of one category created during setup |
| `0x15` | 1 | four-state asynchronous state machine |
| `0x18` | at least 28 | embedded member object |
| `0x34` | 4 | owned render/surface object |
| `0x38`, `0x3C` | float | two independently animated opacity values |
| `0x40` | 4 | packed context value during update; later a state-machine result pointer |

The vtable is the 14-entry table in read-only data described below. Its entries
point, in order, to offsets `0x954`, `0x934`, `0x710`, `0x2F0`, `0x0F4`,
`0x0F0`, `0x70C`, `0x0E4`, `0x280`, `0x0DC`, `0x0E8`, `0x0CC`, `0x0D4`, and
`0x0C8`. This ordered relationship is relocation evidence, not a guess about
source-level method names.

## Text partition

The following partition accounts for every text byte. “Pool” means literal or
jump-table data embedded in `.text`, not executable instructions.

| Range | Size | Classification | Evidence/behavior |
| --- | ---: | --- | --- |
| `0x000..0x0C8` | 200 | 25 import veneers | 25 repeated 8-byte ARM absolute-transfer veneers; each word slot has one external `R_ARM_ABS32` relocation |
| `0x0C8..0x0CC` | 4 | method | no-op, returns without defining a result |
| `0x0CC..0x0D4` | 8 | method | returns integer zero |
| `0x0D4..0x0DC` | 8 | method | returns integer zero |
| `0x0DC..0x0E4` | 8 | method | returns integer zero |
| `0x0E4..0x0E8` | 4 | method | no-op |
| `0x0E8..0x0F0` | 8 | method | returns integer zero |
| `0x0F0..0x0F4` | 4 | method | no-op |
| `0x0F4..0x270` | 380 | update method | synchronizes context state and animates two opacities |
| `0x270..0x280` | 16 | pool | floats `1.0`, `0.014`, `0.0`, `100.0` |
| `0x280..0x2F0` | 112 | teardown method | releases the render object, embedded member, and helper/resource |
| `0x2F0..0x560` | 624 | setup method | creates resources from descriptor records and initializes the render object |
| `0x560..0x570` | 16 | pool | floats `0.0`, `0.5`, `1.0`, `100.0` |
| `0x570..0x608` | 152 | accepted method | applies one opacity channel to every surface element |
| `0x608..0x610` | 8 | pool | floats `0.0`, `1.0` |
| `0x610..0x708` | 248 | accepted predicate | decides whether the primary surface channel is enabled |
| `0x708..0x70C` | 4 | pool | integer mask/key `0x4010` |
| `0x70C..0x710` | 4 | method | no-op |
| `0x710..0x840` | 304 | state method | advances a four-state helper/resource initialization sequence |
| `0x840..0x92C` | 236 | constructor | initializes fields, selects one of two descriptors, and allocates a helper |
| `0x92C..0x934` | 8 | pool | read-only-data references with addends `0xB4` and `0x0C` |
| `0x934..0x950` | 28 | deleting teardown wrapper | resets vtable, tears down embedded member, then tail-releases storage |
| `0x950..0x954` | 4 | pool | read-only-data reference with addend `0xB4` |
| `0x954..0x96C` | 24 | non-deleting teardown wrapper | resets vtable and tears down embedded member |
| `0x96C..0x970` | 4 | pool | read-only-data reference with addend `0xB4` |
| `0x970..0x990` | 32 | static initializer | writes four opacity defaults into BSS |
| `0x990..0x99C` | 12 | pool | floats `0.7`, `1.0`, then a BSS relocation with addend zero |
| `0x99C..0x9B0` | 20 | exported loader control, prefix | dispatches operation values 0 through 4 |
| `0x9B0..0x9C4` | 20 | jump table | five relocations to cases at `0x9C4`, `0x9CC`, `0x9D4`, `0x9E0`, `0x9F0` |
| `0x9C4..0xA24` | 96 | exported loader control, cases | registration/query/range operations; returns zero for recognized operations |
| `0xA24..0xA4C` | 40 | control literals | data slot, null, two text-range endpoints, two empty rodata endpoints, three fallback constants, and static-initializer pointer |

The three 4-byte no-ops have identical bodies. The four 8-byte zero-return
methods also have identical bodies. Their distinct vtable slots and addresses
must still remain distinct symbols/sections if promoted into the public
inventory.

## Behavioral contracts

### Update method (`0x0F4`)

If the descriptor at object offset `0x10` is null, return immediately. Otherwise:

1. Read two context bytes through the object at `0x08` and synchronize them
   into the packed word reached through `0x40` when the first byte differs.
2. Evaluate the predicate at `0x610`. If true, increase opacity `0x38` by
   `0.014` toward `1.0`; if false, decrease it by the same amount toward
   `0.0`. Only call the opacity application method when the value changes,
   using channel index 0 and the render object at `0x34`.
3. Query the external environment with integer arguments `(0, 1)` and float
   argument `100.0`. Results 3, 4, and 9 enable the second channel. Animate
   opacity `0x3C` toward `1.0` when enabled and toward `0.0` otherwise, then
   apply it to channel index 1 when changed.

Both channels clamp exactly at the endpoints. The positive-range comparisons
against `1.0` are observable integer comparisons of the float bit pattern;
the lower-bound comparisons use VFP floating-point comparison.

### Teardown method (`0x280`)

When a descriptor exists, obtain the context-owned companion object and detach
the render object from it. If the render object at `0x34` is non-null, invoke
its vtable slot at byte offset 4 and clear the field. Tear down the embedded
member at `0x18`. If the helper/resource at `0x0C` is non-null, destroy it and
tail-release its storage. Null fields are tolerated.

### Setup method (`0x2F0`)

Return immediately when descriptor `0x10` is null. Otherwise, pass the two
context words at offsets `0x24` and `0x2C` (relative to the object reached
through `0x08`) to an external setup operation together with the helper at
`0x0C`, a zero selector, and an all-ones sentinel.

The descriptor contains a count at `+0x0A`, a pointer at `+0x04`, and compact
three-byte records. For each record, inspect its first byte and signed second
byte:

- kind 1 calls one external creator using the helper, the two context words,
  and `&object[0x18]`, then increments byte `0x14`;
- kind 0 calls another creator. It passes addresses associated with object
  offset `0x34` plus two zero values; its exact optional-address convention
  depends on whether byte `0x14` is already nonzero;
- any other kind enters the module's assertion/error import with zero
  arguments.

Next, form a six-float placement record. X and Z come from signed descriptor
integers converted to float, multiplied by a context scale, and biased by half
that scale. The other four components are zero. Create/configure the render
object at `0x34`, set a float property to `1.0`, set a boolean-like property to
true, and submit the final three-component subrecord.

Initialize opacity `0x38` from the predicate (`1.0` or `0.0`) and apply channel
0. Initialize opacity `0x3C` from the same external environment classification
used by the update method and apply channel 1. Finally attach the render object
to the context-owned companion object through two external operations.

### Opacity application (`0x570`, accepted as `func_00000570`)

Inputs are a render/surface interface in the second integer argument, a channel
index in the third integer argument, and opacity in VFP scalar argument `s0`;
the first integer argument is not used. Query the element count through import
veneer `0x90`. For every unsigned index below that count:

1. initialize a four-float temporary to `(0, 0, 0, 1)`;
2. invoke virtual slot `0x54` on the interface with `(index, channel,
   &temporary)`;
3. replace the temporary's fourth component with the input opacity;
4. invoke virtual slot `0x50` with the same index, channel, and temporary.

Zero elements cause no virtual calls. This method preserves VFP `d8-d9` and
uses a 20-byte local stack area.

### Enable predicate (`0x610`, accepted as `func_00000610`)

The predicate returns only 0 or 1. It begins with two bytes extracted from the
packed context word at object offset `0x40`. A special descriptor category
(descriptor byte 0 equal to 32) performs two additional external context
queries using constants `0xEF0` and `0x13140`; one result value 17 bypasses the
second restriction, while the other query must otherwise yield halfword value
2.

It then switches on descriptor halfword `+0x1C`:

- mode 0 succeeds only when descriptor halfword `+0x18` equals the low packed
  byte and descriptor halfword `+0x1A` is neither 9 nor the high packed byte;
- mode 1 succeeds only when `+0x18` differs from the low byte and `+0x1A` is
  either 9 or the high byte;
- any other mode calls the assertion/error import and returns false.

The special-category restriction can force success before this mode test.

### State method (`0x710`)

If descriptor `0x10` is null, return 1. Otherwise switch on byte `0x15`:

- state 0 starts an external operation on helper `0x0C` using descriptor
  halfwords `+0x08` and `+0x0C`, sets state 1, and returns 0;
- state 1 polls the helper. While incomplete it returns 0; on completion it
  sets state 2 and returns 0;
- state 2 locates a context object associated with numeric kind 22, stores the
  resulting pointer at `0x40`, optionally updates the pointed-to word with two
  context bytes, sets state 3, and returns 0;
- state 3 returns 1;
- invalid states enter the assertion/error import and return 0.

### Constructor (`0x840`)

Store the vtable pointer, store the construction context at both `0x04` and
`0x08`, clear `0x10`, `0x14`, and `0x15`, and initialize the embedded member at
`0x18`. Search exactly two read-only descriptor records of stride `0x20`,
matching each record's leading byte against a byte obtained through the
context. Store the matching descriptor at `0x10`, or null if neither matches.

When a descriptor is found, allocate `0x40` bytes with the context allocator.
If allocation succeeds, initialize the helper using the allocator/context,
another context object, the descriptor word at `+0x04`, the descriptor
halfword at `+0x0A`, and constant 8; store the returned helper at `0x0C`.
Allocation failure and failure to find a descriptor both enter the module's
assertion/error import. Return the original object pointer.

### Static initializer and loader control

The initializer at `0x970` writes `(0.7, 0.7, 1.0, 1.0)` to the 16-byte BSS.
The last text word is a relocation to this initializer and forms the module's
one-entry initialization range.

The exported symbol at `0x99C` receives an output pointer and operation number:

- operation 0 stores null through the output pointer;
- operation 1 stores the supplied output pointer in the 4-byte data slot;
- operation 2 loads that data slot and stores it through the output pointer;
- operation 3 writes the static-initializer range `[0xA48, 0xA4C)`;
- operation 4 writes an empty read-only range `[0xEC, 0xEC)`;
- recognized operations return zero.

Values outside 0 through 4 return a fixed nonzero fallback value after the
compiler-emitted fallback sequence. The fallback value is not assigned a
semantic meaning here.

## Read-only data, writable data, and BSS

Read-only data has three objective regions:

- `0x00..0x60`: two fixed-size metadata records with internal pointers and two
  external read-only imports;
- `0x60..0xB0`: two target-derived type-identification strings. Their contents
  are intentionally omitted; internal pointers identify starts `0x60` and
  `0x7E`, and the whole region remains byte-accounted by its section hash;
- `0xB0..0xEC`: one type-information pointer followed by the 14-entry vtable
  whose exact target order is listed above.

The 4-byte `.data` slot is zero in the unresolved structural object and has no
relocation. BSS is exactly the four-float opacity-default block initialized at
module startup.

## Relocation contract

There are exactly 63 `R_ARM_ABS32` relocations and no other relocation type:

- `.text`: 41 entries: 25 external code imports in veneer literals, four
  read-only references, one BSS reference, eight internal text references,
  one data reference, and two further internal read-only references;
- `.rodata`: 22 entries: two external read-only imports, six internal
  read-only references, and 14 vtable text references;
- `.data` and `.bss`: none.

All 25 external code imports are anonymous neutral identities: 24 target the
static module namespace and one targets `DllField`. The read-only segment has
two anonymous external read-only imports from the static namespace. An
implementation must preserve the neutral imported symbol identities already
emitted by `generate-cro-target-object.mjs`; source-level names must not be
invented from private information.

The veneer instruction offsets and neutral import coordinates, in text order,
are:

| Veneer | Module namespace | Segment | Source offset |
| ---: | --- | ---: | ---: |
| `0x000` | static | 0 | `0x0E7FD8` |
| `0x008` | `DllField` | 0 | `0x0E5B70` |
| `0x010` | static | 0 | `0x291544` |
| `0x018` | static | 0 | `0x272748` |
| `0x020` | static | 0 | `0x352EE0` |
| `0x028` | static | 0 | `0x1FF8C0` |
| `0x030` | static | 0 | `0x3529F8` |
| `0x038` | static | 0 | `0x04EA64` |
| `0x040` | static | 0 | `0x2964E8` |
| `0x048` | static | 0 | `0x296454` |
| `0x050` | static | 0 | `0x28B374` |
| `0x058` | static | 0 | `0x28B69C` |
| `0x060` | static | 0 | `0x352160` |
| `0x068` | static | 0 | `0x352484` |
| `0x070` | static | 0 | `0x352E54` |
| `0x078` | static | 0 | `0x3525B4` |
| `0x080` | static | 0 | `0x35BB70` |
| `0x088` | static | 0 | `0x35BAF8` |
| `0x090` | static | 0 | `0x3CCF64` |
| `0x098` | static | 0 | `0x3EAD40` |
| `0x0A0` | static | 0 | `0x01FA90` |
| `0x0A8` | static | 0 | `0x281B00` |
| `0x0B0` | static | 0 | `0x023480` |
| `0x0B8` | static | 0 | `0x352E74` |
| `0x0C0` | static | 0 | `0x281B94` |

Each veneer has its relocated word at instruction offset plus 4 and external
addend zero. The two external read-only relocations are at read-only offsets
`0x4C` and `0x54`; both have addend 8 and target static segment 1 source
offsets `0x05A458` and `0x05A468`, respectively.

Important internal text relocation addends are: vtable-pointer pools use
read-only addend `0xB4`; the constructor's descriptor-table pool uses addend
`0x0C`; the loader jump table targets the five case addresses listed above;
the loader exposes text endpoints `0xA48` and `0xA4C`, read-only endpoint
`0xEC` twice, and the initializer pointer at text `0xA48` targets `0x970`.

## Evidence strength and remaining uncertainty

Function starts at `0x570` and `0x610` are accepted public inventory facts.
Starts at `0x0C8..0x0F0`, `0x0F4`, `0x280`, `0x2F0`, `0x70C`, `0x710`,
`0x840`, `0x934`, and `0x954` are strongly evidenced by the 14 relocated
vtable entries, terminal control flow, direct call targets, and non-overlap.
The start at `0x970` is evidenced by the loader's relocated initializer entry.
The exported loader symbol at `0x99C` is present in the generated structural
ELF.

Uncertainty remains in source-level types, ownership names, and the exact
meaning of external APIs. The two omitted type-identification strings cannot
be reconstructed by an implementation author from this document; they require
a policy decision (for example, externally supplied non-committed verification
data or a clean public derivation) before the unit can become byte-identical in
data. The existing partition's 288 unknown bytes are not genuinely opaque:
236 bytes are the constructor body at `0x840..0x92C`, 40 bytes are static
initializer code plus the first eight bytes of its pool at `0x970..0x998`,
and the remaining three 4-byte words are the executable halves of import
veneers at `0x0A8`, `0x0B0`, and `0x0B8` (their relocated literal halves are
already pools). They should be
reclassified only together with an inventory update and validator that proves
the exact whole-text partition.

Completion must remain false until every executable body, every embedded pool,
all 236 read-only bytes, the 4 writable bytes, 16 BSS bytes, all 63
relocations, and all currently unknown residue are represented and the
repository complete-unit gate passes.
