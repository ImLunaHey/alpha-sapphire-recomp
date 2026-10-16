# Probe-verified ARM runtime/leaf-helper batch 48

## Scope and provenance

This clean-room specification covers 20 currently unmatched ARM-state,
call-free record helpers totaling 832 executable bytes. Evidence was limited
to the current unmatched report, neutral symbols, bounded private-target
control and data-flow inspection, and independent exact-schedule probes. The
selection is disjoint from every earlier runtime-helper manifest and from
duplicate-template batch 48, which reserves `func_00368600`,
`func_00368CE0`, and `func_00369104`.

No function has a literal pool, adjacent word, call, or symbolic identity.
No private absolute address, raw target byte sequence, instruction encoding,
or private literal value is recorded here. The schedules were independently
assembled with GNU Arm Embedded 15.2 for ARMv6K/VFPv2 and compared with target
revision `AS_EUR_REV2` on 2026-10-16. All 20 complete bodies and all 832 body
bytes matched directly. Use this common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

Labels and directives occupy no executable bytes. Preserve every displayed
mnemonic, operand, register, addressing mode, and instruction order.

## Common record layout

Every helper takes a root pointer in `r0` and an unsigned outer-record index
in `r1`. It loads the record-array pointer from root offset 108 and forms
`372 * outer_index` by computing 31 times the index, then 93 times the index,
and finally shifting that value left by two in the address addition. The exact
arithmetic and destructive register use are part of the contract.

## Direct byte stores with dirty flags

These seven 36-byte leaves take the byte value in `r2`, store it in the
selected outer record, then set a bit in a nearby dirty word. The table gives
the byte offset, dirty-word offset, and bit mask.

| Function | Byte offset | Dirty-word offset | OR mask |
| --- | ---: | ---: | ---: |
| `func_00398958` | 222 | 216 | 1 |
| `func_00398D9C` | 221 | 216 | 1 |
| `func_00398E30` | 223 | 216 | 1 |
| `func_00399588` | 276 | 272 | 1 |
| `func_003995AC` | 225 | 216 | 2 |
| `func_003995D0` | 227 | 216 | 2 |
| `func_00399670` | 226 | 216 | 2 |

```asm
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
strb r2,[r0,#BYTE_OFFSET]
ldr r1,[r0,#DIRTY_OFFSET]
orr r1,r1,#DIRTY_MASK
str r1,[r0,#DIRTY_OFFSET]
bx lr
```

## 36-byte nested-record stores

These six 44-byte leaves additionally take a nested-record index in `r2` and
the byte value in `r3`. They form a 36-byte nested stride as nine times the
index shifted left by two, store the byte at the listed offset, then OR the
listed mask into the first word of that same nested record. Preserve the
separate address formation in `r2` for the byte store and the base-plus-index
addressing used by the word load and store.

| Function | Byte offset | OR mask |
| --- | ---: | ---: |
| `func_00399520` | 6 | 4 |
| `func_00399694` | 4 | 1 |
| `func_003996F4` | 7 | 8 |
| `func_003999B8` | 5 | 2 |
| `func_00399A18` | 32 | 16 |
| `func_00399AD4` | 33 | 32 |

```asm
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
add r1,r2,r2,lsl #3
add r2,r0,r1,lsl #2
strb r3,[r2,#BYTE_OFFSET]
ldr r2,[r0,r1,lsl #2]
orr r2,r2,#DIRTY_MASK
str r2,[r0,r1,lsl #2]
bx lr
```

## Deep eight-byte-entry stores

These four 52-byte leaves take an outer-record index in `r1`, a 36-byte
nested-record index in `r2`, an eight-byte entry index in `r3`, and a byte
value as the first stack argument. They load the stack argument into `r12`
before completing the address construction. At the selected eight-byte entry,
they write one of byte offsets 12--15, then set the paired mask in the word at
offset 8. Preserve the entry-stack load and all destructive index arithmetic.

| Function | Byte offset | OR mask |
| --- | ---: | ---: |
| `func_003995F4` | 14 | 4 |
| `func_003996C0` | 12 | 1 |
| `func_00399808` | 15 | 8 |
| `func_003999E4` | 13 | 2 |

```asm
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
ldr r12,[sp]
add r0,r0,r1,lsl #2
add r1,r2,r2,lsl #3
add r0,r0,r1,lsl #2
add r0,r0,r3,lsl #3
strb r12,[r0,#BYTE_OFFSET]
ldr r1,[r0,#8]
orr r1,r1,#DIRTY_MASK
str r1,[r0,#8]
bx lr
```

## Nested byte accessors

These three 36-byte leaves return a byte from a 36-byte nested record. The
nested index arrives in `r2`; the table gives the byte offset within that
record. Preserve the constant materialization in `r3` and the final combined
offset in `r1` rather than folding either into another addressing form.

| Function | Byte offset |
| --- | ---: |
| `func_00399628` | 4 |
| `func_0039964C` | 7 |
| `func_003998FC` | 5 |

```asm
rsb r1,r1,r1,lsl #5
ldr r0,[r0,#108]
add r1,r1,r1,lsl #1
add r2,r2,r2,lsl #3
mov r3,#BYTE_OFFSET
add r0,r0,r1,lsl #2
add r1,r3,r2,lsl #2
ldrb r0,[r0,r1]
bx lr
```

## Acceptance criteria

- Emit all 20 functions in ARM state with the manifest sizes, totaling 832
  executable bytes.
- Emit no calls, literal pools, adjacent words, relocations, or symbolic data.
- Preserve the exact outer and nested stride constructions, register choices,
  stack-argument load, load/store order, immediate masks, and return forms
  shown above.
- Keep the implementation derived solely from this specification; target-side
  artifacts remain validation inputs only.
