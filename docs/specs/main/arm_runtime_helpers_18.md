# Probe-verified ARM VFP and structured leaf helpers batch 18

## Scope and provenance

This clean-room specification covers nine previously unspecified, unmatched
ARM-state leaf functions totaling 948 bytes. It uses only public ARM,
AAPCS32, VFP, IEEE-754, and ordinary array/matrix semantics. No raw
instruction encodings, extracted data, private addresses, or proprietary
source are included. Every complete body was independently assembled and
compared over its full symbol extent; all nine probes were byte-exact. None
of these functions calls or branches to another symbol.

## Vector normalization with fallback

`func_002DB148` (96 bytes) takes destination `r0`, three-float input `r1`, and
three-word fallback `r2`. It advances `r1` by four while loading. It computes
`n = x*x + y*y + z*z` using an initial multiply and two fused accumulates,
then compares `n` exactly with `0.0`. If equal, it copies the three fallback
words to the destination. Otherwise it computes `k = 1.0 / sqrt(n)` and
stores `(x*k,y*k,z*k)`. There is no epsilon test. NaN follows the non-equal
normalization path. No registers are saved.

```asm
vldmia r1!, {s3}
vldr s4, =0.0
vldmia r1, {s1-s2}
vmul.f32 s0, s3, s3
vmla.f32 s0, s1, s1
vmla.f32 s0, s2, s2
vcmp.f32 s0, s4
vmrs APSR_nzcv, fpscr
bne normalize
ldm r2, {r1, r3}
ldr r2, [r2, #8]
str r2, [r0, #8]
stm r0, {r1, r3}
bx lr
normalize:
vsqrt.f32 s5, s0
vldr s4, =1.0
vdiv.f32 s0, s4, s5
vmul.f32 s3, s3, s0
vmul.f32 s1, s1, s0
vmul.f32 s0, s2, s0
vstr s3, [r0]
vstr s1, [r0, #4]
vstr s0, [r0, #8]
bx lr
```

## Register-only VFP arithmetic kernel

`func_002DB244` (64 bytes) has no core-register arguments or memory writes.
It consumes `s0-s5`, uses public constants 2.0, 3.0, and 1.0, and returns its
results in `s0` and `s1` while clobbering `s2-s10`. Preserve this exact
single-precision schedule; in particular `vnmls` and both `vmla` operations
must not be algebraically reassociated:

```asm
vdiv.f32 s6, s4, s5
vldr s10, =2.0
vldr s7, =3.0
vldr s9, =1.0
vsub.f32 s8, s0, s2
vnmls.f32 s7, s6, s10
vsub.f32 s2, s6, s9
vmul.f32 s3, s6, s3
vmul.f32 s5, s6, s6
vmul.f32 s6, s8, s7
vmul.f32 s1, s2, s1
vmul.f32 s2, s4, s2
vmla.f32 s0, s6, s5
vadd.f32 s1, s1, s3
vmla.f32 s0, s2, s1
bx lr
```

## Three-by-three matrix to quaternion

`func_002DB290` (408 bytes) converts the 3-by-3 portion of a row-major 3-by-4
float matrix at `r1` to a four-float quaternion at `r0`. Denote matrix values
`m00,m01,m02` at offsets 0,4,8; `m10,m11,m12` at 16,20,24; and
`m20,m21,m22` at 32,36,40. Output order is `(x,y,z,w)`.

It first loads all nine matrix values plus constants `zero=0.0`, `one=1.0`,
and `half=0.5`, then sets `trace=(m00+m11)+m22`. Comparisons use `vcmpe` and
transfer FPSCR flags to APSR. The exact decision tree and arithmetic are:

```text
if trace > 0:
    root = sqrt(trace + one)
    w = root * half
    scale = half / root
    x = (m21 - m12) * scale
    y = (m02 - m20) * scale
    z = (m10 - m01) * scale
else if m11 > m00:
    if m22 > m11: use m22-largest below
    root = sqrt((m11 - (m22 + m00)) + one)
    y = root * half
    scale = (root == zero) ? root : half / root
    w = (m02 - m20) * scale
    z = (m12 + m21) * scale
    x = (m01 + m10) * scale
else if m22 > m00:
    use m22-largest
else:
    root = sqrt((m00 - (m11 + m22)) + one)
    x = root * half
    scale = (root == zero) ? root : half / root
    w = (m21 - m12) * scale
    y = (m01 + m10) * scale
    z = (m02 + m20) * scale

m22-largest:
    root = sqrt((m22 - (m00 + m11)) + one)
    z = root * half
    scale = (root == zero) ? root : half / root
    w = (m10 - m01) * scale
    x = (m02 + m20) * scale
    y = (m12 + m21) * scale
```

The semantic decision tree alone is not sufficient to reproduce this body.
The target deliberately uses a non-canonical register allocation, keeps the
positive-trace case as the initial fall-through, and uses explicit branches
around `vdiv` followed by `vmov` in each zero-root case. Use this complete
instruction schedule:

