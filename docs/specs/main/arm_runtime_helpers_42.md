# Probe-verified ARM runtime/leaf-helper batch 42

## Scope and provenance

This clean-room specification covers 26 still-unmatched ARM-state leaf and
runtime helpers totaling 1,708 executable bytes. Evidence was limited to the
current unmatched report, neutral symbols, bounded private-target
control/data-flow inspection, and independent exact-schedule probes. The
selection is disjoint from every earlier runtime-helper manifest and from the
two functions reserved by duplicate-template batch 42.

All 26 bodies are call-free and contain no relocations, literal pools, or
adjacent words. No private absolute address, raw byte sequence, instruction
encoding, proprietary source, or opaque private literal value is recorded
here.

The schedules were independently assembled with GNU Arm Embedded 15.2 for
ARMv6K/VFPv2 and compared with target revision `AS_EUR_REV2` on 2026-10-16.
All complete bodies and all 1,708 body bytes matched directly, without
normalization. Use this common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

## `func_004E3D8C` — gated indirect tail dispatch

This 60-byte leaf tests whether bit one of the word at entry `r0` offset 8 is
clear. If so, it loads an object from offset 2584 and, when non-null, tail
dispatches through that object's vtable slot 32. The dispatched arguments are
the object and entry object plus 2412. Every rejected path returns zero.

```asm
ldr r2,[r0,#8]
mov r1,#2
bics r1,r1,r2
bne 1f
ldr r2,[r0,#2584]
cmp r2,#0
beq 1f
ldr r1,[r2]
ldr r3,[r1,#32]
add r1,r0,#2048
add r1,r1,#364
mov r0,r2
bx r3
1:
mov r0,#0
bx lr
```

The final `bx r3` is an indirect tail transfer, not a call relocation.

## `func_004E4168` — two-slot signed-byte lookup

This 72-byte leaf follows offsets 4 then 16 from entry `r0` to a pair of
32-byte records. It checks each record in order. A record matches when its
byte 31 is one and its halfword 0 equals entry `r1`; a match returns its signed
byte 30. No match returns zero.

```asm
ldr r0,[r0,#4]
ldr r0,[r0,#16]
ldrb r2,[r0,#31]
cmp r2,#1
ldrheq r2,[r0]
cmpeq r2,r1
beq 1f
ldrb r2,[r0,#63]
cmp r2,#1
ldrheq r2,[r0,#32]
cmpeq r2,r1
addeq r0,r0,#32
bne 2f
1:
cmp r0,#0
ldrsbne r0,[r0,#30]
bne 3f
2:
mov r0,#0
3:
bx lr
```

## `func_004E5DDC` and `func_004E5E08` — relative-table entry addresses

`func_004E5DDC` is 44 bytes. It returns null when the word reached through
entry offset 4 then offset 52 is null. Otherwise it loads a base through
offset 64, adds the base-relative halfword at offset 22, and adds sixteen
times the entry index at entry offset 8.

```asm
ldr r1,[r0,#4]
ldr r2,[r1,#52]
cmp r2,#0
moveq r0,#0
beq 1f
ldr r1,[r1,#64]
ldr r0,[r0,#8]
ldrh r2,[r1,#22]
add r1,r1,r2
add r0,r1,r0,lsl #4
1:
bx lr
```

`func_004E5E08` is 36 bytes. It instead uses the base at pointee offset 44
and a 408-byte stride for the index at entry offset 8. It has no null test.

```asm
ldr r1,[r0,#4]
ldr r0,[r0,#8]
ldr r1,[r1,#44]
add r2,r0,r0,lsl #1
add r0,r2,r0,lsl #4
ldrh r3,[r1,#22]
add r1,r1,r3
add r0,r1,r0,lsl #3
bx lr
```

## `func_004E60F4` — next record with selected kind

This 92-byte leaf begins at signed index `r2 + 1` in the record array at entry
`r0` offset 4, whose signed bound is at offset 8. Records have stride 36 and
their word at offset 28 supplies a three-bit kind. Entry `r1` selects a bit in
an eight-bit mask. The helper returns the first later index whose kind bit is
set, or all-ones if none is found. Preserve the single-register stack save.

```asm
mov r3,r0
mov r12,#1
lsl r0,r12,r1
and r1,r0,#255
add r0,r2,#1
push {r4}
1:
cmp r0,#0
ldrge r2,[r3,#8]
cmpge r2,r0
ble 2f
ldr r2,[r3,#4]
add r4,r0,r0,lsl #3
add r2,r2,r4,lsl #2
ldr r2,[r2,#28]
and r2,r2,#7
tst r1,r12,lsl r2
addeq r0,r0,#1
beq 1b
pop {r4}
bx lr
2:
pop {r4}
mvn r0,#0
bx lr
```

## `func_004E65FC` — packed range validity test

