# Probe-verified ARM VFP and structured-record helpers batch 16

## Scope and provenance

This clean-room specification covers fourteen previously unspecified,
unmatched ARM-state leaf functions totaling 1,116 code bytes. It is based
only on public AAPCS32, ARM, VFP, IEEE-754, and ordinary record/array
semantics. It contains no raw instruction encodings, extracted data, private
addresses, or proprietary source.

Every complete body described below was independently assembled for the
project's ARM/VFP target and compared byte-for-byte over the full symbol
extent. All fourteen probes were exact. None of these functions calls another
symbol or branches outside itself. Unless noted otherwise they do not touch
the stack and preserve all AAPCS callee-saved core and VFP registers.

## Seventy-six-byte record constructor

`func_00372988` (112 bytes) fills a heterogeneous record at `r0`. Its exact
input-to-output mapping is:

| Destination | Input |
| ---: | --- |
| +0, +4 | `r1`, `r2` as words |
| +8 | low byte of `r3` |
| +12, +16, +20 | stack floats at entry SP +0, +4, +8 |
| +24..+36 | four floats loaded from the pointer at entry SP +12 |
| +40 | entry `s0` |
| +44..+72 | stack floats at entry SP +16 through +44 |

It uses `r12` for the stack-supplied pointer, advances `r0` to destination
+24 before its four-float store, and returns that advanced pointer in `r0`.
The precise schedule is:

```asm
vldmia sp, {s9-s11}
ldr r12, [sp, #12]
vldr s1, [sp, #16]
vldr s2, [sp, #20]
vldr s3, [sp, #24]
vldr s4, [sp, #28]
vldr s5, [sp, #32]
vldr s6, [sp, #36]
vldr s7, [sp, #40]
vldr s8, [sp, #44]
stm r0, {r1, r2}
strb r3, [r0, #8]
vstr s9, [r0, #12]
vstr s10, [r0, #16]
vstr s11, [r0, #20]
vldmia r12, {s9-s12}
vstr s0, [r0, #40]
vstr s1, [r0, #44]
vstr s2, [r0, #48]
vstr s3, [r0, #52]
vstr s4, [r0, #56]
vstr s5, [r0, #60]
vstr s6, [r0, #64]
vstr s7, [r0, #68]
vstr s8, [r0, #72]
add r0, r0, #24
vstmia r0, {s9-s12}
bx lr
```

## Guarded indexed setters

`func_0038A09C` (48 bytes) reads an array base from object `r0` offset 80.
It returns without writes when that base is null or unsigned `r1 >= 4`.
Otherwise it selects a 12-byte element, writes word 1 at element offset 48,
and stores entry `s0`,`s1` at element offsets 40,44:

```asm
ldr r0, [r0, #80]
cmp r0, #0
beq 1f
cmp r1, #4
bcs 1f
add r2, r1, r1, lsl #1
mov r1, #1
add r0, r0, r2, lsl #2
str r1, [r0, #48]
add r0, r0, #40
vstmia r0, {s0-s1}
1: bx lr
```

The following three 32-byte functions share one template. They compare the
unsigned index in `r1` against the byte count at object offset 1808. If
`count <= index`, they return. Otherwise they load the array at offset 1800,
select a 132-byte record (`index * 33 * 4`), and store `s0` at the indicated
record field:

| Function | Float field |
| --- | ---: |
| `func_003A4DB0` | +80 |
| `func_003A4FC4` | +76 |
| `func_003A4FE4` | +72 |

```asm
ldrb r2, [r0, #1808]
cmp r2, r1
bls 1f
ldr r0, [r0, #1800]
add r1, r1, r1, lsl #5
add r0, r0, r1, lsl #2
vstr s0, [r0, #FIELD]
1: bx lr
```

## Four-component product

`func_003A7FEC` (116 bytes) takes output `r0` and two four-float inputs `A`
at `r1` and `B` at `r2`. Writing components as `A0..A3` and `B0..B3`, it
computes, with fused multiply-accumulate/subtract rounding in the exact order
shown:

```text
O0 = ((A3*B0 + A0*B3) + A1*B2) - A2*B1
O1 = ((A3*B1 + A1*B3) + A2*B0) - A0*B2
O2 = ((A3*B2 + A2*B3) + A0*B1) - A1*B0
O3 = (((A3*B3 - A0*B0) - A1*B1) - A2*B2)
```

It loads both complete inputs before writing, so output may exactly alias
either input. The register schedule is:

```asm
vldr s2, [r1, #12]
vldr s8, [r2]
vldr s5, [r2, #4]
vldr s7, [r2, #8]
vldr s3, [r2, #12]
vmul.f32 s1, s2, s8
vmul.f32 s10, s2, s5
vmul.f32 s0, s2, s7
vmul.f32 s2, s2, s3
vldr s9, [r1]
vldr s6, [r1, #4]
vldr s4, [r1, #8]
vmla.f32 s1, s9, s3
vmla.f32 s10, s6, s3
vmla.f32 s0, s4, s3
vmls.f32 s2, s9, s8
vmla.f32 s1, s6, s7
vmla.f32 s10, s4, s8
vmla.f32 s0, s9, s5
vmls.f32 s2, s6, s5
vmls.f32 s1, s4, s5
vmls.f32 s10, s9, s7
vmls.f32 s0, s6, s8
vmls.f32 s2, s4, s7
vstr s1, [r0]
vstr s10, [r0, #4]
vstr s0, [r0, #8]
vstr s2, [r0, #12]
bx lr
```

## In-place pair transforms

Each next helper is 64 bytes and transforms three float pairs in place.
All three pairs are loaded before their corresponding stores.

`func_003A8238` applies `(a,b) -> (b,-a)` at offsets `(4,8)`, `(20,24)`,
and `(36,40)`:

```asm
add r1, r0, #4
vldmia r1, {s0-s1}
add r1, r0, #20
vldmia r1, {s2-s3}
add r1, r0, #36
vneg.f32 s0, s0
vldmia r1, {s4-s5}
vneg.f32 s2, s2
vstr s1, [r0, #4]
vstr s3, [r0, #20]
vneg.f32 s4, s4
vstr s5, [r0, #36]
vstr s0, [r0, #8]
vstr s2, [r0, #24]
vstr s4, [r0, #40]
bx lr
```

`func_003A8278` applies `(a,b) -> (-b,a)` at offsets `(0,8)`, `(16,24)`,
and `(32,40)`:

```asm
vldr s1, [r0, #8]
vldr s3, [r0, #24]
vldr s4, [r0, #40]
vldr s0, [r0]
vneg.f32 s1, s1
vldr s2, [r0, #16]
vldr s5, [r0, #32]
vneg.f32 s3, s3
vneg.f32 s4, s4
vstr s0, [r0, #8]
vstr s2, [r0, #24]
vstr s5, [r0, #40]
vstr s1, [r0]
vstr s3, [r0, #16]
vstr s4, [r0, #32]
bx lr
```

`func_003A8400` applies `(a,b) -> (-b,a)` at offsets `(4,8)`, `(20,24)`,
and `(36,40)`:

```asm
add r1, r0, #4
vldr s4, [r0, #40]
vldr s5, [r0, #36]
vldmia r1, {s0-s1}
add r1, r0, #20
vneg.f32 s4, s4
vldmia r1, {s2-s3}
vneg.f32 s1, s1
vstr s0, [r0, #8]
vstr s2, [r0, #24]
vneg.f32 s3, s3
vstr s1, [r0, #4]
vstr s3, [r0, #20]
add r0, r0, #36
vstmia r0, {s4-s5}
bx lr
```

## Strided three-by-three matrix multiply