```asm
vldr s8, [r1]
vldr s9, [r1, #20]
vldr s1, [r1, #40]
vldr s10, =0.0
vadd.f32 s13, s8, s9
vldr s11, =1.0
vldr s0, =0.5
vldr s2, [r1, #36]
vldr s3, [r1, #24]
vldr s4, [r1, #8]
vldr s5, [r1, #32]
vldr s6, [r1, #16]
vldr s7, [r1, #4]
vadd.f32 s12, s13, s1
vcmpe.f32 s12, s10
vmrs APSR_nzcv, fpscr
ble nonpositive
vadd.f32 s1, s12, s11
vsub.f32 s8, s2, s3
vsub.f32 s4, s4, s5
vsub.f32 s5, s6, s7
vsqrt.f32 s2, s1
vmul.f32 s3, s2, s0
vdiv.f32 s1, s0, s2
vstr s3, [r0, #12]
vmul.f32 s0, s8, s1
vmul.f32 s2, s4, s1
vmul.f32 s1, s5, s1
vstr s0, [r0]
vstr s2, [r0, #4]
vstr s1, [r0, #8]
bx lr
nonpositive:
vcmpe.f32 s9, s8
vmrs APSR_nzcv, fpscr
ble test_m00
vcmpe.f32 s1, s9
vmrs APSR_nzcv, fpscr
bgt m22_path
vadd.f32 s1, s1, s8
vsub.f32 s1, s9, s1
vadd.f32 s8, s1, s11
vsqrt.f32 s1, s8
vmul.f32 s8, s1, s0
vcmp.f32 s1, s10
vmrs APSR_nzcv, fpscr
beq m11_scaled
vdiv.f32 s9, s0, s1
vmov.f32 s1, s9
m11_scaled:
vsub.f32 s0, s4, s5
vadd.f32 s2, s3, s2
vadd.f32 s3, s6, s7
vstr s8, [r0, #4]
vmul.f32 s0, s0, s1
vmul.f32 s2, s2, s1
vmul.f32 s1, s3, s1
vstr s0, [r0, #12]
vstr s2, [r0, #8]
vstr s1, [r0]
bx lr
test_m00:
vcmpe.f32 s1, s8
vmrs APSR_nzcv, fpscr
bgt m22_path
vadd.f32 s1, s9, s1
vsub.f32 s1, s8, s1
vadd.f32 s8, s1, s11
vsqrt.f32 s1, s8
vmul.f32 s8, s1, s0
vcmp.f32 s1, s10
vmrs APSR_nzcv, fpscr
beq m00_scaled
vdiv.f32 s9, s0, s1
vmov.f32 s1, s9
m00_scaled:
vsub.f32 s0, s2, s3
vadd.f32 s3, s7, s6
vadd.f32 s4, s4, s5
vstr s8, [r0]
add r1, r0, #4
vmul.f32 s2, s0, s1
vmul.f32 s0, s3, s1
vmul.f32 s1, s4, s1
vstmia r1, {s0-s2}
bx lr
m22_path:
vsub.f32 s1, s1, s13
vadd.f32 s8, s1, s11
vsqrt.f32 s1, s8
vmul.f32 s8, s1, s0
vcmp.f32 s1, s10
vmrs APSR_nzcv, fpscr
beq m22_scaled
vdiv.f32 s9, s0, s1
vmov.f32 s1, s9
m22_scaled:
vsub.f32 s0, s6, s7
vadd.f32 s4, s5, s4
vadd.f32 s3, s2, s3
vstr s8, [r0, #8]
vmul.f32 s0, s0, s1
vmul.f32 s2, s4, s1
vmul.f32 s1, s3, s1
vstr s0, [r0, #12]
vstr s2, [r0]
vstr s1, [r0, #4]
bx lr
```

The final `bx lr` is the last instruction in the 408-byte symbol; there is no
alignment `nop` inside the function. Its three single-precision literal words
are placed immediately after the symbol in order `0.0`, `1.0`, `0.5`. The
loads of those values are respectively the fourth, sixth, and seventh
instructions, and must address that adjacent pool rather than an assembler-
selected pooled copy elsewhere.

The three `root == zero` tests use non-exceptional `vcmp.f32`; every other
floating comparison uses `vcmpe.f32`. No stack or callee-saved register is
used. All input loads precede any output store, so exact aliasing works.

## Three-vector cross product

`func_002DBE24` (52 bytes) stores the cross product of three-float `A` at
`r1` and `B` at `r2` to `r0`. Each component starts with `vmul` and finishes
with `vmls`, in output order `(A1*B2-A2*B1, A2*B0-A0*B2,
A0*B1-A1*B0)`. Both inputs are fully loaded before stores.

```asm
vldmia r2, {s7-s8}
vldr s6, [r1]
vldr s4, [r2, #8]
vldr s3, [r1, #4]
vldr s5, [r1, #8]
vmul.f32 s2, s6, s8
vmul.f32 s0, s3, s4
vmul.f32 s1, s5, s7
vmls.f32 s2, s3, s7
vmls.f32 s0, s5, s8
vmls.f32 s1, s6, s4
vstmia r0, {s0-s2}
bx lr
```

