# Probe-verified ARM runtime/leaf-helper batch 47

## Scope and provenance

This clean-room specification covers 20 currently unmatched ARM-state,
call-free leaves totaling 652 executable bytes. Evidence was limited to the
current unmatched report, neutral symbols, bounded private-target control and
data-flow inspection, and independent exact-schedule probes. The selection is
disjoint from every earlier runtime-helper manifest and from duplicate-template
batch 47, which reserves `func_0053A57C` and `func_0053A794`.

No function has a literal pool, adjacent word, call, or symbolic identity.
No private absolute address, raw target byte sequence, instruction encoding,
or private literal value is recorded here. The schedules were independently
assembled with GNU Arm Embedded 15.2 for ARMv6K/VFPv2 and compared with target
revision `AS_EUR_REV2` on 2026-10-16. All 20 complete bodies and all 652 body
bytes matched directly. Use this common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

Labels and directives occupy no executable bytes. Preserve every displayed
mnemonic, operand, register, addressing mode, and instruction order.

## Indexed 372-byte record accessors

The functions in this section take a root pointer in `r0` and an unsigned
record index in `r1`. Except for `func_004CD698`, they load the record array
pointer from root offset 108 and form `372 * index` by first computing
`31 * index` in `r2`, then `93 * index`, and finally shifting that value left
by two in the address addition. This exact arithmetic and its `r1`/`r2`
clobbers are part of the contract.

`func_004CD0DC`, `func_004CD674`, and `func_004CD6C8` load the word at record
offset 240 and extract, respectively, bits 3--5, 6--8, and 9--11.

```asm
@ func_004CD0DC: LEFT_SHIFT=26
@ func_004CD674: LEFT_SHIFT=23
@ func_004CD6C8: LEFT_SHIFT=20
rsb r2,r1,r1,lsl #5
ldr r0,[r0,#108]
add r2,r2,r2,lsl #1
mov r1,#240
add r1,r1,r2,lsl #2
ldr r0,[r0,r1]
lsl r0,r0,#LEFT_SHIFT
lsr r0,r0,#29
bx lr
```

`func_004CD814` and `func_004CD85C` use the same word and return bits 12--15
and 16--19, respectively.

```asm
@ func_004CD814: LEFT_SHIFT=16
@ func_004CD85C: LEFT_SHIFT=12
rsb r2,r1,r1,lsl #5
ldr r0,[r0,#108]
add r2,r2,r2,lsl #1
mov r1,#240
add r1,r1,r2,lsl #2
ldr r0,[r0,r1]
lsl r0,r0,#LEFT_SHIFT
lsr r0,r0,#28
bx lr
```

`func_004CD7D8` returns bits 28--31 of that same word without a preliminary
left shift.

```asm
rsb r2,r1,r1,lsl #5
ldr r0,[r0,#108]
add r2,r2,r2,lsl #1
mov r1,#240
add r1,r1,r2,lsl #2
ldr r0,[r0,r1]
lsr r0,r0,#28
bx lr
```

Five byte-return leaves share the same record arithmetic and differ only in
their byte offset. `func_004CD7F8`, `func_004CD880`, `func_004CD89C`,
`func_004CD8B8`, and `func_004CD8F0` use offsets 223, 276, 225, 227, and 226,
respectively.

```asm
rsb r2,r1,r1,lsl #5
ldr r0,[r0,#108]
add r2,r2,r2,lsl #1
mov r1,#BYTE_OFFSET
add r1,r1,r2,lsl #2
ldrb r0,[r0,r1]
bx lr
```

`func_004CD6A4` reads the byte at record offset 220 and returns zero when it
is zero or one when it is nonzero. The loaded zero supplies the false result.

```asm
rsb r2,r1,r1,lsl #5
ldr r0,[r0,#108]
add r2,r2,r2,lsl #1
mov r1,#220
add r1,r1,r2,lsl #2
ldrb r0,[r0,r1]
cmp r0,#0
movne r0,#1
bx lr
```

`func_004CD698` is the independent compact byte accessor. It loads a byte at
`root[120][index]`.

```asm
ldr r0,[r0,#120]
ldrb r0,[r0,r1]
bx lr
```

