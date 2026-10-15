# Probe-verified ARM VFP and memory helpers batch 14

## Scope and provenance

This clean-room analysis specification covers fifteen previously unspecified,
unmatched ARM-state helpers totaling 1,100 code bytes.  The descriptions use
only public ARM11, AAPCS32, IEEE-754, and VFPv2 semantics plus ordinary memory
records.  They contain no instruction encodings, extracted data, private
addresses, or proprietary source.

Every complete textual body below was independently assembled for ARM11
MPCore with VFPv2 enabled and compared section-for-section with the complete
observed function.  All fifteen probes were exact.  None calls another
function or branches outside its own body.  Unless stated otherwise, words
and floats are little-endian 32-bit values and pointer arguments must address
the complete accessed record.

## Scalar interpolation helpers

`func_00144BCC` (60 bytes) accepts a record in `r0` containing a start float
at offset 0, an end float at offset 4, a signed denominator at offset 8, and a
signed numerator at offset 12.  It returns the end float in `s0` when
`numerator >= denominator`; otherwise it returns
`start + (end - start) * float(numerator) / float(denominator)`.  Preserve the
operation order and signed comparison:

```asm
add r1, r0, #8
vldr s0, [r0, #4]
ldm r1, {r1, r2}
cmp r2, r1
bge 1f
vmov s2, r2
vldr s1, [r0]
vmov s3, r1
vsub.f32 s0, s0, s1
vcvt.f32.s32 s4, s2
vcvt.f32.s32 s2, s3
vmul.f32 s3, s0, s4
vdiv.f32 s0, s3, s2
vadd.f32 s0, s0, s1
1:
bx lr
```

`func_00182370` (60 bytes) implements the same signed linear interpolation
with a different record layout: start float at offset 4, end float at offset
8, denominator at offset 12, and numerator at offset 16.

```asm
ldr r1, [r0, #16]
ldr r2, [r0, #12]
vldr s0, [r0, #8]
cmp r1, r2
bge 1f
vmov s2, r1
vldr s1, [r0, #4]
vmov s3, r2
vsub.f32 s0, s0, s1
vcvt.f32.s32 s4, s2
vcvt.f32.s32 s2, s3
vmul.f32 s3, s0, s4
vdiv.f32 s0, s3, s2
vadd.f32 s0, s0, s1
1:
bx lr
```

`func_00182C60` (80 bytes) receives a record in `r0`, a word in `r1`, and a
new float in `s0`.  The record initially contains start and end floats at
offsets 0 and 4 and signed denominator/numerator words at offsets 8 and 12.
It selects the old end when `numerator >= denominator`; otherwise it computes
the same ordered linear interpolation.  It then stores that result at offset
0, the incoming `s0` at offset 4, the incoming `r1` at offset 8, and zero at
offset 12:

```asm
ldr r2, [r0, #12]
ldr r3, [r0, #8]
vldr s1, [r0, #4]
cmp r2, r3
bge 1f
vmov s3, r2
vldr s2, [r0]
vmov s4, r3
vsub.f32 s1, s1, s2
vcvt.f32.s32 s3, s3
vcvt.f32.s32 s4, s4
vmul.f32 s3, s1, s3
vdiv.f32 s1, s3, s4
vadd.f32 s1, s1, s2
1:
mov r2, #0
vstr s1, [r0]
vstr s0, [r0, #4]
add r0, r0, #8
stm r0, {r1, r2}
bx lr
```

## Fixed VFP copy and scale

`func_00144CA8` (32 bytes) copies exactly twelve floats (48 bytes) from `r1`
to `r0` unless the two pointers are equal.  It loads all values before either
store group and makes no general overlap-safe guarantee.  On the copy path
`r1` and scratch `r2` finish 24 and 48 bytes past their initial bases,
respectively:

```asm
cmp r1, r0
bxeq lr
vldmia r1!, {s0-s5}
mov r2, r0
vldmia r1, {s6-s11}
vstmia r2!, {s0-s5}
vstmia r2, {s6-s11}
bx lr
```

`func_0014CD7C` (52 bytes) multiplies four source floats at `r1` by the scalar
in `s0` and writes the four results to `r0`, in increasing address order:

```asm
vldr s1, [r1]
vmul.f32 s1, s1, s0
vstr s1, [r0]
vldr s1, [r1, #4]
vmul.f32 s1, s1, s0
vstr s1, [r0, #4]
vldr s1, [r1, #8]
vmul.f32 s1, s1, s0
vstr s1, [r0, #8]
vldr s1, [r1, #12]
vmul.f32 s0, s1, s0
vstr s0, [r0, #12]
bx lr
```

## Eight-float orientation transform

`func_001646A0` (188 bytes) mutates eight floats at `r0` according to unsigned
selector `r1`.  For selectors 0 or 4 it does nothing.  Selector 2 negates all
eight floats.  Selector 3 maps `[a,b,c,d,e,f,g,h]` to
`[-e,-f,-g,-h,a,b,c,d]`.  Every other selector maps them to
`[e,f,g,h,-a,-b,-c,-d]`.  The complete load, negate, and store schedule is:

```asm
cmp r1, #0
cmpne r1, #4
beq 4f
cmp r1, #2
beq 2f
cmp r1, #3
beq 3f
vldr s0, [r0, #12]
add r1, r0, #16
vldmia r0, {s5-s7}
vneg.f32 s0, s0
vldmia r1, {s1-s4}
vneg.f32 s5, s5
vneg.f32 s7, s7
vstr s0, [r0, #28]
vneg.f32 s6, s6
vstmia r0, {s1-s7}
4:
bx lr
2:
vldmia r0, {s0-s7}
vneg.f32 s0, s0
vneg.f32 s1, s1
vneg.f32 s2, s2
vneg.f32 s3, s3
vneg.f32 s7, s7
vneg.f32 s4, s4
vneg.f32 s5, s5
vneg.f32 s6, s6
vstmia r0, {s0-s7}
bx lr
3:
add r1, r0, #16
vldr s4, [r0, #28]
vldr s3, [r0, #4]
vldr s5, [r0]
vneg.f32 s4, s4
vldmia r1, {s0-s2}
add r1, r0, #8
vldmia r1, {s6-s7}
vneg.f32 s0, s0
vneg.f32 s2, s2
vneg.f32 s1, s1
vstr s3, [r0, #20]
add r1, r0, #12
vstmia r0, {s0-s2}
vstmia r1, {s4-s5}
add r1, r0, #24
vstmia r1, {s6-s7}
bx lr
```

## Packed float conversion

`func_00174884` (80 bytes) receives an IEEE-754 single in `s0` and returns a
24-bit packed representation in `r0`.  For the ordinary in-range case, input
sign bit 31 becomes output bit 23, the exponent is rebased by subtracting 64
and occupies output bits 22 through 16, and the top 16 fraction bits occupy
bits 15 through 0.  Underflow returns only the accumulated sign field;
overflow returns `0x7f0000`.  Preserve the observed zero test and conditional
shifts exactly:

```asm
vmov r1, s0
ands r0, r1, #0x80000000
lsl r2, r1, #1
movne r0, #0x800000
lsr r3, r2, #24
lsl r2, r1, #9
bics r1, r1, #0x80000000
lsr r2, r2, #9
lsreq r2, r2, #7
beq 1f
subs r1, r3, #64
lsr r2, r2, #7
bmi 2f
cmp r1, #127
movgt r0, #0x7f0000
bgt 2f
1:
and r1, r1, #127
orr r0, r0, r2
orr r0, r0, r1, lsl #16
2:
bx lr
```

## Four-output record permutation

`func_00176C88` (116 bytes) accepts an input record in `r0`, output pointers
in `r1`, `r2`, and `r3`, and a fourth output pointer as the fifth AAPCS
argument on the stack.  The input values occupy offsets 40, 44, 48, and 52.
Normally they are written to output pointers 1, 2, 3, and 4 respectively.  If
byte 4 equals one, or byte 4 equals two and byte 12 equals one, they are
instead written to output pointers 2, 1, 4, and 3.  The first value travels
through `s0`; the others retain their word bit patterns.

```asm
push {r4, r5}
ldrb r4, [r0, #4]
ldr r12, [sp, #8]
vldr s0, [r0, #40]
cmp r4, #1
beq 1f
cmp r4, #2
bne 2f
ldrb r4, [r0, #12]
cmp r4, #1
beq 1f
2:
vstr s0, [r1]
ldr r1, [r0, #44]
str r1, [r2]
ldr r1, [r0, #48]
str r1, [r3]
ldr r0, [r0, #52]
str r0, [r12]
pop {r4, r5}
bx lr
1:
vstr s0, [r2]
ldr r2, [r0, #44]
str r2, [r1]
ldr r1, [r0, #48]
str r1, [r12]
ldr r0, [r0, #52]
str r0, [r3]
pop {r4, r5}
bx lr
```

## Mode-selected accumulator

`func_00181DD0` (68 bytes) returns without a change when byte 12 of the object
in `r0` is zero.  Otherwise selector `r1 == 0` adds `r2` modulo 2^32 to the
word at offset 108.  Selector `r1 == 1` converts signed `r2` to a float and
adds it to the float at offset 112.  Other selectors do nothing.

```asm
ldrb r3, [r0, #12]
cmp r3, #0
beq 2f
cmp r1, #0
beq 1f
cmp r1, #1
bne 2f
vmov s0, r2
vldr s1, [r0, #112]
vcvt.f32.s32 s0, s0
vadd.f32 s0, s1, s0
vstr s0, [r0, #112]
2:
bx lr
1:
ldr r1, [r0, #108]
add r1, r1, r2
str r1, [r0, #108]
bx lr
```

