# Probe-verified ARM/Thumb runtime helpers batch 12

## Scope and provenance

This clean-room analysis specification covers sixteen independently observed
runtime helpers totaling 868 code bytes.  The descriptions and textual
templates use only public ARM/Thumb instruction semantics, AAPCS register
arguments, VFPv2 operations, ordinary memory records, and integer arithmetic.
They contain no target instruction words, executable literals, private data
addresses, extracted assets, or proprietary SDK interfaces.

Each complete textual body below was independently assembled for ARM11 MPCore
and compared section-for-section with the corresponding target function.  All
sixteen probes were exact.  Architectural semantics follow the public Arm
Architecture Reference Manual; register argument/result placement follows
AAPCS32.

Unless stated otherwise, word and halfword accesses use the platform's
little-endian representation.  The first eleven helpers execute in ARM state;
the final five execute in Thumb state.

## VFP 4-by-4 matrix product

`func_001235B4` (348 bytes) accepts a destination matrix in `r0` and two
row-major 4-by-4 single-precision matrices in `r1` and `r2`.  It computes the
ordinary matrix product `destination = left * right`.  The complete result is
held in `s0` through `s15` until the final store, so the destination may alias
either input.  It preserves `d8` through `d12` with a VFP stack save.  Use the
following exact register and operation schedule:

```asm
vpush {d8-d12}
vldmia r2!, {s16-s23}
vldr s24, [r1]
vldr s25, [r1, #16]
vmul.f32 s0, s24, s16
vmul.f32 s1, s24, s17
vmul.f32 s2, s24, s18
vmul.f32 s3, s24, s19
vldr s24, [r1, #32]
vmul.f32 s4, s25, s16
vmul.f32 s5, s25, s17
vmul.f32 s6, s25, s18
vmul.f32 s7, s25, s19
vldr s25, [r1, #48]
vmul.f32 s8, s24, s16
vmul.f32 s9, s24, s17
vmul.f32 s10, s24, s18
vmul.f32 s11, s24, s19
vldr s24, [r1, #4]
vmul.f32 s12, s25, s16
vmul.f32 s13, s25, s17
vmul.f32 s14, s25, s18
vmul.f32 s15, s25, s19
vldr s25, [r1, #20]
vldmia r2!, {s16-s19}
vmla.f32 s0, s24, s20
vmla.f32 s1, s24, s21
vmla.f32 s2, s24, s22
vmla.f32 s3, s24, s23
vldr s24, [r1, #36]
vmla.f32 s4, s25, s20
vmla.f32 s5, s25, s21
vmla.f32 s6, s25, s22
vmla.f32 s7, s25, s23
vldr s25, [r1, #52]
vmla.f32 s8, s24, s20
vmla.f32 s9, s24, s21
vmla.f32 s10, s24, s22
vmla.f32 s11, s24, s23
vldr s24, [r1, #8]
vmla.f32 s12, s25, s20
vmla.f32 s13, s25, s21
vmla.f32 s14, s25, s22
vmla.f32 s15, s25, s23
vldr s25, [r1, #24]
vldmia r2, {s20-s23}
vmla.f32 s0, s24, s16
vmla.f32 s1, s24, s17
vmla.f32 s2, s24, s18
vmla.f32 s3, s24, s19
vldr s24, [r1, #40]
vmla.f32 s4, s25, s16
vmla.f32 s5, s25, s17
vmla.f32 s6, s25, s18
vmla.f32 s7, s25, s19
vldr s25, [r1, #56]
vmla.f32 s8, s24, s16
vmla.f32 s9, s24, s17
vmla.f32 s10, s24, s18
vmla.f32 s11, s24, s19
vldr s24, [r1, #12]
vmla.f32 s12, s25, s16
vmla.f32 s13, s25, s17
vmla.f32 s14, s25, s18
vmla.f32 s15, s25, s19
vldr s25, [r1, #28]
vmla.f32 s0, s24, s20
vmla.f32 s1, s24, s21
vmla.f32 s2, s24, s22
vmla.f32 s3, s24, s23
vldr s24, [r1, #44]
vmla.f32 s4, s25, s20
vmla.f32 s5, s25, s21
vmla.f32 s6, s25, s22
vmla.f32 s7, s25, s23
vldr s25, [r1, #60]
vmla.f32 s8, s24, s20
vmla.f32 s9, s24, s21
vmla.f32 s10, s24, s22
vmla.f32 s11, s24, s23
vmla.f32 s12, s25, s20
vmla.f32 s13, s25, s21
vmla.f32 s14, s25, s22
vmla.f32 s15, s25, s23
vpop {d8-d12}
vstmia r0, {s0-s15}
bx lr
```

