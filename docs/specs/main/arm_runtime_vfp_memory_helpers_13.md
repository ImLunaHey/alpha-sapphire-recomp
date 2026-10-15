# Probe-verified ARM runtime, VFP, and memory helpers batch 13

## Scope and provenance

This clean-room analysis specification covers eleven independent ARM-state
helpers totaling 788 code bytes.  It uses only public ARM11/AAPCS register
semantics, VFPv2 single-precision operations, the architectural thread-ID
register and supervisor-call mechanism, and ordinary memory records.  It
contains no target instruction words, extracted data, private addresses, or
proprietary source.

Each complete textual body below was independently assembled for ARM11 MPCore
with VFPv2 enabled and compared section-for-section with the complete observed
function.  All eleven probes were exact.  Word and halfword accesses use the
platform's little-endian representation.

## Thread command-buffer request helper

`func_00124A2C` (40 bytes) reads the public ARM thread-ID register, advances
that address by 128 bytes, writes `0x00120000` to the first word there, loads a
handle from the word addressed by `r0`, and performs supervisor call `0x32`.
When the signed call result is nonnegative it returns the word at thread-local
offset 132; otherwise it returns the call result.  Preserve the writeback on
the command-buffer store and the conditional load:

```asm
push {r4, lr}
mrc p15, 0, r4, c13, c0, 3
mov r1, #0x120000
str r1, [r4, #128]!
ldr r0, [r0]
svc #0x32
and r1, r0, #0x80000000
cmp r1, #0
ldrge r0, [r4, #4]
pop {r4, pc}
```

## Word-range fill

`func_001330E8` (48 bytes) takes a begin pointer in `r0`, an exclusive end
pointer in `r1`, and a 32-bit fill value in `r2`.  It writes the fill value to
successive words until begin equals end.  An initially empty range performs no
write.  The observed helper saves its incoming argument words on the stack,
updates the saved begin value on every iteration, and discards that frame by
adjusting `sp` rather than popping registers:

```asm
push {r0, r1, r2}
ldrd r0, [sp]
cmp r0, r1
beq 2f
1:
add r1, r0, #4
str r1, [sp]
str r2, [r0]
ldrd r0, [sp]
cmp r0, r1
bne 1b
2:
add sp, sp, #12
bx lr
```

## Seven-argument VFP record initialization

`func_0011CB70` (124 bytes) receives a destination in `r0`, a nullable
four-float source in `r1`, a required four-float source in `r2`, a word in
`r3`, and three more AAPCS stack arguments.  It has the following effects:

- when `r1` is non-null, copy its four floats to destination offset 20;
  otherwise copy the destination's existing four floats at offset 52 to
  offset 20;
- copy the four floats at `r2` to offset 36 and, when the seventh argument is
  nonzero, also to offset 52;
- store zero to byte 70 and word 16, one to byte 72, `r3` to word 12, the low
  byte of the fifth argument to byte 69, and the low byte of the sixth
  argument to byte 0.

Use this complete register and operation schedule:

```asm
push {r4, r5}
cmp r1, #0
ldr r12, [sp, #8]
ldrd r4, [sp, #12]
beq 1f
vldmia r1, {s0-s3}
vstr s0, [r0, #20]
vstr s1, [r0, #24]
vstr s2, [r0, #28]
vstr s3, [r0, #32]
2:
add r1, r0, #36
vldmia r2, {s0-s3}
cmp r5, #0
mov r2, #1
vstmia r1, {s0-s3}
addne r1, r0, #52
vstmiane r1, {s0-s3}
mov r1, #0
strb r1, [r0, #70]
strb r2, [r0, #72]
str r1, [r0, #16]
str r3, [r0, #12]
strb r12, [r0, #69]
strb r4, [r0]
pop {r4, r5}
bx lr
1:
add r1, r0, #52
vldmia r1, {s0-s3}
add r1, r0, #20
vstmia r1, {s0-s3}
b 2b
```

## VFP transform-record update

`func_00127528` (240 bytes) accepts a destination record in `r0` and twelve
input floats in `r1`.  It first computes:

```text
new0 = input[0] * input[3] + input[4] * input[7] - input[8]  * input[11]
new1 = input[1] * input[3] + input[5] * input[7] - input[9]  * input[11]
new2 = input[2] * input[3] + input[6] * input[7] - input[10] * input[11]
```

and stores these at destination offsets 48, 52, and 56.  It then copies input
floats 0 through 7 to destination offsets 0 through 31 and input floats 8
through 11 to offsets 32 through 47.  If destination byte 96 was nonzero, it
clears that byte and returns.  Otherwise it additionally stores
`new0-old0`, `new1-old1`, and `new2-old2` at offsets 60, 64, and 68, where the
old values are the three destination floats loaded before any stores.

