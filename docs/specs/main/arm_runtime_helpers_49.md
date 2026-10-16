# Probe-verified ARM runtime/leaf-helper batch 49

## Scope and provenance

This clean-room specification covers 22 currently unmatched ARM-state,
call-free leaf helpers totaling 1,008 executable bytes. Evidence was limited
to the current unmatched report, neutral symbols, bounded private-target
control and data-flow inspection, and independent exact-schedule probes. The
selection is disjoint from every earlier runtime-helper manifest and from
duplicate-template batch 49, which reserves `func_00493D18` and
`func_004977B4`.

No function has a literal pool, adjacent word, call, or symbolic identity.
No private absolute address, raw target byte sequence, instruction encoding,
or private literal value is recorded here. The schedules were independently
assembled for ARMv6K and compared with target revision `AS_EUR_REV2` on
2026-10-16. All 22 complete bodies and all 1,008 body bytes matched directly.
Use this common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

Labels and directives occupy no executable bytes. Preserve every displayed
mnemonic, operand, register, condition, addressing mode, and instruction
order.

## Selected-view record accessors

The first sixteen helpers share an exact 32-byte view-selection prefix. Entry
`r0` is an owner. If its byte at offset 28 is zero, select the pointer at
offset 52. Otherwise, use the byte at offset 29 to select the pointer at
offset 68 when zero or offset 48 when nonzero. The conditional load and branch
shape are normative.

Seven accessors use `r1` as the selector scratch register:

```asm
ldrb r1,[r0,#28]
cmp r1,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r1,[r0,#29]
cmp r1,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
```

Five 40-byte functions append a single load and return. The signed-byte
accessors and halfword accessors use the following offsets.

| Function | Final load |
| --- | --- |
| `func_004C75A8` | `ldrsb r0,[r0,#10]` |
| `func_004C75D0` | `ldrsb r0,[r0,#9]` |
| `func_004C7748` | `ldrh r0,[r0]` |
| `func_004C7770` | `ldrh r0,[r0,#2]` |
| `func_004C77F4` | `ldrsb r0,[r0,#8]` |

Append `bx lr` after the listed load.

Two 48-byte functions return the difference of unsigned halfwords. Preserve
the load order and unsigned loads; ordinary modulo-32-bit subtraction then
produces the result.

```asm
@ func_004C781C
ldrh r1,[r0]
ldrh r0,[r0,#4]
sub r0,r1,r0
bx lr

@ func_004C784C
ldrh r1,[r0,#2]
ldrh r0,[r0,#6]
sub r0,r1,r0
bx lr
```

Four mask and copy helpers use `r2` as the selector scratch register so entry
`r1` remains available as a mask or output pointer. Prepend this exact prefix:

```asm
ldrb r2,[r0,#28]
cmp r2,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r2,[r0,#29]
cmp r2,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
```

`func_004C7CF4` is 48 bytes and tests the selected view's word at offset 8.
The input mask is in `r1`; return the masked value when zero and one when
nonzero.

```asm
ldr r0,[r0,#8]
ands r0,r0,r1
movne r0,#1
bx lr
```

`func_004C7D4C` is 56 bytes. It ORs the words at offsets 12 and 20 before
performing the same mask test and normalization.

```asm
ldr r2,[r0,#12]
ldr r0,[r0,#20]
orr r0,r0,r2
ands r0,r0,r1
movne r0,#1
bx lr
```

`func_004C7E2C` is 48 bytes and tests the word at offset 12.

```asm
ldr r0,[r0,#12]
ands r0,r0,r1
movne r0,#1
bx lr
```

`func_004C7E5C` is 60 bytes. It copies three words from selected-view offsets
16, 20, and 24 to output `r1` offsets 0, 4, and 8. Preserve the scalar
load/store interleaving.

```asm
ldr r2,[r0,#16]
str r2,[r1]
ldr r2,[r0,#20]
str r2,[r1,#4]
ldr r0,[r0,#24]
str r0,[r1,#8]
bx lr
```

`func_004C80D0` is 48 bytes and again uses the `r2` selector prefix. Entry
`r1` is an unsigned subrecord index. If it is below two, advance by
`16 * index`; otherwise retain the selected view base. Return the word at
offset 4.

```asm
cmp r1,#2
addlo r0,r0,r1,lsl #4
ldr r0,[r0,#4]
bx lr
```

The final four selected-view mask helpers use `r3` as the selector scratch,
preserving mask `r1` and unsigned subrecord index `r2`. Prepend:

```asm
ldrb r3,[r0,#28]
cmp r3,#0
ldreq r0,[r0,#52]
beq 1f
ldrb r3,[r0,#29]
cmp r3,#0
ldreq r0,[r0,#68]
ldrne r0,[r0,#48]
1:
cmp r2,#2
addlo r0,r0,r2,lsl #4
```

