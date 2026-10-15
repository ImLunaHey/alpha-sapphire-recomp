# Probe-verified duplicate ARM container templates 13

## Scope and provenance

- Target: `AS_EUR_REV2`, the independently verified executable described in
  `docs/PROVENANCE.md`.
- Analysis date: 2026-10-16.
- Evidence: the evidence-gated Ghidra 12.0.2 function inventory plus local
  control-flow and data-flow analysis of the private target executable.
- Probe toolchain: GNU Arm assembler, linker, and objcopy 2.45.1.20251203 from
  GCC Arm Embedded 15.2.Rel1.
- Clean-room role: analysis/specification only. This document records behavior
  and neutral ABI/code-generation facts. It contains no target bytes, encoded
  instruction words, extracted assets, literal values, or proprietary source.

The inventory was grouped by complete-body digest after excluding every
already specified function and every function reported as an exact match.
Candidates were ARM or Thumb functions of 16 through 512 bytes whose identical
group represented at least 256 bytes. This bounded batch selects the three
highest-payoff remaining groups: 11 ARM functions and 3,412 target code bytes.

## Range erase template A

Each function below is ARM-state, 320 bytes, and has the same complete body.
The two named callees are specific to each copy:

| Function | subtree recycler | single-node erase |
| --- | --- | --- |
| `func_00550394` | `func_005504D4` | `func_0054FD38` |
| `func_00550B6C` | `func_00550CAC` | `func_00550510` |
| `func_0055C7F8` | `func_0055C938` | `func_0055C19C` |
| `func_00567560` | `func_005676A0` | `func_00566F04` |
| `func_00569818` | `func_00569958` | `func_005691BC` |

All five callers and all ten named callees are ARM-state functions in the
evidence-gated inventory. In every caller, the recycler call begins at byte
offset 92 and the single-node erase call begins at byte offset 304. Resolving
each target-side ARM call displacement lands exactly on the named callee's
inventoried entry point.

The routine receives, in `r0` through `r3`, an output iterator slot, an owner,
a mutable first-iterator slot, and a last-iterator slot. The owner has a free
list at offset 4, a sentinel pointer at offset 16, and an element count at
offset 20. A node has its parent at offset 4, left child at offset 8, and right
child at offset 12. The sentinel's left field is the first iterator and the
sentinel itself is the end iterator.

The output is initialized to the sentinel. If the requested range is the whole
nonempty container, recycle the root forest with the named subtree recycler,
linking recycled nodes through offset 12 into the owner's free list, reset the
sentinel's left and right fields to itself and parent to null, clear the count,
and return the sentinel through the output slot. Otherwise, until first equals
last, compute the in-order successor into the mutable first slot, call the
named single-node erase routine with private output storage and the original
node, and copy that routine's output to the caller's output slot. The successor
walk takes the right child then its leftmost descendant, or climbs parents
while leaving a right edge. Valid input is a well-formed finite tree using the
listed fields and valid writable iterator slots.

Exact semantic ARM template; substitute the named callees from the table:

