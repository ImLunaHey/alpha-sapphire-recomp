# Probe-verified ARM runtime/leaf-helper batch 41

## Scope and provenance

This clean-room specification covers 13 still-unmatched ARM-state leaf and
runtime helpers totaling 1,716 executable bytes. Evidence was limited to the
current unmatched report, neutral symbols, bounded private-target
control/data-flow inspection, and independent exact-schedule probes. The
selection is disjoint from every earlier runtime-helper manifest and excludes
the symbols reserved for duplicate-template batch 41.

All 13 bodies are call-free. Twelve contain no relocations, literal pools, or
adjacent words. `func_0056B030` has one immediately adjacent semantic scalar
slot; its representation remains private. No private absolute address, raw
byte sequence, instruction encoding, proprietary source, or opaque private
literal value is recorded here.

The schedules were independently assembled with GNU Arm Embedded 15.2 for
ARMv6K/VFPv2 and compared with target revision `AS_EUR_REV2` on 2026-10-16.
All complete bodies and all 1,716 body bytes matched directly, without
normalization. Use this common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

## `func_004C58DC` — paired-entry key search

This 180-byte leaf searches a record array reached through entry `r0` offset
4. The unsigned record count is at offset 12. Each 28-byte record contributes
one key at record offset 24; records after the optional odd prefix contribute
a second key at offset 52 from the first record of each pair. It returns the
zero-based logical key index, or all-ones when no key equals entry `r1`.

```asm
push {r4,r5,r6,lr}
mov r5,r0
ldr r3,[r0,#12]
cmp r3,#0
beq 5f
and r0,r3,#1
cmp r0,#0
ldrhi r4,[r5,#4]
mov r12,#24
mov r2,#0
bls 2f
1:
rsb r6,r2,r2,lsl #3
add r6,r12,r6,lsl #2
ldr r6,[r4,r6]
cmp r6,r1
bne 6f
mov r0,r2
7:
pop {r4,r5,r6,pc}
6:
add r2,r2,#1
cmp r0,r2
bhi 1b
2:
cmp r3,r0
ldrhi r2,[r5,#4]
movhi r6,#52
bls 5f
3:
rsb r4,r0,r0,lsl #3
add r5,r12,r4,lsl #2
ldr r5,[r2,r5]
cmp r5,r1
beq 7b
add r4,r6,r4,lsl #2
ldr r4,[r2,r4]
cmp r4,r1
bne 4f
add r0,r0,#1
pop {r4,r5,r6,pc}
4:
add r0,r0,#2
cmp r3,r0
bhi 3b
5:
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
mvn r0,#0
pop {r4,r5,r6,pc}
```

Preserve the otherwise inert four-instruction diagnostic sequence before the
not-found result and the separate odd-prefix loop.

## `func_004D0014` — four-float tolerance comparison

This 124-byte VFP leaf compares four single-precision components at entry
`r0` and entry `r1`. It returns one only when the absolute difference of every
component is at most the tolerance in entry `s0`; otherwise it returns zero.
The first three checks use the displayed quiet compare in difference-first
order, while the final check reverses the operands and uses `movge`/`bge`.

```asm
vldr s1,[r1]
vldr s2,[r0]
vsub.f32 s1,s1,s2
vabs.f32 s1,s1
vcmpe.f32 s1,s0
vmrs APSR_nzcv,fpscr
bhi 1f
vldr s1,[r1,#4]
vldr s2,[r0,#4]
vsub.f32 s1,s1,s2
vabs.f32 s1,s1
vcmpe.f32 s1,s0
vmrs APSR_nzcv,fpscr
bhi 1f
vldr s1,[r1,#8]
vldr s2,[r0,#8]
vsub.f32 s1,s1,s2
vabs.f32 s1,s1
vcmpe.f32 s1,s0
vmrs APSR_nzcv,fpscr
bhi 1f
vldr s1,[r1,#12]
vldr s2,[r0,#12]
vsub.f32 s1,s1,s2
vabs.f32 s1,s1
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
movge r0,#1
bge 2f
1:
mov r0,#0
2:
bx lr
```

