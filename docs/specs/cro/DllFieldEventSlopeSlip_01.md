# DllFieldEventSlopeSlip clean-room specification 01

## Scope and provenance

This specification covers only `cro/DllFieldEventSlopeSlip` from Pokémon Alpha
Sapphire `AS_EUR_REV2`. It is an analysis artifact, not an implementation. The
observations were made on 2026-10-17 from the manifest-approved external CRO
whose public SHA-256 is recorded in
`progress/units/AS_EUR_REV2.cro.json`. The module was converted with the
repository's deterministic CRO-to-ELF converter at commit
`4a07fbcd399281cd0006d8cf3c439e6bc50ec2bb`, then inspected with GNU Arm
objdump 2.44 and GNU readelf 2.46. The public CSV and complete partition were
cross-checked independently.

No proprietary file, raw instruction listing, target byte sequence, imported
symbol identity, or private path is reproduced here. External operations are
given neutral `I00` through `I25` names in veneer order. Constants and field
offsets below are behavioral/interface facts needed for interoperability.

## Link-unit layout

All code is ARM state and four-byte aligned.

| Section | Size | Alignment | Observed role |
| --- | ---: | ---: | --- |
| `.text` | `0x0A08` (2,568) | 4 | 26 import veneers, 22 local routines, and literal/dispatch pools |
| `.rodata` | `0x00E8` (232) | 4 | three RTTI descriptors, three private identifier strings, and three six-entry method tables |
| `.data` | `0x0004` (4) | 4 | zero-initialized process-lifetime control word |
| `.bss` | `0x0010` (16) | 4 | four single-precision configuration values |

The structural object has 38 `.text` relocations (26 imported and 12 internal)
and 30 `.rodata` relocations (6 imported and 24 internal), all `R_ARM_ABS32`.
The public partition currently accounts for 344 bytes as one accepted
function, 1,976 bytes as executable gaps, 208 bytes as pools, and 40 bytes as
unknown. Target-aware analysis refines that last 40-byte interval into a
32-byte initializer at `0x092C`, two four-byte floating literals at `0x094C`
and `0x0950`, and the already classified relocated word at `0x0954`. Thus no
truly unknown `.text` residue remains.

### Import veneers

`0x0000` through `0x00CF` consists of 26 canonical eight-byte import veneers.
For veneer `Ixx`, the executable entry is at `xx * 8` and the following word
is its imported `R_ARM_ABS32` slot. Each veneer transfers control without
changing the argument registers. This contributes 104 executable bytes and
104 relocated pool bytes. The private link names are intentionally omitted;
an implementation should use repository-approved neutral aliases.

The observed call interfaces are:

| Import | Neutral interface/behavior used by this unit |
| --- | --- |
| `I00` | `pointer owner_to_object(pointer owner)` |
| `I01` | `pointer actor_query(pointer actor)` |
| `I02` | `integer global_predicate(void)` |
| `I03` | `void mode_set(integer key, integer zero, integer minus_one)` |
| `I04` | `void actor_prepare(pointer actor)` |
| `I05` | `void direction_to_vector(byte direction, pointer out_vector3)` |
| `I06` | `void actor_apply_vector_a(pointer actor, pointer vector3)` |
| `I07` | `void actor_apply_vector_b(pointer actor, pointer vector3)` |
| `I08` | `void actor_apply_vector_c(pointer actor, pointer vector3)` |
| `I09` | `integer actor_ready_a(pointer actor)` |
| `I10` | `integer actor_ready_b(pointer actor)` |
| `I11` | `integer global_override(void)` |
| `I12` | `integer classify_a(pointer value)` |
| `I13` | `void effect_begin(integer key, integer zero, integer minus_one, integer zero2)` |
| `I14` | `void actor_submit(pointer actor, pointer command, integer one)` |
| `I15` | `void actor_set_mode(pointer actor, integer fourteen, integer four)` |
| `I16` | `void finish(integer zero, integer zero2, integer zero3)` |
| `I17` | `void cleanup_a(void)` |
| `I18` | `void cleanup_b(void)` |
| `I19` | `integer classify_b(pointer value)` |
| `I20` | `integer object_predicate(pointer object)` |
| `I21` | `byte transform_direction(byte direction)` |
| `I22` | `integer actor_orientation(pointer actor)` |
| `I23` | `void actor_set_orientation(pointer actor, integer orientation)` |
| `I24` | `integer direction_delta(byte direction, integer orientation)` |
| `I25` | `integer classify_c(pointer value)` |

The repeated key passed to `I03` and `I13` is `0x000A0061`. Its higher-level
meaning is not established.

## Complete local routine inventory

Literal pools immediately following a routine are excluded from its size.
The final control routine has a 20-byte relocated dispatch pool embedded in
its logical range, so its two executable extents are shown separately.