## Guarded two-float change setters

`func_0030FDF8` and `func_0030FE40` are 72 bytes each. They dereference the
object pointer at entry `r0`, load a two-float source at `r1`, and compare it
component-by-component with a field in the inner object. The second compare
and load are conditional on exact equality of the first component. If both
are equal they return. Otherwise they replace both floats and set inner-object
byte +36 to 1. Ordered equality is used, so a NaN triggers the write.

| Function | Inner float pair offset |
| --- | ---: |
| `func_0030FDF8` | +28 |
| `func_0030FE40` | +16 |

```asm
ldr r2, [r0]
vldr s1, [r1]
vldr s0, [r1, #4]
add r3, r2, #FIELD
vldr s2, [r2, #FIELD]
vcmp.f32 s2, s1
vmrs APSR_nzcv, fpscr
vldreq s2, [r3, #4]
vcmpeq.f32 s2, s0
vmrseq APSR_nzcv, fpscr
beq done
add r2, r2, #FIELD
mov r1, #1
vstr s1, [r2]
vstr s0, [r2, #4]
ldr r0, [r0]
strb r1, [r0, #36]
done: bx lr
```

## Four-float indexed append

`func_00324BE0` (64 bytes) reads byte index `i` at object `r0` offset 38 and
array base at offset 1648. It concatenates the two floats at `r1` and two at
`r2`, storing four floats at `base + i*16`. It also converts unsigned `i` to
float and stores it at object offset 1628, then stores low byte `i+1` back at
offset 38. No capacity check is performed. It preserves `r4` using a
single-register push/pop and therefore temporarily moves SP by four bytes.

```asm
push {r4}
ldrb r4, [r0, #38]
ldr r12, [r0, #1648]
vldmia r2, {s3-s4}
and r2, r4, #255
vmov s0, r2
vldmia r1, {s1-s2}
add r1, r12, r4, lsl #4
add r3, r2, #1
vstmia r1, {s1-s4}
add r2, r0, #1024
vcvt.f32.u32 s0, s0
vstr s0, [r2, #604]
strb r3, [r0, #38]
pop {r4}
bx lr
```

## Nested record four-float setter

`func_003979D4` (72 bytes) takes root `r0`, record index `r1`, subindex `r2`,
and four-float source `r3`. It selects a 372-byte record at
`root->offset108 + 372*r1 + 328`, then reads its pointer table at +36 and
selects table element `r2`. If either table or selected element is null it
returns. Otherwise it writes word 1 at selected element +0 and copies four
floats to +12..+24. No registers are saved.

```asm
rsb r1, r1, r1, lsl #5
ldr r0, [r0, #108]
add r1, r1, r1, lsl #1
add r0, r0, r1, lsl #2
add r0, r0, #328
ldr r1, [r0, #36]
cmp r1, #0
ldrne r1, [r1, r2, lsl #2]
cmpne r1, #0
beq done
mov r12, #1
str r12, [r1]
ldr r0, [r0, #36]
vldmia r3, {s0-s3}
ldr r0, [r0, r2, lsl #2]
add r0, r0, #12
vstmia r0, {s0-s3}
done: bx lr
```

## Three-float member setter through stack scratch

`func_0039B308` (48 bytes) accepts object `r0` and three float arguments in
`s0-s2`. It allocates 16 bytes, spills the floats, reloads their bits through
core registers, and stores them at object offsets 232, 236, and 240. It saves
`r4,lr`, preserves eight-byte stack alignment, and returns with `pop {r4,pc}`.

```asm
push {r4, lr}
sub sp, sp, #16
mov r4, r0
mov r0, sp
vstmia r0, {s0-s2}
ldm r0, {r1, r2}
ldr r0, [r0, #8]
str r0, [r4, #240]
add r4, r4, #232
stm r4, {r1, r2}
add sp, sp, #16
pop {r4, pc}
```

## Exact-probe manifest

| Function | Mode | Size | Complete-body probe |
| --- | --- | ---: | --- |
| `func_002DB148` | ARM | 96 | exact |
| `func_002DB244` | ARM | 64 | exact |
| `func_002DB290` | ARM | 408 | exact |
| `func_002DBE24` | ARM | 52 | exact |
| `func_0030FDF8` | ARM | 72 | exact |
| `func_0030FE40` | ARM | 72 | exact |
| `func_00324BE0` | ARM | 64 | exact |
| `func_003979D4` | ARM | 72 | exact |
| `func_0039B308` | ARM | 48 | exact |
| **Total** |  | **948** | **9 / 9 exact** |

Implementation cautions: retain exact VFP comparison variants and FPSCR flag
transfers; preserve multiply/accumulate order and parenthesization; keep the
matrix-to-quaternion zero-root special cases; treat VFP record copies as
bit-preserving operations; retain the four-byte `r4` save in the append
helper and the explicit stack scratch in the three-float setter.
