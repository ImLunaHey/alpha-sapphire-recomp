# ARM linker veneers in the `0x0019BFxx` region

## Scope and clean-room classification

This specification covers 285 inventory entries. Each entry is a linker-created
ARM veneer rather than an independently authored gameplay routine. The exported
function symbol covers one four-byte instruction, while the absolute destination
literal occupies the following four-byte slot outside the Ghidra function body.

Every veneer has the same observable behavior:

- preserve all registers and flags except the program counter;
- load the program counter from the adjacent literal slot; and
- tail-transfer to the ARM function named `func_0050DDA0`.

The adjacent literal for every entry resolves exactly to the inventoried ARM
entry point `func_0050DDA0`. None resolves into the middle of a function, to a
Thumb entry point, or outside the inventoried text functions.

`func_0050DDA0` is itself a four-byte direct-branch thunk to the inventoried ARM
function `func_00146000`. Keep that additional thunk as a separate symbol rather
than folding it into these veneers. The instruction-plus-slot layout is
consistent with import/resolver veneers whose slots can be fixed up by a linker
or loader; the static image alone does not prove whether these particular slots
are subsequently rewritten at runtime.

The complete inventory contains 332 four-byte ARM entries: these 285 veneers,
20 return instructions, and 27 direct-branch thunks. The latter two classes are
not covered here.

## Covered symbols

Each inclusive range below advances by eight bytes. The function name is
`func_` followed by the eight-digit uppercase address. The range counts sum to
285.

| Start | End | Count |
| --- | --- | ---: |
| `func_0019BFD8` | `func_0019BFE8` | 3 |
| `func_0019BFF8` | `func_0019C088` | 19 |
| `func_0019C098` | `func_0019C128` | 19 |
| `func_0019C138` | `func_0019C138` | 1 |
| `func_0019C148` | `func_0019C148` | 1 |
| `func_0019C158` | `func_0019C1F8` | 21 |
| `func_0019C208` | `func_0019C230` | 6 |
| `func_0019C240` | `func_0019C258` | 4 |
| `func_0019C270` | `func_0019C280` | 3 |
| `func_0019C290` | `func_0019C2A0` | 3 |
| `func_0019C2B0` | `func_0019C2C0` | 3 |
| `func_0019C2D0` | `func_0019C2E8` | 4 |
| `func_0019C2F8` | `func_0019C308` | 3 |
| `func_0019C318` | `func_0019C338` | 5 |
| `func_0019C348` | `func_0019C380` | 8 |
| `func_0019C3B0` | `func_0019C408` | 12 |
| `func_0019C428` | `func_0019C498` | 15 |
| `func_0019C4B0` | `func_0019C4B0` | 1 |
| `func_0019C4C0` | `func_0019C578` | 24 |
| `func_0019C598` | `func_0019C598` | 1 |
| `func_0019C5C0` | `func_0019C6E0` | 37 |
| `func_0019C6F8` | `func_0019C728` | 7 |
| `func_0019C740` | `func_0019C740` | 1 |
| `func_0019C760` | `func_0019C760` | 1 |
| `func_0019C7B0` | `func_0019C860` | 23 |
| `func_0019C870` | `func_0019C8B0` | 9 |
| `func_0019C8C8` | `func_0019CA10` | 42 |
| `func_0019CA88` | `func_0019CAA8` | 5 |
| `func_0019CAB8` | `func_0019CAD0` | 4 |

Addresses omitted between ranges are not covered by this specification.

## Relocatable implementation design

Implement these in a hand-authored preprocessed assembly source, one section per
veneer. For each symbol:

1. open an executable ARM section named `.text.<symbol>` aligned to four bytes;
2. declare a global function symbol at the section start;
3. emit an indirect PC load whose address is the adjacent local literal label;
4. close the function size immediately after that instruction so its ELF size is
   four bytes; and
5. emit the adjacent literal as `.word func_0050DDA0`.

Step 5 must produce an `R_ARM_ABS32` relocation against `func_0050DDA0`. Do not
spell an executable address or copy a target word into source. Keeping the local
literal outside the function's ELF size accurately represents the linker's
veneer layout while retaining the destination relationship in relocatable form.

The base build must assemble `.S` inputs with the same ARMv6K/MPCore target as
the C inputs and include the resulting object in the relocatable aggregate.

## Probe result

A temporary ignored probe for `func_0019BFD8` used the design above. Its ELF
function size was four bytes, the adjacent word carried one `R_ARM_ABS32`
relocation to `func_0050DDA0`, and objdiff reported the function as 100% matched
against the private target object. This validates feasibility for the shared
veneer shape; the complete 285-symbol implementation still requires a full
report run.
