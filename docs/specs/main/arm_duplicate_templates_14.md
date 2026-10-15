# Probe-verified duplicate ARM templates 14

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated Ghidra 12.0.2 function inventory plus local
  control-flow and data-flow analysis of the private target executable.
- Probe toolchain: GNU Arm assembler and objcopy 2.45.1.20251203 from GCC Arm
  Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document records behavior
  and neutral ABI/code-generation facts. It contains no target bytes, encoded
  instruction words, extracted assets, private numeric addresses, or
  proprietary source.

The target inventory was grouped by complete-body digest after excluding every
function in an existing specification or manifest and every function reported
as an exact match. Candidates were 16 through 512 bytes and each group had an
aggregate payoff of at least 256 bytes. This bounded batch takes the next six
highest-yield groups after batch 13: 14 ARM functions and 2,640 code bytes.

## Four-word packet encoder

The following functions are ARM-state, 316 bytes, and byte-identical over the
complete inventoried body:

- `func_004BBFD4`
- `func_004BC130`

Inputs are a descriptor in `r0`, output cursor in `r1`, boolean-like value in
`r2`, and a value in `r3`. Descriptor bytes 1 through 5 and the float at offset
8 are observed. Four words are appended and the returned pointer is the first
byte after them.

Word 0 combines descriptor byte 3 shifted by one, a bit at position 2 when
descriptor byte 4 is 3, 4, or 5, a bit at position 5 when `r2` is nonzero,
descriptor bytes 2 and 1 shifted by 8 and 12, and a bit at position 24 when
descriptor byte 4 is 2 or 5. Word 1 is the per-copy `packet_header_a` identity.
Word 3 is the per-copy `packet_header_b` identity.

When descriptor byte 4 is 0 or 3, word 2 is zero. Otherwise the float is
converted by the exact VFP path below, except positive or negative zero and
values with an all-ones exponent leave its low conversion field zero. The
conversion uses six per-copy immutable identities named `float_zero`,
`float_bias`, `float_scale`, `integer_boundary`, `round_adjust`, and
`large_replacement`; their values are outside this code-only specification.
The converted integer is ORed with `r3 << 16` and descriptor byte 5 shifted by
24 to form word 2.

Exact semantic ARM template. Eight literal slots immediately follow the
inventoried interval, at relative byte offsets 316 through 344. Their required
physical order is `packet_header_a`, `packet_header_b`, `float_zero`,
`float_bias`, `float_scale`, `integer_boundary`, `round_adjust`, then
`large_replacement`. This is pool order, not instruction first-use order: the
integer-boundary load at body offset 172 reaches the sixth slot, while the
float-bias and float-scale loads at body offsets 176 and 180 reach the fourth
and fifth slots. The remaining literal-load body offsets are 96, 104, 136,
184, and 224 for the first, second, third, seventh, and eighth slots.

The two copies use distinct `packet_header_a` values and distinct
`packet_header_b` values. Each of the six conversion slots is value-equal
between the copies. `integer_boundary` and `round_adjust` are also value-equal
to each other, but remain two physically distinct slots because the exact
integer and VFP loads address different pool positions. Literal values are not
reproduced here.

