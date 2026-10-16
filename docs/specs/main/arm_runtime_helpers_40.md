# Probe-verified ARM runtime/leaf-helper batch 40

## Scope and provenance

This clean-room specification covers seven still-unmatched ARM-state leaf
helpers totaling 1,300 executable bytes. Evidence was limited to the current
unmatched report, neutral symbols, bounded private-target control/data-flow
inspection, and independent exact-schedule probes. The selection is disjoint
from all earlier runtime-helper manifests.

All seven bodies are call-free. They contain no relocations, literal pools,
adjacent words, or symbolic data identities. No private absolute address, raw
byte sequence, instruction encoding, proprietary source, or opaque private
literal value is recorded here.

The schedules were independently assembled with GNU Arm Embedded 15.2 for
ARMv6K/VFPv2 and compared with target revision `AS_EUR_REV2` on 2026-10-16.
All complete bodies and all 1,300 body bytes matched directly, without
normalization. Use this common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

## `func_004A8D18` — six-word byte-field packer

This 156-byte leaf reads bytes 0 and 4--15 from entry `r0`, emits six words at
entry `r1`, and returns the destination advanced by 24 bytes. Words 0, 2, 3,
and 4 pack three bytes as `byte_c | (byte_b << 10) | (byte_a << 20)` using
source triples `(10,11,12)`, `(13,14,15)`, `(4,5,6)`, and `(7,8,9)`.
Word 1 combines byte 0 with the exact immediate flag-building schedule below;
word 5 is zero.

```asm
push {r4,r5,r6}
mov r6,#320
ldrb r3,[r0,#11]
ldrb r4,[r0,#10]
ldrb r5,[r0]
ldrb r12,[r0,#12]
lsl r3,r3,#10
orr r4,r3,r4,lsl #20
add r3,r6,r5,lsl #4
orr r12,r12,r4
orr r3,r3,#0x80000000
str r12,[r1],#4
orr r3,r3,#0x3f0000
str r3,[r1],#4
ldrb r3,[r0,#14]
ldrb r12,[r0,#13]
ldrb r4,[r0,#15]
mov r2,#0
lsl r3,r3,#10
orr r3,r3,r12,lsl #20
orr r3,r3,r4
str r3,[r1],#4
ldrb r3,[r0,#5]
ldrb r12,[r0,#4]
ldrb r4,[r0,#6]
lsl r3,r3,#10
orr r3,r3,r12,lsl #20
orr r3,r3,r4
str r3,[r1],#4
ldrb r3,[r0,#8]
ldrb r12,[r0,#7]
ldrb r0,[r0,#9]
lsl r3,r3,#10
orr r3,r3,r12,lsl #20
orr r0,r0,r3
stmia r1!,{r0,r2}
mov r0,r1
pop {r4,r5,r6}
bx lr
```

## `func_004B71D0` — scaled diagonal-triple accumulation

This 140-byte VFP leaf takes a scalar in entry `s0`, destination record in
entry `r1`, and source record in entry `r2`. The source triple is at offsets
12, 28, and 44. Unless the exact integer precheck on the scalar branches to
return, the helper either initializes or accumulates that triple into the
same destination offsets according to destination flag bit 2. It clears bit 2,
sets bit 11, and preserves all other destination flags at offset 60.

```asm
vmov r0,s0
add r3,r0,#0x40000000
adds r3,r3,#0x800000
beq 3f
vldr s1,[r2,#12]
vldr s2,[r2,#28]
vldr s3,[r2,#44]
ldr r2,[r1,#60]
mov r0,#4
bics r0,r0,r2
beq 2f
vmul.f32 s1,s1,s0
vmul.f32 s2,s2,s0
vmul.f32 s3,s3,s0
vldr s5,[r1,#12]
vldr s4,[r1,#28]
vldr s6,[r1,#44]
orr r0,r2,#0x800
vadd.f32 s1,s5,s1
vadd.f32 s0,s4,s2
vadd.f32 s2,s6,s3
vstr s1,[r1,#12]
vstr s0,[r1,#28]
vstr s2,[r1,#44]
1:
str r0,[r1,#60]
3:
bx lr
2:
vmul.f32 s4,s1,s0
vmul.f32 s1,s2,s0
vmul.f32 s0,s3,s0
bic r0,r2,#4
orr r0,r0,#0x800
vstr s4,[r1,#12]
vstr s1,[r1,#28]
vstr s0,[r1,#44]
b 1b
```

