# Probe-verified ARM runtime/leaf-helper batch 39

## Scope and provenance

This clean-room specification covers six still-unmatched ARM-state leaf
helpers totaling 1,140 executable bytes. The evidence was limited to the
current unmatched report, the neutral symbol inventory, bounded private-target
control/data-flow inspection, and independent exact-schedule probes. The six
functions contain no calls, relocations, literal pools, adjacent words, or
symbolic data identities.

The documented schedules were independently assembled with GNU Arm Embedded
15.2 for ARMv6K/VFPv2 and compared with target revision `AS_EUR_REV2` on
2026-10-16. All six complete bodies and all 1,140 body bytes matched directly,
without normalization. Object inspection found no relocations or undefined
symbols in the probe object.

The selection is disjoint from all earlier neutral manifests. It is also
disjoint from duplicate-template batch 39; that batch's analyst explicitly
confirmed reciprocal exclusion of these six symbols. No private absolute
address, raw byte sequence, instruction encoding, proprietary source, or
opaque private value is recorded here.

All schedules use this common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

## `func_00337AB8` — clear nested type-seven entries

This 188-byte leaf loads a root through entry `r0`. For every outer entry, it
resolves the relative link at root offset 28 and the relative link at outer
entry offset 40. If the resolved record has type seven at offset 8, it resolves
each entry in the relative-link table at offset 20 and clears word offset 28
in every resolved entry. Nonpositive outer and inner counts skip their loops.

```asm
ldr r1,[r0]
mov r12,#0
ldr r1,[r1,#24]
cmp r1,#0
bxle lr
push {r4,r5}
mov r4,#0
1:
ldr r1,[r0]
ldr r2,[r1,#28]!
cmp r2,#0
addne r1,r1,r2
moveq r1,r4
cmp r1,#0
beq 4f
add r1,r1,r12,lsl #4
ldr r2,[r1,#40]!
cmp r2,#0
moveq r1,r4
addne r1,r1,r2
4:
ldr r2,[r1,#8]
cmp r2,#7
bne 3f
ldr r2,[r1,#16]
mov r3,#0
cmp r2,#0
ble 3f
2:
ldr r5,[r1,#20]
add r2,r1,#20
cmp r5,#0
addne r2,r2,r5
moveq r2,r4
ldr r5,[r2,r3,lsl #2]!
add r3,r3,#1
cmp r5,#0
addne r2,r2,r5
moveq r2,r4
str r4,[r2,#28]
ldr r2,[r1,#16]
cmp r2,r3
bgt 2b
3:
ldr r1,[r0]
add r12,r12,#1
ldr r1,[r1,#24]
cmp r1,r12
bgt 1b
pop {r4,r5}
bx lr
```

Preserve the early conditional return before the register save, both
writeback relative-link loads, and the repeated inner-count reload.

## `func_003AACD8` — three-component bounds builder

This 192-byte VFP leaf accepts an output at entry `r0`, a packed array of
three-float points at entry `r1`, and a signed point count in entry `r2`. For a
positive count it copies the first point to both the minimum triple at output
offsets 0–8 and maximum triple at offsets 12–20. It scans the remaining points
and updates each component independently. A nonpositive count is a no-op.

```asm
cmp r2,#0
ble 5f
vldmia r1,{s0-s2}
add r3,r0,#12
cmp r2,#1
vstmia r3,{s0-s2}
mov r3,#1
vstmia r0,{s0-s2}
ble 5f
1:
add r12,r3,r3,lsl #1
vldr s1,[r0,#12]
add r12,r1,r12,lsl #2
vldr s0,[r12]
vcmpe.f32 s1,s0
vmrs APSR_nzcv,fpscr
vstrlo s0,[r0,#12]
blo 2f
vldr s1,[r0]
vcmpe.f32 s1,s0
vmrs APSR_nzcv,fpscr
vmovle.f32 s0,s1
vstr s0,[r0]
2:
vldr s1,[r0,#16]
vldr s0,[r12,#4]
vcmpe.f32 s1,s0
vmrs APSR_nzcv,fpscr
vstrlo s0,[r0,#16]
blo 3f
vldr s1,[r0,#4]
vcmpe.f32 s1,s0
vmrs APSR_nzcv,fpscr
vmovle.f32 s0,s1
vstr s0,[r0,#4]
3:
vldr s1,[r0,#20]
vldr s0,[r12,#8]
vcmpe.f32 s1,s0
vmrs APSR_nzcv,fpscr
vstrlo s0,[r0,#20]
blo 4f
vldr s1,[r0,#8]
vcmpe.f32 s1,s0
vmrs APSR_nzcv,fpscr
vmovle.f32 s0,s1
vstr s0,[r0,#8]
4:
add r3,r3,#1
cmp r3,r2
blt 1b
5:
bx lr
```

