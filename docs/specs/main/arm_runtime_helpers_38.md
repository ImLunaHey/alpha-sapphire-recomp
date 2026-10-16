# Probe-verified ARM runtime/leaf-helper batch 38

## Scope and provenance

This clean-room specification covers six still-unmatched ARM-state runtime and
leaf helpers totaling 504 executable bytes. The complete schedules below were
independently assembled with GNU Arm Embedded 15.2 for ARMv6K/VFPv2 and
compared against target revision `AS_EUR_REV2` on 2026-10-16. All six complete
bodies and all 504 body bytes matched directly, without normalization.

The evidence was limited to the current unmatched report, the neutral symbol
inventory, bounded private-target control/data-flow inspection, and an
independent exact-schedule probe. The functions have no calls or external
branches. Seven adjacent scalar words are described only through semantic
identities, placement, equality, and use; their private representations are
not recorded here. No private absolute address, raw byte sequence, instruction
encoding, proprietary source, or opaque private value is included.

All schedules use this common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

## `func_0031DC98` — counted halfword-range initializer

This 48-byte leaf installs entry `r1` and `r2` as the two-word pointer/count
descriptor at entry `r0`. If the count is nonzero, it fills exactly that many
successive halfwords beginning at the installed pointer with the batch-local
semantic fill token `runtime_halfword_fill_38`. A zero count performs no
memory access through the installed pointer.

### Complete exact body schedule

```asm
cmp r2,#0
ldrne r12,.Lruntime_halfword_fill_38
stm r0,{r1,r2}
movne r1,#0
beq 2f
1:
ldr r3,[r0]
subs r2,r2,#1
add r3,r3,r1,lsl #1
add r1,r1,#1
strh r12,[r3]
bne 1b
2:
bx lr
```

The conditional literal load precedes the descriptor store. Preserve the
reload of the pointer from `[r0]` on every iteration, the decrement before the
indexed address calculation, and the post-test `bne` consuming the flags from
`subs`; neither `add` nor `strh` changes those flags.

The function extent ends at relative `+0x30`. One four-byte-aligned word is
adjacent at `+0x30` and is addressed by the load at body `+0x04`. It is the
opaque scalar identity `runtime_halfword_fill_38`. Only its low halfword is
stored, and the identity is not otherwise interpreted or dereferenced here.

## `func_0031E680` — zeroed word-range descriptor initializer

This 56-byte leaf installs entry `r1` and `r2` as the pointer/count pair at
entry `r0`, then clears `count` successive words beginning at `pointer`.
The count tests and loop comparison are unsigned. A zero count performs no
access through the pointer.

### Complete exact body schedule

```asm
push {r4}
cmp r2,#0
stm r0,{r1,r2}
mov r1,#0
movhi r12,#0
bls 2f
1:
ldr r4,[r0]
mov r3,r1
add r1,r1,#1
cmp r1,r2
str r12,[r4,r3,lsl #2]
bcc 1b
2:
pop {r4}
bx lr
```

Keep the conditional `movhi` and the unsigned `bls`/`bcc` conditions. The
pointer is deliberately reloaded from the descriptor for every store. The
store follows the loop comparison but precedes the branch; it must not be
moved across either instruction.

## `func_0031E6B8` — aligned range allocator

This 60-byte leaf receives an output pair in `r0`, a pointer to a current
cursor in `r1`, a requested byte count in `r2`, and an alignment in `r3`.
The helper first saves all four incoming argument registers. It then reloads
the requested count from the saved `r2` slot.

For a zero count it writes the pair `(null, 0)` to the output and leaves the
cursor unchanged. For a nonzero count, writing `p` for the entry cursor and
`a` for entry `r3`, it computes:

```text
begin = (p + a - 1) & ~(a - 1)
end   = begin + count
```

It stores `end` back through entry `r1` and writes `(begin, count)` through
entry `r0`. Arithmetic is ordinary wrapping word arithmetic; the helper does
not validate that the alignment is nonzero or a power of two.

### Complete exact body schedule

```asm
push {r0,r1,r2,r3}
ldr r12,[sp,#8]
cmp r12,#0
moveq r2,#0
beq 1f
ldr r2,[r1]
add r2,r2,r3
sub r3,r3,#1
sub r2,r2,#1
bic r2,r2,r3
add r3,r2,r12
str r3,[r1]
1:
stm r0,{r2,r12}
add sp,sp,#16
bx lr
```

Preserve the four-register save even though no matching pop is used. The
frame is discarded with `add sp,sp,#16`. The paired output store uses the
entry `r0`, which remains live despite its saved copy on the stack.