| Entry | Executable size | Neutral role |
| ---: | ---: | --- |
| `0x00D0` | 64 | Family A constructor |
| `0x0110` | 8 | return true |
| `0x0118` | 128 | Family A activation/setup |
| `0x01A0` | 292 | Family A tick |
| `0x02C8` | 16 | cleanup wrapper |
| `0x02D8` | 4 | cleanup tail thunk |
| `0x02DC` | 44 | Family B constructor |
| `0x0308` | 344 | Family B special tick (existing public function) |
| `0x0464` | 8 | return true |
| `0x046C` | 128 | Family B activation/setup |
| `0x04F4` | 128 | Family B direction/action initialization |
| `0x0574` | 324 | Family B tick dispatcher/general tick |
| `0x06BC` | 16 | cleanup wrapper |
| `0x06CC` | 4 | cleanup tail thunk |
| `0x06D0` | 64 | Family C constructor |
| `0x0710` | 8 | return true |
| `0x0718` | 128 | Family C activation/setup |
| `0x07A0` | 372 | Family C phased tick |
| `0x0918` | 16 | cleanup wrapper |
| `0x0928` | 4 | cleanup tail thunk |
| `0x092C` | 32 | initialize four-float configuration block |
| `0x0958`, `0x0980` | 20 + 96 | module control routine around inline dispatch pool |

This inventory contains 22 logical routines and 2,248 instruction bytes.
Together with the 104 veneer instruction bytes and 216 pool bytes it covers
all 2,568 `.text` bytes.

## Shared records and state

The command submitted through `I14` is a four-byte record:

| Offset | Width | Meaning |
| ---: | ---: | --- |
| `+0` | 2 | action identifier |
| `+2` | 1 | direction |
| `+3` | 1 | enabled flag (always one here) |

Families A and B use this context layout from offset `+0x18` onward:

| Offset | Width | Meaning |
| ---: | ---: | --- |
| `+0x18` | 4 | owner supplied to constructor |
| `+0x1C` | 4 | actor (`owner_to_object(owner)->field_0C`) |
| `+0x20` | 4 | command scratch record |
| `+0x24` | 1 | direction supplied to constructor |
| `+0x28` | 4 | result of `I00(owner)` |
| `+0x2C` | 4 | tick counter |
| `+0x30` | 1 | family-specific boolean/mode |
| `+0x32` | 2 | cached action identifier (Family B) |
| `+0x34` | 4 | special-action state (Family B) |

Family C shifts the pointer/counter portion by four bytes and adds a phase:

| Offset | Width | Meaning |
| ---: | ---: | --- |
| `+0x18` | 2 | phase |
| `+0x1C` | 4 | owner |
| `+0x20` | 4 | actor |
| `+0x24` | 4 | command scratch record |
| `+0x28` | 1 | direction |
| `+0x2C` | 4 | result of `I00(owner)` |
| `+0x30` | 4 | tick counter |
| `+0x34` | 1 | cached result of `I02() != 0` |

## Behavioral contracts

### Constructors and activation

The Family A constructor stores owner and direction, derives the object and
actor pointers described above, and stores `I02() != 0` at `+0x30`. Family B
does the same pointer setup but does not call `I01`/`I02`. Family C is the
Family A operation at the shifted offsets shown above.

The Family A and C activation routines call `I03(key, 0, -1)`, prepare the
actor with `I04`, derive and apply the direction vector with `I05` and `I06`,
then pass a zero vector separately to `I07` and `I08`. Family B instead calls
`I03`, `I04`, reads orientation through `I22`, writes it back with `I23`, and
then performs the same two zero-vector calls. Family A/C reserve 24 temporary
bytes; Family B reserves 16. All three zero each vector component.

The three eight-byte predicates return one. Each cleanup wrapper calls `I17`
and tail-calls `I18`; each four-byte cleanup thunk tail-calls `I17`.

### Family A tick (`0x01A0`)

Return zero immediately unless both `I09(actor)` and `I10(actor)` are nonzero.
Obtain `current = I01(actor)`. If `I11()` is zero and `I12(current)` is nine,
call `I03(key, 0, -1)` and return one.

On the ordinary path, call `I13(key, 0, -1, 0)` when the tick counter is not
positive. Submit a command whose action is `0x00F1` when the byte at
`object + 0x24` is one or two, and `0x009D` otherwise; its direction is the
stored direction. Increment the counter. When the cached predicate is true,
call `I15(actor, 14, 4)`. Once the incremented counter exceeds 40, call
`I16(0, 0, 0)` and return one; otherwise return zero.

### Family B initialization and ticks

The initializer at `0x04F4` obtains the actor orientation, computes
`delta = I24(direction, orientation)`, and uses the absolute delta. If it is
less than two, clear the mode byte and cache action `0x00F1` when
`object[0x24]` is one or two, otherwise `0x009D`. If it is at least two, set
the mode byte and cache `0x00F2` for object classes one/two, otherwise
`0x009F`. Clear the special-action state in both cases.

