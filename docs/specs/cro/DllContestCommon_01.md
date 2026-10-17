# DllContestCommon clean-room specification 01

## Scope and provenance

This specification covers `cro/DllContestCommon` from Pokémon Alpha Sapphire
`AS_EUR_REV2`. It records neutral interface and behavior facts for a separate
implementation contributor; it contains no implementation source, target
instructions, target bytes, extracted assets, or proprietary SDK material.

Observations were made on 2026-10-17 from the repository's ignored,
deterministically converted target object using the public CRO conversion and
partition workflow. The evidence was checked with:

- `scripts/validate-cro-symbols.mjs` and the public CSV inventory;
- `scripts/validate-cro-function-semantics.mjs` and GNU ARM objdump 2.44;
- ELF32 metadata and relocation inspection with GNU readelf 2.44; and
- the checked-in unit identity in `progress/units/AS_EUR_REV2.cro.json`
  (12,288-byte CRO, SHA-256
  `1984e4e026e21b453173daa2ba6e4fa03db48b0062ed87c0af067165a9a16f40`).

The observed link unit is ELF32 little-endian ARM, EABI version 5. All known
code uses ARM state and four-byte alignment.

## Link-unit inventory

The structural sections are:

| Section | Size | Meaning |
| --- | ---: | --- |
| `.text` | `0x368` | ARM code, import veneers, jump table, and literal pools |
| `.rodata` | `0x18` | six 32-bit selector values |
| `.data` | `0x04` | one zero-initialized module-global pointer |
| `.bss` | `0` | no storage |

The complete text partition contains 648 bytes in three accepted functions,
140 bytes of still-unclaimed ARM code, and 84 bytes in nine pools. There is no
unknown residue, but unclaimed code and pool/data bytes remain unmatched until
an implementation and exact link validation account for them.

The accepted function boundaries are:

| Function | Address | Size | Contract |
| --- | ---: | ---: | --- |
| `func_00000030` | `0x030` | `0x1D8` | build the ten owned resources described below |
| `func_0000020C` | `0x20C` | `0x04C` | initialize a 48-byte control object and build its resources |
| `func_00000258` | `0x258` | `0x064` | release the ten resources, preserving the observed clearing behavior |

Six import veneers occupy the first 48 text bytes as alternating four-byte
code and four-byte relocation slots. In address order, this specification
calls their imported operations `import_0` through `import_5`; these names are
local neutral aliases, not claims about original names.

## Control-object ABI

All three accepted routines use AAPCS register arguments and return in `r0`.
The control object is at least 48 bytes and has this word layout:

| Offset | Meaning |
| ---: | --- |
| `0x00` | caller-supplied owner/context pointer |
| `0x04` | transient 120-byte builder object while setup runs |
| `0x08..0x14` | four owned resource pointers for selectors 0, 1, 2, and 3 |
| `0x18..0x2C` | six owned resource pointers for selectors 5 through 10 |

The owner/context supports an indirect call through the function pointer at
offset `0x34` of its first-word method table. The transient builder supports an
indirect cleanup call through the function pointer at offset `0x04` of its
first-word method table.

The imported-operation call shapes are:

| Alias | Arguments | Result/use |
| --- | --- | --- |
| `import_0` | `(120, owner)` | returns the transient builder pointer |
| `import_1` | `(allocation, owner_method_0x34(owner), 242, 1)` | initializes a non-null allocation and returns the builder used thereafter |
| `import_2` | `(builder, selector)` | returns a selector-specific descriptor |
| `import_3` | `(owner_method_0x34(owner), descriptor)` | returns an owned resource pointer |
| `import_4` | `(builder, selector, resource)` | associates the resource with the builder selector |
| `import_5` | `(resource)` | releases one resource; calls are unconditional, including for null slots |

## `func_00000030`: resource construction

Precondition: `r0` points to a writable control object whose owner field is
valid. Under the normal contract, `import_0` succeeds.