The table gives the exact suffix. Each function returns the masked value when
zero and one when nonzero.

| Function | Size | Suffix before common mask test |
| --- | ---: | --- |
| `func_004C8400` | 56 | `ldr r0,[r0]` |
| `func_004C8438` | 64 | `ldr r2,[r0,#4]`; `ldr r0,[r0,#12]`; `orr r0,r0,r2` |
| `func_004C84B0` | 56 | `ldr r0,[r0,#8]` |
| `func_004C84E8` | 56 | `ldr r0,[r0,#4]` |

Append this common mask test:

```asm
ands r0,r0,r1
movne r0,#1
bx lr
```

## Independent compact accessors

`func_004C8668` is 24 bytes. It follows the pointer at owner offset 376.
For an unsigned index below three it returns the word at
`base + 40 + 4 * index`; otherwise it returns all ones. Preserve both
conditional instructions.

```asm
ldr r0,[r0,#376]
cmp r1,#3
mvnhs r0,#0
addlo r0,r0,r1,lsl #2
ldrlo r0,[r0,#40]
bx lr
```

`func_004C8768` is 40 bytes. Entry `r0` names a counted array whose halfword
count is at offset 4 and whose data pointer is at offset 0. If unsigned index
`r1` is outside the count, return null. Otherwise locate its 64-byte record;
return null when that record's byte at offset 4 is zero, or return the record
pointer when nonzero.

```asm
ldrh r2,[r0,#4]
cmp r2,r1
bls 1f
ldr r0,[r0]
add r0,r0,r1,lsl #6
ldrb r1,[r0,#4]
cmp r1,#0
bne 2f
1:
mov r0,#0
2:
bx lr
```

`func_004C8DC0` is 44 bytes. Follow the pointer at owner offset 4. Its word at
offset 172 is an unsigned record count and offset 168 holds the record-array
pointer. Return zero when index `r1` is outside the count. Otherwise form the
44-byte stride via `3 * index`, then `11 * index`, and return the signed byte
at the start of that record.

```asm
ldr r0,[r0,#4]
ldr r2,[r0,#172]
cmp r2,r1
movls r0,#0
bls 1f
ldr r0,[r0,#168]
add r2,r1,r1,lsl #1
add r1,r2,r1,lsl #3
add r0,r0,r1,lsl #2
ldrsb r0,[r0]
1:
bx lr
```

`func_004C8EC0` is 36 bytes. Follow pointers at offsets 0 and then 16. Compare
unsigned index `r1` with the word count at offset 4. Return null when the index
is outside the count; otherwise load the array pointer at offset 0, form
`72 * index` as nine times the index shifted left by three, and return the
resulting entry pointer.

```asm
ldr r0,[r0]
ldr r0,[r0,#16]
ldr r2,[r0,#4]
cmp r2,r1
ldrhi r0,[r0]
addhi r1,r1,r1,lsl #3
movls r0,#0
addhi r0,r0,r1,lsl #3
bx lr
```

`func_004C8FB4` is 28 bytes. It takes an owner in `r0`, index in `r1`, and
output record in `r2`. Follow owner offsets 12, then 20, then zero; add
`12 * index` by first forming three times the index; and store the resulting
pointer only at output offset 4. Entry `r0` is advanced to the same pointer.

```asm
ldr r0,[r0,#12]
add r1,r1,r1,lsl #1
ldr r0,[r0,#20]
ldr r0,[r0]
add r0,r0,r1,lsl #2
str r0,[r2,#4]
bx lr
```

`func_004C90B8` is 48 bytes. A negative signed index in `r1` returns null.
Otherwise follow the pointer at owner offset 12, require its unsigned count at
offset 16 to exceed the index, then follow its pointer at offset 12, index a
pointer array, and return the first word of the selected object. An invalid
index returns null through the shared tail.

```asm
cmp r1,#0
blt 1f
ldr r0,[r0,#12]
ldr r2,[r0,#16]
cmp r2,r1
bls 1f
ldr r0,[r0,#12]
ldr r0,[r0,r1,lsl #2]
ldr r0,[r0]
bx lr
1:
mov r0,#0
bx lr
```

## Acceptance criteria

- Emit all 22 functions in ARM state with the manifest sizes, totaling 1,008
  executable bytes.
- Emit no calls, literal pools, adjacent words, relocations, or symbolic data.
- Preserve every selector path, conditional instruction, local branch,
  register choice, load width, signedness, stride construction, load/store
  order, and return form shown above.
- Keep the implementation derived solely from this specification; target-side
  artifacts remain validation inputs only.