```asm
push {r4, r5, r6, r7, lr}
sub sp, sp, #12
mov r7, r0
ldr r0, [r1, #16]
mov r5, r1
mov r4, r2
str r0, [r7]
ldr r0, [r1, #16]
ldr r2, [r2]
mov r6, r3
ldr r1, [r0, #8]
cmp r2, r1
ldreq r1, [r6]
cmpeq r1, r0
bne .Literate
ldr r1, [r5, #20]
cmp r1, #0
beq .Literate
ldr r4, [r0, #4]
cmp r4, #0
beq .Lreset
.Lrecycle_loop:
ldr r1, [r4, #12]
mov r0, r5
bl <subtree-recycler>
ldr r0, [r5, #4]
ldr r2, [r4, #8]
str r0, [r4, #12]
str r4, [r5, #4]
movs r4, r2
bne .Lrecycle_loop
.Lreset:
ldr r1, [r5, #16]
mov r0, #0
str r1, [r1, #8]
ldr r1, [r5, #16]
str r0, [r1, #4]
ldr r1, [r5, #16]
str r1, [r1, #12]
str r0, [r5, #20]
ldr r0, [r5, #16]
str r0, [r7]
.Lreturn:
add sp, sp, #12
pop {r4, r5, r6, r7, pc}
.Literate:
ldr r0, [r6]
ldr r2, [r4]
cmp r2, r0
beq .Lreturn
ldr r1, [r2, #12]
mov r0, r2
cmp r1, #0
movne r0, r1
strne r1, [r4]
beq .Lclimb
.Ldescend:
ldr r0, [r0, #8]
cmp r0, #0
strne r0, [r4]
bne .Ldescend
b .Lerase
.Lclimb:
mov r1, r0
ldr r0, [r2, #4]
ldr r3, [r0, #12]
cmp r1, r3
bne .Lclimb_done
.Lclimb_loop:
mov r1, r0
str r0, [r4]
ldr r0, [r0, #4]
ldr r3, [r0, #12]
cmp r1, r3
beq .Lclimb_loop
.Lclimb_done:
ldr r1, [r4]
ldr r1, [r1, #12]
cmp r1, r0
strne r0, [r4]
.Lerase:
str r2, [sp, #4]
add r2, sp, #4
mov r1, r5
mov r0, sp
bl <single-node-erase>
ldr r0, [sp]
str r0, [r7]
b .Literate
```

## Range erase template B

Each function below is ARM-state, 312 bytes, and has the same complete body:

| Function | subtree recycler | single-node erase |
| --- | --- | --- |
| `func_00552144` | `func_0055227C` | `func_00551AE4` |
| `func_00559304` | `func_0055943C` | `func_00558CA4` |
| `func_0055D3B0` | `func_0055D4E8` | `func_0055CD50` |

All three callers and all six named callees are ARM-state functions in the
evidence-gated inventory. In every caller, the recycler call begins at byte
offset 92 and the single-node erase call begins at byte offset 296. Resolving
each target-side ARM call displacement lands exactly on the named callee's
inventoried entry point.

Its interface, field layout, full-range fast path, and externally visible
behavior are the same as template A. The smaller body uses different register
choreography for the successor walk and one free-list load, which must be
preserved exactly.

```asm
push {r4, r5, r6, r7, lr}
sub sp, sp, #12
mov r7, r0
ldr r0, [r1, #16]
mov r5, r1
mov r4, r2
str r0, [r7]
ldr r0, [r1, #16]
ldr r2, [r2]
mov r6, r3
ldr r1, [r0, #8]
cmp r2, r1
ldreq r1, [r6]
cmpeq r1, r0
bne .Literate
ldr r1, [r5, #20]
cmp r1, #0
beq .Literate
ldr r4, [r0, #4]
cmp r4, #0
beq .Lreset
.Lrecycle_loop:
ldr r1, [r4, #12]
mov r0, r5
bl <subtree-recycler>
ldr r1, [r5, #4]
ldr r2, [r4, #8]
str r1, [r4, #12]
str r4, [r5, #4]
movs r4, r2
bne .Lrecycle_loop
.Lreset:
ldr r1, [r5, #16]
mov r0, #0
str r1, [r1, #8]
ldr r1, [r5, #16]
str r0, [r1, #4]
ldr r1, [r5, #16]
str r1, [r1, #12]
str r0, [r5, #20]
ldr r0, [r5, #16]
str r0, [r7]
.Lreturn:
add sp, sp, #12
pop {r4, r5, r6, r7, pc}
.Literate:
ldr r0, [r6]
ldr r2, [r4]
cmp r2, r0
beq .Lreturn
ldr r0, [r2, #12]
mov r1, r2
cmp r0, #0
beq .Lclimb
.Ldescend:
str r0, [r4]
ldr r0, [r0, #8]
cmp r0, #0
bne .Ldescend
b .Lerase
.Lclimb:
ldr r0, [r2, #4]
mov r3, r1
ldr r1, [r0, #12]
cmp r3, r1
bne .Lclimb_done
.Lclimb_loop:
mov r1, r0
str r0, [r4]
ldr r0, [r0, #4]
ldr r3, [r0, #12]
cmp r1, r3
beq .Lclimb_loop
.Lclimb_done:
ldr r1, [r4]
ldr r1, [r1, #12]
cmp r1, r0
strne r0, [r4]
.Lerase:
str r2, [sp, #4]
add r2, sp, #4
mov r1, r5
mov r0, sp
bl <single-node-erase>
ldr r0, [sp]
str r0, [r7]
b .Literate
```