1. Obtain a 120-byte allocation using `import_0(120, self->owner)`.
2. If it is non-null, initialize it with `import_1`, passing constant 242 and
   flag 1. The second argument is obtained by invoking the owner's method-table
   entry at offset `0x34`. Store the **return value of `import_1`**, not the
   original allocation, at offset `0x04`. On the null path, skip both indirect
   owner dispatch and `import_1`, and store the null `import_0` result there.
3. For selectors 0, 1, 2, and 3, in ascending order:
   - obtain `descriptor = import_2(builder, selector)`;
   - invoke the owner method at offset `0x34` again;
   - obtain `resource = import_3(owner_result, descriptor)`;
   - call `import_4(builder, selector, resource)`; and
   - store the resource in the corresponding word at offsets `0x08..0x14`.
4. Copy the six `.rodata` selector values 5, 6, 7, 8, 9, and 10 to a local
   six-word array. Iterate that array in order, performing the same descriptor,
   owner-method, `import_3`, and `import_4` sequence, and store the results at
   offsets `0x18..0x2C`.
5. If the builder is non-null, invoke its method-table entry at offset `0x04`,
   then write zero to the builder field at `0x04`.

The routine leaves `r0 == 0` on both the successful and null-builder paths.
Allocation failure is not otherwise a safe alternate contract: subsequent
imported operations still receive the null builder.

## Exact accepted-function code-shape contract

This section refines the behavioral contract with neutral code-generation
facts observed during comparison of the first authored object with the private
split target. They are required because equivalent register allocation and
instruction scheduling do not match this unit.

All three accepted bodies consist exclusively of 32-bit ARM instructions,
have no body relocation, and use direct `BL` calls for calls to accepted local
functions or the six veneer addresses. Method-table calls use `BLX r1`.

### `func_00000030`

The body contains 118 instructions. Its frame shape and persistent register
roles are exact:

- save `r4`, `r5`, `r6`, `r7`, and `lr` in one operation;
- copy `self` from `r0` to `r5` before allocating 28 stack bytes;
- use `r4` first for the allocation, then for unrolled descriptor/resource
  values, and finally as the six-entry loop index;
- use `r6` for the loop descriptor and resource;
- use `r7` as an invariant copy of `sp`; and
- do not save or use `r8`.

The initial call sequence is exact. Load `self->owner` into `r1`, put 120 in
`r0`, and directly call `import_0`. Copy its result to `r4` with a flag-setting
move and branch on equality to the common builder-store point. Only the
non-null path invokes `owner->method[0x34 / 4]`, then calls `import_1` with
`r0 = r4`, the indirect result in `r1`, `r2 = 242`, and `r3 = 1`. At the common
point set `r1 = 0`, store the current `r0` at `self + 0x04`, and immediately
call `import_2` without reloading `r0`. Thus the first descriptor call receives
the stored builder (the `import_1` result on success), not necessarily the
original allocation.

For exact encoding, the first owner load at function offset `0x0C` uses the
incoming `r0` as its base, not the equivalent saved `r5`. Immediately before
`import_1`, establish its remaining arguments in this order: set `r3 = 1`,
then `r2 = 242`, then copy `r4` to `r0`. (`r1` already holds the owner-method
result.)

Selectors 0, 1, and 3 are unrolled and use `r4` for both descriptor and
resource. For each, call `import_2`, call the owner method with the owner in
`r0`, pass its result in `r0` and the descriptor in `r1` to `import_3`, reload
the builder from offset `0x04`, pass `(builder, selector, resource)` to
`import_4`, and only then store the resource in the control object.
For each of those three `import_4` calls, establish `r2 = r4` before loading
the selector immediate into `r1`; reversing those two independent moves is not
the target schedule.

Selector 2 deliberately uses a different schedule: after `import_3`, store
the resource from `r0` at offset `0x10` before `import_4`; load the builder into
`r3`, copy the resource to `r2`, set `r1 = 2`, copy `r3` to `r0`, and call
`import_4`. No callee-saved register preserves that resource across this call.

