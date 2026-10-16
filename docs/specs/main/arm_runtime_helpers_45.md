# Probe-verified ARM runtime/leaf-helper batch 45

## Scope and provenance

This clean-room specification covers 30 currently unmatched ARM-state helpers
totaling 500 executable bytes. Evidence was limited to the current unmatched
report, neutral symbols, bounded private-target control/data-flow inspection,
and independent exact-schedule probes. The selection excludes
`func_0056FDB0` and `func_00570000`, which are reserved for duplicate-template
batch 45, and is disjoint from all earlier runtime-helper manifests.

Every body is a call-free leaf. None has an adjacent literal word, symbolic
slot, external call, or branch relocation. No private absolute address, raw
byte sequence, instruction encoding, or private slot value is recorded here.

The schedules were independently assembled with GNU Arm Embedded 15.2 for
ARMv6K/VFPv2 and compared with target revision `AS_EUR_REV2` on 2026-10-16.
All 30 complete bodies and all 500 body bytes matched directly. Use this
common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

## Pointer and indexed accessors

`func_004E503C` is a 16-byte leaf. It advances entry `r0` by 32 with
writeback, loads the two words at the advanced address into `r2` then `r1`,
and returns the first word in `r0`. Thus the observable result pair is
`r0:r1`, while `r2` also retains the first word.

```asm
ldr r2,[r0,#32]!
ldr r1,[r0,#4]
mov r0,r2
bx lr
```

`func_004E5DA8` is a 16-byte indexed accessor. It loads a base pointer from
entry `r0 + 12`, computes `12 * entry_r1` using the displayed two additions,
and returns the resulting address.

```asm
ldr r0,[r0,#12]
add r1,r1,r1,lsl #1
add r0,r0,r1,lsl #2
bx lr
```

The following four leaves perform scaled indexed word lookup. Preserve the
separate address addition and load in each schedule.

```asm
@ func_004E6078, 12 bytes: return *(u32 *)(entry_r0 + 16 + 4*entry_r1)
add r0,r0,r1,lsl #2
ldr r0,[r0,#16]
bx lr

@ func_004E6AF8, 12 bytes: return *(u32 *)(entry_r0 + 48 + 4*entry_r1)
add r0,r0,r1,lsl #2
ldr r0,[r0,#48]
bx lr

@ func_004E8938, 12 bytes: return *(u32 *)(entry_r0 + 36 + 4*entry_r1)
add r0,r0,r1,lsl #2
ldr r0,[r0,#36]
bx lr

@ func_004E9CB0, 16 bytes: return entry_r0 + 4 + 34*entry_r1
add r1,r1,r1,lsl #4
add r0,r0,r1,lsl #1
add r0,r0,#4
bx lr
```

`func_004E60D8` is a 16-byte count helper. It loads the word pair at offsets
24 and 28 into `r0:r1`, subtracts the first from the second, and returns the
signed arithmetic result shifted right by three.

```asm
ldrd r0,[r0,#24]
sub r0,r1,r0
asr r0,r0,#3
bx lr
```

`func_004E86B8` is a 12-byte halfword accessor. Preserve the split address
calculation: add 768 first, then load at a further offset of 40.

```asm
add r0,r0,#768
ldrh r0,[r0,#40]
bx lr
```

## Scalar field and flag accessors

The following leaves return normalized bit fields. Each performs a word load,
an explicit mask, an explicit logical shift, and `bx lr` in that order.

```asm
@ func_004E5400, 16 bytes: bits 7..11 of word 48
ldr r0,[r0,#48]
and r0,r0,#3968
lsr r0,r0,#7
bx lr

@ func_004E5EAC, 16 bytes: bits 2..4 of word 4
ldr r0,[r0,#4]
and r0,r0,#28
lsr r0,r0,#2
bx lr

@ func_004E6970, 16 bytes: bits 21..24 of word 44
ldr r0,[r0,#44]
and r0,r0,#31457280
lsr r0,r0,#21
bx lr

@ func_004E71F0, 16 bytes: bit 1 of word 92
ldr r0,[r0,#92]
and r0,r0,#2
lsr r0,r0,#1
bx lr

@ func_004E74B4, 16 bytes: bit 6 of word 200
ldr r0,[r0,#200]
and r0,r0,#64
lsr r0,r0,#6
bx lr

@ func_004E9F48, 16 bytes: bit 11 of word 52
ldr r0,[r0,#52]
and r0,r0,#2048
lsr r0,r0,#11
bx lr

@ func_004E9F68, 16 bytes: bit 10 of word 52
ldr r0,[r0,#52]
and r0,r0,#1024
lsr r0,r0,#10
bx lr

@ func_004E9F88, 16 bytes: bit 26 of word 52
ldr r0,[r0,#52]
and r0,r0,#67108864
lsr r0,r0,#26
bx lr
```

