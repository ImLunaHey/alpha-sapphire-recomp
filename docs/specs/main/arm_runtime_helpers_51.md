# Probe-verified ARM runtime/leaf-helper batch 51

## Scope and provenance

This clean-room specification covers 15 currently unmatched ARM-state,
call-free helpers totaling 1,168 executable bytes. Evidence was limited to the
current unmatched report, neutral symbol inventory, bounded private-target
control/data-flow inspection, and independently assembled exact-schedule
probes. The selection excludes all earlier configured functions, duplicate
batch 51 reservations, and IPC batch 47 reservations.

No selected function has a call, literal pool, adjacent word, relocation, or
symbolic identity. Independent ARMv6K assembly comparison against target
revision `AS_EUR_REV2` on 2026-10-16 matched all 15 complete bodies and all
1,168 body bytes. Use this common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

Labels and directives occupy no executable bytes. Preserve every displayed
mnemonic, operand, register, condition, addressing mode, and instruction
order.

## Compact flag and membership predicates

`func_004D17E8` is 20 bytes. Return bit two of the unsigned halfword at offset
4 of the object selected through owner offset 8.

```asm
ldr r0,[r0,#8]
ldrh r0,[r0,#4]
and r0,r0,#4
lsr r0,r0,#2
bx lr
```

`func_004D373C` is 20 bytes. Return one exactly when the byte at offset 24 is
six.

```asm
ldrb r0,[r0,#24]
cmp r0,#6
moveq r0,#1
movne r0,#0
bx lr
```

`func_004D84E0` is 60 bytes. Read the unsigned halfword at offset 12 and return
one for values 219, 220, 221, 222, or 398; return zero otherwise. Preserve the
split comparison and subtract schedule.

```asm
ldrh r0,[r0,#12]
cmp r0,#221
beq 2f
bgt 1f
cmp r0,#219
cmpne r0,#220
beq 2f
3: mov r0,#0
bx lr
1: cmp r0,#222
subne r0,r0,#256
subsne r0,r0,#142
bne 3b
2: mov r0,#1
bx lr
```

`func_004DC490` is 20 bytes. Load the mask word at owner offset 8 and return
one exactly when every bit set in `r1` is also set in the mask.

```asm
ldr r0,[r0,#8]
bics r0,r1,r0
moveq r0,#1
movne r0,#0
bx lr
```

`func_004E87F8` is 64 bytes. For an index below 32, select a 264-byte record
(`index * 33 * 8`), test bit zero of its word at offset 4, and return the
boolean. An out-of-range index executes the displayed zero-register diagnostic
schedule and returns zero.

```asm
push {r4,lr}
cmp r1,#32
mov r4,#0
bhs 1f
add r1,r1,r1,lsl #5
add r0,r0,r1,lsl #3
ldr r0,[r0,#4]
tst r0,#1
movne r4,#1
b 2f
1: mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
2: mov r0,r4
pop {r4,pc}
```

`func_0053FF04` is 52 bytes. Extract bits 10 through 17 from `r0`; only class
17 continues. Then extract the low ten bits and return one exactly for the
inclusive range 100 through 179.

```asm
and r1,r0,#261120
lsr r1,r1,#10
cmp r1,#17
bne 1f
lsl r0,r0,#22
lsr r0,r0,#22
cmp r0,#100
blt 1f
cmp r0,#179
movle r0,#1
ble 2f
1: mov r0,#0
2: bx lr
```

## Search and selection helpers

`func_004D8D18` is 64 bytes. Follow owner offset 20. If absent, immediately
return null. Otherwise, when the unsigned halfword count at offset 6 exceeds
`r1`, return `base + 24 * index`; on a failed bound, execute the displayed
zero-register diagnostic schedule and return null.

```asm
ldr r2,[r0,#20]
cmp r2,#0
moveq r0,#0
bxeq lr
push {r4,lr}
ldrh r0,[r0,#6]
cmp r0,r1
addhi r0,r1,r1,lsl #1
addhi r0,r2,r0,lsl #3
bhi 1f
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
mov r0,#0
1: pop {r4,pc}
```

