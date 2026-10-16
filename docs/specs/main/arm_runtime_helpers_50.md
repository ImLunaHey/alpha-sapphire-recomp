# Probe-verified ARM runtime/leaf-helper batch 50

## Scope and provenance

This clean-room specification covers 23 currently unmatched ARM-state,
call-free leaf helpers totaling 1,128 executable bytes. Evidence was limited
to the current unmatched report, neutral symbols, bounded private-target
control/data-flow inspection, and independently assembled exact-schedule
probes. The selection excludes every earlier configured function, duplicate
batch 50 (`func_0054FD38`, `func_00550510`, `func_0055C19C`,
`func_00566F04`, and `func_005691BC`), and all IPC batch 46 reservations.

No selected function has a call, literal pool, adjacent word, relocation, or
symbolic identity. Independent ARMv6K assembly comparison against target
revision `AS_EUR_REV2` on 2026-10-16 matched all 23 complete bodies and all
1,128 body bytes. Use this common preamble:

```asm
.syntax unified
.arch armv6k
.fpu vfpv2
.arm
```

Labels and directives occupy no executable bytes. Preserve every displayed
mnemonic, operand, register, condition, addressing mode, and instruction
order.

## Optional object and indexed-field accessors

`func_004C90E8` is 20 bytes. It follows owner offsets 12 and 20, then returns
zero unchanged or the non-null object's unsigned halfword at offset 4.

```asm
ldr r0,[r0,#12]
ldr r0,[r0,#20]
cmp r0,#0
ldrhne r0,[r0,#4]
bx lr
```

`func_004C9640` is 44 bytes. Follow owner offset 64; if non-null, follow
offsets 48 and 24, select a pointer with index `r1`, and return its word at
offset 40 when non-null. Any failed pointer check returns null.

```asm
ldr r0,[r0,#64]
cmp r0,#0
beq 1f
ldr r0,[r0,#48]
ldr r0,[r0,#24]
ldr r0,[r0,r1,lsl #2]
cmp r0,#0
ldrne r0,[r0,#40]
bne 2f
1: mov r0,#0
2: bx lr
```

The four 20-byte helpers below follow the optional pointer at owner offset
64 and, when present, its pointer at offset 48. Preserve conditional loads;
an absent outer pointer leaves zero in `r0`.

| Function | Final unsigned-halfword offset |
| --- | ---: |
| `func_004C96B4` | 40 |
| `func_004C9700` | 112 |
| `func_004C9714` | 100 |
| `func_004C975C` | 124 |

```asm
ldr r0,[r0,#64]
cmp r0,#0
ldrne r0,[r0,#48]
ldrhne r0,[r0,#FIELD_OFFSET]
bx lr
```

`func_004C96CC` and `func_004C9728` are 52 bytes each. A negative signed
index returns null. Otherwise follow optional owner offset 64, then offset
48, select the pointer-array field shown below, index it by `r1`, and return
the selected object's word at offset 16 when non-null. Every failure shares
the null tail.

| Function | Pointer-array offset |
| --- | ---: |
| `func_004C96CC` | 108 |
| `func_004C9728` | 120 |

```asm
cmp r1,#0
blt 1f
ldr r0,[r0,#64]
cmp r0,#0
beq 1f
ldr r0,[r0,#48]
ldr r0,[r0,#ARRAY_OFFSET]
ldr r0,[r0,r1,lsl #2]
cmp r0,#0
ldrne r0,[r0,#16]
bne 2f
1: mov r0,#0
2: bx lr
```

`func_004C9770` is 20 bytes. Follow owner offset 4. If present, return its
signed byte at offset 4; otherwise return negative two.

```asm
ldr r0,[r0,#4]
cmp r0,#0
ldrsbne r0,[r0,#4]
mvneq r0,#1
bx lr
```

`func_004C9784` is 60 bytes. Follow owner offset 4. A valid entry requires a
non-null object, nonnegative signed index `r1`, an unsigned halfword count at
offset 6 strictly greater than the index, and a zero byte at offset 4. On
success, index the pointer array at offset 8; otherwise return null.

```asm
ldr r0,[r0,#4]
cmp r0,#0
beq 1f
cmp r1,#0
ldrhge r2,[r0,#6]
cmpge r2,r1
ble 1f
ldrb r2,[r0,#4]
cmp r2,#0
beq 2f
1: mov r0,#0
bx lr
2: ldr r0,[r0,#8]
ldr r0,[r0,r1,lsl #2]
bx lr
```

## Compact record helpers

