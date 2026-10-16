# Probe-verified ARM bounded-record parser batch 23

## Scope

This clean-room specification covers one unmatched ARM leaf, 252 bytes. Its
complete executable body was independently assembled and byte-exact. It has
no calls. One adjacent relocated word names an opaque byte lookup table; no
table address or contents are recorded here.

## `func_002DACF0`

Inputs are output record `r0`, header pointer `r1`, payload base `r2`, payload
end `r3`, and an endian-mode word at entry SP+0. The function pushes `r4-r6`,
so it reads that fifth argument from current SP+12. It returns 1 on success or
0 on failure.

It initially zeros output words +0,+4,+8. It reads header halfwords +0 and +2;
when endian mode is zero each is `rev16`-swapped. The first is stored at output
+8 and the low byte of the second at output +10. It forms two 32-bit values
from header +4 and +8. Nonzero endian mode retains byte order while explicitly
replacing the top byte from header +7/+11; zero mode reverses the word, clears
its low byte, then inserts the original +7/+11 byte.

Call the first value `count`, second `payload_offset`, and swapped second
halfword `kind`. It requires unsigned `kind < 11` and `count < 65536`. It reads
`shift = runtime_shift_width_table_23[kind]`, computes `size=count<<shift`,
and stores size at output +0. If unsigned `size <= 4`, output pointer is
`header+8`. Otherwise let `available=payload_end-payload_base`; it requires
`available > payload_offset`, `size <= available`, and
`size+payload_offset <= available`, then uses `payload_base+payload_offset`.
The chosen pointer is stored at output +4.

Failure is not transactional: the zero initialization, metadata stores, and
possibly size store occur before later checks.

### Exact schedule requirements

- Save/restore exactly `r4-r6` (12-byte SP movement); no LR save.
- Preserve the endian comparison flags across the first halfword store/load,
  and again across the deliberate `nop` separating the two 32-bit branches.
- The two endian branches use `rev`, `bic #0xff`, and `orr` for zero mode;
  nonzero mode uses `bic #0xff000000` and `orr ...,byte,lsl#24`.
- Store output byte +10 after comparing `count` with 65536 but before its
  failure branch.
- Lookup uses `ldrb` and register-shift `lsl r12,r5,r12`.
- Store size before the `size<=4` branch. The small-size path conditionally
  advances `r1` by eight.
- Large-size checks use, in order, `bls`, `bhi`, then `bhi`; pointer formation
  is conditional `addls` before the final branch.
- Success stores pointer, pops, sets `r0=1`, returns. Failure pops, sets
  `r0=0`, returns.

The executable body spans relative `+0x00..+0xF8`; its final `bx lr` is at
`+0xF8`, and the 252-byte symbol ends at `+0xFC`. A single adjacent word at
`+0xFC` is an `R_ARM_ABS32`-style symbolic reference to
`runtime_shift_width_table_23`.

`runtime_shift_width_table_23` requirements: byte-addressable, alignment at
least one, readable for indices 0 through 10, and identical to the audited
runtime table. No other table segment is accessed and no values are specified
by this document.

### Complete target schedule

```asm
push {r4-r6}
mov r4,#0
ldr r12,[sp,#12]
str r4,[r0]
str r4,[r0,#4]
cmp r12,#0
str r4,[r0,#8]
ldrh r12,[r1]
rev16eq r12,r12
strh r12,[r0,#8]
ldrh r12,[r1,#2]
rev16eq r12,r12
beq first_swap
ldr r4,[r1,#4]
ldrb r5,[r1,#7]
bic r4,r4,#0xff000000
orr r5,r4,r5,lsl#24
b first_done
first_swap:
ldr r5,[r1,#4]
ldrb r4,[r1,#7]
rev r5,r5
bic r5,r5,#0xff
orr r5,r5,r4
first_done:
nop
beq second_swap
ldr r4,[r1,#8]
ldrb r6,[r1,#11]
bic r4,r4,#0xff000000
orr r4,r4,r6,lsl#24
b second_done
second_swap:
ldr r6,[r1,#8]
ldrb r4,[r1,#11]
rev r6,r6
bic r6,r6,#0xff
orr r4,r4,r6
second_done:
cmp r12,#11
bcs fail
cmp r5,#0x10000
strb r12,[r0,#10]
bcs fail
ldr r6,=runtime_shift_width_table_23
ldrb r12,[r6,r12]
lsl r12,r5,r12
cmp r12,#4
addls r1,r1,#8
str r12,[r0]
bls success
sub r1,r3,r2
cmp r1,r4
bls fail
cmp r12,r1
bhi fail
add r3,r12,r4
cmp r3,r1
addls r1,r2,r4
bhi fail
success:
str r1,[r0,#4]
pop {r4-r6}
mov r0,#1
bx lr
fail:
pop {r4-r6}
mov r0,#0
bx lr
```

### Current-base per-instruction mismatch ledger

The current base artifact is instruction-identical only at these offsets:
`+0x00`, `+0x90`, `+0x94`, `+0x9C`, `+0xA8`, `+0xB8`, `+0xC4`, `+0xCC`,
`+0xDC`, `+0xE4`, `+0xE8`, `+0xEC`, `+0xF0`, `+0xF4`, `+0xF8`.

Every differing instruction offset is listed here; this is the exhaustive
48-instruction mismatch set:

```text
+0x04 +0x08 +0x0C +0x10 +0x14 +0x18 +0x1C +0x20
+0x24 +0x28 +0x2C +0x30 +0x34 +0x38 +0x3C +0x40
+0x44 +0x48 +0x4C +0x50 +0x54 +0x58 +0x5C +0x60
+0x64 +0x68 +0x6C +0x70 +0x74 +0x78 +0x7C +0x80
+0x84 +0x88 +0x8C +0x98 +0xA0 +0xA4 +0xAC +0xB0
+0xB4 +0xBC +0xC0 +0xC8 +0xD0 +0xD4 +0xD8 +0xE0
```

The causes are register allocation and scheduling, not parser semantics. The
base artifact preserves output in `r4`, uses `r0` as zero/scratch, retains
metadata in `r5/r6`, and normalizes each endian branch into load-then-branch
form. The target keeps output in `r0`, zero in `r4`, condition state and
metadata in `r12`, uses `r4-r6` differently in each endian arm, and retains
the deliberate flag-preserving `nop`. After lookup, the base stores size
before comparing it; the target compares, conditionally advances `r1`, then
stores. In the large path the base destructively changes `r3` to available
length and uses different scratch registers; the target preserves the exact
`r1/r3/r4/r12` sequence shown above. The symbolic relocation itself remains
at `+0xFC` and is correct in kind and placement.

## Exact-probe manifest

| Function | Mode | Size | Body probe | Relocation |
| --- | --- | ---: | --- | --- |
| `func_002DACF0` | ARM | 252 | exact | adjacent symbolic table word |
| **Total** |  | **252** | **1 / 1 exact** | |