## Four-byte vector append template

These ARM-state functions are 292 bytes and identical over their complete
inventoried bodies:

- `func_00540E44`
- `func_00540F68`
- `func_0054116C`

The routine receives a vector-like object in `r0` and a pointer to one 32-bit
element in `r1`. Object offsets 0, 4, 8, and 12 are respectively allocator,
begin, end, and packed capacity/mode. The low 30 bits are capacity and the top
two bits are mode. If capacity is exhausted, choose capacity one when zero or
twice the old capacity otherwise. Growth is permitted only with a non-null
allocator and mode `01`. Call allocator vtable slot 8 with the allocator,
new byte size, and alignment 32. Copy the old half-open element range, free a
non-null old allocation through vtable slot 12, install the new range, and
preserve the mode bits while replacing capacity. Allocation failure returns
zero without appending. Otherwise store the input element when end is non-null,
advance end by four, and return one. The indirect allocator calls and even the
null tests inside the copy/append paths are part of the exact template.

```asm
push {r4, r5, r6, r7, r8, r9, r10, lr}
mov r4, r0
mov r8, r1
add r1, r4, #8
ldr r3, [r0, #4]
ldm r1, {r1, r2}
mov r0, #1
sub r3, r1, r3
bic r1, r2, #0xc0000000
cmp r1, r3, asr #2
bgt .Lappend
cmp r1, #0
lslne r6, r1, #1
moveq r6, #1
bic r1, r2, #0xc0000000
cmp r1, r6
mov r9, #1
bge .Lappend
ldr r0, [r4]
mov r7, #0
cmp r0, #0
beq .Lfail
and r1, r2, #0xc0000000
cmp r1, #0x40000000
bne .Lfail
ldr r1, [r0]
mov r2, #32
ldr r3, [r1, #8]
lsl r1, r6, #2
blx r3
movs r5, r0
beq .Lfail
add r0, r4, #4
ldm r0, {r0, r2}
cmp r0, r2
movne r1, r5
beq .Lcopy_done
.Lcopy:
cmp r1, #0
ldrne r12, [r0]
add r0, r0, #4
strne r12, [r1]
cmp r0, r2
add r1, r1, #4
bne .Lcopy
ldr r0, [r4, #8]
ldr r1, [r4, #4]
sub r0, r0, r1
asr r7, r0, #2
.Lcopy_done:
ldr r1, [r4, #4]
cmp r1, #0
beq .Linstall
ldr r0, [r4]
ldr r2, [r0]
ldr r2, [r2, #12]
blx r2
.Linstall:
add r0, r5, r7, lsl #2
str r0, [r4, #8]
str r5, [r4, #4]
ldr r0, [r4, #12]
and r0, r0, #0xc0000000
orr r0, r0, r6
str r0, [r4, #12]
mov r0, r9
.Lappend:
ldr r1, [r4, #8]
cmp r1, #0
ldrne r2, [r8]
strne r2, [r1]
ldr r1, [r4, #8]
add r1, r1, #4
str r1, [r4, #8]
pop {r4, r5, r6, r7, r8, r9, r10, pc}
.Lfail:
mov r0, r7
pop {r4, r5, r6, r7, r8, r9, r10, pc}
```

## Probe result

A symbolic ARM source instantiated each template. Each range-erase instance
used only its named recycler and erase symbols; the linker resolved those names
for the isolated comparison. All 11 linked probe bodies matched their complete
target intervals exactly. The scan also verified each entry's mode and size,
group-wide complete-body identity, absence from all earlier specifications,
and non-exact status in the report used for selection.

No clean-room implementation is included in this analysis document.