`func_004CCB20` is 40 bytes. Default to all ones. Only tag byte 29 equal to
five enables the optional pointer at offset 32; if that pointer is non-null,
load its word at offset 44 and sign-extend the low byte.

```asm
mov r1,r0
ldrb r0,[r0,#29]
cmp r0,#5
mvn r0,#0
bne 1f
ldr r1,[r1,#32]
cmp r1,#0
ldrne r0,[r1,#44]
sxtbne r0,r0
1: bx lr
```

`func_004CCE90` is 68 bytes. A negative index returns null. Otherwise follow
owner offset 40. Its unsigned halfword count is at offset 56 and its record
array pointer at offset 52. Require `count > index`, form a 44-byte record
stride as eleven times the index shifted left twice, then add 40 and return
the word at that byte offset.

```asm
cmp r1,#0
blt 1f
ldr r2,[r0,#40]
mov r0,#0
cmp r2,#0
ldrhne r0,[r2,#56]
cmp r0,r1
ble 1f
add r3,r1,r1,lsl #1
ldr r0,[r2,#52]
add r1,r3,r1,lsl #3
mov r2,#40
add r1,r2,r1,lsl #2
ldr r0,[r0,r1]
bx lr
1: mov r0,#0
bx lr
```

`func_004CCF64` is 20 bytes. Follow owner offset 40 and return zero when
absent or its unsigned halfword at offset 56 when present.

```asm
ldr r1,[r0,#40]
mov r0,#0
cmp r1,#0
ldrhne r0,[r1,#56]
bx lr
```

`func_004CD004` is 28 bytes. Follow offsets 40, 148, and zero; form
`12 * r1`; store the resulting record pointer only at output `r2 + 4`.

```asm
ldr r0,[r0,#40]
add r1,r1,r1,lsl #1
ldr r0,[r0,#148]
ldr r0,[r0]
add r0,r0,r1,lsl #2
str r0,[r2,#4]
bx lr
```

`func_004CD070` is 44 bytes. Follow owner offsets 40 and 52, select a
44-byte record with index `r1`, then follow offsets 268 and zero. Form
`12 * r2` and store that resulting pointer only at output `r3 + 4`.

```asm
ldr r0,[r0,#40]
add ip,r1,r1,lsl #1
add r1,ip,r1,lsl #3
ldr r0,[r0,#52]
ldr r0,[r0,r1,lsl #2]
add r1,r2,r2,lsl #1
ldr r0,[r0,#268]
ldr r0,[r0]
add r0,r0,r1,lsl #2
str r0,[r3,#4]
bx lr
```

## Tagged byte accessors

`func_004CDB58` and `func_004CDBB8` are 96 bytes each and share the exact
schedule below. Follow owner offset 128, select a 16-byte group with `r1`,
then extract byte lane `r2` from the group's tag word. Kind one follows the
lane pointer and returns a byte from that object. Kind two additionally
follows object offset 12 before its byte load. Kind three follows the lane
pointer and returns a different byte. Other kinds return the initial default.

| Function | Default | Kind-three byte | Kind-two byte |
| --- | ---: | ---: | ---: |
| `func_004CDB58` | 1 | 13 | 25 |
| `func_004CDBB8` | 0 | 12 | 24 |

```asm
ldr ip,[r0,#128]
lsl r3,r2,#3
mov r0,#DEFAULT
add r1,ip,r1,lsl #4
ldr ip,[r1]
lsr r3,ip,r3
and r3,r3,#255
cmp r3,#1
addeq r0,r1,r2,lsl #2
ldreq r0,[r0,#4]
beq 3f
cmp r3,#2
beq 2f
cmp r3,#3
bne 1f
add r0,r1,r2,lsl #2
ldr r0,[r0,#4]
ldrb r0,[r0,#KIND3_BYTE]
1: bx lr
2: add r0,r1,r2,lsl #2
ldr r0,[r0,#4]
ldr r0,[r0,#12]
3: ldrb r0,[r0,#KIND2_BYTE]
bx lr
```

## Aggregate and presence helpers

`func_004CDE94` is 104 bytes. Follow owner offset 136 and treat offsets 4
and 8 as begin/end pointers for a pointer sequence. For each outer pointer,
read the count at offset 548 and array pointer at offset 556. Sum every inner
entry's word reached through offsets 76 then 204. Preserve the two nested
unsigned/count loops and the saved-register-only frame.

