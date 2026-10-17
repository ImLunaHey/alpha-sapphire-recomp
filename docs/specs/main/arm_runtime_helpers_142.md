# ARM runtime/helper batch 142

Source SHA-256: `7e57188a58493187b9f7301e19126c33a0fdee14965b8db54ed9e50ebc067018`.

## Scope

This clean-room batch covers seven previously unmatched ARMv6K runtime helpers
in the disjoint public entry band `[0x00566000, 0x00576000)`. The complete
bodies total 656 executable bytes and 164 instructions. They implement linked
record traversal, guarded dispatch, record insertion, dynamic allocation,
capacity reduction, element destruction, and release loops.

The batch owns no adjacent bytes, literal pool, data, asset, string, or private
container material. It has 57 memory operations, 17 local branches, 11 direct
transfers, three indirect calls, and eight returns. No body contains a
PC-relative data access, indirect tail, or unowned executable payload.

## Boundary inventory

| Function | Bytes | Instructions | Memory operations | Local branches | Direct transfers | Indirect calls | Returns |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `func_00566B14` | 76 | 19 | 7 | 1 | 2 | 0 | 2 |
| `func_0056D0B8` | 96 | 24 | 7 | 3 | 2 | 1 | 1 |
| `func_0056E1D8` | 124 | 31 | 17 | 1 | 2 | 0 | 1 |
| `func_0056E5C4` | 112 | 28 | 10 | 2 | 2 | 0 | 1 |
| `func_0056FA6C` | 120 | 30 | 6 | 5 | 1 | 1 | 1 |
| `func_0057145C` | 64 | 16 | 6 | 2 | 1 | 1 | 1 |
| `func_005753F4` | 64 | 16 | 4 | 3 | 1 | 0 | 1 |

Every body ends exactly at its next public global. Each body occupies one
four-byte-aligned `.text.<function>` AX PROGBITS section and has one ARM
mapping symbol at offset zero.

## Transfer contract

The assembled object has nine ordered `R_ARM_CALL` relocations and two ordered
conditional `R_ARM_JUMP24` relocations. The latter preserve `bleq` and `blne`
conditions while retaining link semantics. The relocations name these public
identities:

- `func_00566B14`, `func_0020542C`, `func_001765F4`, and `func_00170F08`;
- `func_0018D65C`, `func_00205374`, `func_00184990`, and `func_00302108`;
- `func_00160F9C`.

The validator also pins the three `blx r1` sites, all local branch targets,
the early `bxeq lr`, and all seven stack returns. The recursive call in
`func_00566B14` remains a symbolic relocation rather than being folded into a
section-relative encoding.

## Validation contract

Validation pins the source and configuration hashes, every complete-body
hash, function and next-global boundaries, section order and metadata, symbol
spans, ARM mapping symbols, relocation order/type/identity, and aggregate
control-flow counts. Recursive repository scans reject another source
definition or any overlapping configured ownership interval.

The self-test mutates every instruction word, relocation fields, section
extent, primary symbol value, truncation points, and resource caps. It also
accepts a bounded 12,000-section composite so unrelated repository growth
does not weaken the checks. The private comparison mode resolves only the
configured symbolic ARM transfers from their public addresses, then requires
all seven reconstructed bodies to equal the authoritative target sections:
7 of 7 functions and 656 of 656 bytes. No private path, target byte sequence,
target hash, ROM, or generated target object is stored in the repository.
