# Probe-verified ARM VFP and structured-memory helpers batch 15

## Scope and provenance

This clean-room analysis specification covers twelve previously unspecified,
unmatched ARM-state helpers totaling 976 code bytes.  It uses only public
ARM11, AAPCS32, IEEE-754, and VFPv2 semantics and ordinary arrays or matrix
records.  It contains no raw instruction encodings, extracted data, private
addresses, or proprietary source.

Every complete textual body below was independently assembled for ARM11
MPCore with VFPv2 enabled and compared section-for-section with the complete
observed function.  All twelve probes were exact.  These helpers contain no
calls and no branch leaves its function.  Word and float accesses are
little-endian 32-bit operations.

## Three-by-four affine composition

`func_00195C78` (228 bytes) accepts an output matrix in `r0`, a row-major
3-by-4 affine matrix in `r1`, and a row-major 4-by-4 affine matrix in `r2`.
Treating the first matrix as having an implicit final row `[0, 0, 0, 1]`, it
computes the first three rows of their matrix product and stores twelve
floats.  All results remain in VFP registers until the final stores, so the
output may alias either input.  It preserves `d8` through `d10`; `r2` is
advanced by 32 bytes and scratch `r1` by 16 bytes during the final stores.
Preserve this complete multiply-accumulate order:

```asm
vpush {d8-d10}
vldr s3, [r1, #12]
vldr s7, [r1, #28]
vldr s11, [r1, #44]
vldmia r2!, {s12-s15}
vldr s20, [r1]
vldr s21, [r1, #16]
vmul.f32 s0, s12, s20
vmul.f32 s1, s13, s20
vmul.f32 s2, s14, s20
vmla.f32 s3, s15, s20
vldr s20, [r1, #32]
vmul.f32 s4, s12, s21
vmul.f32 s5, s13, s21
vmul.f32 s6, s14, s21
vmla.f32 s7, s15, s21
vldmia r2!, {s16-s19}
vldr s21, [r1, #4]
vmul.f32 s8, s12, s20
vmul.f32 s9, s13, s20
vmul.f32 s10, s14, s20
vmla.f32 s11, s15, s20
vldmia r2, {s12-s15}
vldr s20, [r1, #20]
vmla.f32 s0, s16, s21
vmla.f32 s1, s17, s21
vmla.f32 s2, s18, s21
vmla.f32 s3, s19, s21
vldr s21, [r1, #36]
vmla.f32 s4, s16, s20
vmla.f32 s5, s17, s20
vmla.f32 s6, s18, s20
vmla.f32 s7, s19, s20
vldr s20, [r1, #8]
vmla.f32 s8, s16, s21
vmla.f32 s9, s17, s21
vmla.f32 s10, s18, s21
vmla.f32 s11, s19, s21
vldr s21, [r1, #24]
vmla.f32 s0, s12, s20
vmla.f32 s1, s13, s20
vmla.f32 s2, s14, s20
vmla.f32 s3, s15, s20
vldr s20, [r1, #40]
vmla.f32 s4, s12, s21
vmla.f32 s5, s13, s21
vmla.f32 s6, s14, s21
vmla.f32 s7, s15, s21
vmla.f32 s8, s12, s20
vmla.f32 s9, s13, s20
vmla.f32 s10, s14, s20
vmla.f32 s11, s15, s20
vpop {d8-d10}
mov r1, r0
vstmia r1!, {s0-s3}
vstmia r1, {s4-s11}
bx lr
```

## Affine translate-and-scale transform

`func_0019B4D8` (80 bytes) takes a row-major 3-by-4 affine matrix at `r1`, a
two-float scale at `r2`, and a three-float translation at `r3`.  It adds the
matrix's three-by-three linear transform of the translation to the fourth
column, scales matrix columns 0 and 1 by scale components 0 and 1, leaves
column 2 unchanged, and writes all twelve floats to `r0`.

```asm
vldmia r1, {s0-s11}
vldmia r3, {s12-s14}
vmla.f32 s3, s0, s12
vmla.f32 s7, s4, s12
vmla.f32 s11, s8, s12
vmla.f32 s3, s1, s13
vmla.f32 s7, s5, s13
vmla.f32 s11, s9, s13
vmla.f32 s3, s2, s14
vldmia r2, {s12-s13}
vmla.f32 s7, s6, s14
vmla.f32 s11, s10, s14
vmul.f32 s0, s0, s12
vmul.f32 s1, s1, s13
vmul.f32 s4, s4, s12
vmul.f32 s5, s5, s13
vmul.f32 s8, s8, s12
vmul.f32 s9, s9, s13
vstmia r0, {s0-s11}
bx lr
```

