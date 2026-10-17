# ARM IPC/synchronization wrapper batch 108

Source SHA-256: `a74324b72d75fa3100f985cbbd120d2606d631b6d9b22d6fe3c224b7e2a5daaa`.

## Scope

This clean-room batch covers two previously unmatched ARMv6K wrappers that
cross the supervisor-call boundary while coordinating public helper calls.
Their complete bodies total 488 executable bytes and 122 instructions. They
are the only current unowned, unmatched ARM supervisor-call bodies of at most
400 bytes whose accepted extents contain no PC-relative literal or data
access.

| Function | Bytes | Instructions | Supervisor call | Direct transfers | Indirect calls |
| --- | ---: | ---: | --- | ---: | ---: |
| `func_0012684C` | 156 | 39 | conditional operation 35 | 4 | 0 |
| `func_0042F9EC` | 332 | 83 | operation 25 | 13 | 2 |

Together they contain 26 memory operations, nine local branches, 17 direct
transfers, two indirect calls, and two stack returns. They own no adjacent
bytes, literal pool, data, asset, string, direct tail, or indirect tail.

## Nullable-output and handle wrapper

`func_0012684C` preserves its register arguments and loads two further stack
arguments. It substitutes local stack slots for nullable output pointers,
normalizes the paired buffer arguments, obtains two helper-provided values,
and calls the public worker `func_00133D18`. A temporary handle in the local
slot is closed through conditional supervisor operation 35 before cleanup via
`func_00126414`. The worker result is preserved across that cleanup and
returned.

Its four ordered direct calls target `func_001260B4`, `func_00126000`,
`func_00133D18`, and `func_00126414`. The body has no local direct branch or
indirect transfer.

## Serialized callback wrapper

`func_0042F9EC` enters a synchronization object through `func_001602B8`,
performs supervisor operation 25 on its stored handle, conditionally reports
that result through `func_001603A0`, and selects one of two result-producing
paths. It preserves two local result slots, releases synchronization through
`func_00160380`, and conditionally invokes object callbacks through `blx r3`
or `blx r1`. Both indirect destinations are loaded through the object's public
dispatch structure rather than embedded addresses.

The function has nine resolved local branches. Five direct calls target
`func_001602B8`, four target `func_00160380`, and one each targets
`func_001603A0`, `func_00145550`, `func_0010EB54`, and `func_00145614`.
The conditionally linked `blne func_001603A0` uses `R_ARM_JUMP24`; the other
16 symbolic transfers use `R_ARM_CALL`.

## Object and validation contract

Each body occupies one four-byte-aligned `.text.<function>` AX PROGBITS
section, has one ARM mapping symbol at offset zero, and ends exactly at its
next public global. Validation pins the source and configuration hashes,
complete-body hashes, boundaries, section order and metadata, function spans,
all nine local branch destinations, both supervisor-call numbers and
conditions, both indirect-call registers, both return sites, and all 17
relocation sites, types, and identities.

Recursive repository scans reject another source definition or an overlapping
configured ownership interval. The self-test rejects mutations to every one
of the 122 instruction words, relocation fields, section extent, primary
symbol state, truncation points, and resource caps, while accepting a bounded
12,000-section composite.

The private comparison mode resolves only the configured symbolic ARM
transfers from their public addresses and requires both reconstructed bodies
to equal their authoritative target sections: 2 of 2 functions and 488 of
488 bytes. No private path, raw target sequence, target hash, ROM, or generated
target object is stored in the repository.
