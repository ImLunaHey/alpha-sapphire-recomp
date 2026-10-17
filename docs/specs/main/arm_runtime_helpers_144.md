# ARM runtime/helper batch 144

Source SHA-256: `b471616c22bbedf785ad6f48f26953f7c90307f278f8500d626c1bb1c68006f0`.

## Scope

This clean-room batch covers seven related ARMv6K guarded member-access
wrappers totaling 348 executable bytes and 87 instructions. Every body brackets
one typed member lookup between the shared access-begin identity
`func_00168EC0` and access-end identity `func_00168E50`, preserves the selected
value across cleanup, and returns it in `r0`.

The aggregate schedule contains 22 memory operations, one local branch, 21
direct calls, and seven stack returns. It owns no adjacent bytes and contains
no literal pool, PC-relative data access, indirect transfer, or tail transfer.

## Boundary and result inventory

| Function | Bytes | Instructions | Resolver | Result |
| --- | ---: | ---: | --- | --- |
| `func_004D1DD8` | 56 | 14 | `func_00176EFC`, selector 1 | byte `+27` normalized to Boolean |
| `func_004D1ED0` | 44 | 11 | `func_0016BC84`, selector 0 | word `+52` |
| `func_004D20EC` | 44 | 11 | `func_0016BC84`, selector 0 | word `+4` |
| `func_004D225C` | 60 | 15 | `func_00176EFC`, selector 0 | byte `+54`, guarded by receiver word `+4` |
| `func_004D23EC` | 52 | 13 | `func_0016BD00`, selector 0 | bit 30 of word `+52` |
| `func_004D244C` | 44 | 11 | `func_0016BC84`, selector 0 | halfword `+2` |
| `func_004D24AC` | 48 | 12 | `func_0016BD80`, selector 0 | bit 7 of byte `+45` |

Each body occupies one 4-byte-aligned `.text.<function>` AX PROGBITS section.
The global function symbol spans exactly the stated body, with one ARM mapping
symbol at offset zero. Gaps after `func_004D1ED0`, `func_004D20EC`,
`func_004D23EC`, and `func_004D24AC` are deliberately excluded; the batch owns
only the seven bodies listed above.

## Call and control-flow contract

Each function emits exactly three ordered `R_ARM_CALL` relocations: access
begin, its declared resolver, and access end. Across the batch this produces:

| Identity | Sites |
| --- | ---: |
| `func_00168E50` | 7 |
| `func_00168EC0` | 7 |
| `func_0016BC84` | 3 |
| `func_0016BD00` | 1 |
| `func_0016BD80` | 1 |
| `func_00176EFC` | 2 |

`func_004D225C` contains the only local branch, from `+0x10` to its return at
`+0x38`; when the guard is false, it skips all three calls. All other bodies
are straight-line. The exact destination register, field width, offset,
normalization operation, selector, saved-register layout, and return sequence
remain part of the contract.

## Implementation and validation contract

- Preserve all 87 instruction words, function boundaries, section order,
  registers, immediates, conditions, result conversions, the local branch, and
  all seven returns.
- Emit exactly 21 ordered `R_ARM_CALL` relocations at the declared sites and
  to the exact six identities above; emit no other relocation or global
  identity.
- Emit no adjacent payload, literal pool, PC-relative data access, indirect
  transfer, direct tail, or foreign executable section.
- Keep all owned intervals disjoint from every recursively discovered public
  source and configuration owner.
- Pin the complete source and configuration; validate bounded ELF metadata,
  exact body hashes and words, mapping/function symbols, relocation schedules,
  manifest totals, and aggregate control flow.
- When an authoritative target object is supplied, resolve every call from its
  public neutral address and require every resulting body byte to equal the
  corresponding target section.
- The hostile self-test must reject every single instruction-word mutation,
  relocation offset/type/identity mutations, section growth, wrong machine,
  truncation, and oversize input, while accepting a bounded composite with
  12,000 unrelated empty executable sections.

The committed source, configuration, validator, and specification contain only
authored assembly and neutral metadata. No target object, extracted game
payload, asset, private path, or generated executable artifact is included.