## `func_0031E6F8` — planar basis-record initializer

This 104-byte VFP leaf reads single-precision components `x` and `y` from
entry `r1` offsets 4 and 20. It forms `q = x*x + y*y`. When `q` compares
equal to semantic zero, it selects `(x',y') = (zero,unit)`. Otherwise it
computes the VFP single-precision schedule:

```text
scale = unit / sqrt(q)
x' = x * scale
y' = y * scale
```

It then writes the following single-precision fields through entry `r0`:

| Destination offset | Value |
| ---: | --- |
| 0 | `y'` |
| 4 | `x'` |
| 8 | semantic zero |
| 16 | `-x'` |
| 20 | `y'` |
| 24 | semantic zero |
| 32 | semantic zero |
| 36 | semantic zero |
| 40 | semantic unit |

No other destination offsets are touched.

### Complete exact body schedule

```asm
vldr s0,[r1,#4]
vldr s3,[r1,#20]
vldr s2,.Lruntime_float_zero_38_a
vmul.f32 s1,s0,s0
vldr s4,.Lruntime_float_unit_38_a
vmla.f32 s1,s3,s3
vcmp.f32 s1,s2
vmrs APSR_nzcv,fpscr
vmoveq.f32 s0,s2
vmoveq.f32 s1,s4
beq 1f
vsqrt.f32 s5,s1
vdiv.f32 s1,s4,s5
vmul.f32 s0,s0,s1
vmul.f32 s1,s3,s1
1:
add r1,r0,#20
vstr s1,[r0]
vstr s0,[r0,#4]
vstr s4,[r0,#40]
vstr s2,[r0,#8]
vneg.f32 s0,s0
vstmia r1,{s1-s2}
vstr s2,[r0,#32]
vstr s2,[r0,#36]
vstr s0,[r0,#16]
bx lr
```

The equality path is selected by `beq` after transferring VFP flags to the
APSR. Preserve the VFP operation order, including the multiply-accumulate and
the division spelling. The two-word store at offsets 20 and 24 is one
`vstmia`, not two scalar stores.

The body ends at relative `+0x68`. Adjacent words at `+0x68` and `+0x6C`
provide `runtime_float_zero_38` and `runtime_float_unit_38`, respectively.
They are loaded at body offsets `+0x08` and `+0x10`.

## `func_0031EE40` — projected planar basis-record initializer

This 152-byte VFP leaf takes a destination in entry `r0`, a seven-float source
in entry `r1`, and a strided three-float direction in entry `r2`. Define:

```text
a = source[0] * direction[1]
  + source[1] * direction[5]
  + source[2] * direction[9]

b = source[4] * direction[1]
  + source[5] * direction[5]
  + source[6] * direction[9]

q = a*a + b*b
```

The indices above are float indices, so the accessed direction offsets are
4, 20, and 36 and the second source row begins at byte offset 16. When `q`
compares equal to semantic zero, the helper selects `(a',b') = (zero,unit)`.
Otherwise it evaluates `scale = unit/sqrt(q)`, `a' = a*scale`, and
`b' = b*scale` in the displayed VFP schedule.

It stores `b'` at destination offsets 0 and 20, `a'` at offset 4, `-a'` at
offset 16, semantic zero at offsets 8, 24, 32, and 36, and semantic unit at
offset 40. No other destination offset is accessed.

### Complete exact body schedule

```asm
vldr s3,[r2,#4]
vldr s1,[r1]
add r3,r1,#4
vldr s0,[r2,#20]
vmul.f32 s1,s1,s3
vldmia r3,{s4-s5}
add r1,r1,#16
vldr s2,[r2,#36]
vmla.f32 s1,s4,s0
vmla.f32 s1,s5,s2
vldmia r1,{s4-s6}
vmul.f32 s3,s4,s3
vldr s4,.Lruntime_float_unit_38_b
vmla.f32 s3,s5,s0
vmul.f32 s0,s1,s1
vmla.f32 s3,s6,s2
vldr s2,.Lruntime_float_zero_38_b
vmla.f32 s0,s3,s3
vcmp.f32 s0,s2
vmrs APSR_nzcv,fpscr
vmoveq.f32 s1,s2
vmoveq.f32 s0,s4
beq 1f
vsqrt.f32 s5,s0
vdiv.f32 s0,s4,s5
vmul.f32 s1,s1,s0
vmul.f32 s0,s3,s0
1:
vstr s0,[r0]
vstr s0,[r0,#20]
vstr s1,[r0,#4]
vneg.f32 s0,s1
vstr s4,[r0,#40]
vstr s2,[r0,#8]
vstr s2,[r0,#24]
vstr s2,[r0,#32]
vstr s2,[r0,#36]
vstr s0,[r0,#16]
bx lr
```