`func_003A87D8` (216 bytes) multiplies the 3-by-3 portions of two row-major
3-by-4 float records at `r1` and `r2`, and stores the result's nine floats at
`r0` offsets 0,4,8; 16,20,24; and 32,36,40. For row `i` and column `j`, the
result is `sum(k=0..2, A[i,k]*B[k,j])`. Each sum begins with a multiply and
then uses two `vmla.f32` operations in increasing `k` order. The output stores
occur only after every input load, so exact aliasing with either input works.
It saves and restores `d8-d10`; no core register is saved. The exact schedule
is:

```asm
vpush {d8-d10}
vldr s0, [r1]
vldr s6, [r2]
vldr s8, [r2, #4]
vldr s10, [r2, #8]
vldr s1, [r1, #16]
vldr s2, [r1, #32]
vmul.f32 s18, s0, s6
vmul.f32 s19, s0, s8
vmul.f32 s20, s0, s10
vmul.f32 s0, s1, s6
vmul.f32 s21, s2, s6
vmul.f32 s6, s1, s8
vmul.f32 s1, s1, s10
vmul.f32 s8, s2, s8
vmul.f32 s2, s2, s10
vldr s4, [r1, #20]
vldr s7, [r2, #16]
vldr s9, [r2, #20]
vldr s11, [r2, #24]
vldr s5, [r1, #36]
vmla.f32 s0, s4, s7
vmla.f32 s6, s4, s9
vmla.f32 s1, s4, s11
vldr s3, [r1, #4]
vmla.f32 s21, s5, s7
add r2, r2, #32
vmla.f32 s8, s5, s9
vmla.f32 s2, s5, s11
vldmia r2, {s15-s17}
vmla.f32 s20, s3, s11
vldr s13, [r1, #24]
vmla.f32 s18, s3, s7
vmla.f32 s19, s3, s9
vldr s14, [r1, #40]
vmla.f32 s0, s13, s15
vmla.f32 s6, s13, s16
vmla.f32 s1, s13, s17
vldr s12, [r1, #8]
vmla.f32 s21, s14, s15
vmla.f32 s8, s14, s16
vmla.f32 s2, s14, s17
vmla.f32 s20, s12, s17
vmla.f32 s18, s12, s15
vmla.f32 s19, s12, s16
vstr s0, [r0, #16]
vstr s6, [r0, #20]
vstr s1, [r0, #24]
vstr s21, [r0, #32]
vstr s8, [r0, #36]
vstr s2, [r0, #40]
vstmia r0, {s18-s20}
vpop {d8-d10}
bx lr
```

## Forty-eight-byte copy

`func_003A8908` (44 bytes) copies twelve words/floats from `r1` to `r0` in
three 16-byte VFP groups. It is safe for exact aliasing, but its interleaved
group loads/stores do not provide general `memmove` overlap semantics:

```asm
vldmia r1, {s0-s3}
add r2, r1, #16
add r1, r1, #32
vstmia r0, {s0-s3}
vldmia r2, {s0-s3}
add r2, r0, #16
add r0, r0, #32
vstmia r2, {s0-s3}
vldmia r1, {s0-s3}
vstmia r0, {s0-s3}
bx lr
```

## In-place two-component rotations

The remaining functions take a 3-by-4 float record in `r0` and coefficients
`c=s0`, `q=s1`. For every selected pair `(a,b)`, the arithmetic form is
`(b*c+a*q, b*q-a*c)` for `func_003A8934`, and equivalently stores the same
two expressions in the destination ordering stated below. Fused VFP
multiply-accumulate/subtract ordering is required.

`func_003A8934` (100 bytes) transforms the pairs `(4,8)`, `(20,24)`, and
`(36,40)`, storing the first expression at the first offset and the second at
the second offset:

```asm
add r1, r0, #4
vldr s4, [r0, #40]
vldr s7, [r0, #36]
vldmia r1, {s2-s3}
add r1, r0, #20
vldmia r1, {s5-s6}
add r1, r0, #36
vmul.f32 s8, s3, s0
vmul.f32 s9, s3, s1
vmul.f32 s3, s4, s0
vmul.f32 s10, s6, s0
vmul.f32 s6, s6, s1
vmul.f32 s4, s4, s1
vmla.f32 s8, s2, s1
vmls.f32 s9, s2, s0
vmla.f32 s3, s7, s1
vmla.f32 s10, s5, s1
vmls.f32 s6, s5, s0
vmls.f32 s4, s7, s0
vstr s10, [r0, #20]
vstr s6, [r0, #24]
add r0, r0, #4
vstmia r1, {s3-s4}
vstmia r0, {s8-s9}
bx lr
```