## `func_004D42C8` — linked-block selector

This 156-byte leaf walks a circular linked sequence embedded in entry `r0`.
The initial node pointer is at offset 120, the link-field displacement is at
offset 128, and the sentinel is formed from offset 116 minus that
displacement. Nodes are considered only when their unsigned word at offset 8
is at least entry `r1`.

Entry `r2` is a selection mode: zero returns the first eligible node
immediately; mode one retains a new node when its offset-8 word is smaller
than the retained value; mode two retains it when larger. Other modes do not
replace a retained node. Null is returned when nothing is selected.

```asm
push {r4,r5,r6}
mov r5,r0
mov r0,#0
ldr r3,[r5,#120]
ldr r12,[r5,#128]
b 5f
1:
ldr r4,[r3,#8]
cmp r1,r4
bhi 4f
cmp r2,#0
beq 6f
cmp r0,#0
beq 3f
cmp r2,#1
beq 2f
cmp r2,#2
beq 7f
b 4f
6:
pop {r4,r5,r6}
mov r0,r3
bx lr
2:
ldr r6,[r0,#8]
cmp r6,r4
bls 4f
b 3f
7:
ldr r6,[r0,#8]
cmp r6,r4
bcs 4f
3:
mov r0,r3
4:
add r3,r3,r12
ldr r3,[r3,#4]
5:
ldr r6,[r5,#128]
add r4,r5,#116
sub r3,r3,r12
sub r4,r4,r6
cmp r3,r4
bne 1b
pop {r4,r5,r6}
bx lr
```

## `func_004E41C8` — keyed capability-level test

This 116-byte leaf scans twelve 16-byte records at the array loaded from entry
`r0` offset 8. It finds the first record whose word at offset 4 equals entry
`r2`. A matching record receives level three when byte 0 is nonzero, level two
when byte 1 is nonzero, level one when byte 2 is nonzero, and otherwise keeps
the pointer-derived value produced by the exact schedule. It returns one when
that value is unsigned-less-than-or-equal to entry `r1`; no matching record
returns zero.

```asm
ldr r0,[r0,#8]
mov r3,#0
1:
add r12,r0,r3,lsl #4
ldr r12,[r12,#4]
cmp r12,r2
bne 2f
cmp r3,#12
beq 5f
ldrb r2,[r0,r3,lsl #4]!
cmp r2,#0
movne r0,#3
bne 4f
b 3f
2:
add r3,r3,#1
cmp r3,#12
blt 1b
b 5f
3:
ldrb r2,[r0,#1]
cmp r2,#0
movne r0,#2
bne 4f
ldrb r0,[r0,#2]
cmp r0,#0
movne r0,#1
4:
cmp r0,r1
movls r0,#1
bls 6f
5:
mov r0,#0
6:
bx lr
```

## `func_004E9FA8` — three-flag selector

This 100-byte leaf selects one of three single-bit flags in the word at entry
`r0` offset 52. Entry `r1` values zero, one, and two return bits 7, 6, and 5,
respectively, normalized to zero or one. Other selectors return zero after the
preserved diagnostic no-op sequence.

```asm
cmp r1,#0
push {r4,lr}
beq 1f
cmp r1,#1
beq 2f
cmp r1,#2
beq 3f
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
mov r0,#0
pop {r4,pc}
1:
ldr r0,[r0,#52]
and r0,r0,#128
lsr r0,r0,#7
pop {r4,pc}
2:
ldr r0,[r0,#52]
and r0,r0,#64
lsr r0,r0,#6
pop {r4,pc}
3:
ldr r0,[r0,#52]
and r0,r0,#32
lsr r0,r0,#5
pop {r4,pc}
```

## `func_004EAC54` — six packed three-bit-field selector

This 132-byte leaf extracts one of six descending three-bit fields from the
word at entry `r0` offset 4. Entry `r1` values zero through five select fields
whose high bits are 31, 28, 25, 22, 19, and 16. Other selectors return zero
after the preserved diagnostic no-op sequence.