```asm
push {r4, r5, r6}
ldrb r12, [r0, #4]
cmp r12, #3
cmpne r12, #4
beq .Lspecial
cmp r12, #5
movne r5, #0
beq .Lspecial
.Lpack:
ldrb r4, [r0, #3]
cmp r2, #0
lsl r5, r5, #2
movne r2, #2
moveq r2, #0
orr r4, r5, r4, lsl #1
ldrb r5, [r0, #2]
ldrb r6, [r0, #1]
cmp r12, #2
cmpne r12, #5
orr r2, r4, r2, lsl #4
orr r2, r2, r5, lsl #8
moveq r12, #1
movne r12, #0
orr r2, r2, r6, lsl #12
orr r12, r2, r12, lsl #24
ldr r2, <packet_header_a>
str r12, [r1], #4
ldr r4, <packet_header_b>
str r2, [r1], #4
ldrb r12, [r0, #4]
mov r2, #0
cmp r12, #3
cmpne r12, #0
beq .Lzero_payload
vldr s1, [r0, #8]
vldr s2, <float_zero>
vmov r12, s1
vcmp.f32 s1, s2
vmrs APSR_nzcv, fpscr
beq .Lemit
lsl r12, r12, #1
mov r5, #255
cmp r5, r12, lsr #24
beq .Lemit
ldr r12, <integer_boundary>
vldr s0, <float_bias>
vldr s4, <float_scale>
vldr s3, <round_adjust>
vadd.f32 s0, s1, s0
vmul.f32 s0, s0, s4
vcmpe.f32 s2, s0
vmrs APSR_nzcv, fpscr
vmovgt.f32 s0, s2
bgt .Lround_up
vmov r2, s0
cmp r2, #0x46000000
vmovlt r2, s0
vldrge s0, <large_replacement>
cmplt r2, r12
blt .Lround_up
vsub.f32 s0, s0, s3
vcvt.u32.f32 s0, s0
vmov r2, s0
b .Lemit
.Lspecial:
mov r5, #1
b .Lpack
.Lround_up:
vadd.f32 s0, s0, s3
vcvt.u32.f32 s0, s0
vmov r2, s0
.Lemit:
ldrb r0, [r0, #5]
orr r2, r2, r3, lsl #16
orr r0, r2, r0, lsl #24
stm r1, {r0, r4}
add r0, r1, #8
pop {r4, r5, r6}
bx lr
.Lzero_payload:
stm r1, {r2, r4}
add r0, r1, #8
pop {r4, r5, r6}
bx lr
```

## Four-byte vector reserve

These ARM-state functions are 224 bytes and identical:

- `func_00540D64`
- `func_0054108C`

The object in `r0` has allocator, begin, end, and packed capacity/mode fields
at offsets 0, 4, 8, and 12. The requested element capacity is in `r1`. The low
30 bits of the packed field are capacity and the upper two bits are mode.

Return one immediately when current capacity is at least the request. Growth
requires a non-null allocator and mode `01`; otherwise return zero. Allocate
`request * 4` bytes aligned to 32 through allocator vtable slot 8. On failure,
return zero. Copy the old half-open range one word at a time, preserving the
template's conditional destination load/store, and free a non-null old buffer
through allocator vtable slot 12. Install the new begin and end, preserve the
mode bits, replace capacity with the request, and return one.

```asm
push {r4, r5, r6, r7, r8, lr}
mov r6, r1
mov r4, r0
ldr r1, [r0, #12]
bic r0, r1, #0xc0000000
cmp r0, r6
movge r0, #1
bge .Lreturn
ldr r0, [r4]
cmp r0, #0
beq .Lfail
and r1, r1, #0xc0000000
cmp r1, #0x40000000
beq .Lallocate
.Lfail:
mov r0, #0
.Lreturn:
pop {r4, r5, r6, r7, r8, pc}
.Lallocate:
ldr r1, [r0]
mov r2, #32
ldr r3, [r1, #8]
lsl r1, r6, #2
blx r3
movs r5, r0
beq .Lreturn
add r0, r4, #4
mov r7, #0
ldm r0, {r0, r2}
cmp r0, r2
movne r1, r5
beq .Lcopy_done
.Lcopy:
cmp r1, #0
ldrne r12, [r0]
add r0, r0, #4
strne r12, [r1]
cmp r0, r2
add r1, r1, #4
bne .Lcopy
ldr r0, [r4, #8]
ldr r1, [r4, #4]
sub r0, r0, r1
asr r7, r0, #2
.Lcopy_done:
ldr r1, [r4, #4]
cmp r1, #0
beq .Linstall
ldr r0, [r4]
ldr r2, [r0]
ldr r2, [r2, #12]
blx r2
.Linstall:
add r0, r5, r7, lsl #2
str r0, [r4, #8]
str r5, [r4, #4]
ldr r0, [r4, #12]
and r0, r0, #0xc0000000
orr r0, r0, r6
str r0, [r4, #12]
mov r0, #1
pop {r4, r5, r6, r7, r8, pc}
```

## Indexed variable-record decoder

These ARM-state functions are 220 bytes and identical:

- `func_00497E48`
- `func_00498DA0`

