# Probe-verified ARM structured leaf helpers batch 17

## Scope and provenance

This clean-room specification covers six previously unspecified, unmatched
ARM-state leaf functions totaling 968 bytes. It uses only public ARM,
AAPCS32, VFP, IEEE-754, and ordinary array/record semantics. It contains no
raw instruction encodings, extracted data, private addresses, or proprietary
source.

Every complete body below was independently assembled for the project's ARM
and VFP target and compared over the full symbol extent. All six probes were
byte-exact. None calls another function or branches outside its own body.

## Three-by-four matrix times four-vector

`func_002F54D0` (124 bytes) ignores entry `r0`. It takes destination `r1`, a
row-major 3-by-4 float matrix at `r2`, and a four-float vector at `r3`.
It writes the three matrix/vector dot products at destination offsets 0, 4,
and 8, then copies vector component 3 to destination offset 12. Each dot
product starts with column zero and uses three fused `vmla.f32` operations in
column order. All matrix and vector values needed for a result are loaded
before the output stores, so exact destination/input aliasing works.

```asm
vldmia r3, {s1-s3}
vldr s5, [r2]
vldr s4, [r2, #16]
vldr s15, [r2, #32]
vmul.f32 s5, s5, s1
vmul.f32 s4, s4, s1
vmul.f32 s1, s15, s1
vldr s14, [r2, #4]
vldr s13, [r2, #20]
vldr s12, [r2, #36]
vldr s11, [r2, #8]
vldr s10, [r2, #24]
vldr s9, [r2, #40]
vldr s8, [r2, #12]
vmla.f32 s5, s14, s2
vmla.f32 s4, s13, s2
vmla.f32 s1, s12, s2
vldr s0, [r3, #12]
vldr s6, [r2, #28]
vldr s7, [r2, #44]
vmla.f32 s5, s11, s3
vmla.f32 s4, s10, s3
vmla.f32 s1, s9, s3
vmla.f32 s5, s8, s0
vmla.f32 s4, s6, s0
vmla.f32 s1, s7, s0
vstr s5, [r1]
vstr s4, [r1, #4]
vstr s1, [r1, #8]
vstr s0, [r1, #12]
bx lr
```

## Guarded state-entry synchronizer

`func_002FC820` (348 bytes) takes state `r0` and unsigned selector `r1`.
It reads an entry pointer through `state[+144][selector]`; if that pointer is
null, or selector already equals the word at state offset 156, it returns
without touching the stack. Otherwise it stores the selector and synchronizes
the following fields:

- Entry pointer +12 is proposed for state +0. When it differs, dirty byte
  +169 becomes 1. A non-null proposal is accepted only when its pointer at +8
  leads to a nonzero byte at +180; otherwise null is stored.
- Entry pointer +16 similarly controls state +4 and dirty byte +171.
- Entry offsets +24 and +28 form a half-open array of pointer slots. State
  count +160 is reset to zero. On each visited slot dirty byte +170 is set.
  Traversal stops if the count equals the low 30 bits of state word +20.
  A slot is copied bit-for-bit to the array at state pointer +12 only if the
  pointed object's `+8 -> byte +180` test is nonzero; count then increments.
- Entry offsets +68 and +72 form a second half-open pointer-slot array. State
  count +164 is reset. Dirty byte +168 is set for each visited slot, traversal
  stops at eight accepted elements, and accepted pointer words are copied to
  the array at state pointer +36.

The function preserves `r4-r7` with a four-register push/pop. The exact
control-flow template is:

```asm
ldr r2, [r0, #144]
ldr r2, [r2, r1, lsl #2]
cmp r2, #0
ldrne r3, [r0, #156]
cmpne r3, r1
bxeq lr
push {r4-r7}
mov r5, #1
str r1, [r0, #156]
ldr r1, [r0]
ldr r3, [r2, #12]
cmp r1, r3
beq first_done
cmp r3, #0
strb r5, [r0, #169]
beq first_null
ldr r1, [r3, #8]
ldrb r1, [r1, #180]
cmp r1, #0
bne first_store
first_null: mov r3, #0
first_store: str r3, [r0]
first_done:
ldr r3, [r2, #16]
ldr r1, [r0, #4]
cmp r1, r3
beq second_done
cmp r3, #0
strb r5, [r0, #171]
beq second_null
ldr r1, [r3, #8]
ldrb r1, [r1, #180]
cmp r1, #0
bne second_store
second_null: mov r3, #0
second_store: str r3, [r0, #4]
second_done:
mov r7, #0
add r3, r2, #24
str r7, [r0, #160]
ldm r3, {r3, r6}
ldr r1, [r0, #20]
cmp r3, r6
bic r4, r1, #0xc0000000
beq first_range_done
first_range_loop:
ldr r12, [r0, #160]
strb r5, [r0, #170]
cmp r12, r4
beq first_range_done
ldr r1, [r3]
ldr r1, [r1, #8]
ldrb r1, [r1, #180]
cmp r1, #0
beq first_next
ldr r1, [r0, #12]
vldr s0, [r3]
add r1, r1, r12, lsl #2
vstr s0, [r1]
ldr r1, [r0, #160]
add r1, r1, #1
str r1, [r0, #160]
first_next:
add r3, r3, #4
cmp r3, r6
bne first_range_loop
first_range_done:
add r2, r2, #68
str r7, [r0, #164]
ldm r2, {r3, r12}
cmp r3, r12
beq second_range_done
second_range_loop:
ldr r2, [r0, #164]
strb r5, [r0, #168]
cmp r2, #8
beq second_range_done
ldr r1, [r3]
ldr r1, [r1, #8]
ldrb r1, [r1, #180]
cmp r1, #0
beq second_next
ldr r1, [r0, #36]
ldr r4, [r3]
str r4, [r1, r2, lsl #2]
ldr r1, [r0, #164]
add r1, r1, #1
str r1, [r0, #164]
second_next:
add r3, r3, #4
cmp r3, r12
bne second_range_loop
second_range_done:
pop {r4-r7}
bx lr
```

The early equal-pointer paths deliberately skip even the redundant store and
dirty-byte update. Preserve that branch shape.

## Thirty-two-byte record block update

`func_00329750` (160 bytes) takes a container at `r0`, source records at `r1`,
and count `r2`. Container pointer +4 addresses 32-byte destination records;
byte +1 is updated to `max(old_byte, count)` using unsigned comparison. A zero
count returns immediately without a stack frame. For nonzero count it copies
exactly `count` consecutive 32-byte records starting at destination index
zero, not at the prior byte count. It preserves `r4-r9`.

Each record is copied as four ordered 8-byte groups: VFP words 0/1, VFP words
2/3, core word plus VFP word 4/5, then two core words 6/7. The loop is
bottom-tested; nonzero count is the required contract.

```asm
ldrb r3, [r0, #1]
cmp r3, r2
movcc r3, r2
cmp r2, #0
strb r3, [r0, #1]
movne r3, #0
bxeq lr
push {r4-r9}
mov r5, #8
mov r12, #16
mov r4, #24
1:
ldr r6, [r0, #4]
add r7, r5, r3, lsl #5
vldmia r1, {s0-s1}
add r8, r6, r3, lsl #5
add r6, r12, r3, lsl #5
add r9, r4, r3, lsl #5
vstmia r8, {s0-s1}
subs r2, r2, #1
ldr r8, [r0, #4]
add r3, r3, #1
add r7, r7, r8
add r8, r1, #8
vldmia r8, {s0-s1}
vstmia r7, {s0-s1}
ldr r8, [r0, #4]
ldr r7, [r1, #16]
vldr s0, [r1, #20]
add r6, r6, r8
str r7, [r6]
vstr s0, [r6, #4]
add r7, r1, #24
ldr r6, [r0, #4]
ldm r7, {r7, r8}
add r1, r1, #32
add r6, r6, r9
stm r6, {r7, r8}
bne 1b
pop {r4-r9}
bx lr
```

## Single thirty-two-byte indexed record copy

`func_003299E8` (120 bytes) copies one 32-byte record from `r2` to index `r1`
of the array at container `r0` offset 4. The implementation intentionally
reloads the array base for its four 8-byte groups and preserves `r4-r7`:

```asm
push {r4-r7}
mov r6, #8
ldr r5, [r0, #4]
ldr r3, [r2]
vldr s0, [r2, #4]
add r7, r5, r1, lsl #5
mov r4, #16
str r3, [r7]
add r5, r6, r1, lsl #5
add r3, r4, r1, lsl #5
vstr s0, [r7, #4]
ldr r4, [r0, #4]
mov r12, #24
add r6, r2, #8
add r1, r12, r1, lsl #5
ldm r6, {r6, r12}
add r4, r4, r5
add r5, r2, #16
stm r4, {r6, r12}
ldr r4, [r0, #4]
ldm r5, {r5, r12}
add r3, r3, r4
stm r3, {r5, r12}
ldr r0, [r0, #4]
ldr r3, [r2, #24]
ldr r2, [r2, #28]
str r3, [r0, r1]!
str r2, [r0, #4]
pop {r4-r7}
bx lr
```

## Stack-argument pointer-layout constructor

`func_003354FC` (44 bytes) fills a 32-byte record at `r0`. It stores entry
`r1,r2,r3` at offsets 0,4,8. Let `p` be the word at entry SP +0: offsets
12,16,20,24 receive `p,p+8,p+16,p+24`. The float at entry SP +4 is stored at
offset 28. No stack adjustment or save occurs; `r1-r3,r12` are scratch.

```asm
ldr r12, [sp]
vldr s0, [sp, #4]
stm r0, {r1-r3}
add r1, r12, #8
vstr s0, [r0, #28]
str r1, [r0, #16]
add r2, r12, #16
add r3, r12, #24
str r12, [r0, #12]
strd r2, [r0, #20]
bx lr
```

## Sorted twenty-byte insertion

`func_003A7910` (172 bytes) inserts the 20-byte record at `r1` into a sorted
array container at `r0`: data pointer +8, count +12, capacity +16. If
`count >= capacity` it returns zero. Otherwise it scans from index zero while
existing record byte +5 is unsigned less than or equal to the new record's
byte +5. Thus insertion is stable after existing equal keys. Records from the
insertion point through the old last element shift upward one slot, back to
front, using five-float VFP loads/stores. The new record is copied as five
words, count increments, and the function returns one. It preserves `r4-r6`.

```asm
push {r4-r6}
ldr r2, [r0, #16]
ldr r3, [r0, #12]
cmp r3, r2
movcs r0, #0
bcs done
cmp r3, #0
mov r2, #0
bls found
ldrb r12, [r1, #5]
ldr r4, [r0, #8]
mov r5, #5
scan:
add r6, r2, r2, lsl #2
add r6, r5, r6, lsl #2
ldrb r6, [r4, r6]
cmp r6, r12
addls r2, r2, #1
cmpls r2, r3
bcc scan
found:
cmp r3, r2
mvnhi r5, #19
bls place
shift:
ldr r12, [r0, #8]
add r4, r3, r3, lsl #2
sub r3, r3, #1
add r6, r5, r4, lsl #2
add r6, r6, r12
add r12, r12, r4, lsl #2
vldmia r6, {s0-s4}
cmp r3, r2
vstmia r12, {s0-s4}
bhi shift
place:
ldr r3, [r0, #8]
vldmia r1, {s0-s4}
add r1, r2, r2, lsl #2
add r1, r3, r1, lsl #2
vstmia r1, {s0-s4}
ldr r1, [r0, #12]
add r1, r1, #1
str r1, [r0, #12]
mov r0, #1
done:
pop {r4-r6}
bx lr
```

## Exact-probe manifest

| Function | Mode | Size | Complete-body probe |
| --- | --- | ---: | --- |
| `func_002F54D0` | ARM | 124 | exact |
| `func_002FC820` | ARM | 348 | exact |
| `func_00329750` | ARM | 160 | exact |
| `func_003299E8` | ARM | 120 | exact |
| `func_003354FC` | ARM | 44 | exact |
| `func_003A7910` | ARM | 172 | exact |
| **Total** |  | **968** | **6 / 6 exact** |

Implementation cautions: keep all unsigned conditions and early returns
exact; preserve the state synchronizer's no-store equal-pointer branches and
per-iteration dirty-byte timing; retain VFP operations even where they merely
copy word bits; do not reinterpret the bottom-tested nonzero-count record loop
as a zero-safe generic loop; and preserve the sorted insertion's stable
less-than-or-equal scan and back-to-front shift.