## `func_004B725C` — scaled six-component accumulation

This 220-byte VFP leaf applies entry `s0` to six source components at offsets
0, 4, 8, 16, 20, and 24. Unless the same exact scalar precheck returns early,
destination flag bit 4 selects initialization (bit clear) versus fused
multiply-add accumulation (bit set). The helper clears bit 4, sets bit 11,
and preserves the remaining flags at destination offset 60.

```asm
vmov r0,s0
add r3,r0,#0x40000000
adds r3,r3,#0x800000
beq 3f
ldr r3,[r1,#60]
mov r0,#16
bics r0,r0,r3
beq 2f
vldr s1,[r1]
vldr s2,[r2]
vmla.f32 s1,s2,s0
vstr s1,[r1]
vldr s1,[r1,#4]
vldr s2,[r2,#4]
vmla.f32 s1,s2,s0
vstr s1,[r1,#4]
vldr s1,[r1,#8]
vldr s2,[r2,#8]
vmla.f32 s1,s2,s0
vstr s1,[r1,#8]
vldr s1,[r1,#16]
vldr s2,[r2,#16]
vmla.f32 s1,s2,s0
vstr s1,[r1,#16]
vldr s1,[r1,#20]
vldr s2,[r2,#20]
vmla.f32 s1,s2,s0
vstr s1,[r1,#20]
vldr s2,[r2,#24]
vldr s1,[r1,#24]
vmla.f32 s1,s2,s0
vstr s1,[r1,#24]
1:
bic r0,r3,#16
orr r0,r0,#0x800
str r0,[r1,#60]
3:
bx lr
2:
vldr s1,[r2]
vmul.f32 s1,s1,s0
vstr s1,[r1]
vldr s1,[r2,#4]
vmul.f32 s1,s1,s0
vstr s1,[r1,#4]
vldr s1,[r2,#8]
vmul.f32 s1,s1,s0
vstr s1,[r1,#8]
vldr s1,[r2,#16]
vmul.f32 s1,s1,s0
vstr s1,[r1,#16]
vldr s1,[r2,#20]
vmul.f32 s1,s1,s0
vstr s1,[r1,#20]
vldr s1,[r2,#24]
vmul.f32 s0,s1,s0
vstr s0,[r1,#24]
b 1b
```

## `func_004B7614` — scaled contiguous-triple accumulation

This 152-byte VFP leaf is the contiguous counterpart: it scales source
offsets 48, 52, and 56 into destination offsets 48, 52, and 56. Destination
flag bit 3 selects initialization versus accumulation. It clears bit 3, sets
bit 11, and otherwise preserves the flags at offset 60.

```asm
vmov r0,s0
add r3,r0,#0x40000000
adds r3,r3,#0x800000
beq 3f
ldr r12,[r1,#60]
mov r3,#8
add r0,r1,#48
bics r3,r3,r12
beq 2f
vldr s2,[r2,#48]
vldr s1,[r2,#52]
vldr s3,[r2,#56]
vmul.f32 s2,s2,s0
vmul.f32 s1,s1,s0
vmul.f32 s0,s3,s0
vldr s3,[r0]
vadd.f32 s2,s3,s2
vstr s2,[r0]
vldr s2,[r0,#4]
vadd.f32 s1,s2,s1
vstr s1,[r0,#4]
vldr s1,[r0,#8]
vadd.f32 s0,s1,s0
1:
vstr s0,[r0,#8]
ldr r0,[r1,#60]
bic r0,r0,#8
orr r0,r0,#0x800
str r0,[r1,#60]
3:
bx lr
2:
vldr s1,[r2,#48]
vmul.f32 s1,s1,s0
vstr s1,[r0]
vldr s1,[r2,#52]
vmul.f32 s1,s1,s0
vstr s1,[r0,#4]
vldr s1,[r2,#56]
vmul.f32 s0,s1,s0
b 1b
```

## `func_004C3E9C` — mode-selected float-field updater

This 216-byte VFP leaf reads a mode at offset 20 of the object reached through
entry `r0`. Mode zero compares and conditionally replaces the pair at entry
`r1` offsets 16/20; mode one does the same for the scalar at offset 24; mode
two handles the pair at offsets 28/32. Other modes do not copy fields. Quiet
single-precision equality comparisons are exact and ordered. In every mode,
the byte at entry `r1` offset 36 is finally set to one, and the helper returns
one.