```asm
mov r1,r0
push {r4,r5}
ldr r1,[r1,#136]
mov r0,#0
add r1,r1,#4
ldm r1,{r2,r5}
cmp r2,r5
beq 3f
1: ldr ip,[r2]
mov r1,#0
ldr r3,[ip,#548]
cmp r3,#0
ldrhi ip,[ip,#556]
bls 2f
4: ldr r4,[ip,r1,lsl #2]
add r1,r1,#1
cmp r3,r1
ldr r4,[r4,#76]
ldr r4,[r4,#204]
add r0,r0,r4
bhi 4b
2: add r2,r2,#4
cmp r2,r5
bne 1b
3: pop {r4,r5}
bx lr
```

`func_004CE6CC` is 56 bytes. Require owner tag byte 4 to equal one. Otherwise
return null. Follow offset 8; a non-null object's word at zero must have bit
29 set or the base becomes null. Then return the indexed word at byte offset
`16 + 4 * r1`. Preserve the unusual behavior that still indexes from null
after a missing pointer or cleared bit.

```asm
ldrb r2,[r0,#4]
cmp r2,#1
movne r0,#0
bne 1f
ldr r0,[r0,#8]
cmp r0,#0
beq 2f
ldr r2,[r0]
tst r2,#0x20000000
moveq r0,#0
2: mov r2,#16
add r1,r2,r1,lsl #2
ldr r0,[r0,r1]
1: bx lr
```

`func_004CEF2C` is 36 bytes. Compare index `r1` against the owner's unsigned
byte count at offset 1628. Return null when out of range; otherwise select a
pointer from the array at offset 1624 and normalize non-null to one.

```asm
ldrb r2,[r0,#1628]
cmp r2,r1
movls r0,#0
bls 1f
ldr r0,[r0,#1624]
ldr r0,[r0,r1,lsl #2]
cmp r0,#0
movne r0,#1
1: bx lr
```

`func_004CF200` is 20 bytes. Copy owner byte 35, zero-extended to a word, to
`*r1`; copy owner byte 42 similarly to `*r2`.

```asm
ldrb r3,[r0,#35]
str r3,[r1]
ldrb r0,[r0,#42]
str r0,[r2]
bx lr
```

## VFP matrix-vector products

The final two 96-byte helpers read a three-float vector from `r2`, multiply
it by a 3-by-3 row-major matrix at `r0`, and write the three-float result to
`r1`. They differ only in the matrix's row stride/layout. All VFP operations,
temporary scalar registers, core scratch registers, and accumulation order
are normative.

`func_004CF6C8` uses 16-byte rows:

```asm
vldmia r2,{s0-s2}
add r3,r0,#16
vldr s3,[r0]
vldr s4,[r0,#16]
vmul.f32 s3,s3,s0
vmla.f32 s3,s4,s1
vldr s4,[r0,#32]
vmla.f32 s3,s4,s2
vstr s3,[r1]
vldr s3,[r0,#4]
vldr s4,[r0,#20]
vmul.f32 s3,s3,s0
vmla.f32 s3,s4,s1
vldr s4,[r0,#36]
vmla.f32 s3,s4,s2
vstr s3,[r1,#4]
vldr s3,[r0,#8]
vmul.f32 s0,s3,s0
vldr s3,[r3,#8]
vmla.f32 s0,s3,s1
vldr s1,[r0,#40]
vmla.f32 s0,s1,s2
vstr s0,[r1,#8]
bx lr
```

`func_004CFDF0` uses tightly packed 12-byte rows and advances `r0` before
the third output:

```asm
vldmia r2,{s0-s2}
vldr s3,[r0]
vldr s4,[r0,#4]
vmul.f32 s3,s3,s0
vmla.f32 s3,s4,s1
vldr s4,[r0,#8]
vmla.f32 s3,s4,s2
vstr s3,[r1]
vldr s3,[r0,#16]
vldr s4,[r0,#20]
vmul.f32 s3,s3,s0
vmla.f32 s3,s4,s1
vldr s4,[r0,#24]
add r0,r0,#32
vmla.f32 s3,s4,s2
vstr s3,[r1,#4]
vldr s3,[r0]
vmul.f32 s0,s3,s0
vldr s3,[r0,#4]
vmla.f32 s0,s3,s1
vldr s1,[r0,#8]
vmla.f32 s0,s1,s2
vstr s0,[r1,#8]
bx lr
```

## Acceptance criteria

- Emit all 23 functions in ARM state with the manifest sizes, totaling 1,128
  executable bytes.
- Emit no calls, literal pools, adjacent words, relocations, or symbolic data.
- Preserve every condition, branch shape, register choice, signedness, stride
  construction, load/store order, and VFP accumulation order shown above.
- Keep implementation derived solely from this specification; target-side
  artifacts remain validation inputs only.