The inputs are an owner in `r0`, signed record index in `r1`, three writable
16-bit output slots in `r2`, `r3`, and the first stacked argument, followed by
two writable pointer slots as the next stacked arguments. The owner's table
base is at offset 24. A signed 16-bit offset table selects the record start;
the next unsigned 16-bit offset selects its end. An index below zero or a
record shorter than four bytes clears all five outputs.

For a valid record, zero-extend its first three bytes into the three 16-bit
outputs. The first pointer output is record offset 4 when the first decoded
count is positive, otherwise null. The second pointer output is record offset
`4 + 2 * first_count` when the second decoded count is positive, otherwise
null. The outputs must be valid writable storage. Return-register contents are
incidental; consumers use the five outputs.

```asm
push {r4, r5, r6, r7, r8, r9, r10, lr}
cmp r1, #0
mov r4, r2
add r9, sp, #36
ldr r8, [sp, #32]
ldm r9, {r5, r6}
mov r7, r3
mov r9, #0
blt .Lnegative
ldr r0, [r0, #24]
mov r2, #2
add r2, r2, r1, lsl #1
add r1, r0, r1, lsl #1
ldrh r2, [r0, r2]
ldrsh r1, [r1]
sub r2, r2, r1
sxth r2, r2
subs r2, r2, #4
bmi .Linvalid
ldrb r1, [r0, r1]!
strh r1, [r4]
ldrb r1, [r0, #1]
strh r1, [r7]
ldrb r1, [r0, #2]
strh r1, [r8]
ldrsh r1, [r4]
cmp r1, #0
addgt r1, r0, #4
strgt r1, [r5]
strle r9, [r5]
ldrsh r1, [r3]
cmp r1, #0
strle r9, [r6]
ble .Lreturn
ldrsh r1, [r4]
add r0, r0, r1, lsl #1
add r0, r0, #4
str r0, [r6]
.Lreturn:
pop {r4, r5, r6, r7, r8, r9, r10, pc}
.Linvalid:
mov r2, #0
mov r1, r2
mov r0, r2
mov r0, r0
strh r9, [r4]
strh r9, [r7]
strh r9, [r8]
str r9, [r5]
str r9, [r6]
pop {r4, r5, r6, r7, r8, r9, r10, pc}
.Lnegative:
strh r9, [r2]
strh r9, [r3]
strh r9, [r8]
str r9, [r5]
str r9, [r6]
pop {r4, r5, r6, r7, r8, r9, r10, pc}
```

## Tagged relative-record lookup

The following ARM-state functions are 100 bytes and identical over their
inventoried intervals:

- `func_0016B518`
- `func_0016B5EC`
- `func_0018CDFC`
- `func_004C2204`

Each copy has its own `record_tag` literal identity immediately after the
function. The object has an unsigned 16-bit record count at offset 16 and an
array of 12-byte records at offset 20. Scan records in increasing order until
the first 16-bit field equals the named tag. Load its relative offset at record
offset 4; return object base plus that offset when nonzero, or null otherwise.
Return null for an empty list or no match. Preserve the exact flag-setting
address calculation and conditional load/test/add.

```asm
push {r4, r5}
ldrh r3, [r0, #16]
ldr r12, <record_tag>
mov r5, #0
cmp r3, #0
add r2, r0, #20
mov r1, r5
ble .Lreturn
.Lscan:
add r4, r1, r1, lsl #1
add r4, r2, r4, lsl #2
ldrh r4, [r4]
cmp r4, r12
bne .Lnext
add r1, r1, r1, lsl #1
adds r1, r2, r1, lsl #2
ldrne r1, [r1, #4]
cmpne r1, #0
addne r5, r1, r0
.Lreturn:
mov r0, r5
pop {r4, r5}
bx lr
.Lnext:
add r1, r1, #1
cmp r3, r1
bgt .Lscan
b .Lreturn
```

## Repeated 364-byte record initializer

These ARM-state functions are 180 bytes and identical:

- `func_0049D0B8`
- `func_004A416C`

The inputs are an ignored value in `r0`, signed record count in `r1`, and
destination in `r2`. A nonpositive count performs no writes. For a positive
count the routine first replaces `r0` with zero. For each record, whose stride
is 364 bytes, write zero to word offsets 0 through 36. For indices 0 through 7,
also write zero to the nine word arrays beginning at
offsets 40, 72, 104, 168, 200, 232, 264, 296, and 328. Write unsigned
halfword all-ones to the two eight-element arrays at offsets 136 and 152 and
to the final halfword at offset 360. Both loop counters are narrowed to signed
16 bits after increment, exactly as shown.