```asm
cmp r1,#0
push {r4,lr}
ldreq r0,[r0,#4]
lsleq r0,r0,#23
beq 1f
cmp r1,#1
ldreq r0,[r0,#4]
lsleq r0,r0,#20
beq 1f
cmp r1,#2
ldreq r0,[r0,#4]
lsleq r0,r0,#17
beq 1f
cmp r1,#3
ldreq r0,[r0,#4]
lsleq r0,r0,#14
beq 1f
cmp r1,#4
ldreq r0,[r0,#4]
lsleq r0,r0,#11
beq 1f
cmp r1,#5
ldreq r0,[r0,#4]
lsleq r0,r0,#8
beq 1f
mov r2,#0
mov r1,r2
mov r0,r2
mov r0,r0
mov r0,#0
pop {r4,pc}
1:
lsr r0,r0,#29
pop {r4,pc}
```

Together with `func_004E9FA8`, this forms identity class
`mode_indexed_packed_selector_41`, parameterized by source-word offset,
selector count, field width, and descending bit position.

## `func_004F4C90` — unrolled double-precision polynomial evaluator

This 144-byte VFP leaf takes a coefficient array in entry `r0`, a positive
coefficient count in entry `r1`, and the evaluation argument in entry `d0`.
It evaluates the coefficient sequence in descending index order with
double-precision multiply-accumulate operations. The loop handles one
coefficient per iteration until the remaining index is one of zero, two, four,
or six; the tail is unrolled in two-coefficient groups. Entry counts outside
the expected positive domain are not validated.

```asm
sub r1,r1,#1
vmov.f64 d1,d0
add r2,r0,r1,lsl #3
vldr d0,[r2]
bics r2,r1,#6
beq 2f
1:
vmov.f64 d3,d0
sub r1,r1,#1
add r2,r0,r1,lsl #3
vldr d2,[r2]
bics r2,r1,#6
vmov.f64 d0,d2
vmla.f64 d0,d3,d1
bne 1b
2:
cmp r1,#2
beq 5f
cmp r1,#4
beq 4f
cmp r1,#6
bxne lr
vldr d2,[r0,#40]
vldr d3,[r0,#32]
vmla.f64 d2,d0,d1
vmov.f64 d0,d3
vmla.f64 d0,d2,d1
4:
vldr d2,[r0,#24]
vldr d3,[r0,#16]
vmla.f64 d2,d0,d1
vmov.f64 d0,d3
vmla.f64 d0,d2,d1
5:
vldr d2,[r0,#8]
vmov.f64 d3,d0
vldr d0,[r0]
vmla.f64 d2,d3,d1
vmla.f64 d0,d2,d1
bx lr
```

## `func_00505F2C` — descending word-buffer append

This 128-byte leaf writes entry `r1` into a buffer described by entry `r0`.
When offset 32 plus 64 exceeds offset 40 it returns three without modifying
the buffer. Otherwise it decrements the offset-40 cursor by four, resolves the
storage base either directly from offset 8 or relatively through the object at
offset 0, stores the word, increments the word count at offset 88, refreshes
the unsigned high-water spans at offsets 72 and 76, and returns zero.

```asm
ldr r2,[r0,#32]
ldr r12,[r0,#40]
add r2,r2,#64
cmp r2,r12
movgt r0,#3
bxgt lr
ldr r2,[r0,#8]
ldr r3,[r0]
cmp r2,#0
ldreq r2,[r3,#16]
push {r4}
ldr r4,[r0,#88]
addeq r2,r2,r3
sub r3,r12,#4
add r12,r4,#1
str r3,[r0,#40]
str r12,[r0,#88]
add r4,r0,#32
str r1,[r2,r3]
ldm r4,{r2,r4,r12}
ldr r1,[r0,#44]
ldr r3,[r0,#72]
sub r2,r2,r4
sub r1,r1,r12
cmp r3,r1
strcc r1,[r0,#72]
ldr r1,[r0,#76]
cmp r1,r2
strcc r2,[r0,#76]
pop {r4}
mov r0,#0
bx lr
```

## `func_0052B610` — bounded four-byte stream read

