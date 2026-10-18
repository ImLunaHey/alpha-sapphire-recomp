# DllGameSync remaining accepted functions, batch 01

## Scope and provenance

This analysis specification covers the four unmatched accepted ARM functions
in `cro/DllGameSync` for Pokémon Alpha Sapphire revision `AS_EUR_REV2`. It was
recorded on **2026-10-18** as direct reverse-engineering analysis. It may be
used as a handoff or implemented by the same contributor under the repository's
transparent direct-reverse-engineering path.

- Input: the contributor's lawfully obtained `DllGameSync.cro`, SHA-256
  `f50a4500ab2d69bd1263bcba21e7b52f01b1cbfdf247968ec11bd660d2a4ea1e`,
  stored outside the checkout.
- Derived target object: SHA-256
  `bd1684906223e975feb3d325c3fcb355617f90b77aa842f03d053ded06c3e831`.
- Tools: Ghidra 11.3.2 with processor `ARM:LE:32:v6`, GNU binutils 2.44,
  Node.js 24.21.0, and the repository's committed CRO inventory and partition
  tools.
- Method: inspect control flow, calls, scalar constants, object-field accesses,
  and stack-built argument records for only the four accepted functions. The
  private decompiler output and instruction listing were not copied into the
  repository.

The collaborator names below are the neutral anonymous import identifiers
already emitted by the repository's target conversion. They intentionally do
not claim original names or higher-level types. `u8`, `u32`, and `s16` denote
8-bit unsigned, 32-bit unsigned, and 16-bit signed values. An offset such as
`+0x80` is relative to the first object argument.

## `func_00001C84` — conditional teardown and finalization

The function accepts an object pointer and returns `0` while teardown must be
deferred, otherwise `1` after finalization.

1. If `+0xF4` is non-null, call import `s0_03e6ec4`. If that returns nonzero,
   call `s0_033bc00` and return `0`. Otherwise call `s0_033c800` and then
   `s0_033c834`, passing the `+0xF4` pointer to each.
2. Independently release each non-null pointer at `+0xF8`, `+0xFC`, and
   `+0x100` through `s0_00397b8`, clearing its field after the call.
3. If `+0xF4` remains non-null, invoke the object's indirect operation at
   vtable offset `+0x10`, then clear `+0xF4`.
4. If the `u32` counter at `+0x138` is nonzero, decrement it and return `0`.
5. Call `s0_003ac24`. Pass `13` to `s0_002bb5c`, then pass its result and
   `0x2000` to `s0_003abac`.
6. If the `u32` count at `+0x108` is nonzero, obtain the root from
   `s0_004e348`, follow its `+0x1C` pointer, add `0x1FDE0`, and call
   `s0_03645ec` on that address exactly `count` times. Clear `+0x108`.
7. If `+0x12C` is nonzero, obtain the same root, follow `+0x1C`, and add
   `0x1C8D4` to form a buffer. Determine its length with
   `s0_00765b8(buffer, 0x41)`. Then call
   `s0_0363bfc(buffer, 0x41, length - field_12C)` followed by
   `s0_0363b64(buffer, 0x3F, field_12C)`. Clear `+0x12C`.
8. Call `s0_033d124` with `+0x114`. Obtain the root again, follow `+0x1C`,
   add `0x1FDE0`, call `s0_0364334` on that address, and return `1`.

The three early-release fields are tested separately. The countdown occurs
after all four resource fields have been processed and before finalization.

## `func_00002120` — per-frame step

The function accepts an object pointer and returns either `0xFFFFFFFF` or the
result of `s0_025e160`.

1. Call `s0_023dc40` unconditionally.
2. If `+0x80` is non-null, call `s0_025629c`.
3. Initialize the result to `0xFFFFFFFF`. If `+0x84` is non-null, replace it
   with the result of `s0_025e160`.
4. If byte `+0x88` is nonzero, call `s0_0261428` with `+0x5C`; clear the byte
   only when that call returns zero.
5. Call `func_00003564` with the object, then call `s0_0261dfc` with `+0x5C`.
6. If byte `+0x99` is zero, set it to one and call
   `s0_02617d8(field_5C, 1, 0x52)`.
7. Return the saved result from step 3.

## `func_00003564` — one-shot coordinate request

This void function performs no work unless byte `+0x89` is nonzero and byte
`+0x88` is zero. On entry to the active path it clears `+0x89`.