The body ends at relative `+0x98`. Adjacent words at `+0x98` and `+0x9C`
provide `runtime_float_zero_38` and `runtime_float_unit_38`, respectively.
Notice that the unit load occurs first and addresses the later word, while the
zero load occurs later and addresses the earlier word.

## `func_0031F044` — normalize a three-float vector

This 84-byte VFP leaf reads three single-precision components from entry `r1`
and computes their sum of squares in source order. When that sum compares
equal to semantic zero, it returns zero in `r0` without writing through the
entry destination. Otherwise it divides semantic unit by the VFP square root,
scales the three components, stores them at destination offsets 0, 4, and 8,
and returns one.

### Complete exact body schedule

```asm
vldmia r1!,{s3}
vldr s4,.Lruntime_float_zero_38_c
vldmia r1,{s1-s2}
vmul.f32 s0,s3,s3
vmla.f32 s0,s1,s1
vmla.f32 s0,s2,s2
vcmp.f32 s0,s4
vmrs APSR_nzcv,fpscr
moveq r0,#0
beq 1f
vsqrt.f32 s5,s0
vldr s4,.Lruntime_float_unit_38_c
vdiv.f32 s0,s4,s5
vmul.f32 s3,s3,s0
vmul.f32 s1,s1,s0
vmul.f32 s0,s2,s0
vstr s3,[r0]
vstr s1,[r0,#4]
vstr s0,[r0,#8]
mov r0,#1
1:
bx lr
```

The first load uses writeback to advance `r1` by one float before the paired
load. Preserve the exact accumulate order and the late unit load after
`vsqrt`. On the success path entry `r0` remains the destination until all
three stores are complete and is only then replaced by the Boolean result.

The body ends at relative `+0x54`. Adjacent words at `+0x54` and `+0x58`
provide `runtime_float_zero_38` and `runtime_float_unit_38`, respectively.
They are loaded at body offsets `+0x04` and `+0x2C`.

## Semantic relocation and equality ledger

The independent probe can use zero placeholders at the seven slots because
the body comparison depends on their placement, while an audited target-object
normalizer may represent the slots with `R_ARM_ABS32` relocations against the
following semantic identities:

| Identity | Function-relative slots | Alignment | Equality and permitted use |
| --- | --- | ---: | --- |
| `runtime_halfword_fill_38` | `func_0031DC98 + 0x30` | 4 | singleton opaque scalar; only its low halfword is copied into the counted range |
| `runtime_float_zero_38` | `func_0031E6F8 + 0x68`; `func_0031EE40 + 0x98`; `func_0031F044 + 0x54` | 4 | all three slots are one equality class; used as VFP single-precision additive zero and equality-test operand |
| `runtime_float_unit_38` | `func_0031E6F8 + 0x6C`; `func_0031EE40 + 0x9C`; `func_0031F044 + 0x58` | 4 | all three slots are one equality class distinct from zero and the halfword token; used as VFP single-precision multiplicative unit |

Normalization must be restricted to these exact function-relative slots and
must first verify the stated within-class equality and between-class
distinction. The function sizes remain the executable body sizes; none of the
seven adjacent words is included in a function extent.

There are no `R_ARM_CALL`, `R_ARM_JUMP24`, or interworking relocations in this
batch. Local conditional branches remain resolved locally. A symbolic probe
has exactly seven `R_ARM_ABS32` relocations: one fill-token slot, then three
zero/unit pairs in the function order shown above.

## Exact-probe and overlap audit

| Function | Mode | Body size | Calls | Probe result |
| --- | --- | ---: | ---: | --- |
| `func_0031DC98` | ARM | 48 | 0 | exact body; one semantic adjacent slot audited |
| `func_0031E680` | ARM | 56 | 0 | exact body |
| `func_0031E6B8` | ARM | 60 | 0 | exact body |
| `func_0031E6F8` | ARM/VFPv2 | 104 | 0 | exact body; zero/unit pair placement audited |
| `func_0031EE40` | ARM/VFPv2 | 152 | 0 | exact body; zero/unit pair placement audited |
| `func_0031F044` | ARM/VFPv2 | 84 | 0 | exact body; zero/unit pair placement audited |
| **Total** |  | **504** | **0** | **6 / 6 exact** |

The current objdiff report lists all six functions as unmatched. A repository
spec/config inventory found no earlier batch naming any selected function.
The concurrently prepared duplicate batch 38 and IPC batch 34 also name none
of them. The selected functions are pairwise distinct, so the known overlap is
zero.