`func_004CD8D4` takes a root in `r0`, word index in `r1`, and byte-lane index
in `r2`. It loads the word at `root[128] + 16 * word_index`, shifts right by
`8 * byte_lane`, and returns whether the selected low byte is nonzero. Retain
the register-controlled shift, flag-setting mask, and conditional
normalization.

```asm
ldr r0,[r0,#128]
lsl r2,r2,#3
ldr r0,[r0,r1,lsl #4]
lsr r0,r0,r2
ands r0,r0,#255
movne r0,#1
bx lr
```

## Nested indexed accessors

`func_004CDC60` accepts a root in `r0`, outer index in `r1`, inner index in
`r2`, and output pointer in `r3`. It copies two words from
`root[48] + 340 * outer + 24 * inner + 248` to the output. Preserve the
explicit `85 * outer` and `3 * inner` construction and the paired transfers.

```asm
add r1,r1,r1,lsl #4
ldr r0,[r0,#48]
add r1,r1,r1,lsl #2
add r0,r0,r1,lsl #2
add r1,r2,r2,lsl #1
add r0,r0,#84
add r0,r0,r1,lsl #3
add r1,r0,#164
ldrd r0,[r1]
strd r0,[r3]
bx lr
```

`func_004CDC8C` takes the same root and indices and returns the byte at
`root[48] + 340 * outer + 24 * inner + 234`.

```asm
add r1,r1,r1,lsl #4
ldr r0,[r0,#48]
add r3,r1,r1,lsl #2
add r1,r2,r2,lsl #1
add r0,r0,r3,lsl #2
add r0,r0,r1,lsl #3
ldrb r0,[r0,#234]
bx lr
```

`func_004CDCAC` takes a root in `r0`, outer index in `r1`, and inner index in
`r2`. It follows the pointers at offsets 40 and then 52, indexes records of
44 bytes and words of four bytes, and returns the word at a further offset of
28. Preserve the `3 * outer` intermediate in `r3`.

```asm
ldr r0,[r0,#40]
add r3,r1,r1,lsl #1
add r1,r3,r1,lsl #3
ldr r0,[r0,#52]
add r0,r0,r1,lsl #2
add r0,r0,r2,lsl #2
ldr r0,[r0,#28]
bx lr
```

## Fixed transfers and vector addition

`func_004CFE50` copies 48 bytes from entry `r0` to entry `r1` as three
16-byte VFP transfers. Preserve the non-writeback transfers and explicit
pointer additions.

```asm
vldmia r0,{s0-s3}
add r2,r0,#16
add r0,r0,#32
vstmia r1,{s0-s3}
vldmia r2,{s0-s3}
add r2,r1,#16
add r1,r1,#32
vstmia r2,{s0-s3}
vldmia r0,{s0-s3}
vstmia r1,{s0-s3}
bx lr
```

`func_004CFE7C` gathers words at input offsets 12, 28, and 44 into contiguous
output offsets 0, 4, and 8. Its store at output offset 8 occurs before the
paired store at offsets 0 and 4.

```asm
ldr r2,[r1,#12]
ldr r3,[r1,#28]
ldr r1,[r1,#44]
str r1,[r0,#8]
strd r2,[r0]
bx lr
```

`func_004CFFE4` treats `r1` as three input single-precision values, `r2` as
three single-precision adjustments, and `r0` as three output values. It adds
the corresponding values, but the exact scalar register and memory schedule
below is required. The first load advances `r2` by four bytes.

```asm
vldmia r2!,{s5}
vldr s1,[r1]
vldr s0,[r1,#4]
vldr s2,[r1,#8]
vadd.f32 s1,s1,s5
vldmia r2,{s3-s4}
vadd.f32 s0,s0,s3
vadd.f32 s2,s2,s4
vstr s1,[r0]
vstr s0,[r0,#4]
vstr s2,[r0,#8]
bx lr
```

## Acceptance criteria

- Emit all 20 functions in ARM state with the manifest sizes, totaling 652
  executable bytes.
- Emit no calls, literal pools, adjacent words, or relocations.
- Preserve the exact register choices, arithmetic construction, load/store
  ordering, VFP register allocation, conditions, and return forms shown above.
- Keep the implementation derived solely from this specification; target-side
  artifacts remain validation inputs only.
