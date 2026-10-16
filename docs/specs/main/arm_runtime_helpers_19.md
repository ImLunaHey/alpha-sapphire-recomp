# Probe-verified ARM affine-matrix helpers batch 19

## Scope and provenance

This clean-room specification covers three previously unspecified, unmatched
ARM-state VFP leaves totaling 580 bytes. It uses public ARM, AAPCS32, VFP and
IEEE-754 semantics only. No raw instruction encodings, extracted data,
private addresses, or proprietary source are included. Every complete body
was independently assembled and compared over its full symbol extent; all
three were byte-exact. None calls or branches to another symbol.

For the two inverse helpers, name the row-major 3-by-3 portion of the input:

```text
a b c tx
d e f ty
g h i tz
```

## Common determinant and singularity contract

`func_00195DD0` and `func_00195EEC` load `a,b,c`, advance `r1` by 16, load
`d,e,f`, advance it by another 16, then load `g,h,i`. Thus `r1` equals input
+32 on every return. Their determinant is formed in exactly this VFP order:

```asm
vmul.f32 s10, s0, s4        @ a*e
vmul.f32 s11, s1, s5        @ b*f
vmul.f32 s12, s2, s3        @ c*d
vmul.f32 s13, s6, s4        @ g*e
vmul.f32 s14, s3, s1        @ d*b
vmul.f32 s15, s0, s7        @ a*h
vmul.f32 s10, s10, s8       @ a*e*i
vmul.f32 s11, s11, s6       @ b*f*g
vmul.f32 s12, s12, s7       @ c*d*h
vmls.f32 s10, s13, s2       @ -g*e*c
vmls.f32 s11, s14, s8       @ -d*b*i
vmls.f32 s12, s15, s5       @ -a*h*f
vadd.f32 s10, s10, s11
vldr s15, =1.0
vadd.f32 s10, s10, s12
vmov r2, s10
cmp r2, #0x80000000
cmpne r2, #0
moveq r0, #0
bxeq lr
```

The singularity check is deliberately a raw-bit check for positive or
negative zero only. NaN and every nonzero bit pattern proceed. A zero result
returns integer 0 without writing the destination or touching the stack.
On success both functions push `d8-d12`, compute `invdet = 1.0/determinant`,
restore `d8-d12` before the output store, store twelve floats, return integer
1, and preserve all core callee-saved registers.

## Affine inverse including translation

`func_00195DD0` (280 bytes) builds the complete inverse 3-by-4 affine matrix.
After the common prefix, the exact cofactor products are generated in this
register order and then multiplied by `invdet`:

| Result | Exact numerator | Operation |
| --- | --- | --- |
| `s0` | `e*i - h*f` | multiply |
| `s1` | `b*i - h*c` | negative multiply |
| `s2` | `b*f - e*c` | multiply |
| `s4` | `d*i - g*f` | negative multiply |
| `s5` | `a*i - g*c` | multiply |
| `s6` | `a*f - d*c` | negative multiply |
| `s8` | `d*h - g*e` | multiply |
| `s9` | `a*h - g*b` | negative multiply |
| `s10` | `a*e - d*b` | multiply |

The numerator schedule is `s16` through `s24` in table order: nine initial
`vmul`, followed by nine `vmls`. Scaling starts with alternating
`vmul`/`vnmul` into `s0,s1,s2,s4,s5,s6,s8`, but the `tx` load is deliberately
inserted before the final two scaled cofactors `s9,s10`. Preserve that order
and its single rounding at each multiply/subtract.

With `r1` already input+32, translation loads are intentionally late and use
offsets -20 (`tx`), -4 (`ty`), and +12 (`tz`). Translation outputs use:

```text
s3  = ((-(s0*tx)) - s1*ty) - s2*tz
s7  = ((-(s4*tx)) - s5*ty) - s6*tz
s11 = ((-(s8*tx)) - s9*ty) - s10*tz
```

Each begins with `vnmul` and uses two `vmls`. After restoring `d8-d12`, one
`vstmia r0,{s0-s11}` writes the matrix. The sole `1.0` literal is immediately
after the 280-byte symbol; the literal load occurs between the two determinant
adds and must address that adjacent pool.

