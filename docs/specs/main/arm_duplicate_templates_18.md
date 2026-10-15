# Probe-verified duplicate ARM templates 18

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated Ghidra 12.0.2 function inventory plus private
  target complete-body grouping, control-flow, data-flow, indirect-call, and
  physical post-body literal-layout analysis.
- Probe toolchain: GNU Arm assembler, linker, and objcopy 2.45.1.20251203 from
  GCC Arm Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document contains no
  target bytes, encoded instruction words, literal values, extracted assets,
  private numeric addresses, implementation source, or proprietary source.

Every function already exact in the current report and every function named by
an earlier or current specification/manifest was excluded before grouping.
This bounded batch contains the next six highest aggregate-byte complete-body
groups: exactly 15 ARM-state functions and 1,328 code bytes.

## Vtable-setting intrusive-chain clear

These ARM-state functions are 116 bytes and identical over their complete
bodies:

- `func_0053F3CC`
- `func_0053F474`

The container pointer is in `r0`. First install the function's named container
vtable identity at offset 0. The container has first, last, sentinel, and count
fields at offsets 4, 8, 12, and 16. Each node has successor and predecessor
links at offsets 4 and 8. If first equals sentinel, return immediately without
saving registers. Otherwise walk successors until sentinel. For each node,
repair both adjacent links when their pointer is non-null, clear both links in
the removed node, replace the container first or last field when it names that
node, and decrement the count. No destructor or allocator is called.

One literal slot immediately follows each body at relative offset 116; the
load starts at body offset 0. The slot supplies the installed container vtable
identity. The two functions' identities are distinct.

```asm
ldr r1, <container-vtable-identity>
str r1, [r0]
ldr r1, [r0, #4]
ldr r12, [r0, #12]
cmp r1, r12
bxeq lr
push {r4, r5}
mov r4, #0
.Lloop:
ldrd r2, [r1, #4]
cmp r3, #0
strne r2, [r3, #4]
cmp r2, #0
str r4, [r1, #8]
strne r3, [r2, #8]
str r4, [r1, #4]
ldr r5, [r0, #4]
cmp r5, r1
streq r2, [r0, #4]
ldr r5, [r0, #8]
cmp r5, r1
streq r3, [r0, #8]
ldr r1, [r0, #16]
cmp r2, r12
sub r1, r1, #1
str r1, [r0, #16]
mov r1, r2
bne .Lloop
pop {r4, r5}
bx lr
```

## Backward intrusive-list clear and recycle

These ARM-state functions are 116 bytes and identical:

- `func_0056E634`
- `func_0056EAA0`

The owner in `r0` has a recycle-list head at offset 4, a circular-list
sentinel at offset 16, and a count at offset 20. A list node has previous and
next links at offsets 0 and 4 and an embedded destructible payload at offset 8.
Begin with `sentinel->previous` and walk backward. At the top of every
iteration reload the owner's sentinel and skip removal if the current node is
that sentinel. Otherwise unlink the current node, decrement the owner count,
call payload vtable slot 0 indirectly with `node + 8`, and push the node onto
the recycle list through node offset 0. Continue from the saved previous link
until it is the original sentinel. The entry-empty path performs no call.

There are no direct calls or literal slots. The indirect payload destructor is
the only call; preserve the top-of-loop sentinel reload and branch structure.

```asm
push {r4, r5, r6, r7, r8, lr}
mov r4, r0
ldr r6, [r0, #16]
ldr r5, [r6]
cmp r5, r6
beq .Lreturn
.Lloop:
ldr r7, [r4, #16]
cmp r5, r7
beq .Ladvance
ldr r3, [r5, #4]
ldr r7, [r5]
add r1, r5, #8
str r7, [r3]
ldm r5, {r0, r2}
str r2, [r0, #4]
ldr r0, [r4, #20]
sub r0, r0, #1
str r0, [r4, #20]
ldr r0, [r5, #8]
ldr r2, [r0]
mov r0, r1
blx r2
ldr r0, [r4, #4]
str r0, [r5]
str r5, [r4, #4]
.Ladvance:
cmp r7, r6
mov r5, r7
bne .Lloop
.Lreturn:
pop {r4, r5, r6, r7, r8, pc}
```

## Four-bit selected floating-point value

These ARM-state functions are 112 bytes and identical:

- `func_0016B184`
- `func_004C2084`

The object is in `r0`; the floating-point result is returned in `s0`. Read the
mask at object offset 4 and examine exactly bit indices 0 through 3. Count the
set bits and separately record whether bit 3 was set. If bit 3 was observed
and the count is nonzero, return the float at
`(object + 4) + 4 * set_bit_count`. Otherwise return the named fallback float.
Preserve the explicit four-iteration loop, the two post-loop tests, and both
separate register-restore paths.

One fallback-float literal slot follows each body at relative offset 112; its
load starts at body offset 104. The fallback literal is equal in both
functions, forming one equality class.

```asm
push {r4, r5, r6, r7}
add r6, r0, #4
mov r12, #0
ldr r4, [r6]
mov r2, #3
mov r0, r12
mov r1, r12
mov r3, #4
mov r5, #1
.Lloop:
tst r4, r5, lsl r1
beq .Lnext
cmp r1, r2
add r0, r0, #1
moveq r12, #1
.Lnext:
subs r3, r3, #1
add r1, r1, #1
bne .Lloop
cmp r12, #0
beq .Lfallback
cmp r0, #0
beq .Lfallback
add r0, r6, r0, lsl #2
vldr s0, [r0]
pop {r4, r5, r6, r7}
bx lr
.Lfallback:
pop {r4, r5, r6, r7}
vldr s0, <fallback-float>
bx lr
```

