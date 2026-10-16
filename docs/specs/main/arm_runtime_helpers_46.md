# Probe-verified ARM runtime/leaf-helper batch 46

## Scope and provenance

This clean-room specification covers 20 currently unmatched ARM-state helpers
totaling 640 executable bytes. Evidence was limited to the current unmatched
report, neutral symbols, bounded private-target control/data-flow inspection,
and independent exact-schedule probes. The selection excludes
`func_002EBDF8` and `func_002F9968`, which are reserved for duplicate-template
batch 46, and is disjoint from all earlier runtime-helper manifests.

Every body is a call-free leaf. Two VFP leaves each have three aligned scalar
words immediately after their function extent. Those six positions represent
three pairwise-distinct semantic identities, with each identity repeated once
in each leaf. Only their placement, equality, and operand roles are specified;
their private representations are not. No private absolute address, raw byte
sequence, instruction encoding, or private slot value is recorded here.

The schedules were independently assembled with GNU Arm Embedded 15.2 for
ARMv6K/VFPv2 and compared with target revision `AS_EUR_REV2` on 2026-10-16.
All 20 complete bodies and all 640 body bytes matched directly. Use this
common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

## Field access and normalization

`func_004E43FC` is a 44-byte field-return leaf with an intentionally noisy
zero path. It always returns the word at offset 52. When that word is zero it
also clears `r2`, copies that zero through `r1` and `r0`, performs an inert
self-move, and then reloads the field. Preserve the path-dependent clobbers.

```asm
push {r4,lr}
mov r4,r0
ldr r0,[r0,#52]
cmp r0,#0
bne 1f
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
1:
ldr r0,[r4,#52]
pop {r4,pc}
```

`func_004E4430` returns zero when the word at offset 52 is zero and one when
it is nonzero. The loaded zero itself supplies the false result.

```asm
ldr r0,[r0,#52]
cmp r0,#0
movne r0,#1
bx lr
```

`func_004E6014` and `func_004E6084` canonicalize the unsigned byte at offset
10 or 14 respectively: zero and one are returned unchanged, while every other
value becomes two. Preserve the final branch to the immediately following
return.

```asm
@ func_004E6014: use byte offset 10
@ func_004E6084: use byte offset 14
ldrb r0,[r0,#FIELD_OFFSET]
cmp r0,#0
cmpne r0,#1
movne r0,#2
beq 1f
1:
bx lr
```

`func_004E6064` tests the bit selected by entry `r1` in the byte at offset 15
and normalizes a set bit to one. Retain the register-controlled shift and the
flag-setting `ands`.

```asm
ldrb r0,[r0,#15]
mov r2,#1
ands r0,r0,r2,lsl r1
movne r0,#1
bx lr
```

`func_004E68C4` extracts bits 9 through 12 from the word at offset 40, tests
the extracted bit selected by entry `r1`, and returns zero or one.

```asm
ldr r0,[r0,#40]
mov r2,#1
and r0,r0,#7680
lsr r0,r0,#9
ands r0,r0,r2,lsl r1
movne r0,#1
bx lr
```

`func_004E6FA0` returns one exactly when the byte at offset 195 equals three.

```asm
ldrb r0,[r0,#195]
cmp r0,#3
moveq r0,#1
movne r0,#0
bx lr
```

`func_004EA03C` extracts bits 4 through 7 of the word at offset 4 and returns
one exactly when that nibble equals one. Preserve the conditional compare and
the branch to the immediately following return.

```asm
ldr r0,[r0,#4]
lsl r0,r0,#24
lsrs r0,r0,#28
cmpne r0,#1
movne r0,#0
beq 1f
1:
bx lr
```

## Shared-coefficient VFP leaves

The three semantic scalar identities in this section are pairwise distinct.
`runtime_curve_coefficient_a_46`, `runtime_curve_coefficient_b_46`, and
`runtime_curve_coefficient_c_46` are each used once by each function. Their
names describe operand roles only and do not reveal their representations.

`func_004E4670` is a 60-byte body followed by three words at offsets 60, 64,
and 68 carrying identities A, B, and C respectively. Its complete body is:

```asm
vadd.f32 s7,s2,s4
vsub.f32 s1,s1,s3
vldr s8,.Lcoefficient_c
vldr s6,.Lcoefficient_a
vldr s5,.Lcoefficient_b
vnmls.f32 s4,s2,s8
vmla.f32 s7,s1,s6
vmls.f32 s4,s1,s5
vmul.f32 s1,s7,s5
vmul.f32 s3,s4,s6
vmul.f32 s1,s1,s0
vmul.f32 s1,s1,s0
vmla.f32 s1,s3,s0
vadd.f32 s0,s1,s2
bx lr
.Lcoefficient_a: @ adjacent offset 60; runtime_curve_coefficient_a_46
.Lcoefficient_b: @ adjacent offset 64; runtime_curve_coefficient_b_46
.Lcoefficient_c: @ adjacent offset 68; runtime_curve_coefficient_c_46
```

`func_004E46B8` is a 52-byte body followed by identities C, A, and B at
offsets 52, 56, and 60. Preserve both the reordered slots and operation order.

