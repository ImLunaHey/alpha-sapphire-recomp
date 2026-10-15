# Probe-verified duplicate ARM templates 16

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated Ghidra 12.0.2 inventory plus local control-flow,
  data-flow, complete-body grouping, and post-body literal-layout analysis of
  the private target executable.
- Probe toolchain: GNU Arm assembler and objcopy 2.45.1.20251203 from GCC Arm
  Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, literal values, extracted assets,
  private numeric addresses, implementation source, or proprietary source.

Every committed and current specification/manifest function and every exact
function in the current report was excluded before grouping. This bounded
batch takes the five highest aggregate-byte remaining complete-body groups:
11 ARM functions and 2,488 code bytes.

## Packed fixed-point dual-output transform

These ARM-state functions are 680 bytes and identical over their complete
inventoried bodies:

- `func_001A3B28`
- `func_001A42D4`

Inputs are packed signed-halfword source windows in `r0`, two writable signed
16-bit output arrays in `r1` and `r2`, and signed output count in `r3`. A
nonpositive count returns without reading the source or coefficient table. For
each output index, the source window advances by 16 bytes. The routine reads
31 consecutive packed words from that window, combines their low and high
signed halfwords with the low and high signed halfwords of eight coefficient
words using ARM signed halfword multiply-accumulate operations, arithmetically
shifts each final accumulator sum right by 15, and stores one halfword to each
output array. The exact lane selection, source symmetry, accumulator wrapping,
and register/spill order are fixed by the template below.

Each function has one pointer-sized `coefficient_table` literal slot
immediately after its body at relative byte offset 680. The two table pointer
identities are distinct; their table contents and pointer values are outside
this code-only specification. The only PC-relative load begins at body offset
20 and addresses that slot. There are no direct calls or relocatable calls.

Exact semantic ARM template:

```asm
push {r4, r5, r6, r7, r8, r9, r10, r11, lr}
cmp r3, #0
sub sp, sp, #16
mov r8, #0
ble .Ldone
.Louter:
ldr r5, <coefficient_table>
add r12, r0, r8, lsl #4
add r4, r12, #120
ldr r6, [r12], #4
ldr r7, [r5]
ldr r10, [r5]
ldr lr, [r5]
smulbb r11, r6, r7
smultb r9, r6, r7
ldr r6, [r4], #-4
smulbb r7, r6, r7
smultb r6, r6, r10
ldr r10, [r12], #4
smlabt r11, r10, lr, r11
smlatt r9, r10, lr, r9
ldr r10, [r4], #-4
smlabt r7, r10, lr, r7
str r7, [sp]
ldr lr, [r5]
ldr r7, [r12], #4
vldr s0, [r4]
smlatt lr, r10, lr, r6
ldr r6, [r5, #4]
smlabb r10, r7, r6, r11
smlatb r11, r7, r6, r9
vmov r9, s0
ldr r7, [sp]
smlabb r9, r9, r6, r7
str r9, [sp]
ldr r7, [r12], #4
vmov r9, s0
smlabt r10, r7, r6, r10
smlatt r11, r7, r6, r11
ldr r7, [r4, #-4]
smlatb lr, r9, r6, lr
ldr r9, [sp]
smlatt lr, r7, r6, lr
smlabt r9, r7, r6, r9
ldr r6, [r5, #8]!
ldr r7, [r12], #4
smlabb r10, r7, r6, r10
smlatb r7, r7, r6, r11
str r7, [sp]
ldr r7, [r4, #-8]
smlabb r9, r7, r6, r9
smlatb r7, r7, r6, lr
str r7, [sp, #4]
ldr lr, [r12], #4
ldr r7, [sp]
vldr s1, [r12]
smlabt r11, lr, r6, r10
smlatt r10, lr, r6, r7
ldr r7, [r4, #-12]!
smlabt lr, r7, r6, r9
mov r9, r7
ldr r7, [sp, #4]
smlatt r6, r9, r6, r7
vmov r7, s1
vmov s0, r6
ldr r6, [r5, #4]
smlabb r7, r7, r6, r11
str r7, [sp]
vmov r7, s1
smlatb r11, r7, r6, r10
ldr r10, [r4, #-4]
ldr r7, [sp]
smlabb r9, r10, r6, lr
vmov lr, s0
str r9, [sp, #4]
smlatb r9, r10, r6, lr
str r9, [sp, #8]
ldr r10, [r12, #4]
ldr r9, [sp, #4]
smlabt lr, r10, r6, r7
smlatt r11, r10, r6, r11
ldr r7, [r4, #-8]!
smlabt r10, r7, r6, r9
ldr r9, [sp, #8]
smlatt r6, r7, r6, r9
str r6, [sp, #12]
ldr r9, [r12, #8]!
ldr r6, [r5, #8]
add r7, r12, #4
str r6, [sp]
smlabb lr, r9, r6, lr
smlatb r6, r9, r6, r11
str r6, [sp, #8]
ldr r6, [sp]
ldr r9, [r4, #-4]!
sub r4, r4, #4
smlabb r12, r9, r6, r10
str r12, [sp, #4]
ldr r12, [sp, #12]
vldr s0, [r4]
smlatb r11, r9, r6, r12
ldr r12, [r7], #4
ldr r9, [sp, #8]
smlabt r10, r12, r6, lr
smlatt lr, r12, r6, r9
vmov r9, s0
ldr r12, [sp, #4]
smlabt r9, r9, r6, r12
vmov r12, s0
smlatt r11, r12, r6, r11
ldr r12, [r5, #12]!
ldr r6, [r7], #4
smlatb lr, r6, r12, lr
smlabb r10, r6, r12, r10
str lr, [sp]
ldr r6, [r4, #-4]
smlatb lr, r6, r12, r11
smlabb r9, r6, r12, r9
str lr, [sp, #4]
ldr r6, [r7], #4
ldr lr, [sp]
smlabt r10, r6, r12, r10
smlatt r11, r6, r12, lr
ldr r6, [r4, #-8]!
ldr lr, [sp, #4]
smlabt r9, r6, r12, r9
smlatt r12, r6, r12, lr
ldr lr, [r7]
vmov s0, r12
ldr r12, [r5, #4]
str r12, [sp]
smlabb r12, lr, r12, r10
str r12, [sp, #4]
ldr r12, [sp]
smlatb r10, lr, r12, r11
ldr lr, [r4, #-4]
smlabb r11, lr, r12, r9
vmov r9, s0
smlatb r6, lr, r12, r9
str r6, [sp, #8]
ldr r9, [r7, #4]
ldr r6, [sp, #4]
ldr r5, [r5, #8]
smlabt lr, r9, r12, r6
smlatt r10, r9, r12, r10
ldr r9, [r4, #-8]
ldr r6, [sp, #8]
ldr r4, [r4, #-12]
smlabt r11, r9, r12, r11
smlatt r6, r9, r12, r6
ldr r12, [r7, #8]
ldr r7, [r7, #12]
smlatb r6, r4, r5, r6
smlabb r9, r12, r5, lr
smlatb r10, r12, r5, r10
smlabb r12, r4, r5, r11
smlabt r4, r7, r5, r9
smlatt r5, r7, r5, r10
add r9, r1, r8, lsl #1
add r12, r12, r4
add r7, r2, r8, lsl #1
asr r12, r12, #15
strh r12, [r9]
add r12, r5, r6
add r8, r8, #1
asr r12, r12, #15
cmp r3, r8
strh r12, [r7]
bgt .Louter
.Ldone:
add sp, sp, #16
pop {r4, r5, r6, r7, r8, r9, r10, r11, pc}
```