This 72-byte leaf returns one immediately when the low ten bits of halfword 0
are zero. Otherwise it requires that value minus one be below 1000, halfword
6 be at least halfword 2, and halfword 4 be at most halfword 8. Any failed
requirement returns zero.

```asm
ldrh r1,[r0]
bics r1,r1,#64512
beq 1f
sub r1,r1,#1
cmp r1,#1000
bcs 2f
ldrh r1,[r0,#2]
ldrh r2,[r0,#6]
cmp r2,r1
bcc 2f
ldrh r1,[r0,#4]
ldrh r0,[r0,#8]
cmp r1,r0
bls 1f
2:
mov r0,#0
bx lr
1:
mov r0,#1
bx lr
```

## Active 520-byte record helpers

These three leaves share the same eligibility prefix. Entry byte 4 must be
nonzero; the signed word at offset 36 must not exceed the signed word at
offset 32; and the signed index at offset 28 must be below the signed bound at
offset 24. The selected record address is the base at offset 20 plus index
times 520.

`func_004E6644` is 84 bytes and returns one only when the record address is
non-null and its byte 540 is nonzero:

```asm
ldrb r1,[r0,#4]
cmp r1,#0
beq 1f
add r1,r0,#32
ldm r1,{r1,r2}
cmp r2,r1
bgt 1f
ldr r1,[r0,#28]
ldr r2,[r0,#24]
cmp r1,r2
bge 1f
ldr r0,[r0,#20]
add r2,r1,r1,lsl #2
add r1,r2,r1,lsl #6
adds r0,r0,r1,lsl #3
ldrbne r0,[r0,#540]
cmpne r0,#0
movne r0,#1
bne 2f
1:
mov r0,#0
2:
bx lr
```

`func_004E6698` is 88 bytes and returns one only when the record address is
non-null and its byte 540 is zero:

```asm
ldrb r1,[r0,#4]
cmp r1,#0
beq 1f
add r1,r0,#32
ldm r1,{r1,r2}
cmp r2,r1
bgt 1f
ldr r1,[r0,#28]
ldr r2,[r0,#24]
cmp r1,r2
bge 1f
ldr r0,[r0,#20]
add r2,r1,r1,lsl #2
add r1,r2,r1,lsl #6
adds r0,r0,r1,lsl #3
beq 1f
ldrb r0,[r0,#540]
cmp r0,#0
moveq r0,#1
beq 2f
1:
mov r0,#0
2:
bx lr
```

`func_004E66F0` is 72 bytes and returns the selected record pointer, or null
when the shared eligibility test fails:

```asm
ldrb r1,[r0,#4]
cmp r1,#0
beq 1f
add r1,r0,#32
ldm r1,{r1,r2}
cmp r2,r1
bgt 1f
ldr r1,[r0,#28]
ldr r2,[r0,#24]
cmp r1,r2
bge 1f
ldr r0,[r0,#20]
add r2,r1,r1,lsl #2
add r1,r2,r1,lsl #6
add r0,r0,r1,lsl #3
bx lr
1:
mov r0,#0
bx lr
```

## Fixed-width uppercase widening helpers

`func_004E6738`, `func_004E690C`, and `func_004E69D4` are each 84 bytes. They
read signed bytes until a zero byte or a fixed limit, map ASCII lowercase
letters to uppercase, sign-extend the result, store it as a halfword, and
append a zero halfword. Their parameters are:

| Function | Source | Maximum bytes |
|---|---:|---:|
| `func_004E6738` | entry `r0 + 4` | 8 |
| `func_004E690C` | entry `r0 + 12` | 8 |
| `func_004E69D4` | entry `r0` | 4 |

The first two use this exact schedule with `SOURCE_OFFSET` equal to 4 or 12
and `LIMIT` equal to 8:

```asm
add r12,r0,#SOURCE_OFFSET
mov r3,#LIMIT
mov r0,#0
push {r4}
1:
ldrsb r2,[r12,r0]
cmp r2,#0
beq 2f
sub r4,r2,#97
cmp r4,#25
subls r2,r2,#32
add r4,r1,r0,lsl #1
add r0,r0,#1
sxtb r2,r2
cmp r0,r3
strh r2,[r4]
blt 1b
2:
add r1,r1,r0,lsl #1
mov r2,#0
strh r2,[r1]
pop {r4}
bx lr
```

The four-byte variant preserves a different register schedule:

```asm
mov r3,r0
mov r12,#4
mov r0,#0
push {r4}
1:
ldrsb r2,[r3,r0]
cmp r2,#0
beq 2f
sub r4,r2,#97
cmp r4,#25
subls r2,r2,#32
add r4,r1,r0,lsl #1
add r0,r0,#1
sxtb r2,r2
cmp r0,r12
strh r2,[r4]
blt 1b
2:
add r1,r1,r0,lsl #1
mov r2,#0
strh r2,[r1]
pop {r4}
bx lr
```

