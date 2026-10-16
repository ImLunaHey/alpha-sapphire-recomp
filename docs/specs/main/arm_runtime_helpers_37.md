# Probe-verified ARM runtime/leaf-helper batch 37

## Scope and provenance

This clean-room specification covers five still-unmatched ARM-state runtime
and leaf helpers totaling 548 executable bytes. The complete schedules below
were independently assembled with GNU Arm Embedded 15.2 for ARMv6K and
compared against target revision `AS_EUR_REV2` on 2026-10-16. All five
complete bodies and all 548 bytes matched directly, without normalization.

The evidence was limited to the current unmatched report, the neutral symbol
inventory, bounded private-target control/data-flow inspection, and an
independent exact-schedule probe. These helpers have no direct external
branches, relocations, literal pools, adjacent data, or embedded private data
identities. No private absolute address, raw byte sequence, instruction
encoding, proprietary source, or private data value is recorded here.

All schedules are ARM state under this common preamble:

```asm
.syntax unified
.arch armv6k
.arm
```

## `func_00312F30` — choose or synthesize a pointer range

This 64-byte leaf writes a two-word half-open range through entry `r0`.
It first loads the pair at offsets 368 and 372 of entry `r1`. If the pair is
nonempty, it copies those two words directly to the output. If the words are
equal, it instead follows the pointer at offset 8, resolves the relative link
whose displacement is at offset 184 from that object (zero displacement means
null), and forms the end pointer by adding four times the offset-180 word to
the resolved base. The synthesized base and end are then stored at output
offsets 0 and 4.

### Complete exact body schedule

```asm
add r2,r1,#368
ldm r2,{r2,r3}
cmp r2,r3
strdne r2,[r0]
bne 1f
ldr r1,[r1,#8]
add r2,r1,#184
ldr r3,[r1,#184]
ldr r1,[r1,#180]
cmp r3,#0
addne r2,r2,r3
moveq r2,#0
add r1,r2,r1,lsl #2
str r2,[r0]
str r1,[r0,#4]
1:
bx lr
```

The conditional doubleword store and its immediate `bne` are normative.
On the synthesis path preserve the relative-link field address in `r2`, even
when the displacement is zero, until the conditional add/null selection.

## `func_00312F70` — indexed availability predicate

This 132-byte leaf returns a normalized Boolean selected by a signed index at
offset 38 of entry `r1` and the byte at offset 36 of that same descriptor. A
negative index returns whether the descriptor byte is nonzero. A nonnegative
index first uses the pair at entry `r0` offsets 380 and 384: when that pair is
nonempty, the candidate is its first word plus eight times the index.

When that pair is empty, the helper follows entry `r0 + 8`, resolves a
relative link at offset 208, advances by sixteen times the index plus 40, and
resolves a second relative link there. Under the runtime invariant that the
selected candidate is valid for the final access, the helper reads candidate
byte 4. It returns one exactly when both that byte and descriptor byte 36 are
nonzero; otherwise it returns zero.

### Complete exact body schedule

```asm
ldrsh r3,[r1,#38]
cmp r3,#0
bge 2f
ldrb r0,[r1,#36]
cmp r0,#0
beq 1f
3:
mov r0,#1
1:
bx lr
2:
add r2,r0,#380
ldm r2,{r2,r12}
cmp r2,r12
addne r0,r2,r3,lsl #3
bne 4f
ldr r2,[r0,#8]
mov r0,#0
ldr r12,[r2,#208]!
cmp r12,#0
addne r2,r2,r12
moveq r2,r0
cmp r2,#0
moveq r0,#0
beq 4f
add r2,r2,r3,lsl #4
ldr r3,[r2,#40]!
cmp r3,#0
addne r0,r3,r2
4:
ldrb r0,[r0,#4]
cmp r0,#0
ldrbne r0,[r1,#36]
cmpne r0,#0
moveq r0,#0
bne 3b
bx lr
```

Preserve the signed `bge` index test, both writeback loads used for relative
link resolution, and the shared true-return block. The conditional byte load
and conditional compare at the end intentionally retain the flags that select
zero versus the branch to the normalized-one result.

## `func_003158B4` — fixed record initializer

This 56-byte leaf initializes the 29-byte record addressed by entry `r0`.
It writes one to bytes 0, 1, 20, and 28; writes four to word 4; writes eight
and one to words 8 and 12 with one multiple store; and clears words 16 and
24. No other byte in the surrounding object is accessed.

### Complete exact body schedule

```asm
mov r2,#1
strb r2,[r0]
mov r3,#4
strb r2,[r0,#1]
add r12,r0,#8
str r3,[r0,#4]
mov r1,#8
stm r12,{r1,r2}
mov r3,#0
str r3,[r0,#16]
strb r2,[r0,#20]
str r3,[r0,#24]
strb r2,[r0,#28]
bx lr
```

The two-word `stm` through the separately formed offset-8 pointer is part of
the exact contract; do not split it into scalar stores or change its register
order.

## `func_0031C05C` — aligned repeated-region layout update

This 164-byte arithmetic leaf updates the size word at entry `r0 + 0`, using
the alignment at entry `r0 + 4`. Entry `r1` supplies a word at offset 16 and
another at offset 24; the former is scaled by four and the latter contributes
four times its value before the repeated aligned regions. Entry `r2` is a
Boolean extension selector.

Writing `align(x,a)` for `(x + a - 1) & ~(a - 1)`, `s` for the entry size,
`a` for the alignment, `n` for the entry-`r1` offset-16 word, and `m` for the
offset-24 word, the common path computes:

```text
x0 = align(s, a) + 4*m
x1 = align(x0, a)
x2 = align(x1 + 4*n, a)
x3 = align(x2 + 4*n, a)
result = x3 + 4*n
```

It stores that common result first. If entry `r2` is nonzero it then aligns
the common result after adding one alignment unit, adds one further `4*n`
region, and overwrites the size word. The staged stores and repeated loads of
the alignment word are observable parts of the schedule.

### Complete exact body schedule

```asm
push {r4}
ldr r12,[r1,#16]!
ldr r4,[r0]
ldr r3,[r1,#8]
ldr r1,[r0,#4]
cmp r2,#0
add r4,r4,r1
sub r1,r1,#1
sub r4,r4,#1
bic r1,r4,r1
add r3,r1,r3,lsl #2
lsl r1,r12,#2
ldr r12,[r0,#4]
add r3,r3,r12
sub r12,r12,#1
sub r3,r3,#1
bic r3,r3,r12
ldr r12,[r0,#4]
add r3,r3,r1
add r3,r3,r12
sub r12,r12,#1
sub r3,r3,#1
bic r3,r3,r12
ldr r12,[r0,#4]
add r3,r3,r1
add r3,r3,r12
sub r12,r12,#1
sub r3,r3,#1
bic r3,r3,r12
add r3,r3,r1
str r3,[r0]
beq 1f
ldr r2,[r0,#4]
add r3,r3,r2
sub r2,r2,#1
sub r3,r3,#1
bic r2,r3,r2
add r1,r1,r2
str r1,[r0]
1:
pop {r4}
bx lr
```

The `beq` consumes the flags established by the early `cmp r2,#0` across the
intervening non-flag-setting schedule. Preserve that long flag lifetime, the
pre-indexed descriptor load, and the destination-register choice of the last
`bic`.

## `func_0031D8D0` — packed-record storage-size calculation

This 132-byte leaf calculates a storage size from six fields of the record at
entry `r0`: unsigned halfwords at offsets 0, 2, 4, and 6 and Boolean bytes at
offsets 8 and 10. Let those halfwords be `a`, `b`, `c`, and `d`. Its common
base is:

```text
108*(a + 1) + 632*b + 536*c
```

When byte 10 is nonzero, it additionally contributes
`4*align(d,16) + 1096*b + 100`. When byte 8 is nonzero, it finally contributes
464. The result is returned in `r0`. All arithmetic is word-width ARM integer
arithmetic, including normal wraparound.

### Complete exact body schedule

```asm
push {r4,r5}
ldrb r1,[r0,#10]
mov r2,#0
cmp r1,#0
ldrh r1,[r0,#2]
beq 1f
ldrh r2,[r0,#6]
mov r3,#208
add r2,r2,#15
bic r2,r2,#15
mla r2,r3,r1,r2
lsl r2,r2,#1
add r2,r2,r1,lsl #2
lsl r2,r2,#1
add r2,r2,r1,lsl #8
add r2,r2,#100
1:
ldrh r12,[r0]
ldrh r4,[r0,#4]
mov r3,#108
add r12,r12,#1
ldrb r0,[r0,#8]
mul r12,r12,r3
rsb r5,r1,r1,lsl #4
add r1,r5,r1,lsl #6
add r3,r4,r4,lsl #1
add r3,r3,r4,lsl #6
cmp r0,#0
add r1,r12,r1,lsl #3
add r0,r1,r3,lsl #3
add r0,r0,r2
pop {r4,r5}
addne r0,r0,#464
bx lr
```

The first conditional branch relies on the byte-10 comparison surviving the
intervening halfword load. The final conditional add similarly relies on the
byte-8 comparison surviving through the result construction and register
restore. Both flag lifetimes are normative.

## Branch, data, and equality ledger

There are no direct external branch sites in this batch and therefore no
`R_ARM_CALL`, `R_ARM_JUMP24`, or interworking relocation identities to name.
Every branch is body-local, and every exit is a local `bx lr`. The numeric
labels in the schedules express only those body-local control-flow edges.

There are no PC-relative literal loads, embedded words, adjacent pool slots,
or data relocations in any of the five sections. Consequently this batch
introduces no symbolic data equality classes and asserts no cross-batch data
identity. The offsets, masks, scaling factors, and other immediates shown in
the schedules are instruction operands, not target data identities.

## Exact-probe and overlap audit

| Function | Mode | Body bytes | External relocations | Probe result |
| --- | --- | ---: | ---: | --- |
| `func_00312F30` | ARM | 64 | 0 | exact complete body |
| `func_00312F70` | ARM | 132 | 0 | exact complete body |
| `func_003158B4` | ARM | 56 | 0 | exact complete body |
| `func_0031C05C` | ARM | 164 | 0 | exact complete body |
| `func_0031D8D0` | ARM | 132 | 0 | exact complete body |
| **Total** |  | **548** | **0** | **5 / 5 exact; 548 / 548 bytes** |

The probe emitted one independently assembled section per helper. Direct
section comparison found zero differences across all 548 executable bytes,
and readelf reported no relocations anywhere in the probe object. The sizes
above exactly equal the function extents in the current report; no trailing
data was included or omitted.

The current objdiff report lists all five helpers as zero-percent matched.
The complete tracked inventory contains none of their names, and their body
extents are pairwise disjoint. A direct workspace name audit also found no
occurrence in duplicate batch 37, IPC batch 33, runtime batch 36, or any
earlier clean-room batch. Thus there is zero known function, executable-byte,
or adjacent-data overlap with another clean-room batch.
