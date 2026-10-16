# Probe-verified ARM VFP matrix builders batch 20

## Scope and provenance

This clean-room specification covers three previously unspecified, unmatched
ARM-state VFP leaves totaling 364 bytes. It uses public ARM, AAPCS32, VFP and
IEEE-754 semantics only. It contains no raw instruction encodings, extracted
data, private addresses, or proprietary source. Every complete body was
independently assembled and compared over its full symbol extent; all three
were byte-exact. None calls or branches to another symbol, and none uses the
stack or a callee-saved register.

## Quaternion to row-major 3-by-4 matrix

`func_002DB434` (200 bytes) takes destination `r0`, a four-float quaternion at
`r1` in `(x,y,z,w)` order, and flag `r2`. It computes a scale of
`2/(x*x+y*y+z*z+w*w)` without a zero guard and forms a normalized 3-by-3
rotation matrix. If entry `r2 != 0`, it also writes zero to the fourth column
at offsets 12, 28 and 44; if `r2 == 0`, those three words are left untouched.
The initial core `cmp` supplies the later `beq`; intervening VFP arithmetic
must not be replaced by an APSR-updating sequence.

Use the exact schedule:

```asm
vldmia r1, {s0-s1}
cmp r2, #0
vldr s3, [r1, #8]
vldr s2, [r1, #12]
vmul.f32 s5, s0, s0
vldr s7, =2.0
vldr s6, =1.0
vmla.f32 s5, s1, s1
vmla.f32 s5, s3, s3
vmla.f32 s5, s2, s2
vdiv.f32 s4, s7, s5
vmul.f32 s5, s1, s4
vmul.f32 s7, s0, s4
vmul.f32 s4, s3, s4
vmul.f32 s9, s1, s5
vmul.f32 s8, s0, s7
vmul.f32 s3, s3, s4
vmul.f32 s10, s1, s4
vmul.f32 s7, s2, s7
vmul.f32 s1, s2, s5
vmul.f32 s5, s0, s5
vmul.f32 s2, s2, s4
vmul.f32 s0, s0, s4
vadd.f32 s11, s9, s3
vadd.f32 s12, s8, s3
vadd.f32 s9, s8, s9
vsub.f32 s8, s10, s7
vadd.f32 s7, s10, s7
vsub.f32 s3, s5, s2
vadd.f32 s2, s5, s2
vadd.f32 s4, s0, s1
vsub.f32 s5, s0, s1
vsub.f32 s0, s6, s11
vsub.f32 s10, s6, s12
vsub.f32 s6, s6, s9
beq no_column_write
vldr s1, =0.0
vstr s1, [r0, #12]
vstr s1, [r0, #28]
vstr s1, [r0, #44]
no_column_write:
vstr s0, [r0]
vstr s2, [r0, #16]
vstr s10, [r0, #20]
vstr s8, [r0, #24]
vstr s5, [r0, #32]
vstr s7, [r0, #36]
vstr s6, [r0, #40]
add r1, r0, #4
vstmia r1, {s3-s4}
bx lr
```

The adjacent literal pool immediately after the symbol is `2.0`, `1.0`,
`0.0` in that order. The function clobbers `r1` and `s0-s12`; `r0` continues
to hold the destination.

## Six-parameter projection matrix

`func_002DB508` (148 bytes) receives six floats directly in `s0-s5`, writes a
four-by-four matrix to `r0`, and has no core input beyond the destination.
Name entry values `a=s0`, `b=s1`, `c=s2`, `d=s3`, `n=s4`, `f=s5`. It writes:

```text
[ 2n/(b-a),       0, (b+a)/(b-a),      0 ]
[          0, 2n/(d-c), (d+c)/(d-c),   0 ]
[          0,       0,       f/(f-n), f*n/(f-n) ]
[          0,       0,             -1,          0 ]
```

The exact instruction and store order is:

```asm
vldr s6, =1.0
vsub.f32 s11, s3, s2
vadd.f32 s8, s3, s2
vsub.f32 s13, s1, s0
vadd.f32 s9, s1, s0
vldr s1, =-1.0
vsub.f32 s12, s5, s4
vldr s10, =2.0
vstr s1, [r0, #56]
vmul.f32 s7, s5, s4
vldr s0, =0.0
vmul.f32 s4, s4, s10
vstr s0, [r0, #4]
vstr s0, [r0, #12]
vdiv.f32 s1, s6, s13
vstr s0, [r0, #16]
vstr s0, [r0, #28]
vstr s0, [r0, #32]
vstr s0, [r0, #36]
vstr s0, [r0, #48]
vstr s0, [r0, #52]
vstr s0, [r0, #60]
vdiv.f32 s3, s6, s11
vmul.f32 s0, s8, s3
vmul.f32 s3, s4, s3
vdiv.f32 s2, s6, s12
vmul.f32 s6, s4, s1
vmul.f32 s1, s9, s1
vmul.f32 s7, s7, s2
vmul.f32 s2, s5, s2
vstr s6, [r0]
vstr s1, [r0, #8]
vstr s3, [r0, #20]
vstr s0, [r0, #24]
vstr s2, [r0, #40]
vstr s7, [r0, #44]
bx lr
```

Its adjacent literal pool is ordered `1.0`, `2.0`, `0.0`, `-1.0`, although
the first load in instruction order accesses `1.0` and the second accesses
the final `-1.0`. There are no denominator checks; IEEE-754 division behavior
is observable. It clobbers `s0-s13`.

## Paired zero initializer

`func_002DC604` (16 bytes) stores floating `0.0` to object `r0` offsets 80
and 92 and returns. One zero literal lies immediately after the symbol:

```asm
vldr s0, =0.0
vstr s0, [r0, #80]
vstr s0, [r0, #92]
bx lr
```

## Exact-probe manifest

| Function | Mode | Size | Complete-body probe |
| --- | --- | ---: | --- |
| `func_002DB434` | ARM | 200 | exact |
| `func_002DB508` | ARM | 148 | exact |
| `func_002DC604` | ARM | 16 | exact |
| **Total** |  | **364** | **3 / 3 exact** |

Implementation cautions: preserve VFP instruction and store order; retain the
APSR flags from the early core compare across the quaternion arithmetic;
leave fourth-column words untouched when the flag is zero; do not add zero-
denominator guards; and pin each adjacent literal pool in the stated order.