## `func_004E678C` — bounded identifier validation

This 84-byte leaf accepts up to four bytes terminated by zero. Every nonzero
byte must be an ASCII digit, uppercase letter, lowercase letter, or underscore.
It returns one when valid and zero on the first invalid byte.

```asm
mov r2,#0
1:
ldrsb r1,[r0]
cmp r1,#0
beq 3f
sub r3,r1,#48
cmp r3,#9
subhi r3,r1,#65
cmphi r3,#25
subhi r3,r1,#97
cmphi r3,#25
bls 2f
cmp r1,#95
beq 2f
mov r0,#0
bx lr
2:
add r2,r2,#1
cmp r2,#4
add r0,r0,#1
blt 1b
3:
mov r0,#1
bx lr
```

## Halfword-pair equality predicates

`func_004E6B34` is a 44-byte comparison of the two halfwords at offsets zero
and two of entry `r0` and entry `r1`, normalized to one for equality:

```asm
ldrh r2,[r0]
ldrh r3,[r1]
cmp r2,r3
bne 1f
ldrh r0,[r0,#2]
ldrh r1,[r1,#2]
cmp r0,r1
moveq r0,#1
beq 2f
1:
mov r0,#0
2:
bx lr
```

`func_004E6B60` is the corresponding 48-byte inequality predicate:

```asm
ldrh r2,[r0]
ldrh r3,[r1]
cmp r2,r3
bne 1f
ldrh r0,[r0,#2]
ldrh r1,[r1,#2]
cmp r0,r1
moveq r0,#1
beq 2f
1:
mov r0,#0
2:
eor r0,r0,#1
bx lr
```

## `func_004E6D2C` — primary-only availability test

This 36-byte leaf returns one when entry byte 5 is zero and entry byte 4 is
nonzero; otherwise it returns zero.

```asm
ldrb r1,[r0,#5]
cmp r1,#0
bne 1f
ldrb r0,[r0,#4]
cmp r0,#0
movne r0,#1
bne 2f
1:
mov r0,#0
2:
bx lr
```

## `func_004E6D68` — nested identity comparison

This 48-byte leaf follows entry offset 44 then pointee offset 8. When both
pointers are non-null it compares the resulting object's word 12 with the
entry word 32 and returns normalized equality; null paths return zero.

```asm
ldr r1,[r0,#44]
cmp r1,#0
ldrne r1,[r1,#8]
cmpne r1,#0
beq 1f
ldr r1,[r1,#12]
ldr r0,[r0,#32]
cmp r1,r0
moveq r0,#1
beq 2f
1:
mov r0,#0
2:
bx lr
```

## Packed display-field helpers

`func_004E6FB4` is 36 bytes. If entry byte 90 is 26 or 27 it returns bits
21..13 of word 92 narrowed to the low byte; otherwise it returns bits 15..8
of word 80.

```asm
ldrb r1,[r0,#90]
cmp r1,#26
cmpne r1,#27
ldreq r0,[r0,#92]
lsleq r0,r0,#11
ldrne r0,[r0,#80]
lslne r0,r0,#16
lsr r0,r0,#24
bx lr
```

`func_004E6FE4` is 40 bytes. It returns one only when bits 28 and 27 of word
80 are both clear.

```asm
ldr r0,[r0,#80]
and r1,r0,#268435456
lsrs r1,r1,#28
bne 1f
and r0,r0,#134217728
lsrs r0,r0,#27
moveq r0,#1
beq 2f
1:
mov r0,#0
2:
bx lr
```

`func_004E7064` is 92 bytes. Normally it returns the same packed field as
`func_004E6FB4`. When byte 195 is zero or three, it first derives an alternate
eight-bit field—bits 12..5 of word 92 for modes 26/27, otherwise byte zero of
word 80—and returns 240 immediately when that alternate field equals 240.

```asm
ldrb r2,[r0,#195]
ldrb r1,[r0,#90]
cmp r2,#0
cmpne r2,#3
bne 1f
cmp r1,#26
cmpne r1,#27
ldreq r2,[r0,#92]
lsleq r2,r2,#19
lsreq r2,r2,#24
ldrne r2,[r0,#80]
andne r2,r2,#255
cmp r2,#240
moveq r0,r2
beq 2f
1:
cmp r1,#26
cmpne r1,#27
ldreq r0,[r0,#92]
lsleq r0,r0,#11
ldrne r0,[r0,#80]
lslne r0,r0,#16
lsr r0,r0,#24
2:
bx lr
```

## `func_004E7124` — tagged 40-byte state copy

This 52-byte VFP leaf returns zero unless entry byte 191 equals 108. On a
match, it copies eight words from entry offsets 152..180 to output offsets
0..28 with `vldmia`/`vstmia`, copies entry words 184 and 188 to output offsets
32 and 36, and returns one.