```asm
ldr r0,[r0]
ldr r0,[r0,#20]
cmp r0,#0
beq 1f
cmp r0,#1
beq 3f
cmp r0,#2
bne 6f
b 4f
1:
vldr s1,[r1,#16]
vldr s0,[r2]
add r0,r1,#16
vcmp.f32 s1,s0
vmrs APSR_nzcv,fpscr
bne 2f
vldr s1,[r0,#4]
vldr s2,[r2,#4]
vcmp.f32 s1,s2
vmrs APSR_nzcv,fpscr
beq 6f
2:
vldr s1,[r2,#4]
add r0,r1,#16
mov r2,#1
vstmia r0,{s0-s1}
strb r2,[r1,#36]
b 6f
3:
vldr s0,[r2]
vldr s1,[r1,#24]
vcmp.f32 s1,s0
vmrs APSR_nzcv,fpscr
beq 6f
vstr s0,[r1,#24]
mov r2,#1
strb r2,[r1,#36]
b 6f
4:
vldr s1,[r1,#28]
vldr s0,[r2]
add r0,r1,#28
vcmp.f32 s1,s0
vmrs APSR_nzcv,fpscr
bne 5f
vldr s1,[r0,#4]
vldr s2,[r2,#4]
vcmp.f32 s1,s2
vmrs APSR_nzcv,fpscr
beq 6f
5:
vldr s1,[r2,#4]
add r0,r1,#28
mov r2,#1
vstmia r0,{s0-s1}
strb r2,[r1,#36]
6:
mov r0,#1
strb r0,[r1,#36]
bx lr
```

## Nested-table search identity class

`func_004D5B8C` and `func_004D6E90` are a two-member exact structural class.
Each receives a container in `r0`, sought candidate word in `r1`, and sought
outer-record word in `r2`. The container has an unsigned outer count at offset
4 and a table base at offset 8; each outer slot is 20 bytes, with its record
pointer at slot offset 4. Null records and records whose word 0 differs from
entry `r2` are skipped.

For a matching outer record, each helper scans a positive signed-halfword
count. It resolves the per-candidate relative offset against the outer-record
base, compares candidate word 0 with entry `r1`, and returns the matching
candidate pointer or zero. The only class parameters are:

| Function | Signed count | Relative-table field |
| --- | ---: | ---: |
| `func_004D5B8C` | 10 | 24 |
| `func_004D6E90` | 14 | 32 |

Both bodies are 208 bytes. Their exact common schedule follows, with `COUNT`
and `TABLE` replaced by the row values above:

```asm
push {r4,r5,r6,r7,r8,r9,r10,r11,r12,lr}
mov r5,r0
mov r8,r1
mov r10,r2
mov r9,#0
ldr r0,[r0,#4]
cmp r0,#0
movhi r11,#4
bls 5f
1:
ldr r1,[r5,#8]
add r0,r9,r9,lsl #2
add r6,r11,r0,lsl #2
ldr r0,[r1,r6]
cmp r0,#0
beq 4f
ldr r1,[r0]
cmp r1,r10
bne 4f
ldrsh r0,[r0,#COUNT]
mov r4,#0
cmp r0,#0
bls 4f
2:
ldr r0,[r5,#8]
mov r7,#0
ldr r0,[r0,r6]
ldr r1,[r0,#TABLE]
ldrsh r2,[r0,#COUNT]
add r1,r1,r0
cmp r2,r4
ldrhi r1,[r1,r4,lsl #2]
addhi r7,r1,r0
bhi 3f
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
3:
ldr r1,[r7]
mov r0,r7
cmp r1,r8
beq 6f
ldr r0,[r5,#8]
add r4,r4,#1
ldr r0,[r0,r6]
ldrsh r0,[r0,#COUNT]
cmp r0,r4
bhi 2b
4:
ldr r0,[r5,#4]
add r9,r9,#1
cmp r0,r9
bhi 1b
5:
mov r0,#0
6:
pop {r4,r5,r6,r7,r8,r9,r10,r11,r12,pc}
```

Preserve unsigned `bls`/`bhi` loop conditions after the signed-halfword
loads. The four-instruction zero/no-op block is target-visible even though the
preceding bound establishes the `bhi` path during ordinary execution.

## Calls, slots, and identities

There are no direct or indirect calls, external branches, relocations,
literal-pool slots, adjacent words, or symbolic identities in this batch.
The two nested-table searches form one parameterized structural identity
class; all other bodies are singletons.