The selector-table copy uses the full 28-byte frame while copying 24 bytes.
Load the table address into `r4`, copy its first five words together into
`r0`, `r1`, `r2`, `r3`, and `ip`, load the sixth separately into `r4`, store
that sixth word at `sp + 20`, then store the first five words together at
`sp + 0`. Set `r7 = sp` before the copy and set the loop index `r4 = 0` after
the copy.

Each loop iteration has this exact form:

1. reload the builder from `self + 0x04` and selector from
   `[r7 + r4 * 4]`, then call `import_2`;
2. preserve the descriptor in `r6`, perform the owner-method call, pass the
   descriptor in `r1`, call `import_3`, and preserve its result in `r6`;
3. reload both builder and selector, pass the resource in `r2`, and call
   `import_4`;
4. compute `self + r4 * 4` in `r0`, increment `r4`, compare it unsigned with
   6, store `r6` at computed-base `+ 0x18` **after the compare**, then branch
   back on carry-clear.

After the loop, reload the builder from offset `0x04`, compare it with zero,
and skip cleanup if null. Otherwise load its method table and entry at offset
`0x04`, call it with the builder already in `r0`, then set `r0 = 0` and clear
the builder field. Restore the 28-byte frame and the exact saved-register set.
The null skip also returns zero because the compared builder remains in `r0`.

### `func_0000020C`

The body contains 19 instructions and saves only `r4` and `lr`; `r4` holds
`self`. Use `r0` as the zero register. The stores occur in this exact order:

1. clear `+0x04`;
2. store incoming `r1` at `+0x00`;
3. clear `+0x08`;
4. clear `+0x18`, `+0x1C`, `+0x20`, `+0x24`, `+0x28`, and `+0x2C`;
5. clear `+0x0C`, `+0x10`, and `+0x14`.

Then copy `r4` to `r0`, directly call `func_00000030`, copy `r4` to `r0`
again, and return by restoring `r4` and `pc` together.

### `func_00000258`

The body contains 25 instructions. Save exactly `r4`, `r5`, `r6`, and `lr`,
and keep `self` in `r5`. Load the first resource through the incoming `r0`
before establishing the zero register. After the first `import_5` call, set
`r6 = 0`, clear offset `0x08`, then release and clear offsets `0x0C`, `0x10`,
and `0x14` in order. Set the loop index `r4 = 0` between the fourth call and
the clear of `0x14`.

The six-entry loop must be index-based, not pointer/count-based. Compute
`self + r4 * 4`, load its word at `+0x18`, and call `import_5`; increment `r4`,
compare it unsigned with 6, copy `self` to `r0`, write zero to offset `0x14`
again, and branch back on carry-clear. The copy to `r0` and repeated clear are
inside every iteration and occur after the compare. The repeated clear must
encode `r5` as its address base even though the immediately preceding move
makes `r0` equal to `r5`. Restore `r4`, `r5`, `r6`,
and `pc` together, with no padding or trailing instruction. This makes the
final `r0` value equal to `self` while leaving offsets `0x18..0x2C` unchanged.

## `func_0000020C`: control-object initialization

Arguments are `(self, owner)`. Store `owner` at offset `0x00`, clear every word
from `0x04` through `0x2C`, call `func_00000030(self)`, and return `self`.
The externally observable postcondition is a fully populated ten-resource
control object with no retained builder.

## `func_00000258`: control-object release

Argument `r0` is `self`; return `self`.

1. In ascending address order, call `import_5` on the four slots at offsets
   `0x08`, `0x0C`, `0x10`, and `0x14`, clearing each slot immediately after
   its call.
2. In ascending address order, call `import_5` on all six slots at offsets
   `0x18..0x2C`.
3. Preserve the target's observable clearing asymmetry: each iteration of the
   second loop writes zero to offset `0x14` again. It does **not** clear the six
   slots at `0x18..0x2C`.

This asymmetry is part of the byte/behavior contract and must not be silently
"fixed" by a clean-room implementation.

## Module control entry and data contracts

