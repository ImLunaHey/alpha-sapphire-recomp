# ARM duplicate-template batch 85

Source SHA-256: `642d7d6451d580d659dc3ffbd29516e85d00e7cf46b0e3b380ff3f5e5cf02d53`.

## Scope

This clean-room batch owns four previously unmatched ARMv6K function bodies
forming two genuine repeated schedules. The complete bodies total 352 bytes
and 88 instructions. Normalizing only each symbolic ARM call displacement
produced exactly two equivalence classes, and independent assembly makes each
pair byte-identical before relocation.

| Template | Functions | Bytes each | Instructions each | Calls each |
| --- | --- | ---: | ---: | ---: |
| `prepare_pair` | `func_001512AC`, `func_0043ED88` | 28 | 7 | 1 |
| `register_matrix` | `func_003E6C30`, `func_003E7354` | 148 | 37 | 7 |

Together the bodies contain 20 memory operations and 16 direct calls. They
contain no local branch, PC-relative data access, literal pool, indirect
transfer, explicit return, adjacent byte, data, asset, or string.

## Repeated schedules

`prepare_pair` preserves two arguments, derives a field at offset eight,
selects the fixed value 104, and calls `func_00301FBC`. Both instances have
the same seven-instruction schedule.

`register_matrix` performs four registrations with selectors 99, 68, 70,
and 72 through `func_003617D8`; publishes a stack argument and performs an
extended registration through `func_00362998`; combines two object fields for
`func_0034679C`; narrows the result to 16 bits; and calls `func_0014E348`.
Both instances have the same 37-instruction schedule.

Each accepted public boundary ends on a linked direct call. The batch
deliberately preserves those boundaries and does not invent a stack epilogue
or classify the terminal `bl` as a non-linking tail. Returning from that call
continues at the following public global, exactly as required by the current
boundary inventory.

## Relocation contract

All 16 symbolic transfers use ordered REL `R_ARM_CALL` relocations:

- two sites target `func_00301FBC`;
- eight sites target `func_003617D8`;
- two sites each target `func_00362998`, `func_0034679C`, and
  `func_0014E348`.

No other relocation or external identity is permitted. Each body occupies a
four-byte-aligned `.text.<function>` AX PROGBITS section with one ARM mapping
symbol and an exact global function span.

## Validation contract

Validation pins source and configuration hashes, all four body hashes, both
template equivalence classes, distinct template hashes, boundaries,
next-global offsets, section order and metadata, symbols, mapping state, and
every relocation site, type, and identity. Recursive ownership scans reject
another source definition or any overlapping configured interval.

The self-test rejects mutations to all 88 instruction words, relocation
offset/type/identity fields, section extent, primary symbol value, truncation,
and resource bounds, while accepting a bounded 12,000-section composite. The
private comparison mode resolves only the 16 configured symbolic calls from
their public addresses and requires all reconstructed bytes to equal the
authoritative target sections: 4 of 4 functions and 352 of 352 bytes. No
private path, raw target sequence, target hash, ROM, or generated target
object is stored in the repository.