1. Request two four-word coordinate records into separate local buffers via
   `s0_03c4b48(first, object, 1, 0x83)` and
   `s0_03c64b8(second, object, 1, 0x83)`.
2. Compute two signed 16-bit coordinates:
   `x = trunc_s16(first[0] + abs(second[2] - second[0]) * 0.5f)` and
   `y = trunc_s16(first[1] - abs(second[3] - second[1]) * 0.5f)`.
   The absolute-value comparison follows ordinary VFP comparison behavior;
   unordered values are not negated.
3. Call `s0_004e348`, then save the result of `s0_000e088`.
4. Call `s0_003f48c(0x0C, *(field_74 + 4), 1)`. If it returns null, store
   null at `+0x84` and return.
5. Otherwise obtain `a = s0_02623d8(field_5C, 1)`,
   `b = s0_03c4bf0(object)`, and `c = s0_03c4c04(object)`. Call
   `s0_025e1a8(allocation, *(field_74 + 4), *(field_74 + 8), saved,
   c, b, a, 0, 1, x, y, 0, 0, 0)`.
6. Store that call's result at `+0x84`.

The two scalar constants used in step 2 are exactly `0.0f` and `0.5f`.

## `func_00003714` — construction and registration

The function accepts two arguments, delegates allocation/base construction to
`s0_023df9c(arg0, arg1, 0)`, initializes the returned object, performs service
registration, and returns that same object pointer.

Initial object state is:

- vtable/reference word `+0x00`: literal-pool slot `0x3988[0]`;
- `+0x74 = arg1`;
- bytes `+0x78`, `+0x88`, `+0x89`, `+0x90`, `+0x91`, `+0x98`, and `+0x99`
  are zero;
- words `+0x80`, `+0x84`, `+0x94`, `+0xA0`, and `+0xA4` are zero;
- `+0x8C` receives the result of invoking vtable operation `+0x0C` on the
  object at `**(s0_004e348() + 0x1C) + 0x1FDE0`.

After initialization, perform these calls in order:

1. `s0_023da5c(object, arg1, 1)`.
2. `s0_023ddac(object, arg1, 0, 2, pool_3988[1] - 0x50, 4,
   pool_3988[1], 2, 0x7D, 1, 0, 8)`.
3. Call `s0_004e348`, save `s0_000e088()`, then call
   `s0_0262508(field_5C, saved, 1, pool_3988[2], field_74, 1)`.
4. Call `s0_03c4c04(object)` and pass its result to
   `s0_02619f0(field_5C, result, 1, 1, pool_3988[3], field_74, 0)`.
5. `s0_0262010(field_5C, 1, pool_3988[4], 5)`.
6. Call `s0_03c4bdc(object, 1)`, then call
   `s0_023b840(object, arg1, result, pool_3988[5], 0x0B)`.

Next build a local request record. Its first three scalar values are the
single-precision literal at pool `0x3988[6]`; set its size/control word to
`0x10`, enabled bytes to one, sentinel word to `0xFFFFFFFF`, and copy
`*(field_74 + 4)`, `*(field_74 + 8)`, and `*(field_74 + 0x10)` into the three
associated identity fields. Prefix the record with results from
`s0_03c4c04(object)` and `s0_03c4bf0(object)`, followed by the nine words
returned from `s0_02623d8(field_5C, 1)`.

Overwrite the record's first three scalar values with the three-word result of
`s0_03c4b48(out, object, 1, 0x81)` and clear the record's later enabled byte.
Allocate `0x80` bytes with `s0_0023480(0x80, *(field_74 + 4))`; if allocation
succeeds, replace it with `s0_025c448(allocation, &record)`. Store the final
pointer, including null on failure, at `+0x80`.

Finally, call `s0_004e348`, follow its `+0x1C` pointer and add `0x129A0`, pass
that address to `s0_03ea7f8`, and store its two-word result at `+0xA0` and
`+0xA4`. Call `s0_023bc90(object, 1)` and return the object.

The literal-pool words are referenced symbolically because their relocation
identity, rather than target bytes copied into source, is the relevant
implementation contract.

## Acceptance boundary

An implementation may claim these functions when its provenance is recorded,
it builds through the standard CRO source registry, and each function receives
an exact local objdiff match. Whole-unit completion additionally requires all five accepted
functions to report exact and the aggregate publication checks to pass. This
specification does not authorize copying executable gaps, pools, unknown
ranges, or non-text data into source.
