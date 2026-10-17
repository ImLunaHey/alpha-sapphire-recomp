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
| `import_1` | `(builder, owner_method_0x34(owner), 242, 1)` | initializes a non-null builder |
| `import_2` | `(builder, selector)` | returns a selector-specific descriptor |
| `import_3` | `(owner_method_0x34(owner), descriptor)` | returns an owned resource pointer |
| `import_4` | `(builder, selector, resource)` | associates the resource with the builder selector |
| `import_5` | `(resource)` | releases one resource; calls are unconditional, including for null slots |

## `func_00000030`: resource construction

Precondition: `r0` points to a writable control object whose owner field is
valid. Under the normal contract, `import_0` succeeds.

1. Allocate a 120-byte transient builder using `import_0(120, self->owner)`
   and store it at offset `0x04`.
2. If it is non-null, initialize it with `import_1`, passing constant 242 and
   flag 1. The second argument is obtained by invoking the owner's method-table
   entry at offset `0x34`.
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

On the successful path the routine leaves `r0 == 0`. Allocation failure is not
a safe alternate contract: subsequent imported operations still receive the
null builder.

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

## Completion and validation requirements

This specification alone does not make the unit complete. An implementation
must pass the public inventory and semantic gates, isolated CRO build,
target/base split validation, exact objdiff comparison, and clean-repository
check. `metadata.complete` may become true only when the complete target and
base ELF objects are byte-identical, including all code fragments, pools,
`.rodata`, `.data`, relocations, symbols, and absence of unknown residue.
