# Probe-verified ARM runtime helpers batch 11

## Scope and provenance

This clean-room specification covers six short ARM-state helpers. Their behavior
is expressed only in terms of the public ARM instruction set, AAPCS register
arguments, ordinary object fields, and public integer arithmetic. It contains
no executable words, extracted assets, proprietary literals, or private data
addresses.

The complete textual bodies below were independently assembled for ARM11
MPCore and compared section-for-section with the corresponding target
functions. All six probes were exact, for 336 bytes total. Architectural
semantics follow the Arm Architecture Reference Manual; register argument and
result placement follows AAPCS32.

All helpers execute in ARM state and use little-endian 32-bit words.

## Bounded record-address helper

`func_0012339C` (24 bytes) accepts a base pointer in `r0` and an unsigned index
in `r1`. For index zero or one it returns `base + index * 184`; for every other
index it returns the original base. The observed multiply is deliberately
formed from shifted adds:

```asm
cmp r1, #2
bhs 1f
rsb r2, r1, r1, lsl #3
add r1, r2, r1, lsl #4
add r0, r0, r1, lsl #3
1:
bx lr
```

## Null-safe virtual tail call

`func_00123F14` (24 bytes) returns immediately when `r0` is null. Otherwise it
loads the object's first word as a dispatch-table pointer and tail-calls the
entry at byte offset 48. The original object pointer remains in `r0`:

```asm
cmp r0, #0
beq 1f
ldr r1, [r0]
ldr r1, [r1, #48]
bx r1
1:
bx lr
```

## Atomic high-byte flag update

`func_00125DEC` (60 bytes) treats `r0 + 4` as a nullable pointer field. If that
field is null, it returns without an exclusive access. Otherwise it repeatedly
updates the pointed-to 32-bit word until the exclusive store succeeds. Bit zero
of the word's most-significant byte is set when `r1` is nonzero and cleared
when `r1` is zero; every other bit is preserved. The pointer field is reloaded
for each retry. No barrier or explicit monitor clear is added:

```asm
ldr r2, [r0, #4]
cmp r2, #0
beq 2f
1:
ldr r3, [r0, #4]
cmp r1, #0
ldrex r2, [r3]
lsr r12, r2, #24
orrne r12, r12, #1
biceq r12, r12, #1
bic r2, r2, #0xff000000
orr r2, r2, r12, lsl #24
strex r12, r2, [r3]
cmp r12, #0
bne 1b
2:
bx lr
```

## Bounded unsigned cursor helpers

The next two helpers operate on `{ uint32_t limit; uint32_t cursor; }` at `r0`.
Their comparison choreography implements an unsigned clamp even though the
final branch is spelled with the signed `lt` condition: `sbcs` converts the
preceding subtraction's no-borrow state into either zero or all ones.

`func_00126A64` (96 bytes) first interprets `r2` as a cursor-reset mode: zero
sets the cursor to zero, one leaves it unchanged, two sets it to the limit, and
other values leave it unchanged. If unsigned `r1` is nonzero, it adds it to the
cursor modulo 2^32 and stores the lesser unsigned value of that candidate and
the limit. It has no specified return value. Preserve the otherwise redundant
comparison and conditional move:

```asm
cmp r2, #0
push {r4}
beq 1f
cmp r2, #1
beq 2f
cmp r2, #2
ldreq r2, [r0]
bne 2f
1:
str r2, [r0, #4]
2:
cmp r1, #0
beq 4f
ldr r3, [r0, #4]
mov r2, #0
add r3, r3, r1
ldr r1, [r0]
subs r4, r1, r3
sbcs r12, r2, r2
blt 3f
cmp r2, #0
movlt r1, #0
movge r1, r3
3:
str r1, [r0, #4]
4:
pop {r4}
bx lr
```

`func_00126AC4` (68 bytes) leaves the cursor unchanged when `r1` is zero.
Otherwise it adds unsigned `r1` modulo 2^32, clamps the candidate to the limit
with the same unsigned comparison idiom, stores the result, and returns the
result in `r0`:

```asm
cmp r1, #0
push {r4}
beq 2f
ldr r3, [r0, #4]
mov r2, #0
add r1, r1, r3
ldr r3, [r0]
subs r4, r3, r1
sbcs r12, r2, r2
movlt r1, r3
blt 1f
cmp r2, #0
movlt r1, #0
1:
str r1, [r0, #4]
2:
ldr r0, [r0, #4]
pop {r4}
bx lr
```

## Multiword multiply limb helper

`func_00131940` (64 bytes) is a register-only multiword multiplication helper.
It accepts four 32-bit limbs in `r0` through `r3`, forms cross-products with
`umull`, `umlal`, and `mla`, sign-extends the limb in `r1` for one cross term,
and returns its selected 64-bit result in `r1:r0`. Its observable contract is
the exact public-instruction expression below; `r4` through `r6` are preserved
and `r2`, `r12`, and condition flags are scratch:

```asm
push {r4, r5, r6}
umull r4, r6, r1, r2
asr r5, r1, #31
mov r12, #0
mla r5, r5, r2, r6
mla r12, r1, r12, r5
umlal r4, r12, r3, r0
umull r2, r0, r0, r2
umull r1, r2, r1, r3
mov r2, #0
adds r0, r0, r2
adc r1, r1, r2
adds r0, r0, r4
pop {r4, r5, r6}
adc r1, r1, r12
bx lr
```
