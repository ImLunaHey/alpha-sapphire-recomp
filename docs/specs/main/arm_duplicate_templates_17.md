# Probe-verified duplicate ARM templates 17

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated Ghidra 12.0.2 function inventory plus private
  target control-flow, data-flow, complete-body grouping, call-resolution, and
  post-body literal-layout analysis.
- Probe toolchain: GNU Arm assembler, linker, and objcopy 2.45.1.20251203 from
  GCC Arm Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, literal values, extracted assets,
  private numeric addresses, implementation source, or proprietary source.

Every committed and current specification/manifest function and every exact
function in the current report was excluded before grouping. This bounded
batch takes the next six highest aggregate-byte complete-body groups: exactly
15 ARM functions and 1,520 code bytes.

## X-axis VFP direction scaler

These ARM-state functions are 136 bytes and identical over their complete
bodies:

- `func_003485D0`
- `func_00348664`

The output vector is in `r0`, source point A in `r2`, and writable source point
B in `r3`; an input scalar arrives in VFP register `s0`. If `B.x` compares
equal to `A.x`, add the named `nudge` value to `B.x` and store it back. Compute
`d = B - A`, normalize `d` by multiplying it by
`normalizer / sqrt(dot(d,d))`, then compute
`factor = (s0 * scale) / d.x`. Store `d * factor` to output x, y, and z.
Floating-point exceptional behavior follows the listed VFP operations exactly.

Three literal slots follow each body in physical order: `nudge` at relative
offset 136, `normalizer` at 140, and `scale` at 144. Their loads begin at body
offsets 20, 64, and 100. `nudge` and `normalizer` are equal across both X-axis
functions and both Y-axis functions below. The first X function's `scale`
equals the first Y function's `scale`; the second X function's `scale` equals
the second Y function's `scale`. Those two scale equality classes are distinct.

```asm
vldr s2, [r2]
vldr s1, [r3]
vcmp.f32 s1, s2
vmrs APSR_nzcv, fpscr
bne .Ldifferent
vldr s2, <nudge>
vadd.f32 s1, s1, s2
vstr s1, [r3]
.Ldifferent:
vmov.f32 s3, s1
vldmia r2!, {s6}
vldr s2, [r3, #4]
vldr s1, [r3, #8]
vldmia r2, {s4-s5}
vsub.f32 s3, s3, s6
vsub.f32 s2, s2, s4
vsub.f32 s1, s1, s5
vldr s5, <normalizer>
vmul.f32 s4, s3, s3
vmla.f32 s4, s2, s2
vmla.f32 s4, s1, s1
vsqrt.f32 s6, s4
vdiv.f32 s4, s5, s6
vmul.f32 s3, s3, s4
vmul.f32 s2, s2, s4
vmul.f32 s4, s1, s4
vldr s1, <scale>
vmul.f32 s1, s0, s1
vdiv.f32 s0, s1, s3
vmul.f32 s1, s3, s0
vmul.f32 s2, s2, s0
vmul.f32 s0, s4, s0
vstr s0, [r0, #8]
vstmia r0, {s1-s2}
bx lr
```

## Y-axis VFP direction scaler

These ARM-state functions are 132 bytes and identical:

- `func_00348540`
- `func_003486F8`

The ABI and behavior match the X-axis template except that the equality/nudge
test uses y, the input scalar arrives in `s1`, and the final factor divides by
normalized `d.y`. The three literal slots are `nudge`, `normalizer`, and
`scale` at relative offsets 132, 136, and 140; their loads begin at body
offsets 20, 60, and 92. Equality classes are exactly those described above.

```asm
vldr s2, [r2, #4]
vldr s0, [r3, #4]
vcmp.f32 s0, s2
vmrs APSR_nzcv, fpscr
bne .Ldifferent
vldr s2, <nudge>
vadd.f32 s0, s0, s2
vstr s0, [r3, #4]
.Ldifferent:
vldr s3, [r3]
vldr s2, [r3, #8]
vldmia r2!, {s6}
vldmia r2, {s4-s5}
vsub.f32 s3, s3, s6
vsub.f32 s0, s0, s4
vsub.f32 s2, s2, s5
vldr s5, <normalizer>
vmul.f32 s4, s3, s3
vmla.f32 s4, s0, s0
vmla.f32 s4, s2, s2
vsqrt.f32 s6, s4
vdiv.f32 s4, s5, s6
vmul.f32 s5, s3, s4
vmul.f32 s3, s0, s4
vldr s0, <scale>
vmul.f32 s4, s2, s4
vmul.f32 s1, s1, s0
vdiv.f32 s0, s1, s3
vmul.f32 s1, s5, s0
vmul.f32 s2, s3, s0
vmul.f32 s0, s4, s0
vstr s0, [r0, #8]
vstmia r0, {s1-s2}
bx lr
```

## Saturating 64-sample scaler

These ARM-state functions are 128 bytes and have identical complete bodies but
distinct named direct callees:

| Function | optional preprocessing helper |
| --- | --- |
| `func_001A3AA4` | `func_001A3964` |
| `func_001A4250` | `func_001A4110` |

The state object is in `r0` and a writable array of 64 signed 16-bit samples
is in `r1`. Return immediately when state word offset 168 is null. If bit 1 of
the unsigned halfword at offset 160 is set, call the named ARM helper with the
state, signed halfword at offset 164, and sample array. The direct call begins
at body offset 48 and both caller and callee are ARM state.

