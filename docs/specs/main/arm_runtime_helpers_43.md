# Probe-verified ARM runtime/leaf-helper batch 43

## Scope and provenance

This clean-room specification covers 16 still-unmatched ARM-state leaf and
runtime helpers totaling 320 executable bytes. Evidence was limited to the
current unmatched report, neutral symbols, bounded private-target
control/data-flow inspection, and independent exact-schedule probes. The
selection is disjoint from every earlier runtime-helper manifest and excludes
`func_0018FC6C` and `func_00560E5C`, which are reserved for duplicate-template
batch 43.

Eleven bodies are call-free. Four are tail-call wrappers and one makes an
ordinary call. None contains a literal pool, adjacent word, or other data
slot. No private absolute address, raw byte sequence, instruction encoding,
proprietary source, or opaque private literal value is recorded here.

The schedules were independently assembled with GNU Arm Embedded 15.2 for
ARMv6K/VFPv2 and compared with target revision `AS_EUR_REV2` on 2026-10-16.
All complete bodies and all 320 body bytes matched directly, without
normalization. Use this common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

The three symbolic call identities used below are ARM-state, four-byte-aligned
entries. `runtime_embedded_payload_transfer_43` is one shared identity across
three tail wrappers. `runtime_fixed_13_byte_copy_43` and
`runtime_fixed_368_byte_copy_43` are distinct from it and from one another.

## Packed status-field accessors

`func_004EA6F8` is a 16-byte leaf returning bit zero of the halfword at entry
`r0` offset 338:

```asm
add r0,r0,#256
ldrh r0,[r0,#82]
and r0,r0,#1
bx lr
```

`func_004EA820` is a 20-byte leaf returning bit one of that same halfword,
normalized to zero or one:

```asm
add r0,r0,#256
ldrh r0,[r0,#82]
and r0,r0,#2
lsr r0,r0,#1
bx lr
```

## `func_004EA794` — signed embedded-byte accessor

This 12-byte leaf returns the signed byte at entry `r0` offset 376.

```asm
add r0,r0,#256
ldrsb r0,[r0,#120]
bx lr
```

## Embedded-payload transfer tails

These three wrappers tail-transfer to the single shared symbolic entry
`runtime_embedded_payload_transfer_43` after arranging an output-like pointer
in `r0`, an embedded payload address in `r1`, and preserving the exact `r2`
schedule shown. The callee's return value is returned directly.

`func_004EA7A0` is 16 bytes. Entry `r1` is copied to both `r0` and `r2`; the
embedded address is entry `r0 + 80`.

```asm
mov r2,r1
add r1,r0,#80
mov r0,r2
b runtime_embedded_payload_transfer_43
```

`func_004EA87C` is 16 bytes and differs only in selecting entry `r0 + 106`.

```asm
mov r2,r1
add r1,r0,#106
mov r0,r2
b runtime_embedded_payload_transfer_43
```

`func_004EA89C` is 20 bytes. It selects a 34-byte record by entry `r1`, then
uses payload offset 132 from that record-relative address. Entry `r2` becomes
`r0` and remains unchanged in `r2`.

```asm
add r1,r1,r1,lsl #4
add r0,r0,r1,lsl #1
add r1,r0,#132
mov r0,r2
b runtime_embedded_payload_transfer_43
```

## `func_004EA7C4` — four-float embedded copy

This 16-byte VFP leaf copies four consecutive single-precision register-width
words from entry `r0 + 56` to entry `r1`. Preserve the multiple-transfer
spelling and lack of writeback.

```asm
add r0,r0,#56
vldmia r0,{s0-s3}
vstmia r1,{s0-s3}
bx lr
```

## Two-word pair accessors

`func_004EA7F8` and `func_004EA810` are 16-byte leaves. Each performs a
writeback load into `r2`, then loads the following word into `r1`, returns the
first word in `r0`, and deliberately leaves entry `r0` advanced. The first
uses pair offsets 16 and 20:

```asm
ldr r2,[r0,#16]!
ldr r1,[r0,#4]
mov r0,r2
bx lr
```

The second uses pair offsets 24 and 28:

```asm
ldr r2,[r0,#24]!
ldr r1,[r0,#4]
mov r0,r2
bx lr
```

## `func_004EA834` — header assembly and fixed copy tail

This 36-byte wrapper builds a packed output header at entry `r1`: the word at
entry `r0` offset 8 goes to output offset 0, and the byte at input offset 13
goes to output offset 4. It then tail-transfers to
`runtime_fixed_13_byte_copy_43` with `r0 = output + 6`, `r1 = input + 80`, and
`r2 = 13`.

```asm
mov r3,r1
ldr r1,[r0,#8]
mov r2,#13
str r1,[r3]
ldrb r1,[r0,#13]
strb r1,[r3,#4]
add r1,r0,#80
add r0,r3,#6
b runtime_fixed_13_byte_copy_43
```

## `func_004EA858` — optional sparse record export

This 36-byte leaf does nothing when entry `r1` is null. Otherwise it stores
the input words at offsets 40, 24, and 28 to output offsets 0, 8, and 12,
respectively. Output offset 4 is intentionally untouched. On the non-null
path `r0` finishes as the value loaded from input offset 24; the null path
preserves entry `r0`.

```asm
cmp r1,#0
beq 1f
ldr r2,[r0,#40]
str r2,[r1]
ldr r2,[r0,#28]
ldr r0,[r0,#24]
str r0,[r1,#8]
str r2,[r1,#12]
1:
bx lr
```

## `func_004EA8EC` — nonzero byte predicate

This 16-byte leaf returns the byte at entry `r0` offset 54. A nonzero byte is
normalized to one; zero remains zero.

```asm
ldrb r0,[r0,#54]
cmp r0,#0
movne r0,#1
bx lr
```

## `func_004EA924` — packed middle-byte accessor

This 16-byte leaf returns bits 16 through 23 of the word at entry `r0` offset
44.

```asm
ldr r0,[r0,#44]
and r0,r0,#0xff0000
lsr r0,r0,#16
bx lr
```

## `func_004EA940` — two-tag predicate

This 24-byte leaf returns one when the byte at entry `r0` offset 12 equals
either tag 24 or tag 25, and zero otherwise. Preserve the conditional second
comparison.

```asm
ldrb r0,[r0,#12]
cmp r0,#24
cmpne r0,#25
moveq r0,#1
movne r0,#0
bx lr
```

## `func_004EA958` — fixed 368-byte copy wrapper

This 32-byte wrapper calls `runtime_fixed_368_byte_copy_43` with entry `r1` as
the destination, entry `r0 + 8` as the source, and 368 as the byte count. It
then returns 368 regardless of the callee result. Preserve the late stack save
after argument setup.

```asm
mov r3,r1
add r1,r0,#8
mov r2,#368
mov r0,r3
push {r4,lr}
bl runtime_fixed_368_byte_copy_43
mov r0,#368
pop {r4,pc}
```

## `func_004EA998` — indirect doubleword accessor

This 12-byte leaf loads a pointer from entry `r0` offset 4, then returns the
two words at pointer offsets 16 and 20 in `r0` and `r1`. Preserve the paired
load.

```asm
ldr r1,[r0,#4]
ldrd r0,r1,[r1,#16]
bx lr
```

## Manifest requirements

- Mode: ARM for every body and every symbolic target.
- Total body size: 320 bytes.
- No body has an adjacent word or literal-pool slot.
- Tail relocations are at offsets 12 in `func_004EA7A0`, 32 in
  `func_004EA834`, 12 in `func_004EA87C`, and 16 in `func_004EA89C`.
- The ordinary call relocation is at offset 20 in `func_004EA958`.
- The three payload-transfer tails must resolve to one equal symbolic target.
- The fixed-13 and fixed-368 targets are each singleton-distinct and unequal
  to the shared payload-transfer target and to each other.