```asm
vldr s8,.Lcoefficient_c
vadd.f32 s5,s2,s4
vsub.f32 s3,s1,s3
vnmls.f32 s4,s2,s8
vldr s7,.Lcoefficient_a
vldr s6,.Lcoefficient_b
vmla.f32 s5,s3,s7
vmls.f32 s4,s3,s6
vmla.f32 s4,s5,s0
vmla.f32 s2,s0,s4
vmla.f32 s1,s0,s2
vmov.f32 s0,s1
bx lr
.Lcoefficient_c: @ adjacent offset 52; runtime_curve_coefficient_c_46
.Lcoefficient_a: @ adjacent offset 56; runtime_curve_coefficient_a_46
.Lcoefficient_b: @ adjacent offset 60; runtime_curve_coefficient_b_46
```

Labels and adjacent words occupy no executable body bytes.

## Bounded four-word copies

`func_004E7F90` accepts a base in `r0`, unsigned index in `r1`, and output in
`r2`. An index at least 100 returns zero. Otherwise it copies the four words
at `base + 4 + 16*index` to the output and returns one. Preserve the VFP
multi-register transfers.

```asm
cmp r1,#100
movcs r0,#0
bcs 1f
add r0,r0,r1,lsl #4
add r0,r0,#4
vldmia r0,{s0-s3}
mov r0,#1
vstmia r2,{s0-s3}
1:
bx lr
```

`func_004E8384` accepts the same register roles. An index at least five
returns zero. Otherwise it copies 16 bytes beginning at
`base + 31360 + 16*index` using the exact mixed VFP/word schedule and returns
one. The post-indexed word load advances `r1` before the following addition;
the post-indexed word store similarly advances `r2`.

```asm
cmp r1,#5
movcs r0,#0
bcs 1f
add r0,r0,r1,lsl #4
add r1,r0,#30720
vldr s0,[r1,#640]
ldr r0,[r1,#644]!
add r1,r1,#4
vldmia r1,{s1-s2}
vstr s0,[r2]
str r0,[r2,#4]!
add r2,r2,#4
mov r0,#1
vstmia r2,{s1-s2}
1:
bx lr
```

## Pointer, equality, and counting leaves

`func_004E82C4` reads a halfword at entry `r0 + 808`. It returns zero when
that value is the maximum unsigned halfword. Otherwise it returns whether the
value equals the halfword at entry `r0 + 814`. Preserve the two-step sentinel
subtraction and both branches.

```asm
add r1,r0,#768
ldrh r0,[r1,#40]
sub r2,r0,#65280
subs r2,r2,#255
beq 1f
ldrh r1,[r1,#46]
cmp r0,r1
moveq r0,#1
beq 2f
1:
mov r0,#0
2:
bx lr
```

`func_004E8D38` returns null when bit zero of the word at offset 4 is clear;
when it is set, it returns entry `r0 + 8`.

```asm
ldr r1,[r0,#4]
tst r1,#1
moveq r0,#0
addne r0,r0,#8
bx lr
```

`func_004E8D68` returns one exactly when the word at entry `r0 + 20008` is
zero. Preserve the split address construction.

```asm
add r0,r0,#19456
add r0,r0,#552
ldr r0,[r0]
cmp r0,#0
moveq r0,#1
movne r0,#0
bx lr
```

`func_004E9E5C` computes the population count of the word at offset 20 by
shifting one bit per iteration, then explicitly narrows the count to a byte.

```asm
ldr r0,[r0,#20]
mov r1,#0
cmp r0,#0
beq 2f
1:
tst r0,#1
addne r1,r1,#1
lsrs r0,r0,#1
bne 1b
2:
and r0,r1,#255
bx lr
```

`func_004E9F98` advances entry `r0` by eight with writeback, loads the words
at original offsets 8 and 12 into `r2` and `r1`, and returns the first in
`r0`. The observable returned pair is therefore `r0:r1`.

```asm
ldr r2,[r0,#8]!
ldr r1,[r0,#4]
mov r0,r2
bx lr
```

## Small stores and counter increment

`func_00520DDC` reads the word at `entry_r0 + 12 + 8*entry_r1`, stores it
through entry `r2`, and returns zero.

```asm
add r0,r0,r1,lsl #3
ldr r0,[r0,#12]
str r0,[r2]
mov r0,#0
bx lr
```

`func_0053FC5C` first writes byte one at destination offset 4, then copies the
word addressed by entry `r1` to destination offset 0. Preserve that effect
ordering.

```asm
mov r2,#1
strb r2,[r0,#4]
ldr r1,[r1]
str r1,[r0]
bx lr
```

`func_005406DC` increments a big-endian 15-byte counter occupying offsets 1
through 15. It starts at offset 15 and propagates carry toward offset 1; byte
zero is never accessed. It stops as soon as an increment is nonzero or after
offset 1 wraps. There is no specified scalar return value.

```asm
mov r1,#15
1:
ldrb r2,[r0,r1]
add r2,r2,#1
ands r2,r2,#255
strb r2,[r0,r1]
bne 2f
sub r1,r1,#1
cmp r1,#0
bgt 1b
2:
bx lr
```

## Implementation requirements

- Preserve ARM state, four-byte body alignment, every displayed mnemonic,
  register, condition suffix, addressing mode, and local branch destination.
- Emit the functions in manifest order with exactly the listed body sizes.
- Emit no branch relocation: all 20 helpers are call-free.
- Keep each adjacent word outside its function extent and emit the six
  `R_ARM_ABS32` slots at the exact offsets in the manifest.
- Preserve the A/A, B/B, and C/C cross-function equalities and keep A, B, and
  C pairwise distinct. Do not substitute private scalar representations.