The dispatcher at `0x0574` tail-dispatches to `0x0308` when the mode byte is
one. Values other than zero and one call `I16(0, 0, 0)` and return one. Mode
zero performs the common readiness checks, uses `I19` for the class-nine
termination test, starts the effect when the counter is not positive, submits
the cached action and original direction, increments the counter, always calls
`I15(actor, 14, 4)`, and finishes with return one after the counter exceeds 40.
Incomplete/readiness-waiting paths return zero.

The special tick at `0x0308` has the same readiness and `I19` termination
checks. Before the ordinary cached-action path, if the special-action state is
zero and `I20(object)` is nonzero, it submits action `0x00EF` using
`I21(direction)`, sets the state to one, and returns zero for that tick. The
ordinary path starts the effect when needed, submits the cached action with the
original direction, increments the counter, always calls `I15`, and finishes
after 40 exactly as above.

### Family C phased tick (`0x07A0`)

Return zero while either readiness predicate is false. Phase zero becomes
phase one and continues through phase-one processing in the same call. During
phase one, obtain `current = I01(actor)`:

- If `I11()` is zero and `I25(current)` is nine, call `I03(key, 0, -1)`,
  submit action `0x0099` with the stored direction, increment the phase, and
  return zero.
- Otherwise, if the counter already exceeds 40, call `I16(0, 0, 0)`, increment
  the phase, and return zero.
- Otherwise start the effect when the counter is not positive, submit action
  `0x009E`, increment the counter, and call `I15(actor, 14, 4)` only when the
  cached predicate is true. Return zero.

Phase two becomes phase three and returns one. Phase three also returns one.
Unrecognized phase values return zero.

### Configuration initializer and module control

The initializer at `0x092C` writes four floats to the BSS block in order:
`0.7f`, `0.7f`, `1.0f`, `1.0f`.

The control routine at `0x0958` accepts an output pointer in argument zero and
a selector in argument one. Selectors zero through four behave as follows:

| Selector | Effect |
| ---: | --- |
| 0 | store null through the output pointer |
| 1 | store the output pointer in the module `.data` control word |
| 2 | load the control word and store it through the output pointer |
| 3 | store the begin/end pair for a one-entry initializer range; the entry points to `0x092C` |
| 4 | store identical begin/end pointers equal to one-past `.rodata` |

Successful selectors return zero. Other selectors return the fixed failure
value `0xD8E12C21` after two inert diagnostic loads. The routine's relocated
five-entry jump table occupies `0x096C..0x097F`; its trailing literal pool is
`0x09E0..0x0A07`.

## Read-only data organization and blocker

`.rodata[0x0000..0x0023]` is three 12-byte RTTI descriptors, each containing
two imported-runtime references and a pointer to its identifier. The three
NUL-terminated identifiers plus a one-byte terminator occupy
`0x0024..0x0087`; four padding bytes follow. Three 32-byte method-table records
occupy `0x0088..0x00E7`. Each record contains an offset-to-top word, an RTTI
pointer, and six method pointers. The third offset-to-top value is 24; the
first two are zero. The method entries correspond, in order, to cleanup tail,
cleanup wrapper, return-true predicate, tick, tick-plus-four secondary entry,
and activation/setup for the relevant family.

The exact 100-byte identifier region is intentionally not specified. Its
contents are target-derived strings, and copying them into a clean-room spec
or implementation would violate `docs/CLEAN_ROOM.md` and this unit's task
rules. This is a concrete blocker to a byte-identical `.rodata` implementation
unless a lawful independent/public source for those identifiers is approved.
The imported RTTI identities likewise need approved neutral public aliases.

## Required fail-closed validation

A unit-specific validator should require:

1. the exact section sizes above, ARM EABI object type, and no allocatable
   sections outside `.text`, `.rodata`, `.data`, and `.bss`;
2. exact coverage of all `.text` bytes by the 26 veneers, 22 routines, and
   enumerated pools, with no unknown residue;
3. exact symbol addresses/sizes/mode and exact 68-relocation topology,
   including the inline dispatch pool and one-past-section addends;
4. behavioral probes for all constructor fields, tick boundary values
   (counter 0, 40, and 41), phase transitions, class branches, and selector
   cases;
5. byte-for-byte comparison of every allocated section against the private
   target, deterministic rebuilds, and rejection of extra bytes or symbols;
6. the repository complete-unit gate (`metadata.complete` only when the whole
   target/base objects are identical), plus `scripts/check-no-rom.sh` and the
   standard clean-tree secret/path scan.

Until the RTTI identifier provenance blocker is resolved and all code, data,
relocations, and pools pass that gate, `metadata.complete` must remain false.