This 112-byte leaf reads from the stream descriptor at entry `r0`. The current
cursor is at offset 12; offsets 8 and 12 are initially loaded together, and
the object reached through offset 8 supplies a size at offset 16, a base
adjustment at offset 12, and a data pointer at offset 24. The descriptor cursor
is used for both the availability check and source address.

If at least four bytes remain, the helper reconstructs and stores one word at
entry `r1`, advances the cursor by four, and returns one. Otherwise it sets
the byte error flag at descriptor offset 4, clears the output word, and
returns zero.

```asm
push {r4}
ldrd r2,[r0,#8]
mov r12,#1
ldr r4,[r2,#16]
sub r4,r4,r3
cmp r4,#4
bcc 1f
ldr r12,[r2,#12]
ldr r2,[r2,#24]
add r2,r2,r12
add r2,r2,r3
ldr r3,[r2]
ldrb r2,[r2,#3]
bic r3,r3,#0xff000000
orr r2,r3,r2,lsl #24
str r2,[r1]
ldr r1,[r0,#12]
add r1,r1,#4
str r1,[r0,#12]
pop {r4}
mov r0,#1
bx lr
1:
mov r2,#0
strb r12,[r0,#4]
str r2,[r1]
pop {r4}
mov r0,r2
bx lr
```

## `func_0052B680` — bounded two-byte stream read

This 100-byte member of `bounded_fixed_width_stream_read_41` uses the same
descriptor and source-address calculation as `func_0052B610`. Its successful
path requires two bytes, loads and stores one halfword, advances the cursor by
two, and returns one. Failure sets the same error flag, clears one output
halfword, and returns zero.

```asm
push {r4}
ldrd r2,[r0,#8]
mov r12,#1
ldr r4,[r2,#16]
sub r4,r4,r3
cmp r4,#2
bcc 1f
ldr r12,[r2,#12]
ldr r2,[r2,#24]
add r2,r2,r12
add r2,r2,r3
ldrh r2,[r2]
strh r2,[r1]
ldr r1,[r0,#12]
add r1,r1,#2
str r1,[r0,#12]
pop {r4}
mov r0,#1
bx lr
1:
mov r2,#0
strb r12,[r0,#4]
strh r2,[r1]
pop {r4}
mov r0,r2
bx lr
```

The class parameters are payload width, availability threshold, output-store
width, and cursor advance. The four-byte member's explicit high-byte reload
and reconstruction are part of its exact schedule.

## `func_0053F700` — intrusive node unlink

This 120-byte leaf unlinks the node loaded through entry `r2`. The node's
previous and next links are at offsets 28 and 32. Entry `r0` receives the old
previous link, the neighboring nodes are reconnected when non-null, and both
links in the removed node are cleared. The owner at entry `r1` updates its
head at offset 4 or tail at offset 8 when either equals the removed node, then
decrements its count at offset 16.

```asm
push {r4}
ldr r3,[r2]
ldr r12,[r2]
ldr r3,[r3,#32]
ldr r12,[r12,#28]
cmp r3,#0
str r12,[r0]
strne r12,[r3,#28]
ldr r4,[r2]
mov r12,#0
str r12,[r4,#32]
ldr r4,[r0]
cmp r4,#0
strne r3,[r4,#32]
ldr r4,[r2]
str r12,[r4,#28]
ldr r12,[r1,#4]
ldr r4,[r2]
cmp r12,r4
ldreq r0,[r0]
streq r0,[r1,#4]
ldr r0,[r1,#8]
ldr r2,[r2]
cmp r0,r2
streq r3,[r1,#8]
ldr r0,[r1,#16]
sub r0,r0,#1
str r0,[r1,#16]
pop {r4}
bx lr
```

## `func_0056B030` — three-float endpoint-selecting interpolation