`func_004E65F0` is a 12-byte halfword mask leaf. It returns the low ten bits
of the unsigned halfword at entry `r0` by explicitly clearing the upper six.

```asm
ldrh r0,[r0]
bic r0,r0,#64512
bx lr
```

## Boolean leaves

`func_004E5CE4` and `func_004EA5F4` are 16-byte nonzero normalizers for the
words at offsets 0 and 48 respectively. Preserve the conditional move without
an explicit `moveq`: the loaded zero already is the required false result.

```asm
@ func_004E5CE4
ldr r0,[r0]
cmp r0,#0
movne r0,#1
bx lr

@ func_004EA5F4
ldr r0,[r0,#48]
cmp r0,#0
movne r0,#1
bx lr
```

`func_004E7048`, `func_004E9420`, and `func_004E9C00` are 20-byte zero-test
normalizers. They return one exactly when the byte at offset 195, word at
offset 0, or word at offset 4 respectively is zero.

```asm
@ func_004E7048
ldrb r0,[r0,#195]
cmp r0,#0
moveq r0,#1
movne r0,#0
bx lr

@ func_004E9420
ldr r0,[r0]
cmp r0,#0
moveq r0,#1
movne r0,#0
bx lr

@ func_004E9C00
ldr r0,[r0,#4]
cmp r0,#0
moveq r0,#1
movne r0,#0
bx lr
```

`func_004E71E0` is a 16-byte equality test for byte 195. It returns one only
when that byte is one. Preserve the absence of `moveq`; the load itself
already placed one in `r0` on the equal path.

```asm
ldrb r0,[r0,#195]
cmp r0,#1
movne r0,#0
bx lr
```

`func_004E6B20` is a 20-byte unsigned threshold test. It returns one when the
halfword at offset 0 is below 900, otherwise zero.

```asm
ldrh r0,[r0]
cmp r0,#900
movcc r0,#1
movcs r0,#0
bx lr
```

`func_004E6E80` is a 20-byte conditional pointer accessor. If byte 177 is
zero it returns zero; otherwise it returns the word at offset 148.

```asm
ldrb r1,[r0,#177]
cmp r1,#0
ldrne r0,[r0,#148]
moveq r0,#0
bx lr
```

`func_004E8944` and `func_004E8958` first add the unsigned byte index in
entry `r1` directly to entry `r0`. The former returns whether byte 11 of that
record is nonzero; the latter returns whether byte 4 equals one. Preserve each
partial conditional normalization.

```asm
@ func_004E8944, 20 bytes
add r0,r0,r1
ldrb r0,[r0,#11]
cmp r0,#0
movne r0,#1
bx lr

@ func_004E8958, 20 bytes
add r0,r0,r1
ldrb r0,[r0,#4]
cmp r0,#1
movne r0,#0
bx lr
```

`func_004EA52C` and `func_004EA56C` are 20-byte bit-test normalizers. Each
adds 256 before loading the halfword at a further offset of 168, tests bit 1
or bit 0 with flag-setting `ands`, and changes a nonzero result to one.

```asm
@ func_004EA52C: bit 1
add r0,r0,#256
ldrh r0,[r0,#168]
ands r0,r0,#2
movne r0,#1
bx lr

@ func_004EA56C: bit 0
add r0,r0,#256
ldrh r0,[r0,#168]
ands r0,r0,#1
movne r0,#1
bx lr
```

## Fixed-layout copy

`func_004E76B0` is a 20-byte copy leaf. It performs a word load from the
possibly unaligned source offset 86 and stores that word at output offset 0,
then copies the source halfword at offset 90 to output offset 4. Preserve both
access widths and the word-before-halfword order.

```asm
ldr r2,[r1,#86]
str r2,[r0]
ldrh r1,[r1,#90]
strh r1,[r0,#4]
bx lr
```

## Implementation contract

- Emit all 30 functions in ARM state with four-byte function alignment and
  the exact body sizes recorded in the manifest.
- Preserve every displayed mnemonic, register, condition suffix, addressing
  mode, access width, and instruction order.
- Do not introduce literal pools, calls, adjacent data, or symbolic slots.
- The three indexed word lookups, the eight mask-and-shift leaves, and the
  boolean families share semantic shapes only; their field offsets, masks,
  shifts, and normalization schedules remain function-specific.