```asm
ldrb r2,[r0,#191]
cmp r2,#108
movne r0,#0
bne 1f
add r2,r0,#152
vldmia r2,{s0-s7}
vstmia r1,{s0-s7}
ldr r2,[r0,#188]
ldr r0,[r0,#184]
str r0,[r1,#32]
mov r0,#1
str r2,[r1,#36]
1:
bx lr
```

## Fixed three-slot occupancy predicates

`func_004E7700` is 28 bytes. It addresses one of three 12-byte slots at entry
`r0` using entry index `r1` and returns one when that slot's word 3296 is null.

```asm
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
ldr r0,[r0,#3296]
cmp r0,#0
moveq r0,#1
movne r0,#0
bx lr
```

`func_004E771C` is 44 bytes. It returns one only when all three slot words at
entry offsets 3296, 3308, and 3320 are null.

```asm
ldr r1,[r0,#3296]
cmp r1,#0
bne 1f
ldr r1,[r0,#3308]
cmp r1,#0
ldreq r0,[r0,#3320]
cmpeq r0,#0
moveq r0,#1
beq 2f
1:
mov r0,#0
2:
bx lr
```

## `func_004E7BB8` — guarded halfword-derived index

This 92-byte leaf checks the optional object at entry offset 140 and preserves
the diagnostic no-op sequence unless its byte 24 equals six. It then loads the
optional object at entry offset 28. A non-null second object yields unsigned
halfword 74 minus two. A null second object preserves a second diagnostic
sequence and returns all-ones.

```asm
push {r4,lr}
mov r4,r0
ldr r0,[r0,#140]
cmp r0,#0
beq 1f
ldrb r0,[r0,#24]
cmp r0,#6
beq 2f
1:
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
2:
ldr r0,[r4,#28]
cmp r0,#0
ldrhne r0,[r0,#74]
subne r0,r0,#2
bne 3f
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
mvn r0,#0
3:
pop {r4,pc}
```

## `func_004EC724` — mode-selected relative-span lookup

This 96-byte leaf accepts entry object `r0`, mode `r1`, index `r2`, start
output `r3`, and end output in the first stack argument. Mode zero selects the
relative table reached through entry offset 8 then pointee offset 4; mode one
selects pointee offset 8. Other modes return zero without output stores. For a
supported mode, two consecutive relative offsets select a span: the helper
stores base plus the first offset, stores base plus the second offset, and
returns their difference.

```asm
push {r4}
mov r4,r0
cmp r1,#0
mov r0,#0
ldreq r0,[r4,#8]
ldr r12,[sp,#4]
ldreq r1,[r0,#4]
beq 1f
cmp r1,#1
ldreq r0,[r4,#8]
ldreq r1,[r0,#8]
bne 2f
1:
add r0,r0,r1
ldr r1,[r0,r2,lsl #2]
add r2,r0,r2,lsl #2
add r1,r1,r0
str r1,[r3]
ldr r1,[r2,#4]
add r0,r0,r1
str r0,[r12]
ldr r1,[r3]
sub r0,r0,r1
2:
pop {r4}
bx lr
```

## `func_0056DCE4` — byte-key lower-bound lookup

This 96-byte leaf searches a binary tree whose sentinel is at entry `r0`
offset 16 and whose root is at sentinel offset 4. Node byte 16 is the key;
node offsets 8 and 12 are the left and right links. It computes a lower bound
for the unsigned byte at entry `r1`: keys greater than or equal to the query
retain the node and follow offset 8, while smaller keys follow offset 12. It
returns the sentinel when the retained node is the sentinel or its key is
greater than the query; otherwise it returns the retained node.

```asm
push {r4}
ldr r2,[r0,#16]
mov r3,r2
ldr r0,[r2,#4]
cmp r0,#0
ldrbne r4,[r1]
beq 2f
1:
ldrb r12,[r0,#16]
cmp r12,r4
movcs r3,r0
ldrcs r0,[r0,#8]
ldrcc r0,[r0,#12]
cmp r0,#0
bne 1b
2:
cmp r3,r2
mov r0,r3
beq 3f
ldrb r1,[r1]
ldrb r3,[r0,#16]
cmp r3,r1
bls 4f
3:
mov r0,r2
4:
pop {r4}
bx lr
```

## Integration contract

- Emit every body in its own `.text.<function>` executable section with
  four-byte alignment, global function binding, and exact `.size` extent.
- The source mode is ARM for every entry. The VFP schedule uses VFPv2 only.
- Do not add calls, literal pools, adjacent data, or relocations.
- Preserve conditional instruction forms, diagnostic no-op sequences, stack
  saves, and register allocation exactly as shown.
- The structural identity classes and their permitted parameters are recorded
  in `config/arm-runtime-helpers-42.json`.