## Fixed-size 312-byte forward copy

`func_00123C78` (208 bytes) copies exactly 312 bytes from `r1` to `r0` in
increasing-address order and returns with both registers advanced by 312.  It
does not promise overlap-safe `memmove` behavior.  It saves `r4`, `r5`, `r9`,
`r10`, and `r11`.  Nine 32-byte groups use the following five-instruction
body, including the prefetch after the first 16-byte load:

```asm
push {r4, r5, r9, r10, r11}
/* Repeat this group exactly nine times. */
ldm r1!, {r2, r3, r4, r5}
pld [r1, #64]
ldm r1!, {r9, r10, r11, r12}
stm r0!, {r2, r3, r4, r5}
stm r0!, {r9, r10, r11, r12}
/* Then copy the final 24 bytes. */
ldm r1!, {r2, r3, r4, r5}
ldm r1!, {r11, r12}
stm r0!, {r2, r3, r4, r5}
stm r0!, {r11, r12}
pop {r4, r5, r9, r10, r11}
bx lr
```

An implementation may spell the repeated group with assembler `.rept 9`, but
must not introduce an executable-data directive.

## ARM record and dispatch helpers

### Virtual tail dispatch

`func_001277B4` (12 bytes) loads an object's first word as a dispatch-table
pointer and tail-calls the entry at byte offset 12, leaving the object pointer
in `r0`:

```asm
ldr r3, [r0]
ldr r3, [r3, #12]
bx r3
```

### Four-field record initialization

`func_0012C174` (28 bytes) initializes a record at `r0`: byte 12 becomes one,
word 8 receives `r1`, byte 13 becomes zero, and word 4 receives `r2`.  It has
no specified return value:

```asm
mov r12, #1
strb r12, [r0, #12]
mov r3, #0
str r1, [r0, #8]
strb r3, [r0, #13]
str r2, [r0, #4]
bx lr
```

### Conditional signed-byte access

`func_0012C7EC` (20 bytes) returns signed byte 68 from the object when byte 74
is zero; otherwise it returns zero:

```asm
ldrb r1, [r0, #74]
cmp r1, #0
ldrsbeq r0, [r0, #68]
movne r0, #0
bx lr
```

### Nullable table count

`func_0012FAF4` (20 bytes) reads a nullable pointer from word 0.  It returns
zero for null and otherwise returns the unsigned halfword at pointee offset 2:

```asm
ldr r1, [r0]
mov r0, #0
cmp r1, #0
ldrhne r0, [r1, #2]
bx lr
```

### Relative-offset table lookup

`func_0012FB40` (44 bytes) reads a nullable table pointer from word 0.  A
non-null table has an unsigned entry count at offset 2 and 32-bit relative
offsets beginning at offset 4.  It returns null when the table is null or the
unsigned index in `r1` is out of range; otherwise it returns
`table + table->relative[index]`:

```asm
ldr r2, [r0]
mov r0, #0
cmp r2, #0
ldrhne r3, [r2, #2]
cmpne r3, r1
bls 1f
mov r0, #4
add r0, r0, r1, lsl #2
ldr r0, [r2, r0]
add r0, r0, r2
1:
bx lr
```

### Flag extraction, zeroing, and two-word copy

`func_0012FE10` (16 bytes) returns bit 17 of the word at offset 4 as zero or
one:

```asm
ldr r0, [r0, #4]
and r0, r0, #0x20000
lsr r0, r0, #17
bx lr
```

`func_0012FE20` (16 bytes) writes zero to words 0 and 4:

```asm
mov r1, #0
str r1, [r0]
str r1, [r0, #4]
bx lr
```

`func_0012FE3C` (20 bytes) copies the two words at `r1 + 0` and `r1 + 4` to
the corresponding fields at `r0` in load-load-store-store order:

```asm
ldr r2, [r1]
ldr r3, [r1, #4]
str r2, [r0]
str r3, [r0, #4]
bx lr
```