## Allocated 32-byte object initializer

These ARM-state functions are 96 bytes and identical:

- `func_00305DFC`
- `func_003094A4`
- `func_0030A698`

Call allocator vtable slot 8 with allocator `r0`, byte size 32, and alignment
4. Return null unchanged on allocation failure. Otherwise initialize the
32-byte object: type identity at offset 0, allocator at offset 4, zero bytes at
8 and 9, the named initial float at offsets 12, 16, 20, and 24, and input `r1`
at offset 28. Return the object pointer.

Two literal slots immediately follow the body: `initial_float` at relative
offset 96 and `type_identity` at 100. The `initial_float` value is shared by
all three functions. The three `type_identity` values are mutually distinct.
Literal loads begin at body offsets 56 and 68 respectively.

```asm
push {r4, r5, r6, lr}
mov r4, r0
ldr r0, [r0]
mov r5, r1
mov r2, #4
mov r1, #32
ldr r3, [r0, #8]
mov r0, r4
blx r3
cmp r0, #0
beq .Lreturn
mov r1, #0
str r4, [r0, #4]
strb r1, [r0, #8]
vldr s0, <initial_float>
strb r1, [r0, #9]
vstr s0, [r0, #12]
ldr r1, <type_identity>
vstr s0, [r0, #16]
vstr s0, [r0, #20]
vstr s0, [r0, #24]
str r1, [r0]
str r5, [r0, #28]
.Lreturn:
pop {r4, r5, r6, pc}
```

## Type-chain attachment wrapper

These ARM-state functions are 140 bytes and identical:

- `func_0032B348`
- `func_0032DD34`

Set output wrapper word 0 to null. If `r1` or its pointee is null, return the
wrapper. Otherwise call pointee vtable slot 0 once to obtain the head of a
type-identity chain. Compare each chain node to the named `type_identity`,
following word 0 on mismatch without making another call. If absent, return
the empty wrapper. If present, store the pointee in wrapper word 0, call its
vtable slot 24, conditionally call vtable slot 28 when the first call returns
nonzero, then store the wrapper address at pointee offset 276. Return the
wrapper in every path.

One per-function `type_identity` literal slot follows the body at relative
offset 140. The two identity values are distinct. Its conditional PC-relative
load begins at body offset 28.

