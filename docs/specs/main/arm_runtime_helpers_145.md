# ARM runtime/helper batch 145

Source SHA-256: `b0b926cf9293244125aef0d5e8344b7ba134ecd285f43641cbd7ea67831ab6b7`.

## Scope

This clean-room batch covers six unmatched ARMv6K runtime helpers totaling 340
executable bytes and 85 instructions. Five are related state-access helpers
that select, transform, or normalize values; the sixth copies a fixed-size
record and its leading halfword metadata.

The aggregate schedule contains 24 memory operations, three local branches,
17 direct calls, and seven stack returns. It owns no adjacent bytes and
contains no literal pool, PC-relative data access, indirect transfer, or tail
transfer.

## Boundary and behavior inventory

| Function | Bytes | Instructions | Calls | Behavior |
| --- | ---: | ---: | ---: | --- |
| `func_004D04F8` | 40 | 10 | 1 | copy 48 payload bytes and one metadata halfword |
| `func_004D14FC` | 44 | 11 | 3 | guarded word read at resolver offset 16 |
| `func_004D17FC` | 56 | 14 | 4 | resolve a member, apply a caller-supplied selector, then clean up |
| `func_004D183C` | 84 | 21 | 5 | choose byte offset 42 or 26 from a state flag |
| `func_004D19F8` | 96 | 24 | 3 | bounds-check a four-entry index and read a halfword |
| `func_004D26FC` | 20 | 5 | 1 | normalize the low byte returned by `func_004D24AC` |

Each body occupies one 4-byte-aligned `.text.<function>` AX PROGBITS section.
The global function symbol spans exactly the stated body, with one ARM mapping
symbol at offset zero. The public gaps between these functions and their next
global symbols are excluded; `func_004D26FC` alone ends exactly at its next
global boundary.

## Call and control-flow contract

The 17 ordered `R_ARM_CALL` relocations target nine public identities:

| Identity | Sites |
| --- | ---: |
| `func_00168E50` | 4 |
| `func_00168EC0` | 4 |
| `func_0016BC84` | 1 |
| `func_0016BD00` | 1 |
| `func_0016BD80` | 2 |
| `func_00176EFC` | 2 |
| `func_00300B28` | 1 |
| `func_003A747C` | 1 |
| `func_004D24AC` | 1 |

`func_004D183C` owns two local branches that merge its state-dependent byte
selection. `func_004D19F8` owns the remaining local branch and has two return
sites: an early zero result for indices outside `[0, 4)` and the successful
lookup return. Its two distinct padding instructions—ARM `mov r0, r0` and the
architectural `nop` encoding—are preserved exactly.

## Implementation and validation contract

- Preserve all 85 instruction words, function boundaries, section order,
  registers, immediate values, conditions, field widths and offsets, three
  local branches, and seven returns.
- Emit exactly 17 ordered `R_ARM_CALL` relocations at the declared sites and
  to the exact nine identities above; emit no other relocation or global
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
payload, asset, private path, CRO payload, or generated executable artifact is
included.