`func_004D9360` is 92 bytes. Compare `r1` with four consecutive bytes at
offsets 2584 through 2587. Return the first matching lane index zero through
three. When none matches, execute the displayed zero-register diagnostic
schedule and return zero (the same numeric result as lane zero).

```asm
ldrb r2,[r0,#2584]
cmp r2,r1
moveq r0,#0
bxeq lr
ldrb r2,[r0,#2585]
cmp r2,r1
moveq r0,#1
bxeq lr
ldrb r2,[r0,#2586]
cmp r2,r1
moveq r0,#2
bxeq lr
push {r4,lr}
ldrb r0,[r0,#2587]
cmp r0,r1
moveq r0,#3
beq 1f
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
mov r0,#0
1: pop {r4,pc}
```

`func_004E89F0` is 80 bytes. Examine sixteen pairs of unsigned halfwords in a
64-halfword table beginning at owner offset 1024. For each pair, continue only
when both values either have bits 15 through 30 clear or have bit 15 set.
Return one on the first disallowed value and zero after all sixteen pairs.

```asm
mov r1,#0
1: add r2,r0,r1,lsl #1
add r2,r2,#1024
ldrh r3,[r2,#4]
lsls r12,r3,#17
beq 2f
tst r3,#32768
beq 4f
2: ldrh r2,[r2,#6]
lsls r3,r2,#17
beq 3f
tst r2,#32768
beq 4f
3: add r1,r1,#2
cmp r1,#32
blo 1b
mov r0,#0
bx lr
4: mov r0,#1
bx lr
```

`func_00505AB4` is 92 bytes. Resolve the data base from owner offset 8; when
that field is null, use `owner[0] + owner[0][16]`. Require `r1` to satisfy the
three signed upper-bound checks at owner offsets 32, 40, and 44, with the last
check also requiring a nonnegative index. On failure, store null through `r2`
and return five. On success, store `base + index` and return zero.

```asm
ldr r3,[r0,#8]
ldr r12,[r0]
cmp r3,#0
ldreq r3,[r12,#16]
addeq r3,r3,r12
ldr r12,[r0,#32]
cmp r12,r1
bgt 1f
ldr r12,[r0,#40]
cmp r12,r1
bgt 2f
1: cmp r1,#0
ldrge r0,[r0,#44]
cmpge r0,r1
bgt 3f
2: mov r0,#0
str r0,[r2]
mov r0,#5
bx lr
3: add r0,r3,r1
str r0,[r2]
mov r0,#0
bx lr
```

## Bounded halfword sequence helpers

`func_004EC398` is 68 bytes. Treat owner offset 28 as a byte length and owner
offset 24 as a halfword array. If `r1 < length / 2`, return whether the indexed
halfword is nonzero. An invalid index executes the diagnostic schedule and
returns zero.

```asm
push {r4,lr}
ldr r2,[r0,#28]
cmp r1,r2,lsr #1
blo 1f
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
2: mov r0,#0
pop {r4,pc}
1: ldr r0,[r0,#24]
add r0,r0,r1,lsl #1
ldrh r0,[r0]
cmp r0,#0
movne r0,#1
beq 2b
pop {r4,pc}
```

`func_004EDA64` is 56 bytes. It is the value-returning variant with byte length
at owner offset 8 and halfword-array pointer at offset 4. A valid index returns
the indexed unsigned halfword; an invalid one executes the diagnostic schedule
and returns zero.

```asm
push {r4,lr}
ldr r2,[r0,#8]
cmp r1,r2,lsr #1
blo 1f
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
mov r0,#0
pop {r4,pc}
1: ldr r0,[r0,#4]
add r0,r0,r1,lsl #1
ldrh r0,[r0]
pop {r4,pc}
```

`func_004EC2D0` is 200 bytes. Search candidate indices 1 through 721 in a
halfword array described by owner offsets 24 and 28. For each candidate, an
out-of-range fetch yields zero after the diagnostic schedule. Return the first
index whose halfword equals `r1` and whose nonzero-status equals `r2`; return
zero when no candidate matches. Preserve the redundant range tests and branch
layout.