`func_003A8998` (100 bytes) transforms pairs `(0,8)`, `(16,24)`, and
`(32,40)`. For each `(a,b)`, it stores `a*q-b*c` at the first offset and
`a*c+b*q` at the second:

```asm
vldr s2, [r0]
vldr s4, [r0, #16]
vldr s5, [r0, #32]
vmul.f32 s8, s2, s0
vmul.f32 s9, s2, s1
vmul.f32 s10, s4, s0
vmul.f32 s2, s5, s0
vmul.f32 s4, s4, s1
vmul.f32 s5, s5, s1
vldr s3, [r0, #8]
vldr s6, [r0, #24]
vldr s7, [r0, #40]
vmla.f32 s8, s3, s1
vmls.f32 s9, s3, s0
vmla.f32 s10, s6, s1
vmla.f32 s2, s7, s1
vmls.f32 s4, s6, s0
vmls.f32 s5, s7, s0
vstr s8, [r0, #8]
vstr s10, [r0, #24]
vstr s2, [r0, #40]
vstr s9, [r0]
vstr s4, [r0, #16]
vstr s5, [r0, #32]
bx lr
```

`func_003A89FC` (92 bytes) transforms pairs `(0,4)`, `(16,20)`, and
`(32,36)`, storing `b*c+a*q` at the first offset and `b*q-a*c` at the second:

```asm
add r1, r0, #16
vldmia r0, {s2-s3}
vldr s4, [r0, #36]
vldr s7, [r0, #32]
vldmia r1, {s5-s6}
vmul.f32 s8, s3, s0
vmul.f32 s9, s3, s1
vmul.f32 s3, s4, s0
vmul.f32 s4, s4, s1
vmul.f32 s10, s6, s0
vmul.f32 s6, s6, s1
add r1, r0, #32
vmla.f32 s8, s2, s1
vmls.f32 s9, s2, s0
vmla.f32 s3, s7, s1
vmls.f32 s4, s7, s0
vmla.f32 s10, s5, s1
vmls.f32 s6, s5, s0
vstr s10, [r0, #16]
vstr s6, [r0, #20]
vstmia r1, {s3-s4}
vstmia r0, {s8-s9}
bx lr
```

## Exact-probe manifest

| Function | Mode | Size | Complete-body probe |
| --- | --- | ---: | --- |
| `func_00372988` | ARM | 112 | exact |
| `func_0038A09C` | ARM | 48 | exact |
| `func_003A4DB0` | ARM | 32 | exact |
| `func_003A4FC4` | ARM | 32 | exact |
| `func_003A4FE4` | ARM | 32 | exact |
| `func_003A7FEC` | ARM | 116 | exact |
| `func_003A8238` | ARM | 64 | exact |
| `func_003A8278` | ARM | 64 | exact |
| `func_003A8400` | ARM | 64 | exact |
| `func_003A87D8` | ARM | 216 | exact |
| `func_003A8908` | ARM | 44 | exact |
| `func_003A8934` | ARM | 100 | exact |
| `func_003A8998` | ARM | 100 | exact |
| `func_003A89FC` | ARM | 92 | exact |
| **Total** |  | **1,116** | **14 / 14 exact** |

Implementation cautions: preserve explicit VFP instruction order rather than
algebraically simplifying the expressions; retain the unsigned guards and
their exact branch conditions; do not infer general overlapping-copy support
for `func_003A8908`; and retain `func_003A87D8`'s `d8-d10` save set. The
constructor's mixed hard-float/core/stack argument placement and returned
advanced pointer are part of its observable ABI contract.