## Allocated 16-byte typed object initializer

These ARM-state functions are 72 bytes and identical over their bodies:

- `func_002FFE58`
- `func_00304914`
- `func_00306ECC`

The allocator is in `r0` and an opaque payload value is in `r1`. Call the
allocator's vtable slot at byte offset 8 indirectly as
`allocate(allocator, 16, 4)`. Return null unchanged on allocation failure. On
success, store allocator at object offset 4, clear the byte at offset 8,
install the function's named type identity at offset 0, store the original
payload at offset 12, and return the object pointer.

Each function has one type-identity literal slot immediately after the body at
relative offset 72; its load begins at body offset 56. All three identities
are distinct. There are no direct calls.

```asm
push {r4, r5, r6, lr}
mov r4, r0
ldr r0, [r0]
mov r5, r1
mov r2, #4
mov r1, #16
ldr r3, [r0, #8]
mov r0, r4
blx r3
cmp r0, #0
beq .Lreturn
mov r1, #0
str r4, [r0, #4]
strb r1, [r0, #8]
ldr r1, <type-identity>
str r1, [r0]
str r5, [r0, #12]
.Lreturn:
pop {r4, r5, r6, pc}
```

## Single-value or range-list membership predicate

These ARM-state functions are 108 bytes and identical:

- `func_0056D118`
- `func_0056D184`

The descriptor is in `r0`, the unsigned query value is in `r1`, and the
Boolean result is returned in `r0`. Read the mode byte at descriptor offset 4.
Mode 2 returns whether the unsigned halfword at offset 6 equals the query.
Mode 3 walks a circular list whose sentinel is `descriptor + 8` and whose
first cursor is at offset 12. Each node supplies inclusive unsigned halfword
bounds at offsets 8 and 10; advance through the link at node offset 4. Return
true for the first `low <= query <= high` match, otherwise false on reaching
the sentinel. Every other mode returns false. Preserve the conditional loads
and unsigned `lower-or-same` comparisons. There are no calls or literal slots.

```asm
ldrb r2, [r0, #4]
cmp r2, #2
beq .Lsingle
cmp r2, #3
bne .Lfalse
b .Lranges
.Lsingle:
ldrh r0, [r0, #6]
cmp r0, r1
bne .Lfalse
.Ltrue:
mov r0, #1
bx lr
.Lfalse:
mov r0, #0
bx lr
.Lranges:
add r2, r0, #8
ldr r0, [r0, #12]
cmp r0, r2
beq .Lfalse
.Lloop:
ldrh r12, [r0, #8]
add r3, r0, #8
cmp r12, r1
ldrhls r12, [r3, #2]
cmpls r1, r12
bls .Ltrue
ldr r0, [r0, #4]
cmp r0, r2
bne .Lloop
b .Lfalse
```

## Allocated 8-byte typed owner pair

These ARM-state functions are 52 bytes and identical over their bodies:

- `func_002FC7E0`
- `func_002FDEC4`
- `func_003085A0`
- `func_00309AE0`

The allocator is in `r0`. Call allocator vtable slot byte offset 8 indirectly
as `allocate(allocator, 8, 4)`. Return null unchanged on failure. On success,
load the function's named type identity and store the identity and original
allocator together at object offsets 0 and 4 using one two-register store.

Each function has one type-identity literal slot immediately after its body at
relative offset 52; its load begins at body offset 40. All four identities are
distinct. There are no direct calls.

```asm
push {r4, lr}
mov r4, r0
ldr r0, [r0]
mov r2, #4
mov r1, #8
ldr r3, [r0, #8]
mov r0, r4
blx r3
cmp r0, #0
beq .Lreturn
ldr r1, <type-identity>
stm r0, {r1, r4}
.Lreturn:
pop {r4, pc}
```

## Independent full-body probe result

The six semantic templates above were independently assembled as ARM state.
For every listed function, its complete declared body was compared byte for
byte with the corresponding assembled body; post-body literal values were
excluded from body comparison and audited separately by physical slot and
equality class.

| Template | Functions | Bytes each | Aggregate | Full-body result |
| --- | ---: | ---: | ---: | --- |
| Vtable-setting intrusive-chain clear | 2 | 116 | 232 | 2/2 exact |
| Backward intrusive-list clear and recycle | 2 | 116 | 232 | 2/2 exact |
| Four-bit selected floating-point value | 2 | 112 | 224 | 2/2 exact |
| Allocated 16-byte typed object initializer | 3 | 72 | 216 | 3/3 exact |
| Single-value or range-list predicate | 2 | 108 | 216 | 2/2 exact |
| Allocated 8-byte typed owner pair | 4 | 52 | 208 | 4/4 exact |
| **Total** | **15** |  | **1,328** | **15/15 exact** |

Implementation must preserve ARM state, the shown instruction order and
branch topology, the early unsaved return in the first template, conditional
execution in the predicate, the exact multi-register operations, and the
literal slots at their stated physical offsets. Literal identities must be
named symbols/semantic constants; do not encode target values in source.
