# ARM runtime/helper batch 141

Source SHA-256: `27261f2b16c083693e7c0c27311f1d4ec9c2624f37791c80ae7cea6126ba503b`.

## Scope

This clean-room batch covers seven related ARMv6K record-selection wrappers
totaling 224 executable bytes and 56 instructions. Each wrapper selects a
record through the shared public identity `func_004D83F4`; six use selector
zero and expose a field or normalized bit, while one forwards a checked
two-way selector and returns a halfword.

The aggregate schedule contains 21 memory operations, one local branch, seven
direct calls, and seven stack returns. It owns no adjacent bytes and contains
no literal pool, PC-relative data access, indirect call, indirect tail, or
direct tail.

## Boundary inventory

| Function | Bytes | Instructions | Call offset | Result operation |
| --- | ---: | ---: | ---: | --- |
| `func_004D851C` | 32 | 8 | `+0x08` | halfword at `+38` equals 10 |
| `func_004D86C8` | 28 | 7 | `+0x08` | word bit 13 at `+40` |
| `func_004D86E4` | 24 | 6 | `+0x08` | low ten bits of halfword at `+28` |
| `func_004D8710` | 28 | 7 | `+0x08` | halfword bit 6 at `+30` |
| `func_004D8748` | 28 | 7 | `+0x08` | low ten bits at `+28`, plus one |
| `func_004D8764` | 28 | 7 | `+0x08` | halfword bit 10 at `+32` |
| `func_004D87E8` | 56 | 14 | `+0x2c` | halfword at `+24` for selector 0 or 1 |

Each body occupies one 4-byte-aligned `.text.<function>` AX PROGBITS section.
The global function symbol spans exactly the stated body, with one ARM mapping
symbol at offset zero and no padding or adjacent ownership. The first and last
bodies are followed by public globals after gaps of 368 and 64 bytes,
respectively; those gaps are deliberately excluded from this batch.

## Call and control-flow contract

Every function has exactly one `bl func_004D83F4`, represented by an ordered
`R_ARM_CALL` relocation. All seven relocations reuse that single undefined
global identity. `func_004D87E8` has the batch's only local branch: an unsigned
selector check from `+0x10` to `+0x24`. Its invalid-selector path preserves the
observed zero-register preparation and ARM `mov r0, r0` padding instruction.

All other bodies are straight-line after their call. Each function has one
stack-return site and the exact register, immediate, field-width, mask, shift,
and condition-code schedule shown in the public assembly.

## Implementation and validation contract

- Preserve all 56 instruction words, function boundaries, section order,
  register choices, conditions, field offsets, masks, shifts, and the single
  local branch target.
- Emit exactly seven ordered `R_ARM_CALL` relocations to `func_004D83F4`, with
  no other relocation or global identity.
- Emit no indirect transfer, direct tail, literal pool, PC-relative data
  access, padding, adjacent payload, or foreign executable section.
- Keep all owned intervals disjoint from every recursively discovered public
  source and configuration owner.
- Pin the complete source and configuration, validate ELF bounds and metadata,
  body hashes, every instruction word, mapping/function symbols, relocation
  sites and identity, and aggregate control-flow counts.
- When an authoritative target object is supplied, resolve each public call
  relocation from the function's neutral address and require every resulting
  body byte to equal the corresponding target section.
- The hostile self-test must reject every single instruction-word mutation,
  relocation offset/type/identity mutations, section growth, wrong machine,
  truncation, and oversize input, while accepting a bounded composite with
  12,000 unrelated empty executable sections.

The committed source, configuration, validator, and this specification contain
only authored assembly and neutral metadata. No target object, extracted game
payload, asset, private path, or copied executable byte stream is tracked.