## Structured float reorder helpers

The next five helpers reverse each four-float source group while laying out a
destination record.  Every helper loads its full source before its first VFP
store, so exact source/destination aliasing is supported.  The variants that
accept `r2` store it at destination offset 4 after the VFP load and before the
VFP stores.  Their exact mappings are:

| Function | Size | Source floats | Extra word | Destination offsets in increasing source-index order |
| --- | ---: | ---: | --- | --- |
| `func_0019B528` | 60 | 12 | `r2` at +4 | 16, 12, 8, 0, 32, 28, 24, 20, 48, 44, 40, 36 |
| `func_0019B65C` | 40 | 8 | none | 12, 8, 4, 0, 28, 24, 20, 16 |
| `func_0019B6B0` | 56 | 12 | none | 12, 8, 4, 0, 28, 24, 20, 16, 44, 40, 36, 32 |
| `func_0019B6E8` | 60 | 12 | `r2` at +4 | 16, 12, 8, 0, 32, 28, 24, 20, 48, 44, 40, 36 |
| `func_0019B76C` | 76 | 16 | `r2` at +4 | 16, 12, 8, 0, 32, 28, 24, 20, 48, 44, 40, 36, 64, 60, 56, 52 |

The 12-float extra-word body, used byte-for-byte by both `func_0019B528` and
`func_0019B6E8`, is:

```asm
vldmia r1!, {s0-s11}
str r2, [r0, #4]
vstr s0, [r0, #16]
vstr s1, [r0, #12]
vstr s2, [r0, #8]
vstr s3, [r0]
vstr s4, [r0, #32]
vstr s5, [r0, #28]
vstr s6, [r0, #24]
vstr s7, [r0, #20]
vstr s8, [r0, #48]
vstr s9, [r0, #44]
vstr s10, [r0, #40]
vstr s11, [r0, #36]
bx lr
```

The complete `func_0019B65C` body is:

```asm
vldmia r1!, {s0-s7}
vstr s0, [r0, #12]
vstr s1, [r0, #8]
vstr s2, [r0, #4]
vstr s3, [r0]
vstr s4, [r0, #28]
vstr s5, [r0, #24]
vstr s6, [r0, #20]
vstr s7, [r0, #16]
bx lr
```

The complete `func_0019B6B0` body is:

```asm
vldmia r1!, {s0-s11}
vstr s0, [r0, #12]
vstr s1, [r0, #8]
vstr s2, [r0, #4]
vstr s3, [r0]
vstr s4, [r0, #28]
vstr s5, [r0, #24]
vstr s6, [r0, #20]
vstr s7, [r0, #16]
vstr s8, [r0, #44]
vstr s9, [r0, #40]
vstr s10, [r0, #36]
vstr s11, [r0, #32]
bx lr
```

The complete `func_0019B76C` body is:

```asm
vldmia r1!, {s0-s15}
str r2, [r0, #4]
vstr s0, [r0, #16]
vstr s1, [r0, #12]
vstr s2, [r0, #8]
vstr s3, [r0]
vstr s4, [r0, #32]
vstr s5, [r0, #28]
vstr s6, [r0, #24]
vstr s7, [r0, #20]
vstr s8, [r0, #48]
vstr s9, [r0, #44]
vstr s10, [r0, #40]
vstr s11, [r0, #36]
vstr s12, [r0, #64]
vstr s13, [r0, #60]
vstr s14, [r0, #56]
vstr s15, [r0, #52]
bx lr
```

## Vectorized bulk arithmetic

The next three helpers deliberately use bottom-tested loops.  Their caller is
expected to provide a positive count that makes the rounded iteration count
positive.  For zero or unsuitable negative counts, the instruction-level
contract below governs wraparound rather than a zero-iteration promise.

`func_0019BCC8` (104 bytes) rounds signed `r2` upward in groups of four using
`(r2 + 3) >> 2`.  Each iteration updates twelve consecutive floats in place at
`r0`, adding the three-float vector at `r1` cyclically.  It advances `r0` and a
parallel store pointer by 48 bytes per iteration and preserves `d8` through
`d11`:

```asm
vpush {d8-d11}
add r2, r2, #3
asr r2, r2, #2
vldmia r1, {s20-s22}
mov r3, r0
1:
vldmia r0!, {s8-s11}
vldmia r0!, {s12-s15}
vadd.f32 s8, s8, s20
vadd.f32 s9, s9, s21
vadd.f32 s10, s10, s22
vadd.f32 s11, s11, s20
vldmia r0!, {s16-s19}
vadd.f32 s12, s12, s21
vadd.f32 s13, s13, s22
vadd.f32 s14, s14, s20
vadd.f32 s15, s15, s21
vstmia r3!, {s8-s11}
vadd.f32 s16, s16, s22
vadd.f32 s17, s17, s20
vadd.f32 s18, s18, s21
vadd.f32 s19, s19, s22
vstmia r3!, {s12-s19}
subs r2, r2, #1
bne 1b
vpop {d8-d11}
bx lr
```

`func_0019BD30` (116 bytes) uses the same `(r2 + 3) >> 2` iteration count.
Each iteration updates twelve destination floats in place at `r0` with
`destination[i] += source[i] * s0`, advances both arrays by 48 bytes, and
preserves `d8` through `d15`:

```asm
vpush {d8-d15}
add r2, r2, #3
asr r2, r2, #2
mov r3, r0
1:
vldmia r0!, {s8-s11}
vldmia r1!, {s20-s23}
vldmia r0!, {s12-s15}
vmla.f32 s8, s20, s0
vmla.f32 s9, s21, s0
vmla.f32 s10, s22, s0
vmla.f32 s11, s23, s0
vldmia r1!, {s24-s27}
vstmia r3!, {s8-s11}
vmla.f32 s12, s24, s0
vmla.f32 s13, s25, s0
vldmia r0!, {s16-s19}
vmla.f32 s14, s26, s0
vmla.f32 s15, s27, s0
vldmia r1!, {s28-s31}
vstmia r3!, {s12-s15}
vmla.f32 s16, s28, s0
vmla.f32 s17, s29, s0
vmla.f32 s18, s30, s0
vmla.f32 s19, s31, s0
vstmia r3!, {s16-s19}
subs r2, r2, #1
bne 1b
vpop {d8-d15}
bx lr
```

`func_0019BDA4` (60 bytes) rounds signed `r2` upward in groups of eight using
`(r2 + 7) >> 3`.  Each iteration reads eight floats from `r1`, adds scalar
`s0` to each, writes eight floats to `r0`, and advances both pointers by 32
bytes:

```asm
add r2, r2, #7
asr r2, r2, #3
1:
vldmia r1!, {s8-s15}
vadd.f32 s8, s8, s0
vadd.f32 s9, s9, s0
vadd.f32 s10, s10, s0
vadd.f32 s11, s11, s0
vadd.f32 s12, s12, s0
vadd.f32 s13, s13, s0
vadd.f32 s14, s14, s0
vadd.f32 s15, s15, s0
vstmia r0!, {s8-s15}
subs r2, r2, #1
bne 1b
bx lr
```

## Two-dimensional Euclidean distance

`func_001E1CA8` (32 bytes) receives two two-dimensional points in
`(s0, s1)` and `(s2, s3)` and returns their Euclidean distance in `s0`.  It
forms absolute coordinate differences before squaring and uses VFP square
root:

```asm
vsub.f32 s0, s0, s2
vsub.f32 s1, s1, s3
vabs.f32 s0, s0
vabs.f32 s2, s1
vmul.f32 s1, s0, s0
vmla.f32 s1, s2, s2
vsqrt.f32 s0, s1
bx lr
```

## Alternate packed-float conversion

`func_001F9544` (64 bytes) receives an IEEE-754 single in `s0` and returns a
24-bit packed representation in `r0`.  For a nonzero magnitude with rebased
exponent `((exponent - 64) >= 0)`, it places the sign in bit 23, the rebased
exponent beginning at bit 16, and the top 16 fraction bits in bits 15 through
0.  A negative rebased exponent returns only the sign field.  Preserve the
zero path and the absence of an upper exponent clamp:

```asm
vmov r0, s0
bics r1, r0, #0x80000000
beq 1f
lsl r1, r0, #1
lsr r1, r1, #24
sub r1, r1, #64
cmp r1, #0
lsrlt r0, r0, #31
lsllt r0, r0, #23
blt 2f
1:
lsl r2, r0, #9
lsr r0, r0, #31
lsr r2, r2, #16
orr r1, r2, r1, lsl #16
orr r0, r1, r0, lsl #23
2:
bx lr
```
