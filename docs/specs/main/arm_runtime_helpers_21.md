# Probe-verified ARM record and arithmetic leaves batch 21

## Scope and provenance

This clean-room specification covers three previously unspecified, unmatched
ARM-state leaf functions totaling 244 bytes. It uses only public ARM,
AAPCS32, integer arithmetic, and ordinary record semantics. It contains no
raw instruction encodings, extracted data, private addresses, or proprietary
source. Every complete body was independently assembled and compared over its
full symbol extent; all three probes were byte-exact. They contain no calls,
external branches, or literal pools.

## Guarded byte-buffer extraction

`func_002D30F4` (84 bytes) takes output pair `r0` and owner `r1`. It requires
owner byte +74 nonzero, then forms nested base `owner + 8196` and requires its
byte +23 nonzero. From that nested record it reads length +12 and buffer
pointer +16. It requires unsigned length greater than one and requires the
last byte `buffer[length-1]` to be zero. On success it writes `(buffer,
length-1)` to output offsets 0 and 4 and returns 1. Every failure returns 0
without writing the output. No stack or callee-saved register is used.

```asm
ldrb r2, [r1, #74]
add r1, r1, #8192
add r1, r1, #4
cmp r2, #0
ldrbne r2, [r1, #23]
cmpne r2, #0
beq fail
ldr r2, [r1, #12]
ldr r1, [r1, #16]
cmp r2, #1
bls fail
add r3, r1, r2
ldrb r3, [r3, #-1]
cmp r3, #0
beq success
fail:
mov r0, #0
bx lr
success:
sub r2, r2, #1
stm r0, {r1, r2}
mov r0, #1
bx lr
```

## Guarded indexed record extraction

`func_002D3148` (88 bytes) takes output pair `r0`, owner `r1`, and unsigned
index `r2`. It requires index below four and owner byte +74 nonzero. Nested
base is `owner + 8196`. Record `i` is at nested offset `132 + 12*i`; the
record's byte +11 must be nonzero. It then stores record word +4 to output +0
and record word +0 to output +4. Return value is 1 only when record word +0 is
nonzero, otherwise 0.

The record words are written before the final null test, so the null-word
failure path still modifies the output pair. Earlier failures do not write it.
No stack or callee-saved register is used.

```asm
add r3, r1, #8192
cmp r2, #4
add r3, r3, #4
bcs fail
ldrb r12, [r1, #74]
add r1, r2, #11
cmp r12, #0
beq fail
add r1, r1, r1, lsl #1
add r2, r3, r1, lsl #2
ldrb r12, [r2, #11]
cmp r12, #0
beq fail
ldr r2, [r2, #4]
str r2, [r0]
ldr r1, [r3, r1, lsl #2]
cmp r1, #0
str r1, [r0, #4]
movne r0, #1
bne done
fail:
mov r0, #0
done:
bx lr
```

## Sixty-four-bit multiply-add generator

`func_002DAFF8` (72 bytes) updates a six-word state record at `r0`:

```text
state64     = words +0 (low), +4 (high)
multiplier  = words +8 (low), +12 (high)
increment   = words +16 (low), +20 (high)
state64 = state64 * multiplier + increment modulo 2^64
```

It writes the new low and high words back at +0 and +4. With entry `r1 == 0`
it returns the new high word. With nonzero `r1`, it returns the high 32 bits
of the unsigned 64-bit product `new_high * r1`, a multiply-high bounded
scaling operation. The conditional multiply also clobbers `r1`. It preserves
`r4-r8` with a five-register push/pop, temporarily moving SP by 20 bytes.

```asm
push {r4-r8}
add r2, r0, #8
ldr r4, [r0]
ldm r2, {r2, r6, r12}
ldr r3, [r0, #4]
ldr r5, [r0, #20]
umull r7, r8, r2, r4
mla r4, r6, r4, r8
mla r2, r2, r3, r4
adds r3, r7, r12
adc r2, r2, r5
str r2, [r0, #4]
str r3, [r0]
mov r0, r2
cmp r1, #0
umullne r1, r0, r0, r1
pop {r4-r8}
bx lr
```

## Exact-probe manifest

| Function | Mode | Size | Complete-body probe |
| --- | --- | ---: | --- |
| `func_002D30F4` | ARM | 84 | exact |
| `func_002D3148` | ARM | 88 | exact |
| `func_002DAFF8` | ARM | 72 | exact |
| **Total** |  | **244** | **3 / 3 exact** |

Implementation cautions: retain unsigned bounds conditions; preserve the
first extractor's no-write failure guarantee and the second extractor's
write-before-final-null-test behavior; keep multiply/add carry propagation in
the stated order; and retain the generator's conditional multiply-high and
five-register save set.