The multiply/add/subtract order is observable and must use the following
complete VFP schedule rather than algebraically reassociating:

```asm
vldr s3, [r1]
vldr s8, [r1, #12]
vldr s7, [r1, #16]
vldr s6, [r1, #28]
vmul.f32 s3, s3, s8
vldr s4, [r1, #32]
vldr s5, [r1, #44]
add r2, r0, #52
vldr s2, [r0, #48]
vldmia r2, {s0-s1}
add r2, r1, #24
vmla.f32 s3, s7, s6
vnmla.f32 s3, s4, s5
vstr s3, [r0, #48]
vldr s4, [r1, #4]
vldr s9, [r1, #12]
vldr s7, [r1, #20]
vldr s8, [r1, #28]
vmul.f32 s4, s4, s9
vldr s5, [r1, #36]
vldr s6, [r1, #44]
vmla.f32 s4, s7, s8
vnmla.f32 s4, s5, s6
vstr s4, [r0, #52]
vldr s4, [r1, #8]
vldr s9, [r1, #12]
vldmia r2, {s7-s8}
vmul.f32 s4, s4, s9
add r2, r1, #40
vldmia r2, {s5-s6}
vmla.f32 s4, s7, s8
vnmla.f32 s4, s5, s6
vstr s4, [r0, #56]
ldrb r2, [r0, #96]
cmp r2, #0
beq 1f
vldmia r1, {s0-s7}
add r1, r1, #32
add r3, r0, #32
mov r2, #0
vstmia r0, {s0-s7}
vldmia r1, {s0-s3}
vstmia r3, {s0-s3}
strb r2, [r0, #96]
bx lr
1:
vldmia r1, {s4-s11}
vsub.f32 s2, s3, s2
add r1, r1, #32
add r2, r0, #32
vstmia r0, {s4-s11}
vldmia r1, {s4-s7}
vstr s2, [r0, #60]
vstmia r2, {s4-s7}
vldr s2, [r0, #52]
vsub.f32 s0, s2, s0
vstr s0, [r0, #64]
vldr s0, [r0, #56]
vsub.f32 s0, s0, s1
vstr s0, [r0, #68]
bx lr
```

## Change-detecting VFP field setters

The next four helpers receive an object in `r0` and the new single-precision
value in `s0`.  Each compares the current field with `vcmp.f32`; if equal it
returns unchanged.  Otherwise it stores the new value and ORs the indicated
dirty bit into the halfword at offset 32.  Consequently an unordered NaN
comparison takes the update path.

| Function | Size | Float offset | Dirty bit |
| --- | ---: | ---: | ---: |
| `func_00180658` | 36 | 56 | 16 |
| `func_001806C0` | 36 | 52 | 8 |
| `func_0018074C` | 36 | 48 | 8 |
| `func_00180838` | 36 | 40 | 4 |

Instantiate this complete template once per table row:

```asm
vldr s1, [r0, #FLOAT_OFFSET]
vcmp.f32 s1, s0
vmrs APSR_nzcv, fpscr
beq 1f
ldrh r1, [r0, #32]
vstr s0, [r0, #FLOAT_OFFSET]
orr r1, r1, #DIRTY_BIT
strh r1, [r0, #32]
1:
bx lr
```

## Mask-selected VFP array setters

The final three helpers accept an object in `r0`, a bit mask in `r1`, and a
single-precision value in `s0`.  Starting at index zero, and stopping when the
unsigned index reaches the word at object offset 256 or the shifted mask
becomes zero, every set mask bit stores the value into a 36-byte-stride record.
The field offsets from the object base are shown below.

| Function | Size | Field offset for index `i` |
| --- | ---: | --- |
| `func_00181484` | 64 | `6944 + 36*i` |
| `func_00181630` | 64 | `6940 + 36*i` |
| `func_00181670` | 64 | `6948 + 36*i` |

Instantiate the following complete template with VFP displacement 800, 796,
or 804 respectively; the base addition of 6144 is deliberately separate:

```asm
mov r2, #0
b 2f
1:
tst r1, #1
beq 3f
add r3, r2, r2, lsl #3
add r3, r0, r3, lsl #2
add r3, r3, #0x1800
vstr s0, [r3, #VFP_DISPLACEMENT]
3:
add r2, r2, #1
lsr r1, r1, #1
2:
ldr r3, [r0, #256]
cmp r3, r2
bls 4f
cmp r1, #0
bne 1b
4:
bx lr
```