```asm
push {r4,r5,r6,r7,r8,r9,r10,r11,r12,lr}
mov r4,#1
mov r5,r0
mov r7,r1
mov r8,r2
mov r11,r4
mov r10,#0
add r9,r4,#720
1: ldr r0,[r5,#28]
cmp r4,r0,lsr #1
blo 2f
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
mov r6,#0
nop
b 3f
2: ldr r1,[r5,#24]
add r0,r1,r4,lsl #1
ldrh r6,[r0]
3: ldr r1,[r5,#28]
cmp r4,r1,lsr #1
blo 5f
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
4: mov r0,r10
6: cmp r6,r7
cmpeq r8,r0
bne 7f
mov r0,r4
pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
5: ldr r1,[r5,#24]
add r0,r1,r4,lsl #1
ldrh r0,[r0]
cmp r0,#0
movne r0,r11
bne 6b
b 4b
7: add r4,r4,#1
cmp r4,r9
ble 1b
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
mov r0,#0
pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
```

## Free-list selection and record copy

`func_004D4364` is 204 bytes. Traverse an intrusive list whose sentinel is
`owner + 116 - owner[128]`; each stored link and candidate base is biased by
`owner[128]`. For each node, compute an aligned allocation interval from node
fields 8 and 12 using size `r1` and alignment `r2`. Select immediately when
policy `r3` is zero. Policy one keeps the candidate with the smaller field-8
value; policy two keeps the larger. Other policy values skip candidates.

```asm
push {r4,r5,r6,r7,r8,r9}
mov r7,r0
mov r0,#0
ldr r5,[r7,#128]
ldr r12,[r7,#120]
sub r8,r2,#1
sub r12,r12,r5
b 8f
1: ldr r9,[r12,#8]
cmp r9,r1
blo 7f
ldr r6,[r12,#12]
add r6,r6,#16
adds r4,r6,r12
add r6,r4,r2
sub r6,r6,#1
bic r6,r6,r8
subs r4,r6,r4
add r4,r4,r1
cmp r4,r9
bhi 7f
cmp r3,#0
beq 6f
cmp r0,#0
beq 5f
cmp r3,#1
beq 3f
cmp r3,#2
beq 4f
b 7f
6: pop {r4,r5,r6,r7,r8,r9}
mov r0,r12
bx lr
3: ldr r4,[r0,#8]
cmp r4,r9
bls 7f
b 5f
4: ldr r4,[r0,#8]
cmp r4,r9
bhs 7f
5: mov r0,r12
7: add r12,r12,r5
ldr r12,[r12,#4]
sub r12,r12,r5
8: ldr r4,[r7,#128]
add r6,r7,#116
sub r4,r6,r4
cmp r12,r4
bne 1b
pop {r4,r5,r6,r7,r8,r9}
bx lr
```

`func_0054E91C` is 76 bytes. Copy nine selected words from `r1` to `r0`,
leaving offsets 12 and 28 untouched. Preserve the scalar load/store order.

```asm
ldr r2,[r1]
str r2,[r0]
ldr r2,[r1,#4]
str r2,[r0,#4]
ldr r2,[r1,#8]
str r2,[r0,#8]
ldr r3,[r1,#16]
str r3,[r0,#16]
ldr r3,[r1,#20]
str r3,[r0,#20]
ldr r2,[r1,#24]
str r2,[r0,#24]
ldr r2,[r1,#32]
str r2,[r0,#32]
ldr r2,[r1,#36]
str r2,[r0,#36]
ldr r1,[r1,#40]
str r1,[r0,#40]
bx lr
```

## Implementer acceptance contract

- Define exactly the 15 manifest functions in one ARM assembly source.
- Each function belongs in its own `.text.<name>` executable section and must
  carry global/function type and size metadata.
- Emit no literal pools, adjacent words, calls, or relocation-bearing symbol
  references.
- The object validator must check manifest/source parity, ARM mapping symbols,
  exact section sizes, absence of relocations, and zero adjacent words.
- Integrate the source, validator, and manifest with the established target
  build and repository checks without reading private target artifacts.