This 144-byte VFP leaf writes a three-float result through entry `r0`, with
entry `r1` as the lower endpoint, entry `r2` as the upper endpoint, and entry
`s0` as the interpolation parameter. When the parameter is ordered-less-than-
or-equal to the adjacent semantic threshold, it copies the lower endpoint.
When the parameter's raw word compares signed-greater-than-or-equal to the
single-precision unit encoding constructed by the immediate compare, it
copies the upper endpoint. Otherwise it evaluates each component as
`lower + (upper - lower) * parameter` in the displayed VFP order.

```asm
vldr s1,.Lblend_lower_endpoint_threshold_41
vcmpe.f32 s0,s1
vmrs APSR_nzcv,fpscr
bhi 1f
ldrd r2,[r1]
ldr r1,[r1,#8]
str r1,[r0,#8]
strd r2,[r0]
bx lr
1:
vmov r3,s0
cmp r3,#0x3f800000
blt 2f
ldm r2,{r1,r3}
ldr r2,[r2,#8]
str r2,[r0,#8]
stm r0,{r1,r3}
bx lr
2:
vldr s3,[r2]
vldr s6,[r1]
vldr s2,[r2,#4]
vldr s5,[r1,#4]
vldr s1,[r2,#8]
vldr s4,[r1,#8]
vsub.f32 s3,s3,s6
vsub.f32 s2,s2,s5
vsub.f32 s1,s1,s4
vmul.f32 s3,s3,s0
vmul.f32 s2,s2,s0
vmul.f32 s1,s1,s0
vadd.f32 s0,s6,s3
vadd.f32 s2,s5,s2
vadd.f32 s1,s4,s1
vstr s0,[r0]
vstr s2,[r0,#4]
vstr s1,[r0,#8]
bx lr
```

The body ends at relative offset 144. One four-byte-aligned word is adjacent
there and is loaded by the first instruction. Represent it only as the opaque
scalar identity `blend_lower_endpoint_threshold_41`; it is used as a VFP
single-precision lower-endpoint selection threshold and is not otherwise
interpreted or dereferenced by this helper.

## `func_0056E0BC` — ordered pair-tree lower bound

This 160-byte leaf searches the ordered tree described by entry `r1` and
writes a node pointer through entry `r0`. The sentinel is at descriptor offset
16; its root link is at sentinel offset 4. Node child links are at offsets 8
and 12, and each node's unsigned two-word key is at offsets 16 and 20. The
search key is the two-word pair at entry `r2`.

The traversal retains a node and follows its offset-8 child when the node key
is lexicographically greater than or equal to the search pair; otherwise it
follows offset 12. A final comparison rejects the retained node when the
search pair is strictly smaller. The output is then either the retained node
or the sentinel.

```asm
push {r4,r5,r6}
ldr r3,[r1,#16]
mov r4,r3
ldr r1,[r3,#4]
cmp r1,#0
ldrne r5,[r2]
beq 4f
1:
ldr r6,[r1,#16]
add r12,r1,#16
cmp r6,r5
bcc 3f
bhi 2f
ldr r12,[r12,#4]
ldr r6,[r2,#4]
cmp r12,r6
bcc 3f
2:
mov r3,r1
ldr r1,[r1,#8]
b 5f
3:
ldr r1,[r1,#12]
5:
cmp r1,#0
bne 1b
4:
cmp r3,r4
beq 6f
ldr r12,[r2]
ldr r5,[r3,#16]
add r1,r3,#16
cmp r12,r5
bcc 6f
bhi 7f
ldr r2,[r2,#4]
ldr r1,[r1,#4]
cmp r2,r1
bcs 7f
6:
str r4,[r0]
pop {r4,r5,r6}
bx lr
7:
str r3,[r0]
pop {r4,r5,r6}
bx lr
```

## Relocations, adjacency, and identity summary

- All 13 function bodies are call-free and have no body relocations.
- `func_0056B030` has one adjacent `R_ARM_ABS32` slot at body-relative offset
  144, named `blend_lower_endpoint_threshold_41`.
- The other 12 helpers have no adjacent words or symbolic data identities.
- `mode_indexed_packed_selector_41` contains `func_004E9FA8` and
  `func_004EAC54`.
- `bounded_fixed_width_stream_read_41` contains `func_0052B610` and
  `func_0052B680`.