## Matrix and vector helpers

The remaining six helpers use row-major matrices.  Their explicit VFP
schedules define the rounding order and also make their supported aliasing
behavior observable.

`func_00144CC8` (60 bytes) transforms the three-vector at `r2` by the first
three columns of a 3-by-4 affine matrix at `r1`, adds the fourth-column value
for each row, and writes the resulting three-vector to `r0`:

```asm
vldmia r1, {s0-s11}
vldmia r2, {s12-s14}
vmla.f32 s3, s0, s12
vmla.f32 s7, s4, s12
vmla.f32 s11, s8, s12
vmla.f32 s3, s1, s13
vmla.f32 s7, s5, s13
vmla.f32 s11, s9, s13
vmla.f32 s3, s2, s14
vmla.f32 s7, s6, s14
vmla.f32 s11, s10, s14
vstr s3, [r0]
vstr s7, [r0, #4]
vstr s11, [r0, #8]
bx lr
```

`func_00195C40` (52 bytes) multiplies the row-major 3-by-3 matrix at `r1` by
the three-vector at `r2` and writes a three-vector to `r0`:

```asm
vldmia r1, {s0-s8}
vldmia r2, {s9-s11}
vmul.f32 s12, s0, s9
vmul.f32 s13, s3, s9
vmul.f32 s14, s6, s9
vmla.f32 s12, s1, s10
vmla.f32 s13, s4, s10
vmla.f32 s14, s7, s10
vmla.f32 s12, s2, s11
vmla.f32 s13, s5, s11
vmla.f32 s14, s8, s11
vstmia r0, {s12-s14}
bx lr
```

`func_00195D5C` (52 bytes) copies the twelve-float 3-by-4 matrix at `r1` to
`r0`, multiplying columns 0, 1, and 2 by vector components 0, 1, and 2 from
`r2`; column 3 is unchanged:

```asm
vldmia r1, {s0-s11}
vldmia r2, {s12-s14}
vmul.f32 s0, s0, s12
vmul.f32 s1, s1, s13
vmul.f32 s2, s2, s14
vmul.f32 s4, s4, s12
vmul.f32 s5, s5, s13
vmul.f32 s6, s6, s14
vmul.f32 s8, s8, s12
vmul.f32 s9, s9, s13
vmul.f32 s10, s10, s14
vstmia r0, {s0-s11}
bx lr
```

`func_00195D90` (64 bytes) copies the 3-by-4 matrix at `r2` to `r0`, scaling
its complete first, second, and third rows by vector components 0, 1, and 2
from `r1` respectively:

```asm
vldmia r2, {s0-s11}
vldmia r1, {s12-s14}
vmul.f32 s0, s0, s12
vmul.f32 s1, s1, s12
vmul.f32 s2, s2, s12
vmul.f32 s3, s3, s12
vmul.f32 s4, s4, s13
vmul.f32 s5, s5, s13
vmul.f32 s6, s6, s13
vmul.f32 s7, s7, s13
vmul.f32 s8, s8, s14
vmul.f32 s9, s9, s14
vmul.f32 s10, s10, s14
vmul.f32 s11, s11, s14
vstmia r0, {s0-s11}
bx lr
```

`func_00196004` (52 bytes) copies the 3-by-4 matrix at `r1` to `r0` while
adding the dot product of each row's first three components and the vector at
`r2` to that row's fourth component:

```asm
vldmia r1, {s0-s11}
vldmia r2, {s12-s14}
vmla.f32 s3, s0, s12
vmla.f32 s7, s4, s12
vmla.f32 s11, s8, s12
vmla.f32 s3, s1, s13
vmla.f32 s7, s5, s13
vmla.f32 s11, s9, s13
vmla.f32 s3, s2, s14
vmla.f32 s7, s6, s14
vmla.f32 s11, s10, s14
vstmia r0, {s0-s11}
bx lr
```

`func_00196074` (84 bytes) performs the corresponding operation on all four
rows of a 4-by-4 matrix at `r1` and writes only the four updated fourth-column
values to `r0`.  The vector is at `r2`.  It preserves `d8` and `d9` around use
of `s16` through `s18`:

```asm
vpush {d8-d9}
vldmia r1, {s0-s15}
vldmia r2, {s16-s18}
vmla.f32 s3, s0, s16
vmla.f32 s7, s4, s16
vmla.f32 s11, s8, s16
vmla.f32 s15, s12, s16
vmla.f32 s3, s1, s17
vmla.f32 s7, s5, s17
vmla.f32 s11, s9, s17
vmla.f32 s15, s13, s17
vmla.f32 s3, s2, s18
vmla.f32 s7, s6, s18
vmla.f32 s11, s10, s18
vmla.f32 s15, s14, s18
vpop {d8-d9}
vstr s3, [r0]
vstr s7, [r0, #4]
vstr s11, [r0, #8]
vstr s15, [r0, #12]
bx lr
```