The load/arithmetic interleave is an exact requirement, not merely the three
formulas above. Starting at function-relative offset `+0xCC`, use this tail:

```asm
vmul.f32 s8, s22, s15
vldr s12, [r1, #-20]       @ tx; before final two cofactor scales
vnmul.f32 s9, s23, s15
vmul.f32 s10, s24, s15
vnmul.f32 s3, s0, s12
vldr s13, [r1, #-4]        @ ty
vnmul.f32 s7, s4, s12
vnmul.f32 s11, s8, s12
vmls.f32 s3, s1, s13
vldr s14, [r1, #12]        @ tz
vmls.f32 s7, s5, s13
vmls.f32 s11, s9, s13
vmls.f32 s3, s2, s14
vmls.f32 s7, s6, s14
vmls.f32 s11, s10, s14
vpop {d8-d12}
vstmia r0, {s0-s11}
mov r0, #1
bx lr
```

In particular, do not finish all nine inverse-cofactor scales before loading
`tx`, do not load all three translation components first, and do not finish
`s3` before beginning `s7` and `s11`. The `tx` load occurs immediately after
the `s8` scale, then the `s9` and `s10` scales complete before the first `s3`
multiply. The `ty` load is followed by both other initial multiplies and the
first `s3` subtract; the `tz` load occurs only then.

## Linear inverse expanded as affine matrix

`func_00195EEC` (244 bytes) has the same load, determinant, raw-zero test,
save set, return convention, and adjacent `1.0` literal. It writes an inverse
linear transform as a 3-by-4 record with translation slots zero. Its exact
output mapping is:

```text
row 0: (e*i-h*f)/det, -(d*i-g*f)/det, (d*h-g*e)/det, 0
row 1: -(b*i-h*c)/det, (a*i-g*c)/det, -(a*h-g*b)/det, 0
row 2: (b*f-e*c)/det, -(a*f-d*c)/det, (a*e-d*b)/det, 0
```

The nine numerators are first computed in `s16-s24` in output nonzero-slot
order, using nine `vmul` followed by nine `vmls`. Scaling then alternates
`vmul` and `vnmul` into `s0,s1,s2,s4,s5,s6,s8,s9,s10`. Only after all nine
scaled results are complete, three separate literal loads put `0.0` into
`s3`, `s7`, and `s11`; then `d8-d12` are restored and the twelve-float store
occurs. Literal layout directly after the symbol is `1.0` followed by `0.0`.

## Transposed linear extraction

`func_00196038` (56 bytes) reads the 3-by-3 portion of the same row-major
3-by-4 input and emits its transpose as a 3-by-4 record, inserting zero in
each fourth column:

```text
output = [a,d,g,0, b,e,h,0, c,f,i,0]
```

Its exact load/store template is:

```asm
vldr s0, [r1]
vldr s1, [r1, #16]
vldr s2, [r1, #32]
vldr s3, =0.0
vldr s4, [r1, #4]
vldr s5, [r1, #20]
vldr s6, [r1, #36]
vldr s7, =0.0
vldr s8, [r1, #8]
vldr s9, [r1, #24]
vldr s10, [r1, #40]
vldr s11, =0.0
vstmia r0, {s0-s11}
bx lr
```

All three zero loads address one `0.0` literal immediately after the symbol.
There is no stack use or save set, and all input loads precede the output
store, so exact aliasing is supported.

## Exact-probe manifest

| Function | Mode | Size | Complete-body probe |
| --- | --- | ---: | --- |
| `func_00195DD0` | ARM | 280 | exact |
| `func_00195EEC` | ARM | 244 | exact |
| `func_00196038` | ARM | 56 | exact |
| **Total** |  | **580** | **3 / 3 exact** |

Implementation cautions: retain raw-bit signed-zero testing rather than a VFP
comparison; preserve the determinant and cofactor instruction order; do not
move the success-only VFP save before the early return; retain late translation
loads and `vnmul`/`vmls` sequencing; and pin each adjacent literal pool exactly
as described rather than allowing automatic pool placement.