The target exports one ARM control entry at text address `0x2BC`. Its body is
interleaved with a five-word relocated jump table and a terminal literal pool,
so the current fail-closed inventory keeps its executable fragments as gaps
rather than representing a non-contiguous body as a conventional function.

For supported selectors 0 through 4, its neutral behavior is:

| Selector (`r1`) | Effect using `r0` |
| ---: | --- |
| 0 | write null to `*(uint32_t *)r0` |
| 1 | store `r0` in the module-global pointer |
| 2 | write the module-global pointer to `*(uint32_t *)r0` |
| 3 | write the one-past-`.text` address to both words at `r0[0]` and `r0[1]` |
| 4 | write the one-past-`.rodata` address to both words at `r0[0]` and `r0[1]` |

Selectors 0 through 4 return zero. The selector-1 operation and selector-2
query expose the sole four-byte `.data` object. Selector values outside this
range enter a 28-byte compiler/runtime residue containing three private
non-relocated literal words; no stable semantic contract is claimed for that
path. That path is a concrete remaining analysis blocker for a full clean-room
implementation and must remain unmatched until independently understood.

## Relocation contract

The link unit has exactly 17 `.text` relocations, all `R_ARM_ABS32`:

- six undefined anonymous-import relocations in the veneer slots at offsets
  `0x004`, `0x00C`, `0x014`, `0x01C`, `0x024`, and `0x02C`;
- one `.rodata + 0` reference at `0x208`;
- five `.text` references at `0x2D0`, `0x2D4`, `0x2D8`, `0x2DC`, and `0x2E0`,
  with addends `0x2E4`, `0x2EC`, `0x2F4`, `0x300`, and `0x310`
  respectively;
- one `.data + 0` reference at `0x344`;
- two `.text + 0x368` references at `0x34C` and `0x350`; and
- two `.rodata + 0x18` references at `0x354` and `0x358`.

Every relocation output lies wholly inside a declared pool; none overlaps an
accepted function. A complete implementation must preserve these targets,
addends, symbol classes, section sizes/alignments, the 24-byte selector table,
the four-byte writable global, and all remaining pool words exactly. It must
also retain the module's imported-symbol identities as the repository's CRO
link tooling represents them.

The split-object representation has these exact allocated section contracts:

- six four-byte executable veneer sections at `0x000`, `0x008`, `0x010`,
  `0x018`, `0x020`, and `0x028`, each followed in address order by a distinct
  four-byte allocatable pool section at `0x004`, `0x00C`, `0x014`, `0x01C`,
  `0x024`, or `0x02C`;
- a four-byte allocatable pool at `0x208` targeting the `.rodata` section
  symbol with addend zero;
- a 20-byte allocatable pool at `0x2D0` containing five relocations to the
  same `0x2E4` gap-section identity, with section-relative addends `0`, `8`,
  `0x10`, `0x1C`, and `0x2C`;
- a 36-byte allocatable pool at `0x344`, with relocations at pool offsets
  `0x00`, `0x08`, `0x0C`, `0x10`, and `0x14`. They target `.data + 0`, the
  pool's own section identity twice at one-past-pool addend `0x24`, and
  `.rodata + 0x18` twice, respectively. Pool offset `0x04` is an unrelocated
  zero word. The final three words remain private non-relocated literals and
  are not reproduced in this specification.

Each pool section is `SHT_PROGBITS`, allocatable and non-executable, with
byte alignment; each has one global `STT_OBJECT` symbol named from its public
`__cro_pool_<address>` identity and sized to the complete pool. `.rodata` is a
24-byte, four-byte-aligned allocatable section; `.data` is a four-byte,
four-byte-aligned writable allocatable section; the structural `.bss` is empty.

The six veneer relocations form six distinct undefined-global equality
classes in veneer order. A public implementation may call them `import_0`
through `import_5`. They must not collapse into one symbol or be reordered.

The converter's current anonymous-import spelling cannot be reconstructed
from the public slot addresses alone: its documented format includes the hex
encoding of an import-module string held only in the private CRO. Publishing
that spelling would publish a binary-derived string, so it is not part of this
specification. A safe reproducible alias mechanism is instead:

1. while producing the ignored split target, collect undefined symbols
   referenced by import relocations and sort their relocation outputs by
   public text/pool address;
2. preserve equality by grouping references which use the same original
   undefined symbol identity;
3. assign each first-seen equality class the module-scoped public alias
   `dll_contest_common_import_<ordinal>`; and
4. rewrite the ignored target symbol and its relocation references to that
   alias, requiring a bijection and the six slot-to-ordinal mappings
   `0x004 -> 0` through `0x02C -> 5` in address order.

This canonicalization changes only comparison-object symbol metadata, retains
all relocation outputs/addends and equality relationships, is deterministic,
and does not copy a private string into Git. The authored object already uses
these public aliases. Applying the same canonicalization to the ignored target
is preferable to embedding the converter's private-string-derived spellings
in source or configuration.

## Authored-object comparison evidence

The first authored comparison reported 66.611115% fuzzy code similarity, zero
of three exact functions, and 28 of 112 data bytes. The 28 matching data bytes
are exactly the complete 24-byte `.rodata` and four-byte `.data` payloads; no
pool relocation was yet an exact data match.

At equal word offsets, the authored and target accepted bodies matched as
follows (this records only equality locations, not target bytes):

| Function | Equal words | Total words | Equal half-open ranges |
| --- | ---: | ---: | --- |
| `func_00000030` | 11 | 118 | `0x10..0x18`, `0x168..0x16C`, `0x174..0x180`, `0x184..0x188`, `0x198..0x19C`, `0x1C0..0x1CC` |
| `func_0000020C` | 6 | 19 | `0x00..0x08`, `0x3C..0x4C` |
| `func_00000258` | 4 | 25 | `0x1C..0x20`, `0x28..0x2C`, `0x34..0x38`, `0x48..0x4C` |

The differences are explained by the code-shape requirements above: the
authored builder routine used a six-register save, a 24-byte frame, retained
the original allocation instead of the initializer return, and used different
unrolled/loop schedules; the initializer cleared fields in linear order; and
the release routine used a pointer/count loop plus an extra saved register and
trailing word. These are implementation discrepancies, not alternate target
behaviors.

After the second implementation round, `func_0000020C` was exact at 76/76
bytes. The builder reached 99.41525% fuzzy similarity and differed at exactly
nine word offsets: `0x0C`, `0x34`, `0x3C`, `0x74`, `0x78`, `0xB4`, `0xB8`,
`0x134`, and `0x138`. Offset `0x0C` is the equivalent-base-register choice;
`0x34`/`0x3C` are the `r3`/`r0` argument scheduling around an unchanged
`r2` move; and each of the final three pairs reverses the target order of the
independent `r2 = resource` and `r1 = selector` moves. The release routine
reached 99.8% and differed only at offset `0x58`, where the authored store used
the just-equalized `r0` base instead of the target's `r5` base. These ten
locations are encoding/schedule differences only.

The aggregate pool fuzzy score of 30.952381% has two structural causes. The
authored object has the first seven four-byte pools and the 20-byte jump-table
pool, but not the final 36-byte pool at `0x344`. In addition, the six import
slots carry the correct distinct equality pattern and zero addends but name
public aliases rather than the target converter's private-string-derived
undefined symbols. The `0x208` `.rodata` relocation and the five `0x2D0`
jump-table relocations already have the required public targets and addends.
Exact pool comparison therefore requires both the safe alias canonicalization
above and eventual independently justified ownership of the blocked final
pool; fuzzy similarity must not be interpreted as partial completion.

## Completion and validation requirements

This specification alone does not make the unit complete. An implementation
must pass the public inventory and semantic gates, isolated CRO build,
target/base split validation, exact objdiff comparison, and clean-repository
check. `metadata.complete` may become true only when the complete target and
base ELF objects are byte-identical, including all code fragments, pools,
`.rodata`, `.data`, relocations, symbols, and absence of unknown residue.