```asm
cmp r1, #0
push {r4, r5, r6, r7}
movgt r0, #0
mov r7, #0
mvngt r5, #0
ble .Lreturn
.Lrecord:
mov r3, #91
mov r4, #0
smulbb r3, r7, r3
str r0, [r2, r3, lsl #2]
add r3, r2, r3, lsl #2
str r0, [r3, #4]
str r0, [r3, #8]
str r0, [r3, #24]
str r0, [r3, #12]
str r0, [r3, #28]
str r0, [r3, #16]
str r0, [r3, #32]
str r0, [r3, #20]
str r0, [r3, #36]
.Linner:
add r12, r3, r4, lsl #2
add r6, r3, r4, lsl #1
str r0, [r12, #40]
str r0, [r12, #72]
str r0, [r12, #104]
strh r5, [r6, #136]
strh r5, [r6, #152]
str r0, [r12, #168]
str r0, [r12, #200]
add r4, r4, #1
str r0, [r12, #232]
str r0, [r12, #264]
sxth r4, r4
str r0, [r12, #296]
cmp r4, #8
str r0, [r12, #328]
blt .Linner
add r12, r7, #1
add r3, r3, #256
sxth r7, r12
cmp r7, r1
strh r5, [r3, #104]
blt .Lrecord
.Lreturn:
pop {r4, r5, r6, r7}
bx lr
```

## Typed selector lookup

These ARM-state functions are 180 bytes and identical:

- `func_004C1E58`
- `func_004C2120`

The object in `r0` starts with a 16-bit representation type and has a relative
section offset at offset 4. The selector is in `r1`; all successful stored
relative offsets are rebased against the section.

- Type `0x6000`: return the relative word at section offset 4 rebased to the
  section.
- Type `0x6001`: section word 0 is a count, followed by count key bytes. Find
  the first key greater than or equal to the selector. The entry table begins
  after the keys rounded up to four bytes, has eight-byte entries, and stores
  the result relative word at entry offset 4. Return null if there are no keys
  or none qualifies.
- Type `0x6002`: section bytes 0 and 1 are an inclusive selector range. Return
  the relative word at offset 8 in the eight-byte entry selected by
  `selector - low`, or null outside the range.
- Other types return null.

```asm
ldr r3, [r0, #4]
ldrh r12, [r0]
mov r2, r0
add r2, r2, r3
cmp r12, #0x6000
mov r0, #0
ldreq r0, [r2, #4]
addeq r0, r0, r2
beq .Lreturn
sub r3, r12, #0x6000
subs r3, r3, #1
beq .Ltype1
cmp r3, #1
bne .Lreturn
ldrb r0, [r2]
cmp r0, r1
ldrbls r3, [r2, #1]
cmpls r1, r3
bhi .Lnull
b .Ltype2_hit
.Ltype1:
ldr r12, [r2]
mov r0, #0
cmp r12, #0
bls .Lnull
.Lscan:
add r3, r2, r0
ldrb r3, [r3, #4]
cmp r3, r1
bcc .Lnext
add r1, r12, #3
bic r1, r1, #3
add r0, r1, r0, lsl #3
add r0, r0, #4
add r0, r0, r2
ldr r0, [r0, #4]
b .Ladd_base
.Lnext:
add r0, r0, #1
cmp r0, r12
bcc .Lscan
.Lnull:
mov r0, #0
.Lreturn:
bx lr
.Ltype2_hit:
sub r0, r1, r0
add r0, r2, r0, lsl #3
ldr r0, [r0, #8]
.Ladd_base:
add r0, r0, r2
bx lr
```

## Probe result

A neutral symbolic ARM assembly probe instantiated all six templates and every
listed function. The packet and tagged-record probes used zero-valued
placeholder definitions only to establish the documented PC-relative named
literal layout; those values lie outside the compared function intervals.
All 14 complete probe bodies matched their corresponding complete target
intervals exactly. The scan independently verified ARM mode, size,
group-wide complete-body identity, non-overlap with prior specifications and
manifests, and non-exact status in the report used for selection.

No clean-room implementation is included in this analysis document.