Preserve each conditional maximum store and immediate branch around the
minimum update. The VFP comparisons are quiet ordered comparisons.

## `func_003C8BC4` — five-stream ring-record append

This 192-byte VFP leaf owns a cursor at entry `r0` offset 2060. Using that
cursor, it appends four words from entry `r1` to the stream beginning at offset
12; three words from entry `r2` to the stream beginning at offset 524; three
words from entry `r3` to the stream beginning at offset 908; three words from
the first entry stack argument to the stream beginning at offset 1292; and
three words from the second entry stack argument to the stream beginning at
offset 1676. The respective strides are 16, 12, 12, 12, and 12 bytes. It then
advances the cursor modulo 32 with the exact signed-arithmetic schedule below.

```asm
push {r4,r5,r6}
add r12,r0,#2048
ldr r6,[r0,#2060]
ldr r4,[sp,#16]
ldr r5,[sp,#12]
add r12,r12,#12
vldmia r1,{s0-s3}
add r1,r0,r6,lsl #4
add r1,r1,#12
vstmia r1,{s0-s3}
ldr r1,[r0,#2060]
vldmia r2,{s0-s2}
add r1,r1,r1,lsl #1
add r1,r0,r1,lsl #2
add r1,r1,#524
vstmia r1,{s0-s2}
ldr r2,[r0,#2060]
ldr r1,[r3,#4]
vldr s0,[r3]
vldr s1,[r3,#8]
add r2,r2,r2,lsl #1
add r2,r0,r2,lsl #2
vstr s0,[r2,#908]
str r1,[r2,#912]
vstr s1,[r2,#916]
ldr r3,[r12]
ldm r5,{r1,r2,r5}
add r3,r3,r3,lsl #1
add r3,r0,r3,lsl #2
add r6,r3,#1296
str r1,[r3,#1292]
stm r6,{r2,r5}
ldr r5,[r12]
ldm r4,{r1,r2,r3}
add r4,r5,r5,lsl #1
add r0,r0,r4,lsl #2
add r4,r0,#1680
str r1,[r0,#1676]
stm r4,{r2,r3}
ldr r0,[r12]
add r0,r0,#1
mov r1,r0,asr #31
add r1,r0,r1,lsr #27
bic r1,r1,#31
sub r0,r0,r1
str r0,[r12]
pop {r4,r5,r6}
bx lr
```

The stack loads occur after the three-register save, so offsets 12 and 16
refer to the first and second entry stack arguments. Preserve the mixed VFP,
scalar, and multiple-transfer spellings.

## `func_004AAFAC` — membership in either ordered tree

This 188-byte leaf reads the search key through entry `r1`. Entry `r0` owns
ordered-tree sentinels at offsets 24 and 92. Nodes use child links at offsets
8 and 12 and a key at offset 16. The helper returns normalized one if the key
exists in either tree and zero otherwise.

```asm
push {r4,r5,r6}
ldr r3,[r0,#24]
ldr r4,[r1]
mov r12,r3
ldr r2,[r3,#4]
cmp r2,#0
beq 2f
1:
ldr r6,[r2,#16]
cmp r6,r4
movhs r3,r2
ldrhs r2,[r2,#8]
ldrlo r2,[r2,#12]
cmp r2,#0
bne 1b
2:
cmp r3,r12
beq 3f
ldr r2,[r3,#16]
cmp r2,r4
bls 4f
3:
mov r3,r12
4:
cmp r3,r12
bne 9f
ldr r2,[r0,#92]
mov r3,r2
ldr r1,[r2,#4]
cmp r1,#0
movne r12,r4
beq 5f
4:
ldr r5,[r1,#16]
cmp r5,r12
movhs r2,r1
ldrhs r1,[r1,#8]
ldrlo r1,[r1,#12]
cmp r1,#0
bne 4b
5:
cmp r2,r3
beq 6f
ldr r1,[r2,#16]
cmp r1,r4
bls 7f
6:
mov r2,r3
7:
cmp r2,r3
moveq r0,#0
beq 10f
9:
mov r0,#1
10:
pop {r4,r5,r6}
bx lr
```

Preserve the apparently redundant sentinel comparisons and the conditional
`movne r12,r4`; they are part of the exact schedule.

## `func_004AB108` — ordered lookup and record projection

This 188-byte leaf searches the ordered tree whose sentinel is at entry `r0`
offset 20. It compares the composite key at entry `r1` offsets 6 and 8 with
node fields at offsets 22 and 24. On a match, it copies the selected node's
two three-word groups to output offsets 4–12 and 16–24, copies node offset 48
to output offset 28, installs entry `r0` offset 32 into node offset 80, and
returns one. Otherwise it returns zero.