```asm
push {r4, r5, r6, lr}
mov r4, r0
mov r0, #0
cmp r1, #0
str r0, [r4]
ldrne r5, [r1]
cmpne r5, #0
ldrne r6, <type_identity>
beq .Lreturn
.Linitial_type:
ldr r0, [r5]
ldr r1, [r0]
mov r0, r5
blx r1
.Lcompare:
cmp r0, r6
bne .Lnext_type
movs r0, r5
beq .Lreturn
str r0, [r4]
ldr r1, [r0]
ldr r1, [r1, #24]
blx r1
cmp r0, #0
beq .Lbackref
ldr r0, [r4]
ldr r1, [r0]
ldr r1, [r1, #28]
blx r1
.Lbackref:
ldr r1, [r4]
str r4, [r1, #276]
.Lreturn:
mov r0, r4
pop {r4, r5, r6, pc}
.Lnext_type:
ldr r0, [r0]
cmp r0, #0
bne .Lcompare
b .Lreturn
```

## Primary-or-secondary record lookup

These ARM-state functions are 140 bytes and identical:

- `func_0045A71C`
- `func_004E7FF4`

Inputs are base/index value `r0`, requested unsigned identity `r1`, and an
optional writable classification word in `r2`. Reject the named empty identity
immediately. Load the primary unsigned 16-bit identity through
`primary_table + r0`. On a primary match, store one to the optional output and
return `r0 + 812`. Otherwise scan 30 records beginning at `r0 + 1600`, stride
992, comparing the unsigned 16-bit record identity at offset 2. Ignore records
whose identity is the empty identity. On a secondary match, store zero to the
optional output and return the record; otherwise return null. Preserve the
otherwise redundant record-pointer null test.

Two literal slots follow the body: `empty_identity` at relative offset 140 and
`primary_table` at 144. Both values are shared between the two functions. The
loads begin at body offsets 0 and 16 respectively.

```asm
ldr r3, <empty_identity>
push {r4, r5}
cmp r1, r3
beq .Lnull
ldr r12, <primary_table>
ldrh r12, [r12, r0]
cmp r12, r1
bne .Lscan_setup
cmp r2, #0
movne r1, #1
strne r1, [r2]
pop {r4, r5}
add r0, r0, #812
bx lr
.Lscan_setup:
mov r12, #0
add r0, r0, #1600
mov r5, r12
.Lscan:
ldrh r4, [r0, #2]
cmp r4, r3
beq .Lnext
cmp r4, r1
bne .Lnext
cmp r0, #0
beq .Lnull
cmp r2, #0
strne r5, [r2]
pop {r4, r5}
bx lr
.Lnext:
add r12, r12, #1
cmp r12, #30
add r0, r0, #992
bcc .Lscan
.Lnull:
pop {r4, r5}
mov r0, #0
bx lr
```

## Repeated 172-byte record initializer

These ARM-state functions are 140 bytes and identical:

- `func_004934B8`
- `func_00496F40`

Inputs are an ignored value in `r0`, signed count in `r1`, and destination in
`r2`. A nonpositive count performs no writes. For a positive count, replace
`r0` with zero. Each record is 172 bytes. Zero its eleven leading words at
offsets 0 through 40, then zero four arrays of eight words beginning at offsets
44, 76, 108, and 140. Both loop counters are narrowed to signed 16 bits after
increment. This template has no literal slots or calls.

```asm
cmp r1, #0
push {r4, r5, r6}
mov r5, #0
movgt r0, #0
ble .Lreturn
.Lrecord:
mov r3, #43
smulbb r12, r5, r3
mov r3, #0
add r4, r2, r12, lsl #2
str r0, [r2, r12, lsl #2]
str r0, [r4, #8]
str r0, [r4, #12]
str r0, [r4, #28]
str r0, [r4, #16]
str r0, [r4, #32]
str r0, [r4, #20]
str r0, [r4, #36]
str r0, [r4, #24]
str r0, [r4, #40]
str r0, [r4, #4]
.Linner:
add r12, r4, r3, lsl #2
add r6, r3, #1
str r0, [r12, #44]
str r0, [r12, #76]
sxth r3, r6
str r0, [r12, #108]
cmp r3, #8
str r0, [r12, #140]
blt .Linner
add r3, r5, #1
sxth r5, r3
cmp r5, r1
blt .Lrecord
.Lreturn:
pop {r4, r5, r6}
bx lr
```

## Probe result

A neutral symbolic ARM assembly probe instantiated every listed function.
Zero-valued placeholders were placed only in the documented post-body literal
slots to establish their PC-relative layout; placeholder values are outside
the compared body intervals. All 11 complete probe bodies matched their target
intervals exactly. Independent checks confirmed ARM mode, stated body sizes,
complete-body equality within each group, literal-slot offsets and equality
classes, exclusion from all prior/current manifests, and non-exact status in
the report used for selection.

No clean-room implementation is included in this analysis document.