Read the unsigned scale halfword at offset 162. A value of 4096 returns without
scaling. Otherwise process indices 63 through 0. Multiply each signed sample by
the scale, apply the exact chain of four signed saturating doubles, arithmetic
shift right 16, and store the low halfword. Loop index narrowing uses signed
16-bit `sxth`. There are no literal slots.

```asm
push {r4, r5, r6, lr}
mov r4, r0
ldr r0, [r0, #168]
mov r5, r1
cmp r0, #0
beq .Lreturn
ldrh r0, [r4, #160]
tst r0, #2
beq .Lscale_check
ldrsh r1, [r4, #164]
mov r2, r5
mov r0, r4
bl <optional-preprocessing-helper>
.Lscale_check:
ldrh r0, [r4, #162]
cmp r0, #4096
movne r1, #63
beq .Lreturn
.Lloop:
add r2, r5, r1, lsl #1
ldrh r0, [r4, #162]
ldrsh r3, [r2]
mul r3, r3, r0
qadd r0, r3, r3
qadd r0, r0, r0
qadd r0, r0, r0
qadd r3, r0, r0
sub r0, r1, #1
sxth r1, r0
asr r0, r3, #16
cmp r1, #0
strh r0, [r2]
bge .Lloop
.Lreturn:
pop {r4, r5, r6, pc}
```

## Intrusive-list erase and recycle

These ARM-state functions are 124 bytes and identical:

- `func_0056E15C`
- `func_0056EB14`

Inputs are an output iterator slot in `r0`, owner in `r1`, and mutable iterator
slot in `r2`. The owner has a free-list head at offset 4, sentinel at offset
16, and count at offset 20. A node begins with previous and next pointers at
offsets 0 and 4 and has a destructible payload at offset 8.

If the selected node is the sentinel, return the sentinel through the output
slot. Otherwise preserve its previous pointer in `s16`, unlink it by writing
previous into `next->previous` and next into `previous->next`, decrement the
owner count, and call payload vtable slot 0 indirectly with `node + 8`. Link
the node into the owner's free list through node offset 0, then return the
preserved previous pointer through the output slot. Preserve the unusual VFP
save and `ldrd` register choreography exactly. There are no literal slots or
direct calls.

```asm
push {r4, r5, r6, lr}
mov r6, r0
mov r5, r1
vpush {d8}
mov r4, r2
ldr r0, [r1, #16]
ldr r1, [r2]
cmp r1, r0
streq r0, [r6]
beq .Lreturn
vldr s16, [r1]
ldrd r0, [r1]
str r0, [r1]
ldr r0, [r4]
ldr r1, [r0]
ldr r0, [r0, #4]
str r0, [r1, #4]
ldr r0, [r5, #20]
sub r0, r0, #1
str r0, [r5, #20]
ldr r0, [r4]
ldr r1, [r0, #8]!
ldr r1, [r1]
blx r1
ldr r0, [r4]
ldr r1, [r5, #4]
str r1, [r0]
str r0, [r5, #4]
vstr s16, [r6]
.Lreturn:
vpop {d8}
pop {r4, r5, r6, pc}
```

## Three-slot tagged pointer lookup

These ARM-state functions are 60 bytes and identical over their bodies:

- `func_0013E908`
- `func_00152C18`
- `func_004BF440`
- `func_004BF4B8`

Each function has one distinct named `tag` literal slot immediately after its
body at relative offset 60; its load begins at body offset 0. Compare the tag
against unsigned halfwords at object offsets 20, 32, and 44, in that order. On
the first match, return the word four bytes after the matching halfword. If no
field matches, the exact template still performs the final load relative to a
null base; callers must satisfy the precondition that one slot matches. There
are no calls.

```asm
ldr r1, <tag>
ldrh r2, [r0, #20]
cmp r2, r1
addeq r0, r0, #20
beq .Lload
ldrh r2, [r0, #32]
cmp r2, r1
addeq r0, r0, #32
beq .Lload
ldrh r2, [r0, #44]
cmp r2, r1
addeq r0, r0, #44
movne r0, #0
.Lload:
ldr r0, [r0, #4]
bx lr
```

## Vtable-reset and conditional release

These ARM-state functions are 80 bytes and identical:

- `func_00409614`
- `func_0040F458`
- `func_00411198`

One shared `vtable_identity` literal follows each body at relative offset 80;
the load begins at body offset 8. Store it to object offset 0. If offset 20 is
non-null and offset 8 is null, load the target through two dereferences from
offset 4 and call its vtable slot 4 indirectly, passing the prior offset-20
value in `r1`. In all cases clear object offsets 20 and 24 and return the object.

```asm
push {r4, lr}
mov r4, r0
ldr r0, <vtable_identity>
str r0, [r4]
ldr r1, [r4, #20]
cmp r1, #0
beq .Lclear
ldr r0, [r4, #8]
cmp r0, #0
bne .Lclear
ldr r0, [r4, #4]
ldr r0, [r0]
ldr r2, [r0]
ldr r2, [r2, #4]
blx r2
.Lclear:
mov r0, #0
str r0, [r4, #20]
str r0, [r4, #24]
mov r0, r4
pop {r4, pc}
```

## Probe result

A neutral symbolic ARM assembly probe instantiated every listed function. The
two direct helper calls were linked by name at their independently inventoried
ARM entry points. Zero-valued placeholders were used only for the documented
post-body literal slots to establish exact PC-relative layout; their values lie
outside compared bodies. All 15 complete probe bodies matched their target
intervals exactly. Independent checks confirmed ARM mode, stated sizes,
complete-body equality, call targets and offsets, literal physical layouts and
equality classes, exclusion from prior/current manifests, and non-exact status
in the selection report.

No clean-room implementation is included in this analysis document.
