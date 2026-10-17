# ARM runtime/helper batch 143

Source SHA-256: `9d4c1c03b8f1f7c13b67f7d1ba2daabdae7494f078f940840ff759ae488da835`.

## Scope

This clean-room batch covers seven related ARMv6K state-query wrappers
totaling 372 executable bytes and 93 instructions. The functions operate on a
shared context layout whose working object is loaded from receiver offset 12.
They count or find one of four indexed records, combine several state probes,
normalize flags, and expose two compound readiness predicates.

The aggregate schedule contains 27 memory operations, eight local branches,
12 direct calls, and eight stack returns. It owns no adjacent bytes and
contains no literal pool, PC-relative data access, indirect transfer, or tail
transfer.

## Boundary inventory

| Function | Bytes | Instructions | Calls | Local branches | Behavior |
| --- | ---: | ---: | ---: | ---: | --- |
| `func_004D2710` | 64 | 16 | 1 | 1 | count true probes across four byte-sized indices |
| `func_004D29EC` | 68 | 17 | 3 | 1 | map three ordered state probes to states 0, 1, or 2 |
| `func_004D2A30` | 52 | 13 | 2 | 2 | test two masks from repeated state reads |
| `func_004D2B3C` | 44 | 11 | 2 | 1 | gate a byte result on state value 676 |
| `func_004D2E74` | 28 | 7 | 1 | 0 | invert a zero/nonzero state result |
| `func_004D3278` | 68 | 17 | 1 | 2 | find a requested value across four indices |
| `func_004D32BC` | 48 | 12 | 2 | 1 | combine availability and readiness probes |

Each body occupies one 4-byte-aligned `.text.<function>` AX PROGBITS section.
The global function symbol spans exactly the stated body, with one ARM mapping
symbol at offset zero. `func_004D2710` is followed by a public global after a
580-byte gap; that gap and every other byte outside the seven bodies are
deliberately excluded.

## Call and control-flow contract

The 12 ordered `R_ARM_CALL` relocations target nine public identities:

| Identity | Sites |
| --- | ---: |
| `func_0012FB6C` | 1 |
| `func_0012FB9C` | 1 |
| `func_0012FBD0` | 1 |
| `func_00153174` | 1 |
| `func_001532E0` | 2 |
| `func_00153314` | 2 |
| `func_0016BC74` | 1 |
| `func_004D1330` | 2 |
| `func_004D1ED0` | 1 |

All branch targets that remain inside a body are fully resolved. The two loop
functions preserve their exact unsigned loop bounds, byte normalization,
early-return structure, and—in `func_004D3278`—the observed architectural
`nop` between comparison and branch. The other five functions preserve their
exact conditional moves and early exits. Six bodies have one return and
`func_004D3278` has two, producing eight stack-return sites in total.

## Implementation and validation contract

- Preserve all 93 instruction words, section order, register allocation,
  immediates, condition codes, eight local branch targets, and every return.
- Emit exactly 12 ordered `R_ARM_CALL` relocations at the declared sites and
  to the exact nine identities above; emit no other global identity or
  relocation.
- Emit no adjacent payload, literal pool, PC-relative data access, indirect
  transfer, direct tail, or foreign executable section.
- Keep all seven owned intervals disjoint from every recursively discovered
  public source and configuration owner.
- Pin the complete source and configuration and validate bounded ELF metadata,
  exact body hashes and words, mapping/function symbols, relocation schedules,
  and aggregate control-flow counts.
- When an authoritative target object is supplied, resolve every call from its
  public neutral address and require every resulting body byte to equal its
  corresponding target section.
- The hostile self-test must reject every single instruction-word mutation,
  relocation offset/type/identity mutations, section growth, wrong machine,
  truncation, and oversize input, while accepting a bounded composite with
  12,000 unrelated empty executable sections.

The committed source, configuration, validator, and specification contain only
authored assembly and neutral metadata. No target object, extracted game
payload, asset, private path, or generated executable artifact is included.