```asm
push {r4,r5,r6,r7,r8,r9}
mov r8,#0
ldr r4,[r0,#20]
mov r5,r4
ldr r3,[r4,#4]
cmp r3,#0
beq 2f
ldr r7,[r1,#8]
ldrh r6,[r1,#6]
1:
ldrh r12,[r3,#22]
ldr r9,[r3,#24]
subs r12,r12,r6
sbcs r12,r9,r7
ldrlt r3,[r3,#12]
movge r5,r3
ldrge r3,[r3,#8]
cmp r3,#0
bne 1b
2:
cmp r5,r4
beq 3f
ldr r12,[r1,#8]
ldrh r6,[r1,#6]
ldrh r1,[r5,#22]
ldr r3,[r5,#24]
subs r1,r6,r1
sbcs r1,r12,r3
movge r4,r5
3:
ldr r1,[r0,#20]
cmp r4,r1
beq 4f
ldr r1,[r0,#32]
add r0,r4,#48
add r5,r4,#64
str r1,[r4,#80]
add r1,r4,#52
ldr r0,[r0,#28]
ldm r1,{r1,r3,r12}
add r7,r2,#4
ldm r5,{r4,r5,r6}
mov r8,#1
str r0,[r2,#28]
add r2,r2,#16
stm r7,{r1,r3,r12}
stm r2,{r4,r5,r6}
4:
mov r0,r8
pop {r4,r5,r6,r7,r8,r9}
bx lr
```

The composite comparison uses `subs` followed by `sbcs`; do not replace it
with independent scalar comparisons.

## `func_004C2430` — masked selective word merge

Entry `r1` is the destination descriptor, entry `r2` the source descriptor,
and signed entry `r3` the number of mask bits to consider. Their masks are at
offset 4 and corresponding words begin at offset 8. For each selected source
bit absent from the destination mask, the helper copies its word and sets the
destination bit. The fifth argument is a required-bit mask. It returns one
exactly when every required bit is present after the merge.

```asm
push {r4,r5,r6,r7,r8}
cmp r3,#0
mov r4,#1
ldr r6,[sp,#20]
ldr r0,[r1,#4]
ldr r5,[r2,#4]
add r7,r1,#8
add r12,r2,#8
ble 4f
sub r2,r12,#4
tst r3,#1
sub r12,r7,#4
beq 2f
bic r4,r5,r0
tst r4,#1
beq 1f
ldr r4,[r2,#4]
orr r0,r0,#1
str r4,[r12,#4]
1:
mov r4,#2
add r2,r2,#4
add r12,r12,#4
2:
movs r3,r3,asr #1
beq 4f
6:
bic r7,r5,r0
tst r7,r4
beq 3f
ldr r7,[r2,#4]
orr r0,r0,r4
str r7,[r12,#4]
3:
bic r7,r5,r0
mov r4,r4,lsl #1
tst r7,r4
beq 5f
ldr r7,[r2,#8]
orr r0,r0,r4
str r7,[r12,#8]
5:
subs r3,r3,#1
mov r4,r4,lsl #1
add r2,r2,#8
add r12,r12,#8
bne 6b
4:
bics r2,r6,r0
str r0,[r1,#4]
pop {r4,r5,r6,r7,r8}
moveq r0,#1
movne r0,#0
bx lr
```

The destination and source masks are read even for a nonpositive count.
Preserve the paired loop schedule and the flags from the final `bics` across
the register restore.

## Neutral manifest and relocation contract

| Function | Body size | Calls | Adjacent words | Relocations |
| --- | ---: | ---: | ---: | ---: |
| `func_00337AB8` | 188 | 0 | 0 | 0 |
| `func_003AACD8` | 192 | 0 | 0 | 0 |
| `func_003C8BC4` | 192 | 0 | 0 | 0 |
| `func_004AAFAC` | 188 | 0 | 0 | 0 |
| `func_004AB108` | 188 | 0 | 0 | 0 |
| `func_004C2430` | 192 | 0 | 0 | 0 |

`totalBodySize` is 1,140. `symbolicIdentities` is empty. Every function must
occupy one four-byte-aligned executable section, export one global ARM
function symbol of the stated size, contain no undefined symbols, and end at
the body extent with no post-body bytes.

## Probe evidence and acceptance checks

Each schedule was assembled independently with GNU Arm Embedded 15.2 for
ARMv6K/VFPv2. Complete section-body comparison matched all 1,140 bytes against
the corresponding target bodies without normalization. The six emitted global
function symbols had the stated extents, and object inspection found zero
relocations and zero undefined symbols.

The permanent validator should reproduce those comparisons, normalize source
whitespace and require the instruction schedules above exactly, recheck all
six functions remain unmatched in the current report, and reject overlap with
any earlier manifest or concurrent batch selection.