### Compact 24-bit-or-extended-word decoder

`func_00132230` (48 bytes) decodes a little-endian compact integer from `r0`.
It first reconstructs the first unaligned 32-bit word explicitly, discards its
low byte, and returns the resulting 24-bit value when nonzero.  If those upper
24 bits are zero, it reconstructs and returns the complete unaligned word at
offset 4.  Preserve the explicit high-byte loads and masks:

```asm
mov r1, r0
ldr r0, [r0]
ldrb r2, [r1, #3]
bic r0, r0, #0xff000000
orr r0, r0, r2, lsl #24
lsrs r0, r0, #8
bne 1f
ldr r0, [r1, #4]
ldrb r1, [r1, #7]
bic r0, r0, #0xff000000
orr r0, r0, r1, lsl #24
1:
bx lr
```

## Thumb flag and accumulator helpers

The next two pairs are byte-for-byte duplicate behaviors at distinct public
symbol identities.

`func_00105DCC` and `func_00105ED8` (22 bytes each) update bit zero of the word
at offset 16.  A nonzero `r1` sets the bit; zero clears it using the observed
right-then-left shift sequence:

```asm
ldr r2, [r0, #16]
cmp r1, #0
beq 1f
movs r1, #1
orrs r2, r1
str r2, [r0, #16]
bx lr
1:
lsrs r1, r2, #1
lsls r1, r1, #1
str r1, [r0, #16]
bx lr
```

`func_00105DE2` and `func_00105EEE` (18 bytes each) update bit two of the word
at offset 16.  A nonzero `r1` sets it and zero clears it:

```asm
ldr r2, [r0, #16]
movs r3, #4
cmp r1, #0
beq 1f
orrs r2, r3
b 2f
1:
bics r2, r3
2:
str r2, [r0, #16]
bx lr
```

`func_00105FEA` (8 bytes) adds `r1` modulo 2^32 to the word addressed by `r0`
and stores the result.  The result also remains in `r1`; no `r0` return value
is specified:

```asm
ldr r2, [r0]
adds r1, r2, r1
str r1, [r0]
bx lr
```

## Relocatable implementation and acceptance criteria

Implement each helper as original textual assembly in its own executable,
four-byte-aligned function section.  Select unified syntax, ARMv6K/MPCore, and
VFPv2.  Mark the final five helpers as Thumb functions and all others as ARM
functions.  Do not use `.word`, `.inst`, `.long`, or another embedded
instruction/data directive.  This batch needs no literal pools, calls, or
relocations.

Acceptance requires all of the following:

- all sixteen symbols have the exact modes and sizes stated above;
- the VFP helper preserves its complete load/multiply/accumulate schedule;
- the 312-byte copy contains nine identical prefetched 32-byte groups followed
  by the final 24-byte group;
- the compact decoder preserves its explicit unaligned-word reconstruction;
- duplicate Thumb helpers remain distinct public symbols;
- every function reports 100% through the repository's objdiff pipeline; and
- no ROM-derived byte sequence or generated private artifact enters Git.

## Probe result

An ignored textual-assembly probe implemented only the public behavior and
mnemonics stated above.  Each independently assembled section was compared
with its corresponding private target section and was exact: 16 of 16
functions and 868 of 868 code bytes.

- Target: `AS_EUR_REV2`, verified code SHA-256
  `b7f9ce60361f3709ed0ce879658afe10a712f7db060640fa72bba826301b7c16`.
- Neutral inventory: `symbols/code.bin.csv`, SHA-256
  `4b7bcc35a838a2d4fe1c0cdbac2ccbe36b4df1ac24b91f1f8660693967c8c2fe`.
- Analysis date: 2026-10-15.
- Analysis tools: GNU Arm assembler, objcopy, and objdump 2.45.1.20251203 from
  Arm GNU Toolchain 15.2.Rel1.
- Method: filter unmatched ARM and Thumb functions to at most 512 bytes,
  identify architecture/runtime behavior, express candidates independently as
  textual assembly, assemble without embedded target words, and compare every
  complete function section.  Candidates containing unresolved external calls
  or any byte mismatch were excluded.  No leaked source, proprietary SDK
  header, ROM, extracted asset, target instruction dump, or target byte
  sequence is included in this specification.
